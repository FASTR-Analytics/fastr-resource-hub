# Working in GitHub Codespaces

## ⚠️ IMPORTANT: Always Save Your Work!

Codespaces are temporary environments. Follow these steps to avoid losing work:

## Quick Workflow Checklist

**Every time you start working:**
- [ ] Pull latest changes first
- [ ] Make your edits
- [ ] Commit your changes
- [ ] Push to GitHub
- [ ] Verify on GitHub.com

## Step-by-Step Guide

### 1. Starting a Work Session

**Before you start editing**, pull the latest changes:

```bash
# In Codespace terminal
git pull origin main
```

This ensures you have the latest work from your team.

### 2. Making Changes

Edit your files normally:
- Use VS Code editor in the browser
- Preview markdown with `Cmd/Ctrl+K V`
- Build decks, test locally

### 3. Saving Your Work (CRITICAL!)

**After making changes**, commit and push:

```bash
# Check what you changed
git status

# Stage your changes
git add .

# Commit with a message
git commit -m "Describe what you changed"

# Push to GitHub
git push origin main
```

### 4. Verify Your Work is Saved

**ALWAYS verify your changes are on GitHub:**

1. Go to: https://github.com/FASTR-Analytics/fastr-slide-builder/commits/main
2. You should see your commit at the top
3. ✅ Your work is safe!

## Using VS Code UI (Alternative)

### Commit & Push with Clicks

1. **Click Source Control icon** (left sidebar, 3 dots connected by lines)
2. **Review changes** - see what you modified
3. **Type commit message** in the box at top
4. **Click ✓ Commit** button
5. **Click "Sync Changes"** button (or push)
6. ✅ Done!

## Common Scenarios

### Scenario 1: Quick Edit

```bash
# 1. Pull latest
git pull origin main

# 2. Make your edit
# ... edit files ...

# 3. Save to GitHub
git add .
git commit -m "Fix typo in workshop slides"
git push origin main
```

### Scenario 2: Building a Deck

```bash
# 1. Pull latest
git pull origin main

# 2. Create workshop (or edit existing)
python3 tools/01_setup_workshop.py

# 3. Build
python3 tools/03_build_deck.py --workshop 2025-country

# 4. Save your config to GitHub
git add workshops/2025-country/
git commit -m "Add 2025 country workshop config"
git push origin main

# Note: Don't commit the generated outputs/*.md or *.pdf files!
```

### Scenario 3: Multi-Day Work

**End of Day 1:**
```bash
# Save your work before leaving
git add .
git commit -m "WIP: Working on new workshop slides"
git push origin main

# Can safely close Codespace or let it auto-stop
```

**Start of Day 2:**
```bash
# Pull to get your work + any teammate changes
git pull origin main

# Continue working...
```

## ⚠️ What NOT to Do

### ❌ Don't Close Without Committing

```bash
# BAD: Edited files but didn't commit
# ... made changes ...
# [closes browser tab]
# ❌ Changes lost if Codespace is deleted!
```

### ❌ Don't Work Without Pulling First

```bash
# BAD: Didn't pull before editing
# ... made changes ...
git push
# ❌ Gets "divergent branches" error!
```

### ✅ Always Do This Instead

```bash
# GOOD: Pull, edit, commit, push
git pull origin main
# ... make changes ...
git add .
git commit -m "My changes"
git push origin main
# ✅ Safe!
```

## Troubleshooting

### "Divergent Branches" Error

If you see:
```
fatal: Need to specify how to reconcile divergent branches
```

**Option 1: Discard your local changes (if not important)**
```bash
git fetch origin
git reset --hard origin/main
```

**Option 2: Keep your changes (merge)**
```bash
git config pull.rebase false
git pull origin main
# Follow prompts to merge
git push origin main
```

**Option 3: Start fresh (easiest)**
1. Copy any important work to another file
2. Delete this Codespace
3. Create new Codespace
4. Paste your work back

### "Cannot Push" / "Permission Denied"

You might not have write access to the repository. Contact repository admin.

### "Conflicts" When Pulling

Someone edited the same file as you:

```bash
# Pull shows conflicts
git pull origin main

# Open conflicted files (marked with >>>>>>>)
# Edit to resolve conflicts
# Save files

# Commit the resolution
git add .
git commit -m "Resolve merge conflicts"
git push origin main
```

## Best Practices

### ✅ Commit Often

**Good:**
```bash
# Small, frequent commits
git commit -m "Add title slide"
git commit -m "Add agenda slide"
git commit -m "Add custom content"
git push origin main
```

**Bad:**
```bash
# One huge commit at end of day
# ... 3 hours of work ...
git commit -m "Did stuff"
# ❌ Risky! Harder to track changes
```

### ✅ Pull Before Starting

**Every time you open Codespace:**
```bash
git pull origin main
```

### ✅ Push Before Leaving

**Before closing browser or taking a break:**
```bash
git status  # Check what changed
git add .
git commit -m "Save progress on workshop deck"
git push origin main
```

### ✅ Use Descriptive Commit Messages

**Good:**
```bash
git commit -m "Add Nigeria 2025 workshop with custom slides"
git commit -m "Fix typo in data quality section"
git commit -m "Update agenda image for Kenya workshop"
```

**Bad:**
```bash
git commit -m "changes"
git commit -m "stuff"
git commit -m "aaa"
```

## Quick Reference Card

**Print this and keep nearby!**

```
┌─────────────────────────────────────────┐
│   CODESPACE WORKFLOW CHEAT SHEET        │
├─────────────────────────────────────────┤
│                                         │
│  1. START:  git pull origin main        │
│                                         │
│  2. EDIT:   Make your changes           │
│                                         │
│  3. SAVE:   git add .                   │
│             git commit -m "message"     │
│             git push origin main        │
│                                         │
│  4. VERIFY: Check GitHub.com            │
│                                         │
├─────────────────────────────────────────┤
│  NEVER close without pushing!           │
│  ALWAYS pull before editing!            │
└─────────────────────────────────────────┘
```

## Auto-Save Reminders

Consider setting a calendar reminder:
- Every 30 minutes: Commit & push
- Before lunch: Commit & push
- End of day: Commit & push

Or use this bash alias (add to `~/.bashrc` in Codespace):

```bash
alias save='git add . && git commit -m "Auto-save: $(date)" && git push origin main'
```

Then just type `save` to quickly commit and push!

## Summary

🎯 **The Golden Rule:**
> Pull before you start, push before you stop!

Follow this and you'll never lose work in Codespaces! 🎉
