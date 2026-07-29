# Bitplaza — Design Specification

**Version 2.0 · 2026-07-29**

> **Status.** This document replaces the visual direction in
> `docs/01-design-system.md` ("Blue Hour + Wayfinding"), which is now superseded.
> That direction was dark-first, serif-led, and built on thin network lines —
> three things this specification explicitly rules out. The architecture from
> that stage survives; the visual layer does not. §24 lists exactly what is kept,
> retuned, or deleted.
>
> **Two notes on method.** Buzz is used here as a described reference — its
> emotional tone and interface behaviour — not as a visual source. Nothing in
> this document was matched against its assets, and nothing should be copied from
> them. Separately: every colour value below has been measured for contrast, and
> the ratios quoted are worst-case across all three grounds in the relevant mode.
> Where a value sits near the line, it says so.

---

## 1. Design North Star

> **A living digital plaza where interests, people, communities and opportunities collide.**

Bitplaza is a **place**, not a tool. Someone arriving should feel they have found
a corner of the internet that was already busy before they got there and will
carry on after they leave.

The single sentence that governs every decision in this document:

> **Build a world, not a landing page.**

If a proposed design would look at home on a Series A infrastructure company's
site, it is wrong for Bitplaza — regardless of how well made it is.

### The test

Show the homepage to someone for four seconds, then take it away. They should be
able to say what it *felt* like ("busy", "friendly", "somewhere I could go") even
if they cannot yet say what the product does. A design that produces "clean" or
"professional" has failed this test.

---

## 2. Brand Promise

**The internet for your interests.**

Bitplaza is an open-source, decentralised network where you enter the communities
you care about, find the people and opportunities inside them, and build an
identity and reputation that travel with you.

Supporting promise, used in the footer and as the closing line:

> **Start with Bitcoin. Expand anywhere.**

What the brand must communicate, in this priority order:

1. Community before technology
2. Discovery before dashboards
3. Participation before consumption
4. Identity and reputation that travel with the user
5. People and agents operating together
6. Open protocols, not another closed platform
7. A network that gets richer as communities connect

Items 5–7 are true and important. They are also the *last* things a newcomer
needs. Nothing from that half of the list may appear above the fold.

---

## 3. Emotional Goals

The experience must feel:

| Quality | What it looks like in practice |
|---|---|
| **Alive** | Something is always moving somewhere on screen, gently. Activity implied beyond the viewport edge. |
| **Curious** | Compositions that reward a second look. Objects partially out of frame. Things you want to click before you know what they do. |
| **Optimistic** | Warm light, saturated colour, upward motion, generous space. No scarcity or urgency framing. |
| **Social** | Characters, avatars, and artifacts that clearly belong to *someone*. Never an empty room. |
| **Playful** | Stickers, tilts, wobble, imperfect edges — deployed with restraint and never on a control. |
| **Experimental** | Layouts that break the grid on purpose. One genuinely odd moment per page. |
| **Open-source** | Visible seams. Monospace where the machinery shows. Nothing pretending to be more finished than it is. |
| **Slightly weird** | One element per screen that a committee would have removed. |
| **Technically credible** | Precise alignment, real numbers, honest states. The weirdness sits on top of rigour, never instead of it. |
| **Welcoming** | Someone who has never heard of Nostr, Bitcoin, or agents can use the whole homepage without hitting a word they must look up. |

The hardest pairing here is **playful + credible**. The resolution used
throughout: *the world is playful, the controls are exact.* Illustration,
motion, texture and colour carry the personality. Buttons, forms, type hierarchy
and states behave with complete precision.

---

## 4. Audience

Five readers, one page. Ordered by whom the homepage optimises for.

| # | Reader | What they need in the first 10 seconds | Where they are served |
|---|---|---|---|
| 1 | **Curious newcomer** — first interest-based community | "Is there something here for me?" | Hero, §2 scattered, §3 choose your plaza |
| 2 | **Active member** — wants people, projects, events, work | "Show me the actual stuff" | §4 meet the plaza, §7 first plaza |
| 3 | **Community organiser** — wants to run a plaza | "Could I put my community here?" | §3 (a "start one" portal), dedicated page |
| 4 | **Builder** — evaluating the infrastructure | "Is this real and is it open?" | §6 built in the open, repo link in header |
| 5 | **Partner / investor** — assessing ambition | "How big is this and is it credible?" | Inferred from §3 breadth and §6 rigour. **Never addressed directly.** |

**The homepage optimises for reader 1.** Readers 4 and 5 are served by depth
further down and by the quality of the execution — not by language aimed at
them. Investor-facing framing above the fold is a specified failure.

---

## 5. Creative Direction

The visual world combines seven references, blended rather than alternated:

| Reference | What it contributes |
|---|---|
| **A public plaza** | Arches, thresholds, paving, kiosks, noticeboards, benches. Ground-level, not aerial. |
| **A map** | Wayfinding, pins, districts, legends, "you are here". |
| **A multiplayer world** | Inhabitants, presence, things happening without you. |
| **A community bulletin board** | Layered posters, pinned notes, stickers, misregistered print. |
| **An internet directory** | Honest structure, categories, counts, dense browsability. |
| **A playful operating system** | Windows, cards, cursors, toggles — friendly and slightly toy-like. |
| **A constellation of interests** | Communities as places that can be near or far from each other. |

### The governing motif: **the arch**

One shape carries the whole identity: **a rounded arch — a doorway.**

It is the logo, the plaza portal card, the mascot silhouette, the map pin, and
the loading indicator. Everything in the system either *is* an arch, *sits under*
one, or *passes through* one.

Why this and not a network graph: an arch is a threshold, and the product's core
promise is entering somewhere. A node graph describes topology, which is what the
engineering is, not what the experience is. It is also the single most overused
motif in this category — explicitly prohibited in §23.

### Banned metaphors

Thin glowing lines connecting glowing dots. Globes. Orbiting rings. Circuit
boards. Isometric city blocks. Abstract mesh gradients. Hexagon grids.

---

## 6. Visual Personality

> **The welcoming guide to the weird and wonderful internet.**

Bitplaza is the person at the party who introduces you to three people you end up
liking. Knowledgeable, unpretentious, slightly odd, genuinely pleased you came.

| It is | It is not |
|---|---|
| Curious like early web communities | Nostalgic or skeuomorphic about them |
| Polished like a contemporary consumer product | Sanded smooth |
| Friendly like a neighbourhood gathering place | Twee or folksy |
| Free like an open-source project | Scruffy or unfinished-looking |
| Imaginative like a multiplayer world | Gamified, with points and streaks |
| Credible enough for identity and commerce | Institutional |

**Hard exclusions.** Crypto-bro. Cyberpunk. Dystopian. Luxury fintech.
Institutional. Childish. Meme-only. Overly futuristic. Discord clone.
Conventional social network. Generic AI startup.

The line between *playful* and *childish* is the one most at risk. The rule:
**sophisticated construction, playful behaviour.** Precise geometry, considered
colour, real typographic craft — that happens to bounce. Never crude shapes,
rainbow gradients, comic lettering, or cartoon outlines.

---

## 7. Design Principles

These are the ten decisions to fall back on when this document does not cover a
case. They are ordered; earlier beats later in a conflict.

1. **Build a world, not a landing page.** Sections are districts you move
   through, not slides you scroll past.
2. **Make community visible.** People, artifacts and activity appear on screen.
   Never describe a community in prose where you could show one.
3. **Show activity instead of explaining infrastructure.** A live event card
   beats a paragraph about events.
4. **Use playfulness to reduce intimidation.** Warmth is the on-ramp for people
   who find this world alienating. Playfulness is a function, not a decoration.
5. **Keep the product credible enough for identity and commerce.** People will
   attach their name and their money. Nothing may feel like a toy at the moment
   of commitment.
6. **Make every interaction feel welcoming.** No dead ends, no scolding errors,
   no empty states without a way forward.
7. **Let communities express themselves inside a coherent system.** Communities
   vary colour and artifacts; they never vary layout, type, or component
   behaviour.
8. **Design for motion without depending on motion.** Every screen must be
   complete, legible and beautiful as a still frame.
9. **Explain the human value before the protocol.** Nostr, agents and
   decentralisation appear only after someone already wants in.
10. **Be unmistakably Bitplaza.** If a competitor could ship this asset with a
    logo swap, it is not finished.

---

## 8. Colour System

Light mode is the **primary expressive experience**. Dark mode is fully designed
and equally supported, but the brand's hero look — screenshots, social cards, the
homepage as most people meet it — is light, warm and saturated.

### 8.1 Signature

| Token | Hex | Role |
|---|---|---|
| `--bp-apricot` | `#FF6A3D` | **The Bitplaza colour.** Signature fill. |

Electric apricot: a coral-leaning orange that reads as warm light through a
doorway. It is chosen to sit clearly apart from Bitcoin orange (`#F7931A`), which
is amber and yellow-leaning — the two must never be confused, because Bitcoin is
one community inside Bitplaza, not the brand.

> **Structural rule, measured not assumed.** Apricot takes **ink** text
> (`#1A1310`, 6.45:1). White on apricot is **2.85:1 and fails** — it may never be
> used for text, at any size. Where a design calls for white on apricot, the
> design is wrong.

### 8.2 Core palette — light mode

| Token | Hex | Role | Contrast |
|---|---|---|---|
| `--bp-paper` | `#FDF8F1` | Page ground. Warm cream, never pure white. | — |
| `--bp-surface` | `#F7F0E4` | Raised bands, cards on paper. | — |
| `--bp-raised` | `#FFFFFF` | Cards on surface, modals, inputs. | — |
| `--bp-ink` | `#1A1310` | Body and display text. Warm near-black. | 16.2:1 |
| `--bp-ink-muted` | `#5A4F47` | Secondary text. | 7.0:1 |
| `--bp-ink-faint` | `#6E6259` | Captions, metadata. **Floor — nothing lighter.** | 5.2:1 |
| `--bp-apricot` | `#FF6A3D` | Signature fill. Ink text only. | 6.45:1 on-fill |
| `--bp-apricot-ink` | `#B33509` | Apricot as **text**. | 5.4:1 |
| `--bp-cobalt` | `#2440E0` | Cool support. Wayfinding, links, focus. White text. | 7.28:1 on-fill |
| `--bp-cobalt-ink` | `#1E36C4` | Cobalt as **text**. | 7.8:1 |
| `--bp-citron` | `#D6E63C` | Warm support. Highlight fields, stickers. Ink text. | 13.3:1 on-fill |
| `--bp-citron-ink` | `#5C6410` | Citron as **text**. | 5.6:1 |
| `--bp-mint` | `#3ECF9A` | Live / active / present. Ink text. | 9.3:1 on-fill |
| `--bp-mint-ink` | `#0F6B4C` | Mint as **text**. | 5.7:1 |
| `--bp-edge` | `#E4D9C8` | Hairlines, card borders. | — |
| `--bp-edge-strong` | `#C9B9A2` | Emphasised borders, outline buttons. | — |
| `--bp-focus` | `#2440E0` | Focus ring. | 6.4:1 (needs 3:1) |

### 8.3 Core palette — dark mode

Not an inversion. Dark mode is **the plaza at night**: warm near-black rather than
blue-black, with apricot and citron doing the lighting.

| Token | Hex | Role | Contrast |
|---|---|---|---|
| `--bp-paper` | `#17120F` | Page ground. Warm, never blue-black. | — |
| `--bp-surface` | `#211A15` | Raised bands. | — |
| `--bp-raised` | `#2B221C` | Cards, modals, inputs. | — |
| `--bp-ink` | `#FBF4EA` | Body and display text. | 14.3:1 |
| `--bp-ink-muted` | `#B7A99C` | Secondary text. | 6.8:1 |
| `--bp-ink-faint` | `#9C8D80` | Captions. **Floor.** | 4.85:1 |
| `--bp-apricot` | `#FF6A3D` | Fill. **Unchanged** — the signature does not shift. | 6.45:1 on-fill |
| `--bp-apricot-ink` | `#FF9166` | Apricot as **text**. | 7.0:1 |
| `--bp-cobalt-ink` | `#8FA0FF` | Cobalt as **text**. | 6.4:1 |
| `--bp-citron-ink` | `#D6E63C` | Citron as **text**. | 11.3:1 |
| `--bp-mint-ink` | `#5FE0B4` | Mint as **text**. | 9.5:1 |
| `--bp-edge` | `#382C24` | Hairlines. | — |
| `--bp-edge-strong` | `#544236` | Emphasised borders. | — |
| `--bp-focus` | `#FF9166` | Focus ring. | 7.0:1 |

### 8.4 Community accents

Ten communities, each with **three tokens** — a fill, a text colour for light
grounds, and one for dark. One hue cannot serve all three roles above AA; this is
not over-engineering, it is arithmetic.

**On-fill text is chosen by measurement, per community.** Four take ink, six take
white. There is no convention to memorise — measure, then pick.

| Community | Fill | On-fill | Text (light) | Text (dark) |
|---|---|---|---|---|
| Bitcoin | `#F7931A` | ink (7.99) | `#8A5008` (5.74) | `#FFB454` (8.83) |
| Music | `#E0457B` | ink (4.64) | `#B32458` (5.60) | `#FF93B4` (7.48) |
| Design | `#7B3FF2` | white (5.48) | `#6326D6` (6.67) | `#C0A5FF` (7.47) |
| Open source | `#0E9F6E` | ink (5.42) | `#0B7A54` (4.72) | `#4FDCA6` (8.99) |
| Local | `#E4572E` | ink (4.98) | `#A33418` (6.06) | `#FFA07D` (7.84) |
| Collecting | `#0D7EA8` | white (4.60) | `#0A6386` (5.90) | `#5EC8EF` (8.15) |
| Education | `#3B49DF` | white (6.55) | `#2C39B8` (7.77) | `#98A6FF` (6.85) |
| Gaming | `#C026A8` | white (5.14) | `#9C1F87` (6.26) | `#F292DE` (7.37) |
| Sports | `#1F7A3D` | white (5.37) | `#186231` (6.55) | `#59C97F` (7.48) |
| AI | `#5A5F6B` | white (6.39) | `#4A4F59` (7.26) | `#B8BEC9` (8.34) |

All thirty combinations clear AA. **Tightest three — watch these in review:** Open
source text-light (4.72), Music on-fill (4.64), Collecting on-fill (4.60). Do not
lighten any of them.

**Fills are absolute** and do not shift between themes. A community's colour is
its identity; only its text variant adapts.

**Local** (`#E4572E`) sits close to apricot. That is deliberate — the local
community is the warmest one — but the two must never be adjacent without a
border between them.

### 8.5 Semantic colour

Kept separate from brand and community colour. Semantic states never borrow the
accent, and the accent never signals state.

| State | Light fill | Light text | Dark text |
|---|---|---|---|
| Success | `#3ECF9A` | `#0F6B4C` | `#5FE0B4` |
| Warning | `#F5B93B` | `#8A5008` | `#FFC96B` |
| Danger | `#E03A2F` | `#A8241B` | `#FF8F84` |
| Info | `#2440E0` | `#1E36C4` | `#8FA0FF` |

### 8.6 Rules

1. **Colour never carries meaning alone.** Every state pairs colour with a word,
   an icon, or a shape. Plaza status uses colour *and* a label ("Live", "Forming",
   "Idea") *and* a distinct marker shape.
2. **One saturated field per viewport.** Full-bleed apricot, citron or cobalt
   bands are the loudest tool available. Two at once is noise.
3. **Citron is a highlight, never a surface.** It works as a sticker, an
   underline, a pull-quote field. A citron page background is prohibited.
4. **Cream, not white.** `#FFFFFF` appears only as a raised card on top of
   `--bp-surface`. A pure-white page ground is off-brand.
5. **Apricot is spent, not spread.** Roughly one apricot element per viewport
   with real weight — the primary CTA, or a full-bleed band, not both.

---

## 9. Typography System

### 9.1 Families

| Role | Family | Why |
|---|---|---|
| **Display** | **Bricolage Grotesque** (variable: weight, width, optical size) | Contemporary, genuinely unconventional, engineered for very large sizes. Its width and optical-size axes give the poster energy this brand needs without adding a second display face. |
| **Body** | **Geist Sans** (variable) | Highly readable at small sizes, neutral enough to carry long copy, modern without personality that fights the display face. |
| **Utility** | **Geist Mono** | The open-source voice. Used for labels, counts, IDs, technical sections, and anywhere the machinery is deliberately visible. |

All three self-hosted at build time. **No font CDN requests** — a third-party font
request is a third-party log entry, which contradicts the data commitment.

**Alternatives, if Bricolage is rejected:** *Gabarito* (friendlier, more geometric,
less trend-exposed) or *Anybody* (wider variable range, weirder, harder to
control). **Bricolage Grotesque is the recommendation.**

**No serif.** The previous direction used an inscriptional roman for display; it
is a large part of why the site read as formal. A serif may appear only inside a
community's own customisation (§11.5), never in Bitplaza chrome.

### 9.2 Scale

Fluid, `clamp()`-based. Line heights tighten as size grows.

| Token | Size | Line height | Tracking | Use |
|---|---|---|---|---|
| `display-hero` | `clamp(3rem, 1.6rem + 6.4vw, 7.5rem)` | 0.94 | −0.035em | Homepage hero only. One per site. |
| `display-1` | `clamp(2.5rem, 1.6rem + 4.2vw, 5rem)` | 0.98 | −0.03em | District openers. |
| `display-2` | `clamp(2rem, 1.5rem + 2.4vw, 3.25rem)` | 1.04 | −0.022em | Section headings. |
| `heading-1` | `clamp(1.5rem, 1.3rem + 1vw, 2rem)` | 1.15 | −0.015em | Card group headings. |
| `heading-2` | `1.25rem` | 1.25 | −0.01em | Card titles. |
| `body-lg` | `clamp(1.0625rem, 1rem + 0.4vw, 1.25rem)` | 1.55 | 0 | Section leads. |
| `body` | `1rem` | 1.6 | 0 | Default. |
| `body-sm` | `0.9375rem` | 1.55 | 0 | Dense card copy. |
| `caption` | `0.8125rem` | 1.45 | 0 | Metadata. |
| `label` | `0.6875rem` | 1.4 | 0.12em, uppercase | Eyebrows, tags. Mono. |
| `button` | `0.9375rem` | 1 | 0.005em | Controls. Weight 600. |

**Never below `0.8125rem` for anything a user must read.** Metadata included.

### 9.3 Weight and width

| Context | Weight | Width |
|---|---|---|
| Hero display | 800 | 110 (expanded) |
| District openers | 700 | 100 |
| Section headings | 700 | 100 |
| Card titles | 600 | 100 |
| Body | 400 | — |
| Emphasis in body | 600 | — |
| Buttons | 600 | — |
| Mono labels | 500 | — |

The expanded width on the hero is the typographic signature. Used once per page,
at the largest size, it is what makes the wordmark and headline feel like
*signage* rather than a headline.

### 9.4 Rhythm

Typography carries personality through **line breaks**, not decoration.

- Hero and district headlines are **manually broken** — the break is a design
  decision, authored in the content module as an array of lines, never left to
  the browser.
- Headlines get `text-wrap: balance`; body gets `text-wrap: pretty`.
- Running text stays at **60–70 characters**. Card copy 40–55.
- Never centre more than three lines of text.
- Uppercase mono labels always carry ≥ 0.12em tracking, or they read as noise.
- Digits in any column: `font-variant-numeric: tabular-nums`.

### 9.5 Expressive typographic moments

Allowed, sparingly — no more than two per page:

- A headline where one word sits in apricot or on a citron highlight field.
- A headline that runs off the right edge of the viewport (never the left).
- A word set in the mono face inside a display line, as a "term of art" marker.
- Text set on a slight rotation (≤ 3°) inside a sticker.

Prohibited: text on a curve, outlined text, gradient-filled text, letter-by-letter
colour, animated typing effects.

---

## 10. Logo and Symbol Direction

**This is a brief, not final artwork.**

### 10.1 Wordmark

"Bitplaza", set in **Bricolage Grotesque, weight 800, width 110**, tracking
−0.03em, lowercase-height optimised. It must be legible at 16px in a browser tab
row and commanding at 400px on a poster.

The wordmark is **always ink or paper** — never apricot, never gradient, never on
a photographic background.

### 10.2 Symbol — three directions

**Direction A — The Arch (RECOMMENDED)**

A rounded arch: a shape with a flat base, straight sides, and a fully
semicircular top. Inside it, negative space. Optionally a small dot or figure at
the threshold.

- *App icon:* arch in apricot on cream, or reversed.
- *Favicon:* the arch silhouette alone; readable at 16px because it is one shape.
- *Plaza marker:* the arch, filled with the community's colour.
- *Map pin:* the arch with the base drawn to a point.
- *Doorway:* it already is one.
- *Loading:* the arch fills from the base upward.
- *Profile badge:* the arch as a frame around an avatar.

Why it wins: it is the only one of the three that is *literally the product's
promise* — a threshold you step through. It survives at 16px, it tessellates into
a colonnade, it frames content, and it is the mascot silhouette (§11), which
makes the whole system cohere from one shape.

**Direction B — The Tile**

A squircle plaza paving tile with one corner notched. Tiles tessellate into a
ground; each community owns a tile colour.

- Strong for pattern and backgrounds; excellent as a repeating texture.
- Weak as a pin and weak at favicon size — a notched square reads as a generic
  rounded square below about 24px.

**Direction C — The Gather**

Five or six dots of varying size clustered into a loose ring, implying people
around a space.

- Warm and immediately "community".
- Rejected: it is a hair away from the node-cluster mark this brand is defined
  against, and it does not scale down — the dots merge into a blob.

### 10.3 The recommendation

**Direction A, the Arch.** Build the identity on it.

Construction notes for the designer:

- Proportion: width : height ≈ 1 : 1.15. Slightly taller than wide, so it reads
  as a doorway rather than a tunnel.
- Stroke: solid fill preferred. If an outline lockup is needed, stroke weight
  ≥ 1/8 the arch width so it holds at small sizes.
- The base is **open** — no floor line. A closed arch reads as a tombstone.
- One optional variant carries a small filled dot centred at the base: a person
  standing in the doorway. Use for the profile badge and the mascot base.
- A colonnade of 3–5 arches at varying heights is the secondary lockup, used for
  section markers and the loading state.

**Do not** add: rays, a sun, a globe, orbit lines, a gradient, or a circuit
pattern inside the arch.

---

## 11. Character and Mascot Direction

### 11.1 Should there be one? Yes — a modular system, not a single mascot.

A single mascot becomes the brand and crowds out the communities. A **family of
small residents** does the emotional work while staying secondary, and gives
communities something to make their own.

### 11.2 The concept: **Regulars**

The people you always see in a plaza. Not animals, not humans — **plaza residents**:
small inhabitants whose body *is the arch from the logo*. The mark and the
characters are the same shape at different scales, which is what holds the system
together.

### 11.3 Construction

- **Body:** the arch silhouette. Flat base, straight sides, domed top.
- **Height:** 1–3 units in a modular scale, so Regulars can be short and wide or
  tall and narrow. Variation in proportion is where personality comes from —
  never in facial expression.
- **Face:** two dots for eyes. **That is the entire face.** No mouth, no eyebrows,
  no blush, no limbs. This constraint is the single most important defence
  against looking childish.
- **Colour:** one flat community or brand colour per Regular, plus ink dots.
- **Held object (optional):** exactly one artifact floating beside them — a
  ticket, a key, a badge, a tiny poster, a coin, a book. The artifact says what
  they are doing; the body never does.
- **Shadow:** a single soft ellipse. It anchors them to the ground and stops them
  reading as floating stickers.

### 11.4 Where they appear — and do not

| Appear | Do not appear |
|---|---|
| Homepage hero, populating the plaza | Inside forms |
| Empty states (one Regular, holding the thing that is missing) | Inside error messages |
| Loading states | On buttons |
| Section transitions, walking between districts | Beside pricing or legal copy |
| Community portal cards, as residents | On the identity/reputation section |
| 404 and offline pages | Anywhere a user is entering personal or payment data |

The exclusion list is the rule that keeps §7.5 (credible for identity and
commerce) intact. **At the moment of commitment, the characters leave the room.**

### 11.5 Community customisation

A community may:

- Recolour Regulars to its accent colour.
- Contribute up to three custom held-artifacts.
- Choose which three Regulars appear on its plaza portal.

A community may **not** alter the body silhouette, add facial features, add
limbs, or supply its own character art. The silhouette is the brand.

### 11.6 Avoiding childish

1. Two dots, no mouth. Non-negotiable.
2. No outlines. Flat fills with a soft shadow read as design; black outlines read
   as cartoon.
3. Restrained motion — drift and settle, never squash-and-stretch or bounce.
4. Never more than five Regulars in one composition.
5. Real typography and precise alignment around them. Characters in a sloppy
   layout read as a kids' product; characters in a rigorous one read as wit.

---

## 12. Illustration System

### 12.1 Language

**Soft-dimensional, tactile, sticker-adjacent.** Objects that look like they were
photographed as small physical things and cut out — matte-finish, gently
rounded, with real weight.

| Property | Specification |
|---|---|
| Form | Simplified geometry, generously rounded edges. Recognisable silhouette at 32px. |
| Material | Matte, slightly soft. Like painted wood, dense foam, or risograph-printed card. **Never** glossy, chrome, glass, or metallic. |
| Lighting | One consistent key light, upper-left, ~35°. One soft shadow lower-right. Identical across every asset — inconsistent lighting is the fastest way a set stops reading as a set. |
| Palette | Two to three colours per object, drawn from the system palette. Never a gradient mesh. |
| Edges | Slightly imperfect. A hand-cut sticker edge, not a vector path. |
| Outlines | None, or a single ink line at consistent weight. Never both across one set. |
| Faces | Only on Regulars. Objects do not have eyes. |

### 12.2 What must be illustrated

Illustration exists to explain product concepts, not to decorate. The required
set, each communicating one idea:

| Concept | Depicted as |
|---|---|
| Entering a plaza | A Regular stepping through a colonnade arch, artifacts visible beyond |
| Finding your people | Three or four Regulars converging on one spot, paths implied by paving |
| Building reputation | A passport-like object gaining stamps; badges accumulating on a lanyard |
| Discovering opportunities | A noticeboard with layered, overlapping pinned cards |
| Connecting communities | Two arches side by side with a shared threshold between them |
| Bringing an agent in | A small non-arch object — a floating cube with one eye — walking beside a Regular |
| Buying / learning / attending / contributing | A market stall, a book with a bookmark, a torn ticket stub, a hand adding a tile to a mosaic |

### 12.3 Composition

- Objects sit in shallow space at a slight angle, never flat-on and never
  isometric.
- At least one object breaks the frame edge on every hero composition. Activity
  continues beyond the viewport.
- Overlap is essential. Objects that never touch read as a spec sheet.
- Scale is intentionally inconsistent — an event ticket may be as large as a
  building. This is a plaza of ideas, not a diorama.

### 12.4 Prohibited

Generic AI-generated surrealism (floating spheres, impossible architecture,
iridescent blobs). Stock illustration. Corporate flat-vector people. Isometric
cityscapes. Anything with a gradient mesh. Photography of any kind.

---

## 13. Texture and Material Language

Texture stops saturated colour fields from feeling like a flat CSS background.

| Technique | Where | Specification |
|---|---|---|
| **Paper grain** | Page ground, full-bleed colour fields | Fine monochrome noise, 3–5% opacity. One tiling PNG ≤ 8KB, repeated. Never per-element SVG filters. |
| **Halftone** | Inside large colour fields, behind display type | Dot screen at low contrast, dots 4–8px. Used as a gradient substitute — a halftone ramp instead of a linear-gradient. |
| **Print misregistration** | Stickers, badges, community marks | The signature texture move: a 1–2px offset duplicate of the shape in a second colour, at ~30% opacity. Reads as cheap offset printing. Ownable and cheap. |
| **Soft blur** | Background artifacts, depth layers | 8–24px blur on far-layer objects only. Never on text or controls. |
| **Layered shadow** | Cards, portals | Two shadows: a tight contact shadow and a wide soft one. Warm-tinted, never neutral grey. |
| **Imperfect borders** | Noticeboards, posters | Slightly irregular edge via a mask, ≤ 2px deviation. |

### Rules

1. Texture never touches text. No grain, halftone or blur over a text layer.
2. One texture per surface. Grain *or* halftone, not both.
3. Total texture asset budget: **≤ 40KB** across the site.
4. Texture is decorative and must be `aria-hidden`.
5. All texture disables under `prefers-reduced-transparency` and on `save-data`.

### Shape and radius

The radius system is deliberate, not `rounded-lg` everywhere.

| Token | Value | Applies to |
|---|---|---|
| `--r-pill` | `999px` | Buttons, tags, chips, badges |
| `--r-card` | `20px` | Cards, modals, inputs |
| `--r-field` | `12px` | Small inputs, tooltips |
| `--r-arch` | `999px 999px 20px 20px` | **Plaza portals only** |
| `--r-sticker` | `4px` | Stickers, artifacts |

`--r-arch` is the ownable shape: a card with a fully rounded top and a squared
base. It is a doorway. It appears **only** on plaza portals, so it never loses
meaning.

---

## 14. Motion System

Motion makes the plaza inhabited. It must never be a prerequisite for
comprehension.

### 14.1 Tokens

| Token | Value | Use |
|---|---|---|
| `--ease-plaza` | `cubic-bezier(0.22, 1, 0.36, 1)` | Entrances, reveals |
| `--ease-settle` | `cubic-bezier(0.34, 1.4, 0.64, 1)` | Hover, small overshoot. **Overshoot ≤ 1.4** |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Dismissals |
| `--dur-instant` | `120ms` | Hover, focus |
| `--dur-quick` | `240ms` | Toggles, tooltips |
| `--dur-normal` | `420ms` | Card entrance, modal |
| `--dur-portal` | `640ms` | Plaza transitions |
| `--dur-ambient` | `8–20s` | Drift loops |

### 14.2 Behaviours

| Behaviour | Specification |
|---|---|
| **Ambient drift** | Background artifacts translate ≤ 12px over 8–20s, sine-eased, desynchronised phases. Never rotate more than 2°. |
| **Cursor proximity** | Cards tilt ≤ 3° and lift 2–4px when the pointer is within ~120px. Pointer-only (`@media (hover: hover)`); never on touch. |
| **Gathering** | On a section entering view, 3–5 artifacts converge from off-frame to their resting positions over `--dur-normal`, staggered ≤ 60ms. Fires once. |
| **Portal transition** | Entering a plaza: the arch scales up and the destination reveals through its shape. `--dur-portal`. |
| **Active pulse** | Live community markers pulse scale 1.0 → 1.06 → 1.0 over 2.4s. **Colour and a "Live" label carry the meaning; the pulse is decoration.** |
| **Regulars traversal** | A Regular may walk across a section boundary once per page. Loop-free, ≤ 6s, never crossing text. |
| **Reveal** | Opacity 0 → 1, translateY 14px → 0, `--dur-normal`, `--ease-plaza`. Once only. |

### 14.3 Hard rules

1. **Reduced motion is a hard stop, not a slowdown.** All ambient drift,
   gathering, pulsing and traversal cease. Reveals resolve instantly to the final
   state. Portal transitions become instant cuts.
2. **Content is visible by default.** Reveal hides content only after JS confirms
   it can un-hide it. A failed script must never leave a blank page. Implement by
   marking the document script-capable before first paint and hiding from CSS —
   not by shipping `opacity: 0` from the server.
3. **`IntersectionObserver` is not sufficient on its own.** It samples at frame
   boundaries and misses elements when the viewport jumps (End key, scrollbar
   drag, restored scroll position). Pair it with a bounding-box sweep on scroll.
   *This is a bug that has already occurred on this site.*
4. **Only `transform` and `opacity`** animate. No layout-affecting properties.
5. **No scroll hijacking, no scroll-driven narrative, no cinematic intro, no
   parallax beyond 0.2× differential.**
6. Ambient loops pause when off-screen and when the tab is hidden.
7. Any single animation blocking comprehension for more than 400ms is a defect.

---

## 15. Spatial and Layout System

### 15.1 Districts, not sections

The page is a route through a plaza. Each district must differ from its
neighbours in **at least two** of: ground colour, layout axis, content density,
object scale.

Three consecutive centred-heading-plus-three-cards sections is a specified
failure.

### 15.2 Grid and space

- 12 columns, 72px max gutter, container `max-width: 1400px`.
- Full-bleed colour fields break the container; content inside returns to it.
- Spacing scale: 4px base — `4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192`.
- District vertical padding: `clamp(80px, 10vw, 192px)`.
- Asymmetry is the default. A district that is symmetrical should be so on
  purpose — the "Enter the plaza" closing invitation, for instance.

### 15.3 Layering

Four depths, consistently applied:

| Layer | Contents | Treatment |
|---|---|---|
| **Ground** | Page colour, grain, halftone | No motion beyond ambient |
| **Far** | Distant artifacts, colonnade silhouettes | Blurred 8–24px, ≤ 40% opacity, slowest drift |
| **Mid** | Cards, portals, primary illustration | Sharp, full opacity, cursor-reactive |
| **Near** | Stickers, badges, Regulars, floating artifacts | Sharp, may overlap Mid and break frame |

Text always sits on Ground or Mid. **Text never sits on Near, and Near never
crosses text.**

### 15.4 Composition rules

1. Every district has one dominant element at least 2× the visual weight of
   anything else.
2. At least one element breaks the container edge per district.
3. Cards overlap by 8–24px where they cluster. Perfectly aligned grids read as a
   spec sheet.
4. Generous whitespace around dense clusters — the density must feel chosen.
5. Mobile keeps overlap and asymmetry. Collapsing to a single centred column is
   how the world flattens into a landing page.

---

## 16. Homepage Narrative

Eight districts. A journey, not a feature list.

### District 1 — Enter Bitplaza

**Goal:** "I don't fully know what this is yet, but I want to enter."

- **Headline:** *The internet for your interests.* — `display-hero`, expanded
  width, manually broken across two or three lines.
- **Supporting:** **one sentence, maximum 20 words.** Recommended: *"Find the
  communities you care about, the people inside them, and everything worth doing
  next."*
- **Actions:** `Enter the first plaza` (primary, apricot) · `Request early
  access` (secondary) · `See how it works` (tertiary text link) · a small
  repo link in the header, not the hero.
- **Visual:** a plaza coming alive. A colonnade of 3–5 arches at varying heights
  across the lower two-thirds, each filled with a community colour. Regulars
  entering and standing at thresholds. Artifacts — a ticket, a badge, a message
  bubble — drifting between them. At least two objects break the frame.
- **Motion:** on load, the colonnade is already present; artifacts gather over
  `--dur-normal` staggered 60ms; ambient drift thereafter.
- **Prohibited:** a paragraph. A device mockup. A "trusted by" row. Any word from
  the list in §19.3.

### District 2 — Everything you care about is scattered

**Goal:** understood before the copy is read.

- **Visual, first:** eight labelled fragments — chats, feeds, calendars,
  profiles, marketplaces, courses, job boards, documents — scattered at
  irregular angles across a cool, low-saturation ground. Deliberately disordered,
  slightly grey, drifting apart.
- **The turn:** on scroll, they converge into a single arch, gaining colour as
  they arrive. This is the page's one big scroll-linked moment and it must be
  comprehensible as a static before/after.
- **Copy:** headline *Your interests are scattered across a hundred places.*
  Support, one sentence.
- **Ground:** the only cool-leaning district. It sets up the warmth of everything
  after it.

### District 3 — Choose your plaza

**Goal:** breadth. Bitcoin is first, not the whole thing.

- **Layout:** a scattered field of **plaza portals** (`--r-arch`), varying in
  size, overlapping, not a grid.
- **Status — three states, each with colour, label and marker shape:**
  - **Live** — full colour, mint dot, "Live" label, pulse. *Bitcoin Culture Hub.*
  - **Forming** — 60% colour, outlined marker, "Forming" label, member count.
  - **Idea** — outline only, dashed border, "Idea" label, "vote for this" action.
- Examples: Bitcoin (live); Music, Local, Collecting, Open source (forming);
  Education, Sports, Creative scenes (idea).
- One portal is always **"Start your own"** — apricot, arch outline, for organisers.
- **Copy:** *Start with Bitcoin. Expand anywhere.*

### District 4 — Meet the plaza

**Goal:** show activities happening in a world, not features in a grid.

**Explicitly not eight identical cards.** Eight *scenes*, each a small composition
with its own layout, at different scales, arranged as a noticeboard.

| Scene | Shows |
|---|---|
| Find people | Overlapping profile cards, presence dots |
| Discover events | A torn ticket stub with a real date and place |
| Join projects | A project card with contributor avatars and an open-role tag |
| Build reputation | A passport gaining a stamp |
| Collect and buy | A market stall with priced objects |
| Learn | A book with a progress bookmark |
| Work with agents | The cube-agent beside a Regular, doing something specific |
| Carry your identity | A badge lifting off one plaza and landing in another |

Each has one line of copy in the imperative. No sub-descriptions.

### District 5 — Your identity travels with you

**Goal:** human value first, protocol later.

- **Headline:** *Your history should belong to you — not to a platform.*
- **Support:** *Everything you build in one community comes with you to the next.
  Nobody can take it away, including us.*
- **Visual:** a passport-like object with stamps from several communities, lifting
  out of one arch and moving toward another. Regulars absent — this is a moment of
  commitment (§11.4).
- **Protocol detail:** one collapsed disclosure, *"How this works"*, revealing the
  open-protocol explanation. Collapsed by default.
- Full-bleed cobalt or ink ground. The most composed district on the page.

### District 6 — Built in the open

**Goal:** credibility for builders, without losing anyone else.

- Mono-forward. Real repo, real licence, real link. Visible seams.
- **Six plain-language claims,** each one line, each verifiable:
  open source (AGPL-3.0) · content openly licensed (CC BY-SA) · anyone can join
  without permission · your data is portable · communities govern themselves ·
  it works with other apps.
- Nostr, agents and decentralisation appear **here and nowhere earlier.**
- Visual: a colonnade rendered as a technical elevation drawing — measured,
  annotated, still made of arches. The one district where precision is the
  aesthetic.
- Still warm: cream ground, ink and mono, apricot accents. Not a dark terminal.

### District 7 — The first plaza

**Goal:** tangible and immediately explorable.

- Bitcoin Culture Hub, presented as a real place with real contents.
- **Seven categories, with counts:** People · Communities · Events · Learning ·
  Work · Collectibles · Projects.
- Show *actual examples* — three real entries per category, not placeholders. If
  the content does not exist yet, show fewer categories rather than invented ones.
- Bitcoin's accent (`#F7931A`) is used here as the district's colour. This is the
  one place it leads, and it must not appear as a brand colour anywhere else.
- Action: `Explore the first plaza`.

### District 8 — Enter the plaza

**Goal:** a joyful invitation, not an enterprise CTA.

- Full-bleed apricot. The loudest moment on the page, and the last.
- Headline in `display-1`, ink on apricot.
- One action: `Enter the plaza` — ink fill on apricot, oversized.
- The full colonnade, every arch lit, Regulars gathered, artifacts drifting up.
- Symmetrical — the only symmetrical district, so the arrival feels like arrival.
- **No form here.** The form is a modal or a dedicated route. This district
  invites; it does not collect.

---

## 17. Page-by-Page Guidance

| Page | Character | Key requirements |
|---|---|---|
| **Home** | The full journey | §16. Highest visual investment. |
| **A plaza** (`/p/[slug]`) | The community's own world | Community accent leads. Arch masthead. Directory-dense below. Bitplaza chrome stays constant. |
| **Profile** | A passport | Badges, stamps, contributions, communities. Precise and calm — no Regulars, no drift. |
| **Discovery / search** | A map, not a results list | Grouped by type with category markers. Never an undifferentiated list. |
| **Event** | A poster | Poster texture, misregistration, real date and place, one clear action. |
| **Opportunity** | A pinned notice | Noticeboard treatment, honest tags, one action. |
| **Start a plaza** | A workshop | Warm and encouraging. Form-led, so characters appear only in the header. |
| **Waitlist / early access** | A doorway | Short, warm, zero jargon. Success state is a genuine celebration with a Regular. |
| **Legal / data** | Plain and honest | No illustration, no texture, no motion. Reading width, ink on cream. Credibility comes from restraint here. |
| **404 / offline** | A lost Regular | One Regular, one artifact, one route back. The warmest error in the product. |

---

## 18. Component System

Every component below specifies: **role · shape · border · shadow · hover ·
motion · mobile · accessibility.**

Universal rules:

- Minimum touch target **44×44px**, all viewports.
- Focus ring: 2px `--bp-focus`, 2px offset, on every interactive element.
- No component communicates state through colour alone.
- Cursor-proximity effects are `@media (hover: hover)` only.

### Header

Role: constant wayfinding · Shape: full-width bar, 72px desktop / 60px mobile ·
Border: none at top of page; 1px `--bp-edge` once scrolled · Shadow: none;
`--bp-paper` at 92% with 12px blur when scrolled · Hover: nav items get a citron
underline that draws left-to-right in `--dur-instant` · Motion: no hide-on-scroll
— a header that disappears breaks wayfinding · Mobile: wordmark + primary action +
menu; full-screen sheet with arch-framed items · A11y: `<header>` + `<nav
aria-label="Primary">`, skip link first in DOM, menu is a focus-trapped dialog
with `Esc` to close.

### Navigation

Role: move between districts and plazas · Shape: horizontal text links; plaza
switcher is an arch-shaped dropdown · Border: none · Shadow: dropdown gets
layered warm shadow · Hover: citron underline; active item carries a filled
underline · Motion: dropdown scales from 0.96 with origin at the trigger,
`--dur-quick` · Mobile: bottom sheet · A11y: current item `aria-current="page"`;
dropdown is a real menu with arrow-key navigation; never hover-only.

### Announcement bar

Role: one time-bound message · Shape: full-width, 44px min · Border: none ·
Shadow: none · Hover: link underlines · Motion: slides down once on first visit,
`--dur-normal`; never re-animates · Mobile: text truncates to one line with the
full string available to screen readers · A11y: `role="status"`, dismissible with
a real button, dismissal persists, never auto-rotating.

### Primary button

Role: the one thing to do here · Shape: pill (`--r-pill`), 48px desktop / 52px
mobile, 24px horizontal padding · Border: none · Shadow: 0 2px 0 ink at 12% —
a *print* offset, not a soft glow · Hover: lifts 2px, shadow deepens to 4px,
`--ease-settle` · Active: returns to 0, shadow collapses — a real press · Motion:
`--dur-instant` · Mobile: full width on viewports under 480px · A11y: **apricot
fill with ink text only** — white on apricot fails at 2.85:1. Disabled uses 55%
opacity *and* `aria-disabled`.

### Secondary button

Role: the alternative path · Shape: pill · Border: 1.5px `--bp-edge-strong` ·
Shadow: none · Hover: border darkens to ink, background fills `--bp-surface` ·
Motion: `--dur-instant` colour only, no lift — only primaries lift · Mobile: full
width alongside a full-width primary · A11y: never distinguished from the primary
by colour alone; the shape and border differ too.

### Tertiary / text button

Role: low-commitment escape · Shape: text with 4px underline offset · Border:
none · Shadow: none · Hover: underline thickens to 2px · Motion: `--dur-instant` ·
Mobile: 44px tap area via vertical padding · A11y: underlined at rest, so it does
not rely on colour.

### Community card

Role: a community you might enter · Shape: `--r-card`, portrait-leaning · Border:
1px `--bp-edge` · Shadow: contact + soft, warm-tinted · Hover: lifts 4px, tilts
≤ 3° toward the cursor, community colour bleeds in at the top edge · Motion:
`--dur-quick`; gathers on section entry · Mobile: horizontal scroll-snap
carousel, 80% viewport width so the next card peeks — the peek is what implies
more · A11y: the whole card is one link; the accent is decorative and the
community name is always present as text.

### Plaza portal

Role: the doorway into a plaza — the system's signature component · Shape:
**`--r-arch`** · Border: 2px in the community colour · Shadow: layered, warm ·
Hover: the arch's interior brightens as if lit from within; Regulars inside shift
slightly · Motion: on click, scales up and the destination reveals through the
arch shape, `--dur-portal` · Mobile: full width, arch proportion preserved
(1 : 1.15) · A11y: status ("Live" / "Forming" / "Idea") is a text label and a
marker shape, never colour alone. Portal transition respects reduced motion by
cutting instantly.

### Profile card

Role: a person, compactly · Shape: `--r-card` · Border: 1px `--bp-edge` ·
Shadow: contact only — people sit on the surface, not above it · Hover: border
takes the community colour; presence dot brightens · Motion: none beyond hover.
Profiles do not drift; they represent real people · Mobile: full width, avatar
left · A11y: avatar has a real name in `alt` or is `aria-hidden` with the name
adjacent; presence is a dot **and** a word ("Active today").

### Opportunity card

Role: something you could do · Shape: `--r-card`, landscape · Border: 1px
`--bp-edge`, left edge 3px in the community colour · Shadow: contact only ·
Hover: lifts 2px, "pin" artifact rotates 4° · Motion: `--dur-instant` · Mobile:
stacked, tags wrap to a second row · A11y: type ("Role", "Grant", "Project") is
text; compensation and location never implied by icon alone.

### Event card

Role: something happening at a time and place · Shape: `--r-card` with a torn
lower edge (mask) · Border: none — the tear defines it · Shadow: soft, warm ·
Hover: lifts 3px, tears slightly further · Motion: `--dur-quick` · Mobile: full
width, date block left · A11y: date in a `<time datetime>`; "Live now" is a label
and a mint dot; never a colour-only indicator.

### Category marker

Role: what kind of thing this is · Shape: 24px circle containing a simple glyph ·
Border: none · Shadow: none · Hover: n/a — usually decorative · Motion: none ·
Mobile: unchanged · A11y: always paired with a text label. Seven marker shapes,
one per category, distinguishable **by silhouette** so they work in greyscale.

### Tag

Role: a topic or attribute · Shape: pill, 28px tall, 12px padding · Border: 1px
in the community text colour at 30% · Shadow: none · Hover: background fills to
the community colour at 12% · Motion: `--dur-instant` · Mobile: horizontally
scrollable row, never truncated with "+3" unless the full set is reachable ·
A11y: if interactive, a real button with `aria-pressed`; 44px tap target via
padding even though the visual height is 28px.

### Badge

Role: an earned or granted marker · Shape: circular, with §13 print
misregistration · Border: none · Shadow: contact · Hover: tooltip with what it
is and when it was earned · Motion: on first award, scales 0 → 1.06 → 1 with
`--ease-settle` · Mobile: unchanged · A11y: never decorative — every badge has an
accessible name; a group is a list.

### Reputation indicator

Role: standing, honestly · Shape: a horizontal row of stamp marks in a
passport-like field · Border: 1px `--bp-edge` around the field · Shadow: none ·
Hover: each stamp reveals its source · Motion: none — reputation does not
animate · Mobile: wraps to two rows · A11y: **not a score out of five.** A
textual summary ("12 contributions across 3 communities") is the primary content;
the stamps are the illustration of it.

### Agent indicator

Role: this was done by an agent, not a person · Shape: small cube glyph, squared
corners — **deliberately not an arch**, because agents are not residents ·
Border: 1px ink at 40% · Shadow: none · Hover: tooltip naming the agent and its
operator · Motion: a single slow blink of its one eye, every ~12s · Mobile:
unchanged · A11y: **always accompanied by the word "Agent" in text.** Whether
something is a person is never signalled by shape alone — this is the most
important accessibility rule in the system.

### Tooltip

Role: a short clarification · Shape: `--r-field` · Border: none · Shadow: soft ·
Hover: appears after 300ms, disappears after 100ms · Motion: fades and rises 4px,
`--dur-instant` · Mobile: **no tooltips** — the content moves inline or into a
disclosure · A11y: reachable on keyboard focus, dismissible with `Esc`, never the
only place information exists.

### Modal

Role: a focused task · Shape: `--r-card`, max 560px · Border: none · Shadow:
deep, warm · Hover: n/a · Motion: backdrop fades, panel scales 0.98 → 1 over
`--dur-normal` · Mobile: bottom sheet, drag-to-dismiss, safe-area padded · A11y:
focus trapped, focus restored on close, `Esc` closes, labelled by its heading,
background inert.

### Form

Role: the moment of commitment · Shape: inputs `--r-card`, 52px tall · Border:
1.5px `--bp-edge`; focus 2px `--bp-focus` · Shadow: inset 1px at 4% on light ·
Hover: border darkens · Motion: **none.** Forms do not animate, characters do not
appear (§11.4) · Mobile: 16px minimum font size to prevent iOS zoom; labels
always visible, never placeholder-only · A11y: real `<label>` for every field;
errors via `aria-describedby` + `aria-invalid`; an error summary on submit that
moves focus; required fields marked in text as well as symbol.

### Empty state

Role: turn nothing into an invitation · Shape: centred, `--r-card` dashed field ·
Border: 2px dashed `--bp-edge-strong` · Shadow: none · Hover: n/a · Motion: the
Regular drifts gently · Mobile: unchanged · A11y: always contains an action.
"Nothing here yet" without a next step is a defect.

### Loading state

Role: reassure · Shape: the arch, filling from base to apex · Border: none ·
Shadow: none · Hover: n/a · Motion: fill loop, 1.2s, `--ease-plaza`. Skeletons
use a shape-matched block with a slow warm shimmer · Mobile: unchanged · A11y:
`aria-busy` on the region and a visually hidden "Loading". Under reduced motion,
a static arch outline plus text — no shimmer.

### Error state

Role: explain and offer a way forward · Shape: `--r-card`, danger left edge 3px ·
Border: 1px danger at 30% · Shadow: none · Hover: n/a · Motion: none. **Errors do
not shake.** · Mobile: full width · A11y: `role="alert"` for live errors; says
what happened and what to do; never blames the user; never apologises at length.

### Footer

Role: the edge of the plaza · Shape: full-bleed, ink or deep community colour ·
Border: none · Shadow: none · Hover: citron underline · Motion: a faint colonnade
silhouette drifts in the far layer · Mobile: stacked groups, accordion under
480px · A11y: `<footer>` + `<nav aria-label="Footer">`; the analytics opt-out
lives here and must be a real button.

---

## 19. Copy and Voice

### 19.1 Voice

Direct · human · curious · warm · active · slightly playful · free of jargon.

Write the way you would describe the product to a friend who is interested but
not technical. Short sentences. Second person. Verbs first.

### 19.2 Use these

> "Find your people." · "Enter the plaza." · "See what's happening." · "Bring
> your history with you." · "Build something together." · "Your communities
> should know each other." · "Start with Bitcoin. Expand anywhere."

Patterns that work: imperative openers · concrete nouns (people, events, projects,
tickets) over abstractions (engagement, ecosystem) · specific numbers over vague
scale · honest admissions ("we haven't built this yet") which buy more credibility
than confident claims.

### 19.3 Never these

> "AI-powered ecosystem" · "next-generation decentralised infrastructure" ·
> "revolutionary community enablement" · "comprehensive engagement platform" ·
> "seamless" · "unlock" · "empower" · "leverage" · "supercharge" · "reimagine"

Also banned: paragraphs in the hero · "network", "protocol" and "reputation
layer" above district 5 · any sentence that would work for a different company ·
exclamation marks outside a success state · em-dash-heavy pseudo-profundity.

### 19.4 Terminology

| Use | Not |
|---|---|
| Plaza | Vertical, hub, tenant, workspace |
| Community | User base, audience |
| Regulars | Mascots, avatars |
| Enter | Sign up, onboard, get started |
| Your history | Your reputation graph |
| Works with other apps | Interoperable |
| Anyone can join without asking | Permissionless |

### 19.5 Microcopy

Buttons say what happens: `Enter the plaza`, not `Learn more`. Success states
celebrate briefly and say what is next. Errors state the problem and the fix in
one sentence. Empty states are invitations. Loading says what is loading when it
takes over 800ms.

---

## 20. Responsive Behaviour

### Breakpoints

`sm 480` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1536`

**Mobile-first.** Every district is designed at 390px before 1440px.

### What must survive on mobile

Overlap · asymmetry · at least one frame-breaking element per district · texture ·
the arch shape · one ambient motion per screen. Flattening to a centred single
column is how the world becomes a landing page.

### What changes

| Element | Mobile |
|---|---|
| Colonnade | 3 arches instead of 5, taller proportion |
| Portal field | Horizontal scroll-snap with peek |
| Meet-the-plaza scenes | Vertical stack, alternating alignment, scale variation preserved |
| Display type | Drops to `display-1` scale; manual line breaks re-authored per breakpoint |
| Ambient artifacts | Reduced to ≤ 3 per screen |
| Cursor proximity | Removed entirely |
| Header | Wordmark + primary action + menu |

### Touch

44×44px minimum, 8px minimum between targets. Nothing depends on hover. Scroll
areas show a peeking next item. Safe-area insets respected on notched devices.

---

## 21. Accessibility

Non-negotiable. A playful interface that excludes people is a failed interface.

1. **Contrast.** WCAG AA minimum — 4.5:1 text, 3:1 non-text and focus. Every
   value in §8 is measured and stated as **worst case across all three grounds**
   in its mode. Quoting a best case is how token systems ship failing pairs.
2. **Colour is never alone.** Plaza status, presence, agent-vs-person, event
   state, reputation — all carry a text label or a distinct shape.
3. **Keyboard.** Every interactive element reachable and operable. Logical order.
   Skip link first in the DOM. Focus trapped in modals and restored on close.
   `Esc` dismisses.
4. **Focus.** 2px `--bp-focus`, 2px offset, always visible. Never removed. Must
   be visible over every ground and over illustration.
5. **Touch.** 44×44px minimum everywhere.
6. **Typography.** Nothing below 13px. Body 16px minimum on mobile. No text over
   texture, gradient or illustration.
7. **Reduced motion.** A hard stop, not a slowdown. All ambient motion, pulsing,
   drift, traversal and portal transitions cease. Content is fully visible.
8. **Semantics.** One `h1` per page, no skipped levels. Landmarks throughout.
   Decorative illustration `aria-hidden`; meaningful illustration described.
9. **Characters are decorative.** Every Regular is `aria-hidden`. They never
   carry information.
10. **Progressive enhancement.** The page is complete and readable with no
    JavaScript. Content is visible by default; script opts into hiding it.
11. **Testing.** Automated axe-core on every route at three breakpoints, zero
    serious or critical violations. Manual keyboard-only pass of the full funnel.
    Screen-reader spot-check of portals, the plaza switcher and forms.

---

## 22. Performance Constraints

Texture and motion are the two ways this direction could become slow. Budgets:

| Item | Budget |
|---|---|
| LCP | < 2.0s on throttled 4G, p75 |
| CLS | < 0.05 |
| INP | < 200ms |
| Lighthouse | ≥ 90 all four categories |
| JS (gzip, initial) | ≤ 180KB |
| Texture assets, total | ≤ 40KB |
| Hero illustration | ≤ 120KB |
| Per-illustration | ≤ 40KB |
| Fonts | 3 families, variable, subset latin, ≤ 180KB total |
| Concurrent animations | ≤ 6 |

### Rules

1. Illustration is **SVG** where flat, **WebP/AVIF** where soft-dimensional.
   Never PNG above 40KB.
2. Texture is one tiling asset reused, never per-element filters. `backdrop-filter`
   only on the scrolled header.
3. Only `transform` and `opacity` animate. Everything animated gets
   `will-change` on interaction and has it removed after.
4. Ambient loops pause off-screen (`IntersectionObserver`) and on
   `document.hidden`.
5. Canvas motifs are DPR-capped at 2, resize-debounced, and stop when off-screen.
6. Below-fold illustration is lazy-loaded with correct intrinsic dimensions —
   CLS from illustration is a defect.
7. `prefers-reduced-data` / `save-data`: texture off, ambient motion off, static
   illustration.
8. The hero must render meaningfully **without** JavaScript.

---

## 23. Anti-Patterns

Explicitly prohibited. Any of these appearing in a review is a blocking defect.

**Visual**
- Generic dark SaaS aesthetics
- Neon-on-black crypto visuals
- **Thin glowing network lines and node graphs as a primary motif**
- Glassmorphism beyond the single scrolled-header blur
- Stock photography, or any photography
- Generic AI artwork — floating spheres, iridescent blobs, impossible architecture
- Excessive gradients; mesh gradients at all
- **Identical three-column feature-card sections**
- Corporate serif typography dominating the experience
- Bitcoin orange and black as the whole identity
- Dark navy as the dominant brand expression
- Isometric cityscapes, globes, orbit rings, hexagon grids
- Emoji as section markers
- `rounded-lg` applied uniformly with no radius intent

**Copy**
- Dense technical copy above the fold
- Investor language ahead of user curiosity
- Any phrase from §19.3
- Protocol vocabulary before district 5

**Behaviour**
- Scroll hijacking, scroll-driven narrative, cinematic intros
- Parallax beyond 0.2× differential
- Decorative motion that harms comprehension
- Motion that is a prerequisite for understanding
- Auto-rotating carousels
- Hover-only information

**Brand**
- Copying Buzz's colours, mascot, layout or assets in any form
- Turning the product into something childish
- Characters near forms, payments, legal copy or identity
- Communities altering layout, type or component behaviour
- More than one saturated full-bleed field per viewport

---

## 24. Implementation Priorities

### What carries over from the current build

**Keep — architecture, not appearance:**
- Token architecture: raw values on `:root` and theme selectors, mapped through
  `@theme inline`; components never read raw values.
- The **CSS ↔ TypeScript token sync test**. It has already caught real drift and
  is the only thing preventing a failing pair from shipping.
- The **contrast test**, asserting worst-case across all grounds.
- The **three-token community model** — now generalised: on-fill text is chosen
  per community by measurement (§8.4).
- The reveal architecture: content visible by default, `html.js` set before first
  paint, `IntersectionObserver` **plus** bounding-box sweep.
- The typed twelve-event analytics catalogue and its no-PII guard.
- All copy in `src/content/` as typed constants.
- Section, Container, and the server-component reveal wrapper.

**Retune:** every colour value; every community accent; the `Button` variants;
card shapes and radii.

**Delete:** `PlazaField` (the thin-line canvas — the exact prohibited motif);
Marcellus and the serif display scale; the Blue Hour palette; the current hero
composition; the hairline-grid section pattern used in five places.

### Phase 1 — Establish the identity

1. Palette: all tokens, both modes, contrast tests green before anything renders.
2. Typography: three families self-hosted, full scale, manual-break content model.
3. Logo: arch symbol delivered at 16/32/64/512, wordmark lockups.
4. Buttons: primary, secondary, tertiary, all states, print-offset shadow.
5. Cards: base card, radius system, layered warm shadows.
6. Texture: grain tile, halftone ramp, misregistration utility.
7. Homepage hero: colonnade, headline, actions, static first — no motion yet.

**Exit gate:** the hero, as a still frame with JS disabled, is unmistakably
Bitplaza and passes AA.

### Phase 2 — Build the world

1. Plaza metaphor: colonnade system, arch masks, layering model.
2. Illustration kit: the eight required concept illustrations (§12.2).
3. Community portals with the three status states.
4. Regulars: base silhouettes, artifact library, community recolouring.
5. Motion: ambient drift, gathering, cursor proximity, portal transition,
   reduced-motion parity.
6. Interactive districts: the district-2 convergence and the district-3 field.

**Exit gate:** full keyboard traversal, zero axe violations, reduced-motion pass
identical in comprehension.

### Phase 3 — Extend into product

Profiles · community pages · discovery · events · opportunities · commerce ·
reputation · agent interactions. Every new surface reuses Phase 1–2 components;
a new one-off component is a design bug until proven otherwise.

### Phase 4 — Community customisation

1. Community colour themes within the three-token model, contrast-validated on
   submission — a community cannot ship a failing accent.
2. Custom plaza artifacts (max 3 per community), reviewed.
3. Community symbols inside the arch frame.
4. Controlled variation: colour, artifacts, Regular selection. **Never** layout,
   type, or component behaviour.
5. User expression: profile artifacts, badge arrangement.

---

## 25. Final Design Review Checklist

Run before any surface ships.

**Identity**
- [ ] Recognisably Bitplaza in four seconds, with the logo removed
- [ ] The arch appears and carries meaning
- [ ] Apricot is present but not spread — roughly one weighted use per viewport
- [ ] No competitor could ship this with a logo swap

**World**
- [ ] Feels inhabited; activity implied beyond the viewport
- [ ] At least one element breaks the container per district
- [ ] Adjacent districts differ in at least two of: ground, axis, density, scale
- [ ] Communities are shown, not described

**Colour**
- [ ] Every pair measured; worst case across all three grounds recorded
- [ ] No white text on apricot, anywhere
- [ ] No state communicated by colour alone
- [ ] One saturated full-bleed field per viewport, maximum

**Type**
- [ ] Display headlines manually broken
- [ ] Nothing below 13px
- [ ] Measure between 60 and 70 characters for running text
- [ ] Two expressive typographic moments per page, at most

**Motion**
- [ ] Complete and beautiful as a still frame
- [ ] Reduced motion is a hard stop and loses no information
- [ ] Nothing blocks comprehension for over 400ms
- [ ] Only transform and opacity animate

**Copy**
- [ ] Hero support is one sentence
- [ ] No banned phrase from §19.3
- [ ] No protocol vocabulary before district 5
- [ ] A non-technical reader hits no word they must look up

**Accessibility**
- [ ] axe-core clean at three breakpoints
- [ ] Full keyboard traversal
- [ ] Focus visible over every ground and over illustration
- [ ] 44px targets throughout
- [ ] Complete and readable with JavaScript disabled
- [ ] Agents labelled in text, never by shape alone

**Performance**
- [ ] Lighthouse ≥ 90 across all four
- [ ] Within every budget in §22
- [ ] No CLS from illustration
- [ ] Ambient motion pauses off-screen and on hidden tabs

**The final question**

> Does this make someone think *"I don't fully know what this is yet, but I want
> to enter"*?

If the honest answer is "it looks professional", the work is not finished.
