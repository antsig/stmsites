# Implementation Plan: Generasi Bank Materi STEM SD (6 Materi per Kelas & Kategori) & Integrasi Navbar Link Eksternal Kemendikdasmen

## 1. Konteks & Latar Belakang Masalah
Portal Pembelajaran STEM SD Negeri 18 Limboto saat ini memiliki 24 materi master contoh (6 materi per kategori STEM yang tersebar acak 1 materi per jenjang kelas 1–6). Ketika seorang siswa atau guru memilih satu jenjang kelas tertentu (misal Kelas 4) pada kategori tertentu (misal Science), hanya muncul 1 sub-materi. Kebutuhan kurikulum menuntut tersedianya **pilihan materi yang lebih kaya dan berjenjang (6 materi per kelas di setiap kategori)** sehingga total materi mencakup $6 \text{ kelas} \times 4 \text{ kategori} \times 6 \text{ materi} = 144 \text{ materi}$ kurikulum interaktif.

Selain itu, untuk memperluas akses referensi belajar resmi bagi siswa dan guru di portal, diperlukan penambahan **3 tautan navigasi eksternal resmi Kementerian Pendidikan Dasar dan Menengah (Kemendikdasmen)** pada navbar beranda:
1. **Sumber Belajar**: `https://murid.kemendikdasmen.go.id/sumber-belajar`
2. **Sumber Buku**: `https://buku.kemendikdasmen.go.id/katalog`
3. **Latihan Soal**: `https://murid.kemendikdasmen.go.id/latihan-soal`

Halaman **Panduan Pengguna (User Guide Modal)** juga perlu diperbarui agar merefleksikan ketersediaan bank materi baru serta cara memanfaatkan tautan eksternal kementerian tersebut.

---

## 2. Ruang Lingkup Pekerjaan (*Scope*)

### Dalam Lingkup (*In-Scope*):
1. **Generasi Data Master Materi STEM (144 Materi Lengkap)**:
   - Menghasilkan 6 materi berkualitas untuk setiap kelas (Kelas 1, 2, 3, 4, 5, 6) pada setiap kategori (Science, Technology, Engineering, Mathematics). Total 144 materi.
   - **Kriteria Wajib Bebas Login (100% Zero-Login / Tanpa Akun)**: Seluruh tautan media interaktif yang digunakan WAJIB dapat langsung dimainkan atau dibuka oleh siswa tanpa memerlukan registrasi, login akun, atau pemasangan plugin berbayar (contoh: PhET Interactive Simulations, Blockly Games, Mathigon Polypad, GeoGebra Classic, PBS Kids Design Squad, Code.org Guest Activities, NASA Eyes).
   - Masing-masing materi dilengkapi ID unik berstruktur (`STEM-SCI-K1-01` s.d. `STEM-MAT-K6-06`), judul menarik ramah anak, jenjang kelas valid, tipe media (`Simulasi`, `Lab Maya`, `Game`, `Praktikum`), URL media interaktif nyata tanpa login, thumbnail Unsplash relevan, deskripsi edukatif, tujuan misi (*mission goals*), langkah eksplorasi (*mission steps*), dan pertanyaan refleksi kritis (*mission reflection*).
   - Penempatan data master di:
     - `Code.gs`: fungsi `getCurriculumSampleMaterials()`, menu Apps Script, dan fungsi `forceSeedMaterials()`.
     - `index.html`: array `INITIAL_MATERIALS`, peningkatan `DATA_VERSION` ke `v1.7.0` agar localStorage otomatis termutakhirkan.
2. **Penambahan Link Eksternal di Navbar Beranda**:
   - Menambahkan 3 tombol/tautan eksternal ke navbar desktop (`.nav-links`) dan dropdown mobile (`#mobileNavMenu`):
     - Sumber Belajar (`fa-solid fa-graduation-cap`)
     - Sumber Buku (`fa-solid fa-book-bookmark`)
     - Latihan Soal (`fa-solid fa-pen-to-square`)
   - Link membuka di tab baru (`target="_blank" rel="noopener noreferrer"`) dengan indikator ikon eksternal.
   - Styling responsif agar navbar tetap rapi pada resolusi desktop, tablet, dan smartphone tanpa tumpang tindih.
3. **Penyesuaian Modal Panduan Pengguna (*User Guide*)**:
   - Pembaruan tab Siswa SD: instruksi memilih kelas dengan 6 materi per kategori dan cara membuka link eksternal Kemendikdasmen.
   - Pembaruan tab Guru & Orang Tua: penjelasan bank materi kurikulum 144 modul interaktif dan integrasi buku teks kementerian.
   - Pembaruan tab FAQ: penjelasan tautan kementerian dan cara memperbarui materi di database Google Sheets.
4. **Pembaruan Teks Konfirmasi & Toast Admin**:
   - Memperbarui teks konfirmasi dan toast "24 materi" menjadi "144 materi kurikulum STEM SD".

### Di Luar Lingkup (*Out-of-Scope*):
- Mengubah skema kolom database Google Sheets (kolom tetap 12 header standar).
- Mengubah autentikasi atau logika hashing PIN admin.

---

## 3. Inventaris Berkas (*File Inventory*)

| No | Berkas | Status | Tanggung Jawab Perubahan |
|---|---|---|---|
| 1 | `docs/03-plans/PLAN-generasi-materi-stem-dan-navbar-eksternal-kemendikdasmen.md` | Dibuat | Dokumen perencanaan implementasi dan gerbang persetujuan. |
| 2 | `Code.gs` | Diubah | Memperbarui `getCurriculumSampleMaterials()` dengan 144 materi STEM lengkap, serta pesan menu/sinkronisasi. |
| 3 | `index.html` | Diubah | Memperbarui `INITIAL_MATERIALS`, bump `DATA_VERSION` ke `v1.7.0`, menambah 3 link eksternal di navbar desktop & mobile, menata CSS nav responsif, memperbarui modal Panduan Pengguna dan dialog admin. |
| 4 | `CHANGELOG.md` | Diubah | Pencatatan versi minor baru (SemVer 2.0.0). |
| 5 | `docs/WALKTHROUGH-generasi-materi-stem-dan-navbar-eksternal-kemendikdasmen.md` | Dibuat | Panduan verifikasi dan bukti uji teknis. |

---

## 4. Desain & Struktur Data Materi STEM (144 Materi)

### Matriks Distribusi Materi:
| Jenjang | Science (S) | Technology (T) | Engineering (E) | Mathematics (M) | Total per Jenjang |
|---|:---:|:---:|:---:|:---:|:---:|
| **Kelas 1 SD** | 6 materi | 6 materi | 6 materi | 6 materi | 24 materi |
| **Kelas 2 SD** | 6 materi | 6 materi | 6 materi | 6 materi | 24 materi |
| **Kelas 3 SD** | 6 materi | 6 materi | 6 materi | 6 materi | 24 materi |
| **Kelas 4 SD** | 6 materi | 6 materi | 6 materi | 6 materi | 24 materi |
| **Kelas 5 SD** | 6 materi | 6 materi | 6 materi | 6 materi | 24 materi |
| **Kelas 6 SD** | 6 materi | 6 materi | 6 materi | 6 materi | 24 materi |
| **Total per Kategori** | **36 materi** | **36 materi** | **36 materi** | **36 materi** | **144 Materi** |

### Contoh Pemetaan Topik Edukatif Terkurasi:
- **Science (36 materi)**:
  - Kelas 1: 5 Panca Indra, Mengenal Hewan & Habitat, Bagian Tubuh Tumbuhan, Cuaca Cerah & Hujan, Benda Terang & Gelap, Merawat Tanaman.
  - Kelas 2: Listrik Statis Balon & Rambut, Pertumbuhan Biji Kacang, Bunyi & Getaran Sumber Suara, Sifat Campuran Air & Minyak, Mengenal Hewan Siang & Malam, Daur Hidup Kupu-kupu.
  - Kelas 3: Wujud Zat (Padat, Cair, Gas), Gerak Benda & Gaya Dorong, Daur Air Sederhana, Makanan Sehat & Pencernaan Dasar, Sifat Magnet Menarik Logam, Pelestarian Lingkungan Sekolah.
  - Kelas 4: Fotosintesis & Klorofil, Rantai Makanan & Ekosistem Hutan, Sifat Perambatan Cahaya, Sumber Energi Terbarukan, Siklus Hidup Katak & Nyamuk, Perubahan Energi Listrik ke Gerak/Panas.
  - Kelas 5: Struktur Kerak Bumi & Gunung Berapi, Sistem Pernapasan Manusia (Paru-paru), Sifat Larutan Asam Basa Alami, Rangka & Sendi Gerak Manusia, Rantai Makanan Laut, Siklus Batuan & Erosi.
  - Kelas 6: Tata Surya & Orbit Planet Antariksa, Gerhana Matahari & Bulan, Magnet Bumi & Kompas Pelaut, Perkembangbiakan Vegetatif Tumbuhan, Penyesuaian Diri Hewan (Adaptasi), Penghematan Energi Listrik Global.
- **Technology (36 materi)**:
  - Kelas 1–6: Algoritma logika dasar, Blockly Games (Maze, Birds, Turtle), Scratch MIT (animasi kartun, game apel jatuh, kuis edukasi), Code.org (Hour of Code, Minecraft Adventurer, Dance Party), Pemodelan 3D Tinkercad dasar, Konsep AI Pengenalan Citra (Quick Draw / Teachable Machine).
- **Engineering (36 materi)**:
  - Kelas 1–6: Keseimbangan Timbangan & Menara Balok, Hukum Apung Perahu Kertas/Plastisin, Katrol & Bidang Miring Sederhana, Roda & Poros Gerobak, Jembatan Truss Beban Berat, Sirkuit Listrik Rumah Pintar PhET, Roket Air Tekanan Udara, Penyaring Air Bersih Alami.
- **Mathematics (36 materi)**:
  - Kelas 1–6: Geometri Bangun Datar GeoGebra, Tangram & Jam Analog Polypad, Pecahan Visual Pizza & Cokelat PhET, Luas & Keliling Petak PhET, Bilangan Pecahan Desimal & Persen Matific, Bangun Ruang 3D & Jaring-jaring Kubus Polypad, Pengolahan Data Diagram Batang GeoGebra.

---

## 5. Rencana UI & Navbar Link Eksternal

### Navbar Desktop & Mobile:
```html
<!-- Desktop Links -->
<div class="nav-links">
  <button class="nav-btn" onclick="backToHomeCategories()"><i class="fa-solid fa-shapes"></i> Beranda</button>
  <a href="https://murid.kemendikdasmen.go.id/sumber-belajar" target="_blank" rel="noopener noreferrer" class="nav-btn external-link">
    <i class="fa-solid fa-graduation-cap"></i> Sumber Belajar <i class="fa-solid fa-arrow-up-right-from-square nav-ext-icon"></i>
  </a>
  <a href="https://buku.kemendikdasmen.go.id/katalog" target="_blank" rel="noopener noreferrer" class="nav-btn external-link">
    <i class="fa-solid fa-book-bookmark"></i> Sumber Buku <i class="fa-solid fa-arrow-up-right-from-square nav-ext-icon"></i>
  </a>
  <a href="https://murid.kemendikdasmen.go.id/latihan-soal" target="_blank" rel="noopener noreferrer" class="nav-btn external-link">
    <i class="fa-solid fa-pen-to-square"></i> Latihan <i class="fa-solid fa-arrow-up-right-from-square nav-ext-icon"></i>
  </a>
  <button class="nav-btn" onclick="openUserGuideModal()"><i class="fa-solid fa-book-open-reader"></i> Panduan Pengguna</button>
  <button class="nav-btn admin-btn" onclick="openAdminPinModal()"><i class="fa-solid fa-lock"></i> Masuk Admin</button>
</div>
```
- Menambahkan styling responsif CSS:
  - `.external-link`: tampilan visual konsisten dengan tombol nav lain, tidak ada garis bawah (`text-decoration:none`), hover halus.
  - Pada layar laptop beresolusi sedang (992px–1200px), ukuran font dan padding nav-btn dioptimalkan agar tidak pecah/meluap.
  - Pada layar mobile (< 992px), link-link ini hadir terstruktur rapi di dalam drawer mobile `#mobileNavMenu`.

---

## 6. Mitigasi Risiko & Rollback
- **Ukuran Payloads / Performa**: 144 objek materi berukuran total ~150 KB JSON, sangat ringan dan cepat diakses di browser maupun Google Apps Script.
- **Cache LocalStorage**: Peningkatan `DATA_VERSION` dari `v1.6.4` ke `v1.7.0` memastikan browser pengguna lokal langsung me-refresh bank materi 144 item tanpa harus clear cache manual.
- **Rollback Plan**: Riwayat Git tersimpan bersih di commit master; rollback dapat dilakukan secara instan via Git checkout jika terdapat ketidaksesuaian.

---

## 7. Rencana Verifikasi Teknis (QA)
1. **Verifikasi Sintaks**: Syntax linting pada `Code.gs` dan `index.html` menggunakan `node -c` atau AST parsing.
2. **Uji Filter Kategori & Kelas**:
   - Klik Kategori Science -> Total muncul 36 materi.
   - Klik Kelas 1 -> Terpilih 6 materi Science Kelas 1.
   - Klik Kelas 4 -> Terpilih 6 materi Science Kelas 4.
   - Ganti ke Technology, Engineering, Mathematics -> Masing-masing terbukti menampilkan 6 materi per kelas.
3. **Uji Tautan Navbar**:
   - Klik "Sumber Belajar" -> Membuka `https://murid.kemendikdasmen.go.id/sumber-belajar` di tab baru.
   - Klik "Sumber Buku" -> Membuka `https://buku.kemendikdasmen.go.id/katalog` di tab baru.
   - Klik "Latihan" -> Membuka `https://murid.kemendikdasmen.go.id/latihan-soal` di tab baru.
   - Uji klik tombol hamburger pada mobile view -> Memastikan menu terbuka rapi dan link eksternal dapat diakses.
4. **Uji Modal Panduan Pengguna**:
   - Membuka modal dan memverifikasi tab Siswa, Guru, Orang Tua, dan FAQ memuat informasi terintegrasi dengan benar.

