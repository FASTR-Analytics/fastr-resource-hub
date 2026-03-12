---
marp: true
theme: fastr
paginate: true
---

## Détection des perturbations et excédents de services

L'approche FASTR pour détecter les perturbations et excédents de services utilise la **régression de séries temporelles interrompues (ITS)** avec des effets fixes au niveau de l'établissement. Ce cadre statistique permet une interprétation et une comparaison plus significatives des données de comptage entre les zones infranationales, permettant des analyses que les données brutes seules ne peuvent fournir.

En se concentrant sur les changements et tendances significatifs plutôt que sur les chiffres bruts, cette approche soutient une analyse plus précise et comparable. Les changements importants et inattendus antérieurs dans les données historiques sont supprimés pour établir une référence propre. Les changements de volume inattendus sont estimés en comparant les volumes observés aux volumes attendus basés sur les tendances historiques et la saisonnalité.
