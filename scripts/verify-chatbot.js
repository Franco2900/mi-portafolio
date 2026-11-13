/**
 * Independent check of the portfolio assistant, over the built output.
 *
 * Reads the payload that ships inside each home (`#chatbot-data`), runs the real
 * `public/js/chatbot.js` against a minimal DOM, and asks. It imports nothing
 * from the source, so a change in the matcher or in the curated set shows up
 * here even when the build is happy.
 *
 *   node scripts/verify-chatbot.js        (after `npm run build`)
 *
 * Exit code 0 only when every check passes.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const DIST = path.join(process.cwd(), 'dist');
const HOMES = { es: 'index.html', en: 'en/index.html', pt: 'pt/index.html' };
const BASE = '/mi-portafolio/';
const LOCALES = ['es', 'en', 'pt'];
const ENTRY_COUNT = 13;

let failures = 0;
const fail = (msg) => {
  failures += 1;
  console.log('FAIL  ' + msg);
};
const pass = (msg) => console.log('PASS  ' + msg);

const decode = (value) =>
  value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

function readHome(locale) {
  return fs.readFileSync(path.join(DIST, HOMES[locale]), 'utf8');
}

function payloadOf(html) {
  const match = html.match(
    /<script type="application\/json" id="chatbot-data"[^>]*>([\s\S]*?)<\/script>/
  );
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch (error) {
    return { parseError: String(error) };
  }
}

/**
 * DOM mínimo: solo lo que `chatbot.js` toca. Cada mensaje que el script agrega
 * al log se guarda para poder comparar la respuesta con la entrada esperada.
 */
function runMatcher(payload) {
  const messages = [];
  const handlers = { submit: null };

  const node = (tag) => ({
    tag,
    className: '',
    textContent: '',
    href: '',
    children: [],
    appendChild(child) {
      this.children.push(child);
      return child;
    },
  });

  const log = node('div');
  log.appendChild = function (child) {
    this.children.push(child);
    messages.push(child);
    return child;
  };
  log.scrollTop = 0;
  log.scrollHeight = 0;

  const form = {
    addEventListener(type, handler) {
      if (type === 'submit') handlers.submit = handler;
    },
  };

  const input = { value: '', focus() {} };

  const document = {
    readyState: 'complete',
    querySelector: () => ({
      querySelector: (sel) =>
        ({
          '[data-chatbot-log]': log,
          '[data-chatbot-form]': form,
          '[data-chatbot-input]': input,
        })[sel],
      querySelectorAll: () => [],
    }),
    getElementById: () => ({ textContent: JSON.stringify(payload) }),
    createElement: node,
    addEventListener() {},
  };

  vm.runInNewContext(
    fs.readFileSync(path.join('public', 'js', 'chatbot.js'), 'utf8'),
    { document, window: {}, JSON, Math, String, console },
    { filename: 'chatbot.js' }
  );

  const ask = (question) => {
    const before = messages.length;
    input.value = question;
    handlers.submit({ preventDefault() {} });
    const added = messages.slice(before);
    const bot = added.filter((m) => String(m.className).includes('chatbot-msg--bot'));
    if (!bot.length) return null;
    const message = bot[bot.length - 1];
    return {
      text: message.children[0].textContent,
      hrefs: ((message.children[1] && message.children[1].children) || []).map((a) => a.href),
    };
  };

  return { ask };
}

const payloads = {};
const htmls = {};

for (const locale of LOCALES) {
  const html = readHome(locale);
  htmls[locale] = html;
  const payload = payloadOf(html);
  if (!payload || payload.parseError) {
    fail(`${locale}: payload not readable (${payload && payload.parseError})`);
    continue;
  }
  payloads[locale] = payload;
}

if (Object.keys(payloads).length !== LOCALES.length) {
  console.log('\nCannot continue: the payload is missing in some locale.');
  process.exit(1);
}

// --- estructura del set ---
const referenceIds = payloads.es.entries.map((entry) => entry.id);

for (const locale of LOCALES) {
  const { copy, entries } = payloads[locale];

  if (entries.length === ENTRY_COUNT) pass(`${locale}: ${ENTRY_COUNT} entries`);
  else fail(`${locale}: ${entries.length} entries (expected ${ENTRY_COUNT})`);

  const ids = entries.map((entry) => entry.id);
  if (new Set(ids).size === ids.length) pass(`${locale}: unique ids`);
  else fail(`${locale}: repeated ids -> ${ids.filter((id, i) => ids.indexOf(id) !== i)}`);

  if (ids.join(',') === referenceIds.join(',')) pass(`${locale}: same ids, same order as es`);
  else fail(`${locale}: id order differs from es`);

  const questions = entries.map((entry) => entry.question);
  if (new Set(questions).size === questions.length) pass(`${locale}: unique questions`);
  else fail(`${locale}: repeated questions`);

  const answers = entries.map((entry) => entry.answer);
  if (new Set(answers).size === answers.length) pass(`${locale}: unique answers`);
  else fail(`${locale}: repeated answers`);

  // Un alias que aparece en dos entradas es contenido que se pisa: el visitante
  // escribe eso y recibe la respuesta de la otra.
  const aliasOwners = new Map();
  let aliasProblems = 0;
  for (const entry of entries) {
    if (!entry.question || !entry.answer) {
      fail(`${locale}/${entry.id}: empty question or answer`);
      aliasProblems += 1;
    }
    if (!Array.isArray(entry.aliases) || entry.aliases.length < 2) {
      fail(`${locale}/${entry.id}: fewer than 2 aliases`);
      aliasProblems += 1;
      continue;
    }
    for (const alias of entry.aliases) {
      const key = alias.toLowerCase().trim();
      if (aliasOwners.has(key)) {
        fail(`${locale}: alias "${alias}" in ${entry.id} and ${aliasOwners.get(key)}`);
        aliasProblems += 1;
      } else {
        aliasOwners.set(key, entry.id);
      }
    }
  }
  if (!aliasProblems) pass(`${locale}: aliases present, no collisions`);

  for (const key of ['fallback', 'title', 'subtitle', 'placeholder', 'send']) {
    if (copy && copy[key]) pass(`${locale}: copy.${key} present`);
    else fail(`${locale}: copy.${key} missing`);
  }

  // Cada enlace es una página de ese idioma o un ancla que existe en el home.
  let linkProblems = 0;
  for (const entry of entries) {
    for (const link of entry.links || []) {
      if (!link.label) {
        fail(`${locale}/${entry.id}: link without label`);
        linkProblems += 1;
      }
      const href = link.href || '';
      if (href.startsWith('#')) {
        if (!new RegExp(`id="${href.slice(1)}"`).test(htmls[locale])) {
          fail(`${locale}/${entry.id}: anchor ${href} is not in the home`);
          linkProblems += 1;
        }
      } else if (href.startsWith(BASE)) {
        const rel = href.slice(BASE.length);
        const file = rel.endsWith('/') ? path.join(DIST, rel, 'index.html') : path.join(DIST, rel);
        if (!fs.existsSync(file)) {
          fail(`${locale}/${entry.id}: link ${href} is not in dist`);
          linkProblems += 1;
        }
      } else {
        fail(`${locale}/${entry.id}: link leaves the site -> ${href}`);
        linkProblems += 1;
      }
    }
  }
  if (!linkProblems) pass(`${locale}: links resolve (pages and anchors)`);
}

// --- markup construido ---
for (const locale of LOCALES) {
  const html = htmls[locale];
  const chips = [...html.matchAll(/data-chatbot-chip="([^"]*)"/g)].map((m) => decode(m[1]));
  const questions = payloads[locale].entries.map((entry) => entry.question);
  const missing = questions.filter((question) => !chips.includes(question));
  const extra = chips.filter((chip) => !questions.includes(chip));

  if (missing.length) fail(`${locale}: ${missing.length} questions with no chip -> ${missing.join(' | ')}`);
  else if (extra.length) fail(`${locale}: chips that are not in the set -> ${extra.join(' | ')}`);
  else pass(`${locale}: all ${ENTRY_COUNT} chips, one per question`);

  if (/id="asistente"/.test(html)) pass(`${locale}: #asistente anchor`);
  else fail(`${locale}: #asistente missing`);

  const groups = (html.match(/chatbot-group-title/g) || []).length;
  if (groups === 4) pass(`${locale}: 4 groups in the disclosure`);
  else fail(`${locale}: ${groups} groups (expected 4)`);

  if (/<details class="chatbot-more"/.test(html)) pass(`${locale}: native disclosure present`);
  else fail(`${locale}: disclosure missing`);

  if (/innerHTML/.test(html)) fail(`${locale}: innerHTML in the built HTML`);
}

// --- el matcher real ---
for (const locale of LOCALES) {
  const payload = payloads[locale];
  const { ask } = runMatcher(payload);
  let hits = 0;
  let misses = 0;

  for (const entry of payload.entries) {
    for (const phrase of [entry.question].concat(entry.aliases || [])) {
      const reply = ask(phrase);
      if (!reply) {
        fail(`${locale}/${entry.id}: "${phrase}" produced no answer`);
        misses += 1;
      } else if (reply.text !== entry.answer) {
        const owner = payload.entries.find((other) => other.answer === reply.text);
        fail(`${locale}/${entry.id}: "${phrase}" answered as ${owner ? owner.id : 'the fallback'}`);
        misses += 1;
      } else {
        hits += 1;
      }
    }
  }

  const total = hits + misses;
  if (misses === 0) pass(`${locale}: ${hits}/${total} questions and aliases land on their own entry`);
  else fail(`${locale}: ${misses}/${total} phrases land on another entry`);

  // Lo que el set no cubre tiene que admitirlo, no inventar.
  const unknown = {
    es: 'cuanto cuesta un departamento en marte',
    en: 'how much does a flat on mars cost',
    pt: 'quanto custa um apartamento em marte',
  }[locale];
  const fallbackReply = ask(unknown);
  if (fallbackReply && fallbackReply.text === payload.copy.fallback) {
    pass(`${locale}: a question outside the set returns the fallback`);
  } else {
    fail(`${locale}: a question outside the set returned "${fallbackReply && fallbackReply.text}"`);
  }

  if (ask('   ') === null) pass(`${locale}: an empty question answers nothing`);
  else fail(`${locale}: an empty question produced an answer`);

  // El chip tiene que preguntar lo mismo que el botón dice.
  const chipReply = ask(payload.entries[0].question);
  if (chipReply && chipReply.text === payload.entries[0].answer) {
    pass(`${locale}: the chip for "${payload.entries[0].id}" answers its entry`);
  } else {
    fail(`${locale}: the chip does not answer its entry`);
  }
}

// --- sin red, sin innerHTML en el código ---
const source = fs.readFileSync(path.join('public', 'js', 'chatbot.js'), 'utf8');
const network = ['fetch(', 'XMLHttpRequest', 'WebSocket', 'sendBeacon', 'importScripts'].filter(
  (token) => source.includes(token)
);
if (!network.length) pass('chatbot.js: no network (fetch/XHR/WebSocket/beacon)');
else fail(`chatbot.js uses the network -> ${network.join(', ')}`);

if (!/\.innerHTML\s*=/.test(source)) pass('chatbot.js: no innerHTML');
else fail('chatbot.js writes with innerHTML');

const external = LOCALES.flatMap((locale) =>
  payloads[locale].entries.flatMap((entry) =>
    (entry.links || []).filter((link) => /^https?:/.test(link.href || ''))
  )
);
if (!external.length) pass('payload: no link leaves the site');
else fail(`payload: ${external.length} external links`);

console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAIL`);
process.exit(failures === 0 ? 0 : 1);
