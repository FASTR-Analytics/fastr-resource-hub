---
marp: true
theme: fastr-handout
paginate: true
footer: "FASTR · Instance Setup"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Facility structure</span> <span class="arrow">→</span> <span class="step current">Indicators</span> <span class="arrow">→</span> <span class="step">Data</span> <span class="arrow">→</span> <span class="step">Verify</span></div>

# Import and map indicators

<p class="meta-line"><strong>Instance Setup</strong> · <strong>~30 min</strong></p>

## Before you start

- ☐ You've completed **Connect to the platform** and **Import facility structure**
- ☐ Your **FASTR Data Prep Checklist** is open at the *Indicator mapping template* sheet. You'll use column **C — INDICATOR OF INTEREST** (e.g., ANC1, ANC4) and column **G — OFFICIAL INDICATOR NAME IN DHIS2**

## What you'll do

Set up indicators in three rounds:

1. **Create common indicators** — generic names FASTR uses internally (e.g., `anc1`, `anc4`)
2. **Import DHIS2 indicators** — the country-specific names from your DHIS2 (e.g., "Antenatal client 1st visit")
3. **Map** each DHIS2 indicator to its matching common indicator

Without mapping, FASTR can pull data but won't know how to compare across countries or analyses.

---

## Phase 1 — Create common indicators

1. In the **Data** section (left panel), click **Indicators**.

   ![h:160](../../../resources/screenshots/m9a_setup/07_indicators_page.jpeg)

2. Check the **default indicators list** — if your indicators are already there, skip ahead to Phase 2. You can rename a default via the pencil icon if needed.
3. To add a new one, click **Create common indicator** (top-left).
4. In the form, fill:
   - **Common ID** — the variable name. **No accents, no spaces**. Underscores allowed (e.g., `mam_nouveau`).
   - **Label** — the display name (accents and spaces allowed; use column **C — INDICATOR OF INTEREST** of your *Indicator mapping template*).

   ![h:200](../../../resources/screenshots/m9a_setup/08_create_common_form.jpeg)

5. **Repeat for every indicator** in your *Indicator mapping template*.

---

## Phase 2 — Import DHIS2 indicator names

1. Click **Import DHIS2 indicator**.

   ![h:160](../../../resources/screenshots/m9a_setup/09_import_dhis2_btn.jpeg)

> If you haven't saved DHIS2 credentials yet this session, the connection form appears now — same fields as in *Import facility structure*. Tick **Save credentials for this session**.

2. In the search field, type a term from column **G — OFFICIAL INDICATOR NAME IN DHIS2** of your *Indicator mapping template* (e.g., `antenatal` for antenatal care).
3. Click **Search**. Results appear in the list.
4. Click the **Add** icon next to each indicator you want. The right column ("Selected") fills up.

   ![h:200](../../../resources/screenshots/m9a_setup/10_dhis2_search_results.jpeg)

5. Repeat for every indicator (search a different term as needed). When done, click **Save Selected (N)** in the top-right.

> **Tip:** Search broad terms (e.g., `vaccine`, `delivery`) to see all related DHIS2 indicators at once — easier than searching one by one.

---

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Phase 3 — Map DHIS2 indicators to common indicators

For each imported DHIS2 indicator, link it to its common counterpart:

1. Click the **pencil (edit) icon** next to the DHIS2 indicator.
2. In the panel that opens, click the **+ icon** under *Associated common indicators*.

   ![h:200](../../../resources/screenshots/m9a_setup/11_mapping_panel.jpeg)

3. Select the matching common indicator from the dropdown.
4. Click **Save**.
5. **Repeat for every DHIS2 indicator.**

## Checkpoint

When you go back to the indicators page, you should see every DHIS2 indicator with its mapped common indicator listed alongside.

![h:200](../../../resources/screenshots/m9a_setup/12_all_mapped.jpeg)

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## What could go wrong

- **"Common ID rejected"** — the ID contains a space, accent, or special character. Stick to lowercase letters + underscores.
- **DHIS2 search returns nothing** — try a different term, or check that your DHIS2 user has access to the indicator metadata.
- **No matching common indicator in the dropdown** — go back to Phase 1 and create it first.
- **Same DHIS2 indicator mapped to two common indicators** — usually wrong. Each DHIS2 indicator should map to exactly one common indicator.

> 🔎 **Verify in your current UI**: button labels and panel locations may differ; the flow is the same.

## What's next

With facilities and indicators in place, you're ready to pull actual data values. Move on to **Import HMIS data**.
