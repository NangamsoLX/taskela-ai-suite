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
import { SimBanner } from "@/components/sim-banner";
import { TOOLS } from "@/lib/tools";
import { simulateMeetingSummary, type MeetingSummary } from "@/lib/simulated-ai";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Summarizer · Taskela AI" },
      { name: "description", content: "Paste notes or transcripts to get summaries, decisions, action items, and deadlines." },
      { property: "og:title", content: "Meeting Summarizer · Taskela AI" },
      { property: "og:description", content: "Paste notes or transcripts to get summaries, decisions, action items, and deadlines." },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const tool = TOOLS.find((t) => t.key === "meetings")!;
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState<MeetingSummary | null>(null);

  const summarize = async () => {
    setLoading(true);
    const r = await simulateMeetingSummary(notes);
    setOut(r);
    setLoading(false);
  };

  const copy = () => {
    if (!out) return;
    const text = `Summary\n${out.summary}\n\nKey Decisions\n- ${out.decisions.join("\n- ")}\n\nAction Items\n${out.actions.map(a => `- ${a.task} — ${a.owner} (by ${a.deadline})`).join("\n")}\n\nDeadlines\n- ${out.deadlines.join("\n- ")}`;
    navigator.clipboard.writeText(text);
    toast.success("Summary copied");
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <ToolHeader
        icon={tool.icon}
        color={tool.colorVar}
        kandinsky={tool.kandinsky}
        title={tool.name}
        description="Paste raw notes or a transcript — we'll extract what matters."
      />

      <SimBanner color={tool.colorVar} />

      <div className="rounded-xl border bg-card p-5 space-y-4">
        <div>
          <label className="tracking-label mb-2 block">Meeting notes or transcript</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your notes here — the more detail, the better the summary."
            rows={10}
          />
        </div>
        <Button onClick={summarize} disabled={loading} className="w-full text-white" style={{ backgroundColor: tool.colorVar }}>
          <Sparkles className="mr-2 h-4 w-4" />
          {loading ? "Summarizing…" : "Summarize"}
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        {loading && Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
        {!loading && out && (
          <>
            <div className="flex justify-end">
              <Button size="sm" variant="outline" onClick={copy}><Copy className="mr-2 h-3.5 w-3.5" />Copy Summary</Button>
            </div>
            <SectionCard title="Summary" color={tool.colorVar}>
              <p className="text-sm leading-relaxed">{out.summary}</p>
            </SectionCard>
            <SectionCard title="Key Decisions" color={tool.colorVar}>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {out.decisions.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </SectionCard>
            <SectionCard title="Action Items" color={tool.colorVar}>
              <ul className="space-y-2 text-sm">
                {out.actions.map((a, i) => (
                  <li key={i} className="flex flex-wrap items-baseline justify-between gap-2 rounded-md border p-3">
                    <span>{a.task}</span>
                    <span className="text-xs text-muted-foreground">
                      <strong className="text-foreground">{a.owner}</strong> · by {a.deadline}
                    </span>
                  </li>
                ))}
              </ul>
            </SectionCard>
            <SectionCard title="Important Deadlines" color={tool.colorVar}>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {out.deadlines.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </SectionCard>
            <PromptViewer prompt={out.prompt} />
          </>
        )}
        {!loading && !out && (
          <div className="rounded-xl border border-dashed bg-muted/20 p-8 text-center text-sm text-muted-foreground">
            Your structured summary will appear here.
          </div>
        )}
      </div>
      <AiDisclaimer />
    </div>
  );
}

function SectionCard({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
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
