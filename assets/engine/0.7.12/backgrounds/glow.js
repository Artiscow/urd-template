/**
 * Background layer: glow.
 * A radial light spot placed relatively within the section (x/y in 0..1), for depth and focus.
 * Notes: docs/engine-notes/backgrounds/glow.md (Urd repository).
 */
import { resolveColor } from '../theme.js';

export const glowLayer = {
  version: 1,
  label: 'Glow',
  labelKey: 'bgLayer.glow',
  defaults: () => ({ x: 0.5, y: 0.3, color: 'accent', radius: 0.5, opacity: 0.35 }),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {{x: number, y: number, color: string, radius: number, opacity: number}} props
   */
  render(el, props) {
    const color = resolveColor(props.color);
    // A layer missing its fields takes the default values, so position and radius are never NaN% and the gradient is drawn.
    const x = props.x ?? 0.5;
    const y = props.y ?? 0.3;
    const radius = props.radius ?? 0.5;
    el.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, ${color} 0%, transparent ${radius * 100}%)`;
    el.style.opacity = String(props.opacity ?? 0.35);
  },
};
