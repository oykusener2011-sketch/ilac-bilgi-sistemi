@echo off
REM EmailJS Kodu Ayarla - Windows Batch Script
REM Bu script, EmailJS kodlarınızı script.js dosyasına otomatik olarak yazacak

setlocal enabledelayedexpansion

echo.
echo ============================================
echo  EmailJS E-POSTA KURULUMU
echo ============================================
echo.
echo Asagidaki 3 kodu EmailJS sitesinden kopyala:
echo.
echo 1. Public Key
echo 2. Service ID
echo 3. Template ID (template_ilac_mesaj)
echo.

set /p PUBLIC_KEY="1. Public Key'i Yapistir: "
set /p SERVICE_ID="2. Service ID'yi Yapistir: "
set /p TEMPLATE_ID="3. Template ID'yi Yapistir: "

echo.
echo Kodlar ayarlanıyor...
echo.

REM script.js dosyasını oku ve değiştir (Windows'ta)
powershell -Command ^
"$content = Get-Content 'script.js' -Raw; " ^
"$content = $content -replace 'const PUBLIC_KEY = \"[^\"]*\";', 'const PUBLIC_KEY = \"%PUBLIC_KEY%\";'; " ^
"$content = $content -replace 'const SERVICE_ID = \"[^\"]*\";', 'const SERVICE_ID = \"%SERVICE_ID%\";'; " ^
"$content = $content -replace 'const TEMPLATE_ID = \"[^\"]*\";', 'const TEMPLATE_ID = \"%TEMPLATE_ID%\";'; " ^
"Set-Content 'script.js' $content"

echo.
echo ✅ BITTI! Kodlar kaydedildi.
echo.
echo Simdik Web Sitesini Ac:
echo http://localhost:8000
echo.
echo İletişim bölümünde test mesajı gönder!
echo.
pause
