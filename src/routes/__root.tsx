import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  ScriptOnce,
  Link,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">This page doesn't exist.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

const themeScript = `(function(){try{var t=localStorage.getItem('taskela-theme');var d=t?t==='dark':true;if(d)document.documentElement.classList.add('dark');}catch(e){document.documentElement.classList.add('dark');}})();`;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Taskela AI — Tasking For You" },
      { name: "description", content: "An AI-powered workplace productivity suite that drafts emails, plans your day, summarizes meetings, and runs research." },
      { name: "author", content: "Nangamso Xengana" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Taskela AI — Tasking For You" },
      { name: "twitter:title", content: "Taskela AI — Tasking For You" },
      { property: "og:description", content: "An AI-powered workplace productivity suite that drafts emails, plans your day, summarizes meetings, and runs research." },
      { name: "twitter:description", content: "An AI-powered workplace productivity suite that drafts emails, plans your day, summarizes meetings, and runs research." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c73aa5da-a244-49cc-95dd-2446c40e9522/id-preview-37fab0c5--fc94a556-4060-47be-a32f-977487ce38b6.lovable.app-1779966149547.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c73aa5da-a244-49cc-95dd-2446c40e9522/id-preview-37fab0c5--fc94a556-4060-47be-a32f-977487ce38b6.lovable.app-1779966149547.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ScriptOnce>{themeScript}</ScriptOnce>
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
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-2 bg-background/70 px-6 backdrop-blur-md">
              <SidebarTrigger />
              <ThemeToggle />
            </header>
            <main className="flex-1">
              <Outlet />
            </main>
            <footer className="border-t px-4 py-4 text-center text-[11px] text-muted-foreground">
              Built by Nangamso Xengana · CAPACITI AI Skills Accelerator 2026 · Inspired by Kandinsky's Synesthetic Color Theory
            </footer>
          </div>
        </div>
        <Toaster />
      </SidebarProvider>
    </QueryClientProvider>
  );
}
