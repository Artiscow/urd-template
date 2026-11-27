/**
 * The publishing guard's SVG check: why an SVG may not be written to media/, or null where it may; the same text as svgProblem in the engine's imageTools.js.
 * @param {string} text
 * @returns {null|'notSvg'|'declaration'|'element'|'handler'|'animation'|'scriptAddress'|'dataAddress'}
 */
export function svgProblem(text) {
  const BANNED = ['script', 'foreignobject', 'iframe', 'embed', 'object', 'handler', 'listener'];
  const LINKS = ['href', 'src', 'from', 'to', 'values', 'by'];
  const RASTER = /^data:image\/(?:png|jpe?g|gif|webp|avif)[;,]/;
  const SCRIPT = /(?:javascript|vbscript|livescript):/;
  const TAG = /<([^\s/<>!?]+)((?:\s(?:[^<>"']|"[^"<]*"|'[^'<]*')*)?)\/?>/y;
  const ATTR = /([^\s=/"'<>]+)\s*(?:=\s*(?:"([^"<]*)"|'([^'<]*)'|([^\s"'<>]+)))?/g;
  const ENTITY = /\s*<!ENTITY\s+([A-Za-z_][\w.-]*)\s+(?:"([^"<&%]*)"|'([^'<&%]*)')\s*>/y;
  const SUBSET_END = /\s*\]\s*>/y;
  const named = { lt: '<', gt: '>', quot: '"', apos: "'", amp: '&' };
  let unknown = false;
  const decode = (value) => value.replace(/&(?:#x([0-9a-f]+);?|#(\d+);?|([A-Za-z_][\w.-]*);)/gi, (m, hex, dec, name) => {
    if (name) {
      if (!Object.hasOwn(named, name)) unknown = true;
      return named[name] ?? '';
    }
    return String.fromCodePoint(Math.min(hex ? parseInt(hex, 16) : Number(dec), 0x10ffff));
  });
  const plain = (value) => decode(value).replace(/[\u0000-\u0020\u007f]/g, '').toLowerCase();
  const raw = String(text ?? '');
  if (!/<svg[\s>]/i.test(raw)) return 'notSvg';
  const texts = [];
  let last = 0;
  let i = 0;
  while ((i = raw.indexOf('<', i)) !== -1) {
    const take = (end) => { texts.push(raw.slice(last, i)); last = end; i = end; };
    if (raw.startsWith('<!--', i)) {
      const end = raw.indexOf('-->', i + 4);
      if (end < 0) return 'declaration';
      take(end + 3);
      continue;
    }
    if (raw.startsWith('<![CDATA[', i)) {
      const end = raw.indexOf(']]>', i + 9);
      if (end < 0) return 'declaration';
      texts.push(raw.slice(i + 9, end));
      take(end + 3);
      continue;
    }
    if (raw.startsWith('<?', i)) {
      const end = raw.indexOf('?>', i + 2);
      if (end < 0 || /^xml-stylesheet\b/i.test(raw.slice(i + 2, end))) return 'declaration';
      take(end + 2);
      continue;
    }
    if (raw.startsWith('<!', i)) {
      if (!/^<!DOCTYPE\s/i.test(raw.slice(i, i + 10))) return 'declaration';
      let j = i + 9;
      let quote = '';
      for (; j < raw.length; j += 1) {
        const c = raw[j];
        if (quote) { if (c === quote) quote = ''; } else if (c === '"' || c === "'") quote = c;
        else if (c === '[' || c === '>') break;
      }
      if (j >= raw.length) return 'declaration';
      if (raw[j] === '[') {
        let at = j + 1;
        for (;;) {
          ENTITY.lastIndex = at;
          const entity = ENTITY.exec(raw);
          if (!entity) break;
          const value = entity[2] ?? entity[3];
          if (SCRIPT.test(plain(value))) return 'scriptAddress';
          named[entity[1]] = value;
          at = ENTITY.lastIndex;
        }
        SUBSET_END.lastIndex = at;
        if (!SUBSET_END.exec(raw)) return 'declaration';
        j = SUBSET_END.lastIndex - 1;
      }
      take(j + 1);
      continue;
    }
    if (raw[i + 1] === '/') {
      const end = raw.indexOf('>', i);
      take(end < 0 ? raw.length : end + 1);
      continue;
    }
    TAG.lastIndex = i;
    const tag = TAG.exec(raw);
    if (!tag) {
      i += 1;
      continue;
    }
    if (BANNED.includes(tag[1].split(':').pop().toLowerCase())) return 'element';
    for (const attr of tag[2].matchAll(ATTR)) {
      const name = attr[1].split(':').pop().toLowerCase();
      const value = plain(attr[2] ?? attr[3] ?? attr[4] ?? '');
      if (name.startsWith('on')) return 'handler';
      if (name === 'attributename' && value.includes('href')) return 'animation';
      if (SCRIPT.test(value)) return 'scriptAddress';
      if (LINKS.includes(name) && value.startsWith('data:') && !RASTER.test(value)) return 'dataAddress';
    }
    take(TAG.lastIndex);
  }
  texts.push(raw.slice(last));
  if (SCRIPT.test(plain(texts.join(' ')))) return 'scriptAddress';
  return unknown ? 'declaration' : null;
}
