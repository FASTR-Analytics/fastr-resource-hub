#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════
              FASTR POWERPOINT CONVERTER (Alternative Method)
═══════════════════════════════════════════════════════════════════════

⚠️  IMPORTANT: PDF is the RECOMMENDED export format!

This tool converts markdown to PowerPoint, but be aware:
  ❌ Fonts may need manual adjustment
  ❌ Layouts may not match perfectly
  ❌ Requires editing Slide Master for best results

✅ PDF export is easier and more consistent!

However, PowerPoint is useful when:
  ✓ You need to make last-minute edits
  ✓ Your team prefers PowerPoint
  ✓ You need editable text boxes

═══════════════════════════════════════════════════════════════════════
                         HOW TO USE
═══════════════════════════════════════════════════════════════════════

OPTION 1: Interactive Mode (Easiest!)
--------------------------------------
Just run without arguments and follow the prompts:

    python3 tools/04_convert_pptx.py

The script will:
  - Show you all available markdown decks
  - Ask which one to convert
  - Convert to PowerPoint
  - Tell you where to find it!


OPTION 2: Command Line (For Experts)
-------------------------------------
Specify the markdown file directly:

    python3 tools/04_convert_pptx.py outputs/2025-01-nigeria_deck.md

Or with custom template:

    python3 tools/04_convert_pptx.py outputs/deck.md --reference custom.pptx


═══════════════════════════════════════════════════════════════════════
                      BEFORE YOU START
═══════════════════════════════════════════════════════════════════════

1. Install Pandoc (if not already installed):

   Mac:     brew install pandoc
   Windows: See https://pandoc.org/installing.html
   Linux:   apt install pandoc

2. Build your deck first:

   python3 tools/03_build_deck.py --workshop YOUR-WORKSHOP

3. You should have a markdown file:

   outputs/YOUR-WORKSHOP_deck.md


═══════════════════════════════════════════════════════════════════════
                    BETTER ALTERNATIVE: USE PDF!
═══════════════════════════════════════════════════════════════════════

We STRONGLY recommend using PDF instead:

    marp outputs/YOUR-WORKSHOP_deck.md --theme-set fastr-theme.css --pdf

Why PDF is better:
  ✅ Perfect FASTR styling (teal colors, correct fonts)
  ✅ Works on any computer
  ✅ No layout issues
  ✅ Smaller file size
  ✅ Ready to present immediately

PowerPoint requires manual adjustments after export!

═══════════════════════════════════════════════════════════════════════
"""

import argparse
import os
import subprocess
import shutil
import sys
import re


# ═══════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════

def check_pandoc_installed():
    """
    Check if Pandoc is installed and available

    Returns True if installed, False otherwise
    """
    return shutil.which('pandoc') is not None


def install_pandoc():
    """
    Attempt to auto-install Pandoc based on the operating system

    Returns True if installation successful, False otherwise
    """
    import platform

    system = platform.system().lower()

    print("\n" + "=" * 70)
    print("              INSTALLING PANDOC")
    print("=" * 70)

    try:
        if system == 'linux':
            # Linux (including Codespaces)
            print("\nDetected Linux - installing via apt...")
            subprocess.run(['sudo', 'apt', 'update', '-y'], check=True, capture_output=True)
            subprocess.run(['sudo', 'apt', 'install', '-y', 'pandoc'], check=True)
            print("   Pandoc installed successfully!")
            return True

        elif system == 'darwin':
            # macOS
            if shutil.which('brew'):
                print("\nDetected macOS - installing via Homebrew...")
                subprocess.run(['brew', 'install', 'pandoc'], check=True)
                print("   Pandoc installed successfully!")
                return True
            else:
                print("\nHomebrew not found. Please install pandoc manually:")
                print("   brew install pandoc")
                return False

        else:
            # Windows or other
            print(f"\nAuto-install not supported on {system}.")
            print("Please install pandoc manually:")
            print("   https://pandoc.org/installing.html")
            return False

    except subprocess.CalledProcessError as e:
        print(f"\nInstallation failed: {e}")
        return False
    except Exception as e:
        print(f"\nError during installation: {e}")
        return False


def list_available_decks(base_dir):
    """
    Show all available markdown decks in outputs/ folder

    Returns list of .md files ready to convert
    """
    outputs_dir = os.path.join(base_dir, "outputs")

    if not os.path.exists(outputs_dir):
        return []

    decks = []
    for file in os.listdir(outputs_dir):
        if file.endswith('.md') and not file.startswith('.'):
            decks.append(file)

    return sorted(decks)


def prompt_for_deck(base_dir):
    """
    Interactive mode: Ask user which deck to convert

    Shows list of available decks and lets user choose
    """
    print("\n" + "═" * 70)
    print("              AVAILABLE DECKS TO CONVERT")
    print("═" * 70 + "\n")

    decks = list_available_decks(base_dir)

    if not decks:
        print("❌ No decks found in outputs/ folder!")
        print("\n💡 Build a deck first:")
        print("   python3 tools/03_build_deck.py --workshop YOUR-WORKSHOP")
        sys.exit(1)

    for i, deck in enumerate(decks, 1):
        # Show file size
        deck_path = os.path.join(base_dir, "outputs", deck)
        size = os.path.getsize(deck_path)
        size_kb = size / 1024
        print(f"  {i}. {deck} ({size_kb:.1f} KB)")

    print(f"\n  Total: {len(decks)} deck(s) available")
    print("\n" + "─" * 70)

    while True:
        try:
            choice = input("\nWhich deck do you want to convert to PowerPoint? (enter number or name): ").strip()

            # Try as number first
            if choice.isdigit():
                idx = int(choice) - 1
                if 0 <= idx < len(decks):
                    return decks[idx]

            # Try as name
            if choice in decks:
                return choice

            # Try with .md extension added
            if not choice.endswith('.md'):
                choice_with_ext = choice + '.md'
                if choice_with_ext in decks:
                    return choice_with_ext

            print(f"❌ Invalid choice. Please enter 1-{len(decks)} or a deck name.")

        except KeyboardInterrupt:
            print("\n\n👋 Cancelled by user")
            sys.exit(0)


def strip_marp_frontmatter(content):
    """
    Remove Marp YAML frontmatter that confuses pandoc

    Marp uses frontmatter for styling, but Pandoc doesn't need it
    """
    lines = content.split('\n')
    if lines[0].strip() == '---':
        # Find closing ---
        for i in range(1, min(len(lines), 20)):  # Check first 20 lines
            if lines[i].strip() == '---':
                # Remove frontmatter, keep rest
                return '\n'.join(lines[i+1:])
    return content


def convert_slide_breaks(content):
    """
    Convert Marp slide breaks (---) to pandoc slide breaks

    Ensures proper slide separation in PowerPoint
    """
    lines = content.split('\n')
    result = []

    for i, line in enumerate(lines):
        # If line is just --- (slide separator)
        if line.strip() == '---':
            # Add proper pandoc slide break (horizontal rule with blank lines)
            result.append('')
            result.append('---')
            result.append('')
        else:
            result.append(line)

    return '\n'.join(result)


def fix_image_paths(content, base_dir):
    """
    Convert relative image paths to absolute paths for pandoc
    Removes images that can't be found to prevent conversion errors

    Pandoc needs absolute paths to find images correctly
    """
    missing_images = []

    def replace_path(match):
        alt_text = match.group(1)
        img_path = match.group(2)

        # Skip URLs
        if img_path.startswith('http://') or img_path.startswith('https://'):
            return match.group(0)

        # List of paths to try
        paths_to_try = [
            os.path.join(base_dir, img_path),
            os.path.join(base_dir, img_path.lstrip('../')),
            os.path.join(base_dir, 'assets', os.path.basename(img_path)),
            os.path.join(base_dir, 'outputs', img_path),
            os.path.join(base_dir, 'outputs', img_path.lstrip('../')),
        ]

        # Also try relative to outputs folder
        if img_path.startswith('../'):
            paths_to_try.append(os.path.join(base_dir, img_path.replace('../', '')))

        for test_path in paths_to_try:
            if os.path.exists(test_path):
                abs_path = os.path.abspath(test_path)
                return f'![{alt_text}]({abs_path})'

        # Image not found - remove it to prevent pandoc error
        missing_images.append(img_path)
        return f'<!-- Image not found: {img_path} -->'

    result = re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', replace_path, content)

    if missing_images:
        print(f"   Note: {len(missing_images)} image(s) not found and skipped")

    return result


def convert_to_pptx(md_file, base_dir, reference_template=None, skip_confirmation=False):
    """
    MAIN FUNCTION: Convert markdown file to PowerPoint using pandoc

    This is the converter that creates editable PowerPoint files
    """

    # Check if pandoc is installed
    if not check_pandoc_installed():
        print("\n" + "=" * 70)
        print("              PANDOC NOT FOUND")
        print("=" * 70)
        print("\nPandoc is required to convert to PowerPoint.")

        # Offer to install automatically
        try:
            response = input("\nWould you like me to install it now? [Y/n]: ").strip().lower()
            if response in ['', 'y', 'yes']:
                if install_pandoc():
                    # Check again after installation
                    if check_pandoc_installed():
                        print("\nPandoc ready! Continuing with conversion...\n")
                    else:
                        print("\nInstallation completed but pandoc not found in PATH.")
                        print("Please restart your terminal and try again.")
                        return False
                else:
                    print("\n" + "-" * 70)
                    print("\nManual installation options:")
                    print("   Mac:     brew install pandoc")
                    print("   Linux:   sudo apt install pandoc")
                    print("   Windows: https://pandoc.org/installing.html")
                    print("\nOR use PDF export instead (recommended!):")
                    print("   marp outputs/your-deck.md --theme-set fastr-theme.css --pdf")
                    return False
            else:
                print("\nOR use PDF export instead (recommended!):")
                print("   marp outputs/your-deck.md --theme-set fastr-theme.css --pdf")
                return False
        except KeyboardInterrupt:
            print("\n\nCancelled.")
            return False

    # Get full path to markdown file
    if not md_file.startswith('/'):
        md_file = os.path.join(base_dir, md_file)

    # Check if markdown file exists
    if not os.path.exists(md_file):
        print(f"\n❌ Error: File not found: {md_file}")
        print(f"\n💡 Make sure you've built a deck first:")
        print(f"   python3 tools/03_build_deck.py --workshop YOUR-WORKSHOP")
        return False

    # Show what we're converting
    print("\n" + "═" * 70)
    print("           CONVERTING TO POWERPOINT")
    print("═" * 70)

    file_size = os.path.getsize(md_file) / 1024
    print(f"\n📄 Input:  {os.path.basename(md_file)} ({file_size:.1f} KB)")

    # Confirm conversion (unless skipped)
    if not skip_confirmation:
        print("\n⚠️  Reminder: PDF export is recommended for better results!")
        print("   PowerPoint may require manual font/layout adjustments.")
        print("\n" + "─" * 70)
        response = input("\n➤ Continue with PowerPoint conversion? [y/N]: ").strip().lower()
        if response not in ['y', 'yes']:
            print("\n💡 Using PDF instead:")
            print(f"   marp {md_file} --theme-set fastr-theme.css --pdf")
            print("\n👋 Conversion cancelled")
            return False

    # Read and process markdown
    print(f"\n🔧 Step 1: Processing markdown...")
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Get absolute directory for fixing paths
    md_dir = os.path.dirname(os.path.abspath(md_file))

    # Strip frontmatter, convert slide breaks, and fix image paths
    print(f"   ✓ Removing Marp frontmatter")
    cleaned_content = strip_marp_frontmatter(content)

    print(f"   ✓ Converting slide breaks")
    cleaned_content = convert_slide_breaks(cleaned_content)

    print(f"   ✓ Fixing image paths")
    cleaned_content = fix_image_paths(cleaned_content, base_dir)

    # Create temp file without frontmatter
    temp_file = md_file.replace('.md', '_temp.md')
    with open(temp_file, 'w', encoding='utf-8') as f:
        f.write(cleaned_content)

    # Build output filename
    pptx_file = md_file.replace('.md', '.pptx')

    # Determine which reference template to use
    reference_msg = ""
    if reference_template and os.path.exists(reference_template):
        reference_doc = reference_template
        reference_msg = f"custom template: {os.path.basename(reference_template)}"
    elif os.path.exists(os.path.join(base_dir, 'fastr-reference.pptx')):
        reference_doc = os.path.join(base_dir, 'fastr-reference.pptx')
        reference_msg = "FASTR template (fastr-reference.pptx)"
    else:
        reference_doc = None
        reference_msg = "default Pandoc styling"

    print(f"\n🎨 Step 2: Applying template...")
    print(f"   ✓ Using {reference_msg}")

    # Build pandoc command
    cmd = [
        'pandoc', temp_file,
        '-f', 'markdown-yaml_metadata_block',
        '-t', 'pptx',
        '--resource-path', md_dir,
        '-o', pptx_file
    ]

    if reference_doc:
        cmd.extend(['--reference-doc', reference_doc])

    # Run conversion
    print(f"\n🔨 Step 3: Converting to PowerPoint...")
    try:
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)

        output_size = os.path.getsize(pptx_file) / 1024

        print("\n" + "═" * 70)
        print("                    ✅ SUCCESS!")
        print("═" * 70)
        print(f"\n📊 Output: {os.path.basename(pptx_file)} ({output_size:.1f} KB)")
        print(f"   Location: {pptx_file}")

        print(f"\n⚠️  IMPORTANT: Check your PowerPoint file!")
        print(f"   You may need to:")
        print(f"   1. Adjust font sizes (View → Slide Master)")
        print(f"   2. Fix any layout issues")
        print(f"   3. Verify FASTR teal color (#0f706d)")

        print(f"\n💡 To avoid manual fixes, use PDF:")
        print(f"   marp {md_file} --theme-set fastr-theme.css --pdf")

        print("\n" + "═" * 70 + "\n")

        return True

    except subprocess.CalledProcessError as e:
        print(f"\n❌ Conversion failed!")
        if e.stderr:
            print(f"   Error: {e.stderr}")
        print(f"\n💡 Try PDF export instead:")
        print(f"   marp {md_file} --theme-set fastr-theme.css --pdf")
        return False

    finally:
        # Clean up temp file
        if os.path.exists(temp_file):
            os.remove(temp_file)


def main():
    """
    Main entry point

    Handles both interactive mode and command-line arguments
    """

    # Determine base directory (parent of tools/)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.dirname(script_dir)  # Go up one level from tools/

    # Check if user provided command-line arguments
    if len(sys.argv) > 1 and not sys.argv[1].startswith('-'):
        # ═══════════════════════════════════════════════════════════════
        # COMMAND LINE MODE
        # ═══════════════════════════════════════════════════════════════

        parser = argparse.ArgumentParser(
            description="Convert markdown to editable PowerPoint using pandoc",
            formatter_class=argparse.RawDescriptionHelpFormatter,
            epilog="""
Examples:
  python3 tools/04_convert_pptx.py outputs/example_deck.md
  python3 tools/04_convert_pptx.py outputs/my_deck.md --reference custom.pptx

Note: PDF export is recommended over PowerPoint!
  marp outputs/deck.md --theme-set fastr-theme.css --pdf

For more help, see: docs/building-decks.md
            """
        )

        parser.add_argument(
            'markdown_file',
            help='Markdown file to convert to PowerPoint'
        )

        parser.add_argument(
            '--reference',
            type=str,
            help='Custom PowerPoint reference template for styling'
        )

        args = parser.parse_args()

        # Convert the file (skip confirmation in command-line mode)
        success = convert_to_pptx(args.markdown_file, base_dir, args.reference, skip_confirmation=True)
        sys.exit(0 if success else 1)

    else:
        # ═══════════════════════════════════════════════════════════════
        # INTERACTIVE MODE (No file specified)
        # ═══════════════════════════════════════════════════════════════

        print("\n" + "═" * 70)
        print("         FASTR POWERPOINT CONVERTER")
        print("            (Interactive Mode)")
        print("═" * 70)

        # Remind about PDF
        print("\n⚠️  Reminder: PDF is the RECOMMENDED export format!")
        print("   PowerPoint requires manual adjustments after export.")
        print("\n💡 To use PDF instead (easier, better results):")
        print("   marp outputs/your-deck.md --theme-set fastr-theme.css --pdf")

        # Prompt user to select a deck
        deck_file = prompt_for_deck(base_dir)

        # Convert it!
        deck_path = os.path.join("outputs", deck_file)
        success = convert_to_pptx(deck_path, base_dir, skip_confirmation=False)
        sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
