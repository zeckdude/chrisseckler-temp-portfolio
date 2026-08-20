import { Redis } from "@upstash/redis";

let _redis: Redis | null = null;

export function getRedis(): Redis {
  if (_redis) return _redis;
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error("Upstash Redis env vars not set");
  }
  _redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  return _redis;
}

/** Returns "dev" or "prod" prefix for all namespaced keys */
export function envPrefix(): "dev" | "prod" {
  return process.env.NODE_ENV === "production" ? "prod" : "dev";
}

/** Build a namespaced Redis key */
export function rk(...parts: string[]): string {
  return [envPrefix(), ...parts].join(":");
}
