# Walkthrough & Verification Guide: Generasi Bank Materi STEM (144 Materi) & Tautan Eksternal Kemendikdasmen

## 1. Ringkasan Pekerjaan
Pada iterasi ini, portal pembelajaran STEM SD Negeri 18 Limboto telah ditingkatkan secara menyeluruh melalui penambahan bank data kurikulum interaktif skala penuh serta perluasan integrasi tautan resmi Kementerian Pendidikan Dasar dan Menengah:
1. **Bank Materi Kurikulum STEM Lengkap (144 Materi)**:
   - Setiap jenjang kelas (Kelas 1 s.d. 6 SD) pada masing-masing kategori (*Science*, *Technology*, *Engineering*, dan *Mathematics*) kini memiliki **6 sub-materi interaktif** terstruktur ($6 \text{ kelas} \times 4 \text{ kategori} \times 6 \text{ materi} = \mathbf{144\text{ materi}}$).
   - **100% Zero-Login / Bebas Akses Tanpa Akun**: Seluruh tautan media interaktif menggunakan direktori terbuka terverifikasi yang dapat langsung dimainkan oleh siswa tanpa harus mendaftar atau login (PhET Interactive Simulations, Blockly Games, Scratch MIT Editor, GeoGebra Classic & Geometry, Mathigon Polypad, NASA Eyes, dan Google Earth Web).
2. **Integrasi 3 Tautan Navigasi Eksternal Kemendikdasmen di Navbar**:
   - Menambahkan 3 tautan resmi di navbar desktop (`.nav-links`) dan drawer mobile (`#mobileNavMenu`):
     - 🎓 **Sumber Belajar**: `https://murid.kemendikdasmen.go.id/sumber-belajar`
     - 📖 **Sumber Buku**: `https://buku.kemendikdasmen.go.id/katalog`
     - ✍️ **Latihan**: `https://murid.kemendikdasmen.go.id/latihan-soal`
   - Dilengkapi atribut `target="_blank" rel="noopener noreferrer"`, ikon eksternal `fa-arrow-up-right-from-square`, dan CSS responsif yang rapi di semua resolusi layar.
3. **Pembaruan Menyeluruh Modal Panduan Pengguna (*User Guide Modal*)**:
   - Memperbarui tab **Siswa SD**, **Orang Tua / Wali**, **Guru Kelas**, dan **Tanya Jawab (FAQ)** untuk memandu pemanfaatan bank 144 materi serta navigasi ke portal Kemendikdasmen.
4. **Pembaruan Konfirmasi & Toast Admin**:
   - Memutakhirkan dialog konfirmasi dan toast sinkronisasi dari "24 materi" menjadi "144 materi kurikulum STEM SD".

---

## 2. Matriks Distribusi Bank Data Materi STEM (144 Materi)

| Kategori STEM | Kelas 1 | Kelas 2 | Kelas 3 | Kelas 4 | Kelas 5 | Kelas 6 | Total per Kategori | Platform Utama (100% Bebas Login) |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|
| **Science** | 6 | 6 | 6 | 6 | 6 | 6 | **36 Materi** | PhET Colorado, Google Earth, NASA Eyes |
| **Technology** | 6 | 6 | 6 | 6 | 6 | 6 | **36 Materi** | Blockly Games, Scratch Editor, Quick Draw |
| **Engineering** | 6 | 6 | 6 | 6 | 6 | 6 | **36 Materi** | PhET Balancing/Buoyancy/Circuit/Energy |
| **Mathematics** | 6 | 6 | 6 | 6 | 6 | 6 | **36 Materi** | GeoGebra, Mathigon Polypad, PhET Math |
| **Total Keseluruhan** | **24** | **24** | **24** | **24** | **24** | **24** | **144 Materi** | **100% Zero-Login / Bebas Akun** |

---

## 3. User Testing Journey (Panduan Pengujian Fungsional)

### Skenario 1: Siswa Mengakses Tautan Eksternal Kemendikdasmen
1. Buka beranda portal STEM.
2. Pada bagian navbar atas, perhatikan 3 tombol navigasi baru:
   - Klik **"Sumber Belajar"** -> Tab baru terbuka ke `https://murid.kemendikdasmen.go.id/sumber-belajar`.
   - Klik **"Sumber Buku"** -> Tab baru terbuka ke `https://buku.kemendikdasmen.go.id/katalog`.
   - Klik **"Latihan"** -> Tab baru terbuka ke `https://murid.kemendikdasmen.go.id/latihan-soal`.
3. Buka portal di resolusi smartphone / tablet (< 992px):
   - Klik tombol hamburger `☰`.
   - Menu dropdown terbuka menampilkan ketiga tautan eksternal secara rapi dan proporsional.

### Skenario 2: Eksplorasi Materi STEM Berjenjang (6 Materi per Kelas)
1. Di beranda, klik salah satu Card Utama (misal **Technology**).
2. Tampilan berpindah ke subpage Technology.
3. Klik tombol filter **Kelas 1**:
   - Muncul tepat 6 materi coding ramah anak (Labirin Perdanaku, Burung Blockly, Kura-kura Garis, Pengenalan Mouse/Keyboard, Teka-teki Robot, Not Nada Digital).
4. Klik tombol filter **Kelas 4**:
   - Muncul tepat 6 materi tingkat menengah (Logika If-Else Blockly, Poligon Bunga, Game Tangkap Bintang Scratch, Robot Vacuum Cleaner, Fabel Interaktif, Konsep Internet).
5. Klik salah satu tombol **"Mulai Eksplorasi 🚀"**:
   - Modal misi terbuka memuat tujuan pembelajaran, instruksi langkah eksplorasi, media interaktif PhET/Blockly tanpa login, serta pertanyaan refleksi.

### Skenario 3: Membuka Modal Panduan Pengguna (*User Guide*)
1. Klik tombol **"Panduan Pengguna"** di navbar.
2. Modal terbuka menampilkan tab:
   - **Siswa SD**: Panduan pemilihan kategori, jenjang kelas (6 materi per jenjang), dan navigasi tautan kementerian.
   - **Orang Tua / Wali**: Jaminan 100% Zero-Login dan pemanfaatan buku kurikulum resmi.
   - **Guru Kelas**: Informasi bank 144 modul pembelajaran dan tips apersepsi kelas.
   - **Tanya Jawab (FAQ)**: Jawaban seputar akses HP, ketiadaan registrasi akun, dan akses portal kementerian.

### Skenario 4: Sinkronisasi Admin ke Google Sheets
1. Klik tombol **"Masuk Admin"** dan masukkan PIN valid.
2. Masuk ke Tab **"Data Materi STEM"**.
3. Klik tombol **"Muat Ulang 144 Materi SD"**:
   - Dialog konfirmasi muncul bertuliskan *"Muat ulang seluruh 144 materi kurikulum STEM SD ke database Google Sheets?"*.
   - Saat disetujui, sistem memuat ke-144 data master secara lengkap.

---

## 4. Bukti Verifikasi Teknis (*Technical Evidence*)

### A. Hasil Uji Otomatis Master Data & Sintaks VM (`verify_project.js`)
```
=== MEMULAI VERIFIKASI SISTEM STEM PORTAL ===

1. Menguji Code.gs:
  [PASS] Code.gs sintaks valid dan dieksekusi tanpa error.
  [PASS] getCurriculumSampleMaterials() sukses mengembalikan tepat 144 baris.
  [PASS] Seluruh 144 baris di Code.gs memiliki 12 kolom lengkap.

2. Menguji index.html:
  [PASS] Seluruh 3 tautan eksternal Kemendikdasmen terpasang di navbar.
  [PASS] Blok <script> ke-1 sintaks valid 100%.
  [PASS] Blok <script> ke-2 sintaks valid 100%.
  [PASS] INITIAL_MATERIALS di index.html berisi tepat 144 item.
  [PASS] Distribusi 6 materi x 6 kelas x 4 kategori = 144 materi di index.html terverifikasi.

=== SELURUH VERIFIKASI BERHASIL 100% (PASS) ===
```

### B. Uji Respons Server Lokal (`server.js`)
```
Status: 200, Length: 334211
```
Halaman `index.html` berhasil dilayani secara lokal dengan status HTTP 200 tanpa hambatan payload.

---

## 5. Kesimpulan
Seluruh permintaan pengguna telah tuntas diimplementasikan:
- ✅ Bank materi STEM diperluas menjadi 6 materi per kelas di setiap kategori (Total 144 materi aktif).
- ✅ Seluruh tautan materi terverifikasi 100% *Zero-Login* (bebas akses tanpa login/registrasi akun).
- ✅ Tiga tautan eksternal resmi Kemendikdasmen (Sumber Belajar, Sumber Buku, Latihan) terpasang di navbar beranda desktop dan mobile.
- ✅ Modal Panduan Pengguna diperbarui untuk Siswa, Guru, Orang Tua, dan FAQ.
