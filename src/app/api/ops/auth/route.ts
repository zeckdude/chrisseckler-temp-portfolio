import { cookies } from "next/headers";

export const runtime = "nodejs";

const OPS_COOKIE = "ops-auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(req: Request) {
  let password: string = "";
  try {
    const body = await req.json();
    password = body.password ?? "";
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return Response.json({ error: "ADMIN_PASSWORD env var not set" }, { status: 500 });
  }

  if (password !== adminPassword) {
    return Response.json({ error: "Incorrect password" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(OPS_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/", // must cover /api/ops* as well as /ops
  });

  return Response.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete({ name: OPS_COOKIE, path: "/" });
  return Response.json({ ok: true });
}

/** Server-side helper — returns true if the ops cookie is present */
export async function isOpsAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(OPS_COOKIE)?.value === "1";
  } catch {
    return false;
  }
}
