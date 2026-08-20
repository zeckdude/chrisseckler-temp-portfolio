"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useChatContext } from "@/lib/chat-context";

export default function ChatButton() {
  const { chatOpen, setChatOpen } = useChatContext();
  return (
    <AnimatePresence>
      {!chatOpen && (
        <motion.button
          key="chat-btn"
          type="button"
          onClick={() => setChatOpen(true)}
          aria-label="Open portfolio assistant"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-bg shadow-lg"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 11.5a2 2 0 01-2 2H5l-3 3V4a2 2 0 012-2h9a2 2 0 012 2v7.5z" />
            <path d="M6 7h6M6 10h4" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
