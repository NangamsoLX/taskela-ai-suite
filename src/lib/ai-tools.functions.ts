import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider, LOVABLE_MODEL } from "./ai-gateway.server";

function getModel() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("AI is not configured. Please contact support.");
  return createLovableAiGatewayProvider(key)(LOVABLE_MODEL);
}

function friendlyError(err: unknown): never {
  const msg = err instanceof Error ? err.message : String(err);
  if (/429/.test(msg)) throw new Error("AI is busy right now (rate limit). Please try again in a moment.");
  if (/402/.test(msg)) throw new Error("AI credits exhausted. Add credits in Settings \u2192 Workspace \u2192 Usage.");
  throw new Error(msg || "AI request failed. Please try again.");
}

// ---------- Email ----------
const EmailInput = z.object({
  role: z.enum(["Client", "Manager", "Team Member"]),
  topic: z.string().min(1),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
});

const EmailSchema = z.object({
  subject: z.string(),
  greeting: z.string(),
  body: z.string().describe("2-3 paragraphs, separated by blank lines"),
  signoff: z.string(),
});

export const generateEmailFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const prompt = `Generate a ${data.tone.toLowerCase()} email to a ${data.role.toLowerCase()} about: ${data.topic}. Tone: ${data.tone.toLowerCase()}. Include a subject line, greeting, 2-3 body paragraphs, and a professional sign-off. Adapt vocabulary and formality based on the audience.`;
    const systemPrompt = `You are a professional email assistant. You MUST respond with valid JSON matching this exact structure:
{"subject": "string", "greeting": "string", "body": "string with paragraphs separated by \\n\\n", "signoff": "string"}
Do NOT include any text outside the JSON object. Do NOT wrap in markdown code blocks.`;
    try {
      const { experimental_output } = await generateText({
        model: getModel(),
        system: systemPrompt,
        experimental_output: Output.object({ schema: EmailSchema }),
        prompt,
      });
      return { data: experimental_output, prompt };
    } catch (e) {
      try {
        const { text } = await generateText({
          model: getModel(),
          system: systemPrompt,
          prompt,
        });
        const parsed = JSON.parse(text);
        return { data: EmailSchema.parse(parsed), prompt };
      } catch {
        friendlyError(e);
      }
    }
  });

// ---------- Planner ----------
const PlanInput = z.object({
  input: z.string().min(1),
  scope: z.enum(["Daily Plan", "Weekly Plan"]),
  priority: z.enum(["Urgent", "High", "Medium", "Low"]),
});

const PlanSchema = z.object({
  tasks: z.array(z.object({
    time: z.string().describe("e.g. 09:00-10:30 for daily, or Monday for weekly"),
    title: z.string(),
    priority: z.string().describe("One of: Urgent, High, Medium, Low"),
    note: z.string().optional(),
  })),
  optimizationTip: z.string(),
});

export const generatePlanFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlanInput.parse(input))
  .handler(async ({ data }) => {
    const prompt = `Create a ${data.scope.toLowerCase()} task plan based on: ${data.input}. Priority level: ${data.priority}. Format as a numbered list with time blocks (e.g., 09:00-10:30), task descriptions, and priority badges. End with one time optimization tip.`;
    const systemPrompt = `You are a task planning assistant. You MUST respond with valid JSON matching this exact structure:
{"tasks": [{"time": "09:00-10:30", "title": "Task description", "priority": "High", "note": "optional note"}], "optimizationTip": "A helpful tip"}
Include 5-7 tasks. Priority must be one of: Urgent, High, Medium, Low.
Do NOT include any text outside the JSON object. Do NOT wrap in markdown code blocks.`;
    try {
      const { experimental_output } = await generateText({
        model: getModel(),
        system: systemPrompt,
        experimental_output: Output.object({ schema: PlanSchema }),
        prompt,
      });
      return { data: { scope: data.scope, ...experimental_output }, prompt };
    } catch (e) {
      try {
        const { text } = await generateText({
          model: getModel(),
          system: systemPrompt,
          prompt,
        });
        const parsed = JSON.parse(text);
        return { data: { scope: data.scope, ...PlanSchema.parse(parsed) }, prompt };
      } catch {
        friendlyError(e);
      }
    }
  });

// ---------- Meeting ----------
const MeetingInput = z.object({ notes: z.string().min(1) });

const MeetingSchema = z.object({
  summary: z.string().describe("2-3 sentences"),
  decisions: z.array(z.string()),
  actions: z.array(z.object({
    task: z.string(),
    owner: z.string(),
    deadline: z.string(),
  })),
  deadlines: z.array(z.string()),
});

export const summarizeMeetingFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => MeetingInput.parse(input))
  .handler(async ({ data }) => {
    const prompt = `Summarize these meeting notes. Provide: 1) A 2-3 sentence summary, 2) Key decisions (bullet points), 3) Action items with assigned person and deadline, 4) Important deadlines. Meeting notes: ${data.notes}`;
    const systemPrompt = `You are a meeting notes assistant. You MUST respond with valid JSON matching this exact structure:
{"summary": "2-3 sentence summary", "decisions": ["decision 1", "decision 2", "decision 3"], "actions": [{"task": "task description", "owner": "person name", "deadline": "date"}], "deadlines": ["deadline 1", "deadline 2"]}
Do NOT include any text outside the JSON object. Do NOT wrap in markdown code blocks.`;
    try {
      const { experimental_output } = await generateText({
        model: getModel(),
        system: systemPrompt,
        experimental_output: Output.object({ schema: MeetingSchema }),
        prompt,
      });
      return { data: experimental_output, prompt };
    } catch (e) {
      try {
        const { text } = await generateText({
          model: getModel(),
          system: systemPrompt,
          prompt,
        });
        const parsed = JSON.parse(text);
        return { data: MeetingSchema.parse(parsed), prompt };
      } catch {
        friendlyError(e);
      }
    }
  });

// ---------- Research ----------
const ResearchInput = z.object({ topic: z.string().min(1) });

const ResearchSchema = z.object({
  overview: z.string().describe("A brief overview paragraph"),
  insights: z.array(z.object({
    title: z.string(),
    detail: z.string(),
  })),
  recommendations: z.array(z.string()),
  simple: z.string().describe("Simplified explanation suitable for a non-expert"),
});

export const researchTopicFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResearchInput.parse(input))
  .handler(async ({ data }) => {
    const prompt = `Research the following topic: ${data.topic}. Provide: 1) A brief overview paragraph, 2) 3 key insights with titles and explanations, 3) 3 actionable recommendations, 4) A simplified explanation suitable for a non-expert.`;
    const systemPrompt = `You are a research assistant. You MUST respond with valid JSON matching this exact structure:
{"overview": "paragraph", "insights": [{"title": "Insight title", "detail": "explanation"}], "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"], "simple": "simplified explanation"}
Do NOT include any text outside the JSON object. Do NOT wrap in markdown code blocks.`;
    try {
      const { experimental_output } = await generateText({
        model: getModel(),
        system: systemPrompt,
        experimental_output: Output.object({ schema: ResearchSchema }),
        prompt,
      });
      return { data: experimental_output, prompt };
    } catch (e) {
      try {
        const { text } = await generateText({
          model: getModel(),
          system: systemPrompt,
          prompt,
        });
        const parsed = JSON.parse(text);
        return { data: ResearchSchema.parse(parsed), prompt };
      } catch {
        friendlyError(e);
      }
    }
  });
