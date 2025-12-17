# Contributing to FASTR Slide Builder

Thank you for contributing to the FASTR slide deck system! This guide provides practical instructions for common contribution tasks.

## Quick Reference

- **Edit session slides:** Modify files in `core_content/`
- **Add custom templates:** Create files in `templates/custom_slides/`
- **Modify build tools:** Update scripts in `tools/`
- **Full documentation:** See [docs/](docs/) for detailed guides

## Setup Options

### GitHub.com (No Installation)
**Best for:** Quick content edits
**Can do:** Edit markdown files, update configs
**Can't do:** Build decks, generate PDFs, preview FASTR theme

### GitHub Codespaces (Recommended)
**Best for:** Building decks, testing changes
**Setup:** Code → Codespaces → Create codespace (2-3 min)
**Includes:** Python, Node.js, Marp CLI, VS Code, FASTR theme

### Local Setup
**Best for:** Offline work
**Guide:** See [docs/local-setup.md](docs/local-setup.md)

---

## Modifying Core Content (Session Slides)

Core content files are reusable FASTR methodology modules used across all workshops.

### Location
`core_content/` - Seven main sections:
- `01_background_rationale.md`
- `02_fastr_approach.md`
- `03_coverage_analysis.md`
- `04_data_quality_assessment.md`
- `05_results_reporting.md`
- `06_action_planning.md`
- `07_data_use.md`

### When to Edit
- Update FASTR methodology
- Fix typos or errors
- Improve explanations
- Add or update diagrams

### How to Edit

1. **Edit the markdown file**
   ```bash
   # In Codespaces or local setup
   code core_content/04_data_quality_assessment.md
   ```

2. **Test your changes**
   ```bash
   python3 tools/03_build_deck.py --workshop example
   marp outputs/example_deck.md --theme-set fastr-theme.css --pdf
   ```

3. **Review the output**
   ```bash
   open outputs/example_deck.pdf
   ```

4. **Commit**
   ```bash
   git add core_content/04_data_quality_assessment.md
   git commit -m "Update DQA section: add missing indicators"
   git push
   ```

### Important Notes
- Changes affect ALL future workshops using these sections
- Always test with the example workshop before committing
- Use `../assets/subfolder/` for image paths in core content (e.g., `../assets/diagrams/`, `../assets/screenshots/`)

---

## Adding Custom Slide Templates

Custom slide templates allow you to create reusable slide layouts that can be used in workshop configurations.

### Location
`templates/custom_slides/` - Optional custom templates referenced in workshop configs

### When to Create
- Reusable country-specific layouts
- Standard results presentation formats
- Specialized section templates

### How to Create

1. **Create a new template file**
   ```bash
   # Example: Create a results overview template
   code templates/custom_slides/results_overview.md
   ```

2. **Write your template with variables**
   ```markdown
   ---
   # Results Overview

   ## {{COUNTRY_NAME}} FASTR Analysis

   **Period:** {{ANALYSIS_PERIOD}}
   **Facilities:** {{FACILITY_COUNT}}

   ---

   # Key Findings

   {{CUSTOM_FINDINGS}}
   ```

3. **Reference in workshop config**
   ```python
   # In workshops/your_workshop/config.py
   CUSTOM_SLIDES = {
       'results_overview': {
           'file': 'templates/custom_slides/results_overview.md',
           'position': 'after_section_4',
           'variables': {
               'CUSTOM_FINDINGS': '- Finding 1\n- Finding 2'
           }
       }
   }
   ```

4. **Test the template**
   ```bash
   python3 tools/03_build_deck.py --workshop your_workshop
   ```

### Template Best Practices
- Use `{{UPPERCASE_VARIABLES}}` for placeholder text
- Include slide breaks (`---`) between slides
- Keep templates generic and reusable
- Document required variables in comments
- Test with multiple workshops

---

## Modifying Build Tools

Build tools are Python scripts that assemble and process slide decks.

### Location
`tools/` - Main build scripts:
- `01_convert_to_pptx.py` - PowerPoint conversion
- `02_build_deck.py` - Deck assembly
- `03_create_workshop.py` - Workshop scaffolding

### When to Modify
- Fix bugs in build process
- Add new features (e.g., new variable types)
- Improve error handling
- Optimize performance

### How to Modify

1. **Edit the tool script**
   ```bash
   code tools/03_build_deck.py
   ```

2. **Test with multiple workshops**
   ```bash
   # Test with example workshop
   python3 tools/03_build_deck.py --workshop example

   # Test with another workshop
   python3 tools/03_build_deck.py --workshop demo_country

   # Test edge cases
   python3 tools/03_build_deck.py --workshop minimal_workshop
   ```

3. **Verify outputs**
   ```bash
   # Check generated markdown
   cat outputs/example_deck.md

   # Build PDF
   marp outputs/example_deck.md --theme-set fastr-theme.css --pdf

   # Open and review
   open outputs/example_deck.pdf
   ```

4. **Update documentation if needed**
   ```bash
   # Update relevant docs
   code docs/building-decks.md
   ```

5. **Commit with detailed message**
   ```bash
   git add tools/03_build_deck.py
   git commit -m "Add support for conditional section inclusion

   - Added --exclude-sections flag
   - Improved error handling for missing configs
   - Updated variable substitution logic"
   git push
   ```

### Tool Development Tips
- Add helpful error messages
- Use logging for debugging
- Validate inputs early
- Test with edge cases
- Keep backward compatibility

---

## Testing Changes

Always test before committing. The level of testing depends on what you changed.

### Testing Core Content Changes

```bash
# Build example deck
python3 tools/03_build_deck.py --workshop example

# Render to PDF
marp outputs/example_deck.md --theme-set fastr-theme.css --pdf

# Review output
open outputs/example_deck.pdf
```

**Check for:**
- Typos and formatting
- Image links working
- Slide breaks in correct places
- Content flows logically

### Testing Custom Templates

```bash
# Build workshop using the template
python3 tools/03_build_deck.py --workshop your_workshop

# Check template was inserted correctly
grep "Results Overview" outputs/your_workshop_deck.md

# Render and review
marp outputs/your_workshop_deck.md --theme-set fastr-theme.css --pdf
open outputs/your_workshop_deck.pdf
```

**Check for:**
- Variables substituted correctly
- Template appears in right position
- Styling matches FASTR theme
- No extra blank slides

### Testing Tool Changes

```bash
# Test with multiple workshops
for workshop in example demo_country; do
    echo "Testing $workshop..."
    python3 tools/03_build_deck.py --workshop $workshop
    if [ $? -eq 0 ]; then
        echo "✓ $workshop build succeeded"
    else
        echo "✗ $workshop build failed"
    fi
done

# Test error handling
python3 tools/03_build_deck.py --workshop nonexistent
python3 tools/03_build_deck.py  # Missing required argument
```

**Check for:**
- No regressions in existing workshops
- Error messages are clear and helpful
- Edge cases handled gracefully
- Performance acceptable

### Quick Test Commands

```bash
# Fast syntax check
python3 -m py_compile tools/03_build_deck.py

# Build without PDF (faster)
python3 tools/03_build_deck.py --workshop example

# Build with PDF
python3 tools/03_build_deck.py --workshop example && \
  marp outputs/example_deck.md --theme-set fastr-theme.css --pdf

# Check specific section
grep -A 20 "Data Quality" outputs/example_deck.md
```

---

## Common Tasks

### Add a New Workshop

```bash
# Create from example
cp -r workshops/example workshops/2025_01_nigeria

# Edit config
code workshops/2025_01_nigeria/config.py

# Add custom slides (optional)
code workshops/2025_01_nigeria/custom_slides.md

# Build and test
python3 tools/03_build_deck.py --workshop 2025_01_nigeria

# Commit
git add workshops/2025_01_nigeria/
git commit -m "Add Nigeria January 2025 workshop"
git push
```

### Add an Image

**To core content:**
```bash
# Add to assets (use appropriate subfolder)
cp ~/Desktop/diagram.png assets/diagrams/

# Reference in markdown with subfolder
# ![Description](../assets/diagrams/diagram.png)

# Commit both
git add assets/diagrams/diagram.png core_content/02_fastr_approach.md
git commit -m "Add FASTR approach diagram"
```

**To workshop:**
```bash
# Add to workshop folder
cp ~/Desktop/results.png workshops/2025_01_nigeria/

# Reference in custom slides
# ![Results](results.png)

# Commit
git add workshops/2025_01_nigeria/
git commit -m "Add results visualization"
```

### Update Standard Templates

```bash
# Edit template
code templates/title_slide.md

# Test with example
python3 tools/03_build_deck.py --workshop example

# Verify all variables work
marp outputs/example_deck.md --theme-set fastr-theme.css --pdf

# Commit
git add templates/title_slide.md
git commit -m "Update title slide layout"
```

---

## Commit Guidelines

### Format
```
<type>: <short description>

<optional details>
```

### Types
- `content:` - Core content changes
- `workshop:` - Workshop additions/updates
- `template:` - Template changes
- `tools:` - Build script updates
- `docs:` - Documentation
- `fix:` - Bug fixes

### Examples

**Good:**
```
content: Update DQA section with 2025 indicators

Added malaria and COVID-19 tracking indicators.
Updated example visualizations.
```

```
tools: Add --exclude-sections flag to build script

Allows selective section inclusion for custom workshops.
```

**Avoid:**
```
updates
fixed stuff
changes
```

---

## Getting Help

- **Documentation:** [docs/](docs/) - Detailed guides
- **Examples:** `workshops/example/` - Reference implementation
- **README:** [README.md](README.md) - Project overview

## Questions?

Contact the FASTR team or check existing workshop configurations for examples.

---

Thank you for contributing to FASTR!
