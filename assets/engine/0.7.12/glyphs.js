/**
 * The glyph picker's categories and recents, shared by the admin's GlyphPicker and the text bar's glyph menu under one localStorage key.
 */

export const GLYPH_RECENT_KEY = 'urd-recent-glyphs';

export const GLYPH_RECENT_MAX = 16;

/** The recents list of the drawn icons (icon ids from icons.js), kept apart from the glyphs. */
export const ICON_RECENT_KEY = 'urd-recent-icons';

/**
 * Each category's name key and its glyphs, space-separated.
 * @type {Array<[string, string]>}
 */
export const GLYPH_CATEGORIES = [
  ['glyphCat.symbols', '★ ☆ ✦ ✧ ✩ ✪ ✫ ✭ ✮ ✯ ✵ ✳ ✴ ❖ ❋ ✿ ❀ ❁ ✾ ❃ ☘ ◆ ◇ ● ○ ◎ ■ □ ▣ ▲ △ ▼ ▽ ⬡ ⬢ ♦ ♠ ♣ ♥ ♡ ✓ ✔ ✕ ✖ ✗ ✘ ✚ ✜ ☀ ☾ ♪ ♫ ♬ ☮ ☯ ⚜ ⚓ ⚡ ☂ ✂ ✏ ✒ ✉ ☎ ⌛ ⏳ ♻ ⚠ ☑ ⚙ § © ® ™ ° ± × ÷ ∞ ≈ ≠ ≤ ≥ € £ ¥ • ‣ ⁂'],
  ['glyphCat.arrows', '→ ← ↑ ↓ ↔ ↕ ↗ ↘ ↙ ↖ ⇒ ⇐ ⇑ ⇓ ⇔ ➜ ➤ ➔ ↩ ↪ ⤴ ⤵ ↺ ↻ ⟲ ⟳ « » ‹ ›'],
  ['glyphCat.smileys', '😀 😃 😄 😁 😆 😅 😂 🙂 😉 😊 😇 🥰 😍 🤩 😘 😋 😜 🤪 😎 🥳 😏 😌 😴 🤔 🤗 🤭 🙃 😢 😭 😤 😡 🤯 😱 🥺 😬 🤓 🫠 🫡 🫶'],
  ['glyphCat.people', '👍 👎 👏 🙌 🤝 👋 ✌ 🤘 🤞 💪 🙏 👀 🧠 👶 🧒 🧑 🧓 👥 👤 🗣 🏃 🚶 🧍 💃 🕺 🧑‍🤝‍🧑'],
  ['glyphCat.nature', '🌞 🌝 🌙 ⭐ 🌟 ✨ ☁ 🌈 🔥 💧 🌊 ❄ ⛄ 🌸 🌼 🌻 🌹 🌷 🌱 🌲 🌳 🍀 🍁 🍂 🐝 🦋 🐶 🐱 🐦 🦉 🐟 🐢 🌍 🏔 🏕'],
  ['glyphCat.food', '☕ 🍵 🥤 🍺 🍷 🥂 🍰 🎂 🧁 🍪 🍩 🍕 🌮 🍔 🍟 🥗 🍎 🍊 🍋 🍇 🍓 🫐 🥕 🌽 🍞 🥐 🧀 🍿 🍦 🍫'],
  ['glyphCat.activity', '⚽ 🏀 🏐 🎾 🏓 🏸 ⛷ 🏂 🚴 🏊 🎮 🎲 ♟ 🎯 🎳 🎣 🥾 ⛺ 🎪 🎭 🎨 🎬 🎤 🎧 🎸 🎹 🥁 🎻 📚 ✈ 🚗 🚲 ⛵ 🚀 🏋 🧘'],
  ['glyphCat.objects', '💡 🔔 📣 📢 📌 📍 📅 ⏰ 🔑 🔒 🔓 🛠 🔧 🔨 🧰 📦 📫 📧 📱 💻 🖥 🖨 📷 📸 🎥 📺 🔍 🔎 📎 📏 📐 📝 📄 📋 📁 💾 🧾 💰 💳 🪙 🎁 🎈 🎉 🎊 🏆 🥇 🥈 🥉 🏅 🚩 🏁 🔗 🧭 🗺 🧲 🧪 🔬 🔭 💊 🩺 🛡 🕯 🪧 🖼'],
  ['glyphCat.hearts', '❤ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 💗 💓 💕 💖 💘 💝 💞 💟'],
];

/** What an emoji is drawn with: emoji-presented characters, U+FE0F requests, pictographs above the basic plane, and the parts that build a sequence. */
const EMOJI_PARTS = /\p{Emoji_Presentation}|[^️]️|(?=\p{Extended_Pictographic})[\u{10000}-\u{10FFFF}]|\p{Emoji_Modifier}|\p{Regional_Indicator}|[‍︎️⃣\u{E0020}-\u{E007F}]/gu;

/**
 * Whether a glyph takes a colour: true when it holds a character drawn as text (★ ♥ →), false for emoji alone, by each character's default presentation.
 * @param {string} glyph
 * @returns {boolean}
 */
export function glyphTakesColour(glyph) {
  return typeof glyph === 'string' && glyph.replace(EMOJI_PARTS, '').trim() !== '';
}

/**
 * Puts a chosen glyph at the front of the recents list: no duplicates, capped.
 * Pure function (the list logic is tested without localStorage).
 * @param {string[]} recent
 * @param {string} glyph
 * @returns {string[]}
 */
export function pushRecentGlyph(recent, glyph) {
  const list = Array.isArray(recent) ? recent : [];
  return [glyph, ...list.filter((g) => g !== glyph)].slice(0, GLYPH_RECENT_MAX);
}

const readList = (key) => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveList = (key, recent, value) => {
  const next = pushRecentGlyph(recent, value);
  try {
    localStorage.setItem(key, JSON.stringify(next));
  } catch { /* full or unavailable storage must never break editing */ }
  return next;
};

/** Reads the recents list from localStorage; broken content gives an empty list. */
export function readRecentGlyphs() {
  return readList(GLYPH_RECENT_KEY);
}

/** Stores a chosen glyph in the recents list and returns the new list. */
export function saveRecentGlyph(glyph) {
  return saveList(GLYPH_RECENT_KEY, readRecentGlyphs(), glyph);
}

/** Reads the recent icon ids; unavailable storage gives an empty list. */
export function readRecentIcons() {
  return readList(ICON_RECENT_KEY);
}

/** Stores a chosen icon id at the front of the icon recents and returns the new list. */
export function saveRecentIcon(id) {
  return saveList(ICON_RECENT_KEY, readRecentIcons(), id);
}
