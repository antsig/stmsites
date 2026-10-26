# 🧪 Walkthrough & Panduan Verifikasi: Portal Web STEM Sekolah Berbasis Google Apps Script

Dokumen ini berisi panduan pengujian dan bukti verifikasi fungsional untuk **Portal Pembelajaran STEM Sekolah** versi modular 2-tampilan.

---

## 🧭 User Testing Journey

### 1. Pengujian Beranda Publik Bersih & Responsivitas Mobile (Formasi 2 Kolom Padat)
- [x] **Langkah 1**: Buka file [index.html](file:///f:/repository/stemsites/index.html) di browser.
- [x] **Hasil yang Diharapkan**:
  - Tampilan beranda sangat bersih dan terarah: memuat Identitas Sekolah, Hero Banner, caption pemantik, dan 4 Card Utama STEM.
  - Sub-materi sama sekali **TIDAK** tampil di halaman beranda.
- [x] **Langkah 2**: Buka *Developer Tools* browser (F12) lalu aktifkan mode Mobile/Responsive (< 768px atau 394px).
- [x] **Hasil yang Diharapkan**:
  - Elemen `.hero-meta-bar` (Khusus Siswa, Belajar Mandiri, dll.) otomatis disembunyikan.
  - 4 Card Utama STEM tampil rapi dalam formasi **2 kolom padat (`grid-template-columns: repeat(2, 1fr) !important;`)** dengan padding yang pas, seimbang 2 kartu per baris, dan tidak memerlukan scroll panjang.
  - Materi yang tampil adalah materi awal yang telah dikembalikan (*Daur Hidup Kupu-kupu, Fotosintesis, Robot Pembawa Pesan, Literasi Digital, Jembatan Kertas, Mobil Balon, Pecahan Pizza, Detektif Sudut*).

---

### 2. Pengujian Halaman Admin di Mobile (Form & Preview 1 Kolom)
- [x] **Langkah 1**: Pada layar mobile (< 768px), buka menu navigasi > klik **"Masuk Admin (PIN)"** > masukkan PIN `1234`.
- [x] **Langkah 2**: Buka tab **"Pengaturan Logo & Sekolah"**.
- [x] **Hasil yang Diharapkan**:
  - Layout `.settings-grid-layout` otomatis berubah menjadi **1 kolom penuh**.
  - Form input logo/nama sekolah dan kotak **Live Preview** tersusun vertikal secara rapi.
  - Form dan teks tidak terpotong, dan pratinjau tidak meluap ke samping (*zero horizontal overflow*).
- [x] **Langkah 3**: Buka tab **"Kelola Card Materi"**.
  - Filter bar admin tertata rapi dalam 1 kolom vertikal. Tabel materi dilengkapi `.table-responsive` yang aman untuk scroll internal tabel tanpa merusak viewport browser.

---

### 3. Pengujian Modal Pop-up "Pilih Jenjang Kelas" & Auto-Filter Sub-Kategori
- [x] **Langkah 1**: Dari Beranda, klik pada kartu **Science**.
- [x] **Hasil yang Diharapkan**:
  - Muncul pop-up ramah anak *"Pilih Jenjang Kelas"* dengan badge ikon Science.
  - Terdapat tombol besar *"Tampilkan Semua Kelas"* dan 6 tombol jenjang (*Kelas 1 SD* s.d. *Kelas 6 SD*).
- [x] **Langkah 2 (Skenario Kelas Terkunci)**: Klik tombol **"Kelas 4 SD"**.
- [x] **Hasil yang Diharapkan**:
  - Modal pop-up otomatis menutup dan berpindah ke **Halaman Khusus Sub-Kategori Science**.
  - **Baris filter tombol kelas disembunyikan** (`#gradeFilterBar` hidden) sehingga tampilan filter sangat bersih.
  - Muncul banner informatif: **"Materi Khusus: Kelas 4 SD"** lengkap dengan tombol `[ 🔄 Ganti Jenjang Kelas ]`.
  - Hanya materi Science untuk Kelas 4 yang ditampilkan pada grid (1 kolom di mobile).
  - Mengklik tombol *Reset Filter* hanya mereset kolom pencarian & filter media tanpa membuka kunci kelas.
- [x] **Langkah 3 (Skenario Ganti Kelas & Semua Kelas)**: Klik tombol `[ 🔄 Ganti Jenjang Kelas ]` > lalu klik **"Tampilkan Semua Kelas"**.
- [x] **Hasil yang Diharapkan**:
  - Banner kelas terkunci berganti dan **baris tombol jenjang kelas kembali ditampilkan** (`#gradeFilterBar` flex).
  - Seluruh materi Science lintas kelas ditampilkan.
- [x] **Langkah 4**: Klik tombol **"⬅️ Kembali ke Menu STEM"**.
- [x] **Hasil yang Diharapkan**:
  - Tampilan kembali mulus ke **Beranda Utama** yang bersih dengan 4 Card Utama STEM.

---

### 4. Pengujian Burger Menu Mobile (Floating Overlay - Bebas Layout Shift)
- [x] **Langkah 1**: Pada mode layar mobile (< 768px), klik ikon hamburger menu di navbar kanan atas.
- [x] **Hasil yang Diharapkan**:
  - Menu mobile muncul sebagai *floating overlay dropdown* yang melayang di atas konten dengan efek blur dan bayangan halus.
  - Konten halaman di bawah navbar (hero banner dan kartu STEM) **sama sekali tidak terdorong ke bawah** (*zero layout shift*).
- [x] **Langkah 2**: Klik salah satu menu (misal: "Panduan Pengguna").
- [x] **Hasil yang Diharapkan**:
  - Modal panduan pengguna terbuka dan menu dropdown mobile otomatis menutup.

---

### 5. Pengujian Footer Resmi Terpusat (Center Aligned) & WA Langsung Nomor
- [x] **Langkah 1**: Gulir halaman ke bagian paling bawah.
- [x] **Hasil yang Diharapkan**:
  - Seluruh elemen footer tersusun rapi di tengah (*center aligned*), seimbang, dan elegan.
  - **Kontak WhatsApp Langsung Nomor**: Menampilkan nomor telepon yang bersih (misal: `+6281234567890`) dengan ikon WhatsApp hijau cerah tanpa awalan teks panjang, dan saat diklik langsung membuka obrolan WhatsApp.
  - **Email Dihapus**: Tautan email telah dihilangkan sesuai arahan pengguna.
  - **Hak Cipta Terpusat**: Menampilkan teks hak cipta terpusat di bawah tombol WhatsApp: `© [Nama Sekolah]. Hak Cipta Dilindungi.`

---

### 6. Pengujian Jendela Pop-up "Misi Eksplorasi Siswa"
- [x] **Langkah 1**: Buka salah satu kategori STEM (misal: *Technology*), lalu klik tombol **"Mulai Eksplorasi 🚀"** pada kartu materi "Logika Coding Dasar".
- [x] **Hasil yang Diharapkan**:
  - Modal pop-up Misi Eksplorasi Siswa terbuka.
  - Menampilkan Tujuan Pembelajaran, Langkah Praktikum, Tombol Buka Simulasi (Blockly Games), dan Pertanyaan Refleksi.
  - Mengklik *"Misi Selesai & Paham! 🌟"* memunculkan toast perayaan dan menutup modal.

---

### 7. Pengujian Kepatuhan Penuh Google Apps Script (Zero .css & .js Files)
- [x] **Langkah 1**: Periksa struktur file proyek di root direktori.
- [x] **Hasil yang Diharapkan**:
  - **TIDAK ADA berkas berakhiran `.css` maupun `.js`**.
  - Seluruh stylesheet terintegrasi rapi di dalam [styles.html](file:///f:/repository/stemsites/styles.html) (`<style>...</style>`).
  - Seluruh logika interaktif terintegrasi rapi di dalam [scripts.html](file:///f:/repository/stemsites/scripts.html) (`<script>...</script>`).
  - [index.html](file:///f:/repository/stemsites/index.html) menggunakan tag include GAS: `<?!= include('styles'); ?>`, `<?!= include('admin'); ?>`, dan `<?!= include('scripts'); ?>`.
  - Dilengkapi skrip injeksi fallback lokal cerdas sehingga [index.html](file:///f:/repository/stemsites/index.html) tetap dapat diuji coba di browser lokal (Live Server) tanpa error 404.

---

## 🛡️ Bukti Berkas Modular Google Apps Script
- [styles.html](file:///f:/repository/stemsites/styles.html): Modular CSS murni GAS (`<style>...</style>`).
- [scripts.html](file:///f:/repository/stemsites/scripts.html): Modular JavaScript murni GAS (`<script>...</script>`).
- [admin.html](file:///f:/repository/stemsites/admin.html): Modular Admin View & Form markup murni GAS.
- [index.html](file:///f:/repository/stemsites/index.html): Modular Public Page Template & Include Loader.
- [Code.gs](file:///f:/repository/stemsites/Code.gs): Backend Google Apps Script dengan fungsi `include()` dan `doGet()`.
