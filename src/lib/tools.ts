import { MessageCircle, Mail, ListChecks, FileText, Search, type LucideIcon } from "lucide-react";

export type ToolKey = "chat" | "email" | "planner" | "meetings" | "research";

export interface ToolMeta {
  key: ToolKey;
  name: string;
  short: string;
  description: string;
  to: "/chat" | "/email" | "/planner" | "/meetings" | "/research";
  icon: LucideIcon;
  colorVar: string; // css var
  kandinsky: string; // tagline
}

export const TOOLS: ToolMeta[] = [
  {
    key: "chat",
    name: "AI Chatbot",
    short: "Workplace assistant",
    description: "Ask anything — plan your day, draft notes, or get quick answers.",
    to: "/chat",
    icon: MessageCircle,
    colorVar: "var(--tool-chat)",
    kandinsky: "Deep blue · a cello",
  },
  {
    key: "email",
    name: "Email Generator",
    short: "Polished, on-tone emails",
    description: "Draft formal, friendly, or persuasive emails tailored to your audience.",
    to: "/email",
    icon: Mail,
    colorVar: "var(--tool-email)",
    kandinsky: "Warm gold · a trumpet",
  },
  {
    key: "planner",
    name: "Task Planner",
    short: "Daily & weekly plans",
    description: "Turn goals into prioritized time blocks with smart suggestions.",
    to: "/planner",
    icon: ListChecks,
    colorVar: "var(--tool-planner)",
    kandinsky: "Vermilion red · a tuba",
  },
  {
    key: "meetings",
    name: "Meeting Summarizer",
    short: "Notes → action items",
    description: "Distill long transcripts into summaries, decisions, and deadlines.",
    to: "/meetings",
    icon: FileText,
    colorVar: "var(--tool-meeting)",
    kandinsky: "Warm orange · a church bell",
  },
  {
    key: "research",
    name: "Research Assistant",
    short: "Insight in minutes",
    description: "Get structured overviews, key insights, and simplified explanations.",
    to: "/research",
    icon: Search,
    colorVar: "var(--tool-research)",
    kandinsky: "Teal green · a quiet violin",
  },
];
