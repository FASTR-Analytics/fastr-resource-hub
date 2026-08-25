---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Configuration de l'instance"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step current">Établissements</span> <span class="arrow">→</span> <span class="step">Indicateurs</span> <span class="arrow">→</span> <span class="step">Données</span> <span class="arrow">→</span> <span class="step">Vérifier</span></div>

# Importer la structure des établissements

<p class="meta-line"><strong>Configuration de l'instance</strong> · <strong>~20 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Avant de commencer</p>

- ☐ Vous avez lu **Avant de commencer** (URL DHIS2 + identifiants connus)
- ☐ Vous savez quel niveau de votre hiérarchie DHIS2 correspond à *établissement* (souvent le niveau 4 ou 5)

</aside>
<div class="p1-main">

## Ce que vous allez faire

Récupérer le registre des établissements de votre pays — chaque établissement avec sa région et son district — directement depuis DHIS2 dans FASTR. Les zones administratives sont **dérivées automatiquement des lignes d'établissements** : vous ne gérez jamais les zones séparément. Ensuite, chaque analyse pourra désagréger les résultats par région, district ou établissement.

<h2 class="step-h"><span class="step-n">1</span><span>Ouvrir le registre des établissements</span></h2>

1. Cliquez sur **Données** dans la barre du haut. La page est organisée en sections **Général**, **SNIS**, **EES** et **ICEH**.
2. Dans la section **SNIS**, cliquez sur la carte **Établissements**.

![h:180](../../../resources/screenshots/m9a_setup/20_data_page.png)

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">2</span><span>Importer depuis DHIS2</span></h2>

Lancez une importation DHIS2 depuis la page Établissements. La **connexion DHIS2 enregistrée** s'affiche — celle configurée une fois pour toute l'instance via **Gérer la connexion**. Confirmez-la.

> Pas encore de connexion enregistrée ? Un administrateur la configure une fois — URL (avec `https://`), nom d'utilisateur, mot de passe — et elle est sauvegardée chiffrée pour toute l'instance. Personne ne ressaisit d'identifiants ensuite.

<h2 class="step-h"><span class="step-n">3</span><span>Sélectionner le niveau établissement</span></h2>

Sélectionnez **Établissement**. Les modules d'analyse FASTR exigent des données au niveau établissement — ils agrègent des établissements vers les districts et régions, jamais l'inverse. Sélectionner *Établissement* entraîne automatiquement tous les niveaux au-dessus (district, région, …).

Lancez l'importation et attendez la fin — de 30 secondes à quelques minutes selon la taille du pays.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Point de contrôle

- La page **Établissements** liste les établissements de votre pays avec leurs zones administratives.
- De retour sur la page **Données**, la carte Établissements affiche les effectifs — établissements et zones à chaque niveau. Vérifiez qu'ils sont plausibles pour votre pays.

![h:190](../../../resources/screenshots/m9a_setup/35_hmis_facilities.png)

## En cas de problème

- **Liste d'établissements vide** — l'utilisateur DHIS2 de la connexion enregistrée n'a peut-être pas accès en lecture aux unités d'organisation. Voyez avec l'admin DHIS2.
- **Hiérarchie bizarre** — mauvais niveau sélectionné. Réimportez avec le bon niveau ; les établissements existants sont mis à jour, pas dupliqués.
- **Échec d'authentification** — le plus souvent une URL malformée (`https://` manquant ou barre oblique finale) plutôt qu'un mauvais mot de passe. Corrigez via **Gérer la connexion** sur la page Importations.
- **Importation qui traîne** — les grands pays (1000+ établissements) prennent plus de temps. Attendez au moins 5 minutes avant de réessayer.

## La suite

Passez à **Importer et mapper les indicateurs**.
