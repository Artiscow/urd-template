/**
 * Anonym, lesende feed-proxy for kalender-pluginen: nettlesere kan ikke hente
 * iCal-feeder direkte (feed-verter sender ikke CORS, og sidens CSP tillater
 * kun connect-src 'self'), så pluginen henter alt via denne samme-origin-ruten.
 *
 * ÅPEN PROXY-VERN: kun https, ingen innlogging i URL-en, og verten må stå på
 * allowlisten (calendar.google.com er alltid med; eieren legger andre feed-
 * verter i env-variabelen ICS_HOSTS, kommaseparert). Omdirigeringer valideres
 * mot samme liste, så en godkjent vert ikke kan peke proxyen videre.
 */

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

const MAX_BYTES = 1_500_000;

export async function onRequestGet({ request, env }) {
  const raw = new URL(request.url).searchParams.get('url') ?? '';
  let target;
  try {
    target = new URL(raw);
  } catch {
    return json({ error: 'Ugyldig kalenderadresse', code: 'badCalendarUrl' }, 400);
  }
  if (target.protocol !== 'https:' || target.username || target.password || target.port) {
    return json({ error: 'Kun vanlige https-adresser uten innlogging', code: 'insecureCalendarUrl' }, 400);
  }

  const allowed = new Set(['calendar.google.com',
    ...String(env.ICS_HOSTS ?? '').split(',').map((h) => h.trim().toLowerCase()).filter(Boolean)]);
  const hostOk = (host) => allowed.has(String(host).toLowerCase());
  if (!hostOk(target.hostname)) {
    return json({ error: `Kalenderverten «${target.hostname}» er ikke godkjent. Legg den i miljøvariabelen ICS_HOSTS (kommaseparert) i hostingoppsettet.`, code: 'calendarHostNotAllowed', host: target.hostname }, 403);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  let upstream;
  try {
    upstream = await fetch(target, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { accept: 'text/calendar, text/plain;q=0.9' },
    });
  } catch {
    clearTimeout(timer);
    return json({ error: 'Fikk ikke kontakt med kalenderkilden', code: 'calendarUnreachable' }, 502);
  }
  clearTimeout(timer);

  // Omdirigeringer kan ha flyttet oss til en annen vert: valider slutten av kjeden.
  try {
    if (upstream.url && !hostOk(new URL(upstream.url).hostname)) {
      return json({ error: 'Kalenderkilden pekte videre til en vert som ikke er godkjent', code: 'calendarRedirectBlocked' }, 502);
    }
  } catch { /* uleselig slutt-URL behandles som opprinnelig vert */ }

  if (!upstream.ok) return json({ error: `Kalenderkilden svarte ${upstream.status}`, code: 'calendarUpstreamStatus', status: upstream.status }, 502);

  const text = await upstream.text();
  if (text.length > MAX_BYTES) return json({ error: 'Kalenderfilen er for stor', code: 'calendarTooLarge' }, 502);
  if (!/BEGIN:VCALENDAR/i.test(text.slice(0, 4000))) {
    return json({ error: 'Svaret fra kilden er ikke en iCal-fil', code: 'calendarNotIcs' }, 502);
  }

  return new Response(text, {
    status: 200,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      // Delt cache i 5 min: besøkende hamrer aldri feed-verten.
      'cache-control': 'public, max-age=60, s-maxage=300',
    },
  });
}
