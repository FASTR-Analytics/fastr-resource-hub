#!/usr/bin/env python3
"""Build booklet-ready handout PDFs.

Renders every handout markdown file to PDF and organises the output under
``handouts/_out/<lang>/`` for printing and binding:

  * Participant handouts go in ``<lang>/<Module Name>/``.
  * Facilitator-only material (anything tagged "Facilitator notes" in its
    meta-line) is kept separate under ``<lang>/Facilitator/<Module Name>/``.

Module folders use the human-readable names from ``modules.yaml`` (e.g.
"Instance Setup", not "m9a"). Each PDF is prefixed with a two-digit sequence
number from ``handouts/_order.yaml`` so a folder can be printed and bound in
workshop order.

Usage:
    python3 tools/build_handout_pdfs.py             # build everything
    python3 tools/build_handout_pdfs.py --lang en   # one language
    python3 tools/build_handout_pdfs.py --module m7 # one module folder
"""
import argparse
import re
import shutil
import subprocess
import sys
from pathlib import Path

import yaml

REPO = Path(__file__).resolve().parent.parent
HANDOUTS = REPO / "handouts"
ORDER_FILE = HANDOUTS / "_order.yaml"
MODULES_FILE = REPO / "modules.yaml"
OUT = HANDOUTS / "_out"
RENDER = REPO / "tools" / "render_handout.sh"
LANGS = ("en", "fr", "pt")
FACILITATOR_DIR = "Facilitator"


def module_names() -> dict:
    """Return {module_id: {'en': name, 'fr': name}} from modules.yaml."""
    data = yaml.safe_load(MODULES_FILE.read_text()) or {}
    names = {}
    for mod in data.get("modules", []):
        name = mod.get("name", {})
        en = name.get("en", mod["id"])
        names[mod["id"]] = {"en": en, "fr": name.get("fr", en), "pt": name.get("pt", en)}
    return names


def ordered_files(module_dir: Path, order: list) -> list:
    """Return module .md files sorted by _order.yaml, leftovers alphabetically."""
    present = {p.name: p for p in sorted(module_dir.glob("*.md"))}
    result = [present.pop(name) for name in order if name in present]
    result.extend(present[name] for name in sorted(present))
    return result


_HANDOUT_RE = re.compile(r"^handouts/(?:en|fr|pt)/([^/]+)/.*\.md$")


def detect_changed_modules() -> set:
    """Return module ids touched by uncommitted changes + the last commit.

    Used by --auto so a CI run (which only has the last commit's diff) and a
    local pre-commit run (which has working-tree changes) both work.
    """
    files: set = set()
    for cmd in (
        ["git", "status", "--porcelain"],
        ["git", "diff", "--name-only", "HEAD~1", "HEAD"],
    ):
        try:
            r = subprocess.run(cmd, capture_output=True, text=True, check=False, cwd=str(REPO))
            for line in r.stdout.splitlines():
                # `git status --porcelain` prefixes with status flags + space;
                # `git diff --name-only` gives bare paths. Strip both safely.
                f = line[3:].strip().strip('"') if cmd[1] == "status" else line.strip()
                if f:
                    files.add(f)
        except Exception:
            pass
    return {m.group(1) for f in files if (m := _HANDOUT_RE.match(f))}


def is_facilitator(md_path: Path) -> bool:
    """True if the handout is facilitator-only (tagged in its meta-line).

    Matches the "facilita" stem so it catches English ("Facilitator guide"),
    French ("Guide du facilitateur") and Portuguese ("Guia do facilitador")
    meta-line tags.
    """
    for line in md_path.read_text().splitlines():
        if "meta-line" in line:
            return "facilita" in line.lower()
    return False


def main() -> int:
    ap = argparse.ArgumentParser(description="Build booklet-ready handout PDFs.")
    ap.add_argument("--lang", choices=LANGS, help="build only this language")
    ap.add_argument("--module", help="build only this module folder (e.g. m7)")
    ap.add_argument(
        "--auto", action="store_true",
        help="auto-detect changed modules from git (uncommitted + last commit) and build only those",
    )
    args = ap.parse_args()

    auto_modules: set | None = None
    if args.auto:
        auto_modules = detect_changed_modules()
        if not auto_modules:
            print("No handout .md changes detected in working tree or last commit — nothing to rebuild.")
            return 0
        print(f"Auto-detected changed modules: {', '.join(sorted(auto_modules))}\n")

    order = yaml.safe_load(ORDER_FILE.read_text()) or {}
    names = module_names()
    langs = (args.lang,) if args.lang else LANGS

    # Start from a clean slate so renamed modules don't leave orphan folders
    # (e.g. an old English-named PT folder lingering after pt names were added).
    # A whole-language build clears that language's tree; a full build clears all.
    # Skip the clean slate for scoped builds (--module / --auto): they only touch
    # the folders they rebuild, so wiping everything would be destructive.
    if not args.module and not auto_modules:
        if args.lang:
            lang_out = OUT / args.lang
            if lang_out.exists():
                shutil.rmtree(lang_out)
        elif OUT.exists():
            shutil.rmtree(OUT)
    OUT.mkdir(parents=True, exist_ok=True)
    for stale in OUT.glob("*.pdf"):  # legacy flat layout
        stale.unlink()

    built = 0
    for lang in langs:
        lang_src = HANDOUTS / lang
        if not lang_src.is_dir():
            continue
        for module_dir in sorted(d for d in lang_src.iterdir() if d.is_dir()):
            module = module_dir.name
            if args.module and module != args.module:
                continue
            if auto_modules is not None and module not in auto_modules:
                continue
            files = ordered_files(module_dir, order.get(module, []))
            if not files:
                continue
            module_name = names.get(module, {}).get(lang, module)

            # Split participant vs facilitator; each set is numbered independently.
            participant = [f for f in files if not is_facilitator(f)]
            facilitator = [f for f in files if is_facilitator(f)]

            buckets = [(OUT / lang / module_name, participant)]
            if facilitator:
                buckets.append(
                    (OUT / lang / FACILITATOR_DIR / module_name, facilitator)
                )

            for dest_dir, bucket in buckets:
                if not bucket:
                    continue
                if dest_dir.exists():
                    shutil.rmtree(dest_dir)
                dest_dir.mkdir(parents=True, exist_ok=True)
                for idx, src in enumerate(bucket, 1):
                    prefix = f"h_{module}_"
                    short = src.stem[len(prefix):] if src.stem.startswith(prefix) else src.stem
                    dest = dest_dir / f"{idx:02d}_{short}.pdf"
                    print(f"[{lang}] {dest.relative_to(OUT)}")
                    subprocess.run(
                        ["bash", str(RENDER), str(src), str(dest)],
                        check=True, stdout=subprocess.DEVNULL,
                    )
                    built += 1

    print(f"\nDone — {built} PDF(s) written under {OUT.relative_to(REPO)}/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
