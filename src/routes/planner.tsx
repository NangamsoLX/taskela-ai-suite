import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { ToolHeader } from "@/components/tool-header";
import { PromptViewer } from "@/components/prompt-viewer";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { SimBanner } from "@/components/sim-banner";
import { TOOLS } from "@/lib/tools";
import { generatePlanFn } from "@/lib/ai-tools.functions";

type PlanScope = "Daily Plan" | "Weekly Plan";
type Priority = "Urgent" | "High" | "Medium" | "Low";
interface PlannerTask { time: string; title: string; priority: Priority; note?: string }
interface GeneratedPlan {
  scope: PlanScope;
  tasks: PlannerTask[];
  optimizationTip: string;
  prompt: string;
}

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
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState<GeneratedPlan | null>(null);
  const [done, setDone] = useState<Set<number>>(new Set());
  const callPlan = useServerFn(generatePlanFn);

  const generate = async () => {
    if (!input.trim()) { toast.error("Add tasks or goals first."); return; }
    setLoading(true);
    setDone(new Set());
    try {
      const res = await callPlan({ data: { input, scope, priority } });
      setOut({ ...res.data, prompt: res.prompt });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "AI request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggle = (id: number) => {
    setDone((d) => {
      const n = new Set(d);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <ToolHeader
        icon={tool.icon}
        color={tool.colorVar}
        kandinsky={tool.kandinsky}
        title={tool.name}
        description="Describe what you need to get done. We'll structure it into time blocks."
      />

      <SimBanner color={tool.colorVar} />

      <div className="rounded-xl border bg-card p-5 space-y-4">
        <div>
          <label className="tracking-label mb-2 block">Tasks, goals, or priorities</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Finish Q3 report draft, prep for Thursday's client demo, follow up on three pending threads."
            rows={4}
          />
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
        <Button onClick={generate} disabled={loading} className="w-full text-white" style={{ backgroundColor: tool.colorVar }}>
          <Sparkles className="mr-2 h-4 w-4" />
          {loading ? "Building plan…" : "Generate Plan"}
        </Button>
      </div>

      <div className="mt-6">
        {loading && (
          <div className="space-y-2 rounded-xl border bg-card p-5">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        )}
        {!loading && out && (
          <div className="rounded-xl border bg-card p-5">
            <h3 className="mb-4 text-lg font-semibold">{out.scope}</h3>
            <ul className="space-y-2">
              {out.tasks.map((t) => (
                <li key={t.id} className="flex items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted/40">
                  <Checkbox checked={done.has(t.id)} onCheckedChange={() => toggle(t.id)} />
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">{t.time}</div>
                    <div className={`text-sm ${done.has(t.id) ? "line-through text-muted-foreground" : ""}`}>{t.title}</div>
                  </div>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white"
                    style={{ backgroundColor: PRIORITY_COLORS[t.priority] }}
                  >
                    {t.priority}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-lg bg-muted/40 p-4">
              <p className="tracking-label mb-2">Optimization tips</p>
              <ul className="list-disc space-y-1 pl-4 text-sm">
                {out.suggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>

            <PromptViewer prompt={out.prompt} />
          </div>
        )}
        {!loading && !out && (
          <div className="rounded-xl border border-dashed bg-muted/20 p-8 text-center text-sm text-muted-foreground">
            Your structured plan will appear here.
          </div>
        )}
      </div>
      <AiDisclaimer />
    </div>
  );
}
