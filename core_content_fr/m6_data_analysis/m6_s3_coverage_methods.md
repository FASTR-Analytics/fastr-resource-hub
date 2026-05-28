---
marp: true
theme: fastr
paginate: true
---

## Qu'est-ce que la couverture ?

En termes simples, la **couverture** vous dit quelle part des personnes qui avaient besoin d'un service l'ont effectivement reçu. C'est un pourcentage : services délivrés divisé par la population cible, multiplié par 100.

Une couverture élevée signifie que le système atteint la plupart de ceux qu'il devrait. Une couverture faible signifie que des gens qui avaient besoin du service ne l'ont pas eu — soit qu'il n'était pas disponible, pas accessible, ou pas utilisé.

---

## Couverture : le problème du dénominateur

Le numérateur est facile — c'est ce que les formations sanitaires rapportent dans le SIGS. Mais le **dénominateur** (combien de personnes avaient besoin du service) n'est pas dans le SIGS. Sans lui, vous pouvez compter les services délivrés mais vous ne pouvez pas dire quelle part de la population cela représente.

![Équation de couverture h:280](../../resources/diagrams_fr/coverage_equation.svg)

---

## Dénominateurs par type de service

Le dénominateur n'est pas un seul nombre — c'est un groupe différent pour chaque service. CPN mesure contre les grossesses, BCG contre les naissances vivantes, Penta contre les nourrissons survivants.

<div style="font-size: 0.85em;">

| Service | Population cible (dénominateur) |
|---|---|
| **CPN1, CPN4** | Femmes enceintes sur la période |
| **Accouchement assisté** | Femmes enceintes (accouchements attendus) |
| **Soins postnatals — mère** | Naissances vivantes récentes / femmes en postpartum |
| **BCG (à la naissance)** | Naissances vivantes |
| **PENTA1, PENTA3** | Nourrissons survivants dans la cohorte d'âge éligible |
| **Rougeole 1 (9 mois)** | Nourrissons survivants âgés de 9 à 12 mois |
| **PNC1 — nouveau-né** | Naissances vivantes |

</div>

---

## Comment FASTR déduit le dénominateur

FASTR remonte la chaîne pour estimer la population cible à partir de ce que les formations sanitaires rapportent déjà.

**Exemple.** Une enquête dit que 80% des femmes enceintes reçoivent une visite CPN1. Le SIGS rapporte 10 000 visites CPN1. Donc il y a approximativement **10 000 ÷ 0,80 = 12 500 grossesses** sur cette période.

À partir du nombre de grossesses, la cascade démographique donne les accouchements, naissances vivantes et nourrissons survivants — en utilisant des taux propres au pays pour pertes de grossesse, mort-nés, jumeaux et mortalité infantile.

![La chaîne de calcul des dénominateurs h:220](../../resources/diagrams_fr/denominator_cascade_example.svg)

---

## Comment FASTR déduit le dénominateur à partir du HMIS

FASTR part de ce que les formations sanitaires rapportent et **remonte la chaîne** pour estimer la population cible de chaque indicateur.

**Exemple** : l'enquête dit que 80% des femmes enceintes font une CPN1. Le HMIS rapporte 10 000 CPN1. → Donc il y a environ **10 000 ÷ 0,80 = 12 500 grossesses**.

À partir de ce chiffre, FASTR calcule les accouchements, naissances, naissances vivantes, et nourrissons éligibles — en ajustant pour les pertes de grossesse, les jumeaux, les mort-nés, etc.

![La chaîne de calcul des dénominateurs h:220](../../resources/diagrams_fr/denominator_cascade_example.svg)
