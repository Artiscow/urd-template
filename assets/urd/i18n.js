/**
 * Stabil plugin-API-sti (se ADR-0013): /assets/urd/ er kontrakten plugins
 * importerer mot, og røres aldri av motorversjonering. Selve motoren bor i
 * den versjonerte (og immutable-cachede) mappa /assets/engine/<versjon>/;
 * dette skallet re-eksporterer derfra og oppdateres ved fase-slipp.
 * Hardkod aldri den versjonerte stien i en plugin.
 */
export * from '../engine/0.6.9/i18n.js';
