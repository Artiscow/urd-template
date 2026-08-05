/**
 * Stabil plugin-API-sti (se ADR-0013): re-eksporterer det temastyrte
 * nedtrekket (ADR-0009) fra den versjonerte motoren. Hardkod aldri den
 * versjonerte stien i en plugin.
 */
export * from '../engine/0.6.10/dropdown.js';
