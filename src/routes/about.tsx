import { createFileRoute } from "@tanstack/react-router";
import { Github } from "lucide-react";
import { TOOLS } from "@/lib/tools";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About · Taskela AI" },
      { name: "description", content: "The Kandinsky-inspired design philosophy behind Taskela AI." },
      { property: "og:title", content: "About · Taskela AI" },
      { property: "og:description", content: "The Kandinsky-inspired design philosophy behind Taskela AI." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="tracking-label">About</p>
      <h1 className="mt-2 text-3xl font-bold md:text-4xl">Designed with Synesthesia</h1>

      <p className="mt-6 text-base leading-relaxed text-muted-foreground">
        Each colour in Taskela AI is mapped to Kandinsky's synesthetic system — he could hear colours and see music.
        Deep blue is a cello, yellow is a trumpet, red is a tuba, orange is a church bell, teal is a quiet violin.
      </p>

      <h2 className="mt-12 text-xl font-semibold">Synesthetic Color Palette</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Each tool carries a colour and the instrument Kandinsky associated with it.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {TOOLS.map((t) => (
          <div key={t.key} className="glass-card flex items-center gap-3 p-4">
            <span className="h-8 w-8 rounded-md shrink-0" style={{ backgroundColor: t.colorVar }} />
            <div>
              <p className="text-sm font-semibold">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.kandinsky}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">Credit</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Designed and built by <strong className="text-foreground">Nangamso Xengana</strong> as part of the
          CAPACITI AI Skills Accelerator Programme 2026.
        </p>
        <div className="mt-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors hover:border-accent hover:text-accent"
          >
            <Github className="h-4 w-4" /> GitHub Repository
          </a>
        </div>
      </div>
    </div>
  );
}
