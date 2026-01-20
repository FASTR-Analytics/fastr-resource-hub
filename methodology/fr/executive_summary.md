<!-- REVIEW LAST: We are still drafting other sections of the methodology -->
<!-- TRANSLATION STATUS: Draft - Needs human review -->

# Résumé exécutif


## Suivi de l'utilisation des services SRMNIA-N avec FASTR

Cette documentation décrit l'approche FASTR pour le suivi de la prestation des services de santé reproductive, maternelle, néonatale, infantile, de l'adolescent et nutritionnelle (SRMNIA-N) à partir des données du système d'information de gestion de la santé (SIGS). La méthodologie guide les utilisateurs à travers un processus complet : de la définition des questions prioritaires et l'extraction des données, en passant par l'analyse sur plateforme, jusqu'à la communication des résultats pour la prise de décision.

## Contexte

Le Mécanisme de Financement Mondial (GFF) soutient les efforts menés par les pays pour améliorer l'utilisation rapide des données pour la prise de décision grâce à **FASTR (Frequent Assessments and Health System Tools for Resilience)**. Les systèmes d'information de gestion de la santé dans les pays à revenu faible et intermédiaire génèrent des données mensuelles sur la prestation de services au niveau des établissements. Cependant, ces données sont fréquemment affectées par des problèmes d'incomplétude des rapports, de valeurs aberrantes statistiques et d'incohérences internes qui limitent leur utilité analytique.

Les enquêtes ménages traditionnelles (EDS, MICS) fournissent des estimations de couverture validées mais sont réalisées peu fréquemment (généralement tous les 3 à 5 ans), créant des lacunes dans la disponibilité de données actualisées pour le suivi des tendances de prestation de services, la détection des perturbations et le suivi des progrès vers les objectifs du système de santé. FASTR répond à ces contraintes grâce à un processus analytique structuré qui évalue et ajuste systématiquement les problèmes de qualité des données dans les données SIGS de routine.

## La méthodologie FASTR

### Identification des questions prioritaires et des indicateurs

La méthodologie FASTR commence par l'identification des questions analytiques prioritaires et la sélection des indicateurs correspondants. Cette étape est entreprise en collaboration avec les Ministères de la Santé et les parties prenantes concernées pour définir des cas d'utilisation pertinents pour les politiques, assurer l'alignement avec les stratégies nationales de santé et spécifier les exigences d'extraction de données des systèmes DHIS2.

### Extraction des données

Les données au niveau des établissements sont extraites directement de DHIS2 via des API à résolution mensuelle et structurées au sein de la plateforme pour soutenir l'évaluation de la qualité des données, l'analyse infranationale et le suivi des tendances.

### La plateforme analytique FASTR

Ces données structurées sont traitées au sein de la plateforme analytique FASTR, qui fournit un environnement standardisé pour la mise en œuvre d'un ensemble modulaire de composants analytiques. Les utilisateurs configurent les hiérarchies administratives et les cartographies des établissements et exécutent des modules analytiques pour générer des métriques de qualité des données, des analyses de l'utilisation des services et des estimations de couverture de manière cohérente et reproductible.

### Module plateforme 1 : Évaluation de la qualité des données

Ce module applique des méthodes statistiques pour évaluer la fiabilité des données de routine des établissements de santé. Il identifie les valeurs extrêmes en utilisant l'écart absolu médian, évalue la complétude des rapports aux niveaux des établissements et des indicateurs, et vérifie la cohérence interne entre les indicateurs liés (par exemple, s'assurer que les valeurs CPN1 ne sont pas inférieures à CPN4). Les résultats comprennent des scores de qualité des données au niveau des établissements et des signalements pour utilisation dans l'ajustement et l'analyse ultérieurs des données.

### Module plateforme 2 : Ajustement de la qualité des données

Le module d'ajustement de la qualité des données produit quatre versions parallèles du jeu de données : (i) données non ajustées, (ii) données ajustées pour les valeurs aberrantes uniquement, (iii) données ajustées pour les valeurs manquantes uniquement, et (iv) données ajustées pour les valeurs aberrantes et manquantes. L'ajustement des valeurs aberrantes remplace les observations signalées par des médianes glissantes sur six mois, tandis que les valeurs manquantes sont imputées selon la même approche hiérarchique. La conservation des quatre versions favorise la transparence et l'analyse de sensibilité.

### Module plateforme 3 : Analyse de l'utilisation des services

Ce module applique des techniques de contrôle statistique des processus pour détecter les écarts dans les volumes de services par rapport aux schémas attendus après prise en compte de la saisonnalité et des tendances à long terme. Des modèles de régression sur panel sont estimés aux niveaux national, régional et de district pour quantifier l'ampleur et la signification statistique des déficits ou excédents de services pendant les périodes de perturbation identifiées.

### Module plateforme 4 : Estimation de la couverture

Le module d'estimation de la couverture dérive les dénominateurs de population cible en combinant les volumes de services SIGS avec les informations de couverture des enquêtes ménages et les projections de population. Plusieurs séries de dénominateurs sont générées en utilisant des indicateurs SIGS alternatifs et des hypothèses démographiques, y compris des ajustements pour les facteurs biologiques. Les projections de couverture pour les années post-enquête sont produites en appliquant les changements annuels dérivés du SIGS aux valeurs de référence des enquêtes.

### Communication des résultats

Les résultats analytiques sont traduits en informations pertinentes pour les politiques grâce à une interprétation et une visualisation structurées. Les résultats sont adaptés aux différents publics et compilés dans des produits de rapportage réguliers pour soutenir le suivi continu, la planification et la prise de décision.

## Caractéristiques clés

**Processus de bout en bout** : La méthodologie couvre l'ensemble du flux de travail, de la définition des questions à l'extraction des données, l'analyse sur plateforme et la communication des résultats — pas seulement les modules analytiques.

**Options d'ajustement multiples** : La plateforme génère quatre versions de données ajustées (sans ajustement, valeurs aberrantes uniquement, données manquantes uniquement, ou les deux), permettant aux utilisateurs de tester comment différentes hypothèses de qualité des données affectent les résultats.

**Flexibilité géographique** : L'analyse fonctionne aux niveaux national et infranational, avec des résultats disponibles aux niveaux zone administrative 2 et zone administrative 3 lorsque la qualité des données le permet.

**Paramètres personnalisables** : Tous les seuils, fenêtres temporelles et méthodes d'ajustement peuvent être modifiés pour s'adapter aux données et au contexte spécifiques du pays.

---

**Dernière mise à jour** : 07-01-2026
**Contact** : Équipe du projet FASTR
