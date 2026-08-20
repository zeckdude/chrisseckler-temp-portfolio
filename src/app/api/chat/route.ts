import { anthropic } from "@ai-sdk/anthropic";
import {
  convertToModelMessages,
  streamText,
  tool,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { buildSystemPrompt } from "@/lib/chat-system-prompt";
import { logConversation, type ConversationMessage } from "@/lib/conversation-logger";
import { getRedis, rk } from "@/lib/redis";

export const runtime = "nodejs";

const MAX_TURNS = 40; // matches client-side USER_TURN_LIMIT × 2 (user + assistant)
const RATE_LIMIT_PER_HOUR = 30;

async function getRateLimiter() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  const { Ratelimit } = await import("@upstash/ratelimit");
  const { Redis } = await import("@upstash/redis");
  return new Ratelimit({
    redis: new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    }),
    limiter: Ratelimit.slidingWindow(RATE_LIMIT_PER_HOUR, "1 h"),
    analytics: true,
  });
}

const DAILY_TTL_SECONDS = 90 * 24 * 60 * 60; // 90 days
const HOURLY_TTL_SECONDS = 14 * 24 * 60 * 60; // 14 days

async function trackUsage(params: {
  inputTokens: number;
  outputTokens: number;
  model: string;
  ip: string;
}) {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return;
  try {
    const redis = getRedis();
    const total = params.inputTokens + params.outputTokens;
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const hour = now.getUTCHours().toString().padStart(2, "0");
    // Anonymize IP for storage: last octet / last IPv6 group
    const safeIp = params.ip.replace(/\.\d+$/, ".x").replace(/:[^:]+$/, ":x");

    const dailyRequestKey = rk("chat:requests:daily", today);
    const dailyTokenKey = rk("chat:tokens:daily", today);
    const dailyInputKey = rk("chat:tokens:input:daily", today);
    const dailyOutputKey = rk("chat:tokens:output:daily", today);
    const hourlyRequestKey = rk("chat:requests:hourly", today, hour);
    const hourlyTokenKey = rk("chat:tokens:hourly", today, hour);

    await Promise.all([
      redis.incr(rk("chat:requests:total")),
      redis.incr(dailyRequestKey),
      redis.incrby(rk("chat:tokens:total"), total),
      redis.incrby(dailyTokenKey, total),

      redis.incrby(rk("chat:tokens:input:total"), params.inputTokens),
      redis.incrby(rk("chat:tokens:output:total"), params.outputTokens),
      redis.incrby(dailyInputKey, params.inputTokens),
      redis.incrby(dailyOutputKey, params.outputTokens),

      redis.incr(hourlyRequestKey),
      redis.incrby(hourlyTokenKey, total),

      redis.incr(rk("chat:ip", safeIp, "requests:total")),
      redis.incrby(rk("chat:ip", safeIp, "tokens:input:total"), params.inputTokens),
      redis.incrby(rk("chat:ip", safeIp, "tokens:output:total"), params.outputTokens),
      redis.zincrby(rk("chat:ip:leaderboard"), total, safeIp),

      redis.incrby(rk("chat:model", params.model, "tokens:input:total"), params.inputTokens),
      redis.incrby(rk("chat:model", params.model, "tokens:output:total"), params.outputTokens),
      redis.incr(rk("chat:model", params.model, "requests:total")),
      redis.sadd(rk("chat:models:seen"), params.model),
    ]);

    await Promise.all([
      redis.expire(dailyRequestKey, DAILY_TTL_SECONDS),
      redis.expire(dailyTokenKey, DAILY_TTL_SECONDS),
      redis.expire(dailyInputKey, DAILY_TTL_SECONDS),
      redis.expire(dailyOutputKey, DAILY_TTL_SECONDS),
      redis.expire(hourlyRequestKey, HOURLY_TTL_SECONDS),
      redis.expire(hourlyTokenKey, HOURLY_TTL_SECONDS),
    ]);

    const currentMax = await redis.get<number>(rk("chat:tokens:max-context"));
    if (total > (currentMax ?? 0)) {
      await redis.set(rk("chat:tokens:max-context"), total);
    }
  } catch {
    // non-fatal — don't block the response
  }
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response("ANTHROPIC_API_KEY is not configured.", { status: 500 });
  }

  // Rate limiting
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "anonymous";
  const limiter = await getRateLimiter();
  if (limiter) {
    const { success, remaining } = await limiter.limit(ip);
    if (!success) {
      return new Response(
        JSON.stringify({ error: "rate_limited", message: "Too many requests. Please try again in an hour." }),
        { status: 429, headers: { "Content-Type": "application/json" } },
      );
    }
    console.log(`[chat] ip=${ip} remaining=${remaining}`);
  }

  let messages: UIMessage[];
  let sessionId: string = "unknown";
  try {
    const body = await req.json();
    messages = body.messages ?? [];
    sessionId = body.sessionId ?? "unknown";
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  if (messages.length > MAX_TURNS) {
    return new Response(
      JSON.stringify({ error: "max_turns", message: "Conversation too long. Start a new chat." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const requestStartedAt = new Date();

  const result = streamText({
    model: anthropic("claude-haiku-4-5"),
    system: buildSystemPrompt(),
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 1500,
    tools: {
      filterProjects: tool({
        description:
          "Filter the projects grid to show only matching projects. All fields are optional — only specify the dimensions you want to filter on. Unspecified dimensions show all values. Dimensions are AND-ed; within each dimension it is OR. Tech and company values must match exactly as they appear in the project data. Use `slugs` when the user wants to see specific named projects — it overrides all other dimensions and shows exactly those entries.",
        inputSchema: z.object({
          slugs: z
            .array(z.string())
            .optional()
            .describe("Show only specific projects by slug. Use this when the user mentions project names. Overrides all other filter dimensions. E.g. ['aerospike-cloud-console', 'exact-recall']."),
          badges: z
            .array(z.enum(["professional", "personal", "freelance"]))
            .optional()
            .describe("Filter by employment type. E.g. ['professional'] for employed projects."),
          techStack: z
            .array(z.string())
            .optional()
            .describe("Filter by tech stack. Match exact strings from project data, e.g. ['React', 'TypeScript', 'Next.js']."),
          companies: z
            .array(z.string())
            .optional()
            .describe("Filter by company name. Match exact strings, e.g. ['Aerospike', 'Toucan']."),
        }),
        execute: async (input) => input,
      }),

      suggestNavigation: tool({
        description:
          "Suggest a navigation link when the visitor is asking about something they can view on a specific page. Call this to surface a clickable button. Pages: /projects (all projects), /projects/[slug] (specific project detail — use the slug field from project data), /about (Chris's background & experience), /contact (get in touch). Call this alongside your text answer, not instead of it.",
        inputSchema: z.object({
          links: z
            .array(
              z.object({
                label: z.string().describe("Short button label, e.g. 'View Projects' or 'See Aerospike Case Study'"),
                url: z.string().describe("Internal path, e.g. '/projects' or '/projects/aerospike-cloud-console'"),
              }),
            )
            .min(1),
        }),
        execute: async ({ links }) => ({ links }),
      }),
    },
    onFinish: ({ usage, text }) => {
      const inputTokens = usage?.inputTokens ?? 0;
      const outputTokens = usage?.outputTokens ?? 0;
      const total = inputTokens + outputTokens;
      console.log(
        `[chat] tokens input=${inputTokens} output=${outputTokens} total=${total}`,
      );
      void trackUsage({ inputTokens, outputTokens, model: "claude-haiku-4-5", ip });

      // Build conversation log from input messages + final assistant response
      const conversationMessages: ConversationMessage[] = [];
      for (const msg of messages) {
        if (msg.role === "user") {
          const textContent = msg.parts
            ?.filter((p) => p.type === "text")
            .map((p) => (p as { type: "text"; text: string }).text)
            .join("") ?? "";
          if (textContent) conversationMessages.push({ role: "user", content: textContent });
        } else if (msg.role === "assistant") {
          const textContent = msg.parts
            ?.filter((p) => p.type === "text")
            .map((p) => (p as { type: "text"; text: string }).text)
            .join("") ?? "";
          if (textContent) conversationMessages.push({ role: "assistant", content: textContent });
        }
      }
      // Append this turn's assistant response
      if (text) conversationMessages.push({ role: "assistant", content: text });

      void logConversation({
        sessionId,
        messages: conversationMessages,
        ip,
        tokenCount: inputTokens + outputTokens,
        startedAt: requestStartedAt,
      });
    },
  });

  return result.toUIMessageStreamResponse();
}
