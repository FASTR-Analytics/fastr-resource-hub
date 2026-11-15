---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Visualisations & Interprétation"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Lire une viz</span> <span class="arrow">→</span> <span class="step done">Construire à la main</span> <span class="arrow">→</span> <span class="step done">Construire avec l'IA</span> <span class="arrow">→</span> <span class="step done">Rédiger l'interprétation</span> <span class="arrow">→</span> <span class="step done">Interprétation IA</span> <span class="arrow">→</span> <span class="step current">Repérer une perturbation</span></div>

# Application — repérer une perturbation

<p class="meta-line"><strong>Activité</strong> · <strong>Visualisations & Interprétation</strong> · <strong>~25 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Avant de commencer</p>

- ☐ Vous avez terminé les 5 documents précédents
- ☐ Vous êtes connecté·e et sur la page **Produits**
- ☐ Vous avez un dossier à vous

<p class="sb-label">Pourquoi c'est important</p>

Les cinq premiers documents enseignaient la technique. C'est ici que vous l'utilisez : ouvrir un vrai graphique de perturbations pour votre pays, appliquer le cadre en six étapes, et produire un constat qu'un décideur pourrait réellement utiliser.

</aside>
<div class="p1-main">

## Ce que vous allez faire

Créer le graphique national des perturbations à partir du module Disruption detection, le réduire à un indicateur et à une période d'intérêt, parcourir le cadre en six étapes, puis rédiger un constat en trois parties à partager avec la salle.

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">1</span><span>Créer le graphique de perturbation</span></h2>

Sur la page **Produits**, cliquez sur **Nouveau → Nouvelle visualisation**, gardez le paquet épinglé et **Toutes les données**, puis cliquez sur **Suivant**. À l'étape Métrique, cliquez sur le module **Disruption detection** (détection des perturbations), puis sur la carte **Bayesian disruption detection — observed vs expected with 95% CI**, choisissez le niveau **National**, et cliquez sur **Suivant**. Choisissez le préréglage **Graphique des perturbations avec bande de crédibilité à 95%** et cliquez sur **Insérer**.

![Étape Métrique avec Disruption detection sélectionné h:230](../../../resources/screenshots/platform_v2_fr/08_new_viz_module_metrics.png)

> Déjà construit par un collègue ? La page Produits en contient peut-être un. Ouvrez-le, puis **⋮ → Dupliquer** pour que vos filtres ne changent pas les siens : les modifications s'enregistrent en direct.

<h2 class="step-h"><span class="step-n">2</span><span>Lire la vue par défaut</span></h2>

Le graphique s'ouvre avec chaque indicateur principal sous forme de petit graphique dans une grille. Deux courbes noires traversent chacun d'eux : une courbe **pleine** pour le volume mensuel **observé**, et une courbe **pointillée** pour le volume **attendu**, modélisé à partir des formations sanitaires qui ont déclaré ce mois-là. Une **bande grise** autour de la courbe attendue est l'intervalle de crédibilité à 95%. Là où la courbe observée descend **sous la bande**, l'écart est rempli en **rouge** (un déficit) ; là où elle monte **au-dessus**, il est rempli en **vert** (un surplus). À l'intérieur de la bande, c'est de la variation normale.

![Graphique des perturbations, tous les indicateurs en grille h:230](../../../resources/screenshots/platform_v2_fr/11_visualization_editor.png)

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">3</span><span>Filtrer à un indicateur</span></h2>

Dans l'onglet **Données** à gauche, sous **Filtre (sous-ensemble)**, cochez **Indicateur**. Une liste de pastilles d'indicateurs apparaît (ANC1, ANC4, BCG, delivery, Penta1…). Cliquez sur une pastille pour ne garder que cet indicateur ; cliquez sur d'autres pour en ajouter.

Quand un seul indicateur est sélectionné, la grille se réduit à un graphique en taille réelle. Cochez **Période** pour réduire encore la fenêtre.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">4</span><span>Appliquer les six étapes</span></h2>

Sur votre graphique filtré, parcourez le cadre en six étapes du document *Lire une viz* :

| Étape | Sur ce graphique |
|-------|------------------|
| 1. Quel indicateur ? | Celui que vous avez filtré |
| 2. Quel niveau et quelle période ? | National. La période que vous avez choisie. |
| 3. Que compare-t-on ? | Volume mensuel observé (courbe pleine) vs **attendu** (courbe pointillée, modélisé à partir des mêmes formations sanitaires qui ont déclaré), avec la bande grise à 95% |
| 4. Lire les valeurs | Où l'écart se remplit-il en rouge (observé sous la bande) ? De combien ? |
| 5. Qu'est-ce qui ressort ? | Une baisse soutenue, trois mois ou plus ? Un pic unique ? Un motif ? |
| 6. Et alors ? | Quelle action cela appelle-t-il ? |

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">5</span><span>Ajouter le contexte que le graphique ne montre pas</span></h2>

Le graphique montre le *quoi*. Votre équipe pays apporte le *pourquoi*. Une fois un motif identifié, ajoutez ce que vous savez :

- Y a-t-il eu un **changement de financement ou de personnel** sur cette période ?
- Y a-t-il des **manques connus en intrants ou en ressources humaines** (médicaments, équipements, personnel) ?
- Même si les **chiffres semblent bons**, la qualité des soins a-t-elle baissé ?

<h2 class="step-h"><span class="step-n">6</span><span>Rédiger votre constat</span></h2>

Utilisez la structure en trois parties du document *Rédiger une interprétation* :

1. **Titre** — le message en une phrase
2. **Ce que vous voyez** — les faits visibles sur le graphique
3. **Ce que cela signifie** — le « et alors », rattaché à une prochaine étape concrète

<h2 class="step-h"><span class="step-n">7</span><span>Partager avec la salle</span></h2>

Quand chaque équipe pays a terminé, une personne partage le constat. Écoutez :

- Le constat est-il **précis** ? Un indicateur, une période, une action.
- Le « et alors » est-il **rattaché à un vrai décideur** ?
- L'équipe a-t-elle **apporté le contexte local** que le graphique seul ne pouvait pas donner ?

## À surveiller

- **Une baisse d'un seul mois est en général du bruit.** Cherchez une baisse soutenue, trois mois ou plus.
- **Un remplissage vert n'est pas « bon », un remplissage rouge n'est pas « mauvais ».** Ils indiquent le sens : vert = observé au-dessus de la bande, rouge = observé en dessous. À l'intérieur de la bande, rien n'est coloré, et c'est le cas normal. C'est un rouge soutenu sur plusieurs mois qu'il faut creuser.
- **Les lacunes de déclaration sont déjà prises en compte.** La courbe attendue est construite à partir des formations sanitaires qui ont déclaré ce mois-là, donc une formation qui cesse de déclarer n'apparaît pas comme une perturbation. Une plage rouge est un vrai changement parmi les formations qui déclarent.

## Et ensuite

Ceci clôt la série *Visualisations & Interprétation*. Le module suivant traite de la construction de rapports : assembler vos graphiques, interprétations et constats dans un document partageable.
