/** `sizes` hints for next/image — include ~2× layout width for retina. */
export const PROJECT_IMAGE_SIZES = {
  card: "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw",
  gallery: "(min-width: 1024px) 1920px, 100vw",
  lightbox: "100vw",
  whatIBuiltThumb: "96px",
} as const;

export const PROJECT_IMAGE_QUALITY = {
  card: 85,
  gallery: 100,
  lightbox: 100,
} as const;
