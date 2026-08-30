/*
 * Marmara Üniversitesi not döküm belgesi ayrıştırıcısı
 * (uni-marmara.js profiline bağlanır; biçim notları docs/marmara-notlandirma.md §6)
 *
 * Belge, Boğaziçi'ninkiyle aynı YÖK e-Devlet şablonudur: tek sütun, dönem başlıkları
 * ve altında ders satırları. Bu yüzden konum bilgisine gerek yoktur, düz metin yeter.
 * Boğaziçi ayrıştırıcısından ayrı tutulmasının nedeni üç farktır:
 *   1. Kredi türü AKTS'tir (Boğaziçi'de Ulusal Kredi). Belge bunu "Kredi Türü" alanında
 *      yazar, ayrıştırıcı o alanı okuyup doğru sütunu seçer.
 *   2. Öğretim dili "Alm." / "Tr" olabilir (Boğaziçi ayrıştırıcısı "İng." bekler).
 *   3. Açıklama sütunu çoğu satırda boştur (Boğaziçi'de TKR/YRN/DÇ zorunlu gibi okunur)
 *      ve not kümesi farklıdır (FG, DZ, MZ, DE, S, U … ).
 *
 * pdf.js çıkarım sırası: KOD [TR ad] [(EN ad)] STATÜ DİL T U UK AKTS PUAN NOT
 * — puan, nottan ÖNCE gelir (görsel sıranın tersi).
 */
(function (global) {
  'use strict';

  // ATA121, WI1005, BCHH1009, MATH1048, SWP4011 …
  var CODE = '[A-ZÇĞİÖŞÜ]{2,5}\\d{3,4}';

  // "2024-2025 Güz Dönemi" / "2025-2026 Bahar Dönemi" / "… Yaz Okulu".
  // Aynı satırdaki İngilizce karşılığı ("(2024-2025 Fall Term)") kasten eşleşmez,
  // yoksa her dönem iki kez yakalanırdı.
  var HEADER_RE = /(\d{4})-(\d{4})\s+(Güz|Bahar|Yaz)\s+(?:Dönemi|Okulu)/g;

  // Ortalamaya girmeyen ama alınmış sayılan notlar/işaretler (Md. 23/8-f, Md. 24)
  // Ne ortalamaya ne de tamamlanan krediye giren notlar/işaretler (Md. 23/8, Md. 24)
  var NON_CREDIT = ['U', 'NC', 'M', 'TI', 'TY', 'TD', 'TS', 'T', 'DP', 'CY', 'BH', 'FR', 'AND', 'OKD', 'G'];
  // S: ortalamaya girmez ama krediyi kazandırır (profilde rules.creditOnlyGrades).
  // MK (kredili dersten muaf) belgede S notuyla gösterilir.
  var CREDIT_ONLY = ['S', 'MK'];
  // Henüz sonuçlanmamış notlar (Md. 23/8-c, -e, -i): not boş bırakılır, ders devam ediyor
  var PENDING = ['MZ', 'E', 'DE', 'YH', 'TZ'];

  /* Ayrıştırma iki aşamalıdır. Önce blok içindeki ders kodlarının yerleri bulunur,
     sonra her dersin satırı bir SONRAKİ ders koduna kadar kesilip tek başına okunur.

     Tek bir "tembel" desenle okumak güvenli değil: notu beklenmedik bir şey olan bir
     satır (ör. Yabancı Dil Yeterlik dersinin notu "B2.1") eşleşmeyince desen bir
     sonraki dersin sayılarına kadar uzayıp o dersi yutuyordu. Kesme, her satırın
     kendi sınırları içinde kalmasını garanti eder. */
  var CODE_RE = new RegExp('(\\*\\s*)?\\b(' + CODE + ')\\b', 'g');

  var ROW_RE = new RegExp(
    '^[\\s\\S]*?' +                                 // ders adı (TR + parantezli EN karşılığı)
    '\\b(Z|S)\\s+' +                                // 1: dersin statüsü (zorunlu/seçmeli)
    '([A-ZÇĞİÖŞÜ][a-zçğıöşü]*\\.?)\\s+' +           // 2: öğretim dili (Tr, Alm., İng. …)
    '(\\d+)\\s+(\\d+)\\s+(\\d+)\\s+(\\d+)\\s+' +    // 3:T 4:U 5:UK 6:AKTS
    '([\\d.]+)\\s+' +                               // 7: puan (100'lük ham puan)
    '(\\S+)'                                        // 8: harfli başarı notu
  );

  /* Belge, ortalamanın hangi kredi üzerinden hesaplandığını kendi başlığında yazar:
     "Kredi Türü : AKTS" ya da "… : Ulusal". Marmara AKTS kullanır; alan okunamazsa
     AKTS varsayılır. */
  function creditColumn(text) {
    var match = /Kredi\s+Türü\s*:?\s*(AKTS|Ulusal)/i.exec(text);
    return (match && /ulusal/i.test(match[1])) ? 'uk' : 'akts';
  }

  /* Profilin not tablosu — tanınmayan işaretleri ayırt etmek için kullanılır. */
  function gradeTable() {
    var profile = global.GPAUniversities && global.GPAUniversities.get('marmara');
    return (profile && profile.grades) || {};
  }

  function seasonInfo(season) {
    var s = String(season).toLocaleLowerCase('tr');
    if (s.indexOf('güz') !== -1) return { tr: 'Güz Dönemi', rank: 1 };
    if (s.indexOf('bahar') !== -1) return { tr: 'Bahar Dönemi', rank: 2 };
    return { tr: 'Yaz Okulu', rank: 3 };
  }

  function normalizeCredit(value) {
    var num = parseFloat(value);
    return isNaN(num) ? null : num;
  }

  function parse(doc) {
    var text = (doc && doc.text) || '';
    var collector = global.GPAUniversities.createCollector();
    var useEcts = creditColumn(text) === 'akts';

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
        if (!row) return;   // ders satırı değil (özet satırı, sayfa başlığı vb.)

        var credit = normalizeCredit(useEcts ? row[6] : row[5]);
        if (credit === null) return;

        var grade = row[8];
        var status = 'taken';

        if (grade === 'W') {
          // Dersten çekilme: ortalamaya da denenen krediye de girmez
          status = 'not taken';
        } else if (mark.star || NON_CREDIT.indexOf(grade) !== -1 || credit === 0) {
          status = 'non credit';
        } else if (CREDIT_ONLY.indexOf(grade) !== -1) {
          // Ortalamaya girmez ama tamamlanan krediye sayılır; not olarak S kalır
          grade = 'S';
        } else if (PENDING.indexOf(grade) !== -1) {
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

    // Belgede ayrı bir tekrar sütunu yok; aynı kodun sonraki alınışları tekrar sayılır.
    return global.GPAUniversities.markRepeats(collector.result());
  }

  var profile = global.GPAUniversities && global.GPAUniversities.get('marmara');
  if (profile) profile.parse = parse;

  global.GPAMarmaraParser = { parse: parse };
})(typeof window !== 'undefined' ? window : globalThis);
