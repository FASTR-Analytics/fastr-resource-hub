---
marp: true
theme: fastr
paginate: true
---

## Investiguer une valeur aberrante signalée

Lorsque FASTR signale une valeur comme aberrante, posez ces cinq questions avant de décider quoi faire :

| # | Question | Que rechercher |
|---|----------|----------------|
| 1 | **Erreur de saisie ?** | Faute de frappe, zéro en trop, valeur dans le mauvais champ |
| 2 | **Problème de rapportage ?** | Rapports manquants d'autres établissements modifiant le total |
| 3 | **Événement réel ?** | Campagne, épidémie, nouvel établissement ouvert |
| 4 | **Changement de définition ?** | L'indicateur a été redéfini ou l'agrégation a changé |
| 5 | **Faut-il l'exclure ?** | Est-ce que cela déforme le tableau d'ensemble ? |

---

## Prendre la décision

En fonction de votre investigation :

- **Problème sévère** (erreur de saisie évidente, valeur non plausible) — Exclure de l'analyse
- **Préoccupation modérée** (plausible mais incertain) — Inclure avec une note explicative
- **Mineur ou explicable** (campagne, événement réel) — Inclure — cela reflète la réalité

**Essayez :** Trouvez une valeur aberrante signalée dans vos données. Parcourez les 5 questions. Quelle est votre conclusion — exclure, inclure avec réserve, ou inclure ?
