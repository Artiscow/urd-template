/**
 * The check digits of organisation and VAT numbers, one function per algorithm, keyed by the names the country profiles use (contact-profiles.js).
 * Every function takes the normalised number (digits and letters only, no prefix unless the algorithm needs it) and answers true or false; the profile says whether a false refuses the number or only warns.
 * The algorithms were verified against real published numbers on 20 October 2026 (tests/contact-checks.test.mjs holds them); where a register publishes no algorithm the profile marks the check as a warning.
 */

const digits = (s) => [...String(s)].map(Number);

/** A weighted sum over the first digits of the number, weights given left to right. */
function weighted(num, weights) {
  const d = digits(num);
  return weights.reduce((acc, w, i) => acc + w * d[i], 0);
}

/** Luhn: every second digit from the right doubled and digit-summed; valid when the sum is a multiple of 10. */
export function luhn(num) {
  const d = digits(num);
  let sum = 0;
  for (let i = d.length - 1, double = false; i >= 0; i -= 1, double = !double) {
    let v = d[i];
    if (double) { v *= 2; if (v > 9) v -= 9; }
    sum += v;
  }
  return sum % 10 === 0;
}

/** ISO 7064 MOD 11,10 over all the digits, the last one the check. */
export function mod11x10(num) {
  const d = digits(num);
  let p = 10;
  for (let i = 0; i < d.length - 1; i += 1) {
    let s = (p + d[i]) % 10;
    if (s === 0) s = 10;
    p = (2 * s) % 11;
  }
  return (11 - p) % 10 === d[d.length - 1];
}

/** ISO 7064 MOD 97-10 over the whole string, letters as 10 to 35; valid when the remainder is 1. */
export function mod97x10(str) {
  const expanded = [...str].map((c) => (/[0-9]/.test(c) ? c : String(c.charCodeAt(0) - 55))).join('');
  let r = 0;
  for (const c of expanded) r = (r * 10 + Number(c)) % 97;
  return r === 1;
}

/**
 * The common mod 11 family: the weighted sum of the digits before the check, r = sum mod 11, check = 11 - r, with the remainders 0 and 1 handled as the register says.
 * zero: the check for r = 0 ('0' or '1'); one: the check for r = 1 ('0', or null when such a number is never issued.
 */
function mod11(num, weights, { zero = 0, one = null } = {}) {
  const d = digits(num);
  const r = weighted(num, weights) % 11;
  const check = r === 0 ? zero : r === 1 ? one : 11 - r;
  return check !== null && check === d[weights.length];
}

const SWISS_TABLE = [0, 9, 4, 6, 8, 2, 7, 1, 3, 5];

/** The Swiss «Modulo 10 rekursiv» over the digits, the last one the check. */
function mod10Recursive(num) {
  const d = digits(num);
  let carry = 0;
  for (let i = 0; i < d.length - 1; i += 1) carry = SWISS_TABLE[(carry + d[i]) % 10];
  return (10 - carry) % 10 === d[d.length - 1];
}

export const CHECKS = {
  luhn,
  // Norway: weights 3 2 7 6 5 4 3 2; a remainder of 1 is never issued.
  'no-org': (n) => mod11(n, [3, 2, 7, 6, 5, 4, 3, 2]),
  // Denmark: the whole number weighted 2 7 6 5 4 3 2 1 is a multiple of 11.
  'dk-cvr': (n) => weighted(n, [2, 7, 6, 5, 4, 3, 2, 1]) % 11 === 0,
  // Finland, asetus 288/2001 § 3: the seven digits weighted 7 9 10 5 8 4 2.
  'fi-y': (n) => mod11(n, [7, 9, 10, 5, 8, 4, 2]),
  // Iceland: the ninth digit; the registry issues numbers that fail it since February 2026.
  'is-kt': (n) => mod11(n, [3, 2, 7, 6, 5, 4, 3, 2]),
  // Estonia, the registry code: weights 1 to 7, then 3 to 9 when the remainder is 10.
  'ee-reg': (n) => {
    const d = digits(n);
    let r = weighted(n, [1, 2, 3, 4, 5, 6, 7]) % 11;
    if (r === 10) r = weighted(n, [3, 4, 5, 6, 7, 8, 9]) % 11;
    return r % 10 === d[7];
  },
  // Estonia, the VAT number: weights 3 7 1 repeating, a multiple of 10.
  'ee-vat': (n) => weighted(n, [3, 7, 1, 3, 7, 1, 3, 7, 1]) % 10 === 0,
  // Latvia: the weighted sum of all eleven digits leaves 3.
  'lv-reg': (n) => weighted(n, [9, 1, 4, 8, 3, 10, 2, 5, 7, 6, 1]) % 11 === 3,
  // Lithuania, the legal entity code: weights 1 to 8, the remainder is the ninth digit.
  'lt-code': (n) => {
    const r = weighted(n, [1, 2, 3, 4, 5, 6, 7, 8]) % 11;
    return r < 10 && r === digits(n)[8];
  },
  // Lithuania, the VAT code of 9 or 12 digits: cycling weights, a second pass when the remainder is 10.
  'lt-vat': (n) => {
    const d = digits(n);
    const len = d.length;
    if (d[len - 2] !== 1) return false;
    const pass = (shift) => d.slice(0, len - 1).reduce((acc, v, i) => acc + v * (1 + ((i + shift) % 9)), 0) % 11;
    let r = pass(0);
    if (r === 10) r = pass(2);
    return r % 10 === d[len - 1];
  },
  // The United Kingdom: the first seven digits weighted 8 to 2 plus the two check digits, a multiple of 97, or for numbers from 100 upwards a remainder of 42 (the 9755 series) or 55 (accepted by python-stdnum, unexplained, so a valid number is never refused).
  'gb-vat': (n) => {
    if (!/^[0-9]{9}/.test(n)) return true;
    const d = digits(n).slice(0, 9);
    const s = weighted(d.join(''), [8, 7, 6, 5, 4, 3, 2]) + 10 * d[7] + d[8];
    return s % 97 === 0 || (Number(d.slice(0, 3).join('')) >= 100 && [42, 55].includes(s % 97));
  },
  // Ireland: seven digits weighted 8 to 2, nine times a second letter, the check letter from W A B … V by the remainder mod 23.
  'ie-vat': (n) => {
    const alphabet = 'WABCDEFGHIJKLMNOPQRSTUV';
    let s = n;
    if (!/^[0-9]{7}/.test(s)) s = `0${s.slice(2, 7)}${s[0]}${s.slice(7)}`;
    const d = digits(s.slice(0, 7));
    let sum = weighted(d.join(''), [8, 7, 6, 5, 4, 3, 2]);
    if (s.length === 9) sum += 9 * alphabet.indexOf(s[8]);
    return alphabet[sum % 23] === s[7];
  },
  // Belgium: the last two digits are 97 minus the first eight mod 97.
  'be-kbo': (n) => (Number(n.slice(0, 8)) + Number(n.slice(8))) % 97 === 0,
  // The Netherlands, the elfproef: weights 9 to 2 and minus the last digit, a multiple of 11.
  'nl-elf': (n) => (weighted(n, [9, 8, 7, 6, 5, 4, 3, 2]) - digits(n)[8]) % 11 === 0,
  // The Netherlands, the VAT number: the elfproef on its nine digits, or MOD 97-10 on the whole number.
  'nl-vat': (n) => CHECKS['nl-elf'](n.slice(2, 11)) || mod97x10(n),
  // Luxembourg, the national register number: RGD 1994, weights 5 4 3 2 7 6 5 4 3 2, a remainder of 1 is never issued.
  'lu-mat': (n) => mod11(n, [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]),
  // Luxembourg, the VAT number: the first six digits mod 89 are the last two.
  'lu-vat': (n) => Number(n.slice(0, 6)) % 89 === Number(n.slice(6, 8)),
  // Germany's VAT number (nine digits), Croatia's OIB and Serbia's PIB: ISO 7064 MOD 11,10.
  'mod11x10': mod11x10,
  // Austria, the VAT number: seven digits with alternate doubling, digit-summed, the check from the sum plus 4.
  'at-uid': (n) => {
    const d = digits(n);
    let s = 0;
    for (let i = 0; i < 7; i += 1) {
      let v = d[i] * (i % 2 === 1 ? 2 : 1);
      if (v > 9) v -= 9;
      s += v;
    }
    return (10 - ((s + 4) % 10)) % 10 === d[7];
  },
  // Austria, the Firmenbuch number: six digits weighted 6 4 14 15 10 1, the letter from the remainder mod 17 (reconstructed from real numbers).
  'at-fn': (n) => {
    const m = /^([0-9]{1,6})([a-z])$/.exec(n);
    if (!m) return false;
    const padded = m[1].padStart(6, '0');
    return 'abdfghikmpstvwxyz'[weighted(padded, [6, 4, 14, 15, 10, 1]) % 17] === m[2];
  },
  // Switzerland, the UID: eight digits weighted 5 4 3 2 7 6 5 4, a remainder of 1 is never issued.
  'ch-uid': (n) => mod11(n.replace(/^CHE/, ''), [5, 4, 3, 2, 7, 6, 5, 4]),
  // Liechtenstein's register number and the old Swiss CH-ID: the Swiss recursive mod 10 (observed, unpublished).
  'ch-mod10': (n) => mod10Recursive(n.replace(/^(FL|CH)/, '')),
  // Spain, an entity's NIF: a letter, seven digits with alternate doubling, a control that is a digit or the letter J A B C D E F G H I.
  'es-nif-entity': (n) => {
    const d = digits(n.slice(1, 8));
    let s = 0;
    for (let i = 0; i < 7; i += 1) {
      if (i % 2 === 1) { s += d[i]; continue; }
      const v = 2 * d[i];
      s += v > 9 ? v - 9 : v;
    }
    const c = (10 - (s % 10)) % 10;
    const control = n[8];
    return control === String(c) || control === 'JABCDEFGHI'[c];
  },
  // Portugal: weights 9 to 2, the check 11 minus the remainder, 0 for a result of 10 or 11.
  'pt-nif': (n) => {
    const c = 11 - (weighted(n, [9, 8, 7, 6, 5, 4, 3, 2]) % 11);
    return (c >= 10 ? 0 : c) === digits(n)[8];
  },
  // Malta, the VAT number: weights 3 4 6 7 8 9 10 1, a multiple of 37.
  'mt-vat': (n) => weighted(n, [3, 4, 6, 7, 8, 9, 10, 1]) % 37 === 0,
  // Greece, the ΑΦΜ: powers of two from 256 down to 2, mod 11, mod 10.
  'gr-afm': (n) => (weighted(n, [256, 128, 64, 32, 16, 8, 4, 2]) % 11) % 10 === digits(n)[8],
  // Cyprus, the VAT number: odd positions mapped, the letter from the sum mod 26.
  'cy-vat': (n) => {
    const map = [1, 0, 5, 7, 9, 13, 15, 17, 19, 21];
    const d = digits(n.slice(0, 8));
    const s = d.reduce((acc, v, i) => acc + (i % 2 === 0 ? map[v] : v), 0);
    return String.fromCharCode(65 + (s % 26)) === n[8];
  },
  // Türkiye, the VKN: each digit shifted by its position, scaled by a power of two mod 9.
  'tr-vkn': (n) => {
    const d = digits(n);
    let sum = 0;
    for (let i = 1; i <= 9; i += 1) {
      const v = (d[i - 1] + 10 - i) % 10;
      let p = 0;
      if (v !== 0) {
        p = (v * 2 ** (10 - i)) % 9;
        if (p === 0) p = 9;
      }
      sum += p;
    }
    return (10 - (sum % 10)) % 10 === d[9];
  },
  // Slovenia, the tax number: weights 8 to 2, 0 for a result of 10, invalid for a remainder of 0.
  'si-tax': (n) => {
    const r = weighted(n, [8, 7, 6, 5, 4, 3, 2]) % 11;
    if (r === 0) return false;
    const c = 11 - r;
    return (c === 10 ? 0 : c) === digits(n)[7];
  },
  // Slovenia, the registration number: weights 7 to 2 on six digits, with the same rule (older numbers fail it).
  'si-reg': (n) => {
    const r = weighted(n, [7, 6, 5, 4, 3, 2]) % 11;
    if (r === 0) return false;
    const c = 11 - r;
    return (c === 10 ? 0 : c) === digits(n)[6];
  },
  // Poland, the NIP: weights 6 5 7 2 3 4 5 6 7, the remainder is the check, 10 never issued.
  'pl-nip': (n) => {
    const r = weighted(n, [6, 5, 7, 2, 3, 4, 5, 6, 7]) % 11;
    return r < 10 && r === digits(n)[9];
  },
  // Poland, the REGON of 9 or 14 digits: the remainder is the check, 10 written as 0.
  'pl-regon': (n) => {
    const d = digits(n);
    const weights = d.length === 14 ? [2, 4, 8, 5, 0, 9, 7, 3, 6, 1, 2, 4, 8] : [8, 9, 2, 3, 4, 5, 6, 7];
    return weighted(n, weights) % 11 % 10 === d[d.length - 1];
  },
  // Czechia and Slovakia, the IČO: weights 8 to 2, a remainder of 0 gives 1 and of 1 gives 0.
  'cz-ico': (n) => mod11(n, [8, 7, 6, 5, 4, 3, 2], { zero: 1, one: 0 }),
  // Slovakia, the DIČ: the whole number is a multiple of 11.
  'sk-dic': (n) => Number(n) % 11 === 0,
  // Hungary, the eight-digit törzsszám: weights 9 7 3 1 9 7 3, the check from the sum mod 10.
  'hu-tax': (n) => (10 - (weighted(n, [9, 7, 3, 1, 9, 7, 3]) % 10)) % 10 === digits(n)[7],
  // Romania, the CUI: the digits before the check padded to nine, the key 7 5 3 2 1 7 5 3 2, the sum times ten mod 11, 10 written as 0.
  'ro-cui': (n) => {
    const body = n.slice(0, -1).padStart(9, '0');
    return (weighted(body, [7, 5, 3, 2, 1, 7, 5, 3, 2]) * 10) % 11 % 10 === Number(n.slice(-1));
  },
  // Romania, the new trade register number: the letter's code plus the twelve digits, mod 10; the old J40/1234/2020 form has no check.
  'ro-onrc': (n) => {
    const m = /^([JFC])([0-9]{12})([0-9])$/.exec(n);
    if (!m) return /\//.test(n);
    return (m[1].charCodeAt(0) + digits(m[2]).reduce((a, b) => a + b, 0)) % 10 === Number(m[3]);
  },
  // Bulgaria, the nine-digit ЕИК: weights 1 to 8, then 3 to 10 when the remainder is 10, then 0.
  'bg-eik': (n) => {
    if (n.length !== 9) return true;
    let r = weighted(n, [1, 2, 3, 4, 5, 6, 7, 8]) % 11;
    if (r === 10) r = weighted(n, [3, 4, 5, 6, 7, 8, 9, 10]) % 11;
    if (r === 10) r = 0;
    return r === digits(n)[8];
  },
  // Serbia's МБ, Bosnia's JIB and North Macedonia's ЕДБ and ЕМБС: 11 minus the remainder, 10 and 11 written as 0 (observed rules).
  'rs-mb': (n) => mod11(n, [2, 7, 6, 5, 4, 3, 2], { zero: 0, one: 0 }),
  'ba-jib': (n) => mod11(n, [7, 6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2], { zero: 0, one: 0 }),
  'mk-edb': (n) => mod11(n, [7, 6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2], { zero: 0, one: 0 }),
  'mk-embs': (n) => mod11(n, [7, 6, 5, 4, 3, 2], { zero: 0, one: 0 }),
  // Montenegro, the PIB: weights 8 to 2, the same rule; a 2026 rulebook names MOD 11,10 instead, so either passes.
  'me-pib': (n) => mod11(n, [8, 7, 6, 5, 4, 3, 2], { zero: 0, one: 0 }) || mod11x10(n),
  // Moldova, the IDNO: weights 7 3 1 repeating, the sum mod 10.
  'md-idno': (n) => weighted(n, [7, 3, 1, 7, 3, 1, 7, 3, 1, 7, 3, 1]) % 10 === digits(n)[12],
  // Ukraine, the ЄДРПОУ: the weights depend on the range, with a second pass for a remainder of 10.
  'ua-edrpou': (n) => {
    const d = digits(n);
    const value = Number(n);
    const base = value < 30000000 || value > 60000000 ? [1, 2, 3, 4, 5, 6, 7] : [7, 1, 2, 3, 4, 5, 6];
    let r = weighted(n, base) % 11;
    if (r === 10) r = weighted(n, base.map((w) => w + 2)) % 11;
    if (r === 10) r = 0;
    return r === d[7];
  },
  // Belarus, the УНП: weights 29 23 19 17 13 7 5 3, the remainder is the check, 10 never issued; letters stand for digits.
  'by-unp': (n) => {
    const first = { A: 10, B: 11, C: 12, E: 14, H: 17, K: 20, M: 22 };
    const second = 'ABCEHKMOPT';
    const values = [...n].map((c, i) => {
      if (/[0-9]/.test(c)) return Number(c);
      return i === 0 ? first[c] : second.indexOf(c);
    });
    if (values.some((v) => v === undefined || v < 0)) return false;
    const r = [29, 23, 19, 17, 13, 7, 5, 3].reduce((acc, w, i) => acc + w * values[i], 0) % 11;
    return r < 10 && r === values[8];
  },
  // Russia, the ten-digit ИНН: weights 2 4 10 3 5 9 4 6 8, mod 11, mod 10.
  'ru-inn': (n) => weighted(n, [2, 4, 10, 3, 5, 9, 4, 6, 8]) % 11 % 10 === digits(n)[9],
  // Russia, the ОГРН: the first twelve digits mod 11, its last digit.
  'ru-ogrn': (n) => Number(BigInt(n.slice(0, 12)) % 11n) % 10 === digits(n)[12],
  // Azerbaijan, the VÖEN: weights 4 1 8 6 2 7 5 3, the remainder is the ninth digit, 10 never issued.
  'az-voen': (n) => {
    const r = weighted(n, [4, 1, 8, 6, 2, 7, 5, 3]) % 11;
    return r < 10 && r === digits(n)[8];
  },
  // Mexico, the RFC: the characters valued, the first twelve weighted 13 down to 2, mod 11, A for 10.
  'mx-rfc': (n) => {
    const value = (c) => {
      if (/[0-9]/.test(c)) return Number(c);
      if (c === '&') return 24;
      if (c === 'Ñ') return 38;
      if (c === ' ') return 37;
      const i = c.charCodeAt(0) - 55;
      return c > 'N' ? i + 1 : i;
    };
    const s = n.length === 12 ? ` ${n}` : n;
    const sum = [...s.slice(0, 12)].reduce((acc, c, i) => acc + (13 - i) * value(c), 0);
    const r = sum % 11;
    const check = r === 0 ? '0' : 11 - r === 10 ? 'A' : String(11 - r);
    return check === s[12];
  },
  // Taiwan, the unified business number: weights 1 2 1 2 1 2 4 1, each product digit-summed, the total a multiple of 5 (the rule since 2023).
  'tw-ubn': (n) => {
    const d = digits(n);
    const weights = [1, 2, 1, 2, 1, 2, 4, 1];
    const parts = d.map((v, i) => {
      const p = v * weights[i];
      return Math.floor(p / 10) + (p % 10);
    });
    // 7 × 4 = 28 digit-sums to 10, which counts as 1 or as 0.
    if (d[6] === 7) parts[6] = 1;
    const total = parts.reduce((a, b) => a + b, 0);
    return total % 5 === 0 || (d[6] === 7 && (total - 1) % 5 === 0);
  },
  // Japan, the corporate number: the check digit first, 9 minus the alternately weighted sum of the other twelve mod 9.
  'jp-corp': (n) => {
    const d = digits(n.replace(/^T/, ''));
    const base = d.slice(1);
    const sum = base.reduce((acc, v, i) => acc + v * ((base.length - i) % 2 === 1 ? 1 : 2), 0);
    return 9 - (sum % 9) === d[0];
  },
  // South Korea, the business registration number: weights 1 3 7 1 3 7 1 3 5, plus the tens of five times the ninth digit.
  'kr-brn': (n) => {
    const d = digits(n);
    const s = weighted(n, [1, 3, 7, 1, 3, 7, 1, 3, 5]) + Math.floor((5 * d[8]) / 10);
    return (10 - (s % 10)) % 10 === d[9];
  },
  // South Korea, the corporate registration number: alternate weights 1 and 2 over twelve digits (observed).
  'kr-corp': (n) => {
    const d = digits(n);
    const s = d.slice(0, 12).reduce((acc, v, i) => acc + v * (i % 2 === 0 ? 1 : 2), 0);
    return (10 - (s % 10)) % 10 === d[12];
  },
  // Australia, the ABN: 1 off the first digit, weights 10 1 3 5 7 9 11 13 15 17 19, a multiple of 89.
  'au-abn': (n) => {
    const d = digits(n);
    d[0] -= 1;
    return d.reduce((acc, v, i) => acc + v * [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19][i], 0) % 89 === 0;
  },
  // Australia, the ACN: weights 8 to 1, the check 10 minus the remainder, 0 for 10.
  'au-acn': (n) => (10 - (weighted(n, [8, 7, 6, 5, 4, 3, 2, 1]) % 10)) % 10 === digits(n)[8],
  // France, the SIRET: Luhn, except La Poste's establishments, whose digit sum is a multiple of 5.
  'fr-siret': (n) => {
    if (n.startsWith('356000000') && n !== '35600000000048') return digits(n).reduce((a, b) => a + b, 0) % 5 === 0;
    return luhn(n) && luhn(n.slice(0, 9));
  },
  // France and Monaco, the VAT key: 12 plus three times the nine digits mod 97, mod 97.
  'fr-tva': (n) => {
    const key = n.slice(2, 4);
    const siren = n.slice(4);
    if (/^[0-9]{2}$/.test(key)) return (12 + 3 * (Number(siren) % 97)) % 97 === Number(key);
    const alphabet = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    const k1 = alphabet.indexOf(key[0]);
    const k2 = alphabet.indexOf(key[1]);
    if (k1 < 0 || k2 < 0) return false;
    const c = /[0-9]/.test(key[0]) ? k1 * 24 + k2 - 10 : k1 * 34 + k2 - 100;
    return (Number(siren) + 1 + Math.floor(c / 11)) % 11 === c % 11;
  },
  // Canada, the business number: Luhn over nine digits.
  'ca-bn': (n) => luhn(n.slice(0, 9)),
  // The legal entity identifier: MOD 97-10 over the twenty characters.
  lei: mod97x10,
};

/**
 * Runs the named check on a normalised number.
 * @param {string} name a key of CHECKS
 * @param {string} value
 * @returns {boolean} true also for an unknown check, so a profile without one never refuses a number
 */
export function runCheck(name, value) {
  const fn = CHECKS[name];
  if (!fn) return true;
  try {
    return fn(value);
  } catch {
    return false;
  }
}
