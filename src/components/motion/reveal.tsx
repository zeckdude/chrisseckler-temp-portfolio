"use client";

import { motion, type Variants } from "framer-motion";
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

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "li";
}

export function Reveal({ children, className, as = "div" }: RevealProps) {
  const Component = motion[as];
  return (
    <Component
      className={cn(className)}
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </Component>
  );
}

export function RevealGroup({ children, className, as = "div" }: RevealProps) {
  const Component = motion[as];
  return (
    <Component
      className={cn(className)}
      variants={groupVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </Component>
  );
}

export const revealItemVariants = itemVariants;
