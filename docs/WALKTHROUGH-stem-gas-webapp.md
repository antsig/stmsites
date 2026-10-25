# 🧪 Walkthrough & Panduan Verifikasi: Portal Web STEM Sekolah Berbasis Google Apps Script

Dokumen ini berisi panduan pengujian dan bukti verifikasi fungsional untuk **Portal Pembelajaran STEM Sekolah** berbasis Google Apps Script (GAS).

---

## 🧭 User Testing Journey

### 1. Pengujian Tampilan Publik & Responsivitas Mobile (2 Card / Baris)
- [x] **Langkah 1**: Buka file [index.html](file:///f:/repository/stemsites/index.html) di browser (cukup klik dua kali atau buka via file explorer).
- [x] **Langkah 2**: Periksa Header Identitas Sekolah (Logo, Nama Sekolah "SD NEGERI HARAPAN BANGSA", Tahun Ajaran, Slogan).
- [x] **Langkah 3**: Buka *Developer Tools* browser (F12 atau Ctrl+Shift+I) lalu beralih ke mode Device/Mobile (layar iPhone/Android < 768px).
- [x] **Hasil yang Diharapkan**: Ke-4 Card Utama STEM (**Science**, **Technology**, **Engineering**, **Mathematics**) tampil rapi dalam formasi **2 kartu dalam 1 baris (grid 2 kolom)** tanpa ada horizontal overflow liar.

### 2. Pengujian Filter Kategori STEM & Grid Sub-Card Materi
- [x] **Langkah 1**: Klik pada kartu **Science**.
- [x] **Hasil yang Diharapkan**:
  - Kartu Science menjadi aktif (terdapat border/glow hijau).
  - Tampilan otomatis bergulir ke grid materi dan memfilter hanya materi bertema Science.
  - Tag filter aktif muncul di atas grid dengan tombol silang (x) untuk membatalkan.
- [x] **Langkah 2**: Klik tombol **Kelas 2** pada filter jenjang.
- [x] **Hasil yang Diharapkan**: Grid materi menyaring konten Science khusus Kelas 2 ("Petualangan Daur Hidup Kupu-kupu Menakjubkan").
- [x] **Langkah 3**: Ketik kata kunci pada kolom pencarian (misal: "kupu-kupu").
- [x] **Hasil yang Diharapkan**: Hasil pencarian menyaring materi secara *real-time*.

### 3. Pengujian Jendela Pop-up "Misi Eksplorasi Siswa"
- [x] **Langkah 1**: Pada kartu materi, klik tombol **"Mulai Eksplorasi 🚀"**.
- [x] **Hasil yang Diharapkan**:
  - Muncul modal interaktif Misi Eksplorasi Siswa.
  - Memuat *Tujuan Pembelajaran*, *Langkah Misi/Praktikum Seru*, *Tombol Buka Media Pembelajaran*, dan *Pertanyaan Refleksi Cepat*.
  - Mengklik tombol *"Misi Selesai & Paham! 🌟"* memunculkan pesan selamat dan menutup modal secara elegan.

### 4. Pengujian Panduan Penggunaan User Umum
- [x] **Langkah 1**: Klik menu **"Panduan Pengguna"** di navbar atas.
- [x] **Hasil yang Diharapkan**:
  - Modal panduan terbuka dengan 4 tab interaktif:
    - 🎒 **Siswa SD**: 4 langkah mudah memilih Card STEM, filter kelas, buka materi, dan jalankan misi.
    - 👨‍👩‍👧 **Orang Tua / Wali**: Panduan mendampingi anak belajar tanpa login.
    - 👩‍🏫 **Guru Kelas**: Pemanfaatan materi sebagai apersepsi kurikulum merdeka.
    - ❓ **Tanya Jawab (FAQ)**: Solusi kendala teknis akordion interaktif.

### 5. Pengujian Keamanan PIN Admin & Navigasi Sidemenu
- [x] **Langkah 1**: Klik tombol **"Masuk Admin"** di pojok kanan atas.
- [x] **Langkah 2**: Klik tombol instan **"Isi PIN Demo (123456)"**, lalu klik **"Masuk Admin"**.
- [x] **Hasil yang Diharapkan**:
  - Autentikasi berhasil dan langsung masuk ke **Dashboard Admin STEM** dengan layout **Sidemenu (Sidebar)**.
  - Pada layar mobile, sidemenu otomatis tersembunyi sebagai *off-canvas drawer* yang dapat dibuka dengan tombol toggle hamburger.
- [x] **Langkah 3 (Tab 1: Kelola Card Materi CRUD)**:
  - Coba klik **"Tambah Sub-Card Baru"**, isi data, dan klik Simpan. Materi baru langsung muncul di tabel dan portal utama.
  - Coba tombol **Edit** (ikon pensil) dan **Hapus** (ikon tempat sampah).
- [x] **Langkah 4 (Tab 2: Pengaturan Logo & Sekolah)**:
  - Ubah nama sekolah atau slogan, perhatikan kotak **Live Preview** yang langsung berubah seketika.
- [x] **Langkah 5 (Tab 3: Panduan Admin)**:
  - Memuat instruksi konversi link logo dari Google Drive (`uc?export=view`), format link media interaktif (YouTube, PhET, Google Docs PDF), dan manajemen spreadsheet massal.
- [x] **Langkah 6 (Tab 4: Step Deploy & Kode GAS)**:
  - Memuat petunjuk 4 langkah deploy ke akun Google dan tombol satu-klik **"Salin Seluruh Code.gs"** dan **"Salin Seluruh index.html"**.

---

## 🛡️ Bukti Verifikasi Teknis (Technical Evidence)
1. **Pemisahan Logika & Backend**:
   - Berkas [Code.gs](file:///f:/repository/stemsites/Code.gs) dirancang mengikuti standar GAS V8 Engine, mengelola operasi database Google Sheets dengan validasi otentikasi PIN sebelum aksi mutasi data (`saveMaterial`, `deleteMaterial`, `updateSettings`).
2. **Kemandirian Standalone & Dual-Engine**:
   - Berkas [index.html](file:///f:/repository/stemsites/index.html) mendeteksi keberadaan objek `google.script.run`. Jika dijalankan di browser lokal/offline, sistem beralih otomatis ke *Mock Engine LocalStorage* sehingga tidak terjadi error putus koneksi.
3. **Pemberian Izin & Manifest**:
   - Berkas [appsscript.json](file:///f:/repository/stemsites/appsscript.json) terkonfigurasi dengan zona waktu `Asia/Jakarta`, runtime `V8`, dan hak akses webapp publik (`executeAs: USER_DEPLOYING`, `access: ANYONE`).
