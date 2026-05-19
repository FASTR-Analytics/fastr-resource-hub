---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Techniques de prompting"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Construire un prompt clair</span> <span class="arrow">→</span> <span class="step current">Explorer</span> <span class="arrow">→</span> <span class="step">Itératif vs unique</span> <span class="arrow">→</span> <span class="step">Affiner</span> <span class="arrow">→</span> <span class="step">Modèle PDF</span> <span class="arrow">→</span> <span class="step">Vérifier la sortie</span></div>

# Explorer avec l'Assistant IA

<p class="meta-line"><strong>Activité</strong> · <strong>Techniques de prompting</strong> · <strong>~20 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Avant de commencer</p>

- ☐ Vous avez complété **Construire un prompt clair**
- ☐ Le panneau Assistant IA est ouvert dans le projet de votre pays

<p class="sb-label">Pourquoi c'est important</p>

De petits changements dans un prompt produisent des sorties sensiblement différentes. Cet exercice construit cette intuition — partir d'un prompt de base, changer une variable, puis poser une question de suivi.

</aside>
<div class="p1-main">

<h2 class="step-h"><span class="step-n">1</span><span>Essayez ce prompt de base</span></h2>

Saisissez le prompt ci-dessous dans l'Assistant IA. Vous pouvez le coller tel quel :

> Montre l'utilisation des services CPN1 par région sur les 12 derniers mois.

Il fonctionne parce qu'il nomme trois choses explicitement :

- **Quoi** — CPN1
- **Où** — par région
- **Quand** — les 12 derniers mois

<h2 class="step-h"><span class="step-n">2</span><span>Changez un élément</span></h2>

Relancez le prompt en modifiant **un** seul élément. Choisissez une variante :

- **Indicateur différent :** *Montre la dose de BCG par région sur les 12 derniers mois.*
- **Période différente :** *Montre CPN1 par région pour 2023 et 2024.*
- **Niveau géographique différent :** *Montre CPN1 par district sur les 12 derniers mois.*

Remarquez comment changer un seul mot modifie la sortie.

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">3</span><span>Posez une question de suivi</span></h2>

Choisissez l'une de ces relances (ou écrivez la vôtre). La conversation peut continuer :

- *Montre ceci en diagramme à barres.*
- *Quelle région a eu le plus grand changement ?*
- *Ajoute Penta1 à la comparaison.*

## Enregistrez ce qui est utile

Tout ce que vous produisez et que vous voulez garder — un graphique, une interprétation — enregistrez-le dans votre dossier personnel avant de passer à la suite.

## Astuces

> **Une variable à la fois.** Changer deux choses à la fois rend difficile d'identifier ce qui a causé la différence. Variez un élément, observez, puis variez le suivant.

> **Pas besoin de politesse.** L'IA n'a pas besoin de « s'il te plaît » ou de « merci ». Soyez direct.

## Étape suivante

Passez à **Itératif vs prompt unique** pour comparer deux façons de construire la même sortie.
