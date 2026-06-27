// @lovable.dev/vite-tanstack-config already includes tanstackStart, viteReact, tailwind,
// tsConfigPaths, nitro (default cloudflare-module), VITE_* env injection, @ path alias,
// React/TanStack dedupe, error logger plugins, and sandbox detection.
//
// We override the nitro preset to `static` so the app pre-renders to plain HTML/JS
// that can be served by ANY static host (Railway+Caddy, Vercel, Netlify, Cloudflare
// Pages, S3, etc.) without runtime-server requirements. The Caddyfile is configured
// to serve `dist/server` (publicDir below) with SPA-style try_files fallback.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: "static",
    output: { dir: "dist", publicDir: "dist/server" },
    // `prerender` is a valid nitro option but not in the lovable wrapper's
    // typed surface — cast to satisfy TS.
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
