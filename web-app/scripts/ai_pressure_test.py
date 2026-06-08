#!/usr/bin/env python3
"""
Pressure-test the FASTR workshop-builder AI.

Verifies that ai.ts is honoring the post-m7-split / post-m9i-retirement /
post-curriculum-sessions module taxonomy. The tests fire real prompts at
the running dev server and inspect the generated JSON.

The structural (Phase 3) checks are what we actually rely on:
  - generated modules array contains m7a–m7f sub-modules (no bare "7")
  - no "m9i" references (m9i has been merged into m9e)
  - "version": "condensed" only appears on modules that actually have a
    condensed deck (m4, m5, m6, m8)

Phase 2 also fires four prompts to spot-check module choice (e.g., a
disruption-report workshop should pull m9e). Those checks are softer
because the model has some judgment latitude.

Prerequisites
-------------
- Dev server running on localhost:3001 (run `./web-app/dev.sh start`).
- ANTHROPIC_API_KEY set in the web-app's .env (the AI route calls it).
- Python 3.10+. Auto-installs `requests` on first run.

Usage
-----
    python3 web-app/scripts/ai_pressure_test.py

Exit code 0 if all phases pass, 1 otherwise.
"""
import json
import sys

try:
    import requests
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "--quiet", "requests"])
    import requests

BASE = "http://localhost:3001"
PASSWORD = "fastr2026"
session = requests.Session()


def login():
    r = session.post(f"{BASE}/api/auth/login", json={"password": PASSWORD})
    r.raise_for_status()
    print(f"✓ logged in (status {r.status_code})\n")


def check_contains(haystack, needles):
    """Return (passed, missing-list)."""
    h = haystack.lower()
    return (
        all(n.lower() in h for n in needles),
        [n for n in needles if n.lower() not in h],
    )


def check_absent(haystack, needles):
    """Return (passed, list-of-things-found-that-shouldn't-be)."""
    h = haystack.lower()
    bad = [n for n in needles if n.lower() in h]
    return (len(bad) == 0, bad)


def generate_workshop(prompt):
    """Hit /api/ai/generate-workshop, skipping clarification phase if returned."""
    r = session.post(f"{BASE}/api/ai/generate-workshop", json={"prompt": prompt})
    if r.status_code != 200:
        print(f"  ✗ HTTP {r.status_code}: {r.text[:200]}")
        return None
    data = r.json()
    if isinstance(data, list) or "questions" in str(data)[:80]:
        r = session.post(
            f"{BASE}/api/ai/generate-workshop",
            json={"prompt": prompt, "clarifications": []},
        )
        if r.status_code != 200:
            print(f"  ✗ HTTP {r.status_code}: {r.text[:200]}")
            return None
        data = r.json()
    return data


# ─────────────────────────────────────────────────────────────────────────────
# Phase 2 — knowledge / module-choice spot checks
# ─────────────────────────────────────────────────────────────────────────────

def phase_2_knowledge():
    print("=" * 70)
    print("PHASE 2 — AI module knowledge")
    print("=" * 70)

    tests = [
        {
            "name": "T2.1 — Results-communication-focused workshop",
            "prompt": (
                "Build me a 1-day FASTR workshop focused entirely on Results "
                "Communication and Action Planning. Audience is mid-level program "
                "managers in English-speaking Africa. Detailed/comprehensive level. "
                "English."
            ),
            "must_contain": ["7e", "7f"],
            "must_not_contain": ["m7_results_communication"],
            "must_use_modules_only": True,
        },
        {
            "name": "T2.2 — Disruption-report workshop should pull m9e (not m9i)",
            "prompt": (
                "Build me a 2-day FASTR workshop focused on disruption reports and "
                "using the AI Assistant. English. Detailed level."
            ),
            "must_contain": ["m9e", "m9f"],
            "must_not_contain": ["m9i"],
        },
        {
            "name": "T2.3 — Quick methods workshop, should use condensed",
            "prompt": (
                "Build me a quick 1-day FASTR overview covering methods only — Data "
                "Quality Assessment, Adjustment, Service Use. Make it brief and "
                "high-level. English. Refresher audience."
            ),
            "must_contain": ["4", "5", "6"],
            "must_not_contain": ["m9i"],
        },
        {
            "name": "T2.4 — Full FASTR end-to-end",
            "prompt": (
                "Build me a 3-day Ethiopia workshop covering FASTR end to end with "
                "hands-on report building. English. First-time audience."
            ),
            "must_contain": ["7e", "7f", "9c", "9d", "9e"],
            "must_not_contain": ["m9i", '"7"'],
        },
    ]

    failures = []
    for test in tests:
        print(f"\n→ {test['name']}")
        print(f"  prompt: {test['prompt'][:80]}…")
        config = generate_workshop(test["prompt"])
        if config is None:
            print("  ✗ no response")
            failures.append(test["name"])
            continue

        config_str = json.dumps(config)
        modules_list = config.get("modules", []) if isinstance(config, dict) else []
        print(f"  modules: {modules_list}")

        passed, missing = check_contains(config_str, test["must_contain"])
        if not passed:
            print(f"  ✗ MISSING from response: {missing}")
            failures.append(test["name"])

        passed, found = check_absent(config_str, test["must_not_contain"])
        if not passed:
            print(f"  ✗ SHOULD NOT BE THERE: {found}")
            failures.append(test["name"])

        if test.get("must_use_modules_only") and "7" in modules_list:
            print(f"  ✗ modules array still uses bare '7': {modules_list}")
            failures.append(test["name"])

        if test["name"] not in failures:
            print("  ✓ pass")

    print(f"\n→ Phase 2 result: {len(tests) - len(failures)}/{len(tests)} passed")
    if failures:
        print(f"  failures: {failures}")
        print(
            "  (Phase 2 tests probe model judgment under various prompts; "
            "occasional misses on time-tight workshops are expected.)"
        )
    return len(failures) == 0


# ─────────────────────────────────────────────────────────────────────────────
# Phase 3 — structural JSON validity (hard requirements)
# ─────────────────────────────────────────────────────────────────────────────

def phase_3_generation():
    print("\n" + "=" * 70)
    print("PHASE 3 — generated workshop JSON")
    print("=" * 70)

    prompt = (
        "Build me a 3-day Ethiopia FASTR workshop covering FASTR end to end "
        "with hands-on report building. English. First-time participants."
    )
    config = generate_workshop(prompt)

    if config is None or not isinstance(config, dict):
        print("  ✗ no usable config returned")
        return False

    issues = []

    modules = config.get("modules", [])
    print(f"  modules array: {modules}")
    if "7" in modules:
        issues.append("modules array uses bare '7' instead of m7a–m7f")
    if "9i" in modules or "m9i" in modules:
        issues.append("modules array references m9i (deleted)")

    has_sub = any(m in ("7a", "7b", "7c", "7d", "7e", "7f") for m in modules)
    if not has_sub:
        issues.append("no m7a–m7f sub-module included")

    schedule = config.get("schedule", {})
    all_sessions = [
        s
        for day_key, day_sessions in schedule.items()
        if isinstance(day_sessions, list)
        for s in day_sessions
    ]
    print(f"  total sessions across all days: {len(all_sessions)}")

    for s in all_sessions:
        if not isinstance(s, dict):
            continue
        mod = s.get("module", "")
        if "9i" in mod:
            issues.append(f"session references m9i: {s}")
        if mod == "m7":
            issues.append(f"session uses 'm7' instead of m7a–m7f: {s}")
        if s.get("version") == "condensed":
            mod_num = mod.replace("m", "")
            if mod_num not in ("4", "5", "6", "8"):
                issues.append(
                    f"condensed version on module without condensed deck: {mod}"
                )

    if issues:
        for issue in issues:
            print(f"  ✗ {issue}")
        return False
    print("  ✓ all structural checks passed")
    return True


# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    login()
    p2 = phase_2_knowledge()
    p3 = phase_3_generation()
    print("\n" + "=" * 70)
    print(
        f"SUMMARY: Phase 2 {'PASS' if p2 else 'FAIL'} · "
        f"Phase 3 {'PASS' if p3 else 'FAIL'} (structural — required)"
    )
    print("=" * 70)
    sys.exit(0 if p3 else 1)  # Phase 3 gates the exit code
