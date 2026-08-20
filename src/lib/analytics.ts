/**
 * Client-only capture helper.
 * Identity: anonymous distinct_id in localStorage. Never call identify().
 * Never capture on /ops.
 */
import posthog from "posthog-js";
import type { AnalyticsEventName } from "./analytics-events";

export type { AnalyticsEventName };
export { ANALYTICS_EVENTS } from "./analytics-events";

function shouldSkip(): boolean {
  if (typeof window === "undefined") return true;
  if (window.location.pathname.startsWith("/ops")) return true;
  return false;
}

export function track(
  event: AnalyticsEventName | (string & {}),
  properties?: Record<string, unknown>,
): void {
  if (shouldSkip()) return;
  try {
    posthog.capture(event, properties);
  } catch {
    // analytics must never break the UI
  }
}
