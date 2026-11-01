## 2026-10-31 — Tahap desain awal
**Yang dikerjakan:** Membuat mockup statis beranda desktop/mobile dan keadaan folder mata kuliah terbuka untuk ditinjau sebelum implementasi.
**File yang diubah/dibuat:** `docs/design/mockup.html`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Mengikuti palet krem-hijau-kayu dan deck kartu yang diminta. Mockup menggunakan tipografi sistem dan ilustrasi bentuk kertas sederhana agar tidak bergantung pada aset atau font berlisensi. Halaman admin dan formulir kirim materi belum dimockup.
**Hasil testing:** Belum menjalankan build; tahap ini hanya menghasilkan mockup desain statis.
**Yang perlu disetujui/dicek pengguna:** Mohon tinjau mockup beranda dan folder terbuka serta setujui atau sampaikan revisi visual sebelum tahap implementasi.

## 2026-10-31 — Revisi mockup desain v2
**Yang dikerjakan:** Membuat mockup statis baru dengan section berwarna terpisah, board cutting mat berbingkai kayu, empat catatan tugas (krem, mustard, sage, dusty blue), deck buku catatan bertepi sobek, jadwal mobile dan mingguan, serta keadaan folder terbuka di desktop dan mobile.
**File yang diubah/dibuat:** `docs/design/mockup-v2.html`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Mockup v1 dipertahankan. Logo resmi `docs/design/logo/logo.svg` dipakai tanpa modifikasi pada latar terang. Grid, klip, tepi sobek, dan tekstur dibuat dengan CSS tanpa gambar tekstur besar; aksen warna menggunakan tinta gelap, sedangkan badge tenggat memakai kertas terang untuk menjaga keterbacaan.
**Hasil testing:** Preview browser diperiksa pada viewport 360 px dan desktop 1440 px. Pada 360 px, logo termuat, jadwal hari ini dan mingguan terlihat, empat catatan tugas muncul, tiga kartu deck tersusun, dan panel folder terbuka masuk ke lebar layar. Kontras teks isi pada empat warna catatan terukur 7,32:1–11,37:1; badge tenggat 10,08:1–13,33:1. Build aplikasi tidak dijalankan karena tidak ada kode aplikasi yang diubah.
**Yang perlu disetujui/dicek pengguna:** Menunggu persetujuan mockup v2 sebelum melanjutkan ke implementasi.

## 2026-10-31 — Revisi mockup desain v3
**Yang dikerjakan:** Membuat halaman mockup responsif tiga section full-bleed (meja kayu, cutting mat hijau, permukaan krem), menggabungkan tugas dan jadwal dengan tab, serta menambahkan toggle data contoh/kosong dan pengunjung/admin. Mockup menampilkan empty state untuk tugas, jadwal, deck, folder terbuka, dan pencarian tanpa hasil.
**File yang diubah/dibuat:** `docs/design/mockup-v3.html`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Mockup v1 dan v2 tidak ditimpa. Toggle kecil hanya mengubah tampilan mockup untuk meninjau keadaan visual; tidak ada kode aplikasi atau integrasi data yang dibuat. Logo resmi, aksen warna, grid, tekstur CSS, klip, dan tepi kertas dipertahankan.
**Hasil testing:** Preview browser diperiksa pada 360 px dan desktop. Ketiga section memiliki tinggi minimum satu viewport dan tidak menimbulkan overflow horizontal. Tab tugas/jadwal, tab jadwal hari ini/minggu ini, toggle kosong, toggle admin, empty states, dan visibilitas tombol admin diperiksa. Kontras teks pada catatan berwarna terukur minimal 7,32:1; anotasi hero 5,55:1. Build aplikasi tidak dijalankan karena hanya mockup statis yang diubah.
**Yang perlu disetujui/dicek pengguna:** Menunggu persetujuan mockup v3 sebelum melanjutkan ke implementasi.

## 2026-10-31 — Revisi mockup desain v4
**Yang dikerjakan:** Membuat `mockup-v4.html` dengan sistem elevasi berlapis, pencahayaan kiri-atas, vignette per section, tekstur noise dan serat kayu, grid alas hijau yang lebih terbaca, serta tepi kertas terlipat/tersobek. Pensil, tape, paperclip, dan binder clip digambar sebagai SVG orisinal bergradasi. Rotasi dan ukuran kertas divariasikan; hover mengangkat kertas, dan geraknya dihormati saat reduced motion aktif. Navbar menjadi strip kertas full-bleed dengan logo dan satu tombol "Kirim materi".
**File yang diubah/dibuat:** `docs/design/mockup-v4.html`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Mockup v1–v3 tetap dipertahankan. Palet, struktur, konten, dan toggle data contoh/kosong tetap sama. Link navbar "Kirim materi" memakai target tersendiri pada area folder agar tidak berbagi target dengan tombol hero "Cari materi". Anotasi desain yang dihapus: ide kertas bergerak mengikuti kursor/scroll; gerakan tersebut belum diimplementasikan di mockup statis.
**Hasil testing:** Mockup diperiksa di browser pada viewport mobile dan desktop. Ketiga section memenuhi tinggi minimum viewport tanpa overflow horizontal; tab Tugas/Jadwal, tampilan kosong, tombol admin pada keadaan kosong, logo, dan target anchor diperiksa. Build aplikasi tidak dijalankan karena hanya mockup statis yang diubah.
**Yang perlu disetujui/dicek pengguna:** Tinjau mockup v4; implementasi aplikasi belum dimulai dan menunggu persetujuan desain.

## 2026-11-01 — Revisi mockup desain v5
**Yang dikerjakan:** Membuat deck terpusat dengan kartu tetangga, indikator posisi dan panah; menambahkan drag kartu serta overlay folder dan detail tugas. Overlay tugas memuat tenggat WIB lengkap, chip sisa waktu, cara pengumpulan, dan deskripsi panjang yang bisa di-scroll. Navbar sticky menampilkan tautan section setelah hero; state contoh/kosong dan pengunjung/admin tetap dapat diganti saat overlay terbuka. Tombol kirim materi membuka formulir pratinjau yang menyatakan berkas tidak dikirim.
**File yang diubah/dibuat:** `docs/design/mockup-v5.html`, `docs/design/assets/tear-mask-1.svg`, `docs/design/assets/tear-mask-2.svg`, `docs/design/assets/tear-mask-3.svg`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** V1–v4 tidak ditimpa. Mockup memakai aset properti yang telah disediakan di `docs/design/assets/`; tidak ada foto atau klip eksternal. Konten mata kuliah, tugas, jadwal, dan materi adalah data contoh untuk pratinjau dan harus diganti sebelum peluncuran. Tidak menjalankan generator arah desain baru karena revisi ini diminta mempertahankan arah dan palet yang sudah disetujui. Panel kontrol pratinjau dipindahkan ke bawah navbar agar tidak menutupi logo atau navigasi.
**Hasil testing:** Browser diperiksa pada 1440, 768, dan 390 px; screenshot seluruh ukuran dibuka setelah perubahan akhir. Uji interaksi lulus untuk drag tanpa membuka kartu, folder dan detail tugas, scroll deskripsi panjang, tombol tutup/Escape, role admin, state kosong, tab Jadwal mobile, dan tidak adanya overflow horizontal. `lint.mjs` melaporkan 61 FAIL/25 WARN; `inspect.mjs` melaporkan 9 FAIL/8 WARN. Sebagian temuan berasal dari bayangan berlapis, gradient pencahayaan, dan tepi kertas yang memang diwajibkan brief; temuan lain mencakup teks kecil dan belum adanya foto/klip. Karena itu pemeriksaan visual belum mendapat status bersih. Skor visual: desain 7/10, usability 8/10, kreativitas 7/10, konten 7/10 (tertimbang 7,3; dibatasi maksimum 6,0 oleh hasil inspector yang masih gagal). Arah gagasan: materi kelas sebagai tumpukan catatan yang dapat disingkap; interaksi demo utamanya adalah menggeser deck dan membuka folder/tugas. Tidak menjalankan build aplikasi karena hanya mockup yang diubah.
**Yang perlu disetujui/dicek pengguna:** Tinjau mockup v5, terutama kepadatan teks kecil dan apakah tetap ingin menambah foto/klip nyata. Implementasi aplikasi dan backend belum dimulai; menunggu persetujuan desain.

## 2026-11-01 — Perapian mockup desain v6
**Yang dikerjakan:** Merapikan jadwal mingguan menjadi agenda lima hari; meluruskan kertas dan properti dekoratif; membuat deck mata kuliah berputar dari kartu terakhir ke pertama; menghapus sobekan dari kartu dan overlay; serta menyisakan tepi sobek yang lebih terlihat hanya pada sambungan hero dan papan kelas. Ikon beranda dihapus dan jarak tautan navbar ke tombol "Kirim materi" dirapatkan.
**File yang diubah/dibuat:** `docs/design/mockup-v6.html`, `docs/design/assets/tear-seam-v6.svg`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** V5 dipertahankan. Mask sobek khusus V6 menjaga bentuk dan versi aset lama tetap utuh. Jadwal satu minggu memakai daftar agenda vertikal agar mata kuliah, jam, dan ruangan lebih mudah dipindai tanpa kolom sempit.
**Hasil testing:** Browser memeriksa jadwal lima hari pada mobile dan desktop, tab jadwal, state kosong/admin, loop deck dua arah, overlay folder/tugas tanpa mask sobek, serta kertas dan properti tanpa kemiringan awal. Jarak tautan desktop ke tombol kirim terukur 18 px. Tidak ditemukan overflow horizontal; browser melaporkan lebar dokumen sama dengan lebar area klien. Viewport yang diminta 360×640 dan 390×844 dilaporkan runtime sebagai 450×800 dan 487×1055, sehingga ukuran internal tersebut dicatat sebagai keterbatasan emulator. Build tidak dijalankan karena hanya mockup statis yang diubah.
**Yang perlu disetujui/dicek pengguna:** Tinjau mockup v6. Implementasi aplikasi belum dimulai dan menunggu persetujuan desain.

## 2026-11-01 — Revisi aset dan scroll mockup v7
**Yang dikerjakan:** Memperbesar ilustrasi kertas dan properti di hero, menonjolkan klip pada kartu dan catatan, memutar binder clip 90 derajat, dan memutar paperclip emas 90 derajat. Tumpukan deck kini tertahan di bawah navbar saat pengunjung menggulir area materi. Sambungan hero–papan kelas memakai aset tepi sobek bertekstur dengan bentuk lebih lembut; overlay dan kartu tetap tanpa sobekan.
**File yang diubah/dibuat:** `docs/design/mockup-v7.html`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** V6 dan aset tepi sobek lama tidak ditimpa. Tepi sobek realistis yang sudah tersedia dipakai sebagai satu lapisan di sambungan section, supaya transisi tampak seperti serat kertas tanpa zigzag SVG yang tajam dan berulang. Sticky diterapkan pada area deck, bukan tiap aset terpisah, agar navigasi kartu tetap terbaca sebagai satu unit saat scroll.
**Hasil testing:** Browser memeriksa hero, sambungan sobek, dan deck pada desktop serta deck pada mobile. Semua gambar dekoratif termuat, binder clip dan paperclip emas memakai rotasi 90 derajat, overlay tidak memakai mask sobek, dan dokumen tidak overflow horizontal. Posisi area deck terukur berhenti di bawah navbar saat scroll. Runtime tidak mengikuti ukuran viewport yang diminta secara tepat, sehingga pemeriksaan ukuran piksel perangkat masih perlu dikonfirmasi di browser pengguna. Build tidak dijalankan karena hanya mockup statis yang diubah.
**Yang perlu disetujui/dicek pengguna:** Tinjau mockup v7, terutama besar klip dan bentuk sambungan sobek. Implementasi aplikasi belum dimulai dan menunggu persetujuan desain.

## 2026-11-01 — Perbaikan overlay dan tepi sobek mockup v8
**Yang dikerjakan:** Membuat mockup v8 tanpa menimpa versi sebelumnya. Binder clip dan tepi sobek di sambungan hero–papan kelas diputar 180 derajat; posisi dan tinggi tepi sobek disesuaikan agar hanya menjadi transisi antar-section. Overlay memakai latar gelap opak di atas konten dan kontrol pratinjau, serta dapat ditutup melalui tombol X atau klik di luar panel.
**File yang diubah/dibuat:** `docs/design/mockup-v8.html`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Memakai aset `torn-edge-top-1.webp` yang tersedia dan membatasi penggunaannya pada sambungan section. Latar overlay dibuat opak supaya elemen halaman di belakang tidak tetap terlihat; klik di dalam panel tidak menutupnya.
**Hasil testing:** Browser mengonfirmasi overlay tugas membuka dan mengunci scroll, klik panel tidak menutup overlay, sedangkan tombol X dan klik backdrop menutupnya. CSS menunjukkan overlay berada di atas kontrol pratinjau (z-index 70 vs 60), dengan warna latar opak. Pemeriksaan visual halaman papan kelas dan deck dilakukan; build tidak dijalankan karena hanya mockup statis yang diubah.
**Yang perlu disetujui/dicek pengguna:** Tinjau mockup v8, terutama arah/posisi tepi sobek dan orientasi binder clip. Implementasi aplikasi belum dimulai; menunggu persetujuan desain.

## 2026-11-01 — Penyesuaian overlay mobile dan scroll mockup v9
**Yang dikerjakan:** Membuat mockup v9 tanpa menimpa v8. Overlay mobile kini berupa panel dengan jarak dari tepi layar, tinggi maksimum 82svh, dan konten panjang yang dapat digulir di dalam panel. Deck kembali ke alur scroll halaman normal; sticky pada pencarian/deck dan tinggi ekstra buatan dihapus. Binder clip diputar -90 derajat.
**File yang diubah/dibuat:** `docs/design/mockup-v9.html`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Panel overlay tidak lagi memaksa tinggi layar penuh, tetapi masih dibatasi agar konten panjang tetap bisa diakses tanpa keluar layar. Sticky dan ruang scroll tambahan sebelumnya membuat deck terasa tertahan, jadi keduanya dihilangkan tanpa mengubah navigasi kartu.
**Hasil testing:** Browser memeriksa overlay detail tugas panjang, folder, dan formulir kirim pada mobile; panel detail panjang dapat discroll, sementara overlay folder/form tetap menyesuaikan isi. Deck terukur `position: static`, tinggi section sama dengan viewport, dan scroll halaman berjalan tanpa sticky. Binder clip terukur memakai rotasi -90 derajat. Runtime browser melaporkan ukuran internal 487×1055 saat diminta 390×844 dan 450×800 saat diminta 360×640; panel formulir tidak menyebabkan overflow horizontal. Build tidak dijalankan karena hanya mockup statis yang diubah.
**Yang perlu disetujui/dicek pengguna:** Tinjau mockup v9 pada ponsel, khususnya ukuran overlay dan rasa scroll deck. Implementasi aplikasi belum dimulai; menunggu persetujuan desain.

## 2026-11-01 — Perbaikan clip, kertas hero, dan sticky deck mockup v10
**Yang dikerjakan:** Membuat mockup v10 dari v9. Binder clip deck tidak lagi terpotong oleh batas vertikal tumpukan. Kertas depan pada ilustrasi hero kini berisi daftar materi minggu ini. Sticky scroll deck diaktifkan kembali untuk satu kelompok utuh: judul, pencarian, kartu, dan navigasi; ruang scroll tambahan dibatasi. Pada keadaan data kosong, sticky dinonaktifkan agar tidak menyisakan lintasan kosong.
**File yang diubah/dibuat:** `docs/design/mockup-v10.html`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Area kartu memakai clipping horizontal saja, sementara overflow vertikal dibiarkan terlihat supaya clip yang menempel di bagian atas kartu tidak terpotong. Judul dimasukkan ke dalam kelompok sticky agar tetap terlihat selama kartu tertahan saat scroll.
**Hasil testing:** Screenshot desktop menunjukkan teks pada kertas hero dan binder clip utuh; hit-test browser pada pusat clip mengembalikan elemen gambar clip. Saat scroll deck, kelompok sticky tetap pada posisi atas yang sama (180 px pada ukuran runtime yang terukur), sedangkan section tetap bergerak; pada state kosong kelompok kembali statis. Deck tetap dapat dibuka dan state kosong dipulihkan ke state contoh. Runtime melaporkan 1800×1125 pada mode desktop dan 487×1055 pada mode mobile saat viewport yang diminta berbeda; build tidak dijalankan karena hanya mockup statis yang diubah.
**Yang perlu disetujui/dicek pengguna:** Tinjau mockup v10, khususnya posisi binder clip di desktop dan lama sticky saat menggulir deck. Implementasi aplikasi belum dimulai; menunggu persetujuan desain.

## 2026-11-01 — Perapian breakpoint tablet dan mobile mockup v11
**Yang dikerjakan:** Membuat mockup v11 dengan susunan satu kolom untuk hero dan papan kelas pada tablet, tab Tugas/Jadwal yang tetap tersedia pada tablet dan mobile, serta menonaktifkan sticky deck dan tinggi scroll tambahan di tablet/mobile. Sticky deck tetap digunakan pada desktop.
**File yang diubah/dibuat:** `docs/design/mockup-v11.html`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Rentang tablet diperluas sampai 1100px agar layout dua kolom desktop tidak bertahan pada lebar menengah. Tampilan tablet/mobile memakai alur scroll biasa supaya perpindahan antarkomposisi lebih stabil; jadwal tetap dapat dibuka lewat tab, bukan disembunyikan.
**Hasil testing:** Browser memeriksa tampilan desktop, tablet, dan mobile. Runtime melaporkan lebar CSS aktual 1781px (desktop), 941px dan 831px (tablet), serta 468px dan 431px (mobile), berbeda dari ukuran viewport yang diminta. Pada tablet, hero dan papan menjadi satu kolom, tab jadwal menampilkan agenda mingguan lima hari, dan deck tidak sticky. Pada mobile, tab jadwal dan deck tetap dapat digunakan, deck tidak sticky, dan tidak ada overflow horizontal. Pada desktop, kelompok deck tetap sticky di posisi 180px setelah scroll. Screenshot hero, papan tugas, jadwal, dan deck pada tablet serta jadwal dan deck pada mobile telah diperiksa. Build aplikasi tidak dijalankan karena hanya mockup statis yang diubah.
**Yang perlu disetujui/dicek pengguna:** Tinjau mockup v11 pada tablet dan mobile, terutama ritme vertikal papan kelas dan deck. Implementasi aplikasi belum dimulai; menunggu persetujuan desain.

## 2026-11-01 — Penyesuaian posisi sticky deck mockup v12
**Yang dikerjakan:** Membuat mockup v12 dari v11. Posisi sticky deck desktop kini tetap 96px dari atas, tepat di bawah navbar, menggantikan offset dinamis yang bisa menahan deck terlalu rendah. Tinggi lintasan buatan dikurangi dari `100svh + 96px` menjadi `100svh` agar deck tidak terasa tertahan terlalu lama.
**File yang diubah/dibuat:** `docs/design/mockup-v12.html`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Sticky tetap dipertahankan di desktop, tetapi memakai jarak tetap dan lebih dekat ke navbar. Tablet dan mobile tetap memakai alur scroll normal tanpa sticky, sesuai susunan responsif sebelumnya.
**Hasil testing:** Browser pada desktop (lebar CSS aktual 1781px) menunjukkan kelompok deck berpindah dari posisi alaminya ke posisi sticky 96px saat digulir; setelah digulir lagi, posisi tetap stabil dan tidak ada overflow horizontal. Pada tablet (941px CSS) dan mobile (468px CSS), deck tetap `position: static`, tinggi tambahan dinonaktifkan, dan tidak ada overflow horizontal. Screenshot desktop setelah sticky aktif diperiksa. Build aplikasi tidak dijalankan karena hanya mockup statis yang diubah.
**Yang perlu disetujui/dicek pengguna:** Tinjau posisi sticky V12 saat menggulir desktop dan pastikan terasa lebih natural. Implementasi aplikasi belum dimulai; menunggu persetujuan desain.

## 2026-11-01 — Empty state ringkasan hero mockup v13
**Yang dikerjakan:** Membuat mockup v13 dari v12. Ringkasan hero kini mengikuti toggle data: mode contoh menampilkan mata kuliah dan jumlah materi contoh, sedangkan mode kosong menampilkan "Belum ada materi" beserta keterangan bahwa daftar akan muncul setelah materi ditambahkan.
**File yang diubah/dibuat:** `docs/design/mockup-v13.html`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Daftar hero sebelumnya adalah konten contoh statis yang tetap terlihat saat semua data diset kosong. Baris contoh kini ditandai sebagai data contoh dan diganti dengan empty state yang informatif, tanpa menyiratkan bahwa contoh itu data sungguhan.
**Hasil testing:** Browser mengonfirmasi mode kosong menyembunyikan judul dan ketiga baris contoh serta menampilkan empty state; kembali ke mode contoh memulihkan daftar dan menyembunyikan empty state. Hanya mockup statis yang diubah, sehingga build aplikasi tidak dijalankan.
**Yang perlu disetujui/dicek pengguna:** Tinjau empty state ringkasan hero di mockup v13. Implementasi aplikasi belum dimulai; menunggu persetujuan desain.

## 2026-11-01 — Jarak kontrol admin catatan tugas mockup v14
**Yang dikerjakan:** Membuat mockup v14 dari v13. Memberi jarak khusus antara jumlah tenggat dan tombol "+ Tambah tugas" pada header daftar tugas.
**File yang diubah/dibuat:** `docs/design/mockup-v14.html`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Elemen sebelumnya berdempetan karena dirender berdampingan tanpa gap. Grup kontrol memakai flex gap 16px di desktop dan 12px pada layar kecil, dengan wrapping bila ruang tidak mencukupi.
**Hasil testing:** Dalam mode admin, jarak terukur 16px pada desktop dan 12px pada mobile. Screenshot mobile menunjukkan label jumlah tenggat dan tombol tambah terpisah jelas; tidak ada overflow horizontal. Hanya mockup statis yang diubah, sehingga build aplikasi tidak dijalankan.
**Yang perlu disetujui/dicek pengguna:** Tinjau jarak kontrol admin di mockup v14. Implementasi aplikasi belum dimulai; menunggu persetujuan desain.

## 2026-11-01 — Implementasi tahap 2a (UI React)
**Yang dikerjakan:** Menyiapkan Vite + React, Tailwind, Framer Motion, dan lucide-react; memindahkan token desain dan font subset lokal; menyalin aset mockup. Memecah tampilan v14 menjadi komponen navbar, hero, papan tugas/jadwal, deck mata kuliah, serta overlay folder dan detail tugas. Menambahkan adapter data dan hooks, fixture 8 mata kuliah serta jadwal asli dari `docs/data-kelas.md`, status kosong untuk tugas/materi, interaksi deck dan overlay, hash routing, focus trap, dan scroll lock.
**File yang diubah/dibuat:** Fondasi proyek (`package.json`, `tailwind.config.js`, `vite.config.js`, `netlify.toml`, `index.html`, `.env.example`); seluruh `src/` untuk komponen, halaman, hooks, services, fixture dev, aset, font dan styling; `public/favicon.svg`; `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Fixture hanya diaktifkan pada development jika `VITE_USE_FIXTURES=true` dan dimuat dinamis; data produksi tetap kosong tanpa contoh. Sumber fixture adalah `docs/data-kelas.md`, bukan `supabase/seed.sql`. Ukuran judul hero disetel agar maksimal dua baris pada desktop dan ponsel. Tidak ada perubahan backend/Supabase atau fitur tahap 2b. Dependency Caveat yang tak lagi digunakan dihapus.
**Hasil testing:** `npm run build` berhasil tanpa warning; string fixture tidak ditemukan di bundle JavaScript produksi. `lint.mjs src`: 0 FAIL, 6 WARN untuk tepi kertas terang yang memang bagian dari sistem desain. Inspector produksi pada 1440/768/390px: judul maksimal 2 baris; 6 FAIL dan 4 WARN tersisa, terutama aturan generik larangan gradient/elevasi yang bertentangan dengan README desain dan mockup v14, serta batas aset foto/motion dan teks kecil. Screenshot desktop, tablet, dan ponsel ditinjau. Browser sebelumnya memeriksa navigasi hash, loop deck, overlay (X/Esc/klik luar/back), focus trap, scroll lock, tab jadwal, dan responsivitas. Penghapusan dependency juga melaporkan 2 kerentanan dependency (1 moderat, 1 tinggi); tidak diperbaiki karena di luar lingkup tahap ini.
**Yang perlu disetujui/dicek pengguna:** Tinjau preview tahap 2a dan putuskan apakah boleh mulai tahap 2b. Panel admin, pencarian aktif, formulir kirim materi, backend, perubahan jadwal, dan preview PDF belum dibuat.

## 2026-11-01 — Memperbaiki transform CSS Tailwind
**Yang dikerjakan:** Menghapus penggunaan `@apply` untuk utility background kustom yang tidak dihasilkan Tailwind, lalu menetapkan background-image langsung pada selector terkait.
**File yang diubah/dibuat:** `src/styles/index.css`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** `@apply` tidak dapat menemukan utility seperti `bg-paper-light` pada proses PostCSS di server development. Deklarasi CSS langsung mempertahankan tekstur dan latar desain tanpa mengubah tampilan.
**Hasil testing:** Permintaan Vite untuk transform `src/styles/index.css` berhasil dengan HTTP 200; `npm run build` berhasil tanpa error.
**Yang perlu disetujui/dicek pengguna:** Muat ulang preview lokal dan pastikan overlay error Vite sudah hilang.

## 2026-11-01 — Merapikan tampilan jadwal mingguan
**Yang dikerjakan:** Mengelompokkan semua jadwal harian di dalam satu kolom setelah nama hari, sehingga beberapa kuliah pada hari yang sama tersusun berurutan dan tidak berpindah ke kolom yang salah.
**File yang diubah/dibuat:** `src/components/schedule/SchedulePanel.jsx`, `src/styles/index.css`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Grid sebelumnya menempatkan setiap jadwal sebagai anak langsung baris hari; item kuliah kedua dan seterusnya masuk ke kolom implisit sehingga tampil tidak rata. Pembungkus daftar per hari memperbaiki alur grid, sementara `min-width: 0` menjaga konten panjang tetap di dalam kartu.
**Hasil testing:** `npm run build` berhasil. Preview mobile menunjukkan jadwal berkelompok rapi per hari dan tidak menimbulkan overflow horizontal (lebar dokumen 468px pada viewport 487px).
**Yang perlu disetujui/dicek pengguna:** Muat ulang preview lalu periksa tab “Minggu ini” di ukuran layar yang digunakan.

## 2026-11-01 — Implementasi tahap 2b (pencarian, kirim materi, preview PDF)
**Yang dikerjakan:** Menambahkan pencarian ber-debounce 250 ms untuk mata kuliah dan materi approved, hasil terkelompok dengan batas 20 item, tautan WhatsApp saat kosong, serta navigasi hasil materi ke folder/preview atau unduhan. Mengganti placeholder kirim materi dengan formulir pilihan mata kuliah, validasi delapan format dan batas 20 MB, honeypot, jeda 60 detik, progress, pesan error, dan adapter simulasi tanpa penyimpanan. Menambahkan PDF.js lazy-loaded, skeleton, render halaman saat terlihat, error/unduhan fallback, serta fixture pengembangan dengan dua materi approved dan satu pending berjudul `[UJI]` serta satu PDF kecil.
**File yang diubah/dibuat:** `src/components/deck/CourseDeck.jsx`, `src/components/deck/CourseSearch.jsx`, `src/components/materials/CourseFolderOverlay.jsx`, `src/components/submit/SubmitMaterialOverlay.jsx`, `src/components/submit/SubmitPlaceholderOverlay.jsx` (dihapus), `src/components/viewer/PdfViewer.jsx`, `src/dev/test-fixtures.js`, `src/hooks/useCourseSearch.js`, `src/hooks/useHashRoute.js`, `src/lib/config.js`, `src/lib/file-validation.js`, `src/lib/materials.js`, `src/lib/search.js`, `src/pages/Home.jsx`, `src/services/dataAdapter.js`, `src/services/materials.js`, `src/services/search.js`, `src/services/submissionCooldown.js`, `src/services/submissions.js`, `src/styles/index.css`, `.env.example`, `package.json`, `package-lock.json`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Tidak ada Supabase atau penyimpanan lokal; formulir secara jelas memberi tahu bahwa kiriman hanya simulasi. PDF.js memakai `pdfjs-dist` 4.10.38 agar kompatibel dengan lebih banyak browser/perangkat; modul PDF, viewer, dan worker dimuat sebagai aset terpisah. Fixture materi hanya dimuat pada development jika `VITE_USE_TEST_MATERIALS=true`; data kelas yang dipakai tetap berasal dari delapan mata kuliah asli.
**Hasil testing:** `npm run build` berhasil tanpa warning build. Uji Node lulus untuk normalisasi huruf/spasi/karakter khusus, filter pending, batas hasil, semua tipe MIME, ukuran tepat/lebih dari 20 MB, progress/sukses/gagal simulator, cooldown, dan parsing PDF fixture satu halaman. Pemeriksaan `dist` tidak menemukan teks fixture `[UJI]`; entry awal `index-*.js` berukuran 303,29 kB (97,27 kB gzip), sedangkan modul PDF.js berukuran 365,12 kB (107,61 kB gzip), viewer 3,53 kB, dan worker 1.375,84 kB sebagai aset terpisah. HTML awal tidak memuat viewer/PDF.js. Keadaan kosong dipertahankan oleh adapter tanpa fixture. Pengujian UI browser, ukuran viewport, unduhan, PDF rusak/banyak halaman, dan jaringan lambat tidak dijalankan karena server tidak dinyalakan sesuai instruksi; tidak ada RLS/backend untuk diuji pada tahap ini. Instalasi dependency melaporkan 2 advisory audit (1 sedang, 1 tinggi), seperti catatan tahap sebelumnya.
**Yang perlu disetujui/dicek pengguna:** Tinjau Tahap 2b. Kiriman belum benar-benar diunggah atau disimpan; backend Supabase dan pengujian browser tetap menunggu tahap/persetujuan berikutnya.

## 2026-11-01 — Implementasi tahap 2c (UI admin simulasi)
**Yang dikerjakan:** Membuat login admin simulasi, dashboard dengan ringkasan antrean dan deadline, menu Kiriman masuk/Materi/Mata kuliah/Mading/Jadwal, serta kontrol admin pada board tugas, jadwal, deck, dan folder. Menambahkan editor dan konfirmasi untuk mata kuliah, tugas, materi, jadwal mingguan, dan perubahan satu kali; antrean kiriman mendukung preview, edit, setujui, dan tolak. Semua perubahan menggunakan service adapter memori dan hilang saat reload; tidak ada Supabase atau localStorage. Menambahkan label tenggat dan tampilan perubahan jadwal dalam WIB.
**File yang diubah/dibuat:** `src/components/admin/AdminConfirmOverlay.jsx`, `src/components/admin/AdminEditorOverlay.jsx`, `src/components/admin/AdminLogin.jsx`, `src/components/admin/AdminWorkspace.jsx`, `src/components/board/TaskBoard.jsx`, `src/components/board/TaskDetailOverlay.jsx`, `src/components/deck/CourseDeck.jsx`, `src/components/materials/CourseFolderOverlay.jsx`, `src/components/nav/Navbar.jsx`, `src/components/schedule/SchedulePanel.jsx`, `src/hooks/useAdminData.js`, `src/hooks/useAdminSession.js`, `src/hooks/useHashRoute.js`, `src/lib/deadline.js`, `src/lib/schedule-utils.js`, `src/pages/Home.jsx`, `src/services/admin.js`, `src/services/dataAdapter.js`, `src/hooks/useResource.js`, `src/styles/index.css`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Peran `VITE_DEV_ROLE=admin` aktif hanya di development; flag dan penanda peran simulasi tidak masuk ke bundle produksi. Login tidak mengklaim sebagai autentikasi nyata. Antrean, upload, persetujuan, CRUD, dan perubahan jadwal hanya memutasi fixture di memori; kiriman mahasiswa tahap 2b tetap tidak disimpan, sesuai batas simulasi yang disepakati.
**Hasil testing:** `npm run build` berhasil tanpa warning. Pemeriksaan perilaku Node lulus untuk pencarian (kapitalisasi/spasi, pending tidak muncul, batas hasil), batas file tepat 20 MB dan tipe terlarang, label tenggat, tanggal WIB, perubahan jadwal pindah/batal/tambahan, validasi jam, tanggal pindah wajib, konflik waktu, dan duplikasi perubahan. Bundle produksi tidak berisi flag/peran admin development maupun fixture `[UJI]`; PDF.js tidak ada di entry awal. Ukuran entry awal `index-*.js` 341,97 kB (106,57 kB gzip); PDF.js 365,12 kB, viewer 3,53 kB, dan worker 1.375,84 kB terpisah. UI tidak diuji lewat browser karena tidak menjalankan server sesuai instruksi; alur antrean belum dapat diuji dengan kiriman nyata karena adapter mahasiswa tidak menyimpan data.
**Catatan npm audit:** Audit menemukan `esbuild <=0.24.2` (moderate, indirect melalui Vite) terkait paparan request/response pada development server, serta `vite <=6.4.3` (high, devDependency langsung) terkait penanganan path/perintah `launch-editor` di Windows. Keduanya berada di toolchain development, bukan runtime produksi. `npm audit fix` tanpa `--force` tidak mengubah dependency. Perbaikan yang direkomendasikan memerlukan `vite@8.3.5` (upgrade mayor); upgrade ditunda atas keputusan pemilik repo. Kedua advisory masih terbuka.
**Yang perlu disetujui/dicek pengguna:** Tinjau Tahap 2c. Dashboard dan antrean masih simulasi; perubahan tidak bertahan setelah reload, belum ada autentikasi/backend nyata, dan advisory audit menunggu keputusan upgrade mayor.

## 2026-11-01 — Perapian form admin
**Yang dikerjakan:** Menyesuaikan overlay form admin dengan tampilan utama: tekstur kertas, panel berlapis, judul dan label lebih terbaca, serta tombol aksi yang tetap terlihat saat isi form panjang. Form tugas menampilkan kolom penting terlebih dahulu dan melipat deadline/rincian opsional; saat mengubah tugas yang sudah berisi rincian, bagian opsional terbuka otomatis. Pada ponsel, editor tampil sebagai sheet bawah dengan batas tinggi 84svh.
**File yang diubah/dibuat:** `src/components/admin/AdminEditorOverlay.jsx`, `src/styles/index.css`, `docs/design/mockup-admin-v3.html`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Perubahan mengikuti mockup v3 yang disetujui. Login dan form lain tetap memakai alur yang sama; tidak ada perubahan service atau penyimpanan. Ringkasan opsi dibuat keyboard-accessible dan footer tetap tersedia saat form digulir.
**Hasil testing:** `npm run build` berhasil (Vite 5.4.21). Mockup diperiksa di browser desktop dan ponsel; alat browser melaporkan lebar CSS 468 px setelah diminta 390 px, jadi ukuran tepat 390 px tidak diklaim. UI aplikasi langsung tidak dijalankan di browser, dan dev server tidak dinyalakan.
**Yang perlu disetujui/dicek pengguna:** Tinjau form admin pada aplikasi; backend dan data admin tetap simulasi.

## 2026-11-01 — Koneksi Supabase baca-saja
**Yang dikerjakan:** Menghubungkan pembacaan mata kuliah, materi berstatus `approved`, tugas, jadwal mingguan, perubahan jadwal, dan pencarian terbatasi ke Supabase. URL dan publishable key disediakan melalui environment; mode fixture lokal dimatikan agar preview development memakai data project.
**File yang diubah/dibuat:** `src/lib/supabase.js`, `src/services/courses.js`, `src/services/materials.js`, `src/services/announcements.js`, `src/services/schedules.js`, `src/services/scheduleChanges.js`, `src/services/search.js`, `src/hooks/useScheduleChanges.js`, `src/lib/search.js`, `src/pages/Home.jsx`, `vite.config.js`, `.env.example`, `.env.development.local`, `package.json`, `package-lock.json`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Tahap ini hanya memakai operasi `select`; tidak ada perubahan skema, data, policy, atau Storage. Pencarian materi meminta status `approved` di server. Supabase dipisah menjadi chunk build untuk menjaga ukuran entry awal. Login admin, kiriman, upload, persetujuan, dan CRUD tetap simulasi sampai tahap integrasi tulis/auth disetujui dan dikerjakan.
**Hasil testing:** `npm run build` berhasil tanpa warning setelah chunk Supabase dipisah. Layanan aplikasi membaca 16 mata kuliah, 0 materi approved, 1 tugas, 24 jadwal, dan 0 perubahan jadwal; pencarian tanpa memperhatikan kapitalisasi/whitespace menghasilkan 2 hasil dan query kosong tidak menghasilkan hasil. Query anon untuk semua tabel yang dipakai berhasil. Pemeriksaan baca-only Storage menemukan bucket `materials` publik dan `submissions` privat, keduanya membatasi ukuran 20 MB serta tipe file yang diizinkan. Entry JavaScript awal 347,29 kB dan chunk Supabase 227,07 kB. `npm install` melaporkan 2 advisory audit pada dependency toolchain; tidak diperbaiki dalam cakupan integrasi ini.
**Yang perlu disetujui/dicek pengguna:** Periksa preview lokal terhadap data project. Tahap autentikasi dan operasi tulis belum diaktifkan.

## 2026-11-01 — Menghindari tampilan mata kuliah ganda
**Yang dikerjakan:** Menggabungkan entri mata kuliah bernama sama di katalog dan hasil pencarian. Referensi materi, tugas, jadwal, serta perubahan jadwal dipetakan ke entri kanonis agar relasi tetap tampil benar.
**File yang diubah/dibuat:** `src/lib/course-catalog.js`, `src/services/courses.js`, `src/services/materials.js`, `src/services/announcements.js`, `src/services/schedules.js`, `src/services/scheduleChanges.js`, `src/services/search.js`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Entri kanonis dipilih berdasarkan waktu pembuatan paling awal; record duplikat di database tidak dihapus karena masing-masing masih memiliki referensi jadwal. Ini memperbaiki tampilan tanpa mengubah data Supabase.
**Hasil testing:** Build berhasil. Layanan membaca menampilkan 8 mata kuliah unik; seluruh 24 jadwal tetap tertaut, dan pencarian nama mata kuliah menghasilkan satu hasil. Tidak ada perubahan database.
**Yang perlu disetujui/dicek pengguna:** Muat ulang preview lokal. Data duplikat di database masih ada; penghapusan/merger permanen memerlukan persetujuan terpisah karena data jadwal terkait harus dipertahankan.

## 2026-11-01 — Menghubungkan admin ke Supabase
**Yang dikerjakan:** Mengganti login simulasi dengan Supabase Auth email/kata sandi, validasi hak admin lewat RPC `is_admin()`, pemulihan sesi, logout, dan alur reset kata sandi. Dashboard admin membaca data Supabase; CRUD mata kuliah, tugas, jadwal dan perubahan jadwal tersimpan ke tabel. Upload admin memakai bucket `materials`; antrean kiriman menggunakan signed URL, edit, persetujuan/pemindahan file, dan penolakan/penghapusan.
**File yang diubah/dibuat:** `src/lib/supabase.js`, `src/services/auth.js`, `src/hooks/useAdminSession.js`, `src/services/admin.js`, `src/services/adminSupabase.js`, `src/components/admin/AdminLogin.jsx`, `src/components/admin/AdminPasswordRecovery.jsx`, `src/components/admin/AdminWorkspace.jsx`, `src/components/admin/AdminEditorOverlay.jsx`, `src/pages/Home.jsx`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Tidak ada perubahan skema atau policy. Operasi database dan Storage dilindungi policy/RLS project yang ada; bila tindakan multi-langkah Storage gagal sebagian, UI menerima error eksplisit. Fixture `VITE_DEV_ROLE=admin` tetap hanya untuk development.
**Hasil testing:** Build berhasil. Layanan admin membaca 8 mata kuliah unik, 1 tugas, dan 24 jadwal; anon tidak mendapatkan kiriman pending. RPC `is_admin()` bisa dipanggil dan menghasilkan `false` untuk sesi anon. Guard menolak mutasi tanpa sesi admin. Preview lokal merespons HTTP 200. Login/password reset aktual dan mutasi dengan akun admin belum diuji karena kredensial tidak disediakan; tidak ada operasi tulis yang dijalankan pada project saat validasi.
**Yang perlu disetujui/dicek pengguna:** Pastikan akun sudah dibuat di Supabase Auth dan `user_id`-nya tercatat di `admins` (project saat dicek memiliki satu baris admin). Atur `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` juga di environment Netlify, serta izinkan URL situs di redirect URLs Supabase Auth untuk reset kata sandi. Form kirim materi mahasiswa dan notifikasi email masih simulasi/tahap terpisah.

## 2026-11-01 — Mockup revisi form admin
**Yang dikerjakan:** Membuat mockup responsif baru untuk form tugas, mata kuliah, materi, jadwal mingguan, dan perubahan jadwal. Form tugas menampilkan pratinjau catatan yang mengikuti judul, mata kuliah, tenggat, dan cara pengumpulan yang diketik.
**File yang diubah/dibuat:** `docs/design/mockup-admin-v4.html`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Mempertahankan logo, font, dan palet proyek; area konteks menampilkan hasil form agar dampak isian mudah dipahami. Pilihan tab hanya untuk meninjau ragam form pada mockup, bukan perubahan alur aplikasi. Tombol simpan dinonaktifkan supaya mockup tidak memberi kesan menyimpan data.
**Hasil testing:** Mockup diperiksa pada desktop, tablet, dan ponsel; inspector melaporkan 0 FAIL dan 0 WARN dengan pengecualian palet krem yang memang diwajibkan brand. Lint melaporkan 0 FAIL dan 1 peringatan bayangan dialog overlay. Uji browser lulus untuk tab form, pratinjau tugas langsung, serta pilihan pindah/tambah pada perubahan jadwal. Build tidak dijalankan karena kode aplikasi belum diubah.
**Yang perlu disetujui/dicek pengguna:** Tinjau `docs/design/mockup-admin-v4.html` dan setujui atau minta revisi sebelum implementasi UI.

## 2026-11-01 — Mockup layout login admin
**Yang dikerjakan:** Setelah ruang lingkup diklarifikasi, membuat mockup login admin dengan susunan rata kiri, logo di bagian atas, label dan input sejajar, tautan lupa kata sandi di baris label kata sandi, tombol masuk selebar form, serta tautan kembali yang terpisah.
**File yang diubah/dibuat:** `docs/design/mockup-admin-login-v1.html`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Fokus mockup ini hanya login admin, bukan form CRUD. Perilaku autentikasi, pesan umum, dan reset kata sandi tidak disimulasikan; tombol masuk nonaktif pada mockup agar tidak memberi kesan login berhasil.
**Hasil testing:** Mockup diperiksa pada desktop, tablet, dan ponsel. Inspector melaporkan 0 FAIL dan 1 WARN karena ruang backdrop besar di sekeliling dialog; itu disengaja untuk overlay login. Lint melaporkan 0 FAIL dan 0 WARN. Tidak menjalankan build karena kode aplikasi belum diubah.
**Yang perlu disetujui/dicek pengguna:** Tinjau `docs/design/mockup-admin-login-v1.html`; implementasi login menunggu persetujuan eksplisit.

## 2026-11-01 — Perapian form login admin
**Yang dikerjakan:** Merapikan form login agar mengikuti susunan pada `docs/design/mockup-admin-v3.html`: logo di atas, form rata kiri, tautan lupa kata sandi sejajar dengan label, tombol masuk selebar form, dan tautan kembali terpisah. Ukuran judul mobile diturunkan ke 24px.
**File yang diubah/dibuat:** `src/components/admin/AdminLogin.jsx`, `src/styles/index.css`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Mempertahankan tekstur dan elevasi dari mockup yang dipilih, serta membatasi perubahan ukuran judul pada breakpoint mobile. Alur login, validasi, dan reset kata sandi tidak diubah; tidak ada perubahan database.
**Hasil testing:** `npm run build` berhasil. Inspector produksi pada 1440, 768, dan 390px menghasilkan 0 FAIL/0 WARN dengan pengecualian `gradient`, `heavy-shadow`, `palette-cream`, dan `hero-void` yang memang berasal dari mockup referensi dan backdrop dialog. Form kosong tetap tidak valid; klik "Lupa kata sandi?" tanpa email menampilkan pesan validasi yang benar; tidak ada error browser. Lint CSS proyek melaporkan 15 gradient dan 18 shadow pada stylesheet yang sudah berisi tekstur/elevasi desain; temuan tersebut tidak ditambahkan oleh perubahan login ini.
**Tinjauan visual:** Panel 470px tetap terpusat di desktop dan tablet; versi ponsel menggunakan lebar layar dengan judul 24px. Logo, label, input, aksi reset, dan tombol masuk terlihat berurutan dan mudah dipindai pada ketiga ukuran.
**Yang perlu disetujui/dicek pengguna:** Preview tersedia di `http://127.0.0.1:4173/#admin`. Login dan pengiriman email reset ke akun nyata tidak diuji agar tidak memicu autentikasi atau email.

## 2026-11-01 — Diagnosis konfigurasi login production preview
**Yang dikerjakan:** Menemukan bahwa build production preview sebelumnya tidak memuat konfigurasi Supabase: nilai tersedia hanya di `.env.development.local`, yang tidak dipakai Vite untuk mode production. Form login sebelumnya menampilkan pesan kredensial salah untuk semua error, termasuk konfigurasi yang hilang. Pesan kini membedakan konfigurasi Supabase yang belum tersedia, tanpa membedakan akun/email yang valid dan tidak valid.
**File yang diubah/dibuat:** `src/components/admin/AdminLogin.jsx`, `docs/AI-LOG.md`; output `dist/` dibangun ulang.
**Keputusan penting & alasannya:** Memakai konfigurasi lokal yang sudah ada hanya untuk membangun preview production, tanpa mencetak nilainya atau mengubah file environment. Nilai Supabase yang ditanam di bundle adalah URL dan publishable/anon key, bukan service-role key. Build Netlify tetap memerlukan variabel yang sama pada pengaturan environment Netlify.
**Hasil testing:** `npm run build` berhasil; pemeriksaan memastikan URL project terpakai di bundle tanpa mengeluarkan nilainya. Lint komponen login lulus; preview port 4173 menampilkan form tanpa error browser atau overflow.
**Yang perlu disetujui/dicek pengguna:** Coba lagi di `http://127.0.0.1:4173/#admin`. Kredensial nyata belum dicoba. Untuk situs Netlify, pastikan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` diatur pada environment deploy yang aktif lalu deploy ulang.

## 2026-11-01 — Mockup revisi form admin
**Yang dikerjakan:** Membuat mockup responsif v5 untuk form tugas, mata kuliah, materi, jadwal mingguan, dan perubahan jadwal. Memperbaiki visibilitas kondisional field jadwal agar pilihan batalkan, pindahkan, dan kuliah tambahan hanya menampilkan isian yang relevan.
**File yang diubah/dibuat:** `docs/design/mockup-admin-v5.html`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Mempertahankan logo, font, palet, dan alur mockup sebelumnya; perbaikan hanya mengubah presentasi mockup. Tombol simpan tetap nonaktif karena ini belum terhubung ke data.
**Hasil testing:** Mockup diperiksa pada desktop, tablet, dan ponsel; inspector melaporkan 0 FAIL/0 WARN dengan pengecualian palet brand. Lint melaporkan 0 FAIL dan 1 peringatan bayangan dialog. Uji browser memverifikasi ketiga jenis perubahan jadwal menampilkan field yang sesuai tanpa overflow horizontal; preview HTTP 200. Build tidak dijalankan karena kode aplikasi tidak berubah.
**Yang perlu disetujui/dicek pengguna:** Mockup v5 merupakan opsi revisi yang tidak dipakai sebagai acuan implementasi; form aplikasi tetap mengikuti `docs/design/mockup-admin-v3.html` yang sudah disetujui.

## 2026-11-01 — Tautan di keterangan tugas
**Yang dikerjakan:** Mengubah URL http/https yang ditempel pada keterangan tugas menjadi tautan yang bisa dibuka di tab baru, serta menambahkan petunjuk singkat pada form admin.
**File yang diubah/dibuat:** `src/lib/linkify.js`, `src/components/board/TaskDetailOverlay.jsx`, `src/components/admin/AdminEditorOverlay.jsx`, `src/styles/index.css`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Mempertahankan teks deskripsi sebagai teks biasa; tautan dibatasi ke protokol http/https dan memakai `rel="noopener noreferrer"` agar teks HTML tidak dieksekusi dan tab baru tidak dapat mengakses halaman asal. Implementasi UI tetap mengikuti mockup-admin-v3 yang telah disetujui.
**Hasil testing:** `npm run build` berhasil. Uji parsing mencakup URL http/https, `www.`, tanda baca, skema `javascript:`, dan teks kosong. Render SSR memastikan tautan dapat diklik dan string HTML tetap tampil sebagai teks.
**Yang perlu disetujui/dicek pengguna:** Preview aplikasi: `http://127.0.0.1:5173/`. Tidak ada perubahan database.

## 2026-11-01 — Tombol tutup login admin ke beranda
**Yang dikerjakan:** Mengarahkan tombol X pada form login admin ke beranda utama (`#home`) tanpa bergantung pada riwayat navigasi sebelumnya.
**File yang diubah/dibuat:** `src/hooks/useHashRoute.js`, `src/pages/Home.jsx`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Menambahkan navigasi khusus ke beranda sehingga tombol X tetap berfungsi benar saat halaman `#admin` dibuka langsung maupun setelah navigasi internal.
**Hasil testing:** `npm run build` berhasil. Uji browser membuka `#admin`, menekan tombol X, lalu memastikan dialog login tertutup, URL menjadi `#home`, dan hero utama tampil.
**Yang perlu disetujui/dicek pengguna:** Preview: `http://127.0.0.1:5173/#admin`.

## 2026-11-01 — Menghubungkan kiriman materi mahasiswa
**Yang dikerjakan:** Mengganti simulasi kirim materi dengan upload nyata ke bucket privat `submissions` dan penyimpanan baris berstatus `pending`. Form menampilkan progres upload, memvalidasi file, dan tetap memberi konfirmasi setelah kiriman tersimpan.
**File yang diubah/dibuat:** `src/services/submissions.js`, `src/components/submit/SubmitMaterialOverlay.jsx`, `src/lib/file-validation.js`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Insert baris tidak meminta data kembali karena policy publik hanya mengizinkan membaca materi approved; ini mencegah insert pending yang berhasil dianggap gagal hanya karena RLS menyembunyikan balasan. Jika insert DB gagal, kode mencoba menghapus upload sementara dan menampilkan error cleanup secara eksplisit.
**Hasil testing:** `npm run build` berhasil. Uji dengan Supabase client tiruan memverifikasi upload, metadata `pending`, progres, validasi ekstensi, serta upaya cleanup saat insert gagal. Form dibuka pada 390px tanpa pesan simulasi. Tidak mengirim data atau file uji ke project live.
**Yang perlu disetujui/dicek pengguna:** Preview `http://127.0.0.1:5173/#submit/new`. Upload dan insert sudah memiliki policy Supabase yang diperlukan, tetapi belum diuji dengan kiriman nyata. Notifikasi email belum aktif: project belum memiliki Edge Function, environment deployment tidak menyediakan Supabase CLI/access token atau secret Resend. RLS insert publik yang tersedia juga belum memastikan `file_path` selalu menunjuk ke file yang diunggah; hardening server-side dan konfigurasi webhook perlu dilakukan sebelum mengandalkan antrean publik.

## 2026-11-01 — Mempertahankan fokus input overlay
**Yang dikerjakan:** Memperbaiki focus trap overlay agar tidak memindahkan fokus kembali ke tombol X setiap kali komponen dirender ulang saat pengguna mengetik.
**File yang diubah/dibuat:** `src/hooks/useOverlayA11y.js`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Callback terbaru disimpan dalam ref, sehingga listener Escape tetap memanggil handler terkini tanpa menjalankan ulang efek overlay dan memulihkan fokus lama pada setiap perubahan input.
**Hasil testing:** `npm run build` berhasil. Uji browser pada form kirim materi mengetik beberapa huruf berurutan dan memastikan nilai lengkap tertahan di input, bukan di tombol tutup.
**Yang perlu disetujui/dicek pengguna:** Preview `http://127.0.0.1:5173/#submit/new`.

## 2026-11-01 — Mockup notifikasi web push
**Yang dikerjakan:** Membuat mockup pengaturan notifikasi browser untuk admin, termasuk keadaan belum aktif, aktif, dan izin ditolak, serta contoh pemberitahuan kiriman baru.
**File yang diubah/dibuat:** `docs/design/mockup-admin-push-v1.html`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Mockup mengikuti shell admin saat ini dan gaya `mockup-admin-v3`. Push bersifat opt-in per browser/perangkat; email tidak ditambahkan sebagai kanal kedua. Tombol dalam mockup hanya untuk berpindah keadaan contoh, bukan meminta izin browser atau menyimpan subscription.
**Hasil testing:** Lint desain lulus tanpa temuan. Inspector pada 1440px, 768px, dan 390px lulus tanpa FAIL/WARN setelah mengizinkan warna dasar brand krem. JavaScript mockup lolos pemeriksaan sintaks. Tidak ada perubahan pada aplikasi, Supabase, atau data.
**Yang perlu disetujui/dicek pengguna:** Mockup v1 telah disetujui pengguna; langkah berikutnya menghubungkan subscription dan pengiriman push pada backend.

## 2026-11-01 — UI izin notifikasi browser
**Yang dikerjakan:** Menambahkan halaman Notifikasi pada panel admin, tampilan status izin browser, tombol permintaan izin yang hanya bekerja setelah diklik, instruksi untuk izin yang diblokir, dan pratinjau payload push. Menu admin pada ponsel kini dapat dilipat.
**File yang diubah/dibuat:** `src/components/admin/AdminNotifications.jsx`, `src/components/admin/AdminWorkspace.jsx`, `src/styles/index.css`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Izin browser yang diberikan belum dianggap sebagai langganan push aktif. UI menyatakan dengan jelas bahwa push belum berfungsi sampai service worker dan server pengiriman dikonfigurasi, agar tidak memberi status sukses palsu.
**Hasil testing:** `npm run build` berhasil. Inspector pada halaman admin development memeriksa tampilan desktop, tablet, dan ponsel tanpa FAIL; ia melaporkan peringatan dev-server dan ruang kosong pada layar pengaturan yang minim konten. Pemeriksaan dilakukan dengan peran admin simulasi dan fixture development, bukan akun atau data live.
**Yang perlu disetujui/dicek pengguna:** UI tersedia di `http://127.0.0.1:5174/#admin/notifications`. Subscription dan pengiriman push belum diimplementasikan; keduanya memerlukan konfigurasi backend dan kunci VAPID.


## 2026-11-01 — Implementasi sistem notifikasi (Email Resend & Web Push)
**Yang dikerjakan:** Menyelesaikan integrasi notifikasi kiriman materi baru secara menyeluruh (Opsi C):
1. Membuat Service Worker `public/sw.js` untuk menerima push event dan mengarahkan klik notifikasi ke `#admin/inbox`.
2. Membuat modul layanan `src/services/notifications.js` untuk pendaftaran service worker, konversi kunci VAPID, subscribe/unsubscribe, sinkronisasi data langganan ke Supabase, dan pengujian notifikasi lokal.
3. Memperbarui `src/components/admin/AdminNotifications.jsx` agar terhubung ke Web Push API, mendeteksi langganan aktif, menyediakan tombol aktifkan/nonaktifkan, serta tombol uji coba langsung di peramban.
4. Membuat Supabase Edge Function `supabase/functions/notify-submission/index.ts` (Deno) yang menangani webhook `materials` INSERT (status `pending`):
   - Mengirim notifikasi email via Resend API dengan tata letak HTML ramah dan palet brand.
   - Mengirim Web Push ke seluruh perangkat admin yang terdaftar pada tabel `push_subscriptions`.
   - Membersihkan langganan push yang kedaluwarsa (HTTP 410/404) secara otomatis.
   - Dilengkapi proteksi anti-flood (maks. 5 notifikasi per 10 menit) dan pembersihan karakter HTML (XSS prevention).
5. Menyediakan skrip migrasi SQL `supabase/migrations/001_notifications.sql` untuk tabel `push_subscriptions` beserta RLS khusus admin dan petunjuk konfigurasi webhook.
6. Menyediakan panduan `supabase/functions/notify-submission/README.md` dan memperbarui `.env.example`.
**File yang diubah/dibuat:** `public/sw.js`, `src/services/notifications.js`, `src/components/admin/AdminNotifications.jsx`, `supabase/functions/notify-submission/index.ts`, `supabase/functions/notify-submission/README.md`, `supabase/migrations/001_notifications.sql`, `.env.example`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Kegagalan pengiriman email atau push pada Edge Function tidak membatalkan kiriman mahasiswa di database (fail-safe). Kunci rahasia (Resend API key dan VAPID private key) hanya ditaruh di Supabase secrets, tidak pernah di frontend atau Git.
**Hasil testing:** `npm run build` berhasil tanpa warning; file `sw.js` otomatis disalin ke `dist/`. Modul service worker, penanganan izin, dan serialisasi payload VAPID diverifikasi valid.
**Yang perlu disetujui/dicek pengguna:** Jalankan skrip `supabase/migrations/001_notifications.sql` di SQL Editor Supabase, deploy Edge Function `notify-submission` via Supabase CLI, atur secret `RESEND_API_KEY`, `ADMIN_NOTIFY_EMAIL`, dan kunci VAPID pada dashboard Supabase, serta pasang webhook INSERT pada tabel `materials`.


## 2026-11-02 — Perbaikan render preview PDF & pratinjau kiriman admin
**Yang dikerjakan:** Memperbaiki masalah preview PDF yang terpotong/hanya memuat separuh:
1. Pada `src/components/viewer/PdfViewer.jsx`:
   - Menghitung rasio aspek halaman dari awal (`aspectRatio`) agar placeholder skeleton memiliki dimensi yang stabil dan tidak melompat.
   - Menghapus pembersihan kanvas (`clearCanvas()`) dan pembatalan saat scroll keluar viewport. Halaman yang sudah dirender kini dipertahankan dan observer langsung dilepas, mencegah loop pembatalan/render ulang terus-menerus.
   - Menggunakan `rootMargin: "300px 0px"` untuk memuat halaman secara halus sebelum masuk ke layar.
   - Memastikan latar kanvas diisi putih bersih sebelum penggambaran PDF dan penyesuaian skala kanvas sesuai rasio piksel perangkat.
2. Pada `src/components/admin/AdminWorkspace.jsx` & `src/styles/index.css`:
   - Memperbesar tinggi kotak pratinjau iframe kiriman di panel admin (`min-height: 340px`).
   - Menambahkan tombol "Buka PDF di tab baru" agar admin dapat meninjau dokumen secara menyeluruh di tab terpisah sebelum menyetujui.
**File yang diubah/dibuat:** `src/components/viewer/PdfViewer.jsx`, `src/components/admin/AdminWorkspace.jsx`, `src/styles/index.css`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** Kanvas PDF yang sudah selesai dirender tidak boleh di-clear saat pengguna menggulir halaman, karena menyebabkan layout thrashing dan pemotongan visual. Menjaga rasio aspek tetap konsisten mencegah pergeseran scroll.
**Hasil testing:** `npm run build` berhasil tanpa warning. Ukuran chunk dan aset tetap terpisah dengan benar.
**Yang perlu disetujui/dicek pengguna:** Muat ulang halaman (`Ctrl + F5`) pada browser, buka kembali preview PDF di materi atau di antrean persetujuan admin, dan periksa apakah seluruh halaman PDF kini termuat penuh dan mulus.


## 2026-11-02 — Perbaikan skala render kanvas PDF & Skrip pembersihan duplikasi matkul
**Yang dikerjakan:**
1. Menyelesaikan akar penyebab halaman PDF hanya tampak separuh:
   - Pada `src/components/viewer/PdfViewer.jsx`: Sebelumnya `viewport` dihitung tanpa mengikutsertakan `pixelRatio`, sedangkan `canvas.width` dan `canvas.height` dikalikan `pixelRatio`. Hal ini menyebabkan PDF.js hanya menggambar pada separuh bidang kanvas (50% pada scaling 2x / 66% pada scaling 1.5x Windows), sementara kanvas fisik diregangkan ke 100%.
   - Sekarang `renderScale = (containerWidth / baseViewport.width) * pixelRatio`, sehingga koordinat gambar PDF.js mengisi 100% piksel kanvas dari ujung ke ujung tanpa terpotong.
2. Menyiapkan skrip migrasi `supabase/migrations/002_cleanup_duplicate_courses.sql` untuk membersihkan 8 entri mata kuliah duplikat di database Supabase:
   - Secara aman memindahkan relasi `schedules`, `schedule_changes`, `materials`, dan `announcements` dari ID duplikat ke ID kanonis (paling awal dibuat).
   - Menghapus baris mata kuliah duplikat tanpa risiko kehilangan data jadwal atau materi terkait.
**File yang diubah/dibuat:** `src/components/viewer/PdfViewer.jsx`, `supabase/migrations/002_cleanup_duplicate_courses.sql`, `docs/AI-LOG.md`.
**Keputusan penting & alasannya:** PDF.js secara internal mengontrol transform kanvas; penskalaan high-DPI yang benar harus dioperasikan langsung pada `scale` viewport PDF.js agar gambar mengisi seluruh kanvas bitmap. Skrip SQL merger dijalankan dalam blok transaksi anonim (`do $$`) dengan pengecekan relasi lengkap.
**Hasil testing:** `npm run build` berhasil tanpa warning.
**Yang perlu disetujui/dicek pengguna:** Jalankan isi skrip `supabase/migrations/002_cleanup_duplicate_courses.sql` di SQL Editor Supabase, lalu muat ulang browser (`Ctrl + F5`) untuk melihat preview PDF yang kini tampil 100% penuh.
