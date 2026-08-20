import { isOpsAuthenticated } from "@/lib/ops-auth";
import { getRedis } from "@/lib/redis";

export const runtime = "nodejs";

const OPENROUTER_MODELS_URL = "https://openrouter.ai/api/v1/models";

function pricingKey(model: string, type: "input" | "output") {
  return `pricing:${model}:${type}`;
}
const PRICING_FETCHED_AT_KEY = "pricing:fetchedAt";
const PRICING_SOURCE_KEY = "pricing:source";

const MODEL_MAP: Record<string, string> = {
  "claude-haiku-4-5": "anthropic/claude-haiku-4-5",
  "claude-haiku-3-5": "anthropic/claude-haiku-3-5",
  "claude-sonnet-4-5": "anthropic/claude-sonnet-4-5",
  "claude-sonnet-4-6": "anthropic/claude-sonnet-4-6",
};

interface OpenRouterModel {
  id: string;
  pricing?: {
    prompt?: string | number;
    completion?: string | number;
  };
}

function isCronRequest(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

async function authorize(req: Request): Promise<boolean> {
  if (isCronRequest(req)) return true;
  return isOpsAuthenticated();
}

async function refreshPricing(): Promise<Response> {
  try {
    const res = await fetch(OPENROUTER_MODELS_URL, {
      headers: { Accept: "application/json" },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return Response.json(
        { error: `OpenRouter returned ${res.status}` },
        { status: 502 },
      );
    }

    const json = (await res.json()) as { data: OpenRouterModel[] };
    const models: OpenRouterModel[] = json.data ?? [];

    const redis = getRedis();
    const fetchedAt = new Date().toISOString();
    const updated: Record<string, { inputPerMTok: number; outputPerMTok: number }> = {};

    for (const [internalSlug, openRouterId] of Object.entries(MODEL_MAP)) {
      const model = models.find((m) => m.id === openRouterId);
      if (!model?.pricing) continue;

      const inputPerToken = parseFloat(String(model.pricing.prompt ?? "0"));
      const outputPerToken = parseFloat(String(model.pricing.completion ?? "0"));

      if (isNaN(inputPerToken) || isNaN(outputPerToken)) continue;

      const inputPerMTok = inputPerToken * 1_000_000;
      const outputPerMTok = outputPerToken * 1_000_000;

      await Promise.all([
        redis.set(pricingKey(internalSlug, "input"), inputPerMTok),
        redis.set(pricingKey(internalSlug, "output"), outputPerMTok),
      ]);

      updated[internalSlug] = { inputPerMTok, outputPerMTok };
    }

    await Promise.all([
      redis.set(PRICING_FETCHED_AT_KEY, fetchedAt),
      redis.set(PRICING_SOURCE_KEY, "openrouter"),
    ]);

    return Response.json({ ok: true, fetchedAt, updated });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

/** Vercel Cron invokes this path with GET + Authorization: Bearer CRON_SECRET */
export async function GET(req: Request) {
  if (!(await authorize(req))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return refreshPricing();
}

/** Ops page also POSTs here when stored rates are stale */
export async function POST(req: Request) {
  if (!(await authorize(req))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return refreshPricing();
}
