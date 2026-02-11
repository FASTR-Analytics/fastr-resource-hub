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

DIAPOSITIVE 2 - Carte thermique synthétique infranationale
Titre : Rédiger un titre analytique résumant la principale conclusion infranationale (par exemple « D'importantes disparités au niveau des comtés en matière de performance soulignent la nécessité de comprendre les facteurs locaux des gains et des lacunes dans les services »)

Visualization (right side): Create using from_metric with these parameters:
- type: "from_metric"
- metricId: "m3-03-02"
  Metric: Difference between actual and expected service volume (Admin area 2) [percent]
  Values: pct_diff (Percent difference)
  Auto-disaggregated by: admin_area_2, indicator_common_id
  Optional disaggregations: year, month, period_id
- No preset — this metric auto-disaggregates by admin_area_2 and indicator_common_id, rendering as a table of subnational areas (rows) x indicators (columns)
- periodFilterOverride: Filter to the most recent 6 months of the analysis period
- Color coding: Green = more than 10% above expected | White = -10% to +10% | Red = more than 10% below expected
- Footer: "Percentage difference between the observed and expected number of services. A negative value indicates an observed level lower than the expected level (disruption), while a positive value indicates a higher level (surplus). Discrepancies greater than ±10% are highlighted in red or green."

Interprétation (côté gauche) : Décrire en phrases complètes :
- Quelles zones infranationales montrent des surplus ou des déficits constants pour plusieurs indicateurs
- Si les zones performantes sur certains indicateurs le sont aussi sur d'autres, ou si la performance varie selon le domaine de services
- Les schémas notables éventuels (par exemple des zones avec de bons résultats en santé maternelle mais de faibles résultats en paludisme)

DIAPOSITIVES 3+ - Profils par zone infranationale
Pour CHAQUE zone infranationale dans la plateforme, créer une diapositive avec :

Titre de la diapositive : Nom de la zone infranationale

Visualization (right side): Create using from_metric with these parameters:
- type: "from_metric"
- metricId: "m3-03-02"
  Metric: Difference between actual and expected service volume (Admin area 2) [percent]
  Values: pct_diff (Percent difference)
  Auto-disaggregated by: admin_area_2, indicator_common_id
  Optional disaggregations: year, month, period_id
- No preset — the metric auto-disaggregates by indicator_common_id, showing all indicators as small multiples
- chartTitle: "Comparing reported service use to expected trends, [Area Name]"
- filterOverrides: Filter on admin_area_2 to show only this specific subnational area
- periodFilterOverride: Use the same period as the main report

Interprétation (côté gauche) : Décrire en phrases complètes :
- Quels indicateurs montrent des perturbations (en dessous de l'attendu) et quand
- Quels indicateurs montrent des surplus (au-dessus de l'attendu) et quand
- L'ampleur des écarts par rapport à l'attendu
- Les schémas éventuels entre indicateurs (par exemple tous les indicateurs de santé maternelle affectés ensemble)
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

VÉRIFICATION : Avant de finaliser chaque diapositive, vérifier que tous les pourcentages et scores correspondent à ce que montre la visualisation.

STRUCTURE :

DIAPOSITIVE 1 - Diapositive de couverture
- Titre : « Annexe [1 ou 2] : Évaluation de la qualité des données »
- Sous-titre : « Les évaluations de la qualité des données — axées sur la complétude, la cohérence et les valeurs aberrantes — alimentent les ajustements appliqués aux données de routine pour améliorer la fiabilité des analyses présentées. »

DIAPOSITIVE 2 - Complétude du rapportage
- Titre : « Complétude du rapportage »
- Visualization (right side): Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: "m1-02-02"
    Metric: Proportion of completed records [percent]
    Values: completeness_flag (Binary variable indicating whether the facility meets criteria)
    Optional disaggregations: admin_area_2, admin_area_3, indicator_common_id, year, month, period_id
  - vizPresetId: "completeness-table" (Completeness table by region - YYYYMM)
    Filters: indicator_common_id, admin_area_2
  - periodFilterOverride: Use the same period as the main report
- Interprétation (côté gauche) : Décrire en phrases complètes les tendances nationales globales de la complétude au fil du temps, quels indicateurs ont une faible complétude (les nommer) et quelles zones administratives ont une faible complétude (les nommer).

DIAPOSITIVE 3 - Valeurs aberrantes
- Titre : « Valeurs aberrantes »
- Visualization (right side): Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: "m1-01-01"
    Metric: Proportion of outliers [percent]
    Values: outlier_flag (Binary variable indicating whether this is an outlier)
    Optional disaggregations: admin_area_2, admin_area_3, indicator_common_id, year, month, period_id
  - vizPresetId: "outlier-table" (Outlier proportion table - YYYYMM)
    Filters: indicator_common_id, admin_area_2
  - periodFilterOverride: Use the same period as the main report
- Interprétation (côté gauche) : Décrire en phrases complètes les tendances nationales globales des valeurs aberrantes au fil du temps, quels indicateurs ont des taux élevés de valeurs aberrantes (les nommer) et quelles zones administratives ont des taux élevés de valeurs aberrantes (les nommer).

DIAPOSITIVE 4 - Cohérence interne (première)
- Titre : « Cohérence interne »
- Visualization (right side): Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: "m1-03-01"
    Metric: Proportion of sub-national areas meeting consistency criteria [percent]
    Values: sconsistency
    Auto-disaggregated by: ratio_type
    Optional disaggregations: admin_area_2, admin_area_3, year, month, period_id
  - vizPresetId: "consistency-table" (Internal consistency table - YYYYMM)
    Filters: ratio_type, admin_area_2
  - periodFilterOverride: Use the same period as the main report
- Interprétation (côté gauche) : Décrire en phrases complètes quelles comparaisons de cohérence sont effectuées, les schémas généraux à travers le pays et quelles zones respectent ou ne respectent pas les critères de cohérence.

DIAPOSITIVE 5 - Cohérence interne (deuxième)
- Titre : « Cohérence interne »
- Visualization (right side): Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: "m1-03-01" (same metric, different view or breakdown)
  - vizPresetId: "consistency-table"
  - filterOverrides: Filter by admin_area_2 or ratio_type to show a different breakdown
  - periodFilterOverride: Use the same period as the main report
- Interprétation (côté gauche) : Continuer à décrire les schémas de cohérence entre les zones administratives.

DIAPOSITIVE 6 - Tendances de la qualité des données (première)
- Titre : « Tendances de la qualité des données »
- Visualization (right side): Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: "m1-04-01"
    Metric: Proportion of facilities with adequate data quality [percent]
    Values: dqa_score (Binary variable indicating adequate data quality)
    Optional disaggregations: admin_area_2, admin_area_3, year, month, period_id
  - vizPresetId: "dqa-score-table" (Overall DQA score table - YYYYMM)
    Filters: admin_area_2
  - periodFilterOverride: Use the same period as the main report
- Interprétation (côté gauche) : Décrire en phrases complètes comment les scores de l'EQD ont évolué au fil des années, les performances globales du pays et la variation entre les zones administratives.

DIAPOSITIVE 7 - Tendances de la qualité des données (deuxième)
- Titre : « Tendances de la qualité des données »
- Visualization (right side): Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: "m1-04-02"
    Metric: Average data quality score across facilities [percent]
    Values: dqa_mean (Data quality score across facilities)
    Optional disaggregations: admin_area_2, admin_area_3, year, month, period_id
  - vizPresetId: "mean-dqa-table" (Mean DQA score table - YYYYMM)
    Filters: admin_area_2
  - periodFilterOverride: Use the same period as the main report
- Interprétation (côté gauche) : Décrire en phrases complètes les tendances du score moyen de l'EQD au fil des années, quelles zones ont des scores en amélioration ou en déclin, et l'évaluation globale de la trajectoire de la qualité des données.

DIAPOSITIVE 8 - Tableau des tendances de complétude
Titre : Rédiger un titre analytique sur les tendances de complétude (par exemple « La complétude est >95 % pour la plupart des indicateurs en 2025, renforçant la confiance dans les résultats sur les perturbations »)

Visualization (right side): Create using from_metric with these parameters:
- type: "from_metric"
- metricId: "m1-02-02"
  Metric: Proportion of completed records [percent]
  Values: completeness_flag
- vizPresetId: "completeness-timeseries" (Completeness over time - YYYYMM)
  Filters: indicator_common_id
- Display as a table: month (rows) x indicator (columns) showing completeness %
- Color coding: Green = 90% or above | Yellow = 80% to 89% | Red = below 80%
- periodFilterOverride: Use the same period as the main report
- Footer: "Higher completeness improves the reliability of the data, especially when completeness is stable over time. Completeness is defined as the percentage of reporting facilities each month out of the total number of facilities expected to report."

Interprétation (côté gauche) : Décrire en phrases complètes :
- Un résumé des tendances de complétude sur la période d'analyse
- Quels indicateurs ont une complétude plus faible (les nommer)
- Si la complétude s'est améliorée au fil du temps
- Pourquoi la complétude est importante pour l'analyse des perturbations : les valeurs observées sont ajustées uniquement pour les valeurs aberrantes, tandis que les valeurs attendues sont ajustées pour la complétude et les valeurs aberrantes. Lorsque la complétude est élevée, les perturbations reflètent plus probablement de véritables changements dans les services. Lorsque la complétude est faible, les perturbations apparentes peuvent refléter des rapports manquants plutôt que de véritables baisses.
```
