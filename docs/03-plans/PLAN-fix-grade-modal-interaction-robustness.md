# Implementation Plan: Penuntasan Interaksi Modal & Transisi Tampilan Materi STEM Portal

## Konteks & Permasalahan
Pengguna melaporkan:
> *"sudah bisa di klik, tapi tidak ada respon. langsung eksekusi setelah pembuatan dokumen rencana"*

### Analisis Mendalam Akar Masalah (Deep Root-Cause Analysis):
1. **Kegagalan Penutupan Modal & Transisi View Akibat Error Cascading**:
   - Fungsi `chooseGradeAndExplore(grade, event)` menempatkan `closeGradeSelectorModal()` di baris paling akhir tanpa blok `try...finally`. Jika salah satu fungsi sub-render di dalam `selectCategory()` melempar pengecualian (*runtime exception*), baris `closeGradeSelectorModal()` tidak pernah tercapai.
   - Akibatnya, modal tetap berada di layar di atas halaman, sehingga dari perspektif pengguna: tombol sudah bisa diklik tetapi "tidak ada respon sama sekali" (*unresponsive*).
2. **Kerapuhan Fungsi `openGradeSelector` & Sub-Render**:
   - `openGradeSelector()` belum memiliki penanganan `try...catch` jika `category` bernilai kosong atau properti logo tidak ditemukan, sehingga modal berisiko gagal terbuka sama sekali jika terjadi error saat memformat judul/badge modal.
   - Di `renderApp()`, pemanggilan beruntun: `renderSchoolIdentity()`, `renderCategoryLogosAndCounts()`, `renderCategorySubpageHeader()`, `renderMaterialsGrid()`, dan `renderActiveFilterStatus()` berjalan tanpa isolasi *error boundary* per komponen. Jika salah satu elemen DOM null, seluruh rangkaian render sub-halaman terhenti seketika.
3. **Filter Jenjang Kelas & Array Kategori**:
   - Kondisi `if (itemGradeDigit && itemGradeDigit !== targetGradeDigit)` pada `getFilteredMaterials()` memiliki celah logika jika item materi memiliki digit kosong.
   - `renderActiveFilterStatus()` mengakses `appState.materials.filter` secara langsung tanpa jaminan `Array.isArray`.

---

## Ruang Lingkup Perbaikan (Scope)

### In-Scope:
1. **Isolasi Penuh & Jaminan Eksekusi `closeGradeSelectorModal()` (`index.html`)**:
   - Menggunakan blok `try...catch...finally` pada `chooseGradeAndExplore(grade, event)` agar modal **pasti tertutup 100%** dalam kondisi apa pun.
   - Menggunakan `.style.setProperty("display", "none", "important")` dan menghapus kelas `.open` dan `.active` agar modal tidak tertahan oleh aturan CSS `!important`.
2. **Hardening & Fallback `openGradeSelector(category, event)`**:
   - Membungkus pembacaan atribut logo/nama dalam `try...catch`.
   - Menggunakan `.style.setProperty("display", "flex", "important")` dan `opacity = "1"`.
   - Menyediakan *hard fallback*: jika modal gagal diakses, fungsi langsung mengalihkan view ke sub-kategori (`selectCategory`).
3. **Isolasi Sub-Render pada `renderApp()`**:
   - Membungkus setiap sub-komponen render (`renderCategorySubpageHeader`, `renderMaterialsGrid`, `renderActiveFilterStatus`, `updateGradeFilterBarVisibility`) dalam blok `try...catch` terisolasi, sehingga kegagalan satu komponen visual tidak pernah menggagalkan transisi tampilan halaman utama (`#viewHome` ➡️ `#viewCategorySub`).
4. **Hardening `selectCategory()` dengan Hard Fallback**:
   - Jika terjadi kendala internal, `selectCategory` secara definitif memaksa `#viewHome.style.display = "none"` dan `#viewCategorySub.style.display = "block"`.
5. **Koreksi Logika Filter Digit Jenjang Kelas**:
   - Memastikan `if (targetGradeDigit)` mencocokkan `itemGradeDigit === targetGradeDigit` secara ketat dan aman.
6. **Sinkronisasi Kode Deploy**:
   - Sinkronisasi `getCompleteCodeGsSource()` dengan `Code.gs`.

### Out-of-Scope:
- Tidak mengubah skema data spreadsheet inti.

---

## File Inventory
1. `index.html` - Hardening `openGradeSelector`, `chooseGradeAndExplore`, `closeGradeSelectorModal`, `renderApp`, `selectCategory`, dan sinkronisasi `Code.gs`.
2. `CHANGELOG.md` - Pencatatan rilis `v1.6.1`.
3. `docs/03-plans/PLAN-fix-grade-modal-interaction-robustness.md` - Dokumen rencana kerja (file ini).
4. `docs/WALKTHROUGH-fix-grade-modal-interaction-robustness.md` - Bukti verifikasi browser walkthrough.
