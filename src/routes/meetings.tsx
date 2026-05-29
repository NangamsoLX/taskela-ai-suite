import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Check, Copy, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolHeader } from "@/components/tool-header";
import { PromptViewer } from "@/components/prompt-viewer";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { SimBanner } from "@/components/sim-banner";
import { TypingDots } from "@/components/typing-dots";
import { TOOLS } from "@/lib/tools";
import { buildMeetingPrompt } from "@/lib/build-prompts";
import { extractJSON } from "@/lib/extract-json";

interface ActionItem { task: string; owner: string; deadline: string }
interface MeetingSummary { summary: string; decisions: string[]; actions: ActionItem[]; deadlines: string[] }

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
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/meetings" }),
    onError: (err) => toast.error(err.message || "AI request failed. Please try again."),
  });

  const isLoading = status === "submitted" || status === "streaming";

  const streamedText = useMemo(() => {
    const last = [...messages].reverse().find((m) => m.role === "assistant");
    if (!last) return "";
    return last.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
  }, [messages]);

  const parsed = useMemo<MeetingSummary | null>(() => {
    if (isLoading || !streamedText) return null;
    try { return extractJSON<MeetingSummary>(streamedText); } catch { return null; }
  }, [streamedText, isLoading]);

  const summarize = () => {
    if (!notes.trim()) { toast.error("Paste some meeting notes first."); return; }
    if (isLoading) return;
    const p = buildMeetingPrompt({ notes });
    setPrompt(p);
    setMessages([]);
    sendMessage({ text: p });
  };

  const copy = () => {
    if (!parsed) return;
    const text = `Summary\n${parsed.summary}\n\nKey Decisions\n- ${parsed.decisions.join("\n- ")}\n\nAction Items\n${parsed.actions.map(a => `- ${a.task} — ${a.owner} (by ${a.deadline})`).join("\n")}\n\nDeadlines\n- ${parsed.deadlines.join("\n- ")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
    toast.success("Summary copied");
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <ToolHeader icon={tool.icon} color={tool.colorVar} kandinsky={tool.kandinsky} title={tool.name}
        description="Paste raw notes or a transcript — we'll extract what matters." />

      <SimBanner color={tool.colorVar} />

      <div className="rounded-xl border bg-card p-5 space-y-4">
        <div>
          <label className="tracking-label mb-2 block">Meeting notes or transcript</label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your notes here — the more detail, the better the summary." rows={10} />
        </div>
        <Button onClick={summarize} disabled={isLoading} className="w-full text-white" style={{ backgroundColor: tool.colorVar }}>
          <Sparkles className="mr-2 h-4 w-4" />
          {isLoading ? "Summarizing…" : "Summarize"}
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        {isLoading && (
          <div className="space-y-3 rounded-xl border bg-card p-5 fade-slide-up">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TypingDots color={tool.colorVar} /> Extracting decisions & actions…
            </div>
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton-shimmer h-24 w-full" />)}
          </div>
        )}

        {!isLoading && parsed && (
          <div className="fade-slide-up space-y-4">
            <div className="flex justify-end fade-slide-up delay-0">
              <Button size="sm" variant="outline" onClick={copy}>
                {copied ? <Check className="mr-2 h-3.5 w-3.5" /> : <Copy className="mr-2 h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy Summary"}
              </Button>
            </div>
            <div className="fade-slide-up delay-150">
              <SectionCard title="Summary" color={tool.colorVar}>
                <p className="text-sm leading-relaxed">{parsed.summary}</p>
              </SectionCard>
            </div>
            <div className="fade-slide-up delay-300">
              <SectionCard title="Key Decisions" color={tool.colorVar}>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {parsed.decisions.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </SectionCard>
            </div>
            <div className="fade-slide-up delay-450">
              <SectionCard title="Action Items" color={tool.colorVar}>
                <ul className="space-y-2 text-sm">
                  {parsed.actions.map((a, i) => (
                    <li key={i} className="flex flex-wrap items-baseline justify-between gap-2 rounded-md border p-3">
                      <span>{a.task}</span>
                      <span className="text-xs text-muted-foreground">
                        <strong className="text-foreground">{a.owner}</strong> · by {a.deadline}
                      </span>
                    </li>
                  ))}
                </ul>
              </SectionCard>
            </div>
            <div className="fade-slide-up delay-600">
              <SectionCard title="Important Deadlines" color={tool.colorVar}>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {parsed.deadlines.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </SectionCard>
            </div>
            <div className="fade-slide-up delay-750">
              <PromptViewer prompt={prompt} />
            </div>
          </div>
        )}

        {!isLoading && !parsed && streamedText && (
          <div className="rounded-xl border bg-card p-5 fade-slide-up">
            <p className="tracking-label mb-2">AI response</p>
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">{streamedText}</pre>
            <PromptViewer prompt={prompt} />
          </div>
        )}

        {!isLoading && !streamedText && (
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
