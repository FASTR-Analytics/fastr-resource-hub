<!-- AUTO-TRANSLATED from 06a_service_utilization.md -->
<!-- Add REVIEWED marker after human review to protect from overwrite -->

# Analyse de l'utilisation des services

## Contexte et objectif

### Objectif du module

Le module Utilisation des services analyse les schémas de prestation des services de santé afin de détecter et de quantifier les perturbations des volumes de services au fil du temps. Il identifie les écarts par rapport aux schémas de prestation de services prévus et estime l'ampleur de ces perturbations aux niveaux national, provincial et du district.

À l'aide de méthodes de contrôle des processus statistiques et de régression, le module compare les volumes de services observés avec les niveaux attendus dérivés des tendances historiques et saisonnières. Cela permet de distinguer les variations régulières et prévisibles (telles que l'augmentation saisonnière des cas de paludisme) des perturbations importantes des services, y compris les baisses soudaines des services du SRMNIA-N - tels que la vaccination et les soins de santé maternelle ou infantile - pendant les périodes de conflit ou les urgences de santé publique.

L'analyse produit des estimations quantifiées des déficits et des excédents de services, ce qui permet de mesurer systématiquement les changements dans la prestation des services et de les comparer dans le temps et au niveau géographique.

### Raison d'être de l'analyse

Les données sur l'utilisation des services donnent une idée de la manière dont les populations accèdent aux services de santé essentiels, mais les volumes observés peuvent varier pour de multiples raisons, notamment la saisonnalité, les changements de politique, les chocs extérieurs (tels que les pandémies, les catastrophes naturelles ou les conflits), les limites de la qualité des données et les changements dans la disponibilité des services. Sans analyse systématique, il est difficile de distinguer les variations normales des perturbations matérielles dans la prestation des services.

Ce module applique une approche standardisée, basée sur les données, pour identifier les déviations dans l'utilisation des services et pour quantifier leur ampleur. Les résultats permettent de détecter les problèmes émergents dans la prestation de services, de les comparer entre les différents niveaux géographiques et de les suivre dans le temps, y compris pendant les périodes de perturbation et de reprise. Les résultats sont structurés de manière à pouvoir être utilisés pour le suivi de routine, les rapports analytiques et l'évaluation des changements dans la performance des services de santé.

### Points clés

| Composante | Détails |
|-----------|---------|
| **Entrées** | Volumes de services ajustés du module 2 (`M2_adjusted_data.csv` et `M2_adjusted_data_admin_area.csv`)<br>Indicateurs de valeurs aberrantes du module 1 (`M1_output_outliers.csv`)<br>SIGS brut (`hmis_ISO3.csv`) - uniquement pour la correspondance entre `facility_id` et `admin_area_1` |
| **Sorties** | Données ajustées en passage direct (`M3_service_utilization.csv`)<br>Indicateurs de perturbation (`M3_chartout.csv`)<br>Impacts quantifiés par niveau géographique (`M3_disruptions_analysis_admin_area_1` à `_4.csv`)<br>Résumés des déficits/excédents (`M3_all_indicators_shortfalls_admin_area_1` à `_4.csv`) |
| **Objectif** | Détecter et quantifier les perturbations dans la fourniture des services par une analyse en deux étapes : les cartes de contrôle identifient quand les perturbations se produisent, la régression par panel quantifie leur ampleur |

---

## Flux de travail analytique

### Aperçu des étapes analytiques

Le module fonctionne en deux parties séquentielles, chacune ayant un objectif distinct :

**Partie 1 : Analyse de la carte de contrôle** - Identifie les schémas inhabituels dans les volumes de service

1. **Préparer les données** : Charger les données sur les services de santé, supprimer les valeurs aberrantes précédemment identifiées, les agréger au niveau géographique approprié et compléter les mois manquants par interpolation.

2. **Modéliser les modèles attendus** : Pour chaque combinaison d'indicateur de santé et de zone géographique, utiliser des méthodes statistiques robustes pour estimer ce que les volumes de services devraient être sur la base des tendances historiques et saisonnières (par exemple, tenir compte des augmentations prévisibles des cas de paludisme pendant la saison des pluies).

3. **Détecter les écarts** : Comparer les volumes de services réels aux modèles attendus et identifier les écarts significatifs à l'aide de plusieurs règles de détection :
   - **Perturbations brutales** : mois uniques présentant des écarts extrêmes
   - **Baisses prolongées** : baisse graduelle sur plusieurs mois
   - **Baisses soutenues** : périodes constamment inférieures aux niveaux attendus
   - **Hausses soutenues** : périodes constamment supérieures aux niveaux attendus
   - **Données manquantes** : lacunes dans les rapports qui peuvent signaler des problèmes

4. **Signaler les périodes perturbées** : Marquer les mois où un modèle de perturbation est détecté, en veillant à ce que les mois récents soient toujours signalés pour examen.

**Partie 2 : Analyse des perturbations** - Quantifie l'impact des perturbations identifiées

5. **Appliquer des modèles de régression** : Utiliser la régression par panel à plusieurs niveaux géographiques (national, provincial, district) pour estimer dans quelle mesure les volumes de services ont changé pendant les périodes de perturbation identifiées, en tenant compte des tendances et de la saisonnalité.

6. **Calculer les déficits et les excédents** : Comparer les volumes prévus aux volumes réels pour quantifier l'ampleur des perturbations en chiffres absolus et en pourcentages.

7. **Générer des résultats** : Créer des fichiers de synthèse montrant l'impact des perturbations à chaque niveau géographique, prêts à être visualisés et à faire l'objet de rapports.

### Diagramme de flux de travail

<iframe src="../../resources/diagrams/mod3_workflow_FR.html" width="100%" height="800" style="border: 1px solid #ccc; border-radius: 4px;" title="Module 3 Interactive Workflow"></iframe>

### Points de décision clés

**Niveau d'analyse géographique**

Le module prend en charge l'analyse des perturbations à plusieurs échelles géographiques. Les utilisateurs peuvent limiter l'analyse aux niveaux national et provincial, ce qui est plus rapide en termes de calcul et convient au suivi de routine, ou étendre l'analyse aux niveaux du district et de la circonscription pour obtenir des informations plus granulaires en vue d'une enquête et d'une réponse ciblées.

**Sélection du niveau de la carte de contrôle**

Le niveau auquel les cartes de contrôle sont calculées détermine où la modélisation statistique est effectuée. Il est configuré à l'aide de deux drapeaux et suit la convention FASTR selon laquelle les niveaux administratifs les plus élevés correspondent à des unités géographiques plus petites.

- **Configuration par défaut (les deux drapeaux sont à FALSE)**
  Les cartes de contrôle sont calculées à un niveau infranational intermédiaire (**admin_area_2**). Les volumes de services sont agrégés à ce niveau, et l'estimation des tendances, le calcul des limites de contrôle et la détection des perturbations sont effectués pour chaque combinaison géographie-indicateur. Cette option est la plus efficace en termes de calcul et convient au suivi de routine.

- **RUN_DISTRICT_MODEL = TRUE**
  Les cartes de contrôle sont calculées à un niveau infranational plus fin (**admin_area_3**). Les volumes de services sont agrégés à des unités géographiques plus petites, ce qui permet de détecter des perturbations localisées qui pourraient être masquées à des niveaux d'agrégation plus élevés. Cette option nécessite davantage de calculs, mais offre une meilleure résolution spatiale.

- **RUN_ADMIN_AREA_4_ANALYSIS = TRUE**
  Les cartes de contrôle sont calculées au niveau géographique le plus granulaire disponible (**admin_area_4**). Cela permet d'identifier les perturbations très localisées ou au niveau des établissements. Il s'agit de l'option la plus gourmande en ressources et elle est généralement utilisée pour des analyses ciblées ou diagnostiques.

Le niveau de carte de contrôle sélectionné détermine l'endroit où la modélisation statistique est effectuée, y compris l'estimation des tendances, le calcul des limites de contrôle et le signalement des perturbations. Quel que soit le niveau auquel les cartes de contrôle sont calculées, les résultats des perturbations sont agrégés et présentés à tous les niveaux géographiques disponibles (national et infranational).


**Paramètres de sensibilité**

Le module utilise des seuils statistiques configurables pour définir ce qui constitue une perturbation. Les paramètres les plus sensibles (seuils inférieurs) signalent les écarts les plus faibles par rapport aux modèles attendus et conviennent à des fins d'alerte précoce. Les paramètres plus conservateurs (seuils plus élevés) limitent la détection aux écarts plus importants et sont utiles pour se concentrer sur les perturbations majeures.

**Traitement de la complétude des rapports**

Le module accepte des versions alternatives des comptages de services produits par le module 2, ce qui permet aux utilisateurs de choisir d'analyser les volumes bruts rapportés ou les volumes ajustés pour tenir compte de la complétude des rapports. Cela permet d'aligner l'analyse des perturbations sur différentes hypothèses de qualité des données.


### Traitement des données et résultats

**Transformation de l'entrée**

Le module commence par le décompte mensuel des services au niveau de l'établissement (par exemple, les accouchements déclarés par chaque établissement). Ces données sont agrégées au niveau géographique sélectionné. Les observations identifiées comme aberrantes dans le module 1 sont exclues afin d'éviter que les valeurs anormales n'influencent l'estimation des tendances et les limites de contrôle.

**Estimation et détection des tendances**

En utilisant des méthodes statistiques robustes, le module estime les modèles d'utilisation des services attendus pour chaque indicateur et unité géographique sur la base des données historiques, en tenant compte des tendances à long terme et de la saisonnalité. Les mois au cours desquels les volumes de services observés s'écartent de manière significative de ces modèles attendus sont signalés comme des perturbations potentielles.

**Quantification de l'impact des perturbations**

Pour les périodes identifiées comme perturbées, des modèles de régression sont utilisés pour estimer les volumes de service contrefactuels - représentant l'utilisation attendue en l'absence de perturbation. Les différences entre les volumes prédits et observés sont calculées pour quantifier les insuffisances ou les excédents de service.

**Structure de sortie**

Les résultats finaux présentent les mesures de perturbation à plusieurs niveaux géographiques, depuis les résumés nationaux jusqu'aux résultats locaux détaillés. Les données originales sont conservées, avec des champs supplémentaires fournissant les valeurs attendues, les indicateurs de perturbation et les impacts quantifiés.

---

### Résultats de l'analyse et visualisation

L'analyse FASTR génère quatre sorties visuelles principales pour l'utilisation des services :

**1. Changement dans le volume de service**

Diagramme à barres montrant les volumes de services annuels par région et par indicateur, avec des annotations sur la variation en pourcentage d'une année sur l'autre.

![Évolution du volume de services dans le temps](resources/default_outputs/Module3_1_Change_in_service_volume.png)

**2. Services réels par rapport aux services prévus (national)**

Graphique linéaire comparant les volumes de services observés aux prévisions du modèle au niveau national.

![Réel vs prévu national](resources/default_outputs/Module3_2_Actual_vs_expected_national.png)

**3. Services réels par rapport aux services attendus (au niveau infranational)**

Graphiques linéaires par région comparant les volumes observés aux modèles attendus.

![Réel vs prévu infranational](resources/default_outputs/Module3_3_Actual_vs_expected_subnational.png)

**4. Variation de volume due aux ajustements de la qualité des données**

Diagramme à barres groupées comparant les volumes de services selon quatre scénarios d'ajustement : pas d'ajustement, ajustement des valeurs aberrantes uniquement, ajustement de la complétude uniquement, et les deux ajustements.

![Variation de volume](resources/default_outputs/Module3_4_Volume_change_adjustments.png)

**Guide d'interprétation**

Pour le tableau de variation du volume des services (sortie 1) :

- **Barres** : Volumes annuels de services par région
- **Annotations** : Pourcentage de variation d'une année sur l'autre entre deux années consécutives

Pour les graphiques "réel" et "prévu" (résultats 2-3) :

- **Ligne noire** : Volumes de services réels (observés)
- **Zones ombrées en rouge** : Périodes de déficit (réel inférieur aux prévisions)
- **Zones ombrées en vert** : Périodes d'excédent (réel supérieur aux prévisions)

Pour le graphique de variation de volume (résultat 4) :

- **Quatre barres par année** : Chaque barre représente un scénario d'ajustement différent
- Comparer les hauteurs des barres pour voir comment les ajustements affectent les volumes déclarés

---

## Référence détaillée

### Paramètres de configuration

??? "Paramètres d'analyse de base"

    | Paramètre | Valeur par défaut | Type | Description | Guide de réglage |
    |-----------|---------|------|-------------|-----------------|
    | `COUNTRY_ISO3` | "ISO3" | Chaîne | Code de pays à trois lettres | Définissez votre code de pays (par exemple, "RWA", "UGA", "ZMB") |
    | `SELECTEDCOUNT` | "count_final_outliers" | Chaîne | Colonne de données utilisée pour la modélisation par régression | Options : `count_final_none`, `count_final_outliers`, `count_final_completeness`, `count_final_both` |
    | `VISUALIZATIONCOUNT` | "count_final_outliers" | Chaîne | Colonne de données utilisée pour la visualisation | Mêmes options que `SELECTEDCOUNT` ; peut différer si vous souhaitez modéliser sur l'une et représenter graphiquement l'autre |

??? "Paramètres de la carte de contrôle"

    | Paramètre | Valeur par défaut | Type | Description | Guide de réglage |
    |-----------|---------|------|-------------|-----------------|
    | `SMOOTH_K` | 7 | Entier (impair) | Taille de la fenêtre médiane mobile en mois | Valeurs plus grandes = tendances plus lisses, moins de sensibilité. Il doit s'agir d'un nombre impair (par exemple, 5, 7, 9, 11) |
    | `MADS_THRESHOLD` | 1.5 | Numérique | Seuil des unités MAD pour les fortes perturbations | Plus bas = plus sensible (par exemple, 1.0), plus haut = plus conservateur (par exemple, 2.0) |
    | `DIP_THRESHOLD` | 0.90 | Numérique | Seuil de proportion pour les baisses soutenues | 0.90 = marquer si en dessous de 90% de la valeur attendue (baisse de 10%). Utiliser 0.80 pour un seuil de chute de 20% |
    | `DIFFPERCENT` | 10 | Numérique | Seuil de pourcentage pour le tracé des perturbations | Si la valeur réelle diffère de la valeur prédite de >10%, utiliser la valeur prédite dans les visualisations |

    **Note** : `RISE_THRESHOLD` est automatiquement calculé comme `1 / DIP_THRESHOLD` (par défaut : ~1.11) pour refléter symétriquement la détection de la baisse.

??? "Paramètres d'analyse géographique"

    | Paramètre | Valeur par défaut | Type | Description | Guide de réglage |
    |-----------|---------|------|-------------|-----------------|
    | `CONTROL_CHART_LEVEL` | Auto-défini | Chaîne | Niveau géographique pour les cartes de contrôle | Réglage automatique basé sur `RUN_DISTRICT_MODEL` et `RUN_ADMIN_AREA_4_ANALYSIS` |
    | `RUN_DISTRICT_MODEL` | FALSE | Logique | Exécuter ou non les régressions admin_area_3 | Mettre TRUE pour l'analyse au niveau du district (augmente le temps d'exécution) |
    | `RUN_ADMIN_AREA_4_ANALYSIS` | FALSE | Logique | Exécuter ou non l'analyse admin_area_4 | Mettre TRUE pour l'analyse au niveau le plus fin (très lent pour les grands ensembles de données) |

??? "Paramètres de la source de données"

    | Paramètre | Valeur par défaut | Type | Description |
    |-----------|---------|------|-------------|
    | `PROJECT_DATA_HMIS` | "hmis_ISO3.csv" | Chaîne | Nom de fichier pour les données SIGS brutes |

??? "Guide de sélection des paramètres"

    **Pour l'analyse à haute sensibilité** (détection des petites perturbations) :
    - `MADS_THRESHOLD = 1.0`
    - `DIP_THRESHOLD = 0.95` (baisse de 5%)
    - `SMOOTH_K = 5` (moins de lissage)

    **Pour une analyse conservatrice** (seulement les perturbations majeures) :
    - `MADS_THRESHOLD = 2.0`
    - `DIP_THRESHOLD = 0.80` (baisse de 20%)
    - `SMOOTH_K = 9` ou `11` (plus de lissage)

    **Pour une exécution plus rapide** :
    - `RUN_DISTRICT_MODEL = FALSE`
    - `RUN_ADMIN_AREA_4_ANALYSIS = FALSE`
    - `CONTROL_CHART_LEVEL = "admin_area_2"`

### Spécifications des entrées/sorties

??? "Exigences d'entrée"

    #### Entrées primaires

    1. **`M2_adjusted_data.csv`** (source de données principale)
       - Résultat du module 2 (Ajustements de la qualité des données)
       - Contient des comptes de services ajustés avec différentes hypothèses de complétude
       - Colonnes obligatoires : `facility_id`, `indicator_common_id`, `period_id`, `count_final_none`, `count_final_outliers`, `count_final_completeness`, `count_final_both`

    2. **`M1_output_outliers.csv`**
       - Résultat du module 1 (Évaluation de la qualité des données)
       - Contient `outlier_flag` pour identifier et exclure les points de données anormaux
       - Colonnes requises : `facility_id`, `indicator_common_id`, `period_id`, `outlier_flag`

    3. **`hmis_ISO3.csv`** (utilisé uniquement pour la recherche géographique)
       - Fichier SIGS brut utilisé uniquement pour extraire la correspondance facility_id → admin_area_1
       - Requis car M2_adjusted_data.csv n'inclut pas admin_area_1
       - Colonnes requises : `facility_id`, `admin_area_1`

    #### Exigences en matière de données

    - **Couverture temporelle** : Minimum 12 mois de données pour la modélisation saisonnière
    - **Complétude des données** : Les mois manquants sont comblés par interpolation
    - **Complétude géographique** : Données aux niveaux administratifs spécifiés
    - **Données de comptage** : Chiffres entiers non négatifs (les prédictions sont limitées à zéro)

    ### Sorties

    #### 1. Résultats de la carte de contrôle

    **`M3_chartout.csv`**

    **Objectif** : Contient les perturbations signalées lors de l'analyse de la carte de contrôle

    **Colonnes** :

    - `admin_area_*` : Identifiant géographique (le niveau dépend de `CONTROL_CHART_LEVEL`)
    - `indicator_common_id` : Code de l'indicateur de service de santé
    - `period_id` : Période au format AAAAMM
    - `tagged` : Indicateur binaire (1 = perturbation détectée, 0 = normal)

    **Utilisation** : Identifie les mois qui nécessitent un examen plus approfondi pour chaque combinaison indicateur-géographie

    **`M3_service_utilization.csv`**

    **But** : Copie de passage des données ajustées pour la visualisation

    **Source** : Copie directe de `M2_adjusted_data.csv`

    **Utilisation** : Fournit des données de base pour le tracé des volumes de service réels

    **`M3_memory_log.txt`**

    **But** : Suivi de l'utilisation de la mémoire tout au long de l'exécution

    **Utilisation** : Diagnostics pour l'optimisation des performances et le dépannage

    #### 2. Résultats de l'analyse des perturbations

    **`M3_disruptions_analysis_admin_area_1.csv`** (niveau national - toujours généré)

    **Colonnes** :

    - `admin_area_1` : Nom du pays
    - `indicator_common_id` : Indicateur de service de santé
    - `period_id` : Période (YYYYMM)
    - `count_sum` : Volume réel des services (somme de tous les établissements)
    - `count_expect_sum` : Volume de service attendu (somme des prévisions)
    - `count_expected_if_above_diff_threshold` : Valeur pour le tracé (attendue si |différence| > DIFFPERCENT, sinon réelle)

    **`M3_disruptions_analysis_admin_area_2.csv`** (niveau province - toujours généré)

    **Colonne supplémentaire** : `admin_area_2` (nom de la province/région)

    **Même structure** : Comme le fichier admin_area_1 mais désagrégé par province

    **`M3_disruptions_analysis_admin_area_3.csv`** (niveau du district - conditionnel)

    **Généré quand** : `RUN_DISTRICT_MODEL = TRUE`

    **Colonnes supplémentaires** : `admin_area_2`, `admin_area_3`

    **Même structure** : Comme ci-dessus mais désagrégé par district

    **`M3_disruptions_analysis_admin_area_4.csv`** (niveau du quartier - conditionnel)

    **Généré quand** : `RUN_ADMIN_AREA_4_ANALYSIS = TRUE`

    **Colonnes supplémentaires** : `admin_area_2`, `admin_area_3`, `admin_area_4`

    **Avertissement** : Fichier très volumineux pour les pays comportant de nombreuses circonscriptions

    #### 3. Fichiers de synthèse des déficits/excédents

    **`M3_all_indicators_shortfalls_admin_area_*.csv`** (un pour chaque niveau géographique)

    **But** : Mesures pré-calculées des déficits et des excédents pour les rapports

    **Colonnes communes** :

    - Identifiant(s) géographique(s) : `admin_area_*`
    - `indicator_common_id` : Indicateur de service de santé
    - `period_id` : Période (YYYYMM)
    - `count_sum` : Volume de service réel
    - `count_expect_sum` : Volume de service attendu
    - `shortfall_absolute` : Nombre absolu de services manquants (si perturbation négative)
    - `shortfall_percent` : Pourcentage d'insuffisance par rapport aux prévisions
    - `surplus_absolute` : Nombre absolu de services excédentaires (en cas de perturbation positive)
    - `surplus_percent` : Pourcentage d'excédent par rapport aux prévisions

    **Note** : Si les niveaux géographiques optionnels sont désactivés, des fichiers de remplacement vides sont créés pour assurer la compatibilité avec les processus en aval.

    #### Fichiers temporaires (nettoyés automatiquement)

    Pendant l'exécution, le module crée des fichiers batch temporaires pour la gestion de la mémoire :
    - `M3_temp_controlchart_batch_*.csv`
    - `M3_temp_indicator_batch_*.csv`
    - `M3_temp_province_batch_*.csv`
    - `M3_temp_district_batch_*.csv`
    - `M3_temp_admin4_batch_*.csv`

    Ces fichiers sont automatiquement supprimés en cas de succès. Si le script se plante, ces fichiers peuvent subsister et seront nettoyés lors de la prochaine exécution.

### Documentation des fonctions clés

??? "`robust_control_chart(panel_data, selected_count)`"

    **Objectif** : Identifie les anomalies dans l'utilisation des services en utilisant une régression robuste et des limites de contrôle basées sur le MAD.

    **Entrées** :

    - `panel_data` : Données de séries temporelles pour une combinaison spécifique indicateur-géographie
    - `selected_count` : Nom de la colonne contenant les comptes de volume de services à analyser

    **Processus** :

    1. Ajuste un modèle linéaire robuste (en utilisant `MASS::rlm()`) avec des contrôles saisonniers et des tendances temporelles
    2. Applique un lissage de la médiane roulante aux valeurs prédites pour réduire le bruit
    3. Calcule les résidus et les normalise en utilisant l'écart absolu médian (MAD)
    4. Applique une logique d'étiquetage basée sur des règles pour identifier les différents types de perturbations
    5. Signale automatiquement les mois récents afin d'assurer une détection rapide

    **Résultats** :

    - `count_predict` : Prédiction du volume de services à partir d'une régression robuste
    - `count_smooth` : Prédictions lissées à l'aide de la médiane roulante
    - `residual` : Différence entre les valeurs réelles et les valeurs lissées
    - `robust_control` : Résidu standardisé (résidu/MAD)
    - `tagged` : Indicateur binaire (1 = perturbation détectée, 0 = variation normale)
    - Drapeaux supplémentaires : `tag_sharp`, `tag_sustained`, `tag_sustained_dip`, `tag_sustained_rise`, `tag_missing`

    **Caractéristiques clés** :

    - Traite les données manquantes avec élégance grâce à l'interpolation
    - Utilise une régression robuste pour minimiser l'influence des valeurs aberrantes
    - Utilise plusieurs règles de détection des perturbations pour différents modèles
    - Assure des prédictions non négatives (les comptes ne peuvent pas être négatifs)

    ### Modèles de régression par panel

    L'analyse des perturbations utilise des modèles de régression en panel (`fixest::feols()`) à plusieurs niveaux géographiques. Des régressions distinctes sont effectuées pour chaque unité géographique à chaque niveau, avec des erreurs types groupées pour tenir compte de la corrélation à l'intérieur de la zone.

    **Modèle national** (admin_area_1) :

    ```r
    count ~ date + factor(month) + tagged
    ```

    Régression unique sur l'ensemble des établissements, avec erreurs standard groupées au niveau du district (`admin_area_3`) lorsque plus d'un district est disponible ; sinon, sans regroupement.

    **Modèles au niveau de la province** (admin_area_2) :

    ```r
    count ~ date + factor(month) + tagged
    ```

    Régression séparée pour chaque province, avec erreurs standard groupées au niveau du district lorsque plus d'un district est disponible ; sinon, sans regroupement.

    **Modèles au niveau du district** (admin_area_3 - optionnel) :

    ```r
    count ~ date + factor(month) + tagged
    ```

    Régression séparée pour chaque district (minimum 10 observations requises), avec erreurs standard groupées au niveau du quartier (`admin_area_4`) lorsque plus d'un quartier est disponible ; sinon, sans regroupement.

    **Modèles au niveau du quartier** (admin_area_4 - optionnel) :

    ```r
    count ~ date + factor(month) + tagged
    ```

    Régression séparée pour chaque quartier/unité finale (minimum 8 observations requises, pas de regroupement).

    ### Fonctions de soutien

    **`mem_usage(msg)`** : Suivi et enregistrement de la consommation de mémoire tout au long de l'exécution

    **Traitement des données** :

    - Traitement par lots avec des fichiers temporaires sur disque pour une meilleure efficacité de la mémoire
    - Opérations data.table efficaces pour les grands ensembles de données
    - Stratégies d'agrégation et de fusion progressives

### Méthodes et algorithmes statistiques

??? "Analyse des cartes de contrôle"

    Les volumes de services sont agrégés au niveau géographique spécifié (configurable via `CONTROL_CHART_LEVEL`). Le pipeline supprime les valeurs aberrantes (`outlier_flag == 1`), complète les mois manquants et filtre les mois à faible volume (<50% du volume moyen global).

    Un modèle de régression robuste estime les volumes de services attendus par indicateur × zone géographique (`panelvar`). Une médiane roulante centrée est appliquée pour lisser les valeurs prédites. Les résidus (réels - lissés) sont normalisés à l'aide de MAD. Les perturbations sont identifiées à l'aide d'un système de marquage basé sur des règles.

    #### Règles de détection des perturbations

    Chaque règle est contrôlée par des paramètres définis par l'utilisateur, ce qui permet de personnaliser la sensibilité et le comportement de la logique de détection :

    **Perturbations brutales** : Signale un mois unique lorsque le résidu standardisé (résidu divisé par MAD) dépasse un seuil :

    $$ \left| \frac{\text{residual}}{\text{MAD}} \right| \geq \text{MADS\_THRESHOLD} $$

    - **Paramètre :** `MADS_THRESHOLD` (par défaut : `1.5`)
    - Des valeurs plus faibles rendent la détection plus sensible aux pics ou aux creux soudains.

    **Chutes soutenues** : Signale une baisse soutenue si :

    - Trois mois consécutifs présentent de légères déviations (résidu standardisé >= 1 mais < `MADS_THRESHOLD`), et
    - Le mois en cours a un résidu standardisé >= 1,5 (seuil codé en dur).

    Cela permet de capter les baisses plus lentes et composées.

    **Baisses soutenues** : Signale les périodes où le volume réel tombe constamment en dessous d'une proportion définie du volume attendu (prédiction lissée) :

    $$ \text{count\_original} < \text{DIP\_THRESHOLD} \times \text{count\_smooth} $$

    - **Paramètre :** `DIP_THRESHOLD` (par défaut : `0.90`)
    - Les utilisateurs peuvent ajuster ce paramètre pour détecter des baisses plus ou moins importantes (par exemple, `0.80` pour une baisse de 20%).

    **Hausses soutenues** : Symétrique aux baisses, signale les périodes de surperformance constante :

    $$ \text{count\_original} > \text{RISE\_THRESHOLD} \times \text{count\_smooth} $$

    - **Paramètre :** `RISE_THRESHOLD` (par défaut : `1 / DIP_THRESHOLD`, par exemple, `1.11`)
    - Les utilisateurs peuvent ajuster ce paramètre pour détecter les hausses de volume.

    **Données manquantes** : Ce code est utilisé lorsque 2 mois ou plus sur les 3 derniers mois ont un volume de service manquant (`NA`) ou nul.

    - **Règle fixe**.

    **Dérogation pour la période récente** : Marquage automatique de tous les mois des 6 derniers mois de données pour s'assurer que les tendances récentes sont examinées, même si le marquage basé sur un modèle n'est pas concluant.

    - **Règle fixe**.

    **Indicateur final** : Un mois se voit attribuer `tagged = 1` si **l'une** des conditions suivantes est remplie :

    - `tag_sharp == 1`
    - `tag_sustained == 1`
    - `tag_sustained_dip == 1`
    - `tag_sustained_rise == 1`
    - `tag_missing == 1`
    - Il se situe dans les 6 mois les plus récents (`last_6_months == 1`)

    ### Modèle de régression robuste

    **Ajustement du modèle** :

    Si >= 12 observations et > 12 dates uniques :

    $$Y_{it} = \beta_0 + \sum \gamma_m \cdot \text{month}_m + \beta_1 \cdot \text{date} + \epsilon_{it}$$

    S'il n'y a que >= 12 observations :

    $$Y_{it} = \beta_0 + \beta_1 \cdot \text{date} + \epsilon_{it}$$

    Si les données sont insuffisantes : utiliser la médiane des valeurs observées.

    **Appliquer le lissage de la médiane roulante aux prédictions** :

    $$ \text{count\_smooth}_{it} = \text{Median}(\text{count\_predict}_{t-k}, \dots, \text{count\_predict}_t, \dots, \text{count\_predict}_{t+k}) $$

    - **Paramètre :** `SMOOTH_K` (par défaut : 7, doit être impair)
    - Un `SMOOTH_K` plus grand lisse davantage ; un plus petit retient plus de variations.

    **Calculer les résidus** :

    $$ \text{residual}_{it} = \text{count\_original}_{it} - \text{count\_smooth}_{it} $$

    **Standardiser les résidus à l'aide de MAD** :

    $$ \text{robust\_control}_{it} = \text{residual}_{it} / \text{MAD}_i $$

    ### Modèles de régression pour l'analyse des perturbations

    Une fois les anomalies identifiées et enregistrées dans `M3_chartout.csv`, l'analyse des perturbations quantifie leur impact à l'aide de modèles de régression. Ces modèles estiment dans quelle mesure l'utilisation des services a changé au cours des périodes de perturbation signalées en tenant compte des tendances à long terme et des variations saisonnières.

    Pour chaque indicateur, nous estimons :

    $$ Y_{it} = \beta_0 + \beta_1 \cdot \text{date} + \sum_{m=1}^{12} \gamma_m \cdot \text{month}_m + \beta_2 \cdot \text{tagged} + \epsilon_{it} $$

    où :
    - $Y_{it}$ est le volume de service observé,
    - $\text{date}$ capture les tendances temporelles,
    - $\text{month}_m$ contrôle la saisonnalité,
    - $\text{tagged}$ est la variable fictive de perturbation (issue de l'analyse de la carte de contrôle),
    - $\epsilon_{it}$ est le terme d'erreur.

    Le coefficient de `tagged` ($\beta_2$) mesure le changement relatif de l'utilisation des services pendant les perturbations signalées. Des régressions distinctes sont effectuées aux niveaux national, provincial et du district afin d'évaluer l'impact à différentes échelles géographiques.

    #### Régression à l'échelle nationale

    La régression à l'échelle nationale permet d'estimer l'évolution de l'utilisation des services au niveau national lorsqu'une perturbation se produit. Au lieu d'analyser séparément les provinces ou les districts, ce modèle prend en compte l'ensemble des données du pays dans une seule régression. Les erreurs sont regroupées au niveau géographique le plus bas disponible (`lowest_geo_level`), généralement les districts.

    **Spécification du modèle :**

    $$Y_{it} = \beta_0 + \beta_1 \cdot \text{date} + \sum_{m=1}^{12} \gamma_m \cdot \text{month} + \beta_2 \cdot \text{tagged} + \epsilon_{it}$$

    Où :
    - $Y_{it}$ = volume (par exemple, nombre d'accouchements)
    - $\text{date}$ = tendance temporelle
    - $\text{month}_m$ = contrôle de la saisonnalité (variable factorielle)
    - $\text{tagged}$ = variable muette pour la période de perturbation
    - $\epsilon_{it}$ = terme d'erreur, regroupé au niveau du district (`admin_area_3`)

    #### Régression au niveau de la province

    La régression des perturbations au niveau de la province permet d'estimer comment l'utilisation des services change au niveau de la province lorsqu'une perturbation se produit. Contrairement au modèle national, cette approche utilise des régressions distinctes pour chaque province afin de saisir les variations régionales.

    **Spécification du modèle** (exécuté séparément pour chaque province) :

    $$Y_{it} = \beta_0 + \beta_1 \cdot \text{date} + \sum_{m=1}^{12} \gamma_m \cdot \text{month} + \beta_2 \cdot \text{tagged} + \epsilon_{it}$$

    Où :
    - $Y_{it}$ = volume (par exemple, nombre d'accouchements)
    - $\text{date}$ = tendance temporelle
    - $\text{month}_m$ = contrôle de la saisonnalité (variable factorielle)
    - $\text{tagged}$ = variable muette pour la période de perturbation
    - $\epsilon_{it}$ = terme d'erreur, regroupé au niveau du district

    #### Régression au niveau du district

    La régression des perturbations au niveau du district permet d'estimer comment l'utilisation des services change au niveau du district lorsqu'une perturbation se produit. Cette approche consiste à effectuer des régressions distinctes pour chaque district afin de saisir les variations localisées.

    **Spécification du modèle** (exécutée séparément pour chaque district) :

    $$Y_{it} = \beta_0 + \beta_1 \cdot \text{date} + \sum_{m=1}^{12} \gamma_m \cdot \text{month} + \beta_2 \cdot \text{tagged} + \epsilon_{it}$$

    Où :
    - $Y_{it}$ = volume (par exemple, nombre d'accouchements)
    - $\text{date}$ = tendance temporelle
    - $\text{month}_m$ = contrôle de la saisonnalité (variable factorielle)
    - $\text{tagged}$ = variable muette pour la période de perturbation
    - $\epsilon_{it}$ = terme d'erreur, regroupé au niveau du quartier (`admin_area_4`) si plusieurs regroupements sont disponibles

    #### Résultats de la régression

    Chaque niveau de régression produit les résultats suivants :

    **Valeurs attendues (`expect_admin_area_*`)** : Volume de service prédit, ajusté pour tenir compte de la saisonnalité et des tendances.

    **Effet de perturbation (`b_admin_area_*`)** : Estimation de la variation relative en cas de perturbations :

    $$ b_{\text{admin\_area\_*}} = -\frac{\text{diff mean}}{\text{predict mean}} $$

    **Coefficient de tendance (`b_trend_admin_area_*`)** : Reflète la tendance à long terme.

    - Positif = augmentation de l'utilisation des services
    - Négatif = baisse de l'utilisation des services
    - Proche de zéro = tendance stable

    **P-value (`p_admin_area_*`)** : Mesure la signification statistique de l'effet de perturbation.

    - Des valeurs plus faibles = une preuve plus forte d'une véritable perturbation

    ### Méthodes statistiques utilisées

    **Régression robuste (`MASS::rlm`)** :

    - Utilise les moindres carrés repondérés de manière itérative (IRLS)
    - Minimise l'influence des valeurs aberrantes et extrêmes
    - Plus résistant à la mauvaise spécification du modèle que les moindres carrés ordinaires
    - Par défaut : pondération de Huber avec un maximum de 100 itérations

    **MAD (écart absolu médian)** :

    - Mesure robuste de l'échelle/variabilité
    - Formule : `MAD = median(|x - median(x)|)`
    - Plus résistant aux valeurs aberrantes que l'écart-type
    - Utilisé pour normaliser les résidus dans le cadre de la détection d'anomalies

    **Régression par panel (`fixest::feols`)** :

    - Estimation à effets fixes avec erreurs types groupées
    - Tient compte de la corrélation des erreurs au sein du groupe
    - Plus efficace que les packages traditionnels de régression en panel
    - Traite gracieusement les panels déséquilibrés

    **Regroupement géographique** :

    - Les régressions utilisent des erreurs standard groupées au niveau géographique le plus bas disponible
    - Cela permet de tenir compte de la corrélation entre les modèles de prestation de services à l'intérieur d'une même zone
    - Exemple : Le modèle national est regroupé par district, le modèle provincial est regroupé par district
    - Évite la sous-estimation des erreurs types et les faux positifs

### Étapes de l'analyse détaillée

??? "Partie 1 : Analyse des cartes de contrôle"

    #### Étape 1 : Préparer les données

    - Chargez les volumes de services ajustés à partir de `M2_adjusted_data.csv`.
    - Charger les indicateurs de valeurs aberrantes à partir de `M1_output_outliers.csv`.
    - Charger les données brutes du SIGS uniquement pour extraire la consultation `facility_id → admin_area_1` (puis les rejeter).
    - Fusionner les indicateurs de valeurs aberrantes dans les données ajustées par établissement × indicateur × mois.
    - Supprimer les lignes marquées comme aberrantes (`outlier_flag == 1`).
    - Créer une variable `date` à partir de `period_id` et extraire `year` et `month`.
    - Créer un `panelvar` unique pour chaque combinaison zone géographique-indicateur.
    - Agréger les données au niveau géographique spécifié en additionnant les `count_model` (sur la base du `SELECTEDCOUNT`) par date.
    - Compléter les mois manquants au sein de chaque panel pour assurer la continuité.
    - Remplir les métadonnées manquantes à l'aide d'un remplissage en avant et en arrière.

    #### Étape 2 : Filtrer les mois à faible volume

    - Calculer le volume moyen global de services pour chaque `panelvar`.
    - Si le `count_original` est < 50% de la moyenne globale, abandonner la valeur en la mettant à `NA`.

    #### Étape 3 : Appliquer la régression et le lissage

    Estimez le volume de service attendu à l'aide d'une régression robuste, puis lissez la tendance prédite.

    - Ajuster la régression robuste (`rlm`) pour chaque panel en utilisant l'une des trois spécifications du modèle en fonction de la disponibilité des données.
    - Appliquer le lissage de la médiane glissante aux prédictions en utilisant la taille de fenêtre `SMOOTH_K`.
    - Si le lissage n'est pas possible (par exemple, sur les bords de la série), revenir aux prédictions du modèle.
    - Calculer les résidus : réel - lissé
    - Normaliser les résidus à l'aide de MAD

    Cette variable de contrôle normalisée est utilisée pour détecter les anomalies à l'étape 4.

    #### Étape 4 : Identifier les perturbations

    Appliquer un marquage basé sur des règles pour identifier les perturbations potentielles. Chaque règle est régie par des paramètres définis par l'utilisateur et dont la sensibilité peut être ajustée :

    - **Perturbations nettes** : Marquer si `|robust_control| >= MADS_THRESHOLD`
    - **Baisses prolongées** : Marquer si 3 mois consécutifs ont des déviations légères (résidu >= 1 mais < MADS_THRESHOLD) et si le mois en cours a un résidu >= 1.5
    - **Baisses soutenues** : Marquer toute la séquence si `count_original < DIP_THRESHOLD × count_smooth` pendant 3+ mois
    - **Hausse soutenue** : Marquer toute la séquence si `count_original > RISE_THRESHOLD × count_smooth` pendant 3+ mois
    - **Données manquantes** : Marquer si 2+ des 3 derniers mois sont manquants ou zéro
    - **Dérogation pour la période récente** : Marquer automatiquement tous les mois des 6 derniers mois de données

    Un mois se voit attribuer `tagged = 1` si l'une des conditions ci-dessus est remplie. Les enregistrements marqués sont sauvegardés dans `M3_chartout.csv` et transmis à l'analyse des perturbations.

??? "Partie 2 : Analyse des perturbations"

    #### Étape 1 : Préparation des données

    - L'ensemble de données `M3_chartout` est fusionné avec l'ensemble de données principal pour intégrer la variable `tagged`, qui identifie les perturbations signalées.
    - Le niveau géographique le plus bas disponible (`lowest_geo_level`) est identifié pour le regroupement, sur la base de la colonne `admin_area_*` de la plus haute résolution disponible.

    #### Étape 2 : Régression au niveau national

    Pour chaque `indicator_common_id`, estimer le modèle au niveau national avec les erreurs regroupées au niveau du district.

    - Un modèle de régression en panel est appliqué au niveau national, estimant le volume de services attendu (`expect_admin_area_1`) pour chaque indicateur.
    - Le modèle contrôle les tendances à long terme et les modèles saisonniers d'utilisation des services.
    - Lorsqu'une perturbation (`tagged = 1`) est identifiée, les volumes de services prévus sont ajustés en supprimant l'effet estimé de la perturbation afin d'isoler son impact.

    #### Étape 3 : Régression intermédiaire au niveau infranational

    Pour chaque combinaison `indicator_common_id` × `admin_area_2`, des modèles infranationaux sont estimés, avec des erreurs standard regroupées à un niveau administratif inférieur.

    - Un modèle de régression en panel à effets fixes est appliqué à un niveau infranational intermédiaire, estimant les volumes de service attendus (`expect_admin_area_2`) tout en tenant compte des caractéristiques géographiques invariantes dans le temps.
    - Le modèle contrôle les tendances historiques et la saisonnalité.
    - Lorsqu'une perturbation est identifiée, les volumes prédits sont ajustés pour isoler l'effet de la perturbation.

    #### Étape 4 : Régression fine au niveau infranational (si `RUN_DISTRICT_MODEL = TRUE`)

    Pour chaque combinaison `indicator_common_id` × `admin_area_3`, des modèles infranationaux sont estimés, avec des erreurs standard regroupées au niveau du quartier (`admin_area_4`) lorsque plus d'un quartier est disponible.

    - Un modèle de régression en panel à effets fixes est appliqué à un niveau infranational fin, estimant les volumes de service attendus (`expect_admin_area_3`).
    - Les panels comportant moins de 10 observations sont ignorés.
    - Le modèle contrôle les tendances historiques et la saisonnalité.
    - Lorsqu'une perturbation est identifiée, les volumes prédits sont ajustés pour isoler l'effet de la perturbation.

    #### Étape 5 : Régression au niveau du quartier (si `RUN_ADMIN_AREA_4_ANALYSIS = TRUE`)

    Pour chaque combinaison `indicator_common_id` × `admin_area_4`, des modèles au niveau du quartier sont estimés, sans regroupement.

    - Un modèle de régression en panel est appliqué au niveau géographique le plus fin, estimant les volumes de service attendus (`expect_admin_area_4`).
    - Les panels comportant moins de 8 observations sont ignorés.
    - Le modèle contrôle les tendances historiques et la saisonnalité.
    - Lorsqu'une perturbation est identifiée, les volumes prédits sont ajustés pour isoler l'effet de la perturbation.

    #### Étape 6 : Préparer les résultats pour la visualisation

    Une fois que les valeurs attendues ont été calculées pour chaque niveau (pays, province, district), le pipeline compare les valeurs prédites et les valeurs réelles pour évaluer l'ampleur de la perturbation.

    Pour chaque mois et chaque indicateur, le pipeline calcule :

    - **La différence absolue et en pourcentage** entre les valeurs prévues et les valeurs réelles :

    $$ \text{diff\_percent} = 100 \times \frac{\text{predicted} - \text{actual}}{\text{predicted}} $$

    - Un paramètre de seuil configurable `DIFFPERCENT` (par défaut : `10`) est utilisé pour déterminer si une perturbation est significative.

        Si la différence en pourcentage dépasse ±10%, la valeur attendue (prédite) est conservée et utilisée pour le tracé et les statistiques récapitulatives. Dans le cas contraire, c'est la valeur réelle observée qui est utilisée.

        Cela permet d'éviter que des fluctuations mineures n'entraînent des perturbations artificielles dans la visualisation, tout en préservant les écarts significatifs.

    - La valeur finale ajustée pour le tracé est stockée dans un champ tel que `count_expected_if_above_diff_threshold`.

        Cette valeur reflète soit :
        - Le nombre prédit (si l'écart est supérieur au seuil), ou
        - Le comptage réel (s'il se situe dans une fourchette acceptable).

    Cette logique est appliquée de manière cohérente à tous les niveaux d'administration. Ces valeurs ajustées sont ensuite exportées dans le cadre des fichiers de sortie finaux pour chaque niveau.


### Exemples de code

??? "Exemple 1 : Exécution du module avec les paramètres par défaut"

    ```r
    # Set working directory
    setwd("/path/to/module/directory")

    # Load required libraries
    library(data.table)
    library(lubridate)
    library(zoo)
    library(MASS)
    library(fixest)
    library(stringr)
    library(dplyr)
    library(tidyr)

    # Configure country
    COUNTRY_ISO3 <- "SLE"
    PROJECT_DATA_HMIS <- "hmis_SLE.csv"

    # Use default settings (admin_area_2 level analysis)
    RUN_DISTRICT_MODEL <- FALSE
    RUN_ADMIN_AREA_4_ANALYSIS <- FALSE

    # Run the module
    source("03_module_service_utilization.R")
    ```

    Avec les paramètres par défaut, le module exécute l'analyse de la carte de contrôle au niveau admin_area_2 et produit des estimations de perturbations pour les niveaux national et régional.

??? "Exemple 2 : Ajustement de la sensibilité de la détection des perturbations"

    ```r
    # Make disruption detection more sensitive (lower thresholds)
    MADS_THRESHOLD <- 1.0        # Flag at 1 MAD (default: 1.5)
    DIP_THRESHOLD <- 0.95        # Flag if <95% of expected (default: 0.90)
    SMOOTH_K <- 5                # Smaller smoothing window (default: 7)

    # Make disruption detection less sensitive (higher thresholds)
    MADS_THRESHOLD <- 2.0        # Flag only at 2 MADs
    DIP_THRESHOLD <- 0.80        # Flag only if <80% of expected
    SMOOTH_K <- 9                # Larger smoothing window

    source("03_module_service_utilization.R")
    ```

    **Cas d'utilisation** : Ajuster la sensibilité en fonction de la qualité des données. Les données plus bruyantes peuvent nécessiter des seuils moins sensibles pour éviter les faux positifs.

??? "Exemple 3 : Exécution d'une analyse au niveau du district"

    ```r
    # Enable district-level analysis (slower but more detailed)
    RUN_DISTRICT_MODEL <- TRUE
    RUN_ADMIN_AREA_4_ANALYSIS <- FALSE

    source("03_module_service_utilization.R")
    ```

    **Cas d'utilisation** : Lorsque des modèles de perturbation au niveau du district sont nécessaires pour la planification de programmes infranationaux.

    **Remarque** : L'analyse au niveau du district augmente considérablement la durée d'exécution. Pour les pays de grande taille, il est possible d'envisager une exécution pendant la nuit.

??? "Exemple 4 : Sélection d'un scénario d'ajustement pour l'analyse"

    ```r
    # Use unadjusted data for sensitivity analysis
    SELECTEDCOUNT <- "count_final_none"
    VISUALIZATIONCOUNT <- "count_final_none"

    # Use outlier-adjusted only
    SELECTEDCOUNT <- "count_final_outliers"
    VISUALIZATIONCOUNT <- "count_final_outliers"

    # Use fully adjusted data (default)
    SELECTEDCOUNT <- "count_final_both"
    VISUALIZATIONCOUNT <- "count_final_both"

    source("03_module_service_utilization.R")
    ```

    **Cas d'utilisation** : Comparer les estimations de perturbations entre différents scénarios d'ajustement de la qualité des données.

??? "Exemple 5 : Optimisation de la mémoire pour les grands ensembles de données"

    ```r
    # Reduce batch sizes for memory-constrained environments
    BATCH_SIZE_CC <- 50      # Control chart batches (default: 100)
    BATCH_SIZE_IND <- 3      # Indicator batches (default: 5)
    BATCH_SIZE_PROV <- 10    # Province batches (default: 20)
    BATCH_SIZE_DIST <- 10    # District batches (default: 15)

    # Disable memory-intensive analyses
    RUN_DISTRICT_MODEL <- FALSE
    RUN_ADMIN_AREA_4_ANALYSIS <- FALSE

    source("03_module_service_utilization.R")
    ```

    **Cas d'utilisation** : Exécution sur des machines avec une RAM limitée (<8GB).

??? "Exemple 6 : Utilisation programmatique des sorties"

    ```r
    # Load disruption analysis outputs
    disruptions_national <- read.csv("M3_disruptions_analysis_admin_area_1.csv")
    shortfalls_national <- read.csv("M3_all_indicators_shortfalls_admin_area_1.csv")

    # Calculate total service shortfall by indicator
    annual_shortfalls <- shortfalls_national %>%
      mutate(year = period_id %/% 100) %>%
      group_by(indicator_common_id, year) %>%
      summarise(
        total_expected = sum(count_expect_sum, na.rm = TRUE),
        total_actual = sum(count_sum, na.rm = TRUE),
        total_shortfall = sum(shortfall_absolute, na.rm = TRUE),
        avg_shortfall_pct = mean(shortfall_percent, na.rm = TRUE),
        .groups = "drop"
      )

    # Identify months with largest disruptions
    worst_months <- shortfalls_national %>%
      filter(shortfall_percent > 10) %>%
      arrange(desc(shortfall_percent)) %>%
      head(20)

    # Load control chart results for detailed analysis
    control_chart <- read.csv("M3_chartout.csv")

    # Count tagged periods by indicator
    tagged_summary <- control_chart %>%
      group_by(indicator_common_id) %>%
      summarise(
        total_periods = n(),
        tagged_periods = sum(tagged, na.rm = TRUE),
        pct_tagged = 100 * tagged_periods / total_periods,
        .groups = "drop"
      )
    ```


### Dépannage

??? "Problèmes courants et solutions"

    #### Problème : Le script se bloque avec l'erreur "out of memory" (manque de mémoire)

    **Solutions** :

    - Réduire la taille des lots (par exemple, `BATCH_SIZE_IND <- 3`)
    - Définir `RUN_DISTRICT_MODEL <- FALSE`
    - Définir `RUN_ADMIN_AREA_4_ANALYSIS <- FALSE`
    - Fermer les autres applications
    - Exécuter sur une machine avec plus de RAM

    ---

    #### Problème : Avertissement "le modèle n'a pas réussi à converger"

    **Explication** : La régression robuste n'a pas complètement convergé dans les 100 itérations

    **Impact** : Généralement minime - une convergence partielle est souvent suffisante

    **Solutions** :

    - Vérifier la qualité des données pour ce panel
    - Augmenter le paramètre `maxit` dans l'appel `rlm()` (ligne 229, 247)
    - Il est généralement possible de l'ignorer si seuls quelques panels sont concernés

    ---

    #### Problème : Nombreuses lignes vides dans les fichiers de sortie

    **Explication** : Données insuffisantes pour certaines combinaisons indicateur-géographie

    **Solutions** :

    - Comportement attendu pour les indicateurs peu nombreux
    - Filtrer les sorties sur les valeurs non manquantes
    - Envisager l'agrégation à un niveau géographique plus élevé

    ---

    #### Problème : Tous les mois récents sont signalés comme perturbations

    **Explication** : Marquage automatique des 6 derniers mois

    **But** : Permet d'examiner les tendances récentes, même en l'absence de preuves statistiques solides

    **Solutions** :

    - Comportement attendu, pas un bogue
    - Examiner les mois récents manuellement
    - Ajuster la logique `last_6_months` si nécessaire (ligne 333)

    ---

    #### Problème : la variable `tagged` a été supprimée de la régression

    **Message** : La variable est automatiquement mise à 0

    **Explication** : Aucune variation de `tagged` dans ce panneau (tout 0 ou tout 1)

    **Solutions** :

    - Attendu dans les panels sans perturbations ou avec des perturbations constantes
    - Il ne s'agit pas d'une erreur - l'effet de perturbation est correctement fixé à 0

    ---

    #### Problème : Des fichiers temporaires subsistent après l'exécution

    **Cause** : Le script s'est arrêté avant le nettoyage

    **Solutions** :

    - Supprimer manuellement : `M3_temp_*.csv`
    - Ou réexécuter le script (nettoyage automatique au démarrage)

    ---

    #### Problème : Résultats très différents selon le niveau géographique

    **Explication** : Des agrégations géographiques différentes permettent de saisir des modèles différents

    **Exemple** : La tendance nationale peut être stable alors que certains districts connaissent d'importantes perturbations

    **Solutions** :

    - Comportement attendu - ce n'est pas un bogue
    - Utiliser le niveau approprié pour votre question de recherche
    - Recouper les modèles entre les différents niveaux pour en vérifier la robustesse

### Notes d'utilisation

??? "Directives d'interprétation"

    **Effets de perturbation (b_admin_area_*)** :

    - Les valeurs négatives indiquent des déficits de volume de service pendant les périodes de perturbation
    - Les valeurs positives indiquent des excédents de volume de service pendant les périodes de perturbation
    - Les valeurs proches de zéro indiquent des effets de perturbation moindres

    **Valeurs P (p_admin_area_*)** :

    - Les valeurs < 0,05 indiquent des perturbations statistiquement significatives
    - Les valeurs > 0,05 peuvent indiquer une variation normale plutôt que de véritables perturbations

    **Coefficients de tendance (b_trend_admin_area_*)** :

    - Les valeurs positives indiquent une augmentation de l'utilisation des services au fil du temps
    - Les valeurs négatives indiquent une diminution de l'utilisation des services au fil du temps
    - Les valeurs proches de zéro indiquent des schémas d'utilisation stables

    ### Considérations sur les performances

    **Facteurs de temps de fonctionnement** :

    - **Nombre d'indicateurs** : Mise à l'échelle linéaire
    - **Nombre d'unités géographiques** : Échelle linéaire à l'intérieur de chaque niveau
    - **Longueur de la série temporelle** : Impact minimal (régression efficace)
    - **Détails géographiques** : Échelle exponentielle (beaucoup plus d'unités à des niveaux plus fins)

    **Temps d'exécution estimés** (exemple de données : 50 indicateurs, 100 districts) :

    - Modèles nationaux + provinciaux : ~5-10 minutes
    - Ajouter des modèles de district : ~30-60 minutes
    - Ajouter des modèles de quartiers : Plusieurs heures (en fonction du nombre de quartiers)

    **Stratégies d'optimisation** :

    - Définir `RUN_DISTRICT_MODEL = FALSE` pour une exécution plus rapide (sauter le niveau du district)
    - Régler `RUN_ADMIN_AREA_4_ANALYSIS = FALSE` (par défaut) pour éviter l'analyse au niveau de la circonscription
    - Réduire `SMOOTH_K` pour un calcul plus rapide de la médiane glissante
    - Utiliser `SELECTEDCOUNT = "count_final_none"` pour éviter les ajustements de complétude

    ### Détails du traitement des données

    **Gestion de la mémoire** :

    - Utilise `data.table` pour des opérations efficaces sur de grands ensembles de données
    - Traitement par lots : Résultats sauvegardés sur disque périodiquement
    - Nettoyage progressif : Objets supprimés lorsqu'ils ne sont plus nécessaires
    - Les fichiers temporaires permettent de traiter des ensembles de données plus grands que la RAM

    **Taille des lots** (ajustable en fonction des contraintes de mémoire) :

    - Carte de contrôle : 100 panneaux par lot
    - Indicateurs : 5 indicateurs par lot
    - Provinces : 20 résultats par lot
    - Districts : 15 résultats par lot
    - Zone administrative 4 : 10 résultats par lot

    **Traitement des données manquantes** :

    1. Les mois manquants sont remplis via `tidyr::complete()`
    2. Remplissage avant/arrière pour les métadonnées
    3. Interpolation linéaire (`zoo::na.approx`) pour les valeurs de comptage
    4. Écart maximal : Illimité (règle = 2 étend les points d'extrémité)

    ### Logique de repli du modèle

    L'analyse de la carte de contrôle utilise une sélection de modèle adaptative basée sur la disponibilité des données :

    **Modèle complet** (nécessite >= 12 obs ET > 12 dates uniques) :

    ```r
    count ~ month_factor + as.numeric(date)
    ```

    Tient compte à la fois de la saisonnalité et de la tendance linéaire

    **Modèle tendance uniquement** (nécessite >= 12 obs) :

    ```r
    count ~ as.numeric(date)
    ```

    Tient compte uniquement de la tendance linéaire (données insuffisantes pour la saisonnalité)

    **Retour à la médiane** (< 12 observations) :

    ```r
    count_predict = median(count)
    ```

    Utilise la médiane globale lorsque les données sont insuffisantes pour la régression

    **Vérifications de convergence** :

    - Modèles dont l'état de convergence a été vérifié
    - Avertissements émis pour les modèles non convergents
    - Les modèles non convergents sont encore utilisés (une convergence partielle est souvent suffisante)

    ### Assurance qualité

    **Nettoyage des données** :

    - Les valeurs aberrantes ont été supprimées avant l'analyse de la carte de contrôle (sur la base des indicateurs du module 1)
    - Les mois à faible volume (< 50% de la moyenne) ont été exclus pour améliorer la stabilité du modèle
    - Prédictions limitées à zéro (les comptes ne peuvent pas être négatifs)

    **Marquage automatique** :

    - Les mois récents (6 derniers mois) sont automatiquement marqués pour garantir la prise en compte des perturbations actuelles
    - Évite de manquer des perturbations en cours en raison d'un écart insuffisant par rapport à la tendance

    **Contrôles de robustesse** :

    - Les coefficients du modèle sont vérifiés pour les valeurs `NA` avant d'être utilisés
    - Si la variable `tagged` est éliminée du modèle (pas de variation), l'effet de perturbation est fixé à 0
    - Les valeurs P ne sont calculées que si des erreurs standard valides sont disponibles

    **Traitement des cas limites** :

    - Panneaux à un seul cluster : Aucun regroupement n'est appliqué (l'analyse échouerait)
    - Données insuffisantes : Sauter l'analyse pour ce panel/niveau
    - Prédictions manquantes : Complétées par les valeurs originales dans la mesure du possible

    ### Intégration du flux de travail

    Ce module est le **module 3** du pipeline analytique FASTR :

    **Prérequis** :

    1. **Module 1** : Évaluation de la qualité des données (génère `M1_output_outliers.csv`)
    2. **Module 2** : Ajustements de la qualité des données (génère `M2_adjusted_data.csv`)

    ### Dépendances

    **Packages R requis** :

    - `data.table` : Manipulation efficace des données
    - `lubridate` : Traitement des dates
    - `zoo` : Statistiques roulantes et interpolation
    - `MASS` : Régression robuste (rlm)
    - `fixest` : Régression de panel à effets fixes
    - `dplyr` : Manipulation des données
    - `tidyr` : Nettoyage des données


---

**Dernière mise à jour** : 06-05-2026
**Contact** : <fastr@worldbank.org>

---

<!--
////////////////////////////////////////////////////////////////////
//                                                                //
//   _____ _     _____ ____  _____    ____ ___  _   _ _____ _   _ //
//  / ____| |   |_   _|  _ \| ____|  / ___/ _ \| \ | |_   _| \ | |//
//  | (___ | |     | | | | | | |__   | |  | | | |  \| | | | |  \| |//
//   \___ \| |     | | | | | |  __|  | |  | | | | . ` | | | | . ` |//
//   ____) | |___ _| |_| |_| | |____ | |__| |_| | |\  | | | | |\  |//
//  |_____/|_____|_____|____/|______| \____\___/|_| \_| |_| |_| \_|//
//                                                                //
//            Edit workshop slides below this line                //
//                                                                //
////////////////////////////////////////////////////////////////////
-->

<!-- SLIDE:m6_1 -->
## Analyse de l'utilisation des services

L'analyse de l'utilisation des services mesure les changements dans les volumes de services de santé au fil du temps. En comparant la prestation de services sur des années consécutives, cette analyse identifie les augmentations ou les diminutions des schémas d'utilisation selon les régions et les indicateurs.

La mesure principale est le **pourcentage de variation d'une année sur l'autre**, qui quantifie les changements dans la prestation de services entre deux années consécutives. La formule calcule la différence entre les volumes de l'année en cours et de l'année précédente, exprimée en pourcentage de l'année précédente. Les changements dépassant ±10% sont signalés pour examen, car ils représentent généralement des changements significatifs dans la prestation de services plutôt que des variations normales.
<!-- /SLIDE -->

<!-- SLIDE:m6_1b -->
## Comparaison de l'utilisation des services avec DHIS2

Les tendances d'utilisation des services sont couramment produites dans DHIS2. L'approche FASTR diffère de trois manières importantes :

- Ajuste pour la qualité des données (valeurs aberrantes et/ou complétude)
- Visualise les données avec l'approche du pourcentage de variation pour faciliter l'identification des fluctuations significatives dans la prestation de services
- Examine les tendances, mais utilise également les données d'utilisation des services ajustées pour des analyses supplémentaires plus complexes
<!-- /SLIDE -->

<!-- SLIDE:m6_1a -->
<!-- _class: compact -->
## Utilisation des services et perturbations : comparaison avec DHIS2

Les tendances d'utilisation des services sont couramment produites dans DHIS2

**Principales différences entre l'approche DHIS2 et FASTR**

- FASTR ajuste pour la qualité des données (valeurs aberrantes et/ou complétude)
- FASTR visualise les données avec l'approche du pourcentage de variation pour faciliter l'identification des fluctuations significatives

**Extension de l'analyse de l'utilisation des services** — approches statistiques plus complexes non disponibles dans DHIS2. En utilisant un cadre de régression, nous sommes en mesure de :

- Tenir compte de la saisonnalité
- Exclure les changements inhabituels pour s'assurer que les événements ponctuels n'influencent pas les tendances normales
- Utiliser les données historiques comme référence pour le contexte
- Détecter les perturbations et les schémas de reprise
- Quantifier les changements avec une méthodologie robuste par rapport à la simple observation des fluctuations dans une ligne de tendance

Cela améliore la capacité à interpréter et comparer les données d'utilisation dans les zones nationales et infranationales sans avoir besoin de dénominateurs de population.
<!-- /SLIDE -->

<!-- SLIDE:m6_2 -->
## Détection des perturbations et excédents de services

L'approche FASTR pour détecter les perturbations et excédents de services utilise la **régression de séries temporelles interrompues (ITS)** avec des effets fixes au niveau de l'établissement. Ce cadre statistique permet une interprétation et une comparaison plus significatives des données de comptage entre les zones infranationales, permettant des analyses que les données brutes seules ne peuvent fournir.

En se concentrant sur les changements et tendances significatifs plutôt que sur les chiffres bruts, cette approche soutient une analyse plus précise et comparable. Les changements importants et inattendus antérieurs dans les données historiques sont supprimés pour établir une référence propre. Les changements de volume inattendus sont estimés en comparant les volumes observés aux volumes attendus basés sur les tendances historiques et la saisonnalité.
<!-- /SLIDE -->

<!-- SLIDE:m6_2b -->
<!-- _class: output -->
## Fonctionnement de la détection des perturbations

<div class="output-layout">
<div class="output-text">

L'analyse se déroule en quatre étapes. Premièrement, nous **utilisons les données passées pour établir des attentes** en examinant plusieurs années de données historiques pour comprendre les schémas mensuels typiques et les variations saisonnières.

Deuxièmement, nous **repérons les changements inhabituels** en comparant les volumes de services actuels aux attentes. Les écarts importants sont signalés pour investigation.

Troisièmement, nous **gérons les perturbations passées** en ajustant les données historiques pour supprimer les changements importants et inattendus. Cela empêche les événements ponctuels de fausser notre référence de prestation « normale ».

Quatrièmement, nous **détectons les perturbations dans le temps** en examinant les tendances sur plusieurs mois pour distinguer les fluctuations temporaires des changements durables.

</div>
<div class="output-viz">

![Détection des perturbations](../resources/diagrams/disruption_chart.png)

</div>
</div>

<!--
PRESENTER NOTES:
1. Utiliser les données passées pour établir des attentes : Nous commençons par examiner les quelques années passées de données sur les services de santé pour comprendre le schéma typique de chaque mois. Par exemple, si nous voyons que certains services ont généralement des volumes plus élevés ou plus bas pendant certains mois, nous utilisons ce schéma pour établir des attentes "normales" pour chaque mois à venir. Cette étape nous aide à tenir compte des changements saisonniers réguliers, comme une augmentation des visites liées à la grippe pendant les mois d'hiver.
2. Repérer les changements inhabituels : Une fois que nous savons à quoi ressemble la "normalité", nous pouvons comparer les volumes de services actuels à ces attentes. Si nous voyons que le nombre de personnes utilisant un service de santé particulier est nettement supérieur ou inférieur aux attentes, nous le signalons comme un changement inhabituel. Cela pourrait être dû à des facteurs comme une épidémie, une catastrophe naturelle ou même des changements dans la politique de santé.
3. Gérer les perturbations passées : Pour maintenir notre analyse précise, nous ajustons nos données historiques en supprimant les grands changements inattendus antérieurs. Cela garantit que les événements ponctuels du passé ne faussent pas notre compréhension de ce qui est "normal" aujourd'hui.
4. Détecter les perturbations dans le temps : Enfin, nous examinons les tendances au fil du temps pour voir s'il y a des changements clairs dans l'utilisation des services de santé. Par exemple, s'il y a une baisse des vaccinations de routine sur plusieurs mois, nous pouvons l'identifier comme une perturbation à plus long terme. En surveillant ces tendances, nous obtenons une meilleure idée de si les changements sont simplement saisonniers ou pourraient être dus à des problèmes plus importants et durables qui nécessitent une attention.
-->
<!-- /SLIDE -->

<!-- SLIDE:m6_2c -->
## Comparaison de la détection des perturbations avec DHIS2

La détection des perturbations étend l'analyse de l'utilisation des services en utilisant des approches statistiques non disponibles dans DHIS2. Le cadre de régression permet plusieurs capacités qui améliorent la simple visualisation des tendances.

Le modèle **tient compte de la saisonnalité** lors du calcul des valeurs attendues, garantissant que les schémas saisonniers ne sont pas confondus avec des perturbations. Il **exclut les changements historiques inhabituels** afin que les événements ponctuels n'influencent pas la référence. **Les données historiques servent de contexte** pour établir les niveaux de service attendus, et le cadre **détecte systématiquement les schémas de perturbation et de reprise**.

Plus important encore, cette approche **quantifie les changements avec une méthodologie robuste** plutôt que de s'appuyer sur l'observation visuelle des fluctuations de tendance. Cela améliore la capacité à interpréter et comparer les données d'utilisation entre les zones nationales et infranationales **sans nécessiter de dénominateurs de population**.
<!-- /SLIDE -->

<!-- SLIDE:m6_2a -->
## Pourquoi détecter les perturbations est important

La détection des perturbations ne consiste pas seulement à signaler des problèmes — elle déclenche une investigation sur les causes profondes.

![Disruptions framing](../resources/diagrams_fr/disruptions_framing.svg)
<!-- /SLIDE -->

<!-- SLIDE:m6_5a -->
<!-- _class: compact -->
## Module d'utilisation des services : Paramètres de configuration

**Note :** Ces paramètres s'appliquent uniquement à l'analyse des perturbations. L'analyse de l'utilisation des services d'une année sur l'autre ne nécessite pas de configuration.

| Paramètre | Description |
|-----------|-------------|
| **Variable de comptage pour la modélisation** | Quel comptage ajusté utiliser pour calculer les valeurs attendues |
| **Variable de comptage pour la visualisation** | Quel comptage ajusté utiliser comme valeurs observées réelles |
| **Exécuter le modèle au niveau du district** | Exécuter les régressions au niveau admin_area_3. Mettre à Oui pour une analyse détaillée, Non pour une exécution plus rapide |
| **Exécuter l'analyse admin_area_4** | Exécuter l'analyse au niveau le plus fin. Avertissement : peut être très lent pour les grands ensembles de données |
| **Seuil pour les limites de contrôle basées sur MAD** | Nombre de MAD pour signaler les écarts importants. Par défaut 1,5 ; plus élevé = moins sensible |
| **Fenêtre de lissage (k)** | Taille de la fenêtre en mois pour le lissage par médiane mobile. Doit être impair. Par défaut 7 |
| **Seuil de baisse** | Signaler si la valeur réelle tombe en dessous de cette proportion de la valeur attendue. Par défaut 0,9 (baisse >= 10%) ; utiliser 0,8 pour ne signaler que les baisses importantes |
| **Seuil de différence en pourcentage** | Mettre en évidence les points où la valeur réelle diffère de la valeur attendue de plus de ce pourcentage. Par défaut 10 |

<!--
PRESENTER NOTES:
- Ces paramètres contrôlent la sensibilité de la détection des perturbations
- Seuil MAD : plus bas = plus sensible (plus de signalements), plus haut = plus conservateur
- Fenêtre de lissage : plus grande = tendances plus lisses, plus petite = capture les changements rapides
- Seuil de baisse : 0,9 signifie signaler si < 90% de la valeur attendue (baisse de 10%)
- L'analyse au niveau du district est optionnelle - augmente considérablement le temps de calcul
- Sélection de la variable de comptage : utiliser "both" pour la plupart des analyses (ajusté pour les valeurs aberrantes + complétude)
- Les paramètres peuvent être ajustés en fonction du contexte du pays et de la qualité des données
-->
<!-- /SLIDE -->

<!-- SLIDE:m6_s0 -->
## Utilisation des services : détecter les changements

Les volumes de services montent et descendent naturellement — plus de cas de paludisme en saison des pluies, par exemple. Comment distinguer une **variation normale** d'une **vraie perturbation** ?

**FASTR apprend le rythme normal** de chaque indicateur dans chaque zone :
- Tendance à long terme (les services augmentent-ils ou diminuent-ils ?)
- Saisonnalité (quels mois sont habituellement plus élevés ?)

Puis il compare les **volumes observés** aux **volumes attendus** :

- **En dessous** de l'attendu → perturbation potentielle (rupture de stock ? grève ? conflit ?)
- **Au-dessus** de l'attendu → hausse inhabituelle (campagne de vaccination ? nouveau programme ?)

Le module mesure **combien de services ont été perdus ou gagnés** et sur quelle durée.
<!-- /SLIDE -->

<!-- SLIDE:m6_s0b -->
## Lire un graphique de perturbation

![w:750](../resources/diagrams_fr/disruption_chart_annotated.svg)

<!--
PRESENTER NOTES:
- La ligne noire = ce qui s'est réellement passé (volumes observés)
- La ligne pointillée = ce que FASTR attendait (basé sur la tendance et la saisonnalité)
- Zone rouge = les services étaient en dessous de l'attendu (perturbation)
- Zone verte = les services étaient au-dessus de l'attendu (surplus)
- La taille de la zone colorée = l'ampleur de l'impact
- Demandez-vous : qu'est-ce qui a causé cette perturbation ? Était-ce un problème de données ou un vrai changement ?
-->
<!-- /SLIDE -->

<!-- SLIDE:m6_s1 -->
## Analyse de l'utilisation des services

L'analyse de l'utilisation des services suit le nombre de services de santé fournis au fil du temps, identifiant les tendances, les anomalies et les comparaisons entre les zones.

<!-- _class: output -->

<div class="output-layout">
<div class="output-viz">

![Nombre de services déclarés h:300](../resources/default_outputs/Module3_5_Number_of_services_reported.png)

</div>
<div class="output-text">

**Ce que vous voyez :** Graphique linéaire montrant les volumes de services absolus au fil du temps par indicateur.

**Ce qu'il montre :** Comptage des services fournis chaque mois/trimestre.

**Interprétation :** Recherchez les tendances globales (augmentation/diminution) et les baisses ou pics soudains qui peuvent nécessiter une investigation.

</div>
</div>
<!-- /SLIDE -->

<!-- SLIDE:m6_s1b -->
<!-- _class: output -->
## Résultat de la variation d'une année sur l'autre

<div class="output-layout">
<div class="output-viz">

![Changement du volume de service h:300](../resources/default_outputs/Module3_1_Change_in_service_volume.png)

</div>
<div class="output-text">

**Ce que vous voyez :** Heatmap comparant la période actuelle à la même période l'année dernière, avec les changements > ±10% signalés.

**Formule :** Changement annuel % = (cette année - année dernière) / année dernière × 100

**Interprétation :** Les changements signalés nécessitent un suivi - s'agit-il d'un vrai changement de programme, d'un problème de données ou d'un événement attendu ?

</div>
</div>

<!--
PRESENTER NOTES:
- Version condensée combinant les tendances de service et la comparaison annuelle
- Le premier graphique montre les volumes absolus - identifier les schémas globaux
- Le deuxième graphique montre les changements relatifs - plus facile à comparer entre les indicateurs
- Les changements annuels > ±10% sont signalés - mais le seuil est configurable
- Pour les changements signalés, demandez : problème de qualité des données, vrai changement de programme ou événement externe ?
- Ces résultats ne nécessitent pas de dénominateurs de population - utile quand les dénominateurs sont incertains
-->
<!-- /SLIDE -->

<!-- SLIDE:m6_s1d -->
## Directionnalité des indicateurs

Chaque indicateur a une direction souhaitée, et une tendance ne peut être interprétée qu'une fois cette direction établie.

- **Indicateurs d'utilisation des services** (consultations prénatales, accouchement assisté, couverture vaccinale) : généralement attendus **à la hausse** à mesure que les systèmes se renforcent.
- **Indicateurs de morbidité et de mortalité** (décès maternels, malnutrition sévère, incidence des maladies) : attendus **à la baisse**.
- **Certains indicateurs s'inscrivent dans une plage souhaitée** plutôt que dans une direction unique. Le taux de césarienne en est l'exemple type : trop bas, il signale un manque d'accès aux soins obstétricaux d'urgence ; trop élevé, il signale une médicalisation excessive.

Avant d'agir sur un changement signalé, vérifiez à quelle catégorie appartient l'indicateur. Une hausse de 15 % des consultations postnatales est une bonne nouvelle ; une hausse de 15 % des décès maternels ne l'est pas. Le même signal statistique peut porter le sens opposé selon l'indicateur.
<!-- /SLIDE -->

<!-- SLIDE:m6_s1a -->
<!-- _class: output -->
## Variation trimestrielle

<div class="output-layout">
<div class="output-viz">

![Variation trimestrielle h:300](../resources/default_outputs/Module3_QoQ_change.png)

</div>
<div class="output-text">

**Ce que vous voyez :** Heatmap comparant le trimestre en cours au trimestre précédent, avec les variations >±10 % signalées.

**Formule :** Variation trimestrielle % = (trimestre en cours – trimestre précédent) / trimestre précédent × 100

**Interprétation :** Les variations signalées nécessitent un suivi — s'agit-il d'un changement réel du programme, d'un problème de données ou d'un événement attendu ?

</div>
</div>

<!--
NOTES DU PRÉSENTATEUR :
- Les variations trimestrielles >±10 % sont signalées — mais le seuil est configurable
- Pour les variations signalées, demandez : problème de qualité des données, changement réel du programme ou événement externe ?
- Ces résultats ne nécessitent pas de dénominateurs de population — utile lorsque les dénominateurs sont incertains
- Complémentaire à la vue annuelle : capture les changements plus récents
-->
<!-- /SLIDE -->

<!-- SLIDE:m6_s2 -->
## Détection des perturbations de services

Au-delà des comparaisons d'une année sur l'autre, nous voulons savoir : **La prestation de services est-elle sur la bonne voie, ou quelque chose l'a-t-elle perturbée ?**

**Le défi :** Les comptages bruts de services sont difficiles à interpréter. Une baisse des services pourrait être une vraie perturbation, ou simplement une variation saisonnière normale. Différentes zones ont des volumes de référence différents, rendant la comparaison directe difficile.

**La solution FASTR :** Utiliser la modélisation statistique pour estimer quel volume de service nous *attendrions* basé sur les tendances historiques et la saisonnalité, puis comparer le volume réel à cette attente.

- **Perturbation :** Volume observé significativement inférieur à l'attendu
- **Excédent :** Volume observé significativement supérieur à l'attendu
<!-- /SLIDE -->

<!-- SLIDE:m6_s2b -->
<!-- _class: output -->
## Résultat de perturbation de service

<div class="output-layout">
<div class="output-viz">

![Résultat de perturbation h:300](../resources/default_outputs/Module3_2_Actual_vs_expected_national.png)

</div>
<div class="output-text">

**Ce que vous voyez :** Graphique comparant le volume de service réel au volume attendu prédit par le modèle, en tenant compte de la saisonnalité.

**Ce qu'il montre :** Écarts par rapport à l'attendu - perturbations (en dessous) ou excédents (au-dessus).

**Interprétation :** Considérez les facteurs externes : COVID, grèves, ruptures de stock, campagnes. Les écarts persistants justifient une investigation du programme.

</div>
</div>

<!--
PRESENTER NOTES:
- Version condensée axée sur la méthodologie de détection des perturbations
- Idée clé : les comptages bruts sont difficiles à interpréter sans contexte
- Le modèle statistique fournit une référence "attendue" tenant compte de la saisonnalité
- Perturbation = écart soutenu en dessous de l'attendu, pas juste un mauvais mois
- Lors de l'interprétation des perturbations, considérez les facteurs externes : COVID, grèves, etc.
- Les écarts persistants justifient une investigation plus approfondie des causes
- Peut être exécuté au niveau national, provincial ou du district selon la qualité des données
-->
<!-- /SLIDE -->
