import { cn } from "@/lib/utils";
import type { BadgeType } from "@/lib/projects";

interface BadgeProps {
  type: BadgeType;
  className?: string;
}

const badgeStyles: Record<BadgeType, string> = {
  professional: "bg-emerald-950 text-emerald-400 ring-1 ring-emerald-800",
  freelance:    "bg-amber-950  text-amber-400  ring-1 ring-amber-800",
  personal:     "bg-sky-950    text-sky-400    ring-1 ring-sky-800",
};

const badgeLabels: Record<BadgeType, string> = {
  professional: "Employed",
  freelance:    "Freelance",
  personal:     "Personal Project",
};

export default function Badge({ type, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded px-2.5 py-1 text-xs font-medium",
        badgeStyles[type],
        className,
      )}
    >
      {badgeLabels[type]}
    </span>
  );
}

export function CompanyChip({ company }: { company: string }) {
  return (
    <span className="inline-flex w-fit items-center rounded px-2.5 py-1 text-xs font-medium text-text-secondary ring-1 ring-border">
      @ {company}
    </span>
  );
}
