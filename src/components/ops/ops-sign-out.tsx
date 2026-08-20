"use client";

import { useRouter } from "next/navigation";

export default function OpsSignOut() {
  const router = useRouter();

  async function signOut() {
    await fetch("/api/ops/auth", { method: "DELETE" });
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-border/60 hover:text-text-primary"
    >
      Sign out
    </button>
  );
}
