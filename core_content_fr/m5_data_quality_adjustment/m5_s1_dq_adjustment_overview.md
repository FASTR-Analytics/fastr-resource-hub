---
marp: true
theme: fastr
paginate: true
---

## Ajustement de la qualité des données

**Pourquoi ajuster ?** Les valeurs aberrantes et les lacunes de rapportage identifiées dans l'évaluation de la qualité des données fausseront les estimations d'utilisation des services et de couverture si elles ne sont pas corrigées. L'objectif est de remplacer les valeurs problématiques par des estimations raisonnables basées sur les modèles historiques propres à chaque établissement.

**Comment ?** Les valeurs aberrantes et les valeurs manquantes sont remplacées à l'aide de moyennes mobiles sur 6 mois calculées à partir des données historiques de l'établissement.

**Quatre ensembles de données parallèles :** FASTR produit des versions non ajustées, ajustées pour les valeurs aberrantes uniquement, ajustées pour l'exhaustivité uniquement et ajustées pour les deux. Cela permet une analyse de sensibilité - comparer les résultats entre les scénarios pour évaluer dans quelle mesure les conclusions dépendent des choix d'ajustement.

**Exclus de l'ajustement :** Les indicateurs de mortalité (événements discrets qui ne doivent pas être lissés) et les indicateurs de faible volume (<100 événements/mois, où l'ajustement ajoute du bruit).

<!--
PRESENTER NOTES:
- Vue d'ensemble condensée de la justification et des méthodes d'ajustement
- Message clé : l'ajustement permet l'analyse malgré les limitations de qualité des données
- Quatre scénarios soutiennent l'analyse de sensibilité - important pour la transparence
- Tout ne doit pas être ajusté - mortalité et faible volume exclus
-->
