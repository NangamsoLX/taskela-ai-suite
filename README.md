# 🎨 Taskela AI — *Tasking For You*

> **AI-Powered Workplace Productivity Suite**  
> Live AI Streaming · Kandinsky's Synesthetic Color Theory · Built with Lovable AI

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Taskela_AI-A78BFA?style=for-the-badge)](https://taskela-ai-suite.lovable.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-0F1624?style=for-the-badge&logo=github)](https://github.com/NangamsoLX/taskela-ai-suite)
[![Built With](https://img.shields.io/badge/Built_With-Lovable_AI-E040FB?style=for-the-badge)](https://lovable.dev)
[![AI Model](https://img.shields.io/badge/Powered_By-Google_Gemini-4285F4?style=for-the-badge)](https://deepmind.google/technologies/gemini/)
[![Programme](https://img.shields.io/badge/CAPACITI-AI_Skills_Accelerator_2026-2A9D8F?style=for-the-badge)](https://capaciti.org.za)

---

## 📋 About

**Taskela AI** is a live AI-powered workplace productivity suite that automates the repetitive tasks consuming professionals' time — drafting emails, summarizing meetings, planning schedules, and conducting research.

All 5 tools are powered by **real-time AI streaming** via Google Gemini 3 Flash, delivering contextual, intelligent responses with a ChatGPT/Gemini-class user experience.

> *"Professionals across industries spend significant time on repetitive tasks. Taskela AI solves this by providing 5 intelligent AI tools in one elegant dashboard — so you can focus on the work that truly matters."*

---

## 🎨 Design Philosophy

Taskela AI's design sits at the intersection of three frameworks:

| Framework | Influence |
|-----------|-----------|
| **Wassily Kandinsky's Synesthetic Color Theory** | Each color maps to a specific sound and emotion from Kandinsky's 1911 treatise *"Concerning the Spiritual in Art"*. He had synesthesia — he could literally hear colors and see music. Every color choice in Taskela AI carries intentional emotional weight. |
| **Vogue Editorial Typography** | The brand identity uses Didone-inspired typography principles — extreme contrast, generous negative space, and the confidence of restraint. The "AI" text pulses with a gentle lavender glow, breathing life into the wordmark. |
| **McKinsey's Business Value of Design** | McKinsey's research found that top-quartile design companies see **32% higher revenue growth** and **56% higher total shareholder returns**. Every design element in Taskela AI is intentional and measurable. |

---

## 🛠️ Features

### 1. 🤖 AI Chatbot Interface
> *Kandinsky Color: Deep Blue (#1A3A6B) — The sound of a cello*

A real-time streaming conversational AI assistant. Ask anything — plan your day, draft notes, or get quick answers. Features suggested starter prompts, typing indicators, and markdown-rendered responses streamed live.

### 2. ✉️ Smart Email Generator
> *Kandinsky Color: Warm Gold (#F5B731) — The sound of a trumpet*

Generate professional emails with live AI. Select the recipient role (Client, Manager, Team), choose a tone (Formal, Friendly, Persuasive), describe the context, and receive a fully structured email — subject line, greeting, body, and sign-off — streamed in real-time.

### 3. ✅ AI Task Planner
> *Kandinsky Color: Vermilion Red (#E63946) — The sound of a tuba*

Transform goals into structured, prioritized daily or weekly plans powered by live AI. Each task includes time blocks, priority badges, and AI-generated time optimization suggestions.

### 4. 📋 Meeting Notes Summarizer
> *Kandinsky Color: Warm Orange (#F4845F) — The sound of a church bell*

Paste meeting notes or transcripts and receive AI-generated structured summaries with Key Decisions, Action Items (with owners and deadlines), and Important Deadlines — all rendered in clean, scannable cards.

### 5. 🔍 AI Research Assistant
> *Kandinsky Color: Teal Green (#2A9D8F) — The sound of a quiet violin*

Get live AI-powered structured research on any topic — Overview, Key Insights, Recommendations, and a Simplified Explanation that makes complex information accessible.

---

## 🎵 Synesthetic Color System

Every color in Taskela AI was chosen based on Kandinsky's synesthetic associations:

| Color | Hex | Sound | Emotion | Feature |
|-------|-----|-------|---------|---------|
| 🔵 Deep Blue | `#1A3A6B` | Cello / Organ | Deep, spiritual, contemplative | AI Chatbot |
| 🟡 Warm Gold | `#F5B731` | Trumpet | Bold, exciting, announcing | Email Generator |
| 🔴 Vermilion | `#E63946` | Tuba | Alive, restless, striving | Task Planner |
| 🟠 Warm Orange | `#F4845F` | Church Bell | Radiant, reflective, serious | Meeting Summarizer |
| 🟢 Teal Green | `#2A9D8F` | Quiet Violin | Still, peaceful, hidden strength | Research Assistant |
| 🟣 Lavender | `#A78BFA` | — | Accent / Hover — the "purple squirrel" | Brand Accent |

> *"Colour is the keyboard, the eyes are the harmonies, the soul is the piano with many strings. The artist is the hand that plays, touching one key or another, to cause vibrations in the soul."*  
> — Wassily Kandinsky, *Concerning the Spiritual in Art* (1911)

---

## 🏗️ Architecture

Taskela AI uses a **streaming-first architecture** — the same pattern used by ChatGPT, Claude, and Gemini:

```
User Input → Frontend (useChat hook)
                ↓
         POST /api/<tool>
                ↓
    Server: streamText() → Lovable AI Gateway → Google Gemini 3 Flash
                ↓
    Streaming response → Frontend receives chunks
                ↓
    extractJSON() parses completed response
                ↓
    Structured cards render with staggered fade-in animations
```

| Design Decision | Why |
|----------------|-----|
| **Streaming via `streamText`** | Real-time token-by-token delivery — users see AI "thinking" live |
| **Server-side API routes** | API keys never reach the browser — secure by architecture |
| **`extractJSON` helper** | Robust parsing: handles raw JSON, markdown-fenced JSON, and brace extraction |
| **Raw text fallback** | If JSON parsing fails, displays formatted text — the app **never crashes** |
| **Staggered animations** | Output cards fade in sequentially (150ms delays) for a premium reveal experience |

---

## 🧠 Prompt Engineering (Transparency by Design)

Every AI tool includes a **"View Prompt"** section that reveals the exact prompt sent to Google Gemini. These are **real prompts producing real AI output** — not theoretical examples:

- **Demonstrates practical prompt engineering** — each prompt is crafted with role, context, tone, and structural instructions
- **Supports Responsible AI** — users can see exactly how outputs are generated
- **Enables learning** — users can copy, modify, and improve the prompts

Example prompt (Email Generator):
```
Generate a {tone} email to a {role} about: {topic}.
Tone: {tone}.
Ensure professional language, clear structure, and a courteous closing.
Include a subject line, greeting, 2-3 body paragraphs, and sign-off.
Adapt vocabulary and formality based on the audience.
```

---

## 🛡️ Responsible AI

| Principle | Implementation |
|-----------|---------------|
| **Transparency** | Every tool shows the exact prompt sent to the AI via "View Prompt" sections |
| **Limitations** | Per-tool banner: "🤖 Powered by AI — Responses generated in real-time. Always verify before use." |
| **Data Privacy** | API keys server-side only. No sensitive data stored. All rendering is client-side. |
| **Human Oversight** | "AI assists, humans decide" — tools support, not replace, professional judgment |
| **Bias Awareness** | Users are encouraged to critically review all AI-generated outputs |

---

## ⚙️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Lovable AI** | Full-stack app builder + AI Gateway |
| **Google Gemini 3 Flash** | Live AI model (streaming) |
| **AI SDK (`ai`)** | `streamText` for streaming AI responses |
| **@ai-sdk/react** | `useChat` hook for real-time frontend streaming |
| **TanStack Start** | File-based routing + server-side API routes |
| **React 19** | UI framework |
| **Tailwind CSS v4** | Utility-first styling with CSS custom properties |
| **shadcn/ui** | Accessible, customizable component system |
| **Zod** | Schema validation for structured AI outputs |
| **Space Grotesk + Inter** | Typography (Google Fonts) |

---

## 🌐 Live Demo

👉 **[View Taskela AI Live](https://taskela-ai-suite.lovable.app/)**

👉 **[View Source Code on GitHub](https://github.com/NangamsoLX/taskela-ai-suite)**

---

## 📚 Project Context

This project was built as part of the **CAPACITI AI Skills Accelerator Programme 2026**, demonstrating:

- Live AI integration with streaming responses
- Prompt engineering with transparency and real outputs
- Responsible AI practices and ethical considerations
- Real-world business problem solving
- Professional UI/UX design grounded in art history and management research
- Production-grade architecture (server-side security, robust error handling)

### Industry Relevance

> *"Organizations are increasingly looking for individuals who can apply AI tools effectively — not just understand them."* — CAPACITI Project Brief

The skills demonstrated in Taskela AI prepare for roles including:
- **AI Prompt Engineer** — prompt design, iteration, and optimization
- **AI Productivity Specialist** — workflow automation with AI tools
- **Digital Transformation Analyst** — AI strategy and implementation
- **Business Analyst (AI-enabled)** — process optimization with AI
- **Technology Consultant** — AI tool selection and integration
- **UX/UI Designer** — design systems, accessibility, responsive design

---

## 👤 Author

**Nangamso Xengana**  
CAPACITI AI Skills Accelerator Programme — 2026 Cohort  


---

## 📄 License

This project was built for educational purposes as part of the CAPACITI AI Skills Accelerator Programme.

---

<p align="center">
  <em>🔵🟡🔴🟠🟢 Built by Nangamso Xengana · CAPACITI AI Skills Accelerator 2026 · Inspired by Kandinsky's Synesthetic Color Theory</em>
</p>
