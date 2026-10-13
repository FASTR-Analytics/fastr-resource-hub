---
marp: true
theme: fastr
paginate: true
---

## Conventions de nommage des indicateurs

Les **libellés** apparaissent dans vos visualisations : gardez-les courts. Les libellés longs deviennent illisibles sur les graphiques.

- À éviter : *Nombre total de premières consultations prénatales dans les établissements publics*
- À préférer : *CPN1 (établissements publics)*

Les **ID de l'indicateur** doivent rester lisibles et ne jamais être un code DHIS2 brut. Utilisez le `snake_case` en minuscules, la convention standard des noms de variables en analyse de données.

- À éviter : `uTj3xK9pLm2` (ID brut) ou `CPN1 Premier Trimestre` (espaces et majuscules)
- À préférer : `anc1_first_trimester`, `maternal_mortality_rate`, `assisted_deliveries`
