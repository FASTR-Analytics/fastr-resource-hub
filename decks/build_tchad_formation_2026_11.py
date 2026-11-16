#!/usr/bin/env python3
"""Build the Chad FASTR training deck (18-19 Nov 2026) by patching the Mauritania deck.

Source: the Deck Builder export used in Mauritania (Oct 2026). This script
removes the platform-introduction and indicator-download sections, reorders
the rest into two days (theory in the morning, practice in the afternoon),
rewrites every slide that still described platform 1.x (projects, dashboards,
the linear disruption model) from the current French slide library
(core_content_fr/), and adds the Explore, scope and Bayesian slides.

Usage:  python3 decks/build_tchad_formation_2026_11.py [source.pptx]
Output: decks/fr/formation_fastr_tchad_2026_11.pptx
"""
from __future__ import annotations

import copy
import io
import re
import sys
from pathlib import Path

from pptx import Presentation
from pptx.util import Inches, Pt
from lxml import etree

REPO = Path(__file__).resolve().parents[1]
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(
    "/Users/claireboulange/Downloads/2026-mauritanie-2_deck For Sharing day 2-3.pptx")
OUT = REPO / "decks" / "fr" / "formation_fastr_tchad_2026_11.pptx"
FR = REPO / "core_content_fr"
SHOT = REPO / "resources" / "screenshots"
TCHAD_SHOTS = SHOT / "tchad_2026_11"

FOOTER_OLD = "FASTR · MAURITANIE · OCT. 2026"
FOOTER_NEW = "FASTR · TCHAD · NOV. 2026"
URL = "https://tchad.fastr-analytics.org/"

NS = {"a": "http://schemas.openxmlformats.org/drawingml/2006/main",
      "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
      "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships"}


# ─────────────────────────────── markdown → blocks ───────────────────────────
def parse_md(path: Path):
    """Return (title, blocks, notes, image). blocks: list of (kind, runs);
    kind in h (bold heading), b (bullet), p (plain); runs: [(text, bold)]."""
    text = path.read_text(encoding="utf-8")
    # strip front matter
    if text.startswith("---"):
        text = text.split("---", 2)[2]
    notes = []
    for m in re.finditer(r"<!--(.*?)-->", text, re.S):
        body = m.group(1)
        if "NOTES" in body.upper():
            for line in body.splitlines():
                line = line.strip()
                if line.startswith("- "):
                    notes.append(line[2:].strip())
    text = re.sub(r"<!--.*?-->", "", text, flags=re.S)
    title, blocks, image = "", [], None
    in_table = False
    for raw in text.splitlines():
        line = raw.rstrip()
        s = line.strip()
        if not s:
            in_table = False
            continue
        if s.startswith("<") or s.startswith("</"):
            continue
        m = re.match(r"!\[[^\]]*\]\(([^)]+)\)", s)
        if m:
            if image is None:
                rel = m.group(1).split(" ")[0]
                image = (path.parent / rel).resolve()
            continue
        if s.startswith("## "):
            title = s[3:].strip()
            continue
        if s.startswith("### "):
            blocks.append(("h", [(s[4:].strip(), True)]))
            continue
        if s.startswith("|"):
            cells = [c.strip() for c in s.strip("|").split("|")]
            if all(re.fullmatch(r"-+", c) for c in cells if c):
                continue
            if not in_table:
                in_table = True
                if all(not c for c in cells):
                    continue
            cells = [strip_md(c) for c in cells if c]
            blocks.append(("b", inline_runs(" : ".join(cells))))
            continue
        if s.startswith("- "):
            blocks.append(("b", inline_runs(s[2:].strip())))
            continue
        if re.fullmatch(r"\*\*[^*]+\*\*:?", s):
            blocks.append(("h", [(s.strip("*:").strip() + (":" if s.endswith(":") else ""), True)]))
            continue
        if re.fullmatch(r"\*[^*].*[^*]\*", s):
            blocks.append(("p", inline_runs(s[1:-1])))
            continue
        blocks.append(("p", inline_runs(s)))
    return title, blocks, notes, image


def strip_md(s: str) -> str:
    return s.replace("**", "").replace("`", "")


def inline_runs(s: str):
    s = s.replace("`", "")
    parts = s.split("**")
    runs = []
    for i, part in enumerate(parts):
        if part:
            runs.append((part, i % 2 == 1))
    return runs or [("", False)]


# ─────────────────────────────── XML helpers ────────────────────────────────
def shapes_by_name(slide):
    return {sh.name: sh for sh in slide.shapes}


def para_template(shape, kind):
    """Pick a paragraph of the template shape by kind: h = bold, b = buChar, p = plain."""
    for para in shape.text_frame.paragraphs:
        xml = para._p
        has_bu = xml.find(".//a:buChar", NS) is not None
        runs = xml.findall("a:r", NS)
        bold = bool(runs) and runs[0].find("a:rPr", NS) is not None and runs[0].find("a:rPr", NS).get("b") == "1"
        if kind == "b" and has_bu:
            return para._p
        if kind == "h" and bold and not has_bu:
            return para._p
        if kind == "p" and not bold and not has_bu and runs:
            return para._p
    # fallback: first paragraph
    return shape.text_frame.paragraphs[0]._p


def build_para(tpl_p, runs):
    p = copy.deepcopy(tpl_p)
    r_tpl = p.find("a:r", NS)
    for r in p.findall("a:r", NS):
        p.remove(r)
    for br in p.findall("a:br", NS):
        p.remove(br)
    end = p.find("a:endParaRPr", NS)
    for text, bold in runs:
        r = copy.deepcopy(r_tpl)
        rpr = r.find("a:rPr", NS)
        if rpr is not None:
            if bold:
                rpr.set("b", "1")
            elif "b" in rpr.attrib:
                del rpr.attrib["b"]
            for k in ("err", "dirty"):
                if k in rpr.attrib:
                    del rpr.attrib[k]
        r.find("a:t", NS).text = text
        if end is not None:
            end.addprevious(r)
        else:
            p.append(r)
    return p


def fill_body(shape, blocks, tpl_shape=None):
    """Replace the paragraphs of `shape` with `blocks`, styled from `tpl_shape`."""
    tpl_shape = tpl_shape or shape
    tpls = {k: para_template(tpl_shape, k) for k in ("h", "b", "p")}
    tx = shape.text_frame._txBody
    for p in tx.findall("a:p", NS):
        tx.remove(p)
    for kind, runs in blocks:
        tx.append(build_para(tpls[kind], runs))


def set_text(shape, text):
    """Keep the first run's formatting, set a single line of text."""
    paras = shape.text_frame.paragraphs
    first = paras[0]._p
    tx = shape.text_frame._txBody
    for p in tx.findall("a:p", NS)[1:]:
        tx.remove(p)
    runs = first.findall("a:r", NS)
    if not runs:
        # paragraph with only endParaRPr: build a run, styled from any run in the shape or from endParaRPr
        src_r = None
        for para in paras:
            src_r = para._p.find("a:r", NS)
            if src_r is not None:
                break
        if src_r is not None:
            r = copy.deepcopy(src_r)
        else:
            from pptx.oxml import parse_xml
            end = first.find("a:endParaRPr", NS)
            rpr = copy.deepcopy(end) if end is not None else None
            r = parse_xml('<a:r xmlns:a="%s"><a:t/></a:r>' % NS["a"])
            if rpr is not None:
                rpr.tag = "{%s}rPr" % NS["a"]
                r.insert(0, rpr)
        end = first.find("a:endParaRPr", NS)
        if end is not None:
            end.addprevious(r)
        else:
            first.append(r)
        runs = [r]
    runs[0].find("a:t", NS).text = text
    for r in runs[1:]:
        first.remove(r)


def set_lines(shape, lines):
    """Multi-line text where every line reuses the first paragraph's style."""
    first = shape.text_frame.paragraphs[0]._p
    tx = shape.text_frame._txBody
    for p in tx.findall("a:p", NS):
        tx.remove(p)
    for line in lines:
        tx.append(build_para(first, [(line, False)]))


def set_cell(cell, text):
    set_text(cell, text) if hasattr(cell, "text_frame") else None


def set_notes(slide, notes):
    if not notes:
        return
    text = "NOTES POUR LE PRÉSENTATEUR :\n" + "\n".join("- " + n for n in notes)
    ns = slide.notes_slide
    tf = ns.notes_text_frame
    if tf is None:
        from pptx.oxml import parse_xml
        sp = parse_xml(
            '<p:sp xmlns:p="%s" xmlns:a="%s"><p:nvSpPr><p:cNvPr id="3" name="Notes Placeholder"/>'
            '<p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="body" idx="1"/></p:nvPr></p:nvSpPr>'
            '<p:spPr/><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:endParaRPr lang="fr-FR"/></a:p></p:txBody></p:sp>'
            % (NS["p"], NS["a"]))
        ns.shapes._spTree.append(sp)
        tf = ns.notes_text_frame
    tf.text = text


# ─────────────────────────────── slide helpers ──────────────────────────────
def clone_slide(prs, src):
    """Clone a slide: shapes are deep-copied; every r:embed / r:link in the copied
    XML is re-pointed at a relationship of the new slide part (images, SVG blips)."""
    new = prs.slides.add_slide(src.slide_layout)
    for ph in list(new.placeholders):
        ph._element.getparent().remove(ph._element)
    R_EMBED = "{%s}embed" % NS["r"]
    R_LINK = "{%s}link" % NS["r"]
    for sh in src.shapes:
        el = copy.deepcopy(sh._element)
        for node in el.iter():
            for attr in (R_EMBED, R_LINK):
                rid = node.get(attr)
                if not rid:
                    continue
                rel = src.part.rels[rid]
                if rel.is_external:
                    new_rid = new.part.rels.get_or_add_ext_rel(rel.reltype, rel.target_ref)
                else:
                    new_rid = new.part.rels.get_or_add(rel.reltype, rel.target_part)
                node.set(attr, new_rid)
        new.shapes._spTree.append(el)
    return new


def delete_slide(prs, slide):
    sldIdLst = prs.slides._sldIdLst
    for sldId in list(sldIdLst):
        if prs.slides.part.related_part(sldId.rId) is slide.part:  # pragma: no cover
            pass
    rId = None
    for sldId in list(sldIdLst):
        if prs.part.related_part(sldId.rId) is slide.part:
            rId = sldId.rId
            sldIdLst.remove(sldId)
            break
    if rId:
        prs.part.drop_rel(rId)


def reorder(prs, ordered_slides):
    sldIdLst = prs.slides._sldIdLst
    by_part = {}
    for sldId in list(sldIdLst):
        by_part[prs.part.related_part(sldId.rId).partname] = sldId
    for sldId in list(sldIdLst):
        sldIdLst.remove(sldId)
    for s in ordered_slides:
        sldIdLst.append(by_part[s.part.partname])


_TMP = REPO / "decks" / "_tmp_tchad"


def add_pic(slide, path, left, top, width=None, height=None):
    path = Path(path)
    if path.suffix.lower() == ".svg":
        import cairosvg
        _TMP.mkdir(exist_ok=True)
        png = _TMP / (path.stem + ".png")
        if not png.exists():
            cairosvg.svg2png(url=str(path), write_to=str(png), output_width=2000)
        path = png
    return slide.shapes.add_picture(str(path), Inches(left), Inches(top),
                                    Inches(width) if width else None, Inches(height) if height else None)


def find_tag(slide):
    for sh in slide.shapes:
        if sh.has_text_frame and abs(sh.top - Inches(0.28)) < Inches(0.05) and abs(sh.left - Inches(0.5)) < Inches(0.05):
            return sh
    return None


# ─────────────────────────────── main ───────────────────────────────────────
def main():
    prs = Presentation(str(SRC))
    S = {i + 1: s for i, s in enumerate(prs.slides)}  # original 1-based index

    T_content = S[29]   # title + body + section tag + footer
    T_activity = S[34]  # title + icon + body
    T_section = S[23]   # full-bleed image + title
    body_content = shapes_by_name(T_content)["Text 2"]
    body_activity = shapes_by_name(T_activity)["Text 2"]

    # ---------- new slides ----------
    def new_content(md: Path | None = None, *, title=None, blocks=None, image=None, tag="", notes=None,
                    img_box=(7.05, 1.62, 5.8, None)):
        s = clone_slide(prs, T_content)
        sh = shapes_by_name(s)
        if md:
            t, b, n, img = parse_md(md)
            title = title or t
            blocks = blocks or b
            notes = notes or n
            image = image or img
        set_text(sh["Text 1"], title)
        if image and Path(image).exists():
            body = sh["Text 2"]
            body.width = Inches(6.1)
            fill_body(body, blocks, body_content)
            left, top, w, h = img_box
            pic = add_pic(s, image, left, top, w, h)
            # keep inside the content area
            if pic.height > Inches(5.3):
                ratio = Inches(5.3) / pic.height
                pic.height = Inches(5.3)
                pic.width = int(pic.width * ratio)
        else:
            fill_body(sh["Text 2"], blocks, body_content)
        set_text(sh["Text 3"], tag)
        set_notes(s, notes)
        return s

    def new_activity(md: Path, tag=""):
        s = clone_slide(prs, T_activity)
        sh = shapes_by_name(s)
        t, b, n, _ = parse_md(md)
        set_text(sh["Text 1"], t)
        fill_body(sh["Text 2"], b, body_activity)
        set_text(sh["Text 3"], tag)
        set_notes(s, n)
        return s

    def new_section(title):
        s = clone_slide(prs, T_section)
        set_text(shapes_by_name(s)["Text 0"], title)
        return s

    def title_and_body(s):
        texts = [x for x in s.shapes if x.has_text_frame and x.text_frame.text.strip()]
        body = max(texts, key=lambda x: x.height)
        cands = [x for x in texts if x is not body and x.top < Inches(1.2) and x.height >= Inches(0.5) and x.width > Inches(5)]
        title = cands[0] if cands else None
        return title, body

    def rewrite(idx, md: Path, tag=None, is_activity=False, title=None):
        s = S[idx]
        t, b, n, _ = parse_md(md)
        title_shape, body = title_and_body(s)
        if title_shape is not None:
            set_text(title_shape, title or t)
        fill_body(body, b, body_activity if is_activity else body_content)
        tag_shape = find_tag(s)
        if tag is not None and tag_shape is not None:
            set_text(tag_shape, tag)
        set_notes(s, n)
        return s

    TAG_PRISE = "PRISE EN MAIN DE LA PLATEFORME FASTR"
    TAG_EXPLORE = "EXPLORER : PREMIÈRE LECTURE DES RÉSULTATS"
    TAG_METH = "MÉTHODES FASTR ET RÉSULTATS ANALYTIQUES"
    TAG_INTERP = "INTERPRÉTATION DES VISUALISATIONS"
    TAG_VIZ = "PRODUITS : VISUALISATIONS ET INTERPRÉTATIONS"
    TAG_DECK = "CRÉER ET STRUCTURER DES RAPPORTS ET PRÉSENTATIONS FASTR"

    # ---------- edits to kept slides ----------
    # Cover
    sh = shapes_by_name(S[1])
    set_text(sh["Text 0"], "Atelier de formation à la plateforme FASTR")
    set_text(sh["Text 1"], "Institutionnalisation de FASTR au Tchad")
    set_text(sh["Text 2"], "18-19 novembre 2026 · Centre Jardi de Bakara")

    # Agenda
    sh = shapes_by_name(S[3])
    day1 = [("09:00-09:30", "Remarques d'ouverture"),
            ("09:30-09:45", "Ordre du jour et objectifs"),
            ("09:45-10:30", "Aperçu de l'approche FASTR"),
            ("10:30-11:00", "Pause café"),
            ("11:00-12:30", "Méthodes FASTR et résultats analytiques"),
            ("12:30-14:00", "Pause déjeuner"),
            ("14:00-15:30", "Prise en main de la plateforme : connexion, Produits, paquets et portées"),
            ("15:30-15:45", "Pause café"),
            ("15:45-16:45", "Explorer : première lecture des résultats du Tchad"),
            ("16:45-17:00", "Fin du Jour 1")]
    day2 = [("08:30-09:00", "Récapitulatif de mercredi"),
            ("09:00-10:30", "Interprétation des visualisations"),
            ("10:30-11:00", "Pause café"),
            ("11:00-12:30", "Techniques de prompting avec l'assistant IA FASTR"),
            ("12:30-14:00", "Pause déjeuner"),
            ("14:00-15:30", "Produits : visualisations et interprétations"),
            ("15:30-15:45", "Pause café"),
            ("15:45-16:45", "Produits : présentations et rapports"),
            ("16:45-17:00", "Où obtenir de l'aide et fin du Jour 2")]
    for tbl_name, rows in (("Table 0", day1), ("Table Jour 2", day2)):
        tbl = sh[tbl_name].table
        assert len(tbl.rows) == len(rows) + 1, (tbl_name, len(tbl.rows), len(rows))
        for r, (h, t) in zip(list(tbl.rows)[1:], rows):
            set_text(r.cells[0], h)
            set_text(r.cells[1], t)
    heads = [x for x in S[3].shapes if x.name == "Text 1"]
    set_lines(heads[0], ["Atelier de formation à la plateforme FASTR", "Mercredi 18/11"])
    set_lines(heads[1], ["Atelier de formation à la plateforme FASTR", "Jeudi 19/11"])

    # Objectives
    sh = shapes_by_name(S[4])
    set_text(sh["Text 1"], "Objectifs de l'atelier")
    set_lines(sh["Text 2"], [
        "Comprendre les bases du FASTR : les méthodes et ce qu'elles produisent",
        "Lire les résultats du Tchad dans Explorer",
        "Construire des visualisations et les interpréter",
        "Créer des présentations et des rapports à partir de vos résultats",
        "Savoir où obtenir de l'aide au Tchad et auprès de l'équipe FASTR"])

    # How FASTR analyses your data (2.x module set)
    s14 = S[14]
    texts = [x for x in s14.shapes if x.has_text_frame and x.text_frame.text.strip() and x.top > Inches(1)]
    intro = max(texts, key=lambda x: x.width * x.height) if texts else None
    if intro is not None:
        fill_body(intro, [
            ("p", [("FASTR calcule ses modules ", False), ("dans l'ordre", True), (", dans un ", False), ("paquet de résultats", True), (" que tous les produits lisent. Un administrateur génère le paquet ; vous lisez les résultats dans Explorer et dans vos produits.", False)]),
        ], intro)
    # (module labels are shown in French on the Chad instance, 2.13.3)
    tbls = [x for x in s14.shapes if x.has_table]
    if tbls:
        tbl = tbls[0].table
        rows_xml = tbl._tbl.findall("a:tr", NS)
        # one more row (5 module rows + header)
        while len(rows_xml) < 6:
            tbl._tbl.append(copy.deepcopy(rows_xml[-1]))
            rows_xml = tbl._tbl.findall("a:tr", NS)
        data = [("Module", "", "Ce qu'il fait", "Pourquoi"),
                ("", "Utilisation des services", "Volumes mensuels et indicateurs calculés, par zone", "La base : ce que les établissements ont rapporté"),
                ("", "Évaluation de la qualité des données", "Repère rapports manquants, valeurs extrêmes, incohérences", "On n'analyse pas des données peu fiables"),
                ("", "Ajustements de la qualité des données", "Remplace les valeurs extrêmes, comble les mois manquants", "Des données propres pour des résultats fiables"),
                ("", "Détection des perturbations", "Compare l'observé à l'attendu, par établissement (bayésien)", "Savoir où et quand les services ont changé"),
                ("", "Dénominateurs de couverture, Estimations de couverture", "Estime les populations cibles, puis le % couvert", "Des chiffres bruts aux indicateurs qui guident l'action")]
        ncols = len(tbl.columns)
        data = [row[-ncols:] if ncols < 4 else row for row in data]
        for r, vals in zip(list(tbl.rows), data):
            for c, v in zip(r.cells, vals):
                set_text(c, v)
        # table may grow: keep it inside the slide
        if tbls[0].top + tbls[0].height > Inches(6.9):
            tbls[0].top = Inches(6.9) - tbls[0].height

    # Prise en main intro (24)
    sh = shapes_by_name(S[24])
    fill_body(sh["Google Shape;541;p26"], [
        ("p", [("Maintenant que vous savez ce que FASTR calcule, vous allez pratiquer sur l'instance du Tchad.", False)]),
        ("h", [("Vous allez :", True)]),
        ("b", [("Vous connecter à l'instance pays FASTR : " + URL, False)]),
        ("b", [("Vous repérer sur l'écran d'accueil : la page ", False), ("Produits", True), (", la navigation latérale, le bouton IA", False)]),
        ("b", [("Comprendre d'où viennent les chiffres : le paquet de résultats et la portée de chaque produit", False)]),
        ("b", [("Créer un dossier à votre nom, puis lire les résultats du Tchad dans ", False), ("Explorer", True)]),
    ], body_content)

    # Sign-up slides (25, 26): URL text + Chad captures when available
    for idx, shot in ((25, TCHAD_SHOTS / "00_sign_in.png"), (26, TCHAD_SHOTS / "01_sign_up.png")):
        s = S[idx]
        for x in s.shapes:
            if x.has_text_frame:
                for para in x.text_frame.paragraphs:
                    for r in para.runs:
                        r.text = (r.text.replace("mauritanie.fastr-analytics.org", "tchad.fastr-analytics.org")
                                  .replace("FASTR Mauritanie 2026", "FASTR Tchad 2026"))
        if shot.exists():
            pics = [x for x in s.shapes if x.shape_type == 13]
            if pics:
                old = pics[0]
                left, top, width, height = old.left, old.top, old.width, old.height
                old._element.getparent().remove(old._element)
                pic = s.shapes.add_picture(str(shot), left, top, width=width)
                # send to back so the text overlays stay on top
                tree = s.shapes._spTree
                tree.remove(pic._element)
                tree.insert(2, pic._element)

    # Roles → users, permissions and access (2.x)
    rewrite(28, FR / "m3_fastr_analytics_platform" / "m3_2b_accessing_platform_continued.md", tag=TAG_PRISE)
    # Where a product's numbers come from
    rewrite(29, FR / "m9b_getting_started" / "m9b_2_results_packages_concept.md", tag=TAG_PRISE)
    # Login + folder activity
    rewrite(33, FR / "m9b_getting_started" / "m9b_1_login_folder_activity.md", tag=TAG_PRISE, is_activity=True)
    # Visualizations and interpretation activities
    rewrite(34, FR / "m9c_visualizations_interpretation" / "m9c_1_creating_visualizations_manually.md", tag=TAG_VIZ, is_activity=True)
    rewrite(35, FR / "m9c_visualizations_interpretation" / "m9c_2_creating_visualizations_ai.md", tag=TAG_VIZ, is_activity=True)
    rewrite(36, FR / "m9c_visualizations_interpretation" / "m9c_3_interpreting_visualizations.md", tag=TAG_INTERP, is_activity=True)
    rewrite(37, FR / "m9c_visualizations_interpretation" / "m9c_3b_interpreting_activity.md", tag=TAG_VIZ, is_activity=True)
    rewrite(38, FR / "m9c_visualizations_interpretation" / "m9c_4_interpreting_with_ai.md", tag=TAG_VIZ, is_activity=True)
    # Deck activities
    rewrite(41, FR / "m9d_slide_decks" / "m9d_1_creating_slide_decks.md", tag=TAG_DECK, is_activity=True)
    rewrite(42, FR / "m9d_slide_decks" / "m9d_1b_adding_viz_manually.md", tag=TAG_DECK, is_activity=True)
    rewrite(43, FR / "m9d_slide_decks" / "m9d_1c_adding_viz_ai.md", tag=TAG_DECK, is_activity=True)
    rewrite(44, FR / "m9d_slide_decks" / "m9d_2_editing_formatting_slides.md", tag=TAG_DECK, is_activity=True)
    rewrite(60, FR / "m9d_slide_decks" / "m9d_2b_open_slide_editor.md", tag=TAG_DECK, is_activity=True)
    rewrite(61, FR / "m9d_slide_decks" / "m9d_3_formatting_text.md", tag=TAG_DECK, is_activity=True)
    rewrite(63, FR / "m9d_slide_decks" / "m9d_3a_formatting_report_settings.md", tag=TAG_DECK, is_activity=True)

    # ---------- prescriptive tasks on every activity slide ----------
    def B(*parts):
        """bullet from (text, bold) pairs or plain strings"""
        return ("p", [(x, False) if isinstance(x, str) else x for x in parts])

    def tasks(slide, duration, items, result, fmt="individuel"):
        _, body = title_and_body(slide)
        blocks = [("h", [(f"À faire · {duration} · {fmt}", True)])] + items + [("h", [("Résultat attendu", True)]), ("p", [(result, False)])]
        fill_body(body, blocks, body_activity)
        for para in body.text_frame.paragraphs:
            for r in para.runs:
                r.font.size = Pt(17)
        body.top = Inches(1.75)
        body.height = Inches(5.2)
        body.width = Inches(11.5)
        for x in slide.shapes:
            if x.shape_type == 13 and x.width <= Inches(1.1):
                x.top = Inches(1.0 + 0.0)
                x.left = Inches(11.6)

    tasks(S[33], "20 min", [
        B("1. Ouvrez ", ("https://tchad.fastr-analytics.org/", True), ". Nouveau compte : ", ("S'inscrire", True), " (prénom, nom, e-mail, mot de passe), puis attendez l'approbation. Compte existant : ", ("S'identifier", True), "."),
        B("2. Dépliez la navigation latérale (flèche en bas). Ouvrez ", ("Explorer", True), ", puis revenez à ", ("Produits", True), "."),
        B("3. Dans le dossier de l'atelier indiqué par le facilitateur : ", ("Nouveau → Nouveau dossier", True), ", votre prénom et votre nom, une couleur, ", ("Sauvegarder", True), "."),
        B("4. Ouvrez le menu ⋮ de votre dossier et lisez ses options, sans rien changer."),
    ], "Vous êtes connecté et un dossier à votre nom apparaît dans la liste.")

    tasks(S[34], "25 min", [
        B("1. Dans votre dossier : ", ("Nouveau → Nouvelle visualisation", True), " → paquet épinglé, portée ", ("Toutes les données", True), " → ", ("Suivant", True), "."),
        B("2. Module ", ("Utilisation des services", True), " → métrique ", ("Valeur de l'indicateur", True), " → ", ("Suivant", True), " → préréglage ", ("Valeurs des indicateurs dans le temps (mensuel)", True), " → ", ("Insérer", True), "."),
        B("3. Onglet ", ("Données", True), " → ", ("Filtre (sous-ensemble)", True), " → Indicateur : cochez ", ("CPN 1", True), " seulement. Cliquez le titre : « CPN 1, Tchad, par mois »."),
        B("4. ", ("Affichage (désagréger)", True), " → ", ("Zone administrative 2", True), " : une courbe par province. Puis Filtre → Zone administrative 2 : ", ("NDJAMENA", True), " et ", ("LOGONE OCCIDENTAL", True), "."),
        B("5. Page Produits → ⋮ → ", ("Dupliquer", True), ". Dans la copie : Filtre → Indicateur = ", ("Penta 3", True), ", titre « Penta 3, Tchad, par mois »."),
        B("6. Troisième visualisation : module ", ("Détection des perturbations", True), " → ", ("Détection bayésienne, observé vs attendu avec IC à 95 %", True), " → niveau ", ("National", True), " → préréglage ", ("Graphique des perturbations par indicateur", True), " → Insérer → Filtre → Indicateur = CPN 1."),
    ], "Trois visualisations dans votre dossier : CPN 1 (deux provinces), Penta 3, et la perturbation CPN 1 avec sa bande à 95 %.")

    tasks(S[35], "15 min", [
        B("1. Dans votre dossier : ", ("Nouveau → Nouvelle visualisation", True), " → Suivant → module Utilisation des services → Valeur de l'indicateur → Suivant → ", ("Personnalisé", True), " → Insérer. Ouvrez le bouton ", ("IA", True), " en bas à droite."),
        B("2. Tapez : « Montre-moi ", ("Accouchement dans la FOSA", True), " par mois sur les 24 derniers mois, au niveau national, en courbe »."),
        B("3. Vérifiez à l'écran : l'indicateur, la période, le type de graphique. Puis tapez : « Compare ", ("NDJAMENA", True), " et ", ("OUADDAÏ", True), " sur le même graphique »."),
        B("4. Tapez : « Donne un titre au graphique ». Si un élément est faux, dites-le dans la conversation ; ", ("Historique → Restaurer", True), " revient en arrière."),
    ], "Une visualisation construite par l'IA, vérifiée point par point, dans votre dossier.")

    tasks(S[36], "10 min", [
        B("1. Regardez le graphique projeté (CPN 1 par province, 24 mois)."),
        B("2. En binôme, répondez par écrit aux six questions : quel indicateur ? quel niveau et quelle période ? qu'est-ce qui est comparé ? quelles valeurs ? qu'est-ce qui ressort ? et alors ?"),
        B("3. Une phrase par question. Un binôme lit ses six phrases à la salle."),
    ], "Six phrases sur papier, dont la dernière nomme une personne ou une action.", fmt="binômes")

    tasks(S[37], "20 min", [
        B("1. Ouvrez votre visualisation ", ("CPN 1 par province", True), "."),
        B("2. Écrivez un ", ("titre-message", True), " de 12 mots maximum : ce que le graphique montre, pas son sujet."),
        B("3. Écrivez ", ("« Ce que je vois »", True), " : deux phrases factuelles avec des chiffres lus sur le graphique."),
        B("4. Écrivez ", ("« Ce que cela signifie »", True), " : une phrase qui nomme qui doit agir (le district, le programme, la DPSIS) et quoi."),
        B("5. Échangez avec votre voisin : il vérifie chaque chiffre contre le graphique."),
    ], "Trois blocs de texte, vérifiés par un collègue, prêts pour une diapositive.")

    tasks(S[38], "15 min", [
        B("1. Dans la même visualisation, bouton ", ("IA", True), " : « Rédige une interprétation en trois parties, titre, ce que l'on voit, ce que cela signifie, pour un directeur de programme »."),
        B("2. Vérifiez chaque chiffre du texte contre le graphique. Une affirmation fausse ? Dites-le à l'IA."),
        B("3. Demandez : « Plus simple, 60 mots ». Ajoutez le contexte que l'IA ignore : rupture de stock, grève, campagne, zone inaccessible."),
        B("4. Comparez avec votre version écrite à la main : laquelle garderiez-vous, et pourquoi ?"),
    ], "Une interprétation de l'IA vérifiée phrase par phrase, avec votre contexte ajouté.")

    tasks(S[41], "15 min", [
        B("1. Dans votre dossier : ", ("Nouveau → Nouvelle présentation", True), ". Nom : « Revue des services, <votre province> ». Paquet épinglé, Toutes les données, ", ("Créer", True), "."),
        B("2. Choisissez un thème et cliquez ", ("Appliquer le thème", True), "."),
        B("3. ", ("Ajouter une diapositive → Contenu", True), "."),
        B("4. Sur la couverture, écrivez le titre « Suivi des services de santé, Tchad, novembre 2026 » et votre nom."),
    ], "Une présentation dans votre dossier : une couverture remplie et une diapositive de contenu vide.")

    tasks(S[42], "15 min", [
        B("1. Cliquez dans le bloc de la diapositive de contenu. Type : ", ("Visualisation", True), "."),
        B("2. ", ("Insérer une visualisation → Visualisation existante…", True), " → votre « CPN 1 par province » → ", ("Insérer une copie", True), "."),
        B("3. ", ("Mise en page → Ajouter", True), " : un bloc de texte à droite. Collez-y vos trois blocs d'interprétation."),
        B("4. Le titre de la diapositive est votre titre-message, pas « CPN 1 »."),
    ], "Une diapositive avec votre graphique à gauche et votre message à droite.")

    tasks(S[43], "10 min", [
        B("1. Panneau ", ("IA", True), " de la présentation : « Ajoute une diapositive de contenu avec ma visualisation ", ("Penta 3", True), " et deux puces d'interprétation »."),
        B("2. Vérifiez : bon graphique ? chiffres exacts ? Puis : « Remplace la deuxième puce par une recommandation pour le programme de vaccination »."),
        B("3. Déplacez la nouvelle diapositive après celle de la CPN 1 en glissant sa vignette."),
    ], "Une deuxième diapositive de contenu, ajoutée par l'IA et corrigée par vous.")

    tasks(S[44], "20 min", [
        B("1. Sur chaque diapositive, relisez les chiffres du texte contre le graphique."),
        B("2. Un graphique à l'étroit ? ", ("Mise en page → Modifier la visualisation", True), " ou déplacez le séparateur. Ne rétrécissez pas le texte."),
        B("3. ", ("Insérer", True), " : ajoutez l'en-tête, la date et le pied de page à la diapositive courante."),
        B("4. Supprimez toute diapositive vide ; réordonnez en glissant les vignettes."),
        B("5. ", ("Présenter", True), " : parcourez vos trois diapositives en plein écran, comme devant le directeur."),
    ], "Trois diapositives (couverture, CPN 1, Penta 3) que vous pourriez projeter sans vous excuser.")

    tasks(S[61], "10 min", [
        B("1. Dans le bloc texte de la diapositive CPN 1 : mettez le chiffre clé en ", ("gras", True), "."),
        B("2. Transformez « Ce que je vois » en une liste de trois puces."),
        B("3. Ajoutez un sous-titre « Ce que cela signifie » au-dessus de la dernière phrase."),
        B("4. La référence rapide est sur la diapositive suivante."),
    ], "Un texte de diapositive lisible en dix secondes : un chiffre en gras, trois puces, un sous-titre.")

    tasks(S[63], "15 min", [
        B("1. Menu ", ("Présentation → Logos", True), " : ajoutez le logo du ministère s'il est dans Ressources. ", ("Pied de page", True), " : « DPSIS · Tchad · novembre 2026 », numéros de page activés."),
        B("2. ", ("Fichier → Nom et dossier…", True), " : vérifiez que la présentation est dans votre dossier."),
        B("3. ", ("Fichier → Gérer l'accès…", True), " : accès général « Tout le monde dans l'instance peut consulter »."),
        B("4. ", ("Fichier → Télécharger…", True), " : récupérez le fichier et ouvrez-le."),
    ], "Un fichier téléchargé, avec logo et pied de page, visible par toute l'instance.")

    # Section titles
    def section_title(slide, text):
        for x in slide.shapes:
            if x.has_text_frame and x.text_frame.text.strip():
                set_text(x, text)
                return
    section_title(S[7], "Aperçu de l'approche FASTR")
    section_title(S[13], "Méthodes FASTR et résultats analytiques")
    title_and_body(S[15])[0] and set_text(title_and_body(S[15])[0], "Évaluation de la qualité des données : que vérifie FASTR ?")
    title_and_body(S[17])[0] and set_text(title_and_body(S[17])[0], "Ajustements de la qualité des données : comment FASTR corrige")
    section_title(S[54], "Interprétation des visualisations")
    section_title(S[32], "Produits : visualisations et interprétations")

    # Contacts (65)
    sh = shapes_by_name(S[65])
    set_text(sh["Text 1"], "Vos contacts FASTR")
    sh["TextBox 8"].width = Inches(11.2)
    set_lines(sh["TextBox 8"], [
        "Équipe FASTR",
        "Amal Tucker Brown, spécialiste résultats",
        "Claire Boulange, experte technique FASTR (assistance technique, formation)",
        "fastr@usefuldata.com.au",
        "Points focaux DPSIS : à compléter"])

    # ---------- new slides ----------
    home_shot = TCHAD_SHOTS / "01_home_products.png"
    if not home_shot.exists():
        home_shot = SHOT / "platform_v2_fr" / "01_home_products.png"
    n_home = new_content(title="L'écran d'accueil : une seule page Produits", tag=TAG_PRISE, image=home_shot, blocks=[
        ("p", [("Pensez à un ", False), ("Google Drive partagé", True), (" par tout le pays : des dossiers, des fichiers dedans, et un réglage de partage par fichier.", False)]),
        ("b", [("Les fichiers", True), (" sont les ", False), ("produits", True), (" : visualisations, présentations, rapports. Chaque ligne indique son paquet de résultats et sa portée.", False)]),
        ("b", [("Les dossiers", True), (" rangent les produits : un dossier par personne, dans le dossier de l'atelier.", False)]),
        ("b", [("Gérer l'accès", True), (" sur un produit ou un dossier dit qui peut l'ouvrir ou le modifier.", False)]),
        ("h", [("Navigation latérale :", True)]),
        ("b", [("Produits", True), (" : là où vous travaillez · ", False), ("Explorer", True), (" : regarder sans rien créer · ", False), ("Résultats", True), (" et ", False), ("Portées", True), (" : d'où viennent les chiffres · ", False), ("Données, Ressources, Utilisateurs", True), (" : administration", False)]),
    ], notes=["Montrez-le en direct ; la capture est le plan B. L'analogie Google Drive tient jusqu'au bout : fichiers = produits, dossiers = dossiers, partage = Gérer l'accès. Une différence : chaque fichier lit un paquet de résultats et une portée.",
              "Depuis la version 2, plus de projets ni de tableaux de bord : une seule liste pour tout le pays.",
              "Le bouton IA (en bas à droite) fonctionne dans un produit ouvert, pas sur cette page."])
    n_scope = new_content(FR / "m9b_getting_started" / "m9b_2a_scope_concept.md", tag=TAG_PRISE,
                          image=SHOT / "platform_v2_fr" / "14_scopes.png")
    n_sec_explore = new_section("Explorer : première lecture des résultats du Tchad")
    explore_shot = TCHAD_SHOTS / "13_explore.png"
    if not explore_shot.exists():
        explore_shot = SHOT / "platform_v2_fr" / "13_explore.png"
    n_ex1 = new_content(title="Explorer : regarder avant de construire", tag=TAG_EXPLORE, image=explore_shot, blocks=[
        ("p", [("Explorer montre toutes les analyses déjà calculées dans un paquet de résultats, sans rien créer et sans rien enregistrer.", False)]),
        ("h", [("Quatre contrôles en haut :", True)]),
        ("b", [("HMIS / FOSA", True), (" : la famille de données", False)]),
        ("b", [("Paquet de résultats", True), (" (en haut à droite) : celui qui est épinglé est sélectionné", False)]),
        ("b", [("Portée", True), (" : ", False), ("Toutes les données", True), (", c'est tout le pays", False)]),
        ("b", [("Module", True), (" et ", False), ("métrique", True), (" (à gauche) : s'ouvre sur ", False), ("Utilisation des services → Volumes de services", True)]),
    ], notes=["~3 min. L'idée : avant de construire un graphique, on peut voir ce que disent les données.",
              "Nommez les quatre contrôles à l'écran, dans cet ordre ; l'activité demande aux participants de les retrouver.",
              "Changez un filtre et la page se rafraîchit ; personne d'autre ne le voit, rien n'est conservé. « Rien ne peut casser » rassure les débutants."])
    n_ex2 = new_content(FR / "m9b_getting_started" / "m9b_2e_explore_views.md", tag=TAG_EXPLORE,
                        image=SHOT / "platform_v2_fr" / "13b_explore_over_time.png")
    n_ex3 = new_content(title="Chaque module apporte ses propres métriques", tag=TAG_EXPLORE,
                        image=SHOT / "platform_v2_fr" / "13e_explore_coverage_table.png", blocks=[
        ("p", [("Le menu ", False), ("module", True), (" a deux groupes :", False)]),
        ("b", [("Résultats principaux", True), (" : Utilisation des services (les volumes)", False)]),
        ("b", [("Analyses complémentaires", True), (" : Évaluation de la qualité des données, Ajustements de la qualité des données, Détection des perturbations, Dénominateurs de couverture, Estimations de couverture", False)]),
        ("p", [("Chaque module change les métriques et la vue. ", False), ("Estimations de couverture → Couverture dans le temps", True), (" : un graphique par indicateur, gris pour les données de routine, noir pour les enquêtes, rouge pour la projection. ", False), ("Détection des perturbations → Services observés et attendus", True), (" : la bande à 95 % et les mois qui en sortent.", False)]),
    ], notes=["Ouvrez le menu des modules à l'écran et lisez les deux groupes.",
              "Les couleurs du graphique de couverture sont celles des diapositives de méthodologie : gris HMIS, noir enquête, rouge projection.",
              "N'expliquez pas les méthodes ici ; elles ont été vues le matin."])
    n_ex4 = new_content(FR / "m9b_getting_started" / "m9b_2g_explore_vs_visualization.md", tag=TAG_EXPLORE)
    n_ex_act = new_activity(FR / "m9b_getting_started" / "m9b_3_explore_activity.md", tag=TAG_EXPLORE)
    tasks(n_ex_act, "45 min", [
        B("1. Cliquez ", ("Explorer", True), ". Vérifiez en haut : HMIS, le paquet épinglé, portée Toutes les données. À gauche, commencez par le module ", ("Utilisation des services", True), " → métrique ", ("Volumes de services", True), " (c'est l'ouverture par défaut)."),
        B("2. Vue ", ("Tableau", True), " : niveau ", ("Province (AA2)", True), ", période ", ("12 derniers mois", True), ". Cliquez l'en-tête ", ("CPN 1", True), " pour trier. Notez le total ", ("National", True), " et la province la plus basse."),
        B("3. Vue ", ("Dans le temps", True), " : indicateur CPN 1, niveau National, pas ", ("Mois", True), ". Notez le mois le plus haut des 24 derniers mois."),
        B("4. Changez de module : ", ("Estimations de couverture", True), " → métrique ", ("Couverture dans le temps", True), ". Sur le panneau ", ("Penta 3", True), ", notez la dernière valeur de la courbe rouge (projection)."),
        B("5. Changez de module : ", ("Détection des perturbations", True), " → métrique ", ("Services observés et attendus", True), ", National. Sur le panneau CPN 1, comptez les mois en rouge sur les 12 derniers mois."),
        B("6. Revenez au module ", ("Utilisation des services", True), ", vue ", ("Carte", True), " : ", ("Accouchement dans la FOSA", True), ", Province, 12 derniers mois. Quelle province est la plus claire ? Si la carte ne s'affiche pas, passez."),
        B("7. Comparez vos réponses avec le binôme voisin. Écrivez ", ("une question", True), " à transformer en graphique demain."),
    ], "Cinq réponses et une question sur papier, lues à la salle au tour de table.", fmt="binômes")

    # Bayesian disruption (replaces the linear-model slides 19 and 20)
    n_b1 = new_content(FR / "m6_data_analysis" / "m6_2e_bayesian_two_questions_per_facility.md", tag=TAG_METH,
                       title="Détection des perturbations : deux questions par établissement")
    n_b2 = new_content(title="Comment le volume attendu est construit", tag=TAG_METH, blocks=[
        ("p", [("Pour chaque zone et chaque mois, le modèle additionne le volume attendu ", False), ("des seuls établissements qui ont rapporté ce mois-là", True), (", et le compare à ce que ces mêmes établissements ont réellement rapporté.", False)]),
        ("h", [("Ce qui change par rapport à l'ancienne approche", True)]),
        ("b", [("Unité modélisée", True), (" : chaque établissement, et non plus le total du district ou de la province", False)]),
        ("b", [("Rapports manquants", True), (" : modélisés comme une question à part, et non plus comblés avant l'analyse", False)]),
        ("b", [("Volume attendu", True), (" : tendance + saison + niveau propre à chaque établissement", False)]),
        ("b", [("Incertitude", True), (" : une bande de crédibilité à 95 % plutôt que des seuils fixes", False)]),
        ("b", [("Un établissement devient silencieux", True), (" : retiré des deux côtés de la comparaison, au lieu de ressembler à une baisse", False)]),
    ], notes=["La ligne clé est la dernière. Quand un établissement cesse de rapporter, l'ancien modèle voyait une baisse du total. Le nouveau retire cet établissement de l'observé et de l'attendu pour ce mois.",
              "Bande de crédibilité : la fourchette dans laquelle le modèle s'attend à voir le volume 95 fois sur 100. Hors de la bande, c'est un signal ; dedans, c'est la variation normale.",
              "La bande est plus large pour les petites zones et les indicateurs à faible volume : moins de données, moins de certitude."])
    n_b3 = new_content(FR / "m6_data_analysis" / "m6_2g_reading_bayesian_disruptions_chart.md", tag=TAG_METH)
    n_b4 = new_content(FR / "m6_data_analysis" / "m6_2h_reporting_gap_vs_service_gap.md", tag=TAG_METH)

    # ---------- order ----------
    order = [S[1], S[2], S[3], S[4],
             S[7], S[8], S[9], S[10], S[11], S[12],
             S[13], S[14], S[15], S[16], S[17], S[18], n_b1, n_b2, n_b3, n_b4, S[21], S[22],
             S[23], S[24], S[25], S[26], n_home, S[29], n_scope, S[28], S[33],
             n_sec_explore, n_ex1, n_ex2, n_ex3, n_ex4, n_ex_act,
             S[54], S[55], S[36],
             S[45], S[46], S[47], S[48], S[49], S[50], S[51], S[52], S[53],
             S[32], S[34], S[35], S[37], S[38],
             S[40], S[41], S[42], S[43], S[44], S[60], S[61], S[62], S[63],
             S[64], S[65], S[66], S[67]]
    keep = {s.part.partname for s in order}
    for idx, s in S.items():
        if s.part.partname not in keep:
            delete_slide(prs, s)
    reorder(prs, order)

    # ---------- footer + page numbers + section tags on kept slides ----------
    tag_fix = {S[36].part.partname: TAG_INTERP, S[55].part.partname: TAG_INTERP, S[62].part.partname: TAG_DECK}
    for n, s in enumerate(prs.slides, 1):
        for x in s.shapes:
            if not x.has_text_frame:
                continue
            t = x.text_frame.text.strip()
            if t == FOOTER_OLD:
                set_text(x, FOOTER_NEW)
            elif t.isdigit() and abs(x.left - Inches(11.5)) < Inches(0.1) and abs(x.top - Inches(7.1)) < Inches(0.1):
                set_text(x, str(n))
        if s.part.partname in tag_fix:
            tag = find_tag(s)
            if tag is not None:
                set_text(tag, tag_fix[s.part.partname])

    # ---------- style normalization: every content slide in the Deck Builder style ----------
    tpl = T_content
    tpl_sh = shapes_by_name(tpl)
    bar_xml = copy.deepcopy(tpl_sh["Shape 0"]._element)
    tag_xml = copy.deepcopy(tpl_sh["Text 3"]._element)
    line_xml = copy.deepcopy(tpl_sh["Shape 5"]._element)
    foot_xml = copy.deepcopy(tpl_sh["Text 6"]._element)
    num_xml = copy.deepcopy(tpl_sh["Text 7"]._element)
    title_rpr = copy.deepcopy(tpl_sh["Text 1"].text_frame.paragraphs[0].runs[0]._r.find("a:rPr", NS))
    TAG_INTRO = "ATELIER DE FORMATION À LA PLATEFORME FASTR"
    TAG_APERCU = "APERÇU DE L'APPROCHE FASTR"
    TAG_AIDE = "OÙ OBTENIR DE L'AIDE"
    TAG_PROMPT = "TECHNIQUES DE PROMPTING AVEC L'ASSISTANT IA FASTR"
    section_tags = {}
    current = TAG_INTRO
    for sl in prs.slides:
        txt = " ".join(x.text_frame.text.strip() for x in sl.shapes if x.has_text_frame and x.text_frame.text.strip())
        is_section = any(x.shape_type == 13 and x.width >= Inches(13) and x.height >= Inches(7) for x in sl.shapes) and len(txt) < 90
        if is_section:
            t = txt.lower()
            if "aperçu" in t: current = TAG_APERCU
            elif "méthodes" in t: current = TAG_METH
            elif "prise en main" in t: current = TAG_PRISE
            elif "explorer" in t: current = TAG_EXPLORE
            elif "interprétation" in t: current = TAG_INTERP
            elif "prompting" in t: current = TAG_PROMPT
            elif "produits" in t: current = TAG_VIZ
            elif "rapports" in t or "présentations" in t: current = TAG_DECK
            elif "aide" in t: current = TAG_AIDE
        section_tags[sl.part.partname] = (current, is_section)

    def is_fullbleed_special(sl):
        # sign-up screenshots and the cover keep their own layout
        return any(x.shape_type == 13 and x.width >= Inches(10.5) for x in sl.shapes)

    def fix_run_font(r, size=None, color=None, bold=None, face="Calibri"):
        rpr = r.find("a:rPr", NS)
        if rpr is None:
            rpr = etree.SubElement(r, "{%s}rPr" % NS["a"]); r.insert(0, rpr)
        for tagname in ("latin", "ea", "cs", "sym"):
            el = rpr.find("a:%s" % tagname, NS)
            if el is not None:
                el.set("typeface", face)
        if rpr.find("a:latin", NS) is None:
            lat = etree.SubElement(rpr, "{%s}latin" % NS["a"]); lat.set("typeface", face)
        if size: rpr.set("sz", str(size))
        if bold is not None:
            if bold: rpr.set("b", "1")
            elif "b" in rpr.attrib: del rpr.attrib["b"]

    for n, sl in enumerate(prs.slides, 1):
        tag_text, is_section = section_tags[sl.part.partname]
        if n == 1 or is_section or is_fullbleed_special(sl) or n == len(prs.slides):
            continue
        if sl.slide_layout.name != "DEFAULT" or sl.part.partname == S[3].part.partname:
            continue  # designed infographic slides and the agenda keep their own layout
        texts = [x for x in sl.shapes if x.has_text_frame and x.text_frame.text.strip()]
        has_tag = any(abs(x.top - Inches(0.28)) < Inches(0.06) for x in texts)
        has_foot = any(abs(x.top - Inches(7.1)) < Inches(0.1) for x in texts)
        tops = [x for x in texts if x.top < Inches(1.3) and x.height >= Inches(0.4) and x.width > Inches(4)
                and not (abs(x.top - Inches(0.28)) < Inches(0.06))]
        title = tops[0] if tops else None
        # drop Google-style thin title bars (narrow tall shapes near the top)
        for x in list(sl.shapes):
            if (not x.has_text_frame or not x.text_frame.text.strip()) and x.width <= Inches(0.12) and x.top < Inches(1.3) and x.shape_type != 13 and x.name != "Shape 0":
                x._element.getparent().remove(x._element)
        if title is not None and title.name != "Text 1":
            # Google-style title: move and restyle
            title.left, title.top, title.width, title.height = Inches(0.75), Inches(0.82), Inches(12.08), Inches(0.55)
            for para in title.text_frame.paragraphs:
                for r in para._p.findall("a:r", NS):
                    old = r.find("a:rPr", NS)
                    new_rpr = copy.deepcopy(title_rpr)
                    if old is not None:
                        r.replace(old, new_rpr)
                    else:
                        r.insert(0, new_rpr)
            bar = copy.deepcopy(bar_xml)
            sl.shapes._spTree.insert(2, bar)
            # push bodies that start above 1.45in down a little
            for x in texts:
                if x is not title and x.top < Inches(1.45) and x.height > Inches(1):
                    x.top = Inches(1.5)
        if not has_tag:
            el = copy.deepcopy(tag_xml); sl.shapes._spTree.append(el)
        # set the tag text (new or existing)
        for x in sl.shapes:
            if x.has_text_frame and abs(x.top - Inches(0.28)) < Inches(0.06) and abs(x.left - Inches(0.5)) < Inches(0.06):
                set_text(x, tag_text)
        if not has_foot:
            for el in (line_xml, foot_xml, num_xml):
                sl.shapes._spTree.append(copy.deepcopy(el))
        for x in sl.shapes:
            if not x.has_text_frame: continue
            t = x.text_frame.text.strip()
            if abs(x.top - Inches(7.1)) < Inches(0.1):
                if abs(x.left - Inches(11.5)) < Inches(0.1): set_text(x, str(n))
                else: set_text(x, FOOTER_NEW)
        # body fonts: Calibri, cap oversized text
        for x in sl.shapes:
            if not x.has_text_frame or x is title: continue
            if abs(x.top - Inches(0.28)) < Inches(0.06) or abs(x.top - Inches(7.1)) < Inches(0.1): continue
            for para in x.text_frame.paragraphs:
                for r in para._p.findall("a:r", NS):
                    rpr = r.find("a:rPr", NS)
                    sz = int(rpr.get("sz")) if rpr is not None and rpr.get("sz") else None
                    fix_run_font(r, size=(2000 if sz and sz > 2200 else None))
        if title is not None:
            for para in title.text_frame.paragraphs:
                for r in para._p.findall("a:r", NS):
                    fix_run_font(r, size=3200, bold=True)

    # ---------- keep content clear of the footer zone (7.0in and below) ----------
    LIMIT = Inches(6.9)
    for n, sl in enumerate(prs.slides, 1):
        texts = [x for x in sl.shapes if x.has_text_frame and x.text_frame.text.strip()]
        has_foot = any(abs(x.top - Inches(7.1)) < Inches(0.1) for x in texts)
        if not has_foot:
            continue
        for x in list(sl.shapes):
            if abs(x.top - Inches(7.1)) < Inches(0.1) or abs(x.top - Inches(7.04)) < Inches(0.03):
                continue
            bottom = x.top + x.height
            if bottom <= LIMIT:
                continue
            if x.shape_type == 13:  # picture: scale down to the limit, keep aspect ratio
                new_h = LIMIT - x.top
                if new_h > Inches(1):
                    ratio = new_h / x.height
                    x.height = int(new_h); x.width = int(x.width * ratio)
            elif x.has_text_frame and x.top > Inches(5.5):  # footnote-like text box: move up
                x.top = int(LIMIT - x.height)
    # prompts slide: two columns plus a closing line were overlapping in the source deck
    sh = shapes_by_name(S[52])
    for name in ("Text 3", "Text 4"):
        if name in sh:
            for para in sh[name].text_frame.paragraphs:
                for r in para.runs:
                    if r.font.size and r.font.size.pt >= 16:
                        r.font.size = Pt(14)
            sh[name].height = Inches(3.6)
    if "Text 5" in sh:
        sh["Text 5"].top = Inches(6.0); sh["Text 5"].height = Inches(0.85)
        for para in sh["Text 5"].text_frame.paragraphs:
            for r in para.runs:
                r.font.size = Pt(13)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    prs.save(str(OUT))
    print(f"Wrote {len(prs.slides)} slides -> {OUT}")


if __name__ == "__main__":
    main()
