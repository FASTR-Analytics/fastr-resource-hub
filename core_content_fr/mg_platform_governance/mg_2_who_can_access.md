---
marp: true
theme: fastr
paginate: true
---

## Qui peut accéder aux données ?

- Chaque utilisateur se connecte via un **service d'authentification spécialisé** (Clerk) — la plateforme ne stocke jamais les mots de passe elle-même
- Chaque requête fait l'objet d'une **vérification d'identité** avant toute autre action ; aucune porte dérobée dans le système en production
- **Deux niveaux de permissions** : rôles au niveau de l'instance (voir les données, modifier les paramètres) et rôles par projet (modifier ce projet)
- Un petit groupe d'administrateurs identifiés assure l'installation et le support

<!--
- L'authentification est gérée par Clerk, un fournisseur d'identité dédié ; l'identité est vérifiée à chaque requête avant toute action.
- Les permissions sont stockées en base de données et vérifiées à chaque requête — un utilisateur ne peut pas s'arroger un accès qui ne lui a pas été accordé.
- Le contournement d'authentification n'existe que pour le développement local et est explicitement désactivé en production.
-->
