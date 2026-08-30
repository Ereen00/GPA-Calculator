/*
 * Boğaziçi Üniversitesi profili — not tablosu, kurallar ve belge tespiti.
 * Ayrıştırıcı ayrı dosyada: parser-bogazici.js (yalnız transkript yükleme sayfasında yüklenir).
 *
 * Kaynak: Boğaziçi Üniversitesi not döküm belgesi (YÖK e-Devlet çıktısı) ve
 * Lisans Eğitim-Öğretim Yönetmeliği.
 */
(function (global) {
  'use strict';

  var profile = {
    id: 'bogazici',
    name: { tr: 'Boğaziçi Üniversitesi', en: 'Boğaziçi University' },
    short: { tr: 'Boğaziçi', en: 'Boğaziçi' },

    // Ortalamaya giren harf notları ve katsayıları
    grades: { AA: 4.0, BA: 3.5, BB: 3.0, CB: 2.5, CC: 2.0, DC: 1.5, DD: 1.0, FF: 0.0 },
    gradeOrder: ['AA', 'BA', 'BB', 'CB', 'CC', 'DC', 'DD', 'FF'],

    // Editördeki not açılır listesi: ortalamaya girmeyen W ve "not girilmemiş" ('') dahil
    gradeOptions: ['AA', 'BA', 'BB', 'CB', 'CC', 'DC', 'DD', 'FF', 'W', ''],

    // Bu notları alan dersler için editörde "tekrar edildi" hedefi önerilir
    repeatCandidateGrades: ['DC', 'DD', 'FF'],

    passingGrade: 2.0,
    conditionalGrades: [],   // Boğaziçi'de koşullu geçme yok

    rules: {
      excludeFromCumulative: [],   // kümülatif ortalamadan tamamen dışlanan not yok
      // Tamamlanmış sayılan en düşük not: DD (1.00). Boğaziçi'de D geçer nottur,
      // dersin tekrar alınması gerekmez.
      completedMinGrade: 1.0,
      maxCreditsPerTerm: null,
      graduationGpa: null,
      honors: []
    },

    /* Belge tespiti. Not döküm belgesinin başlığı hem Türkçe hem İngilizce basılır;
       pdf.js metni harf öbeklerine bölebildiği için harfler arası boşluğa toleranslı bakılır. */
    detect: function (doc) {
      var text = doc.text || '';
      if (/BO\s*Ğ\s*A\s*Z\s*İ\s*Ç\s*İ/i.test(text)) return 1;
      if (/BOGAZICI\s+UNIVERSITY/i.test(text)) return 1;
      // Başlık okunamadıysa belgenin kendine özgü bölüm adlarına bak
      if (/NOT\s+DÖKÜM\s+BELGESİ/i.test(text) || /Öğrenci\s+Durum\s+Belgesi/i.test(text)) return 0.5;
      return 0;
    }
  };

  if (global.GPAUniversities) global.GPAUniversities.register(profile);
  global.GPAUniBogazici = profile;
})(typeof window !== 'undefined' ? window : globalThis);
