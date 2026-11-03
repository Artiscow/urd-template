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
import { typedFrames } from '../push-model.js';

/** Per text block, the section's frames before the typing in it began, and the last few frames the typing wrote. */
const typingFrom = new Map();

/** The section's desktop frames as one comparable value. */
const framesKey = (section) => JSON.stringify(section.blocks.map((b) => [b.id, b.frames?.desktop ?? null]));

const sameFrame = (a, b) => JSON.stringify(a) === JSON.stringify(b);

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
    stripActiveContent(content, ctx.site?.pages ?? []);
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

        // Grow with the content and give the room back: the frame takes the height the words need, never less than it had before the typing began, and the blocks below move by the push rules from where they stood then (ADR-0024 decision 4), posted in the typing's undo step.
        // The start holds while the section's frames are ones the typing wrote, the last few included, so a redraw a keystroke behind keeps it; any other change starts afresh.
        // The words are measured with the box at its own height, since the text fills a box taller than them, and converted from the content's zoom (a text set to shrink) to the block's.
        const block = ctx.section.blocks.find((b) => b.id === el.dataset.blockId);
        if (block?.frames?.desktop) {
          const now = framesKey(ctx.section);
          let start = typingFrom.get(block.id);
          if (!start?.written.includes(now)) {
            start = { before: ctx.section.blocks.map((b) => ({ id: b.id, frames: { desktop: b.frames?.desktop && { ...b.frames.desktop } } })), written: [now] };
          }
          const height = el.style.height;
          el.style.height = 'auto';
          const needed = content.scrollHeight * ((content.currentCSSZoom ?? 1) / (el.currentCSSZoom ?? 1));
          el.style.height = height;
          const frames = typedFrames(start.before, block.id, needed, ctx.grid?.size ?? 8);
          for (const other of ctx.section.blocks) {
            const frame = frames.get(other.id);
            if (!frame || sameFrame(frame, other.frames?.desktop)) continue;
            other.frames.desktop = frame;
            if (other === block) {
              el.style.height = `${frame.h}px`;
            } else {
              const otherEl = el.parentElement?.querySelector(`:scope > .urd-block[data-block-id="${CSS.escape(other.id)}"]`);
              if (otherEl) otherEl.style.top = `${frame.y}px`;
            }
            // The section is left alone: if the text grows past the edge it
            // hangs over (sections never clip, and the height is the user's).
            post({ type: 'urd-move', sectionId: ctx.section.id, blockId: other.id, frame, coalesce: true, groupKey: block.id });
          }
          start.written = [...start.written.slice(-7), framesKey(ctx.section)];
          typingFrom.set(block.id, start);
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
