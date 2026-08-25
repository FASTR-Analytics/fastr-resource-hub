---
marp: true
theme: fastr-handout
paginate: true
class: facilitator
footer: "FASTR · Instance Setup · Facilitator"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

# Facilitator guide — Instance Setup

<p class="meta-line"><strong>Facilitator guide</strong> · <strong>Instance Setup</strong> · <strong>5 activities · ~90 min</strong></p>

## Purpose

Instance Setup is the configuration sequence that connects a country's DHIS2 data into a FASTR instance. Participants import the facility structure, define and map indicators, pull the HMIS data, and verify the result. Every later activity in the workshop runs on the data loaded here, so the module is a prerequisite rather than a topic in its own right.

The five activities run in a **strict order**: each step depends on the one before it, and errors cascade — a wrong indicator mapping in step 3 surfaces as a wrong number in step 5. By the end, each team should have a verified instance whose spot-checked values match DHIS2.

## Session at a glance

| # | Activity | Time | Format |
|---|----------|------|--------|
| 1 | Before you begin | ~5 min | Guided, whole room |
| 2 | Import facility structure | ~20 min | Guided, whole room |
| 3 | Import and map indicators | ~30 min | Guided, whole room |
| 4 | Import HMIS data | ~25 min | Guided, whole room |
| 5 | Verify and explore your setup | ~10 min | Guided, whole room |

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Running the session

**Preparation.** Confirm two things for every team *before* the session starts: working DHIS2 credentials (URL, username, password) and a completed Data Prep Checklist. Missing access is the single biggest time sink here, and it is something only you or an administrator can resolve — not the participant.

**How to demonstrate.** The handouts are detailed click-by-click procedures. Demonstrate the first few clicks of each step on the shared screen so participants recognize where they are, then let them follow the handout at their own pace. The fiddly moments worth showing slowly are flagged under **Demonstrate** below.

**Grouping.** This is a guided sequence, not independent work — keep the room together and move step by step. Do not let faster participants race ahead; later steps fail silently if an earlier one was done wrong.

**Pacing.** If anyone falls behind, pause the whole room. The cost of waiting is far lower than the cost of a team discovering at step 5 that step 3 was wrong and having to redo the sequence.

**The message to carry through.** Setup is "done" only when the verification step passes. A green tile is not proof; a spot-checked value matching DHIS2 is.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## The activities

### 1. Before you begin · ~5 min · whole room

**What happens.** An orientation page that previews the four-step sequence and explains how DHIS2 credentials are handled. Participants gather what they need — a completed Data Prep Checklist, DHIS2 URL/username/password, a stable browser. The DHIS2 connection is stored **once per instance** (encrypted), via **Manage connection** on the Imports page; after that, nobody re-types credentials.

**Say something like.** *"We set up the DHIS2 connection once, for the whole instance. From then on every import — including the scheduled ones — uses that stored connection."*

**What a good result looks like.** Every team has its checklist in hand, and the instance's stored connection is set up before anyone clicks Import.

**Watch for.**
- Teams without confirmed DHIS2 access. Resolve this before starting, not mid-sequence.
- Someone replacing the stored connection with personal credentials mid-session — it is instance-wide, so one change affects everyone.

### 2. Import facility structure · ~20 min · whole room

**What happens.** A step-by-step procedure to pull the country's facility registry into FASTR: Data → **HMIS** section → **Facilities** card → import from DHIS2 → select the **Facility** level → finish, until the Facilities card shows the expected counts. Admin areas are **derived automatically from the facility rows** — there is no separate admin-area import.

**Demonstrate.** Show the path to the Facilities card and the point where the DHIS2 **level** is chosen — selecting the wrong level here is the most common failure, and it is hard to spot afterwards.

**What a good result looks like.** A facility list that matches the country's real structure, with the Facilities card showing plausible facility and admin-area counts.

**Watch for.**
- An empty facility list or an odd-looking hierarchy — usually the wrong DHIS2 level, or the user lacks org-unit read access.
- Authentication failures — typically a malformed URL rather than a wrong password.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 3. Import and map indicators · ~30 min · whole room

**What happens.** The longest and most error-prone step, in three phases: create the common indicators, import the country's DHIS2 indicator names, then map each DHIS2 indicator to its common counterpart.

**Demonstrate.** Show one full mapping — one DHIS2 indicator linked to one common indicator — and the Common ID naming rule, before teams work through their own list.

**Say something like.** *"Common IDs are lowercase letters and underscores only. No spaces, no accents. And each DHIS2 indicator maps to exactly one common indicator."*

**What a good result looks like.** Every priority indicator mapped, with no rejected IDs and no DHIS2 indicator left mapped to two common ones.

**Watch for.**
- A rejected Common ID — a space, accent, or special character was used.
- Mapping confusion — remind them the relationship is one-to-one. A mistake here is what surfaces as a wrong number in step 5.

### 4. Import HMIS data · ~25 min · whole room

**What happens.** The largest data operation in setup: pulling actual HMIS values from DHIS2. Participants walk the five-step wizard — **Credentials, Indicators, Time, Config, Review & launch** — and the import then runs on the server. Progress shows on the Imports page (Current tab); completion shows in History.

**Demonstrate.** Show the Review & launch summary — the (indicator, month) pair count tells you how big the pull is — and the **By indicator** tab, so teams know where failed pairs appear and how to retry them.

**Say something like.** *"Once you click Start import, the server does the work. You can close the tab — check the History tab in a few minutes. Whatever succeeds is kept; failed months can be retried on their own."*

**What a good result looks like.** The import finished in History, with the By indicator tab showing the expected months of data and zero (or explainable) failed months.

**Watch for.**
- Teams moving on before the import finishes — the verify step (and later the results package) needs the data to be in.
- Failed (indicator, month) pairs being ignored — a few are normal (no data in DHIS2); many point back at the mapping in step 3.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 5. Verify and explore your setup · ~10 min · whole room

**What happens.** A verification step that doubles as an introduction to the chart explorer. Participants view indicators as time series, toggle indicators, adjust the y-axis scale, spot-check a known facility value against DHIS2, and review the import history.

**Demonstrate.** Show one spot-check end to end: pick a facility and month whose value you know, find it in FASTR, and compare it to DHIS2. This is the moment that proves the setup.

**Say something like.** *"A green tile means the import ran. A spot-check that matches DHIS2 means the import is correct. We need the second one."*

**What a good result looks like.** A spot-checked value that matches DHIS2 exactly.

**Watch for.**
- Flat or zero values — usually the period range does not overlap the DHIS2 data.
- A mismatched spot-check — almost always incomplete indicator mapping in step 3. Send the team back there rather than continuing.

## Closing the session

Do not move on until every team's verification passes. A failed spot-check is not a detail to fix later — the rest of the workshop runs on this data, and a quiet mapping error will reappear as a wrong finding in a participant's report.
