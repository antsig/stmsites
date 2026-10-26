# Implementation Plan: Pemulihan Klik Tombol & Pengisian Materi Instan di Google Apps Script (v1.5.4)

Dokumen rencana kerja ini merespons kendala pengguna setelah Web App dideploy di Google Apps Script:
*"sudah tampil, tapi tidak bisa klik dan materi kosong"*

---

## 1. Analisis Akar Masalah (Root Cause Analysis)

### Mengapa Tombol Tidak Bisa Diklik & Materi Kosong di GAS?

1. **Duplikasi Skrip & Sintaks Fatal (`Identifier 'DEFAULT_SETTINGS' has already been declared`)**:
   - Di dalam [index.html](file:///f:/repository/stemsites/index.html), terdapat tag evaluasi modular GAS:
     - Baris 19: `<?!= include('styles'); ?>` diikuti 840 baris CSS inline.
     - Baris 1349: `<?!= include('admin'); ?>` diikuti 570 baris HTML admin inline.
     - Baris 1927: `<?!= include('scripts'); ?>` diikuti 1550 baris JavaScript inline.
   - Selain itu, di dalam [admin.html](file:///f:/repository/stemsites/admin.html) juga terdapat `<?!= include('scripts'); ?>` dan tag `<script>` inline.
   - Ketika Google Apps Script mengevaluasi `index.html`:
     - Berkas [admin.html](file:///f:/repository/stemsites/admin.html) di-include ke dalam `index.html` (membawa serta `include('scripts')`).
     - Berkas [scripts.html](file:///f:/repository/stemsites/scripts.html) di-include lagi di bagian bawah.
     - Kode script inline di [index.html](file:///f:/repository/stemsites/index.html) dijalankan lagi.
   - Akibatnya, file JavaScript dieksekusi **4 kali** pada satu halaman yang sama. Browser mendeteksi konstanta `const DEFAULT_SETTINGS = ...` dideklarasikan berulang kali pada global scope, memicu:
     `Uncaught SyntaxError: Identifier 'DEFAULT_SETTINGS' has already been declared`
   - Karena SyntaxError fatal ini, eksekusi JavaScript **berhenti total seketika**:
     - Seluruh *event listener* gagal dipasang.
     - Fungsi klik `openGradeSelector()`, `openAdminPinModal()`, dsb. tidak berjalan (*unclickable*).
     - Fungsi `loadInitialData()` dan `renderApp()` tidak pernah dipanggil.

2. **Inisialisasi Data Default Kosong (`materials: []`)**:
   - Pada baris 353 [scripts.html](file:///f:/repository/stemsites/scripts.html), state awal diatur `materials: []`.
   - Kode hanya mengandalkan event `window.addEventListener("DOMContentLoaded", ...)` untuk memanggil `loadInitialData()`.
   - Di lingkungan Google Apps Script Web App (yang berjalan di dalam iframe/sandbox Google), ketika script selesai dievaluasi, status dokumen seringkali sudah `interactive` atau `complete`. Event `DOMContentLoaded` **tidak akan pernah terpanggil lagi** jika sudah lewat.
   - Hal ini menyebabkan `materials` tetap berupa array kosong (`0 Materi`) dan kartu materi tidak dirender.

3. **Inkonsistensi Class Modal Backdrop**:
   - Pada `styles.html`, class pembuka modal adalah `.modal-backdrop.open`.
   - Pada beberapa fungsi modal admin di script, class yang di-toggle adalah `.active`.

---

## 2. Rencana Solusi Teknis (To-Be)

1. **Pemurnian Arsitektur Modular Google Apps Script (Zero Script Duplication)**:
   - **`admin.html`**: Bersihkan dari `<!DOCTYPE html>`, `<head>`, `<style>`, `<body>`, dan tag `<script>`. Jadikan murni partial komponen admin (`#adminPinModal`, `#adminView`, `#materialFormModal`).
   - **`index.html`**: Hapus seluruh blok duplikasi inline (CSS duplikat dan JavaScript duplikat). Pastikan `index.html` murni memanggil `<?!= include('styles'); ?>`, merender shell publik, menyertakan `<div id="adminModuleContainer"><?!= include('admin'); ?></div>`, dan memanggil `<?!= include('scripts'); ?>` tepat 1 kali di akhir.
   - Dengan pemurnian ini, tidak ada lagi deklarasi ganda, tidak ada SyntaxError, dan ukuran file `index.html` menjadi sangat ramping dan cepat dimuat.

2. **Jaminan Instan 24 Materi & Siklus Hidup Event GAS**:
   - Di `scripts.html`:
     - Inisialisasi `appState.materials` langsung dengan `JSON.parse(JSON.stringify(INITIAL_MATERIALS))` sejak baris pertama.
     - Panggil `renderApp()` langsung di awal `loadInitialData()`, sehingga pada milidetik pertama dibuka oleh siswa, ke-24 materi dan hitungan badge (masing-masing 6 materi) **langsung tampil 100%** tanpa jeda.
     - Ubah pemicu startup:
       ```javascript
       function initApp() {
         loadInitialData();
       }
       if (document.readyState === "loading") {
         document.addEventListener("DOMContentLoaded", initApp);
       } else {
         initApp();
       }
       window.addEventListener("load", () => {
         renderApp();
       });
       ```
     - Ini menjamin inisialisasi selalu dieksekusi di GAS baik sebelum maupun sesudah event `DOMContentLoaded`.

3. **Harmonisasi Styling Modal**:
   - Tambahkan dukungan selector ganda di `styles.html`:
     ```css
     .modal-backdrop.open,
     .modal-backdrop.active {
       display: flex;
       opacity: 1;
     }
     ```
   - Semua modal (pilihan kelas, misi praktikum, panduan, dan login admin) dijamin terbuka mulus.

---

## 3. Inventaris Berkas (File Inventory)

| No | Berkas | Aksi | Deskripsi |
|:---:|---|:---:|---|
| 1 | `scripts.html` | Edit | Inisialisasi instan `INITIAL_MATERIALS`, pemicu startup multi-state, dan rendering tanpa jeda. |
| 2 | `admin.html` | Edit | Bersihkan menjadi pure HTML partial (hapus doctype, head, style, dan script duplikat). |
| 3 | `index.html` | Edit | Hapus duplikasi CSS dan script inline; jadikan shell modular GAS yang bersih. |
| 4 | `styles.html` | Edit | Dukung selector `.modal-backdrop.open` dan `.modal-backdrop.active`. |
| 5 | `docs/04-deployment/PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md` | Edit | Sinkronisasi instruksi salin berkas agar guru menyalin versi bersih bebas bentrok. |
| 6 | `CHANGELOG.md` | Edit | Catat rilis patch `v1.5.4`. |
| 7 | `docs/WALKTHROUGH-fix-unclickable-and-empty-materials-gas.md` | Create | Dokumentasi pengujian dan bukti verifikasi fungsional. |

---

## 4. Mitigasi Risiko

- **Keamanan Data**: Google Sheets tetap berfungsi sebagai database utama; data lokal hanya digunakan sebagai *instant seed fallback* agar UI tidak pernah kosong.
- **Rollback**: Perubahan dapat di-rollback via Git reset jika diperlukan.
