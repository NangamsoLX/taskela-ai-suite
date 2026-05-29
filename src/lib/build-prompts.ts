export type EmailRole = "Client" | "Manager" | "Team Member";
export type EmailTone = "Formal" | "Friendly" | "Persuasive";
export type PlanScope = "Daily Plan" | "Weekly Plan";
export type Priority = "Urgent" | "High" | "Medium" | "Low";

export function buildEmailPrompt(p: { role: EmailRole; topic: string; tone: EmailTone }) {
  return `Generate a ${p.tone.toLowerCase()} email to a ${p.role.toLowerCase()} about: ${p.topic}. Tone: ${p.tone.toLowerCase()}. Include a subject line, greeting, 2-3 body paragraphs, and a professional sign-off. Adapt vocabulary and formality based on the audience.`;
}

export function buildPlanPrompt(p: { input: string; scope: PlanScope; priority: Priority }) {
  return `Create a ${p.scope.toLowerCase()} task plan based on: ${p.input}. Priority level: ${p.priority}. Format as a numbered list with time blocks (e.g., 09:00-10:30), task descriptions, and priority badges. End with one time optimization tip.`;
}

export function buildMeetingPrompt(p: { notes: string }) {
  return `Summarize these meeting notes. Provide: 1) A 2-3 sentence summary, 2) Key decisions (bullet points), 3) Action items with assigned person and deadline, 4) Important deadlines. Meeting notes: ${p.notes}`;
}

export function buildResearchPrompt(p: { topic: string }) {
  return `Research the following topic: ${p.topic}. Provide: 1) A brief overview paragraph, 2) 3 key insights with titles and explanations, 3) 3 actionable recommendations, 4) A simplified explanation suitable for a non-expert.`;
}
