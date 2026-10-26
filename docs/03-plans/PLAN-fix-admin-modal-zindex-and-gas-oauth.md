# Implementation Plan: Perbaikan Modal Tambah Sub-Card (Z-Index) & Otorisasi OAuth Google Apps Script (v1.5.8)

## 1. Konteks & Latar Belakang Masalah
Pengguna melaporkan dua kendala saat menggunakan Web App di lingkungan Google Apps Script:
1. **Tombol Aksi Tambah Sub-Card Baru Tidak Berfungsi**:
   Saat berada di Panel Kendali Admin dan menekan tombol *"Tambah Sub-Card Baru"*, modal formulir penambahan materi tidak muncul di layar.
   - **Akar Masalah (Root Cause)**:
     - `.admin-overlay-view` (tampilan panel admin fullscreen) memiliki `z-index: 150`.
     - `.modal-backdrop` (pembungkus seluruh modal, termasuk `#materialFormModal`) memiliki `z-index: 100`.
     - Akibatnya, saat `openAddMaterialModal()` dijalankan dan menambahkan class `.open`, modal sebenarnya aktif namun **tertutup rapat di belakang layer admin view (`100 < 150`)**, sehingga tampak macet dan tidak dapat diklik.
2. **Kendala Skrip OAuth `createOAuthDialog=true`**:
   Muncul notifikasi:
   ```
   ⚠️ Terjadi Kendala Skrip: Uncaught SyntaxError: Invalid or unexpected token
   Baris 1 (https://n-fziwz66ailuwepiyzjb25ur37capxyfueoskhxa-0lu-script.googleusercontent.com/userCodeAppPanel?createOAuthDialog=true)
   ```
   - **Akar Masalah (Root Cause)**:
     - URL `userCodeAppPanel?createOAuthDialog=true` dimuat oleh Google Apps Script ketika proyek skrip belum diotorisasi (*unauthorized permissions*) untuk mengakses Spreadsheet database (`SpreadsheetApp.getActiveSpreadsheet()`).
     - Di dalam iframe web app, dialog OAuth Google diblokir oleh kebijakan keamanan peramban pihak ketiga (*third-party cookies/cross-origin restrictions*), sehingga memicu kegagalan skrip OAuth internal pada baris 1.
     - Skrip memerlukan langkah otorisasi manual 1x di editor Apps Script dengan menekan tombol **Jalankan (Run)** pada fungsi `initDatabaseIfEmpty`.

---

## 2. Analisis Kebutuhan & Ruang Lingkup (Scope)
- **In-Scope**:
  1. **Perbaikan Z-Index Modal**:
     - Menaikkan nilai `z-index` pada `.modal-backdrop` dari `100` menjadi `300` (dan `#materialFormModal` menjadi `400`), sehingga semua modal dipastikan tampil di atas layer `.admin-overlay-view` (`z-index: 150`).
  2. **Audit dan Penguatan Fungsi `openAddMaterialModal()`**:
     - Memastikan fungsi `openAddMaterialModal()` dan `openEditMaterialModal()` menambahkan class `.open` dan `.active` secara serentak serta membawa fokus ke modal form.
  3. **Panduan Lengkap Otorisasi OAuth Google Apps Script**:
     - Menyusun panduan visual dan tertulis di [PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md](file:///f:/repository/stemsites/docs/04-deployment/PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md) serta di dalam tab Panduan Deploy Panel Admin mengenai cara menjalankan `Run` 1x untuk mengizinkan akses Spreadsheet.
  4. **Pembaruan Berkas & Rilis**:
     - Verifikasi browser subagent di panel admin.
     - Catat versi `v1.5.8` di [CHANGELOG.md](file:///f:/repository/stemsites/CHANGELOG.md).
     - Git commit, tag `v1.5.8`, dan push remote.
- **Out-of-Scope**:
  - Mengubah struktur database sheet atau kurikulum materi STEM.

---

## 3. Rencana Perubahan Berkas (File Inventory)
- [ ] [index.html](file:///f:/repository/stemsites/index.html):
  - Ubah `.modal-backdrop` CSS `z-index: 100` -> `z-index: 300`.
  - Beri `#materialFormModal` gaya khusus `z-index: 400`.
  - Perbaiki `openAddMaterialModal()` untuk mengatur class `.open` dan `.active`.
- [ ] [docs/04-deployment/PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md](file:///f:/repository/stemsites/docs/04-deployment/PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md):
  - Tambahkan langkah krusial: *Otorisasi Izin Akses Spreadsheet (Wajib 1x via Tombol Run)* untuk menghilangkan `createOAuthDialog=true`.
- [ ] [docs/WALKTHROUGH-fix-admin-modal-zindex-and-gas-oauth.md](file:///f:/repository/stemsites/docs/WALKTHROUGH-fix-admin-modal-zindex-and-gas-oauth.md):
  - Dokumentasi pengujian interaksi admin modal.
- [ ] [CHANGELOG.md](file:///f:/repository/stemsites/CHANGELOG.md):
  - Catat rilis `v1.5.8`.

---

## 4. Rencana Database / Skema
Tidak ada perubahan skema database spreadsheet.

---

## 5. Rencana Mitigasi Risiko & Rollback
- **Mitigasi**:
  - Penambahan `z-index: 300` pada `.modal-backdrop` tidak mengganggu urutan stacking beranda publik karena beranda berada pada `z-index: 10`.
- **Rollback**:
  - Git commit sebelumnya (`v1.5.7` - `60195f6`) dapat di-restore seketika.
