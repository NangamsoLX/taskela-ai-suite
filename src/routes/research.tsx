import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ToolHeader } from "@/components/tool-header";
import { PromptViewer } from "@/components/prompt-viewer";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { TOOLS } from "@/lib/tools";
import { simulateResearch, type ResearchOutput } from "@/lib/simulated-ai";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research Assistant · Taskela AI" },
      { name: "description", content: "Get structured overviews, key insights, and simplified explanations." },
      { property: "og:title", content: "Research Assistant · Taskela AI" },
      { property: "og:description", content: "Get structured overviews, key insights, and simplified explanations." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const tool = TOOLS.find((t) => t.key === "research")!;
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState<ResearchOutput | null>(null);

  const research = async () => {
    setLoading(true);
    const r = await simulateResearch(topic);
    setOut(r);
    setLoading(false);
  };

  const copy = () => {
    if (!out) return;
    const text = `Overview\n${out.overview}\n\nKey Insights\n${out.insights.map(i => `- ${i.title}: ${i.detail}`).join("\n")}\n\nRecommendations\n- ${out.recommendations.join("\n- ")}\n\nSimplified\n${out.simple}`;
    navigator.clipboard.writeText(text);
    toast.success("Research copied");
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <ToolHeader
        icon={tool.icon}
        color={tool.colorVar}
        kandinsky={tool.kandinsky}
        title={tool.name}
        description="Type a topic or question. We'll return a structured brief you can act on."
      />

      <div className="rounded-xl border bg-card p-5 space-y-4">
        <div>
          <label className="tracking-label mb-2 block">Topic or question</label>
          <Textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. How are teams adopting AI in customer support workflows?"
            rows={4}
          />
        </div>
        <Button onClick={research} disabled={loading} className="w-full text-white" style={{ backgroundColor: tool.colorVar }}>
          <Sparkles className="mr-2 h-4 w-4" />
          {loading ? "Researching…" : "Research"}
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        {loading && Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
        {!loading && out && (
          <>
            <div className="flex justify-end">
              <Button size="sm" variant="outline" onClick={copy}><Copy className="mr-2 h-3.5 w-3.5" />Copy Research</Button>
            </div>

            <Section title="Overview" color={tool.colorVar}>
              <p className="text-sm leading-relaxed">{out.overview}</p>
            </Section>

            <Section title="Key Insights" color={tool.colorVar}>
              <div className="grid gap-3 sm:grid-cols-2">
                {out.insights.map((i, idx) => (
                  <div key={idx} className="rounded-lg border bg-background p-4">
                    <h4 className="text-sm font-semibold">{i.title}</h4>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{i.detail}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Recommendations" color={tool.colorVar}>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {out.recommendations.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </Section>

            <Section title="Simplified Explanation" color={tool.colorVar}>
              <p className="text-sm italic leading-relaxed text-muted-foreground">{out.simple}</p>
            </Section>

            <PromptViewer prompt={out.prompt} />
          </>
        )}
        {!loading && !out && (
          <div className="rounded-xl border border-dashed bg-muted/20 p-8 text-center text-sm text-muted-foreground">
            Your research brief will appear here.
          </div>
        )}
      </div>
      <AiDisclaimer />
    </div>
  );
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        <h3 className="text-sm font-semibold uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  );
}
