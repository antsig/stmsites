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

// ID Spreadsheet Opsional: Jika proyek Apps Script dibuat secara Standalone (script.google.com),
// tempelkan ID Spreadsheet di sini. Jika dibuat dari Google Sheets (menu Ekstensi > Apps Script), biarkan kosong ''.
var SPREADSHEET_ID = '';

// Default PIN Admin
var DEFAULT_PIN = '123456';

/**
 * Mendapatkan referensi Spreadsheet secara aman (mendukung Container-Bound maupun Standalone).
 */
function getActiveSpreadsheetSafe() {
  if (typeof SPREADSHEET_ID !== 'undefined' && SPREADSHEET_ID && SPREADSHEET_ID.trim() !== '') {
    return SpreadsheetApp.openById(SPREADSHEET_ID.trim());
  }
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss) return ss;
  throw new Error('Spreadsheet aktif tidak ditemukan! Pastikan proyek ini dibuka dari Google Sheets (menu Ekstensi > Apps Script) atau isi variabel SPREADSHEET_ID di baris 15 Code.gs.');
}

/**
 * Helper pencarian indeks kolom secara fleksibel & case-insensitive
 */
function findColumnIndex(headers, columnName) {
  if (!headers || !Array.isArray(headers)) return -1;
  var target = String(columnName).trim().toLowerCase();
  for (var i = 0; i < headers.length; i++) {
    if (String(headers[i]).trim().toLowerCase() === target) {
      return i;
    }
  }
  return -1;
}

/**
 * Entry point Web App (GET Request)
 */
function doGet(e) {
  // Inisialisasi database secara aman tanpa memblokir penyajian halaman
  try {
    initDatabaseIfEmpty();
  } catch (err) {
    console.warn('Inisialisasi database ditangguhkan (menunggu otorisasi admin): ' + err);
  }

  // 1. Prioritaskan penyajian berkas index.html mandiri secara langsung (tanpa overhead template parser)
  try {
    return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Portal Pembelajaran STEM Sekolah')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (err) {
    // 2. Fallback tangguh jika pengguna masih menggunakan template scriptlet parsial
    var template = HtmlService.createTemplateFromFile('index');
    return template.evaluate()
      .setTitle('Portal Pembelajaran STEM Sekolah')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
}

/**
 * Menyertakan file HTML parsial secara tangguh (resilient).
 * Mendukung pencarian otomatis jika berkas di Apps Script dinamai tanpa ekstensi,
 * dengan ekstensi .html, maupun ekstensi ganda (.html.html).
 */
function include(filename) {
  var cleanName = filename.replace(/\.html$/i, '');
  var candidates = [
    filename,
    cleanName,
    cleanName + '.html',
    cleanName + '.html.html'
  ];

  for (var i = 0; i < candidates.length; i++) {
    try {
      return HtmlService.createHtmlOutputFromFile(candidates[i]).getContent();
    } catch (e) {
      // Coba kandidat nama berikutnya
    }
  }
  return '<!-- Berkas parsial ' + filename + ' tidak ditemukan di Google Apps Script -->';
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
 * Verifikasi PIN Admin (Tangguh: otomatis fallback ke DEFAULT_PIN jika sheet belum diotorisasi)
 */
function verifyPin(inputPin) {
  try {
    var currentPin = DEFAULT_PIN;
    try {
      var settings = getSettingsMap();
      if (settings && settings.admin_pin) {
        currentPin = String(settings.admin_pin).trim();
      }
    } catch (e) {
      currentPin = DEFAULT_PIN;
    }

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

    var ss = getActiveSpreadsheetSafe();
    var sheet = ss.getSheetByName(SHEET_MATERI);
    if (!sheet) {
      initDatabaseIfEmpty();
      sheet = ss.getSheetByName(SHEET_MATERI);
    }

    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var idIndex = findColumnIndex(headers, 'id');
    if (idIndex === -1) idIndex = 0; // Fallback kolom pertama jika header tidak bernama id
    var createdAtIdx = findColumnIndex(headers, 'created_at');

    var isUpdate = false;
    var targetRow = -1;

    // Jika ID diberikan, cari baris untuk update
    if (materialData.id) {
      for (var i = 1; i < data.length; i++) {
        if (String(data[i][idIndex]).trim() === String(materialData.id).trim()) {
          isUpdate = true;
          targetRow = i + 1; // 1-based row index
          break;
        }
      }
    }

    var finalId = isUpdate ? materialData.id : 'STEM-' + Utilities.getUuid().substring(0, 8).toUpperCase();
    var now = Utilities.formatDate(new Date(), 'Asia/Makassar', 'yyyy-MM-dd HH:mm:ss');
    var existingCreatedAt = (isUpdate && targetRow > 1 && createdAtIdx !== -1) ? data[targetRow - 1][createdAtIdx] : null;

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
      isUpdate ? (existingCreatedAt || now) : now
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

    var ss = getActiveSpreadsheetSafe();
    var sheet = ss.getSheetByName(SHEET_MATERI);
    if (!sheet) return { success: false, error: 'Sheet Materi tidak ditemukan!' };

    var data = sheet.getDataRange().getValues();
    var idIndex = findColumnIndex(data[0], 'id');
    if (idIndex === -1) idIndex = 0;
    var foundRow = -1;

    for (var i = 1; i < data.length; i++) {
      if (String(data[i][idIndex]).trim() === String(id).trim()) {
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

    var ss = getActiveSpreadsheetSafe();
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
  var ss = getActiveSpreadsheetSafe();
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
  var ss = getActiveSpreadsheetSafe();
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
 * Format baris sheet menjadi objek JSON materi secara case-insensitive
 */
function formatMaterialRow(headers, row) {
  var obj = {};
  for (var j = 0; j < headers.length; j++) {
    var key = String(headers[j]).trim().toLowerCase();
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
  var ss = getActiveSpreadsheetSafe();

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
  var materiHeaders = [
    'id', 'stem_category', 'title', 'grade', 'media_type', 'media_url',
    'thumbnail_url', 'description', 'mission_goals', 'mission_steps',
    'mission_reflection', 'created_at'
  ];

  if (!materiSheet) {
    materiSheet = ss.insertSheet(SHEET_MATERI);
    materiSheet.appendRow(materiHeaders);
    materiSheet.getRange(1, 1, 1, materiHeaders.length).setFontWeight('bold').setBackground('#E2E8F0');
  }

  // AUTO-SEED: Jika sheet Materi masih kosong (hanya header atau 0 baris),
  // otomatis tulis seluruh 24 materi kurikulum STEM SD Kemdikbud lengkap
  if (materiSheet.getLastRow() <= 1) {
    var sampleMaterials = getCurriculumSampleMaterials();
    for (var m = 0; m < sampleMaterials.length; m++) {
      materiSheet.appendRow(sampleMaterials[m]);
    }
  }
}

/**
 * Menu kustom di Google Spreadsheet saat berkas dibuka oleh guru / admin
 */
function onOpen() {
  try {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('🌟 Portal STEM')
      .addItem('📥 Muat Ulang 24 Materi Kurikulum SD', 'forceSeedMaterials')
      .addItem('⚙️ Periksa & Perbaiki Sheet Database', 'initDatabaseIfEmpty')
      .addToUi();
  } catch (e) {
    // Abaikan jika dieksekusi di luar konteks UI Spreadsheet
  }
}

/**
 * Fungsi untuk memuat ulang 24 materi kurikulum STEM SD (bisa dipanggil dari Spreadsheet atau Admin Panel)
 */
function forceSeedMaterials(adminPin) {
  try {
    if (adminPin) {
      var pinCheck = verifyPin(adminPin);
      if (!pinCheck.success) return pinCheck;
    }
    initDatabaseIfEmpty();
    var ss = getActiveSpreadsheetSafe();
    var sheet = ss.getSheetByName(SHEET_MATERI);
    if (!sheet) return { success: false, error: 'Sheet Materi tidak ditemukan!' };

    // Hapus data materi lama (pertahankan baris header di baris 1)
    if (sheet.getLastRow() > 1) {
      sheet.deleteRows(2, sheet.getLastRow() - 1);
    }
    var samples = getCurriculumSampleMaterials();
    for (var i = 0; i < samples.length; i++) {
      sheet.appendRow(samples[i]);
    }
    return { 
      success: true, 
      count: samples.length, 
      message: 'Berhasil memuat ' + samples.length + ' materi kurikulum STEM SD!' 
    };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * Data master 24 materi kurikulum STEM SD Kemdikbud lengkap (Kelas 1 s.d. 6)
 */
function getCurriculumSampleMaterials() {
  return [
    // 1. Science
    ['STEM-SCI01', 'Science', 'Eksplorasi Anatomi Tubuh 3D & 5 Panca Indra', '1', 'Lab Maya', 'https://human.biodigital.com/', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', 'Laboratorium 3D interaktif untuk menjelajah organ tubuh manusia, panca indra (mata, telinga, kulit), kerangka tulang, dan sistem peredaran darah.', '1. Mengidentifikasi 5 panca indra manusia dan letak organnya secara 3 dimensi.\n2. Menjelaskan cara merawat panca indra dan tubuh.', '1. Buka laboratorium anatomi 3D BioDigital Human.\n2. Putar model 3D tubuh dan perbesar panca indra.\n3. Amati bagian organ dan catat fungsinya!', 'Mengapa menjaga kebersihan panca indra sangat penting untuk kesehatan tubuh kita?', '2026-10-26 08:00:00'],
    ['STEM-SCI02', 'Science', 'Percobaan Listrik Statis Balon & Sweater Ajaib', '2', 'Simulasi', 'https://phet.colorado.edu/sims/html/balloons-and-static-electricity/latest/balloons-and-static-electricity_all.html', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80', 'Laboratorium maya PhET: gesekkan balon ke sweater rajut wol untuk mengamati muatan listrik positif dan negatif yang saling tarik-menarik!', '1. Mengenal muatan listrik positif (+) dan negatif (-) secara visual.\n2. Memahami peristiwa listrik statis di sekitar kita.', '1. Buka simulasi Balon dan Listrik Statis PhET.\n2. Gosokkan balon ke baju wol beberapa kali.\n3. Dekatkan balon ke dinding dan amati gaya tariknya!', 'Mengapa balon yang sudah digosokkan ke rambut bisa menempel sendiri di dinding kamar?', '2026-10-26 08:05:00'],
    ['STEM-SCI03', 'Science', 'Eksplorasi Wujud Zat: Padat, Cair, dan Gas', '3', 'Simulasi', 'https://phet.colorado.edu/sims/html/states-of-matter-basics/latest/states-of-matter-basics_all.html', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80', 'Laboratorium maya PhET untuk mengamati molekul zat saat dipanaskan dan didinginkan (membeku, mencair, menguap).', '1. Membedakan karakteristik benda padat, cair, dan gas.\n2. Mengamati pergerakan partikel zat pada suhu panas dan dingin.', '1. Buka simulasi wujud zat PhET.\n2. Pilih molekul Air (Water).\n3. Geser tuas pemanas (Heat) dan amati bagaimana partikel bergerak saling menjauh menjadi uap!', 'Mengapa es batu yang dibiarkan di suhu ruangan lama-kelamaan mencair?', '2026-10-26 08:10:00'],
    ['STEM-SCI04', 'Science', 'Rahasia Fotosintesis: Mengapa Daun Berwarna Hijau?', '4', 'Simulasi', 'https://phet.colorado.edu/sims/html/molecules-and-light/latest/molecules-and-light_all.html', 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&auto=format&fit=crop&q=80', 'Temukan bagaimana klorofil menyerap cahaya matahari dan mengubah air serta karbon dioksida menjadi oksigen segar!', '1. Menjelaskan fungsi klorofil dalam proses fotosintesis tumbuhan.\n2. Mengidentifikasi peran tumbuhan sebagai penghasil oksigen di bumi.', '1. Buka laboratorium maya molekul dan cahaya PhET.\n2. Sorotkan cahaya pada molekul dan amati reaksinya.\n3. Simpulkan pentingnya sinar matahari bagi tanaman hijau!', 'Apa yang akan terjadi pada udara di bumi jika pohon-pohon hijau semakin berkurang?', '2026-10-26 08:15:00'],
    ['STEM-SCI05', 'Science', 'Virtual Tour Gunung Berapi & Lapisan Kerak Bumi', '5', 'Lab Maya', 'https://earth.google.com/web/search/Volcanoes', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80', 'Terbang keliling gunung berapi aktif di Indonesia dan dunia secara 3D menggunakan satelit Google Earth.', '1. Mengidentifikasi struktur gunung berapi (kawah, magma, lava).\n2. Memahami letak sabuk cincin api (ring of fire) di kepulauan Indonesia.', '1. Buka tautan jelajah 3D Google Earth.\n2. Telusuri kawah Gunung Bromo atau Krakatau.\n3. Amati kaldera dan bekas jalur lava dari citra satelit!', 'Mengapa tanah di sekitar lereng gunung berapi sangat subur untuk pertanian?', '2026-10-26 08:20:00'],
    ['STEM-SCI06', 'Science', 'Menjelajah Tata Surya & Orbit Planet Antariksa', '6', 'Simulasi', 'https://eyes.nasa.gov/apps/solar-system/', 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&auto=format&fit=crop&q=80', 'Eksplorasi interaktif 3D NASA Eyes: terbangkan satelit virtual mengitari Matahari, Bumi, Mars, hingga cincin Saturnus.', '1. Mengenal urutan 8 planet dalam sistem tata surya.\n2. Menjelaskan fenomena rotasi dan revolusi planet mengelilingi matahari.', '1. Buka simulasi antariksa NASA Eyes di browser.\n2. Klik planet Bumi dan Mars untuk melihat atmosfernya.\n3. Percepat waktu simulasi untuk mengamati pergerakan orbit planet!', 'Mengapa planet yang paling dekat dengan matahari memiliki waktu revolusi paling cepat?', '2026-10-26 08:25:00'],

    // 2. Technology
    ['STEM-TEC01', 'Technology', 'Bermain AI Ceria: Mesin Cerdas Penebak Gambar', '1', 'Simulasi', 'https://quickdraw.withgoogle.com/', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80', 'Bermain tebak gambar dengan kecerdasan buatan (Artificial Intelligence) dari Google! Cukup gambar dengan mouse/jari.', '1. Mengenal teknologi kecerdasan buatan (AI) secara visual.\n2. Melatih koordinasi motorik anak dalam menggambar objek sederhana.', '1. Klik Mulai di Quick, Draw! by Google.\n2. Gambar objek yang diminta dalam 20 detik.\n3. Perhatikan bagaimana jaringan saraf tiruan AI menebak gambarmu!', 'Bagaimana komputer bisa mengenali bahwa gambar coretanmu adalah sebuah pohon?', '2026-10-26 08:30:00'],
    ['STEM-TEC02', 'Technology', 'Logika Algoritma Labirin: Memandu Karakter Melangkah', '2', 'Simulasi', 'https://blockly.games/maze', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80', 'Belajar logika berpikir komputasional tingkat awal: susun balok perintah Maju, Belok Kiri, Belok Kanan.', '1. Memahami konsep instruksi berurutan (sequence) dalam pemrograman.\n2. Melatih logika pemecahan masalah (problem solving) secara terstruktur.', '1. Buka permainan labirin blok di Blockly Games.\n2. Susun balok: [Maju], [Belok Kiri], [Maju] untuk memandu avatar.\n3. Klik Jalankan Program dan amati hasilnya!', 'Mengapa komputer tidak bisa bergerak jika urutan perintah kita ada yang tertukar?', '2026-10-26 08:35:00'],
    ['STEM-TEC03', 'Technology', 'Animasi Kartun Perdanaku: Gerak Karakter Kucing Scratch', '3', 'Simulasi', 'https://scratch.mit.edu/projects/editor/', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80', 'Seret dan tempel balok warna-warni di Scratch MIT untuk membuat karakter kartun berjalan, bersuara, dan berganti kostum.', '1. Mengenal antarmuka pemrograman visual Scratch.\n2. Membuat animasi gerak sederhana menggunakan blok perintah.', '1. Buka editor online Scratch MIT.\n2. Tarik balok [Gerak 10 langkah] dan [Mainkan suara meow].\n3. Klik bendera hijau dan amati karakter kucingmu bergerak!', 'Jika kita ingin karakter bergerak selamanya, balok kontrol apa yang harus kita pasang?', '2026-10-26 08:40:00'],
    ['STEM-TEC04', 'Technology', 'Coding Petualangan Karakter Minecraft di Code.org', '4', 'Simulasi', 'https://code.org/minecraft', 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80', 'Pandu Steve atau Alex menjelajahi dunia Minecraft menggunakan logika perulangan (loops) dan kondisi (if-else).', '1. Memahami konsep perulangan (loop) untuk perintah berulang.\n2. Menyelesaikan teka-teki logika coding bertema petualangan Minecraft.', '1. Buka petualangan Minecraft di Code.org.\n2. Pilih karakter Steve atau Alex.\n3. Gunakan blok perulangan [Ulangi 5 kali: Tebang pohon] untuk menebang kayu!', 'Mengapa menggunakan blok perulangan membuat kode kita jauh lebih ringkas?', '2026-10-26 08:45:00'],
    ['STEM-TEC05', 'Technology', 'Desain Rumah 3D Digital di Browser (Tinkercad)', '5', 'Simulasi', 'https://www.tinkercad.com/', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=80', 'Menjadi arsitek cilik! Gabungkan balok, silinder, dan atap piramida 3D di Tinkercad untuk merancang bangunan impian.', '1. Mengenal konsep pemodelan spasial 3 dimensi (sumbu X, Y, Z).\n2. Melatih kreativitas desain prototipe bangunan di web browser.', '1. Buka kanvas 3D Tinkercad di browser.\n2. Tarik bentuk Kotak ke atas Workplane.\n3. Pasang bentuk Atap prisma di atas kotak dan beri warna sesuai seleramu!', 'Apa perbedaan antara menggambar rumah di kertas 2D dengan merancangnya di ruang 3D?', '2026-10-26 08:50:00'],
    ['STEM-TEC06', 'Technology', 'Merancang Game Edukasi Interaktif Multi-Level di Scratch', '6', 'Simulasi', 'https://scratch.mit.edu/projects/editor/', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80', 'Rancang game tangkap apel jatuh menggunakan variabel skor, sensor sentuh (sensing), dan kondisi menang-kalah.', '1. Memahami penggunaan Variabel (Score) dan Operator Logika.\n2. Mengintegrasikan sensor sentuh dalam mekanisme game edukatif.', '1. Buat dua sprite: Keranjang dan Apel.\n2. Buat variabel bernama Skor.\n3. Beri kode: jika Apel menyentuh Keranjang, tambah Skor sebesar 1!', 'Bagaimana cara mengatur tingkat kesulitan game agar semakin lama apel jatuh semakin cepat?', '2026-10-26 08:55:00'],

    // 3. Engineering
    ['STEM-ENG01', 'Engineering', 'Keseimbangan Menara Balok & Ayunan Jungkat-Jungkit', '1', 'Simulasi', 'https://phet.colorado.edu/sims/html/balancing-act/latest/balancing-act_all.html', 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80', 'Laboratorium maya PhET untuk menguji keseimbangan papan ayunan: letakkan balok berat dan ringan pada jarak berbeda!', '1. Mengenal konsep titik tumpu dan keseimbangan beban.\n2. Mengamati pengaruh jarak benda dari titik tengah jungkat-jungkit.', '1. Buka simulasi Balancing Act PhET.\n2. Taruh tong sampah 10 kg di sisi kanan papan ayunan.\n3. Cari posisi balok 5 kg di sisi kiri agar papan ayunan seimbang sejajar!', 'Mengapa anak yang badannya lebih ringan harus duduk lebih jauh ke ujung agar seimbang?', '2026-10-26 09:00:00'],
    ['STEM-ENG02', 'Engineering', 'Desain Perahu Apung Anti Tenggelam (Hukum Apung)', '2', 'Simulasi', 'https://phet.colorado.edu/sims/html/buoyancy/latest/buoyancy_all.html', 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?w=600&auto=format&fit=crop&q=80', 'Mengapa perahu kayu besar bisa mengapung sedangkan koin kecil tenggelam? Uji massa jenis benda di kolam virtual.', '1. Menjelaskan peristiwa terapung, melayang, dan tenggelam.\n2. Mengidentifikasi hubungan antara bentuk lambung kapal dengan daya apung.', '1. Buka simulasi Buoyancy PhET.\n2. Jatuhkan balok kayu, apel, dan balok besi ke dalam air virtual.\n3. Perhatikan gaya angkat air yang mendorong benda ke permukaan!', 'Mengapa kapal laut yang terbuat dari besi berat tetap bisa mengapung di lautan luas?', '2026-10-26 09:05:00'],
    ['STEM-ENG03', 'Engineering', 'Pesawat Sederhana: Mengangkat Beban dengan Katrol & Tuas', '3', 'Simulasi', 'https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80', 'Eksplorasi tuas pengungkit, katrol, dan bidang miring untuk memudahkan manusia memindahkan benda yang sangat berat.', '1. Memahami prinsip kerja tuas dan keuntungan mekanis pesawat sederhana.\n2. Mengenal contoh pesawat sederhana di sekitar (gunting, linggis, katrol).', '1. Buka simulasi gaya dan gerak PhET.\n2. Dorong peti seberat 100 kg di lantai datar.\n3. Bandingkan tenaga yang dibutuhkan saat menggunakan bidang miring!', 'Mengapa menaikkan drum minyak ke bak truk lebih mudah menggunakan papan kayu miring?', '2026-10-26 09:10:00'],
    ['STEM-ENG04', 'Engineering', 'Arsitektur Jembatan Rangka Baja Kokoh Penahan Beban', '4', 'Game', 'https://armorgames.com/play/4962/cargo-bridge', 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&auto=format&fit=crop&q=80', 'Menjadi insinyur sipil! Rancang jembatan rangka segitiga (truss bridge) melintasi jurang dan uji apakah kuat dilewati truk.', '1. Mengenal struktur rangka segitiga sebagai struktur teknik paling kokoh.\n2. Mengoptimalkan anggaran bahan konstruksi agar efisien namun tetap kokoh.', '1. Masuk ke game konstruksi jembatan Cargo Bridge.\n2. Hubungkan simpul tiang menggunakan balok kayu berbentuk segitiga.\n3. Uji jembatan dengan pekerja pembawa beban. Perbaiki rangka yang patah!', 'Mengapa bentuk segitiga lebih kokoh daripada bentuk persegi saat menahan tekanan beban?', '2026-10-26 09:15:00'],
    ['STEM-ENG05', 'Engineering', 'Laboratorium Sirkuit Listrik Rumah Pintar Virtual', '5', 'Simulasi', 'https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_all.html', 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=600&auto=format&fit=crop&q=80', 'Rangkai kabel, baterai, sakelar, dan lampu bohlam di PhET. Uji coba rangkaian seri dan paralel tanpa takut tersetrum!', '1. Membedakan karakteristik rangkaian listrik seri dan paralel.\n2. Mengidentifikasi konduktor dan isolator listrik di laboratorium virtual.', '1. Buka simulasi Circuit Construction Kit DC PhET.\n2. Hubungkan 1 baterai, sakelar, dan 2 lampu dalam satu jalur lurus (seri).\n3. Tutup sakelar dan amati apa yang terjadi jika salah satu lampu dilepas!', 'Mengapa instalasi lampu di rumah-rumah dipasang menggunakan rangkaian paralel?', '2026-10-26 09:20:00'],
    ['STEM-ENG06', 'Engineering', 'Rancang Bangun Sekolah Impian Ramah Lingkungan', '6', 'Lab Maya', 'https://education.minecraft.net/', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80', 'Kolaborasi rekayasa arsitektur di Minecraft Education / Tinkercad: lengkapi sekolah dengan panel surya dan taman atap.', '1. Merancang tata ruang bangunan publik dengan konsep ramah energi (green building).\n2. Mengintegrasikan teknologi energi terbarukan (panel surya, ventilasi silang).', '1. Buka kanvas Minecraft Education atau Tinkercad 3D.\n2. Bangun ruang kelas dengan jendela besar untuk pencahayaan alami matahari.\n3. Pasang panel surya virtual di atap sekolah sebagai sumber listrik bersih!', 'Bagaimana desain ventilasi yang baik dapat menghemat penggunaan pendingin ruangan (AC)?', '2026-10-26 09:25:00'],

    // 4. Mathematics
    ['STEM-MAT01', 'Mathematics', 'Eksplorasi Bentuk Geometri & Sudut Ceria di GeoGebra', '1', 'Simulasi', 'https://www.geogebra.org/geometry', 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&auto=format&fit=crop&q=80', 'Laboratorium geometri GeoGebra: melukis lingkaran, segitiga, persegi, menghubungkan titik sudut, dan mewarnai bangun datar.', '1. Mengidentifikasi bentuk bangun datar dasar (lingkaran, segitiga, segiempat).\n2. Melatih ketelitian anak dalam menghubungkan garis dan titik sudut.', '1. Buka kanvas geometri GeoGebra.\n2. Pilih alat Segi Banyak dan buat aneka bangun datar.\n3. Beri warna-warni ceria!', 'Ada berapa titik sudut yang dimiliki oleh sebuah segitiga dibandingkan dengan persegi?', '2026-10-26 09:30:00'],
    ['STEM-MAT02', 'Mathematics', 'Eksplorasi Tangram 2D & Jam Dinding Virtual', '2', 'Simulasi', 'https://mathigon.org/polypad#tangram', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80', 'Susun 7 potongan puzzle ajaib Tangram di Mathigon Polypad menjadi bentuk hewan dan putar jarum jam virtual untuk membaca waktu.', '1. Menyusun berbagai bentuk siluet menggunakan 7 potongan geometri tangram.\n2. Membaca dan menunjukkan waktu pada jam analog (jarum pendek dan panjang).', '1. Buka kanvas Polypad Tangram di browser.\n2. Putar dan susun 2 segitiga besar dan 1 persegi hingga membentuk burung.\n3. Geser jarum jam ke angka 07.00 saat bel masuk sekolah berbunyi!', 'Berapa menit yang dilewati jika jarum panjang jam berputar penuh dari angka 12 kembali ke 12?', '2026-10-26 09:35:00'],
    ['STEM-MAT03', 'Mathematics', 'Pecahan Visual Warna-Warni: Pizza & Cokelat Pecahan', '3', 'Simulasi', 'https://phet.colorado.edu/sims/html/fractions-intro/latest/fractions-intro_all.html', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80', 'Belajar pecahan jadi konkret dan mudah dipahami: iris pizza khayalan menjadi pecahan 1/2, 1/3, 1/4, dan 3/4 di simulasi PhET.', '1. Memvisualisasikan konsep pecahan sebagai bagian dari benda utuh.\n2. Membandingkan nilai pecahan sederhana berpenyebut sama.', '1. Buka simulasi Fractions Intro PhET.\n2. Pilih mode Intro dan atur pembagi pizza menjadi 4 bagian.\n3. Ambil 2 potong pizza dan perhatikan bentuk angka pecahannya: 2/4 sama dengan 1/2!', 'Jika kamu memiliki cokelat dan ingin berbagi sama rata ke 3 teman, berapa bagian masing-masing?', '2026-10-26 09:40:00'],
    ['STEM-MAT04', 'Mathematics', 'Merancang Luas & Keliling Taman Sekolah Interaktif', '4', 'Simulasi', 'https://phet.colorado.edu/sims/html/area-builder/latest/area-builder_all.html', 'https://images.unsplash.com/photo-1584697964190-705b893683f1?w=600&auto=format&fit=crop&q=80', 'Susun petak-petak hijau di PhET Area Builder untuk membuat taman dengan luas dan keliling tertentu.', '1. Menghitung luas bangun datar dengan satuan petak persegi.\n2. Memahami perbedaan antara luas (permukaan) dan keliling (panjang tepian).', '1. Buka simulasi Area Builder PhET.\n2. Susun 12 petak balok hijau membentuk persegi panjang (panjang 4, lebar 3).\n3. Hitung keliling pagar di sekelilingnya dan periksa hasilnya di kotak centang!', 'Apakah dua bangun datar yang memiliki luas sama selalu memiliki keliling yang sama juga?', '2026-10-26 09:45:00'],
    ['STEM-MAT05', 'Mathematics', 'Tantangan Logika Bilangan & Pecahan Desimal di Matific', '5', 'Game', 'https://www.matific.com/', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80', 'Petualangan matematika interaktif Matific: memecahkan teka-teki pecahan desimal, persen, dan nilai tempat bilangan.', '1. Mengubah bentuk pecahan biasa menjadi desimal dan persen.\n2. Melatih nalar berhitung cepat dalam pemecahan masalah sehari-hari.', '1. Masuk ke arena permainan matematika Matific.\n2. Selesaikan misi mengisi tangki air desimal: isi tangki hingga level 0,75 liter.\n3. Catat skor bintang yang berhasil kamu peroleh di papan misi!', 'Mengapa pecahan 3/4 memiliki nilai yang sama persis dengan angka desimal 0,75 dan 75%?', '2026-10-26 09:50:00'],
    ['STEM-MAT06', 'Mathematics', 'Eksplorasi Bangun Ruang 3D & Jaring-Jaring Kubus Virtual', '6', 'Simulasi', 'https://mathigon.org/polypad#solids', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80', 'Buka dan tutup jaring-jaring kubus, balok, prisma, dan limas secara 3D di Mathigon Polypad. Hitung rusuk, titik sudut, dan volumenya!', '1. Menganalisis sifat-sifat bangun ruang (kubus, balok, prisma, tabung).\n2. Membuka jaring-jaring bangun ruang 3D menjadi pola 2D secara interaktif.', '1. Buka menu 3D Solids di Mathigon Polypad.\n2. Tarik sebuah Kubus 3D ke papan kerja.\n3. Klik tombol Unfold dan saksikan kubus merekah terbuka menjadi jaring-jaring 6 persegi!', 'Ada berapa banyak variasi bentuk jaring-jaring yang berbeda untuk membuat kubus sempurna?', '2026-10-26 09:55:00']
  ];
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
