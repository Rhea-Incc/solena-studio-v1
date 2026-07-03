// @lovable.dev/vite-tanstack-config already includes tanstackStart, viteReact, tailwind,
// tsConfigPaths, nitro (default cloudflare-module), VITE_* env injection, @ path alias,
// React/TanStack dedupe, error logger plugins, and sandbox detection.
//
// We build a static SPA-ish output for all external hosts (Vercel, Railway, Caddy).
// Vite 7 is required — Vite 8 + Nitro static fails with an HTML SSR-entry error.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: "static",
    output: { dir: "dist", publicDir: "dist/server" },
    ...({
      prerender: {
        crawlLinks: true,
        failOnError: false,
        routes: [
          "/",
          "/thesis",
          "/ecosystem",
          "/journal",
          "/contact",
          "/auth",
          "/sectors/real-estate",
          "/sectors/technology",
          "/sectors/hospitality",
          "/sectors/luxury",
          "/sectors/media",
          "/sectors/ventures",
          "/sectors/culture",
          "/sectors/capital",
        ],
      },
    } as Record<string, unknown>),
  },
});
