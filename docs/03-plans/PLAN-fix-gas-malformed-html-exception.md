# Implementation Plan: Perbaikan Exception Konten HTML Rusak pada Google Apps Script (v1.5.3)

Dokumen rencana kerja ini merespons temuan error saat proses deploy/eksekusi di Google Apps Script (GAS):
`Exception: Konten HTML rusak: </body> </html>`; } return ''; } function copyCurrentDeployCode() ... </body> </html>. (baris 3485)`

---

## 1. Analisis Akar Masalah (Root Cause Investigation)

### Temuan Investigasi (As-Is)
1. **Penyebab Utama Crash di Google Apps Script**:
   - Di dalam fungsi `getLocalDomContent(filename)` pada berkas `index.html` (baris 3408-3416), `admin.html` (baris 2921-2929), dan `scripts.html` (baris 1481-1489), terdapat template string literal JavaScript yang berisi:
     ```javascript
     if (filename === 'index.html') {
       return `<!DOCTYPE html>
     ...
       <?!= include('styles'); ?>
     ...
       <?!= include('admin'); ?>
       <?!= include('scripts'); ?>
     </body>
     </html>`;
     }
     ```
2. **Dampak pada Parser Google Apps Script (`HtmlService`)**:
   - **Parser HTML GAS**: Ketika `HtmlService.createTemplateFromFile('index').evaluate()` atau `HtmlService.createHtmlOutputFromFile('index')` dijalankan, parser mendeteksi karakter teks mentah `</body>` dan `</html>` di dalam script JavaScript tersebut sebagai penutup dokumen HTML resmi.
   - Semua baris kode setelah `</html>` tersebut (fungsi `copyCurrentDeployCode()`, `showToast()`, dsb. hingga tag penutup `</body></html>` asli di akhir berkas) dianggap oleh GAS sebagai konten liar yang berada di luar tag `</html>`.
   - Hal ini memicu error fatal: `Exception: Konten HTML rusak: </body> </html>`; } return ''; } ... (baris 3485)`.
   - **Parser Template GAS**: Tag `<?!= include('...'); ?>` mentah di dalam template string tersebut berisiko dievaluasi kembali oleh mesin scriptlet GAS, menyebabkan rekursi atau parsing error saat file di-include.

---

## 2. Rencana Solusi Teknis (To-Be)

1. **Pemutusan Tag HTML & GAS Scriptlet (*Safe String Concatenation*)**:
   - Ubah string template mentah di dalam `getLocalDomContent(filename)` pada ketiga berkas (`index.html`, `admin.html`, dan `scripts.html`) dari template literal multiline mentah menjadi string concatenation yang memecah karakter sensitif:
     ```javascript
     if (filename === 'index.html') {
       return '<!DOCTYPE html>\n' +
         '<html lang="id">\n' +
         '<head>\n' +
         '  <meta charset="UTF-8">\n' +
         '  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\n' +
         '  <title>Portal Pembelajaran STEM Sekolah</title>\n' +
         '  <link rel="preconnect" href="https://fonts.googleapis.com">\n' +
         '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
         '  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">\n' +
         '  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">\n' +
         '  <' + '?!= include(\'styles\'); ?' + '>\n' +
         '<' + '/head>\n' +
         '<body>\n' +
         '  <div id="adminModuleContainer">\n' +
         '    <' + '?!= include(\'admin\'); ?' + '>\n' +
         '  </div>\n' +
         '  <' + '?!= include(\'scripts\'); ?' + '>\n' +
         '<' + '/body>\n' +
         '<' + '/html>';
     }
     ```
   - Dengan pemisahan `<' + '/body>` dan `<' + '/html>`, parser HTML Google Apps Script tidak akan lagi mengira dokumen telah ditutup di tengah-tengah file.
   - Dengan pemisahan `<' + '?!=`, parser scriptlet template Google Apps Script tidak akan mengeksekusi tag include palsu di dalam JavaScript.

2. **Sinkronisasi Dokumentasi Deploy**:
   - Perbarui berkas `docs/04-deployment/PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md` pada bagian kode salin-tempel untuk `index.html`, `admin.html`, dan `scripts.html` agar pengguna yang menyalin dari panduan tidak mengalami error yang sama.

---

## 3. Inventaris Berkas (File Inventory)

| No | Berkas | Aksi | Deskripsi |
|:---:|---|:---:|---|
| 1 | `index.html` | Edit | Refactor `getLocalDomContent` agar tidak memuat literal `</body>`, `</html>`, dan `<?!=`. |
| 2 | `admin.html` | Edit | Refactor `getLocalDomContent` dengan pemecahan string yang sama. |
| 3 | `scripts.html` | Edit | Refactor `getLocalDomContent` dengan pemecahan string yang sama. |
| 4 | `docs/04-deployment/PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md` | Edit | Sinkronisasi blok kode deployment panduan bebas error konten rusak. |
| 5 | `CHANGELOG.md` | Edit | Catat rilis patch `v1.5.3`. |
| 6 | `docs/WALKTHROUGH-fix-gas-malformed-html-exception.md` | Create | Dokumentasi pengujian dan bukti verifikasi teknis. |

---

## 4. Mitigasi Risiko & Rollback

- **Dampak Fungsional**: Nol risiko regresi pada UI maupun logika aplikasi STEM. Fungsi `getLocalDomContent` tetap menghasilkan teks HTML yang persis sama ke clipboard / viewer ketika tombol salin kode digunakan di lingkungan browser non-GAS.
- **Rollback**: Jika diperlukan, perubahan dapat dibatalkan instan melalui Git reset commit.
