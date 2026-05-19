---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Techniques de prompting"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Construire un prompt clair</span> <span class="arrow">→</span> <span class="step done">Explorer</span> <span class="arrow">→</span> <span class="step done">Itératif vs unique</span> <span class="arrow">→</span> <span class="step done">Affiner</span> <span class="arrow">→</span> <span class="step done">Modèle PDF</span> <span class="arrow">→</span> <span class="step current">Vérifier la sortie</span></div>

# Vérifier la sortie de l'IA

<p class="meta-line"><strong>Activité</strong> · <strong>Techniques de prompting</strong> · <strong>~20 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Avant de commencer</p>

- ☐ Vous avez un brouillon généré par l'IA dans les activités précédentes (ou fourni par le facilitateur)
- ☐ Vous savez sur quel jeu de données ou document l'IA a travaillé
- ☐ Vous avez ~20 minutes pour le faire correctement — ne vous précipitez pas

<p class="sb-label">Pourquoi c'est important</p>

L'IA écrit avec fluidité, ce n'est pas un vérificateur de faits. Insérez sa sortie sans vérifier et vous devenez responsable de tout chiffre fabriqué. Cette méthode vous donne une vérification reproductible avant de livrer.

</aside>
<div class="p1-main">

<h2 class="step-h"><span class="step-n">1</span><span>Lire une fois, marquer les affirmations (~5 min)</span></h2>

Lisez le brouillon de l'IA lentement. Au fil de la lecture, **soulignez ou surlignez chaque affirmation factuelle** — tout ce qui pourrait être erroné :

- Chiffres précis (pourcentages, comptes, dates)
- Noms d'organisations, programmes ou lieux
- Liens de cause à effet (« X a causé Y », « à cause de Z… »)
- Citations ou paraphrases attribuées à une source

Pour le moment, ne vérifiez pas. Marquez seulement.

<h2 class="step-h"><span class="step-n">2</span><span>Trier par risque (~3 min)</span></h2>

Pour chaque affirmation marquée, attribuez un niveau de risque :

| Risque | À quoi cela ressemble | Que faire |
|--------|------------------------|-----------|
| **Élevé** | Une statistique, un lien de cause à effet, la recommandation centrale | Vérifier à la main contre les données ou la source |
| **Moyen** | Un constat général lié à une source précise que vous avez chargée | Vérifier avec l'IA : demandez-lui de citer la source |
| **Faible** | Un fait bien connu, ou soutenu par plusieurs sources fiables | Vérification ponctuelle si le temps le permet |

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">3</span><span>Vérifier les affirmations à risque élevé (~7 min)</span></h2>

Choisissez les deux ou trois affirmations à risque élevé les plus importantes et vérifiez-les vous-même :

- **Chiffres :** ouvrez les données sur lesquelles l'IA a travaillé. Le chiffre correspond-il exactement ?
- **Cause à effet :** les données soutiennent-elles vraiment l'affirmation, ou l'IA a-t-elle suggéré quelque chose que les données ne montrent pas ?
- **Sources :** si l'IA a cité un document, ouvrez-le. Le document dit-il vraiment cela ?

**Signaux d'alerte (Guide d'écriture IA) :**

- Chiffres ronds comme *« environ 1 million »* — peuvent être inventés
- Chiffres précis sans source — probablement fabriqués
- Chiffres qui semblent plausibles mais que vous ne pouvez pas retracer

<h2 class="step-h"><span class="step-n">4</span><span>Utiliser l'IA pour vérifier les affirmations à risque moyen (~3 min)</span></h2>

Collez une affirmation à risque moyen dans l'Assistant IA avec ce prompt :

> *« Je veux utiliser l'affirmation suivante dans un rapport : [affirmation]. Les données ou le document que je t'ai donné soutiennent-ils ceci ? Cite le passage exact. »*

Si l'IA ne peut pas citer une source, retirez l'affirmation ou réécrivez-la.

<h2 class="step-h"><span class="step-n">5</span><span>Vérification finale de cohérence (~2 min)</span></h2>

Scan rapide avant de considérer que c'est fini :

- ☐ Pas de contradictions entre sections (les chiffres du résumé correspondent à ceux du corps)
- ☐ Acronymes définis à la première utilisation, puis utilisés de manière cohérente
- ☐ Une seule convention orthographique partout (p. ex. « agents de santé » partout, pas mélangé avec « personnel de santé »)
- ☐ Chaque chiffre que vous avez gardé peut être retracé à sa source

## Ce avec quoi vous devriez repartir

Un brouillon que vous seriez à l'aise de signer de votre nom. **Si vous ne le signeriez pas, c'est qu'il n'est pas fini.**
