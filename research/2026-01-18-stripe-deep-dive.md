# Stripe Deep Dive: Preparation for Day 1

**Date:** January 18, 2026
**Purpose:** Comprehensive preparation for joining Stripe as Design Manager
**Start Date:** Tuesday, January 20, 2026
**Reading Time:** ~45 minutes

---

## How to Use This Document

This is structured for a plane ride. Start with the Executive Summary and Glossary to get oriented on terminology. Then read the sections most relevant to your role:

- **For context on what you're joining:** Parts 1-2 (Company, Products)
- **For strategic understanding:** Parts 3-4 (AI Bet, Stablecoin Bet)
- **For your actual job:** Part 5 (Design Organization)
- **For conversations:** Parts 6-7 (Competitive Landscape, Conversation Starters)

---

## Executive Summary

Stripe has evolved from a developer-facing payments API into **the financial operating system for the internet economy**. At $91.5B valuation (secondary markets hit $129B in December 2025), it's the world's most valuable private fintech.

**The core thesis:** Stripe processed **$1.4 trillion** in 2024 (38% YoY growth), achieved its first full year of profitability, and is positioning itself as the foundational infrastructure for two transformative forces Patrick Collison calls "gale-force tailwinds": **AI and stablecoins**.

**Key numbers to know:**

| Metric | Value | Context |
|--------|-------|---------|
| Total Payment Volume (2024) | $1.4T | 38% YoY growth, ~1.3% of global GDP |
| Net Revenue (2024) | ~$5.1B | 28% YoY growth |
| Valuation | $91.5B | Secondary market hit $129B Dec 2025 |
| Employees | ~8,550 | Target was 10,000 by end 2025 |
| Countries | 46 | Expanded to 151 with stablecoin accounts |
| Payment Methods | 125+ | Up from ~50 in 2023 |
| Global Market Share | 20-29% | Second to PayPal's 43% |
| U.S. Market Share | ~45% | Dominant in ecommerce |

**Customer penetration:**
- 50% of Fortune 100
- 80% of Forbes Cloud 100
- 78% of Forbes AI 50
- 62% of Fortune 500

---

## Glossary: Payments Industry Terminology

Before diving in, here's the vocabulary you'll hear constantly. Payments has its own language.

### The Four-Party Model

Every card transaction involves four parties. Understanding this is fundamental:

```
┌──────────────┐         ┌──────────────┐
│  CARDHOLDER  │         │   MERCHANT   │
│  (Customer)  │         │  (Business)  │
└──────┬───────┘         └──────┬───────┘
       │                        │
       │    Card Networks       │
       │   (Visa/Mastercard)    │
       │         ↕              │
       │                        │
┌──────┴───────┐         ┌──────┴───────┐
│    ISSUER    │ ◄─────► │   ACQUIRER   │
│ (Card Bank)  │         │(Merchant Bank│
└──────────────┘         └──────────────┘
```

**Cardholder:** The person with the credit card
**Merchant:** The business accepting the payment
**Issuer (Issuing Bank):** The bank that gave the cardholder their card (Chase, Citi, etc.)
**Acquirer (Acquiring Bank):** The bank that processes payments for the merchant

### Core Payment Terms

**Authorization:** The real-time process (takes seconds) where the card network asks the issuer "Should this transaction be approved?" The issuer checks the card validity, available credit/balance, and fraud signals, then returns an approval or decline code.

**Settlement:** The actual movement of money that happens later (usually 1-3 business days). The acquirer deposits funds into the merchant's account minus fees.

**Clearing:** The exchange of transaction information between issuer and acquirer that happens between authorization and settlement. Data moves; money doesn't (yet).

**Batch:** Merchants typically send all their day's authorizations to their processor at once (usually end of day) for settlement. This bundle is a "batch."

### Fee Structure

**Interchange Fee:** The fee the merchant's bank (acquirer) pays to the cardholder's bank (issuer) for each transaction. This is the largest component of processing fees, typically 1.5-3% depending on card type, merchant category, and how the card was accepted.

**Scheme Fee / Assessment Fee:** Fee charged by Visa/Mastercard for using their network. Much smaller than interchange (typically 0.13-0.15%).

**Merchant Discount Rate (MDR):** The total percentage the merchant pays for each transaction. Includes interchange + scheme fees + processor margin. When you hear "2.9% + 30¢" for Stripe, this is the MDR.

**Take Rate:** The percentage of total payment volume (TPV) that a payment processor keeps as revenue. Stripe's is approximately 0.40%.

### Transaction Types

**Card-Present (CP):** In-person transactions where the physical card is used (swiped, dipped, tapped). Lower fraud risk = lower interchange.

**Card-Not-Present (CNP):** Online/phone transactions where the card isn't physically present. Higher fraud risk = higher interchange. This is Stripe's bread and butter.

**ACH (Automated Clearing House):** U.S. bank-to-bank transfer system. Slower (1-3 days) but much cheaper than cards (Stripe charges 0.8%, capped at $5). Used for large transactions, subscriptions, payroll.

**SEPA (Single Euro Payments Area):** Europe's equivalent of ACH for euro transfers.

**Wire Transfer:** Direct bank-to-bank transfer. Fast, expensive, typically used for large amounts.

### Fraud & Risk Terms

**Chargeback:** When a cardholder disputes a transaction and the issuer forcibly reverses it. The merchant loses the sale amount plus a fee ($15 at Stripe). High chargeback rates (>1%) can get merchants shut down.

**Fraud Rate:** Percentage of transactions that are fraudulent. Stripe Radar reduces this by ~38% on average.

**CVV/CVC:** The 3-4 digit security code on cards. Verifying this proves the person has the physical card (theoretically).

**3D Secure (3DS):** Additional authentication layer ("Verified by Visa," "Mastercard SecureCode") that shifts fraud liability from merchant to issuer. Adds friction but reduces chargebacks.

**AVS (Address Verification Service):** Checks if the billing address matches what the issuer has on file.

### Business Model Terms

**PSP (Payment Service Provider):** A company that enables merchants to accept payments without setting up their own merchant account with a bank. Stripe is a PSP.

**Payment Facilitator (PayFac):** A specific type of PSP that aggregates many small merchants under one master merchant account. Stripe operates as a PayFac, which is why merchants can start accepting payments instantly without bank approval.

**Merchant of Record (MoR):** The entity legally responsible for a transaction. Traditionally the merchant, but some platforms (like Stripe's new Managed Payments) take on this role, handling taxes, fraud, disputes, etc.

**PCI DSS (Payment Card Industry Data Security Standard):** Security requirements for handling card data. Stripe handles PCI compliance for merchants through their APIs—a major value proposition.

### Stripe-Specific Terms

**Connect:** Stripe's platform product that lets marketplaces/platforms embed payments and split funds between parties (e.g., Uber paying drivers, Shopify paying merchants).

**Radar:** Stripe's ML-powered fraud detection system trained on data from billions of transactions across the network.

**Link:** Stripe's accelerated checkout where customers save payment info once and use it across any Link-enabled merchant.

**Terminal:** Stripe's in-person payments product (card readers, POS systems).

**Atlas:** Stripe's service for incorporating companies (particularly Delaware C-corps for startups).

---

## Part 1: Company Fundamentals

### Founding Story

**Patrick Collison** (CEO) and **John Collison** (President) are Irish brothers who grew up in rural Limerick. Both started coding as teenagers. Patrick won the 41st Young Scientist of the Year at 16. Both dropped out of college (Patrick from MIT, John from Harvard) to work on Stripe.

The founding insight was simple but profound: In 2010, accepting payments online was absurdly difficult. You needed a merchant account (weeks of paperwork), a payment gateway, SSL certificates, PCI compliance expertise. The internet was 15+ years old and this was still broken.

Stripe's original pitch: **7 lines of code to accept payments.** Copy-paste an API call and you're live. The complexity is abstracted away.

This developer-first approach attracted Y Combinator startups, then larger tech companies, and eventually enterprises. The wedge was simplicity; the expansion was building everything a business needs to move money.

### Leadership Philosophy

**Patrick Collison on detail:**
> "Because Stripe's domain is really complicated and the details really matter, if we make a mistake—just one mistake—there's a very good chance that somebody's paycheck is wrong."

**Patrick on culture:**
> "The main mistakes companies make are being too precious about it, being too apologetic about it, and not treating it as dynamic and subject to revision."

**John Collison on craft:**
> "You can work on something you're not super proud of for two or three years, but you can't work on something that you're not super proud of for 30 years."

**On accountability:** During the 2022 layoffs (14% of workforce), Patrick wrote a public letter taking personal blame: "We were much too optimistic about the internet economy's near-term growth in 2022 and 2023 and underestimated both the likelihood and impact of a broader slowdown."

**On customer intimacy:** Customers join management meetings every two weeks for candid feedback. This isn't a quarterly ritual—it's continuous.

### Core Operating Principles

1. **Users first** — Patrick has said he would be "far less happy if Stripe was successful but not well-crafted and beautiful." Business success without craft is hollow.

2. **Really, really care** — "You can tell when someone has spent time thinking about and caring about what they're discussing." The standard is genuine investment, not checkbox completion.

3. **Builders are owners** — Engineers, managers, and leaders at all levels are pageable when users need them. If your system breaks at 3am, you're the one who gets called.

4. **Small teams, big impact** — "We often have surprisingly small teams accomplish strikingly important work." Stripe deliberately grew headcount slower than revenue, keeping teams small and investing more per person.

5. **Move fast, carefully** — Stripe processes $1.4T. They ship quickly but test relentlessly. Chaos engineering in production—deliberately triggering multiple concurrent faults to discover weaknesses.

### Engineering Culture

- **Ruby at scale:** One of the world's largest Ruby codebases (15M+ lines, 150K files)
- **Sorbet:** Custom type checker that's become central to productivity and engineering culture
- **Reliability:** "Five and a half nines" (99.9995% uptime) target
- **Chaos testing:** Trigger complex faults in production to reproduce failures and discover new ones
- **Ownership:** "Reliability is not owned by a committee—it's a pride that every leader and engineer puts into the systems"

### Financial Performance

| Metric | 2023 | 2024 | Growth |
|--------|------|------|--------|
| Total Payment Volume | $1.0T | $1.4T | 38% |
| Net Revenue | ~$4.0B | ~$5.1B | ~28% |
| Free Cash Flow | Positive | ~$2.2B | First profitable year |
| Take Rate | ~0.40% | ~0.40% | Stable |
| Transactions/minute | ~40K | ~50K | 25% |

**2024 was the first full year of profitability.** This matters because it enables Stripe to reinvest heavily in R&D—they claim a higher proportion of earnings reinvested than any comparable company over the last six years.

### Organizational Reality

**Size:** ~8,550 employees as of early 2025. Cut 300 jobs (3.5%) in early 2025, but planned to grow to 10,000 by year end.

**Attrition:** ~6.9% in 2025, lower than tech industry average.

**Work culture (mixed reviews):**
- Positive: Small teams with real ownership, fast responsibility growth, good morale
- Negative: Some teams report pressure, PIP threats, after-hours expectations
- Reality: Highly team-dependent

---

## Part 2: Product Ecosystem

Stripe started as payments but has become a full-stack financial infrastructure platform. Understanding how products connect is essential.

### Product Suite Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          STRIPE PRODUCT SUITE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────┐    ┌─────────────────────────┐                │
│  │   PAYMENTS (Core)       │    │  REVENUE AUTOMATION     │                │
│  │                         │    │                         │                │
│  │  • Checkout            │    │  • Billing              │                │
│  │  • Elements            │    │  • Invoicing            │                │
│  │  • Payment Links       │    │  • Tax                  │                │
│  │  • Link (1-click)      │    │  • Revenue Recognition  │                │
│  │  • Terminal (POS)      │    │  • Sigma (Analytics)    │                │
│  │  • Radar (Fraud)       │    │  • Data Pipeline        │                │
│  └─────────────────────────┘    └─────────────────────────┘                │
│                                                                             │
│  ┌─────────────────────────┐    ┌─────────────────────────┐                │
│  │   CONNECT (Platforms)   │    │   EMBEDDED FINANCE      │                │
│  │                         │    │                         │                │
│  │  • Multi-party payments│    │  • Issuing (Cards)      │                │
│  │  • Onboarding          │    │  • Treasury (BaaS)      │                │
│  │  • Account management  │    │  • Capital (Lending)    │                │
│  │  • Orchestration       │    │  • Financial Connections│                │
│  └─────────────────────────┘    └─────────────────────────┘                │
│                                                                             │
│  ┌─────────────────────────┐    ┌─────────────────────────┐                │
│  │   INFRASTRUCTURE        │    │   EMERGING (2025)       │                │
│  │                         │    │                         │                │
│  │  • Atlas (Incorporation)│    │  • Stablecoin Accounts  │                │
│  │  • Identity (KYC)      │    │  • Agentic Commerce (ACP)│                │
│  │  • Workflows / Scripts │    │  • Open Issuance        │                │
│  │  • Sandboxes           │    │  • Managed Payments     │                │
│  └─────────────────────────┘    └─────────────────────────┘                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Deep Dive: Payments (The Foundation)

**Checkout & Elements:**
Stripe offers two main approaches for accepting payments:
- **Checkout:** Pre-built, hosted payment page. Drop in a link, Stripe handles everything.
- **Elements:** Embeddable UI components for custom checkout flows. More control, still PCI-compliant.

**Optimized Checkout Suite (2025):**
The AI-powered checkout that uses 100+ signals to optimize in real-time:
- Location, currency, device type, browser
- Transaction amount and type
- Customer history across the Stripe network (92% of cards have been seen before)
- Time of day, merchant category, risk signals

Results: **3% conversion boost, 7% increase in average transaction value, 30% fraud reduction.**

**Radar (Fraud):**
Stripe's ML fraud detection, trained on billions of transactions network-wide. Key capabilities:
- Blocks $2.3B+ in fraudulent transactions annually
- Reduces fraud by 38% on average
- New **Payments Foundation Model** (2025): First general-purpose ML model built for payments, improved card testing attack detection from 59% to 97%
- Risk scores available via API for use in external systems
- Now covers ACH and SEPA, not just cards

**Link:**
Stripe's answer to Shop Pay and Apple Pay—a one-click checkout where customers save payment info once and use it across any Link-enabled merchant. Network effect: more merchants using Link = more customers with saved info = faster checkout everywhere.

**Terminal:**
In-person payments via card readers. Stripe's weakest competitive area—they lag Adyen and Square here. 2025 update: Now supports third-party hardware (Verifone partnership), reducing the gap.

### Deep Dive: Revenue & Finance Automation

**Billing (The Growth Engine):**

This is where Stripe is winning the AI economy. Key stats:
- **$500M+ annual revenue run rate** (January 2025)
- **300,000+ businesses** use Billing
- **~200 million active subscriptions** managed
- Customers: OpenAI, Anthropic, Cursor, Midjourney, NVIDIA

Why Billing matters for AI companies: AI products often have complex pricing—subscription base + usage-based components (tokens, API calls, compute time). Stripe Billing handles this "hybrid billing" natively.

2025 additions:
- **Scripts:** Custom logic to extend Billing behavior programmatically
- **Workflows:** Visual automation for multi-step processes (approvals, notifications, compliance checks)
- **Mixed interval subscriptions:** Combine monthly and annual billing
- **Partial payments:** Accept deposits, installments

**Tax:**
Automated tax calculation and compliance. 2025 expansion:
- Now covers **102 countries** (up from 57)
- Not just calculation—now handles **registration AND filing**
- The full tax lifecycle: monitoring obligations → registering → collecting → filing

**Revenue Recognition:**
Accrual accounting compliance (ASC 606). Ensures revenue is recognized when earned, not when cash is received. Critical for SaaS companies. Now supports usage-based billing models.

### Deep Dive: Connect (Platform Economics)

**What it does:** Enables platforms and marketplaces to embed payments, splitting funds between multiple parties.

**Why it matters:** This is Stripe's deepest moat. Platforms like Shopify, Lyft, DoorDash, Instacart have deeply integrated Connect. Migrating away would be enormously painful.

**How it works:**
When you buy something on Etsy, pay for a Lyft, or purchase from a Shopify store:
1. The platform accepts your payment via Stripe
2. Connect automatically splits the funds (platform fee, seller payout, Stripe fee)
3. Handles compliance, 1099s, identity verification for all parties

**Key numbers:**
- Shopify: ~$292B TPV through Stripe (20%+ of Stripe's total volume)
- This customer concentration is both a strength (massive scale) and risk (dependency)

**2025 updates:**
- **Networked onboarding:** If someone already has a Stripe account, they can onboard to a new platform in 3 clicks
- **Accounts v2 API:** Unified way to model customers, merchants, and their relationships
- **Platform Radar:** AI fraud detection specifically for platform use cases

### Deep Dive: Embedded Finance

These products let platforms offer financial services to their users. Higher margin than core payments.

**Issuing:**
Create physical and virtual cards. Use cases:
- Corporate expense cards
- Contractor payout cards
- Customer rewards cards
- Embedded financial accounts

2025 expansion: Now supports **consumer credit cards** (not just debit/prepaid), no-code authorization rules, US card issuance to subsidiaries in 40+ countries.

**Treasury:**
Banking-as-a-Service. Platforms can offer their users:
- Stored-value accounts (FDIC-insured up to $250K via partner banks)
- ACH and wire transfers
- Interest-bearing balances

Example: A freelance platform could offer contractors a bank account that receives payments directly, holds funds, and issues a debit card.

**Capital:**
SMB lending using Stripe's payment data for underwriting. If Stripe can see your sales volume, they can assess credit risk better than a traditional bank. Addresses the $5.2T annual unmet global SMB funding need.

---

## Part 3: The AI Bet

Patrick Collison at Sessions 2025:
> "There are not one, but two, gale-force tailwinds, well off the Beaufort scale, dramatically reshaping the economic landscape around us: AI and stablecoins."

Stripe is making an enormous bet that AI will transform commerce—and positioning itself as the infrastructure layer.

### Why AI Companies Choose Stripe

**Market penetration:**
- 78% of Forbes AI 50 use Stripe
- 700+ AI agent startups launched on Stripe in 2024
- Expected to be "substantially eclipsed" in 2025

**Speed of scale:**
The top 100 AI companies on Stripe hit $1M ARR in a median of **11.5 months**—four months faster than the fastest-growing SaaS companies in history.

**Customer list:** OpenAI, Anthropic, Midjourney, Cursor, Perplexity, NVIDIA, Databricks

### Stripe's AI Products

**1. Payments Foundation Model**

Announced at Sessions 2025, this is the first general-purpose foundation model built specifically for payments. Key characteristics:
- Trained on **tens of billions of transactions**
- Uses self-supervised learning to generate nuanced representations of every charge
- Not a chatbot—it's embedded in Stripe's fraud detection and optimization systems

Impact: Card testing attack detection improved from 59% to ~97%. These attacks involve bots trying thousands of stolen card numbers to find valid ones.

**2. Payments Intelligence Suite**

A bundle of AI-powered optimization tools:
- **Authorization Boost:** AI-powered card update and intelligent retry logic. When a card is declined, Stripe can often recover the transaction through smart retries.
- **Smart Disputes:** Automatically generates evidence to fight chargebacks, with early results showing 13% more wins. Stripe covers the fee if you lose.
- **Anomaly alerts:** 90%+ precision in detecting unusual patterns
- **Revenue recommendations:** AI-generated suggestions for improving payment acceptance

**3. AI-Powered Dashboard**

Natural language interface for the Stripe dashboard:
- "Create a product called Premium Plan for $99/month"
- "Refund the last transaction from John Smith"
- "Generate a payment link for $500"

### Agentic Commerce: The Big Bet

This is where things get interesting—and where Stripe is building for a future that doesn't fully exist yet.

**What is agentic commerce?**

Agentic commerce is AI agents autonomously researching, comparing, and purchasing products on behalf of humans. Not just answering questions about products—actually completing transactions.

**Current state (early 2025):**
- More than half of consumers expect to use AI assistants for shopping by end of 2025 (Adobe)
- Traffic to US retail sites from GenAI browsers increased **4,700% YoY** in July 2025
- 30-45% of US consumers already use GenAI tools to research products before purchase (Bain)

**Market projections:**
- U.S. agentic commerce: $300-500B by 2030, 15-25% of online retail (Bain)
- B2B AI agent purchases: $15T by 2028 (Gartner)

**Example scenarios:**

*Today:*
You tell ChatGPT: "I need a new winter jacket, budget $200, prefer North Face or Patagonia."
ChatGPT searches, compares options, shows you ranked results.
You click a link to buy on the retailer's site.

*Near future:*
Same prompt. ChatGPT searches, compares, and says: "I found this Patagonia jacket for $185 at REI. Should I buy it?"
You say "Yes." The transaction completes within the chat. Confirmation email arrives.

*Further out:*
Your AI assistant monitors your preferences, notices your running shoes are wearing out based on your fitness data, finds deals matching your preferences, and either alerts you or just orders them automatically within pre-set guardrails.

**The Agentic Commerce Protocol (ACP)**

In September 2025, Stripe and OpenAI co-released ACP—an open-source protocol (Apache 2.0 license) that defines how AI systems can manage transactions. This is Stripe's play to become the payment infrastructure for the entire agentic economy.

**How ACP works:**

```
┌────────────────┐        ┌────────────────┐        ┌────────────────┐
│     USER       │        │   AI AGENT     │        │   MERCHANT     │
│  (Cardholder)  │        │  (ChatGPT)     │        │  (Retailer)    │
└───────┬────────┘        └───────┬────────┘        └───────┬────────┘
        │                         │                         │
        │  1. "Buy this jacket"   │                         │
        │ ───────────────────────►│                         │
        │                         │                         │
        │  2. Shows Stripe checkout inline                  │
        │ ◄───────────────────────│                         │
        │                         │                         │
        │  3. User pays (Apple Pay, card, etc.)             │
        │ ───────────────────────►│                         │
        │                         │                         │
        │    4. Stripe issues Shared Payment Token (SPT)    │
        │       - Scoped to specific merchant               │
        │       - Scoped to specific cart total             │
        │       - Never exposes raw card data               │
        │                         │                         │
        │                         │  5. Agent passes SPT    │
        │                         │ ───────────────────────►│
        │                         │                         │
        │                         │  6. Merchant processes  │
        │                         │     (via Stripe or      │
        │                         │      other processor)   │
        │                         │ ◄───────────────────────│
        │                         │                         │
        │  7. Confirmation        │                         │
        │ ◄───────────────────────│                         │
        │                         │                         │
```

**Key innovation: Shared Payment Token (SPT)**

The SPT is a new payment primitive that lets AI agents initiate payments without ever seeing raw payment credentials:
- Scoped to a specific merchant
- Scoped to a specific cart total
- Can't be reused or modified
- OpenAI (the AI provider) never possesses card numbers—reducing breach risk and compliance burden

**Instant Checkout in ChatGPT**

The first major implementation of ACP. ChatGPT users in the US can buy from:
- US Etsy sellers (live now)
- 1M+ Shopify merchants including Glossier, Vuori, Spanx, SKIMS (coming soon)

The checkout appears inline in the chat—no redirect to a website.

**Partners testing ACP:**
- OpenAI (Instant Checkout)
- Microsoft Copilot
- Anthropic (Claude)
- Perplexity
- Vercel
- Lovable
- Replit
- Manus

**Visa partnership:** Stripe is Visa's exclusive launch partner for their new agentic cards specification. More markets (APAC, Europe) planned for early 2026.

**Order Intents API**

Beyond checkout, Stripe released Order Intents—an API that lets AI agents:
- Query product availability
- Add items to carts
- Initiate purchases programmatically

Use cases:
- AI assistants that can actually buy things, not just recommend
- Smart home systems that reorder supplies
- To-do list items that become shoppable ("Buy birthday gift for mom" → AI finds, orders, ships)

**Why this matters strategically:**

If ACP becomes the standard for AI commerce, every transaction flowing through AI agents—regardless of which AI provider—could flow through Stripe infrastructure. Even if merchants use a different payment processor, they can still participate via ACP's Delegated Payments Spec.

This is a standards-layer play, not just a product.

---

## Part 4: The Stablecoin Bet

### What Are Stablecoins? (Explainer)

**The basic concept:**

A stablecoin is a cryptocurrency designed to maintain a stable value, typically pegged 1:1 to the US dollar. Unlike Bitcoin (which fluctuates wildly), 1 USDC is meant to always be worth $1.

**How they maintain the peg:**

For every stablecoin in circulation, the issuer holds equivalent reserves:
- USDC (by Circle): ~85% in short-term US Treasuries, ~15% in cash for liquidity
- USDT (by Tether): Mix of Treasuries, cash, other assets (less transparent)

You can always redeem 1 USDC for $1 from Circle. This redeemability is what maintains the peg.

**Why do they exist?**

Stablecoins combine:
- The stability of the dollar
- The programmability of cryptocurrency (24/7, instant, borderless)
- The efficiency of blockchain rails (no intermediary banks needed)

**Market size:**

As of late 2025:
- Total stablecoin market cap: >$208 billion
- USDT (Tether): ~$186B market cap, most traded
- USDC (Circle): ~$76B market cap, preferred by institutions for transparency
- 2024 stablecoin volume: **$15.6 trillion** (on par with Visa)

**Regulatory clarity:**

The GENIUS Act (July 2025) was a breakthrough—it allows US banks and financial institutions to issue stablecoins backed by fiat or high-quality collateral. This legitimized stablecoins for enterprise use.

### Why Stablecoins Matter for Payments

**Problem 1: Cross-border payments are broken**

Traditional correspondent banking:
- Takes 3-7 days
- Costs 3-6% in fees (up to 20% for some remittance corridors)
- Fails frequently due to compliance checks, timezone mismatches
- Requires pre-funding accounts in multiple countries

Stablecoins:
- Settle in seconds to minutes
- Cost <1% (often much less)
- Work 24/7, no banking hours
- No pre-funding needed

**Problem 2: Dollar access in emerging markets**

In countries with volatile currencies (Argentina, Nigeria, Turkey), businesses and individuals want to hold dollars but can't easily access US bank accounts. Stablecoins provide a "digital dollar" that anyone with a smartphone can hold and transact.

**Problem 3: Credit card fees for B2B**

Cards charge 2-3%. For a $100K B2B transaction, that's $2-3K in fees. ACH is cheaper but slow. Wire transfers are fast but expensive. Stablecoins can be faster than ACH and cheaper than wires.

**Real-world adoption:**

- Starlink uses stablecoins to repatriate funds from Argentina (avoiding currency controls)
- Nigerian consumers pay for YouTube Premium and ChatGPT with stablecoins
- Flutterwave pilot in Africa: instant merchant payouts via USDC
- Visa expanded stablecoin settlement to CEMEA region—$225M+ processed globally
- PayPal's PYUSD stablecoin now used for Xoom cross-border payments

### Bridge Acquisition ($1.1B)

In February 2025, Stripe completed its largest acquisition ever: **Bridge**, a stablecoin infrastructure company.

**What Bridge does:**

Bridge makes it easy for businesses to accept stablecoin payments without dealing with crypto directly. The business gets dollars; Bridge handles the crypto conversion.

**Strategic rationale:**

1. **Cheaper cross-border:** Stablecoins reduce transaction failures and costs in certain corridors
2. **Better conversion:** Improved payment acceptance in countries with weak banking infrastructure
3. **New markets:** 151 countries can now access Stripe (up from 46) via stablecoin accounts
4. **Card fee alternative:** Some merchants can accept stablecoins instead of cards, saving 2%+

**Valuation context:** Bridge raised at ~$200M valuation in its Series A. Stripe paid $1.1B less than a year later—5.5x markup. This signals how strategically critical Stripe views stablecoins.

### Stripe's Stablecoin Products

**1. Stablecoin Financial Accounts**

Announced Sessions 2025 as "the biggest international launch we'll ever do."

Businesses in **101 new countries** can now:
- Hold stablecoin balances in Stripe
- Receive funds on both crypto AND fiat rails (ACH, SEPA, etc.)
- Send stablecoins to anyone globally
- Convert between stablecoins and fiat

This effectively gives businesses in developing countries access to dollar-denominated accounts without a US bank relationship.

**2. Open Issuance**

Announced September 2025—a platform for businesses to launch their own stablecoins.

How it works:
- Few lines of code to create a new stablecoin
- Mint and burn coins freely based on reserves
- Customize reserve composition (cash vs. Treasuries ratio)
- Reserves managed by BlackRock, Fidelity, Superstate
- Cash held by Lead Bank for liquidity

First stablecoin: Phantom wallet
Other early adopters: Hyperliquid, MetaMask

**Why would a business want its own stablecoin?**

- Loyalty/rewards programs with transferable value
- Gaming currencies that can be cashed out
- Closed-loop payment systems with lower fees
- Programmable money with custom rules

**3. USDC Corporate Cards**

Preview announced at Sessions 2025: corporate cards on the Visa network denominated in USDC. Powered by Stripe Issuing and Bridge.

Use case: A company holds treasury in stablecoins (earning yield), spends via card, only converts to fiat at the moment of purchase.

**4. Tempo Blockchain**

September 2025: Stripe announced Tempo, a new high-speed blockchain purpose-built for stablecoin processing.

Backers include:
- OpenAI
- Anthropic
- Deutsche Bank
- Visa

What it enables:
- AI agents making autonomous payments
- Cross-border settlements in seconds
- E-commerce transactions bypassing traditional banking

### Traction

- Within one week of enabling stablecoin payments: transactions from 70+ countries
- Now: 120+ countries
- 46% of APAC businesses expect to use stablecoins within 2 years
- Patrick Collison: "We expected Bridge to grow very quickly, and we're nevertheless shocked at just how rapidly adoption is exploding."

---

## Part 5: Design Organization (Deep Dive)

This is the section most relevant to your role.

### Katie Dill — Head of Design

**Background:**
- Head of Experience Design at Airbnb (learned to advocate for design ROI)
- Head of Design at Lyft
- BS Industrial Design from Art Center College of Design
- BA History from Colgate University

**Recognition:**
- Business Insider's "10 People Changing the Tech Industry"
- Fast Company's "100 Most Creative People in Business"
- Girls in Tech "Creator of the Year"

**Scope at Stripe:**
- Product Design
- Brand & Marketing Creative
- Web Presence (stripe.com)
- User Research
- Content Design
- Design Operations

### Team Structure

**Total design org:** ~100+ people

**Breakdown:**
- Product Design: ~50%+ of the team
- Brand Studio: advertising, events, brand guidelines
- Web Presence (WPP): stripe.com and platform marketing
- Research: dedicated product research team
- Editorial/Content Design
- Design Operations/Program Management

**Design Program Management:**
5 dedicated DPMs:
- 1 focused on cohesion across all design disciplines
- 2 focused on product design specifically
- 2 focused on UX research operations

**Collaboration model:**
- Designers are embedded in product teams (not in a design silo)
- Work directly with PMs and engineers from start to finish
- Own outcomes alongside their cross-functional partners

### Design Philosophy

**Craft vs. Quality (Katie Dill's Framework):**

> "Craft is about the how—the thinking, work, and mastery that goes into creating something. Quality is often the output of that process. You can have craft without quality, but rarely quality without craft."

Example: A chair with beautiful details that's uncomfortable to sit in has craft but lacks quality. You can't spend more than three minutes in it.

**The Three Levels of Quality:**
1. **Utility:** Does it work? Does it solve the user's problem?
2. **Usability:** Can people actually use it effectively?
3. **Beauty:** Is it refined, polished, delightful?

Dill argues against the "utility first, beauty later" mentality. Beauty isn't optional polish—it can attract users, build trust, and elevate utility. Evidence: upgrading email design with better typography and imagery increased product conversion by 20%.

**Minimum Viable Quality Product (MVQP):**

Rather than shipping MVPs that sacrifice quality, Stripe aims for MVQP:
> "A product that solves user problems completely with refinement sufficient to help users engage effectively and build trust."

This doesn't mean shipping slowly—it means being intentional about what's included and ensuring what ships is excellent.

### Key Practices

**1. The 15 Essential Journeys**

Stripe identified the top 15 user workflows that customers depend on. Examples:
- Getting started and selecting appropriate products
- Setting up billing for subscriptions
- Creating payment links without coding
- Handling a disputed transaction
- Receiving a payout

These journeys are reviewed quarterly by cross-functional teams.

**2. Friction Logging ("Walk the Store")**

Teams regularly use products as customers would, documenting every friction point:
- Identify unclear language or confusing UI
- Check consistency with design system and style guides
- Trace entire journeys across multiple surfaces
- Log bugs and issues

Anyone at Stripe can friction log another team's products and share findings. It's cultural, not just process.

Dill: "Friction logs aren't a substitute for talking to users but an addition. Users won't always tell you about every little thing, or maybe subconsciously something doesn't feel right but they don't know why."

**3. Product Quality Review (PQR)**

Quarterly systematic quality assessment:
- Cross-functional team (designers, engineers, PMs) reviews the 15 Essential Journeys
- Score each journey on a 5-point scale (red to green)
- Results tracked on a company-wide scoreboard
- Company goal: keep journeys "green"

Quality rubric categories:
- Copy quality
- Motion and transitions
- Load time and performance
- Visual craft and polish
- Overall usability

**4. Design Reviews**

Stripe minimizes "presentationing" in reviews:
- Skip extensive decks
- Jump directly into prototypes or live products
- Experience them from the user's perspective
- Avoids biasing reviewers with context users don't have

Dill: "The goal is to see what a user would see, not what we want them to see."

**5. Product Preview Programs**

Early adopters provide feedback within rapid 24-hour iteration cycles:
- De-risks products before broad launch
- Many Stripe products emerged from user collaboration (Connect came from working with Lyft)
- If preview users love it, broader market adoption more likely

### Design Culture Indicators

**Founder commitment:**

Patrick Collison:
> "I would be far less happy if Stripe was successful but not well-crafted and beautiful."

He believes beauty "brings joy and makes the world feel better." Design quality is an operating principle, not a department goal.

**Quality's gravitational pull:**

Dill acknowledges the tension:
> "Quality's gravitational pull competes against shipping quickly. It's easy to ship something 'good enough.' You have to hold steadfast to 'it's not good enough yet' and invest time and courage to pause shipping when necessary."

**Design system influence:**

Stripe's website is an industry benchmark. When new versions launch, design trends emerge across the web. The visual language—bright colors, bold typography, sophisticated animations—is described as "for optimists."

**Design influences:**
Katie Dill emphasizes foundational principles over trends:
- Dieter Rams (functionality, simplicity, longevity)
- Massimo Vignelli (systems thinking, grids, typography)

### Design at Stripe: Key Tensions

**1. Complexity vs. Coherence**

Stripe has dozens of products serving startups to Fortune 100. The 15 Essential Journeys framework exists to maintain coherence, but the challenge is real.

**2. Developers vs. End Users**

Core users are developers (APIs, documentation). But Stripe also builds merchant dashboards, checkout flows, consumer-facing payment screens. Different audiences require different design approaches.

**3. Trust & Stakes**

Patrick: "If we make one mistake, someone's paycheck could be wrong."

Payments are high-stakes. Design must communicate trust, handle errors gracefully, and never leave users uncertain about money.

**4. Global Scale**

46+ countries, 135+ currencies, countless localization challenges. Checkout must work everywhere, for everyone.

### What Design Managers Should Know

**Your value proposition:**

Design at Stripe isn't a service function—it's a competitive advantage explicitly valued by founders. This gives you leverage, but also expectations.

**Key questions to explore:**
- Which of the 15 Essential Journeys will you own?
- How does your area score in the PQR?
- What are the known friction points?
- Where is design influence growing vs. established?

**Katie Dill's formula:**
> "Performance = potential – interference"

Her focus is on removing organizational friction that prevents teams from executing well. As a design manager, identifying and eliminating blockers may be as important as the designs themselves.

---

## Part 6: Competitive Landscape

### Market Position Summary

| Segment | Stripe Position | Main Competitor | Key Battleground |
|---------|-----------------|-----------------|------------------|
| Online Payments | #2 globally (20-29%) | PayPal (43%) | Developer experience, AI companies |
| Enterprise | Growing fast | Adyen | Product breadth vs. operational efficiency |
| SMB/Small Business | Strong | Square | Technical sophistication vs. simplicity |
| Platforms/Marketplaces | Dominant | None clear | Deep integration, switching costs |
| AI Companies | Dominant | None clear | First-mover, purpose-built billing |
| Stablecoins | First-mover | Emerging | Infrastructure standards |

### Stripe vs. Adyen (Primary Competitor)

Adyen is Stripe's closest competitor—a Netherlands-based payment processor that went public in 2018 and has similar enterprise ambitions.

**Adyen Advantages:**
- **Profitability:** $650M+ free cash flow vs. Stripe's recent profitability
- **Efficiency:** 3K employees vs. Stripe's ~8.5K for comparable revenue
- **Payment methods:** 300+ vs. Stripe's 125
- **Geography:** ~100 countries vs. Stripe's 46 (pre-stablecoin expansion)
- **Point-of-sale:** Superior omnichannel infrastructure
- **Enterprise DNA:** Built for large merchants from day one

**Stripe Advantages:**
- **Revenue:** $5.1B vs. Adyen's $2.2B (2024)
- **Customer count:** 2M+ vs. ~100K
- **Product breadth:** Billing, Treasury, Capital, Atlas, etc.
- **Platform economics:** Connect dominates marketplace payments
- **Developer experience:** Best-in-class APIs, documentation, content
- **AI positioning:** 78% of Forbes AI 50

**Technical comparison:**

Stripe: "Plug-and-play" with extensive documentation and no-code options. Integration time measured in hours.

Adyen: More enterprise-focused, requires more technical expertise. Better for companies with in-house payment teams who want deep customization.

### Stripe vs. PayPal (Market Leader)

PayPal has the largest global market share at 43%, but the companies serve different segments.

**PayPal Position:**
- Consumer brand recognition (everyone knows PayPal)
- Dominates established marketplaces (eBay heritage)
- $1.92T TPV (2025)
- 200+ countries, 25 currencies

**Stripe Position:**
- Growing faster (27.5% revenue growth vs. PayPal's modest gains)
- Winning technology companies and developers
- More sophisticated product suite
- Better positioned for AI and stablecoin trends

PayPal is a consumer-facing brand; Stripe is infrastructure. Different games.

### Stripe vs. Square/Block

**Square Position:**
- Dominant in-person payments (iconic card readers)
- SMB-focused, "all-in-one" simplicity
- Cash App ecosystem
- Hardware advantage

**Stripe Position:**
- More technical sophistication
- Better for platforms and marketplaces
- Weaker hardware/POS presence
- Different customer profile (developers vs. small business owners)

---

## Part 7: Strengths & Weaknesses

### Structural Strengths

**1. Network Effects & Data Moat**

Stripe sees 92% of cards before—somewhere on the network. This means:
- Better fraud models (more data = better ML)
- Better authorization rates (knows which declines to retry)
- Better checkout optimization (knows payment preferences)

More merchants → more data → better products → more merchants. Classic network effect.

**2. Developer Experience**

Stripe's original wedge and ongoing advantage. Best-in-class:
- API design
- Documentation
- Client libraries in every language
- Sample code and tutorials

Word-of-mouth among developers drove early growth without traditional sales.

**3. Platform Lock-in (Connect)**

Platforms like Shopify, Lyft, DoorDash have deeply integrated Connect. Migrating would require:
- Re-implementing multi-party money flows
- Migrating merchant accounts
- Rebuilding compliance workflows
- Months of engineering work

This creates enormous switching costs.

**4. AI Economy Positioning**

78% of Forbes AI 50 use Stripe. Why:
- Billing handles complex usage-based pricing
- Fast onboarding for hyper-growth companies
- Agentic commerce infrastructure (ACP)
- First-mover positioning

**5. Stablecoin Infrastructure**

Bridge acquisition positions Stripe for cross-border payments disruption. Open Issuance creates platform power for stablecoin ecosystem.

**6. Enterprise Trajectory**

Successfully moved upmarket:
- 2019: 25 customers with $1B+ annual TPV
- 2022: 110 customers with $1B+ annual TPV
- Now: 50% of Fortune 100

No longer "just for startups."

### Structural Weaknesses

**1. Profitability Tension**

~8,550 employees for $5.1B revenue vs. Adyen's ~3,000 for $2.2B. Stripe needs much more headcount to generate similar revenue. This creates margin pressure if growth slows.

**2. Geographic Limitations**

46 countries vs. Adyen's ~100. Fewer local payment methods. Europe and APAC are still small portions of revenue (though stablecoin accounts expand reach to 151 countries).

**3. Point-of-Sale Gap**

Terminal lags competitors. In-person payments aren't a strength. Matters less for pure e-commerce, more for omnichannel retailers.

**4. Customer Concentration**

Shopify: ~$292B of $1.4T TPV (20%+). Dependency on a few large platforms creates risk.

**5. Merchant Experience Issues**

Most common complaints:
- Sudden account freezes with little explanation
- Funds held for months during "review"
- Support quality for small merchants (chatbots, slow response)
- High-risk industry challenges (subscription, travel, CBD)

These don't affect enterprise customers as much but damage SMB reputation.

**6. Execution Complexity**

Expanding across payments, embedded finance, AI infrastructure, stablecoins, crypto. Broad surface area creates execution risk—hard to be excellent at everything.

---

## Part 8: Conversation Starters

### Questions to Ask (First Weeks)

**About design operations:**
- How does the 15 Essential Journeys framework work in practice? How were they chosen?
- Walk me through a recent Product Quality Review. What got flagged? What got fixed?
- How do design decisions happen when products overlap (e.g., Billing + Connect)?

**About team structure:**
- How are designers distributed across products?
- What's the ratio of product design to research to content design?
- How does the product design team interact with the brand studio?

**About priorities:**
- How is design contributing to the AI and stablecoin bets?
- What are the biggest design challenges in [specific product area]?
- Where is design's influence growing vs. established?

**About culture:**
- How does Patrick and John's care for craft manifest day-to-day?
- What does "operationalizing quality" look like in practice?
- How do small teams handle such ambitious scope?

### Topics to Demonstrate Knowledge

When meeting colleagues, these topics show you've done homework:

**Strategic:**
- The Agentic Commerce Protocol and Instant Checkout—what it means for checkout design
- Sessions 2025 announcements: Payments Foundation Model, Orchestration, stablecoin accounts
- The "gale-force tailwinds" framing (AI + stablecoins)

**Product:**
- Why Billing is the "revenue engine of the AI era"
- How Connect creates platform lock-in
- The tension between developer-first products and merchant-facing tools

**Design:**
- Katie Dill's "craft vs. quality" distinction
- The MVQP concept (Minimum Viable Quality Product)
- Friction logging as cultural practice, not just process

**Business:**
- Enterprise growth trajectory (25 → 110 $1B+ TPV customers)
- The Bridge acquisition and what it enables
- Stripe's first profitable year and what it means for R&D investment

---

## Part 9: Key Sources

### Primary Sources
- [Stripe Sessions 2025 Product Updates](https://stripe.com/blog/top-product-updates-sessions-2025)
- [Stripe 2024 Annual Letter](https://stripe.com/annual-updates/2024)
- [Sessions 2025 Opening Keynote](https://stripe.com/sessions/2025/opening-keynote)
- [Stripe Documentation](https://docs.stripe.com/products)
- [AMA with Patrick and John Collison (Sessions 2025)](https://stripe.com/sessions/2025/ama-with-patrick-and-john-collison)

### Business Analysis
- [Contrary Research: Stripe Business Breakdown](https://research.contrary.com/company/stripe)
- [Sacra: Stripe Revenue & Valuation](https://sacra.com/c/stripe/)
- [a16z: What Bridge Acquisition Means](https://a16z.com/newsletter/what-stripes-acquisition-of-bridge-means-for-fintech-and-stablecoins-april-2025-fintech-newsletter/)
- [Fintech Wrap Up: Stripe vs. Adyen Deep Dive](https://www.fintechwrapup.com/p/deep-dive-stripe-vs-adyen-comparing-586)

### Design & Culture
- [Lenny's Podcast: Katie Dill on Building Beautiful Products](https://www.lennysnewsletter.com/p/building-beautiful-products-with)
- [Creator Economy: How Stripe Crafts Quality Products](https://creatoreconomy.so/p/how-stripe-crafts-quality-products-katie-dill)
- [Pragmatic Engineer: Inside Stripe's Engineering Culture](https://newsletter.pragmaticengineer.com/p/stripe)
- [UC Berkeley: Patrick Collison on Culture](https://haas.berkeley.edu/culture/culture-kit-podcast/posts/bonus-episode-3-stripe-ceo-patrick-collison-on-crafting-a-culture-that-prizes-details/)

### Agentic Commerce
- [Stripe: Developing an Open Standard for Agentic Commerce](https://stripe.com/blog/developing-an-open-standard-for-agentic-commerce)
- [OpenAI: Buy It in ChatGPT](https://openai.com/index/buy-it-in-chatgpt/)
- [McKinsey: The Agentic Commerce Opportunity](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-agentic-commerce-opportunity-how-ai-agents-are-ushering-in-a-new-era-for-consumers-and-merchants)

### Stablecoins
- [IMF: How Stablecoins Can Improve Payments](https://www.imf.org/en/blogs/articles/2025/12/04/how-stablecoins-can-improve-payments-and-global-finance)
- [Fortune: Stripe's Stablecoin Ambitions](https://fortune.com/crypto/2025/10/01/stripe-crypto-stablecoins-open-issuance-bridge-blockchain-tempo/)
- [FXC Intelligence: State of Stablecoins 2025](https://www.fxcintel.com/research/reports/ct-state-of-stablecoins-cross-border-payments-2025)

### Industry Context
- [CNBC Disruptor 50: Stripe 2025](https://www.cnbc.com/2025/06/10/stripe-2025-cnbc-disruptor-50.html)
- [Payments Dive: Agentic AI Commerce](https://www.paymentsdive.com/news/stripe-pushes-agentic-ai-sales-via-chatgpt-openai-artificial-intelligence/761439/)

---

## Quick Reference Card

### Company
- **Valuation:** $91.5B (secondary: $129B)
- **TPV 2024:** $1.4T
- **Revenue 2024:** ~$5.1B
- **Employees:** ~8,550
- **Profitable:** Yes (first full year 2024)

### Leadership
- **CEO:** Patrick Collison
- **President:** John Collison
- **Head of Design:** Katie Dill
- **President of Technology:** William Gaybrick

### Market Position
- **Global share:** 20-29% (#2 after PayPal)
- **US share:** ~45%
- **Fortune 100:** 50% are customers
- **Forbes AI 50:** 78% use Stripe

### Strategic Bets
- **AI:** Payments Foundation Model, ACP, Order Intents
- **Stablecoins:** Bridge acquisition, Open Issuance, Tempo
- **Enterprise:** Growing from startup-focused to Fortune 100

### Design
- **Team size:** ~100+
- **Framework:** 15 Essential Journeys
- **Quality process:** Product Quality Review (quarterly)
- **Philosophy:** "Performance = potential – interference"
- **Standard:** MVQP (Minimum Viable Quality Product)

### Key Products
- **Payments:** Checkout, Elements, Radar, Link, Terminal
- **Revenue:** Billing ($500M+ run rate), Tax (102 countries), Invoicing
- **Platforms:** Connect (Shopify, Lyft, DoorDash)
- **Embedded Finance:** Issuing, Treasury, Capital
- **Emerging:** Stablecoin Accounts, ACP, Open Issuance

### Fees
- **Standard:** 2.9% + $0.30 per transaction
- **International:** +1.5% cross-border fee
- **ACH:** 0.8% (capped at $5)
- **Disputes:** $15 per chargeback

---

*Generated January 18, 2026 for Stripe Day 1 preparation.*
*~8,500 words | ~45 minute read*
