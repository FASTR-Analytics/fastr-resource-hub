# L'assistant IA

## Aperçu

La plateforme FASTR inclut un assistant IA qui fournit un support à la demande pour l'interprétation des données et la génération de rapports. De nombreux systèmes de santé disposent de plus de données que de capacité à les analyser — le personnel S&E a souvent peu de temps pour des analyses approfondies, les compétences analytiques varient selon les équipes et les régions, et transformer les données en insights narratifs nécessite des connaissances techniques et contextuelles.

L'assistant IA aide à combler cet écart en expliquant les tendances et les patterns en langage clair, en générant des ébauches de rapports et des messages clés, et en répondant aux questions sur les données ou la méthodologie.

## Capacités

### Exploration et analyse des données

L'assistant IA peut interroger les métriques et indicateurs des modules d'analyse installés, filtrer et désagréger par géographie, temps et démographie, voir les données CSV brutes derrière les métriques et visualisations, et explorer les données sur différentes périodes, localisations et sources.

### Visualisation et affichage

L'assistant peut afficher les visualisations existantes du projet et travailler avec des réplicants de graphiques multi-variantes. Il peut créer de nouvelles configurations de graphiques comme des diagrammes à barres, des courbes et des tableaux, et combiner graphiques, tableaux et texte narratif.

### Connaissances et documentation

L'IA a accès à la documentation de la méthodologie FASTR et peut expliquer les indicateurs et méthodes de calcul. Elle interprète les résultats avec le contexte sur la qualité des données, les tendances et les limites, et répond aux questions sur les données de santé.

### Présentation et communication

L'assistant construit des récits qui combinent visuels et texte, mettant en évidence les résultats clés et les patterns. Il crée des vues ciblées en filtrant vers des sous-ensembles pertinents et fournit des insights basés sur les données sous-jacentes.

## Comment ça fonctionne

L'IA suit un principe de « lire avant de répondre » — elle ne devine jamais. Pour les questions sur les données, elle trouve la métrique pertinente, lit les valeurs réelles, et répond avec une visualisation. Pour les questions méthodologiques, elle consulte la documentation, lit les détails, et explique en langage clair.

## Confidentialité et partage

### Ce qui est privé

Votre conversation avec l'IA, vos explorations sur le tableau blanc, et les questions que vous posez et les réponses que vous recevez sont privées pour vous. Les autres membres de l'équipe ne peuvent pas voir ce que vous explorez.

### Ce qui est partagé

Les données sous-jacentes (mêmes données SNIS), les visualisations sauvegardées dans la bibliothèque du projet, les présentations que vous créez et sauvegardez, et les paramètres du projet et résultats des modules sont partagés avec l'équipe. Tout le monde peut voir le contenu sauvegardé.

## Principes clés

L'IA est un accélérateur, pas un décideur. Vous gardez le contrôle du jugement (décider ce qui compte), de l'interprétation (comprendre le contexte), et de l'action (prendre des décisions). Tous les calculs — détection des valeurs aberrantes, estimations de couverture, scores de qualité des données — utilisent des formules statistiques éprouvées, pas l'IA. L'IA interprète et explique. Vous décidez et agissez.

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

<!-- SLIDE:mai_1 -->
## L'assistant IA

La plateforme FASTR inclut un assistant IA qui fournit un support à la demande pour l'interprétation des données et la génération de rapports.

**Contexte :** De nombreux systèmes de santé disposent de plus de données que de capacité à les analyser

- Le personnel S&E a souvent peu de temps pour des analyses approfondies
- Les compétences analytiques varient selon les équipes et les régions
- Transformer les données en insights narratifs nécessite des connaissances techniques et contextuelles

**Ce qu'il fait :** L'assistant IA aide à combler cet écart en :

- Expliquant les tendances et les patterns en langage clair
- Générant des ébauches de rapports et des messages clés
- Répondant aux questions sur les données ou la méthodologie
<!-- /SLIDE -->

<!-- SLIDE:mai_2 -->
## Ce que l'assistant IA peut faire

**Répondre aux questions sur vos données**

- « Quelles régions ont le plus de valeurs aberrantes ? »
- « Comment la complétude des rapports a-t-elle évolué ? »
- Crée des graphiques et explications à la volée

**Expliquer la méthodologie**

- « Comment les valeurs aberrantes sont-elles détectées ? »
- « Que signifie ce score de qualité des données ? »
- S'appuie sur la documentation de la plateforme

**Aider à construire des rapports**

- Générer des présentations à partir de vos données
- Combiner graphiques sauvegardés et texte narratif
- Créer des présentations pour différents publics
<!-- /SLIDE -->

<!-- SLIDE:mai_3 -->
## Posez des questions, obtenez des réponses

Tapez vos questions en langage naturel. L'IA analyse vos données et vous montre les résultats.

| Sujet | Exemples de questions |
|-------|----------------------|
| **Qualité des données** | « Quelles régions ont le plus de valeurs aberrantes ? » / « Où sont les lacunes de complétude ? » |
| **Tendances** | « Comment CPN1 a-t-il évolué au fil du temps ? » / « Montrez-moi les volumes de services pour 2024 » |
| **Perturbations** | « Y a-t-il eu des baisses de services récemment ? » / « Quelque chose a-t-il changé ce trimestre ? » |
| **Régional** | « Quelles zones ont de faibles taux de rapportage ? » / « Où devons-nous concentrer notre soutien ? » |

Pas de programmation requise. Pas de jargon technique. Posez simplement vos questions comme à un collègue.
<!-- /SLIDE -->

<!-- SLIDE:mai_4 -->
## Comment fonctionnent les conversations

**Exemple de conversation :**

Vous : « Quelles régions ont le plus de problèmes de qualité des données ? »
IA : *Crée un graphique montrant les scores de qualité par région*

Vous : « Qu'est-ce qui cause le faible score dans la région Nord ? »
IA : *Détaille les problèmes : valeurs aberrantes, lacunes de complétude, problèmes de cohérence*

Vous : « Créez un résumé pour mon directeur »
IA : *Construit une diapositive mettant en évidence les domaines prioritaires pour l'amélioration de la qualité des données*

**Pensez à l'IA comme un analyste de données dans votre équipe** — quelqu'un qui peut instantanément extraire des rapports, créer des graphiques et répondre à vos questions sur vos données de santé.
<!-- /SLIDE -->

<!-- SLIDE:mai_5 -->
## Conseils pour de meilleures réponses

**Soyez précis sur :**

- Quel service — « CPN1 » au lieu de « services de soins prénataux »
- Quelle période — « 12 derniers mois » ou « 2024 »
- Quel lieu — « Banadir » ou « toutes les régions »

**Vous pouvez demander :** Graphiques, explications, comparaisons, rapports, tableaux de données

**Les questions de suivi fonctionnent très bien :**

1. Commencez large : « Montrez-moi les scores de qualité par région »
2. Affinez : « Et pour les indicateurs CPN seulement ? »
3. Approfondissez : « Pourquoi la région Nord est-elle si basse ? »
4. Passez à l'action : « Créez une diapositive à ce sujet pour ma présentation »
<!-- /SLIDE -->

<!-- SLIDE:mai_6 -->
## Capacités de l'assistant IA

| Domaine | Ce qu'il permet |
|---------|-----------------|
| **Exploration des données** | Interroger les métriques des modules d'analyse ; filtrer par géographie, temps, démographie ; voir les données CSV brutes ; explorer différentes périodes et localisations |
| **Visualisation** | Afficher les visualisations du projet ; créer des graphiques à barres, courbes, tableaux ; combiner graphiques, tableaux et texte narratif |
| **Connaissances** | Accéder à la documentation FASTR ; expliquer les indicateurs et calculs ; interpréter les résultats avec contexte sur la qualité des données et les limites |
| **Communication** | Construire des récits combinant visuels et texte ; mettre en évidence les résultats clés ; créer des vues ciblées ; fournir des analyses basées sur les données |
<!-- /SLIDE -->

<!-- SLIDE:mai_7 -->
## Que se passe-t-il quand vous vous déconnectez

| Contenu | Sauvegardé ? | Notes |
|---------|--------------|-------|
| Votre conversation IA | Temporaire | Peut être disponible à votre retour (selon la configuration) |
| Contenu du tableau blanc | Temporaire* | Disparaît quand vous naviguez ailleurs |
| Présentations que vous créez | Permanent | Sauvegardées dans le projet, visibles par l'équipe |
| Visualisations sauvegardées | Permanent | Restent dans la bibliothèque du projet |
| Exports téléchargés | Permanent | Sauvegardés sur votre ordinateur |

*Vous pouvez sauvegarder du texte ou des visuels du tableau blanc vers une présentation avant de partir.
<!-- /SLIDE -->

<!-- SLIDE:mai_8 -->
## Privé vs partagé sur les projets d'équipe

<div class="columns">
<div>

**Privé pour vous :**

- Votre conversation avec l'IA
- Vos explorations sur le tableau blanc
- Les questions que vous posez et les réponses reçues

Les autres membres de l'équipe ne peuvent pas voir ce que vous explorez.

</div>
<div>

**Partagé avec l'équipe :**

- Les données sous-jacentes (mêmes données SNIS)
- Visualisations sauvegardées dans la bibliothèque
- Présentations que vous créez et sauvegardez
- Paramètres du projet et résultats des modules

Tout le monde peut voir le contenu sauvegardé.

</div>
</div>
<!-- /SLIDE -->

<!-- SLIDE:mai_9 -->
## Comment les équipes collaborent

| Qui | Action | Résultat |
|-----|--------|----------|
| **Dr. Amina** (Directrice) | Demande la qualité des données, explore en privé, crée une présentation | Présentation visible par tous |
| **Mohamed** (Gestionnaire données) | Demande les lacunes de rapportage, sauvegarde un graphique | Graphique dans la bibliothèque |
| **Fatima** (Chargée de programme) | Ouvre les diapos d'Amina, utilise le graphique de Mohamed | Reçoit une explication privée |

**Ce que chacun voit :**

- Ses propres conversations IA — Oui
- Diapositives et graphiques sauvegardés des autres — Oui
- Questions privées des autres — Non
<!-- /SLIDE -->

<!-- SLIDE:mai_10 -->
## Comment fonctionne l'assistant IA

<div class="columns">
<div>

L'IA suit un principe de « lire avant de répondre » — elle ne devine jamais.

**Pour les questions sur les données :**

1. Trouve la métrique pertinente
2. Lit les valeurs réelles
3. Répond avec une visualisation

**Pour les questions méthodologiques :**

1. Consulte la documentation
2. Lit les détails
3. Explique en langage clair

</div>
<div>

![Diagramme des outils IA](../resources/diagrams_fr/ai_on_rails.svg)

</div>
</div>
<!-- /SLIDE -->

<!-- SLIDE:mai_11 -->
## L'IA est un accélérateur, pas un décideur

<div class="columns">
<div>

![Diagramme accélérateur IA](../resources/diagrams_fr/ai_accelerator.svg)

</div>
<div>

**Vous gardez le contrôle de :**

- Jugement — décider ce qui compte
- Interprétation — comprendre le contexte
- Action — prendre des décisions

**Les chiffres proviennent de méthodes validées**

Tous les calculs (détection des valeurs aberrantes, estimations de couverture, scores de qualité) utilisent des formules statistiques éprouvées — pas l'IA.

L'IA interprète et explique. Vous décidez et agissez.

</div>
</div>
<!-- /SLIDE -->

<!-- SLIDE:mai_13 -->
## Pratique : Utilisation de l'assistant IA

![pratique h:40](../resources/icons/hands_on.svg)

*Contenu à rédiger*

*Travaillez en binômes. Comparez ce que l'IA produit avec votre propre interprétation.*
<!-- /SLIDE -->

---

**Dernière mise à jour** : 06-05-2026
**Contact** : <fastr@worldbank.org>
