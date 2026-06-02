---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Rapport de perturbations"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Créer avec l'IA</span> <span class="arrow">→</span> <span class="step current">Vérifier le résultat</span> <span class="arrow">→</span> <span class="step">Affiner</span> <span class="arrow">→</span> <span class="step">Revue par les pairs</span></div>

# Vérifier le résultat de l'IA

<p class="meta-line"><strong>Activité</strong> · <strong>Rapport de perturbations</strong> · <strong>~20 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Pourquoi c'est important</p>

L'Assistant IA peut générer un rapport de perturbations complet en 5 à 10 minutes. **C'est vous** qui le validez. L'IA peut sembler sûre d'elle et se tromper — sur un chiffre, un nom de région, un regroupement d'indicateurs, une comparaison.

<p class="sb-label">La règle de base</p>

Chaque affirmation du rapport doit être vérifiable par rapport au graphique ou au tableau sous-jacent. Si vous ne pouvez pas relier une phrase à une donnée, signalez-la.

</aside>
<div class="p1-main">

## Deux passes de vérification

La vérification se fait en deux passes, et il vous faut **les deux** :

1. **Passe 1 — Auto-révision par l'IA.** Lancez le **Prompt 5 : Réviser le jeu de diapositives** pour que l'IA vérifie sa propre sortie par rapport aux données.
2. **Passe 2 — Révision par l'équipe.** L'IA ne peut pas tout détecter. L'équipe parcourt la liste de vérification manuelle ci-dessous.

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Passe 1 — Lancer la révision par l'IA (Prompt 5)

Une fois le rapport généré, ouvrez la bibliothèque de prompts et lancez le **Prompt 5 : Réviser le jeu de diapositives**. L'IA parcourt toutes les diapositives en une seule passe et vérifie six points :

| # | Ce que le Prompt 5 vérifie |
|---|----------------------------|
| 1 | **Exactitude des données** — chaque chiffre du texte correspond aux données ; les statistiques non vérifiables sont signalées `[UNVERIFIED]` |
| 2 | **Noms et sens des indicateurs** — les noms correspondent aux libellés de la plateforme ; service en hausse = bon, mortalité en hausse = mauvais, sans confusion |
| 3 | **Acronymes et méthodologie** — toute expansion d'acronyme ou description méthodologique est vérifiée par rapport à la documentation officielle |
| 4 | **Langage et formulation** — pas d'affirmations causales, nuance appropriée, pas de surgénéralisation |
| 5 | **Cohérence entre diapositives** — un même indicateur affiche la même valeur partout ; noms et périodes cohérents |
| 6 | **Nombre de mots** — chaque bloc de texte dans la plage cible |

**Ce que vous recevez :** une synthèse — *« [X] diapositives révisées, [Y] problèmes trouvés sur [Z] diapositives »* — avec une correction suggérée par problème. Vous choisissez : tout corriger automatiquement, réviser un par un, ou terminé.

> La Passe 1 attrape les erreurs mécaniques. Mais elle ne vérifie le jeu de diapositives que par rapport à lui-même et aux données. C'est le début de la vérification, pas la fin.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Passe 2 — Révision par l'équipe

Le Prompt 5 ne peut pas connaître ce que seule votre équipe pays sait. **Il ne peut pas dire :**

- si les **regroupements d'indicateurs ont du sens** pour votre pays
- si une « perturbation » est **réelle ou expliquée** par un événement local connu (grève, campagne, rupture de stock)
- si le **« et alors » est réaliste** et exploitable dans votre contexte
- si du **contexte local** est manquant

Parcourez la liste de vérification ci-dessous **en équipe**, avec les graphiques source ouverts sur la plateforme à côté du rapport.

**Avant de commencer la révision en équipe :**

- ☐ Le Prompt 5 a été lancé et ses problèmes signalés ont été corrigés
- ☐ Votre équipe pays est ensemble — c'est une activité d'équipe, pas en solo
- ☐ Les graphiques source sont ouverts sur la plateforme, à côté du rapport

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Vérifications générales — chaque rapport

| ☐ | Vérification | Notes |
|---|--------------|-------|
| ☐ | **Toutes les diapositives générées** — aucune manquante, aucune à moitié rendue |  |
| ☐ | Le **nom du pays** est correct et cohérent sur chaque diapositive |  |
| ☐ | La **période d'analyse** est correcte sur chaque graphique |  |
| ☐ | **Aucun texte provisoire** restant — p. ex. `[PAYS]`, `[UNVERIFIED]` |  |
| ☐ | La **dernière page** (lien FASTR / diapo de clôture) est bien la toute dernière |  |

## Rapport de perturbations de base — Prompt 1

| ☐ | Vérification | Notes |
|---|--------------|-------|
| ☐ | **Page de couverture** — pays, sous-titre et date corrects |  |
| ☐ | Les **regroupements correspondent à ce que vous avez confirmé** dans le chat |  |
| ☐ | **Chaque groupe a sa propre diapositive d'analyse** — aucune fusionnée, aucune supprimée |  |
| ☐ | **Les graphiques se chargent et affichent des données** — pas de graphique vide ou cassé |  |
| ☐ | Chaque **interprétation correspond au graphique** de la diapositive |  |
| ☐ | **Les titres sont des constats, pas juste des noms d'indicateurs** — « La CPN1 a baissé de 12 % au Nord », pas « Résultats CPN1 » |  |
| ☐ | Le **« et alors » a-t-il du sens** pour votre pays ? Est-il exploitable ? |  |

> **Si une vérification échoue :** pour les textes provisoires ou la structure, demandez à l'IA de régénérer la diapositive nommée. Pour une interprétation erronée : *« La diapo 6 dit que les volumes ont augmenté — le graphique montre une baisse. Merci de revérifier. »*

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Relecture finale en équipe

Une fois chaque section validée, **passez en revue toutes les interprétations ensemble en équipe** — chaque membre prenant une section, les autres suivant. Surveillez :

- **Tout ce qui se lit mal** — un chiffre trop arrondi, une tendance absente du graphique
- **Tout ce qui sonne exagéré** — « dramatique », « alarmant », « sans précédent » sans preuve
- **Tout ce qui sonne générique** — des phrases qui s'appliqueraient à n'importe quel pays, pas au vôtre
- **Contexte local manquant** — la grève, la rupture d'approvisionnement, la nouvelle politique. Vous l'ajoutez.

Si un membre de l'équipe hésite sur une phrase, **signalez-la**. L'hésitation signale souvent un problème.

## Validation

Avant de passer à l'affinage, l'équipe doit pouvoir dire :

> *« Le Prompt 5 a été lancé et ses problèmes corrigés. Chaque chiffre est vérifiable. Chaque interprétation reflète ce que nous savons. Aucune phrase n'est générique. Aucune affirmation n'est non étayée. »*

## Étape suivante

**Affiner** — appliquez votre mise en forme et, si utile, ajoutez des sections régionales ou de qualité des données avec les Prompts 2 et 3.
