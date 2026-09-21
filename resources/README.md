# resources/

Shared static assets — images, diagrams, icons, logos, backgrounds — used by
slides, handouts, and the web app.

## What this is

The asset library for FASTR content. Anything visual that ships in a deck, a
handout, or the docs site is sourced from here. Diagrams have separate language
trees so EN / FR / PT can be visually localised.

## Layout

```
resources/
├── backgrounds/       # cover + section-cover background images (PNG)
├── checklists/        # printable reference checklists
├── default_outputs/   # sample/placeholder chart outputs used when no live data exists
├── diagrams/          # brand diagrams (EN)  — SVG, FASTR colors, Inter font
├── diagrams_fr/       # brand diagrams (FR mirror)
├── diagrams_pt/       # brand diagrams (PT mirror)
├── icons/             # 9 on-brand deep-green SVG icons (hands_on, demo, thought, …)
├── logos/             # FASTR + GFF + World Bank logos
├── screenshots/       # platform screenshots used in handouts and slide decks
└── Report_Instructions_File.{docx,md,pdf} + _FR.{docx,md,pdf}  # standalone reference doc
```

## How to add/edit

- **Diagrams** — always create EN + FR (+ PT if covered). Use the FASTR brand
  palette and Inter font. See [FASTR Design System](../FASTR%20Design%20System/README.md)
  for tokens.
- **Icons** — the deep-green SVG line set is the canonical look. Don't add
  off-brand clip-art (PNG icons were cleaned up in commit `ef9dde3`).
- **Logos** — keep the official files; don't recolor or crop in place.
- **Screenshots** — see the [Screenshots](#screenshots) section below.
- **Reference from slides**: `![alt](../../resources/<dir>/<file>)` from
  `core_content/<module>/`. Reference from handouts:
  `![alt](../resources/<dir>/<file>)`. From templates: `../../resources/…`.
  Paths are relative to the markdown file's directory.

## Screenshots

One folder per feature and language. File names are stable: a recapture
overwrites the file in place so every handout that embeds it picks up the new
screen without an edit. Record the platform version in the commit message.

| Folder | What it shows | Captured | Used by |
|--------|---------------|----------|---------|
| `m9a_setup/` | EN instance setup: facilities (16–17), Data page, HMIS data + Ledger tab, Imports (Current / Future / History), 4-step import wizard, DHIS2 connection dialog, results packages page + 3-step wizard, project results-package tab | v1.75, Sept 2026, demo instance | `handouts/*/m9a/` admin_areas, import_data, verify_explore; `handouts/en/custom/h_custom_import_dhis2_maj.md` |
| `dhis2_import_v2/` | FR mirror of the import + results-package flow | v1.75, Sept 2026, demo (modules step from the Chad instance, whose module names are in French) | `handouts/fr/custom/` import, ajouter_indicateurs, indicateurs_dhis2 |
| `indicators_v2_en/` | EN indicator list, Add from DHIS2 search, naming step, check | v1.75, Sept 2026, demo | `handouts/{en,pt}/m9a/h_m9a_indicators.md` |
| `indicateurs_v2/` | FR indicator manager incl. Créer → Calculé | v1.75, Sept 2026, mostly Chad instance | `handouts/fr/m9a/h_m9a_indicators.md`, `handouts/fr/custom/` ajouter_indicateurs, indicateurs_dhis2 |
| `scorecard_en/` | Nigeria scorecard handout | Jul 2026; **01–05 show the retired three-tab indicator manager and the credentials wizard step** — recapture when that handout is rewritten | `handouts/en/custom/h_custom_scorecard_indicators.md` |
| `m9b/`, `m9c/`, `m9d/` | Login + user folder; visualizations; slides + reports | Jul–Aug 2026, not re-checked in the Sept 2026 audit | `handouts/*/m9b`, `m9c`, `m9d` |
| `m7/` | Finding statement example | 2026 | `handouts/*/m7d/` |
| `platform/`, `platform_en/`, `platform_fr/` | Platform overview shots | 2025–2026 | methodology ch. 2–3 slides; `decks/*/plaidoyer_plateforme_fastr.md` |
| `country_examples/`, `data_downloader/` | Country dashboards; DHIS2 data downloader | 2025 | methodology ch. 1–2 slides |
| `approche_fastr/` | Images extracted from the "Approche FASTR" PPTX, not platform screens | — | `decks/build_*.py` |

Loose files at the folder root predate the per-feature folders; grep for a
file name before touching it.

**Capturing.** Sign in to the demo instance (never a country instance without
the owner's OK, and nothing saved or launched there). For French screens switch
the language from the instance home page; the project page has no language
button. Keep the browser width the previous capture used so the image scale in
the handout still fits. After a recapture, re-render the PDFs
(`tools/render_handout.sh`) and check for overflow.

**Retiring.** When the platform drops a screen, fix the handout text first,
then delete the file once nothing references it:

```bash
grep -rl --include='*.md' --include='*.py' <file name> handouts core_content* methodology decks
```

Sept 2026 removals: the old five-step indicator manager (`m9a_setup/01–15`,
`dhis2_indicators/`), the import wizard's Credentials step, the Imports page's
By-indicator tab, the project "Update data" button.

## Gotchas

- Marp + PPTX both load these. SVG renders in Marp and embeds in PPTX, but only
  if the PNG fallback isn't expected — always use the actual extension.
- The site repo ([`FASTR-Analytics/site`](https://github.com/FASTR-Analytics/site))
  has **its own** asset tree under `FASTR Design System/assets/icons/`. The two
  are independent; don't link cross-repo.
- White transparent logos on dark backgrounds will look invisible unless the
  base theme's `img` background is `transparent` (it is — see `fastr-theme.css`).
- Don't delete a file referenced by `outputs/`, the site, or a handout without
  checking — generated artifacts there hold real paths.


## GFF logo (2026 refresh)

`logos/GFF_Logo_trimmed.png` and `logos/GFF_Logo_Horizontal_White_En.png` now carry the 2026 GFF + World Bank lockup (white). Full-color lockups (`GFF_WBG_Color_{En,Fr,Es,Pt}.png`), the stacked lockup and the standalone GFF logo were added alongside. The previous artwork is in `logos/legacy_2025/`. Per the GFF guidelines, request official logo files from the GFF Comms team before external use.
