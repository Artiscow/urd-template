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
import { drawnWidth } from '../render.js';
import { textDesign, termsDesign, applyDocLook, buildContents, foldParts, addFormPrint, storedDocHtml } from '../doc-look.js';

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
   * @param {{html: string, align: string, box?: boolean, boxStyle?: object, font?: string, size?: number, lineHeight?: number, letterSpacing?: number, design?: string, accent?: string, headingColor?: string, cardColor?: string, rules?: boolean, corners?: string, headingFont?: string}} props
   *   design (additive from 0.7.24.2.4): the design the text is drawn in; a text block is plain text, and the terms block (below) a document design (doc-look.js) with its look beside it
   * @param {object} ctx Render context
   * @param {string} [design] The design it is drawn in: plain text for a text block, unless one from before page v8 still holds a document design
   */
  render(el, props, ctx, design = textDesign(props.design)) {
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
    // A document design (doc-look.js) draws the text in a root of its own, with the contents beside it where the design has them; plain text stands alone as it always has.
    const prefix = `urd-doc-${el.dataset.blockId ?? 'text'}`;
    let doc = null;
    let contentsKey = '';
    const drawContents = () => {
      const headings = [...content.querySelectorAll(':scope > h2')];
      const key = headings.map((h) => h.textContent).join('\n');
      if (key === contentsKey && doc.querySelector('.urd-doc-toc')) return;
      contentsKey = key;
      const { nav, fold } = buildContents(headings, prefix);
      const oldNav = doc.querySelector('.urd-doc-toc');
      if (oldNav) oldNav.replaceWith(nav);
      else doc.querySelector('.urd-doc-cols').prepend(nav);
      const oldFold = doc.querySelector('.urd-doc-fold');
      if (oldFold) oldFold.replaceWith(fold);
      else doc.prepend(fold);
    };
    if (design === 'plain') {
      el.appendChild(content);
    } else {
      doc = document.createElement('div');
      doc.className = 'urd-doc urd-text-doc';
      doc.style.cssText = 'width:100%;min-height:100%;';
      content.style.minHeight = '';
      applyDocLook(doc, design, props);
      if (design === 'contents') {
        const cols = document.createElement('div');
        cols.className = 'urd-doc-cols';
        const body = document.createElement('div');
        body.className = 'urd-doc-body';
        body.appendChild(content);
        cols.appendChild(body);
        doc.appendChild(cols);
        drawContents();
      } else {
        doc.appendChild(content);
      }
      // For a visitor the questions fold out and a withdrawal form prints alone; in the editor the text is typed into, so it keeps its own shape there.
      if (!ctx.preview) {
        if (design === 'questions') foldParts(content, prefix);
        addFormPrint(content);
      }
      el.appendChild(doc);
    }
    /** The box the words fill: the document's root where there is one, with the contents row above the text in a narrow block. */
    const box = doc ?? content;

    // Click-and-type: in preview mode (inside the editor's iframe) the text is
    // directly editable, and every change is posted to the editor, which owns
    // the draft. The block id sits on the block element (set by render.js).
    // Desktop view only: the mobile view is layout adjustment, and text growth
    // writes the desktop frame.
    if (ctx.preview && ctx.viewport !== 'mobile') {
      content.contentEditable = 'true';
      // Where the caret stood as each change began, in characters into the text: sent with the words, so an undo of the typing puts the caret back there.
      let caretBefore = null;
      content.addEventListener('beforeinput', () => {
        const selection = content.ownerDocument.getSelection();
        if (!selection?.rangeCount || !content.contains(selection.anchorNode)) {
          caretBefore = null;
          return;
        }
        const range = selection.getRangeAt(0);
        const upTo = content.ownerDocument.createRange();
        upTo.selectNodeContents(content);
        upTo.setEnd(range.startContainer, range.startOffset);
        caretBefore = upTo.toString().length;
      });
      content.addEventListener('input', () => {
        const post = (msg) => window.parent?.postMessage(msg, location.origin);

        // Grow with the content and give the room back: the frame takes the height the words need, never less than it had before the typing began, and the blocks below move by the push rules from where they stood then (ADR-0024 decision 4), posted in the typing's undo step.
        // The start holds while the section's frames are ones the typing wrote, the last few included, so a redraw a keystroke behind keeps it; any other change starts afresh.
        // The words are measured with the box at its own height, since the text fills a box taller than them, and converted from the content's zoom (a text set to shrink) to the block's.
        const block = ctx.section.blocks.find((b) => b.id === el.dataset.blockId);
        // A text drawn as questions follows its closed rows (push-model.js foldsIntoQuestions): the editor fits its frame after the typing, so the typing grows nothing here.
        if (block?.frames?.desktop && design !== 'questions') {
          const now = framesKey(ctx.section);
          let start = typingFrom.get(block.id);
          if (!start?.written.includes(now)) {
            start = { before: ctx.section.blocks.map((b) => ({ id: b.id, frames: { desktop: b.frames?.desktop && { ...b.frames.desktop } } })), written: [now] };
          }
          const height = el.style.height;
          el.style.height = 'auto';
          const needed = box.scrollHeight * ((box.currentCSSZoom ?? 1) / (el.currentCSSZoom ?? 1));
          el.style.height = height;
          // Each block as wide as the push draws it, so the blocks below move as the pass would move them.
          const canvas = el.parentElement;
          const widths = new Map();
          for (const other of ctx.section.blocks) {
            const otherEl = other.frames?.desktop ? canvas?.querySelector(`:scope > .urd-block[data-block-id="${CSS.escape(other.id)}"]`) : null;
            if (otherEl) widths.set(other.id, drawnWidth(otherEl, canvas, other.frames.desktop));
          }
          const frames = typedFrames(start.before, block.id, needed, ctx.grid?.size ?? 8, widths);
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
            // The section is left alone: a section with a height of its own
            // lets the text hang past its edge (sections never clip, and the
            // height is the user's); one without follows its blocks' frames
            // (writePush in render.js).
            post({ type: 'urd-move', sectionId: ctx.section.id, blockId: other.id, frame, coalesce: true, groupKey: block.id });
          }
          start.written = [...start.written.slice(-7), framesKey(ctx.section)];
          typingFrom.set(block.id, start);
        }

        // A part to fill in (sections/presets.js) is the owner's own once no words in brackets remain in it: its mark goes, the words and the caret stay.
        for (const part of content.querySelectorAll('[data-urd-fill]')) {
          if (!/\[[^\]]*\]/.test(part.textContent)) part.removeAttribute('data-urd-fill');
        }
        // The contents follow the headings as they are typed.
        if (design === 'contents') drawContents();

        post({
          type: 'urd-edit',
          sectionId: ctx.section.id,
          blockId: el.dataset.blockId,
          props: { ...props, html: storedDocHtml(content) },
          ...(caretBefore === null ? {} : { caret: caretBefore }),
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
      if (!el.isConnected || ctx.viewport === 'mobile' || design === 'questions') return;
      const needed = box.scrollHeight * ((box.currentCSSZoom ?? 1) / (el.currentCSSZoom ?? 1));
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

/**
 * Core block: the terms of sale (0.7.24.8). The owner's own text, written on the page as a text block's is, always drawn in one of the document designs (doc-look.js TERMS_DESIGNS) with its look; the renderer is the text block's.
 */
export const termsBlock = {
  version: 1,
  label: 'Terms of sale',
  labelKey: 'blocks.terms',
  defaults: () => ({ html: ta('seed.design.doc'), align: 'left', design: 'long' }),
  migrations: {},
  render(el, props, ctx) {
    textBlock.render(el, props, ctx, termsDesign(props.design));
  },
};
