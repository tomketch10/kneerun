# Blog posts

Each `.md` file here is one blog post. Publishing is a two-step loop: write Markdown, run the build.

## Write a post

Create `posts/my-post.md`. The filename (minus `.md`) becomes the URL: `/blog/my-post`.

Start with frontmatter, then write the body in Markdown:

```markdown
---
title: The title, shown as the H1 and in the tab
date: 2026-08-02
description: One or two sentences. Used on the blog index and in social/meta tags.
---

Your post body. Standard Markdown: ## headings, **bold**, [links](https://kneerun.com),
lists, > blockquotes, images, and code all render in the KneeRun style.
```

All three frontmatter fields (`title`, `date`, `description`) are required; the build fails loudly if one is missing. `date` must be `YYYY-MM-DD`. Add an optional `slug:` field to override the URL.

Posts are listed newest first, sorted by `date`. Prefix a filename with `_` (e.g. `_draft-idea.md`) to keep it out of the build while you work on it.

## Build

```bash
npm run build:blog
```

This regenerates the `blog/` directory (gitignored): one `blog/<slug>.html` per post plus `blog/index.html`. Preview by opening `blog/index.html` in a browser, or `npx serve .` from the repo root.

## Publish

`npm run deploy` builds the blog and ships the whole site to Cloudflare Pages. See the root `README.md`.
