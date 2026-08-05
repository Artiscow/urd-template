/**
 * GET /api/github/callback
 * OAuth-retur: validerer state mot cookien, bytter code mot token
 * SERVER-SIDE (med client_secret), lagrer tokenet i httpOnly-cookien
 * 'urd_gh' og omdirigerer til /admin/. Tokenet når aldri nettleser-JS.
 */
import { cfg } from '../../_lib/github.js';
import { serializeCookie, expireCookie, readCookie } from '../../_lib/cookies.js';

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
    return new Response('Ugyldig OAuth-state (prøv å logge inn på nytt)', { status: 400 });
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
  const token = (await tokenRes.json()).access_token;
  if (!token) {
    return new Response('GitHub godtok ikke innloggingen (utløpt kode?)', { status: 401 });
  }

  const headers = new Headers({ location: '/admin/' });
  headers.append('set-cookie', serializeCookie('urd_gh', token));
  headers.append('set-cookie', expireCookie('urd_state'));
  return new Response(null, { status: 302, headers });
}
