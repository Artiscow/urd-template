/**
 * The preview's draw queue (ADR-0036): a message that draws waits until the code of what it draws is in, and those after it wait behind it, in order.
 */
import { onlyColoursChanged } from './theme.js';
import { pageTypes } from './plugins.js';
import { loadCoreTypes, prepareBlocks, pageBlocks } from './core-types.js';
import { loadFeatures, siteFeatures, pageFeatures } from './features.js';

/** A redraw of the page the preview holds, asked for by the preview itself (the bars' choices in the shared storage); no message can carry it. */
export const REDRAW = Symbol('redraw');

/**
 * The page and site a message draws; null for one that draws nothing or changes only the theme's colours, which apply without a redraw.
 * @param {unknown} msg
 * @param {{page: object|null, site: object}} state What the preview holds
 * @returns {{page: object|null, site: object}|null}
 */
export function drawnBy(msg, state) {
  if (msg === REDRAW) return { page: state.page, site: state.site };
  if (!msg || typeof msg !== 'object') return null;
  switch (msg.type) {
    case 'urd-preview':
      return msg.section ? { page: { ...state.page, sections: [msg.section] }, site: state.site } : null;
    case 'urd-preview-full':
      return msg.page ? { page: msg.page, site: state.site } : null;
    case 'urd-site':
      if (!msg.site || (!msg.page && onlyColoursChanged(state.site, msg.site))) return null;
      return { page: msg.page ?? state.page, site: msg.site };
    case 'urd-viewport':
    case 'urd-collections':
      return { page: state.page, site: state.site };
    default:
      return null;
  }
}

/**
 * Loads what a page and its site draw with: the core types of the page, menu and footer, the features with the collections, and the blocks readied.
 * @param {typeof window.Urd} Urd
 * @param {{page: object|null, site: object}} drawn
 * @param {'desktop'|'mobile'} viewport
 * @returns {Promise<void>}
 */
export function loadDrawn(Urd, { page, site }, viewport) {
  const pageId = page?.meta?.id ?? null;
  return Promise.all([
    loadCoreTypes(Urd, pageTypes(page, site?.nav, site?.footer)),
    loadFeatures(Urd, [...siteFeatures(site, pageId), ...pageFeatures(page, site), 'collections']),
    prepareBlocks(pageBlocks(page, site?.footer), { site, preview: true, viewport }),
  ]).then(() => {});
}

/**
 * Every core type, design part and feature, which the preview loads in the background once it has reported ready, so the editor can add any of them.
 * @param {typeof window.Urd} Urd
 * @returns {Promise<void>}
 */
export function loadEverything(Urd) {
  return Promise.all([loadCoreTypes(Urd, null, { all: true }), loadFeatures(Urd, null, { all: true })]).then(() => {});
}

/** Reports a failed message as the browser reports an uncaught error, so the queue goes on with the next. */
const report = (err) => (typeof globalThis.reportError === 'function' ? globalThis.reportError(err) : console.error(err));

/**
 * A queue that hands each message to `handle` in order, each once what `pending` loads for it is in.
 * `pending` is asked as each message's turn comes.
 * @param {(msg: unknown) => void} handle
 * @param {(msg: unknown) => Promise<void>|null} pending
 * @returns {(msg: unknown) => void}
 */
export function drawQueue(handle, pending) {
  const waiting = [];
  let draining = false;
  const run = (msg) => {
    try {
      handle(msg);
    } catch (err) {
      report(err);
    }
  };
  const loadFor = (msg) => {
    try {
      return pending(msg);
    } catch (err) {
      report(err);
      return null;
    }
  };
  const drain = async (load) => {
    draining = true;
    for (;;) {
      if (load) await load.catch(() => {});
      run(waiting.shift());
      if (!waiting.length) break;
      load = loadFor(waiting[0]);
    }
    draining = false;
  };
  return (msg) => {
    if (draining) {
      waiting.push(msg);
      return;
    }
    const load = loadFor(msg);
    if (!load) {
      run(msg);
      return;
    }
    waiting.push(msg);
    drain(load);
  };
}
