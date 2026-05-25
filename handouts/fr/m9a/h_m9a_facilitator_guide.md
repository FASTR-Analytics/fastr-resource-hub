---
marp: true
theme: fastr-handout
paginate: true
class: facilitator
footer: "FASTR · Configuration de l'instance · Facilitateur"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

# Guide du facilitateur — Configuration de l'instance

<p class="meta-line"><strong>Guide du facilitateur</strong> · <strong>Configuration de l'instance</strong> · <strong>5 activités · ~90 min</strong></p>

## Objectif

Configuration de l'instance est la séquence qui connecte les données DHIS2 d'un pays à une instance FASTR. Les participants importent la structure des établissements, définissent et mappent les indicateurs, récupèrent les données SIS, et vérifient le résultat. Toutes les activités ultérieures de l'atelier tournent sur les données chargées ici ; ce module est donc un prérequis plutôt qu'un sujet en soi.

Les cinq activités se déroulent dans un **ordre strict** : chaque étape dépend de la précédente, et les erreurs se propagent — un mauvais mappage d'indicateur à l'étape 3 ressort comme un mauvais chiffre à l'étape 5. À la fin, chaque équipe devrait avoir une instance vérifiée dont les valeurs contrôlées correspondent à DHIS2.

## La session en bref

| # | Activité | Durée | Format |
|---|----------|-------|--------|
| 1 | Avant de commencer | ~5 min | Guidé, toute la salle |
| 2 | Importer la structure des établissements | ~20 min | Guidé, toute la salle |
| 3 | Importer et mapper les indicateurs | ~30 min | Guidé, toute la salle |
| 4 | Importer les données SIS | ~25 min | Guidé, toute la salle |
| 5 | Vérifier et explorer votre configuration | ~10 min | Guidé, toute la salle |

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Animer la session

**Préparation.** Confirmez deux choses pour chaque équipe *avant* le début : des identifiants DHIS2 fonctionnels (URL, nom d'utilisateur, mot de passe) et une Check-list de préparation des données remplie. L'accès manquant est la plus grande perte de temps ici, et c'est quelque chose que seul vous ou un administrateur pouvez régler — pas le participant.

**Comment démontrer.** Les documents sont des procédures détaillées clic par clic. Démontrez les premiers clics de chaque étape à l'écran partagé pour que les participants se repèrent, puis laissez-les suivre le document à leur rythme. Les moments délicats à montrer lentement sont signalés sous **Démontrer** ci-dessous.

**Regroupement.** C'est une séquence guidée, pas du travail indépendant — gardez la salle ensemble et avancez étape par étape. Ne laissez pas les plus rapides prendre de l'avance ; les étapes suivantes échouent silencieusement si une précédente a été mal faite.

**Rythme.** Si quelqu'un prend du retard, mettez toute la salle en pause. Le coût de l'attente est bien inférieur à celui d'une équipe qui découvre à l'étape 5 que l'étape 3 était fausse et doit tout refaire.

**Le message à faire passer.** La configuration n'est « terminée » que lorsque la vérification réussit. Une tuile verte n'est pas une preuve ; une valeur contrôlée qui correspond à DHIS2 en est une.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Les activités

### 1. Avant de commencer · ~5 min · toute la salle

**Le déroulé.** Une page d'orientation qui présente la séquence en quatre étapes et explique la gestion des identifiants DHIS2. Les participants rassemblent ce qu'il leur faut — Check-list de préparation remplie, URL/nom d'utilisateur/mot de passe DHIS2, navigateur stable. Il n'y a pas d'étape « connexion » séparée ; les identifiants sont saisis au premier import.

**Formulez-le ainsi.** *« Au premier import, on vous demandera votre identifiant DHIS2. Cochez "Enregistrer les identifiants pour cette session" — sinon vous les ressaisirez à chaque étape. »*

**À quoi ressemble un bon résultat.** Chaque équipe a sa check-list et ses identifiants en main avant de cliquer sur Importer.

**À surveiller.**
- Les équipes sans accès DHIS2 confirmé. Réglez cela avant de commencer, pas en cours de séquence.
- La case « Enregistrer les identifiants pour cette session » oubliée, qui provoque des invites répétées.

### 2. Importer la structure des établissements · ~20 min · toute la salle

**Le déroulé.** Une procédure pas à pas pour récupérer la hiérarchie administrative du pays dans FASTR : Données → Structure et cartes → Zones administratives → importer directement depuis DHIS2 → sélectionner le niveau **Établissement** → finaliser jusqu'à ce que la tuile Structure et cartes passe au vert.

**Démontrer.** Montrez le chemin vers Structure et cartes et le moment où l'on choisit le **niveau** DHIS2 — sélectionner le mauvais niveau ici est l'échec le plus fréquent, et il est difficile à repérer ensuite.

**À quoi ressemble un bon résultat.** Une liste d'établissements conforme à la structure réelle du pays, et une tuile Structure et cartes verte.

**À surveiller.**
- Une liste d'établissements vide ou une hiérarchie inattendue — généralement le mauvais niveau DHIS2, ou un manque d'accès en lecture aux unités d'organisation.
- Les échecs d'authentification — typiquement une URL mal formée plutôt qu'un mauvais mot de passe.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 3. Importer et mapper les indicateurs · ~30 min · toute la salle

**Le déroulé.** L'étape la plus longue et la plus sujette aux erreurs, en trois phases : créer les indicateurs communs, importer les noms d'indicateurs DHIS2 du pays, puis mapper chaque indicateur DHIS2 à son équivalent commun.

**Démontrer.** Montrez un mappage complet — un indicateur DHIS2 relié à un indicateur commun — et la règle de nommage de l'ID commun, avant que les équipes ne traitent leur propre liste.

**Formulez-le ainsi.** *« Les ID communs sont en lettres minuscules et tirets bas uniquement. Pas d'espace, pas d'accent. Et chaque indicateur DHIS2 est mappé à exactement un indicateur commun. »*

**À quoi ressemble un bon résultat.** Chaque indicateur prioritaire mappé, sans ID rejeté ni indicateur DHIS2 mappé à deux indicateurs communs.

**À surveiller.**
- Un ID commun rejeté — un espace, un accent ou un caractère spécial a été utilisé.
- La confusion de mappage — rappelez que la relation est un-à-un. Une erreur ici ressort comme un mauvais chiffre à l'étape 5.

### 4. Importer les données SIS · ~25 min · toute la salle

**Le déroulé.** La plus grande opération de données de la configuration : récupérer les valeurs réelles des données SIS depuis DHIS2. Les participants sélectionnent les indicateurs et une plage de temps, règlent la gestion des erreurs sur **« Abandonner toute la tentative d'import »**, récupèrent, examinent le résumé d'import, puis intègrent et finalisent.

**Démontrer.** Montrez le réglage de gestion des erreurs et l'écran de résumé d'import, pour que les équipes sachent à quoi ressemble un résumé sain avant d'intégrer.

**Formulez-le ainsi.** *« Ne fermez pas l'onglet pendant la récupération. Pour un grand pays, restreignez les indicateurs ou la plage de temps et importez par lots plutôt que tout d'un coup. »*

**À quoi ressemble un bon résultat.** Un résumé d'import propre, intégré et finalisé, sans erreur d'abandon.

**À surveiller.**
- Les gros imports qui figent le navigateur — prévenez de ne pas fermer l'onglet en cours de récupération.
- Les très grands pays qui dépassent le délai — faites-leur importer par lots.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 5. Vérifier et explorer votre configuration · ~10 min · toute la salle

**Le déroulé.** Une étape de vérification qui sert aussi d'introduction à l'explorateur de graphiques. Les participants affichent les indicateurs en séries temporelles, basculent les indicateurs, ajustent l'échelle de l'axe Y, contrôlent une valeur connue d'un établissement par rapport à DHIS2, et examinent l'historique d'import.

**Démontrer.** Montrez un contrôle de bout en bout : choisissez un établissement et un mois dont vous connaissez la valeur, retrouvez-la dans FASTR, et comparez-la à DHIS2. C'est le moment qui prouve la configuration.

**Formulez-le ainsi.** *« Une tuile verte signifie que l'import a tourné. Un contrôle qui correspond à DHIS2 signifie que l'import est correct. C'est le second qu'il nous faut. »*

**À quoi ressemble un bon résultat.** Une valeur contrôlée qui correspond exactement à DHIS2.

**À surveiller.**
- Des valeurs plates ou nulles — généralement la plage de période ne recouvre pas les données DHIS2.
- Un contrôle qui ne correspond pas — presque toujours un mappage d'indicateurs incomplet à l'étape 3. Renvoyez l'équipe là plutôt que de continuer.

## Pour conclure

Ne passez à la suite que lorsque la vérification de chaque équipe réussit. Un contrôle raté n'est pas un détail à corriger plus tard — tout le reste de l'atelier tourne sur ces données, et une erreur de mappage silencieuse réapparaîtra comme un constat faux dans le rapport d'un participant.
