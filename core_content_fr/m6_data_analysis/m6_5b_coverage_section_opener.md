---
marp: true
theme: fastr
paginate: true
---

## Estimation de la couverture

Nous avons traité l'utilisation des services — ce qui a été rapporté et où les volumes évoluent. L'estimation de la couverture répond à une autre question : **quelle part de la population cible a effectivement reçu chaque service**.

La couverture est construite comme un **module en deux parties** dans FASTR :

- **Partie 1** construit et valide les chaînes de dénominateurs
- **Partie 2** applique la chaîne retenue pour calculer la couverture, et projette entre les enquêtes

Les versions antérieures de la plateforme combinaient ces étapes en un seul module. La division en deux parties permet de revoir et de surcharger indépendamment la sélection de la chaîne. Certaines instances pays affichent encore l'ancienne structure étiquetée « Module 4 — Couverture » ; la méthodologie sous-jacente est la même.
