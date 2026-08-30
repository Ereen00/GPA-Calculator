/*
 * Marmara Üniversitesi not döküm belgesi ayrıştırıcısı
 * (uni-marmara.js profiline bağlanır; biçim notları docs/marmara-notlandirma.md §6)
 *
 * Belge, YÖK e-Devlet not döküm belgesi şablonudur; okuma işini yok-transkript.js yapar.
 * Burada yalnız Marmara'ya özgü olanlar tanımlanır.
 */
(function (global) {
  'use strict';

  var parse = global.GPAYokTranskript.createParser({
    id: 'marmara',

    // ATA121, WI1005, BCHH1009, MATH1048, SWP4011 …
    codePattern: '[A-ZÇĞİÖŞÜ]{2,5}\\d{3,4}',

    // Marmara ortalamayı AKTS üzerinden hesaplar (belge "Kredi Türü : AKTS" yazar)
    defaultCredit: 'akts',

    // Ne ortalamaya ne de tamamlanan krediye giren notlar/işaretler (Md. 23/8, Md. 24)
    nonCredit: ['U', 'NC', 'M', 'TI', 'TY', 'TD', 'TS', 'T', 'DP', 'CY', 'BH', 'FR', 'AND', 'OKD', 'G'],

    // S: ortalamaya girmez ama krediyi kazandırır (Md. 23/8-f).
    // MK (kredili dersten muaf) belgede S notuyla gösterilir (Md. 24/ğ).
    creditOnly: ['S', 'MK'],

    // Henüz sonuçlanmamış notlar (Md. 23/8-c, -e, -i)
    pending: ['MZ', 'E', 'DE', 'YH', 'TZ'],

    withdrawn: ['W']
  });

  var profile = global.GPAUniversities && global.GPAUniversities.get('marmara');
  if (profile) profile.parse = parse;

  global.GPAMarmaraParser = { parse: parse };
})(typeof window !== 'undefined' ? window : globalThis);
