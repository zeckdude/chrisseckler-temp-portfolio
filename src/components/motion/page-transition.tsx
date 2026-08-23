"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { PageTransitionContext } from "@/lib/page-transition-context";
import { useHydrated } from "@/lib/use-hydrated";

const variants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
};

const TEMPLATE_MOUNTED_KEY = "portfolio:template-mounted";

/** Stable per mount — survives re-renders, set once on server (true) or client. */
function useIsFirstTemplateLoad() {
  const isFirst = useRef<boolean | null>(null);
  if (isFirst.current === null) {
    if (typeof window === "undefined") {
      isFirst.current = true;
    } else {
      isFirst.current = !sessionStorage.getItem(TEMPLATE_MOUNTED_KEY);
      if (isFirst.current) sessionStorage.setItem(TEMPLATE_MOUNTED_KEY, "1");
    }
  }
  return isFirst.current;
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated();
  const isFirstLoad = useIsFirstTemplateLoad();
  const [entering, setEntering] = useState(!isFirstLoad);
  const skipMountEnter = hydrated && !isFirstLoad && entering;

  if (!hydrated) {
    return <div>{children}</div>;
  }

  return (
    <PageTransitionContext.Provider value={{ skipMountEnter }}>
      <motion.div
        variants={variants}
        initial={isFirstLoad ? false : "initial"}
        animate="animate"
        transition={{ duration: 0.18, ease: "easeOut" }}
        onAnimationComplete={() => setEntering(false)}
      >
        {children}
      </motion.div>
    </PageTransitionContext.Provider>
  );
}
