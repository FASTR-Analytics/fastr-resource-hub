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
     "notes": "Lire l'acronyme à voix haute : des évaluations fréquentes, et des outils qui rendent le système plus résilient.\n\nCette présentation répond à une question posée par le ministère : qu'est-ce qui distingue cet outil de ceux déjà utilisés sur le terrain ? Elle montre l'interface, écran par écran. Environ quinze minutes, puis une démonstration en direct si la connexion le permet."},

    {"type": "statement", "kicker": "La question",
     "text": "Les formations sanitaires du Bénin déclarent leurs activités chaque mois dans le DHIS2. Comment transformer ces données, chaque trimestre, en décisions de programme, sans attendre la prochaine enquête ?",
     "notes": "Partir du constat que le ministère connaît : les données existent, elles arrivent chaque mois, et pourtant la plupart des décisions entre deux enquêtes se prennent sans analyse récente de ces données."},

    {"type": "diagram", "title": "Le circuit mensuel : à la main, et avec la plateforme",
     "intro": "Même point de départ, le DHIS2. La différence est ce qui se passe entre l'export et le rapport.",
     "image": "diagrams_fr/workflow_manual_vs_fastr.svg",
     "footer": "La plateforme ne remplace ni le DHIS2 ni les enquêtes : elle fait le travail situé entre les données brutes et le rapport.",
     "notes": "Rangée du haut : quatre étapes refaites chaque mois, avec un copier-coller à chaque passage. Demander à la salle combien de temps prend un rapport mensuel aujourd'hui.\n\nRangée du bas : l'administrateur importe par l'API du DHIS2 et génère un paquet de résultats ; l'utilisateur met à jour son rapport à partir du paquet."},

    # ---- Visite de l'interface ---------------------------------------------
    {"type": "section", "kicker": "Visite de l'interface", "title": "Ce que voit un utilisateur, écran par écran"},

    {"type": "image_text", "title": "Connectée au DHIS2 : plus rien à télécharger à la main", "side": "right", "tw": 4.6,
     "image": "screenshots/platform_v2_fr/16_data.png", "blocks": [
        {"t": "La page **Données** relie la plateforme au DHIS2 du pays. L'importation des derniers mois se lance en un clic ou se programme, et se répète seule.", "space": 10},
        {"t": "Les enquêtes auprès des formations sanitaires, les enquêtes ménages et les données de population se chargent au même endroit : **toutes les sources pour tout le pays**.", "space": 10},
        {"t": "Fini les exports indicateur par indicateur et les fichiers Excel qui circulent.", "space": 0},
     ],
     "notes": "Page réservée aux administrateurs. La structure sanitaire, les indicateurs et les sources sont configurés une fois ; ensuite l'import est mensuel et automatique."},

    {"type": "image_text", "title": "Un paquet de résultats : toutes les analyses calculées en une fois", "side": "right", "tw": 4.6,
     "image": "screenshots/platform_v2_fr/15_results_packages.png", "blocks": [
        {"t": "Sur la page **Résultats**, l'administrateur génère un paquet : qualité des données évaluée et corrigée, perturbations, couverture, pour tous les indicateurs et toutes les zones.", "space": 10},
        {"t": "Les méthodes sont intégrées et identiques dans une trentaine de pays. **Personne n'écrit de code.**", "space": 10},
        {"t": "Un nouveau mois de données donne un nouveau paquet ; tous les rapports du pays le lisent.", "space": 0},
     ],
     "notes": "Le paquet est la pièce centrale : il est calculé une fois, partagé par tous, et chaque rapport y est relié. C'est ce qui rend la mise à jour mensuelle possible sans refaire le travail."},

    {"type": "image_text", "title": "Explorer : tous les résultats, en lecture directe", "side": "right", "tw": 4.6,
     "image": "screenshots/tchad_2026_11/13_explore.png", "blocks": [
        {"t": "La page **Explorer** montre chaque analyse du paquet en tableau, en graphiques dans le temps ou en carte, par province, département ou sous-préfecture.", "space": 10},
        {"t": "Un filtre sur le niveau, les indicateurs et la période. Rien à créer, rien à casser : on regarde avant de construire.", "space": 0},
     ],
     "notes": "Capture d'une instance pays (Tchad, novembre 2026). Montrer la même page sur l'instance du Bénin dès que les données sont importées."},

    {"type": "image_text", "title": "Une analyse des perturbations que l'on ne trouve nulle part ailleurs", "side": "right", "tw": 4.6,
     "image": "screenshots/tchad_2026_11/20_explore_disruption_observed_expected.png", "blocks": [
        {"t": "Pour chaque service, la plateforme calcule ce que le volume **aurait dû être**, compte tenu de l'historique de chaque établissement, de la tendance et de la saison, et signale les mois qui s'en écartent : rouge en dessous, vert au-dessus.", "space": 10},
        {"t": "Elle distingue une baisse due à des établissements qui n'ont pas rapporté d'une **baisse réelle des services**.", "space": 10},
        {"t": "Un tableau de bord montre le volume déclaré ; FASTR dit s'il est anormal, depuis quand, de combien et où.", "space": 0},
     ],
     "notes": "Capture réelle (Tchad). C'est le point qui distingue le plus FASTR d'un tableau de bord. Plusieurs pays s'en servent pour suivre mois par mois l'effet des changements de financement sur les services."},

    {"type": "image_text", "title": "La couverture, alignée sur Countdown, sans dépendre des projections de population", "side": "right", "tw": 4.6,
     "image": "screenshots/platform_v2_fr/13e_explore_coverage_table.png", "blocks": [
        {"t": "La couverture habituelle divise les services par une population projetée depuis le dernier recensement ; quand la projection est fausse, la couverture l'est aussi.", "space": 10},
        {"t": "FASTR estime les dénominateurs **à partir des services eux-mêmes** (CPN1, accouchements, naissances vivantes, Penta1), calés sur la dernière enquête, selon la méthode de Countdown to 2030.", "space": 10},
        {"t": "Gris : routine. Noir : enquête. Rouge : projection. La couverture est suivie chaque mois, entre deux enquêtes.", "space": 0},
     ],
     "notes": "Capture du site de démonstration en français. L'enquête reste la référence ; la plateforme comble les années entre deux enquêtes, au niveau national et par région."},

    {"type": "image_text", "title": "Un espace de travail partagé, rangé en dossiers", "side": "right", "tw": 4.6,
     "image": "screenshots/tchad_2026_11/01_home_products.png", "blocks": [
        {"t": "La page **Produits** fonctionne comme un disque partagé par tout le pays : des dossiers, et dedans les visualisations, présentations et rapports de l'équipe.", "space": 10},
        {"t": "Chaque produit indique le paquet de résultats qu'il lit. Tout s'enregistre en continu, avec un historique des versions ; plusieurs personnes travaillent sur la même présentation.", "space": 10},
        {"t": "Les comptes sont approuvés par le ministère ; l'accès se règle par dossier et par produit : **chacun voit ce qu'il doit voir**.", "space": 0},
     ],
     "notes": "Capture de l'instance Tchad. Un utilisateur peut aussi être limité à une région ou à une période par une portée : il ne voit que son périmètre, partout dans la plateforme."},

    {"type": "image_text", "title": "Un graphique se construit en quelques clics, sans code", "side": "right", "tw": 4.6,
     "image": "screenshots/platform_v2_fr/11c_visualization_timeseries_anc1.png", "blocks": [
        {"t": "On choisit un module et une métrique, puis un préréglage ou un type de graphique. L'éditeur permet de **filtrer** (une région, une période) et de **désagréger** (une courbe par province).", "space": 10},
        {"t": "Le graphique est enregistré dans le dossier de l'utilisateur et peut être inséré dans n'importe quelle présentation ou rapport.", "space": 0},
     ],
     "notes": "Capture du site de démonstration. Le même graphique sert ensuite à tout le monde : revue, bulletin, note."},

    {"type": "image_text", "title": "Conçue pour produire de bonnes présentations et de bons rapports", "side": "right", "tw": 4.6,
     "image": "screenshots/platform_v2_fr/27_slide_with_visualization.png", "blocks": [
        {"t": "Les présentations et les rapports se composent dans la plateforme : thèmes, logo du ministère, pied de page, diapositives avec graphique et interprétation.", "space": 10},
        {"t": "Les figures restent **reliées au paquet** : quand un nouveau mois arrive, elles se mettent à jour. Le rapport mensuel devient un produit que l'on met à jour, pas un fichier que l'on refait.", "space": 10},
        {"t": "Présentation depuis la plateforme, téléchargement ou partage direct.", "space": 0},
     ],
     "notes": "Capture du site de démonstration. L'éditeur de rapport fonctionne comme un traitement de texte, avec les figures en direct."},

    {"type": "image_text", "title": "Un assistant IA intégré, qui lit vos données", "side": "right", "tw": 4.6,
     "image": "screenshots/platform_v2_fr/20c_deck_editor_ai_panel.png", "blocks": [
        {"t": "Dans chaque produit, un panneau **IA** répond à des questions posées en français, construit ou modifie des graphiques, propose une interprétation et rédige un premier jet de rapport.", "space": 10},
        {"t": "Il travaille uniquement à partir des résultats calculés dans la plateforme : **il n'invente aucun chiffre**. L'équipe relit et garde la main.", "space": 0},
     ],
     "notes": "Capture du site de démonstration en français, éditeur de présentation avec le panneau IA ouvert. En démonstration, demander à l'assistant un graphique puis une interprétation pour montrer les deux usages."},

    # ---- Synthèse ----------------------------------------------------------
    {"type": "contrast", "title": "Ce qui distingue la plateforme FASTR", "cols": [
        {"head": "Ce qu'elle fait", "accent": DEEP_GREEN, "items": [
            "**Connectée au DHIS2**, toutes les sources au même endroit, plus rien à télécharger",
            "**Qualité** vérifiée et corrigée ; **perturbations** détectées par rapport à l'attendu ; **couverture** alignée sur Countdown",
            "Rapports et présentations **reliés aux résultats**, mis à jour chaque mois, avec un **assistant IA** intégré",
            "Un espace **collaboratif**, des accès réglés par le ministère, la même méthode dans une trentaine de pays"]},
        {"head": "Ce qu'elle ne fait pas", "accent": GREEN, "items": [
            "Elle ne remplace pas le **DHIS2** : elle s'y connecte",
            "Elle ne remplace pas les **enquêtes** : elle comble les années entre elles",
            "Elle ne **décide** pas : elle dit où regarder ; le pourquoi et l'action restent au ministère"]},
     ], "bottom": [
        ("Tableau de bord", "Montre les chiffres déclarés, tels quels, dans un format choisi.", INK3),
        ("Plateforme FASTR", "Dit si les chiffres sont fiables, s'ils s'écartent de l'attendu et ce qu'ils représentent en couverture.", GREEN),
     ],
     "notes": "C'est la diapositive qui répond à la question du ministère. La note technique qui accompagne la présentation reprend ces points un par un."},

    {"type": "two_col", "title": "Les données restent celles du pays", "widths": [1, 1], "cols": [
        {"head": "Sécurité et souveraineté", "size": 14, "items": [
            "Une **installation séparée par pays**, sans accès entre pays",
            "Des **totaux agrégés** seulement, les mêmes que dans le DHIS2 ; aucune donnée nominative",
            "Des comptes approuvés par le ministère, un **journal** de chaque action, l'**export intégral** à tout moment"]},
        {"head": "Coût et appropriation", "size": 14, "items": [
            "Logiciel **libre** : ni licence, ni frais par utilisateur",
            "Interface en **français** ; rien à installer, un navigateur suffit",
            "Les administrateurs du ministère gèrent utilisateurs, imports et paquets ; objectif d'un **hébergement par le ministère** à terme"]}],
     "notes": "Le détail figure dans le dossier « Sécurité, coûts et appropriation », disponible en français."},

    {"type": "two_col", "title": "Une trentaine de pays, et ce qu'il faut pour démarrer au Bénin", "widths": [1, 1], "cols": [
        {"head": "Où la plateforme est en service", "size": 14, "items": [
            "Une trentaine de pays partenaires du GFF, en français, anglais ou portugais",
            "En Afrique de l'Ouest et du Centre : Burkina Faso, Côte d'Ivoire, Guinée, Mali, Niger, Sénégal, Mauritanie, Tchad, Cameroun, Nigeria, Ghana",
            "Les équipes sont formées sur leurs propres données, dans leur instance"]},
        {"head": "Pour démarrer", "size": 14, "items": [
            "Un **accès en lecture au DHIS2**, pour la connexion automatique",
            "La **liste des indicateurs** à suivre",
            "Un **administrateur** au ministère et une **équipe à former**",
            "L'équipe FASTR prépare l'instance en français, puis présentation, démonstration et formation"]}],
     "notes": "Ne pas citer de résultats d'un autre pays sans son accord. Proposer l'ordre : note technique, présentation et démonstration, formation sur les données du Bénin."},

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
