/*
 * GPADemo — "örnek veriyle dene" akışı
 *
 * Neden var: planlayıcı ve analitik sayfaları, kullanıcı transkriptini
 * aktarmadan önce boş bir arayüzden ibaret görünüyordu. Hem siteye ilk kez
 * gelen öğrenci aracın ne yaptığını göremiyordu, hem de sayfayı JavaScript'le
 * gezen bir tarayıcı botu "içeriksiz ekran" görüyordu. Bu modül, tek tıkla
 * gerçekçi bir örnek transkript yükleyerek her iki sayfayı da dolu gösterir.
 *
 * Veri kurgusaldır: ders kodları Boğaziçi lisans programlarından alınmıştır
 * ama notlar ve öğrenci gerçek değildir. Örnek veri, kullanıcının kendi
 * verisinin üzerine ASLA yazılmaz (load() önce hasData() kontrolü yapar).
 */
(function (global) {
  'use strict';

  /* [ders, kredi, not] — not '' ise devam eden ders, 'W' çekilmiş ders demektir.
     PHYS 122 ve CMPE 260 bilerek iki kez geçiyor: biri tekrar (DC -> BB),
     diğeri çekilme sonrası yeniden alma (W -> BB). Böylece örnek veri
     ortalamanın tekrar ve W kurallarını da gösteriyor. */
  var PROGRAM = [
    ['2022-2023 Güz Dönemi', [
      ['MATH 101', '4', 'BA'], ['PHYS 121', '4', 'CB'], ['CMPE 150', '4', 'AA'],
      ['TK 221', '2', 'AA'], ['HSS 101', '3', 'BB']
    ]],
    ['2022-2023 Bahar Dönemi', [
      ['MATH 102', '4', 'CC'], ['PHYS 122', '4', 'DC'], ['CMPE 160', '4', 'BA'],
      ['TK 222', '2', 'BA'], ['HTR 311', '2', 'AA']
    ]],
    ['2022-2023 Yaz Okulu', [
      ['MATH 201', '3', 'BB']
    ]],
    ['2023-2024 Güz Dönemi', [
      ['CMPE 220', '3', 'BB'], ['CMPE 230', '3', 'CB'], ['CMPE 250', '4', 'BA'],
      ['PHYS 122', '4', 'BB'], ['HTR 312', '2', 'AA']
    ]],
    ['2023-2024 Bahar Dönemi', [
      ['CMPE 260', '3', 'W'], ['CMPE 300', '3', 'CB'], ['CMPE 321', '3', 'BA'],
      ['CMPE 343', '3', 'BB'], ['HSS 202', '3', 'AA']
    ]],
    ['2024-2025 Güz Dönemi', [
      ['CMPE 260', '3', 'BB'], ['CMPE 322', '3', 'BA'], ['CMPE 350', '3', 'CB'],
      ['CMPE 344', '3', 'BB'], ['EE 212', '3', 'CC']
    ]]
  ];

  /* PROGRAM tablosunu GPAStorage'ın beklediği {semesters, cards} biçimine çevirir. */
  function build() {
    var cards = [];
    var semesters = [];
    var n = 1;

    PROGRAM.forEach(function (entry) {
      var ids = [];
      entry[1].forEach(function (row) {
        var id = 'demo-' + (n++);
        cards.push({
          id: id,
          lesson: row[0],
          lessonInputType: 'input',
          status: 'taken',
          grade: row[2],
          credit: row[1],
          repeatedLesson: '',
          top: '',
          left: '',
          origin: 'demo'
        });
        ids.push(id);
      });
      semesters.push({ name: entry[0], cards: ids });
    });

    return { semesters: semesters, cards: cards };
  }

  /* Örnek dersler 'demo-' ön ekli kimlikle üretiliyor. Depolama meta'sındaki
     'source' alanı planlayıcı her kaydettiğinde 'editor' olduğu için işaret
     olarak kullanılamaz; kimlik ön eki ise kayıttan kayda korunuyor. Kullanıcı
     kendi transkriptini aktardığında kimlikler 'card-' olur ve şerit kendiliğinden kalkar. */
  function demoKart(card) {
    return !!card && typeof card.id === 'string' && card.id.indexOf('demo-') === 0;
  }

  var GPADemo = {
    build: build,

    /* Örnek veri şu anda görüntüleniyor mu? */
    active: function () {
      if (!global.GPAStorage) return false;
      var data = global.GPAStorage.load();
      return !!data && data.cards.some(demoKart);
    },

    /* Örnek veriyi yükler. Kullanıcının kendi verisi varsa hiçbir şey yapmaz. */
    load: function () {
      if (!global.GPAStorage) return false;
      if (global.GPAStorage.hasData()) return false;
      return global.GPAStorage.save(build(), 'demo');
    },

    /* Yalnızca örnek dersleri siler; kullanıcının sonradan eklediği dersler kalır. */
    clear: function () {
      if (!global.GPAStorage) return false;
      var data = global.GPAStorage.load();
      if (!data || !data.cards.some(demoKart)) return false;

      var kalan = data.cards.filter(function (c) { return !demoKart(c); });
      if (!kalan.length) { global.GPAStorage.clear(); return true; }

      var kalanIds = {};
      kalan.forEach(function (c) { kalanIds[c.id] = true; });
      var semesters = data.semesters
        .map(function (s) {
          return { name: s.name, cards: (s.cards || []).filter(function (id) { return kalanIds[id]; }) };
        })
        .filter(function (s) { return s.cards.length; });

      return global.GPAStorage.save({ semesters: semesters, cards: kalan }, 'editor');
    }
  };

  var STRINGS = {
    'demo.try': { tr: "Örnek veriyle dene", en: "Try with sample data" },
    'demo.hint': {
      tr: "Transkriptiniz yanınızda değil mi? Kurgusal bir öğrencinin 6 dönemlik transkriptini yükleyip aracın ne yaptığını hemen görebilirsiniz.",
      en: "Don't have your transcript handy? Load a fictional student's six-term transcript and see what the tool does right away."
    },
    'demo.banner': {
      tr: "<strong>Örnek veri görüntülüyorsunuz.</strong> Bu kurgusal bir transkripttir; kendi derslerinizi girmek için örnek veriyi temizleyin.",
      en: "<strong>You're viewing sample data.</strong> This is a fictional transcript; clear it to enter your own courses."
    },
    'demo.clear': { tr: "Örnek veriyi temizle", en: "Clear sample data" },
    'demo.tryHome': {
      tr: "Transkriptiniz yanınızda değil mi? Örnek veriyle deneyin →",
      en: "Don't have your transcript handy? Try it with sample data →"
    }
  };

  if (global.GPAI18N && typeof global.GPAI18N.extend === 'function') {
    global.GPAI18N.extend(STRINGS);
  }

  /* Sayfadaki örnek veri düğmelerini ve uyarı şeridini bağlar.
     app.js / stats.js'e dokunmamak için sayfa yeniden yükleniyor. */
  function wire() {
    var banner = document.getElementById('demo-banner');
    if (banner && GPADemo.active()) banner.hidden = false;

    /* data-demo-load'a bir adres yazılmışsa (ana sayfadaki düğme gibi) örnek veri
       yüklendikten sonra oraya gidilir; boşsa sayfa yenilenir. */
    document.querySelectorAll('[data-demo-load]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        var hedef = el.getAttribute('data-demo-load');
        GPADemo.load();
        if (hedef) global.location.href = hedef;
        else global.location.reload();
      });
    });

    document.querySelectorAll('[data-demo-clear]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        if (GPADemo.clear()) global.location.reload();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }

  global.GPADemo = GPADemo;
  global.GPADemoStrings = STRINGS;
})(window);
