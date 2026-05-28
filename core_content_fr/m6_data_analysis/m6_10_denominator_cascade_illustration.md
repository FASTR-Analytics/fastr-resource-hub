---
marp: true
theme: fastr
paginate: true
---

## Estimation des dénominateurs à partir de CPN1

Exemple travaillé. L'enquête dit que 80% des femmes enceintes reçoivent une visite CPN1. Le SIGS rapporte 10 000 visites CPN1 sur la période, donc 10 000 ÷ 0,80 ≈ 12 500 grossesses. À partir des grossesses, FASTR parcourt la cascade : grossesses → accouchements (appliquer le taux de perte de grossesse) → naissances vivantes (appliquer le taux de mortinatalité) → nourrissons survivant à chaque tranche d'âge (appliquer la mortalité néonatale et infantile). Chaque étape utilise des taux propres au pays issus de l'EDS la plus récente ou des statistiques d'état civil. La chaîne se termine par la population éligible pour tout service en aval — DTC, rougeole, suivi de croissance — sans avoir à interroger l'enquête pour chacun.

![Exemple de cascade de dénominateurs h:340](../../resources/diagrams_fr/denominator_cascade_example.svg)
