---
marp: true
theme: fastr
paginate: true
---

## Ajouter des indicateurs à votre instance

Votre instance pays contient déjà les indicateurs prioritaires SRMNIA-N. Mais elle ne contient pas forcément tous les indicateurs dont vos rapports et bulletins ont besoin.

**FASTR et DHIS2 sont deux bases de données distinctes.** Pour utiliser un indicateur DHIS2 dans FASTR, vous reliez les deux : vous importez l'indicateur depuis DHIS2 et vous le mappez à un « indicateur commun » dans la plateforme.

Le processus comporte cinq phases :

| Phase | Où ? | Quoi ? |
|---|---|---|
| 1. Identifier | DHIS2 | Trouver le nom officiel et l'UID (11 caractères) |
| 2. Documenter | Fichier Excel | Saisir le nom et l'UID avant de commencer |
| 3. Créer l'indicateur commun | FASTR | Créer le contenant : un ID commun et un libellé |
| 4. Importer l'indicateur DHIS2 | FASTR | Se connecter à DHIS2, chercher par UID, ajouter |
| 5. Mapper | FASTR | Relier l'indicateur DHIS2 importé à l'indicateur commun |
