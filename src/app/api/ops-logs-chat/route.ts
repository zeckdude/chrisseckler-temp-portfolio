import { anthropic } from "@ai-sdk/anthropic";
import { convertToModelMessages, streamText, tool, type UIMessage } from "ai";
import { z } from "zod";
import { isOpsAuthenticated } from "@/lib/ops-auth";
import { getRedis, rk } from "@/lib/redis";
import { getVectorIndex } from "@/lib/vector";
import type { ConversationLog } from "@/lib/conversation-logger";

export const runtime = "nodejs";

async function searchConversations(query: string): Promise<ConversationLog[]> {
  if (process.env.UPSTASH_VECTOR_REST_URL && process.env.UPSTASH_VECTOR_REST_TOKEN) {
    try {
      const vectorIndex = getVectorIndex();
      const results = await (vectorIndex as unknown as {
        query: (params: { data: string; topK: number; includeMetadata: boolean }) => Promise<
          { id: string; score: number }[]
        >;
      }).query({ data: query, topK: 10, includeMetadata: true });

      if (results.length > 0) {
        const redis = getRedis();
        const logs = await Promise.all(
          results.map((r) => redis.get<string>(rk("conversations", r.id))),
        );
        return logs
          .filter((r): r is string => r !== null)
          .map((r) => JSON.parse(r) as ConversationLog);
      }
    } catch { /* fall through */ }
  }

  // Fallback
  try {
    const redis = getRedis();
    const ids = await redis.zrange(rk("conversations:index"), 0, 19, { rev: true });
    if (!ids.length) return [];
    const raw = await Promise.all(
      ids.map((id) => redis.get<string>(rk("conversations", id as string))),
    );
    const all = raw.filter((r): r is string => r !== null).map((r) => JSON.parse(r) as ConversationLog);
    // Simple text filter
    if (query.length > 2) {
      const q = query.toLowerCase();
      return all.filter((l) => l.messages.some((m) => m.content.toLowerCase().includes(q)));
    }
    return all;
  } catch {
    return [];
  }
}

export async function POST(req: Request) {
  const authed = await isOpsAuthenticated();
  if (!authed) return Response.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  let messages: UIMessage[];
  let currentLogId: string | null = null;
  let currentLog: ConversationLog | null = null;

  try {
    const body = await req.json();
    messages = body.messages ?? [];
    currentLogId = body.currentLogId ?? null;
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  // If a specific log is open, fetch it for context
  if (currentLogId) {
    try {
      const redis = getRedis();
      const raw = await redis.get<string>(rk("conversations", currentLogId));
      if (raw) currentLog = JSON.parse(raw) as ConversationLog;
    } catch { /* ignore */ }
  }

  const lastUserMessage = messages
    .filter((m) => m.role === "user")
    .at(-1)
    ?.parts?.filter((p) => p.type === "text")
    .map((p) => (p as { type: "text"; text: string }).text)
    .join("") ?? "";

  const contextLog = currentLog
    ? `## Currently Viewing\nConversation from ${currentLog.startedAt} (${currentLog.turnCount} turns):\n${currentLog.messages.map((m) => `  ${m.role === "user" ? "Visitor" : "Assistant"}: ${m.content}`).join("\n")}\n\n`
    : "";

  const systemPrompt = `You are a log explorer assistant for Chris Seckler's portfolio ops dashboard. You help Chris search, filter, and understand his visitor conversation logs.

${contextLog}## Your Capabilities
- Search and retrieve specific conversations using the \`searchLogs\` tool
- Filter the visible log list using \`filterLogs\` tool — this updates what the user sees on screen
- Analyze patterns across conversations
- When a specific log is shown above under "Currently Viewing", answer questions about it without needing additional context

## Instructions
- When the user asks to "show" or "find" conversations matching criteria, use the \`filterLogs\` tool to update the UI
- When the user asks a question about the currently viewed log, answer directly from the context above
- Be specific and reference actual message content when relevant
- Keep responses concise`;

  const result = streamText({
    model: anthropic("claude-sonnet-4-5"),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 1500,
    tools: {
      searchLogs: tool({
        description: "Search conversation logs by semantic query. Returns matching conversations.",
        inputSchema: z.object({
          query: z.string().describe("What to search for in conversations"),
        }),
        execute: async ({ query }) => {
          const results = await searchConversations(query);
          return {
            count: results.length,
            conversations: results.map((log) => ({
              id: log.id,
              startedAt: log.startedAt,
              turnCount: log.turnCount,
              firstMessage: log.messages.find((m) => m.role === "user")?.content?.slice(0, 150) ?? "",
            })),
          };
        },
      }),

      filterLogs: tool({
        description: "Filter the visible log list to show specific conversations matching criteria. This updates the UI the user is looking at.",
        inputSchema: z.object({
          query: z.string().optional().describe("Text to search for"),
          minTurns: z.number().optional().describe("Minimum number of user turns"),
          maxTurns: z.number().optional().describe("Maximum number of user turns"),
          dateFrom: z.string().optional().describe("ISO date string start range"),
          dateTo: z.string().optional().describe("ISO date string end range"),
          bookmarked: z.boolean().optional().describe("Show only bookmarked conversations"),
          reason: z.string().describe("Brief human-readable explanation of what this filter shows"),
        }),
        execute: async (input) => input,
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
