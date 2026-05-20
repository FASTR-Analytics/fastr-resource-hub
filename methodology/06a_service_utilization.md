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
| **Inputs** | Adjusted service volumes from Module 2 (`M2_adjusted_data.csv` and `M2_adjusted_data_admin_area.csv`)<br>Outlier flags from Module 1 (`M1_output_outliers.csv`)<br>Raw HMIS (`hmis_ISO3.csv`) - only for `facility_id` to `admin_area_1` lookup |
| **Outputs** | Pass-through adjusted data (`M3_service_utilization.csv`)<br>Disruption flags (`M3_chartout.csv`)<br>Quantified impacts by geographic level (`M3_disruptions_analysis_admin_area_1` to `_4.csv`)<br>Shortfall/surplus summaries (`M3_all_indicators_shortfalls_admin_area_1` to `_4.csv`) |
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
    | `SELECTEDCOUNT` | "count_final_outliers" | String | Data column used for regression modelling | Options: `count_final_none`, `count_final_outliers`, `count_final_completeness`, `count_final_both` |
    | `VISUALIZATIONCOUNT` | "count_final_outliers" | String | Data column used for visualization | Same options as `SELECTEDCOUNT`; can differ if you want to model on one and plot another |

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
       - Required columns: `facility_id`, `indicator_common_id`, `period_id`, `count_final_none`, `count_final_outliers`, `count_final_completeness`, `count_final_both`

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

    Single regression across all facilities, with standard errors clustered at district level (`admin_area_3`) when more than one district is available; otherwise unclustered.

    **Province-level Models** (Admin Area 2):

    ```r
    count ~ date + factor(month) + tagged
    ```

    Separate regression run for each province, with standard errors clustered at district level when more than one district is available; otherwise unclustered.

    **District-level Models** (Admin Area 3 - optional):

    ```r
    count ~ date + factor(month) + tagged
    ```

    Separate regression run for each district (minimum 10 observations required), with standard errors clustered at ward level (`admin_area_4`) when more than one ward is available; otherwise unclustered.

    **Ward-level Models** (Admin Area 4 - optional):

    ```r
    count ~ date + factor(month) + tagged
    ```

    Separate regression run for each ward/finest unit (minimum 8 observations required, no clustering).

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

    #### Step 4: Fine Subnational-Level Regression (if `RUN_DISTRICT_MODEL = TRUE`)

    For each `indicator_common_id` × `admin_area_3` combination, subnational models are estimated, with standard errors clustered at the ward level (`admin_area_4`) when more than one ward is available.

    - A fixed-effects panel regression model is applied at a fine subnational level, estimating expected service volumes (`expect_admin_area_3`).
    - Panels with fewer than 10 observations are skipped.
    - The model controls for historical trends and seasonality.
    - When a disruption is identified, predicted volumes are adjusted to isolate the disruption effect.

    #### Step 5: Ward-Level Regression (if `RUN_ADMIN_AREA_4_ANALYSIS = TRUE`)

    For each `indicator_common_id` × `admin_area_4` combination, ward-level models are estimated without clustering.

    - A panel regression model is applied at the finest geographic level, estimating expected service volumes (`expect_admin_area_4`).
    - Panels with fewer than 8 observations are skipped.
    - The model controls for historical trends and seasonality.
    - When a disruption is identified, predicted volumes are adjusted to isolate the disruption effect.

    #### Step 6: Prepare Outputs for Visualization

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

??? "Choosing which outputs to review"

    **For quick overviews**:

    - Start with year-over-year heatmaps to identify areas/indicators with notable changes
    - Use control charts for indicators with suspected disruptions
    - Focus on high-volume indicators where patterns are more reliable

    **For subnational analysis**:

    - Province-level provides reliable patterns with sufficient data volume
    - District-level useful for identifying local issues but patterns may be noisier
    - Cross-check district patterns against provincial trends for consistency

    **For time-based analysis**:

    - Recent periods (last 6 months) may show preliminary patterns that could change
    - Look for sustained changes (3+ consecutive months) rather than single-month spikes
    - Consider known events (policy changes, campaigns, strikes) when interpreting

??? "Limitations"

    **Statistical limitations**:

    - Disruption detection works best with 2+ years of historical data
    - Low-volume indicators may show high percentage changes from small absolute changes
    - Seasonal patterns require at least 12 months of data to model accurately

    **Interpretation caveats**:

    - Detected disruptions require contextual investigation (not all are problematic)
    - Positive disruptions (surpluses) may reflect campaigns, catch-up, or data issues
    - Geographic patterns affected by facility distribution and reporting rates

    **Data requirements**:

    - Results depend on quality of completeness and outlier adjustments from earlier modules
    - Missing geographic identifiers will reduce coverage of subnational analysis

### Quarter-on-quarter change

In addition to year-over-year comparisons, FASTR generates quarter-on-quarter (QoQ) change metrics that compare the current quarter to the previous quarter. QoQ change is calculated as: (current quarter – previous quarter) / previous quarter × 100. Changes exceeding ±10% are flagged for follow-up investigation to determine whether they reflect a real programmatic change, a data quality issue, or an expected event (such as a campaign). This metric complements the year-over-year view by capturing more recent shifts in service delivery.

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

Service utilization analysis measures changes in health service volumes over time. By comparing service delivery across consecutive years, this analysis identifies increases or decreases in utilization patterns across regions and indicators.

The primary metric is **year-over-year percent change**, which quantifies shifts in service delivery between consecutive years. The formula calculates the difference between current and previous year volumes, expressed as a percentage of the previous year. Changes exceeding ±10% are flagged for review, as these typically represent meaningful shifts in service delivery rather than normal variation.

---

## Service utilization comparison to DHIS2

Service utilization trends are commonly produced in DHIS2. The FASTR approach differs in three important ways:

- Adjusts for data quality (outliers and/or completeness)
- Visualizes data with the percent change approach to make it easier to identify meaningful fluctuations in service delivery
- Looks at trends, but also uses the adjusted service utilization data for additional, more complex analyses
<!-- /SLIDE -->

<!-- SLIDE:m6_1a -->
## Service utilization and disruptions: comparison to DHIS2

Service utilization trends are commonly produced in DHIS2

**Main differences between DHIS2 and FASTR approach**

- FASTR approach adjusts for data quality (outliers and/or completeness)
- FASTR approach visualizes data with the percent change approach to make it easier to identify meaningful fluctuations in service delivery

**Extension of service utilization analysis**, using more complex statistical approaches not available in DHIS2

Using a regression framework, we are able to:

- Account for seasonality
- Exclude unusual changes to ensure one-off events aren't influencing normal trends
- Use historical data as a baseline for context
- Detect disruptions and recovery patterns
- Quantify changes with a robust methodology as compared to just observing simple fluctuations in a trend line.

This improves the ability to interpret and compare 'count' or utilization data national and sub-national areas without needing population denominators.
<!-- /SLIDE -->

<!-- SLIDE:m6_2 -->
## Service disruptions and surpluses detection

The FASTR approach to detecting service disruptions and surpluses uses **interrupted time series (ITS) regression** with facility-level fixed effects. This statistical framework allows for more meaningful interpretation and comparison of count data across subnational areas, enabling insights that raw data alone cannot provide.

By focusing on meaningful changes and trends rather than raw numbers, this approach supports more accurate and comparable analysis. Previous large and unexpected changes in historical data are removed to establish a clean baseline. Unexpected volume changes are then estimated by comparing observed volumes to expected volumes based on historical trends and seasonality.

---

## How disruption detection works

<div style="display: flex; gap: 1em; align-items: flex-start;">
<div style="flex: 1; font-size: 0.85em;">

The analysis proceeds through four steps. First, we **use past data to set expectations** by examining several years of historical data to understand the typical pattern for each month, accounting for regular seasonal changes.

Second, we **spot unusual changes** by comparing current service volumes to these expectations. Volumes that are much higher or lower than expected are flagged as unusual changes requiring investigation.

Third, we **handle past disruptions** by adjusting historical data to remove previous large, unexpected changes. This ensures that one-off events do not skew our understanding of what constitutes "normal" service delivery.

Fourth, we **detect disruptions over time** by examining trends to identify clear shifts in health service use over several months, distinguishing between temporary fluctuations and sustained changes.

</div>
<div style="flex: 1;">

![Disruption detection](resources/diagrams/disruption_chart.png)

</div>
</div>

<!--
PRESENTER NOTES:
1. Using past data to set expectations: We start by looking at the past few years of health service data to understand the typical pattern for each month. For example, if we see that certain services usually have higher or lower volumes during particular months, we use that pattern to help set "normal" expectations for each month going forward. This step helps us account for regular seasonal changes, like an increase in flu-related visits during winter months.
2. Spotting unusual changes: Once we know what "normal" looks like, we can compare current service volumes to those expectations. If we see that the number of people using a particular health service is much higher or lower than expected, we flag it as an unusual change. This could be due to factors like an epidemic, a natural disaster, or even changes in healthcare policy.
3. Handling past disruptions: To keep our analysis accurate, we adjust our historical data by removing previous big, unexpected changes. This makes sure that one-off events from the past don't skew our understanding of what's "normal" today.
4. Detecting disruptions over time: Finally, we look at trends over time to see if there are clear shifts in health service use. For example, if there's a drop in routine vaccinations over several months, we can identify that as a longer-term disruption. By monitoring these trends, we get a better sense of whether changes are just seasonal or might be due to larger, lasting issues that need attention.
-->

---

## Disruption detection comparison to DHIS2

Disruption detection extends service utilization analysis using statistical approaches not available in DHIS2. The regression framework enables several capabilities that improve upon simple trend visualization.

The model **accounts for seasonality** when calculating expected values, ensuring that seasonal patterns are not mistaken for disruptions. It **excludes unusual historical changes** so that one-off events do not influence the baseline. **Historical data serves as context** for establishing expected service levels, and the framework systematically **detects both disruptions and recovery patterns**.

Most importantly, this approach **quantifies changes with a robust methodology** rather than relying on visual observation of trend fluctuations. This improves the ability to interpret and compare utilization data across national and subnational areas **without requiring population denominators**.
<!-- /SLIDE -->

<!-- SLIDE:m6_5a -->
## Service utilization module: Configuration parameters

**Note:** These parameters apply only to the disruption analysis. Year-over-year service utilization analysis does not require configuration.

<div style="font-size: 0.8em;">

| Parameter | Description |
|-----------|-------------|
| **Count variable to use for modeling** | Which adjusted count to use for calculating expected values |
| **Count variable to use for visualization** | Which adjusted count to use as actual observed values |
| **Run district-level model** | Run regressions at admin_area_3 level. Set to Yes for detailed analysis, No for faster runtime |
| **Run admin_area_4 analysis** | Run finest-level analysis. Warning: can be very slow for large datasets |
| **Threshold for MAD-based control limits** | Number of MADs to flag sharp deviations. Default 1.5; higher = less sensitive |
| **Smoothing window (k)** | Window size in months for rolling median smoothing. Must be odd. Default 7 |
| **Dip threshold** | Flag if actual falls below this proportion of expected. Default 0.9 (≥10% drop); use 0.8 to flag only big drops |
| **Difference percent threshold** | Highlight points where actual differs from expected by more than this percent. Default 10 |

</div>

<!--
PRESENTER NOTES:
- These parameters control sensitivity of disruption detection
- MAD threshold: lower = more sensitive (more flags), higher = more conservative
- Smoothing window: larger = smoother trends, smaller = captures rapid changes
- Dip threshold: 0.9 means flag if <90% of expected (10% drop)
- District-level analysis is optional - increases computation time significantly
- Count variable selection: use "both" for most analyses (outlier + completeness adjusted)
- Parameters can be tuned based on country context and data quality
-->
<!-- /SLIDE -->

<!-- ═══════════════════════════════════════════════════════════════════════════
     CONDENSED SLIDES: Methods + Interpretation Combined
═══════════════════════════════════════════════════════════════════════════ -->

<!-- SLIDE:m6_s1 -->
## Service utilization analysis

Service utilization analysis tracks how many health services are being delivered over time, identifying trends, anomalies, and comparisons across areas.

<div style="display: flex; gap: 1em;">
<div style="flex: 1.2;">

![Number of services reported h:300](resources/default_outputs/Module3_5_Number_of_services_reported.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**What you see:** Line chart showing absolute service volumes over time by indicator.

**What it shows:** Count of services delivered each month/quarter.

**Interpretation:** Look for overall trends (increasing/decreasing) and sudden drops or spikes that may need investigation.

</div>
</div>

---

## Year-over-year change output

<div style="display: flex; gap: 1em;">
<div style="flex: 1.2;">

![Change in service volume h:300](resources/default_outputs/Module3_1_Change_in_service_volume.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**What you see:** Heatmap comparing current period to same period last year, with changes >±10% flagged.

**Formula:** YoY change % = (this year - last year) / last year × 100

**Interpretation:** Flagged changes require follow-up - is this a real program change, data issue, or expected event?

</div>
</div>

<!--
PRESENTER NOTES:
- Condensed version combining service trends and YoY comparison
- First chart shows absolute volumes - identify overall patterns
- Second chart shows relative changes - easier to compare across indicators
- YoY changes >±10% are flagged - but threshold is configurable
- For flagged changes, ask: data quality issue, real program change, or external event?
- These outputs don't require population denominators - useful when denominators uncertain
-->
<!-- /SLIDE -->

<!-- SLIDE:m6_s1a -->
## Quarter-on-quarter change

<div style="display: flex; gap: 1em;">
<div style="flex: 1.2;">

![Quarter-on-quarter change h:300](resources/default_outputs/Module3_QoQ_change.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**What you see:** Heatmap comparing current quarter to the previous quarter, with changes >±10% flagged.

**Formula:** QoQ change % = (current quarter – previous quarter) / previous quarter × 100

**Interpretation:** Flagged changes require follow-up — is this a real program change, data issue, or expected event?

</div>
</div>

<!--
PRESENTER NOTES:
- QoQ changes >±10% are flagged — but threshold is configurable
- For flagged changes, ask: data quality issue, real program change, or external event?
- These outputs don't require population denominators — useful when denominators uncertain
- Complementary to the year-over-year view: captures more recent changes
-->
<!-- /SLIDE -->

<!-- SLIDE:m6_s2 -->
## Detecting service disruptions

Beyond year-over-year comparisons, we want to know: **Is service delivery on track, or has something disrupted it?**

**The challenge:** Raw service counts are hard to interpret. A drop in services could be a real disruption, or just normal seasonal variation. Different areas have different baseline volumes, making direct comparison difficult.

**FASTR's solution:** Use statistical modeling to estimate what service volume we would *expect* based on historical trends and seasonality, then compare actual volume to this expectation.

- **Disruption:** Observed volume significantly below expected
- **Surplus:** Observed volume significantly above expected

---

## Service disruption output

<div style="display: flex; gap: 1em;">
<div style="flex: 1.2;">

![Disruption output h:300](resources/default_outputs/Module3_2_Actual_vs_expected_national.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**What you see:** Chart comparing actual service volume to model-predicted expected volume, accounting for seasonality.

**What it shows:** Deviations from expected - disruptions (below) or surpluses (above).

**Interpretation:** Consider external factors: COVID, strikes, stockouts, campaigns. Persistent deviations warrant program investigation.

</div>
</div>

<!--
PRESENTER NOTES:
- Condensed version focusing on disruption detection methodology
- Key insight: raw counts hard to interpret without context
- Statistical model provides "expected" baseline accounting for seasonality
- Disruption = sustained deviation below expected, not just a single bad month
- When interpreting disruptions, consider external factors: COVID, strikes, etc.
- Persistent deviations warrant deeper investigation into causes
- Can run at national, provincial, or district level depending on data quality
-->
<!-- /SLIDE -->

<!-- SLIDE:m6_s3 -->
## Why disruption analysis matters

FASTR is designed to support multiple country-defined policy questions. **Disruption analysis** is one key use case within the broader FASTR work program.

**Countries use disruption analysis to:**

- Monitor service continuity and recovery
- Identify geographic or service-specific vulnerabilities
- Inform prioritization, planning, and resource allocation
- Track whether services stabilize or catch up after shocks

**Entry points vary by country:**

- Some countries (Sierra Leone, Burkina Faso, Zambia) use disruptions as the primary entry point
- Others (Nigeria, Somalia) initiated FASTR for different priorities, with disruptions as complementary analysis
<!-- /SLIDE -->

<!-- SLIDE:m6_s4 -->
## National stability can mask subnational differences

**Key insight:** National-level trends may look stable while significant disruptions occur in specific regions.

<div style="display: flex; gap: 1em; font-size: 0.85em;">
<div style="flex: 1;">

**Burkina Faso example:**

- National outpatient visits appear stable
- But regional analysis reveals significant variation
- ANC1 and institutional deliveries show different patterns by region
- Subnational analysis essential for interpretation

</div>
<div style="flex: 1;">

**Sierra Leone example:**

- National Penta1 coverage stable
- But Western Area Urban and Bo District show disruptions
- Targeted follow-up needed in specific areas
- FASTR tracks whether services stabilize in subsequent quarters

</div>
</div>

**Implication:** Always examine subnational data before concluding services are stable.
<!-- /SLIDE -->

<!-- SLIDE:m6_s5 -->
## Country example: Nigeria

Nigeria's Federal Ministry of Health has adopted FASTR as a key tool for federal and state-level performance management of the primary health care system.

**Disruption detection in a polycrisis environment:**

- Quantified the impact of a health worker strike in the Federal Capital Territory
- Pinpointed BCG vaccination declines in seven states
- Tracked increased severe acute malnutrition admissions during a cholera outbreak in Zamfara state

**Routine monitoring use:**

- Quarterly RMNCAH+N performance monitoring assessments
- Tracking maternal health service uptake under the Nigeria Health Sector Renewal Initiative
- Comparing vaccine availability in facilities receiving direct financing vs those not covered

FASTR enables **timely identification** and **quick follow-up** across the country.
<!-- /SLIDE -->

<!-- SLIDE:m6_s6 -->
## Key takeaway

> "FASTR will not give you all the answers, but it can tell you **where to look**."

**What FASTR can do:**

- Analyze service use and coverage trends across subnational areas and over time
- Assess service readiness of PHCs and get timely feedback from facility managers
- Identify 'red flags' or signals that need prompt follow-up

**This data allows you to:**

- **Guide resources** to programs, services, or districts that are lagging
- **Make course corrections** when programs aren't achieving intended results
- **Identify positive deviants** to learn from
- **Understand root causes** by triangulating with other data sources
<!-- /SLIDE -->

