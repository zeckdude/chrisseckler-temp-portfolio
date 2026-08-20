"use client";

import { useEffect, useMemo, useState } from "react";
import ProjectCard from "@/components/ui/project-card";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import AdvancedFilterPanel, { AdvancedFilterToggle } from "@/components/ui/advanced-filter-panel";
import { projects, type BadgeType } from "@/lib/projects";
import { applyFilter, isFilterEmpty, filterCount, type FilterState } from "@/lib/filter-utils";
import { useChatContext } from "@/lib/chat-context";
import { cn } from "@/lib/utils";

const BADGE_LABELS: Record<BadgeType, string> = {
  professional: "Employed",
  personal:     "Personal Project",
  freelance:    "Freelance",
};

const BADGE_STYLES: Record<BadgeType, { active: string; inactive: string }> = {
  professional: { active: "bg-emerald-950 text-emerald-400 ring-1 ring-emerald-600", inactive: "text-text-secondary ring-1 ring-border hover:text-text-primary" },
  personal:     { active: "bg-sky-950     text-sky-400     ring-1 ring-sky-600",      inactive: "text-text-secondary ring-1 ring-border hover:text-text-primary" },
  freelance:    { active: "bg-amber-950   text-amber-400   ring-1 ring-amber-600",    inactive: "text-text-secondary ring-1 ring-border hover:text-text-primary" },
};

/** Build a human-readable description of what the AI is currently showing. */
function describeFilter(filter: FilterState): string {
  if (filter.slugs.size > 0) {
    const titles = [...filter.slugs]
      .map((s) => projects.find((p) => p.slug === s)?.title ?? s)
      .join(", ");
    return `Showing: ${titles}`;
  }
  const parts: string[] = [];
  if (filter.badges.size > 0)    parts.push([...filter.badges].map((b) => BADGE_LABELS[b]).join(", "));
  if (filter.companies.size > 0) parts.push([...filter.companies].map((c) => `@ ${c}`).join(", "));
  if (filter.techStack.size > 0) parts.push([...filter.techStack].join(", "));
  return `Filtered by: ${parts.join(" · ")}`;
}

export default function ProjectsGrid() {
  const { filter, aiFilterActive, setFilter, clearFilter, setChatOpen } = useChatContext();
  const [panelOpen, setPanelOpen] = useState(false);

  // Auto-open advanced panel when AI sets tech/company filters so chips are visible
  const hasAdvancedFilter = filter.techStack.size > 0 || filter.companies.size > 0;
  useEffect(() => {
    if (aiFilterActive && hasAdvancedFilter) setPanelOpen(true);
    // Slug-based filters don't need the panel open (no chips to show)
  }, [aiFilterActive, hasAdvancedFilter]);

  const filtered = useMemo(() => applyFilter(projects, filter), [filter]);
  const filterKey = [
    ...[...filter.slugs].sort(),
    ...[...filter.badges].sort(),
    ...[...filter.techStack].sort(),
    ...[...filter.companies].sort(),
  ].join("|") || "all";

  const isEmpty = isFilterEmpty(filter);
  const count = filterCount(filter);

  function toggleBadge(id: BadgeType) {
    const next = new Set(filter.badges);
    next.has(id) ? next.delete(id) : next.add(id);
    const nextFilter: FilterState = { ...filter, badges: next };
    isFilterEmpty(nextFilter) ? clearFilter() : setFilter(nextFilter, false);
  }

  function handleAdvancedChange(next: FilterState) {
    isFilterEmpty(next) ? clearFilter() : setFilter(next, false);
  }

  return (
    <>
      {/* AI filter notice */}
      {aiFilterActive && !isEmpty && (
        <div className="mb-6 rounded-xl border border-accent/30 bg-surface px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-dim">
                <svg width="13" height="13" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                  <path d="M15 11.5a2 2 0 01-2 2H5l-3 3V4a2 2 0 012-2h9a2 2 0 012 2v7.5z" />
                  <path d="M6 7h6M6 10h4" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Assistant filter active
                </p>
                <p className="mt-1 text-sm text-text-primary">
                  {describeFilter(filter)}
                </p>
                <p className="mt-0.5 text-xs text-text-secondary">
                  {filtered.length} of {projects.length} projects shown
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <button
                type="button"
                onClick={clearFilter}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-border/60 hover:text-text-primary"
              >
                Show all
              </button>
              <button
                type="button"
                onClick={() => setChatOpen(true)}
                className="flex items-center gap-1 text-xs text-accent hover:underline"
              >
                View in assistant
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 5h6M5 2l3 3-3 3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Primary filter row */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3 mb-3">
        <span className="mr-1 text-xs font-medium uppercase tracking-wider text-text-secondary/60">
          Type
        </span>

        {/* All */}
        <button
          type="button"
          onClick={clearFilter}
          aria-pressed={isEmpty}
          className={cn(
            "rounded-md px-4 py-2 text-sm font-medium transition-colors duration-150",
            isEmpty
              ? "bg-accent-dim text-accent ring-1 ring-accent/40"
              : "text-text-secondary ring-1 ring-border hover:text-text-primary",
          )}
        >
          All
        </button>

        {(["professional", "personal", "freelance"] as BadgeType[]).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => toggleBadge(id)}
            aria-pressed={filter.badges.has(id)}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors duration-150",
              filter.badges.has(id) ? BADGE_STYLES[id].active : BADGE_STYLES[id].inactive,
            )}
          >
            {BADGE_LABELS[id]}
          </button>
        ))}

        <AdvancedFilterToggle
          open={panelOpen}
          filter={filter}
          onToggle={() => setPanelOpen((v) => !v)}
        />
      </div>

      {/* Advanced filter panel */}
      <AdvancedFilterPanel
        open={panelOpen}
        filter={filter}
        onChange={handleAdvancedChange}
      />

      {/* Result count when filtered */}
      {!isEmpty && (
        <p className="mb-5 text-xs text-text-secondary">
          Showing {filtered.length} of {projects.length} projects
          {count > 0 && (
            <>
              {" "}·{" "}
              <button
                type="button"
                onClick={clearFilter}
                className="underline underline-offset-2 hover:text-text-primary"
              >
                Clear all
              </button>
            </>
          )}
        </p>
      )}

      <RevealGroup key={filterKey} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <Reveal key={project.slug} className="h-full">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </RevealGroup>
    </>
  );
}
