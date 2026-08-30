/*
 * Yıldız Teknik Üniversitesi "Öğrenci Not Çizelgesi" ayrıştırıcısı
 * (uni-ytu.js profiline bağlanır; ayrıntılı biçim notları docs/ytu-notlandirma.md §7)
 *
 * Boğaziçi ayrıştırıcısından farkı: bu belge SAYFADA İKİ SÜTUNLUDUR — solda Güz,
 * sağda Bahar dönemi yan yana dizilir. pdf.js'ten gelen düz metinde iki tablonun
 * satırları iç içe geçtiği için düz metin üzerinde regex çalıştırmak imkânsızdır.
 * Bu yüzden ayrıştırma, her metin parçasının SAYFA ÜZERİNDEKİ KONUMU üzerinden yapılır:
 *
 *   1. Parçalar y'ye göre satırlara toplanır (satır yüksekliği toleransıyla).
 *   2. Her satır, sayfanın ortasından sol/sağ sütuna bölünür.
 *   3. Her sütunun kendi "Ders Kodu | D | M | Ders Adı | Ders Türü | Kredi | ECTS | NOT"
 *      başlık satırından sütun x konumları (çapa) öğrenilir.
 *   4. Veri satırlarındaki parçalar, çapalar arasındaki orta noktalara göre hücrelere dağıtılır.
 *
 * Ders adı iki satıra taşabildiği (ve kod satırının bir üstüne/altına düştüğü) için
 * ders adı hiç kullanılmaz: karta ders KODU yazılır — Boğaziçi ayrıştırıcısıyla aynı
 * davranış, tekrar eşleştirmesi de kod üzerinden yapılır.
 */
(function (global) {
  'use strict';

  // ATA1031, END1911, FIZ1002, MFK4991, TIB1000 ... (harf öbeği + 3-4 rakam)
  var COURSE_CODE_RE = /^[A-ZÇĞİÖŞÜ]{2,5}\d{3,4}[A-Z]?$/;

  // "2023-2024 Güz" / "2024-2025 Bahar" / "2023-2024 Yaz"
  var SEMESTER_RE = /(\d{4})\s*-\s*(\d{4})\s+(Güz|Bahar|Yaz)/i;

  // Sütun başlığındaki etiketler (çapa olarak kullanılır)
  var HEADER_LABELS = ['Ders Kodu', 'D', 'M', 'Ders Adı', 'Ders Türü', 'Kredi', 'ECTS', 'NOT'];

  // Ortalamaya girmeyen, "not" yerine durum bildiren işaretler (yönetmelik Md. 27/b)
  var NON_CREDIT_GRADES = ['G', 'K', 'M', 'M(i)', 'İ', 'I', 'E'];

  function seasonInfo(season) {
    var s = String(season).toLocaleLowerCase('tr');
    if (s.indexOf('güz') !== -1) return { tr: 'Güz Dönemi', rank: 1 };
    if (s.indexOf('bahar') !== -1) return { tr: 'Bahar Dönemi', rank: 2 };
    return { tr: 'Yaz Okulu', rank: 3 };
  }

  // "3" -> "3", "1,5" -> "1.5" (belgede ondalık ayırıcı virgül)
  function normalizeNumber(value) {
    var num = parseFloat(String(value).replace(',', '.'));
    return isNaN(num) ? null : num;
  }

  /* Parçaları y'ye göre satırlara toplar. Aynı satırdaki parçalar birebir aynı y'de
     olmayabildiği için küçük bir tolerans kullanılır. */
  function groupRows(items) {
    var rows = [];
    items.forEach(function (item) {
      if (!item || !String(item.str).trim()) return;
      var row = null;
      for (var i = 0; i < rows.length; i++) {
        if (Math.abs(rows[i].y - item.y) < 2.5) { row = rows[i]; break; }
      }
      if (!row) { row = { y: item.y, items: [] }; rows.push(row); }
      row.items.push(item);
    });
    rows.sort(function (a, b) { return b.y - a.y; });   // sayfanın üstünden altına
    rows.forEach(function (row) {
      row.items.sort(function (a, b) { return a.x - b.x; });
    });
    return rows;
  }

  /* Başlık satırından sütun çapalarını çıkarır: [{ label, x }] soldan sağa.
     Bir sütunda tüm etiketler bulunamazsa (belge bozuksa) null döner. */
  function readAnchors(items) {
    var anchors = [];
    items.forEach(function (item) {
      var text = String(item.str).trim();
      if (HEADER_LABELS.indexOf(text) !== -1) anchors.push({ label: text, x: item.x });
    });
    if (anchors.length < 4) return null;
    anchors.sort(function (a, b) { return a.x - b.x; });
    return anchors;
  }

  /* Bir veri satırının parçalarını çapalara göre hücrelere dağıtır.
     Hücre sınırı iki komşu çapanın tam ortasıdır; ilk hücre sola, son hücre sağa açıktır.
     (Değerler başlıklarına göre birkaç punto sağa kaydığından "en yakın çapa" yerine
     sınır yöntemi kullanılır — kaydırma sınırı aşmadığı sürece doğru hücreye düşer.) */
  function assignCells(items, anchors) {
    var cells = {};
    anchors.forEach(function (a) { cells[a.label] = []; });

    items.forEach(function (item) {
      var text = String(item.str).trim();
      if (!text) return;
      var label = anchors[anchors.length - 1].label;
      for (var i = 0; i < anchors.length - 1; i++) {
        var boundary = (anchors[i].x + anchors[i + 1].x) / 2;
        if (item.x < boundary) { label = anchors[i].label; break; }
      }
      cells[label].push(text);
    });

    var out = {};
    Object.keys(cells).forEach(function (k) { out[k] = cells[k].join(' ').trim(); });
    return out;
  }

  function isHeaderRow(items) {
    var joined = items.map(function (i) { return String(i.str).trim(); }).join(' ');
    return joined.indexOf('Ders Kodu') !== -1 && joined.indexOf('NOT') !== -1;
  }

  function parse(doc) {
    var collector = global.GPAUniversities.createCollector();
    var pages = (doc && doc.pages) || [];
    if (!pages.length) return collector.result();

    // Sütun durumu sayfalar arasında korunur: bir dönem bloğu sayfa sonunda
    // bölünürse devamı aynı döneme yazılsın.
    var columns = [
      { semKey: null, sortKey: 0, anchors: null },
      { semKey: null, sortKey: 0, anchors: null }
    ];

    pages.forEach(function (page) {
      var middle = (page.width || 595) / 2;

      groupRows(page.items).forEach(function (row) {
        var split = [[], []];
        row.items.forEach(function (item) {
          split[item.x < middle ? 0 : 1].push(item);
        });

        // Dönem başlığı satırı tüm sayfa için blok sınırıdır: başlık bulunmayan
        // sütunun önceki dönemi devam ediyor sayılmamalı (ör. yalnız solda açılan
        // "Yaz" bloğunda sağ sütun boştur).
        var headers = split.map(function (items) {
          return items.length ? SEMESTER_RE.exec(items.map(function (i) { return i.str; }).join(' ')) : null;
        });
        if (headers[0] || headers[1]) {
          headers.forEach(function (match, c) {
            if (match) {
              var info = seasonInfo(match[3]);
              columns[c].semKey = match[1] + '-' + match[2] + ' ' + info.tr;
              columns[c].sortKey = parseInt(match[1], 10) * 10 + info.rank;
            } else {
              columns[c].semKey = null;
            }
          });
          return;
        }

        split.forEach(function (items, c) {
          if (!items.length) return;
          var col = columns[c];

          if (isHeaderRow(items)) {
            var anchors = readAnchors(items);
            if (anchors) col.anchors = anchors;
            return;
          }
          if (!col.anchors || !col.semKey) return;

          var cells = assignCells(items, col.anchors);
          var code = (cells['Ders Kodu'] || '').replace(/\s+/g, '');
          if (!COURSE_CODE_RE.test(code)) return;

          // Yerel kredi ortalamanın tabanıdır; sayı değilse satır ders satırı değildir
          var credit = normalizeNumber(cells['Kredi']);
          if (credit === null) return;

          var grade = (cells['NOT'] || '').trim();
          var exemption = (cells['M'] || '').trim();

          var status = 'taken';
          if (exemption || NON_CREDIT_GRADES.indexOf(grade) !== -1) {
            // Muaf / geçer-kalır / izinli dersler ortalamaya girmez
            status = 'non credit';
          } else if (credit === 0) {
            // Yerel kredisi 0 olan dersler (Türkçe, Atatürk İlkeleri, hazırlık vb.)
            // ortalamaya girmez; notu bilgi olarak korunur.
            status = 'non credit';
          }

          collector.add(col.semKey, col.sortKey, {
            lesson: code,
            status: status,
            grade: grade,
            credit: String(credit),
            repeatedLesson: ''
          });
        });
      });
    });

    return markRepeats(collector.result());
  }

  /* Aynı ders kodu birden çok dönemde geçiyorsa, ilkinden sonraki her alınış
     "tekrar" olarak işaretlenir. Ortalama hesabı zaten son alınışı kullanır
     (gpa.js); bu işaret, planlayıcıda eski denemenin etkisiz olduğunu göstermek
     ve Boğaziçi ayrıştırıcısıyla aynı veri biçimini üretmek içindir. */
  function markRepeats(data) {
    var byId = {};
    data.cards.forEach(function (card) { byId[card.id] = card; });

    var seen = {};
    data.semesters.forEach(function (sem) {
      // Aynı dönemde aynı kod iki kez geçerse ikincisi tekrar sayılmasın diye
      // dönem içindeki kodlar dönem sonunda işaretlenir.
      var inTerm = {};
      sem.cards.forEach(function (id) {
        var card = byId[id];
        if (!card || card.status !== 'taken') return;
        if (seen[card.lesson]) {
          card.status = 'repeated with';
          card.lessonInputType = 'select';
          card.repeatedLesson = card.lesson;
        }
        inTerm[card.lesson] = true;
      });
      Object.keys(inTerm).forEach(function (code) { seen[code] = true; });
    });

    return data;
  }

  var profile = global.GPAUniversities && global.GPAUniversities.get('ytu');
  if (profile) profile.parse = parse;

  global.GPAYtuParser = { parse: parse };
})(typeof window !== 'undefined' ? window : globalThis);
