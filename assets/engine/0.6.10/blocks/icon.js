/**
 * Kjerneblokk: ikon. En glyf/emoji i valgfri størrelse og temafarge -
 * til punktlister, kontaktrader og små dekorelementer. Emoji har egne
 * farger; temafargen gjelder tekst-glyfer (★ ✓ → osv.).
 */
import { resolveColor } from '../theme.js';
import { iconSvg } from '../icons.js';

export const iconBlock = {
  version: 1,
  label: 'Ikon',
  labelKey: 'blocks.icon',
  defaults: () => ({ glyph: '★', color: 'accent', size: 48 }),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {{glyph: string, color: string, size: number, image?: string|null, icon?: string|null}} props
   */
  render(el, props) {
    // Eget opplastet ikon (additivt felt): bildet vises i tegnstørrelsen og vinner over glyfen til det fjernes.
    if (typeof props.image === 'string' && props.image) {
      const img = document.createElement('img');
      img.src = props.image;
      img.alt = '';
      img.draggable = false;
      img.style.cssText = `height:${props.size || 48}px;width:auto;display:block;`;
      // Samme lastevern som bildeblokken (ingen stripevis inntoning), og glyfen tar over om bildet feiler.
      if (!img.complete) {
        img.style.visibility = 'hidden';
        img.addEventListener('load', () => { img.style.visibility = ''; }, { once: true });
      }
      img.addEventListener('error', () => {
        img.remove();
        el.replaceChildren();
        iconBlock.render(el, { ...props, image: null });
      }, { once: true });
      el.appendChild(img);
      return;
    }
    // Tegnet SVG-ikon fra biblioteket (additivt felt): skarpt i alle
    // størrelser og følger temafargen. Ukjent id (data fra nyere Urd)
    // faller stille tilbake til glyfen. Ytterelementet beholder
    // .urd-icon-sentreringen i rammen; det indre elementet bærer størrelsen.
    if (typeof props.icon === 'string' && props.icon) {
      const svg = iconSvg(props.icon);
      if (svg) {
        const span = document.createElement('span');
        span.className = 'urd-icon';
        span.style.color = resolveColor(props.color);
        const inner = document.createElement('span');
        inner.innerHTML = svg;
        const size = props.size || 48;
        inner.style.cssText = `display:block;width:${size}px;height:${size}px;`;
        span.appendChild(inner);
        el.appendChild(span);
        return;
      }
    }
    const span = document.createElement('span');
    span.className = 'urd-icon';
    span.textContent = props.glyph || '★';
    span.style.fontSize = `${props.size || 48}px`;
    span.style.color = resolveColor(props.color);
    el.appendChild(span);
  },
};
