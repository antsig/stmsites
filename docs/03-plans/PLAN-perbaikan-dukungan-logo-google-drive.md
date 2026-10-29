# Implementation Plan: Perbaikan Penanganan Logo Google Drive & Auto-Converter CDN (v1.6.2)

## 1. Konteks & Latar Belakang Masalah
Pengguna melaporkan:
> *"https://drive.google.com/file/d/1WQACHvDedcqlHlG2dp1vxh77j8gpXEAp/view"*
> *"saya ingin ganti logo tpi logo tidak tampil"*

### Analisis Akar Masalah (Root Cause Investigation)
1. **Format Web Viewer vs File Binary**: Tautan `https://drive.google.com/file/d/1WQACHvDedcqlHlG2dp1vxh77j8gpXEAp/view` adalah halaman antarmuka web Google Drive (MIME type: `text/html; charset=utf-8` dengan proteksi `X-Frame-Options: SAMEORIGIN`), bukan berkas biner gambar mentah (`image/png`).
2. **Kegagalan Tag `<img>`**: Browser tidak dapat me-render dokumen HTML ke dalam tag `<img src="...">`, sehingga memicu status broken image atau menampilkan teks `alt="Logo Sekolah"`.
3. **Deprekasi Hotlink Format `uc?export=view`**: Format lama Google Drive yang tertulis di panduan sistem (`drive.google.com/uc?export=view&id=...`) telah diperketat oleh Google (sering terkena HTTP 403 Forbidden atau dialihkan ke halaman peringatan unduhan).
4. **Format CDN Google Direct Image**: Pengujian teknis via HTTP request membuktikan bahwa format direct image resmi Google:
   `https://lh3.googleusercontent.com/d/1WQACHvDedcqlHlG2dp1vxh77j8gpXEAp`
   berhasil merespons dengan **HTTP 200 OK**, `Content-Type: image/png`, ukuran 1.33 MB, dengan header `Access-Control-Allow-Origin: *` dan nama file asli *"SD Negeri 18 Limboto.png"*.
5. **Ketiadaan Auto-Converter di Frontend**: Sistem saat ini langsung menyimpan dan memasukkan URL mentah yang ditempelkan pengguna ke elemen gambar tanpa mendeteksi atau menormalisasi tautan Google Drive.

---

## 2. Ruang Lingkup Perubahan (Scope)

### In-Scope:
1. **Helper Converter Cerdas (`formatGoogleDriveImageUrl`)**:
   - Menambahkan fungsi parser URL yang mendeteksi berbagai format Google Drive:
     - `/file/d/{ID}/view`
     - `/file/d/{ID}`
     - `?id={ID}`
     - `uc?id={ID}`
     - `thumbnail?id={ID}`
   - Otomatis mengekstrak `{ID}` dan mengembalikannya dalam format CDN langsung: `https://lh3.googleusercontent.com/d/{ID}`.
   - Mengembalikan URL asli secara aman jika input berupa tautan gambar standar non-Google Drive (misal Unsplash, image host lain).
2. **Integrasi Form Admin & Live Preview**:
   - Terapkan auto-konversi pada input `#settingLogoUrl` dan ke-4 logo kategori STEM (`#settingLogoSci`, `#settingLogoTec`, `#settingLogoEng`, `#settingLogoMat`) saat event `input`, `change`, dan `blur`.
   - Update `previewSettings()` agar menggunakan URL yang telah dinormalisasi.
   - Update `saveSchoolSettings()` agar data yang tersimpan di LocalStorage maupun Google Sheets adalah URL yang sudah dinormalisasi dan siap pakai.
3. **Integrasi Navbar, Kategori, & Grid Materi**:
   - Normalisasi URL pada `renderSchoolIdentity()` sebelum disematkan ke `#navSchoolLogo`.
   - Normalisasi logo kustom pada `renderCategoryLogosAndCounts()` dan `renderCategorySubpageHeader()`.
   - Normalisasi `thumbnail_url` materi di `renderMaterialsGrid()`.
4. **Defensive Error Handling & UX Feedback**:
   - Tambahkan handler `onerror` pada `#navSchoolLogo` dan `#previewLogoImg` agar otomatis fallback ke gambar default sekolah jika tautan bermasalah atau hak akses Google Drive belum disetel ke *"Siapa saja yang memiliki link"*.
   - Berikan peringatan visual ramah pengguna di bawah kotak preview jika gambar gagal dimuat.
5. **Pembaruan Teks Panduan & Petunjuk di Panel Admin**:
   - Perbarui petunjuk di Tab 2 (Pengaturan Logo & Sekolah) dan Tab 3 (Panduan Admin) bahwa pengguna dapat langsung menyalin-tempel link Google Drive apa pun tanpa perlu mengubah URL secara manual, dengan catatan akses file disetel ke *"Siapa saja yang memiliki link"*.

### Out-of-Scope:
- Mengubah arsitektur database Google Sheets atau kurikulum materi STEM SD.
- Menghapus fungsionalitas URL gambar non-Google Drive yang sudah berjalan baik.

---

## 3. Inventaris Berkas
| No | Berkas | Aksi | Deskripsi |
|---|---|---|---|
| 1 | `docs/03-plans/PLAN-perbaikan-dukungan-logo-google-drive.md` | Buat | Dokumen rencana kerja arsitektur & eksekusi SOP Fase 1. |
| 2 | `index.html` | Edit | Penambahan helper auto-converter Google Drive, integrasi preview & render, fallback onerror, dan update teks panduan admin. |
| 3 | `CHANGELOG.md` | Edit | Pencatatan rilis v1.6.2 (SemVer). |
| 4 | `docs/WALKTHROUGH-perbaikan-dukungan-logo-google-drive.md` | Buat | Laporan walkthrough pengujian teknis & panduan verifikasi pengguna (Fase 3). |

---

## 4. Mitigasi Risiko & Rollback
- **Kompatibilitas Mundur**: Jika URL yang dimasukkan bukan Google Drive (seperti foto Unsplash default), fungsi regex tidak akan mengubah string URL tersebut sehingga tetap berfungsi normal.
- **Rollback Plan**: Jika terjadi kendala pada CDN Google, sistem dilengkapi fallback `onerror` ke default placeholder sekolah (`DEFAULT_SETTINGS.logo_url`).

---

## 5. Rencana Pengujian
1. Uji fungsi regex parser dengan berbagai bentuk URL Google Drive:
   - `https://drive.google.com/file/d/1WQACHvDedcqlHlG2dp1vxh77j8gpXEAp/view`
   - `https://drive.google.com/file/d/1WQACHvDedcqlHlG2dp1vxh77j8gpXEAp/view?usp=sharing`
   - `https://drive.google.com/open?id=1WQACHvDedcqlHlG2dp1vxh77j8gpXEAp`
   - `https://drive.google.com/uc?export=view&id=1WQACHvDedcqlHlG2dp1vxh77j8gpXEAp`
2. Jalankan simulasi input di browser untuk memastikan:
   - Live preview logo sekolah dan kategori langsung muncul seketika saat link Google Drive di-paste.
   - Logo navbar langsung berganti menjadi logo *"SD Negeri 18 Limboto"* dengan tajam dan proporsional.
   - Data pengaturan tersimpan dengan baik di LocalStorage dan Google Sheets.
