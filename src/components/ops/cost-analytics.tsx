"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import type { CostSummary, HourlyBucket, TopUser, ModelBreakdown } from "@/lib/ops-data";
import { formatCost } from "@/lib/ai-pricing";

interface Props {
  costSummary: CostSummary;
  hourlyActivity: HourlyBucket[];
  topUsers: TopUser[];
  modelBreakdown: ModelBreakdown[];
}

function PricingBadge({
  fetchedAt,
  source,
  stale,
  onRefreshed,
}: {
  fetchedAt: string | null;
  source: string | null;
  stale: boolean;
  onRefreshed: (newFetchedAt: string) => void;
}) {
  const [refreshing, setRefreshing] = useState(false);
  const [localFetchedAt, setLocalFetchedAt] = useState(fetchedAt);
  const [localStale, setLocalStale] = useState(stale);

  useEffect(() => {
    if (!localStale || refreshing) return;
    setRefreshing(true);
    fetch("/api/ops/refresh-pricing", { method: "POST" })
      .then((r) => r.json())
      .then((data: { fetchedAt?: string }) => {
        if (data.fetchedAt) {
          setLocalFetchedAt(data.fetchedAt);
          setLocalStale(false);
          onRefreshed(data.fetchedAt);
        }
      })
      .catch(() => {/* silent — non-critical */})
      .finally(() => setRefreshing(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatted = localFetchedAt
    ? new Date(localFetchedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      })
    : null;

  return (
    <div className="flex items-center gap-2 text-xs text-text-secondary/70">
      {refreshing ? (
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 animate-spin rounded-full border border-text-secondary/40 border-t-text-secondary" />
          Refreshing prices from OpenRouter…
        </span>
      ) : localStale ? (
        <span className="flex items-center gap-1.5 text-amber-400/80">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          Prices stale — refreshing…
        </span>
      ) : (
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Rates via {source ?? "OpenRouter"}
          {formatted && <> · fetched {formatted}</>}
        </span>
      )}
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-border bg-bg-secondary p-4">
      <div className="text-xs text-text-secondary">{label}</div>
      <div className="mt-1 font-mono text-xl font-bold text-text-primary">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-text-secondary/70">{sub}</div>}
    </div>
  );
}

function CostTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string; payload: { inputTokens: number; outputTokens: number } }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded border border-border bg-bg px-3 py-2 text-xs shadow">
      <div className="font-semibold text-text-primary">{label}</div>
      <div className="mt-1 text-text-secondary">Cost: {formatCost(payload[0].value)}</div>
      <div className="text-text-secondary/70">
        In: {(d.inputTokens / 1000).toFixed(1)}k · Out: {(d.outputTokens / 1000).toFixed(1)}k
      </div>
    </div>
  );
}

function HourlyTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded border border-border bg-bg px-3 py-2 text-xs shadow">
      <div className="font-semibold text-text-primary">{label}:00 UTC</div>
      {payload.map((p) => (
        <div key={p.name} className="text-text-secondary">
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
}

export default function CostAnalytics({ costSummary, hourlyActivity, topUsers, modelBreakdown }: Props) {
  const [mounted, setMounted] = useState(false);
  const [pricingFetchedAt, setPricingFetchedAt] = useState(costSummary.pricingFetchedAt);
  useEffect(() => setMounted(true), []);

  const peakHour = hourlyActivity.reduce(
    (max, h) => (h.requests > max.requests ? h : max),
    hourlyActivity[0] ?? { hour: 0, requests: 0, tokens: 0 },
  );

  const totalTokens = costSummary.inputTokensTotal + costSummary.outputTokensTotal;

  return (
    <div className="space-y-6">
      {/* Pricing source badge */}
      <PricingBadge
        fetchedAt={pricingFetchedAt}
        source={costSummary.pricingSource}
        stale={costSummary.pricingStale}
        onRefreshed={(ts) => setPricingFetchedAt(ts)}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Total Cost (All-Time)"
          value={formatCost(costSummary.costTotal)}
          sub={`${costSummary.requestsTotal.toLocaleString()} requests`}
        />
        <StatCard
          label="Cost Today"
          value={formatCost(costSummary.costToday)}
          sub="exact from Anthropic rates"
        />
        <StatCard
          label="Avg Cost / Request"
          value={formatCost(costSummary.avgCostPerRequest)}
          sub="based on all-time data"
        />
        <StatCard
          label="Max Context Used"
          value={`${(costSummary.maxContextTokens / 1000).toFixed(1)}k`}
          sub="tokens in single request"
        />
      </div>

      {/* Token split */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          label="Input Tokens (Total)"
          value={`${(costSummary.inputTokensTotal / 1000).toFixed(1)}k`}
          sub={`@ $1.00/MTok`}
        />
        <StatCard
          label="Output Tokens (Total)"
          value={`${(costSummary.outputTokensTotal / 1000).toFixed(1)}k`}
          sub={`@ $5.00/MTok`}
        />
        <StatCard
          label="Total Tokens"
          value={`${(totalTokens / 1000).toFixed(1)}k`}
          sub={`${totalTokens.toLocaleString()} exact`}
        />
      </div>

      {/* 7-day cost trend */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-text-primary">7-Day Cost Trend</h3>
        <div className="rounded-lg border border-border bg-bg-secondary p-4">
          {!mounted ? (
            <div className="h-40 animate-pulse rounded bg-border/30" />
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={costSummary.dailyCosts} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
                  tickFormatter={(v: string) => v.slice(5)}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "var(--color-text-secondary)" }}
                  tickFormatter={(v: number) => formatCost(v)}
                  axisLine={false}
                  tickLine={false}
                  width={55}
                />
                <Tooltip content={<CostTooltip />} />
                <Bar dataKey="cost" radius={[3, 3, 0, 0]}>
                  {costSummary.dailyCosts.map((entry) => (
                    <Cell
                      key={entry.date}
                      fill={
                        entry.date === new Date().toISOString().split("T")[0]
                          ? "var(--color-accent)"
                          : "var(--color-text-secondary)"
                      }
                      opacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Hourly distribution */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
          Time-of-Day Activity (Today, UTC)
          {peakHour.requests > 0 && (
            <span className="text-xs font-normal text-text-secondary">
              Peak: {peakHour.hour.toString().padStart(2, "0")}:00 ({peakHour.requests} req)
            </span>
          )}
        </h3>
        <div className="rounded-lg border border-border bg-bg-secondary p-4">
          {!mounted ? (
            <div className="h-32 animate-pulse rounded bg-border/30" />
          ) : (
            <ResponsiveContainer width="100%" height={128}>
              <BarChart data={hourlyActivity} barCategoryGap="10%">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 9, fill: "var(--color-text-secondary)" }}
                  tickFormatter={(v: number) => (v % 4 === 0 ? `${v.toString().padStart(2, "0")}h` : "")}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip content={<HourlyTooltip />} />
                <Bar dataKey="requests" name="Requests" radius={[2, 2, 0, 0]}>
                  {hourlyActivity.map((entry) => (
                    <Cell
                      key={entry.hour}
                      fill={
                        entry.hour === peakHour.hour && entry.requests > 0
                          ? "var(--color-accent)"
                          : "var(--color-text-secondary)"
                      }
                      opacity={0.7}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top users */}
      {topUsers.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-text-primary">Top Users by Cost</h3>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-bg-secondary">
                  <th className="px-3 py-2 text-left font-medium text-text-secondary">#</th>
                  <th className="px-3 py-2 text-left font-medium text-text-secondary">IP</th>
                  <th className="px-3 py-2 text-right font-medium text-text-secondary">Requests</th>
                  <th className="px-3 py-2 text-right font-medium text-text-secondary">Input Tok</th>
                  <th className="px-3 py-2 text-right font-medium text-text-secondary">Output Tok</th>
                  <th className="px-3 py-2 text-right font-medium text-text-secondary">Cost</th>
                </tr>
              </thead>
              <tbody>
                {topUsers.slice(0, 8).map((user, i) => (
                  <tr key={user.ip} className="border-b border-border/50 last:border-0 hover:bg-bg-secondary/50">
                    <td className="px-3 py-2 font-mono text-text-secondary/50">{i + 1}</td>
                    <td className="px-3 py-2 font-mono text-text-secondary">{user.ip}</td>
                    <td className="px-3 py-2 text-right font-mono text-text-primary">{user.requests}</td>
                    <td className="px-3 py-2 text-right font-mono text-text-secondary">{(user.inputTokens / 1000).toFixed(1)}k</td>
                    <td className="px-3 py-2 text-right font-mono text-text-secondary">{(user.outputTokens / 1000).toFixed(1)}k</td>
                    <td className="px-3 py-2 text-right font-mono font-semibold text-text-primary">{formatCost(user.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Model breakdown */}
      {modelBreakdown.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-text-primary">Model Breakdown</h3>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-bg-secondary">
                  <th className="px-3 py-2 text-left font-medium text-text-secondary">Model</th>
                  <th className="px-3 py-2 text-right font-medium text-text-secondary">Rate (in/out)</th>
                  <th className="px-3 py-2 text-right font-medium text-text-secondary">Requests</th>
                  <th className="px-3 py-2 text-right font-medium text-text-secondary">Input Tok</th>
                  <th className="px-3 py-2 text-right font-medium text-text-secondary">Output Tok</th>
                  <th className="px-3 py-2 text-right font-medium text-text-secondary">Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {modelBreakdown.map((row) => (
                  <tr key={row.model} className="border-b border-border/50 last:border-0 hover:bg-bg-secondary/50">
                    <td className="px-3 py-2 font-mono text-text-primary">{row.model}</td>
                    <td className="px-3 py-2 text-right font-mono text-text-secondary">
                      ${row.inputRate}/${row.outputRate}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-text-primary">{row.requests.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right font-mono text-text-secondary">{(row.inputTokens / 1000).toFixed(1)}k</td>
                    <td className="px-3 py-2 text-right font-mono text-text-secondary">{(row.outputTokens / 1000).toFixed(1)}k</td>
                    <td className="px-3 py-2 text-right font-mono font-semibold text-text-primary">{formatCost(row.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-right text-[10px] text-text-secondary/50">
            Rates per million tokens (MTok) · Sourced from OpenRouter
          </p>
        </div>
      )}
    </div>
  );
}
