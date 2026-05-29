import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ToolHeader } from "@/components/tool-header";
import { PromptViewer } from "@/components/prompt-viewer";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { SimBanner } from "@/components/sim-banner";
import { TypingDots } from "@/components/typing-dots";
import { TOOLS } from "@/lib/tools";
import { buildPlanPrompt, type PlanScope, type Priority } from "@/lib/build-prompts";
import { extractJSON } from "@/lib/extract-json";

interface PlannerTask { time: string; title: string; priority: Priority; note?: string }
interface GeneratedPlan { tasks: PlannerTask[]; optimizationTip: string }

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "Task Planner · Taskela AI" },
      { name: "description", content: "Turn goals into a structured daily or weekly plan." },
      { property: "og:title", content: "Task Planner · Taskela AI" },
      { property: "og:description", content: "Turn goals into a structured daily or weekly plan." },
    ],
  }),
  component: PlannerPage,
});

const PRIORITY_COLORS: Record<Priority, string> = {
  Urgent: "var(--tool-planner)",
  High: "var(--tool-meeting)",
  Medium: "var(--tool-email)",
  Low: "var(--tool-research)",
};

function PlannerPage() {
  const tool = TOOLS.find((t) => t.key === "planner")!;
  const [input, setInput] = useState("");
  const [scope, setScope] = useState<PlanScope>("Daily Plan");
  const [priority, setPriority] = useState<Priority>("High");
  const [prompt, setPrompt] = useState("");
  const [done, setDone] = useState<Set<number>>(new Set());

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/planner" }),
    onError: (err) => toast.error(err.message || "AI request failed. Please try again."),
  });

  const isLoading = status === "submitted" || status === "streaming";

  const streamedText = useMemo(() => {
    const last = [...messages].reverse().find((m) => m.role === "assistant");
    if (!last) return "";
    return last.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
  }, [messages]);

  const parsed = useMemo<GeneratedPlan | null>(() => {
    if (isLoading || !streamedText) return null;
    try { return extractJSON<GeneratedPlan>(streamedText); } catch { return null; }
  }, [streamedText, isLoading]);

  const generate = () => {
    if (!input.trim()) { toast.error("Add tasks or goals first."); return; }
    if (isLoading) return;
    const p = buildPlanPrompt({ input, scope, priority });
    setPrompt(p);
    setDone(new Set());
    setMessages([]);
    sendMessage({ text: p });
  };

  const toggle = (id: number) => {
    setDone((d) => { const n = new Set(d); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <ToolHeader icon={tool.icon} color={tool.colorVar} kandinsky={tool.kandinsky} title={tool.name}
        description="Describe what you need to get done. We'll structure it into time blocks." />

      <SimBanner color={tool.colorVar} />

      <div className="rounded-xl border bg-card p-5 space-y-4">
        <div>
          <label className="tracking-label mb-2 block">Tasks, goals, or priorities</label>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Finish Q3 report draft, prep for Thursday's client demo, follow up on three pending threads."
            rows={4} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="tracking-label mb-2 block">Scope</label>
            <Tabs value={scope} onValueChange={(v) => setScope(v as PlanScope)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="Daily Plan">Daily Plan</TabsTrigger>
                <TabsTrigger value="Weekly Plan">Weekly Plan</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div>
            <label className="tracking-label mb-2 block">Default Priority</label>
            <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Urgent">Urgent</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={generate} disabled={isLoading} className="w-full text-white" style={{ backgroundColor: tool.colorVar }}>
          <Sparkles className="mr-2 h-4 w-4" />
          {isLoading ? "Building plan…" : "Generate Plan"}
        </Button>
      </div>

      <div className="mt-6">
        {isLoading && (
          <div className="space-y-2 rounded-xl border bg-card p-5 fade-slide-up">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TypingDots color={tool.colorVar} /> Structuring your plan…
            </div>
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton-shimmer h-12 w-full" />)}
          </div>
        )}

        {!isLoading && parsed && (
          <div className="rounded-xl border bg-card p-5 fade-slide-up">
            <h3 className="mb-4 text-lg font-semibold fade-slide-up delay-0">{scope}</h3>
            <ul className="space-y-2">
              {parsed.tasks.map((t, idx) => (
                <li key={idx} className={`flex items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted/40 fade-slide-up`}
                    style={{ animationDelay: `${150 + idx * 80}ms` }}>
                  <Checkbox checked={done.has(idx)} onCheckedChange={() => toggle(idx)} />
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">{t.time}</div>
                    <div className={`text-sm ${done.has(idx) ? "line-through text-muted-foreground" : ""}`}>{t.title}</div>
                  </div>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white"
                    style={{ backgroundColor: PRIORITY_COLORS[t.priority] ?? PRIORITY_COLORS.Medium }}>
                    {t.priority}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-lg bg-muted/40 p-4 fade-slide-up delay-600">
              <p className="tracking-label mb-2">Optimization tip</p>
              <p className="text-sm">{parsed.optimizationTip}</p>
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
            Your structured plan will appear here.
          </div>
        )}
      </div>
      <AiDisclaimer />
    </div>
  );
}
