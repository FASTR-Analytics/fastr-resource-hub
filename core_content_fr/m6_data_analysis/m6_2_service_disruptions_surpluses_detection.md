---
marp: true
theme: fastr
paginate: true
---

## Détection des perturbations et excédents de services

L'approche FASTR pour détecter les perturbations et excédents de services utilise la **régression de séries temporelles interrompues (ITS)** avec des effets fixes au niveau de l'établissement. Ce cadre statistique permet une interprétation et une comparaison plus significatives des données de comptage entre les zones infranationales, permettant des analyses que les données brutes seules ne peuvent fournir.

En se concentrant sur les changements et tendances significatifs plutôt que sur les chiffres bruts, cette approche soutient une analyse plus précise et comparable. Les changements importants et inattendus antérieurs dans les données historiques sont supprimés pour établir une référence propre. Les changements de volume inattendus sont estimés en comparant les volumes observés aux volumes attendus basés sur les tendances historiques et la saisonnalité.

---

## Fonctionnement de la détection des perturbations

<div style="display: flex; gap: 1em; align-items: flex-start;">
<div style="flex: 1; font-size: 0.85em;">

L'analyse se déroule en quatre étapes. Premièrement, nous **utilisons les données passées pour établir des attentes** en examinant plusieurs années de données historiques pour comprendre le schéma typique de chaque mois, en tenant compte des changements saisonniers réguliers.

Deuxièmement, nous **repérons les changements inhabituels** en comparant les volumes de services actuels à ces attentes. Les volumes nettement supérieurs ou inférieurs aux attentes sont signalés comme des changements inhabituels nécessitant une investigation.

Troisièmement, nous **gérons les perturbations passées** en ajustant les données historiques pour supprimer les changements importants et inattendus antérieurs. Cela garantit que les événements ponctuels ne faussent pas notre compréhension de ce qui constitue une prestation de services "normale".

Quatrièmement, nous **détectons les perturbations dans le temps** en examinant les tendances pour identifier les changements clairs dans l'utilisation des services de santé sur plusieurs mois, en distinguant les fluctuations temporaires des changements durables.

</div>
<div style="flex: 1;">

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

---

## Comparaison de la détection des perturbations avec DHIS2

La détection des perturbations étend l'analyse de l'utilisation des services en utilisant des approches statistiques non disponibles dans DHIS2. Le cadre de régression permet plusieurs capacités qui améliorent la simple visualisation des tendances.

Le modèle **tient compte de la saisonnalité** lors du calcul des valeurs attendues, garantissant que les schémas saisonniers ne sont pas confondus avec des perturbations. Il **exclut les changements historiques inhabituels** afin que les événements ponctuels n'influencent pas la référence. **Les données historiques servent de contexte** pour établir les niveaux de service attendus, et le cadre **détecte systématiquement les schémas de perturbation et de reprise**.

Plus important encore, cette approche **quantifie les changements avec une méthodologie robuste** plutôt que de s'appuyer sur l'observation visuelle des fluctuations de tendance. Cela améliore la capacité à interpréter et comparer les données d'utilisation entre les zones nationales et infranationales **sans nécessiter de dénominateurs de population**.
