/**
 * Editeringslaget for preview-modus: dra, resize (med grid-snapping) og
 * slett direkte i den ekte siden inne i editorens iframe.
 *
 * Lastes KUN i preview-modus (dynamisk import i urd.js) - besøkende
 * laster aldri denne filen. Endringer meldes til editoren, som eier
 * utkastet:
 *   side → editor: { type: 'urd-move',   sectionId, blockId, frame, frameKey }
 *                  { type: 'urd-delete', sectionId, blockId | blockIds }  (blockIds: multiutvalg i ett angre-steg)
 *                  { type: 'urd-add-section', index, section }
 *                  { type: 'urd-move-section', sectionId, dir }
 *                  { type: 'urd-delete-section', sectionId }
 *                  { type: 'urd-section-size', sectionId, minHeight, moves? }  (moves: toppkant-håndtaket flytter alle blokkene i samme angre-steg)
 *                  { type: 'urd-mobile-manual', sectionId, frames }  (seksjon materialisert)
 *                  { type: 'urd-mobile-auto', sectionId }            (tilbake til auto)
 *                  { type: 'urd-review-done', sectionId }            (mobil gjennomgått)
 *                  { type: 'urd-block-flag', sectionId, blockId, decor }
 *                  { type: 'urd-block-menu', sectionId, blockId, rect }  (åpne blokkmenyen i editoren)
 */
import { frameToCss } from './render.js';
import { makeId } from './sections/presets.js';
import { presetThumb } from './preset-thumb.js';
import { openImageEditor, closeImageEditor } from './image-editor.js';
import { applyImageStyle } from './blocks/image.js';
import { openColorPicker, closeColorPicker } from './color-picker.js';
import { createDropdown, closeDropdowns } from './dropdown.js';
import { GLYPH_CATEGORIES, readRecentGlyphs, saveRecentGlyph } from './glyphs.js';
import { FONT_STACKS } from './fonts.js';
import { SIZE_MIN, SIZE_MAX, clampSize, stepSize, LINE_HEIGHTS, stepIndent, matchFontStack } from './text-typo.js';
import { frameAtPoint } from './place.js';
import { topDrag } from './section-size.js';
import { blocksInRect, alignMoves, distributeMoves, groupDelta } from './selection.js';
// Modulen lastes dynamisk av urd.js ETTER at admin-ordboka er lastet
// (initAdminLocale), så ta() er trygg også på modulnivå her.
import { ta } from './i18n.js';

/** Mobilvisning? Motoren setter body-klassen ut fra breakpointet. */
const isMobile = () => document.body.classList.contains('urd-mobile');

/** Lukker åpne menyer (preset-galleri, blokkmeny). Kalles også via urd-close-menus når eieren klikker i admin-panelene, som iframens egne klikk-lyttere aldri ser. */
let collapseOpenPresetMenu = null;
export function closeMenus() {
  collapseOpenPresetMenu?.();
  collapseOpenPresetMenu = null;
  closeImageEditor();
  closeColorPicker();
  closeDropdowns();
  document.querySelectorAll('.urd-add-block-menu.open').forEach((m) => {
    const wrap = m.closest('.urd-add-block');
    if (wrap) resetBlockAdder(wrap);
  });
}

/**
 * Kobler editeringshåndtak på alle blokkene i en rendret seksjon.
 * Kalles av render.js etter hver (re)rendering i preview-modus.
 *
 * @param {HTMLElement} host Seksjonselementet
 * @param {object} section Seksjonsdata
 * @param {{columns: number, rowHeight: number}} grid Effektivt grid
 */
export function enhanceSection(host, section, grid) {
  for (const el of host.querySelectorAll('.urd-block')) {
    const block = section.blocks.find((b) => b.id === el.dataset.blockId);
    if (block) enhanceBlock(el, block, section, grid, host);
  }
  // Markeringen skal overleve rerendringer (f.eks. endringer fra
  // Egenskaper-panelet, som rerendrer hele seksjonen).
  if (selectedBlockId) {
    host.querySelector(`.urd-block[data-block-id="${selectedBlockId}"]`)?.classList.add('urd-selected');
  }
  // Multimarkeringen likeså (inkl. et nettopp innlimt utvalg, der
  // id-ene ble satt FØR rerendringen fant elementene).
  if (multiIds.size && host.dataset.sectionId === multiSectionId) {
    for (const id of multiIds) {
      host.querySelector(`.urd-block[data-block-id="${CSS.escape(id)}"]`)?.classList.add('urd-multi-selected');
    }
    updateMultiToolbar();
  }
  addSectionToolbar(host, section, grid);
  // Strukturendring (seksjonshøyde) hører til desktopvisningen.
  if (!isMobile()) {
    addSectionHeightHandle(host, section, grid);
    addSectionTopHandle(host, section, grid);
    addBlockAdder(host, section, grid);
  }
  // Vedvarende grid-visning (grid-menyen i editoren er åpen) skal
  // overleve rerendringer av seksjonen.
  if (gridOverlaysOn) showGridOverlay(host, grid).classList.add('urd-grid-persistent');
  // Hjelpelinjene likeså (re-render fjerner overlegg-elementene).
  if (guideOverlaysOn) addGuideOverlays(host);
}

/**
 * Plasserer en ny blokk fra editorens palett midt i brukerens synsfelt:
 * i den aktive seksjonen, ellers seksjonen nærmest midten av viewporten.
 * Iframen vet hvor brukeren har scrollet; det gjør ikke editoren.
 */
export function placeBlock(block, root) {
  let host = root.querySelector('.urd-section-active');
  if (!host) {
    let best = null;
    let bestDist = Infinity;
    for (const el of root.querySelectorAll('.urd-section')) {
      const r = el.getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= window.innerHeight) continue;
      const dist = Math.abs(r.top + r.height / 2 - window.innerHeight / 2);
      if (dist < bestDist) { best = el; bestDist = dist; }
    }
    host = best ?? root.querySelector('.urd-section');
  }
  if (!host) return;

  const rect = host.getBoundingClientRect();
  const visibleTop = Math.max(0, -rect.top);
  const visibleBottom = Math.max(visibleTop, Math.min(rect.height, window.innerHeight - rect.top));
  const frame = block.frames.desktop;
  frame.y = Math.max(8, Math.round((visibleTop + visibleBottom) / 2 - frame.h / 2));
  frame.x = Math.round(((100 - frame.w) / 2) * 100) / 100;

  post({ type: 'urd-add-block', sectionId: host.dataset.sectionId, block });
  // Den nye blokken markeres med en gang (samme mønster som dupliser):
  // rerendringen etter urd-add-block leser selectedBlockId, editoren
  // følger etter via urd-select-block, og Ctrl+D/piltaster virker
  // uten et ekstra klikk først (testfunn 23. juli 2026).
  document.querySelectorAll('.urd-block.urd-selected').forEach((b) => b.classList.remove('urd-selected'));
  selectedBlockId = block.id;
  post({ type: 'urd-select-block', sectionId: host.dataset.sectionId, blockId: block.id });
}

/**
 * Spiller en inngangsanimasjon på nytt (demo når editoren endrer den):
 * snapp tilbake til starttilstanden uten transition, og gli inn igjen.
 */
export function demoAnimation(el) {
  if (!el) return;
  const entrance = ['urd-anim-fade-in', 'urd-anim-slide-up', 'urd-anim-zoom-in']
    .some((c) => el.classList.contains(c));
  if (!entrance) return;
  el.style.transition = 'none';
  el.classList.remove('urd-anim-in');
  void el.offsetWidth; // tving reflow så starttilstanden faktisk settes
  el.style.transition = '';
  requestAnimationFrame(() => el.classList.add('urd-anim-in'));
}

/** Om vedvarende grid-visning er på (styrt av editorens grid-meny). */
let gridOverlaysOn = false;

/**
 * Slår grid-visning i alle seksjoner av/på. Brukes mens grid-menyen i
 * editoren er åpen, så innstillingsendringer ses umiddelbart.
 */
export function toggleGridOverlays(visible, page, site) {
  gridOverlaysOn = visible;
  document.querySelectorAll('.urd-grid-persistent').forEach((el) => el.remove());
  if (!visible || !page || !site) return;
  for (const host of document.querySelectorAll('.urd-section')) {
    const section = page.sections.find((s) => s.id === host.dataset.sectionId);
    if (!section) continue;
    showGridOverlay(host, section.grid ?? site.grid).classList.add('urd-grid-persistent');
  }
}

/** Om hjelpelinjene er på (styrt av editorens topplinje-knapp). */
let guideOverlaysOn = false;

/**
 * Alltid synlige hjelpelinjer for hele siden: sidens vertikale senter,
 * hver seksjons horisontale senter, og innholdsbredde-linjene på
 * 4 %/96 % (palettens og presetenes standardmarg). Stiplet, i motsetning
 * til de heltrukne smarte linjene som kun vises under dra. Kun editor-
 * chrome: skjules i Ren visning og finnes aldri hos besøkende.
 */
export function toggleGuideOverlays(visible) {
  guideOverlaysOn = visible;
  document.querySelectorAll('.urd-page-guide').forEach((el) => el.remove());
  if (!visible) return;
  document.querySelectorAll('.urd-section').forEach((host) => addGuideOverlays(host));
}

function addGuideOverlays(host) {
  const line = (cls, style) => {
    const el = document.createElement('div');
    el.className = `urd-page-guide ${cls}`;
    el.style.cssText = style;
    host.appendChild(el);
  };
  line('urd-page-guide-v', 'left:50%;');
  line('urd-page-guide-v', 'left:4%;');
  line('urd-page-guide-v', 'left:96%;');
  line('urd-page-guide-h', 'top:50%;');
}

/**
 * Felles høyde-dra: flytter seksjonens underkant (size.minHeight), snappet
 * til gridet. Brukes av håndtaket i seksjonens underkant OG av «+ Ny
 * seksjon»-baren (som ligger på samme grense). Lagres i px (rerender kan
 * fortsatt vokse seksjonen hvis blokkene trenger mer, se render.js).
 *
 * Draget starter først etter en liten terskel, slik at target også kan
 * være en klikkbar knapp; opts.onDragged kalles da (før knappens click),
 * så klikket kan undertrykkes.
 */
/**
 * Retningsvisende peker under seksjonshøyde-drag: pil ned når man drar
 * ned, pil opp når man drar opp (CSS-klassene i base.css overstyrer alt
 * med !important, siden pekeren ellers følger elementet under den).
 * Liten terskel mot dirring; retningen beholdes til den faktisk snur.
 */
function dragCursor() {
  let lastY = null;
  return {
    move(clientY) {
      if (lastY === null) {
        lastY = clientY;
        return;
      }
      if (Math.abs(clientY - lastY) < 2) return;
      const down = clientY > lastY;
      lastY = clientY;
      document.documentElement.classList.toggle('urd-drag-down', down);
      document.documentElement.classList.toggle('urd-drag-up', !down);
    },
    clear() {
      document.documentElement.classList.remove('urd-drag-down', 'urd-drag-up');
    },
  };
}

function wireHeightDrag(target, host, section, grid, opts = {}) {
  target.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    target.setPointerCapture(event.pointerId);
    const startY = event.clientY;
    const startHeight = host.getBoundingClientRect().height;
    const cursor = dragCursor();
    let px = startHeight;
    let moved = false;

    const onMove = (ev) => {
      if (!moved && Math.abs(ev.clientY - startY) < 4) return;
      moved = true;
      cursor.move(ev.clientY);
      px = Math.max(grid.size * 3, startHeight + (ev.clientY - startY));
      // Piksel-presist når snap er av eller Shift holdes inne.
      const free = grid.snap === false || ev.shiftKey;
      px = free ? Math.round(px) : Math.round(px / grid.size) * grid.size;
      host.style.minHeight = `${px}px`;
    };
    const onUp = () => {
      target.removeEventListener('pointermove', onMove);
      target.removeEventListener('pointerup', onUp);
      cursor.clear();
      if (!moved) return;
      opts.onDragged?.();
      if (Math.abs(px - startHeight) < 2) return;
      const minHeight = `${px}px`;
      section.size = { ...section.size, minHeight };
      post({ type: 'urd-section-size', sectionId: section.id, minHeight });
    };
    target.addEventListener('pointermove', onMove);
    target.addEventListener('pointerup', onUp);
  });
}

/**
 * «+ Legg til blokk» nederst i seksjonen (vises ved hover): klikk åpner
 * en meny med alle blokktypene, og valget meldes til editoren, som
 * bygger blokken og legger den i akkurat denne seksjonen.
 */
const BLOCK_KINDS = [
  ['text', ta('blocks.text')], ['text-box', ta('ui.textBox')], ['button', ta('blocks.button')],
  ['image', ta('blocks.image')], ['video', ta('blocks.video')], ['icon', ta('blocks.icon')],
  ['samling', ta('blocks.samling')], ['galleri', ta('blocks.galleri')],
];

/** Formene bor i sin egen utfoldbare undermeny («Former») i + Ny blokk. */
const SHAPE_KINDS = [
  ['shape-line', ta('shape.line')], ['shape-arrow', ta('shape.arrow')], ['shape-circle', ta('shape.circle')],
  ['shape-rect', ta('shape.rect')], ['shape-triangle', ta('shape.triangle')],
];

/** Kjerneblokk-typene (paletten i editoren eier byggingen av disse). */
const CORE_BLOCK_TYPES = new Set(['text', 'image', 'button', 'shape', 'video', 'icon', 'samling', 'galleri']);

/**
 * Lukker en «+ Ny blokk»-meny og nullstiller dobbeltklikk-tilstanden:
 * chip-knappen tilbake i hjørnet, sideklemmingen av menyen fjernet.
 */
function resetBlockAdder(wrap) {
  wrap.classList.remove('urd-at-pointer');
  wrap.style.left = '';
  wrap.style.top = '';
  wrap.style.right = '';
  const menu = wrap.querySelector('.urd-add-block-menu');
  if (menu) {
    menu.classList.remove('open');
    menu.style.left = '';
    menu.style.right = '';
  }
}

/** Klikk hvor som helst utenfor en åpen blokkmeny lukker den. Én
 *  document-lytter for hele siden, koblet første gang en meny bygges. */
let blockMenuOutsideWired = false;
function wireBlockMenuOutsideClose() {
  if (blockMenuOutsideWired) return;
  blockMenuOutsideWired = true;
  document.addEventListener('pointerdown', (event) => {
    for (const menu of document.querySelectorAll('.urd-add-block-menu.open')) {
      const wrap = menu.closest('.urd-add-block');
      if (wrap && event.target instanceof Node && !wrap.contains(event.target)) resetBlockAdder(wrap);
    }
  }, true);
}

function addBlockAdder(host, section, grid) {
  wireBlockMenuOutsideClose();
  const wrap = document.createElement('div');
  wrap.className = 'urd-add-block';

  const openBtn = document.createElement('button');
  openBtn.className = 'urd-add-block-open';
  openBtn.textContent = ta('canvas.newBlock');

  const menu = document.createElement('div');
  menu.className = 'urd-add-block-menu';
  // Klikkpunktet (seksjonsrelativt: x i %, y i px) settes når menyen
  // åpnes med DOBBELTKLIKK på seksjonsflaten; da lander blokken der.
  // Åpnet fra knappen er punktet null, og editoren sentrerer som før.
  menu._urdAt = null;
  const kindButton = (parent, kind, label) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.addEventListener('click', () => {
      post({ type: 'urd-request-block', sectionId: section.id, kind, at: menu._urdAt ?? undefined });
      resetBlockAdder(wrap);
    });
    parent.appendChild(b);
  };
  for (const [kind, label] of BLOCK_KINDS) kindButton(menu, kind, label);

  // Formene i egen utfoldbar undermeny, så hovedmenyen holder seg kort.
  const shapesToggle = document.createElement('button');
  shapesToggle.className = 'urd-add-block-shapes-toggle';
  shapesToggle.textContent = `${ta('group.shapes')} ▾`;
  const shapes = document.createElement('div');
  shapes.className = 'urd-add-block-shapes';
  for (const [kind, label] of SHAPE_KINDS) kindButton(shapes, kind, label);
  shapesToggle.addEventListener('click', () => {
    const open = shapes.classList.toggle('open');
    shapesToggle.textContent = `${ta('group.shapes')} ${open ? '▴' : '▾'}`;
  });
  menu.append(shapesToggle, shapes);
  // Plugin-blokker: egen seksjon under det innebygde. Previewen har
  // registrene (og dermed defaults), så blokken bygges her og sendes ferdig.
  const pluginTypes = window.Urd.blocks.ids().filter((type) => !CORE_BLOCK_TYPES.has(type));
  if (pluginTypes.length) {
    const divider = document.createElement('div');
    divider.className = 'urd-add-block-plugins';
    divider.textContent = ta('panel.plugins');
    menu.appendChild(divider);
  }
  for (const type of pluginTypes) {
    const def = window.Urd.blocks.get(type);
    const title = typeof def.fromPlugin === 'string' ? ta('tip.blocks.fromPlugin', { plugin: def.fromPlugin }) : ta('tip.blocks.fromPluginGeneric');
    const buildAndPost = (extraProps = {}) => {
      // Åpnet med dobbeltklikk: plugin-blokken lander på klikkpunktet
      // (samme rene plassering som editoren bruker for kjerneblokkene).
      const w = 50;
      const h = 260;
      const pos = menu._urdAt
        ? frameAtPoint({ x: menu._urdAt.x, y: menu._urdAt.y, w, h, grid })
        : { x: 25, y: 40 };
      post({
        type: 'urd-add-block',
        sectionId: section.id,
        block: {
          id: makeId('blk'),
          type,
          version: def.version ?? 1,
          props: { ...(def.defaults ? def.defaults() : {}), ...extraProps },
          animation: null,
          frames: { desktop: { x: pos.x, y: pos.y, w, h, z: 1, rot: 0 }, mobile: null },
        },
      });
      resetBlockAdder(wrap);
    };
    // Blokker med variants (f.eks. kalenderens visninger) får en foldemeny som Former.
    if (Array.isArray(def.variants) && def.variants.length) {
      const toggle = document.createElement('button');
      toggle.className = 'urd-add-block-shapes-toggle';
      toggle.textContent = `${def.labelKey ? ta(def.labelKey) : (def.label ?? type)} ▾`;
      toggle.title = title;
      const sub = document.createElement('div');
      sub.className = 'urd-add-block-shapes';
      for (const variant of def.variants) {
        const b = document.createElement('button');
        b.textContent = variant.labelKey ? ta(variant.labelKey) : variant.label;
        b.addEventListener('click', () => buildAndPost(variant.props ?? {}));
        sub.appendChild(b);
      }
      toggle.addEventListener('click', () => {
        const open = sub.classList.toggle('open');
        toggle.textContent = `${def.labelKey ? ta(def.labelKey) : (def.label ?? type)} ${open ? '▴' : '▾'}`;
      });
      menu.append(toggle, sub);
      continue;
    }
    const b = document.createElement('button');
    b.textContent = def.labelKey ? ta(def.labelKey) : (def.label ?? type);
    b.title = title;
    b.addEventListener('click', () => buildAndPost());
    menu.appendChild(b);
  }
  openBtn.addEventListener('click', () => {
    // Fra knappen: nullstill ev. dobbeltklikk-plassering av menyen.
    const wasOpen = menu.classList.contains('open');
    menu._urdAt = null;
    resetBlockAdder(wrap);
    if (!wasOpen) menu.classList.add('open');
  });
  // enhanceSection kjører etter HVER rerender på samme host-element: lytterne legges kun én gang og slår opp gjeldende meny ved hendelsen, ellers hoper det seg opp én lytter per rerender.
  if (!host._urdAdderLeaveWired) {
    host._urdAdderLeaveWired = true;
    // Menyen lukkes IKKE når pekeren forlater seksjonen: den står til man
    // klikker utenfor (outside-pointerdown) eller velger en blokk. Ingen
    // mouseleave-lukking.
    // Dobbeltklikk på tom seksjonsflate åpner menyen VED PEKEREN, og
    // blokken lander på klikkpunktet (valgt adferd: «+ ny blokk der man
    // klikker»). Aldri i blokker (dobbeltklikk er ordmarkering/bilde-
    // editor der) eller på editeringshåndtak.
    host.addEventListener('dblclick', (event) => {
      if (isMobile()) return;
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (target.closest('.urd-block, .urd-add-block, .urd-add-section, .urd-section-toolbar, .urd-section-resize, .urd-section-resize-top, .urd-hint-chip, .urd-hint-card')) return;
      const curWrap = host.querySelector('.urd-add-block');
      const curMenu = curWrap?.querySelector('.urd-add-block-menu');
      if (!curWrap || !curMenu) return;
      const rect = host.getBoundingClientRect();
      curMenu._urdAt = {
        x: Math.round(((event.clientX - rect.left) / rect.width) * 10000) / 100,
        y: Math.round(event.clientY - rect.top),
      };
      curWrap.style.left = `${Math.round(event.clientX - rect.left)}px`;
      curWrap.style.top = `${Math.round(event.clientY - rect.top)}px`;
      curWrap.style.right = 'auto';
      // Ved pekeren vises menyen alene: chip-knappen skjules (CSS-en på
      // .urd-at-pointer), så det ikke står en «+ Ny blokk» over menyen.
      curWrap.classList.add('urd-at-pointer');
      curMenu.classList.add('open');
      // Menyen henger normalt mot venstre fra pekeren (right: 0). Nær
      // venstre kant ville den gått ut av skjermen: da åpnes den mot
      // høyre for pekeren i stedet.
      curMenu.style.left = '';
      curMenu.style.right = '';
      const menuWidth = curMenu.getBoundingClientRect().width;
      if (event.clientX - menuWidth < 8) {
        curMenu.style.left = '0';
        curMenu.style.right = 'auto';
      }
    });
  }

  wrap.append(openBtn, menu);
  host.appendChild(wrap);
}

/** Dra-håndtak i underkant av seksjonen: justerer size.minHeight. */
function addSectionHeightHandle(host, section, grid) {
  const handle = document.createElement('div');
  handle.className = 'urd-section-resize';
  handle.title = ta('canvas.sectionHeightDrag');
  wireHeightDrag(handle, host, section, grid);
  host.appendChild(handle);
}

/**
 * Dra-håndtak i TOPPKANTEN av seksjonen: gir/fjerner luft øverst.
 * Seksjonen vokser/krymper i toppen og alle blokkene forskyves
 * tilsvarende (topDrag i section-size.js), så innholdet står visuelt
 * stille - scrollposisjonen kompenseres med veksten. Naboseksjonene
 * røres aldri, og hele draget meldes som ETT urd-section-size med
 * moves (ett angre-steg i editoren). Bunnkant-håndtaket består.
 */
function addSectionTopHandle(host, section, grid) {
  const handle = document.createElement('div');
  handle.className = 'urd-section-resize-top';
  handle.title = ta('canvas.sectionTopDrag');
  handle.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    handle.setPointerCapture(event.pointerId);
    const startY = event.clientY;
    const startHeight = host.getBoundingClientRect().height;
    const startScrollY = window.scrollY;
    // Blokk-elementene og utgangs-y samles ÉN gang: ingen rerender skjer
    // under draget (elementbytte ville sluppet pekerfangsten).
    const parts = [...host.querySelectorAll(':scope > .urd-block')].map((el) => {
      const block = section.blocks.find((b) => b.id === el.dataset.blockId);
      return block ? { el, block, y: block.frames.desktop.y } : null;
    }).filter(Boolean);
    const cursor = dragCursor();
    let result = null;
    let moved = false;

    const onMove = (ev) => {
      if (!moved && Math.abs(ev.clientY - startY) < 4) return;
      moved = true;
      cursor.move(ev.clientY);
      result = topDrag({
        dyPointer: ev.clientY - startY,
        minHeightPx: startHeight,
        blockYs: parts.map((p) => p.y),
        grid,
        free: ev.shiftKey,
      });
      host.style.minHeight = `${result.minHeightPx}px`;
      for (const p of parts) p.el.style.top = `${p.y + result.dy}px`;
      // Innholdet skal stå visuelt stille: dokumentet under seksjons-
      // toppen flytter seg result.dy, scrollen følger. Absolutt mot
      // startverdien (aldri akkumulert scrollBy: det driver). Nær
      // dokumenttoppen finnes ikke nok scroll å kompensere med, og
      // innholdet glir synlig - akseptert kanttilfelle. Eksplisitt
      // instant: kompensasjonen må aldri arve scroll-behavior: smooth.
      window.scrollTo({ top: Math.max(0, startScrollY + result.dy), behavior: 'instant' });
    };
    const onUp = () => {
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', onUp);
      if (!moved || !result || result.dy === 0) return;
      section.size = { ...section.size, minHeight: `${result.minHeightPx}px` };
      for (const p of parts) {
        p.block.frames.desktop = { ...p.block.frames.desktop, y: p.y + result.dy };
      }
      post({
        type: 'urd-section-size',
        sectionId: section.id,
        minHeight: `${result.minHeightPx}px`,
        moves: parts.map((p) => ({ blockId: p.block.id, dy: result.dy })),
      });
    };
    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onUp);
  });
  host.appendChild(handle);
}

/**
 * Legger «+ Ny seksjon»-barer mellom (og rundt) seksjonene. Kalles av
 * render.js etter hver hele siderendering i preview-modus.
 *
 * @param {HTMLElement} root Sidens rotelement
 * @param {object} page Sidedata (for antall seksjoner)
 * @param {object} site site.json (gridet for dra på seksjonsgrensen)
 */
export function enhancePage(root, page, site) {
  initTextToolbar();
  root.querySelectorAll('.urd-add-section').forEach((el) => el.remove());
  // Mobilvisning er justering og tilsyn, ikke strukturbygging.
  if (isMobile()) return;
  const hosts = [...root.querySelectorAll(':scope > .urd-section')];
  // Baren ligger på grensen mellom to seksjoner: dra i den flytter
  // grensen (= høyden på seksjonen OVER), akkurat som seksjonslinjen.
  const above = (i) => (i > 0 ? {
    host: hosts[i - 1],
    section: page.sections[i - 1],
    grid: page.sections[i - 1]?.grid ?? site.grid,
  } : null);
  hosts.forEach((el, i) => root.insertBefore(makeSectionAdder(i, above(i)), el));
  root.appendChild(makeSectionAdder(hosts.length, above(hosts.length)));
}

/** Baren med «+ Ny seksjon»; klikk viser preset-valgene fra registeret,
 *  dra flytter seksjonsgrensen (når det finnes en seksjon over). */
function makeSectionAdder(index, above = null) {
  const bar = document.createElement('div');
  bar.className = 'urd-add-section';

  const collapse = () => {
    bar.classList.remove('open');
    bar.replaceChildren(openBtn);
  };

  const openBtn = document.createElement('button');
  openBtn.textContent = ta('canvas.newSection');
  if (above) {
    openBtn.title = ta('canvas.newSectionDrag');
    let dragged = false;
    wireHeightDrag(openBtn, above.host, above.section, above.grid, {
      onDragged: () => { dragged = true; },
    });
    // Et fullført dra skal ikke også åpne preset-menyen.
    openBtn.addEventListener('click', (e) => {
      if (dragged) {
        dragged = false;
        e.stopImmediatePropagation();
      }
    }, { capture: true });
  }
  openBtn.addEventListener('click', () => {
    bar.classList.add('open');
    bar.replaceChildren();

    // Preset-galleriet: gruppert etter def.group med def.hint som beskrivelse.
    // Feltene er valgfrie; presets uten group havner under «Annet».
    // Gruppene beholder registerets rekkefølge.
    const menu = document.createElement('div');
    menu.className = 'urd-preset-menu';
    // Den nederste grensen ligger ved sidens slutt, der iframen ikke har plass under: åpne galleriet oppover i stedet.
    // På en tom side (kun én grense) finnes ingenting over, da åpnes det fortsatt nedover.
    if (!bar.nextElementSibling && bar.previousElementSibling) menu.classList.add('urd-preset-up');

    const head = document.createElement('div');
    head.className = 'urd-preset-head';
    const title = document.createElement('span');
    title.textContent = ta('canvas.newSectionTitle');
    const cancel = document.createElement('button');
    cancel.className = 'urd-preset-close';
    cancel.textContent = '×';
    cancel.title = ta('confirm.cancel');
    cancel.addEventListener('click', collapse);
    head.append(title, cancel);
    menu.appendChild(head);

    // Kjernens maler grupperes som før; plugin-maler samles i en egen
    // «Plugins»-seksjon under alt det innebygde.
    const groups = new Map();
    const pluginDefs = [];
    for (const id of window.Urd.sections.ids()) {
      const def = window.Urd.sections.get(id);
      if (def.fromPlugin) {
        pluginDefs.push(def);
        continue;
      }
      // Grupperingen skjer på group-STRENGEN (id); kun visningen oversettes
      // (groupKey med group som fallback - plugin-kontrakten).
      const group = def.group ?? '';
      if (!groups.has(group)) groups.set(group, { labelKey: def.groupKey ?? null, defs: [] });
      groups.get(group).defs.push(def);
    }
    if (pluginDefs.length) groups.set('__plugins', { labelKey: 'panel.plugins', defs: pluginDefs });
    for (const [name, { labelKey, defs }] of groups) {
      const heading = document.createElement('div');
      heading.className = 'urd-preset-group';
      heading.textContent = labelKey ? ta(labelKey) : (name || ta('canvas.groupOther'));
      menu.appendChild(heading);
      for (const def of defs) {
        const choice = document.createElement('button');
        choice.type = 'button';
        choice.className = 'urd-preset-choice';
        // Auto-generert miniatyr fra presetens faktiske data (dataene
        // forkastes). En kastende plugin-preset skal aldri velte menyen:
        // da vises valget uten skisse, som før.
        try {
          const thumb = document.createElement('span');
          thumb.className = 'urd-preset-thumb';
          thumb.insertAdjacentHTML('afterbegin', presetThumb(def.create()));
          choice.appendChild(thumb);
        } catch { /* tekstvalg uten miniatyr */ }
        const body = document.createElement('span');
        body.className = 'urd-preset-body';
        choice.appendChild(body);
        const label = document.createElement('span');
        label.className = 'urd-preset-label';
        label.textContent = def.labelKey ? ta(def.labelKey) : def.label;
        body.appendChild(label);
        if (def.hintKey || def.hint) {
          const hint = document.createElement('span');
          hint.className = 'urd-preset-hint';
          hint.textContent = def.hintKey ? ta(def.hintKey) : def.hint;
          body.appendChild(hint);
        }
        choice.addEventListener('click', () => {
          post({ type: 'urd-add-section', index, section: def.create() });
          // Rerenderingen fjerner menyen fra DOM: rydd document-lytteren nå i stedet for ved neste tilfeldige klikk.
          cleanupOutside();
        });
        menu.appendChild(choice);
      }
    }
    bar.appendChild(menu);

    // Klikk utenfor menyen lukker den, samme forventning som ellers i editoren.
    // Listeneren ryddes ved lukking og ved preset-valg.
    const outside = (event) => {
      if (!menu.contains(event.target)) {
        cleanupOutside();
        collapse();
      }
    };
    function cleanupOutside() {
      document.removeEventListener('pointerdown', outside, true);
    }
    setTimeout(() => document.addEventListener('pointerdown', outside, true), 0);
    collapseOpenPresetMenu = () => {
      cleanupOutside();
      collapse();
    };
  });

  collapse();
  return bar;
}

/**
 * Formateringslinjen for tekstfelt (à la Squarespace): vises over BLOKKEN
 * så lenge et tekstfelt redigeres, med overskriftsnivå, fet/kursiv/
 * understrek, farger, lenke, justering, lister, sitat og fjern-formatering.
 * Kommandoene går via contenteditable (execCommand), som utløser
 * input-hendelsen i text.js - lagringen gjenbruker hele utkastflyten.
 * (Font og grunnstørrelse per felt bor i Egenskaper-panelet.)
 */
let textToolbarReady = false;

function initTextToolbar() {
  if (textToolbarReady) return;
  textToolbarReady = true;

  const bar = document.createElement('div');
  bar.className = 'urd-text-toolbar';
  // Klikk i linjen skal ikke flytte fokus ut av tekstfeltet. Unntak: select
  // og input MÅ få mousedown, ellers åpner ikke nivåvelgeren seg og
  // lenkefeltet kan ikke klikkes i; fokusvekslingen deres håndteres eksplisitt.
  bar.addEventListener('mousedown', (event) => {
    if (event.target instanceof Element && event.target.closest('select, input')) return;
    event.preventDefault();
  });

  const exec = (name, value = null) => document.execCommand(name, false, value);

  // Fargevelger og lenkefelt flytter fokus/markering: markeringen lagres før og gjenopprettes ved bruk.
  let savedRange = null;
  const saveSelection = () => {
    const sel = document.getSelection();
    savedRange = sel && sel.rangeCount ? sel.getRangeAt(0).cloneRange() : null;
  };
  const restoreSelection = () => {
    if (!savedRange) return;
    const sel = document.getSelection();
    sel.removeAllRanges();
    sel.addRange(savedRange);
  };

  /** Grupper som radbrytes SAMLET, så ingen enslig knapp havner på egen linje. */
  let group = null;
  const startGroup = (host) => {
    group = document.createElement('span');
    group.className = 'urd-tt-group';
    host.appendChild(group);
  };
  // Knapper med en execCommand-tilstand (fet, justering, lister ...) merkes
  // aktive når markøren står i formatet. cmd = queryCommandState-navnet.
  const stateButtons = [];
  const btn = (html, title, run, cmd) => {
    const b = document.createElement('button');
    b.innerHTML = html;
    b.title = title;
    b.addEventListener('click', () => { run(); reposition(); });
    group.appendChild(b);
    if (cmd) stateButtons.push([b, cmd]);
    return b;
  };

  // To FASTE rader (Office/Word-stil): rad 1 = struktur + størrelse, rad 2 =
  // tegnformatering + avsnitt. De utvidbare underradene (farger, avstand,
  // tegn, lenke) legges under begge.
  const row1 = document.createElement('div');
  row1.className = 'urd-tt-row';
  const row2 = document.createElement('div');
  row2.className = 'urd-tt-row';
  bar.append(row1, row2);

  // --- Sentinel-normalisering: én teknikk for alle inline-stiler på
  // MARKERINGEN (størrelse, font, bokstavavstand). execCommand('fontName')
  // gjør range-kirurgien (splitter delvis markerte tekstnoder, går over
  // flere avsnitt); etterpå byttes markørene ut med rene span-er. styleWithCSS
  // røres aldri, så themeify (font[color]) består. ---
  const SENTINEL = 'urd-marker';

  const unwrap = (el) => {
    const parent = el.parentNode;
    if (!parent) return;
    while (el.firstChild) parent.insertBefore(el.firstChild, el);
    parent.removeChild(el);
  };
  // Markørene: font[face] (standard uten styleWithCSS) ELLER en span med
  // font-family satt til sentinelen (enkelte nettlesere, f.eks. Firefox).
  const collectMarkers = () => {
    const out = [...activeText.querySelectorAll(`font[face="${SENTINEL}"]`)];
    for (const el of activeText.querySelectorAll('span[style]')) {
      if (el.style.fontFamily.replace(/["']/g, '') === SENTINEL) out.push(el);
    }
    return out;
  };
  // Fjern samme prop fra etterkommere (så den ytterste span-en vinner), og
  // rydd tomme span-er.
  const stripDescendantProp = (root, prop) => {
    for (const el of [...root.querySelectorAll('[style]')]) {
      if (!el.style[prop]) continue;
      el.style[prop] = '';
      if (el.getAttribute('style') === '') el.removeAttribute('style');
      if (el.tagName === 'SPAN' && !el.attributes.length) unwrap(el);
    }
  };
  const reselect = (nodes) => {
    const valid = nodes.filter((n) => n && n.isConnected);
    if (!valid.length) return;
    const range = document.createRange();
    range.setStartBefore(valid[0]);
    range.setEndAfter(valid[valid.length - 1]);
    const sel = document.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };
  // Kollapset markør: utvid til ordet skrivemarkøren står i (som Word), aldri
  // med et usynlig tegn i lagret HTML.
  const expandToWord = () => {
    const sel = document.getSelection();
    if (!sel || !sel.rangeCount || !sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    const node = range.startContainer;
    if (node.nodeType !== 3) return;
    const text = node.textContent;
    let start = range.startOffset;
    let end = range.startOffset;
    while (start > 0 && /\S/.test(text[start - 1])) start--;
    while (end < text.length && /\S/.test(text[end])) end++;
    if (start === end) return;
    const r = document.createRange();
    r.setStart(node, start);
    r.setEnd(node, end);
    sel.removeAllRanges();
    sel.addRange(r);
  };
  // Sett en fast inline-verdi (value null/'' = fjern stilen, «Arv») på markeringen.
  const applyInlineStyle = (prop, value) => {
    if (!activeText) return;
    expandToWord();
    exec('fontName', SENTINEL);
    const markers = collectMarkers();
    if (!markers.length) return;
    const made = [];
    for (const marker of markers) {
      const span = document.createElement('span');
      if (value != null && value !== '') span.style[prop] = value;
      while (marker.firstChild) span.appendChild(marker.firstChild);
      stripDescendantProp(span, prop);
      if (span.getAttribute('style')) {
        marker.replaceWith(span);
        made.push(span);
      } else {
        const kids = [...span.childNodes];
        marker.replaceWith(...kids);
        made.push(...kids);
      }
    }
    reselect(made);
    activeText.dispatchEvent(new Event('input', { bubbles: true }));
  };
  // Størrelse per run (A-opp/A-ned og ±1px): hver tekst-run steppes ut fra
  // SIN egen beregnede størrelse, så blandede markeringer beholdes. Går rett
  // på tekstnodene (ikke via fontName-markør, som slår naborun-er sammen).
  const applySizeStep = (read) => {
    if (!activeText) return;
    expandToWord();
    const sel = document.getSelection();
    if (!sel || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    if (range.collapsed) return;
    // Del tekstnodene ved markeringsgrensene, så runene aligner på noder.
    if (range.startContainer.nodeType === 3 && range.startOffset > 0) {
      const after = range.startContainer.splitText(range.startOffset);
      range.setStart(after, 0);
    }
    if (range.endContainer.nodeType === 3 && range.endOffset < range.endContainer.length) {
      range.endContainer.splitText(range.endOffset);
    }
    sel.removeAllRanges();
    sel.addRange(range);
    const runs = [];
    const walker = document.createTreeWalker(activeText, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.textContent && sel.containsNode(node, false)) runs.push(node);
    }
    if (!runs.length) return;
    const made = [];
    for (const tn of runs) {
      const parent = tn.parentElement;
      const next = read(parseFloat(getComputedStyle(parent).fontSize));
      // Er runen HELE innholdet i en størrelse-span? Oppdater den på stedet,
      // så gjentatt stepping ikke stabler nye span-er.
      if (parent.tagName === 'SPAN' && parent.childNodes.length === 1 && parent.style.fontSize) {
        parent.style.fontSize = `${next}px`;
        made.push(parent);
      } else {
        const span = document.createElement('span');
        span.style.fontSize = `${next}px`;
        parent.insertBefore(span, tn);
        span.appendChild(tn);
        made.push(span);
      }
    }
    reselect(made);
    activeText.dispatchEvent(new Event('input', { bubbles: true }));
  };

  // Blokk-nivå-operasjoner (linjeavstand, innrykk): påvirker avsnittene i
  // markeringen, ikke enkeltord.
  const BLOCK_SEL = 'p,h1,h2,h3,h4,h5,h6,li,blockquote,div';
  const blocksInRange = () => {
    const sel = document.getSelection();
    if (!sel || !sel.rangeCount || !activeText) return [];
    const range = sel.getRangeAt(0);
    const leaf = (list) => list.filter((el) => !list.some((o) => o !== el && el.contains(o)));
    let hits = leaf([...activeText.querySelectorAll(BLOCK_SEL)].filter((el) => range.intersectsNode(el)));
    if (!hits.length) {
      // Bare tekstnoder rett i feltet: normaliser til ett avsnitt først.
      exec('formatBlock', 'p');
      hits = leaf([...activeText.querySelectorAll(BLOCK_SEL)].filter((el) => range.intersectsNode(el)));
    }
    return hits;
  };
  const setLineHeight = (value) => {
    if (!activeText) return;
    for (const el of blocksInRange()) {
      el.style.lineHeight = value;
      if (el.getAttribute('style') === '') el.removeAttribute('style');
    }
    activeText.dispatchEvent(new Event('input', { bubbles: true }));
  };
  const applyIndent = (dir) => {
    if (!activeText) return;
    const hits = blocksInRange();
    // Rene lister: la nettleseren lage/rive nivåer (riktig ul-nesting).
    if (hits.length && hits.every((el) => el.tagName === 'LI')) {
      exec(dir > 0 ? 'indent' : 'outdent');
      return;
    }
    for (const el of hits) {
      if (el.tagName === 'LI') continue;
      el.style.marginLeft = stepIndent(el.style.marginLeft, dir);
      if (el.getAttribute('style') === '') el.removeAttribute('style');
    }
    activeText.dispatchEvent(new Event('input', { bubbles: true }));
  };

  // ---------------- RAD 1: struktur og størrelse ----------------
  // Overskriftsnivå: temastyrt nedtrekk (ADR-0009: aldri native select i
  // redigerings-UI). Nedtrekket stjeler ikke fokus, så markeringen står.
  startGroup(row1);
  const level = createDropdown({
    value: 'p',
    title: ta('tt.level'),
    options: [['p', ta('tt.paragraph')], ['h1', ta('tt.headingN', { n: 1 })], ['h2', ta('tt.headingN', { n: 2 })], ['h3', ta('tt.headingN', { n: 3 })]],
    onchange: (value) => exec('formatBlock', value),
  });
  group.appendChild(level.el);

  // Font for MARKERINGEN (ikke hele feltet; feltets font bor i Egenskaper).
  // «Arv fra tema» fjerner font-family fra markeringen.
  const fontDd = createDropdown({
    value: '',
    title: ta('tt.fontTitle'),
    options: [['', ta('tt.inheritFont')], ...FONT_STACKS.map(([name, value]) => [value, ta(name)])],
    onchange: (v) => { applyInlineStyle('fontFamily', v || null); reposition(); },
  });
  group.appendChild(fontDd.el);

  // Størrelse for MARKERINGEN: tallfelt med minus/pluss (±1px). Feltet stjeler
  // fokus, så markeringen lagres/gjenopprettes (linkRow-mønsteret).
  const MINUS_SVG = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2.5 6h7"/></svg>';
  const PLUS_SVG = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 2.5v7M2.5 6h7"/></svg>';

  startGroup(row1);
  btn(MINUS_SVG, ta('tt.sizeMinus'), () => applySizeStep((cur) => stepSize(cur, -1)));
  const sizeInput = document.createElement('input');
  sizeInput.type = 'number';
  sizeInput.className = 'urd-tt-num urd-tt-size';
  sizeInput.min = String(SIZE_MIN);
  sizeInput.max = String(SIZE_MAX);
  sizeInput.step = '1';
  sizeInput.title = ta('tt.sizeTitle');
  const applySizeFromField = () => {
    restoreSelection();
    const raw = sizeInput.value.trim();
    if (raw === '') { applyInlineStyle('fontSize', null); return; }
    const px = clampSize(Number(raw));
    if (px == null) return;
    sizeInput.value = String(px);
    applyInlineStyle('fontSize', `${px}px`);
  };
  // Lagre markeringen FØR fokus flyttes til feltet (på pointerdown står den
  // ennå i teksten; ved focus kan den være borte).
  sizeInput.addEventListener('pointerdown', saveSelection);
  sizeInput.addEventListener('change', () => { applySizeFromField(); reposition(); });
  sizeInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); applySizeFromField(); activeText?.focus(); reposition(); }
  });
  group.appendChild(sizeInput);
  btn(PLUS_SVG, ta('tt.sizePlus'), () => applySizeStep((cur) => stepSize(cur, 1)));

  // ---------------- RAD 2: tegnformatering og avsnitt ----------------
  startGroup(row2);
  btn(`<b>${ta('format.boldLetter')}</b>`, ta('tt.bold'), () => exec('bold'), 'bold');
  btn(`<i>${ta('format.italicLetter')}</i>`, ta('tt.italic'), () => exec('italic'), 'italic');
  btn(`<u>${ta('format.underlineLetter')}</u>`, ta('tt.underline'), () => exec('underline'), 'underline');
  btn(`<s>${ta('format.strikeLetter')}</s>`, ta('tt.strike'), () => exec('strikeThrough'), 'strikeThrough');
  btn('<span class="urd-tt-supsub">A<sup>2</sup></span>', ta('tt.superscript'), () => exec('superscript'), 'superscript');
  btn('<span class="urd-tt-supsub">A<sub>2</sub></span>', ta('tt.subscript'), () => exec('subscript'), 'subscript');

  // Farger: samlet i en nedtrekksrad (palettikonet er nedtrekksknappen),
  // så hovedlinjen holder seg smal. Selve raden bygges lenger ned (colorRow).
  startGroup(row2);
  const PALETTE_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="8.5" cy="9" r="1" fill="currentColor"/><circle cx="15.5" cy="9" r="1" fill="currentColor"/><circle cx="8.5" cy="15" r="1" fill="currentColor"/><path d="M21 12a9 9 0 0 1-9 9c2.5-2 1-4.5 3-5.5s6 .5 6-3.5z"/></svg>';
  btn(PALETTE_SVG, ta('tt.colors'), () => toggleColorRow());

  const alignIcon = (kind) =>
    `<span class="urd-ticon urd-ticon-${kind}"><i></i><i></i><i></i></span>`;
  startGroup(row2);
  btn(alignIcon('left'), ta('tt.alignLeft'), () => exec('justifyLeft'), 'justifyLeft');
  btn(alignIcon('center'), ta('tt.alignCenter'), () => exec('justifyCenter'), 'justifyCenter');
  btn(alignIcon('right'), ta('tt.alignRight'), () => exec('justifyRight'), 'justifyRight');
  btn(alignIcon('justify'), ta('tt.alignJustify'), () => exec('justifyFull'), 'justifyFull');
  // Linje- og bokstavavstand: egen nedtrekksrad bak avstandsknappen.
  const SPACING_SVG = '<svg width="16" height="14" viewBox="0 0 16 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2.5v9M1.2 4.2 3 2.4l1.8 1.8M1.2 9.8 3 11.6l1.8-1.8M7.5 3.5h7.5M7.5 7h7.5M7.5 10.5h7.5"/></svg>';
  btn(SPACING_SVG, ta('tt.spacing'), () => toggleSpacingRow());

  startGroup(row2);
  btn('<span class="urd-licon"><i></i><i></i><i></i></span>', ta('tt.ul'),
    () => exec('insertUnorderedList'), 'insertUnorderedList');
  btn('<span class="urd-licon urd-licon-ol"><i>1</i><i>2</i><i>3</i></span>', ta('tt.ol'),
    () => exec('insertOrderedList'), 'insertOrderedList');
  const OUTDENT_SVG = '<svg width="15" height="13" viewBox="0 0 15 13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 2h12M6.5 6.5h7M1.5 11h12M4.3 4.5 2 6.5l2.3 2"/></svg>';
  const INDENT_SVG = '<svg width="15" height="13" viewBox="0 0 15 13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 2h12M6.5 6.5h7M1.5 11h12M2 4.5l2.3 2L2 8.5"/></svg>';
  btn(OUTDENT_SVG, ta('tt.outdent'), () => applyIndent(-1));
  btn(INDENT_SVG, ta('tt.indent'), () => applyIndent(1));

  startGroup(row2);
  const QUOTE_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5C3.8 5 2 6.8 2 9s1.8 4 4 4c.3 0 .5 0 .8-.1C6.2 14.8 5 16.4 3.4 17.4l1.2 1.8C8 17 10 13.7 10 10.2 10 7.2 8.3 5 6 5z"/><path d="M17 5c-2.2 0-4 1.8-4 4s1.8 4 4 4c.3 0 .5 0 .8-.1-.6 1.9-1.8 3.5-3.4 4.5l1.2 1.8C19 17 21 13.7 21 10.2 21 7.2 19.3 5 17 5z"/></svg>';
  // Sitat er en av/på-bryter: står markøren i et sitat, gjøres det til avsnitt igjen.
  const quoteBtn = btn(QUOTE_SVG, ta('tt.quote'), () => {
    let inQuote = false;
    try { inQuote = (document.queryCommandValue('formatBlock') || '').toLowerCase() === 'blockquote'; } catch { /* noop */ }
    exec('formatBlock', inQuote ? 'p' : 'blockquote');
  });
  // Tegnmenyen: samme utvalg som ikon-blokkens tegnvelger (delt modul i
  // glyphs.js), satt inn ved markøren. Knappen er et tegnet smilefjes
  // (aldri emoji i editor-chrome); selve tegnene er innhold.
  const GLYPH_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><line x1="9" y1="9.5" x2="9" y2="9.5"/><line x1="15" y1="9.5" x2="15" y2="9.5"/><path d="M8.5 14.5c.8 1.2 2 2 3.5 2s2.7-.8 3.5-2"/></svg>';
  btn(GLYPH_SVG, ta('tt.glyphs'), () => toggleGlyphRow());

  startGroup(row2);
  const LINK_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5"/></svg>';
  const CLEAR_SVG = '<svg width="16" height="14" viewBox="0 0 26 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 5h12"/><path d="M11 5L8 19"/><path d="M18 15l6 6"/><path d="M24 15l-6 6"/></svg>';
  btn(LINK_SVG, ta('lbl.link'), () => toggleLinkRow());
  btn(CLEAR_SVG, ta('tt.clearFormat'), () => {
    exec('removeFormat');
    exec('unlink');
    exec('formatBlock', 'p');
    // removeFormat rører ikke blokk-nivå-stil: nullstill også avsnittene.
    for (const el of blocksInRange()) {
      el.style.lineHeight = '';
      el.style.marginLeft = '';
      if (el.getAttribute('style') === '') el.removeAttribute('style');
    }
  });

  // Inline lenkefelt (moderne flyt, ingen prompt): åpnes av lenkeknappen på egen rad i linjen.
  const linkRow = document.createElement('div');
  linkRow.className = 'urd-tt-linkrow';
  const linkInput = document.createElement('input');
  linkInput.placeholder = ta('tt.linkPh');
  linkInput.spellcheck = false;
  const linkApply = document.createElement('button');
  linkApply.textContent = ta('common.apply');
  const linkRemove = document.createElement('button');
  linkRemove.textContent = ta('tt.removeLink');
  linkRow.append(linkInput, linkApply, linkRemove);
  bar.appendChild(linkRow);

  const applyLink = () => {
    const trimmed = linkInput.value.trim();
    // Kun vanlige lenkeformer: aktive URL-skjemaer skal aldri bli klikkbare hos besøkende.
    if (/^(javascript|data|vbscript):/i.test(trimmed)) return;
    restoreSelection();
    if (trimmed) exec('createLink', trimmed);
    else exec('unlink');
    linkRow.classList.remove('vis');
  };
  linkApply.addEventListener('click', applyLink);
  linkInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') applyLink();
    if (event.key === 'Escape') linkRow.classList.remove('vis');
  });
  linkRemove.addEventListener('click', () => {
    restoreSelection();
    exec('unlink');
    linkRow.classList.remove('vis');
  });

  function toggleLinkRow() {
    if (linkRow.classList.contains('vis')) {
      linkRow.classList.remove('vis');
      return;
    }
    colorRow.classList.remove('vis');
    glyphRow.classList.remove('vis');
    spacingRow.classList.remove('vis');
    saveSelection();
    // Forhåndsutfyll med eksisterende lenke når markøren står i en.
    const sel = document.getSelection();
    const anchorEl = sel?.anchorNode instanceof HTMLElement ? sel.anchorNode : sel?.anchorNode?.parentElement;
    linkInput.value = anchorEl?.closest('a')?.getAttribute('href') ?? '';
    linkRow.classList.add('vis');
    linkInput.focus();
  }

  // Temafarge-kommandoene: execCommand kan bare skrive en FAST farge; etterpå
  // byttes den til var(--urd-color-<token>) i feltet, så innholdet følger
  // temabytter. execCommand normaliserer farger ulikt (hex/rgb), så matchingen
  // skjer på rgb-form. Egne farger forblir frikoblet hex, med vilje.
  const normColor = (value) => {
    if (!value) return '';
    const v = String(value).trim().toLowerCase();
    const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(v);
    if (!hex) return v.replace(/\s+/g, ' ');
    let h = hex[1];
    if (h.length === 3) h = [...h].map((c) => c + c).join('');
    const n = parseInt(h, 16);
    return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
  };
  const themeify = (token, styleProp) => {
    if (!activeText) return;
    const target = normColor(getComputedStyle(document.documentElement)
      .getPropertyValue(`--urd-color-${token}`));
    if (!target) return;
    for (const el of activeText.querySelectorAll('[style], font[color]')) {
      if (styleProp === 'color' && el.tagName === 'FONT' && normColor(el.getAttribute('color')) === target) {
        el.removeAttribute('color');
        el.style.color = `var(--urd-color-${token})`;
        continue;
      }
      if (normColor(el.style[styleProp]) === target) {
        el.style[styleProp] = `var(--urd-color-${token})`;
      }
    }
    // Byttet skjer utenfor execCommand: meld input selv, så utkastet lagres.
    activeText.dispatchEvent(new Event('input', { bubbles: true }));
  };

  // Fargeraden (nedtrekket bak palettikonet): temafarger og egen tekstfarge,
  // så utheving med aksent/egen farge og fjern utheving.
  const colorRow = document.createElement('div');
  colorRow.className = 'urd-tt-colorrow';
  bar.insertBefore(colorRow, linkRow);
  const colorBtn = (html, title, run) => {
    const b = document.createElement('button');
    b.innerHTML = html;
    b.title = title;
    b.addEventListener('click', () => { run(); reposition(); });
    colorRow.appendChild(b);
    return b;
  };
  // Fargemenyen lukkes IKKE ved valg (så man kan prøve flere farger); den
  // lukkes bare når hele linjen forsvinner, en annen underrad åpnes, eller
  // palettikonet trykkes igjen (toggleColorRow).
  //
  // Den delte fargevelgeren melder onpick LIVE ved hvert valg. Etter hvert
  // execCommand endres DOM-en, så en fast lagret Range blir ugjyldig. Derfor
  // fornyes markeringen etter HVER påføring (saveSelection), slik at neste
  // live-kall treffer samme tekst - den universelle koblings-fiksen.
  const pickInto = (apply) => (hex) => {
    restoreSelection();
    apply(hex);
    saveSelection();
  };
  for (const token of ['text', 'accent']) {
    const b = colorBtn('', token === 'text' ? ta('tt.textColorTheme') : ta('tt.accentColorTheme'), () => {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue(`--urd-color-${token}`).trim();
      exec('foreColor', value);
      themeify(token, 'color');
    });
    b.className = 'urd-text-swatch';
    b.style.background = `var(--urd-color-${token})`;
  }
  colorBtn('<span class="urd-tt-acolor">A</span>', ta('tt.customTextColor'), () => {
    saveSelection();
    openColorPicker(bar, {
      value: '#ffffff',
      onpick: pickInto((hex) => exec('foreColor', hex)),
    });
  });
  const colorSep = document.createElement('span');
  colorSep.className = 'urd-tt-sep';
  colorRow.appendChild(colorSep);
  colorBtn('<span class="urd-tt-hl">A</span>', ta('tt.hlAccent'), () => {
    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue('--urd-color-accent').trim();
    exec('hiliteColor', accent);
    themeify('accent', 'backgroundColor');
  });
  colorBtn('<span class="urd-tt-hl urd-tt-hl-free">A</span>', ta('tt.hlCustom'), () => {
    saveSelection();
    openColorPicker(bar, {
      onpick: pickInto((hex) => exec('hiliteColor', hex)),
    });
  });
  colorBtn('<span class="urd-tt-hl urd-tt-hl-none">A</span>', ta('tt.hlNone'), () => {
    exec('hiliteColor', 'transparent');
  });

  function toggleColorRow() {
    linkRow.classList.remove('vis');
    glyphRow.classList.remove('vis');
    spacingRow.classList.remove('vis');
    colorRow.classList.toggle('vis');
  }

  // Tegnraden (bak smilefjes-knappen): «Nylige» + kategoriene fra den
  // delte tegnmodulen, i et rullbart rutenett. Tegnet settes inn ved
  // markøren via insertText, som utløser input-hendelsen i text.js -
  // lagringen gjenbruker utkastflyten. Raden bygges først når den åpnes
  // (flere hundre knapper); nylig-listen deles med admin-velgeren via
  // samme localStorage-nøkkel.
  const glyphRow = document.createElement('div');
  glyphRow.className = 'urd-tt-glyphrow';
  bar.insertBefore(glyphRow, linkRow);
  let glyphRowBuilt = false;

  const glyphHeading = (name) => {
    const h = document.createElement('div');
    h.className = 'urd-tt-glyphhead';
    h.textContent = name;
    return h;
  };
  const glyphGrid = () => {
    const g = document.createElement('div');
    g.className = 'urd-tt-glyphgrid';
    return g;
  };
  const glyphCell = (host, glyph) => {
    const b = document.createElement('button');
    b.textContent = glyph;
    b.title = ta('tt.insert');
    b.addEventListener('click', () => {
      exec('insertText', glyph);
      saveRecentGlyph(glyph);
      renderRecentGlyphs();
      reposition();
    });
    host.appendChild(b);
  };

  const recentGlyphs = document.createElement('div');
  const renderRecentGlyphs = () => {
    recentGlyphs.replaceChildren();
    const recent = readRecentGlyphs();
    if (!recent.length) return;
    recentGlyphs.appendChild(glyphHeading(ta('common.recent')));
    const grid = glyphGrid();
    recent.forEach((glyph) => glyphCell(grid, glyph));
    recentGlyphs.appendChild(grid);
  };

  function toggleGlyphRow() {
    linkRow.classList.remove('vis');
    colorRow.classList.remove('vis');
    spacingRow.classList.remove('vis');
    if (glyphRow.classList.contains('vis')) {
      glyphRow.classList.remove('vis');
      return;
    }
    if (!glyphRowBuilt) {
      glyphRowBuilt = true;
      glyphRow.appendChild(recentGlyphs);
      for (const [name, glyphs] of GLYPH_CATEGORIES) {
        glyphRow.appendChild(glyphHeading(ta(name)));
        const grid = glyphGrid();
        glyphs.split(' ').forEach((glyph) => glyphCell(grid, glyph));
        glyphRow.appendChild(grid);
      }
    }
    renderRecentGlyphs();
    glyphRow.classList.add('vis');
    reposition();
  }

  // Avstandsraden (bak avstandsknappen): linjeavstand-presetene og
  // bokstavavstand for MARKERINGEN. Linjeavstand gjelder avsnittene i
  // markeringen, bokstavavstand gjelder tegnene. Alt er additivt inline;
  // «Arv» fjerner overstyringen.
  const spacingRow = document.createElement('div');
  spacingRow.className = 'urd-tt-spacerow';
  bar.insertBefore(spacingRow, linkRow);

  const spacingLabel = (text) => {
    const s = document.createElement('span');
    s.className = 'urd-tt-typolabel';
    s.textContent = text;
    return s;
  };
  spacingRow.appendChild(spacingLabel(ta('tt.lineHeight')));
  for (const [value, label] of LINE_HEIGHTS) {
    const b = document.createElement('button');
    b.className = 'urd-tt-lh';
    b.textContent = value ? label : ta('common.inherit');
    b.title = value ? ta('tt.lineHeightN', { label }) : ta('tt.inheritLh');
    b.addEventListener('click', () => { setLineHeight(value); reposition(); });
    spacingRow.appendChild(b);
  }
  const spacingSep = document.createElement('span');
  spacingSep.className = 'urd-tt-sep';
  spacingRow.appendChild(spacingSep);
  spacingRow.appendChild(spacingLabel(ta('tt.letterSpacing')));
  const lsInput = document.createElement('input');
  lsInput.type = 'number';
  lsInput.className = 'urd-tt-num';
  lsInput.min = '-2';
  lsInput.max = '10';
  lsInput.step = '0.1';
  lsInput.placeholder = ta('common.inherit');
  lsInput.title = ta('tt.letterSpacingTitle');
  const applyLetterSpacing = () => {
    restoreSelection();
    const raw = lsInput.value.trim();
    applyInlineStyle('letterSpacing', raw === '' ? null : `${Number(raw)}px`);
  };
  lsInput.addEventListener('pointerdown', saveSelection);
  lsInput.addEventListener('change', () => { applyLetterSpacing(); reposition(); });
  lsInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); applyLetterSpacing(); activeText?.focus(); reposition(); }
  });
  spacingRow.appendChild(lsInput);

  function toggleSpacingRow() {
    linkRow.classList.remove('vis');
    colorRow.classList.remove('vis');
    glyphRow.classList.remove('vis');
    spacingRow.classList.toggle('vis');
  }

  document.body.appendChild(bar);

  // Linjen vises så lenge et tekstfelt har fokus, forankret ved MARKERINGEN
  // (blokk-rekten som fallback), klemt under sidens klistrede meny.
  let activeText = null;
  // Blokk-id-en til det aktive feltet: prop-endringer (typografiraden,
  // Egenskaper-panelet) re-rendrer seksjonen og bytter ut elementet, så
  // linjen finner det igjen via id-en. Nulles ved bevisst lukking, ellers
  // ville linjen aldri slippe taket.
  let activeBlockId = null;

  const reposition = () => {
    if (activeBlockId && (!activeText || !activeText.isConnected)) {
      activeText = document.querySelector(`.urd-block[data-block-id="${activeBlockId}"] .urd-text[contenteditable="true"]`);
    }
    if (!activeText || !activeText.isConnected) {
      bar.classList.remove('vis');
      linkRow.classList.remove('vis');
      colorRow.classList.remove('vis');
      glyphRow.classList.remove('vis');
      spacingRow.classList.remove('vis');
      return;
    }
    // Linjen forankres alltid ved TOPPEN av tekstfeltet (blokken), ikke ved
    // markøren, så den står i ro mens man skriver. En ugyldig rekt (blokken
    // ikke lagt ut ennå) skal ikke flytte linjen.
    const block = activeText.closest('.urd-block') ?? activeText;
    const anchor = block.getBoundingClientRect();
    if (!anchor || (!anchor.width && !anchor.height)) return;
    bar.classList.add('vis');
    const navHeight = document.getElementById('urd-nav')?.offsetHeight ?? 0;
    const left = Math.max(8, Math.min(anchor.left, window.innerWidth - bar.offsetWidth - 8));
    let top = anchor.top - bar.offsetHeight - 10;
    // Over blokken; men aldri under den klistrede menyen (da klemmes den rett
    // under menyen, fortsatt nær toppen av feltet).
    if (top < navHeight + 8) top = navHeight + 8;
    bar.style.left = `${left}px`;
    bar.style.top = `${top}px`;
    // Nivåvelgeren og sitatknappen speiler markørens plassering.
    try {
      const value = (document.queryCommandValue('formatBlock') || 'p').toLowerCase();
      level.set(['h1', 'h2', 'h3'].includes(value) ? value : 'p');
      quoteBtn.classList.toggle('active', value === 'blockquote');
    } catch { /* enkelte nettlesere nekter før første kommando */ }
    // Formatknappene (fet, kursiv, justering, lister, hevet/senket) merkes
    // aktive når markøren står i formatet.
    for (const [b, cmd] of stateButtons) {
      let on = false;
      try { on = document.queryCommandState(cmd); } catch { /* noop */ }
      b.classList.toggle('active', on);
    }
    syncTypoControls();
  };

  // Størrelsesfeltet og font-nedtrekket speiler markeringen. Kjøres fra
  // reposition (selectionchange), aldri mens brukeren skriver i selve feltet.
  let lastFontSet = '';
  const styledAncestor = (node) => {
    let el = node?.nodeType === 3 ? node.parentElement : node;
    return el instanceof HTMLElement && activeText.contains(el) ? el : null;
  };
  const selectionSize = () => {
    const sel = document.getSelection();
    if (!sel || !sel.rangeCount) return null;
    const range = sel.getRangeAt(0);
    // Kollapset markør: størrelsen der markøren står.
    if (range.collapsed) {
      const el = styledAncestor(range.startContainer);
      return el ? Math.round(parseFloat(getComputedStyle(el).fontSize)) : null;
    }
    // Ellers: mål faktisk størrelse på hver MARKERT tekst-run. Vi går på
    // tekstnodene, ikke selection-endepunktene, fordi de kan peke på en
    // container (etter reselect med setStartBefore) og gi feltets basestørrelse.
    const sizes = new Set();
    const walker = document.createTreeWalker(activeText, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      if (n.textContent && n.parentElement && sel.containsNode(n, true)) {
        sizes.add(Math.round(parseFloat(getComputedStyle(n.parentElement).fontSize)));
      }
    }
    if (sizes.size === 0) return null;
    return sizes.size === 1 ? [...sizes][0] : null; // blandet -> tomt
  };
  const selectionFamily = () => {
    let el = styledAncestor(document.getSelection()?.anchorNode);
    while (el && el !== activeText) {
      if (el.style?.fontFamily) return el.style.fontFamily;
      if (el.tagName === 'FONT' && el.getAttribute('face')) return el.getAttribute('face');
      el = el.parentElement;
    }
    return '';
  };
  const syncTypoControls = () => {
    if (document.activeElement !== sizeInput) {
      const px = selectionSize();
      const shown = px == null ? '' : String(px);
      if (sizeInput.value !== shown) sizeInput.value = shown;
    }
    const wantFont = matchFontStack(selectionFamily()) || '';
    if (wantFont !== lastFontSet) { fontDd.set(wantFont); lastFontSet = wantFont; }
  };

  document.addEventListener('focusin', (event) => {
    const target = event.target instanceof HTMLElement
      ? event.target.closest('.urd-text[contenteditable="true"]')
      : null;
    if (target && target !== activeText) {
      activeText = target;
      activeBlockId = target.closest('.urd-block')?.dataset.blockId ?? null;
      linkRow.classList.remove('vis');
      colorRow.classList.remove('vis');
      glyphRow.classList.remove('vis');
      spacingRow.classList.remove('vis');
    }
    if (target) reposition();
  });
  document.addEventListener('focusout', () => {
    // Vent et blunk: fokus kan være på vei til selve linjen (eller lenkefeltet).
    requestAnimationFrame(() => {
      const el = document.activeElement;
      if (el instanceof HTMLElement && (bar.contains(el) || el.closest('.urd-text[contenteditable="true"]'))) return;
      // Ble feltet BYTTET UT av en re-render (typografi-/panelendring),
      // ikke forlatt av brukeren? Da gjenoppkobler reposition via
      // blokk-id-en i stedet for å lukke linjen.
      if (activeText && !activeText.isConnected && activeBlockId) {
        reposition();
        return;
      }
      activeText = null;
      activeBlockId = null;
      reposition();
    });
  });
  // Klikk hvor som helst utenfor feltet lukker linjen. Flate-draget i preview
  // sluker mousedown (preventDefault), så tekstfeltet mister aldri fokus av seg
  // selv; derfor lukkes det eksplisitt her. Klikk i linjen, fargevelgeren,
  // bildeeditoren eller et annet tekstfelt skal IKKE lukke (de håndterer selv).
  document.addEventListener('pointerdown', (event) => {
    if (!activeText) return;
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    if (bar.contains(target) || activeText.contains(target)) return;
    if (target.closest('.urd-text[contenteditable="true"], .urd-cp, .urd-imged, .urd-dd-menu')) return;
    activeText.blur();
    activeText = null;
    activeBlockId = null;
    reposition();
  }, true);
  document.addEventListener('selectionchange', () => {
    // Kun når markeringen faktisk står i det aktive feltet; ellers ville
    // klikk andre steder pånytt-posisjonert linjen ut av kontekst.
    const sel = document.getSelection();
    if (activeText && sel?.anchorNode && activeText.contains(sel.anchorNode)) reposition();
  });
  window.addEventListener('scroll', () => { if (activeText) reposition(); }, { passive: true, capture: true });
  window.addEventListener('resize', () => { if (activeText) reposition(); });
}

/** Verktøylinje øverst til høyre i seksjonen. Desktop: flytt opp/ned,
 *  tilpass høyde, slett. Mobil: gjennomgått (✓) og tilbake til auto (↺). */
function addSectionToolbar(host, section, grid) {
  const bar = document.createElement('div');
  bar.className = 'urd-section-toolbar';

  const mk = (text, title, onClick) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.title = title;
    btn.addEventListener('click', onClick);
    bar.appendChild(btn);
  };

  if (isMobile()) {
    const mobile = section.responsive?.mobile;
    if (mobile?.attention?.needed) {
      mk('✓', ta('canvas.mobileReviewed'), (event) => {
        section.responsive.mobile.attention = null;
        host.classList.remove('urd-attention');
        event.target.remove();
        post({ type: 'urd-review-done', sectionId: section.id });
      });
    }
    if (mobile?.mode === 'manual') {
      mk('↺', ta('canvas.mobileAuto'), () => {
        post({ type: 'urd-mobile-auto', sectionId: section.id });
      });
    }
  } else {
    // Utvidbare presets: «+ kort/rad/person»-knapp som legger til NESTE element i seksjonen.
    // Fabrikken (def.item) bor i preset-definisjonen; seksjonen forblir en generisk container.
    const def = section.preset ? window.Urd.sections.get(section.preset) : null;
    if (def?.item) {
      const itemLabel = def.itemLabelKey ? ta(def.itemLabelKey) : (def.itemLabel ?? ta('canvas.itemFallback'));
      mk(`+ ${itemLabel}`, ta('canvas.addItemTitle', { label: itemLabel }), (event) => {
        // Deaktiver til seksjonen rerendres: et dobbeltklikk før rundturen ville lagt to element i samme rute.
        event.target.disabled = true;
        const next = def.item(section);
        post({ type: 'urd-add-blocks', sectionId: section.id, blocks: next.blocks, minBottom: next.bottom, moves: next.moves ?? [] });
        // Marker og rull til det nye elementet etter rerenderingen: en ny TOM ramme er identisk
        // med naboene sine, så uten dette ser klikket dødt ut (reelt funn i testrundene).
        setTimeout(() => {
          const el = document.querySelector(`.urd-block[data-block-id="${next.blocks[0].id}"]`);
          if (!el) return;
          selectBlock(el);
          // 'nearest' i stedet for 'center': minimal flytting, så pluss-knappen forblir i synsfeltet ved gjentatte tillegg.
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 150);
      });
    }
    mk('↑', ta('canvas.sectionUp'), () => post({ type: 'urd-move-section', sectionId: section.id, dir: -1 }));
    mk('↓', ta('canvas.sectionDown'), () => post({ type: 'urd-move-section', sectionId: section.id, dir: 1 }));
    mk('⤓', ta('canvas.fitHeight'), () => {
      const maxBottom = Math.max(0, ...section.blocks.map((b) => b.frames.desktop.y + b.frames.desktop.h));
      const minHeight = `${Math.max(grid.size * 3, maxBottom + grid.size)}px`;
      section.size = { ...section.size, minHeight };
      host.style.minHeight = minHeight;
      post({ type: 'urd-section-size', sectionId: section.id, minHeight });
    });
    mk('×', ta('canvas.deleteSection'), () => {
      post({ type: 'urd-delete-section', sectionId: section.id });
    });
  }

  if (bar.childElementCount) host.appendChild(bar);
}

/**
 * Første håndjustering i mobilvisning: seksjonen går til manuell modus,
 * og ALLE blokkene får konkrete mobil-frames lest fra flyt-posisjonene
 * i øyeblikket (dekor-blokker, som ikke er i flyten, arver desktop-
 * framen som utgangspunkt). DOM-en konverteres på stedet uten rerender,
 * så et pågående dra ikke avbrytes; editoren bokfører via meldingen.
 */
function materializeMobile(host, section) {
  const flow = host.querySelector(':scope > .urd-flow');
  const hostRect = host.getBoundingClientRect();
  const frames = [];
  const flowEls = flow ? [...flow.querySelectorAll(':scope > .urd-block')] : [];

  for (const el of flowEls) {
    const block = section.blocks.find((b) => b.id === el.dataset.blockId);
    if (!block) continue;
    const r = el.getBoundingClientRect();
    block.frames.mobile = {
      x: Math.round(((r.left - hostRect.left) / hostRect.width) * 10000) / 100,
      y: Math.round(r.top - hostRect.top),
      w: Math.round((r.width / hostRect.width) * 10000) / 100,
      h: Math.round(r.height),
      z: block.frames.desktop.z ?? 1,
      rot: block.frames.desktop.rot ?? 0,
    };
    frames.push({ blockId: block.id, frame: block.frames.mobile });
  }
  for (const block of section.blocks) {
    if (!block.frames.mobile) {
      block.frames.mobile = { ...block.frames.desktop };
      frames.push({ blockId: block.id, frame: block.frames.mobile });
    }
  }

  section.responsive = {
    ...(section.responsive ?? {}),
    mobile: { mode: 'manual', attention: section.responsive?.mobile?.attention ?? null },
  };

  // Konverter DOM-en: ut av flyten, inn i absolutt posisjonering.
  for (const el of flowEls) {
    const block = section.blocks.find((b) => b.id === el.dataset.blockId);
    if (!block) continue;
    el.classList.remove('urd-block-flow');
    Object.assign(el.style, frameToCss(block.frames.mobile));
    host.appendChild(el);
  }
  flow?.remove();
  const maxBottom = Math.max(0, ...section.blocks.map((b) => b.frames.mobile.y + b.frames.mobile.h));
  host.style.minHeight = `${maxBottom}px`;

  post({ type: 'urd-mobile-manual', sectionId: section.id, frames });
}

function post(msg) {
  window.parent?.postMessage(msg, location.origin);
}

// Ctrl+Z / Ctrl+Shift+Z inne i iframen videresendes til editoren, som eier
// historikken - MED MINDRE fokus står i redigerbar tekst (der skal
// nettleserens egen tekst-angring gjelde; urd-edit holder utkastet i synk).
window.addEventListener('keydown', (event) => {
  if (!(event.ctrlKey || event.metaKey)) return;
  const key = event.key.toLowerCase();
  if (key !== 'z' && key !== 'y') return;
  const target = event.target;
  if (target instanceof HTMLElement && target.isContentEditable) return;
  event.preventDefault();
  post({ type: 'urd-undo', redo: key === 'y' || event.shiftKey });
});

// Markering: klikk på en blokk gir den varig fokus (håndtakene holder seg
// synlige, se base.css). Klikk utenfor alle blokker avvelger. Markeringen
// overlever rerender via id-en.
let selectedBlockId = null;

/**
 * Multimarkering: et utvalg av blokker i ÉN seksjon (id-er + seksjonen
 * de bor i). selectedBlockId er alltid primærblokken i utvalget.
 * Utvalget bygges med shift-klikk eller marquee (dra på tom flate),
 * og behandles som én enhet ved dra, piltaster, sletting og Ctrl+C/D/V.
 */
let multiIds = new Set();
let multiSectionId = null;

/** Utklippstavlen for Ctrl+C/V: blokk-JSON + kildeseksjonen. Lever i
 *  previewens modultilstand, så den nullstilles ved sidebytte. */
let clipboard = null;

function selectedEls() {
  if (!multiIds.size) return [];
  return [...multiIds]
    .map((id) => document.querySelector(`.urd-block[data-block-id="${CSS.escape(id)}"]`))
    .filter(Boolean);
}

function applyMultiClasses() {
  document.querySelectorAll('.urd-block.urd-multi-selected').forEach((el) => {
    if (!multiIds.has(el.dataset.blockId)) el.classList.remove('urd-multi-selected');
  });
  for (const el of selectedEls()) el.classList.add('urd-multi-selected');
  updateMultiToolbar();
}

function clearMulti() {
  if (!multiIds.size) return;
  multiIds = new Set();
  multiSectionId = null;
  applyMultiClasses();
}

/** Shift-klikk: legg til/fjern blokken i utvalget (innenfor én seksjon). */
function toggleMulti(el) {
  const id = el.dataset.blockId;
  const sec = el.closest('.urd-section')?.dataset.sectionId ?? null;
  if (multiSectionId && multiSectionId !== sec) clearMulti();
  multiSectionId = sec;
  // Utgangspunktet er den allerede markerte blokken (samme seksjon).
  if (!multiIds.size && selectedBlockId && selectedBlockId !== id) {
    const cur = document.querySelector(`.urd-block[data-block-id="${CSS.escape(selectedBlockId)}"]`);
    if (cur?.closest('.urd-section')?.dataset.sectionId === sec) multiIds.add(selectedBlockId);
  }
  if (multiIds.has(id)) {
    multiIds.delete(id);
    // Primærblokken forblir en som fortsatt er med i utvalget.
    const rest = selectedEls();
    selectBlock(rest[0] ?? null, { keepMulti: true });
  } else {
    multiIds.add(id);
    selectBlock(el, { keepMulti: true });
  }
  if (multiIds.size < 2) clearMulti();
  applyMultiClasses();
}

function selectBlock(el, opts = {}) {
  if (!opts.keepMulti) clearMulti();
  const previous = selectedBlockId;
  selectedBlockId = el?.dataset.blockId ?? null;
  document.querySelectorAll('.urd-block.urd-selected').forEach((b) => {
    if (b !== el) b.classList.remove('urd-selected');
  });
  el?.classList.add('urd-selected');
  if (previous !== selectedBlockId) {
    post({
      type: 'urd-select-block',
      sectionId: el?.closest('.urd-section')?.dataset.sectionId ?? null,
      blockId: selectedBlockId,
    });
  }
}

// Intern navigasjon i preview går via editoren (som bytter side og holder
// nedtrekket i synk); eksterne lenker åpnes i ny fane i stedet for å dra
// iframen ut av redigeringsmodus. Lenker INNE i blokker (knapper, bilder,
// tekstlenker) utløses aldri i redigering: klikket markerer blokken, og
// lenken testes via «Se siden».
document.addEventListener('click', (event) => {
  const a = event.target instanceof HTMLElement ? event.target.closest('a[href]') : null;
  if (!a) return;
  if (a.closest('.urd-block')) {
    event.preventDefault();
    return;
  }
  const href = a.getAttribute('href');
  if (!href || href.startsWith('#')) return;
  event.preventDefault();
  const url = new URL(href, location.href);
  if (url.origin === location.origin) {
    post({ type: 'urd-navigate', path: url.pathname });
  } else {
    window.open(url, '_blank', 'noopener');
  }
});

// Tastatur på markert blokk/utvalg: piltaster flytter (grid-steg;
// Shift = 1 px), Delete sletter, Esc avmarkerer, Ctrl+C/V kopierer og
// limer inn med bevart oppsett, Ctrl+D dupliserer. Aldri når fokus står
// i tekst/felt, og flytting gjelder desktopvisningen.
window.addEventListener('keydown', (event) => {
  const target = event.target;
  if (target instanceof HTMLElement
    && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) return;
  const ctrl = event.ctrlKey || event.metaKey;

  // Ctrl+V trenger ingen markering: lim inn der den aktive seksjonen er.
  if (ctrl && event.key.toLowerCase() === 'v') {
    if (isMobile() || !clipboard) return;
    event.preventDefault();
    pasteClipboard();
    return;
  }

  if (!selectedBlockId) return;

  if (event.key === 'Escape') {
    selectBlock(null);
    return;
  }

  const el = document.querySelector(`.urd-block[data-block-id="${selectedBlockId}"]`);
  const ctx = el?._urdCtx;
  if (!ctx) return;

  if (ctrl && event.key.toLowerCase() === 'c') {
    if (isMobile()) return;
    event.preventDefault();
    copySelection(ctx);
    return;
  }

  if (ctrl && event.key.toLowerCase() === 'd') {
    if (isMobile()) return;
    event.preventDefault();
    if (multiIds.size > 1) duplicateSelection(ctx);
    else duplicateBlock(ctx.section, ctx.block);
    return;
  }

  if (event.key === 'Delete' || event.key === 'Backspace') {
    event.preventDefault();
    if (multiIds.size > 1) {
      // Hele utvalget slettes som ETT angre-steg (blockIds-listen).
      post({ type: 'urd-delete', sectionId: ctx.section.id, blockIds: [...multiIds] });
    } else {
      post({ type: 'urd-delete', sectionId: ctx.section.id, blockId: selectedBlockId });
    }
    selectBlock(null);
    return;
  }

  const dirs = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
  const dir = dirs[event.key];
  if (!dir || isMobile()) return;
  event.preventDefault();

  const stepPx = event.shiftKey ? 1 : ctx.grid.size;
  const pctPerPx = 100 / ctx.host.clientWidth;
  const r1 = (v) => Math.round(v * 10) / 10;

  if (multiIds.size > 1) {
    // Hele utvalget flyttes med samme delta, klemt så gruppen holder
    // seg innenfor bredden; en skur av trykk blir ett angre-steg.
    // Aksen som IKKE flyttes røres aldri (avrunding av en urørt x/y
    // ville etterlatt en usynlig endring som holdt utkastet skittent).
    const parts = selectedEls().map((e) => ({ el: e, ctx: e._urdCtx })).filter((p) => p.ctx);
    const d = dir[0] ? groupDelta(parts.map((p) => p.ctx.block.frames.desktop), r1(dir[0] * stepPx * pctPerPx), 0) : { dx: 0 };
    for (const p of parts) {
      const frame = { ...p.ctx.block.frames.desktop };
      if (dir[0]) frame.x = r1(frame.x + d.dx);
      if (dir[1]) frame.y = frame.y + dir[1] * stepPx;
      p.ctx.block.frames.desktop = frame;
      Object.assign(p.el.style, frameToCss(frame));
      post({ type: 'urd-move', sectionId: p.ctx.section.id, blockId: p.ctx.block.id, frame, frameKey: 'desktop', coalesce: true, groupKey: 'multi-arrow' });
    }
    updateMultiToolbar();
    return;
  }

  const frame = { ...ctx.block.frames.desktop };
  if (dir[0]) frame.x = clamp(r1(frame.x + dir[0] * stepPx * pctPerPx), 0, r1(100 - frame.w));
  if (dir[1]) frame.y = frame.y + dir[1] * stepPx;
  ctx.block.frames.desktop = frame;
  Object.assign(el.style, frameToCss(frame));
  // coalesce: en skur av piltastetrykk blir ett angre-steg.
  post({ type: 'urd-move', sectionId: ctx.section.id, blockId: selectedBlockId, frame, frameKey: 'desktop', coalesce: true });
});

// Aktiv seksjon: paletten i editoren legger nye blokker i den sist klikkede
// seksjonen, markert med en aksentlinje i venstre kant.
//
// markActiveVisual setter KUN klassen (palett-hintet). markActive poster i
// tillegg urd-select-section, som får editoren til å vise SEKSJONENS
// egenskaper - det skal kun skje når man klikker den bare seksjonsflaten,
// aldri når man rører en blokk eller et blokk-håndtak (da bærer blokkens
// eget urd-select-block seksjonskonteksten, og Egenskaper skal bli på
// blokken).
function markActiveVisual(host) {
  document.querySelectorAll('.urd-section-active').forEach((s) => {
    if (s !== host) s.classList.remove('urd-section-active');
  });
  if (host) host.classList.add('urd-section-active');
}
function markActive(host) {
  markActiveVisual(host);
  if (host) post({ type: 'urd-select-section', sectionId: host.dataset.sectionId });
}

document.addEventListener('pointerdown', (event) => {
  const target = event.target instanceof HTMLElement ? event.target : null;
  // Klikk i multi-verktøylinjen skal aldri endre utvalget den virker på.
  if (target?.closest('.urd-multi-toolbar')) return;
  const blockEl = target?.closest('.urd-block') ?? null;
  if (blockEl && event.shiftKey && !isMobile()) {
    toggleMulti(blockEl);
  } else if (blockEl && multiIds.size > 1 && multiIds.has(blockEl.dataset.blockId)) {
    // Klikk på et medlem beholder utvalget (gruppe-dra), men gjør
    // blokken til primær.
    selectBlock(blockEl, { keepMulti: true });
  } else {
    selectBlock(blockEl);
  }
  // Klikk på en blokk skal ikke poste seksjonsvalg (Egenskaper blir på
  // blokken); kun den bare seksjonsflaten bytter til seksjonens egenskaper.
  const host = target?.closest('.urd-section');
  if (blockEl) markActiveVisual(host);
  else markActive(host);
});

// Marquee: dra på tom seksjonsflate tegner en markeringsramme, og alle
// blokker den overlapper blir utvalget (klikk uten dra forblir klikk;
// utvalget avgrenses til seksjonen draget startet i).
document.addEventListener('pointerdown', (event) => {
  if (event.button !== 0 || event.shiftKey || isMobile()) return;
  if (document.body.classList.contains('urd-chrome-off')) return;
  const target = event.target instanceof HTMLElement ? event.target : null;
  const host = target?.closest('.urd-section');
  if (!host) return;
  if (target.closest('.urd-block, .urd-add-block, .urd-add-section, .urd-section-toolbar, .urd-section-resize, .urd-section-resize-top, .urd-hint-chip, .urd-hint-card, .urd-multi-toolbar, .urd-text-toolbar')) return;

  const startRect = host.getBoundingClientRect();
  const start = { x: event.clientX - startRect.left, y: event.clientY - startRect.top };
  let rectEl = null;

  const onMove = (ev) => {
    const hostRect = host.getBoundingClientRect();
    const cur = { x: ev.clientX - hostRect.left, y: ev.clientY - hostRect.top };
    if (!rectEl) {
      if (Math.abs(cur.x - start.x) + Math.abs(cur.y - start.y) < 6) return;
      rectEl = document.createElement('div');
      rectEl.className = 'urd-marquee';
      host.appendChild(rectEl);
      document.body.classList.add('urd-marqueeing');
      document.getSelection()?.removeAllRanges();
    }
    const rect = {
      left: Math.min(start.x, cur.x),
      top: Math.min(start.y, cur.y),
      right: Math.max(start.x, cur.x),
      bottom: Math.max(start.y, cur.y),
    };
    rectEl.style.left = `${rect.left}px`;
    rectEl.style.top = `${rect.top}px`;
    rectEl.style.width = `${rect.right - rect.left}px`;
    rectEl.style.height = `${rect.bottom - rect.top}px`;
    const blocks = [...host.querySelectorAll(':scope > .urd-block')].map((el) => ({
      id: el.dataset.blockId,
      left: el.offsetLeft,
      top: el.offsetTop,
      right: el.offsetLeft + el.offsetWidth,
      bottom: el.offsetTop + el.offsetHeight,
    }));
    multiSectionId = host.dataset.sectionId;
    multiIds = new Set(blocksInRect(rect, blocks));
    applyMultiClasses();
  };
  const onUp = () => {
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerup', onUp);
    document.body.classList.remove('urd-marqueeing');
    if (!rectEl) return;
    rectEl.remove();
    if (multiIds.size < 2) {
      const single = selectedEls()[0] ?? null;
      clearMulti();
      selectBlock(single);
      return;
    }
    selectBlock(selectedEls()[0], { keepMulti: true });
    updateMultiToolbar();
  };
  document.addEventListener('pointermove', onMove);
  document.addEventListener('pointerup', onUp);
});

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/* ---------- Multimarkering: verktøylinje, kopier/lim inn ---------- */

/** Flytende verktøylinje over utvalget: juster/fordel + antall. */
let multiBar = null;

function buildMultiBar() {
  multiBar = document.createElement('div');
  multiBar.className = 'urd-multi-toolbar';
  // Klikk i linjen skal ikke boble til dokumentets markeringslytter.
  multiBar.addEventListener('pointerdown', (event) => event.stopPropagation());

  const count = document.createElement('span');
  count.className = 'urd-multi-count';
  multiBar.appendChild(count);
  multiBar._urdCount = count;

  const svg = (body) => `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">${body}</svg>`;
  const btn = (html, title, run) => {
    const b = document.createElement('button');
    b.innerHTML = html;
    b.title = title;
    b.addEventListener('click', run);
    multiBar.appendChild(b);
    return b;
  };
  btn(svg('<path d="M4 3v18"/><rect x="7" y="6" width="10" height="4"/><rect x="7" y="14" width="14" height="4"/>'), ta('canvas.alignLeft'), () => applyAlign('left'));
  btn(svg('<path d="M12 3v18"/><rect x="7" y="6" width="10" height="4"/><rect x="4" y="14" width="16" height="4"/>'), ta('canvas.alignCenterH'), () => applyAlign('center'));
  btn(svg('<path d="M20 3v18"/><rect x="7" y="6" width="10" height="4"/><rect x="3" y="14" width="14" height="4"/>'), ta('canvas.alignRight'), () => applyAlign('right'));
  btn(svg('<path d="M3 4h18"/><rect x="6" y="7" width="4" height="10"/><rect x="14" y="7" width="4" height="14"/>'), ta('canvas.alignTop'), () => applyAlign('top'));
  btn(svg('<path d="M3 12h18"/><rect x="6" y="7" width="4" height="10"/><rect x="14" y="4" width="4" height="16"/>'), ta('canvas.alignMiddleV'), () => applyAlign('middle'));
  btn(svg('<path d="M3 20h18"/><rect x="6" y="7" width="4" height="10"/><rect x="14" y="3" width="4" height="14"/>'), ta('canvas.alignBottom'), () => applyAlign('bottom'));
  const distH = btn(svg('<path d="M3 3v18M21 3v18"/><rect x="7" y="9" width="3" height="6"/><rect x="14" y="9" width="3" height="6"/>'), ta('canvas.distributeH'), () => applyDistribute('x'));
  const distV = btn(svg('<path d="M3 3h18M3 21h18"/><rect x="9" y="7" width="6" height="3"/><rect x="9" y="14" width="6" height="3"/>'), ta('canvas.distributeV'), () => applyDistribute('y'));
  multiBar._urdDist = [distH, distV];
  document.body.appendChild(multiBar);
}

function updateMultiToolbar() {
  const active = multiIds.size >= 2 && !isMobile() && !document.body.classList.contains('urd-chrome-off');
  if (!active) {
    multiBar?.classList.remove('vis');
    return;
  }
  if (!multiBar) buildMultiBar();
  const els = selectedEls();
  if (els.length < 2) {
    multiBar.classList.remove('vis');
    return;
  }
  multiBar._urdCount.textContent = ta('canvas.selectedCount', { n: els.length });
  // Fordel-knappene krever minst tre blokker (innstillinger kun når relevante).
  for (const b of multiBar._urdDist) b.style.display = els.length >= 3 ? '' : 'none';
  multiBar.classList.add('vis');
  const rects = els.map((el) => el.getBoundingClientRect());
  const left = Math.min(...rects.map((r) => r.left));
  const right = Math.max(...rects.map((r) => r.right));
  const top = Math.min(...rects.map((r) => r.top));
  const x = clamp((left + right) / 2 - multiBar.offsetWidth / 2, 8, window.innerWidth - multiBar.offsetWidth - 8);
  const y = Math.max(8, top - multiBar.offsetHeight - 10);
  multiBar.style.left = `${x}px`;
  multiBar.style.top = `${y}px`;
}

// Linjen følger utvalget ved scrolling/resize (fixed posisjonering).
window.addEventListener('scroll', () => { if (multiIds.size > 1) updateMultiToolbar(); }, { passive: true, capture: true });
window.addEventListener('resize', () => { if (multiIds.size > 1) updateMultiToolbar(); });

/** Utvalgets frames som rene items for align/distribute. */
function selectionItems() {
  return selectedEls()
    .map((el) => {
      const block = el._urdCtx?.block;
      return block ? { id: block.id, ...block.frames.desktop } : null;
    })
    .filter(Boolean);
}

/** Bokfør en liste flyttinger som ETT angre-steg (delt groupKey). */
function applySelectionMoves(moves) {
  if (!moves.length) return;
  const key = makeId('malign');
  for (const move of moves) {
    const el = document.querySelector(`.urd-block[data-block-id="${CSS.escape(move.id)}"]`);
    const ctx = el?._urdCtx;
    if (!ctx) continue;
    const frame = { ...ctx.block.frames.desktop };
    if (typeof move.x === 'number') frame.x = move.x;
    if (typeof move.y === 'number') frame.y = move.y;
    ctx.block.frames.desktop = frame;
    Object.assign(el.style, frameToCss(frame));
    post({ type: 'urd-move', sectionId: ctx.section.id, blockId: move.id, frame, frameKey: 'desktop', coalesce: true, groupKey: key });
  }
  updateMultiToolbar();
}

function applyAlign(mode) {
  applySelectionMoves(alignMoves(selectionItems(), mode));
}

function applyDistribute(axis) {
  applySelectionMoves(distributeMoves(selectionItems(), axis));
}

/** Ctrl+C: utvalget (eller den ene markerte blokken) til utklippstavlen. */
function copySelection(ctx) {
  const ids = multiIds.size > 1 ? multiIds : new Set([selectedBlockId]);
  const blocks = ctx.section.blocks.filter((b) => ids.has(b.id));
  if (!blocks.length) return;
  clipboard = { sectionId: ctx.section.id, blocks: JSON.parse(JSON.stringify(blocks)) };
}

/**
 * Ctrl+V: lim inn utklippstavlen med bevart innbyrdes oppsett - alle
 * blokkene får SAMME forskyvning (litt ned/høyre, klemt av groupDelta
 * så hele gruppen holder seg innenfor seksjonen). Målet er den aktive
 * seksjonen, ellers kildeseksjonen, ellers den første. Sendes samlet
 * som urd-add-blocks = ETT angre-steg, og det nye utvalget markeres.
 */
function pasteClipboard(source = clipboard) {
  if (!source?.blocks?.length) return;
  const host = document.querySelector('.urd-section-active')
    ?? document.querySelector(`.urd-section[data-section-id="${CSS.escape(source.sectionId)}"]`)
    ?? document.querySelector('.urd-section');
  if (!host) return;
  const sectionId = host.dataset.sectionId;
  const r2 = (v) => Math.round(v * 100) / 100;
  const frames = source.blocks.map((b) => b.frames.desktop);
  const { dx, dy } = groupDelta(frames, 2, 16);
  const blocks = source.blocks.map((b) => {
    const copy = JSON.parse(JSON.stringify(b));
    copy.id = makeId('blk');
    copy.frames.desktop = { ...copy.frames.desktop, x: r2(copy.frames.desktop.x + dx), y: copy.frames.desktop.y + dy };
    return copy;
  });
  const minBottom = Math.max(...blocks.map((b) => b.frames.desktop.y + b.frames.desktop.h));
  post({ type: 'urd-add-blocks', sectionId, blocks, minBottom, moves: [] });
  // Nytt lim inn fortsetter fra det innlimte (stables ikke oppå hverandre).
  if (source === clipboard) clipboard = { sectionId, blocks: JSON.parse(JSON.stringify(blocks)) };
  // Det innlimte blir det nye utvalget: rerendringen etter urd-add-blocks
  // leser multiIds/selectedBlockId (enhanceSection), editoren følger etter.
  document.querySelectorAll('.urd-block.urd-selected, .urd-block.urd-multi-selected')
    .forEach((b) => b.classList.remove('urd-selected', 'urd-multi-selected'));
  multiSectionId = sectionId;
  multiIds = blocks.length > 1 ? new Set(blocks.map((b) => b.id)) : new Set();
  selectedBlockId = blocks[0].id;
  post({ type: 'urd-select-block', sectionId, blockId: selectedBlockId });
}

/** Ctrl+D med flerutvalg: dupliser utvalget (via lim inn-flyten). */
function duplicateSelection(ctx) {
  const ids = [...multiIds];
  const blocks = ctx.section.blocks.filter((b) => ids.includes(b.id));
  pasteClipboard({ sectionId: ctx.section.id, blocks: JSON.parse(JSON.stringify(blocks)) });
}

/**
 * Marker en blokk via id (broen: editoren bygde nettopp blokken selv,
 * f.eks. fra «+ Ny blokk»-menyen, og previewen kjenner ikke id-en før
 * seksjonen er rerendret). Kalles ETTER rerendringen.
 */
export function selectById(blockId) {
  const el = document.querySelector(`.urd-block[data-block-id="${CSS.escape(blockId)}"]`);
  if (el) selectBlock(el);
}

/** Dupliser markert blokk (broen: Ctrl+D med fokus i admin-panelene). */
export function duplicateSelected() {
  if (isMobile() || !selectedBlockId) return;
  const ctx = document.querySelector(`.urd-block[data-block-id="${selectedBlockId}"]`)?._urdCtx;
  if (ctx) duplicateBlock(ctx.section, ctx.block);
}

/** Dupliser en blokk: kopi med ny id, litt forskjøvet, i samme seksjon. */
function duplicateBlock(section, block) {
  const copy = JSON.parse(JSON.stringify(block));
  copy.id = makeId('blk');
  const f = copy.frames.desktop;
  copy.frames.desktop = {
    ...f,
    x: clamp(Math.round((f.x + 2) * 100) / 100, 0, Math.max(0, Math.round((100 - f.w) * 100) / 100)),
    y: f.y + 16,
  };
  post({ type: 'urd-add-block', sectionId: section.id, block: copy });
  // Duplikatet blir den markerte blokken: rerendringen etter urd-add-block
  // markerer den (enhanceSection leser selectedBlockId), og editoren følger
  // etter via urd-select-block så Egenskaper-panelet viser kopien.
  document.querySelectorAll('.urd-block.urd-selected').forEach((b) => b.classList.remove('urd-selected'));
  selectedBlockId = copy.id;
  post({ type: 'urd-select-block', sectionId: section.id, blockId: copy.id });
}

/**
 * Synlig grid-overlegg i seksjonen mens man drar/resizer, så snappingen
 * har noe å snappe synlig mot. Linjene tegnes med CSS-gradienter i
 * nøyaktig kolonnebredde/radhøyde.
 */
function showGridOverlay(host, grid) {
  const overlay = document.createElement('div');
  overlay.className = 'urd-grid-overlay';
  overlay.style.backgroundSize = `${grid.size}px ${grid.size}px`;
  host.appendChild(overlay);
  return overlay;
}

function enhanceBlock(el, block, section, grid, host) {
  el.classList.add('urd-editable');
  if (block.id === selectedBlockId) el.classList.add('urd-selected');
  if (block.decor) el.classList.add('urd-decor');
  // Tastaturhåndtereren (piltaster/Delete) trenger blokkens kontekst.
  el._urdCtx = { block, section, grid, host };

  const mobile = isMobile();
  const activeFrame = () =>
    (mobile ? (block.frames.mobile ?? block.frames.desktop) : block.frames.desktop);

  const toolbar = document.createElement('div');
  toolbar.className = 'urd-edit-toolbar';

  // Den felles bildeeditoren for bildeblokker: alle feltene, med live DOM-oppdatering
  // (kun bildebytte trenger rerender, og da lukkes panelet).
  const openBlockImageEditor = () => {
    const frame = () => el.querySelector('.urd-image-frame');
    // Full editor: bytt/fjern, alt, tilpasning, zoom, avrunding, lenke,
    // fokuspunkt (med tredelingsgitter) og filtre (gråtone/nullstill).
    openImageEditor(frame() ?? el.querySelector('img') ?? el, {
      fields: ['image', 'remove', 'alt', 'fit', 'zoom', 'radius', 'href', 'focus', 'filters'],
      get: (field) => (field === 'image' ? block.props.src || null : block.props[field]),
      set: (field, value) => {
        const key = field === 'image' ? 'src' : field;
        block.props = { ...block.props, [key]: value };
        // Bytte/fjerne bilde krever ny render (rammen bygges på nytt); andre
        // felt oppdateres live via den delte applyImageStyle.
        const node = frame();
        if (node && field !== 'image') applyImageStyle(node, block.props);
        post({ type: 'urd-edit', sectionId: section.id, blockId: block.id, props: block.props, rerender: field === 'image' });
      },
    });
  };
  if (block.type === 'image' && !mobile) {
    el.addEventListener('dblclick', (event) => {
      event.preventDefault();
      openBlockImageEditor();
    });
  }

  const moveHandle = document.createElement('button');
  moveHandle.className = 'urd-edit-move';
  moveHandle.textContent = '⠿';
  moveHandle.title = ta('canvas.dragMove');
  toolbar.appendChild(moveHandle);

  // z-orden: legg blokken øverst/nederst blant seksjonens blokker.
  const bumpZ = (dir) => {
    const others = section.blocks.filter((b) => b.id !== block.id);
    const zs = others.map((b) => b.frames.desktop.z ?? 1);
    let z;
    if (dir > 0) {
      z = zs.length ? Math.max(...zs) + 1 : 1;
    } else if (!zs.length || Math.min(...zs) > 1) {
      z = 1;
    } else {
      // Noen ligger allerede på bunnen: skyv de andre ett hakk opp i
      // stedet, så denne kan legges nederst (z går aldri under 1).
      z = 1;
      for (const other of others) {
        const frame = { ...other.frames.desktop, z: (other.frames.desktop.z ?? 1) + 1 };
        other.frames.desktop = frame;
        host.querySelector(`[data-block-id="${other.id}"]`)?.style.setProperty('z-index', String(frame.z));
        // groupKey samler hele z-omordningen (alle blokkene) i ETT angre-steg hos editoren.
        post({ type: 'urd-move', sectionId: section.id, blockId: other.id, frame, coalesce: true, groupKey: `z-${block.id}` });
      }
    }
    const frame = { ...block.frames.desktop, z };
    block.frames.desktop = frame;
    el.style.zIndex = String(z);
    post({ type: 'urd-move', sectionId: section.id, blockId: block.id, frame, coalesce: true, groupKey: `z-${block.id}` });
  };
  // Struktur (z-orden, dekor, sletting) redigeres i desktopvisning;
  // mobilvisningen er ren layoutjustering.
  if (!mobile) {
    const Z_FRONT_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h14"/><path d="M12 20V9"/><path d="M7 13l5-5 5 5"/></svg>';
    const Z_BACK_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 20h14"/><path d="M12 4v11"/><path d="M7 11l5 5 5-5"/></svg>';
    const frontBtn = document.createElement('button');
    frontBtn.innerHTML = Z_FRONT_SVG;
    frontBtn.title = ta('canvas.zFront');
    frontBtn.addEventListener('click', () => bumpZ(1));
    toolbar.appendChild(frontBtn);

    const backBtn = document.createElement('button');
    backBtn.innerHTML = Z_BACK_SVG;
    backBtn.title = ta('canvas.zBack');
    backBtn.addEventListener('click', () => bumpZ(-1));
    toolbar.appendChild(backBtn);

    // Dekor-flagget vises som mobil-synlighet - det er det flagget GJØR:
    // telefon = blokken vises i automatisk mobil-layout, overstrøket
    // telefon = den skjules (pynt/dekor). Ikonet ER tilstanden (tegnet
    // SVG, ikke emoji); tooltipen forklarer klikket.
    const PHONE_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M10.5 18.2h3"/></svg>';
    const PHONE_OFF_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M10.5 18.2h3"/><path d="M3.5 3.5l17 17"/></svg>';
    const decorBtn = document.createElement('button');
    decorBtn.className = 'urd-edit-decor';
    const syncDecor = () => {
      decorBtn.innerHTML = block.decor ? PHONE_OFF_SVG : PHONE_SVG;
      decorBtn.title = block.decor
        ? ta('canvas.decorHidden')
        : ta('canvas.decorShown');
      decorBtn.classList.toggle('on', Boolean(block.decor));
    };
    syncDecor();
    decorBtn.addEventListener('click', () => {
      block.decor = !block.decor;
      el.classList.toggle('urd-decor', block.decor);
      syncDecor();
      post({ type: 'urd-block-flag', sectionId: section.id, blockId: block.id, decor: block.decor });
    });
    toolbar.appendChild(decorBtn);

    const DUP_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>';
    if (block.type === 'image') {
      const imgBtn = document.createElement('button');
      imgBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3l4 4L8 20l-5 1 1-5L17 3z"/></svg>';
      imgBtn.title = ta('canvas.editImage');
      imgBtn.addEventListener('click', () => openBlockImageEditor());
      toolbar.appendChild(imgBtn);
    }

    const dupBtn = document.createElement('button');
    dupBtn.innerHTML = DUP_SVG;
    dupBtn.title = ta('canvas.duplicate');
    dupBtn.addEventListener('click', () => duplicateBlock(section, block));
    toolbar.appendChild(dupBtn);

    // Blokkmeny: alle blokk-innstillingene i en flytende meny ved blokken
    // (kalender-mønsteret, valgt 23. juli 2026). Selve menyen bor i
    // editoren (samme kontroller som Egenskaper); her meldes kun hvor.
    const GEAR_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2-1.2L14.2 3h-4l-.4 2.7a7 7 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5a7 7 0 0 0 0 2.4l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 2 1.2l.4 2.7h4l.4-2.7a7 7 0 0 0 2-1.2l2.3 1 2-3.4-2-1.5c.06-.4.1-.8.1-1.2z"/></svg>';
    const menuBtn = document.createElement('button');
    menuBtn.innerHTML = GEAR_SVG;
    menuBtn.title = ta('canvas.blockMenu');
    // Uten stopp ville pointerdown boble til dokumentets markeringslytter,
    // som kan utløse en re-render (seksjonsaktivering) FØR click fyrer -
    // og da byttes knappen ut midt i klikket (samme vern som håndtakene).
    menuBtn.addEventListener('pointerdown', (event) => event.stopPropagation());
    menuBtn.addEventListener('click', () => {
      selectBlock(el);
      const r = el.getBoundingClientRect();
      post({
        type: 'urd-block-menu',
        sectionId: section.id,
        blockId: block.id,
        rect: { left: r.left, top: r.top, right: r.right, bottom: r.bottom },
      });
    });
    toolbar.appendChild(menuBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'urd-edit-delete';
    deleteBtn.textContent = '×';
    deleteBtn.title = ta('canvas.deleteBlock');
    deleteBtn.addEventListener('click', () => {
      post({ type: 'urd-delete', sectionId: section.id, blockId: block.id });
      // Uten avvalg ville en fantom-markering av den slettede blokken overleve i modultilstanden.
      selectBlock(null);
    });
    toolbar.appendChild(deleteBtn);
  }
  el.appendChild(toolbar);

  const resizeHandle = document.createElement('div');
  resizeHandle.className = 'urd-edit-resize';
  resizeHandle.title = ta('canvas.dragResize');
  el.appendChild(resizeHandle);

  wireDrag(moveHandle, 'move');
  wireDrag(resizeHandle, 'resize');
  // Hele blokkflaten kan også dras direkte (⠿ består). Terskel gjør at
  // klikk forblir klikk; redigerbar tekst og håndtak er unntatt.
  wireDrag(el, 'move', { surface: true });
  // Lenker/bilder skal aldri starte nettleserens egen dra-oppførsel.
  el.addEventListener('dragstart', (event) => event.preventDefault());

  // Rotasjonshåndtak (kun desktop: rot bor i desktop-framen). Dras rundt
  // blokkens sentrum; snapper til 15°-steg, Shift gir fri vinkel.
  if (!mobile) {
    const rotHandle = document.createElement('div');
    rotHandle.className = 'urd-edit-rotate';
    rotHandle.textContent = '⟳';
    rotHandle.title = ta('canvas.dragRotate');
    el.appendChild(rotHandle);

    rotHandle.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      event.stopPropagation();
      markActiveVisual(host);
      selectBlock(el, { keepMulti: multiIds.has(block.id) });
      rotHandle.setPointerCapture(event.pointerId);
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const angleAt = (ev) => (Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180) / Math.PI;
      const startAngle = angleAt(event);
      const orig = block.frames.desktop.rot ?? 0;
      let rot = orig;

      const onMove = (ev) => {
        rot = orig + (angleAt(ev) - startAngle);
        rot = ev.shiftKey ? Math.round(rot) : Math.round(rot / 15) * 15;
        if (rot > 180) rot -= 360;
        if (rot < -180) rot += 360;
        el.style.transform = rot ? `rotate(${rot}deg)` : '';
      };
      const onUp = () => {
        rotHandle.removeEventListener('pointermove', onMove);
        rotHandle.removeEventListener('pointerup', onUp);
        if (rot === orig) return;
        const frame = { ...block.frames.desktop, rot };
        block.frames.desktop = frame;
        post({ type: 'urd-move', sectionId: section.id, blockId: block.id, frame, frameKey: 'desktop' });
      };
      rotHandle.addEventListener('pointermove', onMove);
      rotHandle.addEventListener('pointerup', onUp);
    });
  }

  /**
   * Felles dra-logikk for flytting og resize. Piksler oversettes til
   * grid-enheter og rundes fortløpende, så blokken snapper synlig
   * mens man drar. Ved slipp meldes den nye framen til editoren.
   */
  function wireDrag(handle, kind, opts = {}) {
    handle.addEventListener('pointerdown', (event) => {
      if (opts.surface) {
        const target = event.target instanceof HTMLElement ? event.target : null;
        // Redigerbar tekst er kun unntatt når blokken ALT er valgt (da
        // redigerer man teksten). En uvalgt blokk dras fritt også fra
        // teksten - klikk uten dra velger den, klikk igjen redigerer.
        if (target?.closest('.urd-text[contenteditable="true"]') && selectedBlockId === block.id && multiIds.size <= 1) return;
        if (target?.closest('.urd-edit-toolbar, .urd-edit-resize, .urd-edit-rotate, button, input, select, textarea, .urd-samling-editable, .urd-samling-image-edit, .urd-faq-q, .urd-kal-config, .urd-skjema-config, .urd-kart-config')) return;
        // Auto-mobil: første materialisering skal være et bevisst valg
        // (dra i ⠿), ikke et klikk på blokken.
        if (mobile && (section.responsive?.mobile?.mode ?? 'auto') !== 'manual') return;
        event.preventDefault();
      } else {
        event.preventDefault();
        event.stopPropagation();
        markActiveVisual(host);
        // Grep i ⠿/resize på et utvalgs-medlem skal ikke kollapse utvalget.
        selectBlock(el, { keepMulti: multiIds.has(block.id) });
      }
      handle.setPointerCapture(event.pointerId);

      // Første håndjustering i mobilvisning: seksjonen materialiseres
      // (auto → manuell) før draet fortsetter på samme element.
      if (mobile && (section.responsive?.mobile?.mode ?? 'auto') !== 'manual') {
        materializeMobile(host, section);
      }
      const frameKey = mobile ? 'mobile' : 'desktop';

      // Flate-dra starter først etter en liten terskel, så klikk
      // (markering, caret) forblir klikk.
      const threshold = opts.surface ? 4 : 0;
      let started = threshold === 0;

      const start = { x: event.clientX, y: event.clientY };
      const orig = { ...(block.frames[frameKey] ?? block.frames.desktop) };
      // Gruppe-dra: er blokken del av et flerutvalg, følger resten med
      // (samme delta, klemt så hele gruppen holder seg innenfor bredden).
      const groupParts = (!mobile && kind === 'move' && multiIds.size > 1 && multiIds.has(block.id))
        ? [...host.querySelectorAll(':scope > .urd-block')]
            .filter((o) => o !== el && multiIds.has(o.dataset.blockId))
            .map((o) => {
              const b = section.blocks.find((x) => x.id === o.dataset.blockId);
              return b ? { el: o, block: b, orig: { ...b.frames.desktop } } : null;
            })
            .filter(Boolean)
        : [];
      const groupKey = groupParts.length ? makeId('mdrag') : null;
      // Frames er fysiske (x/w i %, y/h i px); gridet styrer KUN hva vi
      // snapper mot: kvadratiske ruter på grid.size px. Snap av gir fri
      // plassering (0,1 % / 1 px-presisjon).
      const pctPerPx = 100 / host.clientWidth;
      const colStep = grid.size * pctPerPx;
      const r2 = (v) => Math.round(v * 100) / 100;
      const overlay = showGridOverlay(host, grid);
      let current = orig;

      // Smart guides (à la Wix): naboblokkers kanter/senter + seksjonens
      // midtlinje som snappelinjer. Målene samles ved dra-start.
      const GUIDE_TOL = 5;
      const xTargets = [host.clientWidth / 2];
      const yTargets = [];
      for (const other of host.querySelectorAll(':scope > .urd-block')) {
        if (other === el) continue;
        const left = other.offsetLeft;
        const top = other.offsetTop;
        xTargets.push(left, left + other.offsetWidth / 2, left + other.offsetWidth);
        yTargets.push(top, top + other.offsetHeight / 2, top + other.offsetHeight);
      }
      const guideEls = [];
      const clearGuides = () => {
        for (const g of guideEls) g.remove();
        guideEls.length = 0;
      };
      const drawGuide = (axis, px) => {
        const g = document.createElement('div');
        g.className = `urd-smart-guide urd-smart-guide-${axis}`;
        if (axis === 'v') g.style.left = `${px}px`;
        else g.style.top = `${px}px`;
        host.appendChild(g);
        guideEls.push(g);
      };
      /** Justerer current mot nærmeste snappelinje og tegner den. */
      const applyGuides = () => {
        clearGuides();
        if (kind !== 'move') return;
        const wPx = (current.w / 100) * host.clientWidth;
        let leftPx = (current.x / 100) * host.clientWidth;
        let best = null;
        for (const t of xTargets) {
          for (const edge of [0, wPx / 2, wPx]) {
            const d = t - (leftPx + edge);
            if (Math.abs(d) <= GUIDE_TOL && (!best || Math.abs(d) < Math.abs(best.d))) best = { d, line: t };
          }
        }
        if (best) {
          leftPx += best.d;
          current = { ...current, x: clamp(r2((leftPx * 100) / host.clientWidth), 0, r2(100 - current.w)) };
          drawGuide('v', best.line);
        }
        best = null;
        for (const t of yTargets) {
          for (const edge of [0, current.h / 2, current.h]) {
            const d = t - (current.y + edge);
            if (Math.abs(d) <= GUIDE_TOL && (!best || Math.abs(d) < Math.abs(best.d))) best = { d, line: t };
          }
        }
        if (best) {
          current = { ...current, y: current.y + best.d };
          drawGuide('h', best.line);
        }
      };

      const onMove = (ev) => {
        if (!started) {
          if (Math.abs(ev.clientX - start.x) + Math.abs(ev.clientY - start.y) < threshold) return;
          started = true;
        }
        // Shift holdt inne = midlertidig fri plassering (0,1 % / 1 px);
        // ellers styrer grid.snap.
        const free = grid.snap === false || ev.shiftKey;
        const snapPct = free ? (v) => Math.round(v * 10) / 10 : (v) => r2(Math.round(v / colStep) * colStep);
        const snapPx = free ? Math.round : (v) => Math.round(v / grid.size) * grid.size;
        const dx = (ev.clientX - start.x) * pctPerPx;
        const dy = ev.clientY - start.y;
        current = kind === 'move'
          ? {
              ...orig,
              x: clamp(snapPct(orig.x + dx), 0, r2(100 - orig.w)),
              // y er ubegrenset i begge retninger: blokker kan bevisst
              // henge over seksjonstoppen, akkurat som under bunnen.
              y: snapPx(orig.y + dy),
            }
          : {
              ...orig,
              w: clamp(snapPct(orig.w + dx), r2(colStep), r2(100 - orig.x)),
              h: Math.max(4, snapPx(orig.h + dy)),
            };
        // Shift = helt fritt: da hopper vi også over smart guides.
        if (!free) applyGuides();
        else clearGuides();
        if (groupParts.length) {
          // Deltaet klemmes mot gruppens samlede bredde-grenser; y er
          // ubegrenset som ved enkelt-dra (blokker kan henge utenfor).
          const d = groupDelta([orig, ...groupParts.map((g) => g.orig)], current.x - orig.x, 0);
          const dyPx = current.y - orig.y;
          current = { ...current, x: r2(orig.x + d.dx) };
          for (const g of groupParts) {
            Object.assign(g.el.style, frameToCss({ ...g.orig, x: r2(g.orig.x + d.dx), y: g.orig.y + dyPx }));
          }
          updateMultiToolbar();
        }
        Object.assign(el.style, frameToCss(current));
      };

      const onUp = () => {
        handle.removeEventListener('pointermove', onMove);
        handle.removeEventListener('pointerup', onUp);
        overlay.remove();
        clearGuides();
        if (!started) return;

        // Gruppe-dra: bokfør hele utvalget som ETT angre-steg (delt
        // groupKey) og hopp over seksjonsbytte (utvalget bor i én seksjon).
        if (groupParts.length) {
          if (current.x === orig.x && current.y === orig.y) return;
          const dx = r2(current.x - orig.x);
          const dyPx = current.y - orig.y;
          block.frames.desktop = current;
          post({ type: 'urd-move', sectionId: section.id, blockId: block.id, frame: current, frameKey: 'desktop', coalesce: true, groupKey });
          for (const g of groupParts) {
            const frame = { ...g.orig, x: r2(g.orig.x + dx), y: g.orig.y + dyPx };
            g.block.frames.desktop = frame;
            post({ type: 'urd-move', sectionId: section.id, blockId: g.block.id, frame, frameKey: 'desktop', coalesce: true, groupKey });
          }
          return;
        }

        // Slippes blokkens SENTRUM over en annen seksjon (desktop),
        // flytter blokken dit - grid og tilhørighet skal følge seksjonen
        // den faktisk ligger i, ikke den den kom fra.
        if (kind === 'move' && !mobile) {
          const rect = el.getBoundingClientRect();
          const target = document
            .elementsFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)
            .find((n) => n instanceof HTMLElement && n.classList.contains('urd-section'));
          if (target && target.dataset.sectionId !== section.id) {
            const tRect = target.getBoundingClientRect();
            const frame = { ...current, y: Math.round(rect.top - tRect.top) };
            post({
              type: 'urd-move-block-section',
              fromSectionId: section.id,
              toSectionId: target.dataset.sectionId,
              blockId: block.id,
              frame,
            });
            return;
          }
        }

        if (current.x !== orig.x || current.y !== orig.y || current.w !== orig.w || current.h !== orig.h) {
          block.frames[frameKey] = current;
          post({ type: 'urd-move', sectionId: section.id, blockId: block.id, frame: current, frameKey });
        }
      };

      handle.addEventListener('pointermove', onMove);
      handle.addEventListener('pointerup', onUp);
    });
  }
}
