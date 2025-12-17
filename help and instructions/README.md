# FASTR Slide Builder Documentation

Welcome to the documentation for the FASTR slide builder! This directory contains all guides and references for creating FASTR workshop presentations.

---

## Quick Links

- **[Markdown Guide](markdown-guide.md)** - Cheat sheet for writing Marp slides
- **[Building Decks](building-decks.md)** - How to assemble and render presentations
- **[Codespaces Workflow](codespaces-workflow.md)** - ⚠️ How to save work in Codespaces (CRITICAL!)
- **[Local Setup](local-setup.md)** - Installing software on your machine

---

## Getting Started

### New to FASTR slide builder? Start here:

1. **Learn the basics:**
   - Read the [Markdown Guide](markdown-guide.md) to understand slide syntax
   - Learn how slides are structured with headings, lists, images, and breaks
   - See examples of good slide structure

2. **Choose your environment:**
   - **No installation:** Try [GitHub Codespaces](../CONTRIBUTING.md#using-github-codespaces) (recommended for beginners)
   - **Quick edits:** Use the [GitHub.com web editor](../CONTRIBUTING.md#editing-on-githubcom)
   - **Full local setup:** Follow the [Local Setup Guide](local-setup.md)

3. **Build your first deck:**
   - Run `python3 tools/01_setup_workshop.py` to create a workshop
   - Run `python3 tools/02_check_workshop.py` to validate your setup
   - Run `python3 tools/03_build_deck.py` to build the deck
   - See [Building Decks Guide](building-decks.md) for details

4. **Contribute:**
   - See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution workflow
   - Learn Git basics and commit message guidelines
   - Understand how to work with the team

---

## Documentation Overview

### [Markdown Guide](markdown-guide.md)

**What it covers:**
- What is a slide and how to create one
- Heading hierarchy (`#`, `##`, `###`)
- Slide breaks with `---`
- Lists (bullets and numbered)
- Text formatting (bold, italic, code)
- Images and image paths
- Links and tables
- Marp-specific features (frontmatter, speaker notes)
- Examples of good slide structure
- Common mistakes to avoid

**Who it's for:**
- Content creators writing slides
- Anyone editing core content or custom slides
- Beginners learning markdown syntax

**Key takeaways:**
- Slides are content between `---` separators
- Use `#` for titles, `##` for sections
- Keep slides simple with one idea per slide
- Images use `![Description](path)`

---

### [Building Decks Guide](building-decks.md)

**What it covers:**
- Complete workflow from config to PDF
- Creating workshop folders and configurations
- Adding custom slides and agenda images
- Building decks with the Python script
- Rendering to PDF (recommended approach)
- Rendering to PowerPoint (alternative approach)
- Troubleshooting common errors
- Complete workflow examples

**Who it's for:**
- Workshop organizers creating new decks
- Anyone assembling presentations from core content
- Users rendering markdown to PDF or PowerPoint

**Key takeaways:**
- Two-step workflow: assemble (build) then render
- PDF is recommended for consistent styling
- PowerPoint is for editable slides but needs manual adjustments
- Configuration lives in `workshops/WORKSHOP_ID/config.py`

---

### [Local Setup Guide](local-setup.md)

**What it covers:**
- Installing Git for version control
- Installing Python 3.7+ for build scripts
- Installing VS Code for editing
- Installing Node.js and Marp CLI for PDF rendering
- Installing Pandoc for PowerPoint export (optional)
- Cloning the repository
- Setting up VS Code extensions
- Verifying the complete installation

**Who it's for:**
- Users who prefer working locally instead of Codespaces
- Advanced contributors who need full control
- Anyone setting up a new machine

**Key takeaways:**
- Local setup takes 30-45 minutes
- Most contributors don't need local setup (use Codespaces!)
- VS Code extensions provide live preview
- Verification step ensures everything works

---

## Common Use Cases

### "I want to edit existing core content"

1. **Quick edit on GitHub.com:**
   - Browse to `core_content/` folder
   - Click the file you want to edit
   - Click the pencil icon
   - Make changes and commit

2. **Using Codespaces (to preview):**
   - Open Codespaces
   - Edit the file in VS Code
   - Use Marp preview to see changes
   - Commit and push

**Read:** [CONTRIBUTING.md](../CONTRIBUTING.md) for commit guidelines

---

### "I want to create a new workshop deck"

1. **Run the setup wizard:**
   ```bash
   python3 tools/01_setup_workshop.py
   ```
   - Creates workshop folder with all needed files
   - Pre-fills config with your details
   - Copies default FASTR visualizations to replace

2. **Customize your content:**
   - Edit `config.py` with country data
   - Edit custom slide `.md` files
   - Replace `agenda.png` with your agenda
   - Replace charts in `assets/fastr-outputs/`

3. **Check and build:**
   ```bash
   python3 tools/02_check_workshop.py --workshop YOUR_WORKSHOP
   python3 tools/03_build_deck.py --workshop YOUR_WORKSHOP
   marp outputs/YOUR_WORKSHOP_deck.md --theme-set fastr-theme.css --pdf
   ```

**Read:** [Building Decks Guide](building-decks.md) for complete instructions

---

### "I'm new to markdown"

1. **Start with the quick reference:**
   - Read [Markdown Guide](markdown-guide.md)
   - Focus on "Headings" and "Slide Breaks" sections first
   - Look at examples in `core_content/*.md`

2. **Practice:**
   - Open `workshops/example/custom_slides.md`
   - Try editing and previewing in VS Code
   - Experiment with formatting

**Read:** [Markdown Guide](markdown-guide.md) - it's designed to be scannable!

---

### "I need to install everything locally"

1. **Follow the step-by-step guide:**
   - [Local Setup Guide](local-setup.md) has detailed instructions for Windows and Mac
   - Install in order: Git → Python → VS Code → Node.js → Marp CLI

2. **Verify setup:**
   - Build the example deck
   - Render to PDF
   - Check that FASTR theme is applied

**Read:** [Local Setup Guide](local-setup.md) - beginner-friendly with troubleshooting

---

### "I need to troubleshoot rendering issues"

1. **For PDF rendering:**
   - See [Building Decks Guide - PDF Rendering Issues](building-decks.md#pdf-rendering-issues)
   - Check that Marp CLI is installed
   - Verify `--theme-set fastr-theme.css` is included
   - Run from repository root

2. **For PowerPoint rendering:**
   - See [Building Decks Guide - PowerPoint Rendering Issues](building-decks.md#powerpoint-rendering-issues)
   - Check that Pandoc is installed
   - Verify `fastr-reference.pptx` exists
   - Expect manual adjustments after export

---

## File Structure Reference

```
fastr-slide-builder/
├── docs/                          # Documentation (you are here!)
│   ├── README.md                  # Documentation index (this file)
│   ├── markdown-guide.md          # Markdown syntax cheat sheet
│   ├── building-decks.md          # How to build and render decks
│   └── local-setup.md             # Installation instructions
│
├── core_content/                  # Shared FASTR modules
│   ├── 01_background_rationale.md
│   ├── 02_fastr_approach.md
│   ├── 03_data_extraction.md
│   ├── 04_data_quality_assessment.md
│   ├── 05_service_utilization.md
│   ├── 06_coverage_analysis.md
│   └── 07_facility_assessments.md
│
├── templates/                     # Reusable slide templates
│   ├── title_slide.md             # Workshop title slide
│   ├── breaks.md                  # Tea and lunch breaks
│   ├── agenda.md                  # Agenda slide
│   └── closing.md                 # Closing slide
│
├── workshops/                     # Workshop configurations
│   ├── example/                   # Example workshop (reference)
│   │   ├── config.py              # Workshop settings
│   │   ├── objectives.md          # Custom slides
│   │   ├── country-overview.md
│   │   ├── agenda.png             # Agenda image
│   │   └── assets/fastr-outputs/  # Country-specific visualizations
│   └── 2025-country/              # Your workshops (created by wizard)
│       └── ...
│
├── tools/                         # Build scripts
│   ├── 01_setup_workshop.py       # Create new workshop (interactive wizard)
│   ├── 02_check_workshop.py       # Validate workshop setup
│   ├── 03_build_deck.py           # Assemble markdown deck
│   └── 04_convert_to_pptx.py      # Convert to PowerPoint
│
├── assets/                        # Shared images/logos
│   └── ...
│
├── outputs/                       # Generated decks (gitignored)
│   ├── *.md                       # Assembled markdown files
│   ├── *.pdf                      # Rendered PDFs
│   └── *.pptx                     # Rendered PowerPoint files
│
├── fastr-theme.css                # Marp theme (FASTR styling)
├── fastr-reference.pptx           # PowerPoint reference template
├── README.md                      # Main repository README
└── CONTRIBUTING.md                # Contribution guidelines
```

---

## Key Concepts

### Workshop Configuration

Every workshop needs a `config.py` file that defines:
- Basic info (name, date, location, facilitators)
- Deck order (which slides and sessions to include)
- Country data (values to auto-fill into slides)
- Schedule settings (break times, number of days)

**Example:**
```python
WORKSHOP_CONFIG = {
    'workshop_id': '2025-nigeria',
    'name': 'FASTR Workshop - Nigeria',
    'date': 'January 15-17, 2025',
    'location': 'Abuja, Nigeria',

    'deck_order': [
        'agenda',
        'objectives.md',
        'intro',
        'dq_assessment',
        'coverage',
        'next-steps.md',
    ],

    'country_data': {
        'total_facilities': '2,847',
        'reporting_rate': '92%',
        # ... more country statistics
    },
}
```

---

### Three-Step Build Process

1. **Check:** Validate setup before building
   ```bash
   python3 tools/02_check_workshop.py --workshop 2025-nigeria
   ```
   Catches missing files, undefined variables, broken images

2. **Build:** Combine content into markdown
   ```bash
   python3 tools/03_build_deck.py --workshop 2025-nigeria
   ```
   Output: `outputs/2025-nigeria_deck.md`

3. **Render:** Export to PDF or PowerPoint
   ```bash
   marp outputs/2025-nigeria_deck.md --theme-set fastr-theme.css --pdf
   ```
   Output: `outputs/2025-nigeria_deck.pdf`

---

### PDF vs PowerPoint

**Use PDF when:**
- Distributing final presentations
- Presenting from your own laptop
- Consistency is critical
- You want perfect FASTR styling

**Use PowerPoint when:**
- Collaborators need to edit after export
- Last-minute changes are likely
- Presenting on unknown computers
- Flexibility is more important than consistency

**Recommendation:** Always create PDF first, use PowerPoint as backup.

---

## Additional Resources

### Within this repository:
- **Main README:** [../README.md](../README.md) - Project overview
- **Contributing Guide:** [../CONTRIBUTING.md](../CONTRIBUTING.md) - How to contribute
- **Example Workshop:** `workshops/example/` - Reference implementation
- **Core Content:** `core_content/*.md` - Real slide examples

### External resources:
- **Marp Documentation:** https://marpit.marp.app/markdown
- **Markdown Guide:** https://www.markdownguide.org/
- **Git Handbook:** https://guides.github.com/introduction/git-handbook/
- **VS Code Docs:** https://code.visualstudio.com/docs

---

## Quick Start Checklist

### For Content Editors:
- [ ] Read [Markdown Guide](markdown-guide.md)
- [ ] Open [GitHub Codespaces](../CONTRIBUTING.md#using-github-codespaces)
- [ ] Edit a file and preview with Marp
- [ ] Commit your changes

### For Workshop Organizers:
- [ ] Review [Building Decks Guide](building-decks.md)
- [ ] Run `python3 tools/01_setup_workshop.py` to create workshop
- [ ] Edit `config.py` with country data
- [ ] Replace default visualizations in `assets/fastr-outputs/`
- [ ] Run check tool, then build and render your deck
- [ ] Distribute PDF to participants

### For Local Setup:
- [ ] Follow [Local Setup Guide](local-setup.md)
- [ ] Install all required software
- [ ] Clone the repository
- [ ] Build the example workshop
- [ ] Verify PDF renders correctly

---

## Need Help?

### Check documentation:
1. **Markdown syntax:** See [Markdown Guide](markdown-guide.md)
2. **Building issues:** See [Building Decks Guide](building-decks.md)
3. **Installation problems:** See [Local Setup Guide](local-setup.md)
4. **Contribution workflow:** See [CONTRIBUTING.md](../CONTRIBUTING.md)

### Look at examples:
- Browse `core_content/*.md` for real slides
- Review `workshops/example/` for complete setup
- Check `templates/*.md` for template structure

### Contact the team:
- Reach out to FASTR team
- Open an issue on GitHub
- Ask during team meetings

---

## Contributing to Documentation

Found an error or want to improve the docs?

1. **Small fixes:** Edit directly on GitHub.com
2. **Larger changes:** Use Codespaces or local setup
3. **Follow style:** Keep docs clear, scannable, beginner-friendly
4. **Add examples:** Show don't just tell
5. **Test links:** Ensure all links work

**See:** [CONTRIBUTING.md](../CONTRIBUTING.md) for commit guidelines

---

## Version History

- **v1.0** - Initial documentation reorganization (December 2025)
  - Created separate guides for markdown, building, and setup
  - Emphasized PDF over PowerPoint
  - Added comprehensive examples and troubleshooting

---

**Thank you for using the FASTR slide builder!** We hope this documentation helps you create effective workshop presentations.

For questions or suggestions, contact the FASTR team.
