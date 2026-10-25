import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { DailyStreakProvider } from "@/components/daily-streak";
import { applyTheme, readTheme, THEME_CHANGED, THEME_STORE } from "@/lib/theme";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Together — My voice" },
      { name: "description", content: "A welcoming space for picture-based communication." },
      { property: "og:title", content: "Together — My voice" },
      { property: "og:description", content: "A welcoming space for picture-based communication." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

// Runs before any module script: when a stale tab asks the dev server for a
// module that no longer exists (after a restart/re-optimization), reload once
// instead of leaving a blank screen. The flag is cleared on a successful load
// so recovery re-arms, and a failed reload never loops.
const STALE_CHUNK_RECOVERY = `(function(){var K="together-chunk-reload";function bad(m){return m.indexOf("Importing a module script failed")!==-1||m.indexOf("Failed to fetch dynamically imported module")!==-1||m.indexOf("error loading dynamically imported module")!==-1}function recover(){try{if(sessionStorage.getItem(K))return;sessionStorage.setItem(K,"1")}catch(e){}location.reload()}window.addEventListener("error",function(ev){var t=ev&&ev.target;if(t&&t.tagName==="SCRIPT"){recover();return}var m=(ev&&ev.message)||"";if(bad(m))recover()},true);window.addEventListener("unhandledrejection",function(ev){var r=ev&&ev.reason;var m=String(r&&(r.message||r)||"");if(bad(m))recover()});window.addEventListener("load",function(){try{sessionStorage.removeItem(K)}catch(e){}})})();`;

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: STALE_CHUNK_RECOVERY }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    const sync = () => applyTheme(readTheme());
    const onStorage = (event: StorageEvent) => { if (event.key === THEME_STORE || event.key === null) sync(); };
    sync();
    window.addEventListener(THEME_CHANGED, sync);
    window.addEventListener("storage", onStorage);
    return () => { window.removeEventListener(THEME_CHANGED, sync); window.removeEventListener("storage", onStorage); };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <DailyStreakProvider><Outlet /></DailyStreakProvider>
    </QueryClientProvider>
  );
}
