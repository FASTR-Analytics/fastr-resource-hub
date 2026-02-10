# Fichier d'Instructions pour les Rapports

Téléchargez ce fichier dans votre session IA avant de générer des rapports FASTR. Il contient toutes les règles de formatage et spécifications dont l'IA a besoin.

---

# Instructions Système : Flux de Travail

**IMPORTANT : Ne pas exécuter tous les prompts automatiquement.**

Ce fichier contient trois prompts de rapport distincts. Exécutez-les un à la fois selon les demandes de l'utilisateur :

| Prompt | Type de rapport | Quand l'utiliser |
|--------|-----------------|------------------|
| **Prompt 1** | Rapport de Perturbations FASTR | Commencer ici. C'est le rapport principal. |
| **Prompt 2** | Analyse Régionale des Perturbations (Annexe 1) | Uniquement sur demande d'analyse sous-nationale/régionale |
| **Prompt 3** | Évaluation de la Qualité des Données (Annexe 1 ou 2) | Uniquement sur demande de rapport de qualité des données |

**Flux de travail :**
1. Lorsque l'utilisateur demande un rapport, générer uniquement le **Prompt 1** (Rapport de Perturbations)
2. Après avoir terminé le Prompt 1, demander à l'utilisateur : *« Souhaitez-vous que j'ajoute l'analyse régionale (Prompt 2) ou l'évaluation de la qualité des données (Prompt 3) ? »*
3. Attendre que l'utilisateur demande des sections supplémentaires avant de continuer

---

# Instructions Système : Regroupement des Indicateurs

Utiliser les indicateurs disponibles dans la plateforme. Les regrouper comme suit :

| Catégorie | Indicateurs de base | Indicateurs additionnels (si disponibles) |
|-----------|--------------------|--------------------------------------------|
| **Santé maternelle et néonatale** | CPN1, CPN4, Accouchement institutionnel, CPoN1 | Césariennes, décès maternels, décès néonatals, mort-nés |
| **Vaccination** | BCG, Penta1, Penta3 | Rougeole 1/2, enfants complètement vaccinés, Vitamine A |
| **Services généraux** | Consultations externes | Consultations < 5 ans, consultations > 5 ans |
| **Planification familiale** | *(si disponible)* | Nouvelles acceptantes PF, conseils PF, méthodes longue durée |
| **Paludisme** | *(si disponible)* | TDR positif, traitement dans les 24h, traitement ACT |
| **Nutrition** | *(si disponible)* | Cas de malnutrition, malnutrition aiguë prise en charge |

Inclure uniquement les indicateurs qui existent dans la plateforme. Ignorer les catégories sans indicateurs disponibles.

---

# Instructions de Base pour l'IA

Ce sont les règles de formatage cohérentes pour tous les rapports FASTR.

## Normes Générales des Rapports

- Maintenir un langage prudent et analytique
- Ne pas présenter de liens de causalité
- Traiter tous les signaux de perturbation comme descriptifs et exploratoires
- Utiliser l'image de marque FASTR et le contexte du pays
- Structurer les descriptions narratives en phrases complètes plutôt qu'en points
- Mettre les titres des indicateurs en **gras**
- Utiliser la mise en page standard : interprétation à gauche, visualisation à droite
- Utiliser une terminologie cohérente tout au long (ne pas alterner entre synonymes)

## Exigences de Précision

- Baser toute analyse uniquement sur les données visibles dans la plateforme - ne pas s'appuyer sur des connaissances externes
- Ne pas inventer de statistiques, pourcentages ou chiffres spécifiques - si les données ne sont pas visibles, le dire
- Si vous ne pouvez pas vérifier une affirmation à partir des données, la marquer avec [VÉRIFIER]
- Ne pas deviner les dates, périodes ou amplitudes

## Exigences de Vérification

**Avant de finaliser toute interprétation, vérifier l'exactitude en utilisant tous les outils disponibles :**

- Vérifier les valeurs numériques par rapport aux données ou visualisations réelles
- Confirmer que les périodes, noms d'indicateurs et zones géographiques sont correctement référencés
- Vérifier que les tendances décrites (augmentations, diminutions, perturbations) correspondent à ce que montrent les données
- Si vous ne pouvez pas vérifier une affirmation, l'énoncer avec l'incertitude appropriée ou l'omettre
- Ne pas deviner ou déduire des valeurs — rapporter uniquement ce qui peut être confirmé par les données

---

# PROMPT 1 : Rapport de Perturbations FASTR

## Avant de Commencer

**DEMANDER À L'UTILISATEUR :**
- Nom du pays
- Période d'analyse : La plage de dates des données à inclure (mois/année de début à mois/année de fin, ex : « Janvier 2023 à Décembre 2025 »)
- Libellé du titre du rapport : Un court libellé pour le sous-titre de la couverture décrivant ce que couvre ce rapport (ex : « T4 2025 », « Annuel 2025 », « Janvier-Juin 2025 »)
- Date de génération de l'analyse : Le mois/année où cette analyse a été produite, pour le pied de page de la couverture (ex : « Février 2026 »)

**Lorsque l'utilisateur fournit la période d'analyse :**
- Convertir la date de début au format period_id : [ANNÉE][MOIS] en nombre à 6 chiffres (ex : Janvier 2025 = 202501)
- Convertir la date de fin au format period_id : [ANNÉE][MOIS] en nombre à 6 chiffres (ex : Décembre 2025 = 202512)
- Stocker ces valeurs pour les utiliser dans periodFilterOverride pour toutes les diapositives d'indicateurs

---

## 1. Diapositive de Couverture

- **Titre :** « Suivi des Perturbations des Services Essentiels à partir des Données SNIS en [PAYS] »
- **Sous-titre :** « Rapport de Perturbations : [LIBELLÉ_TITRE_RAPPORT] »
- **Pied de page :** « Analyse générée en [DATE_GÉNÉRATION_ANALYSE] »
- Utiliser l'image de marque FASTR et le contexte du pays

---

## 2. Diapositive d'Introduction

- **Titre :** « Suivi des Perturbations des Services Essentiels à partir des Données SNIS »
- Inclure ce texte fixe :

> « L'approche FASTR utilise les données SNIS de routine pour suivre l'évolution de la prestation de services au fil du temps. En comparant les volumes de services observés aux volumes attendus — ajustés pour la saisonnalité et les tendances historiques — nous pouvons identifier les perturbations ou les surplus dans les services de santé essentiels. Cette analyse fournit une perspective opportune à l'échelle du système, mettant en évidence où et quand l'utilisation des services s'écarte des tendances attendues. Les résultats génèrent des preuves exploitables pour guider des réponses rapides, aidant à maintenir la continuité des soins essentiels pendant les périodes d'incertitude de financement ou de changement opérationnel. »

- Réserver de l'espace pour l'image

---

## 3. Diapositive Méthodologie

- **Titre :** « Méthodologie : Évaluation de l'Utilisation des Services »

**Objectif :**
Suivre les changements dans l'utilisation des services de santé au fil du temps, en identifiant où les services sont inférieurs ou supérieurs aux tendances attendues.

**Comment ça fonctionne :**
- Utilise les données SNIS de routine, nettoyées des valeurs aberrantes et des valeurs manquantes
- Construit une ligne de tendance « attendue » pour chaque service, ajustée pour la saisonnalité et les tendances historiques
- Compare les volumes de services réels aux niveaux attendus

**Mesure de l'impact :**
- Les périodes de perturbation signalées sont analysées pour estimer l'ampleur des changements par rapport aux attentes
- Les résultats sont présentés aux niveaux national et sous-national

**Comment interpréter les figures :**
- Zones rouges = perturbations potentielles (en dessous des attentes)
- Zones vertes = surplus potentiels (au-dessus des attentes)
- Ce sont des signaux, pas des conclusions — ils nécessitent une investigation plus approfondie

- **Pied de page :** « Plus de détails sur la méthodologie sont disponibles sur GitHub (https://fastr-analytics.github.io/fastr-resource-hub/). »

---

## 4. Diapositive Sélection des Indicateurs

- **Titre :** « Méthodologie : Sélection des indicateurs »
- **Sous-titre :** « Les indicateurs pour l'analyse de l'utilisation des services ont été sélectionnés en tenant compte des indicateurs prioritaires au niveau national. »
- Lister les indicateurs disponibles regroupés par catégorie depuis la plateforme

---

## 5. Diapositive En-tête de Section

- **Titre :** « Section 1 : Utilisation des Services »
- **Sous-titre :** « Évaluation des volumes projetés basée sur les tendances historiques pour identifier les surplus et perturbations dans les services de santé »

---

## 6. Diapositives d'Analyse Nationale

Créer des diapositives dans cet ordre exact par catégorie. Inclure uniquement les indicateurs qui existent dans la plateforme.

**CATÉGORIE A - SANTÉ MATERNELLE :**
Créer une diapositive chacune pour : CPN1, CPN4, Accouchement institutionnel, CPoN1 (et césariennes, décès maternels, décès néonatals, mort-nés si disponibles)

**CATÉGORIE B - VACCINATION :**
Créer une diapositive chacune pour : BCG, Penta1, Penta3, Rougeole 1, Rougeole 2 (et complètement vaccinés, Vitamine A si disponibles)

**CATÉGORIE C - SERVICES GÉNÉRAUX :**
Créer une diapositive chacune pour : Consultations externes (et consultations < 5 ans, consultations > 5 ans si disponibles)

**CATÉGORIE D - AUTRES (si disponibles dans la plateforme) :**
Créer des diapositives pour : Planification familiale, Paludisme, indicateurs de Nutrition

### Codes des Indicateurs (pour le paramètre selectedReplicant)

| Catégorie | Codes |
|-----------|-------|
| Maternelle | anc1, anc4, delivery, pnc1, csection, maternal_deaths, neonatal_deaths |
| Vaccination | bcg, penta1, penta3, fully_immunized |
| Consultations | opd_under5, opd_over5 |
| Planification Familiale | fp_new, fp_new_and_cont |
| Paludisme | malaria_rdt_positive, malaria_treated_less_24hrs |
| Santé Infantile | diarrhea_cases_identified, pneumonia_cases_identified, pneumonia_treated |

### Pour Chaque Diapositive

**Titre :** Nom de l'indicateur en gras (ex : « CPN1 - Première consultation prénatale »)

**Visualisation (droite) :** Créer en utilisant from_metric avec ces paramètres :
- type: "from_metric"
- metricId: "m3-02-01" (Volume de services réel vs attendu - National)
- vizPresetId: "disruption-chart"
- chartTitle: "Réel vs Attendu : [Nom de l'Indicateur]"
- selectedReplicant: Le code de l'indicateur (ex : "anc1", "penta3")
- filterOverrides: DOIT inclure un filtre pour afficher uniquement cet indicateur spécifique :
  - col: "indicator_common_id"
  - vals: [le code de l'indicateur uniquement, ex : ["anc1"] ou ["penta3"]]
- periodFilterOverride: Utiliser les valeurs period_id converties :
  - periodOption: "period_id"
  - min: Date de début (ex : 202501 pour Janvier 2025)
  - max: Date de fin (ex : 202512 pour Décembre 2025)

**Interprétation (gauche) :** Analyser les données affichées dans la visualisation. Décrire en phrases complètes :
- Quand les perturbations se sont produites (mois/périodes spécifiques où le réel était inférieur à l'attendu)
- Durée des perturbations (combien de mois consécutifs)
- Ampleur des écarts (différences numériques approximatives lorsque visibles)
- Quand des surplus se sont produits (mois/périodes spécifiques où le réel dépassait l'attendu)
- Tendance générale (soutenue, brève, dispersée, aucune)
- **IMPORTANT :** Décrire uniquement ce qui est réellement visible dans le graphique - ne pas inventer de données

---

# PROMPT 2 : Analyse Régionale des Perturbations (Annexe 1)

Ajouter cette annexe après le Rapport de Perturbations principal.

## 1. Diapositive d'En-tête de l'Annexe

- **Titre :** « Annexe 1 : Perturbations de l'utilisation des services par district »

## 2. Diapositives par Zone Sous-nationale

Pour CHAQUE zone sous-nationale dans la plateforme, créer une diapositive avec :

**Titre de la diapositive :** Nom de la zone sous-nationale

**Visualisation (droite) :** Utiliser « Défaut 6. Nombre réel vs attendu de services (Zone administrative 2) » filtré pour cette zone spécifique

**Interprétation (gauche) :** Décrire en phrases complètes :
- Quels indicateurs montrent des perturbations (en dessous des attentes) et quand
- Quels indicateurs montrent des surplus (au-dessus des attentes) et quand
- L'ampleur des écarts par rapport aux attentes
- Toute tendance entre les indicateurs (ex : tous les indicateurs maternels affectés ensemble)

---

# PROMPT 3 : Évaluation de la Qualité des Données

Ajouter cette annexe après le Rapport de Perturbations principal.

**NUMÉROTATION DE L'ANNEXE :** Si l'Analyse Régionale des Perturbations (Annexe 1) a été incluse, numéroter celle-ci comme Annexe 2. Sinon, la numéroter comme Annexe 1.

## 1. Diapositive de Couverture

- **Titre :** « Annexe [1 ou 2] : Évaluation de la Qualité des Données »
- **Sous-titre :** « Les évaluations de la qualité des données — axées sur la complétude, la cohérence et les valeurs aberrantes — informent les ajustements appliqués aux données de routine pour améliorer la fiabilité des analyses présentées. »

## 2. Diapositive Complétude des Rapports

- **Titre :** « Complétude des rapports »
- **Visualisation (droite) :** Utiliser « Défaut 2. Proportion de dossiers complets »
- **Interprétation (gauche) :** En phrases complètes, décrire :
  - Les tendances nationales globales de complétude au fil du temps
  - Quels indicateurs ont une faible complétude (les nommer)
  - Quelles zones administratives ont une faible complétude (les nommer)

## 3. Diapositive Valeurs Aberrantes

- **Titre :** « Valeurs aberrantes »
- **Visualisation (droite) :** Utiliser « Défaut 1. Proportion de valeurs aberrantes »
- **Interprétation (gauche) :** En phrases complètes, décrire :
  - Les tendances nationales globales des valeurs aberrantes au fil du temps
  - Quels indicateurs ont des taux élevés de valeurs aberrantes (les nommer)
  - Quelles zones administratives ont des taux élevés de valeurs aberrantes (les nommer)

## 4. Diapositive Cohérence Interne (première)

- **Titre :** « Cohérence interne »
- **Visualisation (droite) :** Utiliser « Défaut 4. Proportion de zones sous-nationales répondant aux critères de cohérence »
- **Interprétation (gauche) :** En phrases complètes, décrire :
  - Quelles comparaisons de cohérence sont effectuées
  - Les tendances générales à travers le pays
  - Quelles zones répondent ou échouent aux critères de cohérence

## 5. Diapositive Cohérence Interne (deuxième)

- **Titre :** « Cohérence interne »
- **Visualisation (droite) :** Utiliser « Défaut 4. Proportion de zones sous-nationales répondant aux critères de cohérence » (vue ou ventilation différente)
- **Interprétation (gauche) :** Continuer à décrire les tendances de cohérence à travers les zones administratives

## 6. Diapositive Tendances de la Qualité des Données (première)

- **Titre :** « Tendances de la qualité des données »
- **Visualisation (droite) :** Utiliser « Défaut 5. Score global de QDD »
- **Interprétation (gauche) :** En phrases complètes, décrire :
  - Comment les scores de QDD ont évolué au fil des années
  - La performance globale du pays
  - La variation entre les zones administratives

## 7. Diapositive Tendances de la Qualité des Données (deuxième)

- **Titre :** « Tendances de la qualité des données »
- **Visualisation (droite) :** Utiliser « Défaut 6. Score moyen de QDD »
- **Interprétation (gauche) :** En phrases complètes, décrire :
  - Les tendances du score moyen de QDD au fil des années
  - Quelles zones ont des scores en amélioration vs en déclin
  - L'évaluation globale de la trajectoire de qualité des données
