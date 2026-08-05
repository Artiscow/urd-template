/**
 * Stabil kjøretids-sti (se ADR-0013): i18n.js og plugins.js (som buntes inn
 * i admin) laster språkpakke-modulen dynamisk via denne, så samme absolutte
 * sti virker fra både motoren og editor-bundelen uavhengig av motorversjon.
 */
export * from '../engine/0.6.10/language-packs.js';
