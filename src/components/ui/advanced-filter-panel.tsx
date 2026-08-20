"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { getAllTech, getAllCompanies, filterCount, type FilterState } from "@/lib/filter-utils";
import type { BadgeType } from "@/lib/projects";

interface Props {
  open: boolean;
  filter: FilterState;
  onChange: (next: FilterState) => void;
}

const BADGE_LABELS: Record<BadgeType, string> = {
  professional: "Employed",
  personal:     "Personal Project",
  freelance:    "Freelance",
};

export default function AdvancedFilterPanel({ open, filter, onChange }: Props) {
  const allTech = useMemo(getAllTech, []);
  const allCompanies = useMemo(getAllCompanies, []);

  function toggleBadge(id: BadgeType) {
    const next = new Set(filter.badges);
    next.has(id) ? next.delete(id) : next.add(id);
    onChange({ ...filter, badges: next });
  }

  function toggleTech(t: string) {
    const next = new Set(filter.techStack);
    next.has(t) ? next.delete(t) : next.add(t);
    onChange({ ...filter, techStack: next });
  }

  function toggleCompany(c: string) {
    const next = new Set(filter.companies);
    next.has(c) ? next.delete(c) : next.add(c);
    onChange({ ...filter, companies: next });
  }

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="advanced"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="space-y-6 rounded-xl border border-border bg-surface px-5 py-5 mb-8">
            {/* Employment type */}
            <FilterSection label="Type">
              {(Object.keys(BADGE_LABELS) as BadgeType[]).map((id) => (
                <Chip
                  key={id}
                  label={BADGE_LABELS[id]}
                  active={filter.badges.has(id)}
                  onToggle={() => toggleBadge(id)}
                  colorClass={
                    id === "professional" ? "emerald" :
                    id === "freelance"    ? "amber"   : "sky"
                  }
                />
              ))}
            </FilterSection>

            {/* Company */}
            <FilterSection label="Company">
              {allCompanies.map((c) => (
                <Chip
                  key={c}
                  label={c}
                  active={filter.companies.has(c)}
                  onToggle={() => toggleCompany(c)}
                  colorClass="violet"
                />
              ))}
            </FilterSection>

            {/* Tech stack */}
            <FilterSection label="Tech Stack">
              {allTech.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  active={filter.techStack.has(t)}
                  onToggle={() => toggleTech(t)}
                  colorClass="cyan"
                />
              ))}
            </FilterSection>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── helpers ────────────────────────────────────────────────────────── */

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-text-secondary/60">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

type ColorClass = "emerald" | "amber" | "sky" | "violet" | "cyan";

const activeClasses: Record<ColorClass, string> = {
  emerald: "bg-emerald-950 text-emerald-400 ring-1 ring-emerald-700",
  amber:   "bg-amber-950  text-amber-400  ring-1 ring-amber-700",
  sky:     "bg-sky-950    text-sky-400    ring-1 ring-sky-700",
  violet:  "bg-violet-950 text-violet-400 ring-1 ring-violet-700",
  cyan:    "bg-cyan-950   text-cyan-400   ring-1 ring-cyan-700",
};

function Chip({
  label,
  active,
  onToggle,
  colorClass,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
  colorClass: ColorClass;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={cn(
        "rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-100",
        active
          ? activeClasses[colorClass]
          : "text-text-secondary ring-1 ring-border hover:text-text-primary hover:ring-border/80",
      )}
    >
      {label}
    </button>
  );
}

/** Toggle button used by ProjectsGrid to open/close the panel. */
export function AdvancedFilterToggle({
  open,
  filter,
  onToggle,
}: {
  open: boolean;
  filter: FilterState;
  onToggle: () => void;
}) {
  const count = filterCount(filter);
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "ml-auto flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-colors duration-100",
        open || count > 0
          ? "bg-surface text-text-primary ring-1 ring-border"
          : "text-text-secondary ring-1 ring-border hover:text-text-primary",
      )}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M1 3h10M3 6h6M5 9h2" />
      </svg>
      Filters
      {count > 0 && (
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-bg">
          {count}
        </span>
      )}
    </button>
  );
}
