# 📋 Rencana Implementasi: Perbaikan Masalah Klik Link/Tombol pada Lingkungan Lokal (admin.html & index.html) Serta Kepatuhan Penuh Google Apps Script

## 📌 1. Investigasi Akar Masalah (*Root Cause Analysis*)
Berdasarkan log peramban dan status sesi pengguna:
1. **Penyebab Utama 1 - admin.html Dibuka Mandiri Tanpa Script**:
   - Pengguna membuka berkas [admin.html](file:///f:/repository/stemsites/admin.html) secara langsung di browser melalui protokol `file:///F:/repository/stemsites/admin.html`.
   - Sebelumnya `admin.html` dirancang murni sebagai partial template untuk di-include oleh Google Apps Script (`<?!= include('admin'); ?>`), sehingga di dalam `admin.html` **sama sekali tidak ada tag `<script>` JavaScript dan tag `<style>` CSS**.
   - Ketika pengguna mengklik tombol *"Isi PIN Demo"*, *"Masuk Admin"*, tab menu, atau link di `admin.html`, peramban memunculkan error: `ReferenceError: ... is not defined`, dan halaman tidak merespon sama sekali (*unclickable*).
2. **Penyebab Utama 2 - Pembatasan Keamanan Browser (CORS pada file:///)**:
   - Pada [index.html](file:///f:/repository/stemsites/index.html), skrip lokal mengandalkan `fetch("styles.html")` dan `fetch("scripts.html")`.
   - Pada peramban Google Chrome / Microsoft Edge, protokol `file:///` secara tegas memblokir `fetch()` antar berkas lokal dengan alasan keamanan Same-Origin Policy (`origin 'null' blocked by CORS`). Akibatnya, saat `index.html` dibuka langsung dari Windows Explorer tanpa web server, skrip dan styling juga gagal dimuat.

---

## 🎯 2. Ruang Lingkup Solusi & Perbaikan (Scope)

### A. Kemandirian Penuh [admin.html](file:///f:/repository/stemsites/admin.html) (*Standalone-Ready*)
- Lengkapi `admin.html` dengan struktur HTML valid (`<!DOCTYPE html>`, `<head>`, link FontAwesome, font Plus Jakarta Sans, terintegrasi styling dan skrip fungsional lengkap).
- Pastikan saat dibuka langsung di browser:
  - Form PIN Admin langsung responsif, tombol *"Isi PIN Demo (123456)"* otomatis mengisi PIN.
  - Tombol *"Masuk Admin"* memverifikasi PIN dan langsung membuka dashboard admin.
  - Tab *"Kelola Card Materi"*, *"Pengaturan Logo & Sekolah"*, *"Panduan Admin"*, dan *"Step Deploy & Kode GAS"* dapat diklik dan berpindah dengan mulus.
  - Tombol *"Salin Kode Berkas"* dan selector 5 berkas bekerja 100%.
- Saat di-include oleh Google Apps Script (`<?!= include('admin'); ?>`), tetap kompatibel tanpa menimbulkan konflik.

### B. Kemandirian Penuh [index.html](file:///f:/repository/stemsites/index.html) (*Offline & GAS Bulletproof*)
- Hilangkan ketergantungan pada `fetch()` lokal yang diblokir oleh CORS browser pada protokol `file:///`.
- Sematkan stylesheet dan skrip inti langsung di dalam dokumen `index.html` untuk mode offline, sembari tetap menyertakan tag include evaluasi Google Apps Script:
  - `<?!= include('styles'); ?>`
  - `<?!= include('admin'); ?>`
  - `<?!= include('scripts'); ?>`
- Dengan cara ini:
  - Dibuka via `file:///index.html` (double click di Explorer): **LANGSUNG BERFUNGSI 100%**.
  - Diterapkan ke Google Apps Script: **LANGSUNG DIEVALUASI OLEH SERVER GOOGLE SECARA MODULAR 100%**.

### C. Server Lokal Pendukung (*Local Development Server*)
- Sediakan server HTTP lokal ringan di background pada port 3000 / 8080 agar pengguna juga dapat membuka via `http://localhost:3000` secara lancar tanpa hambatan CORS browser apa pun.

---

## 🏗️ 3. Inventaris Berkas
- [admin.html](file:///f:/repository/stemsites/admin.html): Pembungkusan standalone dengan CSS dan JS fungsional.
- [index.html](file:///f:/repository/stemsites/index.html): Integrasi CSS & JS mandiri bebas blokir CORS offline.
- [styles.html](file:///f:/repository/stemsites/styles.html) & [scripts.html](file:///f:/repository/stemsites/scripts.html): Berkas modular resmi untuk editor Google Apps Script.
- [docs/WALKTHROUGH-stem-gas-webapp.md](file:///f:/repository/stemsites/docs/WALKTHROUGH-stem-gas-webapp.md): Pembaruan panduan pengujian klik offline.
- [CHANGELOG.md](file:///f:/repository/stemsites/CHANGELOG.md): Pembaruan versi SemVer ke `v1.4.1`.

---

## 🔄 4. Tahapan SOP Baku
- [x] **Fase 1**: Implementation Plan & Gerbang Persetujuan Pengguna (Disetujui Pengguna "ya").
- [x] **Fase 2**: Eksekusi perbaikan pada `admin.html` dan `index.html`.
- [x] **Fase 3**: Verifikasi walkthrough klik tombol/link di browser lokal.
- [x] **Fase 4**: Pembaruan `CHANGELOG.md` (v1.4.1).
- [x] **Fase 5**: Commit dan tag Git Conventional Commits `v1.4.1`, serta push ke remote.
