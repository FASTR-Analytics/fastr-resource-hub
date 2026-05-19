---
marp: true
theme: fastr-handout
paginate: true
footer: "FASTR · Constructeur de rapports"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

# Liste de vérification — sortie IA

<p class="meta-line"><strong>Référence</strong> · <strong>Constructeur de rapports</strong> · <strong>~15 min</strong></p>

## Pourquoi c'est important

L'Assistant IA peut générer un rapport complet en quelques minutes. **C'est vous** qui le validez. L'IA peut sembler sûre d'elle et se tromper — sur un chiffre, un nom de région, une comparaison. Cette liste de vérification est ce que vous et votre équipe parcourez **avant** de partager un rapport rédigé par l'IA en dehors de l'équipe.

La règle : chaque affirmation du rapport doit être vérifiable par rapport au graphique ou au tableau sous-jacent. Si vous ne pouvez pas relier une phrase à une donnée, signalez-la.

## Avant de commencer

- ☐ L'IA a généré votre rapport (Prompt 1 = rapport de perturbation de base, plus éventuellement Prompt 2 / Prompt 3)
- ☐ Votre équipe pays est ensemble — la vérification est une activité d'équipe, pas en solo
- ☐ Vous avez les graphiques source ouverts sur la plateforme, à côté du rapport

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Prompt 2 — Analyse régionale des perturbations

L'IA génère une diapositive par zone infranationale, comparant les volumes de services observés aux attendus.

| ☐ | Vérification | Notes |
|---|--------------|-------|
| ☐ | La synthèse inclut **toutes** les zones infranationales (comptez-les) |  |
| ☐ | **Une diapositive par zone** — aucune oubliée, aucune en double |  |
| ☐ | Les noms des zones sont **correctement orthographiés** (conformes au nommage officiel de votre pays) |  |
| ☐ | Chaque interprétation référence la **bonne zone** (pas la Région A sur la diapo de la Région B) |  |
| ☐ | Les graphiques observé-vs-attendu utilisent la **même échelle** d'une diapo à l'autre pour rendre les comparaisons lisibles |  |
| ☐ | Les magnitudes correspondent à ce qui est dans le graphique source (pas de baisses gonflées, pas de pics manqués) |  |

> **Si une vérification échoue :** demandez à l'IA de régénérer la section en nommant le problème précisément. *« Tu as mis l'interprétation de la Région X sur la diapo de la Région Y — corrige la diapo 7. »*

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Prompt 3 — Annexe qualité des données

L'IA ajoute une annexe avec les vérifications de complétude, valeurs aberrantes, et cohérence.

| ☐ | Vérification | Notes |
|---|--------------|-------|
| ☐ | L'annexe est **correctement numérotée** (Annexe 1 ou 2 selon que le Prompt 2 a aussi été lancé) |  |
| ☐ | Les trois dimensions de QD sont présentes : **complétude, valeurs aberrantes, cohérence interne** |  |
| ☐ | Le **code couleur est logique** : vert = bon, rouge = alerte. Pas d'échelles inversées. |  |
| ☐ | Les zones ou indicateurs à faible qualité sont **explicitement signalés** dans le texte, pas cachés dans un graphique |  |
| ☐ | Les scores de QD correspondent à ce que vous voyez sur la plateforme (ouvrez le module AQD côte à côte) |  |

> **Si une vérification échoue :** l'IA a peut-être mal lu les sorties AQD. Reformulez : *« Reprends les diapos QD — le graphique [complétude / valeurs aberrantes / cohérence] pour [zone] ne correspond pas à la plateforme. »*

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Lecture finale à voix haute

Une fois les deux listes validées, lisez **chaque interprétation du rapport à voix haute en équipe**. Écoutez :

- **Tout ce qui sonne faux** — un chiffre trop arrondi, une tendance absente du graphique
- **Tout ce qui sonne exagéré** — « dramatique », « alarmant », « sans précédent » sans preuve
- **Tout ce qui sonne générique** — des phrases qui s'appliqueraient à n'importe quel pays, pas au vôtre
- **Contexte local manquant** — l'IA ne connaît pas la grève récente, la rupture d'approvisionnement, la nouvelle politique. Vous devez l'ajouter.

Si quelqu'un dans la salle hésite sur une phrase, **signalez-la**. L'hésitation signale souvent qu'il y a un problème.

## Validation finale

Au moment de partager ce rapport en dehors de l'équipe, l'équipe doit pouvoir dire :

> *« Chaque chiffre est vérifiable. Chaque interprétation reflète ce que nous savons. Aucune phrase n'est générique. Aucune affirmation n'est non étayée. »*

Si vous ne pouvez pas encore le dire, continuez à itérer.

## Étape suivante

Une fois le rapport validé, finalisez la mise en forme (titres, numéros de page, logos), exportez, et diffusez en utilisant votre plan d'action pays.
