/**
 * Bakgrunnslag: ensfarget. Verdien kan være en theme-token ('surface')
 * eller en rå farge ('#151a23').
 */
import { resolveColor } from '../theme.js';

export const colorLayer = {
  version: 1,
  label: 'Farge',
  labelKey: 'bgLayer.color',
  defaults: () => ({ value: 'bg', opacity: 1 }),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {{value: string, opacity?: number}} props opacity er additiv (eldre data mangler den)
   */
  render(el, props) {
    el.style.background = resolveColor(props.value);
    el.style.opacity = String(props.opacity ?? 1);
  },
};
