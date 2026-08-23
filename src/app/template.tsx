import PageTransition from "@/components/motion/page-transition";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <PageTransition>
      <main id="main" className="flex-1">
        {children}
      </main>
    </PageTransition>
  );
}
