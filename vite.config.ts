// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    optimizeDeps: {
      // Prebundle hook-based UI dependencies with React on initial startup,
      // rather than discovering them after an existing preview has loaded.
      include: [
        "@radix-ui/react-dialog",
        "@radix-ui/react-slot",
        "@radix-ui/react-switch",
        "@radix-ui/react-label",
        // Prebundle the React-facing router and query packages with React itself, so a
        // route discovered later (like the game) never loads a second React copy
        // and crash the open preview with a null dispatcher.
        // @tanstack/react-start is deliberately NOT listed: prebundling it drags Node's
        // async_hooks AsyncLocalStorage into the browser and blanks every page.
        "@tanstack/react-router",
        "@tanstack/react-query",
        // Prebundle router internals discovered late on server restart,
        // so an open preview never reloads into stale module URLs.
        "@tanstack/router-core",
        "@tanstack/router-core/isServer",
        "@tanstack/router-core/ssr/client",
        "seroval",
      ],
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
