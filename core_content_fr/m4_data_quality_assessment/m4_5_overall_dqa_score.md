---
marp: true
theme: fastr
paginate: true
---

## Score résumé de la qualité des données

Les résultats des contrôles de valeurs aberrantes, de complétude et de cohérence sont combinés en un score AQD global pour un ensemble d'indicateurs clés (Penta1, CPN1, OPD).

**Deux mesures complémentaires :**

- **Score AQD global :** Pourcentage d'établissements-mois passant **tous** les contrôles de qualité. Un établissement-mois obtient 100% uniquement si tous les indicateurs clés sont complets, sans valeurs aberrantes et cohérents
- **Score AQD moyen :** Moyenne du score complétude-valeurs aberrantes et du score de cohérence. Capture les progrès partiels même lorsque tous les contrôles ne sont pas réussis

**Un établissement-mois a une qualité de données adéquate lorsque :**

- Toutes les données des indicateurs clés sont rapportées (complets)
- Aucune valeur n'est signalée comme aberrante
- Les seuils de cohérence sont atteints pour les paires d'indicateurs disponibles (ex. Penta1/Penta3, CPN1/CPN4)

---

## Guide d'interprétation rapide

| Plage de score | Ce que cela signifie | Que faire |
|----------------|----------------------|-----------|
| **Au-dessus de 80 %** | Fiable — utiliser en confiance pour l'analyse | Procéder à l'analyse |
| **60-80 %** | Utilisable avec prudence — quelques lacunes de qualité | Noter les limites, investiguer les dimensions faibles |
| **En dessous de 60 %** | Investiguer avant d'utiliser | Identifier quelle dimension (complétude, valeurs aberrantes, cohérence) tire le score vers le bas |

**Essayez :** Vérifiez le score AQD global de votre région. Est-il au-dessus ou en dessous de 80 % ? Si en dessous, examinez les scores par dimension — laquelle nécessite le plus d'attention ?
