/**
 * Delt besøkende-vern for rik tekst (tekstblokker og samlingsinnslag):
 * innlimt/lagret HTML kan bære event-attributter eller aktive elementer,
 * og legitim formatering trenger aldri noen av delene.
 * Eieren er betrodd for MARKUP; kjørbar kode strippes alltid ved rendering.
 */
export function stripActiveContent(root) {
  for (const el of root.querySelectorAll('*')) {
    for (const attr of [...el.attributes]) {
      if (attr.name.toLowerCase().startsWith('on')) el.removeAttribute(attr.name);
    }
    if (/^\s*javascript:/i.test(el.getAttribute?.('href') ?? '')) el.removeAttribute('href');
  }
  root.querySelectorAll('script, iframe, object, embed').forEach((n) => n.remove());
}
