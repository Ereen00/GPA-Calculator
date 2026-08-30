/*
 * YÖK e-Devlet "Not Döküm Belgesi" şablonu okuyucusu
 *
 * Türkiye'deki üniversitelerin e-Devlet üzerinden verdiği transkriptler ortak bir
 * şablon kullanır: tek sütun, dönem başlıkları ve altında ders satırları. Bu dosya
 * o şablonu okur; üniversiteye özgü olan kısımlar (ders kodu deseni, hangi notun ne
 * anlama geldiği, hangi kredi sütununun kullanılacağı) yapılandırma ile verilir.
 *
 * Satır biçimi (pdf.js çıkarım sırası):
 *   [*] KOD  [Türkçe Ad]  [(English Name)]  STATÜ  DİL  T  U  UK  AKTS  PUAN  NOT  [AÇIKLAMA]
 * — PUAN, NOTTAN ÖNCE gelir (görsel sıranın tersi).
 * — T, U ve PUAN sütunları "-" olabilir (ODTÜ).
 * — Kod başındaki "*" o dersin genel not ortalamasına dahil edilmediğini gösterir.
 *
 * Ayrıştırma iki aşamalıdır: önce blok içindeki ders kodlarının yerleri bulunur, sonra
 * her satır bir SONRAKİ ders koduna kadar kesilip tek başına okunur. Tek bir "tembel"
 * desenle okumak güvenli değil — notu beklenmedik bir şey olan bir satır (ör. yabancı
 * dil yeterlik dersinin notu "B2.1") eşleşmeyince desen bir sonraki dersin sayılarına
 * kadar uzayıp o dersi yutuyor.
 *
 * Kullanım (parser-<id>.js içinde):
 *   var parse = GPAYokTranskript.createParser({ ... });
 *   GPAUniversities.get('<id>').parse = parse;
 */
(function (global) {
  'use strict';

  // "2024-2025 Güz Dönemi" / "2025-2026 Bahar Dönemi" / "… Yaz Okulu".
  // Aynı satırdaki İngilizce karşılığı ("(2024-2025 Fall Term)") kasten eşleşmez,
  // yoksa her dönem iki kez yakalanırdı.
  var HEADER_RE = /(\d{4})-(\d{4})\s+(Güz|Bahar|Yaz)\s+(?:Dönemi|Okulu)/g;

  // Ders adından sonraki sabit sütunlar. Sayı beklenen yerlerde "-" de kabul edilir.
  var ROW_RE = new RegExp(
    '^[\\s\\S]*?' +                                 // ders adı (TR + parantezli EN karşılığı)
    '\\b(Z|S)\\s+' +                                // 1: dersin statüsü (zorunlu/seçmeli)
    '([A-ZÇĞİÖŞÜ][a-zçğıöşü]*\\.?)\\s+' +           // 2: öğretim dili (Tr, İng., Alm. …)
    '(-|\\d+)\\s+(-|\\d+)\\s+' +                    // 3:T 4:U
    '(-|\\d+)\\s+(-|\\d+)\\s+' +                    // 5:UK 6:AKTS
    '(-|[\\d.]+)\\s+' +                             // 7: puan (100'lük ham puan)
    '(\\S+)'                                        // 8: harfli başarı notu
  );

  function seasonInfo(season) {
    var s = String(season).toLocaleLowerCase('tr');
    if (s.indexOf('güz') !== -1) return { tr: 'Güz Dönemi', rank: 1 };
    if (s.indexOf('bahar') !== -1) return { tr: 'Bahar Dönemi', rank: 2 };
    return { tr: 'Yaz Okulu', rank: 3 };
  }

  /* Belge, ortalamanın hangi kredi üzerinden hesaplandığını kendi başlığında yazar:
     "Kredi Türü : Ulusal" (ODTÜ, Boğaziçi) ya da "… : AKTS" (Marmara). Alan
     okunamazsa profilin varsayılanına düşülür. */
  function creditColumn(text, fallback) {
    var match = /Kredi\s+Türü\s*:?\s*(AKTS|Ulusal)/i.exec(text);
    if (!match) return fallback;
    return /ulusal/i.test(match[1]) ? 'uk' : 'akts';
  }

  function toNumber(value) {
    if (value === '-') return null;
    var num = parseFloat(value);
    return isNaN(num) ? null : num;
  }

  /*
   * config:
   *   id            profil kimliği (not tablosunu buradan okur)
   *   codePattern   ders kodu regex kaynağı (ör. '\\d{7}' ya da '[A-Z]{2,5}\\d{3,4}')
   *   defaultCredit 'uk' | 'akts' — belgede "Kredi Türü" yoksa kullanılır
   *   nonCredit     ne ortalamaya ne krediye giren notlar
   *   creditOnly    ortalamaya girmeyen ama krediyi kazandıran notlar
   *   pending       sonucu belli olmayan notlar (not boşaltılır, ders devam ediyor sayılır)
   *   withdrawn     çekilme notları (ders hiç alınmamış sayılır)
   */
  function createParser(config) {
    var CODE_RE = new RegExp('(\\*\\s*)?\\b(' + config.codePattern + ')\\b', 'g');
    var nonCredit = config.nonCredit || [];
    var creditOnly = config.creditOnly || [];
    var pending = config.pending || [];
    var withdrawn = config.withdrawn || ['W'];

    function gradeTable() {
      var profile = global.GPAUniversities && global.GPAUniversities.get(config.id);
      return (profile && profile.grades) || {};
    }

    return function parse(doc) {
      var text = (doc && doc.text) || '';
      var collector = global.GPAUniversities.createCollector();
      var useEcts = creditColumn(text, config.defaultCredit) === 'akts';

      // "Açıklamalar (Explanations)" bölümünden sonrası not baremi ve kısaltmalar
      // listesidir; ders satırı içermez.
      var cut = text.search(/Açıklamalar\s*\(\s*Explanations\s*\)/);
      var cutoff = cut === -1 ? text.length : cut;

      var headers = [];
      var match;
      HEADER_RE.lastIndex = 0;
      while ((match = HEADER_RE.exec(text)) !== null) {
        if (match.index >= cutoff) break;
        headers.push({
          index: match.index,
          end: match.index + match[0].length,
          y1: parseInt(match[1], 10),
          y2: match[2],
          season: match[3]
        });
      }

      headers.forEach(function (header, i) {
        var blockEnd = i + 1 < headers.length ? headers[i + 1].index : cutoff;
        var content = text.slice(header.end, blockEnd);

        var info = seasonInfo(header.season);
        var semKey = header.y1 + '-' + header.y2 + ' ' + info.tr;
        var sortKey = header.y1 * 10 + info.rank;

        // 1. aşama: blok içindeki ders kodlarının yerleri
        var marks = [];
        var codeMatch;
        CODE_RE.lastIndex = 0;
        while ((codeMatch = CODE_RE.exec(content)) !== null) {
          marks.push({
            star: !!codeMatch[1],
            code: codeMatch[2],
            start: codeMatch.index,
            end: codeMatch.index + codeMatch[0].length
          });
        }

        // 2. aşama: her ders kodundan bir sonrakine kadarki parçayı tek satır olarak oku
        marks.forEach(function (mark, m) {
          var slice = content.slice(mark.end, m + 1 < marks.length ? marks[m + 1].start : content.length);
          var row = ROW_RE.exec(slice);
          if (!row) return;   // ders satırı değil (özet satırı, sayfa başlığı, öğrenci no vb.)

          // Kredi sütunu "-" ise ders kredisiz sayılır; satır yine de kaydedilir
          var credit = toNumber(useEcts ? row[6] : row[5]);
          if (credit === null) credit = 0;

          var grade = row[8];
          var status = 'taken';

          if (withdrawn.indexOf(grade) !== -1) {
            // Dersten çekilme: ortalamaya da denenen krediye de girmez
            status = 'not taken';
          } else if (mark.star || nonCredit.indexOf(grade) !== -1 || credit === 0) {
            status = 'non credit';
          } else if (creditOnly.indexOf(grade) !== -1) {
            // Ortalamaya girmez ama tamamlanan krediye sayılır (profilde creditOnlyGrades)
            grade = creditOnly[0];
          } else if (pending.indexOf(grade) !== -1) {
            // Sonucu belli olmayan ders: devam ediyor sayılır, notu boş bırakılır
            grade = '';
          } else if (!Object.prototype.hasOwnProperty.call(gradeTable(), grade)) {
            // Not tablosunda olmayan bir işaret (ör. dil yeterlik dersinin "B2.1"
            // seviyesi): ortalamaya katılmaz ama belgede ne yazıyorsa korunur.
            status = 'non credit';
          }

          collector.add(semKey, sortKey, {
            lesson: mark.code,
            status: status,
            grade: grade,
            credit: String(credit),
            repeatedLesson: ''
          });
        });
      });

      var data = collector.result();
      // Bu şablonda ayrı bir tekrar sütunu yok; aynı kodun sonraki alınışları tekrar sayılır.
      return config.markRepeats === false ? data : global.GPAUniversities.markRepeats(data);
    };
  }

  global.GPAYokTranskript = { createParser: createParser };
})(typeof window !== 'undefined' ? window : globalThis);
