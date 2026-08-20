"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

interface ButtonProps {
  href: string;
  variant?: "primary" | "ghost";
  className?: string;
  children: React.ReactNode;
  external?: boolean;
  event?: "outbound link clicked" | "resume downloaded" | "contact intent";
  eventProps?: Record<string, unknown>;
}

export default function Button({
  href,
  variant = "primary",
  className,
  children,
  external = false,
  event,
  eventProps,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition-colors duration-200",
    variant === "primary" && "bg-accent text-bg hover:bg-accent/90",
    variant === "ghost" &&
      "border border-border bg-transparent text-text-primary hover:border-accent/50 hover:text-accent",
    className,
  );

  function handleClick() {
    if (event) {
      track(event, { href, ...eventProps });
      return;
    }
    if (external) track("outbound link clicked", { href, ...eventProps });
  }

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes} onClick={handleClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} onClick={handleClick}>
      {children}
    </Link>
  );
}
