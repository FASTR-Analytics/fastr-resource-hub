---
marp: true
theme: fastr-handout
paginate: true
footer: "FASTR · Instance Setup"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Facility structure</span> <span class="arrow">→</span> <span class="step done">Indicators</span> <span class="arrow">→</span> <span class="step current">Data</span> <span class="arrow">→</span> <span class="step">Verify</span></div>

# Import HMIS data

<p class="meta-line"><strong>Instance Setup</strong> · <strong>~25 min</strong></p>

## Before you start

- ☐ Facilities imported (admin units page is green)
- ☐ Indicators imported and mapped (every DHIS2 indicator has a common-indicator link)
- ☐ You've decided which **time period** to pull (e.g., last 36 months — discuss with your team)

## What you'll do

Pull the actual data values from DHIS2 for your chosen indicators and time period. This is the largest data operation in the setup — depending on country size, it can take 5-30 minutes to run.

## Steps

### 1. Open HMIS Data import

From the **Data** page, click **HMIS Data**, then **New import**.

### 2. Choose "Import directly from DHIS2"

Same option you used for facilities. Click **Save**.

> If you ticked **Save credentials for this session** earlier (in admin areas or indicators), the platform skips the connection form here. Otherwise it shows up now — same fields as before.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 3. Select indicators and time range

- Tick every indicator you want data for.
- Set the **time range** with the slider — be deliberate (3 years of monthly data ≈ 36 periods × N facilities, which scales fast).

![h:200](../../../resources/screenshots/m9a_setup/13_select_indicators_period.jpeg)

Click **Save selection**.

### 4. Configure error handling

On the import-config screen, make sure **Abort the entire import attempt** is selected. This guarantees data integrity: if any indicator-period combination fails, the *whole* import is rolled back. You won't end up with half-loaded data.

Click **Start fetching from DHIS2**.

![h:200](../../../resources/screenshots/m9a_setup/14_abort_start_fetching.jpeg)

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 5. Watch progress

A progress indicator shows the running count of fetched indicator-period combinations.

> ⚠ **Don't close the tab.** The fetch runs in your browser session.

### 6. Review the summary

When the fetch finishes, click **Import Summary** to see:

- Source (DHIS2 URL)
- Date
- Successful vs failed fetches
- Total rows waiting for integration

![h:200](../../../resources/screenshots/m9a_setup/15_import_summary.jpeg)

### 7. Integrate

If the summary looks correct, click **Integrate and finalize**. Wait for the integration bar to complete.

### 8. Clean up

Click **Remove completed upload form** to clear the interface. Your imported data stays in place — you're just hiding the form.

## Checkpoint

The HMIS Data page now shows your indicators as a chart, with values flowing through time.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## What could go wrong

- **"Failed: X combinations"** — usually means a facility-indicator combination has no data in DHIS2 for that period. If only a few, you can re-import with a narrower set. If many, check your indicator mapping (Phase 3 of *Import indicators*).
- **Browser freezes / tab unresponsive** — large pulls (1000+ facilities × 36 months × 10 indicators) stress the browser. Reduce indicators or shorten the time range and pull in batches.
- **Network drops mid-fetch** — the *abort the entire import* setting protects you here. Re-run with the same selection.

> 🔎 **Verify in your current UI**: import screens and labels may differ from the screenshots; the flow is the same.

## What's next

Final step: **Verify and explore** — confirm everything looks right and learn how to navigate your data.
