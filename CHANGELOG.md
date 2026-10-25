# Changelog

Semua perubahan pada proyek **Portal Pembelajaran STEM Sekolah Berbasis Google Apps Script** dicatat di dokumen ini.
Format penomoran versi mengacu pada [Semantic Versioning (SemVer 2.0.0)](https://semver.org/).

---

## [1.1.0] - 2026-10-25

### Added
- **Arsitektur Pemisahan Modular**:
  - `styles.html` & `style.css`: Pemisahan modular stylesheet dan variabel CSS.
  - `scripts.html` & `app.js`: Pemisahan modular logika JavaScript.
  - `admin.html`: Pemisahan halaman dashboard admin, sidemenu, dan formulir CRUD.
  - `Code.gs`: Integrasi helper `include()` untuk kompilasi modular Google Apps Script.
- **Navigasi 2-Tampilan yang Bersih**:
  - **Beranda Utama Bersih (Home View)**: Hanya memuat identitas sekolah, hero banner ringkas, dan 4 Card Utama STEM. Sub-materi disembunyikan seluruhnya.
  - **Halaman Khusus Sub-Kategori STEM (Category Sub-Page View)**: Terbuka saat salah satu Card STEM diklik, menyembunyikan 4 Card STEM, dan menghadirkan tombol *"⬅️ Kembali ke Kategori Utama STEM"*, header kategori, filter kelas 1-6, filter media, dan grid materi terkait.
- **Kustomisasi Logo 4 Kategori STEM di Admin**:
  - Formulir input URL logo kustom untuk Science, Technology, Engineering, dan Mathematics di Tab Pengaturan Logo & Sekolah.
  - Kotak *Live Preview* untuk memantau perubahan tampilan logo 4 kategori secara langsung.

### Changed
- **Optimasi Mode Mobile**:
  - Menyembunyikan `.hero-meta-bar` pada mode mobile (`display: none !important;`).
  - Merapikan padding dan tipografi *Hero Banner* pada layar smartphone (< 768px).
  - Memastikan 4 Card Utama STEM tetap tampil rapi **2 card dalam 1 baris** di layar mobile.

---

## [1.0.0] - 2026-10-25

### Added
- Rilis perdana portal STEM sekolah berbasis Google Apps Script Web App.
- Header Identitas Sekolah & 4 Card Utama STEM (Science, Technology, Engineering, Mathematics).
- Filter kelas 1-6, pencarian kata kunci, dan filter tipe media.
- Modal Misi Eksplorasi Siswa (Tujuan, Langkah Praktikum, Link Media, dan Refleksi).
- Panduan pengguna untuk Siswa SD, Orang Tua, Guru Kelas, dan FAQ.
- Halaman admin ber-PIN dengan sidemenu dan CRUD Google Sheets.
