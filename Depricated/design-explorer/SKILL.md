---
name: design-explorer
description: >
  Parametric design exploration that generates 8 genuinely different design directions
  for any UI challenge — like Crazy Eights but with principal-designer-level divergence.
  Forces breadth over depth: instead of one "good enough" direction, produces 8 fundamentally
  different approaches varying across layout, typography, interaction model, and visual language.
  Includes a review UI for comparing all directions at a glance.

  Use this skill whenever the user wants to explore multiple design directions, see options
  before committing, run a crazy eights exercise, generate design variations, compare
  different approaches, ideate broadly, or says things like: "show me some options,"
  "explore different directions," "I want to see multiple approaches," "what are some ways
  to design this," "give me variations," "diverge on this," "brainstorm layouts," "I don't
  want to commit to one direction yet," "explore the design space," "parametric exploration,"
  or "let's do crazy eights." Also triggers on any design brief where breadth of exploration
  would clearly help — landing pages, dashboards, settings pages, onboarding flows, pricing
  pages, profile pages, or any UI where there are many valid approaches.

  NOT for: fixing a specific bug, implementing a known design spec, or when the user already
  has a clear direction and just wants execution. Also not for backend work or API design.
---

# Design Explorer — Parametric Crazy Eights

This skill forces genuine divergence in design exploration. When a designer asks for
"options" or "variations," the default AI behavior is to produce 8 surface-level reskins
of the same underlying idea. That's useless. This skill teaches you to think like a
principal designer running a structured exploration — varying the fundamental axes of
the design, not just the color palette.

## Why This Exists

Real design exploration means questioning assumptions. A settings page doesn't have to
be a form. A dashboard doesn't have to be a card grid. A pricing page doesn't have to
be three columns. The best designers know this instinctively — they explore radically
different structures before converging. This skill encodes that instinct.

## The Process

### Step 1: Understand the Brief

Before generating anything, clarify:
- **What problem does this UI solve?** (Not "what does it look like" — what does it DO?)
- **Who uses it?** (Power users? First-time visitors? Mobile-first?)
- **What's the project's existing tech stack?** (Default: React + Vite + TypeScript + Tailwind v4)
- **Are there brand constraints?** (Existing design system, colors, fonts?)
- **What's the emotional register?** (Professional, playful, luxurious, utilitarian?)

If the user hasn't specified these, make reasonable assumptions based on context and state
them explicitly before proceeding.

### Step 2: Choose Your Parametric Axes

Every design varies across multiple axes simultaneously. For each exploration round, pick
6-8 axes from the reference file (`references/parametric-axes.md`) and define the range
for each axis based on the brief.

**The critical rule:** Each of your 8 explorations must vary across at least 3 axes
simultaneously. Changing only color or only typography produces "reskins," not explorations.

Quick reference (read the full file for depth):
- **Layout Structure** — How is space organized? (single column, asymmetric grid, horizontal scroll, modular, overlapping, full-bleed, split-screen, dashboard)
- **Information Hierarchy** — What dominates? (typography-led, data-led, image-led, action-led, narrative)
- **Interaction Model** — How do users engage? (scroll-reveal, direct manipulation, progressive disclosure, command-driven, spatial, card-sort)
- **Typography System** — What personality does type carry? (humanist, geometric, monospaced, serif-forward, display-heavy, mixed)
- **Density & Spacing** — How much breathing room? (airy/editorial, balanced, compact/data-dense, variable)
- **Color Strategy** — How does color work? (monochromatic, high-contrast duotone, muted earth, bold primaries, dark-mode-native, accent-only)
- **Motion Philosophy** — How does movement function? (stillness, functional transitions, choreographed, physics-based, cinematic)
- **Visual Metaphor** — What real-world thing does this echo? (newspaper, control panel, gallery wall, notebook, blueprint, storefront)

### Step 3: Generate 8 Directions

For each direction, produce:

1. **A name** — evocative, not generic ("The Broadsheet" not "Option 3")
2. **Concept statement** — one sentence describing the core idea
3. **Axis values** — which axes you varied and how
4. **Working code** — a real, runnable implementation (not a mockup)

**Each direction must be genuinely different.** Test yourself: if you described two
directions to someone without showing them, could they tell them apart? If not, they're
too similar. Push harder.

Read `references/anti-slop.md` before generating ANY code. Internalize those constraints.
Every direction must clear the anti-slop bar — no exceptions.

### Step 4: Build the Review UI

After generating all 8 directions, create a review interface so the user can compare them:

1. Read the template at `assets/review-template.html`
2. For each direction, capture a static preview (screenshot or rendered HTML snapshot)
3. Generate the review page with all 8 directions embedded
4. Save to the project directory and open it

The review UI supports:
- **Grid view** — all 8 at a glance (2×4 grid)
- **Detail view** — click to expand any direction
- **Selection** — mark favorites for further development
- **Keyboard navigation** — arrow keys to browse, Enter to select, Escape to return to grid

If generating live previews isn't feasible (e.g., each direction is a full React app),
generate representative static HTML/CSS snapshots that capture the essential character
of each direction. Each snapshot should be a single self-contained HTML file that can
be loaded in an iframe.

### Step 5: Refine

Once the user selects favorites:
- Develop the selected direction(s) into full implementations
- You can combine elements from multiple favorites
- Continue to push for distinctiveness even in refinement

## Integration Notes

**Default stack:** React + Vite + TypeScript + Tailwind CSS v4. Adapt to whatever the
project already uses.

**Typography:** Use Google Fonts or Fontsource. Every direction needs a deliberate font
choice — never fall back to system fonts or generic sans-serifs.

**Animations:** Use Motion (Framer Motion) for React projects, CSS animations for vanilla.
Motion should serve the concept, not decorate it.

**Output structure:** Each direction gets its own directory:
```
explorations/
├── 01-the-broadsheet/
│   ├── index.tsx (or index.html)
│   └── styles.css (if needed)
├── 02-the-control-room/
│   └── ...
├── ...
└── review.html
```

## What "Good" Looks Like

**Good exploration round:**
- Direction 1: Typography-led single column, serif-forward, scroll-reveal, editorial
- Direction 2: Dense data grid, monospaced, direct manipulation, brutalist
- Direction 3: Split-screen with progressive disclosure, humanist type, muted palette
- Direction 4: Card-based modular layout, geometric type, bold primaries, playful
- Direction 5: Full-bleed imagery with overlay text, cinematic motion, dark mode
- Direction 6: Command-palette-driven minimal UI, monochrome, keyboard-first
- Direction 7: Asymmetric overlapping panels, display type, high contrast duotone
- Direction 8: Horizontal scroll narrative, mixed type, earth tones, organic shapes

**Bad exploration round:**
- 8 card grids with different colors
- 8 variations of the same layout with different fonts
- 8 "modern SaaS" pages that blur together
- Anything where the only difference is surface styling

## Reference Files

- `references/parametric-axes.md` — Deep breakdown of each axis with examples and ranges
- `references/anti-slop.md` — Comprehensive list of AI design clichés and what to do instead
- `references/aesthetic-directions.md` — Library of 20+ strong aesthetic directions with visual characteristics

Read anti-slop.md before every generation round. Read the others as needed for inspiration.
