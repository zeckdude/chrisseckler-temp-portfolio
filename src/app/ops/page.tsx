import { Suspense } from "react";
import Link from "next/link";
import { getUsageStats, getEnvStatus, AI_CONFIG, getConversationActivity, getRecentConversationPreviews, getCostSummary, getHourlyActivity, getTopUsers, getModelBreakdown } from "@/lib/ops-data";
import { StatSkeleton, ChartSkeleton, CardSkeleton } from "@/components/ops/ops-skeleton";
import PresencePanel from "@/components/ops/presence-panel";
import ActivityChartWrapper from "@/components/ops/activity-chart-wrapper";
import OpsChatPanel from "@/components/ops/ops-chat-panel";
import OpsSignOut from "@/components/ops/ops-sign-out";
import CostAnalytics from "@/components/ops/cost-analytics";
import PostHogInsights from "@/components/ops/posthog-insights";
import { getPostHogOpsData } from "@/lib/posthog-ops";

/* ─── Section wrapper ───────────────────────────────────────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-secondary/70">
        {title}
      </h2>
      {children}
    </section>
  );
}

/* ─── Usage stats panel ─────────────────────────────────────────────────── */
async function UsageStatsPanel() {
  const stats = await getUsageStats();

  const items = [
    { label: "Total requests", value: stats.requestsTotal.toLocaleString(), sub: `${stats.requestsToday} today` },
    { label: "Total tokens", value: stats.tokensTotal.toLocaleString(), sub: `${stats.tokensToday.toLocaleString()} today` },
    { label: "Logged convos", value: stats.conversationsTotal.toLocaleString(), sub: `${AI_CONFIG.env} environment` },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-border bg-surface p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-text-secondary/70">{item.label}</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-text-primary">{item.value}</p>
          <p className="mt-1 text-xs text-text-secondary">{item.sub}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── AI config panel ───────────────────────────────────────────────────── */
function AiConfigPanel() {
  const rows = [
    { key: "Model", value: AI_CONFIG.model },
    { key: "Max output tokens", value: AI_CONFIG.maxOutputTokens.toLocaleString() },
    { key: "Max conversation turns", value: AI_CONFIG.maxTurns },
    { key: "User turn limit", value: AI_CONFIG.userTurnLimit },
    { key: "Rate limit (per hour)", value: AI_CONFIG.rateLimitPerHour },
    { key: "Min turns to log", value: AI_CONFIG.minTurnsToLog },
    { key: "Environment", value: AI_CONFIG.env },
  ];

  return (
    <div className="rounded-xl border border-border bg-surface divide-y divide-border">
      {rows.map(({ key, value }) => (
        <div key={key} className="flex items-center justify-between px-5 py-3">
          <span className="text-sm text-text-secondary">{key}</span>
          <span className="font-mono text-sm font-medium text-text-primary">{String(value)}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Env status panel ──────────────────────────────────────────────────── */
function EnvStatusPanel() {
  const envVars = getEnvStatus();
  const allSet = envVars.every((e) => e.set);

  return (
    <div className="rounded-xl border border-border bg-surface divide-y divide-border">
      {envVars.map((env) => (
        <div key={env.name} className="flex items-center gap-3 px-5 py-3">
          <div className={`h-2 w-2 shrink-0 rounded-full ${env.set ? "bg-emerald-400" : "bg-red-400"}`} />
          <div className="flex-1 min-w-0">
            <p className="font-mono text-xs font-medium text-text-primary">{env.name}</p>
            <p className="text-xs text-text-secondary">{env.description}</p>
          </div>
          <span className={`text-xs font-medium ${env.set ? "text-emerald-400" : "text-red-400"}`}>
            {env.set ? "set" : "missing"}
          </span>
        </div>
      ))}
      {!allSet && (
        <div className="px-5 py-3 bg-red-950/20">
          <p className="text-xs text-red-400">Some env vars are missing — features may be degraded.</p>
        </div>
      )}
    </div>
  );
}

/* ─── Activity chart wrapper (server data → client chart) ───────────────── */
async function ConversationActivityPanel() {
  const activity = await getConversationActivity();
  return <ActivityChartWrapper data={activity} />;
}

/* ─── Cost analytics panel ──────────────────────────────────────────────── */
async function CostAnalyticsPanel() {
  const [costSummary, hourlyActivity, topUsers, modelBreakdown] = await Promise.all([
    getCostSummary(),
    getHourlyActivity(),
    getTopUsers(),
    getModelBreakdown(),
  ]);
  return (
    <CostAnalytics
      costSummary={costSummary}
      hourlyActivity={hourlyActivity}
      topUsers={topUsers}
      modelBreakdown={modelBreakdown}
    />
  );
}

async function PostHogInsightsPanel() {
  const data = await getPostHogOpsData();
  return <PostHogInsights data={data} />;
}

/* ─── Recent conversations ──────────────────────────────────────────────── */
async function RecentConversationsPanel() {
  const previews = await getRecentConversationPreviews();

  if (!previews.length) {
    return (
      <div className="rounded-xl border border-border bg-surface p-5">
        <p className="text-sm text-text-secondary">No conversations logged yet. Once visitors chat with 2+ turns, they&apos;ll appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {previews.map((p) => (
        <Link
          key={p.id}
          href={`/ops/logs?id=${p.id}`}
          className="block rounded-xl border border-border bg-surface px-5 py-4 transition-colors hover:border-accent/30 hover:bg-surface/80"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm text-text-primary line-clamp-2 flex-1">
              {p.firstMessage || "(no text)"}
            </p>
            <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 text-xs text-text-secondary ring-1 ring-border">
              {p.turnCount} turns
            </span>
          </div>
          <p className="mt-1.5 text-xs text-text-secondary">
            {new Date(p.startedAt).toLocaleString()}
          </p>
        </Link>
      ))}
      <Link
        href="/ops/logs"
        className="block rounded-xl border border-dashed border-border px-5 py-3 text-center text-sm text-text-secondary transition-colors hover:border-accent/30 hover:text-text-primary"
      >
        View all logs →
      </Link>
    </div>
  );
}

/* ─── External links panel ──────────────────────────────────────────────── */
function ExternalLinksPanel() {
  const links = [
    { label: "Upstash Console", href: "https://console.upstash.com", icon: "⚡" },
    { label: "Vercel Dashboard", href: "https://vercel.com/dashboard", icon: "▲" },
    { label: "GitHub Repo", href: "https://github.com/zeckdude/chrisseckler-temp-portfolio", icon: "⌥" },
    { label: "PostHog Dashboard", href: "https://us.posthog.com/project/566729", icon: "🦔" },
    { label: "/test/markdown", href: "/test/markdown", icon: "✎" },
  ];

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {links.map(({ label, href, icon }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-secondary transition-colors hover:border-accent/30 hover:text-text-primary"
        >
          <span className="text-base">{icon}</span>
          <span className="font-medium">{label}</span>
          {href.startsWith("http") && (
            <svg className="ml-auto shrink-0" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M2 10L10 2M5 2h5v5" />
            </svg>
          )}
        </a>
      ))}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function OpsPage() {
  return (
    <div className="mx-auto max-w-350 px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-text-primary">Ops</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Site overview · {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <OpsSignOut />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left column — main content */}
        <div className="space-y-8">

          {/* Live presence */}
          <Section title="Live Visitors">
            <PresencePanel />
          </Section>

          {/* Usage stats */}
          <Section title="Usage">
            <Suspense fallback={
              <div className="grid gap-3 sm:grid-cols-3">
                <StatSkeleton /><StatSkeleton /><StatSkeleton />
              </div>
            }>
              <UsageStatsPanel />
            </Suspense>
          </Section>

          {/* Conversation activity */}
          <Section title="Conversation Activity (7 days)">
            <Suspense fallback={<ChartSkeleton />}>
              <ConversationActivityPanel />
            </Suspense>
          </Section>

          {/* Recent conversations */}
          <Section title="Recent Conversations">
            <Suspense fallback={<CardSkeleton lines={4} />}>
              <RecentConversationsPanel />
            </Suspense>
          </Section>

          {/* AI cost & usage */}
          <Section title="AI Cost & Usage">
            <Suspense fallback={<ChartSkeleton />}>
              <CostAnalyticsPanel />
            </Suspense>
          </Section>

          {/* PostHog */}
          <Section title="PostHog — Vitals, Replay, Errors, Events">
            <Suspense fallback={<ChartSkeleton />}>
              <PostHogInsightsPanel />
            </Suspense>
          </Section>

          {/* AI config */}
          <Section title="AI Configuration">
            <AiConfigPanel />
          </Section>

          {/* Env status */}
          <Section title="Environment Variables">
            <Suspense fallback={<CardSkeleton />}>
              <EnvStatusPanel />
            </Suspense>
          </Section>

          {/* External links */}
          <Section title="Quick Links">
            <ExternalLinksPanel />
          </Section>
        </div>

        {/* Right column — insights chatbot */}
        <div className="lg:sticky lg:top-8 lg:h-[calc(100vh-5rem)]">
          <Section title="Visitor Insights">
            <div className="h-[calc(100vh-12rem)]">
              <OpsChatPanel
                apiEndpoint="/api/ops-chat"
                title="Visitor Insights"
                subtitle="RAG over conversation logs"
                welcomeMessage="Hi Chris! I have access to all your visitor conversation logs. Ask me what people are discussing most, what patterns you should know about for interviews, or anything else about your visitors."
              />
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
