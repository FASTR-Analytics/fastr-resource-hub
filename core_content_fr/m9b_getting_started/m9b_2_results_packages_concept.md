---
marp: true
theme: fastr
paginate: true
---

## D'où viennent les chiffres d'un projet

**Les données vivent au niveau de l'instance.** Les administrateurs les importent depuis DHIS2, une fois pour tout le pays.

**Les analyses sont calculées dans un paquet de résultats.** Un administrateur sélectionne les modules d'analyse et génère un paquet — un ensemble versionné de résultats déjà calculés.

**Votre projet lit un paquet.** Chaque graphique, tableau et rapport du projet s'appuie sur le paquet qui lui est rattaché.

- Un nouveau mois de données ? → nouveau paquet → les projets basculent dessus
- L'onglet **Paquet de résultats** du projet montre quel paquet est utilisé et sa date
- Cochez **« Toujours utiliser le paquet épinglé de l'instance »** et votre projet suit automatiquement le paquet de référence

<!--
NOTES PRÉSENTATEUR :
- Diapositive concept, ~5 min, avant que les participants ne se demandent pourquoi il n'y a pas de « données » dans leur projet.
- Message clé : les participants n'exécutent jamais d'analyses. Les admins importent + génèrent ; les projets lisent.
- Le réflexe quand les chiffres semblent anciens : l'onglet Paquet de résultats — quel paquet, quelle date.
- Analogie qui fonctionne : l'instance est la cuisine, le paquet est le plat prêt, le projet est la table où il est servi.
-->
