/*
 * Orta Doğu Teknik Üniversitesi (ODTÜ) profili — not tablosu, kurallar ve belge tespiti.
 * Ayrıştırıcı ayrı dosyada: parser-odtu.js
 *
 * Kaynaklar ve doğrulama: docs/odtu-notlandirma.md
 *  - ODTÜ Lisans Eğitim-Öğretim Yönetmeliği, Md. 17 (kredi), Md. 18 (ders yükü),
 *    Md. 24 (harf notları), Md. 26 (ders tekrarı), Md. 27 (not ortalamaları),
 *    Md. 28-30 (başarı durumu, sınamalı), Md. 31 ve 34 (mezuniyet, şeref dereceleri)
 *  - Gerçek bir ODTÜ not döküm belgesinin basılı DNO/GNO değerleri
 */
(function (global) {
  'use strict';

  var profile = {
    id: 'odtu',
    name: { tr: 'Orta Doğu Teknik Üniversitesi', en: 'Middle East Technical University' },
    short: { tr: 'ODTÜ', en: 'METU' },

    /* Md. 24/5-a. NA (devamsız / sınava girmemiş), Md. 24/5-b uyarınca
       "not ortalamaları hesabında FF notu işlemi görür": katsayı 0,00 ve dersin
       kredisi paydaya KATILIR. Bu yüzden tabloda 0.00 olarak yer alır ve
       rules.excludeFromCumulative boştur. */
    grades: {
      AA: 4.0, BA: 3.5, BB: 3.0, CB: 2.5, CC: 2.0, DC: 1.5, DD: 1.0,
      FD: 0.5, FF: 0.0, NA: 0.0
    },
    gradeOrder: ['AA', 'BA', 'BB', 'CB', 'CC', 'DC', 'DD', 'FD', 'FF', 'NA'],

    /* S, U, EX, I, W (Md. 24/5-c) ve belgedeki P / PASS / FAIL ortalamalara katılmaz;
       ayrıştırıcı bu dersleri 'non credit' ya da 'not taken' işaretler. */
    gradeOptions: ['AA', 'BA', 'BB', 'CB', 'CC', 'DC', 'DD', 'FD', 'FF', 'NA', ''],

    // Md. 26/1: FF, FD, NA, U ve W alınan dersler tekrarlanmak zorundadır
    repeatCandidateGrades: ['FD', 'FF', 'NA'],

    /* Md. 31/1-a: müfredattaki tüm dersler en az DD veya S ile tamamlanmalıdır,
       yani DD geçer nottur. Koşullu geçme yoktur. */
    passingGrade: 1.0,
    conditionalGrades: [],

    rules: {
      excludeFromCumulative: [],   // NA dahil her not paydaya girer
      completedMinGrade: 1.0,      // DD ve üstü başarılı sayılır

      /* Md. 18: ders yükü kredi değil DERS SAYISI üzerinden sınırlanır. Normal yük,
         müfredatta en fazla kredili dersin bulunduğu yarıyıldaki ders sayısıdır. */
      maxCreditsPerTerm: null,
      minCoursesPerTerm: 3,               // asgari yük: üç kredili ders (Md. 18/3)
      extraCourseGpa: [                   // normal yükün üstüne ders ekleme (Md. 18/2)
        { minGpa: 2.5, extraCourses: 2 },
        { minGpa: 2.0, extraCourses: 1 }
      ],

      /* Md. 30: GNO iki yarıyıl üst üste 2,00'ın altındaysa öğrenci sınamalıdır.
         GNO < 1,80 ise daha önce almadığı veya W aldığı dersleri alamaz;
         1,80–1,99 arasında en fazla üç yeni ders alabilir. */
      probationGpa: 2.0,
      probationConsecutiveTerms: 2,
      probationNewCourseGpa: 1.8,

      graduationGpa: 2.0,   // Md. 31/1-b

      /* Md. 34/3 — MEZUNİYET derecesi, genel not ortalamasına göre */
      honors: [
        { id: 'highHonor', min: 3.5, max: 4.0 },   // Yüksek Şeref
        { id: 'honor', min: 3.0, max: 3.49 }       // Şeref
      ],

      /* Md. 28 — YARIYIL başarı durumu (transkriptte "DSD" olarak basılır).
         ODTÜ'yü diğerlerinden ayıran nokta: şeref derecesi yarıyıl ortalamasına göre
         her dönem yeniden belirlenir. Koşullar: GNO ≥ 2,00, YNO ≥ 2,00, o yarıyılda
         FF/FD/NA/U notu bulunmaması ve en az üç kredili ders alınmış olması. */
      termStanding: {
        requiresGpa: 2.0,
        requiresTermGpa: 2.0,
        failingGrades: ['FF', 'FD', 'NA', 'U'],
        minCreditCourses: 3,
        levels: [
          { id: 'highHonor', min: 3.5, max: 4.0 },   // Yüksek Şeref
          { id: 'honor', min: 3.0, max: 3.49 },      // Şeref
          { id: 'satisfactory', min: 2.0, max: 2.99 } // Başarılı
        ]
      }
    },

    /* Belge tespiti: YÖK e-Devlet not döküm belgesi, başlıkta üniversite adı.
       pdf.js metni harf öbeklerine bölebildiği için harfler arası boşluğa tolerans var. */
    detect: function (doc) {
      var text = doc.text || '';
      if (/O\s*R\s*T\s*A\s+D\s*O\s*Ğ\s*U\s+T\s*E\s*K\s*N\s*İ\s*K/i.test(text)) return 1;
      if (/MIDDLE\s+EAST\s+TECHNICAL\s+UNIVERSITY/i.test(text)) return 1;
      return 0;
    }
  };

  if (global.GPAUniversities) global.GPAUniversities.register(profile);
  global.GPAUniOdtu = profile;
})(typeof window !== 'undefined' ? window : globalThis);
