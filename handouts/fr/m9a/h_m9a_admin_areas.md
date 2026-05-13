---
marp: true
theme: fastr-handout
paginate: true
footer: "FASTR · Configuration de l'instance"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

# Importer la structure des établissements

<p class="meta-line"><strong>Activité</strong> · <strong>Configuration de l'instance</strong> · <strong>~20 min</strong></p>

## Avant de commencer

- ☐ Vous avez lu **Avant de commencer** (vous connaissez votre URL DHIS2 + identifiants)
- ☐ Vous savez quel niveau de votre hiérarchie DHIS2 correspond à *établissement* (souvent niveau 4 ou 5)

## Ce que vous allez faire

Importer directement depuis DHIS2 la hiérarchie administrative complète de votre pays (régions → districts → établissements). Après cette étape, toute analyse pourra désagréger les résultats par région, district ou établissement.

## Phases

### Phase 1 — Ouvrir le flux d'importation

1. Cliquez sur l'onglet **Données** dans la barre de navigation en haut.
2. Allez dans **Structure & maps**.
3. Cliquez sur **Admin areas and facilities**.
4. Cliquez sur **Add admin areas and facilities**.

![h:160](../../../resources/screenshots/m9a_setup/03_admin_units_menu.jpeg)

### Phase 2 — Choisir « Importer depuis DHIS2 »

Vous verrez deux options. Choisissez la **deuxième — Importer directement depuis DHIS2**. (La première sert aux téléversements manuels depuis un tableur — plus lent et plus sujet aux erreurs.)

![h:170](../../../resources/screenshots/m9a_setup/04_import_from_dhis2.jpeg)

Cliquez sur **Continue**.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### Phase 3 — Se connecter à DHIS2 (la première fois seulement)

La plateforme affiche maintenant un petit formulaire de connexion DHIS2. Remplissez trois champs :

- **DHIS2 URL** — l'adresse de votre instance DHIS2 (inclure `https://`)
- **DHIS2 Username**
- **DHIS2 Password**

Cochez **Save credentials for this session** — vous ne serez plus invité à les saisir lors des prochaines importations.

![h:220](../../../resources/screenshots/m9a_setup/02_credentials_form.jpeg)

Cliquez sur **Confirm and continue**.

> Si vous avez déjà sauvegardé vos identifiants dans cette session (p. ex. lors d'une importation précédente), cette étape est automatiquement sautée.

### Phase 4 — Sélectionner le niveau d'établissement

Sélectionnez les niveaux d'unités d'organisation à importer. Pour la plupart des pays, le bon choix est **Établissement** — c'est le niveau feuille, et le sélectionner ramène tous les niveaux au-dessus.

![h:160](../../../resources/screenshots/m9a_setup/05_select_facility_level.jpeg)

Cliquez sur **Sauvegarder**, puis **Start import**.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### Phase 5 — Confirmer et intégrer

- Sélectionnez **Ajouter de nouveaux établissements et mettre à jour les établissements existants si nécessaire**.
- Cliquez sur **Finaliser et intégrer**.

Patientez jusqu'à la fin de l'importation — une barre de progression s'affiche ; généralement 30 secondes à quelques minutes selon la taille du pays.

## Vérification

Après l'intégration :

- La page Admin areas and facilities liste la hiérarchie de votre pays.
- De retour sur la page **Données**, Structure & maps apparaît **en vert**.

![h:200](../../../resources/screenshots/m9a_setup/06_facilities_green.jpeg)

## Que faire si ça ne marche pas

- **Liste d'établissements vide** — votre compte DHIS2 n'a peut-être pas l'accès en lecture aux unités d'organisation. Vérifiez avec l'administrateur DHIS2.
- **La hiérarchie semble fausse** — vous avez choisi le mauvais niveau. Ré-importez ; l'option *mettre à jour les existants* préserve les modifications de façon non-destructive.
- **L'authentification échoue** — généralement la mauvaise URL (oubli de `https://` ou slash final) ou une faute dans le mot de passe. Réouvrez le flux d'importation pour ramener le formulaire de connexion.
- **L'importation reste bloquée** — les grands pays (1000+ établissements) prennent plus de temps. Attendez au moins 5 min avant de réessayer.

> 🔎 **Vérifiez dans votre interface actuelle** : les emplacements des panneaux et libellés peuvent différer des captures ; le flux reste le même.

## Étape suivante

Passez à **Importer et mapper les indicateurs**.
