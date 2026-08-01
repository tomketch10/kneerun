# KneeRun app — build plan (v1)

A working plan for the first real app build. Opinionated on purpose; every recommendation is a decision we can overturn.

## Decisions locked

1. **Just me.** Single user, on-device, no accounts, no backend, no sync.
2. **No timer in v1.** Sessions are marked done manually — the paper sheet already proves you don't need the app to time you. The guided audio timer is the marquee **v2** feature, once the simple loop is proven.
3. **App suggests the next step, you confirm** (advance / repeat / step-back).
4. **Time-based only.** No GPS, distance, or pace.
5. **One plan** — the 8-week regimen, nothing swappable.

Overriding goal: **keep it simple**, with copy that genuinely encourages and nudges you out the door. Ships on **both iOS and Android** (one Expo codebase).

## The one-line bet

Build the **Run phase** as a standalone guided walk-to-run app for one user (you), then generalise. The regimen in [`run-program.md`](run-program.md) is the whole product surface for v1 — Recover and Rebuild come later.

**Why narrow to Run:** it's where you are right now, it's KneeRun's actual differentiation (everyone else stops at "off crutches"), and it's the one phase we have concrete, validated material for. A guided run-timer you'd use tomorrow beats a broad app you'd use in six months.

## Who v1 is for

You. A single real user, cleared to run, following this regimen. Building for one honest user first means no accounts, no backend, no sync — all on-device. We widen the audience once the loop is proven.

## The core loop

1. **See today's session** — the exact prescription, front and centre, with a line of copy that nudges you out the door.
2. **Go run it** — off you go with your sheet-in-your-head; the app isn't timing you (v1).
3. **Mark it done** — one tap when you're back.
4. **Check in** — one quick "how did the knee feel?"
5. **Get the next step** — the answer suggests advance / repeat / step-back. You confirm, and tomorrow's session updates.

Steps 1 and 5 are the reasons this is an app and not your paper sheet: it always knows exactly where you are, and it flexes the plan to how the knee actually feels.

## Screens (v1)

- **Today** — the current session as a hero, encouraging copy, one big *Mark done* button. The home screen.
- **Check-in** — symptom + effort, then the suggested adaptation to confirm.
- **Plan** — all 8 weeks and 5 sessions, done-state, so you can see how far you've come and what's ahead.

Out of v1: the guided timer, settings, cross-training logging, Recover/Rebuild phases, sharing.

## Data & state

- **Static plan** — [`app/src/data/run-program.json`](../app/src/data/run-program.json), already done.
- **User state** — a `SessionLog[]` on-device (AsyncStorage — simplest thing that works for one user). Each log = date + chosen adaptation + symptom answer. "Today's session" is *derived* from the logs, never stored.
- **No backend.** The waitlist site keeps its Cloudflare D1; the app stays fully local.

## Tech recommendation

**Expo (React Native) + expo-router + TypeScript.** One codebase ships to both the App Store and Play Store, it matches your Curvo stack, and it puts a real build on your phone fast. Reuse Curvo's conventions where they fit (assertNotNull, required props, trailing export blocks). No native timer/audio/background work in v1, so none of the fiddly platform risk — that's deliberately deferred with the timer.

## Milestones

- **M0 — Model & plan view.** ✅ Done. TS types (`Program / Week / Session / SessionLog / Adaptation`) in `app/src/program/`, JSON loaded, Plan screen renders all 8 weeks with done-state.
- **M1 — Today + mark done.** ✅ Done. Today screen derives the current session from logs, shows encouraging copy, one-tap done with AsyncStorage persistence.
- **M2 — Adaptive loop.** ✅ Done. Post-run check-in (good / niggle / sore) → suggests advance/repeat/step-back → confirm → today's session updates.
- **M3 — Progress & polish.** Next. Symptom trend, brand fonts (Bricolage Grotesque / IBM Plex via expo-font), finished-program state polish, accessibility, app icon + splash.
- **v2 (later) — the guided timer.** Audio + haptic run/walk cues, the marquee feature, spiked for background/locked behaviour when we get there.

## Open decisions (need your call)

1. **Audience for v1** — just you (recommended), or shippable to others from day one? Changes whether we need a backend/auth at all.
2. **Background timer** — is "runs with screen locked, cues in your headphones" a must-have for v1, or is screen-on acceptable to start? Drives the M1 spike scope.
3. **Adaptation** — app *suggests* the next step and you confirm (recommended), or app auto-advances silently?
4. **Metrics** — purely time-based intervals (recommended — matches the regimen), or do you eventually want GPS distance/pace? If yes, we design for it now even if v1 hides it.
5. **This regimen only, or multiple plans** — v1 ships the one 8-week plan (recommended), or do we model "programs" as swappable from the start?
