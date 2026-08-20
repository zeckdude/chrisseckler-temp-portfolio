"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export default function ContactIntentTracker({ source }: { source: string }) {
  useEffect(() => {
    track("contact intent", { source });
  }, [source]);
  return null;
}
