import { ANALYTICS_EVENTS } from "./analytics-events";

const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.posthog.com";

export function posthogProjectId(): string {
  return process.env.POSTHOG_PROJECT_ID ?? "566729";
}

export function posthogAppUrl(path = ""): string {
  const id = posthogProjectId();
  return `${HOST.replace(/\/$/, "")}/project/${id}${path}`;
}

export type VitalRating = "good" | "needs-improvement" | "poor" | "unknown";

export interface VitalScore {
  p75: number | null;
  samples: number;
  rating: VitalRating;
}

export interface RouteVitals {
  path: string;
  lcp: VitalScore;
  inp: VitalScore;
  cls: VitalScore;
  fcp: VitalScore;
  samples: number;
}

export interface SiteVitals {
  lcp: VitalScore;
  inp: VitalScore;
  cls: VitalScore;
  fcp: VitalScore;
  samples: number;
  byRoute: RouteVitals[];
}

export interface ReplayPreview {
  id: string;
  startTime: string | null;
  durationSec: number | null;
  url: string | null;
  href: string;
}

export interface ExceptionPreview {
  timestamp: string | null;
  type: string;
  message: string;
  url: string | null;
  href: string;
}

export interface EventCount {
  name: string;
  count: number;
  where: string;
  when: string;
}

export interface PostHogOpsData {
  configured: boolean;
  vitals: SiteVitals | null;
  replays: ReplayPreview[];
  exceptions: ExceptionPreview[];
  eventCounts: EventCount[];
  links: {
    web: string;
    vitals: string;
    replay: string;
    errors: string;
    insights: string;
    activity: string;
  };
}

function emptyVital(): VitalScore {
  return { p75: null, samples: 0, rating: "unknown" };
}

function rate(metric: "lcp" | "inp" | "cls" | "fcp", value: number | null): VitalRating {
  if (value == null || Number.isNaN(value)) return "unknown";
  if (metric === "lcp") return value <= 2500 ? "good" : value <= 4000 ? "needs-improvement" : "poor";
  if (metric === "inp") return value <= 200 ? "good" : value <= 500 ? "needs-improvement" : "poor";
  if (metric === "cls") return value <= 0.1 ? "good" : value <= 0.25 ? "needs-improvement" : "poor";
  return value <= 1800 ? "good" : value <= 3000 ? "needs-improvement" : "poor";
}

function asNum(v: unknown): number | null {
  if (v == null) return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

async function hogql(query: string): Promise<{ columns: string[]; results: unknown[][] }> {
  const key = process.env.POSTHOG_PERSONAL_API_KEY;
  const projectId = posthogProjectId();
  if (!key) throw new Error("POSTHOG_PERSONAL_API_KEY not set");

  const res = await fetch(`${HOST}/api/projects/${projectId}/query/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PostHog query ${res.status}: ${text.slice(0, 200)}`);
  }

  const json = (await res.json()) as { columns?: string[]; results?: unknown[][] };
  return { columns: json.columns ?? [], results: json.results ?? [] };
}

function col(columns: string[], row: unknown[], name: string): unknown {
  const i = columns.indexOf(name);
  return i >= 0 ? row[i] : undefined;
}

function buildVital(value: unknown, samples: unknown, metric: "lcp" | "inp" | "cls" | "fcp"): VitalScore {
  const p75 = asNum(value);
  const n = asNum(samples) ?? 0;
  return { p75, samples: n, rating: rate(metric, p75) };
}

async function fetchVitals(): Promise<SiteVitals> {
  const site = await hogql(`
    SELECT
      quantile(0.75)(toFloat(properties.$web_vitals_LCP_value)) AS lcp,
      quantile(0.75)(toFloat(properties.$web_vitals_INP_value)) AS inp,
      quantile(0.75)(toFloat(properties.$web_vitals_CLS_value)) AS cls,
      quantile(0.75)(toFloat(properties.$web_vitals_FCP_value)) AS fcp,
      count() AS samples
    FROM events
    WHERE event = '$web_vitals'
      AND timestamp > now() - INTERVAL 7 DAY
  `);

  const siteRow = site.results[0] ?? [];
  const siteSamples = asNum(col(site.columns, siteRow, "samples")) ?? 0;

  const routes = await hogql(`
    SELECT
      coalesce(nullIf(properties.$pathname, ''), properties.$current_url, '(unknown)') AS path,
      quantile(0.75)(toFloat(properties.$web_vitals_LCP_value)) AS lcp,
      quantile(0.75)(toFloat(properties.$web_vitals_INP_value)) AS inp,
      quantile(0.75)(toFloat(properties.$web_vitals_CLS_value)) AS cls,
      quantile(0.75)(toFloat(properties.$web_vitals_FCP_value)) AS fcp,
      count() AS samples
    FROM events
    WHERE event = '$web_vitals'
      AND timestamp > now() - INTERVAL 7 DAY
    GROUP BY path
    ORDER BY samples DESC
    LIMIT 12
  `);

  return {
    lcp: buildVital(col(site.columns, siteRow, "lcp"), siteSamples, "lcp"),
    inp: buildVital(col(site.columns, siteRow, "inp"), siteSamples, "inp"),
    cls: buildVital(col(site.columns, siteRow, "cls"), siteSamples, "cls"),
    fcp: buildVital(col(site.columns, siteRow, "fcp"), siteSamples, "fcp"),
    samples: siteSamples,
    byRoute: routes.results.map((row) => {
      const samples = asNum(col(routes.columns, row, "samples")) ?? 0;
      return {
        path: String(col(routes.columns, row, "path") ?? "(unknown)"),
        samples,
        lcp: buildVital(col(routes.columns, row, "lcp"), samples, "lcp"),
        inp: buildVital(col(routes.columns, row, "inp"), samples, "inp"),
        cls: buildVital(col(routes.columns, row, "cls"), samples, "cls"),
        fcp: buildVital(col(routes.columns, row, "fcp"), samples, "fcp"),
      };
    }),
  };
}

async function fetchReplays(): Promise<ReplayPreview[]> {
  const key = process.env.POSTHOG_PERSONAL_API_KEY;
  const projectId = posthogProjectId();
  if (!key) return [];

  const res = await fetch(
    `${HOST}/api/projects/${projectId}/session_recordings?limit=5&ordering=-start_time`,
    {
      headers: { Authorization: `Bearer ${key}` },
      next: { revalidate: 60 },
    },
  );
  if (!res.ok) return [];

  const json = (await res.json()) as {
    results?: {
      id: string;
      start_time?: string;
      recording_duration?: number;
      start_url?: string;
    }[];
  };

  return (json.results ?? []).slice(0, 5).map((r) => ({
    id: r.id,
    startTime: r.start_time ?? null,
    durationSec: r.recording_duration ?? null,
    url: r.start_url ?? null,
    href: posthogAppUrl(`/replay/${r.id}`),
  }));
}

async function fetchExceptions(): Promise<ExceptionPreview[]> {
  const { columns, results } = await hogql(`
    SELECT
      timestamp,
      properties.$exception_type AS type,
      properties.$exception_message AS message,
      properties.$current_url AS url
    FROM events
    WHERE event = '$exception'
      AND timestamp > now() - INTERVAL 30 DAY
    ORDER BY timestamp DESC
    LIMIT 5
  `);

  return results.map((row) => ({
    timestamp: col(columns, row, "timestamp") ? String(col(columns, row, "timestamp")) : null,
    type: String(col(columns, row, "type") ?? "Error"),
    message: String(col(columns, row, "message") ?? "(no message)"),
    url: col(columns, row, "url") ? String(col(columns, row, "url")) : null,
    href: posthogAppUrl("/error_tracking"),
  }));
}

async function fetchEventCounts(): Promise<EventCount[]> {
  const { columns, results } = await hogql(`
    SELECT event, count() AS n
    FROM events
    WHERE timestamp > now() - INTERVAL 7 DAY
    GROUP BY event
  `);

  const counts = new Map<string, number>();
  for (const row of results) {
    counts.set(String(col(columns, row, "event")), asNum(col(columns, row, "n")) ?? 0);
  }

  return ANALYTICS_EVENTS.map((e) => ({
    name: e.name,
    count: counts.get(e.name) ?? 0,
    where: e.where,
    when: e.when,
  }));
}

export async function getPostHogOpsData(): Promise<PostHogOpsData> {
  const links = {
    web: posthogAppUrl("/web"),
    vitals: posthogAppUrl("/web/web-vitals"),
    replay: posthogAppUrl("/replay/home"),
    errors: posthogAppUrl("/error_tracking"),
    insights: posthogAppUrl("/insights"),
    activity: posthogAppUrl("/activity/explore"),
  };

  if (!process.env.POSTHOG_PERSONAL_API_KEY) {
    return {
      configured: false,
      vitals: null,
      replays: [],
      exceptions: [],
      eventCounts: ANALYTICS_EVENTS.map((e) => ({
        name: e.name,
        count: 0,
        where: e.where,
        when: e.when,
      })),
      links,
    };
  }

  try {
    const [vitals, replays, exceptions, eventCounts] = await Promise.all([
      fetchVitals().catch(() => null),
      fetchReplays().catch(() => []),
      fetchExceptions().catch(() => []),
      fetchEventCounts().catch(() =>
        ANALYTICS_EVENTS.map((e) => ({ name: e.name, count: 0, where: e.where, when: e.when })),
      ),
    ]);

    return { configured: true, vitals, replays, exceptions, eventCounts, links };
  } catch {
    return {
      configured: true,
      vitals: null,
      replays: [],
      exceptions: [],
      eventCounts: ANALYTICS_EVENTS.map((e) => ({
        name: e.name,
        count: 0,
        where: e.where,
        when: e.when,
      })),
      links,
    };
  }
}

export function emptySiteVitals(): SiteVitals {
  return {
    lcp: emptyVital(),
    inp: emptyVital(),
    cls: emptyVital(),
    fcp: emptyVital(),
    samples: 0,
    byRoute: [],
  };
}
