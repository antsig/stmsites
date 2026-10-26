# Walkthrough & Verification Guide: Implementasi 24 Materi Kurikulum STEM SD Kemdikbud (v1.5.0)

Dokumen ini memuat panduan verifikasi fungsional dan teknis untuk rilis **Portal Pembelajaran STEM Sekolah v1.5.0** yang menyematkan 24 data materi kurikulum STEM SD Kemdikbud (Kelas 1–6) dengan tautan aktif terverifikasi HTTP 200 OK.

---

## 1. Ringkasan Pekerjaan (Summary of Changes)

1. **24 Materi Kurikulum STEM Lengkap (Kelas 1 s.d. 6)**:
   - **Science (IPAS SD)**: 6 Materi (BioDigital 3D Human, PhET Balon & Listrik Statis, PhET Wujud Zat, PhET Molekul & Fotosintesis, Google Earth 3D Gunung Berapi, NASA Eyes Tata Surya).
   - **Technology (Informatika & AI Cilik)**: 6 Materi (Google Quick Draw AI, Blockly Games Maze, MIT Scratch Animasi, Code.org Minecraft, Autodesk Tinkercad 3D, MIT Scratch Game Apel).
   - **Engineering (Rekayasa & Desain)**: 6 Materi (PhET Keseimbangan Balancing Act, PhET Hukum Apung Buoyancy, PhET Pesawat Sederhana Gaya & Gerak, Cargo Bridge Jembatan Rangka, PhET Sirkuit Listrik DC, Minecraft Education Sekolah Ramah Lingkungan).
   - **Mathematics (Matematika Eksploratif)**: 6 Materi (GeoGebra Geometry Suite, Mathigon Polypad Tangram & Jam, PhET Pecahan Fractions Intro, PhET Luas Area Builder, Matific Math Game, Mathigon Polypad 3D Solids).
2. **Sinkronisasi 4 Berkas Arsitektur**:
   - `scripts.html`: Array `INITIAL_MATERIALS` diperbarui 24 materi, cache version `DATA_VERSION = "v1.5.0"`.
   - `index.html`: Array `INITIAL_MATERIALS` diperbarui 24 materi, `DATA_VERSION = "v1.5.0"`.
   - `admin.html`: Array `INITIAL_MATERIALS` diperbarui 24 materi, `DATA_VERSION = "v1.5.0"`.
   - `Code.gs`: Data seeding otomatis `sampleMaterials` pada fungsi `initDatabaseIfEmpty()` diperbarui 24 materi.
3. **Pembaruan Proposal Penawaran**:
   - `docs/01-proposals/PROPOSAL-PENAWARAN-DAN-RENCANA-PENGEMBANGAN-PORTAL-STEM.md`: Diperbarui dengan ruang lingkup 24 materi, uraian tugas Data & EdTech Specialist, timeline, dan tabel katalog lampiran 24 materi lengkap.

---

## 2. Hasil Verifikasi Teknis (Technical Evidence)

### 2.1 Verifikasi HTTP Status 24 Tautan (Semua Status 200 OK)

Pengujian automated HTTP fetch membuktikan 24 tautan aktif dan dapat diakses:

```text
OK [200] STEM-SCI01 -> https://human.biodigital.com/
OK [200] STEM-SCI02 -> https://phet.colorado.edu/sims/html/balloons-and-static-electricity/latest/balloons-and-static-electricity_all.html
OK [200] STEM-SCI03 -> https://phet.colorado.edu/sims/html/states-of-matter-basics/latest/states-of-matter-basics_all.html
OK [200] STEM-SCI04 -> https://phet.colorado.edu/sims/html/molecules-and-light/latest/molecules-and-light_all.html
OK [200] STEM-SCI05 -> https://earth.google.com/web/search/Volcanoes
OK [200] STEM-SCI06 -> https://eyes.nasa.gov/apps/solar-system/
OK [200] STEM-TEC01 -> https://quickdraw.withgoogle.com/
OK [200] STEM-TEC02 -> https://blockly.games/maze
OK [200] STEM-TEC03 -> https://scratch.mit.edu/projects/editor/
OK [200] STEM-TEC04 -> https://code.org/minecraft
OK [200] STEM-TEC05 -> https://www.tinkercad.com/
OK [200] STEM-TEC06 -> https://scratch.mit.edu/projects/editor/
OK [200] STEM-ENG01 -> https://phet.colorado.edu/sims/html/balancing-act/latest/balancing-act_all.html
OK [200] STEM-ENG02 -> https://phet.colorado.edu/sims/html/buoyancy/latest/buoyancy_all.html
OK [200] STEM-ENG03 -> https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html
OK [200] STEM-ENG04 -> https://armorgames.com/play/4962/cargo-bridge
OK [200] STEM-ENG05 -> https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_all.html
OK [200] STEM-ENG06 -> https://education.minecraft.net/
OK [200] STEM-MAT01 -> https://www.geogebra.org/geometry
OK [200] STEM-MAT02 -> https://mathigon.org/polypad#tangram
OK [200] STEM-MAT03 -> https://phet.colorado.edu/sims/html/fractions-intro/latest/fractions-intro_all.html
OK [200] STEM-MAT04 -> https://phet.colorado.edu/sims/html/area-builder/latest/area-builder_all.html
OK [200] STEM-MAT05 -> https://www.matific.com/
OK [200] STEM-MAT06 -> https://mathigon.org/polypad#solids
Total OK: 24 / 24
```

### 2.2 Verifikasi Sinkronisasi 24 Item Antar Berkas

```text
scripts.html: 24 items (DATA_VERSION: v1.5.0)
index.html:   24 items (DATA_VERSION: v1.5.0)
admin.html:   24 items (DATA_VERSION: v1.5.0)
Code.gs:      24 items
```

---

## 3. Panduan Pengujian Pengguna (User Testing Journey)

### Langkah 1: Eksplorasi Portal Siswa (`http://localhost:3000/`)
1. Buka `http://localhost:3000/` di peramban web.
2. Klik tombol **Buka Materi** pada salah satu kartu pilar (misalnya *Science*).
3. Pada dialog jenjang kelas, pilih **Tampilkan Semua Kelas**.
4. Amati 6 kartu materi Science Kelas 1 hingga Kelas 6 tampil dengan gambar sampul dan ringkasan.
5. Coba klik pill filter **Kelas 1**; portal akan menyaring materi khusus Kelas 1 (*Eksplorasi Anatomi Tubuh 3D & 5 Panca Indra*).
6. Klik tombol **Mulai Eksplorasi** pada kartu materi Kelas 1:
   - Jendela modal misi terbuka menampilkan Tujuan Pembelajaran, Langkah Praktikum, dan tombol **Buka Simulasi / Tautan Materi**.
   - Klik tombol **Tutup** atau tanda silang untuk menutup modal.

### Langkah 2: Eksplorasi Panel Admin (`http://localhost:3000/admin.html`)
1. Buka `http://localhost:3000/admin.html`.
2. Klik tombol bantu **Isi PIN Demo (123456)**, lalu klik **Masuk Admin**.
3. Di tabel **Daftar Materi STEM**, gulir daftar ke bawah.
4. Pastikan ke-24 materi terdaftar rapi lengkap dengan badge kategori (*Science*, *Technology*, *Engineering*, *Mathematics*), jenjang kelas, dan tipe media (*Lab Maya*, *Simulasi*, *Game*).
