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
- **Screenshots** — capture at native resolution; name by feature (e.g.
  `dqa-dashboard.png`); avoid timestamps.
- **Reference from slides**: `![alt](../../resources/<dir>/<file>)` from
  `core_content/<module>/`. Reference from handouts:
  `![alt](../resources/<dir>/<file>)`. From templates: `../../resources/…`.
  Paths are relative to the markdown file's directory.

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
