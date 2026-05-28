# Plan: Power the 5 Taskela tools with Lovable AI

Replace the simulated outputs in `src/lib/simulated-ai.ts` with real Lovable AI Gateway calls (model: `google/gemini-3-flash-preview`) using the AI SDK. Keep all UI, glassmorphism, Kandinsky colors, animations, View Prompt collapsibles, the SimBanner (with updated copy), the Responsible AI page, and the footer disclaimer untouched.

## 1. Backend setup (TanStack server)

- Ensure `LOVABLE_API_KEY` is provisioned (use `ai_gateway--create` if missing).
- Create `src/lib/ai-gateway.server.ts` with the canonical `createLovableAiGatewayProvider` helper (per the Lovable AI Gateway knowledge — `@ai-sdk/openai-compatible`, `Lovable-API-Key` header, `X-Lovable-AIG-SDK: vercel-ai-sdk`, run-id capture wrapper).
- Install deps: `ai`, `@ai-sdk/openai-compatible`, `@ai-sdk/react`, `zod` (only those not already present).

## 2. Endpoints

### a) Streaming chat route — `src/routes/api/chat.ts`
- `POST` handler using `streamText` + `toUIMessageStreamResponse`, wrapped with `withLovableAiGatewayRunIdHeader`.
- System prompt: short workplace assistant persona.
- Model: `google/gemini-3-flash-preview`.

### b) One-shot structured server functions — `src/lib/ai-tools.functions.ts`
Four `createServerFn({ method: "POST" })` handlers using `generateText` with `Output.object(...)` (Zod schemas) so the UI can render structured cards reliably:

- `generateEmailFn` → `{ subject, greeting, body, signoff }` + returns the exact `prompt` string sent.
- `generatePlanFn` → `{ tasks: [{ time, title, priority, note? }], optimizationTip }` + `prompt`.
- `summarizeMeetingFn` → `{ summary, decisions[], actions: [{task, owner, deadline}], deadlines[] }` + `prompt`.
- `researchTopicFn` → `{ overview, insights: [{title, detail}], recommendations[], simple }` + `prompt`.

Each handler:
- Builds the exact prompt string specified in the user request (interpolating role/tone/topic/scope/priority/notes).
- Reads `process.env.LOVABLE_API_KEY` inside the handler; returns a clear error on 402/429/missing key.
- Returns `{ data, prompt }` so the View Prompt collapsible shows the real prompt sent.

## 3. Frontend changes

### Chat (`src/routes/chat.tsx`)
- Replace `simulateChatReply` with `@ai-sdk/react` `useChat` + `DefaultChatTransport({ api: "/api/chat" })`.
- Keep starter chips (call `sendMessage({ text })`), typing indicator while `status === "submitted" | "streaming"`, Trash to clear, markdown rendering of streamed assistant `parts`.
- User bubble keeps Kandinsky color styling.

### Email / Planner / Meetings / Research routes
- Replace `simulateEmail/Plan/MeetingSummary/Research` calls with `useServerFn(...)` wrapping the new server functions.
- Preserve existing form fields, loading states, output layouts, and `<PromptViewer prompt={...} />`, now fed with the real prompt returned from the server.
- On error: toast + inline friendly message ("AI request failed — please try again"). Handle 402 (credits) and 429 (rate limit) with specific copy.

### Shared
- Update `src/components/sim-banner.tsx` copy to: `🤖 Powered by AI — Responses are generated in real-time. Always verify AI-generated content before use.` (keep the Kandinsky left-border accent and styling).
- Delete `src/lib/simulated-ai.ts` once all imports are migrated (or keep `CHAT_STARTERS` constant by moving it to `src/lib/chat-starters.ts`).

## 4. Verification

- Build passes.
- Manually test each of the 5 tools in preview: chat streams, other 4 return structured output rendered in existing cards, View Prompt shows the real prompt.
- Confirm SimBanner text updated and Responsible AI page + footer disclaimer untouched.

## Technical notes

- Model: `google/gemini-3-flash-preview` for all 5 tools.
- Use `Output.object` (AI SDK structured output) instead of asking the model to return JSON and parsing manually.
- All AI calls run server-side; `LOVABLE_API_KEY` never reaches the browser.
- Chat route uses streaming; the other 4 tools use one-shot `generateText` (faster cards, simpler UI).
- `attachSupabaseAuth` middleware is NOT required (no auth needed for these tools).
