"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { emptyFilter, type FilterState } from "@/lib/filter-utils";
import type { BadgeType } from "@/lib/projects";
import { track } from "@/lib/analytics";

const FILTER_KEY = "portfolio-filter";

interface PersistedFilter {
  badges: BadgeType[];
  techStack: string[];
  companies: string[];
  slugs: string[];
  aiFilterActive: boolean;
}

function loadFilter(): { filter: FilterState; aiFilterActive: boolean } {
  if (typeof window === "undefined") return { filter: emptyFilter(), aiFilterActive: false };
  try {
    const raw = sessionStorage.getItem(FILTER_KEY);
    if (!raw) return { filter: emptyFilter(), aiFilterActive: false };
    const data = JSON.parse(raw) as PersistedFilter;
    return {
      filter: {
        badges:    new Set(data.badges    ?? []),
        techStack: new Set(data.techStack ?? []),
        companies: new Set(data.companies ?? []),
        slugs:     new Set(data.slugs     ?? []),
      },
      aiFilterActive: data.aiFilterActive ?? false,
    };
  } catch {
    return { filter: emptyFilter(), aiFilterActive: false };
  }
}

function saveFilter(filter: FilterState, aiFilterActive: boolean) {
  if (typeof window === "undefined") return;
  try {
    const data: PersistedFilter = {
      badges:         [...filter.badges],
      techStack:      [...filter.techStack],
      companies:      [...filter.companies],
      slugs:          [...filter.slugs],
      aiFilterActive,
    };
    sessionStorage.setItem(FILTER_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable — silent fail
  }
}

interface ChatContextValue {
  filter: FilterState;
  aiFilterActive: boolean;
  setFilter: (f: FilterState, fromAI?: boolean) => void;
  clearFilter: () => void;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
}

const ChatContext = createContext<ChatContextValue>({
  filter: emptyFilter(),
  aiFilterActive: false,
  setFilter: () => {},
  clearFilter: () => {},
  chatOpen: false,
  setChatOpen: () => {},
});

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [{ filter, aiFilterActive }, setFilterState] = useState(() => loadFilter());
  const [chatOpen, setChatOpen] = useState(false);

  const setFilter = useCallback((f: FilterState, fromAI = false) => {
    setFilterState({ filter: f, aiFilterActive: fromAI });
    saveFilter(f, fromAI);
    track("project filter changed", {
      fromAI,
      badges: [...f.badges],
      techStack: [...f.techStack],
      companies: [...f.companies],
      slugs: [...f.slugs],
    });
  }, []);

  const clearFilter = useCallback(() => {
    const empty = emptyFilter();
    setFilterState({ filter: empty, aiFilterActive: false });
    if (typeof window !== "undefined") sessionStorage.removeItem(FILTER_KEY);
    track("project filter changed", { cleared: true });
  }, []);

  const setChatOpenTracked = useCallback((open: boolean) => {
    setChatOpen(open);
    track(open ? "chat opened" : "chat closed");
  }, []);

  return (
    <ChatContext value={{ filter, aiFilterActive, setFilter, clearFilter, chatOpen, setChatOpen: setChatOpenTracked }}>
      {children}
    </ChatContext>
  );
}

export function useChatContext() {
  return useContext(ChatContext);
}
