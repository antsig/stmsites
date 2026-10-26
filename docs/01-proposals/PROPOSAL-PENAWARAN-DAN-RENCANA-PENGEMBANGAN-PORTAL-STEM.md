# 📑 DOKUMEN SPESIFIKASI TEKNIS & PROPOSAL PENAWARAN SISTEM
## SISTEM PORTAL PEMBELAJARAN STEM SEKOLAH BERBASIS GOOGLE APPS SCRIPT (GAS)
### Versi Rilis: v1.4.3 (Ready-to-Use Production System)

---

**Nomor Dokumen**: `PROP-STEM/2026/X/002-REV1`  
**Tanggal**: 26 Oktober 2026  
**Status**: Proposal Resmi & Dokumen Spesifikasi Sistem Siap Pakai  
**Disusun Oleh**: Tim Rekayasa Perangkat Lunak & Konsultan EdTech (Virtual Engineering Team)  
**Ditujukan Kepada**: Pimpinan / Kepala Sekolah & Tim Pengembang Kurikulum STEM  

---

## Executive Summary

Penerapan pendekatan **STEM (*Science, Technology, Engineering, Mathematics*)** di jenjang pendidikan dasar menjadi kunci dalam membangun nalar kritis, kreativitas, dan literasi digital peserta didik sejak dini. Namun, kendala utama yang kerap dihadapi sekolah adalah **tingginya biaya sewa server bulanan (*VPS / Cloud Hosting*)**, kerumitan instalasi aplikasi, serta kebutuhan tim teknis khusus untuk pemeliharaan rutin.

**Portal Pembelajaran STEM Sekolah Berbasis Google Apps Script (GAS)** hadir sebagai solusi komprehensif yang telah selesai dikembangkan dan siap pakai (*production-ready*):

1. **Biaya Infrastruktur Rp 0,- (Zero Server Cost Selamanya)**:  
   Berjalan 100% di atas komputasi awan Google Cloud Platform menggunakan akun Google Workspace institusi sekolah, dengan Google Sheets sebagai pangkalan data awan. Bebas biaya sewa server, domain, maupun database bulanan.
2. **Akses Instan Tanpa Instalasi (*Ultra-Fast Web App*)**:  
   Dapat diakses langsung melalui peramban web (*browser*) di smartphone, tablet, laptop, maupun Chromebook tanpa perlu mengunduh aplikasi dari Google Play Store atau Apple App Store.
3. **Pengelolaan Mandiri & Ramah Guru**:  
   Seluruh konten materi praktikum, identitas sekolah, logo instansi, serta tautan video dan simulasi dikelola dengan sangat mudah melalui Dashboard Admin visual atau langsung via *spreadsheet* Google Sheets yang sudah akrab bagi para pendidik.
4. **Desain Mobile-First & Ergonomis**:  
   Antarmuka beranda mengadopsi formasi 2 kolom kartu STEM yang seimbang di ponsel, filter 1 baris kompak, serta penempatan tombol aksi di bawah formulir demi kemudahan jangkauan jempol pengguna di perangkat bergerak.

Dokumen ini memaparkan **Spesifikasi Teknis Sistem Saat Ini (v1.4.3)**, **Ruang Lingkup Aplikasi (*Scope of Work*)**, **Rincian Estimasi Biaya Berdasarkan Peran & Fitur (Anggaran Rp 3.500.000,-)**, serta **Alur Pelaksanaan dan Serah Terima Sistem**.

---

## 1. Arsitektur Sistem & Spesifikasi Komponen

### 1.1 Struktur Arsitektur Google Apps Script (GAS)
Aplikasi dibangun menggunakan arsitektur modular murni Google Apps Script tanpa dependensi berkas `.css` atau `.js` eksternal terpisah (memenuhi regulasi resmi lingkungan Google Apps Script):

```mermaid
graph TD
    subgraph ClientLayer["Frontend Client Layer (Smartphone / Tablet / PC)"]
        UI["index.html<br>(Portal Siswa & Single Page Shell)"]
        ADMIN["admin.html<br>(Dashboard Manajemen Guru)"]
        CSS["styles.html<br>(Universal Responsive CSS)"]
        JS["scripts.html<br>(Interactivity, Filter, & State Engine)"]
    end

    subgraph BackendLayer["Google Apps Script Engine (Serverless - Rp 0 / Bulan)"]
        ROUTER["Code.gs: doGet(e)<br>Page Router: index / admin"]
        INIT["initDatabaseIfEmpty()<br>Otomatisasi Struktur Sheet"]
        CRUD["API Servis Materi & Pengaturan Sekolah"]
        PIN_SEC["PIN Verification Engine (Enkripsi Akses)"]
    end

    subgraph DataLayer["Pangkalan Data Google Workspace Institusi"]
        SHEET_SET[("Google Sheets: 'Settings'<br>Nama, Slogan, Logo, Kontak, PIN")]
        SHEET_MAT[("Google Sheets: 'Materi'<br>8 Kolom Metadata Materi STEM")]
        GDRIVE[("Google Drive Institusi<br>Hosting Media, Video, & Thumbnail")]
    end

    UI --> ROUTER
    ADMIN --> PIN_SEC
    PIN_SEC --> ROUTER
    ROUTER --> INIT
    ROUTER --> CRUD
    CRUD <--> SHEET_SET
    CRUD <--> SHEET_MAT
    UI -.-> GDRIVE
```

### 1.2 Struktur Berkas Proyek (*Deliverable Files*)

Platform terdiri atas 5 berkas inti yang terstruktur secara bersih:

| No | Nama Berkas | Peran & Fungsi Utama |
|:---:|---|---|
| 1 | **`Code.gs`** | Backend Google Apps Script: menangani routing web app (`doGet`), inisialisasi pangkalan data Google Sheets otomatis, CRUD materi, verifikasi keamanan PIN Admin, dan sinkronisasi data pengaturan. |
| 2 | **`index.html`** | Halaman muka portal siswa: menampilkan identitas sekolah, formasi 2 kolom kartu STEM, selektor jenjang kelas, dan modal misi eksplorasi praktikum interaktif. |
| 3 | **`styles.html`** | Sistem desain visual terpadu: palet warna HSL modern, formasi 2 kolom mobile, filter 1 baris kompak, topbar admin 1 baris, dan isolasi responsif bebas horizontal overflow. |
| 4 | **`admin.html`** | Dashboard admin guru mandiri (*standalone-ready*): autentikasi PIN, manajemen materi STEM, kustomisasi logo & profil sekolah, panduan deploy, dan penampil kode sumber. |
| 5 | **`scripts.html`** | Mesin interaktivitas klien: penanganan filter kelas, pencarian real-time, validasi formulir, integrasi Google Script Run API, dan fallback penyimpanan lokal (*cache*). |

---

## 2. Ruang Lingkup Aplikasi (*Scope of Work*)

Untuk memberikan kepastian batasan teknis dan hasil kerja (*deliverables*), ruang lingkup aplikasi dirumuskan secara tegas:

```mermaid
graph LR
    subgraph InScope["Ruang Lingkup Termasuk (IN-SCOPE)"]
        I1["Portal Siswa: 4 Pilar STEM, 2 Kolom Mobile, Filter Kelas 1-6"]
        I2["Modal Misi Eksplorasi: Panduan Praktikum, Video, Simulasi PhET/Blockly"]
        I3["Dashboard Admin Guru: PIN Guard, CRUD Materi, Filter 1 Baris"]
        I4["Ergonomi Mobile: Topbar 1 Baris, Tombol Aksi di Bawah Form"]
        I5["Kustomisasi: Logo Sekolah & Logo 4 STEM dengan Live Preview"]
        I6["Pusat Panduan Deploy: Panduan 7 Langkah & Penampil 5 Berkas"]
        I7["Dual Mode: Online Google Apps Script & Offline Standalone"]
        I8["Instalasi Akun Sekolah, Input Materi Awal, Pelatihan & Garansi 3 Bulan"]
    end

    subgraph OutScope["Di Luar Ruang Lingkup (OUT-OF-SCOPE)"]
        O1["Pengadaan Perangkat Keras Fisik (Smartphone, Laptop, Tablet Siswa)"]
        O2["Penyediaan Koneksi Internet / Jaringan Wi-Fi Sekolah"]
        O3["Integrasi Sistem Pembayaran Berbayar (Payment Gateway)"]
        O4["Modifikasi Akun Domain Berbayar Pihak Ketiga di Luar Google"]
    end
```

### 2.1 Batasan Pekerjaan Termasuk (*In-Scope Deliverables*)
1. **Modul Portal Pembelajaran Siswa**:
   - Tampilan beranda interaktif dengan kartu 4 pilar STEM (Science, Technology, Engineering, Mathematics) formasi 2 kolom ponsel.
   - Selektor jenjang kelas (*Grade-Locking Mechanism*) Kelas 1 hingga Kelas 6 SD.
   - Jendela modal misi eksplorasi (Tujuan Pembelajaran, Langkah Praktikum, Tautan Media Video & Simulasi PhET/Blockly/Games, serta Refleksi).
2. **Modul Dashboard Manajemen Guru & Keamanan**:
   - Autentikasi PIN Keamanan Admin (PIN demo default `123456` dan fitur ganti PIN baru).
   - Topbar admin terkunci 1 baris horizontal (*single-row no-wrap*) di ponsel.
   - Manajemen Konten Sub-Card Materi STEM (CRUD: Tambah, Edit, Hapus) dengan filter tabel 1 baris kompak.
   - Penempatan tombol aksi di bawah formulir/filter (*thumb-zone ergonomics*).
   - Kustomisasi profil sekolah (Nama, Tahun Ajaran, Slogan, No. WhatsApp Bantuan) dan logo sekolah serta logo khusus 4 pilar STEM dengan *Live Preview*.
3. **Pusat Penerapan Mandiri (*Self-Deployment Hub*)**:
   - Panduan 7 langkah deploy langsung di panel admin.
   - Penampil kode sumber interaktif (*Interactive Code Viewer*) untuk 5 berkas sumber dengan tombol salin 1-klik (*copy to clipboard*).
4. **Layanan Pemasangan, Pelatihan & Garansi**:
   - Pemasangan langsung (*setup/deployment*) ke akun Google resmi sekolah.
   - Konfigurasi pangkalan data Google Sheets sekolah.
   - Input data materi awal kurikulum STEM sekolah (24 materi lengkap Kelas 1–6 SD Kemdikbud).
   - 1 sesi pelatihan daring bagi guru dan staf IT sekolah (durasi 2 jam).
   - Masa garansi perbaikan bebas bug (*free bug-fixing*) selama 3 bulan penuh.

### 2.2 Batasan di Luar Pekerjaan (*Out-of-Scope*)
- Pengadaan perangkat keras fisik (*hardware*) seperti smartphone, tablet, komputer, atau proyektor.
- Penyediaan paket kuota data internet atau infrastruktur jaringan Wi-Fi sekolah.
- Integrasi sistem pembayaran komersial / *payment gateway* (portal dirancang murni non-komersial untuk edukasi siswa).

---

## 3. Rincian Estimasi Biaya Berdasarkan Peran & Fitur

Struktur estimasi investasi dirancang secara transparan, akuntabel, dan terukur dengan mengintegrasikan peran teknis spesialis, fitur yang dikerjakan, dan uraian tugas konkret, dengan **Total Anggaran Tetap: Rp 3.500.000,- (Tiga Juta Lima Ratus Ribu Rupiah)**:

| PERAN TEKNIS | FITUR YANG DIKERJAKAN | URAIAN PEKERJAAN | BIAYA (RP) |
|---|---|---|:---:|
| **UI/UX & Frontend Developer** | **Portal Siswa & Antarmuka Responsif Mobile** | • Pembuatan antarmuka visual beranda ramah anak dengan kartu 4 pilar STEM (Science, Technology, Engineering, Mathematics).<br>• Desain kartu interaktif formasi 2 kolom proporsional pada layar ponsel (*mobile-friendly*).<br>• Perancangan selektor jenjang kelas (*Grade-Locking Mechanism*) Kelas 1–6 SD.<br>• Pembuatan jendela modal misi eksplorasi praktikum interaktif (Tujuan, Langkah Praktikum, Tautan Video, Simulasi PhET/Blockly/Games, dan Refleksi).<br>• Optimasi tipografi dan tata letak universal responsif bebas *horizontal overflow*. | **1.200.000** |
| **Backend & Script Engineer** | **Dashboard Admin Guru, Alur Data & Keamanan PIN** | • Penulisan skrip backend Google Apps Script (`Code.gs`) dengan V8 runtime engine.<br>• Pembuatan dashboard admin guru terpadu dengan autentikasi proteksi PIN Keamanan (`123456` dan kustomisasi PIN baru).<br>• Mekanisme manajemen konten sub-card materi STEM (CRUD: Tambah, Edit, Hapus) terhubung Google Sheets.<br>• Optimasi topbar admin mobile terkunci 1 baris (*no-wrap*) dan filter tabel 1 baris kompak.<br>• Penataan tombol aksi di bawah formulir (*thumb-zone ergonomics*) untuk kemudahan sentuh di ponsel.<br>• Penanganan CORS-free untuk mode luring mandiri (*standalone*). | **1.350.000** |
| **Data & EdTech Specialist** | **Integrasi Google Sheets, Kustomisasi & Kurasi STEM** | • Perancangan struktur database Google Sheets (`Settings` & `Materi`) dan inisialisasi tabel otomatis.<br>• Pembuatan formulir kustomisasi nama sekolah, slogan, kontak WhatsApp, dan logo sekolah serta 4 logo pilar STEM dengan *Live Preview* real-time.<br>• Kurasi dan input 24 data materi kurikulum STEM SD Kemdikbud lengkap (Kelas 1–6) terhubung ke simulasi resmi PhET, NASA Eyes, Google Earth, BioDigital, Scratch, Code.org, Tinkercad, Cargo Bridge, GeoGebra, Mathigon Polypad, dan Matific.<br>• Optimasi tautan hosting aset dan thumbnail di Google Drive sekolah. | **550.000** |
| **QA Specialist & Deployment Facilitator** | **Pengujian Sistem, Panduan Deploy & Pelatihan Guru** | • Pengujian fungsionalitas menyeluruh dan kompatibilitas lintas peramban/perangkat (Android, iOS, PC).<br>• Pembuatan modul *Interactive Code Viewer* 5 berkas proyek (`Code.gs`, `index.html`, `styles.html`, `admin.html`, `scripts.html`) dengan tombol salin 1-klik.<br>• Penyusunan dokumen panduan penerapan 7 langkah (*Deployment Guide*) dan buku petunjuk operasional guru (*User Manual*).<br>• Pelaksanaan 1 sesi pelatihan daring bagi guru dan staf IT sekolah (durasi 2 jam) serta pendampingan masa garansi 3 bulan. | **400.000** |
| **TOTAL (GOOGLE APPS SCRIPT READY-TO-USE)** | | | **Rp3.500.000** |

---

### 3.3 Skema Jadwal Pembayaran (*Payment Terms*)

Pembayaran dibagi ke dalam 2 termin yang seimbang dan transparan:

```mermaid
graph LR
    A["Persetujuan Proposal / SPK"] -->|"Termin I: DP 50%<br>(Rp 1.750.000,-)"| B["Pemasangan Akun Sekolah & Input Materi"]
    B -->|"Verifikasi UAT & Pelatihan Guru"| C["Serah Terima 100% & Hak Akses Penuh"]
    C -->|"Termin II: Pelunasan 50%<br>(Rp 1.750.000,-)"| D["Go-Live & Masa Garansi 3 Bulan"]
```

1. **Termin I (Uang Muka / Down Payment - 50%)**:  
   Sebesar **Rp 1.750.000,-** dibayarkan saat penandatanganan lembar persetujuan proposal / penerbitan Surat Perintah Kerja (SPK).
2. **Termin II (Pelunasan Akhir - 50%)**:  
   Sebesar **Rp 1.750.000,-** dibayarkan setelah seluruh sistem berhasil terpasang di akun Google sekolah, berfungsi 100%, dan sesi pelatihan daring guru selesai dilaksanakan.

---

## 4. Analisis Efisiensi Biaya (TCO - Total Cost of Ownership)

Perbandingan pengeluaran operasional infrastruktur sistem Portal STEM berbasis Google Apps Script dibandingkan sistem web konvensional selama 3 tahun operasional:

```mermaid
graph LR
    subgraph Konvensional["Aplikasi Web Konvensional (PHP / Laravel / Node.js)"]
        K1["Sewa Cloud Server / VPS: Rp 350.000 x 36 bln = Rp 12.600.000"]
        K2["Sewa Domain & SSL: Rp 250.000 x 3 thn = Rp 750.000"]
        K3["Jasa Maintenance Server IT: Rp 500.000 x 36 bln = Rp 18.000.000"]
        K_TOTAL["Total Biaya 3 Tahun: ~Rp 31.350.000,-"]
    end

    subgraph SolusiGAS["Solusi Portal STEM Google Apps Script (v1.4.3)"]
        G1["Biaya Server: Rp 0,- (Gratis Selamanya dari Google Cloud)"]
        G2["Biaya Database: Rp 0,- (Google Sheets Cloud Institusi)"]
        G3["Biaya Domain/Hosting: Rp 0,- (Google Apps Script Web App Endpoint)"]
        G_TOTAL["Total Biaya Operasional 3 Tahun: Rp 0,- (Hemat 100%)"]
    end
```

> **Keuntungan Finansial Institusi**: Memilih arsitektur Google Apps Script mengeliminasi 100% beban biaya operasional server, menghemat kas sekolah **lebih dari Rp 30.000.000,-** selama 3 tahun masa pakai. Total investasi Rp 3.500.000,- adalah biaya satu kali (*one-time fee*) tanpa biaya bulanan apa pun ke depannya.

---

## 5. Alur Pelaksanaan & Serah Terima (*Onboarding Workflow*)

Karena perangkat lunak telah selesai dibangun dan teruji (v1.4.3), proses penerapan hingga peluncuran (*go-live*) di sekolah dapat diselesaikan dalam waktu **2 hingga 3 hari kerja**:

```
Hari ke-1: Penyelarasan & Penyiapan Akun
├── Kick-off singkat via daring bersama perwakilan sekolah
├── Penerimaan data identitas sekolah (Nama, Slogan, Logo, Nomor WhatsApp Bantuan)
└── Penyiapan Google Spreadsheet dan Google Drive di akun Google sekolah

Hari ke-2: Deployment & Kustomisasi
├── Pemasangan skrip backend Code.gs dan berkas HTML di Google Apps Script sekolah
├── Konfigurasi hak akses web app (*Anyone with Google Account / Anyone*)
├── Input 24 materi praktikum kurikulum STEM SD lengkap dan pengujian fungsi tombol/simulasi
└── Penyesuaian PIN Admin sesuai permintaan pihak sekolah

Hari ke-3: Verifikasi Bersama & Pelatihan
├── Uji coba akses dari peramban smartphone guru dan siswa
├── Sesi pelatihan daring guru mengenai tata cara tambah/edit materi di dashboard admin
├── Penyerahan dokumen panduan operasional resmi dan repositori berkas
└── Peluncuran resmi (*Go-Live*) kepada siswa sekolah
```

---

## 6. Syarat & Ketentuan Layanan (*Service Terms*)

1. **Kebutuhan Teknis Pihak Sekolah**:
   - 1 Akun Google / Google Workspace for Education resmi sekolah (gratis dari Google / Kemendikbudristek).
   - Berkas logo resmi sekolah (PNG/JPG) dan daftar kontak bantuan.
2. **Jaminan Kualitas & Garansi (SLA)**:
   - Jaminan perbaikan bebas biaya (*free bug-fixing*) selama 3 bulan terhitung sejak tanggal *go-live*.
   - Hak kepemilikan data 100% berada di bawah kendali akun Google resmi sekolah tanpa perantara pihak ketiga.
   - Bantuan konsultasi teknis operasional melalui grup WhatsApp khusus.

---

## 7. Lampiran: Katalog 24 Materi Kurikulum STEM SD (Kemdikbud Kelas 1–6)

Setiap materi telah diverifikasi aktif (HTTP 200 OK), bebas biaya (*open access*), dan diselaraskan dengan Capaian Pembelajaran (CP) Kurikulum Merdeka Kemdikbudristek:

| ID | Kategori | Jenjang | Judul Materi Praktikum & Misi | Platform Edukasi | Tautan Aktif Terverifikasi |
|:---:|:---:|:---:|---|---|---|
| **STEM-SCI01** | Science | Kelas 1 | Eksplorasi Anatomi Tubuh 3D & 5 Panca Indra | BioDigital Human 3D | [human.biodigital.com](https://human.biodigital.com/) |
| **STEM-SCI02** | Science | Kelas 2 | Percobaan Listrik Statis Balon & Sweater Ajaib | PhET Interactive Simulations | [phet.colorado.edu/.../balloons](https://phet.colorado.edu/sims/html/balloons-and-static-electricity/latest/balloons-and-static-electricity_all.html) |
| **STEM-SCI03** | Science | Kelas 3 | Eksplorasi Wujud Zat: Padat, Cair, dan Gas | PhET Interactive Simulations | [phet.colorado.edu/.../states-of-matter](https://phet.colorado.edu/sims/html/states-of-matter-basics/latest/states-of-matter-basics_all.html) |
| **STEM-SCI04** | Science | Kelas 4 | Rahasia Fotosintesis: Mengapa Daun Berwarna Hijau? | PhET Interactive Simulations | [phet.colorado.edu/.../molecules-and-light](https://phet.colorado.edu/sims/html/molecules-and-light/latest/molecules-and-light_all.html) |
| **STEM-SCI05** | Science | Kelas 5 | Virtual Tour Gunung Berapi & Kerak Bumi | Google Earth 3D | [earth.google.com/.../Volcanoes](https://earth.google.com/web/search/Volcanoes) |
| **STEM-SCI06** | Science | Kelas 6 | Menjelajah Tata Surya & Orbit Planet Antariksa | NASA Eyes on the Solar System | [eyes.nasa.gov/apps/solar-system](https://eyes.nasa.gov/apps/solar-system/) |
| **STEM-TEC01** | Technology | Kelas 1 | Bermain AI Ceria: Mesin Cerdas Penebak Gambar | Google Quick, Draw! AI | [quickdraw.withgoogle.com](https://quickdraw.withgoogle.com/) |
| **STEM-TEC02** | Technology | Kelas 2 | Logika Algoritma Labirin: Memandu Karakter | Blockly Games Maze | [blockly.games/maze](https://blockly.games/maze) |
| **STEM-TEC03** | Technology | Kelas 3 | Animasi Kartun Perdanaku: Gerak Kucing Scratch | MIT Scratch Editor | [scratch.mit.edu/projects/editor](https://scratch.mit.edu/projects/editor/) |
| **STEM-TEC04** | Technology | Kelas 4 | Coding Petualangan Karakter Minecraft | Code.org Minecraft Journey | [code.org/minecraft](https://code.org/minecraft) |
| **STEM-TEC05** | Technology | Kelas 5 | Desain Rumah 3D Digital di Browser | Autodesk Tinkercad 3D | [www.tinkercad.com](https://www.tinkercad.com/) |
| **STEM-TEC06** | Technology | Kelas 6 | Game Edukasi Interaktif Multi-Level di Scratch | MIT Scratch Editor | [scratch.mit.edu/projects/editor](https://scratch.mit.edu/projects/editor/) |
| **STEM-ENG01** | Engineering | Kelas 1 | Keseimbangan Menara Balok & Jungkat-Jungkit | PhET Interactive Simulations | [phet.colorado.edu/.../balancing-act](https://phet.colorado.edu/sims/html/balancing-act/latest/balancing-act_all.html) |
| **STEM-ENG02** | Engineering | Kelas 2 | Desain Perahu Apung Anti Tenggelam (Hukum Apung) | PhET Interactive Simulations | [phet.colorado.edu/.../buoyancy](https://phet.colorado.edu/sims/html/buoyancy/latest/buoyancy_all.html) |
| **STEM-ENG03** | Engineering | Kelas 3 | Pesawat Sederhana: Katrol, Tuas & Bidang Miring | PhET Interactive Simulations | [phet.colorado.edu/.../forces-basics](https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html) |
| **STEM-ENG04** | Engineering | Kelas 4 | Arsitektur Jembatan Rangka Baja Penahan Beban | Cargo Bridge Civil Physics | [armorgames.com/.../cargo-bridge](https://armorgames.com/play/4962/cargo-bridge) |
| **STEM-ENG05** | Engineering | Kelas 5 | Laboratorium Sirkuit Listrik Rumah Pintar | PhET Interactive Simulations | [phet.colorado.edu/.../circuit-dc](https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_all.html) |
| **STEM-ENG06** | Engineering | Kelas 6 | Rancang Bangun Sekolah Ramah Lingkungan | Minecraft Education Edition | [education.minecraft.net](https://education.minecraft.net/) |
| **STEM-MAT01** | Mathematics | Kelas 1 | Eksplorasi Bentuk Geometri & Sudut Ceria | GeoGebra Geometry Suite | [www.geogebra.org/geometry](https://www.geogebra.org/geometry) |
| **STEM-MAT02** | Mathematics | Kelas 2 | Eksplorasi Tangram 2D & Jam Dinding Virtual | Mathigon Polypad Tangram | [mathigon.org/polypad#tangram](https://mathigon.org/polypad#tangram) |
| **STEM-MAT03** | Mathematics | Kelas 3 | Pecahan Visual Warna-Warni: Pizza & Balok | PhET Interactive Simulations | [phet.colorado.edu/.../fractions-intro](https://phet.colorado.edu/sims/html/fractions-intro/latest/fractions-intro_all.html) |
| **STEM-MAT04** | Mathematics | Kelas 4 | Merancang Luas & Keliling Taman Interaktif | PhET Interactive Simulations | [phet.colorado.edu/.../area-builder](https://phet.colorado.edu/sims/html/area-builder/latest/area-builder_all.html) |
| **STEM-MAT05** | Mathematics | Kelas 5 | Logika Bilangan & Game Matematika Matific | Matific Math Learning | [www.matific.com](https://www.matific.com/) |
| **STEM-MAT06** | Mathematics | Kelas 6 | Bangun Ruang 3D & Jaring-Jaring Kubus Virtual | Mathigon Polypad 3D Solids | [mathigon.org/polypad#solids](https://mathigon.org/polypad#solids) |

---

## 8. Lembar Konfirmasi & Persetujuan

Untuk menyetujui proposal spesifikasi teknis dan penawaran harga ini, silakan mengisi lembar persetujuan di bawah ini atau memberikan surat konfirmasi balasan resmi:

| Disetujui Oleh (Pihak Sekolah) | Diajukan Oleh (Tim Pengembang) |
|---|---|
| <br><br><br>____________________________________<br>Nama: <br>Jabatan: <br>Tanggal: | <br><br><br>____________________________________<br>Nama: **Lead Solution Architect**<br>Jabatan: **Lead EdTech Consultant**<br>Tanggal: 26 Oktober 2026 |

---
*Dokumen ini disusun dengan mengedepankan efisiensi anggaran institusi pendidikan, keandalan komputasi awan Google Workspace, dan kemudahan akses belajar bagi seluruh siswa.*
