---
marp: true
theme: fastr
paginate: true
---

## Module d'utilisation des services : Paramètres de configuration

**Note :** Ces paramètres s'appliquent uniquement à l'analyse des perturbations. L'analyse de l'utilisation des services d'une année sur l'autre ne nécessite pas de configuration.

<div style="font-size: 0.8em;">

| Paramètre | Description |
|-----------|-------------|
| **Variable de comptage pour la modélisation** | Quel comptage ajusté utiliser pour calculer les valeurs attendues |
| **Variable de comptage pour la visualisation** | Quel comptage ajusté utiliser comme valeurs observées réelles |
| **Exécuter le modèle au niveau du district** | Exécuter les régressions au niveau admin_area_3. Mettre à Oui pour une analyse détaillée, Non pour une exécution plus rapide |
| **Exécuter l'analyse admin_area_4** | Exécuter l'analyse au niveau le plus fin. Avertissement : peut être très lent pour les grands ensembles de données |
| **Seuil pour les limites de contrôle basées sur MAD** | Nombre de MAD pour signaler les écarts importants. Par défaut 1,5 ; plus élevé = moins sensible |
| **Fenêtre de lissage (k)** | Taille de la fenêtre en mois pour le lissage par médiane mobile. Doit être impair. Par défaut 7 |
| **Seuil de baisse** | Signaler si la valeur réelle tombe en dessous de cette proportion de la valeur attendue. Par défaut 0,9 (baisse >= 10%) ; utiliser 0,8 pour ne signaler que les baisses importantes |
| **Seuil de différence en pourcentage** | Mettre en évidence les points où la valeur réelle diffère de la valeur attendue de plus de ce pourcentage. Par défaut 10 |

</div>

<!--
PRESENTER NOTES:
- Ces paramètres contrôlent la sensibilité de la détection des perturbations
- Seuil MAD : plus bas = plus sensible (plus de signalements), plus haut = plus conservateur
- Fenêtre de lissage : plus grande = tendances plus lisses, plus petite = capture les changements rapides
- Seuil de baisse : 0,9 signifie signaler si < 90% de la valeur attendue (baisse de 10%)
- L'analyse au niveau du district est optionnelle - augmente considérablement le temps de calcul
- Sélection de la variable de comptage : utiliser "both" pour la plupart des analyses (ajusté pour les valeurs aberrantes + complétude)
- Les paramètres peuvent être ajustés en fonction du contexte du pays et de la qualité des données
-->
