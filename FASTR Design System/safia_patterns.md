# Safia-pattern design tokens

Reusable layout patterns extracted from the Dakar workshop deck (April 2026, Day 3 sessions presented by Safia Jiwani). Implemented as CSS classes in:

- `fastr-theme.css` — for slides (Marp / `core_content/`)
- `fastr-handout.css` — for handouts (Marp / `handouts/`)

## When to reach for each pattern

| Pattern | CSS | Use when |
|---------|-----|----------|
| Eyebrow tag | `.eyebrow` | Category label above a title. Letter-spaced caps with a short left-border accent. |
| Data-source pill | `.data-pill` + `.data-pill-{navy\|deep-green\|green\|gold}` | Citing a data source (DHIS2, surveys, HFA, …) at the bottom of a card. |
| Callout footer | `.callout-footer` | "Key takeaway" sentence at the bottom of a slide. Light-green strip with deep-green left border. |
| Results chain (4-col) | `.results-chain` + `.rc-col` + `.rc-{navy\|deep-green\|green\|gold}` | INPUT → OUTPUT → OUTCOME → IMPACT flow. Colors progress navy → deep-green → green → gold. |
| Triangulation row | `.data-pills.triangulation` | 3 source badges in a row under an indicator name. |

## Color progression (results chain)

The 4-column results chain uses brand colors in a deliberate progression that maps to data-source hierarchy:

| Column | Brand color | CSS var | Meaning |
|--------|-------------|---------|---------|
| **ENTRÉE** | navy | `--fastr-navy` (#21568C) | New / supplementary data source (e.g., HFA phone surveys) |
| **SORTIE** | deep green | `--fastr-deep-green` (#09544F) | Routine HMIS / DHIS2 output |
| **RÉSULTAT** | green | `--fastr-green` (#1F9A9C) | Combined DHIS2 + population data → coverage |
| **IMPACT** | gold | `--fastr-gold` (#D8A822) | Multi-source triangulation → impact indicator |

The same 4-pill color set works for triangulation rows — the gold pill always represents the multi-source/impact source.

## Markdown usage examples

### Results chain (slide)

```markdown
## La chaîne complète des résultats

*L'ajout des données d'enquêtes FOSA nous permet de répondre au « pourquoi ».*

<div class="eyebrow">INTÉGRATION DES DONNÉES D'ÉTABLISSEMENTS DE SANTÉ</div>

<div class="results-chain">
  <div class="rc-col rc-navy">
    <div class="rc-eyebrow">ENTRÉE</div>
    <h3 class="rc-title">Capacité opérationnelle SONUB</h3>
    <p class="rc-desc">Médicaments, personnel qualifié, équipement</p>
    <span class="data-pill data-pill-navy">Enquête téléphonique rapide (trimestrielle)</span>
  </div>
  <div class="rc-arrow">→</div>
  <div class="rc-col rc-deep-green">
    <div class="rc-eyebrow">SORTIE</div>
    <h3 class="rc-title">Nombre d'accouchements en établissement</h3>
    <p class="rc-desc">Analyse de l'utilisation des services</p>
    <span class="data-pill data-pill-deep-green">DHIS2 (trimestriel)</span>
  </div>
  <div class="rc-arrow">→</div>
  <div class="rc-col rc-green">
    <div class="rc-eyebrow">RÉSULTAT</div>
    <h3 class="rc-title">Couverture des accouchements institutionnels</h3>
    <p class="rc-desc">Estimation de couverture</p>
    <span class="data-pill data-pill-green">DHIS2 + Enquêtes ménages (EDS)</span>
  </div>
  <div class="rc-arrow">→</div>
  <div class="rc-col rc-gold">
    <div class="rc-eyebrow">IMPACT</div>
    <h3 class="rc-title">Mortalité maternelle institutionnelle</h3>
    <p class="rc-desc">Triangulation multi-sources</p>
    <span class="data-pill data-pill-gold">MPDSR · DHIS2 · EDS</span>
  </div>
</div>

<div class="callout-footer">Les formations sanitaires sont-elles « prêtes » à fournir des soins SONUB de qualité ?</div>
```

### Triangulation (slide)

```markdown
## Mortalité maternelle

Pour répondre à cette question, les données du SNIS et des FOSA doivent être triangulées avec d'autres sources.

<div class="eyebrow">INDICATEUR D'IMPACT</div>

### Mortalité maternelle institutionnelle

<div class="eyebrow">SOURCES DE TRIANGULATION</div>

<div class="data-pills triangulation">
  <span class="data-pill data-pill-deep-green">SRDMP (surveillance)</span>
  <span class="data-pill data-pill-green">DHIS2</span>
  <span class="data-pill data-pill-gold">Enquêtes ménages (EDS ou autre)</span>
</div>

<div class="callout-footer">On ne peut pas agir pour réduire la mortalité maternelle sans comprendre ce qui se passe au sein des formations sanitaires.</div>
```

### Eyebrow + callout (any context)

```markdown
<div class="eyebrow">ANALYSE TRIMESTRIELLE</div>

## Couverture des accouchements institutionnels

…content…

<div class="callout-footer">Key takeaway sentence here.</div>
```

## Patterns NOT yet captured

These appeared in Safia's slides but are deferred — they need either dedicated SVG artwork or denser layout work:

- **Numbered process flow with arrow icon** (slide 195) — two numbered circles flanking a centered arrow icon. Implement as an SVG diagram per-module rather than a generic CSS class.
- **Country map with status legend** (slide 187) — needs the actual world map artwork.
- **Question + concrete example stack** (slide 220) — six numbered items each with "Par exemple:" example below. Currently approximated with the existing `<ol>` / nested italics; consider a dedicated class if it spreads.
- **Fully-worked roadmap table** (slide 223) — extremely dense 10-column table. Stylable with existing `section.dense-table` but the content density is the harder problem.

## Source

All patterns extracted from the Dakar workshop deck (`data_received/Master Slide Deck Dakar (1).pptx`), last modified 2026-04-30. Sessions 5, 6, 7 (Day 3) presented by Dr Safia Jiwani, GFF.
