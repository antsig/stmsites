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
        'STEM-SCI01', 'Science', 'Petualangan Daur Hidup & Metamorfosis Kupu-kupu', '2', 'Video',
        'https://www.youtube.com/watch?v=O1S8WzwLPlM',
        'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=600&auto=format&fit=crop&q=80',
        'Amati keajaiban metamorfosis sempurna dari telur mungil, ulat yang makan daun, kepompong tidur, hingga menjadi kupu-kupu bersayap indah!',
        '1. Mengenal 4 tahap metamorfosis sempurna kupu-kupu.\n2. Menjelaskan perubahan bentuk fisik ulat hingga menjadi kupu-kupu dewasa.',
        '1. Tonton video animasi siklus hidup kupu-kupu melalui tombol di atas.\n2. Siapkan kertas gambar dan plastisin atau origami warna-warni.\n3. Buat 4 replika tahap metamorfosis (telur di daun, ulat, kepompong di ranting, dan kupu-kupu).\n4. Beri label nama pada setiap tahap karyamu!',
        'Mengapa ulat harus beristirahat di dalam kepompong terlebih dahulu sebelum memiliki sayap indah untuk terbang?',
        '2026-10-25 08:00:00'
      ],
      [
        'STEM-SCI02', 'Science', 'Eksplorasi Cahaya & Warna: Mengapa Daun Berwarna Hijau?', '4', 'Simulasi',
        'https://phet.colorado.edu/sims/html/color-vision/latest/color-vision_en.html',
        'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&auto=format&fit=crop&q=80',
        'Gunakan simulasi interaktif PhET Color Vision untuk mencari tahu bagaimana berkas cahaya merah, hijau, dan biru ditangkap mata manusia saat mengamati dedaunan!',
        '1. Memahami bagaimana mata manusia menangkap kombinasi warna cahaya primer (Merah, Hijau, Biru).\n2. Menjelaskan mengapa klorofil menyerap spektrum cahaya tertentu dan memantulkan warna hijau ke mata kita.',
        '1. Buka simulasi interaktif PhET Color Vision lewat tombol di atas.\n2. Pada menu "RGB Bulbs", geser intensitas lampu Merah, Hijau, dan Biru.\n3. Amati warna apa yang ditangkap oleh mata orang dalam simulasi.\n4. Nyalakan hanya warna Hijau dan catat hasil pengamatanmu!',
        'Jika cahaya matahari mengandung semua warna pelangi, mengapa mata kita hanya melihat daun berwarna hijau saat terkena sinar matahari?',
        '2026-10-25 08:15:00'
      ],
      // 2. Technology
      [
        'STEM-TEC01', 'Technology', 'Logika Coding Dasar: Algoritma Robot Menembus Labirin', '3', 'Simulasi',
        'https://blockly.games/maze',
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
        'Belajar berpikir komputasional dengan menyusun blok perintah langkah demi langkah agar robot berhasil keluar dari labirin berliku.',
        '1. Memahami konsep urutan perintah (sequence) dalam pemrograman komputer.\n2. Melatih logika pemecahan masalah (problem solving) secara runtut dan terstruktur.',
        '1. Buka game simulasi logika Google Blockly Maze lewat tombol di atas.\n2. Susun blok instruksi: Maju, Belok Kiri, atau Belok Kanan.\n3. Klik tombol "Jalankan Program" untuk menguji gerakan robotmu.\n4. Selesaikan tantangan mulai dari Level 1 hingga minimal Level 3!',
        'Mengapa komputer atau robot akan gagal mencapai tujuan jika ada satu saja urutan perintah belok yang keliru?',
        '2026-10-25 08:30:00'
      ],
      [
        'STEM-TEC02', 'Technology', 'Petualangan Internet Cerdas: Menjelajah Interland & Melawan Hoaks', '5', 'Simulasi',
        'https://beinternetawesome.withgoogle.com/id_id/interland',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
        'Jelajahi dunia 3D game Interland dari Google untuk belajar menjadi penjelajah internet cerdas, mengenali berita bohong, dan menjaga privasi online.',
        '1. Mampu membedakan informasi fakta dan kabar bohong (hoaks) di internet.\n2. Menerapkan etika berkomunikasi serta menjaga kerahasiaan kata sandi pribadi.',
        '1. Buka simulasi game edukasi Google Interland melalui tautan materi.\n2. Pilih petualangan di "Sungai Realitas" (Reality River).\n3. Jawab kuis tantangan untuk menyeberangi sungai dengan memilah pesan asli dan pesan penipuan!\n4. Tuliskan 3 tips aman internetan di buku catatanmu.',
        'Apa yang harus kamu lakukan jika menerima pesan dari orang tak dikenal yang meminta password atau alamat rumahmu di media sosial?',
        '2026-10-25 08:45:00'
      ],
      // 3. Engineering
      [
        'STEM-ENG01', 'Engineering', 'Rekayasa Keseimbangan Struktur: Simulasi Jungkat-Jungkit & Beban', '1', 'Simulasi',
        'https://phet.colorado.edu/sims/html/balancing-act/latest/balancing-act_en.html',
        'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&auto=format&fit=crop&q=80',
        'Bantu insinyur cilik merancang keseimbangan jembatan papan menggunakan simulasi interaktif PhET Balancing Act agar struktur tidak terjungkal!',
        '1. Memahami prinsip keseimbangan beban dan titik tumpu (fulcrum) dalam rekayasa teknik.\n2. Memprediksi bagaimana benda berat dapat diseimbangkan oleh benda ringan pada jarak tertentu.',
        '1. Buka simulasi PhET Balancing Act lewat tombol di atas.\n2. Pilih menu "Balance Lab" dan hilangkan tiang penyangga.\n3. Letakkan beban 10 kg di sisi kiri, lalu letakkan beban 5 kg di sisi kanan. Di jarak berapa papan menjadi seimbang sempurna?\n4. Coba mainkan mode "Game" Level 1 untuk menguji tebakanmu!',
        'Mengapa semakin jauh letak suatu benda dari titik tengah jungkat-jungkit, semakin besar kemampuannya untuk menekan papan ke bawah?',
        '2026-10-25 09:00:00'
      ],
      [
        'STEM-ENG02', 'Engineering', 'Desain Mobil Bertenaga Dorong Balon: Rekayasa Hukum Aksi-Reaksi', '6', 'Praktikum',
        'https://phet.colorado.edu/sims/html/energy-skate-park-basics/latest/energy-skate-park-basics_en.html',
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
        'Rancang mobil balap ramah lingkungan dari botol plastik bekas dan pelajari bagaimana semburan udara balon menghasilkan gaya dorong ke depan!',
        '1. Menerapkan prinsip aksi-reaksi (Hukum Gerak Newton) dalam pembuatan kendaraan rekayasa.\n2. Menguji coba roda dan poros (axle) untuk mengurangi gaya gesek pada lantai.',
        '1. Siapkan botol plastik bekas, 4 tutup botol sebagai roda, sedotan, tusuk sate, dan 1 buah balon.\n2. Pasang tusuk sate melalui sedotan sebagai poros roda di bawah botol.\n3. Rapatkan balon pada sedotan peniup menggunakan karet gelang dan rekatkan di atas botol.\n4. Tiup balon, lepaskan di lantai licin, dan ukur jarak luncurnya dengan meteran!',
        'Bagaimana cara memodifikasi bentuk bodi dan roda mobil agar mampu meluncur lebih jauh dan lebih lurus?',
        '2026-10-25 09:15:00'
      ],
      // 4. Mathematics
      [
        'STEM-MAT01', 'Mathematics', 'Pecahan Pizza & Kue Lezat: Visualisasi 1/2, 1/3, dan 1/4', '3', 'Simulasi',
        'https://phet.colorado.edu/sims/html/fractions-intro/latest/fractions-intro_en.html',
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
        'Belajar pecahan matematika jadi mudah dan seru dengan memotong kue lingkaran dan pizza interaktif pada simulasi PhET Fractions Intro!',
        '1. Memvisualisasikan pecahan sederhana (pembilang dan penyebut) sebagai bagian dari bangun utuh.\n2. Membandingkan nilai pecahan 1/2, 1/3, 1/4, dan kelipatannya secara nyata.',
        '1. Buka simulasi PhET Fractions Intro lewat tombol di atas.\n2. Pilih mode "Intro" dan klik model lingkaran kue/pizza.\n3. Naikkan angka pembilang (angka atas) dan penyebut (angka bawah), perhatikan potongan pizza yang terisi warna!\n4. Masuk ke mode "The Game" Level 1 untuk mencocokkan bentuk pecahan dengan wadahnya.',
        'Jika satu loyang pizza dipotong menjadi 4 bagian sama besar dan kamu makan 1 potong, mengapa nilai bagianmu ditulis sebagai 1/4?',
        '2026-10-25 09:30:00'
      ],
      [
        'STEM-MAT02', 'Mathematics', 'Arsitek Cilik: Eksplorasi Luas & Keliling Bangun Datar', '5', 'Simulasi',
        'https://phet.colorado.edu/sims/html/area-builder/latest/area-builder_en.html',
        'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
        'Jadilah arsitek cilik yang merancang denah ruangan dan taman sekolah menggunakan simulasi balok petak PhET Area Builder!',
        '1. Menghitung luas (Area) dan keliling (Perimeter) bangun datar pada bidang berpetak.\n2. Memahami bahwa dua bangun dengan luas yang sama dapat memiliki panjang keliling yang berbeda.',
        '1. Buka simulasi PhET Area Builder melalui tombol di atas.\n2. Geser kotak-kotak hijau ke kisi papan untuk membentuk persegi panjang berukuran 4 x 3 petak.\n3. Periksa angka Luas (Area) dan Keliling (Perimeter) yang muncul otomatis.\n4. Rancang bentuk lain yang sama-sama memiliki luas 12 petak, lalu bandingkan kelilingnya!',
        'Mengapa dua denah taman yang luasnya sama-sama 12 petak bisa membutuhkan panjang pagar bambu keliling yang berbeda?',
        '2026-10-25 09:45:00'
      ]
    ];

    for (var m = 0; m < sampleMaterials.length; m++) {
      materiSheet.appendRow(sampleMaterials[m]);
    }
    materiSheet.getRange(1, 1, 1, materiHeaders.length).setFontWeight('bold').setBackground('#E2E8F0');
  }
}
