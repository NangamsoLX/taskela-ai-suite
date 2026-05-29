import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Check, Copy, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToolHeader } from "@/components/tool-header";
import { PromptViewer } from "@/components/prompt-viewer";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { SimBanner } from "@/components/sim-banner";
import { TypingDots } from "@/components/typing-dots";
import { TOOLS } from "@/lib/tools";
import { buildEmailPrompt, type EmailRole, type EmailTone } from "@/lib/build-prompts";
import { extractJSON } from "@/lib/extract-json";

interface GeneratedEmail { subject: string; greeting: string; body: string; signoff: string }

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
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/email" }),
    onError: (err) => toast.error(err.message || "AI request failed. Please try again."),
  });

  const isLoading = status === "submitted" || status === "streaming";

  const streamedText = useMemo(() => {
    const last = [...messages].reverse().find((m) => m.role === "assistant");
    if (!last) return "";
    return last.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
  }, [messages]);

  const parsed = useMemo<GeneratedEmail | null>(() => {
    if (isLoading || !streamedText) return null;
    try { return extractJSON<GeneratedEmail>(streamedText); } catch { return null; }
  }, [streamedText, isLoading]);

  const generate = () => {
    if (!topic.trim()) { toast.error("Add some context for the email first."); return; }
    if (isLoading) return;
    const p = buildEmailPrompt({ role, topic, tone });
    setPrompt(p);
    setMessages([]);
    sendMessage({ text: p });
  };

  const copy = () => {
    if (!parsed) return;
    const text = `Subject: ${parsed.subject}\n\n${parsed.greeting}\n\n${parsed.body}\n\n${parsed.signoff}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
    toast.success("Email copied to clipboard");
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <ToolHeader icon={tool.icon} color={tool.colorVar} kandinsky={tool.kandinsky} title={tool.name}
        description="Pick an audience and tone, share the context, and get a polished draft." />

      <SimBanner color={tool.colorVar} />

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
              <Button key={t} type="button" variant={tone === t ? "default" : "outline"} size="sm"
                className="flex-1" onClick={() => setTone(t)}
                style={tone === t ? { backgroundColor: tool.colorVar, color: "#0F1624" } : {}}>
                {t}
              </Button>
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="tracking-label mb-2 block">Topic / Context</label>
          <Textarea value={topic} onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Following up on the proposal we sent Monday, asking for a decision by Friday."
            rows={4} />
        </div>
        <div className="md:col-span-2">
          <Button onClick={generate} disabled={isLoading} className="w-full" style={{ backgroundColor: tool.colorVar, color: "#0F1624" }}>
            <Sparkles className="mr-2 h-4 w-4" />
            {isLoading ? "Generating…" : "Generate Email"}
          </Button>
        </div>
      </div>

      <div className="mt-6">
        {isLoading && (
          <div className="space-y-3 rounded-xl border bg-card p-5 fade-slide-up">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TypingDots color={tool.colorVar} /> Drafting your email…
            </div>
            <div className="skeleton-shimmer h-5 w-2/3" />
            <div className="skeleton-shimmer h-4 w-1/4" />
            <div className="skeleton-shimmer h-20 w-full" />
            <div className="skeleton-shimmer h-4 w-1/3" />
          </div>
        )}

        {!isLoading && parsed && (
          <div className="rounded-xl border bg-card p-5 fade-slide-up">
            <div className="mb-4 flex items-start justify-between gap-3 fade-slide-up delay-0">
              <div>
                <p className="tracking-label">Subject</p>
                <h3 className="mt-1 text-lg font-semibold">{parsed.subject}</h3>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={copy}>
                  {copied ? <Check className="mr-2 h-3.5 w-3.5" /> : <Copy className="mr-2 h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button size="sm" variant="ghost" onClick={generate}><RefreshCw className="mr-2 h-3.5 w-3.5" />Regenerate</Button>
              </div>
            </div>
            <div className="space-y-3 text-sm leading-relaxed whitespace-pre-wrap">
              <p className="fade-slide-up delay-150">{parsed.greeting}</p>
              <p className="fade-slide-up delay-300">{parsed.body}</p>
              <p className="fade-slide-up delay-450">{parsed.signoff}</p>
            </div>
            <div className="fade-slide-up delay-600">
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
            Your generated email will appear here.
          </div>
        )}
      </div>
      <AiDisclaimer />
    </div>
  );
}
