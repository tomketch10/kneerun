# The walk-to-run regimen

This is the backbone of KneeRun's **Run** phase — the third and final phase, where the knee is cleared to run again and the job is to get back to continuous running without reinjuring it. Structured source of truth lives in [`app/src/data/run-program.json`](../app/src/data/run-program.json); this doc explains what it is and how an app is built around it.

## What it is

An 8-week progression of run/walk intervals. You never just "go for a run" — every outing is a prescription of short runs separated by walking. Week 1 starts at **1 minute of running / 1 minute of walking**, repeated a handful of times. Each session the running load nudges up. By week 8 the walk breaks have vanished and you're running **30 minutes continuously**.

The whole point is to make every step up small enough that the graft, tendons, and your own nerve all keep pace. Running too early or too fast is the single biggest cause of setbacks in ACL recovery, so the regimen trades speed for a ramp gentle enough to stay ahead of the tissue.

## How a session is prescribed

Every session is the same shape: repeat a *run interval* then a *walk interval*, N times.

```
reps × (runMin run / walkMin walk)
```

- `3 × (1′ run / 1′ walk)` → run 1 min, walk 1 min, three times over.
- A session can be bookended by an optional 5-minute warm-up and cool-down walk.
- The final three sessions have `walkMin: 0, reps: 1` — a single continuous run (20′, 25′, 30′).

Two derived numbers are worth surfacing per session:

- **Running minutes** = `reps × runMin` — the true training load, and the thing that climbs across the plan (3′ in week 1 → 30′ in week 8).
- **Total minutes** = `reps × (runMin + walkMin)` (+ warm-up/cool-down) — how long the outing takes, for planning around a day.

## The progression

| Week | Runs are… | Shape |
|------|-----------|-------|
| 1–2  | 1 min | build reps: 3× → 12× |
| 3    | 1 → 2 min | last sessions jump to 2′ runs |
| 4    | 2 min | build volume: 5× → 9× |
| 5    | 2 → 3 min | |
| 6    | 3 → 4 min | |
| 7    | 4 → 9 min | the big jump |
| 8    | 14 min → continuous | 14′, then 20′/25′/30′ straight |

## The rules (why it's more than a table)

The schedule is only half the regimen. The other half is *how you move through it*, and this is where an app earns its keep over a paper sheet:

1. **Bookend walks** — 5 min walking each end to warm up and cool down (optional).
2. **Symptom-led progression** — the plan is not a calendar. After each session the runner judges comfort and knee symptoms, then either advances, **repeats the same session**, or **drops back one**. Progression is earned, not dated.
3. **Frequency** — run 4–6× per week, never more.
4. **Cross-training** — fill non-running days with low-impact transfer work (cycling, aqua-jogging) to build fitness without loading the joint.

## Domain model for the app

```
Program
  └─ Week (×8)          focus, order
       └─ Session (×5)  reps, runMin, walkMin, warmup/cooldown
```

That's the static plan (the JSON). Around it the app needs a small amount of *per-user state* — the thing paper can't do:

- **SessionLog** — one per completed session: the date done, and which adaptation the runner chose (advance / repeat / step-back). This is the real progress record; "current session" is derived from it, not stored.
- **Adaptation** — advance is the default; repeat and step-back let the plan flex to how the knee actually feels, so a bad week doesn't break the sequence.

Two features fall straight out of this model and are the reason it's an app, not a PDF:

- **A guided run timer.** The app already knows the exact interval structure of the current session, so it can run the clock and cue "run now" / "walk now" out loud — the runner never has to watch a stopwatch or count reps.
- **Symptom check-in after each run.** A quick "how did the knee feel?" drives the advance/repeat/step-back decision instead of leaving the runner to guess, and builds a symptom trend over the eight weeks.

## What this connects to

The Run phase assumes Recover and Rebuild are behind the user — range of motion restored, and strength benchmarks (e.g. quad symmetry) met. Return-to-run readiness is the gate into this regimen; see [`PROJECT_BRIEF.md`](../PROJECT_BRIEF.md) for the three-phase framework.
