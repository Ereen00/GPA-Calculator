/*
 * GPAParser — transkript ayrıştırma cephesi (façade)
 *
 * Kendisi ayrıştırma yapmaz: belgenin hangi üniversiteye ait olduğunu
 * GPAUniversities.detect() ile saptar ve o profilin ayrıştırıcısına devreder.
 * Böylece yeni bir üniversite eklemek için bu dosyaya dokunmak gerekmez —
 * bir uni-*.js (profil) ve bir parser-*.js (ayrıştırıcı) eklemek yeter.
 *
 * Çıktı biçimi her üniversitede aynıdır (GPAStorage v1):
 *   { semesters: [{ name, cards: [cardId] }], cards: [{ id, lesson, status, grade, credit, ... }] }
 */
(function (global) {
  'use strict';

  var EMPTY = { semesters: [], cards: [] };

  function registry() {
    return global.GPAUniversities || null;
  }

  /* Belgeyi ayrıştırır ve hangi profille ayrıştırıldığını da bildirir.
     input: düz metin veya { text, pages } */
  function parseWithProfile(input) {
    var reg = registry();
    if (!reg) return { data: EMPTY, profile: null, detected: null };

    var doc = reg.toDoc(input);
    var detected = reg.detect(doc);
    var profile = detected || reg.fallback();

    if (!profile || typeof profile.parse !== 'function') {
      return { data: EMPTY, profile: profile, detected: detected };
    }

    var data = profile.parse(doc) || EMPTY;

    // Tespit edilen profil ders üretemediyse (ör. imza doğru ama biçim farklı)
    // diğer profilleri de dene — kullanıcı hiç sonuç almaktansa doğru sonucu alsın.
    if (data.cards.length === 0) {
      var alt = reg.list().filter(function (p) {
        return p !== profile && typeof p.parse === 'function';
      });
      for (var i = 0; i < alt.length; i++) {
        var attempt = alt[i].parse(doc);
        if (attempt && attempt.cards.length > 0) {
          return { data: attempt, profile: alt[i], detected: detected };
        }
      }
    }

    return { data: data, profile: profile, detected: detected };
  }

  function parse(input) {
    return parseWithProfile(input).data;
  }

  global.GPAParser = {
    parse: parse,
    parseWithProfile: parseWithProfile
  };
})(typeof window !== 'undefined' ? window : globalThis);
