# Building FASTR Workshop Decks

Step-by-step guide for assembling and rendering FASTR workshop presentations.

## Overview: Workflow

```bash
# 1. Create workshop (interactive wizard)
python3 tools/01_setup_workshop.py

# 2. Check your setup (catches common issues)
python3 tools/02_check_workshop.py --workshop YOUR_WORKSHOP

# 3. Build the deck
python3 tools/03_build_deck.py --workshop YOUR_WORKSHOP

# 4. Export to PDF
marp outputs/YOUR_WORKSHOP_deck.md --theme-set fastr-theme.css --pdf
```

```
Workshop Config  ─┐
Core Content     ─┼─> [Build Script] ─> Markdown Deck ─> [Marp CLI] ─> PDF
Custom Slides    ─┘                                    └> [Pandoc] ─> PowerPoint
Country Assets   ─┘
```

---

## Part 1: Assembling Your Deck

### Step 1: Create Workshop Folder

Create a new folder for your workshop in the `workshops/` directory.

**Using command line:**
```bash
# Copy the example workshop as a starting point
cp -r workshops/example workshops/2025_01_nigeria

# Navigate to the new folder
cd workshops/2025_01_nigeria
```

**Using GitHub web interface:**
1. Navigate to `workshops/` folder
2. Click "Add file" → "Create new file"
3. In filename box, type: `2025_01_nigeria/config.py`
4. Paste example config (see next step)

**Folder structure:**
```
workshops/
└── 2025_01_nigeria/
    ├── config.py              # Required - workshop settings
    ├── custom_slides.md       # Optional - custom content
    └── agenda.png             # Optional - agenda image
```

### Step 2: Create Workshop Configuration

Create `config.py` in your workshop folder with these settings:

**Example configuration:**
```python
WORKSHOP_CONFIG = {
    # Basic Information
    'workshop_id': '2025_01_nigeria',
    'name': 'FASTR Workshop - Nigeria',
    'date': 'January 15-17, 2025',
    'location': 'Abuja, Nigeria',
    'facilitators': 'Dr. Smith, Dr. Jones',
    'contact_email': 'fastr@example.org',
    'website': 'https://fastr.org',

    # Content Selection
    'sections': [1, 2, 3, 4, 5, 6, 7],  # Which core sections to include

    # Optional Components
    'include_breaks': True,              # Tea and lunch breaks
    'include_agenda': True,              # Agenda slide (needs agenda.png)
    'include_closing': True,             # Closing slide

    # Custom Slides (optional)
    'custom_slides': ['custom_slides.md'],  # List of custom markdown files

    # Break Times (optional - only if include_breaks is True)
    'tea_break_resume': '11:00 AM',
    'lunch_break_resume': '1:30 PM',
}
```

**Configuration options explained:**

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `workshop_id` | Yes | Unique identifier (matches folder name) | `'2025_01_nigeria'` |
| `name` | Yes | Full workshop name | `'FASTR Workshop - Nigeria'` |
| `date` | Yes | Workshop dates | `'January 15-17, 2025'` |
| `location` | Yes | Workshop location | `'Abuja, Nigeria'` |
| `facilitators` | Yes | Facilitator names | `'Dr. Smith, Dr. Jones'` |
| `contact_email` | Yes | Contact email | `'fastr@example.org'` |
| `website` | Yes | FASTR website | `'https://fastr.org'` |
| `sections` | Yes | List of core sections to include | `[1, 2, 3, 4, 5, 6, 7]` |
| `include_breaks` | No | Include break slides | `True` or `False` |
| `include_agenda` | No | Include agenda slide | `True` or `False` |
| `include_closing` | No | Include closing slide | `True` or `False` |
| `custom_slides` | No | Custom markdown files | `['custom_slides.md']` |
| `tea_break_resume` | No | Tea break resume time | `'11:00 AM'` |
| `lunch_break_resume` | No | Lunch break resume time | `'1:30 PM'` |

**Core sections available:**
1. Background & Rationale
2. FASTR Approach
3. Data Extraction
4. Data Quality Assessment
5. Service Utilization
6. Coverage Analysis
7. Facility Assessments

**Example: Shorter workshop (sections 1-4 only):**
```python
'sections': [1, 2, 3, 4],
```

### Step 3: Add Custom Slides (Optional)

If you need country-specific or workshop-specific content, create `custom_slides.md`:

**Example custom_slides.md:**
```markdown
---

# Nigeria DHIS2 Implementation

## Current Status

- 37 states fully reporting
- 98% facility coverage
- Monthly reporting cycle

**Data sources:**
- DHIS2 National Instance
- State health records
- Facility registers

---

# Previous FASTR Results (2023)

![Nigeria 2023 Results](nigeria_2023_results.png)

## Key Findings:
- Improved data completeness
- Identified reporting gaps
- Strengthened HMIS capacity

---

# Workshop Objectives

By the end of this workshop, participants will:

1. Understand FASTR methodology
2. Apply data quality assessment techniques
3. Generate coverage estimates
4. Interpret results for decision-making
```

**Then enable in config.py:**
```python
'custom_slides': ['custom_slides.md'],
```

**Tips for custom slides:**
- Follow the same markdown syntax as core content
- Don't include frontmatter (it's added automatically)
- Use `---` to separate slides
- Reference local images directly: `![Image](image.png)`
- See [Markdown Guide](markdown-guide.md) for syntax help

### Step 4: Add Agenda Image (Optional)

If `include_agenda: True`, place an agenda image in your workshop folder:

```bash
# Copy your agenda image
cp ~/Desktop/agenda.png workshops/2025_01_nigeria/agenda.png
```

**Agenda image requirements:**
- Filename: `agenda.png` (exactly)
- Format: PNG, JPG, or JPEG
- Recommended size: 1920x1080 or 1280x720
- Content: Workshop schedule, topics, timing

### Step 5: Build Your Deck

Run the build script to assemble all content into a single markdown file:

```bash
python3 tools/03_build_deck.py --workshop 2025_01_nigeria
```

**What this does:**
1. Reads your `config.py`
2. Combines title slide + core content + custom slides + breaks + closing
3. Substitutes variables (workshop name, date, location, etc.)
4. Outputs to `outputs/2025_01_nigeria_deck.md`

**Expected output:**
```
Building deck for workshop: 2025_01_nigeria
✓ Loaded configuration
✓ Added title slide
✓ Added core section 1: Background & Rationale
✓ Added core section 2: FASTR Approach
✓ Added core section 3: Data Extraction
✓ Added custom slides
✓ Added agenda slide
✓ Added break slides
✓ Added closing slide

Successfully built deck: outputs/2025_01_nigeria_deck.md
Total slides: 87
```

**Troubleshooting assembly errors:**

| Error | Cause | Solution |
|-------|-------|----------|
| "Workshop config not found" | Missing `config.py` | Create config.py in workshop folder |
| "Invalid workshop_id" | Mismatch between folder and config | Make sure folder name matches `workshop_id` |
| "Section X not found" | Invalid section number | Use sections 1-7 only |
| "Custom slides not found" | Missing custom markdown file | Create the file or remove from config |
| "Image not found" | Missing agenda.png | Add agenda.png or set `include_agenda: False` |

---

## Part 2: Rendering to PDF (Recommended)

### Why PDF is Recommended

**Advantages:**
- Perfect CSS styling from `fastr-theme.css`
- Consistent appearance across all platforms
- Smaller file size than PowerPoint
- No font installation required
- No layout issues
- Exact control over design

**Use PDF when:**
- Distributing final presentation
- Presenting from your own laptop
- Archiving workshop materials
- Consistency is critical

### Rendering Command

```bash
marp outputs/2025_01_nigeria_deck.md --theme-set fastr-theme.css --pdf
```

**Output:** `outputs/2025_01_nigeria_deck.pdf`

**What this does:**
1. Reads the markdown file
2. Applies FASTR theme styling (teal colors, fonts, layout)
3. Renders each slide as a PDF page
4. Outputs a single PDF file

**Command options:**

| Option | Description |
|--------|-------------|
| `--theme-set fastr-theme.css` | Apply FASTR custom styling |
| `--pdf` | Export to PDF format |
| `--allow-local-files` | Allow loading local images (usually automatic) |
| `--pdf-notes` | Include speaker notes in PDF |

**Example with speaker notes:**
```bash
marp outputs/2025_01_nigeria_deck.md --theme-set fastr-theme.css --pdf --pdf-notes
```

### Checking PDF Output

**Mac:**
```bash
open outputs/2025_01_nigeria_deck.pdf
```

**Windows:**
```bash
start outputs/2025_01_nigeria_deck.pdf
```

**Linux:**
```bash
xdg-open outputs/2025_01_nigeria_deck.pdf
```

**What to verify:**
- All slides rendered correctly
- Images loaded properly
- FASTR theme applied (teal headers, proper fonts)
- No content overflow
- Slide numbers present

---

## Part 3: Rendering to PowerPoint (Alternative)

### When to Use PowerPoint

**Use PowerPoint when:**
- Collaborators need to edit slides after export
- Last-minute changes required during workshop
- Presenting on a computer without PDF viewer
- Need to rearrange slides on the fly

**Drawbacks:**
- Font sizing can be inconsistent
- Layout may need manual adjustment
- Larger file size
- Requires editing Slide Master for styling
- May need manual fixes after export

### Rendering Command

```bash
python3 tools/04_convert_to_pptx.py outputs/2025_01_nigeria_deck.md
```

**Output:** `outputs/2025_01_nigeria_deck.pptx`

**What this does:**
1. Uses `pandoc` to convert markdown to PowerPoint
2. Applies `fastr-reference.pptx` as template
3. Maps markdown formatting to PowerPoint styles
4. Outputs editable `.pptx` file

### Post-Export Adjustments

PowerPoint exports often need manual tweaking:

**Common issues:**

1. **Font sizes too large/small**
   - Open PowerPoint
   - Go to View → Slide Master
   - Adjust font sizes for Title and Content layouts
   - Close Slide Master view

2. **Content overflow**
   - Reduce font size in Slide Master
   - Or edit individual slides to reduce content
   - Or break into multiple slides

3. **Image sizing**
   - Select image
   - Drag handles to resize
   - Use Format → Size for precise dimensions

4. **Alignment issues**
   - Use View → Guides for alignment
   - Format → Align for automatic alignment

**Tips:**
- Test with a small deck first
- Save a "clean" template after adjustments
- Document any standard fixes needed
- Consider PDF if you're making extensive manual edits

---

## Complete Workflow Example

Here's a full example from start to finish:

### 1. Setup
```bash
# Navigate to repository
cd /path/to/fastr-slide-builder

# Create workshop folder
cp -r workshops/example workshops/2025_01_nigeria
cd workshops/2025_01_nigeria
```

### 2. Configure
Edit `config.py`:
```python
WORKSHOP_CONFIG = {
    'workshop_id': '2025_01_nigeria',
    'name': 'FASTR Workshop - Federal Republic of Nigeria',
    'date': 'January 15-17, 2025',
    'location': 'Abuja, Nigeria',
    'facilitators': 'Dr. Amina Adeyemi, Dr. Ibrahim Okafor',
    'contact_email': 'fastr.nigeria@example.org',
    'website': 'https://fastr.org',
    'sections': [1, 2, 3, 4, 5, 6],  # Exclude section 7
    'include_breaks': True,
    'include_agenda': True,
    'include_closing': True,
    'custom_slides': ['custom_slides.md'],
}
```

### 3. Add custom content
Create `custom_slides.md`:
```markdown
---

# Welcome to FASTR Nigeria!

This workshop will strengthen your capacity to use routine health data for decision-making.

## Three-Day Agenda:
- **Day 1:** FASTR Overview & Data Quality
- **Day 2:** Coverage Estimation & Analysis
- **Day 3:** Hands-on Practice & Planning

---

# Nigeria Health Context

![Nigeria Map](nigeria_health_map.png)

- 36 states + FCT
- 37,000+ health facilities
- DHIS2 implementation since 2014
```

Add agenda image:
```bash
cp ~/Desktop/nigeria_agenda.png agenda.png
```

### 4. Build
```bash
# Go back to repository root
cd ../..

# Build the deck
python3 tools/03_build_deck.py --workshop 2025_01_nigeria
```

### 5. Render to PDF (Primary)
```bash
marp outputs/2025_01_nigeria_deck.md --theme-set fastr-theme.css --pdf
```

### 6. Render to PowerPoint (Backup)
```bash
python3 tools/04_convert_to_pptx.py outputs/2025_01_nigeria_deck.md
```

### 7. Review and Share
```bash
# Open PDF to review
open outputs/2025_01_nigeria_deck.pdf

# Copy to shared folder or email
cp outputs/2025_01_nigeria_deck.pdf ~/Desktop/
```

---

## Troubleshooting

### Build Errors

**"No module named 'workshop_config'"**
- Make sure you're running from repository root
- Verify `config.py` exists in workshop folder

**"Workshop folder not found"**
- Check workshop_id matches folder name exactly
- Folder must be in `workshops/` directory

**"Cannot find custom slides"**
- Verify filename matches config.py
- Check file is in workshop folder
- Remove from config if not needed

### PDF Rendering Issues

**"Command not found: marp"**
- Marp CLI not installed
- Install: `npm install -g @marp-team/marp-cli`
- Verify: `marp --version`

**PDF has no styling / looks gray**
- Missing `--theme-set fastr-theme.css`
- Run from repository root (where fastr-theme.css exists)
- Check `fastr-theme.css` file exists

**Images don't appear in PDF**
- Check image paths in markdown
- Use `../assets/subfolder/` for shared images (e.g., `../assets/diagrams/`, `../assets/screenshots/`)
- Use relative paths for workshop images
- Verify images exist at specified paths

**Content overflows slides**
- Reduce text content in markdown source
- Break into multiple slides
- Edit `fastr-theme.css` to reduce font sizes

### PowerPoint Rendering Issues

**"Command not found: pandoc"**
- Pandoc not installed
- Install: See [Local Setup Guide](local-setup.md)

**"Reference template not found"**
- Missing `fastr-reference.pptx`
- Create: `python3 tools/create_fastr_template.py`

**Fonts look wrong in PowerPoint**
- Edit Slide Master (View → Slide Master)
- Update font family and sizes
- Apply to all slide layouts

**Images oversized in PowerPoint**
- This is a known limitation
- Manually resize images in PowerPoint
- Or use PDF format instead

---

## Tips for Success

### Content Tips
1. **Keep slides simple** - One main idea per slide
2. **Use visuals** - Images communicate better than text
3. **Test early** - Build and render frequently during development
4. **Review output** - Always check PDF/PowerPoint before distributing

### Workflow Tips
1. **Use version control** - Commit workshop configs to Git
2. **Test with example** - Try building `example` workshop first
3. **Save outputs** - Keep rendered PDFs in a separate archive
4. **Document customizations** - Note any special requirements

### Collaboration Tips
1. **Share markdown** - Commit `.md` files to Git (small file size)
2. **Share PDFs** - Email or cloud storage for final decks
3. **Don't commit large files** - PDFs/PowerPoint go in `outputs/` (gitignored)
4. **Coordinate template changes** - Affects all workshops

---

## Quick Reference

### Essential Commands

**Build a deck:**
```bash
python3 tools/03_build_deck.py --workshop WORKSHOP_ID
```

**Render to PDF:**
```bash
marp outputs/DECK.md --theme-set fastr-theme.css --pdf
```

**Render to PowerPoint:**
```bash
python3 tools/04_convert_to_pptx.py outputs/DECK.md
```

**Preview in browser:**
```bash
marp --preview outputs/DECK.md --theme-set fastr-theme.css
```

### File Locations

- **Workshop configs:** `workshops/WORKSHOP_ID/config.py`
- **Custom slides:** `workshops/WORKSHOP_ID/custom_slides.md`
- **Workshop images:** `workshops/WORKSHOP_ID/*.png`
- **Shared images:** `assets/logos/`, `assets/diagrams/`, `assets/screenshots/`
- **Core content:** `core_content/*.md`
- **Output decks:** `outputs/*.md` (markdown)
- **Output PDFs:** `outputs/*.pdf`
- **Output PowerPoint:** `outputs/*.pptx`

---

## Next Steps

- **Learn markdown syntax:** See [Markdown Guide](markdown-guide.md)
- **Install locally:** See [Local Setup Guide](local-setup.md)
- **Contribute content:** See [CONTRIBUTING.md](../CONTRIBUTING.md)
- **Explore examples:** Check `workshops/example/`

---

**Need help?** Contact the FASTR team or check the [documentation index](README.md).
