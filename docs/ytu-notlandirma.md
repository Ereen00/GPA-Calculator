# Yıldız Teknik Üniversitesi — Notlandırma ve Kredi Sistemi

Pilot üniversite spesifikasyonu. Buradaki her kural ya resmî mevzuattan alınmıştır ya da
gerçek bir YTÜ transkriptinin (2023 girişli, Endüstri Müh. İng.) kendi rakamlarıyla
**doğrulanmıştır**. Doğrulama betiği: `docs/ytu-dogrulama.py`.

## 1. Kaynaklar

| Belge | Kaynak |
|---|---|
| YTÜ Önlisans ve Lisans Eğitim-Öğretim Yönetmeliği (RG 19.01.2012 / 28178, Mevzuat No 15812) | <https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=15812&MevzuatTur=8&MevzuatTertip=5> |
| YTÜ Ders Kayıt Esasları (DD-125, 28.08.2025 / 2025-08-20 Senato) | <https://kalite.yildiz.edu.tr/media/files/DD-125-YTÜ%20Ders%20Kayıt%20Esasları.docx> |
| YTÜ Mevzuat dizini | <https://ogi.yildiz.edu.tr/mevzuat> |
| 4'lük ↔ 100'lük dönüşüm (DD-039) | kalite.yildiz.edu.tr → DD-039 |
| Transkript arka yüzü ("Başarı Değerlendirmesine İlişkin Açıklamalar") | Örnek transkript s.1 |

## 2. Harf notları

YTÜ transkriptinin açıklama sayfasında **iki skala birden** basılıdır; ikisi de yürürlüktedir.
Elimizdeki 2023 girişli transkript tamamen **çift harfli** skalayı kullanıyor.

### 2a. Çift harfli skala (klasik — transkriptte fiilen kullanılan)

| Not | Katsayı | Anlam | AGNO'ya girer mi? |
|---|---|---|---|
| AA | 4.00 | Mükemmel | evet |
| BA | 3.50 | Pekiyi | evet |
| BB | 3.00 | İyi | evet |
| CB | 2.50 | Orta | evet |
| CC | 2.00 | Yeterli | evet |
| DC | 1.50 | **Koşullu Başarılı** | evet |
| DD | 1.00 | Başarısız | evet |
| FD | 0.50 | Başarısız | evet |
| FF | 0.00 | Başarısız | evet |
| F0 | — | Devamsız | **bkz. §4 — YANO'ya girer, AGNO'ya girmez** |
| G | — | Geçer | hayır |
| K | — | Kalır | hayır |
| M | — | Muaf | hayır |
| M(i) | — | Muaf (intibak; üniversite dışından alınan ders) | hayır |
| İ | — | İzinli | hayır (bir yarıyıl içinde nota dönüşmezse otomatik FF olur) |
| E | — | Eksik | hayır |

### 2b. Artı/eksili skala (transkript açıklamasında yer alan ikinci skala)

| Not | Katsayı | Anlam |
|---|---|---|
| A | 4.0 | Pekiyi |
| A- | 3.7 | Pekiyi |
| B+ | 3.3 | Pekiyi |
| B | 3.0 | İyi |
| B- | 2.7 | İyi |
| C+ | 2.3 | Orta |
| C | 2.0 | Orta |
| C- | 1.7 | **Koşullu Başarılı** |
| D+ | 1.3 | **Koşullu Başarılı** |
| D | 1.0 | Başarısız |
| F | 0.0 | Başarısız |
| F0 | — | Devamsız |
| G | — | Geçti |

> Ayrıştırıcı iki skalayı da tanımalı. Not tablosu üniversite profiline gömülü olmamalı;
> transkriptte hangi skala görülüyorsa o kullanılmalı (ikisi aynı belgede karışık da görünebilir).

## 3. Başarı / geçme koşulu

- **Başarılı:** AA, BA, BB, CB, CC (yani ≥ 2.00). Artı/eksili skalada C ve üstü.
- **Koşullu başarılı:** DC (1.50). Artı/eksili skalada C- (1.7) ve D+ (1.3).
  DC alan öğrencinin o dersten başarılı sayılması için **AGNO ≥ 2.00** olmalıdır.
- **Başarısız:** DD, FD, FF ve F0.
- Bir dersin başarı değerlendirmesine girebilmek için yüz üzerinden ortalamanın en az 40 olması gerekir (Md. 26/e).
- Başarı notu **bağıl değerlendirme** ile verilir; yarıyıl içi %60 + yarıyıl sonu %40 (Md. 26–27).
- Devam: teorik derslerin %70'i, uygulamaların %80'i (Md. 24). Devamsız kalan → **F0**.

## 4. Ortalama hesabı — AGNO / YANO / ANO

**Kredi tabanı: YEREL KREDİ (AKTS değil).** Transkriptte iki kredi kolonu (Kredi + ECTS)
yan yana durduğu için ayrıştırıcıda yanlış kolonu almak çok kolay. DD-125 Md. 4 net:
*"…tüm derslerin **yerel kredilerine** göre hesaplanan ağırlıklı not ortalaması"*.

Yerel kredi tanımı (Md. 18/ç): teorik dersin haftalık 1 saati = 1 kredi,
uygulama/laboratuvarın haftalık 2 saati = 1 kredi. AKTS ayrı hesaplanır
(yarıyıl başına 30, lisans toplam 240, önlisans 120).

| Ortalama | Kapsam |
|---|---|
| **YANO** | Yarıyıl Ağırlıklı Not Ortalaması — yalnız o yarıyılda alınan dersler |
| **AGNO** | Ağırlıklı Genel Not Ortalaması — hazırlık hariç, alınmış **tüm** dersler; tekrar edilen derste **son not** geçerli |
| **ANO** | Ağırlıklı Not Ortalaması — yalnız öğretim planında **sorumlu olduğu** dersler. İlk %10 sıralamasında kullanılır |

Formül: `Σ(katsayı × yerel kredi) / Σ(yerel kredi)`, virgülden sonra **iki haneye yuvarlanır**.

### Doğrulanmış davranışlar

Örnek transkript üzerinde birebir tutan kurallar:

1. **Yerel kredi = 0 olan dersler ortalamaya hiç girmez** (paya da paydaya da). Türkçe,
   Atatürk İlkeleri, İngilizce Hazırlık ve bazı 0 kredili seçmeliler böyle — not almış olsalar bile.
   Bu kuralla 8 dönemin 8'inde YANO tam tuttu.
2. **Tekrar: yalnız son deneme sayılır.** Transkriptte önceki not `*` ile işaretlenir ama
   AGNO'ya girmez. (Ör. FIZ1001: DD → F0 → FF → CC; AGNO'ya yalnız CC girer.)
3. **F0 asimetrisi (dikkat):**
   - YANO'da F0, **0.00 olarak paya ve paydaya girer**.
     (2024-25 Güz: F0'lı ders dahil 0,74 ✓ / hariç 0,84 ✗)
   - AGNO'da **son notu F0 olan ders tamamen dışlanır**.
     (Dahil 2,35 ✗ / hariç **2,51 ✓**, toplam kredi **92 ✓**)

   Bu, yönetmelik Md. 27/c-4 ("F0 … AGNO hesabına katılır") ile çelişiyor; ama transkriptin
   kendi açıklama tablosunda F0'ın sayısal karşılığı `---` olarak yazılı ve **transkriptteki
   gerçek rakamlar dışlama yönünde**. OBS'in fiilî davranışı budur; uygulamada transkriptle
   uyuşmak esas olduğu için dışlama uygulanmalı.
4. **Tamamlanan yerel kredi** = son notu **DC ve üstü** olan derslerin yerel kredi toplamı
   (koşullu başarılı dahil). Örnekte 82 ✓.

## 5. Ders yükü ve ders alma sınırları (DD-125 Md. 7)

- Bir yarıyılda en fazla **25 yerel kredi**.
- Yerel kredi üzerinden **AGNO ≥ 3.00** olan öğrenciye **28 krediye** kadar verilebilir.
- ÇAP / Yandal / Pedagojik Formasyon öğrencisi, iki programdan birinde AGNO ≥ 3.00 ise
  **31 krediye** kadar alabilir.
- **Ardışık iki yarıyıl AGNO < 2.00** olan öğrenci **üst yarıyıllardan ders alamaz**; bu kural
  **5. yarıyıl başından** itibaren uygulanır (Yönetmelik Md. 28/4, DD-125 Md. 7/5).
- F0 dışında bir başarı notu olan **teorik** dersin tekrarında devam zorunluluğu aranmaz;
  uygulama/laboratuvar içeren derslerde aranır.

## 6. Mezuniyet, dereceler, süre

- **Mezuniyet:** öğretim planındaki tüm dersler + staj + bitirme başarıyla tamamlanmalı,
  minimum **240 AKTS** (önlisans 120) ve **AGNO ≥ 2.00** (Md. 32, DD-125 Md. 9).
  Öğretim planındaki en düşük başarı notu en az "koşullu başarılı" olmalı.
- **Bitirme çalışması alma koşulu:** plandaki toplam kredinin **en az %75'inden** başarılı olmak
  **ve AGNO ≥ 2.00** (Md. 22/b).
- **Onur:** AGNO 3.00–3.49. **Yüksek onur:** AGNO 3.50–4.00 (Md. 32/3).
- **Bütünleme:** koşullu başarılı (DC) ve başarısız dersler için — **F0 hariç** (Md. 30/2).
- **Mezuniyet sınavı:** mezuniyetine en fazla iki dersi kalanlara (Md. 30/3).
- **Önlisans diploması:** 4. yarıyıl sonuna kadar tüm dersler tamam + AGNO ≥ 2.00 (Md. 34).
- **İngilizce hazırlık:** 2 yarıyıl. Yeterlik sınavı notu **AGNO'ya katılmaz**, transkriptte
  yalnız harf olarak gösterilir. Hazırlıkta geçen ilave süre azami süreden sayılmaz.

## 7. Transkript belge biçimi (ayrıştırıcı için)

Belge adı: **"Öğrenci Not Çizelgesi"**, başlıkta "Yıldız Teknik Üniversitesi" + fakülte adı.

**Kritik yapısal fark:** dönemler sayfada **iki sütun yan yana** dizilir (solda Güz, sağda Bahar).
Düz metin çıkarımında iki tablonun satırları **iç içe geçer**. Boğaziçi ayrıştırıcısındaki
"satır satır regex" yaklaşımı burada çalışmaz — pdf.js'ten gelen metin parçalarının
**x koordinatına göre sol/sağ sütuna ayrılması** gerekir (`textContent.items[].transform[4]`).

Kolonlar: `Ders Kodu | D | M | Ders Adı | Ders Türü | Kredi | ECTS | NOT`

- `D` = dersin dili (EN / TR / GR …)
- `M` = ders muafiyeti işareti (boş / M / M(i))
- `Ders Türü` = **Z** (zorunlu) / **S** (seçmeli)
- `Kredi` = yerel kredi → **ortalamada kullanılan kredi budur**
- `ECTS` = AKTS → yalnız mezuniyet toplamı için

Dönem başlığı: `2024-2025 Güz` / `Bahar` / `Yaz`, altında `Durumu : Kayıtlı    YANO: 1,64`
(ondalık ayırıcı **virgül**).

Belge sonunda özet: `Bir Önceki Dönem Ağırlıklı Genel Not Ortalaması`,
`Ağırlıklı Genel Not Ortalaması (AGNO)`, `Ağırlıklı Not Ortalaması (ANO)`,
`Alınan Derslerin Toplam Kredisi`. Sayfa üstünde: `Toplam AKTS Sayısı`,
`Toplam Yerel Kredi Sayısı`, `Tamamlanan AKTS Sayısı`, `Tamamlanan Yerel Kredi Sayısı`.

Tekrar işareti: başarı notunun üzerinde `*`.

Ders kodu deseni: `[A-Z]{2,4}\d{4}` (ATA1031, END3962, MFK4991, TIB1000) —
Boğaziçi'nin `[A-Z]{2,6}\s?\d{2,3}` deseninden farklı, boşluksuz ve 4 haneli.

## 8. Boğaziçi ↔ YTÜ farkları (kod etkisi)

| Konu | Boğaziçi | YTÜ | Etki |
|---|---|---|---|
| Harf skalası | AA…FF, 4.00–0.00 | **Aynı** + FD (0.50) + artı/eksili ikinci skala | `GRADE_MAP`'e FD ve A-/B+ … eklenir |
| Ortalamada kullanılan kredi | Kredi (UK) | **Yerel kredi** (ECTS değil) | Ayrıştırıcıda doğru kolon |
| Tekrar | Son deneme sayılır | **Aynı** | `gpa.js` mantığı korunur |
| Çekilme | W notu var | **W yok** | Durum listesi profile bağlanmalı |
| Devamsızlık | — | **F0**: YANO'ya 0.00 girer, AGNO'dan dışlanır | Hesaplayıcıda yeni durum |
| Koşullu geçme | Yok | **DC** — AGNO ≥ 2.00 şartıyla geçerli | Yeni uyarı/gösterim |
| Ortalamaya girmeyen not | NC, P, RM | **G, K, M, M(i), İ, E** | Profil bazlı liste |
| 0 kredili ders | Ortalama dışı | **Aynı** | Korunur |
| Dönem tipleri | Fall / Spring / Summer | Güz / Bahar / **Yaz** | Aynı yapı |
| Dönem ortalaması adı | SPA | **YANO** | i18n |
| Genel ortalama adı | CGPA | **AGNO** (ayrıca ANO) | i18n |
| Transkript düzeni | Tek sütun | **İki sütun yan yana** | Ayrıştırıcı x-koordinat bazlı olmalı |
| Ders yükü sınırı | — | 25 / 28 (AGNO ≥ 3.00) / 31 (ÇAP) kredi | Planlayıcıda uyarı |
| Onur | — | Onur 3.00–3.49, Yüksek onur 3.50–4.00 | İstatistik sayfasında rozet |
| Mezuniyet | — | AGNO ≥ 2.00 + 240 AKTS | Hedef hesaplayıcı |

## 9. Uygulama durumu

Bu spesifikasyon `uni-ytu.js` (kurallar) ve `parser-ytu.js` (belge okuma) olarak koda geçti.
Ayrıştırıcı, örnek transkriptin 54 dersini elle okunan listeyle birebir üretiyor; hesap motoru
belgede basılı 8 YANO değerini, AGNO'yu (2,51), alınan toplam krediyi (92) ve tamamlanan
yerel krediyi (82) tutturuyor.

Koda geçen kurallar: yerel kredi tabanı, 0 kredili derslerin dışlanması, tekrarda son notun
geçerliliği, F0'ın YANO'ya girip AGNO'dan çıkması, tamamlanan kredi eşiğinin DC olması,
harf notu tablosu (her iki skala), koşullu başarı notları, ders yükü sınırları ve onur eşikleri.
Son üçü şimdilik yalnız profilde duruyor; arayüzde gösterilmesi ayrı bir iş.

## 10. Çözülmemiş / doğrulanması gereken

- **F0 asimetrisi** tek bir transkriptten türetildi; ikinci bir YTÜ transkriptiyle teyit edilmeli.
  (Alternatif okuma: dışlanan iki ders F0 olduğu için değil, "başarısız olunup yerine başka
  seçmeli alınan ders" olduğu için dışlanmış olabilir — ama bu okuma AGNO'yu 2,54'e taşıyor
  ve transkriptteki 2,51 ile tutmuyor; dolayısıyla F0 okuması daha güçlü.)
- **ANO** örnek transkriptte boş; hesap tabanı ("sorumlu olduğu dersler" = öğretim planı)
  transkriptten çıkarılamıyor. Öğretim planı verisi olmadan hesaplanamaz, kapsam dışı bırakılabilir.
- Artı/eksili skalanın hangi giriş yılından itibaren uygulandığı bulunamadı.
- Yaz okulu ders/kredi sınırı (YÖ-007 Yaz Okulu Yönergesi) okunamadı — eski `.doc` biçimi.
- Ayrıştırıcı tek bir transkript üzerinde doğrulandı. Sınanmamış durumlar: notu henüz
  girilmemiş (devam eden) dönem, M / M(i) muafiyet işaretli ders, artı/eksili skalayla
  basılmış transkript, tek dönem bloğunun sayfa sonunda bölünmesi. Kod bu durumları
  gözeterek yazıldı ama gerçek belgeyle görülmedi.
