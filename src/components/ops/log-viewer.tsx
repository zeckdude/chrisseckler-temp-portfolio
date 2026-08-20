"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChatMarkdown } from "@/components/chat/chat-markdown";
import type { ConversationLog } from "@/lib/conversation-logger";

interface LogViewerProps {
  log: ConversationLog;
  searchTerm: string;
  onClose: () => void;
  onNavigatePrev: () => void;
  onNavigateNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function LogViewer({
  log,
  searchTerm,
  onClose,
  onNavigatePrev,
  onNavigateNext,
  hasPrev,
  hasNext,
}: LogViewerProps) {
  const [note, setNote] = useState(log.note ?? "");
  const [editingNote, setEditingNote] = useState(false);
  const [bookmarked, setBookmarked] = useState(log.bookmarked ?? false);
  const [savingNote, setSavingNote] = useState(false);
  const [timestampRelative, setTimestampRelative] = useState(true);
  const [spotlightActive, setSpotlightActive] = useState(false);
  const [spotlightDone, setSpotlightDone] = useState(false);
  const highlightRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset state when log changes
  useEffect(() => {
    setNote(log.note ?? "");
    setBookmarked(log.bookmarked ?? false);
    setEditingNote(false);
    setSpotlightActive(false);
    setSpotlightDone(false);
  }, [log.id, log.note, log.bookmarked]);

  // Spotlight effect when there's a search term
  useEffect(() => {
    if (!searchTerm.trim()) return;
    setSpotlightActive(true);
    setSpotlightDone(false);

    // Scroll to first match after a brief delay
    setTimeout(() => {
      const el = containerRef.current?.querySelector(".search-match-highlight");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 150);

    // Fade out overlay after 1.8s
    const timer = setTimeout(() => {
      setSpotlightActive(false);
      setSpotlightDone(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, [searchTerm, log.id]);

  async function toggleBookmark() {
    const next = !bookmarked;
    setBookmarked(next);
    await fetch("/api/ops/bookmark", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: log.id }),
    }).catch(() => {});
  }

  async function saveNote() {
    setSavingNote(true);
    await fetch("/api/ops/note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: log.id, note }),
    }).catch(() => {});
    setSavingNote(false);
    setEditingNote(false);
  }

  async function copyConversation() {
    const text = log.messages
      .map((m) => `${m.role === "user" ? "Visitor" : "Assistant"}: ${m.content}`)
      .join("\n\n");
    await navigator.clipboard.writeText(text);
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(log, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conversation-${log.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function formatTimestamp(iso: string): string {
    const d = new Date(iso);
    if (timestampRelative) {
      const diff = Math.floor((Date.now() - d.getTime()) / 1000);
      if (diff < 60) return `${diff}s ago`;
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
    }
    return d.toLocaleString();
  }

  return (
    <div className="relative rounded-xl border border-border bg-surface overflow-hidden">
      {/* Spotlight overlay */}
      <AnimatePresence>
        {spotlightActive && searchTerm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 z-10 bg-bg/70 pointer-events-none rounded-xl"
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          {/* Prev/next */}
          <button
            type="button"
            onClick={onNavigatePrev}
            disabled={!hasPrev}
            title="Previous log (↑)"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-border hover:text-text-primary disabled:opacity-30"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 2L4 6l5 4" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onNavigateNext}
            disabled={!hasNext}
            title="Next log (↓)"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-border hover:text-text-primary disabled:opacity-30"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 2l5 4-5 4" />
            </svg>
          </button>

          {/* Meta */}
          <button
            type="button"
            onClick={() => setTimestampRelative((v) => !v)}
            className="text-xs text-text-secondary hover:text-text-primary transition-colors"
            title="Toggle timestamp format"
          >
            {formatTimestamp(log.startedAt)}
          </button>
          <span className="text-xs text-text-secondary">·</span>
          <span className="text-xs text-text-secondary">{log.turnCount} turns</span>
          <span className="text-xs text-text-secondary">·</span>
          <span className="text-xs text-text-secondary">{log.tokenCount.toLocaleString()} tokens</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Bookmark */}
          <button
            type="button"
            onClick={toggleBookmark}
            title={bookmarked ? "Remove bookmark" : "Bookmark"}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
              bookmarked ? "text-accent" : "text-text-secondary hover:text-text-primary",
            )}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>

          {/* Note */}
          <button
            type="button"
            onClick={() => setEditingNote((v) => !v)}
            title="Add note"
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
              note ? "text-accent" : "text-text-secondary hover:text-text-primary",
            )}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>

          {/* Copy */}
          <button
            type="button"
            onClick={copyConversation}
            title="Copy conversation"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-text-secondary transition-colors hover:text-text-primary"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>

          {/* Export */}
          <button
            type="button"
            onClick={exportJSON}
            title="Export as JSON"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-text-secondary transition-colors hover:text-text-primary"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            title="Close (Esc)"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-text-secondary transition-colors hover:text-text-primary"
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M1 1l12 12M13 1L1 13" />
            </svg>
          </button>
        </div>
      </div>

      {/* Note editor */}
      <AnimatePresence>
        {editingNote && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-border px-4 py-3"
          >
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a personal note about this conversation…"
              rows={2}
              className="w-full resize-none rounded-lg bg-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent/50"
            />
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={saveNote}
                disabled={savingNote}
                className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-bg transition-opacity disabled:opacity-50"
              >
                {savingNote ? "Saving…" : "Save note"}
              </button>
              <button
                type="button"
                onClick={() => { setNote(log.note ?? ""); setEditingNote(false); }}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Note display */}
      {note && !editingNote && (
        <div className="border-b border-border bg-accent-dim/20 px-4 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-1">Note</p>
          <p className="text-sm text-text-primary">{note}</p>
        </div>
      )}

      {/* Messages */}
      <div ref={containerRef} className="relative z-20 max-h-[480px] overflow-y-auto px-4 py-4 space-y-3">
        {log.messages.map((msg, i) => (
          <MessageBubble
            key={i}
            role={msg.role}
            content={msg.content}
            searchTerm={searchTerm}
            spotlightActive={spotlightActive}
            isFirst={i === 0}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Message bubble with search highlighting ───────────────────────────── */
function MessageBubble({
  role,
  content,
  searchTerm,
  spotlightActive,
  isFirst,
}: {
  role: "user" | "assistant";
  content: string;
  searchTerm: string;
  spotlightActive: boolean;
  isFirst: boolean;
}) {
  const hasMatch = searchTerm.trim() && content.toLowerCase().includes(searchTerm.toLowerCase());

  return (
    <motion.div
      layout
      className={cn(
        "relative flex",
        role === "user" ? "justify-end" : "justify-start",
      )}
    >
      {/* Spotlight highlight for matched messages */}
      {hasMatch && spotlightActive && (
        <motion.div
          className="absolute inset-0 -mx-2 rounded-xl ring-2 ring-accent/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      <div
        className={cn(
          "search-match-highlight max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed relative z-20",
          role === "user"
            ? "rounded-br-md bg-accent text-bg"
            : "rounded-bl-md bg-bg text-text-primary",
          hasMatch && !spotlightActive && "ring-1 ring-accent/30",
        )}
      >
        {role === "assistant" ? (
          <ChatMarkdown text={highlightSearchTermInText(content, searchTerm)} />
        ) : (
          <span
            dangerouslySetInnerHTML={{
              __html: highlightSearchTermHtml(content, searchTerm),
            }}
          />
        )}
      </div>
    </motion.div>
  );
}

function highlightSearchTermInText(text: string, term: string): string {
  if (!term.trim()) return text;
  return text; // For assistant messages rendered via ChatMarkdown, skip HTML injection
}

function highlightSearchTermHtml(text: string, term: string): string {
  if (!term.trim()) return escapeHtml(text);
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return escapeHtml(text).replace(
    new RegExp(`(${escaped})`, "gi"),
    '<mark class="bg-accent/40 text-bg rounded px-0.5 font-semibold">$1</mark>',
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
