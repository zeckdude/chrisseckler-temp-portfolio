import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Badge, { CompanyChip } from "@/components/ui/badge";
import { TechChipList } from "@/components/ui/tech-chip";
import ProjectThumbnail from "@/components/ui/project-thumbnail";
import ProjectGallery from "@/components/ui/project-gallery";
import Button from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { getProjectBySlug, projects } from "@/lib/projects";
import { renderWithCode } from "@/lib/render-with-code";
import ProjectViewTracker from "@/components/analytics/project-view-tracker";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.tagline,
  };
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal as="section" className="border-t border-border pt-10">
      <h2 className="font-display text-2xl font-extrabold text-text-primary">{title}</h2>
      <div className="mt-4 text-base leading-relaxed text-text-primary/90">{children}</div>
    </Reveal>
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-case-study px-6 py-16">
      <ProjectViewTracker slug={project.slug} title={project.title} />
      <Reveal>
        <Link
          href="/projects"
          className="text-sm font-medium text-text-secondary transition-colors hover:text-accent"
        >
          ← All projects
        </Link>

        <div className="mt-6 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge type={project.badge} />
            {project.company && <CompanyChip company={project.company} />}
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl">
            {project.title}
          </h1>
          <p className="font-mono text-sm text-text-secondary">{project.dates}</p>
          <p className="text-lg text-text-secondary sm:text-xl">{project.tagline}</p>
        </div>
      </Reveal>

      <Reveal className="mt-10">
        {project.images && project.images.length > 0 ? (
          <ProjectGallery images={project.images} videoSrc={project.videoSrc} imageCaptions={project.imageCaptions} title={project.title} />
        ) : (
          <ProjectThumbnail title={project.title} className="aspect-16/9" />
        )}
      </Reveal>

      <div className="mt-4 flex flex-col gap-10">
        <Section title="Overview">
          <p>{renderWithCode(project.overview)}</p>
        </Section>

        {project.myRole && (
          <Section title="My Role">
            <dl className="grid gap-4 sm:grid-cols-3">
              <div>
                <dt className="font-mono text-xs text-text-secondary">Title</dt>
                <dd className="mt-1 text-text-primary">{renderWithCode(project.myRole.title)}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs text-text-secondary">Context</dt>
                <dd className="mt-1 text-text-primary">{renderWithCode(project.myRole.context)}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs text-text-secondary">Scope</dt>
                <dd className="mt-1 text-text-primary">{renderWithCode(project.myRole.scope)}</dd>
              </div>
            </dl>
          </Section>
        )}

        {project.problem && (
          <Section title="The Problem">
            <p>{renderWithCode(project.problem)}</p>
          </Section>
        )}

        {project.whatIBuilt && project.whatIBuilt.length > 0 && (
          <Section title="What I Built">
            <ul className="flex flex-col gap-3">
              {project.whatIBuilt.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{renderWithCode(item)}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {project.techStack.length > 0 && (
          <Section title="Tech Stack">
            <TechChipList items={project.techStack} />
          </Section>
        )}

        {project.outcome && (
          <Section title="Outcome / Impact">
            <p>{renderWithCode(project.outcome)}</p>
          </Section>
        )}

        <Reveal as="section" className="flex flex-wrap items-start gap-4 border-t border-border pt-10">
          {project.links.live && (
            <Button href={project.links.live} external>
              Live Site
            </Button>
          )}
          {!project.links.live && project.links.liveNote && (
            <div className="flex flex-col gap-1">
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-md bg-accent/30 px-5 py-3 text-sm font-semibold text-accent/50"
              >
                Live Site
              </button>
              <span className="pl-1 text-xs text-text-secondary">{project.links.liveNote}</span>
            </div>
          )}
          {project.links.github && (
            <Button href={project.links.github} variant="ghost" external>
              GitHub
            </Button>
          )}
          {project.links.company && (
            <Button href={project.links.company} variant="ghost" external>
              Company
            </Button>
          )}
        </Reveal>
      </div>
    </article>
  );
}
