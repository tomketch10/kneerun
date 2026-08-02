# KneeRun

KneeRun is a mobile app and marketing site that helps people recovering from ACL reconstruction surgery get genuinely back to running, safely and without reinjury. Recovery is paced through three phases that match real rehab milestones rather than a calendar: **Recover** (range of motion, swelling, quad activation), **Rebuild** (single-leg strength benchmarked against real return-to-run criteria), and **Run** (a gradual walk-to-run progression). It is built by someone going through ACL and meniscus recovery themselves.

See `PROJECT_BRIEF.md` for full brand, palette, and positioning.

## Repo layout

- `index.html`, `program.html` — static landing pages, plain HTML, no build step.
- `posts/*.md` — blog post sources (Markdown + frontmatter). See `posts/README.md`.
- `scripts/build-blog.mjs` — renders `posts/` into `blog/` (gitignored). Run with `npm run build:blog`.
- `scripts/deploy.mjs` — builds the blog and deploys to Cloudflare Pages. Run with `npm run deploy`.

## Publishing a blog post

1. Write `posts/<slug>.md`. The filename becomes the URL (`/blog/<slug>`).
2. Frontmatter `title`, `date` (`YYYY-MM-DD`), and `description` are all required; the build fails without them.
3. Run `npm run build:blog` and confirm it builds without error.

**Never run `npm run deploy` in an automated or unattended run.** Deploying is always a human step after review.

## Writing rules for blog posts

**Target reader.** Write for a person recovering from ACL reconstruction who wants to get back to running, not for surgeons or physios. Assume they are past early physio, can walk normally, and are anxious about reinjury. Explain any clinical term in plain language the first time it appears. Never write "Best 5 apps" style roundups.

**Tone and voice.** First person, as someone going through ACL and meniscus recovery themselves, not a brand at a distance. Honest, specific, warm, encouraging without hype. Credible but human.

**Topic framing.** Centre on the return-to-running phase: the gap after formal physio, where reinjury risk is highest. Frame progress around real rehab milestones and symptom response, never arbitrary calendar dates. Use the Recover / Rebuild / Run structure where it fits. Core message: the biggest risk is running too early, too fast.

**Competitor exclusion.** Never name competitor apps, brands, or products (including Exakt Health, Injurymap, Curovate, Runna, or any rehab app). Do not compare KneeRun to named alternatives.

**Mandatory mention.** Every post includes a brief line that this is not medical advice and readers should clear their return to running with their own surgeon or physio. Ground return-to-run guidance in real criteria (e.g. quad strength symmetry, how the knee responds), not fixed dates.

**Pricing.** KneeRun is pre-launch. Never quote prices, plans, or discounts, and never promise features that are not shipped. Point readers to early access, not a purchase.

## AI-writing tells to avoid

Blog posts must not read as AI-generated. Apply these hard rules, then self-check before finishing.

Hard rules:
- **No em dashes or double hyphens.** Use commas, periods, colons, or brackets.
- **No semicolons in prose.** Use a full stop.
- **No bulleted lists with bold inline headers** (`**Lead-in.** explanation`). Use plain prose or plain bullets.
- **Plain verbs.** Never "leverage", "utilise", "facilitate", "foster", "delve", "navigate" (metaphorical), "empower", "unlock", "showcase".
- **No inflated adjectives.** Cut "crucial", "vital", "seamless", "comprehensive", "vibrant", "robust", "cutting-edge".
- **No "it's not X, it's Y" theatrical contrasts,** no "In today's world" openers, no rhetorical-question-then-answer, no rule-of-three flourishes.
- **No summary/restatement paragraph at the end.** Trust the reader. End on a concrete or human note, not a recap.
- **No vague attributions** ("experts say", "studies show") without naming the source.
- **Sentence-case headings**, not Title Case.

Positive markers of good writing: specific numbers, real lived detail, varied sentence and paragraph length, honest opinions, plain words.

Mechanical self-check before finishing (run these greps on the generated HTML in `blog/`):
- `grep -o "—" blog/<slug>.html | wc -l` must be `0`.
- `grep -o '<strong>' blog/<slug>.html` should be empty in the article body.

## Automation guardrails (scheduled drafts)

When drafting a post on a schedule:
- Produce exactly **one** post per run.
- First read every existing file in `posts/` and pick a topic that is **not already covered**.
- Open a **pull request** with the new post. Never commit to `main`, never merge, and never deploy.
- The PR is a draft for human review. A person edits, approves, merges, and deploys.
