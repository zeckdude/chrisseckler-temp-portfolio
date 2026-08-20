import { isOpsAuthenticated } from "@/lib/ops-auth";
import { toggleBookmark } from "@/lib/conversation-logger";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const authed = await isOpsAuthenticated();
  if (!authed) return Response.json({ error: "Unauthorized" }, { status: 401 });

  let id: string;
  try {
    const body = await req.json();
    id = body.id;
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  const bookmarked = await toggleBookmark(id);
  return Response.json({ bookmarked });
}
