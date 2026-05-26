---
marp: true
theme: fastr-handout
paginate: true
class: facilitator
footer: "FASTR · Rapport de perturbations · Facilitateur"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

# Guide du facilitateur — Rapport de perturbations

<p class="meta-line"><strong>Guide du facilitateur</strong> · <strong>Rapport de perturbations</strong> · <strong>4 activités · ~180–240 min</strong></p>

## Objectif

C'est l'aboutissement des activités d'analyse. Les équipes produisent un rapport de perturbations complet avec l'Assistant IA, puis le vérifient, l'affinent et le relisent entre pairs. Il rassemble tout ce qui précède dans l'atelier — construire un rapport à la main, prompter, et vérifier — et l'applique à un vrai livrable. Le module suppose que les participants ont déjà fait la construction manuelle du rapport et l'activité de prompting ; sinon, ralentissez à l'étape du prompt.

À la fin, chaque équipe devrait avoir un rapport de perturbations vérifié et affiné qu'elle pourrait présenter à un·e décideur·euse, et une idée claire de ce que l'IA a rédigé par rapport à ce dont l'équipe est responsable.

## La session en bref

| # | Activité | Durée | Format |
|---|----------|-------|--------|
| 1 | Créer le rapport avec l'IA | ~60 min | Équipe (un pilote) |
| 2 | Vérifier le résultat | ~20 min | Équipe |
| 3 | Affiner | ~40 min | Équipe |
| 4 | Revue par les pairs et présentation | ~40 min | Équipe ↔ équipe |

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Animer la session

**Préparation.** Confirmez que chaque équipe a une instance chargée et a terminé les activités de prompting et de rapport manuel. Ayez la Bibliothèque de prompts ouverte dans le compte de démo pour montrer le premier lancement en direct. C'est l'activité la plus longue de l'atelier — prévoyez 3 à 4 heures et protégez-la de toute compression.

**Comment démontrer.** Démontrez le premier lancement de prompt avant que les équipes ne commencent : ouvrez la Bibliothèque de prompts, lancez le Prompt 1, et répondez aux questions de l'IA à l'écran. Laissez ensuite les équipes travailler. La génération prend 5 à 10 minutes par construction ; intégrez donc la discussion de la liste de vérification dans ce temps d'attente plutôt que de laisser la salle inactive.

**Regroupement.** Les équipes travaillent en petits groupes avec un **pilote** au clavier et les autres en relecture. Faites tourner le pilote entre les sections si le temps le permet, pour que plus d'une personne pratique les prompts.

**Rythme.** L'activité 1 (génération) met tout le reste en place ; ne précipitez pas l'étape des regroupements. Si la session s'allonge, comprimez l'activité 3 (affiner) plutôt que l'activité 2 (vérifier) — un rapport non vérifié est pire qu'un rapport moins soigné.

**Le message à faire passer.** L'IA rédige ; l'équipe est responsable. Renforcez la vérification à chaque étape, pas seulement à l'activité 2.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Les activités

### 1. Créer le rapport avec l'IA · ~60 min · équipe

**Le déroulé.** Les équipes génèrent le rapport de base à partir d'un prompt prêt (Prompt 1 national, ou Prompt 4 infranational) : créer le deck → ouvrir l'Assistant IA → choisir le prompt → répondre aux questions (période, sous-titre, groupes, mortalité) → vérifier les groupes → confirmer → laisser construire.

**Démontrer.** Lancez le Prompt 1 à l'écran et répondez aux questions de l'IA, en vous arrêtant sur l'étape des **groupes** — montrez à quoi ressemble un regroupement réfléchi, car c'est lui qui détermine si le rapport se lit clairement.

**Formulez-le ainsi.** *« Une fois la construction lancée, ne cliquez pas sur une diapo — cela interrompt la construction. Prenez votre temps sur les groupes ; un regroupement bâclé donne un rapport confus. »*

**À quoi ressemble un bon résultat.** Un rapport complet construit à partir de groupes réfléchis, le pilote saisissant les réponses convenues plutôt que tout le groupe à la fois.

**À surveiller.**
- Les équipes qui cliquent une diapo pendant la génération — dites-leur d'attendre.
- Des regroupements bâclés — passez-y du temps réel.
- Tout le groupe qui parle par-dessus le pilote — une personne tape les réponses convenues.

### 2. Vérifier le résultat · ~20 min · équipe

**Le déroulé.** Une liste de vérification en deux parties que toute l'équipe parcourt avant d'utiliser le rapport : vérifications générales (toutes les diapos présentes, pays, période, pas d'espaces réservés oubliés) et vérifications du rapport (groupes corrects, graphiques chargés, interprétations conformes aux graphiques, titres = constats).

**Démontrer.** Montrez une interprétation lue à voix haute par rapport à son graphique — modélisez la vérification des mots contre la courbe, pas le ton de la rédaction.

**Formulez-le ainsi.** *« Lisez chaque interprétation à voix haute en regardant le graphique. Si les mots disent "forte baisse" et que la courbe bouge à peine, corrigez les mots. »*

**À quoi ressemble un bon résultat.** Chaque diapo vérifiée, les écarts entre texte et graphique repérés et notés pour l'étape d'affinage.

**À surveiller.**
- Les équipes qui font confiance à l'IA parce qu'elle sonne assurée — faites-leur lire les interprétations à voix haute et comparer au graphique.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 3. Affiner · ~40 min · équipe

**Le déroulé.** Mise en forme plus sections optionnelles via Prompt 2 (régional) et Prompt 3 (qualité des données) : peaufiner pour le public, ajouter les sections régionale et/ou DQA, et vérifier chaque nouvelle section au fur et à mesure.

**Démontrer.** Montrez l'ajout d'une section avec le Prompt 2 ou 3, puis sa vérification immédiate — en rappelant que chaque nouvelle section reçoit le même contrôle que le rapport de base.

**Formulez-le ainsi.** *« N'ajoutez que ce dont un·e décideur·euse a besoin. Plus de sections ne fait pas un meilleur rapport — juste un plus long. »*

**À quoi ressemble un bon résultat.** Un rapport peaufiné pour son public, avec seulement les sections supplémentaires utiles à la décision, chacune vérifiée.

**À surveiller.**
- Les équipes qui ajoutent toutes les sections « par sécurité » — orientez-les vers ce dont le public a réellement besoin.

### 4. Revue par les pairs et présentation · ~40 min · équipe ↔ équipe

**Le déroulé.** Les équipes échangent les rapports, les relisent avec un regard neuf, et présentent leurs retours : lire à froid (le message est-il clair ? un·e décideur·euse agirait-il/elle ?), noter deux points forts et deux suggestions, présenter, puis discussion de groupe.

**Démontrer.** Modélisez un retour utile face à un retour vague, pour que les équipes visent des suggestions précises ancrées sur une diapo.

**Formulez-le ainsi.** *« Reliez chaque suggestion à une diapo précise. "Le titre de la diapo 3 n'est pas un constat" aide ; "rendez-le plus clair" non. »*

**À quoi ressemble un bon résultat.** Chaque équipe donne à une autre deux points forts concrets et deux suggestions concrètes ancrées sur une diapo.

**À surveiller.**
- Les retours vagues — exigez des suggestions précises liées à une diapo.

## Pour conclure

Ce rapport est le principal livrable de l'atelier. Concluez en renforçant la répartition des rôles qui l'a produit : l'IA a rédigé vite, et c'est la vérification et la connaissance locale de l'équipe qui le rendent assez fiable pour être présenté.
