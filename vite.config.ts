// @lovable.dev/vite-tanstack-config already includes tanstackStart, viteReact, tailwind,
// tsConfigPaths, nitro (default cloudflare-module), VITE_* env injection, @ path alias,
// React/TanStack dedupe, error logger plugins, and sandbox detection.
//
// Vercel needs Nitro's Vercel adapter; generic static hosts keep the static output
// used by the Caddyfile. Vite is pinned to v7 because the current Nitro static
// pipeline fails under Vite 8 with an HTML SSR-entry error.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isVercel = process.env.VERCEL === "1";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: isVercel
    ? { preset: "vercel" }
    : {
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
