# KneeRun

Your path back to running after ACL surgery.

KneeRun helps people recovering from ACL reconstruction get genuinely back to running — safely and with confidence — not just off crutches. It paces recovery through three phases that match real rehab milestones rather than an arbitrary calendar: **Recover → Rebuild → Run**.

See [`PROJECT_BRIEF.md`](PROJECT_BRIEF.md) for the full brand, positioning, and product framework.

## What's in this repo

Right now this is the **marketing site** only — a self-contained waitlist landing page.

- `index.html` — the landing page. No build step, no dependencies. Fonts load from Google Fonts; everything else is inline.

## Running it locally

Open `index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Deploying

`index.html` is a static file and works as-is on any static host (Cloudflare Pages, Netlify, Vercel, GitHub Pages). Point the host at this repo's root; no build command is needed.

## Not done yet

- The waitlist email form is front-end only — it needs a real backend to capture emails.
- Trademark clearance for "KneeRun" has only been checked via general web search.
- No mobile app build has started; the brief plus this landing page are the starting point.
