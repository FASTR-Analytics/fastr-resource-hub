---
marp: true
theme: fastr
paginate: true
footer: "FASTR · Madagascar · Point d'étape · 25 septembre 2026"
---

<style>
  section h1,
  section h2 {
    border-left: none;
    padding-left: 0;
    padding-bottom: 0.24em;
    border-bottom: 3px solid var(--fastr-green);
    width: fit-content;
    max-width: 100%;
  }
  section.title-cover h1,
  section.bg-green h1,
  section.bg-green h2 {
    border-bottom: none;
    padding-bottom: 0;
  }
  .num {
    font-size: 2.1em;
    font-weight: 700;
    color: var(--fastr-deep-green);
    line-height: 1;
    margin: 0.1em 0 0.15em;
  }
  .num small { font-size: 0.42em; font-weight: 600; color: #4a5a58; display: block; margin-top: 0.35em; letter-spacing: 0.02em; }
  .columns-3, .columns { align-items: start; }
  .q { font-size: 0.78em; }
  .q li { margin: 0.25em 0; }
  table.rates { font-size: 0.72em; }
  table.rates td, table.rates th { padding: 0.35em 0.8em; }
</style>

<!-- _class: title-cover -->

![bg](../../resources/backgrounds/cover_slide_clean.png)

<div style="position: absolute; top: 40px; left: 80px; display: flex; gap: 20px; align-items: center;">
  <img src="../../resources/logos/GFF_Logo_trimmed.png" style="height: 40px;">
</div>

<div style="position: absolute; bottom: 40px; left: 80px; display: flex; gap: 28px; align-items: center;">
  <img src="../../resources/logos/FASTR_White_Horiz.png" style="height: 50px;">
  <img src="../../resources/logos/usefuldata600w.png" style="height: 34px;">
</div>

# Point d'étape FASTR Madagascar

**Formation · importation automatique · formations sanitaires · paramètres de couverture**

---

<!-- _class: spacious -->

## Quatre points en une heure

<div class="columns">
<div>

<div class="eyebrow">1 · Formation</div>

Des sessions pour les administrateurs de la plateforme, maintenant et à la sortie de la v2. À décider : qui, quand, sous quelle forme.

<div class="eyebrow" style="margin-top:0.8em">3 · Formations sanitaires</div>

La liste de la plateforme comparée à DHIS2 : 29 nouvelles, 23 retirées. Ce qu'on met à jour.

</div>
<div>

<div class="eyebrow">2 · Importation automatique</div>

Programmer l'importation mensuelle depuis DHIS2. Démonstration sur l'instance.

<div class="eyebrow" style="margin-top:0.8em">4 · Paramètres de couverture</div>

Les taux démographiques des dénominateurs sont encore les valeurs par défaut. Les valeurs malgaches sont prêtes à être confirmées.

</div>
</div>

<div class="callout-footer">Les diapositives cadrent chaque point. L'essentiel se passe dans la plateforme.</div>

---

<!-- _class: spacious -->

## 1 · Sessions de formation pour les administrateurs

<div class="columns-3">
<div>

<div class="eyebrow">Configurer</div>

### L'instance

Connexion DHIS2, structure des établissements, liste des indicateurs, utilisateurs et permissions.

</div>
<div>

<div class="eyebrow">Importer</div>

### Les données

Importation DHIS2, planification récurrente, suivi, paquets de résultats.

</div>
<div>

<div class="eyebrow">Produire</div>

### Rapports et présentations

Visualisations, diapositives, rapports, assistant IA.

</div>
</div>

Chaque session s'appuie sur un guide pas à pas en français, mis à jour sur la version actuelle de la plateforme, que les participants gardent.

<div class="callout-footer">À décider ensemble : qui sont les administrateurs à former, et combien ? À distance en trois sessions courtes ou une journée sur place ? Une première session maintenant, puis une mise à niveau à la sortie de la v2 ?</div>

---

## 2 · Importation automatique des données DHIS2

<div class="columns-image-right">
<div>

Les données SNIS sur l'instance s'arrêtent à **mai 2026**.

**Nouvelle importation DHIS2** → étape **Heure** → **Récurrente** : chaque mois, un jour choisi, fuseau horaire d'Antananarivo. La planification s'affiche dans l'onglet **À venir**, chaque exécution dans **Historique**.

Après l'importation, deux gestes restent à faire à la main : **générer** un paquet de résultats et l'**épingler**. Les projets qui suivent l'épingle se mettent à jour.

</div>
<div>

<div style="height:250px;overflow:hidden;border:1px solid #d9dedd;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,.08)"><img src="../../resources/screenshots/dhis2_import_v2/03_importations.png" style="width:100%;display:block"></div>

<p style="font-size:0.6em;color:#4a5a58;margin-top:0.6em">Données → Données SNIS → Importations : onglets En cours, À venir, Historique.</p>

</div>
</div>

<div class="callout-footer">À fixer : la date du mois où les données DHIS2 sont validées, le nombre de mois à réimporter, et qui vérifie, génère et épingle.</div>

---

<!-- _class: spacious -->

## 3 · Formations sanitaires : plateforme et DHIS2

<div class="columns-3">
<div>

<div class="num">4 590<small>identifiants communs à la plateforme (4 613) et à DHIS2 (4 619)</small></div>

</div>
<div>

<div class="num">29<small>nouvelles dans DHIS2, absentes de la plateforme : surtout des structures privées à Fenoarivobe et Ambatolampy</small></div>

</div>
<div>

<div class="num">23<small>sur la plateforme, rangées sous MG_DEL dans DHIS2 : presque toutes en Anosy, 13 avec des données</small></div>

</div>
</div>

Aucune formation sanitaire n'a changé de région, de district ou de commune. Les listes nominatives sont dans le classeur d'audit.

<div class="callout-footer">Proposition : réimporter depuis DHIS2 au niveau Formations Sanitaires avec « Ajouter les nouveaux établissements et mettre à jour les existants ». Les 29 arrivent, les 23 gardent leur historique. Puis générer et épingler un nouveau paquet.</div>

---

## 4 · Paramètres du module de couverture

Pour estimer une couverture, il faut un dénominateur : les grossesses ou les naissances attendues. FASTR les dérive des naissances vivantes déclarées, avec sept taux démographiques. Aujourd'hui, ce sont les **valeurs par défaut du module**, pas celles de Madagascar.

<table class="rates">
<tr><th>Taux</th><th>Défaut</th><th>EDS 2021</th><th>UN IGME 2024</th></tr>
<tr><td>Mortalité néonatale</td><td>39 ‰</td><td><strong>26 ‰</strong></td><td>23,1 ‰</td></tr>
<tr><td>Mortalité postnéonatale</td><td>28 ‰</td><td><strong>21 ‰</strong></td><td>19,9 ‰</td></tr>
<tr><td>Mortalité infantile</td><td>67 ‰</td><td><strong>47 ‰</strong></td><td>43,0 ‰</td></tr>
<tr><td>Mortalité des moins de 5 ans</td><td>103 ‰</td><td><strong>75 ‰</strong></td><td>62,4 ‰</td></tr>
<tr><td>Mortinatalité</td><td>20 ‰</td><td>—</td><td>18,4 ‰</td></tr>
<tr><td>Jumeaux · perte de grossesse</td><td>1,5 % · 3 %</td><td colspan="2">≈ 1,1 % (DHS groupées) · pas d'estimation nationale</td></tr>
</table>

<div class="callout-footer">À décider : adopter l'EDS 2021 ou UN IGME 2024, sans mélanger les deux. Où : Résultats → Paramètres par défaut des modules. Même écran pour passer les dénominateurs au niveau district.</div>

---

<!-- _class: bg-green -->

## Ce qu'on retient de l'appel

<div class="columns-3">
<div>

<div class="eyebrow" style="color:#fff;border-color:#fff">Décidé aujourd'hui</div>

- Formation : participants, dates, format
- Importation récurrente : jour, fenêtre, responsable
- Établissements : réimportation faite ou planifiée

</div>
<div>

<div class="eyebrow" style="color:#fff;border-color:#fff">Équipe pays</div>

- Confirmer les taux de couverture
- Confirmer la date de validation mensuelle DHIS2
- Créer les comptes des participants

</div>
<div>

<div class="eyebrow" style="color:#fff;border-color:#fff">Équipe FASTR</div>

- Envoyer les guides et le calendrier
- Vérifier la première importation planifiée
- Générer et épingler le paquet à jour

</div>
</div>
