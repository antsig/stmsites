# Walkthrough Verifikasi: Fitur View/Hide Nilai PIN Admin & Penghapusan Tombol Demo (v1.6.5)

## Ringkasan Eksekutif
Pembaruan versi **v1.6.5** menambahkan fitur standar formulir otorisasi kata sandi berupa tombol intip/toggle tampilkan-sembunyikan nilai PIN (*View/Hide PIN Toggle*) pada input PIN Admin, baik pada modal login admin maupun pada formulir ubah PIN baru di panel pengaturan sekolah. Bersamaan dengan ini, tombol *"Isi PIN Demo"* pada modal autentikasi admin telah dihapus secara permanen sesuai arahan pengguna.

---

## 🎯 Komponen yang Diperbarui

1. **Modal Autentikasi PIN Admin (`#adminPinModal`)**:
   - Membungkus `#inputAdminPin` ke dalam `.input-password-wrapper`.
   - Menambahkan tombol interaktif `.password-toggle-btn` dengan ikon mata Font Awesome (`fa-solid fa-eye` / `fa-solid fa-eye-slash`) di sisi kanan input.
   - Mengatur padding horizontal simetris (44px) agar digit PIN tetap berada tepat di tengah tanpa tertimpa tombol toggle.
   - Menghapus blok elemen tombol *"Isi PIN Demo (123456)"* secara permanen dari markup HTML modal.

2. **Formulir Pengaturan Sekolah (`#settingAdminPin`)**:
   - Menerapkan pembungkus `.input-password-wrapper` dan tombol `.password-toggle-btn` yang sama pada input *"Ganti PIN Admin Baru"* di tab Pengaturan Admin untuk keselarasan UX portal.

3. **Logika JavaScript (`togglePasswordVisibility` & `resetPasswordToggle`)**:
   - Fungsi `togglePasswordVisibility(inputId, btn)` yang mengubah atribut `type` input antara `"password"` dan `"text"`, serta memperbarui kelas ikon antara `fa-eye` dan `fa-eye-slash`.
   - Mengatur atribut aksesibilitas `aria-label` dan `title` secara dinamis (*"Tampilkan PIN"* / *"Sembunyikan PIN"*).
   - Menghapus fungsi lama `fillDemoPin()`.
   - Mengimplementasikan `resetPasswordToggle()` pada `openAdminPinModal()` dan `closeAdminPinModal()` sehingga input otomatis ter-reset ke mode tersembunyi (`type="password"`) dan ikon mata terbuka (`fa-eye`) setiap kali modal dibuka atau ditutup.

4. **Gaya CSS Elemen**:
   - Menambahkan `.input-password-wrapper` dan `.password-toggle-btn` dengan touch-target nyaman, warna interaktif saat hover/focus, dan transisi halus.

---

## 🧪 Skenario Pengujian & Hasil Verifikasi

### 1. Verifikasi Modal Login Admin & Penghapusan Tombol Demo
- **Langkah**: Klik tombol **Masuk Admin** di navbar portal.
- **Hasil**:
  - Modal login PIN Admin terbuka.
  - Tombol bantuan *"Isi PIN Demo (123456)"* terbukti **tidak ada / telah dihapus sepenuhnya**.
  - Pada sisi kanan field input PIN Admin, terdapat tombol intip berikon mata (`fa-eye`).

### 2. Pengujian Interaksi View/Hide PIN Modal
- **Langkah**:
  1. Ketik nilai PIN `123456` pada field PIN Admin.
  2. Perhatikan nilai input: tampil tersembunyi sebagai titik-titik bulat (`type="password"`).
  3. Klik tombol ikon mata di sebelah kanan input.
  4. Perhatikan nilai input: berganti menjadi teks terbaca `123456` (`type="text"`), dan ikon mata berganti menjadi mata tercoret (`fa-eye-slash`).
  5. Klik kembali tombol ikon mata: nilai kembali tersembunyi menjadi titik-titik dan ikon kembali menjadi `fa-eye`.

### 3. Pengujian Login dan Form Pengaturan Admin
- **Langkah**:
  1. Klik tombol **Masuk Admin** untuk autentikasi.
  2. Buka tab **Pengaturan** di sidemenu admin.
  3. Cari field *"Ganti PIN Admin Baru (6 Digit)"* (`#settingAdminPin`).
  4. Ketik PIN baru, misalnya `654321`.
  5. Klik tombol mata di sisi kanan field tersebut.
  6. Nilai PIN baru berganti tampilan antara tersembunyi dan terbaca dengan sempurna.

### 4. Pengujian Keamanan Otomatis (Auto-Reset)
- **Langkah**:
  1. Tutup dashboard admin dan kembali ke portal siswa.
  2. Buka kembali modal **Masuk Admin**.
  3. Periksa kondisi input PIN: field kosong, tipe input adalah `password`, dan ikon adalah `fa-eye`.

### 5. Verifikasi Sintaks JavaScript
- **Langkah**: Menjalankan pengujian sintaks skrip runtime Node.js.
- **Hasil**: `ALL SCRIPTS SYNTAX PASS 100%` (0 error, 0 warning).
