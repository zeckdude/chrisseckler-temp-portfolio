"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useChatContext } from "@/lib/chat-context";

const HEARTBEAT_INTERVAL = 15_000; // 15 seconds
const SESSION_KEY = "presence-session-id";

function getOrCreatePresenceSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

/**
 * Invisible component that sends heartbeats to /api/presence/heartbeat.
 * Tracks current page and whether the chat panel is open or streaming.
 * Add to the root layout inside <ChatProvider>.
 */
export default function PresenceTracker() {
  const pathname = usePathname();
  const { chatOpen } = useChatContext();
  const sessionId = useRef<string>("");

  useEffect(() => {
    sessionId.current = getOrCreatePresenceSessionId();
  }, []);

  useEffect(() => {
    if (!sessionId.current) return;

    function sendHeartbeat() {
      fetch("/api/presence/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId.current,
          page: pathname,
          chatActive: chatOpen,
        }),
      }).catch(() => {/* best-effort */});
    }

    // Send immediately, then on interval
    sendHeartbeat();
    const timer = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);
    return () => clearInterval(timer);
  }, [pathname, chatOpen]);

  return null;
}
