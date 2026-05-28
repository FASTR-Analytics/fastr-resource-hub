---
marp: true
theme: fastr
paginate: true
---

## Comment fonctionne l'ajustement de la complétude

Un établissement qui omet un mois de rapportage apparaît, dans les données brutes, comme une chute soudaine à zéro — une baisse de services qui n'a en réalité pas eu lieu. FASTR comble ces lacunes par des estimations issues d'un cadre de moyenne mobile sur six mois, ancré dans l'historique propre à l'établissement.

| Priorité | Méthode | Quand l'appliquer |
|---|---|---|
| 1 | Moyenne centrée sur 6 mois | Données suffisantes avant et après la lacune |
| 2 | Moyenne sur 6 mois vers l'avant | Lacune située au début de la série |
| 3 | Moyenne sur 6 mois vers l'arrière | Lacune située à la fin de la série |
| 4 | Moyenne historique de l'établissement | Solution de repli quand aucune fenêtre mobile n'est possible |

Résultat : les lacunes temporaires de rapportage ne se traduisent plus par des baisses artificielles du volume de services mesuré.
