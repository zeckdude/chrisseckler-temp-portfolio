"use client";

import { useChatContext } from "@/lib/chat-context";
import { cn } from "@/lib/utils";

/** Shifts the page content left to make room for the chat sidebar on sm+ screens. */
export function ChatLayoutShift({ children }: { children: React.ReactNode }) {
  const { chatOpen } = useChatContext();
  return (
    <div
      className={cn(
        "flex flex-1 flex-col transition-[padding-right] duration-300 ease-in-out",
        chatOpen ? "sm:pr-[420px]" : "",
      )}
    >
      {children}
    </div>
  );
}
