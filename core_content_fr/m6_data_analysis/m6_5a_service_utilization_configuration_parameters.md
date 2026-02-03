---
marp: true
theme: fastr
paginate: true
---

## module d'utilisation des services : Paramètres de configuration

<div style="font-size : 0.8em ;">

| Paramètre | Description |
|-----------|-------------|
| **Variable de comptage pour la modélisation** | Variable de comptage ajustée à utiliser pour le calcul des valeurs attendues |
| **Variable de comptage pour la visualisation** | Variable de comptage ajustée à utiliser comme valeurs observées réelles |
| **Exécuter le modèle au niveau district** | Exécuter les régressions au niveau admin_area_3. Oui pour une analyse détaillée, Non pour une exécution plus rapide |
| **Exécuter l'analyse admin_area_4** | Lancer l'analyse au niveau le plus fin. Avertissement : peut être très lent pour les grands ensembles de données |
| **Seuil pour les limites de contrôle basées sur les MAD** | Nombre de MAD pour signaler les écarts importants. Par défaut, 1,5 ; plus élevé = moins sensible |
| **Fenêtre de lissage (k)** | Taille de la fenêtre en mois pour le lissage de la médiane glissante. Doit être impair. Valeur par défaut : 7 |
| **Seuil de baisse** | Indicateur si la valeur réelle est inférieure à cette proportion de la valeur attendue. Par défaut, 0,9 (baisse ≥10%) ; utilisez 0,8 pour ne signaler que les fortes baisses |
| **Seuil de différence en pourcentage** | Mettre en évidence les points où la différence entre la valeur réelle et la valeur attendue est supérieure à ce pourcentage. Valeur par défaut : 10 |

</div>
