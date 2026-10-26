# Implementation Plan: Sinkronisasi Seluruh Berkas Pendukung, Panduan Penggunaan, dan Deploy (v1.5.5)

## 1. Konteks & Tujuan
Pengguna meminta:
> *"langsung update file pendukung lainnya, dan panduan penggunaan/deploy, dll"*

Seluruh dokumentasi teknis, panduan penggunaan, panduan deployment, file `README.md`, tampilan tab panduan pada Panel Admin (`admin.html`), serta berkas kompilasi mandiri (`dist/index.html`) harus diperbarui dan diselaraskan agar 100% konsisten dengan arsitektur v1.5.5 (termasuk opsi Standalone 1-File 2-berkas dan mitigasi cache versi Google Apps Script).

---

## 2. Ruang Lingkup Perubahan (Scope)

### In-Scope:
1. **`README.md`**:
   - Update versi ke `v1.5.5`.
   - Tambahkan penjelasan Opsi A: Standalone 2-Berkas (`Code.gs` + `dist/index.html`) sebagai metode deployment utama yang direkomendasikan.
   - Tambahkan instruksi wajib "Update ke Versi Baru (New Version) saat revisi deployment" di Apps Script.
2. **`admin.html` (Tab Step Deploy & Kode GAS)**:
   - Perbarui narasi panduan 7 langkah di dalam Panel Admin agar mencakup Opsi A (Standalone 2-berkas) dan Opsi B (Modular 5-berkas).
   - Tambahkan peringatan visual: *"Jika memperbarui kode lama, wajib pilih Versi Baru (New version) pada menu Kelola Penerapan agar tidak mengunci cache versi lama"*.
3. **`docs/04-deployment/PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md`**:
   - Perbarui isi blok kode `Kode 1: Code.gs` dengan fungsi `include()` yang ultra-resilient.
   - Perbarui isi blok kode `Kode 2: index.html` dengan on-screen diagnostic error boundary dan badge statis 6 materi.
   - Tambahkan blok kode khusus `Kode Standalone: dist/index.html (1-File Mandiri)` dengan tautan dan petunjuk penggunaan.
4. **`bundle.js` & `dist/index.html`**:
   - Jalankan `node bundle.js` untuk memastikan `dist/index.html` memuat seluruh perbaikan `admin.html` terbaru secara presisi.
5. **Git Commit, Tag & Push**:
   - Perbarui `CHANGELOG.md` dan push perubahan ke remote repository.

### Out-of-Scope:
- Mengubah logika bisnis atau mengurangi 24 materi kurikulum STEM SD.

---

## 3. Inventaris Berkas
| No | Berkas | Aksi | Deskripsi |
|---|---|---|---|
| 1 | `README.md` | Edit | Update versi v1.5.5, Standalone 2-berkas, dan tips deploy Apps Script. |
| 2 | `admin.html` | Edit | Sinkronisasi panduan 7 langkah dengan opsi standalone dan tips New Version. |
| 3 | `docs/04-deployment/PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md` | Edit | Sinkronisasi blok kode `Code.gs`, `index.html`, dan standalone bundle. |
| 4 | `dist/index.html` | Generate | Re-bundle melalui `node bundle.js`. |
| 5 | `CHANGELOG.md` | Edit | Catat sinkronisasi dokumentasi dan panduan deploy. |
| 6 | `docs/WALKTHROUGH-sync-all-supporting-files-and-guides.md` | Buat | Dokumentasi walkthrough & verifikasi. |

---

## 4. Rencana Pengujian
1. Jalankan `node bundle.js` dan verifikasi ukuran serta keutuhan `dist/index.html`.
2. Validasi sintaks berkas HTML dan JS dengan `node -e`.
3. Verifikasi tautan markdown pada seluruh dokumen panduan.
