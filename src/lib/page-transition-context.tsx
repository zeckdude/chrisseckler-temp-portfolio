"use client";

import { createContext, useContext } from "react";

type PageTransitionContextValue = {
  /** True while route enter animation is running — Reveal should defer its mount enter. */
  skipMountEnter: boolean;
};

export const PageTransitionContext = createContext<PageTransitionContextValue>({
  skipMountEnter: false,
});

export function usePageTransition() {
  return useContext(PageTransitionContext);
}
