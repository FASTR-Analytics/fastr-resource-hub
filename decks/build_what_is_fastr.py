#!/usr/bin/env python3
"""Build the short, high-level "What is FASTR?" deck (English, editable PPTX).

Rationale → scope → methodology → next steps, ~12 minutes. Reuses the slide
archetypes and brand helpers of `build_approche_fastr.py`; diagrams come from
`resources/diagrams/` (SVGs are rasterized at build time). Every slide carries
speaker notes — on-slide text stays short, detail lives in the notes.

Usage:  python3 decks/build_what_is_fastr.py
Deps:   pip install python-pptx pillow cairosvg
"""
from __future__ import annotations

import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import cairosvg  # noqa: E402
from pptx import Presentation  # noqa: E402
from pptx.enum.text import PP_ALIGN  # noqa: E402
from pptx.util import Emu, Inches  # noqa: E402

from build_approche_fastr import (  # noqa: E402
    CENTER, CW, DEEP_GREEN, EMU_IN, PLUM, GREEN, INK, INK2, INK3, LEFT, LIME, MID, NAVY,
    RES, SH, STEP_COLORS, SW, TINT, WHITE, RGBColor, _blocks, _fade, _fit, _fullbleed,
    _bg, _new, _para, _rect, _tb, _title, _callout, s_contrast, s_cycle,
    s_numbered, s_statement,
)

REPO = Path(__file__).resolve().parent.parent
DIAG = RES / "diagrams"
SHOTS = RES / "screenshots"
_TMP = Path(tempfile.mkdtemp(prefix="what_is_fastr_"))


def img(rel: str) -> Path:
    """Resolve an asset path; SVGs are rasterized to PNG once per build."""
    p = RES / rel
    if p.suffix.lower() != ".svg":
        return p
    out = _TMP / (p.stem + ".png")
    if not out.exists():
        cairosvg.svg2png(url=str(p), write_to=str(out), output_width=2400)
    return out


# ---- archetypes specific to this deck --------------------------------------
def s_cover(prs, c):
    s = _new(prs)
    _fullbleed(s, RES / "backgrounds" / "cover_slide_clean.png")
    s.shapes.add_picture(str(RES / "logos" / "GFF_Logo_trimmed.png"), Inches(0.8), Inches(0.55), height=Inches(0.42))
    _, tf = _tb(s, 0.8, 2.3, 11.2, 2.6)
    tf.vertical_anchor = MID
    _para(tf, c["title"], size=48, color=WHITE, first=True, bold=True, space=12, line=1.03)
    _para(tf, c["subtitle"], size=18, color=RGBColor(0xEC, 0xF0, 0xEF), space=22, line=1.2)
    _para(tf, c["presenter"], size=15, color=LIME, bold=True, space=0, line=1.2)
    y = SH - 1.05
    s.shapes.add_picture(str(RES / "logos" / "FASTR_White_Horiz.png"), Inches(0.8), Inches(y), height=Inches(0.5))
    s.shapes.add_picture(str(RES / "logos" / "usefuldata600w.png"), Inches(3.0), Inches(y + 0.07), height=Inches(0.34))


def s_image_text(prs, c):
    """Image + text block; `image` is a path relative to resources/."""
    s = _new(prs)
    by = _title(s, c["title"])
    im = img(c["image"])
    tw = c.get("tw", 4.5)
    iw_box = CW - tw - 0.45
    ih_box = SH - by - 0.6
    w, h = _fit(im, iw_box, ih_box)
    right = c.get("side", "left") == "right"
    ix = (SW - LEFT - w) if right else (LEFT + (iw_box - w) / 2)
    tx = LEFT if right else LEFT + iw_box + 0.45
    if c.get("pack") and not right:  # tall image: hug the left edge, text takes the rest
        ix, tx, tw = LEFT, LEFT + w + 0.55, CW - w - 0.55
    s.shapes.add_picture(str(im), Inches(ix), Inches(by + (ih_box - h) / 2), Inches(w), Inches(h))
    _, tf = _tb(s, tx, by, tw, ih_box)
    tf.vertical_anchor = MID
    _blocks(tf, c["blocks"], base=14)


def s_content(prs, c):
    s = _new(prs)
    by = _title(s, c["title"])
    _, tf = _tb(s, LEFT, by, c.get("tw", CW), SH - by - 0.9)
    tf.vertical_anchor = MID
    _blocks(tf, c["blocks"], base=16)


def s_diagram(prs, c):
    """Full-width diagram under the title, optional one-line intro."""
    s = _new(prs)
    by = _title(s, c["title"])
    if c.get("intro"):
        _, itf = _tb(s, LEFT, by, CW, 0.5)
        _para(itf, c["intro"], size=14, color=INK2, first=True, space=0, line=1.15)
        by += 0.55
    im = img(c["image"])
    area = SH - by - (1.25 if c.get("footer") else 0.65)
    w, h = _fit(im, CW, area)
    s.shapes.add_picture(str(im), Inches((SW - w) / 2), Inches(by + (area - h) / 2), Inches(w), Inches(h))
    if c.get("footer"):
        _callout(s, c["footer"])


def s_footprint(prs, c):
    """Country footprint as three colored groups (native text, no map)."""
    s = _new(prs)
    by = _title(s, c["title"])
    _, itf = _tb(s, LEFT, by, CW, 0.5)
    _para(itf, c["intro"], size=14, color=INK2, first=True, space=0, line=1.15)
    y0 = by + 0.7
    groups = c["groups"]
    gap = 0.4
    weights = [g.get("w", 1) for g in groups]
    unit = (CW - (len(groups) - 1) * gap) / sum(weights)
    gh = SH - y0 - 1.25
    x = LEFT
    for g, wt in zip(groups, weights):
        gw = unit * wt
        col = g["color"]
        _rect(s, x, y0, gw, gh, fill=TINT[col])
        _rect(s, x, y0, gw, 0.09, fill=col)
        _, hf = _tb(s, x + 0.24, y0 + 0.28, gw - 0.48, 0.9)
        _para(hf, str(len(g["countries"])), size=34, color=col, first=True, bold=True, space=0, line=1.0)
        _para(hf, g["head"], size=13.5, color=INK, bold=True, space=0, line=1.1)
        names = g["countries"]
        ncol = g.get("cols", 1)
        per = -(-len(names) // ncol)
        cw = (gw - 0.48) / ncol
        for j in range(ncol):
            _, lf = _tb(s, x + 0.24 + j * cw, y0 + 1.35, cw - 0.1, gh - 1.5)
            for name in names[j * per:(j + 1) * per]:
                _para(lf, name, size=12, color=INK2, space=2, line=1.15)
        x += gw + gap
    _, nf = _tb(s, LEFT, SH - 1.0, CW, 0.45)
    _para(nf, c["note"], size=10, color=INK3, first=True, italic=True, space=0, line=1.12)


def s_columns(prs, c):
    """Three accent-bar columns, each a heading + short lines. For next steps."""
    s = _new(prs)
    by = _title(s, c["title"])
    if c.get("intro"):
        _, itf = _tb(s, LEFT, by, CW, 0.5)
        _para(itf, c["intro"], size=14, color=INK2, first=True, space=0, line=1.15)
        by += 0.6
    n = len(c["cols"])
    gap = 0.5
    w = (CW - (n - 1) * gap) / n
    h = c.get("h", 2.9)
    for i, col in enumerate(c["cols"]):
        x = LEFT + i * (w + gap)
        acc = STEP_COLORS[i % 4]
        _rect(s, x, by + 0.05, 0.06, h - 0.1, fill=acc)
        _, tf = _tb(s, x + 0.3, by, w - 0.3, h)
        _para(tf, col["head"], size=16, color=acc, first=True, bold=True, space=10, line=1.08)
        for it in col["items"]:
            _para(tf, it, size=13.5, color=INK, bullet=True, space=7, line=1.2)


def s_placeholder(prs, c):
    """Next-steps skeleton with a visible note for the presenter to fill in."""
    s = _new(prs)
    by = _title(s, c["title"])
    _, itf = _tb(s, LEFT, by, CW, 0.5)
    _para(itf, c["intro"], size=14, color=INK2, first=True, space=0, line=1.15)
    by += 0.6
    n = len(c["cols"])
    gap = 0.5
    w = (CW - (n - 1) * gap) / n
    h = 2.7
    for i, col in enumerate(c["cols"]):
        x = LEFT + i * (w + gap)
        acc = STEP_COLORS[i % 4]
        _rect(s, x, by + 0.05, 0.06, h - 0.1, fill=acc)
        _, tf = _tb(s, x + 0.3, by, w - 0.3, h)
        _para(tf, col["head"], size=16, color=acc, first=True, bold=True, space=10, line=1.08)
        for it in col["items"]:
            _para(tf, it, size=13.5, color=INK3, bullet=True, space=7, line=1.2, italic=True)
    ny = by + h + 0.25
    _rect(s, LEFT, ny, CW, 0.95, fill=TINT[PLUM], line=PLUM, line_w=1.25)
    _, nf = _tb(s, LEFT + 0.3, ny, CW - 0.6, 0.95)
    nf.vertical_anchor = MID
    _para(nf, c["editor_note"], size=12.5, color=INK, first=True, space=0, line=1.2)


def s_closing(prs, c):
    s = _new(prs)
    _bg(s, DEEP_GREEN)
    _, tf = _tb(s, 0.9, 0.9, 11.4, 1.2)
    _para(tf, c["title"], size=40, color=WHITE, first=True, bold=True, space=0)
    _rect(s, 0.95, 2.05, 1.6, 0.05, fill=LIME)
    _, tf2 = _tb(s, 0.9, 2.35, 11.4, 1.6)
    _para(tf2, c["tagline"], size=22, color=WHITE, first=True, bold=True, space=14, line=1.12)
    _para(tf2, c["contact"], size=16, color=RGBColor(0xEC, 0xF0, 0xEF), space=0, line=1.2)
    cy = 4.85
    s.shapes.add_picture(str(RES / "logos" / "FASTR_White_Horiz.png"), Inches(0.95), Inches(cy - 0.25), height=Inches(0.5))
    s.shapes.add_picture(str(RES / "logos" / "usefuldata600w.png"), Inches(3.25), Inches(cy - 0.17), height=Inches(0.34))
    s.shapes.add_picture(str(RES / "logos" / "GFF_Logo_trimmed.png"), Inches(6.15), Inches(cy - 0.15), height=Inches(0.3))


def _footer(slide, n, total):
    _rect(slide, LEFT, SH - 0.44, CW, 0.012, fill=RGBColor(0xE4, 0xE7, 0xE5))
    _, lf = _tb(slide, LEFT, SH - 0.38, CW - 1.2, 0.3)
    _para(lf, "FASTR  ·  WHAT IS FASTR?", size=8, color=INK3, first=True, bold=True, space=0)
    _, pf = _tb(slide, SW - LEFT - 1.0, SH - 0.38, 1.0, 0.3)
    _para(pf, f"{n} / {total}", size=8, color=INK3, first=True, bold=True, align=PP_ALIGN.RIGHT, space=0)


BUILDERS = {"cover": s_cover, "statement": s_statement, "content": s_content, "cycle": s_cycle,
            "numbered": s_numbered, "image_text": s_image_text, "diagram": s_diagram,
            "footprint": s_footprint, "contrast": s_contrast, "columns": s_columns, "placeholder": s_placeholder,
            "closing": s_closing}


# ---- content ----------------------------------------------------------------
CONTENT = [
    {"type": "cover", "title": "What is FASTR?",
     "subtitle": "Frequent Assessments and System Tools for Resilience\nThe GFF approach to rapid-cycle analytics and data use",
     "presenter": "Amal Tucker Brown  ·  Global Financing Facility  ·  September 2026",
     "notes": "Read the acronym aloud. Most of the room will not have heard it spelled out, and the words explain what FASTR is: frequent assessments, and tools that make the system more resilient.\n\nThis deck accompanies the Zambia RMNCAH-N financing desk review (DevPart Consult with GFF, CHAI and R4D, preliminary findings September 2026), where FASTR is listed as next step 2. Do not assume the room knows that review by name; if you refer to it, call it the financing review. It answers one question: what is FASTR, and what will it add to the Investment Case? About 12 minutes."},

    # ---- Rationale ---------------------------------------------------------
    {"type": "diagram", "title": "Why FASTR, and why now",
     "intro": "Zambia is losing a large share of its external health financing. The open question is what that means for services, and where.",
     "image": "diagrams/disruptions_questions.svg",
     "footer": "Surveys answer every five years. Health facilities report every month. FASTR makes that monthly data reliable enough to act on.",
     "notes": "Walk the four cards left to right.\n\nFunding shifts: the money is going down, and the Zambia RMNCAH-N financing review has quantified it (external donors finance 42 to 46 percent of current health expenditure; US global health programmes cut 89 percent; Global Fund GC8 down 6.2 percent; Gavi 6.0 envelope from USD 88.0m to 72.4m). Quote the figures from the financing review, not from this slide.\n\nWhat's affected: a financing number does not tell you what happened to services. The Investment Case needs to know whether coverage is falling, in which districts, and for which services.\n\nFASTR: it reads the DHIS2 data facilities already report every month. No new data collection is needed to start. HMIS is often analyzed late or not trusted; FASTR assesses and adjusts its quality before use, so quality stops being a reason not to act.\n\nAct in time: detect disruptions early, prioritize, plan and advocate. FASTR does not replace surveys; it fills the years between them."},

    {"type": "content", "title": "What FASTR is", "tw": 10.8, "blocks": [
        {"t": "The GFF supports country-led efforts to improve the timely generation and use of data for decision-making, to strengthen primary health care and improve RMNCAH-N outcomes.", "size": 16, "space": 14},
        {"t": "This set of initiatives and technical support is called **Frequent Assessments and System Tools for Resilience (FASTR)**.", "size": 16, "space": 14},
        {"t": "It combines **rigorous, rapid, low-cost methods** with capacity strengthening and data-use support adapted to each country.", "size": 16, "space": 0},
     ],
     "notes": "The first paragraph is the official GFF wording. Keep it close to verbatim.\n\nIf asked what makes FASTR different from existing HMIS analysis: it is the combination of timely cycles, several complementary methods, and embedded capacity support. Not any single technique."},

    {"type": "image_text", "title": "Objective: data into decisions, every quarter",
     "image": "diagrams/rapid_cycle_analytics.png", "side": "right", "tw": 5.4, "blocks": [
        {"t": "Between two surveys there are **five years of decisions** made without fresh data.", "space": 12},
        {"t": "FASTR closes that gap: data that is available on time, and used as a matter of routine, so that RMNCAH-N decisions rest on what is happening now.", "space": 16},
        {"t": "\"Rapid-cycle analytics accelerate progress on RMNCAH-N outcomes by strengthening the availability and the systematic, timely use of data for decision-making.\"", "size": 12.5, "italic": True, "color": INK2, "space": 4},
        {"t": "GFF, FASTR objective statement", "size": 10.5, "color": INK3, "space": 0},
     ],
     "notes": "The diagram is the gap. Left: the survey-only model, a question mark between two in-person surveys roughly five years apart. Right: the FASTR model, monthly routine data, quality-checked, used continuously alongside the surveys.\n\nThe quote is the official GFF objective. Two words in it matter: timely, and systematic. Timely is the easy half. Systematic means data review becomes part of the routine, not a one-off exercise.\n\nIf asked whether FASTR replaces surveys: no. It fills the years between them and uses survey data when it arrives."},

    # ---- Scope -------------------------------------------------------------
    {"type": "diagram", "title": "Scope: four complementary approaches",
     "intro": "Each approach is one method. They are designed to complement each other, and all four rest on capacity strengthening and data-use support.",
     "image": "diagrams/Technical_approaches_image.svg",
     "notes": "RMNCAH-N service use monitoring is the workhorse. It runs routinely and covers everywhere with reporting facilities. It is the approach the rest of this deck describes.\n\nThe other three add depth where HMIS cannot reach: facility phone surveys for readiness and reform tracking; household and client surveys for the demand side (care-seeking, foregone care, experience of care); follow-on analyses for root causes.\n\nFor Zambia, the financing review asks for the first three to be triangulated. That is exactly what the approaches are designed for.\n\nThe band underneath is not optional. Without capacity strengthening and data-use support, the analytical outputs do not get used."},

    {"type": "contrast", "title": "Scope: FASTR in Zambia", "cols": [
        {"head": "Where Zambia stands", "accent": DEEP_GREEN, "items": [
            "One of **29 GFF partner countries** using FASTR",
            "Among the first to use it for **service continuity monitoring** after changes in external financing",
            "Routine DHIS2 data already the core input; facility and household surveys add the supply and demand side"]},
        {"head": "FASTR's role in the Investment Case", "accent": GREEN, "items": [
            "Triangulate **HMIS service-use trends** with facility and household data",
            "Establish **whether, where and why** coverage is declining",
            "Service **disruption** assessment and **district-level** equity analysis"]},
     ], "footer": "FASTR measures the effect of financing changes on service delivery. The funding-gap picture itself comes from the RMET exercise; the two are designed to be read together.",
     "notes": "Left column: Zambia is not starting from zero. It entered FASTR through service continuity monitoring, triggered by changes in external financing, the same entry point as Sierra Leone, Burkina Faso and Liberia.\n\nRight column is what the Zambia financing review itself names as FASTR follow-up work (next-step card 2, the scope boundaries, and the conclusion): triangulating HMIS service-use trends with facility- and household-level data to identify whether or not, where and why coverage is declining; complemented by district-level equity analyses and service disruption assessments.\n\nThe footer corrects a wording point in the financing review's next-steps slide, which calls FASTR a \"rapid funding-gap analysis\". The funding gap is RMET's output. FASTR's output is what happens to services. Say this gently: the two pieces are complementary."},

    # ---- Methodology -------------------------------------------------------
    {"type": "cycle", "title": "Methodology: a continuous cycle", "nodes": [
        ("Analyze", "Analyze primary health care and RMNCAH-N data in a timely way"),
        ("Learn", "Learn from the data to prioritize health system gaps"),
        ("Strengthen", "Strengthen in-country M&E capacity and data quality"),
        ("Act", "Turn data into action for better RMNCAH-N outcomes"),
     ], "footer": "…and the cycle starts again, quarter after quarter.",
     "notes": "Walk the cycle aloud. Analyze the data, learn what it tells you, strengthen the system based on what you learned, act on the priorities, then loop back.\n\nA single FASTR report does not move the needle. The cycle does. That is why \"systematic\" matters as much as \"timely\".\n\nSkipping \"strengthen\" is the most common failure mode: the analysis lands but the system never improves."},

    {"type": "image_text", "title": "Methodology: service use monitoring in six steps",
     "image": "diagrams/steps_to_implement_rmncahn_service_chart.svg", "side": "right", "tw": 5.2, "blocks": [
        {"t": "**Quarterly analyses of DHIS2 data**, focused on a short list of prioritized national indicators.", "space": 12},
        {"t": "Data quality is assessed and adjusted **before** the analysis, so quality issues stop being a reason not to use the data.", "space": 12},
        {"t": "Each step has a defined method, so the analysis is the same from one quarter, and one country, to the next.", "space": 0},
     ],
     "notes": "This is the operating model for the HMIS approach: quarterly cadence, prioritized indicators, defined methods.\n\nSteps 1 and 2 are country-led set-up: which questions, which indicators, and extracting the data from DHIS2. Steps 3 to 5 are the analytical core. Step 6 is where results meet decision-makers.\n\nWhy quarterly: it matches the decision cycle of districts and ministries. Faster is possible but rarely useful; slower defeats the point."},

    {"type": "numbered", "title": "Methodology: what the analysis produces", "steps": [
        ("Data quality assessment", "Completeness, outliers, and internal consistency, scored by facility and by district."),
        ("Data quality adjustment", "Incomplete reporting and outliers corrected so that trends reflect services, not reporting."),
        ("Service use and disruptions", "Months where volume falls below or above the expected level, flagged nationally and by district."),
        ("Coverage estimates", "Population denominators derived and validated, then coverage compared with national targets, by district."),
     ], "footer": "Standardized methods, versioned and recomputed automatically when the data changes.",
     "notes": "Four outputs, in the order they are produced. Each feeds the next.\n\nData quality first, because adjustment depends on it. Service use and disruptions next: expected volumes are estimated from historical trends and seasonality, and months that fall outside the expected range are flagged. This is the disruption assessment the financing review asks for. Coverage last: denominators are derived from service volumes and validated against survey and population estimates. Subnational results are what the district-level equity analysis is built on.\n\nAll four are computed by the same analysis modules in every country, which is what makes cross-country comparison possible."},

    {"type": "image_text", "title": "Methodology: one platform, end to end",
     "image": "screenshots/platform_en/example-viz-timeseries-en.png", "side": "left", "tw": 4.6, "blocks": [
        {"t": "An **online platform** that connects directly to DHIS2 and holds a country's data in one place.", "space": 10},
        {"t": "The analysis modules run **built in**, with no code to write, and recompute when the data is updated.", "space": 10},
        {"t": "Visualizations, reports and slides all come from the same results, so figures stay current.", "space": 0},
     ],
     "notes": "The platform is what makes the method sustainable. The method lives in the tool, not in the person who knows it.\n\nInterface in English, French and Portuguese. Nothing to install; a browser is enough.\n\nThe screenshot shows the disruptions and surpluses view on the demo site: the black line is the actual volume, the dashed line the expected volume, red shading a disruption and green a surplus."},

    {"type": "image_text", "title": "The AI assistant, in use",
     "image": "screenshots/m9c/ai_first_response.png", "side": "left", "tw": 6.0, "pack": True, "blocks": [
        {"t": "Ask in plain language: \"Show me ANC1 visits over the last 12 months.\"", "space": 10},
        {"t": "The assistant finds the metric, **reads the project's real values**, and answers with a chart and an interpretation.", "space": 10},
        {"t": "It never computes the numbers itself. Those come from the validated modules. It helps read, compare, and turn results into report text.", "space": 0},
     ],
     "notes": "Screenshot from the demo site. The user asked for ANC1 visits over the last 12 months. The assistant returned the outlier-adjusted time series, the total, and an explanation of what \"outlier-adjusted\" means, then offered to drill down by region or compare with the unadjusted series.\n\nThe principle is \"read before answering\". It searches the project's data and methodology documentation, then responds. It does not guess, and it does not replace the modules: data quality scores, disruption flags and coverage estimates are computed by the validated statistical methods.\n\nWhy it matters for Zambia: many teams have more data than time to analyze it. The assistant lowers the skill barrier for asking the next question."},

    {"type": "diagram", "title": "A result is a signal, not an answer",
     "intro": "FASTR says where to look. People in the health system say why, and what to do. Each quarter's data then shows whether it worked.",
     "image": "diagrams/from_analysis_to_action.svg",
     "footer": "Example: a district shows a drop in institutional deliveries. Is it a reporting gap? A stock-out, a staffing gap, a fee change? Then act, and check next quarter's data.",
     "notes": "This is the slide that stops FASTR being read as a dashboard. The analysis produces flags: a data quality score, a disruption, a coverage gap. None of them is a conclusion.\n\nWalk the example. Institutional deliveries fall in one district. Step one is always data quality: did the facilities report? If the data is sound, step two is context: commodities, staff, user fees, a closed facility, a road. Step three is the decision, and step four is the next quarter's data, which shows whether the decision worked.\n\nFor Zambia this is the link to the Investment Case: FASTR provides the evidence on where services are slipping; the financing review, the RMET and the stakeholders provide the why and the response."},

    # ---- Next steps --------------------------------------------------------
    {"type": "placeholder", "title": "Next steps: FASTR in Zambia",
     "intro": "How the FASTR exercise will feed the RMNCAH-N Investment Case 2027 to 2031.",
     "cols": [
        {"head": "What", "items": [
            "[Analyses to be run, e.g. HMIS service-use and disruption analysis, facility phone survey, household or client survey]",
            "[First outputs expected]"]},
        {"head": "When", "items": [
            "[Start date and first results]",
            "[Cadence, e.g. quarterly updates through the IC design period]"]},
        {"head": "Who", "items": [
            "[MoH lead unit and FASTR team]",
            "[Partners: RMET team, CHAI, R4D, DevPart]"]},
     ],
     "editor_note": "Note for Amal: placeholder. Replace the bracketed items with the agreed FASTR workplan for Zambia (analyses, timeline, responsibilities) or delete this box and present the next-steps card from the Zambia RMNCAH-N financing review presentation.",
     "notes": "PLACEHOLDER SLIDE. Fill in the agreed FASTR workplan for Zambia before presenting: which analyses, when the first results land relative to the Investment Case timeline, and who owns each piece. Delete the yellow note box once done."},

    {"type": "closing", "title": "Thank you",
     "tagline": "Analyze  ·  Learn  ·  Strengthen  ·  Act",
     "contact": "Amal Tucker Brown  ·  atuckerbrown@worldbank.org",
     "notes": "Methodology documentation and the platform user guide: fastr-analytics.org."},
]


def main():
    prs = Presentation()
    prs.slide_width = Emu(int(SW * EMU_IN))
    prs.slide_height = Emu(int(SH * EMU_IN))
    for c in CONTENT:
        BUILDERS[c["type"]](prs, c)
    total = len(CONTENT)
    no_footer = {"cover", "statement", "closing"}
    for n, (c, slide) in enumerate(zip(CONTENT, prs.slides), 1):
        _fade(slide)
        if c["type"] not in no_footer:
            _footer(slide, n, total)
        if c.get("notes"):
            slide.notes_slide.notes_text_frame.text = c["notes"]
    out = REPO / "decks" / "en" / "what_is_fastr.pptx"
    prs.save(str(out))
    print(f"Wrote {len(CONTENT)} slides -> {out}")


if __name__ == "__main__":
    main()
