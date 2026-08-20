"use client";

import Link from "next/link";
import Badge, { CompanyChip } from "./badge";
import { TechChipList } from "./tech-chip";
import ProjectThumbnail from "./project-thumbnail";
import type { Project } from "@/lib/projects";
import { track } from "@/lib/analytics";

export default function ProjectCard({ project }: { project: Project }) {
  const detailHref = `/projects/${project.slug}`;

  return (
    <div className="group flex h-full flex-col rounded-md border border-border bg-surface p-4 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-accent/40">
      <Link href={detailHref} className="flex flex-1 flex-col">
        <div className="overflow-hidden rounded">
          <ProjectThumbnail title={project.title} image={project.images?.[0]} />
        </div>
        <div className="mt-4 flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge type={project.badge} />
            {project.company && <CompanyChip company={project.company} />}
          </div>
          <h3 className="font-display text-lg font-extrabold leading-snug text-text-primary">
            {project.title}
          </h3>
          <p className="text-sm text-text-secondary">{project.tagline}</p>
          <TechChipList items={project.techStack} max={5} className="mt-auto pt-2" />
        </div>
      </Link>
      <div className="mt-4 flex items-center gap-4 border-t border-border pt-3 text-sm">
        {project.links.live && (
          <a
            href={project.links.live}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("outbound link clicked", { href: project.links.live, kind: "live", slug: project.slug })}
            className="text-text-secondary transition-colors hover:text-accent"
          >
            Live Site
          </a>
        )}
        {project.links.github && (
          <a
            href={project.links.github}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("outbound link clicked", { href: project.links.github, kind: "github", slug: project.slug })}
            className="text-text-secondary transition-colors hover:text-accent"
          >
            GitHub
          </a>
        )}
        <Link
          href={detailHref}
          className="ml-auto font-medium text-accent transition-opacity hover:opacity-80"
        >
          Case Study →
        </Link>
      </div>
    </div>
  );
}
