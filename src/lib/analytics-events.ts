/**
 * Named PostHog events for this site.
 * Keep in sync with capture calls and AGENTS.md ("Analytics events").
 * Do not import posthog-js here — this file is used on the server too.
 */
export const ANALYTICS_EVENTS = [
  {
    name: "$pageview",
    where: "src/components/posthog-provider.tsx — PostHogPageview",
    when: "Every App Router navigation (manual capture; capture_pageview is off)",
  },
  {
    name: "$pageleave",
    where: "posthog-js (capture_pageleave: true)",
    when: "Visitor leaves or hides the tab",
  },
  {
    name: "$web_vitals",
    where: "posthog-js (capture_performance.web_vitals)",
    when: "LCP, INP, CLS, FCP are available after load",
  },
  {
    name: "$exception",
    where: "ErrorBoundary + PostHog exception autocapture",
    when: "Unhandled React/render errors and window.onerror",
  },
  {
    name: "chat opened",
    where: "src/lib/chat-context.tsx",
    when: "Chat panel opens (button, inline prompt, or grid CTA)",
  },
  {
    name: "chat closed",
    where: "src/lib/chat-context.tsx",
    when: "Chat panel is dismissed",
  },
  {
    name: "chat conversation started",
    where: "src/components/chat/chat-panel.tsx",
    when: "First user message in this browser chat session",
  },
  {
    name: "chat message sent",
    where: "src/components/chat/chat-panel.tsx",
    when: "Visitor submits a chat turn (typed or suggested question)",
  },
  {
    name: "project filter changed",
    where: "src/lib/chat-context.tsx — setFilter / clearFilter",
    when: "Manual chips or AI tool call updates the projects grid filter",
  },
  {
    name: "project viewed",
    where: "src/components/analytics/project-view-tracker.tsx",
    when: "A project case-study page mounts",
  },
  {
    name: "outbound link clicked",
    where: "Button (external), project cards, footer, contact links",
    when: "Visitor clicks a link that leaves the site (or opens mail/GitHub/LinkedIn)",
  },
  {
    name: "contact intent",
    where: "contact page + hire/contact CTAs",
    when: "Visitor opens /contact or clicks a Get in touch / Hire CTA",
  },
  {
    name: "nav clicked",
    where: "src/components/nav.tsx",
    when: "Top nav or wordmark is clicked",
  },
  {
    name: "gallery slide changed",
    where: "src/components/ui/project-gallery.tsx",
    when: "Visitor advances the case-study gallery",
  },
  {
    name: "lightbox opened",
    where: "src/components/ui/project-gallery.tsx",
    when: "Visitor opens the full-screen media lightbox",
  },
  {
    name: "chat prompt dismissed",
    where: "src/components/chat/inline-chat-prompt.tsx",
    when: "Visitor dismisses the inline prompt on /projects",
  },
  {
    name: "resume downloaded",
    where: "employed page resume Button",
    when: "Visitor clicks Download Resume",
  },
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number]["name"];
