---
marp: true
theme: fastr
paginate: true
---

## Ce que l'assistant IA peut voir — et ne peut pas voir

- L'IA est **Claude, d'Anthropic** — la clé d'accès reste sur le serveur, jamais dans le navigateur
- Elle ne voit que des **chiffres agrégés et résumés** — les mêmes valeurs qu'un utilisateur voit sur un graphique
- Elle ne voit **jamais de données au niveau des enregistrements**, et elle hérite des permissions de l'utilisateur qu'elle assiste
- Chaque requête IA est **journalisée** : qui l'a utilisée, sur quel projet, avec quel usage

<!--
- L'IA agit via un ensemble fixe d'outils en lecture seule — elle ne peut pas exécuter de code ni interroger la base. La recherche web est disponible (côté serveurs Anthropic) pour les questions générales.
- Quand elle demande des données, la plateforme calcule d'abord les valeurs agrégées et n'envoie que celles-ci ; les longues listes d'identifiants (p. ex. noms d'établissements) sont résumées en nombres.
- L'IA fonctionne dans la session de l'utilisateur : elle ne peut jamais voir ce que l'utilisateur lui-même n'est pas autorisé à voir.
- Le journal d'audit enregistre l'e-mail de l'utilisateur, le projet, le modèle et l'usage en jetons pour chaque requête ; des limites quotidiennes et hebdomadaires s'appliquent.
-->
