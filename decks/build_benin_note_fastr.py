#!/usr/bin/env python3
"""Build the French technical note for the Benin MoH: what is specific about the
FASTR platform compared with the tools already used in the field.

Two pages, point by point, formal register. Companion to
decks/build_benin_intro_plateforme.py.

Usage:  python3 decks/build_benin_note_fastr.py
Output: outputs/benin_note_plateforme_fastr.docx
"""
from pathlib import Path

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "outputs" / "benin_note_plateforme_fastr.docx"
GREEN = RGBColor(0x0A, 0x54, 0x4F)
INK = RGBColor(0x1A, 0x1F, 0x1E)
GREY = RGBColor(0x66, 0x66, 0x66)


def shade(cell, hex_fill):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear"); shd.set(qn("w:color"), "auto"); shd.set(qn("w:fill"), hex_fill)
    tcPr.append(shd)


def run(p, text, bold=False, size=10, color=INK, italic=False):
    r = p.add_run(text); r.bold = bold; r.italic = italic
    r.font.size = Pt(size); r.font.color.rgb = color; r.font.name = "Calibri"
    return r


def para(doc, text="", size=10.5, bold=False, color=INK, space_after=6, align=None, italic=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(space_after); p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.line_spacing = 1.15
    if align: p.alignment = align
    if text: run(p, text, bold=bold, size=size, color=color, italic=italic)
    return p


def rich(doc, parts, space_after=6, style=None):
    """parts: list of (text, bold)."""
    p = doc.add_paragraph(style=style)
    p.paragraph_format.space_after = Pt(space_after); p.paragraph_format.line_spacing = 1.15
    for t, b in parts:
        run(p, t, bold=b)
    return p


def heading(doc, text, level=1):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10 if level == 1 else 6)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    run(p, text, bold=True, size=13 if level == 1 else 11, color=GREEN)
    return p


def point(doc, n, title, body):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(5); p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.keep_with_next = True
    run(p, f"{n}. ", bold=True, size=11, color=GREEN)
    run(p, title, bold=True, size=11, color=GREEN)
    for b in body:
        q = doc.add_paragraph(style="List Bullet")
        q.paragraph_format.space_after = Pt(2); q.paragraph_format.line_spacing = 1.15
        if isinstance(b, str):
            run(q, b)
        else:
            for t, bold in b:
                run(q, t, bold=bold)


def main():
    doc = Document()
    sec = doc.sections[0]
    sec.page_height, sec.page_width = Cm(29.7), Cm(21.0)
    sec.left_margin = sec.right_margin = Cm(2.0); sec.top_margin = Cm(1.3); sec.bottom_margin = Cm(1.3)
    st = doc.styles["Normal"]; st.font.name = "Calibri"; st.font.size = Pt(10)
    st.element.rPr.rFonts.set(qn("w:eastAsia"), "Calibri")

    # header line: logos
    hp = sec.header.paragraphs[0]
    hp.add_run().add_picture(str(REPO / "resources" / "logos" / "FASTR_Primary_01_FullName.png"), height=Cm(0.8))
    hp.add_run("      ")
    hp.add_run().add_picture(str(REPO / "resources" / "logos" / "GFF_Logo_trimmed.png"), height=Cm(0.6))
    fp = sec.footer.paragraphs[0]; fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run(fp, "Note technique · Plateforme d'analyse FASTR · Novembre 2026 · fastr-analytics.org/fr", size=8, color=GREY)

    para(doc, "NOTE TECHNIQUE", size=9, bold=True, color=GREEN, space_after=2)
    para(doc, "La plateforme d'analyse FASTR : ce qui la distingue des outils en place", size=17, bold=True, color=GREEN, space_after=4)
    para(doc, "À l'attention du ministère de la Santé du Bénin · Global Financing Facility (GFF), Banque mondiale · Novembre 2026", size=9.5, color=GREY, space_after=10)

    heading(doc, "En une phrase")
    rich(doc, [("FASTR (", False), ("Frequent Assessments and System Tools for Resilience", True),
               (") est l'approche du GFF pour l'analyse à cycle rapide des données de santé. Sa plateforme se connecte au DHIS2, vérifie et corrige la qualité des données, fait les analyses, et produit des rapports et des présentations qui se mettent à jour chaque mois. Elle ne remplace ni le DHIS2 ni les enquêtes : elle fait, à la place de l'équipe, le travail qui se situe entre les données brutes et le rapport.", False)], space_after=8)

    heading(doc, "Ce qui la distingue, point par point")

    point(doc, 1, "Connectée au DHIS2 : plus rien à télécharger à la main", [
        "La plateforme est reliée directement au DHIS2 du pays. L'importation des derniers mois se fait en un clic ou se programme, et se répète seule.",
        "Fini les exports indicateur par indicateur, les fichiers Excel qui circulent et les erreurs de copier-coller.",
    ])
    point(doc, 2, "Toutes les sources de données au même endroit", [
        "Le DHIS2, les enquêtes auprès des formations sanitaires (HFA), les enquêtes ménages et les données de population vivent dans le même espace, pour tout le pays.",
        "Les analyses les combinent : par exemple, les données de routine et la dernière enquête pour estimer la couverture, ou les volumes de services et l'enquête auprès des formations pour expliquer une baisse.",
    ])
    point(doc, 3, "La qualité des données est vérifiée et corrigée automatiquement", [
        "Avant toute analyse, la plateforme repère les rapports manquants, les valeurs aberrantes et les incohérences, puis corrige les séries. L'original reste disponible.",
        "La qualité des données cesse d'être une raison de ne pas s'en servir : elle devient un résultat que l'on suit et que l'on améliore.",
    ])
    point(doc, 4, "Une analyse des perturbations de services que l'on ne trouve nulle part ailleurs", [
        "Pour chaque service et chaque zone, la plateforme calcule ce que le volume aurait dû être, compte tenu de l'historique de chaque établissement, de la tendance et de la saison, et signale les mois où le volume réel s'en écarte : en rouge quand les services ont décroché, en vert quand ils ont dépassé l'attendu.",
        "Elle distingue une baisse due à des établissements qui n'ont pas rapporté d'une baisse réelle des services rendus. Un tableau de bord montre le volume déclaré ; FASTR dit s'il est anormal, depuis quand, de combien et où.",
    ])
    point(doc, 5, "Une estimation de la couverture alignée sur Countdown, sans dépendre des projections de population", [
        "La couverture habituelle divise les services rendus par une population cible projetée à partir du dernier recensement. Quand la projection est fausse, ce qui est fréquent entre deux recensements, la couverture l'est aussi, parfois au-delà de 100 %.",
        "FASTR estime les dénominateurs à partir des services eux-mêmes (CPN1, accouchements, naissances vivantes, Penta1), calés sur la dernière enquête nationale, selon la méthode de Countdown to 2030. La couverture est ainsi suivie chaque mois entre deux enquêtes, pour le pays et pour chaque région.",
    ])
    point(doc, 6, "Les autres analyses sont faites pour vous, de la même façon dans une trentaine de pays", [
        "Tendances des services, variations trimestrielles et annuelles, indicateurs calculés propres au pays : les calculs sont intégrés, sans code à écrire ni feuille de calcul à entretenir.",
        "Les méthodes sont les mêmes dans tous les pays partenaires et documentées publiquement. Les résultats se comparent d'un pays à l'autre et d'un trimestre à l'autre.",
    ])
    point(doc, 7, "Un travail beaucoup plus rapide : le rapport se met à jour, il ne se refait pas", [
        "Les graphiques d'un rapport ou d'une présentation restent reliés aux données. Quand un nouveau mois arrive, les figures se mettent à jour et le texte s'adapte.",
        "Ce qui prenait des jours chaque mois (exporter, nettoyer, refaire les graphiques, remettre en page) prend quelques heures, consacrées à l'interprétation plutôt qu'à la manipulation.",
    ])
    point(doc, 8, "Conçue pour produire de bons rapports et de bonnes présentations", [
        "Des modèles de présentation et de rapport prêts à l'emploi, aux couleurs et au logo du ministère, avec les graphiques de la plateforme intégrés.",
        "Un rapport de revue mensuelle, un bulletin trimestriel ou une note de plaidoyer se produisent dans la plateforme et se téléchargent ou se partagent directement.",
    ])
    point(doc, 9, "Un assistant IA intégré, qui lit vos données", [
        "L'assistant répond à des questions posées en langage courant, construit des graphiques, propose une interprétation et rédige un premier jet de rapport.",
        "Il travaille uniquement à partir des résultats calculés dans la plateforme : il n'invente aucun chiffre. L'équipe relit et garde la main.",
    ])
    point(doc, 10, "Un espace de travail collaboratif", [
        "Toute l'équipe travaille dans le même espace, organisé en dossiers, comme un disque partagé. Plusieurs personnes peuvent travailler sur la même présentation ; tout s'enregistre en continu, avec un historique des versions.",
        "Un graphique construit une fois sert à tout le monde : dans un rapport, dans une présentation, dans une revue.",
    ])
    point(doc, 11, "Une gestion des utilisateurs : chacun voit ce qu'il doit voir", [
        "Les comptes sont approuvés par l'administrateur du ministère. L'accès se règle par produit et par dossier : un rapport peut être réservé à une direction, ou ouvert à tous.",
        "Un utilisateur peut être limité à une région ou à une période : il ne voit que les données de son périmètre, partout dans la plateforme.",
    ])
    point(doc, 12, "Les données restent celles du pays", [
        "Une installation séparée par pays. Uniquement des totaux agrégés par établissement et par mois, les mêmes que dans le DHIS2 ; aucune donnée nominative.",
        "Logiciel libre, sans licence ni frais par utilisateur. Interface en français. Rien à installer : un navigateur suffit. Les données et les résultats sont exportables à tout moment.",
    ])

    heading(doc, "Ce que FASTR ne fait pas")
    for b in ["Elle ne collecte pas de données et ne remplace pas le DHIS2 : elle s'y connecte.",
              "Elle ne remplace pas les enquêtes : elle s'en sert comme référence et comble les années entre elles.",
              "Elle ne décide pas : elle dit où regarder. Le pourquoi et l'action restent au ministère."]:
        q = doc.add_paragraph(style="List Bullet"); q.paragraph_format.space_after = Pt(2); run(q, b)

    heading(doc, "Pour démarrer au Bénin")
    for b in ["Un accès en lecture au DHIS2, pour la connexion automatique.",
              "La liste des indicateurs à suivre.",
              "Un administrateur désigné au ministère, et une équipe à former sur les données du Bénin."]:
        q = doc.add_paragraph(style="List Bullet"); q.paragraph_format.space_after = Pt(2); run(q, b)
    rich(doc, [("L'équipe FASTR prépare l'instance du Bénin en français, propose une présentation avec démonstration, puis la formation et un appui à distance. Documentation : ", False), ("fastr-analytics.org/fr", True), (". Contact : fastr@usefuldata.com.au.", False)], space_after=0)

    OUT.parent.mkdir(exist_ok=True)
    doc.save(str(OUT)); print("wrote", OUT)


if __name__ == "__main__":
    main()
