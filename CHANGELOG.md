# Changelog

Semua perubahan pada proyek **Portal Pembelajaran STEM Sekolah Berbasis Google Apps Script** dicatat di dokumen ini.
Format penomoran versi mengacu pada [Semantic Versioning (SemVer 2.0.0)](https://semver.org/).

## [1.4.0] - 2026-10-26

### Added & Enhanced
- **Panduan Deploy Lengkap & Interactive Code Viewer 5 Berkas**:
  - **Selector 5 Berkas Proyek di Panel Admin**: Ditambahkan tab pemilih berkas interaktif pada tab *Step Deploy & Kode GAS* untuk menampilkan seluruh kode sumber lengkap dari 5 berkas: `Code.gs`, `index.html`, `styles.html`, `admin.html`, dan `scripts.html`.
  - **Tombol Salin 1-Klik (*Copy to Clipboard*)**: Memungkinkan pengguna/guru menyalin kode masing-masing berkas secara instan lengkap dengan indikator status sukses dan jumlah karakter.
  - **Panduan 7 Langkah Penerapan (*Deployment Steps*)**: Langkah terstruktur dari pembuatan spreadsheet baru, pembuatan 5 berkas di editor Apps Script, pengaturan hak akses web app (*Anyone*), hingga otorisasi izin akun Google.
  - **Dokumen Panduan Deploy Mandiri Lengkap**: Diterbitkan berkas panduan komprehensif di [docs/04-deployment/PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md](file:///f:/repository/stemsites/docs/04-deployment/PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md) yang memuat instruksi langkah-demi-langkah, kode sumber lengkap 5 berkas, dan FAQ otorisasi Google.

---

## [1.3.1] - 2026-10-26

### Restored & Enhanced
- **Kembalikan Formasi 2 Kolom Card STEM Beranda Mobile**:
  - 4 Card Utama STEM (Science, Technology, Engineering, Mathematics) di beranda publik dikembalikan ke formasi **2 kolom padat** (`grid-template-columns: repeat(2, 1fr) !important;`) pada mode smartphone (< 768px).
  - Tampilan beranda kembali ringkas, seimbang (2 baris x 2 kartu), dan tidak memerlukan scroll panjang.
  - Halaman lainnya (seperti form Pengaturan Logo & Sekolah Admin) tetap dipertahankan 1 kolom responsif agar tidak terpotong.
- **Pemulihan Contoh Materi Pembelajaran Sebelumnya**:
  - Mengembalikan daftar 8 item `INITIAL_MATERIALS` pada [scripts.html](file:///f:/repository/stemsites/scripts.html) dan `sampleMaterials` pada [Code.gs](file:///f:/repository/stemsites/Code.gs) ke konten materi awal yang disukai pengguna.
  - Pembaruan versi cache lokal `DATA_VERSION` menjadi `"v1.3.1"` agar browser klien otomatis memuat materi yang telah dipulihkan.
- **Dokumen Teknis & Penawaran Harga**:
  - Diterbitkan dokumen teknis resmi roadmap pengembangan dan proposal penawaran harga sistem portal STEM sekolah di [docs/01-proposals/PROPOSAL-PENAWARAN-DAN-RENCANA-PENGEMBANGAN-PORTAL-STEM.md](file:///f:/repository/stemsites/docs/01-proposals/PROPOSAL-PENAWARAN-DAN-RENCANA-PENGEMBANGAN-PORTAL-STEM.md).

---

## [1.3.0] - 2026-10-26

### Added & Enhanced
- **Tata Letak Responsif 1 Kolom Penuh Mode Mobile (< 768px)**:
  - **Admin Settings 1 Kolom**: Kelas `.settings-grid-layout` otomatis runtuh (*collapse*) menjadi 1 kolom (`1fr !important`), form input dan preview tersusun rapi secara vertikal tanpa terpotong atau meluap ke samping (*zero horizontal overflow*).
  - **4 Card Utama STEM Beranda 1 Kolom**: Tampilan kartu kategori STEM di beranda publik disesuaikan menjadi 1 kolom vertikal (`grid-template-columns: 1fr !important`) dengan padding lega, subtitle deskripsi aktif, dan indikator panah aksi yang jelas.
  - **Perapian Form & Filter Admin**: Filter bar dan header pada panel admin diselaraskan ke susunan vertikal 1 kolom penuh pada layar smartphone.
- **Pemurnian Arsitektur Google Apps Script (Zero `.css` & `.js`)**:
  - Berkas `.css` dan `.js` dihapus sepenuhnya dari repositori (`git rm style.css app.js`).
  - Proyek kini mematuhi 100% standar berkas Google Apps Script (hanya `.html` dan `.gs`), dengan styling terpusat di `styles.html`, logika di `scripts.html`, dan markup admin di `admin.html`.
  - Ditambahkan injector fallback lokal cerdas pada `index.html` agar repositori tetap dapat diuji coba di browser lokal (Live Server) tanpa memerlukan server build.

---

## [1.2.2] - 2026-10-25

### Added & Enhanced
- **Footer Resmi Terpusat (*Centered Footer*)**:
  - Seluruh elemen footer disusun di tengah (*center aligned*) dengan tata letak vertikal yang bersih, seimbang, dan elegan.
  - Tautan WhatsApp langsung menampilkan nomor telepon resmi tanpa awalan teks panjang (format rapi dan interaktif).
  - Tautan email resmi dihilangkan dari footer sesuai arahan pengguna.
  - Hak cipta sekolah tampil terpusat rapi di bawah tombol WhatsApp.
- **Perapian Tipografi & Tata Letak Mode Mobile**:
  - Penyesuaian proporsional ukuran font dan padding di semua komponen untuk layar smartphone (< 768px dan < 480px).
  - Merapikan navbar mobile, hero banner, caption beranda, dan 4 Card Utama STEM (2 card per baris).
  - Menyelaraskan tombol navigasi *"Menu STEM"*, banner info jenjang kelas, dan input pencarian pada halaman sub-materi.
  - Menghilangkan elemen yang tidak diperlukan dan memastikan nol scroll horizontal (*zero overflow*).

---

## [1.2.1] - 2026-10-25

### Added
- **Penguncian Jenjang Kelas Otomatis (*Grade Locking*)**:
  - Ketika siswa memilih jenjang spesifik (Kelas 1 s.d. 6 SD) pada pop-up di beranda, pilihan jenjang langsung dikunci saat memasuki halaman sub-materi.
  - Baris filter tombol kelas (`.grade-filter-bar`) otomatis disembunyikan agar tampilan bersih dan fokus.
  - Ditambahkan banner penanda *"Materi Khusus: Kelas X SD"* dengan tombol cepat `[ 🔄 Ganti Jenjang Kelas ]` untuk mengganti kelas kapan saja tanpa harus kembali ke beranda.
  - Jika siswa memilih *"Tampilkan Semua Kelas"*, baris filter kelas tetap tampil normal untuk eksplorasi bebas.
- **Isolasi Reset Filter**:
  - Tombol *Reset Filter* di halaman sub-materi kini hanya mereset pencarian kata kunci dan jenis media, dengan tetap menjaga kelas yang sedang terkunci.

---

## [1.2.0] - 2026-10-25

### Added
- **Modal Pop-up "Pilih Jenjang Kelas" Ramah Anak**:
  - Klik pada 4 Card Utama STEM (Science, Technology, Engineering, Mathematics) di beranda membuka pop-up interaktif pemilihan jenjang kelas.
  - Pilihan tombol besar: *"Tampilkan Semua Kelas"* dan tombol kelas 1 s.d. 6 SD.
  - Setelah jenjang dipilih, modal otomatis tertutup dan mengarahkan langsung ke halaman sub-kategori dengan filter jenjang kelas tersebut aktif seketika.
- **Footer Resmi Sekolah Ringkas & Elegan**:
  - Menampilkan elemen esensial sesuai arahan pengguna: Identitas Sekolah (Logo & Nama Sekolah), Kontak Bantuan langsung (WhatsApp & Email sekolah dinamis dari database settings), serta Hak Cipta Tahun Ajaran Aktif (`© 2026/2027 SD NEGERI HARAPAN BANGSA. Hak Cipta Dilindungi.`).

### Fixed & Enhanced
- **Perbaikan Hamburger Navigasi Mobile (Bebas Layout Shift)**:
  - Mengubah dropdown menu mobile menjadi *floating absolute overlay* (`position: absolute; top: 70px; z-index: 90;`) dengan efek backdrop blur dan bayangan halus.
  - Mengeliminasi pergeseran (*push layout shift*) pada konten hero banner saat menu mobile dibuka maupun ditutup.

---

## [1.1.1] - 2026-10-25

### Fixed & Enhanced
- **Penyelarasan Akurat Materi STEM & Simulasi**:
  - `STEM-SCI01`: Daur Hidup & Metamorfosis Kupu-kupu terhubung ke video pembelajaran animasi siklus hidup lengkap dengan 4 tahap.
  - `STEM-SCI02`: Eksplorasi Cahaya & Warna Tumbuhan terhubung ke simulasi resmi **PhET Colorado: Color Vision** (eksplorasi spektrum RGB dan pantulan warna hijau daun).
  - `STEM-TEC01`: Logika Coding Dasar terhubung ke game simulasi algoritma resmi **Google Blockly Games: Maze**.
  - `STEM-TEC02`: Literasi Digital & Anti-Hoaks terhubung ke simulasi 3D resmi **Google: Interland (Sungai Realitas)**.
  - `STEM-ENG01`: Rekayasa Keseimbangan Struktur terhubung ke simulasi resmi **PhET Colorado: Balancing Act** (hukum kesetimbangan beban dan titik tumpu).
  - `STEM-ENG02`: Desain Mobil Bertenaga Dorong Balon terhubung ke simulasi hukum gerak & energi **PhET Colorado: Energy Skate Park** dan panduan praktikum mandiri.
  - `STEM-MAT01`: Pecahan Pizza & Kue Lezat diperbarui ke tipe `Simulasi` dan terhubung langsung ke simulasi resmi **PhET Colorado: Fractions Intro** (model lingkaran pizza, kue, dan game pecahan interaktif).
  - `STEM-MAT02`: Arsitek Cilik: Eksplorasi Luas & Keliling terhubung langsung ke simulasi resmi **PhET Colorado: Area Builder** (perancangan denah bangun datar pada petak bergaris).
- **Auto-Sync Versi Data**: Menambahkan mekanisme sinkronisasi versi data otomatis (`DATA_VERSION: v1.1.1`) agar pengguna yang membuka kembali browser langsung mendapatkan data materi yang akurat tanpa perlu menghapus cache manual.

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
