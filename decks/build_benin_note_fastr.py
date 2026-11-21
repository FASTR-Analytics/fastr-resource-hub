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


def run(p, text, bold=False, size=9.5, color=INK, italic=False):
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
    st = doc.styles["Normal"]; st.font.name = "Calibri"; st.font.size = Pt(9.5)
    st.element.rPr.rFonts.set(qn("w:eastAsia"), "Calibri")

    # header line: logos
    hp = sec.header.paragraphs[0]
    hp.add_run().add_picture(str(REPO / "resources" / "logos" / "FASTR_Primary_01_FullName.png"), height=Cm(0.8))
    hp.add_run("      ")
    hp.add_run().add_picture(str(REPO / "resources" / "logos" / "GFF_Logo_trimmed.png"), height=Cm(0.6))
    fp = sec.footer.paragraphs[0]; fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run(fp, "Note technique · Plateforme d'analyse FASTR · Novembre 2026 · fastr-analytics.org/fr", size=8, color=GREY)

    para(doc, "NOTE À L'ATTENTION DU MINISTÈRE DE LA SANTÉ DU BÉNIN", size=9, bold=True, color=GREEN, space_after=2)
    para(doc, "La plateforme d'analyse FASTR : ce qu'elle fait et pourquoi elle est utile au ministère", size=16, bold=True, color=GREEN, space_after=4)
    para(doc, "Global Financing Facility (GFF) · Novembre 2026", size=9.5, color=GREY, space_after=8)

    heading(doc, "Ce que c'est")
    rich(doc, [("La plateforme d'analyse FASTR est un site web sécurisé, propre au Bénin, qui prend les données que les formations sanitaires déclarent déjà chaque mois dans le DHIS2, les analyse automatiquement, et permet à l'équipe du ministère d'en faire des graphiques, des présentations et des rapports. Il n'y a rien à installer : on s'y connecte avec un navigateur, en français. FASTR (", False), ("Frequent Assessments and System Tools for Resilience", True), (") est l'approche du GFF pour l'analyse à cycle rapide ; la plateforme en est l'outil.", False)], space_after=8)

    heading(doc, "Comment elle fonctionne, en quatre étapes")
    point(doc, 1, "Données : la plateforme se connecte au DHIS2 et récupère les derniers mois", [
        "Un administrateur du ministère relie une fois la plateforme au DHIS2 du Bénin et choisit les indicateurs à suivre (CPN1, CPN4, accouchements, Penta3, etc.). Ensuite, chaque mois, l'importation des nouvelles données se lance en un clic ou se programme. Plus personne n'exporte de fichiers ni ne ressaisit de chiffres.",
        "Au même endroit, on charge aussi la dernière enquête nationale (EDS, MICS), les enquêtes auprès des formations sanitaires et les données de population : toutes les sources du pays, dans un seul espace.",
    ])
    point(doc, 2, "Analyse : la plateforme calcule tout, pour tous les indicateurs et toutes les zones", [
        "Après chaque importation, l'administrateur lance une génération de résultats. La plateforme vérifie la qualité des données (rapports manquants, valeurs aberrantes, incohérences) et corrige les séries, puis calcule les tendances des services, repère les mois où un service s'écarte de ce qu'il aurait dû être, et estime la couverture. Tout cela pour le pays, chaque département et chaque sous-préfecture, en une opération.",
        "Personne n'écrit de formule ni de code. Les résultats sont les mêmes pour toute l'équipe.",
    ])
    point(doc, 3, "Visualisation : chacun lit les résultats et construit ses graphiques", [
        "Une page Explorer montre tous les résultats en tableau, en courbes ou en carte, avec des filtres par zone, indicateur et période. Pour aller plus loin, l'utilisateur construit en quelques clics ses propres graphiques, qu'il enregistre dans son dossier.",
    ])
    point(doc, 4, "Rapports et présentations : produits dans la plateforme, mis à jour chaque mois", [
        "Les rapports et les présentations se composent directement dans la plateforme, aux couleurs du ministère, avec les graphiques et le texte d'interprétation. Un assistant IA intégré aide à décrire un graphique ou à rédiger un premier jet, à partir des seuls résultats calculés.",
        "Les graphiques restent reliés aux données : quand les données du mois suivant arrivent, le rapport se met à jour au lieu d'être refait. On le présente depuis la plateforme, on le télécharge ou on le partage.",
    ])

    heading(doc, "Ce qui la rend utile au ministère, au-delà des outils en place")
    point(doc, 1, "Savoir chaque mois où les services décrochent, et si c'est réel", [
        "Pour chaque service et chaque zone, la plateforme calcule ce que le volume aurait dû être, à partir de l'historique de chaque formation sanitaire, de la tendance et de la saison, et signale les mois où le volume réel s'en écarte : rouge quand les services ont décroché, vert quand ils ont dépassé.",
        "Elle distingue une baisse due à des formations qui n'ont pas rapporté d'une baisse réelle des services rendus. Un tableau de bord montre le chiffre déclaré ; la plateforme dit s'il est anormal, depuis quand, de combien et où. Aucun autre outil en place ne fait cela.",
    ])
    point(doc, 2, "Suivre la couverture entre deux enquêtes, sans dépendre des projections de population", [
        "La couverture habituelle divise les services par une population projetée depuis le dernier recensement ; quand la projection est fausse, la couverture l'est aussi, parfois au-delà de 100 %. La plateforme estime les populations cibles à partir des services eux-mêmes (CPN1, accouchements, naissances vivantes, Penta1), calés sur la dernière enquête, selon la méthode de Countdown to 2030.",
    ])
    point(doc, 3, "Des données dont la qualité est connue et corrigée", [
        "La qualité cesse d'être un argument pour ne pas se servir des données : elle devient un résultat suivi, par zone et par indicateur, que le ministère peut faire progresser.",
    ])
    point(doc, 4, "La revue mensuelle en quelques heures, pas en quelques jours", [
        "Plus d'export, plus de copier-coller, plus de graphiques à refaire : le temps gagné va à l'interprétation et à la décision.",
    ])
    point(doc, 5, "Un travail d'équipe, chacun avec ses accès", [
        "Un espace partagé par tout le pays, organisé en dossiers, avec un historique des versions. Les comptes sont approuvés par le ministère ; l'accès se règle par dossier et par document, et un utilisateur peut être limité à son département ou à son programme : chacun voit ce qu'il doit voir.",
    ])

    heading(doc, "Concrètement, pour qui ?")
    for b in ["Une direction centrale : une revue trimestrielle des services SRMNEA-N prête en quelques heures, avec les zones qui décrochent identifiées et la couverture mise à jour.",
              "Un programme (vaccination, santé maternelle) : le suivi mensuel de ses indicateurs, l'alerte quand un département s'écarte de l'attendu, et un bulletin qui se met à jour.",
              "Une direction départementale : ses propres données, son propre dossier, les mêmes analyses que le niveau central.",
              "Le suivi d'un choc : plusieurs pays s'en servent pour mesurer, mois par mois, l'effet des changements de financement sur les services, sans attendre une enquête."]:
        q = doc.add_paragraph(style="List Bullet"); q.paragraph_format.space_after = Pt(2); run(q, b)

    heading(doc, "Pourquoi lui faire confiance")
    for b in ["Les méthodes sont documentées publiquement (fastr-analytics.org/fr) et éprouvées dans une trentaine de pays partenaires du GFF, dont le Burkina Faso, la Côte d'Ivoire, le Niger, le Sénégal, le Tchad et le Cameroun.",
              "Les données restent celles du pays : une installation séparée par pays, uniquement des totaux agrégés (les mêmes que dans le DHIS2), aucune donnée nominative, un export intégral possible à tout moment.",
              "Logiciel libre, sans licence ni frais par utilisateur ; interface en français ; rien à installer. Le ministère administre lui-même ses utilisateurs, ses importations et ses résultats."]:
        q = doc.add_paragraph(style="List Bullet"); q.paragraph_format.space_after = Pt(2); run(q, b)

    heading(doc, "Ce qu'elle ne fait pas")
    rich(doc, [("Elle ne remplace ni le DHIS2, auquel elle se connecte, ni les enquêtes, dont elle comble les années intermédiaires. Elle ne décide pas : elle dit où regarder ; le pourquoi et l'action restent au ministère.", False)], space_after=6)

    heading(doc, "Pour démarrer au Bénin")
    rich(doc, [("Un accès en lecture au DHIS2, la liste des indicateurs à suivre, un administrateur désigné au ministère et une équipe à former sur les données du Bénin. L'équipe FASTR prépare l'instance en français, propose une présentation avec démonstration, puis la formation et un appui à distance. Contact : fastr@usefuldata.com.au.", False)], space_after=0)

    OUT.parent.mkdir(exist_ok=True)
    doc.save(str(OUT)); print("wrote", OUT)


if __name__ == "__main__":
    main()
