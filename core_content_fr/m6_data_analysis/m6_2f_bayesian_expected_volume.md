---
marp: true
theme: fastr
paginate: true
---

## Comment le volume attendu est construit

Pour chaque zone et chaque mois, le modèle additionne le volume attendu **des seuls établissements qui ont rapporté ce mois-là**, et le compare à ce que ces mêmes établissements ont réellement rapporté.

<div style="font-size: 0.9em;">

| | Approche antérieure | Approche bayésienne |
|---|---|---|
| **Unité modélisée** | Total du district ou de la province | Chaque établissement |
| **Rapports manquants** | Comblés, puis modélisés | Modélisés comme une question à part |
| **Volume attendu** | Tendance + saison sur le total | Tendance + saison + niveau propre à chaque établissement |
| **Incertitude** | Seuils fixes | Bande de crédibilité à 95 % |
| **Un établissement devient silencieux** | Ressemble à une baisse | Retiré des deux côtés de la comparaison |

</div>

<!--
NOTES POUR LE PRÉSENTATEUR :
- La ligne clé est la dernière. Quand un établissement cesse de rapporter, l'ancien modèle voyait une baisse du total. Le nouveau retire cet établissement de l'observé et de l'attendu pour ce mois, et la comparaison reste à périmètre égal.
- « Bande de crédibilité » : la fourchette dans laquelle le modèle s'attend à voir le volume 95 fois sur 100. Hors de la bande, c'est un signal ; dedans, c'est la variation normale.
- La bande est plus large pour les petites zones et les indicateurs à faible volume, et c'est normal : moins de données, moins de certitude.
-->
