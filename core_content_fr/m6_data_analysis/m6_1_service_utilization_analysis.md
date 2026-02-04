---
marp: true
theme: fastr
paginate: true
---

## Analyse de l'utilisation des services

L'analyse de l'utilisation des services mesure les changements dans les volumes de services de santé au fil du temps. En comparant la prestation de services sur des années consécutives, cette analyse identifie les augmentations ou les diminutions des schémas d'utilisation selon les régions et les indicateurs.

La mesure principale est le **pourcentage de variation d'une année sur l'autre**, qui quantifie les changements dans la prestation de services entre deux années consécutives. La formule calcule la différence entre les volumes de l'année en cours et de l'année précédente, exprimée en pourcentage de l'année précédente. Les changements dépassant ±10% sont signalés pour examen, car ils représentent généralement des changements significatifs dans la prestation de services plutôt que des variations normales.

---

## Comparaison de l'utilisation des services avec DHIS2

Les tendances d'utilisation des services sont couramment produites dans DHIS2. L'approche FASTR diffère de trois manières importantes :

- Ajuste pour la qualité des données (valeurs aberrantes et/ou complétude)
- Visualise les données avec l'approche du pourcentage de variation pour faciliter l'identification des fluctuations significatives dans la prestation de services
- Examine les tendances, mais utilise également les données d'utilisation des services ajustées pour des analyses supplémentaires plus complexes
