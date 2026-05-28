---
marp: true
theme: fastr
paginate: true
---

## Comparaison de la détection des perturbations avec DHIS2

La détection des perturbations étend l'analyse de l'utilisation des services en utilisant des approches statistiques non disponibles dans DHIS2. Le cadre de régression permet plusieurs capacités qui améliorent la simple visualisation des tendances.

Le modèle **tient compte de la saisonnalité** lors du calcul des valeurs attendues, garantissant que les schémas saisonniers ne sont pas confondus avec des perturbations. Il **exclut les changements historiques inhabituels** afin que les événements ponctuels n'influencent pas la référence. **Les données historiques servent de contexte** pour établir les niveaux de service attendus, et le cadre **détecte systématiquement les schémas de perturbation et de reprise**.

Plus important encore, cette approche **quantifie les changements avec une méthodologie robuste** plutôt que de s'appuyer sur l'observation visuelle des fluctuations de tendance. Cela améliore la capacité à interpréter et comparer les données d'utilisation entre les zones nationales et infranationales **sans nécessiter de dénominateurs de population**.
