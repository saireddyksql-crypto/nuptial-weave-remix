import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CursorTrail } from "../components/CursorTrail";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-serif text-maroon">404</h1>
        <p className="mt-4 font-sans text-sm uppercase tracking-[0.3em] text-muted-foreground">
          This page has wandered off
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-sm border border-gold/60 px-6 py-3 text-xs uppercase tracking-[0.3em] text-maroon transition-colors hover:bg-maroon hover:text-parchment"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-serif text-maroon">Something interrupted the ceremony</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please try again in a moment.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-flex items-center justify-center rounded-sm border border-gold/60 px-6 py-3 text-xs uppercase tracking-[0.3em] text-maroon transition-colors hover:bg-maroon hover:text-parchment"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Meghana Raj & Sai Pradyumna — Wedding Invitation" },
      { name: "description", content: "Join us as Meghana Raj weds Sai Pradyumna on 27th August 2026 at U.B.R. Convention, Kurnool." },
      { name: "author", content: "The Mohanapu & Raju Families" },
      { property: "og:title", content: "Meghana Raj & Sai Pradyumna — Wedding Invitation" },
      { property: "og:description", content: "Join us as Meghana Raj weds Sai Pradyumna on 27th August 2026 at U.B.R. Convention, Kurnool." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Meghana Raj & Sai Pradyumna — Wedding Invitation" },
      { name: "twitter:description", content: "Join us as Meghana Raj weds Sai Pradyumna on 27th August 2026 at U.B.R. Convention, Kurnool." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/fcf36261-abf9-43f9-9cd1-cef5cdd7abf8" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/fcf36261-abf9-43f9-9cd1-cef5cdd7abf8" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Italiana&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Cormorant+SC:wght@300;400;500&family=Pinyon+Script&family=Jost:wght@200;300;400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
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
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <CursorTrail />
      <Toaster position="bottom-center" />
    </QueryClientProvider>
  );
}
