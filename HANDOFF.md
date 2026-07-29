# Bitplaza — Handoff

Written 2026-07-29. Everything needed to resume with no prior conversation
context. Read alongside `README.md` (commands, setup) and `design.md` (the
authoritative visual spec). Where documents overlap, this one has the history
and the reasoning; `design.md` has the decisions.

---

## 1. Where this came from

`/Users/tommyjohn/Documents/bitplaza` was **empty** when work began — no repo,
no code. The original brief assumed an existing repository to audit; there was
none. Two sibling directories matter:

- **`../bch/`** — Bitcoin Culture Hub **specification documents only**
  (`plan.md`, `verticals/bitcoin.md`). No code. This is the product thesis
  Bitplaza is the rebrand/expansion of: `plan.md`'s "vertical" = Bitplaza's
  "plaza". The BCH *production backend* referenced in those docs
  (`reputation_event`, Opportunity Engine, etc.) is **not on this machine** and
  was never inspected.
- **`../clctibles/`** — an unrelated auction project. Useful only as the source
  of verified environment facts (Next 16 gotchas, Playwright workaround).

This repo is the **launch site + waitlist**, deliberately standalone from the
future product codebase (which `bch/plan.md` commits to Vite + FastAPI). The
reasoning is `docs/00-audit-and-architecture.md` §2.1; the decision was made by
the user, along with three others recorded in §9 of that file:

1. **Positioning: Mozilla shape** — the map/dataset is open (CC BY-SA, AGPL);
   the company builds the tools on top. Binding on FAQ/footer/`/data` copy.
   **Never claim the foundation exists — it has not been formed.**
2. **Stack:** standalone Next.js in this repo.
3. **Database: Neon** — chosen, **not yet provisioned**.
4. **Brand:** was "show directions first" → Blue Hour hybrid was built → then
   **replaced wholesale by `design.md` v2.0** (see §3 below).

## 2. State of the repo — four commits, all local

```
a20079c  Phase 1 of design.md v2.0 (apricot identity, arch, Bricolage)  ← HEAD
61f58b1  design.md v2.0 written; docs/01 marked superseded
569fd6f  Stage 3: seven landing sections
c8d7b6d  Scaffold: design system, shell, shared components
```

**No GitHub repo exists. `gh` is not authenticated.** User must run
`gh auth login`, then create + push. Git identity is set repo-locally
(Tommy John / team@houseofnaka.com).

Stack: Next 16.2.12 (App Router, Turbopack), React 19.2.4, Tailwind 4, TS
strict, Vitest 4.1.10 (81 tests), Playwright (system Chrome only). Routes:
`/`, `/data`, `/privacy`, `/terms` — all static. `npm run verify` = typecheck →
lint → test → build; it passes at HEAD and is the gate for "done".

## 3. The design pivot — the single most important thing to know

The site was first built as **"Blue Hour"**: dark-first, Marcellus serif, a
canvas of thin network lines (`PlazaField`). The user then requested a
Buzz-inspired rewrite of the design spec, which produced **`design.md` v2.0** —
and that spec **prohibits** all three of those things (§23).

- `design.md` is the **only** authoritative visual spec.
  `docs/01-design-system.md` is superseded (banner at top) — its *architecture*
  notes still apply, its *values* do not.
- **Phase 1 is implemented** (commit `a20079c`): apricot/cream palette both
  modes, Bricolage Grotesque + Geist + Geist Mono, the arch mark + wordmark,
  pill buttons with print-offset shadow, SVG colonnade hero, CSS-only ambient
  drift, grain + misregistration texture utilities.
- **Phases 2–4 are not built.** The seven sections below the hero are
  **re-tokened but still Stage-3 shapes** — they look coherent but are not yet
  the §16 eight-district narrative (no scattered-fragments convergence, no
  plaza-portal field, no eight scenes, no Regulars in sections, no district 5/6
  as specified).

Key v2.0 facts a resumer must not re-derive:

- **White on apricot (#FF6A3D) is 2.85:1 and FAILS.** Apricot takes ink text
  only. A test asserts this.
- **Per-community on-fill is measured, not conventional** — 4 take ink, 6 take
  white. Tests assert the recorded choice is the better of the two.
- The ten communities are **fixed by the product brief** (they are the interest
  selector's options): bitcoin, music, design, opensource, local, collecting,
  education, gaming, **entrepreneurship** (NOT sports — that was a drift,
  caught and fixed), ai. Statuses: bitcoin=live, others forming/idea.
- Every ratio quoted in `design.md` §8 was machine-verified against the doc
  text itself. If you change a value, re-check the prose beside it.

## 4. Architecture that must survive any redesign

These carried over from Blue Hour *by design* (design.md §24) and are the
expensive part:

1. **Token layering.** Raw values live ONLY on `:root` + the two
   `[data-theme]` selectors + the dark media query in `globals.css`; components
   consume via `@theme inline` mappings. Each palette is written **twice**
   (media query and data-theme) — editing one is the classic bug;
   `tests/tokens.sync.test.ts` parses the CSS and catches it.
2. **`design-tokens.ts` / `communities.ts` mirror the CSS** and feed
   `tests/tokens.contrast.test.ts` (worst-case across all three grounds, AA).
   Never fix a mismatch by editing one side.
3. **Reveal system** (`reveal.tsx` + `reveal-observer.tsx`): content is visible
   by default; JS opts INTO hiding via `html.js` set in `THEME_INIT_SCRIPT`
   (`src/lib/theme.ts`) before first paint. IntersectionObserver is paired with
   a **bounding-box sweep** because IO misses elements when the viewport jumps
   (End key, scrollbar drag, restored scroll). Both halves fixed real bugs —
   do not "simplify" back to Motion's `whileInView` (it ships `opacity:0` from
   the server → blank page without JS).
4. **Analytics** (`src/lib/analytics/`): closed catalogue of exactly the 12
   brief events, typed so unlisted names don't compile; forbidden keys (PII)
   throw in dev. PostHog: autocapture/recording/heatmaps/perf/IP all OFF,
   `persistence: "memory"`. **No consent banner on purpose** — plan.md §1.4 is
   opt-OUT; the control is in the footer (`analytics-opt-out.tsx`); DNT/GPC are
   a hard stop. Inert without `NEXT_PUBLIC_POSTHOG_KEY`.
5. **All copy in `src/content/*` as typed constants.** No strings in JSX. Hero
   headline is an **array of authored lines**, never a wrapped string.
6. **Theme**: `useSyncExternalStore` (not mounted-flag effects — Next 16 lint
   rejects those); three-state toggle (light/dark/system).

## 5. Verified vs NOT verified

**Verified at HEAD** (real Chrome via Playwright `channel: "chrome"`, 1440
light/dark + 390 mobile): zero axe violations (wcag2a/aa/21a/21aa/22aa); no
horizontal overflow; zero console errors/failed requests; zero white-on-apricot
pairs in computed styles; Bricolage resolving at `font-stretch: 112%`; no-JS
renders the full hero (48 SVG paths) and full page content; reduced-motion
leaves nothing hidden; deep links reveal correctly. 81 unit tests green.

**NOT verified / not built:**

- **No database.** Prisma is a dependency but there is **no `prisma/` dir, no
  schema, no migrations, no Neon project**. The full schema (incl. deltas:
  `emailRaw`, `plazaVision`, `RateLimitCounter` with hashed keys) is designed
  in `docs/00-audit-and-architecture.md` §4 — build from there.
- **No waitlist.** No forms, no API routes, no Zod schemas, no
  Turnstile/honeypot/rate limiting, no referral system. `#waitlist` and
  `#plaza-builder` anchors are **inert**; nav/footer entries for them are
  commented out in `src/content/site.ts` waiting for the sections.
- **`/for-community-builders` does not exist** but IS linked from the
  community-builders section CTA → **currently 404s**. Either build it next or
  unlink it.
- No email (Resend), no OG image/favicon/app icons (favicon is still scaffold
  default), no sitemap/robots, no e2e specs in-repo (auditing was done with
  throwaway scripts), no Lighthouse run, no deploy, no `.env.local`.
- Accounts needed before Stage 4/5 finish: Neon, Resend (+ sending-domain DNS —
  long lead time, start early), PostHog, Turnstile, Vercel.

## 6. Gotchas — will bite

1. **macOS `sed` has no `\b`** — bulk renames silently no-op. Use `perl -pi -e`.
   And perl eats `${...}` in TSX template literals ($ interpolation) — check
   `layout.tsx` className after any bulk edit.
2. **Playwright must launch `channel: "chrome"`** — cached browser mismatch on
   this machine.
3. **Background dev/build servers die when a harness task ends.** Start with
   `nohup ... & disown` (see README) or the port stays stuck; if EADDRINUSE:
   `pkill -f "next start"` then `lsof -ti:PORT | xargs kill -9`.
4. **A stale browser tab from clctibles polls `localhost:3000`** (`GET
   /item/...` 404s in dev logs). Harmless; the two projects fight over :3000.
5. `fullPage` screenshots resize the viewport → re-fires the reveal sweep →
   captures mid-fade "empty" sections. Set `data-revealed` on everything and
   wait before capturing (pattern in git history of the audit scripts).
6. Next 16: route `params` are Promises; `images.remotePatterns` not
   `.domains`; React SSR inserts `<!-- -->` between text nodes (strip before
   grepping HTML); Vitest fake timers deadlock `userEvent`.
7. The tokens sync test **strips CSS comments before parsing** because the
   file's prose mentions `:root`/`@theme inline`. Keep it that way.
8. Watch for **full-width unicode in hex values** — `#54423６` shipped once in
   design.md; a validator caught it. Grep `#[0-9A-Fa-f]*[^\x00-\x7F]`.
9. `.gitignore` has `.env*` with `!.env.template` — keep the exception when
   touching it.

## 7. Next steps, in order

**A. Phase 2 — build the world** (design.md §16/§24; user has seen Phase 1 and
not yet signed off on hero direction — confirm before deep investment):
districts 2 (scattered→converge), 3 (portal field, `--radius-arch`, three
status states), 4 (eight scenes, not cards), 5 (identity, no Regulars), 6
(built in the open, mono voice), 8 (apricot full-bleed close). Rebuild
header/footer to spec. Regulars component + artifact library.

**B. Stage 4 — waitlist** (the actual business goal; can precede Phase 2 if
conversion matters more than looks): provision Neon → `prisma/schema.prisma`
from docs/00 §4 → Zod schemas shared client/server → interest selector
(max 3, roving tabindex, live region) → deterministic preview counts (pure
function, no Math.random — same inputs, same numbers, labelled "product
preview") → waitlist form + `/api/waitlist` (rate limit → honeypot/timing →
Turnstile → Zod → normalize (Gmail-only dot/plus stripping) → upsert; duplicate
returns existing position/code) → referral attribution in one transaction
(self-referral rejected, unknown code ignored) → `/for-community-builders`.

**C. Stage 5** — Resend + React Email (email failures must never fail a
committed signup), referral link UI, research-response endpoint, CSV export
(Bearer `ADMIN_EXPORT_TOKEN`, constant-time compare, formula-injection-safe
escaping).

**D. Stage 6** — QA per docs/00 §8: axe on all routes, keyboard-only funnel,
Lighthouse ≥90×4, OG/social image (arch on apricot), favicon set, sitemap,
robots, FAQ/Org schema already in place; then Vercel + GitHub.

**Copy debt:** hero headline changed to "Find your people." (design.md voice)
— the brief's original was "Enter the communities that shape your life.",
still in `SITE.tagline` / metadata. Reconcile with the user. `/data` needs
owner review before launch (governance paragraph). `/privacy` `/terms` are
honest placeholders pending counsel — do not invent terms.

## 8. File map (beyond README's)

- `design.md` — THE spec. §8 palette (measured), §16 homepage districts, §18
  per-component specs, §23 anti-patterns, §24 phases + keep/retune/delete.
- `docs/00-audit-and-architecture.md` — audit; DB schema §4; testing plan §8;
  the four resolved decisions §9 (+ §9.1 what Mozilla-shape binds copy to).
- `docs/01-design-system.md` — superseded; architecture reasoning only.
- `src/components/plaza/colonnade.tsx` — hero SVG. Arch proportions are
  hand-set (1:1.0–1:1.7); at 1:3.5 they read as rounded rectangles (§6 of this
  file's history). `wordmark.tsx` — PlazaMark (open base — closed = tombstone).
- `src/components/ui/button.tsx` — variants incl. `inverse` for saturated
  fields; only primaries lift.
- Old three-directions artifact (Blue Hour era, historical):
  https://claude.ai/code/artifact/98764d01-5d7d-4118-a8c9-94ef63ef8be2

## 9. Session leftovers

A dev server may be running on :3000 (`lsof -ti:3000 | xargs kill` to stop).
Screenshots/audit scripts lived in an ephemeral scratchpad — **gone after this
session**; re-create from the patterns in git history (they were never
committed). Nothing in the repo depends on them.

---

## 10. Addendum — Stage 4/5 shipped (later on 2026-07-29)

§5's "NOT verified / not built" list is now largely stale. In this session:

- **Database exists.** `prisma/schema.prisma` built from docs/00 §4 (all four
  models incl. the deltas), initial migration applied. Local dev + integration
  tests run against Docker (`bitplaza-pg`, postgres:16-alpine, **port 5433**);
  `.env` (gitignored) points at it. Neon still not provisioned — production
  needs it, plus Resend/Turnstile/PostHog keys per `.env.template`.
- **Waitlist is live end-to-end**: interest selector (#plaza-builder, roving
  tabindex, max 3, shared store) → deterministic preview (labelled
  illustrative) → form (#waitlist, RHF+Zod shared schemas) → `/api/waitlist`
  (rate limit in Postgres w/ hashed keys → honeypot+timing w/ deterministic
  decoy success → Turnstile pass-open when unconfigured → Zod → Gmail-only
  normalization → upsert-returns-existing → referral attribution in one
  transaction) → success state with referral link, copy, X/native share, and
  the optional research question (`/api/research-response`, keyed by referral
  code, capped 5/user).
- **`/for-community-builders` built** (was a 404): application form +
  `/api/community-application` (same defence chain; upsert revises).
- **Email**: `emails/*.tsx` React Email + `lib/email/send.ts`. Failures logged
  and swallowed — proven by integration tests that mock `resend` to throw on
  every send. Inert without `RESEND_API_KEY`. Path alias `@emails/*` added.
- **CSV export**: `/api/admin/export`, Bearer + timingSafeEqual, streams,
  formula-injection-safe (`lib/waitlist/csv.ts`).
- **New `--bp-danger` token** (form errors), added in all four palette blocks +
  `@theme inline` + design-tokens.ts + sync-test VAR_FOR, AA-checked in
  `tests/tokens.danger.test.ts`.
- Nav/footer anchors un-commented in `site.ts`. AttributionCapture (cookie-free
  `?ref`/`utm_*` → sessionStorage) mounted in layout.
- **156 tests green** (was 81) incl. `tests/api.waitlist.integration.test.ts`
  against the real local Postgres; `npm run verify` passes; production build
  smoke-tested by hand (signup 201 / duplicate 200 / honeypot decoy, no row).
- Gotcha found: the react-hooks lint rejects `handleSubmit(cb)` called during
  render when `cb` reads refs — apply it inside `onSubmit` instead. And
  `vitest.setup.ts` must guard `window` (node-env integration tests).

Still open: Neon + Vercel + DNS/Resend verification, OG image/favicons/
sitemap/robots, e2e Playwright specs, Lighthouse, referral "moves you up the
list" copy implies an admission-order policy — referralCount is recorded, the
policy itself is a launch-ops decision.
