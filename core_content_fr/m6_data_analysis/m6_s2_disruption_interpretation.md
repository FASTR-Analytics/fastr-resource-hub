---
marp: true
theme: fastr
paginate: true
---

## Détection des perturbations de services

Au-delà des comparaisons d'une année sur l'autre, nous voulons savoir : **La prestation de services est-elle sur la bonne voie, ou quelque chose l'a-t-elle perturbée ?**

**Le défi :** Les comptages bruts de services sont difficiles à interpréter. Une baisse des services pourrait être une vraie perturbation, ou simplement une variation saisonnière normale. Différentes zones ont des volumes de référence différents, rendant la comparaison directe difficile.

**La solution FASTR :** Utiliser la modélisation statistique pour estimer quel volume de service nous *attendrions* basé sur les tendances historiques et la saisonnalité, puis comparer le volume réel à cette attente.

- **Perturbation :** Volume observé significativement inférieur à l'attendu
- **Excédent :** Volume observé significativement supérieur à l'attendu
