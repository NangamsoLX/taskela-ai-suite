## 1. Pulsing glow on "AI" wordmark
- In `src/styles.css`, add a `@keyframes pulse-glow` cycling `opacity: 1 → 0.6 → 1` with a parallel `text-shadow` fading from `0 0 0 transparent` → `0 0 24px rgba(167,139,250,0.55)` → `0 0 0 transparent`. Expose as utility class `.animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }`.
- In `src/components/brand-mark.tsx`, apply `animate-pulse-glow` to the "AI" gradient span. Effect applies for all sizes (sidebar + hero) since both render the same span.

## 2. Restore hero problem statement
- In `src/routes/index.tsx`, between the "Your AI-Powered Workplace Productivity Suite" subtitle and the feature card grid, insert a `<p className="mx-auto my-6 max-w-2xl text-center text-muted-foreground">` containing the exact paragraph the user supplied.

## 3. Rebuild simulated AI outputs (`src/lib/simulated-ai.ts`)
The existing file already exports the right shapes, but the prompt asks me to make each generator richer, contextual, and guaranteed-non-empty. I'll rewrite each function so:
- `simulateChatReply(message)` — returns a 2–3 paragraph contextual response that echoes a sanitized snippet of the user's message; export a `CHAT_STARTERS` array with the four prompts the user listed so `chat.tsx` can render them as chips.
- `simulateEmail(role, topic, tone)` — returns `{ subject, greeting, body (2-3 paragraphs joined by `\n\n`), signoff, prompt }`. `prompt` follows the format: `"Generate a {tone} email to a {role} about: {topic}. Tone: {tone}. Ensure ..."`.
- `simulatePlan(input, scope, priority)` — returns 5–7 tasks (each with time block, title that references the user input when present, priority) + a single `optimizationTip` string + `prompt`. (Adds `optimizationTip`; keeps `suggestions` for backwards compat by mirroring it as `[optimizationTip]`.)
- `simulateMeetingSummary(notes)` — returns `summary`, `decisions[3]`, `actions[3]` (task/owner/deadline), `deadlines[2-3]`, `prompt`. Summary and decisions reference up to 120 chars of the user's notes verbatim.
- `simulateResearch(topic)` — returns `overview`, `insights[3]` (`title` + `detail`), `recommendations[3]`, `simple`, `prompt`. All sentences embed the topic string.
- Every function awaits `fakeDelay(800, 1500)` per spec and is wrapped in `try/catch` only where needed; no `navigator`, `window`, or `Math.random()` at module scope (already safe — `fakeDelay` is called inside the async fn).

The existing route components already consume these exact field names except for `optimizationTip`, which I'll surface in `planner.tsx` as the "Optimization tip" footer if it isn't already.

## 4. Simulation disclaimer banner
- Create `src/components/sim-banner.tsx` exporting `<SimBanner color={string} />`. Renders:
  ```
  <div className="mb-6 rounded-lg border px-4 py-2 text-xs text-muted-foreground"
       style={{
         background: "rgba(255,255,255,0.03)",
         borderColor: "rgba(255,255,255,0.06)",
         borderLeft: `2px solid ${color}`,
       }}>
    🔬 Demo Mode — Responses are simulated to showcase the app's architecture and prompt engineering. In production, these connect to AI models like GPT-4 or Claude.
  </div>
  ```
- Render `<SimBanner color={tool.colorVar} />` directly under `<ToolHeader />` in all five tool routes: `chat.tsx`, `email.tsx`, `planner.tsx`, `meetings.tsx`, `research.tsx`.

## 5. Runtime / SSR error sweep
The current "SSR rendering failed" error has no stack. Likely cause is one of the tool routes throwing during simulated generation when a field is missing. Rewriting `simulated-ai.ts` to always populate every field (step 3) eliminates the obvious source. While editing each tool page to add the banner, I'll also confirm:
- No top-level `navigator` / `window` usage.
- All consumers read only fields the new simulator guarantees.
- `chat.tsx` imports `CHAT_STARTERS` from `simulated-ai.ts` instead of the local `STARTERS` constant (single source of truth, matches spec wording).

## Out of scope
- No new routes, dependencies, or backend.
- No restyle of cards/sidebar beyond the banner + glow.
- Light-mode tuning of the glow is left at defaults (lavender reads fine on both themes).

## Files touched
- edit: `src/styles.css`, `src/components/brand-mark.tsx`, `src/routes/index.tsx`, `src/lib/simulated-ai.ts`, `src/routes/chat.tsx`, `src/routes/email.tsx`, `src/routes/planner.tsx`, `src/routes/meetings.tsx`, `src/routes/research.tsx`
- new: `src/components/sim-banner.tsx`
