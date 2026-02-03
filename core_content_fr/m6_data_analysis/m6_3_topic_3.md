---
marp: true
theme: fastr
paginate: true
---

## Détection des perturbations

Notre approche des interruptions de service et des excédents utilise une régression de séries temporelles interrompues avec des effets fixes au niveau de l'établissement. Les changements antérieurs importants et inattendus dans les données historiques sont supprimés. Les changements de volume inattendus sont estimés en comparant le volume observé au volume attendu sur la base des tendances historiques et de la saisonnalité.

---

## Perturbations et excédents

<div style="display : flex ; gap : 1.5em ; align-items : flex-start ;">
<div style="flex : 1 ;">

**Les perturbations** sont signalées lorsque les volumes sont inférieurs aux niveaux prévus, ce qui indique des obstacles potentiels à l'accès, des pénuries de ressources ou des defaillances du système.

**Les excédents** sont signalés lorsque les volumes dépassent les attentes, ce qui peut indiquer une augmentation de la demande, une surdéclaration ou des changements dans la prestation des services.

</div>
<div style="flex : 2 ;">

![Exemple de perturbation et de surplus h:300](../../resources/diagrams/disruption_chart.png)

</div>
</div>

---

## Comment ça marche

**Nous examinons les données des dernières années pour comprendre le modèle typique de chaque mois, en tenant compte des changements saisonniers réguliers.**

**Repérer les changements inhabituels:** Nous comparons les volumes de services actuels aux prévisions. Si nous constatons que les volumes sont beaucoup plus élevés ou plus bas que prévu, nous le signalons comme un changement inhabituel.

**Nous ajustons les données historiques en supprimant les changements importants et inattendus survenus précédemment, afin d'éviter que des événements ponctuels ne faussent notre compréhension de ce qui est "normal"**

**Détecter les perturbations dans le temps:** Nous examinons les tendances pour voir s'il y a des changements clairs dans l'utilisation des services de santé sur plusieurs mois.

---

## Comparaison avec DHIS2

Extension de l'analyse de l'utilisation des services, en utilisant des approches statistiques plus complexes qui ne sont pas disponibles dans DHIS2.

En utilisant un cadre de régression, nous sommes en mesure de :

- Tenir compte de la saisonnalité
- Exclure les changements inhabituels afin de s'assurer que des événements ponctuels n'influencent pas les tendances normales
- Utiliser les données historiques comme base de référence pour le contexte
- Détecter les perturbations et les modèles de reprise
- Quantifier les changements à l'aide d'une méthodologie solide plutôt que d'observer simplement les fluctuations d'une ligne de tendance

Cela améliore la capacité d'interpréter et de comparer les données d'utilisation à travers les zones nationales et sous-nationales sans avoir besoin de dénominateurs de population.
