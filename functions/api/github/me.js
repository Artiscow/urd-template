/**
 * GET /api/github/me
 * Innloggingsstatus for editoren: { loggedIn, login?, allowed? }.
 * `allowed` er ALLOWED_LOGINS-sjekken; den håndheves UANSETT på nytt i
 * commit.js (forsvar i dybden), dette svaret er bare for UI-et.
 */
import { currentUser } from '../../_lib/github.js';
import { readCookie } from '../../_lib/cookies.js';
import { isAllowedLogin } from '../../_lib/guard.js';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

export async function onRequestGet({ request, env }) {
  const token = readCookie(request, 'urd_gh');
  if (!token) return json({ loggedIn: false });

  try {
    const user = await currentUser(token);
    return json({ loggedIn: true, login: user.login, allowed: isAllowedLogin(user.login, env) });
  } catch (err) {
    // KUN GitHubs 401 betyr utlogget (ugyldig/utløpt token). Alt annet er
    // GitHub-trøbbel og skal ikke vises som utlogging i editoren.
    if (err.status === 401) return json({ loggedIn: false });
    return json({ error: 'GitHub er utilgjengelig akkurat nå', code: 'githubUnavailable' }, 503);
  }
}
