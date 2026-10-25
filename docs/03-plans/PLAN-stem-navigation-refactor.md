# 📋 Rencana Implementasi: Refactoring Navigasi 2-Tampilan & Pemisahan Modular CSS/JS

## 📌 1. Konteks & Latar Belakang Perubahan
Berdasarkan feedback pengguna, konsep penyajian materi STEM perlu dipertegas agar halaman beranda publik tampil sangat bersih, minimalis, dan terarah bagi siswa SD. Selain itu, aset styling (CSS) dan logika (JavaScript) perlu dipisahkan dari `index.html` demi kerapian kode serta kemudahan pemeliharaan, dan tampilan *Hero Banner* pada mode mobile perlu dirapikan dengan menyembunyikan elemen meta-bar.

---

## 🎯 2. Ruang Lingkup Perubahan (Scope)

### A. Penyempurnaan Tampilan Mobile & Hero Banner
1. **Sembunyikan `.hero-meta-bar` pada mode mobile** (`@media (max-width: 767px)`):
   - Elemen meta "Khusus Siswa Kelas 1 - 6", "Belajar Mandiri", dan "100% Akses Terbuka" disembunyikan di HP untuk menghemat ruang vertikal.
2. **Perapian Hero Banner Mobile**:
   - Menyesuaikan *padding*, ukuran font judul sekolah, dan slogan agar pas di layar kecil tanpa memakan banyak scroll.
   - Memastikan 4 Card Utama STEM tetap tampil **2 kartu per baris di mobile**.

### B. Arsitektur Tampilan 2-Tahap (Clean Public Home vs Halaman Khusus Sub-Materi)
1. **Tampilan 1: Beranda Utama Bersih (Home View)**:
   - Hanya menampilkan:
     - Header & Logo Sekolah.
     - Hero banner ringkas (nama sekolah, slogan, tahun ajaran).
     - Sedikit caption pengantar singkat ("Pilih Bidang STEM untuk Memulai Eksplorasi").
     - **4 Card Kategori Utama STEM (Science, Technology, Engineering, Mathematics)** dengan logo, warna tema, dan jumlah materi.
   - **SUB-MATERI TIDAK DITAMPILKAN DI HALAMAN INI**.
2. **Tampilan 2: Halaman Khusus Sub-Kategori STEM (Category Sub-Page View)**:
   - Terbuka otomatis saat salah satu dari 4 Card STEM diklik.
   - **4 Card Kategori Utama STEM SUDAH TIDAK DITAMPILKAN LAGI** di halaman ini.
   - Terdapat **Tombol Kembali ke Kategori Utama** (`⬅️ Kembali ke Menu STEM Utama`).
   - Header khusus bidang yang dipilih (contoh: *🔬 Eksplorasi Science - Sains Alam*).
   - Fitur Filter Kelas (Kelas 1 - 6), Filter Jenis Media (Video, Simulasi, dll.), dan Pencarian Kata Kunci instan.
   - Grid Sub-Card Materi khusus kategori terpilih + Pop-up Misi Eksplorasi Siswa.

### C. Pemisahan Modular CSS dan JavaScript
Untuk kompatibilitas 100% baik saat dijalankan di **Google Apps Script** maupun saat dibuka langsung di browser lokal (*offline file*):
1. **Pemisahan Berkas**:
   - `styles.html` (dan `style.css`): Berisi seluruh deklarasi style, variabel warna, responsivitas mobile 2-card, dan animasi.
   - `scripts.html` (dan `app.js`): Berisi state management, routing 2-tampilan, CRUD Admin, pencarian/filter, dan modal misi.
   - `index.html`: Murni struktur markup HTML bersih yang menyertakan stylesheet dan script secara modular (`<?!= include('styles'); ?>` dan `<?!= include('scripts'); ?>` untuk GAS, serta fallback lokal).
2. **Pembaruan `Code.gs`**:
   - Fungsi `include(filename)` digunakan untuk merender `styles.html` dan `scripts.html` ke dalam template utama `index.html`.

---

## 🏗️ 3. Inventaris Berkas
- [index.html](file:///f:/repository/stemsites/index.html): Restrukturisasi menjadi 2 view (`#viewHome` dan `#viewCategorySub`) + modular inclusion.
- [styles.html](file:///f:/repository/stemsites/styles.html) & [style.css](file:///f:/repository/stemsites/style.css): File modular CSS.
- [scripts.html](file:///f:/repository/stemsites/scripts.html) & [app.js](file:///f:/repository/stemsites/app.js): File modular JavaScript.
- [Code.gs](file:///f:/repository/stemsites/Code.gs): Pembaruan template include jika diperlukan.
- [docs/03-plans/PLAN-stem-navigation-refactor.md](file:///f:/repository/stemsites/docs/03-plans/PLAN-stem-navigation-refactor.md): Dokumen rencana ini.
- [CHANGELOG.md](file:///f:/repository/stemsites/CHANGELOG.md): Pembaruan versi ke v1.1.0.

---

## 🔄 4. Tahapan SOP
- [x] **Fase 1**: Penyusunan Implementation Plan & Menunggu Persetujuan Pengguna (Saat ini).
- [ ] **Fase 2**: Eksekusi pemisahan CSS/JS dan implementasi 2-View routing (Home View vs Category View).
- [ ] **Fase 3**: Verifikasi walkthrough tampilan mobile dan alur navigasi buka-kembali kategori.
- [ ] **Fase 4**: Pembaruan `CHANGELOG.md` (v1.1.0).
- [ ] **Fase 5**: Commit dan tag Git Conventional Commits.
