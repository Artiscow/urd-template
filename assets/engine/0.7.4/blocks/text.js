/**
 * Core block: text. Rich text (HTML written by the site owner through the editor)
 * with alignment. The content is the owner's own and is treated as trusted; it is
 * the same trust model as the owner being able to edit the files in the repo
 * directly.
 */
import { stripActiveContent } from '../sanitize.js';
import { boxStyleCss } from '../box-style.js';

// The seed rule (ADR-0012): ta() is called only in defaults(), on insertion in preview, never at module level.
import { ta } from '../i18n.js';
import { pushLayout } from '../push-model.js';

export const textBlock = {
  version: 1,
  label: 'Text',
  labelKey: 'blocks.text',
  defaults: () => ({ html: ta('seed.text'), align: 'left', box: false }),
  migrations: {},
  /**
   * @param {HTMLElement} el The block element (positioned by render.js)
   * @param {{html: string, align: string, box?: boolean, boxStyle?: object, font?: string, size?: number, lineHeight?: number, letterSpacing?: number}} props
   * @param {object} ctx Render context
   */
  render(el, props, ctx) {
    // The text lives in its own inner element: the editing handles that
    // preview-edit puts on the block must NEVER end up inside the editable
    // content (or in the stored props.html).
    const content = document.createElement('div');
    // The text box variant: the same block, but the content sits in a card
    // (the theme's surface color, border, radius). Optional field; older data
    // lacks it and renders without the card.
    content.className = props.box ? 'urd-text urd-text-box' : 'urd-text';
    content.style.cssText = 'width:100%;min-height:100%;';
    // Optional card style (additive; empty = the base style in .urd-text-box).
    if (props.box) Object.assign(content.style, boxStyleCss(props.boxStyle));
    content.style.textAlign = props.align;
    // Optional font and size per text block (additive; empty = inherited from the theme).
    if (props.font) content.style.fontFamily = props.font;
    if (props.size) content.style.fontSize = `${props.size}px`;
    // Optional line and letter spacing per field (additive; empty = inherited).
    // The line height is unitless (it scales with the font size); the letter
    // spacing is px and can be negative (tighter than normal).
    if (props.lineHeight) content.style.lineHeight = String(props.lineHeight);
    if (typeof props.letterSpacing === 'number' && props.letterSpacing !== 0) {
      content.style.letterSpacing = `${props.letterSpacing}px`;
    }
    content.innerHTML = props.html;
    // Self-healing: content stored by older Urd can contain handle markup,
    // including orphaned buttons left when browser editing splits the wrapper.
    // Text content must never contain buttons, so all of them are removed on
    // render (and stored clean on the next edit).
    content.querySelectorAll('.urd-edit-toolbar, .urd-edit-resize, .urd-edit-rotate, button').forEach((n) => n.remove());
    // Visitor protection (shared with collection entries): executable code is always stripped on render.
    stripActiveContent(content);
    el.appendChild(content);

    // Click-and-type: in preview mode (inside the editor's iframe) the text is
    // directly editable, and every change is posted to the editor, which owns
    // the draft. The block id sits on the block element (set by render.js).
    // Desktop view only: the mobile view is layout adjustment, and text growth
    // writes the desktop frame.
    if (ctx.preview && ctx.viewport !== 'mobile') {
      content.contentEditable = 'true';
      content.addEventListener('input', () => {
        const post = (msg) => window.parent?.postMessage(msg, location.origin);

        // Grow with the content: when the text becomes taller than the frame,
        // the frame (and the section when needed) is expanded so nothing is
        // clipped or overlaps. Measured on the content element, so the handles
        // never count, and converted from the content's zoom (a text set to
        // shrink) to the block's. The growth belongs to the same undo step
        // as the typing.
        const zoom = (content.currentCSSZoom ?? 1) / (el.currentCSSZoom ?? 1);
        if (content.scrollHeight * zoom > el.clientHeight) {
          const block = ctx.section.blocks.find((b) => b.id === el.dataset.blockId);
          if (block) {
            const step = ctx.grid?.size ?? 8;
            const newH = Math.ceil((content.scrollHeight * zoom) / step) * step;
            const grow = newH - block.frames.desktop.h;
            block.frames.desktop = { ...block.frames.desktop, h: newH };
            el.style.height = `${newH}px`;
            // The section is left alone: if the text grows past the edge it
            // hangs over (sections never clip, and the height is the user's).
            post({ type: 'urd-move', sectionId: ctx.section.id, blockId: block.id, frame: block.frames.desktop, coalesce: true, groupKey: block.id });
            // Typing is an edit of the design: the blocks below move in the
            // data by the push rules (ADR-0024), in the same undo step.
            const items = ctx.section.blocks
              .filter((b) => b.frames?.desktop)
              .map((b) => ({ id: b.id, x: b.frames.desktop.x, y: b.frames.desktop.y, h: b.id === block.id ? block.frames.desktop.h - grow : b.frames.desktop.h, grow: b.id === block.id ? grow : 0 }));
            for (const [id, shift] of pushLayout(items).shifts) {
              const other = ctx.section.blocks.find((b) => b.id === id);
              if (!other) continue;
              other.frames.desktop = { ...other.frames.desktop, y: other.frames.desktop.y + shift };
              const otherEl = el.parentElement?.querySelector(`:scope > .urd-block[data-block-id="${CSS.escape(id)}"]`);
              if (otherEl) otherEl.style.top = `${other.frames.desktop.y}px`;
              post({ type: 'urd-move', sectionId: ctx.section.id, blockId: id, frame: other.frames.desktop, coalesce: true, groupKey: block.id });
            }
          }
        }

        post({
          type: 'urd-edit',
          sectionId: ctx.section.id,
          blockId: el.dataset.blockId,
          props: { ...props, html: content.innerHTML },
        });
      });
    }

    // A safety net at RENDER, not only while typing (ADR-0018). The stored
    // height is in pixels while the wrapping depends on the width: if the content
    // width, the font size or the language changes, a text that fit perfectly
    // becomes too tall for its own box. The listener above catches that only
    // while someone is actually typing, so the same measurement is done here,
    // following the same pattern as the data blocks (quote, stats, faq ...).
    //
    // The growth is ONE-WAY: the frame never shrinks by itself, since an empty
    // or short text keeps the space the owner gave it. The tolerance keeps
    // rounding from causing endless small adjustments.
    requestAnimationFrame(() => {
      if (!el.isConnected || ctx.viewport === 'mobile') return;
      const needed = content.scrollHeight * ((content.currentCSSZoom ?? 1) / (el.currentCSSZoom ?? 1));
      if (needed <= el.clientHeight + 4) return;
      const step = ctx.grid?.size ?? 8;
      const newH = Math.ceil(needed / step) * step;
      // The display only: the frame keeps the design height, and the push
      // pass in render.js moves the blocks below by the measured growth
      // (ADR-0024), in the editor as on the published page.
      el.style.height = `${newH}px`;
    });
  },
};
