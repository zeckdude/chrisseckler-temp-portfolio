"use client";

import { useCallback, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { usePageTransition } from "@/lib/page-transition-context";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const groupVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

/** Matches Reveal viewport margin — keep in sync with viewport.margin below. */
const VIEWPORT_MARGIN_PX = 80;

function useDeferToPageTransition(enabled: boolean) {
  const { skipMountEnter } = usePageTransition();
  const [inViewport, setInViewport] = useState<boolean | null>(null);

  const ref = useCallback(
    (node: HTMLElement | null) => {
      if (!node || !enabled) return;
      const rect = node.getBoundingClientRect();
      const visible =
        rect.top < window.innerHeight - VIEWPORT_MARGIN_PX && rect.bottom > 0;
      setInViewport(visible);
    },
    [enabled],
  );

  // Before layout measure, assume in-viewport during route enter to avoid a hidden flash.
  const deferToPageTransition =
    enabled && skipMountEnter && (inViewport === null || inViewport);

  return { ref, deferToPageTransition };
}

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "li";
  id?: string;
}

export function Reveal({ children, className, as = "div", id }: RevealProps) {
  const hydrated = useHydrated();
  const { ref, deferToPageTransition } = useDeferToPageTransition(hydrated);

  if (!hydrated) {
    const Tag = as;
    return (
      <Tag id={id} className={cn(className)}>
        {children}
      </Tag>
    );
  }

  const Component = motion[as];
  return (
    <Component
      ref={ref}
      id={id}
      className={cn(className)}
      variants={itemVariants}
      initial={deferToPageTransition ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: `-${VIEWPORT_MARGIN_PX}px` }}
    >
      {children}
    </Component>
  );
}

export function RevealGroup({ children, className, as = "div" }: RevealProps) {
  const hydrated = useHydrated();
  const { ref, deferToPageTransition } = useDeferToPageTransition(hydrated);

  if (!hydrated) {
    const Tag = as;
    return <Tag className={cn(className)}>{children}</Tag>;
  }

  const Component = motion[as];
  return (
    <Component
      ref={ref}
      className={cn(className)}
      variants={groupVariants}
      initial={deferToPageTransition ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: `-${VIEWPORT_MARGIN_PX}px` }}
    >
      {children}
    </Component>
  );
}

export const revealItemVariants = itemVariants;
