# Fix: Stream all 4 AI tools via /api/* routes

The 4 non-chat tools currently use `generateText` + `Output.object` in `src/lib/ai-tools.functions.ts`, which the Lovable AI Gateway does not support. Chat works because it uses raw `streamText` at `/api/chat`. We'll replicate that pattern for the other 4 tools.

## Backend — 4 new streaming routes

Create, each modeled exactly after `src/routes/api/chat.ts`:

- `src/routes/api/email.ts`
- `src/routes/api/planner.ts`
- `src/routes/api/meetings.ts`
- `src/routes/api/research.ts`

Each route:
- POST handler reads `{ messages }` (UIMessage[]) from request body.
- Uses `createLovableAiGatewayProvider(process.env.LOVABLE_API_KEY)` + `LOVABLE_MODEL` (`google/gemini-3-flash-preview`).
- Calls `streamText({ model, system, messages: await convertToModelMessages(messages) })`.
- Returns `result.toUIMessageStreamResponse({ originalMessages: messages })`.
- System prompts (verbatim from request):
  - Email: `"You are a professional email assistant. Respond ONLY with a raw JSON object. No markdown, no code fences, no explanation before or after. Structure: {\"subject\": \"string\", \"greeting\": \"string\", \"body\": \"paragraphs separated by \\n\\n\", \"signoff\": \"string\"}"`
  - Planner: `"You are a task planning assistant. Respond ONLY with a raw JSON object. ... Structure: {\"tasks\": [{\"time\": \"09:00-10:30\", \"title\": \"description\", \"priority\": \"High\", \"note\": \"optional\"}], \"optimizationTip\": \"tip\"}"`
  - Meetings: `"You are a meeting notes assistant. ... Structure: {\"summary\": \"2-3 sentences\", \"decisions\": [\"string\"], \"actions\": [{\"task\": \"string\", \"owner\": \"name\", \"deadline\": \"date\"}], \"deadlines\": [\"string\"]}"`
  - Research: `"You are a research assistant. ... Structure: {\"overview\": \"paragraph\", \"insights\": [{\"title\": \"string\", \"detail\": \"string\"}], \"recommendations\": [\"string\"], \"simple\": \"simplified explanation\"}"`

## Remove old server functions

Delete `src/lib/ai-tools.functions.ts` (uses `Output.object`). Remove all `useServerFn(...)` calls for those handlers in the 4 route components.

## Shared helpers

New `src/lib/extract-json.ts` with `extractJSON(raw: string)`:
1. `JSON.parse` directly.
2. Strip ```json / ``` fences.
3. Slice from first `{`/`[` to matching last `}`/`]`.
4. Fallback: strip trailing commas + control chars, retry.
5. On final failure, throw — caller falls back to raw text.

New `src/lib/build-prompts.ts` that builds the user-facing prompt strings (same content as today, used for both the AI message and the View Prompt block) for email/planner/meetings/research.

## Frontend — 4 tool pages

For `src/routes/email.tsx`, `planner.tsx`, `meetings.tsx`, `research.tsx`:

- Replace `useServerFn(...)` with `useChat({ transport: new DefaultChatTransport({ api: "/api/<tool>" }) })` from `@ai-sdk/react`.
- "Generate" button: build prompt via `build-prompts`, call `sendMessage({ text: prompt })`, store prompt in local state for View Prompt.
- Derive `streamingText` by joining last assistant message's text parts.
- `status === "submitted" | "streaming"` → loading state.
- On completion (status returns to `ready` with assistant message present): call `extractJSON(streamingText)`; on success render structured cards; on failure render raw text in a styled `<pre>`-style block. Never toast an error for parse failures.
- Keep all existing card layouts, copy buttons, SimBanner, PromptViewer, AiDisclaimer.

## Streaming UX

Add to `src/styles.css`:
- `@keyframes shimmer` for skeleton gradient.
- `@keyframes fadeSlideUp` (opacity 0→1, translateY 8px→0, 300ms ease-out).
- `@keyframes pulseDot` for typing dots.
- Utility classes: `.skeleton-shimmer`, `.fade-slide-up`, with `.delay-0/150/300/450/600` for staggering.
- `.copy-check` brief scale + check swap.

New `src/components/typing-dots.tsx` — three pulsing dots using `pulseDot` keyframes, colored via `tool.colorVar`.

While loading: replace current `<Skeleton />` blocks with shimmer skeletons + TypingDots. Optionally stream partial text into a faint preview area.

When parsed result arrives: wrap output container in `.fade-slide-up`, and each section/card gets `.fade-slide-up .delay-{n*150}`. PromptViewer gets the largest delay.

Copy button: on click, swap icon to `Check` for 1.2s with `.copy-check` animation.

## Cleanup

- Delete `src/lib/ai-tools.functions.ts`.
- Confirm no remaining `Output.object`/`experimental_output` imports project-wide.
- Keep `/api/chat`, `SimBanner` copy, Responsible AI page, footer disclaimer, Kandinsky colors, glassmorphism untouched.
- No package additions needed (`ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible` already installed).

## Files

Created:
- `src/routes/api/email.ts`, `src/routes/api/planner.ts`, `src/routes/api/meetings.ts`, `src/routes/api/research.ts`
- `src/lib/extract-json.ts`, `src/lib/build-prompts.ts`
- `src/components/typing-dots.tsx`

Edited:
- `src/routes/email.tsx`, `src/routes/planner.tsx`, `src/routes/meetings.tsx`, `src/routes/research.tsx`
- `src/styles.css`
- `src/routeTree.gen.ts` (auto-regenerated)

Deleted:
- `src/lib/ai-tools.functions.ts`
