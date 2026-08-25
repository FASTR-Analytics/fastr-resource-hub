---
marp: true
theme: fastr
paginate: true
---

## Sauvegardes et récupération

- Un instantané de la base de données de chaque pays est pris **toutes les 30 minutes** et conservé 3 jours
- Des **instantanés complets du stockage** sont conservés selon un calendrier quotidien, hebdomadaire et mensuel
- Une instance pays entière peut être **reconstruite à partir d'un instantané**, même dans le pire des scénarios
- Créer ou restaurer une sauvegarde exige une **permission explicite** en plus d'une connexion valide — aucune des deux ne suffit seule

<!--
- Deux couches indépendantes : instantanés pg_dump au niveau applicatif toutes les 30 minutes (fenêtre glissante de 3 jours) pour récupérer finement après une suppression accidentelle ou un mauvais import ; instantanés de volume au niveau infrastructure (quotidien/hebdomadaire/mensuel) couvrant bases de données, fichiers et journaux.
- Les actions de sauvegarde sont contrôlées par des permissions dédiées (créer vs restaurer) et une clé côté serveur, et la restauration valide les chemins et réinitialise entièrement la base cible.
-->
