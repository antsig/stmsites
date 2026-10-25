# 📋 Rencana Implementasi: 1 Kolom Rapi di Mode Mobile & Pemurnian Format Google Apps Script (Hapus Ekstensi .css dan .js)

## 📌 1. Konteks & Latar Belakang Masalah
Berdasarkan screenshot dan arahan langsung dari pengguna:
1. **Tata Letak 1 Kolom di Mode Mobile**:
   - Pada mode mobile (layar 394px), halaman Admin (Tab Pengaturan Logo & Sekolah) menampilkan kolom form dan kotak pratinjau secara berdampingan (2 kolom), menyebabkan teks dan kolom terpotong (*horizontal overflow*).
   - Pengguna meminta agar seluruh halaman di mode mobile ditampilkan **1 kolom dengan rapi**, baik di halaman Admin, Beranda Publik (4 Card STEM), Sub-Kategori, maupun Modal.
2. **Kesesuaian Baku Google Apps Script (GAS)**:
   - Pengguna mengingatkan: *"ingat! ini untuk google action script seharuna tidak ada file ekstensi css dan js"*.
   - Lingkungan Google Apps Script **hanya mendukung berkas berekstensi `.html` dan `.gs`**. Berkas `.css` dan `.js` tidak diizinkan di editor proyek Google Apps Script.
   - Oleh karena itu, berkas `style.css` dan `app.js` harus dihapus sepenuhnya dari repositori, dan seluruh kode dialihkan ke `styles.html` dan `scripts.html`.

---

## 🎯 2. Ruang Lingkup Perubahan (Scope)

### A. Tata Letak 1 Kolom Rapi di Mode Mobile (< 768px & < 480px)
1. **Halaman Admin STEM (`admin.html` & `styles.html`)**:
   - Ubah `.settings-grid-layout` dari inline 2-kolom (`1fr 340px`) menjadi CSS class responsif. Pada layar mobile/tablet (< 992px), layout otomatis menjadi **1 kolom penuh** (`grid-template-columns: 1fr !important;`).
   - Kotak pratinjau live (*Live Preview Area*) tampil rapi di bawah form secara vertikal (1 kolom).
   - Seluruh baris form input (`.form-row-2`, `.form-row-4`) diatur menjadi 1 kolom.
   - Filter bar admin (search & dropdown) diatur menjadi 1 kolom vertikal yang rapi.
   - Tombol-tombol aksi header admin (Simpan, Tambah Card) dibuat full width atau terpusat.
2. **Halaman Beranda Publik (`#viewHome`)**:
   - 4 Card Utama STEM (Science, Technology, Engineering, Mathematics) ditampilkan dalam **1 kolom penuh** di layar mobile (`grid-template-columns: 1fr !important;`).
   - Setiap kartu memiliki ruang yang lega untuk menampilkan ikon, judul, subjudul deskripsi materi, jumlah materi, dan indikator buka materi secara proporsional.
3. **Halaman Khusus Sub-Kategori (`#viewCategorySub`)**:
   - Header sub-kategori, input pencarian, dan banner jenjang kelas tertata rapi dalam 1 kolom.
   - Grid kartu sub-materi tampil dalam **1 kolom** dengan gambar dan teks yang nyaman dibaca.
4. **Modal Pop-up**:
   - Modal pilihan jenjang kelas dan modal misi praktikum ditata rapi dalam 1 kolom tanpa risiko scroll horizontal liar.

### B. Pemurnian Format Google Apps Script (Zero .css & .js Files)
1. **Penghapusan Berkas `.css` dan `.js`**:
   - Hapus berkas [style.css](file:///f:/repository/stemsites/style.css) dan [app.js](file:///f:/repository/stemsites/app.js) dari repositori via `git rm`.
2. **Sinkronisasi Total ke `.html`**:
   - Pastikan seluruh styling berada di [styles.html](file:///f:/repository/stemsites/styles.html) (di dalam tag `<style>...</style>`).
   - Pastikan seluruh logika interaktif berada di [scripts.html](file:///f:/repository/stemsites/scripts.html) (di dalam tag `<script>...</script>`).
3. **Penyempurnaan [index.html](file:///f:/repository/stemsites/index.html)**:
   - Hapus `<link rel="stylesheet" href="style.css">` dan `<script src="app.js"></script>`.
   - Gunakan murni tag evaluasi GAS `<?!= include('styles'); ?>`, `<?!= include('admin'); ?>`, dan `<?!= include('scripts'); ?>`.
   - Tambahkan skrip fallback lokal otomatis agar Live Server / file:// tetap dapat memuat `styles.html`, `scripts.html`, dan `admin.html` tanpa memerlukan file `.css` atau `.js` sama sekali.

---

## 🏗️ 3. Inventaris Berkas
- [admin.html](file:///f:/repository/stemsites/admin.html): Perbaikan kelas `.settings-grid-layout` dan tata letak 1 kolom.
- [styles.html](file:///f:/repository/stemsites/styles.html): Penambahan aturan CSS 1 kolom untuk admin, 4 card STEM, dan sub-materi.
- [index.html](file:///f:/repository/stemsites/index.html): Penghapusan link `style.css` dan `app.js`, digantikan murni `styles.html` dan `scripts.html`.
- [scripts.html](file:///f:/repository/stemsites/scripts.html): Verifikasi fungsi dan kompatibilitas murni GAS.
- `style.css` & `app.js`: Dihapus dari repositori (`git rm`).
- [docs/WALKTHROUGH-stem-gas-webapp.md](file:///f:/repository/stemsites/docs/WALKTHROUGH-stem-gas-webapp.md): Panduan verifikasi uji mobile 1 kolom dan GAS purity.
- [CHANGELOG.md](file:///f:/repository/stemsites/CHANGELOG.md): Pembaruan versi SemVer ke v1.3.0 (penghapusan arsitektur .css/.js & perombakan mobile 1 kolom).

---

## 🔄 4. Tahapan SOP Baku
- [x] **Fase 1**: Implementation Plan & Gerbang Persetujuan Pengguna (Disetujui Pengguna "ya").
- [x] **Fase 2**: Eksekusi perubahan kode pada `admin.html`, `styles.html`, `index.html`, `scripts.html`, serta penghapusan `style.css` dan `app.js`.
- [x] **Fase 3**: Verifikasi walkthrough tata letak 1 kolom dan kepatuhan Google Apps Script.
- [x] **Fase 4**: Pembaruan `CHANGELOG.md` (v1.3.0).
- [x] **Fase 5**: Commit dan tag Git Conventional Commits `v1.3.0`.
