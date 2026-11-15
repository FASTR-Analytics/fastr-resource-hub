---
marp: true
theme: fastr
paginate: true
---

## Where a product's numbers come from

**Data lives at the instance level.** Administrators import it from DHIS2, once for the whole country.

**Analyses are computed into a results package.** An administrator picks the modules and generates a package: a versioned set of already-computed results. One package is **pinned** as the reference.

**Every product reads one package and one scope.** A deck, a report or a visualization shows them in its row on the Products page, and in the button at the top of its editor.

- New month of data? → new package → products are moved to it
- To change a product's package or scope: its **⋮ menu → Results package and scope…**
- To see the packages themselves: the **Results** entry in the side navigation

<!--
PRESENTER NOTES:
- Concept slide, ~5 min, before participants wonder why there is no "data" to load.
- Key message: participants never run analyses. Admins import and generate; products read.
- The one thing to check when numbers look old: the package shown on the product. Is it the pinned one?
- A scope is a named view (an area, a period). "All data" is the default scope for new products.
- Analogy: the instance is the kitchen, the package is the finished dish, the product is the plate it is served on.
-->
