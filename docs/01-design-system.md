# Stage 2 — Design system, shell, shared components

> ## ⚠️ SUPERSEDED — 2026-07-29
>
> The **visual direction** in this document is replaced by [`../design.md`](../design.md) v2.0.
> Blue Hour was dark-first, serif-led and built on thin network lines; the new
> direction rules out all three. Do not implement anything below.
>
> **The architecture survives and is still authoritative** — token layering,
> the CSS↔TypeScript sync test, worst-case contrast discipline, the three-token
> community model, the reveal system, the analytics catalogue, and copy-in-
> constants. `design.md` §24 lists precisely what is kept, retuned and deleted.
>
> This file is retained for the reasoning, not the values.

**Date:** 2026-07-29
**Direction:** Blue Hour (ground, light, type) + Wayfinding (structure) — the
hybrid chosen from the three-direction comparison.
**Status:** Superseded by `design.md` v2.0. Was complete and passing at the time
of writing.

---

## 1. What the direction means concretely

| From | What it contributes |
|---|---|
| **Blue Hour** | Deep slate ground, warm lamplight, the inscriptional display face, pill buttons, the additive light pools in the motif. Answers *alive*, *expansive*, *warm*. |
| **Wayfinding** | The 45°/90° line geometry, interchange rings, hairline rules between bands, the ten community line colours. Answers *civic*, *intelligent*, *navigable*. |

The two meet in `components/plaza/plaza-field.tsx`, which is the site's signature
visual: Wayfinding's geometry lit by Blue Hour's lamps.

## 2. Type

| Role | Face | Why |
|---|---|---|
| Display | **Marcellus**, 400 only | Inscriptional roman — the letterform tradition of carved civic lettering. Warm and formal at once, and effectively unused in consumer tech. One weight is a feature: it forces the face to stay an event. |
| Body | **Public Sans**, variable | The US federal government's public-service typeface. Chosen for what it *is* as much as how it looks — this is a page about public space. |

Both self-hosted by `next/font` at build time. No request leaves for a font CDN,
which matters beyond performance: a third-party font request is a third-party log
entry, and that would contradict `/data`.

Deliberately avoided: Inter and Space Grotesk (the default "safe" pair), and the
high-contrast editorial serif that has become the signature of AI-generated
landing pages.

## 3. Colour

Two themes, both designed. Dark is the brand's hero; the viewer's OS preference
still wins, and the toggle overrides in both directions.

The light theme is not an inversion. In daylight the slate becomes the ink *and*
the primary button fill, and the lamp gold steps back to an accent — a different
hour, not a flipped switch.

### The finding that shaped the token model

`bch/verticals/bitcoin.md` §3 flags ten-plus accessible community colours as "a
real design constraint." Measuring all thirty combinations proved it and changed
the model: **each community carries three tokens, not one** — a fill, a text
colour for light grounds, and a text colour for dark. No single hue clears AA in
all three roles.

**Bitcoin is the only light-value hue in the set**, so it is the only one taking
ink rather than white on its fill. That difference is structural — it falls out
of the colour, not out of Bitcoin being first — and it is the mechanism that
keeps Bitcoin orange one chip among ten rather than the page.

### How it is guarded

Two tests, 56 assertions:

- `tests/tokens.contrast.test.ts` — every text role against the **worst** ground
  in its theme, every community token in all three roles, plus an assertion that
  the raw lamp is *not* usable as light-theme text (so nobody "simplifies"
  `accentText` back to `accent`).
- `tests/tokens.sync.test.ts` — parses `globals.css` and fails if any value has
  drifted from `src/lib/design-tokens.ts`. It specifically catches the likeliest
  mistake: the dark palette is written twice (media query and `[data-theme]`),
  and editing only one produces a page that looks right until someone touches
  the toggle.

Ratios quoted in CSS comments are **worst case across all three grounds**. During
this stage that discipline caught two `faint` tokens I had specified from a
rounded value that were actually below 4.5:1.

## 4. Decisions worth knowing

**No copy in JSX.** Everything in `src/content/`. Mirrors `plan.md` §6.5's rule
for the product.

**Analytics is a closed set of twelve events.** Unlisted names do not compile;
forbidden property keys throw in development. PostHog runs with autocapture,
session recording, heatmaps, performance capture and IP collection all off, and
memory-only persistence — no cookie, no cross-session identity. `plan.md` §11
rates a telemetry incident as unrecoverable for a public good.

**No consent banner, and that is the position.** `plan.md` §1.4 rule 3 commits to
*opt-out*, not opt-in. A banner would interrupt everyone to authorise collection
deliberately built not to need authorising. The opt-out is in the footer; DNT and
GPC are honoured as a hard stop with no control shown.

**Three-state theme toggle.** A binary toggle silently discards "follow my OS",
which is what most people actually want.

**`useSyncExternalStore`, not a `mounted` flag.** Theme and consent both live
outside React and can change in another tab. Next 16's lint rule flags the
mounted-flag pattern, and it is right to — it causes a cascading render on every
page load.

**The plaza composition is hand-authored and focuses right of centre.** A
signature visual that reshuffles on every load is not an identity. Right-of-centre
because the hero's left third sits under the scrim carrying the headline; a
focal point at 0.5 would be half-hidden behind the thing it is meant to be
behind.

**The hero scrim is opaque across the text column, then clears.** Fading
gradually from the left edge left lines crossing the headline at unpredictable
contrast — which is precisely what measured tokens are supposed to rule out.

## 5. Verified

Production build, real Chrome via Playwright (system channel), at 1440×900 dark,
1440×900 light and 390×844 dark:

- **No horizontal overflow at any width.** `scrollWidth === clientWidth`.
- **Zero console errors, zero failed requests.**
- Exactly one `h1`; heading order `h1 → h2 → h2 → h2`.
- Marcellus and Public Sans both resolving and applied.
- Every interactive target ≥ 24 CSS px (WCAG 2.2 SC 2.5.8), buttons ≥ 44 px. The
  only sub-24px element is the skip link in its `sr-only` state, which is
  correct — it is full size when focused.
- `npm run verify` — typecheck, lint (clean), 56 tests, build.

**Not yet verified:** Lighthouse, axe-core, screen readers, cross-browser, real
devices. All Stage 6.

## 6. Files

**Tokens & data** — `src/app/globals.css`, `src/lib/design-tokens.ts`,
`src/lib/communities.ts`, `src/lib/theme.ts`, `src/lib/utils.ts`

**Analytics** — `src/lib/analytics/{events,client,consent,provider}.tsx`,
`src/components/analytics/analytics-opt-out.tsx`

**Shell** — `src/app/layout.tsx`,
`src/components/layout/{container,section,site-header,site-footer,wordmark,prose-page}.tsx`,
`src/components/theme/theme-toggle.tsx`

**Shared** — `src/components/ui/button.tsx`,
`src/components/motion/reveal.tsx`, `src/components/plaza/plaza-field.tsx`

**Content** — `src/content/{site,hero}.ts`

**Routes** — `src/app/page.tsx` (hero only), `/data`, `/privacy`, `/terms`

**Tests** — `tests/tokens.contrast.test.ts`, `tests/tokens.sync.test.ts`,
`vitest.config.mts`, `vitest.setup.ts`

**Project** — `package.json`, `.env.template`, `README.md`, `.gitignore`

## 7. Open

1. **Nothing is committed.** The repo is initialised; the tree is untracked
   pending your go-ahead.
2. **`/for-community-builders` is not linked yet.** The route lands in Stage 4
   together with its footer link — linking to a route that does not exist is a
   broken link and a prefetch 404, not a placeholder.
3. **`/privacy` and `/terms` are honest placeholders**, `noindex`, stating
   plainly what is outstanding and pointing at `/data` for the operative
   description. Inventing binding terms would be worse than not having them.
   Both need counsel.
4. **`/data` is written and substantive** — it is the page `plan.md` §12 action 5
   assigns to the owner. Every claim in it corresponds to something enforced in
   code. **It needs the owner's review before launch**, particularly the closing
   section on governance, which says the structure is still being settled.
5. **No favicon, app icons or OG image yet.** Stage 6.
6. **No brand wordmark asset** — the wordmark is set in Marcellus with an SVG
   mark. If a designed logo exists, it drops into
   `src/components/layout/wordmark.tsx`.
