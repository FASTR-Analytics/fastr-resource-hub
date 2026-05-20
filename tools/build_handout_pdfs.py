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
LANGS = ("en", "fr")
FACILITATOR_DIR = "Facilitator"


def module_names() -> dict:
    """Return {module_id: {'en': name, 'fr': name}} from modules.yaml."""
    data = yaml.safe_load(MODULES_FILE.read_text()) or {}
    names = {}
    for mod in data.get("modules", []):
        name = mod.get("name", {})
        names[mod["id"]] = {"en": name.get("en", mod["id"]), "fr": name.get("fr", mod["id"])}
    return names


def ordered_files(module_dir: Path, order: list) -> list:
    """Return module .md files sorted by _order.yaml, leftovers alphabetically."""
    present = {p.name: p for p in sorted(module_dir.glob("*.md"))}
    result = [present.pop(name) for name in order if name in present]
    result.extend(present[name] for name in sorted(present))
    return result


def is_facilitator(md_path: Path) -> bool:
    """True if the handout is facilitator-only (tagged in its meta-line).

    Matches the "facilitat" stem so it catches both English ("Facilitator
    notes", "Facilitator guide") and French ("Notes du facilitateur",
    "Guide du facilitateur") meta-line tags.
    """
    for line in md_path.read_text().splitlines():
        if "meta-line" in line:
            return "facilitat" in line.lower()
    return False


def main() -> int:
    ap = argparse.ArgumentParser(description="Build booklet-ready handout PDFs.")
    ap.add_argument("--lang", choices=LANGS, help="build only this language")
    ap.add_argument("--module", help="build only this module folder (e.g. m7)")
    args = ap.parse_args()

    order = yaml.safe_load(ORDER_FILE.read_text()) or {}
    names = module_names()
    langs = (args.lang,) if args.lang else LANGS

    # Full rebuilds start from a clean slate.
    if not args.lang and not args.module and OUT.exists():
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
