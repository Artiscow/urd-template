/**
 * Core block: icon. A glyph or emoji in a chosen size and theme color; an emoji keeps its own colors, a text glyph takes the theme's.
 * Notes: docs/engine-notes/blocks/icon.md (Urd repository).
 */
import { resolveColor } from '../theme.js';
import { isSafeImage } from '../nav-model.js';
import { iconSvg } from '../icons.js';

export const iconBlock = {
  version: 1,
  label: 'Icon',
  labelKey: 'blocks.icon',
  defaults: () => ({ glyph: '★', color: 'accent', size: 48 }),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {{glyph: string, color: string, size: number, image?: string|null, icon?: string|null}} props
   */
  render(el, props) {
    // An uploaded icon (additive) at the glyph's size, in its place until removed; an unsafe source counts as none, as an image that fails to load does.
    if (isSafeImage(props.image)) {
      const img = document.createElement('img');
      img.src = props.image;
      img.alt = '';
      img.draggable = false;
      img.style.cssText = `height:${props.size || 48}px;width:auto;display:block;`;
      // Same load guard as the image block (no half-painted fade-in), and the glyph takes over if the image fails.
      if (!img.complete) {
        img.style.visibility = 'hidden';
        img.addEventListener('load', () => { img.style.visibility = ''; }, { once: true });
      }
      img.addEventListener('error', () => {
        img.remove();
        // The block's own content goes; a name marker the renderer placed beside it stays (render.js placeSpot).
        for (const child of [...el.children]) if (!child.classList.contains('urd-anchor')) child.remove();
        iconBlock.render(el, { ...props, image: null });
      }, { once: true });
      el.appendChild(img);
      return;
    }
    // A drawn SVG icon (additive) in the theme color at any size; an unknown id falls back to the glyph.
    // The outer span centres it, the inner one sizes it.
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
