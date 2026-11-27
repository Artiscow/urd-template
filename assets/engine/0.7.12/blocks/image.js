/**
 * Core block: image. A file from media/ (or a draft's data URL) in a clipping frame, so its rounding always shows; with href it is a link, as a logo is.
 * Notes: docs/engine-notes/blocks/image.md (Urd repository).
 */

import { resolveLink, linkAttrs } from '../nav-model.js';
import { ta, t } from '../i18n.js';
import { drawPicture, pictureBlend, blendStrength } from '../picture.js';
import { aspectRatio, IMAGE_ASPECTS } from '../push-model.js';

/**
 * Applies a picture's settings to the frame and the image (picture.js draws them for every picture), with the description and the frame's rounding beside them.
 * @param {HTMLElement} frame The frame element (.urd-image-frame) with the <img> inside
 * @param {object} props The block's props, or a gallery picture's style with its alt text and the block's rounding
 * @param {{ratioFromPicture?: boolean}} [options] passed on to drawPicture
 */
export function applyImageStyle(frame, props, options) {
  const img = frame.querySelector('img');
  if (!img) return;
  img.alt = props.alt ?? '';
  drawPicture(frame, img, props, options);
  // Rounding on the FRAME (which clips), so it shows whatever the fit is.
  frame.style.borderRadius = props.radius ? `var(--urd-radius-${props.radius})` : '';
}

export const imageBlock = {
  version: 1,
  label: 'Image',
  labelKey: 'blocks.image',
  defaults: () => ({
    src: '', alt: '', fit: 'cover', radius: 'md', href: null,
    // Additive fields: focal point (0..1), zoom (1 = none), the adjustments (1 = neutral), and lightbox, which opens the image full screen on a click.
    x: 0.5, y: 0.5, zoom: 1, brightness: 1, contrast: 1, saturate: 1,
    lightbox: false,
  }),
  migrations: {},
  // On the phone an image with a shape is that shape at the row's width; one without keeps its frame's height.
  autoGrow: (props) => IMAGE_ASPECTS.includes(props.aspect) && Boolean(props.src),
  /**
   * @param {HTMLElement} el
   * @param {{src: string, alt: string, fit: 'cover'|'contain', radius: string|null, href: string|null, aspect?: string}} props
   *   aspect: one of IMAGE_ASPECTS (push-model.js), the frame's shape; blend: one of PICTURE_BLENDS (picture.js); blendStrength: 0..1, how strongly (absent = whole)
   * @param {object} ctx
   */
  render(el, props, ctx) {
    // The blend stands on the block itself, which is what meets the section's background and the blocks under it.
    const blend = props.src ? pictureBlend(props.blend) : '';
    const strength = blend ? blendStrength(props.blendStrength) : 1;
    el.classList.toggle('urd-image-blend', Boolean(blend));
    if (blend) el.style.setProperty('--urd-blend', blend);
    else el.style.removeProperty('--urd-blend');
    if (strength < 1) el.style.setProperty('--urd-blend-strength', String(strength));
    else el.style.removeProperty('--urd-blend-strength');
    // With no image: a quiet placeholder in the editor; visitors see nothing.
    if (!props.src) {
      if (ctx.preview) {
        const empty = document.createElement('div');
        empty.className = 'urd-image-empty';
        empty.textContent = ta('canvas.imageEmpty');
        el.appendChild(empty);
      }
      return;
    }
    const frame = document.createElement('span');
    frame.className = 'urd-image-frame';
    const img = document.createElement('img');
    // The first picture of a page's first section is fetched at once with high priority, every other lazily.
    // Loading, decoding and the priority are set before src.
    if (ctx?.first && !ctx.preview && !ctx.firstPictureTaken) {
      ctx.firstPictureTaken = true;
      img.loading = 'eager';
      img.setAttribute('fetchpriority', 'high');
    } else {
      img.loading = 'lazy';
    }
    img.decoding = 'async';
    img.src = props.src;
    img.draggable = false;
    // A large image stays hidden until it has loaded, then shows whole, instead of decoding strip by strip; a cached one is untouched.
    if (!img.complete) {
      img.style.visibility = 'hidden';
      img.addEventListener('load', () => { img.style.visibility = ''; }, { once: true });
      img.addEventListener('error', () => { img.style.visibility = ''; }, { once: true });
    }
    frame.appendChild(img);
    // A shape from the image editor: the frame is that shape at the block's width (keepsShape in push-model.js), or the picture's own.
    const ratio = aspectRatio(props.aspect);
    const own = props.aspect === 'original';
    if (ratio || own) frame.classList.add('urd-image-shaped');
    if (ratio) frame.style.aspectRatio = String(Math.round(ratio * 10000) / 10000);
    if (own) frame.classList.add('urd-image-own');
    applyImageStyle(frame, props, { ratioFromPicture: own });

    // One link (resolveLink): a page, a spot on it, or an address through the shared safe-URL gate; one that goes nowhere is treated as if it were not there.
    const resolved = props.page || props.href || props.target ? resolveLink(props, ctx.site?.pages ?? []) : null;
    const linked = resolved && !resolved.missing ? resolved : null;
    if (linked && !ctx.preview) {
      const a = document.createElement('a');
      Object.assign(a, linkAttrs(linked));
      a.appendChild(frame);
      el.appendChild(a);
    } else {
      el.appendChild(frame);
    }

    // Full screen on click when the field is on and no link wins: for visitors, as a keyboard button too, and in the preview's clean view.
    if (props.lightbox && !linked) {
      frame.classList.add('urd-lightbox-able');
      if (!ctx.preview) {
        frame.setAttribute('role', 'button');
        frame.setAttribute('aria-label', props.alt ? `${props.alt}: ${t('lightbox.open')}` : t('lightbox.open'));
        frame.tabIndex = 0;
      }
      const open = async () => {
        if (ctx.preview && !document.body.classList.contains('urd-chrome-off')) return;
        const { openLightbox } = await import('../lightbox.js');
        openLightbox([{ src: props.src, alt: props.alt, style: props }], 0);
      };
      frame.addEventListener('click', open);
      frame.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        open();
      });
    }
  },
};
