/*
 * GPAI18N — TR/EN çeviri katmanı
 *  - Sözlük: data-i18n="anahtar" (metin), data-i18n-attr="placeholder:anahtar,title:anahtar2" (öznitelik)
 *  - GPAI18N.t(anahtar)                  -> aktif dildeki metni döndürür
 *  - GPAI18N.lang() / .set('tr'|'en')    -> aktif dil / dili değiştir
 *  - GPAI18N.onChange(fn)                -> dil değişince fn(lang) çağrılır
 *  - Dil değişince window'da 'gpa:langchange' olayı yayınlanır.
 * Sözlük her sayfada aynıdır; her sayfa yalnızca kullandığı anahtarları okur.
 */
(function (global) {
  'use strict';

  var LANG_KEY = 'gpa-planner:lang';

  var DICT = {
    /* ---- Navbar ---- */
    'nav.home': { tr: 'Ana Sayfa', en: 'Home' },
    'nav.planner': { tr: 'Ders Planlayıcı', en: 'Course Planner' },
    'nav.stats': { tr: 'Analitik', en: 'Analytics' },
    'nav.upload': { tr: 'Transkript Yükleyici', en: 'Transcript Loader' },
    'brand.name': { tr: 'Boğaziçi GPA', en: 'Boğaziçi GPA' },
    'brand.sub': { tr: 'Akademik Planlayıcı', en: 'Academic Planner' },

    /* ---- Ortak ---- */
    'common.skipToContent': { tr: 'İçeriğe geç', en: 'Skip to content' },
    'common.getStarted': { tr: 'Hemen Başla', en: 'Get Started' },
    'common.learnMore': { tr: 'Daha Fazla', en: 'Learn More' },
    'common.footerNote': {
      tr: 'Bu proje Boğaziçi Üniversitesi ile bağlantılı değildir; bağımsız bir öğrenci aracıdır. Tüm veriler yalnızca tarayıcınızda saklanır.',
      en: 'This project is not affiliated with Boğaziçi University; it is an independent student tool. All data stays in your browser only.'
    },
    'common.rights': { tr: 'Tüm hakları saklıdır.', en: 'All rights reserved.' },

    /* ---- Landing: Hero ---- */
    'home.crumb.home': { tr: 'Ana Sayfa', en: 'Home' },
    'home.crumb.here': { tr: 'GPA Hesaplayıcı', en: 'GPA Calculator' },
    'home.eyebrow': { tr: 'Boğaziçi Üniversitesi için', en: 'For Boğaziçi University' },
    'home.title1': { tr: 'Ortalamanızı', en: 'Know your' },
    'home.title2': { tr: 'Tanıyın.', en: 'GPA.' },
    'home.lead': {
      tr: 'Transkriptinizi saniyeler içinde aktarın, dönem dönem planlayın ve akademik gelişiminizi gerçek verilerle analiz edin — hepsi tarayıcınızda, sunucuya hiçbir şey gönderilmeden.',
      en: 'Import your transcript in seconds, plan term by term, and analyze your academic progress with real data — all in your browser, nothing sent to a server.'
    },
    'home.cta.primary': { tr: 'Transkript Yükle', en: 'Upload Transcript' },
    'home.cta.secondary': { tr: 'Planlayıcıyı Aç', en: 'Open Planner' },
    'home.stat1.value': { tr: '%100', en: '100%' },
    'home.stat1.label': { tr: 'Tarayıcıda çalışır', en: 'Runs in-browser' },
    'home.stat2.value': { tr: '12', en: '12' },
    'home.stat2.label': { tr: 'Analitik grafik', en: 'Analytics charts' },
    'home.stat3.value': { tr: '3', en: '3' },
    'home.stat3.label': { tr: 'Bütünleşik araç', en: 'Integrated tools' },

    /* ---- Landing: bölüm kartları ---- */
    'home.sections.eyebrow': { tr: 'Neler Yapabilirsiniz', en: 'What You Can Do' },
    'home.sections.title': { tr: 'Tek bir yerde tam akademik kontrol', en: 'Full academic control, in one place' },
    'home.sections.lead': {
      tr: 'Üç araç, tek bir veri kaynağını paylaşır: transkriptinizi bir kez aktarın, planlayıcıda ve analitikte anında görün.',
      en: 'Three tools share one data source: import your transcript once, see it instantly in the planner and analytics.'
    },

    'home.card.upload.tag': { tr: '01 — Başlangıç', en: '01 — Start Here' },
    'home.card.upload.title': { tr: 'Transkript Yükleyici', en: 'Transcript Loader' },
    'home.card.upload.desc': {
      tr: 'Resmi PDF not döküm belgenizi bırakın; dersleriniz, notlarınız ve dönemleriniz otomatik tanınıp aktarılsın. Withdraw, tekrar ve yaz okulu gibi özel durumlar da dahil.',
      en: 'Drop your official PDF transcript; your courses, grades and terms are recognized and imported automatically — including withdrawals, retakes and summer school.'
    },
    'home.card.upload.link': { tr: 'PDF Dönüştürücüyü Aç', en: 'Open PDF Converter' },

    'home.card.planner.tag': { tr: '02 — Planlama', en: '02 — Plan' },
    'home.card.planner.title': { tr: 'Ders Planlayıcı', en: 'Course Planner' },
    'home.card.planner.desc': {
      tr: 'Dönemlerinizi sürükle-bırakla düzenleyin, ders ekleyin ve kümülatif ortalamanızı anlık izleyin. Değişiklikleriniz otomatik kaydedilir.',
      en: 'Arrange your terms with drag-and-drop, add courses, and track your cumulative GPA live. Your changes save automatically.'
    },
    'home.card.planner.link': { tr: 'Planlayıcıyı Aç', en: 'Open Planner' },

    'home.card.stats.tag': { tr: '03 — Analiz', en: '03 — Analyze' },
    'home.card.stats.title': { tr: 'Akademik Analitik', en: 'Academic Analytics' },
    'home.card.stats.desc': {
      tr: 'Performans trendinizi, not dağılımınızı, en zorlandığınız dersleri ve mezuniyet ortalaması simülasyonunu grafiklerle görün.',
      en: 'See your performance trend, grade distribution, toughest courses and a graduation GPA simulator, all in charts.'
    },
    'home.card.stats.link': { tr: 'Analitiği Aç', en: 'Open Analytics' },

    /* ---- Landing: özellikler şeridi ---- */
    'home.features.eyebrow': { tr: 'Neden Bu Araç', en: 'Why This Tool' },
    'home.features.title': { tr: 'Boğaziçili öğrenciler için tasarlandı', en: 'Built for Boğaziçi students' },
    'home.feature1.title': { tr: 'Hızlı ve Otomatik', en: 'Fast & Automatic' },
    'home.feature1.desc': {
      tr: 'Manuel veri girişine son. Yüzlerce satırlık transkript verisi saniyeler içinde analiz edilir.',
      en: 'No more manual entry. Hundreds of lines of transcript data are parsed in seconds.'
    },
    'home.feature2.title': { tr: '%100 Tarayıcıda', en: '100% In-Browser' },
    'home.feature2.desc': {
      tr: 'PDF\'iniz hiçbir sunucuya gönderilmez; okuma, ayrıştırma ve kaydetme dahil her şey kendi cihazınızda çalışır.',
      en: 'Your PDF never leaves your device — reading, parsing and saving all happen locally.'
    },
    'home.feature3.title': { tr: 'Akıllı Ayrıştırma', en: 'Smart Parsing' },
    'home.feature3.desc': {
      tr: 'Withdraw (W), Tekrar (TKR), Yerine Sayılan (YRN) ve Yaz Okulu gibi karmaşık senaryoları otomatik algılar.',
      en: 'Automatically detects complex cases like Withdraw (W), retakes, substitutions and summer school.'
    },
    'home.feature4.title': { tr: 'Gerçek Zamanlı Analiz', en: 'Real-Time Analysis' },
    'home.feature4.desc': {
      tr: 'GPA, SPA ve kredi hesaplamaları her değişiklikte anında güncellenir; hiçbir şeyi manuel hesaplamazsınız.',
      en: 'GPA, term average and credit totals update instantly with every change — no manual math.'
    },

    /* ---- Landing: kampüs bölümü ---- */
    'home.campus.eyebrow': { tr: 'Güney Kampüs, İstanbul', en: 'South Campus, Istanbul' },
    'home.campus.title': { tr: 'Boğaz\'ın kıyısında, 1863\'ten beri', en: 'On the Bosphorus, since 1863' },
    'home.campus.desc': {
      tr: 'Bu araç resmi bir üniversite ürünü değildir; Boğaziçili bir öğrenci tarafından, kampüsün gündelik akademik ihtiyaçlarını kolaylaştırmak için geliştirildi.',
      en: 'This tool is not an official university product; it was built by a Boğaziçi student to simplify everyday academic needs on campus.'
    },

    /* ---- Landing: kapanış CTA ---- */
    'home.closing.title': { tr: 'Transkriptiniz elinizin altında.', en: 'Your transcript, ready when you are.' },
    'home.closing.desc': {
      tr: 'PDF\'inizi yükleyin, geri kalanını biz halledelim.',
      en: 'Upload your PDF, and let the rest take care of itself.'
    },

    /* ---- Planlayıcı sayfası ---- */
    'planner.title': { tr: 'Ders Planlayıcı', en: 'Course Planner' },
    'planner.empty.title': { tr: 'Henüz ders eklenmemiş.', en: 'No courses added yet.' },
    'planner.empty.desc': {
      tr: 'Transkript PDF\'inizi dönüştürerek tüm derslerinizi tek seferde aktarabilir ya da dönem kartındaki "Ders Ekle" butonuyla elle başlayabilirsiniz. Yaptığınız her değişiklik tarayıcınıza otomatik kaydedilir.',
      en: 'Import your transcript PDF to bring in all your courses at once, or start manually with the "Add Course" button on a term card. Every change is saved to your browser automatically.'
    },
    'planner.empty.cta': { tr: 'PDF\'den Aktar', en: 'Import from PDF' },
    'planner.addSemester': { tr: 'Dönem Ekle', en: 'Add Term' },
    'planner.gpa': { tr: 'GPA', en: 'GPA' },
    'planner.totalCredit': { tr: 'Toplam Kredi', en: 'Total Credit' },
    'planner.attempted': { tr: 'Denenen', en: 'Attempted' },
    'planner.completed': { tr: 'Tamamlanan', en: 'Completed' },
    'planner.save': { tr: 'Yedek İndir', en: 'Download Backup' },
    'planner.load': { tr: 'Yedekten Yükle', en: 'Load Backup' },

    /* ---- Planlayıcı: editör (app.js tarafından okunur) ---- */
    'editor.status.taken': { tr: 'Alındı', en: 'Taken' },
    'editor.status.repeatedWith': { tr: 'Tekrar (Yerine)', en: 'Retake (Substitutes)' },
    'editor.status.notTaken': { tr: 'Çekildi (W)', en: 'Withdrawn (W)' },
    'editor.status.nonCredit': { tr: 'Kredisiz', en: 'Non-Credit' },
    'editor.lessonPlaceholder': { tr: 'Ders kodu (örn. CMPE 150)', en: 'Course code (e.g. CMPE 150)' },
    'editor.lessonTitle': { tr: 'Ders kodu / adı', en: 'Course code / name' },
    'editor.statusTitle': { tr: 'Ders durumu', en: 'Course status' },
    'editor.repeatTitle': { tr: 'Hangi dersin yerine sayılıyor?', en: 'Which course does this substitute?' },
    'editor.repeatEmpty': { tr: '— yerine geçtiği ders —', en: '— course it substitutes —' },
    'editor.gradeTitle': { tr: 'Not', en: 'Grade' },
    'editor.creditTitle': { tr: 'Kredi', en: 'Credit' },
    'editor.creditPlaceholder': { tr: 'Kr', en: 'Cr' },
    'editor.deleteCourse': { tr: 'Dersi sil', en: 'Delete course' },
    'editor.dragCourse': { tr: 'Sürükleyerek taşı', en: 'Drag to reorder' },
    'editor.dragSemester': { tr: 'Dönemi sürükleyerek sırala', en: 'Drag to reorder term' },
    'editor.semNameTitle': { tr: 'Dönem adını düzenlemek için tıklayın', en: 'Click to edit term name' },
    'editor.spa': { tr: 'SPA', en: 'Term Avg' },
    'editor.spaTitle': { tr: 'Bu dönemin not ortalaması', en: "This term's average" },
    'editor.gpaTitle': { tr: 'Bu dönem sonundaki kümülatif ortalama', en: 'Cumulative GPA as of this term' },
    'editor.detail': { tr: 'Denenen {a} · Tamamlanan {c}', en: 'Attempted {a} · Completed {c}' },
    'editor.deleteSemester': { tr: 'Dönemi sil', en: 'Delete term' },
    'editor.addCourse': { tr: 'Ders Ekle', en: 'Add Course' },
    'editor.unplaced': { tr: 'Yerleştirilmemiş Dersler', en: 'Unplaced Courses' },
    'editor.defaultSemester': { tr: 'Dönem', en: 'Term' },
    'editor.fallTerm': { tr: 'Güz Dönemi', en: 'Fall Term' },
    'editor.springTerm': { tr: 'Bahar Dönemi', en: 'Spring Term' },
    'editor.confirmDeleteSemTitle': { tr: 'Dönemi sil', en: 'Delete term' },
    'editor.confirmDeleteSemMsg': {
      tr: '"{name}" dönemi ve içindeki {count} ders silinecek. Bu işlem geri alınamaz.',
      en: 'The term "{name}" and its {count} course(s) will be deleted. This cannot be undone.'
    },
    'editor.confirmDelete': { tr: 'Sil', en: 'Delete' },
    'editor.autosaveSaved': { tr: 'Kaydedildi {time}', en: 'Saved {time}' },
    'editor.autosaveFailed': { tr: 'Kaydedilemedi', en: 'Save failed' },
    'editor.toastBackup': { tr: 'JSON yedeği indirildi.', en: 'JSON backup downloaded.' },
    'editor.toastFileError': { tr: 'Dosya okunamadı: geçerli bir JSON değil.', en: 'Could not read file: not a valid JSON.' },
    'editor.toastInvalidBackup': { tr: 'Geçersiz dosya biçimi: bu bir GPA yedeği değil.', en: 'Invalid file format: this is not a GPA backup.' },
    'editor.toastRestored': { tr: 'Yedek geri yüklendi.', en: 'Backup restored.' },
    'editor.confirmRestoreTitle': { tr: 'Yedeği geri yükle', en: 'Restore backup' },
    'editor.confirmRestoreMsg': {
      tr: 'Yedek dosyası mevcut planınızın üzerine yazılacak. Devam edilsin mi?',
      en: 'The backup file will overwrite your current plan. Continue?'
    },
    'editor.confirmOverwrite': { tr: 'Üzerine Yaz', en: 'Overwrite' },
    'editor.cancel': { tr: 'Vazgeç', en: 'Cancel' },

    /* ---- PDF yükleme sayfası ---- */
    'upload.title': { tr: 'Transkriptinizi Saniyeler İçinde Aktarın', en: 'Import Your Transcript in Seconds' },
    'upload.lead': {
      tr: 'PDF formatındaki not döküm belgenizi bırakın; dersleriniz, notlarınız ve dönemleriniz otomatik olarak tanınıp doğrudan Ders Planlayıcı\'ya aktarılsın. Tüm işlem tarayıcınızda gerçekleşir — dosyanız cihazınızdan hiç çıkmaz.',
      en: 'Drop your PDF transcript; your courses, grades and terms are recognized automatically and imported straight into the Course Planner. Everything happens in your browser — your file never leaves your device.'
    },
    'upload.dropText': { tr: 'PDF dosyasını buraya bırakın', en: 'Drop your PDF file here' },
    'upload.dropSubtext': { tr: 'veya seçmek için tıklayın — dönüştürme otomatik başlar', en: 'or click to choose — conversion starts automatically' },
    'upload.feature1.title': { tr: 'Hızlı ve Otomatik', en: 'Fast & Automatic' },
    'upload.feature1.desc': {
      tr: 'Manuel veri girişine son. PDF dosyanızdaki yüzlerce satır veri saniyeler içinde analiz edilir, planlayıcıya ve istatistiklere anında yansır.',
      en: 'No more manual entry. Hundreds of lines in your PDF are analyzed in seconds and reflected instantly in the planner and analytics.'
    },
    'upload.feature2.title': { tr: '%100 Tarayıcıda', en: '100% In-Browser' },
    'upload.feature2.desc': {
      tr: 'PDF\'iniz hiçbir sunucuya gönderilmez; okuma, ayrıştırma ve kaydetme dahil her şey kendi cihazınızda çalışır.',
      en: 'Your PDF never leaves your device — reading, parsing and saving all happen locally.'
    },
    'upload.feature3.title': { tr: 'Akıllı Ayrıştırma', en: 'Smart Parsing' },
    'upload.feature3.desc': {
      tr: 'Withdraw (W), Tekrar (TKR), Yerine Sayılan (YRN) ve Yaz Okulu gibi karmaşık akademik senaryoları otomatik algılar.',
      en: 'Automatically detects complex academic cases like Withdraw (W), retakes, substitutions and summer school.'
    },

    /* ---- PDF yükleme: akış mesajları (upload.js) ---- */
    'upload.status.reading': { tr: 'PDF okunuyor…', en: 'Reading PDF…' },
    'upload.status.parsing': { tr: 'Transkript ayrıştırılıyor…', en: 'Parsing transcript…' },
    'upload.status.success': {
      tr: '{n} ders, {m} dönem aktarıldı ve tarayıcınıza kaydedildi.',
      en: '{n} courses across {m} terms imported and saved to your browser.'
    },
    'upload.status.readError': {
      tr: 'PDF okunamadı. Dosyanın resmi transkript PDF\'i olduğundan emin olun.',
      en: 'Could not read the PDF. Make sure the file is an official transcript PDF.'
    },
    'upload.status.noCourses': {
      tr: 'Transkriptte ders bulunamadı. Dosyanın resmi Boğaziçi not döküm belgesi (PDF) olduğundan emin olun.',
      en: 'No courses found in the transcript. Make sure the file is an official Boğaziçi transcript (PDF).'
    },
    'upload.status.cancelled': {
      tr: 'İşlem iptal edildi. Mevcut verileriniz korundu.',
      en: 'Cancelled. Your existing data was kept.'
    },
    'upload.status.saveFailed': {
      tr: 'Tarayıcı kaydı yapılamadı (gizli mod olabilir). JSON yedeği indirildi; Planlayıcı\'daki "Yedekten Yükle" butonuyla açabilirsiniz.',
      en: 'Could not save to the browser (possibly private mode). A JSON backup was downloaded; open it with "Load Backup" in the Planner.'
    },
    'upload.libNotLoaded': { tr: 'PDF kütüphanesi yüklenemedi. Sayfayı yenileyin.', en: 'PDF library failed to load. Please refresh the page.' },
    'upload.fileReadError': { tr: 'Dosya okunamadı.', en: 'Could not read the file.' },
    'upload.action.openPlanner': { tr: 'Planlayıcıyı Aç', en: 'Open Planner' },
    'upload.action.openStats': { tr: 'İstatistikleri Gör', en: 'View Analytics' },
    'upload.action.backup': { tr: 'Ayrıca JSON yedeği indir', en: 'Also download a JSON backup' },
    'upload.confirm.overwriteTitle': { tr: 'Mevcut planın üzerine yaz', en: 'Overwrite current plan' },
    'upload.confirm.overwriteMsg': {
      tr: 'Kayıtlı bir planınız zaten var. Yeni transkript verisiyle üzerine yazılsın mı?',
      en: 'You already have a saved plan. Overwrite it with the new transcript data?'
    },
    'upload.confirm.overwriteBtn': { tr: 'Üzerine Yaz', en: 'Overwrite' },
    'upload.confirm.cancelBtn': { tr: 'Vazgeç', en: 'Cancel' },
    'upload.toast.notPdf': { tr: 'Lütfen bir PDF dosyası seçin.', en: 'Please choose a PDF file.' },
    'upload.toast.backup': { tr: 'JSON yedeği indirildi.', en: 'JSON backup downloaded.' },
    'upload.selectedFile': { tr: 'Seçilen: {name}', en: 'Selected: {name}' },

    /* ---- İstatistik sayfası ---- */
    'stats.title': { tr: 'Akademik Analitik Paneli', en: 'Academic Analytics Dashboard' },
    'stats.lead': { tr: 'Notlarınızı analiz edin, performans trendlerinizi görün ve akademik gelişiminizi takip edin.', en: 'Analyze your grades, see performance trends, and track your academic progress.' },
    'stats.empty.title': { tr: 'Henüz analiz edilecek veri yok', en: 'No data to analyze yet' },
    'stats.empty.desc': {
      tr: 'Transkriptinizi aktarın ya da planlayıcıda derslerinizi girin; bu sayfa verilerinizi otomatik olarak yükler.',
      en: 'Import your transcript or enter your courses in the planner; this page loads your data automatically.'
    },
    'stats.empty.cta1': { tr: 'PDF\'den Aktar', en: 'Import from PDF' },
    'stats.empty.cta2': { tr: 'Planlayıcıyı Aç', en: 'Open Planner' },
    'stats.uploadLabel': { tr: 'JSON Yedeği Yükle', en: 'Load JSON Backup' },
    'stats.uploadInfo': { tr: 'Verileriniz Ders Planlayıcı\'dan otomatik yüklenir; dilerseniz bir JSON yedeğini de analiz edebilirsiniz.', en: 'Your data loads automatically from the Course Planner; you can also analyze a JSON backup file.' },

    /* ---- İstatistik: grafik kartı başlıkları ve rozetleri ---- */
    'stats.chart.trend.title': { tr: 'Akademik Performans Trendi (SPA vs Kümülatif GPA)', en: 'Academic Performance Trend (Term Avg vs Cumulative GPA)' },
    'stats.chart.trend.badge': { tr: 'Zaman Serisi', en: 'Time Series' },
    'stats.chart.gradeDistSem.title': { tr: 'Dönemlere Göre Not Dağılımı', en: 'Grade Distribution by Term' },
    'stats.chart.gradeDistSem.badge': { tr: 'Performans Haritası', en: 'Performance Map' },
    'stats.chart.gradeDistSem.desc': { tr: 'Dönem başına aldığınız harf notlarının (AA, BB, FF vb.) dağılımını gösterir. Hangi dönemlerde belirli notların yığıldığını analiz etmenizi sağlar.', en: 'Shows the distribution of your letter grades (AA, BB, FF, etc.) per term, so you can see where specific grades cluster.' },
    'stats.chart.improvement.title': { tr: 'Dönemler Arası Değişim', en: 'Term-over-Term Change' },
    'stats.chart.improvement.badge': { tr: 'Momentum', en: 'Momentum' },
    'stats.chart.improvement.desc': { tr: 'Bir önceki döneme göre not ortalamanızdaki (SPA) artış veya azalışı gösterir. Yeşil çubuklar iyileşmeyi, kırmızılar düşüşü temsil eder.', en: 'Shows the rise or fall in your term average versus the previous term. Green bars mean improvement, red bars a decline.' },
    'stats.chart.volatility.title': { tr: 'Performans Stabilitesi', en: 'Performance Stability' },
    'stats.chart.volatility.badge': { tr: 'Risk Analizi', en: 'Risk Analysis' },
    'stats.chart.volatility.desc': { tr: 'Notlarınızın standart sapmasıdır (Volatilite). Yüksek çubuklar, aynı dönem içinde hem çok yüksek hem çok düşük notlar aldığınızı (dengesiz performans) gösterir.', en: 'The standard deviation of your grades (volatility). Tall bars mean you had both very high and very low grades in the same term (uneven performance).' },
    'stats.chart.repeated.title': { tr: 'En Çok Tekrar Edilen Dersler', en: 'Most Repeated Courses' },
    'stats.chart.repeated.badge': { tr: 'Tekrar Sayısı', en: 'Repeat Count' },
    'stats.chart.repeated.desc': { tr: 'Eğitim hayatınız boyunca birden fazla kez aldığınız dersleri ve kaç kez tekrar ettiğinizi listeler.', en: 'Lists the courses you took more than once and how many times you repeated each.' },
    'stats.chart.withdrawals.title': { tr: 'Dönemlere Göre Çekilen Dersler', en: 'Withdrawals by Term' },
    'stats.chart.withdrawals.badge': { tr: 'Bırakılanlar', en: 'Withdrawn' },
    'stats.chart.withdrawals.desc': { tr: 'Her dönem kaç dersten çekildiğinizi (W) gösterir. Akademik planlamadaki sapmaları işaret eder.', en: 'Shows how many courses you withdrew from (W) each term, flagging deviations in academic planning.' },
    'stats.chart.difficulty.title': { tr: 'En Zor Dersler (Min. Ort.)', en: 'Toughest Courses (Min. Avg)' },
    'stats.chart.difficulty.badge': { tr: 'Zorluk', en: 'Difficulty' },
    'stats.chart.difficulty.desc': { tr: 'Tekrar edilen dersler dahil, ortalama notunuzun en düşük olduğu derslerdir. Akademik olarak en çok zorlandığınız alanları gösterir.', en: 'The courses where your average grade is lowest (retakes included) — the areas you struggled with most.' },
    'stats.chart.mastery.title': { tr: 'En Güçlü Dersler (Max. Ort.)', en: 'Strongest Courses (Max. Avg)' },
    'stats.chart.mastery.badge': { tr: 'Ustalık', en: 'Mastery' },
    'stats.chart.mastery.desc': { tr: 'Ortalama notunuzun en yüksek olduğu derslerdir. En başarılı olduğunuz ve yetkinlik kazandığınız konuları yansıtır.', en: 'The courses where your average grade is highest — the subjects you excelled at.' },
    'stats.chart.gradeDist.title': { tr: 'Genel Not Dağılımı', en: 'Overall Grade Distribution' },
    'stats.chart.gradeDist.badge': { tr: 'Toplam', en: 'Total' },
    'stats.chart.gradeDist.desc': { tr: 'Tüm eğitim hayatınız boyunca aldığınız harf notlarının genel oransal dağılımını gösteren pasta grafiği.', en: 'A pie chart of the overall proportion of every letter grade you have earned.' },
    'stats.chart.creditStatus.title': { tr: 'Duruma Göre Krediler', en: 'Credits by Status' },
    'stats.chart.creditStatus.badge': { tr: 'Genel Bakış', en: 'Overview' },
    'stats.chart.creditStatus.desc': { tr: 'Toplam kredi yükünüzün ne kadarının başarılı (Alındı), tekrar edilen veya çekilen derslerden oluştuğunu gösterir.', en: 'Shows how much of your total credit load comes from taken, repeated or withdrawn courses.' },
    'stats.chart.correlation.title': { tr: 'Kredi Yükü vs Başarı Korelasyonu', en: 'Credit Load vs Success Correlation' },
    'stats.chart.correlation.badge': { tr: 'Regresyon', en: 'Regression' },
    'stats.chart.seasonal.title': { tr: 'Mevsimsel Performans ve Yük Analizi', en: 'Seasonal Performance & Load Analysis' },
    'stats.chart.seasonal.badge': { tr: 'Sezonluk Trend', en: 'Seasonal Trend' },
    'stats.waiting': { tr: 'Veri bekleniyor…', en: 'Waiting for data…' },

    /* ---- İstatistik: simülatör ---- */
    'stats.sim.title': { tr: 'Mezuniyet Ortalaması Simülatörü', en: 'Graduation GPA Simulator' },
    'stats.sim.credits': { tr: 'Mezuniyet İçin Gerekli Toplam Kredi', en: 'Total Credits Required to Graduate' },
    'stats.sim.target': { tr: 'Kalan Dersler İçin Hedef Not', en: 'Target Grade for Remaining Courses' },
    'stats.sim.resultLabel': { tr: 'Tahmini Mezuniyet Ortalaması', en: 'Projected Graduation GPA' },
    'stats.sim.remaining': { tr: 'Kalan Kredi: {n}', en: 'Remaining Credit: {n}' },
    'stats.sim.done': { tr: 'Tebrikler! Mezuniyet kredisini zaten tamamladınız.', en: 'Congratulations! You have already completed the graduation credits.' },
    'stats.sim.projection': { tr: 'Kalan {n} kredinin hepsini {g} alırsanız.', en: 'If you get {g} in all {n} remaining credits.' },

    /* ---- İstatistik: üretilen metinler (stats.js) ---- */
    'stats.info.auto': { tr: 'Kayıtlı verileriniz otomatik yüklendi ({s} dönem, {c} ders). Planlayıcı\'daki değişiklikler buraya otomatik yansır.', en: 'Your saved data loaded automatically ({s} terms, {c} courses). Changes in the Planner appear here automatically.' },
    'stats.info.file': { tr: '{s} dönem, {c} ders yüklendi. Analiz başlatıldı.', en: '{s} terms, {c} courses loaded. Analysis started.' },
    'stats.toast.parseError': { tr: 'Dosya çözümlenemedi: {msg}', en: 'Could not parse file: {msg}' },
    'stats.card.cumGpa': { tr: 'Kümülatif GPA', en: 'Cumulative GPA' },
    'stats.card.cumGpaDesc': { tr: 'Mevcut Durum', en: 'Current Status' },
    'stats.card.nextSpa': { tr: 'Tahmini Sonraki SPA', en: 'Projected Next Term Avg' },
    'stats.card.nextSpaDesc': { tr: 'Trend Bazlı Tahmin', en: 'Trend-Based Estimate' },
    'stats.card.bestSpa': { tr: 'En Yüksek SPA', en: 'Highest Term Avg' },
    'stats.card.bestSpaDesc': { tr: 'Kişisel Rekor', en: 'Personal Best' },
    'stats.card.totalW': { tr: 'Toplam Çekilen Ders', en: 'Total Withdrawals' },
    'stats.card.totalWDesc': { tr: 'Bırakılan (Withdraw)', en: 'Withdrawn (W)' },
    'stats.ds.avgSpa': { tr: 'Ortalama SPA', en: 'Average Term GPA' },
    'stats.ds.avgLoad': { tr: 'Ortalama Kredi Yükü', en: 'Average Credit Load' },
    'stats.axis.spa': { tr: 'Not Ortalaması (SPA)', en: 'Term Average (GPA)' },
    'stats.axis.load': { tr: 'Kredi Yükü', en: 'Credit Load' },
    'stats.ds.termSpa': { tr: 'Dönemlik SPA', en: 'Term GPA' },
    'stats.ds.cumGpa': { tr: 'Kümülatif GPA', en: 'Cumulative GPA' },
    'stats.ds.trend': { tr: 'Trend', en: 'Trend' },
    'stats.ds.spaChange': { tr: 'SPA Değişimi', en: 'Term GPA Change' },
    'stats.ds.stdDev': { tr: 'Std Sapma (Not Dalgalanması)', en: 'Std Dev (Grade Volatility)' },
    'stats.ds.repeatCount': { tr: 'Tekrar Sayısı', en: 'Repeat Count' },
    'stats.ds.withdrawCount': { tr: 'Çekilen Ders Sayısı', en: 'Withdrawn Courses' },
    'stats.ds.avgGrade': { tr: 'Ortalama Not', en: 'Average Grade' },
    'stats.ds.termsLoadVsSuccess': { tr: 'Dönemler (Yük vs Başarı)', en: 'Terms (Load vs Success)' },
    'stats.axis.creditsTaken': { tr: 'Alınan Kredi (Yük)', en: 'Credits Taken (Load)' },
    'stats.seasonal.insufficient': { tr: 'Veri yeterli değil.', en: 'Not enough data.' },
    'stats.seasonal.insight': {
      tr: '<strong>Başarı Analizi:</strong> En yüksek not ortalamasına (Ort. {spa}) genellikle <strong>{sSeason}</strong> dönemlerinde ulaşıyorsunuz.<br><strong>Yük Analizi:</strong> En yoğun kredi yükünü (Ort. {load} kredi) <strong>{lSeason}</strong> dönemlerinde alıyorsunuz.',
      en: '<strong>Success:</strong> You reach your highest term average (avg. {spa}) most often in <strong>{sSeason}</strong> terms.<br><strong>Load:</strong> You take your heaviest credit load (avg. {load} credits) in <strong>{lSeason}</strong> terms.'
    },
    'stats.trend.slope': { tr: 'Trend Eğimi: {m} puan/dönem.', en: 'Trend slope: {m} points/term.' },
    'stats.trend.positive': { tr: 'Pozitif Momentum! {slope}', en: 'Positive momentum! {slope}' },
    'stats.trend.negative': { tr: 'Stabilize veya Düşüş Eğilimi. {slope}', en: 'Stable or declining trend. {slope}' },
    'stats.corr.none': { tr: 'Kredi yükü ile notlar arasında anlamlı bir bağlantı yok.', en: 'No meaningful link between credit load and grades.' },
    'stats.corr.negative': { tr: 'Dikkat: Daha fazla kredi almak SPA\'nızı düşürme eğiliminde.', en: 'Note: taking more credits tends to lower your term average.' },
    'stats.corr.positive': { tr: 'Daha yüksek kredi yüklerinde daha iyi performans gösteriyorsunuz.', en: 'You perform better under heavier credit loads.' },
    'stats.corr.result': { tr: 'Korelasyon Katsayısı: {c}. {msg}', en: 'Correlation coefficient: {c}. {msg}' }
  };

  function getLang() {
    var stored;
    try { stored = global.localStorage.getItem(LANG_KEY); } catch (e) {}
    if (stored === 'tr' || stored === 'en') return stored;
    return (global.navigator && /^tr/i.test(global.navigator.language)) ? 'tr' : 'tr';
  }

  var currentLang = getLang();
  var listeners = [];

  function t(key) {
    var entry = DICT[key];
    if (!entry) return key;
    return entry[currentLang] || entry.tr || key;
  }

  function applyToDom() {
    document.documentElement.setAttribute('lang', currentLang);

    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var key = node.getAttribute('data-i18n');
      var text = t(key);
      if (node.hasAttribute('data-i18n-html')) node.innerHTML = text;
      else node.textContent = text;
    }

    var attrNodes = document.querySelectorAll('[data-i18n-attr]');
    for (var j = 0; j < attrNodes.length; j++) {
      var aNode = attrNodes[j];
      var pairs = aNode.getAttribute('data-i18n-attr').split(',');
      for (var k = 0; k < pairs.length; k++) {
        var pair = pairs[k].split(':');
        if (pair.length !== 2) continue;
        aNode.setAttribute(pair[0].trim(), t(pair[1].trim()));
      }
    }

    var langBtn = document.getElementById('lang-toggle');
    if (langBtn) langBtn.textContent = currentLang === 'tr' ? 'EN' : 'TR';
  }

  function setLang(lang) {
    if (lang !== 'tr' && lang !== 'en') return;
    currentLang = lang;
    try { global.localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    applyToDom();
    listeners.forEach(function (fn) { try { fn(lang); } catch (e) {} });
    var evt;
    try {
      evt = new CustomEvent('gpa:langchange', { detail: { lang: lang } });
    } catch (e) {
      evt = document.createEvent('CustomEvent');
      evt.initCustomEvent('gpa:langchange', false, false, { lang: lang });
    }
    global.dispatchEvent(evt);
  }

  function toggleLang() {
    setLang(currentLang === 'tr' ? 'en' : 'tr');
  }

  function onChange(fn) {
    if (typeof fn === 'function') listeners.push(fn);
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyToDom();
    var btn = document.getElementById('lang-toggle');
    if (btn) btn.addEventListener('click', toggleLang);
  });

  global.GPAI18N = {
    t: t,
    lang: function () { return currentLang; },
    set: setLang,
    toggle: toggleLang,
    onChange: onChange,
    refresh: applyToDom
  };
})(window);
