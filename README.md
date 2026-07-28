# KneeRun

Your path back to running after ACL surgery.

KneeRun helps people recovering from ACL reconstruction get genuinely back to running — safely and with confidence — not just off crutches. It paces recovery through three phases that match real rehab milestones rather than an arbitrary calendar: **Recover → Rebuild → Run**.

See [`PROJECT_BRIEF.md`](PROJECT_BRIEF.md) for the full brand, positioning, and product framework.

## What's in this repo

The **marketing site** — a waitlist landing page deployed on Cloudflare Pages.

- `index.html` — the landing page. Static, no build step. Fonts load from Google Fonts; everything else is inline.
- `favicon.svg`, `og.png` — the pulse mark and the social-share card.
- `functions/api/waitlist.js` — a Cloudflare Pages Function that captures signups into D1.
- `schema.sql` — the `signups` table schema for the `kneerun-waitlist` D1 database.
- `wrangler.jsonc` — Pages config and the D1 binding (`DB`).

## Running it locally

The landing page renders on its own if you open `index.html`, but the waitlist form needs the Function and D1. To run the whole thing:

```bash
npx wrangler d1 execute kneerun-waitlist --local --file=schema.sql   # once, seeds the local DB
npx wrangler pages dev .
```

Then visit the URL wrangler prints (defaults to http://localhost:8788).

## Deploying

Deployment is **Git-connected**: the `tomketch10/kneerun` repo is linked to a Cloudflare Pages project, so pushing to `main` triggers a deploy. There is no build command — Pages serves the repo root and compiles `functions/`.

The `DB` D1 binding is configured in `wrangler.jsonc`; confirm it's also present under the Pages project's **Settings → Functions → D1 bindings** in the Cloudflare dashboard.

## Not done yet

- Trademark clearance for "KneeRun" has only been checked via general web search.
- No mobile app build has started; the brief plus this landing page are the starting point.
