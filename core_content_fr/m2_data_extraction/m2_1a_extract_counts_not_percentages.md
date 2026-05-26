---
marp: true
theme: fastr
paginate: true
---

## Extraire des volumes, pas des pourcentages

FASTR analyse des **volumes bruts de services**, pas des pourcentages, des proportions ou des chiffres de couverture pré-calculés.

<div class="columns">
<div>

| À extraire | À **ne pas** extraire |
|------------|------------------------|
| Visites CPN1 par établissement par mois | Taux de couverture CPN1 (%) |
| Doses Penta1 administrées | Proportion de couverture vaccinale |
| Accouchements en établissement | Indicateurs de couverture pré-calculés |

</div>
<div>

**Pourquoi des volumes, pas des pourcentages ?**

- Une valeur aberrante ne se détecte pas sur un pourcentage : il est plafonné à 100 et masque le volume sous-jacent.
- Des pourcentages ne s'additionnent pas entre établissements de tailles différentes pour obtenir un total régional.
- La plateforme construit elle-même la couverture à partir des volumes et des dénominateurs de population (**modules 5 et 6**).
- Les ajustements pour valeurs aberrantes et complétude (**modules 1 et 2**) ont besoin de volumes bruts pour fonctionner.

</div>
</div>

<!--
NOTES DU PRÉSENTATEUR :
- C'est la règle la plus importante pour l'extraction des données.
- Erreur fréquente : extraire des « data elements » DHIS2 qui contiennent déjà la couverture en %.
- Toujours extraire le numérateur (volume de services) ; la plateforme s'occupe du reste.
- Si l'indicateur DHIS2 contient « taux », « % » ou « proportion », ce n'est pas le bon champ.
- Exemple concret à utiliser : visites CPN1 (volume) vs taux de couverture CPN1 (%).
-->
