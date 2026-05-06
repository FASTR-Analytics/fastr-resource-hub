<!-- AUTO-TRANSLATED from 02_data_extraction.md -->
<!-- Add REVIEWED marker after human review to protect from overwrite -->

# Extraction des données

**Note:** Le contenu de cette section s'appuie sur les documents de présentation existants du FASTR et est susceptible d'être révisé.

## Vue d'ensemble

Cette section décrit la raison d'être, les exigences et les pratiques recommandées pour l'extraction des données sur la prestation des services de routine du DHIS2 en vue de leur utilisation dans le pipeline analytique de la FASTR.

### Pourquoi extraire des données du DHIS2 ?

**Ajustement de la qualité des données**

L'approche FASTR donne la priorité à l'ajustement systématique de la qualité des données afin de permettre une utilisation plus rigoureuse des données de routine du DHIS2 et de générer des estimations analytiquement robustes et pertinentes pour les politiques. La méthodologie comprend des procédures standardisées pour :

- Identifier et corriger les valeurs aberrantes
- Ajuster les rapports incomplets
- Appliquer des mesures de qualité des données cohérentes entre les indicateurs et les établissements

Ces procédures nécessitent un traitement des données et des opérations statistiques qui ne peuvent être mis en œuvre dans l'environnement analytique natif de DHIS2.

**Complexité de l'analyse**

FASTR applique des méthodes analytiques - notamment des techniques de régression - qui vont au-delà de l'analyse descriptive des tendances disponible dans DHIS2. Alors que DHIS2 permet de visualiser les tendances brutes de la prestation de services, FASTR offre des capacités analytiques supplémentaires, notamment :

- L'identification d'augmentations ou de diminutions statistiquement significatives des volumes de services
- L'ajustement des limites de la qualité des données
- La prise en compte explicite des variations saisonnières attendues
- La comparaison de la prestation de services sur des périodes clés, par exemple avant et après des réformes politiques, des chocs ou des perturbations

Le choix entre l'utilisation exclusive des données analytiques du DHIS2 et l'application de l'approche FASTR doit être guidé par l'objectif analytique visé. L'approche FASTR est conçue pour les analyses qui nécessitent une plus grande rigueur statistique, une comparabilité dans le temps et une cohérence entre les différents niveaux géographiques.

!!! warning "Extraire des comptages, pas des pourcentages"

    Le pipeline FASTR exige des **comptages bruts de services** — le nombre réel d'événements déclarés par chaque établissement chaque mois (par exemple, *« 152 enfants ont reçu Penta1 dans cet établissement en mars 2024 »*). Il **n'accepte pas** de pourcentages, de proportions, de taux ou de chiffres de couverture pré-calculés.

    **Pourquoi cela compte :**

    - **La détection des valeurs aberrantes repose sur l'ampleur.** Un établissement déclarant 850 visites CPN1 alors que sa fourchette habituelle est de 100 à 200 est manifestement aberrant. Le même établissement déclarant *« 92 % de couverture »* ne nous apprend rien — le pourcentage est plafonné à 100, masque le volume sous-jacent et efface le signal qui sert à détecter les erreurs de déclaration.
    - **On peut additionner des comptages entre établissements ; pas des pourcentages.** Pour obtenir un total régional ou national, la plateforme additionne les comptages des établissements. Faire une moyenne des pourcentages entre établissements de tailles différentes donne le mauvais résultat (un hôpital de 100 lits et un poste de santé de 5 lits pèseraient à parts égales).
    - **La plateforme construit elle-même le dénominateur.** Le module 5 dérive la population cible (femmes enceintes, nourrissons, etc.) à partir des données SIGS, des enquêtes et des projections de l'ONU. Le module 6 calcule ensuite la couverture comme `comptage ÷ dénominateur`. Si vous fournissez directement un % de couverture, il n'y a plus de comptage à diviser ni de comparaison à faire.
    - **L'ajustement impute des comptages.** Les modules 1 et 2 détectent les valeurs aberrantes au moyen de seuils statistiques sur les valeurs brutes et comblent les mois manquants par moyennes mobiles des comptages passés. Ces deux méthodes sont statistiquement dénuées de sens sur des pourcentages.

    **Que faut-il extraire :** uniquement le numérateur — nombre de services rendus, doses administrées, visites enregistrées, décès déclarés, etc. La plateforme se charge de l'agrégation, de l'ajustement et du calcul de la couverture.

    **Pièges courants à éviter :**

    - Les *« data elements »* DHIS2 qui stockent directement la couverture en % (par exemple `Taux de couverture CPN1`) — extraire plutôt le comptage sous-jacent (par exemple `Visites CPN1 — premier contact`).
    - Les indicateurs pré-agrégés par mois ou par trimestre au niveau du district — extraire plutôt des lignes établissement-mois.
    - Les indicateurs calculés comme *« % d'enfants complètement vaccinés »* — fournir séparément les composants sous-jacents (BCG, Penta1, Rougeole 1, etc.).

### Quel est le format et la granularité requis ?

Les données doivent être extraites pour chaque **indicateur d'intérêt**, au **niveau de l'établissement**, et à un pas de temps **mensuel** pour la **période d'analyse**.

- Les données doivent être stockées au **format long**, avec une ligne par observation
- Les données doivent être enregistrées au format **.csv**
- Les données peuvent être stockées dans un seul fichier ou réparties dans plusieurs fichiers, qui peuvent être combinés lors du téléchargement vers la plateforme d'analyse

**Pourquoi des données mensuelles au niveau de l'établissement ?**

L'utilisation des données les plus granulaires disponibles permet une évaluation plus précise des modèles de déclaration et des problèmes de qualité des données. Les données mensuelles au niveau de l'établissement permettent un ajustement solide de l'exhaustivité de la déclaration, l'identification des anomalies spécifiques à l'établissement et l'estimation des tendances dans le temps tout en tenant compte des variations saisonnières. Ce niveau de granularité permet une mise en œuvre complète de la méthodologie FASTR.

### Variables clés

L'ensemble de données extraites doit comprendre au minimum les variables suivantes :

| Élément | Description |
|--------|-------------|
| Unités org. | Identifiant de l'unité organisationnelle |
| Période | Période de l'observation |
| Nom de l'indicateur | Nom de l'indicateur |
| Total / compte | Valeur agrégée de l'indicateur |

**Termes de l'unité organisationnelle**

| Terme | Description |
|------|-------------|
| `orgunitlevel1` | Niveau administratif le plus élevé (par exemple, pays) |
| `orgunitlevel2` | Niveau administratif intermédiaire (par exemple, état ou province) |
| `orgunitlevel3` | District ou équivalent |
| `orgunitlevel4` | Sous-district ou établissement de santé |
| `orgunitlevel5` | Unité ou département au sein d'un établissement |
| `organisationunitid` | Identifiant DHIS2 unique pour l'unité organisationnelle |
| `organisationunitname` | Nom de l'unité organisationnelle |
| `organisationunitcode` | Code normalisé de l'unité organisationnelle |
| `organisationunitdescription` | Description de l'unité organisationnelle |

**Termes de la période**

| Terme | Description |
|------|-------------|
| `periodid` | Identifiant unique pour la période de déclaration |
| `periodname` | Libellé de la période lisible (par exemple, janvier 2024, T1 2024) |
| `periodcode` | Code de période normalisé (par exemple, 202401) |
| `perioddescription` | Description incluant les dates de début et de fin de la période |

**Termes de l'élément de données**

| Terme | Description |
|------|-------------|
| `dataid` | Identifiant unique de l'élément de données |
| `dataname` | Nom de l'élément de données |
| `datacode` | Code normalisé de l'élément de données |
| `datadescription` | Description de l'élément de données |

**Autres termes**

| Terme | Description |
|------|-------------|
| `total` | Valeur agrégée de l'élément de données par unité organisationnelle et période |
| `date_downloaded` | Date d'extraction des données, pour audit et contrôle de version |

### Combien de données ?

**Analyse FASTR initiale**

Pour la mise en œuvre initiale, il est généralement recommandé d'extraire environ **cinq ans de données historiques**. La fenêtre temporelle appropriée doit être déterminée en fonction de :

- La disponibilité et l'exhaustivité des données
- La cohérence des définitions des indicateurs dans le temps
- Les caractéristiques du système national de données de routine

Une série chronologique pluriannuelle améliore la fiabilité de l'estimation des tendances et de la correction des variations saisonnières.

**Mise à jour régulière de l'analyse FASTR**

Pour les mises à jour de routine (par exemple, mise en œuvre trimestrielle) :

- Commencez par la base de données FASTR existante et extrayez les données pour les mois les plus récents non encore inclus (généralement une **période de trois mois**)
- Extraire à nouveau les **trois mois précédents** pour tenir compte des déclarations tardives ou des révisions des données récentes
- Si l'on soupçonne des révisions substantielles des données historiques, envisager d'extraire à nouveau une période historique plus longue

### Outils d'extraction de données

*Le contenu de la documentation complète doit être développé.*

Cette section couvrira :
- Les options d'exportation des données DHIS2
- Les méthodes d'extraction basées sur l'API
- Les exigences en matière de transformation des données
- Les contrôles d'assurance qualité des données extraites

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
//            Modifiez les diapositives de l'atelier              //
//                   en dessous de cette ligne                    //
//                                                                //
////////////////////////////////////////////////////////////////////
-->

<!-- SLIDE:m2_0 -->
## À main levée...

![w:120](../resources/icons/raise-hand.png)

Extrayez-vous régulièrement des données du DHIS2 ?

Si oui, quelles en sont les principales raisons ?
<!-- /SLIDE -->

<!-- SLIDE:m2_1 -->
## Pourquoi extraire des données du DHIS2 ? Pourquoi ne pas simplement faire l'analyse dans DHIS2 ?

**Ajustement de la qualité des données**

L'approche FASTR se concentre sur les ajustements de la qualité des données afin d'élargir les analyses que les pays peuvent effectuer avec les données DHIS2 et de générer des estimations plus robustes.

**Complexité de l'analyse**

L'approche FASTR utilise des méthodes statistiques plus avancées, telles que l'analyse de régression, qui ne sont pas disponibles dans DHIS2. Alors que DHIS2 permet de tracer des tendances dans le temps à partir de données brutes, FASTR peut aller plus loin en identifiant les augmentations ou diminutions significatives du volume de services, en ajustant les problèmes de qualité des données, en tenant compte des variations saisonnières attendues et en comparant des périodes clés, par exemple avant et après une réforme.

Le choix entre DHIS2 et l'approche FASTR doit être guidé par l'objectif spécifique de votre analyse. Sélectionnez l'outil qui correspond le mieux à vos besoins analytiques !
<!-- /SLIDE -->

<!-- SLIDE:m2_1a -->
## Extraire des comptages, pas des pourcentages

FASTR analyse des **comptages bruts de services** — le nombre réel de services déclarés par chaque établissement chaque mois. Il **n'accepte pas** de pourcentages, de proportions ou de chiffres de couverture pré-calculés.

| À extraire | À **ne pas** extraire |
|------------|------------------------|
| Nombre de visites CPN1 par établissement et par mois | Taux de couverture CPN1 (%) |
| Nombre de doses Penta1 administrées | Proportion de couverture vaccinale |
| Nombre d'accouchements en établissement | Indicateurs de couverture pré-calculés |

**Pourquoi ?**

- On ne peut pas détecter une valeur aberrante sur un pourcentage — il est plafonné à 100 et masque le volume sous-jacent de l'établissement.
- On ne peut pas additionner des pourcentages entre établissements de tailles différentes pour obtenir un total régional.
- La plateforme calcule elle-même la couverture en divisant les comptages par les dénominateurs de population dans les **modules 5 et 6**.
- Les ajustements pour valeurs aberrantes et complétude (**modules 1 et 2**) sont des méthodes statistiques qui exigent des comptages bruts.

<!--
PRESENTER NOTES:
- C'est la règle la plus importante pour l'extraction des données
- Erreur fréquente : extraire des « data elements » DHIS2 qui contiennent déjà la couverture en %
- Toujours extraire le numérateur (comptage de services) — la plateforme s'occupe du reste
- Si votre indicateur DHIS2 contient « taux », « % » ou « proportion », ce n'est pas le bon
- Montrer un exemple concret aux participants : visites CPN1 (comptage) vs taux de couverture CPN1 (%)
-->
<!-- /SLIDE -->

<!-- SLIDE:m2_1b -->
<!-- _class: columns-image-right -->

## Format et granularité des données

![h:200 Data format wide](resources/screenshots/data_format_wide.png)

- Les données doivent être téléchargées pour chaque **indicateur d'intérêt**, au **niveau de l'établissement**, et **mensuellement** pour la **période d'intérêt**
- Les données doivent être sauvegardées en format long, ce qui signifie que chaque ligne représente une observation ou une mesure unique (voir l'exemple)
- Les données doivent être enregistrées au format .csv et peuvent être enregistrées dans un seul fichier .csv ou dans plusieurs fichiers .csv qui seront combinés lors du téléchargement vers la plateforme d'analyse

<!--
PRESENTER NOTES:
- Nous voulons utiliser les données les plus granulaires auxquelles nous avons accès afin de procéder à des évaluations plus fines de la qualité des données et des ajustements
- Nous voulons également pouvoir observer les tendances dans le temps, en tenant compte de la saisonnalité
- L'utilisation de données mensuelles au niveau de l'établissement nous permet de réaliser l'analyse la plus solide
-->
<!-- /SLIDE -->

<!-- SLIDE:m2_1d -->
## Combien de données ?

**Analyse FASTR initiale**

- Il est généralement recommandé de télécharger environ cinq ans de données historiques
- Toutefois, la période exacte doit être déterminée en fonction de la disponibilité des données, de la cohérence des définitions des indicateurs dans le temps et des spécificités du système de données de routine d'un pays
- Idéalement, l'utilisation d'au moins cinq ans de données historiques permet une évaluation approfondie des tendances dans le temps

**Mise à jour régulière de l'analyse FASTR**

- Commencez par la base de données existante et téléchargez les nouvelles données couvrant les mois les plus récents non précédemment inclus - il s'agit généralement d'une période de trois mois lorsque l'analyse FASTR est mise en œuvre sur une base trimestrielle
- De plus, incluez les trois mois précédant la nouvelle période de données, car ces données relativement récentes sont souvent sujettes à des changements en raison de rapports tardifs ou d'ajustements de la qualité des données
- Si vous avez des raisons de croire qu'il y a eu des changements substantiels dans les données historiques, vous pouvez toujours choisir de retélécharger une période plus longue
<!-- /SLIDE -->

<!-- SLIDE:m2_2 -->
## Extraction des données

<div class="columns">
<div>

Nous proposons deux outils pour l'extraction en masse des données DHIS2 : un Data Downloader convivial et une fonction d'importation directe au sein de la plateforme analytique FASTR.

Le Data Downloader fournit une interface simplifiée pour télécharger les données DHIS2. Cet outil est particulièrement utile pour explorer les métadonnées DHIS2 et télécharger des indicateurs nécessitant des dimensions désagrégées.

Le Data Downloader est disponible à l'adresse : https://github.com/worldbank/DHIS2-Downloader/releases/

</div>
<div>

![Data Downloader h:380](../resources/screenshots/data_downloader.png)

</div>
</div>
<!-- /SLIDE -->

<!-- SLIDE:m2_2a -->
## Extraction des données

La **plateforme analytique FASTR** contient une fonction d'importation directe pour importer automatiquement les données du DHIS2. C'est souvent l'approche la plus simple une fois que les indicateurs ont été identifiés pour inclusion dans la plateforme.

![h:200 Direct import feature](resources/screenshots/platform/direct_import_1.png)

![h:200 Direct import interface](resources/screenshots/platform/direct_import_2.png)

<!-- /SLIDE -->

<!-- SLIDE:m2_2b -->
## DHIS2 Data Downloader

Le Data Downloader est une application de bureau permettant d'extraire des données du DHIS2.

**Caractéristiques principales :**
- Connexion à n'importe quelle instance DHIS2
- Parcourir et sélectionner les éléments de données et les indicateurs
- Télécharger les données au niveau de l'établissement au format CSV
- Conserver l'historique des téléchargements

**Télécharger à partir de GitHub :**

https://github.com/worldbank/DHIS2-Downloader/releases/

![demo h:35](../resources/icons/demo.svg) *Le facilitateur fera une démonstration du Data Downloader*
<!-- /SLIDE -->

<!-- SLIDE:m2_2c -->
## Data Downloader : Connexion

![Écran de connexion Data Downloader h:450](../resources/screenshots/data_downloader/01_login.png)

<!--
PRESENTER NOTES:
- Pratiquez le téléchargement de données + structure des établissements
- Besoin de vérifier les niveaux auxquels les établissements sont déclarés pour savoir si nous pouvons utiliser la fonction d'importation directe
-->
<!-- /SLIDE -->

<!-- SLIDE:m2_2d -->
## Data Downloader : Vue d'ensemble

<div class="columns">
<div>

![Data Downloader overview h:380](../resources/screenshots/data_downloader/02_overview.png)

</div>
<div>

**Interface principale**

- Parcourir les éléments de données et les indicateurs disponibles
- Sélectionner les périodes et les unités d'organisation
- Configurer les options de téléchargement
- Démarrer l'extraction des données

</div>
</div>
<!-- /SLIDE -->

<!-- SLIDE:m2_2e -->
## Data Downloader : Historique des téléchargements

<div class="columns">
<div>

![Data Downloader history h:380](../resources/screenshots/data_downloader/03_history.png)

</div>
<div>

**Suivez vos téléchargements**

- Afficher toutes les sessions de téléchargement précédentes
- Retélécharger les données avec les mêmes paramètres
- Accéder aux journaux et à l'état des téléchargements
- Gérer les fichiers téléchargés

</div>
</div>
<!-- /SLIDE -->

<!-- SLIDE:m2_2f -->
## Data Downloader : Dictionnaire de données

<div class="columns">
<div>

![Data Downloader dictionary h:380](../resources/screenshots/data_downloader/04_dictionary.png)

</div>
<div>

**Explorer les données disponibles**

- Parcourir tous les éléments de données de votre DHIS2
- Rechercher par nom ou par code
- Voir les métadonnées et les définitions
- Identifier les indicateurs pour votre analyse

</div>
</div>
<!-- /SLIDE -->

<!-- SLIDE:m2_2g -->
## Data Downloader : Liste des établissements

<div class="columns">
<div>

![Data Downloader facility list h:380](../resources/screenshots/data_downloader/05_facility_list.png)

</div>
<div>

**Gestion des établissements**

- Voir la liste complète des établissements
- Filtrer par niveau administratif
- Rechercher par nom d'établissement
- Exporter les données de l'établissement

</div>
</div>
<!-- /SLIDE -->

<!-- SLIDE:m2_2h -->
## Data Downloader : Carte des établissements

<div class="columns">
<div>

![Data Downloader facility map h:380](../resources/screenshots/data_downloader/06_facility_map.png)

</div>
<div>

**Visualisation géographique**

- Télécharger les fichiers de limites GeoJSON
- Basculer les limites administratives par niveau (Niveau 1 = pays, Niveau 2 = régions, etc.)
- Les niveaux supérieurs affichent les points d'établissement
- Utile pour vérifier la structure géographique

</div>
</div>
<!-- /SLIDE -->

---

**Dernière mise à jour** : 26-01-2026
**Contact** : Équipe du projet FASTR
