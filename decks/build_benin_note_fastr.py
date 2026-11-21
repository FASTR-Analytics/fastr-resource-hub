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
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor
from PIL import Image

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


def figure(doc, rel, caption, width_cm=16.0, crop=None):
    src = REPO / "resources" / "screenshots" / rel
    if crop:
        im = Image.open(src).crop(crop)
        tmp = OUT.parent / ("_fig_" + src.stem + ".png"); im.save(tmp); src = tmp
    p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(4); p.paragraph_format.space_after = Pt(2)
    p.add_run().add_picture(str(src), width=Cm(width_cm))
    c = doc.add_paragraph(); c.alignment = WD_ALIGN_PARAGRAPH.CENTER; c.paragraph_format.space_after = Pt(6)
    run(c, caption, size=8.5, color=GREY, italic=True)


def shade(cell, hex_fill):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd"); shd.set(qn("w:val"), "clear"); shd.set(qn("w:color"), "auto"); shd.set(qn("w:fill"), hex_fill)
    tcPr.append(shd)


def spec_table(doc, rows):
    t = doc.add_table(rows=len(rows), cols=2); t.style = "Table Grid"; t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, (k, v) in enumerate(rows):
        c0, c1 = t.cell(i, 0), t.cell(i, 1)
        c0.width, c1.width = Cm(4.6), Cm(12.6)
        for c in (c0, c1):
            c.paragraphs[0].paragraph_format.space_after = Pt(0)
            c.paragraphs[0].paragraph_format.line_spacing = 1.05
        run(c0.paragraphs[0], k, bold=True, size=9, color=GREEN)
        run(c1.paragraphs[0], v, size=9)
        if i % 2: shade(c0, "F4F7F6"); shade(c1, "F4F7F6")


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
    para(doc, "Les utilisateurs lisent ensuite ces résultats dans une page qui les présente en tableau, en courbes ou en carte, avec des filtres par zone, par indicateur et par période. Ceux qui veulent aller plus loin construisent leurs propres graphiques en quelques clics et les enregistrent dans leur dossier. Les présentations et les rapports se composent directement dans la plateforme, aux couleurs du ministère, en y plaçant les graphiques et le texte d'interprétation. Comme les graphiques restent reliés aux données, l'arrivée du mois suivant met le rapport à jour au lieu d'obliger à le refaire. Le rapport se présente depuis la plateforme, se télécharge ou se partage.")
    figure(doc, "platform_v2_fr/30b_report_example.png", "Une section de rapport composée dans la plateforme : titre, contexte, graphique relié aux données, interprétation et recommandation.", width_cm=9.5, crop=(330, 125, 1110, 900))
    para(doc, [("Un assistant d'intelligence artificielle est intégré à chaque document. ", True),
               ("L'utilisateur lui pose ses questions en français : quelle est la tendance de la CPN1 dans tel département, quelles régions ont la couverture la plus basse, que montre ce graphique. L'assistant répond, construit ou modifie le graphique demandé, propose une interprétation et peut rédiger un premier jet de section de rapport ou de diapositive. Il ne travaille qu'à partir des résultats calculés dans la plateforme pour le document ouvert : il n'invente aucun chiffre, et il indique à chaque étape ce qu'il a consulté. L'équipe relit, corrige et garde la main sur ce qui est publié.", False)])
    figure(doc, "platform_v2_fr/30c_report_with_ai_panel.png", "L'assistant, ouvert à côté du rapport : il indique ce qu'il a consulté, propose un brouillon de section et attend que l'utilisateur l'accepte ou le rejette.", width_cm=8.0, crop=(840, 0, 1440, 900))

    heading(doc, "5. Ce que les analyses apportent")
    para(doc, [("La première analyse propre à la plateforme est la ", False), ("détection des perturbations de services", True),
               (". Pour chaque service et chaque zone, la plateforme calcule ce que le volume aurait dû être, à partir de l'historique de chaque formation sanitaire, de sa tendance et de sa saisonnalité, puis signale les mois où le volume réel s'en écarte, en rouge lorsque les services ont décroché et en vert lorsqu'ils ont dépassé l'attendu. Elle distingue ce qui tient à des formations qui n'ont pas rapporté de ce qui tient à une baisse réelle des services rendus. Là où un tableau de bord montre le chiffre déclaré, la plateforme dit s'il est anormal, depuis quand, de combien et où, ce qui est précisément l'information dont une direction a besoin pour agir.", False)])
    figure(doc, "tchad_2026_11/20_explore_disruption_observed_expected.png", "Détection des perturbations, exemple d'une instance pays : volume observé (ligne pleine), volume attendu (pointillés), bande de crédibilité à 95 % (gris) ; les mois en rouge sont ceux où les services ont décroché.", width_cm=14.5, crop=(60, 215, 1440, 432))

    para(doc, [("La deuxième est l'", False), ("estimation de la couverture entre deux enquêtes", True),
               (". La couverture est habituellement calculée en divisant les services rendus par une population cible projetée à partir du dernier recensement ; lorsque la projection est fausse, ce qui est fréquent plusieurs années après un recensement, la couverture l'est aussi, et dépasse parfois 100 %. La plateforme estime au contraire les populations cibles à partir des services eux-mêmes, par exemple les premières consultations prénatales, les accouchements, les naissances vivantes et la première dose de pentavalent, en les calant sur la dernière enquête nationale, selon la méthode retenue par Countdown to 2030. La couverture peut ainsi être suivie chaque mois, pour le pays et pour chaque département, en attendant l'enquête suivante.", False)])
    para(doc, [("La troisième concerne la ", False), ("qualité des données", True),
               (". Avant toute analyse, la plateforme repère les rapports manquants, les valeurs aberrantes et les incohérences, puis corrige les séries tout en conservant les données d'origine. La qualité cesse ainsi d'être une raison de ne pas utiliser les données ; elle devient un résultat que l'on suit, par zone et par indicateur, et que le ministère peut faire progresser.", False)])

    heading(doc, "6. Ce que cela change pour le travail des équipes")
    para(doc, "La plateforme intègre et automatise la chaîne qui va des données au rapport. Les données arrivent seules du DHIS2 ; la qualité est vérifiée et les analyses calculées en une opération ; les graphiques se construisent en quelques clics et restent reliés aux données ; les rapports se mettent à jour au lieu d'être refaits ; l'assistant aide à interpréter et à rédiger. Le travail qui prenait plusieurs jours chaque mois se fait en quelques heures, et le temps des équipes passe de la manipulation des données à leur lecture et à la décision.")
    para(doc, "Le travail est aussi collaboratif. Toute l'équipe du ministère travaille dans le même espace, organisé en dossiers, sur les mêmes résultats. Un graphique construit par une personne sert à toutes ; plusieurs personnes peuvent travailler sur la même présentation ; chaque document conserve l'historique de ses versions. Les comptes sont approuvés par l'administrateur du ministère, les accès se règlent par dossier et par document, et un utilisateur peut être limité à son département ou à son programme. Les directions centrales, les programmes et les départements lisent ainsi les mêmes chiffres.")

    heading(doc, "7. Un outil libre, documenté et soutenu")
    para(doc, "La plateforme est un logiciel libre : son code est ouvert et ses méthodes sont documentées publiquement (fastr-analytics.org/fr), il n'y a ni licence ni frais par utilisateur, et le ministère peut à tout moment exporter l'intégralité de ses données et de ses résultats. Chaque pays dispose d'une installation séparée, qui ne contient que des totaux agrégés par formation sanitaire et par mois, les mêmes que dans le DHIS2, et aucune donnée nominative. Les coûts de fonctionnement (hébergement du serveur, usage de l'assistant, maintenance de la plateforme) sont pris en charge par le GFF ; le ministère administre lui-même ses utilisateurs, ses importations et ses résultats, avec pour objectif à terme un hébergement par le ministère.")
    para(doc, "L'outil s'accompagne d'un appui. Des experts techniques du GFF accompagnent chaque pays lors de la configuration, de la formation sur ses propres données et ensuite à distance, pour les questions d'usage comme pour les questions de méthode. Dans la plateforme, un bouton d'aide donne accès à des visites guidées, à la documentation en français et à une demande d'assistance directe. Enfin, les utilisateurs de tous les pays forment une communauté : un webinaire d'une heure, en ligne, organisé chaque mois par le GFF et Useful Data, le deuxième mardi du mois, présente les nouveautés de la plateforme, répond aux questions et permet aux équipes pays d'échanger sur leurs usages.")

    heading(doc, "8. Pour démarrer au Bénin")
    para(doc, "Du côté du ministère, quatre éléments suffisent : un accès en lecture au DHIS2 pour la connexion automatique, la liste des indicateurs à suivre, un administrateur désigné pour l'instance, et une équipe à former. Le GFF prépare l'instance du Bénin en français, propose une présentation avec démonstration sur les données du pays, puis la formation des équipes, suivie de l'appui à distance décrit plus haut. Documentation et méthodologie : fastr-analytics.org/fr. Contact : fastr@usefuldata.com.au.", space_after=0)

    # ---------------- Annexe technique ----------------
    br = doc.add_paragraph(); br.add_run().add_break(WD_BREAK.PAGE)
    p = doc.add_paragraph(); p.paragraph_format.space_after = Pt(2)
    run(p, "Annexe technique", bold=True, size=14, color=GREEN)
    para(doc, "Spécifications de la plateforme, à l'attention des équipes informatiques et DHIS2 du ministère. Les éléments ci-dessous décrivent l'installation telle qu'elle est fournie aujourd'hui par le GFF ; ils ont été vérifiés dans la documentation technique et le code de la plateforme.", space_after=6)

    heading(doc, "Accès et prérequis")
    spec_table(doc, [
        ("Accès utilisateur", "Application web, sans installation. Navigateurs récents (Chrome recommandé ; Firefox, Safari, Edge pris en charge). Interface en français, anglais et portugais."),
        ("Comptes", "Inscription par adresse e-mail ; chaque compte est approuvé par l'administrateur de l'instance avant tout accès. L'authentification et les sessions sont gérées par un fournisseur d'identité ; la plateforme ne stocke aucun mot de passe. Aucun identifiant DHIS2 n'est demandé aux utilisateurs."),
        ("Rôles et permissions", "Administrateurs de l'instance ; permissions par utilisateur (consulter ou configurer les utilisateurs, consulter ou configurer les données) ; accès aux données non restreint ou limité à des portées (une région, une période) ; accès par document et par dossier (propriétaire, éditeur, lecteur)."),
        ("Prérequis côté ministère", "Un compte DHIS2 en lecture seule pour l'import (API), la liste des indicateurs à suivre et leur correspondance DHIS2, un administrateur désigné, une connexion internet pour les utilisateurs."),
    ])

    heading(doc, "Données")
    spec_table(doc, [
        ("Connexion au DHIS2", "Import côté serveur par l'API du DHIS2, par indicateur et par mois, en un clic ou programmé. Chaque import est tracé dans un registre (mois importés, dernière importation, mois en échec, relance possible)."),
        ("Données hébergées", "Uniquement des totaux agrégés par formation sanitaire et par mois, identiques à ceux du DHIS2 ; aucune donnée individuelle ni nominative. Structure sanitaire (zones administratives, formations), indicateurs, enquêtes auprès des formations sanitaires, enquêtes ménages et données de population chargées au niveau de l'instance."),
        ("Résultats", "Calculés par les modules intégrés en paquets de résultats versionnés ; chaque chiffre porte la version du calcul. Les méthodes sont documentées publiquement (fastr-analytics.org/fr)."),
        ("Export", "Données, résultats, graphiques, présentations et rapports exportables à tout moment (tableaux, images, PDF, PowerPoint, Word selon l'objet)."),
    ])

    heading(doc, "Hébergement, sécurité et exploitation")
    spec_table(doc, [
        ("Isolation", "Une installation séparée par pays : application, base de données, cache et stockage propres, sur un réseau privé. Aucun accès entre pays."),
        ("Chiffrement", "Communications chiffrées (TLS) entre le navigateur et la plateforme ; certificats renouvelés automatiquement ; secrets conservés côté serveur uniquement."),
        ("Sauvegardes", "Sauvegarde de la base toutes les trente minutes (fenêtre glissante de trois jours) et instantanés quotidiens, hebdomadaires et mensuels ; restauration soumise à permission."),
        ("Traçabilité", "Chaque action est attribuée à un compte ; les imports, les générations de résultats et les requêtes à l'assistant sont journalisés."),
        ("Accès aux serveurs", "Réservé à l'équipe technique de la plateforme, par clé cryptographique uniquement."),
        ("Hébergement et coûts", "Hébergement, maintenance et mises à jour assurés et pris en charge par le GFF. Le code est ouvert (licence libre) ; aucune licence ni frais par utilisateur. Un hébergement par le ministère est possible à terme, par une migration structurée qui transfère le serveur et ses procédures."),
    ])

    heading(doc, "Assistant d'intelligence artificielle")
    spec_table(doc, [
        ("Modèle et accès", "Modèle de langage Claude (Anthropic), appelé par le serveur de la plateforme ; la clé d'accès ne quitte jamais le serveur."),
        ("Périmètre", "L'assistant agit dans la session de l'utilisateur, avec ses seules permissions, sur le document ouvert et son paquet de résultats. Il ne reçoit que des résultats agrégés."),
        ("Confidentialité", "Conditions commerciales d'Anthropic : les contenus ne servent pas à entraîner les modèles, sont confidentiels et supprimés sous trente jours ; accord de traitement des données disponible. Traitement aux États-Unis."),
        ("Limites d'usage", "Quotas quotidiens par utilisateur et hebdomadaires par instance ; chaque requête journalisée."),
    ])

    heading(doc, "Appui et communauté")
    spec_table(doc, [
        ("Appui technique", "Experts techniques du GFF pour la configuration, la formation sur les données du pays et l'appui à distance ; bouton d'aide dans la plateforme (visites guidées, documentation, demande d'assistance) ; contact fastr@usefuldata.com.au."),
        ("Communauté", "Webinaire mensuel d'une heure, en ligne, le deuxième mardi du mois, organisé par le GFF et Useful Data : nouveautés, questions, échanges entre équipes pays."),
        ("Documentation", "Guide utilisateur, guide administrateur et méthodologie en français : fastr-analytics.org/fr."),
    ])

    OUT.parent.mkdir(exist_ok=True)
    doc.save(str(OUT)); print("wrote", OUT)


if __name__ == "__main__":
    main()
