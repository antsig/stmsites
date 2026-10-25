# 📋 Rencana Implementasi: Penguncian Jenjang Kelas pada Halaman Sub-Materi STEM

## 📌 1. Konteks & Latar Belakang Masalah
Saat ini, setelah siswa memilih jenjang kelas (misal: "Kelas 2") melalui pop-up di beranda, bar filter jenjang kelas (`.grade-filter-bar`) masih tetap muncul di halaman sub-materi. 
Sesuai arahan pengguna:
> *"Karena sudah pilih jenjang sebelum masuk sub materi, maka seharusnya sudah tidak ada jenjang di filter materi (jenjang sudah dikunci, kecuali jika pilih tampilkan semua kelas)."*

---

## 🎯 2. Ruang Lingkup Perubahan (Scope)

### A. Logika Penguncian Jenjang Kelas (*Grade Locking*)
1. **Skenario 1: Siswa Memilih Kelas Spesifik (Kelas 1 s.d. 6)**:
   - Jenjang kelas **dikunci** sesuai pilihan siswa (`appState.selectedGrade = 'X'`, `appState.isGradeLocked = true`).
   - Baris tombol filter kelas (`.grade-filter-bar`) **otomatis disembunyikan** (`display: none;`).
   - Pada header / toolbar sub-kategori, ditampilkan badge penanda:
     - Badge: `🎯 Khusus Kelas X SD` dengan tombol `[ 🔄 Ganti Kelas ]` (membuka kembali pop-up jenjang jika siswa ingin berpindah kelas).
     - Filter jenis media (*video, simulasi, praktikum*) dan pencarian tetap aktif untuk mencari materi di dalam kelas yang terkunci.
   - Tombol *Reset Filter* hanya mereset pencarian kata kunci dan jenis media tanpa membuka kunci kelas.

2. **Skenario 2: Siswa Memilih "Tampilkan Semua Kelas"**:
   - Jenjang kelas **tidak dikunci** (`appState.selectedGrade = ''`, `appState.isGradeLocked = false`).
   - Baris tombol filter kelas (`.grade-filter-bar`) **tetap ditampilkan** secara normal.
   - Siswa bebas mengeksplorasi seluruh jenjang atau mengklik tombol filter kelas 1 s.d. 6.

### B. Desain Responsif & UX Ramah Anak
- Tampilan toolbar filter menjadi jauh lebih bersih dan ringkas karena tidak ada deretan tombol kelas jika kelas sudah dikunci sejak awal.
- Menghadirkan opsi *"Ganti Jenjang"* yang fleksibel jika siswa ingin mengubah pilihannya tanpa harus kembali ke beranda.

---

## 🏗️ 3. Inventaris Berkas
- [index.html](file:///f:/repository/stemsites/index.html): Menambahkan container badge info kelas terkunci (`#lockedGradeBanner`) dan id pada bar filter kelas.
- [style.css](file:///f:/repository/stemsites/style.css) & [styles.html](file:///f:/repository/stemsites/styles.html): Styling badge kelas terkunci dan tombol ganti kelas.
- [app.js](file:///f:/repository/stemsites/app.js) & [scripts.html](file:///f:/repository/stemsites/scripts.html): Penyesuaian `chooseGradeAndExplore(grade)`, `renderMaterialsGrid()`, `renderActiveFilterStatus()`, dan visibilitas bar filter kelas.
- [docs/WALKTHROUGH-stem-gas-webapp.md](file:///f:/repository/stemsites/docs/WALKTHROUGH-stem-gas-webapp.md): Pembaruan panduan verifikasi pengujian.
- [CHANGELOG.md](file:///f:/repository/stemsites/CHANGELOG.md): Pembaruan versi SemVer ke v1.2.1.

---

## 🔄 4. Tahapan SOP Baku
- [x] **Fase 1**: Implementation Plan & Gerbang Persetujuan Pengguna.
- [x] **Fase 2**: Eksekusi perubahan kode pada `index.html`, `style.css`, `styles.html`, `app.js`, dan `scripts.html`.
- [x] **Fase 3**: Verifikasi walkthrough penguncian jenjang kelas.
- [x] **Fase 4**: Pembaruan `CHANGELOG.md` (v1.2.1).
- [x] **Fase 5**: Commit dan tag Git Conventional Commits `v1.2.1`.
