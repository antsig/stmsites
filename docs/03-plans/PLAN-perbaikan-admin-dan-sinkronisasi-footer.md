# Implementation Plan: Pemulihan Tampilan Materi & Pengaturan Admin GAS serta Sinkronisasi Kontak Footer (v1.6.4)

## 1. Konteks & Analisis Masalah (As-Is vs To-Be)

### Masalah 1: Materi & Pengaturan Tidak Tampil di Admin Google Apps Script
- **Gejala (As-Is)**: Saat pengguna login ke Admin pada Web App Google Apps Script (`script.google.com`), tabel materi kosong dan seluruh form input pengaturan sekolah kosong/blank (tidak terisi nilai bawaan).
- **Akar Penyebab (Root Cause)**:
  1. **Asinkronitas GAS**: Ketika `getInitialData()` selesai dieksekusi secara asinkron di klien GAS, fungsi pembaruan hanya memanggil `renderAdminTable()`, tetapi **tidak pernah memanggil `populateSettingsForm()`**. Akibatnya, form pengaturan tetap kosong jika admin sudah terbuka.
  2. **Data Fallback Kosong**: Jika panggilan `getInitialData()` ke backend Spreadsheet mengalami *timeout*, belum diotorisasi, atau sheet belum terisi data, fungsi `fallbackToLocalStorage()` tidak melakukan *deep merge* dengan `DEFAULT_SETTINGS` dan `INITIAL_MATERIALS`. Jika `savedMaterials` bernilai `[]` atau `savedSettings` bernilai `{}` di domain `script.google.com`, sistem menampilkan tabel dan form kosong.
  3. **Backend GAS Resilience**: Di `Code.gs`, jika `getActiveSpreadsheetSafe()` gagal membuka sheet (misalnya proyek standalone tanpa `SPREADSHEET_ID`), backend melempar exception alih-alih memberikan data default darurat kurikulum 24 materi dan pengaturan bawaan sekolah.
  4. **Kehilangan Tab Deploy di Perubahan Sebelumnya**: Pada commit `d59967c`, elemen tab `tab-deploy-gas` ("Step Deploy & Kode GAS") dan tombol bantuan demo PIN tidak sengaja terhapus dari HTML, sehingga pengguna kesulitan menyalin kode perbaikan terbaru ke Apps Script.

### Masalah 2: Sinkronisasi Kontak Bantuan di Footer dengan Pengaturan Admin
- **Gejala (As-Is)**: Elemen footer hanya menampilkan kontak WhatsApp (`#footerWaLink`), sedangkan input Email (`settingContactEmail`) di Admin tidak memiliki representasi elemen di footer. Selain itu, jika kontak diubah di Pengaturan Admin, pembaruan ke footer belum menyeluruh mencakup email dan format link.
- **Harapan (To-Be)**:
  1. Footer menampilkan kontak lengkap: WhatsApp dan Email resmi bantuan sekolah yang bersumber dinamis dari `appState.settings.contact_wa` dan `appState.settings.contact_email`.
  2. Format link otomatis: WhatsApp mengarah ke `https://wa.me/62...` dan Email mengarah ke `mailto:...`.
  3. Saat Admin menyimpan perubahan di tab Pengaturan, kontak di footer langsung terbarui seketika tanpa perlu refresh halaman.

---

## 2. Ruang Lingkup Perubahan (Scope)

### In-Scope:
1. **Pembersihan Kode Deploy (Permintaan Pengguna: Deploy Tetap Dihapus)**:
   - Memastikan tab/section deploy tetap dihapus dari panel Admin.
   - Membersihkan fungsi JS yatim (*orphaned deploy code*) seperti `initDeployCodeViewer`, `selectDeployFile`, `copyCurrentDeployCode`, dan metadata deploy agar berkas bersih dan ramping.
2. **Sinkronisasi Kontak Bantuan di Footer dengan Pengaturan Admin**:
   - Menambahkan elemen kontak Email (`#footerEmailLink`, `#footerEmailText`) bersanding dengan WhatsApp (`#footerWaLink`, `#footerWaText`) di `.footer-contacts`.
   - Memperbarui `renderSchoolIdentity()` agar nilai WhatsApp dan Email disinkronkan secara langsung dan dinamis dengan `appState.settings.contact_wa` dan `appState.settings.contact_email`.
   - Format link: WhatsApp mengarah ke `https://wa.me/62...` dan Email mengarah ke `mailto:...`.
   - Saat Admin menyimpan pengaturan via `saveSchoolSettings()`, footer langsung terbarui secara real-time.
3. **Pemulihan Tampilan Materi & Pengaturan di Google Apps Script (GAS)**:
   - Memastikan `populateSettingsForm()` dipanggil di callback data awal GAS (`withSuccessHandler` dan `withFailureHandler`), serta dipanggil saat `openAdminView()`.
   - Memastikan `appState.settings` selalu di-*merge* dengan `DEFAULT_SETTINGS` sehingga form input pengaturan tidak pernah kosong/blank.
   - Memastikan `appState.materials` selalu otomatis diisi 24 materi SD bawaan (`INITIAL_MATERIALS`) jika data dari GAS/localStorage kosong.
   - Kembalikan tombol demo PIN helper di modal PIN admin untuk kemudahan pengujian.
4. **Backend Resilience (`Code.gs`)**:
   - Memperkuat `getInitialData()` di `Code.gs` dengan fallback aman ke 24 materi kurikulum SD dan default settings.

### Out-of-Scope:
- Mengubah struktur data skema Spreadsheet Google Sheets yang sudah ada.

---

## 3. Inventaris Berkas
| No | Berkas | Aksi | Deskripsi |
|---|---|---|---|
| 1 | `docs/03-plans/PLAN-perbaikan-admin-dan-sinkronisasi-footer.md` | Buat | Dokumen rencana implementasi SOP Fase 1. |
| 2 | `index.html` | Edit | Tambah kontak email footer, perkuat data fallback admin/settings, panggil `populateSettingsForm()` saat data GAS masuk, pulihkan tab deploy & demo PIN. |
| 3 | `Code.gs` | Edit | Fallback darurat data kurikulum & settings di `getInitialData()` jika akses spreadsheet tertunda/gagal. |
| 4 | `CHANGELOG.md` | Edit | Catatan rilis versi v1.6.4 (SemVer). |
| 5 | `docs/WALKTHROUGH-perbaikan-admin-dan-sinkronisasi-footer.md` | Buat | Dokumentasi walkthrough & verifikasi hasil uji (Fase 3). |

---

## 4. Mitigasi Risiko & Rollback
- Seluruh elemen footer menggunakan flexbox responsif dengan `gap: 1rem; flex-wrap: wrap; justify-content: center;`, sehingga aman di layar sempit mobile (< 480px).
- Nilai input form pengaturan selalu memiliki fallback ke `DEFAULT_SETTINGS`, mencegah `null` pointer exception.
- Jika pengguna ingin rollback, dapat kembali ke commit sebelumnya via git.

---

## 5. Rencana Pengujian & Verifikasi
1. **Uji Pengaturan Form Admin**: Buka panel Admin, pastikan semua field (Nama Sekolah, Tahun Ajaran, Slogan, Logo URL, No. WA, Email, dan 4 Logo Kategori) terisi nilai default/tersimpan secara sempurna.
2. **Uji Tabel Materi Admin**: Pastikan seluruh 24 materi SD tampil di tabel materi admin beserta aksi edit/hapusnya.
3. **Uji Sinkronisasi Footer**:
   - Buka menu Pengaturan Admin, ganti nomor WA dan Email, klik Simpan Pengaturan.
   - Tutup Admin / kembali ke portal siswa, verifikasi nomor WA dan Email di footer langsung berubah sesuai nilai baru.
   - Klik link WA dan Email, pastikan URL mengarah ke `https://wa.me/62...` dan `mailto:...`.
4. **Uji Tab Step Deploy & Kode GAS**: Pastikan tab ke-4 di sidebar admin dapat dibuka dan menampilkan kode lengkap untuk disalin ke Apps Script.
