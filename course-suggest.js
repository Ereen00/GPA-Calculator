/*
 * GPACourseSuggest — ders kodu alanı için otomatik tamamlama
 *
 * Veri: courses-bogazici.json — Boğaziçi Üniversitesi Lisans Kataloğu'ndan derlenmiş
 * [kod, İngilizce ad, kredi|null, Türkçe ad?] satırları. Dosya yalnızca bir ders
 * alanına ilk kez odaklanıldığında indirilir; sayfa açılışını yavaşlatmaz.
 *
 * Kullanım:
 *   GPACourseSuggest.attach(input, {
 *     format: function (code, subject, number) { return 'MATH 101'; },  // alana yazılacak biçim
 *     extra:  function () { return ['XYZ 101', ...]; },               // katalogda olmayan kendi dersleri
 *     onPick: function (item) { ... }                                 // item: { code, name, credit }
 *   });
 */
(function (global) {
  'use strict';

  var DATA_URL = 'courses-bogazici.json';
  var MAX_RESULTS = 5;

  var catalog = null;        // [{ code, subject, number, name, tr, credit, key, words }]
  var loading = null;
  var byCode = {};

  function t(key, fallback) {
    return global.GPAI18N ? global.GPAI18N.t(key) : fallback;
  }

  /* Karşılaştırma için sadeleştirme: büyük harf, Türkçe harfler katlanır, boşluk/nokta atılır */
  function fold(str) {
    return String(str || '')
      .replace(/[İIı]/g, 'i').replace(/[Şş]/g, 's').replace(/[Ğğ]/g, 'g')
      .replace(/[Üü]/g, 'u').replace(/[Öö]/g, 'o').replace(/[Çç]/g, 'c')
      .toLowerCase();
  }

  function compact(str) {
    return fold(str).replace(/[^a-z0-9]/g, '');
  }

  function splitCode(code) {
    var m = String(code).toUpperCase().replace(/\s+/g, '').match(/^([A-ZÇĞİÖŞÜ]+)(\d.*)$/);
    return m ? { subject: m[1], number: m[2] } : null;
  }

  // "Calculus II" araması "calculus 2" ile de bulunsun
  var ROMAN = { i: '1', ii: '2', iii: '3', iv: '4', v: '5', vi: '6' };

  function wordsOf(text) {
    var words = fold(text).split(/[^a-z0-9]+/).filter(Boolean);
    words.slice().forEach(function (w) { if (ROMAN[w]) words.push(ROMAN[w]); });
    return words;
  }

  function prepare(rows) {
    var list = [];
    rows.forEach(function (r) {
      var parts = splitCode(r[0]);
      if (!parts) return;
      var item = {
        code: parts.subject + ' ' + parts.number,
        subject: parts.subject,
        number: parts.number,
        name: r[1] || '',
        credit: r[2] == null ? null : r[2],
        tr: r[3] || '',
        key: compact(r[0])
      };
      item.words = wordsOf(item.name).concat(wordsOf(item.tr));
      item.firstWords = [wordsOf(item.name)[0], wordsOf(item.tr)[0]].filter(Boolean);
      item.nameText = fold(item.name + ' ' + item.tr);
      list.push(item);
      byCode[item.key] = item;
    });
    return list;
  }

  function load() {
    if (catalog) return Promise.resolve(catalog);
    if (loading) return loading;
    if (!global.fetch) return Promise.resolve([]);
    loading = fetch(DATA_URL)
      .then(function (res) { if (!res.ok) throw new Error(res.status); return res.json(); })
      .then(function (rows) { catalog = prepare(rows); return catalog; })
      .catch(function () { loading = null; return []; }); // çevrimdışı: öneri yok, alan normal çalışır
    return loading;
  }

  /* Puanlama: kod eşleşmesi ada göre önce gelir; aynı puanda kısa/küçük numaralı kod önce */
  function score(item, q, qTokens) {
    if (item.key === q) return 1000;
    if (item.key.indexOf(q) === 0) return 900 - (item.key.length - q.length);
    if (q.length >= 3 && item.key.indexOf(q) > 0) return 500;
    if (!qTokens.length) return 0;
    var allPrefix = qTokens.every(function (tok) {
      return item.words.some(function (w) { return w.indexOf(tok) === 0; });
    });
    if (allPrefix) {
      // Tam kelime eşleşmesi ve adın ilk kelimesinde eşleşme öne geçer
      var bonus = 0;
      qTokens.forEach(function (tok) { if (item.words.indexOf(tok) !== -1) bonus += 15; });
      if (item.firstWords.some(function (w) { return w.indexOf(qTokens[0]) === 0; })) bonus += 20;
      return 400 + bonus;
    }
    var joined = qTokens.join(' ');
    if (joined.length >= 3 && item.nameText.indexOf(joined) !== -1) return 200;
    return 0;
  }

  function search(query, extraCodes) {
    var q = compact(query);
    if (!q) return [];
    var qTokens = fold(query).split(/[^a-z0-9]+/).filter(Boolean);
    var results = [];

    (catalog || []).forEach(function (item) {
      var s = score(item, q, qTokens);
      if (s > 0) results.push({ item: item, s: s });
    });

    // Katalogda olmayan ama planda bulunan dersler (ör. yeni açılmış dersler)
    (extraCodes || []).forEach(function (code) {
      var key = compact(code);
      if (!key || byCode[key] || key.indexOf(q) !== 0) return;
      var parts = splitCode(code);
      results.push({
        s: 850 - (key.length - q.length),
        item: {
          code: parts ? parts.subject + ' ' + parts.number : String(code).trim(),
          subject: parts && parts.subject, number: parts && parts.number,
          name: '', credit: null, own: true, key: key
        }
      });
    });

    results.sort(function (a, b) {
      return b.s - a.s || a.item.key.localeCompare(b.item.key, 'en', { numeric: true });
    });
    var seen = {};
    return results.filter(function (r) {
      if (seen[r.item.key]) return false;
      seen[r.item.key] = true;
      return true;
    }).slice(0, MAX_RESULTS).map(function (r) { return r.item; });
  }

  // ---------- Açılır liste (tek örnek, body'ye bağlı) ----------
  var listEl = null;
  var active = null;   // { input, opts, items, index }
  var uid = 0;

  function ensureList() {
    if (listEl) return listEl;
    listEl = document.createElement('ul');
    listEl.className = 'course-suggest';
    listEl.id = 'course-suggest-list';
    listEl.setAttribute('role', 'listbox');
    listEl.hidden = true;
    // pointerdown: seçim, alan odağını kaybetmeden önce yapılır
    listEl.addEventListener('pointerdown', function (e) {
      var li = e.target.closest('li[data-index]');
      if (!li || !active) return;
      e.preventDefault();
      pick(Number(li.dataset.index));
    });
    document.body.appendChild(listEl);
    global.addEventListener('resize', position);
    global.addEventListener('scroll', position, true);
    return listEl;
  }

  function position() {
    if (!active || !listEl || listEl.hidden) return;
    var r = active.input.getBoundingClientRect();
    if (r.bottom < 0 || r.top > global.innerHeight) { close(); return; }
    var vw = document.documentElement.clientWidth;
    var width = Math.min(Math.max(r.width, 300), vw - 16);
    var left = Math.min(Math.max(8, r.left), vw - width - 8);
    listEl.style.width = width + 'px';
    listEl.style.left = left + 'px';
    // Altta yer yoksa alanın üstünde aç (sabit alt çubuğun kapladığı alan sayılmaz)
    var limit = global.innerHeight;
    var bar = document.getElementById('fixed-bar');
    if (bar) limit = Math.min(limit, bar.getBoundingClientRect().top);
    var below = limit - r.bottom;
    var h = listEl.offsetHeight;
    listEl.style.top = (below < h + 12 && r.top > h + 12 ? r.top - h - 4 : r.bottom + 4) + 'px';
  }

  function renderList() {
    var ul = ensureList();
    ul.innerHTML = '';
    if (!active || !active.items.length) { close(); return; }
    active.items.forEach(function (item, i) {
      var li = document.createElement('li');
      li.id = 'course-suggest-opt-' + i;
      li.setAttribute('role', 'option');
      li.dataset.index = String(i);
      if (i === active.index) {
        li.className = 'active';
        li.setAttribute('aria-selected', 'true');
      }
      var code = document.createElement('span');
      code.className = 'cs-code';
      code.textContent = item.code;
      var name = document.createElement('span');
      name.className = 'cs-name';
      var lang = global.GPAI18N ? global.GPAI18N.lang() : 'tr';
      name.textContent = item.own
        ? t('suggest.fromPlan', 'Planınızdan')
        : ((lang === 'tr' && item.tr) ? item.tr : item.name);
      li.appendChild(code);
      li.appendChild(name);
      if (item.credit != null) {
        var cr = document.createElement('span');
        cr.className = 'cs-credit';
        cr.textContent = t('suggest.credit', '{c} kr').replace('{c}', item.credit);
        li.appendChild(cr);
      }
      ul.appendChild(li);
    });
    ul.hidden = false;
    active.input.setAttribute('aria-expanded', 'true');
    if (active.index >= 0) active.input.setAttribute('aria-activedescendant', 'course-suggest-opt-' + active.index);
    else active.input.removeAttribute('aria-activedescendant');
    position();
  }

  function close() {
    if (listEl) listEl.hidden = true;
    if (active) {
      active.input.setAttribute('aria-expanded', 'false');
      active.input.removeAttribute('aria-activedescendant');
    }
  }

  function pick(index) {
    if (!active) return;
    var item = active.items[index];
    if (!item) return;
    var input = active.input;
    var opts = active.opts;
    input.value = (item.subject && opts.format)
      ? opts.format(item.code, item.subject, item.number)
      : item.code;
    if (item.name) input.title = item.name + (item.tr ? ' — ' + item.tr : '');
    active.items = [];
    close();
    if (opts.onPick) opts.onPick({ code: input.value, name: item.name, credit: item.credit });
  }

  function update(input, opts) {
    var query = input.value;
    load().then(function () {
      if (document.activeElement !== input) return;
      // Alan zaten tam bir katalog koduysa liste gereksiz yere açık kalmasın
      var exact = byCode[compact(query)];
      var items = search(query, opts.extra ? opts.extra() : []);
      if (exact && items.length === 1) items = [];
      active = { input: input, opts: opts, items: items, index: -1 };
      renderList();
    });
  }

  function attach(input, opts) {
    opts = opts || {};
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-controls', 'course-suggest-list');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('autocapitalize', 'characters');
    input.setAttribute('spellcheck', 'false');
    input.dataset.suggestId = String(++uid);

    input.addEventListener('focus', function () { load(); });
    input.addEventListener('input', function () { update(input, opts); });
    input.addEventListener('blur', function () {
      if (active && active.input === input) close();
    });
    input.addEventListener('keydown', function (e) {
      if (!active || active.input !== input || !listEl || listEl.hidden) return;
      var n = active.items.length;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        active.index = (active.index + 1) % n;
        renderList();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        active.index = active.index <= 0 ? n - 1 : active.index - 1;
        renderList();
      } else if (e.key === 'Enter') {
        if (active.index >= 0 || n === 1) {
          e.preventDefault();
          pick(active.index >= 0 ? active.index : 0);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'Tab' && active.index >= 0) {
        pick(active.index);
      }
    });
  }

  global.GPACourseSuggest = {
    attach: attach,
    load: load,
    search: search,          // testler için
    _prepare: function (rows) { catalog = prepare(rows); return catalog; }
  };
})(typeof window !== 'undefined' ? window : globalThis);
