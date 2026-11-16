---
marp: true
theme: fastr-handout
paginate: true
class: facilitator
footer: "FASTR · Tchad · Jour 3 · Facilitateur"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

# Guide du facilitateur DPSIS — Atelier FASTR Tchad, Jour 3

<p class="meta-line"><strong>Guide du facilitateur</strong> · <strong>Jour 3</strong> · <strong>mercredi 18 novembre 2026</strong> · <strong>Centre Jardi de Bakara</strong></p>

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
- ☐ Documents participants imprimés : Connexion à la plateforme, Créer un dossier pour votre travail, Jeter un premier regard avec Explorer

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## La journée en bref

Les matinées sont consacrées à la théorie, présentée par l'équipe FASTR avec votre appui. Les après-midis sont consacrés à la pratique sur la plateforme : vous conduisez la salle, l'équipe FASTR appuie les tables. Les horaires des séquences sont indicatifs ; les pauses et la fin de journée sont fixes.

| Heure | Mercredi 18 novembre |
|---|---|
| 09:00 | Ouverture, ordre du jour et objectifs, puis Pourquoi FASTR : l'analyse à cycle rapide, la valeur ajoutée par rapport au DHIS2 |
| 10:30 | Pause café |
| 11:00 | Comment FASTR analyse vos données : qualité, ajustements, perturbations, couverture |
| 12:30 | Déjeuner |
| 14:00 | Prise en main : démo de la plateforme, connexion, dossier |
| 15:00 | Explorer : regarder avant de construire (en binôme) |
| 15:30 | Pause café |
| 15:45 | Explorer (suite) : tour de salle des binômes |
| 16:30 | Synthèse de la journée |
| 17:00 | Fin |
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Jour 1, matin : la théorie

**Ce que l'équipe FASTR présente.**
- Pourquoi FASTR : ce qu'est FASTR, l'analyse à cycle rapide (des résultats mis à jour chaque mois, pas une enquête tous les cinq ans), et ce que la plateforme ajoute au DHIS2.
- Comment FASTR analyse vos données : six modules calculés ensemble dans un **paquet de résultats**, tels qu'ils s'affichent dans la plateforme : Utilisation des services (les volumes et les indicateurs calculés), Évaluation de la qualité des données, Ajustements de la qualité des données, Détection des perturbations, Dénominateurs de couverture et Estimations de couverture.
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

C'est vous qui conduisez la salle. L'équipe FASTR circule entre les tables. Commencez par une démo de dix minutes de l'écran d'accueil avant que quiconque ne touche un clavier. Partez de l'analogie du Google Drive partagé : la page **Produits** est le Drive de tout le pays, les produits (visualisations, présentations, rapports) sont les fichiers, les dossiers rangent les fichiers, et **Gérer l'accès** est le réglage de partage d'un fichier ou d'un dossier. Une différence avec un Drive : chaque fichier lit un paquet de résultats et une portée, indiqués dans sa ligne. Montrez ensuite la navigation latérale (Produits, Explorer, Résultats, Portées, Données, Ressources, Utilisateurs), puis d'où viennent les chiffres : un paquet de résultats est épinglé sur la page Résultats, chaque produit lit ce paquet à travers une portée, et la portée **Toutes les données** couvre le pays entier. Dites que Données, Ressources et Utilisateurs sont réservés aux administrateurs.

### 1. Connexion à la plateforme · ~20 min · pratique, individuel

**Le déroulé.** Les participants ouvrent https://tchad.fastr-analytics.org/, cliquent sur **S'inscrire** s'ils n'ont pas encore de compte, saisissent leur e-mail et un mot de passe, puis attendent que l'administrateur approuve le compte sur la page **Utilisateurs**. Ceux qui ont déjà un compte se connectent directement. Chacun se repère ensuite sur la page Produits.

**Démontrer.** Couvert par la démo de l'écran d'accueil. Distribuez ensuite *Connexion à la plateforme* et laissez-les travailler.

**Formulez-le ainsi.** *« Vous n'avez pas besoin de votre mot de passe DHIS2 : FASTR a ses propres comptes. Si vous vous inscrivez aujourd'hui et que vous voyez une liste vide après connexion, dites-le-moi : votre compte doit être approuvé, et c'est notre travail, pas le vôtre. »*

**À quoi ressemble un bon résultat.** Chaque participant sur la page Produits, la navigation latérale dépliée, capable d'ouvrir le dossier pays et de revenir.

**À surveiller.**
- Les e-mails de vérification qui arrivent dans les spams.
- Une liste vide ou un message de compte non approuvé : signalez-le à l'équipe FASTR, qui approuve sur la page **Utilisateurs**. Pendant ce temps, mettez le participant en binôme avec un voisin connecté.
- La navigation latérale repliée qui déroute : montrez la flèche en bas de la barre.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

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

**Le déroulé.** Les consignes sont sur la diapositive, cinq lectures et une question. 1. Ouvrir **Explorer** et vérifier en haut HMIS, le paquet épinglé et la portée Toutes les données ; à gauche, commencer par le module **Utilisation des services** et la métrique **Volumes de services** (l'ouverture par défaut). 2. Vue **Tableau** : niveau Province (AA2), période 12 derniers mois, trier sur la colonne CPN 1 ; noter le total National et la province la plus basse. 3. Vue **Dans le temps** : CPN 1, National, pas Mois ; noter le mois le plus haut des 24 derniers mois. 4. Changer de module : **Estimations de couverture** → métrique **Couverture dans le temps** ; sur le panneau Penta 3, noter la dernière valeur de la courbe rouge. 5. Changer de module : **Détection des perturbations** → **Services observés et attendus**, National ; sur le panneau CPN 1, compter les mois en rouge sur les 12 derniers mois. 6. Revenir au module Utilisation des services, vue **Carte** : Accouchement dans la FOSA, Province, 12 derniers mois ; quelle province est la plus claire (à sauter si la carte ne s'affiche pas). 7. Comparer les réponses avec le binôme voisin et écrire une question à transformer en graphique demain. Après la pause, tour de salle : chaque binôme lit ses chiffres et sa question.

**Démontrer.** Nommez à l'écran les contrôles du haut : le paquet, la portée, le module (**Utilisation des services**) et la métrique (**Volumes de services**), le niveau, les indicateurs et la période (12 derniers mois, Dernier trimestre, Dernière année, Tout). Passez une fois de Tableau à Dans le temps puis à Carte. Montrez **Télécharger**. Ouvrez le menu du module pour montrer **Résultats principaux** et **Analyses complémentaires**, puis faites une fois le changement vers Estimations de couverture et vers Détection des perturbations.

**Formulez-le ainsi.** *« Rien ici n'est enregistré et rien ne peut casser. Quand une vue répond à votre question, c'est le graphique que vous construirez demain. Notez la question. »*

**À quoi ressemble un bon résultat.** Des binômes d'accord sur les mêmes réponses, ou capables de dire quel filtre les a fait différer, et une question par binôme écrite sur papier.

**À surveiller.**
- Des chiffres qui diffèrent entre voisins : paquet, portée, niveau ou période. Faites-leur trouver lequel.
- « La carte est cassée » : pas de fichiers de limites administratives sur l'instance. Dites-le dès le départ si c'est le cas.
- Des binômes qui cherchent la couverture de Penta 3 dans Utilisation des services : elle est dans Estimations de couverture → Couverture dans le temps.
- Des participants qui attendent un bouton Enregistrer dans Explorer : il n'y en a pas, Explorer sert à regarder.

## Pour conclure la journée

Vérifiez les trois points de passage avant de laisser partir la salle : connecté, un dossier à son nom, une question tirée d'Explorer. Un participant qui n'en est pas là sera bloqué demain. Relevez les questions des binômes : elles serviront d'exemples pour l'après-midi du jour 2.

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
- Bouton **Aide** de la plateforme : Visites guidées, Demander de l'aide, Envoyer un commentaire, Documentation (https://fastr-analytics.org/)
