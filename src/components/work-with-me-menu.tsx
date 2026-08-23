"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

export const workWithMeOptions = [
  {
    href: "/freelance",
    label: "Freelance",
    description: "Project-based engagements",
  },
  {
    href: "/full-time",
    label: "Full-time",
    description: "Full-time roles",
  },
] as const;

export default function WorkWithMeMenu() {
  const pathname = usePathname();
  const menuId = useId();
  const containerRef = useRef<HTMLLIElement>(null);
  const [open, setOpen] = useState(false);

  const isActive = workWithMeOptions.some((option) => pathname.startsWith(option.href));

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        close();
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  function toggleMenu() {
    setOpen((current) => {
      const next = !current;
      if (next) {
        track("nav work menu opened");
      }
      return next;
    });
  }

  return (
    <li ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={toggleMenu}
        className={cn(
          "inline-flex items-center gap-1 text-sm font-semibold transition-colors",
          isActive
            ? "rounded bg-accent px-3 py-1.5 text-bg"
            : "rounded border border-accent/40 px-3 py-1.5 text-accent hover:bg-accent hover:text-bg",
        )}
      >
        Work with me
        <ChevronDown
          className={cn("size-3.5 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Work with me"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-56 overflow-hidden rounded-md border border-border bg-surface shadow-lg"
        >
          {workWithMeOptions.map((option) => (
            <Link
              key={option.href}
              href={option.href}
              role="menuitem"
              onClick={() => {
                track("nav clicked", { href: option.href, label: option.label });
                close();
              }}
              className={cn(
                "block px-4 py-3 transition-colors hover:bg-accent-dim/40",
                pathname.startsWith(option.href) && "bg-accent-dim/30",
              )}
            >
              <span className="block text-sm font-semibold text-text-primary">
                {option.label}
              </span>
              <span className="mt-0.5 block text-xs text-text-secondary">
                {option.description}
              </span>
            </Link>
          ))}
        </div>
      )}
    </li>
  );
}
