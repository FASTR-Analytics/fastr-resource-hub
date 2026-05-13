# FASTR Design System

Brand and product design system for the **FASTR Initiative** — *Frequent Assessments and Systems Tools for Resilience* — a program of the **Global Financing Facility for Women, Children and Adolescents (GFF)** at the World Bank.

FASTR produces decks, methodology documentation, and a deck-builder web app for workshops that teach health analysts in low- and middle-income countries how to monitor RMNCAH-N (Reproductive, Maternal, Newborn, Child, Adolescent Health, and Nutrition) service use through rapid-cycle analytics on routine HMIS / DHIS2 data.

This system serves two surfaces:

| Surface | Where it lives | Typeface | Primary palette |
|---|---|---|---|
| **Workshop decks** (Marp → PDF/PPTX) | `slides/`, `fastr-theme.css` upstream | Poppins | Deep green `#09544F` + lime `#D0CB17` |
| **Deck Builder web app** | `ui_kits/web/` | Inter | Navy `#1B365D` + teal `#00A9CE` + orange `#F7941D` |

Both palettes are tokenized in `colors_and_type.css`.

---

## Sources

Everything in this system was derived from materials the user provided:

- **GitHub repository** — `FASTR-Analytics/fastr-resource-hub` (private; the org is at https://github.com/FASTR-Analytics)
  - `fastr-theme.css`, `fastr-clean.css`, `fastr-bold.css` — Marp deck themes (source of truth for slide colors / type)
  - `templates/*.md` — Marp slide templates (title, section divider, agenda, welcome, …)
  - `methodology/*.md` — long-form documentation; canonical style guide at `help and instructions/07_style_guide.md`
  - `resources/logos`, `resources/icons`, `resources/backgrounds`, `resources/diagrams` — the brand asset library
  - `web-app/client/` — React + Vite + Tailwind Deck Builder
  - `web-app/client/tailwind.config.js` — source of truth for web-app palette
- **Uploaded logos** — `FASTR_Primary_01_FullName.png`, `FASTR_White_FullName.png`, `FASTR_White_Horiz.png`, `GFF_Logo_Horizontal_White_En.png`, `GFF_Logo_trimmed.png`
- **Uploaded background reference** — `ppt design.jpg` (the official cover-slide pattern: solid teal with offset concentric arc / quarter-circle pattern in the bottom-right)
- **Brand context** — https://data.gffportal.org/key-theme/FASTR

---

## Repository index

| File / folder | What it is |
|---|---|
| `README.md` | This file — start here |
| `SKILL.md` | Agent-skill front matter; makes this folder Claude-Code-compatible |
| `colors_and_type.css` | All design tokens (colors, type scale, spacing, radii, shadows) for both surfaces |
| `assets/logos/` | FASTR + GFF logos (primary, white, horizontal). Use the white variants on deep-green backgrounds. |
| `assets/backgrounds/` | `cover_slide.png` (rich), `cover_slide_clean.png` (flat with arc pattern), `section_slide.png` — drop-in slide backgrounds. |
| `assets/icons/` | Workshop activity icons (lecture, hands-on, demo, debrief, sticky notes, coffee, lunch, …) as PNG + a few SVG. |
| `fonts/` | (Loaded from Google Fonts CDN — see `colors_and_type.css`. No local TTFs.) |
| `preview/` | Small HTML cards rendered into the Design System tab. |
| `slides/` | Sample slide templates (title, section divider, content, agenda, two-column, output, dark-section, quote, closing) — drop-in HTML 1280×720. |
| `ui_kits/web/` | Recreation of the Deck Builder web app — content library, deck preview, workshop builder. |

---

## Content fundamentals

FASTR copy is **dry, instructive, and technical** — written for public-health analysts, ministry of health staff, and researchers in workshop and methodology settings. It is never marketing-flavored.

**Casing.** Sentence case for everything — headings, bold labels, table headers. The only exceptions are proper nouns and brand acronyms which are *always* fully capitalized: `FASTR`, `DHIS2`, `HMIS`, `RMNCAH-N`, `GFF`, `DQA`.

| Right | Wrong |
|---|---|
| Why focus on high volume indicators? | Why Focus on High Volume Indicators? |
| Data quality assessment | Data Quality Assessment |
| **Step 1: Load and prepare data** | **Step 1: Load and Prepare Data** |

**Voice.** Mostly **second-person and imperative** to the workshop participant ("you", "load the file", "review the output"). Methodology pages drift more impersonal ("the module reads facility-level data…"). Almost never first-person "we", and never first-person singular.

**Tone.** Confident, plain, and concrete. Prefers "what you see vs what it means" over editorial framing. Headings are often phrased as questions ("Why monthly facility level data?", "Is my question a relevant priority?"). Bold is used surgically — for **key terms on first introduction**, **labels** before descriptions (e.g. `**Inputs**:`), and step/part markers.

**Bullets.** No periods on single-line items. Periods only when the bullet contains more than one sentence. Lists are common; long paragraphs are rare.

**Vocabulary.** Use "Step" or "Part", never "Stage". Always define an abbreviation on first use, then use the abbreviation. Filenames, variables, parameters in `inline code`.

**Vibe.** Workshop facilitator who respects the audience: "here is the data, here are the trade-offs, here is what we recommend, your call." Never patronizing, never breathless. Plays well with French translation — every English page has a French sibling in `core_content_fr/`.

**Emoji.** Not used in long-form content. Rarely a checkmark or arrow appears inline in tooling UI, but the deck theme and methodology pages have none. **Do not add emoji to slides or docs.**

**Examples** (verbatim phrasing patterns from the repo):

> Use sentence case for all headings.
> **Inputs**
> - Raw HMIS data (`hmis_ISO3.csv`)
> - Geographic identifiers
> **Purpose**: Loads and prepares data for analysis.
> **Note:** This content was hidden in the original presentation but may be useful to include.

---

## Visual foundations

**Colors.** The brand is unmistakably green. Two greens carry every primary surface — deep green `#09544F` for type and dark surfaces, dark green `#0C716B` for the cover slide. A brighter teal `#1F9A9C` is the bridge to lighter UI. Lime `#D0CB17` is the spark — used *only* in thin doses (the underline rule under H1, list markers, the third chevron in the logo, an underline behind a title-slide H1). Blue `#21568C` / `#1A90C0` and a light cyan `#CAE6E9` cover info/links and tinted panels. Gold, coral, purple, and orchid exist as themed accent variants per slide class — they're never mixed together; you pick one accent per section.

**Typography.** **Poppins** is the brand typeface for everything presentation-facing — 400/500/600/700. Set tight: body 21px / 1.4. H1 in 700 with a 4px lime underline. H2 600 with a 4px green left rail. H3 in purple with an orchid left rail. The web app deliberately switches to **Inter** for product UI density. No serifs anywhere.

**Spacing.** Decks pad 40–60px vertical / 70–100px horizontal. Web app uses a standard 4-pt scale. List items breathe at 0.4–0.5em. Headings get generous space *above* and tight space below them.

**Backgrounds.** This is where the brand asserts itself. Cover slides use a **solid dark-teal field with an offset pattern of concentric quarter-arcs in the bottom-right corner** (see `assets/backgrounds/cover_slide_clean.png` and the user-uploaded `ppt design.jpg`). The pattern is geometric — never hand-drawn — and lives in the lower-right ~30% of the frame, leaving the upper-left clean for type. Section-divider slides use a similar treatment. No photography for backgrounds; no gradients in the clean variant; the rich `cover_slide.png` allows a subtle diagonal linear gradient from deep green → dark green. **Never full-bleed photos.** **No hand-drawn illustrations.**

**Animation.** Decks are static — Marp output. The web app uses calm Tailwind transitions: 150–200 ms ease for hover/border color shifts, no bouncy springs, no entrance choreography. The vibe is "instrument panel that responds", not "delight".

**Hover states.** Links sprout a 2px bottom border in the matching link color. Buttons darken by ~10–15% on hover (no opacity tricks). Web-app cards: a faint ring darkens on hover. Nothing zooms, nothing tilts.

**Press states.** Buttons drop one shade; no scale animation. Form inputs gain a 2px focus ring in `--fastr-blue`.

**Borders.** Thin — `1px solid #DEE2E6` for ordinary dividers and table cells. The signature gesture is a **4px solid colored rail** — under H1 (lime), to the left of H2 (green), to the left of H3 (orchid), and as the left edge of callout boxes (info/warning/error/success in their themed color). Tables get a 1px outer border + 2px header underline. Cards in the web app: 1px slate-200 border + ring-1 black/5.

**Shadows.** Minimal. Decks use none. Web app uses `shadow-sm` plus a 1px outline-ring on cards — flat-but-grounded, not floaty. No inner shadows anywhere.

**Capsules vs gradients.** Capsules (pills, rounded buttons) — yes, in the web app. Subtle gradient on the rich cover slide — yes. **No gradient buttons, no glassmorphism, no neon, no glow.** The "clean" deck variant strips all gradients to solid fills.

**Layout.** Decks are 1280×720. Common deck classes: `.title-cover`, `.section-cover`, `.lead`, `.bg-green`, `.bg-navy`, `.bg-purple` (full-bleed dark with white text), `.columns` (1:1), `.columns-text-left` (3:2), `.columns-image-right` (2:3), `.columns-3` (1:1:1), `.output` (chart 60% / interpretation 40%), `.two-panel`, `.dense-table`, `.compact`, `.spacious`, `.centered`, `.agenda` (fixed-width table). Logos sit in corners: **GFF top-left**, **FASTR bottom-left or bottom-right** on title slides. Slide number bottom-right.

**Transparency & blur.** Used only for tinted panel backgrounds (`rgba(216,168,34,0.15)` etc) — never on text, never as overlays.

**Imagery vibe.** When photos appear, they are **clinic-and-community** documentary stills with no heavy color grade — health workers in real settings. Icons are crisp, single-color or two-color flat illustrations (see the `assets/icons/` set: lecture, hands-on, debrief, etc.). No grain, no warm-tone filters, no b&w treatment.

**Radii.** Decks: 4–8 px on tables, callouts, code blocks. Buttons squareish. Web app cards: **16 px** (`rounded-2xl`). Pills: full-round. No 50% softening on imagery — keep images square.

**Cards.** Web app: white, 16px radius, 1px slate-200 border, ring-1 black/5, `shadow-sm`, 24–32 px internal padding. Decks rarely use "card" framing — instead they use the 4px colored left-rail callout to call out an idea.

---

## Iconography

**One stroke family, used everywhere: Lucide.** The web app uses `lucide-react` for UI icons. Slide content uses `lucide-static` SVGs in FASTR deep-green `#09544F` at stroke-width 2.4 (the same look, just rendered into Marp). The diagram builder uses a curated subset of ~30 Lucide icons across five categories (Data, Health, Communication, Actions, People).

This replaces an earlier mix of PNGs and SVGs (some duplicated, inconsistent stroke weights) and an emoji-based icon picker. The current set in `assets/icons/`:

- **Workshop slide icons (SVG)** — `lecture.svg`, `communication.svg`, `thought.svg`, `pinned-notes.svg`, `raise-hand.svg`, `hands_on.svg`, `demo.svg`, `hospital_clinic.svg`, `lecturer.svg`, `people_group.svg`, `sticky_notes.svg` — Lucide-style line icons, 24×24 viewBox, FASTR-green stroke. Drop into Marp at ~120 px tall.
- **Legacy PNG icons** — still present for `coffee`, `lunch`, `debrief`, `email`, `globe`, `post-it`, `sticky-note`. Migrate to SVG when slides need them; do not add new PNGs.

For **product UI** (Deck Builder web app), use `lucide-react` directly — stroke icons at 16/20/24 px, `stroke-width: 1.5–2.4`. For **slide assets** referenced in `templates/*.md` or `core_content/`, use the SVGs from `resources/icons/` (FASTR-green stroke). For **diagram content** generated by the Diagram Builder, the picker stores a Lucide id (e.g. `chart-bar`) and the server resolves it to inline SVG via `lucide-static`.

When mocking the web app statically, link Lucide from a CDN:

```html
<script type="module">
  // Static mockups: https://unpkg.com/lucide-static@latest/icons/<name>.svg
  // React mockups:  https://esm.sh/lucide-react
</script>
```

**Emoji** — not in decks, not in methodology, not in the web app, not in diagram content. Avoid.

**Unicode pictograms** — avoid. The chevron motif `»` you see in the logo is a *typographic logo element*, not a textual character — never substitute `»` for it.

**Substitution flags.** Lucide is the canonical source. If the design needs a workshop-style illustration that isn't in Lucide (e.g. the bespoke `hospital_clinic.svg`), keep it Lucide-styled (24×24 viewBox, fill="none", stroke `#09544F`, stroke-width 2.4, round caps + joins) so it sits alongside the rest without visual seam.

---

## Fonts — substitution flag

This system **loads Poppins and Inter from Google Fonts CDN** rather than shipping TTFs. Both are the canonical fonts used by the upstream codebase, so this is not a substitution — but it does mean offline rendering won't have the brand typeface. If you need offline rendering (e.g. air-gapped Marp builds), download Poppins 400/500/600/700 + Inter 400/500/600/700 from Google Fonts and drop the TTFs into a `fonts/` folder, then swap the `@import url(...)` line in `colors_and_type.css` for `@font-face` blocks.

---

## How to use

1. **Slides.** Open `slides/index.html` to browse the sample templates. Copy a `<section>` block, swap in your content, save as a standalone 1280×720 HTML file. Or, if you're working in Marp natively, lift the rules from `fastr-theme.css` upstream.
2. **Web product.** Open `ui_kits/web/index.html` to see the Deck Builder recreation — content library + workshop builder + deck preview. Components are factored into small `.jsx` files alongside.
3. **Anything else.** Pull in `colors_and_type.css`, give your root `class="fastr-deck"` (or `fastr-web`), and the cascade does the rest.

---

## Caveats

- The web app source `App.tsx` is 214 KB — the UI kit recreates the key surfaces (content library, workshop builder, deck preview) at high fidelity but is *not* a 1:1 port of every feature.
- No local TTF fonts shipped (Google Fonts CDN only).
- French / Arabic / Spanish localizations exist in the upstream repo but are not part of this system — extend as needed.
