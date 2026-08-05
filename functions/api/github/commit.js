/**
 * POST /api/github/commit
 * Kjernen i publiseringen. Body: { message, files: [{path, content, encoding?}] }.
 * Committer alle filene som ÉN commit via Git Data API.
 *
 * Vern (forsvar i dybden, se ADR-0003):
 *  - krever innlogget token OG at brukeren står i ALLOWED_LOGINS
 *  - hver filsti valideres mot sti-allowlisten (kun innhold, aldri kode)
 *  - maks 200 filer per commit
 */
import { commitFiles, triggerDeploy } from '../../_lib/github.js';
import { requirePublisher } from '../../_lib/auth.js';
import { isAllowedPath } from '../../_lib/guard.js';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

export async function onRequestPost({ request, env }) {
  const auth = await requirePublisher(request, env);
  if (auth.response) return auth.response;
  const { config, token } = auth;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Ugyldig JSON i forespørselen', code: 'badJson' }, 400);
  }
  const { message, files, expect } = body ?? {};
  if (typeof message !== 'string' || !message.trim()) {
    return json({ error: 'Commit-melding mangler', code: 'missingMessage' }, 400);
  }
  if (expect !== undefined && typeof expect !== 'string') {
    return json({ error: 'expect må være en commit-sha', code: 'badExpect' }, 400);
  }
  if (!Array.isArray(files) || files.length === 0 || files.length > 200) {
    return json({ error: 'files må være en liste med 1 til 200 filer', code: 'badFiles' }, 400);
  }
  for (const file of files) {
    // Sletting (delete: true) trenger ikke content; vanlige filer må ha det.
    if (typeof file?.path !== 'string' || (file.delete !== true && typeof file?.content !== 'string')) {
      return json({ error: 'Hver fil trenger path og content (eller delete: true)', code: 'badFileEntry' }, 400);
    }
    if (!isAllowedPath(file.path)) {
      return json({ error: `Stien '${file.path}' kan ikke publiseres herfra`, code: 'pathNotAllowed', path: file.path }, 400);
    }
  }

  // Stiene fra editoren er relative til NETTSIDEN. Ligger nettsiden i en
  // undermappe av repoet (GITHUB_ROOT_DIR, f.eks. "template"), prefikses
  // stiene her - ETTER valideringen over, som gjelder nettside-stiene.
  const repoFiles = config.rootDir
    ? files.map((f) => ({ ...f, path: `${config.rootDir}/${f.path}` }))
    : files;

  try {
    // expect (valgfri): HEAD-en editorens konfliktsjekk så. Har den
    // flyttet seg i mellomtiden, avvises commiten med 409 i stedet for
    // å overskrive noen andres ferske publisering.
    const { sha } = await commitFiles(token, config, { message, files: repoFiles, expect });
    await triggerDeploy(env);
    return json({ sha });
  } catch (err) {
    // 409 fra expect-sjekken, eller 422 non-fast-forward fra ref-
    // oppdateringen (noen rakk å publisere i selve commit-vinduet).
    if (err.status === 409 || (err.status === 422 && /fast.?forward/i.test(err.message))) {
      return json({ error: 'Noen publiserte akkurat nå - prøv å publisere på nytt', code: 'publishRace' }, 409);
    }
    console.error('Urd publish:', err.message);
    // GitHubs faktiske svar vises til den innloggede redaktøren - uten
    // det er feilsøking umulig. Tokenet inngår aldri i meldingen.
    return json({ error: `Kunne ikke committe til GitHub: ${err.message}`, code: 'commitFailed', detail: err.message }, 502);
  }
}
