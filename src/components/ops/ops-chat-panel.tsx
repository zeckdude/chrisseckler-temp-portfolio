"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChatMarkdown } from "@/components/chat/chat-markdown";

interface OpsChatPanelProps {
  apiEndpoint: string;
  title: string;
  subtitle?: string;
  welcomeMessage: string;
  currentLogId?: string | null;
  currentLogPreview?: string | null;
  extraBody?: Record<string, unknown>;
}

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

export default function OpsChatPanel({
  apiEndpoint,
  title,
  subtitle,
  welcomeMessage,
  currentLogId,
  currentLogPreview,
  extraBody = {},
}: OpsChatPanelProps) {
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: apiEndpoint,
      body: { ...extraBody, ...(currentLogId ? { currentLogId } : {}) },
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  }, [input, isLoading, sendMessage]);

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
            <p className="text-xs font-semibold text-text-primary leading-none">{title}</p>
            {subtitle && (
              <p className="mt-0.5 text-xs text-text-secondary truncate opacity-70">{subtitle}</p>
            )}
          </div>
        </div>

        <AnimatePresence>
          {currentLogId && currentLogPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 rounded-lg border border-accent/20 bg-accent-dim/30 px-3 py-2"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-0.5">Viewing log</p>
              <p className="text-xs text-text-secondary truncate">{currentLogPreview}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <div className="flex justify-start">
          <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-accent-dim px-4 py-3">
            <ChatMarkdown text={welcomeMessage} />
          </div>
        </div>

        {messages.map((msg) => {
          if (msg.role === "user") {
            const text = msg.parts
              ?.filter((p) => p.type === "text")
              .map((p) => (p as { type: "text"; text: string }).text)
              .join("") ?? "";
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-md bg-accent px-4 py-2.5 text-sm leading-relaxed text-bg">
                  {text}
                </div>
              </div>
            );
          }

          if (msg.role === "assistant") {
            const textParts = (msg.parts ?? []).filter((p) => p.type === "text");
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

        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-border bg-surface px-3 py-3">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask anything…"
            disabled={isLoading}
            rows={1}
            className={cn(
              "flex-1 resize-none rounded-xl bg-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary",
              "focus:outline-none focus:ring-1 focus:ring-accent/50 max-h-24 overflow-y-auto",
            )}
            style={{ minHeight: "38px" }}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            aria-label="Send"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-bg transition-opacity disabled:opacity-40"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 8h12M9 3l5 5-5 5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
