"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
}

export default function Magnetic({
  children,
  className,
  strength = 10,
  radius = 120,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reduceMotion = useReducedMotion();
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (reduceMotion) return;

    function handlePointerMove(event: PointerEvent) {
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = event.clientX - centerX;
        const distY = event.clientY - centerY;
        const distance = Math.hypot(distX, distY);
        const effectiveRadius = radius + Math.max(rect.width, rect.height) / 2;

        if (distance < effectiveRadius) {
          const pull = 1 - distance / effectiveRadius;
          setOffset({ x: distX * pull * (strength / effectiveRadius), y: distY * pull * (strength / effectiveRadius) });
        } else {
          setOffset({ x: 0, y: 0 });
        }
      });
    }

    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [radius, strength, reduceMotion]);

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 180, damping: 14, mass: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
