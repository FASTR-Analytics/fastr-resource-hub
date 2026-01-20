#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════
              FASTR PDF EXPORTER
═══════════════════════════════════════════════════════════════════════

Exports Marp markdown decks to PDF.

USAGE:
    python3 tools/04_export_pdf.py                           # Interactive
    python3 tools/04_export_pdf.py outputs/workshop_deck.md  # Direct
    python3 tools/04_export_pdf.py --install                 # Install browser

═══════════════════════════════════════════════════════════════════════
"""

import os
import subprocess
import sys
from pathlib import Path


def find_browser():
    """Find a suitable browser for Marp PDF export."""
    import shutil

    # macOS paths
    mac_browsers = [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
        "/Applications/Firefox.app/Contents/MacOS/firefox",
        "/Applications/Chromium.app/Contents/MacOS/Chromium",
    ]

    # Linux/Codespace paths (check PATH)
    linux_browsers = [
        "google-chrome",
        "google-chrome-stable",
        "chromium",
        "chromium-browser",
        "firefox",
        "microsoft-edge",
    ]

    # Check macOS paths first
    for browser in mac_browsers:
        if os.path.exists(browser):
            return browser

    # Check Linux browsers in PATH
    for browser in linux_browsers:
        path = shutil.which(browser)
        if path:
            return path

    # Check common Linux install locations
    linux_paths = [
        "/usr/bin/chromium",
        "/usr/bin/chromium-browser",
        "/usr/bin/google-chrome",
        "/usr/bin/google-chrome-stable",
        "/usr/bin/firefox",
        "/snap/bin/chromium",
    ]
    for path in linux_paths:
        if os.path.exists(path):
            return path

    return None


def install_browser():
    """Install Chromium on Linux."""
    print("\n" + "=" * 70)
    print("           INSTALLING BROWSER")
    print("=" * 70)

    # Check if we're on Linux
    if sys.platform != "linux":
        print("\n   Auto-install only supported on Linux.")
        print("   Please install Chrome, Edge, or Firefox manually.")
        return False

    print("\n   Installing Chromium via apt...")

    try:
        # Update package list
        print("   Running: apt-get update")
        result = subprocess.run(
            ["sudo", "apt-get", "update", "-qq"],
            capture_output=True,
            text=True
        )

        # Try different package names
        packages = ["chromium", "chromium-browser", "google-chrome-stable"]

        for package in packages:
            print(f"   Trying: apt-get install {package}")
            result = subprocess.run(
                ["sudo", "apt-get", "install", "-y", "-qq", package],
                capture_output=True,
                text=True
            )
            if result.returncode == 0:
                browser = find_browser()
                if browser:
                    print(f"\n   Success! Installed: {browser}")
                    return True

        # If apt fails, try snap
        print("   Trying: snap install chromium")
        result = subprocess.run(
            ["sudo", "snap", "install", "chromium"],
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            browser = find_browser()
            if browser:
                print(f"\n   Success! Installed: {browser}")
                return True

    except FileNotFoundError:
        print("   apt-get/snap not found")
    except Exception as e:
        print(f"   Error: {e}")

    print("\n   Auto-installation failed.")
    print("   Please install manually:")
    print("     sudo apt-get install chromium-browser")
    print("   or:")
    print("     sudo snap install chromium")
    return False


def list_available_decks(base_dir):
    """List markdown decks in outputs/ folder."""
    outputs_dir = os.path.join(base_dir, "outputs")
    if not os.path.exists(outputs_dir):
        return []

    decks = []
    for file in os.listdir(outputs_dir):
        if file.endswith('.md') and not file.startswith('.'):
            decks.append(file)

    return sorted(decks)


def prompt_for_deck(base_dir):
    """Interactive mode: ask user which deck to export."""
    print("\n" + "=" * 70)
    print("              AVAILABLE DECKS")
    print("=" * 70 + "\n")

    decks = list_available_decks(base_dir)

    if not decks:
        print("No decks found in outputs/ folder!")
        print("\nBuild a deck first:")
        print("   python3 tools/02_build_deck.py --workshop YOUR-WORKSHOP")
        sys.exit(1)

    for i, deck in enumerate(decks, 1):
        deck_path = os.path.join(base_dir, "outputs", deck)
        size = os.path.getsize(deck_path) / 1024
        print(f"  {i}. {deck} ({size:.1f} KB)")

    print("\n" + "-" * 70)

    while True:
        try:
            choice = input("\nWhich deck to export to PDF? (number or name): ").strip()

            if choice.isdigit():
                idx = int(choice) - 1
                if 0 <= idx < len(decks):
                    return decks[idx]

            if choice in decks:
                return choice

            if not choice.endswith('.md'):
                if choice + '.md' in decks:
                    return choice + '.md'

            print(f"Invalid choice. Enter 1-{len(decks)} or a deck name.")

        except KeyboardInterrupt:
            print("\n\nCancelled.")
            sys.exit(0)


def export_pdf(md_file, base_dir):
    """Export markdown file to PDF using Marp CLI."""

    if not os.path.exists(md_file):
        print(f"Error: File not found: {md_file}")
        return False

    print("\n" + "=" * 70)
    print("           EXPORTING TO PDF")
    print("=" * 70)

    # Find browser
    browser_path = find_browser()
    if not browser_path:
        print("\n   No browser found.")
        print("   Run: python3 tools/04_export_pdf.py --install")
        return False

    # Get browser display name
    browser_name = os.path.basename(browser_path)
    if '.app' in browser_path:
        browser_name = browser_path.split('.app')[0].split('/')[-1]

    print(f"\n   Browser: {browser_name}")
    print(f"   Input: {os.path.basename(md_file)}")

    # Build output path
    output_path = md_file.replace('.md', '.pdf')

    # Theme file
    theme_file = os.path.join(base_dir, "fastr-theme.css")

    # Build marp command
    cmd = [
        "marp",
        "--no-config",
        "--theme", theme_file,
        "--html",
        "--pdf",
        "--allow-local-files",
        "--browser-path", browser_path,
        md_file,
        "-o", output_path
    ]

    print(f"   Output: {os.path.basename(output_path)}")
    print("\n   Exporting", end="", flush=True)

    try:
        # Run with live output dots
        process = subprocess.Popen(
            cmd,
            cwd=base_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        # Wait for completion
        stdout, stderr = process.communicate()
        print()  # New line after dots

        if process.returncode != 0:
            print(f"\n   Error: {stderr}")
            return False

        if os.path.exists(output_path):
            file_size = os.path.getsize(output_path) / (1024 * 1024)
            print("\n" + "=" * 70)
            print("                    SUCCESS!")
            print("=" * 70)
            print(f"\n   Output: {output_path}")
            print(f"   Size: {file_size:.2f} MB")
            print("\n" + "=" * 70 + "\n")
            return True
        else:
            print("\n   Error: PDF was not created")
            return False

    except FileNotFoundError:
        print("\n\n   Error: Marp CLI not found!")
        print("   Install it with: npm install -g @marp-team/marp-cli")
        return False
    except Exception as e:
        print(f"\n\n   Error: {e}")
        return False


def main():
    """Main entry point."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.dirname(script_dir)

    # Handle --install flag
    if len(sys.argv) > 1 and sys.argv[1] == "--install":
        success = install_browser()
        sys.exit(0 if success else 1)

    # Check for browser first
    browser_path = find_browser()
    if not browser_path:
        print("\n" + "=" * 70)
        print("         FASTR PDF EXPORTER")
        print("=" * 70)
        print("\n   Error: No browser found!")
        print("\n   To install a browser, run:")
        print("     python3 tools/04_export_pdf.py --install")
        print("\n   Or install manually:")
        print("     sudo apt-get install chromium-browser")
        sys.exit(1)

    if len(sys.argv) > 1 and not sys.argv[1].startswith('-'):
        # Command line mode
        md_file = sys.argv[1]
        if not md_file.startswith('/'):
            md_file = os.path.join(base_dir, md_file)

        success = export_pdf(md_file, base_dir)
        sys.exit(0 if success else 1)

    else:
        # Interactive mode
        print("\n" + "=" * 70)
        print("         FASTR PDF EXPORTER")
        print("=" * 70)

        deck_file = prompt_for_deck(base_dir)
        deck_path = os.path.join(base_dir, "outputs", deck_file)

        success = export_pdf(deck_path, base_dir)
        sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
