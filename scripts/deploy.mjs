import { rm, mkdir, cp } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const CLOUDFLARE_ACCOUNT_ID = 'a16ca00b38bc77d4163d3b362f5c8a50';
const STATIC_FILES = ['index.html', 'program.html', 'favicon.svg', 'og.png'];

async function deploy() {
  buildBlog();
  await assembleDist();
  uploadToPages();
}

function buildBlog() {
  run('node', [join(ROOT, 'scripts', 'build-blog.mjs')]);
}

async function assembleDist() {
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });
  for (const file of STATIC_FILES) {
    await cp(join(ROOT, file), join(DIST, file));
  }
  await cp(join(ROOT, 'assets'), join(DIST, 'assets'), { recursive: true });
  await cp(join(ROOT, 'blog'), join(DIST, 'blog'), { recursive: true });
}

function uploadToPages() {
  run('npx', ['wrangler', 'pages', 'deploy', 'dist', '--project-name', 'kneerun', '--branch', 'main'], {
    CLOUDFLARE_ACCOUNT_ID
  });
}

function run(command, args, extraEnv = {}) {
  execFileSync(command, args, {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, ...extraEnv }
  });
}

deploy().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
