/**
 * The layout model: new frames for a section's movable blocks, their content untouched.
 * x and w in percent of the section width, y and h in px.
 */

const r2 = (v) => Math.round(v * 100) / 100;

/** The types the split layouts read as text; every other movable type is media. */
const TEXT_TYPES = new Set(['text', 'terms', 'button', 'faq', 'timeline', 'quote', 'stats', 'table']);

/** The blocks a layout may move: never decor, never shapes or spaces, never a block shown on phones only. */
export function movableBlocks(blocks) {
  return (Array.isArray(blocks) ? blocks : []).filter((b) => !b.decor && !b.hideDesktop && b.type !== 'shape' && b.type !== 'spacer' && b.frames?.desktop);
}

/** Reading order: topmost first, then leftmost; stable on id when equal. */
export function readingOrder(blocks) {
  return [...blocks].sort((a, b) => {
    const fa = a.frames.desktop;
    const fb = b.frames.desktop;
    return (fa.y - fb.y) || (fa.x - fb.x) || String(a.id).localeCompare(String(b.id));
  });
}

export const LAYOUT_IDS = ['stack-center', 'stack-left', 'split-media-right', 'split-media-left', 'two-columns', 'hero-top'];

/**
 * The layouts that fit the section: none under two movable blocks, and the split and hero layouts only with both text and media.
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

/** Stack a list of blocks downwards in a column; mutates the result list. */
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
 * The frames of a layout, setting x, y and w alone; null for an id that is unknown or does not fit (applicableLayouts).
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
    // The next block goes in the shortest column, so the columns balance out.
    const cols = [{ x: 8, y: pad }, { x: 52, y: pad }];
    for (const block of ordered) {
      const f = block.frames.desktop;
      const col = cols[0].y <= cols[1].y ? cols[0] : cols[1];
      frames.push({ blockId: block.id, frame: { ...f, x: r2(col.x), y: Math.round(col.y), w: 40 } });
      col.y += f.h + gap;
    }
    bottom = Math.max(cols[0].y, cols[1].y) - gap;
  } else if (id === 'hero-top') {
    // The largest media on top in full width, the rest centered below.
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

  // The same height rule as the «fit height» button in the section toolbar.
  const minHeight = `${Math.max(gap * 3, Math.round(bottom) + gap)}px`;
  return { frames, minHeight };
}
