# Implementation Plan: Mobile Admin Refinement, 1-Row Compact Filter & Bottom Action Buttons

Dokumen ini disusun mengikuti **SOP 5-Fase Wajib Tim Koding Antigravity** untuk mengoptimalkan tampilan mobile dashboard admin, merapikan tipografi/judul halaman, menyatukan filter dalam 1 baris ringkas, memindahkan tombol aksi ke bawah form demi kenyamanan akses jempol (*thumb-zone ergonomis*), serta memperbaiki runtime console error `initCodeSnippets is not defined`.

---

## 1. Konteks & Analisis As-Is vs To-Be

### 1.1 Kondisi As-Is (Permasalahan Nyata di Mobile Viewport 360px - 394px)
1. **Tipografi & Judul Halaman Terlalu Besar**:
   - Judul `Kelola Sub-Card Materi STEM` berukuran `1.45rem - 1.5rem` dengan deskripsi panjang, menghabiskan 30%+ tinggi layar vertikal sebelum pengguna melihat data/fitur.
2. **Filter Menumpuk 3 Baris Tebal**:
   - Di `@media (max-width: 767px)`, `.admin-filter-bar` diatur `flex-direction: column`, menyebabkan:
     - Baris 1: Input pencarian
     - Baris 2: Dropdown STEM
     - Baris 3: Dropdown Kelas
   - Hal ini sangat boros ruang vertikal (*vertical space waste*).
3. **Tombol Aksi di Atas Form / Sulit Dijangkau Jempol**:
   - Tombol `+ Tambah Sub-Card Baru` berada di header atas sebelum filter.
   - Tombol `Simpan Pengaturan` pada tab identitas sekolah berada di pojok kanan atas, sehingga saat pengguna mengetik form panjang ke bawah di HP, mereka harus scroll jauh kembali ke atas untuk menyimpan.
4. **Console ReferenceError di DevTools**:
   - DevTools console mencatat `Uncaught ReferenceError: initCodeSnippets is not defined` saat `submitAdminPin` -> `openAdminView()`.

### 1.2 Kondisi To-Be (Target Solusi)
1. **Tipografi Mobile Proporsional & Nyaman Dibaca**:
   - Judul pane admin (`.admin-pane-title h2`) disesuaikan menjadi `1.15rem - 1.2rem` dengan `line-height: 1.3`.
   - Deskripsi subjudul (`.admin-pane-title p`) menjadi `0.8rem` yang ringkas dan padat.
   - Spacing margin/padding disusutkan secara proporsional.
2. **Filter 1 Baris Kompak (*1-Row Inline Filters*)**:
   - Menggunakan CSS Grid / Flexbox 1 baris:
     `grid-template-columns: minmax(130px, 1.8fr) minmax(90px, 1fr) minmax(85px, 1fr);`
   - Ketinggian input & select diseragamkan (38px), font `0.78rem - 0.8rem`, dengan padding rapi dan teks yang pas.
3. **Action Button di Bawah Form / Filter**:
   - Tombol `+ Tambah Sub-Card Baru` di mobile diposisikan di bawah baris filter dengan lebar penuh (*full-width touch target*) atau di action-row khusus sebelum tabel.
   - Tab "Pengaturan Sekolah": Ditambahkan action button bar di bawah form (`Simpan Pengaturan`) sehingga pengguna mobile langsung dapat menekan tombol simpan tepat setelah selesai mengisi form.
4. **Pembersihan Console Error**:
   - Memperbaiki `openAdminView()` untuk memanggil `initDeployCodeViewer()` secara aman (`typeof initDeployCodeViewer === 'function'`).

---

## 2. Ruang Lingkup Perubahan (Scope)

- **In-Scope**:
  - Penyesuaian CSS media query mobile di `styles.html`, `admin.html`, dan `index.html`.
  - Penyesuaian struktur markup tombol aksi (bottom action button) di `admin.html` dan `index.html`.
  - Perbaikan fungsi `openAdminView()` di `scripts.html`, `admin.html`, dan `index.html`.
  - Verifikasi otomatis menggunakan browser DevTools MCP pada viewport mobile (394x546).
- **Out-of-Scope**:
  - Mengubah struktur data JSON materi dan skema Google Apps Script backend (`Code.gs`).
  - Menghilangkan fitur desktop (tampilan desktop tetap mempertahankan layout lebar yang nyaman).

---

## 3. Inventaris Berkas (*File Inventory*)

| No | Berkas | Aksi | Deskripsi Perubahan |
|---|---|---|---|
| 1 | `styles.html` | Edit | Mengubah style mobile `.admin-pane-title`, `.admin-filter-bar` (1 baris), dan bottom action row. |
| 2 | `admin.html` | Edit | Sinkronisasi CSS, penataan tombol aksi di bawah filter & form, perbaikan `openAdminView()`. |
| 3 | `index.html` | Edit | Sinkronisasi CSS, penataan tombol aksi di bawah filter & form, perbaikan `openAdminView()`. |
| 4 | `scripts.html` | Edit | Perbaikan `openAdminView()` menghapus pemanggilan fungsi usang `initCodeSnippets()`. |
| 5 | `CHANGELOG.md` | Edit | Dokumentasi rilis `v1.4.2`. |
| 6 | `docs/WALKTHROUGH-stem-gas-webapp.md` | Edit | Update panduan uji & verifikasi mobile admin. |

---

## 4. Rencana Langkah Kerja (*Step-by-Step Execution Plan*)

### Langkah 1: Perbaikan Bug Console `initCodeSnippets`
- Ubah baris `initCodeSnippets()` di `scripts.html`, `admin.html`, dan `index.html` menjadi pemanggilan aman `if (typeof initDeployCodeViewer === 'function') initDeployCodeViewer();`.

### Langkah 2: Styling Tipografi Mobile Admin & Filter 1 Baris
- Di `styles.html` (dan inline `<style>` di `admin.html` & `index.html`):
  - Atur tipografi mobile:
    ```css
    @media (max-width: 767px) {
      .admin-pane-title h2 { font-size: 1.15rem !important; line-height: 1.3 !important; }
      .admin-pane-title p { font-size: 0.8rem !important; margin-bottom: 0.5rem !important; }
      .admin-pane-header { flex-direction: column !important; align-items: stretch !important; gap: 0.5rem !important; margin-bottom: 0.75rem !important; }
      
      /* Filter 1 Baris Kompak */
      .admin-filter-bar {
        display: grid !important;
        grid-template-columns: 1.8fr 1.1fr 1fr !important;
        gap: 0.35rem !important;
        margin-bottom: 0.75rem !important;
      }
      .admin-filter-bar input, .admin-filter-bar select {
        width: 100% !important;
        max-width: 100% !important;
        font-size: 0.78rem !important;
        padding: 0.45rem 0.4rem !important;
        height: 38px !important;
      }
      
      /* Action button di bawah filter */
      .admin-action-row-mobile {
        display: flex !important;
        margin-bottom: 0.85rem !important;
      }
      .admin-action-row-mobile .nav-btn {
        width: 100% !important;
        justify-content: center !important;
        padding: 0.65rem 1rem !important;
        font-size: 0.85rem !important;
      }
    }
    ```

### Langkah 3: Penataan Posisi Action Button di Bawah Form
- Tab 1 (Kelola Materi):
  - Di desktop, tombol `+ Tambah Sub-Card Baru` tetap tampil rapi. Di mobile, tombol ini tampil di bawah baris filter 1 baris, tepat sebelum tabel materi.
- Tab 2 (Pengaturan Sekolah):
  - Tambahkan kontainer tombol aksi `Simpan Pengaturan` di bawah form utama sehingga pengguna mobile dapat langsung menyimpan tanpa harus scroll ke atas.

### Langkah 4: Pengujian & Verifikasi Visual dengan DevTools MCP
- Muat `http://localhost:3000/admin.html` dengan viewport mobile 394x546.
- Buka dashboard admin via PIN `123456`.
- Ambil screenshot dan verifikasi:
  1. Judul dan deskripsi proporsional dan nyaman dibaca.
  2. Filter tersusun rapi dalam 1 baris.
  3. Action button berada di bawah filter / form.
  4. Tidak ada error `initCodeSnippets` di console.

### Langkah 5: Semantic Versioning, Walkthrough & Git Commit
- Rilis `v1.4.2` di `CHANGELOG.md`.
- Update `docs/WALKTHROUGH-stem-gas-webapp.md`.
- Lakukan Git commit: `fix(admin-mobile): rapikan tipografi filter 1 baris dan tombol aksi di bawah form v1.4.2`.
- Buat annotated tag `v1.4.2` dan push ke remote.

---

## 5. Mitigasi Risiko & Rollback
- Perubahan tata letak dikhususkan pada media query `@media (max-width: 767px)` dengan selector spesifik, sehingga tampilan desktop widescreen tetap stabil dan utuh.
- Tidak ada modifikasi arsitektur backend `.gs`, sehingga kompatibilitas Google Apps Script 100% terjaga.
