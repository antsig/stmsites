# Changelog

Semua perubahan pada proyek **Portal Pembelajaran STEM Sekolah Berbasis Google Apps Script** dicatat di dokumen ini.
Format penomoran versi mengacu pada [Semantic Versioning (SemVer 2.0.0)](https://semver.org/).

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
