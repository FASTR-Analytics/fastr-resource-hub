<!-- AUTO-TRANSLATED from 06b_coverage_estimates.md -->
<!-- Add REVIEWED marker after human review to protect from overwrite -->

# Estimations de la couverture

## Contexte et objectif

### Objectif du module

Le module Estimations de la couverture quantifie la couverture des services de santé en intégrant les volumes de services administratifs ajustés du Système d'information sur la gestion de la santé (SIGS), les projections démographiques des Perspectives de la population mondiale des Nations unies (UN WPP) et les données d'enquêtes auprès des ménages. Le module s'appuie actuellement sur les enquêtes démographiques et de santé (EDS) et les enquêtes en grappes à indicateurs multiples (MICS), mais il est conçu pour intégrer d'autres sources d'enquêtes représentatives au niveau national dès qu'elles seront disponibles. Le module estime la part de la population cible qui a bénéficié d'un service de santé donné, fournissant ainsi une mesure standardisée de la portée des services à des fins de suivi, de comparaison et d'analyse en aval.
Le module est structuré en deux composantes.

**La partie 1** construit les dénominateurs de la population cible en utilisant plusieurs approches méthodologiques et évalue leur performance en comparant les estimations de couverture obtenues avec les valeurs de référence des enquêtes disponibles pour chaque indicateur de santé.

**La partie 2** permet aux utilisateurs de revoir et d'ajuster les choix de dénominateurs en fonction de considérations programmatiques et d'étendre dans le temps les estimations de couverture basées sur des enquêtes en utilisant les tendances dérivées des données administratives, lorsque les données d'enquête ne sont pas disponibles.

Ensemble, ces composantes convertissent les volumes de services administratifs en estimations de couverture standardisées qui peuvent être examinées dans le temps et à différents niveaux géographiques, et utilisées dans des contextes d'analyse et de suivi.

### Raison d'être de l'analyse

La couverture des services de santé est une mesure essentielle pour évaluer la performance et l'équité du système de santé. Bien que le module 2 produise des volumes de services ajustés, ces chiffres n'indiquent pas à eux seuls dans quelle mesure les services atteignent les populations qu'ils sont censés desservir. Les estimations de la couverture placent la prestation de services dans son contexte en établissant un lien entre les volumes de services et les besoins de la population.

Ce module aborde les principaux défis liés à l'estimation de la couverture, notamment :

- **Multiples sources de données** : Intégration des données SIGS avec les données d'enquête

- **L'incertitude du denominateur** : Differentes methodes d'estimation des populations cibles peuvent donner des resultats differents ; le module evalue systematiquement les options

- **Lacunes temporelles** : Les enquêtes ont lieu tous les 3 à 5 ans ; le module projette des estimations pour les années intermédiaires en utilisant les tendances administratives

- **Analyse infranationale** : Permet le suivi de la couverture au niveau national, provincial et du district

### Points clés

| Composante | Détails |
|-----------|---------|
| **Entrées** | M2_adjusted_data (nationales et sous-nationales) du module 2<br>Données d'enquête (MICS/EDS) du dépôt GitHub<br>Données de population (UN WPP) du dépôt GitHub |
| **Sorties** | M4_denominators (national, admin2, admin3) - populations cibles calculées<br>M4_combined_results (national, admin2, admin3) - estimations de couverture avec tous les dénominateurs<br>M5_coverage_estimation (national, admin2, admin3) - couverture finale avec projections |
| **Objectif** | Estimer la couverture des services de santé en comparant les volumes de services aux populations cibles, validés par rapport aux références de l'enquête |

### Partie 1 et partie 2 expliquées

**Partie 1 : Calcul et sélection du dénominateur**

- Calcule les populations cibles (dénominateurs) à l'aide de plusieurs approches : SIGS (à partir de CPN1, accouchement, BCG, Penta1) et population (UN WPP)

- Comparaison des estimations de couverture de chaque dénominateur avec les données de l'enquête

- Sélectionne automatiquement le "meilleur" dénominateur pour chaque indicateur en minimisant l'erreur

- Résultats : Ensembles de données sur les dénominateurs et résultats combinés montrant toutes les options

**Partie 2 : Sélection du dénominateur et projection de l'enquête**

- Permet aux utilisateurs d'ignorer les sélections automatiques et de choisir des dénominateurs spécifiques

- Calcul des tendances de couverture d'une année sur l'autre à partir des données administratives

- Projette les estimations de l'enquête vers l'avant en utilisant les tendances du SIGS pour combler les lacunes temporelles

- Résultats : Estimations finales de la couverture combinant les données du SIGS, de l'enquête et les valeurs projetées

---

## Flux de travail analytique

### Aperçu des étapes analytiques

#### Partie 1 : Calcul et sélection du dénominateur

**Étape 1 : Chargement et préparation des sources de données**
Le module commence par le chargement de trois sources de données et la vérification de leur compatibilité. Les données SIGS sont agrégées des totaux mensuels aux totaux annuels. Les données d'enquête sont harmonisées (priorité aux EDS par rapport aux MICS) et complétées pour créer des séries temporelles continues. Les données sur la population sont filtrées en fonction du pays cible.

**Étape 2 : Calculer les options de dénominateurs multiples**
Pour chaque indicateur de santé, le module calcule plusieurs populations cibles possibles :

- **Dénominateurs basés sur les services** : Utilisation des volumes SIGS divisés par la couverture de l'enquête (par exemple, si 10 000 femmes ont reçu des soins prénatals1 et que l'enquête indique que la couverture est de 80 %, le nombre estimé de grossesses est de 10 000/0,80 = 12 500)

- **Dénominateurs basés sur la population** : Utilisation des projections démographiques et des taux de natalité de l'ONU

- Chaque dénominateur est ajusté en fonction de facteurs démographiques (perte de grossesse, mortinatalité, taux de mortalité) pour correspondre au groupe d'âge cible de l'indicateur

**Étape 3 : Calculer la couverture pour chaque dénominateur**
Le module calcule la couverture en divisant le volume de services par chaque option de dénominateur. Il en résulte plusieurs estimations de couverture par indicateur, chacune basée sur une hypothèse de population différente.

**Étape 4 : Comparaison avec les données de référence de l'enquête**
Chaque estimation de couverture est comparée aux données de l'enquête en utilisant le calcul de l'erreur quadratique. L'enquête sert de référence puisqu'elle est basée sur un échantillonnage représentatif des ménages.

**Étape 5 : Sélection du meilleur dénominateur**
Le dénominateur produisant l'erreur la plus faible (la plus proche de l'enquête) est automatiquement sélectionné comme "meilleur" La sélection donne la priorité aux dénominateurs basés sur le SIGS plutôt qu'aux projections démographiques afin de s'assurer que les données sont basées sur la prestation de services observée.

**Étape 6 : Générer des résultats**
Le module enregistre les ensembles de données des dénominateurs pour la transparence et les fichiers de résultats combinés montrant la couverture de tous les dénominateurs plus la meilleure option sélectionnée.

**Étape 7 : Répéter pour les niveaux sous-nationaux**
Si des données infranationales sont disponibles, le processus se répète pour les niveaux administratifs 2 (par exemple, les provinces) et 3 (par exemple, les districts), avec des mécanismes de repli pour gérer les données d'enquête locales manquantes.

#### Partie 2 : Sélection du dénominateur et projection de l'enquête

**Étape 1 : Configuration par l'utilisateur**
Les utilisateurs examinent les résultats de la partie 1 et configurent la sélection des dénominateurs pour chaque indicateur. Les options comprennent l'utilisation de la "meilleure" sélection automatique ou l'utilisation d'un dénominateur spécifique basé sur la connaissance du programme.

**Étape 2 : Filtrer sur les dénominateurs sélectionnés**
Le module filtre les résultats combinés de la partie 1 pour n'inclure que les dénominateurs sélectionnés par l'utilisateur, créant ainsi un ensemble de données ciblé pour l'analyse.

**Étape 3 : Calculer les tendances de la couverture**
Les changements d'une année sur l'autre (deltas) dans la couverture basée sur le SIGS sont calculés. Cela permet de savoir si la couverture augmente, diminue ou est stable dans le temps.

**Étape 4 : Identifier les données de référence de l'enquête**
Pour chaque zone géographique et chaque indicateur, l'observation la plus récente de l'enquête est identifiée comme le point d'ancrage de référence pour les projections.

**Étape 5 : Projeter les estimations de l'enquête dans l'avenir**
Le module étend les estimations de la couverture de l'enquête aux années sans enquête en appliquant les tendances du système d'information sur les ménages. La projection utilise : La valeur de la dernière enquête + (couverture SIGS de l'année en cours - couverture SIGS de l'année de l'enquête). Cela permet de préserver le calibrage de l'enquête tout en incorporant les tendances observées.

**Étape 6 : Combiner toutes les estimations**
Le résultat final fusionne trois types d'estimations :

- **Couverture basée sur le SIMMT** : Calcul direct à partir des volumes de services et des dénominateurs sélectionnés

- **Valeurs originales de l'enquête** : Observations réelles de l'enquête auprès des ménages

- **Couverture projetée de l'enquête** : Estimations de l'enquête étendues à l'aide des tendances du système d'information sur les ménages

**Etape 7 : Sauvegarde des resultats finaux**
Les resultats sont sauvegardes avec des structures de colonnes standardisées pour chaque niveau administratif, prêts pour la visualisation et les rapports.

### Diagramme de flux de travail

<iframe src="../../resources/diagrams/mod4_workflow_FR.html" width="100%" height="800" style="border : 1px solid #ccc ; border-radius : 4px ;" title="module 4 Interactive Workflow"></iframe>

### Points de décision clés

**1. Sélection des dénominateurs**

Dans la partie 1, le module sélectionne automatiquement les options de dénominateur en fonction de leur alignement sur les valeurs de référence disponibles pour l'enquête. Dans la partie 2, les utilisateurs peuvent revoir et remplacer ces sélections en fonction de leurs connaissances programmatiques ou de leurs priorités analytiques. Le choix du dénominateur détermine si les estimations de couverture sont principalement ancrées dans les modèles de prestation de services observés (dénominateurs basés sur le SIGS) ou dans les projections démographiques (dénominateurs basés sur la population).

**2. Traitement des écarts entre les enquêtes**

Les enquêtes auprès des ménages sont menées à intervalles irréguliers, généralement tous les trois à cinq ans. Dans la partie 1, les valeurs de l'enquête sont reportées entre les années d'enquête, ce qui suppose implicitement une couverture constante jusqu'à la prochaine observation de l'enquête. Dans la partie 2, la couverture est projetée vers l'avant en utilisant les tendances dérivées des données SIGS, ce qui permet de refléter les changements dans la prestation de services au cours des périodes sans données d'enquête.

**3. Utilisation de données d'enquête nationales ou infranationales**

Pour les indicateurs de vaccination uniquement, lorsque les estimations de l'enquête infranationale ne sont pas disponibles, le module applique les valeurs de l'enquête nationale aux unités infranationales comme solution de repli. Cette approche suppose que les taux de couverture vaccinale nationaux sont largement représentatifs au niveau infranational, ce qui n'est pas forcément le cas dans tous les contextes. Ce mécanisme de repli n'est pas appliqué à d'autres indicateurs, tels que les services de santé maternelle ou infantile, pour lesquels l'analyse infranationale nécessite des données d'enquête observées localement.

**4. Ajustement des dénominateurs pour les populations cibles**

Chaque indicateur de santé correspond à une population cible spécifique (par exemple, les femmes enceintes pour les soins prénatals ou les nourrissons pour la vaccination des enfants). Le module applique des ajustements démographiques séquentiels - tels que la perte de grossesse, la mortinatalité et la mortalité - afin d'aligner les dénominateurs sur la population cible pertinente pour chaque indicateur.


### Traitement des données et résultats

**Intégration des données**

Le module intègre trois sources de données primaires : les volumes annualisés de services SIGS agrégés par unité géographique ; les estimations de la couverture de l'enquête sur les ménages harmonisées entre les cycles d'enquête et complétées pour créer des séries temporelles continues ; et les projections démographiques filtrées pour extraire les populations spécifiques à l'âge et au sexe pertinentes pour chaque indicateur de santé.

**Construction du denominateur**

En utilisant la relation entre les volumes de services SIGS déclarés et les estimations de couverture basées sur l'enquête, le module dérive des dénominateurs implicites SIGS représentant la taille de la population cohérente avec la prestation de services observée et les niveaux de couverture de l'enquête. Ces dénominateurs sont ensuite ajustés pour refléter les populations cibles spécifiques à l'indicateur par le biais de corrections démographiques séquentielles, y compris la perte de grossesse, la mortinatalité et la mortalité.

**Calcul de la couverture**

Les estimations de couverture multiples sont calculées en divisant les volumes de services par des options de dénominateur alternatives, y compris des approches basées sur la population, des approches implicites SIGS et des approches hybrides. Chaque estimation de couverture est évaluée par rapport aux valeurs de référence de l'enquête afin d'évaluer la plausibilité et d'informer la sélection du dénominateur pour chaque indicateur.

**Projection temporelle**

Pour les annees au-dela de l'observation la plus récente de l'enquête, les estimations de couverture sont projetées en combinant la dernière valeur observée de l'enquête avec les tendances dérivées des données SIGS.

---

### Résultats de l'analyse et visualisation

L'analyse FASTR génère des visualisations d'estimations de couverture à plusieurs niveaux géographiques :

**1. Couverture calculée à partir des données SIGS (national)**

Tendances de la couverture au niveau national comparant les estimations dérivées du SIGS aux références de l'enquête.

![Couverture calculée à partir des données SIGS au niveau national](resources/default_outputs/Module4_1_Coverage_HMIS_National.png)

**2. Couverture calculée à partir des données SIGS (zone administrative 2)**

Modèles de couverture à un niveau infranational intermédiaire (**admin_area_2**), mettant en évidence les variations géographiques dans la prestation de services entre les régions.

![Couverture calculée à partir des données SIGS au niveau de la zone administrative 2](resources/default_outputs/Module4_2_Coverage_HMIS_Admin2.png)

**3. Couverture calculée à partir des données SIGS (zone administrative 3)**

Estimations de la couverture à un niveau infranational plus fin (**admin_area_3**), permettant un suivi plus local et l'identification des disparités infranationales.

![Couverture calculée à partir des données SIGS au niveau de la zone administrative 3](resources/default_outputs/Module4_3_Coverage_HMIS_Admin3.png)

**Guide d'interprétation**

Pour tous les graphiques de couverture (sorties 1-3) :

- **Ligne/points noirs** : Couverture basée sur des enquêtes (EDS/MICS) - la norme de référence
- **Ligne/points gris** : Couverture basée sur le SIGS calculée à partir des données de l'établissement
- **Ligne/points rouges** : Ligne/points rouges** : Couverture projetée étendant les estimations de l'enquête en utilisant les tendances du SIGS
- **Axe Y** : Pourcentage de couverture (0-100%)
- **Axe X** : pourcentage de couverture (0-100%) Période (années)

Niveaux géographiques :

- **Sortie 1** : Tendances au niveau national
- **Sortie 2** : Ventilation de la zone administrative 2 (régionale/provinciale)
- **Résultat 3** : Ventilation du domaine administratif 3 (district) pour le ciblage local

---

## Référence détaillée

### Partie 1 : Calcul du dénominateur (détails techniques)

#### Paramètres de configuration

Le module commence par plusieurs paramètres configurables qui contrôlent l'analyse :

```r
COUNTRY_ISO3 <- "ISO3"                         # ISO3 country code (e.g., "RWA", "UGA", "ZMB")
SELECTED_COUNT_VARIABLE <- "count_final_both"  # Which adjusted count to use
ANALYSIS_LEVEL <- "NATIONAL_PLUS_AA2"          # Geographic scope
```

**Options de niveau d'analyse:**

- cODE_BLOCK_25__ : Analyse au niveau national uniquement
- cODE_BLOCK_26__ : National + zone administrative 2 (par exemple, provinces)
- cODE_BLOCK_27__ : National + zone administrative 2 + zone administrative 3 (par exemple, districts)

**Taux d'ajustement démographique:**
cODE_BLOC_1__ : NATIONAL + ZONE ADMINISTRATIVE 2 + ZONE ADMINISTRATIVE 3 (PAR EXEMPLE, LES districtS)

**Options de la variable de comptage:**

- `count_final_none` : Aucun ajustement (données brutes déclarées)
- cODE_BLOCK_29__ : Ajustement des valeurs aberrantes uniquement
- cODE_BLOC_30__ : Ajustement de l'exhaustivité uniquement
- cODE_BLOC_31__ : Les deux ajustements **(recommandé)**


#### Sources des données d'entrée

La partie 1 intègre trois sources de données primaires :

**1. Données ajustées SIGS** (du module 2)

- Nationales : `M2_adjusted_data_national.csv`
- Sous-national : `M2_adjusted_data_admin_area.csv`
- Contient les volumes de services par indicateur, zone et période

**2. Données d'enquête** (EDS/MICS)

- Source : Dépôt GitHub (ensemble de données d'enquête unifiées) Dépôt GitHub (ensemble de données d'enquête unifiées)
- Fournit des repères de couverture pour la comparaison
- Les données de l'EDS sont privilégiées par rapport à celles des MICS lorsque les deux sont disponibles

**3. Données sur la population** (UN WPP)

- Source : GitHub Dépôt GitHub
- Fournit des dénominateurs basés sur la population
- Inclut la population totale, les naissances, les populations de moins de 1 an et de moins de 5 ans

**Contexte de données supplémentaires:**

**Projections démographiques (UN WPP)**
Issues des Perspectives de la population mondiale des Nations unies, ces estimations fournissent des chiffres de population par âge et de population totale utilisés pour calculer les dénominateurs des estimations de couverture. Ces projections tiennent compte des tendances démographiques, notamment de la fécondité, de la mortalité et des migrations.

**Données d'enquête - MICS**
Les MICS, menées par l'UNICEF, fournissent des estimations basées sur des enquêtes auprès des ménages pour les principaux indicateurs de santé, y compris la couverture des services de santé maternelle et infantile.

**Données d'enquête - EDS**
Les EDS, menées par l'USAID, fournissent des données d'enquête sur l'utilisation des services de santé, y compris les taux de vaccination et la couverture des soins maternels.

#### Documentation sur les fonctions principales

??? "`process_SIGS_adjusted_volume()`"

    **Objectif** : Préparer les données SIGS pour le calcul du dénominateur

    **Entrée** :

    - Données de volume ajustées du module 2
    - Variable de comptage sélectionnée (par exemple, `count_final_both`)

    **Traitement** :

    - Agrégation des données mensuelles en totaux annuels
    - Compte le nombre de mois de déclaration par an
    - Pivote les données en format large (une colonne par indicateur)

    **Résultat** :

    - `annual_SIGS` : Dénombrement annuel des services par zone et par année
    - cODE_BLOCK_37__ : Liste des pays dans l'ensemble de données
    - cODE_BLOCK_38__ : Code(s) ISO3 présent(s)

    **Exemple de structure** :

    ```
    admin_area_1  admin_area_2  year  countANC1  countdelivery  ...  nummonth
    Country_Name  Province_A    2020  12500      10200          ...  12
    Country_Name  Province_A    2021  13000      10500          ...  11
    ```

??? "`process_survey_data()`"

    **Objectif** : Harmoniser et étendre les données d'enquête pour les utiliser comme points de référence en matière de couverture

    **Entrée** :

    - Données d'enquête (EDS/MICS)
    - Noms des pays SIGS et codes ISO3
    - Référence nationale facultative (pour le repli sous-national)

    **Principales étapes du traitement** :

    1. **Harmonisation**
       - Recodage des noms d'indicateurs (par exemple, `polio1` → `VPO1`, `vitamina` → `vitaminA`)
       - Normalise les étiquettes des sources (`EDS`, `MICS`)
       - Filtre par pays et par date

    2. **Hiérarchisation des sources
       - Lorsqu'il existe à la fois des EDS et des MICS pour la même année/zone/indicateur
       - L'EDS est sélectionnée de préférence
       - Préserve les détails de la source pour plus de transparence

    3. **Logique de repli
       - Si `sba` manque, utilise les valeurs de `delivery`
       - Si `pnc1_mother` manque, utilise les valeurs de `pnc1`
       - Les zones infranationales utilisent les valeurs nationales lorsque les données locales ne sont pas disponibles (pour BCG, Penta1, Penta3)

    4. **Remplissage en amont**
       - Crée des séries chronologiques complètes pour chaque zone
       - Reporte la dernière valeur observée (`na.locf`)
       - Crée des colonnes de report (par exemple, `CPN1carry`, `BCGcarry`)

    **Sortie** :

    - `carried` : Données d'enquête étendues avec des valeurs remplies à l'avance
    - cODE_BLOCK_54__ : Observations brutes de l'enquête (format large)
    - cODE_BLOCK_55__ : Observations brutes de l'enquête (format long) avec détails de la source

??? "`process_national_population_data()`"

    **Objectif** : Préparer les estimations de la population du WPP de l'ONU pour le calcul du dénominateur

    **Entrée** :

    - Estimations de la population (UN WPP)
    - Identifiants du pays SIGS

    **Traitement** :

    - Filtre au niveau national et au pays cible
    - Extrait les indicateurs clés de la population :
      - `crudebr_unwpp` : Taux brut de natalité
      - cODE_BLOC_58__ : Population totale
      - cODE_BLOCK_59__ : Population de moins de 1 an

    **Sortie** :

    - `wide` : Indicateurs de population en format large
    - cODE_BLOCK_61__ : Données démographiques en format long avec suivi des sources

??? "`calculate_dénominateurs()`"

    **Objectif** : Calcule tous les dénominateurs possibles à partir des données du système d'information sur les ménages et de la population. Il s'agit de la fonction principale qui génère des estimations de dénominateurs multiples.

    **Entrée** :

    - `SIGS_data` : Dénombrement annuel des services
    - cODE_BLOCK_64__ : Valeurs de référence de l'enquête (reportées)
    - cODE_BLOCK_65__ : Estimations WPP de l'ONU (uniquement au niveau national)

    **Types de dénominateurs calculés** :

    **A. Dénominateurs basés sur les services** (en utilisant le numérateur SIGS ÷ la couverture de l'enquête) :

    1. **De l'CPN1** :
       - `d'anc1_pregnancy` : Grossesses estimées
       - cODE_BLOCK_67__ : Estimation des accouchements
       - cODE_BLOCK_68__ : Estimation des naissances (vivants + mort-nés)
       - cODE_BLOCK_69__ : Estimation des naissances vivantes
       - cODE_BLOC_70__ : Eligible pour le DTC (ajusté pour la mortalité néonatale)
       - cODE_BLOCK_71__ : Éligible pour le MCV1
       - cODE_BLOC_72__ : Eligible pour le MCV2

    2. **A partir de la livraison** :
       - `ddelivery_livebirth`, `ddelivery_birth`, `ddelivery_pregnancy`
       - `ddelivery_DTC`, `ddelivery_rougeole1`, `ddelivery_rougeole2`

    3. **A partir de SBA** (accouchement assisté par un personnel qualifié) :
       - Même structure que les dénominateurs d'accouchement
       - cODE_BLOCK_79__, CODE_BLOCK_80__, CODE_BLOCK_81__, CODE_BLOCK_81__, CODE_BLOCK_82__, CODE_BLOCK_82__, CODE_BLOCK_82__, CODE_BLOCK_82__
       - `dsba_DTC`, `dsba_rougeole1`, `dsba_rougeole2`

    4. **De la part du BCG** (uniquement au niveau national) :
       - `dBCG_pregnancy`, `dBCG_livebirth`, `dBCG_DTC`

    5. **De Penta1** :
       - `dPenta1_DTC`, `dPenta1_rougeole1`, `dPenta1_rougeole2`

    **B. Dénominateurs basés sur la population** (nationaux uniquement) :

    - `dwpp_pregnancy` : Taux brut de natalité × population totale ÷ (1 + taux de gémellité)
    - tAUX DE NATALITÉ BRUT × POPULATION TOTALE ÷ (1 + TAUX DE JUMEAUX) `dwpp_livebirth` : Du taux brut de natalité × population totale
    - cODE_BLOCK_93__ : Population de moins de 1 an
    - cODE_BLOC_94__ : POPULATION DE MOINS DE 1 AN CORRIGÉE POUR TENIR COMPTE DE LA MORTALITÉ NÉONATALE : Population de moins de 1 an ajustée pour la mortalité néonatale
    - cODE_BLOCK_95__ : Ajusté pour la mortalité post-néonatale

    **C. Vitamine A et vaccination complète** :

    Pour chaque dénominateur de naissance vivante, des dénominateurs supplémentaires sont automatiquement créés :

    - `d*_vitaminA` : Naissances vivantes × (1 - U5MR) × 4,5 (enfants de 6 à 59 mois)
    - cODE_BLOC_97__ : NAISSANCE VIVANTE × (1 - RMU5) × 4,5 (ENFANTS DE 6 À 59 MOIS) : Naissance vivante × (1 - TMI)

    **Ajustement pour les déclarations incomplètes** :

    Lorsque `nummonth < 12`, les dénominateurs basés sur la population sont mis à l'échelle :

    ```
    dénominateur_adjusted = dénominateur × (nummonth / 12)
    ```

    **Sortie** :

    Base de données avec tous les dénominateurs calculés et les données originales du SIGS et de l'enquête

??? "`classify_source_type()`"

    **Objectif** : Catégorise les dénominateurs pour éviter les références circulaires

    **Logique** :

    - `reference_based` : Dénominateur calculé à partir du même indicateur (par exemple, `d'anc1_pregnancy` pour CPN1)
    - cODE_BLOC_102__ : Dénominateur calculé à partir des données démographiques du PPS de l'ONU
    - cODE_BLOC_103__ : Dénominateur provenant d'un indicateur de service différent

    **Importance** :

    Cette classification garantit que lors de la sélection des "meilleurs" dénominateurs, nous évitons d'utiliser des dénominateurs basés sur des références (qui montreraient artificiellement une couverture à 100% égale à la valeur de l'enquête).

??? "`compare_couverture_to_survey()`"

    **Objectif** : Sélectionne le dénominateur le plus performant pour chaque indicateur

    **Entrée** :

    - Estimations de la couverture de tous les dénominateurs
    - Valeurs de référence de l'enquête (remplies à l'avance)

    **Algorithme de sélection** :

    1. **Calculer la couverture** : Pour chaque option de dénominateur

       cODE_BLOCK_4__

    2. **Calculer l'erreur** : Comparez à la référence de l'enquête

       cODE_BLOCK_5__

    3. **Classer le type de source** : Étiqueter chaque dénominateur comme indépendant, basé sur des références ou UNWPP

    4. **Hiérarchie de la sélection** :

       ```
       Priority 1: Independent dénominateurs (non-reference, non-UNWPP) → lowest error
       Priority 2: Reference-based dénominateurs (only if no independent available)
       Priority 3: UNWPP dénominateurs (last resort fallback)
       ```

    5. **Cohérence géographique** : Meilleur dénominateur sélectionné par zone géographique × indicateur (et non par année)

    **Résultat** :

    Données de couverture filtrées pour ne retenir que le dénominateur le plus performant pour chaque indicateur, avec classement

    **Décision clé de conception** :

    - Les dénominateurs des PPNU sont exclus de la "meilleure" sélection par défaut
    - Évite une dépendance excessive à l'égard des projections démographiques
    - Assure que les données SIGS déterminent la couverture lorsqu'elles sont disponibles
    - Le PPNU n'est utilisé que lorsqu'il n'existe pas d'options basées sur le SIGS

??? "`create_combined_results_table()`"

    **Objectif** : Fusionne les estimations de couverture et les observations d'enquête en une sortie unifiée

    **Entrée** :

    - Résultats de la comparaison de la couverture (choix du meilleur dénominateur)
    - Observations brutes de l'enquête
    - Toutes les données de couverture (facultatif, comprend tous les dénominateurs)

    **Structure de sortie** :

    ```
    admin_area_1  year  indicateur_common_id  dénominateur_best_or_survey  value
    Country_Name  2020  CPN1                 best                        85.3
    Country_Name  2020  CPN1                 survey                      84.2
    Country_Name  2020  CPN1                 d'anc1_pregnancy             85.3
    Country_Name  2020  CPN1                 dwpp_pregnancy              82.1
    ```

    **Catégories de dénominateurs** :

    - `best` : Dénominateur optimal sélectionné
    - cODE_BLOC_107__ : Observation réelle de l'enquête
    - cODE_BLOCK_108__ : Résultats du dénominateur individuel (toutes les options)

#### Méthodes statistiques et algorithmes

??? "Remplissage (dernière observation reportée)"

    Les données d'enquête présentent généralement des lacunes (par exemple, l'enquête démographique et sanitaire tous les 5 ans). Pour créer des dénominateurs continus :

    ```r
    na.locf(survey_value, na.rm = FALSE)
    ```

    **Exemple** :

    ```
    Year:   2015  2016  2017  2018  2019  2020
    Raw:    85.3  NA    NA    NA    87.2  NA
    Filled: 85.3  85.3  85.3  85.3  87.2  87.2
    ```

    Cela suppose que la couverture reste constante jusqu'à la prochaine observation.

??? "minimisation de l'erreur quadratique"

    Pour sélectionner le meilleur dénominateur :

    $$
    \text{Meilleur dénominateur} = \arg \min_d \sum_{t} (C_{d,t} - S_t)^2
    $$

    Où :

    - $C_{d,t}$ = Couverture utilisant le dénominateur $d$ dans l'année $t$
    - $S_t$ = Couverture de l'enquête au cours de l'année $t$
    - La somme est calculée pour toutes les années pour lesquelles des données d'enquête sont disponibles

#### Cadre conceptuel : Cascades démographiques

Avant de présenter les formules spécifiques, il est important de comprendre le **flux conceptuel** des calculs des dénominateurs. Les dénominateurs sont dérivés d'ajustements démographiques séquentiels qui reflètent la cascade biologique de la grossesse aux populations cibles des services de santé spécifiques.

**Exemple illustratif : De la grossesse à la population éligible au DTC**

Considérons comment une estimation de 10 000 grossesses se traduit en population éligible à la vaccination DTC :

```
Starting point (pregnancies):           10,000
→ After pregnancy loss (3%):            10,000 × (1 - 0.03) = 9,700 deliveries
→ After twin adjustment (1.5% rate):    9,700 × (1 - 0.015/2) = 9,627 births
→ After stillbirths (2%):               9,627 × (1 - 0.02) = 9,435 live births
→ After neonatal deaths (3.9%):         9,435 × (1 - 0.039) = 9,067 DTC-eligible children
```

Cette cascade montre comment chaque facteur démographique réduit séquentiellement la taille de la population au fur et à mesure que l'on passe d'un stade de vie à l'autre. Les formules mathématiques détaillées dans les sections suivantes suivent la même logique, mais fonctionnent dans **les deux sens** :

- **Cascade ascendante** : En partant des indicateurs antérieurs (CPN1, accouchement) et en les ajustant en fonction des populations cibles ultérieures
- **Cascade rétrospective** : En partant d'indicateurs plus récents (BCG, Penta1) et en revenant en arrière pour estimer les populations plus anciennes

Les taux spécifiques et les formules pour chaque source de dénominateur sont détaillés ci-dessous.

#### Calculs du dénominateur basés sur le SIGS

**Dénominateurs dérivés de l'CPN1**

A partir du nombre de services CPN1 et de la couverture de l'enquête, nous calculons :

**Grossesses estimées** (calcul de base) :

$$
d_{\text{CPN1-grossesse}} = \frac{\text{count}_{\text{CPN1}} \times 100}{\text{couverture}_{\text{CPN1}}}
$$

**Accouchements estimés** (ajustés pour les pertes de grossesse) :

$$
d_{\text{CPN1-accouchement}} = d_{\text{CPN1-grossesse}} \n- fois (1 - \text{taux de perte de grossesse})
$$

**Naissances estimées** (ajustées pour les naissances gémellaires) :

$$
d_{\text{CPN1-naissance}} = d_{\text{CPN1-accouchement}} / (1 - 0,5 fois \text{twin rate})
$$

**Naissances vivantes estimées** (ajustées pour les mort-nés) :

$$
d_{\text{CPN1-naissance vivante}} = d_{\text{CPN1-naissance}} \n- fois (1 - \text{taux de mortinatalité})
$$

**Population éligible pour les vaccins DTC/Penta** (ajusté pour la mortalité néonatale) :

$$
d_{\text{CPN1-DTC}} = d_{\text{CPN1-naissance vivante}} \time (1 - \text{taux de mortalité néonatale})
$$

**Population éligible pour le MCV1** (ajusté pour la mortalité post-néonatale) :

$$
d_{\text{CPN1-rougeole1}} = d_{\text{CPN1-DTC}} \time (1 - \text{taux de mortalité post-néonatale})
$$

**Population éligible pour le MCV2** (ajusté pour la mortalité post-néonatale supplémentaire) :

$$
d_{\text{CPN1-rougeole2}} = d_{\text{CPN1-DTC}} \time (1 - 2 \time \text{taux de mortalité post-néonatale})
$$

---

**Dénominateurs dérivés de l'accouchement**

À partir du nombre de livraisons institutionnelles et de la couverture de l'enquête :

**Naissances vivantes estimées** (calcul de base) :

$$
d_{\text{delivery-livebirth}} = \frac{\text{count}_{\text{delivery}} \times 100}{\text{couverture}_{\text{delivery}}}
$$

**Naissances estimées** (ajustées pour la mortinatalité) :

$$
d_{\text{l'accouchement}} = d_{\text{l'accouchement}} / (1 - \text{taux de mortinatalité})
$$

**Grossesses estimées** (ajustées pour les naissances gémellaires et les pertes de grossesse) :

$$
d_{{text{accouchement-grossesse}} = d_{{text{accouchement-naissance}} \n- fois (1 - 0,5 \n- fois \n-{taux de jumeaux}) / (1 - \n-{taux de perte de grossesse})
$$

**Population éligible pour les vaccins DTC/Penta** :

$$
d_{\text{délivrance-DTC}} = d_{\text{délivrance-naissance vivante}} \n- fois (1 - \n-text{taux de mortalité néonatale})
$$

**Population éligible pour le MCV1** :

$$
d_{\text{délivrance-rougeole1}} = d_{\text{délivrance-DTC}} \time (1 - \text{taux de mortalité post-néonatale})
$$

**Population éligible pour le MCV2** :

$$
d_{\text{delivery-rougeole2}} = d_{\text{delivery-DTC}} \time (1 - 2 \time \text{taux de mortalité post-néonatale})
$$

*Note : Les dénominateurs dérivés du accouchement assisté par un personnel qualifié (SBA) suivent les mêmes formules que les dénominateurs d'accouchement.*

---

**Dénominateurs dérivés du BCG** *(analyse nationale uniquement)*

À partir des chiffres de la vaccination BCG et de la couverture de l'enquête :

**Naissances vivantes estimées** (calcul de base) :

$$
d_{\text{BCG-naissances vivantes}} = \frac{\text{count}_{{text{BCG}} \times 100}{\text{couverture}_{\text{BCG}}}
$$

**Grossesses estimées** (en remontant les ajustements démographiques) :

$$
d_{\text{BCG-grossesse}} = \frac{d_{\text{BCG-naissance vivante}}}{(1 - \text{taux de perte de grossesse}) \times (1 + \text{taux de jumeaux}) \times (1 - \text{taux de mortinatalité})}
$$

**Population éligible pour les vaccins DTC/Penta** :

$$
d_{\text{BCG-DTC}} = d_{\text{BCG-livebirth}} \time (1 - \text{taux de mortalité néonatale})
$$

---

**Dénominateurs dérivés de Penta1**

À partir des chiffres de vaccination de Penta1 et de la couverture de l'enquête :

**Population éligible pour les vaccins DTC/Penta** (calcul de base) :

$$
d_{\text{Penta1-DTC}} = \frac{\text{count}_{\text{Penta1}} \times 100}{\text{couverture}_{\text{Penta1}}}
$$

**Population éligible pour le MCV1** :

$$
d_{\text{Penta1-rougeole1}} = d_{\text{Penta1-DTC}} \n- fois (1 - \text{taux de mortalité post-néonatale})
$$

**Population éligible pour le MCV2** :

$$
d_{\text{Penta1-rougeole2}} = d_{\text{Penta1-DTC}} \time (1 - 2 \time \text{taux de mortalité post-néonatale})
$$

---

**Dénominateurs dérivés du nombre de naissances vivantes**

Lorsque les données sur les naissances vivantes sont directement déclarées dans le système SIGS :

**Naissances vivantes estimées** (calcul de base) :

$$
d_{\text{naissances vivantes-naissances vivantes}} = \frac{\text{count}_{{text{naissances vivantes}} \times 100}{\text{couverture}_{\text{livebirth}}}
$$

**Grossesses estimées** (à rebours) :

$$
d_{\text{naissances vivantes-grossesse}} = \frac{d_{{text{naissances vivantes- naissance vivante}} \n- fois (1 - 0.5 \n- fois \n-{taux de jumeaux})}{(1 - \n-{taux de mortinatalité}) \n- fois (1 - \n-{taux de perte de grossesse})}
$$

**Accouchements estimés** :

$$
d_{\text{naissances vivantes-accouchement}} = d_{\text{naissances vivantes-grossesse}} \n- fois (1 - \text{taux de perte de grossesse})
$$

**Naissances estimées** :

$$
d_{\text{naissances vivantes}} = d_{\text{naissances vivantes}} / (1 - \text{taux de mortinatalité})
$$

**Population éligible pour les vaccins DTC/Penta** :

$$
d_{\text{naissances vivantes-DTC}} = d_{\text{naissances vivantes-naissances vivantes}} \n- fois (1 - \n-text{taux de mortalité néonatale})
$$

**Population éligible pour le MCV1** :

$$
d_{\text{naissances vivantes-rougeole1}} = d_{\text{naissances vivantes-DTC}} \n- fois (1 - \n-text{taux de mortalité post-néonatale})
$$

**Population éligible pour le MCV2** :

$$
d_{\text{naissances vivantes-rougeole2}} = d_{\text{naissances vivantes-DTC}} \time (1 - 2 \time \text{taux de mortalité post-néonatale})
$$

#### Calculs du dénominateur basés sur le PPNU

**Dénominateurs dérivés des PPNU** *(analyse nationale uniquement)*

Au lieu d'utiliser les volumes de services, ces dénominateurs sont calculés directement à partir des projections de population et des taux démographiques :

**Grossesses estimées** (à partir du taux brut de natalité et de la population totale) :

$$
d_{\text{wpp-grossesse}} = \frac{\text{Taux brut de natalité}}{1000} \fréquences \fréquences \fréquences \fréquences{Population totale} \frac{1}{1 + \text{twin rate}} \frac{1}{1 + \text{twin rate}}
$$

**Naissances vivantes estimées** (à partir du taux brut de natalité) :

$$
d_{{text{wpp-livebirth}} = \frac{\text{Taux brut de natalité}}{1000} \a fois \text{Population totale}
$$

**Population éligible pour les vaccins DTC/Penta** (population de moins de 1 an) :

$$
d_{\text{wpp-DTC}} = \text{Population totale des moins de 1 an du WPP}
$$

**Population éligible pour le MCV1** (ajusté pour la mortalité néonatale) :

$$
d_{\text{wpp-rougeole1}} = d_{\text{wpp-DTC}} \time (1 - \text{taux de mortalité néonatale})
$$

**Population éligible pour le MCV2** (ajusté pour la mortalité post-néonatale) :

$$
d_{\text{wpp-rougeole2}} = d_{\text{wpp-DTC}} \times (1 - \text{taux de mortalité néonatale}) \times (1 - 2 \times \text{taux de mortalité post-néonatale})
$$

**Ajustement pour les rapports incomplets:**

Lorsque les données SIGS contiennent moins de 12 mois de données rapportées dans une année, tous les dénominateurs de l'UNWPP sont mis à l'échelle pour correspondre à la période de rapport :

$$
d_{\text{adjusted}} = d_{\text{wpp}} \times \frac{\text{months reported}}{12}
$$

Cet ajustement garantit que les dénominateurs sont comparables aux volumes de services qui peuvent ne représenter qu'une partie de l'année.

---

**Dénominateurs dérivés des estimations de naissances vivantes (calculs secondaires)**

Une fois que tous les dénominateurs primaires des naissances vivantes ont été calculés (à partir des CPN1, des accouchements, du BCG, du Penta1, du nombre de naissances vivantes et du WPP), le module génère des estimations supplémentaires de la population cible pour des interventions spécifiques en appliquant des ajustements de la mortalité en fonction de l'âge :

**Enfants âgés de 6 à 59 mois (population cible pour la supplémentation en vitamine A)**

Pour chaque source de dénominateur de naissances vivantes, le nombre estimé d'enfants âgés de 6 à 59 mois est calculé :

$$
d_{\text{source-vitamineA}} = d_{\text{source-naissance vivante}} \n- fois (1 - \text{taux de mortalité des enfants de moins de 5 ans}) \n- fois 4,5
$$

Où :

- `source` représente l'un des éléments suivants : CPN1, delivery, BCG, Penta1, livebirths ou wpp
- Le facteur **4,5** représente la durée approximative (en années) de la tranche d'âge cible pour la vitamine A (6-59 mois ≈ 4,5 ans)
- Le taux de mortalité des moins de 5 ans tient compte de la survie de l'enfant pour atteindre la tranche d'âge de 6 à 59 mois
- Résultat : **Population estimée d'enfants âgés de 6 à 59 mois** éligibles à une supplémentation en vitamine A

**Nourrissons de moins de 12 mois (population cible d'enfants complètement vaccinés)**

Pour chaque source de dénominateur de naissances vivantes, le nombre estimé de nourrissons de moins de 12 mois est calculé :

$$
d_{\text{source-pleinement-immunisée}} = d_{\text{source-naissance-vivante}} \n- fois (1 - \text{taux de mortalité infantile})
$$

Où :

- `source` représente l'un des éléments suivants : CPN1, accouchement, BCG, Penta1, naissances vivantes ou wpp
- Le taux de mortalité infantile est ajusté pour tenir compte de la survie jusqu'à l'âge de 12 mois
- Résultat : **Population estimée de nourrissons de moins d'un an** pouvant bénéficier d'une évaluation complète de la vaccination

Ces estimations de la population cible sont calculées automatiquement pour **tous les dénominateurs de naissances vivantes disponibles**, ce qui garantit une méthodologie cohérente entre les différents indicateurs sources.

#### Étapes d'exécution du flux de travail

La partie 1 exécute le flux de travail suivant pour chaque niveau administratif (national, admin2, admin3) :

**Étape 1 : Chargement et validation des données d'entrée**

- Charger les données ajustées du module 2 du SIGS (fichiers nationaux et infranationaux)
- Charger les données d'enquête à partir du dépôt GitHub (ensemble de données EDS/MICS unifiées)
- Charger les données de population du WPP de l'ONU à partir du dépôt GitHub
- Valider la correspondance des codes ISO3 entre les ensembles de données
- Agréger les données mensuelles du SIGS en totaux annuels
- Harmoniser les données d'enquête (priorité à l'EDS par rapport à l'enquête MICS)
- Remplir les valeurs de l'enquête pour créer des séries temporelles continues

**Étape 2 : Calculer les dénominateurs basés sur l'enquête SIGS**

- Pour chaque indicateur de santé avec des données de couverture d'enquête :
  - Calculer le dénominateur de base : `count ÷ survey_couverture`
  - Appliquer les cascades démographiques pour dériver les dénominateurs correspondants
  - Générer des dénominateurs à partir de tous les indicateurs sources disponibles (CPN1, accouchement, BCG, Penta1, naissances vivantes)

**Étape 3 : Calculer les dénominateurs basés sur le WPP**

- Extraire les projections démographiques pour le pays cible
- Calculer les estimations de grossesses à partir du taux brut de natalité
- Calculer les estimations de naissances vivantes
- Générer des dénominateurs pour la population de moins de 1 an
- Appliquer les ajustements de mortalité pour les populations éligibles à la vaccination
- Ajuster pour les périodes de déclaration incomplètes (mois déclarés < 12)

**Étape 4 : Calcul des dénominateurs secondaires**

- Pour chaque dénominateur `*_livebirth` :
  - Calculer le dénominateur de la vitamine A : __CODE_BLOC_113__
  - Calculer le dénominateur de la vaccination complète : __CODE_BLOC_114__

**Étape 5 : Calculer les estimations de couverture**

- Diviser le volume de services SIGS par chaque option de dénominateur
- Créer des estimations de couverture pour toutes les combinaisons indicateur-dénominateur
- Conserver la couverture basée sur l'enquête comme référence

**Étape 6 : Sélectionner le meilleur dénominateur**

- Pour chaque indicateur, comparer toutes les estimations de couverture basées sur le dénominateur aux données de l'enquête
- Calculer l'erreur quadratique : `Σ(couverture_d,t - survey_t)²`
- Sélectionner le dénominateur avec l'erreur minimale comme "meilleur"
- Appliquer les règles de préférence (préférer le SIGS au WPP)
- Marquer les dénominateurs comme "référence" s'ils proviennent du même service

**Étape 7 : Formatage et enregistrement des résultats**

- Sauvegarder les fichiers de dénominateurs avec les métadonnées de la source et de la cible
- Enregistrer les résultats combinés avec toutes les estimations de couverture
- Marquer le meilleur dénominateur pour faciliter le filtrage
- Inclure les valeurs de l'enquête dans les résultats
- Créer des fichiers séparés pour les niveaux national, admin2 et admin3
- Générer des fichiers vides avec la structure correcte pour les niveaux d'administration non disponibles

??? "Spécification des fichiers de sortie"

    La partie 1 génère sept fichiers CSV :

    **Fichiers dénominateurs**

    **1. M4_dénominateurs_nationaux.csv**

    **2. M4_dénominateurs_admin2.csv**

    **3. M4_dénominateurs_admin3.csv**

    **Structure** :

    ```
    admin_area_1, [admin_area_2/3], year, dénominateur, source_indicateur, target_population, value
    ```

    **Champs** :

    - `dénominateur` : Nom complet du dénominateur (par exemple, `d'anc1_livebirth`)
    - `source_indicateur` : Service utilisé (par exemple, `source_CPN1`, `source_wpp`)
    - `target_population` : Groupe cible (par exemple, `target_livebirth`, `target_DTC`)
    - __CODE_BLOC_124__ : Taille du dénominateur calculée

    **Fichiers de résultats combinés

    **4. M4_résultats_combinés_nationaux.csv**

    **5. M4_combiné_résultats_admin2.csv**

    **6. M4_combiné_résultats_admin3.csv**

    **Structure** :

    ```
    admin_area_1, admin_area_3, year, indicateur_common_id, dénominateur_best_or_survey, value
    ```

    **Champs** :

    - `indicateur_common_id` : Indicateur de santé (par exemple, `CPN1`, `Penta3`)
    - `dénominateur_best_or_survey` : Soit `best`, `survey`, soit un nom de dénominateur spécifique
    - cODE_BLOC_131__ : Pourcentage de couverture (0-100+)

    **Entrée spéciale "meilleure "** : Duplique le dénominateur optimal sélectionné pour faciliter le filtrage

    **7. M4_dénominateur_par_indicateur_sélectionné.csv**

    **Objectif** : Résumé du dénominateur le plus performant sélectionné pour chaque indicateur à chaque niveau géographique

    **Structure** :

    ```
    indicateur_common_id, dénominateur_national, dénominateur_admin2, dénominateur_admin3
    ```

    **Champs** :

    - `indicateur_common_id` : Indicateur de santé (par exemple, `CPN1`, `Penta3`)
    - cODE_BLOC_135__ : Meilleur dénominateur pour la couverture au niveau national
    - cODE_BLOCK_136__ : Meilleur dénominateur pour la couverture au niveau 2 de l'administration
    - `dénominateur_admin3` : Meilleur dénominateur pour la couverture au niveau 3 de l'administration

??? "Sauvegarde et validation des données"

    La partie 1 comprend de multiples contrôles de validation :

    1. **Validation ISO3** : Vérifie que les données de l'enquête et de la population correspondent à celles du pays SIGS

    2. **Correspondance géographique** : Validation des noms des régions administratives entre le SIGS et l'enquête
       - Rapporte le taux de concordance (par exemple, "15/20 régions concordent")
       - Retourne au niveau géographique supérieur en cas de non-concordance

    3. **Mécanismes de repli** :
       - Sous-national → national si aucune donnée d'enquête locale n'est disponible
       - SBA → Livraison si SBA manquant
       - PNC1_mother → PNC1 si données manquantes

    4. **Traitement des cas de bordure** : Détecte quand admin_area_3 doit être utilisé comme admin_area_2 dans certains contextes nationaux

    5. **Gestion des données vides** : Crée des CSV vides avec une structure correcte lorsque les données ne sont pas disponibles

    6. **Gestion des erreurs** : Enveloppe le traitement de l'enquête dans `tryCatch` pour gérer les erreurs de manière élégante

??? "Indicateurs pris en charge"

    La partie 1 traite les indicateurs de santé suivants :

    **Santé maternelle** :

    - `CPN1` : Soins prénatals 1ère visite
    - cODE_BLOCK_140__ : Soins prénatals 4+ visites
    - cODE_BLOCK_141__ : Accouchement en institution
    - cODE_BLOC_142__ : Assistance qualifiée à l'accouchement
    - cODE_BLOCK_143__ : Soins postnatals (enfant)
    - cODE_BLOCK_144__ : Soins postnatals (mère)

    **Immunisation** :

    - `BCG` : Vaccin BCG
    - cODE_BLOCK_146__, CODE_BLOCK_147__, CODE_BLOCK_148__ : Vaccin Pentavalent
    - `rougeole1`, `rougeole2`: Vaccin contenant la rougeole
    - `rota1`, `rota2`: Vaccin contre le rotavirus
    - cODE_BLOCK_153__, CODE_BLOCK_154__, CODE_BLOCK_155__ : VACCIN ANTIPOLIOMYÉLITIQUE ORAL : Vaccin oral contre la polio
    - cODE_BLOCK_156__ : Statut vaccinal complet

    **Santé de l'enfant** :

    - `nmr` : Taux de mortalité néonatale (enquête uniquement)
    - cODE_BLOCK_158__ : Taux de mortalité infantile (enquête uniquement)
    - cODE_BLOCK_159__ : Supplémentation en vitamine A

??? "Notes d'utilisation et bonnes pratiques

    **Quand utiliser quelle variable de comptage**

    - cODE_BLOCK_160__ : Pas d'ajustement (données brutes)
    - cODE_BLOC_161__ : Ajustement des valeurs aberrantes uniquement
    - cODE_BLOCK_162__ : Ajustement de l'exhaustivité uniquement
    - cODE_BLOCK_163__ : Les deux ajustements **(recommandé)**

    **Interprétation des "meilleurs" dénominateurs**

    Le "meilleur" dénominateur peut varier selon l'indicateur et le domaine en fonction de :

    - La disponibilité des données (certains services ne sont pas universellement rapportés)
    - L'exhaustivité des rapports (affecte les dénominateurs basés sur SIGS)
    - La qualité des projections démographiques (affecte les dénominateurs du WPP)
    - Niveaux de couverture de l'enquête (les valeurs extrêmes réduisent les options de dénominateur)

    **Pourquoi plusieurs dénominateurs ?

    Des dénominateurs différents servent des objectifs différents :

    - **Dénominateurs indépendants** : Fournir une validation croisée entre les services
    - **Dénominateurs de référence** : Montrer la cohérence interne du SIGS (mais exclus par défaut des "meilleurs" dénominateurs)
    - **Dénominateurs de référence** : montrent la cohérence interne du système SIGS (mais sont exclus de la "meilleure" valeur par défaut) : Offrent des points de référence basés sur la population
    - La comparaison de plusieurs options révèle des problèmes de qualité des données

??? "Résolution des problèmes courants

    **Problèmes** : Pas de correspondance entre les domaines administratifs du SIGS et de l'enquête

    - **Solution** : Vérifiez que le code ISO3 est correct ; vérifiez les conventions de dénomination des zones administratives ; le module reviendra à l'analyse nationale

    **Problème** : Tous les dénominateurs montrent une couverture >100%

    - **Solution** : Peut indiquer une sous-déclaration dans l'enquête ou une sur-déclaration dans le SIGS ; vérifier la qualité des données dans le module 2

    **Problème** : L'UNWPP a été sélectionné comme "meilleur" pour la plupart des indicateurs

    - **Solution** : Peut indiquer une mauvaise qualité ou complétude des données SIGS ; revoir les ajustements du module 2

---

### Partie 2 : Sélection du dénominateur et projection de l'enquête (détails techniques)

#### But et objectifs

La partie 2 a trois objectifs principaux :

1. **Sélection du dénominateur par l'utilisateur** : Alors que la partie 1 sélectionne automatiquement le "meilleur" dénominateur en minimisant l'erreur par rapport aux données de l'enquête, la partie 2 permet aux utilisateurs d'outrepasser cette sélection et de choisir des dénominateurs spécifiques sur la base de leurs connaissances programmatiques ou de leurs priorités politiques

2. **Analyse des tendances temporelles** : Analyse des tendances temporelles** : calcule les changements d'une année sur l'autre (deltas) dans la couverture pour comprendre les tendances de la prestation de services au fil du temps

3. **Projection de l'enquête** : Projette les estimations de couverture basées sur l'enquête dans le temps en utilisant les tendances observées dans les données administratives (SIGS), en comblant les lacunes lorsque les données de l'enquête ne sont pas disponibles

#### Configuration de l'utilisateur

Les utilisateurs configurent la partie 2 à l'aide de deux ensembles de paramètres clés :

??? "1. configuration de la sélection du dénominateur"

    Au début du script, les utilisateurs spécifient le dénominateur à utiliser pour chaque indicateur :

    ```r
    dénominateur_SELECTION <- list(
      # PREGNANCY-RELATED indicateurS
      CPN1 = "best",                    # Options: "best", "d'anc1_pregnancy", "ddelivery_pregnancy", "dBCG_pregnancy", "dlivebirths_pregnancy", "dwpp_pregnancy"
      CPN4 = "best",

      # LIVE BIRTH-RELATED indicateurS
      delivery = "best",                # Options: "best", "d'anc1_livebirth", "ddelivery_livebirth", "dBCG_livebirth", "dlivebirths_livebirth", "dwpp_livebirth"
      BCG = "best",
      sba = "best",
      pnc1_mother = "best",
      pnc1 = "best",

      # DTC-ELIGIBLE AGE GROUP indicateurS
      Penta1 = "best",                  # Options: "best", "d'anc1_DTC", "ddelivery_DTC", "dPenta1_DTC", "dBCG_DTC", "dlivebirths_DTC", "dwpp_DTC"
      Penta2 = "best",
      Penta3 = "best",
      VPO1 = "best",
      VPO2 = "best",
      VPO3 = "best",

      # rougeole-ELIGIBLE AGE GROUP indicateurS
      rougeole1 = "best",                # Options: "best", "d'anc1_rougeole1", "ddelivery_rougeole1", "dPenta1_rougeole1", "dBCG_rougeole1", "dlivebirths_rougeole1", "dwpp_rougeole1"
      rougeole2 = "best",

      # ADDITIONAL indicateurS
      vitaminA = "best",                # Options: "best", "d'anc1_vitaminA", "dBCG_vitaminA", "ddelivery_vitaminA", "dwpp_vitaminA"
      fully_immunized = "best"          # Options: "best", "d'anc1_fully_immunized", "dBCG_fully_immunized", "ddelivery_fully_immunized", "dwpp_fully_immunized"
    )
    ```

    **Options de dénominateur par type d'indicateur:**

    Les dénominateurs disponibles varient selon le type d'indicateur en fonction de la population cible appropriée :

    - **Indicateurs basés sur la grossesse** (CPN1, CPN4) : Utiliser des dénominateurs ajustés à la grossesse
    - **Indicateurs basés sur les naissances vivantes** (accouchement, BCG, SBA, PNC) : Utiliser les dénominateurs ajustés aux naissances vivantes
    - **Groupe d'âge éligible au DTC** (Penta1-3, VPO1-3) : Utiliser les dénominateurs ajustés pour le DTC (enfants éligibles pour le DTC)
    - **Groupe d'âge éligible pour la rougeole** (Rougeole1, Rougeole2) : Utiliser les dénominateurs ajustés pour la rougeole (enfants éligibles pour le vaccin contre la rougeole)

    Chaque option de dénominateur combine une source (CPN1, Delivery, BCG, Penta1, ou WPP) avec un facteur d'ajustement de l'âge.

??? "2) Configuration du niveau administratif

    ```r
    RUN_NATIONAL <- TRUE  # Always TRUE - national analysis is mandatory
    RUN_ADMIN2 <- TRUE    # Enable/disable admin level 2 analysis
    RUN_ADMIN3 <- TRUE    # Enable/disable admin level 3 analysis
    ```

    Le script vérifie automatiquement la disponibilité des données et désactive les niveaux administratifs sans données.

#### Fonctions et méthodes principales

??? "Fonction 1 : `couverture_deltas()`"

    **Objectif** : Calculer les changements de couverture d'une année sur l'autre pour chaque combinaison indicateur-dénominateur-géographie.

    **Algorithme** :

    ```r
    couverture_deltas <- function(couverture_df, lag_n = 1, complete_years = TRUE)
    ```

    **Processus** :

    1. Regroupement des données par géographie (zones administratives), par indicateur et par dénominateur
    2. Complète éventuellement les années manquantes pour créer une série chronologique complète
    3. Trie les données par ordre chronologique au sein de chaque groupe
    4. Calcule le delta comme suit $\Delta\text{couverture}_t = \text{couverture}_t - \text{couverture}_{t-1}$

    **Formulation mathématique** :
    $$
    \Delta C_{i,d,g,t} = C_{i,d,g,t} - C_{i,d,g,t-1}
    $$

    où :
    - $C$ = estimation de la couverture
    - $i$ = indicateur
    - $d$ = dénominateur
    - $g$ = zone géographique
    - $t$ = temps (année)

    **Entrée** :

    - `couverture_df` : Cadre de données avec les estimations de couverture
    - cODE_BLOCK_166__ : Nombre d'années de décalage (par défaut = 1 pour une comparaison d'une année sur l'autre)
    - cODE_BLOCK_167__ : Remplir ou non les années manquantes (par défaut = VRAI)

    **Sortie** :

    Cadre de données avec les valeurs de couverture originales et une colonne `delta` montrant les changements d'une année sur l'autre.

    **Exemple de sortie** :

    exemple de sortie : - admin_area_1 | indicateur_common_id | dénominateur | year | couverture | delta | admin_area_1 | indicateur_common_id | dénominateur | an | couverture | delta
    |--------------|---------------------|-------------|------|----------|-------|
    | Pays A | Penta3 | dPenta1_DTC | 2018 | 75.2 | NA
    | Pays A | Penta3 | dPenta1_DTC | 2019 | 78.5 | 3.3 |
    | Pays A | Penta3 | dPenta1_DTC | 2020 | 80.1 | 1.6 | Pays A | Penta3 | dPenta1_DTC | 2018 | 75.2 | NA

??? "Fonction 2 : `project_survey_from_deltas()`"

    **Objectif** : Projette les estimations de couverture basées sur les enquêtes en utilisant les tendances des données administratives.

    **Algorithme** :

    ```r
    project_survey_from_deltas <- function(deltas_df, survey_raw_long)
    ```

    **Processus** :

    1. **Identifier la ligne de base** : Pour chaque combinaison géographie-indicateur, trouver l'observation la plus récente de l'enquête
       - Extraire la dernière année d'enquête observée
       - Enregistrer la valeur de la couverture de référence pour cette année-là

    2. **Attacher la base de référence à chaque chemin de dénominateur** : Étant donné que la partie 2 opère sur des sélections de dénominateurs spécifiques, attachez la ligne de base à chaque série de dénominateurs

    3. **Calculer les deltas cumulés** : Pour les années postérieures à l'année de référence, calculez la somme cumulative des deltas :

       $$\text{cumulative delta}_t = \sum_{\tau = \text{année de référence} + 1}^{t} \Delta C_\tau$$

    4. **Calculer la projection** : Ajouter le delta cumulé à la valeur de référence :

       $$\text{Couverture projetée}_t = \text{Couverture de base} + \text{délta cumulatif}_t$$

    **Formulation mathématique** :

    Pour chaque indicateur $i$, dénominateur $d$ et géographie $g$ :

    1. Trouver la ligne de base :

    $$
    y_{\text{valeur de référence}} = \max\{t : S_{i,g,t} \text{ existe}\}
    $$

    $$
    S_{\text{valeur de référence}} = S_{i,g,y_{\text{valeur de référence}}}
    $$

    2. Pour $t > y_{\text{valeur de référence}}$ :

    $$
    \hat{S}_{i,d,g,t} = S_{text{valeur de référence}} + \sum_{\tau = y_{\text{valeur de référence}} + 1}^{t} \Delta C_{i,d,g,\tau}
    $$

    où :

    - $S$ = estimation de la couverture basée sur l'enquête
    - $S$ = estimation de la couverture basée sur l'enquête $S$ = estimation de la couverture basée sur l'enquête $S$ = estimation de la couverture basée sur l'enquête
    - $Delta C$ = variation de la couverture administrative d'une année sur l'autre

    **Hypothèses** :

    - Les tendances observées dans les données administratives reflètent les changements réels dans la couverture des services
    - L'enquête de référence fournit un point de référence précis
    - Les tendances observées dans les données administratives peuvent être appliquées aux estimations de l'enquête

    **Entrée** :

    - `deltas_df` : Sortie de `couverture_deltas()` contenant les changements de couverture
    - bLOC_CODE_172__ : Données brutes de l'enquête avec les années et les valeurs

    **Sortie** :

    Cadre de données avec la couverture projetée pour chaque année, indicateur, dénominateur et combinaison géographique.

    **Exemple de sortie** :

    | La couverture de l'indicateur est calculée à partir de l'année de référence et de l'année projetée
    |--------------|---------------------|-------------|------|---------------|-----------|
    | Pays A | Penta3 | dPenta1_DTC | 2018 | 2018 | 75.0 |
    | Pays A | Penta3 | dPenta1_DTC | 2019 | 2018 | 78.3 |
    | Pays A | Penta3 | dPenta1_DTC | 2020 | 2018 | 79.9 |

??? "Fonction 3 : `build_final_results()`"

    **Objectif** : Combine la couverture SIGS, les estimations de l'enquête projetée et les valeurs de l'enquête originale dans un ensemble de données de sortie unifié.

    **Algorithme** :

    ```r
    build_final_results <- function(couverture_df, proj_df, survey_raw_df = NULL)
    ```

    **Processus** :

    1. **Préparation de la couverture SIGS** : Extraire les estimations de couverture des données administratives
       - Renommer la colonne couverture en `couverture_cov` pour plus de clarté

    2. **Fusionner les projections** : Joindre les estimations projetées de l'enquête
       - Correspondance par géographie, année, indicateur et dénominateur
       - Créer une colonne `couverture_avgsurveyprojection`

    3. **Traiter les données d'enquête originales** (si elles sont disponibles) :
       - Regrouper plusieurs sources d'enquête en prenant la valeur moyenne
       - Préserver les métadonnées de la source (source, source_detail)
       - Élargir les valeurs de l'enquête à tous les dénominateurs pour cet indicateur

    4. **Calculer les projections finales** : Utiliser une formule de projection améliorée qui s'ancre dans la dernière valeur d'enquête :

       Pour les années postérieures à la dernière année d'enquête :

       $$
       \text{Couverture projetée}_t = \text{Dernière valeur d'enquête} + (C_{\text{SIGS},t} - C_{\text{SIGS, dernière année d'enquête}})
       $$

       Cette approche additive
       - Préserve l'étalonnage des données d'enquête
       - Applique la tendance de l'enquête SIGS (delta) pour étendre l'estimation vers l'avant
       - Évite les erreurs cumulées dues aux deltas d'une année sur l'autre

    5. **Combiner les résultats** : Fusionner tous les composants à l'aide d'une jointure externe complète pour préserver :
       - Les années avec seulement des données SIGS
       - Années avec uniquement des données d'enquête
       - Années avec les deux sources de données

    **Formulation mathématique** :

    Let :

    - $t_s$ = année de la dernière enquête
    - $S_{t_s}$ = couverture de l'enquête à l'année $t_s$
    - $C_{\text{SIGS},t}$ = couverture basée sur SIGS à l'année $t$

    Pour $t > t_s$ :

    $$
    \hat{C}_t = S_{t_s} + (C_{\text{SIGS},t} - C_{\text{SIGS},t_s})
    $$

    **Entrée** :

    - `couverture_df` : Estimations de la couverture basées sur le SIGS à partir de dénominateurs sélectionnés
    - cODE_BLOC_177__ : Estimations projetées de l'enquête à partir de __CODE_BLOC_178___
    - cODE_BLOC_179__ : Données d'enquête originales (facultatif)

    **Sortie** :

    Cadre de données complet avec des colonnes :

    - Identifiants géographiques (admin_area_1, admin_area_2, admin_area_3)
    - année, indicateur_common_id, dénominateur
    - cODE_BLOCK_180__ : Couverture basée sur le SIGS
    - bLOC_CODE_181__ : Valeurs de l'enquête initiale
    - cODE_BLOCK_182__ : Couverture projetée de l'enquête
    - cODE_BLOCK_183__ : Source des données de l'enquête (par exemple, "EDS", "MICS")
    - cODE_BLOC_184__ : Informations détaillées sur la source

#### Fonctions d'aide

??? "Fonction d'aide : `filter_by_dénominateur_selection()`"

    **Objectif** : Filtre les résultats combinés de la partie 1 en fonction de la sélection du dénominateur par l'utilisateur.

    **Algorithme** :

    1. Itérer à travers chaque indicateur dans `dénominateur_SELECTION`
    2. Pour chaque indicateur :
       - Si la sélection est "meilleure" : Conserver les lignes où `dénominateur_best_or_survey == "best"` est sélectionné
       - Si la sélection est un dénominateur spécifique : Conserver les lignes où `dénominateur_best_or_survey == selected_dénominateur`
    3. Convertir les lignes sélectionnées au format de couverture (renommer les colonnes, filtrer les entrées de l'enquête)
    4. Combiner les résultats pour tous les indicateurs

    **Entrée** :

    - `combined_results_df` : Résultat de la partie 1 avec toutes les options de dénominateur
    - `selection_list` : La liste de configuration dénominateur_SELECTION

    **Sortie** :

    Trame de données filtrée contenant uniquement les dénominateurs sélectionnés par l'utilisateur.

??? "Fonction d'aide : `extract_survey_from_combined()`"

    **Objectif** : Extrait les valeurs brutes de l'enquête à partir des résultats combinés de la partie 1.

    **Algorithme** :

    1. Filtre pour les lignes où `dénominateur_best_or_survey == "survey"`
    2. Renommer la colonne `value` en `survey_value`
    3. Sélectionner dynamiquement les colonnes pertinentes en fonction des niveaux d'administration présents

    **Entrée** :

    Cadre de données des résultats combinés de la partie 1

    **Sortie** :

    Cadre de données d'enquête avec colonnes : admin areas, year, indicateur_common_id, survey_value

#### Étapes d'exécution du flux de travail

La partie 2 exécute le flux de travail suivant pour chaque niveau administratif (national, admin2, admin3) :

**Étape 1 : Chargement des données**

- Charger les résultats combinés de la partie 1 pour tous les niveaux administratifs
- Vérifier quels niveaux administratifs disposent de données
- Extraire les données de l'enquête pour les utiliser comme base de projection
- Afficher des messages sur la disponibilité des données

**Étape 2 : Pour chaque niveau d'administration**

**Sous-étape 1 : filtrer par sélection du dénominateur**

- Appliquer les choix de dénominateur de l'utilisateur en utilisant `filter_by_dénominateur_selection()`
- Message : Nombre d'enregistrements sélectionnés

**Sous-étape 2 : Calcul des deltas**

- Calculer les changements de couverture d'une année sur l'autre en utilisant `couverture_deltas()`
- Crée des séries chronologiques complètes avec des lacunes comblées

**Sous-étape 3 : projeter les valeurs de l'enquête**

- Utiliser `project_survey_from_deltas()` pour étendre les estimations de l'enquête
- La base est ancrée dans l'enquête la plus récente
- Les projections utilisent les deltas cumulés des tendances SIGS

**Sous-étape 4 : Construire les résultats finaux**

- Combiner la couverture SIGS, les projections et les enquêtes initiales
- Calculer les estimations finales projetées à l'aide d'une formule additive
- Conserver toutes les métadonnées

**Étape 3 : Normaliser et sauvegarder les résultats**

- Définir les colonnes requises pour chaque niveau administratif
- S'assurer que toutes les colonnes requises existent (ajouter NA si elles sont manquantes)
- Ordonner les colonnes correctement
- Supprimer les colonnes inappropriées au niveau de l'administrateur
- Sauvegarder au format CSV avec l'encodage UTF-8
- Créer des fichiers vides pour les niveaux d'administration sans données

#### Spécifications de sortie

La partie 2 produit trois fichiers de sortie :

#### 1. Sortie nationale : `M5_couverture_estimation_national.csv`

**Colonnes** :

- `admin_area_1` : Nom du pays
- cODE_BLOCK_200__ : Année d'estimation
- cODE_BLOC_201__ : Code de l'indicateur standardisé
- cODE_BLOC_202__ : Source du dénominateur sélectionné
- cODE_BLOC_203__ : Couverture initiale basée sur l'enquête (NA pour les années sans enquête)
- cODE_BLOC_204__ : Projection de la couverture de l'enquête à l'aide des tendances SIGS
- cODE_BLOC_205__ : Estimation de la couverture basée sur le SIGS
- cODE_BLOC_206__ : Source de l'enquête (par exemple, "EDS 2018")
- `survey_raw_source_detail` : Détails supplémentaires sur la source

#### 2. Résultats du niveau 2 de l'administration : `M5_couverture_estimation_admin2.csv`

**Colonnes** :

Identique à la colonne nationale, plus :

- `admin_area_2` : Nom de la division administrative de deuxième niveau (par exemple, province, région)


#### 3. Niveau administratif 3 Sortie : `M5_couverture_estimation_admin3.csv`

**Colonnes** :

- `admin_area_1` : Nom du pays
- cODE_BLOC_212__ : Nom de la division administrative de troisième niveau (par exemple, district)
- cODE_BLOC_213__ : Année d'estimation
- cODE_BLOC_214__ : Code de l'indicateur standardisé
- cODE_BLOC_215__ : Source du dénominateur sélectionné
- cODE_BLOC_216__ : Couverture de l'enquête initiale
- cODE_BLOC_217__ : Couverture projetée de l'enquête
- cODE_BLOC_218__ : Couverture basée sur le SIGS
- cODE_BLOC_219__ : Source de l'enquête
- cODE_BLOC_220__ : Détails de la source

#### Considérations méthodologiques

??? "1. stratégie de sélection du dénominateur

    **Quand utiliser le terme "meilleur "** :

    - Incertain quant au dénominateur le plus approprié
    - Souhaite s'appuyer sur la sélection fondée sur les données de la partie 1
    - Point de départ de l'analyse

    **Quand spécifier un dénominateur** :

    - Les connaissances programmatiques suggèrent qu'un dénominateur spécifique est le plus précis
    - Les exigences politiques imposent l'utilisation d'estimations spécifiques de la population
    - Réalisation d'analyses de sensibilité
    - Problèmes connus avec certaines sources de données

??? "2) Méthodologie de projection

    L'approche de projection de la partie 2 utilise une **méthode delta additive** plutôt qu'un remplacement multiplicatif ou direct :

    **Avantages** :

    - Préserve le calibrage en niveau des données d'enquête
    - Prolonge en douceur les estimations de l'enquête en utilisant les tendances administratives
    - Évite les erreurs cumulées dues aux changements d'une année sur l'autre
    - Maintient la cohérence lorsque la couverture SIGS est stable

    **Limites** :

    - Suppose que les tendances SIGS reflètent les véritables changements de couverture
    - Peut diverger de la réalité si la qualité des données administratives diminue
    - Les projections deviennent moins fiables à mesure que l'on s'éloigne de l'enquête de référence
    - Ne tient pas compte des biais systématiques dans les données SIGS

    **Meilleure pratique** : Les projections doivent être validées par rapport aux nouvelles données d'enquête lorsqu'elles sont disponibles, et la base de référence doit être mise à jour avec l'enquête la plus récente.

??? "3. traitement des données manquantes"

    La partie 2 met en œuvre plusieurs stratégies pour les données manquantes :

    - **Séries temporelles complètes** : La fonction `couverture_deltas()` peut combler les années manquantes, créant ainsi une série continue
    - **Les lacunes de l'enquête** : Les projections étendent les estimations vers l'avant, mais les années antérieures à la première enquête restent NA
    - **Lacunes au niveau de l'administration** : Le script détecte automatiquement et saute les niveaux d'administration pour lesquels il n'y a pas de données
    - **Dénominateurs manquants** : Si un dénominateur sélectionné n'existe pas pour un indicateur, cette combinaison indicateur-dénominateur est omise

??? "Cohérence de l'analyse multiniveau"

    La partie 2 traite chaque niveau administratif de manière indépendante :

    - **National** : Estimations agrégées au niveau national
    - **Admin 2** : Estimations provinciales/régionales (la somme peut ne pas correspondre au niveau national en raison de dénominateurs différents)
    - **Administration 3** : Estimations au niveau du district

    **Important** : Les estimations entre les niveaux peuvent ne pas être directement comparables si des dénominateurs différents sont sélectionnés ou si la qualité des données varie selon le niveau.

??? "Validation et contrôles de qualité

    Les utilisateurs doivent valider les résultats de la partie 2 en procédant comme suit

    1. **Contrôlant la vraisemblance des projections** :
       - Les valeurs projetées se situent-elles dans des fourchettes plausibles (0-100%) ?
       - Les tendances ont-elles un sens programmatique ?

    2. **Comparer les dénominateurs** :
       - Exécuter la partie 2 avec différentes sélections de dénominateurs
       - Évaluer la sensibilité des résultats au choix du dénominateur

    3. **Validation par rapport à de nouvelles enquêtes** :
       - Lorsque de nouvelles données d'enquête sont disponibles, comparer les projections aux valeurs réelles
       - Mise à jour de la base de référence et nouvelle exécution si nécessaire

    4. **Examiner les tendances du système SIGS** :
       - Des écarts importants peuvent indiquer des problèmes de qualité des données
       - Les changements soudains doivent faire l'objet d'une enquête

    5. **Cohérence au niveau de l'administration** :
       - Vérifier si les tendances infranationales s'alignent sur les tendances nationales
       - Enquêter sur les écarts importants


??? "Résolution des problèmes courants

    **Problème** : "Pas de données dans les résultats combinés d'admin2"

    - **Cause** : La partie 1 n'a pas traité le niveau 2 de l'administration, ou il n'existe pas de données infranationales
    - **Solution** : Définissez `RUN_ADMIN2 <- FALSE` ou vérifiez les entrées de la partie 1

    **Problème** : Les projections montrent des valeurs non plausibles (>100% ou <0%)

    - **Cause** : Erreurs importantes dans les données SIGS ou dénominateur inapproprié
    - **Solution** : Revoir le choix du dénominateur, vérifier la qualité des données SIGS, envisager un autre dénominateur

    **Problème** : Dénominateurs manquants dans les résultats

    - **Cause** : le dénominateur sélectionné n'a pas été calculé dans la partie 1 pour l'indicateur en question : Le dénominateur sélectionné n'a pas été calculé dans la partie 1 pour cet indicateur
    - **Solution** : Vérifier les options de dénominateur de la partie 1, vérifier la compatibilité entre l'indicateur et le dénominateur

    **Problème** : Lacunes dans la couverture projetée

    - **Cause** : Données SIGS manquantes pour certaines années
    - **Solution** : Examiner les résultats du module 2 et vérifier l'exhaustivité des données


### Exemples de codes

??? "Exemple 1 : Exécution de la partie 1 avec les paramètres par défaut"

    ```r
    # Set working directory
    setwd("/path/to/module/directory")

    # Load required libraries
    library(dplyr)
    library(tidyr)
    library(zoo)
    library(stringr)
    library(purrr)

    # Configure country
    COUNTRY_ISO3 <- "KEN"  # Replace with your country code

    # Use default analysis level (national + admin2)
    ANALYSIS_LEVEL <- "NATIONAL_PLUS_AA2"

    # Run Part 1
    source("05_module_couverture_estimates_part1.R")
    ```

    La partie 1 génère des estimations de dénominateurs et sélectionne le meilleur dénominateur pour chaque indicateur sur la base d'une comparaison d'enquêtes.

??? "Exemple 2 : Ajustement des paramètres de mortalité

    ```r
    # Use country-specific mortality rates from EDS or other sources
    PREGNANCY_LOSS_RATE <- 0.04      # Default: 0.03
    TWIN_RATE <- 0.02                # Default: 0.015
    STILLBIRTH_RATE <- 0.025         # Default: 0.02
    P1_NMR <- 0.045                  # Default: 0.039
    P2_PNMR <- 0.030                 # Default: 0.028
    INFANT_MORTALITY_RATE <- 0.070   # Default: 0.063
    UNDER5_MORTALITY_RATE <- 0.110   # Default: 0.103

    # These parameters affect survival-adjusted dénominateurs
    source("05_module_couverture_estimates_part1.R")
    ```

    **Sources pour les taux spécifiques aux pays** : Rapports finaux des EDS, Groupe interinstitutions des Nations unies pour l'estimation de la mortalité infantile (IGME), ou statistiques nationales de l'état civil.

??? "Exemple 3 : Exécution de la partie 2 avec des sélections de dénominateurs personnalisées"

    ```r
    # Override automatic "best" selection for specific indicateurs
    DENOM_CPN1 <- "d'anc1_pregnancy"      # Use CPN1-based dénominateur
    DENOM_Penta3 <- "dwpp_DTC"           # Use WPP population estimate
    DENOM_rougeole1 <- "best"             # Keep automatic selection

    # Run Part 2
    source("06_module_couverture_estimates_part2.R")
    ```

    **Cas d'utilisation** : Lorsque les connaissances programmatiques suggèrent qu'un dénominateur spécifique est plus approprié que l'option statistiquement sélectionnée.

??? "Exemple 4 : Analyse nationale uniquement pour l'évaluation rapide

    ```r
    # Part 1: Run national level only (faster)
    ANALYSIS_LEVEL <- "NATIONAL_ONLY"
    source("05_module_couverture_estimates_part1.R")

    # Part 2: Will automatically skip infranational levels
    source("06_module_couverture_estimates_part2.R")
    ```

    **Cas d'utilisation** : Analyse exploratoire initiale, ou lorsque les données d'enquêtes infranationales ne sont pas disponibles.

??? "Exemple 5 : Analyse infranationale complète

    ```r
    # Part 1: Include admin3 level
    ANALYSIS_LEVEL <- "NATIONAL_PLUS_AA2_AA3"
    source("05_module_couverture_estimates_part1.R")

    # Part 2: Will process all available levels
    source("06_module_couverture_estimates_part2.R")
    ```

    **Cas d'utilisation** : Analyse détaillée au niveau du district lorsqu'il existe des données d'enquête infranationales.

??? "Exemple 6 : Utilisation programmatique des résultats

    ```r
    # Load couverture outputs
    couverture_national <- read.csv("M5_couverture_estimation_national.csv")
    couverture_admin2 <- read.csv("M5_couverture_estimation_admin2.csv")

    # Filter to specific indicateur
    Penta3_national <- couverture_national %>%
      filter(indicateur_common_id == "Penta3")

    # Compare SIGS-based and survey-projected couverture
    couverture_comparison <- Penta3_national %>%
      select(year, couverture_cov, couverture_avgsurveyprojection, couverture_original_estimate) %>%
      mutate(
        SIGS_survey_gap = couverture_cov - couverture_avgsurveyprojection,
        data_source = case_when(
          !is.na(couverture_original_estimate) ~ "Survey",
          !is.na(couverture_avgsurveyprojection) ~ "Projected",
          TRUE ~ "SIGS only"
        )
      )

    # Identify admin2 areas with couverture below threshold
    low_couverture_areas <- couverture_admin2 %>%
      filter(indicateur_common_id == "Penta3", year == max(year)) %>%
      filter(couverture_avgsurveyprojection < 80) %>%
      arrange(couverture_avgsurveyprojection)
    ```


### Notes d'utilisation

??? "Colonnes du fichier de sortie"

    **Les fichiers de sortie de la partie 2** (`M5_couverture_estimation_*.csv`) contiennent :

    | Colonnes - Description - Colonne - Description - Colonne - Description - Colonne - Description - Colonne - Description
    |--------|-------------|
    | `admin_area_1` | Nom du pays
    | `admin_area_2` / `admin_area_3` | Zone sous-nationale (le cas échéant) | `admin_area_1` / `admin_area_3` | Nom du pays
    année civile | `year` | Année civile | `year` | Année civile
    | Code de l'indicateur de santé | `indicateur_common_id` | Code de l'indicateur de santé
    | Code de l'indicateur de santé | `dénominateur` | Type de dénominateur sélectionné
    | `couverture_cov` | Couverture dérivée du SIGS (numérateur ÷ dénominateur × 100) | `couverture_cov` | Couverture dérivée du SIGS (numérateur ÷ dénominateur × 100)
    | `couverture_original_estimate` | Valeur de l'enquête si disponible |
    | `couverture_avgsurveyprojection` | Valeur de l'enquête projetée à l'aide des tendances du SIGS
    | `survey_raw_source` | Source de l'enquête (EDS/MICS) | `couverture_avgsurveyprojection` | Valeur de l'enquête projetée à l'aide des tendances SIGS
    | __CODE_BLOC_234__ | Nom et année de l'enquête spécifique | __CODE_BLOC_234__ | Source de l'enquête (EDS/MICS)

??? "Examen des options de dénominateur"

    Les fichiers de sortie de la partie 1 (`M4_combined_results_*.csv`) contiennent des estimations de couverture pour toutes les options de dénominateur. Pour les passer en revue :

    1. Ouvrez le fichier des résultats combinés
    2. Filtrez sur l'indicateur qui vous intéresse
    3. Comparer la colonne `value` entre les différentes entrées `dénominateur_best_or_survey`
    4. La ligne marquée `best` montre le dénominateur automatiquement sélectionné
    5. Les lignes marquées `survey` montrent les observations réelles de l'enquête

    Pour annuler la sélection automatique dans la partie 2, définissez les paramètres `DENOM_*` avec un nom de dénominateur spécifique au lieu de `"best"`.

??? "Exigences en matière de données infranationales

    Le module vérifie la disponibilité des données infranationales :

    - Si `ANALYSIS_LEVEL` est défini pour inclure admin2 ou admin3, le module valide l'existence de données d'enquête correspondantes
    - Si aucune donnée d'enquête infranationale correspondante n'est trouvée, le module passe à un niveau géographique supérieur
    - Les messages de la console indiquent les niveaux d'analyse en cours de traitement

??? "Contrôles de validation

    Après avoir exécuté les deux parties, examinez les résultats pour :

    1. Valeurs de couverture en dehors de la plage attendue (négatives ou >100%)
    2. Lacunes dans les séries chronologiques (années manquantes)
    3. Cohérence entre `couverture_cov` et `couverture_avgsurveyprojection`
    4. Sélection du dénominateur dans les résultats de la partie 1

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

<!-- SLIDE:m6_6 -->
## Estimation de la couverture des services - module 4

Estimation du pourcentage de la population cible ayant bénéficié d'un service de santé donné

---

## Notre approche de l'analyse de la couverture des services

Notre approche permet de dériver et de valider les dénominateurs de la population, ce qui améliore considérablement les estimations de couverture communiquées par les systèmes SIGS.

Dans les pays disposant de données précises, cette approche permet d'identifier les inégalités infranationales et de mettre à jour les estimations obsolètes, tandis que dans les pays disposant de données moins précises, les tendances fournissent toujours des informations précieuses sur les performances.

Nous utilisons ces estimations pour suivre les tendances récentes et les disparités infranationales dans la couverture de certains services de santé.

---

## Processus analytique en deux parties

Le module d'estimation de la couverture fonctionne en deux parties séquentielles :

| Partie | Composants |
|------|------------|
| **Partie 1 : Calcul du dénominateur** | Calcul des populations cibles à l'aide de plusieurs méthodes ; comparaison avec les références de l'enquête ; sélection du dénominateur optimal pour chaque indicateur |
| **Partie 2 : Estimation de la couverture** | Appliquer les choix de dénominateurs ; projeter les estimations de l'enquête vers l'avant en utilisant les tendances du SIGS ; générer les estimations finales de la couverture |
<!-- /SLIDE -->

<!-- SLIDE:m6_7 -->
## Qu'est-ce que la couverture des services ?

**La couverture des services** représente la proportion de la population cible qui a bénéficié d'un service de santé spécifique.

![Équation de la couverture](resources/diagrams/coverage_equation.svg)
<!-- /SLIDE -->

<!-- SLIDE:m6_8 -->
## Dénominateurs par type de service

Chaque indicateur de santé correspond à une population cible spécifique :

| Service | Population cible (dénominateur) |
|---------|--------------------------------|
| CPN1, CPN4 | Femmes enceintes |
| Accouchement en institution | Naissances vivantes |
| BCG | Naissances vivantes |
| Penta1, Penta3 | Nourrissons ayant survécu au-delà de la période néonatale |
| Rougeole1, Rougeole2 | Nourrissons survivant au-delà de la période infantile |
<!-- /SLIDE -->

<!-- SLIDE:m6_9 -->
## Cascade démographique

Des ajustements démographiques séquentiels transforment une estimation de la population cible en une autre. En commençant par les grossesses, les facteurs démographiques sont appliqués pour dériver les dénominateurs suivants :

![Organigramme de la cascade du dénominateur](resources/diagrams/denominator_cascade.svg)
<!-- /SLIDE -->

<!-- SLIDE:m6_10 -->
## Cascade de dénominateurs : Illustration

</p> <p style="font-size : 0.85em ;">En partant des comptes du service CPN1, les facteurs d'ajustement démographique sont appliqués séquentiellement pour dériver les dénominateurs des autres services:</p> <p style="font-size : 0.85em ;">Les facteurs d'ajustement démographique sont appliqués séquentiellement pour dériver les dénominateurs des autres services

![Exemple de cascade de dénominateurs h:380](resources/diagrams/denominator_cascade_example.svg)
<!-- /SLIDE -->

<!-- SLIDE:m6_11 -->
## Dérivation avant et arrière

À partir de n'importe quel point d'entrée, la cascade dérive les dénominateurs dans les deux sens :

| Direction | Méthode | Exemple à partir de Penta1 |
|-----------|--------|---------------------|
| **En aval** | Appliquer les taux de mortalité/attrition | Éligible au DTC → Éligible à la rougeole1 → Éligible à la rougeole2 |
| **En amont** | Inverser les taux de mortalité (rajouter les décès) | Éligible au DTC → Naissances vivantes → Naissances → Accouchements → Grossesses |

La dérivation à rebours permet d'estimer les populations en amont à partir des dénombrements de services en aval.
<!-- /SLIDE -->

<!-- SLIDE:m6_12 -->
## Dénominateurs par point d'entrée

<style scoped>
table { font-size : 0.75em ; }
th, td { padding : 0.3em 0.5em !important ; }
</style>

Chaque indicateur SIGS sert de point d'entrée. Le module dérive toutes les populations cibles via des cascades avant et arrière :

| Point d'entrée | Calcul de base | Dérivation en aval | Dérivation en amont |
|-------------|------------------|-------------------|---------------------|
| **CPN1** | CPN1 ÷ couverture → Grossesses | Accouchements → Naissances vivantes → Éligible au DTC → Éligible à la rougeole | — |
| **Accouchements** | Accouchements ÷ couverture → Accouchements | Naissances vivantes → Éligible au DTC → Éligible à la rougeole | Grossesses |
| **BCG** | BCG ÷ couverture → Naissances vivantes | Éligible au DTC → Éligible à la rougeole | Accouchements → Grossesses |
| **Penta1** | Penta1 ÷ couverture → Éligible au DTC | Éligible à la rougeole1 → Éligible à la rougeole2 | Naissances vivantes → Naissances → Accouchements → Grossesses |
| **UN WPP** | Taux de natalité brut × population → Grossesses, naissances vivantes ; Population <1 an → DTC, rougeole | Applique les taux de mortalité pour les dénominateurs rougeole | — |
<!-- /SLIDE -->

<!-- SLIDE:m6_13 -->
## Sélection automatique du dénominateur

Pour chaque indicateur, le module sélectionne le dénominateur qui produit la couverture la plus proche de la référence de l'enquête.

**Algorithme de sélection:**

1. Calculer la couverture en utilisant chaque option de dénominateur
2. Calculer l'erreur quadratique par rapport à l'enquête : $(couverture - enquête)^2$
3. Appliquer la hiérarchie de sélection (les dénominateurs basés sur le SIGS sont prioritaires par rapport au WPP de l'ONU)
4. Sélectionner le dénominateur basé sur le SIGS avec l'erreur minimale

La sélection se fait par indicateur et par zone géographique. Les utilisateurs peuvent annuler les sélections automatiques dans la partie 2.
<!-- /SLIDE -->

<!-- SLIDE:m6_14 -->
## Méthodologie de projection de la couverture

Le module projette la valeur de l'enquête la plus récente en utilisant les tendances observées dans la couverture dérivée du SIGS :

![Méthode de projection de la couverture](resources/diagrams/coverage_projection.svg)

Les changements d'une année sur l'autre (deltas) dans la couverture SIGS sont calculés et appliqués à la dernière valeur de l'enquête. Cette approche préserve la base de référence de l'enquête tout en incorporant les tendances observées en matière de prestation de services.
<!-- /SLIDE -->

<!-- SLIDE:m6_16 -->
## Couverture (nationale)

<div style="display : flex ; gap : 1.5em ; align-items : flex-start ;">
<div style="flex : 1.2 ;">

![Couverture calculée à partir des données SIGS au niveau national. h:340](resources/default_outputs/Module4_1_Coverage_HMIS_National.png)

</div>
<div style="flex : 1 ;">

#### Interprétation

**Les lignes/points noirs** indiquent les données de l'enquête (EDS/MICS) comme référence de l'enquête sur les ménages. **Les lignes/points gris** indiquent la couverture basée sur le SIGS à partir des données des établissements. **Les lignes/points rouges** indiquent la couverture projetée - estimations de l'enquête étendues à l'aide des tendances du SIGS.

</div>
</div>
<!-- /SLIDE -->

<!-- SLIDE:m6_17 -->
## Couverture (infranationale)

![Couverture calculée à partir des données SIGS au niveau de la zone administrative 2. h:420](resources/default_outputs/Module4_2_Coverage_HMIS_Admin2.png)
<!-- /SLIDE -->

<!-- SLIDE:m6_18 -->
## Couverture (infranationale)

![Couverture calculée à partir des données SIGS au niveau sous-national. h:420](resources/default_outputs/Module4_3_Coverage_HMIS_Subnational.png)
<!-- /SLIDE -->

<!-- SLIDE:m6_19 -->
## module de couverture : Paramètres de configuration

<div style="font-size : 0.8em ;">

| Paramètre | Description |
|-----------|-------------|
| **Valeur de comptage à utiliser** | Valeur de comptage ajustée à utiliser pour le calcul de la couverture |
| **Niveau pour lequel calculer la couverture** | Niveaux géographiques pour l'estimation de la couverture : national, provincial (zone administrative 2) ou district (zone administrative 3) |
| **Taux de perte de grossesse** | Proportion de grossesses se terminant par une perte avant l'accouchement |
| **Taux de jumeaux** | Proportion d'accouchements donnant lieu à la naissance de jumeaux |
| **Taux de mortinatalité** | Proportion de naissances mort-nées |
| **Taux de mortalité néonatale** | Décès au cours des 28 premiers jours par naissance vivante |
| **Taux de mortalité postnéonatale** | Décès entre 28 jours et 1 an par naissance vivante |
| **Taux de mortalité infantile** | Décès avant l'âge de 1 an par naissance vivante |
| **Taux de mortalité des moins de 5 ans** | Décès avant l'âge de 5 ans par naissance vivante |

</div>

Les taux de mortalité spécifiques à un pays peuvent être obtenus à partir des rapports des EDS, de l'IGME des Nations unies ou des statistiques nationales de l'état civil.
<!-- /SLIDE -->
