# 📋 Rencana Implementasi: Modal Pilihan Kelas Instan, Fix Mobile Menu, & Footer Interaktif

## 📌 1. Konteks & Latar Belakang
Pengguna mengajukan penyempurnaan alur belajar siswa, perbaikan UX navigasi mobile, serta penambahan footer:
1. **Alur Pemilihan Kelas Instan via Pop-up**: Ketika siswa mengklik salah satu dari 4 Card STEM (misal: Science), muncul pop-up ramah anak *"Pilih Jenjang Kelasmu"* (Semua Kelas, Kelas 1 s.d. 6). Setelah kelas dipilih, aplikasi langsung membuka halaman sub-kategori yang sudah terfilter secara otomatis.
2. **Perbaikan Hamburger / Burger Menu Mobile**: Menu mobile saat ini masih berada di alur dokumen normal sehingga mendorong konten hero ke bawah saat dibuka. Perlu diubah menjadi *floating absolute / overlay dropdown* dengan bayangan halus agar tidak menggeser layout halaman.
3. **Penambahan Footer Edukasi**: Menampilkan identitas sekolah, tautan cepat bidang STEM, panduan pengguna, kontak bantuan (WhatsApp & Email sekolah dinamis dari database settings), serta hak cipta.

---

## 🎯 2. Ruang Lingkup Perubahan (Scope)

### A. Modal Pop-up "Pilih Jenjang Kelasmu" (Interactive Grade Selector)
- Saat kartu Science / Technology / Engineering / Mathematics diklik di beranda:
  - Membuka modal interaktif yang ceria dan ramah anak.
  - Menampilkan header bidang STEM terpilih (ikon, warna khas, dan nama bidang).
  - Pilihan tombol besar yang mudah disentuh (*touch-target* nyaman):
    - 🌟 **Semua Kelas** (Tampilkan semua materi)
    - 🎒 **Kelas 1**, **Kelas 2**, **Kelas 3**, **Kelas 4**, **Kelas 5**, **Kelas 6**
  - Setelah salah satu tombol diklik:
    - Modal otomatis menutup.
    - Aplikasi berpindah ke halaman khusus sub-kategori STEM dengan filter kelas tersebut langsung aktif seketika.
  - Di dalam halaman sub-kategori, siswa tetap dapat mengganti pilihan kelas melalui pil filter yang ada.

### B. Perbaikan Navigasi Burger Menu Mobile (Floating Overlay)
- Mengubah posisi `#mobileNavMenu` menjadi:
  - `position: absolute; top: 70px; left: 0; right: 0; z-index: 90;`
  - `background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(12px);`
  - `box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15); border-bottom: 1px solid var(--border-color);`
- Menghilangkan pergeseran (*layout shift*) pada konten hero banner saat menu mobile dibuka atau ditutup.

### C. Footer Ringkas & Elegan (Sesuai Arahan Pengguna)
- Menambahkan elemen `<footer>` yang bersih, rapi, dan proporsional di bagian bawah portal:
  - **Identitas Sekolah**: Logo sekolah dan Nama Sekolah (`footerSchoolName`).
  - **Kontak Bantuan**: Tautan langsung WhatsApp Bantuan & Email Resmi sekolah yang tersinkronisasi dinamis dari settings.
  - **Hak Cipta**: Hak cipta tahun ajaran aktif (`© 2026/2027 [Nama Sekolah]. Hak Cipta Dilindungi.`).
  - *Catatan*: Tidak menambahkan link menu navigasi yang berlebihan agar footer tetap bersih, padat, dan elegan.

---

## 🏗️ 3. Inventaris Berkas
- [index.html](file:///f:/repository/stemsites/index.html): Menambahkan modal pilihan kelas `#gradeSelectorModal`, struktur `<footer>`, dan floating wrapper menu mobile.
- [style.css](file:///f:/repository/stemsites/style.css) & [styles.html](file:///f:/repository/stemsites/styles.html): Styling modal pilihan kelas (grid tombol ramah anak), perbaikan CSS floating mobile menu, dan styling footer responsif.
- [app.js](file:///f:/repository/stemsites/app.js) & [scripts.html](file:///f:/repository/stemsites/scripts.html): Fungsi `openGradeSelector(cat)` dan `confirmGradeSelection(grade)` serta sinkronisasi kontak footer dari settings.
- [CHANGELOG.md](file:///f:/repository/stemsites/CHANGELOG.md): Pembaruan versi ke v1.2.0.
- [docs/WALKTHROUGH-stem-gas-webapp.md](file:///f:/repository/stemsites/docs/WALKTHROUGH-stem-gas-webapp.md): Pembaruan skenario pengujian.

---

## 🔄 4. Tahapan SOP
- [x] **Fase 1**: Implementation Plan & Gerbang Persetujuan Pengguna.
- [x] **Fase 2**: Eksekusi perubahan kode pada `style.css`, `styles.html`, `index.html`, `app.js`, dan `scripts.html`.
- [x] **Fase 3**: Verifikasi walkthrough modal pilihan kelas, floating mobile menu, dan footer.
- [x] **Fase 4**: Pembaruan `CHANGELOG.md` (v1.2.0).
- [x] **Fase 5**: Commit dan tag Git Conventional Commits.
