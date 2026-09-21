---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Instance Setup"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Facility structure</span> <span class="arrow">→</span> <span class="step current">Indicators</span> <span class="arrow">→</span> <span class="step">Data</span> <span class="arrow">→</span> <span class="step">Verify</span></div>

# Add indicators

<p class="meta-line"><strong>Instance Setup</strong> · <strong>~30 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Before you start</p>

- ☐ You've completed **Connect to the platform** and **Import facility structure**
- ☐ Your **FASTR Data Prep Checklist** is open at the *Indicator mapping template* sheet — you'll use column **C — INDICATOR OF INTEREST** (e.g., ANC1, ANC4) and column **G — OFFICIAL INDICATOR NAME IN DHIS2**

<p class="sb-label">Why it matters</p>

Without indicators, FASTR doesn't know what to download from DHIS2 or what to call it in the analysis.

</aside>
<div class="p1-main">

## What you'll do

For each indicator on your list, three moves on one screen:

1. **Find it** in DHIS2, from inside FASTR
2. **Name it** — a short ID (e.g., `anc1`) and a readable label (e.g., "ANC 1st visit")
3. **Save**

All indicators live in **one table**. Each row has a type: **DHIS2 element** (fetched from DHIS2), **Uploaded** (CSV file), **Sum**, or **Calculated** (a formula). Here you create DHIS2 elements.

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">1</span><span>Open the indicator list</span></h2>

1. Click **Data** in the top bar, then, in the **HMIS** section, the **Indicators** card.
2. Look at the **default list**. Each row shows the **Indicator ID**, its **label**, its **type**, and the **Defined by** column (the DHIS2 code and its original name). If an indicator on your list is already there, skip it.

![w:470](../../../resources/screenshots/indicators_v2_en/02_indicator_list.png)

> **Rows marked "Special"** are read by ID by the analysis modules (`anc1`, `delivery`, `bcg`…). Keep those IDs as they are: fill them with the right DHIS2 code rather than creating new ones.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">2</span><span>Search DHIS2</span></h2>

1. Click **Add from DHIS2**, top right of the list. FASTR uses the instance's **stored DHIS2 connection** (the **DHIS2 connection** card on the Data page, the same one as the previous step).
2. In the search field, type a term from column **G — OFFICIAL INDICATOR NAME IN DHIS2** (e.g., `antenatal`) or paste the DHIS2 ID. Click **Search**.
3. In the results, click **Add** next to each element you want. It moves to the **Selected items** column.

![w:470](../../../resources/screenshots/indicators_v2_en/03_search_dhis2.png)

4. Search another term if needed; the selection is kept. Then click **Next: name indicators (N)**.

> **Tip:** a broad word (`vaccine`, `delivery`) brings the whole family at once. Greyed rows saying "Cannot be added" are not monthly counts. **Subgroup** (an age band, a sex)? Unfold the row's **chevron** and add the **COC** line you want, not the main line.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">3</span><span>Name, then save</span></h2>

FASTR proposes an **ID** and a **label** for each element, built from the DHIS2 name. Replace them:

- **Indicator ID** — the technical name. **Lowercase letters, digits and underscores only**, no accents, no spaces (e.g., `mam_new`). For an indicator on the FASTR list, use its standard ID (`anc1`, `anc4`, `penta1`…).
- **Label** — the name shown on charts. Accents and spaces are fine; take column **C — INDICATOR OF INTEREST**.

![w:470](../../../resources/screenshots/indicators_v2_en/04_name.png)

Click **Save**. Repeat steps 2 and 3 until your whole list is covered.

## Checkpoint

Back on the list, each new indicator shows the **DHIS2 element** badge, its DHIS2 code under **Defined by**, and a tick under **Include**. The **Indicators (N)** counter went up by as many.

![w:400](../../../resources/screenshots/indicators_v2_en/05_check.png)

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## What could go wrong

- **"… already exists; choose another id"** — the ID is taken. Open the existing indicator with the pencil and change its DHIS2 code, or pick another ID.
- **"Already added as …"** — that DHIS2 code is already in FASTR. Nothing to create.
- **The ID is rejected** — an accent, space, comma, bracket, or a reserved word. Lowercase, digits, underscores.
- **DHIS2 search returns nothing** — try another term, or check that the connection's DHIS2 user can read the metadata.
- **"No DHIS2 connection is saved"** — Data page, **DHIS2 connection** card, enter the URL and credentials.
- **Two DHIS2 codes for one indicator** (two age bands to add up) — add both as elements, then **Create new** → type **Sum**.

## What's next

The indicators are defined but **no numbers have been downloaded yet**. Move on to **Import HMIS data**.
