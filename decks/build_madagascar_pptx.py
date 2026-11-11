#!/usr/bin/env python3
"""Build the editable PPTX of the Madagascar touch-base deck (FR, Sept 2026).

Mirrors `decks/fr/madagascar_point_etape_2026_09.md` (the Marp source that
drives the PDF) with the same look: white slides, deep-green titles with the
green rule, eyebrows, callout footers, green closing. Reuses the helpers of
`build_deck_pptx.py`. Keep both in sync when the content changes.

Usage:  python3 decks/build_madagascar_pptx.py
Deps:   pip install python-pptx pillow
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from PIL import Image  # noqa: E402
from pptx import Presentation  # noqa: E402
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN  # noqa: E402
from pptx.util import Emu, Inches  # noqa: E402

from build_deck_pptx import (  # noqa: E402
    CW, DEEP_GREEN, EMU_IN, GREEN, INK, INK2, INK3, LEFT, LIME, PLUM, RES, SH, SW,
    WHITE, RGBColor, _bg, _callout, _new, _para, _rect, _tb, _title, s_cover,
)

REPO = Path(__file__).resolve().parent.parent
TINT = RGBColor(0xEA, 0xF3, 0xF3)
RULE = RGBColor(0xD9, 0xDE, 0xDD)


def _eyebrow(slide, x, y, w, text, color=DEEP_GREEN):
    _rect(slide, x, y + 0.04, 0.035, 0.2, fill=color)
    _, tf = _tb(slide, x + 0.14, y, w - 0.14, 0.28)
    _para(tf, text.upper(), size=9.5, color=color, first=True, bold=True, space=0)
    return y + 0.34


def _footer(slide, n, total):
    _, lf = _tb(slide, LEFT, SH - 0.26, CW - 1.2, 0.22)
    _para(lf, "FASTR  ·  MADAGASCAR  ·  POINT D'ÉTAPE  ·  25 SEPTEMBRE 2026", size=8, color=INK3, first=True, bold=True, space=0)
    _, pf = _tb(slide, SW - LEFT - 1.0, SH - 0.26, 1.0, 0.22)
    _para(pf, f"{n}", size=8, color=INK3, first=True, bold=True, align=PP_ALIGN.RIGHT, space=0)


def s_agenda(prs, c):
    """2 x 2 grid of eyebrow + paragraph, then the callout."""
    s = _new(prs)
    by = _title(s, c["title"])
    gap = 0.6
    w = (CW - gap) / 2
    for i, it in enumerate(c["items"]):
        x = LEFT + (i % 2) * (w + gap)
        y = by + 0.1 + (i // 2) * 1.55
        ty = _eyebrow(s, x, y, w, it["eyebrow"])
        _, tf = _tb(s, x, ty, w, 1.1)
        _para(tf, it["text"], size=14, color=INK, first=True, space=0, line=1.25)
    _callout(s, c["footer"])


def s_cards(prs, c):
    """Three eyebrow + head + text columns, a paragraph under, then the callout."""
    s = _new(prs)
    by = _title(s, c["title"])
    gap = 0.5
    w = (CW - 2 * gap) / 3
    for i, card in enumerate(c["cards"]):
        x = LEFT + i * (w + gap)
        ty = _eyebrow(s, x, by + 0.1, w, card["eyebrow"])
        _rect(s, x, ty + 0.03, 0.035, 0.28, fill=PLUM)
        _, hf = _tb(s, x + 0.14, ty, w - 0.14, 0.4)
        _para(hf, card["head"], size=15, color=PLUM, first=True, bold=True, space=0)
        _, tf = _tb(s, x, ty + 0.45, w, 1.5)
        _para(tf, card["text"], size=13.5, color=INK, first=True, space=0, line=1.25)
    if c.get("para"):
        _, pf = _tb(s, LEFT, by + 2.45, CW, 0.9)
        _para(pf, c["para"], size=14, color=INK, first=True, space=0, line=1.25)
    _callout(s, c["footer"])


def s_image_text(prs, c):
    """Text left, clipped screenshot right with a caption, callout under."""
    s = _new(prs)
    by = _title(s, c["title"])
    tw = 5.4
    _, tf = _tb(s, LEFT, by + 0.05, tw, SH - by - 1.3)
    first = True
    for b in c["blocks"]:
        _para(tf, b, size=13.5, color=INK, first=first, space=10, line=1.25)
        first = False
    img = RES / c["image"]
    ix = LEFT + tw + 0.5
    iw = CW - tw - 0.5
    with Image.open(img) as im:
        w_px, h_px = im.size
        ih = min(iw * h_px / w_px, c.get("clip", 2.9))
        crop = im.crop((0, 0, w_px, int(ih / iw * w_px)))
        tmp = REPO / "decks" / ".tmp_clip.png"
        crop.save(tmp)
    box = _rect(s, ix - 0.04, by + 0.06, iw + 0.08, ih + 0.08, fill=WHITE, line=RULE, line_w=0.75)
    s.shapes.add_picture(str(tmp), Inches(ix), Inches(by + 0.1), Inches(iw), Inches(ih))
    tmp.unlink()
    _, cf = _tb(s, ix, by + ih + 0.25, iw, 0.4)
    _para(cf, c["caption"], size=10, color=INK2, first=True, space=0, line=1.15)
    _callout(s, c["footer"])


def s_numbers(prs, c):
    s = _new(prs)
    by = _title(s, c["title"])
    gap = 0.5
    w = (CW - 2 * gap) / 3
    for i, (num, txt) in enumerate(c["numbers"]):
        x = LEFT + i * (w + gap)
        _, nf = _tb(s, x, by + 0.1, w, 0.8)
        _para(nf, num, size=36, color=DEEP_GREEN, first=True, bold=True, space=0, line=1.0)
        _, tf = _tb(s, x, by + 0.95, w, 1.2)
        _para(tf, txt, size=11.5, color=INK2, first=True, bold=True, space=0, line=1.2)
    _, pf = _tb(s, LEFT, by + 2.35, CW, 0.9)
    _para(pf, c["para"], size=14, color=INK, first=True, space=0, line=1.25)
    _callout(s, c["footer"])


def s_table(prs, c):
    s = _new(prs)
    by = _title(s, c["title"])
    _, lf = _tb(s, LEFT, by + 0.05, CW, 1.0)
    _para(lf, c["lead"], size=13.5, color=INK, first=True, space=0, line=1.25)
    y = by + 1.15
    widths = c["widths"]
    rh = 0.36
    x = LEFT
    for head, w in zip(c["cols"], widths):
        _, hf = _tb(s, x + 0.1, y, w - 0.2, rh)
        hf.vertical_anchor = MSO_ANCHOR.MIDDLE
        _para(hf, head, size=11, color=DEEP_GREEN, first=True, bold=True, space=0)
        x += w
    _rect(s, LEFT, y + rh, sum(widths), 0.02, fill=DEEP_GREEN)
    y += rh + 0.04
    for i, row in enumerate(c["rows"]):
        if i % 2 == 1:
            _rect(s, LEFT, y, sum(widths), rh, fill=RGBColor(0xF4, 0xF8, 0xF8))
        x = LEFT
        for j, (cell, w) in enumerate(zip(row, widths)):
            _, cf = _tb(s, x + 0.1, y, w - 0.2, rh)
            cf.vertical_anchor = MSO_ANCHOR.MIDDLE
            _para(cf, cell, size=11, color=INK, first=True, bold=(j == c.get("bold_col", -1)), space=0)
            x += w
        _rect(s, LEFT, y + rh, sum(widths), 0.01, fill=RULE)
        y += rh
    _callout(s, c["footer"])


def s_closing(prs, c):
    s = _new(prs)
    _bg(s, DEEP_GREEN)
    _, tf = _tb(s, 0.9, 0.7, 11.4, 0.9)
    _para(tf, c["title"], size=34, color=WHITE, first=True, bold=True, space=0)
    gap = 0.5
    w = (SW - 1.8 - 2 * gap) / 3
    for i, col in enumerate(c["cols"]):
        x = 0.9 + i * (w + gap)
        ty = _eyebrow(s, x, 1.9, w, col["head"], color=WHITE)
        _, cf = _tb(s, x, ty + 0.05, w, 3.0)
        first = True
        for it in col["items"]:
            _para(cf, it, size=14, color=WHITE, first=first, bullet=True, bullet_color=LIME, space=8, line=1.2)
            first = False
    y = SH - 1.05
    s.shapes.add_picture(str(RES / "logos" / "FASTR_White_Horiz.png"), Inches(0.9), Inches(y), height=Inches(0.5))
    s.shapes.add_picture(str(RES / "logos" / "usefuldata600w.png"), Inches(3.1), Inches(y + 0.07), height=Inches(0.34))


BUILDERS = {"cover": s_cover, "agenda": s_agenda, "cards": s_cards, "image_text": s_image_text,
            "numbers": s_numbers, "table": s_table, "closing": s_closing}

CONTENT = [
    {"type": "cover", "title": "Point d'étape FASTR Madagascar",
     "subtitle": "Formation · importation automatique · formations sanitaires · paramètres de couverture"},

    {"type": "agenda", "title": "Quatre points en une heure", "items": [
        {"eyebrow": "1 · Formation", "text": "Des sessions pour les administrateurs de la plateforme, maintenant et à la sortie de la v2. À décider : qui, quand, sous quelle forme."},
        {"eyebrow": "2 · Importation automatique", "text": "Programmer l'importation mensuelle depuis DHIS2. Démonstration sur l'instance."},
        {"eyebrow": "3 · Formations sanitaires", "text": "La liste de la plateforme comparée à DHIS2 : 29 nouvelles, 23 retirées. Ce qu'on met à jour."},
        {"eyebrow": "4 · Paramètres de couverture", "text": "Les taux démographiques des dénominateurs sont encore les valeurs par défaut. Les valeurs malgaches sont prêtes à être confirmées."},
     ], "footer": "Les diapositives cadrent chaque point. L'essentiel se passe dans la plateforme."},

    {"type": "cards", "title": "1 · Sessions de formation pour les administrateurs", "cards": [
        {"eyebrow": "Configurer", "head": "L'instance", "text": "Connexion DHIS2, structure des établissements, liste des indicateurs, utilisateurs et permissions."},
        {"eyebrow": "Importer", "head": "Les données", "text": "Importation DHIS2, planification récurrente, suivi, paquets de résultats."},
        {"eyebrow": "Produire", "head": "Rapports et présentations", "text": "Visualisations, diapositives, rapports, assistant IA."},
     ], "para": "Chaque session s'appuie sur un guide pas à pas en français, mis à jour sur la version actuelle de la plateforme, que les participants gardent.",
     "footer": "À décider ensemble : qui sont les administrateurs à former, et combien ? À distance en trois sessions courtes ou une journée sur place ? Une première session maintenant, puis une mise à niveau à la sortie de la v2 ?"},

    {"type": "image_text", "title": "2 · Importation automatique des données DHIS2",
     "image": "screenshots/dhis2_import_v2/03_importations.png", "clip": 2.6,
     "caption": "Données → Données SNIS → Importations : onglets En cours, À venir, Historique.",
     "blocks": [
        "Les données SNIS sur l'instance s'arrêtent à **mai 2026**.",
        "**Nouvelle importation DHIS2** → étape **Heure** → **Récurrente** : chaque mois, un jour choisi, fuseau horaire d'Antananarivo. La planification s'affiche dans l'onglet **À venir**, chaque exécution dans **Historique**.",
        "Après l'importation, deux gestes restent à faire à la main : **générer** un paquet de résultats et l'**épingler**. Les projets qui suivent l'épingle se mettent à jour.",
     ],
     "footer": "À fixer : la date du mois où les données DHIS2 sont validées, le nombre de mois à réimporter, et qui vérifie, génère et épingle."},

    {"type": "numbers", "title": "3 · Formations sanitaires : plateforme et DHIS2", "numbers": [
        ("4 590", "identifiants communs à la plateforme (4 613) et à DHIS2 (4 619)"),
        ("29", "nouvelles dans DHIS2, absentes de la plateforme : surtout des structures privées à Fenoarivobe et Ambatolampy"),
        ("23", "sur la plateforme, rangées sous MG_DEL dans DHIS2 : presque toutes en Anosy, 13 avec des données"),
     ], "para": "Aucune formation sanitaire n'a changé de région, de district ou de commune. Les listes nominatives sont dans le classeur d'audit.",
     "footer": "Proposition : réimporter depuis DHIS2 au niveau Formations Sanitaires avec « Ajouter les nouveaux établissements et mettre à jour les existants ». Les 29 arrivent, les 23 gardent leur historique. Puis générer et épingler un nouveau paquet."},

    {"type": "table", "title": "4 · Paramètres du module de couverture",
     "lead": "Pour estimer une couverture, il faut un dénominateur : les grossesses ou les naissances attendues. FASTR les dérive des naissances vivantes déclarées, avec sept taux démographiques. Aujourd'hui, ce sont les **valeurs par défaut du module**, pas celles de Madagascar.",
     "cols": ["Taux", "Défaut", "EDS 2021", "UN IGME 2024"], "widths": [3.6, 2.2, 2.6, 3.7], "bold_col": 2,
     "rows": [
        ("Mortalité néonatale", "39 ‰", "26 ‰", "23,1 ‰"),
        ("Mortalité postnéonatale", "28 ‰", "21 ‰", "19,9 ‰"),
        ("Mortalité infantile", "67 ‰", "47 ‰", "43,0 ‰"),
        ("Mortalité des moins de 5 ans", "103 ‰", "75 ‰", "62,4 ‰"),
        ("Mortinatalité", "20 ‰", "—", "18,4 ‰"),
        ("Jumeaux · perte de grossesse", "1,5 % · 3 %", "≈ 1,1 % (DHS groupées)", "pas d'estimation nationale"),
     ],
     "footer": "À décider : adopter l'EDS 2021 ou UN IGME 2024, sans mélanger les deux. Où : Résultats → Paramètres par défaut des modules. Même écran pour passer les dénominateurs au niveau district."},

    {"type": "closing", "title": "Ce qu'on retient de l'appel", "cols": [
        {"head": "Décidé aujourd'hui", "items": ["Formation : participants, dates, format", "Importation récurrente : jour, fenêtre, responsable", "Établissements : réimportation faite ou planifiée"]},
        {"head": "Équipe pays", "items": ["Confirmer les taux de couverture", "Confirmer la date de validation mensuelle DHIS2", "Créer les comptes des participants"]},
        {"head": "Équipe FASTR", "items": ["Envoyer les guides et le calendrier", "Vérifier la première importation planifiée", "Générer et épingler le paquet à jour"]},
     ]},
]


def main():
    prs = Presentation()
    prs.slide_width = Emu(int(SW * EMU_IN))
    prs.slide_height = Emu(int(SH * EMU_IN))
    for c in CONTENT:
        BUILDERS[c["type"]](prs, c)
    for n, (c, slide) in enumerate(zip(CONTENT, prs.slides), 1):
        if c["type"] not in ("cover", "closing"):
            _footer(slide, n, len(CONTENT))
    out = REPO / "decks" / "fr" / "madagascar_point_etape_2026_09.pptx"
    prs.save(str(out))
    print(f"Wrote {len(CONTENT)} slides -> {out}")


if __name__ == "__main__":
    main()
