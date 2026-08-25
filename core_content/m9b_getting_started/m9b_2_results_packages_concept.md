---
marp: true
theme: fastr
paginate: true
---

## Where a project's numbers come from

**Data lives at the instance level.** Administrators import it from DHIS2, once for the whole country.

**Analyses are computed into a results package.** An administrator selects the analysis modules and generates a package — a versioned set of already-computed results.

**Your project reads one package.** Every chart, table, and report in the project draws on the package attached to it.

- New month of data? → new package → projects switch to it
- Your project's **Results package** tab shows which package is in use and its date
- Set **"Always use the instance's pinned package"** and your project follows the reference package automatically

<!--
PRESENTER NOTES:
- Concept slide, ~5 min, before participants wonder why there is no "data" in their project.
- Key message: participants never run analyses. Admins import + generate; projects read.
- The one thing to check when numbers look old: the Results package tab — which package, what date.
- Analogy that works: the instance is the kitchen, the package is the finished dish, the project is the table it is served at.
-->
