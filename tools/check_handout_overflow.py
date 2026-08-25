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
from dataclasses import dataclass, field
from html.parser import HTMLParser
from pathlib import Path
from tempfile import TemporaryDirectory

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
class Image:
    """A placed raster image, in PDF points, with y measured from the page top."""
    y_min: float
    y_max: float


@dataclass
class PageReport:
    page_num: int
    overflow_words: list[Word]
    overflow_images: list[Image] = field(default_factory=list)


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


def _is_footer_word(word: Word, footer_mid_y: float | None) -> bool:
    """A word is part of the footer if it sits on the same baseline as
    'FASTR · ...' (matched on line middle-Y within 1.5pt) or is an isolated
    page number in the footer Y band."""
    if footer_mid_y is not None:
        word_mid_y = (word.y_min + word.y_max) / 2
        if abs(word_mid_y - footer_mid_y) < 1.5:
            return True
    if _FOOTER_PREFIX.match(word.text):
        return True
    if _PAGE_NUM.match(word.text) and word.y_min > SAFE_Y_MAX:
        return True
    return False


def _find_footer_y(words: list[Word]) -> float | None:
    """Return the middle-Y of the footer line (anchored on 'FASTR · ...')."""
    candidates = [w for w in words if w.text == "FASTR" and w.y_min > SAFE_Y_MAX]
    if not candidates:
        return None
    # Use the lowest (largest y) FASTR occurrence in the footer band.
    anchor = max(candidates, key=lambda w: w.y_min)
    return (anchor.y_min + anchor.y_max) / 2


# pdftocairo declares each raster once in <defs> as
#   <image id="source-N" ... height="H" .../>
# then places it with
#   <use xlink:href="#source-N" transform="matrix(a,b,c,d,e,f)"/>
# so the drawn height is H*d and the top edge is f, both in PDF points.
# The two attributes can appear in either order on the <use>, so they are
# matched separately rather than as one fixed sequence.
_DEF_RE = re.compile(r'<image\b[^>]*?\bid="([^"]+)"[^>]*?\bheight="([\d.]+)"[^>]*>')
_USE_RE = re.compile(r'<use\b[^>]*>')
_HREF_RE = re.compile(r'xlink:href="#([^"]+)"')
_MATRIX_RE = re.compile(
    r'transform="matrix\('
    r'\s*[\d.eE+-]+\s*,\s*[\d.eE+-]+\s*,\s*[\d.eE+-]+\s*,'
    r'\s*([\d.eE+-]+)\s*,\s*[\d.eE+-]+\s*,\s*([\d.eE+-]+)\s*\)"'
)


def _extract_images(pdf_path: Path, page_count: int) -> dict[int, list[Image]]:
    """Return {page_num: [Image, ...]} for raster images placed on each page.

    Text extraction can't see images, but an oversized screenshot is the most
    common way a handout overruns its page — so measure them separately via
    pdftocairo's SVG output, which exposes each image's placement matrix.
    """
    by_page: dict[int, list[Image]] = {}
    with TemporaryDirectory() as tmp:
        for page in range(1, page_count + 1):
            svg = Path(tmp) / f"p{page}.svg"
            r = subprocess.run(
                ["pdftocairo", "-svg", "-f", str(page), "-l", str(page),
                 str(pdf_path), str(svg)],
                capture_output=True, text=True, check=False,
            )
            if r.returncode != 0 or not svg.exists():
                continue
            content = svg.read_text()
            heights = {i: float(h) for i, h in _DEF_RE.findall(content)}
            found = []
            for use in _USE_RE.findall(content):
                href = _HREF_RE.search(use)
                matrix = _MATRIX_RE.search(use)
                if not href or not matrix or href.group(1) not in heights:
                    continue  # glyph placement, or an untransformed use
                scale_y, top = float(matrix.group(1)), float(matrix.group(2))
                found.append(Image(y_min=top, y_max=top + heights[href.group(1)] * scale_y))
            if found:
                by_page[page] = found
    return by_page


def _page_count(pdf_path: Path) -> int:
    r = subprocess.run(["pdfinfo", str(pdf_path)], capture_output=True, text=True, check=False)
    m = re.search(r"^Pages:\s+(\d+)", r.stdout, re.MULTILINE)
    return int(m.group(1)) if m else 0


def check_pdf(pdf_path: Path, check_images: bool = True) -> list[PageReport]:
    """Return a list of PageReport entries for pages that have overflow."""
    pages = _extract_pages(pdf_path)
    images = _extract_images(pdf_path, len(pages)) if check_images else {}
    reports: list[PageReport] = []
    for i, words in enumerate(pages, 1):
        footer_y = _find_footer_y(words)
        overflow = [
            w for w in words
            if w.y_min > SAFE_Y_MAX and not _is_footer_word(w, footer_y)
        ]
        # An image is overflow when its bottom edge crosses into the reserve.
        bad_imgs = [im for im in images.get(i, []) if im.y_max > SAFE_Y_MAX]
        if overflow or bad_imgs:
            reports.append(PageReport(
                page_num=i, overflow_words=overflow, overflow_images=bad_imgs,
            ))
    return reports


def _format_report(pdf_path: Path, reports: list[PageReport], repo_root: Path) -> str:
    try:
        rel = pdf_path.relative_to(repo_root)
    except ValueError:
        rel = pdf_path
    lines = [f"\n  {rel}"]
    for r in reports:
        if r.overflow_words:
            sample = " ".join(w.text for w in r.overflow_words[:14])
            if len(r.overflow_words) > 14:
                sample += f" ... (+{len(r.overflow_words) - 14} more)"
            lines.append(f"    page {r.page_num}: {sample}")
        for im in r.overflow_images:
            over = im.y_max - SAFE_Y_MAX
            lines.append(
                f"    page {r.page_num}: image overruns the footer reserve by "
                f"{over:.0f}pt (bottom at {im.y_max:.0f}pt, limit {SAFE_Y_MAX:.0f}pt)"
            )
    return "\n".join(lines)


def main() -> int:
    ap = argparse.ArgumentParser(description="Detect handout PDF overflow into the footer zone.")
    ap.add_argument("paths", nargs="*", help="PDF files to check")
    ap.add_argument("--dir", help="recursively check every PDF under this directory")
    ap.add_argument("--quiet", action="store_true", help="print only on failure")
    ap.add_argument(
        "--no-images", action="store_true",
        help="check text only (faster; skips the per-page image geometry pass)",
    )
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
        reports = check_pdf(pdf, check_images=not args.no_images)
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
