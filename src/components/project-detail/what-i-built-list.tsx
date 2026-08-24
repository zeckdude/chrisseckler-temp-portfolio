"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Images } from "lucide-react";
import ProjectLightbox, { type LightboxSlide, type SlideCaption } from "@/components/ui/project-lightbox";
import type { WhatIBuiltDetailBlock, WhatIBuiltItem } from "@/lib/projects";
import {
  buildProjectGalleryCaptions,
  buildProjectGallerySlides,
  findGallerySlideIndex,
  resolveWhatIBuiltImages,
} from "@/lib/project-gallery-slides";
import { renderWithCode } from "@/lib/render-with-code";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { PROJECT_IMAGE_QUALITY, PROJECT_IMAGE_SIZES } from "@/lib/project-media-sizes";

function BuiltFields({ problem, fix, result }: { problem: string; fix: string; result: string }) {
  const fields = [
    { label: "Problem", value: problem },
    { label: "Fix", value: fix },
    { label: "Result", value: result },
  ] as const;

  return (
    <dl className="mt-4 space-y-5">
      {fields.map(({ label, value }) => (
        <div key={label}>
          <dt className="font-mono text-xs uppercase tracking-wide text-text-secondary/80">
            {label}
          </dt>
          <dd className="mt-1.5 text-base leading-relaxed text-text-primary/90">
            {renderWithCode(value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function stripCodeTicks(title: string): string {
  return title.replace(/^`|`$/g, "");
}

function buildCaptionsForSources(
  fallbackHeadline: string,
  sources: string[],
  captions?: Array<{ headline?: string; caption?: string } | null>,
): SlideCaption[] {
  if (captions?.length) {
    return sources.map((_, index) => captions[index] ?? null);
  }
  return sources.map((_, index) => (index === 0 ? { headline: fallbackHeadline } : null));
}

const PREVIEW_WIDTH = "w-[4.5rem]";
const PREVIEW_HEIGHT = "h-[2.35rem]";

function ScreenshotPreview({
  sources,
  context,
  onOpen,
}: {
  sources: string[];
  context: string;
  onOpen: (startIndex: number) => void;
}) {
  if (!sources.length) return null;

  const count = sources.length;
  const label = count === 1 ? "View screenshot" : `View ${count} screenshots`;
  const previews = sources.slice(0, Math.min(2, count));

  return (
    <button
      type="button"
      onClick={() => onOpen(0)}
      className="group mt-4 inline-flex max-w-full items-center gap-3 rounded-md text-left transition-colors"
      aria-label={`${label} for ${context}`}
    >
      <span className="relative flex shrink-0 items-center pl-0.5">
        {previews.map((src, index) => (
          <span
            key={src}
            className={cn(
              "relative overflow-hidden rounded shadow-sm ring-1 ring-bg",
              PREVIEW_WIDTH,
              PREVIEW_HEIGHT,
              index > 0 && "-ml-5",
            )}
            style={{ zIndex: previews.length - index }}
          >
            <Image
              src={src}
              alt=""
              fill
              quality={PROJECT_IMAGE_QUALITY.card}
              sizes={PROJECT_IMAGE_SIZES.whatIBuiltThumb}
              className="object-cover object-top"
            />
          </span>
        ))}
        {count > 2 && (
          <span
            className={cn(
              "relative -ml-4 flex items-center justify-center rounded-full bg-surface/90 text-xs font-medium tabular-nums text-text-secondary ring-1 ring-border",
              PREVIEW_HEIGHT,
              "w-[2.35rem]",
            )}
            style={{ zIndex: 0 }}
          >
            +{count - 2}
          </span>
        )}
      </span>
      <span className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors group-hover:text-accent">
        <Images size={14} className="shrink-0 opacity-70" aria-hidden />
        {label}
      </span>
    </button>
  );
}

function DetailBlocks({
  blocks,
  featureTitle,
  onOpenBlock,
}: {
  blocks: WhatIBuiltDetailBlock[];
  featureTitle: string;
  onOpenBlock: (block: WhatIBuiltDetailBlock, startIndex: number) => void;
}) {
  return (
    <div
      className="mt-8 space-y-7 border-l-2 border-accent/20 pl-5 sm:pl-6"
      aria-label={`${featureTitle} — sub-features`}
    >
      <p className="font-mono text-xs uppercase tracking-wide text-text-secondary/70">
        Includes
      </p>

      {blocks.map((block) => {
        const sources = block.images ?? [];
        return (
          <div key={block.heading}>
            <h4 className="text-sm font-semibold tracking-tight text-text-primary">
              {block.heading}
            </h4>
            <p className="mt-1.5 text-sm leading-relaxed text-text-primary/80">
              {renderWithCode(block.body)}
            </p>
            {sources.length > 0 && (
              <ScreenshotPreview
                sources={sources}
                context={`${block.heading} — ${featureTitle}`}
                onOpen={(startIndex) => onOpenBlock(block, startIndex)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

type GalleryMedia = {
  videoSrc?: string;
  videoSrcs?: string[];
  videoPosters?: Record<string, string>;
  images?: string[];
  imageCaptions?: SlideCaption[];
};

export default function WhatIBuiltList({
  items,
  projectTitle,
  gallery,
}: {
  items: WhatIBuiltItem[];
  projectTitle: string;
  gallery: GalleryMedia;
}) {
  const gallerySlides = useMemo(() => buildProjectGallerySlides(gallery), [gallery]);
  const videoCount = (gallery.videoSrcs?.length ?? 0) || (gallery.videoSrc ? 1 : 0);
  const galleryCaptions = useMemo(
    () => buildProjectGalleryCaptions(videoCount, gallery.imageCaptions),
    [videoCount, gallery.imageCaptions],
  );

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSlides, setLightboxSlides] = useState<LightboxSlide[]>([]);
  const [lightboxCaptions, setLightboxCaptions] = useState<SlideCaption[] | undefined>();
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0);

  const showLightbox = (
    slides: LightboxSlide[],
    captions: SlideCaption[] | undefined,
    startIndex: number,
    trackProps: Record<string, unknown>,
  ) => {
    setLightboxSlides(slides);
    setLightboxCaptions(captions);
    setLightboxStartIndex(startIndex);
    setLightboxOpen(true);
    track("lightbox opened", {
      title: projectTitle,
      index: startIndex,
      source: "what-i-built",
      ...trackProps,
    });
  };

  const openBlockLightbox = (
    item: WhatIBuiltItem,
    block: WhatIBuiltDetailBlock,
    startIndex = 0,
  ) => {
    const sources = block.images ?? [];
    if (!sources.length) return;
    const clampedStart = Math.min(Math.max(0, startIndex), sources.length - 1);
    showLightbox(
      sources.map((src) => ({ type: "image", src })),
      buildCaptionsForSources(block.heading, sources, block.imageCaptions),
      clampedStart,
      { feature: item.title, block: block.heading, slideCount: sources.length },
    );
  };

  const openLightbox = (item: WhatIBuiltItem, startIndex = 0) => {
    const sources = resolveWhatIBuiltImages(item);
    if (!sources.length) return;

    const clampedStart = Math.min(Math.max(0, startIndex), sources.length - 1);
    const featureTitle = stripCodeTicks(item.title);

    if (sources.length === 1 && !item.images?.length) {
      const galleryIndex = findGallerySlideIndex(gallerySlides, sources[0]);
      if (galleryIndex >= 0) {
        showLightbox(gallerySlides, galleryCaptions, galleryIndex, {
          feature: item.title,
        });
        return;
      }
    }

    showLightbox(
      sources.map((src) => ({ type: "image", src })),
      buildCaptionsForSources(featureTitle, sources, item.imageCaptions),
      clampedStart,
      { feature: item.title, slideCount: sources.length },
    );
  };

  return (
    <>
      <ul className="flex flex-col gap-12">
        {items.map((item) => {
          const sources = resolveWhatIBuiltImages(item);
          const featureTitle = stripCodeTicks(item.title);
          const hasDetailBlocks = (item.detailBlocks?.length ?? 0) > 0;

          return (
            <li key={item.title}>
              <h3 className="font-display text-lg font-bold tracking-tight text-text-primary">
                {renderWithCode(item.title)}
              </h3>

              <BuiltFields problem={item.problem} fix={item.fix} result={item.result} />

              {!hasDetailBlocks && sources.length > 0 && (
                <ScreenshotPreview
                  sources={sources}
                  context={featureTitle}
                  onOpen={(startIndex) => openLightbox(item, startIndex)}
                />
              )}

              {hasDetailBlocks && item.detailBlocks && (
                <DetailBlocks
                  blocks={item.detailBlocks}
                  featureTitle={featureTitle}
                  onOpenBlock={(block, startIndex) => openBlockLightbox(item, block, startIndex)}
                />
              )}
            </li>
          );
        })}
      </ul>

      {lightboxOpen && (
        <ProjectLightbox
          slides={lightboxSlides}
          initialIndex={lightboxStartIndex}
          captions={lightboxCaptions}
          onClose={() => setLightboxOpen(false)}
          onNavigate={() => {}}
        />
      )}
    </>
  );
}
