import type { Metadata } from "next";
import { isOpsAuthenticated } from "@/lib/ops-auth";
import OpsAuthGate from "@/components/ops/ops-auth-gate";

export const metadata: Metadata = {
  title: "Ops",
  robots: { index: false, follow: false },
};

export default async function OpsLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await isOpsAuthenticated();

  if (!authenticated) {
    return <OpsAuthGate />;
  }

  return (
    <div className="min-h-screen bg-bg">
      {children}
    </div>
  );
}
