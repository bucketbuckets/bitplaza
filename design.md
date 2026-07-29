# Bitplaza — Design Specification

**Version 3.0 · 2026-07-29**

> **Status.** This document replaces v2.0 ("a living digital plaza"). The visual
> foundation survives: the apricot and cream palette, the type system, the token
> architecture, the arch mark, and every measured contrast value. The narrative
> layer changes: Bitplaza is now presented as **the open map for communities**,
> the tone moves from playful-weird to calm and credible, and the plaza-world
> apparatus (Regulars, colonnade hero, sticker texture as a system) is retired.
> This file is the source of truth for all frontend work. Where code and this
> document disagree, one of them is wrong; fix whichever it is, in the same
> change.

---

## 1. Product definition

**Bitplaza is the open map for a community.**

It connects the people, knowledge, projects, events, organizations,
conversations, and opportunities that are currently scattered across the
internet. The first plaza maps the Bitcoin community. The underlying system is
built to work for any sufficiently deep community.

- Core idea: **Every community deserves a map.**
- Core distinction: **A feed keeps you scrolling. A path gets you somewhere.**
- Central metaphor: **the map** — territories, paths, landmarks, entrances,
  depth.

"Plaza" is the branded name for one community's map. Visitors must be able to
understand the product in plain language before meeting the internal
vocabulary; never make "plaza" carry several meanings on one page.

## 2. Audiences

1. **Community participants** — want to understand a community, find a
   starting point, discover people, projects, events and opportunities, know
   what to do next, and build portable proof of contribution.
2. **Community leaders** — run ecosystems, schools, clubs, conferences,
   open-source projects, professional networks. Need a front door, connected
   knowledge, onboarding relief, member contribution, community intelligence.
   They are the header CTA's audience.
3. **Prominent builders** — judge whether the primitive is clear, whether
   "open" is structural, whether AI is constrained, whether claims survive
   scrutiny. Served by precision and restraint, never by language aimed at
   them.

The homepage optimizes for the ten-second comprehension test: what is it, who
is it for, what can I do, why is it different, what should I click.

## 3. Positioning and narrative

One narrative, in order, and everything on the homepage proves part of it:

1. **The community already exists.** Its knowledge and activity are scattered.
2. **Bitplaza creates the map.** People, knowledge, projects, events and
   opportunities become navigable.
3. **Paths create outcomes.** Users know where to begin and what to do next.
4. **The map remains open.** Identity is portable, knowledge is exportable,
   the code is public.

Desired impression: **public infrastructure designed with the care of a great
consumer product.** It must not read as a generic SaaS page, a Web3 launch, a
manifesto, a consultancy site, or an AI-generated template.

## 4. Design principles

Ordered; earlier beats later in a conflict.

1. **Show the product before describing it.** The first viewport contains a
   working preview, not an illustration of one.
2. **One dominant idea per section.** Every section answers exactly one
   question.
3. **Precision earns trust.** Claims are checkable; illustrative data is
   labeled; nothing outruns the implementation.
4. **Calm beats clever.** Restraint in color, motion and copy. The map is the
   personality.
5. **Paths end somewhere.** Every CTA corresponds to a real next step; no dead
   links, no placeholder buttons.
6. **The user stays in control.** Of their data, of personalization, of what
   is stored or shared.
7. **Fail toward readable.** No JS, script errors, and reduced motion all
   leave a complete page.

## 5. Voice and tone

Plainspoken, concise, globally understandable, confident without exaggeration,
principled without ideology, warm without being childish, technically literate
without jargon.

Rules:

- Short sentences. Verbs first. Second person where natural.
- **No em dashes.** Use periods, commas, parentheses, or colons.
- Buttons say what happens: "Explore Bitcoin", never "Learn more".
- Exclamation marks live in success states and nowhere else.
- One consistent depth vocabulary everywhere: **Start · Explore · Deepen.**
- Honest admissions ("the map is being seeded now") buy more credibility than
  confident claims.

Banned vocabulary: revolutionary, seamless, unlock, supercharge, empower,
leverage, reimagine, one-stop shop, "the future of", "powered by AI",
"ecosystem" when a concrete noun works, inflated network or scale claims,
unexplained protocol terminology, fake urgency, artificial scarcity.

### Approved / rejected copy examples

| Approved | Rejected (and why) |
|---|---|
| "Every community deserves a map." | "The revolutionary community platform." (banned word, no meaning) |
| "A feed keeps you scrolling. A path gets you somewhere." | "Supercharge your community engagement." (two banned words) |
| "Ends when you hold a small amount yourself." | "Master Bitcoin fundamentals." (no checkable outcome) |
| "AI proposes. People verify." | "AI-powered magic matching." (spectacle claim) |
| "We are starting with a small number of communities and helping each one launch properly." | "Only 3 spots left this quarter!" (fake scarcity) |
| "Illustrative preview. The map is being seeded now." | "Join 10,000+ members." (fabricated metric) |

## 6. Color

Tokens live in `src/app/globals.css` on `:root`, the dark media query, and the
two `[data-theme]` selectors, mirrored in `src/lib/design-tokens.ts`.
`tests/tokens.sync.test.ts` and `tests/tokens.contrast.test.ts` enforce the
mirror and AA contrast; every value below is measured worst-case across all
three grounds in its mode.

Approved tokens (light / dark):

| Token | Light | Dark | Role |
|---|---|---|---|
| `--bp-paper` | `#FDF8F1` | `#17120F` | Page ground. Warm, never pure white or blue-black. |
| `--bp-surface` | `#F7F0E4` | `#211A15` | Raised bands. |
| `--bp-raised` | `#FFFFFF` | `#2B221C` | Cards on surface, inputs. |
| `--bp-ink` | `#1A1310` | `#FBF4EA` | Text. |
| `--bp-ink-muted` | `#5A4F47` | `#B7A99C` | Secondary text. |
| `--bp-ink-faint` | `#6E6259` | `#9C8D80` | Captions. **Floor — nothing lighter.** |
| `--bp-apricot` | `#FF6A3D` | same | The accent. **Ink text only: white on apricot is 2.85:1 and fails.** |
| `--bp-apricot-ink` | `#B33509` | `#FF9166` | Apricot as text. |
| `--bp-edge` | `#E4D9C8` | `#382C24` | Hairlines. |
| `--bp-edge-strong` | `#C9B9A2` | `#544236` | Emphasized borders. |
| `--bp-focus` | `#2440E0` | `#FF9166` | Focus ring. |
| `--bp-danger` | `#B3261E` | `#FF8D82` | Form errors. |

Community fills (Bitcoin `#F7931A` etc.) are absolute and never shift with
theme; their text variants are per-theme and per-community, chosen by
measurement (`src/lib/communities.ts`).

Rules:

1. **The accent is spent, not spread.** Roughly one apricot element with real
   weight per viewport: the primary CTA, or a highlight, not both.
2. Bitcoin orange leads only on `/bitcoin` and in the hub preview's marker,
   as accents and marks, never as a ground behind text.
3. Color never carries meaning alone; every state pairs color with a word or
   shape.
4. Cream, not white: `#FFFFFF` appears only as a raised card on surface.
5. Cobalt, citron and mint remain in the palette for support roles (focus,
   selection, live markers) but are not section-level tools in v3.

## 7. Typography

| Role | Family | Notes |
|---|---|---|
| Display | Bricolage Grotesque (variable) | Weight 700–800. `font-stretch: 112%` appears once per page, on the h1. |
| Body | Geist Sans | Everything a person has to read. |
| Utility | Geist Mono | Labels, counts, activity lines, disclaimers, the machinery voice. |

All self-hosted via `next/font`; no font CDN requests.

Scale (tokens in `globals.css`): `display-hero` (homepage h1 only),
`display-1` (page h1s), `display-2` (section h2s), `heading-1`, `body-lg`,
body 1rem, `caption 0.8125rem` (floor for anything a user must read),
`label 0.6875rem` mono uppercase with ≥0.12em tracking.

Rules: display headlines are **authored as arrays of lines**, never wrapped by
the browser. `text-wrap: balance` on headings, `pretty` on body. Running text
60–70 characters (`.measure`, `.measure-wide`). Tabular numerals wherever
digits column up (`data-numeric`).

## 8. Space, layout, radius

- Spacing scale: 4px base. Section vertical padding `py-20 sm:py-28 lg:py-36`
  via the `Section` component; nothing else defines band rhythm.
- Containers: `narrow` (max-w-3xl, prose and forms), `default` (max-w-6xl),
  `wide` (max-w-7xl, hero and hub preview).
- Radii: `--radius-pill` buttons and chips · `--radius-card` 20px cards,
  modals, inputs · `--radius-field` 12px small inputs · `--radius-sticker` 4px
  territory chips. No un-tokened radius.
- Borders: 1px `--bp-edge` hairlines; 1.5px on inputs and secondary buttons;
  `gap-px bg-edge` grids for cell tables (paths, territories).
- **Cards are earned.** Bordered cards only where objects are interactive or
  directly comparable (paths, territories, AI functions). Explanatory content
  uses hairline-ruled rows, not boxes.

## 9. Components

Universal: 44×44px minimum touch targets, 2px `--bp-focus` ring at 2px offset
on every interactive element, no state communicated by color alone, no
hover-only information.

- **Header** — sticky; transparent until scrolled, then `bg-paper/85` +
  hairline + blur. Four page links, one CTA ("Map your community"), and the
  light/dark control (owner decision; it also appears in the footer and the
  mobile menu). Mobile menu is a focus-trapped dialog.
- **Buttons** — primary: apricot pill, ink text, print-offset shadow, lifts
  2px on hover, presses flat on active; only primaries lift. Secondary:
  1.5px `--bp-edge-strong` pill. Link: underlined at rest.
- **Forms** — inputs 52px, `--radius-card`, visible labels always (never
  placeholder-only), 16px minimum font, errors via `aria-describedby` +
  `aria-invalid` plus a focus-taking summary on submit, values never lost on
  failure. Forms do not animate. Consent is a visible note above nothing:
  submitting affirms it; no mandatory checkbox.
- **Accordions** (FAQ, territories) — Radix Accordion, `type="multiple"`,
  240ms height ease, analytics on the stable content id.
- **Map preview** — native radio inputs for goal selection (browser roving
  behavior for free), default state server-rendered, `aria-live="polite"` on
  the responding list, visible illustrative disclaimer in mono.
- **Territory chip** — `--radius-sticker`, surface fill; highlighted state is
  apricot fill + ink text + `sr-only` explanation.
- **Prose pages** (`/open`, `/about`, `/privacy`, `/terms`) — reading width,
  no illustration, no motion. Credibility through restraint.

## 10. Motion

Sparing, and never a prerequisite for comprehension.

- Reveal on scroll: opacity 0→1, translateY 14px→0, 420ms, `--ease-plaza`,
  once. Content is **visible by default**; JS opts into hiding via `html.js`
  set before first paint. IntersectionObserver is paired with a bounding-box
  sweep (viewport jumps miss IO; this bug has occurred here).
- Hover/focus feedback: ≤150ms color and 2px transforms.
- Accordion open/close: 240ms.
- Only `transform` and `opacity` animate (accordion height via Radix's
  measured variable is the one exception).
- `prefers-reduced-motion` is a hard stop: everything resolves instantly,
  nothing is hidden.
- Prohibited: scroll hijacking, parallax decoration, stagger beyond 150ms
  total, bouncing, cursor tricks, continuous ambient animation, animation
  libraries in the bundle.

## 11. Responsive rules

Breakpoints: `sm 640 · lg 1024` are the working set (Tailwind defaults).
Design at 320, 390, 768, 1024, 1440.

- Hero: copy above preview below `lg`; two columns at `lg+`.
- Map preview on mobile: full width, chips wrap, secondary row text hides
  (`hidden sm:inline`), all four goals remain reachable.
- Grids collapse to one column but keep hairline rhythm; never merely stack
  bordered desktop cards.
- Forms: single column, full-width primary under 480px, `inputMode` set.
- No horizontal overflow at any width from 320px up; wide content scrolls in
  its own `overflow-x-auto` box.

## 12. Accessibility

WCAG 2.2 AA. Semantic landmarks, one h1 per page, no skipped heading levels,
skip link first in DOM. Visible keyboard focus everywhere. Labeled controls,
accessible accordions (Radix), descriptive link text, logical tab order,
keyboard-operable preview (native radios). Decorative SVG and grain are
`aria-hidden`. Reduced-motion parity. Contrast enforced by test. Touch targets
44px. axe-core clean on every route at three breakpoints is the release gate.

## 13. Data honesty

- **Illustrative data must say so in visible text**, in the mono voice, next
  to the numbers: "Illustrative preview. The map is being seeded now."
  (`DATA_DISCLAIMER` in `src/content/hub-preview.ts`). Never a tooltip.
- Live data replaces the constants in the content module; the disclaimer comes
  off in the same change.
- Never: fabricated testimonials, customer logos, live-looking counts, launch
  dates, or claims about protocol functionality that is not implemented.
  `/open` is the page that states exactly what exists today.
- "View the code" renders only when `OPEN_SECTION.repoUrl` is a real public
  repository.

## 14. CTA hierarchy

1. **Explore Bitcoin** — primary, participants. Hero and closing.
2. **Map your community** — secondary in the hero and closing; the header's
   one action; primary on `/communities` and in the leader section.
3. **Get early access** — the form's submit; the ask comes after a goal is
   chosen.
4. Tertiary links (View the architecture, All questions) are underlined text
   or secondary pills, one per section at most.

Never "Learn more", "Sign up", or a dominant email ask before the visitor has
chosen a goal.

## 15. Content architecture

All copy lives in `src/content/*` as typed constants; no strings in JSX
(prose pages excepted). Analytics ids (`path_id`, `territory_id`,
`question_id`) are stable; rewrite text freely, never rename ids casually.
The event taxonomy is `docs/02-analytics-events.md`.

Homepage order: Hero (with map preview) → Paths → Capabilities → Hub preview →
AI → Leaders → Open → Closing + waitlist → FAQ (5, linking to `/questions`).

Routes: `/` · `/bitcoin` (the first map) · `/communities` (leader conversion +
application) · `/open` (precise openness + data practices) · `/about` ·
`/questions` · `/privacy` · `/terms`. Redirects:
`/for-community-builders → /communities`, `/data → /open`.

## 16. Anti-patterns

Blocking defects in review:

- White text on apricot, anywhere, at any size.
- A second theme/display control in the header.
- An unlabeled illustrative number, or any fabricated metric.
- A CTA without a real destination; placeholder links or empty states.
- Every section rendered as a bordered card grid.
- Motion that hides content when JS fails, or survives reduced-motion.
- Protocol vocabulary on the homepage beyond the three plain promises.
- Mixed depth vocabularies (anything other than Start / Explore / Deepen).
- Em dashes in user-facing copy.
- Countdown timers, scarcity counters, engagement-bait.
- A chatbot widget.
- Copy that would work unchanged for a different company.

## 17. Performance

Budgets: Lighthouse ≥90 all categories · LCP < 2.0s throttled 4G · CLS < 0.05
· INP < 200ms · initial JS ≤ 180KB gzip · fonts ≤ 180KB total. Static
rendering everywhere; the only client components are those with real state
(header, preview, accordions, forms). Grain is one tiled data-URI SVG. No
animation libraries. Below-fold content lazy where it costs nothing.

## 18. The quality bar

Before shipping any surface, answer honestly:

- Can a first-time visitor explain Bitplaza after the hero alone?
- Does the first viewport show the product?
- Is there one dominant idea, and two obvious pathways?
- Does every claim survive a skeptical builder checking it?
- Is AI presented as a constrained tool?
- Would a respected builder share this page without apologizing for it?

The result should feel simple because hard decisions were made, not because
detail was ignored.
