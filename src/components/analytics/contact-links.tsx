"use client";

import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { siteConfig } from "@/lib/content";
import { track } from "@/lib/analytics";
import ContactIntentTracker from "@/components/analytics/contact-intent-tracker";

const links = [
  {
    href: `mailto:${siteConfig.email}`,
    label: siteConfig.email,
    icon: Mail,
    kind: "email",
    external: false,
  },
  {
    href: siteConfig.linkedin,
    label: "linkedin.com/in/chrisseckler",
    icon: LinkedInIcon,
    kind: "linkedin",
    external: true,
  },
  {
    href: siteConfig.github,
    label: "github.com/zeckdude",
    icon: GitHubIcon,
    kind: "github",
    external: true,
  },
];

export default function ContactLinks() {
  return (
    <>
      <ContactIntentTracker source="contact-page" />
      <RevealGroup className="mt-12 flex flex-col gap-3">
        {links.map((link) => (
          <Reveal key={link.href}>
            <a
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              onClick={() => track("outbound link clicked", { href: link.href, kind: link.kind })}
              className="group flex items-center gap-4 rounded-md border border-border bg-surface p-5 transition-colors duration-200 hover:border-accent/40"
            >
              <link.icon className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.75} aria-hidden />
              <span className="font-mono text-sm text-text-primary transition-colors group-hover:text-accent">
                {link.label}
              </span>
            </a>
          </Reveal>
        ))}
      </RevealGroup>
    </>
  );
}
