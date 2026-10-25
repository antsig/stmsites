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

### 2. Pengujian Modal Pop-up "Pilih Jenjang Kelas" & Auto-Filter Sub-Kategori
- [x] **Langkah 1**: Dari Beranda, klik pada kartu **Science**.
- [x] **Hasil yang Diharapkan**:
  - Muncul pop-up ramah anak *"Pilih Jenjang Kelas"* dengan badge ikon Science.
  - Terdapat tombol besar *"Tampilkan Semua Kelas"* dan 6 tombol jenjang (*Kelas 1 SD* s.d. *Kelas 6 SD*).
- [x] **Langkah 2 (Skenario Kelas Terkunci)**: Klik tombol **"Kelas 4 SD"**.
- [x] **Hasil yang Diharapkan**:
  - Modal pop-up otomatis menutup dan berpindah ke **Halaman Khusus Sub-Kategori Science**.
  - **Baris filter tombol kelas disembunyikan** (`#gradeFilterBar` hidden) sehingga tampilan filter sangat bersih.
  - Muncul banner informatif: **"Materi Khusus: Kelas 4 SD"** lengkap dengan tombol `[ 🔄 Ganti Jenjang Kelas ]`.
  - Hanya materi Science untuk Kelas 4 yang ditampilkan pada grid.
  - Mengklik tombol *Reset Filter* hanya mereset kolom pencarian & filter media tanpa membuka kunci kelas.
- [x] **Langkah 3 (Skenario Ganti Kelas & Semua Kelas)**: Klik tombol `[ 🔄 Ganti Jenjang Kelas ]` > lalu klik **"Tampilkan Semua Kelas"**.
- [x] **Hasil yang Diharapkan**:
  - Banner kelas terkunci berganti dan **baris tombol jenjang kelas kembali ditampilkan** (`#gradeFilterBar` flex).
  - Seluruh materi Science lintas kelas ditampilkan.
- [x] **Langkah 4**: Klik tombol **"⬅️ Kembali ke Menu STEM"**.
- [x] **Hasil yang Diharapkan**:
  - Tampilan kembali mulus ke **Beranda Utama** yang bersih dengan 4 Card Utama STEM.

### 3. Pengujian Burger Menu Mobile (Floating Overlay - Bebas Layout Shift)
- [x] **Langkah 1**: Pada mode layar mobile (< 768px), klik ikon hamburger menu di navbar kanan atas.
- [x] **Hasil yang Diharapkan**:
  - Menu mobile muncul sebagai *floating overlay dropdown* yang melayang di atas konten dengan efek blur dan bayangan halus.
  - Konten halaman di bawah navbar (hero banner dan kartu STEM) **sama sekali tidak terdorong ke bawah** (*zero layout shift*).
- [x] **Langkah 2**: Klik salah satu menu (misal: "Panduan Pengguna").
- [x] **Hasil yang Diharapkan**:
  - Modal panduan pengguna terbuka dan menu dropdown mobile otomatis menutup.

### 4. Pengujian Footer Resmi Terpusat (Center Aligned) & WA Langsung Nomor
- [x] **Langkah 1**: Gulir halaman ke bagian paling bawah.
- [x] **Hasil yang Diharapkan**:
  - Seluruh elemen footer tersusun rapi di tengah (*center aligned*), seimbang, dan elegan.
  - **Kontak WhatsApp Langsung Nomor**: Menampilkan nomor telepon yang bersih (misal: `+6281234567890`) dengan ikon WhatsApp hijau cerah tanpa awalan teks panjang, dan saat diklik langsung membuka obrolan WhatsApp.
  - **Email Dihapus**: Tautan email telah dihilangkan sesuai arahan pengguna.
  - **Hak Cipta Terpusat**: Menampilkan teks hak cipta terpusat di bawah tombol WhatsApp: `© [Nama Sekolah]. Hak Cipta Dilindungi.`
- [x] **Langkah 2**: Buka DevTools mode mobile (< 480px).
- [x] **Hasil yang Diharapkan**:
  - Footer tetap berada di tengah secara proporsional dengan padding yang nyaman tanpa overflow horizontal.
  - Tipografi seluruh halaman (judul, caption, kartu STEM, banner jenjang, dan modal) proporsional dan ramah mata siswa.

### 5. Pengujian Jendela Pop-up "Misi Eksplorasi Siswa"
- [x] **Langkah 1**: Buka salah satu kategori STEM (misal: *Technology*), lalu klik tombol **"Mulai Eksplorasi 🚀"** pada kartu materi "Logika Coding Dasar".
- [x] **Hasil yang Diharapkan**:
  - Modal pop-up Misi Eksplorasi Siswa terbuka.
  - Menampilkan Tujuan Pembelajaran, Langkah Praktikum, Tombol Buka Simulasi (Blockly Games), dan Pertanyaan Refleksi.
  - Mengklik *"Misi Selesai & Paham! 🌟"* memunculkan toast perayaan dan menutup modal.

### 6. Pengujian Panduan Penggunaan User Umum
- [x] **Langkah 1**: Klik menu **"Panduan Pengguna"** di navbar atas.
- [x] **Hasil yang Diharapkan**:
  - Modal panduan terbuka dengan 4 tab: Siswa SD, Orang Tua, Guru Kelas, dan FAQ.

### 7. Pengujian Halaman Admin & Kustomisasi Logo Kategori STEM
- [x] **Langkah 1**: Klik tombol **"Masuk Admin"** di navbar > klik **"Isi PIN Demo (123456)"** > klik **Masuk Admin**.
- [x] **Langkah 2**: Di Sidemenu Admin, pilih Tab **"Pengaturan Logo & Sekolah"**.
- [x] **Hasil yang Diharapkan**:
  - Terdapat form identitas sekolah dan form kustomisasi logo 4 kategori STEM.
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
