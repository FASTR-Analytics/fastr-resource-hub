---
marp: true
theme: fastr
paginate: true
---

## Comment FASTR analyse vos données

FASTR exécute **4 modules dans l'ordre**. Chacun prépare le terrain pour le suivant :

| | Module | Ce qu'il fait | Pourquoi |
|---|--------|-------------|----------|
| 1️⃣ | **Vérifier la qualité** | Repère les erreurs de saisie, les rapports manquants et les incohérences | On ne peut pas analyser des données peu fiables |
| 2️⃣ | **Corriger les problèmes** | Remplace les valeurs extrêmes et comble les mois manquants | Des données propres pour des résultats fiables |
| 3️⃣ | **Analyser les services** | Compare les volumes observés à ce qui était attendu pour détecter les perturbations | Savoir où et quand les services ont changé |
| 4️⃣ | **Estimer la couverture** | Calcule le % de la population couverte à partir des données rapportées | Passer des chiffres bruts aux indicateurs qui guident l'action |

Vous allez exécuter ces 4 modules sur la plateforme pendant l'atelier.
