import { isOpsAuthenticated } from "@/lib/ops-auth";
import { saveNote } from "@/lib/conversation-logger";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const authed = await isOpsAuthenticated();
  if (!authed) return Response.json({ error: "Unauthorized" }, { status: 401 });

  let id: string;
  let note: string;
  try {
    const body = await req.json();
    id = body.id;
    note = body.note ?? "";
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  await saveNote(id, note);
  return Response.json({ ok: true });
}
