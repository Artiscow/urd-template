/**
 * Kjerneblokk: tekst. Rik tekst (HTML skrevet av sideeieren via editoren)
 * med justering. Innholdet er eierens eget og regnes som betrodd; det er
 * samme tillitsmodell som at eieren kan redigere filene i repoet direkte.
 */
import { stripActiveContent } from '../sanitize.js';
import { boxStyleCss } from '../box-style.js';

// Seed-regelen (ADR-0012): ta() kalles kun i defaults() ved innsetting i preview, aldri på modulnivå.
import { ta } from '../i18n.js';

export const textBlock = {
  version: 1,
  label: 'Tekst',
  labelKey: 'blocks.text',
  defaults: () => ({ html: ta('seed.text'), align: 'left', box: false }),
  migrations: {},
  /**
   * @param {HTMLElement} el Blokk-elementet (posisjonert av render.js)
   * @param {{html: string, align: string, box?: boolean, boxStyle?: object, font?: string, size?: number, lineHeight?: number, letterSpacing?: number}} props
   * @param {object} ctx Render-kontekst
   */
  render(el, props, ctx) {
    // Teksten lever i et eget indre element: redigeringshåndtakene som
    // preview-edit legger på blokken skal ALDRI havne i det redigerbare
    // innholdet (eller i lagret props.html).
    const content = document.createElement('div');
    // Tekstboks-varianten: samme blokk, men innholdet ligger i et kort
    // (temaets flatefarge, kantlinje, radius). Valgfritt felt; eldre
    // data mangler det og rendres som før.
    content.className = props.box ? 'urd-text urd-text-box' : 'urd-text';
    content.style.cssText = 'width:100%;min-height:100%;';
    // Valgfri kortstil (additivt; tomt = basisstilen i .urd-text-box).
    if (props.box) Object.assign(content.style, boxStyleCss(props.boxStyle));
    content.style.textAlign = props.align;
    // Valgfri font/størrelse per tekstblokk (additivt; tomt = arv fra tema).
    if (props.font) content.style.fontFamily = props.font;
    if (props.size) content.style.fontSize = `${props.size}px`;
    // Valgfri linje- og bokstavavstand per felt (additivt; tomt = arv).
    // Linjeavstanden er enhetsløs (skalerer med skriftstørrelsen);
    // bokstavavstanden er px og kan være negativ (tettere enn normalt).
    if (props.lineHeight) content.style.lineHeight = String(props.lineHeight);
    if (typeof props.letterSpacing === 'number' && props.letterSpacing !== 0) {
      content.style.letterSpacing = `${props.letterSpacing}px`;
    }
    content.innerHTML = props.html;
    // Selvhelbreder: innhold lagret av eldre Urd kan inneholde
    // håndtak-markup, også foreldreløse knapper etter at nettleser-
    // redigering splittet wrapperen. Tekstinnhold skal aldri inneholde
    // knapper, så alle fjernes ved rendering (lagres rent ved neste edit).
    content.querySelectorAll('.urd-edit-toolbar, .urd-edit-resize, .urd-edit-rotate, button').forEach((n) => n.remove());
    // Besøkende-vern (delt med samlingsinnslag): kjørbar kode strippes alltid ved rendering.
    stripActiveContent(content);
    el.appendChild(content);

    // Klikk-og-skriv: i preview-modus (inne i editorens iframe) er teksten
    // direkte redigerbar, og hver endring meldes til editoren, som eier
    // utkastet. Blokk-id ligger på blokk-elementet (satt av render.js).
    // Kun i desktopvisning: mobilvisningen er layoutjustering, og
    // tekstvekst skriver desktop-framen.
    if (ctx.preview && ctx.viewport !== 'mobile') {
      content.contentEditable = 'true';
      content.addEventListener('input', () => {
        const post = (msg) => window.parent?.postMessage(msg, location.origin);

        // Voks med innholdet: blir teksten høyere enn framen, utvides
        // framen (og seksjonen om nødvendig) så ingenting klippes eller
        // overlapper. Måles på innholdselementet, så håndtakene aldri
        // teller med. Veksten hører til samme angre-steg som skrivingen.
        if (content.scrollHeight > el.clientHeight) {
          const block = ctx.section.blocks.find((b) => b.id === el.dataset.blockId);
          if (block) {
            const step = ctx.grid?.size ?? 8;
            const newH = Math.ceil(content.scrollHeight / step) * step;
            block.frames.desktop = { ...block.frames.desktop, h: newH };
            el.style.height = `${newH}px`;
            // Seksjonen røres ikke: vokser teksten forbi kanten, henger
            // den over (seksjoner klipper aldri, og høyden er brukerens).
            post({ type: 'urd-move', sectionId: ctx.section.id, blockId: block.id, frame: block.frames.desktop, coalesce: true });
          }
        }

        post({
          type: 'urd-edit',
          sectionId: ctx.section.id,
          blockId: el.dataset.blockId,
          props: { ...props, html: content.innerHTML },
        });
      });
    }
  },
};
