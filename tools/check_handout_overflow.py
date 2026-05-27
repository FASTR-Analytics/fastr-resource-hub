#!/usr/bin/env python3
"""Detect content that renders past the safe zone on handout PDF pages.

The handout theme reserves the bottom 38mm of every A4 page for the footer
(rule + "FASTR · <module>" line + page number). Anything else rendered into
that zone is overflow — it either overlaps the footer or gets clipped.

This script reads a handout PDF via `pdftotext -bbox-layout` and flags any
word whose top-Y falls inside the footer reserve, ignoring the footer line
itself ("FASTR · ..." + page number).

Usage:
    python3 tools/check_handout_overflow.py path/to/file.pdf [more.pdf ...]
    python3 tools/check_handout_overflow.py --dir handouts/_out

Exit code: 0 if clean, 1 if any overflow detected.
"""
from __future__ import annotations

import argparse
import re
import subprocess
import sys
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path

PAGE_HEIGHT_PT = 841.92  # A4 portrait at 72dpi
BOTTOM_PADDING_MM = 38.0
PT_PER_MM = 72.0 / 25.4
SAFE_Y_MAX = PAGE_HEIGHT_PT - BOTTOM_PADDING_MM * PT_PER_MM  # ~734pt

# Footer pattern: "FASTR · <anything>" followed somewhere by a page number.
_FOOTER_PREFIX = re.compile(r"^FASTR\s*[··]")
_PAGE_NUM = re.compile(r"^\d{1,3}$")


@dataclass
class Word:
    text: str
    x_min: float
    y_min: float
    x_max: float
    y_max: float


@dataclass
class PageReport:
    page_num: int
    overflow_words: list[Word]


class _BBoxParser(HTMLParser):
    """Parse pdftotext -bbox-layout XHTML output into per-page word lists."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.pages: list[list[Word]] = []
        self._cur_word_attrs: dict | None = None
        self._cur_text: list[str] = []

    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if tag == "page":
            self.pages.append([])
        elif tag == "word":
            self._cur_word_attrs = d
            self._cur_text = []

    def handle_data(self, data):
        if self._cur_word_attrs is not None:
            self._cur_text.append(data)

    def handle_endtag(self, tag):
        if tag == "word" and self._cur_word_attrs is not None:
            text = "".join(self._cur_text).strip()
            if text:
                self.pages[-1].append(Word(
                    text=text,
                    x_min=float(self._cur_word_attrs["xmin"]),
                    y_min=float(self._cur_word_attrs["ymin"]),
                    x_max=float(self._cur_word_attrs["xmax"]),
                    y_max=float(self._cur_word_attrs["ymax"]),
                ))
            self._cur_word_attrs = None
            self._cur_text = []


def _extract_pages(pdf_path: Path) -> list[list[Word]]:
    result = subprocess.run(
        ["pdftotext", "-bbox-layout", str(pdf_path), "-"],
        capture_output=True, text=True, check=True,
    )
    parser = _BBoxParser()
    parser.feed(result.stdout)
    return parser.pages


def _is_footer_word(word: Word, footer_line_y_min: float | None) -> bool:
    """A word is part of the footer if it shares a line with FASTR · ... or
    is an isolated page number in the footer Y band."""
    if footer_line_y_min is not None and abs(word.y_min - footer_line_y_min) < 4:
        return True
    if _FOOTER_PREFIX.match(word.text):
        return True
    if _PAGE_NUM.match(word.text) and word.y_min > SAFE_Y_MAX:
        return True
    return False


def _find_footer_y(words: list[Word]) -> float | None:
    """Return the y_min of the footer line ('FASTR · ...' anchor word)."""
    candidates = [w for w in words if w.text == "FASTR" and w.y_min > SAFE_Y_MAX]
    if not candidates:
        return None
    # Use the lowest (largest y) FASTR occurrence in the footer band.
    return max(candidates, key=lambda w: w.y_min).y_min


def check_pdf(pdf_path: Path) -> list[PageReport]:
    """Return a list of PageReport entries for pages that have overflow."""
    pages = _extract_pages(pdf_path)
    reports: list[PageReport] = []
    for i, words in enumerate(pages, 1):
        footer_y = _find_footer_y(words)
        overflow = [
            w for w in words
            if w.y_min > SAFE_Y_MAX and not _is_footer_word(w, footer_y)
        ]
        if overflow:
            reports.append(PageReport(page_num=i, overflow_words=overflow))
    return reports


def _format_report(pdf_path: Path, reports: list[PageReport], repo_root: Path) -> str:
    try:
        rel = pdf_path.relative_to(repo_root)
    except ValueError:
        rel = pdf_path
    lines = [f"\n  {rel}"]
    for r in reports:
        sample = " ".join(w.text for w in r.overflow_words[:14])
        if len(r.overflow_words) > 14:
            sample += f" ... (+{len(r.overflow_words) - 14} more)"
        lines.append(f"    page {r.page_num}: {sample}")
    return "\n".join(lines)


def main() -> int:
    ap = argparse.ArgumentParser(description="Detect handout PDF overflow into the footer zone.")
    ap.add_argument("paths", nargs="*", help="PDF files to check")
    ap.add_argument("--dir", help="recursively check every PDF under this directory")
    ap.add_argument("--quiet", action="store_true", help="print only on failure")
    args = ap.parse_args()

    repo_root = Path(__file__).resolve().parent.parent

    targets: list[Path] = [Path(p) for p in args.paths]
    if args.dir:
        targets.extend(sorted(Path(args.dir).rglob("*.pdf")))
    if not targets:
        ap.error("provide at least one PDF path or --dir")

    bad = 0
    for pdf in targets:
        if not pdf.exists():
            print(f"missing: {pdf}", file=sys.stderr)
            bad += 1
            continue
        reports = check_pdf(pdf)
        if reports:
            print(_format_report(pdf, reports, repo_root))
            bad += 1
        elif not args.quiet:
            try:
                rel = pdf.relative_to(repo_root)
            except ValueError:
                rel = pdf
            print(f"ok    {rel}")

    if bad:
        print(f"\n{bad} PDF(s) have content overflowing the footer reserve.")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
