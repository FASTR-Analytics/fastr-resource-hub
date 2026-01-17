---
marp: true
theme: fastr
paginate: true
---

## Calculating the overall quality score

**The composite score integrates all three data quality dimensions:**

1. **Completeness:** Did the facility submit a report?
2. **Outlier status:** Are reported values within plausible ranges?
3. **Consistency:** Do related indicators demonstrate expected relationships?

**Binary DQA score:**
- Score = 1 if all three criteria are satisfied
- Score = 0 if any criterion is not met

**Mean DQA score:** Weighted average of completeness-outlier score and consistency score

**Applications:**
- Inform decisions regarding data inclusion in analyses
- Identify facilities requiring targeted data quality support

---

## Overall DQA score: FASTR output

![Overall DQA Score](../../resources/default_outputs/Default_5._Overall_DQA_score.png)

---

## Mean DQA score: FASTR output

![Mean DQA Score](../../resources/default_outputs/Default_6._Mean_DQA_score.png)
