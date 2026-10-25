# Changelog

Semua perubahan pada proyek **Portal Pembelajaran STEM Sekolah Berbasis Google Apps Script** dicatat di dokumen ini.
Format penomoran versi mengacu pada [Semantic Versioning (SemVer 2.0.0)](https://semver.org/).

---

## [1.0.0] - 2026-10-25

### Added
- **Header Identitas Sekolah**: Menampilkan logo sekolah, nama sekolah, tahun ajaran aktif, dan slogan interaktif.
- **4 Card Utama STEM**:
  - Kartu Science, Technology, Engineering, dan Mathematics dengan indikator jumlah materi dan efek hover lift.
  - Tampilan responsif mobile **2 kartu dalam 1 baris** di layar smartphone (< 768px).
  - Integrasi klik untuk filter otomatis grid materi.
- **Sistem Filter & Pencarian Lengkap**:
  - Kolom pencarian kata kunci instan (*real-time keyword search*).
  - Filter Jenjang Kelas 1 sampai Kelas 6 + Semua Kelas.
  - Filter Jenis Media (Video, Simulasi/Game, Praktikum, Dokumen/PDF, Artikel).
- **Jendela Pop-up "Misi Eksplorasi Siswa"**:
  - Modal interaktif yang memuat Tujuan Pembelajaran, Langkah Misi/Praktikum Seru, Tombol Buka Media Materi, dan Pertanyaan Refleksi Cepat.
- **Menu Panduan Penggunaan untuk User Umum**:
  - Navigasi atas dengan 4 tab: Siswa SD (4 langkah mudah), Orang Tua / Wali (pendampingan belajar tanpa login), Guru Kelas (pemanfaatan kurikulum merdeka), dan Tanya Jawab (FAQ).
- **Halaman Admin dengan Layout Sidemenu**:
  - Proteksi PIN Admin 6 digit (Default: `123456`) dilengkapi tombol instan *"Isi PIN Demo (123456)"*.
  - Sidemenu responsif (*off-canvas drawer* di mobile dengan tombol toggle hamburger).
  - **Tab 1: Kelola Card Materi (CRUD)** untuk menambah, mengedit, dan menghapus sub-card materi.
  - **Tab 2: Pengaturan Logo & Sekolah** dengan fitur *Live Preview* logo dan identitas instansi.
  - **Tab 3: Panduan Pengaturan & Penggunaan Admin** (konversi URL Google Drive `uc?export=view`, standar tautan media, dan manajemen sheet).
  - **Tab 4: Step Deploy & Kode GAS** lengkap dengan tombol salin satu-klik seluruh kode `Code.gs` dan `index.html`.
- **Dual Engine Architecture**:
  - Berjalan otomatis di Google Apps Script yang terhubung ke Google Sheets.
  - Berjalan mandiri (*Standalone Demo*) di browser lokal dengan penyimpanan `localStorage`.
