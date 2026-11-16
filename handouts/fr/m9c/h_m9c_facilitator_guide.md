---
marp: true
theme: fastr-handout
paginate: true
class: facilitator
footer: "FASTR · Visualisations & Interprétation · Facilitateur"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

# Guide du facilitateur — Visualisations & Interprétation

<p class="meta-line"><strong>Guide du facilitateur</strong> · <strong>Visualisations & Interprétation</strong> · <strong>6 activités · ~100 min</strong></p>

## Objectif

Ce module apprend aux participants à lire un graphique et à dire ce qu'il signifie — d'abord à la main, puis avec l'IA, pour finir par une vraie activité d'application sur leurs propres données pays. Il associe délibérément une voie « faites-le vous-même » à une voie « l'IA le fait, vous vérifiez », pour construire des graphiques comme pour rédiger des interprétations, afin que les participants fassent eux-mêmes toute la boucle avant de laisser l'IA s'en charger.

À la fin, un participant devrait pouvoir : lire n'importe quel graphique FASTR avec un cadre cohérent ; construire un graphique et choisir le bon type ; rédiger une interprétation en trois parties ; produire les mêmes sorties avec l'IA et les vérifier ; et identifier une vraie perturbation dans des données réelles.

## La session en bref

| # | Activité | Durée | Format |
|---|----------|-------|--------|
| 1 | Comment lire une visualisation FASTR | ~10 min | Individuel, puis binômes |
| 2 | Créez votre première visualisation | ~15 min | Pratique, individuel |
| 3 | Rédiger une interprétation pour un graphique | ~20 min | Individuel |
| 4 | Construire une visualisation avec l'IA | ~15 min | Pratique, individuel |
| 5 | Laisser l'IA rédiger l'interprétation | ~15 min | Pratique, individuel |
| 6 | Application — repérer une perturbation | ~25 min | Équipes pays |

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Animer la session

**Préparation.** Ayez une visualisation enregistrée et une présentation prêtes dans un dossier de démo pour montrer des graphiques immédiatement. Confirmez que les participants ont leur propre dossier (Prise en main) et que l'instance a un paquet de résultats épinglé contenant le module Détection des perturbations : l'activité 6 utilise des données pays réelles. Rappelez-vous que les modifications s'enregistrent en direct : démontrez sur des duplicatas, jamais sur le graphique d'un participant.

**Comment démontrer.** Chaque tâche sur la plateforme doit être démontrée d'abord, puis pratiquée à partir du document, qui réexplique ce que vous avez montré. La démo détaillée du constructeur de graphiques (activité 2) est celle à répéter — elle porte la distinction filtrer/désagréger dont dépend le reste du module.

**Regroupement.** Les activités 1 à 5 sont individuelles, avec partage en binômes. L'activité 6 est la synthèse en équipe pays — asseyez les équipes ensemble pour elle.

**Rythme.** L'activité 1 est la référence sur laquelle le reste s'appuie ; ne la sautez pas. Si le temps presse, resserrez les activités 4 et 5 (le passage IA) plutôt que le passage manuel (2 et 3) — les participants doivent se forger leur propre jugement avant de voir l'IA travailler.

**Le message à faire passer.** L'IA est rapide, mais le participant est responsable. Renforcez la vérification chaque fois que l'IA apparaît.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Les activités

### 1. Comment lire une visualisation FASTR · ~10 min · individuel → binômes

**Le déroulé.** Les participants apprennent un cadre en six étapes pour lire n'importe quel graphique — indicateur, niveau/période, comparaison, valeurs, ce qui ressort, et alors — voient comment choisir le type de graphique, et s'entraînent sur une présentation existante avec un coéquipier.

**Démontrer.** Parcourez les six étapes une fois sur un vrai graphique, en nommant chaque étape à voix haute, avant que les participants n'essaient.

**À quoi ressemble un bon résultat.** Un participant qui vérifie la légende, les axes et les notes de bas de page *avant* d'interpréter, et peut énoncer le « et alors » d'un graphique en une phrase.

**À surveiller.**
- Mal lire l'axe Y — l'erreur la plus fréquente. Faites lire l'axe à voix haute d'abord.
- Sauter à « ce que cela signifie » avant d'établir « ce que cela montre ».

### 2. Créez votre première visualisation · ~15 min · pratique

**Le déroulé.** Les participants construisent un graphique avec le constructeur intégré : **Nouveau → Nouvelle visualisation** sur la page Produits, gardez le paquet et la portée, puis la boîte de dialogue **Métrique → Préréglages → Configurer** (*Utilisation des services → Valeur de l'indicateur → Personnalisé → Série temporelle → Insérer*). Le document explique ensuite **filtrer vs désagréger** et les modes d'affichage (Lignes / Grille / Rangées / Colonnes / Graphiques différents), et enseigne **dupliquer avant de modifier**, puisqu'il n'y a pas d'enregistrement sous un autre nom : les modifications s'enregistrent en direct.

**Démontrer (~3 min, en direct).** Ouvrez un duplicata d'une viz enregistrée et utilisez l'onglet **Données** à gauche :
1. Partez d'un seul indicateur, total national ; dites en mots ce qu'il montre.
2. Sous **Affichage (désagréger)**, décomposez **par district**, puis passez de **Lignes** à **Rangées** puis **Grille** pour montrer les *mêmes données sous des formes différentes*.
3. Sous **Filtre (sous-ensemble)**, cochez seulement deux districts : le graphique n'affiche que ceux-là. Nommez-le : *« je choisis ce que j'affiche »*.
4. **Montrez le piège :** désagréger par district *et* filtrer sur un seul district → plus rien à comparer.

**Formulez-le ainsi.** *« Filtrez ce dont vous n'avez pas besoin ; désagrégez ce que vous voulez comparer. Et courbes pour les tendances, barres pour comparer. »*

**À quoi ressemble un bon résultat.** Un graphique enregistré, et un participant capable d'expliquer la différence entre filtrer et désagréger dans ses propres mots.

**À surveiller.**
- Confondre **filtrer** (choisir ce qu'on affiche) et **désagréger** (décomposer un total en ses parties) — la distinction sous-tend chaque graphique.
- S'attendre à un bouton d'enregistrement. Il n'y en a pas : le titre en haut permet de renommer, **Historique** de restaurer, et **Dupliquer** sur la page Produits est la façon de garder un original.
- Choisir le préréglage Tableau de bord de la métrique Valeur de l'indicateur et se demander où est la courbe : pour une tendance, il leur faut **Personnalisé → Série temporelle**.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 3. Rédiger une interprétation pour un graphique · ~20 min · individuel

**Le déroulé.** Une activité de rédaction qui enseigne la structure d'interprétation en trois parties : un titre porteur de message, un « ce que vous voyez » factuel, et un « ce que cela signifie » orienté action, ajoutés à côté d'un graphique sur une diapositive.

**Démontrer.** Montrez un titre faible et un titre fort côte à côte — *« Résultats de couverture »* contre un titre qui énonce le constat — pour rendre concrète la différence entre décrire et conclure.

**Formulez-le ainsi.** *« Le titre est votre conclusion, pas votre sujet. "Ce que vous voyez" est factuel. "Ce que cela signifie" doit nommer une personne ou une prochaine étape. »*

**À quoi ressemble un bon résultat.** Une interprétation en trois parties dont le titre porte le message et dont le « et alors » pointe vers une action précise.

**À surveiller.**
- Des titres purement descriptifs (« Résultats de couverture »).
- Des faits mélangés à l'interprétation dans le « ce que vous voyez ».
- Des « et alors » vagues qui ne nomment ni personne ni prochaine étape.

### 4. Construire une visualisation avec l'IA · ~15 min · pratique

**Le déroulé.** Les participants produisent le même graphique via des demandes en langage courant au panneau IA **à l'intérieur d'une visualisation** : ouvrir une visualisation vierge, demander, vérifier si l'IA a respecté la demande (indicateur, période, données ajustées vs brutes), itérer en tours courts. L'IA modifie en direct la visualisation ouverte ; il n'y a rien à enregistrer.

**Démontrer.** Posez d'abord la question à l'IA depuis la page Produits et montrez sa réponse : elle ne peut pas dessiner là, elle liste les produits à ouvrir. Ouvrez ensuite une visualisation vierge, saisissez une demande, et montrez les étapes qu'elle liste (lire l'éditeur, récupérer les données, mettre la figure à jour) et où confirmer l'indicateur, la période et les **données ajustées vs brutes**. Montrez **Historique → Restaurer** une fois.

**Formulez-le ainsi.** *« Avant d'enregistrer, vérifiez que l'IA a utilisé les données ajustées, pas brutes, et la période que vous avez réellement demandée. Elle devine souvent. »*

**À quoi ressemble un bon résultat.** Un graphique enregistré conforme à la demande sur l'indicateur, la période, le type de graphique, et ajusté/brut.

**À surveiller.**
- Faire confiance à la première réponse. Vérifier, surtout les **données ajustées vs brutes**.
- Poser la question à l'IA depuis la visualisation d'un collègue : elle la modifiera. Partez d'une visualisation vierge ou d'un duplicata.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 5. Laisser l'IA rédiger l'interprétation · ~15 min · pratique

**Le déroulé.** Les participants utilisent l'IA pour rédiger un texte d'interprétation, puis le vérifient : demander une interprétation, vérifier chaque affirmation par rapport au graphique, affiner en langage clair, et ajouter le contexte local que l'IA ne peut pas connaître.

**Démontrer.** Générez une interprétation à l'écran, puis vérifiez une seule affirmation par rapport au graphique à voix haute — montrant que « ça sonne juste » n'est pas le test.

**Formulez-le ainsi.** *« L'IA peut décrire le graphique, mais elle ne connaît pas votre contexte. Vérifiez chaque affirmation par rapport au graphique, et c'est vous qui assumez l'action recommandée. »*

**À quoi ressemble un bon résultat.** Une interprétation où chaque affirmation a été vérifiée par rapport au graphique et où le contexte local a été ajouté.

**À surveiller.**
- Faire confiance à un texte qui sonne assuré. Chaque affirmation est vérifiée par rapport au graphique ; l'action recommandée est assumée par le participant.

### 6. Application — repérer une perturbation · ~25 min · équipes pays

**Le déroulé.** La synthèse : avec de vraies données pays, les équipes créent le graphique national du module **Détection des perturbations** (observé vs attendu avec la bande de crédibilité à 95%), filtrent à un indicateur, appliquent le cadre en six étapes, ajoutent le contexte local, rédigent un constat en trois parties, et le partagent avec la salle.

**Démontrer.** Rien de nouveau à démontrer — ceci applique tout le module. Mettez-la en place en rappelant aux équipes les six étapes et la structure de constat en trois parties.

**Formulez-le ainsi.** *« Une baisse d'un seul mois est généralement du bruit. Cherchez une baisse soutenue, trois mois ou plus, sous la bande. La courbe attendue tient déjà compte des formations sanitaires qui n'ont pas déclaré, donc une plage rouge est un vrai changement parmi celles qui ont déclaré. »*

**À quoi ressemble un bon résultat.** Un constat clairement énoncé sur une perturbation réelle et soutenue, défendable devant la salle.

**À surveiller.**
- Des équipes qui qualifient une baisse d'un seul mois de perturbation. Orientez-les vers des baisses soutenues (3 mois et plus).
- Utilisez le partage avec le groupe pour faire ressortir et corriger les constats faibles — c'est la preuve que le module a fonctionné.

## Pour conclure

L'activité 6 prouve que ces activités ont porté : une équipe qui peut repérer une vraie perturbation dans ses propres données et l'énoncer clairement maîtrise la compétence FASTR centrale. Tout ce qui précède dans le module existe pour rendre ce partage final possible.
