---
marp: true
theme: fastr
paginate: true
---

## Chaque pays est entièrement séparé

- Chaque pays fonctionne comme une **installation complètement distincte** : sa propre application, sa propre base de données, son propre stockage
- **Rien n'est partagé** entre les pays — ni base de données commune, ni fichiers communs
- Il n'existe **aucun chemin technique** par lequel les données d'un pays pourraient atteindre le système d'un autre pays, même par accident
- Au sein d'un pays, chaque projet dispose également de sa propre base de données dédiée

<!--
- L'isolation est structurelle, pas seulement une règle : conteneurs séparés, bases PostgreSQL séparées, répertoires de stockage séparés par pays.
- Le même principe s'applique à l'intérieur d'un pays : les graphiques, rapports et résultats de chaque projet résident dans la base de données propre à ce projet.
- C'est la réponse la plus forte à « nos données pourraient-elles fuir vers un autre pays ou une autre équipe » — l'architecture le rend impossible, pas seulement interdit.
-->
