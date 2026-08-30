# Marmara Üniversitesi — Notlandırma ve Kredi Sistemi

Buradaki her kural ya resmî yönetmelikten alınmıştır ya da gerçek bir Marmara not döküm
belgesinin (2023 girişli, Yönetim Bilişim Sistemleri, Almanca) kendi rakamlarıyla
**doğrulanmıştır**.

## 1. Kaynaklar

| Belge | Kaynak |
|---|---|
| Marmara Üniversitesi Ön Lisans ve Lisans Eğitim-Öğretim ve Sınav Yönetmeliği | <https://www.marmara.edu.tr/dosya/www/mevzuat/2023/mu_yonetmelik_onlisans_lisans_v22.pdf> |
| Aynı yönetmelik (mevzuat.gov.tr, No 21065) | <https://mevzuat.gov.tr/File/GeneratePdf?mevzuatNo=21065&mevzuatTur=UniversiteYonetmeligi&mevzuatTertip=5> |
| Not baremi ve kısaltmalar | Örnek transkript s. 3-4 ("Açıklamalar") |

## 2. Harf notları (Md. 23/7)

| Not | Katsayı | Anlam | Ortalamaya girer mi? |
|---|---|---|---|
| AA | 4,00 | Pekiyi | evet |
| BA | 3,50 | İyi-Pekiyi | evet |
| BB | 3,00 | İyi | evet |
| CB | 2,50 | Orta-İyi | evet |
| CC | 2,00 | Orta | evet |
| DC | 1,50 | Orta-Geçer | evet |
| DD | 1,00 | **Geçer** | evet |
| FD | 0,50 | Başarısız | evet |
| FF | 0,00 | Başarısız | evet |
| FG | 0,00 | Yarıyıl sonu sınavına girmedi | **evet — FF gibi işlenir** (Md. 23/8-ç) |
| DZ | 0,00 | Devamsız | **evet — FF gibi işlenir** (Md. 23/8-d) |
| MZ | — | Mazeretli | hayır (sonradan nota dönüşür) |
| S | — | Yeterli (başarılı) | hayır — ama **krediye sayılır** (Md. 23/8-f) |
| U | — | Yetersiz (başarısız) | hayır |
| E | — | Eksik | hayır (15 iş günü içinde tamamlanmazsa FF olur) |
| W | — | Çekildi | hayır |
| DE | — | Devam ediyor | hayır |

**İşaretler (Md. 24):** R (tekrar), NC (kredisiz — ne toplam krediye ne ortalamaya),
TI / TY / TD / TS / T (transferler), M (muaf, kredisiz — krediye sayılmaz),
MK (muaf, kredili — S notu verilir, **krediye sayılır**), DP (değişim programı),
TK (tek ders sınavı), CY (ÇAP/yandal), AN (anadal), UC (üç ders sınavı).

Transkriptte **ders kodunun başındaki `*`**, o dersin genel not ortalamasına dahil
edilmediğini gösterir.

### Başarı durumu (Md. 23/8)

- **Başarılı:** AA, BA, BB, CB, CC, DC, DD ve S.
- **Başarısız:** FD, FF, FG, DZ ve U.
- **Netleşmemiş:** MZ ve E.

**Marmara'da koşullu geçme yoktur** — DD doğrudan "Geçer"dir. (Boğaziçi ve YTÜ'den
en belirgin farklardan biri; YTÜ'de DD başarısız, DC koşullu başarılıdır.)

### Not baremi ≠ harf notu

Transkriptin arkasındaki barem (≥90 AA, ≥85 BA, ≥80 BB, ≥75 CB, ≥65 CC, ≥55 DC, ≥50 DD,
≥45 FD) **bağlayıcı değildir**: Md. 23/7 harf notunun bağıl değerlendirme ile verildiğini
söyler. Örnek transkriptte 49 puan CC, 57 puan CB, 43 puan DC olmuş — yani ham puandan
harf notu türetilemez. **Ortalama hesabında daima harf notu kullanılmalıdır**, "Puan" sütunu
yalnız bilgi amaçlıdır.

## 3. Ortalama hesabı — YANO / GANO (Md. 25)

**Kredi tabanı: AKTS.** Belgenin başlığında "Kredi Türü : AKTS" yazar (Boğaziçi'nin aynı
şablondaki belgesinde "Ulusal" yazar). Ayrıştırıcı bu alanı okuyup doğru sütunu seçer.

Formül: `Σ(başarı katsayısı × kredi) / Σ(kredi)`, virgülden sonra iki haneye yuvarlanır
(üçüncü hane 5 ve üstüyse yukarı).

- **YANO:** yalnız o yarıyılın dersleri.
- **GANO:** alınmış tüm dersler. **Tekrarlanan derste son not geçerlidir** (Md. 25/3, Md. 26/3).
- Öğretim programında yer alıp henüz alınmamış dersler hesaba katılmaz.

### Doğrulanmış davranışlar

Örnek transkriptin basılı **dört DNO değerinin dördü de** birebir tuttu (2,57 / 2,04 / 1,08 / 2,40):

1. **S notlu ders ortalamaya girmez.** 2024-25 Bahar'da S notlu 5 kredilik ders hesaba
   katılınca DNO 1,70 çıkıyor; hariç tutulunca **2,04** — belgede yazan değer.
2. **DZ ve FG paydaya girer, katsayısı 0'dır.** 2025-26 Güz'de DZ'li ders hariç tutulsaydı
   DNO 1,30 olurdu; dahil edilince **1,08** — belgede yazan değer.
3. **`*` işaretli ve 0 kredili dersler hiç girmez.**
4. **Tamamlanan kredi** = son notu DD ve üstü olan derslerin kredisi **+ S notlu derslerin
   kredisi**. Örnekte 95 + 5 = **100** — belgedeki "Başarılan Kredi" ile aynı.

## 4. Ders tekrarı (Md. 26)

- Başarısız olunan ders tekrar alınmak zorundadır.
- **DD ve DC** notları GANO yükseltmek için danışman onayıyla tekrarlanabilir.
- **S notu ve CC ve üzeri** notlarla başarılmış dersler **tekrar edilemez**.
- Tekrarda **son harf notu** geçerlidir.
- Tekrarlanacak ders seçimlikse, aynı havuzdaki eşdeğer kredili başka bir seçimlik de alınabilir.

## 5. Ders yükü, sınamalı öğrenci, mezuniyet

- **Ders yükü (Md. 18/1):** kredi değil **ders sayısı** sınırı — yarıyıl başına ortalama ders
  sayısının **üç fazlasını** aşamaz. Mezuniyet aşamasındakilere birim yönetim kurulu kararıyla
  en fazla üç ders daha verilebilir.
- **Sınamalı öğrenci (Md. 18/5-a):** yarıyıllık düzende, **üçüncü yarıyıldan itibaren**
  GANO < 1,80 **ve** son iki yarıyılın **her ikisinde de** YANO < 2,00 olan öğrenci sınamalıdır.
  Sınamalı öğrenci üst yarıyıl dersi alamaz, alt yarıyıllardan ders alır; GANO yükseltmek için
  DD ve DC notlu derslerini tekrarlayabilir. (Yıllık düzende yalnız GANO < 1,80; entegre
  eğitimde GANO < 2,00.)
- **Üst yarıyıldan ders (Md. 18/9):** GANO ≥ 3,00 gerekir.
- **Mezuniyet (Md. 28/1):** tüm ders, uygulama ve staj gerekleri + **GANO ≥ 2,00**.
- **Onur:** GANO 3,00–3,49. **Yüksek onur:** GANO ≥ 3,50 (Md. 25/4, Md. 28/2).
- **Önlisans diploması (Md. 29):** ilk dört yarıyılın bütün derslerinden başarılı olmak.
- **Devam (Md. 19), başarı notu ağırlıkları (Md. 23/2):** yarıyıl sonu sınavının katkısı
  %30–60 arası; ara sınavların yarıyıl içi katkısı en az %20.

## 6. Transkript belge biçimi (ayrıştırıcı için)

Belge, **Boğaziçi ile aynı YÖK e-Devlet şablonudur**: "MARMARA ÜNİVERSİTESİ NOT DÖKÜM BELGESİ
(MARMARA UNIVERSITY) (TRANSCRIPT)", tek sütun, dönem başlıkları ve altında ders satırları.
Konum bilgisine gerek yoktur, düz metin yeterlidir.

Dönem başlığı: `2024-2025 Güz Dönemi  (2024-2025 Fall Term)` — İngilizce karşılığı aynı
satırda parantez içinde tekrarlanır, ayrıştırıcı yalnız Türkçesini eşleştirir.

Ders satırı, pdf.js metninde şu sırayla çıkar:

```
[*] KOD   Türkçe Ad  (English Name)   STATÜ   DİL   T   U   UK   AKTS   PUAN   NOT
```

- `STATÜ` = Z (zorunlu) / S (seçmeli)
- `DİL` = Tr / Alm. / İng. …
- **PUAN, NOTTAN ÖNCE gelir** (görsel sıranın tersi) — Boğaziçi belgesindeki davranışın aynısı
- `UK` = ulusal kredi, `AKTS` = ortalamada kullanılan kredi

Dönem sonu özeti: `DNO: (GPA) 2.57  GNO: (CGPA) 72.25  30  30  TUK: (TNK)  TAKTS: (TECTS)`.
`Açıklamalar (Explanations)` başlığından sonrası not baremi ve kısaltmalardır, ders içermez.

**Tuzak:** bütün satırlar düzgün değil. Yabancı dil yeterlik dersinin notu harf değil
seviye kodudur (`B2.1`). Tek bir "tembel" desenle okumak, eşleşmeyen bu satırın bir sonraki
dersin sayılarına kadar uzayıp o dersi yutmasına yol açar. Bu yüzden ayrıştırıcı önce ders
kodlarının yerlerini bulur, sonra her satırı bir sonraki koda kadar keserek tek başına okur.

## 7. Marmara ↔ Boğaziçi / YTÜ farkları

| Konu | Boğaziçi | YTÜ | Marmara |
|---|---|---|---|
| Ortalamada kullanılan kredi | Ulusal kredi | Yerel kredi | **AKTS** |
| DD | Geçer | Başarısız | **Geçer** |
| Koşullu geçme | yok | DC (AGNO ≥ 2,00) | **yok** |
| Devamsızlık notu | — | F0 (AGNO'dan dışlanır) | **DZ (0,00, ortalamaya girer)** |
| Sınava girmeme | — | — | **FG (0,00, ortalamaya girer)** |
| Ortalamaya girmeyen ama krediye sayılan | — | — | **S** |
| Dönem ortalaması adı | SPA | YANO | **DNO** |
| Genel ortalama adı | CGPA | AGNO | **GNO / GANO** |
| Ders yükü sınırı | — | 25/28/31 kredi | **ders sayısı + 3** |
| Akademik yetersizlik | — | AGNO < 2,00 (ardışık iki dönem) | **GANO < 1,80 ve iki YANO < 2,00** |
| Onur | — | 3,00–3,49 / ≥3,50 | **3,00–3,49 / ≥3,50** |

## 8. Çözülmemiş

- **Belgedeki "GNO: 72.25" 4'lük ölçekte değil.** Belgenin başlığında "Not Sistemi:
  100'lük Not Sistemi" yazıyor: Marmara genel ortalamayı 100 üzerinden tutuyor. Aynı belgede
  dönem ortalamaları (DNO) 4'lük ölçekte basılıyor — tutarsız ama belgenin gerçeği bu.
  100'lük GNO, transkriptteki ham "Puan" sütunundan türetilemedi (ham puanların kredi ağırlıklı
  ortalaması 58,2 çıkıyor). Bunun nedeni büyük olasılıkla bağıl değerlendirme sonrası oluşan
  puanın belgede gösterilmemesi. Uygulama, doğruladığımız DNO formülünü kümülatife de
  uygulayarak **4'lük ölçekte GANO** hesaplar (örnekte 2,15); belgedeki 100'lük sayı
  yeniden üretilmeye çalışılmaz.
- Ayrıştırıcı tek bir transkript üzerinde doğrulandı. Sınanmamış durumlar: yaz okulu dönemi,
  W / MZ / E / DE notlu ders, NC ve transfer işaretli dersler, yıllık düzende eğitim veren
  birimler (Tıp, Hukuk), ÇAP/yandal dersleri.
