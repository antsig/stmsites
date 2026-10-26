# Implementation Plan: Implementasi 24 Materi Kurikulum STEM Kemdikbud (Kelas 1–6 SD Lengkap 4 Pilar)

Dokumen ini disusun mengikuti **SOP 5-Fase Wajib Tim Koding Antigravity** untuk menyusun dan menerapkan 24 materi pembelajaran interaktif berbasis laboratorium maya dan platform virtual STEM (Science, Technology, Engineering, Mathematics) untuk seluruh jenjang Kelas 1 hingga Kelas 6 SD sesuai aturan Kurikulum Merdeka Kemdikbud.

---

## 1. Analisis Kebutuhan & Pemetaan Platform Virtual

Pengguna menetapkan 4 pilar platform virtual STEM:
1. **SCIENCE VIRTUAL (Laboratorium Maya)**: PhET Interactive Simulations (listrik, gaya, molekul, ekosistem), LabXchange, NASA Eyes on Solar System, Google Earth.
2. **TECHNOLOGY VIRTUAL (Coding & AI Tanpa Robot)**: Scratch (scratch.mit.edu), Code.org (Course 1 & Minecraft), Tinkercad (3D design di browser), Quick, Draw! by Google (AI tebak gambar).
3. **ENGINEERING VIRTUAL (Merakit di Dunia Maya)**: Bridge Builder Game, Minecraft Education, PhET Simple Machines (katrol, tuas, balancing act), Buoyancy (rakit perahu virtual).
4. **MATHEMATICS VIRTUAL (Matematika Jadi Game)**: Matific, Mathigon Polypad (sempoa, tangram, jam virtual, bangun ruang), GeoGebra Kids, PhET Fractions & Area Builder, Prodigy.

Masing-masing kategori wajib memuat minimal 1 materi untuk setiap jenjang kelas (Kelas 1, 2, 3, 4, 5, 6), sehingga menghasilkan **total 24 materi kurikulum STEM SD**.

---

## 2. Inventaris Berkas (*File Inventory*)

| No | Berkas | Aksi | Deskripsi |
|---|---|---|---|
| 1 | `scripts.html` | Edit | Memperbarui `INITIAL_MATERIALS` dengan 24 data materi lengkap dan memperbarui versi cache `DATA_VERSION = 'v1.5.0'`. |
| 2 | `Code.gs` | Edit | Memperbarui `sampleMaterials` pada fungsi backend `seedInitialData()` agar spreadsheet terisi 24 materi lengkap saat deploy. |
| 3 | `index.html` | Edit | Sinkronisasi `INITIAL_MATERIALS` dan `DATA_VERSION`. |
| 4 | `admin.html` | Edit | Sinkronisasi `INITIAL_MATERIALS` dan `DATA_VERSION`. |
| 5 | `docs/01-proposals/PROPOSAL-PENAWARAN-DAN-RENCANA-PENGEMBANGAN-PORTAL-STEM.md` | Edit | Menambahkan tabel lampiran katalog 24 materi STEM SD Kemdikbud di dokumen proposal. |
| 6 | `CHANGELOG.md` | Edit | Catatan rilis v1.5.0 (24 materi STEM lengkap Kelas 1–6). |
| 7 | `docs/WALKTHROUGH-24-materi-stem-sd.md` | Create | Bukti uji visual dan walkthrough filter materi per kelas. |

---

## 3. Matriks 24 Materi Kurikulum STEM SD Kemdikbud

### 🔬 1. SCIENCE VIRTUAL (Laboratorium Maya)
- **Kelas 1**: *Mengenal Bagian Tubuh & Panca Indra Manusia* (LabXchange 3D Human Anatomy)
- **Kelas 2**: *Petualangan Daur Hidup Hewan & Tumbuhan* (PhET Natural Selection & Lifecycle)
- **Kelas 3**: *Eksplorasi Wujud Zat: Padat, Cair, dan Gas* (PhET States of Matter Basics)
- **Kelas 4**: *Rahasia Fotosintesis: Mengapa Daun Berwarna Hijau?* (PhET Molecules and Light)
- **Kelas 5**: *Mekanisme Sistem Peredaran Darah & Organ Tubuh* (LabXchange Virtual Lab)
- **Kelas 6**: *Menjelajah Tata Surya & Orbit Planet di Antariksa* (NASA Eyes on the Solar System & Google Earth)

### 💻 2. TECHNOLOGY VIRTUAL (Coding & AI Tanpa Robot)
- **Kelas 1**: *Bermain AI Ceria: Mesin Cerdas Penebak Gambar* (Quick, Draw! by Google)
- **Kelas 2**: *Logika Algoritma Labirin: Memandu Robot Melangkah* (Code.org Course 1 / Blockly Maze)
- **Kelas 3**: *Animasi Kartun Perdanaku: Menggerakkan Karakter Kucing* (Scratch MIT)
- **Kelas 4**: *Coding Petualangan Karakter Minecraft* (Code.org Minecraft Hour of Code)
- **Kelas 5**: *Desain Rumah 3D Ramah Lingkungan di Browser* (Tinkercad 3D Design)
- **Kelas 6**: *Merancang Game Edukasi Interaktif Multi-Level* (Scratch Game Studio)

### ⚙️ 3. ENGINEERING VIRTUAL (Merakit di Dunia Maya)
- **Kelas 1**: *Keseimbangan Menara Balok & Ayunan Jungkat-Jungkit* (PhET Balancing Act)
- **Kelas 2**: *Desain Perahu Apung Penjelajah Sungai (Hukum Apung)* (PhET Buoyancy Simulation)
- **Kelas 3**: *Pesawat Sederhana: Mengangkat Beban dengan Katrol & Tuas* (PhET Lever & Simple Machines)
- **Kelas 4**: *Arsitektur Jembatan Rangka Baja Kokoh Penahan Beban* (Bridge Builder / Cargo Bridge Game)
- **Kelas 5**: *Laboratorium Sirkuit Listrik Rumah Pintar Virtual* (PhET Circuit Construction Kit DC)
- **Kelas 6**: *Rancang Bangun Sekolah Impian Ramah Lingkungan* (Minecraft Education Edition / Tinkercad Architecture)

### 📐 4. MATHEMATICS VIRTUAL (Matematika Jadi Game)
- **Kelas 1**: *Petualangan Berhitung Objek & Bentuk Geometri Ceria* (GeoGebra Kids & Matific)
- **Kelas 2**: *Eksplorasi Tangram 2D & Jam Dinding Virtual Menghitung Waktu* (Mathigon Polypad Tangram & Clocks)
- **Kelas 3**: *Pecahan Visual Warna-Warni: Belajar Pecahan dengan Pizza & Cokelat* (PhET Fractions Intro)
- **Kelas 4**: *Merancang Luas & Keliling Taman Sekolah Interaktif* (PhET Area Builder)
- **Kelas 5**: *Tantangan Logika Bilangan & Pecahan Desimal* (Matific & Prodigy Math)
- **Kelas 6**: *Eksplorasi Bangun Ruang 3D & Jaring-Jaring Kubus Virtual* (Mathigon Polypad 3D Solids)

---

## 4. Langkah Kerja
1. Buat rencana implementasi (dokumen ini).
2. Perbarui `scripts.html`, `Code.gs`, `index.html`, dan `admin.html` dengan 24 materi lengkap dan naikkan versi data ke `v1.5.0`.
3. Verifikasi dengan browser subagent pada selektor kelas (Kelas 1 hingga 6) untuk membuktikan semua materi muncul dengan presisi.
4. Perbarui proposal dan changelog ke versi `v1.5.0`.
5. Git commit, tag `v1.5.0`, dan push ke remote repository.
