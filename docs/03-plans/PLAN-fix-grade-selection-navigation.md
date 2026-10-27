# Implementation Plan: Perbaikan Navigasi Pilihan Kelas & Penampilan Sub-Materi STEM di GAS

## Konteks & Latar Belakang Masalah
Pengguna melaporkan bahwa di Google Apps Script (GAS), error sintaks sebelumnya sudah teratasi sepenuhnya. Namun, muncul kendala baru:
> *"saat setelah pilih kelas (setelah klik kategori STEM) sub materi tidak muncul, malah kembali ke halaman awal"*

### Analisis Akar Masalah (Root Cause Analysis):
1. **Penyebab View Reset / Fallthrough ke Halaman Awal**:
   - Pada modal pemilihan jenjang kelas (`gradeSelectorModal`), fungsi `chooseGradeAndExplore(grade)` memanggil `closeGradeSelectorModal()` terlebih dahulu sebelum `selectCategory(cat)` selesai memperbarui DOM view.
   - Tombol-tombol kelas `<button class="grade-select-btn">` tidak memiliki atribut `type="button"`, tidak memanggil `event.stopPropagation()`, dan `event` tidak diteruskan. Di lingkungan iframe sandboxed Google Apps Script, event klik dapat merembet (*bubble*) atau tembus (*fallthrough*) ke elemen di bawah modal (seperti navbar atau card dengan handler `backToHomeCategories()`).
2. **Penyebab Sub-Materi Tidak Muncul (*Filtered Empty*)**:
   - Di `getFilteredMaterials()`, perbandingan kategori dan kelas sangat kaku (strict equality `===`):
     - `m.stem_category !== appState.selectedCategory` akan gagal jika data di Spreadsheet ditulis huruf kecil (`science`), memiliki spasi (`"Science "`), atau menggunakan sinonim (`"Sains"` / `"IPA"`).
     - `String(m.grade) !== String(appState.selectedGrade)` akan gagal jika nilai di Spreadsheet diformat sebagai `"1 SD"`, `"Kelas 1"`, `" 1 "`, atau angka berkoma `"1.0"`.
   - Di `Code.gs`, fungsi `formatMaterialRow` membaca header secara flat tanpa normalisasi sinonim kolom (misalnya: jika guru menulis `Kategori STEM` atau `Kelas` di Google Sheets, properti `stem_category` dan `grade` menjadi `undefined`).
   - Di `resetFiltersInSubpage()`, jika `appState.isGradeLocked` bernilai `true`, reset filter tidak membuka kunci kelas, sehingga tombol "Tampilkan Seluruh Materi" tidak merender apa-apa.

---

## Ruang Lingkup Perbaikan (Scope)

### In-Scope:
1. **Penguatan Event & Transisi View pada Pilihan Kelas**:
   - Menambahkan `type="button"`, `event.stopPropagation()`, dan `event.preventDefault()` pada seluruh tombol pilihan kelas di `index.html`.
   - Memperbaiki urutan eksekusi pada `chooseGradeAndExplore(grade, event)`: set state `selectCategory(cat)`, update filter kelas, update visibilitas baris filter, baru menutup modal secara aman.
2. **Normalisasi & Toleransi Tinggi pada Filter Sub-Materi (`getFilteredMaterials`)**:
   - Normalisasi perbandingan jenjang kelas: pembersihan digit angka murni (`String(m.grade).replace(/\D/g, '') === String(appState.selectedGrade).replace(/\D/g, '')`).
   - Normalisasi perbandingan kategori STEM: case-insensitive, trim spasi, dan pemetaan sinonim dwibahasa (Science/Sains/IPA, Technology/Teknologi, Engineering/Rekayasa, Mathematics/Matematika).
   - Fallback otomatis ke `INITIAL_MATERIALS` jika data dari GAS kosong atau belum terisi.
3. **Ketahanan Backend Google Apps Script (`Code.gs`)**:
   - Normalisasi header kolom di `formatMaterialRow` agar mengenali variasi penamaan kolom Google Sheets (seperti `Kategori`, `Kategori STEM`, `Kelas`, `Jenjang`, `Media`, `Link`).
   - Memastikan auto-seed data kurikulum tetap berjalan jika sheet materi kosong.
4. **Sinkronisasi Kode Salin Deploy**:
   - Memastikan skrip `Code.gs` di tab Panduan Deploy Admin Panel tetap sinkron.

### Out-of-Scope:
- Tidak mengubah skema data spreadsheet inti.
- Tidak mengubah estetika UI dan palet warna yang sudah disetujui.

---

## File Inventory
1. `index.html` - Perbaikan event click, urutan `chooseGradeAndExplore`, normalisasi `getFilteredMaterials`, `resetFiltersInSubpage`, dan sync `getCompleteCodeGsSource()`.
2. `Code.gs` - Fleksibilitas parsing header kolom di `formatMaterialRow` dan jaminan data materi.
3. `CHANGELOG.md` - Pencatatan rilis `v1.6.0`.
4. `docs/03-plans/PLAN-fix-grade-selection-navigation.md` - Dokumen rencana kerja (file ini).
5. `docs/WALKTHROUGH-fix-grade-selection-navigation.md` - Bukti pengujian & verifikasi.

---

## Rencana Langkah Eksekusi (Fase 2)
1. **Langkah 1: Update `index.html`**:
   - Berikan `type="button"` dan `onclick="chooseGradeAndExplore('X', event)"` pada semua 7 tombol kelas.
   - Refactor `chooseGradeAndExplore(grade, event)` untuk mencegah event bubbling & fallthrough.
   - Perkuat `getFilteredMaterials()` dengan normalisasi digit kelas dan nama kategori case-insensitive & sinonim.
   - Perbaiki `resetFiltersInSubpage()` agar membuka kunci kelas saat tombol bantuan ditekan.
2. **Langkah 2: Update `Code.gs`**:
   - Perkuat `formatMaterialRow` dengan kamus sinonim header Google Sheets.
3. **Langkah 3: Sinkronisasi Skrip Deploy di `index.html`**:
   - Sinkronkan `getCompleteCodeGsSource()` dengan perubahan di `Code.gs`.
4. **Langkah 4: Verifikasi dengan Browser Subagent**:
   - Buka `http://localhost:3000`.
   - Klik kartu STEM Science -> Muncul modal kelas -> Klik Kelas 1.
   - Asersi bahwa view tetap di `viewCategorySub`, materi Kelas 1 tampil, dan halaman tidak reset ke Home.
5. **Langkah 5: Release**:
   - Buat `docs/WALKTHROUGH-fix-grade-selection-navigation.md`.
   - Update `CHANGELOG.md` (SemVer `v1.6.0`).
   - Git commit conventional commit, buat tag `v1.6.0`, dan push ke GitHub.
