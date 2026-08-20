/**
 * Anthropic model pricing.
 *
 * HARDCODED FALLBACKS (Anthropic list price as of Aug 2026):
 *   Source: https://platform.claude.com/docs/en/about-claude/pricing
 *
 * Live rates are fetched weekly from OpenRouter's models API and stored in Redis.
 * Use getStoredPricing() to get the current live rates (server-side only).
 * The /api/ops/refresh-pricing route handles fetching + storing.
 */

export const HARDCODED_PRICING: Record<string, { inputPerMTok: number; outputPerMTok: number }> = {
  "claude-haiku-4-5":  { inputPerMTok: 1.00,  outputPerMTok: 5.00 },
  "claude-haiku-3-5":  { inputPerMTok: 0.80,  outputPerMTok: 4.00 },
  "claude-sonnet-4-5": { inputPerMTok: 3.00,  outputPerMTok: 15.00 },
  "claude-sonnet-4-6": { inputPerMTok: 3.00,  outputPerMTok: 15.00 },
};

export const MODEL_PRICING = HARDCODED_PRICING;

const DEFAULT_PRICING = { inputPerMTok: 1.00, outputPerMTok: 5.00 };
const STALE_MS = 7 * 24 * 60 * 60 * 1000;

export interface StoredPricing {
  rates: Record<string, { inputPerMTok: number; outputPerMTok: number }>;
  fetchedAt: string | null;
  source: string | null;
  stale: boolean;
}

/**
 * Returns live pricing from Redis, falling back to hardcoded defaults.
 * Server-side only — imports Redis dynamically so this file remains importable
 * in client components (they'll only ever use the sync helpers below).
 */
export async function getStoredPricing(): Promise<StoredPricing> {
  try {
    const { getRedis } = await import("./redis");
    const redis = getRedis();

    const models = Object.keys(HARDCODED_PRICING);
    const [fetchedAt, source, ...tokenRates] = await Promise.all([
      redis.get<string>("pricing:fetchedAt"),
      redis.get<string>("pricing:source"),
      ...models.flatMap((m) => [
        redis.get<number>(`pricing:${m}:input`),
        redis.get<number>(`pricing:${m}:output`),
      ]),
    ]);

    const rates: Record<string, { inputPerMTok: number; outputPerMTok: number }> = {};
    models.forEach((model, i) => {
      const inp = tokenRates[i * 2] as number | null;
      const out = tokenRates[i * 2 + 1] as number | null;
      rates[model] = {
        inputPerMTok: inp ?? HARDCODED_PRICING[model].inputPerMTok,
        outputPerMTok: out ?? HARDCODED_PRICING[model].outputPerMTok,
      };
    });

    const stale =
      !fetchedAt ||
      Date.now() - new Date(fetchedAt).getTime() > STALE_MS;

    return { rates, fetchedAt: fetchedAt ?? null, source: source ?? null, stale };
  } catch {
    return {
      rates: { ...HARDCODED_PRICING },
      fetchedAt: null,
      source: null,
      stale: true,
    };
  }
}

/**
 * Calculate exact cost in USD.
 * Pass live `rates` from getStoredPricing() for accuracy,
 * or omit to fall back to hardcoded defaults.
 */
export function calcCost(
  inputTokens: number,
  outputTokens: number,
  model: string,
  rates?: Record<string, { inputPerMTok: number; outputPerMTok: number }>,
): number {
  const pricing = (rates ?? HARDCODED_PRICING)[model] ?? DEFAULT_PRICING;
  return (inputTokens / 1_000_000) * pricing.inputPerMTok
       + (outputTokens / 1_000_000) * pricing.outputPerMTok;
}

/** Format a USD cost for display. */
export function formatCost(usd: number): string {
  if (usd === 0) return "$0.00";
  if (usd < 0.0001) return `$${usd.toFixed(7)}`;
  if (usd < 0.01)   return `$${usd.toFixed(5)}`;
  if (usd < 1)      return `$${usd.toFixed(4)}`;
  return `$${usd.toFixed(2)}`;
}

export function isPricingStale(fetchedAt: string | null): boolean {
  if (!fetchedAt) return true;
  return Date.now() - new Date(fetchedAt).getTime() > STALE_MS;
}
