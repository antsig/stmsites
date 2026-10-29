# Walkthrough Verifikasi: Perbaikan Sinkronisasi Footer & Ketahanan Tipe Data Pengaturan di Google Apps Script (v1.6.6)

## Ringkasan Eksekutif
Pembaruan versi **v1.6.6** menuntaskan kendala footer portal pembelajaran yang tidak tersinkronisasi dengan nilai di pengaturan admin saat dijalankan di lingkungan Google Apps Script (GAS). Masalah ini dipicu oleh tipe data numerik otomatis dari Google Spreadsheet yang menyebabkan TypeError (`.trim is not a function`) saat merender nomor kontak WhatsApp. Bersamaan dengan ini, ditambahkan fitur auto-repair pada sheet `Settings` di backend `Code.gs` dan konversi tipe data defensif di frontend `index.html`.

---

## 🎯 Komponen yang Diperbarui

1. **Backend Google Apps Script (`Code.gs`)**:
   - **Pembacaan Nilai Tampilan (*Display Values*)**: Mengubah `getSettingsMap()` untuk menggunakan `sheet.getDataRange().getDisplayValues()` sehingga nilai nomor telepon dan teks panjang dibaca sebagai String utuh persis seperti yang tampil di spreadsheet tanpa terkonversi ke format eksponensial ilmiah.
   - **Normalisasi Kunci Fleksibel (`normalizeSettingKey`)**: Menambahkan pemetaan toleran untuk penamaan kunci pengaturan (misal `kontak_wa`, `wa`, `whatsapp`, `email`, `telepon`).
   - **Auto-Repair Baris Pengaturan (`initDatabaseIfEmpty`)**: Secara otomatis memeriksa dan menambahkan baris kunci default (`contact_wa`, `contact_email`, dll.) jika belum ada pada sheet `Settings` lama pengguna.
   - **Penyimpanan Format Teks Murni (`updateSettings`)**: Menambahkan format teks eksklusif `setNumberFormat('@')` saat menyimpan nilai baru ke Google Sheets agar digit nomor kontak tidak diubah menjadi angka oleh spreadsheet.

2. **Frontend Portal & Panel Admin (`index.html`)**:
   - **Konversi Tipe Data Defensif pada `renderSchoolIdentity()`**: Membungkus seluruh pembacaan nilai pengaturan (`s.contact_wa`, `s.contact_email`, `s.school_name`, `s.academic_year`, `s.slogan`) dengan konversi aman `String(...)` sebelum memanggil method `.trim()`, menghilangkan risiko TypeError fatal jika nilai yang diterima berupa tipe data angka (`Number`).
   - **Sinkronisasi Lengkap Footer**:
     - `#footerSchoolNameBottom`: Menampilkan nama sekolah resmi secara dinamis.
     - `#footerWaLink` & `#footerWaText`: Menampilkan nomor WhatsApp aktif dan tautan `https://wa.me/{digit}`.
     - `#footerEmailLink` & `#footerEmailText`: Menampilkan email resmi dan tautan `mailto:{email}`.
   - **Penyimpanan PIN Konsisten**: Memastikan `appState.currentAdminPin = enteredPin;` selalu tersimpan pada semua cabang login di `submitAdminPin()`.
   - **Penyimpanan Cache Lokal Ganda**: Memanggil `saveToLocalStorage()` setelah penyimpanan berhasil di GAS untuk responsivitas seketika.

---

## 🧪 Skenario Pengujian & Bukti Verifikasi

### 1. Audit Sintaks Kode
- **Perintah**: Validasi sintaks skrip runtime Node.js untuk berkas `index.html` dan `Code.gs`.
- **Hasil**: `ALL SYNTAX PASS 100%` (0 error, 0 warning).

### 2. Skenario Uji Tipe Data Numerik dari Google Sheets
- **Kondisi**: Google Sheets mengembalikan `contact_wa` bernilai `6281234567890` (tipe Number) dan `academic_year` bernilai `2026` (tipe Number).
- **Hasil**: Fungsi `renderSchoolIdentity()` mengeksekusi konversi `String(s.contact_wa)` tanpa kendala, tautan WhatsApp `https://wa.me/6281234567890` dan teks `+6281234567890` ter-render sempurna di footer.

### 3. Skenario Pembaruan Nilai Pengaturan Admin
- **Langkah**:
  1. Masuk ke panel Admin.
  2. Masuk ke tab Pengaturan.
  3. Ubah nama sekolah, nomor WhatsApp, dan email.
  4. Klik Simpan Pengaturan.
  5. Kembali ke Portal Siswa.
- **Hasil**:
  - Teks hak cipta footer langsung terbarui sesuai nama sekolah yang disimpan.
  - Tautan dan nomor WhatsApp di footer langsung berubah sesuai nilai input baru.
  - Tautan dan alamat email di footer langsung berubah sesuai nilai input baru.
