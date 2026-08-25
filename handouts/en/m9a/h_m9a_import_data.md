---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Instance Setup"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Facility structure</span> <span class="arrow">→</span> <span class="step done">Indicators</span> <span class="arrow">→</span> <span class="step current">Data</span> <span class="arrow">→</span> <span class="step">Verify</span></div>

# Import HMIS data

<p class="meta-line"><strong>Instance Setup</strong> · <strong>~15 min + server time</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Before you start</p>

- ☐ Facilities imported (the Facilities card shows your counts)
- ☐ Indicators imported and mapped (every DHIS2 indicator has a common-indicator link)
- ☐ You've decided which **time period** to pull (e.g., last 36 months — discuss with your team)

</aside>
<div class="p1-main">

## What you'll do

Pull the actual data values from DHIS2 for your chosen indicators and time period. This is the largest data operation in the setup — depending on country size, it can take 5–30 minutes to run. The import runs **on the server**, so once it's launched you can close the tab and come back.

<h2 class="step-h"><span class="step-n">1</span><span>Open the Imports page</span></h2>

Click **Data** in the top bar, then the **Data** card in the **HMIS** section. Click **Imports**.

The page has four tabs — **Current**, **Future**, **History**, **By indicator** — plus the buttons **New DHIS2 import**, **Upload CSV file**, and **Manage connection**.

</div>
</div>

![h:190](../../../resources/screenshots/m9a_setup/22_imports_page.png)

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">2</span><span>Start the wizard — Credentials</span></h2>

Click **New DHIS2 import**. The wizard has five steps: **Credentials**, **Indicators**, **Time**, **Config**, **Review & launch**.

On **Credentials**, the stored DHIS2 connection appears. Click **Next**.

![h:170](../../../resources/screenshots/m9a_setup/25_wizard_credentials.png)

> No stored connection yet? Set one up once with **Manage connection** on the Imports page — it is saved for the whole instance, encrypted, so nobody re-types credentials for every import.

<h2 class="step-h"><span class="step-n">3</span><span>Indicators</span></h2>

Tick every indicator you want data for — the top checkbox selects all. Click **Next**.

![h:200](../../../resources/screenshots/m9a_setup/26_wizard_indicators.png)

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">4</span><span>Time</span></h2>

Choose **Now**, then **Next**.

![h:140](../../../resources/screenshots/m9a_setup/27_wizard_time.png)

> **Worth knowing for later:** **Recurring** schedules this import to repeat by itself — for example every month. Once your setup is stable, that's one routine task gone.

<h2 class="step-h"><span class="step-n">5</span><span>Config — the period range</span></h2>

Set the **period range** with the two sliders. Be deliberate: 3 years of monthly data ≈ 36 periods × N facilities, which scales fast. Click **Next**.

![h:150](../../../resources/screenshots/m9a_setup/28_wizard_config.png)

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">6</span><span>Review & launch</span></h2>

Check the summary — connection, indicator count, window, and the number of (indicator, month) pairs to fetch. Click **Start import**.

![h:180](../../../resources/screenshots/m9a_setup/29_wizard_review_launch.png)

<h2 class="step-h"><span class="step-n">7</span><span>Let the server work</span></h2>

The import runs on the server. The **Current** tab shows progress; you can close the tab, work elsewhere, or log off — the import keeps running. The **History** tab tells you when it is done.

![h:170](../../../resources/screenshots/m9a_setup/23_imports_history.png)

## Checkpoint

The HMIS Data page now shows your indicators as a chart, with values flowing through time. The **By indicator** tab lists every indicator with its months of data and when it was last imported.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## What could go wrong

- **Some (indicator, month) pairs failed** — the import keeps everything that succeeded; nothing is rolled back. Open the **By indicator** tab to see failed months per indicator and retry just those pairs. A few failures usually mean no data exists in DHIS2 for that combination; many failures point to the indicator mapping (see *Import indicators*).

![h:170](../../../resources/screenshots/m9a_setup/24_imports_by_indicator.png)

- **Network drops mid-import** — nothing to protect on your side: the fetch runs on the server, not in your browser. Check the History tab later.
- **The window was too narrow** — re-run the wizard with a wider period range. Re-imported months are simply refreshed with the current DHIS2 values.

## What's next

Final step: **Verify and explore** — confirm everything looks right and learn how to navigate your data. Then an administrator **generates a results package** so projects can use the new data.
