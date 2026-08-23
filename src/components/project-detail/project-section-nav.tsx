"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import type { ProjectSection } from "@/lib/project-sections";

const DRAWER_W = "min(18rem, 88vw)";

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function TocIcon({ className }: { className?: string }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M5.5 4.5h9.5M5.5 8.5h9.5M5.5 12.5h6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M2.5 3.25v10.5"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface ProjectSectionNavContextValue {
  sections: ProjectSection[];
  activeId: string;
  onSectionClick: (section: ProjectSection) => void;
  mobileDrawerOpen: boolean;
  setMobileDrawerOpen: (open: boolean) => void;
  slug: string;
}

const ProjectSectionNavContext = createContext<ProjectSectionNavContextValue | null>(null);

/** Matches scroll-mt on case-study sections: room for sticky site header. */
function getScrollSpyOffset() {
  return 96;
}

function resolveActiveSection(sections: ProjectSection[]): string {
  if (sections.length === 0) return "";

  const doc = document.documentElement;
  const atBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - 4;
  if (atBottom) {
    return sections[sections.length - 1].id;
  }

  const offset = getScrollSpyOffset();

  for (let i = sections.length - 1; i >= 0; i--) {
    const element = document.getElementById(sections[i].id);
    if (!element) continue;
    if (element.getBoundingClientRect().top <= offset) {
      return sections[i].id;
    }
  }

  return sections[0].id;
}

function useProjectSectionNav() {
  const context = useContext(ProjectSectionNavContext);
  if (!context) {
    throw new Error("Project section nav components must be used within ProjectSectionNavRoot");
  }
  return context;
}

interface ProjectSectionNavRootProps {
  sections: ProjectSection[];
  slug: string;
  children: ReactNode;
}

export function ProjectSectionNavRoot({ sections, slug, children }: ProjectSectionNavRootProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const scrollLockUntilRef = useRef(0);

  useEffect(() => {
    if (sections.length === 0) return;

    let rafId = 0;

    const syncActiveSection = () => {
      if (Date.now() < scrollLockUntilRef.current) return;
      setActiveId((current) => {
        const next = resolveActiveSection(sections);
        return next === current ? current : next;
      });
    };

    const scheduleSync = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(syncActiveSection);
    };

    scheduleSync();
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync, { passive: true });

    return () => {
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      cancelAnimationFrame(rafId);
    };
  }, [sections]);

  useEffect(() => {
    if (!mobileDrawerOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileDrawerOpen(false);
      }
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileDrawerOpen]);

  const onSectionClick = useCallback(
    (section: ProjectSection) => {
      const element = document.getElementById(section.id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      scrollLockUntilRef.current = Date.now() + 900;
      setActiveId(section.id);
      setMobileDrawerOpen(false);
      track("case study section clicked", {
        slug,
        section: section.id,
        label: section.label,
      });
    },
    [slug],
  );

  const value = useMemo(
    () => ({
      sections,
      activeId,
      onSectionClick,
      mobileDrawerOpen,
      setMobileDrawerOpen,
      slug,
    }),
    [sections, activeId, onSectionClick, mobileDrawerOpen, slug],
  );

  return (
    <ProjectSectionNavContext.Provider value={value}>{children}</ProjectSectionNavContext.Provider>
  );
}

function SectionNavButton({
  section,
  active,
  onClick,
  className,
}: {
  section: ProjectSection;
  active: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={className}
    >
      {section.label}
    </button>
  );
}

function SectionNavList({ className }: { className?: string }) {
  const { sections, activeId, onSectionClick } = useProjectSectionNav();

  return (
    <ul className={cn("flex flex-col gap-0.5 border-l border-border", className)}>
      {sections.map((section) => {
        const active = section.id === activeId;
        return (
          <li key={section.id}>
            <SectionNavButton
              section={section}
              active={active}
              onClick={() => onSectionClick(section)}
              className={cn(
                "relative block w-full border-l-2 py-2 pl-4 text-left text-sm font-medium leading-snug transition-colors duration-200 -ml-px",
                active
                  ? "border-accent text-accent"
                  : "border-transparent text-text-secondary hover:border-border hover:text-text-primary",
              )}
            />
          </li>
        );
      })}
    </ul>
  );
}

function ProjectSectionNavMobilePeek() {
  const {
    sections,
    activeId,
    mobileDrawerOpen,
    setMobileDrawerOpen,
    slug,
  } = useProjectSectionNav();
  const navRef = useRef<HTMLElement | null>(null);
  const [showPeek, setShowPeek] = useState(false);
  const mounted = useMounted();

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    let rafId = 0;

    const syncPeek = () => {
      const { top, bottom } = nav.getBoundingClientRect();
      const offset = getScrollSpyOffset();
      setShowPeek(bottom < offset && top < offset);
    };

    const scheduleSync = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(syncPeek);
    };

    scheduleSync();
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync, { passive: true });

    return () => {
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const activeLabel = sections.find((section) => section.id === activeId)?.label ?? "Sections";

  function openDrawer() {
    setMobileDrawerOpen(true);
    track("case study section nav opened", { slug });
  }

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Case study sections"
        className="border-t border-border pt-8 xl:hidden"
      >
        <p className="font-mono text-xs font-medium uppercase tracking-widest text-text-secondary">
          On this page
        </p>
        <SectionNavList className="mt-3 max-w-xs" />
      </nav>

      {mounted &&
        createPortal(
          <>
            <button
              type="button"
              aria-label={`Open section navigation. Current section: ${activeLabel}`}
              aria-expanded={mobileDrawerOpen}
              onClick={openDrawer}
              className={cn(
                "fixed right-0 top-[38%] z-40 flex h-14 w-11 flex-col items-center justify-center rounded-l-lg border border-r-0 border-border bg-surface/95 shadow-lg backdrop-blur-sm transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] before:absolute before:inset-y-2.5 before:left-0 before:w-[3px] before:rounded-r-full before:bg-accent before:content-[''] xl:hidden",
                showPeek && !mobileDrawerOpen
                  ? "translate-x-[calc(100%-2.125rem)]"
                  : "translate-x-full pointer-events-none",
              )}
            >
              <TocIcon className="text-text-primary" />
            </button>

            <AnimatePresence>
              {mobileDrawerOpen && (
                <div className="fixed inset-0 z-50 xl:hidden" role="presentation">
                  <motion.button
                    type="button"
                    aria-label="Close section navigation"
                    className="absolute inset-0 bg-black/45"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    onClick={() => setMobileDrawerOpen(false)}
                  />
                  <motion.aside
                    role="dialog"
                    aria-modal="true"
                    aria-label="Case study sections"
                    style={{ width: DRAWER_W }}
                    className="absolute inset-y-0 right-0 flex flex-col border-l border-border bg-bg shadow-2xl"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="flex items-center justify-between border-b border-border px-5 py-4">
                      <p className="font-mono text-xs font-medium uppercase tracking-widest text-text-secondary">
                        On this page
                      </p>
                      <button
                        type="button"
                        aria-label="Close"
                        onClick={() => setMobileDrawerOpen(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
                      >
                        <X size={18} strokeWidth={1.75} aria-hidden />
                      </button>
                    </div>
                    <div className="overflow-y-auto px-5 py-5">
                      <SectionNavList />
                    </div>
                  </motion.aside>
                </div>
              )}
            </AnimatePresence>
          </>,
          document.body,
        )}
    </>
  );
}

export function ProjectSectionNavSidebar() {
  const { sections } = useProjectSectionNav();
  if (sections.length < 2) return null;

  return (
    <nav
      aria-label="Case study sections"
      className="hidden w-44 shrink-0 xl:block"
    >
      <div className="sticky top-24 pb-8">
        <p className="font-mono text-xs font-medium uppercase tracking-widest text-text-secondary">
          On this page
        </p>
        <SectionNavList className="mt-4" />
      </div>
    </nav>
  );
}

export function ProjectSectionNavBar() {
  const { sections } = useProjectSectionNav();
  if (sections.length < 2) return null;

  return <ProjectSectionNavMobilePeek />;
}
