/**
 * Core block: quote/testimonial, a <figure> with its <blockquote> and attribution, in a `large` or a `short` variant, its texts edited in place.
 * Notes: docs/engine-notes/blocks/quote.md (Urd repository).
 */
// Called only in preview (after the admin dictionary has loaded): never at module level.
import { ta } from '../i18n.js';
import { accentCss } from './timeline.js';
import { drawPicture } from '../picture.js';

export const quoteBlock = {
  version: 2,
  autoGrow: true,
  label: 'Quote',
  labelKey: 'blocks.quote',
  // Seed rule (ADR-0012): ta() is called only here, on insertion in preview.
  defaults: () => ({
    text: ta('seed.quoteBlock.text'),
    attribution: ta('seed.quoteBlock.name'),
    role: ta('seed.quoteBlock.role'),
    variant: 'large',
    image: '',
    accent: null,
  }),
  migrations: {
    // 1 -> 2 (ADR-0021): Norwegian variant values renamed to English.
    1: (props) => ({
      ...props,
      variant: props.variant === 'kort' ? 'short' : props.variant === 'stor' ? 'large' : props.variant,
    }),
  },
  /**
   * @param {HTMLElement} el
   * @param {{text: string, attribution: string, role: string, variant?: string, image?: string, imageStyle?: object, accent?: string|null,
   *          card?: boolean}} props
   *   imageStyle: the portrait's settings from the image editor (picture.js pictureStyle), additive
   * @param {object} ctx Render context
   */
  render(el, props, ctx) {
    const kort = props.variant === 'short';
    const host = document.createElement('figure');
    host.className = `urd-quote urd-quote-${kort ? 'short' : 'large'}`;
    // The large spread can stand in a card; the short one already is one.
    if (!kort && props.card === true) host.classList.add('urd-quote-card');
    // The accent (glyph and portrait ring) only as a validated hex value or theme token.
    const accent = accentCss(props.accent);
    if (accent) host.style.setProperty('--urd-quote-accent', accent);
    el.appendChild(host);
    const post = (msg) => window.parent?.postMessage(msg, location.origin);
    const editable = Boolean(ctx.preview) && ctx.viewport !== 'mobile';

    // The portrait in its round frame, with the image editor's settings (imageStyle, additive) drawn by picture.js.
    if (kort && props.image) {
      const frame = document.createElement('span');
      frame.className = 'urd-quote-portrait';
      const img = document.createElement('img');
      img.alt = props.attribution ?? '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.src = props.image;
      frame.appendChild(img);
      drawPicture(frame, img, props.imageStyle);
      host.appendChild(frame);
      if (editable) {
        frame.title = ta('canvas.editImage');
        frame.addEventListener('dblclick', (event) => {
          event.preventDefault();
          post({ type: 'urd-picture-edit', kind: 'portrait', sectionId: ctx.section.id, blockId: el.dataset.blockId, frameRatio: 1, frameWidth: frame.offsetWidth, frameHeight: frame.offsetHeight });
        });
      }
    }

    const body = document.createElement('div');
    body.className = 'urd-quote-body';
    const quote = document.createElement('blockquote');
    quote.className = 'urd-quote-text';
    quote.textContent = props.text ?? '';
    const caption = document.createElement('figcaption');
    caption.className = 'urd-quote-caption';
    const name = document.createElement('span');
    name.className = 'urd-quote-name';
    name.textContent = props.attribution ?? '';
    const role = document.createElement('span');
    role.className = 'urd-quote-role';
    role.textContent = props.role ?? '';
    caption.append(name, role);
    body.append(quote, caption);
    host.appendChild(body);

    if (ctx.preview) {
      // Click and type: all three fields are plain text, the phone's own in the phone view (ADR-0033); each change hands back all three as they stand.
      const fields = [[quote, 'text'], [name, 'attribution'], [role, 'role']];
      for (const [node] of fields) {
        try {
          node.contentEditable = 'plaintext-only';
        } catch {
          node.contentEditable = 'true';
        }
        node.addEventListener('input', () => {
          post({
            type: 'urd-edit',
            sectionId: ctx.section.id,
            blockId: el.dataset.blockId,
            props: { ...props, ...Object.fromEntries(fields.map(([field, key]) => [key, field.textContent ?? ''])) },
            ...(ctx.viewport === 'mobile' ? { phone: true } : {}),
          });
        });
      }
    }
  },
};
