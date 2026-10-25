# 🚀 Portal Pembelajaran STEM Sekolah (Google Apps Script Web App)

Portal Pembelajaran Interaktif berbasis **STEM (Science, Technology, Engineering, Mathematics)** yang dirancang khusus untuk siswa Sekolah Dasar (Kelas 1 s.d. 6), Guru, dan Orang Tua. Sistem ini berjalan secara *serverless* dan gratis di infrastruktur cloud **Google Apps Script** dengan database otomatis menggunakan **Google Sheets**.

---

## 🌟 Fitur Utama

### 1. Antarmuka Siswa & Publik (100% Bebas Akses Tanpa Login)
- **Header Identitas Sekolah**: Menampilkan logo sekolah, nama sekolah, tahun ajaran aktif, dan slogan inspiratif.
- **4 Card Utama STEM**:
  - 🔬 **Science** (Sains Alam)
  - 💻 **Technology** (Teknologi & Coding)
  - ⚙️ **Engineering** (Rekayasa & Praktikum Struktur)
  - 📐 **Mathematics** (Matematika & Geometri)
  - 📱 **Mobile First**: Ditata **2 card dalam 1 baris** di layar smartphone.
  - Sekali klik langsung memfilter sub-card materi terkait di bawahnya.
- **Filter & Pencarian Instan**:
  - Pencarian kata kunci materi *real-time*.
  - Filter Jenjang: **Kelas 1 s.d. Kelas 6** dan opsi Semua Kelas.
  - Filter Jenis Media: **Video Interaktif, Simulasi/Game, Praktikum, Dokumen/PDF, Artikel**.
- **Jendela Pop-up "Misi Eksplorasi Siswa"**:
  - Modal interaktif saat kartu materi diklik, memuat:
    - Tujuan Pembelajaran ramah anak.
    - Langkah Misi / Praktikum seru di rumah atau kelas.
    - Tombol buka media pembelajaran interaktif (YouTube, PhET Simulations, Blockly, Google Docs).
    - Pertanyaan refleksi cepat dan tombol perayaan penyelesaian misi.
- **Menu Panduan Pengguna (User Guide)**:
  - 🎒 **Siswa SD**: 4 langkah mudah eksplorasi materi STEM.
  - 👨‍👩‍👧 **Orang Tua / Wali Murid**: Cara mendampingi anak belajar mandiri tanpa login.
  - 👩‍🏫 **Guru Kelas**: Tips integrasi materi STEM ke RPP/Modul Ajar Kurikulum Merdeka.
  - ❓ **Tanya Jawab (FAQ)**: Solusi kendala teknis dan pembukaan simulasi.

---

### 2. Halaman Admin Lengkap (Protected dengan Sidemenu)
- **Gerbang Keamanan PIN Admin**: Dilindungi PIN 6-digit (Default: `123456`), dilengkapi tombol *"Isi PIN Demo (123456)"* untuk pengetesan instan.
- **Navigasi Sidemenu (Sidebar)**:
  - Responsif dengan mode *off-canvas drawer* di smartphone/tablet.
  - **Tab 1: Kelola Card Materi (CRUD)**:
    - Tambah, edit, dan hapus Sub-Card materi.
    - Form terstruktur (Judul, Kategori STEM, Kelas, Jenis Media, URL Tautan, URL Gambar, Deskripsi, Tujuan, Langkah Misi, Refleksi).
  - **Tab 2: Pengaturan Logo & Sekolah**:
    - Mengubah nama sekolah, tahun ajaran, slogan, URL logo (dengan *Live Preview*), kontak WhatsApp, email sekolah, dan ganti PIN Admin.
  - **Tab 3: Panduan Pengaturan & Penggunaan Admin**:
    - Petunjuk konversi gambar Google Drive menjadi link gambar langsung (`uc?export=view&id=FILE_ID`).
    - Standar format tautan media interaktif (YouTube, PhET HTML5, Google Docs PDF).
    - Panduan pengelolaan materi massal via Google Sheets.
  - **Tab 4: Step Deploy & Kode GAS**:
    - Petunjuk deploy lengkap dan tombol satu-klik salin seluruh kode `Code.gs` dan `index.html`.

---

## 🛠️ Panduan Deploy ke Akun Google Anda

1. Buka browser dan buat spreadsheet baru di **[Google Sheets](https://sheets.new)**. Beri nama, misalnya: `Database Portal STEM`.
2. Klik menu **Ekstensi (Extensions)** &gt; **Apps Script**.
3. Di dalam editor Apps Script:
   - Buka file `Code.gs`, hapus kode bawaan, lalu tempelkan seluruh isi file [Code.gs](file:///f:/repository/stemsites/Code.gs).
   - Klik tombol **+** (Tambah berkas) &gt; pilih **HTML** &gt; beri nama berkas persis `index` (tanpa .html) &gt; tempelkan seluruh isi file [index.html](file:///f:/repository/stemsites/index.html).
4. Klik tombol **Terapkan (Deploy)** di pojok kanan atas &gt; pilih **Penerapan Baru (New Deployment)**:
   - Pilih jenis: **Aplikasi Web (Web app)**.
   - Deskripsi: `Portal STEM Sekolah v1.0.0`.
   - Jalankan sebagai (*Execute as*): **Saya / Akun Anda** (*User deploying*).
   - Siapa yang memiliki akses (*Who has access*): **Siapa saja** (*Anyone*).
   - Klik **Deploy (Terapkan)**.
5. Berikan izin otorisasi akun Google Anda jika diminta (*Advanced &gt; Go to ... (unsafe)*).
6. Salin **URL Aplikasi Web** yang diberikan. Portal STEM sekolah Anda siap dibagikan ke siswa, guru, dan orang tua!

---

## 💻 Pengujian Lokal / Standalone Demo
Aplikasi ini dilengkapi fitur **Dual Engine**:
- Jika dibuka langsung di browser komputer Anda (cukup klik dua kali `index.html`), aplikasi otomatis menjalankan **Interactive Mock Engine** dengan database lokal (`localStorage`).
- Anda dapat menguji seluruh tampilan, responsivitas mobile 2 kartu/baris, filter kelas, pop-up misi, panduan pengguna, hingga fitur CRUD Admin secara instan tanpa perlu koneksi ke Google Apps Script terlebih dahulu.
