import type { Metadata } from "next";
import ProjectsGrid from "@/components/projects-grid";
import InlineChatPrompt from "@/components/chat/inline-chat-prompt";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Professional and personal projects from Chris Seckler, Senior Frontend Engineer.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-content px-6 py-16">
      <div className="mb-10 max-w-2xl">
        <h1 className="font-display text-3xl font-extrabold text-text-primary sm:text-4xl">
          Projects
        </h1>
        <p className="mt-3 text-text-secondary">
          Professional work and personal builds — same template, same bar.
        </p>
      </div>

      <InlineChatPrompt />
      <ProjectsGrid />
    </div>
  );
}
