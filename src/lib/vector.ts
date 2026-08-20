import { Index } from "@upstash/vector";

let _index: Index | null = null;

export function getVectorIndex(): Index {
  if (_index) return _index;
  if (!process.env.UPSTASH_VECTOR_REST_URL || !process.env.UPSTASH_VECTOR_REST_TOKEN) {
    throw new Error("Upstash Vector env vars not set (UPSTASH_VECTOR_REST_URL, UPSTASH_VECTOR_REST_TOKEN)");
  }
  _index = new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN,
  });
  return _index;
}
