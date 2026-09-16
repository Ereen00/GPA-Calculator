/*
 * İçerik sözlüğü — rehber bölümleri, SSS, araç sayfası girişleri ve
 * kurumsal sayfalar (gizlilik, kullanım koşulları, hakkında).
 *
 * i18n.js'ten SONRA yüklenmelidir; sözlüğü GPAI18N.extend() ile genişletir.
 * Uzun metinler tek anahtarda HTML olarak tutulur; ilgili öğede
 * data-i18n ile birlikte data-i18n-html özniteliği bulunmalıdır.
 */
(function (global) {
  'use strict';

  var CONTACT = "yunuscr31526301@gmail.com";
  var REPO = "https://github.com/Ereen00/GPA-Calculator";

  var CONTENT = {

    /* ================= Gezinme / footer ================= */
    'nav.about': { tr: "Hakkında & İletişim", en: "About & Contact" },
    'nav.privacy': { tr: "Gizlilik Politikası", en: "Privacy Policy" },
    'nav.terms': { tr: "Kullanım Koşulları", en: "Terms of Use" },
    'footer.tools': { tr: "Araçlar", en: "Tools" },
    'footer.site': { tr: "Site", en: "Site" },

    /* ================= Ana sayfa: not sistemi rehberi ================= */
    'guide.eyebrow': { tr: "Rehber", en: "Guide" },
    'guide.title': {
      tr: "Harf notundan ortalamaya: sistem nasıl işliyor?",
      en: "From letter grade to GPA: how the system works"
    },
    'guide.lead': {
      tr: "Ortalamanızı bu araca hesaplatmadan önce, hesabın arkasındaki kuralları bilmek işinize yarar. Aşağıda Boğaziçi Üniversitesi'nin harf notu katsayıları, ağırlıklı ortalama formülü ve tekrar edilen derslerin ortalamaya nasıl yansıdığı anlatılıyor.",
      en: "Before letting this tool do the math, it helps to know the rules behind it. Below you will find Boğaziçi University's letter-grade coefficients, the weighted average formula, and how repeated courses affect your average."
    },
    'guide.p1': {
      tr: "<p>Boğaziçi Üniversitesi'nde her ders, dönem sonunda bir harf notuyla sonuçlanır. Bu harfin kendi başına sayısal bir değeri yoktur; ortalamaya girerken önce bir <strong>katsayıya</strong> çevrilir. Ortalamanız da aldığınız harf notlarının basit aritmetik ortalaması değildir — her dersin <strong>kredisi</strong> o dersin ortalamadaki ağırlığını belirler. Bu yüzden 3 kredilik bir dersten aldığınız AA ile 1 kredilik bir dersten aldığınız AA ortalamanızı aynı ölçüde etkilemez.</p>",
      en: "<p>At Boğaziçi University every course ends the term with a letter grade. That letter has no numeric value on its own; it is first converted into a <strong>coefficient</strong> before it enters your average. And your average is not the plain arithmetic mean of your letter grades — each course's <strong>credit</strong> determines how much weight it carries. That is why an AA in a 3-credit course does not move your average as much as an AA in a 1-credit course.</p>"
    },
    'guide.table.caption': {
      tr: "Bu araç hesaplamalarını yukarıdaki katsayı tablosuna göre yapar. Bağlayıcı olan, üniversitenin yürürlükteki lisans eğitim-öğretim yönetmeliğidir.",
      en: "This tool bases its calculations on the coefficient table above. The university's current undergraduate education regulation is the binding source."
    },
    'guide.table.grade': { tr: "Harf notu", en: "Letter grade" },
    'guide.table.coef': { tr: "Katsayı", en: "Coefficient" },
    'guide.table.meaning': { tr: "Anlamı", en: "Meaning" },
    'guide.grade.aa': { tr: "En yüksek başarı derecesi", en: "Highest level of achievement" },
    'guide.grade.ba': { tr: "Başarılı", en: "Successful" },
    'guide.grade.bb': { tr: "Başarılı", en: "Successful" },
    'guide.grade.cb': { tr: "Orta düzeyde başarı", en: "Moderate achievement" },
    'guide.grade.cc': { tr: "Orta düzeyde başarı", en: "Moderate achievement" },
    'guide.grade.dc': { tr: "Geçer, ancak ortalamayı aşağı çeker", en: "Passing, but pulls the average down" },
    'guide.grade.dd': { tr: "Ortalamaya giren en düşük geçer not", en: "Lowest passing grade counted in the average" },
    'guide.grade.ff': { tr: "Başarısız; ders tekrar alınır", en: "Failing; the course must be repeated" },
    'guide.grade.w': { tr: "Dersten çekilme — ortalamaya girmez, transkriptte görünür", en: "Withdrawal — excluded from the average, still shown on the transcript" },

    'guide.h.formula': { tr: "Ağırlıklı ortalama nasıl hesaplanır?", en: "How is the weighted average calculated?" },
    'guide.formula': {
      tr: "<p>Hesap iki adımdan oluşur. Önce her ders için <strong>kredi × katsayı</strong> çarpımı bulunur; buna o dersin ağırlıklı puanı denir. Sonra tüm ağırlıklı puanlar toplanır ve <strong>toplam krediye</strong> bölünür. Sonuç, iki ondalık basamağa yuvarlanan ortalamanızdır.</p><p>Somut bir örnek: 3 kredilik bir dersten BA (3.50), 4 kredilik bir dersten CC (2.00) ve 3 kredilik bir dersten AA (4.00) aldığınızı varsayalım. Ağırlıklı puanlar sırasıyla 10.50 — 8.00 — 12.00 olur; toplamı 30.50'dir. Toplam krediniz 10 olduğuna göre ortalamanız 30.50 ÷ 10 = <strong>3.05</strong> çıkar. Dikkat edin: üç dersin harf notlarının düz ortalaması 3.17 olurdu. Aradaki fark, en düşük notu en yüksek kredili dersten almanızdan kaynaklanıyor.</p>",
      en: "<p>The calculation has two steps. First, each course's <strong>credit × coefficient</strong> product is found; this is the course's weighted score. Then all weighted scores are summed and divided by the <strong>total credits</strong>. The result, rounded to two decimals, is your average.</p><p>A concrete example: suppose you earn BA (3.50) in a 3-credit course, CC (2.00) in a 4-credit course and AA (4.00) in a 3-credit course. The weighted scores are 10.50, 8.00 and 12.00, summing to 30.50. With 10 total credits, your average is 30.50 ÷ 10 = <strong>3.05</strong>. Note that the plain mean of the three letter grades would have been 3.17. The gap comes from earning your lowest grade in your highest-credit course.</p>"
    },
    'guide.callout.credit': {
      tr: "<p><strong>Kredisiz dersler ortalamaya girmez.</strong> Transkriptinizde kredisi 0 olarak görünen dersler (bazı seminer, laboratuvar ve zorunlu hazırlık dersleri) ortalama hesabına dahil edilmez; araç bunları listede gösterir ama ağırlıklandırmaz. Aynı şekilde <strong>W</strong> (çekilme) notu alınan dersler de ortalamaya girmez.</p>",
      en: "<p><strong>Zero-credit courses do not count toward the average.</strong> Courses listed with 0 credits on your transcript (certain seminars, labs and mandatory preparatory courses) are excluded from the calculation; the tool lists them but assigns no weight. Likewise, courses graded <strong>W</strong> (withdrawal) are left out of the average.</p>"
    },
    'guide.h.repeat': { tr: "Tekrar edilen dersler ne oluyor?", en: "What happens with repeated courses?" },
    'guide.repeat': {
      tr: "<p>Bir dersi tekrar aldığınızda, kümülatif ortalamanızda o dersin yalnızca <strong>son geçerli notu</strong> sayılır ve kredisi tek bir kez hesaba katılır. Eski not transkriptte kalmaya devam eder ama genel ortalamayı artık etkilemez. Bu, ortalamasını yükseltmeye çalışan öğrenciler için en çok karıştırılan noktalardan biridir: FF aldığınız 3 kredilik bir dersi tekrar edip BB alırsanız, toplam krediniz 3 artmaz — yalnızca o dersin ortalamaya katkısı 0.00'dan 3.00'a yükselir.</p><p>Araç bu kuralı otomatik uygular. Transkriptinizde bir dersin yerine sayılan başka bir ders varsa (ders kodu değişmiş olsa bile) zinciri kökene kadar izler ve krediyi mükerrer saymaz. Dönem not ortalamanız ise değişmez: her dönem, o dönemde aldığınız notlarla hesaplanmaya devam eder.</p>",
      en: "<p>When you repeat a course, only its <strong>most recent valid grade</strong> counts toward your cumulative average, and its credit is counted once. The old grade stays on your transcript but no longer affects the overall average. This is one of the most misunderstood points for students trying to raise their GPA: if you repeat a 3-credit course you failed with FF and earn BB, your total credits do not go up by 3 — only that course's contribution rises from 0.00 to 3.00.</p><p>The tool applies this rule automatically. If another course substitutes for an earlier one on your transcript (even under a different course code), it follows the chain back to the original and never double-counts the credit. Your term average is unaffected: each term is still calculated from the grades earned in that term.</p>"
    },

    /* ================= Ana sayfa: GPA / SPA ================= */
    'concept.eyebrow': { tr: "İki Farklı Ortalama", en: "Two Different Averages" },
    'concept.title': { tr: "GPA ile SPA arasındaki fark ne?", en: "What is the difference between GPA and SPA?" },
    'concept.lead': {
      tr: "Transkriptinizde iki ayrı ortalama basılıdır ve ikisi farklı sorulara cevap verir. Hangisinin nerede kullanıldığını bilmek, hedef koyarken işinizi kolaylaştırır.",
      en: "Your transcript prints two separate averages, and they answer different questions. Knowing which one is used where makes goal-setting much easier."
    },
    'concept.spa.tag': { tr: "Dönemlik", en: "Per term" },
    'concept.spa.title': { tr: "SPA — Dönem Not Ortalaması", en: "SPA — Semester Point Average" },
    'concept.spa.body': {
      tr: "<p>Tek bir dönemde aldığınız derslerin ağırlıklı ortalamasıdır; transkriptte <strong>DNO</strong> olarak da geçer. Yalnızca o döneme ait dersleri ve kredileri kapsar, önceki dönemlerden etkilenmez.</p><p>Dönem içindeki performansınızın ölçüsüdür: sınamalı ve başarısız durum belirlemesi (art arda iki dönem 2.00 altı) ve bazı burs değerlendirmeleri bu sayıya bakar. Kötü geçen tek bir dönem SPA'nızı sert biçimde düşürür, ama genel ortalamanıza etkisi kredi payı kadardır.</p>",
      en: "<p>The weighted average of the courses you took in a single term. It covers only that term's courses and credits and is unaffected by previous terms.</p><p>It measures your performance within the term: the probation and failing-status check (two consecutive terms below 2.00) and some scholarship reviews look at this number. One bad term drops your SPA sharply, but affects your overall average only in proportion to its credits.</p>"
    },
    'concept.gpa.tag': { tr: "Kümülatif", en: "Cumulative" },
    'concept.gpa.title': { tr: "GPA — Genel Not Ortalaması", en: "GPA — Grade Point Average" },
    'concept.gpa.body': {
      tr: "<p>Öğrenciliğiniz boyunca aldığınız <strong>tüm</strong> derslerin kümülatif ağırlıklı ortalamasıdır; transkriptte <strong>GNO</strong> olarak geçer. Tekrar edilen derslerde yalnızca son not sayılır.</p><p>Kurumların baktığı sayı büyük ölçüde budur: mezuniyet koşulu (en az 2.00), onur ve yüksek onur dereceleri (3.00 / 3.50), çift anadal ve yan dal başvuruları, Erasmus ve değişim programı sıralamaları, lisansüstü başvuruları ve birçok staj başvurusu GPA üzerinden değerlendirilir. Kredi biriktikçe hareket ettirmesi zorlaşır — ilk yıllardaki notların ağırlığı bu yüzden hissedilir.</p>",
      en: "<p>The cumulative weighted average of <strong>all</strong> courses you have taken. For repeated courses, only the latest grade counts.</p><p>This is largely the number institutions look at: the graduation requirement (at least 2.00), honour and high-honour distinctions (3.00 / 3.50), double-major and minor applications, Erasmus and exchange rankings, graduate applications and many internship applications are assessed on GPA. It becomes harder to move as credits accumulate — which is why early-year grades carry noticeable weight.</p>"
    },

    /* ================= Ana sayfa: nasıl çalışır ================= */
    'steps.eyebrow': { tr: "Nasıl Çalışır", en: "How It Works" },
    'steps.title': { tr: "Üç adımda transkriptinizden analize", en: "From transcript to analysis in three steps" },
    'steps.lead': {
      tr: "Hesap makinesine tek tek not girmek zorunda değilsiniz. Resmî belgenizi bırakmanız yeterli; geri kalanı araç hallediyor.",
      en: "You do not have to type grades into a calculator one by one. Just drop in your official document; the tool handles the rest."
    },
    'steps.s1.title': { tr: "Transkriptinizi bırakın", en: "Drop in your transcript" },
    'steps.s1.desc': {
      tr: "PDF belgenizi yükleme alanına sürükleyin. Dosya tarayıcınızda açılır, metni çıkarılır ve dersler, krediler, harf notları ve dönemler otomatik tanınır. Dosya hiçbir sunucuya gönderilmez.",
      en: "Drag your PDF into the upload area. The file opens in your browser, its text is extracted, and courses, credits, letter grades and terms are recognised automatically. The file is never sent to a server."
    },
    'steps.s2.title': { tr: "Planlayıcıda düzenleyin", en: "Adjust in the planner" },
    'steps.s2.desc': {
      tr: "Aktarılan dersleri dönem dönem görün, eksik olanı ekleyin, gelecek dönem için hedef not girin. Her değişiklikte ortalamanız anında yeniden hesaplanır ve tarayıcınıza otomatik kaydedilir.",
      en: "See the imported courses term by term, add anything missing, and enter target grades for an upcoming term. Your average is recalculated instantly on every change and saved to your browser automatically."
    },
    'steps.s3.title': { tr: "Analitikte yorumlayın", en: "Interpret in analytics" },
    'steps.s3.desc': {
      tr: "Dönemlik trendinizi, not dağılımınızı, kredi birikiminizi ve mezuniyet ortalaması simülasyonunu grafiklerle görün. Hangi dönemin ortalamanızı ne kadar taşıdığını sayılarla anlayın.",
      en: "View your term-by-term trend, grade distribution, credit accumulation and a graduation-average simulation as charts. See in numbers how much each term carries your average."
    },

    /* ================= Ana sayfa: SSS ================= */
    'faq.eyebrow': { tr: "Sıkça Sorulan Sorular", en: "Frequently Asked Questions" },
    'faq.title': { tr: "Merak edilenler", en: "Common questions" },
    'faq.q1': { tr: "Transkriptim bir sunucuya yükleniyor mu?", en: "Is my transcript uploaded to a server?" },
    'faq.a1': {
      tr: "<p>Hayır. Bu sitenin arka ucu (backend) yok; dosyanızı alıp işleyecek bir sunucu hiç bulunmuyor. PDF'iniz tarayıcınızın içinde, sizin cihazınızda açılır ve metni orada çıkarılır. Ne dosyanın kendisi ne de içinden çıkan dersleriniz ağ üzerinden hiçbir yere gönderilmez. İsterseniz internet bağlantınızı kesip sayfayı yeniden yükleyerek deneyebilirsiniz: araç yine çalışır.</p>",
      en: "<p>No. This site has no backend; there is simply no server that receives or processes your file. Your PDF is opened inside your browser, on your own device, and its text is extracted there. Neither the file nor the courses extracted from it are sent anywhere over the network. If you like, disconnect from the internet and reload the page: the tool still works.</p>"
    },
    'faq.q2': { tr: "Hesaplanan ortalama resmî transkriptimle birebir aynı mı olacak?", en: "Will the calculated average exactly match my official transcript?" },
    'faq.a2': {
      tr: "<p>Amaç bu ve araç, üzerinde geliştirildiği gerçek transkriptlerdeki tüm basılı dönem ve genel ortalama değerlerini birebir üretiyor. Yine de bu araç bağımsız bir öğrenci projesidir; kenar durumlarda (alışılmadık ders kodları, yatay geçiş kayıtları, muafiyetler, yönetmelik değişiklikleri) sapma olabilir. <strong>Resmî ve bağlayıcı olan, üniversitenin verdiği transkripttir.</strong> Buradaki sonucu bir tahmin ve planlama aracı olarak kullanın, resmî belge yerine geçirmeyin.</p>",
      en: "<p>That is the goal, and the tool reproduces every printed term and cumulative average in the real transcripts it was developed against. Even so, this is an independent student project; edge cases (unusual course codes, transfer records, exemptions, regulation changes) may cause deviations. <strong>Your official transcript from the university is the binding document.</strong> Treat the result here as an estimate and planning aid, not a substitute for the official record.</p>"
    },
    'faq.q3': { tr: "Verilerim nerede saklanıyor? Kaybolur mu?", en: "Where is my data stored? Can I lose it?" },
    'faq.a3': {
      tr: "<p>Dersleriniz tarayıcınızın <strong>yerel depolama</strong> (localStorage) alanında, yalnızca kullandığınız cihaz ve tarayıcıda tutulur. Sekmeyi kapatsanız da kalır, ertesi gün geri geldiğinizde yerinde durur.</p><p>Ama bu kalıcı bir yedek değildir: tarayıcı verilerini temizlerseniz, gizli sekmede çalışıyorsanız ya da başka bir cihaza geçerseniz veriler gelmez. Planlayıcıdaki <strong>Yedek İndir</strong> düğmesi tüm verinizi bir JSON dosyası olarak indirir; önemli bir planınız varsa ara ara yedek almanızı öneririz.</p>",
      en: "<p>Your courses are kept in your browser's <strong>local storage</strong>, on the device and browser you are using only. They survive closing the tab and are still there when you come back the next day.</p><p>But this is not a durable backup: if you clear browsing data, work in a private window, or move to another device, the data will not follow you. The <strong>Download Backup</strong> button in the planner saves everything as a JSON file; if you have a plan you care about, export a backup now and then.</p>"
    },
    'faq.q4': { tr: "Hangi belgeyi yükleyebilirim?", en: "Which document can I upload?" },
    'faq.a4': {
      tr: "<p>Boğaziçi Üniversitesi'nin PDF biçimindeki not döküm belgeleri desteklenir: e-Devlet üzerinden alınan <strong>Öğrenci Durum Belgesi</strong> ve öğrenci işlerinden alınan resmî <strong>TRANSCRIPT</strong> çıktısı. Araç hangi biçimle karşılaştığını kendisi anlar.</p><p>Belgenin metin katmanı içermesi gerekir. Ekran görüntüsü, fotoğraf ya da taranmış (görüntü olarak kaydedilmiş) bir PDF'ten metin çıkarılamaz. Belgeniz okunamazsa dersleri planlayıcıdan elle de girebilirsiniz.</p>",
      en: "<p>Boğaziçi University transcript documents in PDF form are supported: the <strong>Student Status Document</strong> obtained through e-Devlet and the official <strong>TRANSCRIPT</strong> issued by the registrar. The tool detects which format it is looking at on its own.</p><p>The document must contain a text layer. Text cannot be extracted from a screenshot, a photo or a scanned (image-only) PDF. If your document cannot be read, you can still enter courses by hand in the planner.</p>"
    },
    'faq.q5': { tr: "Çekilme (W) ve tekrar edilen dersler doğru işleniyor mu?", en: "Are withdrawals (W) and repeated courses handled correctly?" },
    'faq.a5': {
      tr: "<p>Evet, ikisi de otomatik ele alınır. <strong>W</strong> notu alınan dersler listede görünür ama ortalamaya ve tamamlanan krediye katılmaz. Tekrar edilen derslerde kümülatif ortalamaya yalnızca son geçerli not girer ve kredi bir kez sayılır — ders kodu değişerek yerine başka bir ders sayılmış olsa bile zincir izlenir.</p><p>Henüz sonuçlanmamış bir tekrar (notu girilmemiş ya da W ile biten) eski notunuzu silmez; ortalamanız o ders için önceki notla hesaplanmaya devam eder.</p>",
      en: "<p>Yes, both are handled automatically. Courses graded <strong>W</strong> appear in the list but count toward neither the average nor completed credits. For repeated courses, only the latest valid grade enters the cumulative average and the credit is counted once — the chain is followed even when a different course code substitutes for the original.</p><p>A repeat that has not concluded (no grade entered yet, or ending in W) does not erase your earlier grade; your average keeps using the previous grade for that course.</p>"
    },
    'faq.q6': { tr: "\"Bu dersten AA alırsam ortalamam ne olur?\" diye deneyebilir miyim?", en: "Can I try \"what if I get an AA in this course?\"" },
    'faq.a6': {
      tr: "<p>Evet, planlayıcı tam olarak bunun için var. Gelecek dönem için bir dönem kartı açıp alacağınız dersleri kredileriyle girin, sonra not alanlarında farklı harfler deneyin. Genel ortalamanız her değişiklikte alt çubukta anında güncellenir.</p><p>Analitik sayfasındaki mezuniyet simülasyonu ise tersinden bakar: hedeflediğiniz ortalamaya ulaşmak için kalan derslerde ortalama kaç almanız gerektiğini gösterir.</p>",
      en: "<p>Yes — that is exactly what the planner is for. Create a term card for an upcoming term, enter the courses you plan to take with their credits, then try different letters in the grade fields. Your overall average updates instantly in the bottom bar with every change.</p><p>The graduation simulation on the analytics page looks at it from the other side: it shows what average you need across your remaining courses to reach the GPA you are aiming for.</p>"
    },
    'faq.q7': { tr: "Araç ücretli mi? Reklamlar neden var?", en: "Is the tool paid? Why are there ads?" },
    'faq.a7': {
      tr: "<p>Araç tamamen ücretsizdir, üyelik veya hesap açmanız gerekmez. Sitede gösterilen reklamlar yalnızca alan adı ve barındırma masraflarını karşılamak içindir. Reklamların hesaplamalara, verilerinize veya araçların çalışmasına hiçbir etkisi yoktur; reklam ağının transkript verilerinize erişimi yoktur, çünkü o veriler zaten cihazınızdan çıkmaz.</p>",
      en: "<p>The tool is completely free; no account or sign-up is required. The ads shown on the site exist only to cover domain and hosting costs. They have no effect on the calculations, your data or how the tools work; the ad network has no access to your transcript data, because that data never leaves your device.</p>"
    },
    'faq.q8': { tr: "Bu, Boğaziçi Üniversitesi'nin resmî aracı mı?", en: "Is this an official Boğaziçi University tool?" },
    'faq.a8': {
      tr: "<p>Hayır. Bu site Boğaziçi Üniversitesi ile bağlantılı değildir, üniversite tarafından desteklenmez ve onaylanmamıştır. Bağımsız bir öğrenci projesidir. Üniversitenin adı ve görselleri yalnızca aracın hangi kurumun not sistemine göre hesap yaptığını belirtmek için kullanılmaktadır.</p>",
      en: "<p>No. This site is not affiliated with, endorsed by or approved by Boğaziçi University. It is an independent student project. The university's name and imagery are used only to indicate whose grading system the tool calculates against.</p>"
    },

    /* ================= Araç sayfası girişleri ================= */
    'intro.crumb': { tr: "Ana Sayfa", en: "Home" },

    'intro.upload.eyebrow': { tr: "Adım 01 — Aktarım", en: "Step 01 — Import" },
    'intro.upload.title': { tr: "Transkript Yükleyici", en: "Transcript Loader" },
    'intro.upload.body': {
      tr: "<p>Bu sayfa, Boğaziçi Üniversitesi'nden aldığınız PDF not döküm belgesini okunabilir bir ders listesine çevirir. Belgeyi aşağıdaki alana sürüklediğinizde dosya <strong>tarayıcınızın içinde</strong> açılır; metin katmanı çıkarılır ve ders kodları, ders adları, krediler, harf notları ve dönem başlıkları ayrıştırılır. Çıkan veriler doğrudan planlayıcıya ve analitik sayfasına aktarılır.</p><p>Araç iki belge biçimini de tanır: e-Devlet üzerinden alınan <strong>Öğrenci Durum Belgesi</strong> ve öğrenci işlerinin verdiği resmî <strong>TRANSCRIPT</strong> çıktısı. Hangisini yüklediğinizi belirtmenize gerek yok, biçim otomatik saptanır. Çekilen dersler (W), tekrar edilen dersler, yerine sayılan dersler ve kredisiz dersler gibi özel durumlar ayrıştırma sırasında dikkate alınır.</p><p>Belgenizin metin katmanı yoksa — örneğin taranmış bir kağıdın fotoğrafıysa — metin çıkarılamaz. Böyle bir durumda derslerinizi planlayıcıdan elle girebilirsiniz.</p>",
      en: "<p>This page turns the PDF transcript you received from Boğaziçi University into a readable course list. When you drag the document into the area below, the file is opened <strong>inside your browser</strong>; its text layer is extracted and course codes, titles, credits, letter grades and term headings are parsed. The results are passed straight to the planner and the analytics page.</p><p>The tool recognises both document formats: the <strong>Student Status Document</strong> from e-Devlet and the official <strong>TRANSCRIPT</strong> issued by the registrar. You do not need to say which one you have — the format is detected automatically. Special cases such as withdrawals (W), repeated courses, substituted courses and zero-credit courses are taken into account during parsing.</p><p>If your document has no text layer — a photo of a scanned page, for instance — text cannot be extracted. In that case you can enter your courses by hand in the planner.</p>"
    },
    'intro.upload.f1': { tr: "<strong>Dosya cihazınızdan çıkmaz.</strong> Yükleme diye bir şey yok; PDF yalnızca tarayıcınızda açılır.", en: "<strong>The file never leaves your device.</strong> There is no upload; the PDF is opened only in your browser." },
    'intro.upload.f2': { tr: "<strong>Desteklenen biçim:</strong> metin katmanı olan PDF not döküm belgeleri.", en: "<strong>Supported format:</strong> PDF transcript documents containing a text layer." },
    'intro.upload.f3': { tr: "<strong>Sonrası:</strong> aktarılan dersler planlayıcıya düşer, orada düzenleyebilirsiniz.", en: "<strong>Next:</strong> imported courses land in the planner, where you can edit them." },

    'intro.planner.eyebrow': { tr: "Adım 02 — Planlama", en: "Step 02 — Planning" },
    'intro.planner.title': { tr: "Ders Planlayıcı", en: "Course Planner" },
    'intro.planner.body': {
      tr: "<p>Planlayıcı, tüm derslerinizi dönem dönem düzenlediğiniz çalışma alanıdır. Her dönem bir kart olarak görünür; kartların içine ders ekleyebilir, dersleri sürükleyip başka bir döneme taşıyabilir, kredi ve harf notu alanlarını değiştirebilirsiniz. Yaptığınız her değişiklikten sonra <strong>genel ortalamanız, toplam krediniz ve tamamlanan krediniz</strong> alt çubukta anında yeniden hesaplanır.</p><p>Sayfanın asıl gücü ileriye dönük planlamada ortaya çıkar. Gelecek dönem için boş bir dönem kartı açın, almayı düşündüğünüz dersleri kredileriyle girin ve not alanlarında farklı senaryolar deneyin: \"iki dersten AA, birinden BB alırsam ortalamam nereye gelir?\" sorusunun cevabını anında görürsünüz. Hesaplama, tekrar edilen derslerde son notu sayma ve W notlarını ortalamaya katmama kurallarını otomatik uygular.</p><p>Verileriniz tarayıcınıza otomatik kaydedilir; sayfadan çıkıp geri döndüğünüzde kaldığınız yerden devam edersiniz. Kalıcı bir kopya istiyorsanız <strong>Yedek İndir</strong> ile tüm planınızı JSON dosyası olarak indirebilir, sonra aynı dosyadan geri yükleyebilirsiniz.</p>",
      en: "<p>The planner is the workspace where you organise all your courses term by term. Each term appears as a card; you can add courses to it, drag courses between terms, and edit credit and letter-grade fields. After every change, your <strong>overall average, total credits and completed credits</strong> are recalculated instantly in the bottom bar.</p><p>The page's real strength shows in forward planning. Create an empty term card for an upcoming term, enter the courses you are considering with their credits, and try different scenarios in the grade fields: you immediately see the answer to \"where does my average land if I get AA in two and BB in one?\" The calculation automatically applies the rules for counting the latest grade in repeated courses and excluding W grades from the average.</p><p>Your data is saved to your browser automatically, so you pick up where you left off when you return. If you want a durable copy, <strong>Download Backup</strong> saves your whole plan as a JSON file that you can restore later.</p>"
    },
    'intro.planner.f1': { tr: "<strong>Otomatik kayıt.</strong> Her değişiklik tarayıcınıza anında yazılır.", en: "<strong>Autosave.</strong> Every change is written to your browser instantly." },
    'intro.planner.f2': { tr: "<strong>Senaryo denemesi.</strong> Not alanlarını değiştirip ortalamanın nereye gittiğini görün.", en: "<strong>Scenario testing.</strong> Change the grade fields and watch where the average goes." },
    'intro.planner.f3': { tr: "<strong>Yedekleme.</strong> Planınızı JSON olarak indirip başka cihazda geri yükleyin.", en: "<strong>Backups.</strong> Export your plan as JSON and restore it on another device." },

    'intro.stats.eyebrow': { tr: "Adım 03 — Analiz", en: "Step 03 — Analysis" },
    'intro.stats.title': { tr: "Akademik Analitik", en: "Academic Analytics" },
    'intro.stats.body': {
      tr: "<p>Analitik sayfası, planlayıcıdaki verilerinizi grafiklere dönüştürür. Tek bir ortalama sayısının söylemediği şeyleri burada görürsünüz: dönemlik ortalamanızın zaman içindeki <strong>trendi</strong>, harf notlarınızın <strong>dağılımı</strong>, dönem başına <strong>kredi yükünüz</strong> ve kümülatif ortalamanızın hangi dönemlerde yön değiştirdiği.</p><p>Sayfada ayrıca bir <strong>mezuniyet simülasyonu</strong> bulunur: hedeflediğiniz genel ortalamayı girdiğinizde, kalan derslerinizde ortalama kaç almanız gerektiğini hesaplar. Bu, hedefin ulaşılabilir olup olmadığını görmenin en hızlı yoludur — kalan kredi azaldıkça gereken ortalamanın nasıl yükseldiğini somut olarak gösterir.</p><p>Grafiklerin tamamı tarayıcınızda, planlayıcıdaki verilerden üretilir. Henüz ders eklemediyseniz sayfa boş görünür; önce transkriptinizi aktarın ya da planlayıcıdan birkaç ders girin.</p>",
      en: "<p>The analytics page turns your planner data into charts. Here you see what a single average number cannot tell you: the <strong>trend</strong> of your term average over time, the <strong>distribution</strong> of your letter grades, your <strong>credit load</strong> per term, and where your cumulative average changed direction.</p><p>The page also includes a <strong>graduation simulation</strong>: enter the overall average you are aiming for and it calculates the average you need across your remaining courses. It is the fastest way to see whether a target is realistic — showing concretely how the required average climbs as remaining credits shrink.</p><p>All charts are generated in your browser from your planner data. If you have not added any courses yet, the page will look empty; import your transcript first, or enter a few courses in the planner.</p>"
    },
    'intro.stats.f1': { tr: "<strong>12 grafik.</strong> Trend, dağılım, kredi yükü ve ders bazlı kırılımlar.", en: "<strong>12 charts.</strong> Trends, distribution, credit load and per-course breakdowns." },
    'intro.stats.f2': { tr: "<strong>Mezuniyet simülasyonu.</strong> Hedef ortalamanız için gereken notu hesaplar.", en: "<strong>Graduation simulation.</strong> Calculates the grades needed for your target average." },
    'intro.stats.f3': { tr: "<strong>Veri kaynağı:</strong> planlayıcıdaki dersleriniz. Sunucuya sorgu gitmez.", en: "<strong>Data source:</strong> your courses in the planner. No server queries." },

    /* ================= Gizlilik Politikası ================= */
    'privacy.title': { tr: "Gizlilik Politikası", en: "Privacy Policy" },
    'privacy.lead': {
      tr: "Bu sitenin çalışma biçimi gizlilik açısından sıra dışıdır: transkript verilerinizi toplayan bir sunucu yoktur, çünkü sitenin arka ucu hiç yoktur. Aşağıda hangi verilerin nerede işlendiği, hangi üçüncü taraf hizmetlerinin devrede olduğu ve verilerinizi nasıl silebileceğiniz ayrıntılı olarak açıklanmıştır.",
      en: "The way this site works is unusual from a privacy standpoint: there is no server collecting your transcript data, because there is no backend at all. Below you will find a detailed account of what data is processed where, which third-party services are involved, and how you can delete your data."
    },
    'privacy.updated': { tr: "Son güncelleme: 16 Eylül 2026", en: "Last updated: 16 September 2026" },
    'privacy.toc': { tr: "İçindekiler", en: "Contents" },

    'privacy.h1': { tr: "Kısaca özet", en: "In short" },
    'privacy.b1': {
      tr: "<p>Bu site sizden hiçbir kişisel veri toplamaz, saklamaz veya üçüncü taraflara aktarmaz. Üyelik yoktur, giriş yapmazsınız, e-posta adresi istemeyiz. Yüklediğiniz transkript ve girdiğiniz dersler <strong>yalnızca kendi cihazınızda</strong> işlenir ve orada kalır.</p><p>Bunun tek istisnası, sitenin barındırıldığı altyapının tuttuğu standart erişim kayıtları ve sitede gösterilen Google reklamlarının kullandığı çerezlerdir. İkisi de aşağıda ayrıntılı anlatılmıştır ve hiçbiri akademik verilerinize erişemez.</p>",
      en: "<p>This site does not collect, store or transfer any personal data. There is no membership, no login, and we never ask for an email address. The transcript you upload and the courses you enter are processed <strong>solely on your own device</strong> and stay there.</p><p>The only exceptions are the standard access logs kept by the hosting infrastructure and the cookies used by the Google ads shown on the site. Both are described in detail below, and neither can access your academic data.</p>"
    },

    'privacy.h2': { tr: "Hangi verileri işliyoruz?", en: "What data is processed?" },
    'privacy.b2': {
      tr: "<p>Araç üç tür veriyle çalışır ve üçü de cihazınızdan çıkmaz:</p><ul><li><strong>Transkript PDF dosyanız.</strong> Yükleme alanına bıraktığınız dosya tarayıcınızda açılır ve metni tarayıcıda çıkarılır. Dosya hiçbir yere gönderilmez, hiçbir yerde saklanmaz; sayfayı kapattığınızda bellekten silinir.</li><li><strong>Ders verileriniz.</strong> Ders kodları, ders adları, krediler, harf notları ve dönem bilgileri. Bunlar tarayıcınızın yerel depolama alanına yazılır ki bir dahaki gelişinizde planınız yerinde dursun.</li><li><strong>Arayüz tercihleriniz.</strong> Seçtiğiniz dil (Türkçe/İngilizce) ve tema (açık/karanlık) tercihi.</li></ul><p>Adınız, öğrenci numaranız, e-posta adresiniz veya kimliğinizi belirleyecek başka hiçbir bilgi istenmez ve işlenmez. Transkriptinizde bu tür bilgiler basılı olsa bile araç yalnızca ders ve not satırlarını ayrıştırır.</p>",
      en: "<p>The tool works with three kinds of data, none of which leaves your device:</p><ul><li><strong>Your transcript PDF.</strong> The file you drop into the upload area is opened in your browser and its text extracted there. It is never transmitted or stored anywhere; it is cleared from memory when you close the page.</li><li><strong>Your course data.</strong> Course codes, titles, credits, letter grades and term information. These are written to your browser's local storage so your plan is still there next time.</li><li><strong>Your interface preferences.</strong> Your chosen language (Turkish/English) and theme (light/dark).</li></ul><p>Your name, student number, email address or any other identifying information is never requested or processed. Even if such details are printed on your transcript, the tool parses only the course and grade rows.</p>"
    },

    'privacy.h3': { tr: "Verileriniz nerede saklanıyor?", en: "Where is your data stored?" },
    'privacy.b3': {
      tr: "<p>Tarayıcınızın <strong>localStorage</strong> alanında, yalnızca o cihaz ve o tarayıcıda. Kullanılan anahtarlar şunlardır:</p><ul><li><code>gpa-planner:data:v1</code> — dersleriniz ve dönemleriniz</li><li><code>gpa-planner:theme</code> — açık/karanlık tema tercihiniz</li><li><code>gpa-planner:lang</code> — dil tercihiniz</li></ul><p>localStorage tarayıcıya özeldir: verileriniz başka bir cihaza, başka bir tarayıcıya veya gizli sekmeye taşınmaz. Geliştiricinin bu verilere erişimi yoktur ve bu verilere uzaktan ulaşacak bir mekanizma bulunmamaktadır.</p>",
      en: "<p>In your browser's <strong>localStorage</strong>, on that device and that browser only. The keys used are:</p><ul><li><code>gpa-planner:data:v1</code> — your courses and terms</li><li><code>gpa-planner:theme</code> — your light/dark theme preference</li><li><code>gpa-planner:lang</code> — your language preference</li></ul><p>localStorage is browser-specific: your data does not travel to another device, another browser or a private window. The developer has no access to it, and no mechanism exists to reach it remotely.</p>"
    },

    'privacy.h4': { tr: "Sunucuya ne gidiyor?", en: "What reaches a server?" },
    'privacy.b4': {
      tr: "<p>Akademik verilerinizden hiçbiri. Ancak herhangi bir web sitesini ziyaret ettiğinizde olduğu gibi, sayfanın kendisini (HTML, CSS, JavaScript dosyaları ve görseller) indirmek için barındırma sağlayıcımıza bir istek gider. Site <strong>Vercel Inc.</strong> altyapısında barındırılmaktadır ve Vercel bu isteklere ilişkin standart erişim kayıtları tutar: IP adresi, tarayıcı bilgisi (user-agent), istenen sayfa adresi ve zaman damgası.</p><p>Bu kayıtlar altyapı işletimi ve güvenliği içindir; geliştirici bunları analiz amacıyla kullanmaz. Sitede Google Analytics veya benzeri bir ziyaretçi izleme aracı <strong>kullanılmamaktadır</strong>.</p>",
      en: "<p>None of your academic data. However, as with any website, a request goes to the hosting provider to download the page itself (HTML, CSS, JavaScript files and images). The site is hosted on <strong>Vercel Inc.</strong> infrastructure, and Vercel keeps standard access logs for those requests: IP address, browser information (user agent), the requested page address and a timestamp.</p><p>These logs exist for infrastructure operation and security; the developer does not use them for analytics. Google Analytics or any similar visitor-tracking tool is <strong>not used</strong> on this site.</p>"
    },

    'privacy.h5': { tr: "Üçüncü taraf hizmetleri", en: "Third-party services" },
    'privacy.b5': {
      tr: "<p>Sayfalar düzgün çalışsın diye birkaç dış kaynak yüklenir. Bu kaynakları sunan şirketler, dosyayı size ulaştırmak için IP adresinizi ve tarayıcı bilgilerinizi görür. Kullanılan hizmetler:</p><ul><li><strong>Google Fonts</strong> (<code>fonts.googleapis.com</code>, <code>fonts.gstatic.com</code>) — sitedeki yazı tipleri.</li><li><strong>Cloudflare cdnjs</strong> (<code>cdnjs.cloudflare.com</code>) — PDF okuma kütüphanesi (pdf.js).</li><li><strong>jsDelivr</strong> (<code>cdn.jsdelivr.net</code>) — grafik kütüphanesi (Chart.js) ve sürükle-bırak kütüphanesi (SortableJS).</li><li><strong>Google AdSense</strong> (<code>pagead2.googlesyndication.com</code>) — sitedeki reklamlar. Ayrıntısı bir sonraki başlıkta.</li><li><strong>Vercel</strong> — barındırma altyapısı.</li></ul><p>Bu hizmetlerin hiçbirine transkriptiniz, dersleriniz veya notlarınız gönderilmez.</p>",
      en: "<p>A few external resources are loaded so the pages work properly. The companies serving them see your IP address and browser information in order to deliver the file. The services used are:</p><ul><li><strong>Google Fonts</strong> (<code>fonts.googleapis.com</code>, <code>fonts.gstatic.com</code>) — the site's typefaces.</li><li><strong>Cloudflare cdnjs</strong> (<code>cdnjs.cloudflare.com</code>) — the PDF reading library (pdf.js).</li><li><strong>jsDelivr</strong> (<code>cdn.jsdelivr.net</code>) — the charting library (Chart.js) and the drag-and-drop library (SortableJS).</li><li><strong>Google AdSense</strong> (<code>pagead2.googlesyndication.com</code>) — the ads on the site. Detailed in the next section.</li><li><strong>Vercel</strong> — hosting infrastructure.</li></ul><p>None of these services receive your transcript, your courses or your grades.</p>"
    },

    'privacy.h6': { tr: "Çerezler ve Google AdSense", en: "Cookies and Google AdSense" },
    'privacy.b6': {
      tr: "<p>Bu site kendi adına <strong>hiçbir çerez yerleştirmez</strong>. Tercihleriniz çerezle değil, localStorage ile saklanır.</p><p>Buna karşılık site, masraflarını karşılamak için <strong>Google AdSense</strong> üzerinden reklam gösterir. Google ve iş ortakları, reklamları sunmak ve ölçmek için tarayıcınıza çerez yerleştirebilir. Google'ın <code>DoubleClick DART</code> çerezi gibi mekanizmalar, bu siteye ve internetteki diğer sitelere yaptığınız ziyaretlere dayanarak size ilgi alanınıza yönelik reklamlar gösterebilir. Üçüncü taraf satıcılar (Google dahil), reklam sunumu sonucunda tarayıcınıza çerez yerleştirebilir ve okuyabilir; web işaretçileri ya da IP adresleri gibi tanımlayıcılarla bilgi toplayabilir. Google'ın bu verileri nasıl kullandığı <a href='https://policies.google.com/technologies/partner-sites' target='_blank' rel='noopener noreferrer'>Google'ın iş ortağı sitelerinde veri kullanımı</a> sayfasında açıklanmıştır.</p><p>Bu konudaki haklarınız:</p><ul><li>Kişiselleştirilmiş reklamları <a href='https://www.google.com/settings/ads' target='_blank' rel='noopener noreferrer'>Google Reklam Ayarları</a> sayfasından kapatabilirsiniz.</li><li>Google'ın reklamcılıkta veri kullanımını <a href='https://policies.google.com/technologies/ads' target='_blank' rel='noopener noreferrer'>Google Reklam Teknolojileri</a> sayfasından okuyabilirsiniz.</li><li>Üçüncü taraf satıcıların çerezlerini <a href='https://www.aboutads.info/choices/' target='_blank' rel='noopener noreferrer'>aboutads.info</a> üzerinden toplu olarak devre dışı bırakabilirsiniz.</li><li>Tarayıcınızın ayarlarından çerezleri tümüyle engelleyebilirsiniz. Bu, aracın hesaplama işlevlerini etkilemez.</li></ul>",
      en: "<p>This site sets <strong>no cookies of its own</strong>. Your preferences are stored in localStorage, not in cookies.</p><p>The site does, however, show ads through <strong>Google AdSense</strong> to cover its costs. Google and its partners may set cookies in your browser to serve and measure those ads. Mechanisms such as Google's <code>DoubleClick DART</code> cookie may show you interest-based ads based on your visits to this and other sites on the internet. Third-party vendors, including Google, may place and read cookies in your browser as a result of ad serving, and may collect information through identifiers such as web beacons or IP addresses. How Google uses this data is explained on <a href='https://policies.google.com/technologies/partner-sites' target='_blank' rel='noopener noreferrer'>Google's page on data use on partner sites</a>.</p><p>Your options here:</p><ul><li>You can turn off personalised advertising in <a href='https://www.google.com/settings/ads' target='_blank' rel='noopener noreferrer'>Google Ad Settings</a>.</li><li>You can read how Google uses data in advertising on the <a href='https://policies.google.com/technologies/ads' target='_blank' rel='noopener noreferrer'>Google Advertising Technologies</a> page.</li><li>You can opt out of third-party vendor cookies in bulk at <a href='https://www.aboutads.info/choices/' target='_blank' rel='noopener noreferrer'>aboutads.info</a>.</li><li>You can block cookies entirely in your browser settings. This does not affect the tool's calculation features.</li></ul>"
    },

    'privacy.h7': { tr: "Verilerinizi silme", en: "Deleting your data" },
    'privacy.b7': {
      tr: "<p>Verileriniz sizde olduğu için silme işlemi de tamamen sizin elinizdedir; bizden talep etmenize gerek yoktur. Şunlardan birini yapmanız yeterlidir:</p><ul><li>Tarayıcınızın ayarlarından bu site için site verilerini / depolama alanını temizleyin.</li><li>Tarayıcı geçmişinizi \"çerezler ve site verileri\" seçeneğiyle temizleyin.</li><li>Planlayıcıdaki dönemleri ve dersleri tek tek silin.</li></ul><p>Bu işlemlerden sonra araç sizi tanımayan boş bir sayfa olarak açılır. Silinen veriler geri getirilemez; önceden <strong>Yedek İndir</strong> ile aldığınız JSON dosyası varsa oradan geri yükleyebilirsiniz.</p>",
      en: "<p>Because your data lives with you, deleting it is entirely in your hands; there is no need to request anything from us. Any one of the following is enough:</p><ul><li>Clear site data / storage for this site in your browser settings.</li><li>Clear your browsing history with the \"cookies and site data\" option selected.</li><li>Delete the terms and courses one by one in the planner.</li></ul><p>After that, the tool opens as a blank page that does not recognise you. Deleted data cannot be recovered; if you previously exported a JSON file with <strong>Download Backup</strong>, you can restore from it.</p>"
    },

    'privacy.h8': { tr: "Çocukların gizliliği", en: "Children's privacy" },
    'privacy.b8': {
      tr: "<p>Bu araç üniversite öğrencilerine yöneliktir ve 13 yaşın altındaki kişilerden bilerek veri toplamaz. Zaten hiç kimseden veri toplanmadığı için bu yönde bir kayıt da oluşmaz.</p>",
      en: "<p>This tool is aimed at university students and does not knowingly collect data from anyone under 13. Since no data is collected from anyone at all, no such record is ever created.</p>"
    },

    'privacy.h9': { tr: "Bu politikadaki değişiklikler", en: "Changes to this policy" },
    'privacy.b9': {
      tr: "<p>Araca yeni bir özellik eklendiğinde veya kullanılan üçüncü taraf hizmetleri değiştiğinde bu sayfa güncellenir. Sayfanın başındaki \"son güncelleme\" tarihi her değişiklikte yenilenir. Önemli bir değişiklik olursa sitede ayrıca duyurulur.</p>",
      en: "<p>This page is updated when a new feature is added or the third-party services in use change. The \"last updated\" date at the top is refreshed with every change. Significant changes will also be announced on the site.</p>"
    },

    'privacy.h10': { tr: "İletişim", en: "Contact" },
    'privacy.b10': {
      tr: "<p>Gizlilikle ilgili soru, talep veya endişeleriniz için <a href='mailto:" + CONTACT + "'>" + CONTACT + "</a> adresine yazabilirsiniz. Projenin kaynak kodu herkese açıktır ve <a href='" + REPO + "' target='_blank' rel='noopener noreferrer'>GitHub üzerinde</a> incelenebilir — burada anlatılan her şeyi kodun kendisinden doğrulayabilirsiniz.</p>",
      en: "<p>For any privacy questions, requests or concerns, write to <a href='mailto:" + CONTACT + "'>" + CONTACT + "</a>. The project's source code is public and can be inspected <a href='" + REPO + "' target='_blank' rel='noopener noreferrer'>on GitHub</a> — you can verify everything described here in the code itself.</p>"
    },

    /* ================= Kullanım Koşulları ================= */
    'terms.title': { tr: "Kullanım Koşulları", en: "Terms of Use" },
    'terms.lead': {
      tr: "Bu sayfa, aracı hangi şartlarla kullandığınızı açıklar. Kısacası: araç ücretsizdir, olduğu gibi sunulur, resmî bir belge üretmez ve Boğaziçi Üniversitesi ile bağlantılı değildir. Ayrıntılar aşağıdadır.",
      en: "This page explains the terms under which you use the tool. In short: it is free, provided as is, does not produce an official document, and is not affiliated with Boğaziçi University. Details follow."
    },
    'terms.updated': { tr: "Son güncelleme: 31 Ağustos 2026", en: "Last updated: 31 August 2026" },

    'terms.h1': { tr: "Koşulların kabulü", en: "Acceptance of terms" },
    'terms.b1': {
      tr: "<p>Bu siteyi kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız. Koşulların herhangi bir maddesini kabul etmiyorsanız lütfen siteyi kullanmayınız. Kayıt olmanız ya da bir onay kutusu işaretlemeniz gerekmez; kullanım kabul anlamına gelir.</p>",
      en: "<p>By using this site you are deemed to accept the terms below. If you do not agree with any of them, please do not use the site. No registration or checkbox is required; use constitutes acceptance.</p>"
    },

    'terms.h2': { tr: "Hizmetin tanımı", en: "Description of the service" },
    'terms.b2': {
      tr: "<p>Site, Boğaziçi Üniversitesi öğrencilerinin not ortalamalarını hesaplaması, ders planı yapması ve akademik geçmişini görselleştirmesi için tasarlanmış ücretsiz bir tarayıcı aracıdır. Üç bileşenden oluşur: transkript yükleyici, ders planlayıcı ve akademik analitik.</p><p>Tüm hesaplamalar sizin cihazınızda yapılır. Hizmetin kullanımı için üyelik, ödeme veya kişisel bilgi paylaşımı gerekmez.</p>",
      en: "<p>The site is a free browser-based tool designed to help Boğaziçi University students calculate their grade averages, plan courses and visualise their academic history. It consists of three components: a transcript loader, a course planner and academic analytics.</p><p>All calculations run on your device. No membership, payment or sharing of personal information is required to use the service.</p>"
    },

    'terms.h3': { tr: "Bağımsızlık beyanı", en: "Statement of independence" },
    'terms.b3': {
      tr: "<p>Bu site <strong>Boğaziçi Üniversitesi ile bağlantılı değildir</strong>; üniversite tarafından işletilmez, desteklenmez, onaylanmaz ve denetlenmez. Bağımsız bir öğrenci projesidir.</p><p>Üniversitenin adı, logosu ve kampüs görselleri yalnızca aracın hangi kurumun not sistemine göre hesap yaptığını belirtmek amacıyla, tanımlayıcı nitelikte kullanılmaktadır. Bu kullanım herhangi bir resmî ortaklık, sponsorluk veya yetkilendirme anlamına gelmez.</p>",
      en: "<p>This site is <strong>not affiliated with Boğaziçi University</strong>; it is not operated, supported, endorsed or supervised by the university. It is an independent student project.</p><p>The university's name, logo and campus imagery are used descriptively, solely to indicate whose grading system the tool calculates against. This use does not imply any official partnership, sponsorship or authorisation.</p>"
    },

    'terms.h4': { tr: "Garanti reddi ve sonuçların niteliği", en: "Disclaimer and the nature of the results" },
    'terms.b4': {
      tr: "<p>Araç <strong>\"olduğu gibi\"</strong> sunulur. Hesaplamaların doğruluğu, kesintisizliği veya belirli bir amaca uygunluğu konusunda açık ya da örtülü hiçbir garanti verilmez.</p><p>Ürettiği ortalamalar <strong>gayriresmî tahminlerdir</strong>. Ayrıştırma hataları, yönetmelik değişiklikleri, alışılmadık transkript biçimleri, yatay geçiş kayıtları, muafiyetler ve benzeri durumlar sonucu etkileyebilir. Akademik durumunuzla ilgili bağlayıcı bilgi kaynağı yalnızca üniversitenizin verdiği resmî transkript ve öğrenci işleri birimidir.</p><p>Mezuniyet, burs, başvuru veya benzeri kararlarınızı yalnızca bu araçtan çıkan sonuçlara dayandırmayınız; resmî kaynaktan doğrulayınız.</p>",
      en: "<p>The tool is provided <strong>\"as is\"</strong>. No warranty, express or implied, is given as to the accuracy, availability or fitness for a particular purpose of its calculations.</p><p>The averages it produces are <strong>unofficial estimates</strong>. Parsing errors, regulation changes, unusual transcript formats, transfer records, exemptions and similar situations may affect the result. The only binding sources of information about your academic standing are the official transcript issued by your university and its registrar's office.</p><p>Do not base decisions about graduation, scholarships or applications on the output of this tool alone; verify with the official source.</p>"
    },

    'terms.h5': { tr: "Sorumluluğun sınırlandırılması", en: "Limitation of liability" },
    'terms.b5': {
      tr: "<p>Geliştirici, aracın kullanımından veya kullanılamamasından doğabilecek doğrudan ya da dolaylı zararlardan sorumlu tutulamaz. Buna yanlış hesaplanmış bir ortalamaya dayanarak alınan kararlar, veri kaybı ve hizmetin kesintiye uğraması dahildir. Araç ücretsiz sunulduğundan, kullanımıyla ilgili risk tümüyle kullanıcıya aittir.</p>",
      en: "<p>The developer cannot be held liable for any direct or indirect damages arising from the use or inability to use the tool. This includes decisions made on the basis of a miscalculated average, data loss and service interruptions. As the tool is provided free of charge, all risk associated with its use rests with the user.</p>"
    },

    'terms.h6': { tr: "Verilerinizin sorumluluğu", en: "Responsibility for your data" },
    'terms.b6': {
      tr: "<p>Girdiğiniz veriler yalnızca sizin tarayıcınızda saklanır ve geliştiricinin bunlara erişimi yoktur. Bu, verilerinizin yedeklenmesinin de sizin sorumluluğunuzda olduğu anlamına gelir.</p><p>Tarayıcı verilerini temizlemeniz, gizli sekmede çalışmanız, cihaz değiştirmeniz ya da tarayıcınızın depolama alanını boşaltması durumunda verileriniz geri getirilemez biçimde kaybolur. Önemli planlarınız için planlayıcıdaki <strong>Yedek İndir</strong> işlevini kullanmanız önerilir.</p>",
      en: "<p>The data you enter is stored only in your browser and the developer has no access to it. This also means backing it up is your responsibility.</p><p>If you clear browsing data, work in a private window, switch devices, or your browser reclaims its storage, your data is lost irrecoverably. For plans that matter to you, use the <strong>Download Backup</strong> function in the planner.</p>"
    },

    'terms.h7': { tr: "Kabul edilebilir kullanım", en: "Acceptable use" },
    'terms.b7': {
      tr: "<p>Araç kişisel akademik planlama amacıyla serbestçe kullanılabilir. Şunlar kabul edilemez: sitenin çalışmasını bozmaya yönelik girişimler, otomatik araçlarla aşırı istek gönderilmesi, aracın resmî bir üniversite hizmetiymiş gibi sunulması ve üretilen çıktıların resmî belge yerine geçecek şekilde üçüncü kişilere sunulması.</p>",
      en: "<p>The tool may be used freely for personal academic planning. The following are not acceptable: attempts to disrupt the site's operation, excessive automated requests, presenting the tool as an official university service, and passing its output to third parties as a substitute for an official document.</p>"
    },

    'terms.h8': { tr: "Fikrî mülkiyet ve açık kaynak", en: "Intellectual property and open source" },
    'terms.b8': {
      tr: "<p>Sitenin kaynak kodu açıktır ve <a href='" + REPO + "' target='_blank' rel='noopener noreferrer'>GitHub üzerinde</a> incelenebilir. Kodun kullanım koşulları depodaki lisans dosyasına tabidir.</p><p>Boğaziçi Üniversitesi'ne ait isim, logo ve görsellerin hakları ilgili kuruma aittir ve bu haklar bu proje kapsamında devredilmez.</p>",
      en: "<p>The site's source code is open and can be inspected <a href='" + REPO + "' target='_blank' rel='noopener noreferrer'>on GitHub</a>. Terms for using the code are governed by the licence file in the repository.</p><p>Rights to Boğaziçi University's name, logo and imagery belong to that institution and are not transferred by this project.</p>"
    },

    'terms.h9': { tr: "Reklamlar", en: "Advertising" },
    'terms.b9': {
      tr: "<p>Sitede, alan adı ve barındırma masraflarını karşılamak amacıyla Google AdSense üzerinden reklam gösterilir. Reklamların içeriği Google tarafından belirlenir; geliştirici gösterilen reklamların içeriğinden, reklamı veren şirketlerden veya bu reklamların yönlendirdiği sitelerden sorumlu değildir. Reklamların hesaplamalara veya verilerinize erişimi yoktur. Ayrıntı için <a href='gizlilik.html'>Gizlilik Politikası</a> sayfasına bakınız.</p>",
      en: "<p>Ads are shown through Google AdSense to cover domain and hosting costs. Their content is determined by Google; the developer is not responsible for the content of the ads, the advertisers, or the sites they lead to. Ads have no access to the calculations or your data. See the <a href='gizlilik.html'>Privacy Policy</a> for details.</p>"
    },

    'terms.h10': { tr: "Koşullardaki değişiklikler ve uygulanacak hukuk", en: "Changes to these terms and governing law" },
    'terms.b10': {
      tr: "<p>Bu koşullar zaman içinde güncellenebilir; yürürlükteki sürüm her zaman bu sayfada yayımlanır ve sayfa başındaki tarihten hangi sürüm olduğu anlaşılır. Değişiklikten sonra siteyi kullanmaya devam etmeniz güncel koşulları kabul ettiğiniz anlamına gelir.</p><p>Bu koşullar Türkiye Cumhuriyeti hukukuna tabidir.</p>",
      en: "<p>These terms may be updated over time; the version in force is always published on this page, and the date at the top identifies it. Continuing to use the site after a change means you accept the updated terms.</p><p>These terms are governed by the laws of the Republic of Türkiye.</p>"
    },

    'terms.h11': { tr: "İletişim", en: "Contact" },
    'terms.b11': {
      tr: "<p>Bu koşullarla ilgili sorularınız için <a href='mailto:" + CONTACT + "'>" + CONTACT + "</a> adresine yazabilirsiniz.</p>",
      en: "<p>For questions about these terms, write to <a href='mailto:" + CONTACT + "'>" + CONTACT + "</a>.</p>"
    },

    /* ================= Hakkında & İletişim ================= */
    'about.title': { tr: "Hakkında & İletişim", en: "About & Contact" },
    'about.lead': {
      tr: "Boğaziçi GPA, ortalamasını hesaplamak için her dönem aynı tabloyu yeniden kurmaktan sıkılmış bir öğrencinin yazdığı bağımsız bir araçtır. Ne yaptığı, nasıl çalıştığı ve nasıl ulaşabileceğiniz aşağıda.",
      en: "Boğaziçi GPA is an independent tool written by a student tired of rebuilding the same spreadsheet every term just to work out an average. What it does, how it works and how to reach us is below."
    },
    'about.updated': { tr: "Son güncelleme: 16 Eylül 2026", en: "Last updated: 16 September 2026" },

    'about.h1': { tr: "Bu proje ne?", en: "What is this project?" },
    'about.b1': {
      tr: "<p>Boğaziçi GPA, Boğaziçi Üniversitesi öğrencileri için üç işi bir araya getiren ücretsiz bir web aracıdır: resmî transkript PDF'inizi okunabilir bir ders listesine çevirir, dersleri dönem dönem planlamanızı sağlar ve akademik geçmişinizi grafiklerle analiz eder.</p><p>Kurulum gerektirmez, üyelik istemez ve bir arka uç sunucusu yoktur. Açtığınız sekmede çalışan bir programdır — tıpkı bir hesap makinesi gibi, ama transkriptinizi okuyabilen ve Boğaziçi'nin not kurallarını bilen bir hesap makinesi.</p>",
      en: "<p>Boğaziçi GPA is a free web tool for Boğaziçi University students that brings three jobs together: it turns your official transcript PDF into a readable course list, lets you plan courses term by term, and analyses your academic history with charts.</p><p>It requires no installation, asks for no account, and has no backend server. It is a program running in the tab you opened — much like a calculator, except one that can read your transcript and knows Boğaziçi's grading rules.</p>"
    },

    'about.h2': { tr: "Neden yapıldı?", en: "Why was it built?" },
    'about.b2': {
      tr: "<p>Ortalama hesabı, ders seçimi döneminde herkesin başına gelen tekrarlayan bir iştir. Öğrencilerin çoğu bunu elektronik tabloyla çözer; her seferinde krediler yeniden yazılır, katsayılar elle girilir, tekrar edilen dersler unutulur ve çıkan sayı çoğu zaman resmî transkriptle tutmaz.</p><p>Bu araç o döngüyü kırmak için yazıldı. Transkript zaten elinizde bir PDF olarak duruyor; onu bir kez okuyup doğru kurallarla hesaplamak, insanın elle yapmasından hem daha hızlı hem daha güvenilir. Buna \"peki şu dersten şu notu alırsam ne olur?\" sorusunu anında denemek de eklenince, ders seçimi kararları tahmine değil sayıya dayanır hale geliyor.</p>",
      en: "<p>Working out your average is a chore that repeats every course-registration period. Most students solve it with a spreadsheet; credits get retyped, coefficients entered by hand, repeated courses forgotten — and the resulting number often does not match the official transcript.</p><p>This tool was written to break that loop. The transcript is already sitting in your hands as a PDF; reading it once and applying the correct rules is both faster and more reliable than doing it by hand. Add the ability to instantly test \"what if I get this grade in that course?\" and registration decisions start resting on numbers rather than guesswork.</p>"
    },

    'about.h3': { tr: "Nasıl çalışıyor?", en: "How does it work?" },
    'about.b3': {
      tr: "<p>Site tamamen statiktir: HTML, CSS ve JavaScript dosyalarından ibarettir, veritabanı ya da uygulama sunucusu yoktur. PDF'iniz tarayıcıda <code>pdf.js</code> kütüphanesiyle açılır, metin katmanı çıkarılır ve projeye özel bir ayrıştırıcı bu metinden ders kodlarını, kredileri, harf notlarını ve dönem başlıklarını tanır.</p><p>Ayrıştırıcı yalnızca satırları okumakla kalmaz; çekilen dersleri (W), tekrar edilen dersleri, yerine sayılan dersleri ve kredisiz dersleri de ayırt eder. Ortalama hesabı ayrı bir modülde tutulur ve gerçek transkriptlerdeki basılı değerlerle karşılaştırılarak doğrulanmıştır.</p><p>Verileriniz tarayıcınızın yerel depolama alanında saklanır; üç sayfa da aynı veriyi paylaşır. Bu yüzden transkriptinizi bir kez aktarmanız yeterlidir, planlayıcı ve analitik anında dolar.</p>",
      en: "<p>The site is entirely static: it is nothing but HTML, CSS and JavaScript files, with no database or application server. Your PDF is opened in the browser with the <code>pdf.js</code> library, its text layer extracted, and a purpose-built parser recognises course codes, credits, letter grades and term headings in that text.</p><p>The parser does more than read lines; it also distinguishes withdrawals (W), repeated courses, substituted courses and zero-credit courses. The average calculation lives in a separate module and has been verified against the printed values on real transcripts.</p><p>Your data is kept in your browser's local storage, and all three pages share it. That is why importing your transcript once is enough — the planner and analytics fill in immediately.</p>"
    },

    'about.h3b': { tr: "Rehber bölümü nasıl hazırlanıyor?", en: "How is the guide section prepared?" },
    'about.b3b': {
      tr: "<p>Sitedeki <a href='rehber.html'>rehber</a>, aracın hesap yaparken uyguladığı kuralların yazılı hâlidir: harf notu katsayıları, GNO hesabı ve yuvarlama, ders tekrarı, dersten çekilme, ders yükü, sınamalı durum, onur dereceleri, mezuniyet, çift anadal, yan dal, yaz öğretimi, 100'lük dönüşüm ve ortalama yükseltme stratejisi.</p><p>Her makale, Boğaziçi Üniversitesi Lisans Eğitim ve Öğretim Yönetmeliği'nin (Resmî Gazete 11.06.2016, sayı 29739) ve ilgili yönergelerin yürürlükteki metni ile Akademik Danışmanlık Ofisi'nin resmî SSS sayfası okunarak yazılır; madde numaraları metinde verilir ve iki resmî kaynağın çeliştiği yerler gizlenmez, açıkça belirtilir. Sayısal örnekler elle hesaplanıp araçla doğrulanır. Yönetmelik değiştiğinde ilgili makale ve aracın hesap motoru birlikte güncellenir; her makalenin üstünde son güncelleme tarihi bulunur.</p><p>Rehber hukuki ya da resmî bir kaynak değildir. Bir kararı etkileyecek konuda son sözü her zaman Kayıt İşleri Şube Müdürlüğü ve akademik danışmanınız söyler; bir hata görürseniz aşağıdaki iletişim kanallarından bildirmenizi rica ederiz.</p>",
      en: "<p>The site's <a href='rehber.html'>guide</a> is the written form of the rules the tool applies when it calculates: letter grade coefficients, GPA calculation and rounding, course repeats, withdrawal, course load, probation, honours, graduation, double major, minor, summer school, conversion to the 100-point scale and GPA-raising strategy.</p><p>Each article is written from the current text of the Boğaziçi University Undergraduate Education Regulation (Official Gazette 11 June 2016, no. 29739) and the related directives, together with the Academic Advising Office's official FAQ page; article numbers are given in the text, and where two official sources conflict this is stated openly rather than hidden. Numerical examples are worked by hand and verified with the tool. When the regulation changes, the relevant article and the tool's calculation engine are updated together; every article shows its last-updated date at the top.</p><p>The guide is not a legal or official source. On anything that affects a decision, the Registrar's Office and your academic advisor always have the final word; if you spot an error, please report it through the contact channels below.</p>"
    },
    'about.h4': { tr: "Bağımsızlık", en: "Independence" },
    'about.b4': {
      tr: "<p>Bu proje Boğaziçi Üniversitesi ile bağlantılı değildir ve üniversite tarafından onaylanmamıştır. Bağımsız, kâr amacı gütmeyen bir öğrenci çalışmasıdır. Üniversitenin adı ve görselleri yalnızca aracın hangi not sistemine göre hesap yaptığını göstermek için kullanılır.</p><p>Araç ücretsizdir ve öyle kalacaktır. Sitede gösterilen reklamlar alan adı ve barındırma giderlerini karşılamak içindir; ücretli bir sürüm, abonelik ya da ödeme duvarı bulunmamaktadır.</p>",
      en: "<p>This project is not affiliated with or endorsed by Boğaziçi University. It is an independent, non-commercial student effort. The university's name and imagery are used only to show which grading system the tool calculates against.</p><p>The tool is free and will stay that way. The ads on the site cover domain and hosting costs; there is no paid tier, subscription or paywall.</p>"
    },

    'about.h5': { tr: "Açık kaynak", en: "Open source" },
    'about.b5': {
      tr: "<p>Projenin tüm kaynak kodu herkese açıktır: <a href='" + REPO + "' target='_blank' rel='noopener noreferrer'>github.com/Ereen00/GPA-Calculator</a>. Gizlilik politikasında anlatılan \"veriler cihazınızdan çıkmıyor\" iddiasını da dahil olmak üzere, aracın ne yaptığını doğrudan koddan doğrulayabilirsiniz.</p><p>Hata bildirimi ve öneriler için depodaki <em>Issues</em> bölümünü kullanabilir, katkıda bulunmak isterseniz pull request gönderebilirsiniz.</p>",
      en: "<p>All of the project's source code is public: <a href='" + REPO + "' target='_blank' rel='noopener noreferrer'>github.com/Ereen00/GPA-Calculator</a>. You can verify what the tool does directly from the code — including the privacy policy's claim that your data never leaves your device.</p><p>Use the repository's <em>Issues</em> section for bug reports and suggestions, and feel free to send a pull request if you would like to contribute.</p>"
    },

    'about.h6': { tr: "İletişim", en: "Contact" },
    'about.b6': {
      tr: "<p>Soru, geri bildirim, hata bildirimi ve iş birliği önerileri için:</p><ul><li><strong>E-posta:</strong> <a href='mailto:" + CONTACT + "'>" + CONTACT + "</a></li><li><strong>GitHub:</strong> <a href='" + REPO + "/issues' target='_blank' rel='noopener noreferrer'>Issues bölümü</a></li></ul><p>Transkriptiniz doğru ayrıştırılmadıysa bu özellikle duymak istediğimiz bir şeydir. Yazarken hangi belge türünü kullandığınızı (Öğrenci Durum Belgesi ya da resmî TRANSCRIPT) ve neyin yanlış çıktığını belirtirseniz sorunu bulmak çok daha kolay olur. <strong>Lütfen transkriptinizin kendisini e-postayla göndermeyin</strong> — kişisel verilerinizi paylaşmanıza gerek yok, sorunun tarifi yeterli.</p>",
      en: "<p>For questions, feedback, bug reports and collaboration proposals:</p><ul><li><strong>Email:</strong> <a href='mailto:" + CONTACT + "'>" + CONTACT + "</a></li><li><strong>GitHub:</strong> <a href='" + REPO + "/issues' target='_blank' rel='noopener noreferrer'>the Issues section</a></li></ul><p>If your transcript was not parsed correctly, that is something we especially want to hear about. Mentioning which document type you used (Student Status Document or the official TRANSCRIPT) and what came out wrong makes the problem far easier to find. <strong>Please do not email the transcript itself</strong> — there is no need to share your personal data; a description of the problem is enough.</p>"
    }
  };

  if (global.GPAI18N && typeof global.GPAI18N.extend === 'function') {
    global.GPAI18N.extend(CONTENT);
  }
  global.GPAContentDict = CONTENT;
})(window);
