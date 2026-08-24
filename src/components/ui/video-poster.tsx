"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { PROJECT_IMAGE_QUALITY, PROJECT_IMAGE_SIZES } from "@/lib/project-media-sizes";

const PLAY_ICON = {
  sm: { wrap: "h-10 w-10", icon: 18 },
  md: { wrap: "h-14 w-14", icon: 24 },
} as const;

/** Seek slightly past t=0 so the poster isn't a blank white first frame. */
function useVideoPosterFrame(src: string, enabled: boolean) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const video = videoRef.current;
    if (!video) return;

    const seekToPosterFrame = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      video.currentTime = Math.min(0.5, video.duration * 0.05);
    };

    video.addEventListener("loadedmetadata", seekToPosterFrame);
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) seekToPosterFrame();

    return () => video.removeEventListener("loadedmetadata", seekToPosterFrame);
  }, [src, enabled]);

  return videoRef;
}

export default function VideoPoster({
  src,
  poster,
  className,
  objectFit = "cover",
  playIconSize = "md",
  label,
}: {
  src: string;
  poster?: string;
  className?: string;
  objectFit?: "cover" | "contain";
  playIconSize?: keyof typeof PLAY_ICON;
  label?: string;
}) {
  const videoRef = useVideoPosterFrame(src, !poster);
  const icon = PLAY_ICON[playIconSize];
  const fitClass =
    objectFit === "cover" ? "object-cover object-center" : "object-contain object-center";

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden",
        poster ? "bg-white" : "bg-black",
        className,
      )}
    >
      {poster ? (
        <Image
          src={poster}
          alt=""
          fill
          quality={PROJECT_IMAGE_QUALITY.gallery}
          sizes={PROJECT_IMAGE_SIZES.gallery}
          className={cn("pointer-events-none", fitClass)}
          aria-hidden
        />
      ) : (
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          preload="metadata"
          className={cn("pointer-events-none h-full w-full", fitClass)}
          aria-hidden
        />
      )}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center",
          poster ? "bg-black/10" : "bg-black/30",
        )}
        aria-hidden
      >
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-bg/90 shadow-lg ring-1 ring-border",
            icon.wrap,
          )}
        >
          <Play
            size={icon.icon}
            className="ml-0.5 fill-text-primary text-text-primary"
            aria-hidden
          />
        </div>
      </div>
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
}
