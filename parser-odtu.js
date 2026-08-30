/*
 * ODTÜ not döküm belgesi ayrıştırıcısı
 * (uni-odtu.js profiline bağlanır; biçim notları docs/odtu-notlandirma.md §6)
 *
 * Belge, YÖK e-Devlet not döküm belgesi şablonudur; okuma işini yok-transkript.js yapar.
 * ODTÜ'yü ayıran iki biçim özelliği:
 *   1. Ders kodları TAMAMEN RAKAMDIR (6390101, 2331012) — harf içermez.
 *   2. T, U ve Puan sütunları "-" olabilir (ör. muafiyetle alınan kredisiz ders).
 * İkisi de ortak okuyucuda karşılanıyor; burada yalnız ODTÜ'ye özgü olanlar tanımlı.
 */
(function (global) {
  'use strict';

  var parse = global.GPAYokTranskript.createParser({
    id: 'odtu',

    /* 7 haneli sayısal ders kodu: 6390101, 2380106, 2331012 …
       Belgedeki öğrenci numarası da 7 hane olabildiği için bu desen tek başına
       yeterli değil; ortak okuyucu her adayı tam satır deseniyle doğruluyor. */
    codePattern: '\\d{7}',

    // ODTÜ ortalamayı ulusal kredi üzerinden hesaplar (belge "Kredi Türü : Ulusal" yazar)
    defaultCredit: 'uk',

    /* Md. 24/5-c: ortalamalara katılmayan notlar. S ve U yalnız KREDİSİZ derslerde
       kullanıldığı için krediye de sayılmaz; bu yüzden creditOnly listesi boştur.
       PASS / FAIL / P (gelişmekte) belgenin not bareminde yer alır. */
    nonCredit: ['S', 'U', 'EX', 'P', 'PASS', 'FAIL', 'T'],

    // Md. 24/5-c-4: I (eksik) süresi içinde harf notuna çevrilmezse FF/U'ya döner
    pending: ['I'],

    withdrawn: ['W']
  });

  var profile = global.GPAUniversities && global.GPAUniversities.get('odtu');
  if (profile) profile.parse = parse;

  global.GPAOdtuParser = { parse: parse };
})(typeof window !== 'undefined' ? window : globalThis);
