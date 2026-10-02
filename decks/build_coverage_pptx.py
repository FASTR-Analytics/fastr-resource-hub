#!/usr/bin/env python3
"""Build the editable PPTX (opens in Keynote and PowerPoint) of the FR
coverage deck `decks/fr/analyse_couverture_pas_a_pas.md`.

Slide order and the illustration slides are read from the Marp source, so a
regenerated drawing or a reordered slide flows through automatically. The
handful of text slides (rules, rates table, checks, one-pager) are transcribed
in TEXT_SLIDES below, keyed by their title: keep them in sync with the .md.

Usage:  python3 decks/build_coverage_pptx.py
Deps:   pip install python-pptx pillow cairosvg
"""
from __future__ import annotations

import re
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import cairosvg  # noqa: E402
from pptx import Presentation  # noqa: E402
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN  # noqa: E402
from pptx.util import Emu, Inches  # noqa: E402

from build_deck_pptx import (  # noqa: E402
    CW, DEEP_GREEN, EMU_IN, INK, INK3, LEFT, SH, SW, RGBColor, _fit, _new, _para,
    _rect, _tb, _title, s_closing, s_cover, s_section,
)

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "decks" / "fr" / "analyse_couverture_pas_a_pas.md"
OUT = REPO / "decks" / "fr" / "analyse_couverture_pas_a_pas.pptx"
RULE = RGBColor(0xD9, 0xDE, 0xDD)
TMP = Path(tempfile.mkdtemp(prefix="cov_pptx_"))

TEXT_SLIDES = {
    "Deux règles pratiques pour l'étape 1": {"type": "text", "blocks": [
        "**On garde la valeur de l'enquête jusqu'à la suivante.** L'enquête de 2021 dit « 8 sur 10 ». Il n'y en a pas eu depuis. Pour 2022, 2023 et 2024, FASTR continue d'utiliser « 8 sur 10 », avec le nombre de consultations de chaque année. Quand une nouvelle enquête sort, elle remplace l'ancienne.",
        "**S'il y a deux enquêtes la même année, l'EDS (DHS) passe avant la MICS.**",
        "Le même raisonnement marche avec d'autres services. Avec les accouchements en établissement et la part de femmes qui accouchent en établissement, on retrouve le nombre de naissances. Avec le premier vaccin Penta et sa couverture d'enquête, on retrouve le nombre de nourrissons.",
    ]},
    "Les cinq taux de la cascade": {"type": "rates",
        "rows": [("Perte de grossesse", "3 %"), ("Jumeaux", "1,5 %"), ("Mortinatalité", "20 ‰"),
                 ("Mortalité néonatale", "39 ‰"), ("Mortalité postnéonatale", "28 ‰")],
        "head": "Ce qu'il faut en savoir",
        "items": [
            "Ce sont des valeurs de départ, pas des valeurs du pays. Elles se remplacent par l'EDS (DHS) ou les estimations UN IGME dans **Résultats → Paramètres par défaut des modules**.",
            "Un taux changé s'applique à chaque paquet de résultats généré ensuite.",
            "Au niveau des provinces, ce sont ces taux nationaux qui s'appliquent.",
        ]},
    "Avant de faire confiance au résultat": {"type": "two_col", "cols": [
        {"head": "Vérifier", "items": [
            "La **dernière enquête** disponible pour le pays est bien celle utilisée",
            "Les **cinq taux** sont ceux du pays, pas les défauts",
            "La **chaîne retenue** et sa médiane, dans le journal de génération"]},
        {"head": "Interpréter avec prudence", "items": [
            "Une couverture **au-dessus de 100 %** : dénominateur à revoir",
            "Une **petite province** : quelques établissements suffisent à faire bouger la courbe",
            "Un **changement brusque** la même année dans tous les indicateurs : souvent un problème de rapportage, pas de service"]},
    ]},
    "En une page": {"type": "text", "numbered": True, "blocks": [
        "Un service mesuré par l'enquête donne une population de départ : volume SNIS ÷ couverture d'enquête.",
        "La cascade démographique en déduit les autres populations avec cinq taux.",
        "Quatre chaînes sont construites ; celle qui colle le mieux aux projections de l'ONU est retenue pour tout.",
        "La couverture est le volume corrigé divisé par ce dénominateur ; la dernière enquête est prolongée par la tendance du SNIS.",
    ], "tail": "Le résultat se lit chaque année et par province, là où les enquêtes ne vont pas."},
}


def parse(md: str):
    body = md.split("\n---\n", 1)[1]  # drop front matter
    slides = []
    for raw in re.split(r"\n---\n", body):
        cls = re.search(r"_class:\s*([\w-]+)", raw)
        cls = cls.group(1) if cls else "text"
        h1 = re.search(r"^# (.+)$", raw, re.M)
        h2s = re.findall(r"^## (.+)$", raw, re.M)
        img = re.search(r'<img src="([^"]+)"', raw)
        bold = re.search(r"^\*\*(.+)\*\*$", raw, re.M)
        slides.append({"cls": cls, "h1": h1.group(1) if h1 else None, "h2": h2s[0] if h2s else None,
                       "img": img.group(1) if img else None, "bold": bold.group(1) if bold else None})
    return slides


def _footer(slide, n):
    _, lf = _tb(slide, LEFT, SH - 0.26, CW - 1.2, 0.22)
    _para(lf, "FASTR  ·  L'ANALYSE DE COUVERTURE, PAS À PAS", size=8, color=INK3, first=True, bold=True, space=0)
    _, pf = _tb(slide, SW - LEFT - 1.0, SH - 0.26, 1.0, 0.22)
    _para(pf, f"{n}", size=8, color=INK3, first=True, bold=True, align=PP_ALIGN.RIGHT, space=0)


def svg_png(rel: str) -> Path:
    src = (SRC.parent / rel).resolve()
    out = TMP / (src.stem + ".png")
    if not out.exists():
        cairosvg.svg2png(url=str(src), write_to=str(out), output_width=2400, background_color="white")
    return out


def s_pic(prs, title, img_rel):
    s = _new(prs)
    by = _title(s, title)
    png = svg_png(img_rel)
    max_w, max_h = CW, SH - by - 0.5
    w, h = _fit(png, max_w, max_h)
    s.shapes.add_picture(str(png), Inches(LEFT + (max_w - w) / 2), Inches(by + 0.1), Inches(w), Inches(h))


def s_text(prs, title, c):
    s = _new(prs)
    by = _title(s, title)
    _, tf = _tb(s, LEFT + 0.2, by + 0.15, CW - 0.4, SH - by - 0.9)
    first = True
    for i, b in enumerate(c["blocks"], 1):
        txt = f"{i}.  {b}" if c.get("numbered") else b
        _para(tf, txt, size=16, color=INK, first=first, space=14, line=1.3)
        first = False
    if c.get("tail"):
        _para(tf, c["tail"], size=16, color=INK, space=14, line=1.3)


def s_two_col(prs, title, c):
    s = _new(prs)
    by = _title(s, title)
    colw = (CW - 0.7) / 2
    for i, col in enumerate(c["cols"]):
        x = LEFT + i * (colw + 0.7)
        _rect(s, x, by + 0.12, 0.035, 0.26, fill=DEEP_GREEN)
        _, tf = _tb(s, x + 0.14, by + 0.05, colw - 0.14, SH - by - 0.9)
        _para(tf, col["head"], size=16, color=DEEP_GREEN, first=True, bold=True, space=10, line=1.05)
        for it in col["items"]:
            _para(tf, it, size=14.5, color=INK, bullet=True, space=8, line=1.22)


def s_rates(prs, title, c):
    s = _new(prs)
    by = _title(s, title)
    colw = (CW - 0.7) / 2
    _rect(s, LEFT, by + 0.12, 0.035, 0.26, fill=DEEP_GREEN)
    _, hf = _tb(s, LEFT + 0.14, by + 0.05, colw, 0.4)
    _para(hf, "Valeurs par défaut", size=16, color=DEEP_GREEN, first=True, bold=True, space=0)
    y = by + 0.6
    rh = 0.42
    xs = (LEFT, LEFT + 3.8)
    for j, head in enumerate(("Taux", "Défaut")):
        _, h = _tb(s, xs[j] + 0.1, y, 3.4, rh)
        h.vertical_anchor = MSO_ANCHOR.MIDDLE
        _para(h, head, size=12, color=DEEP_GREEN, first=True, bold=True, space=0)
    _rect(s, LEFT, y + rh, colw, 0.02, fill=DEEP_GREEN)
    y += rh + 0.04
    for i, (name, val) in enumerate(c["rows"]):
        if i % 2 == 1:
            _rect(s, LEFT, y, colw, rh, fill=RGBColor(0xF4, 0xF8, 0xF8))
        for j, cell in enumerate((name, val)):
            _, cf = _tb(s, xs[j] + 0.1, y, 3.4, rh)
            cf.vertical_anchor = MSO_ANCHOR.MIDDLE
            _para(cf, cell, size=13, color=INK, first=True, bold=(j == 1), space=0)
        _rect(s, LEFT, y + rh, colw, 0.01, fill=RULE)
        y += rh
    x = LEFT + colw + 0.7
    _rect(s, x, by + 0.12, 0.035, 0.26, fill=DEEP_GREEN)
    _, tf = _tb(s, x + 0.14, by + 0.05, colw - 0.14, SH - by - 0.9)
    _para(tf, c["head"], size=16, color=DEEP_GREEN, first=True, bold=True, space=10, line=1.05)
    for it in c["items"]:
        _para(tf, it, size=14.5, color=INK, bullet=True, space=8, line=1.22)


def main():
    slides = parse(SRC.read_text())
    prs = Presentation()
    prs.slide_width = Emu(int(SW * EMU_IN))
    prs.slide_height = Emu(int(SH * EMU_IN))
    n = 0
    for sl in slides:
        n += 1
        cls, title = sl["cls"], sl["h2"] or sl["h1"]
        if cls == "title-cover":
            s_cover(prs, {"title": sl["h1"], "subtitle": sl["bold"] or ""})
        elif cls == "section-cover":
            s_section(prs, {"title": sl["h1"]})
        elif cls == "bg-green":
            s_closing(prs, {"title": sl["h1"], "tagline": sl["h2"]})
        elif cls == "pic":
            s_pic(prs, title, sl["img"]); _footer(prs.slides[-1], n)
        else:
            c = TEXT_SLIDES.get(title)
            if not c:
                raise SystemExit(f"No PPTX transcription for text slide: {title!r} — add it to TEXT_SLIDES")
            {"text": s_text, "two_col": s_two_col, "rates": s_rates}[c["type"]](prs, title, c)
            _footer(prs.slides[-1], n)
    prs.save(str(OUT))
    print(f"Wrote {n} slides -> {OUT}")


if __name__ == "__main__":
    main()
