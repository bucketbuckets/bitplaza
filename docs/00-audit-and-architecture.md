# Bitplaza — Stage 1: Repository Audit & Architecture Proposal

**Date:** 2026-07-29
**Status:** Awaiting approval. No code written.
**Scope:** Launch website + segmented waitlist system.

---

## 1. Current-state summary

### 1.1 The headline finding

**`/Users/tommyjohn/Documents/bitplaza` is empty.** It contains one directory,
`.omc/` (OMC session state), and nothing else. There is no git repository, no
`package.json`, no framework, no database, no design system, no deployment
config.

The brief asks me to "inspect the current repository and report existing
framework and versions." There is no repository. Everything below is therefore a
greenfield proposal, not an extension plan — which changes the risk profile in
both directions: no legacy constraints, but also no verified foundation, no CI,
and nothing proven to work.

### 1.2 What actually exists on this machine

Three directories under `~/Documents`, and only one of them is BCH:

| Path | What it is | Relevant? |
|---|---|---|
| `bitplaza/` | Empty. Target directory. | — |
| `bch/` | **Bitcoin Culture Hub — specification documents only.** `plan.md` (47 KB), `verticals/bitcoin.md`, `verticals/_template.md`. **No code.** | **Yes — critical** |
| `clctibles/` | CLCTibles: a curated Bitcoin art auction platform for the Midwest Bitcoin Summit 2026. Medusa v2 + Next.js monorepo. **Unrelated product.** | Reference only |

### 1.3 The BCH assets, precisely

`bch/plan.md` is a mature, well-argued platform architecture spec — and it is
recognizably the same thesis as Bitplaza under different vocabulary:

| `plan.md` calls it | Bitplaza calls it |
|---|---|
| Vertical | Plaza |
| Culture Hub (the platform) | Bitplaza |
| Bitcoin Culture Hub (vertical #1) | Bitcoin Culture Hub (the first plaza) |
| Domain → Thread → Entry | (structure of a plaza) |
| `hub_domain.color_token` | per-community brand colour |

This is a good sign. The multi-tenant spine (`vertical_id` on every row,
taxonomy-as-data, no vertical-specific strings in components, apex domain per
vertical) already anticipates exactly the parent-brand/child-plaza structure the
Bitplaza positioning requires. The rename is additive, not destructive.

**Directly reusable, at zero cost:**

- The nine entity types (`person`, `organization`, `project`, `resource`,
  `event`, `community`, `place`, `tool`, `path`) — these map cleanly onto the
  landing page's "14 people, 6 active projects, 3 upcoming events, 9
  opportunities" preview claim. The interest-selector preview should count in
  these units, not invented ones.
- The four product pillars in the brief are near-isomorphic to `plan.md`'s
  navigation model: *Discover your place* ≈ the Map/Explore; *Find your next
  move* ≈ the next-hop rule + Opportunity Engine; *Build a living identity* ≈
  `reputation_event` / XP; *Participate directly* ≈ Stage 2/3 contribution.
- Twelve Bitcoin domains and ~70 threads (`verticals/bitcoin.md` §2) — real,
  specific copy for the Bitcoin Culture Hub section. No invention needed.
- The six launch paths with concrete end-states ("owns a small amount,
  self-custodied") — excellent, concrete landing-page proof.
- `hub_domain.color_token` — the pattern that lets Bitcoin orange be *one
  community's colour among ten* rather than the site's palette. This is the
  design system solving the positioning brief structurally.
- Editorial policy (`bitcoin.md` §7) and the data commitment (`plan.md` §1.4) —
  ready-made, credible FAQ answers.

**No BCH application code exists anywhere on this machine.** `plan.md` references
a live production backend — `app/services/embedding/`, `media.py`, `org_auth.py`,
`reputation_event`, `xp_service.py`, the `organization` table, the Opportunity
Engine — none of which are present. That codebase is elsewhere (private repo, or
another machine). **I cannot inspect it, cannot reuse its components, and cannot
verify any claim about it.**

Consequence: the instruction "do not delete existing BCH functionality or data"
is satisfied trivially — there is no BCH code here to delete. The real
preservation obligation is **documentary**: don't contradict `plan.md`, don't
fork the taxonomy, don't invent a second identity model.

### 1.4 `clctibles` as a reference

Not BCH, but it is the most recent verified-working Next.js setup on this
machine, and its `HANDOFF.md` records hard-won environment facts worth carrying
over:

- Node `v26.0.0`, npm `11.12.1`, macOS darwin 25.4.0 — **confirmed by me**.
- Next `16.2.12`, React `19.2.4`, Tailwind `4.x`, Vitest `4.1.10` — installed and
  passing a full `typecheck → lint → test → build` there.
- **Next 16 breaking changes that will bite:** route `params` are Promises;
  Turbopack is the default bundler; `images.domains` is removed in favour of
  `remotePatterns`; default `images.qualities` is `[75]`.
- Playwright's cached browser build does not match the installed package version
  on this machine — launch with `chromium.launch({ channel: "chrome" })`.
- React inserts `<!-- -->` between adjacent SSR text nodes; strip comments before
  grepping served HTML in tests.

I will reuse these versions rather than resolving `latest`, because they are
verified working on this exact machine.

### 1.5 Point-by-point against the requested audit checklist

| Asked for | Finding |
|---|---|
| Existing framework and versions | **None.** Directory is empty. |
| Current folder architecture | **None.** |
| Existing design system | **None.** `bch/verticals/bitcoin.md` §3 defines the *shape* of a theme token object but leaves every value blank ("To be finalized before Phase 1"). No logo, no fonts, no colour values, no OG template found anywhere on disk. |
| Database and ORM | **None.** No Postgres client installed (`psql` absent), **Docker is not running**, no local database of any kind. |
| Authentication | **None.** `plan.md` describes JWT + an admin whitelist in the (absent) BCH backend. |
| Analytics | **None.** `plan.md` specifies instrumenting the existing `reputation_event` table — absent. |
| Email service | **None.** |
| Deployment | **None.** No Vercel CLI, no `vercel.json`, no CI config, no git remote. |
| Reusable BCH assets | Specification documents only — see §1.3. Substantial editorial and structural value; **zero reusable code**. |
| Risks and conflicts | See §7. Two are blocking. |

---

## 2. Recommended architecture

### 2.1 The stack conflict, and how to resolve it

`plan.md` §5.3 and open question #1 commit the *product* to **Vite + React +
`vite-react-ssg`, per-vertical builds, against a single FastAPI + SQLAlchemy +
Alembic backend**. The brief's preferred stack is **Next.js App Router +
Prisma**. These are incompatible.

**Recommendation: build the launch site as a standalone Next.js App Router app,
and do not treat it as part of the Culture Hub product codebase.**

Reasoning:

1. **Zero shared code.** A marketing page and a waitlist form share nothing with
   a taxonomy-driven content graph. There is no reuse being given up.
2. **`plan.md`'s reasoning for Vite does not apply here.** It chose
   `vite-react-ssg` because the product needs thousands of prerendered entry
   pages driven by a Python backend. The launch site has ~4 routes and needs
   server-side form handling — precisely Next's strength and Vite's weakness.
3. **Different lifecycle.** The launch site ships in weeks and is replaced or
   absorbed when the product launches. Coupling it to a 12-week platform build
   makes both slower.
4. **It does not foreclose anything.** When Bitplaza the product ships, the
   marketing site either stays as a separate Vercel project on the apex domain
   (normal, and what `plan.md` §3.1 already does per-vertical) or its sections
   are ported. Neither is expensive.

**This is a departure from `plan.md` and needs explicit sign-off** — see the
decisions in §9.

### 2.2 Repository shape

Single Next.js app at the repository root. **Not** an npm-workspaces monorepo.

`clctibles` uses workspaces because it genuinely has two runtimes (Next +
Medusa). Bitplaza's launch site has one. Adding workspaces later is a mechanical
move; carrying the indirection now costs clarity on every path and script.

```
bitplaza/
├── docs/                          architecture, decisions, content source
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/                        icons, manifest, static brand assets
├── emails/                        React Email templates
├── src/
│   ├── app/
│   │   ├── layout.tsx             root: fonts, theme, analytics provider
│   │   ├── page.tsx               the landing page (server component)
│   │   ├── opengraph-image.tsx    generated OG, branded
│   │   ├── sitemap.ts · robots.ts · manifest.ts · icon.tsx
│   │   ├── for-community-builders/page.tsx
│   │   ├── privacy/ · terms/ · data/     (see §7 risk R4)
│   │   └── api/
│   │       ├── waitlist/route.ts
│   │       ├── community-application/route.ts
│   │       ├── research-response/route.ts
│   │       └── admin/export/route.ts
│   ├── components/
│   │   ├── ui/                    shadcn primitives (owned, in-repo)
│   │   ├── layout/                Nav, Footer, Section, Container
│   │   ├── sections/              one file per landing section (§3)
│   │   ├── plaza/                 the spatial motif — PlazaCanvas, DistrictNode
│   │   ├── interest/              InterestSelector, PlazaPreview
│   │   └── waitlist/              WaitlistDialog, WaitlistForm, SuccessState
│   ├── lib/
│   │   ├── db.ts                  Prisma singleton
│   │   ├── validation/            Zod schemas — shared client + server
│   │   ├── waitlist/              referral codes, position, normalization
│   │   ├── security/              turnstile, rate-limit, honeypot
│   │   ├── analytics/             PostHog client + typed event catalogue
│   │   ├── attribution/           UTM + ref capture, cookie-free
│   │   └── email/                 Resend send helpers
│   ├── content/                   ALL copy as typed constants — no strings in JSX
│   │   ├── site.ts · hero.ts · pillars.ts · communities.ts
│   │   ├── bitcoin-hub.ts         sourced from bch/verticals/bitcoin.md
│   │   ├── use-cases.ts · faq.ts
│   └── styles/globals.css         Tailwind 4 @theme tokens
└── tests/                         Vitest unit + Playwright e2e
```

**The `src/content/` rule is load-bearing.** `plan.md` §6.5's core discipline is
"no component contains a vertical-specific string." Applying the same rule here
means: no copy in JSX, ever. Every headline, chip label, and FAQ answer is a
typed constant. This is what makes A/B variants, a second plaza's landing page,
and a copy review by a non-engineer cheap instead of a refactor.

### 2.3 Stack, with justification for each choice

| Concern | Choice | Note |
|---|---|---|
| Framework | **Next.js 16.2.12**, App Router | Version pinned to the one verified working on this machine. |
| Runtime | React 19.2.4, TypeScript 5.x `strict` | Same. |
| Styling | **Tailwind CSS 4** (`@theme`, CSS-first config) | No `tailwind.config.js`; tokens live in `globals.css`. |
| Components | **shadcn/ui** | Vendored into `src/components/ui/`, not a dependency. Needed: dialog, form, input, textarea, select, checkbox, accordion, toggle-group, sonner. |
| Animation | **`motion`** (Framer Motion's current package name) | v11+ publishes as `motion`, not `framer-motion`. Every animation gated on `useReducedMotion()`. |
| Database | **PostgreSQL**, hosted | See §2.4 — no local Postgres and Docker is not running. |
| ORM | **Prisma 6.x** | Per brief. Requires a pooled connection string on serverless. |
| Validation | **Zod**, schemas shared client↔server | Single source of truth; server re-validates unconditionally. |
| Email | **Resend** + **React Email** | Per brief. |
| Analytics | **PostHog** | Configured restrictively — see §2.5. |
| Bot defence | **Cloudflare Turnstile** + honeypot + timing trap + DB rate limit | Turnstile is cookie-free, which matters for this audience. |
| Deployment | **Vercel** | Per brief. |
| Testing | **Vitest 4.1.10** + **Playwright** (system Chrome channel) | Versions and the Chrome-channel workaround from `clctibles`. |

**Explicitly not introduced:** Upstash/Redis (rate limiting goes in Postgres —
waitlist volume does not justify a sixth vendor), NextAuth (admin export uses a
bearer token), any CMS, any component library beyond shadcn.

### 2.4 Database hosting — an unavoidable decision

There is no local Postgres and Docker is not running. Local development against
a real database requires standing something up. Recommendation: **Neon** —
serverless Postgres, generous free tier, branch-per-preview-deploy integrates
with Vercel, and its pooled connection string solves Prisma's serverless
connection-exhaustion problem without Prisma Accelerate.

Alternatives: Vercel Postgres (Neon under the hood, tighter integration, less
portable) or Supabase (more product than needed here). Local Docker Postgres is
possible but Docker is currently not running on this machine.

### 2.5 Analytics posture — deliberate, and a departure worth flagging

`plan.md` §1.4 rule 3 requires "opt-out of behavioral logging without degrading
the browsing experience," and §11 names "community revolt over the data layer" as
a **high**-severity existential risk with the note that this audience "*will*
read the repo." A standard PostHog drop-in — autocapture on, session recording
on, cookies set before consent — is precisely the thing that risk describes.

Recommended configuration:

- `autocapture: false`, `session_recording: false`, `capture_pageleave: false`
- **Only the twelve events the brief enumerates.** A typed event catalogue in
  `lib/analytics/events.ts`; calling `posthog.capture()` with an unlisted name is
  a type error.
- `persistence: 'memory'` until consent; cookie/localStorage persistence only
  after. Honour `navigator.doNotTrack`.
- No PII in event properties — never email, never name. `distinct_id` is a random
  anonymous id; the join to a person happens server-side only, if at all.
- A plain-language `/data` page written **before** launch, per `plan.md` §1.4
  rule 2.

This costs a little attribution fidelity. Given the audience, it is the correct
trade, and it is what `plan.md` already committed to.

---

## 3. File-by-file implementation plan

Stage numbers refer to the brief's six-stage delivery process.

### Stage 2 — Design system, shell, shared components

| File | Purpose |
|---|---|
| `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs` | Project init. `next.config.ts` uses `images.remotePatterns` (Next 16). |
| `.env.template`, `.gitignore`, `README.md` | Every env var documented with where to obtain it. |
| `src/styles/globals.css` | Tailwind 4 `@theme`: colour, type scale, spacing, radii, shadow, motion-duration tokens. Light + dark. `prefers-reduced-motion` block. |
| `src/lib/tokens.ts` | Community colour tokens (ten), mirroring `hub_domain.color_token`. Bitcoin orange lives here as one of ten. |
| `src/app/layout.tsx` | `next/font` (two families, self-hosted, `display: swap`), `<html lang>`, skip-link, theme script, analytics provider. |
| `src/components/ui/*` | shadcn primitives, restyled to Bitplaza tokens rather than default shadcn neutrals. |
| `src/components/layout/{nav,footer,section,container}.tsx` | Minimal nav: wordmark, three anchors, one CTA. Mobile sheet. |
| `src/components/plaza/plaza-canvas.tsx` | The spatial motif. Inline SVG — districts, intersecting paths, activity nodes. Deterministic layout (no `Math.random()` — it breaks SSR hydration). Static when reduced-motion. |
| `src/components/motion/*` | `Reveal`, `Stagger` wrappers. All motion goes through these so reduced-motion is enforced in one place. |
| `src/content/site.ts` | Brand constants, nav, URLs, social handles. |
| `src/lib/analytics/{client,events,provider}.tsx` | Typed catalogue; the twelve events, nothing else. |

### Stage 3 — Landing sections

`src/app/page.tsx` is a server component composing twelve sections in the brief's
order. One file each under `src/components/sections/`, each with a matching
content module:

| Section file | Content module | Client? |
|---|---|---|
| `hero.tsx` | `content/hero.ts` — eyebrow, headline, support, CTAs, trust line **verbatim from the brief** | partial |
| `problem.tsx` | `content/problem.ts` | no |
| `pillars.tsx` | `content/pillars.ts` — the four pillars, verbatim | no |
| `interest-selector.tsx` | `content/communities.ts` | **yes** |
| `bitcoin-hub.tsx` | `content/bitcoin-hub.ts` — **from `bch/verticals/bitcoin.md`**: 12 domains, the 6 paths, the tagline "The map of the rabbit hole" | no |
| `use-cases.tsx` | `content/use-cases.ts` | no |
| `open-infrastructure.tsx` | `content/infrastructure.ts` — portable identity, Nostr, CC BY-SA, AGPL. **Deep on the page, never in the hero.** | no |
| `community-builders.tsx` | `content/community-builders.ts` | no |
| `waitlist-section.tsx` | — | **yes** |
| `faq.tsx` | `content/faq.ts` | **yes** (accordion + `faq_opened`) |
| `footer.tsx` | `content/site.ts` | no |

Everything except the four client sections ships as server components — the
`clctibles` precedent (CSS-driven filtering, server-rendered cards) shows this is
achievable without contorting the code.

### Stage 4 — Interest selector and waitlist

| File | Purpose |
|---|---|
| `components/interest/interest-selector.tsx` | Ten chips, max-3 selection. Full keyboard support: roving tabindex, arrow keys, Space/Enter, `aria-pressed`, live region announcing "2 of 3 selected." |
| `components/interest/plaza-preview.tsx` | The animated result. Counts derived **deterministically from the selection** (a pure function, not `Math.random()`) so the same three interests always produce the same number — a random number that changes on re-render reads as fake. Labelled "Product preview — illustrative" in visible text, not a tooltip. |
| `lib/preview/derive-counts.ts` | That pure function, unit-tested. Units are `plan.md`'s entity types: people, projects, events, opportunities. |
| `components/waitlist/waitlist-dialog.tsx` | Dialog, focus-trapped, prefilled from selector state. |
| `components/waitlist/waitlist-form.tsx` | RHF + `zodResolver`, inline errors wired via `aria-describedby` + `aria-invalid`, error summary on submit, honeypot + timing trap, Turnstile widget. |
| `components/waitlist/success-state.tsx` | Position, referral link + copy button, the one optional research question. |
| `lib/validation/waitlist.ts` | Zod schema, shared. |
| `app/api/waitlist/route.ts` | Node runtime. Order: rate limit → honeypot/timing → Turnstile verify → Zod parse → normalize → upsert-or-return-existing → referral attribution (transaction) → email (non-blocking) → respond. |
| `app/for-community-builders/page.tsx` + `components/community/application-form.tsx` | The separate leader flow. |
| `app/api/community-application/route.ts` | Same defence chain. Creates or reuses a `WaitlistUser`, then the application row. |

### Stage 5 — Referral, email, analytics

| File | Purpose |
|---|---|
| `lib/waitlist/referral-code.ts` | 8-char Crockford base32, ambiguity-free alphabet, collision-retry. Unit-tested. |
| `lib/waitlist/position.ts` | Position assignment (see §4). |
| `lib/attribution/capture.ts` | Reads `?ref` and `utm_*` on first load into `sessionStorage`; survives the scroll to the form without a cookie. |
| `emails/waitlist-confirmation.tsx` | React Email. Position, referral link, what happens next. Plain-text alternative. |
| `emails/community-application-received.tsx` | Acknowledgement. |
| `lib/email/send.ts` | Resend wrapper. **Failures are logged and swallowed** — an email outage must never fail a signup that is already committed to the database. |
| `app/api/research-response/route.ts` | The optional discovery question. |
| `app/api/admin/export/route.ts` | Streaming CSV, `Authorization: Bearer ${ADMIN_EXPORT_TOKEN}`, constant-time compare, `noindex`. |

### Stage 6 — QA

Axe-core in Playwright across three breakpoints; keyboard-only walkthrough of the
selector, dialog, and accordion; contrast audit of every token pair; reduced-
motion pass; `next build` bundle check; Lighthouse; OG/Twitter card validation;
a rate-limit and duplicate-submission test; a "no PII in analytics payloads"
test.

---

## 4. Database changes

New database. Full schema below (Prisma, PostgreSQL).

```prisma
enum UserType {
  COMMUNITY_MEMBER
  BUILDER
  COMMUNITY_LEADER
  ORGANIZATION
  INVESTOR_PARTNER
}

enum ApplicationStatus { NEW  REVIEWING  ACCEPTED  DECLINED }

model WaitlistUser {
  id                 String    @id @default(cuid())
  email              String    @unique          // normalized, lowercase
  emailRaw           String                     // as typed, for the send
  firstName          String
  userType           UserType
  primaryGoal        String?                    // "what you most want Bitplaza to help you do"
  communities        String[]                   // max 3, enforced in Zod
  bitcoinExperience  String?
  geography          String?
  referralCode       String    @unique
  referredById       String?
  referredBy         WaitlistUser?  @relation("Referrals", fields: [referredById], references: [id])
  referrals          WaitlistUser[] @relation("Referrals")
  referralCount      Int       @default(0)
  position           Int       @unique @default(autoincrement())
  utmSource          String?
  utmMedium          String?
  utmCampaign        String?
  landingPageVariant String?
  consentTimestamp   DateTime
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt

  communityApplication CommunityApplication?
  researchResponses    ResearchResponse[]

  @@index([referredById])
  @@index([createdAt])
  @@map("waitlist_users")
}

model CommunityApplication {
  id             String   @id @default(cuid())
  waitlistUserId String   @unique
  waitlistUser   WaitlistUser @relation(fields: [waitlistUserId], references: [id], onDelete: Cascade)
  communityName  String
  communitySize  String
  currentTools   String[]
  primaryProblem String
  plazaVision    String                     // "what they'd want their plaza to enable"
  website        String?
  status         ApplicationStatus @default(NEW)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  @@map("community_applications")
}

model ResearchResponse {
  id             String   @id @default(cuid())
  waitlistUserId String
  waitlistUser   WaitlistUser @relation(fields: [waitlistUserId], references: [id], onDelete: Cascade)
  question       String
  response       String
  createdAt      DateTime @default(now())
  @@index([waitlistUserId])
  @@map("research_responses")
}

model RateLimitCounter {                    // not in the brief; required by it
  key         String   @id                  // sha256(ip + route), never raw IP
  windowStart DateTime
  count       Int      @default(0)
  @@index([windowStart])
  @@map("rate_limit_counters")
}
```

**Deltas from the brief's spec, and why:**

1. `emailRaw` added alongside normalized `email`. Normalization must not destroy
   the address actually needed for delivery.
2. `plazaVision` added to `community_applications` — the brief lists it as a form
   field but omits it from the model.
3. `RateLimitCounter` added — the brief mandates rate limiting without providing
   a place to store it. Key is a hash; **the raw IP is never persisted**,
   consistent with `plan.md`'s `ip_hash` convention.
4. `communities` and `currentTools` use native Postgres `text[]` rather than a
   join table. They are filter-and-export data, never joined against.
5. `position` uses a Postgres sequence. Rolled-back inserts leave gaps; nobody
   observes the sequence, so this is acceptable and far simpler than a
   transactional counter. Flagging it so it is a decision, not an accident.

**Implementation notes:**

- **Email normalization:** trim, lowercase, NFKC, strip Gmail dots and `+tags`
  for `@gmail.com`/`@googlemail.com` only. Aggressive normalization across all
  providers wrongly merges distinct people at some hosts.
- **Duplicate prevention:** unique index on `email`, plus an application-level
  check. On duplicate, **return the existing user's position and referral code**
  rather than an error. This is better UX and they already have both by email.
  *Trade-off: it confirms membership to anyone who guesses an address.* For a
  public waitlist this is low-stakes and I recommend accepting it — but it is a
  deliberate choice, not an oversight.
- **Referral attribution** runs inside a single transaction: resolve code →
  reject self-referral → set `referredById` → increment referrer's
  `referralCount`. An invalid code is ignored silently, never a form error.

---

## 5. Dependency changes

All new. Versions pinned where verified on this machine; marked `~` where the
current release should be confirmed at install.

**Runtime:** `next@16.2.12`, `react@19.2.4`, `react-dom@19.2.4`, `motion@~11`,
`@prisma/client@~6`, `zod@~3`, `react-hook-form@~7`, `@hookform/resolvers@~3`,
`resend@~4`, `@react-email/components@~0`, `posthog-js@~1`, `posthog-node@~4`,
`@marsidev/react-turnstile@~1`, `clsx`, `tailwind-merge`,
`class-variance-authority`, `lucide-react`, plus Radix primitives pulled in by
shadcn.

**Dev:** `typescript@~5`, `tailwindcss@4`, `@tailwindcss/postcss`, `prisma@~6`,
`eslint` + `eslint-config-next`, `vitest@4.1.10`, `@vitejs/plugin-react`,
`@testing-library/react`, `@testing-library/user-event`, `jsdom`,
`@playwright/test`, `@axe-core/playwright`, `tsx`, `prettier` +
`prettier-plugin-tailwindcss`.

**Accounts required before Stage 4 can be completed:** Neon (or equivalent),
Resend + a verified sending domain (DNS records, and warm-up lead time),
PostHog, Cloudflare Turnstile, Vercel.

---

## 6. Assumptions

Stated explicitly because several are load-bearing and I cannot verify them.

1. `/Users/tommyjohn/Documents/bitplaza` is intended as a **new repository**, not
   a checkout that failed. I will `git init` before writing code.
2. `bch/plan.md` and `verticals/bitcoin.md` are the **current and authoritative**
   product specification, and Bitplaza is a rebrand/expansion of it rather than a
   competing effort.
3. The BCH production backend exists but is **out of scope and unreachable**. The
   launch site talks to its own database and shares nothing with it.
4. The interest-preview numbers ("14 people, 6 active projects…") are
   **illustrative**, per the brief. I will label them as a product preview in
   visible copy.
5. The apex domain is `bitplaza.com` or similar and is **not yet registered or
   configured**. Canonical URL comes from `NEXT_PUBLIC_SITE_URL`.
6. There is **no brand identity yet** — no logo, no wordmark, no type pairing, no
   colour values. I will propose a complete system in Stage 2. If one exists off
   this machine, providing it before Stage 2 saves a rework cycle.
7. No launch date, traffic estimate, or press plan was given. I am sizing for
   thousands, not millions, of signups; the architecture scales past that but the
   rate limits and export endpoint are tuned for the former.
8. English only. No i18n scaffolding.
9. The "Explore the vision" secondary CTA scrolls to the pillars section rather
   than routing to a separate `/vision` page — keeping one focused conversion
   surface. Easy to change; flagging because it is a real product choice.

---

## 7. Risks and conflicts

Ordered by severity. **R1 and R2 block Stage 2.**

### R1 — Positioning collision: venture-scale company vs. non-commercial public good · **BLOCKING**

The brief's goal 7 is to "establish Bitplaza as a credible, **venture-scale
consumer technology company**," and includes "Investor or partner" as a waitlist
segment.

`plan.md` §1.4 states, in bold: "**Culture Hub is a free, open, non-commercial
public good.** No ads, no paywalls, no paid placement, no selling user data,"
recommends **AGPL-3.0** and a **foundation + commercial entity** structure, and
records this as an **open blocker**:

> "Bitcoin Culture Hub, **Inc.** has a live investor data room whose tech
> document frames the reputation graph and semantic matching as the moat… **This
> must be resolved before Phase 1 ships.**"

These cannot both be the headline. The landing page's FAQ will be asked "how do
you make money," "is this open source," and "what do you do with my data" on day
one — by an audience `plan.md` itself calls "the most surveillance-sensitive on
the internet." Answering inconsistently with a public GitHub repo or the investor
materials is the "community revolt" risk in `plan.md` §11, which is rated
existential.

I cannot write the FAQ, the infrastructure section, or the footer without a
position. **This needs a decision, not an assumption.**

### R2 — `plan.md` mandates a stack the brief does not · **BLOCKING**

Vite/`vite-react-ssg` + FastAPI vs. Next.js + Prisma. §2.1 recommends resolving
this by scoping the launch site *outside* the product codebase. That is a real
architectural commitment and needs sign-off, since it means the org will run two
frontend stacks.

### R3 — No brand identity exists · **High**

`verticals/bitcoin.md` §3 defines the token *shape* and leaves every value blank.
No logo or wordmark exists anywhere on this machine. The brief's design
direction is rich but proscriptive — it rules out far more than it specifies.
Stage 2 will therefore *propose* a full identity. If one already exists
elsewhere, the cost of not sharing it is a discarded design pass.

### R4 — Legal pages are required and cannot be invented · **High**

A consent checkbox and a GDPR-relevant data commitment need a real privacy
policy. `plan.md` action item #5 assigns "`/about/data` in plain language" to the
Owner. I will build the routes and write an honest plain-language data page
describing exactly what the site collects. I will **not** invent binding legal
terms — `/terms` ships as a clear placeholder pending counsel, matching the
approach the `clctibles` handoff took for its unresolved auction terms.

### R5 — The preview numbers are fabricated · **Medium**

"14 people, 6 active projects, 3 upcoming events, 9 opportunities" describes a
product with no content in it. `plan.md`'s own coverage gate says a domain below
60 entries ships as "Coming soon" rather than looking abandoned. Mitigation:
deterministic derivation, explicit visible "product preview" labelling, and
framing in the future conditional ("could connect you with"), which the brief's
own copy already does. Flagging because credibility is the entire asset here and
this is the one element of the page that could undermine it.

### R6 — No local database; Docker not running · **Medium**

Blocks all of Stage 4 until §2.4 is decided and provisioned. Mitigable by
developing sections 2–3 first, which is already the stage order.

### R7 — Email deliverability lead time · **Medium**

Resend needs a verified sending domain: DNS records, SPF/DKIM/DMARC, and warm-up
before volume. If DNS is not yet delegated for the apex domain, this is on the
critical path and should start now, in parallel with Stage 2.

### R8 — Referral abuse · **Medium**

Referral counts create an incentive to farm signups. Turnstile + rate limiting +
self-referral rejection cover the casual case. A determined attacker with a
catch-all domain is not stopped by anything short of email verification.
Recommendation: keep referral count as an internal signal and avoid a public
leaderboard at launch.

### R9 — Next 16 sharp edges · **Low**

Documented in `clctibles/HANDOFF.md` and listed in §1.4 above. Known and
avoidable, not discovered mid-build.

### R10 — Interest-chip naming vs. the Bitcoin taxonomy · **Low**

The brief's ten chips (Bitcoin, AI, Design, Collecting, …) are marketing
categories; `bitcoin.md`'s twelve domains are the product taxonomy. Keeping them
in separate content modules, with chips explicitly labelled "communities" and not
"domains," avoids a rename when the two meet.

---

## 8. Testing plan

**Unit (Vitest)** — pure logic only, no `server-only` imports (the `clctibles`
handoff records that trap):
`derive-counts` determinism and bounds · referral-code alphabet, length, and
collision retry · email normalization incl. the Gmail-only rule · Zod schemas at
every boundary (0/1/3/4 communities, malformed email, missing consent, over-long
free text) · UTM/ref parsing incl. injection-shaped inputs · CSV escaping for
values containing commas, quotes, newlines, and a leading `=` (spreadsheet
formula injection).

**Component (Vitest + Testing Library)** — selector max-3 enforcement and
keyboard model · form error rendering and `aria-describedby` wiring · success
state · FAQ accordion semantics. No fake timers alongside `userEvent` — that
deadlocks (again, from the `clctibles` handoff).

**API (integration, test database)** — happy path end-to-end · duplicate email
returns existing position, creates no row · referral attribution increments
exactly once · self-referral rejected · unknown referral code ignored, signup
still succeeds · honeypot filled → silent 200, no row · Turnstile failure → 400 ·
rate limit → 429 · **email provider down → signup still persists** · oversized
payload rejected.

**E2E (Playwright, `channel: "chrome"`)** — full funnel at 375/768/1440 ·
`?ref=CODE&utm_source=x` survives to a persisted row · community-builder flow ·
`prefers-reduced-motion` renders a static page with no animation · keyboard-only
completion of the entire funnel.

**Accessibility** — axe-core, zero serious/critical violations on every route at
three breakpoints · manual keyboard-only pass · programmatic contrast check of
every token pair against AA · heading-order assertion (exactly one `h1`) ·
VoiceOver spot-check of the selector's live region.

**Performance** — Lighthouse ≥ 90 across all four categories on the production
build · LCP < 2.5s and CLS < 0.1 on a throttled mobile profile · bundle report
with a documented budget · zero horizontal overflow at every breakpoint
(`scrollWidth` vs `clientWidth`, the `clctibles` method).

**Security** — verified no PII in any analytics payload · admin export rejects
missing/wrong/empty bearer tokens · rate limiter holds under concurrent
submissions · no secret reachable from the client bundle (grep the build output).

**Gate:** `npm run verify` = `typecheck → lint → test → build`, mirroring the
`clctibles` convention. Nothing is reported as complete without it passing.

---

## 9. Decisions — RESOLVED 2026-07-29

| # | Decision | Resolution |
|---|---|---|
| 1 | **Positioning (R1)** | **Mozilla shape — say both, honestly.** A foundation holds the open map, the data commitment and the CC BY-SA dataset; a company builds the product layer on top. This matches `plan.md` §1.4's own recommendation and open question #9. R1 is unblocked. |
| 2 | **Stack (R2)** | **Standalone Next.js repo in `bitplaza/`.** Next 16 App Router + Prisma, own git repo, own Vercel project, no workspaces. The org accepts two frontend stacks. R2 is unblocked. |
| 3 | **Database host (§2.4)** | **Neon.** Pooled connection string for Prisma; branch-per-preview on Vercel. |
| 4 | **Brand identity (R3)** | **Propose 2–3 distinct directions first**, then build out the chosen one. Stage 2 opens with the comparison. |

### 9.1 What decision 1 commits the copy to

Binding on the FAQ, the open-infrastructure section, the footer and `/data`:

- The **map, the taxonomy and the dataset are open** — CC BY-SA content, AGPL-3.0
  client, portable via Nostr. Say so plainly.
- **No ads, no paid placement, no selling user data.** `plan.md` §1.4 rule 1:
  aggregate-only externally, never per-user.
- **The company is real and is funded**, and builds the product layer — identity,
  reputation, the Opportunity Engine, AI matching. The "Investor or partner"
  waitlist segment stays.
- The honest sentence the FAQ needs: *the map belongs to everyone; the tools
  built on top of it are how we sustain building them.*
- Do **not** claim the foundation exists yet if it does not. `plan.md` §12 action
  #2 has this as an open leadership item. Copy should describe the commitment,
  not assert a legal structure that has not been formed.

Everything else in this document proceeds as specified.
