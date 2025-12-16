# FASTR Slide Builder

Team collaboration system for building FASTR workshop presentations.

## Overview

This repository contains:
- **Core content modules** (7 sections) - shared FASTR methodology content
- **Slide templates** - reusable title, break, agenda, and closing slides
- **Workshop configs** - customizable settings for each workshop
- **Build tools** - assemble and convert slide decks

## Quick Start

### 1. Create a New Workshop

```bash
# Copy the example workshop folder
cp -r workshops/example workshops/2025_01_nigeria

# Edit the configuration
code workshops/2025_01_nigeria/config.py
```

### 2. Configure Your Workshop

Edit `workshops/2025_01_nigeria/config.py`:

```python
WORKSHOP_CONFIG = {
    'workshop_id': '2025_01_nigeria',
    'name': 'FASTR Workshop - Nigeria',
    'date': 'January 15-17, 2025',
    'location': 'Abuja, Nigeria',
    'facilitators': 'Dr. Smith, Dr. Jones',
    'contact_email': 'fastr@example.org',
    'website': 'https://fastr.org',
    'sections': [1, 2, 3, 4, 5, 6],  # Choose which core sections
    'include_breaks': True,
    'include_agenda': True,
    'include_closing': True,
}
```

### 3. Build Your Deck

```bash
# Assemble the markdown
python3 tools/build_deck.py --workshop 2025_01_nigeria

# Output: outputs/2025_01_nigeria_deck.md
```

### 4. Render to PDF (Recommended)

```bash
# Render with FASTR styling
marp outputs/2025_01_nigeria_deck.md --theme-set fastr-theme.css --pdf

# Output: outputs/2025_01_nigeria_deck.pdf
```

**Or** convert to editable PowerPoint (alternative):

```bash
python3 tools/convert_to_pptx.py outputs/2025_01_nigeria_deck.md

# Output: outputs/2025_01_nigeria_deck.pptx
```

## Two-Step Workflow

### Step 1: Assemble
Combine core content + templates + custom slides into markdown.

### Step 2: Render
Export to PDF (preferred) or PowerPoint.

**Why PDF?**
- Perfect CSS styling from `fastr-theme.css`
- Consistent across platforms
- Smaller file size
- No font/layout issues

**When to use PowerPoint?**
- Need to edit slides after export
- Collaborators prefer PowerPoint
- Last-minute changes required

## Core Sections

1. **Background & Rationale** - What is FASTR?
2. **FASTR Approach** - Overview of methodology
3. **Data Extraction** - DHIS2 integration
4. **Data Quality Assessment** - Validation and adjustment
5. **Service Utilization** - Detecting disruptions
6. **Coverage Analysis** - Population reach estimation
7. **Facility Assessments** - Phone survey methods

## Customization

### Title Slide
Automatically uses:
- Workshop name
- Date
- Location
- Facilitators

### Break Slides
Tea and lunch breaks with resume times from config.

### Agenda Slide
Place `agenda.png` in your workshop folder.

### Custom Slides
Add country-specific content:

```bash
# Edit custom slides
code workshops/2025_01_nigeria/custom_slides.md
```

Then enable in `config.py`:
```python
'custom_slides': ['custom_slides.md'],
```

## Team Workflow

### Contributing Core Content

1. Edit files in `core_content/`
2. Test your changes:
   ```bash
   python3 tools/build_deck.py --workshop example
   ```
3. Commit and push:
   ```bash
   git add core_content/
   git commit -m "Update data quality section"
   git push
   ```

### Creating Workshop-Specific Content

1. Create workshop folder
2. Add config.py
3. Add custom slides (optional)
4. Add agenda image (optional)
5. Build and test
6. Commit workshop folder

### Sharing Decks

**Option 1: Commit the markdown to Git**
```bash
git add outputs/nigeria_deck.md
git commit -m "Add Nigeria workshop deck"
```

**Option 2: Share the PDF/PowerPoint**
- Export the rendered file
- Share via email/cloud storage
- Don't commit large binary files to Git

## Folder Structure

```
fastr-slide-builder/
├── core_content/           # Shared FASTR modules
│   ├── 01_background_rationale.md
│   ├── 02_fastr_approach.md
│   ├── ...
│   └── 07_facility_assessments.md
├── templates/              # Reusable slide templates
│   ├── title_slide.md
│   ├── breaks.md
│   ├── agenda.md
│   └── closing.md
├── workshops/              # Workshop configurations
│   ├── example/
│   │   ├── config.py
│   │   ├── custom_slides.md
│   │   └── agenda.png
│   └── 2025_01_nigeria/
│       └── ...
├── tools/                  # Build scripts
│   ├── build_deck.py
│   ├── convert_to_pptx.py
│   └── create_fastr_template.py
├── assets/                 # Shared images/logos
│   └── ...
├── outputs/                # Generated decks (gitignored)
│   └── .gitkeep
├── fastr-theme.css         # Marp theme (for PDF export)
├── fastr-reference.pptx    # PowerPoint template
└── README.md               # This file
```

## Requirements

### Required
- Python 3.7+
- Git

### Optional (for rendering)
- **For PDF export (recommended):**
  - Marp CLI: `npm install -g @marp-team/marp-cli`

- **For PowerPoint export:**
  - Pandoc: `brew install pandoc` (Mac) or see [pandoc.org](https://pandoc.org/installing.html)

### Installing Marp (Recommended)

```bash
# Install Node.js first (if not installed)
# Then install Marp CLI
npm install -g @marp-team/marp-cli

# Verify installation
marp --version
```

## VS Code Setup (Recommended)

### First Time Setup

1. **Install VS Code:** https://code.visualstudio.com/

2. **Open the repository:**
   ```bash
   cd fastr-slide-builder
   code .
   ```

3. **Install recommended extensions:**
   - VS Code will prompt: "This workspace has extension recommendations"
   - Click **Install All** to add Marp and Python extensions
   - Or manually: Extensions → Search "Marp" → Install "Marp for VS Code"

4. **Verify FASTR theme is working:**
   - Open any `.md` file (e.g., `workshops/example/custom_slides.md`)
   - Click the Marp icon in top-right corner (or press `Cmd/Ctrl+K V`)
   - Preview should show **FASTR teal styling** (not default gray)

**Note:** Settings are pre-configured in `.vscode/settings.json` - no manual configuration needed!

### Previewing Slides in VS Code

- **Open preview:** Click Marp icon in top-right, or `Cmd+K V` (Mac) / `Ctrl+K V` (Windows)
- **Side-by-side editing:** Preview opens alongside your markdown editor
- **Live updates:** Preview refreshes as you type

**The preview automatically uses the FASTR theme:**
- Teal headers (#0f706d)
- White background
- Proper FASTR branding

### Editing Markdown

- Headers: Use `#` for slide titles, `##` for sections
- Slide breaks: `---` on its own line
- Images: `![Description](path/to/image.png)`
- Bullets: `-` for lists

VS Code will wrap lines and provide syntax highlighting automatically.

## Common Commands

```bash
# Build workshop deck
python3 tools/build_deck.py --workshop WORKSHOP_ID

# Render to PDF (recommended)
marp outputs/DECK.md --theme-set fastr-theme.css --pdf

# Convert to PowerPoint
python3 tools/convert_to_pptx.py outputs/DECK.md

# Preview in browser
marp --preview outputs/DECK.md --theme-set fastr-theme.css

# Create custom PowerPoint template
python3 tools/create_fastr_template.py
```

## Troubleshooting

### "Workshop config not found"
- Make sure you created the workshop folder
- Check that `config.py` exists
- Verify the workshop ID matches the folder name

### "File not found" for images
- Place images in workshop folder or `assets/`
- Use relative paths: `../assets/image.png`
- For agenda: place as `workshops/{id}/agenda.png`

### PDF export has no styling
- Make sure you use `--theme-set fastr-theme.css`
- Run from repository root directory
- Check that `fastr-theme.css` exists

### PowerPoint export has no styling
- Check that `fastr-reference.pptx` exists
- Recreate template: `python3 tools/create_fastr_template.py`
- Or manually edit Slide Master in PowerPoint

### Content overflows in slides
- Reduce content in markdown
- For PowerPoint: edit `fastr-reference.pptx` Slide Master to use smaller fonts
- For PDF: edit `fastr-theme.css` font sizes

## Tips for VS Code Users

1. **Install Marp extension:**
   - Search for "Marp for VS Code"
   - Preview slides while editing

2. **Set up Python:**
   - Use Python extension
   - Right-click scripts → "Run Python File in Terminal"

3. **Git integration:**
   - Use Source Control panel
   - Commit frequently with clear messages

## Support

For questions or issues:
1. Check this README
2. See `CONTRIBUTING.md` for contribution guidelines
3. Review example workshop in `workshops/example/`
4. Contact the FASTR team

## License

FASTR methodology and content - see your organization's license.
