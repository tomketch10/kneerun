# KneeRun

Your path back to running after ACL surgery.

KneeRun helps people recovering from ACL reconstruction get genuinely back to running, safely and with confidence, not just off crutches. It paces recovery through three phases that match real rehab milestones rather than an arbitrary calendar: **Recover → Rebuild → Run**.

See [`PROJECT_BRIEF.md`](PROJECT_BRIEF.md) for the full brand, positioning, and product framework.

## What's in this repo

- **The marketing site** (repo root) — a static site hosted on Cloudflare Pages.
  - `index.html` — the landing page.
  - `program.html` — an explainer for the 8-week walk-to-run program (served at `/program`).
  - `favicon.svg`, `og.png` — the pulse mark and the social-share card.
  - `assets/` — images used by the site.
  - `wrangler.jsonc` — Cloudflare Pages config for the `kneerun` project.
- **The mobile app** ([`app/`](app/)) — the Expo / React Native app for the Run phase. See [`docs/app-plan.md`](docs/app-plan.md).
- **Docs** ([`docs/`](docs/)) — the run program, app plan, and related notes.

The site is plain static HTML with no build step. Fonts load from Google Fonts; everything else is inline.

## Running the site locally

Open `index.html` directly in a browser, or serve the folder:

```bash
npx serve .
```

## Deploying the site

Hosted on **Cloudflare Pages** (project `kneerun`, on the `thomas@curvo.eu` personal account), deployed by **direct upload** with wrangler — there is no Git integration.

Deploy assembles the static files into `dist/` (gitignored) and uploads that, so the rest of the monorepo (`app/`, `docs/`) never ships:

```bash
rm -rf dist && mkdir -p dist/assets
cp index.html program.html favicon.svg og.png dist/
cp assets/* dist/assets/
CLOUDFLARE_ACCOUNT_ID=a16ca00b38bc77d4163d3b362f5c8a50 \
  npx wrangler pages deploy dist --project-name kneerun --branch main
```

Live at **https://kneerun.pages.dev**.

### Custom domain (kneerun.com)

`kneerun.com` is registered at NameCheap and not yet on Cloudflare. To point it here:

1. Cloudflare dashboard → **Add a site** → `kneerun.com` (Free plan), and note the two assigned nameservers.
2. NameCheap → set the domain's nameservers to those two Cloudflare ones.
3. Once the zone is **Active**, add `kneerun.com` (and `www`) as a custom domain on the `kneerun` Pages project.

## Not done yet

- Trademark clearance for "KneeRun" has only been checked via general web search.
- The mobile app is in early development (see `docs/app-plan.md`).
