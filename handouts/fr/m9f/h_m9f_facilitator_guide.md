---
marp: true
theme: fastr-handout
paginate: true
class: facilitator
footer: "FASTR · Techniques de prompting · Facilitateur"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

# Guide du facilitateur — Techniques de prompting

<p class="meta-line"><strong>Guide du facilitateur</strong> · <strong>Techniques de prompting</strong> · <strong>6 activités · ~115 min</strong></p>

## Objectif

Ce module développe une compétence pratique unique : donner à l'Assistant IA des instructions assez claires pour obtenir un résultat utile. Les participants progressent de l'écriture d'un prompt bien formé, à l'exploration de la façon dont l'IA réagit à de petits changements, jusqu'à l'affinage et la vérification des sorties. Les compétences établies ici sont supposées par toutes les activités assistées par l'IA plus loin dans l'atelier — construire des visualisations, des présentations et des rapports de perturbation — ce module en est donc le fondement.

À la fin, un participant devrait pouvoir : écrire un prompt qui énonce son objectif, son audience, sa portée et son format ; modifier un prompt délibérément et observer l'effet ; choisir entre une conversation itérative et un prompt structuré unique ; et appliquer une vérification systématique à un brouillon généré par l'IA avant de l'utiliser.

## La session en bref

| # | Activité | Durée | Format |
|---|----------|-------|--------|
| 1 | Construire un prompt clair | ~15 min | Individuel, puis partage |
| 2 | Explorer avec l'Assistant IA | ~20 min | Binômes ou petites équipes |
| 3 | Itératif vs prompt unique | ~30 min | Binômes ou petites équipes |
| 4 | Affiner votre prompt | ~20 min | Individuel (en autonomie) |
| 5 | Utiliser un rapport précédent comme modèle | ~10 min | Binômes ou petites équipes |
| 6 | Vérifier la sortie de l'IA | ~20 min | Individuel ou en binôme |

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Animer la session

**Préparation.** Confirmez avant la session que chaque table peut se connecter à la plateforme et ouvrir l'Assistant IA dans le projet de son pays. La génération prend jusqu'à une minute par requête, donc une connexion fiable compte plus ici que dans la plupart des modules. Préparez un prompt à vous à l'avance, pour démontrer à partir d'un exemple éprouvé plutôt qu'en improvisant.

**Comment démontrer.** La plupart des activités sont pratiques. Pour chacune, montrez la première étape à l'écran partagé — juste assez pour que les participants reconnaissent l'interface — puis laissez-les travailler à partir du document à leur rythme. Évitez de dérouler une activité entière à l'écran : on apprend à prompter en écrivant des prompts, pas en vous regardant faire. Les moments à l'écran qui comptent le plus sont signalés sous **Démontrer** dans chaque activité.

**Regroupement.** Les activités 2, 3 et 5 fonctionnent bien en binômes ou petites équipes, où les participants comparent les sorties et discutent des différences. Les activités 1 et 4 sont individuelles ; les participants doivent se forger leur propre jugement avant de comparer.

**Rythme.** L'activité 1 est fondatrice et ne doit pas être abrégée, même quand le temps presse — les activités suivantes supposent que les participants savent nommer les six dimensions d'un bon prompt. Si la session prend du retard, raccourcissez l'activité 5 (la plus courte et la plus explicite) plutôt que l'activité 1 ou 6.

**Le message à faire passer.** Un bon prompt est rarement le premier écrit ; affiner est la façon normale de travailler, pas un signe d'échec. Renforcez-le à chaque activité pour que les participants ne se découragent pas quand une première tentative renvoie une réponse générique.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Les activités

### 1. Construire un prompt clair · ~15 min · individuel

**Le déroulé.** Les participants prennent une tâche qu'ils font régulièrement et, avant d'écrire quoi que ce soit, la vérifient selon six dimensions : objectif, audience, géographie/période/portée, consignes d'interprétation, format de sortie, et garde-fous. Ils écrivent ensuite un prompt unique qui répond à chacune, et le partagent avec un voisin.

**Démontrer.** Mettez à l'écran un prompt délibérément vague — *« parle-moi de nos données »* — et demandez au groupe ce que l'IA va probablement renvoyer. Montrez ensuite une version qui nomme objectif, audience, portée et format, et comparez les deux. Le point passe plus vite par une comparaison côte à côte que par l'explication.

**Formulez-le ainsi.** *« Les six dimensions ne sont pas un formulaire à remplir. C'est une vérification de 30 secondes avant de taper, pour que votre premier message soit déjà proche du but. »*

**À quoi ressemble un bon résultat.** Un prompt — un court paragraphe suffit — où un lecteur peut prédire ce que l'IA va renvoyer, parce que l'objectif, l'audience, la portée et le format sont tous énoncés.

**À surveiller.**
- Viser un prompt parfait du premier coup. Rassurez-les : les six dimensions produisent juste un *premier* message plus solide ; l'affinage suit quand même.
- Un prompt vague. Plutôt que de le réécrire, demandez quelle dimension manque et faites-la ajouter.
- Les garde-fous sautés — la dimension la plus souvent oubliée. Rappelez de dire à l'IA de rester dans les données affichées et de signaler l'incertitude.

### 2. Explorer avec l'Assistant IA · ~20 min · binômes

**Le déroulé.** Les participants lancent un prompt de base fourni (*utilisation des services CPN1 par région sur les 12 derniers mois*), le relancent en changeant exactement un élément — indicateur, période, ou niveau géographique — et observent comment la sortie change. Ils posent une question de suivi pour voir que l'échange peut continuer comme une conversation, et enregistrent ce qui mérite d'être gardé dans leur dossier personnel.

**Démontrer.** Collez le prompt de base dans l'Assistant IA à l'écran et lancez-le. Changez ensuite un seul mot — l'indicateur — et relancez, pour que le groupe voie un changement produire une seule différence avant d'essayer.

**Formulez-le ainsi.** *« Changez une chose, regardez ce qui a bougé, puis changez la suivante. Si vous changez deux choses d'un coup, vous ne saurez pas laquelle a agi. »*

**À quoi ressemble un bon résultat.** Deux ou trois sorties qui diffèrent d'une seule façon identifiable, et un participant capable de dire quel changement a produit quelle différence.

**À surveiller.**
- Changer deux choses à la fois — l'erreur la plus fréquente. Tenez-les à une variable par essai.
- Une sortie utile non enregistrée. Rappelez d'enregistrer un bon graphique ou une interprétation dans leur dossier avant de continuer.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 3. Itératif vs prompt unique · ~30 min · binômes

**Le déroulé.** Les participants construisent le même rapport de qualité des données en trois diapositives, deux fois. Dans l'Exercice A, ils y arrivent par quatre prompts envoyés en séquence, en réagissant à chaque réponse. Dans l'Exercice B, ils ouvrent une nouvelle conversation et y arrivent avec un seul prompt structuré. Ils comparent les deux sorties et complètent une courte réflexion, appuyée par un tableau « quand utiliser chaque approche ».

**Démontrer.** Avant l'Exercice B, montrez comment ouvrir une *nouvelle* conversation, et expliquez pourquoi c'est important : s'ils continuent dans le fil de l'Exercice A, le prompt unique hérite de tout ce contexte antérieur et la comparaison perd son sens.

**Formulez-le ainsi.** *« Aucune approche n'est meilleure. Itérez quand vous cherchez encore ce que vous voulez ; un prompt structuré unique quand vous le savez déjà et le répéterez. »*

**À quoi ressemble un bon résultat.** Deux rapports comparables et un participant capable d'énoncer le compromis : la voie itérative donne plus de contrôle et convient à l'exploration ; le prompt unique est plus rapide et convient aux sorties répétables et routinières.

**À surveiller.**
- Déclarer une approche « meilleure ». Les deux utilisent les mêmes données et méthodes — le choix dépend de la tâche.
- L'Exercice B lancé dans le même fil que A. Vérifiez qu'ils ont ouvert une nouvelle conversation, sinon le résultat est contaminé.

### 4. Affiner votre prompt · ~20 min · individuel (en autonomie)

**Le déroulé.** Les participants choisissent un sujet — valeurs aberrantes, complétude, ou perturbations — et mènent trois rondes dessus, chacune dans une nouvelle conversation : une demande simple, la même avec du contexte ajouté, puis une version qui demande de prioriser et de proposer des prochaines étapes. Après chaque ronde, ils notent ce qui s'est amélioré.

**Démontrer.** Parcourez une fois le tableau des trois rondes avec un sujet neutre pour rendre la progression claire — ronde 1 nue, ronde 2 ajoute *où/quand*, ronde 3 ajoute *pourquoi/qui* — puis laissez-les lancer leur propre sujet.

**Formulez-le ainsi.** *« Ne remarquez pas seulement que la dernière était meilleure — nommez ce que vous avez ajouté qui l'a rendue meilleure. C'est ça que vous pouvez réutiliser. »*

**À quoi ressemble un bon résultat.** Trois diapositives visiblement différentes sur un sujet, et un participant capable de nommer ce que chaque ronde a ajouté — la ronde deux ajoute généralement *où* et *quand*, la ronde trois ajoute *pourquoi* et *pour qui*.

**À surveiller.**
- Mener les rondes en suivi dans un seul fil au lieu de nouvelles conversations — ils ne voient alors pas l'effet propre de chaque prompt.
- Voir l'amélioration sans en voir la cause. Poussez-les à formuler l'ajout précis de chaque ronde, et à enregistrer la meilleure formulation.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 5. Utiliser un rapport précédent comme modèle · ~10 min · binômes

**Le déroulé.** Plutôt que de décrire une structure avec des mots, les participants montrent un exemple à l'IA. Ils téléversent un rapport en lequel ils ont déjà confiance dans Ressources, l'incluent dans une nouvelle conversation via le menu à trois points, et demandent à l'IA d'en reproduire la structure pour une nouvelle période ou portée.

**Démontrer.** Cette activité repose sur une séquence un peu délicate — montrez-la lentement à l'écran : **Ressources → Téléverser → choisir le PDF**, puis dans une conversation **menu à trois points → Inclure le fichier → le sélectionner**. Soulignez que le menu doit afficher le fichier comme *joint*.

**Formulez-le ainsi.** *« Téléverser un fichier n'est pas la même chose que l'inclure. Si l'IA dit qu'elle ne voit pas votre rapport, c'est presque toujours pour ça. »*

**À quoi ressemble un bon résultat.** Un nouveau rapport qui suit la structure du modèle téléversé, vérifié section par section contre lui.

**À surveiller.**
- Fichier téléversé mais non inclus dans la conversation — l'échec le plus fréquent. Confirmez que le menu à trois points l'affiche comme joint.
- L'IA qui dérive du modèle — simplifie un graphique, omet une section. Faites comparer la sortie au modèle côte à côte avant usage.
- Un PDF trop gros à téléverser. Proposez de le diviser en chapitres ou d'en extraire les pages utiles.

### 6. Vérifier la sortie de l'IA · ~20 min · individuel ou binôme

**Le déroulé.** Les participants appliquent une vérification reproductible à un brouillon généré par l'IA : le lire une fois et marquer chaque affirmation factuelle, trier les affirmations par risque, vérifier à la main les affirmations à risque élevé contre les données, demander à l'IA de citer sa source pour celles à risque moyen, et finir par un court scan de cohérence.

**Démontrer.** Prenez un court brouillon IA à l'écran et marquez deux ou trois affirmations à voix haute — un chiffre, une relation de cause à effet — puis montrez le tableau de risque et placez-y ces affirmations. Modéliser l'étape de marquage lève l'essentiel de l'hésitation.

**Formulez-le ainsi.** *« L'IA écrit avec aisance, ce qui fait sonner juste des chiffres faux. Fluide n'est pas exact — chaque chiffre doit remonter aux données. »*

**À quoi ressemble un bon résultat.** Un brouillon où chaque chiffre conservé remonte à sa source, et toute affirmation que l'IA n'a pu étayer a été retirée ou réécrite.

**À surveiller.**
- La précipitation — l'échec le plus fréquent. Il faut les 20 minutes complètes ; protégez le temps.
- Faire confiance à une formulation assurée. Signalez les indices : chiffres ronds, chiffres précis sans source, chiffres plausibles mais introuvables.
- Le principe à leur laisser : celui qui remet le travail est responsable de chaque chiffre — un brouillon n'est pas fini tant qu'ils ne le signeraient pas.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Pour conclure

Terminez sur la vérification. Bien prompter donne un brouillon rapide ; bien vérifier est ce qui en fait le travail propre et défendable du participant. Ce couple — générer, puis vérifier — est l'habitude sur laquelle repose le reste de l'atelier.
