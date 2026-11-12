/**
 * Snapping on the desktop canvas (0.7.10, the grid and guides rework): the pure rules behind the smart guides.
 * A dragged box snaps to the edges and centres of its neighbours, to the content surface's quarters and midlines, and to the gaps its neighbours keep between them (equal-gap snapping, the tldraw rule), within a tolerance that follows the preview's zoom, so a snap feels the same at every zoom level (the Excalidraw rule: eight screen px).
 * preview-edit.js measures the DOM and draws the lines; nothing here touches it.
 * The grid is counted out from the middle of the content (0.7.34): a line on its centre and the cells counted out to both sides, so a block lined up with the grid can stand centred, and the part cell left over is split equally between the two edges.
 */

/** How the grid is drawn, per browser (`urd-grid-look`): a quiet grid of lines, the default; dots where the lines would cross; or only in a drag, with the content's quarters as columns at rest. */
export const GRID_LOOKS = ['lines', 'dots', 'drag'];

/**
 * The grid's look a stored value reads as: a known one, else the default.
 * @param {string|null|undefined} raw
 * @returns {'lines'|'dots'|'drag'}
 */
export function gridLookOf(raw) {
  return GRID_LOOKS.includes(raw) ? raw : 'lines';
}

/**
 * The grid line nearest a position, the lines counted out from the middle of the content.
 * @param {number} at The position, in percent of the content's width
 * @param {number} step The cell's width, in the same percent
 * @param {number} [middle] The content's centre
 * @returns {number}
 */
export function gridLine(at, step, middle = 50) {
  return middle + Math.round((at - middle) / step) * step;
}

/** The snap distance on screen, in px, whatever the preview's zoom. */
export const SNAP_SCREEN_PX = 8;

/**
 * The snap distance in the page's own px: the screen distance divided by the
 * preview's zoom, which the chrome scale carries (1 / zoom).
 * @param {number|string} chromeScale The page's --urd-chrome-scale
 * @returns {number}
 */
export function snapTolerance(chromeScale) {
  const s = Number.parseFloat(chromeScale);
  return SNAP_SCREEN_PX * (Number.isFinite(s) && s > 0 ? s : 1);
}

/**
 * The nearest line a box's start, middle or end can snap to on one axis.
 * Among the content surface's own lines (`surface`), one marked `prefer`
 * (the midline) wins over the others whenever it is within reach, so a box
 * can be centred even where an edge of it lies a little nearer a quarter
 * line; against a neighbour's edge or centre the nearest line wins, so
 * aligning with another block stays in reach.
 * @param {number} start The box's start on the axis, in px
 * @param {number} size The box's size on the axis, in px
 * @param {Array<{at: number, from: number, to: number, surface?: boolean, prefer?: boolean}>} targets The lines, each with the span it comes from on the other axis
 * @param {number} tol The snap distance
 * @returns {{d: number, target: {at: number, from: number, to: number}, edge: 'start'|'middle'|'end'}|null} The move that lands the box on the line
 */
export function edgeSnap(start, size, targets, tol) {
  let best = null;
  for (const target of targets) {
    for (const [edge, offset] of [['start', 0], ['middle', size / 2], ['end', size]]) {
      const d = target.at - (start + offset);
      if (Math.abs(d) > tol) continue;
      const ranked = target.surface && best?.target.surface && Boolean(target.prefer) !== Boolean(best.target.prefer);
      const wins = !best || (ranked ? Boolean(target.prefer) : Math.abs(d) < Math.abs(best.d));
      if (wins) best = { d, target, edge };
    }
  }
  return best;
}

/**
 * Every line a box's start, middle or end stands on, within a hair: a box
 * placed by one snap can stand on more lines than that one (a block half the
 * width snapped to the midline also stands on the quarters), and all of them
 * are drawn. A place met by several lines comes back once, with their spans
 * joined.
 * @param {number} start The box's start on the axis, in px
 * @param {number} size The box's size on the axis, in px
 * @param {Array<{at: number, from: number, to: number}>} targets The lines
 * @param {number} [eps] How near counts as on the line, in px
 * @returns {Array<{at: number, from: number, to: number, share?: number}>} A line of the content keeps its `share` (0.25, 0.5, 0.75)
 */
export function alignedLines(start, size, targets, eps = 1) {
  const byAt = new Map();
  for (const target of targets) {
    if (![0, size / 2, size].some((offset) => Math.abs(target.at - (start + offset)) <= eps)) continue;
    const key = Math.round(target.at);
    const seen = byAt.get(key);
    const line = seen
      ? { at: seen.at, from: Math.min(seen.from, target.from), to: Math.max(seen.to, target.to) }
      : { at: target.at, from: target.from, to: target.to };
    // A line of the content itself carries its share of the content, for the label it is drawn with.
    const share = seen?.share ?? target.share;
    if (share !== undefined) line.share = share;
    byAt.set(key, line);
  }
  return [...byAt.values()];
}

/**
 * Equal-gap snapping on one axis: the box keeps the same distance to a
 * neighbour as that neighbour keeps to the next one, or stands between two
 * neighbours with the same air on both sides. Only the neighbours that
 * overlap the box on the other axis count, so a block in another row never
 * pulls.
 * @param {number} start The box's start on the axis, in px
 * @param {number} size The box's size on the axis, in px
 * @param {Array<{start: number, end: number}>} neighbours The neighbours' spans on the axis
 * @param {number} tol The snap distance
 * @returns {{d: number, gaps: Array<{from: number, to: number}>}|null} The move, and the gaps that become equal, for the bands
 */
export function gapSnap(start, size, neighbours, tol) {
  const boxes = neighbours.filter((b) => b.end > b.start).sort((a, b) => a.start - b.start);
  let best = null;
  const consider = (at, gaps) => {
    const d = at - start;
    if (Math.abs(d) <= tol && (!best || Math.abs(d) < Math.abs(best.d))) best = { d, gaps };
  };
  for (let i = 0; i + 1 < boxes.length; i += 1) {
    const a = boxes[i];
    const b = boxes[i + 1];
    const gap = b.start - a.end;
    if (gap > 0) {
      // Beyond the pair, at the pair's own gap.
      consider(b.end + gap, [{ from: a.end, to: b.start }, { from: b.end, to: b.end + gap }]);
      consider(a.start - gap - size, [{ from: a.start - gap, to: a.start }, { from: a.end, to: b.start }]);
    }
    // Between the pair, with the same air on both sides.
    if (gap > size) {
      const air = (gap - size) / 2;
      consider(a.end + air, [{ from: a.end, to: a.end + air }, { from: b.start - air, to: b.start }]);
    }
  }
  return best;
}

/**
 * A move held to one axis (Shift): the smaller of the two deltas is dropped.
 * @param {number} dx
 * @param {number} dy
 * @returns {{dx: number, dy: number}}
 */
export function lockAxis(dx, dy) {
  return Math.abs(dx) >= Math.abs(dy) ? { dx, dy: 0 } : { dx: 0, dy };
}
