---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Techniques de prompting"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Construire un prompt clair</span> <span class="arrow">→</span> <span class="step done">Explorer</span> <span class="arrow">→</span> <span class="step done">Itératif vs unique</span> <span class="arrow">→</span> <span class="step done">Affiner</span> <span class="arrow">→</span> <span class="step current">Modèle PDF</span> <span class="arrow">→</span> <span class="step">Vérifier la sortie</span></div>

# Utiliser un rapport précédent comme modèle

<p class="meta-line"><strong>Activité</strong> · <strong>Techniques de prompting</strong> · <strong>~10 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Avant de commencer</p>

- ☐ Vous avez parcouru les activités précédentes sur le prompting
- ☐ Vous disposez d'un rapport précédent (PDF) qui vous satisfait et que vous aimeriez reproduire pour une nouvelle période

<p class="sb-label">Pourquoi c'est important</p>

Parfois, la façon la plus simple de briefer l'IA n'est pas de décrire ce que vous voulez — c'est de le **montrer**. Un rapport antérieur permet à l'IA de retrouver une structure existante au lieu de réinventer le format.

</aside>
<div class="p1-main">

## Quand utiliser cette approche

- Vous disposez d'un rapport précédent que vous voulez reproduire
- Vous voulez garder un format cohérent dans le temps
- Vous n'avez pas de prompt personnalisé disponible pour ce type de rapport

<h2 class="step-h"><span class="step-n">1</span><span>Téléverser le rapport dans vos Ressources</span></h2>

Depuis la page principale, allez dans **Ressources** → **Téléverser des ressources** → sélectionnez votre PDF.

<h2 class="step-h"><span class="step-n">2</span><span>Inclure le rapport dans la conversation IA</span></h2>

Ouvrez une nouvelle conversation IA. Cliquez sur le **menu à trois points** → **Inclure un fichier** → sélectionnez le rapport que vous venez de téléverser.

L'IA dispose maintenant du PDF comme contexte pour toute cette conversation.

<h2 class="step-h"><span class="step-n">3</span><span>Demander à l'IA de reproduire la structure</span></h2>

Un prompt de départ :

> Utilise ce rapport comme modèle. Crée un rapport similaire couvrant [période] pour [pays/région/portée].

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Astuces

> **Vérifiez, ne faites pas confiance aveuglément.** Même avec un modèle, l'IA peut dériver — elle peut simplifier un graphique, sauter une section ou résumer trop largement. Comparez la sortie côte à côte avec le modèle avant de la partager.

> **Conservez vos « bons » exemples.** À mesure que votre équipe produit des rapports dont vous êtes fiers, sauvegardez-les dans Ressources. Chacun devient un modèle que vous (ou un collègue) pouvez réutiliser.

## Que faire si ça ne marche pas

- **L'IA ne semble pas « voir » le fichier** — vérifiez que vous l'avez bien inclus dans la conversation (et pas seulement téléversé). Le menu à trois points doit afficher le fichier comme attaché.
- **La sortie saute des sections du modèle** — demandez explicitement à l'IA : *« Inclus toutes les sections du modèle, dans le même ordre. »*
- **PDF trop volumineux pour être téléversé** — découpez-le par chapitre ou extrayez les pages pertinentes d'abord.

## Étape suivante

Ceci clôt le module sur les techniques de prompting. À partir d'ici, vous utiliserez ces compétences dans de vraies activités d'atelier — construire des visualisations, des présentations et des rapports de perturbations avec l'IA comme collaboratrice.
