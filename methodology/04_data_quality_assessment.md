# Data quality assessment (DQA)

## Background and purpose

### Objective of the module

The Data Quality Assessment (DQA) module evaluates the reliability of routine Health Management Information System (HMIS) data reported by health facilities. It functions as an initial quality control step within the FASTR pipeline, reviewing monthly facility reports to identify data quality issues prior to their use in downstream analysis.

The module assesses data quality across three complementary dimensions: outliers, which identify unusually high reported values that may reflect reporting or data entry errors; completeness, which measures the regularity and continuity of facility reporting over time; and consistency, which evaluates whether related indicators exhibit expected relationships. These dimensions are combined into an overall DQA score, providing a standardized summary measure of data reliability.

Routine HMIS data are a primary source for monitoring health service delivery at both facility and population levels, capturing events such as immunizations delivered and births attended by skilled health personnel. As with all routinely collected data, HMIS data are subject to quality limitations. The FASTR DQA module applies a systematic review of monthly data at the facility and indicator levels to identify and characterize these limitations. Results are summarized as annual estimates, which may reflect partial-year data depending on data availability at the time of analysis (for example, analyses conducted mid-year may include data only for the months available).

### Analytical rationale

Data quality directly affects the reliability of health indicators and coverage estimates. Before service utilization rates or population coverage are calculated, it is necessary to assess whether the underlying facility data are sufficiently reliable. This module identifies data patterns that may distort analytical results, allowing users to make informed decisions about data treatment in subsequent steps of the pipeline.

### Key points

| Component | Details |
|-----------|---------|
| **Inputs** | Raw HMIS data (`hmis_ISO3.csv`) containing facility service volumes by month and indicator<br>Geographic/administrative area identifiers<br>Standardized indicator names |
| **Outputs** | - Outlier flags and lists<br>- Completeness status by facility-indicator-month<br>- Consistency results at geographic level<br>- Overall DQA scores |
| **Purpose** | Evaluate HMIS data reliability through outlier detection, completeness assessment, and consistency checking to ensure trustworthy inputs for coverage estimation |

---

## Analytical workflow

### Overview of analytical steps

The module applies a structured sequence of data quality checks, progressing from individual observations to an overall assessment of data reliability:

**Step 1: Data preparation**  
Monthly facility reports are loaded and organized for analysis. Dates are standardized, and the geographic units and health indicators available in the dataset are identified.

**Step 2: Outlier detection**  
For each facility and indicator (for example, pentavalent vaccine doses or antenatal care visits), the module identifies unusually high values that may reflect reporting or data entry errors. Two complementary approaches are used: statistical outlier detection based on deviations from a facility’s historical reporting pattern, and proportional checks that flag months accounting for an implausibly large share of annual service volumes.

**Step 3: Completeness assessment**  
The module evaluates the consistency of facility reporting over time by constructing a complete reporting timeline for each facility–indicator combination and identifying missing months. Facilities with extended periods of non-reporting (six months or more) are classified as inactive rather than incomplete.

**Step 4: Consistency assessment**  
Related indicators are expected to follow predictable relationships. For example, the number of first antenatal care visits should exceed the number of fourth visits. The module assesses these relationships using indicator ratios calculated at the district level, reducing bias from patient movement across facilities, and flags deviations from expected patterns.

**Step 5: Indicator availability checks**  
Before consistency assessments are applied, the module verifies that the required indicator pairs are present in the data. Where indicators are missing, the analysis adapts to the available information without generating errors.

**Step 6: DQA score calculation**  
For a defined set of core indicators (typically first-dose pentavalent vaccination, first antenatal care visit, and outpatient department visits), results from the outlier, completeness, and consistency checks are combined into an overall DQA score. A facility–month receives the highest score only if all core indicators meet minimum standards across all three dimensions.

**Step 7: Outputs**  
The module generates a set of structured outputs, including outlier flags, completeness indicators, consistency results, and final DQA scores. These outputs are used in subsequent FASTR modules and provide a transparent basis for data quality review and improvement.

### Workflow diagram

<iframe src="../resources/diagrams/mod1_workflow.html" width="100%" height="800" style="border: 1px solid #ccc; border-radius: 4px;" title="Module 1 Interactive Workflow"></iframe>

### Key decision points

**When is a value considered an outlier?**

Outliers are identified by assessing within-facility variation in monthly reporting for each indicator. A value is flagged as an outlier if it meets **either** of the following criteria:

1. The value exceeds 10 times the Median Absolute Deviation (MAD) from the monthly median for the indicator; **or**  
2. The value accounts for more than 80 percent of the total reported volume for a given facility, indicator, and year **and** the reported count exceeds 100.

The MAD is calculated using only values at or above the median, in order to focus detection on unusually high values and avoid flagging low-volume observations.

**Why is consistency assessed at the district level rather than the facility level?**

Patients frequently seek care from different facilities within the same district depending on the service. For example, a woman may receive her first antenatal care visit at a primary health center but deliver at a district hospital. Assessing consistency at the district level accounts for this patient movement and provides a more accurate representation of service utilization patterns.

**What happens when required indicators are missing?**

The module adapts to the data that are available. If required indicator pairs for consistency assessment are missing, consistency checks are not applied, and the DQA score is calculated using only outlier and completeness dimensions. Analysis proceeds using the quality dimensions that can be assessed.

**How are inactive facilities handled?**

Facilities that do not report for six or more consecutive months at the beginning or end of their reporting period are classified as inactive for those months rather than incomplete. This prevents penalizing facilities that have not yet begun reporting or that have permanently ceased operations.

### Data processing and outputs

**Transformation overview**

The module transforms raw facility reports into quality-flagged datasets through the following steps:

1. **Input format**: Monthly observations with facility identifier, reporting period, indicator, and reported count  
2. **Enrichment**: Calculation of supporting statistics, including median values, MAD-based residuals, and proportional volume contributions  
3. **Completion**: Explicit generation of records for missing months, converting implicit reporting gaps into observable data points  
4. **Aggregation**: Aggregation of facility-level data to the district level for consistency assessment  
5. **Flagging**: Assignment of binary quality flags for outliers, completeness, and consistency  
6. **Scoring**: Combination of quality flags into continuous scores (0–1) and corresponding pass/fail indicators  
7. **Output format**: Production of multiple output files tailored to different analytical uses, including rapid outlier review, full data quality analysis, and inputs for downstream FASTR modules  

The module processes data in long format, with one record per facility–indicator–period combination, and outputs standardized data quality measures that are used by subsequent modules to inform data adjustment, weighting, or exclusion decisions.

---
### Analysis outputs and visualization

The FASTR analysis generates six main visual outputs:

**1. Outliers heatmap**

Heatmap table with zones as rows and health indicators as columns, color-coded by outlier percentage.

![Percentage of facility-months that are outliers.](resources/default_outputs/Default_1._Proportion_of_outliers.png)


**2. Indicator completeness**

Heatmap table with zones as rows and health indicators as columns, color-coded by completeness percentage.

![Percentage of facility-months with complete data.](resources/default_outputs/Default_2._Proportion_of_completed_records.png)


**3. Indicator completeness over time**

Horizontal timeline charts showing completeness trends for each indicator over the analysis period.

![Percentage of facility-months with complete data over time.](resources/default_outputs/Default_3._Proportion_of_completed_records_over_time.png)

**4. Internal consistency**

Heatmap table with zones as rows and consistency benchmark categories as columns, color-coded by performance.

![Percentage of sub-national areas meeting consistency benchmarks.](resources/default_outputs/Default_4._Proportion_of_sub-national_areas_meeting_consistency_criteria.png)


**5. Overall DQA score**

Heatmap table with zones as rows and time periods as columns, color-coded by DQA score percentage.

![Percentage of facility-months with adequate data quality over time.](resources/default_outputs/Default_5._Overall_DQA_score.png)

**6. Mean DQA score**

Heatmap table with zones as rows and time periods as columns, color-coded by average DQA score.

![Average data quality score across facility-months.](resources/default_outputs/Default_6._Mean_DQA_score.png)


**Interpretation guide**

For the heatmaps (outputs 1, 2, 4, 5, 6):

- **Rows**: Geographic areas (zones/regions)
- **Columns**: Health indicators or time periods

For the outliers heatmap (output 1):

- **Values**: Percentage of facility-months flagged as outliers
- Lower percentages indicate fewer extreme values

For the indicator completeness heatmap (output 2):

- **Values**: Percentage of facility-months with complete reporting
- Higher percentages indicate more complete reporting

For the indicator completeness over time chart (output 3):

- **Horizontal timeline chart** showing completeness trends by indicator
- **X-axis**: Time period
- **Y-axis**: Completeness percentage
- Shows whether reporting is improving, declining, or stable

For the internal consistency heatmap (output 4):

- **Values**: Percentage of areas meeting consistency benchmarks
- Shows whether related indicators follow expected relationships (e.g., ANC1 ≥ ANC4)

For the DQA score heatmaps (outputs 5–6):

- **Output 5**: Percentage of facility-months passing all quality checks
- **Output 6**: Average DQA score across facility-months
- Higher scores indicate better overall data quality

---

## Detailed reference

This section provides technical details for implementers, developers, and analysts who need to understand the underlying methodology.

### Configuration parameters

The module uses several configurable parameters that control analysis behavior:

???+ "Geographic settings"

    ```r
    # Country identifier
    COUNTRY_ISO3 <- "GIN"  # ISO3 country code

    # Geographic level for consistency analysis
    GEOLEVEL <- "admin_area_3"  # Admin level (1=national, 2=region, 3=district, etc.)
    ```

    The `GEOLEVEL` parameter determines the aggregation level for consistency analysis. Lower administrative levels (3-4) capture local patterns but may have sparse data. Higher levels (2) provide more stable estimates but may mask local inconsistencies.

??? "Outlier detection parameters"

    ```r
    # Proportion threshold for outlier detection
    OUTLIER_PROPORTION_THRESHOLD <- 0.8  # Flag if single month > 80% of annual total

    # Minimum count to consider for outlier flagging
    MINIMUM_COUNT_THRESHOLD <- 100  # Only flag outliers with count >= 100

    # Number of Median Absolute Deviations for statistical outlier detection
    MADS <- 10  # Flag if value > 10 MADs from median
    ```

    **Tuning guidance:**
    - **More sensitive detection**: Lower `OUTLIER_PROPORTION_THRESHOLD` to 0.6-0.7, reduce `MADS` to 8
    - **Less sensitive detection**: Increase `OUTLIER_PROPORTION_THRESHOLD` to 0.9, increase `MADS` to 12-15
    - **Small facilities**: Lower `MINIMUM_COUNT_THRESHOLD` to 50
    - **Large facilities only**: Increase `MINIMUM_COUNT_THRESHOLD` to 200+

??? "DQA indicator selection"

    ```r
    # Core indicators used for DQA scoring
    DQA_INDICATORS <- c("penta1", "anc1", "opd")

    # Consistency pairs to evaluate
    CONSISTENCY_PAIRS_USED <- c("penta", "anc")
    ```

    **Standard indicator sets:**
    - **Maternal-child focus**: `c("anc1", "anc4", "delivery", "penta1", "penta3")`
    - **Immunization focus**: `c("bcg", "penta1", "penta3", "measles1")`
    - **Comprehensive**: `c("penta1", "anc1", "opd", "delivery", "pnc1")`

??? "Consistency benchmark ranges"

    ```r
    all_consistency_ranges <- list(
      pair_penta    = c(lower = 0.95, upper = Inf),  # Penta1 >= 0.95 * Penta3
      pair_anc      = c(lower = 0.95, upper = Inf),  # ANC1 >= 0.95 * ANC4
      pair_delivery = c(lower = 0.7, upper = 1.3),   # 0.7 <= BCG/Delivery <= 1.3
      pair_malaria  = c(lower = 0.9, upper = 1.1)    # Malaria indicators within 10%
    )
    ```

    The ranges reflect programmatic expectations. For example, ANC1 should always be at least 95% of ANC4 (more women start care than complete four visits). The 5% tolerance accounts for data entry variations. BCG, as a birth dose vaccine, should approximately equal facility deliveries, with 30% tolerance for variation.

### Input/output specifications

#### Input file structure

**Required file**: `hmis_[COUNTRY_ISO3].csv`

**Required columns:**
- `facility_id` (character/integer): Unique identifier for each health facility
- `period_id` (integer): Time period in YYYYMM format (e.g., 202401 for January 2024)
- `indicator_common_id` (character): Standardized indicator names (e.g., "penta1", "anc1", "opd")
- `count` (numeric): Service volume or count for the indicator
- `admin_area_1` through `admin_area_8` (character): Geographic/administrative area columns

**Format example:**

```csv
facility_id,period_id,indicator_common_id,count,admin_area_1,admin_area_2,admin_area_3
FAC001,202401,penta1,45,Country_A,Province_A,District_A
FAC001,202401,anc1,67,Country_A,Province_A,District_A
FAC001,202402,penta1,52,Country_A,Province_A,District_A
```

**Data requirements:**
- At least 12 months of data recommended for robust outlier detection
- Missing values represented as NA or absent rows (both handled)
- Zero counts should be explicit zeros, not missing
- Geographic columns detected automatically (columns 2-8 are optional)

#### Output files

??? "M1_output_outlier_list.csv - Flagged outliers only"

    **Purpose**: Quick reference list of only the observations flagged as outliers

    **Columns:**

    - `facility_id`: Facility identifier
    - `admin_area_[2-8]`: Geographic areas (dynamically included based on data)
    - `indicator_common_id`: Health indicator name
    - `period_id`: Time period (YYYYMM)
    - `count`: Reported service volume

    **Use case**: Data managers reviewing specific outliers for investigation or correction

??? "M1_output_outliers.csv - All records with outlier flags"

    **Purpose**: Complete dataset with outlier flags for all facility-indicator-period combinations

    **Columns:**

    - `facility_id`: Facility identifier
    - `admin_area_[2-8]`: Geographic areas (dynamically included based on data)
    - `period_id`: Time period (YYYYMM)
    - `indicator_common_id`: Health indicator name
    - `outlier_flag`: Final combined outlier flag (0 = not outlier, 1 = outlier)

    **Use case**:

    - Input for Module 2 (Data Quality Adjustments)
    - Statistical analysis of outlier patterns
    - Generating visualizations of outlier prevalence

??? "M1_output_completeness.csv - Completeness status"

    **Purpose**: Completeness flags for all facility-indicator-period combinations, including explicitly created records for missing months

    **Columns:**

    - `facility_id`: Facility identifier
    - `admin_area_[2-8]`: Geographic areas (dynamically included based on data)
    - `indicator_common_id`: Health indicator name
    - `period_id`: Time period (YYYYMM)
    - `completeness_flag`: 0=Incomplete (missing), 1=Complete (reported)

    **Special features**:

    - Contains explicit rows for non-reporting months
    - Inactive periods (6+ months at start/end with completeness_flag=2) excluded from export
    - Full time series for each facility-indicator combination

    **Use case**:

    - Calculating completeness percentages
    - Identifying reporting gaps
    - Trend analysis of reporting behavior

??? "M1_output_consistency_geo.csv - Geographic-level consistency"

    **Purpose**: Consistency flags calculated at the specified geographic level (e.g., district)

    **Columns:**

    - `admin_area_[2-8]`: Geographic identifiers up to specified GEOLEVEL (dynamically included based on data)
    - `period_id`: Time period (YYYYMM)
    - `ratio_type`: Name of consistency pair (e.g., "pair_penta", "pair_anc")
    - `sconsistency`: Binary flag (1=consistent, 0=inconsistent, NA=cannot calculate)

    **Format**: Long format with one row per geographic area-period-ratio type

    **Use case**:

    - Understanding district-level service delivery patterns
    - Identifying geographic areas with consistency issues
    - Creating consistency heatmaps by zone

??? "M1_output_consistency_facility.csv - Facility-level consistency"

    **Purpose**: Geographic consistency results expanded to facility level

    **Columns:**

    - `facility_id`: Facility identifier
    - `admin_area_[2-8]`: Geographic areas (dynamically included based on data)
    - `period_id`: Time period (YYYYMM)
    - `ratio_type`: Name of consistency pair (e.g., "pair_penta", "pair_anc")
    - `sconsistency`: Binary flag (1=consistent, 0=inconsistent, NA=cannot calculate)

    **Format**: Long format with one row per facility-period-ratio type

    **Use case**:

    - Input for DQA scoring
    - Merging consistency flags with facility-level analyses
    - Facility-specific quality reports

??? "M1_output_dqa.csv - final DQA scores"

    **Purpose**: Composite data quality scores by facility and time period

    **Columns:**

    - `facility_id`: Facility identifier
    - `admin_area_[2-8]`: Geographic areas (dynamically included based on data)
    - `period_id`: Time period (YYYYMM)
    - `dqa_mean`: Average of component scores (0-1)
    - `dqa_score`: Binary overall pass/fail (1 = all checks pass; 0 = any check failed)

    **Use case**:

    - Filtering data for subsequent modules (e.g., only use facility-months with dqa_score=1)
    - Tracking data quality trends over time
    - Identifying facilities needing data quality improvement support

### Key functions documentation

??? "load_and_preprocess_data()"

    **Signature**: `load_and_preprocess_data(file_path)`

    **Purpose**: Loads HMIS data and prepares it for analysis by creating necessary date fields and composite indicators

    **Parameters:**

    - `file_path` (character): Path to HMIS CSV file

    **Returns**: List containing:

    - `data`: Preprocessed dataframe with date field added
    - `geo_cols`: Vector of detected geographic column names

    **Process:**
    1. Reads CSV file with HMIS data
    2. Converts `period_id` (YYYYMM format) to Date objects for temporal ordering
    3. Detects all administrative area columns (admin_area_1 through admin_area_8)
    4. Creates composite malaria indicator if component indicators exist:
       - Combines `rdt_positive` + `micro_positive` into `rdt_positive_plus_micro`
       - This composite is used for malaria consistency checks

    **Example:**

    ```r
    inputs <- load_and_preprocess_data("hmis_ISO3.csv")
    data <- inputs$data
    geo_cols <- inputs$geo_cols
    ```

??? "validate_consistency_pairs()"

    **Signature**: `validate_consistency_pairs(consistency_params, data)`

    **Purpose**: Validates that required indicator pairs exist in the dataset before running consistency analysis

    **Parameters:**

    - `consistency_params`: List containing consistency_pairs and consistency_ranges
    - `data`: The HMIS dataset

    **Returns**: Updated consistency_params with only valid pairs (empty list if no valid pairs)

    **Process:**
    1. Checks which indicators are available in the dataset
    2. Removes consistency pairs where one or both indicators are missing
    3. Issues warnings about removed pairs
    4. Returns empty list if no valid pairs remain

    **Example output:**

    ```
    Warning: Skipping pair_delivery - indicator 'delivery' not found in data
    Warning: Skipping pair_malaria - indicator 'rdt_positive_plus_micro' not found in data
    Remaining consistency pairs: pair_penta, pair_anc
    ```

??? "outlier_analysis()"

    **Signature**: `outlier_analysis(data, geo_cols, outlier_params)`

    **Purpose**: Identifies statistical outliers in facility service volumes using dual detection methods

    **Parameters:**

    - `data`: HMIS data with facility_id, indicator_common_id, period_id, count
    - `geo_cols`: Vector of geographic column names
    - `outlier_params`: List containing:
      - `outlier_pc_threshold`: Proportion threshold (default 0.8)
      - `count_threshold`: Minimum count threshold (default 100)

    **Returns**: Dataframe with outlier flags and diagnostic metrics for each facility-indicator-period

    **Calculated fields:**

    - `median_volume`: Median count by facility-indicator
    - `mad_volume`: MAD calculated on values >= median
    - `mad_residual`: Standardized residual (|count - median| / MAD)
    - `outlier_mad`: Binary flag (1 if mad_residual > MADS)
    - `pc`: Proportional contribution to annual total
    - `outlier_pc`: Binary flag (1 if pc > threshold)
    - `outlier_flag`: Final flag (1 if either method flags AND count > minimum threshold)

    **Algorithm steps:**

    **Step 1**: Calculate median volume for each facility-indicator combination

    **Step 2**: Compute MAD using only values equal to or above the median
    - Avoids bias from facilities with many low-volume months
    - Standardizes residuals by dividing (count - median) by MAD
    - Flags outlier_mad = 1 if mad_residual > MADS parameter

    **Step 3**: Calculate proportional contribution
    - For each facility-indicator-year, sum total annual count
    - Calculate pc = count / annual_total
    - Flags outlier_pc = 1 if pc > OUTLIER_PROPORTION_THRESHOLD

    **Step 4**: Combine flags
    - Final outlier_flag = 1 if (outlier_mad = 1 OR outlier_pc = 1) AND count > MINIMUM_COUNT_THRESHOLD
    - The threshold (default 100) ensures only substantial volumes are flagged, avoiding false positives at low-volume facilities

??? "process_completeness()"

    **Signature**: `process_completeness(outlier_data_main)`

    **Purpose**: Main orchestration function that generates complete time series and assigns completeness flags for all indicators

    **Parameters:**

    - `outlier_data_main`: Outlier analysis results (contains all facility-indicator-period combinations with counts)

    **Returns**: Long format dataset with completeness flags for all facility-indicator-period combinations

    **Process:**

    1. Identifies first and last reporting period for each indicator globally
    2. Calls `generate_full_series_per_indicator()` for each indicator
    3. Applies completeness tagging logic (complete/incomplete/inactive)
    4. Merges with geographic metadata
    5. Combines results across all indicators
    6. Removes inactive periods (completeness_flag = 2)

    **Output structure:**

    - Explicit rows for both reported and non-reported periods
    - Completeness flag: 0 (incomplete), 1 (complete), 2 (inactive - removed)
    - Full time series from first to last reporting period per indicator

??? "generate_full_series_per_indicator()"

    **Signature**: `generate_full_series_per_indicator(outlier_data, indicator_id, timeframe)`

    **Purpose**: Creates a complete monthly time series for a specific indicator, filling in gaps where facilities did not report

    **Parameters:**

    - `outlier_data`: data.table with outlier results
    - `indicator_id`: Specific indicator to process (e.g., "penta1")
    - `timeframe`: Data table with first_pid and last_pid for each indicator

    **Returns**: Complete time series with explicit rows for both reported and non-reported periods

    **Process:**

    1. Subsets data to specific indicator
    2. Generates monthly sequence from first to last period_id for that indicator
    3. Creates complete facility-period grid (all facilities × all months) using `CJ()` cross join
    4. Merges with actual reported data
    5. Missing counts indicate non-reporting periods
    6. Applies inactive detection algorithm

    **Inactive detection algorithm:**

    ```r
    # A facility is flagged inactive (offline_flag = 2) if:
    # 1. Missing 6+ consecutive months BEFORE first report, OR
    # 2. Missing 6+ consecutive months AFTER last report

    offline_flag := fifelse(
      (missing_group == 1 & missing_count >= 6 & !first_report_idx) |
      (missing_group == max(missing_group) & missing_count >= 6 & !last_report_idx),
      2L, 0L
    )
    ```

    **Example timeline:**

    ```
    Facility A reporting pattern for indicator "penta1":
    Period:  202001 202002 202003 202004 202005 202006 202007 202008 202009 202010
    Count:   NA     NA     NA     NA     50     30     NA     NA     40     35
    Flag:    2      2      2      2      1      1      0      0      1      1
             [----Inactive----] [---Active period with gaps---]

    Explanation:
    - First 4 months: Inactive (6+ months missing before first report at 202005)
    - 202005-202006: Complete (reported)
    - 202007-202008: Incomplete (gaps in active period)
    - 202009-202010: Complete (reported)
    ```

??? "geo_consistency_analysis()"

    **Signature**: `geo_consistency_analysis(data, geo_cols, geo_level, consistency_params)`

    **Purpose**: Calculates consistency ratios at the geographic level to account for patients seeking services across multiple facilities within a district/ward

    **Parameters:**

    - `data`: Outlier data (with outliers already flagged)
    - `geo_cols`: Vector of geographic column names
    - `geo_level`: Geographic level for aggregation (e.g., "admin_area_3")
    - `consistency_params`: List with consistency_pairs and consistency_ranges

    **Returns**: Long format dataframe with geographic-level consistency results

    **Process:**

    1. Excludes outliers (sets count to NA where outlier_flag = 1)
    2. Aggregates data to specified geographic level by period (sums across facilities)
    3. Reshapes to wide format (one column per indicator)
    4. Calculates ratio for each indicator pair
    5. Flags consistency based on predefined ranges

    **Output columns:**

    - Geographic identifiers (up to specified level)
    - `period_id`: Time period
    - `ratio_type`: Name of the consistency pair (e.g., "pair_penta")
    - `consistency_ratio`: Calculated ratio value
    - `sconsistency`: Binary flag (1 = consistent, 0 = inconsistent, NA = cannot calculate)

    **Example output:**

    ```
    admin_area_2  admin_area_3  period_id  ratio_type    consistency_ratio  sconsistency
    District_A    Ward_1        202401     pair_penta    1.05               1
    District_A    Ward_1        202401     pair_anc      0.88               0
    District_A    Ward_2        202401     pair_penta    0.97               1
    ```

    **Rationale**: Measuring consistency at the geographic level accounts for patient movement between facilities and provides a more accurate picture of service utilization patterns across a community.

??? "expand_geo_consistency_to_facilities()"

    **Signature**: `expand_geo_consistency_to_facilities(facility_metadata, geo_consistency_results, geo_level)`

    **Purpose**: Assigns geographic-level consistency results to individual facilities

    **Parameters:**

    - `facility_metadata`: Facility list with geographic assignments
    - `geo_consistency_results`: Output from geo_consistency_analysis()
    - `geo_level`: Geographic level used in consistency analysis

    **Returns**: Facility-level dataset with consistency flags

    **Process:**

    - Extracts facility list with their geographic assignments
    - Performs left join to replicate geo-level consistency scores to all facilities in that area
    - Uses many-to-many relationship to handle multiple periods and ratio types

    **Rationale**: Since consistency is measured at the geographic level (accounting for patient movement between facilities), all facilities within the same district/ward receive the same consistency scores.

??? "dqa_with_consistency()"

    **Signature**: `dqa_with_consistency(completeness_data, consistency_data, outlier_data, geo_cols, dqa_rules)`

    **Purpose**: Calculates comprehensive DQA scores including consistency checks when consistency pairs are available

    **Parameters:**

    - `completeness_data`: Output from process_completeness()
    - `consistency_data`: Wide-format facility consistency results
    - `outlier_data`: Output from outlier_analysis()
    - `geo_cols`: Vector of geographic column names
    - `dqa_rules`: List specifying required values for each dimension

    **DQA Rules Configuration:**

    ```r
    dqa_rules <- list(
      completeness = 1,   # Must be complete (flag = 1)
      outlier_flag = 0,   # Must NOT be an outlier (flag = 0)
      sconsistency = 1    # Must be consistent (flag = 1)
    )
    ```

    **Scoring algorithm:**

    **1. Completeness-Outlier Score** (per facility-period):
    - Each DQA indicator scores 0-2 points (1 for completeness + 1 for no outlier)
    - Maximum possible = 2 × number of DQA indicators
    - Score = Total Points / Maximum Points

    **2. Consistency Score** (per facility-period):
    - Only counts pairs where both indicators exist (NA pairs excluded from denominator)
    - Score = Number of passing pairs / Number of available pairs
    - If no pairs available, score = 0

    **3. Mean DQA Score:**
    - Average of completeness-outlier score and consistency score
    - Formula: `(completeness_outlier_score + consistency_score) / 2`

    **4. Binary DQA Score:**
    - 1 if all checks pass (complete, no outliers, consistent)
    - 0 if any check fails

    **Handling missing indicators:**
    The function intelligently handles cases where some consistency indicators are missing:
    - NA values in consistency pairs are NOT replaced with 0
    - Only available pairs contribute to the denominator
    - This prevents penalizing facilities for indicators they do not provide

    **Example calculation:**

    ```
    Facility X in period 202401:
    - DQA Indicators: penta1, anc1, opd (3 indicators)
    - Completeness: All 3 complete → 3 points
    - Outliers: None → 3 points
    - Total: 6/6 → completeness_outlier_score = 1.0

    Consistency Pairs:
    - pair_penta (penta1/penta3): Pass (1)
    - pair_anc (anc1/anc4): Fail (0)
    - pair_delivery: NA (bcg not a DQA indicator)

    Consistency calculation:
    - Available pairs: 2 (penta, anc)
    - Passing pairs: 1 (penta)
    - consistency_score = 1/2 = 0.5

    Final scores:
    - dqa_mean = (1.0 + 0.5) / 2 = 0.75
    - dqa_score = 0 (not all pairs passed)
    ```

??? "dqa_without_consistency()"

    **Signature**: `dqa_without_consistency(completeness_data, outlier_data, geo_cols, dqa_rules)`

    **Purpose**: Calculates DQA scores using only completeness and outlier checks when consistency data is unavailable or no valid consistency pairs exist

    **When used:**

    - No consistency pairs defined in configuration
    - All consistency pairs have missing indicators
    - Dataset does not contain paired indicators

    **Scoring:**

    - Uses only completeness and outlier components
    - `dqa_mean` = `completeness_outlier_score`
    - `dqa_score` = 1 if all completeness and outlier checks pass, 0 otherwise

    **Output structure:**

    ```r
    dqa_results <- data.frame(
      facility_id,
      admin_area_X,              # Dynamic geographic columns
      period_id,
      completeness_outlier_score, # Range: 0-1
      dqa_mean,                   # Range: 0-1 (equals completeness_outlier_score)
      dqa_score                   # Binary: 0 or 1
    )
    ```

### Statistical methods & algorithms

??? "Median absolute deviation (MAD) calculation"

    The MAD is a robust measure of variability that is less sensitive to outliers than standard deviation.

    **Standard MAD Algorithm:**
    1. Compute the median of the dataset
    2. Calculate absolute deviations: |value - median| for each data point
    3. Find the median of these absolute deviations

    **FASTR Modification:**
    The module calculates MAD using only values at or above the median, making it more sensitive to high outliers while avoiding bias from facilities with many low-volume months.

    **Outlier degree calculation:**

    $$
    \text{MAD Residual} = \frac{|\text{volume} - \text{median volume}|}{\text{MAD}}
    $$

    **Outlier classification:**
    - If MAD Residual > 10 (configurable via `MADS` parameter), the value is flagged as a MAD-based outlier (`outlier_mad = 1`)
    - The final `outlier_flag` also requires count > 100

    **Example:**

    ```
    Facility ABC, Indicator: penta1
    Monthly counts: 20, 25, 22, 28, 24, 26, 150, 23, 27, 25, 21, 24

    Step 1: Calculate median = 24.5
    Step 2: Values >= median: 25, 28, 24.5, 26, 150, 27, 25, 24.5
    Step 3: Absolute deviations from median: 0.5, 3.5, 0, 1.5, 125.5, 2.5, 0.5, 0
    Step 4: MAD = median(0, 0, 0.5, 0.5, 1.5, 2.5, 3.5, 125.5) = 1.0
    Step 5: For count=150: MAD residual = |150 - 24.5| / 1.0 = 125.5
    Step 6: 125.5 > 10 AND 150 > 100, therefore outlier_flag = 1
    ```

??? "Proportional outlier detection"

    This method identifies months where a single observation represents an unusually large proportion of the annual total for a facility-indicator combination.

    **Algorithm:**
    1. For each facility-indicator-year, sum the total annual count
    2. Calculate the proportion: `pc = monthly_count / annual_total`
    3. Flag as proportional outlier (`outlier_pc = 1`) if `pc > OUTLIER_PROPORTION_THRESHOLD` (default 0.8)
    4. The final `outlier_flag` also requires count > 100

    **Rationale:**
    A facility reporting 80% of its annual volume in a single month likely indicates a data entry error (e.g., cumulative reporting instead of monthly, extra digit entered).

    **Example:**

    ```
    Facility XYZ, Indicator: anc1, Year: 2024
    Monthly counts: 15, 18, 12, 16, 890, 14, 17, 13, 16, 15, 14, 12
    Annual total: 1052

    For May (count=890):
    pc = 890 / 1052 = 0.846
    0.846 > 0.8 AND 890 > 100, therefore outlier_flag = 1
    ```

??? "Consistency ratio benchmarks"

    The module applies programmatically defined benchmarks for indicator pairs:

    **ANC Consistency:**

    $$
    \text{ANC Consistency} =
    \begin{cases}
    1, & \frac{\text{ANC1 Volume}}{\text{ANC4 Volume}} \geq 0.95 \\
    0, & \text{otherwise}
    \end{cases}
    $$

    **Interpretation**: More women should start ANC (ANC1) than complete four visits (ANC4). The ratio is expected to be ≥ 0.95, allowing up to 5% tolerance for data variations.

    **Penta consistency:**

    $$
    \text{Penta Consistency} =
    \begin{cases}
    1, & \frac{\text{Penta1 Volume}}{\text{Penta3 Volume}} \geq 0.95 \\
    0, & \text{otherwise}
    \end{cases}
    $$

    **Interpretation**: More children should receive Penta1 than complete the three-dose series (Penta3).

    **BCG/Delivery Consistency:**

    $$
    \text{BCG/Delivery Consistency} =
    \begin{cases}
    1, & 0.7 \leq \frac{\text{BCG Volume}}{\text{Delivery Volume}} \leq 1.3 \\
    0, & \text{otherwise}
    \end{cases}
    $$

    **Interpretation**: BCG is a birth dose vaccine, so BCG vaccinations should approximately equal facility deliveries. The wider range (±30%) accounts for infants born elsewhere receiving BCG at the facility or facility-born infants receiving BCG elsewhere.

    **Implementation detail:**
    Consistency is assessed at the district/ward level (specified by `GEOLEVEL`) to account for patients visiting multiple facilities within their local area for different services.

??? "Completeness calculation"

    For a given indicator in a given month:

    $$
    \text{Completeness} = \frac{\text{Number of reporting facilities}}{\text{Number of expected facilities}} \times 100
    $$

    **Expected facilities definition:**
    A facility is expected to report for an indicator if it has ever reported for that indicator within the analysis timeframe AND is not flagged as inactive.

    **Inactive facility definition:**
    A facility is flagged as inactive for periods where it did not report for six or more consecutive months before its first report or after its last report.

    **Example:**

    ```
    District has 20 facilities that have ever reported penta1 data in 2024
    In March 2024:
    - 18 facilities submitted penta1 data
    - 2 facilities did not submit (but are not inactive)

    Completeness = 18 / 20 × 100 = 90%
    ```

    **Important note**: A high level of completeness does not necessarily indicate that the HMIS is representative of all service delivery in the country, as some services may not be delivered in facilities or some facilities may not report. For countries where DHIS2 does not store zeros, indicator completeness may be underestimated if there are many low-volume facilities.

??? "DQA composite score calculation"

    The DQA score combines three quality dimensions for a defined set of core indicators.

    **Component scores:**

    **1. Completeness-Outlier Score:**

    $$
    \text{Completeness-Outlier Score} = \frac{\sum (\text{completeness pass} + \text{outlier pass})}{2 \times \text{number of DQA indicators}}
    $$

    **2. Consistency Score:**

    $$
    \text{Consistency Score} = \frac{\text{Number of pairs passing benchmarks}}{\text{Number of available pairs}}
    $$

    **3. Mean DQA Score:**

    $$
    \text{DQA Mean} = \frac{\text{Completeness-Outlier Score} + \text{Consistency Score}}{2}
    $$

    **4. Binary DQA Score:**

    $$
    \text{DQA Score} =
    \begin{cases}
    1, & \text{if all checks pass (complete, no outliers, consistent)} \\
    0, & \text{if any check fails}
    \end{cases}
    $$

    **Passing criteria for binary score:**
    - ALL DQA indicators must be complete (completeness_flag = 1)
    - ALL DQA indicators must be free of outliers (outlier_flag = 0)
    - ALL available consistency pairs must pass benchmarks (sconsistency = 1)

    **Example calculation:**

    ```
    Facility 123, Period 202403
    DQA Indicators: penta1, anc1, opd

    Completeness: penta1=1, anc1=1, opd=1 → 3 points
    Outliers: penta1=0, anc1=0, opd=0 → 3 points
    Completeness-Outlier Score = 6 / (2×3) = 1.0

    Consistency Pairs:
    - pair_penta: 1 (pass)
    - pair_anc: 1 (pass)
    Consistency Score = 2 / 2 = 1.0

    DQA Mean = (1.0 + 1.0) / 2 = 1.0
    DQA Score = 1 (all checks passed)
    ```

### Code examples

??? "Example 1: Running the module with default settings"

    ```r
    # Set working directory
    setwd("/path/to/module/directory")

    # Load required libraries
    library(zoo)
    library(stringr)
    library(dplyr)
    library(tidyr)
    library(data.table)

    # The module will automatically:
    # 1. Load hmis_ISO3.csv
    # 2. Run all analyses with default parameters
    # 3. Generate output CSV files in the working directory

    source("01_module_data_quality_assessment.R")
    ```

??? "Example 2: Adjusting outlier detection sensitivity"

    ```r
    # Make outlier detection more sensitive (lower thresholds)
    OUTLIER_PROPORTION_THRESHOLD <- 0.6   # Flag if >60% of annual volume (was 80%)
    MINIMUM_COUNT_THRESHOLD <- 50         # Consider counts >=50 (was 100)
    MADS <- 8                             # Flag at 8 MADs (was 10)

    # Run the module
    source("01_module_data_quality_assessment.R")
    ```

    **Use case**: Countries with generally low service volumes where the default thresholds are too conservative.

??? "Example 3: Different geographic level for consistency"

    ```r
    # Use district level (admin_area_2) instead of sub-district (admin_area_3)
    GEOLEVEL <- "admin_area_2"

    # This affects consistency analysis aggregation level
    source("01_module_data_quality_assessment.R")
    ```

    **Use case**: Sub-district level has sparse data or too few facilities per area, making district-level aggregation more stable.

??? "Example 4: custom DQA indicators"

    ```r
    # Focus DQA on maternal health indicators only
    DQA_INDICATORS <- c("anc1", "anc4", "delivery", "pnc1")

    # Only evaluate anc consistency pair
    CONSISTENCY_PAIRS_USED <- c("anc")

    source("01_module_data_quality_assessment.R")
    ```

    **Use case**: Specialized analysis focusing on a specific service area.

??? "Example 5: Running for different country"

    ```r
    # Configure for your country
    COUNTRY_ISO3 <- "ISO3"  # Replace with your country code
    PROJECT_DATA_HMIS <- "hmis_ISO3.csv"
    GEOLEVEL <- "admin_area_3"

    # Adjust for country-specific indicators if needed
    DQA_INDICATORS <- c("penta1", "anc1", "opd", "fp_new")

    source("01_module_data_quality_assessment.R")
    ```

??? "Example 6: Programmatic use of outputs"

    ```r
    # After running the module, work with outputs

    # Load DQA results
    dqa_results <- read.csv("M1_output_dqa.csv")

    # Filter to high-quality facility-months only
    high_quality <- dqa_results %>%
      filter(dqa_score == 1)

    # Calculate percentage of facility-months passing DQA by district
    quality_by_district <- dqa_results %>%
      group_by(admin_area_2, period_id) %>%
      summarize(
        total_facility_months = n(),
        passing_quality = sum(dqa_score == 1),
        pct_passing = 100 * passing_quality / total_facility_months
      )

    # Identify facilities with consistently poor quality (never passing)
    poor_quality_facilities <- dqa_results %>%
      group_by(facility_id) %>%
      summarize(
        months_analyzed = n(),
        months_passed = sum(dqa_score == 1),
        pct_passed = 100 * months_passed / months_analyzed
      ) %>%
      filter(pct_passed == 0)
    ```

### Troubleshooting

??? "Problem: Module skips consistency analysis"

    **Symptoms:**
    - Console message: "No valid consistency pairs found"
    - M1_output_consistency_geo.csv has only headers
    - DQA scores calculated without consistency component

    **Diagnosis:**
    Check that both indicators in each pair exist in your dataset:

    ```r
    # Load your data
    data <- read.csv("hmis_[COUNTRY].csv")

    # Check available indicators
    print(unique(data$indicator_common_id))

    # Compare with required pairs
    # For pair_penta: need "penta1" and "penta3"
    # For pair_anc: need "anc1" and "anc4"
    # For pair_delivery: need "bcg" and "delivery" (or "sba")
    ```

    **Solutions:**
    1. Adjust `CONSISTENCY_PAIRS_USED` to only include pairs with available indicators
    2. Modify indicator names in your data to match expected names
    3. Accept that DQA will be calculated without consistency component

??? "Problem: All facilities flagged as outliers"

    **Symptoms:**
    - Very high percentage of outlier_flag = 1 in M1_output_outliers.csv
    - Most observations in outlier_list.csv

    **Diagnosis:**
    Your thresholds may be too sensitive for your data context.

    **Solutions:**

    1. Increase MAD threshold:

    ```r
    MADS <- 15  # Increase from default 10
    ```

    2. Increase proportion threshold:

    ```r
    OUTLIER_PROPORTION_THRESHOLD <- 0.9  # Increase from 0.8
    ```

    3. Increase minimum count threshold (focus on larger facilities):

    ```r
    MINIMUM_COUNT_THRESHOLD <- 200  # Increase from 100
    ```

    4. Review the data: Check if there are genuine quality issues requiring data cleaning rather than parameter adjustment

??? "Problem: no DQA results generated"

    **Symptoms:**
    - M1_output_dqa.csv is empty or has only headers
    - Console message: "Skipping DQA analysis - none of the required indicators found"

    **Diagnosis:**
    None of the indicators specified in `DQA_INDICATORS` exist in your dataset.

    **Solution:**
    Check which DQA indicators are missing:

    ```r
    # Load data
    data <- read.csv("hmis_[COUNTRY].csv")

    # Check which DQA indicators are missing
    available_indicators <- unique(data$indicator_common_id)
    missing_indicators <- setdiff(DQA_INDICATORS, available_indicators)
    print(paste("Missing DQA indicators:", paste(missing_indicators, collapse=", ")))

    # Available DQA indicators
    available_dqa <- intersect(DQA_INDICATORS, available_indicators)
    print(paste("Available DQA indicators:", paste(available_dqa, collapse=", ")))
    ```

    Then update `DQA_INDICATORS` to include only available indicators:

    ```r
    DQA_INDICATORS <- c("penta1", "anc1")  # Only use what's available
    ```

??? "Problem: Consistency ratios seem incorrect"

    **Symptoms:**
    - All consistency flags are 0 (inconsistent)
    - Consistency ratios are unexpectedly high or low

    **Diagnosis:**
    The geographic aggregation level may be inappropriate for your data.

    **Investigation:**

    ```r
    # Load geographic consistency results
    geo_cons <- read.csv("M1_output_consistency_geo.csv")

    # Check distribution of consistency ratios
    summary(geo_cons$consistency_ratio)

    # Check sample sizes at geographic level
    outliers <- read.csv("M1_output_outliers.csv")
    geo_summary <- outliers %>%
      group_by(admin_area_3, period_id) %>%
      summarize(
        n_facilities = n_distinct(facility_id),
        total_volume = sum(count, na.rm = TRUE)
      )
    summary(geo_summary$n_facilities)
    ```

    **Solutions:**

    1. If geographic areas have very few facilities (1-2), use higher level:

    ```r
    GEOLEVEL <- "admin_area_2"  # Use district instead of sub-district
    ```

    2. If ratios are generally below 0.95 for ANC/Penta pairs, this may indicate genuine programmatic issues (high dropout) rather than data quality problems

    3. Review the consistency benchmark ranges - they may need adjustment for your context:

    ```r
    # Example: Allow higher dropout (lower ratio) for Penta
    all_consistency_ranges$pair_penta <- c(lower = 0.85, upper = Inf)
    ```

??? "Problem: Completeness percentages seem low"

    **Symptoms:**
    - High proportion of completeness_flag = 0 in M1_output_completeness.csv

    **Diagnosis:**
    This could be legitimate (poor reporting) or an artifact of how your DHIS2 stores zero values.

    **Investigation:**

    ```r
    # Load completeness data
    completeness <- read.csv("M1_output_completeness.csv")

    # Check pattern: Are there explicit zeros or just missing values?
    outliers <- read.csv("M1_output_outliers.csv")
    table(is.na(outliers$count), outliers$count == 0)

    # Check completeness by indicator
    comp_by_indicator <- completeness %>%
      group_by(indicator_common_id) %>%
      summarize(
        pct_complete = 100 * mean(completeness_flag == 1),
        pct_incomplete = 100 * mean(completeness_flag == 0)
      )
    print(comp_by_indicator)
    ```

    **Considerations:**
    1. If your DHIS2 does not store zeros, low-volume facilities may appear incomplete when they legitimately had no services to report
    2. Completeness percentages should be interpreted in context - 70% completeness may be acceptable depending on the health system
    3. Use the completeness_flag in subsequent modules to weight estimates appropriately

??? "Problem: Error reading input file"

    **Symptoms:**
    - Error: "Cannot open file 'hmis_[COUNTRY].csv'"
    - Module crashes during data loading

    **Solutions:**

    1. Check file path and working directory:

    ```r
    getwd()  # Verify working directory
    list.files()  # Check if HMIS file is present
    ```

    2. Verify file name matches `PROJECT_DATA_HMIS` parameter

    3. Check file format (CSV, proper encoding, comma-separated)

    4. Ensure required columns exist:

    ```r
    # After loading
    names(data)  # Should include: facility_id, period_id, indicator_common_id, count
    ```

### Usage notes

??? "Data type handling"

    **period_id Flexibility:**
    The module accepts `period_id` in multiple formats:
    - Integer: `202401`
    - String: `"202401"`
    - Numeric: `202401.0`

    All formats are internally converted to Date objects for correct chronological ordering:

    ```r
    # Internal conversion
    as.Date(sprintf("%04d-%02d-01", year, month))
    ```

    This ensures proper temporal ordering even with gaps in reporting periods.

    **Count values:**
    - Numeric values required (integers or decimals)
    - Zero counts should be explicit `0`, not `NA`
    - Missing counts represented as `NA` or absent rows

    **Geographic columns:**
    - Character type recommended
    - Can contain spaces and special characters
    - Case-sensitive in some operations

??? "Missing value strategy"

    The module uses context-specific approaches to missing values:

    **Outlier analysis:**
    - NA values excluded from median/MAD calculations
    - Only non-NA values contribute to statistics
    - Prevents bias from sparse reporting

    **Completeness:**
    - Explicit NA in count column indicates non-reporting
    - Assigned completeness_flag = 0 (incomplete)
    - Distinguished from inactive periods (flag = 2, removed)

    **Consistency:**
    - NA ratios (from division by zero) kept as NA, not converted to 0
    - NA pairs excluded from consistency scoring denominator
    - Prevents penalizing facilities for unavailable indicators

    **DQA Scoring:**
    - NA consistency pairs excluded from denominator
    - Only available pairs affect consistency score
    - Allows partial scoring when some indicators missing

??? "Memory considerations"

    For large datasets (>1 million rows), the module implements several optimizations:

    **data.table Usage:**
    - Completeness processing uses `data.table` for in-place operations
    - Significantly faster and more memory-efficient than `dplyr` for large data

    **Filtering strategy:**
    - Filters to relevant indicators before expensive operations
    - Reduces memory footprint during calculations

    **Object management:**
    - Removes intermediate objects after use
    - Prevents memory accumulation during sequential processing

    **Recommendations for Large Datasets:**
    - Allocate at least 8GB RAM for countries with >1000 facilities
    - Consider processing by year if multi-year datasets cause memory issues
    - Monitor memory usage: `pryr::mem_used()` at various stages

??? "Performance optimization opportunities"

    **Current implementation:**
    The completeness analysis processes indicators sequentially using `lapply()`.

    **Potential enhancement:**
    For datasets with many indicators, parallelization could improve performance:

    ```r
    # Future enhancement (not in current code)
    library(parallel)

    # Detect available cores
    n_cores <- detectCores() - 1

    # Parallel processing of indicators
    completeness_list <- mclapply(
      unique(outlier_data_main$indicator_common_id),
      function(ind) generate_full_series_per_indicator(
        outlier_data = outlier_data_main,
        indicator_id = ind,
        timeframe = indicator_timeframe
      ),
      mc.cores = n_cores
    )

    # Combine results
    completeness_data <- rbindlist(completeness_list)
    ```

    **Expected speedup:**
    - 3-4x faster with 4 cores on datasets with 10+ indicators
    - Most beneficial for countries with many indicators and long time series

??? "Dynamic indicator selection"

    The module intelligently adapts to available data:

    **Delivery indicator selection:**

    ```r
    # Automatically chooses between "delivery" and "sba" for BCG consistency pair
    if ("delivery" %in% available_indicators) {
      PAIR_DELIVERY_B <- "delivery"
    } else if ("sba" %in% available_indicators) {
      PAIR_DELIVERY_B <- "sba"  # Skilled birth attendant
    } else {
      PAIR_DELIVERY_B <- "delivery"  # Default fallback
    }
    ```

    **DQA Indicator Validation:**

    ```r
    # Only use DQA indicators that exist in the dataset
    dqa_indicators_to_use <- intersect(DQA_INDICATORS, unique(data$indicator_common_id))

    # If none found, skip DQA analysis with informative message
    if (length(dqa_indicators_to_use) == 0) {
      print("Skipping DQA analysis - none of the required indicators found")
    }
    ```

    **Consistency pair validation:**
    The module checks each consistency pair and removes those with missing indicators, providing clear warnings about which pairs were skipped.

??? "Error handling and fallbacks"

    The module includes robust error handling:

    **Missing consistency pairs:**
    - If no valid pairs exist, skips consistency analysis
    - Uses `dqa_without_consistency()` for scoring
    - Outputs dummy files with proper headers

    **Missing geographic levels:**
    - Falls back to lowest available admin level if specified `GEOLEVEL` not found
    - Issues warning about the fallback

    **Empty results:**
    - Creates CSV files with proper headers even when no data
    - Ensures downstream processes do not break

    **Missing indicators:**
    - Validates all indicator requirements before analysis
    - Warns about removed pairs
    - Continues with available indicators

??? "Interpretation guidelines"

    **Outlier flags:**
    - outlier_flag = 1 suggests potential data quality issues, but require investigation
    - Not all flagged outliers are errors (genuine service campaigns can trigger flags)
    - Use mad_residual and pc values to prioritize review

    **Completeness:**
    - Completeness % varies by health system context
    - 80-90%+ is generally good, but depends on country
    - Trend over time more informative than absolute percentage
    - Low completeness for specific indicators may reflect genuine service gaps

    **Consistency:**
    - sconsistency = 0 may indicate data quality issues OR programmatic performance issues (e.g., high dropout)
    - Requires programmatic knowledge to interpret
    - Geographic patterns can help distinguish systematic issues from random errors

    **DQA Scores:**
    - dqa_score = 1 indicates data passed all checks, suitable for unadjusted use
    - dqa_score = 0 requires further investigation
    - dqa_mean provides nuanced view (0.75 = mostly good, 0.25 = mostly poor)

### Data quality metrics summary

| Metric                        | Type        | Range      | Interpretation                                                            |
|-------------------------------|-------------|------------|---------------------------------------------------------------------------|
| outlier_flag                  | Binary      | 0 or 1     | 1 = Outlier detected by either method (MAD or proportional) AND count > 100 |
| outlier_mad                   | Binary      | 0 or 1     | 1 = Statistical outlier (MAD-based)                                       |
| outlier_pc                    | Binary      | 0 or 1     | 1 = Proportional outlier (>80% of annual volume)                          |
| mad_residual                  | Continuous  | 0 to ∞     | Standardized deviation from median (higher = more extreme)                |
| pc                            | Continuous  | 0 to 1     | Proportion of annual volume (closer to 1 = more concentrated)             |
| completeness_flag             | Categorical | 0, 1, 2    | 0=Incomplete (missing), 1=Complete (reported), 2=Inactive (removed)      |
| sconsistency                  | Binary      | 0, 1, NA   | 1=Consistent (passes benchmark), 0=Inconsistent, NA=Cannot calculate     |
| consistency_ratio             | Continuous  | 0 to ∞     | Ratio of paired indicators (interpretation depends on pair)               |
| completeness_outlier_score    | Continuous  | 0 to 1     | Proportion of DQA indicators passing completeness & outlier checks        |
| consistency_score             | Continuous  | 0 to 1     | Proportion of consistency pairs passing benchmarks                        |
| dqa_mean                      | Continuous  | 0 to 1     | Average of component scores (overall quality measure)                     |
| dqa_score                     | Binary      | 0 or 1     | 1 = All checks pass (complete, no outliers, consistent); 0 = any check failed |


### Execution workflow

The module follows this sequence:

```
1. DATA LOADING & PREPROCESSING
   ├─ Load HMIS CSV file
   ├─ Convert period_id to dates
   ├─ Detect geographic columns
   └─ Create composite malaria indicator (if applicable)

2. CONFIGURATION & VALIDATION
   ├─ Detect available indicators
   ├─ Dynamically select delivery indicator (delivery vs sba)
   ├─ Build consistency pairs based on available indicators
   ├─ Validate consistency pairs
   └─ Filter DQA indicators to available ones

3. OUTLIER ANALYSIS
   ├─ Calculate median and MAD by facility-indicator
   ├─ Flag MAD-based outliers (>10 MADs from median)
   ├─ Flag proportion-based outliers (>80% of annual volume)
   └─ Combine flags (either method + count > 100)

4. COMPLETENESS ANALYSIS
   ├─ Identify reporting timeframe per indicator
   ├─ Generate full time series (all facilities × all months)
   ├─ Tag reporting status (complete/incomplete/inactive)
   └─ Remove inactive periods (6+ months before first/after last report)

5. CONSISTENCY ANALYSIS (if applicable)
   ├─ Exclude outliers from data
   ├─ Aggregate to geographic level (e.g., district)
   ├─ Calculate ratios for indicator pairs
   ├─ Flag consistency based on predefined ranges
   ├─ Expand geo-level results to facilities
   └─ Pivot to wide format (one column per pair)

6. DQA SCORING
   ├─ Filter to DQA indicators only
   ├─ Merge completeness, outlier, and consistency results
   ├─ Calculate component scores:
   │  ├─ Completeness-outlier score (0-1)
   │  └─ Consistency score (0-1, if applicable)
   ├─ Calculate mean DQA score
   └─ Assign binary DQA pass/fail flag

7. EXPORT RESULTS
   ├─ M1_output_outlier_list.csv (outliers only)
   ├─ M1_output_outliers.csv (all records with flags)
   ├─ M1_output_completeness.csv (completeness flags)
   ├─ M1_output_consistency_geo.csv (geo-level consistency)
   ├─ M1_output_consistency_facility.csv (facility-level consistency)
   └─ M1_output_dqa.csv (final DQA scores)
```

---

**Last updated**: 26-01-2026
**Contact**: FASTR Project Team

---

<!--
////////////////////////////////////////////////////////////////////
//                                                                //
//   _____ _     _____ ____  _____    ____ ___  _   _ _____ _   _ //
//  / ____| |   |_   _|  _ \| ____|  / ___/ _ \| \ | |_   _| \ | |//
//  | (___ | |     | | | | | | |__   | |  | | | |  \| | | | |  \| |//
//   \___ \| |     | | | | | |  __|  | |  | | | | . ` | | | | . ` |//
//   ____) | |___ _| |_| |_| | |____ | |__| |_| | |\  | | | | |\  |//
//  |_____/|_____|_____|____/|______| \____\___/|_| \_| |_| |_| \_|//
//                                                                //
//            Edit workshop slides below this line                //
//                                                                //
////////////////////////////////////////////////////////////////////
-->

<!-- SLIDE:m4_0 -->
## FASTR analytical pipeline

The FASTR analysis follows a sequential workflow:

1. **Assess data quality** - Identify issues with completeness, outliers, and consistency
2. **Adjust for quality issues** - Apply corrections to improve data reliability
3. **Analyze adjusted data** - Generate service utilization and coverage estimates

![Analytical Pipeline h:280](resources/diagrams/analytical_pipeline.svg)

---

## FASTR approach to data quality

FASTR takes a multi-pronged approach, based on the belief that **data quality should not be a barrier to data use**.

- Conduct granular, facility-level data quality assessments
- Focus on high-volume indicators that produce more stable estimates
- Emphasize variation over time and space rather than point estimates
- Interpret results collaboratively with in-country decision-makers

**Using data and providing feedback is viewed as the first step toward improving data quality.**

<!--
PRESENTER NOTES:
- This is the condensed overview - hit the key points quickly
- Emphasize the philosophy: don't let perfect be the enemy of good
- The pipeline is sequential: DQA → Adjustment → Analysis
- Using data creates accountability and motivation to improve quality
-->
<!-- /SLIDE -->

<!-- SLIDE:m4_1 -->
## FASTR takes a multi-pronged approach to data quality, with the belief that data quality should not be a barrier to data use – with the right feedback loops, use of data can contribute to improved quality

- We do granular data quality assessments and adjustments based on facility-level data leveraging HMIS access with an API

- We use only high-volume indicators, because the most-used services provide more stable estimates

- We focus on variations across time and space rather than specific point estimates and discuss the interpretation and relevance for decision-making with in-country decision-makers

- We believe that using the data and providing feedback is the first step to improving the data

We will discuss each of these areas over the next sessions.

---
## Rationale for data quality assessment

**Challenge:** Routine health facility data may contain quality limitations:
- Reported values may fall outside plausible ranges
- Reporting gaps affect data completeness
- Inconsistencies exist between related indicators

&nbsp;

**Implications:** Data quality limitations affect decision-making
- Inaccurate assessments of service delivery trends
- Misidentification of areas requiring intervention
- Suboptimal resource allocation

---

## Assessing and adjusting for data quality

Quality assessments identify the highest priority issues and necessary analytical adjustments, so quality issues do not become a barrier to data analysis and use.

&nbsp;

**Objective 1: Enable analytical adjustment**

Systematic data quality assessment supports the application of targeted adjustments, enhancing the utility of HMIS data for evidence-based decision-making.

&nbsp;

**Objective 2: Monitor data quality trends**

Data quality assessment enables ongoing monitoring to:
- Inform indicator selection based on quality profiles across the HMIS
- Guide targeted data quality interventions and supportive supervision in areas with weaker data quality
- Evaluate the effectiveness of data quality improvement initiatives over time

---
## Measures of data quality

![Measures of data quality](resources/diagrams/measures_data_quality.svg)

<!--
PRESENTER NOTES:
- Indicator completeness – completeness
- Outliers – consistency
- Consistency between related indicators – consistency
- Accuracy – requires additional data collection
- Timeliness – important for routine data quality improvements but not relevant for FASTR analysis at a single point in time
-->
<!-- /SLIDE -->

<!-- SLIDE:m4_1a -->
<style scoped>
table { font-size: 0.48em; }
td, th { padding: 10px 12px !important; line-height: 1.4; }
th { background: #0d7377; color: white; }
td { vertical-align: top; }
</style>

## Measures of data quality - detailed

| Data quality domain | What does it measure? | How is it assessed? |
|---------------------|----------------------|---------------------|
| **Completeness** | Are all data present? Is there sufficient information available to make decisions about the health of the population and to target resources to improve health-system coverage, efficiency and quality? | • Assessed by measuring whether all units that are supposed to report actually do (reporting completeness)<br>• Assessed by measuring the completeness of indicator data (no missing values); this is different from overall reporting completeness in that it looks at completeness of specific data elements and not only at the receipt of the monthly reporting form (indicator completeness) |
| **Timeliness** | Are data regularly submitted on time? | • Assessed by measuring whether the units that submitted reports did so before a set deadline (timeliness) |
| **Consistency** | Are data plausible in view of what has been previously reported? | • Trends are evaluated to determine whether reported values are extreme relative to other values reported during the year or across several years (presence of outliers)<br>• Assess trends in program indicators to determine whether reported values are extreme in relation to other values that are reported during the year or over several years (consistency over time)<br>• Assess program indicators which have a predictable relationship to determine whether the expected relationship exists between those 2 indicators (consistency between related indicators)<br>• Assess the level of agreement between two sources of data measuring the same health indicator (external comparison with other data sources)<br>• Determine the adequacy of the population data used in evaluating the performance of health indicators (consistency of population data) |
| **Accuracy** | Do data faithfully reflect the actual level of service delivery conducted in the health facility? | • Assess the accuracy for selected indicators through the review of source documents in health facilities and comparison to monthly reports and HMIS values (data verification factor) |
<!-- /SLIDE -->

<!-- SLIDE:m4_1b -->
## How does the FASTR data quality analysis differ from the DQA analysis done in DHIS2?

**Purpose of data quality assessment**

- **DHIS2:** focuses on data quality assessment to routinely strengthen data quality over time
- **FASTR:** focuses on assessing data quality to inform an analysis which answers a pressing policy question

**Data quality adjustment**

- **DHIS2:** focus is on identifying data quality issues and working with facilities to improve reporting practices
- **FASTR:** focus on applying analytical adjustment techniques to account for data quality issues in the analysis; goal is to generate the most robust estimates despite data quality challenges

**Selection of indicators, measures, and thresholds** – FASTR focuses on DQA elements most relevant for analysis

- The purpose of the data quality assessment guides the selection of indicators, measures, and thresholds
- DHIS2 allows configuration of a DQA dashboard for any selection of indicators in DHIS2; FASTR selects indicators that will be used in a specific analysis
- DHIS2 DQA includes timeliness as a measure of data quality. FASTR does not include timeliness. Timeliness is an important consideration for strengthening routine reporting but it less important to do an analysis with the data we have available today
- DHIS2 DQA includes reporting completeness (e.g. was a report submitted) and indicator completeness (e.g. was a value recorded for an individual data element) while FASTR focuses only on indicator completeness
<!-- /SLIDE -->

<!-- SLIDE:m4_1c -->
## How does the FASTR data quality analysis differ from the DQA analysis done in DHIS2?

**Selection of indicators, measures, and thresholds continued**

The purpose of the data quality assessment guides the selection of indicators, measures, and thresholds.

- DHIS2 DQA assesses four measures of internal consistency: presence of outliers, consistency over time, consistency between related indicators, and consistency between reported data and original records (this metric requires a site assessment / data collection). FASTR focuses on two of these measures: presence of outliers and consistency between related indicators because these are important for analysis and can be done routinely and remotely without visits to heath facilities.

- FASTR and DHIS2 DQA use different outlier detection methods (MADs vs standard deviations); FASTR focuses on identifying VERY large outliers that have undue influence in the analysis and for which adjustments will be made; DHIS2 DQA focuses on identifying outliers that should be followed up at the facility level, with no significant negative impact even if a few correct values are flagged as potential outliers, since these will be investigated further.

- DHIS2 DQA may assess agreement with external data sources such as periodic population-based surveys and consistency of population data which serves as the denominator for coverage analysis. FASTR does not include this in the data quality assessment but instead incorporates this in our coverage analysis.
<!-- /SLIDE -->

<!-- SLIDE:m4_2 -->
## Indicator completeness

**What it measures:** The extent to which facilities report data on selected core indicators

**Why it matters:**
- Higher completeness improves data reliability
- Stability over time strengthens trend analysis

**Key distinction:** Indicator completeness ≠ reporting completeness. This metric examines specific data elements, not just whether the monthly form was submitted.

**For the FASTR analysis, completeness is defined as:** The percentage of reporting facilities each month out of the total number of facilities expected to report.
- A facility is deemed to be "reporting" if there is a non-missing, non-zero value recorded for the indicator and month
- A facility is expected to report if it has reported any volume for that indicator anytime within a year
- Facilities that do not report for six or more consecutive months at the beginning or end of their reporting period are classified as **inactive** rather than incomplete. This prevents penalizing facilities that have not yet begun reporting or have permanently ceased operations

<!--
PRESENTER NOTES:
- Indicator completeness measures the extent to which facilities that are supposed to report data on the selected core indicators are in fact doing so
- Higher completeness improves reliability of the data, especially when completeness is stable over time
- This is different from overall reporting completeness in that it looks at completeness of specific data elements and not only at the receipt of the monthly reporting form
- For the FASTR analysis, completeness is defined as: The percentage of reporting facilities each month out of the total number of facilities expected to report
- A facility is deemed to be "reporting" if there is a non-missing, non-zero value recorded for the indicator and month
- A facility is expected to report if it has reported any volume for each indicator anytime within a year
-->
<!-- /SLIDE -->

<!-- SLIDE:m4_2a -->
## Notes on completeness

- A high level of completeness does not necessarily indicate that the HMIS is representative of all service delivery in the country as some services may not be delivered in facilities, or some facilities may not report

- For countries where the DHIS2 system does not store 0's, indicator completeness may be underestimated if there are many low-volume facilities for a given indicator
<!-- /SLIDE -->

<!-- SLIDE:m4_3 -->
## Outliers

The presence of outliers examines whether a data point in a series of values is extreme (either abnormally high or low) in relation to others in the series.

Outliers can be the result of changes in programmatic activities (such as an intensified campaign) or can be data quality problems.

For the FASTR analysis, we identify outliers which are suspiciously high values compared to the usual volume of services reported by the facility (e.g., low values are not identified as outliers in the FASTR analysis).

<!--
PRESENTER NOTES:
- The presence of outliers examines whether a data point in a series of values is extreme (either abnormally high or low) in relation to others in the series
- Outliers can be the result of changes in programmatic activities (such as an intensified campaign) or can be data quality problems
- For the FASTR analysis, we identify outliers which are suspiciously high values compared to the usual volume of services reported by the facility (e.g., low values are not identified as outliers in the FASTR analysis)
- Outliers are identified by assessing the within-facility variation in monthly reporting for each indicator
- An outlier is defined as: A value greater than 10 times the median absolute deviation (MAD) from the monthly median value for the indicator in each time period, OR a value for which the proportional contribution in volume for a facility, indicator, and time period is greater than 80%
- AND for which: The volume is greater than or equal to the median, the volume is not missing, and the volume is greater than 100
-->

---

## Why adjust for outliers?

![Outlier Impact](resources/diagrams/outlier_impact.svg)

---

## Outlier detection methodology

Outliers are identified by assessing the within-facility variation in monthly reporting for each indicator.

An outlier is defined as:

A value greater than **10 times the median absolute deviation (MAD)** from the monthly median value for the indicator in each time period, **OR** a value for which the proportional contribution in volume for a facility, indicator, and time period is **greater than 80%**

**AND** for which:

- The volume is **greater than or equal to the median**
- The volume is **not missing**
- The volume is **greater than 100**

<!--
PRESENTER NOTES:
- For the FASTR analysis, the time period considered for identifying outliers using the MAD approach spans the entire dataset. This means that if the dataset includes five years of data, the median value for each indicator will be calculated across the entire five-year period
- For the FASTR analysis, the proportional allocation approach to identifying outliers is applied on a calendar-year basis. This means that all data from the year 2024 will be used to assess the proportional contribution of service volumes reported in 2024. If the analysis is conducted mid-year, only the available data up to that point will be considered, potentially leading to a partial year's data being used in the assessment
- This restricts the FASTR analysis to outliers which are suspiciously high values compared to the usual volume of services reported by a facility
- Missing data from a DHIS2 system can be due to non-reporting or reporting of zero services delivered (zeros are often not stored in DHIS2). We cannot distinguish between missing due to non-reporting and missing due to reporting zero services. As such, missing values are excluded from the analysis
- We restrict outlier detection to service volumes greater than 100 as this helps in focusing on meaningful, stable, and operationally significant data. It reduces noise due to small volume volatility and focuses on more impactful outliers (e.g. large volumes are likely to have more significant implications of the analysis)
-->

<!-- /SLIDE -->

<!-- SLIDE:m4_4 -->
<style scoped>
table { font-size: 0.7em; }
td, th { padding: 4px 8px !important; }
</style>

## Consistency between related indicators

Program indicators with a predictable relationship are examined to determine whether the expected relationship exists between them. In other words, this process examines whether the observed relationship between the indicators, as shown in the reported data, is that which is expected.

<div class="columns">
<div>

| Indicator pair | Expected relationship |
|----------------|----------------------|
| ANC1 / ANC4 | Ratio should be ≥ 0.95 |
| Penta1 / Penta3 | Ratio should be ≥ 0.95 |
| BCG / Facility delivery | Within 30% (≥0.7 and ≤1.3) |

We expect the number of pregnant women receiving a first ANC visit will always be higher than the number of pregnant women receiving a fourth ANC visit.

BCG is a birth dose vaccine so we expect that these indicators will be equal. However, we recognize there may be more variability in this predicted relationship thus we set a range of within 30%.

</div>
<div>

![Consistency illustration h:280](../resources/diagrams/consistency_illustration.svg)

</div>
</div>

<!--
PRESENTER NOTES:
- Consistency checks logical relationships: ANC1 should always ≥ ANC4 (can't have 4th visit without 1st)
- We assess at DISTRICT level because patients move between facilities within a district
- Example: woman has ANC1 at health post, ANC4 at district hospital - still consistent at district level
- BCG vs deliveries allows 30% tolerance because not all births happen in facilities
- Ask: In your context, do patients commonly seek different services at different facilities?
-->

---

## Why assess consistency at district level?

<div style="display: flex; gap: 1.5em; align-items: flex-start;">
<div style="flex: 1;">

Patients often access different services at different facilities within a district:

- A woman may attend **ANC1** at a nearby health post, but travel to a health centre for **ANC4**
- A child may receive **Penta1** at a local clinic, but complete **Penta3** at a district hospital

Checking consistency at the facility level would miss these patterns. Aggregating to district level captures the complete picture of service utilization within a geographic area.

</div>
<div style="flex: 2;">

![District consistency](resources/diagrams/district_consistency.svg)

</div>
</div>
<!-- /SLIDE -->

<!-- SLIDE:m4_5 -->
## Data quality summary score

A composite measure of data quality provides an overall view of how well a dataset meets quality standards. By integrating multiple dimensions of data quality into a single score, it simplifies the interpretation of detailed information from several measures. This allows health systems to quickly assess the reliability of data, making it easier to identify trends and issues at a glance.

**Definition of adequate data quality:** For the FASTR analysis, we defined adequate data quality as:

- No missing indicator data for OPD, Penta1, and ANC1, where available, **AND**
- No outliers for OPD, Penta1, and ANC1, where available, **AND**
- Consistent reporting between Penta1/Penta3 and ANC1/ANC4

<!-- /SLIDE -->

<!-- SLIDE:m4_6 -->
## DQA module: Configuration parameters

| Parameter | Description |
|-----------|-------------|
| **Proportion threshold for outlier detection** | Adjusts the threshold for proportional contribution to flag a facility-month as an outlier |
| **Minimum count threshold for consideration** | Defines the minimum count required for a facility-month to be considered an outlier |
| **Number of MADs** | Outliers are defined as observations which are greater than X times the median absolute deviation (MAD) from the monthly median value for the indicator in each time period |
| **Indicators subjected to DQA** | Defines which indicators are included for assessment of outliers and completeness for inclusion in the DQA score |
| **Consistency pairs used** | Defines which indicator pairs are used for consistency analysis and the expected ratio ranges |

<!--
PRESENTER NOTES:
- These parameters can be adjusted in the platform settings
- Default values work well for most contexts but can be customized
- MAD multiplier of 10 is conservative - only flags extreme outliers
- Minimum count of 100 prevents low-volume facilities from being over-flagged
- Consistency pairs can be modified based on which indicators you're analyzing
-->
<!-- /SLIDE -->

<!-- ═══════════════════════════════════════════════════════════════════════════
     CONDENSED SLIDES: Methods + Interpretation Combined
     For workshops requiring shorter, high-level overview
═══════════════════════════════════════════════════════════════════════════ -->

<!-- SLIDE:m4_s1 -->
## FASTR analytical pipeline

The FASTR analysis follows a sequential workflow:

1. **Assess data quality** - Identify issues with completeness, outliers, and consistency
2. **Adjust for quality issues** - Apply corrections to improve data reliability
3. **Analyze adjusted data** - Generate service utilization and coverage estimates

![Analytical Pipeline h:280](resources/diagrams/analytical_pipeline.svg)

---

## FASTR approach to data quality

FASTR takes a multi-pronged approach, based on the belief that **data quality should not be a barrier to data use**.

- Conduct granular, facility-level data quality assessments
- Focus on high-volume indicators that produce more stable estimates
- Emphasize variation over time and space rather than point estimates
- Interpret results collaboratively with in-country decision-makers

**Using data and providing feedback is viewed as the first step toward improving data quality.**

<!--
PRESENTER NOTES:
- This is the condensed overview - hit the key points quickly
- Emphasize the philosophy: don't let perfect be the enemy of good
- The pipeline is sequential: DQA → Adjustment → Analysis
- Using data creates accountability and motivation to improve quality
-->
<!-- /SLIDE -->

<!-- SLIDE:m4_s2 -->
## Rationale for data quality assessment

**Challenge:** Routine health facility data may contain quality limitations:
- Reported values outside plausible ranges
- Reporting gaps affecting completeness
- Inconsistencies between related indicators

**Implications:** These limitations can distort decision-making:
- Inaccurate assessment of service delivery trends
- Misidentification of areas needing intervention
- Suboptimal resource allocation

---

## Objectives of data quality assessment

**Objective 1: Enable analytical adjustment**
Systematic assessment supports targeted adjustments, enhancing the utility of HMIS data for evidence-based decision-making.

**Objective 2: Monitor data quality trends**
- Inform indicator selection based on quality profiles
- Guide targeted interventions and supportive supervision
- Evaluate effectiveness of improvement initiatives over time
<!-- /SLIDE -->

<!-- SLIDE:m4_s3 -->
## Indicator completeness

Indicator completeness measures whether facilities that should be reporting data on specific indicators are actually doing so. This is different from overall reporting completeness - we're looking at specific data elements, not just whether the monthly form was submitted.

**Definition:** Percentage of facilities reporting each month out of facilities expected to report.
- A facility is "reporting" if there is a non-missing, non-zero value for the indicator that month
- A facility is "expected to report" if it has reported any volume for that indicator within the past year

Higher and stable completeness improves data reliability.

---

## Indicator completeness output

<div style="display: flex; gap: 1em; align-items: flex-start;">
<div style="flex: 1.2;">

![Completeness output](../resources/default_outputs/Default_2._Proportion_of_completed_records.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**What you see:** Heatmap showing completeness by indicator and region over time.

**Formula:** Completeness % = (facilities reporting / facilities expected) × 100

**Interpretation:** Look for systematic gaps by region or indicator, declining trends, or seasonal patterns. Low completeness suggests reporting barriers needing attention.

</div>
</div>

<!--
PRESENTER NOTES:
- Walk through the heatmap: rows are indicators, columns are time periods
- Color intensity shows completeness level - darker = more complete
- Point out any patterns: seasonal dips? Specific indicators with issues?
- Emphasize: we're looking at indicator completeness, not form submission
-->
<!-- /SLIDE -->

<!-- SLIDE:m4_s3b -->
## Outlier detection

Outliers are values that are suspiciously **high** compared to a facility's usual reporting volume. They may result from data entry errors or genuine programmatic changes (e.g., campaigns).

**Note:** FASTR only flags high values as outliers - unusually low values are not flagged, as these more likely reflect service disruptions than data errors.

**How outliers are identified:** For each facility and indicator, we assess within-facility variation in monthly reporting. A value is flagged if it deviates significantly from the facility's typical pattern (using statistical thresholds based on median absolute deviation).

---

## Outlier detection output

<div style="display: flex; gap: 1em; align-items: flex-start;">
<div style="flex: 1.2;">

![Outliers output](../resources/default_outputs/Default_1._Proportion_of_outliers.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**What you see:** Heatmap showing proportion of values flagged as outliers by indicator and region.

**Formula:** Outlier % = (values flagged / total values) × 100

**Interpretation:** High rates may indicate data entry errors or legitimate events like campaigns. Review facility registers to distinguish between the two.

</div>
</div>

<!--
PRESENTER NOTES:
- Only HIGH values are flagged - low values may be real service disruptions
- High outlier rates warrant investigation: data entry errors or real events?
- Campaigns can cause legitimate spikes - context matters
- The heatmap shows which indicators/regions have most outliers
-->
<!-- /SLIDE -->

<!-- SLIDE:m4_s4 -->
## Internal consistency

Internal consistency checks whether related indicators maintain expected logical relationships. For example, ANC1 should always be ≥ ANC4 (you can't have a 4th visit without a 1st). Similarly, Penta1 ≥ Penta3. When these relationships are violated, it signals data quality issues like double-counting, under-reporting, or data flow errors.

FASTR assesses consistency at the **district level** rather than facility level. This is because patients frequently seek care from different facilities within the same district - a woman may have her ANC1 visit at a health post but travel to the district hospital for ANC4. Assessing at district level accounts for this patient movement.

---

## Internal consistency output

<div style="display: flex; gap: 1em; align-items: flex-start;">
<div style="flex: 1.2;">

![Consistency output](../resources/default_outputs/Default_4._Proportion_of_sub-national_areas_meeting_consistency_criteria.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**What you see:** Heatmap showing the % of districts where indicator pairs meet expected relationships (e.g., ANC1 ≥ ANC4).

**Formula:** Consistency % = (districts meeting criteria / total districts) × 100

**Interpretation:** Low consistency may indicate data flow problems, double-counting, or systematic under-reporting at the district level.

</div>
</div>

---

## DQA mean: combining all quality dimensions

The mean DQA score shows how close a facility's data is to meeting all quality criteria. A score of 100% means the data passes all DQA checks - no missing values, no outliers, and consistent reporting.

**Average DQA score across facilities** = (number of monthly values that are complete, not outliers, and consistent) ÷ (total number of monthly values)

---

## DQA mean output

<div style="display: flex; gap: 1em; align-items: flex-start;">
<div style="flex: 1.2;">

![DQA score output](../resources/default_outputs/Default_5._Overall_DQA_score.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**What you see:** Heatmap showing DQA mean by indicator and region, color-coded from red (poor) to green (good).

**Formula:** (values that are complete, not outliers, and consistent) ÷ (total values)

**Interpretation:** 100% = passes all checks. Use this to prioritize data quality improvement efforts.

</div>
</div>

<!--
PRESENTER NOTES:
- Consistency is assessed at district level to account for patient movement
- DQA mean combines all dimensions into one summary score
- 100% = complete + no outliers + consistent - the goal for quality data
- Use the heatmap to identify priority areas for data quality improvement
- This completes the DQA module - next we'll look at how to adjust for these issues
-->
<!-- /SLIDE -->

