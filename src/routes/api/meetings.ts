import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider, LOVABLE_MODEL } from "@/lib/ai-gateway.server";

const SYSTEM = `You are a meeting notes assistant. Respond ONLY with a raw JSON object. No markdown, no code fences, no explanation. Structure: {"summary": "2-3 sentences", "decisions": ["string"], "actions": [{"task": "string", "owner": "name", "deadline": "date"}], "deadlines": ["string"]}`;

export const Route = createFileRoute("/api/meetings")({
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
