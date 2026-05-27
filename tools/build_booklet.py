#!/usr/bin/env python3
"""Assemble an ordered set of handout PDFs into a single booklet with a
brand-styled Table of Contents page and clickable PDF bookmarks.

Each booklet is described by a YAML manifest under ``handouts/booklets/``
(or passed via ``--manifest``):

    title: Sierra Leone Workshop · Participant Booklet
    footer: "FASTR · Sierra Leone Workshop"
    output: ~/Desktop/Sierra Leone Workshop/Sierra_Leone_Workshop_Booklet.pdf
    sections:
      - title: Welcome & log in
        items:
          - { title: Logging in,    pdf: "en/Getting Started/01_logging_in.pdf" }
          - { title: Your folder,   pdf: "en/Getting Started/02_user_folder.pdf" }
      - title: HMIS methodology
        items:
          - { title: Data quality assessment, pdf: "en/Analytics pipeline/01_dqa.pdf" }
          ...

The script:
  1. Reads the manifest.
  2. Computes how many pages each handout has (via pypdf).
  3. Renders a TOC markdown file and converts it to PDF with Marp.
  4. Concatenates TOC + handout PDFs into the final booklet.
  5. Writes a clickable bookmark tree (section -> item).

Usage:
    python3 tools/build_booklet.py --manifest handouts/booklets/sierra_leone.yaml
"""
from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
import yaml
from pypdf import PdfReader, PdfWriter

REPO = Path(__file__).resolve().parent.parent
HANDOUTS_OUT = REPO / "handouts" / "_out"


def _resolve_pdf(path_str: str) -> Path:
    p = Path(path_str)
    if not p.is_absolute():
        p = HANDOUTS_OUT / path_str
    if not p.exists():
        sys.exit(f"PDF not found: {p}")
    return p


TOC_INLINE_CSS = """
<style>
section.redesign h1 {
  font-size: 28px;
  margin-bottom: 14px;
}
.toc {
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.35;
}
.toc-section {
  margin: 12px 0 4px;
  font-size: 13px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #09544F;
  border-bottom: 1px solid #CAE6E9;
  padding-bottom: 3px;
}
.toc-item {
  margin: 1px 0;
  padding-left: 20px;
}
.toc-num {
  display: inline-block;
  min-width: 28px;
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: #1F9A9C;
  font-weight: 600;
  margin-right: 10px;
}
.toc-section .toc-num {
  color: #09544F;
}
</style>
"""


def _render_toc_pdf(title: str, footer: str, sections: list[dict], page_offsets: list[int], tmp: Path) -> Path:
    """Render the TOC markdown via Marp and return the rendered PDF path."""
    logo_uri = (REPO / "resources" / "logos" / "FASTR_Primary_01_FullName.png").as_uri()
    lines = [
        "---",
        "marp: true",
        "theme: fastr-handout",
        "paginate: true",
        "class: redesign",
        f'footer: "{footer}"',
        "---",
        "",
        TOC_INLINE_CSS.strip(),
        "",
        f'<div class="brand-line"><span class="rule"></span>'
        f'<img src="{logo_uri}" alt="FASTR" height="28"></div>',
        "",
        f"# {title}",
        "",
        '<div class="toc">',
        "",
    ]
    idx = 0
    for section in sections:
        sec_start_page = page_offsets[idx]
        lines.append(
            f'<p class="toc-section"><span class="toc-num">{sec_start_page}</span>{section["title"]}</p>'
        )
        for item in section["items"]:
            page = page_offsets[idx]
            idx += 1
            lines.append(
                f'<p class="toc-item"><span class="toc-num">{page}</span>{item["title"]}</p>'
            )
        lines.append("")
    lines.append("</div>")

    md_path = tmp / "toc.md"
    md_path.write_text("\n".join(lines), encoding="utf-8")
    pdf_path = tmp / "toc.pdf"

    marp_cli = REPO / "node_modules" / ".bin" / "marp"
    theme_path = REPO / "fastr-handout.css"
    if not marp_cli.exists():
        sys.exit("marp CLI not found at node_modules/.bin/marp")
    if not theme_path.exists():
        sys.exit(f"handout theme not found: {theme_path}")

    result = subprocess.run(
        [
            str(marp_cli),
            str(md_path),
            "--theme-set", str(theme_path),
            "--pdf",
            "--allow-local-files",
            "-o", str(pdf_path),
        ],
        cwd=REPO,
        capture_output=True, text=True,
    )
    if result.returncode != 0:
        sys.stderr.write(result.stdout + "\n" + result.stderr + "\n")
        sys.exit("marp failed to render TOC")
    return pdf_path


def _flat_items(sections: list[dict]) -> list[tuple[str, Path, str]]:
    """Flatten sections into [(section_title, pdf_path, item_title), ...]."""
    out = []
    for section in sections:
        for item in section["items"]:
            out.append((section["title"], _resolve_pdf(item["pdf"]), item["title"]))
    return out


def _page_offsets(toc_pages: int, flat: list[tuple[str, Path, str]]) -> list[int]:
    """Return the booklet-page number of the FIRST page of each flat item."""
    offsets = []
    cursor = toc_pages + 1
    for _, pdf, _ in flat:
        offsets.append(cursor)
        cursor += len(PdfReader(str(pdf)).pages)
    return offsets


def build(manifest_path: Path) -> Path:
    manifest = yaml.safe_load(manifest_path.read_text(encoding="utf-8"))
    title = manifest["title"]
    footer = manifest.get("footer", "FASTR")
    out_path = Path(os.path.expanduser(manifest["output"]))
    sections = manifest["sections"]

    flat = _flat_items(sections)

    # First pass: assume TOC = 1 page, compute offsets, render TOC.
    # If the TOC turns out to be >1 page, redo with the new TOC page count.
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        for toc_pages in (1, 2, 3):
            offsets = _page_offsets(toc_pages, flat)
            toc_pdf = _render_toc_pdf(title, footer, sections, offsets, tmp)
            actual_toc = len(PdfReader(str(toc_pdf)).pages)
            if actual_toc <= toc_pages:
                break
        else:
            sys.exit("TOC rendered more than 3 pages — narrow it down or split sections")

        writer = PdfWriter()
        # 1. TOC
        for page in PdfReader(str(toc_pdf)).pages:
            writer.add_page(page)
        toc_outline = writer.add_outline_item("Table of Contents", 0)

        page_cursor = actual_toc
        for section in sections:
            section_start_idx = page_cursor
            first_item = True
            section_outline = None
            for item in section["items"]:
                pdf = _resolve_pdf(item["pdf"])
                item_first_idx = page_cursor
                for page in PdfReader(str(pdf)).pages:
                    writer.add_page(page)
                    page_cursor += 1
                if first_item:
                    section_outline = writer.add_outline_item(section["title"], section_start_idx)
                    first_item = False
                writer.add_outline_item(item["title"], item_first_idx, parent=section_outline)

        out_path.parent.mkdir(parents=True, exist_ok=True)
        with out_path.open("wb") as f:
            writer.write(f)

    print(f"Wrote {out_path} ({writer.get_num_pages()} pages, {len(sections)} sections, {len(flat)} handouts)")
    return out_path


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--manifest", required=True, help="path to booklet manifest YAML")
    args = ap.parse_args()
    build(Path(args.manifest))
    return 0


if __name__ == "__main__":
    sys.exit(main())
