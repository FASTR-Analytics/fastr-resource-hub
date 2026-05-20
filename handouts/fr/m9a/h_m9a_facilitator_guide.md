---
marp: true
theme: fastr-handout
paginate: true
class: facilitator
footer: "FASTR · Configuration de l'instance · Facilitateur"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

# Guide du facilitateur — Configuration de l'instance

<p class="meta-line"><strong>Guide du facilitateur</strong> · <strong>Configuration de l'instance</strong></p>

## À propos de ces activités

Configuration de l'instance est la séquence de configuration pratique — les participants connectent les données DHIS2 d'un pays à une instance FASTR. Les cinq activités se déroulent dans un **ordre strict** : chaque étape dépend de la précédente, et les erreurs se propagent — un mauvais mappage d'indicateur à l'étape 3 ressort comme un mauvais chiffre à l'étape 5.

**Cinq documents**, à suivre dans l'ordre. **~90 min** de temps participant. La plupart des échecs ici sont des erreurs d'identifiants ou de mappage, pas des erreurs de concept.

## Comment l'animer

- C'est une **séquence guidée** — gardez la salle ensemble, étape par étape. Ne laissez personne prendre de l'avance.
- Les documents sont des procédures détaillées. Démontrez les premiers clics de chaque étape, puis laissez les participants suivre le document à leur rythme.
- Confirmez les **identifiants DHIS2** et la **Check-list de préparation des données** de chaque équipe *avant* de commencer — un accès manquant bloque toute la salle.
- Si quelqu'un prend du retard, **mettez la salle en pause**. Les étapes suivantes ne fonctionneront pas sans les précédentes.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Les activités

### 1. Avant de commencer

**Orientation · ~5 min**

**Ce que c'est** — une page d'orientation qui présente la séquence en quatre étapes et explique la gestion des identifiants DHIS2.
**Ce que couvre le document** — les participants rassemblent ce qu'il leur faut (Check-list de préparation remplie, URL / nom d'utilisateur / mot de passe DHIS2, navigateur stable) ; il n'y a pas d'étape « connexion » séparée — les identifiants sont saisis au premier import.
**À surveiller** — dites aux participants de cocher **« Enregistrer les identifiants pour cette session »** à la première invite, sinon ils seront resollicités à chaque import.

### 2. Importer la structure des établissements

**Procédure de configuration · ~20 min**

**Ce que c'est** — une procédure pas à pas pour récupérer la hiérarchie administrative du pays dans FASTR.
**Ce que couvre le document** — Données → Structure et cartes → Zones administratives → importer directement depuis DHIS2 → sélectionner le niveau **Établissement** → finaliser jusqu'à ce que la tuile Structure et cartes passe au vert.
**À surveiller** — une liste d'établissements vide ou une hiérarchie inattendue vient généralement du mauvais niveau DHIS2 choisi, ou d'un manque d'accès en lecture aux unités d'organisation. Les échecs d'authentification viennent typiquement d'une URL mal formée.

### 3. Importer et mapper les indicateurs

**Procédure de configuration · ~30 min**

**Ce que c'est** — une procédure en trois phases pour définir et mapper les indicateurs. L'étape la plus longue et la plus sujette aux erreurs.
**Ce que couvre le document** — créer les indicateurs communs, importer les noms d'indicateurs DHIS2 du pays, puis mapper chaque indicateur DHIS2 à son équivalent commun.
**À surveiller** — un ID commun rejeté signifie qu'un espace, un accent ou un caractère spécial a été utilisé : exigez uniquement des lettres minuscules et des tirets bas. Chaque indicateur DHIS2 est mappé à **exactement un** indicateur commun.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 4. Importer les données SIS

**Procédure de configuration · ~25 min**

**Ce que c'est** — la plus grande opération de données de la configuration : récupérer les valeurs réelles des données SIS depuis DHIS2.
**Ce que couvre le document** — sélectionner les indicateurs et une plage de temps, régler la gestion des erreurs sur **« Abandonner toute la tentative d'import »**, récupérer, examiner le résumé d'import, puis intégrer et finaliser.
**À surveiller** — les gros imports peuvent figer le navigateur. Prévenez les participants de ne pas fermer l'onglet en cours de récupération ; pour les grands pays, restreignez les indicateurs / la plage de temps et importez par lots.

### 5. Vérifier et explorer votre configuration

**Procédure de configuration · ~10 min**

**Ce que c'est** — une étape de vérification pour contrôler les données importées et apprendre l'explorateur de graphiques.
**Ce que couvre le document** — afficher les indicateurs en séries temporelles, basculer les indicateurs, ajuster l'échelle de l'axe Y, contrôler une valeur connue d'un établissement par rapport à DHIS2, et examiner l'historique d'import.
**À surveiller** — des valeurs plates ou nulles signifient généralement que la plage de période ne recouvre pas les données DHIS2. Un contrôle qui ne correspond pas remonte presque toujours à un **mappage d'indicateurs incomplet à l'étape 3** — renvoyez-les là.

## Pour conclure

La configuration n'est « terminée » que lorsque l'étape de vérification réussit. Si un contrôle échoue, ne passez pas à la suite — tout le reste de l'atelier tourne sur ces données.
