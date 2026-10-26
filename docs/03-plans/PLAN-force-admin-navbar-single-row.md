# Implementation Plan: Force Admin Navbar to Single Row & Compact Typography

Dokumen ini disusun mengikuti **SOP 5-Fase Wajib Tim Koding Antigravity** untuk merapikan navbar Dashboard Admin di mode mobile, memperkecil ukuran judul navbar, serta memaksa seluruh elemen navbar (toggle sidebar, judul admin, tombol portal siswa) berada dalam **1 baris horizontal yang rapi tanpa wrapping**.

---

## 1. Analisis Masalah As-Is vs Solusi To-Be

### 1.1 Kondisi As-Is (Mobile Viewport 360px – 394px)
- Di `.admin-topbar`, tinggi bar 64px dengan padding 1.25rem.
- `.admin-topbar-title` memiliki `font-size: 1.05rem` dan teks `"Dashboard Admin STEM"`.
- Tombol kanan memiliki teks panjang: `<i class="fa-solid fa-globe"></i> Lihat Portal Siswa`.
- Pada lebar layar ponsel 360px–394px, kombinasi judul besar dan tombol lebar menyebabkan teks judul wrap ke baris 2 (menumpuk secara vertikal) atau mendesak tombol keluar dari proporsi.

### 1.2 Kondisi To-Be (Target Solusi)
- **Paksa 1 Baris Penuh (*No-Wrap Enforcement*)**:
  - `.admin-topbar`: `flex-wrap: nowrap !important; height: 52px !important; padding: 0 0.65rem !important; gap: 0.5rem !important;`
  - `.admin-topbar-left`: `flex: 1 1 auto; min-width: 0; gap: 0.45rem; flex-wrap: nowrap;`
- **Tipografi Judul Navbar Proporsional**:
  - `.admin-topbar-title`: `font-size: 0.82rem - 0.85rem !important; white-space: nowrap !important; overflow: hidden; text-overflow: ellipsis;`
- **Tombol Kanan Ringkas di Mobile**:
  - Tombol kanan di mobile dibuat ringkas: `<i class="fa-solid fa-globe"></i> <span class="nav-portal-text">Portal Siswa</span>` dengan `font-size: 0.72rem - 0.75rem`, `padding: 0.35rem 0.6rem`, `white-space: nowrap !important; flex-shrink: 0;`.
  - Pada layar yang sangat sempit (< 380px), teks tombol otomatis menjadi "Portal" atau tetap "Portal Siswa" dengan padding kompak.

---

## 2. Inventaris Berkas (*File Inventory*)

| No | Berkas | Aksi | Deskripsi |
|---|---|---|---|
| 1 | `styles.html` | Edit | Menambahkan aturan `@media (max-width: 767px)` untuk `.admin-topbar`, `.admin-topbar-title`, dan tombol navbar. |
| 2 | `admin.html` | Edit | Sinkronisasi CSS inline dan markup navbar admin. |
| 3 | `index.html` | Edit | Sinkronisasi CSS inline dan markup navbar admin. |
| 4 | `CHANGELOG.md` | Edit | Dokumentasi rilis `v1.4.3`. |
| 5 | `docs/WALKTHROUGH-navbar-admin-1baris.md` | Create | Bukti uji visual navbar mobile 1 baris. |

---

## 3. Langkah Kerja
1. **Langkah 1**: Perbarui CSS responsif mobile pada `styles.html`, `admin.html`, dan `index.html`.
2. **Langkah 2**: Optimalkan teks dan styling tombol kanan di navbar admin pada `admin.html` dan `index.html`.
3. **Langkah 3**: Verifikasi via Browser subagent pada resolusi 360px, 394px, dan 412px untuk memastikan 100% berada dalam 1 baris rapi.
4. **Langkah 4**: Update `CHANGELOG.md` (v1.4.3) dan buat walkthrough document.
5. **Langkah 5**: Git commit, tag `v1.4.3`, dan push ke remote repository.
