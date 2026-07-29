# Bitplaza — launch site and waitlist

> Every community deserves a map.

The marketing site and waitlist for Bitplaza, the open map for communities.
`design.md` (v3.0) is the authoritative design spec;
`docs/02-analytics-events.md` documents the event taxonomy. Deliberately **separate
from the Culture Hub product codebase** (`../bch/plan.md`), which is Vite +
FastAPI — see `docs/00-audit-and-architecture.md` §2.1 for why, and what that
buys and costs.

## Commands

```bash
npm run dev         # http://localhost:3000
npm run verify      # typecheck → lint → test → build. The gate for "done".
npm test            # vitest
npm run test:e2e    # playwright
npm run db:migrate  # prisma migrate dev
```

Playwright must launch system Chrome — `chromium.launch({ channel: "chrome" })`.
The cached browser build on this machine does not match the installed package
version, and letting it download costs ~150 MB for no benefit.

## Setup

```bash
npm install
cp .env.template .env.local     # every variable is documented in place
npm run dev
```

Nothing external is required to run the site locally. With no `DATABASE_URL` the
waitlist cannot persist; with no `NEXT_PUBLIC_POSTHOG_KEY` analytics is inert and
sends nothing; with no `RESEND_API_KEY` confirmation email is skipped (and says
so in the terminal); with no Turnstile keys the widget is absent and the check
passes open. All intentional so a fresh clone runs.

### Local database

Local dev and the API integration tests use Postgres in Docker; `.env` (gitignored)
points at it:

```bash
docker run -d --name bitplaza-pg -e POSTGRES_USER=bitplaza \
  -e POSTGRES_PASSWORD=bitplaza -e POSTGRES_DB=bitplaza \
  -p 5433:5432 postgres:16-alpine     # first time
docker start bitplaza-pg              # thereafter
npm run db:migrate                    # apply prisma/migrations
```

Port **5433** on purpose — nothing else on this machine claims it. Production
uses Neon: pooled string in `DATABASE_URL`, direct string in `DIRECT_URL`
(migrations cannot run through a transaction pooler).

## Layout

```
docs/          audit, architecture, decisions — read 00 first
prisma/        schema + migrations (schema designed in docs/00 §4)
emails/        React Email templates (confirmation, application receipt)
src/
  app/         routes. layout.tsx holds fonts, theme init, metadata
    api/       waitlist, community-application, research-response, admin/export
  components/
    layout/    shell — header, footer, container, section
    plaza/     the motif (canvas)
    sections/  one file per landing band
    interest/  the selector chips + deterministic preview
    waitlist/  form + success/share state
    community/ the builder application form
    ui/        primitives
  content/     ALL copy, as typed constants
  lib/
    analytics/ typed event catalogue + restrictive PostHog client
    attribution/  cookie-free ?ref / utm_* capture (sessionStorage)
    email/     Resend wrapper — send failures never fail a committed signup
    security/  rate limit (Postgres, hashed keys) · honeypot/timing · Turnstile
    validation/   Zod schemas, shared client ↔ server
    waitlist/  signup transaction, referral codes, normalization, CSV
    design-tokens.ts   the palette, as data, so tests can assert on it
    communities.ts     the ten communities and their three colour tokens each
tests/         vitest; api.waitlist.integration needs the Docker Postgres up
```

## Rules worth knowing before you edit

**No copy in JSX, ever.** Every string lives in `src/content/`. This mirrors the
discipline `plan.md` §6.5 imposes on the product and is what makes a copy review
or a landing-page variant cheap instead of a refactor.

**Colour is measured, not chosen twice.** `globals.css` is what the browser
reads; `src/lib/design-tokens.ts` is what the tests read.
`tests/tokens.sync.test.ts` parses the CSS and fails if they drift — do not
resolve a mismatch by editing one side. Ratios in the CSS comments are
**worst case across all three grounds**, which is the only number that means
anything.

**Each community has three colour tokens, not one.** A fill, a text colour for
light grounds, and one for dark. A single hue cannot serve all three roles above
AA. Bitcoin is the only light-value hue in the set, so it is the only one taking
ink rather than white on its fill — that difference is structural, and it is
what keeps Bitcoin orange one chip among ten rather than the page.

**Analytics is a closed set.** Twelve events, defined in
`src/lib/analytics/events.ts`. An unlisted name will not compile, and a payload
carrying a forbidden key throws in development. `plan.md` §11 rates a telemetry
incident as unrecoverable for a public good, and this audience reads the source.

**All motion goes through `components/motion/reveal.tsx`.** That is what makes
`prefers-reduced-motion` a one-line guarantee rather than an audit.

## Next 16 sharp edges

Route `params` are Promises. `images.domains` is gone — use `remotePatterns`.
Turbopack is the default bundler. Default `images.qualities` is `[75]`.
React inserts `<!-- -->` between adjacent SSR text nodes, so strip comments
before asserting on served markup. Vitest fake timers deadlock `userEvent` —
don't combine them in one file.
