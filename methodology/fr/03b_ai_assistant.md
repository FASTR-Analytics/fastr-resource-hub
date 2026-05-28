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

Votre conversation avec l'IA, et les questions que vous posez et les réponses que vous recevez sont privées pour vous. Les autres membres de l'équipe ne peuvent pas voir ce que vous explorez.

### Ce qui est partagé

Les données sous-jacentes (mêmes données SNIS), les visualisations sauvegardées dans la bibliothèque du projet, les présentations et rapports que vous créez et sauvegardez, et les paramètres du projet et résultats des modules sont partagés avec l'équipe. Tout le monde peut voir le contenu sauvegardé.

## Là où l'IA apporte le plus de valeur

L'assistant IA apporte le plus de valeur dans deux domaines : les **visualisations** (explorer, modifier, et comprendre des graphiques) et les **présentations** (assembler des diapos à partir de données et de graphiques sauvegardés). Elle peut aussi interroger les métriques, voir l'état des modules, et aider à comprendre la couverture des données, même si les modules et les paramètres restent gérés directement par les utilisateurs.

## Bien formuler ses prompts

Un bon prompt comprend six éléments : (1) un objectif clair, (2) un public défini, (3) une géographie, une période et un périmètre spécifiques, (4) des consignes d'interprétation, (5) un format de sortie, et (6) des garde-fous pour garder l'IA ancrée dans les données. La règle simple : avant d'envoyer un prompt, demandez-vous s'il est évident ce que vous attendez en retour — sinon, ajoutez un détail.

## Quand l'IA aide — et quand elle n'aide pas

Toutes les visualisations ne bénéficient pas autant de l'interprétation par l'IA. Quand les patterns sont évidents — par exemple, tous les indicateurs de qualité des données sous 1 % — un texte IA supplémentaire ajoute de la longueur sans ajouter de l'éclairage. Mais quand les patterns sont complexes — perturbations soutenues sur plusieurs périodes, ampleurs variables, ruptures structurelles potentielles — l'interprétation IA peut quantifier et contextualiser des phénomènes difficiles à évaluer visuellement.

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

<!-- SLIDE:mai_3 -->
## Ce que l'assistant IA peut faire

**Répondre aux questions sur vos données**

- « Quelles régions ont le plus de valeurs aberrantes ? »
- « Comment la complétude des rapports a-t-elle évolué ? »
- Crée des graphiques et des explications à la volée

**Expliquer la méthodologie**

- « Comment les valeurs aberrantes sont-elles détectées ? »
- « Que signifie ce score de qualité des données ? »
- S'appuie sur la documentation de la plateforme

**Aider à construire des rapports**

- Générer des présentations à partir de vos données
- Combiner graphiques sauvegardés et texte narratif
- Créer des présentations pour différents publics
<!-- /SLIDE -->

<!-- SLIDE:mai_3a -->
## Là où l'IA apporte le plus de valeur

<div class="columns">
<div>

**Visualisations** — explorer et comprendre vos données

- Accéder à toutes les visualisations sauvegardées du projet
- Examiner les données sous-jacentes de tout graphique
- Modifier les paramètres : type de graphique, filtres, période, niveau de désagrégation
- Recevoir une explication de ce que la visualisation représente

</div>
<div>

**Présentations** — construire des diapos à partir de vos résultats

- Générer des diapos de présentation : pages de garde, séparateurs, contenu
- Intégrer graphiques, tableaux et texte narratif dans les mises en page
- Transférer des visualisations directement dans les présentations
- Éditer, réordonner, dupliquer ou supprimer des diapos au besoin

</div>
</div>
<!-- /SLIDE -->

<!-- SLIDE:mai_4a -->
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

<!-- SLIDE:mai_6 -->
## Conseils pour de meilleures réponses

**Soyez précis sur :**

- Quel service — « CPN1 » au lieu de « services de soins prénataux »
- Quelle période — « 12 derniers mois » ou « 2024 »
- Quel lieu — « Banadir » ou « toutes les régions »

**Vous pouvez demander :** graphiques, explications, comparaisons, rapports, tableaux de données

**Les questions de suivi fonctionnent très bien :**

1. Commencez large : « Montrez-moi les scores de qualité par région »
2. Affinez : « Et pour les indicateurs CPN seulement ? »
3. Approfondissez : « Pourquoi la région Nord est-elle si basse ? »
4. Passez à l'action : « Créez une diapositive à ce sujet pour ma présentation »
<!-- /SLIDE -->

<!-- SLIDE:mai_6a -->
## Qu'est-ce qu'un bon prompt ?

Un bon prompt indique ce que vous voulez, pour qui, sur quelles données, et à quoi ressemble une bonne réponse. Six éléments à préciser :

| # | Élément | Ce qu'il faut préciser | Exemple |
|---|---------|------------------------|---------|
| 1 | **Objectif** | La tâche et le cas d'usage | *Interpréter pour une revue de performance trimestrielle* |
| 2 | **Public** | Qui le lit, à quel niveau technique | *Directeurs district MSP, langage simple* |
| 3 | **Géographie, période, périmètre** | Pays ou zone, période, indicateurs | *Nigeria, T1 à T4 2024, CPN4 et accouchements assistés* |
| 4 | **Consignes d'interprétation** | Tendances, comparaisons, perturbations ; description ou implications | *Identifier les perturbations soutenues ; ne pas spéculer sur les causes* |
| 5 | **Format de sortie** | Puces ou narratif ; prêt pour diapo ou prose ; longueur | *Trois puces prêtes pour diapo, moins de 15 mots chacune* |
| 6 | **Garde-fous** | Rester ancré dans les données ; signaler l'incertitude ou les problèmes de qualité | *Ne pas extrapoler au-delà du graphique* |

**Règle simple :** avant d'envoyer, relisez le prompt. S'il n'est pas évident ce qui doit revenir, ajoutez un détail de plus.

<!--
NOTES POUR LE FACILITATEUR :
- Le but n'est pas de mémoriser les six éléments. C'est l'habitude de se demander « ai-je dit à l'IA tout ce dont elle a besoin ? ».
- Faire une démo en direct : écrire un prompt qui omet la moitié de ces éléments, l'exécuter, puis ajouter les pièces manquantes et relancer. Le contraste, c'est la leçon.
- Manque le plus courant en pratique : les gens omettent le format. L'IA part par défaut sur de longs paragraphes alors qu'il fallait des puces prêtes pour diapo.
- Deuxième manque le plus courant : les gens omettent les garde-fous. Sans eux, l'IA comble le contexte manquant avec des spéculations plausibles.
- La règle simple en bas est ce que les participants doivent retenir de cette diapo.
-->
<!-- /SLIDE -->

<!-- SLIDE:mai_8 -->
## Que se passe-t-il quand vous vous déconnectez

| Contenu | Sauvegardé ? | Notes |
|---------|--------------|-------|
| Votre conversation IA | Temporaire | Les conversations IA sont sauvegardées localement dans le navigateur et visibles uniquement par la personne qui utilise ce navigateur. Rafraîchir la page ou fermer l'onglet n'efface pas la conversation. L'historique disparaît seulement si le cache du navigateur est vidé ou qu'un autre navigateur ou appareil est utilisé. |
| Présentations / rapports que vous créez | Permanent | Sauvegardés dans le projet, visibles par l'équipe |
| Visualisations sauvegardées | Permanent | Restent dans la bibliothèque du projet |
| Exports téléchargés | Permanent | Sauvegardés sur votre ordinateur |
<!-- /SLIDE -->

<!-- SLIDE:mai_8a -->
## Privé vs partagé sur les projets d'équipe

<div class="columns">
<div>

**Privé pour vous :**

- Votre conversation avec l'IA
- Les questions que vous posez et les réponses reçues

Les autres membres de l'équipe ne peuvent pas voir ce que vous explorez.

</div>
<div>

**Partagé avec l'équipe :**

- Les données sous-jacentes (mêmes données SNIS)
- Visualisations sauvegardées dans la bibliothèque
- Présentations et rapports que vous créez et sauvegardez
- Paramètres du projet et résultats des modules

Tout le monde peut voir le contenu sauvegardé.

</div>
</div>
<!-- /SLIDE -->

<!-- SLIDE:mai_8b -->
## Comment les équipes collaborent

| Qui | Action | Résultat |
|-----|--------|----------|
| **Dr Amina** (directrice) | Demande à l'IA la couverture, explore en privé, crée une présentation | Présentation visible par tous |
| **Mohamed** (gestionnaire données) | Demande les lacunes de rapportage, sauvegarde un graphique | Graphique dans la bibliothèque pour tous |
| **Fatima** (chargée de programme) | Ouvre les diapos d'Amina, utilise le graphique de Mohamed, demande à l'IA d'expliquer | Reçoit une explication privée |

**Ce que chacun voit :**

- Ses propres conversations IA — oui
- Diapositives et graphiques sauvegardés des autres — oui
- Questions privées des autres — non

**Deux personnes peuvent utiliser l'assistant IA pour ajouter à la même présentation en même temps.** Chaque chat reste privé, et chaque instance IA ne voit que les changements faits sur la présentation — pas la conversation.
<!-- /SLIDE -->

<!-- SLIDE:mai_4 -->
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

![Diagramme des outils IA h:440](../resources/diagrams_fr/ai_on_rails.svg)

</div>
</div>
<!-- /SLIDE -->

<!-- SLIDE:mai_2 -->
## L'IA est un accélérateur, pas un décideur

<div class="columns">
<div>

![Diagramme accélérateur IA h:360](../resources/diagrams_fr/ai_accelerator.svg)

</div>
<div>

**Vous gardez le contrôle de :**

- Jugement — décider ce qui compte
- Interprétation — comprendre le contexte
- Action — prendre des décisions

**Les chiffres viennent de méthodes validées**

Tous les calculs (détection des valeurs aberrantes, estimations de couverture, scores de qualité) utilisent des formules statistiques éprouvées — pas l'IA.

L'IA interprète et explique. Vous décidez et agissez.

</div>
</div>
<!-- /SLIDE -->

<!-- SLIDE:mai_5 -->
## Quand l'IA apporte peu de valeur

<div class="columns">
<div>

**Votre interprétation du graphique :**

Sur l'ensemble des districts, les valeurs aberrantes sont très faibles, tous les indicateurs en dessous de 1 % en moyenne, ce qui suggère une qualité de rapportage cohérente.

***Quand les patterns sont évidents, plus d'explication n'améliore pas la compréhension.***

</div>
<div>

![Quand l'IA apporte peu de valeur](resources/screenshots/ai_little_value_obvious.png)

</div>
</div>
<!-- /SLIDE -->

<!-- SLIDE:mai_5a -->
## Quand l'IA est utile

<div class="columns">
<div>

**Votre interprétation du graphique :**

Plusieurs perturbations soutenues entre 2023 et 2025, avec un service en dessous des niveaux attendus pendant les périodes ombrées en rouge.

**Interprétation IA du graphique :**

En août 2023, les volumes ont chuté significativement sous les niveaux attendus (12 % de déficit). La perturbation s'est intensifiée de janvier à mai 2025, février 2025 montrant l'écart le plus important à 10 100 cas (20 % sous l'attendu).

***Quand les patterns ne sont pas évidents, l'interprétation IA peut améliorer notre compréhension.***

</div>
<div>

![Quand l'IA est utile](resources/screenshots/ai_helpful_complex.png)

</div>
</div>
<!-- /SLIDE -->

---

**Contact** : <fastr@worldbank.org>
