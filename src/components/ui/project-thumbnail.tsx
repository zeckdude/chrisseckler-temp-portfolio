import Image from "next/image";
import { cn } from "@/lib/utils";

export default function ProjectThumbnail({
  title,
  image,
  className,
}: {
  title: string;
  image?: string;
  className?: string;
}) {
  const initial = title.trim().charAt(0).toUpperCase();

  if (image) {
    return (
      <div
        className={cn(
          "relative aspect-16/10 overflow-hidden rounded border border-border bg-surface",
          className,
        )}
      >
        <Image
          src={image}
          alt={`${title} preview`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-top"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex aspect-16/10 items-center justify-center overflow-hidden rounded border border-border bg-surface",
        className,
      )}
    >
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: "radial-gradient(var(--color-border) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <span className="relative font-display text-6xl font-extrabold text-text-secondary/25">
        {initial}
      </span>
      <span className="absolute right-3 bottom-2 font-mono text-[0.65rem] text-text-secondary/60">
        preview coming soon
      </span>
    </div>
  );
}
