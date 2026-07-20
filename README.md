# 🎓 GPA Planlayıcı

Boğaziçi Üniversitesi öğrencileri için geliştirilmiş açık kaynaklı bir akademik araç: resmi not döküm belgesini (PDF) otomatik ayrıştırır, sürükle-bırak destekli bir ders planlama arayüzü sunar ve detaylı akademik performans istatistikleri çıkarır.

**Tamamen istemci tarafında çalışır** — sunucu, veritabanı veya hesap yoktur. PDF'iniz cihazınızdan hiç çıkmaz; veriler yalnızca kendi tarayıcınızda saklanır ve tüm sayfalar arasında otomatik paylaşılır.

## 🌟 Modüller

### 📄 PDF Dönüştürücü (`pdf_upload.html`)
- Transkript PDF'ini sürükleyip bırakın; dönüştürme otomatik başlar.
- Ayrıştırıcı (`parser.js`) dersleri, notları, kredileri ve dönemleri tarayıcıda tanır.
- Withdraw (W/DÇ), Tekrar (TKR), Yerine Sayılan (YRN), kredisiz dersler (PE vb.), yaz okulu ve devam eden (notu girilmemiş) dönem otomatik algılanır.
- Sonuç doğrudan tarayıcı kaydına (localStorage) yazılır; JSON yedeği indirme isteğe bağlıdır.

### 📅 Ders Planlayıcı (`index.html`)
- Dönemler kart, dersler satır olarak listelenir; ders sayısı sınırsızdır.
- Dersleri dönemler arasında, dönemleri kronolojik sırada sürükleyip bırakabilirsiniz (mobil uyumlu).
- Dönemlik (SPA) ve kümülatif (GPA) ortalamalar ile denenen/tamamlanan krediler anlık güncellenir.
- Her değişiklik otomatik kaydedilir; "ne olurdu?" senaryolarını güvenle deneyebilirsiniz.

### 📊 İstatistikler (`statistics.html`)
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
├── index.html         # Ders Planlayıcı (ana sayfa)
├── pdf_upload.html    # PDF Dönüştürücü
├── statistics.html    # İstatistik Paneli
├── base.css           # Ortak tasarım sistemi (tokenlar, navbar, toast, modal)
├── style.css          # Planlayıcı stilleri
├── upload.css         # Dönüştürücü stilleri
├── stats.css          # İstatistik stilleri
├── app.js             # Planlayıcı mantığı (state tabanlı)
├── upload.js          # Dönüştürücü mantığı (pdf.js entegrasyonu)
├── stats.js           # İstatistik/grafik mantığı
├── parser.js          # GPAParser — transkript metni ayrıştırıcısı
├── gpa.js             # GPACalc — ortalama hesaplama modülü (saf fonksiyonlar)
├── storage.js         # GPAStorage — localStorage veri katmanı
└── ui.js              # GPAUI — toast bildirimleri ve onay pencereleri
```

## 🛡️ Gizlilik

- PDF dosyanız **hiçbir sunucuya gönderilmez** — okuma (pdf.js) ve ayrıştırma (parser.js) tamamen tarayıcınızda gerçekleşir.
- Ders verileriniz sadece kendi tarayıcınızın localStorage'ında tutulur; veritabanı, analitik veya üçüncü taraf servis yoktur.
- Dış bağımlılıklar yalnızca CDN'den yüklenen kütüphanelerdir (pdf.js, Chart.js, SortableJS, Inter fontu).

## 🤝 Katkıda Bulunma

Pull request ve issue'lara açığız. Özellikle farklı transkript biçimleri (ör. Erasmus dönemleri, diğer üniversiteler) için `parser.js` içindeki desenlere katkılar memnuniyetle karşılanır.

## 📄 Lisans

MIT License — Geliştirici: Yunus Eren Bayrak
