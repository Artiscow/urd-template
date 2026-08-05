/**
 * Delte typografi-konstanter: fontvalgene som både admin-panelene og
 * teksteditor-linjens typografirad viser. Kun systemtrygge stacker
 * (Urd laster aldri eksterne fonter, se _headers/CSP).
 */

/** @type {Array<[string, string]>} Visningsnavn-NØKKEL (ta-oppslag hos
 *  konsumenten; modulen ligger i besøkende-lukningen og kan aldri kalle
 *  ta() på modulnivå) + CSS-fontstack. Sammenligning og lagring bruker
 *  alltid stacken (element 1), aldri nøkkelen. */
export const FONT_STACKS = [
  ['font.system', 'system-ui, sans-serif'],
  ['font.arial', 'Arial, Helvetica, sans-serif'],
  ['font.verdana', 'Verdana, Geneva, sans-serif'],
  ['font.trebuchet', "'Trebuchet MS', sans-serif"],
  ['font.georgia', "Georgia, 'Times New Roman', serif"],
  ['font.palatino', "'Palatino Linotype', Palatino, serif"],
  ['font.courier', "'Courier New', monospace"],
];
