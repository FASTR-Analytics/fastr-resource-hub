---
marp: true
theme: fastr-handout
paginate: true
footer: "FASTR · Constructeur de rapports"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

# Vérifier un rapport généré par l'IA

<p class="meta-line"><strong>Référence</strong> · <strong>Constructeur de rapports</strong> · <strong>~20 min</strong></p>

## Pourquoi c'est important

L'Assistant IA peut générer un rapport de perturbation complet en 5 à 10 minutes. **C'est vous** qui le validez. L'IA peut sembler sûre d'elle et se tromper — sur un chiffre, un nom de région, un regroupement d'indicateurs, une comparaison. La vérification est ce que vous faites **avant** que le rapport ne quitte l'équipe.

La règle : chaque affirmation du rapport doit être vérifiable par rapport au graphique ou au tableau sous-jacent. Si vous ne pouvez pas relier une phrase à une donnée, signalez-la.

## Comment un rapport FASTR est construit — les prompts

Le constructeur de rapports utilise un ensemble de prompts de la bibliothèque :

- **Prompt 1 — Rapport FASTR sur les perturbations.** Le rapport de base. L'IA demande pays / période / sous-titre, identifie les indicateurs disponibles, propose des regroupements, vous confirmez, et elle construit le rapport diapositive par diapositive.
- **Prompt 2 — Analyse régionale des perturbations.** *Optionnel.* Ajoute une diapositive par zone infranationale.
- **Prompt 3 — Évaluation de la qualité des données.** *Optionnel.* Ajoute une annexe sur la complétude, les valeurs aberrantes, la cohérence.
- **Prompt 5 — Réviser le jeu de diapositives.** Le **prompt de vérification**. À lancer une fois le rapport généré — il vérifie tout le jeu de diapositives pour vous.

## Deux passes de vérification

La vérification se fait en deux passes, et il vous faut **les deux** :

1. **Passe 1 — Auto-révision par l'IA.** Lancez le **Prompt 5** pour que l'IA vérifie sa propre sortie par rapport aux données.
2. **Passe 2 — Révision par l'équipe.** L'IA ne peut pas tout détecter. L'équipe parcourt la liste de vérification manuelle.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Passe 1 — Lancer la révision par l'IA (Prompt 5)

Une fois le Prompt 1 (et éventuellement le Prompt 2 / 3) généré, ouvrez la bibliothèque de prompts et lancez le **Prompt 5 : Réviser le jeu de diapositives**. L'IA parcourt **toutes les diapositives en une seule passe** et vérifie six points :

| # | Ce que le Prompt 5 vérifie |
|---|----------------------------|
| 1 | **Exactitude des données** — chaque chiffre du texte correspond aux données ; les statistiques non vérifiables sont signalées `[UNVERIFIED]` ; surveille la fabrication masquée (« environ X » cachant un chiffre inventé) |
| 2 | **Noms et sens des indicateurs** — les noms correspondent aux libellés exacts de la plateforme ; indicateurs de service en hausse = bon, mortalité en hausse = mauvais, sans confusion |
| 3 | **Acronymes et méthodologie** — toute expansion d'acronyme ou description méthodologique est vérifiée par rapport à la documentation officielle |
| 4 | **Langage et formulation** — pas d'affirmations causales, nuance appropriée, pas de surgénéralisation, termes de santé corrects |
| 5 | **Cohérence entre diapositives** — un même indicateur affiche la même valeur partout ; noms et périodes cohérents |
| 6 | **Nombre de mots** — chaque bloc de texte dans la plage cible |

**Ce que vous recevez :** une synthèse — *« [X] diapositives révisées, [Y] problèmes trouvés sur [Z] diapositives »* — avec une correction suggérée par problème. Vous choisissez : tout corriger automatiquement, réviser un par un, ou terminé.

> **La Passe 1 est rapide et attrape les erreurs mécaniques.** Mais elle ne vérifie le jeu de diapositives que par rapport à lui-même et aux données. Ce n'est pas la fin de la vérification — c'est le début.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Passe 2 — Révision par l'équipe

Le Prompt 5 ne peut pas connaître ce que seule votre équipe pays sait. **Il ne peut pas dire :**

- si les **regroupements d'indicateurs ont du sens** pour votre pays
- si une « perturbation » est **réelle ou expliquée** par un événement local connu (grève, campagne, rupture de stock)
- si le **« et alors » est réaliste** et exploitable dans votre contexte
- si du **contexte local** est manquant

C'est à cela que sert la liste de vérification manuelle ci-dessous. Parcourez-la **en équipe**, avec les graphiques source ouverts sur la plateforme à côté du rapport.

**Avant de commencer la révision en équipe :**

- ☐ Le Prompt 5 a été lancé et ses problèmes signalés ont été corrigés
- ☐ Votre équipe pays est ensemble — c'est une activité d'équipe, pas en solo
- ☐ Les graphiques source sont ouverts sur la plateforme, à côté du rapport

> Vérifiez la **Section A + Section B** pour chaque rapport. Ajoutez la **Section C / D** seulement si vous avez lancé le Prompt 2 / Prompt 3.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Section A — Vérifications générales (chaque rapport)

| ☐ | Vérification | Notes |
|---|--------------|-------|
| ☐ | **Toutes les diapositives générées** — aucune manquante, aucune à moitié rendue |  |
| ☐ | Le **nom du pays** est correct et cohérent sur chaque diapositive |  |
| ☐ | La **période d'analyse** est correcte sur chaque graphique |  |
| ☐ | **Aucun texte provisoire** restant — p. ex. `[PAYS]`, `[VÉRIFIER]`, `[UNVERIFIED]` |  |
| ☐ | La **dernière page** (lien FASTR / diapo de clôture) est bien la toute dernière |  |

## Section B — Prompt 1 : rapport de perturbation de base

| ☐ | Vérification | Notes |
|---|--------------|-------|
| ☐ | **Page de couverture** — pays, sous-titre et date corrects |  |
| ☐ | Les **regroupements correspondent à ce que vous avez confirmé** dans le chat |  |
| ☐ | **Chaque groupe a sa propre diapositive d'analyse** — aucune fusionnée, aucune supprimée |  |
| ☐ | **Les graphiques se chargent et affichent des données** — pas de graphique vide ou cassé |  |
| ☐ | Chaque **interprétation correspond au graphique** de la diapositive |  |
| ☐ | **Les titres sont analytiques, pas juste des noms d'indicateurs** — « La CPN1 a baissé de 12 % au Nord », pas « Résultats CPN1 » |  |
| ☐ | Le **« et alors » a-t-il du sens** pour votre pays ? Est-il exploitable ? |  |

> **Si une vérification échoue :** pour les textes provisoires ou la structure, demandez à l'IA de régénérer la diapositive nommée. Pour une interprétation erronée : *« La diapo 6 dit que les volumes ont augmenté — le graphique montre une baisse. Merci de revérifier. »*

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Section C — Prompt 2 : analyse régionale des perturbations

*Seulement si vous avez lancé le Prompt 2.*

| ☐ | Vérification | Notes |
|---|--------------|-------|
| ☐ | La synthèse inclut **toutes** les zones infranationales (comptez-les) |  |
| ☐ | **Une diapositive par zone** — aucune oubliée, aucune en double |  |
| ☐ | Noms des zones **correctement orthographiés** (conformes au nommage officiel) |  |
| ☐ | Chaque interprétation référence la **bonne zone** |  |
| ☐ | Les graphiques observé-vs-attendu utilisent la **même échelle** d'une diapo à l'autre |  |
| ☐ | Les magnitudes correspondent au graphique source (pas de baisses gonflées, pas de pics manqués) |  |

## Section D — Prompt 3 : annexe qualité des données

*Seulement si vous avez lancé le Prompt 3.*

| ☐ | Vérification | Notes |
|---|--------------|-------|
| ☐ | L'annexe est **correctement numérotée** (Annexe 1 ou 2) |  |
| ☐ | Les trois dimensions de QD présentes : **complétude, valeurs aberrantes, cohérence** |  |
| ☐ | Le **code couleur est logique** : vert = bon, rouge = alerte |  |
| ☐ | Les zones ou indicateurs à faible qualité sont **explicitement signalés** dans le texte |  |
| ☐ | Les scores de QD **correspondent à la plateforme** — ouvrez le module AQD côte à côte |  |

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Lecture finale à voix haute

Une fois chaque section validée, lisez **toutes les interprétations à voix haute en équipe**. Écoutez :

- **Tout ce qui sonne faux** — un chiffre trop arrondi, une tendance absente du graphique
- **Tout ce qui sonne exagéré** — « dramatique », « alarmant », « sans précédent » sans preuve
- **Tout ce qui sonne générique** — des phrases qui s'appliqueraient à n'importe quel pays, pas au vôtre
- **Contexte local manquant** — la grève, la rupture d'approvisionnement, la nouvelle politique. Vous l'ajoutez.

Si quelqu'un dans la salle hésite sur une phrase, **signalez-la**. L'hésitation signale souvent un problème.

## Validation finale

Avant que le rapport ne quitte l'équipe, l'équipe doit pouvoir dire :

> *« Le Prompt 5 a été lancé et ses problèmes corrigés. Chaque chiffre est vérifiable. Chaque interprétation reflète ce que nous savons. Aucune phrase n'est générique. Aucune affirmation n'est non étayée. »*

Si vous ne pouvez pas encore le dire, continuez à itérer.

## Étape suivante

Une fois le rapport validé par les deux passes, finalisez la mise en forme (titres, numéros de page, logos), exportez, et diffusez en utilisant votre plan d'action pays.
