# Shared Assets

Images and assets used across workshop decks.

## Folder Structure

```
assets/
  logos/          ← FASTR logo, WHO logo, partner logos
  diagrams/       ← Methodology flowcharts, data flow diagrams
  screenshots/    ← DHIS2 screenshots, platform UI
  fastr-outputs/  ← Default FASTR visualizations (coverage charts, DQ heatmaps, etc.)
```

## Usage in Slides

From a workshop folder (workshops/*/):
```markdown
![FASTR Logo](../../assets/logos/fastr_logo.png)
![FASTR Approach](../../assets/diagrams/FASTR_rapid_cycle_analytics_approach.svg)
![HMIS Screenshot](../../assets/screenshots/hmis-csv-required-fields.png)
```

From core_content/ or templates/:
```markdown
![FASTR Approach](../assets/diagrams/FASTR_rapid_cycle_analytics_approach.svg)
![HMIS Screenshot](../assets/screenshots/hmis-csv-required-fields.png)
```

Note: Currently available assets:
- diagrams/FASTR_rapid_cycle_analytics_approach.svg
- screenshots/hmis-csv-required-fields.png
