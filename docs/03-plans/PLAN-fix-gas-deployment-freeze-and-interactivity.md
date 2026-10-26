# Implementation Plan: Solusi Tuntas Portal STEM Freeze / Unclickable & 0 Materi di Google Apps Script

## 1. Konteks & Latar Belakang Masalah
Pengguna melaporkan:
> *"masih sama, hanya tampilan awal, tidak bisa di klik menu ataupun link lainnya"*

Meskipun berkas lokal di repository sudah dibersihkan dari duplikasi skrip (v1.5.4) dan diuji 100% lancar di browser (`http://localhost:3000`), portal Web App di Google Apps Script (GAS) pengguna masih tampak tidak responsif terhadap klik dan materi tetap `0 Materi`.

### Analisis Akar Masalah (Root Cause Investigation)
Berdasarkan investigasi arsitektur runtime Google Apps Script Web App:
1. **Google Apps Script Immutable Deployment Caching (Penyebab Utama #1)**:
   - Di Google Apps Script, URL produksi `/exec` **TIDAK PERNAH** otomatis terbarui hanya dengan menekan tombol *Save (Ctrl+S)* di editor kode.
   - URL `/exec` terikat pada **Versi Beku (Snapshot Version)** saat deployment pertama kali dibuat.
   - Jika pengguna mengedit atau menempelkan kode baru tetapi **tidak membuat versi deployment baru** via menu *Deploy > Kelola Deployment > Edit (ikon pensil) > Versi: Versi Baru > Terapkan (Deploy)*, maka Google Apps Script akan **terus menyajikan kode versi lama yang rusak** (di mana `DEFAULT_SETTINGS has already been declared` terjadi dan mematikan seluruh interaksi JavaScript).
2. **Quirk Penamaan Berkas di Editor Google Apps Script (Penyebab #2)**:
   - Di Google Apps Script, ketika pengguna membuat berkas HTML baru dan mengetikkan nama `scripts.html`, Google Apps Script otomatis menambahkan ekstensi `.html` sehingga nama berkas internal menjadi `scripts.html.html`.
   - Fungsi `include('scripts')` di `Code.gs` saat ini hanya mencoba nama persis `filename`. Jika berkas di GAS diberi nama `scripts.html`, fungsi `include()` akan gagal.
3. **Nilai Awal Badge Statis di `index.html` (`0 Materi`)**:
   - Di dalam `index.html`, badge kategori STEM ditulis statis `<span class="stem-badge-count" id="count-Science">0 Materi</span>`.
   - Jika skrip mengalami jeda (misal menunggu pemuatan Google Fonts atau FontAwesome CDN), tampilan awal tetap menunjukkan `0 Materi` alih-alih `6 Materi`.
4. **Ketiadaan Visual Error Boundary di Layar**:
   - Jika ada galat JavaScript atau konflik lingkungan iframe Google Apps Script (`userCodeAppPanel`), pengguna awam tidak dapat melihat error console tanpa membuka Chrome DevTools (F12).
5. **Kebutuhan Opsi Deployment Mandiri (Standalone Single-File Bundle)**:
   - Menyalin dan mengelola 5 berkas terpisah (`Code.gs`, `index.html`, `styles.html`, `admin.html`, `scripts.html`) di Google Apps Script rentan terhadap kelalaian salah satu file tidak tersalin atau keliru penamaan. Menyediakan opsi 1 berkas HTML gabungan mandiri akan menjadi jalan pintas 100% anti-gagal bagi pengguna.

---

## 2. Ruang Lingkup Perubahan (Scope)

### In-Scope:
1. **Penyempurnaan `Code.gs`**:
   - Jadikan fungsi `include(filename)` ultra-toleran (resilient): otomatis mencoba `filename`, `filename.html`, maupun membuang `.html` jika terjadi ekstensi ganda di GAS.
2. **Visual Error Boundary & Fallback Cepat di `index.html`**:
   - Pasang *On-Screen Diagnostic Error Catcher* di bagian teratas `<head>`: jika ada error JavaScript apa pun di browser pengguna, peringatan visual akan langsung muncul di pojok bawah layar memberitahukan nama error dan nomor barisnya.
   - Ubah teks statis badge kategori STEM di `index.html` dari `0 Materi` menjadi `6 Materi` sehingga sejak frame pertama dimuat, jumlah kurikulum standar langsung tampil sempurna.
3. **Penyediaan Bundler & Tab Standalone Single-File di Admin Panel**:
   - Buat skrip bundler otomatis `bundle.js` yang menghasilkan `dist/index.html` (gabungan `index.html` + `styles.html` + `admin.html` + `scripts.html` dalam 1 berkas murni).
   - Tambahkan tab khusus di Admin Panel **"📦 index.html (Standalone 1-File)"** sehingga pengguna cukup membuat 2 berkas di Google Apps Script: `Code.gs` dan `index.html` saja!
4. **Panduan Verifikasi & Deployment Langkah-demi-Langkah**:
   - Menyusun panduan visual yang sangat jelas tentang cara memperbarui deployment ke "Versi Baru" (New Version) di Apps Script atau menggunakan URL `/dev` (Uji Deployment).

### Out-of-Scope:
- Mengubah skema database Google Sheets yang sudah berjalan.
- Mengurangi atau mengubah isi 24 materi kurikulum STEM.

---

## 3. Inventaris Berkas (File Inventory)

| No | Berkas | Aksi | Deskripsi Perubahan |
|---|---|---|---|
| 1 | `Code.gs` | Edit | Fungsi `include()` ultra-resilient (menangani `name`, `name.html`, `.html.html`). |
| 2 | `index.html` | Edit | On-screen error diagnostic listener di `<head>` dan update badge awal ke `6 Materi`. |
| 3 | `scripts.html` | Edit | Tambahkan dukungan tab Standalone Bundle pada modal deploy kode admin. |
| 4 | `admin.html` | Edit | Tambahkan tombol tab "📦 index.html (Standalone)" di modal salin kode deploy. |
| 5 | `bundle.js` | Buat | Skrip utilitas otomatis untuk mengkompilasi 1-file standalone bundle ke `dist/index.html`. |
| 6 | `CHANGELOG.md` | Edit | Catat rilis patch `v1.5.5`. |

---

## 4. Mitigasi Risiko & Rollback

| Risiko Potensial | Dampak | Strategi Mitigasi |
|---|---|---|
| File `scripts` di Apps Script tidak ditemukan karena salah nama | Script tidak ter-include | `include()` di `Code.gs` membungkus pemanggilan dalam multi-tier try-catch dan fallback string. |
| Pengguna tetap membuka URL deployment lama | Kode baru tidak berjalan | Panduan tegas di laporan chat untuk mengklik *Kelola Deployment > Versi Baru* atau membuka link `/dev`. |
| Ada error runtime tak terduga di browser siswa | Halaman diam/freeze | On-screen error banner menangkap exception global dan menampilkannya di layar secara eksplisit. |

---

## 5. Rencana Pengujian & Verifikasi
1. Eksekusi `node bundle.js` untuk memverifikasi standalone bundle terbuat tanpa error.
2. Uji halaman lokal via browser subagent dan inspeksi DOM serta interaksi klik.
3. Simulasikan penamaan berkas dengan ekstensi `.html` dan tanpa ekstensi di fungsi `include()` `Code.gs`.
