#!/usr/bin/env python3
"""
Platform drift check — nightly sweep of FASTR-Analytics/platform and
FASTR-Analytics/modules.

Compares the upstream repos against the last-seen state stored in
`.github/platform_watch_state.json`. When new CHANGELOG entries or commits
appear, opens a triage issue in this repo with a categorized summary so
the team knows when an upstream change might affect methodology, prompts,
or handouts.

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
        "Automated daily check of `FASTR-Analytics/platform` and "
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
    lines += [
        "## To triage",
        "",
        "- [ ] Do any highlighted entries need a methodology / handout / prompt update?",
        "- [ ] Close this issue when reviewed.",
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

    if existing_open_issue(title):
        print(f"Open issue '{title}' already exists. Skipping creation.")
    else:
        print(f"Opening issue: {title}")
        gh("issue", "create",
           "--repo", THIS_REPO,
           "--title", title,
           "--body", body)

    save_state(new_state)
    return 0


if __name__ == "__main__":
    sys.exit(main())
