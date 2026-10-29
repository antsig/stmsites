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

    // Jika daftar materi masih kosong (misal sheet baru dibuat), lakukan auto-seed 144 materi
    if (!materials || materials.length === 0) {
      try {
        forceSeedMaterials();
        materials = getMaterialsList();
      } catch (seedErr) {
        console.warn('Auto-seed fallback: ' + seedErr);
      }
    }

    // Sembunyikan PIN admin di respon publik
    var safeSettings = Object.assign({}, settings);
    delete safeSettings.admin_pin;

    return {
      success: true,
      data: {
        settings: safeSettings,
        materials: (materials && materials.length > 0) ? materials : []
      }
    };
  } catch (err) {
    console.warn('getInitialData fallback: ' + err);
    var defaultSettings = {
      school_name: 'SD NEGERI HARAPAN BANGSA',
      academic_year: '2026/2027',
      slogan: 'Eksplorasi Sains, Teknologi, Rekayasa, dan Matematika Bersama!',
      logo_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
      contact_wa: '6281234567890',
      contact_email: 'stem.harapanbangsa@sekolah.sch.id',
      logo_science: '',
      logo_technology: '',
      logo_engineering: '',
      logo_mathematics: ''
    };
    var fallbackMaterials = [];
    try {
      var sampleRows = getCurriculumSampleMaterials();
      var headers = ['id', 'stem_category', 'title', 'grade', 'media_type', 'media_url', 'thumbnail_url', 'description', 'mission_goals', 'mission_steps', 'mission_reflection', 'created_at'];
      for (var k = 0; k < sampleRows.length; k++) {
        fallbackMaterials.push(formatMaterialRow(headers, sampleRows[k]));
      }
    } catch (e) {}

    return {
      success: true,
      isFallback: true,
      error: err.toString(),
      data: {
        settings: defaultSettings,
        materials: fallbackMaterials
      }
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
 * Normalisasi nama key pengaturan secara fleksibel dan toleran
 */
function normalizeSettingKey(k) {
  if (!k) return '';
  var raw = String(k).trim().toLowerCase().replace(/[\s\-_]/g, '');
  if (raw === 'schoolname' || raw === 'namasekolah' || raw === 'sekolah') return 'school_name';
  if (raw === 'academicyear' || raw === 'tahunajaran' || raw === 'tahun') return 'academic_year';
  if (raw === 'slogan' || raw === 'tagline' || raw === 'motto') return 'slogan';
  if (raw === 'logourl' || raw === 'logo' || raw === 'logosekolah') return 'logo_url';
  if (raw === 'contactwa' || raw === 'kontakwa' || raw === 'wa' || raw === 'whatsapp' || raw === 'nowa' || raw === 'nomorwa' || raw === 'telepon' || raw === 'nohp') return 'contact_wa';
  if (raw === 'contactemail' || raw === 'kontakemail' || raw === 'email' || raw === 'emailsekolah' || raw === 'surel') return 'contact_email';
  if (raw === 'adminpin' || raw === 'pin' || raw === 'pinadmin') return 'admin_pin';
  if (raw === 'logoscience' || raw === 'logosains' || raw === 'logoipa') return 'logo_science';
  if (raw === 'logotechnology' || raw === 'logoteknologi') return 'logo_technology';
  if (raw === 'logoengineering' || raw === 'logorekayasa' || raw === 'logoteknik') return 'logo_engineering';
  if (raw === 'logomathematics' || raw === 'logomatematika' || raw === 'logomtk') return 'logo_mathematics';
  return String(k).trim();
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

    var displayData = sheet.getDataRange().getDisplayValues();
    var existingKeys = {};
    for (var i = 1; i < displayData.length; i++) {
      var rowKey = String(displayData[i][0] || '').trim();
      if (rowKey) {
        existingKeys[rowKey] = i + 1;
        var norm = normalizeSettingKey(rowKey);
        if (norm) existingKeys[norm] = i + 1;
      }
    }

    // Perbarui key yang diberikan dengan format teks murni (@)
    for (var key in newSettings) {
      if (newSettings.hasOwnProperty(key)) {
        var val = String(newSettings[key] !== undefined && newSettings[key] !== null ? newSettings[key] : '').trim();
        var targetRow = existingKeys[key] || existingKeys[normalizeSettingKey(key)];
        if (targetRow) {
          sheet.getRange(targetRow, 2).setNumberFormat('@').setValue(val);
        } else {
          sheet.appendRow([key, val]);
          var newRow = sheet.getLastRow();
          sheet.getRange(newRow, 2).setNumberFormat('@').setValue(val);
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
 * Mengambil daftar pengaturan dalam format objek Key-Value (Teks Murni)
 */
function getSettingsMap() {
  var ss = getActiveSpreadsheetSafe();
  var sheet = ss.getSheetByName(SHEET_SETTINGS);
  if (!sheet) return {};

  var displayData = sheet.getDataRange().getDisplayValues();
  var rawData = sheet.getDataRange().getValues();
  var settings = {};
  for (var i = 1; i < displayData.length; i++) {
    var rawKey = String(displayData[i][0] || '').trim();
    if (!rawKey) continue;
    var normKey = normalizeSettingKey(rawKey);
    var val = String(displayData[i][1] || '').trim();
    if (!val && rawData[i] && rawData[i][1] !== undefined && rawData[i][1] !== null) {
      val = String(rawData[i][1]).trim();
    }
    settings[normKey] = val;
    if (normKey !== rawKey) {
      settings[rawKey] = val;
    }
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
    var rawKey = String(headers[j]).trim().toLowerCase().replace(/[\s\-_]/g, '');
    var val = row[j];
    var strVal = val !== undefined && val !== null ? String(val).trim() : '';

    var standardKey = rawKey;
    if (rawKey === 'id' || rawKey === 'kode' || rawKey === 'kodemateri') standardKey = 'id';
    else if (rawKey === 'stemcategory' || rawKey === 'category' || rawKey === 'kategori' || rawKey === 'kategoristem') standardKey = 'stem_category';
    else if (rawKey === 'title' || rawKey === 'judul' || rawKey === 'namamateri' || rawKey === 'materi') standardKey = 'title';
    else if (rawKey === 'grade' || rawKey === 'kelas' || rawKey === 'jenjang') standardKey = 'grade';
    else if (rawKey === 'mediatype' || rawKey === 'jenismedia' || rawKey === 'tipemedia' || rawKey === 'media') standardKey = 'media_type';
    else if (rawKey === 'mediaurl' || rawKey === 'linkmedia' || rawKey === 'url' || rawKey === 'link') standardKey = 'media_url';
    else if (rawKey === 'thumbnailurl' || rawKey === 'thumbnail' || rawKey === 'gambar' || rawKey === 'foto') standardKey = 'thumbnail_url';
    else if (rawKey === 'description' || rawKey === 'deskripsi' || rawKey === 'ringkasan' || rawKey === 'keterangan') standardKey = 'description';
    else if (rawKey === 'missiongoals' || rawKey === 'tujuan' || rawKey === 'tujuanmisi') standardKey = 'mission_goals';
    else if (rawKey === 'missionsteps' || rawKey === 'langkah' || rawKey === 'langkahmisi') standardKey = 'mission_steps';
    else if (rawKey === 'missionreflection' || rawKey === 'refleksi' || rawKey === 'pertanyaanrefleksi') standardKey = 'mission_reflection';
    else if (rawKey === 'createdat' || rawKey === 'tanggal' || rawKey === 'waktu') standardKey = 'created_at';

    if (standardKey === 'grade') {
      var digitMatch = strVal.match(/\d+/);
      obj['grade'] = digitMatch ? digitMatch[0] : strVal;
    } else if (standardKey === 'stem_category') {
      var catLow = strVal.toLowerCase();
      if (catLow.indexOf('sci') !== -1 || catLow.indexOf('sains') !== -1 || catLow.indexOf('ipa') !== -1 || catLow.indexOf('alam') !== -1) {
        obj['stem_category'] = 'Science';
      } else if (catLow.indexOf('tec') !== -1 || catLow.indexOf('tekno') !== -1 || catLow.indexOf('komput') !== -1 || catLow.indexOf('coding') !== -1) {
        obj['stem_category'] = 'Technology';
      } else if (catLow.indexOf('eng') !== -1 || catLow.indexOf('rekayasa') !== -1 || catLow.indexOf('teknik') !== -1 || catLow.indexOf('robot') !== -1) {
        obj['stem_category'] = 'Engineering';
      } else if (catLow.indexOf('mat') !== -1 || catLow.indexOf('hitung') !== -1 || catLow.indexOf('angka') !== -1) {
        obj['stem_category'] = 'Mathematics';
      } else {
        obj['stem_category'] = strVal || 'Science';
      }
    } else {
      obj[standardKey] = strVal;
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
    settingsSheet.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#E2E8F0');
  }

  // Auto-Repair: Pastikan semua baris pengaturan dasar terdaftar di sheet Settings
  var currentDisplay = settingsSheet.getDataRange().getDisplayValues();
  var registeredKeys = {};
  for (var k = 1; k < currentDisplay.length; k++) {
    var rawK = String(currentDisplay[k][0] || '').trim();
    if (rawK) {
      registeredKeys[rawK.toLowerCase()] = true;
      registeredKeys[normalizeSettingKey(rawK).toLowerCase()] = true;
    }
  }

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
    var dKey = defaultSettings[s][0];
    if (!registeredKeys[dKey.toLowerCase()]) {
      settingsSheet.appendRow(defaultSettings[s]);
      var addedRow = settingsSheet.getLastRow();
      settingsSheet.getRange(addedRow, 2).setNumberFormat('@').setValue(defaultSettings[s][1]);
    }
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
  // otomatis tulis seluruh 144 materi kurikulum STEM SD Kemdikbud lengkap
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
 * Fungsi untuk memuat ulang 144 materi kurikulum STEM SD (bisa dipanggil dari Spreadsheet atau Admin Panel)
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
 * Data master 144 materi kurikulum STEM SD (Kelas 1 s.d. 6 @ 6 materi) Kemdikbud lengkap (Kelas 1 s.d. 6)
 */
function getCurriculumSampleMaterials() {
  return [
    [
      "STEM-SCI-K1-01",
      "Science",
      "Mengenal 5 Panca Indra & Bagian Tubuh",
      "1",
      "Lab Maya",
      "https://phet.colorado.edu/sims/html/color-vision/latest/color-vision_all.html",
      "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
      "Belajar mengenal mata, telinga, hidung, lidah, dan kulit melalui simulasi visual panca indra yang menyenangkan.",
      "1. Mengidentifikasi 5 panca indra manusia beserta fungsinya.\n2. Menjelaskan cara merawat panca indra agar tetap sehat.",
      "1. Buka simulasi penglihatan warna PhET.\n2. Nyalakan senter warna dan perhatikan mata menerima berkas cahaya.\n3. Diskusikan fungsi mata dan indra lainnya bersama teman!",
      "Mengapa kita harus bersyukur memiliki panca indra yang sehat dan bagaimana cara merawatnya?",
      "2026-10-29 08:00:00"
    ],
    [
      "STEM-SCI-K1-02",
      "Science",
      "Benda Hidup dan Benda Tak Hidup di Sekitar Kita",
      "1",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/states-of-matter-basics/latest/states-of-matter-basics_all.html",
      "https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?w=600&auto=format&fit=crop&q=80",
      "Amati perbedaan ciri-ciri benda hidup (tumbuh, bergerak, bernapas) dan benda tak hidup di lingkungan sekolah dan rumah.",
      "1. Membedakan ciri-ciri benda hidup dan benda tak hidup.\n2. Mengelompokkan berbagai benda di kelas ke dalam kategori yang tepat.",
      "1. Amati benda-benda padat dan cair di simulasi.\n2. Temukan perbedaan antara batu dengan tanaman hias di halaman.\n3. Catat 3 benda hidup dan 3 benda tak hidup di buku catatanmu!",
      "Apakah air dan udara termasuk benda hidup atau tak hidup? Mengapa?",
      "2026-10-29 08:05:00"
    ],
    [
      "STEM-SCI-K1-03",
      "Science",
      "Mengenal Bagian Tubuh Hewan dan Suaranya",
      "1",
      "Lab Maya",
      "https://phet.colorado.edu/sims/html/sound-waves/latest/sound-waves_all.html",
      "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=600&auto=format&fit=crop&q=80",
      "Mengenal kucing, burung, dan ikan: bagian tubuhnya (kaki, sayap, sirip) serta cara mereka bergerak dan bersuara.",
      "1. Mengidentifikasi bagian tubuh hewan dan fungsinya untuk bergerak.\n2. Menirukan ragam bunyi dan suara hewan peliharaan.",
      "1. Buka simulasi gelombang suara PhET.\n2. Coba bunyikan berbagai frekuensi suara.\n3. Pasangkan gambar hewan dengan alat geraknya yang tepat!",
      "Mengapa burung memiliki sayap sedangkan ikan memiliki sirip?",
      "2026-10-29 08:10:00"
    ],
    [
      "STEM-SCI-K1-04",
      "Science",
      "Mengenal Bentuk Daun, Batang, dan Akar Tumbuhan",
      "1",
      "Lab Maya",
      "https://phet.colorado.edu/sims/html/molecules-and-light/latest/molecules-and-light_all.html",
      "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format&fit=crop&q=80",
      "Jelajahi bagian tanaman hijau: akar yang kokoh di tanah, batang yang tegak, dan daun yang menyerap sinar matahari cerah.",
      "1. Mengenal bagian-bagian pokok tanaman (akar, batang, daun, bunga).\n2. Memahami pentingnya air dan sinar matahari bagi tanaman.",
      "1. Amati tanaman di halaman sekolah.\n2. Gambar sehelai daun dan tunjukkan urat-urat daunnya.\n3. Siram tanaman dengan air secukupnya setiap pagi!",
      "Apa yang terjadi pada daun tanaman jika tidak pernah terkena sinar matahari?",
      "2026-10-29 08:15:00"
    ],
    [
      "STEM-SCI-K1-05",
      "Science",
      "Eksplorasi Siang, Malam, dan Bayangan Matahari",
      "1",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/bending-light/latest/bending-light_all.html",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
      "Mengapa ada waktu siang yang terang dan malam yang gelap? Temukan rahasia bayangan tubuh saat disinari matahari.",
      "1. Membedakan suasana siang hari dan malam hari.\n2. Menjelaskan proses terbentuknya bayangan saat cahaya terhalang.",
      "1. Buka simulasi pembiasan cahaya PhET.\n2. Sorotkan berkas cahaya dan amati arah bayangannya.\n3. Praktikkan di lapangan: amati panjang bayanganmu di pagi dan siang hari!",
      "Mengapa bayangan tubuh kita di pagi hari lebih panjang dibandingkan saat tengah hari?",
      "2026-10-29 08:20:00"
    ],
    [
      "STEM-SCI-K1-06",
      "Science",
      "Mengamati Cuaca Cerah, Berawan, dan Hujan",
      "1",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/states-of-matter/latest/states-of-matter_all.html",
      "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600&auto=format&fit=crop&q=80",
      "Amati perubahan cuaca harian: matahari bersinar cerah, awan putih berganti mendung gelap, hingga butiran hujan menyejukkan bumi.",
      "1. Mengidentifikasi tanda-tanda cuaca cerah, berawan, dan hujan.\n2. Memilih pakaian dan perlengkapan yang cocok untuk setiap cuaca.",
      "1. Buka simulasi partikel uap air di PhET.\n2. Amati bagaimana uap air berkumpul saat suhu mendingin.\n3. Buat simbol cuaca hari ini di kalender belajarmu!",
      "Perlengkapan apa yang harus kita siapkan saat langit mulai mendung gelap?",
      "2026-10-29 08:25:00"
    ],
    [
      "STEM-SCI-K2-01",
      "Science",
      "Percobaan Listrik Statis Balon & Sweater Ajaib",
      "2",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/balloons-and-static-electricity/latest/balloons-and-static-electricity_all.html",
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
      "Laboratorium maya PhET: gesekkan balon ke sweater rajut wol untuk mengamati muatan listrik positif dan negatif yang saling tarik-menarik!",
      "1. Mengenal muatan listrik positif (+) dan negatif (-) secara visual.\n2. Memahami peristiwa listrik statis di sekitar kita.",
      "1. Buka simulasi Balon dan Listrik Statis PhET.\n2. Gosokkan balon ke baju wol beberapa kali.\n3. Dekatkan balon ke dinding dan amati gaya tariknya!",
      "Mengapa balon yang sudah digosokkan ke rambut bisa menempel sendiri di dinding kamar?",
      "2026-10-29 08:30:00"
    ],
    [
      "STEM-SCI-K2-02",
      "Science",
      "Pertumbuhan Tanaman dari Biji Kacang Hijau",
      "2",
      "Lab Maya",
      "https://phet.colorado.edu/sims/html/molecules-and-light/latest/molecules-and-light_all.html",
      "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=600&auto=format&fit=crop&q=80",
      "Saksikan keajaiban perkecambahan biji: dari tunas kecil, akar serabut yang mencari air, hingga daun pertama mekar sempurna.",
      "1. Mengurutkan tahapan pertumbuhan biji menjadi kecambah.\n2. Mengidentifikasi kebutuhan utama biji untuk tumbuh (air, udara, kehangatan).",
      "1. Siapkan kapas basah dan 3 butir biji kacang hijau di cawan.\n2. Letakkan di tempat yang cukup cahaya.\n3. Amati dan ukur panjang tunas pada hari ke-1, ke-3, dan ke-5!",
      "Mengapa biji yang ditaruh di tempat kering tanpa air sama sekali tidak mau berkecambah?",
      "2026-10-29 08:35:00"
    ],
    [
      "STEM-SCI-K2-03",
      "Science",
      "Sifat Campuran Benda Padat dan Cair (Gula & Pasir)",
      "2",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/states-of-matter-basics/latest/states-of-matter-basics_all.html",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
      "Uji kelarutan benda di dalam air: manakah benda yang larut menyatu sempurna dan benda yang mengendap di dasar gelas?",
      "1. Membedakan zat yang larut sempurna dan zat yang tidak larut dalam air.\n2. Menjelaskan sifat campuran homogen dan heterogen sederhana.",
      "1. Buka simulasi wujud zat PhET.\n2. Coba masukkan gula ke dalam air dan aduk perlahan.\n3. Lakukan hal yang sama pada pasir dan bandingkan hasilnya!",
      "Kemanakah butiran gula pergi saat diaduk dalam segelas air hangat?",
      "2026-10-29 08:40:00"
    ],
    [
      "STEM-SCI-K2-04",
      "Science",
      "Energi Panas Matahari dan Manfaatnya Bagi Kehidupan",
      "2",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/energy-forms-and-changes/latest/energy-forms-and-changes_all.html",
      "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80",
      "Matahari memancarkan panas dan cahaya yang mengeringkan pakaian, menghangatkan tubuh, dan membantu petani menjemur padi.",
      "1. Menyebutkan sumber-sumber energi panas di lingkungan sekitar.\n2. Menjelaskan manfaat sinar matahari bagi manusia dan alam.",
      "1. Buka simulasi bentuk energi PhET.\n2. Tarik termometer ke dekat sumber cahaya matahari.\n3. Catat kenaikan suhu saat energi panas diserap benda!",
      "Apa yang akan terjadi jika bumi tidak mendapatkan pancaran sinar matahari selama satu minggu?",
      "2026-10-29 08:45:00"
    ],
    [
      "STEM-SCI-K2-05",
      "Science",
      "Daur Hidup Kupu-Kupu: Dari Ulat Menjadi Sayap Indah",
      "2",
      "Lab Maya",
      "https://earth.google.com/web/",
      "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&auto=format&fit=crop&q=80",
      "Eksplorasi metamorfosis sempurna kupu-kupu: telur mungil pada daun, ulat pemakan rakus, kepompong yang tenang, hingga kupu-kupu terbang elok.",
      "1. Menyusun urutan 4 siklus daur hidup kupu-kupu secara berurutan.\n2. Memahami peran penting kupu-kupu dalam membantu penyerbukan bunga.",
      "1. Amati gambar fase metamorfosis kupu-kupu.\n2. Urutkan: Telur -> Ulat -> Kepompong -> Kupu-kupu dewasa.\n3. Buat sketsa siklus kupu-kupu pada buku gambarmu!",
      "Mengapa ulat harus tidur lama di dalam kepompong sebelum bisa terbang bebas?",
      "2026-10-29 08:50:00"
    ],
    [
      "STEM-SCI-K2-06",
      "Science",
      "Getaran Sumber Bunyi & Perambatan Suara",
      "2",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/waves-intro/latest/waves-intro_all.html",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
      "Pegang tenggorokanmu saat berbicara, terasa ada yang bergetar bukan? Semua bunyi yang kita dengar berasal dari benda yang bergetar.",
      "1. Membuktikan bahwa bunyi dihasilkan oleh benda yang bergetar.\n2. Mengidentifikasi media perambatan bunyi melalui udara.",
      "1. Buka simulasi gelombang bunyi PhET.\n2. Gerakkan pengeras suara dan amati riak gelombang merambat di udara.\n3. Coba petik senar karet gelang dan amati getarannya!",
      "Apakah suara lonceng bisa terdengar jika tidak ada udara di sekitar kita?",
      "2026-10-29 08:55:00"
    ],
    [
      "STEM-SCI-K3-01",
      "Science",
      "Eksplorasi Wujud Zat: Padat, Cair, dan Gas",
      "3",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/states-of-matter-basics/latest/states-of-matter-basics_all.html",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
      "Laboratorium maya PhET untuk mengamati molekul zat saat dipanaskan dan didinginkan (membeku, mencair, menguap).",
      "1. Membedakan karakteristik benda padat, cair, dan gas.\n2. Mengamati pergerakan partikel zat pada suhu panas dan dingin.",
      "1. Buka simulasi wujud zat PhET.\n2. Pilih molekul Air (Water).\n3. Geser tuas pemanas (Heat) dan amati partikel bergerak menjauh menjadi uap!",
      "Mengapa es batu yang dibiarkan di suhu ruangan lama-kelamaan mencair?",
      "2026-10-29 09:00:00"
    ],
    [
      "STEM-SCI-K3-02",
      "Science",
      "Gerak Benda & Pengaruh Gaya Gesek",
      "3",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80",
      "Uji gaya dorong dan gaya tarik pada balok kayu di atas lantai licin (es) vs lantai kasar bertanah.",
      "1. Memahami konsep gaya dorong, tarik, dan gaya gesek.\n2. Menjelaskan faktor yang membuat benda bergerak lebih lambat atau cepat.",
      "1. Buka simulasi Forces and Motion Basics PhET.\n2. Berikan gaya dorong 100 Newton pada peti.\n3. Ubah permukaan lantai menjadi es dan perhatikan betapa mudahnya meluncur!",
      "Mengapa sol sepatu olahraga dibuat beralur bergerigi dan tidak licin?",
      "2026-10-29 09:05:00"
    ],
    [
      "STEM-SCI-K3-03",
      "Science",
      "Siklus Daur Air Alami: Evaporasi & Presipitasi",
      "3",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/states-of-matter/latest/states-of-matter_all.html",
      "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600&auto=format&fit=crop&q=80",
      "Menelusuri perjalanan setetes air: menguap dari lautan karena panas matahari, membentuk awan dingin, dan turun sebagai hujan segar.",
      "1. Menjelaskan tahapan siklus air (evaporasi, kondensasi, presipitasi).\n2. Memahami bahwa jumlah air di bumi selalu berputar seimbang.",
      "1. Panaskan wadah air di simulasi PhET hingga menguap.\n2. Dinginkan bagian penutup untuk melihat titik-titik embun air.\n3. Gambar diagram daur air lengkap dengan anak panahnya!",
      "Mengapa air di danau tidak pernah habis meskipun terus-menerus disinari matahari?",
      "2026-10-29 09:10:00"
    ],
    [
      "STEM-SCI-K3-04",
      "Science",
      "Percobaan Sifat Kutub Magnet Menolak & Menarik",
      "3",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/magnet-and-compass/latest/magnet-and-compass_all.html",
      "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=600&auto=format&fit=crop&q=80",
      "Dekatkan kutub Utara (U) dan Selatan (S) magnet: rasakan sensasi tolak-menolak dan tarik-menarik yang tak terlihat!",
      "1. Mengidentifikasi dua kutub magnet (Utara dan Selatan).\n2. Membuktikan hukum magnet: kutub senama tolak-menolak, kutub tak senama tarik-menarik.",
      "1. Buka simulasi Magnet and Compass PhET.\n2. Dekatkan kutub U ke kutub U magnet lain dan amati jarum kompas.\n3. Balik kutub magnet dan perhatikan garis gaya magnet yang terbentuk!",
      "Bagaimana magnet bisa menggerakkan benda logam tanpa harus menyentuhnya secara langsung?",
      "2026-10-29 09:15:00"
    ],
    [
      "STEM-SCI-K3-05",
      "Science",
      "Bagian Tumbuhan & Penyerapan Air oleh Akar",
      "3",
      "Lab Maya",
      "https://phet.colorado.edu/sims/html/molecules-and-light/latest/molecules-and-light_all.html",
      "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format&fit=crop&q=80",
      "Uji daya kapilaritas batang tumbuhan: saksikan air berwarna diserap dari akar dan menjalar naik ke seluruh kelopak bunga putih.",
      "1. Menjelaskan fungsi pembuluh xilem dalam mengangkut air dan mineral.\n2. Mengamati pengaruh ketersediaan air terhadap kesegaran tumbuhan.",
      "1. Letakkan batang seledri berdaun dalam gelas berisi air pewarna merah.\n2. Diamkan selama beberapa jam.\n3. Potong batang dan amati berkas warna merah di pembuluhnya!",
      "Bagaimana pohon yang menjulang sangat tinggi dapat mengalirkan air dari tanah sampai ke daun pucuk teratas?",
      "2026-10-29 09:20:00"
    ],
    [
      "STEM-SCI-K3-06",
      "Science",
      "Pelestarian Lingkungan Hidup & Hutan Tropis",
      "3",
      "Lab Maya",
      "https://earth.google.com/web/",
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80",
      "Terbang menjelajahi hutan hujan tropis Indonesia melalui Google Earth dan pelajari pentingnya menjaga pohon dari penebangan liar.",
      "1. Mengidentifikasi peran hutan sebagai paru-paru dunia dan rumah satwa langka.\n2. Merumuskan tindakan nyata menghemat kertas dan menanam pohon.",
      "1. Buka Google Earth Web di browser.\n2. Telusuri kawasan Taman Nasional Komodo atau Hutan Kalimantan.\n3. Buat poster ajakan menjaga kelestarian hutan bersama teman!",
      "Apa akibat yang ditimbulkan pada lingkungan sekitar jika hutan di perbukitan ditebang habis?",
      "2026-10-29 09:25:00"
    ],
    [
      "STEM-SCI-K4-01",
      "Science",
      "Rahasia Fotosintesis: Mengapa Daun Berwarna Hijau?",
      "4",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/molecules-and-light/latest/molecules-and-light_all.html",
      "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&auto=format&fit=crop&q=80",
      "Temukan bagaimana klorofil menyerap cahaya matahari dan mengubah air serta karbon dioksida menjadi oksigen segar!",
      "1. Menjelaskan fungsi klorofil dalam proses fotosintesis tumbuhan.\n2. Mengidentifikasi peran tumbuhan sebagai penghasil oksigen di bumi.",
      "1. Buka laboratorium maya molekul dan cahaya PhET.\n2. Sorotkan cahaya pada molekul dan amati reaksinya.\n3. Simpulkan pentingnya sinar matahari bagi tanaman hijau!",
      "Apa yang akan terjadi pada udara di bumi jika pohon-pohon hijau semakin berkurang?",
      "2026-10-29 09:30:00"
    ],
    [
      "STEM-SCI-K4-02",
      "Science",
      "Rantai Makanan & Jaring-Jaring Kehidupan",
      "4",
      "Lab Maya",
      "https://phet.colorado.edu/sims/html/natural-selection/latest/natural-selection_all.html",
      "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=600&auto=format&fit=crop&q=80",
      "Siapa memakan siapa? Susun produsen (padi), konsumen tingkat 1 (belalang), pemangsa (katak & ular), hingga bakteri pengurai.",
      "1. Membedakan peran produsen, konsumen, dan dekomposer.\n2. Menganalisis dampak kepunahan salah satu populasi hewan dalam ekosistem sawah.",
      "1. Buka simulasi seleksi alam PhET.\n2. Ubah populasi rumput dan amati pertumbuhan kelinci.\n3. Rangkai bagan rantai makanan sawah di buku tugasmu!",
      "Apa yang terjadi pada hasil panen padi jika burung hantu dan ular sawah diburu habis oleh manusia?",
      "2026-10-29 09:35:00"
    ],
    [
      "STEM-SCI-K4-03",
      "Science",
      "Sifat Cahaya: Merambat Lurus & Dapat Dibiaskan",
      "4",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/bending-light/latest/bending-light_all.html",
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
      "Mengapa pensil di dalam gelas berisi air terlihat patah? Uji pembelokan berkas sinar laser melalui prisma kaca di PhET.",
      "1. Membuktikan sifat-sifat cahaya (merambat lurus, menembus benda bening, dibiaskan, dipantulkan).\n2. Mengamati pembelokan cahaya pada medium udara ke air.",
      "1. Buka simulasi Bending Light PhET.\n2. Sorotkan laser merah dari udara ke dalam balok kaca.\n3. Ukur sudut pembiasan menggunakan busur derajat virtual!",
      "Mengapa dasar kolam renang yang airnya jernih selalu terlihat lebih dangkal dari kedalaman aslinya?",
      "2026-10-29 09:40:00"
    ],
    [
      "STEM-SCI-K4-04",
      "Science",
      "Energi Terbarukan: Tenaga Surya & Kincir Angin",
      "4",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/energy-forms-and-changes/latest/energy-forms-and-changes_all.html",
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&auto=format&fit=crop&q=80",
      "Beralih ke energi ramah lingkungan! Ubah panas matahari dan hembusan angin menjadi listrik untuk menyalakan lampu tanpa polusi.",
      "1. Membedakan energi fosil (minyak/batubara) dan energi terbarukan (surya, air, angin).\n2. Menjelaskan proses konversi energi angin menjadi listrik.",
      "1. Buka tab Sistem Energi pada PhET Energy Forms and Changes.\n2. Pilih kincir angin sebagai sumber penghasil daya.\n3. Hubungkan ke generator dan amati lampu bohlam menyala terang!",
      "Mengapa energi matahari dan angin disebut sebagai sumber energi masa depan yang tak pernah habis?",
      "2026-10-29 09:45:00"
    ],
    [
      "STEM-SCI-K4-05",
      "Science",
      "Siklus Hidup Hewan: Metamorfosis Sempurna & Tak Sempurna",
      "4",
      "Lab Maya",
      "https://earth.google.com/web/",
      "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
      "Bandingkan daur hidup katak (berudu hingga katak berkaki) dengan belalang yang mengalami metamorfosis tidak sempurna.",
      "1. Membedakan metamorfosis sempurna (dengan pupa) dan tidak sempurna (nimfa).\n2. Mengidentifikasi perubahan alat pernapasan katak dari insang ke paru-paru.",
      "1. Buka bagan siklus katak dan kecoak.\n2. Temukan perbedaan fase berudu dan nimfa.\n3. Tuliskan kesimpulan perbedaan kedua jenis metamorfosis di lembar kerja!",
      "Mengapa katak dewasa bisa hidup di darat sedangkan berudu hanya bisa bertahan di dalam air?",
      "2026-10-29 09:50:00"
    ],
    [
      "STEM-SCI-K4-06",
      "Science",
      "Mengamati Gelombang Air, Bunyi, dan Cahaya",
      "4",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/waves-intro/latest/waves-intro_all.html",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
      "Teteskan air ke dalam kolam tenang di PhET: amati gelombang riak merambat, lalu variasikan frekuensi dan amplitudonya!",
      "1. Mengidentifikasi bagian-bagian gelombang (puncak, lembah, panjang gelombang).\n2. Memahami hubungan antara frekuensi dengan kecepatan getaran gelombang.",
      "1. Buka simulasi Waves Intro PhET.\n2. Nyalakan tetesan air dan amati pola cincin melingkar.\n3. Naikkan frekuensi getar dan perhatikan kerapatan riak air!",
      "Ketika kamu melempar batu ke sungai, apakah partikel air berpindah jauh atau hanya gelombangnya yang merambat?",
      "2026-10-29 09:55:00"
    ],
    [
      "STEM-SCI-K5-01",
      "Science",
      "Virtual Tour Gunung Berapi & Lapisan Kerak Bumi",
      "5",
      "Lab Maya",
      "https://earth.google.com/web/search/Volcanoes",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80",
      "Terbang keliling gunung berapi aktif di Indonesia dan dunia secara 3D menggunakan satelit Google Earth.",
      "1. Mengidentifikasi struktur gunung berapi (kawah, magma, lava).\n2. Memahami letak sabuk cincin api (ring of fire) di kepulauan Indonesia.",
      "1. Buka tautan jelajah 3D Google Earth.\n2. Telusuri kawah Gunung Bromo atau Krakatau.\n3. Amati kaldera dan bekas jalur lava dari citra satelit!",
      "Mengapa tanah di sekitar lereng gunung berapi sangat subur untuk pertanian?",
      "2026-10-29 10:00:00"
    ],
    [
      "STEM-SCI-K5-02",
      "Science",
      "Sistem Pernapasan Manusia: Oksigen & Paru-Paru",
      "5",
      "Lab Maya",
      "https://phet.colorado.edu/sims/html/gas-properties/latest/gas-properties_all.html",
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600&auto=format&fit=crop&q=80",
      "Amati pertukaran gas oksigen (O2) dan karbon dioksida (CO2) di alveolus saat paru-paru mengembang dan mengempis.",
      "1. Menjelaskan alur organ pernapasan (hidung, trakea, bronkus, alveolus).\n2. Memahami cara menjaga kesehatan organ paru-paru dari polusi udara.",
      "1. Buka simulasi sifat gas PhET.\n2. Pompa partikel gas dan amati gerak ekspansi tekanan di ruangan.\n3. Tarik napas dalam-dalam dan rasakan rongga dadamu mengembang!",
      "Mengapa bernapas melalui hidung jauh lebih sehat dibandingkan langsung melalui mulut?",
      "2026-10-29 10:05:00"
    ],
    [
      "STEM-SCI-K5-03",
      "Science",
      "Pengujian Derajat Keasaman (pH) Asam & Basa Alami",
      "5",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/ph-scale-basics/latest/ph-scale-basics_all.html",
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=80",
      "Celupkan indikator pH ke dalam perasan jeruk nipis, sabun, dan air murni. Amati perubahan angka asam (pH < 7) dan basa (pH > 7)!",
      "1. Mengukur nilai pH berbagai cairan rumah tangga menggunakan skala PhET.\n2. Mengelompokkan zat asam, netral, dan basa secara tepat.",
      "1. Buka simulasi pH Scale Basics PhET.\n2. Pilih cairan Jus Jeruk dan celupkan sensor pH.\n3. Encerkan dengan menambahkan air dan perhatikan pergeseran nilai pH-nya!",
      "Mengapa sabun pembersih umumnya memiliki sifat basa sedangkan buah-buahan cenderung asam?",
      "2026-10-29 10:10:00"
    ],
    [
      "STEM-SCI-K5-04",
      "Science",
      "Sistem Pencernaan Makanan & Penyerapan Sari Nutrisi",
      "5",
      "Lab Maya",
      "https://phet.colorado.edu/sims/html/density/latest/density_all.html",
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80",
      "Telusuri perjalanan makanan dari mulut, kerongkongan, lambung berasam kuat, hingga usus halus yang menyerap nutrisi ke darah.",
      "1. Mengidentifikasi organ-organ pencernaan mekanik dan kimiawi.\n2. Menjelaskan pentingnya pola makan berserat dan minum air cukup.",
      "1. Pelajari diagram alur saluran pencernaan manusia.\n2. Catat enzim-enzim penting yang ada di mulut dan lambung.\n3. Rancang menu sarapan sehat bergizi seimbang untuk siswa SD!",
      "Mengapa makanan harus dikunyah dengan lembut di mulut sebelum kita menelannya?",
      "2026-10-29 10:15:00"
    ],
    [
      "STEM-SCI-K5-05",
      "Science",
      "Dampak Efek Rumah Kaca & Pemanasan Global",
      "5",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/greenhouse-effect/latest/greenhouse-effect_all.html",
      "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=600&auto=format&fit=crop&q=80",
      "Laboratorium maya PhET: amati foton panas matahari yang terperangkap oleh gas karbon dioksida di atmosfer bumi.",
      "1. Memahami mekanisme terjadinya efek rumah kaca di atmosfer.\n2. Menganalisis dampak peningkatan gas emisi terhadap pencairan es kutub.",
      "1. Buka simulasi Greenhouse Effect PhET.\n2. Tambahkan lapisan konsentrasi gas rumah kaca.\n3. Amati perubahan temperatur termometer bumi yang naik perlahan!",
      "Tindakan sederhana apa yang bisa kita lakukan di sekolah untuk membantu mengurangi pemanasan global?",
      "2026-10-29 10:20:00"
    ],
    [
      "STEM-SCI-K5-06",
      "Science",
      "Rangka Tubuh & Sendi Gerak Manusia",
      "5",
      "Lab Maya",
      "https://phet.colorado.edu/sims/html/balancing-act/latest/balancing-act_all.html",
      "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&auto=format&fit=crop&q=80",
      "Ketahui bagaimana tulang tengkorak, tulang rusuk, serta sendi engsel dan peluru bekerja sama memungkinkan tubuh melompat dan berlari.",
      "1. Mengidentifikasi fungsi utama rangka tubuh (pelindung organ, pembentuk tubuh, tempat otot melekat).\n2. Membedakan jenis sendi gerak: sendi engsel, peluru, putar, dan pelana.",
      "1. Gerakkan siku tanganmu (sendi engsel) dan pundakmu (sendi peluru).\n2. Rasakan arah gerak masing-masing sendi.\n3. Gambar sketsa sendi gerak utama pada lembar portofolio!",
      "Apa yang akan terjadi pada tubuh kita jika manusia tidak memiliki kerangka tulang?",
      "2026-10-29 10:25:00"
    ],
    [
      "STEM-SCI-K6-01",
      "Science",
      "Menjelajah Tata Surya & Orbit Planet Antariksa",
      "6",
      "Simulasi",
      "https://eyes.nasa.gov/apps/solar-system/",
      "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&auto=format&fit=crop&q=80",
      "Eksplorasi interaktif 3D NASA Eyes: terbangkan satelit virtual mengitari Matahari, Bumi, Mars, hingga cincin Saturnus.",
      "1. Mengenal urutan 8 planet dalam sistem tata surya.\n2. Menjelaskan fenomena rotasi dan revolusi planet mengelilingi matahari.",
      "1. Buka simulasi antariksa NASA Eyes di browser.\n2. Klik planet Bumi dan Mars untuk melihat atmosfernya.\n3. Percepat waktu simulasi untuk mengamati pergerakan orbit planet!",
      "Mengapa planet yang paling dekat dengan matahari memiliki waktu revolusi paling cepat?",
      "2026-10-29 10:30:00"
    ],
    [
      "STEM-SCI-K6-02",
      "Science",
      "Gerhana Matahari & Gerhana Bulan Virtual",
      "6",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/gravity-and-orbits/latest/gravity-and-orbits_all.html",
      "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80",
      "Atur posisi sejajar Matahari, Bulan, dan Bumi di simulasi PhET untuk mengamati bayangan umbra dan penumbra saat gerhana total.",
      "1. Membedakan posisi benda langit saat gerhana matahari dan gerhana bulan.\n2. Memahami bayangan umbra (gelap total) dan penumbra (samar).",
      "1. Buka simulasi Gravity and Orbits PhET.\n2. Pilih mode Bumi dan Bulan.\n3. Sejajarkan posisi ketiganya dan amati bagaimana cahaya matahari terhalang!",
      "Mengapa gerhana matahari total hanya bisa disaksikan di jalur sempit tertentu di permukaan bumi?",
      "2026-10-29 10:35:00"
    ],
    [
      "STEM-SCI-K6-03",
      "Science",
      "Medan Magnet Bumi & Prinsip Kerja Kompas Pelaut",
      "6",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/magnet-and-compass/latest/magnet-and-compass_all.html",
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
      "Mengapa jarum kompas selalu menunjuk ke arah Utara? Temukan rahasia inti bumi yang bertindak seperti magnet raksasa.",
      "1. Menjelaskan mengapa kutub utara jarum kompas menunjuk ke kutub utara geografis bumi.\n2. Memahami medan magnet bumi yang melindungi kita dari radiasi kosmis.",
      "1. Buka simulasi Magnet and Compass PhET.\n2. Centang opsi 'Show Planet Earth'.\n3. Geser kompas ke berbagai benua dan perhatikan arah putar jarumnya!",
      "Bagaimana para pelaut zaman dahulu dapat menjelajahi samudera luas di malam hari tanpa tersesat?",
      "2026-10-29 10:40:00"
    ],
    [
      "STEM-SCI-K6-04",
      "Science",
      "Perkembangbiakan Tumbuhan: Vegetatif Alami & Buatan",
      "6",
      "Lab Maya",
      "https://phet.colorado.edu/sims/html/natural-selection/latest/natural-selection_all.html",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=80",
      "Pelajari cara mencangkok, stek batang, menempel (okulasi), serta tunas alami pisang dan umbi lapis bawang merah.",
      "1. Membedakan perkembangbiakan generatif (penyerbukan) dan vegetatif (tanpa biji).\n2. Mempraktikkan teknik perkembangbiakan vegetatif buatan yang menguntungkan.",
      "1. Identifikasi tanaman mangga, pisang, dan jahe.\n2. Kelompokkan berdasarkan metode perkembangbiakannya.\n3. Simulasikan keuntungan mencangkok tanaman buah agar cepat berbuah lebat!",
      "Mengapa pohon hasil cangkokan memiliki rasa buah yang persis sama dengan pohon induknya?",
      "2026-10-29 10:45:00"
    ],
    [
      "STEM-SCI-K6-05",
      "Science",
      "Adaptasi Fisiologis & Morfologi Makhluk Hidup",
      "6",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/natural-selection/latest/natural-selection_all.html",
      "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
      "Laboratorium maya PhET Natural Selection: amati bagaimana bulu hewan putih di salju membantu mereka bersembunyi dari predator.",
      "1. Mengidentifikasi bentuk adaptasi morfologi (paruh burung, bentuk daun kaktus).\n2. Memahami hubungan kelangsungan hidup hewan dengan kemampuan adaptasi lingkungan.",
      "1. Buka simulasi seleksi alam PhET.\n2. Tambahkan mutasi warna bulu kelinci.\n3. Ubah lingkungan menjadi bersalju dan amati kelinci yang lebih bertahan hidup!",
      "Mengapa tumbuhan kaktus di gurun pasir memiliki daun yang bermodifikasi menjadi duri tajam?",
      "2026-10-29 10:50:00"
    ],
    [
      "STEM-SCI-K6-06",
      "Science",
      "Efisiensi Energi Listrik & Gerakan Hemat Daya",
      "6",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_all.html",
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&auto=format&fit=crop&q=80",
      "Hitung pemakaian daya lampu pijar vs lampu LED di simulasi PhET. Rasakan bagaimana efisiensi daya menghemat biaya dan bumi.",
      "1. Membandingkan konsumsi daya listrik berbagai perangkat penerangan.\n2. Merancang aksi hemat listrik di lingkungan sekolah dan rumah tangga.",
      "1. Buka Circuit Construction Kit DC PhET.\n2. Pasang voltmeter dan ampermeter pada sirkuit lampu.\n3. Hitung daya (Watt) yang terpakai dan simpulkan keunggulan teknologi LED!",
      "Jika seluruh lampu di sekolah diganti dengan lampu LED hemat daya, dampak positif apa yang akan diperoleh?",
      "2026-10-29 10:55:00"
    ],
    [
      "STEM-TEC-K1-01",
      "Technology",
      "Labirin Coding Perdanaku: Memandu Panda Berjalan",
      "1",
      "Game",
      "https://blockly.games/maze?lang=id",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
      "Tantangan coding ramah anak: susun blok [Maju] dan [Belok] di Blockly Games untuk mengarahkan karakter mencapai garis finish!",
      "1. Mengenal konsep urutan perintah (sekuensial) dalam pemrograman visual.\n2. Menyelesaikan tantangan labirin level 1 dan 2 secara mandiri.",
      "1. Buka Blockly Games Labirin di browsermu.\n2. Pasang blok [Maju] dua kali.\n3. Klik tombol 'Jalankan Program' dan lihat karaktermu berhasil sampai tujuan!",
      "Apa yang terjadi jika kita lupa memasang blok [Maju] pada urutan perintah?",
      "2026-10-29 11:00:00"
    ],
    [
      "STEM-TEC-K1-02",
      "Technology",
      "Membimbing Burung Mencari Cacing di Blockly Bird",
      "1",
      "Game",
      "https://blockly.games/bird?lang=id",
      "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600&auto=format&fit=crop&q=80",
      "Bantu burung terbang mengambil cacing lezat lalu pulang ke sarangnya dengan memilih arah sudut kompas yang tepat.",
      "1. Mengenal logika arah mata angin dan sudut derajat sederhana.\n2. Memahami kondisi bersyarat sederhana: jika membawa makanan vs belum membawa makanan.",
      "1. Buka tantangan Burung di Blockly Games.\n2. Tentukan sudut terbang burung menuju cacing.\n3. Jalankan program dan perhatikan burung mengepakkan sayapnya!",
      "Mengapa arah terbang burung harus berubah setelah ia berhasil mengambil cacing?",
      "2026-10-29 11:05:00"
    ],
    [
      "STEM-TEC-K1-03",
      "Technology",
      "Menggambar Garis Ceria Bersama Kura-Kura Blockly",
      "1",
      "Simulasi",
      "https://blockly.games/turtle?lang=id",
      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&auto=format&fit=crop&q=80",
      "Beri perintah pada kura-kura pintar untuk menggambar garis lurus warna-warni dan membentuk lintasan ceria.",
      "1. Memahami koordinasi antara perintah gerak maju dan belokan kursor.\n2. Melatih kreativitas seni digital menggunakan blok kode visual.",
      "1. Buka kanvas Kura-kura di Blockly Games.\n2. Pasang blok [Maju 100] dan [Belok Kanan 90 derajat].\n3. Ulangi hingga membentuk sudut yang rapi!",
      "Berapa kali kura-kura harus berbelok untuk kembali ke posisi awal?",
      "2026-10-29 11:10:00"
    ],
    [
      "STEM-TEC-K1-04",
      "Technology",
      "Mengenal Perangkat Komputer: Mouse, Keyboard, dan Layar",
      "1",
      "Lab Maya",
      "https://blockly.games/",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
      "Belajar memegang mouse, mengklik tombol kiri, drag-and-drop blok warna, serta mengetik huruf pertama namamu di keyboard.",
      "1. Mengidentifikasi bagian fisik komputer (layar monitor, CPU, mouse, keyboard).\n2. Melatih keterampilan motorik halus menggeser (drag) dan melepas (drop) objek di layar.",
      "1. Pegang mouse dengan tangan rileks.\n2. Latihan klik sekali (single click) dan klik dua kali (double click).\n3. Tarik salah satu blok warna dari menu ke ruang kerja!",
      "Mengapa tombol mouse memiliki bagian kiri dan bagian kanan dengan fungsi berbeda?",
      "2026-10-29 11:15:00"
    ],
    [
      "STEM-TEC-K1-05",
      "Technology",
      "Teka-Teki Urutan Langkah Robot Pembuat Roti",
      "1",
      "Game",
      "https://blockly.games/maze?lang=id",
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80",
      "Seperti robot pembuat roti lapis: roti harus ditaruh lebih dulu, lalu selai, baru ditutup roti atas. Itulah algoritma kehidupan sehari-hari!",
      "1. Memahami bahwa komputer bekerja mengikuti urutan instruksi yang tepat.\n2. Menemukan kesalahan (debugging) jika urutan langkah terbalik.",
      "1. Susun langkah membuat roti selai: Siapkan piring -> Taruh roti -> Oles selai -> Tutup roti.\n2. Uji coba jika langkah oles selai dilakukan sebelum roti ditaruh di piring.\n3. Terapkan logika yang sama pada tantangan labirin level 2!",
      "Apa jadinya jika robot menyapu lantai sebelum memindahkan kursi yang menghalangi?",
      "2026-10-29 11:20:00"
    ],
    [
      "STEM-TEC-K1-06",
      "Technology",
      "Eksplorasi Suara & Not Nada Digital di Blockly Music",
      "1",
      "Simulasi",
      "https://blockly.games/music?lang=id",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
      "Rangkai nada Do-Re-Mi menjadi melodi ceria menggunakan blok perintah musik digital interaktif di browsermu.",
      "1. Mengenal notasi nada musik dasar (C, D, E, F, G).\n2. Memadukan durasi ketukan dengan blok perintah audio.",
      "1. Buka Blockly Games Musik.\n2. Pasang blok [Mainkan Nada C] selama 1 ketuk.\n3. Sambungkan dengan nada D dan E lalu dengarkan lagumu berbunyi!",
      "Bagaimana komputer bisa mengubah angka dan kode menjadi suara lagu yang merdu?",
      "2026-10-29 11:25:00"
    ],
    [
      "STEM-TEC-K2-01",
      "Technology",
      "Coding Labirin Berliku: Belok Kanan dan Kiri",
      "2",
      "Game",
      "https://blockly.games/maze?lang=id",
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80",
      "Pecahkan teka-teki jalan buntu di labirin level 3 dan 4 dengan merencanakan rute belokan sebelum melangkah.",
      "1. Melatih penalaran spasial orientasi kanan dan kiri kursor.\n2. Menyusun algoritma pemecahan jalur dengan jumlah blok minimal.",
      "1. Buka level 3 Labirin Blockly Games.\n2. Amati jalan di depan: tentukan kapan harus belok kiri dan maju.\n3. Uji jalan dan perbaiki jika karakter menabrak dinding batu!",
      "Mengapa kita perlu memutar sudut pandang saat karakter menghadap ke arah bawah?",
      "2026-10-29 11:30:00"
    ],
    [
      "STEM-TEC-K2-02",
      "Technology",
      "Menggambar Segitiga dan Persegi Bersama Kura-Kura",
      "2",
      "Simulasi",
      "https://blockly.games/turtle?lang=id",
      "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&auto=format&fit=crop&q=80",
      "Gabungkan matematika dan teknologi: beri perintah pada kura-kura untuk melukis persegi dengan 4 sudut 90 derajat.",
      "1. Menggambar bangun datar beraturan melalui instruksi baris kode.\n2. Mengenal sudut belokan 90 derajat untuk persegi dan 120 derajat untuk segitiga.",
      "1. Buka level 2 Kura-kura di Blockly Games.\n2. Pasang [Maju 100] lalu [Belok Kanan 90] sebanyak 4 kali.\n3. Lihat hasil karya perseginya yang presisi!",
      "Mengapa untuk membuat segitiga sama sisi, kura-kura harus berbelok 120 derajat?",
      "2026-10-29 11:35:00"
    ],
    [
      "STEM-TEC-K2-03",
      "Technology",
      "Animasi Gerak Karakter Perdanaku di Scratch Editor",
      "2",
      "Simulasi",
      "https://scratch.mit.edu/projects/editor/",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
      "Seret blok warna di editor online Scratch: buat karakter kucing Scratch melangkah maju 10 langkah dan mengeong riang!",
      "1. Mengenal area antarmuka Scratch (Stage, Sprite, Palet Blok Kode).\n2. Menggabungkan event tombol bendera hijau dengan aksi gerak.",
      "1. Buka editor online Scratch (langsung terbuka tanpa login).\n2. Tarik blok [Ketika Bendera Hijau Diklik].\n3. Pasang blok [Gerak 10 Langkah] dan [Katakan Halo selama 2 detik]!",
      "Mengapa tombol bendera hijau disebut sebagai pemicu (event) dimulainya program?",
      "2026-10-29 11:40:00"
    ],
    [
      "STEM-TEC-K2-04",
      "Technology",
      "Eksplorasi Tebak Gambar Kecerdasan Buatan (Google Quick Draw)",
      "2",
      "Game",
      "https://quickdraw.withgoogle.com/",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
      "Gambarlah apel atau sepeda di layar dalam 20 detik, dan saksikan kecerdasan buatan (AI) menebak gambarmu secara instan!",
      "1. Mengenal konsep dasar pengenalan pola gambar oleh komputer.\n2. Memahami bagaimana teknologi kecerdasan buatan belajar dari jutaan contoh gambar.",
      "1. Buka Google Quick Draw di browser (100% bebas login).\n2. Klik 'Mulai Menggambar'.\n3. Gambarkan instruksi yang diminta dan dengarkan tebakan suara AI!",
      "Bagaimana komputer bisa mengenali bahwa goresan kita adalah gambar pohon meskipun gambarnya sederhana?",
      "2026-10-29 11:45:00"
    ],
    [
      "STEM-TEC-K2-05",
      "Technology",
      "Mengubah Warna dan Suara Karakter di Scratch",
      "2",
      "Simulasi",
      "https://scratch.mit.edu/projects/editor/",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80",
      "Kreasikan karaktermu sendiri: ganti warna bulu kucing menjadi biru ajaib dan tambahkan efek suara drum yang asyik.",
      "1. Memodifikasi efek visual (efek warna, ukuran) pada sprite.\n2. Mengintegrasikan efek suara instrumen ke dalam animasi.",
      "1. Buka tab Kode Tampilan (Looks) di Scratch.\n2. Pasang blok [Ubah Efek Warna sebesar 25].\n3. Klik sprite beberapa kali dan lihat warna karakternya berubah seperti pelangi!",
      "Efek visual apa lagi yang bisa kamu tambahkan agar animasimu terlihat semakin memukau?",
      "2026-10-29 11:50:00"
    ],
    [
      "STEM-TEC-K2-06",
      "Technology",
      "Burung Cerdas: Menghindari Rintangan di Udara",
      "2",
      "Game",
      "https://blockly.games/bird?lang=id",
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80",
      "Selesaikan tantangan Burung level 3 dan 4 di Blockly Games dengan memprogram sudut manuver menghindari tebing batu.",
      "1. Mengasah logika percabangan bersyarat (kondisi IF).\n2. Memprogram rute alternatif saat ada penghalang rintangan di depan.",
      "1. Masuk ke level 4 Burung di Blockly Games.\n2. Pasang kondisi: Jika belum dapat cacing, terbang sudut 45 derajat.\n3. Jika sudah dapat cacing, ubah arah terbang ke sarang!",
      "Mengapa kemampuan mengambil keputusan berdasarkan kondisi sangat penting dalam teknologi robotika?",
      "2026-10-29 11:55:00"
    ],
    [
      "STEM-TEC-K3-01",
      "Technology",
      "Animasi Kartun Gerak Karakter Kucing Scratch",
      "3",
      "Simulasi",
      "https://scratch.mit.edu/projects/editor/",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
      "Seret dan tempel balok warna-warni di Scratch MIT untuk membuat karakter kartun berjalan, bersuara, dan berganti kostum.",
      "1. Mengenal antarmuka pemrograman visual Scratch.\n2. Membuat animasi gerak sederhana menggunakan blok perintah.",
      "1. Buka editor online Scratch MIT.\n2. Tarik balok [Gerak 10 langkah] dan [Kostum Berikutnya].\n3. Klik bendera hijau dan amati karakter kucingmu melangkah hidup!",
      "Jika kita ingin karakter bergerak selamanya, balok kontrol apa yang harus kita pasang?",
      "2026-10-29 12:00:00"
    ],
    [
      "STEM-TEC-K3-02",
      "Technology",
      "Logika Perulangan (Loop) di Labirin Panjang Blockly",
      "3",
      "Game",
      "https://blockly.games/maze?lang=id",
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80",
      "Jangan pasang balok maju 10 kali! Gunakan balok ajaib [Ulangi sampai finish] agar kodingmu ringkas, pintar, dan efisien.",
      "1. Memahami kekuatan struktur perulangan (looping) dalam coding.\n2. Menghemat jumlah blok kode dengan perintah berulang otomatis.",
      "1. Buka level 5 Labirin di Blockly Games.\n2. Pasang blok [Ulangi sampai titik finish].\n3. Masukkan perintah [Maju] ke dalam blok perulangan tersebut!",
      "Mengapa menggunakan blok perulangan membuat kode kita jauh lebih rapi dan hemat memori?",
      "2026-10-29 12:05:00"
    ],
    [
      "STEM-TEC-K3-03",
      "Technology",
      "Merancang Bintang dan Pola Melingkar Bersama Kura-Kura",
      "3",
      "Simulasi",
      "https://blockly.games/turtle?lang=id",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
      "Padukan loop dengan belokan sudut tajam: saksikan kura-kura melukis bintang 5 sudut yang bersinar gemerlap.",
      "1. Menerapkan loop perulangan dalam karya seni geometri digital.\n2. Menghitung sudut rotasi 144 derajat untuk membentuk bintang sempurna.",
      "1. Buka tantangan Kura-kura level 4 Blockly Games.\n2. Buat loop ulangi 5 kali: [Maju 100] lalu [Belok Kanan 144 derajat].\n3. Ubah warna pena menjadi emas dan jalankan program!",
      "Berapa banyak ujung bintang yang dihasilkan jika kita mengubah sudut dan jumlah perulangannya?",
      "2026-10-29 12:10:00"
    ],
    [
      "STEM-TEC-K3-04",
      "Technology",
      "Membuat Kartu Ucapan Digital Ulang Tahun Bersuara",
      "3",
      "Simulasi",
      "https://scratch.mit.edu/projects/editor/",
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80",
      "Rancang kartu ucapan interaktif: saat balon diklik oleh temanmu, balon akan membesar, meletus, dan memutar lagu Selamat Ulang Tahun!",
      "1. Menerapkan sensor klik [Ketika Sprite Ini Diklik].\n2. Menggabungkan animasi perubahan ukuran dengan efek suara perayaan.",
      "1. Tambahkan sprite Balon dan Kue Tart di Scratch.\n2. Pasang kode: Ketika sprite diklik -> Ubah ukuran sebesar 20 -> Mainkan suara pop!\n3. Uji coba dengan mengklik balon di layar!",
      "Bagaimana cara membuat teks ucapan muncul perlahan setelah balon meletus?",
      "2026-10-29 12:15:00"
    ],
    [
      "STEM-TEC-K3-05",
      "Technology",
      "Pesta Tari Karakter: Mengatur Ketukan Lagu Digital",
      "3",
      "Simulasi",
      "https://scratch.mit.edu/projects/editor/",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80",
      "Koreografikan tarian karakter: ganti kostum ke kiri dan ke kanan selaras dengan irama musik pop yang asyik.",
      "1. Mensinkronkan pergantian kostum animasi dengan tempo musik.\n2. Menggunakan blok [Tunggu 0.5 detik] untuk menjaga ritme tarian.",
      "1. Pilih karakter penari di perpustakaan sprite Scratch.\n2. Buat perulangan selamanya: Ganti kostum -> Tunggu 0.3 detik.\n3. Pasang musik latar di latar belakang (Backdrop)!",
      "Apa yang terjadi pada tarian jika jeda waktu tunggu dihapus?",
      "2026-10-29 12:20:00"
    ],
    [
      "STEM-TEC-K3-06",
      "Technology",
      "Komunikasi Rahasia: Mengenal Kode Biner Komputer",
      "3",
      "Simulasi",
      "https://blockly.games/",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
      "Bagaimana komputer berbicara? Ternyata komputer hanya mengenal angka 0 (mati) dan 1 (nyala). Temukan rahasia kode biner!",
      "1. Mengenal konsep sistem bilangan biner (angka 0 dan 1).\n2. Mengubah huruf inisial nama menjadi pola sakelar lampu biner.",
      "1. Siapkan kartu hitam (0) dan kartu putih (1).\n2. Susun pola kartu bernilai 1, 2, 4, 8.\n3. Tebak angka rahasia temanmu menggunakan kombinasi kartu biner!",
      "Mengapa komputer modern memilih menggunakan sakelar listrik 0 dan 1 daripada angka 0 sampai 9?",
      "2026-10-29 12:25:00"
    ],
    [
      "STEM-TEC-K4-01",
      "Technology",
      "Logika Kondisi If-Else di Labirin Cerdas Blockly",
      "4",
      "Game",
      "https://blockly.games/maze?lang=id",
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80",
      "Ajari komputermu berpikir mandiri: 'Jika ada jalan ke kiri, belok kiri; jika tidak, terus maju lurus'.",
      "1. Memahami struktur percabangan logika Jika-Maka-Lainnya (If-Else).\n2. Memecahkan labirin kompleks level 7 dan 8 dengan keputusan otomatis.",
      "1. Buka level 7 Labirin di Blockly Games.\n2. Pasang blok [Jika ada jalan ke kiri -> Belok Kiri].\n3. Tambahkan [Lainnya -> Maju] di dalam blok loop!",
      "Mengapa algoritma If-Else membuat robot dapat keluar dari labirin apa pun tanpa perlu diprogram jalurnya satu per satu?",
      "2026-10-29 12:30:00"
    ],
    [
      "STEM-TEC-K4-02",
      "Technology",
      "Menggambar Poligon Bunga Fraktal Bersama Kura-Kura",
      "4",
      "Simulasi",
      "https://blockly.games/turtle?lang=id",
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
      "Sarang loop ganda (nested loop): ulangi menggambar persegi sambil memutar kanvas 10 derajat hingga terbentuk mahkota bunga indah.",
      "1. Memahami struktur perulangan bersarang (nested loops).\n2. Menciptakan seni komputasi fraktal geometris yang memukau.",
      "1. Buka tantangan Kura-kura level 6 di Blockly Games.\n2. Buat loop luar: ulangi 36 kali.\n3. Di dalam loop luar, buat loop gambar lingkaran kecil lalu putar kursor 10 derajat!",
      "Bagaimana desainer grafis video game memanfaatkan nested loop untuk menggambar dedaunan pohon yang rindang?",
      "2026-10-29 12:35:00"
    ],
    [
      "STEM-TEC-K4-03",
      "Technology",
      "Merancang Game Tangkap Bintang Interaktif di Scratch",
      "4",
      "Simulasi",
      "https://scratch.mit.edu/projects/editor/",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80",
      "Kendalikan roket menggunakan tombol panah keyboard untuk menangkap bintang jatuh sebelum menyentuh batas bawah layar.",
      "1. Memprogram kontrol interaktif keyboard (panah kanan, kiri, atas, bawah).\n2. Menggunakan sensor sentuh [Jika menyentuh Sprite Bintang].",
      "1. Buka editor Scratch online.\n2. Pasang kode pada roket: Jika tombol panah ditekan -> Ubah X sebesar 10.\n3. Beri kode pada bintang: Meluncur ke posisi acak -> Jika kena roket, mainkan suara denting!",
      "Bagaimana cara membuat bintang jatuh dari posisi atas secara acak (random)?",
      "2026-10-29 12:40:00"
    ],
    [
      "STEM-TEC-K4-04",
      "Technology",
      "Simulasi Robot Pembersih Otomatis Penghindar Dinding",
      "4",
      "Simulasi",
      "https://scratch.mit.edu/projects/editor/",
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80",
      "Rancang otak robot vacuum cleaner: robot akan berjalan menyapu lantai dan otomatis berputar memantul jika mendeteksi tepian dinding.",
      "1. Memahami prinsip kerja sensor tabrakan pada robotika industri.\n2. Menerapkan blok perintah [Jika di pinggir, pantulkan] di Scratch.",
      "1. Pilih sprite robot bundar di Scratch.\n2. Masukkan perintah: Selamanya [Gerak 10 langkah] -> [Jika di pinggir, pantulkan].\n3. Tambahkan jejak pena (Pen tool) untuk melihat area lantai yang berhasil disapu!",
      "Mengapa robot vacuum cleaner di rumah tidak pernah jatuh dari anak tangga?",
      "2026-10-29 12:45:00"
    ],
    [
      "STEM-TEC-K4-05",
      "Technology",
      "Animasi Kisah Fabel Interaktif dengan Dialog Percakapan",
      "4",
      "Simulasi",
      "https://scratch.mit.edu/projects/editor/",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=80",
      "Jadilah sutradara kartun: atur giliran berbicara antara Si Kancil dan Pak Buaya menggunakan siaran pesan (broadcast message).",
      "1. Memahami mekanisme komunikasi antar karakter dengan [Siarkan Pesan].\n2. Menyusun narasi cerita fabel digital yang mengedukasi.",
      "1. Buat dua sprite: Kancil dan Buaya di sungai.\n2. Kancil berbicara: 'Halo Buaya!' -> Siarkan pesan [BuayaMenjawab].\n3. Pada Buaya: [Ketika menerima pesan BuayaMenjawab] -> Katakan 'Mau apa kamu Kancil?'!",
      "Mengapa menggunakan blok siaran pesan jauh lebih akurat daripada hanya mengandalkan waktu tunggu detik?",
      "2026-10-29 12:50:00"
    ],
    [
      "STEM-TEC-K4-06",
      "Technology",
      "Mengukur Kecepatan Internet & Pengenalan Jaringan Komputer",
      "4",
      "Simulasi",
      "https://blockly.games/",
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80",
      "Bagaimana pesan teks WhatsApp sampai ke HP teman dalam sekejap? Pelajari paket data, alamat IP, dan kabel serat optik bawah laut.",
      "1. Memahami cara kerja dasar internet menghubungkan komputer di seluruh dunia.\n2. Mengenal perbedaan koneksi kabel LAN, WiFi, dan sinyal seluler.",
      "1. Pelajari peta kabel internet bawah laut yang melintasi pulau di Indonesia.\n2. Hitung waktu jeda (latency ping) saat mengirim data.\n3. Buat poster panduan aman berselancar di internet sehat!",
      "Mengapa kita tidak boleh sembarangan mengklik tautan misterius di internet?",
      "2026-10-29 12:55:00"
    ],
    [
      "STEM-TEC-K5-01",
      "Technology",
      "Game Edukasi Tangkap Apel Jatuh dengan Papan Skor",
      "5",
      "Simulasi",
      "https://scratch.mit.edu/projects/editor/",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80",
      "Rancang game tangkap apel jatuh menggunakan variabel skor, sensor sentuh (sensing), dan kondisi menang-kalah.",
      "1. Memahami penggunaan Variabel (Score) dan Operator Logika.\n2. Mengintegrasikan sensor sentuh dalam mekanisme game edukatif.",
      "1. Buat dua sprite: Keranjang dan Apel.\n2. Buat variabel bernama Skor.\n3. Beri kode: jika Apel menyentuh Keranjang, tambah Skor sebesar 1 dan mainkan nada menang!",
      "Bagaimana cara mengatur tingkat kesulitan game agar semakin lama apel jatuh semakin cepat?",
      "2026-10-29 13:00:00"
    ],
    [
      "STEM-TEC-K5-02",
      "Technology",
      "Pemrograman Film Animasi di Blockly Movie",
      "5",
      "Simulasi",
      "https://blockly.games/movie?lang=id",
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80",
      "Program animasi film frame-by-frame: gunakan variabel waktu [time] untuk menggerakkan bola dari kiri ke kanan dengan kecepatan konstan.",
      "1. Memahami hubungan matematika antara sumbu koordinat (X, Y) dengan variabel waktu animasi.\n2. Memprogram pergerakan objek dinamis di kanvas film.",
      "1. Buka Blockly Games Film (Movie).\n2. Tarik objek Lingkaran ke layar.\n3. Hubungkan posisi X dengan blok variabel [waktu] dan putar filmnya!",
      "Bagaimana cara membuat bola bergerak ke atas melengkung seperti bola basket yang dilempar?",
      "2026-10-29 13:05:00"
    ],
    [
      "STEM-TEC-K5-03",
      "Technology",
      "Logika Kolam Katak Pintar: Mengatur Radar Pemindai di Blockly Pond",
      "5",
      "Game",
      "https://blockly.games/pond-tutor?lang=id",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
      "Program bebek pintar di danau: gunakan fungsi pemindai radar scan(derajat) untuk mendeteksi lawan dan menembakkan meriam air tepat sasaran.",
      "1. Mengenal konsep pemanggilan fungsi berparameter (functions with parameters).\n2. Menghitung sudut sasaran radar 360 derajat secara matematis.",
      "1. Buka Blockly Games Pond Tutor.\n2. Panggil fungsi scan(0) untuk mendeteksi target di arah timur.\n3. Jika jarak target terdeteksi, luncurkan tembakan meriam!",
      "Mengapa teknologi radar seperti ini juga dipakai oleh kapal selam di kedalaman lautan?",
      "2026-10-29 13:10:00"
    ],
    [
      "STEM-TEC-K5-04",
      "Technology",
      "Simulasi Fisika Gravitasi & Bola Memantul di Scratch",
      "5",
      "Simulasi",
      "https://scratch.mit.edu/projects/editor/",
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
      "Terapkan hukum sains ke dalam koding: ciptakan variabel kecepatan jatuh (Velocity Y) agar bola memantul semakin rendah seperti bola basket asli.",
      "1. Memprogram simulasi fenomena sains fisika menggunakan kode blok.\n2. Menerapkan variabel percepatan gravitasi dan pantulan elastis.",
      "1. Buat variabel bernama KecepatanY.\n2. Di dalam loop selamanya: Ubah Y sebesar KecepatanY -> Kurangi KecepatanY sebesar 1 (gravitasi).\n3. Jika menyentuh tanah, balik nilai KecepatanY menjadi positif dikalikan 0.8!",
      "Mengapa pantulan bola selalu semakin rendah dan akhirnya berhenti diam di lantai?",
      "2026-10-29 13:15:00"
    ],
    [
      "STEM-TEC-K5-05",
      "Technology",
      "Merancang Kuis Interaktif Pilihan Ganda Bertenggat Waktu",
      "5",
      "Simulasi",
      "https://scratch.mit.edu/projects/editor/",
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80",
      "Buat game kuis edukasi untuk teman sekelas: jika jawaban benar dapat 10 poin, jika salah terdengar suara bel berdengung!",
      "1. Menggunakan blok [Tanya ... dan Tunggu] untuk menangkap input pengguna.\n2. Memvalidasi jawaban dengan operator pembanding logika [jawaban = kunci].",
      "1. Buat pertanyaan sains: 'Berapa planet dalam tata surya?'.\n2. Cek: Jika [jawaban = 8], tambah Nilai 10 dan katakan 'Hebat, kamu pintar!'.\n3. Jika tidak, beri tahu jawaban yang benar!",
      "Bagaimana cara membuat timer hitung mundur 10 detik untuk menjawab setiap soal?",
      "2026-10-29 13:20:00"
    ],
    [
      "STEM-TEC-K5-06",
      "Technology",
      "Mengenal Algoritma Pencarian & Pengurutan Data (Sorting)",
      "5",
      "Simulasi",
      "https://blockly.games/",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
      "Bagaimana Google menyaring jutaan artikel dalam 0,1 detik? Pelajari rahasia algoritma Bubble Sort dan Binary Search.",
      "1. Memahami cara komputer mengurutkan angka acak dari terkecil ke terbesar.\n2. Membandingkan kecepatan pencarian linier vs pencarian biner.",
      "1. Tulis angka acak pada 5 lembar kertas.\n2. Bandingkan dua angka bersebelahan dan tukar jika posisinya keliru.\n3. Hitung berapa langkah pertukaran yang kamu butuhkan hingga semua terurut rapi!",
      "Mengapa data yang sudah terurut rapi jauh lebih mudah dicari daripada data yang berantakan?",
      "2026-10-29 13:25:00"
    ],
    [
      "STEM-TEC-K6-01",
      "Technology",
      "Merancang Game Petualangan Multi-Level di Scratch",
      "6",
      "Simulasi",
      "https://scratch.mit.edu/projects/editor/",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80",
      "Kembangkan game platformer lengkap: lompat rintangan duri, kumpulkan koin emas, dan buka pintu ke Level 2!",
      "1. Mengelola perpindahan latar belakang (Backdrops) antar level game.\n2. Menerapkan variabel Lives (nyawa) dan Game Over state secara profesional.",
      "1. Buat variabel Nyawa = 3 dan Level = 1.\n2. Jika koin terkumpul 5, ubah Level menjadi 2 dan ganti latar belakang panggung.\n3. Jika Nyawa = 0, hentikan semua skrip dan tampilkan layar Game Over!",
      "Bagaimana cara menyeimbangkan tingkat kesulitan agar pemain tidak mudah frustrasi tetapi tetap tertantang?",
      "2026-10-29 13:30:00"
    ],
    [
      "STEM-TEC-K6-02",
      "Technology",
      "Pertempuran Logika Pemrograman di Blockly Pond JS",
      "6",
      "Game",
      "https://blockly.games/pond-duck?lang=id",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80",
      "Tulis kode JavaScript murni atau gunakan blok tingkat tinggi untuk memprogram strategi bertahan dan menyerang bebek perang di arena kolam.",
      "1. Melakukan transisi mulus dari pemrograman visual blok ke sintaks teks JavaScript.\n2. Merancang algoritma AI sederhana untuk navigasi dan penargetan otomatis.",
      "1. Buka Blockly Games Pond Duck.\n2. Perhatikan padanan kode teks JavaScript di samping blok kode.\n3. Tulis fungsi perulangan pemindaian otomatis dan kalahkan semua bebek lawan!",
      "Apa keunggulan menulis kode teks dibandingkan menggunakan blok saat program sudah sangat rumit?",
      "2026-10-29 13:35:00"
    ],
    [
      "STEM-TEC-K6-03",
      "Technology",
      "Simulasi Penerbangan Pesawat Ulang-Alik Antariksa",
      "6",
      "Simulasi",
      "https://scratch.mit.edu/projects/editor/",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
      "Simulasikan peluncuran roket menembus lapisan atmosfer bumi menuju stasiun luar angkasa dengan memperhitungkan bahan bakar.",
      "1. Memodelkan sistem kendali daya dorong roket bertingkat (multi-stage rocket).\n2. Memprogram variabel bahan bakar yang berkurang seiring daya dorong menyala.",
      "1. Buat roket dengan efek semburan api di mesinnya.\n2. Buat variabel BahanBakar = 100.\n3. Jika tombol spasi ditekan dan BahanBakar > 0, luncurkan roket ke atas dan kurangi bahan bakar!",
      "Mengapa roket luar angkasa harus melepaskan tabung tangki bahan bakarnya yang kosong saat melesat ke angkasa?",
      "2026-10-29 13:40:00"
    ],
    [
      "STEM-TEC-K6-04",
      "Technology",
      "Merancang Algoritma Enkripsi Sandi Rahasia (Kriptografi)",
      "6",
      "Simulasi",
      "https://scratch.mit.edu/projects/editor/",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
      "Lindungi pesan rahasiamu seperti agen mata-mata! Buat program pengacak huruf menggunakan metode Caesar Cipher kuno.",
      "1. Memahami prinsip dasar keamanan informasi dan enkripsi data digital.\n2. Menggunakan fungsi manipulasi string (huruf ke-n, panjang kata) di Scratch.",
      "1. Masukkan kata rahasia (misal: 'STEM').\n2. Geser setiap huruf maju 3 langkah alfabet: S->V, T->W, E->H, M->P ('VWHP').\n3. Buat program pembalik untuk menguraikan kembali teks rahasianya!",
      "Mengapa enkripsi data sangat penting untuk mengamankan transaksi perbankan dan kata sandi di internet?",
      "2026-10-29 13:45:00"
    ],
    [
      "STEM-TEC-K6-05",
      "Technology",
      "Pemrograman Musik Digital & Komposisi Polifonik di Blockly",
      "6",
      "Simulasi",
      "https://blockly.games/music?lang=id",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
      "Gabungkan harmoni nada bass, melodi utama, dan ketukan drum secara bersamaan menggunakan multi-threading balok kode musik.",
      "1. Memahami konsep eksekusi program secara paralel (concurrent execution).\n2. Menggubah komposisi lagu nasional atau daerah menggunakan kode digital.",
      "1. Buka Blockly Games Musik level lanjutan.\n2. Pasang dua cabang eksekusi nada: satu untuk melodi suling, satu untuk bas drum.\n3. Tekan putar dan nikmati harmoni musik polifonik hasil karyamu!",
      "Bagaimana komputer dapat menjalankan puluhan aplikasi secara bersamaan tanpa saling mengganggu?",
      "2026-10-29 13:50:00"
    ],
    [
      "STEM-TEC-K6-06",
      "Technology",
      "Simulasi Ekosistem Digital Interaktif Predator & Mangsa",
      "6",
      "Simulasi",
      "https://scratch.mit.edu/projects/editor/",
      "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=600&auto=format&fit=crop&q=80",
      "Ciptakan kehidupan virtual: kloning 20 ikan kecil dan 2 hiu pemangsa. Amati bagaimana populasi bertambah dan berkurang secara alami.",
      "1. Menggunakan fitur penggandaan sprite otomatis [Buat Kloning dari Diriku].\n2. Mensimulasikan model komputasi sistem kompleks biologi lingkungan.",
      "1. Buat sprite Ikan Kecil dan atur agar berkembang biak setiap 5 detik.\n2. Buat sprite Hiu yang mengejar ikan terdekat.\n3. Amati grafik populasi jika jumlah hiu ditambah!",
      "Bagaimana ilmuwan memanfaatkan simulasi komputasi komputer untuk memprediksi kepunahan satwa langka?",
      "2026-10-29 13:55:00"
    ],
    [
      "STEM-ENG-K1-01",
      "Engineering",
      "Keseimbangan Menara Balok & Ayunan Jungkat-Jungkit",
      "1",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/balancing-act/latest/balancing-act_all.html",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80",
      "Laboratorium maya PhET untuk menguji keseimbangan papan ayunan: letakkan balok berat dan ringan pada jarak berbeda!",
      "1. Mengenal konsep titik tumpu dan keseimbangan beban.\n2. Mengamati pengaruh jarak benda dari titik tengah jungkat-jungkit.",
      "1. Buka simulasi Balancing Act PhET.\n2. Taruh tong sampah 10 kg di sisi kanan papan ayunan.\n3. Cari posisi balok 5 kg di sisi kiri agar papan ayunan seimbang sejajar!",
      "Mengapa anak yang badannya lebih ringan harus duduk lebih jauh ke ujung agar seimbang?",
      "2026-10-29 14:00:00"
    ],
    [
      "STEM-ENG-K1-02",
      "Engineering",
      "Eksplorasi Benda Meluncur dan Menggelinding di Papan Miring",
      "1",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html",
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
      "Mengapa bola menggelinding lebih cepat daripada balok kayu yang meluncur? Temukan rahasia bentuk bulat pada roda transportasi.",
      "1. Membedakan gerak meluncur (sliding) dan menggelinding (rolling).\n2. Mengidentifikasi keunggulan roda bundar dalam mempermudah pemindahan benda.",
      "1. Luncurkan balok kotak dan bola di papan luncur.\n2. Amati benda mana yang menyentuh lantai terlebih dahulu.\n3. Diskusikan mengapa gerobak dan mobil menggunakan roda bundar!",
      "Bagaimana jadinya jika roda sepeda dibuat berbentuk kotak atau segitiga?",
      "2026-10-29 14:05:00"
    ],
    [
      "STEM-ENG-K1-03",
      "Engineering",
      "Menguji Kekuatan Struktur Rumah Kertas Lipat",
      "1",
      "Praktikum",
      "https://phet.colorado.edu/sims/html/balancing-act/latest/balancing-act_all.html",
      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&auto=format&fit=crop&q=80",
      "Lipat selembar kertas HVS menjadi pilar silinder, pilar kotak, dan pilar segitiga. Uji pilar mana yang sanggup menahan tumpukan buku terberat!",
      "1. Menguji kekuatan berbagai bentuk pilar pondasi bangunan.\n2. Memahami bahwa bentuk silinder lingkaran mampu menyebarkan beban secara merata.",
      "1. Buat 3 tabung dari kertas: satu bundar, satu segitiga, satu persegi.\n2. Berdirikan tabung dan tumpangkan buku tulis satu per satu di atasnya.\n3. Catat berapa banyak buku yang mampu ditahan sebelum kertas ambruk!",
      "Mengapa tiang penyangga jembatan dan gedung besar seringkali berbentuk silinder bundar?",
      "2026-10-29 14:10:00"
    ],
    [
      "STEM-ENG-K1-04",
      "Engineering",
      "Rekayasa Roda dan Poros Sederhana (Gerobak Mainan)",
      "1",
      "Praktikum",
      "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80",
      "Gunakan tutup botol bekas dan tusuk sate sebagai as poros roda. Pasang pada kotak kardus kecil dan dorong di lantai datar.",
      "1. Merakit prototipe kendaraan roda empat sederhana dari bahan daur ulang.\n2. Mengamati pentingnya poros roda yang lurus agar kendaraan melaju seimbang.",
      "1. Lubangi bagian tengah 4 tutup botol plastik.\n2. Masukkan tusuk sate sebagai sumbu poros melalui sedotan di bawah kardus.\n3. Jalankan mobil kardusmu dan ukur jarak tempuhnya saat didorong!",
      "Mengapa lubang pada roda harus tepat berada di titik pusat lingkaran?",
      "2026-10-29 14:15:00"
    ],
    [
      "STEM-ENG-K1-05",
      "Engineering",
      "Desain Perahu Kertas Tahan Air Mengapung",
      "1",
      "Praktikum",
      "https://phet.colorado.edu/sims/html/buoyancy/latest/buoyancy_all.html",
      "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?w=600&auto=format&fit=crop&q=80",
      "Lipat kertas origami dan lapisi dengan krayon lilin. Apungkan di wadah air dan uji berapa koin logam yang bisa diangkut tanpa karam!",
      "1. Memahami sifat lilin/minyak yang menolak air (waterproof).\n2. Merancang lambung perahu yang lebar untuk kestabilan daya apung.",
      "1. Lipat perahu kertas klasik dari origami.\n2. Warnai seluruh permukaan luar perahu dengan krayon lilin tebal.\n3. Apungkan di ember dan taruh koin 500 rupiah di dalamnya satu per satu!",
      "Mengapa krayon lilin dapat mencegah kertas origami menyerap air dan menjadi lembek?",
      "2026-10-29 14:20:00"
    ],
    [
      "STEM-ENG-K1-06",
      "Engineering",
      "Merancang Menara Balok Tertinggi Tanpa Tumbang",
      "1",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/balancing-act/latest/balancing-act_all.html",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80",
      "Tantangan arsitek cilik: susun balok kayu setinggi mungkin. Temukan rahasia mengapa dasar menara harus dibuat lebih lebar dan berat.",
      "1. Memahami pentingnya dasar pondasi yang lebar untuk pusat gravitasi yang stabil.\n2. Melatih ketelitian dan kesabaran dalam perakitan struktur fisik.",
      "1. Mulai dengan balok terlebar di bagian lantai.\n2. Tumpuk balok-balok berikutnya secara simetris ke atas.\n3. Ukur tinggi menara menggunakan penggaris sebelum menara bergoyang!",
      "Mengapa piramida di Mesir tidak pernah runtuh meskipun sudah berusia ribuan tahun?",
      "2026-10-29 14:25:00"
    ],
    [
      "STEM-ENG-K2-01",
      "Engineering",
      "Desain Perahu Apung Anti Tenggelam (Hukum Apung)",
      "2",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/buoyancy/latest/buoyancy_all.html",
      "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?w=600&auto=format&fit=crop&q=80",
      "Mengapa perahu kayu besar bisa mengapung sedangkan koin kecil tenggelam? Uji massa jenis benda di kolam virtual.",
      "1. Menjelaskan peristiwa terapung, melayang, dan tenggelam.\n2. Mengidentifikasi hubungan antara bentuk lambung kapal dengan daya apung.",
      "1. Buka simulasi Buoyancy PhET.\n2. Jatuhkan balok kayu, apel, dan balok besi ke dalam air virtual.\n3. Perhatikan gaya angkat air yang mendorong benda ke permukaan!",
      "Mengapa kapal laut yang terbuat dari besi berat tetap bisa mengapung di lautan luas?",
      "2026-10-29 14:30:00"
    ],
    [
      "STEM-ENG-K2-02",
      "Engineering",
      "Uji Pegas Elastis & Karet Pelontar Energi",
      "2",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/masses-and-springs/latest/masses-and-springs_all.html",
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
      "Gantungkan beban pada pegas baja di PhET: amati bagaimana regangan pegas menyimpan energi potensial elastis yang memantul.",
      "1. Mengenal sifat elastisitas bahan pegas dan karet.\n2. Menghubungkan berat massa beban dengan panjang regangan pegas.",
      "1. Buka simulasi Masses and Springs PhET.\n2. Gantungkan beban 50 gram dan ukur panjang pertambahan pegas.\n3. Ganti dengan beban 100 gram dan bandingkan hasilnya!",
      "Bagaimana pegas di dalam kasur tempat tidur atau suspensi motor membuat kita nyaman saat terjadi guncangan?",
      "2026-10-29 14:35:00"
    ],
    [
      "STEM-ENG-K2-03",
      "Engineering",
      "Merancang Pesawat Kertas Aerodinamis Luncur Panjang",
      "2",
      "Praktikum",
      "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html",
      "https://images.unsplash.com/photo-1517976487502-5c8e4e9b942e?w=600&auto=format&fit=crop&q=80",
      "Eksperimen lipatan sayap: rancang dua model pesawat kertas (model sayap dart runcing vs model glider sayap lebar) dan uji jarak jelajahnya.",
      "1. Memahami gaya angkat udara (aerodinamika) pada sayap pesawat.\n2. Melakukan eksperimen perbandingan jarak tempuh dengan variabel bentuk sayap.",
      "1. Lipat pesawat model A (runcing) dan model B (sayap lebar).\n2. Luncurkan masing-masing 3 kali dari garis start yang sama.\n3. Ukur jarak mendarat menggunakan meteran dan tentukan pemenangnya!",
      "Mengapa pesawat jet supersonik memiliki sayap runcing ke belakang mirip burung pemangsa?",
      "2026-10-29 14:40:00"
    ],
    [
      "STEM-ENG-K2-04",
      "Engineering",
      "Bidang Miring: Memindahkan Beban Berat ke Atas Truk",
      "2",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
      "Mana yang lebih ringan: mengangkat drum minyak langsung ke bak truk atau mendorongnya melalui papan miring kayu?",
      "1. Mengenal bidang miring sebagai salah satu jenis pesawat sederhana.\n2. Menjelaskan bahwa bidang miring memperkecil gaya kuasa yang dibutuhkan.",
      "1. Siapkan papan kayu yang disandarkan pada tumpukan buku.\n2. Tarik beban mobil mainan dengan karet gelang secara tegak lurus ke atas.\n3. Tarik beban yang sama melewati papan miring dan perhatikan regangan karetnya!",
      "Mengapa jalan raya menuju puncak gunung yang terjal selalu dibuat berkelok-kelok melingkar?",
      "2026-10-29 14:45:00"
    ],
    [
      "STEM-ENG-K2-05",
      "Engineering",
      "Membangun Parasut Pendarat Telur Aman dari Ketinggian",
      "2",
      "Praktikum",
      "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html",
      "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?w=600&auto=format&fit=crop&q=80",
      "Ikat kantong plastik kresek dengan 4 utas benang ke cangkir kecil berisi beban. Jatuhkan dari ketinggian dan amati hambatan udara memperlambat laju jatuh.",
      "1. Menjelaskan fungsi gaya gesek udara (air resistance) dalam memperlambat gerak jatuh benda.\n2. Merancang kubah parasut yang seimbang dan simetris.",
      "1. Gunting kantong plastik menjadi segi delapan yang rapi.\n2. Ikat 4 helai benang kasur dengan panjang yang persis sama di setiap sudutnya.\n3. Ikatkan ujung benang ke cangkir beban dan jatuhkan dari atas tangga!",
      "Mengapa parasut yang kanopinya lebih luas mendarat jauh lebih lambat dan lembut?",
      "2026-10-29 14:50:00"
    ],
    [
      "STEM-ENG-K2-06",
      "Engineering",
      "Konstruksi Rumah Tahan Angin Kencang Badai",
      "2",
      "Praktikum",
      "https://phet.colorado.edu/sims/html/balancing-act/latest/balancing-act_all.html",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
      "Rancang miniatur rumah dari stik es krim dengan bentuk atap segitiga miring vs atap datar. Tiup dengan kipas angin kencang untuk menguji ketahanannya!",
      "1. Menganalisis pengaruh bentuk geometri atap terhadap aliran angin badai.\n2. Merancang sambungan kerangka stik yang kokoh.",
      "1. Rakit miniatur rumah A dengan atap datar dan rumah B dengan atap prisma miring.\n2. Nyalakan kipas angin di depan kedua rumah.\n3. Amati rumah mana yang atapnya terangkat terbang tertiup angin!",
      "Mengapa rumah tradisional di daerah berangin seringkali memiliki atap miring curam?",
      "2026-10-29 14:55:00"
    ],
    [
      "STEM-ENG-K3-01",
      "Engineering",
      "Pesawat Sederhana: Tuas Pengungkit & Titik Tumpu",
      "3",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/balancing-act/latest/balancing-act_all.html",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80",
      "Ungkit batu karang besar menggunakan sebatang tongkat besi! Geser titik tumpu lebih dekat ke batu dan rasakan ringannya mengangkat beban berat.",
      "1. Mengidentifikasi bagian tuas: Titik Tumpu, Beban, dan Kuasa.\n2. Menjelaskan keuntungan mekanis tuas jenis pertama, kedua, dan ketiga.",
      "1. Buka simulasi Balancing Act PhET mode Lab Keseimbangan.\n2. Letakkan beban 20 kg di dekat tiang poros tengah.\n3. Letakkan beban 5 kg di ujung terluar papan dan amati posisinya seimbang!",
      "Mengapa gunting kuku dan pembuka tutup botol termasuk ke dalam alat pengungkit?",
      "2026-10-29 15:00:00"
    ],
    [
      "STEM-ENG-K3-02",
      "Engineering",
      "Katrol Penimba Air Sumur & Pemindah Peti Petikemas",
      "3",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html",
      "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=600&auto=format&fit=crop&q=80",
      "Amati roda berparit yang dilalui tali: mengapa katrol tetap mengubah arah gaya tarikan kita ke bawah menjadi tarikan ember ke atas?",
      "1. Membedakan cara kerja katrol tetap, katrol bebas, dan katrol majemuk.\n2. Menjelaskan manfaat katrol pada tiang bendera upacara dan crane pelabuhan.",
      "1. Rangkai katrol sederhana dari roda benang dan tali kasur.\n2. Tarik tali ke bawah dan perhatikan beban terangkat ke atas.\n3. Diskusikan kemudahan menarik tali ke bawah memanfaatkan bantuan gravitasi tubuh!",
      "Bagaimana crane raksasa di pelabuhan bisa mengangkat peti kemas seberat puluhan ton?",
      "2026-10-29 15:05:00"
    ],
    [
      "STEM-ENG-K3-03",
      "Engineering",
      "Uji Kekuatan Bahan: Kayu, Kaca, Plastik, dan Logam",
      "3",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/density/latest/density_all.html",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
      "Seorang insinyur harus memilih bahan yang tepat: kapan kita memakai logam yang kokoh, plastik yang ringan tahan air, atau kaca yang bening tembus cahaya?",
      "1. Mengidentifikasi sifat mekanik bahan (kekerasan, kelenturan, kerapatan).\n2. Memilih material yang paling tepat untuk pembuatan bagian-bagian helm keselamatan.",
      "1. Buka simulasi Density PhET.\n2. Bandingkan massa jenis balok kayu, aluminium, dan bata.\n3. Pasangkan bagian kendaraan (kaca depan, rangka bodi, ban karet) dengan material terbaiknya!",
      "Mengapa panci memasak dibuat dari logam aluminium sedangkan gagang pegangannya dibuat dari plastik kayu?",
      "2026-10-29 15:10:00"
    ],
    [
      "STEM-ENG-K3-04",
      "Engineering",
      "Sistem Kincir Air Pembangkit Energi Gerak Tradisional",
      "3",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/energy-forms-and-changes/latest/energy-forms-and-changes_all.html",
      "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80",
      "Manfaatkan aliran air sungai untuk memutar bilah sudu kincir. Putaran poros kincir disambungkan ke alu penumbuk padi di desa.",
      "1. Memahami konversi energi kinetik aliran air menjadi energi mekanik putaran poros.\n2. Merancang sudu bilah kincir air yang efektif menangkap arus air.",
      "1. Buka tab Sistem Energi di PhET.\n2. Alirkan kran air ke atas roda turbin.\n3. Amati perubahan kecepatan putaran saat debit aliran air diperbesar!",
      "Mengapa pembangkit listrik tenaga air (PLTA) selalu dibangun di dekat air terjun atau bendungan sungai yang tinggi?",
      "2026-10-29 15:15:00"
    ],
    [
      "STEM-ENG-K3-05",
      "Engineering",
      "Merancang Mobil Bertenaga Semburan Udara Balon",
      "3",
      "Praktikum",
      "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80",
      "Tiup balon melalui sedotan yang terpasang di atas mobil mainan kardus. Lepaskan mulut sedotan dan rasakan daya dorong aksi-reaksi roket!",
      "1. Menerapkan hukum aksi-reaksi (udara menyembur ke belakang, mobil melaju ke depan).\n2. Mengoptimalkan bobot bodi mobil agar melesat paling jauh.",
      "1. Pasang balon karet pada sedotan bengkok dan rekatkan di atap mobil karton.\n2. Tiup balon hingga mengembang maksimal.\n3. Lepaskan di lantai keramik dan ukur jarak jelajah terjauhnya!",
      "Mengapa mobil berhenti melaju setelah udara di dalam balon habis keluar?",
      "2026-10-29 15:20:00"
    ],
    [
      "STEM-ENG-K3-06",
      "Engineering",
      "Desain Kubah Pelindung Kokoh (Geodesic Dome)",
      "3",
      "Praktikum",
      "https://phet.colorado.edu/sims/html/balancing-act/latest/balancing-act_all.html",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=80",
      "Susun sedotan minuman dan plastisin membentuk jalinan segitiga kubah setengah bola. Kubah segitiga adalah struktur paling tahan gempa di dunia!",
      "1. Memahami kestabilan alami bentuk geometri segitiga dibanding segiempat.\n2. Merakit struktur kubah hemisfer yang kokoh menahan beban tekan.",
      "1. Potong sedotan menjadi ukuran sama panjang.\n2. Sambungkan dengan bola-bola plastisin membentuk segitiga demi segitiga.\n3. Satukan hingga membentuk setengah bola kubah mandiri!",
      "Mengapa rangka atap rumah dan jembatan selalu dirangkai dari pola segitiga berulang?",
      "2026-10-29 15:25:00"
    ],
    [
      "STEM-ENG-K4-01",
      "Engineering",
      "Rancang Bangun Jembatan Rangka Segitiga (Truss Bridge)",
      "4",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/balancing-act/latest/balancing-act_all.html",
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&auto=format&fit=crop&q=80",
      "Uji beban jembatan: mengapa pola segitiga (truss) pada jembatan kereta api dapat menahan bobot ratusan ton lokomotif tanpa melengkung patah?",
      "1. Menganalisis gaya tarik (tension) dan gaya tekan (compression) pada rangka jembatan.\n2. Menghitung distribusi beban pada tiang-tiang penyangga abutment.",
      "1. Pelajari desain jembatan rangka Warren dan Pratt Truss.\n2. Simulasikan penempatan beban truk di tengah bentang jembatan.\n3. Identifikasi balok rangka mana yang menahan gaya tekan terbesar!",
      "Mengapa struktur persegi empat mudah bergoyang miring sedangkan struktur segitiga tetap kaku?",
      "2026-10-29 15:30:00"
    ],
    [
      "STEM-ENG-K4-02",
      "Engineering",
      "Roda Gigi (Gears) & Rasio Kecepatan Putaran Mesin",
      "4",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
      "Hubungkan roda gigi besar (40 gigi) dengan roda gigi kecil (10 gigi): satu putaran gear besar membuat gear kecil berputar 4 kali lebih kencang!",
      "1. Memahami mekanisme transmisi gerak roda bergigi (gear ratio).\n2. Membedakan fungsi gear untuk meningkatkan kecepatan vs meningkatkan torsi daya kayuh sepeda.",
      "1. Perhatikan susunan rantai dan gear pada sepeda gunung.\n2. Amati arah putaran roda gigi saat saling bersinggungan langsung (arah berlawanan).\n3. Hitung perbandingan putaran gear pedal dan gear roda belakang!",
      "Mengapa saat menaiki tanjakan terjal kita harus memindahkan gear sepeda ke roda gigi yang paling besar?",
      "2026-10-29 15:35:00"
    ],
    [
      "STEM-ENG-K4-03",
      "Engineering",
      "Desain Kincir Angin Penangkap Daya Udara Optimal",
      "4",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/energy-forms-and-changes/latest/energy-forms-and-changes_all.html",
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&auto=format&fit=crop&q=80",
      "Uji sudut bilah kincir: bilah dengan kemiringan berapa derajat yang menghasilkan putaran generator tercepat saat tertiup angin sepoi-sepoi?",
      "1. Menganalisis pengaruh jumlah sudu bilah (2, 3, atau 4 bilah) terhadap efisiensi kincir.\n2. Memahami konversi energi angin menjadi listrik terbarukan.",
      "1. Buka simulasi energi PhET.\n2. Variasikan hembusan angin dari rendah hingga kencang.\n3. Catat energi listrik yang dihasilkan pada lampu penerang!",
      "Mengapa kincir angin turbin modern raksasa di ladang angin selalu memiliki 3 bilah pisau?",
      "2026-10-29 15:40:00"
    ],
    [
      "STEM-ENG-K4-04",
      "Engineering",
      "Perancangan Jalur Roller Coaster Berkelok Seru (PhET Energy)",
      "4",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/energy-skate-park/latest/energy-skate-park_all.html",
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80",
      "Laboratorium maya PhET: rancang lintasan roller coaster dengan tanjakan curam dan lingkaran loop 360 derajat tanpa membuat kereta terjatuh!",
      "1. Menjelaskan hukum kekekalan energi mekanik (Energi Potensial + Kinetik).\n2. Memahami syarat kecepatan minimum saat kereta melintasi titik tertinggi loop putar.",
      "1. Buka PhET Energy Skate Park.\n2. Rancang bukit pertama setinggi mungkin untuk mengumpulkan energi potensial.\n3. Jalankan pemain skateboard dan perhatikan grafik batang energinya berubah warna-warni!",
      "Mengapa bukit kedua pada lintasan roller coaster harus selalu lebih rendah dari bukit pertamanya?",
      "2026-10-29 15:45:00"
    ],
    [
      "STEM-ENG-K4-05",
      "Engineering",
      "Sistem Filtrasi Air Bersih Alami Bertingkat",
      "4",
      "Praktikum",
      "https://phet.colorado.edu/sims/html/density/latest/density_all.html",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
      "Ubah air got keruh menjadi air jernih menggunakan botol penyaring: susun lapisan kerikil, pasir halus, arang aktif, dan kapas secara berlapis.",
      "1. Menjelaskan fungsi masing-masing lapisan penyaring air (kerikil menyaring daun, arang menyerap bau/racun).\n2. Merancang prototipe instalasi pengolahan air bersih darurat bencana.",
      "1. Potong bagian bawah botol air mineral bekas.\n2. Masukkan secara berturut-turut dari bawah: kapas, arang halus, pasir, dan kerikil.\n3. Tuangkan air keruh berlumpur dan saksikan tetesan air jernih keluar dari mulut botol!",
      "Apakah air yang tampak jernih dari penyaring alami sudah boleh langsung diminum? Mengapa harus direbus terlebih dahulu?",
      "2026-10-29 15:50:00"
    ],
    [
      "STEM-ENG-K4-06",
      "Engineering",
      "Rekayasa Kotak Termos Isolator Penahan Es Mencair",
      "4",
      "Praktikum",
      "https://phet.colorado.edu/sims/html/energy-forms-and-changes/latest/energy-forms-and-changes_all.html",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
      "Bungkus es batu dengan kardus, kapas, aluminium foil, dan bubble wrap. Rancang kemasan pendingin yang paling lama menjaga es batu dari lelehan panas ruangan.",
      "1. Mengidentifikasi konduktor panas dan isolator panas yang baik.\n2. Menganalisis peran ruang hampa udara dan lapisan pemantul perak pada dinding termos.",
      "1. Siapkan 3 kotak kardus kecil.\n2. Kotak 1 dibiarkan polos, kotak 2 dilapisi kapas tebal, kotak 3 dibungkus foil aluminium.\n3. Masukkan 1 balok es batu ke tiap kotak dan cek setelah 30 menit!",
      "Mengapa botol termos air panas di rumah memiliki dinding ganda dengan ruang hampa udara di tengahnya?",
      "2026-10-29 15:55:00"
    ],
    [
      "STEM-ENG-K5-01",
      "Engineering",
      "Laboratorium Sirkuit Listrik Rumah Pintar Virtual",
      "5",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_all.html",
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=600&auto=format&fit=crop&q=80",
      "Rangkai kabel, baterai, sakelar, dan lampu bohlam di PhET. Uji coba rangkaian seri dan paralel tanpa takut tersetrum!",
      "1. Membedakan karakteristik rangkaian listrik seri dan paralel.\n2. Mengidentifikasi konduktor dan isolator listrik di laboratorium virtual.",
      "1. Buka simulasi Circuit Construction Kit DC PhET.\n2. Hubungkan 1 baterai, sakelar, dan 2 lampu dalam satu jalur lurus (seri).\n3. Tutup sakelar dan amati apa yang terjadi jika salah satu lampu dilepas!",
      "Mengapa instalasi lampu di rumah-rumah dipasang menggunakan rangkaian paralel?",
      "2026-10-29 16:00:00"
    ],
    [
      "STEM-ENG-K5-02",
      "Engineering",
      "Desain Sistem Pompa Hidrolik Tekanan Air Fluida",
      "5",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/under-pressure/latest/under-pressure_all.html",
      "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?w=600&auto=format&fit=crop&q=80",
      "Hubungkan dua suntikan plastik dengan selang berisi air: tekan piston kecil dan lihat piston besar mampu mengangkat batu berat dengan mudah (Hukum Pascal).",
      "1. Memahami prinsip transmisi tekanan fluida zat cair di ruang tertutup.\n2. Menjelaskan mekanisme kerja dongkrak hidrolik mobil dan rem cakram sepeda motor.",
      "1. Buka simulasi Under Pressure PhET.\n2. Amati kenaikan tekanan air di dasar kolam penampungan.\n3. Simulasikan penekanan fluida dan catat gaya dorong yang dihasilkan!",
      "Bagaimana seorang montir yang hanya menginjak pedal kecil bisa mengangkat mobil seberat 2 ton di bengkel cucian?",
      "2026-10-29 16:05:00"
    ],
    [
      "STEM-ENG-K5-03",
      "Engineering",
      "Konstruksi Menara Tahan Getaran Gempa Bumi (Base Isolator)",
      "5",
      "Praktikum",
      "https://phet.colorado.edu/sims/html/masses-and-springs/latest/masses-and-springs_all.html",
      "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=600&auto=format&fit=crop&q=80",
      "Rancang gedung 3 lantai dari stik kayu di atas nampan berisi agar-agar/pegas peredam. Guncang nampan untuk mensimulasikan gelombang gempa tektonik!",
      "1. Menganalisis resonansi gelombang getaran seismik pada struktur bangunan bertingkat.\n2. Merancang sistem peredam kejut pondasi (tuned mass damper).",
      "1. Buat model kerangka gedung dengan stik kayu.\n2. Gantungkan bola bandul pemberat di lantai teratas sebagai penyeimbang ayunan.\n3. Guncang meja simulasi dan bandingkan stabilitas gedung dengan dan tanpa bandul!",
      "Mengapa gedung pencakar langit tertinggi di Taiwan (Taipei 101) memiliki bola baja raksasa di lantai puncaknya?",
      "2026-10-29 16:10:00"
    ],
    [
      "STEM-ENG-K5-04",
      "Engineering",
      "Perancangan Mobil Panel Surya Tenaga Matahari",
      "5",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/energy-forms-and-changes/latest/energy-forms-and-changes_all.html",
      "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80",
      "Padukan sel fotovoltaik surya dengan motor listrik DC kecil. Pelajari bagaimana foton sinar matahari diubah langsung menjadi arus listrik penggerak roda.",
      "1. Memahami prinsip kerja sel surya (solar cell) mengubah cahaya menjadi arus DC.\n2. Mengoptimalkan sudut kemiringan panel surya agar selalu tegak lurus menyerap sinar matahari.",
      "1. Buka tab Sistem Energi PhET.\n2. Pilih panel surya sebagai pengubah energi.\n3. Sorotkan matahari dan sambungkan ke dinamo motor kipas!",
      "Tantangan apa yang dihadapi mobil bertenaga surya saat cuaca berawan mendung atau malam hari?",
      "2026-10-29 16:15:00"
    ],
    [
      "STEM-ENG-K5-05",
      "Engineering",
      "Desain Sistem Irigasi Tetes Otomatis Pertanian Modern",
      "5",
      "Praktikum",
      "https://phet.colorado.edu/sims/html/under-pressure/latest/under-pressure_all.html",
      "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=600&auto=format&fit=crop&q=80",
      "Rancang jaringan selang air berlubang jarum mikro dari botol infus gantung untuk menyirami tanaman sayur secara konstan tanpa memboroskan air.",
      "1. Menerapkan rekayasa hidrologi penghematan air pertanian hingga 70%.\n2. Mengatur laju tetesan air sesuai kebutuhan kelembaban tanah tanaman.",
      "1. Gantungkan botol air di tiang kayu setinggi 1 meter.\n2. Pasang selang plastik kecil dengan kran pengatur tetes (roller clamp).\n3. Teteskan 1 tetes per 5 detik tepat di zona perakaran tanaman tomat!",
      "Mengapa sistem irigasi tetes sangat populer digunakan oleh petani di daerah gurun pasir yang langka air?",
      "2026-10-29 16:20:00"
    ],
    [
      "STEM-ENG-K5-06",
      "Engineering",
      "Eksplorasi Gelombang & Getaran Senar Akustik",
      "5",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/wave-on-a-string/latest/wave-on-a-string_all.html",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
      "Laboratorium maya PhET: getarkan senar gitar virtual, ubah tegangan senar dan redamannya untuk memahami frekuensi tinggi nada musik.",
      "1. Menganalisis hubungan antara ketegangan senar dengan tinggi rendah nada (pitch).\n2. Memahami pembentukan gelombang stasioner pada instrumen dawai akustik.",
      "1. Buka simulasi Wave on a String PhET.\n2. Pilih mode Osilasi dan atur ujung senar Terikat (Fixed End).\n3. Tingkatkan tegangan tali (Tension) dan amati gelombang merambat semakin cepat!",
      "Mengapa pemain gitar memutar sekrup pasak di ujung leher gitar saat menyetem nada?",
      "2026-10-29 16:25:00"
    ],
    [
      "STEM-ENG-K6-01",
      "Engineering",
      "Rancang Bangun Jembatan Gantung Kabel Baja (Suspension Bridge)",
      "6",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/balancing-act/latest/balancing-act_all.html",
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&auto=format&fit=crop&q=80",
      "Ketahui bagaimana dua menara pylon raksasa dan kabel baja lengkung utama dapat menopang bentang jalan raya sepanjang ribuan meter di atas selat.",
      "1. Menganalisis distribusi gaya tarik pada kabel penggantung vertikal dan kabel utama.\n2. Memahami pentingnya blok angkur beton raksasa yang tertanam di kedua ujung daratan.",
      "1. Pelajari konstruksi Jembatan Golden Gate dan Jembatan Suramadu.\n2. Simulasikan gaya tarik kabel saat diterpa angin kencang.\n3. Buat sketsa diagram gaya jembatan gantung pada lembar tugas!",
      "Mengapa jembatan gantung menjadi pilihan utama insinyur untuk menyeberangi selat laut yang sangat dalam?",
      "2026-10-29 16:30:00"
    ],
    [
      "STEM-ENG-K6-02",
      "Engineering",
      "Simulasi Turbin Generator Listrik Induksi Faraday",
      "6",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/faradays-law/latest/faradays-law_all.html",
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&auto=format&fit=crop&q=80",
      "Gerakkan magnet batang keluar-masuk kumparan kawat tembaga di PhET. Saksikan bagaimana medan magnet yang bergerak membangkitkan arus listrik!",
      "1. Membuktikan hukum induksi elektromagnetik Faraday secara virtual.\n2. Menjelaskan prinsip dasar generator listrik di PLTA dan dinamo sepeda.",
      "1. Buka simulasi Faradays Law PhET.\n2. Gerakkan magnet dengan cepat ke dalam kumparan kawat 4 lilitan.\n3. Perhatikan jarum voltmeter menyimpang dan lampu menyala benderang!",
      "Apa pengaruh jumlah lilitan kawat tembaga terhadap tegangan listrik yang dihasilkan generator?",
      "2026-10-29 16:35:00"
    ],
    [
      "STEM-ENG-K6-03",
      "Engineering",
      "Sirkuit Logika Sakelar Lampu Tangga Dua Arah (SPDT)",
      "6",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_all.html",
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=600&auto=format&fit=crop&q=80",
      "Pernahkah kamu menyalakan lampu tangga dari lantai bawah lalu mematikannya dari lantai atas? Rancang sirkuit sakelar dua arah di PhET!",
      "1. Merangkai sistem sakelar dua arah (Single Pole Double Throw / SPDT).\n2. Memahami penerapan gerbang logika XOR dalam instalasi kelistrikan rumah modern.",
      "1. Buka Circuit Construction Kit DC PhET.\n2. Pasang dua sakelar dua arah di antara jalur baterai dan lampu.\n3. Uji coba klik sakelar 1 untuk menyalakan dan sakelar 2 untuk mematikan!",
      "Bagaimana sistem sakelar cerdas ini menghemat energi dan mempermudah penghuni rumah bertingkat?",
      "2026-10-29 16:40:00"
    ],
    [
      "STEM-ENG-K6-04",
      "Engineering",
      "Rekayasa Aerodinamika Roket Air Tekanan Udara Tinggi",
      "6",
      "Praktikum",
      "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html",
      "https://images.unsplash.com/photo-1517976487502-5c8e4e9b942e?w=600&auto=format&fit=crop&q=80",
      "Isi botol soda dengan 1/3 air, pompa dengan udara hingga tekanan 40 PSI, lalu lepaskan kunci peluncur. Saksikan semburan air menerbangkan roket hingga 50 meter!",
      "1. Menentukan rasio volume air dan udara yang menghasilkan daya dorong impuls optimal.\n2. Memasang sirip stabilizer (fins) agar lintasan roket lurus stabil tanpa berputar liar.",
      "1. Pasang 3 sirip segitiga simetris di bagian ekor botol soda.\n2. Pasang kerucut moncong hidung (nose cone) yang aerodinamis.\n3. Uji peluncuran di lapangan terbuka dan catat tinggi terbang maksimalnya!",
      "Mengapa roket yang hanya diisi udara tanpa air sama sekali tidak bisa melesat tinggi?",
      "2026-10-29 16:45:00"
    ],
    [
      "STEM-ENG-K6-05",
      "Engineering",
      "Desain Rumah Sehat Ramah Lingkungan Hemat Energi (Eco-House)",
      "6",
      "Lab Maya",
      "https://phet.colorado.edu/sims/html/greenhouse-effect/latest/greenhouse-effect_all.html",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
      "Arsitektur ramah bumi: rancang ventilasi silang penangkap angin sejuk, jendela skylight cahaya alami, serta atap penampung air hujan.",
      "1. Mengintegrasikan prinsip bioclimatic architecture dalam denah hunian.\n2. Mengurangi ketergantungan pada pendingin ruangan (AC) dan lampu siang hari.",
      "1. Buat denah tata letak ruangan dengan posisi bukaan jendela menghadap utara-selatan.\n2. Tambahkan kanopi teras pelindung dari terik matahari timur-barat.\n3. Rancang instalasi penampungan air hujan untuk menyiram taman!",
      "Berapa persen tagihan listrik bulanan yang bisa dihemat jika rumah memanfaatkan ventilasi silang alami?",
      "2026-10-29 16:50:00"
    ],
    [
      "STEM-ENG-K6-06",
      "Engineering",
      "Sistem Pemilah Sampah Logam dengan Derek Elektromagnet",
      "6",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/faradays-law/latest/faradays-law_all.html",
      "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=600&auto=format&fit=crop&q=80",
      "Lilitkan kawat pada paku besi dan hubungkan ke sakelar baterai. Saat sakelar tertutup, paku menjadi magnet kuat yang mengangkat rongsokan besi di pabrik daur ulang!",
      "1. Merancang elektromagnet sementara yang kekuatannya bisa dikendalikan oleh sakelar listrik.\n2. Menjelaskan penerapan derek elektromagnet dalam industri pemilahan sampah logam modern.",
      "1. Lilitkan kawat tembaga 50 lilitan pada paku besi besar.\n2. Hubungkan kedua ujung kawat ke kutub baterai 9 Volt.\n3. Dekatkan ke klip kertas: amati klip menempel saat sakelar ON dan langsung jatuh saat sakelar OFF!",
      "Apa keunggulan elektromagnet dibanding magnet permanen dalam industri bongkar muat logam?",
      "2026-10-29 16:55:00"
    ],
    [
      "STEM-MAT-K1-01",
      "Mathematics",
      "Laboratorium Geometri Bangun Datar Ceria (GeoGebra)",
      "1",
      "Simulasi",
      "https://www.geogebra.org/geometry",
      "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&auto=format&fit=crop&q=80",
      "Laboratorium geometri GeoGebra: melukis lingkaran, segitiga, persegi, menghubungkan titik sudut, dan mewarnai bangun datar ceria.",
      "1. Mengidentifikasi bentuk bangun datar dasar (lingkaran, segitiga, segiempat).\n2. Melatih ketelitian anak dalam menghubungkan garis dan titik sudut.",
      "1. Buka kanvas geometri GeoGebra (bebas akses tanpa login).\n2. Pilih alat Segi Banyak dan buat aneka bangun datar.\n3. Beri warna-warni ceria pada setiap bidangnya!",
      "Ada berapa titik sudut yang dimiliki oleh sebuah segitiga dibandingkan dengan persegi?",
      "2026-10-29 17:00:00"
    ],
    [
      "STEM-MAT-K1-02",
      "Mathematics",
      "Eksplorasi Blok Pola Geometri Warna-Warni di Polypad",
      "1",
      "Simulasi",
      "https://mathigon.org/polypad#tangram",
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
      "Gabungkan balok segitiga hijau, belah ketupat biru, dan trapesium merah menjadi mosaik bunga matahari yang indah di kanvas Mathigon.",
      "1. Mengenal sifat simetri dan penyusunan pola ubin bangun datar.\n2. Mengasah nalar spasial anak dalam menyusun puzzle bentuk.",
      "1. Buka kanvas Polypad di browser.\n2. Tarik beberapa segitiga sama sisi ke ruang kerja.\n3. Rapatkan sisi-sisinya hingga membentuk segienam sempurna!",
      "Berapa banyak segitiga kecil yang dibutuhkan untuk membentuk satu segienam yang utuh?",
      "2026-10-29 17:05:00"
    ],
    [
      "STEM-MAT-K1-03",
      "Mathematics",
      "Menghitung Bilangan 1-20 dengan Garis Lompat Katak",
      "1",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/make-a-ten/latest/make-a-ten_all.html",
      "https://images.unsplash.com/photo-1584697964190-705b893683f1?w=600&auto=format&fit=crop&q=80",
      "Lompat maju untuk menjumlahkan dan lompat mundur untuk mengurangkan! Belajar berhitung jadi konkret dan menyenangkan bersama PhET Make-a-Ten.",
      "1. Menghitung maju dan mundur pada garis bilangan 1 sampai 20.\n2. Memahami konsep dasar penjumlahan sebagai penggabungan dua himpunan benda.",
      "1. Buka simulasi Make a Ten PhET.\n2. Tarik apel merah ke dalam keranjang hingga berjumlah 10.\n3. Tambahkan 3 apel hijau dan baca hasil penjumlahannya: 10 + 3 = 13!",
      "Mengapa mengelompokkan benda menjadi kelipatan 10 membuat kita jauh lebih cepat berhitung?",
      "2026-10-29 17:10:00"
    ],
    [
      "STEM-MAT-K1-04",
      "Mathematics",
      "Mengenal Jam Dinding Analog: Membaca Waktu Tepat",
      "1",
      "Simulasi",
      "https://mathigon.org/polypad#clocks",
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
      "Putar jarum jam virtual: kenali jarum pendek penunjuk jam dan jarum panjang penunjuk menit pada jam analog di dinding kelas.",
      "1. Membaca waktu tepat (pukul 07.00, 09.00, 12.00) pada jam dinding analog.\n2. Mengaitkan jadwal kegiatan harian (bangun tidur, sarapan, belajar) dengan angka jam.",
      "1. Buka jam virtual Polypad.\n2. Arahkan jarum panjang tegak lurus ke angka 12.\n3. Putar jarum pendek ke angka 7 untuk menunjukkan waktu bel masuk sekolah berbunyi!",
      "Di angka berapakah jarum panjang berada ketika jam menunjukkan tepat pukul 10.00?",
      "2026-10-29 17:15:00"
    ],
    [
      "STEM-MAT-K1-05",
      "Mathematics",
      "Mengelompokkan Benda: Lebih Banyak, Lebih Sedikit, atau Sama",
      "1",
      "Simulasi",
      "https://mathigon.org/polypad#balance",
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
      "Letakkan bola kelereng di sisi kiri dan kanan timbangan neraca angka Polypad. Bandingkan mana kelompok benda yang lebih banyak atau sama banyak.",
      "1. Membandingkan banyak dua kelompok benda menggunakan istilah 'lebih banyak', 'lebih sedikit', atau 'sama banyak'.\n2. Mengenal simbol sama dengan (=) sebagai tanda keseimbangan nilai.",
      "1. Taruh 4 balok di sisi kiri neraca timbangan Polypad.\n2. Taruh 6 balok di sisi kanan neraca.\n3. Perhatikan sisi mana yang turun lebih berat dan tuliskan perbandingannya!",
      "Berapa balok yang harus ditambahkan ke sisi kiri agar kedua sisi timbangan menjadi seimbang?",
      "2026-10-29 17:20:00"
    ],
    [
      "STEM-MAT-K1-06",
      "Mathematics",
      "Eksplorasi Bangun Ruang di Sekitar Kita (Balok, Kubus, Bola)",
      "1",
      "Simulasi",
      "https://mathigon.org/polypad#solids",
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
      "Kotak susu berbentuk balok, dadu permainan berbentuk kubus, dan semangka berbentuk bola. Putar model 3D-nya di browser!",
      "1. Mengenal ragam bangun ruang sederhana (kubus, balok, tabung, bola).\n2. Membedakan benda yang bisa menggelinding bebas (bola) dan benda yang bisa ditumpuk tegak (kotak).",
      "1. Buka menu Bangun 3D di Polypad.\n2. Putar bentuk kubus dan tabung kaleng susu.\n3. Hitung jumlah sisi datar pada sebuah kubus!",
      "Mengapa kaleng biskuit berbentuk tabung bisa ditumpuk rapi tetapi juga bisa digulingkan?",
      "2026-10-29 17:25:00"
    ],
    [
      "STEM-MAT-K2-01",
      "Mathematics",
      "Eksplorasi Tangram 2D & Jam Dinding Virtual",
      "2",
      "Simulasi",
      "https://mathigon.org/polypad#tangram",
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
      "Susun 7 potongan puzzle ajaib Tangram di Mathigon Polypad menjadi bentuk hewan dan putar jarum jam virtual untuk membaca waktu.",
      "1. Menyusun berbagai bentuk siluet menggunakan 7 potongan geometri tangram.\n2. Membaca dan menunjukkan waktu pada jam analog (jarum pendek dan panjang).",
      "1. Buka kanvas Polypad Tangram di browser.\n2. Putar dan susun 2 segitiga besar dan 1 persegi hingga membentuk burung.\n3. Geser jarum jam ke angka 07.00 saat bel masuk sekolah berbunyi!",
      "Berapa menit yang dilewati jika jarum panjang jam berputar penuh dari angka 12 kembali ke 12?",
      "2026-10-29 17:30:00"
    ],
    [
      "STEM-MAT-K2-02",
      "Mathematics",
      "Nilai Tempat Bilangan: Ratusan, Puluhan, dan Satuan (Base 10)",
      "2",
      "Simulasi",
      "https://mathigon.org/polypad#fractions",
      "https://images.unsplash.com/photo-1584697964190-705b893683f1?w=600&auto=format&fit=crop&q=80",
      "Ketahui rahasia bilangan 3 angka: 1 lempeng ratusan (100) + 4 batang puluhan (40) + 5 kubus satuan (5) membentuk angka 145!",
      "1. Menentukan nilai tempat suatu angka pada bilangan cacah hingga 999.\n2. Menguraikan bilangan ke dalam bentuk panjang ratusan, puluhan, dan satuan.",
      "1. Buka balok bilangan di Polypad.\n2. Tarik 2 lempeng ratusan, 3 batang puluhan, dan 7 kubus kecil.\n3. Gabungkan dan baca bilangan yang terbentuk: 237!",
      "Berapa nilai angka 5 pada bilangan 582 dibandingkan pada bilangan 258?",
      "2026-10-29 17:35:00"
    ],
    [
      "STEM-MAT-K2-03",
      "Mathematics",
      "Pola Bilangan Loncat di Garis Bilangan PhET",
      "2",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/number-line-distance/latest/number-line-distance_all.html",
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
      "Melompat teratur di garis bilangan: lompat 2 (2, 4, 6, 8, 10) atau lompat 5 (5, 10, 15, 20) sebagai jalan tol menuju perkalian cepat!",
      "1. Menemukan pola barisan bilangan loncat 2, loncat 3, dan loncat 5.\n2. Menentukan bilangan berikutnya yang hilang pada barisan berpola.",
      "1. Buka simulasi Number Line Distance PhET.\n2. Buat titik lompatan setiap selang 5 angka.\n3. Lanjutkan pola: 5, 10, 15, ... tebak angka setelah 20!",
      "Mengapa menghitung uang pecahan koin 500-an sama dengan pola bilangan loncat 5?",
      "2026-10-29 17:40:00"
    ],
    [
      "STEM-MAT-K2-04",
      "Mathematics",
      "Eksplorasi Simetri Lipat & Cermin Bangun Datar di GeoGebra",
      "2",
      "Simulasi",
      "https://www.geogebra.org/geometry",
      "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&auto=format&fit=crop&q=80",
      "Lipat kertas menjadi dua sama persis: temukan garis sumbu simetri pada kupu-kupu, huruf A, dan bangun persegi panjang.",
      "1. Mengidentifikasi sumbu simetri lipat pada bangun datar simetris.\n2. Melukis bayangan cermin bangun datar yang persis sama bentuk dan ukurannya.",
      "1. Buka kanvas GeoGebra Geometri.\n2. Gambar garis cermin vertikal di tengah kanvas.\n3. Buat segitiga di sisi kiri dan gunakan alat 'Reflect about Line' untuk melihat bayangan cerminnya!",
      "Mengapa huruf M memiliki sumbu simetri lipat sedangkan huruf F tidak memiliki simetri?",
      "2026-10-29 17:45:00"
    ],
    [
      "STEM-MAT-K2-05",
      "Mathematics",
      "Membaca Diagram Gambar (Piktogram) Buah Kesukaan",
      "2",
      "Simulasi",
      "https://mathigon.org/polypad#fractions",
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
      "Satu gambar apel mewakili 2 buah apel segar! Belajar membaca data piktogram buah favorit teman-teman sekelasmu.",
      "1. Membaca informasi data yang disajikan dalam bentuk diagram gambar (piktogram).\n2. Menjawab pertanyaan tentang data terbanyak, paling sedikit, dan selisihnya.",
      "1. Amati tabel piktogram: Mangga (3 gambar), Jeruk (5 gambar), Pisang (2 gambar).\n2. Hitung jumlah sebenarnya jika 1 gambar mewakili 2 anak.\n3. Tentukan buah apa yang paling banyak disukai!",
      "Mengapa penyajian data menggunakan gambar buah lebih menarik dan mudah dipahami?",
      "2026-10-29 17:50:00"
    ],
    [
      "STEM-MAT-K2-06",
      "Mathematics",
      "Pengukuran Panjang dengan Penggaris Virtual (cm & m)",
      "2",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html",
      "https://images.unsplash.com/photo-1584697964190-705b893683f1?w=600&auto=format&fit=crop&q=80",
      "Sejajarkan ujung pensil tepat di angka 0 penggaris. Ukur panjang penghapus, buku gambar, dan meja belajarmu dengan satuan sentimeter baku.",
      "1. Menggunakan alat ukur panjang baku (penggaris sentimeter dan meteran pita).\n2. Membaca hasil pengukuran panjang dengan teliti dari titik nol.",
      "1. Ambil penggaris 30 cm di mejamu.\n2. Ukur panjang pensil: pastikan ujung kiri di angka 0 dan baca angka di ujung kanannya.\n3. Catat panjang 3 benda berbeda di kelasmu!",
      "Apa akibatnya jika kita mengukur benda mulai dari angka 1 dan bukan dari angka 0?",
      "2026-10-29 17:55:00"
    ],
    [
      "STEM-MAT-K3-01",
      "Mathematics",
      "Pecahan Visual Warna-Warni: Pizza & Cokelat Pecahan",
      "3",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/fractions-intro/latest/fractions-intro_all.html",
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
      "Belajar pecahan jadi konkret dan mudah dipahami: iris pizza khayalan menjadi pecahan 1/2, 1/3, 1/4, dan 3/4 di simulasi PhET.",
      "1. Memvisualisasikan konsep pecahan sebagai bagian dari benda utuh.\n2. Membandingkan nilai pecahan sederhana berpenyebut sama.",
      "1. Buka simulasi Fractions Intro PhET.\n2. Pilih mode Intro dan atur pembagi pizza menjadi 4 bagian.\n3. Ambil 2 potong pizza dan perhatikan bentuk angka pecahannya: 2/4 sama dengan 1/2!",
      "Jika kamu memiliki cokelat dan ingin berbagi sama rata ke 3 teman, berapa bagian masing-masing?",
      "2026-10-29 18:00:00"
    ],
    [
      "STEM-MAT-K3-02",
      "Mathematics",
      "Perkalian sebagai Penjumlahan Berulang (Matriks Petak)",
      "3",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/area-builder/latest/area-builder_all.html",
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
      "3 piring masing-masing berisi 4 buah donat: 4 + 4 + 4 = 3 x 4 = 12 donat! Susun baris dan kolom petak untuk membuktikannya.",
      "1. Memahami konsep dasar operasi perkalian sebagai penjumlahan berulang.\n2. Membuktikan sifat komutatif perkalian (3 x 4 menghasilkan jumlah sama dengan 4 x 3).",
      "1. Buka PhET Area Builder.\n2. Buat persegi panjang dengan 3 baris ke bawah dan 4 kolom ke samping.\n3. Hitung total petak di dalamnya dan simpulkan rumus 3 x 4 = 12!",
      "Mengapa susunan 3 x 5 petak menghasilkan jumlah total balok yang persis sama dengan susunan 5 x 3?",
      "2026-10-29 18:05:00"
    ],
    [
      "STEM-MAT-K3-03",
      "Mathematics",
      "Menghitung Keliling Lapangan Sekolah dengan Langkah Satuan",
      "3",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/area-builder/latest/area-builder_all.html",
      "https://images.unsplash.com/photo-1584697964190-705b893683f1?w=600&auto=format&fit=crop&q=80",
      "Berjalan mengelilingi tepian lapangan basket: jumlahkan panjang sisi atas, kanan, bawah, dan kiri untuk menemukan keliling totalnya.",
      "1. Menjelaskan konsep keliling bangun datar sebagai jumlah panjang seluruh tepiannya.\n2. Menghitung keliling persegi dan persegi panjang menggunakan petak satuan.",
      "1. Buat bentuk persegi panjang berukuran panjang 5 petak dan lebar 3 petak.\n2. Jumlahkan tepiannya: 5 + 3 + 5 + 3 = 16 petak.\n3. Cocokkan dengan angka perimeter di kotak centang simulasi!",
      "Jika seorang pelari mengitari lapangan persegi bersisi 20 meter sebanyak 2 putaran, berapa meter total larinya?",
      "2026-10-29 18:10:00"
    ],
    [
      "STEM-MAT-K3-04",
      "Mathematics",
      "Mengenal Garis Bilangan Pecahan di PhET Build-a-Fraction",
      "3",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/build-a-fraction/latest/build-a-fraction_all.html",
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
      "Di manakah letak angka 1/2 di antara angka 0 dan 1? Susun pecahan silinder dan letakkan pada titik garis bilangan yang tepat.",
      "1. Menentukan letak pecahan sederhana pada garis bilangan.\n2. Membandingkan besar pecahan berpenyebut sama (misal 3/5 lebih besar dari 2/5).",
      "1. Buka simulasi Build a Fraction PhET.\n2. Pasang 1 potong dari 3 bagian silinder (1/3).\n3. Pasangkan pada target nilai dan kumpulkan bintang prestasimu!",
      "Manakah yang bernilai lebih besar: potongan kue 1/2 atau potongan kue 1/8? Jelaskan alasanmu!",
      "2026-10-29 18:15:00"
    ],
    [
      "STEM-MAT-K3-05",
      "Mathematics",
      "Membaca Jam Analog Lengkap: Menit, Jam, dan Durasi Waktu",
      "3",
      "Simulasi",
      "https://mathigon.org/polypad#clocks",
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
      "Pukul 08 lewat 15 menit, jarum panjang menunjuk ke angka 3. Hitung berapa menit lama waktu belajarmu dari pukul 08.00 sampai 09.30.",
      "1. Membaca waktu dalam satuan jam dan menit pada jam analog.\n2. Menghitung durasi lama waktu suatu peristiwa berlangsung (dalam jam dan menit).",
      "1. Geser jarum jam ke pukul 08.15 di Polypad Clocks.\n2. Geser maju jarum jam hingga pukul 09.45.\n3. Hitung selisih putaran jarum: 1 jam 30 menit atau 90 menit!",
      "Berapa menit yang dihabiskan jika kamu mulai belajar kelompok pukul 14.15 dan selesai pukul 16.00?",
      "2026-10-29 18:20:00"
    ],
    [
      "STEM-MAT-K3-06",
      "Mathematics",
      "Pengolahan Data Tabel & Diagram Batang Nilai Siswa",
      "3",
      "Simulasi",
      "https://www.geogebra.org/classic",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
      "Sajikan data tinggi badan temanmu ke dalam diagram batang tegak yang rapi di GeoGebra. Lihat batang mana yang paling menjulang tinggi!",
      "1. Mengumpulkan dan mencatat data sederhana ke dalam tabel frekuensi.\n2. Menyajikan data tabel ke dalam diagram batang tegak secara akurat.",
      "1. Buka GeoGebra Classic Spreadsheet.\n2. Masukkan nama buah dan jumlah pemilihnya.\n3. Klik tombol Bar Chart untuk menghasilkan diagram batang warna otomatis!",
      "Informasi apa yang paling cepat kita temukan saat melihat diagram batang dibandingkan hanya membaca deretan angka tabel?",
      "2026-10-29 18:25:00"
    ],
    [
      "STEM-MAT-K4-01",
      "Mathematics",
      "Merancang Luas & Keliling Taman Sekolah Interaktif",
      "4",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/area-builder/latest/area-builder_all.html",
      "https://images.unsplash.com/photo-1584697964190-705b893683f1?w=600&auto=format&fit=crop&q=80",
      "Susun petak-petak hijau di PhET Area Builder untuk membuat taman dengan luas dan keliling tertentu.",
      "1. Menghitung luas bangun datar dengan satuan petak persegi.\n2. Memahami perbedaan antara luas (permukaan) dan keliling (panjang tepian).",
      "1. Buka simulasi Area Builder PhET.\n2. Susun 12 petak balok hijau membentuk persegi panjang (panjang 4, lebar 3).\n3. Hitung keliling pagar di sekelilingnya dan periksa hasilnya di kotak centang!",
      "Apakah dua bangun datar yang memiliki luas sama selalu memiliki keliling yang sama juga?",
      "2026-10-29 18:30:00"
    ],
    [
      "STEM-MAT-K4-02",
      "Mathematics",
      "Pecahan Senilai: Mengapa 1/2 Sama dengan 2/4 dan 4/8?",
      "4",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/fractions-equality/latest/fractions-equality_all.html",
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
      "Uji timbangan pecahan di PhET Fractions Equality: letakkan lempeng 1/2 di kiri dan 2 keping 1/4 di kanan. Timbangan seimbang sempurna!",
      "1. Menemukan konsep pecahan senilai dengan mengalikan/membagi pembilang dan penyebut dengan angka yang sama.\n2. Menyederhanakan pecahan ke bentuk paling sederhana.",
      "1. Buka PhET Fractions Equality mode Lab.\n2. Tarik piringan 1/2 ke timbangan neraca.\n3. Tarik piringan 2/4 dan 4/8 lalu buktikan bahwa nilainya setara!",
      "Bagaimana cara cepat menentukan apakah pecahan 3/6 senilai dengan pecahan 5/10?",
      "2026-10-29 18:35:00"
    ],
    [
      "STEM-MAT-K4-03",
      "Mathematics",
      "Mengukur dan Melukis Sudut dengan Busur Derajat di GeoGebra",
      "4",
      "Simulasi",
      "https://www.geogebra.org/geometry",
      "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&auto=format&fit=crop&q=80",
      "Mengenal sudut lancip (< 90 derajat), sudut siku-siku (tepat 90 derajat), dan sudut tumpul (> 90 derajat) menggunakan busur derajat digital.",
      "1. Mengukur besar sudut suatu bidang geometri menggunakan busur derajat.\n2. Mengelompokkan jenis-jenis sudut berdasarkan besaran derajatnya.",
      "1. Buka GeoGebra Geometry.\n2. Buat tiga titik membentuk sudut ABC.\n3. Pilih alat 'Angle' dan klik ketiga titik untuk melihat nilai besar sudutnya!",
      "Berapa besar sudut yang dibentuk oleh kedua jarum jam saat jam menunjukkan tepat pukul 03.00?",
      "2026-10-29 18:40:00"
    ],
    [
      "STEM-MAT-K4-04",
      "Mathematics",
      "Kelipatan Persekutuan Terkecil (KPK) & FPB Pohon Faktor",
      "4",
      "Simulasi",
      "https://mathigon.org/polypad#fractions",
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
      "Kapan lampu merah (berkedip tiap 4 detik) dan lampu hijau (berkedip tiap 6 detik) akan menyala bersamaan? Temukan jawabannya lewat KPK!",
      "1. Menentukan faktor prima suatu bilangan menggunakan pohon faktor.\n2. Menyelesaikan masalah kehidupan nyata yang berkaitan dengan KPK dan FPB.",
      "1. Faktorkan angka 12 (2 x 2 x 3) dan 18 (2 x 3 x 3).\n2. Cari FPB dengan mengalikan faktor prima yang sama berpangkat terkecil (2 x 3 = 6).\n3. Hitung KPK untuk menentukan waktu lampu menyala bersama (2 x 2 x 3 x 3 = 36)!",
      "Kapan kita menggunakan konsep FPB saat ingin membagikan bingkisan kue dan permen ke dalam kotak sama rata?",
      "2026-10-29 18:45:00"
    ],
    [
      "STEM-MAT-K4-05",
      "Mathematics",
      "Operasi Penjumlahan & Pengurangan Pecahan Berpenyebut Sama",
      "4",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/fractions-intro/latest/fractions-intro_all.html",
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
      "Jika kamu makan 2/8 loyang pizza dan adikmu makan 3/8 loyang pizza, berapa bagian pizza yang telah kalian habiskan bersama?",
      "1. Melakukan operasi penjumlahan pecahan biasa berpenyebut sama.\n2. Melakukan operasi pengurangan pecahan biasa berpenyebut sama dalam konteks cerita.",
      "1. Buka simulasi Fractions Intro PhET.\n2. Ambil 2 juring 1/8 lalu tambahkan 3 juring 1/8.\n3. Hitung jumlah total juring: 2/8 + 3/8 = 5/8 loyang!",
      "Mengapa pada penjumlahan pecahan berpenyebut sama, hanya angka pembilang di atas yang dijumlahkan?",
      "2026-10-29 18:50:00"
    ],
    [
      "STEM-MAT-K4-06",
      "Mathematics",
      "Hubungan Antar Garis: Sejajar, Berpotongan, dan Tegak Lurus",
      "4",
      "Simulasi",
      "https://www.geogebra.org/geometry",
      "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&auto=format&fit=crop&q=80",
      "Amati rel kereta api: dua garis lurus yang sejajar tidak akan pernah bertemu walau ditarik sepanjang apa pun ke ujung dunia.",
      "1. Mengidentifikasi garis sejajar, garis berpotongan, dan garis tegak lurus (perpendicular).\n2. Membuktikan bahwa dua garis tegak lurus selalu membentuk sudut siku-siku 90 derajat.",
      "1. Buka kanvas GeoGebra Geometri.\n2. Tarik satu garis lurus dan gunakan alat 'Parallel Line' untuk membuat garis sejajar.\n3. Buat garis 'Perpendicular Line' dan ukur sudut potongnya!",
      "Apa bahaya yang terjadi jika rel kereta api tidak dipasang secara sejajar sempurna?",
      "2026-10-29 18:55:00"
    ],
    [
      "STEM-MAT-K5-01",
      "Mathematics",
      "Tantangan Logika Bilangan & Pecahan Desimal di PhET",
      "5",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/fraction-matcher/latest/fraction-matcher_all.html",
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80",
      "Petualangan matematika interaktif: cocokkan kartu pecahan biasa 3/4 dengan nilai desimal 0,75 dan persentase 75% di PhET Fraction Matcher.",
      "1. Mengubah bentuk pecahan biasa menjadi desimal dan persen.\n2. Melatih nalar berhitung cepat dalam pemecahan masalah sehari-hari.",
      "1. Buka simulasi Fraction Matcher PhET (bebas akses tanpa login).\n2. Pilih Level 1.\n3. Cocokkan kartu bentuk visual pecahan dengan kartu desimal yang senilai!",
      "Mengapa pecahan 3/4 memiliki nilai yang sama persis dengan angka desimal 0,75 dan 75%?",
      "2026-10-29 19:00:00"
    ],
    [
      "STEM-MAT-K5-02",
      "Mathematics",
      "Operasi Hitung Perkalian dan Pembagian Pecahan Biasa",
      "5",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/area-model-decimals/latest/area-model-decimals_all.html",
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
      "Berapa 1/2 dari 1/4 kue tart? Lipat kertas secara horizontal dan vertikal: daerah tumpang tindihnya adalah 1/8 bagian!",
      "1. Memahami konsep perkalian pecahan sebagai perkalian pembilang dengan pembilang dan penyebut dengan penyebut.\n2. Menyelesaikan soal pembagian pecahan dengan membalik penyebut pecahan kedua.",
      "1. Buka Area Model Decimals PhET.\n2. Atur panjang petak 0.5 (1/2) dan lebar petak 0.5 (1/2).\n3. Lihat daerah arsiran ganda bernilai 0.25 (1/4)!",
      "Mengapa hasil perkalian dua pecahan yang lebih kecil dari 1 justru menghasilkan angka yang semakin kecil?",
      "2026-10-29 19:05:00"
    ],
    [
      "STEM-MAT-K5-03",
      "Mathematics",
      "Menghitung Volume Kubus dan Balok dengan Kubus Satuan",
      "5",
      "Simulasi",
      "https://mathigon.org/polypad#solids",
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
      "Isi sebuah kotak kardus dengan kubus dadu kecil berukuran 1 cm3: susun panjang x lebar x tinggi untuk menemukan volume kubik ruangnya.",
      "1. Menemukan rumus volume balok (V = p x l x t) melalui pembuktian kubus satuan.\n2. Mengonversi satuan volume dari cm3 ke liter (1 liter = 1.000 cm3).",
      "1. Buka kanvas Polypad 3D Solids.\n2. Susun balok dengan panjang 4 kubus, lebar 3 kubus, dan tinggi 2 kubus.\n3. Hitung jumlah seluruh kubus: 4 x 3 x 2 = 24 kubus satuan!",
      "Jika bak mandi berbentuk kubus memiliki panjang rusuk 1 meter (100 cm), berapa liter air yang dibutuhkan untuk mengisinya penuh?",
      "2026-10-29 19:10:00"
    ],
    [
      "STEM-MAT-K5-04",
      "Mathematics",
      "Skala & Denah Lokasi pada Bidang Koordinat Kartesius (X, Y)",
      "5",
      "Simulasi",
      "https://www.geogebra.org/classic",
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=80",
      "Tentukan posisi harta karun di peta! Melangkah di sumbu X mendatar lalu sumbu Y tegak untuk membaca titik koordinat (X, Y) secara presisi.",
      "1. Membaca dan menentukan letak titik pada bidang koordinat Kartesius kuadran 1.\n2. Menghitung jarak sebenarnya berdasarkan skala denah peta (misal 1 : 100.000).",
      "1. Buka GeoGebra Classic bidang koordinat.\n2. Taruh titik Rumah di (2, 3) dan Sekolah di (6, 7).\n3. Hitung jarak langkah mendatar dan tegak yang harus ditempuh!",
      "Mengapa dalam menuliskan titik koordinat, nilai sumbu X mendatar harus selalu ditulis lebih dulu sebelum sumbu Y?",
      "2026-10-29 19:15:00"
    ],
    [
      "STEM-MAT-K5-05",
      "Mathematics",
      "Kecepatan, Jarak, dan Waktu Perjalanan Kendaraan",
      "5",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html",
      "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80",
      "Sebuah mobil melaju kencang dengan kecepatan 60 km/jam. Berapa jam waktu yang dibutuhkan untuk menempuh perjalanan antarkota sejauh 180 km?",
      "1. Memahami segitiga rumus Jarak (J), Kecepatan (K), dan Waktu (W).\n2. Menyelesaikan soal cerita perbandingan jarak dan waktu tempuh perjalanan.",
      "1. Tentukan rumus Waktu = Jarak / Kecepatan.\n2. Masukkan angka: 180 km / 60 km/jam = 3 jam perjalanan.\n3. Hitung jam tiba jika mobil berangkat pukul 07.00 pagi!",
      "Jika kecepatan mobil bertambah menjadi 90 km/jam, apakah waktu tempuhnya menjadi lebih cepat atau lebih lama?",
      "2026-10-29 19:20:00"
    ],
    [
      "STEM-MAT-K5-06",
      "Mathematics",
      "Menyajikan & Menganalisis Diagram Garis Tren Cuaca",
      "5",
      "Simulasi",
      "https://www.geogebra.org/classic",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
      "Catat suhu udara dari pagi, siang, hingga malam hari. Hubungkan titik-titik koordinatnya dengan garis untuk melihat tren naik-turun suhu kota.",
      "1. Menyajikan data berkala (time-series) ke dalam bentuk diagram garis.\n2. Menafsirkan tren kenaikan atau penurunan data dari kurva diagram.",
      "1. Masukkan data jam (pukul 06, 09, 12, 15, 18) dan temperatur derajat Celsius.\n2. Plot titik pada grafik GeoGebra dan sambungkan garisnya.\n3. Temukan di jam berapa suhu terpanas terjadi!",
      "Kapan kita lebih tepat menggunakan diagram garis dibandingkan diagram batang?",
      "2026-10-29 19:25:00"
    ],
    [
      "STEM-MAT-K6-01",
      "Mathematics",
      "Eksplorasi Bangun Ruang 3D & Jaring-Jaring Kubus Virtual",
      "6",
      "Simulasi",
      "https://mathigon.org/polypad#solids",
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
      "Buka dan tutup jaring-jaring kubus, balok, prisma, dan limas secara 3D di Mathigon Polypad. Hitung rusuk, titik sudut, dan volumenya!",
      "1. Menganalisis sifat-sifat bangun ruang (kubus, balok, prisma, tabung).\n2. Membuka jaring-jaring bangun ruang 3D menjadi pola 2D secara interaktif.",
      "1. Buka menu 3D Solids di Mathigon Polypad.\n2. Tarik sebuah Kubus 3D ke papan kerja.\n3. Klik tombol Unfold dan saksikan kubus merekah terbuka menjadi jaring-jaring 6 persegi!",
      "Ada berapa banyak variasi bentuk jaring-jaring yang berbeda untuk membuat kubus sempurna?",
      "2026-10-29 19:30:00"
    ],
    [
      "STEM-MAT-K6-02",
      "Mathematics",
      "Menghitung Luas Permukaan dan Volume Tabung serta Kerucut",
      "6",
      "Simulasi",
      "https://www.geogebra.org/geometry",
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
      "Buka selimut tabung kaleng biskuit: ternyata selimut tabung adalah sebuah persegi panjang yang panjangnya sama dengan keliling lingkaran alas!",
      "1. Membedah luas permukaan tabung (2 x luas lingkaran + luas selimut).\n2. Menghitung volume tabung (V = pi x r^2 x t) dan membuktikan volume kerucut adalah 1/3 volume tabung.",
      "1. Buat silinder 3D di GeoGebra.\n2. Masukkan jari-jari r = 7 cm dan tinggi t = 10 cm.\n3. Hitung luas alas: (22/7) x 7 x 7 = 154 cm2, lalu kalikan tinggi untuk mendapatkan volume 1.540 cm3!",
      "Mengapa sebuah corong kerucut yang memiliki jari-jari dan tinggi sama hanya mampu menampung 1/3 air dari gelas tabung?",
      "2026-10-29 19:35:00"
    ],
    [
      "STEM-MAT-K6-03",
      "Mathematics",
      "Bilangan Bulat Negatif pada Garis Termometer Suhu Es",
      "6",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/number-line-integers/latest/number-line-integers_all.html",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
      "Ketahui suhu di bawah nol derajat (-5°C) di kutub utara! Geser termometer di simulasi PhET Number Line Integers untuk memahami konsep bilangan negatif.",
      "1. Memahami konsep bilangan bulat positif, nol, dan bilangan bulat negatif.\n2. Melakukan operasi penjumlahan dan pengurangan yang melibatkan bilangan negatif.",
      "1. Buka simulasi Number Line Integers PhET.\n2. Tarik titik dari 0 ke kiri hingga -7.\n3. Tambahkan 10 langkah ke kanan dan lihat titik berhenti di angka +3 (-7 + 10 = 3)!",
      "Manakah yang suhunya lebih dingin membeku: -10°C atau -2°C? Jelaskan posisinya pada garis bilangan!",
      "2026-10-29 19:40:00"
    ],
    [
      "STEM-MAT-K6-04",
      "Mathematics",
      "Eksplorasi Lingkaran: Keliling, Luas, dan Nilai Ajaib Pi (3,14)",
      "6",
      "Simulasi",
      "https://www.geogebra.org/geometry",
      "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&auto=format&fit=crop&q=80",
      "Ukur keliling tutup toples dengan benang lalu bagi dengan panjang garis tengah diameternya. Hasilnya selalu menghasilkan angka konstan 3,14 (Pi)!",
      "1. Menemukan nilai perbandingan Pi (keliling dibagi diameter).\n2. Menghitung luas lingkaran menggunakan rumus L = pi x r x r.",
      "1. Gambar lingkaran dengan jari-jari r = 14 cm di GeoGebra.\n2. Hitung keliling: K = 2 x (22/7) x 14 = 88 cm.\n3. Hitung luas: L = (22/7) x 14 x 14 = 616 cm2 dan verifikasi dengan alat ukur otomatis!",
      "Mengapa nilai Pi selalu sama untuk lingkaran sekecil koin hingga lingkaran sebesar bumi?",
      "2026-10-29 19:45:00"
    ],
    [
      "STEM-MAT-K6-05",
      "Mathematics",
      "Statistika: Rata-Rata (Mean), Nilai Tengah (Median), dan Modus",
      "6",
      "Simulasi",
      "https://www.geogebra.org/classic",
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80",
      "Hitung nilai rata-rata ujian matematika kelasmu: jumlahkan seluruh nilai lalu bagi dengan total banyak siswa. Temukan nilai yang paling sering muncul (modus).",
      "1. Menghitung nilai mean (rata-rata), median (nilai tengah), dan modus dari kumpulan data tunggal.\n2. Menganalisis penyebaran data hasil belajar siswa.",
      "1. Masukkan deretan nilai: 70, 80, 80, 90, 100 ke GeoGebra Spreadsheet.\n2. Hitung jumlah (420) dibagi 5 = rata-rata 84.\n3. Tentukan modusnya yaitu nilai 80 karena muncul paling banyak (2 kali)!",
      "Mengapa jika ada satu nilai yang sangat rendah (misal nilai 10), nilai rata-rata kelas bisa langsung merosot turun?",
      "2026-10-29 19:50:00"
    ],
    [
      "STEM-MAT-K6-06",
      "Mathematics",
      "Peluang & Teori Probabilitas Percobaan Dadu di PhET",
      "6",
      "Simulasi",
      "https://phet.colorado.edu/sims/html/plinko-probability/latest/plinko-probability_all.html",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
      "Jatuhkan 100 kelereng melalui pasak paku Plinko di PhET. Amati bagaimana pola kurva lonceng normal terbentuk secara ajaib dari kejadian acak!",
      "1. Memahami konsep peluang kejadian acak (probability).\n2. Memprediksi frekuensi harapan munculnya mata dadu atau koin dalam banyak percobaan.",
      "1. Buka simulasi Plinko Probability PhET.\n2. Jatuhkan bola satu per satu dan amati peluang memantul ke kiri atau ke kanan (50% : 50%).\n3. Jatuhkan 500 bola sekaligus dan saksikan tumpukan membentuk lonceng simetris sempurna di tengah!",
      "Mengapa bola lebih banyak berkumpul di kotak bagian tengah daripada di kotak ujung paling luar?",
      "2026-10-29 19:55:00"
    ]
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
