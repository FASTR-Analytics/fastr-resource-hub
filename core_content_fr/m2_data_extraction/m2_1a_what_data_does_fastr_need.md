---
marp: true
theme: fastr
paginate: true
---

## De quelles données FASTR a-t-il besoin ?

FASTR a besoin des **données de routine des établissements de santé** — les mêmes données que les établissements rapportent chaque mois via le DHIS2.

**Indicateurs RMNCAH-N de base** — visites CPN, accouchements institutionnels, soins postnataux, vaccinations (BCG, Penta1, Penta3), consultations externes

**Indicateurs spécifiques au pays** — chaque pays ajoute des indicateurs selon ses priorités, comme paludisme, VIH/TB, nutrition ou planification familiale

**Spécifications des données**

- **Niveau établissement** — de chaque établissement individuel, pas pré-agrégé
- **Mensuel** — un point de données par établissement par mois
- **Sur la durée** — idéalement cinq ans de données historiques

**Comment les données arrivent dans FASTR** — importation directe depuis DHIS2, ou téléchargement de fichier (`.csv`)
