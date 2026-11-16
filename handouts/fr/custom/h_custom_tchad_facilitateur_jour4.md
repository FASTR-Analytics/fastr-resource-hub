---
marp: true
theme: fastr-handout
paginate: true
class: facilitator
footer: "FASTR · Tchad · Jour 4 · Facilitateur"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

# Guide du facilitateur DPSIS — Atelier FASTR Tchad, Jour 4

<p class="meta-line"><strong>Guide du facilitateur</strong> · <strong>Jour 4</strong> · <strong>jeudi 19 novembre 2026</strong> · <strong>Centre Jardi de Bakara</strong></p>

## Objectif

L'atelier de formation à la plateforme FASTR, dans le cadre de l'institutionnalisation de FASTR au Tchad, forme les participants à lire et à utiliser l'instance nationale : https://tchad.fastr-analytics.org/. Chaque matinée est consacrée à la théorie, chaque après-midi à la pratique sur la plateforme.

À la fin des deux journées, chaque participant devrait être connecté avec son propre dossier, savoir lire les résultats dans Explorer, avoir construit une visualisation et rédigé son interprétation, et avoir assemblé une présentation de deux diapositives qu'il pourrait montrer à un directeur.

## Rôles

| | Équipe FASTR | Facilitateur DPSIS |
|---|---|---|
| **Matinées (théorie)** | Présente les contenus | Relie chaque notion à la réalité du SNIS tchadien, relance les questions, reformule en termes locaux |
| **Après-midis (pratique)** | Appuie les tables, règle les problèmes techniques | Conduit la salle : lance chaque activité, démontre à l'écran, tient le rythme, vérifie les points de passage |
| **Comptes et accès** | Approuve les comptes sur la page **Utilisateurs** | Repère les participants bloqués et les signale à l'équipe FASTR |

## Avant l'atelier

- ☐ Comptes créés et approuvés sur la page **Utilisateurs** pour la liste des participants connue à l'avance
- ☐ Paquet de résultats épinglé sur la page **Résultats** (le 16 novembre, le paquet « 2026-11-15 » l'était), généré avec les données récentes
- ☐ Fichiers de limites administratives chargés pour la carte d'Explorer (sinon, le dire dès le départ)
- ☐ Dossier pays créé sur la page **Produits**, dans lequel les participants créeront leur propre dossier
- ☐ Une visualisation enregistrée et une présentation terminée dans un dossier de démo
- ☐ Salle : projecteur, wifi testé, un ordinateur par participant ou par binôme
- ☐ Documents participants imprimés : onze pour la journée (Visualisations et interprétation, Présentations)
- ☐ Les questions des binômes de la veille, relevées sur papier, pour les reprendre au récapitulatif

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## La journée en bref

Les matinées sont consacrées à la théorie, présentée par l'équipe FASTR avec votre appui. Les après-midis sont consacrés à la pratique sur la plateforme : vous conduisez la salle, l'équipe FASTR appuie les tables. Les horaires des séquences sont indicatifs ; les pauses et la fin de journée sont fixes.

| Heure | Jeudi 19 novembre |
|---|---|
| 08:30 | Récapitulatif de la veille (plénière, vous) |
| 09:00 | Interprétation des visualisations : le cadre en six étapes, résultat et message clé |
| 10:30 | Pause café |
| 11:00 | Techniques de prompting avec l'assistant IA |
| 12:30 | Déjeuner |
| 14:00 | Visualisations et interprétation : à la main, puis avec l'IA |
| 15:00 | Présentations : créer la présentation |
| 15:30 | Pause café |
| 15:45 | Présentations : ajouter des graphiques, finaliser, paramètres |
| 16:30 | Où obtenir de l'aide, clôture |
| 17:00 | Fin |
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Jour 2, matin : la théorie

**Récapitulatif de la veille (08:30, vous).** Un quart d'heure, pas plus. Demandez à trois binômes de relire leur question d'Explorer. Rappelez le paquet de résultats et la portée. Confirmez que tout le monde est connecté : les retardataires de la veille se règlent avant 09:00.

**Ce que l'équipe FASTR présente.**
- Interprétation des visualisations : le cadre en six étapes (quel indicateur ; quel niveau et quelle période ; ce qui est comparé ; les valeurs ; ce qui ressort ; et alors), puis la différence entre un résultat (ce que le graphique montre) et un message clé (ce qu'il faut en conclure et pour qui).
- Techniques de prompting avec l'assistant IA : l'IA travaille dans le produit ouvert et ne lit que les données du Tchad ; quand l'IA invente ; deux façons de demander (améliorer ce que j'ai écrit, ou rédiger quelque chose de nouveau) ; donner les bons documents ; la bibliothèque de prompts ; relire la réponse.

**Ce que vous faites.** Pendant l'interprétation, proposez un graphique tchadien pour l'exercice en six étapes, de préférence tiré d'une question de la veille. Pendant le prompting, notez les prompts que les participants proposent : vous les réutiliserez l'après-midi.

**Messages à renforcer.**
1. On lit d'abord l'axe, la légende et la période, avant de dire ce que le graphique signifie. L'erreur la plus fréquente est de mal lire l'axe des ordonnées.
2. Le titre d'une diapositive est le message, pas le sujet : « La CPN1 baisse depuis mars dans deux provinces » plutôt que « Résultats CPN1 ».
3. L'IA ne devine pas les chiffres : elle lit le paquet de résultats du produit ouvert. Elle ne connaît ni internet ni les autres pays.
4. Une réponse qui sonne assurée n'est pas forcément correcte. Un chiffre sans source, un nom ou une date inconnus se vérifient en demandant « d'où vient cette information ? ».
5. Le participant reste responsable du texte qu'il met dans une diapositive. L'IA accélère, elle ne décide pas.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Jour 2, après-midi : visualisations et interprétation

Rappelez-vous que les modifications s'enregistrent en direct : démontrez sur des duplicatas, jamais sur le graphique d'un participant. La séquence est : construire à la main, puis avec l'IA ; interpréter à la main, puis avec l'IA. Si le temps presse, resserrez les passages IA plutôt que les passages manuels.

### 4. Créez votre première visualisation · ~25 min · pratique, individuel

**Le déroulé.** Les consignes sont sur la diapositive, trois visualisations. 1. Dans son dossier : **Nouveau → Nouvelle visualisation** → paquet épinglé, Toutes les données → Suivant. 2. Module **Utilisation des services** → métrique **Valeur de l'indicateur** → Suivant → préréglage **Valeurs des indicateurs dans le temps (mensuel)** → Insérer. 3. Onglet **Données** → Filtre (sous-ensemble) → Indicateur : cocher CPN 1 seulement ; titre « CPN 1, Tchad, par mois ». 4. **Affichage (désagréger) → Zone administrative 2**, puis Filtre → Zone administrative 2 : NDJAMENA et LOGONE OCCIDENTAL. 5. Page Produits → ⋮ → **Dupliquer** ; dans la copie, Filtre → Indicateur = Penta 3 et nouveau titre. 6. Troisième visualisation : module **Détection des perturbations** → **Détection bayésienne, observé vs attendu avec IC à 95 %** → niveau National → préréglage **Graphique des perturbations par indicateur** → Insérer → Filtre → Indicateur = CPN 1. Le graphique s'enregistre tout seul, l'indicateur **En direct** le confirme. Il n'y a pas de « Enregistrer sous » : Dupliquer garde un original, **Historique → Restaurer** ramène une version antérieure.

**Démontrer.** Faites le parcours une fois en entier, puis dans l'onglet **Données** : partez d'un indicateur au total national, désagrégez par province, puis filtrez sur deux provinces. Montrez le piège : désagréger par province et filtrer sur une seule, il ne reste rien à comparer.

**Formulez-le ainsi.** *« Filtrez ce dont vous n'avez pas besoin ; désagrégez ce que vous voulez comparer. Courbes pour les tendances, barres pour comparer. Et il n'y a pas de bouton Enregistrer : tout est déjà enregistré. »*

**À quoi ressemble un bon résultat.** Trois visualisations dans le dossier du participant, CPN 1 (deux provinces), Penta 3 et la perturbation CPN 1 avec sa bande à 95 %, et un participant capable d'expliquer la différence entre filtrer et désagréger.

**À surveiller.**
- Le préréglage **Tableau de bord** choisi par erreur (c'est un tableau coloré) et la question « où est la courbe ? » : il faut **Valeurs des indicateurs dans le temps (mensuel)**.
- La bande à 95 % prise pour une erreur : elle est normale et plus large pour les petites zones.
- Une visualisation créée hors du dossier du participant : **Déplacer dans**.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 5. Construire une visualisation avec l'assistant IA · ~15 min · pratique, individuel

**Le déroulé.** Les consignes sont sur la diapositive : créer une visualisation dans son dossier (Utilisation des services → Valeur de l'indicateur → Suivant → **Personnalisé** → Insérer), ouvrir le bouton IA, demander « Montre-moi les accouchements dans la FOSA par mois sur les 24 derniers mois, au niveau national, en courbe », vérifier l'indicateur, la période et le type, puis « Compare NDJAMENA et OUADDAÏ sur le même graphique », demander un titre, corriger dans la conversation.

**Démontrer.** Posez d'abord la question à l'IA depuis la page Produits : elle ne peut pas dessiner là, elle liste les produits à ouvrir. Ouvrez ensuite une visualisation vierge, saisissez une demande, montrez les étapes que l'IA liste et le graphique qui change. Montrez **Historique → Restaurer** une fois.

**Formulez-le ainsi.** *« L'IA modifie le produit que vous avez ouvert, en direct. Avant de passer à la suite, vérifiez qu'elle a pris l'indicateur, la période et la version des données que vous avez demandés. Elle devine souvent. »*

**À quoi ressemble un bon résultat.** Un graphique conforme à la demande sur l'indicateur, la période, le type de graphique et la version des données.

**À surveiller.**
- Faire confiance à la première réponse, surtout sur les données ajustées ou brutes.
- Demander depuis la visualisation d'un collègue : l'IA la modifiera. Partez d'une visualisation vierge ou d'un duplicata.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 6. Écrire une interprétation pour un graphique · ~20 min · individuel

**Le déroulé.** Pour leur graphique CPN 1 par province, les participants rédigent une interprétation en trois parties : un titre-message de 12 mots maximum, un « ce que je vois » de deux phrases avec des chiffres lus sur le graphique, un « ce que cela signifie » d'une phrase qui nomme qui doit agir. Le voisin vérifie chaque chiffre. *Comment lire une visualisation FASTR* sert de référence.

**Démontrer.** Montrez un titre faible et un titre fort côte à côte, « Résultats de couverture » contre un titre qui énonce le constat.

**Formulez-le ainsi.** *« Le titre est votre conclusion, pas votre sujet. "Ce que vous voyez" est factuel. "Ce que cela signifie" doit nommer quelqu'un ou une prochaine étape : le district, le programme, la DPSIS. »*

**À quoi ressemble un bon résultat.** Un titre qui porte le message et un « et alors » qui pointe vers une action précise.

**À surveiller.** Des titres purement descriptifs, des faits mélangés à l'interprétation, des « et alors » qui ne nomment personne.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 7. Laisser l'IA rédiger l'interprétation · ~15 min · pratique, individuel

**Le déroulé.** Dans la même visualisation, demander à l'IA « Rédige une interprétation en trois parties, titre, ce que l'on voit, ce que cela signifie, pour un directeur de programme », vérifier chaque chiffre contre le graphique, demander « Plus simple, 60 mots », ajouter le contexte local que l'IA ne connaît pas (rupture de stock, grève, campagne, zone inaccessible), puis comparer avec la version écrite à la main.

**Démontrer.** Générez une interprétation à l'écran et vérifiez une seule affirmation à voix haute, pour montrer que « ça sonne juste » n'est pas le test.

**Formulez-le ainsi.** *« L'IA décrit le graphique, mais elle ne sait pas ce qui s'est passé dans votre district. Vérifiez chaque chiffre, et c'est vous qui assumez l'action recommandée. »*

**À quoi ressemble un bon résultat.** Une interprétation vérifiée affirmation par affirmation, avec le contexte local ajouté.

**À surveiller.** Un texte accepté parce qu'il sonne assuré.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Jour 2, après-midi : présentations

### 8. Créez votre première présentation · ~20 min · pratique, individuel

**Le déroulé.** **Nouveau → Nouvelle présentation** dans son dossier, nom « Revue des services, <province> », paquet épinglé et Toutes les données, puis le choix du thème et **Appliquer le thème**. **Ajouter une diapositive → Contenu**, et sur la couverture le titre « Suivi des services de santé, Tchad, novembre 2026 » avec le nom du participant.

**Démontrer.** La boîte de dialogue, le champ **Dossier**, le sélecteur de thème, et les types de diapositives : seule **Contenu** accueille un graphique et du texte. Puis une visite de l'éditeur : la liste des diapositives à gauche, la diapositive au milieu, le panneau IA à droite, la barre du haut (Fichier, Présentation, Insérer, Présenter, Historique, En direct).

**Formulez-le ainsi.** *« Placez la présentation dans votre dossier et choisissez Contenu : une diapositive Couverture ou Section n'a nulle part où mettre votre graphique. Tout s'enregistre pendant que vous travaillez, et vos collègues le voient aussi. »*

**À quoi ressemble un bon résultat.** Une présentation nommée dans le dossier du participant, une couverture, une diapositive de contenu vide.

**À surveiller.** Mauvais dossier (**Fichier → Nom et dossier…**) ; le sélecteur de thème pris pour un obstacle : c'est un seul clic.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 9. Ajouter une visualisation (manuellement) · ~15 min · pratique, individuel

**Le déroulé.** Cliquer dans le bloc vide, passer son type de **Texte** à **Visualisation**, puis **Insérer une visualisation → Visualisation existante…**, choisir « CPN 1 par province », **Insérer une copie**. Ajouter un bloc de texte à droite avec **Mise en page → Ajouter**, y coller les trois blocs d'interprétation, et donner à la diapositive le titre-message, pas « CPN 1 ».

**Démontrer.** Le schéma complet une fois, en nommant chaque geste, séparateur compris.

**Formulez-le ainsi.** *« Vous ne construisez pas de graphique ici. Vous choisissez celui que vous avez déjà enregistré, et la diapositive en reçoit une copie. Deux blocs, graphique et message : c'est le modèle. »*

**À quoi ressemble un bon résultat.** Une diapositive avec le graphique du participant, son interprétation à côté, et un titre qui énonce le constat.

**À surveiller.**
- Cliquer sur la vignette au lieu du bloc : la barre d'outils n'apparaît que quand un bloc est sélectionné.
- Un graphique absent du sélecteur : il n'est pas enregistré comme visualisation, ou il est dans un dossier que le participant ne voit pas.
- Attendre que la copie se mette à jour : **Remplacer par une visualisation existante** la rafraîchit.

### 10. Ajouter une visualisation (avec l'assistant IA) · ~10 min · pratique, individuel

**Le déroulé.** La présentation ouverte, demander au panneau IA « Ajoute une diapositive de contenu avec ma visualisation Penta 3 et deux puces d'interprétation », vérifier le graphique et les chiffres, puis « Remplace la deuxième puce par une recommandation pour le programme de vaccination », et glisser la vignette après la diapositive CPN 1.

**Formulez-le ainsi.** *« Nommez le graphique : une demande vague renvoie un graphique proche mais faux. Depuis la page Produits, l'IA ne peut rien ajouter. »*

**À quoi ressemble un bon résultat.** Deux diapositives, la seconde ajoutée par l'IA et vérifiée.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 11. Éditer et finaliser vos diapositives · ~20 min · pratique, individuel

**Le déroulé.** Sur chaque diapositive : relire les chiffres contre le graphique ; corriger un graphique à l'étroit avec **Mise en page → Modifier la visualisation** ou le séparateur ; ajouter en-tête, date et pied de page par le menu **Insérer** ; supprimer les diapositives vides et réordonner en glissant les vignettes ; puis **Présenter** les trois diapositives en plein écran. *Formater le texte de votre rapport* couvre la mise en forme du texte : chiffre clé en gras, trois puces, un sous-titre.

**Formulez-le ainsi.** *« Les petites corrections, vous les faites ici ; les réécritures vont à l'IA. Le critère : pourriez-vous montrer cette diapositive au directeur sans vous excuser ? »*

**À surveiller.** Un graphique à l'étroit : **Mise en page → Modifier la visualisation**, pas en rétrécissant le texte. Les flèches de la barre d'outils ou Ctrl/Cmd+Z annulent ; **Historique** restaure une version entière.

### 12. Paramètres de la présentation et rapports · ~15 min · démo, puis pratique

**Le déroulé.** Menu **Présentation → Logos** (logo du ministère s'il est dans Ressources) et **Pied de page** « DPSIS · Tchad · novembre 2026 » avec numéros de page ; **Fichier → Nom et dossier…** pour vérifier le dossier ; **Fichier → Gérer l'accès…** avec l'accès général « Tout le monde dans l'instance peut consulter » ; **Fichier → Télécharger…** et ouvrir le fichier. Puis, en démo seulement, l'éditeur de rapport (**Nouveau → Nouveau rapport**, menus Fichier, Widgets, Figures, Page), pour que les participants sachent qu'il existe.

**Formulez-le ainsi.** *« Le logo du ministère et le pied de page se règlent une fois dans Présentation. Télécharger produit le fichier à envoyer ; Gérer l'accès décide qui voit la présentation sur la plateforme. »*

**À quoi ressemble un bon résultat.** Deux diapositives finies, avec le logo et le pied de page.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Questions fréquentes

> **Q : Ai-je besoin de mon mot de passe DHIS2 pour me connecter ?**
> R : Non. FASTR a ses propres comptes. Les identifiants DHIS2 ne servent qu'une fois, à un administrateur, pour connecter l'instance.

> **Q : Mon travail est-il privé ?**
> R : Tout ce qui est sur la page Produits est visible par l'équipe ; **Gérer l'accès** restreint un produit ou un dossier.

> **Q : Puis-je l'utiliser sur mon téléphone ?**
> R : Cela fonctionne, mais c'est conçu pour un ordinateur.

> **Q : Où sont passés les projets et les tableaux de bord ?**
> R : Depuis la version 2, une seule page Produits avec des dossiers remplace les projets ; Explorer et les visualisations enregistrées remplacent les tableaux de bord.

> **Q : Mon voisin et moi n'avons pas les mêmes chiffres.**
> R : Quatre réglages peuvent différer : paquet de résultats, portée, niveau, période. Comparez-les un par un.

## Plan de secours

> **Plateforme indisponible.** Parcourez l'écran avec les captures d'écran des documents participants, et faites travailler les binômes sur papier : la question à transformer en graphique, ou l'interprétation en trois parties.

> **Comptes non approuvés.** L'équipe FASTR approuve sur la page **Utilisateurs** pendant la pause. Entre-temps, le participant travaille en binôme avec un voisin connecté.

## Où obtenir de l'aide

- **Amal Tucker Brown**, spécialiste des résultats, équipe FASTR : résultats, interprétation et usage.
- **Claire Boulange**, experte technique FASTR : assistance technique et formation sur la plateforme.
- Support de la plateforme : fastr@usefuldata.com.au
- Bouton **Aide** de la plateforme : Visites guidées, Demander de l'aide, Envoyer un commentaire, Documentation (https://fastr-analytics.org/fr/)
