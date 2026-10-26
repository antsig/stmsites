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

    var isUpdate = false;
    var targetRow = -1;

    // Jika ID diberikan, cari baris untuk update
    if (materialData.id) {
      for (var i = 1; i < data.length; i++) {
        if (String(data[i][idIndex]) === String(materialData.id)) {
          isUpdate = true;
          targetRow = i + 1; // 1-based row index
          break;
        }
      }
    }

    var finalId = isUpdate ? materialData.id : 'STEM-' + Utilities.getUuid().substring(0, 8).toUpperCase();
    var now = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss');

    var rowValues = [
      finalId,
      materialData.stem_category || 'Science',
      materialData.title || '',
      materialData.grade || '1',
      materialData.media_type || 'Video',
      materialData.media_url || '',
      materialData.thumbnail_url || '',
      materialData.description || '',
      materialData.mission_goals || '',
      materialData.mission_steps || '',
      materialData.mission_reflection || '',
      isUpdate ? (data[targetRow - 1][headers.indexOf('created_at')] || now) : now
    ];

    if (isUpdate && targetRow > 1) {
      sheet.getRange(targetRow, 1, 1, rowValues.length).setValues([rowValues]);
    } else {
      sheet.appendRow(rowValues);
    }

    return {
      success: true,
      message: isUpdate ? 'Materi berhasil diperbarui!' : 'Materi baru berhasil ditambahkan!',
      data: formatMaterialRow(headers, rowValues)
    };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * Menghapus Sub-Card Materi berdasarkan ID
 */
function deleteMaterial(id, adminPin) {
  try {
    var pinCheck = verifyPin(adminPin);
    if (!pinCheck.success) return pinCheck;

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_MATERI);
    if (!sheet) return { success: false, error: 'Sheet Materi tidak ditemukan!' };

    var data = sheet.getDataRange().getValues();
    var idIndex = data[0].indexOf('id');
    var foundRow = -1;

    for (var i = 1; i < data.length; i++) {
      if (String(data[i][idIndex]) === String(id)) {
        foundRow = i + 1;
        break;
      }
    }

    if (foundRow > 1) {
      sheet.deleteRow(foundRow);
      return { success: true, message: 'Materi berhasil dihapus!' };
    }

    return { success: false, error: 'Materi dengan ID tersebut tidak ditemukan.' };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * Memperbarui Pengaturan Sekolah & Logo
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
    var existingKeys = {};
    for (var i = 1; i < data.length; i++) {
      existingKeys[data[i][0]] = i + 1;
    }

    // Perbarui key yang diberikan
    for (var key in newSettings) {
      if (newSettings.hasOwnProperty(key)) {
        var val = newSettings[key];
        if (existingKeys[key]) {
          sheet.getRange(existingKeys[key], 2).setValue(val);
        } else {
          sheet.appendRow([key, val]);
        }
      }
    }

    var updatedSettings = getSettingsMap();
    delete updatedSettings.admin_pin; // Jangan kirimkan PIN kembali

    return {
      success: true,
      message: 'Pengaturan sekolah berhasil disimpan!',
      data: updatedSettings
    };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * Mengambil daftar pengaturan dalam format objek Key-Value
 */
function getSettingsMap() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_SETTINGS);
  if (!sheet) return {};

  var data = sheet.getDataRange().getValues();
  var settings = {};
  for (var i = 1; i < data.length; i++) {
    var k = String(data[i][0]).trim();
    var v = data[i][1];
    if (k) settings[k] = v;
  }
  return settings;
}

/**
 * Mengambil semua materi sebagai array of objects
 */
function getMaterialsList() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_MATERI);
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  var headers = data[0];
  var list = [];
  for (var i = 1; i < data.length; i++) {
    list.push(formatMaterialRow(headers, data[i]));
  }
  return list;
}

/**
 * Format baris sheet menjadi objek JSON materi
 */
function formatMaterialRow(headers, row) {
  var obj = {};
  for (var j = 0; j < headers.length; j++) {
    var key = headers[j];
    var val = row[j];
    if (key === 'grade') {
      obj[key] = String(val);
    } else {
      obj[key] = val !== undefined && val !== null ? String(val) : '';
    }
  }
  return obj;
}

/**
 * Inisialisasi sheet dan seed data awal jika spreadsheet masih kosong
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
    for (var s = 0; s < defaultSettings.length; s++) {
      settingsSheet.appendRow(defaultSettings[s]);
    }
    settingsSheet.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#E2E8F0');
  }

  // 2. Inisialisasi Sheet Materi
  var materiSheet = ss.getSheetByName(SHEET_MATERI);
  if (!materiSheet) {
    materiSheet = ss.insertSheet(SHEET_MATERI);
    var materiHeaders = [
      'id', 'stem_category', 'title', 'grade', 'media_type', 'media_url',
      'thumbnail_url', 'description', 'mission_goals', 'mission_steps',
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

/**
 * Menyediakan konten berkas kode untuk tab Panduan Deploy di Panel Admin
 */
function getDeployFileCode(filename) {
  try {
    if (filename === 'Code.gs') {
      return { success: true, content: 'Buka file Code.gs langsung di editor Apps Script.' };
    }
    var baseName = filename.replace('.html', '');
    var content = HtmlService.createHtmlOutputFromFile(baseName).getContent();
    return { success: true, content: content };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}
