# Parametric Axes — Deep Reference

Each axis represents a fundamental dimension of design variation. Real exploration means
moving along multiple axes simultaneously.

---

## 1. Layout Structure

How is space organized on the page?

| Value | Description | When It Works |
|-------|-------------|---------------|
| **Single Column** | Content flows vertically, full width or constrained | Long-form reading, mobile-first, narrative flow |
| **Asymmetric Grid** | Unequal columns, deliberate imbalance | Editorial, portfolios, anything needing visual tension |
| **Horizontal Scroll** | Content extends sideways | Galleries, timelines, breaking user expectations |
| **Modular/Card Grid** | Repeating units in a grid | Dashboards, catalogs, feeds — but easy to make generic |
| **Overlapping/Layered** | Elements stack with z-index, breaking containment | Immersive, creative, high-impact hero sections |
| **Full-Bleed** | Content runs edge-to-edge, no margins | Photography-heavy, immersive, cinematic |
| **Split-Screen** | Two (or more) distinct vertical/horizontal zones | Comparison, dual-purpose pages, before/after |
| **Dashboard/Panel** | Fixed sidebar/header with scrollable content area | Data apps, admin panels, tool interfaces |
| **Masonry** | Variable-height items in columns | Image galleries, social feeds, content discovery |
| **Centered Stage** | Single focal element with surrounding context | Hero moments, single-product pages, focused actions |

**How to vary:** Don't just change column count. Change the fundamental spatial model.
A horizontal-scroll timeline and a vertical card grid aren't variations of each other —
they're different spatial philosophies.

---

## 2. Information Hierarchy

What element dominates the visual field? What do users see first?

| Value | Description | Character |
|-------|-------------|-----------|
| **Typography-Led** | Text IS the design. Headlines as art. | Editorial, confident, intellectual |
| **Data-Led** | Numbers/charts/metrics dominate | Analytical, quantitative, dashboard-like |
| **Image-Led** | Photography or illustration drives everything | Emotional, immersive, lifestyle |
| **Action-Led** | CTAs and interactive elements are primary | Transactional, conversion-focused |
| **Narrative/Sequential** | Story unfolds in order, guided reading | Onboarding, case studies, scroll stories |
| **Spatial/Wayfinding** | Navigation/orientation is primary concern | Complex apps, multi-section sites |

**How to vary:** Same content, completely different emphasis. A pricing page can be
typography-led (giant price numbers as design elements), data-led (comparison table),
or narrative (story of why each tier exists).

---

## 3. Interaction Model

How do users engage with the interface?

| Value | Description | Feel |
|-------|-------------|------|
| **Scroll-Reveal** | Content appears as user scrolls | Cinematic, guided, lean-back |
| **Direct Manipulation** | Drag, resize, reorder, toggle | Powerful, tactile, tool-like |
| **Progressive Disclosure** | Expand/collapse, tabs, accordions | Structured, manageable, layered |
| **Command-Driven** | Keyboard shortcuts, command palette, search-first | Power-user, efficient, developer-like |
| **Spatial/Canvas** | Free-form arrangement on infinite canvas | Creative, flexible, whiteboard-like |
| **Card-Sort/Triage** | Swipe, stack, categorize items | Decision-making, curation, inbox-zero |
| **Conversational** | Chat-based, step-by-step prompts | Guided, accessible, friendly |
| **Hover-Rich** | Substantial interactions on hover/focus | Desktop-oriented, information-dense, explorable |

**How to vary:** Interaction model changes the fundamental relationship between user and
interface. A settings page with direct manipulation (drag sliders, toggle switches inline)
feels completely different from one with progressive disclosure (expand sections) or
command-driven (search for the setting you want).

---

## 4. Typography System

What personality does the type carry?

| Value | Example Families | Character |
|-------|-----------------|-----------|
| **Humanist Sans** | Source Sans 3, Fira Sans, Noto Sans | Warm, approachable, readable |
| **Geometric Sans** | DM Sans, Outfit, Plus Jakarta Sans | Modern, clean, mathematical |
| **Neo-Grotesque** | Söhne*, Neue Haas Grotesk*, Switzer | Neutral precision, Swiss design |
| **Serif-Forward** | Lora, Crimson Pro, Fraunces | Literary, authoritative, editorial |
| **Slab Serif** | Zilla Slab, Roboto Slab, Arvo | Strong, grounded, industrial |
| **Monospaced** | JetBrains Mono, IBM Plex Mono, Fira Code | Technical, systematic, code-adjacent |
| **Display-Heavy** | Clash Display, Cabinet Grotesk, General Sans | Bold statements, impact, poster-like |
| **Handwritten/Organic** | Caveat, Patrick Hand, Kalam | Personal, casual, human |
| **Mixed System** | Serif headlines + sans body, or vice versa | Contrast, editorial sophistication |

*Asterisked fonts may require licensing — use Google Fonts alternatives where possible.

**How to vary:** Typography isn't just "pick a different font." It's the entire system —
size scale, weight distribution, line-height, letter-spacing, how type interacts with
space. A monospaced system with tight tracking feels industrial. The same layout with
a humanist serif at generous line-height feels literary.

**Banned fonts (AI-slop indicators):**
- Inter, Roboto, Arial, Helvetica (default/generic)
- Instrument Serif (massively overused by AI)
- Space Grotesk (Claude converges on this)
- Poppins (ubiquitous startup aesthetic)
- Montserrat (overused in every template)

---

## 5. Density & Spacing

How much information per square inch? How does whitespace function?

| Value | Description | Feel |
|-------|-------------|------|
| **Airy/Editorial** | Generous whitespace, large type, few elements per screen | Luxurious, calm, focused |
| **Balanced** | Standard spacing, comfortable reading | Professional, conventional |
| **Compact/Dense** | Tight spacing, smaller type, more visible at once | Efficient, data-rich, power-user |
| **Variable** | Density changes across sections (airy hero → dense content) | Dynamic, editorial, narrative |
| **Extreme Minimal** | Almost empty, radical negative space | Dramatic, gallery-like, statement |

**How to vary:** Density affects cognition. Dense UIs feel powerful but demanding.
Airy UIs feel calm but can waste the user's time. The right density depends on use case,
not just aesthetics.

---

## 6. Color Strategy

How does color function in the design?

| Value | Description | Feel |
|-------|-------------|------|
| **Monochromatic** | Single hue in multiple values | Sophisticated, restrained, focused |
| **High-Contrast Duotone** | Two bold colors against each other | Striking, graphic, memorable |
| **Muted Earth** | Warm neutrals, sage, terracotta, sand | Organic, grounded, calm |
| **Bold Primaries** | Saturated red/blue/yellow | Confident, playful, Bauhaus-inspired |
| **Dark-Mode-Native** | Designed dark-first, not inverted | Technical, immersive, modern |
| **Light & Luminous** | White/cream with subtle warm accents | Clean, open, Scandinavian |
| **Accent-Only** | Mostly neutral with one sharp accent color | Professional, controlled, elegant |
| **Chromatic Gradients** | Gradient transitions between distinct hues | Dynamic, energetic, contemporary |

**How to vary:** Color strategy isn't "pick a palette." It's how color functions —
does it encode information? Create hierarchy? Set mood? Signal interactivity?

**Avoid:** Purple-to-blue gradients on white (the single most common AI-generated
color scheme). Also avoid default Tailwind palette colors without customization.

---

## 7. Motion Philosophy

What role does animation play?

| Value | Description | Feel |
|-------|-------------|------|
| **Stillness** | No animation at all | Printed, serious, timeless |
| **Functional Only** | Transitions that communicate state changes | Professional, purposeful |
| **Choreographed** | Orchestrated entrance/exit sequences | Polished, cinematic, curated |
| **Physics-Based** | Spring animations, momentum, friction | Natural, tactile, alive |
| **Cinematic** | Parallax, slow reveals, dramatic timing | Immersive, storytelling |
| **Playful** | Bouncy, surprising, delightful micro-interactions | Fun, friendly, engaging |
| **Glitch/Mechanical** | Hard cuts, instant snaps, digital artifacts | Raw, technical, brutalist |

**How to vary:** Motion sets emotional tone. The same layout with spring-physics
animations feels alive and friendly; with hard cuts it feels brutalist and technical;
with no animation at all it feels editorial and printed.

---

## 8. Visual Metaphor

What real-world object or environment does this interface evoke?

| Value | Examples | Character |
|-------|----------|-----------|
| **Newspaper/Broadsheet** | Column layout, mastheads, justified text | Authoritative, informational |
| **Control Panel** | Dials, meters, status indicators, dense controls | Technical, operational |
| **Gallery Wall** | Framed items on negative space, curated arrangement | Artistic, selective |
| **Notebook/Journal** | Lined backgrounds, handwritten elements, margins | Personal, thoughtful |
| **Blueprint/Schematic** | Grid lines, technical annotation, precise measurement | Precise, engineered |
| **Storefront/Window Display** | Products on pedestals, dramatic lighting, staging | Commercial, luxurious |
| **Terminal/Console** | Monospaced, green-on-black, command prompts | Developer, hacker, raw |
| **Magazine Spread** | Full-bleed images, pull quotes, art direction | Editorial, lifestyle |
| **Dashboard/Cockpit** | Gauges, real-time data, status lights | Operational, monitoring |
| **Library/Archive** | Catalogued, indexed, searchable, scholarly | Organized, deep, reference |

**How to vary:** Metaphor gives users an unconscious framework for understanding the
interface. It changes expectations about how things work, not just how they look.

---

## Combining Axes

The power is in combinations. Some pairings create expected results (Terminal metaphor +
Monospaced type = predictable). The interesting explorations come from unexpected
combinations:

- **Newspaper layout + Physics-based motion** — editorial content that feels alive
- **Dashboard density + Serif typography** — data-heavy UI with literary gravitas
- **Gallery metaphor + Command-driven interaction** — curated content you navigate by keyboard
- **Horizontal scroll + Monochromatic color** — dramatic, cinematic, focused journey
- **Modular grid + Extreme minimal density** — few large cards with vast whitespace

Push for combinations that create productive tension between their components.
