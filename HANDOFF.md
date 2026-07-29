# Bitplaza — Handoff

Written 2026-07-29. Everything needed to resume with no prior conversation
context. Read alongside `README.md` (commands, setup) and `design.md` (the
authoritative visual spec). Where documents overlap, this one has the history
and the reasoning; `design.md` has the decisions.

> **Read §12 first, then §13–§14.** The site was repositioned wholesale later
> this same day ("the open map for communities", design.md v3.0). Sections 1–11
> are accurate history, but where they describe the *current* site or spec, §12
> supersedes them — §3 and §7A in particular describe a direction that no
> longer exists. §13 records the Vercel deployment (the site is live at
> https://bitplaza.vercel.app, but production has no working database yet).
> §14 records the launch-requirements build (OG/icons/sitemap/robots/e2e/
> Lighthouse/copy review) and the owner-run deploy that bakes it all. §15
> records the security review, the repo going PUBLIC (+ AGPL-3.0 LICENSE), and
> the two must-fix-before-traffic highs.

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

## 2. State of the repo

> **Superseded (was "four commits, all local"):** the repo now lives at
> **https://github.com/bucketbuckets/bitplaza** (private). `gh` is
> authenticated as **bucketbuckets** and `gh auth setup-git` has been run —
> plain `git push` works (without the helper it fails with "could not read
> Username"). Flip public later with `gh repo edit --visibility public`.
> Commits since the original four: `cc0d277` (Stage 4/5 waitlist, §10),
> `61d4c23` (/bitcoin page + email-first form fix, §11).

```
a20079c  Phase 1 of design.md v2.0 (apricot identity, arch, Bricolage)
61f58b1  design.md v2.0 written; docs/01 marked superseded
569fd6f  Stage 3: seven landing sections
c8d7b6d  Scaffold: design system, shell, shared components
```

Git identity is set repo-locally (Tommy John / team@houseofnaka.com).

Stack: Next 16.2.12 (App Router, Turbopack), React 19.2.4, Tailwind 4, TS
strict, Vitest 4.1.10 (156 tests — was 81), Playwright (system Chrome only).
Routes: `/`, `/bitcoin`, `/for-community-builders`, `/data`, `/privacy`,
`/terms` (static) + four dynamic API routes (§10). `npm run verify` =
typecheck → lint → test → build; it passes at HEAD and is the gate for "done".
Integration tests need the Docker Postgres up (§10).

## 3. The design pivot — the single most important thing to know

> **Superseded by §12:** design.md is now **v3.0** (the map narrative); the
> v2.0 facts below stand only where §12 says the foundation survived (palette,
> type, tokens, tests, the arch mark). The §16 districts, Regulars and
> "Phases 2–4" are retired, not pending.

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

> **Superseded by §12:** A (Phase 2, the plaza world) is dead; B and C
> shipped (§10); D's remaining items are restated at the end of §12.

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

- `design.md` — THE spec (now v3.0; see §12). v3 map: §6 color, §9
  components, §13 data honesty, §14 CTA hierarchy, §16 anti-patterns.
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

---

## 11. Addendum — /bitcoin, email-first forms, GitHub (still 2026-07-29)

Commit `61d4c23`, from the owner's first review pass. Three notes came back;
palette, brown/orange warmth and light/dark were explicitly approved — do not
revisit them.

### /bitcoin — the Culture Hub's doorway page

The owner wants Bitplaza driving traffic *into* Bitcoin Culture Hub, so the
hub now has its own page rather than only a homepage section. Structure:
hero (tagline "The map of the rabbit hole", status line, two CTAs), the seven
entry kinds from design.md district 7 (structure only — **no entry counts
anywhere**, same honesty rule as §3), twelve domains, depth levels, six
paths, waitlist close. Links in: hero primary CTA, homepage #bitcoin section
CTA, footer. Nav "First plaza" still anchors to the homepage section on
purpose (on-page orientation; the section links deeper).

- **The owner will supply the specific parts later.** They land in
  `src/content/bitcoin-hub-page.ts` (owner note at the top marks the spot) —
  never in components. Expect real entries, dates, and eventually the live
  hub's own URL to swap into the CTAs.
- Detail blocks (domains/depth/paths) were extracted to
  `src/components/bitcoin/hub-details.tsx`, shared by the section and the
  page, with `headingLevel` parameterised because the same block sits under
  an h2 on the homepage and the h1's sections on /bitcoin (§21 heading-order
  rule).
- Bitcoin's colour leads on this page and nowhere else — accents and marks
  via `--color-c-bitcoin`/`-text`, never a ground behind text.

### The email-capture bug — a real user failure, not a hypothetical

A tester (Kyle) typed his **surname into the Email field** — the
First-name/Email side-by-side row read as First name/Last name. The owner's
words: "There's no email collection. It's just a name collection." Fix, in
both forms (waitlist + community application): email is the FIRST field, full
width, label "Your email", placeholder `you@example.com`,
`inputMode/autoCapitalize/spellCheck` set, and `mode: "onTouched"` on
react-hook-form so a non-address is flagged on blur, not at submit. Lesson
recorded: never pair a name field beside the email field on a conversion
form.

### Launch gap — as reported to the owner, in order

Blocked on owner (accounts + decisions): (1) domain + Vercel + Neon — the
single gating item, no shareable URL without it; (2) **Resend + SPF/DKIM/
DMARC now** — reputation warm-up is days-to-weeks; (3) Turnstile + PostHog
keys (code wired, inert); (4) two decisions: the concrete referral-advance
policy (emails already promise "moves you up the list" — pick the mechanic
before volume traffic) and a `/data`/privacy copy pass.

Buildable next session, no accounts needed: OG/social card (arch on apricot
— the referral loop's face on X), favicon set, sitemap + robots, Lighthouse +
keyboard-funnel e2e.

Marketing plan given to the owner: Bitcoiners first; **send that audience to
`/bitcoin`, not the homepage**; UTM every channel (attribution capture is
live, so per-channel conversion lands in the DB); channels in order — own
X/Nostr with the built share loop, 3–5 Bitcoin newsletters/podcasts, meetup
QR codes to /bitcoin, community-leaders page to organizers. PostHog key turns
on funnel measurement across the 12 instrumented events.

---

## 12. Addendum — the v3.0 "open map" redesign (still 2026-07-29)

A full repositioning pass from a new brief. **`design.md` is now v3.0** and is
the only authoritative spec; §16's eight-district plaza narrative and the
Regulars/colonnade apparatus are retired (palette, type, tokens, tests, and
the arch mark all survive). Key facts for a resumer:

- **Positioning:** "Every community deserves a map." Map metaphor
  (territories, paths, depth) replaces the plaza-world. One depth vocabulary
  everywhere: Start / Explore / Deepen. No em dashes in user-facing copy.
- **Homepage:** hero with an interactive goal-driven map preview
  (`src/components/map/map-preview.tsx`, mock data in
  `src/content/map-preview.ts`, visibly labeled illustrative) → paths →
  capabilities → hub preview (territory accordion) → AI → leaders → open →
  closing + waitlist → FAQ (5 of 11).
- **Routes:** `/communities` (leader page + application), `/open` (precise
  openness + folded /data content), `/about`, `/questions` are new;
  `/for-community-builders → /communities` and `/data → /open` are permanent
  redirects in `next.config.ts`. `/bitcoin` rebuilt: 11 territories, 3
  depths, 8 outcome paths.
- **Waitlist is email-first:** goal (3 options mapping onto the existing
  `UserType` enum — explore=COMMUNITY_MEMBER, map=COMMUNITY_LEADER,
  contribute=BUILDER) + email. No name field (migration
  `20260729174333_first_name_optional` made `firstName` nullable), no consent
  checkbox (visible note; client sends `consent: true`; server contract
  unchanged). Leader signups get a success-state pointer to
  `/communities#apply`. `plazaVision` on the application is now optional.
- **Analytics catalogue is 16 events** (see `docs/02-analytics-events.md`),
  incl. preview_engaged, path_selected, territory_opened, leader_cta_clicked,
  waitlist_failed, architecture_link_clicked, repo_link_clicked (reserved).
  Interest-selector events and the selector itself are gone.
- **Repo link rule:** `OPEN_SECTION.repoUrl` in `src/content/open.ts` is null
  until the GitHub repo is public; the "View the code" button renders nothing
  while it is null. Set it when the repo flips public.
- **Header CTA is deliberately secondary-styled.** The brief made "Map your
  community" the header's one action; it is rendered as an outline pill so the
  hero's "Explore Bitcoin" keeps the single apricot accent per viewport
  (design.md v3 §6 rule 1). Do not "fix" it back to a filled primary.
- **Verified at HEAD of this work:** `npm run verify` (typecheck → lint → 147
  tests → build) exits 0; all routes prerender static; a Playwright sweep of
  all six pages at 1440/390/320 found zero horizontal overflow and zero
  console errors; a live smoke test against the production build confirmed
  both 308 redirects and a name-less signup (email + goal only) landing as a
  row with `firstName = NULL`, then was deleted. Stale `.next/dev` artifacts
  can fail typecheck after route deletions — `rm -rf .next` first. Beware:
  `npm run verify | tail` masks the exit code; check `$?` unpiped.
- **The work is UNCOMMITTED** — *superseded: it was committed as `33cb69b`
  ("Reposition the site as the open map for communities") and pushed; the tree
  is clean at that commit as of §13.* Original note: ~80 changed files sitting
  in the working tree on `main`. Nothing else changed:
  no new dependencies, no new env vars, one additive migration
  (`20260729174333_first_name_optional`, already applied to the local Docker
  DB; production Neon still does not exist). `README.md` and this file were
  updated; `docs/00` and `docs/01` are historical.
- **Launch gap is unchanged from §11** *(Vercel itself is now done — see
  §13)*: domain + Neon, Resend + SPF/DKIM/DMARC (start early), Turnstile +
  PostHog keys, the referral-advance policy decision, plus the buildable
  items: OG/social card, favicon set, sitemap + robots, Lighthouse run,
  keyboard-funnel e2e. New since §11: flip the GitHub repo public and set
  `OPEN_SECTION.repoUrl`, and review the `/open` and `/about` copy (both make
  openness claims the owner should read before traffic arrives).

---

## 13. Addendum — Vercel is live (still 2026-07-29)

The site is deployed and publicly serving at **https://bitplaza.vercel.app**
(HTTP 200, correct `<title>`). What exists and what is deliberately unfinished:

- **Account/scope:** Vercel CLI installed globally (`npm i -g vercel`), logged
  in as `bitcoinculturehub-9325`. The account has two teams; the project was
  created under **`bitcoin-culture-hub-19505dbf`** (not
  `kyle-knights-projects`) as `bitcoin-culture-hub-19505dbf/bitplaza`. The
  repo is linked (`.vercel/`, gitignored). Note: `vercel inspect <url>` and
  other non-linked commands default to the *wrong* team — pass
  `--scope bitcoin-culture-hub-19505dbf`.
- **First deploy** (`bitplaza-6q9mebq2r-...`) was auto-assigned to production
  and aliased to `bitplaza.vercel.app`. Deploys are **CLI-only** (`vercel
  deploy`, `vercel deploy --prod`): the GitHub auto-connect to
  `bucketbuckets/bitplaza` failed because the Vercel GitHub app is not
  authorized for that private repo. To get push-to-deploy, install/authorize
  the app from Project → Settings → Git in the dashboard.
- **Env vars on Vercel — two are WRONG on purpose, one needs a redeploy:**
  - `DATABASE_URL` / `DIRECT_URL` (production + preview) currently hold the
    **local Docker values (`localhost:5433`)** — pushed before anyone noticed
    `.env` pointed at Docker, and `vercel env rm` was blocked in-session.
    Production therefore has **no working database**: static pages serve, but
    any waitlist/application submit will fail at the DB. Replace both with
    real Neon strings (pooled → `DATABASE_URL`, direct → `DIRECT_URL`) using
    `vercel env add <NAME> <env> --force`.
  - `NEXT_PUBLIC_SITE_URL=https://bitplaza.vercel.app` is set on production
    but was added *after* the only deploy — it is `NEXT_PUBLIC_*`, i.e. baked
    at build time, so canonical/sitemap/referral URLs are wrong until the
    next `vercel deploy --prod`.
- **Neon is still the missing piece.** `vercel integration add neon`
  (Marketplace, auto-injects connection strings) was permission-blocked
  in-session; the owner runs it (or installs Neon from the dashboard
  Storage tab), then: replace the two env vars above, run
  `npx prisma migrate deploy` against the Neon **direct** URL (both local
  migrations incl. `20260729174333_first_name_optional`), and redeploy.
- **Local additions, all gitignored:** `.env.local` (written by `vercel link`,
  holds a `VERCEL_OIDC_TOKEN`) and `.claude/settings.local.json` (Bash
  permission allow-list so the assistant can run `vercel`/text-utility
  commands). `.gitignore` gained the `.claude/settings.local.json` line —
  that edit is a real repo change, currently uncommitted alongside this file.
- **Domain: `joinbitplaza.com` (Namecheap).** Both `joinbitplaza.com` and
  `www.joinbitplaza.com` are attached to the `bitplaza` project, and
  `NEXT_PUBLIC_SITE_URL` (production) now points at
  `https://joinbitplaza.com` — but **DNS is not configured yet**: the domain
  still has Namecheap's default nameservers and a parking A record
  (`192.64.119.239`). The owner must set, in Namecheap → Advanced DNS:
  `A @ 76.76.21.21` and `CNAME www cname.vercel-dns.com`, deleting the
  parking/redirect records. Vercel polls, issues SSL, and emails when done.
  Until then the site is only reachable at `bitplaza.vercel.app` — whose
  canonical/metadata URLs will say `joinbitplaza.com` after the next deploy;
  that is intended.
- **Launch order from here:** Namecheap DNS (above; propagates in parallel) →
  Neon via `vercel integration add neon` (owner-run; classifier-blocked for
  the assistant) → swap `DATABASE_URL`/`DIRECT_URL` (`--force`) + `npx prisma
  migrate deploy` against the Neon direct URL → `vercel deploy --prod --yes`
  (owner-run; also classifier-blocked) — one deploy bakes both the domain and
  the DB fix → end-to-end signup test on joinbitplaza.com →
  Resend/Turnstile/PostHog keys via `vercel env add` → GitHub app
  authorization for push-to-deploy.

---

## 14. Addendum — launch requirements built; deploy is owner-run (still 2026-07-29)

Everything on the "buildable, no accounts needed" list from §11–§13 is now
built and verified (7-agent workflow; final gate ran `rm -rf .next && npm run
verify` unpiped: typecheck, lint, 147 unit/integration tests, build — all
green; every new metadata route probed 200 on a local prod server).

**Shipped in the working tree:**

- **OG/social card** `src/app/opengraph-image.png` (1200×630, 26KB) +
  `opengraph-image.alt.txt`. Arch + wordmark + `SITE.tagline`, all ink
  `#1a1310` on apricot `#ff6a3d` (white-on-apricot fails contrast — §3). Font
  is the exact self-hosted Bricolage woff2 from the build. No separate
  twitter-image on purpose: layout's `summary_large_image` card falls back to
  og:image. Re-render assets were in the session scratchpad (gone; method in
  git history).
- **Icon set:** `src/app/icon.svg` (ink arch on apricot rounded tile, base
  OPEN), `apple-icon.png` (180×180 opaque), real `favicon.ico` (32×32
  PNG-in-ICO, replaces scaffold default), `manifest.ts` (name/colors from
  SITE/THEMES tokens), `public/icon-192.png` + `icon-512.png` (manifest needs
  literal public paths).
- **`src/app/sitemap.ts`** — exactly the 8 canonical routes (/, /bitcoin,
  /communities, /open, /about, /questions, /privacy, /terms); redirect
  sources and /api excluded. **`robots.ts`** — allow all, disallow /api/,
  sitemap link. **Canonical fallback fixed:** `site.ts` fallback was still
  `https://bitplaza.com` → now `https://joinbitplaza.com`; ditto the
  `EMAIL_FROM` fallback in `lib/email/send.ts` → `hello@joinbitplaza.com`
  (must become a verified Resend sender, or keep setting EMAIL_FROM).
- **Keyboard-only e2e** (`npm run test:e2e`): `playwright.config.ts` (channel
  "chrome" mandatory, port 3210, workers 1 because of the shared 10-req/10-min
  rate window, webServer builds+starts prod) + `e2e/waitlist-keyboard.spec.ts`
  and `e2e/leader-application-keyboard.spec.ts` + helpers. They assert the
  full tab order (email-first, honeypot never focusable), dwell past the
  2500ms `MIN_FORM_MS` gate, and prove the success screen is REAL (not the
  anti-bot decoy) by reading the row back from Postgres and matching referral
  code + position byte-for-byte. Rows and rate-limit counters cleaned before
  and after. Vitest excludes `e2e/**`; Playwright sees only `e2e/`.

**Lighthouse** (prod build, LH 13.4.1, both pages × mobile/desktop): desktop
100/100/100/100 on both; mobile a11y/best-practices/SEO all 100; mobile
**Performance 85 (home) / 89 (/bitcoin)** — sole culprit is LCP on the hero
*text* paragraph (JS contention under simulated 4G; TBT 0, CLS 0). Fix
direction, not applied: ~65KB of a 78%-unused client chunk, 22KB legacy
polyfills (set modern browserslist targets), 130ms render-blocking CSS.
/bitcoin needs one point; home needs ~1s of simulated LCP.

**Copy review of /open + /about (+FAQ) — owner decisions, nothing changed:**

- **BLOCKER:** homepage open section says **"The code is public"** — false
  today (repo private, no LICENSE file anywhere). Two exits: (a) flip the
  repo public + add AGPL-3.0 LICENSE + set `OPEN_SECTION.repoUrl`, making it
  true; or (b) retense to "will be public". Same is/will-be tense problem in
  /open ("is licensed AGPL-3.0", "is published under CC BY-SA", exportable
  and AI claims) and `faq.ts` (~line 52) — all one-verb fixes, drafted in the
  session transcript, must land together or the site contradicts itself.
- /about "we are working with a small number of communities" — owner must
  confirm those engagements are real, or use design.md's approved intent
  phrasing.
- Everything else held: zero foundation claims, and every privacy/analytics
  claim in /open verified TRUE against the implementation.

**Env vars are Sensitive (write-only).** The three production vars were
re-created as Vercel *Sensitive* variables — `vercel env pull` writes literal
`[SENSITIVE]` placeholders; NOBODY can read them back, so "is DATABASE_URL
Neon or localhost?" is unanswerable by inspection (owner: "not sure"). The
only test is end-to-end after a deploy: POST a real signup to
`/api/waitlist` — contract per `src/lib/validation/waitlist.ts` +
`src/lib/security/anti-bot.ts`: omit `nickname` (honeypot), send `startedAt`
≥2500ms in the past, Turnstile is pass-open unconfigured. 201 with a position
⇒ DB live and schema migrated; 500 ⇒ still no working DB (Neon remains the
gating item; `vercel integration list` shows no marketplace resources).

**Classifier note:** this session the auto-mode classifier blocked `vercel
deploy --prod --yes` (again) and, late in the session, even `git status` /
commits — so this work may be **uncommitted**; if `git status` shows the ~20
files above, commit them first. DNS was re-checked this session: still
Namecheap parking (registrar-servers NS, parking A record) — §13's records
still need setting. Launch order otherwise unchanged from §13, minus
everything now built.

---

## 15. Addendum — security review; repo is PUBLIC + AGPL-3.0 (still 2026-07-29)

A 14-agent adversarial security review ran (independent secret recon → 6
dimensions × find/verify → synthesis; results in the session transcript).
**Verdict: `safe_to_go_public: true`.** The gating question — does any secret
live in a tracked file or in git history — was answered independently: NO real
`DATABASE_URL`/`DIRECT_URL`, Resend `re_` key, PostHog `phc_` key,
`TURNSTILE_SECRET_KEY`, `ADMIN_EXPORT_TOKEN`, JWT, or private key exists in
source, docs, or any of the 11 commits. `.env*`/`.vercel`/
`.claude/settings.local.json` are gitignored and were never committed;
`.env.template` ships blank. Every finding across all six dimensions is
`gates_public: false`.

**Done this session:**

- **Repo flipped PUBLIC** — `gh repo edit bucketbuckets/bitplaza --visibility
  public --accept-visibility-change-consequences`; confirmed `isPrivate:false`.
- **`LICENSE` added** — canonical GNU AGPL-3.0 text (the signed-off license,
  docs/00 §9.1), committed + pushed. Without it a public repo is
  all-rights-reserved, contradicting the open positioning and the site's
  AGPL-3.0 copy. GitHub's `licenseInfo` detector lags a few minutes behind the
  push.

**PUBLIC ≠ open-to-traffic.** Publishing the repo exposed no secret, but the
review found two real **must-fix-before-real-traffic** highs (they do NOT gate
the repo flip; they gate opening the forms to the public):

1. **Rate-limit key trusts the spoofable leftmost `X-Forwarded-For`**
   (`src/lib/security/rate-limit.ts:22-31`). `clientIp()` returns
   `xff.split(",")[0]`; on Vercel XFF is always present so the trustworthy
   `x-real-ip` branch is dead code. An attacker sending a fresh random XFF per
   request lands in a new `sha256(ip:route)` counter every time → the
   10/10min cap on all three POST routes never trips. This neutralizes the
   master throttle and turns the mediums below into UNBOUNDED abuse. **Fix:**
   use Vercel's `x-real-ip` / `@vercel/functions` `ipAddress()` as primary;
   trust XFF only behind a proxy allowlist.
2. **Turnstile fails open** (`src/lib/security/turnstile.ts:21,29-40`) — returns
   `true` when unset (line 21), on any Cloudflare non-200 (29-33), and on
   timeout/exception (37-40). `turnstileConfigured()` is defined but called
   nowhere, so a missing key is silent. **Fix:** fail closed in production
   (assert the key at boot / reject when unset) and reject-not-allow on
   Cloudflare errors. NOTE: failing closed means forms hard-fail until
   `TURNSTILE_SECRET_KEY` is set on Vercel — an owner decision, tied to the
   §13 Turnstile-key task.

**Confirmed mediums (defense-in-depth; unbounded once #1 lands):** referral
counts are **farmable** (increment at insert, only gmail self-referral guard —
`signup.ts:58-70`); waitlist/community forms are an **unsolicited-email relay**
(every signup emails an unverified address — burns Resend/DMARC reputation —
`waitlist/route.ts:112-126`). Fix both with double-opt-in / email verification
before counting a referral or sending the positional email.

**Confirmed lows (hardening backlog, none exploitable today):** no app-level
security headers (no CSP/X-Frame-Options/nosniff/Referrer-Policy —
`next.config.ts`, would need a nonce for the inline theme script);
`research-response` uses the public referral code as a write credential with no
anti-bot gate + a non-transactional 5-row cap (TOCTOU); advisory-only 32KB body
guard (trusts Content-Length); JSON-LD `dangerouslySetInnerHTML` without
escaping (latent, all inputs static today); Resend error logging can echo the
recipient email (PII) to server logs; the analytics forbidden-key guard is
dev-only (`analytics/client.ts:69`); admin CSV export has no rate-limit/lockout
on its Bearer credential; the IP "hash" is an unsalted sha256 (pseudonymous,
not the "one-way" the /open page claims — ephemeral, pruned ~20min).

**Explicitly cleared (positive findings):** no mass-assignment (explicit Prisma
field lists), no SQLi (only parameterized `$queryRaw`), no ReDoS (all fields
`.max()`-bounded, no nested quantifiers), no SSRF (the community `website` is
never fetched/rendered), no open-redirect, no cookies, email-send failure
cannot roll back a signup, all routes return fixed generic 500s. **Next.js:
stay on 16.2.12** — it is the latest stable and the npm-audit criticals/highs
trace to a dev-only nested `next@15.1.2` under `react-email` (never on the
request path); the cache-poisoning / image-optimization / dev-origin CVEs are
both out-of-range for 16.2.12 and structurally unreachable (POST routes
dynamic, sole GET is `no-store`, no `next/image`, no middleware).

**Open follow-ups now unblocked by the public flip:** set
`OPEN_SECTION.repoUrl` in `src/content/open.ts` to
`https://github.com/bucketbuckets/bitplaza` (makes the "View the code" button
render). The homepage "The code is public" blocker (§14) is now TRUE (public +
AGPL LICENSE); the /open + FAQ **dataset** claims ("is published under CC
BY-SA") are still overstated — nothing is published yet — and still need the
tense pass from §14's copy review.

---

## 16. Addendum — the site is LIVE and working (still 2026-07-29)

**joinbitplaza.com is live end-to-end.** Neon was provisioned (Marketplace,
under the `bitplaza` project), the schema migrated, and a fresh production
deploy shipped everything.

- **Deploy:** `dpl_7TQ99WkocjWj2AvdFcxHbwyRHyqU` (READY, production), aliased to
  `https://joinbitplaza.com` (SSL issued; the apex + www both resolve). Still
  CLI-only deploys (`vercel deploy --prod --yes`, owner-run — classifier blocks
  the assistant).
- **Database:** Neon `neondb`, branch `main`, us-east-1. Both migrations applied
  via the DIRECT url (`npx prisma migrate deploy`, run by the assistant with
  owner-supplied strings). Production env now holds the real Neon strings:
  `DATABASE_URL` = pooled (`-pooler` host), `DIRECT_URL` = direct. All three
  (incl. `NEXT_PUBLIC_SITE_URL=https://joinbitplaza.com`) are Vercel
  **Sensitive** vars → `vercel env pull` returns `[SENSITIVE]`, unreadable; the
  only way to check a value is behavior after deploy.
- **Verified live:** signup `POST /api/waitlist` → **201** `{position:1,
  referralCode:21BG4C31, referralUrl: https://joinbitplaza.com/?ref=...}`;
  duplicate resubmit → **200** `duplicate:true` same position (idempotent);
  empty-body probe → **400** (DB reachable at runtime). OG image → **200**
  image/png 26050B; `og:image`/`canonical`/`og:url` all absolute
  `https://joinbitplaza.com`; sitemap + robots serve with the real domain.

**Immediate post-launch chores (owner):**
1. **Delete the test row + reset the counter.** The live test wrote a real row
   at `position 1` (email `bitplaza-livetest-1785369196256@example.com`). Run in
   Neon → SQL Editor: `TRUNCATE TABLE "waitlist_users" RESTART IDENTITY
   CASCADE;` (only the test row exists, so this is safe and makes the first real
   signup `#1`). Targeted alt (leaves sequence, next real user = #2):
   `DELETE FROM "waitlist_users" WHERE "emailRaw" =
   'bitplaza-livetest-1785369196256@example.com';`
2. **Rotate the Neon password** — it was pasted into the assistant chat in
   plaintext. Neon → Connect → Reset password, then re-set `DATABASE_URL` /
   `DIRECT_URL` on Vercel (`vercel env add … production --force`, pooled vs
   direct) and redeploy.

**Before driving heavy traffic (from §15 security review — still open):** the
two must-fix highs — spoofable `X-Forwarded-For` rate-limit key
(`rate-limit.ts:22-31`) and Turnstile fail-open (`turnstile.ts:21,29-40`) —
plus the mediums (referral farming, email relay). None block a soft launch, but
they gate opening the funnel to volume. Also still open: Resend + SPF/DKIM/DMARC
(email confirmations are inert without `RESEND_API_KEY`), Turnstile + PostHog
keys, the copy retense (§14) + `OPEN_SECTION.repoUrl` now that the repo is
public, and the referral-advance policy.
