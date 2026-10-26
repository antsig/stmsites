# Implementation Plan: Penambahan Ruang Lingkup Aplikasi & Rincian Estimasi Biaya Berdasarkan Peran & Fitur (Anggaran Rp 3.500.000,-)

Dokumen ini disusun mengikuti **SOP 5-Fase Wajib Tim Koding Antigravity** untuk melengkapi proposal penawaran teknis di `docs/01-proposals/PROPOSAL-PENAWARAN-DAN-RENCANA-PENGEMBANGAN-PORTAL-STEM.md`.

---

## 1. Analisis Kebutuhan

### 1.1 Penambahan Bagian Ruang Lingkup Aplikasi (*Scope of Work*)
- Menjelaskan batasan tegas antara apa yang masuk ke dalam cakupan sistem (*In-Scope*) dan apa yang berada di luar cakupan (*Out-of-Scope*) agar transparan bagi pihak sekolah dan tim pengembang:
  - **In-Scope**:
    * Portal publik siswa (4 pilar STEM, 2 kolom mobile, selektor kelas 1–6 SD, modal misi eksplorasi & simulasi PhET/Blockly/Video, refleksi).
    * Dashboard admin guru (autentikasi PIN demo & ganti PIN, topbar 1 baris mobile, manajemen materi STEM CRUD, filter 1 baris kompak, tombol aksi di bawah formulir/filter).
    * Kustomisasi identitas sekolah & logo (live preview panel).
    * Pusat panduan deploy 7 langkah dan interactive code viewer 5 berkas (`Code.gs`, `index.html`, `styles.html`, `admin.html`, `scripts.html`) dengan tombol salin 1-klik.
    * Pangkalan data awan Google Sheets (gratis selamanya Rp 0/bulan) dan mode offline standalone bebas CORS.
    * Sesi pelatihan daring guru dan garansi bebas bug.
  - **Out-of-Scope**:
    * Pengadaan perangkat keras (tablet/laptop/komputer siswa).
    * Penyediaan jaringan internet / kuota data sekolah.
    * Integrasi sistem pembayaran / payment gateway berbayar (karena portal bersifat non-komersial untuk siswa).

### 1.2 Penambahan Bagian "3. Rincian Estimasi Biaya Berdasarkan Peran & Fitur"
- Menyajikan perincian transparan dengan total anggaran tepat **Rp 3.500.000,-**:
  - **Tabel 1: Rincian Biaya Berdasarkan Komponen Fitur Aplikasi** (Portal Siswa, Dashboard Admin Guru, Kustomisasi & Backend GAS, Self-Deployment Hub, QA & Pelatihan Guru).
  - **Tabel 2: Rincian Biaya Berdasarkan Peran Tim Rekayasa Perangkat Lunak** (Solution Architect, Senior Frontend Engineer, Backend & GAS Specialist, EdTech Specialist, QA Tester).
  - Penyesuaian jadwal termin pembayaran: Termin I (DP 50% = Rp 1.750.000,-) dan Termin II (Pelunasan 50% = Rp 1.750.000,-).

---

## 2. Inventaris Berkas (*File Inventory*)

| No | Berkas | Aksi | Deskripsi |
|---|---|---|---|
| 1 | `docs/01-proposals/PROPOSAL-PENAWARAN-DAN-RENCANA-PENGEMBANGAN-PORTAL-STEM.md` | Overwrite | Menambahkan Ruang Lingkup dan Bab 3 Rincian Biaya Peran & Fitur (Rp 3.500.000,-). |
| 2 | `CHANGELOG.md` | Edit | Catatan pembaruan proposal penawaran biaya peran & fitur. |

---

## 3. Langkah Kerja
1. **Langkah 1**: Buat dokumen rencana (dokumen ini).
2. **Langkah 2**: Perbarui berkas proposal dengan muatan Ruang Lingkup dan Bab 3 Rincian Biaya (Rp 3.500.000,-).
3. **Langkah 3**: Verifikasi kelengkapan matematis anggaran dan konsistensi struktur bab.
4. **Langkah 4**: Update `CHANGELOG.md` dan commit + push ke remote repository.
