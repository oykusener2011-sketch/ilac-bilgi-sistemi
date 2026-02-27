# 📧 E-POSTA KURULUMU - KOLAY VERSİYON

Mesajların Gmail'e gelmesi için yapmanız gereken şeyler **ÇOK KOLAY**. Takip edin:

---

## 🎯 Adım 1: Telefonla veya Bilgisayarla Yap (3 dakika)

### A) Tarayıcıda Aç:
```
https://www.emailjs.com/
```

### B) Sağ Üst Köşede "Sign Up" Tıkla

### C) Seç: **Sign up with Google**

### D) Kendi Gmail hesabını seç (otacilar45.sifanin.kare.kodu@gmail.com)

### E) **Allow** (İzin Ver) Tıkla

✅ **Bitti!** EmailJS hesabı açıldı.

---

## 🎯 Adım 2: Kopyala (2 dakika)

### Dashboard'a girdikten sonra:

#### Adım 2a: Public Key'i KopyaLa
1. Sol menüde **Account** tıkla
2. **Public Key** bölümünü bul
3. Uzun kod'u kopyala (örn: `o7UywKx4MrzfMWqJO`)

#### Adım 2b: Service ID'yi Kopyala
1. Sol menüde **Email Services** tıkla
2. **Gmail** hizmetini seç
3. **Service ID** bölümünü kopyala (örn: `service_abc12345`)

#### Adım 2c: Template ID'yi Kopyala
1. Sol menüde **Email Templates** tıkla
2. Yeni template oluştur:
   - Adını yaz: `template_ilac_mesaj`
   - Service: Gmail seç
   - **Kaydet**
3. Template ID'yi kopyala (örn: `template_xyz9876`)

✅ **Bitti!** 3 kodu kopyaladın.

---

## 🎯 Adım 3: Kodları Web Sitesine Yapıştır (1 dakika)

Dosya: `script.js` (text editörde aç)

Bu satırları bul:
```javascript
const PUBLIC_KEY = "o7UywKx4MrzfMWqJO";
const SERVICE_ID = "service_ilac_sistemi";
const TEMPLATE_ID = "template_ilac_mesaj";
```

Ve değiştir (kopyaladığın kodları yapıştır):
```javascript
const PUBLIC_KEY = "BU ALAN YAPISTIR (Adım 2a)";
const SERVICE_ID = "BU ALAN YAPISTIR (Adım 2b)";
const TEMPLATE_ID = "BU ALAN YAPISTIR (Adım 2c)";
```

✅ **BITTI! Artık sistem çalışıyor!**

---

## 🧪 Adım 4: Test (1 dakika)

1. Web sitesini aç: `http://localhost:8000`
2. **İletişim** bölümüne git
3. Test mesajı gönder
4. Gmail'e bak (`otacilar45.sifanin.kare.kodu@gmail.com`)

Mesaj var mı? **✅ SORUN ÇÖZÜLDÜ!**

Yok mu? Başta başla ve adımları tekrar yap.

---

## ⚠️ PROBLEM VARSA:

### "Kod bulamadım" diyorsan:
- Masaüstü sağ tık → Text Editörü Aç
- `script.js` dosyasını aç
- Ctrl+F ile arama yap: `const PUBLIC_KEY`

### "Gmail'e mesaj yok" diyorsan:
- F12 tuşu (tarayıcıda hata göster)
- **Console** sekmesine bak
- Kırmızı yazı var mı?

### "Yine anlamadım" diyorsan:
- Whatsapp ile: `otacilar45.aifanin.kare.kodu@gmail.com` kontak ekle
- Screenshare yap, ben yardım ederim!

---

**ÖNEMLİ NOT:** 
- Sadece **bir kez** yapılır
- Sonra **HAAA SİSTEM ÇALIŞCAK!** 🎉
- Ücretsiz 200 e-posta/ay

---

**Anlamadığın kısım varsa sor!** 💬
