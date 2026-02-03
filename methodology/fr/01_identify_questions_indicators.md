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

- **Complétude**
  La complétude des rapports est élevée dans tous les établissements et dans le temps.

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

Les indicateurs à haut degré de complétude sont préférés parce qu'ils :

- **Améliorent la fiabilité des données**
  Des données plus complètes réduisent les biais et donnent une image plus représentative de la prestation de services.

- **Permettent une analyse cohérente**
  Un niveau élevé de complétude permet des comparaisons significatives dans le temps et dans l'espace.

- **Réduisent les erreurs d'interprétation**
  Des données incomplètes peuvent faussement suggérer des changements dans l'utilisation des services lorsque ces changements sont dus à des lacunes dans les rapports plutôt qu'à des tendances réelles.

Bien que des méthodes statistiques telles que l'imputation puissent être utilisées pour traiter les données incomplètes, ces méthodes requièrent des hypothèses sur les valeurs manquantes. De plus amples détails sont fournis dans [Ajustement de la qualité des données](05_data_quality_adjustment.md).

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

L'approche FASTR se concentre sur un ensemble d'indicateurs SRMNIA-N qui représentent des points clés du continuum de la santé reproductive, maternelle, néonatale, infantile et adolescente et de la nutrition dans les pays à revenu faible et intermédiaire. Ces indicateurs font généralement l'objet d'un plus grand nombre de rapports et d'une plus grande complétude, et servent d'indicateurs pour des modèles plus larges de prestation de services.

Les consultations externes sont également incluses en tant qu'indicateur de l'utilisation globale des services de santé. Des indicateurs spécifiques à un pays ou à un programme peuvent être ajoutés si nécessaire pour refléter les priorités nationales.

---

## Préparation de l'extraction des données

Cette étape comprend une liste de contrôle préalable à l'extraction, l'examen de la configuration de DHIS2, la mise en correspondance des indicateurs avec les éléments de données et la planification du calendrier d'extraction. Ces étapes garantissent que les analyses en aval sont basées sur des données cohérentes et bien comprises.

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

<!-- SLIDE:m1_1 -->
## Qu'est-ce qu'un cas d'utilisation des données ?

Un cas d'utilisation des données est un scénario spécifique dans lequel les données sont utilisées pour atteindre un objectif particulier ou résoudre un problème.

**Pourquoi est-il important de définir un cas d'utilisation des données ?**

- Conduit à de meilleurs résultats en alignant les efforts liés aux données sur les objectifs organisationnels
- Guide la prise de décision en fournissant un cadre clair pour l'analyse
- Améliore l'efficacité en concentrant les analyses sur un ensemble d'indicateurs clés pertinents pour répondre à un besoin spécifique en matière de données
<!-- /SLIDE -->

<!-- SLIDE:m1_1a -->
## Nigeria : Suivi trimestriel des performances

Au Nigeria, FASTR permet le suivi trimestriel des performances dans le cadre de l'Initiative nationale de renouvellement du secteur de la santé -- et contribue au renforcement des systèmes en parallèle.

<div style="display: flex; gap: 1em;">
<div style="flex: 1;">

![Exemple FASTR Nigeria 1](resources/screenshots/country_examples/nigeria_example_1.png)

</div>
<div style="flex: 1;">

![Exemple FASTR Nigeria 2](resources/screenshots/country_examples/nigeria_example_2.png)

</div>
</div>

<div style="font-size: 0.75em;">

> "Le processus FASTR devrait ouvrir des conversations sérieuses qui mèneront à des améliorations du système. Il ne s'agit pas de sélectionner un indicateur qui ne nous donnera pas de bonnes informations. Il s'agit d'utiliser ce processus FASTR pour prendre de meilleures décisions et réorganiser le système."
>
> — **Dr. Anthony Adoghe**, Directeur du suivi-évaluation, Ministère fédéral de la Santé et de la Protection sociale

</div>
<!-- /SLIDE -->

<!-- SLIDE:m1_1a2 -->
## Guinée : Suivi des progrès du dossier d'investissement

<p style="font-size: 0.85em;">Le suivi trimestriel de l'utilisation des services SRMNIA-N a permis à la Guinée de suivre les progrès du dossier d'investissement et de repérer rapidement les difficultés -- comme cette forte baisse de la vaccination au début de 2024.</p>

![Suivi de la vaccination en Guinée h:440](resources/screenshots/country_examples/guinea_immunization.jpeg)
<!-- /SLIDE -->

<!-- SLIDE:m1_1a3 -->
## Éthiopie : Suivi des résultats des programmes gouvernementaux

<p style="font-size: 0.85em;">Utilisation de l'analyse SIGS FASTR pour le suivi des résultats prioritaires dans le cadre du programme gouvernemental soutenu par la BM/GFF en Éthiopie.</p>

![Suivi FASTR Éthiopie h:440](resources/screenshots/country_examples/ethiopia_example.png)
<!-- /SLIDE -->

<!-- SLIDE:m1_1b -->
## Quel est notre cas d'utilisation commun des données qui sera au centre de cet atelier ?

Suite à d'importants changements dans la disponibilité des ressources provenant de sources externes, de nombreux pays connaissent des réductions abruptes et importantes de leur financement

- Entraînant des lacunes critiques dans les programmes et les systèmes
- Conduisant à des effets potentiellement graves sur la prestation de services et les résultats de santé pour les femmes, les enfants et les adolescents

**Questions clés qui se posent :**

- Quelle est l'ampleur des coupes, et quel effet ont-elles sur la prestation de services ?
- Quelle est la meilleure façon de prioriser les ressources restantes ?
- Quelles autres adaptations peuvent protéger et renforcer la prestation de services essentiels pour les femmes, les enfants et les adolescents ?
<!-- /SLIDE -->

<!-- SLIDE:m1_1c -->
## Comment sélectionnons-nous les indicateurs ? Qu'est-ce qui fait un bon indicateur pour l'analyse FASTR ?

La sélection des indicateurs est essentielle à la qualité et à l'utilité de l'analyse FASTR. Les indicateurs doivent être choisis en fonction des critères suivants :

- **Pertinence** - Cet indicateur fournit-il des données qui correspondent à nos questions et objectifs prioritaires ?
- **Volume** - Cet indicateur est-il collecté en grand nombre, ce qui améliore la robustesse de l'analyse ?
- **Complétude** - L'indicateur présente-t-il un taux de complétude élevé parmi les établissements déclarants ?
- **Fréquence** - L'indicateur est-il rapporté assez fréquemment (par exemple, tous les mois) pour permettre une analyse en cycle rapide ?
- **Type** - Cet indicateur est-il un décompte des services fournis ?
<!-- /SLIDE -->

<!-- SLIDE:m1_2 -->
## Indicateurs de base du FASTR

L'approche FASTR se concentre sur un ensemble d'indicateurs SRMNIA-N qui représentent des points clés du continuum de la santé reproductive, maternelle, néonatale, infantile et adolescente et de la nutrition dans les pays à revenu faible et intermédiaire.

Ces indicateurs font généralement l'objet d'un plus grand nombre de rapports et d'une plus grande complétude, et servent d'indicateurs pour des modèles plus larges de prestation de services.

- 1ère visite prénatale (CPN1)
- 4ème visite prénatale (CPN4)
- Accouchement en établissement
- Soins postnataux 1
- Doses de BCG
- Pentavalent 1ère dose
- Pentavalent 3ème dose
- Consultations externes
<!-- /SLIDE -->

<!-- SLIDE:m1_2a -->
<!-- _class: columns-image-right -->

## Les pays ont sélectionné des indicateurs alignés sur le contexte des perturbations et les priorités nationales

![Liste de contrôle de préparation des données h:280](../resources/screenshots/data_prep_checklist.png)

- La liste de contrôle de préparation des données FASTR a été partagée avec les pays
- La liste comprend les indicateurs de base SRMNIA-N du FASTR
- Les pays ont ajouté des indicateurs supplémentaires pertinents pour leur contexte (par exemple, services touchés par les changements de financement, priorités gouvernementales)
- Ce sont les indicateurs inclus dans l'analyse actuelle
- Les pays peuvent continuer à ajouter des indicateurs au fil du temps selon leurs besoins
<!-- /SLIDE -->

<!-- SLIDE:m1_3 -->
## Pourquoi se concentrer sur les indicateurs à volume élevé ?

L'un des principaux atouts de l'approche FASTR est sa capacité à ajuster pour les problèmes de qualité des données. Les indicateurs à volume élevé sont mieux adaptés à ce processus parce que :

**Sensibilité réduite aux valeurs aberrantes**
Dans les indicateurs à faible volume, les points de données individuels peuvent affecter les tendances de manière disproportionnée.

**Estimations plus stables**
Les données à volume élevé réduisent la variabilité aléatoire et améliorent la fiabilité de la détection des tendances.

**Identification plus claire des véritables anomalies**
Des effectifs plus importants permettent de distinguer plus facilement les véritables valeurs aberrantes des variations naturelles.
<!-- /SLIDE -->

<!-- SLIDE:m1_3a -->
## Pourquoi se concentrer sur des indicateurs à complétude élevée ?

Les indicateurs à haut degré de complétude sont préférés parce qu'ils :

**Améliorent la fiabilité des données**
Des données plus complètes réduisent les biais et donnent une image plus représentative de la prestation de services.

**Permettent une analyse cohérente**
Un niveau élevé de complétude permet des comparaisons significatives dans le temps et dans l'espace.

**Réduisent les erreurs d'interprétation**
Des données incomplètes peuvent faussement suggérer des changements dans l'utilisation des services lorsque ces changements sont dus à des lacunes dans les rapports plutôt qu'à des tendances réelles.

Bien que des méthodes statistiques telles que l'imputation puissent être utilisées pour traiter les données incomplètes, ces méthodes requièrent des hypothèses sur les valeurs manquantes.
<!-- /SLIDE -->

<!-- SLIDE:m1_3b -->
## Pourquoi se concentrer sur les indicateurs de comptage ?

**Limites des indicateurs de proportion**

- Les proportions limitent la possibilité d'ajuster séparément les numérateurs et les dénominateurs pour les problèmes de qualité des données
- Les numérateurs et les dénominateurs peuvent être affectés par différentes sources d'erreur
- Séparer les comptes de l'estimation du dénominateur permet des ajustements plus transparents et plus souples

**La mortalité en tant qu'événement rare**

- Les indicateurs de mortalité sont généralement de faible fréquence et ne se prêtent pas à des ajustements
- Il est généralement préférable d'analyser ces indicateurs en utilisant des données annuelles plutôt que mensuelles ou trimestrielles
<!-- /SLIDE -->

---

**Dernière mise à jour** : 03-02-2026
**Contact** : Équipe du projet FASTR
