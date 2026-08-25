---
marp: true
theme: fastr
paginate: true
---

## Protection en transit et sur le serveur

- Tout le trafic entre les utilisateurs et la plateforme est **chiffré (HTTPS)**, avec des certificats renouvelés automatiquement
- Les mots de passe, clés et autres secrets **restent sur le serveur** — ils ne sont jamais envoyés aux navigateurs des utilisateurs
- L'accès direct au serveur est limité à **deux ingénieurs autorisés**, par clés cryptographiques, pas par mots de passe
- Les analyses de données s'exécutent dans des **environnements isolés et éphémères**, détruits dès qu'elles se terminent

<!--
- Terminaison TLS via nginx avec certificats gérés par certbot ; l'accès SSH se fait uniquement par clé, pour deux utilisateurs nommés.
- Les secrets (mots de passe de base de données, clés d'API) sont injectés au démarrage et jamais codés en dur ; le système refuse de démarrer s'il en manque un.
- Les modules d'analyse R s'exécutent dans des conteneurs éphémères isolés qui ne voient que le dossier de travail de leur propre projet.
-->
