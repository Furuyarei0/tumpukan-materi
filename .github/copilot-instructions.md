# Tumpukan Materi — Instruksi untuk GitHub Copilot

> Taruh file ini di `.github/copilot-instructions.md`. Baca seluruh isinya sebelum menulis atau mengubah kode apa pun di repo ini.

---

## 1. Ringkasan Proyek

**Nama:** Tumpukan Materi
**Live:** https://tumpukanmaterii.netlify.app/
**Repo:** https://github.com/furuya1037-beep/tumpukan

Tumpukan Materi adalah website untuk satu kelas kuliah. Mahasiswa bisa mengakses materi dari dosen maupun materi buatan mahasiswa sendiri di satu tempat. Tujuannya supaya mahasiswa tidak lagi bertanya materi ke perangkat kelas.

**Target pengguna:** mahasiswa di kelas tersebut (mayoritas membuka dari HP).

**Kondisi awal:** website berfungsi seperti file manager sederhana berisi folder mata kuliah. Mahasiswa menambah materi lewat link Google Drive. Database lama memakai Firebase.

**Tujuan upgrade:** desain baru yang tidak terlihat seperti template AI generik, pencarian ke semua materi, upload file langsung (tanpa link Google Drive), kiriman materi dari mahasiswa dengan persetujuan admin, preview PDF, papan informasi tugas, dan jadwal kuliah.

**Siapa yang login:** hanya **admin**. Mahasiswa **tidak perlu login** untuk membuka materi maupun mengirim materi.

---

## 2. Tech Stack (wajib diikuti)

| Bagian | Pilihan |
|---|---|
| Styling | **Tailwind CSS** (tanpa CSS framework lain) |
| Database | **Supabase** (Postgres), menggantikan Firebase |
| Auth | Supabase Auth (khusus admin) |
| File storage | Supabase Storage |
| Hosting | Netlify |
| Frontend | Vite + React (JavaScript). Jika repo lama masih HTML/JS biasa, migrasikan bertahap dan beri tahu pemilik repo dulu. |
| Animasi | Framer Motion (hero, transisi, swipe card) |
| Ikon | lucide-react |
| Notifikasi email | Resend (via Supabase Edge Function) |
| Preview PDF | `pdfjs-dist` (pdf.js), **dimuat lazy** hanya saat preview dibuka (`import()` dinamis) |

Jangan menambah library baru tanpa menjelaskan alasannya. Jangan menyimpan secret di kode. Semua key lewat environment variable (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). Jangan pernah memakai `service_role` key di frontend.

---

## 3. Alur Kerja AI (WAJIB, urutan tidak boleh dilompati)

1. **Design dulu.** Buat desain/mockup halaman terlebih dahulu. **Berhenti dan minta persetujuan pengguna.** Jangan lanjut ke kode sebelum ada approval eksplisit.
2. **Code logic.** Setelah design disetujui, implementasikan UI dan logika frontend sesuai desain tersebut.
3. **Backend.** Lanjut ke Supabase: tabel, RLS policy, storage bucket, auth admin.
4. **Testing.** Perkirakan skenario yang mungkin terjadi lalu uji, supaya tidak ada error (lihat bagian 9).
5. **Preview + laporan.** Berikan preview ke pengguna dan tulis apa yang dikerjakan ke file `docs/AI-LOG.md` (lihat bagian 10).

Aturan tambahan:
- Kerjakan satu fitur per langkah. Jangan mengubah banyak hal sekaligus.
- Jika ada yang ambigu, **tanya dulu**, jangan menebak.
- Jangan menghapus atau menulis ulang fitur yang sudah jalan tanpa diminta.

---

## 4. User Flow

1. User membuka website.
2. Website menampilkan dashboard (hero section).
3. User scroll, atau klik salah satu dari **dua tombol di hero**: **"Lihat papan tugas"** (menuju papan tugas + jadwal) atau **"Cari materi"** (menuju deck folder mata kuliah).
4. User melihat tumpukan kartu folder mata kuliah.
5. User klik kartu, kartu membesar menjadi tampilan folder.
   - a. Jika bukan mata kuliah yang dicari, user kembali.
   - b. Jika benar, user klik materi yang dicari.
6. User klik materi. Jika PDF, tampil **preview langsung di website** (ada tombol unduh). Jika bukan PDF (DOCX, PPTX, dll.), langsung diunduh.

Alur sampingan: user bisa **mencari materi dari semua mata kuliah** lewat search bar, **mengirim materi** lewat tombol "Kirim materi" (tanpa login), atau **meminta materi** lewat tombol yang membuka WhatsApp pemilik website.

Setiap perubahan harus menjaga alur ini tetap singkat dan jelas.

---

## 5. Fitur

### Sudah ada
- Folder mata kuliah.

### Dihapus
- Input **link Google Drive**. Tidak ada lagi form, kolom database, maupun opsi link Drive. Semua materi adalah **file yang diupload**.

### Yang harus dibuat

1. **Pencarian ke semua materi**
   - Satu search bar di atas deck card mencari **nama mata kuliah** dan **judul materi** dari semua mata kuliah.
   - Hasil dikelompokkan: "Mata kuliah" dan "Materi" (setiap materi menampilkan nama mata kuliahnya). Klik hasil materi membuka folder mata kuliah tersebut dan langsung membuka materinya.
   - Hanya mencari materi berstatus `approved`.
   - Real-time dengan **debounce** (sekitar 250 ms), case-insensitive, abaikan spasi berlebih, batasi jumlah hasil (mis. 20), dan tampilkan state "tidak ditemukan" yang ramah, disertai tombol "Minta materi" ke WhatsApp.

2. **Upload file langsung**
   - Hanya upload file ke Supabase Storage. Tipe yang diizinkan: PDF, DOCX, PPTX, XLSX, gambar (JPG/PNG/WebP), ZIP.
   - Validasi tipe dan ukuran di sisi klien **dan** di konfigurasi bucket. Tampilkan progress upload dan pesan error yang jelas.

3. **Mahasiswa mengirim materi, admin menyetujui (tanpa login)**
   - Tombol "Kirim materi" membuka form: mata kuliah (pilihan), judul materi, nama pengirim (opsional), dan file.
   - Kiriman masuk dengan status `pending` dan **tidak tampil ke publik** sampai admin menyetujui.
   - Setelah kirim, tampilkan pesan: "Terima kasih! Materimu menunggu persetujuan admin."
   - Panel admin memiliki **antrean persetujuan**: lihat preview file, lalu **Setujui** atau **Tolak** (tolak = hapus baris dan filenya).
   - **Notifikasi email ke admin:** setiap ada kiriman baru, admin menerima email berisi judul materi, mata kuliah, nama pengirim (jika ada), dan link ke panel admin. Detail di bagian 8 ("Notifikasi email").
   - Panel admin juga menampilkan badge jumlah kiriman yang menunggu, sebagai cadangan jika email terlewat.
   - Anti-spam: field honeypot tersembunyi, batas ukuran/tipe file, dan jeda antar kiriman di sisi klien. Jika spam masih muncul, tambahkan Cloudflare Turnstile (gratis) dengan verifikasi lewat Supabase Edge Function. Tanyakan dulu kepada pemilik repo sebelum menambahkannya.

4. **Admin**
   - Hanya admin yang bisa login (Supabase Auth, email + password).
   - Admin bisa: menambah/menghapus mata kuliah, upload materi (langsung `approved`), menyetujui/menolak kiriman, menghapus materi, mengelola mading, dan mengelola jadwal kuliah.

5. **Preview PDF langsung di website**
   - Klik materi PDF membuka viewer di dalam website (panel/modal), dengan tombol unduh dan tombol tutup.
   - Pakai pdf.js yang **dimuat lazy**, jangan masuk ke bundle awal. Render halaman secara bertahap (hanya halaman yang terlihat) agar tidak berat di HP.
   - Tampilkan skeleton saat memuat, dan pesan error + tombol unduh jika PDF gagal dibuka.
   - Untuk file non-PDF tidak ada preview, langsung unduh.

6. **Mading informasi**: papan yang menampilkan tugas, deadline, dan cara pengumpulan (lihat bagian 6 untuk tampilan).

7. **Jadwal kuliah**
   - Digabung dalam **satu section dengan mading** (kolom di samping papan tugas), bukan section terpisah di bawah.
   - Menampilkan jadwal **hari ini** (mata kuliah, jam, ruangan) dan kuliah berikutnya. Jika hari ini kosong, tampilkan kuliah berikutnya.
   - Gunakan zona waktu **Asia/Jakarta (WIB)** untuk menentukan "hari ini".
   - Ada tombol untuk melihat jadwal satu minggu penuh.
   - **Admin bisa menambah, mengubah, dan menghapus jadwal.** Dua jenis perubahan:
     1. **Ubah jadwal mingguan (permanen):** ubah hari, jam mulai, jam selesai, ruangan, dan (opsional) masa berlaku "mulai/sampai" tanggal. Berlaku setiap minggu.
     2. **Perubahan sekali saja untuk tanggal tertentu** (tanpa mengubah jadwal mingguan): admin memilih jadwal dan tanggalnya, lalu memilih **Batalkan**, **Pindahkan** (tanggal baru, jam baru, ruangan baru; yang kosong memakai nilai lama), atau **Tambah kuliah pengganti/tambahan** pada tanggal tertentu. Ada kolom catatan singkat (mis. "dosen berhalangan").
   - Tampilan jadwal menggabungkan jadwal mingguan dengan perubahan untuk tanggal terkait, menggunakan tanggal WIB. Kuliah dibatalkan tampil dicoret dengan label "Dibatalkan" (+ catatan), kuliah dipindah tampil di tanggal/jam barunya dengan label "Pindah dari [tanggal asal]", dan kuliah tambahan berlabel "Tambahan".
   - Form ubah jadwal memvalidasi: jam selesai harus setelah jam mulai, tanggal baru tidak boleh kosong untuk pemindahan, dan tidak boleh ada dua perubahan untuk jadwal dan tanggal asli yang sama.

8. **Minta materi lewat WhatsApp**
   - Tombol/link "Minta materi" membuka WhatsApp pemilik website: `https://wa.me/qr/R7PIDTBT7PT2P1`.
   - Simpan link di satu tempat saja, yaitu `src/lib/config.js` (mis. `WHATSAPP_URL`). Jangan hardcode di banyak komponen.
   - Buka di tab baru dengan `rel="noopener noreferrer"`.
   - Tidak ada form atau database untuk permintaan materi.

### Aturan akses ringkas
| Pihak | Boleh |
|---|---|
| Mahasiswa (tanpa login) | Melihat mata kuliah, materi `approved`, mading, jadwal; mencari; mengirim materi (jadi `pending`) |
| Admin (login) | Semua hal di atas + setujui/tolak, upload langsung, tambah/hapus mata kuliah, mading, jadwal, hapus materi |

### Alur Admin

**Setup (satu kali, dikerjakan pemilik di dashboard Supabase, bukan oleh Copilot)**
- Akun admin dibuat manual lewat Authentication > Add user, lalu `user_id`-nya dimasukkan ke tabel `admins`.
- Pendaftaran pengguna publik dimatikan. **Tidak ada halaman daftar** di website.
- **Kode tidak boleh memakai** `signUp`, `signInWithOtp` (magic link), atau login OAuth (Google/GitHub). Satu-satunya cara masuk adalah `signInWithPassword` untuk akun yang dibuat pemilik. Siapa yang boleh jadi admin ditentukan hanya oleh isi tabel `admins`, yang diatur pemilik di dashboard Supabase.

**Login**
- Halaman admin berada di `#admin` dan **tidak ditautkan** dari halaman publik.
- Form email + password. Pesan error dibuat umum (tidak membocorkan apakah email terdaftar).
- Setelah login, cek apakah user ada di tabel `admins` (lewat fungsi `is_admin()`). Jika bukan admin, langsung logout dan tampilkan pesan umum.
- Sesi tersimpan di perangkat. Ada tombol "Keluar". Lupa password memakai fitur reset email Supabase.

**Dashboard admin** (`#admin`)
- Ringkasan: jumlah **kiriman menunggu** (paling menonjol), tugas dengan deadline dekat, dan pintasan.
- Menu: **Kiriman masuk**, **Materi**, **Mata kuliah**, **Mading (tugas)**, **Jadwal**.

**Mode admin di halaman publik**
- Saat admin login, tombol "Tambah / Ubah / Hapus" muncul di tempatnya masing-masing (papan tugas, jadwal, deck, folder), ditambah penanda "Mode admin", link ke dashboard, dan tombol "Keluar". Pengunjung biasa tidak melihat satu pun dari ini.

**Alur yang paling sering: menyetujui kiriman**
1. Email notifikasi masuk, admin klik link ke `#admin/kiriman` (login dulu jika belum).
2. Daftar kiriman: judul, mata kuliah, nama pengirim, waktu kirim.
3. Klik satu kiriman membuka preview file (PDF langsung tampil, file lain berupa info + unduh).
4. Admin boleh merapikan **judul** dan memperbaiki **mata kuliah** sebelum menyetujui.
5. **Setujui:** file pindah ke bucket publik, status `approved`, langsung tampil di folder. **Tolak:** konfirmasi dulu, lalu file dan baris dihapus.
6. Badge jumlah kiriman menunggu berkurang.

**Alur lain**
- **Upload materi sendiri:** pilih mata kuliah, isi judul, pilih file, upload. Langsung `approved`.
- **Tugas (mading):** form berisi judul, mata kuliah (opsional), deadline tanggal + jam WIB (opsional), cara pengumpulan, keterangan (opsional). Tugas yang lewat otomatis berlabel "Lewat" dan ada tombol untuk membersihkan tugas lama.
- **Mata kuliah:** tambah, ubah (nama, dosen, SKS, urutan, warna), hapus.
- **Jadwal:** ubah jadwal mingguan dan perubahan sekali saja (lihat fitur Jadwal kuliah di atas).
- **Hapus apa pun:** selalu ada dialog konfirmasi yang menyebut nama item. Menghapus mata kuliah menyebut jumlah materi yang ikut terhapus.

**Keamanan:** sembunyi/tampil tombol di UI hanya soal tampilan. Yang menjaga data adalah RLS dan policy Storage di Supabase.

**Tahap pengerjaan:** tahap 2c membuat seluruh UI admin dengan adapter fixture dan peran admin simulasi (hanya development, mis. `VITE_DEV_ROLE=admin`, tidak ikut build produksi). Auth dan penyimpanan sungguhan dihubungkan di tahap 3.

---

## 6. Konsep UI (jangan terlihat seperti "AI slop")

**Aturan tata letak halaman utama**
- Halaman terdiri dari 3 section: hero, board tugas + jadwal, dan deck mata kuliah.
- **Setiap section memenuhi satu layar penuh** (`min-height: 100svh`, pakai `svh` agar tidak terpotong bar browser HP), **baik datanya banyak, sedikit, maupun kosong**. Isi dipusatkan secara vertikal. Jika isi lebih tinggi dari layar, section memanjang, **isi tidak boleh terpotong** (jangan pakai `overflow: hidden` pada section atau tinggi tetap).
- Boleh memakai `scroll-snap-type: y proximity` (bukan `mandatory`) agar scroll tetap nyaman.
- **Setiap section punya latar penuh sendiri** (bukan hanya warna rata dan bukan hanya bingkai kecil di tengah), dengan dekorasi ringan dari CSS/SVG. Jangan ada kesan "tidak ada background".
- Setiap bagian harus punya **tampilan kosong (empty state)** yang dirancang, bukan area putih kosong.

Struktur halaman utama: satu halaman dengan **3 section** dari atas ke bawah.

**Aturan layout semua section**
- Setiap section **memenuhi tinggi layar**: `min-height: 100svh` (dengan fallback `100vh`). Gunakan `min-height`, bukan `height`, sehingga jika isinya lebih tinggi section ikut memanjang. **Tidak boleh ada konten yang terpotong atau tersembunyi** (hindari `overflow: hidden` pada section).
- Aturan itu berlaku **baik saat isinya ada maupun kosong**: section kosong tetap setinggi layar dan terlihat utuh.
- Setiap section punya **latar sendiri yang penuh lebar (full-bleed)**, bukan kotak kecil di atas latar polos. Halaman tidak boleh terasa seperti blok-blok flat di atas satu warna.
- Isi section dipusatkan secara vertikal, dengan lebar konten maksimum yang nyaman (mis. 1200px) di desktop.
- Pindah antar section dengan scroll halus. Boleh memakai `scroll-snap-type: y proximity` (jangan `mandatory`, supaya konten yang panjang tetap bisa di-scroll). Beri `scroll-margin-top` agar tidak tertutup navbar.
- **Navbar sticky di semua section** (strip kertas), bukan hanya di hero, sehingga pengguna selalu bisa kembali ke beranda.
  - **Logo selalu menjadi link ke beranda** (`#home`).
  - **Di hero:** hanya logo dan tombol "Kirim materi". Jangan menampilkan link "Papan kelas" atau "Materi" di sini karena sudah ada dua tombol hero yang menuju tempat yang sama. Satu tujuan = satu tombol di satu area, tidak diulang.
  - **Setelah keluar dari hero:** navbar menampilkan tambahan link "Beranda", "Papan kelas", dan "Materi" dengan penanda section yang sedang aktif, serta tombol "Kirim materi".
  - **Mobile:** bar ringkas berisi logo, tombol ikon rumah (Beranda), dan tombol "Kirim materi". Link section lain bisa lewat menu kecil.
- **Logo** harus menyatu dengan latar, tidak terlihat "ditempel" atau tertimpa. Pakai logo asli apa adanya, beri ruang kosong di sekelilingnya (minimal setengah tinggi logo), dan jangan membungkusnya dengan kotak berborder. Jika latar kurang cocok untuk logo, ubah latar di belakang logo (mis. strip kertas navbar), jangan mengubah logonya.
- **Teks hanya yang berfungsi.** Jangan menambah slogan, kutipan motivasi, atau teks pengisi dekoratif (mis. "minggu baru, semangat baru"). Catatan desain/anotasi gerak tidak boleh tampil di dalam desain; taruh di `docs/AI-LOG.md` atau panel catatan terpisah.

1. **Hero section** (latar: alas meja hangat, penuh layar) dengan beberapa animasi (misalnya tumpukan kertas/kartu yang bergerak, teks yang muncul bertahap, elemen yang mengikuti scroll atau kursor). Animasi harus punya makna dan tidak berlebihan. Ada **dua tombol**:
   - **"Lihat papan tugas"**: scroll halus ke section 2.
   - **"Cari materi"**: scroll halus ke section 3.
2. **Papan kelas = tugas + jadwal dalam satu section** (latar: alas hijau bergaris grid yang **memenuhi seluruh section**, bukan kotak berbingkai kecil).
   - **Desktop:** dua kolom. Kolom kiri (sekitar 65%) berisi **papan tugas** berupa catatan tempel (judul, mata kuliah, chip deadline, cara pengumpulan, urut deadline terdekat). Kolom kanan (sekitar 35%) berisi **jadwal** dalam satu lembar kertas yang ditempel, dengan tab "Hari ini" dan "Minggu ini".
   - **Mobile:** tetap satu section, dengan tab "Tugas" dan "Jadwal" agar section tidak terlalu panjang. Jadwal **tidak boleh disembunyikan** di mobile.
   - Jadwal minggu penuh dibuka sebagai tab atau panel dari section ini, bukan section terpisah.
3. **Deck card** mata kuliah, dengan **search bar di atasnya**.
   - **Posisi di tengah.** Search bar dan tumpukan kartu berada di **tengah section** (satu kolom terpusat), bukan di kolom kiri atau kanan. **Tidak ada panel "folder terbuka" statis di samping deck.** Folder hanya muncul sebagai overlay saat kartu diklik.
   - Kartu depan besar di tengah. Kartu sebelum dan sesudahnya **mengintip di kedua sisi** (lebih kecil, lebih redup, sedikit miring) karena swipe bisa ke dua arah. Tampilkan indikator posisi (mis. "2 / 6") dan tombol panah kiri/kanan di desktop.
   - Kartu depan bisa di-drag/di-swipe, dan kartu yang diklik membesar dari posisi tengah itu.
   - Kartu bertumpuk dan bisa **di-swipe kiri/kanan**.
   - **Desktop:** drag dengan mouse, plus tombol panah dan dukungan keyboard (← →).
   - **Mobile:** swipe dengan sentuhan.
   - Tampilkan **instruksi singkat** cara swipe di desktop maupun mobile (misalnya hint animasi di kartu pertama yang hilang setelah user pertama kali berinteraksi). Teks hint menyesuaikan perangkat.
   - Klik kartu untuk masuk ke folder: **kartu membesar** (lihat "Kartu membesar saat diklik" di bawah).

**Kartu membesar saat diklik**
- Saat kartu depan diklik/di-tap, kartu itu **membesar mulus dari posisinya** sampai menjadi tampilan folder (shared element transition, pakai `layoutId` Framer Motion). Kartu tidak pindah halaman secara mendadak.
- Isi kartu yang membesar: judul mata kuliah (tetap di posisi yang sama, hanya membesar), daftar materi di bawahnya, dan tombol tutup.
- Ukuran: **mobile** memenuhi layar (full-screen), **desktop** menjadi panel besar di tengah dengan latar redup di belakangnya (bukan penuh layar).
- Daftar materi muncul bertahap (stagger) setelah kartu selesai membesar. Tampilkan skeleton saat data masih dimuat.
- Cara menutup: tombol "Kembali"/X, tombol `Esc`, klik area redup di luar panel (desktop), dan tombol back browser. Kartu mengecil kembali ke posisi semula di deck.
- Sinkronkan dengan URL (mis. `/matkul/:id`) supaya link folder bisa dibagikan dan tombol back berfungsi. Jika dibuka langsung lewat link, tampilkan kartu dalam keadaan sudah membesar.
- Bedakan **drag** dan **klik**: kartu yang baru saja di-swipe tidak boleh ikut terbuka. Gunakan ambang jarak drag (mis. di bawah 5px baru dihitung klik).
- Saat kartu terbuka: swipe deck dinonaktifkan, scroll halaman di belakang dikunci, fokus keyboard dikunci di dalam panel (focus trap), dan fokus dikembalikan ke kartu saat ditutup.
- Hormati `prefers-reduced-motion`: ganti animasi membesar dengan fade sederhana.
- Hanya kartu paling depan yang bisa diklik. Kartu yang mengintip di belakang tidak.

### Detail tugas (overlay)

- Klik/tap catatan tugas di papan: catatan **membesar dari posisinya** menjadi lembar detail (mekanisme yang sama dengan kartu mata kuliah), di atas latar redup.
- Isi detail:
  - Judul tugas (besar) dan chip mata kuliah (klik membuka folder mata kuliah itu).
  - **Deadline lengkap** dengan hari, tanggal, jam, dan "WIB" (mis. "Rabu, 5 Nov 2026, 23.59 WIB") serta chip sisa waktu ("2 hari lagi", "Hari ini", "Lewat").
  - **Deskripsi tugas** (teks panjang, mendukung baris baru).
  - **Cara pengumpulan** dengan label tersendiri.
  - Tanggal tugas dibuat/diperbarui.
- Admin melihat tombol "Ubah" dan "Hapus" (dengan dialog konfirmasi). Pengunjung hanya melihat isi.
- Cara menutup sama dengan folder: tombol X, `Esc`, klik area redup, dan tombol back browser. URL disinkronkan (mis. `/tugas/:id`) agar link tugas bisa dibagikan dan bisa dibuka langsung.
- Konten panjang di-scroll **di dalam** overlay. Scroll halaman di belakang dikunci, fokus keyboard dikunci di dalam overlay (focus trap), dan fokus kembali ke catatan saat ditutup.
- Deskripsi kosong menampilkan "Tidak ada keterangan tambahan." Render deskripsi sebagai **teks biasa** (bukan HTML) untuk mencegah XSS. Jika link otomatis dibuat, pakai `rel="noopener noreferrer"`.
- Catatan di papan hanya menampilkan ringkasan (judul, mata kuliah, chip deadline), dengan teks dipotong rapi (ellipsis).
- Hormati `prefers-reduced-motion`.

### Aset grafis

- Properti dekoratif (binder clip, paperclip, tape, pensil, pin, tepi sobek) memakai **aset gambar/SVG siap pakai** dari `docs/design/assets/`, disalin ke `src/assets/props/`. **Jangan menggambar properti rumit dengan CSS atau SVG tulisan tangan**, karena hasilnya terlihat kasar.
- Jika aset yang dibutuhkan belum ada, pakai placeholder sederhana dan catat di `docs/AI-LOG.md` aset apa yang masih dibutuhkan. Jangan mengarang aset sendiri.
- Bayangan **tidak** ditanam di dalam aset. Bayangan dibuat dengan CSS (sistem elevasi) agar konsisten.
- Tepi sobek mengikuti panduan "Tepi sobek yang meyakinkan" di `docs/design/README.md`. Dilarang memakai `clip-path` zigzag yang teratur.

### Data kosong (empty state), tanpa data contoh

Pemilik website akan mengisi semua konten sendiri. Karena itu:
- **Jangan menyertakan data contoh/dummy** (data karangan) di kode produksi atau komponen. Data contoh hanya boleh ada di file mockup. **Data asli kelas ada di `docs/data-kelas.md`** (mata kuliah, dosen, SKS, jadwal) dan boleh dipakai untuk fixture pengembangan. Folder `supabase/` di repo sengaja dikosongkan karena SQL dijalankan manual oleh pemilik di dashboard Supabase, jadi jangan mengandalkan `seed.sql`. Selain data itu, tabel dibiarkan kosong dan UI harus tetap benar saat kosong.
- Setiap bagian wajib punya **tampilan kosong yang dirancang dengan baik** (tetap setinggi section dan tidak terlihat rusak):
  - Papan tugas kosong: satu catatan tempel kosong bergaris putus dengan teks ramah (mis. "Belum ada tugas."). Jika admin yang login, tampilkan tombol "Tambah tugas".
  - Jadwal kosong: lembar jadwal kosong dengan teks "Jadwal belum diisi." + tombol "Tambah jadwal" untuk admin.
  - Deck kosong: satu kartu kosong "Belum ada mata kuliah" + tombol "Tambah mata kuliah" untuk admin. Search bar dan hint swipe disembunyikan atau dinonaktifkan.
  - Folder mata kuliah kosong: "Belum ada materi di sini." + ajakan "Kirim materi".
  - Pencarian tanpa hasil: pesan ramah + tombol "Minta materi" ke WhatsApp.
- Pengunjung biasa melihat pesan ramah saja. Tombol "Tambah ..." hanya muncul untuk admin yang sedang login.
- **Urutan pengerjaan backend:** karena pemilik mengisi konten sendiri, selesaikan dulu **login admin + CRUD** (mata kuliah, tugas, jadwal, upload materi) sebelum fitur lain, supaya konten bisa mulai diisi lebih awal.

### Wajib: baca referensi desain dulu
Sebelum mengerjakan atau merevisi desain, baca `docs/design/README.md` dan ikuti arahannya. Gambar yang dilampirkan di chat menjadi acuan utama. File mockup sebelumnya disimpan di `docs/design/` (mis. `mockup-v1.html`); revisi disimpan sebagai versi baru (`mockup-v2.html`), jangan menimpa versi lama.

### Referensi desain yang dipilih pengguna

Simpan screenshot referensi di `docs/design/` (misalnya `ref-board.png` dan `ref-deck.png`) dan jadikan acuan.

**Board tugas, acuan: dashboard bergaya cozy/nature (krem + hijau hutan)**
- Kartu krem dengan sudut membulat besar, border tipis, bayangan lembut.
- Header kartu berisi ikon daun/kecil + judul, dengan link "Lihat semua" di kanan.
- Papan kayu kecil untuk nama website di area atas/hero.
- Berbeda dari acuan: tugas **tidak memakai progress bar**. Tiap tugas menampilkan judul, mata kuliah, **chip sisa waktu** (mis. "2 hari lagi", "Hari ini", "Lewat") dan cara pengumpulan. Urutkan dari deadline terdekat.
- Cukup **satu board tugas**, bukan banyak widget seperti dashboard acuan.

**Deck card, acuan: card stack bergaya "Discover"**
- Kartu depan besar **di tengah**, kartu tetangga mengintip di kiri dan kanan (skala lebih kecil, lebih redup, sedikit miring).
- Judul besar tebal di bagian bawah kartu depan.
- Swipe/drag kiri-kanan, kartu belakang naik saat kartu depan dibuang.
- Karena tidak ada foto, tiap kartu mata kuliah berisi: warna/ilustrasi sederhana, nama mata kuliah (besar), nama dosen, jumlah SKS, jumlah materi, dan tanggal update terakhir. Data asli **tidak punya kode mata kuliah**, jadi jangan membuat kode karangan; kolom `code` boleh kosong dan disembunyikan di UI jika kosong.
- Search bar di atas deck.

**Penyelarasan tema:** pakai mekanik card stack di atas dengan palet dan nuansa hangat dari acuan board. Jangan memakai biru neon atau latar putih polos dari acuan deck. Usulan awal design token (boleh disesuaikan setelah approval desain):
- `cream` `#F3EBD8` (latar), `paper` `#FBF6E9` (kartu), `forest` `#3F5B3A` (aksen utama), `leaf` `#6E8B4E`, `wood` `#8A6A43`, `ink` `#2B2A24` (teks).

**Hak cipta:** acuan board memakai karakter dan elemen dari game Animal Crossing. **Jangan memakai karakter, logo, atau aset aslinya.** Ambil hanya gayanya (palet, bentuk kartu, nuansa). Buat ilustrasi/maskot orisinal.

Aturan anti-generik:
- Jangan pakai gradient ungu-biru default, kartu putih seragam dengan bayangan standar, atau emoji sebagai ikon utama.
- **Hindari kesan flat:** ikuti bagian "Sistem kedalaman" di `docs/design/README.md` (bayangan berlapis, cahaya satu arah, vignette, tekstur terlihat, objek SVG bergradient). Jangan memakai bayangan offset keras + border hitam seragam sebagai satu-satunya bayangan, dan jangan memakai `font-family: cursive`.
- Tentukan **satu tema visual** (palet warna, font, radius, gaya ilustrasi) dan pakai konsisten. Simpan di `tailwind.config.js` sebagai design token.
- Pilih 2 font maksimal (satu untuk judul yang punya karakter, satu untuk teks).
- Pakai tema visual dari referensi desain yang diberikan pengguna.
- Wajib responsif (mobile-first), kontras teks cukup, dan hormati `prefers-reduced-motion`.

---

## 7. Struktur Folder

```
tumpukan/
├── .github/
│   └── copilot-instructions.md
├── docs/
│   ├── AI-LOG.md              # catatan pekerjaan AI
│   └── design/                # mockup & referensi desain yang disetujui
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── hero/              # Hero, animasi
│   │   ├── board/             # Mading: TaskBoard, TaskCard
│   │   ├── deck/              # CourseDeck, CourseCard, SwipeHint, SearchBar
│   │   ├── materials/         # MaterialList, MaterialItem, FolderView
│   │   ├── viewer/            # PdfViewer (lazy-loaded)
│   │   ├── submit/            # SubmitMaterialForm
│   │   ├── schedule/          # ScheduleCard, WeekSchedule
│   │   ├── admin/             # AdminLogin, UploadForm, ApprovalQueue, ScheduleEditor, DeleteConfirm
│   │   └── ui/                # Button, Modal, Toast, Skeleton, dst.
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── CoursePage.jsx
│   │   └── Admin.jsx
│   ├── hooks/                 # useCourses, useMaterials, useAnnouncements, useAuth
│   ├── lib/
│   │   ├── supabase.js        # satu-satunya tempat membuat client Supabase
│   │   ├── config.js          # konstanta (WHATSAPP_URL, batas ukuran file, dll.)
│   │   └── utils.js
│   ├── services/              # fungsi akses data (courses, materials, announcements, schedules, submissions, search, storage)
│   ├── styles/
│   │   └── index.css          # direktif Tailwind
│   ├── App.jsx
│   └── main.jsx
├── supabase/
│   ├── functions/
│   │   └── notify-submission/ # Edge Function kirim email ke admin
│   └── migrations/            # opsional; saat ini kosong (SQL dijalankan manual di dashboard Supabase)
├── .env.example
├── tailwind.config.js
├── vite.config.js
├── netlify.toml
└── package.json
```

Aturan struktur:
- Komponen UI tidak boleh memanggil Supabase langsung. Lewat `services/` dan `hooks/`.
- Satu komponen satu file, nama file PascalCase. Hook diawali `use`.
- Jangan membuat komponen lebih dari sekitar 200 baris. Pecah jika lebih.

---

## 8. Database (Supabase)

Usulan skema (sesuaikan jika perlu, dan jelaskan perubahannya):

```sql
-- Mata kuliah (folder)
create table courses (
  id uuid primary key default gen_random_uuid(),
  code text,                -- boleh kosong
  name text not null,
  lecturer text,
  credits smallint,         -- SKS
  semester text,
  class_name text,          -- mis. 'A'
  color text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Materi (selalu berupa file, tidak ada link Drive)
create table materials (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  title text not null,
  file_path text not null,        -- path di Storage
  file_name text not null,
  file_size bigint,
  mime_type text,
  status text not null default 'pending' check (status in ('pending','approved')),
  submitted_by text,              -- nama pengirim (opsional)
  created_at timestamptz default now(),
  approved_at timestamptz
);

-- Mading
create table announcements (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete set null,
  title text not null,
  description text,
  deadline timestamptz,
  submission_method text,
  created_at timestamptz default now()
);

-- Jadwal kuliah
create table schedules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 1 and 7), -- 1 = Senin
  start_time time not null,
  end_time time not null,
  room text,
  created_at timestamptz default now()
);

-- Masa berlaku jadwal mingguan (kolom tambahan di schedules, lihat migrasi 002)
--   starts_on date, ends_on date   (kosong = berlaku terus)

-- Perubahan jadwal untuk tanggal tertentu (migrasi 002)
create table schedule_changes (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('cancelled','rescheduled','extra')),
  course_id uuid not null references courses(id) on delete cascade,
  schedule_id uuid references schedules(id) on delete cascade,
  original_date date,   -- tanggal kuliah normal yang dibatalkan/dipindah
  new_date date,        -- tanggal baru (pindah) atau tanggal kuliah tambahan
  start_time time,
  end_time time,
  room text,
  note text,
  created_at timestamptz default now()
);

-- Admin
create table admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
```

**RLS wajib aktif di semua tabel:**
- `courses`, `announcements`, `schedules`, `schedule_changes`: `select` terbuka untuk semua; `insert/update/delete` hanya admin (`auth.uid()` ada di tabel `admins`).
- `materials`:
  - `select` publik **hanya** untuk `status = 'approved'`. Admin boleh melihat semua, termasuk `pending`.
  - `insert` oleh pengunjung (anon) **hanya** jika `status = 'pending'` (`with check`).
  - `update` (menyetujui) dan `delete` hanya admin.

**Storage, dua bucket:**
- `submissions` (private): pengunjung hanya boleh **upload** (insert), tidak boleh membaca atau menghapus. Admin boleh membaca (lewat signed URL untuk preview) dan menghapus. Atur `file_size_limit` dan `allowed_mime_types` di bucket.
- `materials` (public read): hanya admin yang boleh menulis/menghapus.
- Alur **Setujui**: pindahkan file dari `submissions` ke `materials` (pakai fitur move antar bucket jika didukung, jika tidak, download lalu upload ulang), perbarui `file_path`, set `status = 'approved'` dan `approved_at`. Alur **Tolak**: hapus file di `submissions` dan baris di `materials`. Pastikan tidak ada baris yang menunjuk ke file yang sudah hilang.
- Upload dari admin langsung ke bucket `materials` dengan `status = 'approved'`.

Catatan: pengecekan admin di frontend hanya untuk tampilan. Keamanan sebenarnya harus di RLS dan policy Storage.

**Notifikasi email:**
- Alur: Database Webhook Supabase pada `INSERT` di tabel `materials` (hanya baris dengan `status = 'pending'`) memanggil Edge Function `notify-submission`, lalu fungsi itu mengirim email lewat Resend.
- Email tujuan adalah email admin (Gmail milik pemilik website). **Alamatnya sengaja tidak ditulis di file ini.** Jangan menulis alamat email admin di kode atau file apa pun di repo (repo bersifat publik). Pemilik akan mengisinya sendiri sebagai secret Supabase `ADMIN_NOTIFY_EMAIL`; Copilot hanya membaca nilainya dari environment. API key Resend juga disimpan sebagai secret (`RESEND_API_KEY`), tidak pernah di frontend atau di Git.
- Pengirim: gunakan alamat default Resend (`onboarding@resend.dev`) selama belum punya domain sendiri. Alamat ini hanya bisa mengirim ke email pemilik akun Resend, jadi **akun Resend harus didaftarkan dengan email yang sama dengan email admin**.
- Isi email: judul materi, nama mata kuliah, nama pengirim, waktu kirim, dan link ke panel admin (`/admin`). Jangan melampirkan file di email.
- Batasi frekuensi: jika ada banyak kiriman dalam waktu singkat (mis. dalam 10 menit), kirim satu email ringkasan ("ada N kiriman baru") agar kotak masuk admin tidak banjir saat terjadi spam.
- **Kegagalan email tidak boleh membuat kiriman mahasiswa gagal.** Jika email gagal terkirim, catat error di log fungsi dan biarkan kiriman tetap tersimpan sebagai `pending`.
- Escape/bersihkan semua teks dari pengunjung (judul, nama) sebelum dimasukkan ke isi email, untuk mencegah injeksi HTML.

**Kebersihan data:** kiriman `pending` yang tidak diproses terlalu lama memakan storage. Usulkan pembersihan otomatis (mis. hapus `pending` yang lebih dari 30 hari), dan tanyakan dulu kepada pemilik repo sebelum mengaktifkannya.

**Batas gratis Supabase:** ukuran file per upload dan total storage terbatas. Validasi ukuran dan tipe sebelum upload, dan tampilkan pesan error yang jelas.

**Pencarian:** gunakan query `ilike` pada `title` untuk awal (dengan index `pg_trgm` bila data sudah banyak). Jangan mengambil semua materi ke klien lalu memfilternya.

**Migrasi Firebase:** data lama (terutama materi berupa link Google Drive) **tidak ikut dimigrasikan otomatis** karena sistem baru hanya memakai file. Tanyakan dulu kepada pemilik repo: mata kuliah dari Firebase boleh dipindahkan, sedangkan materi lama perlu diupload ulang sebagai file. Jangan menghapus konfigurasi Firebase sebelum semuanya selesai dan disetujui.

---

## 9. Testing (wajib sebelum selesai)

Uji skenario berikut dan catat hasilnya di `docs/AI-LOG.md`:

**Umum**
- Halaman dibuka di mobile (360px), tablet, dan desktop.
- Koneksi lambat atau gagal: tampil loading skeleton dan pesan error, bukan layar kosong.
- Data kosong (belum ada mata kuliah, materi, tugas, atau jadwal).

**Pencarian**
- Kata kunci kosong, huruf besar/kecil, spasi berlebih, karakter khusus, tidak ada hasil.
- Mengetik cepat (debounce bekerja, tidak ada hasil lama yang menimpa hasil baru).
- Materi `pending` **tidak boleh** muncul di hasil.

**Layout section dan data kosong**
- Tiap section memenuhi tinggi layar di mobile (360x640 dan 390x844), tablet, dan desktop, baik saat berisi maupun kosong.
- Tidak ada konten terpotong, termasuk saat banyak tugas atau teks panjang, dan saat browser mobile menampilkan/menyembunyikan address bar.
- Semua tabel kosong: papan tugas, jadwal, deck, folder, dan pencarian menampilkan empty state yang benar. Tombol "Tambah ..." hanya muncul untuk admin.
- Dua tombol hero menggulir ke section yang benar dan tidak tertutup navbar.

**Overlay detail tugas**
- Buka/tutup lewat X, Esc, klik luar, dan back browser. Buka langsung lewat link `/tugas/:id`.
- Deskripsi sangat panjang (scroll di dalam overlay), deskripsi kosong, deadline sudah lewat, tugas tanpa mata kuliah.
- Teks berisi karakter HTML tampil sebagai teks biasa.
- Admin melihat Ubah/Hapus, pengunjung tidak.

**Navbar**
- Navbar tetap terlihat saat scroll, logo selalu kembali ke beranda, link tambahan muncul setelah keluar dari hero, penanda section aktif benar, dan tampilan mobile ringkas berfungsi.

**Deck card dan kartu membesar**
- Swipe kiri/kanan di mobile, drag di desktop, tombol panah dan keyboard.
- Kartu pertama dan terakhir, hanya 1 kartu.
- Swipe tidak memicu klik tidak sengaja.
- Buka dan tutup kartu (X, Esc, klik luar, tombol back), buka lewat link langsung.

**Materi dan preview PDF**
- PDF besar, PDF rusak, PDF dengan banyak halaman (tidak membuat HP lag).
- File non-PDF langsung diunduh.
- Link file yang sudah dihapus dari Storage.
- pdf.js tidak ikut dimuat di bundle awal (cek ukuran bundle).

**Kirim materi (tanpa login)**
- Form kosong, file terlalu besar, tipe tidak diizinkan, nama file ganda, upload terputus.
- Kiriman berhasil: status `pending`, tidak tampil ke publik.
- Pengunjung mencoba membaca `pending`, menghapus, atau menulis `status = 'approved'` langsung lewat API: **harus ditolak** RLS/Storage policy.
- Honeypot terisi: kiriman ditolak diam-diam.

**Notifikasi email**
- Kiriman baru memicu satu email ke admin dengan isi yang benar dan link panel admin yang bisa dibuka.
- Banyak kiriman berturut-turut menghasilkan email ringkasan, bukan banjir email.
- Resend gagal/down: kiriman mahasiswa tetap sukses dan tersimpan `pending`.
- Judul berisi karakter HTML (`<script>`, tanda kutip) tampil aman di email.
- Tidak ada alamat email admin atau API key di kode maupun riwayat Git.

**Admin**
- Login gagal, sesi habis.
- User non-admin mencoba insert/update/delete di tabel yang dilindungi (harus ditolak).
- Setujui kiriman: file pindah ke bucket publik, tampil di folder. Tolak kiriman: file dan baris hilang.
- Hapus materi: ada konfirmasi, file di Storage ikut terhapus.

**Mading dan jadwal**
- Deadline sudah lewat, deadline hari ini, tugas tanpa deadline.
- Jadwal: hari tanpa kuliah, kuliah yang sedang berlangsung, pergantian hari di zona WIB.
- Ubah jadwal mingguan (hari/jam/ruang) memperbarui tampilan "Hari ini" dan "Minggu ini".
- Batalkan, pindahkan, dan tambah kuliah untuk tanggal tertentu tampil benar dengan label dan catatan, dan tidak mengubah minggu lain.
- Pemindahan ke tanggal yang sama dengan kuliah lain, jam selesai sebelum jam mulai, dan dua perubahan untuk jadwal+tanggal yang sama ditolak dengan pesan jelas.
- Jadwal dengan masa berlaku (mulai/sampai) tidak tampil di luar rentangnya.
- Non-admin tidak bisa mengubah jadwal maupun perubahannya lewat API.

**WhatsApp**
- Tombol "Minta materi" membuka link yang benar di tab baru (mobile dan desktop).

Jalankan `npm run build` dan pastikan tanpa error atau warning penting sebelum menyatakan selesai.

---

## 10. Pencatatan Pekerjaan AI

Setiap selesai satu tahap, tambahkan entri di `docs/AI-LOG.md` dengan format:

```md
## [Tanggal] — [Nama tahap / fitur]
**Yang dikerjakan:** ...
**File yang diubah/dibuat:** ...
**Keputusan penting & alasannya:** ...
**Hasil testing:** ...
**Yang perlu disetujui/dicek pengguna:** ...
```

Setelah itu berikan link preview (Netlify deploy preview atau `npm run dev`) kepada pengguna.

---

## 11. Aturan Kode

- Bahasa UI: **Bahasa Indonesia** yang santai dan jelas (cocok untuk mahasiswa). Nama variabel dan komentar kode: bahasa Inggris.
- Gunakan fungsi komponen dan hooks. Tanpa class component.
- Tailwind: pakai utility class, hindari CSS inline dan file CSS tambahan kecuali untuk animasi yang tidak bisa dengan Tailwind. Ambil warna dan font dari token di `tailwind.config.js`, bukan nilai hard-coded.
- Setiap pemanggilan async wajib punya `try/catch` dan state loading/error.
- Jangan `console.log` data sensitif. Hapus log debug sebelum commit.
- Aksesibilitas: elemen interaktif harus bisa diakses keyboard, gambar punya `alt`, tombol ikon punya `aria-label`.
- Commit message: ringkas dan deskriptif, misalnya `feat: add course search bar`, `fix: swipe click conflict`.
- Jangan commit `.env`. Perbarui `.env.example` bila menambah variabel.

---

## 12. Yang Tidak Boleh Dilakukan

- Melompati langkah approval desain.
- Membuat fitur di luar daftar tanpa konfirmasi.
- Menaruh secret atau `service_role` key di frontend.
- Mengandalkan pengecekan admin di sisi klien saja.
- Menggunakan konten, gambar, atau font berlisensi tanpa kejelasan lisensi.
- Menghapus data pengguna atau file di Storage tanpa konfirmasi.
- Menambahkan kembali input link Google Drive.
- Menampilkan materi berstatus `pending` ke publik, atau membiarkan pengunjung mengubah status.
- Meng-hardcode link WhatsApp di banyak tempat (pakai `src/lib/config.js`).
- Memasukkan pdf.js ke bundle awal.
- Menulis alamat email admin atau API key (Resend, Supabase service role) di kode, file `.md`, atau commit.
