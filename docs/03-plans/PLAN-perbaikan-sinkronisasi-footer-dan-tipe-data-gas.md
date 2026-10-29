# Rencana Implementasi: Perbaikan Sinkronisasi Footer & Ketahanan Tipe Data Pengaturan di Google Apps Script (v1.6.6)

## 1. Analisis Akar Masalah (*Root Cause Analysis*)
Setelah investigasi mendalam terhadap integrasi antara Google Spreadsheet, Google Apps Script (`Code.gs`), dan antarmuka web (`index.html`), ditemukan akar masalah mengapa footer belum sinkron dengan data pengaturan:

1. **Konversi Tipe Data Numerik di Google Spreadsheet**:
   - Di Google Sheets, nomor kontak WhatsApp (misal `6281234567890` atau `0812...`) atau tahun ajaran disimpan sebagai tipe data **Number**, bukan teks/string.
   - Ketika backend membaca data sheet melalui `getDataRange().getValues()`, Google Apps Script mengembalikan nilai dalam tipe angka (`number`).
   - Di sisi klien (`index.html`), fungsi `renderSchoolIdentity()` memanggil `(s.contact_wa || ...).trim()`. Karena `s.contact_wa` bertipe angka, pemanggilan method `.trim()` langsung melempar error:
     `TypeError: (s.contact_wa || ...).trim is not a function`.
   - Akibat error tersebut, eksekusi fungsi `renderSchoolIdentity()` terhenti seketika sebelum sempat meng-update teks dan tautan footer, sehingga footer tetap menampilkan nilai default atau tanda strip (`-`).
2. **Ketiadaan Baris `contact_wa` dan `contact_email` pada Spreadsheet yang Sudah Ada**:
   - Fungsi `initDatabaseIfEmpty()` di `Code.gs` sebelumnya hanya membuat baris setting jika sheet `Settings` belum ada sama sekali. Pada spreadsheet pengguna yang sudah dibuat dari versi terdahulu, baris `contact_wa` dan `contact_email` belum terdaftar.
3. **Ketahanan Format Pembacaan Data**:
   - `Code.gs` perlu menggunakan `getDisplayValues()` agar teks nomor telepon dan email dibaca persis seperti yang tampil di sel tanpa terpotong atau terkonversi ke notasi ilmiah (*scientific notation*).

---

## 2. Ruang Lingkup (*Scope*)
### In-Scope:
- **Ketahanan Tipe Data di Frontend (`index.html`)**:
  - Membungkus seluruh properti pengaturan (`contact_wa`, `contact_email`, `school_name`, `academic_year`, `slogan`) dengan konversi aman `String(...)` sebelum memanggil `.trim()`.
  - Memastikan `renderSchoolIdentity()` memperbarui seluruh elemen footer (`#footerWaLink`, `#footerWaText`, `#footerEmailLink`, `#footerEmailText`, `#footerSchoolNameBottom`) secara defensif tanpa resiko TypeError.
  - Memastikan `appState.currentAdminPin` tersimpan konsisten pada seluruh skenario login admin (sukses backend maupun mode mandiri).
- **Ketahanan Backend di `Code.gs`**:
  - Memperbarui `getSettingsMap()` untuk menggunakan `getDisplayValues()` dan menjamin seluruh nilai pengaturan dikembalikan ke klien dalam format String bersih.
  - Memperbarui `initDatabaseIfEmpty()` agar otomatis melengkapi baris kunci yang belum ada (`contact_wa`, `contact_email`, dll.) pada sheet `Settings` yang sudah berjalan.
  - Memperbarui `updateSettings()` agar menyimpan nomor telepon dengan format teks (`setNumberFormat('@')`) untuk mencegah Google Sheets mengubahnya menjadi format eksponensial.
- **Dukungan Kunci Alias/Sinonim**:
  - Menoleransi penamaan kolom/kunci di spreadsheet (`kontak_wa`, `wa`, `whatsapp`, `email`, dsb.).

### Out-of-Scope:
- Tidak mengubah tata letak visual dasar atau struktur modul pembelajaran STEM lainnya.

---

## 3. Inventaris Berkas (*File Inventory*)
| Berkas | Aksi | Deskripsi |
|---|---|---|
| [index.html](file:///f:/repository/stemsites/index.html) | Modifikasi | Konversi tipe data defensif `String(...)` pada `renderSchoolIdentity`, `populateSettingsForm`, `saveSchoolSettings`, dan `submitAdminPin`. |
| [Code.gs](file:///f:/repository/stemsites/Code.gs) | Modifikasi | Penanganan `getDisplayValues()`, auto-append baris kunci setting yang belum ada, dan penulisan sel string aman. |
| [CHANGELOG.md](file:///f:/repository/stemsites/CHANGELOG.md) | Modifikasi | Catatan rilis v1.6.6. |
| `docs/03-plans/PLAN-perbaikan-sinkronisasi-footer-dan-tipe-data-gas.md` | Dibuat | Dokumen rencana implementasi ini. |
| `docs/WALKTHROUGH-perbaikan-sinkronisasi-footer-dan-tipe-data-gas.md` | Dibuat (Pasca-eksekusi) | Panduan verifikasi dan walkthrough rilis v1.6.6. |
