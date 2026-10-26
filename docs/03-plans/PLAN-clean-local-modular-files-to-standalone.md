# Implementation Plan: Pembersihan Berkas Modular Lokal Menjadi Struktur Standalone Murni

## 1. Konteks & Latar Belakang Masalah
Pengguna meminta:
> *"brsihkan juga di edior (lokal)"*

Setelah migrasi ke arsitektur **Standalone 1-File** ([dist/index.html](file:///f:/repository/stemsites/dist/index.html)), berkas-berkas modular parsial (`styles.html`, `admin.html`, `scripts.html`), skrip kompilator (`bundle.js`), dan folder output (`dist/`) di repositori lokal kini menjadi redundan dan membingungkan pengguna jika dibiarkan bersamaan dengan berkas mandiri.

---

## 2. Ruang Lingkup Pembersihan (Scope)

### In-Scope:
1. **Promosi Standalone ke Root `index.html`**:
   - Pindahkan/timpa isi `dist/index.html` (berkas mandiri utuh bebas include) menjadi berkas utama [index.html](file:///f:/repository/stemsites/index.html) di root repositori.
2. **Pembersihan Berkas Redundan Lokal**:
   - Hapus berkas parsial yang sudah tidak dipakai:
     - ❌ `styles.html`
     - ❌ `admin.html`
     - ❌ `scripts.html`
   - Hapus berkas kompilasi yang tidak lagi diperlukan:
     - ❌ `bundle.js`
     - ❌ `dist/index.html` (dan folder `dist/`)
3. **Penyederhanaan `server.js` & `Code.gs`**:
   - Sederhanakan `server.js` agar langsung menyajikan `index.html` murni tanpa perlu regex parser `include()`.
   - Di `Code.gs`, pastikan `doGet()` langsung melayani `index` dengan stabil.
4. **Pembaruan Dokumentasi**:
   - Catat pembersihan di `CHANGELOG.md` (v1.5.6).
   - Buat walkthrough di `docs/WALKTHROUGH-clean-local-modular-files-to-standalone.md`.

### Out-of-Scope:
- Menghapus riwayat git atau dokumentasi arsip `docs/01-proposals/`.
- Mengubah logika bisnis atau 24 materi kurikulum STEM SD.

---

## 3. Inventaris Berkas Setelah Pembersihan

| No | Berkas di Root | Status | Keterangan |
|---|---|---|---|
| 1 | `index.html` | Diperbarui | Kini berisi versi standalone utuh (HTML + CSS + Admin + JS). |
| 2 | `Code.gs` | Dipertahankan | Backend GAS & database Google Sheets. |
| 3 | `server.js` | Diperbarui | Dev server lokal yang ramping melayani `index.html`. |
| 4 | `appsscript.json` | Dipertahankan | Manifest resmi Google Apps Script. |
| 5 | `README.md` | Dipertahankan | Dokumentasi proyek. |
| 6 | `CHANGELOG.md` | Diperbarui | Log perubahan versi (v1.5.6). |
| 7 | `styles.html` | **Dihapus** | Sudah terintegrasi di `index.html`. |
| 8 | `admin.html` | **Dihapus** | Sudah terintegrasi di `index.html`. |
| 9 | `scripts.html` | **Dihapus** | Sudah terintegrasi di `index.html`. |
| 10 | `bundle.js` | **Dihapus** | Tidak diperlukan lagi karena `index.html` sudah mandiri. |
| 11 | `dist/` | **Dihapus** | Tidak diperlukan lagi. |

---

## 4. Mitigasi Risiko & Rollback
- Sebelum menghapus `styles.html`, `admin.html`, `scripts.html`, pastikan isi `dist/index.html` sudah dipindahkan 100% lengkap ke root `index.html`.
- Seluruh riwayat berkas lama tetap tersimpan aman di Git history jika sewaktu-waktu dibutuhkan kembali.
