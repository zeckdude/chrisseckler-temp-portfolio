import type { LightboxSlide, SlideCaption } from "@/components/ui/project-lightbox";

function resolveVideos(videoSrc?: string, videoSrcs?: string[]): string[] {
  if (videoSrcs?.length) return videoSrcs;
  if (videoSrc) return [videoSrc];
  return [];
}

export function buildProjectGallerySlides({
  videoSrc,
  videoSrcs,
  videoPosters,
  images,
}: {
  videoSrc?: string;
  videoSrcs?: string[];
  videoPosters?: Record<string, string>;
  images?: string[];
}): LightboxSlide[] {
  const slides: LightboxSlide[] = [];
  for (const src of resolveVideos(videoSrc, videoSrcs)) {
    slides.push({ type: "video", src, poster: videoPosters?.[src] });
  }
  for (const src of images ?? []) slides.push({ type: "image", src });
  return slides;
}

/** Map imageCaptions (indexed by images[]) into the unified slides array. */
export function buildProjectGalleryCaptions(
  videoCount: number,
  imageCaptions: SlideCaption[] | undefined,
): SlideCaption[] | undefined {
  if (!imageCaptions) return undefined;
  const result: SlideCaption[] = Array(videoCount).fill(null);
  for (const c of imageCaptions) result.push(c ?? null);
  return result;
}

export function findGallerySlideIndex(slides: LightboxSlide[], imageSrc: string): number {
  return slides.findIndex((slide) => slide.type === "image" && slide.src === imageSrc);
}

export function resolveWhatIBuiltImages(item: {
  image?: string;
  images?: string[];
}): string[] {
  if (item.images?.length) return item.images;
  if (item.image) return [item.image];
  return [];
}
