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

**Complexité de l'analyse

FASTR applique des méthodes analytiques - notamment des techniques de régression - qui vont au-delà de l'analyse descriptive des tendances disponible dans DHIS2. Alors que DHIS2 permet de visualiser les tendances brutes de la prestation de services, FASTR offre des capacités analytiques supplémentaires, notamment :

- L'identification d'augmentations ou de diminutions statistiquement significatives des volumes de services
- L'ajustement des limites de la qualité des données
- La prise en compte explicite des variations saisonnières attendues
- La comparaison de la prestation de services sur des périodes clés, par exemple avant et après des réformes politiques, des chocs ou des perturbations

Le choix entre l'utilisation exclusive des données analytiques du DHIS2 et l'application de l'approche FASTR doit être guidé par l'objectif analytique visé. L'approche FASTR est conçue pour les analyses qui nécessitent une plus grande rigueur statistique, une comparabilité dans le temps et une cohérence entre les différents niveaux géographiques.

### Quel est le format et la granularité requis ?

Les données doivent être extraites pour chaque **indicateur d'intérêt**, au **niveau de l'établissement**, et à un pas de temps **mensuel** pour la **période d'analyse**.

- Les données doivent être stockées au **format long**, avec une ligne par observation
- Les données doivent être enregistrées au format **.csv**
- Les données peuvent être stockées dans un seul fichier ou réparties dans plusieurs fichiers, qui peuvent être combinés lors du téléchargement vers la plateforme d'analyse

**Pourquoi des données mensuelles au niveau de l'établissement ?

L'utilisation des données les plus granulaires disponibles permet une évaluation plus précise des modèles de déclaration et des problèmes de qualité des données. Les données mensuelles au niveau de l'établissement permettent un ajustement solide de l'exhaustivité de la déclaration, l'identification des anomalies spécifiques à l'établissement et l'estimation des tendances dans le temps tout en tenant compte des variations saisonnières. Ce niveau de granularité permet une mise en œuvre complète de la méthodologie FASTR.

### Variables clés

L'ensemble de données extraites doit comprendre au minimum les variables suivantes :

| Élément Description
|--------|-------------|
| Unité d'organisation - Identifiant de l'unité d'organisation
| Nom de l'indicateur - Nom de l'indicateur - Nom de l'indicateur - Nom de l'indicateur - Nom de l'indicateur - Nom de l'indicateur
nom de l'indicateur | Nom de l'indicateur | Nom de l'indicateur | Nom de l'indicateur | Nom de l'indicateur | Nom de l'indicateur
| Nom de l'indicateur | Total / compte | Valeur agrégée de l'indicateur | Nom de l'indicateur

**Termes de l'unité organisationnelle

| Termes de l'unité organisationnelle ** Terme de l'unité organisationnelle ** Description
|------|-------------|
| Niveau administratif le plus élevé (par exemple, le pays) | `orgunitlevel1` | Niveau administratif intermédiaire (par exemple, l'État ou la province)
| `orgunitlevel2` | Niveau administratif intermédiaire (par exemple, état ou province) | `orgunitlevel3` | Niveau administratif supérieur (par exemple, pays)
| `orgunitlevel3` | district ou équivalent |
| `orgunitlevel4` | Sous-district ou établissement de santé
| `orgunitlevel5` | Unité ou département au sein d'une structure sanitaire
| `organisationunitid` | Identifiant DHIS2 unique pour l'unité organisationnelle |
| `organisationunitname` | Nom de l'unité organisationnelle | `organisationunitname` | Nom de l'unité organisationnelle
| `organisationunitcode` | Code normalisé de l'unité organisationnelle | `organisationunitcode` | Code normalisé de l'unité organisationnelle
| __CODE_BLOC_8__ | Description de l'unité organisationnelle

**Termes de la période**

| Termes de la période ** Termes de la période ** Description ** Termes de la période ** Termes de la période ** Description
|------|-------------|
| `periodid` | Identificateur unique pour la période de déclaration
| `periodname` | Libellé de la période lisible par l'homme (par exemple, janvier 2024, T1 2024) | `periodcode` | Libellé de la période lisible par l'homme (par exemple, janvier 2024, T1 2024)
| `periodcode` | Code de période normalisé (par exemple, 202401) | `periodcode` | Code de période normalisé (par exemple, 202401)
| `perioddescription` | Description incluant les dates de début et de fin de la période |

**Termes de l'élément de données

| Termes de l'élément de données** - Termes de l'élément de données** - Description
|------|-------------|
| `dataid` | Identifiant unique de l'élément de données | `dataname` | Nom de l'élément de données
| `dataname` | Nom de l'élément de données | `datacode` | Nom de l'élément de données
| `datacode` | Code normalisé de l'élément de données | `datacode` | Code normalisé de l'élément de données
| `datadescription` | Description de l'élément de données | `datadescription` | Description de l'élément de données

**Autres termes**

| Terme | Description
|------|-------------|
| Valeur agrégée de l'élément de données par unité organisationnelle et par période
| Date d'extraction des données, à des fins d'audit et de contrôle de la version

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
// //
// _____ _ _____ ____ _____ ____ ___ _ _ _____ _ _ //

// | (___ | | | | | | | | |__ | | | | | | \| | | | | \| |//
 . ` | | | | . ` |/
// ____) | |___ _| |_| |_| | |____ | |__| |_| | |\ | | | | |\ |//
// |_____/|_____|_____|____/|______| \____\___/|_| \_| |_| |_| \_|//
// //
// Modifiez les diapositives de l'atelier en dessous de cette ligne //
// //
////////////////////////////////////////////////////////////////////
-->

<!-- SLIDE:m2_1 -->
## Pourquoi extraire des données de DHIS2 ?

### Ajustement de la qualité des données

L'approche FASTR se concentre sur les ajustements de la qualité des données afin d'élargir les analyses que les pays peuvent effectuer avec les données DHIS2 et de générer des estimations plus robustes.

La méthodologie FASTR comprend des approches spécifiques pour
- Identifier et ajuster les valeurs aberrantes
- Ajuster les déclarations incomplètes
- Appliquer des mesures cohérentes de la qualité des données

Ces ajustements nécessitent un traitement qui ne peut pas être effectué dans le cadre des fonctions analytiques natives de DHIS2.
<!-- /SLIDE -->

<!-- SLIDE:m2_1a -->
## Pourquoi extraire des données du DHIS2 ?

### Complexité de l'analyse

L'approche FASTR utilise des méthodes statistiques plus avancées, telles que l'analyse de régression, qui ne sont pas disponibles dans le DHIS2. Alors que DHIS2 permet de tracer des tendances dans le temps à partir de données brutes, FASTR peut aller plus loin :

- En identifiant les augmentations ou les diminutions significatives du volume de services
- En ajustant les problèmes de qualité des données
- En tenant compte des variations saisonnières attendues
- Comparer des périodes clés, par exemple avant et après une réforme

Le choix entre le DHIS2 et l'approche FASTR doit être guidé par l'objectif spécifique de votre analyse.
<!-- /SLIDE -->

<!-- DIAPOSITIVE:m2_1b -->
## Format et granularité des données

Les données doivent être téléchargées pour chaque **indicateur d'intérêt**, au **niveau de l'établissement**, et **mensuellement** pour la **période d'intérêt**.

- Les données doivent être sauvegardées en **format long**, ce qui signifie que chaque ligne représente une observation ou une mesure unique
- Les données doivent être enregistrées au format **.csv** et peuvent être enregistrées dans un seul fichier .csv ou dans plusieurs fichiers .csv

### Pourquoi des données mensuelles au niveau de l'établissement ?

Nous voulons utiliser les données les plus granulaires auxquelles nous avons accès afin de procéder à des évaluations plus fines de la qualité des données. L'utilisation de données mensuelles au niveau de l'établissement nous permet de réaliser l'analyse la plus solide.
<!-- /SLIDE -->

<!-- SLIDE:m2_1c -->
## Variables clés

Les données extraites doivent comprendre les éléments obligatoires suivants :

| Élément Description
|---------|-------------|
| Unités d'organisation | Identifiant de l'unité d'organisation
| Période | Période de temps des données | Nom de l'indicateur
| Nom de l'indicateur | Nom de l'indicateur | Nom de l'indicateur
| Total/compte | Valeur agrégée
<!-- /SLIDE -->

<!-- SLIDE:m2_1d -->
## Combien de données ?

### Analyse FASTR initiale
- Téléchargement d'environ **cinq ans** de données historiques
- La période exacte dépend de la disponibilité des données et de la cohérence des définitions des indicateurs

### Mise à jour régulière de l'analyse FASTR
- Télécharger les nouvelles données couvrant les mois les plus récents qui n'ont pas été inclus précédemment (généralement **trois mois** pour la mise en œuvre trimestrielle)
- Inclure les **trois mois précédents** car les données récentes sont souvent sujettes à des changements en raison de rapports tardifs ou d'ajustements de la qualité des données
<!-- /SLIDE -->

<!-- SLIDE:m2_2 -->
## Outils d'extraction de données

Nous proposons deux outils pour l'extraction en masse des données DHIS2 :

**API Script** (Google Colab)
- Saisir les identifiants de connexion, spécifier les périodes, les indicateurs et les niveaux administratifs
- Télécharger les données sous forme de fichier .csv

**Data Downloader** (téléchargeur de données)
- Interface plus intuitive et rationalisée
- Recommandé pour la plupart des utilisateurs

Ces deux outils permettent une extraction efficace des données et nous fournissons des ressources de formation pour soutenir leur utilisation.
<!-- /SLIDE -->

<!-- SLIDE:m2_2a -->
## DHIS2 Data Downloader

Le téléchargeur de données est une application de bureau permettant d'extraire des données du DHIS2.

**Caractéristiques principales:**
- Connexion à n'importe quelle instance DHIS2
- Parcourir et sélectionner les éléments de données et les indicateurs
- Téléchargement des données au niveau de l'établissement au format CSV
- Maintien de l'historique des téléchargements

**Télécharger à partir de GitHub:**

https://github.com/worldbank/DHIS2-Downloader/releases/

![demo h:35](../resources/icons/demo.svg) *L'animateur fera une démonstration du Data Downloader*
<!-- /SLIDE -->

<!-- SLIDE:m2_2b -->
## Téléchargeur de données : Connexion

<div class="columns">
<div>

![Ecran de connexion Data Downloader h:380](../resources/screenshots/data_downloader/01_login.png)

</div>
<div>

**Connectez-vous à votre instance DHIS2**

- Entrez l'URL de votre serveur DHIS2
- Indiquez votre nom d'utilisateur et votre mot de passe
- L'outil stocke en toute sécurité les informations d'identification pour les sessions ultérieures

</div>
</div>
<!-- /SLIDE -->

<!-- SLIDE:m2_2c -->
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

<!-- SLIDE:m2_2d -->
## Data Downloader : Télécharger l'historique

<div class="columns">
<div>

![Historique du téléchargeur de données h:380](../resources/screenshots/data_downloader/03_history.png)

</div>
<div>

**Track your downloads**

- Afficher toutes les sessions de téléchargement précédentes
- Re-télécharger les données avec les mêmes paramètres
- Accéder aux journaux et à l'état des téléchargements
- Gérer les fichiers téléchargés

</div>
</div>
<!-- /SLIDE -->

<!-- SLIDE:m2_2e -->
## Data Downloader : Dictionnaire de données

<div class="columns">
<div>

![Data Downloader dictionary h:380](../resources/screenshots/data_downloader/04_dictionary.png)

</div>
<div>

**Explorer les données disponibles**

- Parcourez tous les éléments de données de votre DHIS2
- Recherche par nom ou par code
- Voir les métadonnées et les définitions
- Identifier les indicateurs pour votre analyse

</div>
</div>
<!-- /SLIDE -->

<!-- SLIDE:m2_2f -->
## Data Downloader : Liste des installations

<div class="columns">
<div>

![Data Downloader établissement list h:380](../resources/screenshots/data_downloader/05_établissement_list.png)

</div>
<div>

**Gestion des installations**

- Voir la liste complète des installations
- Filtrer par niveau administratif
- Recherche par nom d'établissement
- Exporter les données de l'établissement

</div>
</div>
<!-- /SLIDE -->

<!-- SLIDE:m2_2g -->
## Téléchargeur de données : Carte des installations

<div class="columns">
<div>

![Data Downloader établissement map h:380](../resources/screenshots/data_downloader/06_établissement_map.png)

</div>
<div>

**Visualisation géographique**

- Télécharger les fichiers de frontières GeoJSON
- Basculer les frontières administratives par niveau (Niveau 1 = pays, Niveau 2 = régions, etc.)
- Les niveaux supérieurs affichent les points d'installation
- Utile pour vérifier la structure géographique

</div>
</div>
<!-- /SLIDE -->

---

**Dernière mise à jour** : 07-01-2026
**Contact** : Équipe du projet FASTR
