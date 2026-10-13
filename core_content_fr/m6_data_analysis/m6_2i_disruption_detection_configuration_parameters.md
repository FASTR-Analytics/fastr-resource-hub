---
marp: true
theme: fastr
paginate: true
---

## Module de détection des perturbations : paramètres de configuration

**Note :** se règlent dans Résultats → Paramètres par défaut des modules. Ils s'appliquent à chaque paquet de résultats généré ensuite.

<div style="font-size: 0.75em;">

| Paramètre | Description |
|-----------|-------------|
| **Variable de comptage** | Comptage non ajusté ou ajusté pour les valeurs aberrantes. Les comptages imputés pour la complétude sont refusés : le module modélise lui-même les lacunes de rapportage. Défaut : ajusté pour les valeurs aberrantes |
| **Termes de saisonnalité de Fourier (K)** | Paires sinus/cosinus pour la saisonnalité. Défaut 2 (annuel + semestriel) ; 3–4 pour les indicateurs de type campagne comme la vitamine A |
| **Tirages a posteriori** | Oui = bandes de crédibilité correctement calibrées au niveau district, environ dix fois plus lent. Défaut non |
| **Traitement des zéros** | all = chaque zéro est un vrai rapport (défaut) ; none = les zéros sont manquants ; auto / strict = un zéro est réel seulement si un autre indicateur a été soumis ce mois-là ; detect = choix d'après les données |
| **Exclure les mois avant le premier rapport** | Ignorer les mois antérieurs au premier rapport d'un établissement, pour ne pas compter les nouveaux établissements comme silencieux. Défaut oui |
| **Grâce de fermeture (mois)** | Exclure les mois au-delà de N mois après le dernier rapport d'un établissement, comme fermeture présumée. Défaut 0 (désactivé) |

</div>

<!--
NOTES POUR LE PRÉSENTATEUR :
- La plupart des pays tournent avec les valeurs par défaut. Les deux réglages qui méritent une discussion : la politique des zéros (votre DHIS2 remplit-il des zéros automatiquement ?) et le K de Fourier pour les indicateurs de campagne.
- Les tirages a posteriori ne comptent que si les bandes au niveau district servent à décider ; pour le suivi national et provincial de routine, le défaut suffit.
- La grâce de fermeture sert aux systèmes où beaucoup d'établissements cessent définitivement de rapporter ; sinon, laissez-la désactivée.
-->
