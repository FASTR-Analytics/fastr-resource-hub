---
marp: true
theme: fastr
paginate: true
---

## Putting it all together: Overall data quality

---

## Overall quality score

**For each facility and month, we combine all three checks:**

1. **Complete:** Did the facility report?
2. **No outliers:** Are the numbers reasonable?
3. **Consistent:** Do related numbers make sense?

**Binary DQA Score:**
- dqa_score = 1 if ALL three checks pass
- dqa_score = 0 if ANY check fails

**DQA Mean:** Average of completeness-outlier score and consistency score

**This helps us:**
- Decide which data to use for analysis
- Identify facilities needing support

---

## Overall DQA score: FASTR output

![Overall DQA Score](../../resources/default_outputs/Default_5._Overall_DQA_score.png)

---

## Mean DQA score: FASTR output

![Mean DQA Score](../../resources/default_outputs/Default_6._Mean_DQA_score.png)
