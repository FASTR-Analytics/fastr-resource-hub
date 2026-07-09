---
marp: true
theme: fastr
paginate: true
---

## Conventions de nommage des indicateurs communs

**Les libellés** apparaissent dans vos visualisations : gardez-les courts. Les libellés trop longs deviennent illisibles sur les graphiques.

- À éviter : *Nombre total de consultations prénatales réalisées au premier trimestre dans les établissements publics*
- À privilégier : *CPN1 (établissements publics)*

**Les noms d'indicateurs communs** doivent rester compréhensibles et ne pas reprendre un code DHIS2 brut. Adoptez le format `snake_case` en minuscules, la convention utilisée pour les variables en analyse de données.

- À éviter : `uTj3xK9pLm2` (UID brut) ou `CPN1 Premier Trimestre` (espaces et majuscules)
- À privilégier : `cpn1_premier_trimestre`, `taux_mortalite_maternelle`, `nb_accouchements_assistes`
