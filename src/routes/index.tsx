import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { TOOLS } from "@/lib/tools";
import { BrandMark } from "@/components/brand-mark";

const GLOWS: Record<string, string> = {
  chat: "var(--glow-chat)",
  email: "var(--glow-email)",
  planner: "var(--glow-planner)",
  meeting: "var(--glow-meeting)",
  research: "var(--glow-research)",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Taskela AI — Tasking For You" },
      { name: "description", content: "Your AI-powered workplace productivity suite: chat, email, planning, meeting notes, and research — in one place." },
      { property: "og:title", content: "Taskela AI — Tasking For You" },
      { property: "og:description", content: "Your AI-powered workplace productivity suite: chat, email, planning, meeting notes, and research." },
    ],
  }),
  component: Index,
});

function Index() {
  const top = TOOLS.slice(0, 3);
  const bottom = TOOLS.slice(3);

  return (
    <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-32">
      <section className="text-center">
        <BrandMark size="xl" />
        <p className="mx-auto mt-8 max-w-2xl text-base text-muted-foreground md:text-lg">
          Your AI-Powered Workplace Productivity Suite
        </p>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground/80">
          Automate the repetitive — drafting emails, summarizing meetings,
          planning schedules, conducting research — so you can focus on what matters.
        </p>
      </section>

      <section className="mt-20 grid gap-5 md:grid-cols-3">
        {top.map((t) => (
          <ToolCard key={t.key} t={t} />
        ))}
      </section>
      <section className="mt-5 grid gap-5 md:grid-cols-2">
        {bottom.map((t) => (
          <ToolCard key={t.key} t={t} />
        ))}
      </section>
    </div>
  );
}

function ToolCard({ t }: { t: (typeof TOOLS)[number] }) {
  const Icon = t.icon;
  return (
    <Link
      to={t.to}
      className="glass-card group flex flex-col p-6"
      style={{ ["--glow" as string]: GLOWS[t.key] } as React.CSSProperties}
    >
      <div className="flex items-center gap-2.5">
        <Icon className="h-5 w-5" style={{ color: t.colorVar }} />
        <h3 className="text-base font-semibold">{t.name}</h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.description}</p>
      <span className="mt-6 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors group-hover:text-accent">
        Open <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
