import { cookies } from "next/headers";

const OPS_COOKIE = "ops-auth";

/** Server-side check — returns true if the ops session cookie is present */
export async function isOpsAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(OPS_COOKIE)?.value === "1";
  } catch {
    return false;
  }
}
