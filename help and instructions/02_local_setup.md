# Local Setup Guide

Complete installation instructions for setting up the FASTR Resource Hub on your local machine.

> **Skill level:** Beginner-friendly for content editing (steps 1-7). The web app setup (step 9) requires comfort with the terminal but instructions are provided.

> **Note:** Most contributors don't need local setup! Use the [GitHub web editor](../CONTRIBUTING.md#editing-on-githubcom) for simple edits or [GitHub Codespaces](03_codespaces_setup.md) for a full environment without any installation.

This guide is for users who prefer to work locally. Follow these step-by-step instructions to install all necessary software.

---

## Overview of Required Software

You'll need to install:

1. **Git** - Version control system to download and manage code
2. **Python 3.7+** - Programming language used by content extraction scripts
3. **Visual Studio Code (VS Code)** - Code editor for editing slide content
4. **Node.js** - JavaScript runtime needed for the web app and Marp CLI
5. **Marp CLI** - Tool to convert Markdown slides to PDF (optional, web app can also export)

**Estimated time:** 30-45 minutes for complete setup

---

## Table of Contents

1. [Installing Git](#1-installing-git)
2. [Installing Python 3.7+](#2-installing-python-37)
3. [Installing Visual Studio Code](#3-installing-visual-studio-code)
4. [Installing Node.js](#4-installing-nodejs)
5. [Installing Marp CLI](#5-installing-marp-cli) (optional)
6. [Cloning the Repository](#6-cloning-the-repository)
7. [Opening in VS Code](#7-opening-the-repository-in-vs-code)
8. [Installing VS Code Extensions](#8-installing-recommended-vs-code-extensions)
9. [Setting Up the Web App](#9-setting-up-the-web-app)

---

## 1. Installing Git

Git is a tool that helps you download the repository and track changes to files.

### Windows

1. **Download Git:**
   - Go to: https://git-scm.com/download/win
   - Download will start automatically (file named like `Git-2.43.0-64-bit.exe`)

2. **Run the installer:**
   - Double-click the downloaded file
   - Click "Next" through most screens (defaults are fine)

3. **Important settings during installation:**
   - **"Adjusting your PATH environment"** → Select **"Git from the command line and also from 3rd-party software"**
   - **"Choosing the default editor"** → Select **"Use Visual Studio Code as Git's default editor"** (if available)
   - **"Configuring the line ending conversions"** → Select **"Checkout Windows-style, commit Unix-style line endings"**

4. **Complete installation:**
   - Click "Next" until you reach "Install"
   - Click "Install" and wait
   - Click "Finish" when done

5. **Verify installation:**
   ```bash
   # Open Command Prompt (Windows key, type "cmd", press Enter)
   git --version
   ```
   Expected output: `git version 2.43.0` (or similar)

### Mac

**Method 1: Automatic (Recommended)**

1. Open Terminal (Cmd+Space, type "terminal", press Enter)
2. Type: `git --version`
3. If Git is not installed, macOS will prompt you to install Command Line Developer Tools
4. Click "Install" and follow the prompts
5. Once complete, type `git --version` again to verify

**Method 2: Manual Download**

1. Download Git from: https://git-scm.com/download/mac
2. Open the downloaded `.dmg` or `.pkg` file
3. Follow the installation prompts
4. Click "Continue" and "Install"

**Verify installation:**
```bash
git --version
```
Expected output: `git version 2.43.0` (or similar)

---

## 2. Installing Python 3.7+

Python is the programming language used by the slide builder tools.

### Windows

1. **Download Python:**
   - Go to: https://www.python.org/downloads/
   - Click the yellow **"Download Python 3.12.x"** button (version number may vary)

2. **Run the installer:**
   - Double-click the downloaded file (e.g., `python-3.12.0-amd64.exe`)
   - **CRITICAL:** Check the box **"Add Python to PATH"** at the bottom of the window
   - Click **"Install Now"**

3. **Wait for installation:**
   - Installation takes 2-5 minutes
   - Click "Close" when done

4. **Verify installation:**
   ```bash
   # Open a NEW Command Prompt window (important!)
   python --version
   ```
   Expected output: `Python 3.12.0` (or similar)

   ```bash
   pip --version
   ```
   Expected output: Information about pip (Python's package installer)

**Troubleshooting:**
- If `python --version` doesn't work, you may need to use `python3 --version`
- If neither works, Python wasn't added to PATH - reinstall and check the box

### Mac

macOS comes with Python, but it might be an older version. Install the latest:

1. **Download Python:**
   - Go to: https://www.python.org/downloads/
   - Click the yellow **"Download Python 3.12.x"** button

2. **Run the installer:**
   - Open the downloaded `.pkg` file
   - Click "Continue" through the prompts
   - Click "Install"
   - Enter your Mac password when prompted
   - Click "Close" when done

3. **Verify installation:**
   ```bash
   python3 --version
   ```
   Expected output: `Python 3.12.0` (or similar)

   ```bash
   pip3 --version
   ```
   Expected output: Information about pip

**Note:** On Mac, use `python3` and `pip3` (not just `python` and `pip`)

---

## 3. Installing Visual Studio Code

VS Code is a free, powerful code editor that makes editing markdown files easy.

### Windows & Mac (Same Process)

1. **Download VS Code:**
   - Go to: https://code.visualstudio.com/
   - Click the download button for your operating system

2. **Install on Windows:**
   - Run the downloaded `.exe` file
   - Accept the license agreement
   - **Recommended:** Check these boxes:
     - "Add to PATH"
     - "Create a desktop icon"
     - "Register Code as an editor for supported file types"
   - Click "Next" → "Install"
   - Click "Finish"

3. **Install on Mac:**
   - Open the downloaded `.zip` file
   - Drag "Visual Studio Code" to your Applications folder
   - Open from Applications or Spotlight (Cmd+Space, type "Visual Studio Code")

4. **First launch:**
   - Open VS Code
   - You may see welcome screens - you can close or explore them
   - The editor is now ready!

**Optional: Add VS Code to your command line (Mac)**
1. Open VS Code
2. Press Cmd+Shift+P
3. Type "shell command"
4. Select "Shell Command: Install 'code' command in PATH"
5. Now you can type `code .` in Terminal to open folders

---

## 4. Installing Node.js

Node.js is needed to install and run Marp CLI, which converts slides to PDF.

### Windows

1. **Download Node.js:**
   - Go to: https://nodejs.org/
   - Click the green button for the **"LTS"** (Long Term Support) version
   - This downloads a file like `node-v20.10.0-x64.msi`

2. **Run the installer:**
   - Double-click the downloaded file
   - Click "Next" through the installer
   - Accept the license agreement
   - Keep all default settings
   - Click "Install"
   - Click "Finish"

3. **Verify installation:**
   ```bash
   # Open a NEW Command Prompt window
   node --version
   ```
   Expected output: `v20.10.0` (or similar)

   ```bash
   npm --version
   ```
   Expected output: `10.2.3` (or similar)

### Mac

1. **Download Node.js:**
   - Go to: https://nodejs.org/
   - Click the green button for the **"LTS"** version
   - This downloads a `.pkg` file

2. **Run the installer:**
   - Open the downloaded `.pkg` file
   - Click "Continue" through the prompts
   - Click "Install"
   - Enter your Mac password when prompted
   - Click "Close" when done

3. **Verify installation:**
   ```bash
   node --version
   ```
   Expected output: `v20.10.0` (or similar)

   ```bash
   npm --version
   ```
   Expected output: `10.2.3` (or similar)

---

## 5. Installing Marp CLI (optional)

Marp CLI is the tool that converts markdown slides into PDFs. **It's only needed if you want to render handouts or one-off slide files from the command line.** The web app (step 9) exports PDF and PPTX directly, so for most workflows you can skip this section.

### Windows

1. **Open Command Prompt**

2. **Install Marp CLI:**
   ```bash
   npm install -g @marp-team/marp-cli
   ```

3. **Wait for installation:**
   - Takes 1-3 minutes
   - You may see some warnings (usually safe to ignore)
   - Installation is complete when you see your command prompt again

4. **Verify installation:**
   ```bash
   marp --version
   ```
   Expected output: `@marp-team/marp-cli v3.4.0` (or similar)

### Mac

1. **Open Terminal**

2. **Install Marp CLI:**
   ```bash
   npm install -g @marp-team/marp-cli
   ```

3. **Wait for installation:**
   - Takes 1-3 minutes
   - You may see some warnings (usually safe to ignore)

4. **Verify installation:**
   ```bash
   marp --version
   ```
   Expected output: `@marp-team/marp-cli v3.4.0` (or similar)

**Troubleshooting:**
- If you get permission errors on Mac, try: `sudo npm install -g @marp-team/marp-cli`
- Enter your Mac password when prompted

---

## 6. Cloning the Repository

Now download the FASTR slide builder repository to your computer.

### Windows

1. **Open Command Prompt**

2. **Navigate to where you want the project:**
   ```bash
   # Example: Store on Desktop
   cd Desktop
   ```

3. **Clone the repository:**
   ```bash
   git clone https://github.com/FASTR-Analytics/fastr-resource-hub.git
   ```

4. **Navigate into the folder:**
   ```bash
   cd fastr-resource-hub
   ```

**What this does:**
- Downloads all files from GitHub
- Creates a `fastr-resource-hub` folder
- Sets up Git tracking for changes

### Mac

1. **Open Terminal**

2. **Navigate to where you want the project:**
   ```bash
   # Example: Store on Desktop
   cd ~/Desktop
   ```

3. **Clone the repository:**
   ```bash
   git clone https://github.com/FASTR-Analytics/fastr-resource-hub.git
   ```

4. **Navigate into the folder:**
   ```bash
   cd fastr-resource-hub
   ```

---

## 7. Opening the Repository in VS Code

### Windows

**Option 1: From Command Prompt (Easiest)**

If you're still in the `fastr-resource-hub` folder:
```bash
code .
```
(The dot means "current folder")

**Option 2: From VS Code**

1. Open VS Code
2. Click "File" → "Open Folder"
3. Navigate to `Desktop\fastr-resource-hub`
4. Click "Select Folder"

### Mac

**Option 1: From Terminal (Easiest)**

If you're still in the `fastr-resource-hub` folder:
```bash
code .
```

**Option 2: From VS Code**

1. Open VS Code
2. Click "File" → "Open"
3. Navigate to the `fastr-resource-hub` folder
4. Click "Open"

---

## 8. Installing Recommended VS Code Extensions

VS Code extensions add helpful features for working with markdown and Marp.

### Automatic Installation (Recommended)

1. When you first open the repository in VS Code, you may see a notification:
   - **"This workspace has extension recommendations"**
   - Click **"Install All"**

2. Wait for extensions to install (1-2 minutes)

3. Extensions are ready to use!

### Manual Installation

If you don't see the notification:

1. Click the **Extensions icon** in the left sidebar (four squares)

2. In the search box, type: `@recommended`

3. You'll see **"WORKSPACE RECOMMENDATIONS"**

4. Click the cloud/download icon next to each extension:
   - **Marp for VS Code** - Preview slides while editing
   - **Markdown All in One** - Better markdown editing
   - **Python** - Python language support

### Verify Extensions Are Working

1. **Open a markdown file:**
   - Click `methodology/04_data_quality_assessment.md`

2. **Open Marp preview:**
   - Click the Marp icon in the top-right corner
   - Or press Cmd+K V (Mac) / Ctrl+K V (Windows)

3. **You should see:**
   - Split view with markdown on left, preview on right
   - FASTR styling (teal headers, white background)
   - Live updates as you type

---

## 9. Setting Up the Web App

The web app is where you build workshops, preview slides, and export to PDF/PowerPoint.

### Install dependencies

```bash
# Navigate to the web app folder
cd web-app

# Install Node.js packages
npm install
```

### Start the web app

```bash
./dev.sh start
```

Then open http://localhost:5173 in your browser.

### Verify everything works

1. The web app should load showing the Content Library
2. Browse modules - you should see all FASTR modules with their slides
3. Try the Workshop Builder to create a test workshop
4. Export to Markdown, PDF, or PowerPoint

### Web app commands

```bash
cd web-app
./dev.sh start    # Start frontend + backend
./dev.sh stop     # Stop servers
./dev.sh restart  # Restart servers
./dev.sh status   # Check server status
```

### Also verify content tools

```bash
# From the repository root
python3 tools/00_extract_slides.py    # Extract slides from methodology
python3 tools/validate_content.py     # Validate content consistency
```

---

## Troubleshooting

### Git Issues

**"git: command not found"**
- Git not installed or not in PATH
- Restart your terminal after installation
- Reinstall Git with "Add to PATH" option

### Python Issues

**"python: command not found"**
- Try `python3` instead (Mac)
- Python not in PATH (Windows) - reinstall with "Add to PATH" checked
- Restart terminal after installation

**"No module named 'X'"**
- Missing Python package
- Usually not needed - build scripts use standard library only

### Node.js / npm Issues

**"npm: command not found"**
- Node.js not installed or not in PATH
- Restart terminal after installation
- Verify with `node --version`

**npm permission errors (Mac)**
- Use `sudo npm install -g @marp-team/marp-cli`
- Or configure npm to install globally without sudo

### Marp CLI Issues

**"marp: command not found"**
- Marp CLI not installed
- Run: `npm install -g @marp-team/marp-cli`
- Restart terminal after installation

**PDF has no styling**
- Missing `--theme fastr-theme.css` flag
- Run command from repository root
- Verify `fastr-theme.css` exists in folder

### VS Code Issues

**Can't open with `code .` command**
- Command not in PATH
- Windows: Reinstall with "Add to PATH" checked
- Mac: Run "Install 'code' command in PATH" from VS Code

**Extensions not installing**
- Check internet connection
- Try manual installation from Extensions marketplace
- Restart VS Code after installation

**Preview doesn't show FASTR styling**
- Make sure you opened the repository folder (not individual files)
- Verify `.vscode/settings.json` exists
- Restart VS Code

---

## Quick Reference Commands

### Content tools
```bash
# Extract slides from methodology files
python3 tools/00_extract_slides.py

# Validate content consistency
python3 tools/validate_content.py
```

### Web app
```bash
cd web-app && ./dev.sh start     # Start the web app
cd web-app && ./dev.sh stop      # Stop the web app
```

### Open in VS Code
```bash
code .
```

### Check versions
```bash
git --version
python3 --version
node --version
npm --version
```

---

## You're All Set!

Congratulations! You now have a complete local development environment.

### What You Can Do Now

1. **Edit methodology content** - Open files in `methodology/` and start editing
2. **Preview slides** - Use Marp preview in VS Code
3. **Build workshops** - Use the web app to create and export presentations
4. **Export to PDF/PowerPoint** - Via the web app's export feature
5. **Contribute** - Make improvements and share with the team

### Next Steps

- **Learn markdown:** See [Editing Content](01_editing_content.md)
- **Contribute content:** See [CONTRIBUTING.md](../CONTRIBUTING.md)
- **View methodology docs:** https://fastr-analytics.org

### Getting Help

- **Online documentation:** https://fastr-analytics.org
- **Help guides:** Browse this folder
- **Team:** Contact the FASTR team for support

---

**Note:** The repository includes pre-configured settings in `.vscode/settings.json` - no manual configuration needed. Everything is ready to go!
