import type { LightboxSlide } from "@/components/ui/project-lightbox";

function preloadImage(src: string) {
  const img = new Image();
  img.decoding = "async";
  img.src = src;
}

/** Preload the slide at `startIndex`, then the rest when the browser is idle. */
export function preloadLightboxSlides(slides: LightboxSlide[], startIndex = 0) {
  const imageSrcs = slides.flatMap((slide, i) =>
    slide.type === "image" ? [{ src: slide.src, i }] : [],
  );
  if (imageSrcs.length === 0) return;

  const start = imageSrcs.find(({ i }) => i === startIndex) ?? imageSrcs[0];
  preloadImage(start.src);

  const rest = imageSrcs.filter(({ src }) => src !== start.src).map(({ src }) => src);
  if (rest.length === 0) return;

  const preloadRest = () => rest.forEach(preloadImage);
  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(preloadRest);
  } else {
    setTimeout(preloadRest, 50);
  }
}
