---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Configuration de l'instance"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Établissements</span> <span class="arrow">→</span> <span class="step done">Indicateurs</span> <span class="arrow">→</span> <span class="step done">Données</span> <span class="arrow">→</span> <span class="step current">Vérifier</span></div>

# Vérifier et explorer votre installation

<p class="meta-line"><strong>Configuration de l'instance</strong> · <strong>~10 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Avant de commencer</p>

- ☐ Vous avez complété les quatre documents précédents (connexion / établissements / indicateurs / données)

</aside>
<div class="p1-main">

## Ce que vous allez faire

Faire un contrôle ponctuel de vos données importées, apprendre à naviguer dans l'explorateur de graphiques, et confirmer que tout est prêt pour les modules d'analyse.

<h2 class="step-h"><span class="step-n">1</span><span>Voir les données importées sous forme de graphique</span></h2>

Sur la page **HMIS Data**, vos indicateurs apparaissent en séries temporelles. Le panneau de gauche liste chaque indicateur importé.

![h:200](../../../resources/screenshots/m9a_setup/16_chart_imported.jpeg)

<h2 class="step-h"><span class="step-n">2</span><span>Activer/désactiver des indicateurs sur le graphique</span></h2>

Dans le panneau de gauche, **cochez/décochez** les indicateurs pour les afficher ou les masquer. Utile pour comparer deux ou trois indicateurs à la fois sans encombrement.

<h2 class="step-h"><span class="step-n">3</span><span>Ajuster l'échelle de l'axe Y</span></h2>

Utilisez le curseur **Scale** en bas pour passer entre une échelle linéaire et un axe Y plus large quand un indicateur domine les autres.

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">4</span><span>Contrôle ponctuel d'une valeur connue</span></h2>

Choisissez une période (p. ex. le mois dernier) et un établissement que vous connaissez bien. Comparez mentalement la valeur reportée par FASTR à ce que vous attendriez de vos tableaux de bord DHIS2.

> Si elles correspondent → tout va bien. Si elles divergent fortement → vérifiez votre mapping d'indicateurs (cause la plus fréquente) avant de lancer une analyse.

<h2 class="step-h"><span class="step-n">5</span><span>Consulter l'historique d'importation</span></h2>

Cliquez sur **View previous imports** pour voir toutes les importations passées — date, source, nombre de lignes insérées/mises à jour. Utile pour suivre ce qui est chargé et quand.

![h:200](../../../resources/screenshots/m9a_setup/17_previous_imports.jpeg)

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Vérification

De retour sur la page **Données**, vous devriez avoir :

- ✓ Unités administratives et établissements (vert)
- ✓ Indicateurs (mappés)
- ✓ Données HMIS (chargées avec valeurs qui défilent dans le temps)

Vous êtes prêt à lancer les modules d'analyse — qualité des données, utilisation des services, estimation de la couverture, etc.

## Que faire si ça ne marche pas

- **Toutes les valeurs apparaissent plates / à zéro** — la plage temporelle ne recoupe peut-être pas la période où DHIS2 a des données. Vérifiez votre plage et ré-importez.
- **Certains indicateurs apparaissent, d'autres non** — le mapping est incomplet. Retournez à la page des indicateurs et vérifiez que chaque indicateur DHIS2 a un lien d'indicateur commun.
- **Le graphique ne charge pas** — essayez un autre navigateur ; les graphiques FASTR utilisent des fonctionnalités web modernes que certains anciens navigateurs ne supportent pas.

## Étape suivante

Installation terminée. Passez à **Premiers pas** (M9b) pour apprendre l'interface en profondeur, ou lancez directement votre premier module d'analyse.
