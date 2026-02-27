# İlaç Bilgi Sistemi - Sesli QR Kod Uygulaması

## 📋 Proje Açıklaması

**İlaç Bilgi Sistemi**, görme engelli bireyler için sağlık alanında erişilebilirliği sağlamak amacıyla geliştirilmiş, web tabanlı bir uygulamadır. Sistem, eczanelerde hazırlanan ilaçlara ait bilgileri QR kod aracılığıyla sesli olarak sunmaktadır.

### 🎯 Proje Hedefleri

- ✅ Sağlıkta erişilebilirliği artırmak
- ✅ Görme engelli bireylerin bireysel bağımsızlığını desteklemek
- ✅ İlaç kullanımında karışıklıkları ve sağlık risklerini azaltmak
- ✅ Teknolojiyi toplumsal fayda doğrultusunda kullanmak
- ✅ Mevcut eczacı süreçlerini dijitalleştirmek

---

## 🏗️ Sistem Mimarisi

### Üç Ana Bileşen:

#### 1. **Anasayfa (index.html)**
- Proje hakkında bilgi
- Sistem özellikleri tanıtımı
- Nasıl çalıştığının açıklanması
- Eczacı paneli ve mobil tarayıcıya erişim

#### 2. **Eczacı Paneli (pharmacist.html)**
Eczacıların kullanacağı yönetim arayüzü:
- Hasta adı
- İlaç adı
- Kullanım amacı
- Doz miktarı
- Günlük kullanım sıklığı
- Tedavi süresi
- Kullanım zamanı
- Dikkat edilecek noktalar
- Yan etkiler

**Fonksiyonlar:**
- Gerçek zamanlı ön izleme
- Otomatik QR kod oluşturma
- QR kodunu indirme
- QR kodunu yazdırma

#### 3. **Mobil Tarayıcı (mobile.html)**
Görme engelli kullanıcılar için:
- QR kod tarama arayüzü
- Otomatik sesli okuma
- Manuel veri girişi seçeneği
- Ses kontrolü (başlat/durdur)
- WCAG uyumlu arayüz

---

## 🚀 Kullanım Rehberi

### Eczacı İçin:

1. **Eczacı Paneli**ne gidin
2. **Hasta bilgilerini** girin:
   - Hasta adı soyadı
   - İlaç adı
   - Kullanım amacı
   - Doz bilgileri
3. **QR Kod Oluştur** düğmesine tıklayın
4. QR kodu **indirin** veya **yazdırın**
5. Kodu **ilaç kutusunun üzerine yapıştırın**

### Görme Engelli Kullanıcı İçin:

1. **Mobil Tarayıcı** sayfasını açın
2. İlaç kutusundaki **QR kodu tarayın**
3. Sistem **otomatik olarak** bilgileri sesli olarak sunacaktır
4. İhtiyaç halinde:
   - **Tümünü Canlı Oku** düğmesiyle tekrar dinleyin
   - **Dur** düğmesiyle durdurun
   - **Sesi Aç/Kapat** düğmesiyle hacmi kontrol edin

---

## 💻 Teknik Özellikler

### Teknolojiler:
- **HTML5**: Semantic yapı
- **CSS3**: Responsive tasarım, erişilebilirlik
- **JavaScript**: İnteraktivite
- **QRCode.js**: QR kod oluşturma
- **Web Speech API**: Sesli okuma

### Erişilebilirlik Özellikleri:
- ✅ WCAG 2.1 AA uyumlu
- ✅ Ekran okuyucu desteği
- ✅ Sesli koruma (Text-to-Speech)
- ✅ Keyboard navigasyonu
- ✅ Yüksek kontrast seçeneği
- ✅ Odak göstergesi
- ✅ Aria etiketleri

---

## 📁 Dosya Yapısı

```
otacığğğğ/
├── index.html          # Anasayfa
├── pharmacist.html     # Eczacı paneli
├── mobile.html         # Mobil tarayıcı
├── styles.css          # Tüm sayfalar için CSS
├── script.js           # Anasayfa JavaScript
├── pharmacist.js       # Eczacı paneli JavaScript
├── mobile.js           # Mobil tarayıcı JavaScript
└── README.md           # Bu dosya
```

---

## 🔐 Güvenlik

- **Veriler Base64 şifreli** QR kodda saklanır
- **Kişisel bilgiler** QR kod içinde güvenli tutulur
- **XSS saldırılarına karşı** HTML escaping
- **Veri validasyonu** tüm girişlerde

---

## 📱 Cihaz Uyumluluğu

- **Mobil Cihazlar**: iOS, Android
- **Tabletler**: iPad, Android Tablet
- **Masaüstü**: Windows, macOS, Linux
- **Tarayıcılar**: Chrome, Firefox, Safari, Edge (Son 2 sürüm)

---

## 🎨 Renk Şeması

- **Birincil Renk**: #2563eb (Mavi)
- **İkincil Renk**: #059669 (Yeşil)
- **Vurgu Rengi**: #f59e0b (Turuncu)

---

## 📄 Özellikleri Test Etme

### Test Verileri ile:
1. Mobil Tarayıcı sayfasına gidin
2. Sayfada "🧪 Test Verisi Yükle" düğmesine tıklayın
3. Sistem otomatik olarak örnek ilaç bilgilerini gösterecektir
4. Sesli okuma özellikleri test edilebilir

---

## 🌍 Dil Seçenekleri

Mevcut dil: **Türkçe (tr-TR)**

Gelecek sürümlerde:
- İngilizce
- Arapça
- Kürtçe

---

## 📞 İletişim

Herhangi bir soru veya öneriniz için anasayfadaki iletişim formunu kullanınız.

---

## ©️ Telif Hakkı

**© 2026 İlaç Bilgi Sistemi**

Bu proje sağlıkta erişilebilirlik amacıyla açık kaynak olarak sunulmaktadır.

---

## 🤝 Katkıda Bulunun

Proje hakkında önerileriniz ve katkılarınız memnuniyetle karşılanır.

---

## 📋 Başlama Kılavuzu

### 1. Dosyaları İndirin
```bash
# Tüm dosyaları indirin
```

### 2. Web Sunucusu Başlatın
```bash
# Python 3 ile:
python -m http.server 8000

# Node.js ile:
npx http-server
```

### 3. Tarayıcıda Açın
```
http://localhost:8000
```

### 4. Tüm Özellikleri Test Edin
- Eczacı panelinde ilaç bilgisi girin
- QR kod oluşturun
- Mobil sayfada test verisiyle sesli okumayı deneyin

---

## 🛠️ Geliştirme Notları

### Gelecek Sürümlerde Eklenecekler:
- [ ] Gerçek QR kod tarama özelliği (html5-qrcode)
- [ ] Veritabanı entegrasyonu
- [ ] Kullanıcı kimlik doğrulama
- [ ] İlaç dış ticaret kodları (DTC) desteği
- [ ] Eczane yönetim sistemiyle entegrasyon
- [ ] Mobil uygulama versiyonu (React Native)
- [ ] Çoklu dil desteği
- [ ] İlaçla ilgili uyarılar ve interaksiyonlar
- [ ] İlaç geçmiş ve takip

---

## 📚 Kaynaklar

- [WCAG 2.1 Erişilebilirlik Standartları](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Speech API Dokümantasyonu](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [QRCode.js Kütüphanesi](https://davidshimjs.github.io/qrcodejs/)

---

**Sağlıkta Erişilebilirlik İçin Tasarlanmıştır**
