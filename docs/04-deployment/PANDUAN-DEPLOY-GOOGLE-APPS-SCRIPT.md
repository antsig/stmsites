# 🚀 PANDUAN LENGKAP DEPLOYMENT PORTAL PEMBELAJARAN STEM SEKOLAH
## PANDUAN PENERAPAN PADA GOOGLE APPS SCRIPT (GAS) & GOOGLE SHEETS (100% GRATIS)

---

**Versi Panduan**: `v1.4.0`  
**Target Platform**: Google Apps Script (V8 Runtime) & Google Spreadsheet  
**Biaya Infrastruktur**: **Rp 0,- / Bulan (Gratis Selamanya dari Google)**  
**Kebutuhan Akun**: Akun Google biasa (`@gmail.com`) atau Akun Belajar.id / Google Workspace for Education (`@sekolah.sch.id`).

---

## 📋 Daftar Berkas yang Dibutuhkan

Di dalam editor Google Apps Script, Anda hanya perlu membuat **5 berkas** berikut:

| No | Tipe Berkas di Apps Script | Nama Berkas di Apps Script | Fungsi & Deskripsi |
|:---:|:---:|:---:|---|
| 1 | **Script (`.gs`)** | `Code` | Backend Controller, Autentikasi PIN, Akses Google Sheets Database, API CRUD. |
| 2 | **HTML (`.html`)** | `index` | Shell utama antarmuka siswa, beranda kategori STEM, dan modal popup. |
| 3 | **HTML (`.html`)** | `styles` | Seluruh desain visual CSS modern, layout 2 kolom mobile, dan tema warna sekolah. |
| 4 | **HTML (`.html`)** | `admin` | Antarmuka panel kendali guru, kelola materi, pengaturan logo, dan panduan. |
| 5 | **HTML (`.html`)** | `scripts` | Logika interaktif JavaScript, pemfilter materi, state management, dan pemutihan cache. |

> ⚠️ **PENTING**: Di Google Apps Script, saat membuat file HTML (tombol `+` > `HTML`), **cukup ketik namanya saja tanpa `.html`** (misal ketik `index`, `styles`, `admin`, `scripts`). Google Apps Script akan otomatis memberikan ekstensi `.html`.

---

## 🛠️ Langkah-Langkah Deployment (7 Tahap Mudah)

### Tahap 1: Buat Google Spreadsheet Baru (Database Portal)
1. Buka peramban (*browser*) dan ketik alamat: **[sheets.new](https://sheets.new)**
2. Beri nama spreadsheet di kiri atas, contoh: `Database Portal STEM SD Harapan Bangsa`.
3. Biarkan spreadsheet kosong. Sistem akan secara otomatis membuatkan sheet `Settings` dan `Materi` beserta seluruh contoh materi awal saat aplikasi pertama kali dijalankan!

### Tahap 2: Buka Editor Google Apps Script
1. Pada menu atas Spreadsheet, klik menu **Ekstensi (Extensions)**.
2. Klik **Apps Script**.
3. Tab baru editor Google Apps Script akan terbuka.
4. Ganti judul proyek di kiri atas (default: *"Proyek tanpa judul"*) menjadi `Portal Pembelajaran STEM Sekolah`.

### Tahap 3: Buat dan Salin Berkas `Code.gs`
1. Di panel kiri, klik file default yang sudah ada: `Kode.gs` (atau `Code.gs`).
2. Hapus seluruh isi kode bawaan (`function myFunction() { ... }`).
3. Tempelkan (*paste*) seluruh kode dari bagian [Kode 1: Code.gs](#kode-1-codegs) di bawah ini.
4. Simpan dengan menekan tombol ikon disket **Simpan proyek (Save project)** atau tombol `Ctrl + S`.

### Tahap 4: Buat 4 Berkas HTML (`index`, `styles`, `admin`, `scripts`)
1. Di panel kiri Apps Script, klik tombol ikon tambah **`+`** di sebelah tulisan *"File"*, lalu pilih **HTML**.
2. Beri nama: **`index`** (lalu tekan Enter). Hapus kode bawaan dan tempelkan seluruh kode dari [Kode 2: index.html](#kode-2-indexhtml).
3. Klik tombol **`+`** > pilih **HTML**, beri nama: **`styles`**. Tempelkan seluruh kode dari [Kode 3: styles.html](#kode-3-styleshtml).
4. Klik tombol **`+`** > pilih **HTML**, beri nama: **`admin`**. Tempelkan seluruh kode dari [Kode 4: admin.html](#kode-4-adminhtml).
5. Klik tombol **`+`** > pilih **HTML**, beri nama: **`scripts`**. Tempelkan seluruh kode dari [Kode 5: scripts.html](#kode-5-scriptshtml).
6. Tekan tombol **Simpan proyek** (`Ctrl + S`). Pastikan semua file tidak memiliki tanda titik oranye (indikasi belum disimpan).

### Tahap 5: Jalankan Penerapan Baru (*New Deployment*)
1. Di pojok kanan atas editor Apps Script, klik tombol biru **Terapkan (Deploy)**.
2. Pilih opsi **Penerapan baru (New deployment)**.
3. Pada dialog yang muncul, klik ikon roda gigi ⚙️ di sebelah *"Pilih jenis"*, lalu pilih **Aplikasi web (Web app)**.
4. Lakukan pengaturan konfigurasi berikut:
   - **Deskripsi**: `Rilis Produksi Portal Pembelajaran STEM v1.4`
   - **Jalankan sebagai (Execute as)**: Pilih **Saya (email-anda@gmail.com / akun sekolah)**.
   - **Siapa yang memiliki akses (Who has access)**: Pilih **Siapa saja (Anyone)**.
     *(Catatan: Ini wajib dipilih agar siswa dan orang tua dapat membuka portal tanpa diminta login akun Google khusus).*
5. Klik tombol **Terapkan (Deploy)**.

### Tahap 6: Otorisasi Izin Akun Google (Hanya 1x di Awal)
Karena skrip ini akan membaca dan menulis data ke Google Sheets milik Anda, Google akan meminta konfirmasi izin:
1. Klik tombol **Beri akses (Authorize access)**.
2. Pilih akun Google Anda.
3. Jika muncul layar peringatan *"Google hasn't verified this app"* (Google belum memverifikasi aplikasi ini), klik tulisan kecil **Lanjutan (Advanced)** di kiri bawah.
4. Klik tautan **Buka Portal Pembelajaran STEM Sekolah (tidak aman)** / *Go to Portal STEM (unsafe)*.
5. Klik **Izinkan (Allow)**.

### Tahap 7: Salin URL Web App & Bagikan ke Siswa!
1. Google Apps Script akan menampilkan **URL Aplikasi Web (Web App URL)**, contoh:
   `https://script.google.com/macros/s/AKfycbx.../exec`
2. Klik tombol **Salin (Copy)**.
3. Buka tautan tersebut di tab baru atau bagikan kepada siswa, guru, dan orang tua murid melalui grup WhatsApp!
4. Masuk ke halaman admin menggunakan PIN awal: **`123456`** untuk mengganti nama sekolah, kontak WhatsApp, logo, dan menambahkan materi baru.

---

## 📄 KODE SUMBER LENGKAP SETIAP BERKAS

*(Anda dapat menyalin kode setiap berkas di bawah ini langsung ke editor Google Apps Script)*

---

### Kode 1: `Code.gs`
*(File Script - Nama di Apps Script: `Code.gs`)*

```javascript
/**
 * ==============================================================================
 * PORTAL PEMBELAJARAN STEM SEKOLAH BERBASIS GOOGLE APPS SCRIPT (GAS)
 * Backend Script - Code.gs
 * ==============================================================================
 * Dijalankan di Google Apps Script yang terhubung ke Google Sheets sebagai database.
 */

// Konfigurasi Nama Sheet
var SHEET_SETTINGS = 'Settings';
var SHEET_MATERI = 'Materi';

// Default PIN Admin
var DEFAULT_PIN = '123456';

/**
 * Entry point Web App (GET Request)
 */
function doGet(e) {
  // Inisialisasi spreadsheet jika tabel belum ada
  initDatabaseIfEmpty();

  var template = HtmlService.createTemplateFromFile('index');
  return template.evaluate()
    .setTitle('Portal Pembelajaran STEM Sekolah')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Menyertakan file HTML parsial jika diperlukan (misal: CSS / JS terpisah)
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Mengambil data awal untuk klien (Settings + Daftar Materi)
 */
function getInitialData() {
  try {
    initDatabaseIfEmpty();
    var settings = getSettingsMap();
    var materials = getMaterialsList();

    // Sembunyikan PIN admin di respon publik
    var safeSettings = Object.assign({}, settings);
    delete safeSettings.admin_pin;

    return {
      success: true,
      data: {
        settings: safeSettings,
        materials: materials
      }
    };
  } catch (err) {
    return {
      success: false,
      error: err.toString()
    };
  }
}

/**
 * Verifikasi PIN Admin
 */
function verifyPin(inputPin) {
  try {
    var settings = getSettingsMap();
    var currentPin = settings.admin_pin || DEFAULT_PIN;
    if (String(inputPin).trim() === String(currentPin).trim()) {
      return { success: true };
    }
    return { success: false, error: 'PIN Admin tidak sesuai! Silakan periksa kembali.' };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * Menyimpan (Tambah baru atau Update) Sub-Card Materi STEM
 */
function saveMaterial(materialData, adminPin) {
  try {
    // Validasi Keamanan PIN
    var pinCheck = verifyPin(adminPin);
    if (!pinCheck.success) return pinCheck;

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_MATERI);
    if (!sheet) {
      initDatabaseIfEmpty();
      sheet = ss.getSheetByName(SHEET_MATERI);
    }

    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var idIndex = headers.indexOf('id');

    var existingRowIndex = -1;
    if (materialData.id) {
      for (var r = 1; r < data.length; r++) {
        if (String(data[r][idIndex]) === String(materialData.id)) {
          existingRowIndex = r + 1; // 1-indexed untuk Spreadsheet
          break;
        }
      }
    }

    // Jika id kosong, buat ID unik baru
    var matId = materialData.id;
    if (!matId) {
      var prefix = 'STEM-' + (materialData.stem_category ? materialData.stem_category.substring(0, 3).toUpperCase() : 'GEN');
      matId = prefix + '-' + Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyyMMdd-HHmmss');
    }

    var rowValues = [
      matId,
      materialData.stem_category || 'Science',
      materialData.title || 'Materi Tanpa Judul',
      materialData.grade || 'Semua Kelas',
      materialData.media_type || 'Video',
      materialData.media_url || '',
      materialData.thumbnail_url || '',
      materialData.description || '',
      materialData.mission_goals || '',
      materialData.mission_steps || '',
      materialData.mission_reflection || '',
      Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss')
    ];

    if (existingRowIndex > 0) {
      // Update data baris lama
      sheet.getRange(existingRowIndex, 1, 1, rowValues.length).setValues([rowValues]);
    } else {
      // Tambah baris baru di bawah
      sheet.appendRow(rowValues);
    }

    return {
      success: true,
      message: 'Sub-card materi STEM berhasil disimpan!',
      materialId: matId
    };
  } catch (err) {
    return {
      success: false,
      error: err.toString()
    };
  }
}

/**
 * Menghapus Sub-Card Materi STEM berdasarkan ID
 */
function deleteMaterial(materialId, adminPin) {
  try {
    var pinCheck = verifyPin(adminPin);
    if (!pinCheck.success) return pinCheck;

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_MATERI);
    if (!sheet) return { success: false, error: 'Sheet Materi tidak ditemukan' };

    var data = sheet.getDataRange().getValues();
    var idIndex = data[0].indexOf('id');

    for (var r = 1; r < data.length; r++) {
      if (String(data[r][idIndex]) === String(materialId)) {
        sheet.deleteRow(r + 1);
        return { success: true, message: 'Materi berhasil dihapus!' };
      }
    }

    return { success: false, error: 'Materi dengan ID tersebut tidak ditemukan' };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * Memperbarui Pengaturan Identitas Sekolah & Logo Kategori
 */
function updateSettings(newSettings, adminPin) {
  try {
    var pinCheck = verifyPin(adminPin);
    if (!pinCheck.success) return pinCheck;

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_SETTINGS);
    if (!sheet) {
      initDatabaseIfEmpty();
      sheet = ss.getSheetByName(SHEET_SETTINGS);
    }

    var data = sheet.getDataRange().getValues();
    var keys = Object.keys(newSettings);

    for (var k = 0; k < keys.length; k++) {
      var key = keys[k];
      var val = newSettings[key];

      var found = false;
      for (var r = 1; r < data.length; r++) {
        if (data[r][0] === key) {
          sheet.getRange(r + 1, 2).setValue(val);
          found = true;
          break;
        }
      }
      if (!found) {
        sheet.appendRow([key, val]);
      }
    }

    return {
      success: true,
      message: 'Pengaturan sekolah berhasil diperbarui!',
      data: getSettingsMap()
    };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * Helper: Ambil seluruh pengaturan sebagai object key-value
 */
function getSettingsMap() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_SETTINGS);
  var settings = {};

  if (!sheet) return settings;
  var data = sheet.getDataRange().getValues();
  for (var r = 1; r < data.length; r++) {
    var key = data[r][0];
    var val = data[r][1];
    if (key) {
      settings[key] = val;
    }
  }
  return settings;
}

/**
 * Helper: Ambil seluruh daftar materi sebagai array of object
 */
function getMaterialsList() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_MATERI);
  var list = [];

  if (!sheet) return list;
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return list;

  var headers = data[0];
  for (var r = 1; r < data.length; r++) {
    var row = data[r];
    var item = {};
    for (var c = 0; c < headers.length; c++) {
      item[headers[c]] = row[c] !== undefined ? String(row[c]) : '';
    }
    list.push(item);
  }
  return list;
}

/**
 * Otomatis inisialisasi tabel Google Sheets jika baru pertama kali dibuat
 */
function initDatabaseIfEmpty() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Inisialisasi Sheet Settings
  var settingsSheet = ss.getSheetByName(SHEET_SETTINGS);
  if (!settingsSheet) {
    settingsSheet = ss.insertSheet(SHEET_SETTINGS);
    settingsSheet.appendRow(['key', 'value']);

    var defaultSettings = [
      ['school_name', 'SD NEGERI HARAPAN BANGSA'],
      ['academic_year', '2026/2027'],
      ['slogan', 'Eksplorasi Sains, Teknologi, Rekayasa, dan Matematika Bersama!'],
      ['logo_url', 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80'],
      ['contact_wa', '6281234567890'],
      ['contact_email', 'stem.harapanbangsa@sekolah.sch.id'],
      ['admin_pin', DEFAULT_PIN],
      ['logo_science', ''],
      ['logo_technology', ''],
      ['logo_engineering', ''],
      ['logo_mathematics', '']
    ];

    for (var i = 0; i < defaultSettings.length; i++) {
      settingsSheet.appendRow(defaultSettings[i]);
    }
    settingsSheet.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#E2E8F0');
  }

  // 2. Inisialisasi Sheet Materi
  var materiSheet = ss.getSheetByName(SHEET_MATERI);
  if (!materiSheet) {
    materiSheet = ss.insertSheet(SHEET_MATERI);
    var materiHeaders = [
      'id', 'stem_category', 'title', 'grade', 'media_type',
      'media_url', 'thumbnail_url', 'description', 'mission_goals', 'mission_steps',
      'mission_reflection', 'created_at'
    ];
    materiSheet.appendRow(materiHeaders);

    // Seed contoh materi STEM untuk Kelas 1 s.d. 6
    var sampleMaterials = [
      // 1. Science
      [
        'STEM-SCI01', 'Science', 'Petualangan Daur Hidup Kupu-kupu', '2', 'Video',
        'https://www.youtube.com/watch?v=O1S8WzwLPlM',
        'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=600&auto=format&fit=crop&q=80',
        'Yuk amati metamorfosis sempurna dari telur, ulat yang rakus, kepompong tidur, hingga menjadi kupu-kupu bersayap indah!',
        '1. Mengenal 4 tahap metamorfosis kupu-kupu.\n2. Menjelaskan perubahan bentuk ulat hingga menjadi kupu-kupu.',
        '1. Tonton video animasi daur hidup kupu-kupu.\n2. Siapkan kertas origami atau plastisin.\n3. Buatlah 4 replika tahap metamorfosis dan susun berurutan di buku gambarmu!',
        'Mengapa ulat harus beristirahat di dalam kepompong sebelum sayapnya tumbuh indah?',
        '2026-10-25 08:00:00'
      ],
      [
        'STEM-SCI02', 'Science', 'Eksplorasi Fotosintesis: Mengapa Daun Berwarna Hijau?', '4', 'Simulasi',
        'https://phet.colorado.edu/sims/html/molecules-and-light/latest/molecules-and-light_all.html',
        'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&auto=format&fit=crop&q=80',
        'Temukan bagaimana klorofil menyerap cahaya matahari dan mengubah air serta karbon dioksida menjadi oksigen segar!',
        '1. Menjelaskan fungsi klorofil dalam proses fotosintesis.\n2. Mengidentifikasi peran penting tumbuhan bagi udara di bumi.',
        '1. Ambil 2 helai daun tanaman di taman sekolah.\n2. Tutup salah satu bagian daun dengan kertas timah selama 2 hari.\n3. Amati perubahan warna daun saat terkena sinar matahari!',
        'Apa yang akan terjadi pada udara di bumi jika pohon-pohon hijau berkurang?',
        '2026-10-25 08:15:00'
      ],
      // 2. Technology
      [
        'STEM-TEC01', 'Technology', 'Logika Coding Dasar: Algoritma Robot Pembawa Pesan', '3', 'Simulasi',
        'https://blockly.games/maze',
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
        'Belajar logika berpikir komputasional dengan menyusun blok perintah langkah demi langkah agar robot mencapai tujuan.',
        '1. Memahami konsep urutan perintah (sequence) dalam pemrograman.\n2. Melatih logika pemecahan masalah secara runtut.',
        '1. Buka simulasi labirin blok melalui tautan materi.\n2. Pandu robot agar berhasil keluar labirin dengan perintah: Maju, Belok Kiri, Belok Kanan.\n3. Tuliskan kode langkah terbaikmu di buku catatan!',
        'Mengapa komputer atau robot harus diberi perintah yang sangat runtut tanpa boleh ada yang terbalik?',
        '2026-10-25 08:30:00'
      ],
      [
        'STEM-TEC02', 'Technology', 'Jelajah Internet Cerdas: Cara Mencari Fakta & Menghindari Hoaks', '5', 'Artikel',
        'https://id.wikipedia.org/wiki/Literasi_digital',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
        'Kiat aman berselancar di dunia maya, mengenali sumber informasi tepercaya, dan menjaga data privasi.',
        '1. Siswa mampu membedakan informasi fakta dan berita bohong.\n2. Mengetahui pentingnya merahasiakan password dan data pribadi.',
        '1. Baca artikel ringkasan literasi digital.\n2. Periksa sebuah berita online menggunakan rumus 5W+1H.\n3. Buat kartu pengingat: 3 Langkah Cek Fakta di Internet!',
        'Mengapa kita tidak boleh sembarangan mengklik tautan hadiah yang tidak jelas pengirimnya?',
        '2026-10-25 08:45:00'
      ],
      // 3. Engineering
      [
        'STEM-ENG01', 'Engineering', 'Rekayasa Jembatan Kertas Kokoh Penahan Beban', '1', 'Praktikum',
        'https://www.youtube.com/watch?v=7b7pS6X9V1g',
        'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&auto=format&fit=crop&q=80',
        'Bagaimana melipat selembar kertas biasa agar mampu menahan beban koin atau mobil mainan? Temukan rahasia struktur lipatan!',
        '1. Mengenal konsep dasar struktur teknik (lipatan zig-zag/akordeon).\n2. Melatih kreativitas rancang bangun dengan bahan sederhana.',
        '1. Siapkan 3 lembar kertas HVS bekas dan 2 cangkir sebagai tiang penyangga.\n2. Buat jembatan pertama mendatar biasa, dan jembatan kedua dengan lipatan zig-zag.\n3. Letakkan koin satu demi satu di atas jembatan sampai roboh. Catat jembatan mana yang paling kokoh!',
        'Mengapa lipatan zig-zag dapat membuat kertas tipis menjadi jauh lebih kuat menahan beban?',
        '2026-10-25 09:00:00'
      ],
      [
        'STEM-ENG02', 'Engineering', 'Desain Mobil Bertenaga Balon Udara (Hukum Gerak)', '6', 'Praktikum',
        'https://www.youtube.com/watch?v=Kz6E1B6VvG8',
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
        'Rancang mobil balap ramah lingkungan dari botol bekas yang meluncur kencang akibat semburan udara dari balon!',
        '1. Memahami prinsip aksi-reaksi (dorongan udara keluar menghasilkan gerak maju).\n2. Menguji coba aerodinamika bentuk bodi kendaraan sederhana.',
        '1. Siapkan botol plastik bekas, sedotan, 4 tutup botol sebagai roda, dan 1 buah balon.\n2. Rakit poros roda menggunakan tusuk sate dan sedotan.\n3. Tiup balon di atas mobil, lalu lepaskan di lantai licin dan ukur jarak luncurnya!',
        'Bagaimana cara memodifikasi bentuk mobil agar meluncur lebih lurus dan jauh?',
        '2026-10-25 09:15:00'
      ],
      // 4. Mathematics
      [
        'STEM-MAT01', 'Mathematics', 'Pecahan Pizza Lezat: Memahami 1/2, 1/4, dan 3/4', '3', 'Dokumen',
        'https://phet.colorado.edu/sims/html/fractions-intro/latest/fractions-intro_all.html',
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
        'Belajar pecahan jadi menyenangkan dengan memotong pizza khayalan bersama teman-teman!',
        '1. Memvisualisasikan pecahan sederhana dalam bentuk potongan benda utuh.\n2. Membandingkan nilai pecahan yang berpenyebut sama.',
        '1. Buka simulasi pecahan interaktif PhET.\n2. Bagi sebuah lingkaran pizza menjadi 4 bagian sama besar.\n3. Berikan 2 potong kepada teman, dan hitung berapa sisa pecahan yang kamu miliki!',
        'Jika sebuah kue dibagi sama rata untuk 4 anak, mengapa setiap anak mendapat nilai 1/4 bagian?',
        '2026-10-25 09:30:00'
      ],
      [
        'STEM-MAT02', 'Mathematics', 'Detektif Sudut: Menemukan Sudut Siku-siku, Lancip, & Tumpul', '5', 'Video',
        'https://www.youtube.com/watch?v=NVuMULQjb3o',
        'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
        'Bawa penggaris busurmu dan jadilah detektif yang mencari sudut-sudut rahasia pada pintu, atap rumah, dan jam dinding!',
        '1. Mengidentifikasi sudut siku-siku (90 derajat), lancip (<90 derajat), dan tumpul (>90 derajat).\n2. Melatih ketelitian dalam mengamati sudut pada objek di sekitar.',
        '1. Ambil selembar kertas origami persegi yang memiliki sudut siku-siku 90°.\n2. Cocokkan ujung kertas pada 5 sudut benda di dalam kelas atau rumahmu.\n3. Catat di tabel: benda mana yang memiliki sudut siku-siku, lancip, atau tumpul!',
        'Mengapa kusen pintu dan jendela kebanyakan dirancang menggunakan sudut siku-siku?',
        '2026-10-25 09:45:00'
      ]
    ];

    for (var m = 0; m < sampleMaterials.length; m++) {
      materiSheet.appendRow(sampleMaterials[m]);
    }
    materiSheet.getRange(1, 1, 1, materiHeaders.length).setFontWeight('bold').setBackground('#E2E8F0');
  }
}
```

---

### Kode 2: `index.html`
*(File HTML - Nama di Apps Script: `index`)*

> Buka file [index.html](file:///f:/repository/stemsites/index.html) di repositori Anda, salin seluruh isinya, dan tempelkan ke file HTML `index` di Google Apps Script.

---

### Kode 3: `styles.html`
*(File HTML - Nama di Apps Script: `styles`)*

> Buka file [styles.html](file:///f:/repository/stemsites/styles.html) di repositori Anda, salin seluruh isinya, dan tempelkan ke file HTML `styles` di Google Apps Script.

---

### Kode 4: `admin.html`
*(File HTML - Nama di Apps Script: `admin`)*

> Buka file [admin.html](file:///f:/repository/stemsites/admin.html) di repositori Anda, salin seluruh isinya, dan tempelkan ke file HTML `admin` di Google Apps Script.

---

### Kode 5: `scripts.html`
*(File HTML - Nama di Apps Script: `scripts`)*

> Buka file [scripts.html](file:///f:/repository/stemsites/scripts.html) di repositori Anda, salin seluruh isinya, dan tempelkan ke file HTML `scripts` di Google Apps Script.

---

## ❓ FAQ & Troubleshooting Otorisasi Google

1. **Muncul pesan *"Google hasn't verified this app"*, apakah ini berbahaya?**
   - **TIDAK**. Peringatan ini wajar muncul karena script ini Anda buat dan terapkan sendiri dari akun pribadi/sekolah Anda, bukan aplikasi komersial dari pihak luar yang melalui verifikasi Google Cloud berbayar.
   - Solusi: Klik **Advanced (Lanjutan)** > klik **Go to Portal Pembelajaran STEM (unsafe)** > klik **Allow (Izinkan)**.

2. **Bagaimana jika siswa tidak bisa mengakses ("Akses Ditolak" / "You need permission")?**
   - Pastikan pada saat Deploy, pengaturan **Who has access (Siapa yang memiliki akses)** dipilih **Anyone (Siapa saja)**, bukan *"Only myself"* atau *"Only users within domain"*.
   - Jika Anda menggunakan akun Google Workspace for Education (seperti `belajar.id`), administrator dinas/sekolah mungkin membatasi publikasi keluar. Solusinya: deploy menggunakan akun Google Gmail biasa sekolah atau minta admin sekolah membuka izin eksternal Web App.

3. **Bagaimana cara memperbarui kode setelah ada revisi?**
   - Lakukan perubahan pada file di editor Apps Script > simpan (`Ctrl+S`).
   - Klik tombol **Deploy (Terapkan)** > **Kelola penerapan (Manage deployments)**.
   - Klik ikon pensil ✏️ edit pada penerapan aktif.
   - Ubah versi menjadi **Versi baru (New version)** > klik **Terapkan (Deploy)**. URL web app Anda akan tetap sama!
