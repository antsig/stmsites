/**
 * ==============================================================================
 * STEM PORTAL BUNDLER - STANDALONE 1-FILE COMPILER
 * ==============================================================================
 * Menggabungkan index.html, styles.html, admin.html, dan scripts.html
 * menjadi satu berkas mandiri (dist/index.html) yang siap dipasang di
 * Google Apps Script tanpa ketergantungan include() parsial.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const DIST_DIR = path.join(ROOT_DIR, 'dist');

if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

console.log('🔄 Memulai proses kompilasi Standalone 1-File Bundle...');

const indexPath = path.join(ROOT_DIR, 'index.html');
const stylesPath = path.join(ROOT_DIR, 'styles.html');
const adminPath = path.join(ROOT_DIR, 'admin.html');
const scriptsPath = path.join(ROOT_DIR, 'scripts.html');

let indexContent = fs.readFileSync(indexPath, 'utf8');
const stylesContent = fs.readFileSync(stylesPath, 'utf8');
const adminContent = fs.readFileSync(adminPath, 'utf8');
const scriptsContent = fs.readFileSync(scriptsPath, 'utf8');

// Gantikan include('styles')
indexContent = indexContent.replace(/<\?!=\s*include\('styles'\);\s*\?>/g, stylesContent);

// Gantikan include('admin')
indexContent = indexContent.replace(/<\?!=\s*include\('admin'\);\s*\?>/g, adminContent);

// Gantikan include('scripts')
indexContent = indexContent.replace(/<\?!=\s*include\('scripts'\);\s*\?>/g, scriptsContent);

const distPath = path.join(DIST_DIR, 'index.html');
fs.writeFileSync(distPath, indexContent, 'utf8');

console.log(`✅ Standalone 1-File Bundle berhasil dibuat!`);
console.log(`📁 Lokasi: dist/index.html`);
console.log(`📊 Ukuran: ${indexContent.length.toLocaleString()} karakter (${(indexContent.length / 1024).toFixed(1)} KB)`);
