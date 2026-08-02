# Onboarding & notifications

Plan for two connected pieces of the app: a first-run onboarding flow that captures the runner's name, and the notification strategy that nudges them to keep running. Both are personal and on-device — no backend.

## Onboarding flow

First launch, before the main app:

1. **Welcome** — introduce KneeRun in one line, capture the runner's **name**.
2. **Notifications** (a later step) — a short rationale, then the OS permission prompt.
3. Into the app (Today).

The name is stored on-device (a `profile` record, alongside the session logs) and used to personalise: greetings, nudges, the milestone and finish states ("Nice one, Thomas"). Onboarding shows **once** — it's gated on whether a name is stored, and reappears only if progress is reset.

Build order: **name first** (this pass), notifications permission folded into onboarding once the notification feature lands.

## Notifications

All **local** notifications — scheduled on the device, no push server. That's enough because the app is single-user and the schedule is knowable on-device. (Server-driven push, via Expo push tokens + a backend, is only needed for re-engaging a user who hasn't opened the app in a long time — deferred.)

### What we send

1. **Session reminder** — the core one. A gentle daily nudge at a time the runner picks (e.g. 8am), *only if they haven't logged a session that day*: "Your knee's ready when you are — today's session is 5× (1′ run / 1′ walk)." Cancelled/rescheduled the moment a session is marked done.
2. **Nudge back** — if no session has been logged for ~3 days, a softer "Still with it? Pick up where you left off." Keeps the rhythm without nagging (the plan is 4–6×/week, symptom-led, not fixed days).
3. **Milestone** — on finishing a week, or hitting the first continuous run: a short congratulations. Earned, not spammy.

Copy is personalised with the name and follows the app's warm, plain voice (same rules as the on-screen nudges).

### How it works

- **expo-notifications**, local scheduling only.
- Permission requested during onboarding, with a one-line rationale first (never cold-prompt).
- A notifications module owns: request permission, schedule the daily reminder, reschedule/cancel it when a session is logged, and fire milestone notifications from the log flow.
- Android needs a notification **channel**; iOS needs the foreground-presentation handler set.

### Implementation steps

1. Add `expo-notifications` (+ config plugin, permission strings).
2. Onboarding step 2: rationale screen → request permission → store the choice.
3. `notifications.ts`: permission helpers, schedule/cancel the daily reminder, "already ran today?" check, milestone triggers.
4. Wire scheduling into the mark-done flow (reschedule after each log).
5. A settings affordance to change the reminder time or turn reminders off.
6. Test on a real device — local notification *delivery* can't be verified on web or without a device.

### Decisions to confirm before building notifications

- **Reminder time**: fixed default (e.g. 8am) the runner can change, vs ask during onboarding.
- **Frequency tone**: daily-if-not-done (recommended) vs only the 3-day nudge-back.
- **Milestones**: which ones are worth a notification (week complete, first continuous run) vs none.
