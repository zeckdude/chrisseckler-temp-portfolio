import { getRedis, rk } from "@/lib/redis";

export const runtime = "nodejs";

// TTL in seconds — sessions expire 35s after last heartbeat (client pings every 15s)
const SESSION_TTL = 35;

export async function POST(req: Request) {
  let body: { sessionId?: string; page?: string; chatActive?: boolean } = {};
  try {
    body = await req.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const sessionId = body.sessionId ?? "unknown";
  const page = body.page ?? "/";
  const chatActive = body.chatActive ?? false;

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  try {
    const redis = getRedis();
    const sessionKey = rk("presence:session", sessionId);
    const sessionData = {
      sessionId,
      page,
      chatActive,
      ip,
      lastSeen: new Date().toISOString(),
      env: process.env.NODE_ENV === "production" ? "prod" : "dev",
    };

    // Store individual session with TTL
    await redis.setex(sessionKey, SESSION_TTL, JSON.stringify(sessionData));

    // Track in a set of active session IDs (with TTL per member via sorted set)
    await redis.zadd(rk("presence:sessions"), {
      score: Date.now(),
      member: sessionId,
    });

    // Clean up expired sessions from the sorted set (older than SESSION_TTL seconds)
    const cutoff = Date.now() - SESSION_TTL * 1000;
    await redis.zremrangebyscore(rk("presence:sessions"), 0, cutoff);
  } catch {
    // Non-fatal — presence is best-effort
  }

  return new Response("ok", { status: 200 });
}
