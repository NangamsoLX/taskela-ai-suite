import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ToolHeader } from "@/components/tool-header";
import { PromptViewer } from "@/components/prompt-viewer";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { TOOLS } from "@/lib/tools";
import { simulateEmail, type EmailRole, type EmailTone, type GeneratedEmail } from "@/lib/simulated-ai";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator · Taskela AI" },
      { name: "description", content: "Generate emails that match the recipient and tone." },
      { property: "og:title", content: "Smart Email Generator · Taskela AI" },
      { property: "og:description", content: "Generate emails that match the recipient and tone." },
    ],
  }),
  component: EmailPage,
});

const TONES: EmailTone[] = ["Formal", "Friendly", "Persuasive"];

function EmailPage() {
  const tool = TOOLS.find((t) => t.key === "email")!;
  const [role, setRole] = useState<EmailRole>("Client");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<EmailTone>("Formal");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState<GeneratedEmail | null>(null);

  const generate = async () => {
    setLoading(true);
    const result = await simulateEmail(role, topic, tone);
    setOut(result);
    setLoading(false);
  };

  const copy = () => {
    if (!out) return;
    const text = `Subject: ${out.subject}\n\n${out.greeting}\n\n${out.body}\n\n${out.signoff}`;
    navigator.clipboard.writeText(text);
    toast.success("Email copied to clipboard");
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <ToolHeader
        icon={tool.icon}
        color={tool.colorVar}
        kandinsky={tool.kandinsky}
        title={tool.name}
        description="Pick an audience and tone, share the context, and get a polished draft."
      />

      <div className="grid gap-5 rounded-xl border bg-card p-5 md:grid-cols-2">
        <div>
          <label className="tracking-label mb-2 block">Recipient</label>
          <Select value={role} onValueChange={(v) => setRole(v as EmailRole)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Client">Client</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="Team Member">Team Member</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="tracking-label mb-2 block">Tone</label>
          <div className="flex gap-2">
            {TONES.map((t) => (
              <Button
                key={t}
                type="button"
                variant={tone === t ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setTone(t)}
                style={tone === t ? { backgroundColor: tool.colorVar, color: "#0F1624" } : {}}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="tracking-label mb-2 block">Topic / Context</label>
          <Textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Following up on the proposal we sent Monday, asking for a decision by Friday."
            rows={4}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={generate} disabled={loading} className="w-full" style={{ backgroundColor: tool.colorVar, color: "#0F1624" }}>
            <Sparkles className="mr-2 h-4 w-4" />
            {loading ? "Generating…" : "Generate Email"}
          </Button>
        </div>
      </div>

      <div className="mt-6">
        {loading && (
          <div className="space-y-3 rounded-xl border bg-card p-5">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        )}
        {!loading && out && (
          <div className="rounded-xl border bg-card p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="tracking-label">Subject</p>
                <h3 className="mt-1 text-lg font-semibold">{out.subject}</h3>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={copy}><Copy className="mr-2 h-3.5 w-3.5" />Copy</Button>
                <Button size="sm" variant="ghost" onClick={generate}><RefreshCw className="mr-2 h-3.5 w-3.5" />Regenerate</Button>
              </div>
            </div>
            <div className="space-y-3 text-sm leading-relaxed whitespace-pre-wrap">
              <p>{out.greeting}</p>
              <p>{out.body}</p>
              <p>{out.signoff}</p>
            </div>
            <PromptViewer prompt={out.prompt} />
          </div>
        )}
        {!loading && !out && (
          <div className="rounded-xl border border-dashed bg-muted/20 p-8 text-center text-sm text-muted-foreground">
            Your generated email will appear here.
          </div>
        )}
      </div>
      <AiDisclaimer />
    </div>
  );
}
