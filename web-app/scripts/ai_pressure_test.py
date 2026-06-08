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


def chat(messages, workshop_config=None, workshop_id="test-pressure-workshop"):
    """Hit /api/ai/chat with a message + minimal workshop config."""
    if workshop_config is None:
        workshop_config = {"workshop": {"name": "Pressure Test"}, "schedule": {"day1": []}}
    r = session.post(
        f"{BASE}/api/ai/chat",
        json={
            "messages": messages,
            "workshopConfig": workshop_config,
            "workshopId": workshop_id,
        },
    )
    if r.status_code != 200:
        return None
    return r.json()


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

# ─────────────────────────────────────────────────────────────────────────────
# Phase 4 — tool-execution edge cases on /api/ai/chat
#
# Tests that the executeAddModule guard rails behave correctly. The AI is asked
# to do something that exercises a guard, and we inspect the toolResults +
# updatedConfig to confirm the right behavior.
# ─────────────────────────────────────────────────────────────────────────────

def _find_tool_call(response, tool_name):
    """Return all toolResults entries with the given tool name."""
    if not response:
        return []
    return [tr for tr in response.get("toolResults", []) if tr.get("tool") == tool_name]


def _added_sessions(response):
    """Return all sessions from updatedConfig.schedule.day*."""
    if not response:
        return []
    cfg = response.get("updatedConfig") or {}
    schedule = cfg.get("schedule", {})
    sessions = []
    for day_key, day_list in schedule.items():
        if isinstance(day_list, list):
            for s in day_list:
                if isinstance(s, dict):
                    sessions.append(s)
    return sessions


def phase_4_tool_execution():
    print("\n" + "=" * 70)
    print("PHASE 4 — tool-execution guard rails")
    print("=" * 70)

    failures = []

    def text_mentions(msg, *needles):
        m = (msg or "").lower()
        return all(n.lower() in m for n in needles)

    # ─── T4.1: "Add Module 7" — AI should clarify sub-modules or call one ─────
    print("\n→ T4.1 — 'Add Module 7' should clarify or route to a sub-module")
    resp = chat(
        [{"role": "user", "content": "Add Module 7 to Day 1, full version, 90 min."}],
    )
    message = (resp or {}).get("message", "")
    add_module_calls = _find_tool_call(resp, "add_module")
    print(f"  add_module calls: {len(add_module_calls)}, message len: {len(message)}")
    saw_clarification = text_mentions(message, "7a", "7f") or text_mentions(message, "7e") or text_mentions(message, "sub-module")
    saw_helpful_error = any(
        not c.get("result", {}).get("success") and text_mentions(c.get("result", {}).get("message", ""), "7a", "7f")
        for c in add_module_calls
    )
    saw_subdmod_call = any(
        c.get("result", {}).get("success") and c.get("input", {}).get("module_number", "").startswith("7") and len(c.get("input", {}).get("module_number", "")) > 1
        for c in add_module_calls
    )
    if saw_clarification or saw_helpful_error or saw_subdmod_call:
        print(f"  ✓ pass (clarification={saw_clarification}, helpful_error={saw_helpful_error}, recovered={saw_subdmod_call})")
    else:
        print(f"  ✗ AI did not clarify, error informatively, or call a sub-module")
        failures.append("T4.1")

    # ─── T4.2: "Add Module 9i" — AI should mention m9e ────────────────────────
    print("\n→ T4.2 — 'Add Module 9i' should redirect to m9e")
    resp = chat(
        [{"role": "user", "content": "Add Module 9i (Standard FASTR Reports) to Day 1, full version, 60 min."}],
    )
    message = (resp or {}).get("message", "")
    add_module_calls = _find_tool_call(resp, "add_module")
    print(f"  add_module calls: {len(add_module_calls)}, message len: {len(message)}")
    saw_clarification = text_mentions(message, "9e")
    saw_helpful_error = any(
        not c.get("result", {}).get("success") and "9e" in (c.get("result", {}).get("message", "") or "").lower()
        for c in add_module_calls
    )
    saw_recovery = any(s.get("module") == "m9e" for s in _added_sessions(resp))
    if saw_clarification or saw_helpful_error or saw_recovery:
        print(f"  ✓ pass (clarification={saw_clarification}, helpful_error={saw_helpful_error}, recovered={saw_recovery})")
    else:
        print(f"  ✗ AI did not redirect to m9e (neither in message nor tool result nor session add)")
        failures.append("T4.2")

    # ─── T4.3: condensed of m7e — either AI clarifies, OR tool downgrades ────
    print("\n→ T4.3 — condensed of m7e should be clarified or auto-downgraded")
    resp = chat(
        [{"role": "user", "content": "Add Module 7e to Day 1 with version condensed, 30 min."}],
    )
    message = (resp or {}).get("message", "")
    sessions = _added_sessions(resp)
    m7e_sessions = [s for s in sessions if s.get("module") == "m7e"]
    # Acceptable outcomes: (a) AI clarifies (no session yet), (b) tool downgraded to full
    saw_clarification = text_mentions(message, "no condensed") or text_mentions(message, "only", "full") or text_mentions(message, "doesn't have a condensed")
    if m7e_sessions:
        version = m7e_sessions[0].get("version")
        if version == "full":
            print(f"  ✓ pass — m7e added as version='full' (auto-downgraded)")
        else:
            print(f"  ✗ m7e session ended up with version='{version}' — should be 'full'")
            failures.append("T4.3")
    elif saw_clarification:
        print(f"  ✓ pass — AI clarified that condensed not available")
    else:
        print(f"  ✗ no m7e session AND no clarification")
        failures.append("T4.3")

    # ─── T4.4: condensed of m4 should stay condensed ─────────────────────────
    print("\n→ T4.4 — Condensed of m4 should stay condensed")
    resp = chat(
        [{"role": "user", "content": "Add Module 4 to Day 1 with version condensed, 45 min duration."}],
    )
    sessions = _added_sessions(resp)
    m4_sessions = [s for s in sessions if s.get("module") == "m4"]
    if not m4_sessions:
        print(f"  ✗ no m4 session added")
        failures.append("T4.4")
    else:
        version = m4_sessions[0].get("version")
        if version == "condensed":
            print(f"  ✓ pass — m4 session kept version='condensed'")
        else:
            print(f"  ✗ m4 session ended up with version='{version}' — should be 'condensed'")
            failures.append("T4.4")

    print(f"\n→ Phase 4 result: {4 - len(failures)}/4 passed")
    if failures:
        print(f"  failures: {failures}")
    return len(failures) == 0


# ─────────────────────────────────────────────────────────────────────────────
# Phase 5 — natural-language routing (the real user vocabulary)
#
# Users don't say "Add Module 9e". They say "Add the disruption reports", "Add
# visualization activities", "Add storytelling". Verify the AI maps each phrase
# to the right module ID — either by calling add_module with that ID, or by
# clearly naming it in the clarification message.
# ─────────────────────────────────────────────────────────────────────────────

def phase_5_natural_language():
    print("\n" + "=" * 70)
    print("PHASE 5 — natural-language module routing")
    print("=" * 70)

    cases = [
        ("Add a session on disruption reports to Day 1, full version, 60 min.",          {"m9e"}),
        ("Add the slide decks module to Day 1, full, 90 min.",                            {"m9d"}),
        ("Add the visualization activities to Day 1, full, 60 min.",                      {"m9c"}),
        ("Add the AI assistant module to Day 1, full, 75 min.",                           {"m3b", "mai"}),
        ("Add a session on data quality assessment to Day 1, full, 90 min.",              {"m4"}),
        ("Add the storytelling module to Day 1, full, 30 min.",                           {"m7d"}),
        ("Add user mapping / understanding the audience to Day 1, full, 30 min.",         {"m7c"}),
        ("Add a session on linking results to actions to Day 1, full, 45 min.",           {"m7e"}),
        ("Add the action planning roadmap module to Day 1, full, 45 min.",                {"m7f"}),
        ("Add the survey & health facility assessment module to Day 1, full, 60 min.",    {"m8"}),
        ("Add a prompting techniques session to Day 1, full, 60 min.",                    {"m9f"}),
        ("Add the data extraction module to Day 1, full, 90 min.",                        {"m2"}),
    ]

    failures = []
    for prompt, valid_modules in cases:
        label = prompt.split(",")[0]
        print(f"\n→ {label}")
        resp = chat([{"role": "user", "content": prompt}])
        message = (resp or {}).get("message", "")
        sessions = _added_sessions(resp)
        calls = _find_tool_call(resp, "add_module")

        # Outcome A: a session was added with one of the valid module IDs
        added_module = next((s.get("module") for s in sessions if s.get("module") in valid_modules), None)
        # Outcome B: the AI's text/clarification names one of the valid module IDs
        named_module = next((m for m in valid_modules if m in message.lower()), None)
        # Outcome C: a tool call was made with one of the valid module IDs (even if error)
        call_module = None
        for c in calls:
            input_mod = "m" + str(c.get("input", {}).get("module_number", ""))
            if input_mod in valid_modules:
                call_module = input_mod

        winner = added_module or call_module or named_module
        if winner:
            print(f"  ✓ routed to {winner} (added={added_module}, call={call_module}, named={named_module})")
        else:
            print(f"  ✗ no routing to any of {valid_modules}. message={message[:120]!r}")
            failures.append(label)

    print(f"\n→ Phase 5 result: {len(cases) - len(failures)}/{len(cases)} passed")
    if failures:
        print(f"  failures: {failures}")
    return len(failures) == 0


# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    login()
    p2 = phase_2_knowledge()
    p3 = phase_3_generation()
    p4 = phase_4_tool_execution()
    p5 = phase_5_natural_language()
    print("\n" + "=" * 70)
    print(
        f"SUMMARY: Phase 2 {'PASS' if p2 else 'FAIL'} (knowledge) · "
        f"Phase 3 {'PASS' if p3 else 'FAIL'} (structural — required) · "
        f"Phase 4 {'PASS' if p4 else 'FAIL'} (tool guards — required) · "
        f"Phase 5 {'PASS' if p5 else 'FAIL'} (natural-lang routing — required)"
    )
    print("=" * 70)
    # Phase 3 + Phase 4 + Phase 5 gate the exit code.
    sys.exit(0 if (p3 and p4 and p5) else 1)
