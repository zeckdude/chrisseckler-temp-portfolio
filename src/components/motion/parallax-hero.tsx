"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface ParallaxContextValue {
  mvX: MotionValue<number>;
  mvY: MotionValue<number>;
}

const ParallaxContext = createContext<ParallaxContextValue | null>(null);
const DRIFT_SCALE = 60;

export function ParallaxHero({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mvX = useSpring(rawX, { stiffness: 60, damping: 20, mass: 0.5 });
  const mvY = useSpring(rawY, { stiffness: 60, damping: 20, mass: 0.5 });
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.7]);

  useEffect(() => {
    if (reduceMotion) return;

    function handlePointerMove(event: PointerEvent) {
      rawX.set((event.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((event.clientY / window.innerHeight - 0.5) * 2);
    }

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [rawX, rawY, reduceMotion]);

  return (
    <ParallaxContext.Provider value={{ mvX, mvY }}>
      <motion.div
        ref={containerRef}
        style={reduceMotion ? undefined : { scale, opacity }}
        className={className}
      >
        {children}
      </motion.div>
    </ParallaxContext.Provider>
  );
}

export function ParallaxLayer({
  depth,
  className,
  style,
  children,
}: {
  depth: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  const ctx = useContext(ParallaxContext);
  const reduceMotion = useReducedMotion();
  const fallback = useMotionValue(0);
  const mvX = ctx?.mvX ?? fallback;
  const mvY = ctx?.mvY ?? fallback;
  const x = useTransform(mvX, (v) => v * depth * DRIFT_SCALE);
  const y = useTransform(mvY, (v) => v * depth * DRIFT_SCALE);

  return (
    <motion.div
      className={cn(className)}
      style={reduceMotion ? style : { ...style, x, y }}
    >
      {children}
    </motion.div>
  );
}
