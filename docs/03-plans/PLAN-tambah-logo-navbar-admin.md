# Implementation Plan: Penambahan Logo Sekolah pada Navbar Dashboard Admin (v1.6.3)

## 1. Konteks & Permintaan Pengguna
Pengguna meminta:
> *"sesuaikan halaman admin, tambahkan logo di navbar, sebelah kiri "Dashboard Admin". logo ambil sama dengan logo utama"*

Logo utama sekolah yang aktif (termasuk dari URL Google Drive yang telah dikonversi secara dinamis) akan ditampilkan di bilah atas (*topbar navbar*) Panel Admin, tepat di sisi kiri teks *"Dashboard Admin"*.

---

## 2. Ruang Lingkup Perubahan (Scope)

### In-Scope:
1. **Markup HTML (`index.html`)**:
   - Menambahkan elemen gambar `<img id="adminNavSchoolLogo">` di dalam `.admin-topbar-title`, persis di sebelah kiri teks `<span>Dashboard Admin</span>`.
   - Menggunakan atribut `class="admin-school-logo-img"` dengan fallback `onerror` ke gambar default jika terjadi gangguan jaringan.
2. **Desain CSS Responsif (`index.html`)**:
   - Menambahkan styling class `.admin-school-logo-img`:
     - Ukuran desktop: 34px × 34px, `border-radius: var(--radius-sm)`, `object-fit: cover`, border tipis kontras `#334155`.
     - Ukuran mobile (< 768px): 28px × 28px agar tetap proporsional dalam bilah topbar 1 baris yang ringkas.
3. **Sinkronisasi Logika JavaScript (`index.html`)**:
   - Memperbarui fungsi `renderSchoolIdentity()` agar memperbarui sumber gambar `#adminNavSchoolLogo` secara bersamaan dengan `#navSchoolLogo` menggunakan URL logo utama sekolah yang telah diformat via `formatGoogleDriveImageUrl(s.logo_url)`.
   - Memastikan saat logo diubah di menu Pengaturan Admin dan disimpan, logo di navbar admin langsung terbarui secara *real-time*.

### Out-of-Scope:
- Mengubah fungsi logika tombol navigasi admin, otorisasi PIN, atau manipulasi data CRUD materi.

---

## 3. Inventaris Berkas
| No | Berkas | Aksi | Deskripsi |
|---|---|---|---|
| 1 | `docs/03-plans/PLAN-tambah-logo-navbar-admin.md` | Buat | Dokumen rencana implementasi SOP Fase 1. |
| 2 | `index.html` | Edit | Tambah elemen logo navbar admin, styling CSS desktop & mobile, dan sinkronisasi JS di `renderSchoolIdentity`. |
| 3 | `CHANGELOG.md` | Edit | Catatan rilis versi v1.6.3 (SemVer). |
| 4 | `docs/WALKTHROUGH-tambah-logo-navbar-admin.md` | Buat | Dokumentasi walkthrough & verifikasi hasil uji (Fase 3). |

---

## 4. Mitigasi Risiko & Rollback
- Tampilan navbar admin mobile telah memiliki `overflow: hidden; text-overflow: ellipsis;` dan `flex-wrap: nowrap`. Logo berukuran proporsional 28px di mobile tidak akan menyebabkan *wrapping* baris baru atau *horizontal overflow*.
- Jika logo utama belum diatur oleh pengguna, otomatis fallback ke logo default sekolah.

---

## 5. Rencana Pengujian
1. Verifikasi visual desktop (lebar layar > 992px): logo tampil rapi di samping kiri judul "Dashboard Admin".
2. Verifikasi visual mobile (< 768px): logo menyesuaikan skala kompak tanpa merusak tombol toggle sidebar maupun tombol "Portal Siswa".
3. Verifikasi sinkronisasi dinamis: ganti logo di pengaturan dan pastikan logo navbar admin ikut berubah.
