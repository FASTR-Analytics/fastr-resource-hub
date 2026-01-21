<!-- AUTO-TRANSLATED from 01_identify_questions_indicators.md -->
<!-- Add REVIEWED marker after human review to protect from overwrite -->

# Identifier les questions et les indicateurs

**Note:** Le contenu de cette section s'inspire des documents de présentation existants du FASTR et est susceptible d'être révisé.

## Vue d'ensemble

Cette section décrit le processus d'identification des questions politiques et programmatiques prioritaires et de sélection des indicateurs appropriés pour l'analyse FASTR. Elle fournit une approche structurée pour s'assurer que les analyses FASTR sont axées sur la demande, réalisables sur le plan analytique et alignées sur les priorités nationales.

Cette section couvre en particulier les points suivants

1. **Introduction au FASTR : lacunes et défis**
   Une vue d'ensemble des lacunes analytiques que FASTR est conçu pour combler, son rôle dans la réduction de la fragmentation dans l'analyse des données de routine, et comment FASTR peut être positionné comme un point d'entrée pour l'engagement avec les parties prenantes du gouvernement.

2. **Développement d'un cas d'utilisation des données**
   Des conseils sur l'élaboration conjointe de cas d'utilisation des données par le biais d'ateliers avec le ministère de la santé et d'autres parties prenantes, y compris des exemples pratiques issus de la mise en œuvre dans les pays.

3. **Définition des questions prioritaires et sélection des indicateurs**
   Un cadre pour formuler des questions analytiques prioritaires, sélectionner des indicateurs appropriés et aligner l'analyse FASTR sur les stratégies nationales et les besoins en matière de prise de décision.

4. **Préparation de l'extraction des données**
   Un aperçu de haut niveau des considérations préalables à l'extraction, y compris la compréhension de la configuration du DHIS2, la mise en correspondance des indicateurs avec les éléments de données et la planification du calendrier d'extraction.

---

## Définir les questions prioritaires

L'utilisation efficace des données de routine dépend de questions analytiques bien définies. Les questions prioritaires orientent les analyses FASTR et permettent de s'assurer que les résultats sont pertinents et exploitables pour les décideurs.

**Les caractéristiques d'une bonne question prioritaire sont les suivantes:**

- **Aborde une question prioritaire**
  Elle se concentre sur des sujets qui intéressent clairement les décideurs politiques et les gestionnaires de programmes.

- **Pertinente**
  Suffisamment important pour justifier une analyse et éclairer la prise de décision.

- **Ancré dans les réalités actuelles**
  En rapport avec les défis, les réformes ou les chocs en cours qui affectent la prestation de services.

- **Significatif pour les parties prenantes**
  Aborde des questions qui importent à des personnes ou des groupes spécifiques impliqués dans la planification ou la mise en œuvre.

- **Réalisable**
  Peut être abordé en utilisant les données, les méthodes et les délais disponibles.

### Évaluer la pertinence : questions clés à prendre en considération

Pour déterminer si une question est prioritaire, les considérations suivantes sont utiles :

- **Qui** est le public visé ?  
- **Qu'ont-ils besoin de savoir ou veulent-ils savoir ?**
- **Quand ont-ils besoin de ces informations ?**
- **Quelle période ou quel événement** les intéresse ?
- **Pourquoi ces informations sont-elles nécessaires ?**
- **Comment les résultats seront-ils utilisés ?**

### Qu'entendons-nous par "susceptible de donner lieu à une réponse" ?

Une question est considérée comme susceptible de recevoir une réponse si les conditions suivantes sont remplies :

**Disponibilité des données**
- Les données requises existent et sont d'un type, d'une quantité et d'une qualité suffisants.

**Faisabilité analytique**
- Des méthodes appropriées et statistiquement valables sont disponibles et peuvent être appliquées.

**Délai d'exécution**
- L'analyse peut être réalisée dans les délais impartis (par exemple, les cycles de déclaration trimestriels).

### Cadre PICO pour la formulation de questions auxquelles il est possible de répondre

**Note:** Ce cadre était inclus dans le matériel de présentation original et est conservé ici en tant qu'outil facultatif.

Le cadre PICO, couramment utilisé dans le domaine de la santé publique et de la recherche fondée sur des données probantes, offre une méthode structurée pour formuler des questions claires et auxquelles il est possible de répondre.

| Composant | Description |
|----------|-------------|
| **Population** | La population ou le groupe d'intérêt |
| **Intervention** | Le service, le programme ou l'action examinés |
| **Comparaison** | La condition de référence ou de comparaison pertinente, le cas échéant |
| **Outcome (Résultat)** | Le changement attendu ou l'objectif de santé publique |

---

## Sélection des indicateurs : qu'est-ce qui fait un bon indicateur FASTR ?

La sélection des indicateurs est essentielle à la qualité et à l'utilité de l'analyse FASTR. Les indicateurs doivent être choisis en fonction des critères suivants :

- **Pertinence**
  L'indicateur correspond aux questions prioritaires et aux objectifs politiques.

- **Volume**
  L'indicateur est rapporté à des volumes suffisamment élevés pour permettre une analyse solide.

- **Exhaustivité**
  L'exhaustivité des rapports est élevée dans tous les établissements et dans le temps.

- **Fréquence**
  L'indicateur est rapporté assez fréquemment (généralement tous les mois) pour permettre une analyse en cycle rapide.

- **Type d'indicateur**
  L'indicateur représente le nombre de services fournis.

### Pourquoi se concentrer sur les indicateurs à volume élevé ?

L'un des principaux atouts de l'approche FASTR est sa capacité à s'adapter aux problèmes de qualité des données. Les indicateurs de volume élevé sont mieux adaptés à ce processus pour les raisons suivantes :

- **Réduction de la sensibilité aux valeurs aberrantes**
  Dans les indicateurs à faible volume, les points de données individuels peuvent affecter les tendances de manière disproportionnée.

- **Des estimations plus stables**
  Les données à fort volume réduisent la variabilité aléatoire et améliorent la fiabilité de la détection des tendances.

- **Identification plus claire des véritables anomalies**
  Des effectifs plus importants permettent de distinguer plus facilement les véritables valeurs aberrantes des variations naturelles.

Les indicateurs de comptage permettent également une validation et un ajustement continus avant que les proportions ou les mesures de couverture ne soient dérivées de l'extérieur.

### Pourquoi se concentrer sur des indicateurs très complets ?

Les indicateurs à haut degré d'exhaustivité sont préférés parce qu'ils.. :

- **Améliorent la fiabilité des données**
  Des données plus complètes réduisent les biais et donnent une image plus représentative de la prestation de services.

- **Les données plus complètes réduisent les biais et donnent une image plus représentative de la prestation de services**
  Un niveau élevé d'exhaustivité permet des comparaisons significatives dans le temps et dans l'espace.

- **Réduire les erreurs d'interprétation**
  Des données incomplètes peuvent faussement suggérer des changements dans l'utilisation des services lorsque ces changements sont dus à des lacunes dans les rapports plutôt qu'à des tendances réelles.

Bien que des méthodes statistiques telles que l'imputation puissent être utilisées pour traiter les données incomplètes, ces méthodes requièrent des hypothèses sur les valeurs manquantes. De plus amples détails sont fournis dans [Ajustement de la qualité des données] (05_data_quality_adjustment.md).

### Pourquoi se concentrer sur les indicateurs de comptage ?

**Limites des indicateurs de proportion**

- Les proportions limitent la possibilité d'ajuster séparément les numérateurs et les dénominateurs pour tenir compte des problèmes de qualité des données.  
- Les numérateurs et les dénominateurs peuvent être affectés par différentes sources d'erreur.  
- Séparer les comptes de l'estimation du dénominateur permet des ajustements plus transparents et plus souples.

**La mortalité en tant qu'événement rare**

- Les indicateurs de mortalité sont généralement de faible fréquence et ne se prêtent pas à des ajustements fréquents.  
- Il est généralement préférable d'analyser ces indicateurs en utilisant des données annuelles plutôt que mensuelles ou trimestrielles.

---

## Indicateurs de base du FASTR

L'approche FASTR se concentre sur un ensemble d'indicateurs RMNCAH-N qui représentent des points clés du continuum de la santé reproductive, maternelle, néonatale, infantile et adolescente et de la nutrition dans les pays à revenu faible et intermédiaire. Ces indicateurs font généralement l'objet d'un plus grand nombre de rapports et d'une plus grande exhaustivité, et servent d'indicateurs pour des modèles plus larges de prestation de services.

Les consultations externes sont également incluses en tant qu'indicateur de l'utilisation globale des services de santé. Des indicateurs spécifiques à un pays ou à un programme peuvent être ajoutés si nécessaire pour refléter les priorités nationales.

---

## Préparation de l'extraction des données

Cette étape comprend une liste de contrôle préalable à l'extraction, l'examen de la configuration de DHIS2, la mise en correspondance des indicateurs avec les éléments de données et la planification du calendrier d'extraction. Ces étapes garantissent que les analyses en aval sont basées sur des données cohérentes et bien comprises.

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

<!-- SLIDE:m1_1 -->
## Introduction au FASTR : lacunes et défis

*Contenu à développer*

Cette section couvrira :
- L'identification des lacunes et des défis que FASTR est bien placé pour soutenir
- Comment le FASTR sert de point d'entrée pour réduire la fragmentation
- Entamer la conversation avec les parties prenantes du gouvernement
<!-- /SLIDE -->

<!-- SLIDE:m1_2 -->
## Développement d'un cas d'utilisation des données

*Contenu à développer*

Cette section couvrira :
- L'approche de l'atelier de co-création avec le ministère de la santé et les parties prenantes
- Conseils pour l'élaboration de cas d'utilisation des données
- Des exemples de cas d'utilisation issus de la mise en œuvre dans les pays
<!-- /SLIDE -->

<!-- SLIDE:m1_2a -->
## Définir les questions prioritaires

L'utilisation efficace des données repose sur des questions bien définies. Les questions prioritaires guideront l'analyse FASTR et amélioreront l'aide à la prise de décision.

**Qualités d'une bonne question:**

- **Elle aborde une question prioritaire** : Un sujet d'intérêt pour vous et les décideurs politiques
- **Pertinente** : Suffisamment important pour mériter une réponse
- **Reliée à des expériences vivantes** : Liée à des expériences vivantes** : liée à des questions d'actualité
- **Important pour les individus/groupes** : Importante pour les individus/groupes** : importante pour les parties prenantes
- **Il est possible d'y répondre** : Peut être abordé avec les données et les méthodes disponibles
<!-- /SLIDE -->

<!-- SLIDE:m1_2b -->
## Ma question est-elle une priorité pertinente ? 5+ Ws à considérer

- **Qui** est votre public ?
- **Qu'est-ce qu'ils ont besoin de savoir et veulent savoir ?**
- **Quand** ont-ils besoin de le savoir ?
- **Quand** se déroule l'événement/l'intervention/la période qui les intéresse ?
- **Pourquoi ont-ils besoin de savoir ?**
- **Comment utiliseront-ils les résultats ?**
<!-- /SLIDE -->

<!-- SLIDE:m1_2c -->
## Qu'entendons-nous par "susceptible de recevoir une réponse" ?

**Nous avons les données**
- Type, quantité, qualité suffisante pour la question

**Nous disposons des outils/méthodes d'analyse**
- Statistiquement valables ; utilisables

**Nous disposons du temps nécessaire**
- Nous pouvons répondre à la question sur une base trimestrielle
<!-- /SLIDE -->

<!-- SLIDE:m1_2d -->
<!-- Note : Cette diapositive était cachée dans la présentation originale mais il peut être utile de l'inclure -->
## Cadre PICO pour l'identification des questions auxquelles il est possible de répondre

Outil standard de la médecine fondée sur les preuves et de la recherche en santé publique pour formuler des questions claires auxquelles il est possible de répondre.

| Composant | Description |
|-----------|-------------|
| **P**opulation | Qui fait l'objet de l'enquête |
| **I**ntervention | Qu'est-ce qui est examiné |
| **C**omparaison | Quelle est la situation de référence/sans intervention |
| **O**utcome (Résultat) | Quel est l'objectif de santé publique |
<!-- /SLIDE -->

<!-- SLIDE:m1_3 -->
## Qu'est-ce qui fait un bon indicateur pour l'analyse FASTR ?

- **Pertinence** : Cet indicateur correspond-il à nos questions et objectifs prioritaires ?
- **Volume** : Cet indicateur est-il collecté en grand nombre, ce qui améliore la robustesse de l'analyse ?
- **Complétude** : L'indicateur présente-t-il un taux d'exhaustivité élevé parmi les établissements déclarants ?
- **Fréquence** : L'indicateur est-il rapporté assez fréquemment (par exemple, tous les mois) pour permettre une analyse en cycle rapide ?
- **Type** : Cet indicateur est-il un décompte des services fournis ?
<!-- /SLIDE -->

<!-- SLIDE:m1_3a -->
## Pourquoi se concentrer sur les indicateurs à volume élevé ?

L'une des principales valeurs ajoutées de l'approche FASTR consiste à procéder à des ajustements pour tenir compte de la qualité des données. Les indicateurs à faible volume sont difficiles à ajuster :

- **Plus grande sensibilité aux valeurs aberrantes** : Un seul point de données inhabituellement élevé ou bas peut avoir un impact disproportionné sur l'analyse globale
- **Estimations instables** : De petites variations peuvent conduire à des changements de pourcentage importants, ce qui rend plus difficile la distinction entre les tendances réelles et la variabilité aléatoire
- **Difficulté à identifier les vraies valeurs aberrantes** : Difficulté à déterminer si un point de données est réellement aberrant ou s'il fait partie de la variabilité naturelle

Les indicateurs de comptage permettent de vérifier en permanence la qualité des données et d'identifier plus précisément les valeurs aberrantes.
<!-- /SLIDE -->

<!-- SLIDE:m1_3b -->
## Pourquoi se concentrer sur des indicateurs d'exhaustivité élevés ?

Les indicateurs d'exhaustivité élevée améliorent la qualité des données, réduisent les biais et permettent d'obtenir des informations plus précises :

- **Fiabilité des données** : Les données sont représentatives de l'ensemble des établissements, des régions ou des populations
- **Cohérence de l'analyse** : Les points de données provenant de la plupart ou de l'ensemble des unités de déclaration permettent une analyse cohérente sur l'ensemble des périodes et des lieux
- **Risque réduit d'interprétation erronée** : Des données incomplètes peuvent conduire à des conclusions erronées (par exemple, une faible exhaustivité peut suggérer à tort une baisse de l'utilisation des services)

Les méthodes statistiques telles que l'imputation permettent d'ajuster les données incomplètes, mais cela nécessite des hypothèses sur les données manquantes.
<!-- /SLIDE -->

<!-- SLIDE:m1_3c -->
## Pourquoi se concentrer sur les indicateurs de comptage ?

**Défis posés par les indicateurs de proportion :**
- Les proportions limitent notre capacité à appliquer des ajustements pour les problèmes de qualité des données
- Les numérateurs peuvent présenter des problèmes de qualité des données, ce qui fausse les niveaux de couverture réels
- Les dénominateurs peuvent être obsolètes ou inexacts
- L'utilisation séparée des numérateurs et des dénominateurs permet d'apporter des ajustements aux deux

**La mortalité en tant qu'événement rare:**
- Les indicateurs de mortalité sont par nature de faible fréquence, ce qui rend les ajustements proportionnels peu fiables
- Mieux adaptés aux révisions annuelles qu'aux mises à jour mensuelles ou trimestrielles
<!-- /SLIDE -->

<!-- SLIDE:m1_3d -->
## Indicateurs de base du FASTR

L'approche FASTR se concentre sur un ensemble d'indicateurs RMNCAH-N qui :
- Caractérisent le continuum des soins de santé reproductive, maternelle et infantile
- Saisissent les événements clés de la prestation de services avec des taux d'exhaustivité plus élevés et un volume plus important
- Servent d'indicateurs pour d'autres services fournis au même contact

Les consultations externes (OPD) sont utilisées comme indicateur de l'utilisation générale des services de santé.

D'autres indicateurs spécifiques aux pays et aux programmes peuvent être ajoutés pour répondre aux priorités nationales.
<!-- /SLIDE -->

<!-- SLIDE:m1_4 -->
## Préparation de l'extraction des données

*Contenu à développer*

Cette section couvrira :
- Liste de contrôle avant l'extraction
- Comprendre la configuration de votre DHIS2
- Mise en correspondance des indicateurs avec les éléments de données
- Planification du calendrier d'extraction
<!-- /SLIDE -->

---

**Dernière mise à jour** : 07-01-2026
**Contact** : Équipe du projet FASTR
