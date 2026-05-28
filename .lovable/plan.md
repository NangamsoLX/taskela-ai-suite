# Taskela AI — Build Plan

A single-page app with a collapsible sidebar dashboard, 5 simulated AI tools, plus Responsible AI and About pages. All AI outputs are simulated (no backend needed). Dark mode by default with light toggle.

## Assets & branding
- Copy uploaded logo to `src/assets/taskela-logo.png` (used in sidebar ~140px and hero ~200px).
- Copy to `public/favicon.png` for browser tab.
- Add Google Fonts (Space Grotesk + Inter) via root `head` links.

## Design tokens (`src/styles.css`)
Add Kandinsky palette as semantic tokens in oklch:
- `--background` dark #0F1624 / light #FAF8F5
- `--foreground`, `--muted-foreground` (#8B8680)
- Tool accents: `--tool-chat` #1A3A6B, `--tool-email` #F5B731, `--tool-planner` #E63946, `--tool-meeting` #F4845F, `--tool-research` #2A9D8F
- `--accent` lavender #A78BFA; success/warning/error tokens
- Radius 8px; 8px spacing grid; font families wired in @theme.

## Routes (TanStack file-based)
- `src/routes/__root.tsx` — html shell, fonts, favicon, dark-mode class via ScriptOnce, footer disclaimer.
- `src/routes/_app.tsx` — layout with `SidebarProvider`, `AppSidebar`, header (mobile trigger + theme toggle), `<Outlet/>`, footer credit.
- `src/routes/_app/index.tsx` — Hero/landing with 5 feature cards (each navigates to its tool).
- `src/routes/_app/chat.tsx` — AI Chatbot
- `src/routes/_app/email.tsx` — Smart Email Generator
- `src/routes/_app/planner.tsx` — Task Planner
- `src/routes/_app/meetings.tsx` — Meeting Summarizer
- `src/routes/_app/research.tsx` — Research Assistant
- `src/routes/_app/responsible-ai.tsx`
- `src/routes/_app/about.tsx`

Each route sets its own `head()` with title + description + og tags.

## Components
- `src/components/app-sidebar.tsx` — logo at top, nav items with Kandinsky color dot accents, active state, collapsible icon mode.
- `src/components/theme-toggle.tsx` — toggles `.dark` on `<html>`, persists to localStorage.
- `src/components/feature-card.tsx` — hover lift + shadow, accent border.
- `src/components/prompt-viewer.tsx` — collapsible "View Prompt" using shadcn Collapsible.
- `src/components/ai-disclaimer.tsx` — "⚠️ AI-generated content. Always verify before use." footer banner.
- `src/components/loading-dots.tsx` — typing/thinking indicator.

## Simulated AI logic (`src/lib/simulated-ai.ts`)
Pure functions returning realistic placeholder outputs based on inputs + a fake delay (800–1500ms) to show loading states. One function per tool. Each also returns the prompt string used (for transparency display).

## Feature implementation notes
- **Chatbot**: message list state, suggested prompt chips, send box, typing indicator, clear button. Uses `react-markdown` for assistant messages.
- **Email Generator**: shadcn Select (role), Textarea (context), 3 tone buttons (toggle group), generate → output card with subject/greeting/body/signoff, Copy + Regenerate, prompt viewer.
- **Planner**: textarea, daily/weekly tabs, priority select, generate → task list with checkboxes, color-coded priority badges, time blocks, prompt viewer.
- **Meetings**: textarea, summarize → 4 cards (Summary, Key Decisions, Action Items w/ owner+deadline, Deadlines), copy, prompt viewer.
- **Research**: textarea, research → 4 sections (Overview, Key Insights cards, Recommendations, Simplified Explanation), copy, prompt viewer.

Toast notifications via existing `sonner`. Loading skeletons via shadcn `Skeleton`.

## Responsible AI & About
Static content pages with iconified section cards (lucide icons). About includes Kandinsky philosophy blurb + credit + GitHub placeholder link.

## Responsiveness
Sidebar uses shadcn `collapsible="offcanvas"` on mobile (sheet) and `icon` on desktop. Header always shows `SidebarTrigger`. Grid layouts collapse to 1 col on mobile.

## Out of scope
No Lovable Cloud / backend / real AI calls — all outputs are simulated client-side as specified ("simulated AI responses", "realistic placeholder responses").

## Technical details
- Stack: TanStack Start + React 19 + Tailwind v4 + shadcn (already installed).
- No new heavy deps; add only `react-markdown` for chat rendering.
- Dark mode: `ScriptOnce` in root reads `localStorage.theme` pre-hydration to avoid flash.
- All colors via CSS tokens; no hardcoded hex in components except where Kandinsky accents are referenced as `bg-[var(--tool-chat)]` etc.
