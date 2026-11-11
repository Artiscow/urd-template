/**
 * How an organisation identifies itself on its website, per country: the numbers it shows, their form and check (contact-checks.js), the VAT number's relation to them, and the ISO 6523 codes the JSON-LD may carry.
 * Researched from the registers, tax authorities and laws on 20 October 2026 for 57 countries; a country outside the list uses the generic profile, a free label and number with no check.
 * The labels are the local abbreviations as sites write them, shown as they are in every language; the panel's field names come from the admin dictionary.
 *
 * An id: { key, label, regex (on the normalised value), entry? (a register entry: letters and a number, the prefix added when the number is typed alone), check?, warn? (a failed check warns instead of refusing), choice? (ids sharing it are alternatives, of which an organisation holds one), display? (# per character), raw? (free text, only trimmed), prefix? (added when missing), checkWhole? (the check sees the prefix), extra? ('court' | 'city' | 'taxOffice'), line? (tokens {label} {value} {extra} {register}), lineBare? (the line while its court or register is empty), registers? (a choice named beside the number), status? (a tick box with fixed wording), icd?, icdKeep? (the ISO 6523 value keeps the prefix), icdPrefix? (added to it) }.
 * The VAT entry: { kind: 'none' | 'same' (the id is the VAT number) | 'mark' (a word after the id; withRegister joins it to the register's suffix) | 'wrap' (a prefix and suffix round the id, or its first digits) | 'separate' (its own number) | 'status' (a wording only), of?, mark?, prefix?, suffix?, take?, label?, regex?, check?, warn?, show? (false: the VAT number appears in the data only) }.
 */

const D = (n) => new RegExp(`^[0-9]{${n}}$`);
const RAW = /^.{1,80}$/;

export const GENERIC = {
  ids: [{ key: 'number', label: '', ownLabel: true, raw: true, regex: RAW }],
  vat: { kind: 'separate', raw: true, regex: RAW },
};

export const PROFILES = {
  NO: {
    ids: [{ key: 'org', label: 'Org.nr.', regex: D(9), check: 'no-org', display: '### ### ###', registers: ['Enhetsregisteret', 'Foretaksregisteret', 'Frivillighetsregisteret'], icd: '0192' }],
    vat: { kind: 'mark', of: 'org', mark: 'MVA' },
  },
  SE: {
    ids: [{ key: 'org', label: 'Org.nr', regex: /^[0-9]{2}[2-9][0-9]{7}$/, check: 'luhn', display: '######-####', icd: '0007' }],
    vat: { kind: 'wrap', of: 'org', prefix: 'SE', suffix: '01', label: 'Momsreg.nr' },
  },
  DK: {
    ids: [{ key: 'cvr', label: 'CVR-nr.', regex: /^[1-9][0-9]{7}$/, check: 'dk-cvr', icd: '0184' }],
    vat: { kind: 'wrap', of: 'cvr', prefix: 'DK', label: 'Momsnr.' },
  },
  FI: {
    ids: [{ key: 'y', label: 'Y-tunnus', regex: D(8), check: 'fi-y', display: '#######-#', icd: '0212' }],
    vat: { kind: 'wrap', of: 'y', prefix: 'FI', label: 'ALV-numero' },
  },
  IS: {
    ids: [{ key: 'kt', label: 'Kt.', regex: D(10), check: 'is-kt', warn: true, display: '######-####', icd: '0196' }],
    vat: { kind: 'separate', label: 'VSK-nr.', regex: /^[0-9]{1,6}$/ },
  },
  EE: {
    ids: [{ key: 'reg', label: 'Registrikood', regex: /^[1789][0-9]{7}$/, check: 'ee-reg', icd: '0191' }],
    vat: { kind: 'separate', label: 'KMKR', prefix: 'EE', regex: /^EE[0-9]{9}$/, check: 'ee-vat' },
  },
  LV: {
    ids: [{ key: 'reg', label: 'Reģ. Nr.', regex: D(11), check: 'lv-reg', icd: '0218' }],
    vat: { kind: 'wrap', of: 'reg', prefix: 'LV', label: 'PVN reģ. Nr.' },
  },
  LT: {
    ids: [{ key: 'code', label: 'Įmonės kodas', regex: D(9), check: 'lt-code', icd: '0200' }],
    vat: { kind: 'separate', label: 'PVM mokėtojo kodas', prefix: 'LT', regex: /^LT([0-9]{9}|[0-9]{12})$/, check: 'lt-vat' },
  },
  GB: {
    ids: [
      { key: 'crn', label: 'Company No.', regex: /^([0-9]{8}|[A-Z][A-Z0-9][0-9]{6}|IP[0-9]{5}R|SP[0-9]{4}RS)$/, registers: ['England and Wales', 'Scotland', 'Northern Ireland'], line: 'Registered in {register}, {label} {value}' },
      { key: 'charityEw', choice: 'charity', label: 'Registered charity number', regex: /^([2-9][0-9]{5}|1[0-9]{6})(-[0-9]{1,3})?$/ },
      { key: 'charitySc', choice: 'charity', label: 'Scottish Charity No.', regex: /^SC0[0-9]{5}$/ },
      { key: 'charityNi', choice: 'charity', label: 'NIC number', regex: /^NIC[0-9]{6}$/ },
      { key: 'society', label: 'Registered society no.', regex: /^[0-9]{1,5}[A-Z]{0,4}$/ },
    ],
    vat: { kind: 'separate', label: 'VAT Reg No.', prefix: 'GB', regex: /^GB([0-9]{9}|[0-9]{12}|GD[0-4][0-9]{2}|HA[5-9][0-9]{2})$/, check: 'gb-vat' },
  },
  IE: {
    ids: [
      { key: 'cro', label: 'Company No.', regex: /^[0-9]{1,6}$/ },
      { key: 'rcn', label: 'RCN', regex: /^20[0-9]{6}$/ },
      { key: 'chy', label: 'CHY', regex: /^[0-9]{1,5}$/ },
    ],
    vat: { kind: 'separate', label: 'VAT No.', prefix: 'IE', regex: /^IE([0-9]{7}[A-W][A-W]?|[0-9][A-Z+*][0-9]{5}[A-W])$/, check: 'ie-vat' },
  },
  FR: {
    ids: [
      { key: 'siren', label: 'SIREN', regex: D(9), check: 'luhn', display: '### ### ###', icd: '0002' },
      { key: 'siret', label: 'SIRET', regex: D(14), check: 'fr-siret', display: '### ### ### #####' },
      { key: 'rna', label: 'N° RNA', regex: /^W[0-9][0-9A-Z][0-9]{7}$/ },
      { key: 'rcs', label: 'RCS', regex: D(9), check: 'luhn', display: '### ### ###', extra: 'city', line: '{label} {extra} {value}' },
      { key: 'rup', label: 'Reconnue d\'utilité publique', status: true },
    ],
    vat: { kind: 'separate', label: 'N° TVA', prefix: 'FR', regex: /^FR[0-9A-HJ-NP-Z]{2}[0-9]{9}$/, check: 'fr-tva', checkWhole: true },
  },
  MC: {
    ids: [
      { key: 'rci', label: 'RCI', raw: true, regex: /^[0-9]{2}[ .]?(S|P|SC)[ .]?[0-9]{4,5}$/, icd: '0206' },
      { key: 'nis', label: 'NIS', raw: true, regex: RAW },
    ],
    vat: { kind: 'separate', label: 'N° TVA', prefix: 'FR', regex: /^FR[0-9]{2}000[0-9]{6}$/, check: 'fr-tva', checkWhole: true },
  },
  AD: {
    ids: [
      { key: 'nrt', label: 'NRT', regex: /^[ACDEFGLOPU][0-9]{6}[A-Z]$/, display: '#-######-#' },
      { key: 'rsm', label: 'Registre de Societats núm.', regex: /^[0-9]{1,6}$/ },
    ],
    vat: { kind: 'same', of: 'nrt' },
  },
  BE: {
    ids: [{ key: 'kbo', label: 'Ondernemingsnummer', regex: /^[01][0-9]{9}$/, check: 'be-kbo', display: '####.###.###', extra: 'court', line: '{label} {value} · RPR {extra}', icd: '0208' }],
    vat: { kind: 'wrap', of: 'kbo', prefix: 'BE', label: 'BTW' },
  },
  NL: {
    ids: [
      { key: 'kvk', label: 'KVK', regex: D(8), icd: '0106' },
      { key: 'rsin', label: 'RSIN', regex: D(9), check: 'nl-elf' },
    ],
    vat: { kind: 'separate', label: 'btw-id', prefix: 'NL', regex: /^NL[0-9]{9}B[0-9]{2}$/, check: 'nl-vat', checkWhole: true },
  },
  LU: {
    ids: [
      { key: 'rcs', label: 'R.C.S. Luxembourg', regex: /^[A-O][0-9]{1,6}$/ },
      { key: 'mat', label: 'Matricule', regex: /^[0-9]{4}[2-9][0-9]{6}$/, check: 'lu-mat', icd: '0240' },
    ],
    vat: { kind: 'separate', label: 'TVA', prefix: 'LU', regex: /^LU[0-9]{8}$/, check: 'lu-vat' },
  },
  DE: {
    ids: [
      { key: 'vr', choice: 'register', entry: true, label: 'Vereinsregister', prefix: 'VR', raw: true, regex: /^VR [1-9][0-9]{0,5}( [A-ZÄÖÜ]{1,3})?$/, extra: 'court', line: '{label}: {extra}, {value}', lineBare: '{label}: {value}' },
      { key: 'hr', choice: 'register', entry: true, label: 'Handelsregister', raw: true, regex: /^HR[AB] [1-9][0-9]{0,5}( [A-ZÄÖÜ]{1,3})?$/, extra: 'court', line: '{label}: {extra}, {value}', lineBare: '{label}: {value}' },
      { key: 'gnr', choice: 'register', entry: true, label: 'Genossenschaftsregister', prefix: 'GnR', raw: true, regex: /^GnR [1-9][0-9]{0,5}( [A-ZÄÖÜ]{1,3})?$/, extra: 'court', line: '{label}: {extra}, {value}', lineBare: '{label}: {value}' },
      { key: 'pr', choice: 'register', entry: true, label: 'Partnerschaftsregister', prefix: 'PR', raw: true, regex: /^PR [1-9][0-9]{0,5}( [A-ZÄÖÜ]{1,3})?$/, extra: 'court', line: '{label}: {extra}, {value}', lineBare: '{label}: {value}' },
      { key: 'gsr', choice: 'register', entry: true, label: 'Gesellschaftsregister', prefix: 'GsR', raw: true, regex: /^GsR [1-9][0-9]{0,5}( [A-ZÄÖÜ]{1,3})?$/, extra: 'court', line: '{label}: {extra}, {value}', lineBare: '{label}: {value}' },
    ],
    vat: { kind: 'separate', label: 'USt-IdNr.', prefix: 'DE', regex: /^DE[0-9]{9}$/, check: 'mod11x10' },
  },
  AT: {
    ids: [
      { key: 'fn', label: 'FN', regex: /^[0-9]{1,6}[a-z]$/, check: 'at-fn', warn: true, extra: 'court', line: '{label} {value}, {extra}' },
      { key: 'zvr', label: 'ZVR-Zahl', regex: D(9) },
    ],
    vat: { kind: 'separate', label: 'UID-Nr.', prefix: 'ATU', regex: /^ATU[0-9]{8}$/, check: 'at-uid' },
  },
  CH: {
    ids: [{ key: 'uid', label: 'UID', prefix: 'CHE', regex: /^CHE[0-9]{9}$/, check: 'ch-uid', checkWhole: true, display: 'CHE-###.###.###', registers: ['HR', 'RC'], line: '{label} {value} {register}', icd: '0183', icdKeep: true }],
    vat: { kind: 'mark', of: 'uid', mark: 'MWST', withRegister: true },
  },
  LI: {
    ids: [
      { key: 'fl', label: 'Reg.-Nr.', prefix: 'FL', regex: /^FL[0-9]{11}$/, check: 'ch-mod10', checkWhole: true, warn: true, display: 'FL-####.###.###-#' },
      { key: 'uid', label: 'UID', prefix: 'CHE', regex: /^CHE[0-9]{9}$/, check: 'ch-uid', checkWhole: true, display: 'CHE-###.###.###', icd: '0183', icdKeep: true },
    ],
    vat: { kind: 'separate', label: 'MWST-Nr.', regex: /^[0-9]{1,6}$/ },
  },
  ES: {
    ids: [
      { key: 'nif', label: 'NIF', regex: /^[ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J]$/, check: 'es-nif-entity' },
      { key: 'rna', label: 'Registro Nacional de Asociaciones núm.', raw: true, regex: RAW },
      { key: 'rm', label: 'Registro Mercantil', raw: true, regex: RAW },
    ],
    vat: { kind: 'wrap', of: 'nif', prefix: 'ES', label: 'NIF-IVA', show: false },
  },
  PT: {
    ids: [{ key: 'nipc', label: 'NIPC', regex: D(9), check: 'pt-nif', display: '### ### ###' }],
    vat: { kind: 'wrap', of: 'nipc', prefix: 'PT', show: false },
  },
  IT: {
    ids: [
      { key: 'cf', label: 'C.F.', regex: D(11), check: 'luhn', icd: '0210' },
      { key: 'piva', label: 'P.IVA', regex: D(11), check: 'luhn', icd: '0211', icdPrefix: 'IT' },
      { key: 'runts', label: 'RUNTS n.', raw: true, regex: RAW },
    ],
    vat: { kind: 'wrap', of: 'piva', prefix: 'IT', show: false },
  },
  SM: {
    ids: [{ key: 'coe', label: 'COE', regex: /^(SM)?[0-9]{1,5}$/ }],
    vat: { kind: 'same', of: 'coe' },
  },
  VA: GENERIC,
  MT: {
    ids: [
      { key: 'reg', label: 'Reg. No.', regex: /^C[0-9]{1,6}$/ },
      { key: 'vo', label: 'VO number', raw: true, regex: RAW },
    ],
    vat: { kind: 'separate', label: 'VAT No.', prefix: 'MT', regex: /^MT[1-9][0-9]{7}$/, check: 'mt-vat' },
  },
  GR: {
    ids: [
      { key: 'afm', label: 'ΑΦΜ', regex: D(9), check: 'gr-afm', extra: 'taxOffice', line: '{label} {value}, ΔΟΥ {extra}' },
      { key: 'gemi', label: 'Αρ. ΓΕΜΗ', regex: D(12) },
      { key: 'somateio', label: 'Αριθμός εγγραφής σωματείου', raw: true, regex: RAW },
    ],
    vat: { kind: 'wrap', of: 'afm', prefix: 'EL', show: false },
  },
  CY: {
    ids: [{ key: 'he', label: 'Reg. No.', regex: /^HE[0-9]{1,6}$/, display: 'HE ######' }],
    vat: { kind: 'separate', label: 'VAT No.', prefix: 'CY', regex: /^CY[0-9]{8}[A-Z]$/, check: 'cy-vat' },
  },
  TR: {
    ids: [
      { key: 'vkn', label: 'Vergi No', regex: D(10), check: 'tr-vkn', extra: 'taxOffice', line: 'Vergi Dairesi: {extra}, {label}: {value}', lineBare: '{label}: {value}' },
      { key: 'mersis', label: 'MERSİS No', regex: D(16) },
    ],
    vat: { kind: 'same', of: 'vkn' },
  },
  HR: {
    ids: [
      { key: 'oib', label: 'OIB', regex: D(11), check: 'mod11x10' },
      { key: 'mbs', label: 'MBS', raw: true, regex: RAW, extra: 'court', line: '{label} {value}, {extra}' },
      { key: 'udruge', label: 'Registarski broj', raw: true, regex: RAW },
    ],
    vat: { kind: 'wrap', of: 'oib', prefix: 'HR', show: false },
  },
  SI: {
    ids: [
      { key: 'tax', label: 'Davčna številka', regex: /^[1-9][0-9]{7}$/, check: 'si-tax' },
      { key: 'reg', label: 'Matična številka', regex: /^[0-9]{7}([0-9A-Z][0-9]{2})?$/, check: 'si-reg', warn: true },
    ],
    vat: { kind: 'wrap', of: 'tax', prefix: 'SI', label: 'ID za DDV' },
  },
  PL: {
    ids: [
      { key: 'nip', label: 'NIP', regex: D(10), check: 'pl-nip', display: '###-###-##-##' },
      { key: 'regon', label: 'REGON', regex: /^([0-9]{9}|[0-9]{14})$/, check: 'pl-regon' },
      { key: 'krs', label: 'KRS', regex: D(10) },
    ],
    vat: { kind: 'wrap', of: 'nip', prefix: 'PL', show: false },
  },
  CZ: {
    ids: [
      { key: 'ico', label: 'IČO', regex: D(8), check: 'cz-ico', icd: '0154' },
      { key: 'sp', label: 'sp. zn.', raw: true, regex: RAW, extra: 'court', line: '{label} {value}, {extra}' },
    ],
    vat: { kind: 'wrap', of: 'ico', prefix: 'CZ', label: 'DIČ' },
  },
  SK: {
    ids: [
      { key: 'ico', label: 'IČO', regex: D(8), check: 'cz-ico', warn: true, icd: '0158' },
      { key: 'dic', label: 'DIČ', regex: D(10), check: 'sk-dic', icd: '0245' },
    ],
    vat: { kind: 'wrap', of: 'dic', prefix: 'SK', label: 'IČ DPH' },
  },
  HU: {
    ids: [
      { key: 'adoszam', label: 'Adószám', regex: /^[0-9]{8}[1-5][0-9]{2}$/, check: 'hu-tax', display: '########-#-##' },
      { key: 'ceg', label: 'Cégjegyzékszám', regex: D(10), display: '##-##-######' },
      { key: 'civil', label: 'Nyilvántartási szám', regex: D(11), display: '##-##-#######' },
    ],
    vat: { kind: 'wrap', of: 'adoszam', prefix: 'HU', take: 8, label: 'Közösségi adószám', show: false },
  },
  RO: {
    ids: [
      { key: 'cui', label: 'CUI', regex: /^[1-9][0-9]{1,9}$/, check: 'ro-cui' },
      { key: 'onrc', label: 'Nr. Reg. Com.', raw: true, regex: /^([JFC][0-9]{13}|[JFC][0-9]{1,2}\/[0-9]{1,6}\/[0-9]{4})$/, check: 'ro-onrc' },
      { key: 'raf', label: 'Nr. RAF', raw: true, regex: RAW },
    ],
    vat: { kind: 'wrap', of: 'cui', prefix: 'RO', label: 'CIF' },
  },
  BG: {
    ids: [{ key: 'eik', label: 'ЕИК', regex: /^([0-9]{9}|[0-9]{13})$/, check: 'bg-eik' }],
    vat: { kind: 'wrap', of: 'eik', prefix: 'BG', label: 'ИН по ДДС' },
  },
  RS: {
    ids: [
      { key: 'pib', label: 'ПИБ', regex: /^[1-9][0-9]{8}$/, check: 'mod11x10' },
      { key: 'mb', label: 'Матични број', regex: D(8), check: 'rs-mb', warn: true },
    ],
    vat: { kind: 'same', of: 'pib' },
  },
  BA: {
    ids: [{ key: 'jib', label: 'JIB', regex: /^4[0-9]{12}$/, check: 'ba-jib', warn: true }],
    vat: { kind: 'separate', label: 'PDV broj', regex: D(12) },
  },
  ME: {
    ids: [
      { key: 'pib', label: 'PIB', regex: D(8), check: 'me-pib', warn: true },
      { key: 'reg', label: 'Reg. br.', raw: true, regex: RAW },
    ],
    vat: { kind: 'wrap', of: 'pib', prefix: 'ME', label: 'PDV broj' },
  },
  MK: {
    ids: [
      { key: 'edb', label: 'ЕДБ', regex: D(13), check: 'mk-edb' },
      { key: 'embs', label: 'ЕМБС', regex: D(7), check: 'mk-embs', warn: true },
    ],
    vat: { kind: 'wrap', of: 'edb', prefix: 'MK', label: 'ДДВ број' },
  },
  AL: {
    ids: [{ key: 'nipt', label: 'NIPT', regex: /^[A-M][0-9]{8}[A-Z]$/ }],
    vat: { kind: 'same', of: 'nipt' },
  },
  XK: {
    ids: [
      { key: 'nui', label: 'NUI', regex: D(9) },
      { key: 'ojq', label: 'Nr. i regjistrimit', raw: true, regex: RAW },
      { key: 'fiscal', label: 'Nr. fiskal', raw: true, regex: RAW },
    ],
    vat: { kind: 'separate', label: 'Nr. i TVSH-së', raw: true, regex: RAW },
  },
  MD: {
    ids: [{ key: 'idno', label: 'IDNO', regex: D(13), check: 'md-idno' }],
    vat: { kind: 'separate', label: 'Cod TVA', regex: D(7) },
  },
  UA: {
    ids: [{ key: 'edrpou', label: 'ЄДРПОУ', regex: D(8), check: 'ua-edrpou', warn: true }],
    vat: { kind: 'separate', label: 'ІПН', regex: D(12) },
  },
  BY: {
    ids: [{ key: 'unp', label: 'УНП', regex: /^([0-9]{9}|[ABCEHKM][ABCEHKMOPT][0-9]{7})$/, check: 'by-unp', warn: true }],
    vat: { kind: 'same', of: 'unp' },
  },
  RU: {
    ids: [
      { key: 'inn', label: 'ИНН', regex: D(10), check: 'ru-inn' },
      { key: 'kpp', label: 'КПП', regex: /^[0-9]{4}[0-9A-Z]{2}[0-9]{3}$/ },
      { key: 'ogrn', label: 'ОГРН', regex: /^[15][0-9]{12}$/, check: 'ru-ogrn' },
    ],
    vat: { kind: 'same', of: 'inn' },
  },
  GE: {
    ids: [{ key: 'id', label: 'ს/კ', regex: D(9) }],
    vat: { kind: 'same', of: 'id' },
  },
  AM: {
    ids: [
      { key: 'tin', label: 'ՀՎՀՀ', regex: D(8) },
      { key: 'reg', label: 'Պետ. գրանցման համար', raw: true, regex: RAW },
    ],
    vat: { kind: 'wrap', of: 'tin', suffix: '/1', label: 'ԱԱՀ' },
  },
  AZ: {
    ids: [{ key: 'voen', label: 'VÖEN', regex: /^[0-9]{9}[12]$/, check: 'az-voen' }],
    vat: { kind: 'same', of: 'voen' },
  },
  US: {
    ids: [
      { key: 'ein', label: 'EIN', regex: D(9), display: '##-#######' },
      { key: 'c3', label: '501(c)(3) nonprofit organization', status: true, nonprofit: 'Nonprofit501c3' },
      { key: 'stateReg', label: 'State charity registration no.', raw: true, regex: RAW },
    ],
    vat: { kind: 'none' },
  },
  CA: {
    ids: [
      { key: 'bn', label: 'BN', regex: D(9), check: 'ca-bn', icd: '0093' },
      { key: 'rr', label: 'Charitable Registration No.', regex: /^[0-9]{9}RR[0-9]{4}$/, check: 'ca-bn', display: '######### RR ####' },
      { key: 'neq', label: 'NEQ', regex: D(10) },
    ],
    vat: { kind: 'separate', label: 'GST/HST No.', regex: /^[0-9]{9}RT[0-9]{4}$/, check: 'ca-bn' },
  },
  MX: {
    ids: [
      { key: 'rfc', label: 'RFC', regex: /^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{2}[0-9A]$/, check: 'mx-rfc' },
      { key: 'cluni', label: 'CLUNI', raw: true, regex: RAW },
      { key: 'donataria', label: 'Donataria autorizada', status: true },
    ],
    vat: { kind: 'same', of: 'rfc' },
  },
  TW: {
    ids: [
      { key: 'ubn', label: '統一編號', regex: D(8), check: 'tw-ubn' },
      { key: 'permit', label: '勸募字號', raw: true, regex: RAW },
      { key: 'approval', label: '立案字號', raw: true, regex: RAW },
    ],
    vat: { kind: 'same', of: 'ubn' },
  },
  JP: {
    ids: [{ key: 'corp', label: '法人番号', regex: D(13), check: 'jp-corp', icd: '0188' }],
    vat: { kind: 'separate', label: '登録番号', prefix: 'T', regex: /^T[0-9]{13}$/, check: 'jp-corp', checkWhole: true },
  },
  KR: {
    ids: [
      { key: 'brn', choice: 'business', label: '사업자등록번호', regex: D(10), check: 'kr-brn', display: '###-##-#####' },
      { key: 'unique', choice: 'business', label: '고유번호', regex: D(10), check: 'kr-brn', display: '###-##-#####' },
      { key: 'corp', label: '법인등록번호', regex: D(13), check: 'kr-corp', warn: true, display: '######-#######' },
      { key: 'mailOrder', label: '통신판매업 신고번호', raw: true, regex: RAW },
    ],
    vat: { kind: 'same', of: 'brn' },
  },
  AU: {
    ids: [
      { key: 'abn', label: 'ABN', regex: D(11), check: 'au-abn', display: '## ### ### ###', icd: '0151' },
      { key: 'acn', label: 'ACN', regex: D(9), check: 'au-acn', display: '### ### ###' },
      { key: 'inc', label: 'Incorporated association no.', raw: true, regex: RAW },
      { key: 'acnc', label: 'Registered charity', status: true },
    ],
    vat: { kind: 'status', label: 'GST registered' },
  },
};

/** The country a site's language suggests, for the panel's default; null when the language says nothing. */
export const LANGUAGE_COUNTRY = {
  nb: 'NO', nn: 'NO', no: 'NO', se: 'NO', sv: 'SE', da: 'DK', fi: 'FI', is: 'IS', et: 'EE', lv: 'LV', lt: 'LT',
  'en-GB': 'GB', en: 'GB', ga: 'IE', fr: 'FR', nl: 'NL', de: 'DE', it: 'IT', es: 'ES', pt: 'PT', el: 'GR', tr: 'TR',
  hr: 'HR', sl: 'SI', pl: 'PL', cs: 'CZ', sk: 'SK', hu: 'HU', ro: 'RO', bg: 'BG', sr: 'RS', mk: 'MK', sq: 'AL',
  uk: 'UA', be: 'BY', ru: 'RU', ka: 'GE', hy: 'AM', az: 'AZ', 'en-US': 'US', 'en-CA': 'CA', 'en-AU': 'AU',
  ja: 'JP', ko: 'KR', 'zh-TW': 'TW',
};

/** The country codes with a profile, for the panel's list. */
export const COUNTRY_CODES = Object.keys(PROFILES);

/** The profile of a country code; the generic one for a code outside the list, which the panel offers as «Other». */
export function profileOf(country) {
  return PROFILES[country] ?? GENERIC;
}

/** The country code the site language suggests. */
export function countryForLanguage(lang) {
  const code = String(lang ?? '');
  return LANGUAGE_COUNTRY[code] ?? LANGUAGE_COUNTRY[code.split('-')[0]] ?? null;
}
