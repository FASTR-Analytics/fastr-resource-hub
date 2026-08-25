---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Configuration de l'instance"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

# Avant de commencer

<p class="meta-line"><strong>Configuration de l'instance</strong> · <strong>~5 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Ce qu'il vous faut</p>

- ☐ Votre **Liste de vérification pour la préparation des données FASTR** (complétée — onglet *Modèle de cartographie*). [Télécharger le modèle vierge](https://github.com/FASTR-Analytics/fastr-resource-hub/raw/main/resources/checklists/FASTR_data_prep_checklist_fr.xlsx)
- ☐ L'URL de votre instance DHIS2 (celle que votre équipe utilise, p. ex. `https://hmis.votrepays.gov`)
- ☐ Votre nom d'utilisateur DHIS2
- ☐ Votre mot de passe DHIS2
- ☐ Un navigateur ouvert sur une connexion stable

</aside>
<div class="p1-main">

## La suite

Vous parcourrez quatre documents dans l'ordre :

1. **Importer la structure des établissements** — récupérer depuis DHIS2 la hiérarchie administrative et la liste des établissements de votre pays
2. **Importer et mapper les indicateurs** — définir les indicateurs à suivre et les lier aux noms DHIS2
3. **Importer les données HMIS** — récupérer les vraies valeurs
4. **Vérifier et explorer** — confirmer que tout est correctement chargé

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## À propos des identifiants DHIS2

Il n'y a plus d'étape de « connexion » séparée. La première fois que vous lancez une importation (zones administratives, indicateurs, ou données HMIS), la plateforme affiche un petit formulaire :

- URL DHIS2
- Nom d'utilisateur DHIS2
- Mot de passe DHIS2
- ☐ Connexion enregistrée configurée (une fois par instance)

> **Astuce :** la connexion DHIS2 s'enregistre **une fois pour toute l'instance** — un administrateur la configure via **Gérer la connexion** sur la page Importations, chiffrée. Ensuite, chaque importation l'utilise ; personne ne ressaisit d'identifiants.

## Comment utiliser ces documents

Chaque document commence par une section « Avant de commencer » listant ce qui doit déjà être fait. Lisez-la en premier — ne sautez pas l'ordre, il est important.

## Étape suivante

Passez à **Importer la structure des établissements**.
