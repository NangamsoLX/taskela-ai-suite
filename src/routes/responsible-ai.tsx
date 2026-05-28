import { createFileRoute } from "@tanstack/react-router";
import { Eye, AlertTriangle, Lock, UserCheck, Scale } from "lucide-react";
import { AiDisclaimer } from "@/components/ai-disclaimer";

export const Route = createFileRoute("/responsible-ai")({
  head: () => ({
    meta: [
      { title: "Responsible AI · Taskela AI" },
      { name: "description", content: "Our commitments around transparency, limitations, privacy, oversight, and bias." },
      { property: "og:title", content: "Responsible AI · Taskela AI" },
      { property: "og:description", content: "Our commitments around transparency, limitations, privacy, oversight, and bias." },
    ],
  }),
  component: ResponsibleAi,
});

const SECTIONS = [
  { icon: Eye, title: "Transparency", body: "Taskela AI shows you the exact prompts used to generate every output. You can see, edit, and learn from them." },
  { icon: AlertTriangle, title: "Limitations", body: "AI can make mistakes, hallucinate facts, or produce biased content. Always review and verify AI-generated outputs before use." },
  { icon: Lock, title: "Data Privacy", body: "Your inputs are processed to generate responses. Do not enter sensitive personal data, confidential business information, or proprietary content." },
  { icon: UserCheck, title: "Human Oversight", body: "AI assists, humans decide. Taskela AI is a productivity tool, not a replacement for professional judgment." },
  { icon: Scale, title: "Bias Awareness", body: "AI models can reflect biases present in training data. We encourage critical thinking when reviewing all AI outputs." },
];

function ResponsibleAi() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="tracking-label">Principles</p>
      <h1 className="mt-2 text-3xl font-bold md:text-4xl">Our Commitment to Responsible AI</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        Taskela AI is designed to amplify your judgment, not replace it. These principles guide how we build.
      </p>

      <div className="mt-10 space-y-4">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="flex gap-4 rounded-xl border bg-card p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-accent">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            </div>
          );
        })}
      </div>
      <AiDisclaimer />
    </div>
  );
}
