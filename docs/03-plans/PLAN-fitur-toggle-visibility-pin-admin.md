# Rencana Implementasi: Fitur View/Hide Nilai PIN Admin (Password Toggle)

## 1. Konteks & Latar Belakang Masalah
Pengguna meminta penambahan fitur standar formulir login/input kata sandi berupa toggle view/hide (tampilkan/sembunyikan nilai PIN) pada field input PIN Admin.
Saat ini, input PIN admin pada modal login (`#inputAdminPin`) menggunakan atribut statis `type="password"` tanpa tombol intip (eye icon), sehingga administrator tidak dapat memeriksa digit PIN yang telah diketik sebelum melakukan submit. Hal yang sama juga berlaku pada input ubah PIN baru di formulir pengaturan sekolah (`#settingAdminPin`).

## 2. Ruang Lingkup (*Scope*)
### In-Scope:
- **Komponen Input Password Wrapper**:
  - Membungkus field input PIN `#inputAdminPin` pada modal login admin (`#adminPinModal`) dengan container posisi relatif `.input-password-wrapper`.
  - Menambahkan tombol interaktif `.password-toggle-btn` dengan ikon mata Font Awesome (`fa-solid fa-eye` / `fa-solid fa-eye-slash`) di sisi kanan input.
  - Membungkus field input ganti PIN `#settingAdminPin` pada formulir Pengaturan Admin dengan struktur tombol toggle yang sama untuk konsistensi UX.
- **Logika Interaktif Frontend (`togglePasswordVisibility`)**:
  - Fungsi universal JavaScript untuk beralih antara `type="password"` dan `type="text"`.
  - Mengubah ikon dinamis antara mata terbuka (`fa-eye`) dan mata dicoret (`fa-eye-slash`).
  - Menyediakan atribut aksesibilitas (`aria-label` & `title`).
  - Menjaga nilai perataan teks (`text-align`) dan `letter-spacing` agar tetap proporsional saat tipe input berubah.
- **Reset State Keamanan**:
  - Saat modal PIN ditutup (`closeAdminPinModal()`) atau dibuka (`openAdminPinModal()`), tipe input otomatis dikembalikan ke `password` dan ikon mata di-reset ke kondisi semula demi privasi dan keamanan.
- **Gaya CSS Elemen**:
  - Menambahkan kelas CSS `.input-password-wrapper` dan `.password-toggle-btn` yang responsif, terintegrasi mulus dengan tema CSS sistem, memiliki touch target minimum 44×44px di mobile, dan bebas dari horizontal overflow.

### Out-of-Scope:
- Tidak mengubah logika validasi PIN, hashing, atau alur verifikasi backend Google Apps Script (`verifyPin()`).
- Tidak mengubah default nilai PIN atau hak akses admin.

## 3. Inventaris Berkas (*File Inventory*)
| Berkas | Aksi | Deskripsi Perubahan |
|---|---|---|
| [index.html](file:///f:/repository/stemsites/index.html) | Modifikasi | Menambahkan styling CSS `.password-toggle-btn`, membungkus `#inputAdminPin` dan `#settingAdminPin` dengan tombol toggle mata, serta mengimplementasikan fungsi `togglePasswordVisibility()`. |
| [CHANGELOG.md](file:///f:/repository/stemsites/CHANGELOG.md) | Modifikasi | Mencatat penambahan fitur toggle view/hide PIN pada rilis minor/patch berikutnya. |
| `docs/03-plans/PLAN-fitur-toggle-visibility-pin-admin.md` | Dibuat | Dokumen rencana implementasi ini. |
| `docs/WALKTHROUGH-fitur-toggle-visibility-pin-admin.md` | Dibuat (Pasca-eksekusi) | Bukti verifikasi browser dan panduan pengujian fitur. |

## 4. Rencana Skema Database / Migrasi
- **Tidak ada perubahan skema database**: Fitur ini sepenuhnya merupakan penyempurnaan UI/UX sisi klien (frontend).

## 5. Mitigasi Risiko & Rollback
- **Risiko Pergeseran Tata Letak Teks**: Karena `#inputAdminPin` menggunakan `letter-spacing: 0.25em` dan `text-align: center`, penempatan tombol toggle absolute di sisi kanan memerlukan `padding-right: 42px` dan `padding-left: 42px` agar teks PIN tetap terpusat secara optik dan tidak tertimpa tombol mata.
- **Risiko Aksesibilitas**: Tombol toggle diberi `type="button"` eksplisit agar tidak memicu form submission / enter trigger, serta dilengkapi `aria-label`.
- **Rencana Rollback**: Jika timbul kendala tampilan, elemen wrapper dapat dikembalikan dengan cepat ke `<input type="password">` standar melalui Git restore/revert.
