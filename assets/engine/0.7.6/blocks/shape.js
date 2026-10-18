/**
 * Core block: shape. Lines and arrows (direction via the frame's rot field),
 * circles/ellipses, rectangles and triangles. Decorative elements for free
 * composition. A line can carry a `label`: a word set in the middle of it,
 * the chapter divider.
 */
import { resolveColor } from '../theme.js';

export const shapeBlock = {
  version: 1,
  label: 'Shape',
  labelKey: 'blocks.shape',
  defaults: () => ({ kind: 'line', color: 'accent', thickness: 2, fill: null }),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {{kind: 'line'|'arrow'|'circle'|'rect'|'triangle', color: string, thickness: number, fill: string|null,
   *          label?: string}} props
   * @param {object} ctx
   */
  render(el, props, ctx) {
    const color = resolveColor(props.color);

    // The chapter divider: the line drawn on both sides of a word. The two
    // strokes are the element's ::before and ::after (base.css), so the word
    // sits in the flow between them and the line keeps its thickness.
    const label = props.kind === 'line' && typeof props.label === 'string' ? props.label.trim() : '';
    if (label) {
      const row = document.createElement('div');
      row.className = 'urd-shape-chapter';
      row.style.color = color;
      row.style.setProperty('--urd-shape-t', `${props.thickness}px`);
      const word = document.createElement('span');
      word.className = 'urd-shape-chapter-label';
      word.textContent = label;
      row.appendChild(word);
      el.appendChild(row);
      return;
    }

    if (props.kind === 'line' || props.kind === 'arrow') {
      // A horizontal line centred in the frame; direction comes from rot.
      const line = document.createElement('div');
      line.style.cssText = `position:absolute;left:0;right:${props.kind === 'arrow' ? '10px' : '0'};top:50%;transform:translateY(-50%);height:${props.thickness}px;background:${color};`;
      el.appendChild(line);
      if (props.kind === 'arrow') {
        const head = document.createElement('div');
        const size = Math.max(6, props.thickness * 4);
        head.style.cssText = `position:absolute;right:0;top:50%;transform:translateY(-50%);width:0;height:0;border-top:${size}px solid transparent;border-bottom:${size}px solid transparent;border-left:${size * 1.4}px solid ${color};`;
        el.appendChild(head);
      }
      return;
    }

    if (props.kind === 'triangle') {
      // A triangle is drawn as a filled surface (clip-path cannot take a stroke).
      const tri = document.createElement('div');
      tri.style.cssText = `position:absolute;inset:0;background:${resolveColor(props.fill ?? props.color)};clip-path:polygon(50% 0, 100% 100%, 0 100%);`;
      el.appendChild(tri);
      return;
    }

    // circle / rect: a circle becomes an ellipse in non-square frames.
    if (props.fill) {
      el.style.background = resolveColor(props.fill);
    } else {
      el.style.border = `${props.thickness}px solid ${color}`;
    }
    if (props.kind === 'circle') el.style.borderRadius = '50%';
  },
};
