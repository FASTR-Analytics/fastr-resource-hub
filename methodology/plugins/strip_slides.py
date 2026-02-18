"""
MkDocs plugin to strip slide content from methodology docs.

Content between <!-- SLIDE:xxx --> and <!-- /SLIDE --> markers
is extracted for slides but hidden from the mkdocs documentation.
"""

import re
from mkdocs.plugins import BasePlugin


class StripSlidesPlugin(BasePlugin):
    """Strip slide-only content and clean up Pandoc artifacts from markdown files."""

    # Pattern to match <!-- SLIDE:xxx --> ... <!-- /SLIDE --> blocks
    SLIDE_PATTERN = re.compile(
        r'<!--\s*SLIDE:\w+\s*-->.*?<!--\s*/SLIDE\s*-->',
        re.DOTALL
    )

    # Pattern to strip Pandoc {.nocase} span attributes from bibtex citations
    # After bibtex runs, [Author]{.nocase} becomes literal text in markdown
    NOCASE_PATTERN = re.compile(r'\[([^\]]+)\]\{\.nocase\}')

    def on_page_markdown(self, markdown, page, config, files):
        """Remove slide blocks from markdown before rendering."""
        # Remove all slide blocks
        cleaned = self.SLIDE_PATTERN.sub('', markdown)

        # Strip {.nocase} Pandoc attributes from bibtex citations
        # This handles cases where bibtex plugin ran on an earlier pass (i18n rebuild)
        cleaned = self.NOCASE_PATTERN.sub(r'\1', cleaned)

        # Clean up excessive blank lines left behind
        cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)

        return cleaned

    def on_page_content(self, html, page, config, files):
        """Clean Pandoc artifacts from rendered HTML."""
        # Strip [Author et al.]{.nocase} → Author et al.
        cleaned = self.NOCASE_PATTERN.sub(r'\1', html)
        return cleaned
