import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { TOOLS } from "@/lib/tools";
import logo from "@/assets/taskela-logo.png";

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
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      <section className="text-center">
        <img
          src={logo}
          alt="Taskela AI"
          style={{ width: 200 }}
          className="mx-auto object-contain dark:invert-0"
        />
        <p className="tracking-label mt-6">Tasking For You</p>
        <h1 className="mt-3 text-4xl font-bold md:text-6xl">
          Taskela <span className="text-accent">AI</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
          Your AI-Powered Workplace Productivity Suite
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground">
          Professionals spend hours on repetitive tasks like drafting emails, summarizing meetings,
          planning schedules, and conducting research. Taskela AI automates these with intelligent
          AI — so you can focus on what matters.
        </p>
      </section>

      <section className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.key}
              to={t.to}
              className="group relative flex flex-col rounded-xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <span
                className="absolute left-0 top-0 h-full w-1 rounded-l-xl"
                style={{ backgroundColor: t.colorVar }}
                aria-hidden
              />
              <div
                className="flex h-11 w-11 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: t.colorVar }}
              >
                <Icon className="h-5 w-5" />
              </div>
              <p className="tracking-label mt-4">{t.kandinsky}</p>
              <h3 className="mt-1 text-lg font-semibold">{t.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                Open tool <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
