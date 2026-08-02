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
- **The blog** ([`posts/`](posts/)) — one Markdown file per post; a small script renders them to static HTML. See [`posts/README.md`](posts/README.md).
- **The mobile app** ([`app/`](app/)) — the Expo / React Native app for the Run phase. See [`docs/app-plan.md`](docs/app-plan.md).
- **Docs** ([`docs/`](docs/)) — the run program, app plan, and related notes.

The landing pages (`index.html`, `program.html`) are plain static HTML with no build step. The blog is the one exception: posts are written in Markdown under `posts/` and built to `blog/` (gitignored) by `scripts/build-blog.mjs`. Fonts load from Google Fonts; everything else is inline.

## Running the site locally

Build the blog, then serve the folder (clean URLs, same as production):

```bash
npm install
npm run build:blog
npx serve .
```

Open `index.html` directly in a browser for the landing pages, but the blog needs the build step first.

## Deploying the site

Hosted on **Cloudflare Pages** (project `kneerun`, on the `thomas@curvo.eu` personal account), deployed by **direct upload** with wrangler — there is no Git integration.

One command builds the blog, assembles the static files into `dist/` (gitignored), and uploads that — so the rest of the monorepo (`app/`, `docs/`) never ships and the blog is always freshly built:

```bash
npm run deploy
```

That runs [`scripts/deploy.mjs`](scripts/deploy.mjs). Live at **https://kneerun.pages.dev**.

### Custom domain (kneerun.com)

`kneerun.com` is registered at NameCheap and not yet on Cloudflare. To point it here:

1. Cloudflare dashboard → **Add a site** → `kneerun.com` (Free plan), and note the two assigned nameservers.
2. NameCheap → set the domain's nameservers to those two Cloudflare ones.
3. Once the zone is **Active**, add `kneerun.com` (and `www`) as a custom domain on the `kneerun` Pages project.

## Not done yet

- Trademark clearance for "KneeRun" has only been checked via general web search.
- The mobile app is in early development (see `docs/app-plan.md`).
