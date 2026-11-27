/**
 * Minutes a page fetched ahead and a calendar feed are kept in a visitor's browser, read by the modules that keep them and by privacy-model.js.
 * Notes: docs/engine-notes/keep-minutes.md (Urd repository).
 */

/** How long a page fetched ahead of a press on its link is kept (prefetch.js). */
export const PREFETCH_MINUTES = 5;

/** How long a calendar block keeps a feed's events before it fetches them again (blocks/calendar-load.js). */
export const CALENDAR_FEED_MINUTES = 10;
