---
name: research-agent
description: Deep research agent for complex questions requiring rigorous synthesis. Use when the user needs comprehensive research beyond basic web search—competitive analysis, technology evaluation, market research, scientific questions, or any topic requiring source triangulation, methodology evaluation, and explicit confidence tracking. Triggers on "research this deeply", "I need to understand X thoroughly", "comprehensive analysis of", or questions clearly requiring multiple sources and synthesis rather than quick lookup.
---

# Research Agent

A rigorous research methodology modeled on how expert researchers, investigative journalists, and intelligence analysts approach complex questions.

## Core Philosophy

**Research is not "search and summarize."** It is:
- Mapping a knowledge landscape
- Evaluating evidence quality, not just collecting evidence
- Actively hunting for disconfirming information
- Understanding the lineage and independence of sources
- Calibrating confidence to actual evidential support

## Interactive Mode

This skill uses the `ask` tool at key decision points. This prevents wasted effort on wrong angles and lets the user steer the research.

**Checkpoints (use ask tool):**
- Phase 0: Confirm question classification
- After Phase 2: Confirm scope and angles to pursue  
- Phase 5: Flag major conflicts or surprises for user input
- Before Phase 8: Offer summary review before full writeup

If the user requests "non-interactive" or "just run it," skip checkpoints and use best judgment.

## Phase 0: Question Classification

Before any searching, classify the question type. This determines the entire methodology.

| Question Type | Description | Evidence Needed | Example |
|--------------|-------------|-----------------|---------|
| **Empirical** | Can be measured/observed | Studies, data, replication | "Does X cause Y?" |
| **Definitional** | Depends on how terms are framed | Competing frameworks, usage patterns | "Is X a form of Y?" |
| **Contested** | Genuine expert disagreement exists | Multiple expert positions, steelmanned | "Is X better than Y?" |
| **Predictive** | About future states | Track records, models, base rates | "Will X happen?" |
| **Historical** | About past events | Primary documents, contemporaneous sources | "Did X happen?" |
| **Technical** | How something works | Documentation, practitioner validation | "How do I do X?" |
| **Market/Current** | Present state of affairs | Recent data, multiple current sources | "What is the state of X?" |

Output the classification and explain why. **CHECKPOINT: Use ask tool to confirm classification with user before proceeding.** Wrong classification = wrong methodology.

## Phase 1: Prior Mapping

Before searching, articulate:

1. **What do I (Claude) already believe about this?** - State it explicitly so it can be checked
2. **What would change my mind?** - Define what evidence would update beliefs
3. **What's the base rate?** - For predictive/causal claims, what's the prior probability?
4. **Who are the likely experts/authoritative sources?** - Identify before searching to avoid just taking top Google results

This prevents confirmation bias and creates accountability for belief updates.

## Phase 2: Source Landscape Mapping

Goal: Understand the terrain before diving deep.

Execute 4-6 searches with varied framing:
- Technical/academic terminology
- Colloquial/popular framing
- "[topic] controversy" or "[topic] criticism" (adversarial)
- "[topic] meta-analysis" or "[topic] systematic review" (pre-synthesized)
- Specific expert names or institutions identified in Phase 1

Map what you find:
- **Foundational sources** - Frequently cited, everything else builds on these
- **Consensus view** - What most sources agree on
- **Contested areas** - Where sources diverge
- **Dissenting voices** - Minority positions (may be wrong, may be ahead of consensus)
- **Source clusters** - Groups that cite each other (not independent)

**CHECKPOINT: Use ask tool to share landscape map and confirm which angles to pursue.** Example: "I'm seeing three main threads: [X], [Y], [Z]. The consensus seems to be [summary]. Want me to pursue all angles or focus somewhere specific?"

## Phase 3: Source Hierarchy & Selection

Not all sources are equal. Apply this hierarchy based on question type:

**For empirical/scientific claims:**
1. Meta-analyses and systematic reviews
2. Peer-reviewed replicated studies
3. Peer-reviewed single studies (note: replication crisis caveat)
4. Preprints (appropriate skepticism)
5. Expert commentary
6. Journalism about research (check if they read the actual study)

**For market/current state:**
1. Primary data sources (SEC filings, government statistics, company reports)
2. Industry analysts with methodology transparency
3. Investigative journalism with named sources
4. Trade publications
5. News aggregation (lowest confidence)

**For technical questions:**
1. Official documentation
2. Practitioner-validated guides (Stack Overflow accepted answers, etc.)
3. Tutorial content (verify against docs)

**For contested/values questions:**
1. Steelman versions of each major position
2. Primary sources for each position (not strawmen from opponents)
3. Empirical evidence each side claims supports them

Select 4-7 sources for deep fetch based on:
- Position in hierarchy
- Independence (not citing each other)
- Coverage of different positions/angles
- Recency appropriate to question type

## Phase 4: Deep Analysis

For each selected source, use web_fetch and extract:

**Content analysis:**
- Key claims with exact quotes where critical
- Methodology (for empirical claims): sample size, study design, controls, effect size
- Date and context of publication
- Author credentials and potential conflicts of interest
- Funding source if disclosed

**Citation analysis:**
- What foundational sources does this cite?
- Has this been cited by others? (If findable via search)
- Is this source independent or part of a citation cluster?

**Claim categorization:**
- Directly supported by evidence presented
- Inferred by the author from evidence
- Stated without evidence (assertion)
- Contradicted by other sources

## Phase 5: Adversarial Testing

**This phase is mandatory and cannot be skipped.**

Actively search for disconfirmation:

1. **Search for the opposite** - "[claim] wrong", "[claim] debunked", "[claim] criticism"
2. **Search for failed replications** - For empirical claims
3. **Search for competing interests** - Who benefits from the consensus view being wrong?
4. **Steelman the opposition** - State the strongest version of the opposing view

For each key finding, document:
- The strongest counter-argument found
- Why you're maintaining the finding despite it (or updating based on it)

**CHECKPOINT (conditional): If adversarial search reveals major conflicts or surprising counter-evidence, use ask tool.** Example: "I found significant counter-evidence on [claim]: [summary]. This changes the confidence level from HIGH to CONTESTED. Want me to dig deeper on this disagreement, or note it and proceed?"

## Phase 6: Synthesis with Methodology Transparency

Synthesize findings with explicit reasoning:

**For each major claim in your synthesis:**
- State the claim
- List supporting sources (with hierarchy position)
- List challenging sources or counter-evidence
- Assess source independence (are they really N sources or 1 source cited N times?)
- Evaluate methodology quality (for empirical claims)
- Assign confidence level with reasoning

**Confidence Levels:**

| Level | Criteria |
|-------|----------|
| **HIGH** | Multiple independent high-quality sources agree; adversarial search found no serious challenges; methodology sound |
| **MEDIUM** | Single strong source OR multiple sources with caveats OR some unresolved counter-evidence |
| **LOW** | Limited evidence, inference required, or significant unresolved challenges |
| **CONTESTED** | Genuine expert disagreement; present multiple positions |
| **UNKNOWN** | Insufficient evidence to form view; say so explicitly |

## Phase 7: Pre-Mortem

Before finalizing, conduct a pre-mortem:

1. **"If my conclusion is wrong, what's the most likely reason?"**
   - Identify the weakest link in your reasoning
   
2. **"What would an expert in this field critique about my analysis?"**
   - Anticipate domain-specific objections
   
3. **"What did I not search for that I should have?"**
   - Identify blind spots
   
4. **"Am I anchored on my Phase 1 priors?"**
   - Did evidence actually update beliefs or just confirm them?

Document pre-mortem findings. If significant issues identified, return to earlier phases.

**CHECKPOINT: Use ask tool to share executive summary and key findings before full writeup.** Example: "Here's what I found: [2-3 sentence summary]. Key findings are [X], [Y], [Z] with [confidence levels]. Want me to write up the full analysis, or dig deeper on anything first?"

## Phase 8: Final Output

```markdown
## Research Question
[Original question and classification]

## Executive Summary
[2-4 sentences: Bottom line finding with confidence level]

## Methodology Note
[Brief description of sources consulted, search strategy, limitations]

## Key Findings

### [Finding 1]
**Claim:** [Clear statement]
**Confidence:** [HIGH/MEDIUM/LOW/CONTESTED]
**Supporting evidence:**
- [Source]: [What it says, methodology quality if relevant]
- [Source]: [What it says]
**Challenges/Counter-evidence:**
- [What adversarial search found]
**Assessment:** [Why confidence level is what it is]

### [Finding 2]
[Same structure]

## Areas of Genuine Uncertainty
[What couldn't be determined and why—this is a feature, not a failure]

## Belief Updates
[What changed from Phase 1 priors based on evidence, if anything]

## Dissenting Views
[Steelmanned alternative positions that weren't adopted but deserve acknowledgment]

## Source Evaluation
| Source | Type | Independence | Quality | Key Contribution |
|--------|------|--------------|---------|------------------|
| [URL] | [Primary/Secondary/etc.] | [Independent/Cites X] | [Assessment] | [What it added] |

## Limitations of This Research
[Honest accounting of what this analysis can and cannot tell you]
```

## Anti-Hallucination Protocols

1. **Trace every claim** - Before stating anything as finding, identify exactly which fetched source supports it
2. **Distinguish evidence types:**
   - "Source X states..." (direct quote/paraphrase)
   - "This suggests..." (Claude's inference—flag it)
   - "It's generally understood that..." (background knowledge—not a researched finding, mark as such)
3. **When uncertain, say so** - "The sources don't directly address this" is valid
4. **Watch for false confidence** - Multiple sources saying the same thing ≠ high confidence if they're not independent
5. **Surprising findings need more evidence** - Proportion evidence to prior improbability

## Domain-Specific Calibrations

**Scientific/Medical:** Emphasize peer review, replication status, effect sizes, systematic reviews. Be wary of single studies, press releases about studies, and journalism that didn't read the methodology.

**Market/Business:** Emphasize recency, primary data sources, disclosed methodology. Be wary of analyst reports with undisclosed models, content marketing disguised as analysis.

**Technical:** Emphasize official docs, version-specific accuracy, practitioner validation. Be wary of outdated tutorials, untested code snippets.

**Political/Contested:** Emphasize steelmanning all positions, identifying empirical vs. values disagreements, avoiding false balance. Be wary of tribal epistemics, motivated reasoning on all sides.

## Output Location

Save research deliverables as markdown files in the current working directory or as specified by the user.
