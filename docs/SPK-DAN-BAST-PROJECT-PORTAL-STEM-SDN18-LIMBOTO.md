# SURAT PERJANJIAN KERJA (SPK) & BERITA ACARA SERAH TERIMA (BAST)
## PENGEMBANGAN SISTEM PORTAL PEMBELAJARAN STEM SEKOLAH BERBASIS GOOGLE APPS SCRIPT (GAS)

---

**Nomor Kontrak**: `028/SPK-STEM/SDN18-LMB/X/2026`  
**Lampiran**: Berita Acara Serah Terima (BAST) & Lampiran Ruang Lingkup  
**Tanggal**: 26 Oktober 2026  

Pada hari ini, **Senin** tanggal **Dua Puluh Enam** bulan **Oktober** tahun **Dua Ribu Dua Puluh Enam** (26-10-2026), bertempat di Limboto, Kabupaten Gorontalo, telah dibuat dan ditandatangani Surat Perjanjian Kerja (selanjutnya disebut **"Perjanjian"**) oleh dan antara:

1. **Nama Lembaga** : **SD NEGERI 18 LIMBOTO**  
   **Alamat** : Jl. Kayubulan, Limboto, Kabupaten Gorontalo, Gorontalo  
   **Dalam hal ini diwakili oleh** : **[Nama Kepala Sekolah / Pejabat Pembuat Komitmen]**  
   **Jabatan** : Kepala Sekolah SD Negeri 18 Limboto  
   Bertindak untuk dan atas nama SD Negeri 18 Limboto, yang selanjutnya dalam Perjanjian ini disebut sebagai **PIHAK PERTAMA**.

2. **Nama Tim / Penyedia** : **TIM PENGEMBANG SISTEM INFORMATIKA & KONSULTAN EDTECH**  
   **Alamat** : Gorontalo  
   **Dalam hal ini diwakili oleh** : **[Nama Lead Developer / Solution Architect]**  
   **Jabatan** : Lead Software Engineer & EdTech Consultant  
   Bertindak untuk dan atas nama Tim Pengembang Sistem Informasi Edukasi, yang selanjutnya dalam Perjanjian ini disebut sebagai **PIHAK KEDUA**.

PIHAK PERTAMA dan PIHAK KEDUA secara bersama-sama selanjutnya disebut sebagai **PARA PIHAK**, dan masing-masing disebut **PIHAK**. 

PARA PIHAK terlebih dahulu menerangkan hal-hal sebagai berikut:
- Bahwa PIHAK PERTAMA memerlukan aplikasi pembelajaran digital interaktif berbasis pendekatan STEM (*Science, Technology, Engineering, Mathematics*) yang efisien, modern, ramah anak, dan bebas biaya server bulanan untuk menunjang Kurikulum Merdeka di lingkungan SD Negeri 18 Limboto;
- Bahwa PIHAK KEDUA memiliki keahlian, pengalaman, dan kapabilitas teknis dalam merancang dan mengembangkan aplikasi web berbasis arsitektur *cloud serverless* Google Apps Script (GAS) dan database Google Sheets;

Maka, berdasarkan pertimbangan tersebut di atas, PARA PIHAK sepakat untuk membuat dan menandatangani Surat Perjanjian Kerja dengan ketentuan dan syarat-syarat yang diatur dalam pasal-pasal berikut:

---

### PASAL 1  
### KETENTUAN UMUM  

1. **Portal Pembelajaran STEM SD Negeri 18 Limboto** adalah aplikasi perangkat lunak berbasis web (*Single Page Application* / SPA) yang dibangun di atas arsitektur *cloud serverless* **Google Apps Script (GAS)** dengan pangkalan data awan **Google Sheets** dan media hosting **Google Drive** institusi sekolah.
2. Aplikasi ini berfungsi sebagai:
   - Media pembelajaran dan praktikum digital interaktif resmi bagi peserta didik Kelas 1 sampai Kelas 6 Sekolah Dasar pada 4 pilar utama: *Science* (Sains), *Technology* (Teknologi), *Engineering* (Rekayasa Teknik), dan *Mathematics* (Matematika).
   - Sarana integrasi referensi pendidikan resmi nasional Kementerian Pendidikan Dasar dan Menengah (Kemendikdasmen).
   - Portal Manajemen Konten Mandiri (*Content Management System* / CMS) terproteksi PIN bagi guru koordinator dan administrator sekolah untuk mengelola data materi, identitas instansi, dan konfigurasi portal tanpa perlu memodifikasi kode program.
3. Aplikasi ini mengusung prinsip **Zero Hosting Cost Selamanya (Biaya Server Rp 0,-)** karena sepenuhnya berjalan di atas kuota komputasi awan Google Cloud / Google Workspace institusi sekolah tanpa membutuhkan sewa server VPS, hosting, atau database eksternal berbayar.

---

### PASAL 2  
### TUJUAN KERJASAMA  

Tujuan kerjasama pengembangan sistem ini adalah untuk mewujudkan portal pembelajaran digital terstandar yang:
1. **Mempermudah Peserta Didik dan Guru**: Membuka akses belajar mandiri materi STEM berjenjang (Fase A, B, dan C SD) secara mudah, menyenangkan, dan adaptif di berbagai perangkat (*smartphone*, tablet, laptop, Chromebook) tanpa kendala instalasi.
2. **Menyediakan Laboratorium Maya Bebas Hambatan (100% Zero-Login)**: Menyajikan modul simulasi sains, coding visual, eksperimen rekayasa, dan manipulatif matematika interaktif kelas dunia (PhET Interactive Simulations, Blockly Games, Scratch MIT, GeoGebra, Mathigon Polypad, Google Earth, NASA Eyes) yang dapat diakses langsung tanpa registrasi akun atau login siswa.
3. **Mengintegrasikan Sumber Belajar Resmi Kemendikdasmen**: Menyediakan akses terpadu ke portal Sumber Belajar, Katalog Sumber Buku resmi kurikulum, dan bank Latihan Soal mandiri Kementerian Pendidikan Dasar dan Menengah langsung di bilah navigasi utama.
4. **Memberikan Kemandirian Pengelolaan bagi Guru (CMS Terintegrasi)**: Menyediakan *Content Management System* (CMS) berbasis PIN yang aman, intuitif, dan responsif untuk mengelola 144 materi kurikulum, memperbarui kontak bantuan sekolah, mengganti logo instansi, serta memutakhirkan pangkalan data Google Sheets secara instan.

---

### PASAL 3  
### RUANG LINGKUP PEKERJAAN  

1. **Spesifikasi Teknologi Sistem**:
   - Arsitektur: *Single Page Application* (SPA) Google Apps Script Web App Endpoint.
   - Pangkalan Data: Google Sheets (*Spreadsheet Relasional*: Sheet `Settings` dan Sheet `Materi`).
   - Media & Aset: Google Drive institusi & CDN Publik Tepercaya (Font Awesome 6.5, Google Fonts Plus Jakarta Sans).
   - Desain Tampilan: *Universal Responsive & Mobile-First Design* (Vanilla CSS murni, tanpa dependensi framework luar yang memberatkan).
2. **Modul dan Fitur yang Dikembangkan**:
   - **a. Halaman Utama / Beranda Publik (Home View)**:
     - *Top Navigation Bar*: Identitas logo dan nama sekolah, tautan navigasi beranda, 3 tombol navigasi eksternal Kemendikdasmen (Sumber Belajar, Sumber Buku, Latihan Soal), tombol Panduan Pengguna, dan tombol Masuk Admin, lengkap dengan menu drawer responsif di perangkat mobile.
     - *Hero Banner & Identitas Sekolah Dinamis*: Penampil tahun ajaran aktif, slogan sekolah, dan lencana akreditasi/informasi yang tersinkronisasi otomatis dari sheet `Settings`.
     - *Grid 4 Card Utama STEM*: Kartu navigasi interaktif untuk *Science*, *Technology*, *Engineering*, dan *Mathematics* dilengkapi ikon tematik, deskripsi ramah anak, dan indikator jumlah materi aktif.
     - *Footer Informasi & Bantuan Sekolah*: Bagian profil sekolah, kontak WhatsApp bantuan guru, email institusi, jam operasional, alamat resmi, tautan eksternal kementerian, dan hak cipta.
   - **b. Subpage Eksplorasi Materi STEM Berjenjang**:
     - *Filter Jenjang Kelas Ramah Anak*: Tombol seleksi kelas (Kelas 1 s.d. 6 SD) dan opsi "Tampilkan Semua Kelas".
     - *Filter Kompak & Pencarian*: Filter kategori tipe media (*Simulasi, Lab Maya, Video, Praktikum, Game*) serta pencarian kata kunci instan.
     - *Bank Data 144 Materi Kurikulum SD*: 6 sub-materi terkurasi untuk setiap kelas pada setiap pilar STEM ($6 \times 4 \times 6 = 144\text{ materi}$) yang siap dieksplorasi.
   - **c. Modal Eksplorasi Misi Pembelajaran**:
     - Penampil tujuan misi pembelajaran (*mission goals*), panduan langkah praktikum (*mission steps*), integrasi media simulasi 100% bebas login (*zero-login*), dan pertanyaan pemantik nalar kritis (*mission reflection*).
   - **d. Modal Panduan Pengguna (User Guide)**:
     - Panduan bertab khusus untuk **Siswa SD**, **Orang Tua / Wali**, **Guru Kelas**, dan **Tanya Jawab (FAQ)** seputar pengoperasian portal dan pemanfaatan tautan eksternal kementerian.
   - **e. Portal Manajemen Admin & Guru (CMS Ber-PIN)**:
     - *Sistem Autentikasi PIN Keamanan*: Validasi PIN terlindungi dengan fitur *Toggle Visibility* (Intip/Sembunyikan PIN) dan *auto-reset* keamanan saat modal ditutup.
     - *Panel Pengaturan Sekolah & Logo*: Pengaturan nama sekolah, slogan, tahun ajaran, kontak WhatsApp, email, dan URL logo (mendukung tautan langsung Google Drive).
     - *Manajemen Data Materi STEM*: Formulir tambah, edit, hapus, filter, dan pencarian sub-materi dengan validasi data.
     - *Fitur Auto-Seed & Sinkronisasi Massal*: Tombol pemuat ulang 144 materi kurikulum STEM SD ke Google Sheets secara otomatis.
     - *Panduan Deployment & Dokumentasi Kode Sumber*: Tab dokumentasi panduan deploy Google Apps Script lengkap di dalam admin.

---

### PASAL 4  
### HAK DAN KEWAJIBAN  

1. **Hak PIHAK PERTAMA**:
   - Memperoleh aplikasi web portal pembelajaran STEM yang berfungsi dengan baik, stabil, aman, dan berkinerja cepat sesuai spesifikasi pada Pasal 3.
   - Memperoleh hak kepemilikan penuh atas akun Google Apps Script, Google Spreadsheet database, dan seluruh data materi/sekolah yang dikembangkan.
   - Memperoleh kode sumber (*source code*) utuh tanpa enkripsi/obfuscation yang mengunci sistem.
   - Memperoleh bimbingan teknis (*transfer of knowledge*) dan petunjuk operasional pengelolaan portal bagi guru/admin yang ditunjuk.
   - Memperoleh jaminan garansi pemeliharaan dan perbaikan bebas biaya (*free bug-fixing*) selama 3 (tiga) bulan sejak tanggal serah terima.
2. **Kewajiban PIHAK PERTAMA**:
   - Menyediakan 1 (satu) Akun Google resmi sekolah (Google Workspace for Education / Gmail institusi) sebagai wadah hosting dan basis data aplikasi.
   - Menyediakan data pendukung sekolah meliputi berkas logo resmi, teks slogan, informasi kontak bantuan (WhatsApp & Email), serta alamat sekolah.
   - Melakukan pembayaran biaya pengembangan aplikasi kepada PIHAK KEDUA sesuai dengan nilai dan tahapan pembayaran yang disepakati pada Pasal 5.
3. **Hak PIHAK KEDUA**:
   - Menerima pembayaran biaya jasa pengembangan aplikasi secara penuh dan tepat waktu sesuai jadwal termin pada Pasal 5.
   - Menerima bahan, dokumen pendukung, dan konfirmasi persetujuan dari PIHAK PERTAMA yang diperlukan dalam proses pengerjaan.
   - Mencantumkan proyek ini ke dalam portofolio karya profesional PIHAK KEDUA tanpa mempublikasikan informasi rahasia sekolah.
4. **Kewajiban PIHAK KEDUA**:
   - Merancang, memprogram, menguji, dan menyerahkan aplikasi Portal STEM sesuai dengan seluruh ruang lingkup yang diatur pada Pasal 3.
   - Memastikan portal dapat diakses secara *zero server cost* di Google Apps Script, bebas galat (*zero runtime error*), responsif di semua ukuran layar ponsel/PC, dan 100% bebas hambatan login bagi siswa.
   - Menyelesaikan pekerjaan secara tepat waktu dalam batas waktu **3 (tiga) hari kerja**.
   - Melaksanakan sesi pelatihan/bimbingan teknis kepada operator atau guru pengelola yang ditunjuk oleh PIHAK PERTAMA.
   - Memberikan layanan perbaikan bug dan pendampingan konsultasi teknis selama masa garansi 3 bulan.

---

### PASAL 5  
### JANGKA WAKTU PELAKSANAAN DAN SISTEM PEMBIAYAAN  

1. **Jangka Waktu Pelaksanaan**:
   - Total durasi pengerjaan aplikasi ditetapkan selama **3 (tiga) hari kerja**, terhitung sejak ditandatanganinya Perjanjian ini dan diterimanya pembayaran Uang Muka (Termin 1).
   - Rincian tahapan pengerjaan 3 hari kerja:
     - **Hari ke-1 (Fondasi & Struktur Awal - Progres 50%)**:
       Penyusunan arsitektur Single Page Application (SPA) Google Apps Script, konfigurasi skema relasional Google Sheets (`Settings` dan `Materi`), perancangan antarmuka beranda ramah anak (4 pilar STEM), integrasi identitas dinamis sekolah, dan sinkronisasi responsive CSS mobile-first.
     - **Hari ke-2 (Modul Interaktif, Bank Materi & CMS - Progres 90%)**:
       Pembangunan halaman subpage eksplorasi materi, filter jenjang Kelas 1-6 SD, integrasi 3 tautan resmi Kemendikdasmen di navbar, penyusunan bank data 144 materi STEM bebas login (*zero-login*), pembuatan modal panduan pengguna, serta perakitan panel admin CMS ber-PIN dengan fitur intip sandi.
     - **Hari ke-3 (Testing, Deployment, BAST & Go-Live - Progres 100%)**:
       Pengujian kompatibilitas lintas perangkat (HP, Tablet, Laptop), verifikasi fungsi Google Apps Script Web App, uji sinkronisasi pangkalan data Google Sheets, bimbingan teknis bagi operator sekolah, penandatanganan Berita Acara Serah Terima (BAST), dan peluncuran resmi (*Go-Live*).
2. **Nilai Kontrak dan Total Biaya**:
   - Total biaya pengembangan sistem yang disepakati oleh PARA PIHAK adalah sebesar **Rp 3.500.000,- (Tiga Juta Lima Ratus Ribu Rupiah)**, bersifat tetap (*lump sum / fixed price*) dan sudah mencakup seluruh modul aplikasi, bank materi 144 kurikulum STEM, dokumentasi, bimbingan teknis, serta garansi 3 bulan.
3. **Tahapan Pembayaran**:
   Pembayaran dilakukan secara bertahap melalui transfer ke rekening resmi PIHAK KEDUA dengan ketentuan sebagai berikut:
   - **Termin 1 (Uang Muka / DP 30%)**:
     Sebesar **Rp 1.050.000,- (Satu Juta Lima Puluh Ribu Rupiah)**, dibayarkan oleh PIHAK PERTAMA selambat-lambatnya 3 (tiga) hari kerja setelah penandatanganan SPK ini sebagai komitmen dimulainya pekerjaan perancangan awal.
   - **Termin 2 (Pembayaran ke-2 / Progres 50% sebesar 20%)**:
     Sebesar **Rp 700.000,- (Tujuh Ratus Ribu Rupiah)**, dibayarkan setelah PIHAK KEDUA menyelesaikan tahap struktur awal aplikasi mencapai progres 50% (meliputi beranda aktif, integrasi Google Sheets, dan penyesuaian revisi awal yang diajukan).
   - **Termin 3 (Pelunasan Akhir 50%)**:
     Sebesar **Rp 1.750.000,- (Satu Juta Tujuh Ratus Lima Puluh Ribu Rupiah)**, dibayarkan setelah seluruh sistem selesai dikembangkan 100%, dinyatakan lulus uji fungsi, dan dokumen Berita Acara Serah Terima (BAST) ditandatangani oleh kedua belah pihak.

---

### PASAL 6  
### GARANSI, PEMELIHARAAN, DAN KELAIKAN SISTEM  

1. PIHAK KEDUA memberikan garansi teknis (*SLA Bug-Fixing*) selama **3 (tiga) bulan** terhitung sejak tanggal penandatanganan Berita Acara Serah Terima (BAST).
2. Ruang lingkup garansi meliputi perbaikan kesalahan program (*bug fixing*), penyesuaian formula pembacaan Google Sheets, serta pendampingan teknis jika terjadi kendala pada tautan media materi tanpa dikenakan biaya tambahan apa pun.
3. Garansi tidak mencakup kerusakan sistem yang diakibatkan oleh kelalaian penghapusan struktur kolom Spreadsheet secara sengaja oleh pihak luar, bencana alam (*force majeure*), atau perubahan kebijakan sepihak dari Google Cloud Platform.

---

### PASAL 7  
### PENYELESAIAN PERSELISIHAN  

1. Apabila timbul perselisihan dalam pelaksanaan Perjanjian ini, PARA PIHAK sepakat untuk menyelesaikan permasalahan tersebut secara musyawarah untuk mufakat.
2. Apabila penyelesaian secara musyawarah tidak mencapai mufakat, maka PARA PIHAK sepakat untuk menyelesaikannya melalui jalur hukum yang berlaku dengan memilih domisili hukum di Pengadilan Negeri Limboto.

---

### PASAL 8  
### PENUTUP  

Surat Perjanjian Kerja ini dibuat dan ditandatangani oleh PARA PIHAK dalam rangkap 2 (dua) asli bermaterai cukup, masing-masing memiliki kekuatan hukum yang sama dan berlaku efektif sejak tanggal ditandatangani.

---

<br>

| **PIHAK PERTAMA**<br>SD NEGERI 18 LIMBOTO | **PIHAK KEDUA**<br>TIM PENGEMBANG SISTEM STEM |
|:---:|:---:|
| <br><br><br>*(Meterai Rp 10.000,-)*<br><br><u>**[Nama Kepala Sekolah]**</u><br>NIP. ....................................................<br>Kepala Sekolah SD Negeri 18 Limboto | <br><br><br>*(Tanda Tangan & Cap)*<br><br><u>**[Nama Lead Developer]**</u><br>Lead Solution Architect & Consultant<br>Tim Pengembang Sistem Informasi |

<br><br>

---
---

<br>

# BERITA ACARA SERAH TERIMA (BAST) HASIL PEKERJAAN
## PENGEMBANGAN SISTEM PORTAL PEMBELAJARAN STEM SEKOLAH BERBASIS GOOGLE APPS SCRIPT (GAS)

**Nomor BAST**: `035/BAST-STEM/SDN18-LMB/X/2026`  
**Dasar SPK**: Surat Perjanjian Kerja Nomor `028/SPK-STEM/SDN18-LMB/X/2026` tanggal 26 Oktober 2026  

Pada hari ini, **Kamis** tanggal **Dua Puluh Sembilan** bulan **Oktober** tahun **Dua Ribu Dua Puluh Enam** (29-10-2026), bertempat di Kantor SD Negeri 18 Limboto, kami yang bertanda tangan di bawah ini:

1. **Nama** : **[Nama Lead Developer / Solution Architect]**  
   **Jabatan** : Lead Software Engineer & EdTech Consultant  
   Dalam hal ini bertindak untuk dan atas nama Tim Pengembang Sistem Informasi, yang selanjutnya disebut sebagai **PIHAK MENYERAHKAN (PIHAK KEDUA)**.

2. **Nama** : **[Nama Kepala Sekolah / PPK]**  
   **Jabatan** : Kepala Sekolah SD Negeri 18 Limboto  
   **NIP** : ....................................................  
   Dalam hal ini bertindak untuk dan atas nama SD Negeri 18 Limboto, yang selanjutnya disebut sebagai **PIHAK MENERIMA (PIHAK PERTAMA)**.

DENGAN INI MENYATAKAN SEBAGAI BERIKUT:

### Pasal 1: Penyerahan Hasil Pekerjaan
PIHAK KEDUA telah menyelesaikan 100% dan menyerahkan hasil pekerjaan Pengembangan **Portal Pembelajaran STEM Sekolah Berbasis Google Apps Script (GAS)** kepada PIHAK PERTAMA, dan PIHAK PERTAMA menyatakan telah menerima hasil pekerjaan tersebut dengan rincian serah terima sebagai berikut:

| No | Komponen / Artefak Hasil Pekerjaan | Spesifikasi & Kondisi | Status Uji Kelayakan |
|:---:|---|---|:---:|
| 1 | **Aplikasi Web Portal STEM (Frontend & Backend)** | Berkas `index.html` dan `Code.gs` terpasang pada akun Google Apps Script sekolah dengan status terpublikasi (*Web App Deployment*). Bebas biaya hosting (*Rp 0,- / Serverless*). | **Diterima (100% Baik)** |
| 2 | **Pangkalan Data Google Sheets Terintegrasi** | Google Spreadsheet dengan sheet `Settings` (identitas sekolah dinamis) dan sheet `Materi` (database terstruktur). | **Diterima (100% Baik)** |
| 3 | **Bank Data 144 Materi Kurikulum STEM SD** | 144 sub-materi kurikulum lengkap untuk Kelas 1 s.d. 6 SD pada bidang Science, Technology, Engineering, Mathematics, 100% terintegrasi simulasi PhET/Blockly/Scratch/GeoGebra bebas login (*zero-login*). | **Diterima (100% Baik)** |
| 4 | **Integrasi Navbar Tautan Eksternal Kemendikdasmen** | 3 tautan resmi di navbar: Sumber Belajar, Sumber Buku / Katalog, dan Latihan Soal Kemendikdasmen pada desktop & mobile drawer. | **Diterima (100% Baik)** |
| 5 | **Portal Manajemen Guru & Admin (CMS)** | Dashboard Admin terlindungi autentikasi PIN, fitur sembunyikan/intip PIN, form pengaturan sekolah, dan fitur muat ulang 144 materi otomatis. | **Diterima (100% Baik)** |
| 6 | **Modal Panduan Pengguna Interaktif (User Guide)** | Dokumentasi interaktif multi-tab di portal untuk Siswa SD, Orang Tua, Guru, dan FAQ. | **Diterima (100% Baik)** |
| 7 | **Bimbingan Teknis & Alih Pengetahuan (Bimtek)** | Pelatihan teknis pengoperasian panel admin, manajemen sheet materi, dan pembaruan identitas portal kepada operator sekolah yang ditunjuk. | **Terlaksana (100% Baik)** |
| 8 | **Dokumentasi Teknis & Panduan Deployment** | Berkas panduan deploy `PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md` dan dokumentasi kode sumber lengkap. | **Diterima Lengkap** |

### Pasal 2: Hasil Uji Fungsi & Pemeriksaan Bersama
PARA PIHAK telah melakukan pengujian bersama (*User Acceptance Test* / UAT) pada perangkat komputer, tablet, dan smartphone dengan hasil:
1. Seluruh tautan materi STEM dan navigasi eksternal Kemendikdasmen dapat dibuka dengan lancar tanpa kendala login.
2. Tampilan web responsif (*mobile-first*) dan tidak mengalami tumpang tindih (*layout overflow*).
3. Panel CMS admin berfungsi akurat dalam memperbarui identitas sekolah dan mengelola materi secara mandiri.
4. Aplikasi dinyatakan **LULUS UJI FUNGSI (100% ACCEPTED)** tanpa catatan kekurangan yang menghalangi operasional.

### Pasal 3: Hak Pembayaran Pelunasan
Dengan ditandatanganinya Berita Acara Serah Terima ini, maka PIHAK KEDUA berhak menerima pembayaran pelunasan Termin 3 (50%) sebesar **Rp 1.750.000,- (Satu Juta Tujuh Ratus Lima Puluh Ribu Rupiah)** dari PIHAK PERTAMA sesuai ketentuan Pasal 5 SPK.

### Pasal 4: Masa Garansi & Layanan Purna Jual
Terhitung sejak tanggal penandatanganan BAST ini, PIHAK KEDUA berkewajiban memberikan garansi pemeliharaan dan perbaikan bug (*free bug-fixing*) selama **3 (tiga) bulan kalender** hingga tanggal **29 Januari 2027**.

Demikian Berita Acara Serah Terima ini dibuat dengan sebenarnya dalam rangkap 2 (dua) bermaterai cukup untuk dipergunakan sebagaimana mestinya.

---

<br>

| **YANG MENERIMA (PIHAK PERTAMA)**<br>Kepala Sekolah SD Negeri 18 Limboto | **YANG MENYERAHKAN (PIHAK KEDUA)**<br>Lead Solution Architect & Consultant |
|:---:|:---:|
| <br><br><br>*(Meterai Rp 10.000,-)*<br><br><u>**[Nama Kepala Sekolah]**</u><br>NIP. .................................................... | <br><br><br>*(Tanda Tangan & Cap)*<br><br><u>**[Nama Lead Developer]**</u><br>Tim Pengembang Sistem STEM |
