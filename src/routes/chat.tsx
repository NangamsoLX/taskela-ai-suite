import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolHeader } from "@/components/tool-header";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { TOOLS } from "@/lib/tools";
import { simulateChatReply, CHAT_STARTERS } from "@/lib/simulated-ai";
import { SimBanner } from "@/components/sim-banner";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot · Taskela AI" },
      { name: "description", content: "Chat with a simulated workplace AI assistant." },
      { property: "og:title", content: "AI Chatbot · Taskela AI" },
      { property: "og:description", content: "Chat with a simulated workplace AI assistant." },
    ],
  }),
  component: ChatPage,
});

interface Msg { role: "user" | "assistant"; content: string }

function ChatPage() {
  const tool = TOOLS.find((t) => t.key === "chat")!;
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    setMessages((m) => [...m, { role: "user", content: trimmed }]);
    setInput("");
    setTyping(true);
    const reply = await simulateChatReply(trimmed);
    setTyping(false);
    setMessages((m) => [...m, { role: "assistant", content: reply }]);
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col px-6 py-10">
      <ToolHeader
        icon={tool.icon}
        color={tool.colorVar}
        kandinsky={tool.kandinsky}
        title={tool.name}
        description="A workplace assistant for quick planning, drafting, and answers."
      />

      <div className="flex min-h-[480px] flex-col rounded-xl border bg-card">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">Start with a suggestion:</p>
              <div className="mx-auto mt-4 flex max-w-2xl flex-wrap justify-center gap-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border bg-background px-3 py-1.5 text-xs transition-colors hover:border-accent hover:text-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              {m.role === "user" ? (
                <div
                  className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm text-white"
                  style={{ backgroundColor: tool.colorVar }}
                >
                  {m.content}
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-[85%] text-foreground">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              )}
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="flex gap-1 rounded-full bg-muted px-3 py-2">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/60 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/60 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/60" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="flex items-center gap-2 border-t p-3"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Taskela anything…"
            className="flex-1"
            disabled={typing}
          />
          <Button type="submit" disabled={typing || !input.trim()} size="icon" style={{ backgroundColor: tool.colorVar }}>
            <Send className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={() => setMessages([])} disabled={!messages.length}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </form>
      </div>
      <AiDisclaimer />
    </div>
  );
}
