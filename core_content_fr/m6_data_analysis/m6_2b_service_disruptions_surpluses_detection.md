---
marp: true
theme: fastr
paginate: true
---

<!-- _class: output -->
## Fonctionnement de la détection des perturbations

<div class="output-layout">
<div class="output-text">

L'analyse se déroule en quatre étapes. Premièrement, nous **utilisons les données passées pour établir des attentes** en examinant plusieurs années de données historiques pour comprendre les schémas mensuels typiques et les variations saisonnières.

Deuxièmement, nous **repérons les changements inhabituels** en comparant les volumes de services actuels aux attentes. Les écarts importants sont signalés pour investigation.

Troisièmement, nous **gérons les perturbations passées** en ajustant les données historiques pour supprimer les changements importants et inattendus. Cela empêche les événements ponctuels de fausser notre référence de prestation « normale ».

Quatrièmement, nous **détectons les perturbations dans le temps** en examinant les tendances sur plusieurs mois pour distinguer les fluctuations temporaires des changements durables.

</div>
<div class="output-viz">

![Détection des perturbations](../../resources/diagrams/disruption_chart.png)

</div>
</div>

<!--
PRESENTER NOTES:
1. Utiliser les données passées pour établir des attentes : Nous commençons par examiner les quelques années passées de données sur les services de santé pour comprendre le schéma typique de chaque mois. Par exemple, si nous voyons que certains services ont généralement des volumes plus élevés ou plus bas pendant certains mois, nous utilisons ce schéma pour établir des attentes "normales" pour chaque mois à venir. Cette étape nous aide à tenir compte des changements saisonniers réguliers, comme une augmentation des visites liées à la grippe pendant les mois d'hiver.
2. Repérer les changements inhabituels : Une fois que nous savons à quoi ressemble la "normalité", nous pouvons comparer les volumes de services actuels à ces attentes. Si nous voyons que le nombre de personnes utilisant un service de santé particulier est nettement supérieur ou inférieur aux attentes, nous le signalons comme un changement inhabituel. Cela pourrait être dû à des facteurs comme une épidémie, une catastrophe naturelle ou même des changements dans la politique de santé.
3. Gérer les perturbations passées : Pour maintenir notre analyse précise, nous ajustons nos données historiques en supprimant les grands changements inattendus antérieurs. Cela garantit que les événements ponctuels du passé ne faussent pas notre compréhension de ce qui est "normal" aujourd'hui.
4. Détecter les perturbations dans le temps : Enfin, nous examinons les tendances au fil du temps pour voir s'il y a des changements clairs dans l'utilisation des services de santé. Par exemple, s'il y a une baisse des vaccinations de routine sur plusieurs mois, nous pouvons l'identifier comme une perturbation à plus long terme. En surveillant ces tendances, nous obtenons une meilleure idée de si les changements sont simplement saisonniers ou pourraient être dus à des problèmes plus importants et durables qui nécessitent une attention.
-->
