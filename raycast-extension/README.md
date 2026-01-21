# Watchtower Bridge

Raycast extension that bridges Watchtower (personal) and Sam (work) systems.

## Commands

| Command | Shortcut | Description |
|---------|----------|-------------|
| Set Energy Zone | `wt energy` | Set current energy (Green/Yellow/Red) |
| Brain Dump | `wt dump` | Quick capture to inbox |
| Today's Intelligence | `wt today` | Show current state and briefing |
| Quick Reminder | `wt remind` | Create Todoist task |
| Current Peak | `wt now` | Show current peak window (HUD) |

## How It Works

### Energy Sync
Energy zone is stored in Raycast's LocalStorage, which syncs across machines via Raycast account. This allows:
- Personal machine: Set energy after Watchtower briefing
- Stripe machine: Sam can reference energy state

### Brain Dumps
Captures are saved to `~/watchtower/inbox/dumps/` and auto-committed to git if in the watchtower repo.

### Reminders
Uses Todoist API with token from `~/.watchtower/todoist-token`. Default project is Watchtower.

## Installation

```bash
cd ~/watchtower-raycast
npm install
npm run dev
```

Then in Raycast, the extension will appear as "Watchtower Bridge".

## Requirements

- Node.js 18+
- Raycast
- Todoist token at `~/.watchtower/todoist-token` (for reminders)
- Watchtower repo at `~/watchtower` (for brain dumps)
