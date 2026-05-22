<!-- AUTO-TRANSLATED from 03_fastr_analytics_platform.md -->
<!-- Add REVIEWED marker after human review to protect from overwrite -->

# La plateforme d'analyse de données FASTR

## Aperçu

La plateforme d'analyse FASTR est un outil en ligne conçu pour soutenir l'évaluation, l'ajustement et l'analyse de la qualité des données de santé de routine. Elle permet aux utilisateurs de télécharger et d'analyser des données provenant de diverses sources, y compris le DHIS2, avec des méthodes statistiques intégrées pour générer un ensemble de données ajustées et effectuer des analyses prioritaires sur des indicateurs sélectionnés. La plateforme fournit une interface conviviale pour l'exécution des analyses et offre des options flexibles pour la visualisation et l'exportation des résultats.

![Capacités de la plateforme](../resources/diagrams_fr/platform_capabilities.svg)

## Capacités clés

### Gestion des données

La plateforme offre une fonctionnalité complète de gestion des données. Les utilisateurs peuvent importer et gérer les structures des établissements de santé, y compris les zones administratives et les établissements individuels. Le système prend en charge les importations de données provenant des systèmes d'information sur la gestion de la santé (SIGS) et des évaluations des établissements de santé (HFA), ce qui permet aux utilisateurs de gérer des indicateurs provenant de sources multiples tout en suivant les versions des ensembles de données au fil du temps.

### Analyse des données

Les capacités analytiques sont fournies par le biais de modules configurables. Les utilisateurs peuvent activer et configurer des modules analytiques qui traitent les données à l'aide de scripts statistiques basés sur la technologie R. Ces modules peuvent être enchaînés pour obtenir des données plus détaillées. Ces modules peuvent être enchaînés pour prendre en charge des analyses complexes en plusieurs étapes, avec des outils intégrés pour surveiller l'état du traitement et consulter les journaux.

### Assistant IA

Un assistant IA intégré aide les utilisateurs à comprendre et à interpréter leurs données. L'assistant peut expliquer les résultats des modules, décrire les tendances et les modèles de données, fournir des informations sur les visualisations et aider à générer du contenu narratif pour les rapports. Les utilisateurs peuvent poser des questions sur les données de leur projet en langage naturel et recevoir des conseils contextuels sur l'analyse et l'interprétation.

### Visualisation

La plateforme offre des outils de visualisation robustes pour présenter les résultats analytiques. Les utilisateurs peuvent créer des graphiques, des cartes et des tableaux à partir des données traitées, avec des options de filtrage et de désagrégation selon plusieurs dimensions. Les visualisations peuvent être personnalisées en termes d'apparence et de style, et exportées sous forme d'images ou de fichiers de données pour être utilisées dans des applications externes.

### Rapports

La fonctionnalité de création de rapports permet aux utilisateurs de combiner plusieurs visualisations dans des rapports complets. Les rapports peuvent être exportés sous forme de présentations PowerPoint ou de documents PDF. Les utilisateurs peuvent organiser et réorganiser les pages des rapports pour répondre à des besoins de communication spécifiques et partager les rapports terminés avec les parties prenantes.

### Collaboration

La plateforme prend en charge le travail collaboratif grâce à une structure basée sur les projets. Les utilisateurs peuvent organiser leur travail en projets distincts et attribuer aux membres de l'équipe différents rôles, notamment des autorisations de visualisation, d'édition et d'administration. Les contrôles d'accès s'effectuent au niveau du projet et les projets peuvent être verrouillés pour éviter les modifications involontaires.

## Qui devrait utiliser cette application ?

### Les analystes de données

Les analystes de données trouveront la plateforme très utile pour analyser les tendances des données de santé, créer des visualisations et générer des rapports pour les décideurs. Les modules analytiques et les outils de visualisation sont conçus pour soutenir des flux de travail d'analyse de données rigoureux.

### Gestionnaires de programmes de santé

Les responsables de programmes de santé peuvent utiliser la plateforme pour surveiller les performances des programmes, suivre les indicateurs clés et partager des informations avec leurs équipes. La fonctionnalité de reporting permet une communication régulière des résultats afin de soutenir une gestion de programme basée sur des preuves.

### Administrateurs du système

Les administrateurs du système sont chargés de mettre en place la plateforme, de gérer les utilisateurs, d'importer les données et de configurer le système pour répondre aux besoins de l'organisation. Les outils administratifs permettent de contrôler l'accès des utilisateurs, les sources de données et les paramètres de la plateforme.

## Fonctionnement de l'application

### Niveau de l'organisation (instance)

**L'instance** est l'espace de travail principal de l'organisation au sein de la plateforme. Chaque instance contient tous les utilisateurs enregistrés, la structure administrative partagée (y compris les zones administratives et les établissements de santé), les définitions des indicateurs partagés, les sources de données (SIGS et HFA) et tous les projets créés au sein de l'organisation.

### Niveau du projet

**Les projets** fournissent des espaces de travail d'analyse ciblés au sein d'une instance. Chaque projet permet aux utilisateurs de sélectionner les données à inclure en définissant des périodes, des établissements et des indicateurs spécifiques. Au sein d'un projet, les utilisateurs peuvent activer des modules analytiques, créer des visualisations et élaborer des rapports adaptés à des objectifs analytiques spécifiques.

![Projets au sein de l'instance](../resources/diagrams_fr/projects_within_instance.svg)


### Flux de données

La plate-forme suit un flux de données structuré : **Importation des données → Traitement des modules → Visualisations → Rapports**. Les utilisateurs commencent par télécharger les données de l'établissement de santé au niveau de l'instance. Des projets sont ensuite créés avec des fenêtres de données spécifiques qui définissent l'étendue de l'analyse. Les modules analytiques traitent et analysent les données sélectionnées, produisant des résultats qui peuvent être utilisés pour créer des graphiques, des cartes et des tableaux. Enfin, les visualisations sont combinées dans des rapports exportables pour la diffusion.


## Exigences techniques

### Langues supportées

L'application prend actuellement en charge l'anglais et le français. Les paramètres linguistiques peuvent être configurés au niveau de l'instance pour répondre aux besoins des différentes communautés d'utilisateurs.

### Exigences en matière de navigateur

L'application est conçue pour fonctionner avec des navigateurs web modernes. Chrome est recommandé pour des performances optimales, mais Firefox, Safari et Edge sont également pris en charge. JavaScript doit être activé pour une fonctionnalité complète.

## Concepts de base

La compréhension de ces concepts de base aidera les utilisateurs à travailler efficacement avec l'application.

### Instance

Une **instance** est l'espace de travail principal de l'organisation au sein de la plate-forme. Elle sert de conteneur de premier niveau pour tous les utilisateurs, la structure administrative partagée, les sources de données et les projets. Chaque organisation opère généralement au sein d'une seule instance qui fournit la base de tout le travail analytique.

### Projets

Un **projet** est un espace de travail d'analyse ciblé au sein d'une instance. Les projets permettent aux utilisateurs de travailler avec des sous-ensembles spécifiques de données en définissant des périodes, des installations et des indicateurs pertinents pour un objectif analytique particulier. Dans chaque projet, les utilisateurs peuvent activer des modules analytiques, créer des visualisations, générer des rapports et collaborer avec les membres de l'équipe. Plusieurs projets peuvent exister au sein d'une même instance, chacun ayant une portée de données et des configurations d'accès utilisateur différentes.

### Structure

La **structure** définit l'organisation hiérarchique des zones administratives et des établissements de santé au sein de la plateforme.

**Les zones administratives** représentent les frontières géographiques organisées en quatre niveaux maximum. La zone administrative 1 représente les frontières du pays. La zone administrative 2 correspond aux plus grandes unités infranationales telles que les provinces ou les régions. La zone administrative 3 englobe les unités de niveau intermédiaire telles que les districts ou les départements, tandis que la zone administrative 4 représente les unités plus petites telles que les communes ou les sous-districts. Les quatre niveaux administratifs ne sont pas toujours nécessaires.

**Les établissements de santé** sont les points de prestation de services de santé - y compris les hôpitaux, les cliniques et les postes de santé - qui sont liés aux zones administratives au sein de la structure. Les établissements peuvent avoir des attributs supplémentaires tels que le type d'établissement (hôpital, centre de santé ou dispensaire) et la catégorie de propriété (publique, privée ou confessionnelle).

### Sources de données

#### Données SIGS

Les données du système d'information sur la gestion de la santé (SIGS) contiennent des statistiques de routine sur les services de santé recueillies auprès des établissements. Il s'agit notamment d'indicateurs de prestation de services, de données de surveillance des maladies et d'indicateurs de performance des programmes. Les données SIGS sont généralement communiquées sur une base mensuelle et constituent la base de la plupart des analyses de routine du système de santé.

#### Données HFA

Les données d'évaluation des établissements de santé (HFA) contiennent des informations sur les caractéristiques et les capacités des établissements. Il s'agit notamment de données sur la disponibilité des infrastructures, l'équipement et les fournitures, les niveaux de personnel et l'état de préparation des services. Les données HFA complètent les données SIGS en fournissant un contexte sur les établissements à partir desquels les données de routine sont rapportées.

### Indicateurs

**Les indicateurs** sont des paramètres de santé mesurables utilisés dans la plateforme. Il peut s'agir soit d'**Indicateurs communs**, qui sont définis et partagés dans l'instance pour une mesure cohérente, soit d'**Indicateurs DHIS2**, qui sont importés de systèmes DHIS2 externes et peuvent suivre des conventions de dénomination ou des méthodes de calcul différentes.

### Ensembles de données et versions

Un **dataset** est une collection de données de santé, soit SIGS soit HFA. Chaque fois que des données sont importées dans la plateforme, une nouvelle version est créée. Ce système de versions permet aux utilisateurs de suivre les changements au fil du temps, de passer d'une version à l'autre si nécessaire et de conserver un historique complet des données à des fins d'audit et de comparaison.

### Modules

**Les modules** sont des unités de traitement des données qui exécutent des scripts analytiques R au sein de la plateforme. Chaque module prend des données d'entrée provenant d'ensembles de données ou des sorties d'autres modules, traite et analyse les données selon des méthodes statistiques définies et produit des objets de résultats sous forme de fichiers de sortie. Les modules peuvent être enchaînés pour prendre en charge des flux de travail analytiques complexes dans lesquels un module utilise les sorties d'un autre module comme ses entrées.

La plateforme distingue deux types de modules. Une **Définition de module** est le modèle ou le plan d'un type d'analyse, définissant les méthodes analytiques et les paramètres disponibles. Une **Instance de module** est un module qui a été activé et configuré dans un projet spécifique. Certains modules ont des conditions préalables, ce qui signifie que d'autres modules doivent d'abord être activés avant de pouvoir être utilisés.

### Visualisations (objets de présentation)

**Les visualisations**, également appelées objets de présentation, sont des représentations visuelles des données générées par les sorties du module. La plate-forme prend en charge trois principaux types de visualisation : les graphiques (y compris les diagrammes à barres, les graphiques linéaires et les diagrammes circulaires), les cartes (visualisations géographiques montrant des données dans des zones administratives) et les tableaux (affichages de données tabulaires).

Les visualisations peuvent être filtrées selon diverses dimensions et désagrégées en fonction de facteurs tels que le type d'établissement, la période ou le niveau administratif. Les utilisateurs peuvent personnaliser l'apparence et le style des visualisations et les exporter pour les utiliser dans des applications externes ou les inclure directement dans des rapports.

### Rapports

**Les rapports sont des collections de pages de visualisation conçues pour être exportées et partagées avec les parties prenantes. Les rapports peuvent être exportés sous forme de présentations PowerPoint ou de documents PDF, et peuvent être organisés avec plusieurs pages configurées avec des mises en page et des orientations personnalisées. Chaque page d'un rapport est un **élément de rapport** qui contient une visualisation.

### Fenêtrage

**Le fenêtrage** fait référence au processus de sélection d'un sous-ensemble de données d'instance à utiliser dans le cadre d'un projet. Les utilisateurs peuvent filtrer les données par période (en sélectionnant des mois ou des années spécifiques), par indicateurs (y compris tous les indicateurs ou seulement des indicateurs spécifiques), par zones administratives (y compris toutes les régions ou des régions spécifiques) et par établissements (en filtrant par type d'établissement ou par propriété). Cette fonctionnalité permet aux projets de se concentrer sur les données les plus pertinentes pour leurs objectifs analytiques sans avoir à charger l'ensemble des données.

### Désagrégation

**La désagrégation** fait référence au processus de décomposition des données par dimensions afin d'identifier les modèles et les variations. Les données peuvent être désagrégées par période (mensuelle, trimestrielle ou annuelle), par zone administrative, par type d'établissement, par propriétaire de l'établissement ou par catégories d'indicateurs. Cette capacité permet une analyse plus nuancée et aide à identifier les disparités entre les différentes dimensions.

### Rôles des utilisateurs

Les utilisateurs peuvent se voir attribuer différents rôles qui déterminent leurs autorisations au sein de la plateforme. Au **niveau de l'instance**, les administrateurs globaux ont un accès complet à tous les paramètres de l'instance et à tous les projets. Au **niveau du projet**, trois rôles sont disponibles : Les administrateurs peuvent modifier les paramètres du projet, les modules, les visualisations et les rapports ; les éditeurs peuvent créer et modifier les visualisations et les rapports ; et les spectateurs peuvent voir le contenu du projet mais ne peuvent pas le modifier.

### Qualité des données

La plateforme évalue automatiquement l'exhaustivité et l'exactitude des données, générant des scores de qualité qui aident les utilisateurs à identifier les problèmes potentiels liés aux données. Ces scores soutiennent les processus d'examen de la qualité des données et permettent de hiérarchiser les domaines nécessitant une attention particulière.

### Statut de verrouillage

Les projets peuvent être **verrouillés** pour empêcher toute modification de leur configuration tout en permettant aux utilisateurs de consulter les rapports. Lorsqu'un projet est verrouillé, les modules et les paramètres de données ne peuvent pas être modifiés, ce qui permet de préserver les configurations analytiques une fois qu'elles ont été finalisées.

!!! tip "Guide de l'utilisateur"
    Pour des tutoriels étape par étape sur l'utilisation de la plateforme, consultez le [Guide de l'utilisateur FASTR](11_user_guide.md).

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
//            Modifiez les diapositives de l'atelier ci-dessous   //
//                                                                //
////////////////////////////////////////////////////////////////////
-->

<!-- SLIDE:m3_1 -->
## Plateforme analytique FASTR

La **plateforme analytique FASTR** est un outil en ligne conçu pour soutenir l'évaluation de la qualité des données, l'ajustement et l'analyse des données de santé de routine.

Elle permet aux utilisateurs de télécharger et d'analyser des données provenant de diverses sources, y compris le DHIS2, avec des méthodes statistiques intégrées pour générer un ensemble de données ajustées et effectuer des analyses prioritaires sur des indicateurs sélectionnés.

La plateforme fournit une interface conviviale pour l'exécution des analyses et offre des options flexibles pour la visualisation et l'exportation des résultats.

<div class="image-row">

![h:180](../resources/screenshots/platform/platform_overview_1.png) ![h:180](../resources/screenshots/platform/platform_overview_2.png) ![h:180](../resources/screenshots/platform/platform_overview_3.png)

</div>
<!-- /SLIDE -->

<!-- SLIDE:m3_1b -->
## Capacités de la plateforme

La plateforme couvre l'ensemble du processus analytique — de l'importation de vos données à la production d'un rapport final :

![Capacités de la plateforme](../resources/diagrams_fr/platform_capabilities.svg)
<!-- /SLIDE -->

<!-- SLIDE:m3_2a -->
## Instance pays

Chaque pays possède sa propre **instance** de la plateforme analytique FASTR — un déploiement spécifique au pays qui sert de hub centralisé pour l'analyse des données de santé.

Chaque instance :

- **Intègre les données** du rapportage de routine des établissements (DHIS2) et des enquêtes auprès des ménages (EDS, MICS)
- **Maintient les configurations spécifiques au pays** — structure géographique (régions, districts, établissements), définitions des indicateurs et règles de qualité des données
- **Fournit un environnement analytique unifié** où les utilisateurs peuvent explorer les données de routine et d'enquête sans expertise technique

*Pensez à une instance comme la plateforme intégrée de données de santé de votre pays.*
<!-- /SLIDE -->

<!-- SLIDE:m3_2b -->
## Rôles et autorisations des utilisateurs

Il existe deux niveaux de permissions dans la plateforme :

&nbsp;

**Rôles au niveau de l'instance :**

- **Les administrateurs de l'instance** peuvent ajouter des utilisateurs, créer des projets, attribuer des rôles, télécharger des données, importer et configurer des modules et effectuer des analyses

&nbsp;

**Rôles au niveau du projet :**

- **Les éditeurs de projets** peuvent créer des visualisations, des rapports et télécharger/exporter des résultats
- **Les visualisateurs de projets** peuvent afficher des visualisations, consulter des rapports et télécharger/exporter des résultats

&nbsp;

*Les administrateurs sont assignés par instance ; les éditeurs et les visualisateurs sont assignés par projet.*
<!-- /SLIDE -->

<!-- SLIDE:m3_2c -->
## Projets au sein d'une instance

<style scoped>
.container { display: flex; gap: 1rem; }
.container .img-col { flex: 2; }
.container .img-col img { width: 100%; height: auto; }
.container .text-col { flex: 1; font-size: 0.85em; }
</style>

<div class="container">
<div class="img-col">

![Projets au sein de l'instance](../resources/diagrams_fr/projects_within_instance.svg)

</div>
<div class="text-col">

Un projet est un **espace de travail analytique** au sein d'une instance, organisé autour d'un objectif de rapportage spécifique.

Chaque projet contient des **métriques**, des **visualisations**, des **présentations** et des **modules d'analyse** — tout ce qu'il faut pour passer des données brutes à un rapport finalisé.

Un pays peut avoir besoin d'un seul projet ou de plusieurs — par exemple, des projets distincts pour les rapports annuels, l'analyse des enquêtes ou différentes équipes.

</div>
</div>
<!-- /SLIDE -->

<!-- SLIDE:m3_2e -->
## Configuration de la plateforme d'analyse

La configuration est effectuée par un **administrateur d'instance** — tous les utilisateurs n'ont pas besoin de faire cette étape.

Pendant l'atelier, un participant sera désigné avec les droits d'administrateur pour parcourir les étapes de configuration avec l'équipe de facilitation.

La configuration comprend :

- **Zones administratives** — les niveaux géographiques de votre système de santé (régions, districts)
- **Structure des établissements** — la liste des établissements de santé et leur organisation
- **Définitions des indicateurs** — les métriques de santé que vous souhaitez suivre (par ex., visites CPN, vaccinations)
<!-- /SLIDE -->

<!-- SLIDE:m3_3 -->
## Prise en main de la plateforme

Maintenant que vous comprenez comment la plateforme est organisée, vous allez pratiquer dans l'activité **Prise en main**.

Vous allez :

- **Vous connecter** à l'instance FASTR de votre pays
- **Naviguer** dans l'interface — projets, modules, et visualisations
- **Explorer** un exemple de projet pour voir comment les données, analyses et rapports s'articulent

*Votre facilitateur vous guidera à chaque étape.*
<!-- /SLIDE -->

<!-- SLIDE:m3_5 -->
## Feuille de route de la plateforme

![Feuille de route 2025-2028 h:450](../resources/diagrams_fr/platform_roadmap_2026.svg)

<!--
PRESENTER NOTES:
- La plateforme évolue en fonction des retours réels des utilisateurs
- Nous ne construisons pas en isolation — les équipes pays façonnent la feuille de route
- L'élargissement des sources de données signifie des analyses plus riches sans changer les flux de travail
- L'objectif à long terme : les pays peuvent mener leurs propres analyses de manière autonome
-->
<!-- /SLIDE -->

---

**Dernière mise à jour** : 06-05-2026
**Contact** : <fastr@worldbank.org>

<!-- SLIDE:m3_0 -->
## Ce que vous allez apprendre

Dans ce module, vous allez apprendre :

- Ce qu'est la **plateforme analytique FASTR** et ce qu'elle peut faire
- Comment la plateforme est organisée — **instances**, **projets**, et **rôles utilisateurs**
- Qui fait quoi — la différence entre **administrateurs**, **éditeurs**, et **visualisateurs**
- Comment la plateforme est configurée pour votre pays

*Après cette vue d'ensemble, vous pratiquerez dans l'activité Prise en main.*
<!-- /SLIDE -->
