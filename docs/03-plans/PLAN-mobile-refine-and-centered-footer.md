# 📋 Rencana Implementasi: Perapian Mode Mobile & Footer Terpusat (Center)

## 📌 1. Konteks & Latar Belakang Masalah
Pengguna telah melakukan beberapa penyesuaian langsung pada antarmuka [index.html](file:///f:/repository/stemsites/index.html) dan meminta penyempurnaan menyeluruh:
1. **Perapian Mode Mobile**:
   - Penyesuaian ukuran font (*typography scaling*) dan tata letak (*layout & spacing*) di semua komponen saat dibuka di ponsel (layar < 768px dan < 480px).
   - Menghilangkan elemen-elemen yang tidak diperlukan agar antarmuka ringkas, bersih, dan proporsional.
2. **Penyempurnaan Footer**:
   - Dibuat terpusat (*center aligned*).
   - Kontak WhatsApp langsung menampilkan nomor telepon (tanpa teks awalan "WA Bantuan:", format bersih dan interaktif).
   - Email resmi dihapus dari footer.
   - Teks hak cipta berada di tengah di bawah nomor WhatsApp.

---

## 🎯 2. Ruang Lingkup Perubahan (Scope)

### A. Perapian Tata Letak & Tipografi Mode Mobile (< 768px & < 480px)
1. **Header & Navbar**:
   - Batasi ukuran teks nama sekolah pada navbar mobile agar tidak meluap (*overflow*).
   - Padding container navbar mobile 0.75rem 1rem.
2. **Hero Banner**:
   - Padding hero banner mobile dibuat lebih proporsional (`1.5rem 1rem 1.75rem`).
   - Judul dan slogan disesuaikan ukurannya (`font-size: 1.35rem` dan `0.85rem`).
3. **Caption & 4 Card Utama STEM**:
   - Caption pengantar diperkecil (`font-size: 1.15rem` untuk h2 dan `0.82rem` untuk p).
   - 4 Card STEM (2 card per baris): padding diperhalus (`0.85rem 0.75rem`), ikon box proporsional (`42px`), nama kategori `1rem`.
4. **Halaman Khusus Sub-Kategori STEM**:
   - Header sub-kategori: tombol *"Menu STEM"* dan judul bidang STEM ditata sejajar dan rapi.
   - Panel filter: search input tinggi `42px` yang nyaman disentuh, baris filter jenjang rapi dengan pill yang proporsional.
   - Banner jenjang terkunci (`.locked-grade-banner`): tata letak flex center/space-between yang rapi, font teks jenjang pas, dan tombol *"Ganti Kelas"* nyaman di-tap.
   - Grid sub-materi: thumbnail gambar `150px`, judul materi `0.98rem` (maks 2 baris), tombol *"Mulai Eksplorasi"* min 44px touch target.
5. **Modal Pop-up (Pilihan Kelas & Misi Siswa)**:
   - Margin modal di mobile dibuat ramping (`0.75rem`), tombol pilihan jenjang kelas diatur dalam grid 2 kolom dengan touch target nyaman.

### B. Footer Resmi Terpusat (Centered Footer)
1. **Struktur HTML**:
   - Hapus markup komentar yang sudah tidak digunakan (`.footer-brand`, `footerEmailLink`, `.footer-bottom`).
   - Struktur footer terpusat:
     ```html
     <footer class="site-footer">
       <div class="container footer-centered-wrap">
         <div class="footer-contacts">
           <a id="footerWaLink" href="#" target="_blank" class="footer-contact-item">
             <i class="fa-brands fa-whatsapp" style="color:#22C55E;"></i> <span id="footerWaText">-</span>
           </a>
         </div>
         <div class="footer-copy">
           &copy; <span id="footerSchoolNameBottom">-</span>. Hak Cipta Dilindungi.
         </div>
       </div>
     </footer>
     ```
2. **Styling CSS**:
   - `.site-footer`: `text-align: center; padding: 1.75rem 1rem 1.5rem;`
   - `.footer-centered-wrap`: flex direction column, align-items center, gap 0.75rem.
   - `.footer-contact-item`: ukuran tombol WhatsApp yang nyaman, elegan, dan menonjol di tengah.
3. **Logika JS (`app.js` & `scripts.html`)**:
   - Format nomor WhatsApp langsung ditampilkan sebagai nomor (misal `0812-3456-7890` atau `+62 812-3456-7890`).
   - Hapus referensi ke `footerEmailLink`.

---

## 🏗️ 3. Inventaris Berkas
- [index.html](file:///f:/repository/stemsites/index.html): Perapian struktur footer terpusat dan pembersihan markup komentar.
- [style.css](file:///f:/repository/stemsites/style.css) & [styles.html](file:///f:/repository/stemsites/styles.html): Penambahan aturan responsif mobile tipografi, tata letak kartu & modal, serta styling footer terpusat.
- [app.js](file:///f:/repository/stemsites/app.js) & [scripts.html](file:///f:/repository/stemsites/scripts.html): Penyesuaian format tampilan nomor WhatsApp langsung tanpa teks awalan dan pembersihan logika email footer.
- [docs/WALKTHROUGH-stem-gas-webapp.md](file:///f:/repository/stemsites/docs/WALKTHROUGH-stem-gas-webapp.md): Panduan verifikasi mobile UX dan centered footer.
- [CHANGELOG.md](file:///f:/repository/stemsites/CHANGELOG.md): Pembaruan versi SemVer ke v1.2.2.

---

## 🔄 4. Tahapan SOP Baku
- [x] **Fase 1**: Implementation Plan & Gerbang Persetujuan Pengguna.
- [x] **Fase 2**: Eksekusi perubahan kode pada `index.html`, `style.css`, `styles.html`, `app.js`, dan `scripts.html`.
- [x] **Fase 3**: Verifikasi walkthrough tampilan mobile dan footer terpusat.
- [x] **Fase 4**: Pembaruan `CHANGELOG.md` (v1.2.2).
- [x] **Fase 5**: Commit dan tag Git Conventional Commits `v1.2.2`.
