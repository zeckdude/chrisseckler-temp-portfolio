"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Session {
  sessionId: string;
  page: string;
  chatActive: boolean;
  ip: string;
  lastSeen: string;
  env: string;
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 5) return "just now";
  if (diff < 60) return `${diff}s ago`;
  return `${Math.floor(diff / 60)}m ago`;
}

export default function PresencePanel() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  async function fetchSessions() {
    try {
      const res = await fetch("/api/presence/active");
      const data = await res.json();
      setSessions(data.sessions ?? []);
      setLastUpdated(new Date());
    } catch { /* ignore */ }
  }

  useEffect(() => {
    fetchSessions();
    const timer = setInterval(fetchSessions, 10_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn(
            "h-2 w-2 rounded-full",
            sessions.length > 0 ? "bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.4)]" : "bg-border",
          )} />
          <h2 className="text-sm font-semibold text-text-primary">Live Visitors</h2>
          {sessions.length > 0 && (
            <span className="rounded-full bg-emerald-950 px-2 py-0.5 text-xs font-semibold text-emerald-400">
              {sessions.length}
            </span>
          )}
        </div>
        {lastUpdated && (
          <span className="text-xs text-text-secondary">
            Updated {timeAgo(lastUpdated.toISOString())}
          </span>
        )}
      </div>

      {sessions.length === 0 ? (
        <p className="text-sm text-text-secondary">No active visitors right now.</p>
      ) : (
        <div className="space-y-2">
          {sessions.map((s) => (
            <div key={s.sessionId} className="flex items-center gap-3 rounded-lg border border-border bg-bg px-3 py-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-primary truncate">{s.page}</span>
                  {s.chatActive && (
                    <span className="shrink-0 rounded-full bg-accent-dim px-1.5 py-0.5 text-xs font-medium text-accent">
                      chat active
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-text-secondary">
                  {s.ip === "unknown" ? "unknown IP" : s.ip} · {timeAgo(s.lastSeen)} · {s.env}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
