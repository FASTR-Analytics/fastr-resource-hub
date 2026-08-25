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

**Le déroulé.** Une page d'orientation qui présente la séquence en quatre étapes et explique la gestion des identifiants DHIS2. Les participants rassemblent ce qu'il leur faut — Check-list de préparation remplie, URL/nom d'utilisateur/mot de passe DHIS2, navigateur stable. La connexion DHIS2 s'enregistre **une fois pour toute l'instance** (chiffrée), via **Gérer la connexion** sur la page Importations ; ensuite, personne ne ressaisit d'identifiants.

**Formulez-le ainsi.** *« On configure la connexion DHIS2 une seule fois, pour toute l'instance. Ensuite, chaque importation — y compris les importations programmées — utilise cette connexion enregistrée. »*

**À quoi ressemble un bon résultat.** Chaque équipe a sa check-list en main, et la connexion enregistrée de l'instance est configurée avant de cliquer sur Importer.

**À surveiller.**
- Les équipes sans accès DHIS2 confirmé. Réglez cela avant de commencer, pas en cours de séquence.
- Quelqu'un qui remplace la connexion enregistrée par ses identifiants personnels en pleine séance — elle vaut pour toute l'instance, un changement affecte tout le monde.

### 2. Importer la structure des établissements · ~20 min · toute la salle

**Le déroulé.** Une procédure pas à pas pour récupérer le registre des établissements du pays dans FASTR : Données → section **SNIS** → carte **Établissements** → importer depuis DHIS2 → sélectionner le niveau **Établissement** → terminer, jusqu'à ce que la carte Établissements affiche les effectifs attendus. Les zones administratives sont **dérivées automatiquement des lignes d'établissements** — il n'y a pas d'import séparé des zones.

**Démontrer.** Montrez le chemin vers la carte Établissements et le moment où l'on choisit le **niveau** DHIS2 — sélectionner le mauvais niveau ici est l'échec le plus fréquent, et il est difficile à repérer ensuite.

**À quoi ressemble un bon résultat.** Une liste d'établissements conforme à la structure réelle du pays, avec des effectifs d'établissements et de zones plausibles sur la carte Établissements.

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

**Le déroulé.** La plus grande opération de données de la configuration : récupérer les valeurs réelles des données SIS depuis DHIS2. Les participants suivent l'assistant en cinq étapes — **Identifiants, Indicateurs, Heure, Configuration, Vérifier et lancer** — puis l'importation tourne sur le serveur. La progression s'affiche sur la page Importations (onglet En cours) ; la fin, dans l'Historique.

**Démontrer.** Montrez le récapitulatif de l'étape Vérifier et lancer — le nombre de paires (indicateur, mois) donne la taille du téléchargement — et l'onglet **Par indicateur**, pour que les équipes sachent où apparaissent les paires en échec et comment les relancer.

**Formulez-le ainsi.** *« Une fois "Démarrer l'importation" cliqué, c'est le serveur qui travaille. Vous pouvez fermer l'onglet — regardez l'Historique dans quelques minutes. Tout ce qui réussit est conservé ; les mois en échec se relancent séparément. »*

**À quoi ressemble un bon résultat.** L'importation terminée dans l'Historique, avec l'onglet Par indicateur montrant les mois de données attendus et zéro échec (ou des échecs explicables).

**À surveiller.**
- Les équipes qui passent à la suite avant la fin de l'importation — l'étape de vérification (et plus tard le paquet de résultats) a besoin que les données soient arrivées.
- Les paires (indicateur, mois) en échec ignorées — quelques-unes sont normales (pas de données dans DHIS2) ; beaucoup renvoient au mapping de l'étape 3.

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
