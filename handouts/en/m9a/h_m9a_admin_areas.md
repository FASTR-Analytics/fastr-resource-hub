---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Instance Setup"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step current">Facility structure</span> <span class="arrow">→</span> <span class="step">Indicators</span> <span class="arrow">→</span> <span class="step">Data</span> <span class="arrow">→</span> <span class="step">Verify</span></div>

# Import facility structure

<p class="meta-line"><strong>Instance Setup</strong> · <strong>~20 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Before you start</p>

- ☐ You've read **Before you begin** (you know your DHIS2 URL + credentials)
- ☐ You know which level in your DHIS2 hierarchy corresponds to *facility* (often level 4 or 5)

</aside>
<div class="p1-main">

## What you'll do

Pull your country's facility registry — every facility with its region and district — directly from DHIS2 into FASTR. The administrative areas are **derived automatically from the facility rows**: you never manage admin areas separately. After this, every analysis can disaggregate results by region, district, or facility.

<h2 class="step-h"><span class="step-n">1</span><span>Open the Facilities registry</span></h2>

1. Click **Data** in the top navigation. The page is organized into **General**, **HMIS**, **HFA**, and **ICEH** sections.
2. In the **HMIS** section, click the **Facilities** card.

![h:180](../../../resources/screenshots/m9a_setup/20_data_page.png)

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">2</span><span>Import from DHIS2</span></h2>

Start a DHIS2 import from the Facilities page. The **stored DHIS2 connection** appears — the one set up once for the whole instance via **Manage connection**. Confirm it.

> No stored connection yet? An administrator sets it up once — URL (with `https://`), username, password — and it is saved encrypted for the whole instance. Nobody re-types credentials after that.

<h2 class="step-h"><span class="step-n">3</span><span>Select the facility level</span></h2>

Select **Facility**. FASTR's analysis modules require facility-level data — they aggregate up from facilities to districts and regions internally, not the other way around. Selecting *Facility* brings all the levels above it (district, region, …) along automatically.

Launch the import and wait for it to complete — usually 30 seconds to a few minutes depending on country size.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Checkpoint

- The **Facilities** page lists your country's facilities with their admin areas.
- Back on the **Data** page, the Facilities card shows the counts — facilities, and admin areas at each level. Check they are plausible for your country.

![h:190](../../../resources/screenshots/m9a_setup/35_hmis_facilities.png)

## What could go wrong

- **Empty facility list** — the DHIS2 user behind the stored connection may not have read access to org units. Check with the DHIS2 admin.
- **Hierarchy looks wrong** — the wrong level was picked. Re-import with the right level; existing facilities are updated, not duplicated.
- **Authentication fails** — usually a malformed URL (missing `https://` or a trailing slash) rather than a wrong password. Fix it via **Manage connection** on the Imports page.
- **Import hangs** — large countries (1000+ facilities) take longer. Wait at least 5 minutes before retrying.

## What's next

Move on to **Import and map indicators**.
