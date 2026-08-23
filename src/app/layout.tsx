import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Suspense } from "react";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { ChatProvider } from "@/lib/chat-context";
import ChatPanel from "@/components/chat/chat-panel";
import ChatButton from "@/components/chat/chat-button";
import { ChatLayoutShift } from "@/components/chat/chat-layout-shift";
import PresenceTracker from "@/components/presence-tracker";
import { PostHogProvider, PostHogPageview } from "@/components/posthog-provider";
import ErrorBoundary from "@/components/error-boundary";
import { ThemeProvider } from "@/components/theme-provider";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chrisseckler.com"),
  title: {
    default: "Chris Seckler — Senior Frontend Engineer",
    template: "%s — Chris Seckler",
  },
  description:
    "I build products people actually use — from zero to launch and everything after. Senior Frontend Engineer with 15+ years shipping React, TypeScript, and Next.js products.",
  openGraph: {
    title: "Chris Seckler — Senior Frontend Engineer",
    description:
      "I build products people actually use — from zero to launch and everything after.",
    url: "https://chrisseckler.com",
    siteName: "Chris Seckler",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,700,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col bg-bg text-text-primary antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <PostHogProvider>
        <Suspense fallback={null}>
          <PostHogPageview />
        </Suspense>
        <ErrorBoundary>
        <ThemeProvider>
        <ChatProvider>
          <ChatLayoutShift>
            <Nav />
            {children}
            <Footer />
          </ChatLayoutShift>
          <ChatButton />
          <ChatPanel />
          <PresenceTracker />
        </ChatProvider>
        </ThemeProvider>
        </ErrorBoundary>
        </PostHogProvider>
      </body>
    </html>
  );
}
