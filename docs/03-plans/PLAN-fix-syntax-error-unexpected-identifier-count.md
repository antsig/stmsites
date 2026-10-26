# Implementation Plan: Perbaikan SyntaxError Unexpected identifier 'count' pada Google Apps Script (v1.5.7)

## 1. Konteks & Latar Belakang Masalah
Pengguna mengalami kendala saat menjalankan portal di lingkungan Google Apps Script Web App:
```
© -. Hak Cipta Dilindungi.
⚠️ Terjadi Kendala Skrip: Uncaught SyntaxError: Unexpected identifier 'count'
Baris 511 (https://n-fziwz66ailuwepiyzjb25ur37capxyfueoskhxa-0lu-script.googleusercontent.com/userCodeAppPanel?createOAuthDialog=true)
```
Teks hak cipta `© -. Hak Cipta Dilindungi.` menunjukkan bahwa HTML utama berhasil dimuat hingga footer, namun parsing script JavaScript frontend gagal dijalankan karena adanya kendala sintaksis pada/sekitar baris 511 di fungsi `renderCategoryLogosAndCounts()`.

### Akar Masalah (Root Cause):
1. **Sintaks ES6 Template Literal & Selector ID di `renderCategoryLogosAndCounts()`**:
   Pada baris ~511-514 skrip frontend:
   ```javascript
   for (const cat in counts) {
     const countEl = document.getElementById(`count-${cat}`);
     if (countEl) countEl.textContent = `${counts[cat]} Materi`;
   ```
   Ekspresi template literals `` `count-${cat}` `` dan interpolasi string di dalam Google Apps Script (terutama saat template parser atau variasi browser/webview memproses skrip) memicu parsing error `Unexpected identifier 'count'`.
2. **Penggunaan `createTemplateFromFile('index').evaluate()` pada Backend GAS**:
   Di `Code.gs`, `doGet()` memanggil `HtmlService.createTemplateFromFile('index').evaluate()`. Karena `index.html` kini sudah berstatus **Standalone 1-File Bundle** murni (tanpa dependensi scriptlet `<?!= include() ?>`), evaluasi template server-side justru membuka risiko interferensi parsing karakter template. Menggunakan `HtmlService.createHtmlOutputFromFile('index')` jauh lebih cepat, stabil, dan bebas dari interferensi server-side scriptlet parser.
3. **Penyelarasan Standar ES5 String Concatenation**:
   Seluruh interpolasi string kategori (`count-Science`, `count-Technology`, dsb.) dan badge counter harus diubah menjadi standard string concatenation (`'count-' + cat`, `counts[cat] + ' Materi'`) agar 100% kompatibel di semua browser, webview seluler, dan iframe Google Apps Script.

---

## 2. Analisis Kebutuhan & Ruang Lingkup (Scope)
- **In-Scope**:
  1. Refactoring fungsi `renderCategoryLogosAndCounts()` di [index.html](file:///f:/repository/stemsites/index.html) menggunakan standar ES5 string concatenation murni, perulangan `for` array yang aman, dan penanganan defensive `(counts[cat] || 0) + ' Materi'`.
  2. Audit dan refactor 38 baris interpolasi template literal (backticks) di [index.html](file:///f:/repository/stemsites/index.html) yang berpotensi memicu kendala serupa di browser lama atau lingkungan Apps Script iframe.
  3. Memperbarui `doGet()` di [Code.gs](file:///f:/repository/stemsites/Code.gs) agar memprioritaskan `HtmlService.createHtmlOutputFromFile('index')` secara langsung dengan fallback cerdas.
  4. Memperbarui panduan penyalinan di [docs/04-deployment/PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md](file:///f:/repository/stemsites/docs/04-deployment/PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md) dan tab Panduan Deploy di Panel Admin.
  5. Verifikasi sintaks JS menggunakan Node.js VM `new Function()` dan simulasi pengujian browser lokal.
- **Out-of-Scope**:
  - Mengubah skema Google Sheets atau data materi kurikulum STEM SD.
  - Mengubah struktur layout visual atau palet warna tema yang sudah matang.

---

## 3. Rencana Perubahan Berkas (File Inventory)
- [ ] [index.html](file:///f:/repository/stemsites/index.html):
  - Refactor `renderCategoryLogosAndCounts()` untuk mengeliminasi template literal `` `count-${cat}` `` dan menggantinya dengan `'count-' + cat`.
  - Refactor template strings di fungsi-fungsi pendukung lainnya agar tahan terhadap semua engine parser.
  - Perbarui string bantuan di modal deploy.
- [ ] [Code.gs](file:///f:/repository/stemsites/Code.gs):
  - Perbarui fungsi `doGet(e)` agar menggunakan `HtmlService.createHtmlOutputFromFile('index')`.
- [ ] [docs/04-deployment/PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md](file:///f:/repository/stemsites/docs/04-deployment/PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md):
  - Catatan troubleshooting untuk error `Unexpected identifier 'count'` jika masih menyisakan file modular lama.
- [ ] [docs/WALKTHROUGH-fix-syntax-error-unexpected-identifier-count.md](file:///f:/repository/stemsites/docs/WALKTHROUGH-fix-syntax-error-unexpected-identifier-count.md):
  - Dokumentasi bukti pengujian bebas error dan panduan bagi pengguna.
- [ ] [CHANGELOG.md](file:///f:/repository/stemsites/CHANGELOG.md):
  - Catat rilis versi `v1.5.7`.

---

## 4. Rencana Database / Skema
Tidak ada perubahan skema database spreadsheet.

---

## 5. Rencana Mitigasi Risiko & Rollback
- **Mitigasi**:
  - Gunakan `try { createHtmlOutputFromFile } catch { createTemplateFromFile }` di `Code.gs` untuk menjaga backward compatibility penuh.
  - Uji validitas sintaks JS dengan `node -e` sebelum deploy.
- **Rollback**:
  - Git commit sebelumnya (`v1.5.6` - commit `4003627`) dapat di-checkout seketika jika diperlukan.
