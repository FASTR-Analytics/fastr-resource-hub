---
marp: true
theme: fastr
paginate: true
---

## Valeurs aberrantes

La présence de valeurs aberrantes permet de déterminer si un point de données d'une série de valeurs est extrême (anormalement élevé ou bas) par rapport aux autres points de la série.

Les valeurs aberrantes peuvent être le résultat de changements dans les activités programmatiques (comme une campagne intensifiée) ou peuvent être des problèmes de qualité des données.

Pour l'analyse FASTR, nous identifions les valeurs aberrantes qui sont des valeurs anormalement élevées par rapport au volume habituel de services déclarés par l'établissement (par exemple, les valeurs faibles ne sont pas identifiées comme des valeurs aberrantes dans l'analyse FASTR).

<!--
PRESENTER NOTES:
- La présence de valeurs aberrantes examine si un point de données dans une série de valeurs est extrême (anormalement élevé ou bas) par rapport aux autres de la série
- Les valeurs aberrantes peuvent résulter de changements dans les activités programmatiques (comme une campagne intensifiée) ou peuvent être des problèmes de qualité des données
- Pour l'analyse FASTR, nous identifions les valeurs aberrantes qui sont des valeurs anormalement élevées par rapport au volume habituel de services déclarés par l'établissement (les valeurs faibles ne sont pas identifiées comme valeurs aberrantes dans l'analyse FASTR)
- Les valeurs aberrantes sont identifiées en évaluant la variation au sein de l'établissement des rapports mensuels pour chaque indicateur
- Une valeur aberrante est définie comme : Une valeur supérieure à 10 fois l'écart absolu médian (EAM) par rapport à la valeur médiane mensuelle de l'indicateur pour chaque période, OU une valeur pour laquelle la contribution proportionnelle en volume pour un établissement, un indicateur et une période est supérieure à 80%
- ET pour laquelle : Le volume est supérieur ou égal à la médiane, le volume n'est pas manquant, et le volume est supérieur à 100
-->
