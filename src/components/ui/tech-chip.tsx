import { cn } from "@/lib/utils";

export function TechChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded border border-border bg-surface px-2 py-0.5 font-mono text-[0.75rem] text-text-secondary">
      {label}
    </span>
  );
}

interface TechChipListProps {
  items: string[];
  max?: number;
  className?: string;
}

export function TechChipList({ items, max, className }: TechChipListProps) {
  const shown = max ? items.slice(0, max) : items;
  if (shown.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {shown.map((item) => (
        <TechChip key={item} label={item} />
      ))}
    </div>
  );
}
