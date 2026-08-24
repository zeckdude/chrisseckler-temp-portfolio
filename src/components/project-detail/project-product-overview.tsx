"use client";

import { useState } from "react";
import ProjectLightbox from "@/components/ui/project-lightbox";
import VideoPoster from "@/components/ui/video-poster";
import type { ProductOverview } from "@/lib/projects";
import { renderWithCode } from "@/lib/render-with-code";
import { track } from "@/lib/analytics";

export default function ProjectProductOverview({
  overview,
  projectTitle,
}: {
  overview: ProductOverview;
  projectTitle: string;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const title = overview.title ?? "Product overview";

  return (
    <>
      {overview.caption && (
        <p className="text-base leading-relaxed text-text-primary/90">
          {renderWithCode(overview.caption)}
        </p>
      )}

      <button
        type="button"
        onClick={() => {
          setLightboxOpen(true);
          track("lightbox opened", {
            title: projectTitle,
            index: 0,
            source: "product-overview",
          });
        }}
        className="mt-4 block w-full cursor-pointer overflow-hidden rounded border border-border bg-surface text-left transition-colors hover:border-accent/40"
        aria-label={`Play ${title} video for ${projectTitle}`}
      >
        <div className="relative aspect-video w-full">
          <VideoPoster
            src={overview.videoSrc}
            poster={overview.poster}
            objectFit={overview.poster ? "cover" : "contain"}
            playIconSize="md"
            label={`${title} video`}
            className="absolute inset-0"
          />
        </div>
      </button>

      {lightboxOpen && (
        <ProjectLightbox
          slides={[{ type: "video", src: overview.videoSrc, poster: overview.poster }]}
          initialIndex={0}
          captions={[{ headline: title, caption: overview.caption }]}
          onClose={() => setLightboxOpen(false)}
          onNavigate={() => {}}
        />
      )}
    </>
  );
}
