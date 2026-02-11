# Pour commencer

## Orientation

### Vue d'ensemble des données
```prompt
Montre-moi une vue d'ensemble des données : quels indicateurs, régions et périodes temporelles sont disponibles ? Crée une diapositive résumant la couverture des données.
```

### Dernières mises à jour
```prompt
Quelles sont les mises à jour de données les plus récentes ? Montre-moi la dernière période de rapportage et mets en évidence les changements notables avec une visualisation.
```

# Qualité des données

## Évaluation

### Revue de la qualité
```prompt
Crée un tableau de bord de la qualité des données pour [RÉGION/PÉRIODE]. Montre-moi :
- Les tendances de complétude au fil du temps
- Les signalements de valeurs aberrantes par indicateur
- Une diapositive de synthèse avec les principaux problèmes de qualité et les recommandations
Utilise des visualisations pour rendre les tendances claires.
```

### Vérification de la complétude
```prompt
Analyse la complétude des données à travers les établissements et les périodes. Montre-moi une carte thermique de la complétude et identifie :
- Les établissements avec un rapportage incomplet
- Les périodes avec des données manquantes
- Les tendances dans les lacunes de données qui pourraient indiquer des problèmes systématiques
```

### Détection des valeurs aberrantes
```prompt
Examine les données pour détecter les valeurs aberrantes potentielles ou les problèmes de qualité. Montre les valeurs aberrantes visuellement et vérifie :
- Les valeurs statistiquement inhabituelles
- Les hausses ou baisses soudaines pouvant indiquer des erreurs de rapportage
- Les tendances dans les données manquantes
- Les incohérences entre les indicateurs connexes
```

### Contrôle de validation
```prompt
Valide les données pour [NOM DE L'INDICATEUR] en :
- Vérifiant les valeurs impossibles
- Comparant avec les indicateurs connexes
- Identifiant les tendances inhabituelles
- Suggérant les corrections potentielles des données
```

# Analyse

## Tendances et schémas

### Identifier les tendances clés
```prompt
Analyse les indicateurs de santé clés au cours des 12 derniers mois et crée un jeu de diapositives d'analyse des tendances :
- Une diapositive par tendance significative avec une visualisation en séries temporelles
- Une diapositive de synthèse mettant en évidence les 3 principales améliorations et les 3 principales préoccupations
- Inclus des chiffres précis et des pourcentages de variation sur chaque diapositive
```

### Comparer les régions
```prompt
Compare les performances des indicateurs de santé entre les régions administratives et crée des diapositives comparatives :
- Un graphique comparant toutes les régions avec des niveaux de performance codés par couleur
- Un tableau montrant les régions les plus et les moins performantes avec le pourcentage de variation
- Une diapositive mettant en évidence les régions les plus améliorées et les plus préoccupantes
```

### Analyse période par période
```prompt
Compare les performances de la période actuelle avec celles de la période précédente pour les indicateurs clés. Montre la comparaison avec une visualisation mettant en évidence les changements. Identifie :
- Les indicateurs avec des changements significatifs
- Si les changements correspondent aux tendances attendues
- Les domaines nécessitant une attention immédiate
```

### Où concentrer les efforts
```prompt
Sur la base des données, quelles régions ou indicateurs devrions-nous prioriser pour le soutien ? Identifie les zones avec des performances en déclin ou des lacunes persistantes. Crée une diapositive de synthèse montrant les zones prioritaires.
```

# Analyse des indicateurs

FASTR se concentre sur les indicateurs fondamentaux de SRMNIA-N qui représentent des points clés du continuum de soins. Ces indicateurs ont généralement des volumes de rapportage plus élevés et servent d'indicateurs indirects pour les schémas plus larges de prestation de services.

## Santé maternelle

### Perturbations des CPN
```prompt
Analyse les CPN1 et CPN4 pour détecter les perturbations et crée des diapositives de visualisation montrant :
- Les volumes réels par rapport aux volumes attendus avec les périodes de perturbation mises en évidence
- La répartition régionale des zones les plus touchées
- Une diapositive de synthèse avec les principales conclusions et les services manqués estimés
```

### Services d'accouchement
```prompt
Analyse les tendances des accouchements institutionnels et crée des diapositives de visualisation montrant :
- Les volumes réels par rapport aux volumes attendus avec les périodes de perturbation mises en évidence
- La variation infranationale entre les régions
- Une diapositive de synthèse avec les principales conclusions
```

### Soins postnatals
```prompt
Analyse les CPoN pour détecter les perturbations et crée des diapositives de visualisation montrant :
- Les volumes réels de CPoN par rapport aux volumes attendus avec les périodes de perturbation mises en évidence
- Si les visites de CPoN suivent l'évolution des accouchements
- Les écarts entre les volumes de services attendus et réels par région
```

## Santé infantile

### Couverture vaccinale
```prompt
Analyse le BCG, le Penta1 et le Penta3 pour détecter les perturbations et crée des diapositives de visualisation montrant :
- Les volumes réels par rapport aux volumes attendus pour chaque vaccin avec les périodes de perturbation mises en évidence
- Les régions avec des lacunes persistantes
- Une diapositive de synthèse avec les principales conclusions
```

### Analyse des abandons
```prompt
Compare les schémas d'abandon entre le Penta1 et le Penta3 et montre-les sous forme de visualisation au fil du temps. Les enfants complètent-ils la série vaccinale ? Comment l'abandon a-t-il évolué ? Montre la variation régionale.
```

## Services généraux

### Tendances des visites ambulatoires
```prompt
Analyse les tendances des visites ambulatoires et crée des diapositives de visualisation montrant :
- Les volumes réels par rapport aux volumes attendus avec les périodes de perturbation mises en évidence
- Comment les schémas varient selon les régions
- Une diapositive de synthèse avec les principales conclusions
```

## Analyse croisée des indicateurs

### Continuité des services
```prompt
Crée une analyse croisée des perturbations entre les services avec :
- Une visualisation multi-panneaux montrant les perturbations des CPN, des accouchements et de la vaccination alignées par période
- Une carte thermique montrant la sévérité des perturbations par service et période
- Diapositive de synthèse : les perturbations sont-elles systémiques ou spécifiques à un service ? Quels services ont récupéré le plus rapidement ?
```

### Comparaison régionale
```prompt
Quelles régions présentent le plus de perturbations pour l'ensemble des indicateurs ? Crée une carte thermique montrant la sévérité des perturbations par région et par indicateur. Identifie les zones avec des écarts constants entre les volumes de services réels et attendus.
```

# Visualisations

## Création de graphiques

### Graphique de séries temporelles
```prompt
Crée une visualisation en séries temporelles montrant [NOM DE L'INDICATEUR] au cours de la période [PÉRIODE]. Inclut :
- Des étiquettes d'axes et un titre clairs
- Une ligne de tendance si approprié
- Des annotations pour les changements significatifs
- Une désagrégation par [CATÉGORIE] si pertinent
Optionnellement, ajoute ce graphique à une diapositive avec un titre et un texte d'analyse clé.
```

### Comparaison régionale
```prompt
Crée une visualisation comparant [NOM DE L'INDICATEUR] entre les régions. Utilise :
- Un diagramme en barres pour faciliter la comparaison
- Un code couleur pour mettre en évidence les niveaux de performance
- Des étiquettes claires montrant les valeurs réelles
Optionnellement, ajoute ce graphique à une diapositive avec une interprétation.
```

### Analyse désagrégée
```prompt
Crée une visualisation montrant [NOM DE L'INDICATEUR] désagrégé par [ÂGE/SEXE/AUTRE]. Affiche :
- Une comparaison claire entre les groupes
- Des pourcentages ou des valeurs absolues selon les besoins
- Les tendances au fil du temps si pertinent
Optionnellement, ajoute ce graphique à une diapositive avec une interprétation.
```

### Carte thermique
```prompt
Crée une carte thermique montrant [scores de qualité des données / complétude / performance] à travers les [régions / indicateurs / périodes]. Utilise un code couleur pour mettre en évidence les zones nécessitant une attention particulière. Optionnellement, ajoute à une diapositive.
```

# Rapports et communication

## Résumé exécutif

### Résumé mensuel
```prompt
Crée une présentation de résumé exécutif mensuel :
- Diapositive de couverture : « Résumé mensuel des indicateurs de santé - [MOIS ANNÉE] »
- Réalisations clés : diapositives montrant les principales améliorations avec des visualisations
- Domaines nécessitant une attention : diapositives montrant les principales préoccupations avec des visualisations
- Diapositive finale : actions recommandées pour les parties prenantes
Prépare-la pour une présentation aux cadres dirigeants.
```

### Rapport trimestriel
```prompt
Crée une présentation de rapport trimestriel couvrant les 3 derniers mois :
- Diapositive de couverture : « Rapport trimestriel de santé - [TRIMESTRE ANNÉE] »
- Progrès vers les objectifs annuels avec des visualisations
- Comparaison avec le trimestre précédent
- Points saillants de la performance régionale avec des graphiques
- Diapositive finale : domaines prioritaires recommandés pour le prochain trimestre
```

## Communication avec les parties prenantes

### Messages clés
```prompt
Génère 3 à 5 messages clés issus de cette analyse, adaptés aux cadres dirigeants. Concentre-toi sur ce qui est le plus important et les actions nécessaires.
```

### Points de discussion
```prompt
Crée des points de discussion pour présenter ces résultats aux [parties prenantes]. Inclut :
- Les principaux résultats en langage simple
- Les données à l'appui
- Les actions recommandées
```

# Flux de travail

## Actions rapides

### D'une analyse à une diapositive
```prompt
J'ai trouvé quelque chose d'intéressant : [DESCRIPTION]. Crée une diapositive montrant cette analyse avec une visualisation appropriée, un titre clair énonçant la conclusion, et des chiffres à l'appui.
```

### Jeu de diapositives rapide
```prompt
J'ai besoin d'un jeu rapide de 5 diapositives sur [INDICATEUR/SUJET] pour [PUBLIC]. Inclus : la situation actuelle, la tendance au fil du temps, la comparaison régionale, le contexte de qualité des données, et les recommandations.
```

### Récit de données
```prompt
Raconte-moi l'histoire des données sur [SUJET]. Guide-moi à travers les principales conclusions avec des visualisations, puis compile les plus importantes dans un jeu de diapositives.
```

# Méthodologie

## Comprendre les indicateurs

### Expliquer un indicateur
```prompt
Explique comment [NOM DE L'INDICATEUR] est calculé et montre-moi :
- Les définitions du numérateur et du dénominateur
- Une visualisation montrant les plages de valeurs habituelles et la performance actuelle
- Les sources de données et les pièges courants d'interprétation
Optionnellement, crée une diapositive de formation expliquant cet indicateur.
```

### Comparer des indicateurs
```prompt
Compare [INDICATEUR 1] et [INDICATEUR 2]. Explique :
- En quoi ils diffèrent
- Quand utiliser chacun
- Comment ils se complètent
- Quelles informations peuvent être obtenues en les analysant ensemble
```

## Aide FASTR

### Comment FASTR détecte les valeurs aberrantes
```prompt
Explique comment FASTR identifie les valeurs aberrantes dans les données. Quelle méthode statistique est utilisée ? Comment dois-je interpréter les valeurs signalées ?
```

### Comprendre les scores de qualité des données
```prompt
Que signifie le score de qualité des données ? Comment est-il calculé ? Quel score indique une bonne qualité par rapport à une qualité insuffisante ?
```

### Comment fonctionne l'ajustement
```prompt
Explique comment FASTR ajuste les données pour les problèmes de qualité. Quand les valeurs sont-elles ajustées ou exclues ? Comment cela affecte-t-il mon analyse ?
```

# Génération de rapports standardisés

## Prompt 1 : Rapport FASTR sur les perturbations

```prompt
Génère un rapport FASTR sur les perturbations.

ÉTAPE 1 : DEMANDER À L'UTILISATEUR :
1. Le nom du pays
2. La période d'analyse : La plage de dates des données à inclure (mois/année de début au mois/année de fin, par exemple « janvier 2023 à septembre 2025 »)
3. Le sous-titre du rapport : Quel sous-titre souhaitez-vous pour la couverture ? Par exemple : « T3 2025 », « Annuel 2025 », « Janvier-juin 2025 »

La date de génération de l'analyse est février 2026.

Quand l'utilisateur fournit la période d'analyse, convertir au format period_id :
- La date de début devient la valeur minimale : [ANNÉE][MOIS] sous forme de nombre à 6 chiffres (par exemple janvier 2025 = 202501)
- La date de fin devient la valeur maximale : [ANNÉE][MOIS] sous forme de nombre à 6 chiffres (par exemple décembre 2025 = 202512)
- Conserver ces valeurs pour les utiliser dans periodFilterOverride pour toutes les diapositives d'indicateurs

ÉTAPE 2 : DÉCOUVRIR LES INDICATEURS DISPONIBLES
Avant de générer le rapport, vérifier quels indicateurs sont disponibles dans la plateforme pour ce pays :

Chaque instance pays a des identifiants d'indicateurs (indicator_common_id) et des libellés différents. Ne PAS supposer une liste fixe de codes — les lire depuis la plateforme.

1. Passer en revue tous les identifiants d'indicateurs et leurs libellés disponibles dans la plateforme pour ce pays
2. Présenter la liste complète à l'utilisateur (identifiant + libellé)
3. Proposer des regroupements basés sur les libellés des indicateurs. Utiliser les exemples ci-dessous comme guide, mais adapter à ce qui existe réellement :
   - Soins prénatals : indicateurs liés aux visites CPN (par exemple anc1, anc4, anc_trimester1)
   - Accouchements et soins postnatals : accouchements en structure, personnel qualifié, CPoN, césariennes (par exemple delivery, sba, pnc1, csection)
   - Vaccination : vaccins (par exemple bcg, penta1, penta3, measles1, vaccines_completes, bcg_fixe, bcg_mobile)
   - Planification familiale : conseil PF, nouveaux utilisateurs, utilisateurs continus (par exemple fp_new, fp_new_and_cont, fp_counseled, new_fp)
   - Planification familiale des adolescents : si des indicateurs PF spécifiques aux adolescents existent, les regrouper séparément (par exemple fp_adolescent_counseled, fp_adolescent_new)
   - Paludisme : tests, positivité, traitement (par exemple malaria_rdt_positive, malaria_treated_less_24hrs, malaria_positive, malaria_tx)
   - Services généraux / Consultations externes : visites ambulatoires (par exemple opd, opd_under5, opd_over5)
   - Nutrition : si des indicateurs de nutrition existent (par exemple malnutrition_treated, nutrition_vitamin_a, malnutrition_sam_rechutent)
   - Nouveau-nés : si des indicateurs spécifiques aux nouveau-nés existent (par exemple newborn_kmc, newborn_underweight, breastfeeding_early)
   - Autres groupes selon les besoins basés sur ce qui existe (par exemple VIH/TB, MNT, Mortalité)
4. Pour tout indicateur ne correspondant pas clairement à un groupe, le présenter à l'utilisateur et demander :
   - « J'ai trouvé ces indicateurs supplémentaires : [liste avec identifiants et libellés]. Pour chacun, souhaitez-vous que je : (a) l'ajoute à un groupe existant, (b) crée un nouveau groupe, ou (c) l'exclue des diapositives d'analyse nationale ? »
   - Note : les indicateurs de mortalité (par exemple maternal_deaths, neonatal_deaths, stillbirths) impliquent des comptages d'événements à faible volume et peuvent ne pas convenir au graphique standard de perturbation — le signaler à l'utilisateur
5. Présenter les regroupements finaux proposés à l'utilisateur pour confirmation avant de poursuivre

Chaque groupe confirmé deviendra UNE diapositive dans la section d'analyse nationale, avec tous les indicateurs de ce groupe affichés côte à côte sur le même graphique. Utiliser les valeurs exactes de indicator_common_id de la plateforme pour les paramètres filterOverrides et selectedReplicant.

EXIGENCES DE PRÉCISION :
1. Baser toute l'analyse uniquement sur les données visibles dans la plateforme - ne pas recourir à des connaissances externes
2. Ne pas inventer de statistiques, de pourcentages ou de chiffres précis - si les données ne sont pas visibles, le signaler
3. Si une affirmation ne peut être vérifiée à partir des données, la marquer avec [VÉRIFIER]
4. Ne pas deviner les dates, les périodes ou les magnitudes

NORMES DU RAPPORT :
1. Maintenir un langage prudent et analytique - pas d'affirmations causales
2. Traiter les signaux de perturbation comme descriptifs et exploratoires
3. Structurer les narratifs en phrases complètes (pas de listes à puces)
4. Mise en page : interprétation à gauche, visualisation à droite
5. Utiliser une terminologie cohérente tout au long du rapport (ne pas alterner entre synonymes)

VÉRIFICATION - Avant de finaliser chaque diapositive, vérifier :
1. Toutes les valeurs numériques correspondent à ce que montre la visualisation
2. Les périodes et les noms d'indicateurs sont correctement référencés
3. Les tendances décrites (hausses, baisses) correspondent à la direction réelle des données
4. Les chiffres sont cohérents entre les diapositives (même indicateur = mêmes valeurs)

STRUCTURE :

DIAPOSITIVE 1 - Diapositive de couverture
- Titre : « Suivi des perturbations des services essentiels à partir des données du SNIS au/en [PAYS] »
- Sous-titre : « [SOUS_TITRE_RAPPORT] »
- Pied de page : « Analyse générée en [MOIS_ANNÉE_ACTUEL] »

DIAPOSITIVE 2 - Diapositive d'introduction
- Titre : « Suivi des perturbations des services essentiels à partir des données du SNIS »
- Texte fixe : « L'approche FASTR utilise les données de routine du SNIS pour suivre l'évolution de la prestation de services au fil du temps. En comparant les volumes de services observés aux volumes attendus — ajustés pour la saisonnalité et les tendances historiques — nous pouvons identifier les perturbations ou les surplus dans les services de santé clés. Cette analyse offre une perspective rapide à l'échelle du système, mettant en évidence où et quand l'utilisation des services s'écarte des schémas attendus. Les résultats génèrent des données probantes exploitables pour guider des réponses rapides, contribuant à maintenir la continuité des soins essentiels en période d'incertitude financière ou de changement opérationnel. »
- Réserver un espace pour l'image

DIAPOSITIVE 3 - Diapositive méthodologique
- Titre : « Méthodologie : Évaluation de l'utilisation des services »
- Objectif : Suivre les changements dans l'utilisation des services de santé au fil du temps, en identifiant où les services tombent en dessous ou dépassent les schémas attendus.
- Comment ça fonctionne : Utilise les données de routine du SNIS, nettoyées des valeurs aberrantes et des valeurs manquantes. Construit une ligne de tendance « attendue » pour chaque service, ajustée pour la saisonnalité et les tendances historiques. Compare les volumes de services réels aux niveaux attendus.
- Mesure de l'impact : Les périodes de perturbation signalées sont analysées pour estimer dans quelle mesure les volumes de services ont changé par rapport à ce qui était attendu. Les résultats sont présentés aux niveaux national et infranational.
- Comment interpréter les figures : Les zones ombrées en rouge = perturbations potentielles (en dessous de l'attendu). Les zones ombrées en vert = surplus potentiels (au-dessus de l'attendu). Ce sont des signaux, pas des conclusions — ils nécessitent une investigation plus approfondie.
- Pied de page : « Plus de détails sur la méthodologie sont disponibles sur GitHub (https://fastr-analytics.github.io/fastr-resource-hub/). »

DIAPOSITIVE 4 - Diapositive de sélection des indicateurs
- Titre : « Méthodologie : Sélection des indicateurs »
- Sous-titre : « Les indicateurs pour l'analyse de l'utilisation des services ont été sélectionnés en tenant compte des indicateurs priorisés au niveau national. »
- Lister tous les indicateurs disponibles regroupés par les catégories confirmées à l'Étape 2

DIAPOSITIVE 5 - Diapositive d'en-tête de section
- Titre : « Section 1 : Utilisation des services »
- Sous-titre : « Évaluation des volumes projetés sur la base des tendances historiques pour identifier les surplus et les perturbations dans les services de santé »

DIAPOSITIVES 6+ - Diapositives d'analyse nationale (une diapositive par GROUPE d'indicateurs)
Créer une diapositive pour chaque groupe d'indicateurs confirmé à l'Étape 2. Chaque diapositive montre tous les indicateurs du groupe côte à côte.

POUR CHAQUE DIAPOSITIVE DE GROUPE :

Titre : Rédiger un titre analytique (1-2 phrases) résumant la conclusion principale pour ce groupe d'indicateurs. Le titre doit décrire ce que montrent les données, pas simplement nommer les indicateurs.
- Bon exemple : « Malgré des déficits généralisés en 2024, les services de vaccination montrent des signes de reprise à la mi-2025, avec quelques perturbations pour le BCG »
- Bon exemple : « Les accouchements montrent un surplus en 2025, tandis que les CPoN ont récupéré après des perturbations antérieures »
- Mauvais exemple : « BCG - Vaccin Bacillus Calmette-Guérin »
- Mauvais exemple : « Indicateurs de vaccination »

Visualization (right side): Create using from_metric with these parameters:
- type: "from_metric"
- metricId: "m3-02-01"
  Metric: Actual vs expected service volume (National) [number]
  Values: count_sum (Actual service volume), count_expected_if_above_diff_threshold (Expected service volume)
  Auto-disaggregated by: indicator_common_id
  Optional disaggregations: year, month, period_id
- vizPresetId: "disruption-chart" (Disruptions and surpluses - national - YYYYMM)
- chartTitle: "Comparing reported service use to expected trends, nationally"
- selectedReplicant: The first indicator code in the group
- filterOverrides: Filter on indicator_common_id to include ALL indicator codes for this group:
  - col: "indicator_common_id"
  - vals: [all indicator codes in the group, e.g., ["anc1", "anc4"] or ["bcg", "penta1", "penta3"]]
- periodFilterOverride:
  - periodOption: "period_id"
  - min: Start date as 6-digit number (e.g., 202301 for January 2023)
  - max: End date as 6-digit number (e.g., 202509 for September 2025)

Interprétation (côté gauche) : Analyser les données affichées dans la visualisation. Décrire en phrases complètes :
- Pour CHAQUE indicateur du groupe : quand les perturbations se sont produites (mois/périodes spécifiques), durée et ampleur approximative
- Pour CHAQUE indicateur du groupe : quand les surplus se sont produits, et ampleur approximative
- Analyse croisée des indicateurs : décrire les relations et les schémas ENTRE les indicateurs du groupe (par exemple « Comme les CPoN suivent généralement les tendances des accouchements, on s'attendrait à ce que ces indicateurs évoluent ensemble », « La reprise parallèle du BCG, Penta 1 et Penta 3 suggère un rebond à l'échelle du système »)
- Évaluation globale : une phrase de conclusion sur ce que le schéma combiné signifie pour ce domaine de services
- IMPORTANT : Ne décrire que ce qui est réellement visible dans le graphique - ne pas inventer de données

DERNIÈRE PAGE :
- "FASTR initiative:" followed by https://data.gffportal.org/key-theme/FASTR
```

## Prompt 2 : Analyse régionale des perturbations

```prompt
Génère l'Annexe 1 : Analyse régionale des perturbations pour toutes les zones infranationales. Insérer cette annexe avant la dernière page (diapositive FASTR initiative). La dernière page doit rester la toute dernière diapositive du rapport complet — la retirer de sa position actuelle et la remettre après l'annexe.

EXIGENCES DE PRÉCISION :
1. Baser toute l'analyse uniquement sur les données visibles dans la plateforme
2. Ne pas inventer de statistiques ou de chiffres précis - si les données ne sont pas visibles, le signaler
3. Si une affirmation ne peut être vérifiée à partir des données, la marquer avec [VÉRIFIER]

NORMES DU RAPPORT :
1. Maintenir un langage prudent et analytique - pas d'affirmations causales
2. Traiter les signaux de perturbation comme descriptifs et exploratoires
3. Mise en page : interprétation à gauche, visualisation à droite
4. Utiliser une terminologie cohérente tout au long du rapport

VÉRIFICATION : Avant de finaliser chaque diapositive, vérifier que les tendances décrites correspondent à ce que montre la visualisation.

STRUCTURE :

DIAPOSITIVE 1 - Diapositive d'en-tête de l'annexe
- Titre : « Annexe 1 : Perturbations de l'utilisation des services au niveau infranational »

DIAPOSITIVE 2 - Tableau synthétique infranational
Titre : Rédiger un titre analytique résumant la principale conclusion infranationale (par exemple « D'importantes disparités au niveau des comtés en matière de performance soulignent la nécessité de comprendre les facteurs locaux des gains et des lacunes dans les services »)

Créer une diapositive de contenu avec un tableau de données montrant :
- Lignes : chaque zone infranationale
- Colonnes : chaque indicateur (utiliser des libellés courts)
- Valeurs : pourcentage de différence entre les volumes de services réels et attendus pour les 6 derniers mois de la période d'analyse
- Utiliser get_metric_data avec metricId « m3-03-02 » pour récupérer les données, puis construire le tableau sur la diapositive
- Code couleur : Vert = plus de 10 % au-dessus de l'attendu | Blanc = -10 % à +10 % | Rouge = plus de 10 % en dessous de l'attendu
- Pied de page : « Pourcentage de différence entre le nombre de services observés et le nombre de services attendus. Une valeur négative indique un niveau observé inférieur au niveau attendu (perturbation), tandis qu'une valeur positive indique un niveau supérieur (surplus). Les écarts supérieurs à ±10 % sont surlignés en rouge ou en vert. »

Sous le tableau, ajouter 2-3 phrases résumant les principaux schémas (par exemple quelles zones montrent des surplus ou des déficits constants, si la performance varie selon le domaine de services).

DIAPOSITIVES 3+ - Profils par zone infranationale
Pour CHAQUE zone infranationale dans la plateforme, créer une diapositive simple avec :

- Titre : Nom de la zone infranationale
- Visualisation : Créer avec from_metric avec ces paramètres :
  - type: "from_metric"
  - metricId: "m3-02-01"
    Metric: Actual vs expected service volume (National) [number] — filtré pour cette zone spécifique
    Values: count_sum (Actual service volume), count_expected_if_above_diff_threshold (Expected service volume)
    Auto-disaggregated by: indicator_common_id
  - vizPresetId: "disruption-chart"
  - chartTitle: « Comparaison de l'utilisation des services rapportée aux tendances attendues, [Nom de la zone] »
  - filterOverrides: Filtrer sur admin_area_2 pour afficher uniquement cette zone infranationale, et sur indicator_common_id pour inclure tous les indicateurs du rapport
  - periodFilterOverride: Utiliser la même période que le rapport principal

Garder ces diapositives épurées — nom de la zone et visualisation uniquement, pas de texte d'interprétation.
```

## Prompt 3 : Évaluation de la qualité des données

```prompt
Génère une annexe d'évaluation de la qualité des données. Insérer cette annexe avant la dernière page (diapositive FASTR initiative). La dernière page doit rester la toute dernière diapositive du rapport complet — la retirer de sa position actuelle et la remettre après l'annexe.

NUMÉROTATION DE L'ANNEXE : Si l'analyse régionale des perturbations (Annexe 1) a été incluse, numéroter celle-ci comme Annexe 2. Si elle n'a pas été incluse, numéroter comme Annexe 1.

EXIGENCES DE PRÉCISION :
1. Baser toute l'analyse uniquement sur les données visibles dans la plateforme
2. Ne pas inventer de statistiques ou de chiffres précis - si les données ne sont pas visibles, le signaler
3. Si une affirmation ne peut être vérifiée à partir des données, la marquer avec [VÉRIFIER]

NORMES DU RAPPORT :
1. Maintenir un langage prudent et analytique
2. Mise en page : interprétation à gauche, visualisation à droite
3. Utiliser une terminologie cohérente tout au long du rapport

RÉFÉRENCE MÉTHODOLOGIQUE :
Si vous avez besoin de contexte supplémentaire sur la façon dont FASTR calcule les indicateurs de qualité des données, consultez la documentation méthodologique à l'adresse https://fastr-analytics.github.io/fastr-resource-hub/. Utilisez-la pour rédiger des résumés et des interprétations précis pour chaque diapositive.

INDICATEURS DE QUALITÉ DES DONNÉES :
Utiliser get_available_metrics pour confirmer les indicateurs disponibles et leurs préréglages de visualisation. Les indicateurs de qualité des données utilisés dans cette annexe sont :
- m1-01-01 : Proportion de valeurs aberrantes [pourcentage] — préréglage : outlier-table — filtres : indicator_common_id, admin_area_2
- m1-02-02 : Proportion de rapports complétés [pourcentage] — préréglage : completeness-table — filtres : indicator_common_id, admin_area_2. TOUJOURS utiliser le préréglage completeness-table pour cet indicateur (NE PAS utiliser completeness-timeseries)
- m1-03-01 : Proportion de zones infranationales respectant les critères de cohérence [pourcentage] — préréglage : consistency-table — filtres : ratio_type, admin_area_2
- m1-04-01 : Proportion d'établissements avec une qualité de données adéquate [pourcentage] — préréglage : dqa-score-table — filtres : admin_area_2
- m1-04-02 : Score moyen de qualité des données entre les établissements [pourcentage] — préréglage : mean-dqa-table — filtres : admin_area_2

Pour chaque diapositive, créer la visualisation avec from_metric en utilisant le metricId et vizPresetId spécifiés. Utiliser periodFilterOverride correspondant à la période du rapport principal.

VÉRIFICATION : Avant de finaliser chaque diapositive, vérifier que tous les pourcentages et scores correspondent à ce que montre la visualisation.

STRUCTURE :

ÉTAPE 1 : GÉNÉRER LE RÉSUMÉ DE COMPLÉTUDE

DIAPOSITIVE 1 - Diapositive de couverture
- Titre : « Annexe [1 ou 2] : Tendances de la complétude du rapportage des indicateurs »
- Note : Si l'utilisateur opte pour les diapositives supplémentaires à l'Étape 2, mettre à jour ce titre en « Annexe [1 ou 2] : Évaluation de la qualité des données »

DIAPOSITIVE 2 - Tendances de complétude
Titre : Rédiger un titre analytique sur les tendances de complétude (par exemple « La complétude est >95 % pour la plupart des indicateurs en 2025, renforçant la confiance dans les résultats sur les perturbations »)

Visualization (right side): Create using from_metric with these parameters:
- type: "from_metric"
- metricId: "m1-02-02"
  Metric: Proportion of completed records [percent]
  Values: completeness_flag (Binary variable indicating whether the facility meets criteria)
  Optional disaggregations: admin_area_2, admin_area_3, indicator_common_id, year, month, period_id
- vizPresetId: "completeness-table" (Completeness table by region - YYYYMM)
  Filters: indicator_common_id, admin_area_2
- Display as a table: period_id (rows) x indicator_common_id (columns) showing completeness %
- Color coding: Green = 90% or above | Yellow = 80% to 89% | Red = below 80%
- periodFilterOverride: Use the same period as the main report

Interprétation (côté gauche) : Décrire en phrases complètes :
- Un résumé des tendances de complétude sur la période d'analyse
- Quels indicateurs ont une complétude plus faible (les nommer)
- Si la complétude s'est améliorée au fil du temps

Puis inclure ce bloc de texte fixe :

**Pourquoi la complétude est importante pour l'analyse des perturbations**

Valeurs observées : Elles sont ajustées uniquement pour les valeurs aberrantes, et reflètent donc les volumes réels de services après suppression des pics implausibles.

Valeurs attendues : Elles sont ajustées pour la complétude et les valeurs aberrantes. Cela signifie que le modèle « comble » les lacunes de rapportage, construisant une ligne de tendance attendue comme si tous les établissements avaient rapporté de manière cohérente.

Lorsque la complétude est élevée, les volumes observés et attendus sont plus comparables, et les perturbations reflètent plus probablement de véritables changements dans les services.

Lorsque la complétude est faible, les valeurs attendues peuvent être artificiellement supérieures aux valeurs observées, créant des « perturbations » apparentes qui reflètent en réalité des rapports manquants plutôt que de véritables baisses de la prestation de services.

ÉTAPE 2 : DEMANDER À L'UTILISATEUR
Après avoir généré le résumé de complétude, demander : « Souhaitez-vous que j'ajoute des diapositives supplémentaires sur la qualité des données couvrant la complétude par région, les valeurs aberrantes, la cohérence interne et les tendances des scores EQD ? »

Si l'utilisateur accepte, générer les diapositives supplémentaires suivantes :

DIAPOSITIVE 3 - Complétude du rapportage par région
- Titre : Rédiger un titre analytique sur la complétude régionale (par exemple « La complétude varie selon les régions, avec [X] et [Y] constamment en dessous de 90 % pour les indicateurs clés »)
- Visualization (right side): Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: "m1-02-02"
    Metric: Proportion of completed records [percent]
    Values: completeness_flag (Binary variable indicating whether the facility meets criteria)
    Optional disaggregations: admin_area_2, admin_area_3, indicator_common_id, year, month, period_id
  - vizPresetId: "completeness-table" (Completeness table by region - YYYYMM)
    Filters: indicator_common_id, admin_area_2
  - Display as a table: admin_area_2 (rows) × indicator_common_id (columns) showing completeness %
  - Color coding: Green = 90% or above | Yellow = 80% to 89% | Red = below 80%
  - periodFilterOverride: Use the same period as the main report
- Interprétation (côté gauche) : En phrases complètes :
  - Nommer les régions spécifiques avec une faible complétude et les indicateurs concernés
  - Identifier si les lacunes sont concentrées dans des zones spécifiques ou réparties dans tout le pays
  - Signaler toute région où la complétude est faible pour plusieurs indicateurs (problèmes de rapportage systémiques)
- Texte fixe (inclure sur la diapositive sous l'interprétation) : « Une complétude élevée améliore la fiabilité des données, surtout lorsque la complétude est stable dans le temps. La complétude est définie comme le pourcentage d'établissements rapportant chaque mois par rapport au nombre total d'établissements censés rapporter. Un établissement est censé rapporter s'il a rapporté un volume quelconque pour chaque indicateur à tout moment au cours d'une année. Une complétude élevée n'indique pas que le SNIS est représentatif de l'ensemble de la prestation de services dans le pays, car certains services peuvent ne pas être délivrés dans les établissements, ou certains établissements peuvent ne pas rapporter. »

DIAPOSITIVE 4 - Valeurs aberrantes
- Titre : Rédiger un titre analytique sur les valeurs aberrantes (par exemple « Les taux de valeurs aberrantes restent faibles au niveau national mais [X] montre des taux élevés ces derniers mois »)
- Visualization (right side): Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: "m1-01-01"
    Metric: Proportion of outliers [percent]
    Values: outlier_flag (Binary variable indicating whether this is an outlier)
    Optional disaggregations: admin_area_2, admin_area_3, indicator_common_id, year, month, period_id
  - vizPresetId: "outlier-table" (Outlier proportion table - YYYYMM)
    Filters: indicator_common_id, admin_area_2
  - Display as a table: period_id (rows) × indicator_common_id (columns) showing outlier %
  - Color coding: Green = below 2% | Yellow = 2% to 5% | Red = above 5%
  - periodFilterOverride: Use the same period as the main report
- Interprétation (côté gauche) : En phrases complètes :
  - Décrire la tendance nationale globale des taux de valeurs aberrantes — sont-ils stables, en amélioration ou en détérioration ?
  - Nommer les indicateurs spécifiques avec les taux de valeurs aberrantes les plus élevés
  - Indiquer si les taux de valeurs aberrantes se sont améliorés ou détériorés au cours de la période d'analyse
  - Expliquer l'implication : des taux élevés de valeurs aberrantes signifient que davantage de valeurs sont ajustées, ce qui peut affecter la fiabilité de l'analyse des tendances
- Texte fixe (inclure sur la diapositive sous l'interprétation) : « Les valeurs aberrantes sont des rapports dont les volumes sont anormalement élevés par rapport au volume habituel rapporté par l'établissement les autres mois. Les valeurs aberrantes sont identifiées en évaluant la variation intra-établissement du rapportage mensuel pour chaque indicateur. Les valeurs aberrantes sont définies comme des observations supérieures à 10 fois l'écart absolu médian (MAD) par rapport à la médiane mensuelle de l'indicateur pour chaque période, OU une valeur dont la contribution proportionnelle en volume pour un établissement, un indicateur et une période est supérieure à 80 %. Les valeurs aberrantes ne sont identifiées que pour les indicateurs dont le volume est supérieur ou égal à la médiane, le volume n'est pas manquant et le volume moyen est supérieur à 100. »

DIAPOSITIVE 5 - Cohérence interne
- Titre : Rédiger un titre analytique sur la cohérence (par exemple « La plupart des paires d'indicateurs montrent un rapportage cohérent, mais [RATIO] sort des plages plausibles dans plusieurs régions »)
- Visualization (right side): Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: "m1-03-01"
    Metric: Proportion of sub-national areas meeting consistency criteria [percent]
    Values: sconsistency
    Auto-disaggregated by: ratio_type
    Optional disaggregations: admin_area_2, admin_area_3, year, month, period_id
  - vizPresetId: "consistency-table" (Internal consistency table - YYYYMM)
    Filters: ratio_type, admin_area_2
  - Display as a table: period_id (rows) × ratio_type (columns) showing % of areas meeting consistency criteria
  - Color coding: Green = 90% or above | Yellow = 70% to 89% | Red = below 70%
  - periodFilterOverride: Use the same period as the main report
- Interprétation (côté gauche) : En phrases complètes :
  - Expliquer ce que chaque ratio_type représente (par exemple Penta1/Penta3 compare la première à la troisième dose, CPN1/CPN4 compare la première à la quatrième visite)
  - Identifier quels ratios respectent ou échouent systématiquement les critères
  - Indiquer si la cohérence s'améliore ou se détériore au cours de la période d'analyse
  - Mettre en évidence toute région spécifique où la cohérence est notablement faible
- Texte fixe (inclure sur la diapositive sous l'interprétation) : « La cohérence interne évalue la plausibilité des données rapportées sur la base d'indicateurs connexes. Les métriques de cohérence sont approximatives — selon le calendrier et la saisonnalité, les définitions des indicateurs et la nature de la prestation de services et du rapportage, les valeurs peuvent se situer en dehors des plages plausibles. Les indicateurs similaires sont censés avoir approximativement le même volume sur l'année (dans une marge de 30 %). Les données de cette analyse sont ajustées pour les valeurs aberrantes. »

DIAPOSITIVE 6 - Tendances de la qualité des données (score EQD global)
- Titre : Rédiger un titre analytique sur les tendances de l'EQD (par exemple « La proportion d'établissements avec une qualité de données adéquate est passée de X % à Y % depuis [ANNÉE] »)
- Visualization (right side): Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: "m1-04-01"
    Metric: Proportion of facilities with adequate data quality [percent]
    Values: dqa_score (Binary variable indicating adequate data quality)
    Optional disaggregations: admin_area_2, admin_area_3, year, month, period_id
  - vizPresetId: "dqa-score-table" (Overall DQA score table - YYYYMM)
    Filters: admin_area_2
  - Display as a table: admin_area_2 (rows) × year (columns) showing % of facilities with adequate DQ
  - Color coding: Green = 70% or above | Yellow = 50% to 69% | Red = below 50%
  - periodFilterOverride: Use the same period as the main report
- Interprétation (côté gauche) : En phrases complètes :
  - Décrire la tendance nationale — la qualité des données s'améliore-t-elle au fil du temps ?
  - Nommer les régions les plus performantes et les moins performantes
  - Identifier les régions où la qualité des données s'est notablement améliorée ou détériorée
  - Expliquer l'implication : les zones avec des scores EQD faibles peuvent avoir des estimations de perturbation moins fiables
- Texte fixe (inclure sur la diapositive sous l'interprétation) : « Une qualité de données adéquate est définie comme : 1) Pas de données manquantes ni de valeurs aberrantes pour les consultations externes, le Penta1 et la CPN1, lorsque disponibles 2) Rapportage cohérent entre Penta1/Penta3 et CPN1/CPN4. »

DIAPOSITIVE 7 - Tendances de la qualité des données (score EQD moyen)
- Titre : Rédiger un titre analytique sur les tendances du score moyen de l'EQD (par exemple « Les scores moyens de qualité des données sont les plus élevés dans [X] et [Y], tandis que [Z] est en retard »)
- Visualization (right side): Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: "m1-04-02"
    Metric: Average data quality score across facilities [percent]
    Values: dqa_mean (Data quality score across facilities)
    Optional disaggregations: admin_area_2, admin_area_3, year, month, period_id
  - vizPresetId: "mean-dqa-table" (Mean DQA score table - YYYYMM)
    Filters: admin_area_2
  - Display as a table: admin_area_2 (rows) × year (columns) showing mean DQA score %
  - Color coding: Green = 70% or above | Yellow = 50% to 69% | Red = below 50%
  - periodFilterOverride: Use the same period as the main report
- Interprétation (côté gauche) : En phrases complètes :
  - Décrire la tendance nationale du score moyen de l'EQD — s'améliore-t-elle, est-elle stable ou en déclin ?
  - Comparer les régions les plus performantes aux moins performantes
  - Signaler toute région montrant une amélioration ou un déclin significatif
  - Conclure avec une évaluation globale de la trajectoire de la qualité des données et ce que cela signifie pour l'analyse des perturbations
- Texte fixe (inclure sur la diapositive sous l'interprétation) : « Les éléments inclus dans le score EQD sont : Pas de données manquantes pour 1) les consultations externes, 2) le Penta1 et 3) la CPN1, lorsque disponibles ; Pas de valeurs aberrantes pour 4) les consultations externes, 5) le Penta1 et 6) la CPN1, lorsque disponibles ; Rapportage cohérent entre 7) Penta1/Penta3, 8) CPN1/CPN4, 9) BCG/Accouchements, lorsque disponibles. »
```
