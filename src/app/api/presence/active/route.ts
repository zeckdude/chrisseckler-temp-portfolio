import { getRedis, rk } from "@/lib/redis";
import { isOpsAuthenticated } from "@/lib/ops-auth";

export const runtime = "nodejs";

const SESSION_TTL_MS = 35_000;

export async function GET() {
  const authed = await isOpsAuthenticated();
  if (!authed) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const redis = getRedis();

    // Get all session IDs seen within the TTL window
    const cutoff = Date.now() - SESSION_TTL_MS;
    const sessionIds = await redis.zrange(rk("presence:sessions"), cutoff, "+inf", { byScore: true });

    if (!sessionIds.length) {
      return Response.json({ sessions: [], total: 0 });
    }

    // Fetch each session's data
    const rawSessions = await Promise.all(
      (sessionIds as string[]).map((id: string) => redis.get<string>(rk("presence:session", id))),
    );

    const sessions = rawSessions
      .filter((r): r is string => r !== null)
      .map((r: string) => JSON.parse(r));

    return Response.json({ sessions, total: sessions.length });
  } catch {
    return Response.json({ sessions: [], total: 0 });
  }
}
