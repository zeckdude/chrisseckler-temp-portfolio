import type {
  EventCount,
  ExceptionPreview,
  PostHogOpsData,
  ReplayPreview,
  RouteVitals,
  SiteVitals,
  VitalRating,
  VitalScore,
} from "@/lib/posthog-ops";
import { emptySiteVitals } from "@/lib/posthog-ops";

const RATING_LABEL: Record<VitalRating, string> = {
  good: "Good",
  "needs-improvement": "Needs work",
  poor: "Poor",
  unknown: "No data yet",
};

const RATING_CLASS: Record<VitalRating, string> = {
  good: "text-emerald-400",
  "needs-improvement": "text-amber-400",
  poor: "text-red-400",
  unknown: "text-text-secondary",
};

function formatMs(ms: number | null): string {
  if (ms == null) return "—";
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
  return `${Math.round(ms)}ms`;
}

function formatCls(v: number | null): string {
  if (v == null) return "—";
  return v.toFixed(3);
}

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent underline-offset-2 hover:underline"
    >
      {children}
    </a>
  );
}

function RatingBadge({ rating }: { rating: VitalRating }) {
  return (
    <span className={`text-xs font-semibold ${RATING_CLASS[rating]}`}>
      {RATING_LABEL[rating]}
    </span>
  );
}

const METRICS: {
  key: "lcp" | "inp" | "cls" | "fcp";
  name: string;
  short: string;
  unit: "ms" | "cls";
  good: string;
  ni: string;
  poor: string;
  what: string;
  howMeasured: string;
  thisSite: string;
  howToFix: string[];
}[] = [
  {
    key: "lcp",
    name: "Largest Contentful Paint",
    short: "LCP",
    unit: "ms",
    good: "≤ 2.5s",
    ni: "2.5–4s",
    poor: "> 4s",
    what: "How long until the biggest thing in the first viewport finishes painting. On this site that is usually the hero headline or a project screenshot — not the tiny nav text.",
    howMeasured: "The browser reports the render time of the largest image or text block. p75 means 75% of visits were faster than this number. Google grades the 75th percentile, not the average, so one slow phone doesn't hide a generally fast site — and a few slow loads will show up.",
    thisSite: "Likely culprits here: Cabinet Grotesk loading from Fontshare (display swap helps, but the font file still competes), large case-study JPEGs in /public/projects, and the chat/Framer bundle parsing on first load. The home hero is CSS/text, so / should be healthier than /projects/[slug].",
    howToFix: [
      "Self-host Cabinet Grotesk (or subset it) instead of Fontshare CDN so it isn't a third-party round trip.",
      "Keep using next/image; add priority only on the first visible screenshot. Compress remaining project images (you already have a process script).",
      "Avoid loading the chat panel JS on first paint if LCP on / is weak — dynamic-import ChatPanel.",
    ],
  },
  {
    key: "inp",
    name: "Interaction to Next Paint",
    short: "INP",
    unit: "ms",
    good: "≤ 200ms",
    ni: "200–500ms",
    poor: "> 500ms",
    what: "When someone clicks or types, how long until the screen actually updates. It is the 'did my click do anything?' metric. It replaced FID in 2024.",
    howMeasured: "Chrome watches every click, tap, and keydown during the visit and reports the worst (almost) interaction. p75 of those worst-per-visit numbers is what we show. A single slow chat send can tank INP for that session.",
    thisSite: "Highest risk: opening the chat panel (React tree + Framer), sending a message (streaming + markdown), filter chips re-rendering the whole projects grid, and the gallery lightbox. Main-thread work from posthog-js / replay can also add a few milliseconds.",
    howToFix: [
      "Keep click handlers tiny — schedule heavy work (markdown, filter) after the UI has painted the open state.",
      "Virtualize or paginate the projects grid if it grows a lot.",
      "If replay looks expensive, sample recordings (PostHog replay settings) instead of recording every session.",
    ],
  },
  {
    key: "cls",
    name: "Cumulative Layout Shift",
    short: "CLS",
    unit: "cls",
    good: "≤ 0.1",
    ni: "0.1–0.25",
    poor: "> 0.25",
    what: "How much the page jumps while loading. If a font swap, image, or banner shoves content down after you started reading, CLS goes up. 0 is perfect; 0.1 is still 'good'.",
    howMeasured: "Each unexpected shift is distance × area. They add up over the life of the page. User-initiated shifts (opening chat, expanding a filter) usually do not count. Font swap and images without reserved size do.",
    thisSite: "Watch Fontshare (Cabinet Grotesk vs Inter fallback — different metrics, so headings can reflow). Project thumbnails and the gallery need reserved aspect-ratio boxes (they mostly do). The inline chat prompt on /projects can push the grid if it appears late.",
    howToFix: [
      "Match fallback font metrics to Cabinet Grotesk (size-adjust / ascent-override) or self-host with font-display: optional.",
      "Never insert above-the-fold UI without a reserved height (prompt, alerts, cookie banners).",
      "Keep width/height or aspect-ratio on every image — next/image already does this when fill + a sized parent is set.",
    ],
  },
  {
    key: "fcp",
    name: "First Contentful Paint",
    short: "FCP",
    unit: "ms",
    good: "≤ 1.8s",
    ni: "1.8–3s",
    poor: "> 3s",
    what: "Time until the visitor sees anything at all — a letter, an image, not a blank background. It is earlier than LCP. A fast FCP and slow LCP means the shell appeared but the hero/image lagged.",
    howMeasured: "First pixel of text or image. Same p75 rule as LCP. Server TTFB, JS blocking parse, and font loading all sit on this path.",
    thisSite: "Next.js App Router should stream HTML quickly on Vercel. Blocking work: the JS bundle (chat + motion + PostHog), and waiting on Fontshare before text looks 'real' even though display:swap should still paint Inter first.",
    howToFix: [
      "Protect TTFB: keep the homepage a static Server Component (it already is).",
      "Don't add blocking scripts in <head>. PostHog is already client-only.",
      "If FCP is slow only on 3G traces, the bundle is the lever — dynamic import chat and recharts (ops is already split).",
    ],
  },
];

function formatScore(metric: (typeof METRICS)[number], score: VitalScore): string {
  if (score.p75 == null) return "—";
  return metric.unit === "cls" ? formatCls(score.p75) : formatMs(score.p75);
}

function VitalCard({
  metric,
  score,
}: {
  metric: (typeof METRICS)[number];
  score: VitalScore;
}) {
  return (
    <article className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-text-secondary">{metric.short}</p>
          <h3 className="mt-0.5 font-display text-lg font-extrabold text-text-primary">{metric.name}</h3>
        </div>
        <div className="text-right">
          <p className="font-mono text-2xl font-bold text-text-primary">{formatScore(metric, score)}</p>
          <RatingBadge rating={score.rating} />
        </div>
      </div>
      <p className="mt-3 text-xs text-text-secondary">
        Good {metric.good} · Needs work {metric.ni} · Poor {metric.poor}
        {score.samples > 0 && <> · {score.samples} samples (7d, p75)</>}
      </p>

      <div className="mt-4 space-y-3 text-sm leading-relaxed text-text-primary/90">
        <p><span className="font-semibold text-text-primary">What it is. </span>{metric.what}</p>
        <p><span className="font-semibold text-text-primary">How to read this number. </span>{metric.howMeasured}</p>
        <p><span className="font-semibold text-text-primary">On this site. </span>{metric.thisSite}</p>
        <div>
          <p className="font-semibold text-text-primary">If this score is weak, try:</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-text-secondary">
            {metric.howToFix.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

function RouteTable({ routes }: { routes: RouteVitals[] }) {
  if (!routes.length) {
    return (
      <p className="text-sm text-text-secondary">
        No per-route vitals yet. They appear after real visits send <code>$web_vitals</code>.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-border bg-surface text-text-secondary">
          <tr>
            <th className="px-3 py-2 font-medium">Route</th>
            <th className="px-3 py-2 font-medium">LCP</th>
            <th className="px-3 py-2 font-medium">INP</th>
            <th className="px-3 py-2 font-medium">CLS</th>
            <th className="px-3 py-2 font-medium">FCP</th>
            <th className="px-3 py-2 font-medium">n</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((row) => (
            <tr key={row.path} className="border-b border-border/60 last:border-0">
              <td className="max-w-48 truncate px-3 py-2 font-mono text-text-primary">{row.path}</td>
              <td className={`px-3 py-2 font-mono ${RATING_CLASS[row.lcp.rating]}`}>{formatMs(row.lcp.p75)}</td>
              <td className={`px-3 py-2 font-mono ${RATING_CLASS[row.inp.rating]}`}>{formatMs(row.inp.p75)}</td>
              <td className={`px-3 py-2 font-mono ${RATING_CLASS[row.cls.rating]}`}>{formatCls(row.cls.p75)}</td>
              <td className={`px-3 py-2 font-mono ${RATING_CLASS[row.fcp.rating]}`}>{formatMs(row.fcp.p75)}</td>
              <td className="px-3 py-2 text-text-secondary">{row.samples}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReplayList({ replays }: { replays: ReplayPreview[] }) {
  if (!replays.length) {
    return <p className="text-sm text-text-secondary">No recordings yet. Enable session replay in PostHog, then browse the public site.</p>;
  }
  return (
    <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
      {replays.map((r) => (
        <li key={r.id}>
          <a href={r.href} target="_blank" rel="noopener noreferrer" className="block px-4 py-3 hover:bg-bg">
            <p className="text-sm text-text-primary">
              {r.startTime ? new Date(r.startTime).toLocaleString() : r.id}
              {r.durationSec != null && (
                <span className="ml-2 text-text-secondary">{Math.round(r.durationSec)}s</span>
              )}
            </p>
            {r.url && <p className="truncate font-mono text-xs text-text-secondary">{r.url}</p>}
          </a>
        </li>
      ))}
    </ul>
  );
}

function ExceptionList({ exceptions }: { exceptions: ExceptionPreview[] }) {
  if (!exceptions.length) {
    return <p className="text-sm text-text-secondary">No exceptions in the last 30 days. That is what you want.</p>;
  }
  return (
    <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
      {exceptions.map((e, i) => (
        <li key={`${e.timestamp}-${i}`}>
          <a href={e.href} target="_blank" rel="noopener noreferrer" className="block px-4 py-3 hover:bg-bg">
            <p className="text-sm font-medium text-text-primary">{e.type}</p>
            <p className="line-clamp-2 text-sm text-text-secondary">{e.message}</p>
            <p className="mt-1 font-mono text-xs text-text-secondary">
              {e.timestamp ? new Date(e.timestamp).toLocaleString() : ""}
              {e.url ? ` · ${e.url}` : ""}
            </p>
          </a>
        </li>
      ))}
    </ul>
  );
}

function EventCatalog({ events }: { events: EventCount[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-border bg-surface text-text-secondary">
          <tr>
            <th className="px-3 py-2 font-medium">Event</th>
            <th className="px-3 py-2 font-medium">7d</th>
            <th className="px-3 py-2 font-medium">When</th>
            <th className="px-3 py-2 font-medium">Where in code</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr key={e.name} className="border-b border-border/60 last:border-0 align-top">
              <td className="px-3 py-2 font-mono text-text-primary">{e.name}</td>
              <td className="px-3 py-2 font-mono text-text-primary">{e.count}</td>
              <td className="px-3 py-2 text-text-secondary">{e.when}</td>
              <td className="px-3 py-2 font-mono text-text-secondary">{e.where}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PostHogInsights({ data }: { data: PostHogOpsData }) {
  const vitals: SiteVitals = data.vitals ?? emptySiteVitals();

  return (
    <div className="space-y-8">
      {!data.configured && (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Add <code className="font-mono">POSTHOG_PERSONAL_API_KEY</code> and{" "}
          <code className="font-mono">POSTHOG_PROJECT_ID</code> to load live numbers. The lesson
          content below still applies.
        </p>
      )}

      <div>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Web Vitals (p75, last 7 days)</h3>
            <p className="mt-1 max-w-2xl text-sm text-text-secondary">
              These four scores are how Chrome grades real visits — not Lighthouse on your laptop.
              Google uses the <span className="text-text-primary">75th percentile</span>: if p75 is
              “good”, three out of four visits met the bar. Color follows Chrome&apos;s thresholds.
            </p>
          </div>
          <ExtLink href={data.links.vitals}>Open in PostHog →</ExtLink>
        </div>
        <div className="grid gap-4">
          {METRICS.map((metric) => (
            <VitalCard key={metric.key} metric={metric} score={vitals[metric.key]} />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-end justify-between gap-2">
          <h3 className="text-sm font-semibold text-text-primary">By route</h3>
          <ExtLink href={data.links.web}>Web analytics →</ExtLink>
        </div>
        <RouteTable routes={vitals.byRoute} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <div className="mb-3 flex items-end justify-between gap-2">
            <h3 className="text-sm font-semibold text-text-primary">Latest replays</h3>
            <ExtLink href={data.links.replay}>All recordings →</ExtLink>
          </div>
          <ReplayList replays={data.replays} />
        </div>
        <div>
          <div className="mb-3 flex items-end justify-between gap-2">
            <h3 className="text-sm font-semibold text-text-primary">Latest exceptions</h3>
            <ExtLink href={data.links.errors}>Error tracking →</ExtLink>
          </div>
          <ExceptionList exceptions={data.exceptions} />
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-end justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Events we capture</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Named events plus autocapture. Counts are last 7 days. Source of truth:{" "}
              <code className="font-mono">src/lib/analytics-events.ts</code>.
            </p>
          </div>
          <ExtLink href={data.links.activity}>Event explorer →</ExtLink>
        </div>
        <EventCatalog events={data.eventCounts} />
      </div>
    </div>
  );
}
