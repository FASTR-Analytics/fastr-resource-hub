#!/usr/bin/env python3
"""Surface stale slides across the FASTR curriculum.

Reads `last_reviewed: YYYY-MM-DD` from each entry in every module's `_meta.yaml`
and lists slides that:
  - Have no `last_reviewed` field (never verified)
  - Have `last_reviewed` older than the staleness threshold (default 6 months)

Usage:
  python3 tools/check_content_freshness.py
  python3 tools/check_content_freshness.py --threshold-months 3
  python3 tools/check_content_freshness.py --lang fr
  python3 tools/check_content_freshness.py --strict   # exit 1 if any stale/unverified
"""
from __future__ import annotations

import argparse
import sys
from datetime import date, timedelta
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parent.parent
LANG_DIRS = {
    "en": REPO_ROOT / "core_content",
    "fr": REPO_ROOT / "core_content_fr",
}


def collect(lang: str, threshold_days: int) -> tuple[list, list, int]:
    """Return (never_reviewed, stale, fresh_count) for one language tree."""
    root = LANG_DIRS[lang]
    today = date.today()
    cutoff = today - timedelta(days=threshold_days)

    never: list[str] = []
    stale: list[tuple[int, str, str]] = []
    fresh = 0

    for module_dir in sorted(root.iterdir()):
        if not module_dir.is_dir():
            continue
        meta_path = module_dir / "_meta.yaml"
        if not meta_path.exists():
            continue
        data = yaml.safe_load(meta_path.read_text(encoding="utf-8")) or {}
        for entry in data.get("slides", []):
            file_id = f"{module_dir.name}/{entry['file']}"
            lr = entry.get("last_reviewed")
            if lr is None:
                never.append(file_id)
                continue
            lr_date = lr if isinstance(lr, date) else date.fromisoformat(str(lr))
            if lr_date < cutoff:
                stale.append(((today - lr_date).days, file_id, lr_date.isoformat()))
            else:
                fresh += 1

    return never, stale, fresh


def report(lang: str, never: list, stale: list, fresh: int, threshold_months: int, limit: int = 30) -> None:
    print(f"\n=== {lang.upper()} content freshness "
          f"(threshold: {threshold_months} months) ===")
    print(f"  Fresh (verified):    {fresh}")
    print(f"  Stale:               {len(stale)}")
    print(f"  Never reviewed:      {len(never)}")

    if stale:
        print(f"\n  Stale slides (oldest first):")
        stale.sort(reverse=True)
        for days, fid, lr in stale[:limit]:
            print(f"    {days:>4}d  {fid}  (last_reviewed: {lr})")
        if len(stale) > limit:
            print(f"    ... and {len(stale) - limit} more")

    if never:
        print(f"\n  Never reviewed:")
        for fid in never[:limit]:
            print(f"          {fid}")
        if len(never) > limit:
            print(f"    ... and {len(never) - limit} more")


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--threshold-months", type=int, default=6,
                   help="Months after which a slide is considered stale (default: 6)")
    p.add_argument("--lang", choices=["en", "fr", "both"], default="both",
                   help="Which language tree to scan (default: both)")
    p.add_argument("--strict", action="store_true",
                   help="Exit non-zero if any slide is stale or never-reviewed")
    p.add_argument("--limit", type=int, default=30,
                   help="Max rows per list to print (default: 30)")
    args = p.parse_args()

    threshold_days = args.threshold_months * 30
    langs = ["en", "fr"] if args.lang == "both" else [args.lang]

    any_issue = False
    for lang in langs:
        never, stale, fresh = collect(lang, threshold_days)
        report(lang, never, stale, fresh, args.threshold_months, args.limit)
        if never or stale:
            any_issue = True

    if args.strict and any_issue:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
