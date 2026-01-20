<!-- AUTO-TRANSLATED from 04_data_quality_assessment.md -->
<!-- Add REVIEWED marker after human review to protect from overwrite -->

# Évaluation de la qualité des données (AQD)

## Contexte et objectif

### Objectif du module

Le module d'évaluation de la qualité des données (DQA) évalue la fiabilité des données de routine du système d'information sur la gestion de la santé (SIGS) communiquées par les établissements de santé. Il s'agit d'une étape initiale de contrôle de la qualité dans le pipeline FASTR, qui examine les rapports mensuels des établissements afin d'identifier les problèmes de qualité des données avant qu'elles ne soient utilisées dans l'analyse en aval.

Le module évalue la qualité des données selon trois dimensions complémentaires : les valeurs aberrantes, qui identifient les valeurs rapportées anormalement élevées pouvant refléter des erreurs de rapport ou de saisie des données ; l'exhaustivité, qui mesure la régularité et la continuité des rapports des établissements dans le temps ; et la cohérence, qui évalue si les indicateurs connexes présentent les relations attendues. Ces dimensions sont combinées en une note globale de l'AQD, qui fournit une mesure synthétique standardisée de la fiabilité des données.

Les données de routine du SIGS constituent une source essentielle pour le suivi de la prestation des services de santé, tant au niveau des établissements que de la population, car elles permettent de saisir des événements tels que les vaccinations effectuées et les accouchements assistés par du personnel de santé qualifié. Comme toutes les données collectées en routine, les données SIGS sont sujettes à des limitations de qualité. Le module AQD du FASTR applique un examen systématique des données mensuelles au niveau des établissements et des indicateurs afin d'identifier et de caractériser ces limites. Les résultats sont résumés sous forme d'estimations annuelles, qui peuvent refléter des données partielles en fonction de la disponibilité des données au moment de l'analyse (par exemple, les analyses effectuées en milieu d'année peuvent inclure des données uniquement pour les mois disponibles).

### Raison d'être de l'analyse

La qualité des données influe directement sur la fiabilité des indicateurs de santé et des estimations de la couverture. Avant de calculer les taux d'utilisation des services ou la couverture de la population, il est nécessaire de déterminer si les données sous-jacentes sur les établissements sont suffisamment fiables. Ce module identifie les schémas de données susceptibles de fausser les résultats analytiques, ce qui permet aux utilisateurs de prendre des décisions éclairées sur le traitement des données dans les étapes suivantes du pipeline.

### Points clés

| Composante de l'analyse de la qualité de l'eau
|-----------|---------|
| Les données brutes du SIGS (`SIGS_ISO3.csv`) contenant les volumes de services des établissements par mois et par indicateur<br>Les identifiants des zones géographiques/administratives<br>Les noms des indicateurs normalisés
| Les résultats de la cohérence au niveau géographique<br>Les scores globaux de l'AQD<br>Les résultats de la cohérence au niveau géographique<br>Les résultats de la cohérence au niveau géographique<br>Les résultats de la cohérence au niveau géographique<br>Les résultats de la cohérence au niveau géographique<br>Les scores globaux de l'AQD
| Les résultats de l'analyse de la qualité des données (AQD) sont les suivants : **Objectif** | Évaluer la fiabilité des données SIGS par la détection des valeurs aberrantes, l'évaluation de l'exhaustivité et la vérification de la cohérence afin de garantir des données fiables pour l'estimation de la couverture

---

## Flux de travail analytique

### Aperçu des étapes analytiques

Le module applique une séquence structurée de contrôles de la qualité des données, allant d'observations individuelles à une évaluation globale de la fiabilité des données :

**Étape 1 : Préparation des données**
Les rapports mensuels des établissements sont chargés et organisés pour l'analyse. Les dates sont normalisées et les unités géographiques ainsi que les indicateurs de santé disponibles dans l'ensemble de données sont identifiés.

**Étape 2 : Détection des valeurs aberrantes
Pour chaque établissement et chaque indicateur (par exemple, les doses de vaccin Pentavalent ou les visites de soins prénatals), le module identifie les valeurs anormalement élevées qui peuvent refléter des erreurs de déclaration ou de saisie des données. Deux approches complémentaires sont utilisées : la détection statistique des valeurs aberrantes, basée sur les écarts par rapport à l'historique des rapports d'un établissement, et les vérifications proportionnelles qui signalent les mois représentant une part invraisemblablement importante des volumes de services annuels.

**Étape 3 : Évaluation de l'exhaustivité**
Le module évalue la cohérence des rapports de l'établissement au fil du temps en construisant une chronologie complète des rapports pour chaque combinaison établissement-indicateur et en identifiant les mois manquants. Les établissements qui n'ont pas fait de déclaration pendant de longues périodes (six mois ou plus) sont classés comme inactifs plutôt qu'incomplets.

**Étape 4 : Évaluation de la cohérence**
Les indicateurs connexes sont censés suivre des relations prévisibles. Par exemple, le nombre de premières visites de soins prénatals doit être supérieur au nombre de quatrièmes visites. Le module évalue ces relations à l'aide de ratios d'indicateurs calculés au niveau du district, en réduisant le biais dû au déplacement des patients entre les établissements, et signale les écarts par rapport aux modèles attendus.

**Étape 5 : Vérifications de la disponibilité des indicateurs**
Avant d'appliquer les évaluations de cohérence, le module vérifie que les paires d'indicateurs requises sont présentes dans les données. Lorsque des indicateurs sont manquants, l'analyse s'adapte aux informations disponibles sans générer d'erreurs.

**Étape 6 : Calcul du score AQD**
Pour un ensemble défini d'indicateurs de base (généralement la première dose de vaccin Pentavalent, la première visite de soins prénatals et les consultations externes), les résultats des contrôles des valeurs aberrantes, de l'exhaustivité et de la cohérence sont combinés pour obtenir un score global du CQD. Un mois-facilité ne reçoit le score le plus élevé que si tous les indicateurs de base répondent aux normes minimales dans les trois dimensions.

**Étape 7 : Résultats**
Le module génère un ensemble de résultats structurés, y compris les indicateurs de valeurs aberrantes, les indicateurs d'exhaustivité, les résultats de cohérence et les scores finaux de l'AQD. Ces résultats sont utilisés dans les modules FASTR suivants et fournissent une base transparente pour l'examen et l'amélioration de la qualité des données.

### Diagramme de flux de travail

<iframe src="../resources/diagrams/mod1_workflow.html" width="100%" height="800" style="border : 1px solid #ccc ; border-radius : 4px ;" title="module 1 Interactive Workflow"></iframe>

### Points de décision clés

**Quand une valeur est-elle considérée comme aberrante ?

Les valeurs aberrantes sont identifiées en évaluant les variations au sein de l'établissement dans les rapports mensuels pour chaque indicateur. Une valeur est considérée comme aberrante si elle remplit **l'un ou l'autre** des critères suivants :

1. La valeur dépasse 10 fois l'écart absolu médian (EAM) par rapport à la médiane mensuelle de l'indicateur ; **ou**
2. La valeur représente plus de 80 % du volume total déclaré pour une installation, un indicateur et une année donnés **et** le nombre déclaré est supérieur à 100.

L'écart absolu est calculé en utilisant uniquement les valeurs égales ou supérieures à la médiane, afin de concentrer la détection sur les valeurs inhabituellement élevées et d'éviter de signaler les observations portant sur de faibles volumes.

**Pourquoi la cohérence est-elle évaluée au niveau du district plutôt qu'au niveau de l'établissement ?

Les patients se font souvent soigner dans différents établissements au sein d'un même district, en fonction du service. Par exemple, une femme peut recevoir sa première visite de soins prénatals dans un centre de santé primaire, mais accoucher dans un hôpital de district. L'évaluation de la cohérence au niveau du district tient compte de ces mouvements de patients et fournit une représentation plus précise des schémas d'utilisation des services.

**Que se passe-t-il lorsque les indicateurs requis sont manquants ?

Le module s'adapte aux données disponibles. Si les paires d'indicateurs nécessaires à l'évaluation de la cohérence sont manquantes, les contrôles de cohérence ne sont pas appliqués et le score AQD est calculé en utilisant uniquement les dimensions d'aberration et d'exhaustivité. L'analyse se poursuit en utilisant les dimensions de qualité qui peuvent être évaluées.

**Comment les installations inactives sont-elles gérées ?

Les établissements qui n'ont pas fait de déclaration pendant six mois consécutifs ou plus au début ou à la fin de leur période de déclaration sont classés comme inactifs pour ces mois plutôt qu'incomplets. Cela évite de pénaliser les installations qui n'ont pas encore commencé à faire leur déclaration ou qui ont définitivement cessé leurs activités.

### Traitement des données et résultats

**Aperçu de la transformation

Le module transforme les rapports d'installation bruts en ensembles de données marqués d'un label de qualité en suivant les étapes suivantes :

1. **Format d'entrée** : Observations mensuelles avec l'identifiant de l'établissement, la période de déclaration, l'indicateur et le nombre déclaré
2. **Enrichissement** : Calcul des statistiques de soutien, y compris les valeurs médianes, les résidus basés sur le MAD et les contributions proportionnelles en volume
3. **Complétion** : Génération explicite d'enregistrements pour les mois manquants, convertissant les lacunes implicites en points de données observables
4. **Agrégation** : Agrégation des données au niveau de l'établissement au niveau du district pour l'évaluation de la cohérence
5. **Marquage de la qualité** : Attribution d'indicateurs de qualité binaires pour les valeurs aberrantes, l'exhaustivité et la cohérence
6. **Notation** : Combinaison des indicateurs de qualité en scores continus (0-1) et en indicateurs de réussite/échec correspondants
7. **Format de sortie** : Production de plusieurs fichiers de sortie adaptés à différentes utilisations analytiques, y compris l'examen rapide des valeurs aberrantes, l'analyse complète de la qualité des données et les données d'entrée pour les modules FASTR en aval

Le module traite les données en format long, avec un enregistrement par combinaison installation-indicateur-période, et produit des mesures standardisées de la qualité des données qui sont utilisées par les modules suivants pour informer les décisions d'ajustement, de pondération ou d'exclusion des données.

---
### Résultats de l'analyse et visualisation

L'analyse FASTR génère six principaux résultats visuels :

**1. Carte thermique des valeurs aberrantes**

Tableau de la carte thermique avec les zones comme lignes et les indicateurs de santé comme colonnes, codés par couleur en fonction du pourcentage de valeurs aberrantes.

![Pourcentage de mois d'installation qui sont aberrants](resources/default_outputs/Default_1._Proportion_of_valeurs aberrantes.png)


**2. Complétude de l'indicateur**

Tableau de la carte thermique avec les zones en lignes et les indicateurs de santé en colonnes, codés par couleur en fonction du pourcentage d'exhaustivité.

![Pourcentage de mois d'établissement avec des données complètes](resources/default_outputs/Default_2._Proportion_of_completed_records.png)


**3. Complétude des indicateurs dans le temps**

Graphiques chronologiques horizontaux montrant les tendCPNes en matière d'exhaustivité pour chaque indicateur au cours de la période d'analyse.

(resources/default_outputs/Default_3._Proportion_of_completed_records_over_time.png)

**4. Cohérence interne**

Tableau de la carte thermique avec les zones comme lignes et les catégories de repères de cohérence comme colonnes, codées par couleur en fonction de la performCPNe.

(resources/default_outputs/Default_4._Proportion_of_sub-national_areas_meeting_consistency_criteria.png)


**5. Score global du CQD**

Tableau de la carte thermique avec les zones comme lignes et les périodes comme colonnes, codées par couleur en fonction du pourcentage du score CQD.

(resources/default_outputs/Default_5._Overall_DQA_score.png)

**6. Score moyen de l'AQD**

Tableau de la carte thermique avec les zones comme lignes et les périodes comme colonnes, codées par couleur en fonction du score moyen de l'AQD.

![Score moyen de qualité des données sur l'ensemble des mois de l'établissement](resources/default_outputs/Default_6._Mean_DQA_score.png)


**Guide d'interprétation**

Pour les cartes thermiques (sorties 1, 2, 4, 5, 6) :

- **Lignes** : Zones géographiques (zones/régions)
- **Colonnes** : Indicateurs de santé ou périodes de temps

Pour la carte thermique des valeurs aberrantes (résultat 1) :

- **Valeurs** : Pourcentage de mois d'établissement signalés comme aberrants
- Des pourcentages plus faibles indiquent moins de valeurs extrêmes

Pour la carte thermique de l'exhaustivité des indicateurs (résultat 2) :

- **Valeurs** : Pourcentage de mois d'installation avec un rapport complet
- Des pourcentages plus élevés indiquent un rapport plus complet

Pour le graphique de l'exhaustivité de l'indicateur dans le temps (résultat 3) :

- **Tableau chronologique horizontal** montrant les tendCPNes de l'exhaustivité par indicateur
- **Axe X** : Période de temps
- **Axe Y** : Pourcentage d'exhaustivité
- Indique si les rapports s'améliorent, diminuent ou sont stables

Pour la carte thermique de la cohérence interne (résultat 4) :

- **Valeurs** : Pourcentage de domaines répondant aux critères de cohérence
- Indique si les indicateurs liés suivent les relations attendues (par exemple, CPN1 ≥ CPN4)

Pour les cartes thermiques des scores de l'AQD (résultats 5-6) :

- **Sortie 5** : Pourcentage de mois de l'établissement ayant passé tous les contrôles de qualité
- **Résultat 6** : Score moyen de l'AQD sur l'ensemble des mois de l'établissement
- Des scores plus élevés indiquent une meilleure qualité globale des données

---

## Référence détaillée

Cette section fournit des détails techniques aux personnes chargées de la mise en œuvre, aux développeurs et aux analystes qui ont besoin de comprendre la méthodologie sous-jacente.

### Paramètres de configuration

Le module utilise plusieurs paramètres configurables qui contrôlent le comportement de l'analyse :

???+ "Paramètres géographiques"

    ```r
    # Country identifier
    COUNTRY_ISO3 <- "GIN"  # ISO3 country code

    # Geographic level for consistency analysis
    GEOLEVEL <- "admin_area_3"  # Admin level (1=national, 2=région, 3=district, etc.)
    ```

    Le paramètre `GEOLEVEL` détermine le niveau d'agrégation pour l'analyse de cohérence. Les niveaux administratifs inférieurs (3-4) permettent de saisir les tendCPNes locales, mais les données peuvent être rares. Les niveaux supérieurs (2) fournissent des estimations plus stables mais peuvent masquer des incohérences locales.

? ?? "Paramètres de détection des valeurs aberrantes

    ```r
    # Proportion threshold for valeur aberrante detection
    valeur aberrante_PROPORTION_THRESHOLD <- 0.8  # Flag if single month > 80% of annual total

    # Minimum count to consider for valeur aberrante flagging
    MINIMUM_COUNT_THRESHOLD <- 100  # Only flag valeurs aberrantes with count >= 100

    # Number of écart absolu médians for statistical valeur aberrante detection
    MADS <- 10  # Flag if value > 10 MADs from median
    ```

    **Tuning guidCPNe:**
    - **Détection plus sensible** : Abaisser `valeur aberrante_PROPORTION_THRESHOLD` à 0,6-0,7, réduire `MADS` à 8
    - **Détection moins sensible** : Augmenter __CODE_BLOC_44__ à 0,9, augmenter __CODE_BLOC_45__ à 12-15
    - **Petites installations** : Réduire __CODE_BLOC_46__ à 50
    - **Grandes installations uniquement** : Augmenter `MINIMUM_COUNT_THRESHOLD` à 200+

? ?? "Sélection de l'indicateur CQD

    cODE_BLOC_2__

    **Séries d'indicateurs standard:**
    - **Focalisation sur la mère et l'enfant** : `c("CPN1", "CPN4", "delivery", "Penta1", "Penta3")`
    - **Focalisation sur l'immunisation** : `c("BCG", "Penta1", "Penta3", "rougeole1")`
    - **Complet** : `c("Penta1", "CPN1", "opd", "delivery", "pnc1")`

? ?? "Plages de référence de cohérence"

    ```r
    all_consistency_ranges <- list(
      pair_Penta    = c(lower = 0.95, upper = Inf),  # Penta1 >= 0.95 * Penta3
      pair_CPN      = c(lower = 0.95, upper = Inf),  # CPN1 >= 0.95 * CPN4
      pair_delivery = c(lower = 0.7, upper = 1.3),   # 0.7 <= BCG/Delivery <= 1.3
      pair_malaria  = c(lower = 0.9, upper = 1.1)    # Malaria indicateurs within 10%
    )
    ```

    Les fourchettes reflètent les attentes du programme. Par exemple, la CPN1 devrait toujours être au moins 95% de la CPN4 (plus de femmes commencent les soins que de femmes qui vont jusqu'au bout des quatre visites). La tolérCPNe de 5 % tient compte des variations dans la saisie des données. Le BCG, en tant que vaccin administré à la naissCPNe, devrait correspondre approximativement au nombre d'accouchements dans les établissements de santé, avec une tolérCPNe de 30 % pour les variations.

### Spécifications des entrées/sorties

#### Structure du fichier d'entrée

**Fichier requis** : `SIGS_[COUNTRY_ISO3].csv`

**Colonnes requises:**
- `établissement_id` (caractère/entier) : Identifiant unique pour chaque établissement de santé
- __CODE_BLOC_53__ (nombre entier) : Période au format AAAAMM (par exemple, 202401 pour janvier 2024)
- __CODE_BLOC_54__ (caractère) : Noms d'indicateurs standardisés (par exemple, "Penta1", "CPN1", "opd")
- __CODE_BLOC_55__ (numérique) : Volume ou nombre de services pour l'indicateur
- __CODE_BLOC_56__ à __CODE_BLOC_57__ (caractères) : Colonnes de zones géographiques/administratives

**Exemple de format:**

__CODE_BLOC_4__

**Exigences en matière de données:**
- Au moins 12 mois de données recommandés pour une détection robuste des valeurs aberrantes
- Les valeurs manquantes sont représentées par NA ou par des lignes absentes (les deux sont traitées)
- Les zéros doivent être des zéros explicites et non des valeurs manquantes
- Les colonnes géographiques sont détectées automatiquement (les colonnes 2 à 8 sont facultatives)

#### Fichiers de sortie

? ?? "M1_output_valeur aberrante_list.csv - Valeurs aberrantes marquées uniquement"

    **Objectif** : Liste de référence rapide des seules observations signalées comme aberrantes

    **Colonnes:**

    - cODE_BLOCK_58__ : Identifiant de l'installation
    - cODE_BLOCK_59__ : Zones géographiques (incluses dynamiquement en fonction des données)
    - cODE_BLOCK_60__ : Nom de l'indicateur de santé
    - cODE_BLOC_61__ : Période (YYYYMM)
    - cODE_BLOCK_62__ : Volume de services déclarés

    **Cas d'utilisation** : Les gestionnaires de données examinent des valeurs aberrantes spécifiques en vue d'une enquête ou d'une correction

? ?? "M1_output_valeurs aberrantes.csv - Tous les enregistrements avec des indicateurs de valeurs aberrantes

    **Objectif** : Ensemble complet de données avec indicateurs de valeurs aberrantes pour toutes les combinaisons établissement-indicateur-période

    **Colonnes:**

    - cODE_BLOCK_63__ : Identifiant de l'établissement
    - cODE_BLOCK_64__ : Zones géographiques (incluses dynamiquement en fonction des données)
    - cODE_BLOC_65__ : Période (YYYYMM)
    - cODE_BLOQUE_66__ : Nom de l'indicateur de santé
    - cODE_BLOC_67__ : Indicateur de valeurs aberrantes combinées finales (0 = pas de valeurs aberrantes, 1 = valeurs aberrantes)

    **Cas d'utilisation** :

    - Entrée pour le module 2 (Ajustements de la qualité des données)
    - Analyse statistique des modèles de valeurs aberrantes
    - Génération de visualisations de la prévalence des valeurs aberrantes

? ?? "M1_output_complétude.csv - Statut de complétude"

    **Objectif** : Indicateurs d'exhaustivité pour toutes les combinaisons établissement-indicateur-période, y compris les enregistrements explicitement créés pour les mois manquants

    **Colonnes:**

    - cODE_BLOCK_68__ : Identifiant de l'établissement
    - cODE_BLOCK_69__ : Zones géographiques (incluses dynamiquement en fonction des données)
    - cODE_BLOCK_70__ : Nom de l'indicateur de santé
    - cODE_BLOC_71__ : Période (AAAAMM)
    - cODE_BLOC_72__ : 0=Incomplet (manquant), 1=Complet (rapporté)

    **Caractéristiques particulières** :

    - Contient des lignes explicites pour les mois non déclarés
    - Les périodes inactives (6+ mois au début/à la fin avec complétude_flag=2) sont exclues de l'exportation
    - Séries temporelles complètes pour chaque combinaison établissement-indicateur

    **Cas d'utilisation** :

    - Calcul des pourcentages d'exhaustivité
    - Identification des lacunes en matière de déclaration
    - Analyse des tendCPNes du comportement en matière de déclaration

? ?? "M1_output_consistency_geo.csv - Cohérence au niveau géographique"

    **Objectif** : Indicateurs de cohérence calculés au niveau géographique spécifié (par exemple, district)

    **Colonnes:**

    - cODE_BLOCK_73__ : Identifiants géographiques jusqu'au niveau géographique spécifié (inclus dynamiquement en fonction des données)
    - cODE_BLOCK_74__ : Période (YYYYMM)
    - cODE_BLOCK_75__ : Nom de la paire de cohérence (par exemple, "pair_Penta", "pair_CPN")
    - cODE_BLOC_76__ : Indicateur binaire (1=consistant, 0=inconsistant, NA=incapable de calculer)

    **Format** : Format long avec une ligne par type de zone géographique-période-ratio

    **Cas d'utilisation** :

    - Comprendre les modèles de prestation de services au niveau du district
    - Identifier les zones géographiques présentant des problèmes de cohérence
    - Création de cartes thermiques de cohérence par zone

? ?? "M1_output_consistency_établissement.csv - Cohérence au niveau de l'établissement

    **Objectif** : Résultats de la cohérence géographique étendus au niveau de l'établissement

    **Columns:**

    - cODE_BLOCK_77__ : Identifiant de l'établissement
    - cODE_BLOCK_78__ : Zones géographiques (incluses dynamiquement en fonction des données)
    - cODE_BLOCK_79__ : Période (YYYYMM)
    - cODE_BLOCK_80__ : Nom de la paire de cohérence (par exemple, "pair_Penta", "pair_CPN")
    - cODE_BLOCK_81__ : Indicateur binaire (1=consistant, 0=inconsistant, NA=incapable de calculer)

    **Format** : Format long avec une ligne par type d'installation-période-ratio

    **Cas d'utilisation** :

    - Entrée pour la notation de l'AQD
    - Fusion des indicateurs de cohérence avec les analyses au niveau de l'établissement
    - Rapports de qualité spécifiques à l'établissement

? ?? "M1_output_dqa.csv - notes finales de l'AQD

    **Objectif** : Scores composites de qualité des données par établissement et par période

    **Colonnes:**

    - cODE_BLOCK_82__ : Identifiant de l'établissement
    - cODE_BLOCK_83__ : Zones géographiques (incluses dynamiquement en fonction des données)
    - cODE_BLOCK_84__ : Période (YYYYMM)
    - cODE_BLOCK_85__ : Moyenne des scores des composants (0-1)
    - cODE_BLOCK_86__ : Réussite/échec global(e) binaire (1 = tous les contrôles sont réussis ; 0 = un contrôle a échoué)

    **Cas d'utilisation** :

    - Filtrage des données pour les modules suivants (par exemple, n'utiliser que les mois d'installation avec dqa_score=1)
    - Suivi des tendCPNes de la qualité des données dans le temps
    - Identifier les établissements qui ont besoin d'un soutien pour améliorer la qualité des données

### Documentation sur les fonctions clés

? ?? "load_and_preprocess_data()"

    **Signature** : `load_and_preprocess_data(file_path)`

    **But** : Charge les données SIGS et les prépare pour l'analyse en créant les champs de date et les indicateurs composites nécessaires

    **Paramètres:**

    - `file_path` (caractère) : Chemin d'accès au fichier CSV du SIGP

    **Returns** : Liste contenant :

    - `data` : Cadre de données prétraité avec le champ date ajouté
    - cODE_BLOCK_90__ : Vecteur de noms de colonnes géographiques détectés

    **Process:**
    1. Lecture du fichier CSV contenant les données SIGS
    2. Convertit `period_id` (format YYYYMM) en objets Date pour l'ordre temporel
    3. Détecte toutes les colonnes relatives aux zones administratives (admin_area_1 à admin_area_8)
    4. Crée un indicateur composite du paludisme s'il existe des indicateurs constitutifs :
       - Combine `rdt_positive` + `micro_positive` en `rdt_positive_plus_micro`
       - Cet indicateur composite est utilisé pour les contrôles de cohérence relatifs au paludisme

    **Exemple:**

    ```r
    inputs <- load_and_preprocess_data("SIGS_ISO3.csv")
    data <- inputs$data
    geo_cols <- inputs$geo_cols
    ```

? ?? "validate_consistency_pairs()"

    **Signature** : `validate_consistency_pairs(consistency_params, data)`

    **But** : Valide que les paires d'indicateurs requises existent dans l'ensemble de données avant d'exécuter l'analyse de cohérence

    **Paramètres:**

    - cODE_BLOCK_96__ : Liste contenant les consistency_pairs et consistency_ranges
    - bLOC_CODE_97__ : L'ensemble de données SIGS

    **Returns** : Mise à jour des consistency_params avec seulement les paires valides (liste vide s'il n'y a pas de paires valides)

    **Process:**
    1. Vérifie quels indicateurs sont disponibles dans l'ensemble de données
    2. Supprime les paires de cohérence pour lesquelles un ou les deux indicateurs sont manquants
    3. Émet des avertissements concernant les paires supprimées
    4. Retourne une liste vide s'il ne reste plus de paires valides

    **Exemple de sortie:**

    cODE_BLOCK_6__

? ?? "valeur aberrante_analysis()"

    **Signature** : `valeur aberrante_analysis(data, geo_cols, valeur aberrante_params)`

    **But** : Identifier les valeurs aberrantes statistiques dans les volumes de services des installations à l'aide de deux méthodes de détection

    **Paramètres:**

    - cODE_BLOCK_99__ : Données SIGS avec établissement_id, indicateur_common_id, period_id, count
    - cODE_BLOCK_100__ : Vecteur de noms de colonnes géographiques
    - cODE_BLOCK_101__ : Liste contenant :
      - `valeur aberrante_pc_threshold` : Seuil de proportion (par défaut 0.8)
      - `count_threshold` : Seuil de comptage minimum (par défaut 100)

    **Résultats** : Cadre de données avec les indicateurs de valeurs aberrantes et les mesures de diagnostic pour chaque établissement-indicateur-période

    **Champs calculés:**

    - cODE_BLOCK_104__ : Nombre médian par indicateur d'établissement
    - cODE_BLOCK_105__ : MAD calculé sur les valeurs >= médiane
    - cODE_BLOCK_106__ : Résidu standardisé (|comptage - médiane| / MAD)
    - cODE_BLOCK_107__ : Drapeau binaire (1 si mad_residual > MADS)
    - cODE_BLOCK_108__ : Contribution proportionnelle au total annuel
    - cODE_BLOC_109__ : Indicateur binaire (1 si pc > seuil)
    - cODE_BLOC_110__ : Indicateur final (1 si l'un des indicateurs de la méthode ET le nombre > seuil minimum)

    **Algorithm steps:**

    **Étape 1** : Calculer le volume médian pour chaque combinaison établissement-indicateur

    **Étape 2** : Calculer la DAM en utilisant uniquement les valeurs égales ou supérieures à la médiane
    - Évite les biais dus aux établissements ayant de nombreux mois à faible volume
    - Standardise les résidus en divisant (nombre - médiane) par MAD
    - Drapeaux valeur aberrante_mad = 1 si mad_residual > paramètre MADS

    **Étape 3** : Calcul de la contribution proportionnelle
    - Pour chaque installation-indicateur-année, additionner le nombre total annuel
    - Calculer pc = count / annual_total
    - Drapeaux valeur aberrante_pc = 1 si pc > valeur aberrante_PROPORTION_THRESHOLD

    **Étape 4** : Combiner les drapeaux
    - Indicateur de valeur aberrante finale = 1 si (valeur aberrante_mad = 1 OR valeur aberrante_pc = 1) AND count > MINIMUM_COUNT_THRESHOLD
    - Le seuil (100 par défaut) garantit que seuls les volumes importants sont signalés, ce qui permet d'éviter les faux positifs dans les établissements à faible volume

? ?? "process_complétude()"

    **Signature** : `process_complétude(valeur aberrante_data_main)`

    **But** : Fonction d'orchestration principale qui génère des séries temporelles complètes et attribue des indicateurs de complétude pour tous les indicateurs

    **Paramètres:**

    - cODE_BLOCK_112__ : Résultats de l'analyse des valeurs aberrantes (contient toutes les combinaisons installation-indicateur-période avec leur nombre)

    **Résultats** : Ensemble de données au format long avec les indicateurs d'exhaustivité pour toutes les combinaisons établissement-indicateur-période

    **Process:**

    1. Identifie la première et la dernière période de rapport pour chaque indicateur au niveau mondial
    2. Appelle `generate_full_series_per_indicateur()` pour chaque indicateur
    3. Applique la logique de marquage d'exhaustivité (complet/incomplet/inactif)
    4. Fusionne avec les métadonnées géographiques
    5. Combine les résultats de tous les indicateurs
    6. Supprime les périodes inactives (complétude_flag = 2)

    **Structure de sortie:**

    - Lignes explicites pour les périodes déclarées et non déclarées
    - Indicateur d'exhaustivité : 0 (incomplet), 1 (complet), 2 (inactif - supprimé)
    - Séries temporelles complètes de la première à la dernière période de déclaration par indicateur

? ?? "generate_full_series_per_indicateur()"

    **Signature** : `generate_full_series_per_indicateur(valeur aberrante_data, indicateur_id, timeframe)`

    **Objectif** : Crée une série chronologique mensuelle complète pour un indicateur spécifique, en comblant les lacunes lorsque les établissements n'ont pas fait de déclaration

    **Paramètres:**

    - `valeur aberrante_data` : data.table avec des résultats aberrants
    - cODE_BLOCK_116__ : Indicateur spécifique à traiter (par exemple, "Penta1")
    - cODE_BLOC_117__ : TABLEAU DE DONNÉES AVEC PREMIER_PID ET PREMIER_BLOC_117__ : Tableau de données avec first_pid et last_pid pour chaque indicateur

    **Résultats** : Série chronologique complète avec des lignes explicites pour les périodes déclarées et non déclarées

    **Process:**

    1. Sous-ensemble de données pour un indicateur spécifique
    2. Génère une séquence mensuelle de la première à la dernière période_id pour cet indicateur
    3. Crée une grille complète établissement-période (tous les établissements × tous les mois) en utilisant la jointure croisée `CJ()`
    4. Fusionne avec les données réelles déclarées
    5. Les chiffres manquants indiquent les périodes non déclarées
    6. Application de l'algorithme de détection des inactifs

    **Algorithme de détection inactive:**

    cODE_BLOCK_7__

    **Exemple de chronologie:**

    ```
    établissement A reporting pattern for indicateur "Penta1":
    Period:  202001 202002 202003 202004 202005 202006 202007 202008 202009 202010
    Count:   NA     NA     NA     NA     50     30     NA     NA     40     35
    Flag:    2      2      2      2      1      1      0      0      1      1
             [----Inactive----] [---Active period with gaps---]

    Explanation:
    - First 4 months: Inactive (6+ months missing before first report at 202005)
    - 202005-202006: Complete (reported)
    - 202007-202008: Incomplete (gaps in active period)
    - 202009-202010: Complete (reported)
    ```

? ?? "geo_consistency_analysis()"

    **Signature** : `geo_consistency_analysis(data, geo_cols, geo_level, consistency_params)`

    **Objectif** : Calcul des ratios de cohérence au niveau géographique pour tenir compte des patients qui recherchent des services dans plusieurs établissements au sein d'un district ou d'une région

    **Paramètres:**

    - cODE_BLOCK_120__ : Données aberrantes (avec les données aberrantes déjà marquées)
    - cODE_BLOCK_121__ : Vecteur de noms de colonnes géographiques
    - cODE_BLOCK_122__ : Niveau géographique pour l'agrégation (par exemple, "admin_area_3")
    - bLOC_CODE_123__ : Liste avec consistency_pairs et consistency_ranges

    **Résultats** : Cadre de données au format long avec les résultats de cohérence au niveau géographique

    **Process:**

    1. Exclut les valeurs aberrantes (définit le nombre à NA lorsque valeur aberrante_flag = 1)
    2. Agrégation des données au niveau géographique spécifié par période (somme des installations)
    3. Reformule les données en format large (une colonne par indicateur)
    4. Calcul du ratio pour chaque paire d'indicateurs
    5. Signale la cohérence sur la base d'intervalles prédéfinis

    **Colonnes de sortie:**

    - Identifiants géographiques (jusqu'au niveau spécifié)
    - cODE_BLOCK_124__ : Période de temps
    - cODE_BLOCK_125__ : Nom de la paire de cohérence (par exemple, "pair_Penta")
    - cODE_BLOCK_126__ : Valeur du ratio calculé
    - cODE_BLOC_127__ : Indicateur binaire (1 = cohérent, 0 = incohérent, NA = impossible à calculer)

    **Exemple de sortie:**

    __CODE_BLOC_9__

    **Justification** : La mesure de la cohérence au niveau géographique tient compte des déplacements des patients entre les établissements et fournit une image plus précise des schémas d'utilisation des services au sein d'une communauté.

? ?? "expand_geo_consistency_to_facilities()"

    **Signature** : `expand_geo_consistency_to_facilities(établissement_metadata, geo_consistency_results, geo_level)`

    **Purpose** : Attribuer des résultats de cohérence au niveau géographique à des installations individuelles

    **Paramètres:**

    - cODE_BLOCK_129__ : Liste d'installations avec affectations géographiques
    - cODE_BLOCK_130__ : Sortie de geo_consistency_analysis()
    - `geo_level` : Niveau géographique utilisé dans l'analyse de cohérence

    **Returns** : Jeu de données au niveau de l'établissement avec drapeaux de cohérence

    **Process:**

    - Extraction de la liste des établissements avec leurs affectations géographiques
    - Effectue une jointure à gauche pour répliquer les scores de cohérence au niveau géographique à tous les établissements de cette zone
    - Utilise une relation de plusieurs à plusieurs pour gérer plusieurs périodes et types de ratios

    **Justification** : Étant donné que la cohérence est mesurée au niveau géographique (en tenant compte des déplacements des patients entre les établissements), tous les établissements d'un même district ou d'une même région reçoivent les mêmes scores de cohérence.

? ?? "dqa_with_consistency()"

    **Signature** : `dqa_with_consistency(complétude_data, consistency_data, valeur aberrante_data, geo_cols, dqa_rules)`

    **But** : Calcule les scores complets de l'AQD, y compris les contrôles de cohérence lorsque des paires de cohérence sont disponibles

    **Paramètres:**

    - `complétude_data` : Sortie de process_complétude()
    - cODE_BLOCK_134__ : Résultats de la cohérence de l'installation au format large
    - `valeur aberrante_data` : Sortie de valeur aberrante_analysis()
    - `geo_cols` : Vecteur de noms de colonnes géographiques
    - cODE_BLOCK_137__ : Liste spécifiant les valeurs requises pour chaque dimension

    **Configuration des règles de l'AQD:**

    bLOC_CODE_10__

    **Algorithme de notation:**

    **1. Score d'exhaustivité et de valeurs aberrantes** (par établissement et par période) :
    - Chaque indicateur CQD obtient 0 à 2 points (1 pour l'exhaustivité + 1 pour l'absence de valeurs aberrantes)
    - Maximum possible = 2 × nombre d'indicateurs CQD
    - Score = Total des points / Maximum des points

    **2. Score de cohérence** (par période d'installation) :
    - Ne compte que les paires pour lesquelles les deux indicateurs existent (les paires NA sont exclues du dénominateur)
    - Score = Nombre de paires réussies / Nombre de paires disponibles
    - Si aucune paire n'est disponible, le score = 0

    **3. Score moyen de l'AQD:**
    - Moyenne de la note d'exhaustivité et de la note de cohérence
    - Formule : `(complétude_valeur aberrante_score + consistency_score) / 2`

    **4. Note binaire de l'AQD:**
    - 1 si tous les contrôles sont réussis (complet, pas de valeurs aberrantes, cohérent)
    - 0 si l'un des contrôles échoue

    **Traitement des indicateurs manquants
    La fonction gère intelligemment les cas où certains indicateurs de cohérence sont manquants :
    - Les valeurs NA dans les paires de cohérence ne sont PAS remplacées par 0
    - Seules les paires disponibles contribuent au dénominateur
    - Cela évite de pénaliser les établissements pour des indicateurs qu'ils ne fournissent pas

    **Exemple de calcul:**

    cODE_BLOCK_11__

? ?? "dqa_without_consistency()"

    **Signature** : `dqa_without_consistency(complétude_data, valeur aberrante_data, geo_cols, dqa_rules)`

    **But** : Calcul des scores CQD en utilisant uniquement les contrôles d'exhaustivité et de valeurs aberrantes lorsque les données de cohérence ne sont pas disponibles ou qu'il n'existe pas de paires de cohérence valides

    **Quand on l'utilise:**

    - Aucune paire de cohérence n'est définie dans la configuration
    - Toutes les paires de cohérence ont des indicateurs manquants
    - L'ensemble de données ne contient pas d'indicateurs appariés

    **Scoring:**

    - Utilise uniquement les composantes d'exhaustivité et de valeurs aberrantes
    - cODE_BLOCK_140__ = CODE_BLOCK_141__
    - `dqa_score` = 1 si tous les contrôles d'exhaustivité et de valeurs aberrantes sont réussis, 0 sinon

    **Structure de sortie:**

    __CODE_BLOC_12__

### Méthodes statistiques et algorithmes

? ?? "Calcul de l'écart absolu médian (MAD)"

    Le MAD est une mesure robuste de la variabilité qui est moins sensible aux valeurs aberrantes que l'écart-type.

    **Algorithme MAD standard:**
    1. Calculer la médiane de l'ensemble de données
    2. Calculer les écarts absolus : |Valeur - médiane pour chaque point de données
    3. Trouver la médiane de ces écarts absolus

    **FASTR Modification:**
    Le module calcule le MAD en utilisant uniquement les valeurs égales ou supérieures à la médiane, ce qui le rend plus sensible aux valeurs aberrantes élevées tout en évitant les biais dus aux établissements ayant de nombreux mois à faible volume.

    **Calcul du degré de valeur aberrante:**

    $$
    \text{MAD Résiduel} = \frac{|\text{volume} - \text{volume médian}|}{\text{MAD}}
    $$

    **Classification des valeurs aberrantes:**
    - Si le résidu MAD > 10 (configurable via le paramètre `MADS`), la valeur est marquée comme une valeur aberrante basée sur MAD (`valeur aberrante_mad = 1`)
    - Le `valeur aberrante_flag` final requiert également un nombre > 100

    **Exemple:**

    cODE_BLOC_13__

? ?? "Détection proportionnelle des valeurs aberrantes"

    Cette méthode permet d'identifier les mois où une seule observation représente une proportion anormalement élevée du total annuel pour une combinaison installation-indicateur.

    **Algorithme:**
    1. Pour chaque année-indicateur d'établissement, additionner le nombre total annuel
    2. Calculer la proportion : `pc = monthly_count / annual_total`
    3. Marquer comme aberration proportionnelle (__CODE_BLOC_147__) si __CODE_BLOC_148__ (par défaut 0,8)
    4. Le __CODE_BLOC_149__ final requiert également un nombre > 100

    **Raison d'être:**
    Une installation déclarant 80 % de son volume annuel en un seul mois indique probablement une erreur de saisie des données (par exemple, déclaration cumulative au lieu d'une déclaration mensuelle, chiffre supplémentaire saisi).

    **Exemple:**

    cODE_BLOCK_14__

? ?? "Points de repère sur le rapport de cohérence"

    Le module applique des repères définis par programme pour les paires d'indicateurs :

    **ConsistCPNe CPN:**

    $$
    \text{CPN Consistency} =
    \begin{cases}
    1, & \frac{\text{CPN1 Volume}}{\text{CPN4 Volume}} \geq 0.95 \\N - 0, & \text{otherm}} - \N - \N - 0
    0, & \text{autre}
    \NFin{cases}
    $$

    **Interprétation** : Plus de femmes devraient commencer la CPN (CPN1) que terminer les quatre visites (CPN4). Le ratio devrait être ≥ 0,95, avec une tolérCPNe de 5 % pour les variations de données.

    **ConsistCPNe Penta:**

    $$
    \text{Penta Consistency} =
    \begin{cases}
    1, & \frac{\text{Penta1 Volume}}{\text{Penta3 Volume}} \geq 0.95 \\N- \N- \N- \N- \N- \N- 0
    0, & \text{autre}
    \N-END{cases}
    $$

    **Interprétation** : Plus d'enfants devraient recevoir Penta1 que de compléter la série de trois doses (Penta3).

    **BCG/Cohérence d'administration:**

    $$
    \text{BCG/ConsistCPNe d'administration} =
    \begin{cases}
    1, & 0.7 \leq \frac{\text{BCG Volume}}{\text{Delivery Volume}} \leq 1.3 \\N- \N- \N- \N
    0, & \text{autre}
    \N-END{cases}
    $$

    **Interprétation** : Le BCG est un vaccin administré à la naissCPNe, de sorte que le nombre de vaccinations par le BCG devrait être à peu près égal au nombre d'accouchements dans les établissements. La fourchette plus large (±30%) tient compte des nourrissons nés ailleurs qui reçoivent le BCG dans l'établissement ou des nourrissons nés dans l'établissement qui reçoivent le BCG ailleurs.

    **Détail de la mise en œuvre:**
    La cohérence est évaluée au niveau du district/de l'arrondissement (spécifié par `GEOLEVEL`) pour tenir compte des patients qui se rendent dans plusieurs établissements de leur région pour différents services.

? ?? "Calcul de l'exhaustivité"

    Pour un indicateur donné au cours d'un mois donné :

    $$
    \text{Complétude} = \frac{\text{Nombre d'installations déclarantes}}{\text{Nombre d'installations prévues}} \n- fois 100
    $$

    **Définition des établissements attendus:**
    Un établissement est censé déclarer un indicateur s'il a déjà déclaré cet indicateur au cours de la période d'analyse ET s'il n'est pas considéré comme inactif.

    **Définition d'une installation inactive:**
    Une installation est considérée comme inactive lorsqu'elle n'a pas fait de déclaration pendant au moins six mois consécutifs avant sa première déclaration ou après sa dernière déclaration.

    **Exemple:**

    cODE_BLOCK_15__

    **Note importante** : Un niveau élevé d'exhaustivité n'indique pas nécessairement que le SIGS est représentatif de l'ensemble de la prestation de services dans le pays, car certains services peuvent ne pas être fournis dans les établissements ou certains établissements peuvent ne pas faire de déclaration. Pour les pays où le DHIS2 ne stocke pas les zéros, l'exhaustivité de l'indicateur peut être sous-estimée s'il y a beaucoup d'établissements à faible volume.

? ?? "Calcul du score composite de l'AQD

    Le score de l'AQD combine trois dimensions de la qualité pour un ensemble défini d'indicateurs de base.

    **Scores des composantes:**

    **1. Score d'exhaustivité et d'aberration:**

    $$
    \text{Score d'exhaustivité et de valeur aberrante} = \frac{\sum (\text{réussite de l'exhaustivité} + \text{réussite de la valeur aberrante})}{2 \text{nombre d'indicateurs CQD}}
    $$

    **2. Score de cohérence:**

    $$
    \text{Score de cohérence} = \frac{\text{Nombre de paires ayant réussi les tests}}{\text{Nombre de paires disponibles}}
    $$

    **3. Score moyen de l'AQD:**

    $$
    \text{Moyenne AQD} = \frac{\text{Score d'exhaustivité et de valeurs aberrantes} + \text{Score de cohérence}}{2}
    $$

    **4. Score AQD binaire:**

    $$
    \texte{score AQD} =
    \begin{cases}
    1, & \text{si toutes les vérifications sont réussies (complètes, pas de valeurs aberrantes, cohérentes)} \\\n- \r}
    0, & \text{si une vérification échoue}
    \NFin{cases}
    $$

    **Critères de réussite pour un score binaire:**
    - TOUS les indicateurs de l'AQD doivent être complets (complétude_flag = 1)
    - TOUS les indicateurs du CQD doivent être exempts de valeurs aberrantes (valeur aberrante_flag = 0)
    - TOUTES les paires de cohérence disponibles doivent satisfaire aux critères de référence (sconsistency = 1)

    **Exemple de calcul:**

    cODE_BLOCK_16__

### Exemples de code

? ?? "Exemple 1 : Exécution du module avec les paramètres par défaut"

    ```r
    # Set working directory
    setwd("/path/to/module/directory")

    # Load required libraries
    library(zoo)
    library(stringr)
    library(dplyr)
    library(tidyr)
    library(data.table)

    # The module will automatically:
    # 1. Load SIGS_ISO3.csv
    # 2. Run all analyses with default parameters
    # 3. Generate output CSV files in the working directory

    source("01_module_data_quality_assessment.R")
    ```

? ?? "Exemple 2 : Ajuster la sensibilité de la détection des valeurs aberrantes"

    ```r
    # Make valeur aberrante detection more sensitive (lower thresholds)
    valeur aberrante_PROPORTION_THRESHOLD <- 0.6   # Flag if >60% of annual volume (was 80%)
    MINIMUM_COUNT_THRESHOLD <- 50         # Consider counts >=50 (was 100)
    MADS <- 8                             # Flag at 8 MADs (was 10)

    # Run the module
    source("01_module_data_quality_assessment.R")
    ```

    **Cas d'utilisation** : Pays avec des volumes de services généralement faibles où les seuils par défaut sont trop conservateurs.

? ?? "Exemple 3 : Niveau géographique différent pour plus de cohérence

    cODE_BLOCK_19__

    **Cas d'utilisation** : Le niveau du sous-district présente des données éparses ou trop peu d'installations par zone, ce qui rend l'agrégation au niveau du district plus stable.

? ?? "Exemple 4 : indicateurs CQD personnalisés"

    ```r
    # Focus DQA on maternal health indicateurs only
    DQA_indicateurS <- c("CPN1", "CPN4", "delivery", "pnc1")

    # Only evaluate CPN consistency pair
    CONSISTENCY_PAIRS_USED <- c("CPN")

    source("01_module_data_quality_assessment.R")
    ```

    **Cas d'utilisation** : Analyse spécialisée portant sur un domaine de service spécifique.

? ?? "Exemple 5 : Se présenter dans un autre pays

    ```r
    # Configure for your country
    COUNTRY_ISO3 <- "ISO3"  # Replace with your country code
    PROJECT_DATA_SIGS <- "SIGS_ISO3.csv"
    GEOLEVEL <- "admin_area_3"

    # Adjust for country-specific indicateurs if needed
    DQA_indicateurS <- c("Penta1", "CPN1", "opd", "fp_new")

    source("01_module_data_quality_assessment.R")
    ```

? ?? "Exemple 6 : Utilisation programmatique des sorties"

    ```r
    # After running the module, work with outputs

    # Load DQA results
    dqa_results <- read.csv("M1_output_dqa.csv")

    # Filter to high-quality établissement-months only
    high_quality <- dqa_results %>%
      filter(dqa_score == 1)

    # Calculate percentage of établissement-months passing DQA by district
    quality_by_district <- dqa_results %>%
      group_by(admin_area_2, period_id) %>%
      summarize(
        total_établissement_months = n(),
        passing_quality = sum(dqa_score == 1),
        pct_passing = 100 * passing_quality / total_établissement_months
      )

    # Identify facilities with consistently poor quality (never passing)
    poor_quality_facilities <- dqa_results %>%
      group_by(établissement_id) %>%
      summarize(
        months_analyzed = n(),
        months_passed = sum(dqa_score == 1),
        pct_passed = 100 * months_passed / months_analyzed
      ) %>%
      filter(pct_passed == 0)
    ```

### Dépannage

? ?? "Problème : Le module saute l'analyse de cohérence"

    **Symptômes:**
    - Message de la console : "Aucune paire de cohérence valide n'a été trouvée"
    - M1_output_consistency_geo.csv n'a que des en-têtes
    - Les scores du CQD sont calculés sans la composante de cohérence

    **Diagnostic:**
    Vérifiez que les deux indicateurs de chaque paire existent dans votre jeu de données :

    ```r
    # Load your data
    data <- read.csv("SIGS_[COUNTRY].csv")

    # Check available indicateurs
    print(unique(data$indicateur_common_id))

    # Compare with required pairs
    # For pair_Penta: need "Penta1" and "Penta3"
    # For pair_CPN: need "CPN1" and "CPN4"
    # For pair_delivery: need "BCG" and "delivery" (or "sba")
    ```

    **Solutions:**
    1. Ajuster `CONSISTENCY_PAIRS_USED` pour n'inclure que les paires dont les indicateurs sont disponibles
    2. Modifiez les noms des indicateurs dans vos données pour qu'ils correspondent aux noms attendus
    3. Accepter que l'AQD soit calculé sans la composante de cohérence

? ?? "Problème : toutes les installations sont considérées comme aberrantes

    **Symptômes:**
    - Pourcentage très élevé de valeur aberrante_flag = 1 dans M1_output_valeurs aberrantes.csv
    - La plupart des observations dans valeur aberrante_list.csv

    **Diagnostic:**
    Vos seuils sont peut-être trop sensibles pour le contexte de vos données.

    **Solutions:**

    1. Augmenter le seuil de MAD :

    ```r
    MADS <- 15  # Increase from default 10
    ```

    2. Augmenter le seuil de proportion :

    ```r
    valeur aberrante_PROPORTION_THRESHOLD <- 0.9  # Increase from 0.8
    ```

    3. Augmenter le seuil de comptage minimum (se concentrer sur les grandes installations) :

    ```r
    MINIMUM_COUNT_THRESHOLD <- 200  # Increase from 100
    ```

    4. Examiner les données : Vérifier s'il existe de véritables problèmes de qualité nécessitant un nettoyage des données plutôt qu'un ajustement des paramètres

? ?? "Problème : aucun résultat de l'AQD n'a été généré

    **Symptômes:**
    - M1_output_dqa.csv est vide ou ne contient que des en-têtes
    - Message de la console : "Sauter l'analyse CQD - aucun des indicateurs requis n'a été trouvé"

    **Diagnostic:**
    Aucun des indicateurs spécifiés dans `DQA_indicateurS` n'existe dans votre jeu de données.

    **Solution:**
    Vérifiez quels indicateurs de l'AQD sont manquants :

    ```r
    # Load data
    data <- read.csv("SIGS_[COUNTRY].csv")

    # Check which DQA indicateurs are missing
    available_indicateurs <- unique(data$indicateur_common_id)
    missing_indicateurs <- setdiff(DQA_indicateurS, available_indicateurs)
    print(paste("Missing DQA indicateurs:", paste(missing_indicateurs, collapse=", ")))

    # Available DQA indicateurs
    available_dqa <- intersect(DQA_indicateurS, available_indicateurs)
    print(paste("Available DQA indicateurs:", paste(available_dqa, collapse=", ")))
    ```

    Puis mettez à jour `DQA_indicateurS` pour n'inclure que les indicateurs disponibles :

    ```r
    DQA_indicateurS <- c("Penta1", "CPN1")  # Only use what's available
    ```

? ?? "Problème : les ratios de cohérence semblent incorrects

    **Symptômes:**
    - Tous les indicateurs de cohérence sont à 0 (incohérent)
    - Les taux de cohérence sont étonnamment élevés ou bas

    **Diagnostic:**
    Le niveau d'agrégation géographique n'est peut-être pas adapté à vos données.

    **Investigation:**

    cODE_BLOCK_29__

    **Solutions:**

    1. Si les zones géographiques ont très peu d'installations (1-2), utiliser le niveau supérieur :

    ```r
    GEOLEVEL <- "admin_area_2"  # Use district instead of sub-district
    ```

    2. Si les ratios sont généralement inférieurs à 0,95 pour les paires CPN/Penta, cela peut indiquer de véritables problèmes programmatiques (taux d'abandon élevé) plutôt que des problèmes de qualité des données

    3. Examinez les fourchettes de référence de cohérence - elles peuvent nécessiter un ajustement à votre contexte :

    ```r
    # Example: Allow higher dropout (lower ratio) for Penta
    all_consistency_ranges$pair_Penta <- c(lower = 0.85, upper = Inf)
    ```

? ?? "Problème : les pourcentages d'exhaustivité semblent faibles

    **Symptômes:**
    - Proportion élevée de complétude_flag = 0 dans M1_output_complétude.csv

    **Diagnostic:**
    Il peut s'agir d'un problème légitime (mauvais rapport) ou d'un artefact lié à la façon dont votre DHIS2 stocke les valeurs nulles.

    **Investigation:**

    cODE_BLOCK_32__

    **Considérations:**
    1. Si votre DHIS2 ne stocke pas les zéros, les établissements à faible volume peuvent apparaître incomplets alors qu'ils n'avaient légitimement pas de services à déclarer
    2. Les pourcentages d'exhaustivité doivent être interprétés dans leur contexte - un taux d'exhaustivité de 70 % peut être acceptable en fonction du système de santé
    3. Utiliser le drapeau complétude_flag dans les modules suivants pour pondérer les estimations de manière appropriée

? ?? "Problème : erreur de lecture du fichier d'entrée

    **Symptômes:**
    - Erreur : "Impossible d'ouvrir le fichier 'SIGS_[COUNTRY].csv'"
    - Le module se bloque pendant le chargement des données

    **Solutions:**

    1. Vérifier le chemin d'accès au fichier et le répertoire de travail :

    ```r
    getwd()  # Verify working directory
    list.files()  # Check if SIGS file is present
    ```

    2. Vérifier que le nom du fichier correspond au paramètre `PROJECT_DATA_SIGS`

    3. Vérifier le format du fichier (CSV, encodage correct, séparé par des virgules)

    4. S'assurer que les colonnes requises existent :

    ```r
    # After loading
    names(data)  # Should include: établissement_id, period_id, indicateur_common_id, count
    ```

### Notes d'utilisation

? ?? "Gestion des types de données"

    **period_id Flexibilité:**
    Le module accepte `period_id` dans plusieurs formats :
    - Entier : `202401`
    - Chaîne : `"202401"`
    - Numérique : `202401.0`

    Tous les formats sont convertis en interne en objets Date afin de respecter l'ordre chronologique :

    ```r
    # Internal conversion
    as.Date(sprintf("%04d-%02d-01", year, month))
    ```

    Cela permet de garantir un ordre temporel correct, même en cas d'interruption des périodes de déclaration.

    **Valeurs de comptage:**
    - Valeurs numériques requises (entiers ou décimales)
    - Les dénombrements nuls doivent être explicites `0`, et non `NA`
    - Les dénombrements manquants sont représentés par des `NA` ou des lignes manquantes

    **Colonnes géographiques:**
    - Type de caractère recommandé
    - Peut contenir des espaces et des caractères spéciaux
    - Sensible à la casse dans certaines opérations

? ?? "Stratégie des valeurs manquantes

    Le module utilise des approches spécifiques au contexte pour les valeurs manquantes :

    **Analyse des valeurs aberrantes:**
    - Les valeurs NA sont exclues des calculs de la médiane/MAD
    - Seules les valeurs non NA contribuent aux statistiques
    - Évite les biais dus à la rareté des données

    **Complétude:**
    - La mention explicite NA dans la colonne des effectifs indique que les données n'ont pas été déclarées
    - Indicateur de complétude = 0 (incomplet)
    - Distinction avec les périodes inactives (drapeau = 2, supprimé)

    **Cohérence:**
    - Les ratios NA (issus de la division par zéro) sont conservés en tant que NA et ne sont pas convertis en 0
    - Les paires NA sont exclues du dénominateur de l'évaluation de la cohérence
    - Évite de pénaliser les établissements pour des indicateurs non disponibles

    **Notation de l'AQD:**
    - Paires de cohérence NA exclues du dénominateur
    - Seules les paires disponibles affectent le score de cohérence
    - Permet une notation partielle lorsque certains indicateurs sont manquants

? ?? "Considérations sur la mémoire

    Pour les grands ensembles de données (>1 million de lignes), le module met en œuvre plusieurs optimisations :

    **data.table Utilisation:**
    - Le traitement de complétude utilise `data.table` pour les opérations in-place
    - Beaucoup plus rapide et plus efficace en termes de mémoire que `dplyr` pour les données volumineuses

    **Stratégie de filtrage
    - Filtre les indicateurs pertinents avant les opérations coûteuses
    - Réduit l'empreinte mémoire pendant les calculs

    **Gestion des objets:**
    - Supprime les objets intermédiaires après utilisation
    - Empêche l'accumulation de mémoire pendant le traitement séquentiel

    **Recommandations pour les grands ensembles de données:**
    - Allouer au moins 8 Go de RAM pour les pays comptant plus de 1 000 établissements
    - Envisager un traitement par année si les ensembles de données pluriannuels posent des problèmes de mémoire
    - Surveillez l'utilisation de la mémoire : `pryr::mem_used()` à différentes étapes

? ?? "Opportunités d'optimisation des performCPNes"

    **Mise en œuvre actuelle:**
    L'analyse de complétude traite les indicateurs séquentiellement en utilisant `lapply()`.

    **Amélioration potentielle:**
    Pour les ensembles de données comportant de nombreux indicateurs, la parallélisation pourrait améliorer les performCPNes :

    ```r
    # Future enhCPNement (not in current code)
    library(parallel)

    # Detect available cores
    n_cores <- detectCores() - 1

    # Parallel processing of indicateurs
    complétude_list <- mclapply(
      unique(valeur aberrante_data_main$indicateur_common_id),
      function(ind) generate_full_series_per_indicateur(
        valeur aberrante_data = valeur aberrante_data_main,
        indicateur_id = ind,
        timeframe = indicateur_timeframe
      ),
      mc.cores = n_cores
    )

    # Combine results
    complétude_data <- rbindlist(complétude_list)
    ```

    **Accélération attendue:**
    - 3-4x plus rapide avec 4 cœurs sur des ensembles de données avec 10+ indicateurs
    - Plus avantageux pour les pays avec de nombreux indicateurs et de longues séries temporelles

? ?? "Sélection dynamique d'indicateurs

    Le module s'adapte intelligemment aux données disponibles :

    **Sélection de l'indicateur de livraison:**

    cODE_BLOCK_37__

    **Validation de l'indicateur AQD:**

    ```r
    # Only use DQA indicateurs that exist in the dataset
    dqa_indicateurs_to_use <- intersect(DQA_indicateurS, unique(data$indicateur_common_id))

    # If none found, skip DQA analysis with informative message
    if (length(dqa_indicateurs_to_use) == 0) {
      print("Skipping DQA analysis - none of the required indicateurs found")
    }
    ```

    **Validation des paires de cohérence:**
    Le module vérifie chaque paire de cohérence et supprime celles qui ont des indicateurs manquants, en fournissant des avertissements clairs sur les paires qui ont été ignorées.

? ?? "Gestion des erreurs et solutions de repli"

    Le module inclut une gestion robuste des erreurs :

    **Paires de cohérence manquantes:**
    - S'il n'existe pas de paires valides, l'analyse de cohérence est ignorée
    - Utilise `dqa_without_consistency()` pour la notation
    - Produit des fichiers fictifs avec les en-têtes appropriés

    **Niveaux géographiques manquants:**
    - Se rabat sur le plus bas niveau d'administration disponible si le `GEOLEVEL` spécifié n'est pas trouvé
    - Emet un avertissement à propos de la solution de repli

    **Résultats vides:**
    - Crée des fichiers CSV avec les en-têtes appropriés même s'il n'y a pas de données
    - Assure que les processus en aval ne sont pas interrompus

    **Indicateurs manquants:**
    - Valide toutes les exigences en matière d'indicateurs avant l'analyse
    - Avertit des paires supprimées
    - Continue avec les indicateurs disponibles

? ?? "Directives d'interprétation

    **valeur aberrante flags:**
    - valeur aberrante_flag = 1 suggère des problèmes potentiels de qualité des données, mais nécessite une investigation
    - Toutes les valeurs aberrantes signalées ne sont pas des erreurs (de véritables campagnes de services peuvent déclencher des drapeaux)
    - Utiliser les valeurs mad_residual et pc pour prioriser l'examen

    **Complétude:**
    - Le pourcentage d'exhaustivité varie selon le contexte du système de santé
    - 80-90%+ est généralement bon, mais dépend du pays
    - L'évolution dans le temps est plus instructive que le pourcentage absolu
    - Un faible taux d'exhaustivité pour des indicateurs spécifiques peut refléter de véritables lacunes dans les services

    **Cohérence:**
    - la cohérence = 0 peut indiquer des problèmes de qualité des données OU des problèmes de performCPNe programmatique (par exemple, un taux d'abandon élevé)
    - L'interprétation nécessite des connaissCPNes programmatiques
    - Les schémas géographiques peuvent aider à distinguer les problèmes systématiques des erreurs aléatoires

    **Scores AQD:**
    - dqa_score = 1 indique que les données ont passé toutes les vérifications, et qu'elles peuvent être utilisées sans ajustement
    - dqa_score = 0 nécessite un examen plus approfondi
    - dqa_mean fournit une vision nuCPNée (0,75 = plutôt bon, 0,25 = plutôt mauvais)

### Résumé des mesures de qualité des données

| Métrique | Type | Intervalle | Interprétation
|-------------------------------|-------------|------------|---------------------------------------------------------------------------|
| valeur aberrante_flag | Binaire | 0 ou 1 | 1 = Valeur aberrante détectée par l'une ou l'autre des méthodes (MAD ou proportionnelle) ET compte > 100
| valeur aberrante_mad | Binaire | 0 ou 1 | 1 = Valeur aberrante statistique (basée sur la valeur MAD) |
| valeur aberrante_pc | Binaire | 0 ou 1 | 1 = Valeur aberrante proportionnelle (>80% du volume annuel) | mad_residual | Continu | 0 ou 1 | 1 = Valeur aberrante proportionnelle (>80% du volume annuel) | mad_residual
| mad_residual | Continu | 0 à ∞ | Ecart standardisé par rapport à la médiane (plus élevé = plus extrême) |
| pc | Continu | 0 à 1 | Proportion du volume annuel (plus proche de 1 = plus concentré) |
| Complétude_flag | Catégorique | 0, 1, 2 | 0=Incomplet (manquant), 1=Complet (rapporté), 2=Inactif (supprimé) |
| Cohérence - Binaire - 0, 1, NA - 1=Constante (réussit le test), 0=Incohérente, NA=Impossible à calculer - 1=Consistante (réussit le test)
| Rapport de cohérence | Continu | 0 à ∞ | Rapport d'indicateurs appariés (l'interprétation dépend de l'appairage) |
| Score de complétude et de valeurs aberrantes - Continu - 0 à 1 - Proportion d'indicateurs CQD passant les contrôles de complétude et de valeurs aberrantes - Continu - 0 à 1
| Score de cohérence - Continu - 0 à 1 - Proportion de paires de cohérence passant les tests de référence
dqa_mean | Continu | 0 à 1 | Moyenne des scores des composants (mesure globale de la qualité) | dqa_score | Continu | 0 à 1 | Moyenne des scores des composants (mesure globale de la qualité)
| dqa_score | Binaire | 0 ou 1 | 1 = Toutes les vérifications sont réussies (complètes, pas de valeurs aberrantes, cohérentes) ; 0 = toutes les vérifications ont échoué


### Flux de travail d'exécution

Le module suit la séquence suivante :

```
1. DATA LOADING & PREPROCESSING
   ├─ Load SIGS CSV file
   ├─ Convert period_id to dates
   ├─ Detect geographic columns
   └─ Create composite malaria indicateur (if applicable)

2. CONFIGURATION & VALIDATION
   ├─ Detect available indicateurs
   ├─ Dynamically select delivery indicateur (delivery vs sba)
   ├─ Build consistency pairs based on available indicateurs
   ├─ Validate consistency pairs
   └─ Filter DQA indicateurs to available ones

3. valeur aberrante ANALYSIS
   ├─ Calculate median and MAD by établissement-indicateur
   ├─ Flag MAD-based valeurs aberrantes (>10 MADs from median)
   ├─ Flag proportion-based valeurs aberrantes (>80% of annual volume)
   └─ Combine flags (either method + count > 100)

4. complétude ANALYSIS
   ├─ Identify reporting timeframe per indicateur
   ├─ Generate full time series (all facilities × all months)
   ├─ Tag reporting status (complete/incomplete/inactive)
   └─ Remove inactive periods (6+ months before first/after last report)

5. CONSISTENCY ANALYSIS (if applicable)
   ├─ Exclude valeurs aberrantes from data
   ├─ Aggregate to geographic level (e.g., district)
   ├─ Calculate ratios for indicateur pairs
   ├─ Flag consistency based on predefined ranges
   ├─ Expand geo-level results to facilities
   └─ Pivot to wide format (one column per pair)

6. DQA SCORING
   ├─ Filter to DQA indicateurs only
   ├─ Merge complétude, valeur aberrante, and consistency results
   ├─ Calculate component scores:
   │  ├─ complétude-valeur aberrante score (0-1)
   │  └─ Consistency score (0-1, if applicable)
   ├─ Calculate mean DQA score
   └─ Assign binary DQA pass/fail flag

7. EXPORT RESULTS
   ├─ M1_output_valeur aberrante_list.csv (valeurs aberrantes only)
   ├─ M1_output_valeurs aberrantes.csv (all records with flags)
   ├─ M1_output_complétude.csv (complétude flags)
   ├─ M1_output_consistency_geo.csv (geo-level consistency)
   ├─ M1_output_consistency_établissement.csv (établissement-level consistency)
   └─ M1_output_dqa.csv (final DQA scores)
```

---

**Dernière mise à jour** : 17-01-2026
**Contact** : Équipe du projet FASTR

---

<!--
////////////////////////////////////////////////////////////////////
// //
// _____ _ _____ ____ _____ ____ ___ _ _ _____ _ _ //

// | (___ | | | | | | | | |__ | | | | | | \| | | | | \| |//
// \___ \| | | | | | | | __| | | | | | | . . ` | | | | . ` |/
// ____) | |___ _| |_| |_| | |____ | |__| |_| | |\ | | | | |\ |//
// |_____/|_____|_____|____/|______| \____\___/|_| \_| |_| |_| \_|//
// //
// Modifiez les diapositives de l'atelier en dessous de cette ligne //
// //
////////////////////////////////////////////////////////////////////
-->

<!-- SLIDE:m4_0 -->
## Pipeline analytique FASTR

![Pipeline analytique h:390](resources/diagrams/analytical_pipeline.svg)

L'analyse FASTR suit un processus séquentiel où chaque étape s'appuie sur la précédente :

1. **Évaluer la qualité des données** - Identifier les problèmes d'exhaustivité, de valeurs aberrantes et de cohérence
2. **Ajuster les problèmes de qualité** - Appliquer des corrections pour améliorer la fiabilité des données
3. **Analyser les données ajustées** - Générer des estimations sur l'utilisation et la couverture des services
<!-- /SLIDE -->

<!-- SLIDE:m4_1 -->
## Évaluation de la qualité des données - module 1

Évaluer la fiabilité des données des systèmes d'information sanitaire de routine

---
## Raison d'être de l'évaluation de la qualité des données

**Défi:** Les données de routine des établissements de santé peuvent présenter des limites de qualité :
- Les valeurs rapportées peuvent se situer en dehors des fourchettes plausibles
- Les lacunes dans les rapports affectent l'exhaustivité des données
- Il existe des incohérences entre les indicateurs connexes

**Conséquences:** Les limites de la qualité des données affectent la prise de décision
- Évaluations inexactes des tendCPNes en matière de prestation de services
- Mauvaise identification des domaines nécessitant une intervention
- Affectation sous-optimale des ressources

---

## Objectifs de l'évaluation de la qualité des données

**Objectif 1 : Permettre l'ajustement analytique**

L'évaluation systématique de la qualité des données permet d'appliquer des ajustements ciblés, améliorant ainsi l'utilité des données du système d'information sur les ménages pour la prise de décision fondée sur des données probantes.

**Objectif 2 : surveiller les tendCPNes en matière de qualité des données

L'évaluation de la qualité des données permet un suivi continu pour :
- D'éclairer la sélection des indicateurs sur la base des profils de qualité dans l'ensemble du système d'information sur les ménages
- Orienter les interventions ciblées sur la qualité des données et la supervision de soutien dans les domaines où la qualité des données est plus faible
- Évaluer l'efficacité des initiatives d'amélioration de la qualité des données au fil du temps

---
## Dimensions essentielles de la qualité des données

**1. Exhaustivité**
Les établissements de santé soumettent-ils des rapports de manière cohérente ?

**2. Prévalence des valeurs aberrantes**
Les valeurs rapportées se situent-elles dans des fourchettes plausibles ?

**3. Cohérence interne**
Les indicateurs connexes présentent-ils les relations attendues ?

Ces trois dimensions permettent une évaluation complète de la fiabilité des données à des fins d'analyse.
<!-- /SLIDE -->

<!-- SLIDE:m4_2 -->
## Exhaustivité de l'indicateur

<div style="display : flex ; gap : 1.5em ; align-items : flex-start ;">
<div style="flex : 1 ;">

**Ce qui est mesuré:** La mesure dans laquelle les établissements rapportent des données sur des indicateurs de base sélectionnés

**Pourquoi c'est important:**
- Une plus grande exhaustivité améliore la fiabilité des données
- La stabilité dans le temps renforce l'analyse des tendCPNes

**Distinction clé:**
Complétude de l'indicateur ≠ Complétude du rapport. Cette mesure examine des éléments de données spécifiques, et pas seulement la question de savoir si le formulaire mensuel a été soumis.

</div>
<div style="flex : 2 ;">

![Illustration de la complétude](../resources/diagrammes/complétude_illustration.svg)

</div>
</div>

---

## Définition de l'exhaustivité de l'indicateur

Pour l'analyse FASTR, la complétude est définie comme suit :

**le pourcentage d'établissements ayant fait une déclaration chaque mois par rapport au nombre total d'établissements censés faire une déclaration**

- Une installation est considérée comme "déclarante" si une valeur non manquante et non nulle est enregistrée pour l'indicateur et le mois
- Une installation est censée être déclarée si elle a déclaré un volume quelconque pour cet indicateur à tout moment au cours de l'année
- Les installations qui ne déclarent pas pendant six mois consécutifs ou plus au début ou à la fin de leur période de déclaration sont classées comme **inactives** plutôt qu'incomplètes. Cela permet de ne pas pénaliser les installations qui n'ont pas encore commencé à déclarer ou qui ont définitivement cessé leurs activités

---

## Notes sur l'exhaustivité

- Un niveau élevé d'exhaustivité n'indique pas nécessairement que le SIGS est représentatif de l'ensemble des services fournis dans le pays, étant donné que certains services peuvent ne pas être fournis dans les établissements, ou que certains établissements peuvent ne pas rendre compte de leurs activités

- Pour les pays où le système DHIS2 ne stocke pas les 0, l'exhaustivité des indicateurs peut être sous-estimée s'il y a beaucoup d'établissements à faible volume pour un indicateur donné


---

## Complétude : Pourcentage de valeurs mensuelles complètes

<p style="font-size : 0.9em ; margin-bottom : 0.5rem ;">Pour un indicateur donné dans une période donnée, le pourcentage de valeurs mensuelles qui sont complètes:</p>

<p style="font-size : 0.9em ;"><strong>% complet = # valeurs mensuelles complètes / N total de valeurs mensuelles</strong></p><p>

![Indicateur de complétude h:340](resources/default_outputs/Default_2._Proportion_of_completed_records.png)
<!-- /SLIDE -->

<!-- SLIDE:m4_3 -->
## Valeurs aberrantes

La présence de valeurs aberrantes permet de déterminer si un point de données d'une série de valeurs est extrême (anormalement élevé ou bas) par rapport aux autres points de la série.

Les valeurs aberrantes peuvent être le résultat de changements dans les activités programmatiques (comme une campagne intensifiée) ou peuvent être des problèmes de qualité des données.

Pour l'analyse FASTR, nous identifions les valeurs aberrantes qui sont des valeurs anormalement élevées par rapport au volume habituel de services déclarés par l'établissement (par exemple, les valeurs faibles ne sont pas identifiées comme des valeurs aberrantes dans l'analyse FASTR).

---

## Illustration de la valeur aberrante

La région A présente un pic anormal en février qui dépasse largement les valeurs déclarées par les autres régions - ce qui indique une erreur de saisie des données ou un problème de déclaration.

![Impact des valeurs aberrantes](resources/diagrams/valeur aberrante_impact.svg)

---

## Méthodologie de détection des valeurs aberrantes

Les valeurs aberrantes sont identifiées en évaluant la variation au sein de l'établissement des rapports mensuels pour chaque indicateur.

Une valeur aberrante est définie comme suit

Une valeur supérieure à **10 fois l'écart absolu médian (EAM)** par rapport à la valeur médiane mensuelle de l'indicateur pour chaque période, **OU** une valeur pour laquelle la contribution proportionnelle en volume pour un établissement, un indicateur et une période est **supérieure à 80 %**

**ET** pour laquelle :

- Le volume est **supérieur ou égal à la médiane**
- Le volume est **non manquant**
- Le volume est **supérieur à 100**

---

## Valeurs aberrantes : Pourcentage des valeurs mensuelles qui sont aberrantes

Pour un indicateur donné dans une période donnée, le pourcentage de valeurs mensuelles qui sont aberrantes :

**% de valeurs aberrantes = # de valeurs mensuelles aberrantes / N total de valeurs mensuelles**

!valeurs aberrantes h:340](resources/default_outputs/Default_1._Proportion_of_valeurs aberrantes.png)
<!-- /SLIDE -->

<!-- SLIDE:m4_4 -->
## Cohérence entre les indicateurs connexes

Les indicateurs du programme ayant une relation prévisible sont examinés afin de déterminer si la relation attendue existe entre eux. En d'autres termes, ce processus permet de déterminer si la relation observée entre les indicateurs, telle qu'elle apparaît dans les données rapportées, est celle qui est attendue.

---

## Paires d'indicateurs évaluées

<div class="columns">
<div>

| Paire d'indicateurs - Relation attendue - Relation attendue - Relation attendue - Relation attendue
|----------------|----------------------|
| CPN1 / CPN4 | Le rapport doit être ≥ 0,95
| Penta1 / Penta3 | Le rapport devrait être ≥ 0,95 |
| BCG / accouchement en milieu hospitalier : dans les 30 % (≥0,7 et ≤1,3)

Ces paires ont des relations attendues. Nous nous attendons à ce que CPN1 > CPN4 puisque toutes les femmes n'effectuent pas quatre visites.

Le BCG est un vaccin administré à la naissCPNe, nous nous attendons donc à ce que le nombre d'accouchements en établissement soit similaire, avec une tolérCPNe de 30 % pour la variabilité.

</div>
<div>

![Illustration de cohérence h:280](../resources/diagrammes/consistency_illustration.svg)

</div>
</div>

---

## Pourquoi évaluer la cohérence au niveau du district ?

<div style="display : flex ; gap : 1.5em ; align-items : flex-start ;">
<div style="flex : 1 ;">

Les patients ont souvent accès à différents services dans différents établissements d'un même district :

- Une femme peut recevoir **CPN1** dans un poste de santé voisin, mais se rendre dans un centre de santé pour **CPN4**
- Un enfant peut recevoir **Penta1** dans un dispensaire local, mais terminer **Penta3** dans un hôpital de district

La vérification de la cohérence au niveau de l'établissement de santé ne tiendrait pas compte de ces schémas. L'agrégation au niveau du district permet d'obtenir une image complète de l'utilisation des services dans une zone géographique.

</div>
<div style="flex : 2 ;">

![Cohérence des districts](resources/diagrams/district_consistency.svg)

</div>
</div>

---

## Cohérence interne : Sortie FASTR

![Cohérence interne h:420](resources/default_outputs/Default_4._Proportion_of_sub-national_areas_meeting_consistency_criteria.png)
<!-- /SLIDE -->

<!-- SLIDE:m4_5 -->
## Résumé de la qualité des données

Une mesure composite de la qualité des données donne une vue d'ensemble de la manière dont un ensemble de données répond aux normes de qualité.

En intégrant plusieurs dimensions de la qualité des données dans un score unique, elle simplifie l'interprétation des informations détaillées provenant de plusieurs mesures. Les systèmes de santé peuvent ainsi évaluer rapidement la fiabilité des données, ce qui facilite l'identification des tendCPNes et des problèmes en un coup d'œil.

---

## Définition d'une qualité de données adéquate

Pour l'analyse FASTR, nous avons défini la qualité adéquate des données comme suit :

- Pas de données manquantes pour les indicateurs OPD, Penta1 et CPN1, si disponibles, **ET**
- Pas de données aberrantes pour OPD, Penta1 et CPN1, lorsqu'elles sont disponibles, **ET**
- Rapports cohérents entre Penta1/Penta3 et CPN1/CPN4

---

## Score global du CQD : Pourcentage de valeurs mensuelles répondant à tous les critères

Pour un indicateur donné et une période donnée, le pourcentage de valeurs mensuelles répondant à tous les critères du CQD :

**% de qualité adéquate = # de valeurs mensuelles répondant à tous les critères / N total de valeurs mensuelles**

![Score AQD global h:340](resources/default_outputs/Default_5._Overall_DQA_score.png)

---

## Score moyen de l'AQD : Dans quelle mesure sommes-nous proches d'une qualité adéquate ?

Le score moyen de l'AQD indique dans quelle mesure les données d'un établissement répondent à tous les critères de qualité. Un score de **100% signifie que les données passent** tous les contrôles du CQD - pas de valeurs manquantes, pas de valeurs aberrantes et des rapports cohérents.

**AQD moyen = (score d'exhaustivité et de valeurs aberrantes + score de cohérence) / 2**


![Score AQD moyen h:320](resources/default_outputs/Default_6._Mean_DQA_score.png)
<!-- /SLIDE -->

<!-- SLIDE:m4_6 -->
## module AQD : Paramètres de configuration

| Paramètre | Description |
|-----------|-------------|
| Seuil de proportion pour la détection des valeurs aberrantes** | Ajuste le seuil de contribution proportionnelle pour signaler un mois d'installation comme aberrant
| Seuil de comptage minimum pour la prise en compte** | Définit le comptage minimum requis pour qu'un mois d'installation soit considéré comme une valeur aberrante
| Les valeurs aberrantes sont définies comme des observations qui sont supérieures à X fois l'écart absolu médian (EAM) par rapport à la valeur médiane mensuelle de l'indicateur pour chaque période de temps
**Indicateurs soumis à l'AQD** | Définit quels indicateurs sont inclus pour l'évaluation des valeurs aberrantes et de l'exhaustivité pour l'inclusion dans le score de l'AQD
| **Paires de cohérence utilisées** | Définit les paires d'indicateurs utilisées pour l'analyse de cohérence et les fourchettes de ratios attendues
<!-- /SLIDE -->

