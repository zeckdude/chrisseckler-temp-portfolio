"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { preloadLightboxSlides } from "@/lib/preload-lightbox-slides";

export type SlideCaption = { headline?: string; caption?: string } | null | undefined;

export type LightboxSlide =
  | { type: "image"; src: string }
  | { type: "video"; src: string; poster?: string };

interface ProjectLightboxProps {
  slides: LightboxSlide[];
  initialIndex: number;
  captions?: SlideCaption[];
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const FADE_MS = 200;
/** Navigations faster than this skip the crossfade and swap instantly. */
const RAPID_NAV_MS = 280;

function LightboxVideo({ src, poster }: { src: string; poster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      void video.play().catch(() => {
        video.muted = true;
        void video.play().catch(() => {});
      });
    };

    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      tryPlay();
    } else {
      video.addEventListener("canplay", tryPlay, { once: true });
    }

    return () => {
      video.removeEventListener("canplay", tryPlay);
      video.pause();
      video.currentTime = 0;
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      controls
      autoPlay
      playsInline
      className={cn(
        "max-h-[78vh] max-w-[88vw] rounded-lg shadow-2xl",
        poster ? "bg-white" : "bg-black",
      )}
    />
  );
}

function SlideMedia({
  slide,
  caption,
  isActive,
  animate,
}: {
  slide: LightboxSlide;
  caption: SlideCaption;
  isActive: boolean;
  animate: boolean;
}) {
  return (
    <div
      aria-hidden={!isActive}
      className={cn(
        "absolute inset-0 flex items-center justify-center",
        animate ? "transition-opacity duration-200 ease-in-out" : "transition-none",
        isActive ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0",
      )}
    >
      {slide.type === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={slide.src}
          alt={caption?.headline ?? "Project screenshot"}
          decoding="async"
          className="max-h-[78vh] max-w-[88vw] rounded-lg object-contain shadow-2xl"
        />
      ) : isActive ? (
        <LightboxVideo src={slide.src} poster={slide.poster} />
      ) : slide.poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={slide.poster}
          alt=""
          decoding="async"
          className="max-h-[78vh] max-w-[88vw] rounded-lg object-contain shadow-2xl"
        />
      ) : null}
    </div>
  );
}

function SlideCaptionBlock({
  caption,
  isActive,
  animate,
}: {
  caption: SlideCaption;
  isActive: boolean;
  animate: boolean;
}) {
  if (!caption?.headline && !caption?.caption) return null;

  return (
    <div
      aria-hidden={!isActive}
      className={cn(
        "col-start-1 row-start-1 w-full space-y-1",
        animate ? "transition-opacity duration-200 ease-in-out" : "transition-none",
        isActive ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      {caption.headline && (
        <p className="font-display text-base font-bold text-white">{caption.headline}</p>
      )}
      {caption.caption && (
        <p className="text-sm leading-relaxed text-white/65">{caption.caption}</p>
      )}
    </div>
  );
}

export default function ProjectLightbox({
  slides,
  initialIndex,
  captions,
  onClose,
  onNavigate,
}: ProjectLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [fadePeer, setFadePeer] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const indexRef = useRef(initialIndex);
  const lastNavAtRef = useRef(0);
  const fadeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    preloadLightboxSlides(slides, initialIndex);
  }, [slides, initialIndex]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      if (fadeTimerRef.current !== null) window.clearTimeout(fadeTimerRef.current);
    };
  }, []);

  const navigate = useCallback(
    (target: number) => {
      const clamped = Math.max(0, Math.min(slides.length - 1, target));
      if (clamped === indexRef.current) return;

      const now = Date.now();
      const rapid = now - lastNavAtRef.current < RAPID_NAV_MS;
      lastNavAtRef.current = now;

      if (fadeTimerRef.current !== null) {
        window.clearTimeout(fadeTimerRef.current);
        fadeTimerRef.current = null;
      }

      const from = indexRef.current;
      indexRef.current = clamped;
      setIndex(clamped);
      onNavigate(clamped);

      if (rapid) {
        setAnimating(false);
        setFadePeer(null);
        return;
      }

      setFadePeer(from);
      setAnimating(true);
      fadeTimerRef.current = window.setTimeout(() => {
        setFadePeer(null);
        setAnimating(false);
        fadeTimerRef.current = null;
      }, FADE_MS);
    },
    [slides.length, onNavigate],
  );

  const goPrev = useCallback(() => navigate(indexRef.current - 1), [navigate]);
  const goNext = useCallback(() => navigate(indexRef.current + 1), [navigate]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, goPrev, goNext]);

  const visibleIndices = fadePeer !== null ? [fadePeer, index] : [index];
  const hasPrev = index > 0;
  const hasNext = index < slides.length - 1;

  if (slides.length === 0) return null;

  return createPortal(
    <motion.div
      key="lightbox-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close lightbox"
        className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X size={20} />
      </button>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 font-mono text-xs text-white/70">
        {index + 1} / {slides.length}
      </div>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); goPrev(); }}
        disabled={!hasPrev}
        aria-label="Previous"
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 disabled:pointer-events-none disabled:opacity-0"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); goNext(); }}
        disabled={!hasNext}
        aria-label="Next"
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 disabled:pointer-events-none disabled:opacity-0"
      >
        <ChevronRight size={22} />
      </button>

      <div
        className="flex max-h-[90vh] max-w-[88vw] flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex min-h-[78vh] w-full items-center justify-center">
          {visibleIndices.map((i) => (
            <SlideMedia
              key={slides[i].src}
              slide={slides[i]}
              caption={captions?.[i]}
              isActive={i === index}
              animate={animating}
            />
          ))}
        </div>

        {captions?.some((c) => c?.headline || c?.caption) && (
          <div className="grid w-full max-w-2xl place-items-center text-center [&>*]:col-start-1 [&>*]:row-start-1">
            {visibleIndices.map((i) => (
              <SlideCaptionBlock
                key={i}
                caption={captions[i]}
                isActive={i === index}
                animate={animating}
              />
            ))}
          </div>
        )}

        {slides.length > 1 && (
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.stopPropagation(); navigate(i); }}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-200",
                  i === index ? "w-5 bg-white" : "w-1.5 bg-white/30 hover:bg-white/60",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>,
    document.body,
  );
}
