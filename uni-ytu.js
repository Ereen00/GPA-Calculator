/*
 * Yıldız Teknik Üniversitesi profili — not tablosu, kurallar ve belge tespiti.
 * Ayrıştırıcı ayrı dosyada: parser-ytu.js
 *
 * Kaynaklar ve doğrulama: docs/ytu-notlandirma.md
 *  - YTÜ Önlisans ve Lisans Eğitim-Öğretim Yönetmeliği (RG 19.01.2012/28178), Md. 27-28, 32
 *  - YTÜ Ders Kayıt Esasları (DD-125, 28.08.2025 Senato), Md. 4 ve 7
 *  - Gerçek bir YTÜ "Öğrenci Not Çizelgesi" belgesinin basılı YANO/AGNO değerleri
 */
(function (global) {
  'use strict';

  var profile = {
    id: 'ytu',
    name: { tr: 'Yıldız Teknik Üniversitesi', en: 'Yıldız Technical University' },
    short: { tr: 'YTÜ', en: 'YTU' },

    /* Yönetmelik Md. 27/b'deki çift harfli skala. Transkript açıklama sayfasında
       ayrıca artı/eksili bir skala da basılıdır (A, A-, B+, B, B-, C+, C, C-, D+, D, F);
       yönetmelikte yer almadığı ve elimizdeki transkriptte kullanılmadığı için grafik
       sıralamasına alınmadı, ama o notlarla karşılaşılırsa NaN olmasın diye tabloda tutuluyor.

       F0 (devamsız) burada 0.00'dır: dönem ortalamasına (YANO) 0 olarak girer.
       Kümülatif ortalamadan (AGNO) çıkarılması rules.excludeFromCumulative ile yapılır. */
    grades: {
      AA: 4.0, BA: 3.5, BB: 3.0, CB: 2.5, CC: 2.0, DC: 1.5, DD: 1.0, FD: 0.5, FF: 0.0, F0: 0.0,
      // artı/eksili skala (ikincil)
      A: 4.0, 'A-': 3.7, 'B+': 3.3, B: 3.0, 'B-': 2.7,
      'C+': 2.3, C: 2.0, 'C-': 1.7, 'D+': 1.3, D: 1.0, F: 0.0
    },
    gradeOrder: ['AA', 'BA', 'BB', 'CB', 'CC', 'DC', 'DD', 'FD', 'FF', 'F0'],

    /* Editördeki not açılır listesi. G (geçer), K (kalır), M / M(i) (muaf) ve İ (izinli)
       ortalamaya hiç girmediği için not olarak değil, dersin durumu ("kredisiz") olarak
       tutulur — ayrıştırıcı bu dersleri 'non credit' işaretler. */
    gradeOptions: ['AA', 'BA', 'BB', 'CB', 'CC', 'DC', 'DD', 'FD', 'FF', 'F0', ''],

    repeatCandidateGrades: ['DC', 'DD', 'FD', 'FF', 'F0'],

    passingGrade: 2.0,              // CC ve üstü başarılı (Md. 27/c-1)
    conditionalGrades: ['DC', 'C-', 'D+'],  // koşullu başarılı — AGNO ≥ 2.00 şartıyla geçerli

    rules: {
      /* Son notu F0 olan ders AGNO'nun ne payına ne paydasına girer. Yönetmelik Md. 27/c-4
         "katılır" dese de transkriptin kendi açıklama tablosunda F0'ın sayısal karşılığı
         "---" ve belgedeki AGNO ancak bu dersler dışlanınca tutuyor (2,51 / 92 kredi).
         Ayrıntılı gerekçe: docs/ytu-notlandirma.md §4. */
      excludeFromCumulative: ['F0'],

      /* Tamamlanmış sayılan en düşük not: DC (koşullu başarılı) dahil, DD ve altı hariç.
         Transkriptteki "Tamamlanan Yerel Kredi" bu eşikle birebir tutuyor. */
      completedMinGrade: 1.5,

      /* Ders yükü (DD-125 Md. 7/2) — yerel kredi üzerinden */
      maxCreditsPerTerm: 25,
      maxCreditsPerTermHighGpa: 28,       // AGNO ≥ 3.00
      maxCreditsPerTermDoubleMajor: 31,   // ÇAP / Yandal / Formasyon, AGNO ≥ 3.00
      highGpaThreshold: 3.0,

      /* Ardışık iki yarıyıl AGNO < 2.00 → üst yarıyıldan ders alınamaz (5. yarıyıldan itibaren) */
      probationGpa: 2.0,
      probationFromTerm: 5,

      graduationGpa: 2.0,     // Md. 32
      graduationEcts: 240,    // lisans; önlisans 120
      honors: [
        { id: 'highHonor', min: 3.5, max: 4.0 },   // yüksek onur
        { id: 'honor', min: 3.0, max: 3.49 }       // onur
      ]
    },

    /* Belge tespiti. YTÜ transkriptinin adı "Öğrenci Not Çizelgesi"dir ve her sayfada
       üniversite adı basılıdır; pdf.js metni harf öbeklerine bölebildiği için
       harfler arası boşluğa toleranslı bakılır. */
    detect: function (doc) {
      var text = doc.text || '';
      var uni = /Y\s*ı\s*l\s*d\s*ı\s*z\s+T\s*e\s*k\s*n\s*i\s*k/i.test(text) ||
        /YILDIZ\s+TEKN[İI]K/i.test(text);
      var belge = /Ö\s*ğ\s*r\s*e\s*n\s*c\s*i\s+N\s*o\s*t\s+Ç\s*i\s*z\s*e\s*l\s*g\s*e\s*s\s*i/i.test(text);
      if (uni && belge) return 1;
      if (uni) return 0.8;
      // Üniversite adı okunamadıysa YTÜ'ye özgü ortalama adlarına bak
      if (belge && /\bYANO\b/.test(text) && /\bAGNO\b/.test(text)) return 0.6;
      return 0;
    }
  };

  if (global.GPAUniversities) global.GPAUniversities.register(profile);
  global.GPAUniYtu = profile;
})(typeof window !== 'undefined' ? window : globalThis);
