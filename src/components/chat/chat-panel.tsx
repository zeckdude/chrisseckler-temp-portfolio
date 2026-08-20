"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useChatContext } from "@/lib/chat-context";
import { ChatMarkdown } from "@/components/chat/chat-markdown";
import { emptyFilter, type FilterState } from "@/lib/filter-utils";
import { projects, type BadgeType } from "@/lib/projects";
import { track } from "@/lib/analytics";

const WELCOME =
  "Hi! I'm Chris's portfolio assistant. Ask me about his projects, experience, or skills — or ask me to filter the projects list.";

const MAX_TURNS = 40;       // total messages (user + assistant) before the hard stop
const USER_TURN_LIMIT = 20; // displayed to the user — how many messages they personally get
const CHAT_STORAGE_KEY = "portfolio-chat";
const SESSION_ID_KEY = "portfolio-chat-session";
const SIDEBAR_W = 420;

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = sessionStorage.getItem(SESSION_ID_KEY);
    if (!id) {
      id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(SESSION_ID_KEY, id);
    }
    return id;
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

function loadStoredMessages() {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(-MAX_TURNS) : undefined;
  } catch {
    return undefined;
  }
}

type NavLink = { label: string; url: string };

const BADGE_LABELS: Record<BadgeType, string> = {
  professional: "Employed",
  personal:     "Personal Project",
  freelance:    "Freelance",
};

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-label="Thinking">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-1.5 w-1.5 rounded-full bg-current"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

export default function ChatPanel() {
  const { chatOpen, setChatOpen, setFilter, clearFilter } = useChatContext();
  const router = useRouter();
  const endRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const [initialMessages] = useState(() => loadStoredMessages());
  const [sessionId] = useState(() => getOrCreateSessionId());

  const { messages, sendMessage, setMessages, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { sessionId },
    }),
    ...(initialMessages ? { messages: initialMessages } : {}),
  });

  const isLoading = status === "streaming" || status === "submitted";
  const turnCount = messages.filter((m) => m.role === "user").length;
  const atLimit = turnCount >= USER_TURN_LIMIT;

  // Persist messages to localStorage after each update (capped at MAX_TURNS)
  useEffect(() => {
    if (!messages.length) return;
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages.slice(-MAX_TURNS)));
    } catch {
      // storage full or unavailable — silent fail
    }
  }, [messages]);

  function startNewConversation() {
    setMessages([]);
    try {
      localStorage.removeItem(CHAT_STORAGE_KEY);
      // Generate a fresh session ID for the new conversation
      const newId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(SESSION_ID_KEY, newId);
    } catch { /* noop */ }
    clearFilter();
  }

  // Process tool results from assistant messages
  useEffect(() => {
    for (const msg of messages) {
      if (msg.role !== "assistant") continue;
      for (const part of msg.parts ?? []) {
        if (part.type === "tool-filterProjects" && (part as { state?: string }).state === "output-available") {
          const output = (part as { output?: { slugs?: string[]; badges?: BadgeType[]; techStack?: string[]; companies?: string[] } }).output;
          const next: FilterState = {
            ...emptyFilter(),
            slugs:     new Set(output?.slugs     ?? []),
            badges:    new Set(output?.badges    ?? []),
            techStack: new Set(output?.techStack ?? []),
            companies: new Set(output?.companies ?? []),
          };
          setFilter(next, true);
        }
      }
    }
  }, [messages, setFilter]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatOpen) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatOpen]);

  const captureChatSend = useCallback((text: string) => {
    const userTurns = messages.filter((m) => m.role === "user").length;
    if (userTurns === 0) track("chat conversation started");
    track("chat message sent", { length: text.length, suggested: false });
  }, [messages]);

  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading || atLimit) return;
    captureChatSend(input);
    sendMessage({ text: input });
    setInput("");
  }, [input, isLoading, atLimit, sendMessage, captureChatSend]);

  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  return (
    <AnimatePresence>
      {chatOpen && (
        <>
          {/* Backdrop — mobile only */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 sm:hidden"
            onClick={() => setChatOpen(false)}
          />

          {/* Sidebar */}
          <motion.aside
            key="sidebar"
            initial={{ x: SIDEBAR_W }}
            animate={{ x: 0 }}
            exit={{ x: SIDEBAR_W }}
            transition={{ duration: 0.28, ease: [0.32, 0, 0.12, 1] }}
            className="fixed inset-y-0 right-0 z-50 flex flex-col border-l border-border bg-bg shadow-2xl"
            style={{ width: `min(${SIDEBAR_W}px, 100vw)` }}
            aria-label="Portfolio assistant"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-dim">
                  <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                    <path d="M15 11.5a2 2 0 01-2 2H5l-3 3V4a2 2 0 012-2h9a2 2 0 012 2v7.5z" />
                    <path d="M6 7h6M6 10h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary leading-none">Portfolio Assistant</p>
                  <p className="mt-0.5 text-[10px] text-text-secondary">Powered by Claude</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={startNewConversation}
                  title="New conversation"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-border hover:text-text-primary"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 7A5 5 0 1 1 7 12" />
                    <path d="M2 7V4M2 7H5" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setChatOpen(false)}
                  aria-label="Close chat"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-border hover:text-text-primary"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M1 1l12 12M13 1L1 13" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              <AssistantBubble content={WELCOME} isWelcome />

              {messages.length === 0 && (
                <SuggestedQuestions onSend={(q) => {
                  const userTurns = messages.filter((m) => m.role === "user").length;
                  if (userTurns === 0) track("chat conversation started");
                  track("chat message sent", { length: q.length, suggested: true });
                  sendMessage({ text: q });
                  setInput("");
                }} />
              )}

              {messages.map((msg) => {
                if (msg.role === "user") {
                  const text = msg.parts
                    ?.filter((p) => p.type === "text")
                    .map((p) => (p as { type: "text"; text: string }).text)
                    .join("");
                  return <UserBubble key={msg.id} content={text ?? ""} />;
                }

                if (msg.role === "assistant") {
                  const textParts = (msg.parts ?? []).filter((p) => p.type === "text");
                  const filterPart = msg.parts?.find((p) => p.type === "tool-filterProjects");
                  const navPart = msg.parts?.find((p) => p.type === "tool-suggestNavigation");
                  const navLinks: NavLink[] =
                    (navPart as { output?: { links: NavLink[] } } | undefined)?.output?.links ?? [];

                  return (
                    <div key={msg.id} className="space-y-3">
                      {textParts.map((part, i) => {
                        const text = (part as { type: "text"; text: string }).text;
                        if (!text) return null;
                        return <AssistantBubble key={i} content={text} />;
                      })}

                      {filterPart && (
                        <FilterChip
                          output={(filterPart as { output?: { slugs?: string[]; badges?: BadgeType[]; techStack?: string[]; companies?: string[] } }).output}
                          onClear={clearFilter}
                        />
                      )}

                      {navLinks.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {navLinks.map((link, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => { router.push(link.url); setChatOpen(false); }}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent-dim px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/20"
                            >
                              {link.label}
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 5h6M5 2l3 3-3 3" />
                              </svg>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return null;
              })}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md bg-surface px-4 py-3 text-text-secondary">
                    <TypingDots />
                  </div>
                </div>
              )}

              {error && (
                <p className="rounded-xl bg-red-950/40 px-4 py-3 text-sm text-red-400">
                  Something went wrong. Please try again.
                </p>
              )}

              {atLimit && (
                <p className="rounded-xl bg-surface px-4 py-3 text-center text-xs text-text-secondary">
                  You've reached the 20-message limit.{" "}
                  <button type="button" onClick={startNewConversation} className="underline hover:text-text-primary">
                    Start a new conversation
                  </button>
                </p>
              )}

              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-border bg-surface px-4 py-4">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder={atLimit ? "Conversation limit reached" : "Ask me anything…"}
                  disabled={isLoading || atLimit}
                  rows={1}
                  className={cn(
                    "flex-1 resize-none rounded-xl bg-bg px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-secondary",
                    "focus:outline-none focus:ring-1 focus:ring-accent/50 max-h-32 overflow-y-auto",
                  )}
                  style={{ minHeight: "42px" }}
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading || atLimit}
                  aria-label="Send message"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-bg transition-opacity disabled:opacity-40"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 8h12M9 3l5 5-5 5" />
                  </svg>
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-text-secondary/50">
                {turnCount}/{USER_TURN_LIMIT} messages · Conversations may be reviewed to improve responses
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────── */

function AssistantBubble({ content, isWelcome }: { content: string; isWelcome?: boolean }) {
  return (
    <div className="flex justify-start">
      <div className={cn(
        "max-w-[90%] rounded-2xl rounded-bl-md px-4 py-3",
        isWelcome ? "bg-accent-dim text-text-primary" : "bg-surface text-text-primary",
      )}>
        <ChatMarkdown text={content} />
      </div>
    </div>
  );
}

function UserBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-accent px-4 py-2.5 text-sm leading-relaxed text-bg">
        {content}
      </div>
    </div>
  );
}

const SUGGESTED_QUESTIONS = [
  "What's the most technically complex problem Chris has solved?",
  "What makes Chris different from other senior frontend engineers?",
  "Tell me about Chris's AI engineering work",
];

function SuggestedQuestions({ onSend }: { onSend: (q: string) => void }) {
  return (
    <div className="flex flex-col gap-2 pt-1">
      {SUGGESTED_QUESTIONS.map((q) => (
        <button
          key={q}
          type="button"
          onClick={() => onSend(q)}
          className="rounded-xl border border-border bg-surface px-3.5 py-2.5 text-left text-xs text-text-secondary transition-colors hover:border-accent/40 hover:bg-accent-dim hover:text-text-primary"
        >
          {q}
        </button>
      ))}
    </div>
  );
}

function FilterChip({
  output,
  onClear,
}: {
  output?: { slugs?: string[]; badges?: BadgeType[]; techStack?: string[]; companies?: string[] };
  onClear: () => void;
}) {
  const router = useRouter();
  if (!output) return null;

  const matchedProjects = (output.slugs ?? [])
    .map((s) => projects.find((p) => p.slug === s))
    .filter(Boolean) as typeof projects;

  // Non-slug filter: simple chip
  const hasNonSlugFilter =
    (output.badges?.length ?? 0) > 0 ||
    (output.companies?.length ?? 0) > 0 ||
    (output.techStack?.length ?? 0) > 0;

  if (matchedProjects.length === 0 && !hasNonSlugFilter) return null;

  // Slug filter: render rich project cards
  if (matchedProjects.length > 0) {
    return (
      <div className="space-y-2">
        {matchedProjects.map((p) => (
          <div
            key={p.slug}
            className="rounded-xl border border-border bg-surface px-4 py-3 space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-text-primary leading-snug">{p.title}</p>
                {p.company && (
                  <p className="text-[11px] text-text-secondary mt-0.5">@ {p.company}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => { router.push(`/projects/${p.slug}`); }}
                className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-accent px-2.5 py-1 text-[11px] font-semibold text-bg transition-opacity hover:opacity-80"
              >
                View Case Study
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 5h6M5 2l3 3-3 3" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
              {p.tagline}
            </p>
            {p.outcome && (
              <p className="text-xs text-text-primary/80 leading-relaxed line-clamp-2 border-t border-border pt-2">
                {p.outcome}
              </p>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={onClear}
          className="text-[11px] text-accent hover:underline"
        >
          ← Show all projects
        </button>
      </div>
    );
  }

  // Non-slug filter: compact chip
  const parts: string[] = [
    ...(output.badges?.map((b) => BADGE_LABELS[b]) ?? []),
    ...(output.companies?.map((c) => `@ ${c}`) ?? []),
    ...(output.techStack ?? []),
  ];
  return (
    <div className="flex items-start gap-2 rounded-xl bg-surface px-3 py-2 text-xs">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" className="mt-0.5 shrink-0 text-accent" strokeLinecap="round">
        <path d="M1 3h10M3 6h6M5 9h2" />
      </svg>
      <span className="flex-1 text-text-secondary">
        Filtered:{" "}
        <span className="font-medium text-text-primary">{parts.join(", ")}</span>
      </span>
      <button
        type="button"
        onClick={onClear}
        className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium text-accent hover:bg-accent-dim"
      >
        Show all
      </button>
    </div>
  );
}
