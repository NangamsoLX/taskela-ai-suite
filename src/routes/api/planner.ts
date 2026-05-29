import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider, LOVABLE_MODEL } from "@/lib/ai-gateway.server";

const SYSTEM = `You are a task planning assistant. Respond ONLY with a raw JSON object. No markdown, no code fences, no explanation. Structure: {"tasks": [{"time": "09:00-10:30", "title": "description", "priority": "High", "note": "optional"}], "optimizationTip": "tip"}`;

export const Route = createFileRoute("/api/planner")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages?: UIMessage[] };
        if (!Array.isArray(messages)) return new Response("Messages required", { status: 400 });
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway(LOVABLE_MODEL),
          system: SYSTEM,
          messages: await convertToModelMessages(messages),
        });
        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});
