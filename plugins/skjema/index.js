/**
 * Skjema-referansepluginen (v0.6 M4): et kontaktskjema etter ApeironLF-modellen.
 * Sender som standard via mottakerens e-postklient (mailto, null oppsett), eller
 * til et valgfritt endepunkt (eierens Apps Script / Pages Function) via fetch.
 * Honeypot-felt mot bots. Følger kalender-referansen: egen CSS via én style-tag,
 * hover-konfigpanel, hjelpechip (ADR-0008), temastyrte nedtrekk (ADR-0009).
 *
 * Besøkende-input settes ALDRI som HTML (kun .value/textContent). Endepunkt-modus
 * krever at eieren åpner connect-src for endepunktet i _headers (ADR-0006);
 * blir innsendingen blokkert, forklarer blokken den nøyaktige linjen.
 */
import {
  isSpam, validate, buildMailto, buildPayload, endpointOrigin,
} from './form.js';
import { createDropdown } from '/assets/urd/dropdown.js';
// Flerspråk (ADR-0012): t() for besøkende-tekster (site-språket), ta() for
// editor-chromen og seed-defaults (admin-språket). Ordboka (locales/) lastes
// av plugin-lasteren FØR register() - t/ta kalles aldri på modulnivå.
import { t, ta } from '/assets/urd/i18n.js';

/** Felttype-id + etikett-NØKKEL (ta-oppslag ved bruk; aldri på modulnivå). */
const FIELD_TYPES = [['text', 'skjema.edit.typeText'], ['email', 'skjema.edit.typeEmail'], ['tel', 'skjema.edit.typeTel'], ['textarea', 'skjema.edit.typeTextarea']];

const el2 = (tag, className, textContent) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (textContent != null) node.textContent = textContent;
  return node;
};

const fieldId = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(3));
  return 'f' + [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
};

const post = (msg) => window.parent?.postMessage(msg, location.origin);

/* ---------- Skjemarendering ---------- */

function fieldControl(field) {
  const control = field.type === 'textarea'
    ? el2('textarea', 'urd-skjema-input')
    : el2('input', 'urd-skjema-input');
  if (field.type !== 'textarea') control.type = field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'text';
  if (field.type === 'textarea') control.rows = 4;
  control.name = field.id;
  control.id = `${field.id}-in`;
  if (field.required) control.required = true;
  control.dataset.fieldId = field.id;
  return control;
}

function renderForm(host, props, ctx) {
  const fields = props.fields ?? [];
  const form = el2('form', 'urd-skjema-form');
  form.noValidate = true;

  const controls = {};
  for (const field of fields) {
    const row = el2('label', 'urd-skjema-row');
    const labelText = el2('span', 'urd-skjema-label', field.label + (field.required ? ' *' : ''));
    const control = fieldControl(field);
    controls[field.id] = control;
    const error = el2('span', 'urd-skjema-error');
    error.dataset.for = field.id;
    row.append(labelText, control, error);
    form.appendChild(row);
  }

  // Honeypot: skjult for mennesker, bots fyller det ut. Aldri synlig, aldri tab-bar.
  const honeypot = el2('input', 'urd-skjema-hp');
  honeypot.type = 'text';
  honeypot.name = 'nettside';
  honeypot.tabIndex = -1;
  honeypot.autocomplete = 'off';
  honeypot.setAttribute('aria-hidden', 'true');
  form.appendChild(honeypot);

  const submit = el2('button', 'urd-skjema-submit', props.submitLabel || t('skjema.send'));
  submit.type = 'submit';
  form.appendChild(submit);

  const status = el2('p', 'urd-skjema-status');
  form.appendChild(status);

  const showErrors = (errors) => {
    for (const field of fields) {
      const cell = form.querySelector(`.urd-skjema-error[data-for="${field.id}"]`);
      if (cell) cell.textContent = errors[field.id] ?? '';
    }
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.className = 'urd-skjema-status';
    status.textContent = '';
    const values = {};
    for (const field of fields) values[field.id] = controls[field.id]?.value ?? '';

    // Spam: lat som om det gikk bra, men send ingenting (ikke tips boten).
    if (isSpam(honeypot.value)) {
      status.classList.add('ok');
      status.textContent = props.successText || t('skjema.thanks');
      return;
    }

    const result = validate(fields, values, { required: t('skjema.required'), email: t('skjema.invalidEmail') });
    showErrors(result.errors);
    if (!result.ok) return;

    if (ctx.preview) {
      status.classList.add('ok');
      status.textContent = ta('skjema.edit.previewOk');
      return;
    }

    const done = () => {
      status.classList.add('ok');
      status.textContent = props.successText || t('skjema.thanks');
      form.reset();
    };

    if ((props.mode ?? 'mailto') === 'endpoint' && props.endpoint) {
      submit.disabled = true;
      try {
        const res = await fetch(props.endpoint, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(buildPayload(fields, values, { side: location.pathname })),
        });
        if (!res.ok) throw new Error(String(res.status));
        done();
      } catch {
        status.classList.add('feil');
        status.textContent = t('skjema.sendFailed');
      } finally {
        submit.disabled = false;
      }
    } else {
      const url = buildMailto(props.recipient, props.subject || t('skjema.subjectDefault'), fields, values);
      if (!url) {
        status.classList.add('feil');
        status.textContent = t('skjema.noRecipient');
        return;
      }
      window.location.href = url;
      done();
    }
  });

  host.appendChild(form);
}

/* ---------- Konfigpanel (i forhåndsvisningen) ---------- */

function configPanel(el, props, ctx) {
  const gear = el2('button', 'urd-skjema-gear urd-cfg-toggle', `⚙ ${ta('skjema.edit.gear')}`);
  gear.type = 'button';
  gear.title = ta('skjema.edit.gearTitle');
  const panel = el2('div', 'urd-skjema-config');

  const label = (text) => el2('div', 'urd-skjema-config-label', text);
  const textInput = (value, placeholder) => {
    const input = el2('input', 'urd-skjema-config-input');
    input.value = value ?? '';
    if (placeholder) input.placeholder = placeholder;
    return input;
  };

  let mode = props.mode ?? 'mailto';
  const recipient = textInput(props.recipient, ta('skjema.edit.recipientPh'));
  const subject = textInput(props.subject, ta('skjema.edit.subjectPh'));
  const endpoint = textInput(props.endpoint, ta('skjema.edit.endpointPh'));
  const submitLabel = textInput(props.submitLabel, ta('skjema.edit.sendDefault'));
  const successText = textInput(props.successText, ta('skjema.edit.thanksDefault'));

  const modeRow = el2('div', 'urd-skjema-config-row');
  const modeDd = createDropdown({
    value: mode,
    title: ta('skjema.edit.modeTitle'),
    options: [['mailto', ta('skjema.edit.modeMailto')], ['endpoint', ta('skjema.edit.modeEndpoint')]],
    onchange: (value) => { mode = value; syncMode(); },
  });
  modeRow.appendChild(modeDd.el);

  const mailtoBox = el2('div', 'urd-skjema-config-box');
  mailtoBox.append(label(ta('skjema.edit.recipient')), recipient, label(ta('skjema.edit.subject')), subject);
  const endpointBox = el2('div', 'urd-skjema-config-box');
  endpointBox.append(label(ta('skjema.edit.endpoint')), endpoint,
    el2('p', 'urd-skjema-config-note', ta('skjema.edit.endpointNote')));
  const syncMode = () => {
    mailtoBox.style.display = mode === 'mailto' ? '' : 'none';
    endpointBox.style.display = mode === 'endpoint' ? '' : 'none';
  };
  syncMode();

  // Feltredigering: legg til, endre navn/type/påkrevd, fjern.
  let fields = (props.fields ?? []).map((f) => ({ ...f }));
  const fieldList = el2('div', 'urd-skjema-fieldlist');
  const renderFields = () => {
    fieldList.replaceChildren();
    fields.forEach((field, index) => {
      const row = el2('div', 'urd-skjema-fieldrow');
      const name = textInput(field.label, ta('skjema.edit.fieldNamePh'));
      name.addEventListener('input', () => { field.label = name.value; });
      const typeDd = createDropdown({
        value: field.type,
        options: FIELD_TYPES.map(([value, key]) => [value, ta(key)]),
        onchange: (value) => { field.type = value; },
      });
      const req = el2('label', 'urd-skjema-fieldreq');
      const reqBox = el2('input');
      reqBox.type = 'checkbox';
      reqBox.checked = field.required !== false;
      reqBox.addEventListener('change', () => { field.required = reqBox.checked; });
      req.append(reqBox, document.createTextNode(` ${ta('skjema.edit.required')}`));
      const del = el2('button', 'urd-skjema-fielddel', '✕');
      del.type = 'button';
      del.title = ta('skjema.edit.removeField');
      del.addEventListener('click', () => { fields.splice(index, 1); renderFields(); });
      row.append(name, typeDd.el, req, del);
      fieldList.appendChild(row);
    });
  };
  renderFields();
  const addField = el2('button', 'urd-skjema-addfield', ta('skjema.edit.addField'));
  addField.type = 'button';
  addField.addEventListener('click', () => {
    fields.push({ id: fieldId(), label: ta('skjema.edit.newField'), type: 'text', required: false });
    renderFields();
  });

  const apply = el2('button', 'urd-skjema-apply', ta('common.apply'));
  apply.type = 'button';
  apply.addEventListener('click', () => {
    const cleaned = fields
      .map((f) => ({ id: f.id || fieldId(), label: (f.label || ta('skjema.edit.fieldFallback')).trim(), type: f.type || 'text', required: f.required !== false }))
      .filter((f) => f.label);
    post({
      type: 'urd-edit',
      sectionId: ctx.section.id,
      blockId: el.dataset.blockId,
      props: {
        recipient: recipient.value.trim(),
        subject: subject.value.trim(),
        mode,
        endpoint: endpoint.value.trim(),
        submitLabel: submitLabel.value.trim() || ta('skjema.edit.sendDefault'),
        successText: successText.value.trim() || ta('skjema.edit.thanksDefault'),
        fields: cleaned,
      },
      rerender: true,
    });
    close();
  });

  panel.append(
    label(ta('skjema.edit.mode')), modeRow, mailtoBox, endpointBox,
    label(ta('skjema.edit.fields')), fieldList, addField,
    label(ta('lbl.buttonText')), submitLabel,
    label(ta('skjema.edit.receipt')), successText,
    apply,
  );

  const onOutside = (event) => {
    if (!panel.isConnected) { close(); return; }
    if (panel.contains(event.target) || event.target === gear || event.target.closest('.urd-dd-menu')) return;
    close();
  };
  function close() {
    panel.classList.remove('vis');
    document.removeEventListener('pointerdown', onOutside, true);
  }
  gear.addEventListener('click', (event) => {
    event.stopPropagation();
    if (panel.classList.toggle('vis')) {
      setTimeout(() => document.addEventListener('pointerdown', onOutside, true), 0);
    } else {
      close();
    }
  });
  return [gear, panel];
}

/* ---------- Autovekst (samme mønster som samling/kalender) ---------- */

function autoGrow(el, host, ctx) {
  const needed = host.scrollHeight;
  if (Math.abs(needed - el.clientHeight) > 8 && ctx.viewport !== 'mobile') {
    el.style.height = `${needed}px`;
    const sectionEl = el.closest('.urd-section');
    if (sectionEl) {
      const bottom = el.offsetTop + needed + 24;
      const current = Number.parseFloat(sectionEl.style.minHeight) || 0;
      if (bottom > current) sectionEl.style.minHeight = `${bottom}px`;
    }
    if (ctx.preview) {
      const block = ctx.section?.blocks?.find((b) => b.id === el.dataset.blockId);
      if (block && block.frames.desktop.h !== needed) {
        block.frames.desktop = { ...block.frames.desktop, h: needed };
        // KUN høyden meldes (urd-grow), aldri hele framen: ellers ville en
        // dratt blokk teleporteres tilbake til snapshotets gamle x/y.
        post({ type: 'urd-grow', sectionId: ctx.section.id, blockId: el.dataset.blockId, h: needed });
      }
    }
  }
}

/* ---------- CSS ---------- */

const SKJEMA_CSS = `
.urd-skjema { width: 100%; position: relative; display: grid; gap: 10px; }
.urd-skjema-form { display: grid; gap: 12px; }
.urd-skjema-row { display: grid; gap: 4px; }
.urd-skjema-label { font-size: 0.85em; font-weight: 600; }
.urd-skjema-input { font: inherit; color: inherit; background: var(--urd-color-surface);
  border: 1px solid color-mix(in srgb, var(--urd-color-text) 22%, transparent);
  border-radius: var(--urd-radius-sm); padding: 8px 10px; width: 100%; }
.urd-skjema-input:focus { outline: 2px solid var(--urd-color-accent); outline-offset: 1px; }
textarea.urd-skjema-input { resize: vertical; min-height: 90px; }
.urd-skjema-error { font-size: 0.8em; color: #e05252; min-height: 0; }
.urd-skjema-error:empty { display: none; }
.urd-skjema-hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
.urd-skjema-submit { justify-self: start; font: inherit; font-weight: 600; cursor: pointer;
  color: #fff; background: var(--urd-color-accent); border: 0;
  border-radius: var(--urd-radius-sm); padding: 10px 20px; }
.urd-skjema-submit:disabled { opacity: 0.6; cursor: default; }
.urd-skjema-status { font-size: 0.9em; margin: 0; }
.urd-skjema-status.ok { color: color-mix(in srgb, #4ac26b 85%, var(--urd-color-text)); }
.urd-skjema-status.feil { color: #e05252; }
.urd-skjema-tools { position: absolute; top: -32px; right: -6px; z-index: 5;
  display: flex; gap: 4px; align-items: center;
  /* Usynlig bro ned til blokk-kanten, så hover overlever veien opp */
  padding-bottom: 8px; }
.urd-skjema-tools .urd-hint-chip { position: static; }
/* Config-bryteren er skjult: innstillingene åpnes fra blokkens Egenskaper. */
.urd-skjema-gear { display: none; }
.urd-block:hover .urd-skjema-gear, .urd-skjema-gear:focus-visible,
.urd-skjema:has(.urd-skjema-config.vis) .urd-skjema-gear { opacity: 0.92; pointer-events: auto; }
.urd-skjema-config { position: absolute; top: -6px; right: 0; z-index: 6; width: min(360px, 92vw);
  max-height: 80vh; overflow-y: auto; display: none; gap: 6px; padding: 12px; border-radius: 10px;
  background: #151a23; color: #e8eaf0; border: 1px solid rgb(255 255 255 / 18%);
  box-shadow: 0 12px 36px rgb(0 0 0 / 55%); font: 12px/1.4 system-ui, sans-serif; }
.urd-skjema-config.vis { display: grid; }
.urd-skjema-config-label { font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.55; }
.urd-skjema-config-box { display: grid; gap: 6px; }
.urd-skjema-config-note { font-size: 11px; opacity: 0.6; margin: 0; }
.urd-skjema-config-input { font: 12px/1.4 system-ui, sans-serif; color: inherit; background: rgb(255 255 255 / 6%);
  border: 1px solid rgb(255 255 255 / 20%); border-radius: 6px; padding: 5px 7px; width: 100%; }
.urd-skjema-fieldlist { display: grid; gap: 6px; }
.urd-skjema-fieldrow { display: grid; grid-template-columns: 1fr auto auto auto; gap: 6px; align-items: center; }
.urd-skjema-fieldreq { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; white-space: nowrap; }
.urd-skjema-fielddel { font: inherit; color: #e05252; background: transparent; border: 0; cursor: pointer; padding: 2px 6px; }
.urd-skjema-addfield, .urd-skjema-apply { font: 600 12px/1 system-ui, sans-serif; cursor: pointer;
  border-radius: 6px; padding: 7px 10px; border: 1px solid rgb(255 255 255 / 20%);
  background: rgb(255 255 255 / 8%); color: inherit; }
.urd-skjema-apply { background: #7c5cff; color: #fff; border: 0; }
body.urd-chrome-off .urd-skjema-gear, body.urd-chrome-off .urd-skjema-config { display: none !important; }
`;

function injectCss() {
  if (document.getElementById('urd-skjema-css')) return;
  const style = document.createElement('style');
  style.id = 'urd-skjema-css';
  style.textContent = SKJEMA_CSS;
  document.head.appendChild(style);
}

/* ---------- Blokken ---------- */

function renderSkjema(el, props, ctx) {
  injectCss();
  const host = el2('div', 'urd-skjema');
  el.appendChild(host);
  renderForm(host, props, ctx);

  if (ctx.preview && ctx.viewport !== 'mobile') {
    const [gear, panel] = configPanel(el, props, ctx);
    // «?» og «⚙ Skjema» i samme rad øverst til høyre, med hover-bro (klar av rotasjonshåndtaket).
    const tools = el2('div', 'urd-skjema-tools');
    tools.appendChild(gear);
    host.append(tools, panel);
    import('/assets/urd/hint.js').then(({ attachHint }) => {
      if (!host.isConnected || host.querySelector('.urd-hint-chip')) return;
      const chip = attachHint(tools, {
        title: ta('skjema.edit.hintTitle'),
        lines: [
          ta('skjema.edit.hint1'),
          ta('skjema.edit.hint2'),
          ta('skjema.edit.hint3'),
          ta('skjema.edit.hint4'),
          ta('skjema.edit.hint5'),
        ],
      });
      tools.insertBefore(chip, tools.firstChild);
    });
  }

  autoGrow(el, host, ctx);
}

/* ---------- «Kontaktskjema»-preset ---------- */

const blockId = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return 'blk-' + [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
};

// Seed-regelen (ADR-0012): feltetikettene skrives inn i props ved innsetting,
// oversatt ÉN gang med admin-språket (ta i fabrikk-kroppen).
const defaultFields = () => [
  { id: 'navn', label: ta('skjema.edit.fieldName'), type: 'text', required: true },
  { id: 'epost', label: ta('skjema.edit.fieldEmail'), type: 'email', required: true },
  { id: 'melding', label: ta('skjema.edit.fieldMessage'), type: 'textarea', required: true },
];

function kontaktSection() {
  return {
    id: 'sec-' + blockId().slice(4),
    version: 1,
    preset: 'kontaktskjema',
    size: { minHeight: '520px' },
    grid: null,
    background: { version: 1, layers: [{ type: 'color', version: 1, props: { color: 'bg', opacity: 1 } }] },
    blocks: [
      {
        id: blockId(),
        type: 'text',
        version: 1,
        props: { html: ta('skjema.edit.seedIntro'), align: 'left', box: false },
        animation: null,
        frames: { desktop: { x: 6, y: 40, w: 60, h: 120, z: 1, rot: 0 }, mobile: null },
      },
      {
        id: blockId(),
        type: 'skjema',
        version: 1,
        props: { recipient: '', subject: '', mode: 'mailto', endpoint: '', submitLabel: ta('skjema.edit.sendDefault'), successText: ta('skjema.edit.thanksDefault'), fields: defaultFields() },
        animation: null,
        frames: { desktop: { x: 6, y: 180, w: 60, h: 380, z: 2, rot: 0 }, mobile: null },
      },
    ],
    responsive: { mobile: { mode: 'auto', attention: null } },
  };
}

/* ---------- Registrering ---------- */

/** @param {typeof window.Urd} Urd */
export function register(Urd) {
  Urd.blocks.define('skjema', {
    version: 1,
    label: 'Skjema',
    labelKey: 'skjema.edit.blockLabel',
    defaults: () => ({
      recipient: '', subject: '', mode: 'mailto', endpoint: '',
      submitLabel: ta('skjema.edit.sendDefault'), successText: ta('skjema.edit.thanksDefault'), fields: defaultFields(),
    }),
    migrations: {},
    render: renderSkjema,
  });

  Urd.sections.define('kontaktskjema', {
    label: 'Kontaktskjema',
    labelKey: 'skjema.edit.presetLabel',
    group: 'Kort og lister',
    hint: 'Kontaktskjema som sender via e-post (eller eget endepunkt)',
    hintKey: 'skjema.edit.presetHint',
    create: kontaktSection,
  });
}
