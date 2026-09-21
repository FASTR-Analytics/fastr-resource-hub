#!/usr/bin/env python3
"""
Platform drift check — weekly sweep of FASTR-Analytics/platform and
FASTR-Analytics/modules.

Compares the upstream repos against the last-seen state stored in
`.github/platform_watch_state.json`. When new CHANGELOG entries or commits
appear, opens a labelled, assigned triage issue in this repo with a
categorized summary AND the repo files each change is likely to touch (see
CONTENT_MAP), so the team knows when an upstream change might affect
methodology, prompts, or handouts. The platform-drift-check workflow then
runs a Claude triage job on the issue (see .github/drift_triage_prompt.md).

Run from CI via the platform-drift-check workflow. Locally for testing:

    GH_TOKEN=$(gh auth token) python3 tools/check_platform_drift.py --dry-run

--dry-run prints the issue body to stdout instead of creating an issue, and
doesn't modify the state file.
"""
import argparse
import base64
import hashlib
import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
STATE_FILE = REPO_ROOT / ".github" / "platform_watch_state.json"
THIS_REPO = os.environ.get("GITHUB_REPOSITORY", "FASTR-Analytics/fastr-resource-hub")

PLATFORM = "FASTR-Analytics/platform"
MODULES = "FASTR-Analytics/modules"

# CHANGELOG / deploy commits that are pure noise — filter them from the
# commit list so we don't drown the signal.
IGNORE_COMMIT_PATTERNS = [
    re.compile(r"chore: update CHANGELOG_AUTO\.txt", re.I),
    re.compile(r"Deploy version", re.I),
]

# Categorization regexes for CHANGELOG entries.
HIGHLIGHT_TERMS = re.compile(
    r"chart|viz|visualization|preset|figure|colou?r|indicator|metric|"
    r"coverage|disruption|dashboard|report|presentation|calculated|denominator|"
    r"replicant|\bAI\b|French|calendar|language",
    re.I,
)
CHART_TERMS = re.compile(r"chart|viz|figure|preset", re.I)

# Where a CHANGELOG entry lands in this repo. First matching row wins; the
# paths are candidates for a human (or the triage job) to open, not proof of
# staleness. Keep this in sync with handouts/_order.yaml and modules.yaml.
CONTENT_MAP: list[tuple[re.Pattern, str, list[str]]] = [
    (re.compile(r"\bHFA\b|health facility assessment|XLSForm|ODK|workbook|Excel|code editor|variable (id|name)|dataset variable", re.I),
     "Health facility assessment (HFA)",
     ["methodology/08_*.md", "core_content/m8_*", "handouts/*/m8/"]),
    (re.compile(r"indicator manager|indicator (id|list|table|editor|type)|Add from DHIS2|naming step|calculated|derived|formula|\bSum\b|DHIS2 element|common indicator|DHIS2 name|indicator toolbar|toolbar", re.I),
     "Indicator setup",
     ["handouts/*/m9a/h_m9a_indicators.md", "handouts/*/m9a/h_m9a_facilitator_guide.md",
      "handouts/fr/custom/h_custom_ajouter_indicateurs.md", "handouts/fr/custom/h_custom_indicateurs_dhis2.md",
      "handouts/en/custom/h_custom_scorecard_indicators.md",
      "methodology/10_workshop_activities.md (m9a_1*)", "methodology/03_fastr_analytics_platform.md (Indicators)"]),
    (re.compile(r"population", re.I), "Population page / coverage denominators",
     ["methodology/06b_coverage_estimates.md", "handouts/en/custom/h_custom_scorecard_indicators.md"]),
    (re.compile(r"DHIS2 (import|connection|credential)|import wizard|schedule|recurring|Imports page", re.I),
     "DHIS2 data import",
     ["handouts/*/m9a/h_m9a_import_data.md", "handouts/*/custom/h_custom_import_dhis2_maj.md",
      "methodology/02_data_extraction.md", "methodology/10_workshop_activities.md (m9a_1)"]),
    (re.compile(r"results? package|module (default|parameter)|pin|prune|generation wizard|attach", re.I),
     "Results packages / modules",
     ["handouts/*/custom/h_custom_import_dhis2_maj.md", "methodology/10_workshop_activities.md (m9a_2)",
      "methodology/03_fastr_analytics_platform.md (Modules)"]),
    (re.compile(r"facilit(y|ies)|structure|admin area|geojson|Replace all", re.I), "Facility structure",
     ["handouts/*/m9a/h_m9a_admin_areas.md", "methodology/10_workshop_activities.md (m9a_0)"]),
    (re.compile(r"\bAI\b|assistant|copilot|prompt|MCP", re.I), "AI assistant",
     ["methodology/03b_ai_assistant.md", "handouts/*/m9c/", "prompts/"]),
    (re.compile(r"slide|deck|presentation", re.I), "Slide decks", ["handouts/*/m9d/", "methodology/10_workshop_activities.md (m9d)"]),
    (re.compile(r"report", re.I), "Reports", ["handouts/*/m9d/", "methodology/03_fastr_analytics_platform.md (Reports)"]),
    (re.compile(r"visuali[sz]|chart|figure|map|legend|colou?r|disaggreg|replicant|dashboard", re.I),
     "Visualizations / dashboards",
     ["handouts/*/m9b/", "handouts/*/m9c/", "methodology/03_fastr_analytics_platform.md (Visualization)"]),
    (re.compile(r"\bprojects?\b|admin-area scope|\busers?\b|permission|\brole\b|login|sign[- ]in", re.I), "Projects / users",
     ["handouts/*/m9a/h_m9a_connect_platform.md", "methodology/10_workshop_activities.md (m9a_3)",
      "methodology/03_fastr_analytics_platform.md (User roles)"]),
]

ISSUE_LABEL = "platform-drift"
ISSUE_ASSIGNEE = os.environ.get("DRIFT_ISSUE_ASSIGNEE", "clairecda")
USER_FACING = re.compile(r"\] \[user\] \[(added|changed|removed)\]", re.I)


def map_to_content(entries: list[str]) -> dict[str, tuple[list[str], list[str]]]:
    """Group user-facing entries by the CONTENT_MAP area they hit."""
    areas: dict[str, tuple[list[str], list[str]]] = {}
    for e in entries:
        if not USER_FACING.search(e):
            continue
        for pat, area, paths in CONTENT_MAP:
            if pat.search(e):
                areas.setdefault(area, (paths, []))[1].append(e)
                break
    return areas


# ─────────────────────────────────────────────────────────────────────────────
# gh CLI wrapper
# ─────────────────────────────────────────────────────────────────────────────


def gh(*args, check=True):
    """Run gh CLI command, return stdout stripped, raise on non-zero unless check=False."""
    result = subprocess.run(["gh", *args], capture_output=True, text=True, check=False)
    if result.returncode != 0 and check:
        sys.stderr.write(f"gh {' '.join(args)} failed:\n{result.stderr}\n")
        result.check_returncode()
    return result.stdout.strip()


def gh_api(path, jq=None, check=True):
    args = ["api", path]
    if jq:
        args += ["--jq", jq]
    return gh(*args, check=check)


def latest_sha(repo: str) -> str:
    return gh_api(f"repos/{repo}/commits/main", jq=".sha")


def fetch_file(repo: str, path: str, ref: str | None = None) -> str:
    api = f"repos/{repo}/contents/{path}"
    if ref:
        api += f"?ref={ref}"
    content_b64 = gh_api(api, jq=".content", check=False)
    if not content_b64:
        return ""
    # Whitespace is harmless inside base64; anything else (e.g. an error
    # message that leaked into stdout) makes us bail with an empty string
    # rather than crash the whole run.
    try:
        return base64.b64decode(content_b64).decode("utf-8", errors="replace")
    except (ValueError, base64.binascii.Error):
        sys.stderr.write(f"fetch_file: could not decode {repo}/{path}@{ref or 'main'}\n")
        return ""


# ─────────────────────────────────────────────────────────────────────────────
# State
# ─────────────────────────────────────────────────────────────────────────────


def load_state() -> dict:
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text())
    return {}


def save_state(state: dict) -> None:
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(json.dumps(state, indent=2) + "\n")


def hash_text(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


# ─────────────────────────────────────────────────────────────────────────────
# Diffing
# ─────────────────────────────────────────────────────────────────────────────


def compare_commits(repo: str, from_sha: str, to_sha: str) -> list[tuple[str, str]]:
    """Returns (sha, message_first_line) for commits in (from, to], filtered."""
    if from_sha == to_sha:
        return []
    raw = gh_api(
        f"repos/{repo}/compare/{from_sha}...{to_sha}",
        jq='.commits[] | "\\(.sha)|\\(.commit.message | split("\\n")[0])"',
        check=False,
    )
    out = []
    for line in raw.splitlines():
        if "|" not in line:
            continue
        sha, msg = line.split("|", 1)
        if any(p.search(msg) for p in IGNORE_COMMIT_PATTERNS):
            continue
        out.append((sha, msg))
    return out


def diff_changelog(old_text: str, new_text: str) -> list[str]:
    """Return CHANGELOG lines present in new but not in old."""
    old_lines = set(old_text.splitlines())
    return [line for line in new_text.splitlines() if line.strip() and line not in old_lines]


def categorize(entries: list[str]) -> tuple[list[str], list[str], list[str]]:
    highlighted, chart, other = [], [], []
    for e in entries:
        if HIGHLIGHT_TERMS.search(e):
            highlighted.append(e)
        elif CHART_TERMS.search(e):
            chart.append(e)
        else:
            other.append(e)
    return highlighted, chart, other


# ─────────────────────────────────────────────────────────────────────────────
# Issue body
# ─────────────────────────────────────────────────────────────────────────────


def build_issue_body(
    new_changelog: list[str],
    platform_commits: list[tuple[str, str]],
    modules_commits: list[tuple[str, str]],
    last_check: str | None,
) -> str:
    highlighted, chart, other = categorize(new_changelog)
    lines = [
        "Automated weekly check of `FASTR-Analytics/platform` and "
        "`FASTR-Analytics/modules`.",
        "",
        f"_Previous check: {last_check or 'never (first run)'}_",
        "",
    ]
    if highlighted:
        lines += [
            "## Highlighted — likely affects content in this repo",
            "",
            *(f"- {e}" for e in highlighted),
            "",
        ]
    if chart:
        lines += [
            "## Chart / visualization entries",
            "",
            *(f"- {e}" for e in chart),
            "",
        ]
    if other:
        lines += [
            "## Other CHANGELOG entries",
            "",
            f"{len(other)} internal / admin / infra entries — see "
            "[CHANGELOG_AUTO.txt](https://github.com/FASTR-Analytics/platform/blob/main/CHANGELOG_AUTO.txt) "
            "for the full list.",
            "",
        ]
    if platform_commits:
        lines += [
            "## Platform commits (non-CHANGELOG, non-deploy)",
            "",
            *(
                f"- [`{sha[:7]}`](https://github.com/{PLATFORM}/commit/{sha}) {msg}"
                for sha, msg in platform_commits
            ),
            "",
        ]
    if modules_commits:
        lines += [
            "## FASTR-Analytics/modules commits",
            "",
            *(
                f"- [`{sha[:7]}`](https://github.com/{MODULES}/commit/{sha}) {msg}"
                for sha, msg in modules_commits
            ),
            "",
        ]
    areas = map_to_content(new_changelog)
    if areas:
        lines += ["## Content likely affected (by area)", ""]
        for area, (paths, entries) in areas.items():
            lines += [f"**{area}** — {len(entries)} user-facing change(s)", ""]
            lines += [f"- {e}" for e in entries]
            lines += ["", "  Check: " + ", ".join(f"`{p}`" for p in paths), ""]
    lines += [
        "## To triage",
        "",
        "- [ ] The Claude triage job comments below with the files that actually need an edit "
        "(or closes this issue if nothing is affected).",
        "- [ ] Review its comment / pull request, then close.",
    ]
    return "\n".join(lines)


def existing_open_issue(title: str) -> str | None:
    out = gh(
        "issue", "list",
        "--repo", THIS_REPO,
        "--state", "open",
        "--search", f'"{title}" in:title',
        "--json", "number",
        "--jq", ".[0].number // empty",
        check=False,
    )
    return out or None


# ─────────────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────────────


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print what would be done without opening an issue or writing state.",
    )
    args = parser.parse_args()

    state = load_state()
    last_platform_sha = state.get("platform_sha", "")
    last_modules_sha = state.get("modules_sha", "")
    last_changelog_hash = state.get("platform_changelog_hash", "")
    last_check = state.get("last_check")

    current_platform_sha = latest_sha(PLATFORM)
    current_modules_sha = latest_sha(MODULES)
    current_changelog = fetch_file(PLATFORM, "CHANGELOG_AUTO.txt")
    current_changelog_hash = hash_text(current_changelog)
    now_iso = datetime.now(timezone.utc).isoformat(timespec="seconds")

    new_state = {
        "platform_sha": current_platform_sha,
        "modules_sha": current_modules_sha,
        "platform_changelog_hash": current_changelog_hash,
        "last_check": now_iso,
    }

    # First run — seed state, no issue.
    if not last_platform_sha:
        print(f"First run, seeding state (platform@{current_platform_sha[:7]}, "
              f"modules@{current_modules_sha[:7]}).")
        if not args.dry_run:
            save_state(new_state)
        return 0

    # No change since last run.
    if (current_platform_sha == last_platform_sha
            and current_modules_sha == last_modules_sha
            and current_changelog_hash == last_changelog_hash):
        print("No upstream changes since last check.")
        if not args.dry_run:
            state["last_check"] = now_iso
            save_state(state)
        return 0

    # Diff against last-seen.
    if current_changelog_hash != last_changelog_hash and last_platform_sha:
        previous_changelog = fetch_file(PLATFORM, "CHANGELOG_AUTO.txt", ref=last_platform_sha)
        new_changelog_entries = diff_changelog(previous_changelog, current_changelog)
    else:
        new_changelog_entries = []

    platform_commits = compare_commits(PLATFORM, last_platform_sha, current_platform_sha) if last_platform_sha else []
    modules_commits = compare_commits(MODULES, last_modules_sha, current_modules_sha) if last_modules_sha else []

    if not (new_changelog_entries or platform_commits or modules_commits):
        print("SHA changed but no meaningful content (likely filtered noise). "
              "Updating state silently.")
        if not args.dry_run:
            save_state(new_state)
        return 0

    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    title = f"Platform drift check {today}"
    body = build_issue_body(new_changelog_entries, platform_commits, modules_commits, last_check)

    if args.dry_run:
        print(f"\n===== DRY RUN: would open issue =====\n")
        print(f"Title: {title}\n")
        print(body)
        print(f"\n===== state would be updated to =====")
        print(json.dumps(new_state, indent=2))
        return 0

    number = existing_open_issue(title)
    if number:
        print(f"Open issue '{title}' already exists (#{number}). Skipping creation.")
    else:
        print(f"Opening issue: {title}")
        url = gh("issue", "create",
                 "--repo", THIS_REPO,
                 "--title", title,
                 "--body", body,
                 "--label", ISSUE_LABEL,
                 "--assignee", ISSUE_ASSIGNEE)
        number = url.rstrip("/").rsplit("/", 1)[-1]
        print(f"Opened #{number}")

    # Hand the issue number to the workflow so the triage job can pick it up.
    out = os.environ.get("GITHUB_OUTPUT")
    if out and number:
        with open(out, "a") as fh:
            fh.write(f"issue_number={number}\n")

    save_state(new_state)
    return 0


if __name__ == "__main__":
    sys.exit(main())
