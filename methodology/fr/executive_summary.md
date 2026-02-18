<!-- AUTO-TRANSLATED from executive_summary.md -->
<!-- Add REVIEWED marker after human review to protect from overwrite -->

<!-- DERNIER EXAMEN : Nous sommes encore en train de rédiger d'autres sections de la méthodologie -->

# Résumé

> **Note:** Le contenu de cette section est susceptible d'être révisé.

## FASTR RMNCAH-N surveillance de l'utilisation des services

Cette documentation décrit l'approche FASTR pour le suivi de la prestation des services de santé reproductive, maternelle, néonatale, infantile et adolescente et de nutrition (RMNCAH-N) en utilisant les données du système d'information sur la gestion de la santé (SIGS). La méthodologie guide les utilisateurs à travers un processus de bout en bout : de la définition des questions prioritaires et de l'extraction des données à la communication des résultats pour la prise de décision, en passant par l'analyse basée sur une plateforme.

## Contexte

La Facilité de financement mondiale (GFF) soutient les efforts menés par les pays pour améliorer l'utilisation opportune des données pour la prise de décision par le biais des **évaluations fréquentes et des outils du système de santé pour la résilience (FASTR)**. Les systèmes d'information sur la gestion de la santé dans les pays à revenu faible et intermédiaire génèrent mensuellement des données de routine sur la prestation de services au niveau des établissements. Cependant, ces données sont souvent affectées par des rapports incomplets, des statistiques aberrantes et des incohérences internes qui limitent leur utilité analytique.

Les enquêtes traditionnelles auprès des ménages (EDS, MICS) fournissent des estimations validées de la couverture, mais sont menées peu fréquemment (généralement tous les 3 à 5 ans), ce qui crée des lacunes dans la disponibilité de données opportunes pour le suivi des tendances de la prestation de services, la détection des perturbations et le suivi des progrès accomplis dans la réalisation des objectifs du système de santé. FASTR répond à ces contraintes grâce à un processus analytique structuré qui évalue et corrige systématiquement les problèmes de qualité des données de routine du SIGS.

## La méthodologie FASTR

### Identification des questions et des indicateurs prioritaires

La méthodologie FASTR commence par l'identification des questions analytiques prioritaires et la sélection des indicateurs correspondants. Cette étape est entreprise en collaboration avec les ministères de la santé et les parties prenantes concernées afin de définir des cas d'utilisation pertinents pour les politiques, d'assurer l'alignement sur les stratégies nationales de santé et de spécifier les exigences en matière d'extraction de données des systèmes DHIS2.

### Extraction des données

Les données au niveau de l'établissement sont extraites directement du DHIS2 via des API à une résolution mensuelle et structurées dans la plateforme pour soutenir l'évaluation de la qualité des données, l'analyse infranationale et le suivi des tendances.

### La plateforme d'analyse FASTR

Ces données structurées sont traitées au sein de la plateforme analytique FASTR, qui fournit un environnement standardisé pour la mise en œuvre d'un ensemble modulaire de composants analytiques. Les utilisateurs configurent les hiérarchies administratives et les mappages d'installations et exécutent les modules analytiques pour générer des mesures de la qualité des données, des analyses de l'utilisation des services et des estimations de la couverture d'une manière cohérente et reproductible.

### Module de plate-forme 1 : Évaluation de la qualité des données

Ce module applique des méthodes statistiques pour évaluer la fiabilité des données de routine des établissements de santé. Il identifie les valeurs extrêmes à l'aide de l'écart absolu médian, évalue l'exhaustivité des rapports au niveau de l'établissement et de l'indicateur, et vérifie la cohérence interne entre les indicateurs connexes (par exemple, en s'assurant que les valeurs de la CPN1 ne sont pas inférieures à celles de la CPN4). Les résultats comprennent des scores de qualité des données au niveau de l'établissement et des drapeaux à utiliser pour l'ajustement et l'analyse ultérieurs des données.

### Module 2 de la plateforme : Ajustement de la qualité des données

Le module d'ajustement de la qualité des données produit quatre versions parallèles de l'ensemble de données : (i) données non ajustées, (ii) données ajustées pour les valeurs aberrantes uniquement, (iii) données ajustées pour les valeurs manquantes uniquement, et (iv) données ajustées à la fois pour les valeurs aberrantes et les valeurs manquantes. L'ajustement pour les valeurs aberrantes remplace les observations marquées par des médianes glissantes sur six mois, tandis que les valeurs manquantes sont imputées en utilisant la même approche hiérarchique. Le fait de conserver les quatre versions favorise la transparence et l'analyse de sensibilité.

### Module 3 de la plateforme : Analyse de l'utilisation des services

Ce module applique des techniques de contrôle des processus statistiques pour détecter les écarts entre les volumes de services et les modèles attendus, après avoir pris en compte la saisonnalité et les tendances à long terme. Des modèles de régression par panel sont estimés aux niveaux national, régional et du district pour quantifier l'ampleur et la signification statistique des déficits ou des excédents de services pendant les périodes de perturbation identifiées.

### Module 4 de la plateforme : Estimation de la couverture

Le module d'estimation de la couverture dérive les dénominateurs de la population cible en combinant les volumes de services SIGS avec les informations sur la couverture des enquêtes auprès des ménages et les projections démographiques. Des séries de dénominateurs multiples sont générées en utilisant des indicateurs SIGS alternatifs et des hypothèses démographiques, y compris des ajustements pour les facteurs biologiques. Les projections de couverture pour les années postérieures à l'enquête sont produites en appliquant les changements annuels dérivés du SIGS aux données de base de l'enquête.

### Communication des résultats

Les résultats analytiques sont traduits en idées pertinentes pour les politiques par le biais d'une interprétation et d'une visualisation structurées. Les résultats sont adaptés à différents publics et compilés dans des rapports de routine pour soutenir le suivi, la planification et la prise de décision.

## Caractéristiques principales

**Processus de bout en bout** : La méthodologie couvre l'ensemble du processus, de la définition des questions à l'extraction des données, en passant par l'analyse basée sur la plateforme et la communication des résultats, et pas seulement les modules analytiques.

**Options d'ajustement multiples** : La plateforme génère quatre versions de données ajustées (pas d'ajustement, valeurs aberrantes uniquement, données manquantes uniquement, ou les deux), ce qui permet aux utilisateurs de tester l'impact des différentes hypothèses de qualité des données sur les résultats.

**Flexibilité géographique** : L'analyse fonctionne aux niveaux national et sous-national, avec des résultats disponibles aux niveaux des zones administratives 2 et 3 lorsque la qualité des données le permet.

**Paramètres personnalisables** : Tous les seuils, fenêtres temporelles et méthodes d'ajustement peuvent être modifiés pour s'adapter aux données et au contexte propres à chaque pays.

---

**Dernière mise à jour** : 07-01-2026
**Contact** : Équipe du projet FASTR
