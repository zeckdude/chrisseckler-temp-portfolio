import { projects, type BadgeType, type Project } from "./projects";

export interface FilterState {
  badges: Set<BadgeType>;
  techStack: Set<string>;
  companies: Set<string>;
  /** Specific project slugs selected by the AI. When non-empty, shows only these projects (ignores other dimensions). */
  slugs: Set<string>;
}

export function emptyFilter(): FilterState {
  return { badges: new Set(), techStack: new Set(), companies: new Set(), slugs: new Set() };
}

export function isFilterEmpty(f: FilterState): boolean {
  return f.badges.size === 0 && f.techStack.size === 0 && f.companies.size === 0 && f.slugs.size === 0;
}

export function filterCount(f: FilterState): number {
  return f.badges.size + f.techStack.size + f.companies.size + f.slugs.size;
}

/**
 * Apply a FilterState to the projects list.
 * - If `slugs` is non-empty, return exactly those projects in their original display order.
 * - Otherwise, AND across active dimensions; within a dimension OR.
 */
export function applyFilter(all: Project[], f: FilterState): Project[] {
  if (f.slugs.size > 0) {
    return all.filter((p) => f.slugs.has(p.slug));
  }
  return all.filter((p) => {
    if (f.badges.size > 0 && !f.badges.has(p.badge)) return false;
    if (f.techStack.size > 0 && !p.techStack.some((t) => f.techStack.has(t))) return false;
    if (f.companies.size > 0 && (!p.company || !f.companies.has(p.company))) return false;
    return true;
  });
}

/** All unique tech stack values across all projects, sorted by frequency then alpha. */
export function getAllTech(): string[] {
  const freq: Record<string, number> = {};
  for (const p of projects) {
    for (const t of p.techStack) {
      freq[t] = (freq[t] ?? 0) + 1;
    }
  }
  return Object.keys(freq).sort((a, b) => freq[b] - freq[a] || a.localeCompare(b));
}

/** All unique company names, sorted alpha. */
export function getAllCompanies(): string[] {
  const seen = new Set<string>();
  for (const p of projects) {
    if (p.company) seen.add(p.company);
  }
  return [...seen].sort();
}
