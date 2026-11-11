#!/usr/bin/env python3
"""Build the "Du BNIS au bulletin FASTR" workshop deck (Tchad, Sept 2026).

One-off deck for the DPSIS / équipe FASTR Tchad working sessions during the
SAHIT-NA preparation mission: what the BNIS covers, the audit of the tchad
FASTR instance (what is configured vs missing to produce the bulletin), and
how to proceed. Reuses the design-system archetypes from build_approche_fastr.

Audit source: FASTR multi-country MCP, instance "tchad", pinned package
"Atelier Abidjan Jour 1" (2026-08-10) — 19 common indicators, HMIS v3,
periods 202201–202601. BNIS source: "BNIS T1 2025 FINAL OBSERVATION
COLLEGUES.docx" (DPSIS/MSPP).

Usage:  python3 decks/build_bnis_tchad.py
Deps:   pip install python-pptx pillow
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import build_approche_fastr as base
from build_approche_fastr import (  # noqa: F401
    BUILDERS, DEEP_GREEN, GREEN, INK3, LIME, WHITE,
    EMU_IN, SW, SH, LEFT, CW, Emu, Presentation, _fade, _para, _rect, _tb,
)

REPO = Path(__file__).resolve().parent.parent

# Point the shared image_text/image_full archetypes at the screenshots root so
# this deck can reference the m9a_setup captures used by the handouts.
base.IMG = REPO / "resources" / "screenshots"


def _footer(slide, n, total):
    _rect(slide, LEFT, SH - 0.44, CW, 0.012, fill=base.RGBColor(0xE4, 0xE7, 0xE5))
    _, lf = _tb(slide, LEFT, SH - 0.38, CW - 1.2, 0.3)
    _para(lf, "FASTR TCHAD  ·  ATELIER BNIS  ·  SEPTEMBRE 2026", size=8, color=INK3, first=True, bold=True, space=0)
    _, pf = _tb(slide, SW - LEFT - 1.0, SH - 0.38, 1.0, 0.3)
    _para(pf, f"{n} / {total}", size=8, color=INK3, first=True, bold=True, align=base.PP_ALIGN.RIGHT, space=0)


CONTENT = [
    {"type": "cover", "title": "Du BNIS au bulletin FASTR",
     "subtitle": "Institutionnaliser le bulletin trimestriel avec la plateforme FASTR\nAtelier DPSIS · Équipe FASTR Tchad · N'Djamena, septembre 2026"},

    {"type": "statement", "kicker": "Objectif de l'atelier",
     "text": "Produire le BNIS chaque trimestre, plus vite et avec des données de meilleure qualité, en configurant ses indicateurs dans la plateforme FASTR."},

    {"type": "section", "kicker": "Partie 1", "title": "Le BNIS : ce qu'il couvre"},

    {"type": "content", "title": "Le BNIS en bref", "tw": 10.8, "blocks": [
        {"t": "Le **Bulletin National de l'Information Sanitaire (BNIS)** est la publication trimestrielle de la DPSIS — premier numéro : T1 2025, centré sur la **SRMNIA-N**.", "size": 16, "space": 12},
        {"t": "Il diffuse aux décideurs des informations sanitaires fiables issues du **DHIS2** : qualité du rapportage, surveillance, santé maternelle et infantile, nutrition, vaccination.", "size": 16, "space": 12},
        {"t": "Résultats présentés au **niveau national et par DSP** (23 provinces).", "size": 16, "space": 12},
        {"t": "Aujourd'hui, sa production est **entièrement manuelle** : extraction, tableaux et figures assemblés à la main — un travail lourd, difficile à répéter chaque trimestre.", "size": 16, "space": 0},
    ]},

    {"type": "table", "title": "Six domaines, une quarantaine d'indicateurs",
     "intro": "Contenu du BNIS T1 2025 (source : DHIS2).",
     "headers": ["Domaine", "Indicateurs (exemples)"], "colw": [3.6, 8.49], "bold_first": True, "fs": 11, "rows": [
        ["Qualité du rapportage", "Complétude et promptitude par DSP et par HN/CHU ; couverture sanitaire"],
        ["Surveillance épidémiologique", "Cas hebdomadaires : rougeole, méningite, MAM/MAS, décès maternels, palu confirmé…"],
        ["Santé maternelle", "CPN1, abandon CPN, dépistage VIH, accouchements assistés, césariennes, décès maternels"],
        ["Santé néonatale & infantile", "Décès néonatals précoces, mise au sein précoce, poids <2 500 g, consultations <5 ans"],
        ["Nutrition", "Dépistage MAM/MAS, vitamine A (6-59 mois), femmes enceintes/allaitantes malnutries"],
        ["Vaccination", "Couverture par antigène (16 antigènes : BCG, Penta, PCV, ROTA, VPO, VPI, VAR, VAA, Td)"],
     ]},

    {"type": "contrast", "title": "Pourquoi passer par la plateforme ?", "cols": [
        {"head": "Aujourd'hui — production manuelle", "accent": INK3, "items": [
            "Extraction, tableaux et figures refaits à la main chaque trimestre",
            "Couvertures vaccinales **supérieures à 100 %** (Penta1 : 115,9 % national ; jusqu'à 148–182 % par DSP) — dénominateurs non traités",
            "Pas d'ajustement des valeurs aberrantes ni de la complétude (Tibesti : 10,8 %)"]},
        {"head": "Avec la plateforme FASTR", "accent": GREEN, "items": [
            "Analyses et visualisations **régénérées à chaque mise à jour** des données",
            "**Dénominateurs alternatifs** et estimations de couverture calibrées sur les enquêtes",
            "Qualité des données évaluée et **ajustée avant analyse** ; assistant IA pour l'interprétation"]},
    ], "bottom": [
        ("Le constat", "Les chiffres du BNIS existent déjà dans DHIS2 — c'est leur mise en qualité et leur mise en forme qui coûtent du temps", INK3),
        ("La proposition", "Configurer les indicateurs du BNIS dans FASTR pour produire le bulletin à partir de la plateforme", GREEN),
    ]},

    {"type": "section", "kicker": "Partie 2", "title": "Audit : où en est l'instance FASTR Tchad ?"},

    {"type": "content", "title": "L'instance FASTR Tchad aujourd'hui", "tw": 10.8, "blocks": [
        {"t": "Ce que l'audit de l'instance (1er septembre 2026) montre :", "size": 16, "space": 12},
        {"t": "**2 732 formations sanitaires** chargées — 23 provinces, 199 départements", "bullet": True, "size": 15},
        {"t": "Données HMIS mensuelles de **janvier 2022 à janvier 2026** (version 3)", "bullet": True, "size": 15},
        {"t": "**19 indicateurs communs** configurés (détail à la diapositive suivante)", "bullet": True, "size": 15},
        {"t": "Modules analytiques actifs : **qualité des données** (aberrants, complétude, cohérence), **ajustements**, **volumes et perturbations**, **dénominateurs et couverture**", "bullet": True, "size": 15},
        {"t": "Paquet de résultats épinglé : « Atelier Abidjan Jour 1 » (10 août 2026) — les données s'arrêtent à janvier 2026 : une **actualisation est nécessaire** pour un bulletin 2026.", "size": 15, "space": 0},
    ]},

    {"type": "two_col", "title": "Déjà configuré : 19 indicateurs", "widths": [1, 1], "cols": [
        {"head": "Santé maternelle & néonatale", "size": 13, "items": [
            "CPN 1  ·  CPN 4",
            "Accouchement dans la FOSA",
            "Accouchement par césarienne",
            "CPoN 1 (mère)  ·  CPoN 1 (nouveau-né)",
            "Femmes enceintes vues en CPN1 dépistées pour le VIH",
            "Enfants nés de mères séro+ dépistés 2-8 sem. (PCR)",
            "Naissances vivantes avec bulletin de naissance"]},
        {"head": "PF, consultations, nutrition, palu, vaccination", "size": 13, "items": [
            "Nouvelles acceptatrices (PF)",
            "Consultations externes  ·  Total consultation curative",
            "Enfants dépistés malnutris (total)",
            "Paludisme confirmé chez les femmes enceintes (TDR/micro.)",
            "BCG  ·  Penta 1  ·  Penta 3  ·  VAR 1  ·  VAR 2"],
         "note": "CPN1 + CPN4 déjà en place : le taux d'abandon de la CPN est dérivable immédiatement."},
    ]},

    {"type": "table", "title": "Ce qui manque pour produire le BNIS",
     "intro": "Écarts entre le contenu du BNIS T1 2025 et les indicateurs configurés dans l'instance.",
     "headers": ["Domaine BNIS", "Déjà dans FASTR", "À configurer"], "colw": [2.5, 4.2, 5.39], "bold_first": True, "fs": 10, "rows": [
        ["Santé maternelle", "CPN1, CPN4, dépistage VIH, accouchements FOSA, césariennes", "Décès maternels ; complications ; FE séro+ sous ARV ; FE malnutries ; nouveaux cas FE"],
        ["Néonatal & infantile", "CPoN1 (mère et nouveau-né)", "Décès néonatals précoces et périnatals ; mise au sein précoce ; poids <2 500 g ; consultations <5 ans"],
        ["Nutrition", "Enfants dépistés malnutris (total)", "MAM et MAS séparés ; vitamine A (6-59 mois) ; femmes allaitantes malnutries"],
        ["Vaccination", "BCG, Penta1, Penta3, VAR1, VAR2 (5 antigènes)", "PCV 1-3, ROTA 1-2, VPO 0/1/3, VPI2, VAA, Td1/Td2+ (11 antigènes) ; enfants complètement vaccinés"],
        ["Qualité du rapportage", "Complétude, aberrants, cohérence (indicateurs chargés)", "Rapprochement avec la complétude/promptitude RMA du DHIS2"],
        ["Surveillance hebdo.", "—", "Hors périmètre HMIS mensuel — source hebdomadaire à discuter"],
     ], "note": "Environ la moitié du contenu SRMNIA-N du BNIS est déjà couvert ; la vaccination et la mortalité concentrent l'essentiel des écarts."},

    {"type": "content", "title": "Ce que la plateforme apporte déjà, au-delà du BNIS", "tw": 10.8, "blocks": [
        {"t": "Pour chaque indicateur configuré, la plateforme produit automatiquement :", "size": 16, "space": 12},
        {"t": "**Qualité des données** — valeurs aberrantes, complétude, cohérence interne, score composite par formation sanitaire", "bullet": True, "size": 15},
        {"t": "**Volumes ajustés** — l'effet des corrections d'aberrants et de complétude est quantifié, pas ignoré", "bullet": True, "size": 15},
        {"t": "**Perturbations et excédents** — volumes réels vs attendus, au niveau national et par province", "bullet": True, "size": 15},
        {"t": "**Couverture avec dénominateurs alternatifs** — la réponse directe aux couvertures vaccinales >100 % du BNIS", "bullet": True, "size": 15},
        {"t": "Autant d'analyses prêtes à enrichir le bulletin sans travail manuel supplémentaire.", "size": 15, "italic": True, "space": 0},
    ]},

    {"type": "section", "kicker": "Partie 3", "title": "Comment procéder"},

    {"type": "numbered", "title": "Quatre étapes", "steps": [
        ("Actualiser les données", "Nouvelle extraction DHIS2 au-delà de janvier 2026, pour couvrir les trimestres 2026 du bulletin."),
        ("Configurer les indicateurs", "Cartographier les éléments de données DHIS2 manquants (vaccins, mortalité, nutrition) vers des indicateurs communs."),
        ("Valider les définitions", "Une fiche par indicateur : définition, numérateur/dénominateur, source DHIS2, désagrégation (DSP, trimestre)."),
        ("Produire le bulletin", "Générer analyses et visualisations depuis la plateforme ; rédiger et valider le premier numéro assisté par FASTR."),
    ], "footer": "Les étapes 2 et 3 sont le cœur des séances de travail de cette mission."},

    {"type": "content", "title": "Le principe : relier DHIS2 et FASTR", "tw": 10.8, "blocks": [
        {"t": "**FASTR et DHIS2 sont deux bases de données distinctes.** Pour utiliser un indicateur DHIS2 dans FASTR, on relie les deux : on importe l'indicateur depuis DHIS2, puis on le mappe à un « **indicateur commun** » dans la plateforme.", "size": 16, "space": 12},
        {"t": "**Indicateurs DHIS2 (bruts)** — les identifiants techniques du pays (UID de 11 caractères, p. ex. qHJdhOrhklI)", "bullet": True, "size": 15},
        {"t": "**Indicateurs communs** — les noms standardisés avec lesquels on analyse (p. ex. penta2, vit_a) ; plusieurs indicateurs DHIS2 mappés au même indicateur commun sont **additionnés**", "bullet": True, "size": 15},
        {"t": "**Indicateurs calculés** — les mesures dérivées : numérateur / dénominateur + seuils de couleur (p. ex. taux d'abandon CPN, couvertures)", "bullet": True, "size": 15},
        {"t": "Ces trois onglets se trouvent dans **Données → Indicateurs**.", "size": 15, "italic": True, "space": 0},
    ]},

    {"type": "numbered", "title": "Ajouter un indicateur : cinq phases", "steps": [
        ("Identifier", "Dans DHIS2 : trouver l'indicateur, noter son nom officiel et son UID (11 caractères)."),
        ("Documenter", "Dans le fichier Excel (modèle de cartographie) : noms et UID, avant de toucher à la plateforme."),
        ("Créer le commun", "Dans FASTR : « Créer un indicateur commun » — un ID commun + un libellé."),
        ("Importer le DHIS2", "« Importer un indicateur DHIS2 » : recherche par UID, Ajouter, Enregistrer la sélection."),
        ("Mapper", "Sur l'indicateur commun : icône crayon, bouton +, sélectionner l'indicateur DHIS2 correspondant."),
    ], "footer": "Puis : Données → Nouvelle importation → « Importer directement depuis DHIS2 » pour télécharger les valeurs et la période."},

    {"type": "content", "title": "Qu'est-ce qu'un indicateur commun ?", "tw": 10.8, "blocks": [
        {"t": "L'**indicateur commun** est le nom standardisé avec lequel les analystes travaillent — le « contenant » FASTR qui accueille les données venant de DHIS2.", "size": 16, "space": 12},
        {"t": "**Pourquoi cette abstraction ?** Un même indicateur commun (p. ex. anc1) peut correspondre à des identifiants DHIS2 différents selon les pays ou les configurations. Les modules d'analyse et les visualisations référencent le nom commun — ils restent stables même si la source DHIS2 change.", "size": 15, "space": 10},
        {"t": "Chaque indicateur commun se compose de : un **ID** (p. ex. anc1), un **libellé** d'affichage, et des **correspondances** vers un ou plusieurs indicateurs DHIS2 bruts — plusieurs indicateurs bruts mappés au même commun voient leurs valeurs **additionnées** (utile p. ex. pour CPoN1 total = mères + nouveau-nés).", "size": 15, "space": 10},
        {"t": "FASTR fournit une **liste d'indicateurs par défaut** (les prioritaires SRMNIA-N, colonne « Par défaut » ✓) : vérifiez-la avant de créer un nouvel indicateur — s'il y figure déjà, il n'y a rien à créer, seulement à mapper.", "size": 15, "space": 10},
        {"t": "C'est pourquoi bien choisir l'ID et le libellé est important — diapositive suivante.", "size": 15, "italic": True, "space": 0},
    ]},

    {"type": "contrast", "title": "Bien nommer les indicateurs communs", "cols": [
        {"head": "À éviter", "accent": INK3, "items": [
            "`uTj3xK9pLm2` — un UID brut illisible",
            "`CPN1 Premier Trimestre` — espaces, majuscules, accents",
            "Libellé : « Nombre total de consultations prénatales réalisées au premier trimestre dans les établissements publics »"]},
        {"head": "À privilégier", "accent": GREEN, "items": [
            "`cpn1_premier_trimestre` — snake_case, minuscules, tirets bas",
            "`taux_mortalite_maternelle`, `nb_accouchements_assistes`",
            "Libellé court : « CPN1 (établissements publics) » — lisible sur les graphiques"]},
    ], "bottom": [
        ("Règle", "Un ID commun ne peut plus être modifié après création — le renommer briserait les références aux données", INK3),
        ("Pourquoi", "Seuls les ID en minuscules/chiffres/tirets bas sont utilisables dans les indicateurs calculés (taux, couvertures)", GREEN),
    ]},

    {"type": "image_text", "title": "Phase 3 — Créer l'indicateur commun",
     "image": "m9a_setup/08_create_common_form_fr.png", "side": "left", "tw": 4.3, "blocks": [
        {"t": "Dans **Données → Indicateurs**, onglet **Indicateur commun** :", "space": 10},
        {"t": "Cliquez sur **Créer un indicateur commun**", "bullet": True},
        {"t": "**ID commun** — sans accents ni espaces, tirets bas acceptés (p. ex. `mam_nouveau`)", "bullet": True},
        {"t": "**Libellé** — le nom affiché (colonne C du modèle de cartographie)", "bullet": True},
        {"t": "**Sauvegarder**, puis répétez pour chaque indicateur de votre liste", "bullet": True},
        {"t": "Le contenant est prêt — il ne contient pas encore de données.", "italic": True, "space": 0},
     ]},

    {"type": "image_text", "title": "Phase 4 — Importer l'indicateur DHIS2",
     "image": "m9a_setup/10_dhis2_search_results_fr.png", "side": "left", "tw": 4.3, "blocks": [
        {"t": "Onglet **Indicateurs DHIS2** → **Importer un indicateur DHIS2** :", "space": 10},
        {"t": "La **connexion DHIS2 enregistrée** de l'instance est utilisée automatiquement", "bullet": True},
        {"t": "Recherchez par **UID** (colonne G du modèle) ou par mot-clé large (p. ex. `vaccin`, `accouchement`)", "bullet": True},
        {"t": "Cliquez sur **Ajouter** pour chaque résultat voulu — le panneau « Éléments sélectionnés » se remplit", "bullet": True},
        {"t": "Terminez par **Enregistrer la sélection (N)** en haut à droite", "bullet": True},
     ]},

    {"type": "image_text", "title": "Phase 5 — Mapper vers l'indicateur commun",
     "image": "m9a_setup/11_mapping_panel_fr.png", "side": "left", "tw": 4.3, "blocks": [
        {"t": "De retour dans l'onglet **Indicateur commun** :", "space": 10},
        {"t": "Sélectionnez l'indicateur commun préparé et cliquez sur l'**icône crayon**", "bullet": True},
        {"t": "Cliquez sur le bouton **+** sous « Indicateurs DHIS2 associés »", "bullet": True},
        {"t": "Choisissez l'indicateur DHIS2 correspondant dans la liste, puis **Sauvegarder**", "bullet": True},
        {"t": "Règle : chaque indicateur DHIS2 pointe vers **exactement un** indicateur commun (plusieurs DHIS2 → un commun : les valeurs s'additionnent).", "italic": True, "space": 0},
     ]},

    {"type": "image_text", "title": "Vérifier le mapping",
     "image": "m9a_setup/12_all_mapped_fr.png", "side": "left", "tw": 4.3, "blocks": [
        {"t": "Avant d'importer les données, vérifiez le résultat des cinq phases :", "space": 10},
        {"t": "Sur la page **Indicateurs**, chaque indicateur commun doit afficher dans la colonne **« Associé à »** l'identifiant DHIS2 qui lui est mappé", "bullet": True},
        {"t": "Un indicateur commun **sans « Associé à »** ne recevra aucune donnée — retournez à la phase 5", "bullet": True},
        {"t": "Vérifiez aussi l'onglet **Indicateurs DHIS2** : chaque indicateur importé doit être associé à un commun", "bullet": True},
        {"t": "Le mapping est complet — il reste à télécharger les valeurs.", "italic": True, "space": 0},
     ]},

    {"type": "image_text", "title": "Télécharger les données des nouveaux indicateurs",
     "image": "m9a_setup/26_wizard_indicators_fr.png", "side": "left", "tw": 4.3, "blocks": [
        {"t": "**Données → Données → Importations → Nouvelle importation DHIS2** — un assistant en cinq étapes :", "space": 10},
        {"t": "**Identifiants** — la connexion DHIS2 (enregistrée ou pour la session)", "bullet": True},
        {"t": "**Indicateurs** — cochez les indicateurs bruts à importer (les nouveaux mappés)", "bullet": True},
        {"t": "**Heure** — maintenant, à une heure donnée, ou **récurrente** (idéal pour actualiser le bulletin chaque trimestre)", "bullet": True},
        {"t": "**Configuration** — la **plage de périodes** (de quel mois à quel mois)", "bullet": True},
        {"t": "**Vérifier et lancer** — l'importation s'exécute ; suivez-la dans l'onglet « En cours »", "bullet": True},
        {"t": "Les nouveaux indicateurs sont prêts à être analysés aux côtés des 19 existants.", "italic": True, "space": 0},
     ]},

    {"type": "content", "title": "Deux accélérateurs pour nos ~20 indicateurs", "tw": 10.8, "blocks": [
        {"t": "**Importation groupée (CSV)** — plutôt que de créer les indicateurs un par un, un fichier CSV peut charger toutes les définitions d'un coup : idéal pour les 11 antigènes et les indicateurs de mortalité et de nutrition à ajouter.", "size": 16, "space": 12},
        {"t": "**Indicateurs calculés** — les taux du BNIS (abandon CPN, césarienne, couvertures par antigène) se définissent directement dans la plateforme : numérateur, dénominateur, et seuils de couleur (vert / jaune / rouge) pour la lecture rapide.", "size": 16, "space": 12},
        {"t": "Le handout pas-à-pas « **Importer et mapper les indicateurs** » (série Configuration de l'instance, avec captures d'écran) sera distribué en séance — chaque groupe l'utilisera comme guide d'exercice.", "size": 15, "italic": True, "space": 0},
    ]},

    {"type": "two_col", "title": "Deux groupes de travail", "widths": [1, 1], "cols": [
        {"head": "Groupe 1 — indicateurs du BNIS 2025", "size": 14, "items": [
            "Intégrer les indicateurs du bulletin élaboré en 2025 (déjà consensuels)",
            "Prioriser : vaccination (11 antigènes), mortalité, nutrition",
            "Documenter chaque indicateur (fiche de définition)"],
         "note": "Produit : le socle du bulletin trimestriel FASTR."},
        {"head": "Groupe 2 — indicateurs des réunions de la plateforme", "size": 14, "items": [
            "Intégrer les indicateurs présentés lors des réunions de la plateforme",
            "Vérifier la cohérence avec les indicateurs du groupe 1",
            "Identifier les besoins de renforcement des capacités"],
         "note": "Produit : la présentation SRMNIA-N mise à jour régulièrement."},
    ]},

    {"type": "table", "title": "Séances proposées pendant la mission",
     "intro": "Créneaux provisoires — l'agenda de la mission est susceptible d'être modifié ; confirmation au fil de la semaine.",
     "headers": ["Séance", "Créneau proposé", "Contenu"], "colw": [1.6, 3.0, 7.49], "bold_first": True, "fs": 11.5, "rows": [
        ["Séance 1", "Lundi 7 sept., après-midi", "Démonstration des nouvelles fonctionnalités ; constitution des deux groupes"],
        ["Séance 2", "Mercredi 9 sept., après-midi", "Atelier d'intégration : configuration des indicateurs par groupe"],
        ["Séance 3", "Jeudi 10 sept. PM ou vendredi 11 sept.", "Maquettes du bulletin et de la présentation SRMNIA-N ; responsabilités ; feuille de route"],
     ], "note": "Préparatifs : accès plateforme vérifiés pour chaque participant ; salle avec connexion internet et vidéoprojecteur ; handouts « Configuration de l'instance » imprimés (connexion, indicateurs, importation des données, vérification)."},

    {"type": "demo", "eyebrow": "Démonstration en direct · instance Tchad", "title": "La plateforme FASTR, en direct",
     "lead": "Passons à l'instance Tchad pour voir le flux de bout en bout :",
     "cues": [
        "Parcourir les 19 indicateurs configurés et leurs analyses de qualité",
        "Explorer volumes, perturbations et couverture avec dénominateurs alternatifs",
        "Interroger l'assistant IA, puis générer un extrait prêt pour le bulletin",
     ]},

    {"type": "cycle", "title": "Deux produits réguliers, un même cycle", "nodes": [
        ("Analyser", "Données DHIS2 actualisées, qualité évaluée et ajustée chaque trimestre"),
        ("Apprendre", "Bulletin trimestriel FASTR : constats partagés avec les décideurs"),
        ("Renforcer", "Présentation SRMNIA-N : dialogue sectoriel et capacités de la DPSIS"),
        ("Agir", "Décisions et corrections de trajectoire fondées sur les données"),
    ], "footer": "…et le cycle recommence, trimestre après trimestre — porté par la DPSIS."},

    {"type": "closing", "title": "Du BNIS au bulletin FASTR",
     "tagline": "Des données de routine aux décisions — chaque trimestre"},
]


def main():
    prs = Presentation()
    prs.slide_width = Emu(int(SW * EMU_IN))
    prs.slide_height = Emu(int(SH * EMU_IN))
    for c in CONTENT:
        BUILDERS[c["type"]](prs, c)
    total = len(CONTENT)
    no_footer = {"cover", "section", "statement", "closing"}
    for n, (c, slide) in enumerate(zip(CONTENT, prs.slides), 1):
        _fade(slide)
        if c["type"] not in no_footer:
            _footer(slide, n, total)
    out = str(REPO / "decks" / "fr" / "bnis_fastr_tchad.pptx")
    prs.save(out)
    print(f"Wrote {len(CONTENT)} slides -> {out}")


if __name__ == "__main__":
    main()
