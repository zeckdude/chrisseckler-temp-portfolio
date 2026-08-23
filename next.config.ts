import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  // PostHog ingest URLs use trailing slashes; without this, Next 308s them and events drop
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      {
        source: "/projects/toucan-placeholder",
        destination: "/projects/toucan-browser-extension",
        permanent: true,
      },
      {
        source: "/projects/toucan-extension-website",
        destination: "/projects/toucan-browser-extension",
        permanent: true,
      },
      {
        source: "/projects/toucan-chrome-extension",
        destination: "/projects/toucan-browser-extension",
        permanent: true,
      },
      {
        source: "/projects/dave-placeholder",
        destination: "/projects/dave-support-tooling",
        permanent: true,
      },
      {
        source: "/projects/trailer-park-placeholder",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/employed",
        destination: "/full-time",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // Proxy PostHog static assets (JS snippet, toolbar, etc.)
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      // Proxy PostHog event ingestion
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
};

export default nextConfig;
