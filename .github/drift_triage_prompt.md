You are triaging a "Platform drift check" issue in the FASTR resource hub. The issue lists changes that landed in the FASTR analytics platform (github.com/FASTR-Analytics/platform) and the analytical modules (github.com/FASTR-Analytics/modules) since the previous check. Your job is to find which content in THIS repo those changes make wrong, fix it on a branch, and open a pull request for a human to merge. Nothing you do reaches main, the published site or the training material until someone merges.

Ground rules (from CLAUDE.md): the platform code and the published guides are the source of truth, never memory or assumptions. When an entry is ambiguous, look at the platform repo with `gh api repos/FASTR-Analytics/platform/contents/<path>` or `gh search code --repo FASTR-Analytics/platform <query>`, and at the guides under `src/content/docs/` in github.com/FASTR-Analytics/site. French UI labels live as `fr:` strings in `client/src/components/**/*.tsx`; Portuguese as `pt:`.

## Phase 1: find what is wrong

1. Read the issue body once (`gh issue view <number> --json body -q .body`; the number is also in the `ISSUE_NUMBER` environment variable). Ignore `[internal]`, `[infra]` and `[admin]`-only entries unless an `[admin]` entry changes a screen that handouts describe. Work from the "Content likely affected" section: it already groups the user-facing entries by area.
2. Budget: about 60 tool calls for this phase, so one batched Grep per area (alternation of the old and new terms, across `handouts methodology core_content core_content_fr core_content_pt`), then Read only the files that matched. Do not `ls` directories, do not open images, do not read whole methodology chapters. Grep for the old label, the old button name, the old tab name, the old concept. The issue's candidate paths are hints, verify them.
3. Decide per finding: is the text now WRONG (names a button, tab, screen, field or behaviour that no longer exists or changed), or merely INCOMPLETE (a new feature the text doesn't mention)? Fix wrong text. Leave incomplete text alone unless the addition is one sentence and clearly useful.

## Phase 2: fix it

If nothing is wrong: post one comment on the issue with **No content affected** and a one-line "Not affected:" list of what you checked, then `gh issue close <number>`. Stop.

Otherwise:

4. `git config user.name "claude[bot]"`, `git config user.email "claude[bot]@users.noreply.github.com"`, then `git checkout -b drift/issue-<number>`.
5. Apply the edits. Rules:
   - Handouts live in `handouts/<lang>/...`. EN, FR and PT mirrors share a filename; edit all three the same way, in that language. Use the platform's own UI labels for each language (the `en:`/`fr:`/`pt:` strings).
   - Methodology lives in `methodology/*.md` (EN), `methodology/fr/`, `methodology/pt/`. Edit the source there; do NOT edit `core_content*/` files that have a methodology source, CI re-extracts them after merge. Only edit a `core_content*/` file directly when the slide has no methodology source (its heading appears nowhere under `methodology/`); say so in the PR body.
   - Keep the author's voice: plain, instructive, no warnings or cheerleading. Sentence case headings. American spelling in EN.
   - Do not touch `web-app/`, `tools/`, `resources/screenshots/`, `.github/`, or any `.pdf`. PDFs are rebuilt by CI after merge.
   - If a screenshot now shows a retired screen, do not delete or replace it; list it under "Screenshots to recapture" in the PR body. Recapturing needs a signed-in session and is done by a person.
   - Do not rewrite a whole handout. If a change is so large that the handout needs restructuring (a screen or flow was replaced), make the minimal edit that stops the text being wrong, and say in the PR body that a rewrite is needed.
6. `git add` the files you changed, `git commit` with a message that starts with `drift: ` and names the platform version and the areas fixed, then `git push -u origin drift/issue-<number>`.
7. Open the pull request with `gh pr create --base main --head drift/issue-<number>` and a body with these sections: **What changed in the platform** (the entries that mattered, one line each), **Edits** (one bullet per file, what it said and what it says now, EN/FR/PT grouped), **Screenshots to recapture** (file names, or "none"), **Needs a rewrite** (files where the minimal edit is not enough, or "none"), **Not affected** (the entries you ruled out). End the body with `Closes #<number>`.
8. Post one comment on the issue: "Fix ready for review: <PR url>" plus the "Screenshots to recapture" list if any. Do not close the issue; the merge closes it. If `gh pr create` is refused ("not permitted to create or approve pull requests"), post the same PR body as the issue comment instead, headed by the compare link `https://github.com/<repo>/compare/main...drift/issue-<number>?expand=1`, so a person can open the PR in one click.

Keep the PR body under about 500 words. If the issue lists more than 20 user-facing entries, prioritize the ones that rename or remove a screen, button, tab or concept.
