# Panduan Verifikasi & Walkthrough: Ketahanan Interaksi Modal & Error Boundary Antarmuka (v1.6.1)

Dokumen ini mencatat bukti verifikasi teknis dan pengujian interaksi pengguna setelah perbaikan kendala tombol modal jenjang kelas dan ketahanan rendering antarmuka pada Portal Pembelajaran STEM Sekolah.

---

## 🎯 Ringkasan Masalah & Solusi

### 1. Masalah yang Ditemukan
- Pengguna melaporkan bahwa tombol pilihan jenjang kelas di modal sudah dapat diklik, namun tidak ada respon di lingkungan Google Apps Script.
- Akar penyebab:
  1. Pada fungsi `chooseGradeAndExplore()`, pemanggilan `closeGradeSelectorModal()` berada di baris akhir tanpa blok `try...finally`. Jika terjadi kesalahan minor atau runtime exception saat memanggil `selectCategory()` atau `setGradeFilter()`, eksekusi berhenti sebelum modal ditutup, sehingga modal tetap menutupi layar dan tampak seperti "tidak ada respon".
  2. Fungsi `renderApp()` memanggil sejumlah sub-render (`renderSchoolIdentity`, `renderCategoryLogosAndCounts`, `renderCategorySubpageHeader`, `renderMaterialsGrid`, `renderActiveFilterStatus`) secara sekuensial tanpa isolasi *error boundary*. Jika salah satu sub-render gagal akibat format data yang belum siap, sub-render berikutnya (termasuk pergantian view `#viewCategorySub`) terhenti.
  3. Pada `renderActiveFilterStatus()`, filtering materi saat grade tidak dikunci tidak menggunakan `normalizeCategoryName` dan rentan *TypeError* jika `appState.materials` bernilai kosong atau tidak terdefinisi.
  4. Pada `getFilteredMaterials()`, perbandingan digit kelas belum sepenuhnya ketat jika data kelas baris spreadsheet memiliki karakter tak lazim.

### 2. Solusi yang Diterapkan (v1.6.1)
- **Guaranteed Modal Dismissal**: Membungkus seluruh logika pemilihan jenjang di `chooseGradeAndExplore` dalam blok `try...catch...finally` dengan `closeGradeSelectorModal()` di dalam `finally`.
- **Per-Component Error Boundary**: Setiap sub-render di dalam `renderApp()` dibungkus dalam blok `try...catch` mandiri. Kegagalan rendering satu elemen tidak lagi memblokir pergantian halaman dari Beranda ke Sub-kategori.
- **Fail-Safe View Transition**: Menambahkan fallback darurat di `selectCategory` yang secara paksa menyembunyikan `#viewHome` dan menampilkan `#viewCategorySub`.
- **Defensive Metadata Rendering**: Pada `openGradeSelector`, pembacaan pengaturan dan logo kategori diamankan dengan `try...catch` dan penyetelan display modal menggunakan `.style.setProperty("display", "flex", "important")`.
- **Resilient Active Filter & Grade Matching**: `renderActiveFilterStatus` menggunakan fallback pool `INITIAL_MATERIALS` dan normalisasi kategori standar.

---

## 📦 Berkas yang Dimodifikasi

| Berkas | Perubahan Utama |
|---|---|
| [`index.html`](file:///f:/repository/stemsites/index.html) | • Membungkus panggilan `closeGradeSelectorModal()` di dalam `finally` pada `chooseGradeAndExplore`.<br>• Menambahkan isolasi `try...catch` per sub-render pada fungsi `renderApp()`.<br>• Menambahkan `try...catch` dan force display fallback pada `selectCategory()`.<br>• Mengamankan `openGradeSelector()` dan menambahkan passing parameter `event`.<br>• Memperbaiki normalisasi kategori pada `renderActiveFilterStatus()`.<br>• Memperketat pengecekan digit kelas pada `getFilteredMaterials()`. |
| [`CHANGELOG.md`](file:///f:/repository/stemsites/CHANGELOG.md) | Mencatat rilis `v1.6.1` sesuai format SemVer 2.0.0. |

---

## 🧪 Bukti Pengujian & Verifikasi

### 1. Validasi Sintaks Skrip Mandiri
Pengujian sintaks Node.js pada seluruh blok skrip di `index.html` dan `Code.gs`:
```powershell
node -e "const fs = require('fs'); const html = fs.readFileSync('index.html', 'utf8'); const scriptMatches = html.matchAll(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi); let count = 0; for (const m of scriptMatches) { count++; const code = m[1]; if (!code.trim()) continue; new Function(code); } console.log('All ' + count + ' scripts parsed successfully with 0 errors!');"
# Hasil: All 2 scripts parsed successfully with 0 errors!

node -e "const fs = require('fs'); const code = fs.readFileSync('Code.gs', 'utf8'); new Function(code); console.log('Code.gs syntax OK!');"
# Hasil: Code.gs syntax OK!
```

### 2. Pengujian Interaksi Browser (Real Runtime)
Browser subagent menguji seluruh siklus interaksi di `http://localhost:3000/`:
1. **Buka Beranda**: 4 kartu STEM tampil proporsional tanpa error di console.
2. **Klik Kartu Science**: Modal jenjang kelas terbuka seketika (`#gradeSelectorModal` display: flex).
3. **Klik "Kelas 1 SD"**:
   - Modal langsung tertutup rapi.
   - Halaman beralih ke sub-kategori Science.
   - Banner jenjang terkunci muncul dengan teks **"Kelas 1 SD"**.
   - Grid sub-materi langsung memfilter dan menampilkan materi Kelas 1 SD (*Eksplorasi Anatomi Tubuh 3D & 5 Panca Indra*).
4. **Klik "Ganti Kelas"**: Modal berhasil terbuka kembali.
5. **Klik "Tampilkan Semua Kelas"**: Modal tertutup, semua 6 materi Science muncul.
6. **Klik "Menu STEM"**: Navigasi kembali ke Beranda utama berjalan mulus.
7. **Pemeriksaan Konsol**: **0 unhandled exceptions, 0 syntax error**.

---

## 🚀 Panduan Pembaruan Pengguna di Google Apps Script

Untuk menerapkan perbaikan ini ke Google Apps Script:
1. Buka proyek Apps Script dari menu spreadsheet (**Ekstensi > Apps Script**) atau via [script.google.com](https://script.google.com).
2. Buka berkas **`index.html`** di editor Apps Script.
3. Hapus seluruh isi berkas, lalu salin dan tempelkan seluruh kode terbaru dari berkas [`index.html`](file:///f:/repository/stemsites/index.html) repositori lokal.
4. Klik tombol **Simpan** (ikon disket).
5. Klik **Kelola Penerapan** (Manage Deployments) > Ikon Pensil (Edit) > Pilih versi: **Versi Baru** (New Version) > Klik **Terapkan** (Deploy).
6. Buka URL Web App hasil deploy dan uji kembali klik kategori serta pemilihan kelas.
