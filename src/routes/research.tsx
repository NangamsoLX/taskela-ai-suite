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
import { buildResearchPrompt } from "@/lib/build-prompts";
import { extractJSON } from "@/lib/extract-json";

interface ResearchOutput {
  overview: string;
  insights: { title: string; detail: string }[];
  recommendations: string[];
  simple: string;
}

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
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/research" }),
    onError: (err) => toast.error(err.message || "AI request failed. Please try again."),
  });

  const isLoading = status === "submitted" || status === "streaming";

  const streamedText = useMemo(() => {
    const last = [...messages].reverse().find((m) => m.role === "assistant");
    if (!last) return "";
    return last.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
  }, [messages]);

  const parsed = useMemo<ResearchOutput | null>(() => {
    if (isLoading || !streamedText) return null;
    try { return extractJSON<ResearchOutput>(streamedText); } catch { return null; }
  }, [streamedText, isLoading]);

  const research = () => {
    if (!topic.trim()) { toast.error("Add a topic or question first."); return; }
    if (isLoading) return;
    const p = buildResearchPrompt({ topic });
    setPrompt(p);
    setMessages([]);
    sendMessage({ text: p });
  };

  const copy = () => {
    if (!parsed) return;
    const text = `Overview\n${parsed.overview}\n\nKey Insights\n${parsed.insights.map(i => `- ${i.title}: ${i.detail}`).join("\n")}\n\nRecommendations\n- ${parsed.recommendations.join("\n- ")}\n\nSimplified\n${parsed.simple}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
    toast.success("Research copied");
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <ToolHeader icon={tool.icon} color={tool.colorVar} kandinsky={tool.kandinsky} title={tool.name}
        description="Type a topic or question. We'll return a structured brief you can act on." />

      <SimBanner color={tool.colorVar} />

      <div className="rounded-xl border bg-card p-5 space-y-4">
        <div>
          <label className="tracking-label mb-2 block">Topic or question</label>
          <Textarea value={topic} onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. How are teams adopting AI in customer support workflows?" rows={4} />
        </div>
        <Button onClick={research} disabled={isLoading} className="w-full text-white" style={{ backgroundColor: tool.colorVar }}>
          <Sparkles className="mr-2 h-4 w-4" />
          {isLoading ? "Researching…" : "Research"}
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        {isLoading && (
          <div className="space-y-3 rounded-xl border bg-card p-5 fade-slide-up">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TypingDots color={tool.colorVar} /> Researching…
            </div>
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton-shimmer h-24 w-full" />)}
          </div>
        )}

        {!isLoading && parsed && (
          <div className="space-y-4 fade-slide-up">
            <div className="flex justify-end fade-slide-up delay-0">
              <Button size="sm" variant="outline" onClick={copy}>
                {copied ? <Check className="mr-2 h-3.5 w-3.5" /> : <Copy className="mr-2 h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy Research"}
              </Button>
            </div>

            <div className="fade-slide-up delay-150">
              <Section title="Overview" color={tool.colorVar}>
                <p className="text-sm leading-relaxed">{parsed.overview}</p>
              </Section>
            </div>

            <div className="fade-slide-up delay-300">
              <Section title="Key Insights" color={tool.colorVar}>
                <div className="grid gap-3 sm:grid-cols-2">
                  {parsed.insights.map((i, idx) => (
                    <div key={idx} className="rounded-lg border bg-background p-4">
                      <h4 className="text-sm font-semibold">{i.title}</h4>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{i.detail}</p>
                    </div>
                  ))}
                </div>
              </Section>
            </div>

            <div className="fade-slide-up delay-450">
              <Section title="Recommendations" color={tool.colorVar}>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {parsed.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </Section>
            </div>

            <div className="fade-slide-up delay-600">
              <Section title="Simplified Explanation" color={tool.colorVar}>
                <p className="text-sm italic leading-relaxed text-muted-foreground">{parsed.simple}</p>
              </Section>
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
