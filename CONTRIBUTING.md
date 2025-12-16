# Contributing to FASTR Slide Builder

Thank you for contributing to the FASTR slide deck system! This guide will help you understand how to work with the repository effectively.

## Table of Contents

- [First-Time Setup](#first-time-setup)
  - [Overview of Required Software](#overview-of-required-software)
  - [1. Installing Git](#1-installing-git)
  - [2. Installing Python 3.7+](#2-installing-python-37)
  - [3. Installing Visual Studio Code](#3-installing-visual-studio-code)
  - [4. Installing Node.js](#4-installing-nodejs)
  - [5. Installing Marp CLI](#5-installing-marp-cli)
  - [6. Cloning the Repository](#6-cloning-the-repository)
  - [7. Opening the Repository in VS Code](#7-opening-the-repository-in-vs-code)
  - [8. Installing Recommended VS Code Extensions](#8-installing-recommended-vs-code-extensions)
  - [9. Verify Everything Works](#9-verify-everything-works)
  - [10. Installing Pandoc (Optional)](#10-installing-pandoc-optional)
- [Getting Started](#getting-started)
- [Types of Contributions](#types-of-contributions)
- [Workflow Guidelines](#workflow-guidelines)
- [Best Practices](#best-practices)
- [Commit Message Guidelines](#commit-message-guidelines)

## First-Time Setup

This section will guide you through installing all the necessary software to contribute to the FASTR slide builder. These instructions are written for beginners - if you've never used these tools before, don't worry! Just follow along step by step.

### Overview of Required Software

You'll need to install:
1. **Git** - Version control system to download and manage code
2. **Python 3.7+** - Programming language used by the build scripts
3. **Visual Studio Code (VS Code)** - Code editor for editing slide content
4. **Node.js** - JavaScript runtime needed for Marp CLI
5. **Marp CLI** - Tool to convert Markdown slides to PDF
6. **Pandoc** (Optional) - Tool to export slides to PowerPoint format

Don't worry if you don't know what these are - the instructions below will walk you through everything!

---

### 1. Installing Git

Git is a tool that helps you download the repository and track changes to files.

#### Windows

1. Download Git from: https://git-scm.com/download/win
2. Run the installer (it will be named something like `Git-2.43.0-64-bit.exe`)
3. During installation:
   - Click "Next" through most screens (the defaults are fine)
   - When asked about "Adjusting your PATH environment", select **"Git from the command line and also from 3rd-party software"**
   - When asked about line ending conversions, select **"Checkout Windows-style, commit Unix-style line endings"**
   - Continue clicking "Next" and then "Install"
4. Click "Finish" when done

**Verify installation:**
1. Open Command Prompt (press Windows key, type `cmd`, press Enter)
2. Type: `git --version`
3. You should see something like `git version 2.43.0`

#### Mac

1. Open Terminal (press Cmd+Space, type `terminal`, press Enter)
2. Type: `git --version`
3. If Git is not installed, macOS will prompt you to install Command Line Developer Tools
4. Click "Install" and follow the prompts
5. Once complete, type `git --version` again to verify

**Alternative method:**
1. Download Git from: https://git-scm.com/download/mac
2. Run the installer and follow the prompts

**Verify installation:**
- In Terminal, type: `git --version`
- You should see something like `git version 2.43.0`

---

### 2. Installing Python 3.7+

Python is the programming language used by the slide builder tools.

#### Windows

1. Download Python from: https://www.python.org/downloads/
2. Click the yellow "Download Python 3.12.x" button (version may vary)
3. Run the installer (it will be named something like `python-3.12.0-amd64.exe`)
4. **IMPORTANT:** Check the box that says **"Add Python to PATH"** at the bottom of the installer window
5. Click "Install Now"
6. Wait for installation to complete and click "Close"

**Verify installation:**
1. Open a NEW Command Prompt window (important - close old ones first!)
2. Type: `python --version`
3. You should see something like `Python 3.12.0`
4. Type: `pip --version`
5. You should see information about pip (Python's package installer)

#### Mac

macOS comes with Python, but it might be an older version. Let's install the latest version:

1. Download Python from: https://www.python.org/downloads/
2. Click the yellow "Download Python 3.12.x" button (version may vary)
3. Run the downloaded `.pkg` file
4. Follow the installation prompts, clicking "Continue" and "Install"
5. Enter your Mac password when prompted
6. Click "Close" when done

**Verify installation:**
1. Open Terminal
2. Type: `python3 --version`
3. You should see something like `Python 3.12.0`
4. Type: `pip3 --version`
5. You should see information about pip (Python's package installer)

**Note:** On Mac, you use `python3` and `pip3` (not just `python` and `pip`)

---

### 3. Installing Visual Studio Code

VS Code is a free code editor that makes it easy to edit markdown files and see your changes.

#### Windows & Mac (same process)

1. Download VS Code from: https://code.visualstudio.com/
2. Click the download button for your operating system
3. Run the installer:
   - **Windows:** Run the `.exe` file, accept the agreement, and click through the installer
     - When asked, check the boxes for "Add to PATH" and "Create a desktop icon" (optional but helpful)
   - **Mac:** Open the `.zip` file, drag Visual Studio Code to your Applications folder
4. Launch VS Code:
   - **Windows:** Find VS Code in your Start Menu or desktop
   - **Mac:** Open it from your Applications folder or Spotlight (Cmd+Space, type "Visual Studio Code")

**First-time setup:**
- When you first open VS Code, you may see welcome screens - you can close these or explore them
- VS Code may ask about extensions - we'll install those later

---

### 4. Installing Node.js

Node.js is needed to install and run Marp CLI, which converts your slides to PDF.

#### Windows

1. Download Node.js from: https://nodejs.org/
2. Click the green button for the "LTS" (Long Term Support) version
3. Run the installer (it will be named something like `node-v20.10.0-x64.msi`)
4. Click through the installer accepting the defaults
5. Click "Finish" when done

**Verify installation:**
1. Open a NEW Command Prompt window (close old ones first!)
2. Type: `node --version`
3. You should see something like `v20.10.0`
4. Type: `npm --version`
5. You should see something like `10.2.3`

#### Mac

1. Download Node.js from: https://nodejs.org/
2. Click the green button for the "LTS" (Long Term Support) version
3. Run the downloaded `.pkg` file
4. Follow the installation prompts
5. Enter your Mac password when prompted
6. Click "Close" when done

**Verify installation:**
1. Open Terminal
2. Type: `node --version`
3. You should see something like `v20.10.0`
4. Type: `npm --version`
5. You should see something like `10.2.3`

---

### 5. Installing Marp CLI

Marp CLI is the tool that converts markdown slides into beautiful PDFs.

#### Windows

1. Open Command Prompt
2. Type the following command and press Enter:
   ```bash
   npm install -g @marp-team/marp-cli
   ```
3. Wait for the installation to complete (may take a minute or two)
4. You may see some warnings - these are usually safe to ignore

**Verify installation:**
1. Type: `marp --version`
2. You should see something like `@marp-team/marp-cli v3.4.0`

#### Mac

1. Open Terminal
2. Type the following command and press Enter:
   ```bash
   npm install -g @marp-team/marp-cli
   ```
3. Wait for the installation to complete (may take a minute or two)
4. You may see some warnings - these are usually safe to ignore

**Verify installation:**
1. Type: `marp --version`
2. You should see something like `@marp-team/marp-cli v3.4.0`

---

### 6. Cloning the Repository

Now that you have Git installed, you can download the FASTR slide builder repository.

#### Windows

1. Open Command Prompt
2. Navigate to where you want to store the project. For example, to use your Desktop:
   ```bash
   cd Desktop
   ```
3. Clone the repository (replace `<repository-url>` with the actual URL):
   ```bash
   git clone <repository-url>
   ```
4. Navigate into the project folder:
   ```bash
   cd fastr-slide-builder
   ```

#### Mac

1. Open Terminal
2. Navigate to where you want to store the project. For example, to use your Desktop:
   ```bash
   cd ~/Desktop
   ```
3. Clone the repository (replace `<repository-url>` with the actual URL):
   ```bash
   git clone <repository-url>
   ```
4. Navigate into the project folder:
   ```bash
   cd fastr-slide-builder
   ```

---

### 7. Opening the Repository in VS Code

#### Windows

**Option 1: From Command Prompt**
1. If you're still in the `fastr-slide-builder` folder from the previous step, type:
   ```bash
   code .
   ```
   (The dot means "current folder")

**Option 2: From VS Code**
1. Open VS Code
2. Click "File" → "Open Folder"
3. Navigate to where you cloned the repository
4. Select the `fastr-slide-builder` folder and click "Select Folder"

#### Mac

**Option 1: From Terminal**
1. If you're still in the `fastr-slide-builder` folder from the previous step, type:
   ```bash
   code .
   ```
   (The dot means "current folder")

**Option 2: From VS Code**
1. Open VS Code
2. Click "File" → "Open"
3. Navigate to where you cloned the repository
4. Select the `fastr-slide-builder` folder and click "Open"

---

### 8. Installing Recommended VS Code Extensions

VS Code extensions add helpful features. The repository has already configured which extensions to recommend in `.vscode/settings.json`.

1. When you first open the repository in VS Code, you may see a notification in the bottom-right corner asking if you want to install recommended extensions
2. Click "Install All" if you see this notification

**If you don't see the notification:**
1. Click the Extensions icon in the left sidebar (it looks like four squares)
2. In the search box, type: `@recommended`
3. You'll see a section called "WORKSPACE RECOMMENDATIONS"
4. Click the cloud download icon next to each recommended extension

**Recommended extensions typically include:**
- **Markdown All in One** - Better markdown editing with shortcuts
- **Markdown Preview Marp** - Preview your Marp slides in VS Code
- **Code Spell Checker** - Catches typos in your content

---

### 9. Verify Everything Works

Let's make sure everything is set up correctly by building the example workshop.

#### Windows

1. Open Command Prompt
2. Navigate to the repository folder (if not already there):
   ```bash
   cd Desktop\fastr-slide-builder
   ```
3. Build the example deck:
   ```bash
   python tools/build_deck.py --workshop example
   ```
4. You should see output like "Successfully built deck..." and the file `outputs/example_deck.md` should be created
5. Convert to PDF:
   ```bash
   marp outputs/example_deck.md --theme-set fastr-theme.css --pdf
   ```
6. You should now have `outputs/example_deck.pdf` - open it to view your first built deck!

#### Mac

1. Open Terminal
2. Navigate to the repository folder (if not already there):
   ```bash
   cd ~/Desktop/fastr-slide-builder
   ```
3. Build the example deck:
   ```bash
   python3 tools/build_deck.py --workshop example
   ```
4. You should see output like "Successfully built deck..." and the file `outputs/example_deck.md` should be created
5. Convert to PDF:
   ```bash
   marp outputs/example_deck.md --theme-set fastr-theme.css --pdf
   ```
6. You should now have `outputs/example_deck.pdf` - open it to view your first built deck!

**To open the PDF:**
- **Windows:** Type `start outputs\example_deck.pdf`
- **Mac:** Type `open outputs/example_deck.pdf`

---

### 10. Installing Pandoc (Optional)

Pandoc allows you to export slides to PowerPoint (.pptx) format. This is optional - you only need it if you want to create PowerPoint files.

#### Windows

1. Download Pandoc from: https://pandoc.org/installing.html
2. Click the Windows installer link (`.msi` file)
3. Run the installer and follow the prompts
4. Click "Finish" when done

**Verify installation:**
1. Open a NEW Command Prompt window
2. Type: `pandoc --version`
3. You should see version information

#### Mac

**Option 1: Using Homebrew (recommended if you have it)**
1. Open Terminal
2. If you have Homebrew installed, type:
   ```bash
   brew install pandoc
   ```

**Option 2: Direct download**
1. Download Pandoc from: https://pandoc.org/installing.html
2. Click the macOS installer link (`.pkg` file)
3. Run the installer and follow the prompts
4. Enter your Mac password when prompted

**Verify installation:**
1. In Terminal, type: `pandoc --version`
2. You should see version information

**To use Pandoc for PowerPoint export:**
```bash
# After building your deck
pandoc outputs/example_deck.md -o outputs/example_deck.pptx
```

---

### You're All Set!

Congratulations! You've successfully set up your development environment for the FASTR slide builder. Here's what you can do now:

1. **Edit slides** - Open any `.md` file in VS Code and start editing
2. **Build decks** - Use the Python build script to combine content
3. **Generate PDFs** - Use Marp CLI to create beautiful slide PDFs
4. **Preview changes** - Use VS Code's Markdown Preview Marp extension to see your slides

### Quick Reference Commands

**Build a workshop deck:**
```bash
# Windows
python tools/build_deck.py --workshop example

# Mac
python3 tools/build_deck.py --workshop example
```

**Convert to PDF:**
```bash
marp outputs/example_deck.md --theme-set fastr-theme.css --pdf
```

**Open the project in VS Code:**
```bash
code .
```

### Important Note About Settings

The repository includes a `.vscode/settings.json` file that's already configured with optimal settings for working with markdown and Marp. You don't need to change any settings - everything is ready to go!

---

## Getting Started

## Types of Contributions

### 1. Editing Core Content

**What:** Shared FASTR methodology modules (7 sections)

**When to edit:**
- Updating methodology
- Fixing typos or errors
- Improving explanations
- Adding/updating diagrams

**Where:** `core_content/*.md`

**Process:**
1. Edit the relevant file in `core_content/`
2. Test with example workshop:
   ```bash
   python3 tools/build_deck.py --workshop example
   marp outputs/example_deck.md --theme-set fastr-theme.css --pdf
   ```
3. Review the output
4. Commit with descriptive message
5. Push to shared repository

**Example:**
```bash
# Edit file
code core_content/04_data_quality_assessment.md

# Test
python3 tools/build_deck.py --workshop example

# Commit
git add core_content/04_data_quality_assessment.md
git commit -m "Update DQA section: add missing indicators"
git push
```

### 2. Creating Workshop-Specific Content

**What:** Custom slides for a specific workshop

**When to create:**
- New country workshop
- Specialized training session
- Custom results presentation

**Where:** `workshops/{workshop_id}/`

**Process:**
1. Copy example workshop:
   ```bash
   cp -r workshops/example workshops/2025_01_yourcountry
   ```

2. Edit configuration:
   ```bash
   code workshops/2025_01_yourcountry/config.py
   ```

3. Add custom slides (optional):
   ```bash
   code workshops/2025_01_yourcountry/custom_slides.md
   ```

4. Add agenda image (optional):
   ```bash
   # Place your agenda.png in the workshop folder
   cp ~/Desktop/agenda.png workshops/2025_01_yourcountry/
   ```

5. Build and test:
   ```bash
   python3 tools/build_deck.py --workshop 2025_01_yourcountry
   ```

6. Commit workshop folder:
   ```bash
   git add workshops/2025_01_yourcountry/
   git commit -m "Add Nigeria 2025 workshop"
   git push
   ```

### 3. Updating Templates

**What:** Reusable slide templates (title, breaks, agenda, closing)

**When to edit:**
- Changing template layout
- Adding new variables
- Updating branding

**Where:** `templates/*.md`

**Process:**
1. Edit template file
2. Test with example workshop
3. Verify variable substitution works
4. Commit changes

**Note:** Template changes affect ALL future decks. Coordinate with team first.

### 4. Improving Build Tools

**What:** Python build scripts

**When to edit:**
- Bug fixes
- New features
- Performance improvements

**Where:** `tools/*.py`

**Process:**
1. Make changes
2. Test thoroughly with multiple workshops
3. Update documentation if needed
4. Commit with detailed message

## Workflow Guidelines

### Branch Strategy (Optional)

For major changes, use feature branches:

```bash
# Create feature branch
git checkout -b update-dqa-section

# Make changes
code core_content/04_data_quality_assessment.md

# Test
python3 tools/build_deck.py --workshop example

# Commit
git add core_content/04_data_quality_assessment.md
git commit -m "Update DQA section with new indicators"

# Push branch
git push -u origin update-dqa-section

# Create pull request (if using GitHub/GitLab)
```

### Direct to Main (Simple Changes)

For small fixes (typos, minor updates):

```bash
# Make change
code core_content/01_background_rationale.md

# Test
python3 tools/build_deck.py --workshop example

# Commit and push
git add core_content/01_background_rationale.md
git commit -m "Fix typo in background section"
git push
```

## Best Practices

### Testing

**Always test before committing:**
```bash
# Build example deck
python3 tools/build_deck.py --workshop example

# Render to PDF
marp outputs/example_deck.md --theme-set fastr-theme.css --pdf

# Review the output
open outputs/example_deck.pdf
```

### Markdown Style

**Headings:**
- Use `#` for slide titles
- Use `##` for main headings
- Use `###` for subheadings

**Lists:**
- Use `-` for bullet points
- Use `1.` for numbered lists

**Images:**
```markdown
![Description](../assets/image.png)
```

**Slide Breaks:**
```markdown
---
```

### Variable Naming

When adding new template variables, use `{{UPPERCASE_WITH_UNDERSCORES}}`:

```markdown
# {{WORKSHOP_NAME}}
**Date:** {{DATE}}
**Custom Field:** {{NEW_VARIABLE}}
```

Update `build_deck.py` to support new variables:
```python
'NEW_VARIABLE': config.get('new_variable', ''),
```

### File Organization

**Core content:** Generic FASTR methodology only
**Custom slides:** Country/workshop-specific content only
**Assets:** Images used by multiple workshops
**Workshop folders:** Workshop-specific images and content

## Commit Message Guidelines

### Format

```
<type>: <short description>

<optional longer description>
<optional details>
```

### Types

- `content:` - Changes to core content
- `workshop:` - New or updated workshop
- `template:` - Changes to slide templates
- `tools:` - Updates to build scripts
- `docs:` - Documentation updates
- `fix:` - Bug fixes
- `style:` - Formatting/styling changes

### Examples

**Good:**
```
content: Update DQA section with 2025 indicators

Added new indicators for malaria and COVID-19 tracking.
Updated example visualizations.
```

```
workshop: Add Nigeria January 2025 workshop

3-day workshop in Abuja covering sections 1-6.
Includes custom slides on Nigeria DHIS2 implementation.
```

```
fix: Correct image path in coverage analysis

Changed relative path from ./assets/ to ../assets/
to match new folder structure.
```

**Avoid:**
```
updated stuff
fixed things
changes
```

## Working with Images

### Adding Images to Core Content

1. Place image in `assets/`:
   ```bash
   cp ~/Desktop/diagram.png assets/
   ```

2. Reference in markdown:
   ```markdown
   ![FASTR Approach Diagram](../assets/diagram.png)
   ```

3. Commit both:
   ```bash
   git add assets/diagram.png core_content/02_fastr_approach.md
   git commit -m "content: Add FASTR approach diagram"
   ```

### Adding Workshop-Specific Images

1. Place in workshop folder:
   ```bash
   cp ~/Desktop/nigeria_results.png workshops/2025_01_nigeria/
   ```

2. Reference in custom slides:
   ```markdown
   ![Nigeria Results](nigeria_results.png)
   ```

## Questions?

- Check the main [README.md](README.md)
- Review existing workshops in `workshops/`
- Contact the FASTR team

## Code of Conduct

- Be respectful and professional
- Test your changes before committing
- Write clear commit messages
- Coordinate with team for major changes
- Ask questions when uncertain

Thank you for contributing to FASTR!
