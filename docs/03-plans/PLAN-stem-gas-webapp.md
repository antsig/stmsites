# 📋 Rencana Implementasi: Portal Web STEM Sekolah Berbasis Google Apps Script (GAS)

## 📌 1. Konteks & Latar Belakang Masalah
Sekolah membutuhkan portal pembelajaran interaktif berbasis **STEM (Science, Technology, Engineering, Mathematics)** yang mudah diakses oleh siswa SD, guru, dan orang tua tanpa perlu login rumit. Aplikasi ini harus dapat di-host secara gratis dan mandiri menggunakan infrastruktur **Google Apps Script (GAS) Web App** yang terhubung langsung dengan **Google Sheets** sebagai database penyimpanan materi dan pengaturan sekolah.

---

## 🎯 2. Ruang Lingkup (Scope)

### A. Fitur Pengguna Publik (Siswa, Guru, Orang Tua)
1. **Header Identitas Sekolah**:
   - Logo sekolah, nama sekolah, tahun ajaran aktif, dan slogan/motto interaktif.
   - Bilah navigasi modern dengan tombol akses: *Home*, *Panduan Pengguna*, dan tombol cepat *Masuk Admin*.
2. **4 Card Utama STEM**:
   - Kartu tematik: 🔬 **Science**, 💻 **Technology**, ⚙️ **Engineering**, 📐 **Mathematics**.
   - Dilengkapi statistik jumlah materi per bidang dan indikator warna khas.
   - **Mobile Layout**: Ditata presisi **2 kartu per baris di layar smartphone/mobile** (grid 2 kolom).
   - Aksi interaktif: Mengklik kartu utama langsung mengaktifkan filter instan kategori materi yang dipilih.
3. **Filter & Pencarian Interaktif**:
   - Pencarian kata kunci materi instan (*real-time search*).
   - Filter Jenjang Kelas: **Kelas 1 s.d. Kelas 6** + opsi Semua Kelas.
   - Filter Jenis Media: **Video Interaktif, Simulasi/Game (PhET/dsb.), Dokumen/PDF, Artikel/Praktikum**.
   - Indikator hasil filter dinamis dan tombol reset filter.
4. **Grid Sub-Card Materi**:
   - Tampilan kartu materi modern dengan thumbnail, badge kelas, bidang STEM, tipe media, dan tombol *Mulai Eksplorasi*.
5. **Modal Pop-up "Misi Eksplorasi Siswa"**:
   - Jendela interaktif ketika materi diklik:
     - Header materi & bidang STEM.
     - Tujuan pembelajaran ramah anak.
     - Langkah misi/tantangan seru (praktikum mandiri).
     - Tombol akses tautan media utama (membuka video/simulasi/dokumen).
     - Kuis/pertanyaan refleksi cepat untuk evaluasi mandiri.
6. **Halaman / Modal Panduan Pengguna (User Guide)**:
   - Tab navigasi untuk 4 target pengguna:
     - 🎒 **Siswa SD**: 4 langkah mudah memilih Card STEM, memfilter kelas, membuka materi, dan menyelesaikan misi.
     - 👨‍👩‍👧 **Orang Tua / Wali**: Panduan mendampingi anak belajar tanpa perlu login.
     - 👩‍🏫 **Guru Kelas**: Rekomendasi apersepsi dan integrasi materi ke RPP/Modul Ajar.
     - ❓ **Tanya Jawab (FAQ)**: Solusi kendala teknis dan jawaban pertanyaan umum.

### B. Halaman Admin (Protected Area)
1. **Gerbang Keamanan PIN Admin**:
   - Modal autentikasi PIN 6 digit (Default: `123456`).
   - Tombol cepat bantu demo: *"Isi PIN Demo (123456)"*.
   - Proteksi sesi berbasis browser state & verifikasi backend.
2. **Layout Admin Modern dengan Sidemenu (Sidebar)**:
   - Menu samping (Sidemenu) responsif dengan mode *off-canvas drawer* di mobile + overlay backdrop.
   - Status koneksi dan indikator pengguna admin.
3. **Menu Admin 1: Kelola Card Materi (CRUD)**:
   - Form Tambah / Edit Materi (Judul, Kategori STEM, Kelas 1-6, Jenis Media, URL Tautan, Deskripsi, Tujuan, Langkah Misi, Refleksi).
   - Tabel responsif daftar materi dengan fitur pencarian, filter, tombol edit, dan tombol hapus.
   - Modal konfirmasi hapus data yang aman.
4. **Menu Admin 2: Pengaturan Logo & Sekolah**:
   - Form kustomisasi identitas: Nama Sekolah, Tahun Ajaran, Slogan/Tagline, URL Logo Sekolah, Kontak Bantuan (No. WhatsApp / Email), dan Ganti PIN Admin.
   - Tombol pratinjau (*Live Preview*) logo sekolah secara langsung.
5. **Menu Admin 3: Panduan Pengaturan & Penggunaan Admin**:
   - Panduan cara mengubah logo sekolah dari Google Drive (konversi URL `uc?export=view`).
   - Standar penulisan sub-card materi dan pembuatan misi eksplorasi.
   - Panduan format link media interaktif (YouTube, PhET Interactive Simulations, Google Drive PDF).
   - Panduan kelola massal langsung di lembar Google Sheets.
6. **Menu Admin 4: Step Deploy & Kode GAS Lengkap**:
   - Panduan lengkap *copy-paste* ke Google Apps Script Editor.
   - Langkah setting Google Sheets ID & inisialisasi sheet otomatis.
   - Panduan pembuatan Web App Deployment (*Execute as: Me*, *Who has access: Anyone*).
   - Berisi tampilan kode bersih terpadu yang siap disalin satu klik.

---

## 🏗️ 3. Arsitektur File & Struktur Komponen

Aplikasi didesain khusus agar kompatibel 100% dengan ekosistem **Google Apps Script**:

```
f:/repository/stemsites/
├── Code.gs                   # Backend GAS (doGet, API Handler: getInitialData, saveMateri, deleteMateri, updateSettings, verifyPin)
├── index.html                # Frontend Utama GAS (HTML5 + CSS + JavaScript Vanilla SPA terintegrasi)
├── appsscript.json           # Manifest Google Apps Script
├── README.md                 # Dokumentasi umum proyek & petunjuk deploy
├── CHANGELOG.md              # Log versi SemVer
└── docs/
    ├── 03-plans/
    │   └── PLAN-stem-gas-webapp.md
    └── WALKTHROUGH-stem-gas-webapp.md
```

### Format Data Database Google Sheets (Otomatis dibuat oleh GAS jika belum ada):
- **Sheet `Materi`**:
  `[id, stem_category, title, grade, media_type, media_url, thumbnail_url, description, mission_goals, mission_steps, mission_reflection, created_at]`
- **Sheet `Settings`**:
  `[key, value]` (misal: `school_name`, `academic_year`, `slogan`, `logo_url`, `contact_wa`, `contact_email`, `admin_pin`)

---

## 🎨 4. Standar Desain UI/UX & Responsivitas
- **Styling**: Menggunakan CSS kustom modern dengan estetika premium: Glassmorphism halus, warna tema edukatif STEM (Vibrant Blue, Cyan, Emerald, Amber, Violet), font Google (*Plus Jakarta Sans* / *Inter*), micro-interactions & cards hover lift.
- **Mobile First**:
  - **4 Card Utama**: Tampil **2 kolom (2 kartu per baris)** di layar smartphone (< 768px), 4 kolom di desktop (>= 768px).
  - Sidemenu Admin otomatis menjadi off-canvas drawer dengan toggle hamburger button.
  - Tabel materi admin dibungkus `.table-responsive` dengan tombol aksi touch-target nyaman (min 44px).

---

## 🛡️ 5. Mitigasi Risiko & Keamanan
1. **Fallback Standalone / Offline Demo Mode**:
   - File `index.html` dirancang cerdas: Jika dibuka langsung di browser (tanpa server GAS) atau `google.script.run` belum siap, aplikasi otomatis beralih ke *Local Mock Storage Mode* dengan data contoh STEM lengkap sehingga antarmuka dan seluruh fitur CRUD dapat langsung dites seketika.
2. **Validasi PIN**:
   - PIN diverifikasi di sisi klien dan di sisi server GAS sebelum mengizinkan mutasi data.
3. **Penyelamatan Error (Graceful Degradation)**:
   - Indikator loading halus, feedback toast notification saat tambah/edit/hapus, serta penanganan error jaringan.

---

## 🔄 6. Tahapan Eksekusi (Fase SOP)
- [x] **Fase 1**: Penyusunan Implementation Plan & Gerbang Persetujuan Pengguna (Saat Ini).
- [ ] **Fase 2**: Pembuatan kode backend `Code.gs`, antarmuka terintegrasi `index.html`, manifest `appsscript.json`, dan dokumentasi panduan deploy.
- [ ] **Fase 3**: Verifikasi fungsionalitas (responsivitas mobile 2 card/baris, filter kelas 1-6, modal misi eksplorasi, panduan user umum, proteksi PIN admin, sidemenu admin, CRUD, dan panduan deploy GAS).
- [ ] **Fase 4**: Dokumentasi rilis `CHANGELOG.md` (v1.0.0).
- [ ] **Fase 5**: Finalisasi panduan deploy langsung ke akun Google pengguna.
