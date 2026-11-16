---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Prise en main"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Connexion</span> <span class="arrow">→</span> <span class="step done">Votre dossier</span> <span class="arrow">→</span> <span class="step current">Explorer</span></div>

# Jeter un premier regard avec Explorer

<p class="meta-line"><strong>Activité</strong> · <strong>Prise en main</strong> · <strong>~15 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Avant de commencer</p>

- ☐ Vous avez complété **Connexion à la plateforme**
- ☐ La navigation latérale est dépliée (la flèche en bas de la barre)

<p class="sb-label">Pourquoi c'est important</p>

Explorer montre toutes les analyses que la plateforme a déjà calculées, sous forme de tableau, de série de graphiques ou de carte, sans rien à créer et sans rien à casser. C'est la façon la plus rapide de voir ce que disent les données avant de construire quoi que ce soit.

</aside>
<div class="p1-main">

## Ce que vous allez faire

Ouvrir Explorer, lire un service dans un tableau, le suivre dans le temps, passer à un autre module d'analyse, et noter trois chiffres à rapporter à la salle.

<h2 class="step-h"><span class="step-n">1</span><span>Ouvrir Explorer</span></h2>

Cliquez sur **Explorer** dans la navigation latérale. Quatre contrôles se trouvent en haut :

- **HMIS / FOSA** : la famille de données. Restez sur HMIS.
- Le **paquet de résultats**, en haut à droite. Celui qui est épinglé est sélectionné ; laissez-le.
- La **portée**, juste à côté. **Toutes les données** signifie tout le pays.
- Le **module** et sa **métrique**, à gauche. La page s'ouvre sur **Utilisation des services → Volumes de services** : le volume mensuel de chaque indicateur.

![h:260](../../../resources/screenshots/platform_v2_fr/13_explore.png)

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">2</span><span>Lire le tableau</span></h2>

La vue **Tableau** affiche une ligne par zone et une colonne par indicateur. Trois filtres au-dessus :

- **Niveau** : Région, District ou Sous-district (les libellés sont ceux de votre pays).
- **Indicateurs** : tous, ou une sélection.
- **Période** : **12 derniers mois**, **Dernier trimestre**, **Dernière année**, ou **Tout**.

Réglez le niveau sur celui juste en dessous du national et la période sur **12 derniers mois**. Cliquez sur un en-tête de colonne pour trier. **Rechercher une colonne** vous amène à un indicateur quand il y en a beaucoup. **Télécharger** enregistre le tableau dans un fichier.

**Notez :** le total national d'**CPN1** (la CPN1) sur les 12 derniers mois, et la zone avec la valeur la plus basse.

<h2 class="step-h"><span class="step-n">3</span><span>Le suivre dans le temps</span></h2>

Cliquez sur **Dans le temps**. Chaque indicateur reçoit un petit graphique de son volume mensuel. Les filtres deviennent l'indicateur, le niveau et le pas de temps (**Mois**, **Trimestre**, **Année**). Choisissez **CPN1** seul, au niveau national.

![h:250](../../../resources/screenshots/platform_v2_fr/13b_explore_over_time.png)

**Notez :** le mois avec la valeur la plus élevée sur les deux dernières années.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">4</span><span>Essayer la carte</span></h2>

Cliquez sur **Carte**. Un indicateur, un niveau, une période, coloré par zone. Si votre instance n'a pas encore de fichiers de limites administratives, la page le dit au lieu de dessiner une carte ; c'est un élément de configuration pour votre administrateur, pas une erreur de votre côté.

<h2 class="step-h"><span class="step-n">5</span><span>Changer de module</span></h2>

Ouvrez le menu déroulant du **module** à gauche. **Résultats principaux** contient Utilisation des services (les volumes). **Analyses complémentaires** liste les autres modules : Évaluation de la qualité des données, Ajustements de la qualité des données, Détection des perturbations, Dénominateurs de couverture, Estimations de couverture. Chaque module apporte ses propres métriques et sa propre vue.

![h:230](../../../resources/screenshots/platform_v2_fr/13d_explore_module_menu.png)

Choisissez **Estimations de couverture**. La vue devient **Couverture dans le temps** : un graphique par indicateur, avec des points gris pour la couverture calculée à partir des données de routine, noirs pour les estimations d'enquête, rouges pour la projection qui prolonge la dernière enquête.

![h:250](../../../resources/screenshots/platform_v2_fr/13e_explore_coverage_table.png)

**Notez :** la dernière couverture projetée de **Penta 3**.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">6</span><span>Partager vos trois chiffres</span></h2>

Comparez avec votre voisin : même paquet, mêmes filtres, mêmes chiffres ? Sinon, trouvez quel filtre diffère. Gardez ensuite la question qui vous intéresse le plus : c'est celle pour laquelle vous construirez un graphique au module suivant.

## Vérification

Vous savez :

- Ouvrir Explorer et nommer ses quatre contrôles du haut (famille de données, paquet, portée, module et métrique)
- Passer entre **Tableau**, **Dans le temps** et **Carte**
- Changer le niveau et la période d'un tableau
- Trouver un module sous **Analyses complémentaires**

## Explorer ou une visualisation ?

Explorer sert à **regarder** : rapide, complet, rien n'est enregistré. Une **visualisation** sert à **garder et partager** : vous choisissez la métrique, les filtres et la forme, elle a une ligne sur la page Produits, et vous pouvez la copier dans une présentation ou un rapport. Quand une vue d'Explorer répond à votre question, construisez-la ensuite comme visualisation.

## Que faire si ça ne marche pas

- **Le tableau est vide.** Le paquet n'a pas de données pour la période choisie. Réglez la période sur **Tout**.
- **Les chiffres diffèrent de ceux d'un collègue.** Vérifiez le paquet (en haut à droite), la portée, le niveau et la période. Quatre filtres, quatre façons de différer.
- **Pas de carte.** Aucun fichier de limites administratives n'a été téléversé pour ce niveau. Utilisez le tableau ou les graphiques.
- **Les noms des modules sont en anglais** même dans l'interface française. C'est un problème d'affichage connu ; le contenu est le même.

## Étape suivante

Configuration terminée. Le module suivant, **Visualisations**, commence par construire le graphique que vous venez de regarder, et l'enregistrer dans votre dossier.
