# 🧪 Walkthrough & Panduan Verifikasi: Portal Web STEM Sekolah Berbasis Google Apps Script

Dokumen ini berisi panduan pengujian dan bukti verifikasi fungsional untuk **Portal Pembelajaran STEM Sekolah** versi modular 2-tampilan.

---

## 🧭 User Testing Journey

### 1. Pengujian Beranda Publik Bersih & Responsivitas Mobile (2 Card / Baris)
- [x] **Langkah 1**: Buka file [index.html](file:///f:/repository/stemsites/index.html) di browser.
- [x] **Hasil yang Diharapkan**:
  - Tampilan beranda sangat bersih dan terarah: memuat Identitas Sekolah, Hero Banner, caption pemantik, dan 4 Card Utama STEM.
  - Sub-materi sama sekali **TIDAK** tampil di halaman beranda.
- [x] **Langkah 2**: Buka *Developer Tools* browser (F12) lalu aktifkan mode Mobile/Responsive (< 768px).
- [x] **Hasil yang Diharapkan**:
  - Elemen `.hero-meta-bar` (Khusus Siswa, Belajar Mandiri, dll.) **otomatis disembunyikan** sehingga hero banner rapi dan ringkas.
  - 4 Card Utama STEM tampil presisi dalam formasi **2 card dalam 1 baris (grid 2 kolom)** tanpa overflow horizontal.

### 2. Pengujian Halaman Khusus Sub-Kategori STEM (2-View Routing)
- [x] **Langkah 1**: Klik pada kartu **Science** di beranda.
- [x] **Hasil yang Diharapkan**:
  - Halaman beranda otomatis berganti menjadi **Halaman Khusus Sub-Kategori Science**.
  - **4 Card Utama STEM sudah tidak ditampilkan lagi** di halaman ini.
  - Terdapat tombol **"⬅️ Kembali ke Kategori Utama STEM"** di bagian atas.
  - Muncul banner kategori Science dengan warna tema hijau emerald dan ikon/logo terkait.
  - Filter Jenjang Kelas 1-6, filter Media, dan kolom pencarian muncul khusus untuk materi Science.
  - Hanya materi Science yang tampil pada grid di bawahnya.
- [x] **Langkah 2**: Klik tombol **"⬅️ Kembali ke Kategori Utama STEM"**.
- [x] **Hasil yang Diharapkan**:
  - Tampilan kembali mulus ke **Beranda Utama** yang bersih dengan 4 Card Utama STEM.

### 3. Pengujian Jendela Pop-up "Misi Eksplorasi Siswa"
- [x] **Langkah 1**: Buka salah satu kategori STEM (misal: *Technology*), lalu klik tombol **"Mulai Eksplorasi 🚀"** pada kartu materi "Logika Coding Dasar".
- [x] **Hasil yang Diharapkan**:
  - Modal pop-up Misi Eksplorasi Siswa terbuka.
  - Menampilkan Tujuan Pembelajaran, Langkah Praktikum, Tombol Buka Simulasi (Blockly Games), dan Pertanyaan Refleksi.
  - Mengklik *"Misi Selesai & Paham! 🌟"* memunculkan toast perayaan dan menutup modal.

### 4. Pengujian Panduan Penggunaan User Umum
- [x] **Langkah 1**: Klik menu **"Panduan Pengguna"** di navbar atas.
- [x] **Hasil yang Diharapkan**:
  - Modal panduan terbuka dengan 4 tab: Siswa SD, Orang Tua, Guru Kelas, dan FAQ.

### 5. Pengujian Halaman Admin & Kustomisasi Logo Kategori STEM
- [x] **Langkah 1**: Klik tombol **"Masuk Admin"** di navbar > klik **"Isi PIN Demo (123456)"** > klik **Masuk Admin**.
- [x] **Langkah 2**: Di Sidemenu Admin, pilih Tab **"Pengaturan Logo & Sekolah"**.
- [x] **Hasil yang Diharapkan**:
  - Terdapat form identitas sekolah dan form baru: **Kustomisasi Logo / Gambar 4 Kategori STEM** (Science, Technology, Engineering, Mathematics).
  - Terdapat kotak **Live Preview** yang menampilkan pratinjau instan identitas sekolah dan 4 ikon/logo kategori STEM secara *real-time*.
- [x] **Langkah 3**: Di Tab **"Kelola Card Materi"**, coba fungsi Tambah, Edit, dan Hapus materi.
- [x] **Langkah 4**: Di Tab **"Step Deploy & Kode GAS"**, periksa panduan deploy modular untuk berkas `index`, `admin`, `styles`, `scripts`, dan `Code.gs`.

---

## 🛡️ Bukti Pemisahan Berkas Modular
- [style.css](file:///f:/repository/stemsites/style.css) & [styles.html](file:///f:/repository/stemsites/styles.html): Modular CSS.
- [app.js](file:///f:/repository/stemsites/app.js) & [scripts.html](file:///f:/repository/stemsites/scripts.html): Modular JavaScript.
- [admin.html](file:///f:/repository/stemsites/admin.html): Modular Admin View & Form.
- [index.html](file:///f:/repository/stemsites/index.html): Modular Public Page Template.
- [Code.gs](file:///f:/repository/stemsites/Code.gs): Backend Google Apps Script dengan fungsi `include()`.
