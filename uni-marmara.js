/*
 * Marmara Üniversitesi profili — not tablosu, kurallar ve belge tespiti.
 * Ayrıştırıcı ayrı dosyada: parser-marmara.js
 *
 * Kaynaklar ve doğrulama: docs/marmara-notlandirma.md
 *  - Marmara Üniversitesi Ön Lisans ve Lisans Eğitim-Öğretim ve Sınav Yönetmeliği,
 *    Md. 23 (başarı notu ve katsayılar), Md. 24 (işaretler), Md. 25 (YANO/GANO),
 *    Md. 26 (ders tekrarı), Md. 18 (ders yükü, sınamalı öğrenci), Md. 28 (mezuniyet)
 *  - Gerçek bir Marmara not döküm belgesinin basılı DNO değerleri
 */
(function (global) {
  'use strict';

  var profile = {
    id: 'marmara',
    name: { tr: 'Marmara Üniversitesi', en: 'Marmara University' },
    short: { tr: 'Marmara', en: 'Marmara' },

    /* Yönetmelik Md. 23/7. FG (sınava girmedi) ve DZ (devamsız), Md. 23/8-ç ve -d
       uyarınca "FF gibi işleme alınır": katsayı 0,00 ve dersin kredisi ortalamanın
       paydasına KATILIR. Bu yüzden ikisi de tabloda 0.00 olarak yer alır ve
       rules.excludeFromCumulative boştur. */
    grades: {
      AA: 4.0, BA: 3.5, BB: 3.0, CB: 2.5, CC: 2.0, DC: 1.5, DD: 1.0,
      FD: 0.5, FF: 0.0, FG: 0.0, DZ: 0.0
    },
    gradeOrder: ['AA', 'BA', 'BB', 'CB', 'CC', 'DC', 'DD', 'FD', 'FF', 'FG', 'DZ'],

    /* S (yeterli), U (yetersiz), MZ (mazeretli), E (eksik), W (çekildi), DE (devam ediyor)
       ve NC / M / MK / transfer işaretleri GANO hesabına katılmaz; ayrıştırıcı bu
       dersleri 'non credit' ya da 'not taken' olarak işaretler, not olarak sunulmaz. */
    gradeOptions: ['AA', 'BA', 'BB', 'CB', 'CC', 'DC', 'DD', 'FD', 'FF', 'FG', 'DZ', ''],

    repeatCandidateGrades: ['DD', 'DC', 'FD', 'FF', 'FG', 'DZ'],

    /* Md. 23/8-a: AA, BA, BB, CB, CC, DC, DD ve S başarılı harf notlarıdır.
       DD "Geçer"dir — Marmara'da koşullu geçme yoktur. */
    passingGrade: 1.0,
    conditionalGrades: [],

    rules: {
      excludeFromCumulative: [],   // FG ve DZ dahil her not paydaya girer
      completedMinGrade: 1.0,      // DD ve üstü başarılı sayılır

      /* Md. 23/8-f ve Md. 24/ğ: S (yeterli) notlu transfer/muafiyet dersleri
         GANO'ya katılmaz ama tamamlanan krediye sayılır. */
      creditOnlyGrades: ['S'],

      /* Md. 18/1: kredi değil DERS SAYISI sınırı — yarıyıl başına ortalama ders
         sayısının üç fazlasını aşamaz (mezuniyet aşamasındakilere üç ders daha). */
      maxCreditsPerTerm: null,
      maxExtraCoursesPerTerm: 3,

      /* Md. 18/5-a: üçüncü yarıyıldan itibaren GANO < 1,80 VE son iki yarıyılın
         her ikisinde de YANO < 2,00 olan öğrenci sınamalı sayılır. */
      probationGpa: 1.8,
      probationTermGpa: 2.0,
      probationFromTerm: 3,

      /* Md. 18/9: GANO ≥ 3,00 olan öğrenci üst yarıyıllardan ders alabilir. */
      upperTermGpa: 3.0,

      graduationGpa: 2.0,   // Md. 28/1
      honors: [
        { id: 'highHonor', min: 3.5, max: 4.0 },   // yüksek onur (Md. 25/4, Md. 28/2)
        { id: 'honor', min: 3.0, max: 3.49 }       // onur
      ]
    },

    /* Belge tespiti: YÖK e-Devlet "not döküm belgesi" şablonu, başlıkta üniversite adı.
       pdf.js metni harf öbeklerine bölebildiği için harfler arası boşluğa tolerans var. */
    detect: function (doc) {
      var text = doc.text || '';
      if (/M\s*A\s*R\s*M\s*A\s*R\s*A\s+Ü\s*N\s*İ\s*V\s*E\s*R\s*S\s*İ\s*T\s*E\s*S\s*İ/i.test(text)) return 1;
      if (/MARMARA\s+UNIVERSITY/i.test(text)) return 1;
      return 0;
    }
  };

  if (global.GPAUniversities) global.GPAUniversities.register(profile);
  global.GPAUniMarmara = profile;
})(typeof window !== 'undefined' ? window : globalThis);
