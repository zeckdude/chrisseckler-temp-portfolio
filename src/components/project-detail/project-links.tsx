import Button from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProjectLinks as ProjectLinksData } from "@/lib/projects";

interface ProjectLinksProps {
  links: ProjectLinksData;
  slug: string;
  className?: string;
}

export default function ProjectLinks({ links, slug, className }: ProjectLinksProps) {
  const hasLinks = links.live || links.liveNote || links.github || links.company;
  if (!hasLinks) return null;

  const eventProps = { slug };

  return (
    <div className={cn("flex flex-wrap items-start gap-4", className)}>
      {links.live && (
        <Button href={links.live} external eventProps={eventProps}>
          Live Site
        </Button>
      )}
      {!links.live && links.liveNote && (
        <div className="flex flex-col gap-1">
          <button
            type="button"
            disabled
            className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-md bg-accent/30 px-5 py-3 text-sm font-semibold text-accent/50"
          >
            Live Site
          </button>
          <span className="pl-1 text-xs text-text-secondary">{links.liveNote}</span>
        </div>
      )}
      {links.github && (
        <Button href={links.github} variant="ghost" external eventProps={eventProps}>
          GitHub
        </Button>
      )}
      {links.company && (
        <Button href={links.company} variant="ghost" external eventProps={eventProps}>
          Company
        </Button>
      )}
    </div>
  );
}
