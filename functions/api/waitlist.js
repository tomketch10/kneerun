/**
 * Waitlist signup endpoint — POST /api/waitlist
 *
 * Stores an email in the `signups` D1 table. Duplicates are treated as success
 * (idempotent) so the client never has to reason about "already on the list".
 *
 * @typedef {Object} Env
 * @property {D1Database} DB
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254; // RFC 5321

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

async function readEmail(request) {
  const type = request.headers.get('content-type') || '';
  if (type.includes('application/json')) {
    const body = await request.json();
    return { email: body.email, honeypot: body.company };
  }
  const form = await request.formData();
  return { email: form.get('email'), honeypot: form.get('company') };
}

/** @type {PagesFunction<Env>} */
export const onRequestPost = async ({ request, env }) => {
  let email, honeypot;
  try {
    ({ email, honeypot } = await readEmail(request));
  } catch {
    return json({ ok: false, error: 'invalid_request' }, 400);
  }

  // Bots fill hidden fields; humans leave them empty. Pretend it worked.
  if (honeypot) return json({ ok: true });

  email = String(email || '').trim().toLowerCase();
  if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'invalid_email' }, 400);
  }

  try {
    await env.DB.prepare(
      'INSERT INTO signups (email, source, user_agent) VALUES (?, ?, ?) ON CONFLICT(email) DO NOTHING'
    )
      .bind(email, 'landing', request.headers.get('user-agent') || null)
      .run();
  } catch {
    return json({ ok: false, error: 'server_error' }, 500);
  }

  return json({ ok: true });
};

// A GET here is almost always a misdirected browser or crawler.
export const onRequestGet = () => json({ ok: false, error: 'method_not_allowed' }, 405);
