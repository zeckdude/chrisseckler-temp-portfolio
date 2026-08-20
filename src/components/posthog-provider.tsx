"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { track } from "@/lib/analytics";

let initialized = false;

function isOpsPath(pathname: string | null): boolean {
  return !!pathname && pathname.startsWith("/ops");
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.posthog.com";
  const pathname = usePathname();

  useEffect(() => {
    if (!posthogKey || initialized) return;
    initialized = true;

    posthog.init(posthogKey, {
      api_host: "/ingest",
      ui_host: posthogHost,
      defaults: "2026-05-30",
      person_profiles: "identified_only",
      persistence: "localStorage",
      capture_pageview: false,
      capture_pageleave: true,
      autocapture: true,
      capture_performance: {
        web_vitals: true,
        web_vitals_allowed_metrics: ["LCP", "INP", "CLS", "FCP"],
      },
      session_recording: {
        maskAllInputs: false,
      },
      before_send: (event) => {
        if (!event) return null;
        const url = String(event.properties?.$current_url ?? event.properties?.$pathname ?? "");
        if (url.includes("/ops")) return null;
        return event;
      },
    });
  }, [posthogKey, posthogHost]);

  useEffect(() => {
    if (!initialized || !posthogKey) return;
    if (isOpsPath(pathname)) {
      posthog.opt_out_capturing();
      if (posthog.sessionRecordingStarted()) posthog.stopSessionRecording();
    } else {
      posthog.opt_in_capturing();
    }
  }, [pathname, posthogKey]);

  return <>{children}</>;
}

export function PostHogPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
    if (isOpsPath(pathname)) return;
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    track("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}
