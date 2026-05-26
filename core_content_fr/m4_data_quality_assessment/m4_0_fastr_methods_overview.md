---
marp: true
theme: fastr
paginate: true
---

## Comment FASTR analyse vos données

FASTR exécute **5 modules de la plateforme dans l'ordre**. Chacun prépare le terrain pour le suivant :

| | Module | Ce qu'il fait | Pourquoi |
|---|--------|-------------|----------|
| 1️⃣ | **Vérifier la qualité** (M1) | Repère les erreurs de saisie, les rapports manquants et les incohérences | On ne peut pas analyser des données peu fiables |
| 2️⃣ | **Corriger les problèmes** (M2) | Remplace les valeurs extrêmes et comble les mois manquants | Des données propres pour des résultats fiables |
| 3️⃣ | **Analyser les services** (M3) | Compare les volumes observés à ce qui était attendu pour détecter les perturbations | Savoir où et quand les services ont changé |
| 4️⃣ | **Construire le dénominateur** (M5) | Estime la population cible pour chaque indicateur | La couverture a besoin d'un dénominateur |
| 5️⃣ | **Estimer la couverture** (M6) | Calcule le % de la population couverte à partir des données rapportées | Passer des chiffres bruts aux indicateurs qui guident l'action |

Vous allez travailler avec chacun de ces modules sur la plateforme pendant l'atelier.
