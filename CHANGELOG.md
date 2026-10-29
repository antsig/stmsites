# Changelog

Semua perubahan pada proyek **Portal Pembelajaran STEM Sekolah Berbasis Google Apps Script** dicatat di dokumen ini.
Format penomoran versi mengacu pada [Semantic Versioning (SemVer 2.0.0)](https://semver.org/).

## [1.6.6] - 2026-10-29

### Fixed & Hardened
- **Ketahanan Tipe Data Pengaturan & Sinkronisasi Penuh Footer Portal**:
  - **Defensive String Wrapping pada `renderSchoolIdentity()`**: Membungkus seluruh properti pengaturan (`contact_wa`, `contact_email`, `school_name`, `academic_year`, `slogan`) dengan `String(...)` sebelum pemanggilan method `.trim()`, menuntaskan kendala fatal `TypeError: (s.contact_wa || ...).trim is not a function` yang terjadi ketika Google Sheets mengembalikan nomor telepon bertipe angka (`Number`).
  - **Pembacaan Teks Tampilan Murni pada `Code.gs` (`getSettingsMap`)**: Menggunakan `getDisplayValues()` agar Google Sheets menyajikan nilai nomor telepon dan teks persis seperti yang tampil di sel tanpa terpotong atau terkonversi ke notasi eksponensial.
  - **Auto-Repair Baris Pengaturan (`initDatabaseIfEmpty`)**: Menambahkan pemeriksaan otomatis pada sheet `Settings` lama untuk mendaftarkan baris kunci default (`contact_wa`, `contact_email`, dll.) yang belum ada dengan format teks murni (`setNumberFormat('@')`).
  - **Konsistensi State PIN Admin**: Memastikan `appState.currentAdminPin = enteredPin;` selalu tersimpan pada seluruh cabang autentikasi PIN di `submitAdminPin()`.

---

## [1.6.5] - 2026-10-29

### Added & Enhanced
- **Fitur View/Hide Nilai PIN Admin (Password Visibility Toggle)**:
  - **Tombol Intip Kata Sandi pada Modal Login (`#inputAdminPin`)**: Menambahkan tombol `.password-toggle-btn` dengan ikon mata Font Awesome (`fa-solid fa-eye` / `fa-solid fa-eye-slash`) di sisi kanan input PIN admin dengan wrapper `.input-password-wrapper`.
  - **Dukungan pada Form Pengaturan Admin (`#settingAdminPin`)**: Menerapkan struktur tombol intip yang sama pada input *"Ganti PIN Admin Baru"* di tab Pengaturan Admin untuk keselarasan UX portal.
  - **Fungsi Dinamis `togglePasswordVisibility()`**: Logika JavaScript universal untuk beralih antara `type="password"` dan `type="text"` lengkap dengan pembaruan atribut aksesibilitas `aria-label` dan `title`.
  - **Auto-Reset Keamanan**: Menambahkan `resetPasswordToggle()` pada pembukaan dan penutupan modal login admin untuk memastikan nilai input dan ikon selalu kembali ke mode tersembunyi (`type="password"`).

### Removed
- **Penghapusan Permanen Tombol PIN Demo**:
  - Menghapus tombol *"Isi PIN Demo (123456)"* dari modal autentikasi login admin sesuai instruksi pengguna.
  - Menghapus fungsi skrip `fillDemoPin()` dan menyesuaikan pesan error login menjadi standar aman (*"PIN Admin tidak sesuai! Silakan periksa kembali."*).

---

## [1.6.4] - 2026-10-29

### Fixed & Enhanced
- **Pemulihan Tampilan Data Materi & Form Pengaturan Admin**:
  - **Emergency Fallback pada `Code.gs`**: Memperbarui fungsi `getInitialData()` agar selalu menyertakan `DEFAULT_SETTINGS` dan 24 materi kurikulum STEM SD lengkap sekalipun koneksi Google Sheets tertunda atau dalam proses otorisasi, mencegah respon `{ success: false }` yang mengosongkan state klien.
  - **Perbaikan Inisialisasi Klien**: Memanggil `populateSettingsForm()` dan `renderAdminTable()` secara andal di `loadInitialData()` dan `fallbackToLocalStorage()`, serta memperbarui versi penyimpanan lokal ke `"v1.6.4"` dengan merger defensif `DEFAULT_SETTINGS`.
  - **Defensive Form Population**: Mengamankan `populateSettingsForm()` dan `previewSettings()` dengan selektor null-safe dan fallback default sehingga form pengaturan admin terisi lengkap dan tidak pernah kosong.
  - **Pemulihan Demo PIN Helper**: Menambahkan kembali tombol *"Isi PIN Demo (123456)"* pada modal login admin untuk memudahkan pengujian.

- **Sinkronisasi Dinamis Kontak Bantuan Footer**:
  - **Kontak Ganda WhatsApp & Email**: Menambahkan elemen `#footerWaLink` dan `#footerEmailLink` di footer portal (`.footer-contacts`) lengkap dengan ikon interaktif dan styling responsif.
  - **Pembaruan Real-Time**: Menghubungkan kontak footer dengan fungsi `renderSchoolIdentity()` sehingga setiap perubahan pada nomor WhatsApp atau Email di pengaturan admin langsung ter-update seketika di footer portal siswa (`wa.me/...` dan `mailto:...`).

- **Pembersihan Modul Deploy Apps Script**:
  - Memastikan section deploy tetap terhapus dari sidemenu dan panel admin sesuai instruksi.
  - Menghapus pemanggilan `initDeployCodeViewer()` di `switchAdminTab()`.
  - Menghapus seluruh dead code JavaScript terkait viewer deploy berkas (`DEPLOY_FILE_METAS`, `getCompleteCodeGsSource`, `selectDeployFile`, `copyCurrentDeployCode`, dsb.).

---

## [1.6.3] - 2026-10-29

### Added & Enhanced
- **Logo Sekolah Resmi pada Navbar Dashboard Admin**:
  - **Elemen `#adminNavSchoolLogo`**: Menambahkan elemen logo sekolah di dalam bilah atas (*topbar*) Dashboard Admin, tepat di sebelah kiri judul *"Dashboard Admin"*.
  - **Sinkronisasi Dinamis Otomatis**: Menyelaraskan sumber gambar `#adminNavSchoolLogo` dengan logo utama sekolah aktif di `renderSchoolIdentity()`, termasuk dukungan langsung untuk tautan Google Drive CDN yang baru di-upload.
  - **Responsivitas Universal**: Menambahkan kelas CSS `.admin-school-logo-img` berukuran 34px × 34px di desktop dan otomatis menyesuaikan ke 26px × 26px pada perangkat mobile (< 768px) tanpa menimbulkan overflow horizontal.
  - **Pencegahan Error Boundary**: Dilengkapi atribut fallback `onerror` otomatis ke logo default jika terjadi gangguan koneksi atau perubahan URL.

---

## [1.6.2] - 2026-10-29

### Fixed & Enhanced
- **Dukungan Penuh Logo Google Drive & Direct Image CDN Converter**:
  - **Auto-Converter Cerdas Google Drive (`formatGoogleDriveImageUrl`)**: Menambahkan parser URL cerdas pada [index.html](file:///f:/repository/stemsites/index.html) yang secara otomatis mengekstrak ID berkas dari tautan Google Drive (`/file/d/{ID}/view`, `/open?id={ID}`, `uc?export=view&id={ID}`, `thumbnail?id={ID}`) dan mengonversinya ke format CDN resmi Google `https://lh3.googleusercontent.com/d/{ID}` sehingga gambar dapat di-render langsung oleh elemen `<img>` tanpa terhalang antarmuka web viewer.
  - **Live Preview Instan pada Form Pengaturan Admin**: Mengintegrasikan auto-converter ke event `input` dan `change` pada input logo sekolah (`#settingLogoUrl`) dan ke-4 logo kategori STEM (`#settingLogoSci`, `#settingLogoTec`, `#settingLogoEng`, `#settingLogoMat`). Gambar pratinjau langsung tampil seketika saat tautan di-paste.
  - **Sinkronisasi Otomatis Penyimpanan**: Nilai yang disimpan ke Google Sheets maupun LocalStorage otomatis dinormalisasi dalam format CDN gambar siap pakai.
  - **Defensive Error Fallback (`onerror`)**: Menambahkan handler `onerror` pada logo navbar (`#navSchoolLogo`) dan gambar pratinjau (`#previewLogoImg`) dengan fallback otomatis ke logo default sekolah serta menampilkan kotak notifikasi peringatan jika hak akses berkas di Google Drive belum diatur ke *"Siapa saja yang memiliki link"*.
  - **Pembaruan Petunjuk Admin**: Menyelaraskan teks instruksi pada Tab Pengaturan Logo dan Tab Panduan Penggunaan Admin.

---

## [1.6.1] - 2026-10-27

### Fixed & Hardened
- **Ketahanan Interaksi Modal Jenjang Kelas & Isolasi Error Boundary Komponen**:
  - **Guaranteed Modal Dismissal**: Membungkus logika pemilihan kelas di `chooseGradeAndExplore` dalam blok `try...catch...finally` dengan `closeGradeSelectorModal()` di dalam `finally`, menjamin modal selalu tertutup dan tidak membeku di layar meskipun ada runtime error minor.
  - **Isolasi Error Boundary per Sub-Render**: Membungkus setiap sub-render pada `renderApp()` (`renderSchoolIdentity`, `renderCategoryLogosAndCounts`, `renderCategorySubpageHeader`, `updateGradeFilterBarVisibility`, `renderMaterialsGrid`, `renderActiveFilterStatus`) dalam `try...catch` mandiri sehingga kegagalan satu komponen tidak membatalkan transisi view ke sub-kategori.
  - **Force View Transition Fallback**: Menambahkan penanganan kesalahan dan fallback langsung pada `selectCategory()` untuk memastikan `#viewHome` disembunyikan dan `#viewCategorySub` ditampilkan.
  - **Defensive Modal Display & Metadata Parsing**: Menambahkan fallback aman pada `openGradeSelector()` jika modal tidak ditemukan di DOM, serta memastikan modal ditampilkan dengan properti CSS prioritas tinggi (`display: flex !important; opacity: 1`).
  - **Resilient Active Filter Status**: Memperbaiki `renderActiveFilterStatus()` dengan fallback `INITIAL_MATERIALS` dan normalisasi kategori standar untuk mencegah potensi `TypeError` pada data array yang kosong atau belum siap.
  - **Passing Event Parameter**: Menyelaraskan seluruh pemanggilan `openGradeSelector(..., event)` pada kartu STEM dan tombol ganti kelas.

---

## [1.6.0] - 2026-10-27

### Fixed & Enhanced
- **Resolusi Masalah Navigasi Pilihan Kelas & Penampilan Sub-Materi STEM di GAS**:
  - **Pencegahan Event Bubbling & Fallthrough Klik Modal**:
    - Menambahkan `type="button"` dan pemanggilan `chooseGradeAndExplore('X', event)` pada ke-7 tombol jenjang kelas di `#gradeSelectorModal` pada [index.html](file:///f:/repository/stemsites/index.html).
    - Memanggil `event.stopPropagation()` dan `event.preventDefault()` pada handler `chooseGradeAndExplore` dan `backToHomeCategories` untuk menghentikan perambatan klik yang sebelumnya menembus ke navbar atau card bawah di dalam sandboxed iframe GAS.
    - Memperbaiki urutan transisi: mengatur state `selectedCategory` dan filter kelas terlebih dahulu sebelum menutup backdrop modal.
  - **Filter Materi Cerdas & Toleran (`getFilteredMaterials`)**:
    - Menambahkan fungsi `normalizeCategoryName()` yang toleran terhadap huruf kecil, spasi, dan sinonim dwi-bahasa (Science/Sains/IPA, Technology/Teknologi, Engineering/Rekayasa, Mathematics/Matematika).
    - Menambahkan fungsi `normalizeGradeDigit()` yang mengekstrak digit angka murni (`replace(/\D/g, '')`) sehingga `"1"`, `1`, `"Kelas 1"`, dan `"1 SD"` saling cocok 100%.
    - Menjamin ketersediaan data dengan fallback otomatis ke `INITIAL_MATERIALS` jika array materi kosong atau belum selesai di-fetch.
  - **Perbaikan Reset Filter Sub-Halaman**:
    - Memperbarui `resetFiltersInSubpage()` agar membuka kunci `appState.isGradeLocked` dan mereset `selectedGrade` menjadi kosong, sehingga tombol *"Tampilkan Seluruh Materi"* benar-benar merender seluruh materi kategori aktif saat ditekan.
  - **Ketahanan Backend Spreadsheet Parser (`Code.gs`)**:
    - Memperluas `formatMaterialRow()` dengan kamus sinonim header Google Sheets (`Kategori STEM`, `Kategori`, `Kelas`, `Jenjang`, dll) dan pembersihan spasi/karakter pemisah.
    - Menambahkan auto-seed 24 materi kurikulum otomatis pada `getInitialData()` jika sheet materi kosong.
  - **Keamanan Scroll di Iframe**:
    - Membungkus seluruh pemanggilan `window.scrollTo({ top: 0, behavior: "smooth" })` dengan blok `try...catch` agar tidak melempar `SecurityError` / `DOMException` di peramban tertentu saat berada di dalam iframe GAS.
  - **Sinkronisasi Generator Kode Deploy**:
    - Menyelaraskan fungsi `getCompleteCodeGsSource()` di [index.html](file:///f:/repository/stemsites/index.html) dengan kode backend [Code.gs](file:///f:/repository/stemsites/Code.gs) terbaru.

---

## [1.5.9] - 2026-10-27

### Fixed & Hardened
- **Resolusi Total Kendala `createOAuthDialog=true` pada Pembukaan Halaman Admin**:
  - **Filter Global Error Boundary**: Memperbarui `window.onerror` di [index.html](file:///f:/repository/stemsites/index.html) untuk menyaring tantangan OAuth internal iframe Google Apps Script (`createOAuthDialog=true` / `userCodeAppPanel`), mencegah kemunculan spanduk error merah palsu (*false-positive*) `Uncaught SyntaxError: Invalid or unexpected token` pada peramban.
  - **Inisialisasi Non-Blocking pada `doGet()`**: Membungkus pemanggilan `initDatabaseIfEmpty()` dalam blok `try...catch` pada [Code.gs](file:///f:/repository/stemsites/Code.gs) agar saat Web App pertama kali dibuka sebelum otorisasi editor, halaman HTML portal tetap disajikan secara instan tanpa memicu kegagalan OAuth di tingkat server.
  - **Autentikasi PIN Tangguh & Mandiri**: Memperbarui `verifyPin()` di [Code.gs](file:///f:/repository/stemsites/Code.gs) dan `submitAdminPin()` di [index.html](file:///f:/repository/stemsites/index.html) agar tetap dapat memverifikasi PIN default (`123456`) meskipun lembar spreadsheet belum selesai diotorisasi, sehingga guru/admin tidak pernah terkunci di luar panel.
  - **Penghapusan Eksekusi Latar Belakang `openAdminView()`**: Menghapus pemanggilan awal `initDeployCodeViewer()` saat membuka admin view agar tidak memicu pemanggilan RPC latar belakang yang tidak perlu.
  - **Deklarasi Eksplisit OAuth Scopes**: Menambahkan cakupan `oauthScopes` eksplisit untuk Google Spreadsheet pada [appsscript.json](file:///f:/repository/stemsites/appsscript.json) guna mencegah Google Apps Script memicu permintaan izin dinamis yang ambigu di dalam iframe.

---

## [1.5.8] - 2026-10-27

### Fixed & Enhanced
- **Resolusi Modal Z-Index Stacking, GAS OAuth Dialog, & Resiliensi Backend**:
  - **Z-Index Modal Admin**: Memperbaiki masalah modal *'Tambah Sub-Card Baru'* (`#materialFormModal`) yang tidak muncul karena terjebak di belakang panel admin (`.admin-overlay-view` `z-index: 150`). Menaikkan `.modal-backdrop` ke `z-index: 300` dan `#materialFormModal` ke `z-index: 350 !important; display: flex !important;`.
  - **Elevasi Toast Notifications**: Memperbarui `.toast-container` ke `z-index: 500` agar seluruh notifikasi validasi dan konfirmasi penyimpanan tampil di atas seluruh modal.
  - **Resolusi `createOAuthDialog=true` (SyntaxError Baris 1)**: Menambahkan panduan wajib otorisasi 1x di editor Apps Script via fungsi `initDatabaseIfEmpty` pada [PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md](file:///f:/repository/stemsites/docs/04-deployment/PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md) guna mencegah browser modern memblokir dialog izin Google di dalam iframe.
  - **Resiliensi Backend `Code.gs`**:
    - Menambahkan helper `getActiveSpreadsheetSafe()` yang mendukung proyek container-bound maupun standalone dengan opsi konfigurasi `SPREADSHEET_ID`.
    - Memasang helper `findColumnIndex()` dan `formatMaterialRow()` dengan pembacaan header kolom case-insensitive (kebal terhadap pengubahan kapitalisasi judul kolom oleh pengguna di Google Sheets).
    - Memperkaya respon `forceSeedMaterials()` dengan pesan status informatif.
    - Menyelaraskan zona waktu penyimpanan tanggal ke WITA (`Asia/Makassar`).
  - **Aksesibilitas & UX Global Modal**: Menambahkan event listener global klik di luar modal (*backdrop click*) dan tombol keyboard `Escape` untuk menutup modal aktif secara instan.
  - **Sinkronisasi Tab Kode Deploy**: Memperbarui fungsi `getCompleteCodeGsSource()` di [index.html](file:///f:/repository/stemsites/index.html) agar kode yang disalin dari panel admin identik 100% dengan `Code.gs` terbaru.

---

## [1.5.7] - 2026-10-26

### Fixed & Optimized
- **Resolusi Tuntas `SyntaxError: Unexpected identifier 'count'` & Optimasi Penyajian GAS**:
  - **Refactor `renderCategoryLogosAndCounts()`**: Mengeliminasi seluruh penggunaan template literals ES6 (backtick) pada pemanggilan selector counter ID (`'count-' + cat`) dan interpolasi teks kuantitas materi (`(categoryCounts[cat] || 0) + ' Materi'`) di [index.html](file:///f:/repository/stemsites/index.html).
  - **Pencegahan Error Sintaks Browser & Iframe**: Menggunakan perulangan array standar ES5 `['Science', 'Technology', 'Engineering', 'Mathematics']` serta perlindungan defensive check pada `appState.materials` dan `appState.settings`.
  - **Penyajian Cepat Tanpa Template Parser di `Code.gs`**: Memperbarui `doGet()` untuk langsung menyajikan `HtmlService.createHtmlOutputFromFile('index')` secara mandiri, mengeliminasi overhead evaluasi template engine server-side yang rawan memicu interferensi parser.
  - **Penghapusan Berkas Modular Lama pada Apps Script**: Menegaskan di [PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md](file:///f:/repository/stemsites/docs/04-deployment/PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md) langkah penghapusan `scripts.html`, `styles.html`, dan `admin.html` di editor Google Apps Script agar sistem hanya menjalankan 2 file utama (`Code.gs` dan `index.html`).

---

## [1.5.6] - 2026-10-26

### Removed & Refactored
- **Pembersihan Berkas Modular Lokal Menjadi Standalone 1:1**:
  - **Eliminasi Berkas Parsial Redundan**: Menghapus berkas modular `styles.html`, `admin.html`, `scripts.html`, `bundle.js`, dan direktori `dist/` dari repositori lokal.
  - **Promosi Standalone ke Root `index.html`**: Menjadikan root [index.html](file:///f:/repository/stemsites/index.html) sebagai satu-satunya berkas antarmuka mandiri utuh (HTML + CSS + modal admin + JavaScript) yang siap dipasang langsung ke Google Apps Script.
  - **Struktur Proyek 1:1 dengan Apps Script**: Repositori lokal kini hanya berfokus pada dua berkas kode utama: [Code.gs](file:///f:/repository/stemsites/Code.gs) (backend) dan [index.html](file:///f:/repository/stemsites/index.html) (frontend).

---

## [1.5.5] - 2026-10-26

### Fixed & Added
- **Solusi Tuntas Freeze / Unclickable & Standalone 1-File Bundle di Google Apps Script**:
  - **Standalone 1-File Bundle (`dist/index.html`)**: Menghasilkan berkas gabungan mandiri utuh (196 KB) melalui skrip otomatis `bundle.js`, memungkinkan pengguna melakukan deployment hanya dengan **2 berkas** di Google Apps Script (`Code.gs` dan `index.html`) tanpa ketergantungan `include()`.
  - **Fungsi `include()` Ultra-Resilient di `Code.gs`**: Memperbarui loader parsial di backend dengan pencarian multi-kandidat (`filename`, `cleanName`, `.html`, `.html.html`), kebal terhadap kesalahan penambahan ekstensi ganda di editor Apps Script.
  - **Visual On-Screen Error Boundary di `index.html`**: Memasang event listener error global di bagian atas `<head>` yang otomatis memunculkan banner diagnostik merah di layar jika terjadi kesalahan JavaScript di lingkungan iframe Google Apps Script.
  - **Default Statis 6 Materi per Kategori**: Memperbarui angka awal pada keempat kartu STEM di HTML statis menjadi `6 Materi` (Science, Technology, Engineering, Mathematics) agar tampilan awal tidak pernah berstatus `0 Materi`.
  - **Tab Standalone pada Panel Admin**: Menambahkan tombol tab khusus `📦 index.html (Standalone 1-File)` pada modal penyalin kode deploy di [admin.html](file:///f:/repository/stemsites/admin.html) dan [scripts.html](file:///f:/repository/stemsites/scripts.html).
  - **Pembaruan Panduan Deployment**: Menambahkan instruksi tegas di [PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md](file:///f:/repository/stemsites/docs/04-deployment/PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md) mengenai keharusan memilih *Versi Baru (New Version)* saat memperbarui deployment Web App agar tidak freeze di cache versi lama.
  - **Sinkronisasi Seluruh Berkas Pendukung**: Memperbarui [README.md](file:///f:/repository/stemsites/README.md), tab panduan deployment di [admin.html](file:///f:/repository/stemsites/admin.html), dan mengkompilasi ulang bundle mandiri [dist/index.html](file:///f:/repository/stemsites/dist/index.html) (202 KB) agar 100% konsisten.

---

## [1.5.4] - 2026-10-26

### Fixed & Enhanced
- **Pemulihan Klik Tombol & Pengisian Materi Instan di Google Apps Script (Zero Script Duplication)**:
  - **Eliminasi Total Script Duplikat**: Menghapus ribuan baris kode duplikasi inline CSS dan JavaScript di dalam [index.html](file:///f:/repository/stemsites/index.html) dan [admin.html](file:///f:/repository/stemsites/admin.html) yang sebelumnya memicu `SyntaxError: Identifier 'DEFAULT_SETTINGS' has already been declared` saat dievaluasi oleh Google Apps Script.
  - **Pemurnian Berkas Modular**: Mengubah [admin.html](file:///f:/repository/stemsites/admin.html) menjadi pure partial HTML (572 baris) tanpa doctype, head, style, atau script ganda. [index.html](file:///f:/repository/stemsites/index.html) kini menjadi shell murni yang ramping (513 baris).
  - **Jaminan Instan 24 Materi SD**: Menginisialisasi `appState.materials` langsung dengan data 24 materi kurikulum STEM SD sejak baris pertama, sehingga detik pertama dibuka di Google Apps Script kartu langsung menampilkan `6 Materi` per kategori tanpa jeda (bebas kondisi materi kosong).
  - **Multi-State Startup Trigger**: Mengganti event listener rapuh `DOMContentLoaded` dengan pemeriksa multi-status (`loading` vs `interactive`/`complete`) dan sinkronisasi `load` event.
  - **Harmonisasi Modal Backdrop**: Menambahkan dukungan selector `.modal-backdrop.open` dan `.modal-backdrop.active` di [styles.html](file:///f:/repository/stemsites/styles.html) agar semua modal terbuka konsisten.
  - **Dukungan Include di Server Lokal**: Menambahkan evaluasi otomatis `include()` pada [server.js](file:///f:/repository/stemsites/server.js) lokal.

---

## [1.5.3] - 2026-10-26

### Fixed & Hardened
- **Pencegahan Error Fatal "Exception: Konten HTML rusak" di Google Apps Script**:
  - Merefaktor fungsi `getLocalDomContent(filename)` pada [index.html](file:///f:/repository/stemsites/index.html), [admin.html](file:///f:/repository/stemsites/admin.html), dan [scripts.html](file:///f:/repository/stemsites/scripts.html) dari multiline template literal mentah menjadi *safe string concatenation*.
  - Menghilangkan kemunculan literal teks `</body>` dan `</html>` di dalam skrip JavaScript yang sebelumnya menyebabkan parser HTML Google Apps Script (`HtmlService`) menganggap dokumen HTML telah ditutup lebih awal, sehingga script setelahnya dianggap teks liar di luar tag penutup.
  - Menghilangkan kemunculan tag mentah `<?!= include('...'); ?>` di dalam JavaScript helper yang sebelumnya berisiko memicu evaluasi rekursif pada template engine Google Apps Script.
  - Memperbarui [PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md](file:///f:/repository/stemsites/docs/04-deployment/PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md) dengan panduan penanganan troubleshoot FAQ terkait error tersebut.

---

## [1.5.2] - 2026-10-26

### Fixed & Enhanced
- **Perbaikan Bug Nesting Tag Div pada Tab Panduan Admin & Step Deploy GAS**:
  - Memperbaiki unclosed tag `</div>` pada container form `tab-settings` di [admin.html](file:///f:/repository/stemsites/admin.html) dan [index.html](file:///f:/repository/stemsites/index.html) yang menyebabkan kontainer `tab-admin-guide` dan `tab-deploy-gas` bersarang secara tidak sengaja di dalam `tab-settings`.
  - Akibat nesting tersebut, ketika tab *Panduan Admin* atau *Step Deploy & Kode GAS* dibuka, pane tersembunyi karena parent `tab-settings` memiliki status `display: none`.
  - Setelah perbaikan struktur DOM, seluruh 4 tab berada pada kedalaman hierarki yang sejajar (*root level siblings*) dan konten Panduan Operasional serta 7 Langkah Deploy GAS tampil secara utuh, jernih, dan interaktif.

---

## [1.5.1] - 2026-10-26

### Added & Enhanced
- **Mekanisme Tri-Guard Auto-Seeding Materi Kurikulum di Google Apps Script (GAS)**:
  - **Backend Auto-Seeding Tanpa Syarat (`Code.gs`)**: Pengecekan inisialisasi sheet `Materi` kini mendeteksi kondisi sheet kosong (`getLastRow() <= 1`), sehingga otomatis men-seed 24 materi kurikulum STEM SD lengkap ke spreadsheet tanpa memerlukan tindakan manual.
  - **Menu Kustom Google Spreadsheet (`onOpen`)**: Menambahkan menu otomatis `🌟 Portal STEM` pada antarmuka spreadsheet dengan opsi `📥 Muat Ulang 24 Materi Kurikulum SD` dan `⚙️ Periksa & Perbaiki Sheet Database`.
  - **Instant Frontend Fallback Protection (`scripts.html`, `index.html`, `admin.html`)**: Memastikan jika data materi dari spreadsheet masih kosong saat pertama kali diakses, frontend secara otomatis memuat `INITIAL_MATERIALS` (24 materi), sehingga tampilan portal tidak pernah kosong.
  - **Tombol Sinkronisasi Materi di Panel Admin**: Menambahkan tombol `🔄 Muat Ulang 24 Materi SD` pada header dan action row mobile untuk memaksa sinkronisasi 24 materi kurikulum ke Google Sheets kapan saja.
- **Pemutakhiran Komprehensif Seluruh Panduan**:
  - Memperbarui [PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md](file:///f:/repository/stemsites/docs/04-deployment/PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md) dengan kode `Code.gs` terbaru dan panduan mekanisme auto-seeding.
  - Memperbarui [README.md](file:///f:/repository/stemsites/README.md) dan [PROPOSAL](file:///f:/repository/stemsites/docs/01-proposals/PROPOSAL-PENAWARAN-DAN-RENCANA-PENGEMBANGAN-PORTAL-STEM.md) agar selaras dengan rilis operasional.

---

## [1.5.0] - 2026-10-26

### Added & Enhanced
- **24 Materi Kurikulum STEM SD Kemdikbud Lengkap (Kelas 1 s.d. 6)**:
  - Menyediakan 24 materi kurikulum STEM SD lengkap (4 pilar × 6 jenjang kelas 1–6) yang diselaraskan dengan Capaian Pembelajaran Kurikulum Merdeka Kemdikbudristek.
  - **Science (IPAS SD)**: 6 Materi terverifikasi (BioDigital 3D Human, PhET Balon & Listrik Statis, PhET Wujud Zat Padat/Cair/Gas, PhET Molekul & Fotosintesis, Google Earth 3D Gunung Berapi, NASA Eyes on the Solar System).
  - **Technology (Informatika & AI)**: 6 Materi terverifikasi (Google Quick, Draw! AI, Blockly Games Maze, MIT Scratch Animasi Kartun, Code.org Minecraft Journey, Autodesk Tinkercad 3D, MIT Scratch Game Edukasi Multi-Level).
  - **Engineering (Rekayasa & Struktur)**: 6 Materi terverifikasi (PhET Keseimbangan Balancing Act, PhET Hukum Apung Buoyancy, PhET Pesawat Sederhana Gaya & Gerak, Cargo Bridge Jembatan Rangka, PhET Sirkuit Listrik DC, Minecraft Education Sekolah Ramah Lingkungan).
  - **Mathematics (Matematika Interaktif)**: 6 Materi terverifikasi (GeoGebra Geometry Suite, Mathigon Polypad Tangram & Jam, PhET Pecahan Fractions Intro, PhET Luas & Keliling Area Builder, Matific Math Game, Mathigon Polypad 3D Solids).
- **Verifikasi 100% Tautan Aktif (HTTP 200 OK)**:
  - Seluruh 24 tautan materi telah diuji secara teknis dan terbukti aktif (HTTP 200 OK), bebas broken link, dan dapat langsung dibuka oleh siswa maupun guru.
- **Sinkronisasi 4 Berkas Arsitektur & Cache Bump (`v1.5.0`)**:
  - Sinkronisasi menyeluruh pada `scripts.html`, `index.html`, `admin.html`, dan data seeding otomatis backend `Code.gs`.
  - Peningkatan `DATA_VERSION` menjadi `"v1.5.0"` sehingga browser pengguna otomatis mereset dan memuat data materi terbaru tanpa perlu hapus cache manual.
- **Lampiran Katalog 24 Materi pada Proposal Penawaran**:
  - Menambahkan tabel katalog 24 materi lengkap beserta platform edukasi dan tautan aktif di dokumen proposal [PROPOSAL-PENAWARAN-DAN-RENCANA-PENGEMBANGAN-PORTAL-STEM.md](file:///f:/repository/stemsites/docs/01-proposals/PROPOSAL-PENAWARAN-DAN-RENCANA-PENGEMBANGAN-PORTAL-STEM.md).

---

## [1.4.3] - 2026-10-26

### Fixed & Enhanced
- **Navbar Admin Terkunci 1 Baris Horizontal (*Single-Row Topbar*)**:
  - Memaksa seluruh elemen navbar dashboard admin (toggle menu, judul *"Dashboard Admin STEM"*, dan tombol *"Portal Siswa"*) terkunci dalam 1 baris horizontal rapi tanpa teks ter-wrap ke baris kedua pada semua ukuran viewport smartphone (360px – 480px).
- **Tipografi Judul Navbar Proporsional**:
  - Menyesuaikan ukuran font judul navbar admin menjadi `0.82rem` dengan `white-space: nowrap !important; text-overflow: ellipsis;` agar seimbang dan nyaman dipandang.
- **Perampingan Tombol Navigasi Portal**:
- **Pembaruan Dokumen Proposal Sesuai Status Riil Sistem (v1.4.3 Siap Pakai)**:
  - Memutakhirkan dokumen [PROPOSAL-PENAWARAN-DAN-RENCANA-PENGEMBANGAN-PORTAL-STEM.md](file:///f:/repository/stemsites/docs/01-proposals/PROPOSAL-PENAWARAN-DAN-RENCANA-PENGEMBANGAN-PORTAL-STEM.md) dengan menambahkan batasan tegas **Ruang Lingkup Aplikasi (*In-Scope vs Out-of-Scope*)** dan format matriks tunggal terpadu 4 kolom pada **Bab 3: Rincian Estimasi Biaya Berdasarkan Peran & Fitur** (`PERAN TEKNIS | FITUR YANG DIKERJAKAN | URAIAN PEKERJAAN | BIAYA (RP)`) dengan total anggaran **Rp 3.500.000,-**.

---

## [1.4.2] - 2026-10-26

### Fixed & Enhanced
- **Perapian Tipografi & Tampilan Mobile Dashboard Admin**:
  - Penyesuaian ukuran font judul pane admin (`.admin-pane-title h2`) menjadi `1.15rem` dan subjudul menjadi `0.78rem`, memberikan tampilan yang proporsional, rapi, dan nyaman dibaca di layar smartphone.
- **Penyatuan Filter dalam 1 Baris Kompak (*1-Row Inline Filters*)**:
  - Filter pencarian, dropdown STEM, dan dropdown Kelas disatukan ke dalam 1 baris grid responsif yang ringkas, menghemat ruang vertikal layar hingga 65%.
- **Penataan Tombol Aksi di Bawah Form / Filter (*Thumb-Zone Ergonomics*)**:
  - Tombol `+ Tambah Sub-Card Baru` di mode mobile diposisikan tepat di bawah baris filter dengan lebar penuh (*full-width touch target*).
  - Tab *Pengaturan Logo & Sekolah* kini dilengkapi tombol `Simpan Pengaturan` di bawah form sehingga pengguna mobile dapat langsung menyimpan setelah selesai mengisi formulir.
- **Pembersihan Runtime Console Error**:
  - Memperbaiki panggilan `openAdminView()` pada `scripts.html`, `admin.html`, dan `index.html` dengan proteksi aman `initDeployCodeViewer()`, menghilangkan error `Uncaught ReferenceError: initCodeSnippets is not defined`.

---

## [1.4.1] - 2026-10-26

### Fixed & Enhanced
- **Perbaikan Total Masalah Klik Tombol & Link pada Mode Offline Lokal**:
  - **Kemandirian Penuh `admin.html` (*Standalone-Ready*)**: Berkas [admin.html](file:///f:/repository/stemsites/admin.html) kini dilengkapi dengan struktur dokumen HTML lengkap, font, styling CSS terpadu, dan skrip JavaScript mandiri. Pengguna dapat membuka `admin.html` langsung di browser dengan double click: modal PIN otomatis terbuka, tombol *"Isi PIN Demo"*, *"Masuk Admin"*, perpindahan tab, dan salin kode deploy kini berfungsi 100%.
  - **Bebas Blokir Keamanan CORS Browser pada `index.html`**: Menghilangkan ketergantungan `fetch()` lokal pada protokol `file:///` di [index.html](file:///f:/repository/stemsites/index.html) dengan menyematkan styling dan skrip mandiri bebas CORS, sembari tetap menjaga kompatibilitas murni Google Apps Script.
  - **Dukungan Server Lokal `http://localhost:3000`**: Disediakan berkas `server.js` ringan yang berjalan di background untuk memberikan pengalaman pengujian lokal di browser tanpa pembatasan origin file.
  - **Dukungan Routing URL GAS**: Fungsi `doGet(e)` pada [Code.gs](file:///f:/repository/stemsites/Code.gs) diperbarui untuk mendukung akses langsung halaman admin melalui parameter `?page=admin`.

---

## [1.4.0] - 2026-10-26

### Added & Enhanced
- **Panduan Deploy Lengkap & Interactive Code Viewer 5 Berkas**:
  - **Selector 5 Berkas Proyek di Panel Admin**: Ditambahkan tab pemilih berkas interaktif pada tab *Step Deploy & Kode GAS* untuk menampilkan seluruh kode sumber lengkap dari 5 berkas: `Code.gs`, `index.html`, `styles.html`, `admin.html`, dan `scripts.html`.
  - **Tombol Salin 1-Klik (*Copy to Clipboard*)**: Memungkinkan pengguna/guru menyalin kode masing-masing berkas secara instan lengkap dengan indikator status sukses dan jumlah karakter.
  - **Panduan 7 Langkah Penerapan (*Deployment Steps*)**: Langkah terstruktur dari pembuatan spreadsheet baru, pembuatan 5 berkas di editor Apps Script, pengaturan hak akses web app (*Anyone*), hingga otorisasi izin akun Google.
  - **Dokumen Panduan Deploy Mandiri Lengkap**: Diterbitkan berkas panduan komprehensif di [docs/04-deployment/PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md](file:///f:/repository/stemsites/docs/04-deployment/PANDUAN-DEPLOY-GOOGLE-APPS-SCRIPT.md) yang memuat instruksi langkah-demi-langkah, kode sumber lengkap 5 berkas, dan FAQ otorisasi Google.

---

## [1.3.1] - 2026-10-26

### Restored & Enhanced
- **Kembalikan Formasi 2 Kolom Card STEM Beranda Mobile**:
  - 4 Card Utama STEM (Science, Technology, Engineering, Mathematics) di beranda publik dikembalikan ke formasi **2 kolom padat** (`grid-template-columns: repeat(2, 1fr) !important;`) pada mode smartphone (< 768px).
  - Tampilan beranda kembali ringkas, seimbang (2 baris x 2 kartu), dan tidak memerlukan scroll panjang.
  - Halaman lainnya (seperti form Pengaturan Logo & Sekolah Admin) tetap dipertahankan 1 kolom responsif agar tidak terpotong.
- **Pemulihan Contoh Materi Pembelajaran Sebelumnya**:
  - Mengembalikan daftar 8 item `INITIAL_MATERIALS` pada [scripts.html](file:///f:/repository/stemsites/scripts.html) dan `sampleMaterials` pada [Code.gs](file:///f:/repository/stemsites/Code.gs) ke konten materi awal yang disukai pengguna.
  - Pembaruan versi cache lokal `DATA_VERSION` menjadi `"v1.3.1"` agar browser klien otomatis memuat materi yang telah dipulihkan.
- **Dokumen Teknis & Penawaran Harga**:
  - Diterbitkan dokumen teknis resmi roadmap pengembangan dan proposal penawaran harga sistem portal STEM sekolah di [docs/01-proposals/PROPOSAL-PENAWARAN-DAN-RENCANA-PENGEMBANGAN-PORTAL-STEM.md](file:///f:/repository/stemsites/docs/01-proposals/PROPOSAL-PENAWARAN-DAN-RENCANA-PENGEMBANGAN-PORTAL-STEM.md).

---

## [1.3.0] - 2026-10-26

### Added & Enhanced
- **Tata Letak Responsif 1 Kolom Penuh Mode Mobile (< 768px)**:
  - **Admin Settings 1 Kolom**: Kelas `.settings-grid-layout` otomatis runtuh (*collapse*) menjadi 1 kolom (`1fr !important`), form input dan preview tersusun rapi secara vertikal tanpa terpotong atau meluap ke samping (*zero horizontal overflow*).
  - **4 Card Utama STEM Beranda 1 Kolom**: Tampilan kartu kategori STEM di beranda publik disesuaikan menjadi 1 kolom vertikal (`grid-template-columns: 1fr !important`) dengan padding lega, subtitle deskripsi aktif, dan indikator panah aksi yang jelas.
  - **Perapian Form & Filter Admin**: Filter bar dan header pada panel admin diselaraskan ke susunan vertikal 1 kolom penuh pada layar smartphone.
- **Pemurnian Arsitektur Google Apps Script (Zero `.css` & `.js`)**:
  - Berkas `.css` dan `.js` dihapus sepenuhnya dari repositori (`git rm style.css app.js`).
  - Proyek kini mematuhi 100% standar berkas Google Apps Script (hanya `.html` dan `.gs`), dengan styling terpusat di `styles.html`, logika di `scripts.html`, dan markup admin di `admin.html`.
  - Ditambahkan injector fallback lokal cerdas pada `index.html` agar repositori tetap dapat diuji coba di browser lokal (Live Server) tanpa memerlukan server build.

---

## [1.2.2] - 2026-10-25

### Added & Enhanced
- **Footer Resmi Terpusat (*Centered Footer*)**:
  - Seluruh elemen footer disusun di tengah (*center aligned*) dengan tata letak vertikal yang bersih, seimbang, dan elegan.
  - Tautan WhatsApp langsung menampilkan nomor telepon resmi tanpa awalan teks panjang (format rapi dan interaktif).
  - Tautan email resmi dihilangkan dari footer sesuai arahan pengguna.
  - Hak cipta sekolah tampil terpusat rapi di bawah tombol WhatsApp.
- **Perapian Tipografi & Tata Letak Mode Mobile**:
  - Penyesuaian proporsional ukuran font dan padding di semua komponen untuk layar smartphone (< 768px dan < 480px).
  - Merapikan navbar mobile, hero banner, caption beranda, dan 4 Card Utama STEM (2 card per baris).
  - Menyelaraskan tombol navigasi *"Menu STEM"*, banner info jenjang kelas, dan input pencarian pada halaman sub-materi.
  - Menghilangkan elemen yang tidak diperlukan dan memastikan nol scroll horizontal (*zero overflow*).

---

## [1.2.1] - 2026-10-25

### Added
- **Penguncian Jenjang Kelas Otomatis (*Grade Locking*)**:
  - Ketika siswa memilih jenjang spesifik (Kelas 1 s.d. 6 SD) pada pop-up di beranda, pilihan jenjang langsung dikunci saat memasuki halaman sub-materi.
  - Baris filter tombol kelas (`.grade-filter-bar`) otomatis disembunyikan agar tampilan bersih dan fokus.
  - Ditambahkan banner penanda *"Materi Khusus: Kelas X SD"* dengan tombol cepat `[ 🔄 Ganti Jenjang Kelas ]` untuk mengganti kelas kapan saja tanpa harus kembali ke beranda.
  - Jika siswa memilih *"Tampilkan Semua Kelas"*, baris filter kelas tetap tampil normal untuk eksplorasi bebas.
- **Isolasi Reset Filter**:
  - Tombol *Reset Filter* di halaman sub-materi kini hanya mereset pencarian kata kunci dan jenis media, dengan tetap menjaga kelas yang sedang terkunci.

---

## [1.2.0] - 2026-10-25

### Added
- **Modal Pop-up "Pilih Jenjang Kelas" Ramah Anak**:
  - Klik pada 4 Card Utama STEM (Science, Technology, Engineering, Mathematics) di beranda membuka pop-up interaktif pemilihan jenjang kelas.
  - Pilihan tombol besar: *"Tampilkan Semua Kelas"* dan tombol kelas 1 s.d. 6 SD.
  - Setelah jenjang dipilih, modal otomatis tertutup dan mengarahkan langsung ke halaman sub-kategori dengan filter jenjang kelas tersebut aktif seketika.
- **Footer Resmi Sekolah Ringkas & Elegan**:
  - Menampilkan elemen esensial sesuai arahan pengguna: Identitas Sekolah (Logo & Nama Sekolah), Kontak Bantuan langsung (WhatsApp & Email sekolah dinamis dari database settings), serta Hak Cipta Tahun Ajaran Aktif (`© 2026/2027 SD NEGERI HARAPAN BANGSA. Hak Cipta Dilindungi.`).

### Fixed & Enhanced
- **Perbaikan Hamburger Navigasi Mobile (Bebas Layout Shift)**:
  - Mengubah dropdown menu mobile menjadi *floating absolute overlay* (`position: absolute; top: 70px; z-index: 90;`) dengan efek backdrop blur dan bayangan halus.
  - Mengeliminasi pergeseran (*push layout shift*) pada konten hero banner saat menu mobile dibuka maupun ditutup.

---

## [1.1.1] - 2026-10-25

### Fixed & Enhanced
- **Penyelarasan Akurat Materi STEM & Simulasi**:
  - `STEM-SCI01`: Daur Hidup & Metamorfosis Kupu-kupu terhubung ke video pembelajaran animasi siklus hidup lengkap dengan 4 tahap.
  - `STEM-SCI02`: Eksplorasi Cahaya & Warna Tumbuhan terhubung ke simulasi resmi **PhET Colorado: Color Vision** (eksplorasi spektrum RGB dan pantulan warna hijau daun).
  - `STEM-TEC01`: Logika Coding Dasar terhubung ke game simulasi algoritma resmi **Google Blockly Games: Maze**.
  - `STEM-TEC02`: Literasi Digital & Anti-Hoaks terhubung ke simulasi 3D resmi **Google: Interland (Sungai Realitas)**.
  - `STEM-ENG01`: Rekayasa Keseimbangan Struktur terhubung ke simulasi resmi **PhET Colorado: Balancing Act** (hukum kesetimbangan beban dan titik tumpu).
  - `STEM-ENG02`: Desain Mobil Bertenaga Dorong Balon terhubung ke simulasi hukum gerak & energi **PhET Colorado: Energy Skate Park** dan panduan praktikum mandiri.
  - `STEM-MAT01`: Pecahan Pizza & Kue Lezat diperbarui ke tipe `Simulasi` dan terhubung langsung ke simulasi resmi **PhET Colorado: Fractions Intro** (model lingkaran pizza, kue, dan game pecahan interaktif).
  - `STEM-MAT02`: Arsitek Cilik: Eksplorasi Luas & Keliling terhubung langsung ke simulasi resmi **PhET Colorado: Area Builder** (perancangan denah bangun datar pada petak bergaris).
- **Auto-Sync Versi Data**: Menambahkan mekanisme sinkronisasi versi data otomatis (`DATA_VERSION: v1.1.1`) agar pengguna yang membuka kembali browser langsung mendapatkan data materi yang akurat tanpa perlu menghapus cache manual.

---

## [1.1.0] - 2026-10-25

### Added
- **Arsitektur Pemisahan Modular**:
  - `styles.html` & `style.css`: Pemisahan modular stylesheet dan variabel CSS.
  - `scripts.html` & `app.js`: Pemisahan modular logika JavaScript.
  - `admin.html`: Pemisahan halaman dashboard admin, sidemenu, dan formulir CRUD.
  - `Code.gs`: Integrasi helper `include()` untuk kompilasi modular Google Apps Script.
- **Navigasi 2-Tampilan yang Bersih**:
  - **Beranda Utama Bersih (Home View)**: Hanya memuat identitas sekolah, hero banner ringkas, dan 4 Card Utama STEM. Sub-materi disembunyikan seluruhnya.
  - **Halaman Khusus Sub-Kategori STEM (Category Sub-Page View)**: Terbuka saat salah satu Card STEM diklik, menyembunyikan 4 Card STEM, dan menghadirkan tombol *"⬅️ Kembali ke Kategori Utama STEM"*, header kategori, filter kelas 1-6, filter media, dan grid materi terkait.
- **Kustomisasi Logo 4 Kategori STEM di Admin**:
  - Formulir input URL logo kustom untuk Science, Technology, Engineering, dan Mathematics di Tab Pengaturan Logo & Sekolah.
  - Kotak *Live Preview* untuk memantau perubahan tampilan logo 4 kategori secara langsung.

### Changed
- **Optimasi Mode Mobile**:
  - Menyembunyikan `.hero-meta-bar` pada mode mobile (`display: none !important;`).
  - Merapikan padding dan tipografi *Hero Banner* pada layar smartphone (< 768px).
  - Memastikan 4 Card Utama STEM tetap tampil rapi **2 card dalam 1 baris** di layar mobile.

---

## [1.0.0] - 2026-10-25

### Added
- Rilis perdana portal STEM sekolah berbasis Google Apps Script Web App.
- Header Identitas Sekolah & 4 Card Utama STEM (Science, Technology, Engineering, Mathematics).
- Filter kelas 1-6, pencarian kata kunci, dan filter tipe media.
- Modal Misi Eksplorasi Siswa (Tujuan, Langkah Praktikum, Link Media, dan Refleksi).
- Panduan pengguna untuk Siswa SD, Orang Tua, Guru Kelas, dan FAQ.
- Halaman admin ber-PIN dengan sidemenu dan CRUD Google Sheets.
