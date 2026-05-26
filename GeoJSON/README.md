# GeoJSON/

Country-level administrative boundary files used for subnational maps in the
FASTR platform and analyses.

```
GeoJSON/
├── afghanistan_backbone.geojson
├── bangladesh1_backbone.geojson
├── bangladesh2_backbone.geojson
├── burkinafaso_backbone.geojson
└── …                                  # one or more per country
```

Each `*_backbone.geojson` is a simplified admin polygon set (usually admin-1)
used to render the map layer behind FASTR's geographic visualisations. The
"backbone" naming distinguishes these stable boundaries from analysis-specific
overlays.

These files are consumed by the platform code
([`FASTR-Analytics/platform`](https://github.com/FASTR-Analytics/platform)) and
by ad-hoc analyses; they are **not** referenced by slide or handout content.

When adding a country, match the existing naming (`<country>_backbone.geojson`,
lowercase, no spaces) and keep file sizes reasonable — simplify with
`mapshaper` if the source admin file is large.
