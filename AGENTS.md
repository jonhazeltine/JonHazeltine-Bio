# Jon Hazeltine bio site — AGENTS.md

Jon's personal bio/portfolio site (jonhazeltine.com): who he is, plus a
Software Ventures section (`software.html`) and a developer-partner page
(`developers.html`). PUBLIC repo (`jonhazeltine/JonHazeltine-Bio`).

## Stack

- Plain static site — no framework, no build step. Hand-edited
  `index.html` / `software.html` / `developers.html` + `script.js`. Styling
  is a swappable-skin system: `skin.js` loads one of the themes in `skins/`
  (luxe is the original). Assets (headshot, OG images) live in the repo root.
- `.github/workflows/mirror-plan-codework.yml` is the Mirror app's dispatch
  workflow (Claude code-work runs from Mirror plans) — don't remove it.

## Deploy

- **Vercel, from `main`** — every merge to main deploys automatically.
- Default branch is `main`. There is **no branch protection**, so PRs are
  merged manually after the Vercel preview build passes (no auto-merge).

## Rules

- Flow: feature branch → PR → wait for the Vercel preview check → merge to
  `main`. Never commit straight to main.
- Public repo: never commit secrets or personal data beyond what the site
  already publishes.
- Jon is non-technical — report outcomes in plain English; never ask him to
  review code or a PR. Claude owns the whole PR flow including merging.
