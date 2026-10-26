# Implementation Plan: Pemutakhiran Seluruh Panduan & Mekanisme Auto-Seeding Materi di GAS (v1.5.1)

Dokumen rencana kerja ini merespons pertanyaan pengguna:
1. *Apakah seluruh panduan sudah diupdate?*
2. *Bagaimana supaya materi langsung terbaca setelah dipindah ke Google Apps Script (GAS)?*

---

## 1. Konteks & Analisis As-Is vs To-Be

### As-Is (Kondisi Saat Ini)
1. **Panduan Deployment**:
   - Berkas `docs/04-deployment/PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md` masih mencantumkan versi `v1.4.0` dan kode sumber di dalamnya masih menggunakan 8 materi versi lama (belum 24 materi `v1.5.0`).
   - Berkas `README.md` masih mencantumkan versi `v1.1.0` di petunjuk deploy.
2. **Pembacaan Materi di Google Apps Script (GAS)**:
   - Pada `Code.gs`, fungsi `initDatabaseIfEmpty()` hanya melakukan seeding jika tab sheet `Materi` belum ada (`if (!materiSheet)`). Jika pengguna secara manual membuat sheet bernama `Materi` (kosong), seeding tidak akan berjalan.
   - Pada `scripts.html`, jika `response.data.materials` bernilai kosong (`[]`), frontend menerima array kosong sehingga halaman bisa terlihat kosong sebelum admin menginput materi.

### To-Be (Target Perbaikan)
1. **Auto-Seeding & Double-Guarantee di GAS**:
   - `Code.gs`:
     - Periksa apakah `materiSheet.getLastRow() <= 1` (hanya header atau kosong), lalu otomatis tulis 24 materi lengkap kurikulum SD.
     - Tambahkan trigger `onOpen()` yang memunculkan menu khusus di Google Sheets: `🌟 Portal STEM` > `📥 Muat / Reset 24 Materi Kurikulum SD` dan `⚙️ Cek & Perbaiki Database Sheet`.
     - Tambahkan fungsi `forceSeedMaterials()` yang dapat dipanggil dari menu Sheets maupun dari Panel Admin.
   - `scripts.html` & `index.html` & `admin.html`:
     - Di fungsi `loadInitialData()`, jika `response.data.materials` kosong (`length === 0`), otomatis fallback ke `INITIAL_MATERIALS` (24 materi) agar portal langsung menampilkan materi secara instan pada detik pertama dibuka di GAS.
2. **Pemutakhiran Seluruh Panduan**:
   - `docs/04-deployment/PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md`:
     - Mutakhirkan versi ke `v1.5.0`.
     - Perbarui seluruh blok kode 5 berkas (`Code.gs`, `index.html`, `styles.html`, `admin.html`, `scripts.html`) dengan kode `v1.5.0` aktif.
     - Tambahkan penjelasan teknis: *Cara Kerja Auto-Seeding Database & Mengapa Materi Otomatis Muncul Langsung*.
   - `README.md`:
     - Mutakhirkan versi ke `v1.5.0` dan perbarui ringkasan 24 materi kurikulum STEM SD.
   - `admin.html`:
     - Tambahkan tombol bantuan di tab *Step Deploy & Kode GAS*: `📥 Muat Ulang 24 Materi ke Google Sheets`.

---

## 2. Inventaris Berkas

| No | Berkas | Aksi | Deskripsi |
|:---:|---|:---:|---|
| 1 | `Code.gs` | Edit | Tambah `materiSheet.getLastRow() <= 1` check, menu `onOpen()`, dan fungsi `forceSeedMaterials()`. |
| 2 | `scripts.html` | Edit | Tambah instant fallback `INITIAL_MATERIALS` jika `response.data.materials` kosong. |
| 3 | `index.html` | Edit | Sinkronisasi fallback yang sama di `index.html`. |
| 4 | `admin.html` | Edit | Sinkronisasi fallback dan penambahan tombol sinkronisasi materi ke GAS. |
| 5 | `docs/04-deployment/PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md` | Edit | Pembaruan versi `v1.5.0`, sinkronisasi 5 berkas kode, dan panduan auto-seeding. |
| 6 | `README.md` | Edit | Pembaruan ringkasan fitur, versi `v1.5.0`, dan panduan deploy. |
| 7 | `CHANGELOG.md` | Edit | Dokumentasi pembaruan panduan dan auto-seeding. |
| 8 | `docs/WALKTHROUGH-panduan-dan-gas-auto-seed.md` | Create | Bukti verifikasi pemutakhiran panduan dan auto-seeding. |

---

## 3. Mitigasi Risiko

- **Backward Compatibility**: Perubahan `Code.gs` tidak merusak data materi yang sudah ditambahkan oleh guru (karena hanya mengeksekusi seed jika baris data `getLastRow() <= 1`).
- **Data Integrity**: Menyediakan menu manual di Google Sheets agar guru sewaktu-waktu dapat memulihkan 24 materi standar tanpa perlu mengetik ulang.
