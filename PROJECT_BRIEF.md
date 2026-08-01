# KneeRun — Project Brief

## What it is
An app to help people recovering from ACL reconstruction get back to running — not just off crutches, but genuinely back to running, safely and with confidence.

## Naming & domain
- **Name:** KneeRun
- **Domain:** kneerun.com (owned)
- **App Store listing name:** KneeRun: ACL Recovery
- **Tagline:** Your path back to running after ACL surgery

## Brand identity
- **Signature mark:** "pulse into stride" — a heartbeat/ECG line that resolves into a running gait line. Represents the journey from the clinical/monitored phase of recovery into real motion.
- **Palette:** light, warm paper surfaces with the signature green accent.
  - Background: `#F6F4EE` (warm paper)
  - Surface / cards: `#FFFFFF`
  - Ink (text): `#14140F` (warm near-black)
  - Muted text: `#6B6960`
  - Accent — fills (buttons, dots): `#82FF80` (signature mint green)
  - Accent — text (labels, tags on light): `#2C7A2A` (deeper green, for contrast on white)
  - Accent dim: `#4E8A4C`
- **Type:**
  - Display: Bricolage Grotesque
  - Body: IBM Plex Sans
  - Utility/mono (labels, counters): IBM Plex Mono
- Brand direction takes cues from Curvo's system (curvo.eu/styleguide) — same energetic-but-credible tone — while staying visually distinct with its own mark and a light, warm palette anchored by the signature green.

## Core product framework
Three phases, matching real ACL rehab milestones rather than an arbitrary calendar:

1. **Recover** — range of motion, swelling control, quad activation. Tracked daily so the user knows they're actually ready to progress, not guessing.
2. **Rebuild** — structured strength and single-leg work, benchmarked against real return-to-run criteria (e.g. quad strength symmetry) rather than a fixed date.
3. **Run** — a gradual, data-informed run progression designed to prevent the single biggest risk in ACL recovery: running too early, too fast.

## Positioning / why it's different
Most rehab content and apps stop at "off crutches" or general physio. There's very little structured, specific guidance for the return-to-running phase — which is exactly where reinjury risk is highest and where people feel most lost. KneeRun is built by someone currently going through ACL/meniscus recovery themselves, not designed at a distance.

## Assets included
- `index.html` — a self-contained landing page (waitlist/early-access style), dark charcoal + signature green identity, animated pulse-into-stride hero mark, three-phase section, founder-story section, email capture form (front-end only, not yet wired to a backend).

## Open items / next decisions
- Final palette direction: confirmed as a light, warm palette + signature green (earlier dark-charcoal and periwinkle/orange directions were explored but not chosen).
- Waitlist form needs a real backend (e.g. simple serverless function, Google Sheet, or a service like Mailchimp/ConvertKit) to actually capture emails.
- Trademark clearance for "KneeRun" has only been checked via general web search — not a substitute for a real USPTO/EUIPO/Benelux clearance search.
- The mobile app build has started (Expo/React Native in `app/`) — the Run phase (walk-to-run regimen) is the v1 focus. See `docs/app-plan.md`.

## Suggested first steps in Claude Code
- Scaffold a simple project (e.g. a marketing site repo deploying the landing page as-is, and/or a separate app repo for the actual product).
- Wire up the email capture form to a real backend.
- Begin defining data models for the three-phase framework (recovery day tracking, strength benchmarks, run progression logic).
