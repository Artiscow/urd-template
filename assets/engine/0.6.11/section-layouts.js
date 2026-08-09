/**
 * Oppsetts-modellen (0.6.7, «bytt oppsett»/View Layouts): rene funksjoner
 * som beregner NYE rammer for en seksjons blokker uten å røre innholdet.
 * Resultatet er kun frames + minHeight: seksjonen forblir fullt redigerbar
 * etterpå (aldri en blindvei-generator). Dekor-blokker og former røres
 * ALDRI; de beholder rammene sine. Ingen DOM - node-testbart.
 *
 * Enheter som ellers i Urd: x/w i prosent av seksjonsbredden, y/h i px.
 */

const r2 = (v) => Math.round(v * 100) / 100;

/** Tekstlige typer leses som tekstkolonnen i splitt-oppsettene; alt annet
 *  bevegelig (bilde, video, galleri, ikon, samling, plugin-blokker) er media. */
const TEXT_TYPES = new Set(['text', 'button', 'faq', 'tidslinje', 'sitat', 'statistikk']);

/** Blokkene et oppsett får flytte: aldri dekor, aldri former. */
export function movableBlocks(blocks) {
  return (Array.isArray(blocks) ? blocks : []).filter((b) => !b.decor && b.type !== 'shape' && b.frames?.desktop);
}

/** Leseordre: øverst først, deretter venstre; stabil på id ved likhet. */
export function readingOrder(blocks) {
  return [...blocks].sort((a, b) => {
    const fa = a.frames.desktop;
    const fb = b.frames.desktop;
    return (fa.y - fb.y) || (fa.x - fb.x) || String(a.id).localeCompare(String(b.id));
  });
}

export const LAYOUT_IDS = ['stack-center', 'stack-left', 'split-media-right', 'split-media-left', 'two-columns', 'hero-top'];

/**
 * Oppsettene som gir mening for seksjonen: minst to bevegelige blokker,
 * og splitt-/hero-oppsettene krever både tekst og media.
 */
export function applicableLayouts(blocks) {
  const movable = movableBlocks(blocks);
  if (movable.length < 2) return [];
  const hasText = movable.some((b) => TEXT_TYPES.has(b.type));
  const hasMedia = movable.some((b) => !TEXT_TYPES.has(b.type));
  return LAYOUT_IDS.filter((id) => {
    if (id.startsWith('split-') || id === 'hero-top') return hasText && hasMedia;
    return true;
  });
}

/** Stable en liste blokker nedover i en kolonne; muterer resultatkartet. */
function stackColumn(ordered, frames, x, w, startY, gap) {
  let y = startY;
  for (const block of ordered) {
    const f = block.frames.desktop;
    frames.push({ blockId: block.id, frame: { ...f, x: r2(x), y: Math.round(y), w: r2(w) } });
    y += f.h + gap;
  }
  return y - gap;
}

/**
 * Beregn rammer for et oppsett. Høyder og rotasjon beholdes alltid; kun
 * x/y/w settes. Returnerer null for ukjent id eller når oppsettet ikke
 * er anvendelig (applicableLayouts).
 * @returns {{frames: Array<{blockId: string, frame: object}>, minHeight: string}|null}
 */
export function layoutFrames(id, blocks, grid) {
  if (!applicableLayouts(blocks).includes(id)) return null;
  const gap = Math.max(8, grid?.size ?? 24);
  const pad = gap;
  const ordered = readingOrder(movableBlocks(blocks));
  const frames = [];
  let bottom = 0;

  if (id === 'stack-center' || id === 'stack-left') {
    let y = pad;
    for (const block of ordered) {
      const f = block.frames.desktop;
      const w = Math.min(f.w, 70);
      const x = id === 'stack-center' ? (100 - w) / 2 : 8;
      frames.push({ blockId: block.id, frame: { ...f, x: r2(x), y: Math.round(y), w: r2(w) } });
      y += f.h + gap;
    }
    bottom = y - gap;
  } else if (id === 'split-media-right' || id === 'split-media-left') {
    const text = ordered.filter((b) => TEXT_TYPES.has(b.type));
    const media = ordered.filter((b) => !TEXT_TYPES.has(b.type));
    const textX = id === 'split-media-right' ? 8 : 54;
    const mediaX = id === 'split-media-right' ? 54 : 8;
    bottom = Math.max(
      stackColumn(text, frames, textX, 42, pad, gap),
      stackColumn(media, frames, mediaX, 38, pad, gap),
    );
  } else if (id === 'two-columns') {
    // Neste blokk i den korteste kolonnen, så kolonnene balanseres.
    const cols = [{ x: 8, y: pad }, { x: 52, y: pad }];
    for (const block of ordered) {
      const f = block.frames.desktop;
      const col = cols[0].y <= cols[1].y ? cols[0] : cols[1];
      frames.push({ blockId: block.id, frame: { ...f, x: r2(col.x), y: Math.round(col.y), w: 40 } });
      col.y += f.h + gap;
    }
    bottom = Math.max(cols[0].y, cols[1].y) - gap;
  } else if (id === 'hero-top') {
    // Største media øverst i full bredde, resten midtstilt under.
    const media = ordered.filter((b) => !TEXT_TYPES.has(b.type));
    const hero = media.reduce((a, b) => {
      const area = (f) => f.frames.desktop.w * f.frames.desktop.h;
      return area(b) > area(a) ? b : a;
    });
    const heroF = hero.frames.desktop;
    frames.push({ blockId: hero.id, frame: { ...heroF, x: 8, y: Math.round(pad), w: 84 } });
    let y = pad + heroF.h + gap;
    for (const block of ordered) {
      if (block === hero) continue;
      const f = block.frames.desktop;
      const w = Math.min(f.w, 70);
      frames.push({ blockId: block.id, frame: { ...f, x: r2((100 - w) / 2), y: Math.round(y), w: r2(w) } });
      y += f.h + gap;
    }
    bottom = y - gap;
  } else {
    return null;
  }

  // Samme høyderegel som «tilpass høyde»-knappen i seksjonsverktøylinjen.
  const minHeight = `${Math.max(gap * 3, Math.round(bottom) + gap)}px`;
  return { frames, minHeight };
}
