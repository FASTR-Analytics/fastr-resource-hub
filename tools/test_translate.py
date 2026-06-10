"""
Unit tests for tools/translate.py — specifically the apply_glossary
post-processing step.

These tests exist because of a real regression on 2026-06-10: the glossary
substitution regex was missing word boundaries (\b), so a rule like
"ANC" → "CPN" was matching the substring "anc" inside "instance" and
producing "instCPNe" throughout an entire translated chapter. The tests
below pin that behaviour so it can't regress silently.

Run from the repo root:

    python3 tools/test_translate.py
    # or, via unittest discovery:
    python3 -m unittest tools.test_translate
"""

import os
import sys
import unittest

# Allow `from translate import ...` when run as a script.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from translate import apply_glossary, get_postprocess_signature


class TestApplyGlossary(unittest.TestCase):
    # ─── The exact regression we tripped over ──────────────────────────────

    def test_instance_substring_not_replaced_fr(self):
        """The substring 'anc' inside 'instance' must NOT match the ANC rule."""
        result = apply_glossary("Each instance contains data", "FR")
        self.assertIn("instance", result)
        self.assertNotIn("instCPNe", result)
        self.assertNotIn("instCPN", result)

    def test_instance_substring_not_replaced_pt(self):
        """Same protection for PT — even if PT glossary differs."""
        result = apply_glossary("Each instance contains data", "PT")
        self.assertIn("instance", result)
        self.assertNotIn("instCPN", result)

    # ─── Whole-word matches still work ─────────────────────────────────────

    def test_anc1_replaced_fr(self):
        """ANC1 as a whole word should still map to CPN1 in French."""
        result = apply_glossary("ANC1 visits this quarter", "FR")
        self.assertIn("CPN1", result)
        self.assertNotIn("ANC1", result)

    def test_anc_followed_by_punctuation(self):
        """Punctuation counts as a word boundary, so 'ANC,' should match."""
        result = apply_glossary("Track ANC, then deliveries.", "FR")
        self.assertIn("CPN", result)

    def test_anc_at_end_of_string(self):
        """End-of-string counts as a word boundary."""
        result = apply_glossary("Reported as ANC", "FR")
        self.assertIn("CPN", result)

    def test_lowercase_anc1_replaced(self):
        """Match is case-insensitive — 'anc1' should still become CPN1."""
        result = apply_glossary("anc1 coverage rose", "FR")
        self.assertIn("CPN1", result)
        self.assertNotIn("anc1", result)

    # ─── Misc safety checks ────────────────────────────────────────────────

    def test_empty_text_passes_through(self):
        self.assertEqual(apply_glossary("", "FR"), "")

    def test_unknown_language_returns_text_unchanged(self):
        text = "ANC1 visits at the instance level"
        self.assertEqual(apply_glossary(text, "XX"), text)

    def test_text_without_glossary_terms_unchanged(self):
        text = "The quick brown fox jumps over the lazy dog."
        self.assertEqual(apply_glossary(text, "FR"), text)

    def test_postprocess_signature_is_stable(self):
        """Two consecutive calls return the same signature (deterministic)."""
        sig_a = get_postprocess_signature("FR")
        sig_b = get_postprocess_signature("FR")
        self.assertEqual(sig_a, sig_b)
        self.assertTrue(sig_a)  # non-empty

    def test_postprocess_signature_differs_by_language(self):
        """FR and PT signatures should differ (different language scope)."""
        self.assertNotEqual(
            get_postprocess_signature("FR"),
            get_postprocess_signature("PT"),
        )


if __name__ == "__main__":
    unittest.main(verbosity=2)
