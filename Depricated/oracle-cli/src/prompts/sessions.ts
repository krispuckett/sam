import { SessionType } from '../core/engine';

export function getSessionPrompt(type: SessionType, topic?: string): string {
  switch (type) {
    case 'tactical':
      return TACTICAL_PROMPT;
    case 'immunity':
      return IMMUNITY_PROMPT;
    case 'decision':
      return DECISION_PROMPT(topic);
    case 'feedback':
      return FEEDBACK_PROMPT;
    case 'retro':
      return RETRO_PROMPT(topic);
    case 'stakeholders':
      return STAKEHOLDERS_PROMPT;
    case 'intake':
      return INTAKE_PROMPT;
    case 'open':
      return OPEN_PROMPT;
    case 'daily':
      return DAILY_PROMPT;
    case 'accountability':
      return ACCOUNTABILITY_PROMPT;
    case 'patterns':
      return PATTERNS_PROMPT;
    case 'derailers':
      return DERAILERS_PROMPT;
    case '360':
      return THREE_SIXTY_PROMPT(topic);
    default:
      return OPEN_PROMPT;
  }
}

const TACTICAL_PROMPT = `Begin a Weekly Tactical session (20 min).

Follow the session opening protocol:
1. Settle — somatic check-in
2. Accountability — review the most recent commitment from the coaching data
3. PEA activation — one positive before problems
4. Then run the 5 Weekly Questions one at a time, responding to each before asking the next:
   - "What happened this week you're proud of as a leader?"
   - "Where did you fall short of the leader you want to be?"
   - "What conversation are you avoiding?"
   - "What decision are you postponing?"
   - "What one thing would make the biggest difference this week?"
5. Pattern check — reference cross-session patterns
6. Close with Session Closing Protocol

Start now with the settle.`;

const IMMUNITY_PROMPT = `Begin an Immunity to Change deep work session (45-60 min).

This is the heart of Oracle. Follow the session opening protocol, then guide through the 4-Column Map:

Column 1 — Improvement Goal: Get a specific, behavioral, genuinely desired goal
Column 2 — Fearless Inventory: 5-7 behaviors working against the goal
Column 3 — Competing Commitments: For each behavior, surface what protection it provides
Column 4 — Big Assumptions: What must be true for the fears to feel real

Apply Gestalt check before trying to change anything: "What does this pattern give you?"
Apply ACT defusion: "Say it as: 'I'm having the thought that...'"
Apply Kline Incisive Question: "If you knew [opposite of assumption], what would you do?"

Then design a safe experiment. Close with Session Closing Protocol.

Start now with the settle.`;

const DECISION_PROMPT = (topic?: string) => `Begin a Decision Coaching session (30 min).

${topic ? `The decision topic is: "${topic}"` : 'Ask what decision needs coaching.'}

Follow session opening protocol, then:
1. Frame — describe in 3-5 sentences, deadline, stakeholders
2. Diagnose stuckness — Heifetz: technical or adaptive? Polarity check: problem or polarity?
3. Surface real stakes — fears, identity at stake, Colonna: "What would the version of you who has the answer say?"
4. Map ALL options including dismissed ones — best/worst/most likely, second-order effects
5. SFBC Miracle Question: "If this was solved overnight, what would tomorrow look like?"
6. Challenge assumptions — reference immunity map and patterns
7. Force decision: "Say it: 'I have decided to...'"
8. Test: small experiment in 48 hours
9. Close with Session Closing Protocol

Start now with the settle.`;

const FEEDBACK_PROMPT = `Begin a Feedback Processing session (45 min).

Follow session opening protocol, then:
1. Receive — acknowledge the feedback without defense. "Just let it land."
2. Somatic check — "Where do you feel this? What's the sensation?"
3. Cluster into 3-5 themes (strengths and growth edges)
4. For each growth edge: behavior people see, accuracy check, connect to career-long themes
5. SCARF: "Which domain feels most threatened — Status, Certainty, Autonomy, Relatedness, Fairness?"
6. Hard question: "If 20% of the harshest was accurate, what 20%?"
7. Career-long feedback: "What feedback keeps following you?"
8. Translate to specific behavior to practice
9. Script one feedforward conversation
10. Close with Session Closing Protocol

Start now with the settle, then ask what feedback was received.`;

const RETRO_PROMPT = (period?: string) => `Begin a Retrospective session (30 min).

${period ? `The period is: "${period}"` : 'Ask what period to review.'}

Follow session opening protocol, then:
1. Timeline — walk through key moments (decisions, successes, failures)
2. Pattern extraction — at your best (conditions?), fell short (triggers?), feedback (what done with it?)
3. Argyris: "What does this reveal about the gap between what you say you value and how you operated?"
4. Check against development focus and immunity map experiments
5. Uncomfortable question: "What are you hoping I won't notice about this period?"
6. Extract If-Then guardrails
7. Close with Session Closing Protocol

Start now with the settle.`;

const STAKEHOLDERS_PROMPT = `Begin a Stakeholder Audit session (30 min).

Follow session opening protocol, then:
1. Review current map — 5-8 people whose perception matters most. For each: needs, quality (1-10), last interaction, risk
2. SCARF analysis for most strained relationship
3. Feedforward status — pending conversations, recent results
4. NVC prep for most important conversation: observation, feeling, need, request
5. Priority — ONE relationship needing attention this week. Why? What? When?
6. Script the conversation
7. Close with Session Closing Protocol

Start now with the settle.`;

const INTAKE_PROMPT = `Begin a full Intake / Quarterly Reset session (45-60 min).

This establishes or refreshes the baseline. It's comprehensive and honest.

Part 1 — Vision First (Boyatzis):
"Close your eyes. Picture yourself 2 years from now, at your best — as a leader, as a person. What does that look like?"

Part 2 — Real Self:
Leadership journey (real story, not resume), career-long feedback, strengths, triggers

Part 3 — Current Context:
Most important improvement, key stakeholders, avoided conversations, postponed decisions

Part 4 — Uncomfortable Questions:
"What do you hope I won't ask about?"
"What would have to be true for you to fail?"
"What behavior that got you here won't get you there?"

Part 5 — Development Focus:
ONE behavior, why it hasn't changed, Peterson Pipeline diagnosis

Part 6 — Coaching Setup:
How to push, custom daily questions

Generate the complete baseline document at the end.

Start with Part 1 — Vision.`;

const OPEN_PROMPT = `Begin an Open session. Follow the session opening protocol (settle, accountability, PEA activation), then:

"What do you need from our time today?"

Then "And what else?" at least twice. Then "What's the real challenge here for you?"

Select from the full framework library based on what emerges. Be framework-fluid.

Start now with the settle.`;

const DAILY_PROMPT = `This is a brief daily check-in. Review the daily active question scores that were just logged and provide a brief pattern note:

- Flag any below 5
- Note trends if visible from recent history
- Ask ONE question about a low score if relevant
- Don't lecture. Keep it under 100 words.`;

const ACCOUNTABILITY_PROMPT = `Run an accountability check.

Review ALL active commitments from the coaching data. For each:
- Is it overdue, due today, due this week, or future?
- If overdue: flag clearly

Then:
🔴 OVERDUE: [list with dates]
🟡 DUE THIS WEEK: [list]
🟢 ON TRACK: [list]

If overdue items exist, ask ONE pointed question about the pattern. Direct, not judgmental.
If no commitments: "No active commitments tracked. Run 'oracle tactical' to set one."`;

const PATTERNS_PROMPT = `Run a cross-session pattern analysis.

Analyze ALL available data — session notes, daily scores, commitments, immunity maps, stakeholder data. Produce:

## Pattern Report

**Commitment Completion Rate:** X%

**Recurring Theme:** [What keeps coming up across sessions]

**Avoidance Pattern:** [What keeps getting deflected]

**Immunity Map Status:** [Progress on big assumptions]

**Daily Score Insight:** [What the numbers show — trends, correlations, drops]

**Energy Pattern:** [Relationship between time/energy and coaching themes]

**The Question:** [One pointed question from the patterns — the one Kris probably doesn't want to hear]

Keep under 300 words. Dense, not verbose.`;

const DERAILERS_PROMPT = `Facilitate a Goldsmith 20 Derailers assessment.

Present each derailer one at a time. Ask for a 1-5 rating:
1=Never | 2=Rarely | 3=Sometimes | 4=Often | 5=This is me

For any rated 4-5, go deeper:
- Evidence?
- Who would notice change?
- What does this behavior protect?
- What part of you (IFS) needs this?

At the end, provide:
- Completed derailers table
- Top 2-3 to address
- Suggested behavioral experiment

Start with Derailer #1: Winning too much.`;

const THREE_SIXTY_PROMPT = (area?: string) => `Facilitate a self-administered 360 assessment.

${area ? `Development area: "${area}"` : 'Ask what development area to assess.'}

Guide through 5 perspectives:
1. Your perspective — "How do you see yourself on this?"
2. Best direct report — "How would someone who respects your leadership describe you?"
3. Most skeptical peer — "How would a colleague who finds you difficult describe you?"
4. Your manager — "How would your boss describe you?"
5. Someone who left — "How would someone who left your team describe you?"

Then process gaps:
- Biggest gaps between perspectives?
- Most resistant to which perspective?
- "What if the skeptical perspective was accurate?"

The gap between self-perception and others' perception IS the blind spot.

Start with the first perspective.`;
