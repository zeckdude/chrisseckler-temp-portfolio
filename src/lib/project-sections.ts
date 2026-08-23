import type { Project } from "@/lib/projects";

export interface ProjectSection {
  id: string;
  label: string;
}

export function getProjectSections(project: Project): ProjectSection[] {
  const sections: ProjectSection[] = [{ id: "overview", label: "Overview" }];

  if (project.myRole) {
    sections.push({ id: "my-role", label: "My Role" });
  }
  if (project.problem) {
    sections.push({ id: "the-problem", label: "The Problem" });
  }
  if (project.whatIBuilt && project.whatIBuilt.length > 0) {
    sections.push({ id: "what-i-built", label: "What I Built" });
  }
  if (project.techStack.length > 0) {
    sections.push({ id: "tech-stack", label: "Tech Stack" });
  }
  if (project.outcome) {
    sections.push({ id: "outcome", label: "Outcome" });
  }

  return sections;
}
