#!/bin/bash
# FASTR Slide Builder - Setup Script
# Run this once to install all dependencies

set -e

echo "=== FASTR Slide Builder Setup ==="
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

echo "Using Python: $(which python3)"
echo ""

# Install Python dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Install strip-slides plugin
echo ""
echo "Installing strip-slides mkdocs plugin..."
cd methodology/plugins
pip install -e .
cd ../..

# Check for Node.js
if command -v npm &> /dev/null; then
    echo ""
    echo "Installing Node.js dependencies (marp-cli)..."
    npm install
else
    echo ""
    echo "WARNING: npm not found. Install Node.js to use marp-cli for slide generation."
    echo "Download from: https://nodejs.org/"
fi

echo ""
echo "=== Setup Complete ==="
echo ""
echo "IMPORTANT: Activate the virtual environment before running commands:"
echo "  source .venv/bin/activate"
echo ""
echo "Available commands (after activating venv):"
echo "  python3 tools/00_extract_slides.py                 # Extract slides from methodology"
echo "  python3 tools/01_new_workshop.py                   # Create new workshop"
echo "  python3 tools/02_build_deck.py --workshop example  # Validate + Build slide deck"
echo "  mkdocs serve                                       # Preview documentation"
echo ""
