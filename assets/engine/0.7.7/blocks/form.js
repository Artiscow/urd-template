/**
 * Core block: form. A contact form following the ApeironLF model: by
 * default it sends through the visitor's email client (mailto, zero setup),
 * or to an optional endpoint (the owner's Apps Script or Pages Function)
 * via fetch. A honeypot field guards against bots. The settings (send mode,
 * recipient, fields, texts) are edited in the Properties panel; the help
 * chip (ADR-0008) explains the conventions.
 *
 * Visitor input is NEVER set as HTML (only .value/textContent). Endpoint mode
 * requires the owner to open connect-src for the endpoint in _headers; the
 * tooltip in Properties says so.
 */
import { isSpam, validate, buildMailto, buildPayload } from '../form-model.js';
// t() for visitor texts (the site language), ta() for the editor chrome and
// the seed defaults (the admin language); never called at module level.
import { t, ta, adminLocaleReady } from '../i18n.js';

const el2 = (tag, className, textContent) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (textContent != null) node.textContent = textContent;
  return node;
};

/* ---------- Form rendering ---------- */

function fieldControl(field) {
  // A visitor-facing dropdown is a NATIVE select with color-scheme (ADR-0009
  // covers editing UI only); an empty placeholder option is what makes the
  // required check possible.
  if (field.type === 'select') {
    const control = el2('select', 'urd-form-input urd-form-select');
    const placeholder = el2('option', null, t('form.choose'));
    placeholder.value = '';
    control.appendChild(placeholder);
    for (const option of field.options ?? []) {
      const node = el2('option', null, option);
      node.value = option;
      control.appendChild(node);
    }
    control.name = field.id;
    control.dataset.fieldId = field.id;
    return control;
  }
  const control = field.type === 'textarea'
    ? el2('textarea', 'urd-form-input')
    : el2('input', 'urd-form-input');
  if (field.type !== 'textarea') {
    control.type = field.type === 'email' ? 'email'
      : field.type === 'tel' ? 'tel'
        : field.type === 'date' ? 'date'
          : field.type === 'checkbox' ? 'checkbox' : 'text';
  }
  if (field.type === 'textarea') control.rows = 4;
  control.name = field.id;
  control.id = `${field.id}-in`;
  if (field.required && field.type !== 'checkbox') control.required = true;
  control.dataset.fieldId = field.id;
  return control;
}

/** One form row for the field: structure and control vary with the type. */
function fieldRow(field, controls) {
  const star = field.required ? ' *' : '';
  // Radio group: fieldset/legend instead of a wrapping label, one radio per
  // option sharing a name. Harvesting reads the group's :checked.
  if (field.type === 'radio') {
    const row = el2('fieldset', 'urd-form-row urd-form-fieldset');
    row.appendChild(el2('legend', 'urd-form-label', field.label + star));
    for (const option of field.options ?? []) {
      const optLabel = el2('label', 'urd-form-check');
      const radio = el2('input');
      radio.type = 'radio';
      radio.name = field.id;
      radio.value = option;
      optLabel.append(radio, el2('span', null, option));
      row.appendChild(optLabel);
    }
    controls[field.id] = row;
    return row;
  }
  // Checkbox: the box comes BEFORE the label, as the convention is.
  if (field.type === 'checkbox') {
    const row = el2('label', 'urd-form-row urd-form-checkrow');
    const inner = el2('span', 'urd-form-check');
    const control = fieldControl(field);
    controls[field.id] = control;
    inner.append(control, el2('span', 'urd-form-label', field.label + star));
    row.appendChild(inner);
    return row;
  }
  const row = el2('label', 'urd-form-row');
  const control = fieldControl(field);
  controls[field.id] = control;
  row.append(el2('span', 'urd-form-label', field.label + star), control);
  return row;
}

function renderForm(host, props, ctx) {
  const fields = props.fields ?? [];
  const form = el2('form', 'urd-form-form');
  form.noValidate = true;

  const controls = {};
  for (const field of fields) {
    const row = fieldRow(field, controls);
    const error = el2('span', 'urd-form-error');
    error.dataset.for = field.id;
    row.appendChild(error);
    form.appendChild(row);
  }

  // Honeypot: hidden from humans, filled in by bots. Never visible, never tabbable.
  const honeypot = el2('input', 'urd-form-hp');
  honeypot.type = 'text';
  honeypot.name = 'website';
  honeypot.tabIndex = -1;
  honeypot.autocomplete = 'off';
  honeypot.setAttribute('aria-hidden', 'true');
  form.appendChild(honeypot);

  const submit = el2('button', 'urd-form-submit', props.submitLabel || t('form.send'));
  submit.type = 'submit';
  form.appendChild(submit);

  const status = el2('p', 'urd-form-status');
  form.appendChild(status);

  const showErrors = (errors) => {
    for (const field of fields) {
      const cell = form.querySelector(`.urd-form-error[data-for="${CSS.escape(field.id)}"]`);
      if (cell) cell.textContent = errors[field.id] ?? '';
    }
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.className = 'urd-form-status';
    status.textContent = '';
    // Per-type harvesting: a checkbox is boolean, a radio group reads
    // :checked, and the rest read .value.
    const values = {};
    for (const field of fields) {
      const control = controls[field.id];
      values[field.id] = field.type === 'checkbox' ? control?.checked === true
        : field.type === 'radio' ? (control?.querySelector('input:checked')?.value ?? '')
          : (control?.value ?? '');
    }

    // Spam: act as if it went through, but send nothing (do not tip off the bot).
    if (isSpam(honeypot.value)) {
      status.classList.add('ok');
      status.textContent = props.successText || t('form.thanks');
      return;
    }

    const result = validate(fields, values, {
      required: t('form.required'),
      email: t('form.invalidEmail'),
      choice: t('form.invalidChoice'),
      date: t('form.invalidDate'),
    });
    showErrors(result.errors);
    if (!result.ok) return;

    if (ctx.preview) {
      status.classList.add('ok');
      status.textContent = ta('form.previewOk');
      return;
    }

    const done = () => {
      status.classList.add('ok');
      status.textContent = props.successText || t('form.thanks');
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
        status.classList.add('error');
        status.textContent = t('form.sendFailed');
      } finally {
        submit.disabled = false;
      }
    } else {
      const url = buildMailto(props.recipient, props.subject || t('form.subjectDefault'), fields, values, { yes: t('form.yes') });
      if (!url) {
        status.classList.add('error');
        status.textContent = t('form.noRecipient');
        return;
      }
      window.location.href = url;
      done();
    }
  });

  host.appendChild(form);
}

/* ---------- The block ---------- */

function renderFormBlock(el, props, ctx) {
  const host = el2('div', 'urd-form');
  el.appendChild(host);
  renderForm(host, props, ctx);

  if (ctx.preview && ctx.viewport !== 'mobile') {
    // Help chip (ADR-0008): the send modes and the field conventions need explaining.
    Promise.all([import('../hint.js'), adminLocaleReady]).then(([{ attachHint }]) => {
      if (!el.isConnected || el.querySelector('.urd-hint-chip')) return;
      attachHint(el, {
        title: ta('hintForm.title'),
        lines: [ta('hintForm.l1'), ta('hintForm.l2'), ta('hintForm.l3'), ta('hintForm.l4'), ta('hintForm.l5')],
      });
    });
  }
}

/**
 * The seed rule (ADR-0012): the field labels are written into props at
 * insertion time, translated ONCE with the admin language.
 */
export const defaultFormFields = () => [
  { id: 'navn', label: ta('form.fieldName'), type: 'text', required: true },
  { id: 'epost', label: ta('form.fieldEmail'), type: 'email', required: true },
  { id: 'melding', label: ta('form.fieldMessage'), type: 'textarea', required: true },
];

export const formBlock = {
  version: 1,
  // Natural height in the mobile row grid; on the desktop the push pass owns the box.
  autoGrow: true,
  label: 'Form',
  labelKey: 'blocks.form',
  defaults: () => ({
    recipient: '', subject: '', mode: 'mailto', endpoint: '',
    submitLabel: ta('form.sendDefault'), successText: ta('form.thanksDefault'), fields: defaultFormFields(),
  }),
  migrations: {},
  render: renderFormBlock,
};
