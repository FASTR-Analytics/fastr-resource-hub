---
marp: true
theme: fastr
paginate: true
---

## After launch: Current, History, Ledger

<div class="columns-text-left">
<div>

The import runs **on the server**. Close the tab, work elsewhere, log off: it keeps running.

- **Current** tab: progress of the running import
- **History** tab: when it finished and how many pairs succeeded or failed
- **Ledger** tab (HMIS Data page): per indicator, the months with data, the last import, and any failed months, with a retry for just those

An import keeps everything that succeeded; nothing is rolled back. A few failures usually mean no data in DHIS2 for that month. Many failures point to the indicator mapping.

</div>
<div>

![w:100%](../../resources/screenshots/m9a_setup/24_ledger.png)

</div>
</div>

**Then:** an administrator generates a results package so projects can use the new data. Imports change the instance; projects read packages.
