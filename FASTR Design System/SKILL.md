---
name: fastr-design
description: Use this skill to generate well-branded interfaces and assets for FASTR (Frequent Assessments and Systems Tools for Resilience), a GFF / World Bank initiative producing workshop decks, methodology documentation, and a deck-builder web app. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping decks and product surfaces.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files (`colors_and_type.css`, `assets/`, `slides/`, `ui_kits/web/`, `preview/`).

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out of `assets/` and create static HTML files for the user to view. For decks, start from a template in `slides/` and swap in content — keep Poppins, the deep-green / lime palette, and the lime-rule-under-H1 motif. For web/product UI, start from `ui_kits/web/` — use Inter, the navy/teal palette, 16px-radius cards with a 1px slate border + thin ring.

If working on production code (e.g. extending the upstream `FASTR-Analytics/fastr-resource-hub` repo), copy assets and read the rules in `README.md` to become an expert in designing with this brand — pay attention to the **content fundamentals** section, especially sentence-case headings, the no-emoji rule, and the "Step / Part" labelling convention.

If the user invokes this skill without any other guidance, ask them what they want to build or design — a deck, a website mock, a one-off graphic — ask whether it's a workshop deck (Poppins palette) or a product surface (Inter palette), and act as an expert designer who outputs HTML artifacts *or* production code, depending on the need.
