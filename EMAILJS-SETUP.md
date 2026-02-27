# 📧 EmailJS E-posta Setup Rehberi

Mesajların Gmail'e ulaşması için **EmailJS** hizmetini ayarlamanız gerekiyor. (Ücretsiz, 200 e-posta/ay)

## 🚀 Adım 1: EmailJS Hesabı Oluştur

1. https://www.emailjs.com/ sitesine git
2. **Sign Up** (Kaydol) butonuna tıkla
3. Google veya e-posta ile kaydol
4. E-postanı doğrula

## 🔑 Adım 2: Public Key Hesabından Kopyala

1. EmailJS Dashboard'a gir
2. Sol menüde **Account** (Hesap) kısmına tıkla
3. **API Key** bölümünü aç
4. **Public Key** (Açık Anahtar) kopyala
5. **NOT:** Bu kodum `script.js` dosyasında kullanılacak

## 📬 Adım 3: Email Service Bağla (Gmail)

### Option A: Gmail Kullanmak (En Kolay)

1. EmailJS Dashboard'da **Email Services** (E-posta Hizmetleri) tıkla
2. **Add Service** (Hizmet Ekle) butonuna tıkla
3. **Gmail** seç
4. Gmail hesabını seç (otacilar45.aifanin.kare.kodu@gmail.com)
5. **Connect** (Bağlan) tıkla
6. Açılan pencerede **Gmail'e izin ver**
7. Service ID'ni kopyala

### Option B: 2-Factor Auth'lu Gmail içinse

1. **Gmail** hizmetini seç
2. Şu güvenlik parolasını git: https://myaccount.google.com/apppasswords
3. (Gmail'e her zamanki şifresi ile giriş yap)
4. İşletim Sistemi: Windows
5. Uygulama: Mail
6. 16 karakterlik şifreyi kopyala ve EmailJS'e yapıştır

## 📋 Adım 4: Email Template Oluştur

1. EmailJS Dashboard'da **Email Templates** (E-posta Şablonları) tıkla
2. **Create New Template** (Yeni Şablon Oluştur) butonuna tıkla
3. Template adını yaz: `template_ilac_mesaj`
4. **Service** olarak Gmail'i seç

### Template Şablonunu Doldur:

**TO EMAIL:**
```
{{to_email}}
```

**SUBJECT:**
```
[İlaç Bilgi Sistemi] {{subject}}
```

**TEXT:**
```
Yeni mesaj alındı!

---
AD SOYAD: {{from_name}}
E-POSTA: {{from_email}}
KONU: {{subject}}
TARİH: {{sent_date}}
---

MESAJ:
{{message}}

---
Bu mesaj İlaç Bilgi Sistemi iletişim formundan gönderilmiştir.
```

5. **Save** (Kaydet) tıkla
6. Template ID'ni başta göreceğin ID'yi kopyala

## 💻 Adım 5: script.js Dosyasını Güncelle

`script.js` dosyasını aç ve bu satırları bulup güncelle:

```javascript
// SATIR ~7
emailjs.init("YOUR_PUBLIC_KEY_HERE");  // <- Public Key'i buraya yapıştır

// SATIR ~50
emailjs.send('service_YOUR_SERVICE_ID', 'template_ilac_mesaj', templateParams)
                ↑ Buraya Service ID'ni yazarak yerine koy
```

### Örnek:
```javascript
emailjs.init("o7UywKx4MrzfMWqJO");  // Senin Public Key
emailjs.send('service_gmail_u98765', 'template_ilac_mesaj', templateParams)
```

## ✅ Adım 6: Test Et

1. Web sitesini aç: http://localhost:8000
2. **İletişim** bölümüne git
3. Test mesajı gönder
4. **otacilar45.aifanin.kare.kodu@gmail.com** e-postasını kontrol et

## 🆘 Sorunlar Varsa

### Mesaj yine gelmiyor:
- Public Key ve Service ID'yi doğru kopyaladığından emin ol
- Tarayıcı konsolunda hata var mı kontrol et (F12)
- EmailJS dashboard'da "Logged Activity" bölümüne bak

### Gmail "İzin Yok" diyorsa:
- Gmail hesabında "Daha Az Güvenli Uygulamalar"ı aç
- https://myaccount.google.com/lesssecureapps

### Hala çalışmıyorsa:
- https://www.emailjs.com/docs/tutorial/creating-email-template/ github linkini kontrol et
- Discord webhook alternatif kullanabilirsin (bonus)

## 📊 Ücretsiz Limitleri

- **200 e-posta/ay** ücretsiz
- Bundan sonra aylık 5-10$ ile premium

---

**Not:** Bunu bir kere kurulduktan sonra sistem otomatik olarak çalışacaktır! 🎉
