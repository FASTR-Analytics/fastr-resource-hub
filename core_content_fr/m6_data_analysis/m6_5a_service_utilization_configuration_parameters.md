---
marp: true
theme: fastr
paginate: true
---

<!-- _class: compact -->
## Module d'utilisation des services : Paramètres de configuration

**Note :** Ces paramètres s'appliquent uniquement à l'analyse des perturbations. L'analyse de l'utilisation des services d'une année sur l'autre ne nécessite pas de configuration.

<div style="font-size: 0.75em;">

| Paramètre | Description |
|-----------|-------------|
| **Variable de comptage pour modélisation** | Comptage ajusté utilisé pour calculer les valeurs attendues |
| **Variable de comptage pour visualisation** | Comptage ajusté tracé comme valeur observée réelle |
| **Modèle au niveau du district** | Régressions à l'unité administrative 3. Oui = détaillé ; Non = plus rapide |
| **Analyse à l'unité administrative 4** | Niveau le plus fin. Lent sur les grands jeux de données |
| **Seuil MAD** | Nombre de MAD signalant les écarts importants. Par défaut 1,5 ; plus élevé = moins sensible |
| **Fenêtre de lissage (k)** | Mois dans la médiane mobile (impair). Par défaut 7 |
| **Seuil de baisse** | Signaler si réel < X × attendu. Par défaut 0,9 (baisse ≥10%) ; 0,8 = baisses importantes seulement |
| **Seuil de différence %** | Signaler si réel diffère de l'attendu de > X%. Par défaut 10 |

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
