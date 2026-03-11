// Eczacı Paneli JavaScript

// Firebase Konfigürasyonu
const firebaseConfig = {
  apiKey: "AIzaSyC34zHTXKJHtEJ0LduOwV2bnWEeeV2sAK8",
  authDomain: "ilac-bilgi-sistemi-53238.firebaseapp.com",
  databaseURL: "https://ilac-bilgi-sistemi-53238-default-rtdb.firebaseio.com",
  projectId: "ilac-bilgi-sistemi-53238",
  storageBucket: "ilac-bilgi-sistemi-53238.firebasestorage.app",
  messagingSenderId: "1057703306085",
  appId: "1:1057703306085:web:298b723fb9c41bc454778c"
};

// Firebase Başlat
let database = null;
let firebaseReady = false;

try {
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    database = firebase.database();
    firebaseReady = true;
    console.log('✅ Firebase başarıyla başlatıldı');
  } else {
    console.error('❌ Firebase SDK yüklenmedi - window.firebase tanınmıyor');
  }
} catch (error) {
  console.error('❌ Firebase başlatılması başarısız:', error);
}

let currentSessionId = null;
let listeningToSession = false;

function updatePreview() {
    const patientName = document.getElementById('patientName').value;
    const medicineName = document.getElementById('medicineName').value;
    const purpose = document.getElementById('purpose').value;
    const dosage = document.getElementById('dosage').value;
    const frequency = document.getElementById('frequency').value;
    const specialCondition = document.getElementById('specialCondition').value;

    let previewHTML = '';

    if (patientName || medicineName || purpose || dosage) {
        previewHTML = `
            <div style="text-align: left; background: white; padding: 1rem; border-radius: 6px;">
                ${patientName ? `<div><strong>Reçete Sahibinin Adı:</strong> ${escapeHtml(patientName)}</div>` : ''}
                ${medicineName ? `<div><strong>İlacın Adı:</strong> ${escapeHtml(medicineName)}</div>` : ''}
                ${purpose ? `<div><strong>Endikasyon:</strong> ${escapeHtml(purpose)}</div>` : ''}
                ${dosage ? `<div><strong>Kullanım Dozu:</strong> ${escapeHtml(dosage)}</div>` : ''}
                ${frequency ? `<div><strong>Kullanım Periyodu:</strong> ${escapeHtml(frequency)}</div>` : ''}
                ${specialCondition ? `<div><strong>Özel Durum:</strong> ${escapeHtml(specialCondition)}</div>` : ''}
            </div>
        `;
    } else {
        previewHTML = '<p style="color: #999; text-align: center;">Form alanlarını doldurdukça ön izleme güncellenecektir</p>';
    }

    document.getElementById('preview').innerHTML = previewHTML;
}

// QR Kod oluştur
async function generateQR(event) {
    event.preventDefault();
    console.log('QR oluşturma başlangıç...');

    const patientName = document.getElementById('patientName').value.trim();
    const medicineName = document.getElementById('medicineName').value.trim();
    const purpose = document.getElementById('purpose').value.trim();
    const dosage = document.getElementById('dosage').value.trim();
    const frequency = document.getElementById('frequency').value.trim();
    const specialCondition = document.getElementById('specialCondition').value.trim();

    // Validasyon
    if (!patientName || !medicineName || !purpose || !dosage || !frequency) {
        alert('Lütfen tüm zorunlu alanları doldurunuz.');
        return;
    }

    // İlaç bilgilerini bir nesneye çevir
    const medicineData = {
        patientName,
        medicineName,
        purpose,
        dosage,
        frequency,
        specialCondition: specialCondition || 'Yoktur',
        createdAt: new Date().toISOString()
    };

    // Veriyi JSON stringine çevir
    const jsonString = JSON.stringify(medicineData);
    
    // Base64 şifrele (UTF-8 desteği ile)
    const utf8String = unescape(encodeURIComponent(jsonString));
    const encodedData = btoa(utf8String);
    console.log('Veri Base64 şifresi yapıldı');

    // Unique Session ID oluştur
    currentSessionId = 'SESSION_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    console.log('Session ID oluşturuldu:', currentSessionId);
    
    const qrUrl = `https://oykusener2011-sketch.github.io/ilac-bilgi-sistemi/mobile.html?session=${currentSessionId}`;
    console.log('QR URL:', qrUrl);

    // Firebase'e session'ı oluştur (ancak başarısız olursa devam et)
    if (database) {
        try {
            await database.ref('sessions/' + currentSessionId).set({
                createdAt: new Date().toISOString(),
                status: 'waiting',
                medicineData: medicineData
            });
            console.log('Firebase Session oluşturuldu');

            // Firebase'i dinlemeye başla - telefon veri yazınca seslendir
            if (!listeningToSession) {
                listeningToSession = true;
                database.ref('sessions/' + currentSessionId + '/medicineData').on('value', (snapshot) => {
                    if (snapshot.exists()) {
                        const receivedData = snapshot.val();
                        console.log('📱 Telefon veri gönderdi:', receivedData);
                        playReceivedData(receivedData);
                    }
                });
                console.log('Firebase dinleyicisi başlangıç');
            }
        } catch (error) {
            console.warn('Firebase hatası (devam ediliyor):', error);
        }
    } else {
        console.warn('Firebase bağlantısı yok');
    }

    // QR Kod oluştur
    const qrContainer = document.getElementById('qrCodeOutput');
    qrContainer.innerHTML = '';

    try {
        const qr = new QRCode(qrContainer, {
            text: qrUrl,
            width: 250,
            height: 250,
            correctLevel: QRCode.CorrectLevel.H,
            colorDark: '#1f2937',
            colorLight: '#ffffff'
        });
        console.log('QR Kod başarıyla oluşturuldu');

        document.getElementById('qrCode').style.display = 'block';

        // Kodlanmış veriyi ekrana göster (test amaçlı)
        document.getElementById('encodedDataDisplay').value = encodedData;

        // Başarı mesajı
        alert(`✅ QR Kod başarıyla oluşturuldu!\n\nSession ID: ${currentSessionId}\n\nTelefondan QR tarandığında burada sesli bilgi görüntülenecektir.`);

        // Ekran okuyucu için ilan
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.textContent = 'QR Kod başarıyla oluşturulmuştur';
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        document.body.appendChild(announcement);
    } catch (error) {
        console.error('QR Kod oluşturulamadı:', error);
        alert('❌ QR Kod oluşturulurken bir hata meydana geldi. Lütfen tekrar deneyiniz.\n\nHata: ' + error.message);
    }
}

// QR Kodu indir
function downloadQR() {
    const canvas = document.querySelector('#qrCodeOutput canvas');
    if (!canvas) {
        alert('Önce QR kod oluşturunuz.');
        return;
    }

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `ilac-qr-${new Date().getTime()}.png`;
    link.click();
}

// QR Kodu yazdır
function printQR() {
    const canvas = document.querySelector('#qrCodeOutput canvas');
    if (!canvas) {
        alert('Önce QR kod oluşturunuz.');
        return;
    }

    const printWindow = window.open();
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>QR Kod Yazdır</title>
            <style>
                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background-color: #f0f0f0;
                }
                .container {
                    text-align: center;
                }
                img {
                    max-width: 400px;
                    border: 5px solid #333;
                    padding: 10px;
                    background: white;
                }
                h2 {
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>İlaç Bilgisi QR Kodu</h2>
                <img src="${canvas.toDataURL('image/png')}" alt="İlaç QR Kodu"/>
                <p>Kodu ilaç kutusunun üzerine yapıştırınız</p>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// HTML öğelerini escape et (XSS saldırılarına karşı korunma)
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Kodlanmış veriyi kopyala
function copyEncodedData() {
    const encodedDataDisplay = document.getElementById('encodedDataDisplay');
    if (!encodedDataDisplay.value) {
        alert('❌ Kopyalanacak veri bulunamadı. Lütfen önce QR kod oluşturunuz.');
        return;
    }
    
    encodedDataDisplay.select();
    document.execCommand('copy');
    alert('✅ Kod başarıyla kopyalandı! Mobil tarayıcıda manuel giriş bölümüne yapıştırabilirsiniz.');
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    console.log('Eczacı Paneli Hazır');
    updatePreview();
    
    // Form alanlarını dinle ve ön izle güncelle
    const form = document.getElementById('medicineForm');
    if (form) {
        form.addEventListener('input', updatePreview);
        console.log('Form listener bağlandı');
    } else {
        console.error('medicineForm elementi bulunamadı!');
    }
});

// Firebase'den gelen veriyi seslendir
function playReceivedData(data) {
    if (!data) return;
    
    console.log('Seslendirilecek veri:', data);
    
    // Veriyi ekranda göster
    let displayHTML = `
        <div style="background: #ecfdf5; padding: 1rem; border-radius: 8px; border: 2px solid #10b981;">
            <h3 style="color: #059669; margin-top: 0;">✅ İlaç Bilgileri Alındı</h3>
            <p><strong>👤 Hasta Adı:</strong> ${escapeHtml(data.patientName || 'N/A')}</p>
            <p><strong>💊 İlaç Adı:</strong> ${escapeHtml(data.medicineName || 'N/A')}</p>
            <p><strong>🏥 Endikasyon:</strong> ${escapeHtml(data.purpose || 'N/A')}</p>
            <p><strong>📏 Kullanım Dozu:</strong> ${escapeHtml(data.dosage || 'N/A')}</p>
            <p><strong>⏰ Kullanım Periyodu:</strong> ${escapeHtml(data.frequency || 'N/A')}</p>
            ${data.specialCondition ? `<p><strong>⚠️ Özel Durum:</strong> ${escapeHtml(data.specialCondition)}</p>` : ''}
        </div>
    `;
    document.getElementById('preview').innerHTML = displayHTML;
    
    // Sesle oku
    speakMedicineInfo(data);
}

// İlaç bilgilerini sesle oku
function speakMedicineInfo(data) {
    if (!data) return;
    
    // Web Speech API desteği kontrol et
    if (!('speechSynthesis' in window)) {
        console.error('❌ Bu tarayıcı Web Speech API desteklemiyor');
        alert('⚠️ Tarayıcınız sesli okuma (TTS) özelliğini desteklemiyor. Lütfen Chrome, Edge veya Firefox kullanınız.');
        return;
    }
    
    // Türkçe seslendir
    const text = `
        Reçete Sahibinin Adı: ${data.patientName}. 
        İlacın Adı: ${data.medicineName}. 
        Endikasyon: ${data.purpose}. 
        Kullanım Dozu: ${data.dosage}. 
        Kullanım Periyodu: ${data.frequency}. 
        ${data.specialCondition ? `Özel Durum: ${data.specialCondition}.` : ''}
    `;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    // Hata handling ekle
    utterance.onerror = function(event) {
        console.error('❌ Sesli okuma hatası:', event.error);
        console.error('Hata tipi:', event.error);
        
        // Farklı hata türlerine göre mesaj ver
        let errorMsg = event.error;
        if (event.error === 'no-speech') {
            errorMsg = 'Ses bulunamadı';
        } else if (event.error === 'audio-busy') {
            errorMsg = 'Ses cihazı meşgul';
        } else if (event.error === 'not-allowed') {
            errorMsg = 'Ses okuma izni verilmedi';
        } else if (event.error === 'network') {
            errorMsg = 'Ağ bağlantısı sorunları - lütfen internet bağlantınızı kontrol edin';
        }
        
        alert(`⚠️ Sesli okuma başarısız oldu: ${errorMsg}\n\nLütfen tarayıcı ayarlarını kontrol ediniz veya sayfa yenileyin.`);
        document.getElementById('audioControls').style.display = 'none';
    };
    
    // Başarılı tamamlama
    utterance.onend = function() {
        console.log('✅ Sesli okuma tamamlandı');
    };
    
    // Başlama
    utterance.onstart = function() {
        console.log('🔊 Sesli okuma başlatıldı');
    };
    
    console.log('🔊 Sesli okuma başlatılıyor... lang:', utterance.lang, 'rate:', utterance.rate);
    window.speechSynthesis.cancel(); // Önceki sesleri iptal et
    window.speechSynthesis.speak(utterance);
}
