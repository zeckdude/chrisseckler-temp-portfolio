"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import ProjectLightbox, { type LightboxSlide, type SlideCaption } from "./project-lightbox";
import VideoPoster from "./video-poster";
import { track } from "@/lib/analytics";
import { PROJECT_IMAGE_QUALITY, PROJECT_IMAGE_SIZES } from "@/lib/project-media-sizes";
import { preloadLightboxSlides } from "@/lib/preload-lightbox-slides";
import {
  buildProjectGalleryCaptions,
  buildProjectGallerySlides,
} from "@/lib/project-gallery-slides";

function resolveVideos(videoSrc?: string, videoSrcs?: string[]): string[] {
  if (videoSrcs?.length) return videoSrcs;
  if (videoSrc) return [videoSrc];
  return [];
}

export default function ProjectGallery({
  images,
  videoSrc,
  videoSrcs,
  videoPosters,
  imageCaptions,
  title,
}: {
  images?: string[];
  videoSrc?: string;
  videoSrcs?: string[];
  videoPosters?: Record<string, string>;
  imageCaptions?: SlideCaption[];
  title: string;
}) {
  const videoCount = resolveVideos(videoSrc, videoSrcs).length;
  const slides = buildProjectGallerySlides({ videoSrc, videoSrcs, videoPosters, images });
  const captions = buildProjectGalleryCaptions(videoCount, imageCaptions);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0);
  const multiple = slides.length > 1;

  useEffect(() => {
    preloadLightboxSlides(slides, 0);
  }, [slides]);

  const updateActiveIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const slideWidth = track.clientWidth;
    if (!slideWidth) return;
    const index = Math.round(track.scrollLeft / slideWidth);
    setActiveIndex(Math.min(slides.length - 1, Math.max(0, index)));
  }, [slides.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !multiple || lightboxOpen) return;
    track.addEventListener("scroll", updateActiveIndex, { passive: true });
    return () => track.removeEventListener("scroll", updateActiveIndex);
  }, [multiple, updateActiveIndex, lightboxOpen]);

  useEffect(() => {
    const track = trackRef.current;
    const hasImages = (images?.length ?? 0) > 0;
    if (!track || !multiple || !hasImages) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    const timeout = window.setTimeout(() => {
      if (hasInteracted) return;
      track.scrollTo({ left: track.clientWidth * 0.18, behavior: "smooth" });
      window.setTimeout(() => {
        if (hasInteracted) return;
        track.scrollTo({ left: 0, behavior: "smooth" });
      }, 550);
    }, 900);
    return () => window.clearTimeout(timeout);
  }, [multiple, hasInteracted, images?.length]);

  const goTo = useCallback((index: number, instant = false) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.min(slides.length - 1, Math.max(0, index));
    setHasInteracted(true);
    setActiveIndex(clamped);
    if (instant) {
      el.scrollLeft = clamped * el.clientWidth;
    } else {
      el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
    }
    track("gallery slide changed", { title, index: clamped });
  }, [slides.length, title]);

  const syncFromLightbox = useCallback((index: number) => {
    goTo(index, true);
  }, [goTo]);

  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      const track = trackRef.current;
      if (!track || !multiple) return;
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        track.scrollLeft += event.deltaY;
        event.preventDefault();
      }
      setHasInteracted(true);
    },
    [multiple],
  );

  if (slides.length === 0) return null;

  return (
    <>
      <div className="group/gallery relative">
        <div
          ref={trackRef}
          onWheel={handleWheel}
          onPointerDown={() => setHasInteracted(true)}
          onTouchStart={() => setHasInteracted(true)}
          tabIndex={0}
          role="region"
          aria-label={`${title} media`}
          aria-roledescription={multiple ? "carousel" : undefined}
          className="flex aspect-video snap-x snap-mandatory overflow-x-auto overflow-y-hidden rounded border border-border bg-surface [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              className={cn(
                "relative w-full shrink-0 snap-start snap-always border-0 bg-transparent p-0 text-left",
                slide.type === "video" ? "cursor-pointer" : "cursor-zoom-in",
              )}
              aria-label={
                slide.type === "video"
                  ? `Play ${title} demo video ${index + 1} of ${videoCount} in full screen`
                  : `View ${title} screenshot ${index - videoCount + 1} of ${slides.length - videoCount}`
              }
              onClick={() => {
                setHasInteracted(true);
                setLightboxStartIndex(index);
                setLightboxOpen(true);
                track("lightbox opened", { title, index });
              }}
            >
              {slide.type === "video" ? (
                <VideoPoster
                  src={slide.src}
                  poster={slide.poster}
                  objectFit={slide.poster ? "cover" : "contain"}
                  playIconSize="md"
                  className="aspect-video w-full"
                />
              ) : (
                <div className="relative aspect-video w-full">
                  <Image
                    src={slide.src}
                    alt=""
                    fill
                    priority={index === 0}
                    quality={PROJECT_IMAGE_QUALITY.gallery}
                    sizes={PROJECT_IMAGE_SIZES.gallery}
                    className="object-cover object-top"
                  />
                </div>
              )}
            </button>
          ))}
        </div>

        {multiple && (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-bg/70 to-transparent opacity-0 transition-opacity duration-300 data-[visible=true]:opacity-100"
              data-visible={activeIndex > 0}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-bg/70 to-transparent opacity-0 transition-opacity duration-300 data-[visible=true]:opacity-100"
              data-visible={activeIndex < slides.length - 1}
            />

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goTo(activeIndex - 1); }}
              disabled={activeIndex === 0}
              aria-label="Previous"
              className="absolute top-1/2 left-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-bg/80 text-text-primary shadow-lg ring-1 ring-border transition-all duration-200 hover:bg-accent hover:text-bg disabled:pointer-events-none disabled:opacity-0"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goTo(activeIndex + 1); }}
              disabled={activeIndex === slides.length - 1}
              aria-label="Next"
              className="absolute top-1/2 right-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-bg/80 text-text-primary shadow-lg ring-1 ring-border transition-all duration-200 hover:bg-accent hover:text-bg disabled:pointer-events-none disabled:opacity-0"
            >
              <ChevronRight size={18} />
            </button>

            <div className="absolute right-3 bottom-3 rounded-full bg-bg/80 px-2.5 py-1 font-mono text-[0.65rem] text-text-secondary ring-1 ring-border">
              {activeIndex + 1} / {slides.length}
            </div>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {slides.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); goTo(index); }}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === activeIndex}
                  className={cn(
                    "h-1.5 rounded-full bg-bg/80 ring-1 ring-border transition-all duration-200",
                    index === activeIndex ? "w-5 bg-accent ring-accent" : "w-1.5 hover:bg-text-secondary",
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {lightboxOpen && (
        <ProjectLightbox
          slides={slides}
          initialIndex={lightboxStartIndex}
          captions={captions}
          onClose={() => setLightboxOpen(false)}
          onNavigate={syncFromLightbox}
        />
      )}
    </>
  );
}
