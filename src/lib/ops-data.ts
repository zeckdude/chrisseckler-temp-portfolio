import { getRedis, rk, envPrefix } from "./redis";
import { calcCost, MODEL_PRICING, getStoredPricing, type StoredPricing } from "./ai-pricing";

export type { StoredPricing };

export interface UsageStats {
  requestsTotal: number;
  requestsToday: number;
  tokensTotal: number;
  tokensToday: number;
  conversationsTotal: number;
}

export interface EnvStatus {
  name: string;
  set: boolean;
  description: string;
}

export async function getUsageStats(): Promise<UsageStats> {
  try {
    const redis = getRedis();
    const today = new Date().toISOString().split("T")[0];

    const [requestsTotal, requestsToday, tokensTotal, tokensToday, conversationsTotal] =
      await Promise.all([
        redis.get<number>(rk("chat:requests:total")),
        redis.get<number>(rk("chat:requests:daily", today)),
        redis.get<number>(rk("chat:tokens:total")),
        redis.get<number>(rk("chat:tokens:daily", today)),
        redis.get<number>(rk("conversations:total")),
      ]);

    return {
      requestsTotal: requestsTotal ?? 0,
      requestsToday: requestsToday ?? 0,
      tokensTotal: tokensTotal ?? 0,
      tokensToday: tokensToday ?? 0,
      conversationsTotal: conversationsTotal ?? 0,
    };
  } catch {
    return {
      requestsTotal: 0,
      requestsToday: 0,
      tokensTotal: 0,
      tokensToday: 0,
      conversationsTotal: 0,
    };
  }
}

export function getEnvStatus(): EnvStatus[] {
  return [
    { name: "ANTHROPIC_API_KEY", set: !!process.env.ANTHROPIC_API_KEY, description: "AI chat backend" },
    { name: "UPSTASH_REDIS_REST_URL", set: !!process.env.UPSTASH_REDIS_REST_URL, description: "Rate limiting & usage tracking" },
    { name: "UPSTASH_REDIS_REST_TOKEN", set: !!process.env.UPSTASH_REDIS_REST_TOKEN, description: "Rate limiting & usage tracking" },
    { name: "UPSTASH_VECTOR_REST_URL", set: !!process.env.UPSTASH_VECTOR_REST_URL, description: "Conversation RAG embeddings" },
    { name: "UPSTASH_VECTOR_REST_TOKEN", set: !!process.env.UPSTASH_VECTOR_REST_TOKEN, description: "Conversation RAG embeddings" },
    { name: "ADMIN_PASSWORD", set: !!process.env.ADMIN_PASSWORD, description: "Ops page access" },
    { name: "CRON_SECRET", set: !!process.env.CRON_SECRET, description: "Vercel cron auth for weekly price refresh" },
    { name: "NEXT_PUBLIC_POSTHOG_KEY", set: !!process.env.NEXT_PUBLIC_POSTHOG_KEY, description: "Analytics & session replay" },
    { name: "NEXT_PUBLIC_POSTHOG_HOST", set: !!process.env.NEXT_PUBLIC_POSTHOG_HOST, description: "PostHog host (optional)" },
    { name: "POSTHOG_PERSONAL_API_KEY", set: !!process.env.POSTHOG_PERSONAL_API_KEY, description: "Ops page live PostHog queries" },
    { name: "POSTHOG_PROJECT_ID", set: !!process.env.POSTHOG_PROJECT_ID, description: "PostHog project id (566729)" },
  ];
}

/** AI config constants surfaced to the ops page */
export const AI_CONFIG = {
  model: "claude-haiku-4-5",
  maxOutputTokens: 1500,
  maxTurns: 40,
  userTurnLimit: 20,
  rateLimitPerHour: 30,
  minTurnsToLog: 2,
  env: envPrefix(),
};

/** Get last 7 days of conversation activity from Redis */
export async function getConversationActivity(): Promise<{ date: string; count: number }[]> {
  try {
    const redis = getRedis();
    const days: { date: string; count: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];

      // Count conversations stored in that day's time range
      const startOfDay = new Date(dateStr + "T00:00:00.000Z").getTime();
      const endOfDay = new Date(dateStr + "T23:59:59.999Z").getTime();
      const count = await redis.zcount(rk("conversations:index"), startOfDay, endOfDay);
      days.push({ date: dateStr, count });
    }
    return days;
  } catch {
    return [];
  }
}

/** Get the 5 most recent conversations for quick overview */
export async function getRecentConversationPreviews(): Promise<{
  id: string;
  startedAt: string;
  turnCount: number;
  firstMessage: string;
}[]> {
  try {
    const redis = getRedis();
    const ids = await redis.zrange(rk("conversations:index"), 0, 4, { rev: true });
    if (!ids.length) return [];

    const raw = await Promise.all(
      ids.map((id) => redis.get<string>(rk("conversations", id as string))),
    );

    return raw
      .filter((r): r is string => r !== null)
      .map((r) => {
        const log = JSON.parse(r);
        return {
          id: log.id,
          startedAt: log.startedAt,
          turnCount: log.turnCount,
          firstMessage: log.messages?.find((m: { role: string }) => m.role === "user")?.content?.slice(0, 120) ?? "",
        };
      });
  } catch {
    return [];
  }
}

/* ─── Cost analytics ─────────────────────────────────────────────────────── */

export interface CostSummary {
  inputTokensTotal: number;
  outputTokensTotal: number;
  costTotal: number;
  costToday: number;
  dailyCosts: { date: string; cost: number; inputTokens: number; outputTokens: number }[];
  avgCostPerRequest: number;
  maxContextTokens: number;
  requestsTotal: number;
  pricingFetchedAt: string | null;
  pricingSource: string | null;
  pricingStale: boolean;
}

export async function getCostSummary(): Promise<CostSummary> {
  try {
    const redis = getRedis();
    const today = new Date().toISOString().split("T")[0];

    const [inputTotal, outputTotal, requestsTotal, maxContext, pricing] = await Promise.all([
      redis.get<number>(rk("chat:tokens:input:total")),
      redis.get<number>(rk("chat:tokens:output:total")),
      redis.get<number>(rk("chat:requests:total")),
      redis.get<number>(rk("chat:tokens:max-context")),
      getStoredPricing(),
    ]);

    const { rates, fetchedAt: pricingFetchedAt, source: pricingSource, stale: pricingStale } = pricing;

    const inp = inputTotal ?? 0;
    const out = outputTotal ?? 0;
    const reqs = requestsTotal ?? 0;
    const costTotal = calcCost(inp, out, "claude-haiku-4-5", rates);

    const [inpToday, outToday] = await Promise.all([
      redis.get<number>(rk("chat:tokens:input:daily", today)),
      redis.get<number>(rk("chat:tokens:output:daily", today)),
    ]);
    const costToday = calcCost(inpToday ?? 0, outToday ?? 0, "claude-haiku-4-5", rates);

    const dailyCosts = await Promise.all(
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split("T")[0];
      }).map(async (date) => {
        const [di, dout] = await Promise.all([
          redis.get<number>(rk("chat:tokens:input:daily", date)),
          redis.get<number>(rk("chat:tokens:output:daily", date)),
        ]);
        const dInp = di ?? 0;
        const dOut = dout ?? 0;
        return { date, cost: calcCost(dInp, dOut, "claude-haiku-4-5", rates), inputTokens: dInp, outputTokens: dOut };
      }),
    );

    return {
      inputTokensTotal: inp,
      outputTokensTotal: out,
      costTotal,
      costToday,
      dailyCosts,
      avgCostPerRequest: reqs > 0 ? costTotal / reqs : 0,
      maxContextTokens: maxContext ?? 0,
      requestsTotal: reqs,
      pricingFetchedAt,
      pricingSource,
      pricingStale,
    };
  } catch {
    return { inputTokensTotal: 0, outputTokensTotal: 0, costTotal: 0, costToday: 0, dailyCosts: [], avgCostPerRequest: 0, maxContextTokens: 0, requestsTotal: 0, pricingFetchedAt: null, pricingSource: null, pricingStale: true };
  }
}

export interface HourlyBucket {
  hour: number;
  requests: number;
  tokens: number;
}

export async function getHourlyActivity(): Promise<HourlyBucket[]> {
  try {
    const redis = getRedis();
    const today = new Date().toISOString().split("T")[0];

    return await Promise.all(
      Array.from({ length: 24 }, async (_, h) => {
        const hStr = h.toString().padStart(2, "0");
        const [reqs, tokens] = await Promise.all([
          redis.get<number>(rk("chat:requests:hourly", today, hStr)),
          redis.get<number>(rk("chat:tokens:hourly", today, hStr)),
        ]);
        return { hour: h, requests: reqs ?? 0, tokens: tokens ?? 0 };
      }),
    );
  } catch {
    return Array.from({ length: 24 }, (_, i) => ({ hour: i, requests: 0, tokens: 0 }));
  }
}

export interface TopUser {
  ip: string;
  requests: number;
  inputTokens: number;
  outputTokens: number;
  cost: number;
}

export async function getTopUsers(): Promise<TopUser[]> {
  try {
    const redis = getRedis();
    const [entries, pricing] = await Promise.all([
      redis.zrange(rk("chat:ip:leaderboard"), 0, 9, { rev: true, withScores: true }),
      getStoredPricing(),
    ]);
    if (!entries.length) return [];

    const pairs: { ip: string }[] = [];
    for (let i = 0; i < entries.length; i += 2) {
      pairs.push({ ip: entries[i] as string });
    }

    const users = await Promise.all(
      pairs.map(async ({ ip }) => {
        const [reqs, inp, out] = await Promise.all([
          redis.get<number>(rk("chat:ip", ip, "requests:total")),
          redis.get<number>(rk("chat:ip", ip, "tokens:input:total")),
          redis.get<number>(rk("chat:ip", ip, "tokens:output:total")),
        ]);
        const inputTokens = inp ?? 0;
        const outputTokens = out ?? 0;
        return { ip, requests: reqs ?? 0, inputTokens, outputTokens, cost: calcCost(inputTokens, outputTokens, "claude-haiku-4-5", pricing.rates) };
      }),
    );

    return users.sort((a, b) => b.cost - a.cost);
  } catch {
    return [];
  }
}

export interface ModelBreakdown {
  model: string;
  requests: number;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  inputRate: number;
  outputRate: number;
}

export async function getModelBreakdown(): Promise<ModelBreakdown[]> {
  try {
    const redis = getRedis();
    const [modelSet, pricing] = await Promise.all([
      redis.smembers(rk("chat:models:seen")),
      getStoredPricing(),
    ]);
    const models = modelSet as string[];
    if (!models.length) models.push("claude-haiku-4-5");

    const breakdowns = await Promise.all(
      models.map(async (model) => {
        const [reqs, inp, out] = await Promise.all([
          redis.get<number>(rk("chat:model", model, "requests:total")),
          redis.get<number>(rk("chat:model", model, "tokens:input:total")),
          redis.get<number>(rk("chat:model", model, "tokens:output:total")),
        ]);
        const inputTokens = inp ?? 0;
        const outputTokens = out ?? 0;
        const liveRates = pricing.rates[model] ?? MODEL_PRICING[model] ?? { inputPerMTok: 1.00, outputPerMTok: 5.00 };
        return {
          model,
          requests: reqs ?? 0,
          inputTokens,
          outputTokens,
          cost: calcCost(inputTokens, outputTokens, model, pricing.rates),
          inputRate: liveRates.inputPerMTok,
          outputRate: liveRates.outputPerMTok,
        };
      }),
    );

    return breakdowns.filter((b) => b.requests > 0 || b.inputTokens > 0).sort((a, b) => b.cost - a.cost);
  } catch {
    return [];
  }
}
