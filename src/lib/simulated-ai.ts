// Simulated AI outputs for Taskela AI. No backend; pure client-side placeholders
// that demonstrate the product experience with realistic content.

export const fakeDelay = (min = 900, max = 1600) =>
  new Promise<void>((r) => setTimeout(r, min + Math.random() * (max - min)));

// ---------- Chatbot ----------
export async function simulateChatReply(userMessage: string): Promise<string> {
  await fakeDelay(700, 1400);
  const m = userMessage.toLowerCase();
  if (m.includes("plan") && m.includes("day")) {
    return `Here's a focused plan for your day:

1. **9:00 – 10:30** — Deep work on your most important task (no notifications).
2. **10:30 – 11:00** — Inbox triage. Reply only to items that take < 2 minutes.
3. **11:00 – 12:30** — Collaborative work or meetings.
4. **13:30 – 15:00** — Second deep-work block.
5. **15:00 – 16:00** — Admin, follow-ups, and small tasks.
6. **16:00 – 17:00** — Review what you finished, plan tomorrow's top 3.

Want me to turn this into a calendar block?`;
  }
  if (m.includes("summar")) {
    return `Share the document text and I'll pull out:
- A 2-sentence summary
- Key decisions
- Action items with owners
- Any deadlines I can detect`;
  }
  if (m.includes("email") || m.includes("draft")) {
    return `Happy to help. Tell me:
1. **Recipient** (client, manager, team)
2. **Goal** of the email
3. **Tone** (formal / friendly / persuasive)

Then I'll draft it for you. You can also use the Email Generator tool for a guided flow.`;
  }
  if (m.includes("time management") || m.includes("productivity")) {
    return `A few high-leverage practices:
- **Time-block** the calendar. Treat focus time as a meeting with yourself.
- **One MIT** (most important task) per day — finish it before noon.
- **Batch** shallow work (email, Slack) into two windows.
- **Energy > hours.** Schedule cognitive work for your peak hours.
- **End-of-day reset** — write tomorrow's top 3 before you log off.`;
  }
  return `Got it — here's how I'd approach "${userMessage.slice(0, 80)}":

- Clarify the desired outcome in one sentence.
- Break it into 2–3 concrete next steps.
- Identify the smallest thing you can ship today.

Want me to expand any of these into a plan, an email, or a research brief?`;
}

// ---------- Email ----------
export type EmailRole = "Client" | "Manager" | "Team Member";
export type EmailTone = "Formal" | "Friendly" | "Persuasive";

export interface GeneratedEmail {
  subject: string;
  greeting: string;
  body: string;
  signoff: string;
  prompt: string;
}

export async function simulateEmail(
  role: EmailRole,
  topic: string,
  tone: EmailTone,
): Promise<GeneratedEmail> {
  await fakeDelay();
  const greetings: Record<EmailTone, Record<EmailRole, string>> = {
    Formal: {
      Client: "Dear Valued Client,",
      Manager: "Dear [Manager Name],",
      "Team Member": "Hello team,",
    },
    Friendly: {
      Client: "Hi there,",
      Manager: "Hi [Manager Name],",
      "Team Member": "Hey team,",
    },
    Persuasive: {
      Client: "Hello,",
      Manager: "Hi [Manager Name],",
      "Team Member": "Team —",
    },
  };
  const signoffs: Record<EmailTone, string> = {
    Formal: "Kind regards,\n[Your Name]",
    Friendly: "Thanks so much,\n[Your Name]",
    Persuasive: "Looking forward to your thoughts,\n[Your Name]",
  };
  const cleanTopic = topic.trim() || "our recent discussion";
  const subject =
    tone === "Persuasive"
      ? `Quick win on ${cleanTopic.slice(0, 60)}`
      : tone === "Friendly"
        ? `Following up on ${cleanTopic.slice(0, 60)}`
        : `Re: ${cleanTopic.slice(0, 60)}`;

  const bodyByTone: Record<EmailTone, string> = {
    Formal: `I hope this message finds you well. I am writing regarding ${cleanTopic}.

Based on our prior conversation, I wanted to outline the next steps and ensure we are aligned on expectations and timelines. Please let me know if there is anything further you require from my side.

I appreciate your time and consideration.`,
    Friendly: `Hope you're having a great week! Wanted to circle back on ${cleanTopic}.

Quick recap of where we are and what's next — let me know if anything looks off or if there's a better time to chat. Always happy to jump on a quick call.`,
    Persuasive: `I'll keep this short: ${cleanTopic} is a high-leverage opportunity and I'd love your go-ahead to move it forward this week.

Here's the case in three points:
1. It directly supports our current priority.
2. The cost to test is small; the upside is meaningful.
3. We can ship a first version in days, not weeks.

Could you give it the green light, or share any concerns I can address?`,
  };

  const audienceHint =
    role === "Client"
      ? "external client (professional, respectful)"
      : role === "Manager"
        ? "your direct manager (concise, outcome-oriented)"
        : "your internal team (collaborative, action-oriented)";

  const prompt = `You are an expert business communicator. Write an email in a ${tone.toLowerCase()} tone for ${audienceHint}.
Topic / context: """${cleanTopic}"""
Include a clear subject line, an appropriate greeting, 1-3 short paragraphs, and a sign-off.
Keep it under 150 words. Avoid jargon. Use plain, human English.`;

  return {
    subject,
    greeting: greetings[tone][role],
    body: bodyByTone[tone],
    signoff: signoffs[tone],
    prompt,
  };
}

// ---------- Planner ----------
export type PlanScope = "Daily Plan" | "Weekly Plan";
export type Priority = "Urgent" | "High" | "Medium" | "Low";

export interface PlannerTask {
  id: string;
  time: string;
  title: string;
  priority: Priority;
  note?: string;
}

export interface GeneratedPlan {
  scope: PlanScope;
  tasks: PlannerTask[];
  suggestions: string[];
  prompt: string;
}

export async function simulatePlan(
  input: string,
  scope: PlanScope,
  priority: Priority,
): Promise<GeneratedPlan> {
  await fakeDelay();
  const base = input.trim() || "Deliver this week's key project milestone";
  const daily: PlannerTask[] = [
    { id: "1", time: "08:30 – 09:00", title: "Plan & prioritize the day", priority: "Medium" },
    { id: "2", time: "09:00 – 10:30", title: `Deep work: ${base}`, priority },
    { id: "3", time: "10:30 – 11:00", title: "Inbox triage (15-min cap)", priority: "Low" },
    { id: "4", time: "11:00 – 12:30", title: "Stakeholder sync & follow-ups", priority: "High" },
    { id: "5", time: "13:30 – 15:00", title: `Second focus block on ${base}`, priority },
    { id: "6", time: "15:00 – 16:00", title: "Review, document, and unblock", priority: "Medium" },
    { id: "7", time: "16:00 – 17:00", title: "Plan tomorrow's top 3", priority: "Low" },
  ];
  const weekly: PlannerTask[] = [
    { id: "1", time: "Monday", title: `Scope & plan: ${base}`, priority },
    { id: "2", time: "Tuesday", title: "Deep build / first draft", priority: "High" },
    { id: "3", time: "Wednesday", title: "Review with stakeholders", priority: "High" },
    { id: "4", time: "Thursday", title: "Iterate on feedback", priority: "Medium" },
    { id: "5", time: "Friday", title: "Ship + retrospective", priority: "Urgent" },
  ];
  const tasks = scope === "Daily Plan" ? daily : weekly;
  const suggestions = [
    "Protect 2 deep-work blocks of 90 minutes — no meetings, no Slack.",
    "Batch shallow work (email, messages) into two short windows.",
    "End each day by writing tomorrow's top 3 — it cuts morning friction.",
  ];
  const prompt = `You are a productivity coach. Build a ${scope.toLowerCase()} for the user based on:
Goals / tasks: """${base}"""
Default priority for new items: ${priority}.
Return a structured plan with time blocks, priorities, and 2-3 optimization tips.`;
  return { scope, tasks, suggestions, prompt };
}

// ---------- Meeting summary ----------
export interface ActionItem {
  task: string;
  owner: string;
  deadline: string;
}
export interface MeetingSummary {
  summary: string;
  decisions: string[];
  actions: ActionItem[];
  deadlines: string[];
  prompt: string;
}

export async function simulateMeetingSummary(notes: string): Promise<MeetingSummary> {
  await fakeDelay();
  const snippet = notes.trim().slice(0, 120) || "the meeting";
  return {
    summary: `The team aligned on priorities for the upcoming sprint and discussed how to unblock the current release. Key context: ${snippet}${notes.length > 120 ? "…" : ""}. The conversation concluded with clear next steps and named owners.`,
    decisions: [
      "Ship the v1 release by end of next week.",
      "Pause the secondary workstream until the release is out.",
      "Introduce a weekly 30-minute review to track progress.",
    ],
    actions: [
      { task: "Finalize the launch checklist", owner: "Alex", deadline: "Friday" },
      { task: "Draft the customer announcement email", owner: "Priya", deadline: "Wednesday" },
      { task: "Prepare metrics dashboard for review", owner: "Sam", deadline: "Tuesday" },
    ],
    deadlines: ["Wed — announcement draft", "Fri — launch checklist", "End of next week — v1 ship"],
    prompt: `You are an expert meeting summarizer. Read the notes/transcript and produce:
1) A 2-3 sentence summary
2) Key decisions as a bullet list
3) Action items as { task, owner, deadline }
4) Important deadlines as a bullet list
Notes:
"""${notes.slice(0, 800)}"""`,
  };
}

// ---------- Research ----------
export interface ResearchOutput {
  overview: string;
  insights: { title: string; detail: string }[];
  recommendations: string[];
  simple: string;
  prompt: string;
}

export async function simulateResearch(topic: string): Promise<ResearchOutput> {
  await fakeDelay(1100, 1800);
  const t = topic.trim() || "the topic";
  return {
    overview: `${t} is an active area with rapid developments. Current best practice combines a clear problem statement, small reversible experiments, and tight feedback loops with end users. Most successful teams treat it as a learning system, not a one-off project.`,
    insights: [
      {
        title: "Start narrow, expand later",
        detail: "Pick a single, measurable use case before generalizing. Breadth too early hides which choices actually drive results.",
      },
      {
        title: "Measure outcomes, not outputs",
        detail: "Track the metric that matters to the user (time saved, errors avoided), not the volume of features shipped.",
      },
      {
        title: "Human-in-the-loop wins",
        detail: "Pair automation with a lightweight review step. Trust grows faster than fully autonomous flows.",
      },
    ],
    recommendations: [
      "Run a 2-week pilot with a single team and one workflow.",
      "Instrument inputs and outputs so you can compare before/after honestly.",
      "Publish a short internal write-up at the end — wins, surprises, next bets.",
    ],
    simple: `In plain language: pick one small problem related to ${t}, try the simplest possible solution for two weeks, measure whether it actually helped, then decide what to do next.`,
    prompt: `You are a senior research analyst. Research the topic below and produce:
1) Overview (3-4 sentences)
2) Key Insights as { title, detail } cards
3) Recommendations as a bullet list
4) A "Simplified Explanation" anyone can understand in 2 sentences
Topic: """${t}"""`,
  };
}
