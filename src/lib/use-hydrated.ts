"use client";

import { useSyncExternalStore } from "react";

/** True after the client has hydrated — false during SSR and the first client render. */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
