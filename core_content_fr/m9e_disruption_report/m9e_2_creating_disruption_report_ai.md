---
marp: true
theme: fastr
paginate: true
---

## Activité : Créer un rapport sur les perturbations avec l'assistant IA

**Suivez ces étapes pour configurer et lancer la génération du rapport. Un membre de l'équipe prend le rôle de pilote.**

1. Ouvrez l'onglet **Présentations** dans la plateforme FASTR
2. Cliquez sur **+ Créer une présentation** et donnez-lui un nom (par ex., "Rapport de perturbations pour {pays}")
3. Ouvrez l'**assistant IA** — si vous êtes déjà dans une conversation, démarrez-en une nouvelle
4. Ouvrez la **bibliothèque de prompts**, faites défiler vers le bas et sélectionnez **"Prompt 1: FASTR Disruptions Report"** OU **"Prompt 4: Subnational Disruptions Report"**, selon votre cas d'utilisation
5. Examinez le texte du prompt qui apparaît dans le champ de saisie

---

## Comprendre le prompt : que fait-il ?

Le prompt est un ensemble d'instructions détaillées qui indiquent à l'assistant IA comment construire un rapport sur les perturbations, étape par étape. Voici ce qu'il demande à l'IA de faire :

1. **Vous poser des questions de base** — votre pays, la période d'analyse et un sous-titre pour le rapport
2. **Rechercher les indicateurs disponibles** — l'IA identifie quels indicateurs de santé sont disponibles dans la plateforme pour votre pays
3. **Regrouper les indicateurs par catégories** — par ex. vaccination, soins prénataux, accouchements, paludisme — et vous demander de confirmer
4. **Construire le rapport diapositive par diapositive** — page de couverture, méthodologie, puis une diapositive d'analyse par groupe d'indicateurs, chacune avec un graphique et une interprétation écrite

**Ce que le prompt gère en coulisses :** Définit la structure du rapport, la mise en page des diapositives et le format visuel. Inclut un contenu standardisé (méthodologie, guide d'interprétation) qui reste cohérent entre les pays. Établit des normes de qualité pour le langage analytique et l'exactitude des données. Les éléments spécifiques au pays — indicateurs, périodes et conclusions — sont renseignés à partir de la plateforme.

---

## L'assistant IA vous demandera les détails de votre rapport

Après avoir envoyé le prompt, l'IA vous posera quelques questions avant de commencer à construire la présentation. Le pilote de votre équipe doit taper les réponses directement dans le chat.

1. **Nom du pays** — l'IA peut déjà détecter votre pays à partir du projet. Confirmez ou tapez le nom correct.
2. **Période d'analyse** — fournissez une date de début et de fin pour les données que vous souhaitez analyser (par ex., "Janvier 2023 à septembre 2025")
3. **Sous-titre du rapport** — un libellé court pour la page de couverture du rapport (par ex., "T3 2025", "Annuel 2025")

**Conseil :** Répondez aux trois questions en un seul message pour gagner du temps. Par exemple : *"Sierra Leone, janvier 2023 à septembre 2025, T3 2025"*

Exécutez maintenant le prompt. Cliquez sur **Exécuter dans le chat actuel**.
