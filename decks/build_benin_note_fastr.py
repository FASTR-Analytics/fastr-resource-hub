#!/usr/bin/env python3
"""Build the French note for the Benin MoH on the FASTR analytics platform.

Narrative prose, eight sections, two pages. Outline agreed with Claire on
2026-11-21: context, starting point, what it is and is not, how it works,
what the analyses bring, what changes for the team, an open and supported
tool, how to start.

Usage:  python3 decks/build_benin_note_fastr.py
Output: outputs/benin_note_plateforme_fastr.docx
"""
from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "outputs" / "benin_note_plateforme_fastr.docx"
GREEN = RGBColor(0x0A, 0x54, 0x4F)
INK = RGBColor(0x1A, 0x1F, 0x1E)
GREY = RGBColor(0x66, 0x66, 0x66)
SIZE = 9.5


def run(p, text, bold=False, size=SIZE, color=INK, italic=False):
    r = p.add_run(text); r.bold = bold; r.italic = italic
    r.font.size = Pt(size); r.font.color.rgb = color; r.font.name = "Calibri"
    return r


def para(doc, parts, space_after=6, align=WD_ALIGN_PARAGRAPH.JUSTIFY):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(space_after); p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.line_spacing = 1.08
    p.alignment = align
    if isinstance(parts, str):
        parts = [(parts, False)]
    for t, b in parts:
        run(p, t, bold=b)
    return p


def heading(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(7); p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.keep_with_next = True
    run(p, text, bold=True, size=12, color=GREEN)
    return p


def main():
    doc = Document()
    sec = doc.sections[0]
    sec.page_height, sec.page_width = Cm(29.7), Cm(21.0)
    sec.left_margin = sec.right_margin = Cm(1.9); sec.top_margin = Cm(1.2); sec.bottom_margin = Cm(1.2)
    st = doc.styles["Normal"]; st.font.name = "Calibri"; st.font.size = Pt(SIZE)
    st.element.rPr.rFonts.set(qn("w:eastAsia"), "Calibri")

    hp = sec.header.paragraphs[0]
    hp.add_run().add_picture(str(REPO / "resources" / "logos" / "FASTR_Primary_01_FullName.png"), height=Cm(0.8))
    hp.add_run("      ")
    hp.add_run().add_picture(str(REPO / "resources" / "logos" / "GFF_Logo_trimmed.png"), height=Cm(0.6))
    fp = sec.footer.paragraphs[0]; fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run(fp, "Note à l'attention du ministère de la Santé du Bénin · Global Financing Facility · Novembre 2026", size=8, color=GREY)

    p = doc.add_paragraph(); p.paragraph_format.space_after = Pt(2)
    run(p, "La plateforme d'analyse FASTR", bold=True, size=18, color=GREEN)
    p = doc.add_paragraph(); p.paragraph_format.space_after = Pt(8)
    run(p, "Note à l'attention du ministère de la Santé du Bénin · Global Financing Facility (GFF) · Novembre 2026", size=9.5, color=GREY)

    heading(doc, "1. Contexte")
    para(doc, [("FASTR (", False), ("Frequent Assessments and System Tools for Resilience", True),
               (") est l'approche du Global Financing Facility pour l'analyse à cycle rapide et l'utilisation des données de santé. Elle a été développée avec les pays partenaires à partir de 2020, lorsque les perturbations de services liées à la pandémie ont montré qu'il fallait pouvoir suivre les services de santé entre deux enquêtes, à partir des données de routine, en quelques semaines plutôt qu'en quelques années. La plateforme d'analyse FASTR est l'outil qui porte cette approche. D'abord utilisée pour suivre la continuité des services, elle sert aujourd'hui aux revues de routine, aux bulletins trimestriels et au suivi des programmes dans une trentaine de pays partenaires du GFF, en français, en anglais et en portugais, dont le Burkina Faso, la Côte d'Ivoire, le Niger, le Sénégal, le Tchad et le Cameroun.", False)])
    para(doc, "Le GFF propose aujourd'hui au ministère de la Santé du Bénin de disposer de sa propre instance de la plateforme et de former ses équipes à son usage. Cette note explique ce qu'est la plateforme, comment elle fonctionne, ce qu'elle apporte par rapport aux outils déjà en place, et ce qu'il faut pour démarrer.")

    heading(doc, "2. Le point de départ")
    para(doc, "Chaque mois, les formations sanitaires du Bénin déclarent leurs activités dans le DHIS2 : consultations prénatales, accouchements, vaccinations, consultations curatives. Ces données existent, elles sont récentes et elles couvrent tout le pays. Pourtant, entre deux enquêtes nationales, elles servent peu à la décision, pour trois raisons que les équipes connaissent bien. Préparer une revue des services demande plusieurs jours : il faut exporter les données indicateur par indicateur, les nettoyer dans un tableur, refaire les graphiques, les coller dans un document et rédiger, puis recommencer le mois suivant. La qualité des chiffres fait débat, et ce débat sert souvent d'argument pour ne pas s'en servir. Enfin, quand le volume d'un service baisse, personne ne peut dire rapidement si les services ont réellement reculé ou si des formations n'ont pas envoyé leur rapport. La plateforme a été conçue pour répondre à ces trois difficultés.")

    heading(doc, "3. Ce qu'est la plateforme, et ce qu'elle n'est pas")
    para(doc, [("Le DHIS2 est l'outil de collecte, d'hébergement et de stockage des données de routine, et il le reste. La plateforme d'analyse FASTR ne le remplace pas : elle vient s'y ajouter pour ce que le DHIS2 ne fait pas, c'est-à-dire ", False), ("analyser ces données en profondeur et les restituer", True),
               (". Elle est connectée directement au DHIS2 du pays, qui lui transmet les données ; celles-ci sont ensuite vérifiées, analysées et présentées dans la plateforme, sans export ni ressaisie. Concrètement, il s'agit d'un site web sécurisé, propre au Bénin, en français, auquel les utilisateurs accèdent avec un navigateur ; il n'y a rien à installer.", False)])
    para(doc, "La plateforme ne remplace pas non plus les enquêtes nationales : elle les utilise comme référence et comble les années qui les séparent. Et elle ne décide pas à la place du ministère : elle indique où regarder, depuis quand et de combien ; le pourquoi et l'action restent aux équipes et au terrain.")

    heading(doc, "4. Comment elle fonctionne : des données au rapport")
    para(doc, "Le parcours d'un mois de données illustre le fonctionnement. Au départ, un administrateur du ministère relie une fois la plateforme au DHIS2 du Bénin et choisit les indicateurs à suivre. Ensuite, chaque mois, les nouvelles données sont importées en un clic ou automatiquement, à une date programmée. Au même endroit, l'administrateur charge la dernière enquête nationale, les enquêtes auprès des formations sanitaires et les données de population, de sorte que toutes les sources du pays se trouvent dans un seul espace.")
    para(doc, "Une fois les données importées, l'administrateur lance la génération des résultats. La plateforme vérifie alors la qualité des données, corrige les séries, calcule les tendances des services, repère les mois où un service s'écarte de ce qu'il aurait dû être, et estime la couverture. Tout cela est fait en une seule opération pour tous les indicateurs, pour le pays, chaque département et chaque sous-préfecture, sans qu'aucune formule ni aucun code ne soit écrit. Les résultats sont les mêmes pour toute l'équipe.")
    para(doc, "Les utilisateurs lisent ensuite ces résultats dans une page qui les présente en tableau, en courbes ou en carte, avec des filtres par zone, par indicateur et par période. Ceux qui veulent aller plus loin construisent leurs propres graphiques en quelques clics et les enregistrent dans leur dossier. Les présentations et les rapports se composent directement dans la plateforme, aux couleurs du ministère, en y plaçant les graphiques et le texte d'interprétation ; un assistant d'intelligence artificielle, intégré, aide à décrire un graphique ou à rédiger un premier jet, en s'appuyant uniquement sur les résultats calculés. Comme les graphiques restent reliés aux données, l'arrivée du mois suivant met le rapport à jour au lieu d'obliger à le refaire. Le rapport se présente depuis la plateforme, se télécharge ou se partage.")

    heading(doc, "5. Ce que les analyses apportent")
    para(doc, [("La première analyse propre à la plateforme est la ", False), ("détection des perturbations de services", True),
               (". Pour chaque service et chaque zone, la plateforme calcule ce que le volume aurait dû être, à partir de l'historique de chaque formation sanitaire, de sa tendance et de sa saisonnalité, puis signale les mois où le volume réel s'en écarte, en rouge lorsque les services ont décroché et en vert lorsqu'ils ont dépassé l'attendu. Elle distingue ce qui tient à des formations qui n'ont pas rapporté de ce qui tient à une baisse réelle des services rendus. Là où un tableau de bord montre le chiffre déclaré, la plateforme dit s'il est anormal, depuis quand, de combien et où, ce qui est précisément l'information dont une direction a besoin pour agir.", False)])
    para(doc, [("La deuxième est l'", False), ("estimation de la couverture entre deux enquêtes", True),
               (". La couverture est habituellement calculée en divisant les services rendus par une population cible projetée à partir du dernier recensement ; lorsque la projection est fausse, ce qui est fréquent plusieurs années après un recensement, la couverture l'est aussi, et dépasse parfois 100 %. La plateforme estime au contraire les populations cibles à partir des services eux-mêmes, par exemple les premières consultations prénatales, les accouchements, les naissances vivantes et la première dose de pentavalent, en les calant sur la dernière enquête nationale, selon la méthode retenue par Countdown to 2030. La couverture peut ainsi être suivie chaque mois, pour le pays et pour chaque département, en attendant l'enquête suivante.", False)])
    para(doc, [("La troisième concerne la ", False), ("qualité des données", True),
               (". Avant toute analyse, la plateforme repère les rapports manquants, les valeurs aberrantes et les incohérences, puis corrige les séries tout en conservant les données d'origine. La qualité cesse ainsi d'être une raison de ne pas utiliser les données ; elle devient un résultat que l'on suit, par zone et par indicateur, et que le ministère peut faire progresser.", False)])

    heading(doc, "6. Ce que cela change pour le travail des équipes")
    para(doc, "La plateforme intègre et automatise la chaîne qui va des données au rapport. Les données arrivent seules du DHIS2 ; la qualité est vérifiée et les analyses calculées en une opération ; les graphiques se construisent en quelques clics et restent reliés aux données ; les rapports se mettent à jour au lieu d'être refaits ; l'assistant aide à interpréter et à rédiger. Le travail qui prenait plusieurs jours chaque mois se fait en quelques heures, et le temps des équipes passe de la manipulation des données à leur lecture et à la décision.")
    para(doc, "Le travail est aussi collaboratif. Toute l'équipe du ministère travaille dans le même espace, organisé en dossiers, sur les mêmes résultats. Un graphique construit par une personne sert à toutes ; plusieurs personnes peuvent travailler sur la même présentation ; chaque document conserve l'historique de ses versions. Les comptes sont approuvés par l'administrateur du ministère, les accès se règlent par dossier et par document, et un utilisateur peut être limité à son département ou à son programme. Les directions centrales, les programmes et les départements lisent ainsi les mêmes chiffres.")

    heading(doc, "7. Un outil libre, documenté et soutenu")
    para(doc, "La plateforme est un logiciel libre : son code et ses méthodes sont publics (github.com/FASTR-Analytics et fastr-analytics.org/fr), il n'y a ni licence ni frais par utilisateur, et le ministère peut à tout moment exporter l'intégralité de ses données et de ses résultats. Chaque pays dispose d'une installation séparée, qui ne contient que des totaux agrégés par formation sanitaire et par mois, les mêmes que dans le DHIS2, et aucune donnée nominative. Les coûts de fonctionnement tiennent à l'hébergement du serveur, à l'usage de l'assistant au compteur et à la maintenance partagée de la plateforme ; le ministère administre lui-même ses utilisateurs, ses importations et ses résultats, avec pour objectif à terme un hébergement par le ministère.")
    para(doc, "L'outil s'accompagne d'un appui. Des experts techniques du GFF accompagnent chaque pays lors de la configuration, de la formation sur ses propres données et ensuite à distance, pour les questions d'usage comme pour les questions de méthode. Dans la plateforme, un bouton d'aide donne accès à des visites guidées, à la documentation en français et à une demande d'assistance directe. Enfin, les utilisateurs de tous les pays forment une communauté : un webinaire d'une heure, en ligne, organisé chaque mois par le GFF et Useful Data, présente les nouveautés de la plateforme, répond aux questions et permet aux équipes pays d'échanger sur leurs usages.")

    heading(doc, "8. Pour démarrer au Bénin")
    para(doc, "Du côté du ministère, quatre éléments suffisent : un accès en lecture au DHIS2 pour la connexion automatique, la liste des indicateurs à suivre, un administrateur désigné pour l'instance, et une équipe à former. Le GFF prépare l'instance du Bénin en français, propose une présentation avec démonstration sur les données du pays, puis la formation des équipes, suivie de l'appui à distance décrit plus haut. Documentation et méthodologie : fastr-analytics.org/fr. Contact : fastr@usefuldata.com.au.", space_after=0)

    OUT.parent.mkdir(exist_ok=True)
    doc.save(str(OUT)); print("wrote", OUT)


if __name__ == "__main__":
    main()
