---
marp: true
theme: fastr
paginate: true
---

## Chaque pays est entièrement séparé

- Chaque pays fonctionne comme une **installation complètement distincte** : sa propre application, sa propre base de données, son propre stockage
- **Rien n'est partagé** entre les pays — ni base de données commune, ni fichiers communs
- Il n'existe **aucun chemin technique** par lequel les données d'un pays pourraient atteindre le système d'un autre pays, même par accident
- Au sein d'un pays, chaque projet est également cloisonné — ses graphiques et rapports lui sont propres, et ses chiffres viennent uniquement du paquet de résultats qui lui est rattaché

<!--
- L'isolation est structurelle, pas seulement une règle : conteneurs séparés, bases PostgreSQL séparées, répertoires de stockage séparés par pays.
- À l'intérieur d'un pays : le contenu d'édition de chaque projet (graphiques, rapports, présentations) est isolé par projet ; les résultats calculés résident dans des paquets de résultats versionnés générés au niveau de l'instance, et un projet ne lit que le paquet qui lui est rattaché.
- C'est la réponse la plus forte à « nos données pourraient-elles fuir vers un autre pays ou une autre équipe » — l'architecture le rend impossible, pas seulement interdit.
-->
