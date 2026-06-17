# Editing the FASTR methodology

This guide is for people who want to edit FASTR methodology content (the
documents in this `methodology/` folder) without touching any code. You will
not need to install Python, run scripts, or use a terminal.

Everything is in Markdown, which is a simple text format. If you know how
to write a Word document, you can write Markdown.

> **Prefer to watch instead of read?**
> A short walkthrough video is coming soon — it shows the whole
> clone-edit-commit-sync loop in under a minute.
<!-- TODO Claire: when you've recorded the screencast, drop the link here:
     `[Watch the 1-minute walkthrough](https://… loom or youtube unlisted)` -->


## What you need

- A **GitHub account** (free, sign up at <https://github.com/join>).
- **Visual Studio Code** (free, download from <https://code.visualstudio.com/>).
  We recommend VS Code because it has Markdown preview, GitHub integration,
  and Git built in. It works the same on Mac, Windows, and Linux.

Tell Claire your GitHub username so she can add you to the repository.

## One-time setup (about 10 minutes)

1. **Install VS Code.** Open the installer from
   <https://code.visualstudio.com/> and follow the prompts.

2. **Sign in to GitHub from VS Code.**
   - Open VS Code.
   - Click the **Accounts** icon in the bottom-left corner (it looks like a
     small person).
   - Choose **Sign in with GitHub** and follow the browser prompts.

3. **Clone the repository.** Cloning means downloading a copy you can edit.
   - In VS Code, click the **Source Control** icon in the left sidebar (it
     looks like a fork in a road).
   - Click **Clone Repository**.
   - Paste this URL when prompted:
     `https://github.com/FASTR-Analytics/fastr-resource-hub.git`
   - Choose a folder on your computer to store it (your Documents folder
     is fine).
   - When VS Code asks, open the cloned folder.

4. **Accept the recommended extensions** if VS Code prompts you. They give
   you Markdown preview and a few quality-of-life helpers.

You only do these steps once.

## Each time you want to edit

1. **Open VS Code.**

2. **Pull the latest changes** so you start from the most recent version.
   - In the **Source Control** panel, click the **...** menu at the top.
   - Choose **Pull**.

3. **Open the file you want to edit.** All methodology files live in the
   `methodology/` folder. The English files are at the top level. French
   and Portuguese translations are in `methodology/fr/` and
   `methodology/pt/`. For example:
   - `methodology/04_data_quality_assessment.md` (English)
   - `methodology/fr/04_data_quality_assessment.md` (French)
   - `methodology/pt/04_data_quality_assessment.md` (Portuguese)

4. **Edit.** While editing, press
   <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd> on Windows or
   <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd> on Mac to see a live
   preview of how your Markdown will render.

5. **Save.** <kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>S</kbd>.

6. **Commit and push your change.**
   - In the **Source Control** panel, you will see your edited file
     listed under **Changes**.
   - Click the **+** next to the file to stage it.
   - Type a short message in the message box that explains what you
     changed (for example, *"Update DQA outlier-detection paragraph for
     clarity"*).
   - Click the **✓ Commit** button.
   - Click the **Sync Changes** button (a circular arrow icon, often
     showing a small number).

That's it. Once you push, the website at <https://fastr-analytics.org>
will pick up your change on its next sync (usually within an hour), and
the workshop slides will regenerate automatically.

## Markdown basics

You only need to know a few things to write Markdown.

| To do this | Type this |
|------------|-----------|
| A heading | `## Heading text` (use more `#` for smaller headings) |
| **Bold** | `**bold**` |
| *Italic* | `*italic*` |
| A bulleted list | `- item one` (one per line, leading hyphen) |
| A numbered list | `1. item one` (one per line) |
| A link | `[link text](https://example.com)` |
| A table | See existing tables in the file — copy and adapt |

When in doubt, look at how the existing text is formatted and copy that
pattern.

## Things to avoid

- **Don't edit anything inside `<!-- SLIDE:... -->` blocks** unless you
  understand the slide-extraction system. Those markers are read by an
  automated script. If you delete a marker, a slide goes missing from
  workshops. If you are not sure, ask Claire before editing inside
  these blocks.

- **Don't rename or delete methodology files** without checking with
  Claire first. The filenames are referenced by other parts of the
  system.

- **Don't paste content from Word.** Word loves to add hidden formatting
  that breaks Markdown. Paste through a plain text editor first, or use
  <kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd> when
  pasting (the *paste as plain text* shortcut).

- **Don't commit very large changes in a single push.** If you reworked
  three sections, make three separate commits with short, descriptive
  messages. This makes it easier to undo a specific change later if
  something goes wrong.

## Translations

If you are editing a translation, only change the file in `fr/` or `pt/`.
The English version is the source of truth for structure, so the
translation should mirror it.

If the English version changes after you finish a translation, you may
need to re-sync. Claire or a maintainer will let you know.

## Where to get help

- **Stuck on Markdown?** Open any existing methodology file and copy
  the pattern you see.
- **Stuck on VS Code or GitHub?** GitHub's own guide at
  <https://docs.github.com/en/get-started/quickstart> is friendly.
- **Anything else?** Ask Claire.
