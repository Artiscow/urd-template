/**
 * Core block: image. Shows a file from media/ (or a data URL for uploads
 * that are still unpublished in the draft). With href the image becomes a
 * link, which also covers logo use.
 *
 * The image sits in a frame (.urd-image-frame) that clips: rounding is
 * therefore ALWAYS visible (also with "show the whole image"/contain), and
 * zoom crops in towards the focal point. The picture's settings are drawn by
 * picture.js, the same drawing every picture on the site uses.
 */

import { resolveLink, linkAttrs } from '../nav-model.js';
import { ta, t } from '../i18n.js';
import { drawPicture } from '../picture.js';
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
    // Additive fields: focal point (0..1), zoom (1 = none) and non-destructive
    // CSS adjustments (1 = neutral). lightbox opens the image full screen when a
    // visitor clicks it (absent = false, so old data needs no migration).
    x: 0.5, y: 0.5, zoom: 1, brightness: 1, contrast: 1, saturate: 1,
    lightbox: false,
  }),
  migrations: {},
  // On the phone an image with a shape is that shape at the row's width; one without keeps its frame's height.
  autoGrow: (props) => IMAGE_ASPECTS.includes(props.aspect) && Boolean(props.src),
  /**
   * @param {HTMLElement} el
   * @param {{src: string, alt: string, fit: 'cover'|'contain', radius: string|null, href: string|null, aspect?: string}} props
   *   aspect: one of IMAGE_ASPECTS (push-model.js) from the image editor, the frame's shape with its height following its width
   * @param {object} ctx
   */
  render(el, props, ctx) {
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
    // Content images are fetched only as they approach the viewport: that spares
    // images below the fold on heavy pages. loading/decoding are set BEFORE src,
    // or the browser may already have begun fetching. (Collection/gallery/video do the same.)
    img.loading = 'lazy';
    img.decoding = 'async';
    img.src = props.src;
    img.draggable = false;
    // Large images decode strip by strip while they load (which looks like a
    // gradual wipe from the top): keep the image invisible until it is
    // COMPLETE, then show it whole at once. Cached images are untouched.
    if (!img.complete) {
      img.style.visibility = 'hidden';
      img.addEventListener('load', () => { img.style.visibility = ''; }, { once: true });
      img.addEventListener('error', () => { img.style.visibility = ''; }, { once: true });
    }
    frame.appendChild(img);
    // A shape from the image editor: the frame is that shape at the block's width (keepsShape in push-model.js), or the picture's own shape, which the picture gives it.
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

    // Full screen on click: always for visitors when the field is on; in preview
    // only in clean view (otherwise editing owns the click). A link wins.
    // For visitors the frame is a button for the keyboard too, named by the picture's alt text: reached with Tab, opened with Enter or Space.
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
