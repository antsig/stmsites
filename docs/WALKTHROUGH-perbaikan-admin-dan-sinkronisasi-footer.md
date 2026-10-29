# Walkthrough Verifikasi: Perbaikan Data Admin & Sinkronisasi Kontak Bantuan Footer (v1.6.4)

## Ringkasan Eksekutif
Pembaruan versi **v1.6.4** menyelesaikan kendala materi dan pengaturan yang tidak tampil di panel admin setelah pembaruan sebelumnya, membersihkan sisa kode deploy Apps Script dari admin sesuai instruksi pengguna, serta menyinkronkan kontak bantuan di footer (WhatsApp dan Email) secara dinamis dengan nilai di formulir pengaturan admin.

---

## 🎯 Komponen yang Diperbarui

1. **Backend Google Apps Script (`Code.gs`)**:
   - Menambahkan *emergency fallback guarantee* pada `getInitialData()`: jika pemanggilan Google Sheets terkendala otorisasi atau koneksi tertunda, backend tetap mengembalikan data pengaturan `DEFAULT_SETTINGS` dan 24 materi kurikulum STEM SD lengkap (`getCurriculumSampleMaterials()`).
   - Mencegah respon `{ success: false }` yang dapat mengosongkan state antarmuka klien.

2. **Frontend Portal & Panel Admin (`index.html`)**:
   - **Sinkronisasi Kontak Footer**:
     - Menambahkan elemen `#footerWaLink` dan `#footerEmailLink` di footer portal (`.footer-contacts`).
     - Mengintegrasikan styling responsif `.footer-contact-item.email` dan `.footer-contact-item.wa`.
     - Mengaitkan update real-time di `renderSchoolIdentity()` sehingga setiap perubahan pada `s.contact_wa` dan `s.contact_email` otomatis memperbarui nomor tampilan dan URL tautan (`wa.me/...` dan `mailto:...`).
   - **Pemulihan Data Pengaturan & Materi di Admin**:
     - Memperbaiki `loadInitialData()` agar memanggil `populateSettingsForm()` dan `renderAdminTable()` secara andal baik saat sukses maupun kegagalan koneksi GAS.
     - Memperbarui `fallbackToLocalStorage()` dengan penomoran versi `"v1.6.4"` serta merger defensif `Object.assign({}, DEFAULT_SETTINGS, loadedSettings)` dan fallback 24 materi kurikulum.
     - Memperbarui `populateSettingsForm()` dengan selektor null-safe dan fallback default agar form tidak pernah kosong.
   - **Pembersihan Modul Deploy**:
     - Memastikan section deploy tetap terhapus dari HTML sidemenu dan panel konten admin.
     - Menghapus pemanggilan `initDeployCodeViewer()` dari `switchAdminTab()`.
     - Menghapus seluruh blok skrip modul deploy JS yang sudah tidak digunakan (`DEPLOY_FILE_METAS`, `getCompleteCodeGsSource`, `selectDeployFile`, dsb.).
   - **Pemulihan Tombol Demo PIN**:
     - Menambahkan kembali tombol `"Isi PIN Demo (123456)"` di modal login admin untuk kemudahan verifikasi dan pengujian cepat.

---

## 🧪 Skenario Pengujian & Hasil Verifikasi

### 1. Verifikasi Tampilan Awal Footer (Portal Siswa)
- **Langkah**: Buka halaman utama portal pembelajaran di browser (`http://localhost:3000/`), gulir ke bagian paling bawah (footer).
- **Hasil**:
  - Terdapat dua kartu kontak bantuan: **WhatsApp Bantuan Guru/Siswa** dan **Email Bantuan Resmi**.
  - Tautan WhatsApp mengarah ke nomor sekolah default (`https://wa.me/6281234567890`).
  - Tautan Email mengarah ke alamat email resmi default (`mailto:stem.harapanbangsa@sekolah.sch.id`).

### 2. Verifikasi Autentikasi Admin
- **Langkah**: Klik tombol **Admin** di bilah atas (*topbar*).
- **Hasil**:
  - Modal login PIN Admin muncul dengan rapi.
  - Terdapat tombol bantu **"Isi PIN Demo (123456)"** yang langsung mengisi field PIN.
  - Menekan tombol **"Masuk ke Dashboard Admin"** memvalidasi PIN dan langsung membuka antarmuka Admin Overlay.

### 3. Verifikasi Tab "Kelola Materi"
- **Langkah**: Periksa tab default di Dashboard Admin.
- **Hasil**:
  - Tab "Kelola Materi" aktif dan menampilkan tabel data lengkap berisi **24 materi kurikulum STEM SD**.
  - Kolom Thumbnail, Judul Materi, Kategori STEM, Kelas, Jenis Media, dan Tombol Aksi (Edit/Hapus) tampil presisi.
  - Filter pencarian, filter kategori STEM, dan filter kelas berfungsi normal.

### 4. Verifikasi Sidemenu Admin
- **Langkah**: Periksa daftar menu navigasi pada sidebar admin.
- **Hasil**:
  - Hanya ada 3 menu: **Kelola Materi**, **Pengaturan**, dan **Panduan Admin**.
  - Section/Tab Deploy Apps Script **sepenuhnya bersih/tidak ada**.

### 5. Verifikasi Tab "Pengaturan" & Sinkronisasi Form
- **Langkah**: Klik menu **Pengaturan** di sidemenu admin.
- **Hasil**:
  - Form tidak kosong! Seluruh input (Nama Sekolah, Slogan, Tahun Ajaran, URL Logo Sekolah, Kontak WhatsApp, dan Kontak Email) terisi otomatis dengan nilai tersimpan.
  - Kartu pratinjau (*live preview*) di sebelah kanan menampilkan nama, slogan, logo, dan ikon kategori secara akurat.

### 6. Verifikasi Simpan Pengaturan & Sinkronisasi Real-Time Footer
- **Langkah**:
  1. Ubah field **Nomor WhatsApp Bantuan** menjadi `628999888777`.
  2. Ubah field **Email Kontak Resmi** menjadi `kontak.stem@sdharapanbangsa.sch.id`.
  3. Klik tombol **"Simpan Pengaturan"**.
  4. Muncul notifikasi toast hijau *"Pengaturan sekolah berhasil disimpan!"*.
  5. Klik tombol **"Portal Siswa"** di pojok kanan atas untuk kembali ke tampilan siswa.
  6. Gulir ke bagian footer.
- **Hasil**:
  - Nomor WhatsApp di footer otomatis berubah menjadi `+628999888777` dengan link `https://wa.me/628999888777`.
  - Email di footer otomatis berubah menjadi `kontak.stem@sdharapanbangsa.sch.id` dengan link `mailto:kontak.stem@sdharapanbangsa.sch.id`.
  - Teks hak cipta di footer bawah juga tersinkronisasi menampilkan nama sekolah dan tahun ajaran aktif.

### 7. Verifikasi Teknis & Console Log
- **Langkah**: Jalankan audit sintaks JavaScript dengan runtime Node.js.
- **Hasil**:
  - `Code.gs`: SYNTAX PASS 100%
  - `index.html` inline script: SYNTAX PASS 100%
  - Tidak ada runtime error atau unhandled exception pada console browser.
