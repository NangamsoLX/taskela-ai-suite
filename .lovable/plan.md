## Goal
Elevate Taskela AI to a calm, spacious, premium aesthetic (Claude/Gemini-class) and fix the logo artifact by replacing the PNG with a styled text wordmark everywhere it appears.

## 1. Brand wordmark (replaces logo PNG)
Create `src/components/brand-mark.tsx` — renders:
- "Taskela" in Space Grotesk 600, foreground white
- "AI" in a lavender → accent gradient (`#A78BFA` → existing `--accent`) via `bg-clip-text`
- Size prop: `sm` (sidebar ~20px), `xl` (hero ~64px)
- Optional `tagline` prop renders "Tasking For You" below in `.tracking-label`

Remove all `import logo from "@/assets/taskela-logo.png"` usages (sidebar, hero). Favicon stays as-is (already a PNG file in /public).

## 2. Design tokens (`src/styles.css`)
Add:
- `--lavender: oklch(0.78 0.13 295)` (already ~accent, keep both names)
- `--gradient-brand: linear-gradient(135deg, #A78BFA, var(--accent))`
- `--glass-bg: rgba(255,255,255,0.03)`
- `--glass-border: rgba(255,255,255,0.08)`
- `--shadow-soft: 0 1px 2px rgba(0,0,0,.2), 0 8px 24px rgba(0,0,0,.25)`
- Bump `--radius` to `0.875rem` (14px) so cards land at ~16px via `rounded-2xl`
- Global transition default: 200ms ease (via utility class `.transition-smooth`)
- Tool glow vars: `--glow-chat`, `--glow-email`, `--glow-planner`, `--glow-meeting`, `--glow-research` (rgba of each Kandinsky color at 0.15)

Add `.glass-card` utility: bg `--glass-bg`, border `--glass-border`, `backdrop-filter: blur(12px)`, `rounded-2xl`, hover: translate-y-[-2px] + tool-colored box-shadow glow (set via inline `--glow` CSS var per card).

## 3. Hero (`src/routes/index.tsx`)
- Remove logo `<img>`
- Increase vertical padding (`py-24 md:py-32`), wider max-w
- Replace heading with `<BrandMark size="xl" />` (no separate "Taskela AI" line)
- Tagline "Your AI-Powered Workplace Productivity Suite" in muted-foreground
- Keep the longer description paragraph

Feature grid:
- Layout: `lg:grid-cols-3` for top row (Chat, Email, Planner), `lg:grid-cols-2` for bottom row (Meetings, Research) — clean 3+2
- Each card uses `.glass-card` with `style={{ '--glow': t.glowVar }}`
- Card content: header row with `<Icon className="h-5 w-5" style={{color: t.colorVar}}/>` + tool name inline; one-line description; "Open →" link bottom in muted text, accent on hover
- Remove Kandinsky tagline label and colored icon container and left border bar

## 4. Sidebar (`src/components/app-sidebar.tsx`)
- Header: replace `<img>` with `<BrandMark size="sm" tagline />` (collapsed state shows just "T·AI" or the gradient "A")
- Nav items: drop colored dot; active state = left 2px border in tool color (`box-shadow: inset 2px 0 0 var(--tool-x)`) + subtle bg `rgba(255,255,255,.04)` instead of full primary fill
- Increase `gap-y` between menu items (py-1 → py-2)
- Footer: shorten to "© Taskela AI" (Kandinsky note moves to About page)

Override `SidebarMenuButton` active styling locally via className using `data-[active=true]:` variants — no shadcn file edits.

## 5. Tool pages (chat/email/planner/meetings/research)
Update `ToolHeader` (`src/components/tool-header.tsx`):
- Remove colored icon square
- Remove Kandinsky tagline
- Render: small inline icon (tool color) + `<h1>` title + one-line description under it
- Reduce vertical mb

Page shells:
- Wrap input areas: textareas use `bg-transparent border border-[--glass-border] focus:border-accent rounded-xl`
- Output containers swap from default Card to `.glass-card`
- Add more page padding: `px-6 md:px-10 py-10 md:py-14`, `max-w-4xl mx-auto`

## 6. PromptViewer (`src/components/prompt-viewer.tsx`)
- Remove box look. Render as a small text-link trigger: "View prompt" with chevron, `text-xs text-muted-foreground hover:text-foreground`
- Expanded content: indented monospace block with left border, no card background

## 7. Root header & footer (`src/routes/__root.tsx`)
- Header: drop the "Taskela AI · Tasking For You" string (brand lives in sidebar now); keep SidebarTrigger + ThemeToggle, slightly taller (h-16), no border (use subtle bottom shadow)
- Footer: keep credit line, lighter, more padding

## 8. About page
Add a "Synesthetic Color Palette" section listing each tool with its Kandinsky tagline (the labels removed from the home cards land here).

## Out of scope
- No functional/logic changes to simulated AI
- No new routes, no backend, no dependency installs
- Light mode tokens left intact; dark stays default
- Logo PNG file remains on disk (unused) — not deleted to avoid asset churn

## Files touched
- new: `src/components/brand-mark.tsx`
- edit: `src/styles.css`, `src/routes/index.tsx`, `src/routes/__root.tsx`, `src/routes/about.tsx`, `src/components/app-sidebar.tsx`, `src/components/tool-header.tsx`, `src/components/prompt-viewer.tsx`
- light edits to 5 tool routes for padding/glass-card output wrappers
