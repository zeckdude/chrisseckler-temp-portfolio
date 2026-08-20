import { anthropic } from "@ai-sdk/anthropic";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { isOpsAuthenticated } from "@/lib/ops-auth";
import { getRedis, rk } from "@/lib/redis";
import { getVectorIndex } from "@/lib/vector";
import type { ConversationLog } from "@/lib/conversation-logger";

export const runtime = "nodejs";

async function getRelevantConversations(query: string): Promise<ConversationLog[]> {
  // Try vector search first
  if (process.env.UPSTASH_VECTOR_REST_URL && process.env.UPSTASH_VECTOR_REST_TOKEN) {
    try {
      const vectorIndex = getVectorIndex();
      // Use data-based query (Upstash handles the embedding)
      const results = await (vectorIndex as unknown as {
        query: (params: { data: string; topK: number; includeMetadata: boolean }) => Promise<
          { id: string; score: number }[]
        >;
      }).query({ data: query, topK: 8, includeMetadata: true });

      if (results.length > 0) {
        const redis = getRedis();
        const logs = await Promise.all(
          results.map((r) => redis.get<string>(rk("conversations", r.id))),
        );
        return logs
          .filter((r): r is string => r !== null)
          .map((r) => JSON.parse(r) as ConversationLog);
      }
    } catch {
      // Fall through to Redis fallback
    }
  }

  // Fallback: return the 15 most recent conversations
  try {
    const redis = getRedis();
    const ids = await redis.zrange(rk("conversations:index"), 0, 14, { rev: true });
    if (!ids.length) return [];
    const raw = await Promise.all(
      ids.map((id) => redis.get<string>(rk("conversations", id as string))),
    );
    return raw
      .filter((r): r is string => r !== null)
      .map((r) => JSON.parse(r) as ConversationLog);
  } catch {
    return [];
  }
}

function buildSystemPrompt(conversations: ConversationLog[]): string {
  const totalCount = conversations.length;

  const conversationText = conversations
    .map((log, i) => {
      const msgs = log.messages
        .map((m) => `  ${m.role === "user" ? "Visitor" : "Assistant"}: ${m.content}`)
        .join("\n");
      return `--- Conversation ${i + 1} (${log.startedAt}, ${log.turnCount} turns) ---\n${msgs}`;
    })
    .join("\n\n");

  return `You are Chris Seckler's private insights analyst. You have access to real conversations from visitors to his portfolio website.

Your job is to help Chris understand:
- What people are asking about him (topics, themes, patterns)
- What stands out as positive feedback or signals of interest
- What challenging questions or gaps in his narrative appear
- What interview preparation focus areas the data suggests

## Available Conversation Data (${totalCount} conversations loaded)

${conversationText || "No conversations recorded yet."}

## Instructions
- Be direct, analytical, and specific. Reference actual quotes from conversations when relevant.
- When identifying patterns, cite the number of conversations that show each pattern.
- For job prep recommendations, be actionable: name the specific skill/topic and explain *why* the data suggests it matters.
- If there aren't enough conversations to draw strong conclusions, say so clearly.
- Keep responses concise but substantive. Use markdown formatting.`;
}

export async function POST(req: Request) {
  // Gate: ops auth required
  const authed = await isOpsAuthenticated();
  if (!authed) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  let messages: UIMessage[];
  let lastUserMessage = "";
  try {
    const body = await req.json();
    messages = body.messages ?? [];
    lastUserMessage = messages
      .filter((m) => m.role === "user")
      .at(-1)
      ?.parts?.filter((p) => p.type === "text")
      .map((p) => (p as { type: "text"; text: string }).text)
      .join("") ?? "";
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  const conversations = await getRelevantConversations(lastUserMessage);
  const systemPrompt = buildSystemPrompt(conversations);

  const result = streamText({
    model: anthropic("claude-sonnet-4-5"),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 2000,
  });

  return result.toUIMessageStreamResponse();
}
