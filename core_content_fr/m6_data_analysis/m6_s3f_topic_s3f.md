---
marp: true
theme: fastr
paginate: true
---

## Options de dénominateur utilisées par FASTR

FASTR construit **quatre chaînes de dénominateurs candidates** à partir des volumes de services SIGS, chacune ancrée sur un service différent :

- **Chaîne dérivée de CPN1** — ancrée sur les premières visites prénatales
- **Chaîne dérivée des accouchements** — ancrée sur les accouchements rapportés
- **Chaîne dérivée du BCG** — ancrée sur les vaccinations BCG (niveau national uniquement)
- **Chaîne dérivée de Penta1** — ancrée sur la première dose de Penta (niveau national uniquement)

Les estimations de **UN World Population Prospects (UN WPP)** sont chargées en parallèle. UN WPP n'est pas un dénominateur sélectionnable — il sert de **point de repère** pour comparer les quatre chaînes et présélectionner celle dont le ratio à UN WPP est le plus proche de 1,0.
