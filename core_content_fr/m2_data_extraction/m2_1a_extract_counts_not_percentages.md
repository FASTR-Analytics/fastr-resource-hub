---
marp: true
theme: fastr
paginate: true
---

## Extraire des volumes, pas des pourcentages

FASTR analyse des **volumes bruts de services** — le nombre réel de services déclarés par chaque établissement chaque mois. Il **n'accepte pas** de pourcentages, de proportions ou de chiffres de couverture pré-calculés.

| À extraire | À **ne pas** extraire |
|------------|------------------------|
| Nombre de visites CPN1 par établissement et par mois | Taux de couverture CPN1 (%) |
| Nombre de doses Penta1 administrées | Proportion de couverture vaccinale |
| Nombre d'accouchements en établissement | Indicateurs de couverture pré-calculés |

**Pourquoi ?**

- On ne peut pas détecter une valeur aberrante sur un pourcentage — il est plafonné à 100 et masque le volume sous-jacent de l'établissement.
- On ne peut pas additionner des pourcentages entre établissements de tailles différentes pour obtenir un total régional.
- La plateforme calcule elle-même la couverture en divisant les volumes par les dénominateurs de population dans les **modules 5 et 6**.
- Les ajustements pour valeurs aberrantes et complétude (**modules 1 et 2**) sont des méthodes statistiques qui exigent des volumes bruts.

<!--
PRESENTER NOTES:
- C'est la règle la plus importante pour l'extraction des données
- Erreur fréquente : extraire des « data elements » DHIS2 qui contiennent déjà la couverture en %
- Toujours extraire le numérateur (volume de services) — la plateforme s'occupe du reste
- Si votre indicateur DHIS2 contient « taux », « % » ou « proportion », ce n'est pas le bon
- Montrer un exemple concret aux participants : visites CPN1 (volume) vs taux de couverture CPN1 (%)
-->
