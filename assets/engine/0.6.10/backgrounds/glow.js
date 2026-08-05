/**
 * Bakgrunnslag: glød. Radiell lysflekk plassert relativt i seksjonen
 * (x/y i 0..1), for dybde og fokus.
 */
import { resolveColor } from '../theme.js';

export const glowLayer = {
  version: 1,
  label: 'Glød',
  labelKey: 'bgLayer.glow',
  defaults: () => ({ x: 0.5, y: 0.3, color: 'accent', radius: 0.5, opacity: 0.35 }),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {{x: number, y: number, color: string, radius: number, opacity: number}} props
   */
  render(el, props) {
    const color = resolveColor(props.color);
    el.style.background = `radial-gradient(circle at ${props.x * 100}% ${props.y * 100}%, ${color} 0%, transparent ${props.radius * 100}%)`;
    // Gamle lag kan mangle feltet (lift fyller ikke inn defaults): fall tilbake til standardverdien i stedet for "undefined" (som CSS ignorerer, altså full styrke).
    el.style.opacity = String(props.opacity ?? 0.35);
  },
};
