"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatContext } from "@/lib/chat-context";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

export default function InlineChatPrompt() {
  const { setChatOpen } = useChatContext();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="mb-8 flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-dim">
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
            <path d="M15 11.5a2 2 0 01-2 2H5l-3 3V4a2 2 0 012-2h9a2 2 0 012 2v7.5z" />
            <path d="M6 7h6M6 10h4" />
          </svg>
        </div>
        <p className="flex-1 text-sm text-text-secondary">
          Not sure where to start?{" "}
          <button
            type="button"
            onClick={() => setChatOpen(true)}
            className="font-medium text-text-primary underline underline-offset-2 hover:text-accent"
          >
            Ask the AI assistant
          </button>{" "}
          to find projects by type or tech — or use the filter chips below.
        </p>
        <button
          type="button"
          onClick={() => {
            track("chat prompt dismissed");
            setDismissed(true);
          }}
          aria-label="Dismiss"
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
            "text-text-secondary transition-colors hover:bg-border hover:text-text-primary",
          )}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M1 1l8 8M9 1L1 9" />
          </svg>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
