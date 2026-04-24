# Préférences générales pour les diapositives

Lors de la création de diapositives combinant du texte et une visualisation, toujours utiliser une disposition en deux colonnes : texte à gauche, visualisation à droite. Après avoir ajouté les deux blocs à une diapositive, utiliser `modify_slide_layout` pour les disposer côte à côte avec une répartition 6-6 (bloc texte span 6 à gauche, bloc visualisation span 6 à droite). Ne pas les laisser empilés verticalement.

# Style de rédaction

Rédiger en phrases complètes et lisibles. Ne pas commencer une phrase par un libellé suivi de deux-points (par exemple, ne pas écrire « Binaire : un établissement-mois obtient 100% uniquement si... »). Intégrer plutôt l'information dans une phrase fluide (par exemple, « Un établissement-mois obtient un score de 100% uniquement si tous les indicateurs clés sont complets, sans valeurs aberrantes et cohérents »).

---

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
- Une diapositive de synthèse mettant en évidence les 3 principales conclusions positives et les 3 principales préoccupations
- Inclus des chiffres précis et des pourcentages de variation sur chaque diapositive
Rappel : pour les indicateurs de mortalité, une augmentation est une préoccupation, pas une amélioration.
```

### Comparer les régions
```prompt
Compare les performances des indicateurs de santé entre les régions administratives et crée des diapositives comparatives :
- Un graphique comparant toutes les régions avec des niveaux de performance codés par couleur
- Un tableau montrant les régions les plus et les moins performantes avec le pourcentage de variation
- Une diapositive mettant en évidence les régions les plus améliorées et les plus préoccupantes
Rappel : pour les indicateurs de mortalité, des valeurs plus élevées sont pires — classer en conséquence.
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
Sur la base des données, quelles régions ou indicateurs devrions-nous prioriser pour le soutien ? Identifie les zones avec une prestation de services en déclin, une mortalité ou des taux d'abandon en hausse, ou des lacunes persistantes. Crée une diapositive de synthèse montrant les zones prioritaires.
```

# Analyse des indicateurs

FASTR se concentre sur les indicateurs fondamentaux de SRMNIA-N qui représentent des points clés du continuum de soins. Ces indicateurs ont généralement des volumes de rapportage plus élevés et servent d'indicateurs indirects pour les schémas plus larges de prestation de services.

**Important** : Toutes les augmentations ne sont pas des améliorations. Pour les indicateurs de prestation de services (CPN, accouchements, vaccination), une augmentation est positive. Mais pour les indicateurs de mortalité (décès maternels, décès néonatals, mortinaissances) et les taux d'abandon, une augmentation est TOUJOURS négative — plus de décès ou plus d'abandons est mauvais. Formuler toute analyse en conséquence.

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
Compare les schémas d'abandon entre le Penta1 et le Penta3 et montre-les sous forme de visualisation au fil du temps. Les enfants complètent-ils la série vaccinale ? Comment l'abandon a-t-il évolué ? Montre la variation régionale. Note : une augmentation de l'abandon est un résultat négatif — cela signifie que moins d'enfants complètent la série.
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
- Conclusions positives : diapositives montrant les principales améliorations avec des visualisations
- Domaines nécessitant une attention : diapositives montrant les principales préoccupations avec des visualisations
- Diapositive finale : actions recommandées pour les parties prenantes
Prépare-la pour une présentation aux cadres dirigeants.
Rappel : pour les indicateurs de mortalité, une augmentation est toujours une préoccupation, jamais une réalisation. Pour les indicateurs de services, une augmentation est positive.
```

### Rapport trimestriel
```prompt
Crée une présentation de rapport trimestriel couvrant les 3 derniers mois :
- Diapositive de couverture : « Rapport trimestriel de santé - [TRIMESTRE ANNÉE] »
- Progrès vers les objectifs annuels avec des visualisations
- Comparaison avec le trimestre précédent
- Points saillants de la performance régionale avec des graphiques
- Diapositive finale : domaines prioritaires recommandés pour le prochain trimestre
Rappel : pour les indicateurs de mortalité, une augmentation est toujours une préoccupation, jamais un progrès. Pour les indicateurs de services, une augmentation est positive.
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
J'ai besoin d'un jeu rapide de 5 diapositives sur [INDICATEUR/SUJET] pour [PUBLIC]. Inclus : la situation actuelle, la tendance au fil du temps, la comparaison régionale, le contexte de qualité des données, et les recommandations. Cadrer les tendances correctement : les augmentations de prestation de services sont positives, mais les augmentations de mortalité ou de taux d'abandon sont négatives.
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

Toujours vérifier si l'utilisateur est en mode editing_slide_deck. Si l'utilisateur n'est pas dans ce mode, lui demander de créer un nouveau slide deck ou d'en ouvrir un existant.

ÉTAPE 1 : DEMANDER À L'UTILISATEUR
Vous devriez déjà savoir de quel pays il s'agit à partir du contexte de la plateforme. Si vous ne savez pas de quel pays il s'agit, utiliser ask_user_questions pour demander.

Utiliser ask_user_questions pour poser chacune des questions suivantes une à la fois :
1. « Quelle période d'analyse dois-je utiliser ? (mois/année de début au mois/année de fin, par exemple janvier 2023 à septembre 2025) »
2. « Quel sous-titre souhaitez-vous pour la couverture ? » — proposer ces options sélectionnables : « T3 2025 », « Annuel 2025 », « Janvier-juin 2025 » (l'utilisateur peut aussi saisir le sien)
3. « Quand cette analyse a-t-elle été finalisée ? » — suggérer le mois et l'année en cours (par exemple « avril 2026 ») mais laisser l'utilisateur confirmer ou modifier. Utiliser sa réponse comme date de génération du rapport.

Quand l'utilisateur fournit la période d'analyse, convertir au format period_id :
- La date de début devient la valeur minimale : [ANNÉE][MOIS] sous forme de nombre à 6 chiffres (par exemple janvier 2025 = 202501)
- La date de fin devient la valeur maximale : [ANNÉE][MOIS] sous forme de nombre à 6 chiffres (par exemple décembre 2025 = 202512)
- Conserver ces valeurs pour les utiliser dans periodFilterOverride pour toutes les diapositives d'indicateurs

ÉTAPE 2 : DÉCOUVRIR LES INDICATEURS DISPONIBLES
Avant de générer le rapport, vérifier quels indicateurs sont disponibles dans la plateforme pour ce pays :

Chaque instance pays a des identifiants d'indicateurs (indicator_common_id) et des libellés différents. Ne PAS supposer une liste fixe de codes — les lire depuis la plateforme.

1. Passer en revue tous les identifiants d'indicateurs et leurs libellés disponibles dans la plateforme pour ce pays
2. Pour chaque indicateur, appeler get_metric_data avec la période d'analyse pour vérifier qu'il contient des données. Ne conserver que les indicateurs ayant des données réelles pour la période d'analyse
3. Présenter la liste filtrée à l'utilisateur (identifiant + libellé)
4. Proposer des regroupements basés sur les libellés des indicateurs. Utiliser les exemples ci-dessous comme guide, mais adapter à ce qui existe réellement :
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
5. Utiliser ask_user_questions pour présenter les regroupements proposés pour examen. Lister chaque groupe avec ses indicateurs (identifiant + libellé). Demander : « Voici les regroupements d'indicateurs proposés. Souhaitez-vous modifier quelque chose — déplacer des indicateurs entre groupes, créer de nouveaux groupes ou en exclure certains ? »
6. Après confirmation des regroupements principaux, vérifier les indicateurs de mortalité (par exemple maternal_deaths, neonatal_deaths, stillbirths). Toujours utiliser ask_user_questions pour demander : « La plateforme dispose de ces indicateurs de mortalité : [liste]. Les données de mortalité impliquent des comptages d'événements faibles et une interprétation différente (les augmentations = négatif). Souhaitez-vous les inclure dans le rapport ou les exclure ? »
7. Si un groupe confirmé contient plus de 3 indicateurs, utiliser ask_user_questions pour suggérer de le scinder en sous-groupes logiques. Chaque sous-groupe aura son propre ensemble de diapositives.

Chaque groupe/sous-groupe confirmé deviendra un ensemble de diapositives dans la section d'analyse nationale (tendances mensuelles, variation trimestrielle et analyse des perturbations). Utiliser les valeurs exactes de indicator_common_id de la plateforme pour tous les paramètres techniques (filterOverrides, selectedReplicant).

EXIGENCES DE PRÉCISION :
1. Baser toute l'analyse uniquement sur les données visibles dans la plateforme - ne pas recourir à des connaissances externes
2. Ne pas inventer de statistiques, de pourcentages ou de chiffres précis - si les données ne sont pas visibles, le signaler
3. Si une affirmation ne peut être vérifiée à partir des données, la marquer avec [VÉRIFIER]
4. Ne pas deviner les dates, les périodes ou les magnitudes
5. JAMAIS deviner ce que signifient les acronymes ni inventer des descriptions de méthodologie. Avant d'écrire toute expansion d'acronyme, définition de terme technique ou explication méthodologique, utiliser get_methodology_docs_list et get_methodology_doc_content pour vérifier dans la documentation officielle. Si vous ne pouvez pas le vérifier, ne pas l'inclure

NORMES DU RAPPORT :
1. Maintenir un langage prudent et analytique - pas d'affirmations causales
2. Traiter les signaux de perturbation comme descriptifs et exploratoires
3. Garder le texte des diapositives concis — cible 50-100 mots par diapositive (max 180 mots), utiliser des listes à puces si approprié
4. Mise en page des diapositives de contenu : interprétation textuelle (span 4) à gauche, visualisation (span 8) à droite. Après avoir ajouté les deux blocs, utiliser modify_slide_layout pour les disposer côte à côte en répartition 4-8. Ne pas laisser les blocs empilés verticalement
5. Utiliser une terminologie cohérente tout au long du rapport (ne pas alterner entre synonymes)
6. Dans tout le texte des diapositives (titres, interprétations), désigner les indicateurs uniquement par leur libellé lisible (par exemple « Cas de pneumonie identifiés », « Consultation CPN 1 »). JAMAIS inclure les codes indicator_common_id dans le texte — ni seuls, ni entre parenthèses, ni sous forme « code (Libellé) ». Écrire « Cas de pneumonie identifiés », PAS « pneumonia_cases_identified (Cas de pneumonie identifiés) ». Les codes ne servent que pour les paramètres techniques (filterOverrides, selectedReplicant)
7. Toujours désigner les diapositives par leur numéro (pas par leur ID)

CRITIQUE — RÈGLES D'INTERPRÉTATION DES INDICATEURS :
Toutes les augmentations NE SONT PAS positives. Toutes les baisses NE SONT PAS négatives. Vous DEVEZ appliquer l'interprétation correcte selon le type d'indicateur :

Indicateurs de prestation de services (augmentation = positif, baisse = préoccupant) :
- Visites CPN, accouchements, CPoN, vaccinations, consultations externes, planification familiale, accouchements assistés
- Pour ceux-ci : « surplus » (au-dessus de l'attendu) = signal positif, « perturbation » (en dessous de l'attendu) = préoccupant

Indicateurs de mortalité et d'issues défavorables (augmentation = MAUVAIS, baisse = positif) :
- Décès maternels, décès néonatals, mortinaissances, et tout indicateur mesurant des décès ou des issues défavorables
- Pour ceux-ci : une AUGMENTATION est un résultat NÉGATIF — plus de décès est TOUJOURS mauvais
- Pour ceux-ci : une DIMINUTION est un résultat POSITIF — moins de décès est TOUJOURS bon
- Ne JAMAIS décrire une augmentation des décès comme une « amélioration » ou une « tendance positive »
- Ne JAMAIS décrire une diminution des décès comme une « préoccupation » ou une « perturbation »

Indicateurs négatifs de qualité (augmentation = mauvais, baisse = bon) :
- Taux d'abandon (par exemple abandon Penta1 à Penta3), taux de valeurs aberrantes, taux de rupture de stock
- Pour ceux-ci : une augmentation signifie que la situation se détériore

Lors de la rédaction des titres et des interprétations, toujours vérifier : cet indicateur mesure-t-il quelque chose dont nous voulons PLUS (services) ou MOINS (décès, abandons) ? Formuler en conséquence.

VÉRIFICATION - Avant de finaliser chaque diapositive, vérifier :
1. Toutes les valeurs numériques correspondent à ce que montre la visualisation
2. Les périodes et les noms d'indicateurs sont correctement référencés
3. Les tendances décrites (hausses, baisses) correspondent à la direction réelle des données
4. Les chiffres sont cohérents entre les diapositives (même indicateur = mêmes valeurs)
5. Le cadrage de l'interprétation correspond au type d'indicateur — une augmentation des décès n'est JAMAIS décrite comme positive

STRUCTURE :

DIAPOSITIVE 1 - Diapositive de couverture
- Titre : « Suivi des perturbations des services essentiels à partir des données du SNIS au/à/aux [PAYS] »
  - Adapter l'article selon le pays (au Sénégal, à Madagascar, aux Philippines, en Côte d'Ivoire, au Tchad, en Mauritanie, au Niger, etc.)
- Sous-titre : « [SOUS_TITRE_RAPPORT] »
- Ajouter un bloc de texte en bas : « Analyse générée en [MOIS_ANNÉE_ACTUEL] »

DIAPOSITIVE 2 - Diapositive d'introduction
- Titre : « Suivi des perturbations des services essentiels à partir des données du SNIS »
- Bloc de texte : « L'approche FASTR utilise les données de routine du SNIS pour suivre l'évolution de la prestation de services au fil du temps. En comparant les volumes de services observés aux volumes attendus — ajustés pour la saisonnalité et les tendances historiques — nous pouvons identifier les perturbations ou les surplus dans les services de santé clés. Cette analyse offre une perspective rapide à l'échelle du système, mettant en évidence où et quand l'utilisation des services s'écarte des schémas attendus. Les résultats génèrent des données probantes exploitables pour guider des réponses rapides, contribuant à maintenir la continuité des soins essentiels en période d'incertitude financière ou de changement opérationnel. »
- Ajouter un bloc image

DIAPOSITIVE 3 - Diapositive méthodologique
- Titre : « Méthodologie : Évaluation de l'utilisation des services »
- Insérer le texte tel quel sans le réduire. Dans un seul bloc de texte avec des puces :

Évaluation de la qualité des données
Identifie les principaux problèmes de qualité des données en évaluant la complétude des indicateurs, en détectant les valeurs aberrantes extrêmes et en vérifiant la cohérence entre indicateurs liés — à partir des données mensuelles du SNIS (DHIS2) au niveau des établissements.

Applique des ajustements ciblés aux points de données signalés, en remplaçant les valeurs aberrantes et en imputant les données manquantes à l'aide d'une moyenne mobile centrée sur 12 mois ; les moyennes au niveau des établissements sont utilisées par défaut lorsque l'historique de données est insuffisant.

Évaluation de l'utilisation des services
Analyse des tendances d'utilisation des services, qui identifie le pourcentage de variation de l'utilisation des services pour chaque trimestre par rapport au trimestre précédent.

Analyse des perturbations et des surplus dans l'utilisation des services, qui détecte les changements significatifs (positifs ou négatifs) dans l'utilisation des services au-delà de ce qui serait attendu compte tenu de la saisonnalité et des tendances historiques.

Comment interpréter les figures de perturbation : Les zones ombrées en rouge = perturbations potentielles (en dessous de l'attendu). Les zones ombrées en vert = surplus potentiels (au-dessus de l'attendu). Ce sont des signaux, pas des conclusions — ils nécessitent une investigation plus approfondie.

Plus de détails sur la méthodologie et les approches d'ajustement de la qualité des données sont disponibles en annexe. Le code R complet et la documentation source sont également disponibles publiquement sur GitHub (https://github.com/FASTR-Analytics)

- Note : La qualité des données affecte l'interprétation. Lorsque la complétude est faible, les valeurs attendues peuvent être artificiellement plus élevées que les valeurs observées, créant des « perturbations » apparentes qui reflètent en réalité des rapports manquants plutôt que de véritables baisses de la prestation de services.

DIAPOSITIVE 4 - Diapositive de sélection des indicateurs
- Titre : « Méthodologie : Sélection des indicateurs »
- Sous-titre : « Les indicateurs pour l'analyse de l'utilisation des services ont été sélectionnés en tenant compte des indicateurs priorisés au niveau national. »
- Lister tous les indicateurs disponibles regroupés par les catégories confirmées à l'Étape 2

DIAPOSITIVE 5 - Diapositive d'en-tête de section
- Titre : « Section 1 : Utilisation des services »
- Sous-titre : « Évaluation des volumes projetés sur la base des tendances historiques pour identifier les surplus et les perturbations dans les services de santé »

DIAPOSITIVES 6+ - Diapositives d'analyse nationale (trois diapositives par GROUPE d'indicateurs)
Pour chaque groupe d'indicateurs confirmé à l'Étape 2, créer trois diapositives consécutives :
- Type A : Tendances mensuelles d'utilisation des services
- Type B : Volume trimestriel avec variation en % d'un trimestre à l'autre
- Type C : Analyse des perturbations

Avant de créer les diapositives pour chaque groupe, appeler get_metric_data pour vérifier la disponibilité des données.

DIAPOSITIVE TYPE A : Tendances mensuelles d'utilisation des services

Titre : « Tendances en [description du groupe] » — utiliser une phrase descriptive pour le domaine de service, PAS une liste de codes d'indicateurs
- Bon : « Tendances en soins prénatals »
- Mauvais : « Tendances en anc1, anc4 »

Interprétation (côté gauche, span 4 — 60-100 mots, max 130) : Utiliser des listes à puces :
- Une puce par indicateur décrivant les fluctuations mensuelles
- Observation croisée entre indicateurs : schémas, écarts
- Implications : une phrase avec une recommandation concrète

Visualization (right side, span 8): Create using from_metric with:
- metricId: "m3-01-01"
- vizPresetId: "volume-monthly"
- valuesFilter: "count_final_both"
- filterOverrides: all indicator codes in the group
- Use startDate/endDate covering last 12 complete quarters (36 months)

DIAPOSITIVE TYPE B : Variation trimestrielle du volume de services

Titre : Une phrase analytique résumant la conclusion trimestrielle principale. Au passé, 1-2 phrases maximum.
- Bon : « Les services prénatals ont montré une croissance progressive, les quatrièmes visites augmentant plus nettement que les premières en 2025 »
- Mauvais : « Variation trimestrielle des services prénatals »

Interprétation (côté gauche, span 4 — 50-80 mots, max 100) :
- Un paragraphe autonome : résumé de la tendance globale
- Par indicateur : variations spécifiques d'un trimestre à l'autre avec pourcentages
- Ne mentionner que les trimestres avec >10 % de variation. Si aucune variation >10 % : « [INDICATEUR] est resté stable depuis [DATE]... »

Visualization (right side, span 8): Create using from_metric with:
- metricId: "m3-01-01"
- vizPresetId: "volume-quarterly"
- valuesFilter: "count_final_both"
- filterOverrides: all indicator codes in the group
- Show data labels, indicator in columns not lines

DIAPOSITIVE TYPE C : Analyse des perturbations

Titre : Rédiger un titre analytique (1-2 phrases) résumant la conclusion principale pour ce groupe d'indicateurs. Le titre doit décrire ce que montrent les données, pas simplement nommer les indicateurs.
- Bon exemple : « Malgré des déficits généralisés en 2024, les services de vaccination montrent des signes de reprise à la mi-2025, avec quelques perturbations pour le BCG »
- Bon exemple : « Les accouchements montrent un surplus en 2025, tandis que les CPoN ont récupéré après des perturbations antérieures »
- Mauvais exemple : « BCG - Vaccin Bacillus Calmette-Guérin »
- Mauvais exemple : « Indicateurs de vaccination »

Visualization (right side, span 8): Create using from_metric with these parameters:
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

Interprétation (côté gauche, span 4 — cible 50-100 mots, max 180) : Analyser les données affichées dans la visualisation. Utiliser des listes à puces couvrant :
- Pour CHAQUE indicateur : périodes spécifiques de perturbations/surplus, avec ampleurs approximatives (chiffres ou pourcentages du graphique)
- Schémas croisés entre indicateurs : comment les indicateurs sont liés entre eux
- Évaluation globale de ce que le schéma combiné signifie
- IMPORTANT : Ne décrire que ce qui est réellement visible dans le graphique - ne pas inventer de données

Bon exemple (pour un groupe Accouchements et CPoN) :
« - Accouchements : Stables en 2023-24, surplus net début 2025 (~1 200 accouchements de plus que prévu par mois, +9,6 %), déclin modéré mi-2025 mais toujours proche des niveaux attendus en septembre
- Visites CPoN : Plusieurs perturbations sous le niveau attendu en 2023-24, hausse puis baisse en 2025 ramenant les volumes plus près des tendances attendues
- Les deux indicateurs suivent la même trajectoire en 2025, cohérent avec le fait que les CPoN suivent généralement les tendances des accouchements »

DERNIÈRE PAGE :
- "FASTR initiative:" followed by https://data.gffportal.org/key-theme/FASTR

APRÈS AVOIR TERMINÉ LE RAPPORT :
Informer l'utilisateur : « Rapport terminé. Si vous souhaitez ajouter d'autres sections, vous pouvez exécuter ces prompts depuis la bibliothèque : Prompt 2 (Analyse régionale des perturbations) ou Prompt 3 (Annexe évaluation de la qualité des données). »
```

## Prompt 2 : Analyse régionale des perturbations

```prompt
Génère l'Annexe 1 : Analyse régionale des perturbations pour toutes les zones infranationales. Insérer cette annexe avant la dernière page (diapositive FASTR initiative). La dernière page doit rester la toute dernière diapositive du rapport complet — la retirer de sa position actuelle et la remettre après l'annexe.

EXIGENCES DE PRÉCISION :
1. Baser toute l'analyse uniquement sur les données visibles dans la plateforme
2. Ne pas inventer de statistiques ou de chiffres précis - si les données ne sont pas visibles, le signaler
3. Si une affirmation ne peut être vérifiée à partir des données, la marquer avec [VÉRIFIER]
4. JAMAIS deviner ce que signifient les acronymes ni inventer des descriptions de méthodologie. Avant d'écrire toute expansion d'acronyme, définition de terme technique ou explication méthodologique, utiliser get_methodology_docs_list et get_methodology_doc_content pour vérifier dans la documentation officielle. Si vous ne pouvez pas le vérifier, ne pas l'inclure

NORMES DU RAPPORT :
1. Maintenir un langage prudent et analytique - pas d'affirmations causales
2. Traiter les signaux de perturbation comme descriptifs et exploratoires
3. Mise en page : après avoir ajouté les blocs texte et visualisation à une diapositive, utiliser modify_slide_layout pour les disposer côte à côte en répartition 6-6 — bloc texte (span 6) à gauche, bloc visualisation (span 6) à droite. Ne pas laisser les blocs empilés verticalement
4. Utiliser une terminologie cohérente tout au long du rapport
5. Toujours désigner les diapositives par leur numéro (pas par leur ID)

CRITIQUE — RÈGLES D'INTERPRÉTATION DES INDICATEURS :
Toutes les augmentations NE SONT PAS positives. Toutes les baisses NE SONT PAS négatives. Vous DEVEZ appliquer l'interprétation correcte selon le type d'indicateur :

Indicateurs de prestation de services (augmentation = positif, baisse = préoccupant) :
- Visites CPN, accouchements, CPoN, vaccinations, consultations externes, planification familiale, accouchements assistés
- Pour ceux-ci : « surplus » (au-dessus de l'attendu) = signal positif, « perturbation » (en dessous de l'attendu) = préoccupant

Indicateurs de mortalité et d'issues défavorables (augmentation = MAUVAIS, baisse = positif) :
- Décès maternels, décès néonatals, mortinaissances, et tout indicateur mesurant des décès ou des issues défavorables
- Pour ceux-ci : une AUGMENTATION est un résultat NÉGATIF — plus de décès est TOUJOURS mauvais
- Pour ceux-ci : une DIMINUTION est un résultat POSITIF — moins de décès est TOUJOURS bon
- Ne JAMAIS décrire une augmentation des décès comme une « amélioration » ou une « tendance positive »
- Ne JAMAIS décrire une diminution des décès comme une « préoccupation » ou une « perturbation »

Indicateurs négatifs de qualité (augmentation = mauvais, baisse = bon) :
- Taux d'abandon (par exemple abandon Penta1 à Penta3), taux de valeurs aberrantes, taux de rupture de stock
- Pour ceux-ci : une augmentation signifie que la situation se détériore

Lors de la rédaction des titres et des interprétations, toujours vérifier : cet indicateur mesure-t-il quelque chose dont nous voulons PLUS (services) ou MOINS (décès, abandons) ? Formuler en conséquence.

VÉRIFICATION : Avant de finaliser chaque diapositive, vérifier que les tendances décrites correspondent à ce que montre la visualisation. Confirmer que le cadrage de l'interprétation correspond au type d'indicateur — une augmentation des décès n'est JAMAIS décrite comme positive.

STRUCTURE :

DIAPOSITIVE 1 - Diapositive d'en-tête de l'annexe
- Titre : « Annexe 1 : Perturbations de l'utilisation des services au niveau infranational »

DIAPOSITIVE 2 - Tableau synthétique infranational
Titre : Rédiger un titre analytique résumant la principale conclusion infranationale (par exemple « D'importantes disparités au niveau des comtés en matière de performance soulignent la nécessité de comprendre les facteurs locaux des gains et des lacunes dans les services »)

Visualization (right side): Create using from_metric with these parameters:
- type: "from_metric"
- metricId: "m3-03-02"
  Metric: Difference between actual and expected service volume [Admin area 2] [percent]
  Values: pct_diff (Percent difference)
  Auto-disaggregated by: admin_area_2, indicator_common_id
- vizPresetId: "disruption-differences-table"
- filterOverrides: Filter on indicator_common_id to include all indicators from the report
- periodFilterOverride: Use the same period as the main report

Interprétation (côté gauche) : 2-3 phrases résumant les principaux schémas (par exemple quelles zones montrent des surplus ou des déficits constants, si la performance varie selon le domaine de services).

Ajouter un bloc de texte en bas : « Pourcentage de différence entre le nombre de services observés et le nombre de services attendus. Une valeur négative indique un niveau observé inférieur au niveau attendu (perturbation), tandis qu'une valeur positive indique un niveau supérieur (surplus). »

DIAPOSITIVES 3+ - Profils par zone infranationale
Pour CHAQUE zone infranationale dans la plateforme, créer une diapositive simple avec :

- Titre : Nom de la zone infranationale
- Visualization: Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: "m3-03-01"
    Metric: Actual vs expected service volume [Admin area 2] [number]
    Values: count_sum (Actual service volume), count_expected_if_above_diff_threshold (Expected service volume)
    Auto-disaggregated by: admin_area_2, indicator_common_id
  - vizPresetId: "disruption-chart-single-admin-area-2" (REQUIRES selectedReplicant)
  - chartTitle: « Comparaison de l'utilisation des services rapportée aux tendances attendues, [Nom de la zone] »
  - selectedReplicant: The admin_area_2 value for this specific subnational area
  - filterOverrides: Filter on indicator_common_id to include all indicators from the report
  - periodFilterOverride: Use the same period as the main report

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
4. JAMAIS deviner ce que signifient les acronymes ni inventer des descriptions de méthodologie. Avant d'écrire toute expansion d'acronyme, définition de terme technique ou explication méthodologique, utiliser get_methodology_docs_list et get_methodology_doc_content pour vérifier dans la documentation officielle. Si vous ne pouvez pas le vérifier, ne pas l'inclure

NORMES DU RAPPORT :
1. Maintenir un langage prudent et analytique
2. Mise en page : après avoir ajouté les blocs texte et visualisation à une diapositive, utiliser modify_slide_layout pour les disposer côte à côte en répartition 6-6 — bloc texte (span 6) à gauche, bloc visualisation (span 6) à droite. Ne pas laisser les blocs empilés verticalement
3. Utiliser une terminologie cohérente tout au long du rapport
4. Toujours désigner les diapositives par leur numéro (pas par leur ID)

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

Interprétation (côté gauche) : Utiliser des listes à puces :
- Un résumé des tendances de complétude sur la période d'analyse
- Quels indicateurs ont une complétude plus faible (les nommer)
- Si la complétude s'est améliorée au fil du temps

Puis ajouter un bloc de texte avec :

**Pourquoi la complétude est importante pour l'analyse des perturbations**

Valeurs observées : Elles sont ajustées uniquement pour les valeurs aberrantes, et reflètent donc les volumes réels de services après suppression des pics implausibles.

Valeurs attendues : Elles sont ajustées pour la complétude et les valeurs aberrantes. Cela signifie que le modèle « comble » les lacunes de rapportage, construisant une ligne de tendance attendue comme si tous les établissements avaient rapporté de manière cohérente.

Lorsque la complétude est élevée, les volumes observés et attendus sont plus comparables, et les perturbations reflètent plus probablement de véritables changements dans les services.

Lorsque la complétude est faible, les valeurs attendues peuvent être artificiellement supérieures aux valeurs observées, créant des « perturbations » apparentes qui reflètent en réalité des rapports manquants plutôt que de véritables baisses de la prestation de services.

ÉTAPE 2 : DEMANDER À L'UTILISATEUR
Après avoir généré le résumé de complétude, utiliser ask_user_questions pour demander : « Souhaitez-vous que j'ajoute des diapositives supplémentaires sur la qualité des données couvrant les valeurs aberrantes, la cohérence interne et les tendances des scores EQD ? » — poser exactement cette question uniquement, ne pas ajouter d'explications

Si l'utilisateur accepte, mettre à jour le titre de la diapositive de couverture en « Annexe [1 ou 2] : Évaluation de la qualité des données », puis générer les diapositives supplémentaires suivantes :

DIAPOSITIVE 3 - Valeurs aberrantes
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
- Interprétation (côté gauche) : Utiliser des listes à puces :
  - Décrire la tendance nationale globale des taux de valeurs aberrantes — sont-ils stables, en amélioration ou en détérioration ?
  - Nommer les indicateurs spécifiques avec les taux de valeurs aberrantes les plus élevés
  - Indiquer si les taux de valeurs aberrantes se sont améliorés ou détériorés au cours de la période d'analyse
  - Expliquer l'implication : des taux élevés de valeurs aberrantes signifient que davantage de valeurs sont ajustées, ce qui peut affecter la fiabilité de l'analyse des tendances
- Ajouter un bloc de texte sous l'interprétation : « Les valeurs aberrantes sont des rapports dont les volumes sont anormalement élevés par rapport au volume habituel rapporté par l'établissement les autres mois. Les valeurs aberrantes sont identifiées en évaluant la variation intra-établissement du rapportage mensuel pour chaque indicateur. Les valeurs aberrantes sont définies comme des observations supérieures à 10 fois l'écart absolu médian (MAD) par rapport à la médiane mensuelle de l'indicateur pour chaque période, OU une valeur dont la contribution proportionnelle en volume pour un établissement, un indicateur et une période est supérieure à 80 %. Les valeurs aberrantes ne sont identifiées que pour les indicateurs dont le volume est supérieur ou égal à la médiane, le volume n'est pas manquant et le volume moyen est supérieur à 100. »

DIAPOSITIVE 4 - Cohérence interne
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
- Interprétation (côté gauche) : Utiliser des listes à puces :
  - Expliquer ce que chaque ratio_type représente (par exemple Penta1/Penta3 compare la première à la troisième dose, CPN1/CPN4 compare la première à la quatrième visite)
  - Identifier quels ratios respectent ou échouent systématiquement les critères
  - Indiquer si la cohérence s'améliore ou se détériore au cours de la période d'analyse
  - Mettre en évidence toute région spécifique où la cohérence est notablement faible
- Ajouter un bloc de texte sous l'interprétation : « La cohérence interne évalue la plausibilité des données rapportées sur la base d'indicateurs connexes. Les métriques de cohérence sont approximatives — selon le calendrier et la saisonnalité, les définitions des indicateurs et la nature de la prestation de services et du rapportage, les valeurs peuvent se situer en dehors des plages plausibles. Les indicateurs similaires sont censés avoir approximativement le même volume sur l'année (dans une marge de 30 %). Les données de cette analyse sont ajustées pour les valeurs aberrantes. »

DIAPOSITIVE 5 - Tendances de la qualité des données (score EQD global)
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
- Interprétation (côté gauche) : Utiliser des listes à puces :
  - Décrire la tendance nationale — la qualité des données s'améliore-t-elle au fil du temps ?
  - Nommer les régions les plus performantes et les moins performantes
  - Identifier les régions où la qualité des données s'est notablement améliorée ou détériorée
  - Expliquer l'implication : les zones avec des scores EQD faibles peuvent avoir des estimations de perturbation moins fiables
- Ajouter un bloc de texte sous l'interprétation : « Une qualité de données adéquate est définie comme : 1) Pas de données manquantes ni de valeurs aberrantes pour les consultations externes, le Penta1 et la CPN1, lorsque disponibles 2) Rapportage cohérent entre Penta1/Penta3 et CPN1/CPN4. »

DIAPOSITIVE 6 - Tendances de la qualité des données (score EQD moyen)
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
- Interprétation (côté gauche) : Utiliser des listes à puces :
  - Décrire la tendance nationale du score moyen de l'EQD — s'améliore-t-elle, est-elle stable ou en déclin ?
  - Comparer les régions les plus performantes aux moins performantes
  - Signaler toute région montrant une amélioration ou un déclin significatif
  - Conclure avec une évaluation globale de la trajectoire de la qualité des données et ce que cela signifie pour l'analyse des perturbations
- Ajouter un bloc de texte sous l'interprétation : « Les éléments inclus dans le score EQD sont : Pas de données manquantes pour 1) les consultations externes, 2) le Penta1 et 3) la CPN1, lorsque disponibles ; Pas de valeurs aberrantes pour 4) les consultations externes, 5) le Penta1 et 6) la CPN1, lorsque disponibles ; Rapportage cohérent entre 7) Penta1/Penta3, 8) CPN1/CPN4, 9) BCG/Accouchements, lorsque disponibles. »
```

## Prompt 4 : Rapport infranational sur les perturbations

```prompt
Génère un rapport FASTR sur les perturbations au niveau infranational. Ce rapport se concentre sur une seule zone infranationale (par exemple un État, une province ou un comté) et est autonome — il couvre l'analyse principale des perturbations, avec une ventilation optionnelle par sous-zone et une évaluation optionnelle de la qualité des données.

Toujours vérifier si l'utilisateur est en mode editing_slide_deck. Si l'utilisateur n'est pas dans ce mode, lui demander de créer un nouveau slide deck ou d'en ouvrir un existant.

ÉTAPE 1 : DEMANDER À L'UTILISATEUR
Vous devriez déjà savoir de quel pays il s'agit à partir du contexte de la plateforme. Si vous ne savez pas de quel pays il s'agit, utiliser ask_user_questions pour demander.

Utiliser ask_user_questions pour poser chacune des questions suivantes une à la fois :
1. « Sur quelle zone infranationale ce rapport doit-il se concentrer ? (par exemple zone, État, comté ou district) » — poser comme question à texte libre, laisser l'utilisateur saisir le nom de la zone
2. « Quelle période d'analyse dois-je utiliser ? (mois/année de début au mois/année de fin, par exemple janvier 2023 à septembre 2025) »
3. « Quel sous-titre souhaitez-vous pour la couverture ? » — proposer ces options sélectionnables : « T3 2025 », « Annuel 2025 », « Janvier-juin 2025 » (l'utilisateur peut aussi saisir le sien)
4. « Quand cette analyse a-t-elle été finalisée ? » — suggérer le mois et l'année en cours (par exemple « avril 2026 ») mais laisser l'utilisateur confirmer ou modifier. Utiliser sa réponse comme date de génération du rapport.

Quand l'utilisateur fournit la période d'analyse, convertir au format period_id :
- La date de début devient la valeur minimale : [ANNÉE][MOIS] sous forme de nombre à 6 chiffres (par exemple janvier 2025 = 202501)
- La date de fin devient la valeur maximale : [ANNÉE][MOIS] sous forme de nombre à 6 chiffres (par exemple décembre 2025 = 202512)
- Conserver ces valeurs pour les utiliser dans periodFilterOverride pour toutes les diapositives d'indicateurs

ÉTAPE 2 : IDENTIFIER LE NIVEAU ADMINISTRATIF ET LES INDICATEURS
Vous connaissez déjà la hiérarchie administrative de chaque pays. En fonction du pays et du nom de la zone de l'Étape 1, déterminer à quel niveau administratif la zone appartient et vérifier qu'elle existe dans la plateforme.

Enregistrer pour utilisation tout au long du rapport :
- AREA_LEVEL : la colonne du niveau administratif (par exemple "admin_area_2" ou "admin_area_3")
- AREA_VALUE : le nom exact de la zone tel qu'il apparaît dans la plateforme

Utiliser get_available_metrics pour trouver l'indicateur de perturbation et le préréglage de graphique pour zone unique au AREA_LEVEL. Stocker comme AREA_METRIC_ID et AREA_PRESET_ID.

Correspondances courantes des indicateurs :
- admin_area_2 : metricId "m3-03-01", vizPresetId "disruption-chart-single-admin-area-2"
- admin_area_3 : metricId "m3-04-01", vizPresetId "disruption-chart-single-admin-area-3"

Vérifier également si un indicateur de perturbation existe au niveau administratif suivant (pour la ventilation optionnelle par sous-zone à l'Étape 4). Si trouvé, stocker comme SUB_AREA_METRIC_ID, SUB_AREA_PRESET_ID et SUB_AREA_TABLE_METRIC_ID :
- Si AREA_LEVEL est admin_area_2, les indicateurs de sous-zone sont :
  - SUB_AREA_METRIC_ID : "m3-04-01" (graphique par district unique)
  - SUB_AREA_PRESET_ID : "disruption-chart-single-admin-area-3"
  - SUB_AREA_TABLE_METRIC_ID : "m3-04-02" avec vizPresetId "disruption-differences-table-single-admin-area-2-multiple-admin-area-3" (tableau récapitulatif de tous les districts au sein de la zone)

Si aucun indicateur de perturbation n'existe au AREA_LEVEL, en informer l'utilisateur et suggérer des alternatives.

ÉTAPE 3 : DÉCOUVRIR LES INDICATEURS DISPONIBLES
Avant de générer le rapport, vérifier quels indicateurs sont disponibles dans la plateforme pour ce pays.

Chaque instance pays a des identifiants d'indicateurs (indicator_common_id) et des libellés différents. Ne PAS supposer une liste fixe de codes — les lire depuis la plateforme.

1. Passer en revue tous les identifiants d'indicateurs et leurs libellés disponibles dans la plateforme pour ce pays
2. Présenter la liste complète à l'utilisateur (identifiant + libellé)
3. Proposer des regroupements basés sur les libellés des indicateurs. Utiliser les exemples ci-dessous comme guide, mais adapter à ce qui existe réellement :
   - Soins prénatals : indicateurs liés aux visites CPN (par exemple anc1, anc4, anc_trimester1)
   - Accouchements et soins postnatals : accouchements en structure, personnel qualifié, CPoN, césariennes (par exemple delivery, sba, pnc1, csection)
   - Vaccination : vaccins (par exemple bcg, penta1, penta3, measles1, opv1, fully_immunized)
   - Planification familiale : conseil PF, nouveaux utilisateurs, utilisateurs continus (par exemple fp_new, fp_new_and_cont, fp_counseled)
   - Planification familiale des adolescents : si des indicateurs PF spécifiques aux adolescents existent, les regrouper séparément (par exemple fp_adolescent_counseled, fp_adolescent_new)
   - Paludisme : tests, positivité, traitement (par exemple malaria_rdt_positive, malaria_treated_less_24hrs, mal_positive)
   - Services généraux / Consultations externes : visites ambulatoires (par exemple opd, opd_under5, opd_over5)
   - Autres groupes selon les besoins basés sur ce qui existe (par exemple Nutrition, VIH/TB, MNT, Mortalité)
4. Utiliser ask_user_questions pour présenter les regroupements proposés pour examen. Lister chaque groupe avec ses indicateurs (identifiant + libellé). Demander : « Voici les regroupements d'indicateurs proposés. Souhaitez-vous modifier quelque chose — déplacer des indicateurs entre groupes, créer de nouveaux groupes ou en exclure certains ? »
5. Après confirmation des regroupements principaux, vérifier les indicateurs de mortalité (par exemple maternal_deaths, neonatal_deaths, stillbirths). Toujours utiliser ask_user_questions pour demander : « La plateforme dispose de ces indicateurs de mortalité : [liste]. Les données de mortalité impliquent des comptages d'événements faibles et une interprétation différente (les augmentations = négatif). Souhaitez-vous les inclure dans le rapport ou les exclure ? »

Chaque groupe confirmé deviendra UNE diapositive dans la section d'analyse, avec tous les indicateurs de ce groupe affichés côte à côte sur le même graphique. Utiliser les valeurs exactes de indicator_common_id de la plateforme pour les paramètres filterOverrides et selectedReplicant.

EXIGENCES DE PRÉCISION :
1. Baser toute l'analyse uniquement sur les données visibles dans la plateforme - ne pas recourir à des connaissances externes
2. Ne pas inventer de statistiques, de pourcentages ou de chiffres précis - si les données ne sont pas visibles, le signaler
3. Si une affirmation ne peut être vérifiée à partir des données, la marquer avec [VÉRIFIER]
4. Ne pas deviner les dates, les périodes ou les magnitudes
5. JAMAIS deviner ce que signifient les acronymes ni inventer des descriptions de méthodologie. Avant d'écrire toute expansion d'acronyme, définition de terme technique ou explication méthodologique, utiliser get_methodology_docs_list et get_methodology_doc_content pour vérifier dans la documentation officielle. Si vous ne pouvez pas le vérifier, ne pas l'inclure

NORMES DU RAPPORT :
1. Maintenir un langage prudent et analytique - pas d'affirmations causales
2. Traiter les signaux de perturbation comme descriptifs et exploratoires
3. Garder le texte des diapositives concis — cible 50-100 mots par diapositive (max 180 mots), utiliser des listes à puces si approprié
4. Mise en page : après avoir ajouté les blocs texte et visualisation à une diapositive, utiliser modify_slide_layout pour les disposer côte à côte en répartition 6-6 — bloc texte (span 6) à gauche, bloc visualisation (span 6) à droite. Ne pas laisser les blocs empilés verticalement
5. Utiliser une terminologie cohérente tout au long du rapport (ne pas alterner entre synonymes)
6. Dans tout le texte des diapositives (titres, interprétations), désigner les indicateurs uniquement par leur libellé lisible (par exemple « Cas de pneumonie identifiés », « Consultation CPN 1 »). JAMAIS inclure les codes indicator_common_id dans le texte — ni seuls, ni entre parenthèses, ni sous forme « code (Libellé) ». Écrire « Cas de pneumonie identifiés », PAS « pneumonia_cases_identified (Cas de pneumonie identifiés) ». Les codes ne servent que pour les paramètres techniques (filterOverrides, selectedReplicant)
7. Toujours désigner les diapositives par leur numéro (pas par leur ID)

CRITIQUE — RÈGLES D'INTERPRÉTATION DES INDICATEURS :
Toutes les augmentations NE SONT PAS positives. Toutes les baisses NE SONT PAS négatives. Vous DEVEZ appliquer l'interprétation correcte selon le type d'indicateur :

Indicateurs de prestation de services (augmentation = positif, baisse = préoccupant) :
- Visites CPN, accouchements, CPoN, vaccinations, consultations externes, planification familiale, accouchements assistés
- Pour ceux-ci : « surplus » (au-dessus de l'attendu) = signal positif, « perturbation » (en dessous de l'attendu) = préoccupant

Indicateurs de mortalité et d'issues défavorables (augmentation = MAUVAIS, baisse = positif) :
- Décès maternels, décès néonatals, mortinaissances, et tout indicateur mesurant des décès ou des issues défavorables
- Pour ceux-ci : une AUGMENTATION est un résultat NÉGATIF — plus de décès est TOUJOURS mauvais
- Pour ceux-ci : une DIMINUTION est un résultat POSITIF — moins de décès est TOUJOURS bon
- Ne JAMAIS décrire une augmentation des décès comme une « amélioration » ou une « tendance positive »
- Ne JAMAIS décrire une diminution des décès comme une « préoccupation » ou une « perturbation »

Indicateurs négatifs de qualité (augmentation = mauvais, baisse = bon) :
- Taux d'abandon (par exemple abandon Penta1 à Penta3), taux de valeurs aberrantes, taux de rupture de stock
- Pour ceux-ci : une augmentation signifie que la situation se détériore

Lors de la rédaction des titres et des interprétations, toujours vérifier : cet indicateur mesure-t-il quelque chose dont nous voulons PLUS (services) ou MOINS (décès, abandons) ? Formuler en conséquence.

VÉRIFICATION - Avant de finaliser chaque diapositive, vérifier :
1. Toutes les valeurs numériques correspondent à ce que montre la visualisation
2. Les périodes et les noms d'indicateurs sont correctement référencés
3. Les tendances décrites (hausses, baisses) correspondent à la direction réelle des données
4. Les chiffres sont cohérents entre les diapositives (même indicateur = mêmes valeurs)
5. Le cadrage de l'interprétation correspond au type d'indicateur — une augmentation des décès n'est JAMAIS décrite comme positive

STRUCTURE :

DIAPOSITIVE 1 - Diapositive de couverture
- Titre : « Suivi des perturbations des services essentiels à partir des données du SNIS à/au/en [NOM DE LA ZONE], [PAYS] »
- Sous-titre : « [SOUS_TITRE_RAPPORT] »
- Ajouter un bloc de texte en bas : « Analyse générée en [MOIS_ANNÉE_ACTUEL] »

DIAPOSITIVE 2 - Diapositive d'introduction
- Titre : « Suivi des perturbations des services essentiels à partir des données du SNIS »
- Bloc de texte : « L'approche FASTR utilise les données de routine du SNIS pour suivre l'évolution de la prestation de services au fil du temps. En comparant les volumes de services observés aux volumes attendus — ajustés pour la saisonnalité et les tendances historiques — nous pouvons identifier les perturbations ou les surplus dans les services de santé clés. Cette analyse offre une perspective rapide à l'échelle du système, mettant en évidence où et quand l'utilisation des services s'écarte des schémas attendus. Les résultats génèrent des données probantes exploitables pour guider des réponses rapides, contribuant à maintenir la continuité des soins essentiels en période d'incertitude financière ou de changement opérationnel. »
- Ajouter un bloc image

DIAPOSITIVE 3 - Diapositive méthodologique
- Titre : « Méthodologie : Évaluation de l'utilisation des services »
- Objectif : Suivre les changements dans l'utilisation des services de santé au fil du temps, en identifiant où les services tombent en dessous ou dépassent les schémas attendus.
- Comment ça fonctionne : Utilise les données de routine du SNIS, nettoyées des valeurs aberrantes et des valeurs manquantes. Construit une ligne de tendance « attendue » pour chaque service, ajustée pour la saisonnalité et les tendances historiques. Compare les volumes de services réels aux niveaux attendus.
- Mesure de l'impact : Les périodes de perturbation signalées sont analysées pour estimer dans quelle mesure les volumes de services ont changé par rapport à ce qui était attendu. Les résultats sont présentés pour [NOM DE LA ZONE].
- Comment interpréter les figures : Les zones ombrées en rouge = perturbations potentielles (en dessous de l'attendu). Les zones ombrées en vert = surplus potentiels (au-dessus de l'attendu). Ce sont des signaux, pas des conclusions — ils nécessitent une investigation plus approfondie.
- Ajouter un bloc de texte en bas : « Plus de détails sur la méthodologie sont disponibles sur GitHub (https://fastr-analytics.github.io/fastr-resource-hub/). »

DIAPOSITIVE 4 - Diapositive de sélection des indicateurs
- Titre : « Méthodologie : Sélection des indicateurs »
- Sous-titre : « Les indicateurs pour l'analyse de l'utilisation des services ont été sélectionnés en tenant compte des indicateurs priorisés au niveau national. »
- Lister tous les indicateurs disponibles regroupés par les catégories confirmées à l'Étape 3

DIAPOSITIVE 5 - Diapositive d'en-tête de section
- Titre : « Utilisation des services à/au/en [NOM DE LA ZONE] »
- Sous-titre : « Évaluation des volumes projetés sur la base des tendances historiques pour identifier les surplus et les perturbations dans les services de santé »

DIAPOSITIVES 6+ - Diapositives d'analyse des perturbations au niveau de la zone (une diapositive par GROUPE d'indicateurs)
Créer une diapositive pour chaque groupe d'indicateurs confirmé à l'Étape 3. Chaque diapositive montre tous les indicateurs du groupe côte à côte.

POUR CHAQUE DIAPOSITIVE DE GROUPE :

Titre : Rédiger un titre analytique (1-2 phrases) résumant la conclusion principale pour ce groupe d'indicateurs. Le titre doit décrire ce que montrent les données, pas simplement nommer les indicateurs.
- Bon exemple : « Malgré des déficits généralisés en 2024, les services de vaccination montrent des signes de reprise à la mi-2025, avec quelques perturbations pour le BCG »
- Bon exemple : « Les accouchements montrent un surplus en 2025, tandis que les CPoN ont récupéré après des perturbations antérieures »
- Mauvais exemple : « BCG - Vaccin Bacillus Calmette-Guérin »
- Mauvais exemple : « Indicateurs de vaccination »

Visualization (right side): Create using from_metric with these parameters:
- type: "from_metric"
- metricId: AREA_METRIC_ID (determined in Step 2, e.g., "m3-03-01" for admin_area_2)
- vizPresetId: AREA_PRESET_ID (determined in Step 2, e.g., "disruption-chart-single-admin-area-2" for admin_area_2)
- chartTitle: « Comparaison de l'utilisation des services rapportée aux tendances attendues, [NOM DE LA ZONE] »
- selectedReplicant: AREA_VALUE (the exact area name from the platform)
- filterOverrides: Filter on indicator_common_id to include ALL indicator codes for this group:
  - col: "indicator_common_id"
  - vals: [all indicator codes in the group, e.g., ["anc1", "anc4"] or ["bcg", "penta1", "penta3"]]
- periodFilterOverride:
  - periodOption: "period_id"
  - min: Start date as 6-digit number (e.g., 202301 for January 2023)
  - max: End date as 6-digit number (e.g., 202509 for September 2025)

Interprétation (côté gauche — cible 50-100 mots, max 180) : Analyser les données affichées dans la visualisation. Utiliser des listes à puces couvrant :
- Pour CHAQUE indicateur : périodes spécifiques de perturbations/surplus, avec ampleurs approximatives (chiffres ou pourcentages du graphique)
- Schémas croisés entre indicateurs : comment les indicateurs sont liés entre eux
- Évaluation globale de ce que le schéma combiné signifie
- IMPORTANT : Ne décrire que ce qui est réellement visible dans le graphique - ne pas inventer de données

Bon exemple (pour un groupe Accouchements et CPoN) :
« - Accouchements : Stables en 2023-24, surplus net début 2025 (~1 200 accouchements de plus que prévu par mois, +9,6 %), déclin modéré mi-2025 mais toujours proche des niveaux attendus en septembre
- Visites CPoN : Plusieurs perturbations sous le niveau attendu en 2023-24, hausse puis baisse en 2025 ramenant les volumes plus près des tendances attendues
- Les deux indicateurs suivent la même trajectoire en 2025, cohérent avec le fait que les CPoN suivent généralement les tendances des accouchements »

DERNIÈRE PAGE :
- "FASTR initiative:" followed by https://data.gffportal.org/key-theme/FASTR

ÉTAPE 4 (OPTIONNELLE) : VENTILATION PAR SOUS-ZONE
Avant de demander à l'utilisateur, vérifier d'abord que des données de sous-zone existent : utiliser get_metric_data avec SUB_AREA_METRIC_ID pour vérifier si des données sont renvoyées pour les zones au sein de [NOM DE LA ZONE]. Si aucune donnée n'existe, ignorer cette étape silencieusement — ne pas la proposer.

Si des données existent, utiliser ask_user_questions pour demander : « Souhaitez-vous ajouter des profils de sous-zones pour les zones au sein de [NOM DE LA ZONE] ? » — poser exactement cette question uniquement, ne pas ajouter d'explications

Si SUB_AREA_METRIC_ID n'a pas été trouvé à l'Étape 2, ignorer cette étape — ne pas la proposer.

Si l'utilisateur accepte et que les indicateurs de sous-zone sont disponibles :
- Insérer la section de sous-zones avant la dernière page (déplacer la dernière page à la fin)

DIAPOSITIVE D'EN-TÊTE DE SECTION :
- Titre : « Profils d'utilisation des services par sous-zone au sein de [NOM DE LA ZONE] »

TABLEAU RÉCAPITULATIF DES SOUS-ZONES (si SUB_AREA_TABLE_METRIC_ID a été trouvé à l'Étape 2) :
- Titre : Rédiger un titre analytique résumant la principale observation sur les sous-zones
- Visualization: Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: SUB_AREA_TABLE_METRIC_ID (e.g., "m3-04-02")
  - vizPresetId: "disruption-differences-table-single-admin-area-2-multiple-admin-area-3"
  - selectedReplicant: AREA_VALUE
  - filterOverrides:
    - col: "indicator_common_id"
    - vals: [all indicator codes from the report]
    - ALSO filter on AREA_LEVEL column to scope to AREA_VALUE
  - periodFilterOverride: Use the same period as the main report
- Interprétation (côté gauche) : 2-3 puces résumant quelles sous-zones montrent des surplus ou des déficits constants.
- Ajouter un bloc de texte en bas : « Pourcentage de différence entre le nombre de services observés et le nombre de services attendus. Une valeur négative indique un niveau observé inférieur au niveau attendu (perturbation), tandis qu'une valeur positive indique un niveau supérieur (surplus). »

DIAPOSITIVES PAR SOUS-ZONE (une par sous-zone) :
Pour CHAQUE sous-zone au sein de [NOM DE LA ZONE], créer une diapositive simple avec :

- Titre : Nom de la sous-zone
- Visualization: Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: SUB_AREA_METRIC_ID (determined in Step 2)
  - vizPresetId: SUB_AREA_PRESET_ID (determined in Step 2)
  - chartTitle: « Comparaison de l'utilisation des services rapportée aux tendances attendues, [Nom de la sous-zone] »
  - selectedReplicant: The sub-area name value
  - filterOverrides:
    - col: "indicator_common_id"
    - vals: [all indicator codes from the report]
    - ALSO filter on AREA_LEVEL column to scope to AREA_VALUE (e.g., col: "admin_area_2", vals: ["North Central"] if showing states within a zone)
  - periodFilterOverride: Use the same period as the main report

Garder ces diapositives épurées — nom de la sous-zone et visualisation uniquement, pas de texte d'interprétation.

Après les diapositives de sous-zones, remettre la dernière page comme diapositive finale.

ÉTAPE 5 (OPTIONNELLE) : ÉVALUATION DE LA QUALITÉ DES DONNÉES
Après la ventilation par sous-zone (ou après le rapport principal si les sous-zones ont été ignorées), utiliser ask_user_questions pour demander : « Souhaitez-vous ajouter une évaluation de la qualité des données pour [NOM DE LA ZONE] ? » — poser exactement cette question uniquement, ne pas ajouter d'explications ni de listes de ce que la section contient

Si l'utilisateur accepte, générer une section EQD ciblée sur la zone spécifique. Insérer avant la dernière page (déplacer la dernière page à la fin).

RÉFÉRENCE MÉTHODOLOGIQUE :
Si vous avez besoin de contexte supplémentaire sur la façon dont FASTR calcule les indicateurs de qualité des données, consultez la documentation méthodologique à l'adresse https://fastr-analytics.github.io/fastr-resource-hub/. Utilisez-la pour rédiger des résumés et des interprétations précis pour chaque diapositive.

INDICATEURS DE QUALITÉ DES DONNÉES :
Utiliser get_available_metrics pour confirmer les indicateurs disponibles et leurs préréglages de visualisation. Les indicateurs de qualité des données utilisés dans cette section sont :
- m1-01-01 : Proportion de valeurs aberrantes [pourcentage] — préréglage : outlier-table — filtres : indicator_common_id, admin_area_2
- m1-02-02 : Proportion de rapports complétés [pourcentage] — préréglage : completeness-table — filtres : indicator_common_id, admin_area_2. TOUJOURS utiliser le préréglage completeness-table pour cet indicateur (NE PAS utiliser completeness-timeseries)
- m1-03-01 : Proportion de zones infranationales respectant les critères de cohérence [pourcentage] — préréglage : consistency-table — filtres : ratio_type, admin_area_2
- m1-04-01 : Proportion d'établissements avec une qualité de données adéquate [pourcentage] — préréglage : dqa-score-table — filtres : admin_area_2
- m1-04-02 : Score moyen de qualité des données entre les établissements [pourcentage] — préréglage : mean-dqa-table — filtres : admin_area_2

Pour chaque diapositive EQD, appliquer un filterOverride sur la colonne AREA_LEVEL (déterminée à l'Étape 2) pour cibler toutes les données sur AREA_VALUE. Par exemple :
  - col: AREA_LEVEL (e.g., "admin_area_2" or "admin_area_3")
  - vals: [AREA_VALUE]
Utiliser periodFilterOverride correspondant à la période du rapport principal.

ÉTAPE 5a : GÉNÉRER LE RÉSUMÉ DE COMPLÉTUDE

DIAPOSITIVE DE COUVERTURE EQD :
- Titre : « Évaluation de la qualité des données : [NOM DE LA ZONE] »

DIAPOSITIVE EQD 1 - Tendances de complétude
Titre : Rédiger un titre analytique sur les tendances de complétude dans [NOM DE LA ZONE] (par exemple « La complétude est >95 % pour la plupart des indicateurs dans [NOM DE LA ZONE], renforçant la confiance dans les résultats sur les perturbations »)

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
- filterOverrides: col: AREA_LEVEL, vals: [AREA_VALUE] (to scope to [AREA NAME])
- periodFilterOverride: Use the same period as the main report

Interprétation (côté gauche) : Utiliser des listes à puces :
- Un résumé des tendances de complétude sur la période d'analyse pour [NOM DE LA ZONE]
- Quels indicateurs ont une complétude plus faible (les nommer)
- Si la complétude s'est améliorée au fil du temps

Puis ajouter un bloc de texte avec :

**Pourquoi la complétude est importante pour l'analyse des perturbations**

Valeurs observées : Elles sont ajustées uniquement pour les valeurs aberrantes, et reflètent donc les volumes réels de services après suppression des pics implausibles.

Valeurs attendues : Elles sont ajustées pour la complétude et les valeurs aberrantes. Cela signifie que le modèle « comble » les lacunes de rapportage, construisant une ligne de tendance attendue comme si tous les établissements avaient rapporté de manière cohérente.

Lorsque la complétude est élevée, les volumes observés et attendus sont plus comparables, et les perturbations reflètent plus probablement de véritables changements dans les services.

Lorsque la complétude est faible, les valeurs attendues peuvent être artificiellement supérieures aux valeurs observées, créant des « perturbations » apparentes qui reflètent en réalité des rapports manquants plutôt que de véritables baisses de la prestation de services.

ÉTAPE 5b : DEMANDER À L'UTILISATEUR
Après avoir généré le résumé de complétude, utiliser ask_user_questions pour demander : « Souhaitez-vous que j'ajoute des diapositives supplémentaires sur la qualité des données couvrant les valeurs aberrantes, la cohérence interne et les tendances des scores EQD pour [NOM DE LA ZONE] ? » — poser exactement cette question uniquement, ne pas ajouter d'explications

Si l'utilisateur accepte, mettre à jour le titre de la diapositive de couverture EQD en « Évaluation de la qualité des données : [NOM DE LA ZONE] », puis générer les diapositives supplémentaires suivantes. Toutes les diapositives sont filtrées sur [NOM DE LA ZONE].

DIAPOSITIVE EQD 2 - Valeurs aberrantes
- Titre : Rédiger un titre analytique sur les valeurs aberrantes dans [NOM DE LA ZONE]
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
  - filterOverrides: col: AREA_LEVEL, vals: [AREA_VALUE] (to scope to [AREA NAME])
  - periodFilterOverride: Use the same period as the main report
- Interprétation (côté gauche) : Utiliser des listes à puces :
  - Décrire la tendance des taux de valeurs aberrantes dans [NOM DE LA ZONE] — sont-ils stables, en amélioration ou en détérioration ?
  - Nommer les indicateurs spécifiques avec les taux de valeurs aberrantes les plus élevés
  - Indiquer si les taux de valeurs aberrantes se sont améliorés ou détériorés au cours de la période d'analyse
  - Expliquer l'implication : des taux élevés de valeurs aberrantes signifient que davantage de valeurs sont ajustées, ce qui peut affecter la fiabilité de l'analyse des tendances
- Ajouter un bloc de texte sous l'interprétation : « Les valeurs aberrantes sont des rapports dont les volumes sont anormalement élevés par rapport au volume habituel rapporté par l'établissement les autres mois. Les valeurs aberrantes sont identifiées en évaluant la variation intra-établissement du rapportage mensuel pour chaque indicateur. Les valeurs aberrantes sont définies comme des observations supérieures à 10 fois l'écart absolu médian (MAD) par rapport à la médiane mensuelle de l'indicateur pour chaque période, OU une valeur dont la contribution proportionnelle en volume pour un établissement, un indicateur et une période est supérieure à 80 %. Les valeurs aberrantes ne sont identifiées que pour les indicateurs dont le volume est supérieur ou égal à la médiane, le volume n'est pas manquant et le volume moyen est supérieur à 100. »

DIAPOSITIVE EQD 3 - Cohérence interne
- Titre : Rédiger un titre analytique sur la cohérence dans [NOM DE LA ZONE]
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
  - filterOverrides: col: AREA_LEVEL, vals: [AREA_VALUE] (to scope to [AREA NAME])
  - periodFilterOverride: Use the same period as the main report
- Interprétation (côté gauche) : Utiliser des listes à puces :
  - Expliquer ce que chaque ratio_type représente (par exemple Penta1/Penta3 compare la première à la troisième dose, CPN1/CPN4 compare la première à la quatrième visite)
  - Identifier quels ratios respectent ou échouent systématiquement les critères dans [NOM DE LA ZONE]
  - Indiquer si la cohérence s'améliore ou se détériore au cours de la période d'analyse
- Ajouter un bloc de texte sous l'interprétation : « La cohérence interne évalue la plausibilité des données rapportées sur la base d'indicateurs connexes. Les métriques de cohérence sont approximatives — selon le calendrier et la saisonnalité, les définitions des indicateurs et la nature de la prestation de services et du rapportage, les valeurs peuvent se situer en dehors des plages plausibles. Les indicateurs similaires sont censés avoir approximativement le même volume sur l'année (dans une marge de 30 %). Les données de cette analyse sont ajustées pour les valeurs aberrantes. »

DIAPOSITIVE EQD 4 - Tendances de la qualité des données (score EQD global)
- Titre : Rédiger un titre analytique sur les tendances de l'EQD dans [NOM DE LA ZONE]
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
  - filterOverrides: col: AREA_LEVEL, vals: [AREA_VALUE] (to scope to [AREA NAME])
  - periodFilterOverride: Use the same period as the main report
- Interprétation (côté gauche) : Utiliser des listes à puces :
  - Décrire la tendance EQD dans [NOM DE LA ZONE] — la qualité des données s'améliore-t-elle au fil du temps ?
  - Identifier si la qualité des données s'est notablement améliorée ou détériorée
  - Expliquer l'implication : des scores EQD faibles peuvent signifier des estimations de perturbation moins fiables
- Ajouter un bloc de texte sous l'interprétation : « Une qualité de données adéquate est définie comme : 1) Pas de données manquantes ni de valeurs aberrantes pour les consultations externes, le Penta1 et la CPN1, lorsque disponibles 2) Rapportage cohérent entre Penta1/Penta3 et CPN1/CPN4. »

DIAPOSITIVE EQD 5 - Tendances de la qualité des données (score EQD moyen)
- Titre : Rédiger un titre analytique sur les tendances du score moyen de l'EQD dans [NOM DE LA ZONE]
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
  - filterOverrides: col: AREA_LEVEL, vals: [AREA_VALUE] (to scope to [AREA NAME])
  - periodFilterOverride: Use the same period as the main report
- Interprétation (côté gauche) : Utiliser des listes à puces :
  - Décrire la tendance du score moyen de l'EQD dans [NOM DE LA ZONE] — s'améliore-t-elle, est-elle stable ou en déclin ?
  - Conclure avec une évaluation globale de la trajectoire de la qualité des données et ce que cela signifie pour l'analyse des perturbations
- Ajouter un bloc de texte sous l'interprétation : « Les éléments inclus dans le score EQD sont : Pas de données manquantes pour 1) les consultations externes, 2) le Penta1 et 3) la CPN1, lorsque disponibles ; Pas de valeurs aberrantes pour 4) les consultations externes, 5) le Penta1 et 6) la CPN1, lorsque disponibles ; Rapportage cohérent entre 7) Penta1/Penta3, 8) CPN1/CPN4, 9) BCG/Accouchements, lorsque disponibles. »

Après toutes les diapositives EQD, remettre la dernière page comme diapositive finale.
```

## Prompt 5a : Vérifier l'exactitude des données

```prompt
Réviser le jeu de diapositives actuel — vérifier que chaque bloc de texte est exact par rapport aux données sous-jacentes. Nous réviserons une diapositive à la fois.

CRITIQUE : Pendant cette révision, ne pas deviner ni halluciner. Chaque affirmation sur ce qui est correct ou incorrect doit être vérifiée en interrogeant réellement les données (get_metric_data), en vérifiant la plateforme (get_available_metrics), ou en consultant la documentation méthodologique. Si vous n'êtes pas sûr de quelque chose, le dire — ne pas supposer.

Toujours vérifier si l'utilisateur est en mode editing_slide_deck. Sinon, lui demander d'ouvrir le jeu de diapositives à réviser.

Toujours désigner les diapositives par leur numéro (pas par leur ID).

POUR CHAQUE DIAPOSITIVE (une à la fois) :
Pour chaque diapositive qui contient une visualisation (bloc image avec from_metric) :

1. Lire tous les blocs de texte de la diapositive — titre, texte d'interprétation, tout bloc de texte en bas
2. Examiner les paramètres from_metric de la visualisation (metricId, vizPresetId, filterOverrides, periodFilterOverride) et utiliser get_metric_data pour extraire les données sous-jacentes
3. Appliquer ces vérifications :

EXACTITUDE DES DONNÉES
- Chaque chiffre dans les blocs de texte correspond-il aux données sous-jacentes ?
- Des statistiques sont-elles mentionnées sans pouvoir être vérifiées ? Signaler avec [À VÉRIFIER]
- Attention aux fabrications masquées — « environ », « approximativement » ou « estimé à » peuvent précéder des chiffres inventés. Vérifier chaque nombre, même ceux avec des nuances
- Des chiffres arrondis sont-ils utilisés là où des chiffres précis devraient apparaître ? (signal d'alerte pour des données fabriquées)
- Les périodes temporelles sont-elles correctement référencées ?
- Le texte ne référence-t-il que ce qui est visible dans les données ? Pas de déclarations externes

NOMS ET INTERPRÉTATION DES INDICATEURS
- Les noms des indicateurs dans le texte correspondent-ils aux libellés exacts de la plateforme ? Utiliser get_available_metrics pour vérifier — ne pas accepter des noms paraphrasés ou raccourcis (par exemple si la plateforme dit « Cas de pneumonie identifiés », le texte ne doit pas dire « Cas de pneumonie »)
- Indicateurs de prestation de services (CPN, accouchements, soins postnataux, vaccinations, consultations externes, planification familiale) : augmentation = positif, diminution = préoccupant
- Indicateurs de mortalité (décès maternels, décès néonataux, mortinaissances) : augmentation = MAUVAIS, diminution = BON
- Indicateurs négatifs de qualité (taux d'abandon, taux de valeurs aberrantes) : augmentation = détérioration

ACRONYMES ET MÉTHODOLOGIE
- Des acronymes sont-ils développés dans le texte ? Si oui, vérifier que l'expansion est correcte en utilisant get_methodology_docs_list et get_methodology_doc_content, ou consulter https://fastr-analytics.github.io/fastr-resource-hub/. JAMAIS supposer — une expansion d'acronyme incorrecte est une erreur critique
- Les descriptions méthodologiques sont-elles exactes ? Vérifier dans la documentation officielle — ne pas laisser passer des affirmations méthodologiques inventées

TABLEAUX ET DIAPOSITIVES EQD
- Pour les diapositives EQD : extraire les données avec get_metric_data et vérifier que les blocs de texte correspondent aux valeurs réelles
- Les blocs de texte méthodologiques sont-ils préservés fidèlement — ni paraphrasés ni édulcorés ?

4. Présenter les résultats pour cette diapositive — lister les problèmes trouvés et suggérer des corrections
5. TOUJOURS utiliser l'outil ask_user_questions (pas une question en texte libre) pour laisser l'utilisateur continuer. Ne jamais demander « Prêt à continuer ? » en texte — toujours appeler ask_user_questions avec des options sélectionnables :
   - Si des problèmes trouvés : « Diapositive [N] : [nombre] problèmes trouvés. Comment souhaitez-vous procéder ? » → options : « Corriger et passer à la suivante », « Passer à la suivante », « Arrêter la révision ici »
   - Si aucun problème : « Diapositive [N] : Aucun problème trouvé. » → options : « Diapositive suivante », « Arrêter la révision ici »

Après la dernière diapositive, confirmer : « Toutes les diapositives ont été révisées. »
```

## Prompt 5b : Vérifier le langage et la cohérence

```prompt
Réviser le jeu de diapositives actuel — vérifier le langage, la terminologie, la cohérence et le nombre de mots. Nous réviserons une diapositive à la fois.

Toujours vérifier si l'utilisateur est en mode editing_slide_deck. Sinon, lui demander d'ouvrir le jeu de diapositives à réviser.

Toujours désigner les diapositives par leur numéro (pas par leur ID).

POUR CHAQUE DIAPOSITIVE (une à la fois) :
Lire tous les blocs de texte de la diapositive et vérifier :

LANGAGE ET FORMULATION
- Pas de liens de causalité — uniquement un langage exploratoire et descriptif (par exemple « suggère » et non « causé par »)
- Pas de généralisation excessive — les résultats sont limités à la zone et la période spécifiques
- Nuances appropriées — les conclusions ne sont pas plus fortes que ce que les données permettent
- Pas de codes d'indicateurs dans les blocs de texte — uniquement des libellés lisibles (par exemple « Première visite CPN » et non « anc1 »)
- Les noms des indicateurs correspondent-ils aux libellés exacts de la plateforme ? Utiliser get_available_metrics pour vérifier — ne pas accepter des noms paraphrasés ou raccourcis

TERMINOLOGIE TECHNIQUE
- Les termes de santé sont-ils utilisés correctement ? (par exemple « accouchement assisté par du personnel qualifié » et non « accouchement aidé »)
- Les acronymes sont-ils développés correctement ? Vérifier dans la documentation méthodologique (get_methodology_docs_list / get_methodology_doc_content) ou sur https://fastr-analytics.github.io/fastr-resource-hub/. Une expansion d'acronyme incorrecte est une erreur critique — JAMAIS supposer
- Le nom du pays est-il correctement orthographié ?
- Les noms des zones administratives correspondent-ils exactement à ce qui apparaît dans la plateforme ?

COHÉRENCE AVEC LES DIAPOSITIVES PRÉCÉDENTES
- Même indicateur sur plusieurs diapositives : les valeurs sont-elles cohérentes ?
- Les noms des indicateurs sont-ils orthographiés comme dans les diapositives précédentes ?
- Les périodes temporelles sont-elles référencées de manière cohérente ?
- Les titres des diapositives suivent-ils le même style que les précédents ?

NOMBRE DE MOTS
- Chaque bloc de texte est-il dans la plage cible (50-100 mots, max 180) ?

Présenter les résultats pour cette diapositive — lister les problèmes et suggérer des corrections.
TOUJOURS utiliser l'outil ask_user_questions (pas une question en texte libre) pour laisser l'utilisateur continuer. Ne jamais demander « Prêt à continuer ? » en texte — toujours appeler ask_user_questions avec des options sélectionnables :
- Si des problèmes trouvés : « Diapositive [N] : [nombre] problèmes trouvés. Comment souhaitez-vous procéder ? » → options : « Corriger et passer à la suivante », « Passer à la suivante », « Arrêter la révision ici »
- Si aucun problème : « Diapositive [N] : Aucun problème trouvé. » → options : « Diapositive suivante », « Arrêter la révision ici »

Après la dernière diapositive, confirmer : « Toutes les diapositives ont été révisées. »
```

## Prompt 6 : Rapport trimestriel universel

```prompt
Instructions universelles pour la génération du rapport trimestriel FASTR

CONTEXTE : Ces instructions s'appliquent à tous les pays et toutes les langues. Le rapport doit être généré dans la langue appropriée selon le contexte du pays (français pour les pays francophones, anglais pour les pays anglophones).

ÉTAPE 1 : VÉRIFICATIONS INITIALES ET INFORMATIONS DE BASE

1.1 Vérifier le mode d'édition
- Confirmer que l'utilisateur est en mode editing_slide_deck
- Sinon, demander à l'utilisateur de créer un nouveau slide deck ou d'en ouvrir un existant

1.2 Collecter les informations de base
Utiliser ask_user_questions pour poser une question à la fois, dans cet ordre :

Question 1 : Période d'analyse
- Demander : « Quelle période d'analyse dois-je utiliser ? (mois/année de début au mois/année de fin, par exemple : janvier 2023 à septembre 2025) »
- Convertir la réponse au format period_id :
  - Date de début → valeur minimale : [YEAR][MONTH] sous forme de nombre à 6 chiffres (par exemple : janvier 2025 = 202501)
  - Date de fin → valeur maximale : [YEAR][MONTH] sous forme de nombre à 6 chiffres (par exemple : décembre 2025 = 202512)
- Conserver ces valeurs pour une utilisation ultérieure dans tous les filtres de période

Question 2 : Sous-titre de couverture
- Proposer des options basées sur la période d'analyse, par exemple :
  - Le trimestre concerné (par exemple : « T4 2025 »)
  - Les mois inclus (par exemple : « Octobre–décembre 2025 »)
  - Permettre à l'utilisateur de saisir son propre texte

1.3 Générer la diapositive de couverture

Titre :
- Français : « Analyse de l'utilisation des services au/à/aux [PAYS] »
- Anglais : « [COUNTRY] - Service Utilization Analysis »
- Adapter l'article selon le pays (au Sénégal, à Madagascar, aux Philippines, etc.)

Sous-titre :
- Utiliser la réponse de l'utilisateur à la Question 2

Date :
- Demander à l'utilisateur : « Quand cette analyse a-t-elle été finalisée ? » — suggérer le mois et l'année en cours (par exemple « avril 2026 ») mais laisser l'utilisateur confirmer ou modifier
- Format français : « Analyse générée en [MOIS_ANNÉE] »
- Format anglais : « Analysis generated in [MONTH_YEAR] »

ÉTAPE 2 : DÉCOUVERTE ET ORGANISATION DES INDICATEURS

2.1 Interroger la plateforme
- Appeler get_available_metrics pour récupérer tous les indicateurs disponibles
- Pour chaque indicateur, appeler get_metric_data avec la période d'analyse pour vérifier qu'il contient des données
- Ne conserver que les indicateurs ayant des données réelles pour la période d'analyse

2.2 Identifier les indicateurs disponibles
- Lire les valeurs indicator_common_id et leurs libellés depuis la plateforme
- Ne JAMAIS supposer une liste fixe d'indicateurs — chaque pays a ses propres codes et libellés
- Créer une liste complète : identifiant + libellé pour chaque indicateur ayant des données

2.3 Proposer des regroupements
Proposer des regroupements basés sur les libellés des indicateurs. Utiliser les catégories ci-dessous comme guide de départ, mais adapter en fonction de ce qui existe réellement :

Groupes de services courants :
- Soins prénatals : indicateurs liés aux visites CPN (par exemple : anc1, anc4, anc_trimester1, syphilis_tested_anc)
- Accouchements et soins postnatals : accouchements en structure, accouchement assisté, CPoN, césariennes (par exemple : delivery, sba, pnc1_mother, pnc1_newborn, csection)
- Vaccination : vaccins (par exemple : bcg, penta1, penta3, measles1, measles2, opv1, rr1, fully_immunized)
- Planification familiale : conseil PF, nouveaux utilisateurs, utilisateurs continus (par exemple : fp_new, fp_new_and_cont, fp_counseled, new_fp)
- Planification familiale des adolescents : si des indicateurs PF spécifiques aux adolescents existent, les regrouper séparément (par exemple : fp_adolescent_counseled, fp_adolescent_new)
- Paludisme : tests, positivité, traitement (par exemple : malaria_tested, malaria_confirmed, malaria_treated, mal_positive)
- Services généraux / Consultations externes : visites ambulatoires (par exemple : opd, opd_under5, opd_over5)
- VIH/TB : dépistage VIH, traitement ARV, cas de TB (par exemple : hiv_tested, hiv_treated, tb_confirmed, tb_treated)
- Nutrition : supplémentation en vitamine A, fer/acide folique, etc. (par exemple : vitamin_a, ifa)
- Autres groupes selon ce qui existe (maladies non transmissibles, santé de l'enfant, etc.)

2.4 Valider avec l'utilisateur

Première validation : Regroupements d'indicateurs
Utiliser ask_user_questions pour présenter les regroupements proposés :
- Lister chaque groupe avec ses indicateurs (identifiant + libellé)
- Demander : « Voici les regroupements d'indicateurs proposés. Souhaitez-vous modifier quelque chose — déplacer des indicateurs entre groupes, créer de nouveaux groupes ou en exclure certains ? »

Deuxième validation : Indicateurs de mortalité
Après confirmation des regroupements principaux :
- Vérifier si des indicateurs de mortalité existent (par exemple : maternal_deaths, neonatal_deaths, stillbirths, child_deaths)
- Toujours utiliser ask_user_questions pour demander :
  - « La plateforme dispose de ces indicateurs de mortalité : [liste]. Les données de mortalité impliquent des comptages d'événements faibles et une interprétation différente (les augmentations = négatif). Souhaitez-vous les inclure dans le rapport ou les exclure ? »

Gestion des groupes avec de nombreux indicateurs :
- Si un groupe confirmé contient plus de 3 indicateurs, utiliser ask_user_questions pour demander comment le subdiviser
- Suggérer des sous-groupes logiques
- Chaque sous-groupe aura sa propre diapositive

2.5 Finaliser la structure
- Chaque groupe/sous-groupe confirmé deviendra une section avec plusieurs diapositives dans l'analyse nationale
- Utiliser les valeurs exactes de indicator_common_id de la plateforme pour tous les paramètres techniques (filterOverrides, selectedReplicant)

EXIGENCES DE PRÉCISION (CRITIQUE)

Règle d'or : Vérifier avant d'affirmer
- ✅ Baser toute l'analyse uniquement sur les données visibles dans la plateforme
- ✅ Ne JAMAIS inventer de statistiques, de pourcentages ou de chiffres précis
- ✅ Si les données ne sont pas visibles, le signaler explicitement
- ✅ Si une affirmation ne peut être vérifiée, la marquer avec [VÉRIFIER]
- ✅ Ne jamais deviner les dates, les périodes ou les magnitudes

Vérification de la terminologie et de la méthodologie
AVANT de rédiger toute expansion d'acronyme, définition de terme technique ou explication méthodologique :
- Appeler get_methodology_docs_list pour consulter la documentation disponible
- Appeler get_methodology_doc_content pour vérifier le contenu officiel
- Si cela ne peut être vérifié → ne pas l'inclure
- JAMAIS deviner ce que signifient les acronymes ni inventer des descriptions de méthodologie

NORMES DU RAPPORT

Style et langage
- ✅ Maintenir un langage prudent et analytique — pas d'affirmations causales
- ✅ Traiter les signaux de perturbation comme descriptifs et exploratoires
- ✅ Utiliser une terminologie cohérente tout au long du rapport (ne pas alterner entre synonymes)

Longueur du texte
- Cible : 50–100 mots par diapositive (ajuster à la baisse si plusieurs graphiques)
- Maximum absolu : 180 mots par diapositive (sauf si l'utilisateur fournit le texte ; dans ce cas, ne pas le raccourcir)
- Utiliser des listes à puces, pas de longs paragraphes
- Diapositives avec graphiques/visualisations = moins de texte

Mise en page des diapositives de contenu
- Gauche : Interprétation textuelle
- Droite : Visualisation/graphique

Références aux indicateurs dans le texte
RÈGLE CRITIQUE : Dans tout le texte des diapositives (titres, interprétations, en-têtes), utiliser UNIQUEMENT le libellé lisible des indicateurs.
✅ CORRECT :
- « Première consultation prénatale »
- « Accouchement assisté par du personnel qualifié »
- « Vaccin Penta 3 »
❌ INCORRECT :
- « anc1 »
- « anc1 (Première consultation prénatale) »
- « Première consultation prénatale (anc1) »
Les codes indicator_common_id sont utilisés UNIQUEMENT dans les paramètres techniques (filterOverrides, selectedReplicant, etc.) — jamais dans le texte visible par l'utilisateur.

Références aux diapositives
- Toujours désigner les diapositives par leur numéro (par exemple : « diapositive 3 », « diapositive 5 »)
- Jamais par leur identifiant technique (par exemple : « a3k », « x7m »)

RÈGLES CRITIQUES D'INTERPRÉTATION DES INDICATEURS

⚠️ ATTENTION : Toutes les augmentations ne sont pas positives. Toutes les baisses ne sont pas négatives.

Appliquer l'interprétation correcte selon le type d'indicateur :

Type 1 : Indicateurs de prestation de services (↑ = positif, ↓ = préoccupant)
Exemples :
- Visites CPN, accouchements, visites CPoN, vaccinations, consultations externes, planification familiale, accouchement assisté
Interprétation :
- « Excédent » (au-dessus de l'attendu) = signal positif
- « Perturbation » (en dessous de l'attendu) = préoccupation

Type 2 : Indicateurs de mortalité et d'événements indésirables (↑ = MAUVAIS, ↓ = positif)
Exemples :
- Décès maternels, décès néonatals, mortinaissances, décès d'enfants, tout indicateur mesurant des décès ou événements indésirables
Interprétation :
- Une AUGMENTATION est un constat NÉGATIF — plus de décès est TOUJOURS mauvais
- Une DIMINUTION est un constat POSITIF — moins de décès est TOUJOURS bon
- JAMAIS décrire une augmentation des décès comme une « amélioration » ou « tendance positive »
- JAMAIS décrire une diminution des décès comme une « préoccupation » ou « perturbation »

Type 3 : Indicateurs négatifs de qualité (↑ = mauvais, ↓ = bon)
Exemples :
- Taux d'abandon (par exemple : abandon Penta1 à Penta3), taux de valeurs aberrantes, taux de rupture de stock, faible poids à la naissance, cas de diarrhée
Interprétation :
- Une augmentation signifie que la situation se détériore
- Une diminution signifie que la situation s'améliore

Processus de vérification avant rédaction
Avant de rédiger tout titre ou interprétation, se demander :
- Cet indicateur mesure-t-il quelque chose dont on veut PLUS (services) ?
- Ou quelque chose dont on veut MOINS (décès, abandons, maladies) ?
- Formuler le langage en conséquence

VÉRIFICATION AVANT FINALISATION

Avant de finaliser chaque diapositive, contre-vérifier :
- ✅ Toutes les valeurs numériques correspondent à ce que la visualisation montre
- ✅ Les périodes et noms d'indicateurs sont correctement référencés
- ✅ Les tendances décrites (augmentations, diminutions) correspondent à la direction réelle des données
- ✅ Les chiffres sont cohérents d'une diapositive à l'autre (même indicateur = mêmes valeurs)
- ✅ La formulation de l'interprétation correspond au type d'indicateur — une augmentation des décès n'est JAMAIS décrite comme positive

DÉROULEMENT GÉNÉRAL
- Vérifier le mode → editing_slide_deck
- Collecter les informations de base → Questions 1–2 (une à la fois)
- Générer la couverture → S'ARRÊTER et attendre la confirmation
- Découvrir les indicateurs → get_available_metrics + get_metric_data
- Proposer les regroupements → Présenter à l'utilisateur
- Valider avec l'utilisateur → Regroupements, puis mortalité
- Passer à la diapositive méthodologie

Cette base universelle s'applique à tous les rapports, tous les pays, toutes les langues. Les instructions de structure spécifiques au rapport suivront.

DIAPOSITIVE SUIVANTE — Méthodologie

Insérer le texte tel quel sans le réduire. Dans un seul bloc texte avec des puces :

Évaluation de la qualité des données
Identifie les principaux problèmes de qualité des données en évaluant la complétude des indicateurs, en détectant les valeurs aberrantes extrêmes et en vérifiant la cohérence entre les indicateurs liés — à partir des données mensuelles du SNIS (DHIS2) au niveau des établissements.

Applique des ajustements ciblés aux points de données signalés, en remplaçant les valeurs aberrantes et en imputant les données manquantes à l'aide d'une moyenne mobile centrée sur 12 mois ; les moyennes au niveau des établissements sont utilisées par défaut lorsque les données historiques sont insuffisantes.

Permet une analyse de sensibilité en produisant des résultats sous quatre scénarios (aucun ajustement, valeurs aberrantes uniquement, complétude uniquement, et combiné). Dans cette analyse, les ajustements couvrent à la fois les valeurs aberrantes et la complétude.

Évaluation de l'utilisation des services
Analyse des tendances d'utilisation des services, qui identifie le pourcentage de variation de l'utilisation des services pour chaque trimestre par rapport au trimestre précédent.

Analyse des perturbations et des excédents dans l'utilisation des services, qui détecte les changements significatifs (positifs ou négatifs) dans l'utilisation des services au-delà de ce qui serait attendu compte tenu de la saisonnalité et des tendances historiques.

Estimation de la couverture des services
L'analyse d'estimation de la couverture utilise les données de routine pour estimer les tendances de couverture des services aux niveaux national et infranational. Cela se fait en intégrant les volumes de services de santé ajustés, les projections démographiques et les données d'enquêtes (MICS/DHS).

Les estimations de couverture sont calculées pour les indicateurs de santé clés en utilisant plusieurs sources de dénominateurs, et le dénominateur optimal est retenu en minimisant l'erreur par rapport aux données d'enquête les plus récentes.

Plus de détails sur la méthodologie et les approches d'ajustement de la qualité des données sont disponibles en annexe. Le code R complet et la documentation source sont également disponibles publiquement sur GitHub (https://github.com/FASTR-Analytics)

DIAPOSITIVE 4 — Diapositive de sélection des indicateurs
- Titre : « Méthodologie : Sélection des indicateurs »
- Sous-titre : « Les indicateurs pour l'analyse de l'utilisation des services ont été sélectionnés en tenant compte des indicateurs prioritaires au niveau national. »
- Lister tous les indicateurs disponibles regroupés par les catégories confirmées à l'Étape 2. UTILISER CE FORMAT :
**GROUPE 1** Indicateur1, Indicateur2. Exemple :
Accouchements et soins postnatals : Accouchement assisté, CPoN1 mère, CPoN1 nouveau-né

INSTRUCTIONS POUR GÉNÉRER la Section 1 : Évaluation de la qualité des données

Exigences de précision
- Baser toute l'analyse uniquement sur les données visibles dans la plateforme
- Ne pas inventer de statistiques ou de chiffres précis — si les données ne sont pas visibles, le signaler
- Si une affirmation ne peut être vérifiée à partir des données, la marquer avec [VÉRIFIER]
- JAMAIS deviner ce que signifient les acronymes ni inventer des descriptions de méthodologie. Avant de rédiger toute expansion d'acronyme, définition de terme technique ou explication méthodologique, utiliser get_methodology_docs_list et get_methodology_doc_content pour vérifier dans la documentation officielle. Si vous ne pouvez pas le vérifier, ne pas l'inclure

Normes du rapport
- Maintenir un langage prudent et analytique
- Mise en page : après avoir ajouté les blocs texte et visualisation à une diapositive, utiliser modify_slide_layout pour les disposer côte à côte en répartition 6-6 — bloc texte (span 6) à gauche, bloc visualisation (span 6) à droite. Ne pas laisser les blocs empilés verticalement
- Utiliser une terminologie cohérente tout au long du rapport
- Toujours désigner les diapositives par leur numéro (pas par leur ID)

Référence méthodologique
Si vous avez besoin de contexte supplémentaire sur la façon dont FASTR calcule les métriques de qualité des données, récupérer la documentation méthodologique depuis https://fastr-analytics.github.io/fastr-resource-hub/. L'utiliser pour rédiger des résumés et interprétations précis pour chaque diapositive.

Métriques de qualité des données
Utiliser get_available_metrics pour confirmer les métriques disponibles et leurs visualisations prédéfinies. Les métriques de qualité des données utilisées dans cette annexe sont :
- m1-01-01 : Proportion de valeurs aberrantes [pourcentage] — preset : outlier-table — filtres : indicator_common_id, admin_area_2
- m1-02-02 : Proportion d'enregistrements complets [pourcentage] — preset : completeness-table — filtres : indicator_common_id, admin_area_2. TOUJOURS utiliser le preset completeness-table pour cette métrique (ne PAS utiliser completeness-timeseries)
- m1-03-01 : Proportion de zones infranationales respectant les critères de cohérence [pourcentage] — preset : consistency-table — filtres : ratio_type, admin_area_2
- m1-04-01 : Proportion d'établissements avec une qualité des données adéquate [pourcentage] — preset : dqa-score-table — filtres : admin_area_2
- m1-04-02 : Score moyen de qualité des données des établissements [pourcentage] — preset : mean-dqa-table — filtres : admin_area_2

Pour chaque diapositive, créer la visualisation en utilisant from_metric avec le metricId et vizPresetId spécifiés. Utiliser periodFilterOverride correspondant à la période du rapport principal.

Vérification : Avant de finaliser chaque diapositive, contre-vérifier que tous les pourcentages et scores correspondent à ce que la visualisation montre.

Structure : Diapositives d'évaluation de la qualité des données

DIAPOSITIVE SUIVANTE — Complétude
Titre : Rédiger un titre analytique sur les tendances de complétude (par exemple : « Les taux de complétude restent faibles au niveau national mais [X] montre des taux bas ces derniers mois »)

Visualisation (côté droit) : Créer en utilisant from_metric avec :
- metricId : m1-02-02
- vizPresetId : completeness-table
- Filtres : indicator_common_id, admin_area_2
- Afficher sous forme de tableau : period_id (lignes) x indicator_common_id (colonnes) montrant le % de complétude
- Color coding : Green = 90% ou plus | Yellow = 80% à 89% | Red = en dessous de 80%
- periodFilterOverride : Utiliser la même période que le rapport principal

Interprétation (côté gauche) : Utiliser des puces :
- Décrire la tendance nationale globale de complétude — stable, en amélioration ou en dégradation ?
- Nommer les indicateurs spécifiques avec la complétude la plus faible
- Indiquer si les taux de complétude se sont améliorés ou dégradés sur la période d'analyse
- Expliquer l'implication : des taux de complétude plus faibles signifient que davantage de valeurs sont ajustées, ce qui peut affecter la fiabilité de l'analyse des tendances

Ajouter un bloc texte sous l'interprétation : « Lorsque la complétude est élevée, les volumes observés et attendus sont plus comparables, et les perturbations sont plus susceptibles de refléter de véritables changements dans les services. Lorsque la complétude est faible, les valeurs attendues peuvent être artificiellement plus élevées que les valeurs observées, créant des « perturbations » apparentes qui reflètent en réalité des rapports manquants plutôt que de véritables baisses dans la prestation de services. »

Note pour TIM : les légendes DQA dans les instances francophones sont en anglais.

DIAPOSITIVE SUIVANTE — Valeurs aberrantes
Titre : Rédiger un titre analytique sur les tendances des valeurs aberrantes (par exemple : « Les taux de valeurs aberrantes restent faibles au niveau national mais [X] montre des taux élevés ces derniers mois »)

Visualisation (côté droit) : Créer en utilisant from_metric avec :
- metricId : m1-01-01
- vizPresetId : outlier-table
- Filtres : indicator_common_id, admin_area_2
- Afficher sous forme de tableau : period_id (lignes) × indicator_common_id (colonnes) montrant le % de valeurs aberrantes
- Color coding : Green = en dessous de 2% | Yellow = 2% à 5% | Red = au-dessus de 5%
- periodFilterOverride : Utiliser la même période que le rapport principal

Interprétation (côté gauche) : Utiliser des puces :
- Décrire la tendance nationale globale des taux de valeurs aberrantes — stable, en amélioration ou en dégradation ?
- Nommer les indicateurs spécifiques avec les taux de valeurs aberrantes les plus élevés
- Indiquer si les taux de valeurs aberrantes se sont améliorés ou dégradés sur la période d'analyse
- Expliquer l'implication : des taux élevés de valeurs aberrantes signifient que davantage de valeurs sont ajustées, ce qui peut affecter la fiabilité de l'analyse des tendances

Ajouter un bloc texte sous l'interprétation : « Les valeurs aberrantes sont des rapports anormalement élevés par rapport au volume habituel déclaré par l'établissement au cours des autres mois. Les valeurs aberrantes sont identifiées en évaluant la variation intra-établissement du rapportage mensuel pour chaque indicateur. Les valeurs aberrantes sont définies comme des observations supérieures à 10 fois l'écart absolu médian (MAD) par rapport à la valeur médiane mensuelle de l'indicateur pour chaque période, OU une valeur dont la contribution proportionnelle en volume pour un établissement, un indicateur et une période est supérieure à 80%. Les valeurs aberrantes ne sont identifiées que pour les indicateurs dont le volume est supérieur ou égal à la médiane, dont le volume n'est pas manquant, et dont le volume moyen est supérieur à 100. »

DIAPOSITIVE SUIVANTE — Cohérence interne
Titre : Rédiger un titre analytique sur la cohérence (par exemple : « La plupart des paires d'indicateurs montrent un rapportage cohérent, mais [RATIO] sort des plages plausibles dans plusieurs régions »)

Visualisation (côté droit) : Créer en utilisant from_metric avec :
- metricId : m1-03-01
- vizPresetId : consistency-table
- Filtres : ratio_type, admin_area_2
- Afficher sous forme de tableau : period_id (lignes) × ratio_type (colonnes) montrant le % de zones respectant les critères de cohérence
- Color coding : Green = 90% ou plus | Yellow = 70% à 89% | Red = en dessous de 70%

Interprétation (côté gauche) : Utiliser des puces :
- Expliquer ce que chaque ratio_type représente (par exemple : Penta1/Penta3 compare la première à la troisième dose, ANC1/ANC4 compare la première à la quatrième visite)
- Identifier quels ratios respectent ou échouent systématiquement aux critères
- Indiquer si la cohérence s'améliore ou se détériore sur la période d'analyse
- Mettre en évidence les régions spécifiques où la cohérence est particulièrement faible

Ajouter un bloc texte sous l'interprétation : « La cohérence interne évalue la plausibilité des données rapportées en se basant sur des indicateurs liés. Les métriques de cohérence sont approximatives — selon le calendrier et la saisonnalité, les définitions des indicateurs, et la nature de la prestation de services et du rapportage, les valeurs peuvent être attendues en dehors des plages plausibles. Les indicateurs similaires sont censés avoir approximativement le même volume sur l'année (dans une marge de 30%). Les données de cette analyse sont ajustées pour les valeurs aberrantes. »

DIAPOSITIVE SUIVANTE — Tendances de la qualité des données (Score DQA global)
Titre : Rédiger un titre analytique sur les tendances DQA (par exemple : « La proportion d'établissements avec une qualité des données adéquate est passée de X% à Y% depuis [ANNÉE] »)

Visualisation (côté droit) : metricId : m1-04-01 | vizPresetId : dqa-score-table | Filtres : admin_area_2
Afficher sous forme de tableau : admin_area_2 (lignes) × année (colonnes) montrant le % d'établissements avec une qualité des données adéquate
Color coding : Green = 70% ou plus | Yellow = 50% à 69% | Red = en dessous de 50%

Interprétation (côté gauche) : Décrire la tendance nationale de qualité des données, nommer les régions les plus/moins performantes, identifier les changements notables, expliquer les implications.

Ajouter un bloc texte : « La qualité des données adéquate est définie comme : 1) Pas de données manquantes ni de valeurs aberrantes pour les consultations externes, Penta1 et CPN1, lorsqu'ils sont disponibles 2) Rapportage cohérent entre Penta1/Penta3 et CPN1/CPN4. »

DIAPOSITIVE SUIVANTE — Tendances de la qualité des données (Score DQA moyen)
Titre : Rédiger un titre analytique sur les tendances du DQA moyen (par exemple : « Les scores moyens de qualité des données sont les plus élevés dans [X] et [Y], tandis que [Z] reste en retard »)

Visualisation (côté droit) : metricId : m1-04-02 | vizPresetId : mean-dqa-table | Filtres : admin_area_2
Afficher sous forme de tableau : admin_area_2 (lignes) × année (colonnes) montrant le score DQA moyen en %
Color coding : Green = 70% ou plus | Yellow = 50% à 69% | Red = en dessous de 50%

Interprétation (côté gauche) : Décrire la tendance nationale du DQA moyen, contraster les régions les plus/moins performantes, noter les changements significatifs, conclure avec une évaluation globale.

Ajouter un bloc texte : « Les éléments inclus dans le score DQA comprennent : Pas de données manquantes pour les consultations externes, Penta1 et CPN1, lorsqu'ils sont disponibles ; Pas de valeurs aberrantes pour les consultations externes, Penta1 et CPN1, lorsqu'ils sont disponibles ; Rapportage cohérent entre Penta1/Penta3, CPN1/CPN4, BCG/Accouchements, lorsqu'ils sont disponibles. »

DIAPOSITIVE SUIVANTE — En-tête de la Section 2
Titre : « Section 2 : Utilisation des services, au niveau national »
Sous-titre (anglais) : Service utilization over time and assessment of projected volumes based on historical trends to identify surpluses and disruptions in health services at national level.
Sous-titre (français) : Utilisation des services au fil du temps et évaluation des volumes projetés en fonction des tendances historiques afin d'identifier les excédents et les perturbations dans les services de santé.

MODÈLE UNIVERSEL : Diapositives d'utilisation nationale des services par groupe d'indicateurs

Pour chaque groupe d'indicateurs, créer trois diapositives consécutives :
- Type de diapositive A : Tendances mensuelles d'utilisation des services
- Type de diapositive B : Volume trimestriel des services avec variation en % d'un trimestre à l'autre
- Type de diapositive C : Analyse des perturbations

Les deux diapositives utilisent une mise en page cohérente : interprétation textuelle (span=4) à gauche, visualisation (span=8) à droite.

TYPE DE DIAPOSITIVE A : Tendances mensuelles d'utilisation des services

Format de l'en-tête : « Tendances de [description du groupe] »
Règles :
- Utiliser une phrase descriptive pour le domaine de service, PAS une liste de codes d'indicateurs
- ✅ Bon : « Tendances des soins prénatals »
- ✅ Bon : « Tendances des services d'accouchement »
- ❌ Mauvais : « Tendances de BCG, Penta1, Penta3 »

Bloc gauche — Interprétation textuelle (span=4) :
Structure : [Titre évolution de l'utilisation des services] : [INDICATEUR 1] : [décrire les fluctuations mensuelles] | [INDICATEUR 2] : [décrire la tendance] | [Observation inter-indicateurs] : [tendances, écarts] | [Titre implications] : [une phrase d'analyse actionnable]
Directives : Utiliser des titres en gras, une puce par indicateur, inclure les mois/périodes spécifiques et les chiffres approximatifs. Nombre de mots : 60–100, max 130. Ne décrire que ce qui est visible dans les données réelles.

Bloc droit — Visualisation (span=8) : metricId : m3-01-01 | vizPresetId : volume-monthly | valuesFilter : count_final_both | startDate/endDate : 12 derniers trimestres complets (36 mois)

TYPE DE DIAPOSITIVE B : Variation trimestrielle du volume de services

En-tête de la diapositive : Une phrase analytique résumant le constat principal. Au passé, 1–2 phrases maximum. Se concentre sur la tendance globale du groupe.
✅ Bon : « Les services prénatals ont montré une croissance progressive, avec les quatrièmes visites augmentant plus notablement que les premières en 2025 »
❌ Mauvais : « Variation trimestrielle des services prénatals »

Bloc gauche — Interprétation textuelle (span=4) :
Structure : [Un paragraphe autonome : résumé de la tendance globale] | [INDICATEUR 1] [variations spécifiques d'un trimestre à l'autre avec pourcentages] | [INDICATEUR 2] [variations spécifiques]
Directives : Ne mentionner que les trimestres avec une variation > 10%. Si aucune variation > 10% : « [INDICATEUR] est resté stable depuis [DATE]... » Nombre de mots : 50–80, max 100.

Bloc droit : metricId : m3-01-01 | vizPresetId : volume-quarterly | valuesFilter : count_final_both | Afficher les étiquettes de données, indicateur en colonnes et non en lignes

TYPE DE DIAPOSITIVE C : Analyse des perturbations

Titre : Rédiger un titre analytique (1–2 phrases) résumant le constat principal pour ce groupe d'indicateurs.
✅ Bon : « Malgré des déficits généralisés en 2024, les services de vaccination montrent des signes de reprise vers mi-2025 »
❌ Mauvais : « BCG - Bacille de Calmette-Guérin »

Visualisation (côté droit) : metricId : m3-02-01 | vizPresetId : disruption-chart | chartTitle : « Comparaison de l'utilisation déclarée des services aux tendances attendues, au niveau national » | selectedReplicant : premier indicateur du groupe | filterOverrides : tous les codes d'indicateurs du groupe | periodFilterOverride : période d'analyse

Interprétation (côté gauche — cible 50–100 mots, max 180) : Pour CHAQUE indicateur : périodes spécifiques de perturbations/excédents avec magnitudes approximatives. Tendances inter-indicateurs. Évaluation globale. Ne décrire que ce qui est réellement visible dans le graphique.

Déroulement
Étape 1 : Vérifier la disponibilité des données — appeler get_metric_data avant de créer les diapositives. Pour le mensuel : disaggregations : indicator_common_id, period_id. Pour le trimestriel : disaggregations : indicator_common_id, quarter_id.
Étape 2 : Analyser les données — identifier les hauts/bas, calculer les variations en % d'un trimestre à l'autre, noter les relations entre indicateurs.
Étape 3 : Créer les diapositives — utiliser create_slide pour chaque type (A, B, C) par groupe d'indicateurs. Positionner de manière séquentielle.

Données nécessaires
- Groupes d'indicateurs avec codes (par exemple : Soins prénatals : anc1, anc4)
- Plage de dates : 12 derniers trimestres complets (36 mois), format YYYYMM
- Langue : anglais ou français (ou autre)
- Type d'ajustement (optionnel) : Par défaut : count_final_both. Alternatives : count_final_none, count_final_outliers, count_final_completeness
- Position dans le deck : Après quelle section ou diapositive ces éléments doivent-ils être insérés ?

Principes clés
- ✅ Toujours interroger les données d'abord — utiliser get_metric_data avant de rédiger toute interprétation
- ✅ Ne jamais fabriquer de chiffres — ne rapporter que ce qui est dans les données réelles
- ✅ Mise en page cohérente — chaque diapositive utilise une répartition 4-8 en colonnes
- ✅ Structure parallèle — même format textuel pour chaque groupe d'indicateurs
- ✅ En-têtes analytiques — les en-têtes de type B décrivent des constats, pas seulement un sujet
- ✅ Texte fondé sur les preuves — inclure les chiffres spécifiques, mois et trimestres issus des visualisations
- ✅ Analyses actionnables — la section « Implications » suggère ce qui devrait être fait

DIAPOSITIVE SUIVANTE — En-tête de la Section 3
Titre : « Section 3 : Estimation de la couverture des services »
Sous-titre (anglais) : Using routine data to estimate recent trends and subnational disparity in the coverage of selected health services. Not intended as official estimates.
Sous-titre (français) : Utilisation des données de routine pour estimer les tendances récentes et les disparités infranationales dans la couverture de certains services de santé. Non destiné à servir d'estimations officielles.

INSTRUCTIONS : Créer les diapositives d'estimation de la couverture pour tous les indicateurs

Créer des diapositives individuelles d'estimation de la couverture pour chaque indicateur disposant de données de couverture dans les métriques m6-01-01 (national) et m6-02-01 (infranational). Organiser les diapositives selon une approche par cycle de vie : CPN1, CPN4, Accouchements, BCG, Penta 1, Penta 3.

Étape 1 : Identifier les indicateurs disponibles
Appeler get_metric_data pour m6-01-01 afin de voir quels indicateurs sont dans la dimension indicator_common_id.

Étape 2 : Pour chaque indicateur, créer une diapositive

Bloc 1 (Ligne supérieure, pleine largeur) : Graphique de séries temporelles de la couverture nationale AVEC ÉTIQUETTES DE DONNÉES. Utiliser : {"type": "from_visualization", "visualizationId": "wua", "replicant": "[indicator_code]"}

Bloc 2 (Ligne inférieure, gauche — Span 4) : Interprétation textuelle combinée avec deux sous-sections : « Tendance nationale : » et « Variabilité infranationale : »

Bloc 3 (Ligne inférieure, droite — Span 8) : Graphique en barres de la couverture infranationale. Utiliser : {"type": "from_metric", "metricId": "m6-02-01", "vizPresetId": "coverage-bar", "selectedReplicant": "[indicator_code]", "startDate": 2001, "endDate": 2025}

Directives d'interprétation textuelle

Pour la tendance nationale (2–3 phrases) :
- Décrire la tendance historique des enquêtes (augmentation/diminution/stable) avec les années et pourcentages spécifiques
- Mentionner brièvement la trajectoire projetée basée sur les enquêtes jusqu'à l'année la plus récente
- Comparer les estimations SNIS à la trajectoire des enquêtes (alignées/supérieures/inférieures)
- S'il y a une différence, indiquer quand elle apparaît et si elle est temporaire ou persistante

Pour la variabilité infranationale (1 phrase) : « En [années], la couverture de [indicateur] montre une variabilité infranationale [forte/modérée], allant d'un minimum de X% ([région]) à un maximum de Y% ([région]), la majorité des régions enregistrant une couverture entre A% et B%. »

Règles d'interprétation : Rédiger dans la langue du projet. Utiliser un langage neutre et descriptif. NE PAS spéculer sur les causes. NE PAS interpréter si les tendances sont bonnes ou mauvaises. Se concentrer UNIQUEMENT sur les tendances visibles dans les données.

Liste des indicateurs à traiter
- anc1 (CPN1)
- anc4 (CPN4) ✓ Déjà terminé
- bcg (BCG 0–11 mois)
- penta1 (Penta 1)
- penta3 (Penta 3)
- sba (Accouchement assisté)
- pnc1_mother (CPoN1 mère) — si disponible

Convention de nommage des diapositives
- En-tête : « Estimation de la couverture du service [Nom complet de l'indicateur en français] »
- Titre du graphique national : « Tendances de la couverture [Indicateur] au niveau national »
- Titre du graphique infranational : « Couverture [Indicateur] par région »

DERNIÈRE PAGE

FASTR initiative : https://data.gffportal.org/key-theme/FASTR

APRÈS AVOIR TERMINÉ LE RAPPORT

Informer l'utilisateur : « Rapport terminé. Si vous souhaitez ajouter d'autres sections, vous pouvez utiliser ces prompts depuis la bibliothèque : Prompt 2 (Analyse régionale des perturbations) ou Prompt 3 (Annexe d'évaluation de la qualité des données). »
```
