---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Visualisations et interprétation"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Lire une viz</span> <span class="arrow">→</span> <span class="step current">Construire manuellement</span> <span class="arrow">→</span> <span class="step">Construire avec l'IA</span> <span class="arrow">→</span> <span class="step">Écrire l'interprétation</span> <span class="arrow">→</span> <span class="step">Interprétation IA</span> <span class="arrow">→</span> <span class="step">Repérer une perturbation</span></div>

# Créez votre première visualisation

<p class="meta-line"><strong>Activité</strong> · <strong>Visualisations et interprétation</strong> · <strong>~15 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Avant de commencer</p>

- ☐ Vous êtes connecté·e et sur le projet de votre pays
- ☐ Vous êtes dans l'onglet **Visualisations**
- ☐ Vous avez votre propre dossier (ou vous pouvez utiliser le dossier partagé)

</aside>
<div class="p1-main">

## Ce que vous allez faire

Construire trois graphiques temporels : d'abord **CPN1**, puis **BCG**, puis **un indicateur de votre choix**. Chaque graphique est enregistré dans votre dossier dans la liste Visualisations du projet. L'activité suivante fait la même chose avec l'Assistant IA.

<h2 class="step-h"><span class="step-n">1</span><span>Ouvrez la boîte de dialogue Créer une visualisation</span></h2>

Dans l'onglet **Visualisations**, cliquez sur le bouton vert **+ Créer une visualisation** en haut à droite.

Une boîte de dialogue en trois étapes s'ouvre : **Métrique → Préréglages → Configurer**.

![La boîte de dialogue « Créer une visualisation » à l'étape 1 — modules à gauche, tuiles de métriques dans la grille, Annuler/Suivant en bas à droite h:340](../../../resources/screenshots/m9c/create_viz_dialog_fr.png)

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">2</span><span>Choisissez une métrique</span></h2>

Dans le panneau de gauche de la boîte de dialogue, cliquez sur **M3. Utilisation des services**. La grille de droite ne liste plus que les métriques de M3.

Cliquez sur la tuile **Nombre de services déclarés, par type d'ajustement**.

Cliquez sur **Suivant** en bas à droite.

> Les métriques sont groupées par module : **M1** (Évaluation de la qualité des données), **M2** (Ajustements de la qualité des données), **M3** (Utilisation des services), **M4–M6** (Estimations de couverture). Une métrique, c'est *ce qui est mesuré*. Un préréglage, c'est *une façon prête à l'emploi de la dessiner*.

<h2 class="step-h"><span class="step-n">3</span><span>Choisissez un préréglage</span></h2>

Vous êtes maintenant à l'étape **Préréglages**. Choisissez le préréglage qui trace le volume des services dans le temps (graphique en ligne mensuel).

Le graphique s'ouvre dans l'éditeur.

<h2 class="step-h"><span class="step-n">4</span><span>Filtrez sur CPN1, 12 derniers mois</span></h2>

Le graphique s'ouvre avec tous les indicateurs sur toute la période disponible. Vous allez le réduire à **CPN1, 12 derniers mois**.

Dans le **panneau de gauche** de l'éditeur, faites défiler jusqu'à **Filtre (sous-ensemble)** :

- Sous **Indicateur**, cochez **CPN1** uniquement (décochez les autres, ou utilisez la barre de recherche). Dans certains jeux de données il s'appelle **ANC1**.
- Sous **Période**, réglez la plage sur les **12 derniers mois**.

Le graphique se met à jour à chaque clic.

<h2 class="step-h"><span class="step-n">5</span><span>Enregistrez-le dans votre dossier</span></h2>

Cliquez sur **Sauver comme nouvelle viz.** en haut de l'éditeur. Donnez-lui un nom clair (p. ex. *CPN1 — mensuel, 12 derniers mois*) et enregistrez-le dans **votre dossier**.

Il apparaît maintenant dans la liste Visualisations sous votre dossier.

## Refaites-le deux fois de plus

Refaites les cinq mêmes étapes pour **BCG** (cochez BCG à l'étape 4 au lieu de CPN1) puis pour **un indicateur de votre choix** (Penta1, CPN4, admissions hospitalières…). Vous devriez avoir trois graphiques dans votre dossier.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Filtrer vs désagréger — quelle différence ?

Ces deux mots reviennent souvent. Ils ne veulent pas dire la même chose :

- **Filtrer = choisir ce qu'on affiche.** Cochez les indicateurs, les lieux ou les mois que vous voulez — seuls ceux-là apparaissent. p. ex. *afficher seulement CPN1*, ou *seulement la région Nord*. Comme un projecteur : vous le pointez sur ce que vous voulez voir.
- **Désagréger = décomposer.** Diviser un total en ses parties pour les comparer — p. ex. *une ligne par indicateur*, ou *une barre par district*. Rien n'est caché ; le total est montré en morceaux.

![Filtrer = choisir ce qu'on affiche : cocher CPN1, et seul CPN1 apparaît h:140](../../../resources/diagrams_fr/m9c_filter.svg)

![Désagréger « CPN1 par district » affiché de quatre façons — Lines, Grid, Rows, Columns h:195](../../../resources/diagrams_fr/m9c_disaggregate.svg)

> **Exemple.** Partez du *total des visites CPN1, au niveau national*. **Filtrez** sur « région Nord » → vous ne voyez plus que la CPN1 du Nord. **Désagrégez** « par district » → le même total divisé en une barre (ou ligne) par district.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Où le faire quand vous éditez une viz

Ouvrez une visualisation enregistrée — les contrôles sont dans le **panneau de gauche**, et il faut souvent **faire défiler** pour les trouver (c'est là que les gens se perdent). Deux sections font le travail :

- **Filtre (sous-ensemble)** — **choisir ce que vous voulez voir** : régler la période, et cocher le(s) indicateur(s) voulu(s). Seul ce que vous cochez apparaît.
- **Affichage (désagréger)** — choisir **comment les parties s'affichent**. Le menu déroulant offre quatre options :
  - **Lignes** — une courbe par partie, toutes sur le même graphique
  - **Grille** — un petit graphique séparé pour chaque partie, côte à côte
  - **Rangées** — une rangée de tableau par partie
  - **Colonnes** — une colonne de tableau par partie

![Le panneau de gauche de l'éditeur de viz — faites défiler jusqu'à « Filtre (sous-ensemble) » et « Affichage (désagréger) » h:400](../../../resources/screenshots/m9c/edit_viz_panel_fr.png)

> **Attention quand vous utilisez les deux ensemble.** Voici le piège, avec un exemple. Vous décomposez un graphique **par district** parce que vous voulez comparer les districts. Puis vous le **filtrez** sur un seul district — les autres disparaissent. Il ne reste qu'un seul district, tout seul, et plus rien à comparer.
>
> **La règle simple :** utilisez **filtrer** pour choisir les données que vous voulez regarder, et **désagréger** pour les diviser en parties à comparer. Ne filtrez simplement pas jusqu'à une seule des choses que vous vouliez comparer.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Exercice : décomposez votre graphique CPN1 par région

En ce moment, votre graphique CPN1 montre une seule ligne : le total national sur les 12 derniers mois. Vous allez le transformer en une ligne par **région** pour comparer les régions côte à côte.

<h2 class="step-h"><span class="step-n">1</span><span>Ouvrez le graphique</span></h2>

Dans la liste **Visualisations**, ouvrez votre graphique CPN1 enregistré (celui que vous avez nommé *CPN1 — mensuel, 12 derniers mois*).

<h2 class="step-h"><span class="step-n">2</span><span>Désagrégez par région</span></h2>

Dans le **panneau de gauche** de l'éditeur, faites défiler jusqu'à **Affichage (désagréger)**.

- Réglez la dimension sur **Région** (le menu déroulant qui demande *par quoi décomposer le graphique*).
- Laissez le style d'affichage sur **Lignes** pour l'instant — une ligne par région, toutes sur le même graphique.

Le graphique se redessine. Au lieu d'une seule ligne nationale, vous devriez voir **une ligne par région**.

<h2 class="step-h"><span class="step-n">3</span><span>Essayez les autres styles d'affichage</span></h2>

Mêmes données, formes différentes :

- **Grille** — un petit graphique séparé par région, côte à côte. Utile quand il y a beaucoup de régions et que les lignes se chevauchent.
- **Rangées** — un tableau avec une rangée par région. Utile quand vous voulez les valeurs exactes plutôt que la forme.
- **Colonnes** — un tableau avec une colonne par région.

Choisissez celui qui se lit le mieux pour vos données.

<h2 class="step-h"><span class="step-n">4</span><span>Enregistrez-le comme nouveau graphique</span></h2>

Cliquez sur **Sauver comme nouvelle viz.** — nommez-le p. ex. *CPN1 — mensuel, par région* et enregistrez-le dans **votre dossier**.

> **N'écrasez pas le graphique national.** Enregistrez *comme nouveau graphique*, pas seulement *sauvegarder*, pour garder les deux : la tendance nationale et la décomposition régionale.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### Attention

Vous réglez à la fois **Filtre** et **Affichage** à l'étape 4 du parcours original (filtrer sur CPN1, 12 derniers mois) et à l'étape 2 de cet exercice (désagréger par région). C'est correct. Le piège, c'est de **filtrer jusqu'à l'une des choses que vous disiez vouloir comparer** — p. ex. désagréger par région *puis* filtrer sur une seule région. Il ne resterait qu'une seule ligne, plus rien à comparer.

### Refaites-le pour BCG

Refaites les mêmes trois étapes sur votre graphique BCG enregistré. Vous devriez avoir au final **deux graphiques régionaux** dans votre dossier : un pour CPN1, un pour BCG.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Essayez quelques options de plus

Une fois vos trois graphiques enregistrés, essayez une autre métrique ou un autre préréglage :

- Une métrique de couverture sous **M6** (une courbe de couverture, pas une tendance de volume).
- Le préréglage de variation trimestrielle (compare des périodes au lieu de tracer une tendance continue).

> **Astuce :** Les graphiques en ligne (volume des services dans le temps) sont les meilleurs pour les tendances dans le temps. Les graphiques à barres (variation trimestrielle / annuelle) sont meilleurs pour comparer des périodes ou des lieux. Le document de référence *Comment lire une visualisation FASTR* approfondit.

## Vérification

Vous devriez maintenant avoir :

- **Trois graphiques enregistrés** dans votre dossier : CPN1, BCG, et un de votre choix.
- Le chemin mémorisé : **+ Créer une visualisation → M3 → métrique → préréglage → filtre → Sauver comme nouvelle viz.**
- Une idée de quels préréglages conviennent aux tendances vs aux comparaisons.

## Étape suivante

L'activité suivante fait la même chose avec l'Assistant IA — en tapant la demande en langage naturel au lieu de cliquer dans la boîte de dialogue. Même résultat, autre chemin.

