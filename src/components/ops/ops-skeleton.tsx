export function CardSkeleton({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded bg-border/50"
          style={{ width: `${60 + (i % 3) * 15}%` }}
        />
      ))}
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-border bg-surface p-5">
      <div className="mb-3 h-3 w-24 rounded bg-border/50" />
      <div className="h-8 w-16 rounded bg-border/50" />
      <div className="mt-2 h-3 w-32 rounded bg-border/50" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-border bg-surface p-5">
      <div className="mb-4 h-4 w-40 rounded bg-border/50" />
      <div className="flex items-end gap-2 h-32">
        {[60, 40, 80, 50, 90, 30, 70, 45, 85, 55].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-border/40"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}
