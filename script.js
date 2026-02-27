// Ana sayfa için JavaScript

// ✅ EmailJS Kodları Ayarlandı!
const PUBLIC_KEY = "bNd_CjFnPsZGUNi-d";
const SERVICE_ID = "service_nnafual";
const TEMPLATE_ID = "template_llfd8r9";

// EmailJS başlat (güvenli kontrol)
document.addEventListener('DOMContentLoaded', function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(PUBLIC_KEY);
        console.log('✅ EmailJS başlatıldı');
    } else {
        console.error('❌ EmailJS yüklenemiyor. Sayfayı yenile.');
    }
});

// Kaydırma animasyonları
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// İletişim formu gönderim
function handleSubmit(event) {
    event.preventDefault();
    
    // Form alanlarını al
    const form = document.getElementById('contactForm');
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    
    // Null kontrol
    if (!name || !email || !message) {
        alert('❌ Form alanları bulunamıyor. Sayfayı yenile.');
        console.error('Form alanları bulunamıyor');
        return;
    }
    
    const nameValue = name.value.trim();
    const emailValue = email.value.trim();
    const messageValue = message.value.trim();
    
    // Validasyon
    if (!nameValue || !emailValue || !messageValue) {
        alert('❌ Lütfen tüm alanları doldurunuz.');
        return;
    }
    
    // Email validasyonu
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailValue)) {
        alert('❌ Lütfen geçerli bir e-posta adresi giriniz.');
        return;
    }

    // EmailJS kontrol
    if (typeof emailjs === 'undefined') {
        alert('❌ E-posta sistemi yüklenmedi. Sayfayı yenile ve tekrar dene.');
        console.error('EmailJS tanımlanmamış');
        return;
    }

    // E-posta gönderme işlemi başla
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '📤 Gönderiliyor...';
    submitBtn.disabled = true;

    // EmailJS ile e-posta gönder
    const templateParams = {
        to_email: 'otacilar45.aifanin.kare.kodu@gmail.com',
        from_name: nameValue,
        from_email: emailValue,
        subject: 'İlaç Bilgi Sistemi - Yeni Mesaj',
        message: messageValue,
        sent_date: new Date().toLocaleString('tr-TR')
    };

    console.log('Gönderiliyor:', templateParams);

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
    .then(response => {
        console.log('✅ E-posta başarıyla gönderildi!', response);
        alert('✅ Mesajınız başarıyla gönderilmiştir!\n\nEn kısa sürede sizinle iletişime geçeceğiz.');
        
        // Formu temizle
        if (form) {
            form.reset();
        }
    })
    .catch(error => {
        console.error('❌ E-posta Hatası:', error);
        console.error('Service ID:', SERVICE_ID);
        console.error('Template ID:', TEMPLATE_ID);
        alert('❌ E-posta gönderilemedi.\n\nLütfen bilgisayarınıza bir e-posta gönderip ayrıntıları kontrol edin.\n\nHata: ' + error.text);
    })
    .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

// Sayfa yüklendiğinde
console.log('Script yüklendi');

// Sayfa yüklendiğinde fade-in animasyonu
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
    document.body.style.animation = 'fadeIn 0.5s ease-in';
});

// Fade-in animasyonu tanımı
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
