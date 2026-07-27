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
- **Palette:**
  - Background: `#14140F` (warm near-black)
  - Background alt: `#1B1B15`
  - Ink (text): `#F1EFE8`
  - Muted text: `#9A988D`
  - Accent (primary, signature green): `#82FF80`
  - Accent dim: `#4E8A4C`
- **Type:**
  - Display: Bricolage Grotesque
  - Body: IBM Plex Sans
  - Utility/mono (labels, counters): IBM Plex Mono
- Brand direction takes cues from Curvo's system (curvo.eu/styleguide) — same energetic-but-credible tone — while staying visually distinct with its own mark and a narrower, more clinical-leaning palette.

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
- Final palette direction: confirmed as dark charcoal + signature green (an earlier periwinkle/orange direction was explored but not chosen).
- Waitlist form needs a real backend (e.g. simple serverless function, Google Sheet, or a service like Mailchimp/ConvertKit) to actually capture emails.
- Trademark clearance for "KneeRun" has only been checked via general web search — not a substitute for a real USPTO/EUIPO/Benelux clearance search.
- No mobile app build has started yet — this brief plus the landing page are the starting point for that.

## Suggested first steps in Claude Code
- Scaffold a simple project (e.g. a marketing site repo deploying the landing page as-is, and/or a separate app repo for the actual product).
- Wire up the email capture form to a real backend.
- Begin defining data models for the three-phase framework (recovery day tracking, strength benchmarks, run progression logic).
