// İLAÇ BİLGİ SİSTEMİ - Birleşik Platform (Eczacı + Hasta sekmesi)

// ==================== FIREBASE BAŞLATMA ====================
const firebaseConfig = {
  apiKey: "AIzaSyC34zHTXKJHtEJ0LduOwV2bnWEeeV2sAK8",
  authDomain: "ilac-bilgi-sistemi-53238.firebaseapp.com",
  databaseURL: "https://ilac-bilgi-sistemi-53238-default-rtdb.firebaseio.com",
  projectId: "ilac-bilgi-sistemi-53238",
  storageBucket: "ilac-bilgi-sistemi-53238.firebasestorage.app",
  messagingSenderId: "1057703306085",
  appId: "1:1057703306085:web:298b723fb9c41bc454778c"
};

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
    console.error('❌ Firebase SDK yüklenmedi');
  }
} catch (error) {
  console.error('❌ Firebase başlatılması başarısız:', error);
}

// ==================== TAB SWITCHING ====================
function switchTab(tabName) {
  // Tüm tab'ları gizle
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => tab.classList.remove('active'));
  
  // Tüm butonlardan aktif class'ını kaldır
  const buttons = document.querySelectorAll('.tab-button');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  // Seçili tab'ı göster
  document.getElementById(tabName).classList.add('active');
  
  // Seçili butona aktif class'ını ekle
  event.target.classList.add('active');
  
  console.log('📄 Sekme değiştirildi:', tabName);
  
  // QR Tara sekmesine geçilirse tarayıcı init et
  if (tabName === 'qr-scan') {
    setTimeout(() => {
      if (typeof Html5QrcodeScanner !== 'undefined' && !window.scannerInitialized) {
        initializeScanner();
      }
    }, 500);
  }
}

// ==================== ECZACI PANELİ - PHARMACIST FUNCTIONS ====================

let currentSessionId = null;
let listeningToSession = false;

document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ App yüklendi');
  
  // Pharmacist form listener
  const form = document.getElementById('medicineForm');
  if (form) {
    form.addEventListener('input', updatePreview);
    console.log('✅ Form listener bağlandı');
  }
  
  updatePreview();
});

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

  if (!patientName || !medicineName || !purpose || !dosage || !frequency) {
    alert('Lütfen tüm zorunlu alanları doldurunuz.');
    return;
  }

  const medicineData = {
    patientName,
    medicineName,
    purpose,
    dosage,
    frequency,
    specialCondition: specialCondition || 'Yoktur',
    createdAt: new Date().toISOString()
  };

  const jsonString = JSON.stringify(medicineData);
  const utf8String = unescape(encodeURIComponent(jsonString));
  const encodedData = btoa(utf8String);

  currentSessionId = 'SESSION_' + Math.random().toString(36).substr(2, 9).toUpperCase();
  console.log('Session ID oluşturuldu:', currentSessionId);
  
  const qrUrl = window.location.href.split('?')[0].split('#')[0] + '?session=' + currentSessionId;

  if (database) {
    try {
      await database.ref('sessions/' + currentSessionId).set({
        createdAt: new Date().toISOString(),
        status: 'waiting',
        medicineData: medicineData
      });
      console.log('✅ Firebase Session oluşturuldu');

      if (!listeningToSession) {
        listeningToSession = true;
        database.ref('sessions/' + currentSessionId + '/medicineData').on('value', (snapshot) => {
          if (snapshot.exists()) {
            const receivedData = snapshot.val();
            console.log('📱 Veri alındı:', receivedData);
            playReceivedData(receivedData);
          }
        });
      }
    } catch (error) {
      console.warn('Firebase hatası (devam ediliyor):', error);
    }
  }

  const qrContainer = document.getElementById('qrCodeOutput');
  qrContainer.innerHTML = '';

  try {
    new QRCode(qrContainer, {
      text: qrUrl,
      width: 250,
      height: 250,
      correctLevel: QRCode.CorrectLevel.H,
      colorDark: '#1f2937',
      colorLight: '#ffffff'
    });

    document.getElementById('qrCode').style.display = 'block';
    alert(`✅ QR Kod başarıyla oluşturuldu!\n\nSession: ${currentSessionId}`);
  } catch (error) {
    console.error('QR Kod hatası:', error);
    alert('❌ QR Kod oluşturulurken hata: ' + error.message);
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
        body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .container { text-align: center; }
        img { max-width: 400px; border: 5px solid #333; padding: 10px; background: white; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>İlaç Bilgisi QR Kodu</h2>
        <img src="${canvas.toDataURL('image/png')}" alt="QR Kod"/>
        <p>Kodu ilaç kutusunun üzerine yapıştırınız</p>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

function playReceivedData(data) {
  if (!data) return;
  
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
  
  speakMedicineInfo(data);
}

function speakMedicineInfo(data) {
  if (!data) return;
  
  if (!('speechSynthesis' in window)) {
    console.error('❌ Web Speech API desteklenmiyor');
    alert('⚠️ Tarayıcınız sesli okuma desteklemiyor. Chrome/Edge/Firefox kullanınız.');
    return;
  }
  
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
  
  utterance.onerror = function(event) {
    console.error('❌ Sesli okuma hatası:', event.error);
  };
  
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

// ==================== HASTA PANELİ - MOBILE FUNCTIONS ====================

let currentMedicineData = null;
let isSpeaking = false;
let html5scanner = null;
let scannerInitialized = false;

function initializeScanner() {
  if (scannerInitialized) return;
  scannerInitialized = true;
  
  console.log('📱 QR Tarayıcı başlatılıyor...');
  
  const scannerDiv = document.getElementById('scanner');
  
  if (typeof Html5QrcodeScanner === 'undefined') {
    console.warn('Html5QrcodeScanner kütüphanesi yüklenmedi');
    scannerDiv.innerHTML = '<p style="color: red; text-align: center; padding: 2rem;">⚠️ Kamera özelliği yüklenemedi</p>';
    return;
  }
  
  navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } })
  .then(function(stream) {
    console.log('✅ Kamera izni verildi');
    stream.getTracks().forEach(track => track.stop());
    startQRScanner(scannerDiv);
  })
  .catch(function(error) {
    console.error('❌ Kamera hatası:', error.message);
    scannerDiv.innerHTML = `<p style="color: red; text-align: center; padding: 2rem;">🚫 Kamera erişimi başarısız: ${error.message}</p>`;
  });
}

function startQRScanner(scannerDiv) {
  try {
    html5scanner = new Html5QrcodeScanner(
      "scanner",
      { 
        fps: 20,
        qrbox: { width: 350, height: 350 },
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true
      },
      false
    );
    
    html5scanner.render(
      function onScanSuccess(decodedText) {
        console.log('✅ QR Kod tarandı:', decodedText.substring(0, 50) + '...');
        html5scanner.pause(true);
        processMedicineData(decodedText);
      },
      function onScanFailure(error) {
        console.debug('Tarama devam ediyor...');
      }
    );
    
    console.log('✅ QR Scanner başlatıldı');
    setTimeout(() => loadAvailableCameras(), 1000);
    
  } catch (error) {
    console.error('QR Scanner hatası:', error);
  }
}

// Kullanılabilir kameraları listele
async function loadAvailableCameras() {
  try {
    console.log('📷 Kameralar yükleniyor...');
    const devices = await Html5Qrcode.getCameras();
    console.log('✅ Bulunan kameralar:', devices);
    
    const select = document.getElementById('cameraSelect');
    if (!select) return;
    
    if (devices && devices.length > 0) {
      select.innerHTML = '';
      
      devices.forEach((device, index) => {
        const option = document.createElement('option');
        option.value = device.id;
        
        let cameraLabel = device.label || `Kamera ${index + 1}`;
        
        if (device.id.includes('front') || cameraLabel.toLowerCase().includes('ön')) {
          cameraLabel = '📱 Ön Kamera - ' + cameraLabel;
        } else if (device.id.includes('back') || cameraLabel.toLowerCase().includes('arka')) {
          cameraLabel = '📷 Arka Kamera - ' + cameraLabel;
        } else {
          cameraLabel = '📷 ' + cameraLabel;
        }
        
        option.textContent = cameraLabel;
        if (index === 0) option.selected = true;
        select.appendChild(option);
      });
      
      select.onchange = null;
      select.addEventListener('change', function() {
        if (this.value) switchCamera(this.value);
      });
      
      if (devices.length > 1) {
        console.log(`✅ ${devices.length} kamera bulundu`);
      }
    }
  } catch (error) {
    console.error('❌ Kamera listesi hatası:', error);
  }
}

// Kamerayı değiştir
async function switchCamera(deviceId) {
  try {
    if (!html5scanner) return;
    
    console.log('📷 Kamera değiştiriliyor: ' + deviceId);
    await html5scanner.stop();
    
    document.getElementById('scanner').innerHTML = '';
    
    await html5scanner.start(
      { facingMode: { exact: deviceId } },
      { fps: 20, qrbox: { width: 350, height: 350 } },
      function onScanSuccess(decodedText) {
        console.log('✅ QR Kod tarandı');
        html5scanner.pause(true);
        processMedicineData(decodedText);
      },
      function onScanFailure(error) {
        console.debug('Tarama devam ediyor...');
      }
    );
    console.log('✅ Kamera değiştirildi');
  } catch (error) {
    console.error('❌ Kamera değiştirilirken hata:', error);
    alert('Kamera değiştirilirken hata: ' + error.message);
  }
}

function processMedicineData(encodedData) {
  console.log('processMedicineData çağrıldı');
  
  if (encodedData.includes('session=')) {
    const urlParams = new URLSearchParams(new URL(encodedData).search);
    const sessionParam = urlParams.get('session');
    if (sessionParam) {
      console.log('Session URL tespit edildi:', sessionParam);
      window.location.href = encodedData;
      return;
    }
  }
  
  try {
    const jsonString = decodeURIComponent(escape(atob(encodedData)));
    const medicineData = JSON.parse(jsonString);
    console.log('✅ Veri işlendi:', medicineData);
    
    displayMedicineInfo(medicineData);
  } catch (error) {
    console.error('❌ Veri işlenirken hata:', error);
    alert('QR Kod okundu, fakat veri işlenirken hata oluştu. Lütfen sayfayı yenileyin.');
  }
}

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
  document.getElementById('audioControls').style.display = 'block';
  
  setTimeout(() => speakAllInfo(), 500);
}

function speakAllInfo() {
  if (!currentMedicineData) {
    alert('Önce bir QR kod tarayınız.');
    return;
  }

  if (!('speechSynthesis' in window)) {
    console.error('❌ Web Speech API desteklenmiyor');
    alert('⚠️ Tarayıcınız sesli okuma desteklemiyor. Chrome/Edge/Firefox kullanınız.');
    return;
  }

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

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'tr-TR';
  utterance.rate = 0.9;

  utterance.onstart = function() {
    isSpeaking = true;
    console.log('🔊 Sesli okuma başlatıldı');
  };

  utterance.onend = function() {
    isSpeaking = false;
    console.log('✅ Sesli okuma tamamlandı');
  };

  utterance.onerror = function(event) {
    isSpeaking = false;
    console.error('❌ Sesli okuma hatası:', event.error);
    alert(`⚠️ Sesli okuma başarısız: ${event.error}\n\nÇözümler:\n- Tarayıcıyı yenileyin\n- Chrome/Edge/Firefox kullanın`);
  };

  console.log('🔊 Sesli okuma başlatılıyor...');
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function stopSpeaking() {
  window.speechSynthesis.cancel();
  isSpeaking = false;
}

function toggleVolume() {
  if (isSpeaking) {
    stopSpeaking();
  } else {
    speakAllInfo();
  }
}

// ==================== ORTAK FONKSİYONLAR ====================

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

// Session parametresi kontrol et
window.addEventListener('load', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionParam = urlParams.get('session');
  
  if (sessionParam) {
    console.log('Session parametresi bulundu:', sessionParam);
    // QR Tara sekmesine geç
    setTimeout(() => {
      switchTab('qr-scan');
      // Session dinleyicisini başlat
      listenToSession(sessionParam);
    }, 500);
  }
});

function listenToSession(sessionId) {
  console.log('Firebase session dinleyicisi başlangıç:', sessionId);
  
  const medicineInfoDiv = document.getElementById('medicineInfo');
  medicineInfoDiv.innerHTML = `
    <div style="background: #fef3c7; padding: 2rem; border-radius: 8px; text-align: center;">
      <p style="font-size: 1.2rem; font-weight: bold; color: #92400e;">⏳ Eczacı panelinden veri bekleniyor...</p>
      <p style="color: #b45309; margin-top: 1rem;">Eczacı panelinde QR kodu tarandıktan sonra bilgiler burada görüntülenecek ve seslendirilecektir.</p>
    </div>
  `;
  
  if (database) {
    database.ref('sessions/' + sessionId + '/medicineData').on('value', (snapshot) => {
      if (snapshot.exists()) {
        const receivedData = snapshot.val();
        console.log('✅ Firebase\'den veri alındı:', receivedData);
        displayMedicineInfo(receivedData);
        speakAllInfo();
      }
    }, (error) => {
      console.error('❌ Firebase dinleyici hatası:', error);
    });
  }
}

console.log('✅ App.js yüklendi - Tüm işlevler hazır');
