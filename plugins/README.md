# Plugins

An Urd plugin is a folder here with a manifest (`plugin.json`) and an ES module (`index.js`) that exports `register(Urd)`. Plugins use the same define APIs as the core (blocks, section presets, backgrounds, animations, templates) and are bound by the same migration contract: a plugin update can never break existing content.

The active plugins are listed in [`plugins.json`](plugins.json) (static hosts cannot list folders, hence an index file). The admin handles the list for you: the Plugins panel shows the folders here automatically (through the publishing layer, or the last known list), and switching a plugin on or off is published as an ordinary change.

Urd ships one plugin: the Swedish language pack [`lang-sv/`](lang-sv/), which is the example of a language pack (see below). Calendar, form, map and visitor measurement were reference plugins up to and including 0.7.3, and are core blocks and a site setting from milestone 0.7.18 (24 September 2026); the patterns they showed are described below, with the core's code to read.

## Developing a plugin locally

1. Start the local server from the site's folder (`python3 dev-server.py`; in the Urd repo, from the repo root) and open `http://localhost:8000/admin/`. It sends nothing that can be cached, so an ordinary reload always loads the newest code of your plugin; an ordinary static server lets the browser keep old files until its cache is emptied.
2. Put your folder here (`plugins/<your-id>/` with `plugin.json` and `index.js`).
3. Switch it on in the Plugins panel (type the folder name if the panel cannot list folders locally). The preview loads the plugin from the DRAFT, so you see your blocks live without publishing.
4. Manifest errors, engine version requirements and `provides` mismatches are logged in the browser console and shown in the panel.

Manifest requirements: `requiresEngine` (a semver range against the engine version in urd.json; a bound with more than three numbers is read by engines from 0.7.7), `provides` (what the plugin defines), and optionally `csp` (the external origins the plugin needs; see ADR-0006: `_headers` is never changed automatically, and the admin shows the owner what has to be added). `entry` and `provides` are optional for pure language packs, which have no code (see below).

**Sharing the plugin:** put it in a public GitHub repo of its own and give it the GitHub topic `urd-plugin`, so it can be found by topic search (templates shared as a repo use `urd-template`). Users install it by copying the folder into `plugins/` and switching it on in the Plugins panel.

## Several languages (ADR-0012)

Set `"locales": true` in the manifest and put `locales/{nb,nn,en-GB,se,tr}.js` in the plugin folder, in the same form as the engine's locale files:

```js
// plugins/<id>/locales/nb.js
export default { lang: 'nb', strings: { '<id>.key': 'Tekst', '<id>.edit.key': 'Panel-tekst' } };
```

- **The keys are prefixed with the plugin id** (`calendar.*`); editor and config panel keys go under `<id>.edit.*`. One `strings` object per file.
- **nb is the base**: the loader puts nb at the bottom and the chosen language on top, so a missing key falls back to bokmål. The parity test (`node --test tests/i18n.test.mjs`) finds the `locales/` folder by itself and requires complete key sets in the core languages nb, en-GB and tr, no empty values, no em dash and the same `{var}` tokens; nn and se may lag behind (they are filled in translation rounds), but never with unknown keys.
- **Lookups**: `import { t, ta } from '/assets/urd/i18n.js'`: `t()` for visitor texts (the site language), `ta()` for the editor chrome (the admin language). `/assets/urd/` is the STABLE plugin API (ADR-0013): the engine itself lives in a versioned folder (`/assets/engine/<version>/`) that is swapped at every Urd release, so never hard-code the versioned path in a plugin. Call them ONLY in render and factory functions, never at module level (the module can be evaluated before the dictionary has loaded); tables at module level hold key NAMES, and block and preset definitions use the additive fields `labelKey` and `hintKey` (keep `label` and `hint` as the fallback).
- **The seed rule**: text that is WRITTEN INTO user data (field defaults, preset content) is translated ONCE on insertion with the admin language, through `ta()` inside the body of `defaults()` or `create()`, never when existing data is rendered.
- `"names": {"nb": "Kalender", "en-GB": "Calendar", …}` in the manifest gives the Plugins panel and the «From the plugin …» texts a display name per admin language (`name` is the fallback).

## Language packs: a plugin that is ONLY a language

A language Urd does not have built in is made as a plugin without code. `lang-sv` is the reference (Swedish for both the visitor side and the admin side):

```json
// plugins/lang-sv/plugin.json: no entry, no provides
{
  "id": "lang-sv",
  "name": "Swedish language pack",
  "names": { "nb": "Svensk språkpakke", "en-GB": "Swedish language pack", "tr": "İsveççe dil paketi" },
  "version": "1.0.0",
  "requiresEngine": ">=0.6.8 <1.0.0",
  "languages": [{ "code": "sv", "name": "Svenska", "site": true, "admin": true }]
}
```

```
plugins/lang-sv/locales/site/sv.js     the visitor texts (t())
plugins/lang-sv/locales/admin/sv.js    the admin chrome (ta())
```

- **The files have the same form and keys as the engine's own** locale files: copy the engine's `locales/site/nb.js` or `.../admin/nb.js` and translate the values. The keys never change.
- **`site` and `admin` are independent.** A pack can cover the visitor side, the admin chrome or both; the fields say what you actually deliver, and only what is promised is asked for.
- **The bokmål base lies underneath**, so a partial pack works: keys you have not translated show in bokmål instead of disappearing. The parity test therefore does not require a full set for packs, but it catches keys that do not exist in the base (typos that would never show).
- **Built-in languages cannot be overridden** (`nb`, `nn`, `en-GB`, `se`, `tr`): a plugin must not be able to hijack bokmål. To improve one of them, edit the engine's own locale file (see [CONTRIBUTING.md](../../CONTRIBUTING.md)).
- **The language becomes available when the pack is switched on** in the Plugins panel. The visitor language (the Site panel) follows the draft at once; the admin language picker offers the pack after publishing, since the admin reads the published plugin list when it starts.
- **Dates, plurals and relative time need no translation**: they go through `Intl` with your language code, as long as the browser has CLDR data for it.

**The help chip rule (ADR-0008)**: if your block has special functions (panels of its own, conventions in the content, automation), it MUST have a «?» chip that explains them. Use the shared helper, in the preview only:

```js
if (ctx.preview) {
  import('/assets/urd/hint.js').then(({ attachHint }) => {
    attachHint(host, { title: 'My block', lines: ['Function 1 …', 'Function 2 …'] });
  });
}
```

Plugin blocks and section templates show up by themselves in «Plugins» sections of their own in «+ New block», «+ New section» and the Blocks panel. A block definition can also have `variants: [{ label, props }, …]`: it then becomes a fold-out menu in the block menus (the core's calendar block uses it for its views).

Blocks whose content decides their height (like the calendar, the form and the map in the core) set `autoGrow: true` on the block definition: the block then gets its natural height in the phone view's automatic stacking instead of the fixed desktop height, so taller content on a phone is never clipped. `autoGrow` can also be a function of the block's props, for a block that grows in some views and fills its frame in others (the core's gallery grows as a grid and keeps the frame's height as a strip). On desktop the engine's push pass owns the box's height (ADR-0024): a plugin block does not need to measure itself, and must never write a measured height into its frame.

**Settings in Properties (the field contract)**: if your block has simple settings (text, number, on/off, choice, place), declare them as `fields` on the block definition instead of building a config panel of your own; the admin renders them straight in the Properties panel when the block is selected:

```js
Urd.blocks.define('venue', {
  // …
  fields: [
    { key: 'location', type: 'place', labelKey: 'venue.edit.location', placeholderKey: 'venue.edit.locationPh' },
    { key: 'zoom', type: 'number', labelKey: 'venue.edit.zoom', min: 1, max: 19 },
  ],
});
```

The types are `text`, `number` (`min`, `max`, `step`), `toggle`, `select` (`options: [{ value, labelKey }]`), `place` (a place search: the text is written to `key`, the coordinates to the props `lat` and `lon`; the core's map block uses the same field) and `link` (the same link field and link dialog as the core's blocks: a page or a spot on it, a web address, an email or a phone number; the link is written to `key`, and `null` when it is removed). A `link` is drawn with the resolver from `/assets/urd/links.js`, so the link follows a page's new address and a spot's new name, and an unsafe address never becomes a live link:

```js
import { resolveLink, linkAttrs } from '/assets/urd/links.js';

Urd.blocks.define('venue', {
  // …
  fields: [{ key: 'more', type: 'link', labelKey: 'venue.edit.more' }],
  render(el, props, ctx) {
    const a = document.createElement('a');
    a.textContent = props.title;
    Object.assign(a, linkAttrs(resolveLink(props.more ?? {}, ctx.site.pages ?? [])));
    el.appendChild(a);
  },
});
```

The engine resolves the label keys before they are sent to the admin, so use a `labelKey` from the plugin's own dictionary. A field can also have a help text, `hintKey` (or `hint`), shown as the field's «?» tooltip; without it the tooltip shows the field's label. Without `fields`, Properties shows a «Settings …» button that opens the plugin's own config panel in the preview (the reference plugins calendar and form showed that pattern up to and including v0.7.3; it suits settings that are more than a flat list of fields, such as a list of sources). The contract is described in [docs/SCHEMA.md](../../docs/SCHEMA.md#plugins).

**Designs (the design contract)**: if your block has several looks, declare them as `designs` on the block definition. The menu then gets the same Design row, quick tile and design picker as the core's blocks, with a picture and a live preview of the owner's own block in each design:

```js
Urd.blocks.define('venue', {
  // …
  designs: {
    prop: 'variant',
    items: [
      { id: 'card', labelKey: 'venue.design.card', aboutKey: 'venue.design.card.about', picture: '/plugins/venue/designs/card.webp' },
      { id: 'band', labelKey: 'venue.design.band', aboutKey: 'venue.design.band.about', picture: '/plugins/venue/designs/band.webp' },
    ],
  },
});
```

`prop` is the prop the block keeps its design in, and `id` is the value written there. The engine resolves the labels and the descriptions as it does the fields'. The picture is optional and must be an image file on the site itself (a path from the root); without a picture the tile shows the name. Fewer than two designs is no choice.

**The themed UI rule (ADR-0009)**: never a native `<select>` in editing UI, since its popup follows the operating system's theme and becomes unreadable. Use `createDropdown` from `/assets/urd/dropdown.js`, or segment buttons for small sets of choices. Its options are `[value, label]`, and an option may carry a fourth entry, a face `{ font, sample? }`, which draws the label in that font (a list of typefaces), or keeps the UI font for the label and draws `sample` beside it in the face.

## The patterns, with the core's code to read

The contract is described in [docs/SCHEMA.md](../../docs/SCHEMA.md#plugins). The whole form (a manifest with `provides`, a block with a version and migrations, a section preset, CSS of its own through one style tag, editing in the preview through `urd-edit`, pure logic in a module of its own with contract tests) stood in the reference plugins calendar, form and map up to and including Urd 0.7.3; their code is in the git history (the tag v0.7.3, `template/plugins/`). From 0.7.18 they are core blocks, and the engine's files show the same patterns:

- **Calendar** (`assets/engine/<version>/blocks/calendar.js` and `ics.js`): `variants` for the views, fetching through the site's own proxy `/api/ics` (so no CSP exception), a pure parser in a module of its own with tests, and sample data in the preview while sources are missing. The settings (the list of sources, the view, the count) are edited in the Properties panel; as a plugin (up to and including v0.7.3) it had a config panel of its own in the preview, the pattern for settings that are more than a flat list of fields.
- **Form** (`blocks/form.js` and `form-model.js`): real form rendering, visitor input that never becomes HTML, `mailto` as the zero setup with an optional endpoint through `fetch` (which needs `connect-src` in `_headers`), a honeypot against bots, and a calm fallback when the endpoint is blocked.
- **Map** (`blocks/map.js` and `osm.js`): the field contract (`fields`) for simple settings straight in Properties, an iframe to OpenStreetMap, and a CSP sentry that explains which `frame-src` line is missing if a host blocks the map (Urd's own `_headers` allows it).

One difference applies to a plugin: the core's blocks import `../i18n.js`, `../hint.js`, `../dropdown.js` and `../nav-model.js` directly, while a plugin ALWAYS imports from `/assets/urd/` (the engine folder is swapped at every release, ADR-0013). Visitor measurement (Cloudflare Web Analytics) was a reference plugin as well; it is now the site setting «Visitor measurement» behind the gear in the admin.

## A command in the editor's palette

The editor's command palette (Ctrl/⌘+K) lists what a plugin registers through `Urd.commands`, under a «Plugins» heading, and runs it in the preview where the plugin's code lives:

```js
export function register(Urd) {
  Urd.commands.define('venue-refresh', {
    labelKey: 'venue.refresh', // or label: 'Refresh the venues'
    run({ Urd, page, site }) { /* what the command does in the preview */ },
  });
}
```

The label goes through the plugin's own admin dictionary (`labelKey`), with `label` as the English fallback. The palette reports the list when the plugins load, so a command defined later in the session shows after the next reload.
