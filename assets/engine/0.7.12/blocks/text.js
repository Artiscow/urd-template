/**
 * Core block: text, the owner's rich text with its alignment.
 * The content is the owner's own and trusted, as the files in the repo are.
 * Notes: docs/engine-notes/blocks/text.md (Urd repository).
 */
import { setRichHtml, EDIT_HANDLES } from '../sanitize.js';
import { boxStyleCss } from '../box-style.js';

// The seed rule (ADR-0012): ta() is called only in defaults(), on insertion in preview, never at module level.
import { ta } from '../i18n.js';
import { typedFrames, PHONE_WORDS, forcesReadable } from '../push-model.js';
import { drawnWidth, pushAgain } from '../render.js';
import { textDesign, termsDesign, storedDocHtml } from '../doc-designs.js';
import { loadBlockSheet } from '../core-types.js';
import { loadEngineSheet } from '../sheets.js';

/** Per text block, the section's frames before the typing in it began, and the last few frames the typing wrote. */
const typingFrom = new Map();

/** The section's desktop frames as one comparable value. */
const framesKey = (section) => JSON.stringify(section.blocks.map((b) => [b.id, b.frames?.desktop ?? null]));

const sameFrame = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/** The document designs' drawing (doc-look.js) once it is in; a text in a document design draws with it. */
let docs = null;
/** Its loading, asked for once. */
let docsLoading = null;

/**
 * Loads what a document design draws with: doc-look.js, its sheet and the text block's own; plain text needs none of them.
 * @returns {Promise<object>} doc-look.js
 */
export function loadDocs() {
  docsLoading ??= Promise.all([import('../doc-look.js'), loadEngineSheet('doc-look.css'), loadBlockSheet('text')]).then(([module]) => (docs = module));
  return docsLoading;
}

/**
 * The columns a plain text is drawn in, or null for one column.
 * @param {{columns?: number, columnGap?: number}} props
 * @param {string} design
 * @returns {{columns: string, gap: string}|null}
 */
export function textColumns(props, design) {
  const count = Math.round(Number(props.columns));
  if (design !== 'plain' || !(count >= 2 && count <= 4)) return null;
  const gap = typeof props.columnGap === 'number' ? props.columnGap : NaN;
  return { columns: `${count} 14em`, gap: `${Number.isFinite(gap) && gap >= 0 ? Math.min(gap, 200) : 32}px` };
}

/** Readies a text block before the page is drawn (CORE_BLOCK_READY): a document design's drawing, nothing for plain text. */
export const prepareText = (props) => (textDesign(props.design) === 'plain' ? null : loadDocs());

/** Readies a terms block, always a document, before the page is drawn. */
export const prepareTerms = () => loadDocs();

export const textBlock = {
  version: 1,
  label: 'Text',
  labelKey: 'blocks.text',
  defaults: () => ({ html: ta('seed.text'), align: 'left', box: false }),
  migrations: {},
  /**
   * @param {HTMLElement} el The block element (positioned by render.js)
   * @param {{html: string, align: string, box?: boolean, boxStyle?: object, font?: string, size?: number, lineHeight?: number, letterSpacing?: number, design?: string, accent?: string, headingColor?: string, cardColor?: string, rules?: boolean, corners?: string, headingFont?: string, columns?: number, columnGap?: number}} props
   *   design: the design the text is drawn in, plain text for a text block and a document design (doc-look.js) for the terms block.
   * @param {object} ctx Render context
   * @param {string} [design] The design it is drawn in: plain text for a text block, unless one from before page v8 still holds a document design
   */
  render(el, props, ctx, design = textDesign(props.design)) {
    // The text lives in its own inner element, so the editing handles preview-edit puts on the block never end up in the editable content or props.html.
    const content = document.createElement('div');
    // The text box variant: the content sits in a card (the theme's surface colour, border, radius); without `box` it is drawn plain.
    content.className = props.box ? 'urd-text urd-text-box' : 'urd-text';
    // The block's own words, which «Long words» reaches (ADR-0034, base.css).
    content.dataset.urdText = '';
    content.style.cssText = 'width:100%;min-height:100%;';
    // Optional card style (additive; empty = the base style in .urd-text-box).
    if (props.box) Object.assign(content.style, boxStyleCss(props.boxStyle));
    content.style.textAlign = props.align;
    // Its own long words, else the theme's (ADR-0034, base.css .urd-text): hyphenated, or kept whole.
    if (props.words === 'whole' || props.words === 'hyphenate') {
      content.style.setProperty('--urd-text-hyphens', props.words === 'whole' ? 'manual' : 'auto');
      content.style.setProperty('--urd-text-wrap', props.words === 'whole' ? 'normal' : 'break-word');
    }
    // «Force readable text» on the desktop (ADR-0034): a plain text's lines wrap at a measure, by its alignment (base.css).
    // A phone layout on a desktop keeps it.
    if (design === 'plain' && (ctx.viewport !== 'mobile' || ctx.handoff) && forcesReadable(ctx.section, 'desktop')) {
      content.dataset.urdMeasure = '';
      content.dataset.urdAlign = props.align === 'center' || props.align === 'right' ? props.align : 'left';
    }
    // Optional font and size per text block (additive; empty = inherited from the theme).
    if (props.font) content.style.fontFamily = props.font;
    if (props.size) content.style.fontSize = `${props.size}px`;
    // Optional line and letter spacing (empty = inherited): the line height unitless, the letter spacing in px and possibly negative.
    if (props.lineHeight) content.style.lineHeight = String(props.lineHeight);
    if (typeof props.letterSpacing === 'number' && props.letterSpacing !== 0) {
      content.style.letterSpacing = `${props.letterSpacing}px`;
    }
    // Plain text in two to four columns, each at least 14em wide, so a narrow box draws fewer.
    const columns = textColumns(props, design);
    if (columns) {
      content.style.columns = columns.columns;
      content.style.columnGap = columns.gap;
    }
    // The words, rebuilt from the rich-text allowlist (sanitize.js): nothing executable reaches the page, and editing handles and buttons are left out.
    setRichHtml(content, props.html, ctx.site?.pages ?? [], { dropClasses: EDIT_HANDLES });
    // A document design (doc-look.js) draws the text in a root of its own, with the contents beside it where the design has them; plain text stands alone.
    const prefix = `urd-doc-${el.dataset.blockId ?? 'text'}`;
    let doc = null;
    let contentsKey = '';
    const drawContents = () => {
      const headings = [...content.querySelectorAll(':scope > h2')];
      const key = headings.map((h) => h.textContent).join('\n');
      if (key === contentsKey && doc.querySelector('.urd-doc-toc')) return;
      contentsKey = key;
      const { nav, fold } = docs.buildContents(headings, prefix);
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
      doc.appendChild(content);
      const lay = (look) => {
        look.applyDocLook(doc, design, props);
        if (design === 'contents') {
          const cols = document.createElement('div');
          cols.className = 'urd-doc-cols';
          const body = document.createElement('div');
          body.className = 'urd-doc-body';
          body.appendChild(content);
          cols.appendChild(body);
          doc.appendChild(cols);
          drawContents();
        }
        // For a visitor the questions fold out and a withdrawal form prints alone; in the editor the text is typed into, so it keeps its own shape there.
        if (!ctx.preview) {
          if (design === 'questions') look.foldParts(content, prefix);
          look.addFormPrint(content);
        }
      };
      // The document's look, readied before the page was drawn (prepareText), is laid at once; one that comes later is laid as it comes, the text plain until then.
      if (docs) lay(docs);
      else {
        loadDocs().then((look) => {
          if (!doc.isConnected) return;
          lay(look);
          // Folded questions take less room than the plain text did, so the push pass measures the block again.
          pushAgain(el);
        }, () => {});
      }
      el.appendChild(doc);
    }
    /** The box the words fill: the document's root where there is one, with the contents row above the text in a narrow block. */
    const box = doc ?? content;

    // Click-and-type: in the editor's preview the text is editable, each change posted to the editor.
    // In the phone view the words are the phone's own (ADR-0033).
    const phoneView = ctx.viewport === 'mobile';
    const ownType = ctx.section?.blocks.find((b) => b.id === el.dataset.blockId)?.type ?? 'text';
    if (ctx.preview && (!phoneView || PHONE_WORDS[ownType])) {
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

        // Grow with the content: the frame takes the height the words need, never less than before the typing, and the blocks below move by the push rules (ADR-0024).
        const block = ctx.section.blocks.find((b) => b.id === el.dataset.blockId);
        // A text drawn as questions is fitted by the editor after the typing, and on the phone the words grow their row, so neither grows the desktop frame here.
        if (!phoneView && block?.frames?.desktop && design !== 'questions') {
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
            // The section is left alone: one with a height of its own lets the text hang past its edge, one without follows its blocks' frames (writePush in render.js).
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
        if (design === 'contents' && docs) drawContents();

        post({
          type: 'urd-edit',
          sectionId: ctx.section.id,
          blockId: el.dataset.blockId,
          props: { ...props, html: storedDocHtml(content) },
          ...(phoneView ? { phone: true } : {}),
          ...(caretBefore === null ? {} : { caret: caretBefore }),
        });
      });
    }

    // The height a text needs is measured by the push pass on the desktop (render.js applyPush) and by the phone's flow, so a rewrapped text grows its box.
  },
};

/**
 * Core block: the terms of sale, the owner's own text always drawn in a document design (doc-look.js TERMS_DESIGNS) by the text block's renderer.
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
