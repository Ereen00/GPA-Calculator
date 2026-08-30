/*
 * Boğaziçi Üniversitesi transkript ayrıştırıcısı (uni-bogazici.js profiline bağlanır)
 * pdf.js ile çıkarılan metni tamamen İSTEMCİ TARAFINDA işler; sunucu gerekmez.
 *
 * İki farklı belge biçimini tanır:
 *  A) "Öğrenci Durum Belgesi" (TR/EN karışık, sütunlar: Z/S · İng. · T U UK AKTS PUAN NOT AÇIKLAMA)
 *  B) Resmî "TRANSCRIPT" (tümü İngilizce, sütunlar: COURSE CODE · COURSE TITLE · CREDITS ·
 *     ECTS · GRADE · REPEAT; dönem başlığı "2024/2025-2  4th SEMESTER")
 *
 * Çıktı her iki biçimde de aynı GPAStorage v1 veri biçimidir:
 *   { semesters: [{ name, cards: [cardId] }], cards: [{ id, lesson, status, grade, credit, ... }] }
 *
 * Tanınan durumlar:
 *  - W notu / DÇ açıklaması / L notu -> 'not taken' (çekilen)
 *  - T (teorik saat) = 0 veya kredi 0 -> 'non credit' (PE vb. ortalamaya girmeyen dersler)
 *  - NC, P, RM notları              -> 'non credit'
 *  - TKR açıklaması / R işareti      -> 'repeated with' (dersin kendisi tekrar)
 *  - YRN açıklaması / R + farklı kod -> 'repeated with' (başka dersin yerine; A biçiminde hedef
 *                                       "X kodlu dersi Y yerine almıştır" cümlesinden, B biçiminde
 *                                       REPEAT sütunundaki koddan bulunur)
 *  - F / KL / NP notları FF'e çevrilir; notu henüz girilmemiş (devam eden) dersler '' olarak aktarılır.
 */
(function (global) {
  'use strict';

  // ---------------------------------------------------------------- ortak yardımcılar

  var SKIP_CODES = ['SFL 11A', 'SFL 11B', 'SFL 12A', 'SFL 12B'];

  // Ders kodu: "PSY 101", "MATH101", "EC  101", "TRM 48M", "CMPE 250"
  var CODE = '[A-Z]{2,6}\\s{0,3}\\d{2,3}[A-Z]?';

  function normalizeCode(code) {
    return code.replace(/\s+/g, ' ').trim();
  }

  // "3.00" -> "3", "1.50" -> "1.5", "3" -> "3"
  function normalizeCredit(value) {
    var num = parseFloat(value);
    return isNaN(num) ? '' : String(num);
  }

  function seasonInfo(rawSeason) {
    var s = String(rawSeason).toLowerCase();
    if (s.indexOf('güz') !== -1 || s.indexOf('fall') !== -1) return { tr: 'Güz Dönemi', rank: 1 };
    if (s.indexOf('bahar') !== -1 || s.indexOf('spring') !== -1) return { tr: 'Bahar Dönemi', rank: 2 };
    return { tr: 'Yaz Okulu', rank: 3 };
  }

  // Resmî transkriptteki dönem kodu: 1 = Güz, 2 = Bahar, 3 = Yaz Okulu
  function seasonByTermCode(code) {
    if (code === '1') return { tr: 'Güz Dönemi', rank: 1 };
    if (code === '2') return { tr: 'Bahar Dönemi', rank: 2 };
    return { tr: 'Yaz Okulu', rank: 3 };
  }

  /* Kart/dönem biriktirici: iki biçim de aynı çıktıyı üretsin diye ortak. */
  function createCollector() {
    var semesterMap = {};   // kanonik ad -> { name, sortKey, cards: [] }
    var cards = [];
    var idCounter = 1;

    return {
      add: function (semKey, sortKey, fields) {
        if (!fields.lesson || !fields.credit) return;
        if (SKIP_CODES.indexOf(fields.lesson) !== -1) return;

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
      },

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

  // ---------------------------------------------------- A) Öğrenci Durum Belgesi biçimi

  var SEASON = '(Güz|Bahar|Yaz\\s+Okulu|Fall\\s+Term|Spring\\s+Term|Summer\\s+School)';
  var STATUS_HEADER_RE = new RegExp('(\\d{4})-(\\d{4})\\s+' + SEASON, 'g');

  // pdf.js çıkarım sırası: KOD AD (EN AD) Z|S İng. T U UK AKTS PUAN [NOT] AÇIKLAMA...
  var COMMENT_TOKEN = '(?:TKR|YRN|DÇ|SG|KL|HAZ|G|--|-)';
  var STATUS_LESSON_RE = new RegExp(
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

  function extractSubstitutions(text) {
    var subs = {};
    var m;
    SUBSTITUTION_RE.lastIndex = 0;
    while ((m = SUBSTITUTION_RE.exec(text)) !== null) {
      subs[normalizeCode(m[1])] = normalizeCode(m[2]);
    }
    return subs;
  }

  function parseStatusDocument(text) {
    var substitutions = extractSubstitutions(text);
    var collector = createCollector();

    // Dönem başlıklarını bul (her dönemin TR ve EN başlığı ayrı yakalanır;
    // ikisi de aynı kanonik ada normalize edilip birleştirilir)
    var headers = [];
    var m;
    STATUS_HEADER_RE.lastIndex = 0;
    while ((m = STATUS_HEADER_RE.exec(text)) !== null) {
      headers.push({ index: m.index, end: m.index + m[0].length, y1: parseInt(m[1], 10), y2: m[2], season: m[3] });
    }

    // "Açıklamalar (Explanations)" bölümünden sonrası ders içermez
    var cutMatch = text.search(/Açıklamalar\s*\(\s*Explanations\s*\)/);
    var cutoff = cutMatch === -1 ? text.length : cutMatch;
    headers = headers.filter(function (h) { return h.index < cutoff; });

    headers.forEach(function (header, i) {
      var blockEnd = i + 1 < headers.length ? headers[i + 1].index : cutoff;
      var content = text.slice(header.end, blockEnd);

      var info = seasonInfo(header.season);
      var semKey = header.y1 + '-' + header.y2 + ' ' + info.tr;
      var sortKey = header.y1 * 10 + info.rank;

      var lm;
      STATUS_LESSON_RE.lastIndex = 0;
      while ((lm = STATUS_LESSON_RE.exec(content)) !== null) {
        var code = normalizeCode(lm[1]);
        var tValue = lm[3];
        var credit = lm[5];
        var grade = (lm[8] || '').trim();
        var tokens = (lm[9] || '').trim().split(/\s+/);

        if (grade === 'F' || grade === 'KL') grade = 'FF';

        var isWithdrawn = grade === 'W' || tokens.indexOf('DÇ') !== -1;
        var isRepeated = tokens.indexOf('TKR') !== -1;
        var isSubstitute = tokens.indexOf('YRN') !== -1;

        var status = 'taken';
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
          repeatedLesson = substitutions[code];
        } else if (isRepeated) {
          status = 'repeated with';
          repeatedLesson = code;
        }

        collector.add(semKey, sortKey, {
          lesson: code,
          status: status,
          grade: grade,
          credit: credit,
          repeatedLesson: repeatedLesson
        });
      }
    });

    return collector.result();
  }

  // ------------------------------------------------------ B) Resmî TRANSCRIPT biçimi

  // "2024/2025-2   4th SEMESTER" — giriş yılı gibi tek başına duran dönem kodlarını
  // yakalamamak için "Nth SEMESTER" ifadesi zorunlu tutulur.
  var TRANSCRIPT_HEADER_RE = /(\d{4})\/(\d{4})-([1-3])\s+\d+\s*(?:st|nd|rd|th)\s+SEMESTER/gi;

  // Her dönem bloğunun başındaki sütun başlığı
  var TRANSCRIPT_COLUMNS_RE = /COURSE\s+CODE\s+COURSE\s+TITLE\s+CREDITS\s+ECTS\s+GRADE(?:\s+REPEAT)?/i;

  // Dönem özetinin başlangıcı: bu noktadan sonrası ders satırı içermez
  var TRANSCRIPT_SUMMARY_RE = /SEMESTER\s*->/i;

  // KOD  AD  KREDİ  AKTS  [NOT]  [R  TEKRAR-EDİLEN-KOD]
  // 'R' not listesinde yer almaz; REPEAT sütununun işaretidir.
  // Not: Transkriptte R'den sonra tekrar edilen dersin kodu her zaman yazılır. Kod
  // yazılmasaydı düz metinde onu bir sonraki dersin kodundan ayırmanın yolu olmazdı;
  // bu yüzden kod yoksa ders kendi tekrarı sayılır.
  var TRANSCRIPT_GRADE = '(?:AA|BA|BB|CB|CC|DC|DD|FF|NC|NP|RM|TP|F|W|P|I|E|L)';
  var TRANSCRIPT_LESSON_RE = new RegExp(
    '(\\b' + CODE + ')' +                                   // 1: ders kodu
    '\\s+(?:\\S[\\s\\S]*?)' +                               // ders adı (tembel atla, en az 1 karakter)
    '\\s+(\\d+(?:\\.\\d+)?)' +                              // 2: kredi
    '\\s+(\\d+(?:\\.\\d+)?)' +                              // 3: AKTS
    '(?:\\s+(' + TRANSCRIPT_GRADE + ')\\b)?' +              // 4: not (devam edenlerde yok)
    '(?:\\s+(R)\\b(?:\\s+(' + CODE + ')\\b)?)?',            // 5: tekrar işareti  6: tekrar edilen kod
    'g'
  );

  function parseOfficialTranscript(text) {
    var collector = createCollector();

    // "KEY TO TRANSCRIPT" (açıklama sayfası) sonrasında ders yoktur
    var cutMatch = text.search(/KEY\s+TO\s+TRANSCRIPT/i);
    var cutoff = cutMatch === -1 ? text.length : cutMatch;

    var headers = [];
    var m;
    TRANSCRIPT_HEADER_RE.lastIndex = 0;
    while ((m = TRANSCRIPT_HEADER_RE.exec(text)) !== null) {
      if (m.index >= cutoff) break;
      headers.push({
        index: m.index,
        end: m.index + m[0].length,
        y1: parseInt(m[1], 10),
        y2: m[2],
        term: m[3]
      });
    }

    headers.forEach(function (header, i) {
      var blockEnd = i + 1 < headers.length ? headers[i + 1].index : cutoff;
      var content = text.slice(header.end, blockEnd);

      // Sütun başlığından sonrasını al, dönem özetinden öncesinde kes:
      // sayfa altbilgisi / TOTAL CREDITS gibi satırlar böylece hiç görülmez.
      var colMatch = content.match(TRANSCRIPT_COLUMNS_RE);
      if (colMatch) content = content.slice(colMatch.index + colMatch[0].length);
      var summaryMatch = content.match(TRANSCRIPT_SUMMARY_RE);
      if (summaryMatch) content = content.slice(0, summaryMatch.index);

      var info = seasonByTermCode(header.term);
      var semKey = header.y1 + '-' + header.y2 + ' ' + info.tr;
      var sortKey = header.y1 * 10 + info.rank;

      var lm;
      TRANSCRIPT_LESSON_RE.lastIndex = 0;
      while ((lm = TRANSCRIPT_LESSON_RE.exec(content)) !== null) {
        var code = normalizeCode(lm[1]);
        var credit = normalizeCredit(lm[2]);
        var grade = (lm[4] || '').trim();
        var isRepeat = !!lm[5];
        var repeatTarget = lm[6] ? normalizeCode(lm[6]) : '';

        var status = 'taken';
        var repeatedLesson = '';

        if (grade === 'F' || grade === 'NP') grade = 'FF';

        if (grade === 'W') {
          status = 'not taken';
        } else if (grade === 'L') {
          // İzinli dönem: ders alınmamış sayılır
          status = 'not taken';
          grade = '';
        } else if (credit === '0' || grade === 'NC' || grade === 'P' || grade === 'RM') {
          status = 'non credit';
          if (grade !== 'FF') grade = '';
        } else {
          if (grade === 'I' || grade === 'E' || grade === 'TP') grade = ''; // sonuçlanmamış
          if (isRepeat) {
            status = 'repeated with';
            repeatedLesson = repeatTarget || code;
          }
        }

        collector.add(semKey, sortKey, {
          lesson: code,
          status: status,
          grade: grade,
          credit: credit,
          repeatedLesson: repeatedLesson
        });
      }
    });

    return collector.result();
  }

  // ------------------------------------------------------------------ biçim seçimi

  function looksLikeOfficialTranscript(text) {
    return TRANSCRIPT_COLUMNS_RE.test(text) ||
      /\d{4}\/\d{4}-[1-3]\s+\d+\s*(?:st|nd|rd|th)\s+SEMESTER/i.test(text);
  }

  /* Belge biçimini tanır, tanınan biçimden ders çıkmazsa diğerini de dener. */
  function parse(text) {
    text = String(text || '');

    var primary = looksLikeOfficialTranscript(text) ? parseOfficialTranscript : parseStatusDocument;
    var fallback = primary === parseOfficialTranscript ? parseStatusDocument : parseOfficialTranscript;

    var result = primary(text);
    if (result.cards.length === 0) {
      var alt = fallback(text);
      if (alt.cards.length > 0) return alt;
    }
    return result;
  }

  var api = {
    parse: parse,
    parseStatusDocument: parseStatusDocument,
    parseOfficialTranscript: parseOfficialTranscript
  };

  // Profile bağlan: GPAParser.parse() belgeyi tespit edip buraya yönlendirir.
  // Ayrıştırıcı yalnız düz metinle çalışır, doc.pages'e ihtiyaç duymaz.
  var profile = global.GPAUniversities && global.GPAUniversities.get('bogazici');
  if (profile) {
    profile.parse = function (doc) { return parse(doc.text); };
  }

  global.GPABogaziciParser = api;
})(typeof window !== 'undefined' ? window : globalThis);
