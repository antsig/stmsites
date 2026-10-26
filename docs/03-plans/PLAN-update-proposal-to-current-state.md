# Implementation Plan: Update Proposal Sesuai Keadaan Proyek Saat Ini (v1.4.3 Tanpa Rencana Lanjutan)

Dokumen ini disusun mengikuti **SOP 5-Fase Wajib Tim Koding Antigravity** untuk menyelaraskan dokumen proposal penawaran harga teknis di `docs/01-proposals/PROPOSAL-PENAWARAN-DAN-RENCANA-PENGEMBANGAN-PORTAL-STEM.md` agar mencerminkan kondisi nyata proyek saat ini (versi v1.4.3) dan menghapus rencana pengembangan masa depan.

---

## 1. Analisis Kebutuhan Penyesuaian

### 1.1 Hal yang Dihilangkan (Out-of-Scope)
- **Bagian 2: Rencana Pengembangan Lanjutan (*To-Be Roadmap*)**:
  - Dihapus seluruhnya: Gamifikasi Kuis Mandiri, Lencana Digital, Asisten AI Google Gemini, dan Looker Studio Dashboard.
  - Matriks perbandingan paket yang mencantumkan fitur-fitur masa depan tersebut dibersihkan.

### 1.2 Hal yang Dimutakhirkan Sesuai Keadaan Proyek Saat Ini (Rilis v1.4.3)
1. **Fitur Portal Publik Siswa (Ready-to-Use)**:
   - Formasi 2 kolom kartu STEM ramah smartphone.
   - Grade selector 1–6 SD dengan grade-locking.
   - Modal misi eksplorasi interaktif (Tujuan, Panduan Praktikum, Video, Simulasi PhET/Blockly, Refleksi).
2. **Dashboard Admin Guru Terpadu & Standalone**:
   - Autentikasi PIN keamanan (demo PIN + custom PIN).
   - Navbar admin ultra-kompak 1 baris tanpa wrapping.
   - Manajemen Konten Sub-Card Materi STEM (CRUD lengkap) dengan filter 1 baris kompak.
   - *Thumb-zone ergonomics*: Tombol tambah dan tombol simpan di bawah form/filter di ponsel.
   - Kustomisasi Identitas Sekolah & Logo 4 pilar STEM dengan live preview.
3. **Pusat Penerapan Mandiri (*Self-Deployment Hub*)**:
   - Panduan 7 langkah deploy ke Google Apps Script di panel admin.
   - Interactive code viewer 5 berkas (`Code.gs`, `index.html`, `styles.html`, `admin.html`, `scripts.html`) dengan tombol salin 1-klik (*copy to clipboard*).
4. **Arsitektur Dual-Mode & Zero Server Cost**:
   - Hosting gratis selamanya di Google Apps Script terhubung ke Google Sheets (Rp 0/bulan).
   - Dukungan mode offline lokal standalone bebas CORS.
5. **Skema Penawaran Harga Riil & Terukur**:
   - Penawaran difokuskan pada paket serah terima sistem, instalasi di akun Google sekolah, kustomisasi konten awal, serta pelatihan dan garansi pemeliharaan.

---

## 2. Inventaris Berkas (*File Inventory*)

| No | Berkas | Aksi | Deskripsi |
|---|---|---|---|
| 1 | `docs/01-proposals/PROPOSAL-PENAWARAN-DAN-RENCANA-PENGEMBANGAN-PORTAL-STEM.md` | Overwrite | Menyesuaikan isi proposal dengan status riil v1.4.3 tanpa roadmap masa depan. |
| 2 | `CHANGELOG.md` | Edit | Catatan pembaruan dokumentasi proposal. |

---

## 3. Langkah Kerja
1. **Langkah 1**: Buat dokumen rencana (dokumen ini).
2. **Langkah 2**: Tulis ulang isi berkas proposal dengan struktur profesional, spesifikasi riil v1.4.3, dan paket penawaran implementasi siap pakai.
3. **Langkah 3**: Verifikasi kelengkapan dan konsistensi proposal.
4. **Langkah 4**: Update `CHANGELOG.md` dan lakukan Git commit + push.
