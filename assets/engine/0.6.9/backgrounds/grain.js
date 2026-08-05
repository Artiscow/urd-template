/**
 * Bakgrunnslag: korn. Subtil støytekstur over de andre lagene, laget med
 * en liten inline-SVG (feTurbulence) - ingen bildefiler nødvendig.
 */
const NOISE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"/></filter><rect width="128" height="128" filter="url(%23n)"/></svg>`;
const NOISE_URI = `url("data:image/svg+xml,${encodeURIComponent(NOISE_SVG).replaceAll('%2523', '%23')}")`;

export const grainLayer = {
  version: 1,
  label: 'Korn',
  labelKey: 'bgLayer.grain',
  defaults: () => ({ opacity: 0.06 }),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {{opacity: number}} props
   */
  render(el, props) {
    el.style.backgroundImage = NOISE_URI;
    el.style.backgroundRepeat = 'repeat';
    // Uten fallback ville et gammelt lag uten opacity-felt gitt full styrke (kraftig støyflate).
    el.style.opacity = String(props.opacity ?? 0.06);
  },
};
