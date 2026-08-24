import Image from "next/image";
import { cn } from "@/lib/utils";
import VideoPoster from "./video-poster";
import { PROJECT_IMAGE_QUALITY, PROJECT_IMAGE_SIZES } from "@/lib/project-media-sizes";

export default function ProjectThumbnail({
  title,
  image,
  videoSrc,
  videoPoster,
  className,
}: {
  title: string;
  image?: string;
  videoSrc?: string;
  videoPoster?: string;
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
          quality={PROJECT_IMAGE_QUALITY.card}
          sizes={PROJECT_IMAGE_SIZES.card}
          className="object-cover object-top"
        />
      </div>
    );
  }

  if (videoSrc) {
    return (
      <div
        className={cn(
          "relative aspect-16/10 overflow-hidden rounded border border-border",
          videoPoster ? "bg-white" : "bg-black",
          className,
        )}
      >
        <VideoPoster
          src={videoSrc}
          poster={videoPoster}
          playIconSize="sm"
          label={`${title} preview video`}
          className="absolute inset-0"
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
