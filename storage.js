/*
 * GPAStorage — sayfalar arası ortak veri katmanı (localStorage)
 * Tüm sayfalar (planlayıcı, PDF dönüştürücü, istatistikler) veriyi
 * buradan okur/yazar; JSON dosyası artık yalnızca yedekleme içindir.
 *
 * Veri biçimi (API çıktısıyla ve eski yedek dosyalarıyla birebir uyumlu):
 *   { semesters: [{ name, cards: [cardId, ...] }], cards: [{ id, lesson, ... }] }
 */
(function (global) {
  'use strict';

  var DATA_KEY = 'gpa-planner:data:v1';
  var META_KEY = 'gpa-planner:meta:v1';

  function safeParse(text) {
    try { return JSON.parse(text); } catch (_) { return null; }
  }

  function isValidData(data) {
    return !!data && typeof data === 'object' &&
      Array.isArray(data.semesters) &&
      Array.isArray(data.cards);
  }

  var GPAStorage = {
    isValidData: isValidData,

    load: function () {
      var raw = null;
      try { raw = global.localStorage.getItem(DATA_KEY); } catch (_) { return null; }
      var data = safeParse(raw);
      return isValidData(data) ? data : null;
    },

    save: function (data, source) {
      if (!isValidData(data)) return false;
      try {
        global.localStorage.setItem(DATA_KEY, JSON.stringify(data));
        global.localStorage.setItem(META_KEY, JSON.stringify({
          updatedAt: new Date().toISOString(),
          source: source || 'unknown'
        }));
        return true;
      } catch (_) {
        return false;
      }
    },

    meta: function () {
      try { return safeParse(global.localStorage.getItem(META_KEY)); } catch (_) { return null; }
    },

    /* Korumaya değer veri var mı? (En az bir ders kaydı) */
    hasData: function () {
      var data = this.load();
      return !!data && data.cards.length > 0;
    },

    clear: function () {
      try {
        global.localStorage.removeItem(DATA_KEY);
        global.localStorage.removeItem(META_KEY);
      } catch (_) {}
    },

    /* Yedek dosyası (JSON) indirir; veri verilmezse kayıtlı veriyi kullanır. */
    exportDownload: function (data, filename) {
      var payload = data || this.load();
      if (!isValidData(payload)) return false;
      var name = filename || ('gpa-yedek-' + new Date().toISOString().slice(0, 10) + '.json');
      var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
      return true;
    }
  };

  global.GPAStorage = GPAStorage;
})(window);
