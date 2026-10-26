# Implementation Plan: Format Tabel Terpadu Rincian Estimasi Biaya Berdasarkan Peran & Fitur (Anggaran Rp 3.500.000,-)

Dokumen ini disusun mengikuti **SOP 5-Fase Wajib Tim Koding Antigravity** untuk menyelaraskan format tabel rincian estimasi biaya pada Bab 3 dokumen proposal `docs/01-proposals/PROPOSAL-PENAWARAN-DAN-RENCANA-PENGEMBANGAN-PORTAL-STEM.md` agar mengadopsi format matriks tunggal terpadu sesuai contoh yang diajukan pengguna: `PERAN TEKNIS | FITUR YANG DIKERJAKAN | URAIAN PEKERJAAN | BIAYA (RP)`.

---

## 1. Analisis & Struktur Matriks Terpadu

### 1.1 Kolom Matriks Terpadu
1. **PERAN TEKNIS**: Peran spesialis rekayasa perangkat lunak (UI/UX & Frontend Developer, Backend & Script Engineer, Data & EdTech Specialist, QA Specialist & Deployment Facilitator).
2. **FITUR YANG DIKERJAKAN**: Modul sistem yang diimplementasikan.
3. **URAIAN PEKERJAAN**: Rincian butir-butir tugas konkret yang dikerjakan.
4. **BIAYA (RP)**: Alokasi biaya bersih per peran & fitur.

### 1.2 Rincian Alokasi Biaya (Total: Rp 3.500.000,-)
- **UI/UX & Frontend Developer** (Portal Siswa, 2 Kolom Mobile, Filter Jenjang Kelas 1-6 SD, Modal Misi Eksplorasi PhET/Blockly/Video, Fluid Typography): **Rp 1.200.000,-**
- **Backend & Script Engineer** (Dashboard Admin Guru, Skrip Backend Code.gs V8, Keamanan PIN, Topbar 1 Baris No-Wrap, Filter Tabel 1 Baris, Tombol Aksi Bawah Form/Filter, CORS-free Standalone Mode): **Rp 1.350.000,-**
- **Data & EdTech Specialist** (Integrasi Google Sheets Database `Settings` & `Materi`, Inisialisasi Otomatis, Kustomisasi Profil Sekolah & Logo dengan Live Preview, Kurasi 12 Materi Awal STEM SD): **Rp 550.000,-**
- **QA Specialist & Deployment Facilitator** (Pengujian Menyeluruh Lintas Perangkat, Modul Interactive Code Viewer 5 Berkas dengan Tombol Salin 1-Klik, Panduan Deploy 7 Langkah & User Manual, 1 Sesi Pelatihan Daring Guru 2 Jam, Garansi 3 Bulan): **Rp 400.000,-**
- **TOTAL OPSI (GOOGLE APPS SCRIPT READY-TO-USE)**: **Rp 3.500.000,-**

---

## 2. Inventaris Berkas (*File Inventory*)

| No | Berkas | Aksi | Deskripsi |
|---|---|---|---|
| 1 | `docs/01-proposals/PROPOSAL-PENAWARAN-DAN-RENCANA-PENGEMBANGAN-PORTAL-STEM.md` | Edit | Mengubah subbab 3.1 & 3.2 menjadi format matriks tunggal terpadu 4 kolom. |
| 2 | `CHANGELOG.md` | Edit | Mencatat penyesuaian format tabel matriks estimasi biaya proposal. |

---

## 3. Langkah Kerja
1. Buat rencana kerja (dokumen ini).
2. Ubah format tabel pada Bab 3 di berkas proposal sesuai format contoh pengguna.
3. Verifikasi jumlah matematis dan kejelasan uraian pekerjaan.
4. Perbarui `CHANGELOG.md` dan lakukan Git commit + push.
