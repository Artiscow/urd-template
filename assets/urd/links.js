/**
 * Stable plugin API path (see ADR-0013): re-exports the link resolver from the
 * versioned engine, so a plugin draws a `link` field's value as the core
 * blocks draw theirs. Never hardcode the versioned path in a plugin.
 */
export { resolveLink, linkAttrs } from '../engine/0.7.8/nav-model.js';
