# Walkthrough: Verifikasi Perbaikan Navigasi Pilihan Kelas & Penampilan Sub-Materi STEM Portal

Dokumen ini mendokumentasikan bukti teknis dan langkah pengujian (*testing walkthrough*) untuk perbaikan kendala navigasi pemilihan kelas dan tampilan sub-materi STEM Portal di lingkungan Google Apps Script (GAS) dan web browser.

---

## 📌 Masalah yang Diselesaikan
- Saat pengguna mengklik salah satu kategori STEM (misal Science) lalu memilih jenjang kelas (misal Kelas 1 SD), sub-materi tidak muncul dan tampilan malah kembali ter-reset ke halaman awal (`#viewHome`).
- **Akar masalah**:
  1. Tombol modal tidak memiliki `type="button"` dan tidak menghentikan perambatan event (`event.stopPropagation()`), serta `closeGradeSelectorModal()` menutup modal sebelum transisi view selesai. Di iframe Google Apps Script, klik tembus (*fallthrough*) ke elemen di bawah modal yang memiliki handler `backToHomeCategories()`.
  2. Perbandingan kategori dan jenjang kelas di `getFilteredMaterials()` sangat kaku, sehingga jika nilai di Google Sheets memiliki spasi, huruf kecil (`"science"`), atau variasi penamaan kelas (`"Kelas 1"`, `"1 SD"`), filter menghasilkan 0 materi (*empty state*).
  3. `formatMaterialRow` di backend `Code.gs` belum memiliki kamus toleransi sinonim header kolom Google Sheets.

---

## 🛠️ Perubahan yang Diterapkan

| Komponen / Berkas | Tindakan & Perubahan Teknis |
|---|---|
| [`index.html`](file:///f:/repository/stemsites/index.html) | • Menambahkan `type="button"` dan pemanggilan `chooseGradeAndExplore('X', event)` pada ke-7 tombol pilihan jenjang kelas modal.<br>• Memperbaiki urutan transisi: set kategori -> update filter -> update visibilitas baris filter -> tutup modal (`closeGradeSelectorModal`).<br>• Menambahkan `event.stopPropagation()` dan `event.preventDefault()` pada `chooseGradeAndExplore` dan `backToHomeCategories`.<br>• Menambahkan `normalizeCategoryName()` dan `normalizeGradeDigit()` agar filter tahan terhadap huruf kecil, sinonim dwi-bahasa (Science/Sains/IPA), dan string kelas (`"1"`, `1`, `"Kelas 1"`).<br>• Mengamankan `window.scrollTo` dengan blok `try-catch` agar tidak melempar pengecualian di sandboxed iframe GAS.<br>• Memperbaiki `resetFiltersInSubpage()` agar membuka kunci `appState.isGradeLocked` dan menampilkan seluruh materi kategori terpilih.<br>• Menyelaraskan fungsi `getCompleteCodeGsSource()` dengan kode backend `Code.gs` terbaru. |
| [`Code.gs`](file:///f:/repository/stemsites/Code.gs) | • Menambahkan kamus sinonim header fleksibel pada `formatMaterialRow` (mengenali `Kategori STEM`, `Kategori`, `Kelas`, `Jenjang`, dll).<br>• Normalisasi digit murni pada kolom `grade` dan standar Title Case pada `stem_category`.<br>• Auto-seed 24 materi kurikulum otomatis di `getInitialData()` jika sheet materi ditemukan kosong. |

---

## 🧪 Bukti Pengujian Browser (Automated Browser Test Evidence)

Pengujian interaktif otomatis dijalankan menggunakan browser subagent pada server lokal (`http://localhost:3000`) yang mereplikasi perilaku runtime Google Apps Script.

### Skenario Uji 1: Klik Kategori STEM & Pilih Jenjang Kelas 1
1. **Langkah**: Dari halaman Home, klik kartu kategori **Science** (`.stem-card.sci`).
2. **Hasil**: Modal `gradeSelectorModal` muncul dengan bersih dan terpusat.
3. **Langkah**: Klik tombol **Kelas 1** (`chooseGradeAndExplore('1', event)`).
4. **Hasil**:
   - Modal tertutup dengan halus tanpa *fallthrough*.
   - `#viewCategorySub` aktif (`display: block`).
   - `#viewHome` tersembunyi (`display: none`).
   - Header menampilkan `"Eksplorasi Science (Sains Alam)"`.
   - Banner jenjang terkunci menampilkan `"Kelas 1 SD"` dengan tombol `"Ganti Kelas"`.
   - Grid materi menampilkan materi khusus Kelas 1: *"Eksplorasi Anatomi Tubuh 3D & 5 Panca Indra"*.
   - Error konsol: **0 error**.

### Skenario Uji 2: Ganti Jenjang Kelas ke "Tampilkan Semua Kelas"
1. **Langkah**: Klik tombol **Ganti Kelas** (`.btn-change-grade`).
2. **Hasil**: Modal `gradeSelectorModal` terbuka kembali.
3. **Langkah**: Klik tombol **Tampilkan Semua Kelas**.
4. **Hasil**:
   - Banner jenjang terkunci digantikan oleh baris pill filter jenjang (Semua Kelas, Kelas 1 s.d. 6).
   - Seluruh 6 materi Science dari Kelas 1 s.d. 6 tampil lengkap di grid.

### Skenario Uji 3: Kembali ke Halaman Awal (Menu STEM)
1. **Langkah**: Klik tombol **Menu STEM** (`.btn-back-home`).
2. **Hasil**:
   - `#viewCategorySub` disembunyikan.
   - `#viewHome` kembali tampil sempurna dengan 4 kartu utama STEM.

---

## 🚀 Panduan Pembaruan ke Google Apps Script (Untuk Pengguna)

Karena perubahan mencakup `Code.gs` dan `index.html`:

1. Buka project **Apps Script** Anda di browser ([script.google.com](https://script.google.com)).
2. **Perbarui Berkas `Code.gs`**:
   - Buka tab berkas `Code.gs` di Apps Script.
   - Hapus semua isi lama, lalu salin dan tempelkan seluruh isi berkas [`Code.gs`](file:///f:/repository/stemsites/Code.gs).
3. **Perbarui Berkas `index.html`**:
   - Buka tab berkas `index.html` di Apps Script.
   - Hapus semua isi lama, lalu salin dan tempelkan seluruh isi berkas [`index.html`](file:///f:/repository/stemsites/index.html).
4. **Deploy Versi Baru**:
   - Klik tombol **Deploy** (Terapkan) > **Kelola deployment (Manage deployments)**.
   - Klik ikon **Pensil (Edit)** pada deployment aktif.
   - Pada dropdown Versi, pilih **Versi Baru (New version)**.
   - Klik **Terapkan (Deploy)**.
5. Buka kembali tautan Web App Anda di browser. Klik kartu kategori STEM dan pilih kelas. Sub-materi akan langsung tampil secara presisi dan stabil!
