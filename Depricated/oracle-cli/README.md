# Oracle CLI

Elite AI executive coaching in your terminal. Replicates $20K/month coaching quality through 20+ evidence-based behavioral change frameworks, persistent pattern tracking in Obsidian, and Shadowfax system integration.

## Quick Start

```bash
# Clone and install
cd ~/oracle-cli
npm install

# Configure (Obsidian vault path, API key, SAM path)
npx tsx src/index.ts init

# Migrate existing SAM/oracle data to Obsidian
npx tsx src/index.ts migrate

# Start a coaching session
npx tsx src/index.ts session
```

## Install Globally

```bash
npm run build
npm link

# Now use from anywhere:
oracle session
oracle tactical
oracle daily
```

## Commands

### Sessions
```bash
oracle session           # Interactive session chooser
oracle tactical          # Weekly check-in (20 min)
oracle immunity          # Immunity to Change deep work (45-60 min)
oracle decision "topic"  # Decision coaching (30 min)
oracle feedback          # Process feedback received (45 min)
oracle retro "Q1 2026"   # Retrospective (30 min)
oracle stakeholders      # Relationship audit (30 min)
oracle open              # Whatever needs attention
oracle intake            # Full baseline (45-60 min)
```

### Daily
```bash
oracle daily             # Active Questions — rate effort 1-10 (3 min)
oracle accountability    # Commitment status check
```

### Analysis
```bash
oracle patterns          # Cross-session pattern analysis
oracle derailers         # Goldsmith 20 Derailers assessment
oracle 360 "listening"   # Self-administered 360
oracle status            # Recent activity summary
```

### Setup
```bash
oracle init              # First-time configuration
oracle migrate           # Import data from SAM/oracle
```

## During a Session

- Type your response and press Enter
- `/end` — End session and generate notes (saved to Obsidian)
- `/save` — Save partial transcript
- `/help` — Show commands

## Architecture

```
~/.oracle/config.json        # Your configuration
~/Obsidian/Oracle/            # All coaching data (in your vault)
├── Baseline.md               # Leadership profile
├── Patterns.md               # Cross-session patterns
├── Development Focus.md      # Current growth area
├── Guardrails.md             # If-Then rules
├── Active Questions.md       # Daily question config
├── Commitments.md            # Active + completed
├── Sessions/                 # Session notes by date
├── Immunity Maps/            # Change maps
├── Stakeholders/             # Relationship profiles
├── Daily Scores/             # Monthly CSVs
└── Pattern Reports/          # Generated analyses
~/sam/                        # SAM/Shadowfax data (read-only)
```

## Frameworks

Oracle integrates 20 evidence-based frameworks:

1. Stakeholder-Centered Coaching (Marshall Goldsmith)
2. Immunity to Change (Kegan & Lahey)
3. Intentional Change Theory (Richard Boyatzis)
4. The Coaching Habit (Michael Bungay Stanier)
5. Development Pipeline (David Peterson)
6. Radical Self-Inquiry (Jerry Colonna)
7. Adaptive Leadership (Ronald Heifetz)
8. ACT (Acceptance & Commitment Therapy)
9. Motivational Interviewing
10. Internal Family Systems (IFS)
11. Clean Language (David Grove)
12. Solution-Focused Brief Coaching
13. Gestalt: Paradoxical Theory of Change
14. Nonviolent Communication (Marshall Rosenberg)
15. Time to Think (Nancy Kline)
16. Polarity Management (Barry Johnson)
17. SCARF Model (David Rock)
18. Adult Development Theory (Kegan/Torbert)
19. Double-Loop Learning (Chris Argyris)
20. Narrative Coaching (David Drake)

## Shadowfax Integration

Oracle reads from your SAM system for contextual awareness:
- Energy zone detection (time-based from your patterns)
- Health baselines (HRV, ferritin, sleep)
- Recent work briefings
- Time-of-day awareness (evening guard, late-night detection)

## Requirements

- Node.js 18+
- Anthropic API key
- Obsidian vault (with Obsidian Sync)
