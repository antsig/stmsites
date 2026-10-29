# Walkthrough: Penambahan Logo Sekolah pada Navbar Dashboard Admin (v1.6.3)

## Ringkasan Perubahan
Menambahkan logo sekolah resmi pada bilah navigasi atas (*topbar navbar*) di dalam Dashboard Admin, tepat di sebelah kiri teks judul *"Dashboard Admin"*. Logo yang ditampilkan bersumber secara otomatis dari logo utama sekolah yang aktif (termasuk direct CDN gambar Google Drive) dengan responsivitas tinggi pada tampilan desktop maupun perangkat seluler (mobile).

---

## 1. Bukti Verifikasi Teknis (Technical Evidence)

### A. Markup & Penempatan Elemen Gambar
Elemen gambar `#adminNavSchoolLogo` disematkan di dalam kontainer `.admin-topbar-title`:
```html
<div class="admin-topbar-title">
  <img id="adminNavSchoolLogo"
    src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80"
    alt="Logo Sekolah" class="admin-school-logo-img"
    onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80';">
  <span>Dashboard Admin</span>
</div>
```

### B. Styling Responsif Desktop & Mobile
- **Desktop (>= 768px)**: Ukuran 34px × 34px, `border-radius: var(--radius-sm)`, border tipis kontras `#334155`, latar belakang `#FFF`, dan `flex-shrink: 0`.
- **Mobile (< 768px)**: Ukuran otomatis menyesuaikan menjadi 26px × 26px agar topbar tetap 1 baris penuh, tidak bertabrakan dengan tombol toggle sidebar maupun tombol *"Portal Siswa"*.

### C. Sinkronisasi Logika JavaScript
Di dalam `renderSchoolIdentity()`:
- Nilai `#adminNavSchoolLogo.src` dan `#navSchoolLogo.src` diselaraskan secara langsung dengan `formatGoogleDriveImageUrl(s.logo_url)`.
- Saat fungsi `openAdminView()` dipanggil, `renderSchoolIdentity()` otomatis dieksekusi sehingga logo di navbar admin selalu sinkron seketika saat admin dibuka.

### D. Pengujian Peramban Nyata (Browser Subagent)
- **Desktop**: Terverifikasi elemen `#adminNavSchoolLogo` tampil proporsional di samping teks *"Dashboard Admin"*.
- **Mobile Viewport 375px**: Terverifikasi elemen logo mengecil ke ukuran 26px tanpa menyebabkan *horizontal overflow* atau teks terpotong aneh.
- **Video Sesi Uji**: `admin_navbar_logo_1793239915838.webp`

---

## 2. Panduan Pengujian untuk Pengguna (User Testing Journey)

1. Buka situs web portal STEM di peramban Anda.
2. Klik tombol **Masuk Admin** di navbar atas dan masukkan PIN admin (default: `123456`).
3. Perhatikan bilah hitam (*topbar*) di bagian paling atas:
   - Tepat di sebelah kiri teks **"Dashboard Admin"**, kini telah tampil logo resmi sekolah dengan rapi dan proporsional.
4. Buka tab **Pengaturan Logo & Sekolah**:
   - Jika Anda mengubah URL logo sekolah dan mengklik **Simpan Pengaturan**, logo di navbar admin tersebut akan langsung ikut terbarui secara *real-time*.
5. Buka melalui ponsel (*smartphone*) atau perkecil jendela browser:
   - Logo otomatis menyesuaikan ukuran (26px) dan seluruh tombol topbar tetap berada dalam 1 baris yang rapi.
