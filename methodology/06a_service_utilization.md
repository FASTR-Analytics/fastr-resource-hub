# Service utilization analysis

## Background and purpose

### Objective of the module

The Service Utilization module analyzes health service delivery patterns to detect and quantify disruptions in service volumes over time. It identifies deviations from expected service delivery patterns and estimates the magnitude of these disruptions at national, provincial, and district levels.

Using statistical process control and regression-based methods, the module compares observed service volumes with expected levels derived from historical trends and seasonal patterns. This enables routine, predictable variation (such as seasonal increases in malaria cases) to be distinguished from substantive service disruptions, including sudden declines in RMNCAH-N services—such as immunization and maternal or child health care—during periods of conflict or public health emergencies.

The analysis produces quantified estimates of service shortfalls and surpluses, enabling changes in service delivery to be systematically measured and compared across time and geographic levels.

### Analytical rationale

Service utilization data provide insight into how populations access essential health services, but observed volumes may vary for multiple reasons, including seasonality, policy changes, external shocks (such as pandemics, natural disasters, or conflict), data quality limitations, and changes in service availability. Without systematic analysis, it is difficult to distinguish normal variation from material disruptions in service delivery.

This module applies a standardized, data-driven approach to identify deviations in service utilization and to quantify their magnitude. The outputs allow emerging issues in service delivery to be detected, compared across geographic levels, and tracked over time, including during periods of disruption and recovery. The results are structured for use in routine monitoring, analytical reporting, and assessment of changes in health service performance.

### Key points

| Component | Details |
|-----------|---------|
| **Inputs** | Adjusted service volumes from Module 2 (`M2_adjusted_data.csv`)<br>Outlier flags from Module 1 (`M1_output_outliers.csv`)<br>Raw HMIS (`hmis_ISO3.csv`) - only for admin_area_1 lookup |
| **Outputs** | Disruption flags (`M3_chartout.csv`)<br>Quantified impacts by geographic level (`M3_disruptions_analysis_*.csv`)<br>Shortfall/surplus summaries (`M3_all_indicators_shortfalls_*.csv`) |
| **Purpose** | Detect and quantify service delivery disruptions through two-stage analysis: control charts identify when disruptions occur, panel regression quantifies their magnitude |

---

## Analytical workflow

### Overview of analytical steps

The module operates in two sequential parts, each with a distinct purpose:

**Part 1: Control chart analysis** - Identifies unusual patterns in service volumes

1. **Prepare the data**: Load health service data, remove previously identified outliers, aggregate to the appropriate geographic level, and fill in missing months using interpolation.

2. **Model expected patterns**: For each combination of health indicator and geographic area, use robust statistical methods to estimate what service volumes should look like based on historical trends and seasonal patterns (e.g., accounting for predictable increases in malaria cases during rainy season).

3. **Detect deviations**: Compare actual service volumes to expected patterns and identify significant deviations using multiple detection rules:
   - **Sharp disruptions**: Single months with extreme deviations
   - **Sustained drops**: Gradual declines over several months
   - **Sustained dips**: Periods consistently below expected levels
   - **Sustained rises**: Periods consistently above expected levels
   - **Missing data patterns**: Gaps in reporting that may signal problems

4. **Flag disrupted periods**: Mark months where any disruption pattern is detected, ensuring recent months are always flagged for review.

**Part 2: Disruption analysis** - Quantifies the impact of identified disruptions

5. **Apply regression models**: Use panel regression at multiple geographic levels (national, provincial, district) to estimate how much service volumes changed during flagged disruption periods, controlling for trends and seasonality.

6. **Calculate shortfalls and surpluses**: Compare predicted volumes to actual volumes to quantify the magnitude of disruptions in absolute numbers and percentages.

7. **Generate outputs**: Create summary files showing disruption impacts at each geographic level, ready for visualization and reporting.

### Workflow diagram

<iframe src="../resources/diagrams/mod3_workflow.html" width="100%" height="800" style="border: 1px solid #ccc; border-radius: 4px;" title="Module 3 Interactive Workflow"></iframe>

### Key decision points

**Geographic level of analysis**

The module supports disruption analysis at multiple geographic scales. Users may limit analysis to national and provincial levels, which is computationally faster and suitable for routine monitoring, or extend the analysis to district and ward levels to obtain more granular information for targeted investigation and response.

**Control chart level selection**

The level at which control charts are calculated determines where statistical modeling is performed. This is configured through two flags and follows the FASTR convention in which higher administrative level numbers correspond to smaller geographic units.

- **Default configuration (both flags set to FALSE)**  
  Control charts are calculated at an intermediate subnational level (**admin_area_2**). Service volumes are aggregated to this level, and trend estimation, control limit calculation, and disruption detection are performed for each geography–indicator combination. This option is the most computationally efficient and is suitable for routine monitoring.

- **RUN_DISTRICT_MODEL = TRUE**  
  Control charts are calculated at a finer subnational level (**admin_area_3**). Service volumes are aggregated to smaller geographic units, allowing detection of localized disruptions that may be masked at higher levels of aggregation. This option is more computationally intensive but provides greater spatial resolution.

- **RUN_ADMIN_AREA_4_ANALYSIS = TRUE**  
  Control charts are calculated at the most granular geographic level available (**admin_area_4**). This enables identification of highly localized or facility-level disruptions. It is the most resource-intensive option and is typically used for targeted or diagnostic analysis.

The selected control chart level determines where statistical modeling is conducted, including trend estimation, control limit calculation, and disruption flagging. Regardless of the level at which control charts are calculated, disruption results are aggregated and reported at all available geographic levels (national and subnational).


**Sensitivity settings**

The module uses configurable statistical thresholds to define what constitutes a disruption. More sensitive settings (lower thresholds) flag smaller deviations from expected patterns and are suitable for early warning purposes. More conservative settings (higher thresholds) restrict detection to larger deviations and are useful for focusing on major disruptions.

**Treatment of reporting completeness**

The module accepts alternative versions of service counts produced by Module 2, allowing users to choose whether to analyze raw reported volumes or volumes adjusted for reporting completeness. This provides flexibility to align disruption analysis with different data quality assumptions.


### Data processing and outputs

**Input transformation**

The module begins with facility-level monthly service counts (for example, deliveries reported by each facility). These data are aggregated to the selected geographic level. Observations identified as outliers in Module 1 are excluded to prevent anomalous values from influencing trend estimation and control limits.

**Pattern estimation and detection**

Using robust statistical methods, the module estimates expected service utilization patterns for each indicator and geographic unit based on historical data, accounting for long-term trends and seasonality. Months in which observed service volumes deviate significantly from these expected patterns are flagged as potential disruptions.

**Quantification of disruption impacts**

For periods identified as disrupted, regression-based models are used to estimate counterfactual service volumes—representing expected utilization in the absence of disruption. Differences between predicted and observed volumes are calculated to quantify service shortfalls or surpluses.

**Output structure**

The final outputs report disruption metrics at multiple geographic levels, from national summaries to detailed local results. The original reported data are preserved, with additional fields providing expected values, disruption flags, and quantified impacts.

---

### Analysis outputs and visualization

The FASTR analysis generates four main visual outputs for service utilization:

**1. Change in service volume**

Bar chart showing annual service volumes by region and indicator, with year-on-year percent change annotations.

![Change in service volume over time.](resources/default_outputs/Module3_1_Change_in_service_volume.png)

**2. Actual vs expected services (national)**

Line chart comparing observed service volumes against model predictions at the national level.

![Actual vs expected number of services at national level.](resources/default_outputs/Module3_2_Actual_vs_expected_national.png)

**3. Actual vs expected services (subnational)**

Line charts by region comparing observed volumes to expected patterns.

![Actual vs expected number of services at subnational level.](resources/default_outputs/Module3_3_Actual_vs_expected_subnational.png)

**4. Volume change due to data quality adjustments**

Grouped bar chart comparing service volumes across four adjustment scenarios: no adjustment, outlier adjustment only, completeness adjustment only, and both adjustments.

![Volume change due to data quality adjustments.](resources/default_outputs/Module3_4_Volume_change_adjustments.png)

**Interpretation guide**

For the change in service volume chart (output 1):

- **Bars**: Annual service volumes by region
- **Annotations**: Year-on-year percent change between consecutive years

For the actual vs expected charts (outputs 2–3):

- **Black line**: Actual (observed) service volumes
- **Red shaded areas**: Shortfall periods (actual below expected)
- **Green shaded areas**: Surplus periods (actual above expected)

For the volume change chart (output 4):

- **Four bars per year**: Each bar represents a different adjustment scenario
- Compare bar heights to see how adjustments affect reported volumes

---

## Detailed reference

### Configuration parameters

??? "Core analysis parameters"

    | Parameter | Default | Type | Description | Tuning Guidance |
    |-----------|---------|------|-------------|-----------------|
    | `COUNTRY_ISO3` | "ISO3" | String | Three-letter country code | Set to your country code (e.g., "RWA", "UGA", "ZMB") |
    | `SELECTEDCOUNT` | "count_final_both" | String | Data column used for analysis | Options: `count_final_none`, `count_final_completeness`, `count_final_both` |
    | `VISUALIZATIONCOUNT` | "count_final_both" | String | Data column used for visualization | Should match or complement `SELECTEDCOUNT` |

??? "Control chart parameters"

    | Parameter | Default | Type | Description | Tuning Guidance |
    |-----------|---------|------|-------------|-----------------|
    | `SMOOTH_K` | 7 | Integer (odd) | Rolling median window size in months | Larger values = smoother trends, less sensitivity. Must be odd number (e.g., 5, 7, 9, 11) |
    | `MADS_THRESHOLD` | 1.5 | Numeric | MAD units threshold for sharp disruptions | Lower = more sensitive (e.g., 1.0), higher = more conservative (e.g., 2.0) |
    | `DIP_THRESHOLD` | 0.90 | Numeric | Proportion threshold for sustained dips | 0.90 = flag if below 90% of expected (10% drop). Use 0.80 for 20% drop threshold |
    | `DIFFPERCENT` | 10 | Numeric | Percentage threshold for plotting disruptions | If actual differs from predicted by >10%, use predicted value in visualizations |

    **Note**: `RISE_THRESHOLD` is automatically calculated as `1 / DIP_THRESHOLD` (default: ~1.11) to mirror dip detection symmetrically.

??? "Geographic analysis parameters"

    | Parameter | Default | Type | Description | Tuning Guidance |
    |-----------|---------|------|-------------|-----------------|
    | `CONTROL_CHART_LEVEL` | Auto-set | String | Geographic level for control charts | Automatically set based on `RUN_DISTRICT_MODEL` and `RUN_ADMIN_AREA_4_ANALYSIS` |
    | `RUN_DISTRICT_MODEL` | FALSE | Logical | Whether to run admin_area_3 regressions | Set TRUE for district-level analysis (increases runtime) |
    | `RUN_ADMIN_AREA_4_ANALYSIS` | FALSE | Logical | Whether to run admin_area_4 analysis | Set TRUE for finest-level analysis (very slow for large datasets) |

??? "Data source parameters"

    | Parameter | Default | Type | Description |
    |-----------|---------|------|-------------|
    | `PROJECT_DATA_HMIS` | "hmis_ISO3.csv" | String | Filename for raw HMIS data |

??? "Parameter selection guide"

    **For high-sensitivity analysis** (detecting smaller disruptions):
    - `MADS_THRESHOLD = 1.0`
    - `DIP_THRESHOLD = 0.95` (5% drop)
    - `SMOOTH_K = 5` (less smoothing)

    **For conservative analysis** (only major disruptions):
    - `MADS_THRESHOLD = 2.0`
    - `DIP_THRESHOLD = 0.80` (20% drop)
    - `SMOOTH_K = 9` or `11` (more smoothing)

    **For faster runtime**:
    - `RUN_DISTRICT_MODEL = FALSE`
    - `RUN_ADMIN_AREA_4_ANALYSIS = FALSE`
    - `CONTROL_CHART_LEVEL = "admin_area_2"`

### Input/output specifications

??? "Input requirements"

    #### Primary Inputs

    1. **`M2_adjusted_data.csv`** (main data source)
       - Output from Module 2 (Data Quality Adjustments)
       - Contains adjusted service counts with different completeness assumptions
       - Required columns: `facility_id`, `indicator_common_id`, `period_id`, `count_final_none`, `count_final_completeness`, `count_final_both`

    2. **`M1_output_outliers.csv`**
       - Output from Module 1 (Data Quality Assessment)
       - Contains `outlier_flag` to identify and exclude anomalous data points
       - Required columns: `facility_id`, `indicator_common_id`, `period_id`, `outlier_flag`

    3. **`hmis_ISO3.csv`** (used only for geographic lookup)
       - Raw HMIS file used solely to extract facility_id → admin_area_1 mapping
       - Required because M2_adjusted_data.csv does not include admin_area_1
       - Required columns: `facility_id`, `admin_area_1`

    #### Data Requirements

    - **Temporal coverage**: Minimum 12 months of data for seasonal modeling
    - **Data completeness**: Missing months are filled using interpolation
    - **Geographic completeness**: Data at specified administrative levels
    - **Count data**: Non-negative integer counts (predictions are bounded at zero)

    ### Outputs

    #### 1. Control Chart Results

    **`M3_chartout.csv`**

    **Purpose**: Contains flagged disruptions from the control chart analysis

    **Columns**:

    - `admin_area_*`: Geographic identifier (level depends on `CONTROL_CHART_LEVEL`)
    - `indicator_common_id`: Health service indicator code
    - `period_id`: Time period in YYYYMM format
    - `tagged`: Binary flag (1 = disruption detected, 0 = normal)

    **Use**: Identifies which months require further investigation for each indicator-geography combination

    **`M3_service_utilization.csv`**

    **Purpose**: Pass-through copy of adjusted data for visualization

    **Source**: Direct copy of `M2_adjusted_data.csv`

    **Use**: Provides baseline data for plotting actual service volumes

    **`M3_memory_log.txt`**

    **Purpose**: Tracks memory usage throughout execution

    **Use**: Diagnostics for performance optimization and troubleshooting

    #### 2. Disruption Analysis Results

    **`M3_disruptions_analysis_admin_area_1.csv`** (National level - always generated)

    **Columns**:

    - `admin_area_1`: Country name
    - `indicator_common_id`: Health service indicator
    - `period_id`: Time period (YYYYMM)
    - `count_sum`: Actual service volume (sum across all facilities)
    - `count_expect_sum`: Expected service volume (sum of predictions)
    - `count_expected_if_above_diff_threshold`: Value for plotting (expected if |difference| > DIFFPERCENT, otherwise actual)

    **`M3_disruptions_analysis_admin_area_2.csv`** (Province level - always generated)

    **Additional column**: `admin_area_2` (province/region name)

    **Same structure**: As admin_area_1 file but disaggregated by province

    **`M3_disruptions_analysis_admin_area_3.csv`** (District level - conditional)

    **Generated when**: `RUN_DISTRICT_MODEL = TRUE`

    **Additional columns**: `admin_area_2`, `admin_area_3`

    **Same structure**: As above but disaggregated by district

    **`M3_disruptions_analysis_admin_area_4.csv`** (Ward level - conditional)

    **Generated when**: `RUN_ADMIN_AREA_4_ANALYSIS = TRUE`

    **Additional columns**: `admin_area_2`, `admin_area_3`, `admin_area_4`

    **Warning**: Very large file size for countries with many wards

    #### 3. Shortfall/Surplus Summary Files

    **`M3_all_indicators_shortfalls_admin_area_*.csv`** (one for each geographic level)

    **Purpose**: Pre-calculated shortfall and surplus metrics for reporting

    **Common columns**:

    - Geographic identifier(s): `admin_area_*`
    - `indicator_common_id`: Health service indicator
    - `period_id`: Time period (YYYYMM)
    - `count_sum`: Actual service volume
    - `count_expect_sum`: Expected service volume
    - `shortfall_absolute`: Absolute number of missing services (if negative disruption)
    - `shortfall_percent`: Percentage shortfall relative to expected
    - `surplus_absolute`: Absolute number of excess services (if positive disruption)
    - `surplus_percent`: Percentage surplus relative to expected

    **Note**: If optional geographic levels are disabled, empty placeholder files are created for compatibility with downstream processes.

    #### Temporary Files (Automatically Cleaned)

    During execution, the module creates temporary batch files for memory management:
    - `M3_temp_controlchart_batch_*.csv`
    - `M3_temp_indicator_batch_*.csv`
    - `M3_temp_province_batch_*.csv`
    - `M3_temp_district_batch_*.csv`
    - `M3_temp_admin4_batch_*.csv`

    These are automatically deleted upon successful completion. If the script crashes, these files may remain and will be cleaned up on the next run.

### Key functions documentation

??? "`robust_control_chart(panel_data, selected_count)`"

    **Purpose**: Identifies anomalies in service utilization using robust regression and MAD-based control limits.

    **Inputs**:

    - `panel_data`: Time series data for a specific indicator-geography combination
    - `selected_count`: Column name containing service volume counts to analyze

    **Process**:

    1. Fits a robust linear model (using `MASS::rlm()`) with seasonal controls and time trends
    2. Applies rolling median smoothing to predicted values to reduce noise
    3. Calculates residuals and standardizes them using Median Absolute Deviation (MAD)
    4. Applies rule-based tagging logic to identify different disruption types
    5. Flags recent months automatically to ensure timely detection

    **Outputs**:

    - `count_predict`: Predicted service volume from robust regression
    - `count_smooth`: Smoothed predictions using rolling median
    - `residual`: Difference between actual and smoothed values
    - `robust_control`: Standardized residual (residual/MAD)
    - `tagged`: Binary flag (1 = disruption detected, 0 = normal variation)
    - Additional flags: `tag_sharp`, `tag_sustained`, `tag_sustained_dip`, `tag_sustained_rise`, `tag_missing`

    **Key features**:

    - Handles missing data gracefully with interpolation
    - Uses robust regression to minimize influence of outliers
    - Employs multiple disruption detection rules for different patterns
    - Ensures non-negative predictions (counts cannot be negative)

    ### Panel Regression Models

    The disruption analysis uses panel regression models (`fixest::feols()`) at multiple geographic levels. Separate regressions are run for each geographic unit at each level, with clustered standard errors to account for within-area correlation.

    **Country-wide Model** (Admin Area 1):

    ```r
    count ~ date + factor(month) + tagged
    ```

    Single regression across all facilities, clustered standard errors at district level (`admin_area_3`)

    **Province-level Models** (Admin Area 2):

    ```r
    count ~ date + factor(month) + tagged
    ```

    Separate regression run for each province, clustered standard errors at district level

    **District-level Models** (Admin Area 3 - optional):

    ```r
    count ~ date + factor(month) + tagged
    ```

    Separate regression run for each district, clustered standard errors at ward level (`admin_area_4`)

    **Ward-level Models** (Admin Area 4 - optional):

    ```r
    count ~ date + factor(month) + tagged
    ```

    Separate regression run for each ward/finest unit (no clustering)

    ### Supporting Functions

    **`mem_usage(msg)`**: Tracks and logs memory consumption throughout execution

    **Data processing**:

    - Batch processing with disk-based temporary files for memory efficiency
    - Efficient data.table operations for large datasets
    - Progressive aggregation and merging strategies

### Statistical methods & algorithms

??? "Control chart analysis"

    Service volumes are aggregated at the specified geographic level (configurable via `CONTROL_CHART_LEVEL`). The pipeline removes outliers (`outlier_flag == 1`), fills in missing months, and filters low-volume months (<50% of global mean volume).

    A robust regression model estimates expected service volumes per indicator × geographic area (`panelvar`). A centered rolling median is applied to smooth the predicted values. Residuals (actual - smoothed) are standardized using MAD. Disruptions are identified using a rule-based tagging system.

    #### Disruption Detection Rules

    Each rule is controlled by user-defined parameters, allowing customization of the sensitivity and behavior of the detection logic:

    **Sharp disruptions**: Flags a single month when the standardized residual (residual divided by MAD) exceeds a threshold:

    $$ \left| \frac{\text{residual}}{\text{MAD}} \right| \geq \text{MADS_THRESHOLD} $$

    - **Parameter:** `MADS_THRESHOLD` (default: `1.5`)
    - Lower values make the detection more sensitive to sudden spikes or dips.

    **Sustained drops**: Flags a sustained drop if:

    - Three consecutive months show mild deviations (standardized residual ≥ 1 but < `MADS_THRESHOLD`), and
    - The current month has a standardized residual ≥ 1.5 (hardcoded threshold).

    This captures slower, compounding declines.

    **Sustained dips**: Flags periods where the actual volume falls consistently below a defined proportion of expected volume (smoothed prediction):

    $$ \text{count_original} < \text{DIP_THRESHOLD} \times \text{count_smooth} $$

    - **Parameter:** `DIP_THRESHOLD` (default: `0.90`)
    - Users can adjust this to detect deeper or shallower dips (e.g., `0.80` for a 20% drop).

    **Sustained rises**: Symmetric to dips, flags periods of consistent overperformance:

    $$ \text{count_original} > \text{RISE_THRESHOLD} \times \text{count_smooth} $$

    - **Parameter:** `RISE_THRESHOLD` (default: `1 / DIP_THRESHOLD`, e.g., `1.11`)
    - Users can adjust this to detect upward surges in volume.

    **Missing data**: Flags when 2 or more of the past 3 months have missing (`NA`) or zero service volume.

    - **Fixed rule**.

    **Recent tail override**: Automatically flags all months in the last 6 months of data to ensure recent trends are reviewed, even if model-based tagging is not conclusive.

    - **Fixed rule**.

    **Final flag**: A month is assigned `tagged = 1` if **any** of the following conditions are met:

    - `tag_sharp == 1`
    - `tag_sustained == 1`
    - `tag_sustained_dip == 1`
    - `tag_sustained_rise == 1`
    - `tag_missing == 1`
    - It falls within the most recent 6 months (`last_6_months == 1`)

    ### Robust Regression Model

    **Model fitting**:

    If ≥12 observations and >12 unique dates:

    $$Y_{it} = \beta_0 + \sum \gamma_m \cdot \text{month}_m + \beta_1 \cdot \text{date} + \epsilon_{it}$$

    If only ≥12 observations:

    $$Y_{it} = \beta_0 + \beta_1 \cdot \text{date} + \epsilon_{it}$$

    If insufficient data: use the median of observed values.

    **Apply rolling median smoothing to predictions**:

    $$ \text{count_smooth}_{it} = \text{Median}(\text{count_predict}_{t-k}, \dots, \text{count_predict}_t, \dots, \text{count\_predict}_{t+k}) $$

    - **Parameter:** `SMOOTH_K` (default: 7, must be odd)
    - Larger `SMOOTH_K` smooths more; smaller retains more variation.

    **Calculate residuals**:

    $$ \text{residual}_{it} = \text{count_original}_{it} - \text{count_smooth}_{it} $$

    **Standardize residuals using MAD**:

    $$ \text{robust_control}_{it} = \text{residual}_{it} / \text{MAD}_i $$

    ### Disruption Analysis Regression Models

    Once anomalies are identified and saved in `M3_chartout.csv`, the disruption analysis quantifies their impact using regression models. These models estimate how much service utilization changed during the flagged disruption periods by adjusting for long-term trends and seasonal variations.

    For each indicator, we estimate:

    $$ Y_{it} = \beta_0 + \beta_1 \cdot \text{date} + \sum_{m=1}^{12} \gamma_m \cdot \text{month}_m + \beta_2 \cdot \text{tagged} + \epsilon_{it} $$

    where:
    - $Y_{it}$ is the observed service volume,
    - $\text{date}$ captures time trends,
    - $\text{month}_m$ controls for seasonality,
    - $\text{tagged}$ is the disruption dummy (from the control chart analysis),
    - $\epsilon_{it}$ is the error term.

    The coefficient on `tagged` ($\beta_2$) measures the relative change in service utilization during flagged disruptions. Separate regressions are run at the national, province and district levels to assess the impact across different geographic scales.

    #### Country-wide Regression

    The country-wide regression estimates how service utilization changes at the national level when a disruption occurs. Instead of analyzing individual provinces or districts separately, this model considers the entire country's data in a single regression. Errors are clustered at the lowest available geographic level (`lowest_geo_level`), typically districts.

    **Model specification:**

    $$Y_{it} = \beta_0 + \beta_1 \cdot \text{date} + \sum_{m=1}^{12} \gamma_m \cdot \text{month} + \beta_2 \cdot \text{tagged} + \epsilon_{it}$$

    Where:
    - $Y_{it}$ = volume (e.g., number of deliveries)
    - $\text{date}$ = time trend
    - $\text{month}_m$ = controls for seasonality (factor variable)
    - $\text{tagged}$ = dummy for disruption period
    - $\epsilon_{it}$ = error term, clustered at the district level (`admin_area_3`)

    #### Province-level Regression

    The province-level disruption regression estimates how service utilization changes at the province level when a disruption occurs. Unlike the country-wide model, this approach runs separate regressions for each province to capture regional variations.

    **Model specification** (run separately for each province):

    $$Y_{it} = \beta_0 + \beta_1 \cdot \text{date} + \sum_{m=1}^{12} \gamma_m \cdot \text{month} + \beta_2 \cdot \text{tagged} + \epsilon_{it}$$

    Where:
    - $Y_{it}$ = volume (e.g., number of deliveries)
    - $\text{date}$ = time trend
    - $\text{month}_m$ = controls for seasonality (factor variable)
    - $\text{tagged}$ = dummy for disruption period
    - $\epsilon_{it}$ = error term, clustered at the district level

    #### District-level Regression

    The district-level disruption regression estimates how service utilization changes at the district level when a disruption occurs. This approach runs separate regressions for each district to capture localized variations.

    **Model specification** (run separately for each district):

    $$Y_{it} = \beta_0 + \beta_1 \cdot \text{date} + \sum_{m=1}^{12} \gamma_m \cdot \text{month} + \beta_2 \cdot \text{tagged} + \epsilon_{it}$$

    Where:
    - $Y_{it}$ = volume (e.g., number of deliveries)
    - $\text{date}$ = time trend
    - $\text{month}_m$ = controls for seasonality (factor variable)
    - $\text{tagged}$ = dummy for disruption period
    - $\epsilon_{it}$ = error term, clustered at the ward level (`admin_area_4`) if multiple clusters available

    #### Regression Outputs

    Each regression level produces the following outputs:

    **Expected values (`expect_admin_area_*`)**: Predicted service volume adjusted for seasonality and trends.

    **Disruption effect (`b_admin_area_*`)**: Estimated relative change during disruptions:

    $$ b_{\text{admin_area_*}} = -\frac{\text{diff mean}}{\text{predict mean}} $$

    **Trend coefficient (`b_trend_admin_area_*`)**: Reflects long-term trend.

    - Positive = increasing service use
    - Negative = declining service use
    - Near zero = stable trend

    **P-value (`p_admin_area_*`)**: Measures statistical significance of the disruption effect.

    - Lower values = stronger evidence of true disruption

    ### Statistical Methods Used

    **Robust regression (`MASS::rlm`)**:

    - Uses iteratively reweighted least squares (IRLS)
    - Minimizes influence of outliers and extreme values
    - More resistant to model misspecification than ordinary least squares
    - Default: Huber weighting with maximum 100 iterations

    **MAD (Median Absolute Deviation)**:

    - Robust measure of scale/variability
    - Formula: `MAD = median(|x - median(x)|)`
    - More resistant to outliers than standard deviation
    - Used to standardize residuals for anomaly detection

    **Panel regression (`fixest::feols`)**:

    - Fixed-effects estimation with clustered standard errors
    - Accounts for within-group correlation in errors
    - More efficient than traditional panel regression packages
    - Handles unbalanced panels gracefully

    **Geographic clustering**:

    - Regressions use clustered standard errors at the lowest available geographic level
    - This accounts for within-area correlation in service delivery patterns
    - Example: Country-wide model clusters by district, province model clusters by district
    - Prevents underestimation of standard errors and false positives

### Detailed analysis steps

??? "Part 1: Control chart analysis"

    #### Step 1: Prepare the Data

    - Load adjusted service volumes from `M2_adjusted_data.csv`.
    - Load outlier flags from `M1_output_outliers.csv`.
    - Load raw HMIS only to extract `facility_id → admin_area_1` lookup (then discard).
    - Merge outlier flags into adjusted data by facility × indicator × month.
    - Remove rows flagged as outliers (`outlier_flag == 1`).
    - Create a `date` variable from `period_id` and extract `year` and `month`.
    - Create a unique `panelvar` for each geographic area-indicator combination.
    - Aggregate data to the specified geographic level by summing `count_model` (based on `SELECTEDCOUNT`) by date.
    - Fill in missing months within each panel to ensure continuity.
    - Fill missing metadata using forward and backward fill.

    #### Step 2: Filter Out Low-Volume Months

    - Compute the global mean service volume for each `panelvar`.
    - If `count_original` is <50% of the global mean, drop the value by setting it to `NA`.

    #### Step 3: Apply Regression and Smoothing

    Estimate expected service volume using robust regression, then smooth the predicted trend.

    - Fit robust regression (`rlm`) for each panel using one of three model specifications based on data availability.
    - Apply rolling median smoothing to predictions using window size `SMOOTH_K`.
    - If smoothing is not possible (e.g., at series edges), fallback to model predictions.
    - Calculate residuals: actual - smoothed
    - Standardize residuals using MAD

    This standardized control variable is used to detect anomalies in Step 4.

    #### Step 4: Tag Disruptions

    Apply rule-based tagging to identify potential disruptions. Each rule is governed by user-defined parameters that can be tuned for sensitivity:

    - **Sharp disruptions**: Tag if `|robust_control| ≥ MADS_THRESHOLD`
    - **Sustained drops**: Tag if 3 consecutive months have mild deviations (residual ≥ 1 but < MADS_THRESHOLD) and current month has residual ≥ 1.5
    - **Sustained dips**: Tag entire sequence if `count_original < DIP_THRESHOLD × count_smooth` for 3+ months
    - **Sustained rises**: Tag entire sequence if `count_original > RISE_THRESHOLD × count_smooth` for 3+ months
    - **Missing data**: Tag if 2+ of past 3 months are missing or zero
    - **Recent tail override**: Automatically tag all months in last 6 months of data

    A month is assigned `tagged = 1` if any of the above conditions are met. Tagged records are saved in `M3_chartout.csv` and passed to the disruption analysis.

??? "Part 2: Disruption analysis"

    #### Step 1: Data Preparation

    - The `M3_chartout` dataset is merged with the main dataset to integrate the `tagged` variable, which identifies flagged disruptions.
    - The lowest available geographic level (`lowest_geo_level`) is identified for clustering, based on the highest-resolution `admin_area_*` column available.

    #### Step 2: National-Level Regression

    For each `indicator_common_id`, estimate the national-level model with errors clustered at district level.

    - A panel regression model is applied at the country-wide level, estimating the expected service volume (`expect_admin_area_1`) for each indicator.
    - The model controls for long-term trends and seasonal patterns in service utilization.
    - When a disruption (`tagged = 1`) is identified, predicted service volumes are adjusted by removing the estimated disruption effect to isolate its impact.
    
    #### Step 3: Intermediate Subnational-Level Regression

    For each `indicator_common_id` × `admin_area_2` combination, subnational models are estimated, with standard errors clustered at a lower administrative level.

    - A fixed-effects panel regression model is applied at an intermediate subnational level, estimating expected service volumes (`expect_admin_area_2`) while accounting for time-invariant geographic characteristics.
    - The model controls for historical trends and seasonality.
    - When a disruption is identified, predicted volumes are adjusted to isolate the disruption effect.

    #### Step 4: Fine Subnational-Level Regression (if enabled)

    For each `indicator_common_id` × `admin_area_3` combination, subnational models are estimated, with standard errors clustered at a finer administrative level.

    - A fixed-effects panel regression model is applied at a fine subnational level, estimating expected service volumes (`expect_admin_area_3`).
    - The model controls for historical trends and seasonality.
    - When a disruption is identified, predicted volumes are adjusted to isolate the disruption effect.

    #### Step 5: Prepare Outputs for Visualization

    Once expected values have been calculated for each level (country, province, district), the pipeline compares predicted and actual values to assess the magnitude of disruption.

    For each month and indicator, the pipeline calculates:

    - **Absolute and percentage difference** between predicted and actual values:

    $$ \text{diff_percent} = 100 \times \frac{\text{predicted} - \text{actual}}{\text{predicted}} $$

    - A configurable threshold parameter `DIFFPERCENT` (default: `10`) is used to determine when a disruption is significant.

        If the percentage difference exceeds ±10%, the expected (predicted) value is retained and used for plotting and summary statistics. Otherwise, the actual observed value is used.

        This ensures that minor fluctuations do not lead to artificial disruptions in the visualization, while meaningful deviations are preserved.

    - The final adjusted value for plotting is stored in a field such as `count_expected_if_above_diff_threshold`.

        This value reflects either:
        - The predicted count (if deviation > threshold), or
        - The actual count (if within acceptable range).

    This logic is applied consistently across all admin levels. These adjusted values are then exported as part of the final output files for each level.


### Code examples

??? "Example 1: Running the module with default settings"

    ```r
    # Set working directory
    setwd("/path/to/module/directory")

    # Load required libraries
    library(data.table)
    library(lubridate)
    library(zoo)
    library(MASS)
    library(fixest)
    library(stringr)
    library(dplyr)
    library(tidyr)

    # Configure country
    COUNTRY_ISO3 <- "SLE"
    PROJECT_DATA_HMIS <- "hmis_SLE.csv"

    # Use default settings (admin_area_2 level analysis)
    RUN_DISTRICT_MODEL <- FALSE
    RUN_ADMIN_AREA_4_ANALYSIS <- FALSE

    # Run the module
    source("03_module_service_utilization.R")
    ```

    With default settings, the module runs control chart analysis at admin_area_2 level and produces disruption estimates for national and regional levels.

??? "Example 2: Adjusting disruption detection sensitivity"

    ```r
    # Make disruption detection more sensitive (lower thresholds)
    MADS_THRESHOLD <- 1.0        # Flag at 1 MAD (default: 1.5)
    DIP_THRESHOLD <- 0.95        # Flag if <95% of expected (default: 0.90)
    SMOOTH_K <- 5                # Smaller smoothing window (default: 7)

    # Make disruption detection less sensitive (higher thresholds)
    MADS_THRESHOLD <- 2.0        # Flag only at 2 MADs
    DIP_THRESHOLD <- 0.80        # Flag only if <80% of expected
    SMOOTH_K <- 9                # Larger smoothing window

    source("03_module_service_utilization.R")
    ```

    **Use case**: Adjust sensitivity based on data quality. Noisier data may require less sensitive thresholds to avoid false positives.

??? "Example 3: Running district-level analysis"

    ```r
    # Enable district-level analysis (slower but more detailed)
    RUN_DISTRICT_MODEL <- TRUE
    RUN_ADMIN_AREA_4_ANALYSIS <- FALSE

    source("03_module_service_utilization.R")
    ```

    **Use case**: When district-level disruption patterns are needed for sub-national program planning.

    **Note**: District-level analysis increases runtime substantially. For large countries, consider running overnight.

??? "Example 4: Selecting adjustment scenario for analysis"

    ```r
    # Use unadjusted data for sensitivity analysis
    SELECTEDCOUNT <- "count_final_none"
    VISUALIZATIONCOUNT <- "count_final_none"

    # Use outlier-adjusted only
    SELECTEDCOUNT <- "count_final_outliers"
    VISUALIZATIONCOUNT <- "count_final_outliers"

    # Use fully adjusted data (default)
    SELECTEDCOUNT <- "count_final_both"
    VISUALIZATIONCOUNT <- "count_final_both"

    source("03_module_service_utilization.R")
    ```

    **Use case**: Compare disruption estimates across different data quality adjustment scenarios.

??? "Example 5: Memory optimization for large datasets"

    ```r
    # Reduce batch sizes for memory-constrained environments
    BATCH_SIZE_CC <- 50      # Control chart batches (default: 100)
    BATCH_SIZE_IND <- 3      # Indicator batches (default: 5)
    BATCH_SIZE_PROV <- 10    # Province batches (default: 20)
    BATCH_SIZE_DIST <- 10    # District batches (default: 15)

    # Disable memory-intensive analyses
    RUN_DISTRICT_MODEL <- FALSE
    RUN_ADMIN_AREA_4_ANALYSIS <- FALSE

    source("03_module_service_utilization.R")
    ```

    **Use case**: Running on machines with limited RAM (<8GB).

??? "Example 6: Programmatic use of outputs"

    ```r
    # Load disruption analysis outputs
    disruptions_national <- read.csv("M3_disruptions_analysis_admin_area_1.csv")
    shortfalls_national <- read.csv("M3_all_indicators_shortfalls_admin_area_1.csv")

    # Calculate total service shortfall by indicator
    annual_shortfalls <- shortfalls_national %>%
      mutate(year = period_id %/% 100) %>%
      group_by(indicator_common_id, year) %>%
      summarise(
        total_expected = sum(count_expect_sum, na.rm = TRUE),
        total_actual = sum(count_sum, na.rm = TRUE),
        total_shortfall = sum(shortfall_absolute, na.rm = TRUE),
        avg_shortfall_pct = mean(shortfall_percent, na.rm = TRUE),
        .groups = "drop"
      )

    # Identify months with largest disruptions
    worst_months <- shortfalls_national %>%
      filter(shortfall_percent > 10) %>%
      arrange(desc(shortfall_percent)) %>%
      head(20)

    # Load control chart results for detailed analysis
    control_chart <- read.csv("M3_chartout.csv")

    # Count tagged periods by indicator
    tagged_summary <- control_chart %>%
      group_by(indicator_common_id) %>%
      summarise(
        total_periods = n(),
        tagged_periods = sum(tagged, na.rm = TRUE),
        pct_tagged = 100 * tagged_periods / total_periods,
        .groups = "drop"
      )
    ```


### Troubleshooting

??? "Common issues and solutions"

    #### Issue: Script crashes with "out of memory" error

    **Solutions**:

    - Reduce batch sizes (e.g., `BATCH_SIZE_IND <- 3`)
    - Set `RUN_DISTRICT_MODEL <- FALSE`
    - Set `RUN_ADMIN_AREA_4_ANALYSIS <- FALSE`
    - Close other applications
    - Run on machine with more RAM

    ---

    #### Issue: Warning "model failed to converge"

    **Explanation**: Robust regression didn't fully converge within 100 iterations

    **Impact**: Usually minimal - partial convergence often sufficient

    **Solutions**:

    - Check data quality for that panel
    - Increase `maxit` parameter in `rlm()` call (line 229, 247)
    - Generally safe to ignore if only a few panels affected

    ---

    #### Issue: Many empty rows in output files

    **Explanation**: Insufficient data for certain indicator-geography combinations

    **Solutions**:

    - Expected behavior for sparse indicators
    - Filter outputs to non-missing values
    - Consider aggregating to higher geographic level

    ---

    #### Issue: All recent months flagged as disruptions

    **Explanation**: Automatic flagging of last 6 months

    **Purpose**: Ensures recent trends reviewed even without strong statistical evidence

    **Solutions**:

    - Expected behavior, not a bug
    - Review recent months manually
    - Adjust `last_6_months` logic if needed (line 333)

    ---

    #### Issue: `tagged` variable dropped from regression

    **Message**: Variable automatically set to 0

    **Explanation**: No variation in `tagged` within that panel (all 0 or all 1)

    **Solutions**:

    - Expected in panels with no disruptions or constant disruption
    - Not an error - disruption effect correctly set to 0

    ---

    #### Issue: Temporary files remain after run

    **Cause**: Script crashed before cleanup

    **Solutions**:

    - Delete manually: `M3_temp_*.csv`
    - Or re-run script (automatic cleanup at start)

    ---

    #### Issue: Very different results at different geographic levels

    **Explanation**: Different geographic aggregation captures different patterns

    **Example**: National trend may be stable while some districts have large disruptions

    **Solutions**:

    - Expected behavior - not a bug
    - Use appropriate level for your research question
    - Cross-check patterns across levels for robustness

### Usage notes

??? "Interpretation guidelines"

    **Disruption effects (b_admin_area_*)**:

    - Negative values indicate service volume shortfalls during disrupted periods
    - Positive values indicate service volume surpluses during disrupted periods
    - Values closer to zero indicate smaller disruption impacts

    **P-values (p_admin_area_*)**:

    - Values < 0.05 suggest statistically significant disruptions
    - Values > 0.05 may indicate normal variation rather than true disruptions

    **Trend coefficients (b_trend_admin_area_*)**:

    - Positive values indicate increasing service utilization over time
    - Negative values indicate declining service utilization over time
    - Values near zero indicate stable utilization patterns

    ### Performance Considerations

    **Runtime factors**:

    - **Number of indicators**: Linear scaling
    - **Number of geographic units**: Linear scaling within each level
    - **Time series length**: Minimal impact (efficient regression)
    - **Geographic detail**: Exponential scaling (many more units at finer levels)

    **Estimated runtimes** (example dataset: 50 indicators, 100 districts):

    - Country-wide + Province models: ~5-10 minutes
    - Add District models: ~30-60 minutes
    - Add Ward models: Several hours (depends on number of wards)

    **Optimization strategies**:

    - Set `RUN_DISTRICT_MODEL = FALSE` for faster execution (skips district level)
    - Set `RUN_ADMIN_AREA_4_ANALYSIS = FALSE` (default) to avoid ward-level analysis
    - Reduce `SMOOTH_K` for faster rolling median calculation
    - Use `SELECTEDCOUNT = "count_final_none"` to avoid completeness adjustments

    ### Data Processing Details

    **Memory management**:

    - Uses `data.table` for efficient operations on large datasets
    - Batch processing: Results saved to disk periodically
    - Progressive cleanup: Objects deleted when no longer needed
    - Temporary files enable processing datasets larger than RAM

    **Batch sizes** (tunable for memory constraints):

    - Control chart: 100 panels per batch
    - Indicators: 5 indicators per batch
    - Provinces: 20 results per batch
    - Districts: 15 results per batch
    - Admin area 4: 10 results per batch

    **Missing data handling**:

    1. Missing months filled via `tidyr::complete()`
    2. Forward/backward fill for metadata
    3. Linear interpolation (`zoo::na.approx`) for count values
    4. Maximum gap: Unlimited (rule = 2 extends endpoints)

    ### Model Fallback Logic

    The control chart analysis uses adaptive model selection based on data availability:

    **Full model** (requires ≥12 obs AND >12 unique dates):

    ```r
    count ~ month_factor + as.numeric(date)
    ```

    Accounts for both seasonality and linear trend

    **Trend-Only Model** (requires ≥12 obs):

    ```r
    count ~ as.numeric(date)
    ```

    Accounts for linear trend only (insufficient data for seasonality)

    **Median fallback** (<12 observations):

    ```r
    count_predict = median(count)
    ```

    Uses global median when insufficient data for regression

    **Convergence checks**:

    - Models checked for convergence status
    - Warnings issued for non-convergent models
    - Non-convergent models still used (partial convergence often sufficient)

    ### Quality Assurance

    **Data cleaning**:

    - Outliers removed prior to control chart analysis (based on Module 1 flags)
    - Low-volume months (<50% of mean) excluded to improve model stability
    - Predictions bounded at zero (counts cannot be negative)

    **Automatic flagging**:

    - Recent months (last 6 months) automatically flagged to ensure current disruptions captured
    - Prevents missing ongoing disruptions due to insufficient deviation from trend

    **Robustness checks**:

    - Model coefficients checked for `NA` values before use
    - If `tagged` variable dropped from model (no variation), disruption effect set to 0
    - P-values calculated only when valid standard errors available

    **Edge case handling**:

    - Single-cluster panels: No clustering applied (would fail)
    - Insufficient data: Skip analysis for that panel/level
    - Missing predictions: Filled with original values where possible

    ### Workflow Integration

    This module is **Module 3** in the FASTR analytical pipeline:

    **Prerequisites**:

    1. **Module 1**: Data Quality Assessment (generates `M1_output_outliers.csv`)
    2. **Module 2**: Data Quality Adjustments (generates `M2_adjusted_data.csv`)

    ### Dependencies

    **R Packages Required**:

    - `data.table`: Efficient data manipulation
    - `lubridate`: Date handling
    - `zoo`: Rolling statistics and interpolation
    - `MASS`: Robust regression (rlm)
    - `fixest`: Fixed-effects panel regression
    - `dplyr`: Data manipulation
    - `tidyr`: Data tidying


---

**Last updated**: 17-01-2026
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

<!-- SLIDE:m6_1 -->
## Service utilization analysis

Analysis of health service delivery patterns to detect and quantify changes in service volumes over time.

---

## Objectives

**1. Measure changes in service volume**

Year-over-year comparison of service volumes identifies increases or decreases across regions and indicators.

**2. Detect and quantify disruptions**

Statistical comparison of observed volumes against expected levels—derived from historical trends and seasonal patterns—enables identification and quantification of service shortfalls or surpluses.
<!-- /SLIDE -->

<!-- SLIDE:m6_2 -->
## Year-over-year change

**Year-over-year percent change** quantifies shifts in service delivery between consecutive years.

For each indicator and region, total volume in the current year is compared to the previous year:

$$\text{Percent change} = \frac{\text{Current year} - \text{Previous year}}{\text{Previous year}} \times 100$$

Changes exceeding **±10%** are flagged for review.

---

## Output: Change in service volume

![Change in service volume](resources/default_outputs/Module3_1_Change_in_service_volume.png)

---

## Interpretation

| Element | Description |
|---------|-------------|
| **Bars** | Annual service volumes by region |
| **Percentages** | Year-over-year change annotations |

**Key considerations:**
- Which regions exhibit the largest changes?
- Are changes consistent across regions or geographically concentrated?
- Do patterns vary by indicator?
<!-- /SLIDE -->

<!-- SLIDE:m6_3 -->
## Disruption detection

The analysis identifies periods where service delivery deviates significantly from expected levels using a two-stage approach:

| Stage | Method | Purpose |
|-------|--------|---------|
| **1. Control chart analysis** | Statistical process control | Identify when disruptions occur |
| **2. Regression analysis** | Panel regression models | Quantify disruption magnitude |

---

## Expected service volume

Expected volume is modeled using two components:

| Component | Description |
|-----------|-------------|
| **Trend** | Long-term direction (increasing, decreasing, or stable) |
| **Seasonality** | Predictable monthly patterns (e.g., increased malaria cases during rainy season) |

The model estimates expected volume for each month based on historical patterns. Significant deviations from expected values are flagged as potential disruptions.

---

## Shortfalls and surpluses

<div class="columns">
<div>

| Comparison | Interpretation |
|------------|----------------|
| **Actual = Expected** | Services delivered as anticipated |
| **Actual < Expected** | Shortfall: fewer services than expected |
| **Actual > Expected** | Surplus: more services than expected |

Surpluses may indicate catch-up campaigns, outreach activities, or reporting changes.

</div>
<div>

![Actual vs expected national](resources/default_outputs/Module3_2_Actual_vs_expected_national.png)

</div>
</div>

---

## Chart interpretation

| Element | Description |
|---------|-------------|
| **Black line** | Actual (observed) service volumes |
| **Red shaded areas** | Shortfall periods (actual below expected) |
| **Green shaded areas** | Surplus periods (actual above expected) |

The magnitude of the shaded area corresponds to the scale of the disruption.
<!-- /SLIDE -->

<!-- SLIDE:m6_4 -->
## Output: Actual vs expected (national)

![Actual vs expected national](resources/default_outputs/Module3_2_Actual_vs_expected_national.png)

National-level comparison of observed service volumes against expected values derived from historical trends and seasonal patterns.

---

## Output: Actual vs expected (subnational)

![Actual vs expected subnational](resources/default_outputs/Module3_3_Actual_vs_expected_subnational.png)

Subnational disaggregation enables identification of geographic areas where disruptions are concentrated.
<!-- /SLIDE -->

<!-- SLIDE:m6_5 -->
## Data quality adjustment scenarios

The analysis supports four data versions to assess sensitivity to adjustment assumptions:

| Scenario | Description |
|----------|-------------|
| **No adjustment** | Raw reported values |
| **Outlier adjustment** | Extreme values corrected |
| **Completeness adjustment** | Adjusted for missing facility reports |
| **Both adjustments** | Outlier and completeness adjustments applied |

---

## Output: Volume by adjustment scenario

![Volume change due to adjustments](resources/default_outputs/Module3_4_Volume_change_adjustments.png)

---

## Rationale for scenario comparison

Comparison across adjustment scenarios addresses three questions:

| Question | Implication |
|----------|-------------|
| Do adjustments substantially change results? | If results are similar across scenarios, findings are robust |
| Which adjustment has greater impact? | Identifies whether completeness or outlier correction drives differences |
| Are conclusions sensitive to assumptions? | Informs confidence in interpretation |
<!-- /SLIDE -->

<!-- SLIDE:m6_5a -->
## Service utilization: Configuration parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `SELECTEDCOUNT` | count_final_both | Data column used for analysis |
| `SMOOTH_K` | 7 | Rolling median window size (must be odd) |
| `MADS_THRESHOLD` | 1.5 | MAD threshold for sharp disruption detection |
| `DIP_THRESHOLD` | 0.90 | Flag periods below 90% of expected volume |
| `DIFFPERCENT` | 10 | Percentage threshold for visualization |
| `RUN_DISTRICT_MODEL` | FALSE | Enable district-level regression analysis |
| `RUN_ADMIN_AREA_4_ANALYSIS` | FALSE | Enable ward-level analysis |

---

## Tuning sensitivity

| Objective | Adjustment |
|-----------|------------|
| **More sensitive detection** | Lower `MADS_THRESHOLD` to 1.0; set `DIP_THRESHOLD` to 0.95; reduce `SMOOTH_K` to 5 |
| **Less sensitive detection** | Increase `MADS_THRESHOLD` to 2.0; set `DIP_THRESHOLD` to 0.80; increase `SMOOTH_K` to 9 or 11 |
| **Faster runtime** | Set `RUN_DISTRICT_MODEL` and `RUN_ADMIN_AREA_4_ANALYSIS` to FALSE |
| **Detailed subnational analysis** | Set `RUN_DISTRICT_MODEL` to TRUE (slower) |
<!-- /SLIDE -->
