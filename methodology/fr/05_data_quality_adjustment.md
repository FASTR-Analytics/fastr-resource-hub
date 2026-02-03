<!-- AUTO-TRANSLATED from 05_data_quality_adjustment.md -->
<!-- Add REVIEWED marker after human review to protect from overwrite -->

# Ajustement de la qualité des données

## Contexte et objectif

### Objectif du module

Le module d'ajustement de la qualité des données s'attaque à deux limitations courantes des données de routine des établissements de santé : les valeurs extrêmes résultant d'erreurs de déclaration ou de saisie des données (**valeurs aberrantes**) et les lacunes résultant d'une déclaration incomplète (**données manquantes**). Plutôt que d'exclure les observations concernées, le module remplace ces valeurs par des estimations statistiquement dérivées, fondées sur les modèles de déclaration historiques de chaque établissement.

Le processus d'ajustement applique des méthodes de lissage des séries temporelles qui s'appuient sur les tendances et la saisonnalité observées dans les données au niveau de l'établissement. Les moyennes mobiles et les profils historiques spécifiques à l'établissement sont utilisés pour corriger les valeurs anormales tout en préservant les modèles de prestation de services sous-jacents.

Pour favoriser la transparence et la flexibilité analytique, le module génère quatre ensembles de données parallèles : données non ajustées, données avec corrections des valeurs aberrantes uniquement, données avec imputation des valeurs manquantes uniquement, et données avec les deux ajustements appliqués. Cela permet aux utilisateurs d'évaluer la sensibilité des résultats aux différentes hypothèses de qualité des données et de sélectionner l'ensemble de données le plus approprié à leur objectif analytique.

### Raison d'être de l'analyse

Les données du système d'information sur la gestion de la santé (SIGS) contiennent souvent des erreurs de déclaration et des lacunes qui peuvent fausser les tendances observées et masquer les schémas sous-jacents de la prestation de services. Les valeurs extrêmes peuvent créer des pics artificiels dans les volumes de services, tandis que les rapports incomplets peuvent entraîner des baisses apparentes qui reflètent des problèmes de qualité des données plutôt que de véritables changements dans la prestation de services. Ces limites sont particulièrement importantes lorsque les données SIGS sont utilisées pour le suivi des performances, la comparaison entre les unités géographiques ou l'analyse des tendances.

En traitant systématiquement les valeurs aberrantes et les données manquantes avant l'analyse, ce module améliore la cohérence et l'interprétabilité des données SIGS. Cela permet de s'assurer que les résultats analytiques ultérieurs sont basés sur des modèles de prestation de services observés plutôt que sur des artefacts introduits par la variabilité des rapports ou les contraintes liées à la qualité des données.

### Points clés

| Composante | Détails |
|-----------|---------|
| **Entrées** | Données brutes du SIGS (`hmis_ISO3.csv`)<br>Indicateurs de valeurs aberrantes du module 1 (`M1_output_outliers.csv`)<br>Indicateurs d'exhaustivité du module 1 (`M1_output_completeness.csv`) |
| **Sorties** | Données ajustées au niveau de l'établissement (`M2_adjusted_data.csv`)<br>Données agrégées sous-nationales (`M2_adjusted_data_admin_area.csv`)<br>Données agrégées nationales (`M2_adjusted_data_national.csv`)<br>Métadonnées d'exclusion (`M2_low_volume_exclusions.csv`) |
| **Objectif** | Remplacer les valeurs aberrantes et compléter les données manquantes à l'aide de modèles historiques spécifiques à l'établissement ; quatre scénarios d'ajustement sont produits (aucun, valeurs aberrantes uniquement, exhaustivité uniquement, les deux) |

---

## Flux de travail analytique

### Aperçu des étapes analytiques

Le module applique un processus standardisé en plusieurs étapes pour ajuster les données de routine des établissements de santé tout en préservant les modèles de prestation de services sous-jacents :

**Étape 1 : Chargement et préparation des données**
Le module intègre trois entrées : les volumes de services déclarés au niveau de l'établissement, les indicateurs de valeurs aberrantes identifiant les valeurs anormales (du module 1) et les indicateurs de complétude indiquant les mois pour lesquels la déclaration est incomplète (du module 1). Les indicateurs pour lesquels l'ajustement n'est pas approprié (tels que les mesures liées à la mortalité) sont identifiés et exclus des étapes d'ajustement ultérieures.

**Étape 2 : Identifier les indicateurs à faible volume**
Avant d'appliquer tout ajustement, chaque indicateur est évalué afin de déterminer s'il présente une variation suffisante. Les indicateurs qui ne dépassent jamais 100 événements déclarés au cours d'un mois donné sur l'ensemble de la série chronologique sont signalés et exclus de l'ajustement, car les méthodes statistiques ne sont pas significatives pour les indicateurs à faible volume constant.

**Étape 3 : Ajuster les valeurs aberrantes**
Pour les observations signalées comme aberrantes, le module estime les valeurs de remplacement en se basant sur les modèles historiques de déclaration de l'établissement. Un ensemble hiérarchique de méthodes est appliqué séquentiellement :

- Moyenne mobile centrée sur six mois (trois mois avant et trois mois après)

- Moyenne roulante sur six mois (trois mois avant et trois mois après)

- Moyenne mobile rétrospective sur six mois

- Même mois civil de l'année précédente

- Moyenne historique spécifique à l'établissement

**Étape 4 : Remplir les données manquantes et incomplètes**
Pour les mois identifiés comme manquants ou incomplets, les valeurs sont imputées en utilisant le même cadre de moyenne mobile que celui appliqué à l'ajustement des valeurs aberrantes. Cette approche permet d'éviter les chutes artificielles à zéro causées par des lacunes temporaires dans les rapports, tout en maintenant la cohérence avec les tendances spécifiques à l'établissement.

**Étape 5 : Créer plusieurs scénarios**
Pour favoriser la transparence et l'analyse de sensibilité, le module produit quatre ensembles de données parallèles :

- Données non ajustées (valeurs déclarées originales)

- Données avec ajustement des valeurs aberrantes uniquement

- Données avec ajustements pour les données manquantes ou incomplètes uniquement

- Données faisant l'objet d'ajustements pour les données aberrantes et les données incomplètes

**Étape 6 : Agrégation au niveau géographique**
Après ajustement, les données au niveau de l'établissement sont agrégées aux niveaux sous-national et national. Tous les scénarios d'ajustement sont conservés à chaque niveau géographique, ce qui permet une analyse à différentes échelles administratives.

**Étape 7 : Exportation des résultats**
Le module génère des fichiers de sortie structurés pour les ensembles de données au niveau de l'établissement, au niveau infranational et au niveau national, ainsi qu'un fichier de métadonnées documentant les indicateurs exclus de l'ajustement et les raisons de leur exclusion.

### Diagramme de flux de travail

<iframe src="../../resources/diagrams/mod2_workflow_FR.html" width="100%" height="800" style="border : 1px solid #ccc ; border-radius : 4px ;" title="module 2 Interactive Workflow"></iframe>

### Points de décision clés

**Identification des valeurs sujettes à ajustement**

Le module applique des ajustements à deux catégories d'observations :

- Les valeurs signalées comme aberrantes par les procédures de détection statistique mises en œuvre dans le module 1
- Les valeurs correspondant aux mois identifiés comme incomplets ou manquants en raison de lacunes dans les déclarations

Certains indicateurs sont explicitement exclus de l'ajustement :

- Les indicateurs liés à la mortalité (y compris les décès d'enfants de moins de cinq ans, les décès maternels et les décès néonatals), car ils représentent des événements discrets pour lesquels le lissage ou l'imputation ne sont pas appropriés
- Les indicateurs de faible volume qui ne dépassent jamais 100 événements déclarés au cours d'un mois donné, pour lesquels l'ajustement statistique n'est pas significatif

**Sélection du scénario d'ajustement**

Le module génère quatre scénarios d'ajustement pour tenir compte des différents contextes analytiques et des conditions de qualité des données :

- **Pas d'ajustement** : Pas d'ajustement** : conserve les valeurs déclarées et convient aux exercices de validation ou aux contextes dans lesquels la qualité des données est jugée élevée
- **Ajustement des valeurs extremes uniquement** : applique des corrections lorsque des valeurs extremes sont presentes mais que l'exhaustivite de la declaration est par ailleurs stable
- **Ajustement de l'exhaustivite uniquement** : corrige les lacunes dans la declaration tout en preservant les valeurs declarees dans les periodes ou les donnees sont completes
- **Ajustement des valeurs aberrantes et de l'exhaustivite** : applique les deux corrections lorsque des limitations de la qualite des donnees sont presentes dans les deux dimensions

### Traitement des données et résultats

**Structure d'entree**
Le module recoit les volumes de services mensuels au niveau de l'établissement ainsi que les indicateurs de qualité des données générés dans le module 1, y compris les indicateurs de valeurs aberrantes et l'état d'exhaustivité. Chaque combinaison établissement-indicateur-mois est traitée comme une observation distincte en vue d'un ajustement potentiel.

**Application des ajustements**
Sur la base du scenario selectionne, des comptes de services ajustés sont générés. Les observations signalées comme aberrantes sont remplacées par des valeurs dérivées de moyennes historiques spécifiques à l'établissement, excluant les périodes anormales. Pour les mois où la déclaration est incomplète ou manquante, les valeurs sont imputées à l'aide de modèles historiques au niveau de l'établissement afin de maintenir la continuité de la série temporelle.

**Generation d'ensembles de donnees paralleles**
Quatre versions paralleles des comptes ajustes sont produites : les valeurs non ajustées, les valeurs ajustées pour les valeurs aberrantes, les valeurs ajustées pour l'exhaustivité et les valeurs avec les deux ajustements appliqués. Cette structure permet aux analyses en aval d'évaluer explicitement la sensibilité aux différentes hypothèses de qualité des données.

**Structure d'agrégation et de sortie**
Les données ajustées au niveau de l'établissement sont agrégées au niveau du district, au niveau sous-national et au niveau national, les quatre scénarios d'ajustement étant retenus. Chaque enregistrement de sortie comprend l'unité géographique, l'indicateur, la période de temps et les comptes de services correspondants pour chaque scénario, ce qui permet une analyse flexible des cas d'utilisation et des objectifs analytiques.

---
### Résultats de l'analyse et visualisation

L'analyse FASTR génère trois principaux résultats visuels comparant les volumes de services avant et après les ajustements :

**1. Impact de l'ajustement des valeurs aberrantes**

Heatmap montrant le pourcentage de changement dans le volume de service dû à l'ajustement des valeurs aberrantes, par indicateur et par zone géographique.

![Impact de l'ajustement des valeurs aberrantes](../resources/default_outputs/Default_1._Percent_change_in_volume_due_to_outlier_adjustment.png)

**2. Impact de l'ajustement de l'exhaustivité**

Heatmap montrant la variation en pourcentage du volume de services due à l'ajustement de l'exhaustivité (données manquantes), par indicateur et par zone géographique.

![Impact de l'ajustement de l'exhaustivité](../resources/default_outputs/Default_2._Percent_change_in_volume_due_to_completeness_adjustment.png)

**3. Impact de l'ajustement combiné**

Heatmap montrant le pourcentage de changement dans le volume de services lorsque les ajustements des valeurs aberrantes et de l'exhaustivité sont appliqués.

![Impact de l'ajustement combiné](../resources/default_outputs/Default_3._Percent_change_in_volume_due_to_both_outlier_and_completeness_adjustment.png)

**Guide d'interpretation**

Pour toutes les heatmaps :

- **Lignes** : Zones géographiques (zones/régions)
- **Colonnes** : Indicateurs de santé
- **Valeurs** : Pourcentage de variation du volume de services après ajustement

Pour la heatmap de l'ajustement des valeurs aberrantes (résultat 1) :

- **Valeurs négatives** : Les valeurs extrêmement élevées ont été remplacées par des estimations plus faibles
- Les valeurs proches de zéro indiquent que peu de valeurs aberrantes ont été détectées

Pour la heatmap des ajustements d'exhaustivité (résultat 2) :

- **Valeurs positives** : Les données manquantes ont été complétées, ce qui a permis d'augmenter le volume total
- Les valeurs proches de zéro indiquent que la déclaration était déjà complète

Pour la heatmap de l'ajustement combiné (résultat 3) :

- Montre l'effet net des deux ajustements
- Négatif = l'effet des valeurs aberrantes domine ; Positif = l'effet de l'exhaustivité domine

---

## Référence détaillée

### Paramètres de configuration

??? "Indicateurs exclus"

    Certains indicateurs sont exclus de tous les ajustements en raison de leur caractère sensible :

    ```r
    EXCLUDED_FROM_ADJUSTMENT <- c("u5_deaths", "maternal_deaths", "neonatal_deaths")
    ```

    **Justification** : Les comptes de décès ne doivent pas être lissés ou imputés car ils représentent des événements discrets qui peuvent présenter une véritable variation temporelle. Leur ajustement pourrait masquer d'importantes tendances épidémiologiques ou des signaux d'épidémies.

??? "Exclusions de faibles volumes"

    Les indicateurs sont également automatiquement exclus des **ajustements** s'ils n'ont aucune observation supérieure à 100 dans l'ensemble de la base de données. Cela permet d'éviter des ajustements statistiques inutiles sur des indicateurs dont le nombre d'observations est constamment faible.

    **Logique d'exclusion** :

    ```r
    volume_check <- raw_data[, .(
      above_100 = sum(count > 100, na.rm = TRUE),
      total = .N
    ), by = indicateur_common_id]

    no_outlier_adj <- volume_check[above_100 == 0, indicateur_common_id]
    ```

    Ces informations sont enregistrées dans `M2_low_volume_exclusions.csv` pour des raisons de transparence.

??? "Configuration de la fenêtre roulante"

    Le module utilise une fenêtre de **6 mois** pour toutes les moyennes glissantes. Ce choix permet d'équilibrer :

    **Avantages** :

    - Capture les tendances à moyen terme
    - Réduit l'impact des fluctuations à court terme
    - Suffisamment de points de données pour obtenir des moyennes stables
    - Fonctionne bien pour les indicateurs stables et saisonniers

    **Les compromis** :

    - Peut ne pas saisir les changements rapides dans la prestation de services
    - Risque de lissage excessif en cas de véritables changements programmatiques
    - Nécessite au moins 6 observations valides pour une moyenne centrée optimale

### Spécifications des entrées/sorties

??? "Fichiers d'entrée"

    Le module nécessite trois fichiers d'entrée provenant des étapes de traitement précédentes :

    | Le module a besoin de trois fichiers d'entrée provenant des étapes de traitement précédentes : Fichier, Source, Description et Variables clés
    |------|--------|-------------|---------------|
    | Les données brutes du système d'information sur les ménages (SIGS), les volumes de services au niveau de l'établissement, les volumes de services au niveau de l'établissement, les volumes de services au niveau de l'établissement, les volumes de services au niveau de l'établissement, les volumes de services au niveau de l'établissement, les volumes de services au niveau de l'établissement et les volumes de services au niveau de l'établissement, les volumes de services au niveau de l'établissement et les volumes de services au niveau de l'établissement
    | Les indicateurs de valeurs aberrantes pour chaque indicateur de mois d'installation sont les suivants : `établissement_id`, `indicateur_common_id`, `period_id`, `outlier_flag`, `indicateur_common_id`, `period_id`, `outlier_flag`
    | module 1 - Indicateurs d'exhaustivité pour chaque indicateur de mois d'établissement - `établissement_id`, `indicateur_common_id`, `period_id`, `completeness_flag` | module 2 - Indicateurs d'exhaustivité pour chaque indicateur de mois d'établissement - `period_id`, `completeness_flag` | module 3 - Indicateurs d'exhaustivité pour les indicateurs de mois d'établissement

??? "Structure des données d'entrée"

    **Données brutes SIGS (`SIGS_ISO3.csv`)** :

    ```text
    établissement_id | admin_area_1 | admin_area_2 | admin_area_3 | period_id | indicateur_common_id | count
    ------------|--------------|--------------|--------------|-----------|---------------------|-------
    FAC001      | ISO3         | Province_A   | district_A   | 202301    | CPN1                | 145
    FAC001      | ISO3         | Province_A   | district_A   | 202302    | CPN1                | 152
    FAC001      | ISO3         | Province_A   | district_A   | 202303    | CPN1                | 890  # outlier
    ```

    **Drapeaux de valeurs aberrantes (`M1_output_outliers.csv`)** :

    ```text
    établissement_id | indicateur_common_id | period_id | outlier_flag
    ------------|---------------------|-----------|-------------
    FAC001      | CPN1                | 202301    | 0
    FAC001      | CPN1                | 202302    | 0
    FAC001      | CPN1                | 202303    | 1           # Flagged as outlier
    ```

    **Drapeaux de complétude (`M1_output_completeness.csv`)** :

    ```text
    établissement_id | indicateur_common_id | period_id | completeness_flag
    ------------|---------------------|-----------|------------------
    FAC001      | CPN1                | 202301    | 1             # Complete
    FAC001      | CPN1                | 202302    | 0             # Incomplete
    FAC001      | CPN1                | 202303    | 1             # Complete
    ```

??? "Fichiers de sortie"

    Le module génère quatre fichiers de sortie :

    | Le module génère quatre fichiers de sortie : Fichier, Niveau, Description, Colonnes clés
    |------|-------|-------------|-------------|
    | `M2_adjusted_data.csv` | Établissement | Volumes ajustés pour tous les scénarios au niveau de l'établissement | `établissement_id`, zones administratives (excl. zone_admin_1), `period_id`, `indicateur_common_id`, `count_final_*` | `period_id`, `indicateur_common_id`, `count_final_*`, `M2_adjusted_data_admin_area.csv` | Sous-état | Établissement
    | Sous-national | Volumes ajustés agrégés dans les zones administratives sous-nationales | Zones administratives (excl. zone_admin_1), `period_id`, `indicateur_common_id`, `count_final_*` |
    | National | Volumes ajustés agrégés au niveau national | `admin_area_1`, `period_id`, `indicateur_common_id`, `count_final_*` |
    | Métadonnées | Indicateurs exclus de l'ajustement en raison de la faiblesse des volumes | `indicateur_common_id`, `low_volume_exclude` | Métadonnées

??? "Structure des données de sortie"

    **Sorties au niveau de l'installation** (__CODE_BLOC_62__) :

    ```text
    établissement_id | admin_area_2 | admin_area_3 | period_id | indicateur_common_id | count_final_none | count_final_outlier | count_final_completeness | count_final_both
    ------------|--------------|--------------|-----------|---------------------|------------------|----------------------|--------------------------|------------------
    FAC001      | Province_A   | district_A   | 202301    | CPN1                | 145              | 145                  | 145                      | 145
    FAC001      | Province_A   | district_A   | 202302    | CPN1                | 152              | 152                  | 148                      | 148
    FAC001      | Province_A   | district_A   | 202303    | CPN1                | 890              | 148                  | 890                      | 148
    ```

    Chaque colonne __CODE_BLOC_63__ représente un scénario d'ajustement différent :

    - `count_final_none` : Aucun ajustement n'est appliqué (valeurs originales)
    - cODE_BLOCK_65__ : Seul l'ajustement des valeurs aberrantes est appliqué
    - `count_final_completeness` : Seul l'ajustement d'exhaustivité est appliqué
    - cODE_BLOCK_67__ : Ajustement des valeurs aberrantes et de l'exhaustivité appliqués

### Documentation sur les fonctions clés

??? "Bibliothèques requises"

    Le module dépend des paquets R suivants :

    -   `data.table` - Manipulation et agrégation de données haute performance
    -   `zoo` - Calculs de fenêtres glissantes (`frollmean` pour les moyennes glissantes)
    -   `lubridate` - Traitement et manipulation des dates

??? "1. `apply_adjustments()`"

    Fonction de base qui met en œuvre la logique d'ajustement pour un scénario unique.

    **Objectif** :

    Remplace les valeurs aberrantes et/ou incomplètes en utilisant des moyennes mobiles et des modèles historiques.

    **Paramètres** :

    - `raw_data` (data.table) : Données SIGS originales avec comptage des services
    - `completeness_data` (data.table) : Indicateurs d'exhaustivité du module 1
    - cODE_BLOC_75__ (data.table) : Indicateurs de valeurs aberrantes du module 1
    - __CODE_BLOC_76__ (logique) : Application ou non de l'ajustement des valeurs aberrantes
    - __CODE_BLOC_77__ (logique) : Appliquer ou non l'ajustement de l'exhaustivité

    **Retourne** :

    data.table avec les valeurs ajustées dans la colonne `count_working` et les métadonnées d'ajustement

    **Opérations clés** :

    1. Fusionne les ensembles de données d'entrée par `établissement_id`, `indicateur_common_id`, et `period_id`
    2. Convertit les `period_id` en dates pour l'ordonnancement temporel
    3. Calcule les moyennes glissantes (centrées, en avant, en arrière) pour les valeurs valides
    4. Applique une hiérarchie d'ajustement basée sur la disponibilité des données
    5. Suivi de la méthode d'ajustement utilisée pour chaque valeur remplacée

??? "2. `apply_adjustments_scenarios()`"

    Fonction enveloppante qui exécute les ajustements dans les quatre scénarios.

    **Objectif** :

    Appliquer la logique d'ajustement selon différentes combinaisons d'ajustements des valeurs aberrantes et de l'exhaustivité.

    **Paramètres** :

    - `raw_data` (data.table) : Données SIGS d'origine
    - `completeness_data` (data.table) : Drapeaux d'exhaustivité
    - `outlier_data` (data.table) : Indicateurs de valeurs aberrantes

    **Retourne** :

    data.table avec quatre colonnes `count_final_*`, une par scénario

    **Scénarios traités** :

    1. `none` : Pas d'ajustement (ligne de base)
    2. cODE_BLOCK_89__ : Ajustement des valeurs aberrantes uniquement
    3. cODE_BLOCK_90__ : Ajustement de l'exhaustivité uniquement
    4. bLOC_CODE_91__ : Valeur aberrante séquentielle puis ajustement de l'exhaustivité

    **Logique de traitement** :

    - Appelle `apply_adjustments()` une fois par scénario
    - Préserve les valeurs originales pour les indicateurs exclus (décès)
    - Fusionne tous les résultats des scénarios dans un seul tableau grand format

### Méthodes statistiques et algorithmes

??? "Méthodologie d'ajustement des valeurs aberrantes"

    L'ajustement des valeurs aberrantes est appliqué à toute valeur du mois de l'établissement signalée dans le module 1 (`outlier_flag == 1`). L'objectif est de remplacer ces valeurs aberrantes par des données historiques valides provenant du même établissement et du même indicateur.

    **Approche statistique** :

    Les moyennes mobiles sont utilisées pour estimer les valeurs attendues. Une moyenne glissante (également appelée moyenne mobile) est la moyenne d'un ensemble de périodes entourant la période cible. Cette technique permet de lisser les fluctuations à court terme et de mettre en évidence les tendances à long terme.

    **Définition des valeurs valides** :

    Seules les valeurs répondant à TOUS les critères suivants sont utilisées dans les calculs :

    - `!is.na(count)` (non-missing)
    - `outlier_flag == 0` (non signalées comme aberrantes)

    **Mise en œuvre** :

    Le module utilise `frollmean()` du paquet `zoo` pour des calculs de roulement efficaces :

    ```r
    data_adj[, valid_count := fifelse(outlier_flag == 0L & !is.na(count), count, NA_real_)]
    data_adj[, `:=`(
      roll6   = frollmean(valid_count, 6, na.rm = TRUE, align = "center"),
      fwd6    = frollmean(valid_count, 6, na.rm = TRUE, align = "left"),
      bwd6    = frollmean(valid_count, 6, na.rm = TRUE, align = "right"),
      fallback= mean(valid_count, na.rm = TRUE)
    ), by = .(établissement_id, indicateur_common_id)]
    ```

??? "Hiérarchie d'ajustement pour les valeurs aberrantes"

    Le processus d'ajustement suit cet **ordre hiérarchique** (en s'arrêtant à la première méthode disponible) :

    1.  **Moyenne centrée sur 6 mois (`roll6`)**

        -   Utilise les trois mois précédant et les trois mois suivant le mois aberrant
        -   Fournit une moyenne équilibrée basée sur les tendances proches
        -   S'applique lorsqu'il existe suffisamment de valeurs valides de part et d'autre du mois
        -   Étiquette de la méthode : `roll6`

    2.  **Moyenne prévisionnelle sur 6 mois (`fwd6`)**

        -   Utilisée si la moyenne centrée ne peut pas être calculée (par exemple, au début de la série temporelle)
        -   Prend la moyenne des six prochains mois valides
        -   Étiquette de la méthode : `forward`

    3.  **Moyenne des 6 mois rétrospectifs (`bwd6`)**

        -   Utilisé si ni `roll6` ni `fwd6` ne sont disponibles
        -   Prend la moyenne des six mois valides les plus récents avant la valeur aberrante
        -   Étiquette de la méthode : `backward`

    4.  **Même mois que l'année précédente**

        -   S'il n'existe pas de moyenne valable sur 6 mois, la valeur du **même mois civil de l'année précédente** est utilisée (par exemple, janvier 2023 pour janvier 2024)
        -   Ne s'applique que si la valeur précédente est valide (pas une valeur aberrante et > 0)
        -   Particulièrement utile pour les indicateurs saisonniers (par exemple, paludisme, infections respiratoires)
        -   Étiquette de la méthode : `same_month_last_year`
        -   **Mise en œuvre** :

        ```r
        data_adj[, `:=`(mm = month(date), yy = year(date))]
        data_adj <- data_adj[, {
          for (i in which(outlier_flag == 1L & is.na(adj_method))) {
            j <- which(mm == mm[i] & yy == yy[i] - 1 & outlier_flag == 0L & !is.na(count))
            if (length(j) == 1L) {
              count_working[i] <- count[j]
              adj_method[i]    <- "same_month_last_year"
              adjust_note[i]   <- format(date[j], "%b-%Y")
            }
          }
          .SD
        }, by = .(établissement_id, indicateur_common_id)]
        ```

    5.  **Moyenne de toutes les valeurs historiques (repli)**

        -   Si toutes les méthodes précédentes échouent, la moyenne de toutes les valeurs historiques valides pour cet indicateur d'installation est utilisée
        -   Fournit une base de référence spécifique à l'établissement lorsqu'aucun modèle temporel n'est disponible
        -   Étiquette de la méthode : `fallback`

    **Cas de figure** :

    Si aucune de ces méthodes ne permet de trouver un remplacement valide, la valeur aberrante d'origine est conservée.

??? "Méthodologie d'ajustement de l'exhaustivité"

    La correction pour exhaustivité est appliquée à tout mois-facilité pour lequel.. :

    - Le mois est marqué comme incomplet (`completeness_flag != 1`) dans le module 1, OU
    - La valeur est manquante (__CODE_BLOC_109__)

    **Approche statistique** :

    La même méthodologie de moyenne mobile est appliquée, mais la définition des "valeurs valides" diffère légèrement :

    **Valeurs valides pour l'ajustement de l'exhaustivité** :

    - `!is.na(count_working)` (non manquantes, peut-être déjà ajustées pour les valeurs aberrantes)
    - `outlier_flag == 0` (non signalé comme aberrant dans les données d'origine)

    **Différence essentielle par rapport à l'ajustement des valeurs aberrantes** :

    - L'ajustement pour l'exhaustivité peut utiliser des valeurs qui ont déjà été ajustées pour les valeurs aberrantes (lorsque les scénarios incluent les deux ajustements)
    - Aucune méthode du même mois et de la dernière année n'est utilisée (uniquement des moyennes glissantes et une méthode de repli)

    **Mise en œuvre

    ```r
    data_adj[, valid_count := fifelse(!is.na(count_working) & outlier_flag == 0L, count_working, NA_real_)]
    data_adj[, `:=`(
      roll6   = frollmean(valid_count, 6, na.rm = TRUE, align = "center"),
      fwd6    = frollmean(valid_count, 6, na.rm = TRUE, align = "left"),
      bwd6    = frollmean(valid_count, 6, na.rm = TRUE, align = "right"),
      fallback= mean(valid_count, na.rm = TRUE)
    ), by = .(établissement_id, indicateur_common_id)]
    ```

??? "Hiérarchie d'ajustement pour l'exhaustivité"

    Le remplacement suit cet **ordre hiérarchique** :

    1.  **Moyenne centrée sur 6 mois (`roll6`)**

        -   Utilise trois mois valides avant et après le mois manquant ou incomplet
        -   Méthode préférée lorsque les données environnantes sont suffisantes
        -   Étiquette de la méthode : `roll6`

    2.  **Moyenne prévisionnelle sur 6 mois (`fwd6`)**

        -   Utilisé si la moyenne centrée ne peut pas être calculée (par exemple, au début de la série temporelle)
        -   Étiquette de la méthode : `forward`

    3.  **Moyenne rétrospective sur 6 mois (`bwd6`)**

        -   Utilisée si aucune valeur centrée ou prospective n'est disponible (par exemple, à la fin de la série temporelle)
        -   Étiquette de la méthode : `backward`

    4.  **Moyenne de toutes les valeurs historiques (repli)**

        -   Si aucune moyenne mobile ne peut être calculée, utilise la moyenne de toutes les valeurs valides pour cet indicateur d'installation
        -   Fournit une base de référence spécifique à l'établissement
        -   Étiquette de la méthode : `fallback`

    **Cas de figure** :

    Si aucun remplacement valide n'est trouvé, la valeur reste manquante (`NA`).

??? "Logique de traitement des scénarios"

    Le module traite simultanément les quatre scénarios d'ajustement à l'aide de la fonction `apply_adjustments_scenarios()` :

    **Scénario 1 : Aucun** (`count_final_none`)

    - `adjust_outliers = FALSE`, `adjust_completeness = FALSE`
    - Données brutes originales sans aucune modification
    - Sert de référence pour la comparaison

    **Scénario 2 : valeurs aberrantes** (`count_final_outlier`)

    - `adjust_outliers = TRUE`, `adjust_completeness = FALSE`
    - Seules les valeurs aberrantes sont remplacées
    - Les valeurs manquantes/incomplètes restent telles quelles
    - Cas d'utilisation : Lorsque l'exhaustivité est élevée mais que les valeurs aberrantes posent problème

    **Scénario 3 : Exhaustivité** (`count_final_completeness`)

    - `adjust_outliers = FALSE`, `adjust_completeness = TRUE`
    - Seules les valeurs manquantes/incomplètes sont imputées
    - Les valeurs aberrantes sont conservées dans les données
    - Cas d'utilisation : Lorsque la qualité des données est bonne mais que la déclaration est sporadique

    **Scénario 4 : Les deux** (`count_final_both`)

    - `adjust_outliers = TRUE`, `adjust_completeness = TRUE`
    - **Traitement séquentiel** : Traitement séquentiel** : les valeurs aberrantes sont d'abord corrigées, puis l'exhaustivité
    - Ajustement le plus complet
    - Cas d'utilisation : Lorsque les deux problèmes de qualité des données sont prévalents

    **Ordre de traitement pour le scénario "Les deux" :

    1. L'ajustement des valeurs aberrantes crée un `count_working` où les valeurs aberrantes sont remplacées
    2. L'ajustement de complétude opère ensuite sur `count_working`, en utilisant les valeurs déjà ajustées
    3. Cela garantit que l'imputation de l'exhaustivité utilise des valeurs nettoyées (non aberrantes) lorsqu'elles sont disponibles

    **Important** :

    Après les ajustements spécifiques au scénario, les indicateurs exclus (décès) sont réinitialisés à leurs valeurs initiales :

    ```r
    dat[indicateur_common_id %in% EXCLUDED_FROM_ADJUSTMENT, count_working := count]
    ```

??? "Méthodes d'agrégation"

    Toutes les agrégations géographiques utilisent des **sommes simples** :

    ```r
    sum(count_final_both, na.rm = TRUE)
    ```

    **Raison d'être** :

    - Les volumes de services sont additifs (par exemple, les livraisons totales = la somme des livraisons des installations)
    - Les valeurs manquantes (`NA`) sont considérées comme nulles dans l'agrégation
    - Conforme aux pratiques standard de reporting du SIGS

    **Avertissement** :

    Si de nombreux établissements ont des valeurs `NA` après ajustement, les totaux sous-nationaux/nationaux peuvent être sous-estimés. Le scénario `count_final_none` fournit un point de référence pour évaluer l'impact.

??? "Traitement des données manquantes dans les calculs"

    Le module applique `na.rm = TRUE` dans tous les calculs de roulement :

    ```r
    frollmean(valid_count, 6, na.rm = TRUE, align = "center")
    ```

    **Implication** :

    Les moyennes glissantes sont calculées à partir des seules valeurs valides disponibles. S'il existe moins de 6 valeurs, la moyenne est calculée à partir de toutes les valeurs disponibles. Si aucune valeur valide n'existe, le résultat est `NA`.

### Exemples de code

??? "Exemple 1 : Ajustement des valeurs aberrantes"

    **Scénario** :

    Une structure sanitaire signale un nombre anormalement élevé de premières visites de soins prénatals (CPN1) en mars 2023.

    **Données** :

    ```text
    period_id | count | outlier_flag | Surrounding valid values
    ----------|-------|--------------|-------------------------
    202301    | 145   | 0            | valid
    202302    | 152   | 0            | valid
    202303    | 890   | 1            | outlier
    202304    | 148   | 0            | valid
    202305    | 155   | 0            | valid
    202306    | 147   | 0            | valid
    ```

    **Calcul de l'ajustement** (moyenne centrée sur 6 mois) :

    - Valeurs valides : [145, 152, 148, 155, 147] (exclut la valeur aberrante 890)
    - Moyenne : (145 + 152 + 148 + 155 + 147) / 5 = 149,4
    - **Valeur ajustée** : 149.4

    **Méthode utilisée

    `roll6`

??? "Exemple 2 : Ajustement de la complétude"

    **Scénario** :

    Un établissement ne déclare pas les tests de dépistage du paludisme en février 2023.

    **Données** :

    ```text
    period_id | count | completeness_flag | Surrounding valid values
    ----------|-------|-------------------|-------------------------
    202301    | 45    | 1                 | valid
    202302    | NA    | 0                 | INCOMPLETE
    202303    | 48    | 1                 | valid
    202304    | 52    | 1                 | valid
    202305    | 50    | 1                 | valid
    ```

    **Calcul de l'ajustement** (moyenne centrée sur 6 mois) :

    - Valeurs valides : [45, 48, 52, 50, ...]
    - Moyenne : 48.75 (en utilisant les mois environnants disponibles)
    - **Valeur calculée** : 48.75

    **Méthode utilisée

    `roll6`

??? "Exemple 3 : Indicateur saisonnier avec même mois-dernière année"

    **Scénario** :

    Les cas de paludisme présentent une forte saisonnalité et une valeur aberrante de juin 2023 doit être ajustée.

    **Données** :

    ```text
    period_id | count | outlier_flag | Notes
    ----------|-------|--------------|-------
    202206    | 234   | 0            | June 2022 (valid)
    202306    | 1850  | 1            | June 2023 (outlier)
    ```

    **Logique d'ajustement** :

    1. Les moyennes mobiles centrées, avant et arrière ne sont pas disponibles (données insuffisantes)
    2. Méthode du même mois et de la dernière année activée
    3. Valeur juin 2022 = 234 (valide)
    4. **Valeur ajustée** : 234

    **Méthode utilisée** :

    `same_month_last_year`

??? "Exemple 4 : Comparaison de scénarios"

    **établissement** :

    FAC001

    **Indicateur** :

    Livraisons institutionnelles

    **Période** :

    Q1 2023

    **Données originales** :

    ```text
    Month    | Count | outlier? | Complete?
    ---------|-------|----------|----------
    Jan 2023 | 78    | No       | Yes
    Feb 2023 | 450   | Yes      | Yes       # outlier
    Mar 2023 | NA    | -        | No        # Incomplete
    ```

    **Scénario de résultats** :

    | Mois - Aucun - Valeurs aberrantes - Exhaustivité - Les deux - Les deux - Les deux
    |----------|------|----------|--------------|------|
    | Janv. 2023 - 78 - 78 - 78 - 78 - 78 - 78 - 78 - 78 - 78 - 78 - 78 - 78 - 78 - 78 - 78 - 78 - 78 - 78
    | Fév 2023 | 450 | 82* | 450 | 82* |
    | Mar 2023 | NA | NA | 80** | 80** | 80** | 80** | 80** | 80** | 80** | 80** | 80**

    *Ajusté en utilisant la moyenne mobile

    **Calculé sur la base d'une moyenne mobile

    **Interprétation** :

    - **Aucune** : Données brutes avec des problèmes évidents
    - **valeurs aberrantes** : Février corrigé, mais mars reste manquant
    - **Complétude** : mars est complété, mais la valeur aberrante de février est conservée : Mars est complété, mais la valeur aberrante de février est conservée
    - **Les deux** : Ensemble de données le plus complet et le plus propre

??? "Exemple 5 : Agrégation géographique"

    **Code d'agrégation sous-nationale** :

    ```r
    adjusted_data_admin_area_final <- adjusted_data_export[
      ,
      .(
        count_final_none         = sum(count_final_none,         na.rm = TRUE),
        count_final_outlier     = sum(count_final_outlier,     na.rm = TRUE),
        count_final_completeness = sum(count_final_completeness, na.rm = TRUE),
        count_final_both         = sum(count_final_both,         na.rm = TRUE)
      ),
      by = c(geo_admin_area_sub, "indicateur_common_id", "period_id")
    ]
    ```

    **Code d'agrégation nationale** :

    ```r
    adjusted_data_national_final <- adjusted_data_export[
      ,
      .(
        count_final_none         = sum(count_final_none,         na.rm = TRUE),
        count_final_outlier     = sum(count_final_outlier,     na.rm = TRUE),
        count_final_completeness = sum(count_final_completeness, na.rm = TRUE),
        count_final_both         = sum(count_final_both,         na.rm = TRUE)
      ),
      by = .(admin_area_1, indicateur_common_id, period_id)
    ]
    ```

### Dépannage

??? "Problèmes courants"

    **Problème 1 : Toutes les valeurs restent non ajustées**

    **Causes possibles** :

    - L'indicateur figure sur la liste des exclusions (décès)
    - Indicateur marqué comme étant de faible volume
    - Pas de valeurs aberrantes ou d'indicateurs d'exhaustivité dans les données d'entrée

    **Solution** :

    Vérifier `M2_low_volume_exclusions.csv` et vérifier que les sorties du module 1 contiennent des indicateurs

    **Problème 2 : Les valeurs ajustées semblent déraisonnables

    **Causes possibles** :

    - Insuffisance de données historiques valides pour les moyennes mobiles
    - Les modifications réelles du programme sont lissées
    - Les tendances saisonnières ne sont pas prises en compte dans la fenêtre de 6 mois

    **Solution** :

    - Examiner les graphiques de séries chronologiques propres à l'établissement
    - Envisager d'utiliser le scénario "valeurs aberrantes uniquement" si l'exhaustivité est bonne
    - Valider par rapport aux registres de mise en œuvre du programme

    **Problème 3 : Nombreuses valeurs NA après ajustement**

    **Causes possibles** :

    - L'installation dispose de très peu de données
    - Aucune valeur valide n'est disponible pour aucune méthode d'ajustement
    - Les premiers mois de la série chronologique manquent de données historiques

    **Solution** :

    - Attendu pour les établissements ayant un historique de déclaration limité
    - Envisager un filtrage de la qualité des données au niveau de l'établissement
    - Les agrégats nationaux/sous-nationaux additionneront les valeurs disponibles

    **Problème 4 : Les totaux sous-nationaux/nationaux ne correspondent pas aux attentes**

    **Causes possibles** :

    - Les valeurs NA sont considérées comme nulles lors de l'agrégation
    - Différents scénarios produisent des totaux différents
    - Faible exhaustivité des rapports dans l'ensemble

    **Solution** :

    - Comparer __CODE_BLOC_144__ vs __CODE_BLOC_145__ pour évaluer l'impact de l'ajustement
    - Examiner les statistiques sur l'exhaustivité du module 1
    - Considérer le seuil de qualité des données pour l'inclusion

??? "Contrôles d'assurance qualité"

    Le module comprend plusieurs contrôles de qualité :

    1. **Exclusions des faibles volumes** : Identifie et exclut automatiquement les indicateurs qui ne comportent aucune observation de grande valeur
    2. **Suivi des ajustements** : Compte et rapporte le nombre de valeurs ajustées par chaque méthode
    3. **Indicateurs exclus** : Assure que les décès ne sont jamais ajustés
    4. **Journalisation de la console** : Fournit des statistiques détaillées sur l'état d'avancement et des statistiques sommaires

    **Exemple de sortie de la console** :

    ```text
    Running adjustments...
     -> Adjusting valeurs aberrantes...
         Roll6 adjusted: 1,245
         Forward-filled: 89
         Backward-filled: 67
         Same-month LY: 34
         Fallback mean: 12
     -> Adjusting for completeness...
         Roll6 filled: 2,103
         Forward-filled: 234
         Backward-filled: 178
         Fallback mean: 45
    ```


### Notes d'utilisation

??? "Choisir le bon scénario"

    | Situation - Scénario recommandé - Raison d'être - Situation - Raison d'être - Situation - Raison d'être - Situation - Raison d'être
    |-----------|---------------------|-----------|
    | Les données sont de haute qualité, les problèmes sont minimes | `none` | Aucun ajustement n'est nécessaire
    | | Qualité des données, problèmes minimes | `none` | Pas d'ajustement nécessaire |
    | Bonne qualité, faible fréquence de déclaration | __CODE_BLOC_148__ | Combler les lacunes tout en préservant les valeurs réelles
    | Qualité et exhaustivité médiocres | __CODE_BLOC_149__ | Nettoyage complet |
    analyse de sensibilité | Analyse de sensibilité | Analyse de sensibilité | Analyse de sensibilité | Analyse de sensibilité | Analyse de sensibilité | Analyse de sensibilité | Analyse de sensibilité | Analyse de sensibilité | Analyse de sensibilité | Analyse de sensibilité | Analyse de sensibilité

??? "Étapes de validation"

    Après avoir exécuté ce module, considérez :

    1. **Comparer les scénarios** : Examiner les différences entre `count_final_none` et `count_final_both`
    2. **Examiner les exclusions** : Vérifier que `M2_low_volume_exclusions.csv` ne contient pas d'indicateurs inattendus
    3. **Analyse agrégée** : S'assurer que les totaux infranationaux et nationaux sont raisonnables
    4. **Graphiques temporels** : Visualiser les tendances avant/après l'ajustement pour identifier le lissage excessif
    5. **Vérifications ponctuelles au niveau de l'établissement** : Examiner les ajustements pour un échantillon d'installations

??? "Limites"

    1. **Les fenêtres mobiles supposent la stabilité** : Les ajustements fonctionnent mieux lorsque la prestation de services est relativement stable. De véritables changements de programme (par exemple, de nouvelles campagnes) peuvent être lissés de manière incorrecte.

    2. **Pas d'incertitude sur les ajustements** : Le module fournit des estimations ponctuelles sans intervalles de confiance. Les valeurs ajustées doivent être considérées comme des estimations.

    3. **Ajustements spécifiques à l'installation** : Il n'y a pas d'emprunt d'informations entre les établissements. Les établissements disposant de très peu de données peuvent avoir des ajustements instables.

    4. **Modèles saisonniers** : Bien qu'il soit utile d'avoir le même mois que l'année précédente, une forte saisonnalité au sein de l'année peut ne pas être entièrement prise en compte par des fenêtres de 6 mois.

    5. **Traitement des données manquantes dans l'agrégation** : Les valeurs manquantes sont considérées comme nulles lorsqu'elles sont additionnées à des niveaux géographiques plus élevés, ce qui peut entraîner une sous-estimation des totaux si les valeurs manquantes sont élevées.

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

<!-- SLIDE:m5_1 -->
## Justification de l'ajustement de la qualité des données

Les données de routine du SIGS présentent deux limites communes qui peuvent fausser les résultats analytiques :
- **Valeurs aberrantes :** Les valeurs extrêmes créent des pics artificiels dans les volumes de services
- **Rapports incomplets :** Les données manquantes créent des baisses artificielles qui ne reflètent pas la prestation réelle de services

FASTR répond à ces limitations en remplaçant les valeurs problématiques par des estimations dérivées des modèles de rapports historiques de chaque établissement.

**Scénarios d'ajustement :** Pour favoriser la transparence et l'analyse de sensibilité, FASTR produit quatre ensembles de données parallèles :
- **Non ajusté :** Valeurs déclarées originales
- **Valeurs aberrantes ajustées :** Valeurs extrêmes remplacées
- **Exhaustivité ajustée :** Valeurs manquantes imputées
- **Les deux ajustés :** Toutes les corrections appliquées

---

## Indicateurs exclus de l'ajustement

Certains indicateurs sont exclus du processus d'ajustement :

- **Indicateurs de mortalité** (décès maternels, décès néonatals, décès d'enfants de moins de 5 ans) : Ils représentent des événements discrets pour lesquels le lissage ou l'imputation ne sont pas appropriés
- **Indicateurs de faible volume** : Les indicateurs qui ne dépassent jamais 100 événements déclarés au cours d'un mois donné sont exclus de l'ajustement

<!--
PRESENTER NOTES:
- Ce module traite les problèmes identifiés dans l'évaluation de la qualité des données
- Concept clé : nous remplaçons les valeurs problématiques par des estimations basées sur l'historique propre de l'établissement
- Quatre ensembles de données parallèles permettent l'analyse de sensibilité - dans quelle mesure les résultats changent-ils ?
- La mortalité est exclue car le lissage d'événements rares et discrets n'est pas approprié
- Les faibles volumes sont exclus car l'ajustement ajoute du bruit à des données déjà éparses
-->
<!-- /SLIDE -->

<!-- SLIDE:m5_2 -->
## Méthodologie d'ajustement des valeurs aberrantes

Les valeurs aberrantes sont remplacées par des données historiques spécifiques à l'établissement. L'ajustement suit une approche hiérarchique :

| Priorité | Méthode | Application |
|----------|--------|-------------|
| 1 | Moyenne centrée sur 6 mois | 3 mois avant + 3 mois après la valeur aberrante |
| 2 | Moyenne sur 6 mois vers l'avant | Lorsque les données précédentes sont insuffisantes (par exemple, début de série) |
| 3 | Moyenne sur 6 mois vers l'arrière | Lorsque les données suivantes sont insuffisantes (par exemple, fin de série) |
| 4 | Même mois, année précédente | Lorsque les moyennes glissantes ne sont pas disponibles ; utile pour les indicateurs saisonniers |
| 5 | Moyenne historique de l'établissement | Moyenne de toutes les valeurs valides pour cet indicateur dans cet établissement |
<!-- /SLIDE -->

<!-- SLIDE:m5_3 -->
## Méthodologie de l'ajustement d'exhaustivité

Pour les mois identifiés comme incomplets ou manquants, les valeurs sont imputées en utilisant la même approche de moyenne mobile sur 6 mois que celle appliquée à l'ajustement des valeurs aberrantes.

| Priorité | Méthode | Application |
|----------|--------|-------------|
| 1 | Moyenne centrée sur 6 mois | Lorsque des données suffisantes existent avant et après la lacune |
| 2 | Moyenne sur 6 mois vers l'avant | Pour les lacunes au début de la série temporelle |
| 3 | Moyenne sur 6 mois vers l'arrière | Pour les lacunes à la fin de la série temporelle |
| 4 | Moyenne historique de l'établissement | Moyenne de toutes les valeurs valides pour cet indicateur dans cet établissement |

Cette approche permet d'éviter que des lacunes temporaires dans les rapports ne créent des baisses artificielles dans les volumes de services.
<!-- /SLIDE -->


<!-- ═══════════════════════════════════════════════════════════════════════════
     DIAPOSITIVES CONDENSEES : Méthodes + Interprétation combinées
═══════════════════════════════════════════════════════════════════════════ -->

<!-- SLIDE:m5_s1 -->
## Ajustement de la qualité des données

**Pourquoi ajuster ?** Les valeurs aberrantes et les lacunes de rapportage identifiées dans l'évaluation de la qualité des données fausseront les estimations d'utilisation des services et de couverture si elles ne sont pas corrigées. L'objectif est de remplacer les valeurs problématiques par des estimations raisonnables basées sur les modèles historiques propres à chaque établissement.

**Comment ?** Les valeurs aberrantes et les valeurs manquantes sont remplacées à l'aide de moyennes mobiles sur 6 mois calculées à partir des données historiques de l'établissement.

**Quatre ensembles de données parallèles :** FASTR produit des versions non ajustées, ajustées pour les valeurs aberrantes uniquement, ajustées pour l'exhaustivité uniquement et ajustées pour les deux. Cela permet une analyse de sensibilité - comparer les résultats entre les scénarios pour évaluer dans quelle mesure les conclusions dépendent des choix d'ajustement.

**Exclus de l'ajustement :** Les indicateurs de mortalité (événements discrets qui ne doivent pas être lissés) et les indicateurs de faible volume (<100 événements/mois, où l'ajustement ajoute du bruit).

<!--
PRESENTER NOTES:
- Vue d'ensemble condensée de la justification et des méthodes d'ajustement
- Message clé : l'ajustement permet l'analyse malgré les limitations de qualité des données
- Quatre scénarios soutiennent l'analyse de sensibilité - important pour la transparence
- Tout ne doit pas être ajusté - mortalité et faible volume exclus
-->
<!-- /SLIDE -->

<!-- SLIDE:m5_s2 -->
## Résultat de l'ajustement des valeurs aberrantes

<div style="display: flex; gap: 1em; align-items: flex-start;">
<div style="flex: 1.2;">

![Ajustement des valeurs aberrantes](../resources/default_outputs/Default_1._Percent_change_in_volume_due_to_outlier_adjustment.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**Ce que vous voyez :** Heatmap montrant dans quelle mesure le volume de services a changé après le remplacement des valeurs aberrantes par des moyennes mobiles.

**Formule :** % de changement = (ajusté - original) / original × 100

**Interprétation :** Les valeurs sont généralement négatives (la suppression des valeurs aberrantes réduit le volume). Les ajustements importants justifient une investigation de leur source.

</div>
</div>

---

## Résultat de l'ajustement de l'exhaustivité

<div style="display: flex; gap: 1em; align-items: flex-start;">
<div style="flex: 1.2;">

![Ajustement de l'exhaustivité](../resources/default_outputs/Default_2._Percent_change_in_volume_due_to_completeness_adjustment.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**Ce que vous voyez :** Heatmap montrant dans quelle mesure le volume de services a changé après l'imputation des données manquantes par des moyennes mobiles.

**Formule :** % de changement = (ajusté - original) / original × 100

**Interprétation :** Les valeurs sont généralement positives (l'imputation ajoute du volume). Les ajustements importants indiquent les zones nécessitant une amélioration de l'exhaustivité.

</div>
</div>

<!--
PRESENTER NOTES:
- Deux résultats présentés : ajustement des valeurs aberrantes et ajustement de l'exhaustivité
- Heatmap des valeurs aberrantes : les valeurs négatives signifient que les valeurs aberrantes ont été supprimées (réduction des comptages gonflés)
- Heatmap de l'exhaustivité : les valeurs positives signifient que les lacunes ont été comblées (augmentation du volume total)
- Les ajustements importants (couleurs foncées) indiquent les zones/indicateurs avec des problèmes de qualité des données
- Utilisez ces résultats pour identifier où concentrer les efforts d'amélioration de la qualité des données
- Comparez les régions : lesquelles ont plus de problèmes de valeurs aberrantes vs de problèmes d'exhaustivité ?
-->
<!-- /SLIDE -->
