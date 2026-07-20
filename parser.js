/*
 * GPAParser — Boğaziçi Üniversitesi transkript metni ayrıştırıcısı
 * pdf.js ile çıkarılan metni tamamen İSTEMCİ TARAFINDA işler; sunucu gerekmez.
 *
 * Çıktı, GPAStorage v1 veri biçimidir:
 *   { semesters: [{ name, cards: [cardId] }], cards: [{ id, lesson, status, grade, credit, ... }] }
 *
 * Tanınan durumlar:
 *  - W notu veya DÇ açıklaması  -> 'not taken' (çekilen)
 *  - T (teorik saat) = 0        -> 'non credit' (PE vb. ortalamaya girmeyen dersler)
 *  - TKR açıklaması             -> 'repeated with' (dersin kendisi tekrar)
 *  - YRN açıklaması             -> 'repeated with' (başka dersin yerine; hedef
 *                                  "X kodlu dersi Y yerine almıştır" cümlesinden bulunur)
 *  - F / KL notları FF'e çevrilir; notu henüz girilmemiş (devam eden) dersler '' olarak aktarılır.
 */
(function (global) {
  'use strict';

  var SEASON = '(Güz|Bahar|Yaz\\s+Okulu|Fall\\s+Term|Spring\\s+Term|Summer\\s+School)';
  var HEADER_RE = new RegExp('(\\d{4})-(\\d{4})\\s+' + SEASON, 'g');

  // pdf.js çıkarım sırası: KOD AD (EN AD) Z|S İng. T U UK AKTS PUAN [NOT] AÇIKLAMA...
  var COMMENT_TOKEN = '(?:TKR|YRN|DÇ|SG|KL|HAZ|G|--|-)';
  var LESSON_RE = new RegExp(
    '(\\b[A-Z]{2,}\\s?\\d{3}[A-Z]?)' +                                 // 1: ders kodu
    '\\s+[\\s\\S]*?' +                                                  // ders adı (tembel atla)
    '\\b(Z|S)\\s+İng\\.?\\s+' +                                        // 2: zorunlu/seçmeli + dil
    '(\\d+)\\s+(\\d+)\\s+(\\d+)\\s+(\\d+)\\s+' +                       // 3:T 4:U 5:UK 6:AKTS
    '([\\d.]+)' +                                                       // 7: puan
    '(?:\\s+(AA|BA|BB|CB|CC|DC|DD|FF|F|KL|W|P|E|I|L|NC|NP|R))?' +      // 8: not (devam edenlerde yok)
    '\\s+(' + COMMENT_TOKEN + '(?:\\s+' + COMMENT_TOKEN + ')*)',        // 9: açıklama(lar)
    'g'
  );

  var SUBSTITUTION_RE = /([A-Z]{2,}\s?\d{3}[A-Z]?)\s+kodlu\s+dersi\s+([A-Z]{2,}\s?\d{3}[A-Z]?)\s+yerine\s+almıştır/g;

  var SKIP_CODES = ['SFL 11A', 'SFL 11B', 'SFL 12A', 'SFL 12B'];

  function normalizeCode(code) {
    return code.replace(/\s+/g, ' ').trim();
  }

  function seasonInfo(rawSeason) {
    var s = rawSeason.toLowerCase();
    if (s.indexOf('güz') !== -1 || s.indexOf('fall') !== -1) return { tr: 'Güz Dönemi', rank: 1 };
    if (s.indexOf('bahar') !== -1 || s.indexOf('spring') !== -1) return { tr: 'Bahar Dönemi', rank: 2 };
    return { tr: 'Yaz Okulu', rank: 3 };
  }

  function extractSubstitutions(text) {
    var subs = {};
    var m;
    SUBSTITUTION_RE.lastIndex = 0;
    while ((m = SUBSTITUTION_RE.exec(text)) !== null) {
      subs[normalizeCode(m[1])] = normalizeCode(m[2]);
    }
    return subs;
  }

  function parse(text) {
    var substitutions = extractSubstitutions(text);

    // Dönem başlıklarını bul (her dönemin TR ve EN başlığı ayrı yakalanır;
    // ikisi de aynı kanonik ada normalize edilip birleştirilir)
    var headers = [];
    var m;
    HEADER_RE.lastIndex = 0;
    while ((m = HEADER_RE.exec(text)) !== null) {
      headers.push({ index: m.index, end: m.index + m[0].length, y1: parseInt(m[1], 10), y2: m[2], season: m[3] });
    }

    // "Açıklamalar (Explanations)" bölümünden sonrası ders içermez
    var cutMatch = text.search(/Açıklamalar\s*\(\s*Explanations\s*\)/);
    var cutoff = cutMatch === -1 ? text.length : cutMatch;
    headers = headers.filter(function (h) { return h.index < cutoff; });

    var semesterMap = {};   // kanonik ad -> { name, sortKey, cards: [] }
    var cards = [];
    var idCounter = 1;

    function addCard(semKey, sortKey, code, grade, credit, comment, tValue) {
      if (!code || !credit) return;
      if (SKIP_CODES.indexOf(code) !== -1) return;

      grade = (grade || '').trim();
      if (grade === 'F' || grade === 'KL') grade = 'FF';

      var tokens = (comment || '').trim().split(/\s+/);
      var isWithdrawn = grade === 'W' || tokens.indexOf('DÇ') !== -1;
      var isRepeated = tokens.indexOf('TKR') !== -1;
      var isSubstitute = tokens.indexOf('YRN') !== -1;

      var status = 'taken';
      var lessonInputType = 'input';
      var repeatedLesson = '';

      if (isWithdrawn) {
        status = 'not taken';
        grade = 'W';
      } else if (tValue === '0') {
        // Teorik saati 0 olan dersler (PE vb.) ortalamaya girmez
        status = 'non credit';
        if (grade !== 'FF') grade = '';
      } else if (isSubstitute && substitutions[code]) {
        status = 'repeated with';
        lessonInputType = 'select';
        repeatedLesson = substitutions[code];
      } else if (isRepeated) {
        status = 'repeated with';
        lessonInputType = 'select';
        repeatedLesson = code;
      }

      var card = {
        id: 'card-' + (idCounter++),
        lesson: code,
        lessonInputType: lessonInputType,
        status: status,
        grade: grade,
        credit: credit,
        repeatedLesson: repeatedLesson,
        top: '',
        left: '',
        origin: ''
      };
      cards.push(card);

      if (!semesterMap[semKey]) {
        semesterMap[semKey] = { name: semKey, sortKey: sortKey, cards: [] };
      }
      semesterMap[semKey].cards.push(card.id);
    }

    headers.forEach(function (header, i) {
      var blockEnd = i + 1 < headers.length ? headers[i + 1].index : cutoff;
      var content = text.slice(header.end, blockEnd);

      var info = seasonInfo(header.season);
      var semKey = header.y1 + '-' + header.y2 + ' ' + info.tr;
      var sortKey = header.y1 * 10 + info.rank;

      var lm;
      LESSON_RE.lastIndex = 0;
      while ((lm = LESSON_RE.exec(content)) !== null) {
        var code = normalizeCode(lm[1]);
        var tValue = lm[3];
        var credit = lm[5];
        var grade = lm[8];
        var comment = lm[9];
        addCard(semKey, sortKey, code, grade, credit, comment, tValue);
      }
    });

    var semesters = Object.keys(semesterMap).map(function (k) { return semesterMap[k]; });
    semesters.sort(function (a, b) { return a.sortKey - b.sortKey; });

    return {
      semesters: semesters.map(function (s) { return { name: s.name, cards: s.cards }; }),
      cards: cards
    };
  }

  global.GPAParser = { parse: parse };
})(typeof window !== 'undefined' ? window : globalThis);
