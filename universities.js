/*
 * GPAUniversities — üniversite profili kayıt defteri
 *
 * Site tek alan adı / tek deploy olarak kalır; hangi üniversitenin kurallarının
 * uygulanacağını YÜKLENEN TRANSKRİPT belirler. Her üniversite kendini bir profil
 * nesnesiyle kaydeder (uni-*.js), ayrıştırıcısını ayrı bir dosyada tanımlar
 * (parser-*.js) ve `detect()` ile "bu belge bana ait mi" sorusuna puan verir.
 *
 * Profil biçimi:
 *   {
 *     id: 'bogazici',
 *     name: { tr, en },                      // tam ad
 *     short: { tr, en },                     // kısa ad (rozet/başlık)
 *     grades: { AA: 4.0, ... },              // harf -> katsayı (ortalamaya giren notlar)
 *     gradeOrder: ['AA', ...],               // arayüzde gösterim sırası
 *     gradeOptions: ['AA', ..., 'W', ''],    // editördeki not açılır listesi
 *     repeatCandidateGrades: ['DC', ...],    // "tekrar edildi" önerisi çıkacak notlar
 *     passingGrade: 2.0,                     // bu katsayı ve üstü "başarılı"
 *     conditionalGrades: [],                 // koşullu başarı notları (YTÜ: DC)
 *     rules: {
 *       excludeFromCumulative: [],           // kümülatif ortalamadan tamamen dışlanan notlar
 *       maxCreditsPerTerm: null,             // dönem başına kredi sınırı (varsa)
 *       graduationGpa: null,                 // mezuniyet için gereken ortalama
 *       honors: []                           // [{ id, min, max }] onur dereceleri
 *     },
 *     detect: function (doc) { return 0..1; },
 *     parse: function (doc) { ... }          // parser-*.js tarafından eklenir
 *   }
 *
 * `doc` biçimi (upload.js üretir):
 *   { text: '...', pages: [{ width, height, items: [{ str, x, y, w }] }] }
 * Konum bilgisi yalnızca çok sütunlu transkriptleri (ör. YTÜ) çözebilmek içindir;
 * yalnız metinle çalışan ayrıştırıcılar `doc.text`'i kullanır.
 */
(function (global) {
  'use strict';

  var ACTIVE_KEY = 'gpa-planner:university:v1';

  var order = [];   // kayıt sırası (ilk kayıt = varsayılan)
  var byId = {};

  function register(profile) {
    if (!profile || !profile.id) return null;
    if (!byId[profile.id]) order.push(profile.id);
    profile.rules = profile.rules || {};
    profile.rules.excludeFromCumulative = profile.rules.excludeFromCumulative || [];
    profile.rules.honors = profile.rules.honors || [];
    byId[profile.id] = profile;
    return profile;
  }

  function list() {
    return order.map(function (id) { return byId[id]; });
  }

  function get(id) {
    return byId[id] || null;
  }

  /* Ortak kart/dönem biriktirici — her üniversitenin ayrıştırıcısı aynı çıktı
     biçimini (GPAStorage v1) üretsin diye burada tutulur.
     Dönemler sortKey'e göre kronolojik sıralanır. */
  function createCollector() {
    var semesterMap = {};   // dönem adı -> { name, sortKey, cards: [] }
    var cards = [];
    var idCounter = 1;

    return {
      add: function (semKey, sortKey, fields) {
        if (!fields.lesson || !fields.credit) return null;

        var card = {
          id: 'card-' + (idCounter++),
          lesson: fields.lesson,
          lessonInputType: fields.status === 'repeated with' ? 'select' : 'input',
          status: fields.status,
          grade: fields.grade,
          credit: fields.credit,
          repeatedLesson: fields.repeatedLesson || '',
          top: '',
          left: '',
          origin: ''
        };
        cards.push(card);

        if (!semesterMap[semKey]) {
          semesterMap[semKey] = { name: semKey, sortKey: sortKey, cards: [] };
        }
        semesterMap[semKey].cards.push(card.id);
        return card;
      },

      cards: function () { return cards; },

      result: function () {
        var semesters = Object.keys(semesterMap).map(function (k) { return semesterMap[k]; });
        semesters.sort(function (a, b) { return a.sortKey - b.sortKey; });
        return {
          semesters: semesters.map(function (s) { return { name: s.name, cards: s.cards }; }),
          cards: cards
        };
      }
    };
  }

  /* Ham girdiyi (düz metin ya da {text, pages}) tek biçime indirger. */
  function toDoc(input) {
    if (input && typeof input === 'object' && typeof input.text === 'string') {
      return { text: input.text, pages: Array.isArray(input.pages) ? input.pages : [] };
    }
    return { text: String(input == null ? '' : input), pages: [] };
  }

  /* Belgeye en yüksek puanı veren profil; hiçbiri eşleşmezse null.
     detect() içinde hata olursa o profil sessizce elenir — bir üniversitenin
     bozuk imzası diğerlerinin tespitini engellemesin. */
  function detect(input) {
    var doc = toDoc(input);
    var best = null;
    var bestScore = 0;
    list().forEach(function (profile) {
      var score = 0;
      try {
        score = profile.detect ? Number(profile.detect(doc)) : 0;
      } catch (_) {
        score = 0;
      }
      if (!isFinite(score)) score = 0;
      if (score > bestScore) {
        bestScore = score;
        best = profile;
      }
    });
    return best;
  }

  /* Tespit başarısızsa kullanılacak profil: ilk kaydedilen (Boğaziçi). */
  function fallback() {
    return byId[order[0]] || null;
  }

  /* Son tespit edilen üniversite — planlayıcı ve istatistik sayfaları
     kendi hesaplarını buna göre yapar. */
  function active() {
    var id = null;
    try { id = global.localStorage.getItem(ACTIVE_KEY); } catch (_) {}
    return (id && byId[id]) || fallback();
  }

  function setActive(id) {
    if (!byId[id]) return false;
    try { global.localStorage.setItem(ACTIVE_KEY, id); } catch (_) {}
    return true;
  }

  function clearActive() {
    try { global.localStorage.removeItem(ACTIVE_KEY); } catch (_) {}
  }

  /* Çağıranın verdiği profili, yoksa aktif olanı döndürür.
     Profil hiç yüklenmemişse (ör. tek dosya açıldıysa) null döner ve
     çağıranlar kendi yerleşik varsayılanlarına düşer. */
  function resolve(profile) {
    if (profile && profile.grades) return profile;
    return active();
  }

  global.GPAUniversities = {
    register: register,
    createCollector: createCollector,
    list: list,
    get: get,
    toDoc: toDoc,
    detect: detect,
    fallback: fallback,
    active: active,
    setActive: setActive,
    clearActive: clearActive,
    resolve: resolve
  };
})(typeof window !== 'undefined' ? window : globalThis);
