/**
 * Asistente del portafolio.
 *
 * Busca la pregunta del visitante dentro del set curado que viaja en la pagina
 * (`#chatbot-data`) y responde con la entrada mas parecida. Sin dependencias,
 * sin red y sin estado: todo ocurre en el navegador.
 *
 * El umbral existe para poder decir "no tengo una respuesta para eso" en vez de
 * devolver la entrada menos mala. Un portafolio que inventa respuestas es peor
 * que uno que admite no tenerlas.
 */
(function () {
  'use strict';

  var THRESHOLD = 0.55;
  var MIN_SUBSTRING = 4;

  /** Minusculas, sin acentos, sin puntuacion: "¿Quién sos?" -> "quien sos". */
  function normalize(value) {
    return String(value == null ? '' : value)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function tokenize(normalized) {
    return normalized ? normalized.split(' ') : [];
  }

  /**
   * Parecido entre la consulta y una frase del set.
   * Combina que tan contenida esta la consulta en la frase (containment) con el
   * solapamiento simetrico (Dice), y premia que una contenga a la otra.
   */
  function scorePhrase(query, queryTokens, phrase) {
    var normalized = normalize(phrase);
    if (!normalized) {
      return 0;
    }
    if (normalized === query) {
      return 1;
    }

    var phraseTokens = tokenize(normalized);
    var shared = 0;
    for (var i = 0; i < queryTokens.length; i += 1) {
      if (phraseTokens.indexOf(queryTokens[i]) !== -1) {
        shared += 1;
      }
    }

    var containment = shared / queryTokens.length;
    var dice = (2 * shared) / (queryTokens.length + phraseTokens.length);
    var score = 0.55 * containment + 0.45 * dice;

    var shorter = Math.min(query.length, normalized.length);
    if (
      shorter >= MIN_SUBSTRING &&
      (normalized.indexOf(query) !== -1 || query.indexOf(normalized) !== -1)
    ) {
      score = Math.max(score, 0.85);
    }

    return score;
  }

  function scoreEntry(query, queryTokens, entry) {
    var phrases = [entry.question].concat(entry.aliases || []);
    var best = 0;
    for (var i = 0; i < phrases.length; i += 1) {
      var current = scorePhrase(query, queryTokens, phrases[i]);
      if (current > best) {
        best = current;
      }
    }
    return best;
  }

  function findEntry(entries, question) {
    var query = normalize(question);
    if (!query) {
      return null;
    }

    var queryTokens = tokenize(query);
    var best = null;
    var bestScore = 0;

    for (var i = 0; i < entries.length; i += 1) {
      var current = scoreEntry(query, queryTokens, entries[i]);
      if (current > bestScore) {
        bestScore = current;
        best = entries[i];
      }
    }

    return bestScore >= THRESHOLD ? best : null;
  }

  /** Crea un nodo. Nunca se usa innerHTML con texto del visitante ni del set. */
  function node(tag, className, text) {
    var element = document.createElement(tag);
    if (className) {
      element.className = className;
    }
    if (text != null) {
      element.textContent = text;
    }
    return element;
  }

  function renderMessage(log, role, text, links) {
    var message = node('div', 'chatbot-msg chatbot-msg--' + role);
    message.appendChild(node('div', 'chatbot-msg-text', text));

    if (links && links.length) {
      var wrapper = node('div', 'chatbot-msg-links');
      for (var i = 0; i < links.length; i += 1) {
        var anchor = node('a', null, links[i].label);
        anchor.href = links[i].href;
        wrapper.appendChild(anchor);
      }
      message.appendChild(wrapper);
    }

    log.appendChild(message);
    log.scrollTop = log.scrollHeight;
  }

  function start() {
    var root = document.querySelector('[data-chatbot]');
    if (!root) {
      return;
    }

    var payloadNode = document.getElementById('chatbot-data');
    if (!payloadNode) {
      return;
    }

    var data;
    try {
      data = JSON.parse(payloadNode.textContent || '{}');
    } catch (error) {
      return;
    }
    if (!data || !data.copy || !data.entries || !data.entries.length) {
      return;
    }

    var log = root.querySelector('[data-chatbot-log]');
    var form = root.querySelector('[data-chatbot-form]');
    var input = root.querySelector('[data-chatbot-input]');
    if (!log || !form || !input) {
      return;
    }

    function ask(question) {
      var text = String(question == null ? '' : question).trim();
      if (!text) {
        return;
      }

      renderMessage(log, 'user', text, null);

      var entry = findEntry(data.entries, text);
      if (entry) {
        renderMessage(log, 'bot', entry.answer, entry.links);
      } else {
        renderMessage(log, 'bot', data.copy.fallback, null);
      }
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      ask(input.value);
      input.value = '';
      input.focus();
    });

    var chips = root.querySelectorAll('[data-chatbot-chip]');
    for (var i = 0; i < chips.length; i += 1) {
      chips[i].addEventListener('click', function () {
        ask(this.getAttribute('data-chatbot-chip'));
        input.focus();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
