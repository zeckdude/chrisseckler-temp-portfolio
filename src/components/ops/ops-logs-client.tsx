"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ConversationLog } from "@/lib/conversation-logger";
import OpsChatPanel from "./ops-chat-panel";
import LogViewer from "./log-viewer";
import Link from "next/link";

interface LogFilterState {
  query: string;
  minTurns?: number;
  maxTurns?: number;
  dateFrom?: string;
  dateTo?: string;
  bookmarked?: boolean;
}

interface OpsLogsClientProps {
  initialLogs: ConversationLog[];
  total: number;
  initialPage: number;
  initialSearch: string;
  initialOpenId: string | null;
}

export default function OpsLogsClient({
  initialLogs,
  total,
  initialPage,
  initialSearch,
  initialOpenId,
}: OpsLogsClientProps) {
  const router = useRouter();
  const searchParamsHook = useSearchParams();

  const [logs] = useState(initialLogs);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [openLogId, setOpenLogId] = useState<string | null>(initialOpenId);
  const [searchHighlight, setSearchHighlight] = useState(initialSearch);

  // AI filter state
  const [aiFilter, setAiFilter] = useState<LogFilterState | null>(null);
  const [aiFilterReason, setAiFilterReason] = useState<string | null>(null);

  const openLog = openLogId ? logs.find((l) => l.id === openLogId) ?? null : null;
  const openLogPreview = openLog?.messages.find((m) => m.role === "user")?.content?.slice(0, 80) ?? null;

  const pageSize = 25;
  const totalPages = Math.ceil(total / pageSize);

  // Apply filters to log list
  const filteredLogs = aiFilter
    ? logs.filter((log) => {
        if (aiFilter.query) {
          const q = aiFilter.query.toLowerCase();
          if (!log.messages.some((m) => m.content.toLowerCase().includes(q))) return false;
        }
        if (aiFilter.minTurns !== undefined && log.turnCount < aiFilter.minTurns) return false;
        if (aiFilter.maxTurns !== undefined && log.turnCount > aiFilter.maxTurns) return false;
        if (aiFilter.dateFrom && new Date(log.startedAt) < new Date(aiFilter.dateFrom)) return false;
        if (aiFilter.dateTo && new Date(log.startedAt) > new Date(aiFilter.dateTo)) return false;
        if (aiFilter.bookmarked && !log.bookmarked) return false;
        return true;
      })
    : logs;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParamsHook?.toString() ?? "");
    if (searchInput) {
      params.set("q", searchInput);
    } else {
      params.delete("q");
    }
    params.set("page", "1");
    router.push(`/ops/logs?${params.toString()}`);
  }

  function openLogEntry(id: string) {
    setOpenLogId(id);
    setSearchHighlight(searchInput || aiFilter?.query || "");
    const params = new URLSearchParams(searchParamsHook?.toString() ?? "");
    params.set("id", id);
    router.replace(`/ops/logs?${params.toString()}`, { scroll: false });
  }

  function closeLogEntry() {
    setOpenLogId(null);
    const params = new URLSearchParams(searchParamsHook?.toString() ?? "");
    params.delete("id");
    router.replace(`/ops/logs?${params.toString()}`, { scroll: false });
  }

  function clearAiFilter() {
    setAiFilter(null);
    setAiFilterReason(null);
  }

  // Handle filterLogs tool output from the chatbot
  function handleFilterToolOutput(output: {
    query?: string;
    minTurns?: number;
    maxTurns?: number;
    dateFrom?: string;
    dateTo?: string;
    bookmarked?: boolean;
    reason?: string;
  }) {
    setAiFilter({
      query: output.query ?? "",
      minTurns: output.minTurns,
      maxTurns: output.maxTurns,
      dateFrom: output.dateFrom,
      dateTo: output.dateTo,
      bookmarked: output.bookmarked,
    });
    setAiFilterReason(output.reason ?? null);
  }

  // Keyboard navigation between logs
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!filteredLogs.length) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        const idx = openLogId ? filteredLogs.findIndex((l) => l.id === openLogId) : -1;
        if (e.key === "ArrowDown" && idx < filteredLogs.length - 1) {
          e.preventDefault();
          openLogEntry(filteredLogs[idx + 1].id);
        }
        if (e.key === "ArrowUp" && idx > 0) {
          e.preventDefault();
          openLogEntry(filteredLogs[idx - 1].id);
        }
      }
      if (e.key === "Escape" && openLogId) {
        closeLogEntry();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openLogId, filteredLogs]);

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-10">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/ops"
          className="flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 2L4 7l5 5" />
          </svg>
          Ops
        </Link>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-border">
          <path d="M5 2l4 5-4 5" />
        </svg>
        <h1 className="font-display text-xl font-extrabold text-text-primary">Conversation Logs</h1>
        <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-text-secondary ring-1 ring-border">
          {total} total
        </span>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="6" cy="6" r="4" />
            <path d="M9.5 9.5L13 13" />
          </svg>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search all conversations…"
            className="w-full rounded-xl border border-border bg-surface py-2.5 pl-9 pr-4 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
        >
          Search
        </button>
        {(initialSearch || aiFilter) && (
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              clearAiFilter();
              router.push("/ops/logs");
            }}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            Clear
          </button>
        )}
      </form>

      {/* AI filter notice */}
      <AnimatePresence>
        {aiFilter && aiFilterReason && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-4 rounded-xl border border-accent/30 bg-surface px-5 py-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-dim">
                  <svg width="13" height="13" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                    <path d="M15 11.5a2 2 0 01-2 2H5l-3 3V4a2 2 0 012-2h9a2 2 0 012 2v7.5z" />
                    <path d="M6 7h6M6 10h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                    Assistant filter active
                  </p>
                  <p className="mt-1 text-sm text-text-primary">{aiFilterReason}</p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {filteredLogs.length} of {logs.length} logs shown
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={clearAiFilter}
                className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:text-text-primary"
              >
                Show all
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard hint */}
      {openLogId && (
        <p className="mb-3 text-xs text-text-secondary">
          ↑↓ navigate logs · Esc close
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Log list */}
        <div className="space-y-2">
          {filteredLogs.length === 0 && (
            <div className="rounded-xl border border-border bg-surface px-5 py-8 text-center">
              <p className="text-sm text-text-secondary">No conversations match this filter.</p>
            </div>
          )}

          {filteredLogs.map((log) => (
            <LogListItem
              key={log.id}
              log={log}
              isOpen={openLogId === log.id}
              searchTerm={searchInput || aiFilter?.query || ""}
              onClick={() => {
                if (openLogId === log.id) {
                  closeLogEntry();
                } else {
                  openLogEntry(log.id);
                }
              }}
            />
          ))}

          {/* Pagination */}
          {totalPages > 1 && !aiFilter && (
            <div className="flex items-center justify-center gap-2 pt-4">
              {initialPage > 1 && (
                <Link
                  href={`/ops/logs?page=${initialPage - 1}${initialSearch ? `&q=${encodeURIComponent(initialSearch)}` : ""}`}
                  className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary"
                >
                  ← Prev
                </Link>
              )}
              <span className="text-sm text-text-secondary">
                Page {initialPage} of {totalPages}
              </span>
              {initialPage < totalPages && (
                <Link
                  href={`/ops/logs?page=${initialPage + 1}${initialSearch ? `&q=${encodeURIComponent(initialSearch)}` : ""}`}
                  className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary"
                >
                  Next →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Right column: log viewer + chatbot */}
        <div className="lg:sticky lg:top-8 space-y-4 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto">
          {/* Log viewer */}
          <AnimatePresence>
            {openLog && (
              <motion.div
                key={openLog.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <LogViewer
                  log={openLog}
                  searchTerm={searchHighlight}
                  onClose={closeLogEntry}
                  onNavigatePrev={() => {
                    const idx = filteredLogs.findIndex((l) => l.id === openLog.id);
                    if (idx > 0) openLogEntry(filteredLogs[idx - 1].id);
                  }}
                  onNavigateNext={() => {
                    const idx = filteredLogs.findIndex((l) => l.id === openLog.id);
                    if (idx < filteredLogs.length - 1) openLogEntry(filteredLogs[idx + 1].id);
                  }}
                  hasPrev={filteredLogs.findIndex((l) => l.id === openLog.id) > 0}
                  hasNext={filteredLogs.findIndex((l) => l.id === openLog.id) < filteredLogs.length - 1}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Logs chatbot */}
          <div className="h-[520px]">
            <LogsChatbot
              openLogId={openLogId}
              openLogPreview={openLogPreview}
              onFilterLogs={handleFilterToolOutput}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Log list item ─────────────────────────────────────────────────────── */
function LogListItem({
  log,
  isOpen,
  searchTerm,
  onClick,
}: {
  log: ConversationLog;
  isOpen: boolean;
  searchTerm: string;
  onClick: () => void;
}) {
  const firstMessage = log.messages.find((m) => m.role === "user")?.content ?? "";
  const preview = highlightText(firstMessage.slice(0, 140), searchTerm);
  const date = new Date(log.startedAt);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border px-5 py-4 text-left transition-all",
        isOpen
          ? "border-accent/40 bg-accent-dim/20"
          : "border-border bg-surface hover:border-accent/20 hover:bg-surface/80",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-text-primary line-clamp-2 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: preview }} />
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1">
          {log.bookmarked && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#38bdf8" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          )}
          <span className="rounded-full bg-bg px-2 py-0.5 text-xs text-text-secondary ring-1 ring-border">
            {log.turnCount} turns
          </span>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-3 text-xs text-text-secondary">
        <span>{date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
        <span>·</span>
        <span>{date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</span>
        <span>·</span>
        <span>{log.tokenCount.toLocaleString()} tokens</span>
        {log.note && (
          <>
            <span>·</span>
            <span className="text-accent">has note</span>
          </>
        )}
      </div>
    </button>
  );
}

/** Wrap matched text in a highlight span */
function highlightText(text: string, term: string): string {
  if (!term.trim()) return escapeHtml(text);
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return escapeHtml(text).replace(
    new RegExp(`(${escaped})`, "gi"),
    '<mark class="bg-accent/30 text-text-primary rounded px-0.5">$1</mark>',
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ─── Logs chatbot (handles filterLogs tool) ────────────────────────────── */
function LogsChatbot({
  openLogId,
  openLogPreview,
  onFilterLogs,
}: {
  openLogId: string | null;
  openLogPreview: string | null;
  onFilterLogs: (output: {
    query?: string;
    minTurns?: number;
    maxTurns?: number;
    dateFrom?: string;
    dateTo?: string;
    bookmarked?: boolean;
    reason?: string;
  }) => void;
}) {
  // We need to intercept the filterLogs tool output from the chat stream.
  // OpsChatPanel handles rendering but we need its messages to watch for tool outputs.
  // We'll use a wrapper that passes tool handlers down.
  return (
    <LogsChatPanelWithFilter
      openLogId={openLogId}
      openLogPreview={openLogPreview}
      onFilterLogs={onFilterLogs}
    />
  );
}

/* ─── Extended chat panel that watches for filterLogs tool outputs ───────── */
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ChatMarkdown } from "@/components/chat/chat-markdown";
import { motion as m } from "framer-motion";

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-label="Thinking">
      {[0, 1, 2].map((i) => (
        <m.span
          key={i}
          className="block h-1.5 w-1.5 rounded-full bg-current"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

function LogsChatPanelWithFilter({
  openLogId,
  openLogPreview,
  onFilterLogs,
}: {
  openLogId: string | null;
  openLogPreview: string | null;
  onFilterLogs: (output: Record<string, unknown>) => void;
}) {
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ops-logs-chat",
      body: openLogId ? { currentLogId: openLogId } : {},
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Watch for filterLogs tool output
  useEffect(() => {
    for (const msg of messages) {
      if (msg.role !== "assistant") continue;
      for (const part of msg.parts ?? []) {
        if (
          part.type === "tool-filterLogs" &&
          (part as { state?: string }).state === "output-available"
        ) {
          const output = (part as { output?: Record<string, unknown> }).output;
          if (output) onFilterLogs(output);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  }, [input, isLoading, sendMessage]);

  const WELCOME = "Hi! I can search and filter your conversation logs. Try \"show me logs where people asked about my AI work\" or \"find conversations with 5+ turns\".";

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-surface overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-border bg-surface/80 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-dim">
            <svg width="12" height="12" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
              <path d="M15 11.5a2 2 0 01-2 2H5l-3 3V4a2 2 0 012-2h9a2 2 0 012 2v7.5z" />
              <path d="M6 7h6M6 10h4" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-text-primary leading-none">Log Explorer</p>
            <p className="mt-0.5 text-xs text-text-secondary opacity-70">Filter logs with AI</p>
          </div>
        </div>
        <AnimatePresence>
          {openLogId && openLogPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 rounded-lg border border-accent/20 bg-accent-dim/30 px-3 py-2"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-0.5">Viewing log</p>
              <p className="text-xs text-text-secondary truncate">{openLogPreview}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <div className="flex justify-start">
          <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-accent-dim px-4 py-3">
            <ChatMarkdown text={WELCOME} />
          </div>
        </div>

        {messages.map((msg) => {
          if (msg.role === "user") {
            const text = msg.parts?.filter((p) => p.type === "text").map((p) => (p as { type: "text"; text: string }).text).join("") ?? "";
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-md bg-accent px-4 py-2.5 text-sm leading-relaxed text-bg">{text}</div>
              </div>
            );
          }
          if (msg.role === "assistant") {
            const textParts = (msg.parts ?? []).filter((p) => p.type === "text");
            const filterPart = msg.parts?.find((p) => p.type === "tool-filterLogs");
            return (
              <div key={msg.id} className="space-y-2">
                {textParts.map((part, i) => {
                  const text = (part as { type: "text"; text: string }).text;
                  if (!text) return null;
                  return (
                    <div key={i} className="flex justify-start">
                      <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-surface px-4 py-3 text-text-primary">
                        <ChatMarkdown text={text} />
                      </div>
                    </div>
                  );
                })}
                {filterPart && (
                  <div className="flex justify-start">
                    <div className="rounded-xl border border-accent/30 bg-accent-dim/30 px-3 py-2 text-xs text-accent">
                      ↑ Filter applied to log list
                    </div>
                  </div>
                )}
              </div>
            );
          }
          return null;
        })}

        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md bg-surface px-4 py-3 text-text-secondary"><TypingDots /></div>
          </div>
        )}
        {error && <p className="rounded-xl bg-red-950/40 px-4 py-3 text-sm text-red-400">Something went wrong.</p>}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-border bg-surface px-3 py-3">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Ask or filter…"
            disabled={isLoading}
            rows={1}
            className={cn("flex-1 resize-none rounded-xl bg-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent/50 max-h-24 overflow-y-auto")}
            style={{ minHeight: "38px" }}
          />
          <button type="button" onClick={handleSend} disabled={!input.trim() || isLoading} aria-label="Send"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-bg transition-opacity disabled:opacity-40">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 8h12M9 3l5 5-5 5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
