---
marp: true
theme: fastr-handout
paginate: true
class: facilitator
footer: "FASTR · Instance Setup · Facilitator"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

# Facilitator guide — Instance Setup

<p class="meta-line"><strong>Facilitator guide</strong> · <strong>Instance Setup</strong> · <strong>NOT FOR DISTRIBUTION</strong></p>

## About these activities

Instance Setup is the hands-on configuration sequence — participants connect a country's DHIS2 data into a FASTR instance. The five activities run in a **strict order**: each step depends on the one before it, and mistakes cascade — a wrong indicator mapping in step 3 surfaces as a wrong number in step 5.

**Five handouts**, run in order. **~90 min** of participant time. Most failures here are credential or mapping mistakes, not conceptual ones.

## How to run it

- This is a **guided sequence** — keep the room together, step by step. Don't let people race ahead.
- The handouts are detailed procedures. Demo the first few clicks of each step, then let participants follow the handout at their own pace.
- Have **DHIS2 credentials** and each team's **Data Prep Checklist** confirmed *before* you start — missing access stalls the whole room.
- If anyone falls behind, **pause the room**. Later steps will not work without the earlier ones completed.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## The activities

### 1. Before you begin

**Orientation · ~5 min**

**What it is** — an orientation page that previews the four-step sequence and explains how DHIS2 credentials are handled.
**What the handout covers** — participants gather what they need (filled Data Prep Checklist, DHIS2 URL / username / password, a stable browser); there is no separate "connect" step — credentials are entered on the first import.
**Watch for** — tell participants to tick **"Save credentials for this session"** on the first prompt, or they will be re-prompted on every later import.

### 2. Import facility structure

**Setup procedure · ~20 min**

**What it is** — a step-by-step procedure to pull the country admin hierarchy into FASTR.
**What the handout covers** — Data → Structure & maps → Admin areas → import directly from DHIS2 → select the **Facility** level → finalize until the Structure & maps tile turns green.
**Watch for** — an empty facility list or a wrong-looking hierarchy usually means the wrong DHIS2 level was picked, or the user lacks org-unit read access. Auth failures are typically a malformed URL.

### 3. Import and map indicators

**Setup procedure · ~30 min**

**What it is** — a three-phase procedure to define and map indicators. The longest and most error-prone step.
**What the handout covers** — create common indicators, import the country's DHIS2 indicator names, then map each DHIS2 indicator to its common counterpart.
**Watch for** — a rejected Common ID means a space, accent, or special character was used: insist on lowercase letters and underscores only. Each DHIS2 indicator maps to **exactly one** common indicator.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 4. Import HMIS data

**Setup procedure · ~25 min**

**What it is** — the largest data operation in setup: pulling actual HMIS data values from DHIS2.
**What the handout covers** — select indicators and a time range, set error handling to **"Abort the entire import attempt"**, fetch, review the import summary, then integrate and finalize.
**Watch for** — large pulls can freeze the browser. Warn participants not to close the tab mid-fetch; for large countries, narrow the indicators / time range and import in batches.

### 5. Verify and explore your setup

**Setup procedure · ~10 min**

**What it is** — a verification step to spot-check imported data and learn the chart explorer.
**What the handout covers** — view indicators as time series, toggle indicators, adjust the y-axis scale, spot-check a known facility value against DHIS2, and review import history.
**Watch for** — flat or zero values usually mean the period range does not overlap DHIS2 data. A mismatched spot-check almost always traces back to **incomplete indicator mapping in step 3** — send them back there.

## Wrapping up

The setup is only "done" when the verify step passes. If a spot-check fails, do not move on — the rest of the workshop runs on this data.
