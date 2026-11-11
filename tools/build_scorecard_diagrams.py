#!/usr/bin/env python3
"""Two small diagrams for handouts/en/custom/h_custom_scorecard_indicators.md.

  resources/diagrams/scorecard_indicator_chain.svg   data element -> calculated indicator -> package -> cell
  resources/diagrams/scorecard_warehouse_shelf.svg   instance (indicators, data) -> results package -> project

Wording follows the platform v2 model (one indicator list, formula indicators,
Indicator values module, results packages). Edit here, not the SVGs.
Usage: python3 tools/build_scorecard_diagrams.py
"""
import pathlib

OUT = pathlib.Path(__file__).resolve().parent.parent / 'resources' / 'diagrams'
DG, G, LG, TINT = '#0A544F', '#0C716B', '#1FA29C', '#E8F4F3'
NAVY, PLUM = '#21568C', '#501E50'
INK, MUTED = '#1F2A2E', '#5B6B70'
GREEN, YELLOW, RED = '#2E9E5B', '#E8B400', '#C53030'
FONT = "font-family=\"Inter, -apple-system, 'Segoe UI', Roboto, sans-serif\""


def t(x, y, s, size=11, fill=INK, anchor='middle', weight=400):
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-size="{size}" font-weight="{weight}" fill="{fill}">{s}</text>'


def box(x, y, w, h, col, head, line1, line2='', sub=''):
    o = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="#FFFFFF" stroke="{col}" stroke-width="2"/>'
    o += f'<rect x="{x}" y="{y}" width="{w}" height="24" rx="8" fill="{col}"/><rect x="{x}" y="{y+14}" width="{w}" height="10" fill="{col}"/>'
    o += t(x + w / 2, y + 16, head, 11, '#FFFFFF', weight=700)
    o += t(x + w / 2, y + 46, line1, 12, INK, weight=600)
    if line2: o += t(x + w / 2, y + 62, line2, 10.5, INK)
    if sub: o += t(x + w / 2, y + h - 8, sub, 9.5, MUTED)
    return o


def arrow(x1, y1, x2, y2, col=DG):
    return (f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{col}" stroke-width="2"/>'
            f'<polyline points="{x2-9},{y2-5} {x2},{y2} {x2-9},{y2+5}" fill="none" stroke="{col}" stroke-width="2"/>')


# ── 1. indicator chain ─────────────────────────────────────────────────────
b = box(10, 20, 150, 100, NAVY, 'DATA ELEMENT', 'anc1', 'copied from DHIS2', 'step 1–2')
b += arrow(165, 70, 195, 70)
b += box(200, 20, 200, 100, PLUM, 'CALCULATED INDICATOR', 'anc1_coverage', 'anc1 / (population_total × 0.05)', 'step 3 · the formula and its rule')
b += arrow(405, 70, 435, 70)
b += box(440, 20, 150, 100, DG, 'RESULTS PACKAGE', 'Indicator values', 'evaluates every formula', 'step 4')
b += arrow(595, 70, 625, 70)
# scorecard cell
b += f'<rect x="630" y="20" width="120" height="100" rx="8" fill="#FFFFFF" stroke="{G}" stroke-width="2"/>'
b += f'<rect x="630" y="20" width="120" height="24" rx="8" fill="{G}"/><rect x="630" y="34" width="120" height="10" fill="{G}"/>'
b += t(690, 36, 'SCORECARD', 11, '#FFFFFF', weight=700)
for i, (lab, v, col) in enumerate((('Kano', '84 %', GREEN), ('Lagos', '73 %', YELLOW), ('Yobe', '65 %', RED))):
    y = 50 + i * 18
    b += f'<rect x="640" y="{y}" width="100" height="15" rx="3" fill="{col}" opacity="0.85"/>'
    b += t(648, y + 11, lab, 9.5, '#FFFFFF', anchor='start', weight=600) + t(732, y + 11, v, 9.5, '#FFFFFF', anchor='end', weight=700)
b += t(690, 112, 'step 5 · one colored cell per state', 9.5, MUTED)
b += t(380, 142, 'The rule (format, direction, cutoffs) lives on the calculated indicator. Every scorecard that shows it colors it the same way.', 10, MUTED)
(OUT / 'scorecard_indicator_chain.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 150" {FONT}>{b}</svg>')

# ── 2. instance -> package -> project ─────────────────────────────────────
b = f'<rect x="10" y="12" width="300" height="150" rx="10" fill="{TINT}" stroke="{DG}" stroke-width="1.5"/>'
b += t(160, 32, 'THE INSTANCE', 12, DG, weight=700) + t(160, 46, 'shared by everyone', 9.5, MUTED)
b += f'<rect x="25" y="58" width="130" height="88" rx="6" fill="#FFFFFF" stroke="{PLUM}" stroke-width="1.5"/>'
b += t(90, 76, 'Indicators', 11, PLUM, weight=700) + t(90, 92, 'data elements, sums,', 9.5, INK) + t(90, 104, 'formulas and their rules', 9.5, INK) + t(90, 124, 'steps 1 and 3', 9.5, MUTED)
b += f'<rect x="165" y="58" width="130" height="88" rx="6" fill="#FFFFFF" stroke="{NAVY}" stroke-width="1.5"/>'
b += t(230, 76, 'Data', 11, NAVY, weight=700) + t(230, 92, 'monthly counts copied', 9.5, INK) + t(230, 104, 'from DHIS2', 9.5, INK) + t(230, 124, 'step 2', 9.5, MUTED)
b += arrow(315, 87, 355, 87)
b += t(335, 76, 'generate', 9, MUTED)
b += f'<rect x="360" y="40" width="150" height="94" rx="10" fill="#FFFFFF" stroke="{DG}" stroke-width="2"/>'
b += t(435, 60, 'RESULTS PACKAGE', 11, DG, weight=700) + t(435, 78, 'a frozen copy of the data', 9.5, INK) + t(435, 90, 'and the rules at that moment,', 9.5, INK) + t(435, 102, 'with every formula evaluated', 9.5, INK) + t(435, 122, 'step 4', 9.5, MUTED)
b += arrow(515, 87, 555, 87)
b += t(535, 76, 'attach or pin', 9, MUTED)
b += f'<rect x="560" y="12" width="190" height="150" rx="10" fill="#FFFFFF" stroke="{G}" stroke-width="1.5"/>'
b += t(655, 32, 'YOUR PROJECT', 12, G, weight=700) + t(655, 46, 'reads one package', 9.5, MUTED)
b += f'<rect x="575" y="58" width="160" height="88" rx="6" fill="{TINT}" stroke="{G}" stroke-width="1.5"/>'
b += t(655, 76, 'The scorecard table', 11, G, weight=700) + t(655, 92, 'shows the package it is on;', 9.5, INK) + t(655, 104, 'new columns and new colors', 9.5, INK) + t(655, 116, 'arrive with the next package', 9.5, INK) + t(655, 136, 'step 5', 9.5, MUTED)
b += t(380, 180, 'A project left on an old package keeps showing old numbers. Pin the package and let projects follow it.', 10, MUTED)
(OUT / 'scorecard_warehouse_shelf.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 190" {FONT}>{b}</svg>')
print('wrote 2 svgs')
