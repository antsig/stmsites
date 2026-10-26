# 📋 Rencana Implementasi: 2 Kolom Card STEM Beranda Mobile & Kembalikan Contoh Materi Sebelumnya

## 📌 1. Konteks & Latar Belakang Masalah
1. **2 Kolom Card STEM di Beranda Mode Mobile**:
   - Pengguna meminta: *"2 kolom card stem di beranda pada mode mobile."*
   - Pada pembaruan sebelumnya, 4 card utama STEM diubah menjadi 1 kolom (`1fr`). Pengguna menginginkan 4 card STEM di beranda publik dikembalikan ke formasi **2 kolom** (2 card per baris) agar ringkas dan langsung terlihat tanpa harus scroll terlalu jauh.
   - Halaman lainnya (seperti form Pengaturan Logo & Sekolah Admin) tetap dipertahankan 1 kolom responsif agar tidak terpotong.
2. **Kembalikan Contoh Materi Sebelumnya**:
   - Pengguna meminta: *"kembalikan contoh materi sebelumnya"*.
   - Mengembalikan daftar `INITIAL_MATERIALS` di [scripts.html](file:///f:/repository/stemsites/scripts.html) dan `seedInitialData()` di [Code.gs](file:///f:/repository/stemsites/Code.gs) ke konten materi awal (sebelum revisi simulasi), mencakup materi:
     - `STEM-SCI01`: Petualangan Daur Hidup Kupu-kupu (Video daur hidup)
     - `STEM-SCI02`: Eksplorasi Fotosintesis: Mengapa Daun Berwarna Hijau? (Simulasi klorofil)
     - `STEM-TEC01`: Logika Coding Dasar: Algoritma Robot Pembawa Pesan (Simulasi Blockly)
     - `STEM-TEC02`: Jelajah Internet Cerdas: Cara Mencari Fakta & Menghindari Hoaks (Artikel literasi)
     - `STEM-ENG01`: Rekayasa Jembatan Kertas Kokoh Penahan Beban (Praktikum struktur lipatan)
     - `STEM-ENG02`: Desain Mobil Bertenaga Balon Udara (Hukum Gerak) (Praktikum mobil balon)
     - `STEM-MAT01`: Pecahan Pizza Lezat: Memahami 1/2, 1/4, dan 3/4 (Pecahan pizza)
     - `STEM-MAT02`: Detektif Sudut: Menemukan Sudut Siku-siku, Lancip, & Tumpul (Video busur & sudut)
   - Memperbarui versi cache lokal `DATA_VERSION` menjadi `"v1.3.1"` agar localStorage di browser pengguna otomatis memuat materi yang telah dikembalikan.

---

## 🎯 2. Ruang Lingkup Perubahan (Scope)

### A. Tampilan Beranda Mobile (2 Kolom Card STEM)
- Berkas: [styles.html](file:///f:/repository/stemsites/styles.html)
- Pada `@media (max-width: 767px)`:
  - Kembalikan `.stem-cards-grid` menjadi `grid-template-columns: repeat(2, 1fr) !important; gap: 0.65rem !important;`.
  - Sesuaikan ukuran card (`padding: 0.85rem 0.75rem;`), ikon box (38x38px), judul materi (0.98rem), dan sembunyikan subjudul (`.stem-subtitle { display: none; }`) agar 2 card tampil rapi, padat, dan seimbang dalam 1 baris.
  - Pertahankan tata letak 1 kolom untuk halaman lain: Admin Settings tetap 1 kolom vertikal, form-row 1 kolom, dan materials-grid sub-kategori 1 kolom.

### B. Pemulihan Materi Awal (Restore Previous Materials)
- Berkas: [scripts.html](file:///f:/repository/stemsites/scripts.html) & [Code.gs](file:///f:/repository/stemsites/Code.gs)
  - Kembalikan 8 item `INITIAL_MATERIALS` sesuai data komit awal sebelum v1.1.1.
  - Perbarui nilai `DATA_VERSION` di `fallbackToLocalStorage()` menjadi `"v1.3.1"` agar peramban langsung mereset cache materi ke data sebelumnya.
  - Sinkronkan array awal pada fungsi `seedInitialData()` di [Code.gs](file:///f:/repository/stemsites/Code.gs).

---

## 🏗️ 3. Inventaris Berkas
- [styles.html](file:///f:/repository/stemsites/styles.html): Penyesuaian grid 2 kolom untuk `.stem-cards-grid` di mobile.
- [scripts.html](file:///f:/repository/stemsites/scripts.html): Pemulihan 8 data materi awal dan pembaruan `DATA_VERSION`.
- [Code.gs](file:///f:/repository/stemsites/Code.gs): Pemulihan data seed awal di Google Sheets.
- [docs/WALKTHROUGH-stem-gas-webapp.md](file:///f:/repository/stemsites/docs/WALKTHROUGH-stem-gas-webapp.md): Pembaruan panduan pengujian 2 kolom card beranda dan materi.
- [CHANGELOG.md](file:///f:/repository/stemsites/CHANGELOG.md): Pembaruan versi SemVer ke `v1.3.1`.

---

## 🔄 4. Tahapan SOP Baku
- [x] **Fase 1**: Implementation Plan & Gerbang Persetujuan Pengguna (Disetujui Pengguna "eksekusi").
- [x] **Fase 2**: Eksekusi perubahan pada `styles.html`, `scripts.html`, dan `Code.gs`.
- [x] **Fase 3**: Verifikasi walkthrough dan pengujian mobile browser subagent.
- [x] **Fase 4**: Pembaruan `CHANGELOG.md` (v1.3.1).
- [x] **Fase 5**: Commit dan tag Git Conventional Commits `v1.3.1`, serta push ke remote.
