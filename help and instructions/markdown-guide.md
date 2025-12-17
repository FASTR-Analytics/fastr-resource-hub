# Marp Markdown Quick Reference Guide

A scannable cheat sheet for writing FASTR workshop slides using Marp markdown.

## What is a Slide?

A slide is content between slide breaks (`---`). Each `---` on its own line creates a new slide.

**Example:**
```markdown
---
# First Slide

This is the content of the first slide.

---

# Second Slide

This is the content of the second slide.
```

## Frontmatter (Required for Marp)

Every Marp presentation starts with frontmatter that configures the theme:

```markdown
---
marp: true
theme: fastr
paginate: true
---
```

**What it means:**
- `marp: true` - Enables Marp processing
- `theme: fastr` - Uses FASTR styling (teal colors, proper fonts)
- `paginate: true` - Shows slide numbers

**Important:** Frontmatter must be at the very top of your file!

## Headings

Headings create structure and hierarchy on your slides.

```markdown
# Slide Title (Level 1)

## Main Section (Level 2)

### Subsection (Level 3)
```

**Best practices:**
- Use `#` for slide titles (appears large and bold)
- Use `##` for main headings within a slide
- Use `###` for subsections
- Don't skip levels (don't jump from `#` to `###`)

**Example:**
```markdown
---

# Data Quality Assessment

## Three Key Steps

### 1. Completeness Check
### 2. Outlier Detection
### 3. Consistency Validation
```

## Slide Breaks

The `---` separator creates a new slide.

**Rules:**
- Must be on its own line
- Needs blank lines before and after (for clarity)
- Three dashes exactly (not 2, not 4)

**Correct:**
```markdown
# First Slide

Content here.

---

# Second Slide

More content.
```

**Incorrect:**
```markdown
# First Slide
---
# Second Slide (No blank lines - harder to read)
```

## Lists

### Bullet Lists

Use `-` for bullet points:

```markdown
- First item
- Second item
- Third item
  - Nested item (indent with 2 spaces)
  - Another nested item
```

**Renders as:**
- First item
- Second item
- Third item
  - Nested item
  - Another nested item

### Numbered Lists

Use `1.` for numbered lists:

```markdown
1. First step
2. Second step
3. Third step
```

**Auto-numbering trick:**
```markdown
1. First step
1. Second step
1. Third step
```
(Markdown will automatically number them correctly!)

## Text Formatting

```markdown
**Bold text** - Use for emphasis
*Italic text* - Use for subtle emphasis
***Bold and italic*** - Use sparingly

~~Strikethrough~~ - For corrections
`Inline code` - For variable names or commands
```

**Renders as:**
- **Bold text** - Use for emphasis
- *Italic text* - Use for subtle emphasis
- ***Bold and italic*** - Use sparingly
- ~~Strikethrough~~ - For corrections
- `Inline code` - For variable names or commands

## Code Blocks

### Inline Code

Use single backticks for inline code:

```markdown
Run `python3 build_deck.py` to build the deck.
```

### Code Blocks

Use triple backticks for multi-line code:

````markdown
```python
def hello_world():
    print("Hello, FASTR!")
```
````

**With language highlighting:**

````markdown
```bash
python3 tools/03_build_deck.py --workshop nigeria
marp outputs/nigeria_deck.md --theme-set fastr-theme.css --pdf
```
````

**Supported languages:** python, bash, javascript, json, yaml, r, and many more

## Images

### Basic Image Syntax

```markdown
![Description of image](path/to/image.png)
```

**Example:**
```markdown
![FASTR Approach](../assets/diagrams/FASTR_rapid_cycle_analytics_approach.svg)
![HMIS Data](../assets/screenshots/hmis-csv-required-fields.png)
```

### Image Paths

**For images in `assets/` folder:**
```markdown
![FASTR Approach](../assets/diagrams/FASTR_rapid_cycle_analytics_approach.svg)
```

**For images in workshop folder:**
```markdown
![Agenda](agenda.png)
![Nigeria Results](nigeria_results.png)
```

**Tips:**
- Use `../assets/` when referencing shared images
- Use `./` or just filename for workshop-specific images
- Use descriptive alt text (the part in `[]`)
- Supported formats: PNG, JPG, SVG, GIF

### Centering Images

Marp centers images by default on slides!

## Links

```markdown
[Link text](https://example.com)
[FASTR Website](https://www.globalfinancingfacility.org/fastr)
```

**Renders as:**
[FASTR Website](https://www.globalfinancingfacility.org/fastr)

## Tables

Tables help organize data:

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1    | Data     | Data     |
| Row 2    | Data     | Data     |
```

**Renders as:**

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1    | Data     | Data     |
| Row 2    | Data     | Data     |

**Alignment:**
```markdown
| Left | Center | Right |
|:-----|:------:|------:|
| L    | C      | R     |
```

- `:---` = Left aligned
- `:--:` = Center aligned
- `---:` = Right aligned

## Speaker Notes (Marp-Specific)

Add notes that appear in presenter view but not on slides:

```markdown
---

# My Slide Title

Content visible to audience.

<!--
These are speaker notes.
- Remind participants about the break
- Mention the hands-on exercise
- Reference additional resources
-->
```

**Important:** Speaker notes are inside `<!-- -->` comment blocks.

## Line Breaks and Spacing

### Single Line Break
Leave a blank line between paragraphs:

```markdown
First paragraph.

Second paragraph.
```

### Force Line Break
Use `<br>` for manual line breaks:

```markdown
Line one<br>Line two<br>Line three
```

### Add Extra Space
Use multiple `<br>` tags:

```markdown
# Title

<br>
<br>

Content with extra spacing above.
```

## Horizontal Rules

Create a horizontal line with three or more dashes (on a line without slide break context):

```markdown
---

# Slide Title

Some content here.

---

More content after a horizontal rule.
```

**Note:** Be careful - `---` creates slides! For horizontal lines inside a slide, use different syntax like `***` or `___`.

## Block Quotes

Emphasize important text:

```markdown
> This is a block quote.
> It can span multiple lines.
>
> And have multiple paragraphs.
```

**Renders as:**
> This is a block quote.
> It can span multiple lines.

## Good Slide Structure Examples

### Example 1: Title Slide
```markdown
---
marp: true
theme: fastr
paginate: true
---

# FASTR Workshop - Nigeria

**Date:** January 15-17, 2025
**Location:** Abuja, Nigeria
**Facilitators:** Dr. Smith, Dr. Jones

<!-- ![FASTR Logo](../assets/logos/fastr_logo.png) -->
<!-- Note: Add logo to assets/logos/ folder -->
```

### Example 2: Content Slide with Lists
```markdown
---

# Data Quality Assessment

## Three Key Steps

1. **Completeness Check**
   - Verify facility reporting rates
   - Identify missing data periods

2. **Outlier Detection**
   - Flag extreme values
   - Review unexpected changes

3. **Consistency Validation**
   - Cross-check related indicators
   - Verify mathematical relationships
```

### Example 3: Image-Heavy Slide
```markdown
---

# FASTR Workflow

![FASTR Process](../assets/diagrams/FASTR_rapid_cycle_analytics_approach.svg)

**Four main stages:** Data Extraction → Quality Assessment → Analysis → Insights
```

### Example 4: Mixed Content
```markdown
---

# Building Your First Deck

## Step-by-step process:

1. Create workshop folder:
   ```bash
   cp -r workshops/example workshops/2025_01_nigeria
   ```

2. Edit configuration in `config.py`

3. Build the deck:
   ```bash
   python3 tools/03_build_deck.py --workshop 2025_01_nigeria
   ```

**Output:** `outputs/2025_01_nigeria_deck.md`
```

## Common Mistakes to Avoid

### 1. Missing Blank Lines Around Slide Breaks
**Wrong:**
```markdown
# Slide 1
---
# Slide 2
```

**Right:**
```markdown
# Slide 1

---

# Slide 2
```

### 2. Forgetting Frontmatter
**Wrong:**
```markdown
# My Presentation
```

**Right:**
```markdown
---
marp: true
theme: fastr
paginate: true
---

# My Presentation
```

### 3. Incorrect Image Paths
**Wrong:**
```markdown
![Logo](assets/logo.png)  <!-- Missing ../ -->
![Diagram](../assets/old_file.png)  <!-- File moved to subfolder -->
```

**Right:**
```markdown
![Logo](../assets/logos/logo.png)  <!-- Use subfolder structure -->
![Diagram](../assets/diagrams/FASTR_rapid_cycle_analytics_approach.svg)
```

### 4. Too Much Content on One Slide
**Wrong:**
```markdown
---

# Everything About FASTR

FASTR is a framework... [3 paragraphs]

## Data Quality
[5 bullet points]

## Coverage Analysis
[4 bullet points]

## Facility Assessments
[6 bullet points]
```

**Right:** Break into multiple slides!
```markdown
---

# What is FASTR?

A data-driven framework for monitoring health services.

---

# FASTR Components

## Data Quality Assessment
## Coverage Analysis
## Facility Assessments

---

# Data Quality Assessment

- Completeness checks
- Outlier detection
- Consistency validation
```

### 5. Not Using Headings
**Wrong:**
```markdown
---

This slide has content but no structure...
```

**Right:**
```markdown
---

# Clear Slide Title

Well-organized content below.
```

## Quick Tips

1. **Keep slides simple** - One main idea per slide
2. **Use visuals** - Images explain better than walls of text
3. **Be consistent** - Use the same heading levels throughout
4. **Test your paths** - Always verify images load correctly
5. **Use speaker notes** - Add context you'll explain verbally
6. **Preview often** - Use VS Code Marp preview to see your slides
7. **Less is more** - Remove unnecessary text

## Testing Your Slides

### In VS Code:
1. Open your `.md` file
2. Click the Marp icon (top-right)
3. Preview opens in split view
4. Edit and watch live updates

### Building to PDF:
```bash
# Build the deck
python3 tools/03_build_deck.py --workshop your_workshop

# Render to PDF
marp outputs/your_workshop_deck.md --theme-set fastr-theme.css --pdf

# Open and review
open outputs/your_workshop_deck.pdf
```

## Need More Help?

- **Marp Documentation:** https://marpit.marp.app/markdown
- **Markdown Guide:** https://www.markdownguide.org/
- **FASTR Theme:** See `fastr-theme.css` in repository
- **Examples:** Check `core_content/*.md` files for real examples

---

**Happy slide building!** Remember: clear, simple slides with good visuals make the best presentations.
