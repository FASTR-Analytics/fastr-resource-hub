#!/usr/bin/env python3
"""Build the French introduction deck to the FASTR platform for the Benin MoH.

Answers the question the Ministry raised before the training: what is specific
about this tool compared with the others already used in the field. Rationale,
what the platform does on top of DHIS2, how it differs from dashboards and
spreadsheet analysis, data ownership and security, footprint, next steps.
About 15 minutes. Detail lives in the speaker notes.

Reuses the slide archetypes of build_approche_fastr.py / build_what_is_fastr.py.

Usage:  python3 decks/build_benin_intro_plateforme.py
Output: decks/fr/benin_intro_plateforme_fastr.pptx
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from pptx import Presentation  # noqa: E402
from pptx.enum.text import PP_ALIGN  # noqa: E402
from pptx.util import Emu  # noqa: E402

from build_approche_fastr import (  # noqa: E402
    CW, DEEP_GREEN, EMU_IN, GREEN, INK3, LEFT, NAVY, PLUM, SH, SW, RGBColor,
    _fade, _para, _rect, _tb, s_content, s_contrast, s_numbered, s_section,
    s_statement, s_table, s_two_col,
)
from build_what_is_fastr import s_closing, s_cover, s_diagram, s_image_text  # noqa: E402

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "decks" / "fr" / "benin_intro_plateforme_fastr.pptx"


def _footer(slide, n, total):
    _rect(slide, LEFT, SH - 0.44, CW, 0.012, fill=RGBColor(0xE4, 0xE7, 0xE5))
    _, lf = _tb(slide, LEFT, SH - 0.38, CW - 1.2, 0.3)
    _para(lf, "FASTR  ·  PLATEFORME D'ANALYSE  ·  BÉNIN", size=8, color=INK3, first=True, bold=True, space=0)
    _, pf = _tb(slide, SW - LEFT - 1.0, SH - 0.38, 1.0, 0.3)
    _para(pf, f"{n} / {total}", size=8, color=INK3, first=True, bold=True, align=PP_ALIGN.RIGHT, space=0)


BUILDERS = {"cover": s_cover, "statement": s_statement, "content": s_content, "numbered": s_numbered,
            "image_text": s_image_text, "diagram": s_diagram, "contrast": s_contrast, "two_col": s_two_col,
            "table": s_table, "section": s_section, "closing": s_closing}

CONTENT = [
    {"type": "cover", "title": "La plateforme d'analyse FASTR",
     "subtitle": "Frequent Assessments and System Tools for Resilience\nL'approche du GFF pour l'analyse à cycle rapide et l'utilisation des données",
     "presenter": "Introduction pour le ministère de la Santé du Bénin  ·  Global Financing Facility  ·  Novembre 2026",
     "notes": "Lire l'acronyme à voix haute : des évaluations fréquentes, et des outils qui rendent le système plus résilient.\n\nCette présentation répond à une question posée par le ministère : qu'est-ce qui distingue cet outil de ceux déjà utilisés sur le terrain ? Environ quinze minutes, puis une démonstration si la connexion le permet."},

    {"type": "statement", "kicker": "La question",
     "text": "Les formations sanitaires du Bénin déclarent leurs activités chaque mois dans le DHIS2. Comment transformer ces données, chaque trimestre, en décisions de programme, sans attendre la prochaine enquête ?",
     "notes": "Partir du constat que le ministère connaît : les données existent, elles arrivent chaque mois, et pourtant la plupart des décisions entre deux enquêtes se prennent sans analyse récente de ces données."},

    # ---- Ce que font les outils en place -----------------------------------
    {"type": "table", "title": "Les outils en place répondent chacun à une partie du besoin",
     "intro": "Lecture par ligne : ce que chaque famille d'outils fait bien, et ce qu'elle laisse à faire à la main.",
     "headers": ["Famille d'outils", "Ce qu'elle fait", "Ce qui reste à faire à la main"],
     "colw": [2.6, 4.6, 4.89], "bold_first": True, "fs": 13, "rows": [
        ["DHIS2 et ses tableaux de bord", "Collecte, stocke et affiche les données déclarées, telles quelles.", "Juger si une baisse est réelle ou due à des rapports manquants ; comparer à une valeur attendue ; estimer une couverture."],
        ["Outils de qualité des données", "Signalent les rapports manquants, les valeurs aberrantes et les incohérences.", "Corriger les séries avant de les analyser ; relier la qualité aux résultats qui en dépendent."],
        ["Tableaux de bord décisionnels (BI)", "Mettent en forme et partagent des indicateurs choisis.", "Toute l'analyse en amont ; chaque pays reconstruit ses propres règles."],
        ["Feuilles de calcul et scripts", "Permettent n'importe quelle analyse, par des analystes formés.", "Refaire le travail chaque mois ; la méthode dépend de la personne et part avec elle."],
     ],
     "note": "Ces outils restent utiles. La plateforme FASTR ne les remplace pas : elle ajoute l'étape d'analyse qui manque entre les données brutes et la décision.",
     "notes": "Ne pas critiquer les outils que le ministère utilise. Le DHIS2 est la source et le reste ; les tableaux de bord servent au suivi. Le point est la couche manquante : personne ne dit, chaque mois, si les chiffres sont fiables, s'ils s'écartent de l'attendu, et ce que cela représente en couverture.\n\nSi la salle cite un outil précis, demander dans quelle ligne il se range et ce qu'il laisse à faire à la main."},

    {"type": "diagram", "title": "Le circuit mensuel : à la main, et avec la plateforme",
     "intro": "Même point de départ, le DHIS2. La différence est ce qui se passe entre l'export et le rapport.",
     "image": "diagrams_fr/workflow_manual_vs_fastr.svg",
     "footer": "Avec la plateforme, le rapport est lié à un paquet de résultats : un nouveau mois de données, c'est un nouveau paquet, et le rapport se met à jour.",
     "notes": "Rangée du haut : quatre étapes refaites chaque mois, avec un copier-coller à chaque passage. Demander à la salle combien de temps prend un rapport mensuel aujourd'hui.\n\nRangée du bas : l'administrateur importe par l'API du DHIS2 et génère un paquet de résultats ; l'utilisateur met à jour son rapport à partir du paquet. Les graphiques restent liés aux données."},

    # ---- Ce que la plateforme fait -----------------------------------------
    {"type": "section", "kicker": "Ce que la plateforme ajoute", "title": "Une couche d'analyse au-dessus du DHIS2, la même dans tous les pays"},

    {"type": "numbered", "title": "Quatre analyses, dans l'ordre, calculées en un seul paquet de résultats", "steps": [
        ("Qualité évaluée", "Complétude, valeurs aberrantes et cohérence, établissement par établissement et mois par mois."),
        ("Qualité corrigée", "Les valeurs aberrantes sont remplacées et les mois manquants comblés ; l'original reste disponible."),
        ("Perturbations", "Le volume observé est comparé au volume attendu de chaque établissement, avec une bande de crédibilité à 95 %."),
        ("Couverture", "Les dénominateurs sont estimés à partir des points d'entrée du système, puis la couverture de chaque service."),
     ], "footer": "Un administrateur génère le paquet après chaque import. Personne n'écrit de code, personne ne refait les calculs à la main.",
     "notes": "Les méthodes sont documentées publiquement sur fastr-analytics.org et identiques dans tous les pays. Une analyse faite à Cotonou et une analyse faite à Dakar se comparent.\n\nLe paquet de résultats est versionné : chaque chiffre porte la version du calcul qui l'a produit, et les produits lisent tous le même paquet."},

    {"type": "image_text", "title": "Un signal, pas un tableau de chiffres", "side": "right", "tw": 5.2,
     "image": "screenshots/tchad_2026_11/20_explore_disruption_observed_expected.png", "blocks": [
        {"t": "Pour chaque indicateur, la plateforme trace le volume observé (ligne pleine), le volume attendu (pointillés) et la bande de crédibilité à 95 %.", "space": 10},
        {"t": "Rouge là où l'observé passe sous la bande, vert au-dessus. Le modèle sépare les établissements qui n'ont pas rapporté de ceux qui ont rapporté moins : seul le second cas est une perturbation de service.", "space": 10},
        {"t": "Un décideur voit en une page où les services ont décroché, depuis quand et de combien. Le pourquoi reste une question pour le terrain.", "space": 0},
     ],
     "notes": "Capture d'une instance pays (Tchad, novembre 2026), page Explorer, module Détection des perturbations. Montrer la même page sur l'instance du Bénin une fois les données importées.\n\nC'est la différence avec un tableau de bord : le tableau de bord montre le volume ; ici, le volume est comparé à ce qu'il aurait dû être, établissement par établissement, en tenant compte de la tendance et de la saison."},

    {"type": "image_text", "title": "La couverture suivie chaque mois, entre deux enquêtes", "side": "right", "tw": 5.2,
     "image": "screenshots/platform_v2_fr/13e_explore_coverage_table.png", "blocks": [
        {"t": "Gris : la couverture calculée à partir des données de routine. Noir : la dernière enquête (EDS, MICS). Rouge : la projection qui prolonge l'enquête avec la tendance de routine.", "space": 10},
        {"t": "Les dénominateurs viennent des points d'entrée du système (CPN1, accouchements, naissances vivantes, Penta1), et non d'un seul recensement projeté.", "space": 10},
        {"t": "Le pays choisit ses taux (grossesses, mortalité, abandon) ; la méthode est la même partout.", "space": 0},
     ],
     "notes": "Capture du site de démonstration en français. Les deux enquêtes restent la référence ; la plateforme comble les années entre elles.\n\nSi la question du choix du dénominateur se pose, renvoyer au document de méthodologie : la plateforme compare les chaînes de dénominateurs et retient celle qui concorde le mieux avec l'enquête."},

    # ---- Comment on s'en sert ----------------------------------------------
    {"type": "section", "kicker": "Comment on s'en sert", "title": "Une seule base pour le pays, des produits reliés aux résultats"},

    {"type": "diagram", "title": "Une seule base pour tout le pays, rangée en dossiers",
     "intro": "La page Produits fonctionne comme un espace partagé : des dossiers, des fichiers, et un réglage d'accès par fichier.",
     "image": "diagrams_fr/products_folders_scopes.svg",
     "footer": "Chaque visualisation, présentation ou rapport lit un paquet de résultats à travers une portée : tout le pays, une région, une période.",
     "notes": "Analogie utile : un Google Drive partagé par le pays. Les fichiers sont les produits, les dossiers rangent les produits, Gérer l'accès décide qui ouvre quoi.\n\nUne différence : chaque fichier est lié à un paquet de résultats et à une portée, indiqués dans sa ligne. C'est ce qui permet la mise à jour mensuelle sans reconstruire."},

    {"type": "two_col", "title": "Trois formats de restitution, mis à jour avec les données", "widths": [1, 1], "cols": [
        {"head": "Ce que l'utilisateur produit", "size": 14, "items": [
            "**Visualisations** : un graphique, une carte ou un tableau, enregistré dans son dossier",
            "**Présentations** : des diapositives qui combinent graphiques et texte, présentées depuis la plateforme ou téléchargées",
            "**Rapports** : des documents narratifs avec des figures en direct, téléchargés ou envoyés",
            "**Explorer** : un coup d'œil à n'importe quel résultat, sans rien créer"]},
        {"head": "Ce qui change par rapport à un fichier Word", "size": 14, "items": [
            "Les figures restent **liées au paquet** : changer de paquet met tout à jour",
            "Le travail est **enregistré en continu** et visible par l'équipe, avec un historique des versions",
            "L'**assistant IA** travaille dans le produit ouvert : il lit les résultats calculés, met à jour les figures et rédige un premier jet que l'équipe relit",
            "L'assistant **n'invente aucun chiffre** : il n'a accès qu'au paquet du produit"]}],
     "notes": "Le rapport mensuel devient un produit que l'on met à jour, pas un fichier que l'on refait. L'assistant accélère la rédaction ; la relecture et la signature restent celles de l'équipe.\n\nInterface en français, anglais et portugais. Rien à installer : un navigateur suffit."},

    # ---- Ce qui distingue FASTR --------------------------------------------
    {"type": "contrast", "title": "Ce qui distingue la plateforme FASTR", "cols": [
        {"head": "Ce qu'elle fait que les autres ne font pas", "accent": DEEP_GREEN, "items": [
            "La **qualité** est évaluée et **corrigée** avant toute analyse, et suivie comme un résultat",
            "Les **perturbations** sont détectées par rapport à un attendu, établissement par établissement",
            "La **couverture** est estimée chaque mois avec des dénominateurs issus du système",
            "La **méthode est dans l'outil**, identique dans une trentaine de pays et documentée publiquement"]},
        {"head": "Ce qu'elle ne fait pas", "accent": GREEN, "items": [
            "Elle ne remplace pas le **DHIS2** : elle lit ses données par l'API",
            "Elle ne collecte pas de **données patients** : uniquement des totaux agrégés par établissement et par mois",
            "Elle ne **décide** pas : elle dit où regarder ; le pourquoi et l'action restent au ministère"]},
     ], "bottom": [
        ("Tableau de bord", "Montre les chiffres déclarés, tels quels, dans un format choisi.", INK3),
        ("Plateforme FASTR", "Dit si les chiffres sont fiables, s'ils s'écartent de l'attendu et ce qu'ils représentent en couverture.", GREEN),
     ],
     "notes": "C'est la diapositive qui répond à la question du ministère. Les quatre points de gauche sont les spécificités ; les trois de droite évitent les malentendus les plus fréquents (remplacer le DHIS2, héberger des données patients, décider à la place du ministère)."},

    {"type": "two_col", "title": "Sécurité, souveraineté et coût", "widths": [1, 1], "cols": [
        {"head": "Les données restent celles du pays", "size": 14, "items": [
            "Une **installation isolée par pays** : application, base et stockage séparés, aucun accès entre pays",
            "Des **totaux agrégés** seulement, les mêmes que dans le DHIS2 ; aucune donnée nominative",
            "Des **comptes approuvés** par l'administrateur du ministère, des accès par produit et par dossier, un **journal** de chaque action",
            "L'**export intégral** des données et des résultats à tout moment"]},
        {"head": "Ce que cela coûte et où cela va", "size": 14, "items": [
            "Logiciel **open source** : ni licence, ni frais par utilisateur",
            "Trois lignes de fonctionnement : l'hébergement du serveur du pays, l'usage de l'assistant IA au compteur, la maintenance partagée",
            "Les administrateurs du ministère gèrent déjà utilisateurs, imports et paquets",
            "Objectif proposé : un **hébergement par le ministère** à terme, par une migration structurée"]}],
     "notes": "Le détail figure dans le dossier « Sécurité, coûts et appropriation », disponible en français, et dans la note technique qui accompagne cette présentation.\n\nSi des données patients devaient un jour être hébergées, les exigences changent ; ce n'est pas le périmètre actuel."},

    {"type": "content", "title": "Une trentaine de pays, dont les voisins du Bénin", "tw": 10.8, "blocks": [
        {"t": "Une trentaine de pays partenaires du GFF disposent de leur instance FASTR, en français, en anglais ou en portugais.", "size": 16, "space": 12},
        {"t": "En Afrique de l'Ouest et du Centre : le Burkina Faso, la Côte d'Ivoire, la Guinée, le Mali, le Niger, le Sénégal, la Mauritanie, le Tchad, le Cameroun, le Nigeria et le Ghana, entre autres.", "size": 16, "space": 12},
        {"t": "Plusieurs ont commencé par le suivi de la continuité des services après des changements de financement extérieur, avant d'élargir l'usage au suivi de routine et aux revues trimestrielles.", "size": 16, "space": 12},
        {"t": "Les équipes sont formées sur leurs propres données, dans leur instance, à partir d'un programme commun : configuration, importation, analyse, restitution.", "size": 16, "space": 0},
     ],
     "notes": "Ne pas citer de résultats d'un autre pays sans son accord. Les retours d'expérience utiles pour le Bénin : la formation des formateurs au Tchad (novembre 2026), l'institutionnalisation en Mauritanie, le bulletin trimestriel au Sénégal."},

    {"type": "two_col", "title": "Ce qu'il faut pour démarrer au Bénin", "widths": [1, 1], "cols": [
        {"head": "Du côté du ministère", "size": 14, "items": [
            "Un **accès en lecture au DHIS2** par l'API, pour l'import automatique",
            "La **liste des indicateurs** à suivre et leur correspondance DHIS2",
            "Un **administrateur** désigné pour l'instance : comptes, imports, paquets",
            "Une **équipe utilisatrice** à former : analyse, interprétation, restitution"]},
        {"head": "Du côté de l'équipe FASTR", "size": 14, "items": [
            "L'instance du Bénin, en français, prête avant la formation",
            "La **note technique** sur les spécifications de la plateforme",
            "Une **présentation** et une démonstration sur les données du Bénin",
            "La **formation** : prise en main, Explorer, visualisations, présentations et rapports, puis l'appui à distance"]}],
     "notes": "Proposer un ordre : note technique, puis présentation et démonstration, puis formation sur les données du Bénin. Les prérequis du ministère tiennent en quatre lignes ; aucun n'exige d'achat."},

    {"type": "closing", "title": "La plateforme d'analyse FASTR",
     "tagline": "Analyser  ·  Apprendre  ·  Renforcer  ·  Agir",
     "contact": "Documentation et méthodologie : fastr-analytics.org/fr  ·  fastr@usefuldata.com.au",
     "notes": "Guide utilisateur, guide administrateur et méthodologie en français sur fastr-analytics.org/fr."},
]


def main():
    prs = Presentation()
    prs.slide_width = Emu(int(SW * EMU_IN))
    prs.slide_height = Emu(int(SH * EMU_IN))
    for c in CONTENT:
        BUILDERS[c["type"]](prs, c)
    total = len(CONTENT)
    no_footer = {"cover", "statement", "section", "closing"}
    for n, (c, slide) in enumerate(zip(CONTENT, prs.slides), 1):
        _fade(slide)
        if c["type"] not in no_footer:
            _footer(slide, n, total)
        if c.get("notes"):
            slide.notes_slide.notes_text_frame.text = c["notes"]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    prs.save(str(OUT))
    print(f"Wrote {len(CONTENT)} slides -> {OUT}")


if __name__ == "__main__":
    main()
