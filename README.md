# Sam: Design Manager Operating System

Named after Samwise Gamgee — the loyal companion who carries the mission forward when Frodo cannot.

---

## Installation

```bash
# Clone to home directory
cd ~ && git clone https://github.com/krispuckett/sam.git

# Install the Claude Code skill
cp ~/sam/sam-skill.md ~/.claude/commands/sam.md

# (Optional) Install Raycast extension
cd ~/sam/raycast-extension && npm install && npm run dev
```

---

## Quick Start

```bash
# Open today's briefing (via /sam in Claude Code)
sam

# Run 1:1 prep
sam 1:1 [name]

# Weekly review
sam weekly

# Team health check
sam team
```

---

## Directory Structure

```
~/sam/
├── briefings/          # Daily work logs
├── team/               # Direct report profiles
├── one-on-ones/        # 1:1 session notes
├── stakeholders/       # Work relationships
├── projects/           # Active work tracking
├── critiques/          # Design review notes
├── domain/             # Learning tracker
├── oracle/             # Work coaching layer
├── rhythms/            # System documentation
├── reviews/            # Weekly/monthly reviews
├── decisions/          # Decision log
└── inbox/              # Quick capture
```

---

## Core Rhythms

### Daily
1. **Morning**: Open briefing, set energy zone, define ONE Thing
2. **During day**: Capture observations, log 1:1s
3. **Evening**: Close briefing, note what shipped/carried

### Weekly
- **Monday**: Planning, manager 1:1
- **Tue-Thu**: 1:1s with reports, critiques, stakeholder meetings
- **Friday**: Weekly review, clear inbox

### Monthly
- Team health review
- Stakeholder relationship review
- Quality review (Essential Journeys)
- Career conversation with one report

---

## First 90 Days

| Phase | Days | Focus |
|-------|------|-------|
| LEARN | 1-30 | Understand team, build relationships, resist changing things |
| ALIGN | 31-60 | Validate hypotheses, quick wins, draft priorities |
| BUILD | 61-90 | Execute, establish rhythm, ship something |

---

## Sam's Voice

A fusion of three energies:

- **Samwise**: Loyalty, practical focus, steady presence through the long road
- **Aragorn**: Earned authority, protective of those you lead, strength that serves
- **Gandalf**: Wisdom that sees the bigger picture, guides without coddling, hard truths

**Tone**: Direct, not gentle. Wise, not cheerful. Will challenge you, not validate you.

---

## Watchtower Integration

Sam manages work. Watchtower manages the whole person. They stay separate but complementary.

**Energy handoff**: Raycast bridge syncs energy zone across machines
**Tasks**: Todoist serves as shared task layer (both systems read same API)

| Watchtower | Sam |
|------------|-----|
| Personal machine | Stripe machine |
| Health tracking | Energy zone input only |
| Personal life | Work focus |
| Full briefings | Work briefings |

---

## Key Commands

| Command | Purpose |
|---------|---------|
| `sam` | Main menu / open briefing |
| `sam 1:1 [name]` | Prep for 1:1 with report |
| `sam team` | Team health dashboard |
| `sam weekly` | Run weekly review |
| `sam critique` | Log design critique |
| `sam oracle` | Work coaching session |

---

## Getting Help

This system runs through Claude Code with the `sam` skill. Just ask.
