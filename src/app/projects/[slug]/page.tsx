import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Badge, { CompanyChip } from "@/components/ui/badge";
import { TechChipList } from "@/components/ui/tech-chip";
import ProjectThumbnail from "@/components/ui/project-thumbnail";
import ProjectGallery from "@/components/ui/project-gallery";
import { Reveal } from "@/components/motion/reveal";
import ProjectLinks from "@/components/project-detail/project-links";
import {
  ProjectSectionNavBar,
  ProjectSectionNavRoot,
  ProjectSectionNavSidebar,
} from "@/components/project-detail/project-section-nav";
import { getProjectBySlug, projects } from "@/lib/projects";
import { getProjectSections } from "@/lib/project-sections";
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
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal
      as="section"
      id={id}
      className="scroll-mt-24 border-t border-border pt-10"
    >
      <h2 className="font-display text-2xl font-extrabold text-text-primary">{title}</h2>
      <div className="mt-4 text-base leading-relaxed text-text-primary/90">{children}</div>
    </Reveal>
  );
}

function BuiltField({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[5.75rem_minmax(0,1fr)] gap-x-4">
      <dt className="pt-0.5 font-mono text-xs text-text-secondary">{label}</dt>
      <dd className="text-text-primary">{renderWithCode(value)}</dd>
    </div>
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

  const sections = getProjectSections(project);

  return (
    <ProjectSectionNavRoot sections={sections} slug={project.slug}>
      <div className="mx-auto px-6 py-16">
        <ProjectViewTracker slug={project.slug} title={project.title} />
        <div className="mx-auto flex max-w-[1080px] justify-center gap-10 xl:gap-14">
          <ProjectSectionNavSidebar />

          <article className="min-w-0 w-full max-w-case-study">
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
                <ProjectLinks links={project.links} slug={project.slug} />
              </div>
            </Reveal>

            <Reveal className="mt-10">
              {project.images && project.images.length > 0 ? (
                <ProjectGallery
                  images={project.images}
                  videoSrc={project.videoSrc}
                  imageCaptions={project.imageCaptions}
                  title={project.title}
                />
              ) : (
                <ProjectThumbnail title={project.title} className="aspect-16/9" />
              )}
            </Reveal>

            <div className="mt-4 flex flex-col gap-10">
              <ProjectSectionNavBar />

              <Section id="overview" title="Overview">
                <p>{renderWithCode(project.overview)}</p>
              </Section>

              {project.myRole && (
                <Section id="my-role" title="My Role">
                  <dl className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <dt className="font-mono text-xs text-text-secondary">Title</dt>
                      <dd className="mt-1 text-text-primary">
                        {renderWithCode(project.myRole.title)}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-xs text-text-secondary">Context</dt>
                      <dd className="mt-1 text-text-primary">
                        {renderWithCode(project.myRole.context)}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-xs text-text-secondary">Scope</dt>
                      <dd className="mt-1 text-text-primary">
                        {renderWithCode(project.myRole.scope)}
                      </dd>
                    </div>
                  </dl>
                </Section>
              )}

              {project.problem && (
                <Section id="the-problem" title="The Problem">
                  <p>{renderWithCode(project.problem)}</p>
                </Section>
              )}

              {project.whatIBuilt && project.whatIBuilt.length > 0 && (
                <Section id="what-i-built" title="What I Built">
                  <ul className="divide-y divide-border">
                    {project.whatIBuilt.map((item) => (
                      <li key={item.title} className="py-6 first:pt-0 last:pb-0">
                        <h3 className="text-base font-semibold tracking-tight text-text-primary">
                          {renderWithCode(item.title)}
                        </h3>
                        <dl className="mt-3 flex flex-col gap-2">
                          <BuiltField label="Problem" value={item.problem} />
                          <BuiltField label="Fix" value={item.fix} />
                          <BuiltField label="Result" value={item.result} />
                        </dl>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {project.techStack.length > 0 && (
                <Section id="tech-stack" title="Tech Stack">
                  <TechChipList items={project.techStack} />
                </Section>
              )}

              {project.outcome && (
                <Section id="outcome" title="Outcome / Impact">
                  <p>{renderWithCode(project.outcome)}</p>
                </Section>
              )}

              <Reveal as="section" className="border-t border-border pt-10">
                <ProjectLinks links={project.links} slug={project.slug} />
              </Reveal>
            </div>
          </article>
        </div>
      </div>
    </ProjectSectionNavRoot>
  );
}
