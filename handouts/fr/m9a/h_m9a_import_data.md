---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Configuration de l'instance"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Établissements</span> <span class="arrow">→</span> <span class="step done">Indicateurs</span> <span class="arrow">→</span> <span class="step current">Données</span> <span class="arrow">→</span> <span class="step">Vérifier</span></div>

# Importer les données HMIS

<p class="meta-line"><strong>Configuration de l'instance</strong> · <strong>~15 min + le temps du serveur</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Avant de commencer</p>

- ☐ Établissements importés (la carte Établissements affiche vos effectifs)
- ☐ Indicateurs importés et mappés (chaque indicateur DHIS2 a un lien vers un indicateur commun)
- ☐ Vous avez décidé de la **plage temporelle** à importer (p. ex. 36 derniers mois — discutez avec votre équipe)

</aside>
<div class="p1-main">

## Ce que vous allez faire

Télécharger les valeurs réelles depuis DHIS2 pour vos indicateurs et votre période. C'est la plus grosse opération de données de la configuration — selon la taille du pays, comptez 5 à 30 minutes. L'importation tourne **sur le serveur** : une fois lancée, vous pouvez fermer l'onglet et revenir plus tard.

<h2 class="step-h"><span class="step-n">1</span><span>Ouvrir la page Importations</span></h2>

Cliquez sur **Données** dans la barre du haut, puis sur la carte **Données** de la section **SNIS**. Cliquez sur **Importations**.

La page compte quatre onglets — **En cours**, **À venir**, **Historique**, **Par indicateur** — et les boutons **Nouvelle importation DHIS2**, **Téléverser un fichier CSV** et **Gérer la connexion**.

</div>
</div>

![h:190](../../../resources/screenshots/m9a_setup/22_imports_page.png)

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">2</span><span>Lancer l'assistant — Identifiants</span></h2>

Cliquez sur **Nouvelle importation DHIS2**. L'assistant compte cinq étapes : **Identifiants**, **Indicateurs**, **Heure**, **Configuration**, **Vérifier et lancer**.

À l'étape **Identifiants**, la connexion DHIS2 enregistrée s'affiche. Cliquez sur **Suivant**.

![h:170](../../../resources/screenshots/m9a_setup/25_wizard_credentials.png)

> Pas encore de connexion enregistrée ? Configurez-la une fois via **Gérer la connexion** sur la page Importations — elle est sauvegardée pour toute l'instance, chiffrée, et personne ne retape les identifiants à chaque importation.

<h2 class="step-h"><span class="step-n">3</span><span>Indicateurs</span></h2>

Cochez tous les indicateurs voulus — la case tout en haut sélectionne tout. Puis **Suivant**.

![h:200](../../../resources/screenshots/m9a_setup/26_wizard_indicators.png)

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">4</span><span>Heure</span></h2>

Choisissez **Maintenant**, puis **Suivant**.

![h:140](../../../resources/screenshots/m9a_setup/27_wizard_time.png)

> **À noter pour plus tard :** l'option **Récurrente** programme cette importation pour qu'elle se répète toute seule — par exemple chaque mois. Une fois la configuration stabilisée, c'est une tâche de routine en moins.

<h2 class="step-h"><span class="step-n">5</span><span>Configuration — la plage de périodes</span></h2>

Réglez la **plage de périodes** avec les deux curseurs. Soyez délibéré : 3 ans de données mensuelles ≈ 36 périodes × N établissements, et cela grimpe vite. Puis **Suivant**.

![h:150](../../../resources/screenshots/m9a_setup/28_wizard_config.png)

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">6</span><span>Vérifier et lancer</span></h2>

Relisez le récapitulatif — connexion, nombre d'indicateurs, fenêtre, et le nombre de paires (indicateur, mois) à télécharger. Cliquez sur **Démarrer l'importation**.

![h:180](../../../resources/screenshots/m9a_setup/29_wizard_review_launch.png)

<h2 class="step-h"><span class="step-n">7</span><span>Laisser le serveur travailler</span></h2>

L'importation tourne sur le serveur. L'onglet **En cours** affiche la progression ; vous pouvez fermer l'onglet, travailler ailleurs ou vous déconnecter — l'importation continue. L'onglet **Historique** vous dit quand elle est terminée.

![h:170](../../../resources/screenshots/m9a_setup/23_imports_history.png)

## Point de contrôle

La page Données SNIS affiche maintenant vos indicateurs sous forme de graphique, avec les valeurs dans le temps. L'onglet **Par indicateur** liste chaque indicateur avec ses mois de données et sa dernière importation.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## En cas de problème

- **Des paires (indicateur, mois) ont échoué** — l'importation conserve tout ce qui a réussi ; rien n'est annulé. Ouvrez l'onglet **Par indicateur** pour voir les mois en échec par indicateur et relancer uniquement ces paires. Quelques échecs signifient généralement qu'aucune donnée n'existe dans DHIS2 pour cette combinaison ; beaucoup d'échecs pointent vers le mapping des indicateurs (voir *Importer les indicateurs*).

![h:170](../../../resources/screenshots/m9a_setup/24_imports_by_indicator.png)

- **Le réseau coupe pendant l'importation** — rien à protéger de votre côté : le téléchargement tourne sur le serveur, pas dans votre navigateur. Consultez l'onglet Historique plus tard.
- **La fenêtre était trop étroite** — relancez l'assistant avec une plage plus large. Les mois réimportés sont simplement rafraîchis avec les valeurs actuelles de DHIS2.

## La suite

Dernière étape : **Vérifier et explorer** — confirmer que tout est en ordre et apprendre à naviguer dans vos données. Ensuite, un administrateur **génère un paquet de résultats** pour que les projets utilisent les nouvelles données.
