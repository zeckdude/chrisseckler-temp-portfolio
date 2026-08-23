"use client";

import { Moon, Sun } from "lucide-react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

export default function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => {
        const next = isDark ? "light" : "dark";
        toggleTheme();
        track("theme changed", { theme: next });
      }}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface hover:text-text-primary",
        className,
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? <Sun size={18} strokeWidth={1.75} aria-hidden /> : <Moon size={18} strokeWidth={1.75} aria-hidden />}
    </button>
  );
}
