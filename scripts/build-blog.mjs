import { readdir, readFile, rm, mkdir, writeFile } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const POSTS_DIR = join(ROOT, 'posts');
const OUT_DIR = join(ROOT, 'blog');
const SITE_URL = 'https://kneerun.com';

marked.setOptions({ mangle: false, headerIds: false });

async function build() {
  const posts = await readPosts();
  if (posts.length === 0) {
    console.warn('No posts found in posts/. Nothing to build.');
    return;
  }
  await resetOutputDir();
  await Promise.all(posts.map(writePostPage));
  await writeIndexPage(posts);
  console.log(`Built ${posts.length} post(s) → blog/`);
}

async function readPosts() {
  const entries = await readdir(POSTS_DIR);
  const markdownFiles = entries.filter(isPublishablePost);
  const posts = await Promise.all(markdownFiles.map(parsePostFile));
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

function isPublishablePost(fileName) {
  if (!fileName.endsWith('.md')) return false;
  if (fileName === 'README.md') return false;
  return !fileName.startsWith('_');
}

async function parsePostFile(fileName) {
  const raw = await readFile(join(POSTS_DIR, fileName), 'utf8');
  const { frontmatter, body } = splitFrontmatter(raw);
  const slug = frontmatter.slug ?? basename(fileName, '.md');
  requireFields(frontmatter, fileName, ['title', 'date', 'description']);
  return {
    slug,
    title: frontmatter.title,
    date: frontmatter.date,
    description: frontmatter.description,
    contentHtml: marked.parse(body)
  };
}

function splitFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: raw };
  const frontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!pair) continue;
    frontmatter[pair[1]] = stripQuotes(pair[2].trim());
  }
  return { frontmatter, body: match[2] };
}

function stripQuotes(value) {
  return value.replace(/^["'](.*)["']$/, '$1');
}

function requireFields(frontmatter, fileName, fields) {
  for (const field of fields) {
    if (!frontmatter[field]) {
      throw new Error(`posts/${fileName} is missing required frontmatter field: ${field}`);
    }
  }
}

async function resetOutputDir() {
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });
}

async function writePostPage(post) {
  const canonical = `${SITE_URL}/blog/${post.slug}`;
  const inner = `
<header class="intro wrap">
  <a class="back" href="/blog">← Blog</a>
  <span class="eyebrow">${formatDate(post.date)}</span>
  <h1>${escapeHtml(post.title)}</h1>
  <p class="lede">${escapeHtml(post.description)}</p>
</header>

<article class="body wrap">
  ${post.contentHtml}

  <div class="app-cta">
    <h2>Recover with KneeRun</h2>
    <p>KneeRun paces your return to running through the phases that match real ACL rehab: Recover, Rebuild, Run.</p>
    <a class="download-btn" href="/#get-access">Download KneeRun</a>
  </div>
</article>`;
  const html = layout({
    title: `${post.title} | KneeRun`,
    description: post.description,
    canonical,
    ogTitle: post.title,
    inner
  });
  await writeFile(join(OUT_DIR, `${post.slug}.html`), html);
}

async function writeIndexPage(posts) {
  const items = posts.map(renderPostListItem).join('\n');
  const inner = `
<header class="intro wrap">
  <span class="eyebrow">Blog</span>
  <h1>Notes on getting back to running</h1>
  <p class="lede">Honest, specific writing on ACL recovery and the return to running, from someone going through it.</p>
</header>

<section class="body wrap">
  <div class="post-list">
${items}
  </div>
</section>`;
  const html = layout({
    title: 'Blog | KneeRun',
    description: 'Honest, specific writing on ACL recovery and the return to running.',
    canonical: `${SITE_URL}/blog`,
    ogTitle: 'The KneeRun blog',
    inner
  });
  await writeFile(join(OUT_DIR, 'index.html'), html);
}

function renderPostListItem(post) {
  return `    <a class="post-item" href="/blog/${post.slug}">
      <div class="post-date">${formatDate(post.date)}</div>
      <div class="post-meta">
        <h2>${escapeHtml(post.title)}</h2>
        <p>${escapeHtml(post.description)}</p>
      </div>
    </a>`;
}

function formatDate(iso) {
  const date = new Date(`${iso}T00:00:00Z`);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  });
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function layout({ title, description, canonical, ogTitle, inner }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#F6F4EE">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/favicon.svg">

<meta property="og:type" content="article">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${escapeHtml(ogTitle)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:image" content="${SITE_URL}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(ogTitle)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${SITE_URL}/og.png">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
${BASE_CSS}
</style>
</head>
<body>

<nav>
  <div class="wrap">
    <a class="brand" href="/">
      <svg width="30" height="30" viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="#1A1A1A"/>
        <polyline points="12,36 20,36 26,20 32,42 38,26 44,36 52,36" fill="none" stroke="#82FF80" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      KneeRun
    </a>
    <div class="nav-links">
      <a href="/#phases" class="nav-only-wide">How it works</a>
      <a href="/program">Run program</a>
      <a href="/blog" class="active">Blog</a>
    </div>
    <a class="nav-cta" href="/#get-access">Download</a>
  </div>
</nav>
${inner}

<footer>
  <div class="wrap">
    <span>© 2026 KneeRun</span>
    <span>kneerun.com</span>
  </div>
</footer>

</body>
</html>
`;
}

const BASE_CSS = `  :root {
    --bg: #F6F4EE;
    --bg-alt: #FFFFFF;
    --ink: #14140F;
    --muted: #6B6960;
    --accent: #82FF80;
    --accent-text: #2C7A2A;
    --line: rgba(20,20,15,0.10);
    --line-strong: rgba(20,20,15,0.18);
    --on-accent: #0E2410;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--ink);
    font-family: 'IBM Plex Sans', sans-serif;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3 {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  a { color: inherit; text-decoration: none; }

  .wrap { max-width: 1100px; margin: 0 auto; padding: 0 32px; }

  /* ---------- Nav ---------- */
  nav {
    position: sticky;
    top: 0;
    z-index: 10;
    background: rgba(246,244,238,0.85);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--line);
  }
  nav .wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 72px;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-weight: 700;
    font-size: 19px;
  }
  .brand svg { display: block; }
  .nav-links {
    display: flex;
    gap: 32px;
    font-size: 14px;
    color: var(--muted);
  }
  .nav-links a:hover, .nav-links a.active { color: var(--ink); }
  .nav-cta {
    border: 1px solid var(--line-strong);
    padding: 9px 18px;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
  }
  .nav-cta:hover { border-color: var(--accent-text); color: var(--accent-text); }

  /* ---------- Intro ---------- */
  .intro { padding: 72px 32px 8px; }
  .back {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
    color: var(--muted);
    display: inline-block;
    margin-bottom: 24px;
  }
  .back:hover { color: var(--ink); }
  .eyebrow {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--accent-text);
    margin-bottom: 20px;
    display: block;
  }
  .intro h1 { font-size: 46px; line-height: 1.06; margin-bottom: 20px; max-width: 20ch; }
  .intro p.lede { font-size: 18px; color: var(--muted); max-width: 60ch; }

  /* ---------- Article body ---------- */
  section.body, article.body { padding: 24px 32px 40px; }
  article.body p, article.body h2, article.body h3,
  article.body ul, article.body ol, article.body blockquote { max-width: 68ch; }
  article.body h2 { font-size: 26px; margin: 44px 0 14px; }
  article.body h3 { font-size: 20px; margin: 32px 0 10px; }
  article.body p { font-size: 17px; color: var(--ink); margin: 0 0 18px; }
  article.body a { color: var(--accent-text); text-decoration: underline; text-underline-offset: 2px; }
  article.body a:hover { color: var(--ink); }
  article.body ul, article.body ol { margin: 0 0 18px; padding-left: 22px; }
  article.body li { font-size: 17px; margin-bottom: 8px; }
  article.body blockquote {
    border-left: 3px solid var(--accent);
    padding: 4px 0 4px 20px;
    margin: 0 0 20px;
    color: var(--muted);
    font-style: italic;
  }
  article.body img { width: 100%; height: auto; border-radius: 16px; margin: 24px 0; }
  article.body hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }
  article.body code {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.9em;
    background: var(--bg-alt);
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 1px 6px;
  }
  article.body pre {
    background: var(--bg-alt);
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 18px 20px;
    overflow-x: auto;
    margin: 0 0 20px;
  }
  article.body pre code { background: none; border: none; padding: 0; }

  /* ---------- Post list ---------- */
  .post-list { margin: 40px 0 8px; }
  .post-item {
    display: grid;
    grid-template-columns: 150px 1fr;
    gap: 24px;
    padding: 28px 0;
    border-top: 1px solid var(--line);
  }
  .post-item:first-child { border-top: none; }
  .post-item:hover .post-meta h2 { color: var(--accent-text); }
  .post-date {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
    padding-top: 5px;
  }
  .post-meta h2 { font-size: 22px; margin-bottom: 8px; transition: color 0.15s ease; }
  .post-meta p { font-size: 16px; color: var(--muted); max-width: 60ch; }

  /* ---------- App CTA ---------- */
  .app-cta {
    background: var(--bg-alt);
    border: 1px solid var(--line);
    border-radius: 20px;
    padding: 40px 32px;
    margin: 56px 0 8px;
    text-align: center;
  }
  .app-cta h2 { font-size: 24px; margin-bottom: 12px; }
  .app-cta p { color: var(--muted); max-width: 52ch; margin: 0 auto 26px; }
  .download-btn {
    display: inline-block;
    background: var(--accent);
    color: var(--on-accent);
    font-weight: 600;
    padding: 13px 28px;
    border-radius: 100px;
    font-size: 15px;
  }
  .download-btn:hover { background: #6DE86B; }

  /* ---------- Footer ---------- */
  footer { border-top: 1px solid var(--line); padding: 32px 0; margin-top: 56px; }
  footer .wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    color: var(--muted);
  }

  @media (max-width: 760px) {
    nav .wrap { padding: 0 20px; }
    .nav-links { gap: 18px; }
    .nav-only-wide { display: none; }
    .nav-cta { padding: 9px 16px; }
    .intro { padding-top: 48px; }
    .intro h1 { font-size: 32px; }
    section.body, article.body { padding-top: 8px; }
    article.body h2 { font-size: 22px; }
    .post-item { grid-template-columns: 1fr; gap: 6px; padding: 22px 0; }
    .app-cta { margin: 40px 0 8px; padding: 32px 24px; }
  }

  @media (max-width: 520px) {
    .nav-links { display: none; }
  }`;

build().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
