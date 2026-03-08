# Anti-Slop Reference — What to Avoid and What to Do Instead

AI-generated design has a house style. It's recognizable within seconds: safe, polished,
and utterly forgettable. This reference exists to break that pattern.

Read this before every exploration round. Every direction you generate must clear this bar.

---

## The AI Design Fingerprint

These patterns appear so frequently in AI-generated UI that they've become visual shorthand
for "a machine made this." Any one alone might be fine — it's the clustering that signals
slop.

### Typography Slop

| Avoid | Why It's Slop | Do Instead |
|-------|--------------|------------|
| Inter | Default of defaults. Says "I didn't choose a font." | Pick a font with personality. DM Sans, Outfit, Source Serif 4, Fraunces, JetBrains Mono — anything deliberate. |
| Roboto | Same energy as Inter but for Android ecosystem | See above |
| Arial / Helvetica | System defaults | Never in 2025+. Use Switzer if you want neutral sans. |
| Instrument Serif | The #1 AI-serif. Claude and GPT both converge on it obsessively. | Lora, Crimson Pro, Literata, Newsreader, Fraunces — the serif world is vast. |
| Space Grotesk | Another AI magnet. It's a fine font, but if Claude picks it unprompted, that's the signal. | Outfit, General Sans, Satoshi, Cabinet Grotesk, Clash Display. |
| Poppins | Startup template ubiquity | Plus Jakarta Sans, Nunito Sans, Figtree, Geist. |
| Montserrat | Template-kit energy | See geometric sans alternatives in parametric-axes.md |

**The font test:** If you've seen the font in 3+ AI demos this week, pick something else.

### Color Slop

| Avoid | Why It's Slop | Do Instead |
|-------|--------------|------------|
| Purple-to-blue gradient on white | THE AI color scheme. Instantly recognizable. | If you want gradients, use unexpected hue pairs: amber→rose, teal→sage, slate→warm-gray. Or skip gradients entirely. |
| Default Tailwind palette | `blue-500`, `purple-600`, etc. without customization | Define custom colors in your Tailwind config. Real brands have specific colors, not utility defaults. |
| Indigo/violet as primary accent | AI's favorite "tech" color | Try warm accents (amber, coral, terracotta), unexpected accents (sage, teal, burgundy), or monochrome. |
| Rainbow gradient text | Played out since 2023 | If you want color in text, use a single accent or duotone. |
| Gray-50 backgrounds with white cards | The SaaS starter kit look | Try warm off-whites (stone-50, amber-50), tinted backgrounds, or go fully dark. |

### Layout Slop

| Avoid | Why It's Slop | Do Instead |
|-------|--------------|------------|
| Hero → 3 feature cards → CTA → Footer | The "SaaS landing page" skeleton | Break the formula. Lead with a statement. Use asymmetry. Scroll into something unexpected. |
| Equal-width card grid with rounded corners | Every dashboard, every time | Vary card sizes. Use hard edges. Try non-card containers. Or no containers at all. |
| 12px border-radius on everything | The "friendly" default | Commit to sharp (0px) OR generous (24px+). Or mix strategically. |
| Centered everything | Symmetry is safe but boring | Left-align headlines. Right-float images. Let content breathe asymmetrically. |
| Icon + heading + paragraph × 3 | The features trifecta | One big illustration. A comparison table. A scrolling demo. Narrative paragraphs. Anything with more imagination. |

### Component Slop

| Avoid | Why It's Slop | Do Instead |
|-------|--------------|------------|
| Soft drop shadows on cards | `shadow-md` everywhere. The "floating" look that means nothing. | Use borders. Use background contrast. Use NO elevation. Or use dramatic shadows (hard-offset, colored). |
| Pill-shaped buttons | The "modern" default | Sharp rectangles. Underlined text links. Full-width blocks. Ghost buttons with heavy borders. |
| Gradient buttons | Especially blue-to-purple | Solid colors with strong hover states. Text-only CTAs. Buttons that change shape on hover. |
| Hamburger menu on desktop | Hides navigation lazily | Show the nav. Use a sidebar. Use a command palette. |
| Stock avatar circles in testimonials | Generic trust signals | Skip faces entirely. Use typography. Use company logos. Use pull quotes with dramatic formatting. |
| Excessive iconography | An icon for every feature, all from the same pack | Use fewer, larger icons. Or no icons. Or custom illustrations. Or just words. |

### Motion Slop

| Avoid | Why It's Slop | Do Instead |
|-------|--------------|------------|
| Fade-up on scroll (everything) | Every element fading in from below, identical timing | Vary: some slide left, some scale up, some just appear. Or choreograph a real sequence. Or use no scroll animation at all. |
| `transition-all duration-300` | The "animate everything" approach | Be specific about what transitions and why. Not everything needs to move. |
| Bouncing arrows/chevrons | "Scroll down!" signals | If users need to be told to scroll, the content above isn't compelling enough. |
| Parallax for decoration | Background moving slower than foreground, no purpose | If parallax, make it serve the narrative. Otherwise, skip it. |

---

## The Deeper Problem

Slop isn't just about specific fonts or colors — it's about a pattern of non-commitment.
AI defaults to the center of the design space: moderately rounded, moderately colored,
moderately spaced, moderately animated. Everything is "nice" and nothing is memorable.

**The antidote is commitment.** Pick a direction and push it further than feels comfortable:

- If it's minimal, make it REALLY minimal. One font, one size scale, no color.
- If it's dense, make it genuinely information-rich. Pack it with real data.
- If it's bold, make it confrontational. Giant type. Clashing colors. Broken grids.
- If it's elegant, make it precious. Meticulous spacing. Subtle animation. Perfect typography.

The worst outcome isn't a bad direction — it's a forgettable one.

---

## Self-Check Rubric

Before presenting any exploration, ask:

1. **Could I describe this to someone without showing it?** If your description sounds
   like it could apply to any of the 8 directions, you haven't differentiated enough.
2. **Would a human designer be embarrassed to put this in their portfolio?** If yes,
   push harder.
3. **Have I seen this exact combination in an AI demo?** If yes, change at least 2 axes.
4. **Did I actually choose the fonts, or did I grab the first thing that came to mind?**
   If you can't explain WHY this specific font fits this specific concept, you didn't choose.
5. **Is the color palette doing work, or just existing?** Color should encode meaning,
   create hierarchy, or set a specific mood — not just "look nice."
