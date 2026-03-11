// Mobil QR Kod Tarayıcı JavaScript

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
try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  database = firebase.database();
  console.log('Firebase başarıyla başlatıldı');
} catch (error) {
  console.warn('Firebase başlatılması başarısız:', error);
}

let currentMedicineData = null;
let isSpeaking = false;
let html5scanner = null;  // Global scanner instance kamera seçim için

// QR Kod tarayıcı başlat
document.addEventListener('DOMContentLoaded', function() {
    // URL parametrelerini kontrol et
    const urlParams = new URLSearchParams(window.location.search);
    const sessionParam = urlParams.get('session');
    const dataParam = urlParams.get('data');
    
    if (sessionParam) {
        // Session modunda - Eczacının paneli dinliyor
        console.log('Session mode:', sessionParam);
        console.log('Firebase dinleyicisi başlatılıyor...');
        
        // Eczacı panelinden veri bekleme mesajı göster
        let messageHTML = `
            <div style="background: #fef3c7; padding: 2rem; border-radius: 8px; text-align: center; margin-top: 2rem;">
                <p style="font-size: 1.2rem; font-weight: bold; color: #92400e;">⏳ Eczacı panelinden veri bekleniyor...</p>
                <p style="color: #b45309; margin-top: 1rem;">Eczacı panelinde bu QR kodu tarandıktan sonra, reçete bilgileri burada görüntülenecek ve seslendirilecektir.</p>
                <p style="font-size: 0.9rem; color: #92400e; margin-top: 1rem; font-family: monospace;">Session: ${sessionParam}</p>
            </div>
        `;
        document.getElementById('medicineInfo').innerHTML = messageHTML;
        
        // Firebase'den veri dinle
        if (database) {
            database.ref('sessions/' + sessionParam + '/medicineData').on('value', (snapshot) => {
                if (snapshot.exists()) {
                    const receivedData = snapshot.val();
                    console.log('✅ Firebase\'den veri alındı:', receivedData);
                    displayMedicineInfo(receivedData);
                    speakMedicineInfo(receivedData);
                } else {
                    console.log('⏳ Veri henüz gelmedi, bekleniyor...');
                }
            }, (error) => {
                console.error('❌ Firebase dinleyici hatası:', error);
            });
        } else {
            console.error('Firebase bağlantısı yok');
            document.getElementById('medicineInfo').innerHTML = `
                <div style="background: #fee2e2; padding: 2rem; border-radius: 8px; text-align: center;">
                    <p style="color: #991b1b;">❌ Firebase bağlantısı başarısız oldu</p>
                    <p style="color: #7f1d1d; font-size: 0.9rem; margin-top: 0.5rem;">Lütfen sayfayı yenileyin</p>
                </div>
            `;
        }
        
    } else if (dataParam) {
        // Eski data modunda - doğrudan veri içinde
        console.log('Data mode:', dataParam.substring(0, 50) + '...');
        processMedicineData(dataParam);
    } else {
        // Normal tarama başlat
        initializeScanner();
    }
});

function initializeScanner() {
    console.log('QR Kod Tarayıcı Başlatıldı');
    
    const scannerDiv = document.getElementById('scanner');
    
    // Eğer html5-qrcode yüklü değilse, test modunu başlat
    if (typeof Html5QrcodeScanner === 'undefined') {
        console.warn('Html5QrcodeScanner kütüphanesi yüklenmedi, test moduna geçiliyor');
        scannerDiv.innerHTML = `
            <div style="
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, #1f2937, #374151);
                color: white;
                text-align: center;
                padding: 20px;
                font-size: 1.2rem;
            ">
                <div>
                    <p>📱 Kamera Test Modu</p>
                    <p style="font-size: 0.9rem; margin-top: 1rem;">
                        QR taraması şu anda test modundadır.
                    </p>
                    <button class="btn btn-secondary" style="margin-top: 1rem;" onclick="testCameraAccess()">
                        📷 Kamera İzni Test Et
                    </button>
                </div>
            </div>
        `;
        addTestButton();
        return;
    }
    
    console.log('Html5QrcodeScanner kütüphanesi yüklü, kamera izni isteniyor...');
    
    // Kamera erişim izni iste
    navigator.mediaDevices.getUserMedia({ 
        video: { 
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 }
        } 
    })
    .then(function(stream) {
        console.log('✅ Kamera izni verildi');
        // Akışı kapat, sadece izin kontrolü için
        stream.getTracks().forEach(track => track.stop());
        startQRScanner(scannerDiv);
    })
    .catch(function(error) {
        console.error('❌ Kamera erişimi başarısız:', error.name, error.message);
        
        scannerDiv.innerHTML = `
            <div style="
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, #1f2937, #374151);
                color: white;
                text-align: center;
                padding: 20px;
                font-size: 1.2rem;
            ">
                <div>
                    <p>🚫 Kamera Erişilemedi</p>
                    <p style="font-size: 0.9rem; margin-top: 1rem; color: #ccc;">
                        Hata: ${error.message}
                    </p>
                    <p style="font-size: 0.8rem; margin-top: 0.8rem; color: #aaa;">
                        Lütfen tarayıcı ayarlarından bu site için kamera izni verin.
                    </p>
                    <button class="btn btn-secondary" style="margin-top: 1rem;" onclick="location.reload()">
                        🔄 Sayfayı Yenile
                    </button>
                    <p style="font-size: 0.8rem; margin-top: 1rem; color: #aaa;">
                        Veya aşağıdaki <strong>Manuel Kod Girişi</strong> bölümünü kullanınız
                    </p>
                </div>
            </div>
        `;
        addTestButton();
    });
}

function testCameraAccess() {
    console.log('Kamera erişimi test ediliyor...');
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
        console.log('✅ Kamera başarıyla açıldı!');
        stream.getTracks().forEach(track => track.stop());
        alert('✅ Kamera çalışıyor! Sayfayı yenileyin.');
        location.reload();
    })
    .catch(function(error) {
        console.error('❌ Kamera hatası:', error);
        alert('❌ Kamera erişilemedi: ' + error.message);
    });
}

function startQRScanner(scannerDiv) {
    console.log('QR Scanner başlatılıyor...');
    
    try {
        const html5QrcodeScanner = new Html5QrcodeScanner(
            "scanner",
            { 
                fps: 20,
                qrbox: { width: 350, height: 350 },
                rememberLastUsedCamera: true,
                showTorchButtonIfSupported: true,
                showZoomSliderIfSupported: true,
                defaultZoomValueIfSupported: 1
            },
            false
        );
        
        // Global instance kaydet (kamera seçim için)
        html5scanner = html5QrcodeScanner;
        
        // Render operasyonunu try-catch ile sarıla
        try {
            let scanAttempts = 0;
            
            html5QrcodeScanner.render(
                function onScanSuccess(decodedText, decodedResult) {
                    console.log('✅ QR Kod başarıyla tarandı!');
                    console.log('Tarama sayısı:', ++scanAttempts);
                    console.log('QR veri:', decodedText.substring(0, 50) + '...');
                    html5QrcodeScanner.pause(true);
                    processMedicineData(decodedText);
                },
                function onScanFailure(error) {
                    // Sessiz devam et
                    console.debug('Tarama devam ediyor... (' + (++scanAttempts) + ' deneme)');
                }
            );
            console.log('✅ QR Scanner başarıyla başlatıldı - Tarama aktif');
            console.log('💡 İpucu: QR kodu kamera karesi içine getirin ve iyi aydınlık sağlayın');
            
            // Kamera listesini yükle
            loadAvailableCameras();
            
        } catch (renderError) {
            console.error('Render hatası:', renderError);
            console.log('Tarama hata ile yüklendi ama çalışabilir');
        }
        
    } catch (error) {
        console.error('QR Scanner başlatılamadı:', error);
        scannerDiv.innerHTML = `
            <div style="
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, #1f2937, #374151);
                color: white;
                text-align: center;
                padding: 20px;
                font-size: 1.2rem;
            ">
                <div>
                    <p>⚠️ QR Tarayıcı Çalışmıyor</p>
                    <p style="font-size: 0.9rem; margin-top: 1rem; color: #ccc;">
                        ${error.message || 'Teknoloji desteği yoktur.'}
                    </p>
                    <p style="font-size: 0.8rem; margin-top: 0.8rem; color: #aaa;">
                        Lütfen aşağıdaki <strong>Manuel Kod Girişi</strong> bölümünü kullanınız
                    </p>
                </div>
            </div>
        `;
        addTestButton();
    }
}

// Test için örnek veri gönder
function addTestButton() {
    const instructions = document.querySelector('.scanner-instructions');
    const testBtn = document.createElement('button');
    testBtn.className = 'btn btn-secondary';
    testBtn.style.marginTop = '1rem';
    testBtn.textContent = '🧪 Test Verisi Yükle';
    testBtn.onclick = loadTestData;
    instructions.appendChild(testBtn);
}

// Kullanılabilir kameraları listele ve dropdown'ı doldur
async function loadAvailableCameras() {
    try {
        const devices = await Html5Qrcode.getCameras();
        console.log('📷 Bulunan kameralar:', devices);
        
        if (devices && devices.length > 0) {
            const select = document.getElementById('cameraSelect');
            select.innerHTML = ''; // Temizle
            
            devices.forEach((device, index) => {
                const option = document.createElement('option');
                option.value = device.id;
                
                // Kamera adını belirle
                let cameraLabel = device.label;
                if (!cameraLabel || cameraLabel.trim() === '') {
                    cameraLabel = `Kamera ${index + 1}`;
                }
                
                // Ön/arka kamera tahmini (genellikle id'de yazılıdır)
                if (device.id.includes('front') || cameraLabel.toLowerCase().includes('ön')) {
                    cameraLabel = '📱 Ön Kamera - ' + cameraLabel;
                } else if (device.id.includes('back') || cameraLabel.toLowerCase().includes('arka')) {
                    cameraLabel = '📷 Arka Kamera - ' + cameraLabel;
                } else {
                    cameraLabel = '📷 ' + cameraLabel;
                }
                
                option.textContent = cameraLabel;
                option.title = `Kamera ID: ${device.id}`;
                
                // İlk kamerayı otomatik seç
                if (index === 0) {
                    option.selected = true;
                }
                
                select.appendChild(option);
            });
            
            if (devices.length > 1) {
                const select = document.getElementById('cameraSelect');
                select.addEventListener('change', function() {
                    if (this.value) {
                        switchCamera(this.value);
                    }
                });
                console.log(`✅ ${devices.length} kamera bulundu, kamera seçim aktif edildi`);
            } else {
                console.log('ℹ️ Sadece 1 kamera bulundu');
            }
        } else {
            console.warn('⚠️ Kamera bulunamadı');
            const select = document.getElementById('cameraSelect');
            select.innerHTML = '<option value="">Kamera bulunamadı</option>';
        }
    } catch (error) {
        console.error('❌ Kameara listesi alınamadı:', error);
        const select = document.getElementById('cameraSelect');
        select.innerHTML = '<option value="">Hata: ' + error.message + '</option>';
    }
}

// Kamerayı değiştir
async function switchCamera(deviceId) {
    try {
        if (!html5scanner) {
            console.error('Scanner henüz başlatılmadı');
            return;
        }
        
        console.log('📷 Kamera değiştiriliyor: ' + deviceId);
        
        // Scanner'ı durdur
        await html5scanner.stop();
        
        // QR Container'ı temizle
        const scannerDiv = document.getElementById('scanner');
        scannerDiv.innerHTML = '';
        
        // Yeni kamera ile başlat
        try {
            await html5scanner.start(
                { facingMode: { exact: deviceId } },
                { fps: 20, qrbox: { width: 350, height: 350 } },
                function onScanSuccess(decodedText, decodedResult) {
                    console.log('✅ QR Kod başarıyla tarandı!');
                    console.log('QR veri:', decodedText.substring(0, 50) + '...');
                    html5scanner.pause(true);
                    processMedicineData(decodedText);
                },
                function onScanFailure(error) {
                    console.debug('Tarama devam ediyor...');
                }
            );
            console.log('✅ Kamera başarıyla değiştirildi');
        } catch (innerError) {
            // Fallback: deviceId yerine facingMode kullan
            console.warn('Device ID ile başlatma başarısız, facingMode kullanılıyor:', innerError);
            await html5scanner.start(
                { facingMode: 'environment' },
                { fps: 20, qrbox: { width: 350, height: 350 } },
                function onScanSuccess(decodedText, decodedResult) {
                    console.log('✅ QR Kod başarıyla tarandı!');
                    html5scanner.pause(true);
                    processMedicineData(decodedText);
                },
                function onScanFailure(error) {
                    console.debug('Tarama devam ediyor...');
                }
            );
        }
    } catch (error) {
        console.error('❌ Kamera değiştirilirken hata:', error);
        alert('⚠️ Kamera değiştirilirken hata meydana geldi: ' + error.message);
        location.reload();
    }
}

// Test verileri yükle
function loadTestData() {
    const testData = {
        patientName: 'Ayşe Yılmaz',
        medicineName: 'Ibuprofen 500mg',
        purpose: 'Baş ağrısı ve ateş düşürmek için',
        dosage: '500 mg',
        frequency: 'Günde 2 kez, 5 gün süreyle',
        specialCondition: 'Hamilelik döneminde dikkat, su ile alınız',
        createdAt: new Date().toISOString()
    };
    
    displayMedicineInfo(testData);
}

// QR Koddan çıkan veriyi işle
function processMedicineData(encodedData) {
    console.log('processMedicineData çağrıldı, veri uzunluğu:', encodedData.length);
    
    try {
        // Base64 dekodla (UTF-8 desteği ile)
        console.log('Base64 dekodu başlatılıyor...');
        const jsonString = decodeURIComponent(escape(atob(encodedData)));
        console.log('Dekodan sonra veri:', jsonString.substring(0, 100) + '...');
        
        const medicineData = JSON.parse(jsonString);
        console.log('✅ Veri başarıyla işlendi:', medicineData);
        
        displayMedicineInfo(medicineData);
    } catch (error) {
        console.error('❌ Veri işlenirken hata:', error);
        console.error('Kodlanmış veri:', encodedData.substring(0, 100) + '...');
        alert('❌ QR Kod okundu, fakat veri işlenirken hata oluştu. Manuel giriş bölümünü kullanınız.');
    }
}

// İlaç bilgilerini göster
function displayMedicineInfo(data) {
    currentMedicineData = data;
    
    let infoHTML = `
        <div>
            <strong>👤 Reçete Sahibinin Adı:</strong>
            <p>${escapeHtml(data.patientName)}</p>
        </div>
        <div>
            <strong>💊 İlacın Adı:</strong>
            <p>${escapeHtml(data.medicineName)}</p>
        </div>
        <div>
            <strong>🏥 Endikasyon:</strong>
            <p>${escapeHtml(data.purpose)}</p>
        </div>
        <div>
            <strong>📏 Kullanım Dozu:</strong>
            <p>${escapeHtml(data.dosage)}</p>
        </div>
        <div>
            <strong>⏰ Kullanım Periyodu:</strong>
            <p>${escapeHtml(data.frequency)}</p>
        </div>
        ${data.specialCondition ? `
        <div>
            <strong>⚠️ Özel Durum:</strong>
            <p>${escapeHtml(data.specialCondition)}</p>
        </div>
        ` : ''}
    `;
    
    document.getElementById('medicineInfo').innerHTML = infoHTML;
    
    // Ses kontrol butonlarını göster
    document.getElementById('audioControls').style.display = 'block';
    
    // Otomatik seslendir
    setTimeout(() => speakAllInfo(), 500);
}

// Tüm bilgileri sesli oku
function speakAllInfo() {
    if (!currentMedicineData) {
        alert('Önce bir QR kod tarayınız.');
        return;
    }

    // Ses tarayıcı tarafından durdurulmuşsa temizle
    if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        return;
    }

    const data = currentMedicineData;

    const text = `
        Reçete Sahibinin Adı: ${data.patientName}.
        İlacın Adı: ${data.medicineName}.
        Endikasyon: ${data.purpose}.
        Kullanım Dozu: ${data.dosage}.
        Kullanım Periyodu: ${data.frequency}.
        ${data.specialCondition ? `Özel Durum: ${data.specialCondition}.` : ''}
    `;

    // Web Speech API kullanarak seslendir
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    utterance.rate = 0.9; // Daha yavaş konuş
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = function() {
        isSpeaking = true;
        console.log('Metin seslendirilmeye başlandı');
    };

    utterance.onend = function() {
        isSpeaking = false;
        console.log('Metin seslendirilme tamamlandı');
    };

    utterance.onerror = function(event) {
        console.error('Konuşma hatası:', event);
        alert('Sesli okuma başarısız oldu. Lütfen tarayıcınızın ayarlarını kontrol ediniz.');
    };

    window.speechSynthesis.speak(utterance);
}

// Seslendirmeyi durdur
function stopSpeaking() {
    window.speechSynthesis.cancel();
    isSpeaking = false;
}

// Sesi aç/kapat
function toggleVolume() {
    if (isSpeaking) {
        stopSpeaking();
    } else {
        speakAllInfo();
    }
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
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

// Enter tuşu ile form gönder
document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('manualInput');
    if (textarea) {
        textarea.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                processManualInput();
            }
        });
    }
});

// Erişilebilirlik: Durum açıklamaları
function announceToScreenReader(text) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.textContent = text;
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    document.body.appendChild(announcement);
    
    setTimeout(() => announcement.remove(), 1000);
}
