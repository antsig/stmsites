# 📋 Rencana Implementasi: Panduan Deploy Lengkap Google Apps Script Beserta Seluruh Skrip

## 📌 1. Konteks & Latar Belakang Masalah
Pengguna meminta: *"lengkapi bagian pnduan deploy, lengkap dengan semua skripnya"*.
Saat ini:
1. Di Dashboard Admin (Tab **"Step Deploy & Kode GAS"** pada [admin.html](file:///f:/repository/stemsites/admin.html)), panduan deploy masih terlalu ringkas dan hanya menampilkan 15 baris potongan `Code.gs`. Skrip lengkap 418 baris `Code.gs` serta 4 berkas HTML lainnya (`index.html`, `styles.html`, `admin.html`, `scripts.html`) belum tersedia untuk disalin langsung oleh guru/pengelola sekolah.
2. Di repositori dokumen belum ada panduan deployment langkah-demi-langkah komprehensif (*Step-by-Step Developer & Administrator Runbook*) yang memandu proses dari pembuatan Google Spreadsheet baru, pembuatan 5 berkas di editor Apps Script, otorisasi izin Google, penyetelan akses web app publik, hingga uji coba web app.

---

## 🎯 2. Ruang Lingkup Perubahan (Scope)

### A. Integrasi Skrip Lengkap di Tab Deploy Admin ([admin.html](file:///f:/repository/stemsites/admin.html) & [scripts.html](file:///f:/repository/stemsites/scripts.html))
1. **Selector Berkas Interaktif (Tab/Selector 5 Berkas)**:
   - Sediakan tombol tab berkas di dalam panel deploy:
     * 📄 `Code.gs` (Backend script lengkap 418 baris dengan `doGet`, `include`, `initDatabaseIfEmpty`, `getInitialData`, `updateSettings`, `saveMaterial`, `deleteMaterial`, `seedInitialData`)
     * 🌐 `index.html` (Template shell utama)
     * 🎨 `styles.html` (Modular CSS)
     * 🛠️ `admin.html` (Modular Admin View)
     * ⚡ `scripts.html` (Modular JavaScript Frontend)
   - Tombol **Salin Kode (Copy to Clipboard)** 1-klik untuk setiap berkas yang dipilih, lengkap dengan notifikasi toast konfirmasi.
   - Kotak kode (*code display box*) yang nyaman dibaca, dapat digulir, dan memiliki label petunjuk nama berkas di editor GAS.
2. **Panduan Visual Tahap Demi Tahap (*7-Step Deployment Flow*)**:
   - Langkah 1: Buat Google Spreadsheet baru di `sheets.new`.
   - Langkah 2: Buka menu *Ekstensi* > *Apps Script*.
   - Langkah 3: Buat 1 file Script (`Code.gs`) dan 4 file HTML (`index`, `admin`, `styles`, `scripts`) - catat tanpa ekstensi `.html` di editor GAS.
   - Langkah 4: Salin dan tempel kode masing-masing berkas.
   - Langkah 5: Simpan proyek (*Save Project* / Ctrl+S).
   - Langkah 6: Klik *Deploy (Terapkan)* > *New Deployment (Penerapan Baru)* > pilih jenis *Web App (Aplikasi Web)*. Konfigurasi:
     * Deskripsi: "Rilis Produksi Portal STEM"
     * Jalankan sebagai: "Saya (email@sekolah.sch.id)"
     * Siapa yang memiliki akses: "Siapa saja (Anyone)"
   - Langkah 7: Klik *Deploy*, lakukan Otorisasi Izin Akun Google (*Review Permissions* > *Advanced* > *Go to (unsafe)* > *Allow*), lalu salin URL Web App yang dihasilkan.

### B. Pembuatan Dokumen Panduan Deploy Mandiri ([docs/04-deployment/PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md](file:///f:/repository/stemsites/docs/04-deployment/PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md))
- Dokumen markdown lengkap siap cetak/baca untuk admin sekolah, mencakup:
  - Prasyarat akun Google (Akun Gmail biasa atau Google Workspace for Education / belajar.id).
  - Panduan langkah demi langkah disertai skrip lengkap 5 berkas.
  - Cara kustomisasi PIN Admin awal (`123456`).
  - Cara menghubungkan database dan struktur kolom sheet `Settings` dan `Materi`.
  - FAQ & Troubleshooting otorisasi Google ("Google hasn't verified this app", error CORS, atau izin akses domain sekolah).

---

## 🏗️ 3. Inventaris Berkas
- [admin.html](file:///f:/repository/stemsites/admin.html): Perluasan antarmuka tab deploy dengan file selector 5 berkas, tombol copy interaktif, dan panduan terstruktur.
- [scripts.html](file:///f:/repository/stemsites/scripts.html): Penambahan fungsi `switchDeployFile(filename)`, penyediaan payload isi skrip lengkap 5 berkas, dan fungsi `copyCurrentDeployCode()`.
- [styles.html](file:///f:/repository/stemsites/styles.html): Penyesuaian styling tab selector deploy code dan code box.
- [docs/04-deployment/PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md](file:///f:/repository/stemsites/docs/04-deployment/PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md): Berkas panduan deploy lengkap teknis & operasional.
- [CHANGELOG.md](file:///f:/repository/stemsites/CHANGELOG.md): Pembaruan versi SemVer ke `v1.4.0`.
- [docs/WALKTHROUGH-stem-gas-webapp.md](file:///f:/repository/stemsites/docs/WALKTHROUGH-stem-gas-webapp.md): Pembaruan panduan pengujian tab deploy.

---

## 🔄 4. Tahapan SOP Baku
- [x] **Fase 1**: Implementation Plan & Gerbang Persetujuan Pengguna (Disetujui Pengguna "ya").
- [x] **Fase 2**: Eksekusi perubahan pada `admin.html`, `scripts.html`, `styles.html`, dan pembuatan panduan deploy dokumen.
- [x] **Fase 3**: Verifikasi walkthrough dan pengujian browser selector kode deploy.
- [x] **Fase 4**: Pembaruan `CHANGELOG.md` (v1.4.0).
- [x] **Fase 5**: Commit dan tag Git Conventional Commits `v1.4.0`, serta push ke remote.
