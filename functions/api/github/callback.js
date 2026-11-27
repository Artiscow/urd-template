/**
 * GET /api/github/callback: checks the OAuth state against its cookie, trades the code for a token on the server and keeps it in the httpOnly cookie urd_gh.
 */
import { cfg } from '../../_lib/github.js';
import { expireCookie, readCookie } from '../../_lib/cookies.js';
import { sessionCookies, nowSeconds } from '../../_lib/session.js';

export async function onRequestGet({ request, env }) {
  let config;
  try {
    config = cfg(env);
  } catch (err) {
    return new Response(err.message, { status: 503 });
  }

  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  if (!code || !state || state !== readCookie(request, 'urd_state')) {
    return new Response('Invalid OAuth state (try signing in again)', { status: 400 });
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    body: JSON.stringify({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
    }),
  });
  // An error status or an HTML page from GitHub refuses the sign-in.
  let answer;
  try {
    if (tokenRes.ok) answer = await tokenRes.json();
  } catch { /* an unreadable response is treated as a rejected sign-in */ }
  if (typeof answer?.access_token !== 'string' || !answer.access_token) {
    return new Response('GitHub rejected the sign-in (expired code?)', { status: 401 });
  }

  const headers = new Headers({ location: '/admin/' });
  for (const cookie of sessionCookies(answer, nowSeconds())) headers.append('set-cookie', cookie);
  headers.append('set-cookie', expireCookie('urd_state'));
  return new Response(null, { status: 302, headers });
}
