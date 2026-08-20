"use client";

import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type SlideCaption = { headline?: string; caption?: string } | null | undefined;

export type LightboxSlide =
  | { type: "image"; src: string }
  | { type: "video"; src: string };

interface ProjectLightboxProps {
  slides: LightboxSlide[];
  activeIndex: number;
  captions?: SlideCaption[];
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function ProjectLightbox({
  slides,
  activeIndex,
  captions,
  onClose,
  onNavigate,
}: ProjectLightboxProps) {
  const slide = slides[activeIndex];
  const caption = captions?.[activeIndex];
  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < slides.length - 1;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const prev = useCallback(() => { if (hasPrev) onNavigate(activeIndex - 1); }, [hasPrev, activeIndex, onNavigate]);
  const next = useCallback(() => { if (hasNext) onNavigate(activeIndex + 1); }, [hasNext, activeIndex, onNavigate]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  if (!slide) return null;

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
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close lightbox"
        className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X size={20} />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 font-mono text-xs text-white/70">
        {activeIndex + 1} / {slides.length}
      </div>

      {/* Prev */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); prev(); }}
        disabled={!hasPrev}
        aria-label="Previous"
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 disabled:pointer-events-none disabled:opacity-0"
      >
        <ChevronLeft size={22} />
      </button>

      {/* Next */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); next(); }}
        disabled={!hasNext}
        aria-label="Next"
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 disabled:pointer-events-none disabled:opacity-0"
      >
        <ChevronRight size={22} />
      </button>

      {/* Slide + caption — AnimatePresence mode="wait" prevents the flash by
          waiting for the exit animation to complete before mounting the new slide */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="flex max-h-[90vh] max-w-[88vw] flex-col items-center gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          {slide.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={slide.src}
              alt={caption?.headline ?? "Project screenshot"}
              className="max-h-[78vh] max-w-[88vw] rounded-lg object-contain shadow-2xl"
            />
          ) : (
            <video
              src={slide.src}
              controls
              autoPlay
              playsInline
              className="max-h-[78vh] max-w-[88vw] rounded-lg bg-black shadow-2xl"
            />
          )}

          {(caption?.headline || caption?.caption) && (
            <div className="w-full max-w-2xl space-y-1 text-center">
              {caption.headline && (
                <p className="font-display text-base font-bold text-white">{caption.headline}</p>
              )}
              {caption.caption && (
                <p className="text-sm leading-relaxed text-white/65">{caption.caption}</p>
              )}
            </div>
          )}

          {slides.length > 1 && (
            <div className="flex gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onNavigate(i); }}
                  aria-label={`Go to slide ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-200",
                    i === activeIndex ? "w-5 bg-white" : "w-1.5 bg-white/30 hover:bg-white/60",
                  )}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>,
    document.body,
  );
}
