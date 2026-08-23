"use client";

import Link from "next/link";
import { Briefcase, Mail, PenLine } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { contact, siteConfig } from "@/lib/content";
import { track } from "@/lib/analytics";
import ContactIntentTracker from "@/components/analytics/contact-intent-tracker";

const hireIcons = {
  "/freelance": PenLine,
  "/full-time": Briefcase,
} as const;

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
      <Reveal className="mt-12">
        <h2 className="font-display text-xl font-bold tracking-tight text-text-primary">
          {contact.hire.headline}
        </h2>
      </Reveal>
      <RevealGroup className="mt-4 flex flex-col gap-3">
        {contact.hire.links.map((link) => {
          const Icon = hireIcons[link.href as keyof typeof hireIcons];
          return (
            <Reveal key={link.href}>
              <Link
                href={link.href}
                className="group flex items-center gap-4 rounded-md border border-border bg-surface p-5 transition-colors duration-200 hover:border-accent/40"
              >
                <Icon className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.75} aria-hidden />
                <span>
                  <span className="block text-sm font-semibold text-text-primary transition-colors group-hover:text-accent">
                    {link.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-text-secondary">{link.description}</span>
                </span>
              </Link>
            </Reveal>
          );
        })}
      </RevealGroup>

      <Reveal className="mt-12">
        <h2 className="font-display text-xl font-bold tracking-tight text-text-primary">
          Direct contact
        </h2>
      </Reveal>
      <RevealGroup className="mt-4 flex flex-col gap-3">
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
