"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export default function ProjectViewTracker({ slug, title }: { slug: string; title: string }) {
  useEffect(() => {
    track("project viewed", { slug, title });
  }, [slug, title]);
  return null;
}
