<!-- AUTO-TRANSLATED from 06b_disruption_detection.md -->
<!-- Add REVIEWED marker after human review to protect from overwrite -->

# Détection des perturbations

## Contexte et objectif

### Objectif du module

Le module Détection des perturbations identifie les mois où le volume d'un service de santé a été anormalement bas ou anormalement haut par rapport à ce que les établissements ayant rapporté ce mois-là délivrent habituellement. Il remplace l'approche par cartes de contrôle et régression par panel de l'ancien module Utilisation des services, retiré de la plateforme.

Le module ajuste un modèle bayésien en deux parties sur des données mensuelles au niveau établissement. Une partie modélise si chaque établissement rapporte un mois donné. L'autre modélise la quantité de service qu'un établissement délivre quand il rapporte. Séparer ces deux questions est l'idée centrale : une baisse du total national peut venir d'établissements devenus silencieux, d'établissements qui délivrent moins, ou des deux, et seule la seconde est une perturbation de service.

Pour chaque indicateur, mois et zone géographique, le module produit un volume observé, un volume attendu, un intervalle de crédibilité à 95 % autour de cette attente, et un signalement quand le volume observé sort de l'intervalle.

### Raison d'être de l'analyse

Les volumes de services agrégés bougent pour de nombreuses raisons : saisonnalité, tendance de long terme, ouvertures et fermetures d'établissements, établissements qui cessent de soumettre leurs rapports pendant quelques mois, et vrais changements dans la prestation de services. Les approches antérieures modélisaient directement la série agrégée, si bien qu'un mois où un dixième des établissements n'a pas rapporté ressemblait à un mois où chaque établissement a délivré un dixième de moins.

Modéliser au niveau établissement résout ce problème. Le volume attendu d'un mois est construit uniquement à partir des établissements qui ont effectivement rapporté ce mois-là, de sorte qu'observé et attendu sont comparés sur le même ensemble d'établissements. Une lacune de rapportage ne crée pas de fausse perturbation, et une vraie baisse parmi les établissements rapporteurs n'est pas masquée par l'arrivée d'un nouveau rapporteur.

La modélisation au niveau établissement prend aussi en charge l'hétérogénéité. Un effet aléatoire par établissement donne à chacun son propre niveau de base, si bien qu'un grand hôpital et un petit poste de santé sont chacun comparés à leur propre historique plutôt qu'à une moyenne nationale.

### Points clés

| Composante | Détails |
|-----------|---------|
| **Entrées** | Volumes ajustés au niveau établissement, issus du module d'ajustement de la qualité des données (`M2_adjusted_data.csv`)<br>SNIS brut (`hmis_ISO3.csv`), uniquement pour rattacher les niveaux administratifs aux établissements |
| **Sorties** | `M11_disruptions_analysis_admin_area_1.csv` à `_4.csv` : observé, attendu, bornes de crédibilité à 95 %, écarts de rapportage et de service, et signalements de déficit/excédent par indicateur, mois et zone |
| **Objectif** | Détecter les vrais changements de prestation de services parmi les établissements rapporteurs, séparément des changements de complétude du rapportage |
| **Prérequis** | Module Ajustements de la qualité des données |
| **Méthode** | Modèle bayésien d'intensité latente en deux parties (modèle de rapportage de Bernoulli et modèle de service binomial négatif) ajusté avec INLA |

Le modèle a été développé par Mustapha Wasseja et intégré à la plateforme comme module `m011`.

---

## Flux de travail analytique

### Aperçu des étapes analytiques

Le module tourne une fois par indicateur au niveau établissement, puis agrège les résultats à chaque niveau administratif. Aucun modèle séparé n'est ajusté par province ou district.

1. **Charger les données ajustées.** Les comptages mensuels par établissement viennent du module d'ajustement de la qualité des données. Le comptage utilisé est soit le comptage non ajusté, soit le comptage ajusté pour les valeurs aberrantes. Les comptages imputés pour la complétude sont volontairement refusés : ce module modélise lui-même les lacunes de rapportage et doit donc les voir dans les données.

2. **Construire la grille établissement × mois.** Pour chaque indicateur, chaque établissement est apparié à chaque mois de la période. Une cellule est marquée comme rapportée quand une valeur est présente, et comme non rapportée sinon. Les mois antérieurs au tout premier rapport d'un établissement sont exclus par défaut, pour qu'un établissement ouvert en cours de période ne soit pas compté comme silencieux avant d'exister.

3. **Appliquer la politique des zéros.** Certaines instances SNIS enregistrent un zéro explicite quand un établissement a rapporté une activité nulle ; d'autres remplissent automatiquement un zéro quand rien n'a été soumis. Une règle configurable décide quels zéros sont de vrais rapports et lesquels sont reclassés comme manquants.

4. **Ajuster le modèle de rapportage (partie 1).** Un modèle de Bernoulli sur la grille complète estime, pour chaque établissement et chaque mois, la probabilité que l'établissement rapporte. Le modèle comprend une tendance linéaire, des termes de saisonnalité de Fourier et un effet aléatoire par établissement.

5. **Ajuster le modèle de service (partie 2).** Un modèle binomial négatif sur les seules cellules rapportées estime l'intensité latente de service pour chaque établissement et chaque mois, avec la même tendance, la même saisonnalité et le même effet établissement.

6. **Agréger aux niveaux administratifs.** Pour chaque zone et chaque mois, le volume attendu est la somme des intensités modélisées sur les établissements qui ont rapporté ce mois-là. Le volume observé est la somme de leurs valeurs rapportées. L'intervalle de crédibilité à 95 % est construit à partir des mêmes établissements.

7. **Signaler les écarts.** Un mois est signalé en déficit quand le volume observé est sous la borne inférieure de l'intervalle, et en excédent quand il est au-dessus de la borne supérieure.

8. **Décomposer l'écart.** Deux attentes supplémentaires sont calculées sur tous les établissements, rapporteurs ou non, pour séparer le manque par rapport à un scénario de rapportage complet en une part de rapportage et une part de service.

9. **Écrire les sorties.** Un fichier par niveau administratif, réécrit après chaque indicateur, pour qu'un échec tard dans une longue exécution ne perde rien de ce qui est déjà calculé.

### Points de décision clés

**Variable de comptage**

Le défaut est le comptage ajusté pour les valeurs aberrantes. Le comptage non ajusté est disponible pour les instances où l'ajustement des valeurs aberrantes n'est pas jugé fiable. Les comptages imputés pour la complétude ne sont pas proposés parce qu'ils comblent les lacunes que le module existe pour modéliser.

**Termes de saisonnalité**

La saisonnalité est représentée par des paires de termes sinus et cosinus. Le défaut de deux paires capte un cycle annuel et un cycle semestriel. Les indicateurs à pics de campagne marqués, comme la supplémentation en vitamine A, peuvent nécessiter trois ou quatre paires.

**Politique des zéros**

Cinq réglages sont disponibles. `all` traite chaque zéro comme un vrai rapport d'activité nulle ; c'est le défaut. `none` traite chaque zéro comme manquant. `auto` garde un zéro comme réel seulement si l'établissement a soumis au moins un autre indicateur ce mois-là, et `strict` exige en plus que cet autre indicateur soit supérieur à zéro, pour les systèmes qui remplissent des zéros sur tous les indicateurs à la fois. `detect` choisit entre `all`, `auto` et `strict` d'après la part et la structure des zéros dans les données.

**Établissements nouveaux et fermés**

Les mois antérieurs au premier rapport sont exclus par défaut. Une fenêtre de grâce pour fermeture présumée peut aussi être fixée : les mois de grille au-delà de N mois après le dernier rapport d'un établissement sont exclus, tandis que les N premiers mois de silence comptent toujours comme non-rapportage, pour qu'un vrai effondrement du rapportage reste visible. Désactivée par défaut, parce qu'un silence en fin de série est ambigu.

**Intervalles de crédibilité aux niveaux fins**

Par défaut, l'intervalle d'une zone est la somme des bornes d'intervalle au niveau établissement. C'est rapide et légèrement conservateur, et cela devient approximatif au niveau district et en dessous. Les tirages a posteriori conjoints donnent des intervalles correctement calibrés à tous les niveaux, pour un temps d'exécution environ dix fois plus long et une empreinte mémoire bien plus grande.

### Résultats de l'analyse et visualisation

La plateforme fournit une mesure par niveau pour les sorties nationale et de zone administrative 2, chacune avec un graphique prédéfini :

| Mesure | Fichier de sortie | Graphique |
|--------|-------------------|-----------|
| Détection bayésienne des perturbations, national | `M11_disruptions_analysis_admin_area_1.csv` | Graphique des perturbations avec bande de crédibilité à 95 %, un panneau par indicateur |
| Détection bayésienne des perturbations, zone administrative 2 | `M11_disruptions_analysis_admin_area_2.csv` | Même graphique, indicateurs en lignes et zones en colonnes |

Le graphique montre le volume observé en ligne noire pleine et le volume attendu en ligne noire pointillée, sur une bande grise pour l'intervalle de crédibilité à 95 %. Là où la ligne observée dépasse la bande, la zone entre les deux est ombrée en vert ; là où elle tombe sous la bande, elle est ombrée en rouge. Pour les indicateurs où une hausse est défavorable, les deux couleurs sont inversées.

Les fichiers de zone administrative 3 et 4 sont produits mais n'ont pas de mesure intégrée ; ils peuvent être interrogés par des visualisations personnalisées et par l'assistant IA.

---

## Référence détaillée

### Paramètres de configuration

Les paramètres se règlent dans **Résultats → Paramètres par défaut des modules** et s'appliquent à chaque paquet de résultats généré ensuite.

| Paramètre | Options | Défaut | Rôle |
|-----------|---------|--------|------|
| `SELECTEDCOUNT` | `count_final_none`, `count_final_outliers` | `count_final_outliers` | Variable de comptage à modéliser. Les comptages imputés pour la complétude sont refusés. |
| `FOURIER_K` | entier | `2` | Nombre de paires sinus/cosinus pour la saisonnalité. Monter à 3 ou 4 pour les indicateurs de type campagne. |
| `USE_POSTERIOR_DRAWS` | oui / non | non | Tirages a posteriori conjoints (500 échantillons) pour des intervalles sous-nationaux calibrés. Plus lent et gourmand en mémoire pour les grands pays. |
| `ZEROS_REAL` | `all`, `detect`, `auto`, `strict`, `none` | `all` | Traitement des zéros explicites. |
| `EXCLUDE_PRELAUNCH` | oui / non | oui | Exclure les mois de grille antérieurs au tout premier rapport d'un établissement. |
| `POSTCLOSURE_GRACE` | entier (mois) | `0` (désactivé) | Exclure les mois de grille au-delà de N mois après le dernier rapport d'un établissement. |

### Spécifications des entrées

**`M2_adjusted_data.csv`** (du module d'ajustement de la qualité des données) : une ligne par établissement, indicateur et mois, avec les colonnes de comptage ajusté. Seules les colonnes clés et la colonne de comptage choisie sont lues, car le fichier peut dépasser 80 millions de lignes.

**`hmis_ISO3.csv`** : utilisé uniquement pour retrouver les niveaux administratifs de chaque établissement. Le module détecte la colonne `admin_area_N` la plus profonde présente et produit des agrégations jusqu'à ce niveau.

### Spécifications des sorties

Quatre fichiers partagent les mêmes colonnes, avec une ou plusieurs colonnes de zone en tête :

| Colonne | Signification |
|---------|---------------|
| `admin_area_1` … `admin_area_4` | Identifiants de zone pour le niveau du fichier |
| `indicator_common_id` | Indicateur |
| `period_id` | Mois, au format AAAAMM |
| `observed` | Somme des valeurs rapportées sur les établissements ayant rapporté ce mois-là |
| `expected` | Somme de l'intensité de service modélisée sur les mêmes établissements |
| `ppi_lwr`, `ppi_upr` | Bornes inférieure et supérieure de l'intervalle de crédibilité à 95 % de `expected` |
| `expected_full` | Somme de l'intensité modélisée sur tous les établissements de la zone, rapporteurs ou non |
| `expected_as` | Somme de l'intensité pondérée par la probabilité de rapporter, sur tous les établissements |
| `gap_reporting` | `expected_full − expected_as` : manque attribuable au non-rapportage |
| `gap_service` | `expected_as − observed` : manque attribuable au changement de service |
| `flag_deficit` | 1 quand `observed < ppi_lwr` |
| `flag_surplus` | 1 quand `observed > ppi_upr` |
| `mean_p` | Probabilité moyenne modélisée de rapporter, sur les établissements de la zone |
| `n_facilities` | Nombre d'établissements ayant rapporté ce mois-là |

Les niveaux qui n'existent pas dans les données du pays reçoivent un fichier vide avec les mêmes colonnes.

### Modèle statistique

Soit $f$ l'indice des établissements et $t$ celui des mois.

**Partie 1, rapportage.** Le fait que l'établissement $f$ rapporte au mois $t$ est modélisé par

$$
\text{rapporté}_{f,t} \sim \text{Bernoulli}(p_{f,t}), \qquad
\text{logit}(p_{f,t}) = \alpha + \beta\, z_t + \sum_{k=1}^{K}\left(a_k \sin\tfrac{2\pi k m_t}{12} + b_k \cos\tfrac{2\pi k m_t}{12}\right) + u_f
$$

où $z_t$ est l'indice temporel standardisé, $m_t$ le mois calendaire, $K$ le nombre de paires de Fourier, et $u_f$ un effet aléatoire indépendant par établissement.

**Partie 2, service.** Pour les cellules où un rapport existe, le comptage est modélisé par

$$
y_{f,t} \sim \text{NegBin}(\mu_{f,t}, \phi), \qquad
\log(\mu_{f,t}) = \alpha' + \beta' z_t + \sum_{k=1}^{K}\left(a'_k \sin\tfrac{2\pi k m_t}{12} + b'_k \cos\tfrac{2\pi k m_t}{12}\right) + v_f
$$

avec son propre effet aléatoire par établissement $v_f$ et un paramètre de surdispersion $\phi$. La famille binomiale négative accommode la variation supérieure à celle de Poisson, typique des comptages d'établissements.

**A priori et ajustement.** Les deux effets aléatoires par établissement utilisent un a priori de complexité pénalisée sur leur précision, avec $P(\sigma > 1) = 0{,}01$. Les deux modèles sont ajustés par approximation de Laplace emboîtée intégrée (INLA), qui fournit les marginales a posteriori sans échantillonnage par chaînes de Markov et rend un modèle par établissement faisable sur des dizaines de milliers d'établissements.

**Base de référence attendue et intervalle.** Pour une zone $A$ et un mois $t$, avec $R_{A,t}$ l'ensemble des établissements de $A$ ayant rapporté en $t$ :

$$
\text{attendu}_{A,t} = \sum_{f \in R_{A,t}} \tilde\mu_{f,t}
$$

où $\tilde\mu_{f,t}$ est la médiane a posteriori de $\mu_{f,t}$. L'intervalle par défaut somme les quantiles à 2,5 % et 97,5 % au niveau établissement sur le même ensemble. Avec les tirages a posteriori conjoints, 500 échantillons de $\mu$ sont sommés dans chaque zone et chaque mois, et les quantiles à 2,5 % et 97,5 % de ces sommes sont pris à la place.

**Décomposition de l'écart.** Pour chaque cellule de la grille, y compris les mois non rapportés, une intensité prédite $\hat\mu_{f,t}$ est reconstruite à partir des effets fixes et de l'effet établissement. Alors

$$
\text{expected\_full}_{A,t} = \sum_{f \in A} \hat\mu_{f,t}, \qquad
\text{expected\_as}_{A,t} = \sum_{f \in A} \tilde p_{f,t}\,\hat\mu_{f,t}
$$

et les deux écarts en découlent comme défini dans le tableau des sorties. Les signalements sont toujours calculés par rapport à `expected`, jamais par rapport à ces scénarios contrefactuels.

### Interprétation

- Un mois avec `flag_deficit = 1` est une vraie baisse de la prestation de services parmi les établissements qui ont rapporté, une fois pris en compte la tendance, la saisonnalité et les différences entre établissements. Elle ne s'explique pas par des établissements devenus silencieux.
- Un mois avec `flag_surplus = 1` est une vraie hausse, par exemple une campagne ou un rattrapage.
- Un mois dans la bande est dans la variation attendue et ne doit pas être lu comme un signal, même si le total brut a bougé.
- Un grand `gap_reporting` à côté d'un petit `gap_service` signifie que le manque dans le total brut tient surtout à des rapports manquants : un problème de qualité des données plutôt que de service.
- `mean_p` suit la complétude du rapportage telle que le modèle la voit, et se situe typiquement entre 60 % et 95 %.

Les derniers mois de la série méritent de la prudence pour une autre raison : les rapports tardifs arrivent après l'analyse, si bien que les valeurs observées les plus récentes peuvent être révisées à la hausse dans un paquet ultérieur.

### Notes d'utilisation

- **Temps d'exécution et mémoire.** Chaque indicateur ajuste deux modèles au niveau établissement. Sur un grand réseau, une exécution prend plusieurs heures. L'intervalle par somme marginale, par défaut, est le choix pratique pour les paquets de routine ; les tirages conjoints sont à réserver à une analyse ciblée de quelques indicateurs.
- **Robustesse.** Un indicateur qui ne converge pas ou dont les données sont dégénérées est ignoré avec un message dans le journal de génération, et l'exécution continue. Les sorties sont écrites après chaque indicateur.
- **Choisir la politique des zéros.** Regardez la part de zéros dans les données ajustées et si les mois-établissements entièrement à zéro couvrent beaucoup d'indicateurs à la fois. Si les zéros sont rares, `all` convient. Si le système remplit des zéros en bloc, utilisez `strict` ou laissez `detect` choisir.
- **Lien avec les modules de qualité des données.** Parce que le module modélise lui-même le rapportage, il doit recevoir des comptages qui contiennent encore les lacunes de rapportage. Le faire tourner sur des comptages imputés pour la complétude ferait paraître chaque mois entièrement rapporté et supprimerait l'information dont la partie 1 a besoin.

### Pour aller plus loin

- Rue, H., Martino, S. et Chopin, N. (2009). Approximate Bayesian inference for latent Gaussian models by using integrated nested Laplace approximations. *Journal of the Royal Statistical Society: Series B*, 71(2), 319–392.
- Simpson, D., Rue, H., Riebler, A., Martins, T. G. et Sørbye, S. H. (2017). Penalising model component complexity: a principled, practical approach to constructing priors. *Statistical Science*, 32(1), 1–28.

---

## Approche antérieure : cartes de contrôle et régression par panel (ancien module Utilisation des services)

Jusqu'en 2026, la détection des perturbations était faite par le module Utilisation des services, aujourd’hui retiré, qui modélisait les volumes agrégés par contrôle statistique des processus et régression par panel. Ce module a été retiré de la plateforme et remplacé par le module bayésien décrit ci-dessus. Sa méthode est conservée ici pour référence, parce que les rapports pays produits avant le changement la citent et parce que ses sorties restent lisibles dans les anciens paquets de résultats.

??? "Fonctionnement du modèle antérieur"

    ### Aperçu des étapes analytiques

    Le module fonctionne en deux parties séquentielles, chacune ayant un objectif distinct :

    **Partie 1 : Analyse de la carte de contrôle** - Identifie les schémas inhabituels dans les volumes de service

    1. **Préparer les données** : Charger les données sur les services de santé, supprimer les valeurs aberrantes précédemment identifiées, les agréger au niveau géographique approprié et compléter les mois manquants par interpolation.

    2. **Modéliser les modèles attendus** : Pour chaque combinaison d'indicateur de santé et de zone géographique, utiliser des méthodes statistiques robustes pour estimer ce que les volumes de services devraient être sur la base des tendances historiques et saisonnières (par exemple, tenir compte des augmentations prévisibles des cas de paludisme pendant la saison des pluies).

    3. **Détecter les écarts** : Comparer les volumes de services réels aux modèles attendus et identifier les écarts significatifs à l'aide de plusieurs règles de détection :
       - **Perturbations brutales** : mois uniques présentant des écarts extrêmes
       - **Baisses prolongées** : baisse graduelle sur plusieurs mois
       - **Baisses soutenues** : périodes constamment inférieures aux niveaux attendus
       - **Hausses soutenues** : périodes constamment supérieures aux niveaux attendus
       - **Données manquantes** : lacunes dans les rapports qui peuvent signaler des problèmes

    4. **Signaler les périodes perturbées** : Marquer les mois où un modèle de perturbation est détecté, en veillant à ce que les mois récents soient toujours signalés pour examen.

    **Partie 2 : Analyse des perturbations** - Quantifie l'impact des perturbations identifiées

    5. **Appliquer des modèles de régression** : Utiliser la régression par panel à plusieurs niveaux géographiques (national, provincial, district) pour estimer dans quelle mesure les volumes de services ont changé pendant les périodes de perturbation identifiées, en tenant compte des tendances et de la saisonnalité.

    6. **Calculer les déficits et les excédents** : Comparer les volumes prévus aux volumes réels pour quantifier l'ampleur des perturbations en chiffres absolus et en pourcentages.

    7. **Générer des résultats** : Créer des fichiers de synthèse montrant l'impact des perturbations à chaque niveau géographique, prêts à être visualisés et à faire l'objet de rapports.

    ### Diagramme de flux de travail

    <iframe src="../../resources/diagrams/mod3_workflow_FR.html" width="100%" height="800" style="border: 1px solid #ccc; border-radius: 4px;" title="Retired service utilization module, interactive workflow"></iframe>

    ### Points de décision clés

    **Niveau d'analyse géographique**

    Le module prend en charge l'analyse des perturbations à plusieurs échelles géographiques. Les utilisateurs peuvent limiter l'analyse aux niveaux national et provincial, ce qui est plus rapide en termes de calcul et convient au suivi de routine, ou étendre l'analyse aux niveaux du district et de la circonscription pour obtenir des informations plus granulaires en vue d'une enquête et d'une réponse ciblées.

    **Sélection du niveau de la carte de contrôle**

    Le niveau auquel les cartes de contrôle sont calculées détermine où la modélisation statistique est effectuée. Il est configuré à l'aide de deux drapeaux et suit la convention FASTR selon laquelle les niveaux administratifs les plus élevés correspondent à des unités géographiques plus petites.

    - **Configuration par défaut (les deux drapeaux sont à FALSE)**
      Les cartes de contrôle sont calculées à un niveau infranational intermédiaire (**admin_area_2**). Les volumes de services sont agrégés à ce niveau, et l'estimation des tendances, le calcul des limites de contrôle et la détection des perturbations sont effectués pour chaque combinaison géographie-indicateur. Cette option est la plus efficace en termes de calcul et convient au suivi de routine.

    - **RUN_DISTRICT_MODEL = TRUE**
      Les cartes de contrôle sont calculées à un niveau infranational plus fin (**admin_area_3**). Les volumes de services sont agrégés à des unités géographiques plus petites, ce qui permet de détecter des perturbations localisées qui pourraient être masquées à des niveaux d'agrégation plus élevés. Cette option nécessite davantage de calculs, mais offre une meilleure résolution spatiale.

    - **RUN_ADMIN_AREA_4_ANALYSIS = TRUE**
      Les cartes de contrôle sont calculées au niveau géographique le plus granulaire disponible (**admin_area_4**). Cela permet d'identifier les perturbations très localisées ou au niveau des établissements. Il s'agit de l'option la plus gourmande en ressources et elle est généralement utilisée pour des analyses ciblées ou diagnostiques.

    Le niveau de carte de contrôle sélectionné détermine l'endroit où la modélisation statistique est effectuée, y compris l'estimation des tendances, le calcul des limites de contrôle et le signalement des perturbations. Quel que soit le niveau auquel les cartes de contrôle sont calculées, les résultats des perturbations sont agrégés et présentés à tous les niveaux géographiques disponibles (national et infranational).


    **Paramètres de sensibilité**

    Le module utilise des seuils statistiques configurables pour définir ce qui constitue une perturbation. Les paramètres les plus sensibles (seuils inférieurs) signalent les écarts les plus faibles par rapport aux modèles attendus et conviennent à des fins d'alerte précoce. Les paramètres plus conservateurs (seuils plus élevés) limitent la détection aux écarts plus importants et sont utiles pour se concentrer sur les perturbations majeures.

    **Traitement de la complétude des rapports**

    Le module accepte des versions alternatives des comptages de services produits par le module Ajustements de la qualité des données, ce qui permet aux utilisateurs de choisir d'analyser les volumes bruts rapportés ou les volumes ajustés pour tenir compte de la complétude des rapports. Cela permet d'aligner l'analyse des perturbations sur différentes hypothèses de qualité des données.

??? "Traitement des données et résultats"


    **Transformation de l'entrée**

    Le module commence par le décompte mensuel des services au niveau de l'établissement (par exemple, les accouchements déclarés par chaque établissement). Ces données sont agrégées au niveau géographique sélectionné. Les observations identifiées comme aberrantes dans le module Évaluation de la qualité des données sont exclues afin d'éviter que les valeurs anormales n'influencent l'estimation des tendances et les limites de contrôle.

    **Estimation et détection des tendances**

    En utilisant des méthodes statistiques robustes, le module estime les modèles d'utilisation des services attendus pour chaque indicateur et unité géographique sur la base des données historiques, en tenant compte des tendances à long terme et de la saisonnalité. Les mois au cours desquels les volumes de services observés s'écartent de manière significative de ces modèles attendus sont signalés comme des perturbations potentielles.

    **Quantification de l'impact des perturbations**

    Pour les périodes identifiées comme perturbées, des modèles de régression sont utilisés pour estimer les volumes de service contrefactuels - représentant l'utilisation attendue en l'absence de perturbation. Les différences entre les volumes prédits et observés sont calculées pour quantifier les insuffisances ou les excédents de service.

    **Structure de sortie**

    Les résultats finaux présentent les mesures de perturbation à plusieurs niveaux géographiques, depuis les résumés nationaux jusqu'aux résultats locaux détaillés. Les données originales sont conservées, avec des champs supplémentaires fournissant les valeurs attendues, les indicateurs de perturbation et les impacts quantifiés.

??? "Graphiques réel vs attendu"

    **2. Services réels par rapport aux services prévus (national)**

    Graphique linéaire comparant les volumes de services observés aux prévisions du modèle au niveau national.

    ![Réel vs prévu national](resources/default_outputs/Module3_2_Actual_vs_expected_national.png)

    **3. Services réels par rapport aux services attendus (au niveau infranational)**

    Graphiques linéaires par région comparant les volumes observés aux modèles attendus.

    ![Réel vs prévu infranational](resources/default_outputs/Module3_3_Actual_vs_expected_subnational.png)

    Pour les graphiques "réel" et "prévu" (résultats 2-3) :

    - **Ligne noire** : Volumes de services réels (observés)
    - **Zones ombrées en rouge** : Périodes de déficit (réel inférieur aux prévisions)
    - **Zones ombrées en vert** : Périodes d'excédent (réel supérieur aux prévisions)


### Paramètres de configuration

??? "Paramètres d'analyse de base"

    | Paramètre | Valeur par défaut | Type | Description | Guide de réglage |
    |-----------|---------|------|-------------|-----------------|
    | `COUNTRY_ISO3` | "ISO3" | Chaîne | Code de pays à trois lettres | Définissez votre code de pays (par exemple, "RWA", "UGA", "ZMB") |
    | `SELECTEDCOUNT` | "count_final_outliers" | Chaîne | Colonne de données utilisée pour la modélisation par régression | Options : `count_final_none`, `count_final_outliers`, `count_final_completeness`, `count_final_both` |
    | `VISUALIZATIONCOUNT` | "count_final_outliers" | Chaîne | Colonne de données utilisée pour la visualisation | Mêmes options que `SELECTEDCOUNT` ; peut différer si vous souhaitez modéliser sur l'une et représenter graphiquement l'autre |

??? "Paramètres de la carte de contrôle"

    | Paramètre | Valeur par défaut | Type | Description | Guide de réglage |
    |-----------|---------|------|-------------|-----------------|
    | `SMOOTH_K` | 7 | Entier (impair) | Taille de la fenêtre médiane mobile en mois | Valeurs plus grandes = tendances plus lisses, moins de sensibilité. Il doit s'agir d'un nombre impair (par exemple, 5, 7, 9, 11) |
    | `MADS_THRESHOLD` | 1.5 | Numérique | Seuil des unités MAD pour les fortes perturbations | Plus bas = plus sensible (par exemple, 1.0), plus haut = plus conservateur (par exemple, 2.0) |
    | `DIP_THRESHOLD` | 0.90 | Numérique | Seuil de proportion pour les baisses soutenues | 0.90 = marquer si en dessous de 90% de la valeur attendue (baisse de 10%). Utiliser 0.80 pour un seuil de chute de 20% |
    | `DIFFPERCENT` | 10 | Numérique | Seuil de pourcentage pour le tracé des perturbations | Si la valeur réelle diffère de la valeur prédite de >10%, utiliser la valeur prédite dans les visualisations |

    **Note** : `RISE_THRESHOLD` est automatiquement calculé comme `1 / DIP_THRESHOLD` (par défaut : ~1.11) pour refléter symétriquement la détection de la baisse.

??? "Paramètres d'analyse géographique"

    | Paramètre | Valeur par défaut | Type | Description | Guide de réglage |
    |-----------|---------|------|-------------|-----------------|
    | `CONTROL_CHART_LEVEL` | Auto-défini | Chaîne | Niveau géographique pour les cartes de contrôle | Réglage automatique basé sur `RUN_DISTRICT_MODEL` et `RUN_ADMIN_AREA_4_ANALYSIS` |
    | `RUN_DISTRICT_MODEL` | FALSE | Logique | Exécuter ou non les régressions admin_area_3 | Mettre TRUE pour l'analyse au niveau du district (augmente le temps d'exécution) |
    | `RUN_ADMIN_AREA_4_ANALYSIS` | FALSE | Logique | Exécuter ou non l'analyse admin_area_4 | Mettre TRUE pour l'analyse au niveau le plus fin (très lent pour les grands ensembles de données) |

??? "Paramètres de la source de données"

    | Paramètre | Valeur par défaut | Type | Description |
    |-----------|---------|------|-------------|
    | `PROJECT_DATA_HMIS` | "hmis_ISO3.csv" | Chaîne | Nom de fichier pour les données SIGS brutes |

??? "Guide de sélection des paramètres"

    **Pour l'analyse à haute sensibilité** (détection des petites perturbations) :
    - `MADS_THRESHOLD = 1.0`
    - `DIP_THRESHOLD = 0.95` (baisse de 5%)
    - `SMOOTH_K = 5` (moins de lissage)

    **Pour une analyse conservatrice** (seulement les perturbations majeures) :
    - `MADS_THRESHOLD = 2.0`
    - `DIP_THRESHOLD = 0.80` (baisse de 20%)
    - `SMOOTH_K = 9` ou `11` (plus de lissage)

    **Pour une exécution plus rapide** :
    - `RUN_DISTRICT_MODEL = FALSE`
    - `RUN_ADMIN_AREA_4_ANALYSIS = FALSE`
    - `CONTROL_CHART_LEVEL = "admin_area_2"`

### Spécifications des entrées/sorties

??? "Exigences d'entrée"

    #### Entrées primaires

    1. **`M2_adjusted_data.csv`** (source de données principale)
       - Résultat du module Ajustements de la qualité des données
       - Contient des comptes de services ajustés avec différentes hypothèses de complétude
       - Colonnes obligatoires : `facility_id`, `indicator_common_id`, `period_id`, `count_final_none`, `count_final_outliers`, `count_final_completeness`, `count_final_both`

    2. **`M1_output_outliers.csv`**
       - Résultat du module Évaluation de la qualité des données
       - Contient `outlier_flag` pour identifier et exclure les points de données anormaux
       - Colonnes requises : `facility_id`, `indicator_common_id`, `period_id`, `outlier_flag`

    3. **`hmis_ISO3.csv`** (utilisé uniquement pour la recherche géographique)
       - Fichier SIGS brut utilisé uniquement pour extraire la correspondance facility_id → admin_area_1
       - Requis car M2_adjusted_data.csv n'inclut pas admin_area_1
       - Colonnes requises : `facility_id`, `admin_area_1`

    #### Exigences en matière de données

    - **Couverture temporelle** : Minimum 12 mois de données pour la modélisation saisonnière
    - **Complétude des données** : Les mois manquants sont comblés par interpolation
    - **Complétude géographique** : Données aux niveaux administratifs spécifiés
    - **Données de comptage** : Chiffres entiers non négatifs (les prédictions sont limitées à zéro)

    ### Sorties

    #### 1. Résultats de la carte de contrôle

    **`M3_chartout.csv`**

    **Objectif** : Contient les perturbations signalées lors de l'analyse de la carte de contrôle

    **Colonnes** :

    - `admin_area_*` : Identifiant géographique (le niveau dépend de `CONTROL_CHART_LEVEL`)
    - `indicator_common_id` : Code de l'indicateur de service de santé
    - `period_id` : Période au format AAAAMM
    - `tagged` : Indicateur binaire (1 = perturbation détectée, 0 = normal)

    **Utilisation** : Identifie les mois qui nécessitent un examen plus approfondi pour chaque combinaison indicateur-géographie

    **`M3_service_utilization.csv`**

    **But** : Copie de passage des données ajustées pour la visualisation

    **Source** : Copie directe de `M2_adjusted_data.csv`

    **Utilisation** : Fournit des données de base pour le tracé des volumes de service réels

    **`M3_memory_log.txt`**

    **But** : Suivi de l'utilisation de la mémoire tout au long de l'exécution

    **Utilisation** : Diagnostics pour l'optimisation des performances et le dépannage

    #### 2. Résultats de l'analyse des perturbations

    **`M3_disruptions_analysis_admin_area_1.csv`** (niveau national - toujours généré)

    **Colonnes** :

    - `admin_area_1` : Nom du pays
    - `indicator_common_id` : Indicateur de service de santé
    - `period_id` : Période (YYYYMM)
    - `count_sum` : Volume réel des services (somme de tous les établissements)
    - `count_expect_sum` : Volume de service attendu (somme des prévisions)
    - `count_expected_if_above_diff_threshold` : Valeur pour le tracé (attendue si |différence| > DIFFPERCENT, sinon réelle)

    **`M3_disruptions_analysis_admin_area_2.csv`** (niveau province - toujours généré)

    **Colonne supplémentaire** : `admin_area_2` (nom de la province/région)

    **Même structure** : Comme le fichier admin_area_1 mais désagrégé par province

    **`M3_disruptions_analysis_admin_area_3.csv`** (niveau du district - conditionnel)

    **Généré quand** : `RUN_DISTRICT_MODEL = TRUE`

    **Colonnes supplémentaires** : `admin_area_2`, `admin_area_3`

    **Même structure** : Comme ci-dessus mais désagrégé par district

    **`M3_disruptions_analysis_admin_area_4.csv`** (niveau du quartier - conditionnel)

    **Généré quand** : `RUN_ADMIN_AREA_4_ANALYSIS = TRUE`

    **Colonnes supplémentaires** : `admin_area_2`, `admin_area_3`, `admin_area_4`

    **Avertissement** : Fichier très volumineux pour les pays comportant de nombreuses circonscriptions

    #### 3. Fichiers de synthèse des déficits/excédents

    **`M3_all_indicators_shortfalls_admin_area_*.csv`** (un pour chaque niveau géographique)

    **But** : Mesures pré-calculées des déficits et des excédents pour les rapports

    **Colonnes communes** :

    - Identifiant(s) géographique(s) : `admin_area_*`
    - `indicator_common_id` : Indicateur de service de santé
    - `period_id` : Période (YYYYMM)
    - `count_sum` : Volume de service réel
    - `count_expect_sum` : Volume de service attendu
    - `shortfall_absolute` : Nombre absolu de services manquants (si perturbation négative)
    - `shortfall_percent` : Pourcentage d'insuffisance par rapport aux prévisions
    - `surplus_absolute` : Nombre absolu de services excédentaires (en cas de perturbation positive)
    - `surplus_percent` : Pourcentage d'excédent par rapport aux prévisions

    **Note** : Si les niveaux géographiques optionnels sont désactivés, des fichiers de remplacement vides sont créés pour assurer la compatibilité avec les processus en aval.

    #### Fichiers temporaires (nettoyés automatiquement)

    Pendant l'exécution, le module crée des fichiers batch temporaires pour la gestion de la mémoire :
    - `M3_temp_controlchart_batch_*.csv`
    - `M3_temp_indicator_batch_*.csv`
    - `M3_temp_province_batch_*.csv`
    - `M3_temp_district_batch_*.csv`
    - `M3_temp_admin4_batch_*.csv`

    Ces fichiers sont automatiquement supprimés en cas de succès. Si le script se plante, ces fichiers peuvent subsister et seront nettoyés lors de la prochaine exécution.

### Documentation des fonctions clés

??? "`robust_control_chart(panel_data, selected_count)`"

    **Objectif** : Identifie les anomalies dans l'utilisation des services en utilisant une régression robuste et des limites de contrôle basées sur le MAD.

    **Entrées** :

    - `panel_data` : Données de séries temporelles pour une combinaison spécifique indicateur-géographie
    - `selected_count` : Nom de la colonne contenant les comptes de volume de services à analyser

    **Processus** :

    1. Ajuste un modèle linéaire robuste (en utilisant `MASS::rlm()`) avec des contrôles saisonniers et des tendances temporelles
    2. Applique un lissage de la médiane roulante aux valeurs prédites pour réduire le bruit
    3. Calcule les résidus et les normalise en utilisant l'écart absolu médian (MAD)
    4. Applique une logique d'étiquetage basée sur des règles pour identifier les différents types de perturbations
    5. Signale automatiquement les mois récents afin d'assurer une détection rapide

    **Résultats** :

    - `count_predict` : Prédiction du volume de services à partir d'une régression robuste
    - `count_smooth` : Prédictions lissées à l'aide de la médiane roulante
    - `residual` : Différence entre les valeurs réelles et les valeurs lissées
    - `robust_control` : Résidu standardisé (résidu/MAD)
    - `tagged` : Indicateur binaire (1 = perturbation détectée, 0 = variation normale)
    - Drapeaux supplémentaires : `tag_sharp`, `tag_sustained`, `tag_sustained_dip`, `tag_sustained_rise`, `tag_missing`

    **Caractéristiques clés** :

    - Traite les données manquantes avec élégance grâce à l'interpolation
    - Utilise une régression robuste pour minimiser l'influence des valeurs aberrantes
    - Utilise plusieurs règles de détection des perturbations pour différents modèles
    - Assure des prédictions non négatives (les comptes ne peuvent pas être négatifs)

    ### Modèles de régression par panel

    L'analyse des perturbations utilise des modèles de régression en panel (`fixest::feols()`) à plusieurs niveaux géographiques. Des régressions distinctes sont effectuées pour chaque unité géographique à chaque niveau, avec des erreurs types groupées pour tenir compte de la corrélation à l'intérieur de la zone.

    **Modèle national** (admin_area_1) :

    ```r
    count ~ date + factor(month) + tagged
    ```

    Régression unique sur l'ensemble des établissements, avec erreurs standard groupées au niveau du district (`admin_area_3`) lorsque plus d'un district est disponible ; sinon, sans regroupement.

    **Modèles au niveau de la province** (admin_area_2) :

    ```r
    count ~ date + factor(month) + tagged
    ```

    Régression séparée pour chaque province, avec erreurs standard groupées au niveau du district lorsque plus d'un district est disponible ; sinon, sans regroupement.

    **Modèles au niveau du district** (admin_area_3 - optionnel) :

    ```r
    count ~ date + factor(month) + tagged
    ```

    Régression séparée pour chaque district (minimum 10 observations requises), avec erreurs standard groupées au niveau du quartier (`admin_area_4`) lorsque plus d'un quartier est disponible ; sinon, sans regroupement.

    **Modèles au niveau du quartier** (admin_area_4 - optionnel) :

    ```r
    count ~ date + factor(month) + tagged
    ```

    Régression séparée pour chaque quartier/unité finale (minimum 8 observations requises, pas de regroupement).

    ### Fonctions de soutien

    **`mem_usage(msg)`** : Suivi et enregistrement de la consommation de mémoire tout au long de l'exécution

    **Traitement des données** :

    - Traitement par lots avec des fichiers temporaires sur disque pour une meilleure efficacité de la mémoire
    - Opérations data.table efficaces pour les grands ensembles de données
    - Stratégies d'agrégation et de fusion progressives

### Méthodes et algorithmes statistiques

??? "Analyse des cartes de contrôle"

    Les volumes de services sont agrégés au niveau géographique spécifié (configurable via `CONTROL_CHART_LEVEL`). Le pipeline supprime les valeurs aberrantes (`outlier_flag == 1`), complète les mois manquants et filtre les mois à faible volume (<50% du volume moyen global).

    Un modèle de régression robuste estime les volumes de services attendus par indicateur × zone géographique (`panelvar`). Une médiane roulante centrée est appliquée pour lisser les valeurs prédites. Les résidus (réels - lissés) sont normalisés à l'aide de MAD. Les perturbations sont identifiées à l'aide d'un système de marquage basé sur des règles.

    #### Règles de détection des perturbations

    Chaque règle est contrôlée par des paramètres définis par l'utilisateur, ce qui permet de personnaliser la sensibilité et le comportement de la logique de détection :

    **Perturbations brutales** : Signale un mois unique lorsque le résidu standardisé (résidu divisé par MAD) dépasse un seuil :

    $$ \left| \frac{\text{residual}}{\text{MAD}} \right| \geq \text{MADS\_THRESHOLD} $$

    - **Paramètre :** `MADS_THRESHOLD` (par défaut : `1.5`)
    - Des valeurs plus faibles rendent la détection plus sensible aux pics ou aux creux soudains.

    **Chutes soutenues** : Signale une baisse soutenue si :

    - Trois mois consécutifs présentent de légères déviations (résidu standardisé >= 1 mais < `MADS_THRESHOLD`), et
    - Le mois en cours a un résidu standardisé >= 1,5 (seuil codé en dur).

    Cela permet de capter les baisses plus lentes et composées.

    **Baisses soutenues** : Signale les périodes où le volume réel tombe constamment en dessous d'une proportion définie du volume attendu (prédiction lissée) :

    $$ \text{count\_original} < \text{DIP\_THRESHOLD} \times \text{count\_smooth} $$

    - **Paramètre :** `DIP_THRESHOLD` (par défaut : `0.90`)
    - Les utilisateurs peuvent ajuster ce paramètre pour détecter des baisses plus ou moins importantes (par exemple, `0.80` pour une baisse de 20%).

    **Hausses soutenues** : Symétrique aux baisses, signale les périodes de surperformance constante :

    $$ \text{count\_original} > \text{RISE\_THRESHOLD} \times \text{count\_smooth} $$

    - **Paramètre :** `RISE_THRESHOLD` (par défaut : `1 / DIP_THRESHOLD`, par exemple, `1.11`)
    - Les utilisateurs peuvent ajuster ce paramètre pour détecter les hausses de volume.

    **Données manquantes** : Ce code est utilisé lorsque 2 mois ou plus sur les 3 derniers mois ont un volume de service manquant (`NA`) ou nul.

    - **Règle fixe**.

    **Dérogation pour la période récente** : Marquage automatique de tous les mois des 6 derniers mois de données pour s'assurer que les tendances récentes sont examinées, même si le marquage basé sur un modèle n'est pas concluant.

    - **Règle fixe**.

    **Indicateur final** : Un mois se voit attribuer `tagged = 1` si **l'une** des conditions suivantes est remplie :

    - `tag_sharp == 1`
    - `tag_sustained == 1`
    - `tag_sustained_dip == 1`
    - `tag_sustained_rise == 1`
    - `tag_missing == 1`
    - Il se situe dans les 6 mois les plus récents (`last_6_months == 1`)

    ### Modèle de régression robuste

    **Ajustement du modèle** :

    Si >= 12 observations et > 12 dates uniques :

    $$Y_{it} = \beta_0 + \sum \gamma_m \cdot \text{month}_m + \beta_1 \cdot \text{date} + \epsilon_{it}$$

    S'il n'y a que >= 12 observations :

    $$Y_{it} = \beta_0 + \beta_1 \cdot \text{date} + \epsilon_{it}$$

    Si les données sont insuffisantes : utiliser la médiane des valeurs observées.

    **Appliquer le lissage de la médiane roulante aux prédictions** :

    $$ \text{count\_smooth}_{it} = \text{Median}(\text{count\_predict}_{t-k}, \dots, \text{count\_predict}_t, \dots, \text{count\_predict}_{t+k}) $$

    - **Paramètre :** `SMOOTH_K` (par défaut : 7, doit être impair)
    - Un `SMOOTH_K` plus grand lisse davantage ; un plus petit retient plus de variations.

    **Calculer les résidus** :

    $$ \text{residual}_{it} = \text{count\_original}_{it} - \text{count\_smooth}_{it} $$

    **Standardiser les résidus à l'aide de MAD** :

    $$ \text{robust\_control}_{it} = \text{residual}_{it} / \text{MAD}_i $$

    ### Modèles de régression pour l'analyse des perturbations

    Une fois les anomalies identifiées et enregistrées dans `M3_chartout.csv`, l'analyse des perturbations quantifie leur impact à l'aide de modèles de régression. Ces modèles estiment dans quelle mesure l'utilisation des services a changé au cours des périodes de perturbation signalées en tenant compte des tendances à long terme et des variations saisonnières.

    Pour chaque indicateur, nous estimons :

    $$ Y_{it} = \beta_0 + \beta_1 \cdot \text{date} + \sum_{m=1}^{12} \gamma_m \cdot \text{month}_m + \beta_2 \cdot \text{tagged} + \epsilon_{it} $$

    où :
    - $Y_{it}$ est le volume de service observé,
    - $\text{date}$ capture les tendances temporelles,
    - $\text{month}_m$ contrôle la saisonnalité,
    - $\text{tagged}$ est la variable fictive de perturbation (issue de l'analyse de la carte de contrôle),
    - $\epsilon_{it}$ est le terme d'erreur.

    Le coefficient de `tagged` ($\beta_2$) mesure le changement relatif de l'utilisation des services pendant les perturbations signalées. Des régressions distinctes sont effectuées aux niveaux national, provincial et du district afin d'évaluer l'impact à différentes échelles géographiques.

    #### Régression à l'échelle nationale

    La régression à l'échelle nationale permet d'estimer l'évolution de l'utilisation des services au niveau national lorsqu'une perturbation se produit. Au lieu d'analyser séparément les provinces ou les districts, ce modèle prend en compte l'ensemble des données du pays dans une seule régression. Les erreurs sont regroupées au niveau géographique le plus bas disponible (`lowest_geo_level`), généralement les districts.

    **Spécification du modèle :**

    $$Y_{it} = \beta_0 + \beta_1 \cdot \text{date} + \sum_{m=1}^{12} \gamma_m \cdot \text{month} + \beta_2 \cdot \text{tagged} + \epsilon_{it}$$

    Où :
    - $Y_{it}$ = volume (par exemple, nombre d'accouchements)
    - $\text{date}$ = tendance temporelle
    - $\text{month}_m$ = contrôle de la saisonnalité (variable factorielle)
    - $\text{tagged}$ = variable muette pour la période de perturbation
    - $\epsilon_{it}$ = terme d'erreur, regroupé au niveau du district (`admin_area_3`)

    #### Régression au niveau de la province

    La régression des perturbations au niveau de la province permet d'estimer comment l'utilisation des services change au niveau de la province lorsqu'une perturbation se produit. Contrairement au modèle national, cette approche utilise des régressions distinctes pour chaque province afin de saisir les variations régionales.

    **Spécification du modèle** (exécuté séparément pour chaque province) :

    $$Y_{it} = \beta_0 + \beta_1 \cdot \text{date} + \sum_{m=1}^{12} \gamma_m \cdot \text{month} + \beta_2 \cdot \text{tagged} + \epsilon_{it}$$

    Où :
    - $Y_{it}$ = volume (par exemple, nombre d'accouchements)
    - $\text{date}$ = tendance temporelle
    - $\text{month}_m$ = contrôle de la saisonnalité (variable factorielle)
    - $\text{tagged}$ = variable muette pour la période de perturbation
    - $\epsilon_{it}$ = terme d'erreur, regroupé au niveau du district

    #### Régression au niveau du district

    La régression des perturbations au niveau du district permet d'estimer comment l'utilisation des services change au niveau du district lorsqu'une perturbation se produit. Cette approche consiste à effectuer des régressions distinctes pour chaque district afin de saisir les variations localisées.

    **Spécification du modèle** (exécutée séparément pour chaque district) :

    $$Y_{it} = \beta_0 + \beta_1 \cdot \text{date} + \sum_{m=1}^{12} \gamma_m \cdot \text{month} + \beta_2 \cdot \text{tagged} + \epsilon_{it}$$

    Où :
    - $Y_{it}$ = volume (par exemple, nombre d'accouchements)
    - $\text{date}$ = tendance temporelle
    - $\text{month}_m$ = contrôle de la saisonnalité (variable factorielle)
    - $\text{tagged}$ = variable muette pour la période de perturbation
    - $\epsilon_{it}$ = terme d'erreur, regroupé au niveau du quartier (`admin_area_4`) si plusieurs regroupements sont disponibles

    #### Résultats de la régression

    Chaque niveau de régression produit les résultats suivants :

    **Valeurs attendues (`expect_admin_area_*`)** : Volume de service prédit, ajusté pour tenir compte de la saisonnalité et des tendances.

    **Effet de perturbation (`b_admin_area_*`)** : Estimation de la variation relative en cas de perturbations :

    $$ b_{\text{admin\_area\_*}} = -\frac{\text{diff mean}}{\text{predict mean}} $$

    **Coefficient de tendance (`b_trend_admin_area_*`)** : Reflète la tendance à long terme.

    - Positif = augmentation de l'utilisation des services
    - Négatif = baisse de l'utilisation des services
    - Proche de zéro = tendance stable

    **P-value (`p_admin_area_*`)** : Mesure la signification statistique de l'effet de perturbation.

    - Des valeurs plus faibles = une preuve plus forte d'une véritable perturbation

    ### Méthodes statistiques utilisées

    **Régression robuste (`MASS::rlm`)** :

    - Utilise les moindres carrés repondérés de manière itérative (IRLS)
    - Minimise l'influence des valeurs aberrantes et extrêmes
    - Plus résistant à la mauvaise spécification du modèle que les moindres carrés ordinaires
    - Par défaut : pondération de Huber avec un maximum de 100 itérations

    **MAD (écart absolu médian)** :

    - Mesure robuste de l'échelle/variabilité
    - Formule : `MAD = median(|x - median(x)|)`
    - Plus résistant aux valeurs aberrantes que l'écart-type
    - Utilisé pour normaliser les résidus dans le cadre de la détection d'anomalies

    **Régression par panel (`fixest::feols`)** :

    - Estimation à effets fixes avec erreurs types groupées
    - Tient compte de la corrélation des erreurs au sein du groupe
    - Plus efficace que les packages traditionnels de régression en panel
    - Traite gracieusement les panels déséquilibrés

    **Regroupement géographique** :

    - Les régressions utilisent des erreurs standard groupées au niveau géographique le plus bas disponible
    - Cela permet de tenir compte de la corrélation entre les modèles de prestation de services à l'intérieur d'une même zone
    - Exemple : Le modèle national est regroupé par district, le modèle provincial est regroupé par district
    - Évite la sous-estimation des erreurs types et les faux positifs

### Étapes de l'analyse détaillée

??? "Partie 1 : Analyse des cartes de contrôle"

    #### Étape 1 : Préparer les données

    - Chargez les volumes de services ajustés à partir de `M2_adjusted_data.csv`.
    - Charger les indicateurs de valeurs aberrantes à partir de `M1_output_outliers.csv`.
    - Charger les données brutes du SIGS uniquement pour extraire la consultation `facility_id → admin_area_1` (puis les rejeter).
    - Fusionner les indicateurs de valeurs aberrantes dans les données ajustées par établissement × indicateur × mois.
    - Supprimer les lignes marquées comme aberrantes (`outlier_flag == 1`).
    - Créer une variable `date` à partir de `period_id` et extraire `year` et `month`.
    - Créer un `panelvar` unique pour chaque combinaison zone géographique-indicateur.
    - Agréger les données au niveau géographique spécifié en additionnant les `count_model` (sur la base du `SELECTEDCOUNT`) par date.
    - Compléter les mois manquants au sein de chaque panel pour assurer la continuité.
    - Remplir les métadonnées manquantes à l'aide d'un remplissage en avant et en arrière.

    #### Étape 2 : Filtrer les mois à faible volume

    - Calculer le volume moyen global de services pour chaque `panelvar`.
    - Si le `count_original` est < 50% de la moyenne globale, abandonner la valeur en la mettant à `NA`.

    #### Étape 3 : Appliquer la régression et le lissage

    Estimez le volume de service attendu à l'aide d'une régression robuste, puis lissez la tendance prédite.

    - Ajuster la régression robuste (`rlm`) pour chaque panel en utilisant l'une des trois spécifications du modèle en fonction de la disponibilité des données.
    - Appliquer le lissage de la médiane glissante aux prédictions en utilisant la taille de fenêtre `SMOOTH_K`.
    - Si le lissage n'est pas possible (par exemple, sur les bords de la série), revenir aux prédictions du modèle.
    - Calculer les résidus : réel - lissé
    - Normaliser les résidus à l'aide de MAD

    Cette variable de contrôle normalisée est utilisée pour détecter les anomalies à l'étape 4.

    #### Étape 4 : Identifier les perturbations

    Appliquer un marquage basé sur des règles pour identifier les perturbations potentielles. Chaque règle est régie par des paramètres définis par l'utilisateur et dont la sensibilité peut être ajustée :

    - **Perturbations nettes** : Marquer si `|robust_control| >= MADS_THRESHOLD`
    - **Baisses prolongées** : Marquer si 3 mois consécutifs ont des déviations légères (résidu >= 1 mais < MADS_THRESHOLD) et si le mois en cours a un résidu >= 1.5
    - **Baisses soutenues** : Marquer toute la séquence si `count_original < DIP_THRESHOLD × count_smooth` pendant 3+ mois
    - **Hausse soutenue** : Marquer toute la séquence si `count_original > RISE_THRESHOLD × count_smooth` pendant 3+ mois
    - **Données manquantes** : Marquer si 2+ des 3 derniers mois sont manquants ou zéro
    - **Dérogation pour la période récente** : Marquer automatiquement tous les mois des 6 derniers mois de données

    Un mois se voit attribuer `tagged = 1` si l'une des conditions ci-dessus est remplie. Les enregistrements marqués sont sauvegardés dans `M3_chartout.csv` et transmis à l'analyse des perturbations.

??? "Partie 2 : Analyse des perturbations"

    #### Étape 1 : Préparation des données

    - L'ensemble de données `M3_chartout` est fusionné avec l'ensemble de données principal pour intégrer la variable `tagged`, qui identifie les perturbations signalées.
    - Le niveau géographique le plus bas disponible (`lowest_geo_level`) est identifié pour le regroupement, sur la base de la colonne `admin_area_*` de la plus haute résolution disponible.

    #### Étape 2 : Régression au niveau national

    Pour chaque `indicator_common_id`, estimer le modèle au niveau national avec les erreurs regroupées au niveau du district.

    - Un modèle de régression en panel est appliqué au niveau national, estimant le volume de services attendu (`expect_admin_area_1`) pour chaque indicateur.
    - Le modèle contrôle les tendances à long terme et les modèles saisonniers d'utilisation des services.
    - Lorsqu'une perturbation (`tagged = 1`) est identifiée, les volumes de services prévus sont ajustés en supprimant l'effet estimé de la perturbation afin d'isoler son impact.

    #### Étape 3 : Régression intermédiaire au niveau infranational

    Pour chaque combinaison `indicator_common_id` × `admin_area_2`, des modèles infranationaux sont estimés, avec des erreurs standard regroupées à un niveau administratif inférieur.

    - Un modèle de régression en panel à effets fixes est appliqué à un niveau infranational intermédiaire, estimant les volumes de service attendus (`expect_admin_area_2`) tout en tenant compte des caractéristiques géographiques invariantes dans le temps.
    - Le modèle contrôle les tendances historiques et la saisonnalité.
    - Lorsqu'une perturbation est identifiée, les volumes prédits sont ajustés pour isoler l'effet de la perturbation.

    #### Étape 4 : Régression fine au niveau infranational (si `RUN_DISTRICT_MODEL = TRUE`)

    Pour chaque combinaison `indicator_common_id` × `admin_area_3`, des modèles infranationaux sont estimés, avec des erreurs standard regroupées au niveau du quartier (`admin_area_4`) lorsque plus d'un quartier est disponible.

    - Un modèle de régression en panel à effets fixes est appliqué à un niveau infranational fin, estimant les volumes de service attendus (`expect_admin_area_3`).
    - Les panels comportant moins de 10 observations sont ignorés.
    - Le modèle contrôle les tendances historiques et la saisonnalité.
    - Lorsqu'une perturbation est identifiée, les volumes prédits sont ajustés pour isoler l'effet de la perturbation.

    #### Étape 5 : Régression au niveau du quartier (si `RUN_ADMIN_AREA_4_ANALYSIS = TRUE`)

    Pour chaque combinaison `indicator_common_id` × `admin_area_4`, des modèles au niveau du quartier sont estimés, sans regroupement.

    - Un modèle de régression en panel est appliqué au niveau géographique le plus fin, estimant les volumes de service attendus (`expect_admin_area_4`).
    - Les panels comportant moins de 8 observations sont ignorés.
    - Le modèle contrôle les tendances historiques et la saisonnalité.
    - Lorsqu'une perturbation est identifiée, les volumes prédits sont ajustés pour isoler l'effet de la perturbation.

    #### Étape 6 : Préparer les résultats pour la visualisation

    Une fois que les valeurs attendues ont été calculées pour chaque niveau (pays, province, district), le pipeline compare les valeurs prédites et les valeurs réelles pour évaluer l'ampleur de la perturbation.

    Pour chaque mois et chaque indicateur, le pipeline calcule :

    - **La différence absolue et en pourcentage** entre les valeurs prévues et les valeurs réelles :

    $$ \text{diff\_percent} = 100 \times \frac{\text{predicted} - \text{actual}}{\text{predicted}} $$

    - Un paramètre de seuil configurable `DIFFPERCENT` (par défaut : `10`) est utilisé pour déterminer si une perturbation est significative.

        Si la différence en pourcentage dépasse ±10%, la valeur attendue (prédite) est conservée et utilisée pour le tracé et les statistiques récapitulatives. Dans le cas contraire, c'est la valeur réelle observée qui est utilisée.

        Cela permet d'éviter que des fluctuations mineures n'entraînent des perturbations artificielles dans la visualisation, tout en préservant les écarts significatifs.

    - La valeur finale ajustée pour le tracé est stockée dans un champ tel que `count_expected_if_above_diff_threshold`.

        Cette valeur reflète soit :
        - Le nombre prédit (si l'écart est supérieur au seuil), ou
        - Le comptage réel (s'il se situe dans une fourchette acceptable).

    Cette logique est appliquée de manière cohérente à tous les niveaux d'administration. Ces valeurs ajustées sont ensuite exportées dans le cadre des fichiers de sortie finaux pour chaque niveau.


### Exemples de code

??? "Exemple 1 : Exécution du module avec les paramètres par défaut"

    ```r
    # Set working directory
    setwd("/path/to/module/directory")

    # Load required libraries
    library(data.table)
    library(lubridate)
    library(zoo)
    library(MASS)
    library(fixest)
    library(stringr)
    library(dplyr)
    library(tidyr)

    # Configure country
    COUNTRY_ISO3 <- "SLE"
    PROJECT_DATA_HMIS <- "hmis_SLE.csv"

    # Use default settings (admin_area_2 level analysis)
    RUN_DISTRICT_MODEL <- FALSE
    RUN_ADMIN_AREA_4_ANALYSIS <- FALSE

    # Run the module
    source("03_module_service_utilization.R")
    ```

    Avec les paramètres par défaut, le module exécute l'analyse de la carte de contrôle au niveau admin_area_2 et produit des estimations de perturbations pour les niveaux national et régional.

??? "Exemple 2 : Ajustement de la sensibilité de la détection des perturbations"

    ```r
    # Make disruption detection more sensitive (lower thresholds)
    MADS_THRESHOLD <- 1.0        # Flag at 1 MAD (default: 1.5)
    DIP_THRESHOLD <- 0.95        # Flag if <95% of expected (default: 0.90)
    SMOOTH_K <- 5                # Smaller smoothing window (default: 7)

    # Make disruption detection less sensitive (higher thresholds)
    MADS_THRESHOLD <- 2.0        # Flag only at 2 MADs
    DIP_THRESHOLD <- 0.80        # Flag only if <80% of expected
    SMOOTH_K <- 9                # Larger smoothing window

    source("03_module_service_utilization.R")
    ```

    **Cas d'utilisation** : Ajuster la sensibilité en fonction de la qualité des données. Les données plus bruyantes peuvent nécessiter des seuils moins sensibles pour éviter les faux positifs.

??? "Exemple 3 : Exécution d'une analyse au niveau du district"

    ```r
    # Enable district-level analysis (slower but more detailed)
    RUN_DISTRICT_MODEL <- TRUE
    RUN_ADMIN_AREA_4_ANALYSIS <- FALSE

    source("03_module_service_utilization.R")
    ```

    **Cas d'utilisation** : Lorsque des modèles de perturbation au niveau du district sont nécessaires pour la planification de programmes infranationaux.

    **Remarque** : L'analyse au niveau du district augmente considérablement la durée d'exécution. Pour les pays de grande taille, il est possible d'envisager une exécution pendant la nuit.

??? "Exemple 4 : Sélection d'un scénario d'ajustement pour l'analyse"

    ```r
    # Use unadjusted data for sensitivity analysis
    SELECTEDCOUNT <- "count_final_none"
    VISUALIZATIONCOUNT <- "count_final_none"

    # Use outlier-adjusted only
    SELECTEDCOUNT <- "count_final_outliers"
    VISUALIZATIONCOUNT <- "count_final_outliers"

    # Use fully adjusted data (default)
    SELECTEDCOUNT <- "count_final_both"
    VISUALIZATIONCOUNT <- "count_final_both"

    source("03_module_service_utilization.R")
    ```

    **Cas d'utilisation** : Comparer les estimations de perturbations entre différents scénarios d'ajustement de la qualité des données.

??? "Exemple 5 : Optimisation de la mémoire pour les grands ensembles de données"

    ```r
    # Reduce batch sizes for memory-constrained environments
    BATCH_SIZE_CC <- 50      # Control chart batches (default: 100)
    BATCH_SIZE_IND <- 3      # Indicator batches (default: 5)
    BATCH_SIZE_PROV <- 10    # Province batches (default: 20)
    BATCH_SIZE_DIST <- 10    # District batches (default: 15)

    # Disable memory-intensive analyses
    RUN_DISTRICT_MODEL <- FALSE
    RUN_ADMIN_AREA_4_ANALYSIS <- FALSE

    source("03_module_service_utilization.R")
    ```

    **Cas d'utilisation** : Exécution sur des machines avec une RAM limitée (<8GB).

??? "Exemple 6 : Utilisation programmatique des sorties"

    ```r
    # Load disruption analysis outputs
    disruptions_national <- read.csv("M3_disruptions_analysis_admin_area_1.csv")
    shortfalls_national <- read.csv("M3_all_indicators_shortfalls_admin_area_1.csv")

    # Calculate total service shortfall by indicator
    annual_shortfalls <- shortfalls_national %>%
      mutate(year = period_id %/% 100) %>%
      group_by(indicator_common_id, year) %>%
      summarise(
        total_expected = sum(count_expect_sum, na.rm = TRUE),
        total_actual = sum(count_sum, na.rm = TRUE),
        total_shortfall = sum(shortfall_absolute, na.rm = TRUE),
        avg_shortfall_pct = mean(shortfall_percent, na.rm = TRUE),
        .groups = "drop"
      )

    # Identify months with largest disruptions
    worst_months <- shortfalls_national %>%
      filter(shortfall_percent > 10) %>%
      arrange(desc(shortfall_percent)) %>%
      head(20)

    # Load control chart results for detailed analysis
    control_chart <- read.csv("M3_chartout.csv")

    # Count tagged periods by indicator
    tagged_summary <- control_chart %>%
      group_by(indicator_common_id) %>%
      summarise(
        total_periods = n(),
        tagged_periods = sum(tagged, na.rm = TRUE),
        pct_tagged = 100 * tagged_periods / total_periods,
        .groups = "drop"
      )
    ```


### Dépannage

??? "Problèmes courants et solutions"

    #### Problème : Le script se bloque avec l'erreur "out of memory" (manque de mémoire)

    **Solutions** :

    - Réduire la taille des lots (par exemple, `BATCH_SIZE_IND <- 3`)
    - Définir `RUN_DISTRICT_MODEL <- FALSE`
    - Définir `RUN_ADMIN_AREA_4_ANALYSIS <- FALSE`
    - Fermer les autres applications
    - Exécuter sur une machine avec plus de RAM

    ---

    #### Problème : Avertissement "le modèle n'a pas réussi à converger"

    **Explication** : La régression robuste n'a pas complètement convergé dans les 100 itérations

    **Impact** : Généralement minime - une convergence partielle est souvent suffisante

    **Solutions** :

    - Vérifier la qualité des données pour ce panel
    - Augmenter le paramètre `maxit` dans l'appel `rlm()` (ligne 229, 247)
    - Il est généralement possible de l'ignorer si seuls quelques panels sont concernés

    ---

    #### Problème : Nombreuses lignes vides dans les fichiers de sortie

    **Explication** : Données insuffisantes pour certaines combinaisons indicateur-géographie

    **Solutions** :

    - Comportement attendu pour les indicateurs peu nombreux
    - Filtrer les sorties sur les valeurs non manquantes
    - Envisager l'agrégation à un niveau géographique plus élevé

    ---

    #### Problème : Tous les mois récents sont signalés comme perturbations

    **Explication** : Marquage automatique des 6 derniers mois

    **But** : Permet d'examiner les tendances récentes, même en l'absence de preuves statistiques solides

    **Solutions** :

    - Comportement attendu, pas un bogue
    - Examiner les mois récents manuellement
    - Ajuster la logique `last_6_months` si nécessaire (ligne 333)

    ---

    #### Problème : la variable `tagged` a été supprimée de la régression

    **Message** : La variable est automatiquement mise à 0

    **Explication** : Aucune variation de `tagged` dans ce panneau (tout 0 ou tout 1)

    **Solutions** :

    - Attendu dans les panels sans perturbations ou avec des perturbations constantes
    - Il ne s'agit pas d'une erreur - l'effet de perturbation est correctement fixé à 0

    ---

    #### Problème : Des fichiers temporaires subsistent après l'exécution

    **Cause** : Le script s'est arrêté avant le nettoyage

    **Solutions** :

    - Supprimer manuellement : `M3_temp_*.csv`
    - Ou réexécuter le script (nettoyage automatique au démarrage)

    ---

    #### Problème : Résultats très différents selon le niveau géographique

    **Explication** : Des agrégations géographiques différentes permettent de saisir des modèles différents

    **Exemple** : La tendance nationale peut être stable alors que certains districts connaissent d'importantes perturbations

    **Solutions** :

    - Comportement attendu - ce n'est pas un bogue
    - Utiliser le niveau approprié pour votre question de recherche
    - Recouper les modèles entre les différents niveaux pour en vérifier la robustesse

### Notes d'utilisation

??? "Directives d'interprétation"

    **Effets de perturbation (b_admin_area_*)** :

    - Les valeurs négatives indiquent des déficits de volume de service pendant les périodes de perturbation
    - Les valeurs positives indiquent des excédents de volume de service pendant les périodes de perturbation
    - Les valeurs proches de zéro indiquent des effets de perturbation moindres

    **Valeurs P (p_admin_area_*)** :

    - Les valeurs < 0,05 indiquent des perturbations statistiquement significatives
    - Les valeurs > 0,05 peuvent indiquer une variation normale plutôt que de véritables perturbations

    **Coefficients de tendance (b_trend_admin_area_*)** :

    - Les valeurs positives indiquent une augmentation de l'utilisation des services au fil du temps
    - Les valeurs négatives indiquent une diminution de l'utilisation des services au fil du temps
    - Les valeurs proches de zéro indiquent des schémas d'utilisation stables

    ### Considérations sur les performances

    **Facteurs de temps de fonctionnement** :

    - **Nombre d'indicateurs** : Mise à l'échelle linéaire
    - **Nombre d'unités géographiques** : Échelle linéaire à l'intérieur de chaque niveau
    - **Longueur de la série temporelle** : Impact minimal (régression efficace)
    - **Détails géographiques** : Échelle exponentielle (beaucoup plus d'unités à des niveaux plus fins)

    **Temps d'exécution estimés** (exemple de données : 50 indicateurs, 100 districts) :

    - Modèles nationaux + provinciaux : ~5-10 minutes
    - Ajouter des modèles de district : ~30-60 minutes
    - Ajouter des modèles de quartiers : Plusieurs heures (en fonction du nombre de quartiers)

    **Stratégies d'optimisation** :

    - Définir `RUN_DISTRICT_MODEL = FALSE` pour une exécution plus rapide (sauter le niveau du district)
    - Régler `RUN_ADMIN_AREA_4_ANALYSIS = FALSE` (par défaut) pour éviter l'analyse au niveau de la circonscription
    - Réduire `SMOOTH_K` pour un calcul plus rapide de la médiane glissante
    - Utiliser `SELECTEDCOUNT = "count_final_none"` pour éviter les ajustements de complétude

    ### Détails du traitement des données

    **Gestion de la mémoire** :

    - Utilise `data.table` pour des opérations efficaces sur de grands ensembles de données
    - Traitement par lots : Résultats sauvegardés sur disque périodiquement
    - Nettoyage progressif : Objets supprimés lorsqu'ils ne sont plus nécessaires
    - Les fichiers temporaires permettent de traiter des ensembles de données plus grands que la RAM

    **Taille des lots** (ajustable en fonction des contraintes de mémoire) :

    - Carte de contrôle : 100 panneaux par lot
    - Indicateurs : 5 indicateurs par lot
    - Provinces : 20 résultats par lot
    - Districts : 15 résultats par lot
    - Zone administrative 4 : 10 résultats par lot

    **Traitement des données manquantes** :

    1. Les mois manquants sont remplis via `tidyr::complete()`
    2. Remplissage avant/arrière pour les métadonnées
    3. Interpolation linéaire (`zoo::na.approx`) pour les valeurs de comptage
    4. Écart maximal : Illimité (règle = 2 étend les points d'extrémité)

    ### Logique de repli du modèle

    L'analyse de la carte de contrôle utilise une sélection de modèle adaptative basée sur la disponibilité des données :

    **Modèle complet** (nécessite >= 12 obs ET > 12 dates uniques) :

    ```r
    count ~ month_factor + as.numeric(date)
    ```

    Tient compte à la fois de la saisonnalité et de la tendance linéaire

    **Modèle tendance uniquement** (nécessite >= 12 obs) :

    ```r
    count ~ as.numeric(date)
    ```

    Tient compte uniquement de la tendance linéaire (données insuffisantes pour la saisonnalité)

    **Retour à la médiane** (< 12 observations) :

    ```r
    count_predict = median(count)
    ```

    Utilise la médiane globale lorsque les données sont insuffisantes pour la régression

    **Vérifications de convergence** :

    - Modèles dont l'état de convergence a été vérifié
    - Avertissements émis pour les modèles non convergents
    - Les modèles non convergents sont encore utilisés (une convergence partielle est souvent suffisante)

    ### Assurance qualité

    **Nettoyage des données** :

    - Les valeurs aberrantes ont été supprimées avant l'analyse de la carte de contrôle (sur la base des indicateurs du module Évaluation de la qualité des données)
    - Les mois à faible volume (< 50% de la moyenne) ont été exclus pour améliorer la stabilité du modèle
    - Prédictions limitées à zéro (les comptes ne peuvent pas être négatifs)

    **Marquage automatique** :

    - Les mois récents (6 derniers mois) sont automatiquement marqués pour garantir la prise en compte des perturbations actuelles
    - Évite de manquer des perturbations en cours en raison d'un écart insuffisant par rapport à la tendance

    **Contrôles de robustesse** :

    - Les coefficients du modèle sont vérifiés pour les valeurs `NA` avant d'être utilisés
    - Si la variable `tagged` est éliminée du modèle (pas de variation), l'effet de perturbation est fixé à 0
    - Les valeurs P ne sont calculées que si des erreurs standard valides sont disponibles

    **Traitement des cas limites** :

    - Panneaux à un seul cluster : Aucun regroupement n'est appliqué (l'analyse échouerait)
    - Données insuffisantes : Sauter l'analyse pour ce panel/niveau
    - Prédictions manquantes : Complétées par les valeurs originales dans la mesure du possible

    ### Intégration du flux de travail

    Ce module était le troisième maillon du pipeline analytique FASTR :

    **Prérequis** :

    1. **Module 1** : Évaluation de la qualité des données (génère `M1_output_outliers.csv`)
    2. **Module 2** : Ajustements de la qualité des données (génère `M2_adjusted_data.csv`)

    ### Dépendances

    **Packages R requis** :

    - `data.table` : Manipulation efficace des données
    - `lubridate` : Traitement des dates
    - `zoo` : Statistiques roulantes et interpolation
    - `MASS` : Régression robuste (rlm)
    - `fixest` : Régression de panel à effets fixes
    - `dplyr` : Manipulation des données
    - `tidyr` : Nettoyage des données


---

**Dernière mise à jour** : 06-05-2026
**Contact** : <fastr@worldbank.org>

---

<!--
////////////////////////////////////////////////////////////////////
//                                                                //
//   _____ _     _____ ____  _____    ____ ___  _   _ _____ _   _ //
//  / ____| |   |_   _|  _ \| ____|  / ___/ _ \| \ | |_   _| \ | |//
//  | (___ | |     | | | | | | |__   | |  | | | |  \| | | | |  \| |//
//   \___ \| |     | | | | | |  __|  | |  | | | | . ` | | | | . ` |//
//   ____) | |___ _| |_| |_| | |____ | |__| |_| | |\  | | | | |\  |//
//  |_____/|_____|_____|____/|______| \____\___/|_| \_| |_| |_| \_|//
//                                                                //
//            Modifier les diapositives ci-dessous                   //
//                                                                //
////////////////////////////////////////////////////////////////////
-->

<!-- SLIDE:m6_2e -->
<!-- _class: output -->
## Version bayésienne : deux questions par établissement

<div class="output-layout">
<div class="output-viz">

![Deux questions par établissement w:640](../resources/diagrams_fr/disruption_bayes_two_questions.svg)

</div>
<div class="output-text">

**Question 1 :** cet établissement a-t-il rapporté ce mois-ci ? Posée pour chaque établissement et chaque mois.

**Question 2 :** quand il rapporte, combien délivre-t-il ? Posée seulement pour les mois avec un rapport.

**Pourquoi les séparer :** un total bas peut venir d'établissements silencieux ou d'établissements qui délivrent moins. Seul le second cas est une perturbation de service.

</div>
</div>

<!--
NOTES POUR LE PRÉSENTATEUR :
- C'est le module Détection des perturbations de la plateforme. Il a remplacé en 2026 l'ancien module Utilisation des services, à cartes de contrôle ; les anciennes diapositives sont gardées pour référence.
- Le modèle travaille établissement par établissement, mois par mois, puis additionne par province et district. Pas de modèle séparé par zone.
- La question 1 est un modèle oui/non du rapportage. La question 2 est un modèle de comptage du volume de services, ajusté seulement là où un rapport existe.
- Chaque établissement a son propre niveau de base : un hôpital et un poste de santé sont comparés chacun à leur propre historique.
- La tendance et la saison sont dans les deux questions : une baisse de saison sèche ou une hausse nationale lente n'est pas appelée perturbation.
-->
<!-- /SLIDE -->

<!-- SLIDE:m6_2f -->
## Comment le volume attendu est construit

Pour chaque zone et chaque mois, le modèle additionne le volume attendu **des seuls établissements qui ont rapporté ce mois-là**, et le compare à ce que ces mêmes établissements ont réellement rapporté.

<div style="font-size: 0.9em;">

| | Approche antérieure | Approche bayésienne |
|---|---|---|
| **Unité modélisée** | Total du district ou de la province | Chaque établissement |
| **Rapports manquants** | Comblés, puis modélisés | Modélisés comme une question à part |
| **Volume attendu** | Tendance + saison sur le total | Tendance + saison + niveau propre à chaque établissement |
| **Incertitude** | Seuils fixes | Bande de crédibilité à 95 % |
| **Un établissement devient silencieux** | Ressemble à une baisse | Retiré des deux côtés de la comparaison |

</div>

<!--
NOTES POUR LE PRÉSENTATEUR :
- La ligne clé est la dernière. Quand un établissement cesse de rapporter, l'ancien modèle voyait une baisse du total. Le nouveau retire cet établissement de l'observé et de l'attendu pour ce mois, et la comparaison reste à périmètre égal.
- « Bande de crédibilité » : la fourchette dans laquelle le modèle s'attend à voir le volume 95 fois sur 100. Hors de la bande, c'est un signal ; dedans, c'est la variation normale.
- La bande est plus large pour les petites zones et les indicateurs à faible volume, et c'est normal : moins de données, moins de certitude.
-->
<!-- /SLIDE -->

<!-- SLIDE:m6_2g -->
<!-- _class: output -->
## Lire le graphique bayésien des perturbations

<div class="output-layout">
<div class="output-viz">

![Graphique bayésien des perturbations h:300](../resources/diagrams_fr/disruption_bayes_chart.svg)

</div>
<div class="output-text">

**Ce que vous voyez :** le volume observé (ligne pleine), le volume attendu (ligne pointillée) et la bande de crédibilité à 95 % (grise).

**Ce que cela montre :** rouge là où l'observé passe sous la bande, un déficit ; vert là où il passe au-dessus, un excédent. Dans la bande, c'est la variation normale.

**Interprétation :** une plage rouge est une vraie baisse parmi les établissements qui ont rapporté. Demandez ce qui s'est passé ces mois-là : ruptures de stock, grèves, insécurité, campagne ailleurs.

</div>
</div>

<!--
NOTES POUR LE PRÉSENTATEUR :
- Graphique illustratif, dessiné avec les couleurs de la plateforme. Dans la plateforme : paquets de résultats → graphique des perturbations avec bande de crédibilité à 95 %, un panneau par indicateur, national ou par zone administrative 2.
- Un seul mois rouge mérite un regard ; plusieurs mois rouges d'affilée sont le motif sur lequel agir.
- Pour les indicateurs où une hausse est défavorable (mort-nés, décès), les couleurs sont inversées.
- Les derniers mois peuvent changer : des rapports tardifs arrivent après la génération du paquet.
-->
<!-- /SLIDE -->

<!-- SLIDE:m6_2h -->
<!-- _class: output -->
## Écart de rapportage ou écart de service ?

<div class="output-layout">
<div class="output-viz">

![Écart de rapportage vs écart de service h:300](../resources/diagrams_fr/disruption_bayes_gaps.svg)

</div>
<div class="output-text">

**Ce que vous voyez :** trois barres pour une zone et un mois : l'attendu si tous les établissements avaient rapporté, l'attendu vu qui rapporte d'habitude, et l'observé.

**Ce que cela montre :** la première marche est **l'écart de rapportage**, des rapports manquants. La seconde est **l'écart de service**, un vrai changement de prestation.

**Interprétation :** un grand écart de rapportage est un problème de données à régler avec les établissements. Un grand écart de service est une question pour le programme.

</div>
</div>

<!--
NOTES POUR LE PRÉSENTATEUR :
- Ces deux écarts sont dans la sortie du module (gap_reporting, gap_service) pour chaque zone et chaque mois, à côté des valeurs observées et attendues.
- Aussi dans la sortie : mean_p, la chance moyenne de rapporter dans la zone ce mois-là. Elle suit la complétude telle que le modèle la voit.
- Ordre pratique : regardez d'abord l'écart de rapportage. S'il explique l'essentiel du manque, revenez à la qualité des données avant de demander au programme pourquoi les services ont baissé.
-->
<!-- /SLIDE -->

<!-- SLIDE:m6_2i -->
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
<!-- /SLIDE -->

<!-- SLIDE:m6_s2c -->
<!-- _class: output -->
## Détection des perturbations (bayésienne) : quoi regarder

<div class="output-layout">
<div class="output-viz">

![Graphique bayésien des perturbations h:300](../resources/diagrams_fr/disruption_bayes_chart.svg)

</div>
<div class="output-text">

**Ce que vous voyez :** observé (plein) vs attendu (pointillé) avec une bande grise à 95 %, pour les établissements qui ont rapporté chaque mois.

**Ce que cela montre :** rouge sous la bande, c'est un vrai déficit parmi les établissements rapporteurs, pas des rapports manquants. Vert au-dessus, c'est un excédent.

**Interprétation :** plusieurs mois rouges d'affilée sont le motif sur lequel agir. Regardez d'abord l'écart de rapportage, puis demandez au programme ce qui s'est passé.

</div>
</div>

<!--
NOTES POUR LE PRÉSENTATEUR :
- Version condensée de m6_2e à m6_2h. Le modèle pose deux questions par établissement : a-t-il rapporté, et combien a-t-il délivré quand il a rapporté.
- Comme l'attendu et l'observé utilisent les mêmes établissements chaque mois, un établissement devenu silencieux n'apparaît pas comme une perturbation.
- Dans la plateforme : Détection des perturbations ; les anciennes diapositives à cartes de contrôle (m6_2, m6_2b, m6_2d) décrivent l'ancien modèle Utilisation des services, retiré.
-->
<!-- /SLIDE -->
