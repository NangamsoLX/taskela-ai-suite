// Simulated AI outputs for Taskela AI. No backend; pure client-side placeholders
// that demonstrate the product experience with realistic content.

export const fakeDelay = (min = 800, max = 1500) =>
  new Promise<void>((r) => setTimeout(r, min + Math.random() * (max - min)));

const snippet = (s: string, n = 120) => {
  const t = (s ?? "").trim();
  if (!t) return "";
  return t.length > n ? `${t.slice(0, n)}…` : t;
};

// ---------- Chatbot ----------
export const CHAT_STARTERS = [
  "Help me plan my day",
  "Draft a follow-up email",
  "Summarize key project risks",
  "What are best practices for time management?",
];

export async function simulateChatReply(userMessage: string): Promise<string> {
  await fakeDelay();
  const m = userMessage.toLowerCase();
  const focus = snippet(userMessage, 80) || "your request";

  if (m.includes("plan") && m.includes("day")) {
    return `Here's a focused plan for your day:

1. **9:00 – 10:30** — Deep work on your most important task. Silence notifications.
2. **10:30 – 11:00** — Inbox triage. Reply only to items that take under two minutes.
3. **11:00 – 12:30** — Collaborative work or meetings.
4. **13:30 – 15:00** — Second deep-work block on the same priority.
5. **15:00 – 16:00** — Admin, follow-ups, and small tasks.
6. **16:00 – 17:00** — Review what you finished and write tomorrow's top three.

Want me to turn this into calendar blocks or a checklist?`;
  }
  if (m.includes("follow-up") || m.includes("follow up") || m.includes("email") || m.includes("draft")) {
    return `Happy to help draft that. To make it land, share three quick things:

1. **Recipient** — client, manager, or teammate.
2. **Goal of the email** — what do you want them to do after reading it?
3. **Tone** — formal, friendly, or persuasive.

If you want a guided flow, the Smart Email Generator tool will walk you through it and produce a polished draft in seconds.`;
  }
  if (m.includes("risk") || m.includes("summar")) {
    return `Here's how I'd structure a quick risk readout on **${focus}**:

- **Top risks** — list the three most likely issues, with a one-line impact each.
- **Owners & mitigations** — who's on it, and the single next action.
- **Watchlist** — items that aren't urgent but could escalate this week.

Paste any notes or docs you have and I'll turn them into that exact shape.`;
  }
  if (m.includes("time management") || m.includes("productivity") || m.includes("best practices")) {
    return `A handful of practices that consistently pay off:

- **Time-block your calendar.** Treat focus time as a meeting with yourself.
- **One MIT** (most important task) per day — finish it before noon.
- **Batch shallow work** like email and Slack into two short windows.
- **Energy beats hours.** Schedule cognitive work for your peak hours.
- **End-of-day reset** — write tomorrow's top three before you log off.

Pick one to try this week — the compounding effect over a month is significant.`;
  }
  return `Got it — here's how I'd approach **${focus}**:

- Clarify the outcome you want in one sentence.
- Break it into two or three concrete next steps.
- Identify the smallest thing you can ship today to make progress visible.

Want me to expand any of these into a plan, a draft email, or a research brief?`;
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
  const cleanTopic = topic.trim() || "our recent discussion";
  const topicShort = snippet(cleanTopic, 60);

  const greetings: Record<EmailTone, Record<EmailRole, string>> = {
    Formal: {
      Client: "Dear [Client Name],",
      Manager: "Dear [Manager Name],",
      "Team Member": "Hello team,",
    },
    Friendly: {
      Client: "Hi [Client Name],",
      Manager: "Hi [Manager Name],",
      "Team Member": "Hey team,",
    },
    Persuasive: {
      Client: "Hello [Client Name],",
      Manager: "Hi [Manager Name],",
      "Team Member": "Team —",
    },
  };

  const signoffs: Record<EmailTone, string> = {
    Formal: "Kind regards,\n[Your Name]",
    Friendly: "Thanks so much,\n[Your Name]",
    Persuasive: "Looking forward to your thoughts,\n[Your Name]",
  };

  const subject =
    tone === "Persuasive"
      ? `Quick win on ${topicShort}`
      : tone === "Friendly"
        ? `Following up on ${topicShort}`
        : `Project Update — ${topicShort}`;

  const bodyByTone: Record<EmailTone, string> = {
    Formal: `I hope this message finds you well. I wanted to provide an update regarding ${cleanTopic}, and to confirm the next steps so we stay aligned on expectations and timelines.

Based on our previous discussion, we are on track with the agreed deliverables. I will share the supporting documents by end of week, and would welcome any feedback you have ahead of our next review.

Please let me know if anything further is required from my side. I appreciate your time and continued partnership.`,
    Friendly: `Hope you're having a great week! Wanted to circle back on ${cleanTopic} and make sure we're on the same page.

Quick recap of where we are and what's coming next — happy to walk through it on a call if that's easier. Let me know what works for you.

Either way, I'll keep things moving on my end and flag anything that needs your input.`,
    Persuasive: `I'll keep this short: ${cleanTopic} is a high-leverage opportunity and I'd love your go-ahead to move it forward this week.

Here's the case in three points: it directly supports our current priority, the cost to test is small, and we can ship a first version in days rather than weeks. The downside is bounded; the upside is meaningful.

Could you give it the green light, or share any concerns I can address right away?`,
  };

  const audienceHint =
    role === "Client"
      ? "an external client (professional, respectful)"
      : role === "Manager"
        ? "your direct manager (concise, outcome-oriented)"
        : "your internal team (collaborative, action-oriented)";

  const prompt = `Generate a ${tone.toLowerCase()} email to ${audienceHint} about: """${cleanTopic}""".
Tone: ${tone.toLowerCase()}. Ensure a clear subject line, an appropriate greeting, 2-3 short paragraphs, and a courteous sign-off.
Keep it under 180 words, use plain human English, and avoid jargon.`;

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
  optimizationTip: string;
  prompt: string;
}

export async function simulatePlan(
  input: string,
  scope: PlanScope,
  priority: Priority,
): Promise<GeneratedPlan> {
  await fakeDelay();
  const base = input.trim() || "deliver this week's key project milestone";
  const baseShort = snippet(base, 60);

  const daily: PlannerTask[] = [
    { id: "1", time: "08:30 – 09:00", title: "Plan & prioritize the day", priority: "Medium" },
    { id: "2", time: "09:00 – 10:30", title: `Deep work: ${baseShort}`, priority },
    { id: "3", time: "10:30 – 11:00", title: "Inbox triage (15-min cap)", priority: "Low" },
    { id: "4", time: "11:00 – 12:30", title: "Stakeholder sync & follow-ups", priority: "High" },
    { id: "5", time: "13:30 – 15:00", title: `Second focus block on ${baseShort}`, priority },
    { id: "6", time: "15:00 – 16:00", title: "Review, document, and unblock teammates", priority: "Medium" },
    { id: "7", time: "16:00 – 17:00", title: "Plan tomorrow's top 3", priority: "Low" },
  ];

  const weekly: PlannerTask[] = [
    { id: "1", time: "Monday", title: `Scope & plan: ${baseShort}`, priority },
    { id: "2", time: "Tuesday", title: "Deep build / first draft", priority: "High" },
    { id: "3", time: "Wednesday", title: "Review with stakeholders", priority: "High" },
    { id: "4", time: "Thursday", title: "Iterate on feedback", priority: "Medium" },
    { id: "5", time: "Friday", title: "Ship + retrospective", priority: "Urgent" },
  ];

  const tasks = scope === "Daily Plan" ? daily : weekly;
  const optimizationTip =
    "Consider batching email responses between 11:00–11:30 to minimize context switching, and protecting two uninterrupted 90-minute focus blocks for the work that actually moves the needle.";

  const prompt = `You are a productivity coach. Build a ${scope.toLowerCase()} for the user based on:
Goals / tasks: """${base}"""
Default priority for new items: ${priority}.
Return a structured plan with time blocks, priorities, and a single optimization tip that reduces context switching.`;

  return {
    scope,
    tasks,
    suggestions: [optimizationTip],
    optimizationTip,
    prompt,
  };
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
  const ctx = snippet(notes, 120) || "the meeting";
  const isDeadlineFocused = /deadline|deliver|launch|ship|due/i.test(notes);

  return {
    summary: `The team aligned on priorities for the upcoming sprint and discussed how to unblock the current release. Key context from the notes: "${ctx}". The conversation closed with clear next steps, named owners, and ${isDeadlineFocused ? "explicit deadlines for each critical deliverable" : "a shared understanding of what success looks like this week"}.`,
    decisions: [
      isDeadlineFocused
        ? "Lock the launch date and freeze scope at end of day Wednesday."
        : "Ship the v1 release by end of next week.",
      "Pause the secondary workstream until the primary release is out the door.",
      "Introduce a weekly 30-minute review to track progress against the plan.",
    ],
    actions: [
      { task: "Finalize the launch checklist and circulate for sign-off", owner: "Alex", deadline: "Friday" },
      { task: "Draft the customer announcement email and share for review", owner: "Priya", deadline: "Wednesday" },
      { task: "Prepare the metrics dashboard for the launch review", owner: "Sam", deadline: "Tuesday" },
    ],
    deadlines: [
      "Tuesday — metrics dashboard ready",
      "Wednesday — announcement email draft",
      "Friday — launch checklist signed off",
    ],
    prompt: `You are an expert meeting summarizer. Read the notes/transcript and produce:
1) A 2-3 sentence Summary that references the actual content
2) Key Decisions as a bullet list (3 items)
3) Action Items as { task, owner, deadline } (3 items)
4) Important Deadlines as a bullet list (2-3 dates)
Notes:
"""${snippet(notes, 800)}"""`,
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
  await fakeDelay(1000, 1500);
  const t = topic.trim() || "the topic";
  const tShort = snippet(t, 80);

  return {
    overview: `${tShort} is an active area with rapid developments and a growing body of practical case studies. The current best practice combines a clear problem statement, small reversible experiments, and tight feedback loops with the people who actually use the output. Teams that succeed treat ${tShort} as a learning system, not a one-off project — they invest in measurement and iteration rather than chasing the perfect first version.`,
    insights: [
      {
        title: "Start narrow, then expand",
        detail: `Pick a single, measurable use case inside ${tShort} before generalizing. Breadth too early hides which choices actually drive the result.`,
      },
      {
        title: "Measure outcomes, not outputs",
        detail: "Track the metric that matters to the end user — time saved, errors avoided, decisions accelerated — not the volume of features shipped or experiments run.",
      },
      {
        title: "Human-in-the-loop wins early",
        detail: "Pair automation with a lightweight review step. Trust compounds faster than fully autonomous flows, and reviewers surface edge cases your data didn't.",
      },
    ],
    recommendations: [
      `Run a 2-week pilot of ${tShort} with a single team and one workflow.`,
      "Instrument inputs and outputs so you can compare before-and-after honestly.",
      "Publish a short internal write-up at the end — wins, surprises, and the next bet.",
    ],
    simple: `In plain language: pick one small problem related to ${tShort}, try the simplest possible solution for two weeks, measure whether it actually helped, then decide what to do next. Don't try to solve everything at once — solve one thing and learn.`,
    prompt: `You are a senior research analyst. Research the topic below and produce:
1) Overview (3-4 sentences) that grounds the reader
2) Key Insights as { title, detail } cards (3 items)
3) Recommendations as a bullet list (3 items)
4) A "Simplified Explanation" anyone can understand in 2 sentences
Topic: """${t}"""`,
  };
}
