🎓 Boğaziçi Transcript Parser & Academic Planner
Boğaziçi Üniversitesi öğrencileri için geliştirilmiş; resmi not döküm belgesini (PDF) analiz eden, interaktif bir ders planlama arayüzü sunan ve detaylı akademik performans istatistikleri çıkaran açık kaynaklı bir web aracıdır.

🌟 Özellikler
Bu proje üç ana modülden oluşur:

1. PDF Parser (Dönüştürücü)
Otomatik Ayrıştırma: Resmi PDF transkriptini okur ve Regex algoritmalarıyla dersleri, notları, kredileri ve dönemleri ayrıştırır.

Akıllı Algılama:

Withdraw (W), Repeated (TKR) ve Yerine Sayılan (YRN) dersleri otomatik tanır.

Yaz okulu ve dönem isimlerini (Güz/Bahar) dinamik olarak algılar.

JSON Çıktısı: Veriyi diğer modüllerde kullanılmak üzere yapılandırılmış .json formatına çevirir.

2. Magnetic Grid Editörü (Ders Planlayıcı)
Sürükle & Bırak Arayüzü: Dersleri dönemler arasında "manyetik" kartlar şeklinde taşıyabilirsiniz.

Canlı Hesaplama: Kartların yeri değiştikçe Dönemlik (SPA) ve Kümülatif (GPA) ortalamalar anlık olarak güncellenir.

Dinamik Yapı: Yeni dönem ekleme, silme ve ders statüsü (Tekrar, W vb.) değiştirme imkanı sunar.

3. Gelişmiş İstatistik Paneli
Veri Görselleştirme: Chart.js altyapısı ile 12 farklı grafik türü.

Trend Analizi: Akademik başarının yönünü (Yükseliş/Düşüş) ve regresyon analizini gösterir.

Mevsimsel Analiz: Hangi dönemlerde (Güz/Bahar/Yaz) daha başarılı olduğunuzu ve kredi yükü kaldırma kapasitenizi ölçer.

Mezuniyet Simülatörü: Kalan krediler ve hedeflenen notlarla tahmini mezuniyet ortalamasını hesaplar.

🚀 Kurulum ve Çalıştırma
Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

Gereksinimler
Python 3.x

Flask

Adım 1: Depoyu Klonlayın veya İndirin
Dosyaları bir klasöre çıkarın.

Adım 2: Gerekli Kütüphaneleri Yükleyin
Terminal veya komut satırında proje dizinine gidip şunu çalıştırın:

Bash

pip install flask flask-cors
Adım 3: Backend Sunucusunu Başlatın
PDF işleme motorunu (Python) ayağa kaldırın:

Bash

python txt-json.py
Sunucu http://localhost:5000 adresinde çalışmaya başlayacaktır.

Adım 4: Uygulamayı Kullanın
Tarayıcınızda index.html dosyasını açın.

📖 Kullanım Kılavuzu
Veri Dönüştürme:

index.html sayfasını açın.

Transkript PDF dosyanızı sürükleyip bırakın.

Oluşturulan lessons_and_grids.json dosyasını indirin.

Planlama:

Üst menüden Grid Editörü'ne gidin.

"Yükle" butonuna basarak indirdiğiniz JSON dosyasını seçin.

Derslerinizi düzenleyin, senaryolar oluşturun ve "Kaydet" ile güncel halini saklayın.

Analiz:

Üst menüden İstatistikler sayfasına gidin (veya statistics.html).

JSON dosyanızı yükleyin.

Akademik hayatınızla ilgili detaylı grafikleri ve simülasyonları inceleyin.

📂 Proje Yapısı
├── txt-json.py          # Flask Backend (PDF Parsing Logic)
├── index.html           # Landing Page & PDF Upload UI
├── magnetic-grid.html   # Sürükle-Bırak Ders Planlayıcı
├── statistics.html      # İstatistik ve Simülasyon Paneli
├── style.css            # Grid Editörü Stilleri
├── app.js               # Grid Editörü Mantığı
└── README.md            # Proje Dokümantasyonu
🛡️ Gizlilik ve Güvenlik
Bu proje tamamen Client-Side (İstemci Taraflı) ve Localhost üzerinde çalışır. Yüklediğiniz PDF dosyaları ve kişisel verileriniz hiçbir harici sunucuya veya veritabanına gönderilmez/kaydedilmez. Tüm işlemler kendi bilgisayarınızda gerçekleşir.

🤝 Katkıda Bulunma
Projeyi geliştirmek isterseniz Pull Request gönderebilir veya Issue açabilirsiniz. Özellikle farklı transkript formatları (örneğin Erasmus dönemleri) için regex geliştirmeleri memnuniyetle karşılanır.

📄 Lisans
Bu proje MIT License altında lisanslanmıştır.

Geliştirici: Yunus Eren Bayrak