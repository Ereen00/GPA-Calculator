# 🎓 Boğaziçi GPA — Akademik Planlayıcı

Boğaziçi Üniversitesi öğrencileri için geliştirilmiş açık kaynaklı bir akademik araç: resmi not döküm belgesini (PDF) otomatik ayrıştırır, sürükle-bırak destekli bir ders planlama arayüzü sunar ve detaylı akademik performans istatistikleri çıkarır.

**Tamamen istemci tarafında çalışır** — sunucu, veritabanı veya hesap yoktur. PDF'iniz cihazınızdan hiç çıkmaz; veriler yalnızca kendi tarayıcınızda saklanır ve tüm sayfalar arasında otomatik paylaşılır.

**Tasarım:** Boğaziçi Üniversitesi kimliğiyle (logo laciverti + Boğaz mavisi) yeniden tasarlanmış, tanıtım sayfası öncülüğünde bir arayüz. Başlıklarda akademik serif (EB Garamond), gövdede Inter; ikonlar satır içi SVG'dir (emoji kullanılmaz). Kampüs görselleri `assets/` klasöründedir.

**Çift dil (TR/EN):** Navbar'daki dil düğmesiyle Türkçe/İngilizce arasında geçiş yapılır; seçim hatırlanır. Çeviri katmanı `i18n.js` içindedir (`data-i18n` öznitelikleri + JS ile üretilen metinler). Grafik etiketleri dahil tüm arayüz dile uyum sağlar.

**Karanlık mod:** Navbar'daki tema düğmesiyle değiştirilebilir; ilk açılışta sistem tercihiniz kullanılır ve seçiminiz hatırlanır. Grafikler dahil tüm arayüz temaya uyum sağlar.

## 🌟 Modüller

### 🏠 Ana Sayfa / Tanıtım (`index.html`)
- Boğaz manzaralı hero, üç aracın (yükleyici, planlayıcı, analitik) bütünleşik tanıtımı ve kampüs bölümü.
- Kaydırmayla belirme animasyonları `prefers-reduced-motion` tercihini destekler; JS çalışmasa bile içerik görünür kalır.

### 📄 Transkript Yükleyici (`pdf_upload.html`)
- Transkript PDF'ini sürükleyip bırakın; dönüştürme otomatik başlar.
- Ayrıştırıcı (`parser.js`) dersleri, notları, kredileri ve dönemleri tarayıcıda tanır.
- Withdraw (W/DÇ), Tekrar (TKR), Yerine Sayılan (YRN), kredisiz dersler (PE vb.), yaz okulu ve devam eden (notu girilmemiş) dönem otomatik algılanır.
- Sonuç doğrudan tarayıcı kaydına (localStorage) yazılır; JSON yedeği indirme isteğe bağlıdır.

### 📅 Ders Planlayıcı (`planner.html`)
- Dönemler kart, dersler satır olarak listelenir; ders sayısı sınırsızdır.
- Dersleri dönemler arasında, dönemleri kronolojik sırada sürükleyip bırakabilirsiniz (mobil uyumlu).
- Dönemlik (SPA) ve kümülatif (GPA) ortalamalar ile denenen/tamamlanan krediler anlık güncellenir.
- Her değişiklik otomatik kaydedilir; "ne olurdu?" senaryolarını güvenle deneyebilirsiniz.

### 📊 Akademik Analitik (`statistics.html`)
- Chart.js ile 12 grafik: performans trendi, not dağılımları, momentum, volatilite, mevsimsel analiz, kredi yükü korelasyonu ve daha fazlası.
- Mezuniyet Ortalaması Simülatörü: kalan krediler ve hedef notla tahmini mezuniyet GPA'sı.
- Veriler planlayıcıdan otomatik yüklenir; eski bir JSON yedeğini de analiz edebilirsiniz.

## 🎯 Hesaplama Kuralları (`gpa.js`)

Resmi Boğaziçi transkript mantığı birebir uygulanır ve gerçek bir transkriptin basılı DNO/GNO değerleriyle doğrulanmıştır:

- Bir ders birden çok kez alındıysa kümülatif ortalamaya yalnızca **son sonuçlanmış** alınışı girer (TKR); YRN derslerde yerine geçtiği ders eşleştirilir.
- Devam eden (notu girilmemiş) veya çekilen (W) bir tekrar, önceki notu **silmez**.
- Teorik saati 0 olan dersler (PE vb.) ve kredisiz dersler ortalamaya girmez.
- F / KL notları FF (0.00) olarak sayılır.

## 🔄 Veri Akışı

```
PDF ──► pdf.js (metin) ──► parser.js (ayrıştırma) ──► tarayıcı localStorage
        └────────── tümü tarayıcıda ──────────┘             │
              ┌─────────────────────────────────────────────┼─────────────┐
              ▼                                             ▼             ▼
        Ders Planlayıcı  ◄────── otomatik senkron ──► İstatistikler   JSON yedeği
                                                                    (isteğe bağlı)
```

## 🚀 Dağıtım ve Yerel Geliştirme

Proje saf statik bir sitedir — Vercel, GitHub Pages veya herhangi bir statik sunucuda yapılandırmasız çalışır.

```bash
# Yerel geliştirme (herhangi bir statik sunucu yeterli):
python -m http.server 8000
# http://localhost:8000
```

## 📂 Proje Yapısı

```
├── index.html         # Ana sayfa / tanıtım (landing)
├── planner.html       # Ders Planlayıcı
├── pdf_upload.html    # Transkript Yükleyici (PDF)
├── statistics.html    # Akademik Analitik Paneli
├── base.css           # Ortak tasarım sistemi (tokenlar, navbar, footer, toast, modal, reveal)
├── home.css           # Ana sayfa (landing) stilleri
├── style.css          # Planlayıcı stilleri
├── upload.css         # Yükleyici stilleri
├── stats.css          # Analitik stilleri
├── app.js             # Planlayıcı mantığı (state tabanlı)
├── upload.js          # Yükleyici mantığı (pdf.js entegrasyonu)
├── stats.js           # Analitik/grafik mantığı
├── parser.js          # GPAParser — transkript metni ayrıştırıcısı
├── gpa.js             # GPACalc — ortalama hesaplama modülü (saf fonksiyonlar)
├── storage.js         # GPAStorage — localStorage veri katmanı
├── i18n.js            # GPAI18N — TR/EN çeviri katmanı
├── ui.js              # GPAUI — tema, toast, onay penceresi, scroll reveal, mobil menü
└── assets/            # Logo, favicon ve kampüs görselleri (WebP)
```

## 🛡️ Gizlilik

- PDF dosyanız **hiçbir sunucuya gönderilmez** — okuma (pdf.js) ve ayrıştırma (parser.js) tamamen tarayıcınızda gerçekleşir.
- Ders verileriniz sadece kendi tarayıcınızın localStorage'ında tutulur; veritabanı, analitik veya üçüncü taraf servis yoktur.
- Dış bağımlılıklar yalnızca CDN'den yüklenen kütüphanelerdir (pdf.js, Chart.js, SortableJS, Inter + EB Garamond fontları).

## 🤝 Katkıda Bulunma

Pull request ve issue'lara açığız. Özellikle farklı transkript biçimleri (ör. Erasmus dönemleri, diğer üniversiteler) için `parser.js` içindeki desenlere katkılar memnuniyetle karşılanır.

## 📄 Lisans

MIT License — Geliştirici: Yunus Eren Bayrak
