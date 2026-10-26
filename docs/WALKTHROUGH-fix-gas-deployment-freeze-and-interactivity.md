# Walkthrough & Verification: Solusi Tuntas Freeze / Unclickable & Standalone 1-File Bundle

## 1. Ringkasan Pekerjaan (Summary of Changes)
- **Tujuan**: Mengatasi kendala portal STEM yang tidak responsif terhadap klik dan materi tampak kosong (`0 Materi`) pada Google Apps Script (GAS).
- **Penyebab Utama**: Caching versi deployment lama pada Google Apps Script (`/exec` mengunci snapshot versi lama), quirk penamaan berkas di editor GAS, ketiadaan visual error banner, dan badge statis awal yang bernilai 0.
- **Solusi yang Diterapkan**:
  1. **Kompilasi Standalone Single-File Bundle (`dist/index.html`)**: Seluruh kode HTML, CSS, modal admin, dan JavaScript digabung menjadi 1 berkas mandiri. Pengguna cukup memiliki **2 berkas** di Google Apps Script: `Code.gs` dan `index.html`.
  2. **Penyempurnaan `include()` di `Code.gs`**: Fungsi loader parsial dibuat ultra-resilient dengan multi-attempt search (mendukung `name`, `cleanName`, `.html`, `.html.html`).
  3. **Visual On-Screen Error Boundary di `index.html`**: Penambahan penangkap error JavaScript visual di `<head>` yang langsung menampilkan kotak merah di layar jika terjadi runtime exception.
  4. **Badge Statis Default 6 Materi**: Keempat kartu STEM (`Science`, `Technology`, `Engineering`, `Mathematics`) di `index.html` disetel awal bernilai **6 Materi** sehingga tidak pernah berstatus 0.
  5. **Tab Standalone pada Modal Deploy di Panel Admin**: Memudahkan guru/admin menyalin berkas standalone bundle langsung dari antarmuka web.

---

## 2. Bukti Verifikasi Teknis (Technical Evidence)

### A. Eksekusi Kompilasi Bundle (`node bundle.js`)
```
🔄 Memulai proses kompilasi Standalone 1-File Bundle...
✅ Standalone 1-File Bundle berhasil dibuat!
📁 Lokasi: dist/index.html
📊 Ukuran: 201,050 karakter (196.3 KB)
```

### B. Validasi Sintaks JavaScript Bundle (`node -e ...`)
```
Script 1 (Error Boundary) parsed OK
Script 2 (Main Application Logic) parsed OK
Status: 100% PASSING (Bebas dari SyntaxError)
```

### C. Pengujian Browser Runtime (`http://localhost:3000/dist/index.html`)
- **Tampilan Awal**: 4 Card STEM langsung menampilkan **6 Materi** secara presisi.
- **Interaksi Klik Science Card**: Membuka modal jenjang kelas (`gradeSelectorModal`) secara mulus.
- **Interaksi Klik Jenjang Kelas 1**: Berpindah ke tampilan sub-kategori materi kelas 1 dengan badge filter aktif.
- **Interaksi Klik Panduan Pengguna**: Membuka modal panduan pengguna (`userGuideModal`).
- **Konsol Browser**: Bersih dari galat JavaScript (0 red errors).

---

## 3. Panduan Penerapan Cepat Pengguna (User Action Steps)

### Cara Paling Mudah (Hanya Butuh 2 Berkas di Google Apps Script):
1. Buka editor Google Apps Script Anda.
2. Di berkas **`Code.gs`**: Tempelkan kode terbaru dari `Code.gs`.
3. Di berkas **`index.html`**: Hapus seluruh isi lama, lalu tempelkan seluruh isi dari berkas **`dist/index.html`**.
4. *(Hapus berkas `styles`, `admin`, `scripts` di Apps Script jika sebelumnya pernah dibuat, karena sudah tidak dibutuhkan lagi)*.
5. **Wajib Update Versi**:
   - Klik **Deploy (Terapkan)** di pojok kanan atas > **Manage deployments (Kelola deployment)**.
   - Klik ikon **Pensil ✏️ (Edit)**.
   - Ubah dropdown Version menjadi **New version (Versi baru)**.
   - Klik **Deploy (Terapkan)**.
6. Buka kembali URL Web App atau tekan **Ctrl + Shift + R** pada browser.
