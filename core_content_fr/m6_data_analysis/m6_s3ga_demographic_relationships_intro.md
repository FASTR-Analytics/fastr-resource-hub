---
marp: true
theme: fastr
paginate: true
---

## Utiliser les relations démographiques pour estimer les dénominateurs

Une fois qu'on a un point d'entrée — par exemple, le nombre de grossesses dérivé de CPN1 — on peut enchaîner des ratios démographiques pour calculer la population cible de chaque autre service. Chaque flèche de la cascade est un ratio tiré d'une source nationale (EDS, recensement, statistiques d'état civil) :

- Grossesses → naissances vivantes utilise les taux de pertes fœtales et précoces
- Naissances vivantes → nourrissons survivants utilise la mortalité néonatale et infantile
- Nourrissons survivants → cohortes éligibles selon l'âge utilise la survie spécifique à l'âge

Combinez la chaîne et FASTR peut déduire le dénominateur de n'importe quel service à partir d'une seule entrée.
