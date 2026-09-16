/*
 * Rehber dizini sözlüğü — makale başlıkları, kart özetleri, etiketler ve
 * rehber sayfalarının ortak metinleri (TR/EN). rehber.html, index.html ve
 * tüm rehber-*.html sayfalarında i18n.js'ten SONRA yüklenir.
 */
(function (global) {
  'use strict';
  var DICT = {
  "nav.guide": {
    "tr": "Rehber",
    "en": "Guide"
  },
  "footer.allGuides": {
    "tr": "Tüm rehber →",
    "en": "All guides →"
  },
  "guide.faqTitle": {
    "tr": "Sıkça sorulan sorular",
    "en": "Frequently asked questions"
  },
  "guide.sourcesTitle": {
    "tr": "Kaynaklar",
    "en": "Sources"
  },
  "guide.tocTitle": {
    "tr": "Bu makalede",
    "en": "In this article"
  },
  "guide.relatedTitle": {
    "tr": "İlgili rehberler",
    "en": "Related guides"
  },
  "guide.langNote": {
    "tr": "",
    "en": "This guide is a translation of the Turkish original, which follows the wording of the university's Turkish-language regulation. Where the two differ, the Turkish regulation text prevails."
  },
  "guide.meta.updated": {
    "tr": "<strong>Son güncelleme:</strong> 16 Eylül 2026",
    "en": "<strong>Last updated:</strong> 16 September 2026"
  },
  "guide.meta.basis": {
    "tr": "<strong>Dayanak:</strong> Boğaziçi Üniversitesi Lisans Eğitim ve Öğretim Yönetmeliği ve ilgili yönergeler",
    "en": "<strong>Basis:</strong> Boğaziçi University Undergraduate Education Regulation and related directives"
  },
  "guide.disclaimer": {
    "tr": "Bu rehber, yürürlükteki yönetmelik ve yönerge metinlerinden yararlanılarak bağımsız bir öğrenci tarafından hazırlanmıştır; resmî bir üniversite yayını değildir. Yönetmelikler değişebilir, bölümler ek koşul koyabilir. Kararınızı etkileyecek bir konuda son sözü Kayıt İşleri Şube Müdürlüğü ve akademik danışmanınız söyler.",
    "en": "This guide was prepared by an independent student from the regulation and directive texts in force; it is not an official university publication. Regulations change and departments may add conditions. On anything that affects a real decision, the Registrar's Office and your academic advisor have the final word."
  },
  "guide.index.title": {
    "tr": "Boğaziçi not sistemi rehberi",
    "en": "Boğaziçi grading system guide"
  },
  "guide.index.lead": {
    "tr": "Harf notlarından mezuniyet koşullarına, ders tekrarından çift anadala: Boğaziçi Üniversitesi lisans yönetmeliğinin ortalamanızı ilgilendiren her kuralı, madde numarasıyla ve hesaplı örneklerle. Aracın hesaplama motoru da bu kurallara göre yazıldı.",
    "en": "From letter grades to graduation requirements, from course repeats to double majors: every rule in Boğaziçi University's undergraduate regulation that touches your GPA, with article numbers and worked examples. The tool's calculation engine was written to these same rules."
  },
  "guide.index.eyebrow": {
    "tr": "Rehber",
    "en": "Guide"
  },
  "guide.index.crumb": {
    "tr": "Rehber",
    "en": "Guide"
  },
  "guide.index.note": {
    "tr": "<strong>Nasıl hazırlandı?</strong> Her makale, Boğaziçi Üniversitesi Lisans Eğitim ve Öğretim Yönetmeliği (Resmî Gazete 11.06.2016, sayı 29739), ÇAP / Yan Dal / Yaz Öğretimi yönergeleri ve Akademik Danışmanlık Ofisi'nin resmî SSS sayfası okunarak yazıldı. Madde numaraları metinde parantez içinde verilir; iki resmî kaynağın çeliştiği yerler açıkça belirtilir. Rehber bağımsız bir öğrenci çalışmasıdır, üniversitenin resmî yayını değildir.",
    "en": "<strong>How was it prepared?</strong> Each article was written from the Boğaziçi University Undergraduate Education Regulation (Official Gazette 11 June 2016, no. 29739), the Double Major / Minor / Summer School directives and the Academic Advising Office's official FAQ page. Article numbers are given in parentheses; where two official sources conflict, this is stated explicitly. The guide is an independent student project, not an official university publication."
  },
  "home.guide.eyebrow": {
    "tr": "Rehber",
    "en": "Guide"
  },
  "home.guide.title": {
    "tr": "Yönetmeliği okumadan kuralları öğrenin",
    "en": "Learn the rules without reading the regulation"
  },
  "home.guide.lead": {
    "tr": "Ortalamanızı belirleyen kurallar yönetmelikte dağınık duruyor. Rehber bölümünde her biri madde numarası ve hesaplı örnekle, sade Türkçeyle anlatılıyor.",
    "en": "The rules that decide your GPA are scattered across the regulation. The guide section explains each one in plain language, with article numbers and worked examples."
  },
  "home.guide.all": {
    "tr": "Tüm rehberi görün",
    "en": "See the full guide"
  },
  "guide.group.temel": {
    "tr": "Temel kavramlar",
    "en": "Fundamentals"
  },
  "guide.group.temel.desc": {
    "tr": "Harf notları, katsayılar ve ortalamanın nasıl hesaplandığı. Diğer her şey bu üç makaledeki kurallara dayanır.",
    "en": "Letter grades, coefficients and how the average is computed. Everything else builds on the rules in these articles."
  },
  "guide.group.kurallar": {
    "tr": "Yönetmelik kuralları",
    "en": "Regulation rules"
  },
  "guide.group.kurallar.desc": {
    "tr": "Ders tekrarı, dersten çekilme, ders yükü, sınamalı durum, onur listesi ve mezuniyet — yönetmelikte madde madde ne yazıyor.",
    "en": "Course repeats, withdrawals, course load, probation, honour lists and graduation — what the regulation says, article by article."
  },
  "guide.group.programlar": {
    "tr": "Programlar ve dönemler",
    "en": "Programmes and terms"
  },
  "guide.group.programlar.desc": {
    "tr": "Çift anadal, yan dal ve yaz öğretimi: başvuru eşikleri, devam koşulları ve ortalamaya etkileri.",
    "en": "Double major, minor and summer school: application thresholds, continuation conditions and their effect on the GPA."
  },
  "guide.group.strateji": {
    "tr": "Hesap ve strateji",
    "en": "Calculation and strategy"
  },
  "guide.group.strateji.desc": {
    "tr": "100'lük sisteme dönüşüm ve ortalamayı gerçekten hareket ettiren kararlar.",
    "en": "Conversion to the 100-point scale and the decisions that actually move your average."
  },
  "g.rehber-not-sistemi.title": {
    "tr": "Boğaziçi harf notu sistemi: katsayılar ve transkript işaretleri",
    "en": "The Boğaziçi letter grade system: coefficients and transcript marks"
  },
  "g.rehber-not-sistemi.short": {
    "tr": "Harf notu sistemi",
    "en": "Letter grade system"
  },
  "g.rehber-not-sistemi.card": {
    "tr": "AA'dan F'ye katsayılar, P/F dersleri ve transkriptteki W, R, NC, I, E, NP gibi işaretlerin ortalamaya etkisi.",
    "en": "Coefficients from AA to F, P/F courses, and how marks like W, R, NC, I, E and NP on the transcript affect the average."
  },
  "g.rehber-not-sistemi.tag": {
    "tr": "Temel kavramlar",
    "en": "Fundamentals"
  },
  "g.rehber-not-sistemi.read": {
    "tr": "5 dk okuma",
    "en": "5 min read"
  },
  "g.rehber-gno-hesaplama.title": {
    "tr": "GNO ve DNO nasıl hesaplanır? Formül, yuvarlama kuralı ve elle hesap örnekleri",
    "en": "How are the GPA and term GPA calculated? Formula, rounding rule and worked examples"
  },
  "g.rehber-gno-hesaplama.short": {
    "tr": "GNO nasıl hesaplanır",
    "en": "How the GPA is calculated"
  },
  "g.rehber-gno-hesaplama.card": {
    "tr": "Ağırlıklı ortalama formülü, yönetmelikteki yuvarlama kuralı, GNO'nun neden DNO'ların ortalaması olmadığı ve iki dönemlik tam bir hesap.",
    "en": "The weighted average formula, the rounding rule in the regulation, why the GPA is not the mean of term GPAs, and a full two-term calculation."
  },
  "g.rehber-gno-hesaplama.tag": {
    "tr": "Temel kavramlar",
    "en": "Fundamentals"
  },
  "g.rehber-gno-hesaplama.read": {
    "tr": "4 dk okuma",
    "en": "4 min read"
  },
  "g.rehber-ders-tekrari.title": {
    "tr": "Ders tekrarı: F, DD ve DC alınan dersler ortalamaya nasıl yansır?",
    "en": "Repeating courses: how F, DD and DC grades are reflected in the GPA"
  },
  "g.rehber-ders-tekrari.short": {
    "tr": "Ders tekrarı",
    "en": "Repeating courses"
  },
  "g.rehber-ders-tekrari.card": {
    "tr": "Hangi ders zorunlu tekrar edilir, DD/DC tekrarının sınırları (6 ders, dönemde 1), \"son not geçerli\" kuralı ve tekrarın GNO'ya etkisinin hesabı.",
    "en": "Which courses must be repeated, the limits on DD/DC repeats (6 courses, 1 per term), the \"last grade counts\" rule and how to calculate a repeat's effect on the GPA."
  },
  "g.rehber-ders-tekrari.tag": {
    "tr": "Yönetmelik kuralları",
    "en": "Regulation rules"
  },
  "g.rehber-ders-tekrari.read": {
    "tr": "4 dk okuma",
    "en": "4 min read"
  },
  "g.rehber-dersten-cekilme.title": {
    "tr": "Dersten çekilme (W): kaç hakkınız var, ne zaman kullanılır, ortalamaya etkisi ne?",
    "en": "Withdrawing from a course (W): how many you have, when to use them, and the effect on your GPA"
  },
  "g.rehber-dersten-cekilme.short": {
    "tr": "Dersten çekilme (W)",
    "en": "Withdrawing (W)"
  },
  "g.rehber-dersten-cekilme.card": {
    "tr": "Güz/baharda 3, yazda 2, lisans boyunca toplam 5 çekilme hakkı; çekilme haftası; birinci sınıf istisnası ve W'nin ortalamaya sıfır etkisi.",
    "en": "3 withdrawals in autumn/spring, 2 in summer, 5 in total over the degree; the withdrawal week; the first-year exception and W's zero effect on the average."
  },
  "g.rehber-dersten-cekilme.tag": {
    "tr": "Yönetmelik kuralları",
    "en": "Regulation rules"
  },
  "g.rehber-dersten-cekilme.read": {
    "tr": "4 dk okuma",
    "en": "4 min read"
  },
  "g.rehber-ders-yuku.title": {
    "tr": "Ders yükü: bir dönemde en az ve en fazla kaç kredi alınabilir?",
    "en": "Course load: the minimum and maximum credits you can take in a term"
  },
  "g.rehber-ders-yuku.short": {
    "tr": "Ders yükü sınırları",
    "en": "Course load limits"
  },
  "g.rehber-ders-yuku.card": {
    "tr": "Asgari 15 kredi (danışmanla 13, yönetim kuruluyla 9), \"ortalama yarıyıl kredisi\" nasıl bulunur, fazla ders hakkı ve sınamalı öğrencilere uygulanan tavan.",
    "en": "The 15-credit minimum (13 with the advisor, 9 with the board), how the \"average semester credit\" is found, the overload allowance and the cap applied to students on probation."
  },
  "g.rehber-ders-yuku.tag": {
    "tr": "Yönetmelik kuralları",
    "en": "Regulation rules"
  },
  "g.rehber-ders-yuku.read": {
    "tr": "3 dk okuma",
    "en": "3 min read"
  },
  "g.rehber-sinamali-basarisiz.title": {
    "tr": "Sınamalı ve başarısız durum: 2.00 eşiği, kısıtlamalar ve çıkış yolu",
    "en": "Probation and failing status: the 2.00 threshold, restrictions and the way out"
  },
  "g.rehber-sinamali-basarisiz.short": {
    "tr": "Sınamalı durum",
    "en": "Probation"
  },
  "g.rehber-sinamali-basarisiz.card": {
    "tr": "GNO 2.00'nin altına düşünce ne olur, \"başarısız\" durumu nasıl oluşur, hangi kısıtlar uygulanır ve 2.00'ye dönmek için gereken dönem ortalaması nasıl hesaplanır.",
    "en": "What happens when the GPA drops below 2.00, how \"failing\" status arises, which restrictions apply, and how to calculate the term GPA needed to get back to 2.00."
  },
  "g.rehber-sinamali-basarisiz.tag": {
    "tr": "Yönetmelik kuralları",
    "en": "Regulation rules"
  },
  "g.rehber-sinamali-basarisiz.read": {
    "tr": "4 dk okuma",
    "en": "4 min read"
  },
  "g.rehber-onur-listesi.title": {
    "tr": "Onur ve yüksek onur öğrencisi: 3.00 ve 3.50 eşikleri, süre koşulu ve bölüm dereceleri",
    "en": "Honour and high honour: the 3.00 and 3.50 thresholds, the duration condition and department rankings"
  },
  "g.rehber-onur-listesi.short": {
    "tr": "Onur listesi",
    "en": "Honour lists"
  },
  "g.rehber-onur-listesi.card": {
    "tr": "Yönetmelik onur derecesini mezuniyette, GNO ile ve normal sürede bitirme koşuluyla tanımlar. Eşikler, istisnalar ve eşiğe ulaşmak için gereken not hesabı.",
    "en": "The regulation defines honours at graduation, by GPA, with a normal-duration condition. Thresholds, exceptions, and how to calculate the grades needed to reach them."
  },
  "g.rehber-onur-listesi.tag": {
    "tr": "Yönetmelik kuralları",
    "en": "Regulation rules"
  },
  "g.rehber-onur-listesi.read": {
    "tr": "3 dk okuma",
    "en": "3 min read"
  },
  "g.rehber-mezuniyet-kosullari.title": {
    "tr": "Mezuniyet koşulları: 2.00 GNO, geçilmiş dersler, kredi kuralı ve azami süre",
    "en": "Graduation requirements: 2.00 GPA, passed courses, the credit rule and the maximum duration"
  },
  "g.rehber-mezuniyet-kosullari.short": {
    "tr": "Mezuniyet koşulları",
    "en": "Graduation requirements"
  },
  "g.rehber-mezuniyet-kosullari.card": {
    "tr": "Dört mezuniyet koşulu, tek F için tanınan DD hakkı, GNO 2.00'nin altında kalanlara tekrar olanağı, 14 yarıyıllık azami süre ve ön lisans diploması.",
    "en": "The four graduation conditions, the DD allowance for a single F, the repeat option for those below 2.00, the 14-semester maximum and the associate degree."
  },
  "g.rehber-mezuniyet-kosullari.tag": {
    "tr": "Yönetmelik kuralları",
    "en": "Regulation rules"
  },
  "g.rehber-mezuniyet-kosullari.read": {
    "tr": "3 dk okuma",
    "en": "3 min read"
  },
  "g.rehber-cift-anadal.title": {
    "tr": "Çift anadal (ÇAP): 3.20 başvuru eşiği, 3.00 devam koşulu ve 10 yarıyıl sınırı",
    "en": "Double major: the 3.20 application threshold, the 3.00 continuation condition and the 10-semester limit"
  },
  "g.rehber-cift-anadal.short": {
    "tr": "Çift anadal",
    "en": "Double major"
  },
  "g.rehber-cift-anadal.card": {
    "tr": "Ne zaman başvurulur, hangi GNO gerekir, ÇAP ortalaması nasıl hesaplanır, programdan ne zaman çıkarılırsınız ve ÇAP diplomasında onur derecesi.",
    "en": "When to apply, which GPA is required, how the double-major GPA is calculated, when you are removed from the programme, and honours on the double-major diploma."
  },
  "g.rehber-cift-anadal.tag": {
    "tr": "Programlar",
    "en": "Programmes"
  },
  "g.rehber-cift-anadal.read": {
    "tr": "3 dk okuma",
    "en": "3 min read"
  },
  "g.rehber-yan-dal.title": {
    "tr": "Yan dal: 2.75 eşiği, 15–21 kredilik program ve sertifika koşulları",
    "en": "Minor: the 2.75 threshold, the 15–21 credit programme and certificate conditions"
  },
  "g.rehber-yan-dal.short": {
    "tr": "Yan dal",
    "en": "Minor"
  },
  "g.rehber-yan-dal.card": {
    "tr": "Başvuru zamanı (3.–6. yarıyıl), 2.75 GNO koşulu, tek seferlik 2.50 toleransı, 9 yarıyıl sınırı ve yan dal sertifikasının ne olup ne olmadığı.",
    "en": "Application timing (semesters 3–6), the 2.75 GPA condition, the one-time 2.50 tolerance, the 9-semester limit, and what the minor certificate is and is not."
  },
  "g.rehber-yan-dal.tag": {
    "tr": "Programlar",
    "en": "Programmes"
  },
  "g.rehber-yan-dal.read": {
    "tr": "3 dk okuma",
    "en": "3 min read"
  },
  "g.rehber-yaz-okulu.title": {
    "tr": "Yaz öğretimi: 7 hafta, 10 kredi / 3 ders sınırı ve yaz notlarının ortalamaya etkisi",
    "en": "Summer school: 7 weeks, the 10-credit / 3-course limit and how summer grades affect the GPA"
  },
  "g.rehber-yaz-okulu.short": {
    "tr": "Yaz okulu",
    "en": "Summer school"
  },
  "g.rehber-yaz-okulu.card": {
    "tr": "Yaz dersleri GNO'ya girer ama yaz DNO'su sınamalı denetiminde sayılmaz; kredi sınırı, çekilme takvimi, başarısız öğrenci kuralları ve 2025 yönerge değişikliği.",
    "en": "Summer courses enter the GPA but the summer term GPA is ignored in the probation check; the credit limit, withdrawal calendar, rules for failing students and the 2025 directive change."
  },
  "g.rehber-yaz-okulu.tag": {
    "tr": "Programlar",
    "en": "Programmes"
  },
  "g.rehber-yaz-okulu.read": {
    "tr": "3 dk okuma",
    "en": "3 min read"
  },
  "g.rehber-100luk-donusum.title": {
    "tr": "4'lük ortalamayı 100'lük sisteme çevirmek: YÖK dönüşüm tablosu ve kullanım yerleri",
    "en": "Converting a 4-point GPA to the 100-point scale: the YÖK conversion table and where it is used"
  },
  "g.rehber-100luk-donusum.short": {
    "tr": "4'lükten 100'lüğe",
    "en": "4-point to 100-point"
  },
  "g.rehber-100luk-donusum.card": {
    "tr": "YÖK tablosuna göre 3.50 = 88.33, 3.00 = 76.66, 2.00 = 53.33. Tablonun mantığı, kurumdan kuruma farklar ve hangi tablonun ne zaman geçerli olduğu.",
    "en": "On the YÖK table, 3.50 = 88.33, 3.00 = 76.66, 2.00 = 53.33. The logic of the table, differences between institutions, and which table applies when."
  },
  "g.rehber-100luk-donusum.tag": {
    "tr": "Hesap ve strateji",
    "en": "Calculation and strategy"
  },
  "g.rehber-100luk-donusum.read": {
    "tr": "3 dk okuma",
    "en": "3 min read"
  },
  "g.rehber-ortalama-yukseltme.title": {
    "tr": "Ortalamayı yükseltmenin matematiği: hangi ders, hangi tekrar, ne kadar etki?",
    "en": "The arithmetic of raising your GPA: which course, which repeat, how much effect?"
  },
  "g.rehber-ortalama-yukseltme.short": {
    "tr": "Ortalama yükseltme",
    "en": "Raising your GPA"
  },
  "g.rehber-ortalama-yukseltme.card": {
    "tr": "Kredi biriktikçe azalan etki, tekrarın yeni derse üstünlüğü, altı DD/DC tekrar hakkını sıralama yöntemi ve hedef ortalama için gereken notun formülü.",
    "en": "Diminishing effect as credits accumulate, why a repeat beats a new course, how to rank your six DD/DC repeat rights, and the formula for the grade needed to hit a target."
  },
  "g.rehber-ortalama-yukseltme.tag": {
    "tr": "Hesap ve strateji",
    "en": "Calculation and strategy"
  },
  "g.rehber-ortalama-yukseltme.read": {
    "tr": "4 dk okuma",
    "en": "4 min read"
  }
};
  if (global.GPAI18N) global.GPAI18N.extend(DICT);
})(window);
