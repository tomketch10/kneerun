# KneeRun — handover

Pick-up notes for a future session. What exists, how to run and deploy it, the decisions that matter, and what's left.

## What KneeRun is

Helps people get genuinely back to **running** after ACL surgery, not just off crutches. Three-phase framework (Recover → Rebuild → **Run**); only the **Run** phase is built. The product is the walk-to-run 8-week plan. See [`PROJECT_BRIEF.md`](../PROJECT_BRIEF.md).

This repo holds **two things**: the marketing site (repo root) and the mobile app ([`app/`](../app)).

## Live / links

- **Website:** https://kneerun.com (also https://kneerun.pages.dev) — Cloudflare Pages
- **GitHub:** github.com/tomketch10/kneerun (branch `main`)
- **App:** not published; runs via Expo Go or an EAS build (see below)

## The website (repo root)

Static HTML, no build step. `index.html` (landing), `program.html` (the 8-week explainer, served at `/program`), `favicon.svg`, `og.png`, `assets/thomas-medal.jpg`.

- **Brand (light theme):** bg `#F6F4EE`, ink `#14140F`, signature green `#82FF80` for fills / `#2C7A2A` for text-on-light. Fonts: Bricolage Grotesque (display), IBM Plex Sans (body), IBM Plex Mono (labels) via Google Fonts.
- **Copy rules:** first person (it's Thomas's voice), and **no em dashes** anywhere. Run copy through the `fix-ai-writing` skill.
- **Deploy is direct-upload to Cloudflare Pages — NOT git-connected.** Pushing to GitHub does not deploy. To ship the site, assemble `dist/` and run wrangler (full command in [`README.md`](../README.md)). Cloudflare account: `thomas@curvo.eu` personal (`a16ca00b38bc77d4163d3b362f5c8a50`), Pages project `kneerun`.
- **Domain:** registered at NameCheap, DNS moved to Cloudflare. Nameservers `rohin.ns.cloudflare.com` / `tiffany.ns.cloudflare.com`. Apex + `www` are CNAMEs → `kneerun.pages.dev`. The NameCheap email records (MX `eforward*` + SPF TXT) were left intact.
- `og.png` was generated from an HTML card rendered with headless Chrome (same trick works for regenerating it).
- The old waitlist form is gone; the `functions/` + `schema.sql` were removed. A `kneerun-waitlist` D1 database still exists in Cloudflare but is unused.

## The app (`app/`)

Expo Router + TypeScript, **Expo SDK 54**. Bundle id `com.kneerun.app`.

**Structure (`app/src/`):**
- `data/run-program.json` — the plan, single source of truth: 8 weeks × 5 sessions (`reps`, `runMin`, `walkMin`, optional warm-up/cool-down), plus legend and rules.
- `program/types.ts` — `Program / Week / Session / SessionLog / Adaptation / Symptom / SessionRef`.
- `program/program.ts` — pure derivations: current session from logs, prescription text, running/total minutes, next/prev/`refAfter`, `suggestedAdaptation`, `isDone`.
- `program/storage.ts` — `useLogs` (the `SessionLog[]`, in AsyncStorage).
- `program/profile.ts` — `useProfile` (the runner's name).
- `program/notifications.ts` — local notifications. **Native-only and lazily `require`d** so the web build never evaluates it (it touches browser globals during web SSR and crashes otherwise). Exposes configure / requestPermission / scheduleDailyReminder / fireMilestone / `useReminder`.
- `components/welcome.tsx` — `Onboarding`: two steps, name then a daily-reminder opt-in.
- `app/_layout.tsx` — loads fonts, configures notifications, gates onboarding (shows until a name is stored), then the Tabs (Today / Plan).
- `app/index.tsx` — Today: current session, personalised nudge, Mark done → symptom check-in → suggested adaptation → confirm. Fires milestone notifications.
- `app/plan.tsx` — Plan: symptom trend, all 8 weeks, the editable daily-reminder control, reset.
- `theme.ts` — brand tokens (colors, fonts, radius, space).

**Model:** the plan is static; per-user state is a `SessionLog[]` (each = date + symptom + chosen adaptation). "Current session" is *derived* from logs, never stored. Symptom-led: good → advance, niggle → repeat, sore → step-back (app suggests, user confirms).

**Notifications:** local only, no backend. A 9am daily reminder (editable on the Plan screen) and milestone congratulations on finishing each week and the whole program. No-ops on web.

**Icon/splash:** KneeRun pulse mark — dark icon, light splash — wired in `app.json`.

## How to run

- **App in Expo Go (quickest):** `cd app && npx expo start --lan`, scan the QR with the iPhone Camera → "Open in Expo Go". Caveats: the launcher icon is Expo Go's, and **notifications don't fire in Expo Go** (tap "Maybe later" on the reminders step). To hand someone a scannable QR: `npx qrcode -o /tmp/qr.png -w 600 "exp://<lan-ip>:8081"` then send the PNG.
- **Web preview (how app changes were verified):** `cd app && npx expo start --web`. There's **no iOS simulator on this Mac (no Xcode)**, so app UI is verified in the browser via screenshots. Notifications are no-ops on web.
- **Website preview:** `npx serve .` from the repo root, or the browser-pane preview against a local static server.
- **Real device build (EAS):** `eas.json` has development/preview/production profiles. iOS device builds need a **paid Apple Developer account ($99/yr)**. Flow: `npx eas-cli login` → `eas init` → `eas device:create` → `eas build --profile development --platform ios`. These need Thomas's Apple/Expo logins, so he runs them.

## Gotchas (read before touching)

- **Expo SDK 54 is pinned on purpose.** `create-expo-app` originally pulled bleeding-edge **SDK 57**, which no public Expo Go supports — the app was downgraded to 54 to match Expo Go. Do **not** upgrade the SDK unless you're only ever using EAS builds (not Expo Go).
- **Website deploy ≠ git push.** It's direct-upload via wrangler. Push to GitHub for source control; run the wrangler deploy to actually update the live site.
- **No em dashes** in any user-facing copy (site or app).
- `expo-notifications` is lazy-required for the reason above; keep it that way or the web build breaks.

## Open threads / next steps

1. **EAS iOS build** → the app on a real phone with working notifications and the custom icon. Blocked on a paid Apple Developer account.
2. **Guided run timer (v2)** — the marquee feature deferred early: an in-app timer that runs the session's intervals and cues run/walk by audio + haptics.
3. **Recover / Rebuild phases** — only Run is built; the other two phases are still just the framework.
4. **Remove or repurpose** the orphaned `kneerun-waitlist` D1 database.

## Quick reference

| | |
|---|---|
| Cloudflare account id | `a16ca00b38bc77d4163d3b362f5c8a50` (thomas@curvo.eu personal) |
| Cloudflare Pages project | `kneerun` |
| Nameservers | `rohin.ns.cloudflare.com`, `tiffany.ns.cloudflare.com` |
| App bundle id | `com.kneerun.app` |
| Expo SDK | 54 (pinned) |
| GitHub | tomketch10/kneerun |
