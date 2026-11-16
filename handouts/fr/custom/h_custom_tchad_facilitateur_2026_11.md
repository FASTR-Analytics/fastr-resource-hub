---
marp: true
theme: fastr-handout
paginate: true
class: facilitator
footer: "FASTR · Tchad · Novembre 2026 · Facilitateur"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

# Guide du facilitateur DPSIS — Atelier FASTR Tchad

<p class="meta-line"><strong>Guide du facilitateur</strong> · <strong>2 jours</strong> · <strong>18–19 novembre 2026</strong> · <strong>Centre Jardi de Bakara</strong></p>

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
- ☐ Documents participants imprimés (liste page suivante)

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Les deux journées en bref

Les matinées sont consacrées à la théorie, présentée par l'équipe FASTR avec votre appui. Les après-midis sont consacrés à la pratique sur la plateforme : vous conduisez la salle, l'équipe FASTR appuie les tables. Les horaires des séquences sont indicatifs ; les pauses et la fin de journée sont fixes.

| Heure | Mercredi 18 novembre | Jeudi 19 novembre |
|---|---|---|
| 08:30 | | Récapitulatif de la veille (plénière, vous) |
| 09:00 | Ouverture, ordre du jour et objectifs, puis Pourquoi FASTR : l'analyse à cycle rapide, la valeur ajoutée par rapport au DHIS2 | Interprétation des visualisations : le cadre en six étapes, résultat et message clé |
| 10:30 | Pause café | Pause café |
| 11:00 | Comment FASTR analyse vos données : qualité, ajustements, perturbations, couverture | Techniques de prompting avec l'assistant IA |
| 12:30 | Déjeuner | Déjeuner |
| 14:00 | Prise en main : démo de la plateforme, connexion, dossier | Visualisations et interprétation : à la main, puis avec l'IA |
| 15:00 | Explorer : regarder avant de construire (en binôme) | Présentations : créer la présentation |
| 15:30 | Pause café | Pause café |
| 15:45 | Explorer (suite) : tour de salle des binômes | Présentations : ajouter des graphiques, finaliser, paramètres |
| 16:30 | Synthèse de la journée | Où obtenir de l'aide, clôture |
| 17:00 | Fin | Fin |

**Documents participants à imprimer.** Un jeu par participant des documents cités en italique dans chaque activité : trois pour le jour 1 (Prise en main), onze pour le jour 2 (Visualisations et interprétation, Présentations).

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Jour 1, matin : la théorie

**Ce que l'équipe FASTR présente.**
- Pourquoi FASTR : ce qu'est FASTR, l'analyse à cycle rapide (des résultats mis à jour chaque mois, pas une enquête tous les cinq ans), et ce que la plateforme ajoute au DHIS2.
- Comment FASTR analyse vos données : six modules calculés ensemble dans un **paquet de résultats** : Indicator values (valeurs des indicateurs), Data quality assessment (évaluation de la qualité des données), Data quality adjustments (ajustements de la qualité des données), Disruption detection (détection des perturbations), Coverage denominators (dénominateurs de couverture) et Coverage estimates (estimations de couverture).
- Évaluation de la qualité des données : complétude, valeurs aberrantes, cohérence interne, puis un score global.
- Ajustements de la qualité des données : valeurs aberrantes remplacées, mois manquants comblés, ce qui donne quatre versions des données (non ajustées, valeurs aberrantes ajustées, complétude ajustée, les deux).
- Détection des perturbations, version bayésienne : deux questions par établissement et par mois (a-t-il rapporté ? quand il rapporte, combien délivre-t-il ?), une bande de crédibilité à 95 % autour du volume attendu, et la distinction entre écart de rapportage et écart de service.
- Couverture : d'abord les dénominateurs, puis les estimations ; sur le graphique, gris pour les données de routine, noir pour l'enquête, rouge pour la projection.

**Ce que vous faites.** Vous ouvrez la journée avec l'ordre du jour et les objectifs. Pendant les présentations, vous reliez chaque notion à ce que les participants connaissent : les formulaires mensuels, les rapports qui arrivent en retard, les campagnes qui gonflent un mois. Vous notez les questions qui méritent une réponse sur la plateforme l'après-midi.

**Messages à renforcer.**
1. FASTR ne remplace pas le DHIS2 : il lit les données du DHIS2 et ajoute l'analyse, les graphiques et le reporting par-dessus.
2. Les résultats ne sont pas calculés à la demande : ils sont dans un paquet de résultats, généré après chaque import, et tout le monde lit le même paquet.
3. Une valeur aberrante n'est pas forcément une erreur : une campagne de vaccination en produit. L'ajustement la remplace dans une version des données, l'original reste disponible.
4. Un total national qui baisse peut venir d'établissements silencieux ou d'établissements qui délivrent moins. Seul le second cas est une perturbation de service ; le module les sépare.
5. Une plage rouge sur le graphique des perturbations est une vraie baisse parmi les établissements qui ont rapporté. Un seul mois rouge mérite un regard ; trois mois d'affilée méritent une action.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Jour 1, après-midi : prise en main

C'est vous qui conduisez la salle. L'équipe FASTR circule entre les tables. Commencez par une démo de dix minutes de l'écran d'accueil avant que quiconque ne touche un clavier : la page **Produits** et ses dossiers, la navigation latérale (Produits, Explorer, Résultats, Portées, Données, Ressources, Utilisateurs), puis d'où viennent les chiffres : un paquet de résultats est épinglé sur la page Résultats, chaque produit lit ce paquet à travers une portée, et la portée **Toutes les données** couvre le pays entier. Dites que Données, Ressources et Utilisateurs sont réservés aux administrateurs.

### 1. Connexion à la plateforme · ~20 min · pratique, individuel

**Le déroulé.** Les participants ouvrent https://tchad.fastr-analytics.org/, cliquent sur **S'inscrire** s'ils n'ont pas encore de compte, saisissent leur e-mail et un mot de passe, puis attendent que l'administrateur approuve le compte sur la page **Utilisateurs**. Ceux qui ont déjà un compte se connectent directement. Chacun se repère ensuite sur la page Produits.

**Démontrer.** Couvert par la démo de l'écran d'accueil. Distribuez ensuite *Connexion à la plateforme* et laissez-les travailler.

**Formulez-le ainsi.** *« Vous n'avez pas besoin de votre mot de passe DHIS2 : FASTR a ses propres comptes. Si vous vous inscrivez aujourd'hui et que vous voyez une liste vide après connexion, dites-le-moi : votre compte doit être approuvé, et c'est notre travail, pas le vôtre. »*

**À quoi ressemble un bon résultat.** Chaque participant sur la page Produits, la navigation latérale dépliée, capable d'ouvrir le dossier pays et de revenir.

**À surveiller.**
- Les e-mails de vérification qui arrivent dans les spams.
- Une liste vide ou un message de compte non approuvé : signalez-le à l'équipe FASTR, qui approuve sur la page **Utilisateurs**. Pendant ce temps, mettez le participant en binôme avec un voisin connecté.
- La navigation latérale repliée qui déroute : montrez la flèche en bas de la barre.

### 2. Créer un dossier pour votre travail · ~10 min · pratique, individuel

**Le déroulé.** Chaque participant ouvre le dossier de l'atelier que vous indiquez, puis **Nouveau → Nouveau dossier**, saisit son prénom et son nom, choisit une couleur, **Sauvegarder**, et ouvre le menu ⋮ du dossier pour en lire les options sans rien changer.

**Démontrer.** Créez un dossier à l'écran. Montrez le menu ⋮ sur sa ligne (Déplacer dans, Renommer, Définir l'accès, Supprimer) et le champ **Dossier** de la boîte de dialogue Nouvelle présentation, pour qu'ils voient à quoi le dossier servira demain.

**Formulez-le ainsi.** *« Utilisez votre propre nom. La page Produits est partagée par tout le pays : un dossier par personne, c'est ce qui la garde lisible après une semaine. Demain, chaque graphique et chaque présentation ira dans votre dossier. »*

**À quoi ressemble un bon résultat.** Un dossier par participant, à son nom, vide, dans le dossier pays.

**À surveiller.**
- **Nouveau dossier** absent du menu : le compte n'a pas le rôle nécessaire. Signalez-le à l'équipe FASTR.
- Un dossier créé au premier niveau au lieu du dossier pays : **Déplacer dans**.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Jour 1, après-midi : Explorer

Avant de lancer l'activité, dites une phrase sur Explorer : on regarde avant de construire. Rien n'y est enregistré et rien ne peut casser.

### 3. Jeter un premier regard avec Explorer · ~60 min avec la pause · pratique, en binôme

**Le déroulé.** Les consignes sont sur la diapositive, quatre lectures et une question. 1. **Tableau** : niveau Province (AA2), période 12 derniers mois, indicateur CPN 1 ; noter le total national et la province la plus basse. 2. **Dans le temps** : CPN 1 au niveau national, pas Mois ; noter le mois le plus haut des 24 derniers mois. 3. Module Coverage estimates → Coverage over time ; noter la dernière couverture projetée de Penta 3 (courbe rouge). 4. **Carte** : Accouchement dans la FOSA, Province, 12 derniers mois ; quelle province est la plus claire (à sauter si la carte ne s'affiche pas). 5. Comparer les quatre réponses avec le binôme voisin et écrire une question à transformer en graphique demain. Après la pause, tour de salle : chaque binôme lit ses chiffres et sa question.

**Démontrer.** Nommez à l'écran les contrôles du haut : le paquet, la portée, le module et la métrique, le niveau, les indicateurs et la période (12 derniers mois, Dernier trimestre, Dernière année, Tout). Passez une fois de Tableau à Dans le temps puis à Carte. Montrez **Rechercher une colonne** et **Télécharger**. Ouvrez le menu du module pour montrer **Résultats principaux** et **Analyses complémentaires**.

**Formulez-le ainsi.** *« Les noms des modules sont en anglais dans l'interface française : c'est un problème d'affichage connu, pas une erreur de votre part. Quand une vue répond à votre question, c'est le graphique que vous construirez demain. Notez la question. »*

**À quoi ressemble un bon résultat.** Des binômes d'accord sur les mêmes trois chiffres, ou capables de dire quel filtre les a fait différer, et une question par binôme écrite sur papier.

**À surveiller.**
- Des chiffres qui diffèrent entre voisins : paquet, portée, niveau ou période. Faites-leur trouver lequel.
- « La carte est cassée » : pas de fichiers de limites administratives sur l'instance. Dites-le dès le départ si c'est le cas.
- Des binômes qui cherchent Penta 3 dans le module Indicator values : la couverture projetée est dans Coverage estimates.
- Des participants qui attendent un bouton Enregistrer dans Explorer : il n'y en a pas, Explorer sert à regarder.

## Pour conclure la journée

Vérifiez les trois points de passage avant de laisser partir la salle : connecté, un dossier à son nom, une question tirée d'Explorer. Un participant qui n'en est pas là sera bloqué demain. Relevez les questions des binômes : elles serviront d'exemples pour l'après-midi du jour 2.

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

### 4. Créez votre première visualisation · ~20 min · pratique, individuel

**Le déroulé.** Les consignes sont sur la diapositive. Dans son dossier : **Nouveau → Nouvelle visualisation**, paquet épinglé, Toutes les données ; Indicator values → Indicator value → **Personnalisé** → **Série temporelle** → Insérer ; onglet **Données**, Filtre → Indicateur = CPN 1, période 24 derniers mois, titre « CPN 1, Tchad, 24 derniers mois » ; **Affichage (désagréger) → Province (AA2)**, puis Filtre → garder NDJAMENA et LOGONE OCCIDENTAL ; enfin **Dupliquer** sur la page Produits et remplacer CPN 1 par Penta 3 dans la copie. Le graphique s'enregistre tout seul, l'indicateur **En direct** le confirme. Il n'y a pas de « Enregistrer sous » : Dupliquer garde un original, **Historique → Restaurer** ramène une version antérieure.

**Démontrer.** Faites le parcours une fois en entier, puis dans l'onglet **Données** : partez d'un indicateur au total national, désagrégez par province, puis filtrez sur deux provinces. Montrez le piège : désagréger par province et filtrer sur une seule, il ne reste rien à comparer.

**Formulez-le ainsi.** *« Filtrez ce dont vous n'avez pas besoin ; désagrégez ce que vous voulez comparer. Courbes pour les tendances, barres pour comparer. Et il n'y a pas de bouton Enregistrer : tout est déjà enregistré. »*

**À quoi ressemble un bon résultat.** Deux visualisations dans le dossier du participant, CPN 1 (deux provinces) et Penta 3, et un participant capable d'expliquer la différence entre filtrer et désagréger.

**À surveiller.**
- Le préréglage Indicator value choisi tel quel (un tableau) et la question « où est la courbe ? » : il faut Personnalisé → Série temporelle.
- Une visualisation créée hors du dossier du participant : **Déplacer dans**.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 5. Construire une visualisation avec l'assistant IA · ~15 min · pratique, individuel

**Le déroulé.** Les consignes sont sur la diapositive : créer une visualisation vierge dans son dossier, ouvrir le bouton IA, demander « Montre-moi les accouchements dans la FOSA par mois sur les 24 derniers mois, au niveau national, en courbe », vérifier l'indicateur, la période et le type, puis « Compare NDJAMENA et OUADDAÏ sur le même graphique », demander un titre, corriger dans la conversation.

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

> **Q : Pourquoi les noms des modules sont-ils en anglais ?**
> R : Un problème d'affichage connu dans l'interface française. Les résultats, eux, sont bien ceux du Tchad.

> **Q : Mon voisin et moi n'avons pas les mêmes chiffres.**
> R : Quatre réglages peuvent différer : paquet de résultats, portée, niveau, période. Comparez-les un par un.

## Plan de secours

> **Plateforme indisponible.** Parcourez l'écran avec les captures d'écran des documents participants, et faites travailler les binômes sur papier : la question à transformer en graphique, ou l'interprétation en trois parties.

> **Comptes non approuvés.** L'équipe FASTR approuve sur la page **Utilisateurs** pendant la pause. Entre-temps, le participant travaille en binôme avec un voisin connecté.

## Où obtenir de l'aide

- **Amal Tucker Brown**, spécialiste des résultats, équipe FASTR : résultats, interprétation et usage.
- **Claire Boulange**, experte technique FASTR : assistance technique et formation sur la plateforme.
- Support de la plateforme : fastr@usefuldata.com.au
- Bouton **Aide** de la plateforme : Visites guidées, Demander de l'aide, Envoyer un commentaire, Documentation (https://fastr-analytics.org/)
