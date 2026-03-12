---
marp: true
theme: fastr
paginate: true
---

## Understanding the prompt: what does it do?

The prompt is a set of detailed instructions that tells the AI Assistant how to build a disruption report, step by step. Here is what it asks the AI to do:

1. **Ask you for basic information** — your country, the analysis time period, and a subtitle for the report
2. **Look up available indicators** — the AI identifies which health indicators are available in the platform for your country
3. **Group indicators into categories** — e.g. immunization, antenatal care, deliveries, malaria — and ask you to confirm
4. **Build the report slide by slide** — cover page, methodology, then one analysis slide per indicator group, each with a chart and written interpretation

**What the prompt handles behind the scenes:** Defines the report structure, slide layout, and visual formatting. Includes standardized content (methodology, interpretation guidance) that remains consistent across countries. Establishes quality standards for analytical language and data accuracy. Country-specific elements — indicators, time periods, and findings — are populated from the platform.
