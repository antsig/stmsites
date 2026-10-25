# 🚀 Portal Pembelajaran STEM Sekolah (Google Apps Script Web App)

Portal Pembelajaran Interaktif berbasis **STEM (Science, Technology, Engineering, Mathematics)** yang dirancang khusus untuk siswa Sekolah Dasar (Kelas 1 s.d. 6), Guru, dan Orang Tua. Sistem ini berjalan secara *serverless* dan gratis di infrastruktur cloud **Google Apps Script** dengan database otomatis menggunakan **Google Sheets**.

---

## 🌟 Arsitektur Modular & Fitur Utama

Aplikasi dibangun dengan struktur **terpisah dan modular** untuk kemudahan pemeliharaan:
- **`index.html`**: Halaman Publik Utama (Beranda Bersih & Halaman Khusus Sub-Kategori).
- **`admin.html`**: Halaman Dashboard Admin Terpisah (Sidemenu, CRUD Materi, Pengaturan Logo Sekolah & Kategori STEM).
- **`style.css` & `styles.html`**: Desain visual terpadu, variabel tema STEM, dan responsivitas mobile.
- **`app.js` & `scripts.html`**: Seluruh logika JavaScript, routing 2-tampilan, filter, dan integrasi Google Sheets.
- **`Code.gs`**: Backend Google Apps Script dengan fungsi `doGet()` dan `include()`.

---

### 1. Alur Tampilan Publik 2-Tahap (Bersih & Fokus)
- **Tampilan 1: Beranda Utama Publik (Home View)**:
  - Tampilan sangat bersih, minimalis, dan elegan: hanya menampilkan Identitas Sekolah, Hero Banner ringkas, dan **4 Card Utama STEM** (Science, Technology, Engineering, Mathematics).
  - **Sembunyikan Meta-Bar di Mobile**: Elemen meta bar panjang otomatis disembunyikan di smartphone agar tampilan ringkas dan fokus.
  - **📱 Tampilan Mobile Responsif**: 4 Card Utama STEM tampil **2 card dalam 1 baris** di layar HP.
  - **Sub-materi TIDAK DITAMPILKAN di beranda**.
- **Tampilan 2: Halaman Khusus Sub-Kategori STEM (Category Sub-Page View)**:
  - Muncul ketika salah satu Card Utama STEM diklik.
  - **Card Utama 4 STEM sudah tidak ditampilkan lagi di halaman ini**.
  - Dilengkapi tombol **"⬅️ Kembali ke Kategori Utama STEM"** di bagian atas.
  - Header khusus kategori yang aktif dengan logo/ikon kategori (mendukung logo kustom dari pengaturan admin).
  - Filter Jenjang Kelas: **Kelas 1 s.d. Kelas 6** dan Semua Kelas.
  - Filter Jenis Media: **Video Interaktif, Simulasi/Game, Praktikum, Dokumen/PDF, Artikel**.
  - Pencarian kata kunci instan *real-time*.
  - Grid Sub-Card Materi STEM khusus kategori yang dipilih.
  - Jendela pop-up **"Misi Eksplorasi Siswa"** (Tujuan Pembelajaran, Langkah Misi/Praktikum Seru, Tombol Buka Media, dan Pertanyaan Refleksi Cepat).

---

### 2. Menu Panduan Pengguna (User Guide)
Tersedia di bilah navigasi atas (Navbar) dengan 4 tab:
- 🎒 **Siswa SD**: 4 langkah mudah eksplorasi materi STEM.
- 👨‍👩‍👧 **Orang Tua / Wali Murid**: Cara mendampingi anak belajar mandiri tanpa login.
- 👩‍🏫 **Guru Kelas**: Tips integrasi materi STEM ke RPP/Modul Ajar Kurikulum Merdeka.
- ❓ **Tanya Jawab (FAQ)**: Solusi kendala teknis dan pembukaan simulasi.

---

### 3. Halaman Admin Lengkap (Protected dengan Sidemenu)
- **Gerbang Keamanan PIN Admin**: Dilindungi PIN 6-digit (Default: `123456`), dilengkapi tombol *"Isi PIN Demo (123456)"*.
- **Navigasi Sidemenu (Sidebar)**:
  - Responsif dengan mode *off-canvas drawer* di smartphone/tablet.
  - **Tab 1: Kelola Card Materi (CRUD)**: Tambah, edit, dan hapus sub-card materi pada masing-masing 4 Card Utama STEM.
  - **Tab 2: Pengaturan Logo & Sekolah**:
    - Mengubah nama sekolah, tahun ajaran, slogan, URL logo utama sekolah (dengan *Live Preview*), kontak WhatsApp, email, dan PIN Admin.
    - **Kustomisasi Logo 4 Kategori STEM**: Pengaturan URL logo/ikon kustom untuk Science, Technology, Engineering, dan Mathematics dengan *Live Preview*.
  - **Tab 3: Panduan Pengaturan & Penggunaan Admin**: Petunjuk konversi gambar Google Drive (`uc?export=view`), format link media interaktif (YouTube, PhET simulations, Google Docs/PDF), dan kelola tabel massal di Google Sheets.
  - **Tab 4: Step Deploy & Kode GAS**: Panduan langkah deploy dan tombol satu-klik salin seluruh kode `Code.gs`.

---

## 🛠️ Panduan Deploy ke Akun Google Anda

1. Buka browser dan buat spreadsheet baru di **[Google Sheets](https://sheets.new)**. Beri nama, misalnya: `Database Portal STEM`.
2. Klik menu **Ekstensi (Extensions)** &gt; **Apps Script**.
3. Di dalam editor Apps Script:
   - File Script `Code.gs`: Tempelkan isi [Code.gs](file:///f:/repository/stemsites/Code.gs).
   - Buat 4 berkas HTML baru (klik ikon **+** &gt; **HTML**):
     1. Berkas `index`: Tempelkan isi [index.html](file:///f:/repository/stemsites/index.html).
     2. Berkas `admin`: Tempelkan isi [admin.html](file:///f:/repository/stemsites/admin.html).
     3. Berkas `styles`: Tempelkan isi [styles.html](file:///f:/repository/stemsites/styles.html).
     4. Berkas `scripts`: Tempelkan isi [scripts.html](file:///f:/repository/stemsites/scripts.html).
4. Klik tombol **Terapkan (Deploy)** di pojok kanan atas &gt; pilih **Penerapan Baru (New Deployment)**:
   - Jenis: **Aplikasi Web (Web app)**.
   - Deskripsi: `Portal STEM Sekolah v1.1.0`.
   - Jalankan sebagai (*Execute as*): **Saya / Akun Anda** (*User deploying*).
   - Siapa yang memiliki akses (*Who has access*): **Siapa saja** (*Anyone*).
   - Klik **Deploy (Terapkan)**.
5. Berikan otorisasi akun Google Anda jika diminta.
6. Salin **URL Aplikasi Web** yang diberikan.

---

## 💻 Pengujian Lokal / Standalone Demo
Cukup buka folder `f:\repository\stemsites\` dan klik dua kali berkas [index.html](file:///f:/repository/stemsites/index.html) di browser Anda. Aplikasi otomatis berjalan menggunakan *Interactive Mock Engine* (`localStorage`) sehingga Anda bisa langsung menguji seluruh fitur, animasi, responsivitas mobile 2 kartu/baris, filter kelas, pop-up misi, dan CRUD Admin secara instan!
