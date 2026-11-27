/**
 * Every answer of the site's functions gets nosniff, and one that is not a web page gets a policy that runs nothing.
 * An answer with a policy of its own keeps it.
 */
export async function onRequest({ next }) {
  const res = await next();
  const out = new Response(res.body, res);
  out.headers.set('x-content-type-options', 'nosniff');
  if (!out.headers.has('content-security-policy') && !/^text\/html/i.test(out.headers.get('content-type') ?? '')) {
    out.headers.set('content-security-policy', "default-src 'none'; frame-ancestors 'none'; sandbox");
  }
  return out;
}
