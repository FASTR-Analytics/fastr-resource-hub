---
marp: true
theme: fastr-handout
paginate: true
footer: "FASTR · Visualisations et interprétation"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step current">Lire une viz</span> <span class="arrow">→</span> <span class="step">Construire manuellement</span> <span class="arrow">→</span> <span class="step">Construire avec l'IA</span> <span class="arrow">→</span> <span class="step">Écrire l'interprétation</span> <span class="arrow">→</span> <span class="step">Interprétation IA</span> <span class="arrow">→</span> <span class="step">Repérer une perturbation</span></div>

# Comment lire une visualisation FASTR

<p class="meta-line"><strong>Référence</strong> · <strong>Visualisations et interprétation</strong> · <strong>~10 min</strong></p>

## À quoi sert ce document

Une référence courte que vous utiliserez à plusieurs reprises. Un graphique est une question rendue en image — avant d'en construire un, ou d'en demander un à l'IA, vous devez savoir *lire* un graphique. Sinon, vous ne saurez pas si ce que vous obtenez répond vraiment à votre question.

Gardez ce document près de vous pendant les activités suivantes.

## Le cadre en six étapes

Utilisez-le chaque fois que vous ouvrez un graphique, que vous l'ayez construit ou non :

| Étape | À se demander |
|-------|---------------|
| **1. Quel indicateur ?** | Quel indicateur de santé est affiché ? (CPN1, CPN4, couverture vaccinale, …) |
| **2. Quel niveau et quelle période ?** | National, régional, district, établissement ? Quelle plage temporelle ? |
| **3. Qu'est-ce qui est comparé ?** | Observé vs attendu ? District vs district ? Évolution dans le temps ? |
| **4. Lire les valeurs** | Quelle est la magnitude — élevée, faible, en évolution ? |
| **5. Qu'est-ce qui ressort ?** | Tendances, écarts, pics, perturbations, anomalies |
| **6. Et alors ?** | Qu'est-ce que cela signifie pour la prestation de services ? Quelle action cela suggère-t-il ? |

> **Astuce :** Vérifiez toujours la légende, les étiquettes des axes et les notes de bas de page *avant* de commencer l'interprétation. Mal lire l'axe Y est l'erreur la plus fréquente.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Choisir le bon type de graphique

Différentes questions appellent différents graphiques. Deux modèles couvrent la plupart des sorties FASTR :

- **Graphique en ligne** — meilleur pour les **tendances dans le temps**. Un ou deux indicateurs, valeurs mensuelles. Facile de voir la direction.
- **Carte de chaleur (heatmap)** — meilleure pour **comparer beaucoup de lieux en une vue**. Districts × indicateurs. Facile de repérer ceux qui s'écartent du motif.

| Quand vous voulez voir… | Utilisez |
|--------------------------|----------|
| L'évolution d'un indicateur sur les 12 derniers mois | Graphique en ligne |
| Comment 25 districts se comparent sur le même indicateur | Heatmap |
| Deux indicateurs sur le même axe temporel | Graphique en ligne (double série) |
| Un indicateur, une période, à travers quelques districts | Graphique en barres |

**En cas de doute :** commencez par un graphique en ligne pour un indicateur, ou une heatmap pour plusieurs.

## Test rapide — essayez les six étapes

Trouvez un graphique récent de votre pays (une capture, une diapositive, un rapport imprimé) et parcourez les étapes 1 à 6 à voix haute avec un collègue. Repérez où vous ralentissez — c'est souvent là que le graphique manque une étiquette, ou que la question qu'il essaie de répondre n'est pas claire.

## Étape suivante

Vous allez maintenant construire votre propre visualisation — d'abord manuellement, puis avec l'Assistant IA. Les deux approches se terminent par le même cadre d'interprétation en six étapes que vous venez d'apprendre.

> 🔎 **Vérifiez dans votre interface actuelle** : les types de graphiques et libellés peuvent légèrement différer des captures ailleurs dans cette série. Le cadre ci-dessus s'applique à tout graphique.
