# Referensi Desain — Tumpukan Materi

Baca file ini sebelum mengerjakan atau merevisi desain apa pun. Jika ada gambar yang dilampirkan di chat, gambar itu menjadi acuan utama, dan file ini menjelaskan apa yang harus diambil dari tiap gambar.

## Isi folder

| File | Fungsi |
|---|---|
| `mockup-v1.html` | Mockup pertama (terlalu flat, perlu direvisi). Simpan sebagai riwayat. |
| `mockup-v2.html` | Mockup hasil revisi (dibuat setelah v1). |
| `ref-vibe-meja.jpg` | Referensi suasana utama |
| `ref-catatan-grid.jpg` | Referensi kertas catatan untuk tugas di mading |
| `ref-deck.gif` | Referensi mekanik tumpukan kartu |
| `ref-jadwal.jpg` | Referensi tampilan jadwal |
| `logo/` | Logo resmi website (jangan digambar ulang) |

## Arahan per referensi

### ref-vibe-meja.jpg — suasana meja belajar / scrapbook
**Ambil:**
- Konsep "alas meja": permukaan bergaris grid (seperti cutting mat) tempat kertas-kertas ditempel.
- Kertas bergaya buku catatan dengan tepi sobek atau berlubang, dijepit **binder clip** berwarna.
- Kertas dan kartu agak **miring** (1 sampai 3 derajat), bertumpuk, dengan bayangan yang membuatnya terasa menempel di papan.
- Judul besar dan berkarakter di atas kertas.

**Terapkan ke:** hero (kertas besar bertumpuk), kartu mata kuliah di deck (kertas dengan binder clip), section board tugas (papan dengan kertas tempel).

**Jangan ambil:** warna biru terang, font pixel, ilustrasi 3D (folder, gunting, penggaris, pensil), foto dan teks aslinya. Gambar ini hanya acuan gaya. Buat ilustrasi orisinal.

**Adaptasi warna:** pakai hijau tua sebagai alas grid (bukan biru) supaya tetap sesuai palet website, dengan bingkai kayu seperti di acuan.

### ref-catatan-grid.jpg — kertas catatan
**Ambil:** kertas krem berpola grid tipis, sudut membulat, **paperclip** di pojok kiri atas, bayangan tipis di bawah.
**Terapkan ke:** setiap tugas di board (satu tugas = satu catatan). Variasikan warna kertas (krem, kuning mustard muda, hijau sage muda, biru dusty muda) dan kemiringannya.
**Jangan ambil:** tidak ada, boleh ditiru bebas karena sederhana. Buat dengan CSS dan SVG, bukan gambar.

### ref-deck.gif — mekanik tumpukan kartu
GIF ini animasi, dan AI mungkin hanya membaca satu frame. Gerakannya dijelaskan di sini:
- Kartu depan besar, 2 kartu di belakang mengintip di sisi kanan (lebih kecil dan lebih redup).
- Saat di-swipe ke kiri, kartu depan keluar, kartu belakang maju dan membesar ke posisi depan.
- Judul besar tebal di bagian bawah kartu depan.

**Ambil:** mekaniknya saja.
**Jangan ambil:** latar putih, foto ubur-ubur, warna biru neon, dan ikon aplikasi.

### ref-jadwal.jpg — tampilan jadwal
(Dugaan: file ini dimaksudkan untuk jadwal/papan. Jika salah, perbaiki bagian ini.)
**Ambil:** blok jadwal berbentuk kartu dengan sudut membulat, tiap blok berwarna berbeda, blok yang aktif/penting memakai warna aksen kontras, kolom per hari dengan tanggal besar.
**Terapkan ke:** jadwal seminggu (WeekSchedule) dan kartu "Jadwal hari ini".
**Jangan ambil:** palet ungu dan hijau neon, mode gelap, sidebar ikon.

## Prinsip desain (hindari kesan flat)

1. **Berlapis:** alas, kertas, lalu elemen kecil (clip, tape, catatan). Setiap lapisan punya warna dan bayangan sendiri.
2. **Setiap section punya latar penuh (full-bleed) dan memenuhi tinggi layar** (`min-height: 100svh`), tanpa konten terpotong, baik isinya ada maupun kosong. Latar tiap section adalah "adegan" sendiri:
   - Hero: alas meja kayu hangat dengan kertas, tape, dan alat tulis tersebar.
   - Papan kelas (tugas + jadwal): alas hijau bergaris grid yang memenuhi **seluruh** section (bukan kotak kecil berbingkai di atas latar krem).
   - Deck mata kuliah: permukaan krem berpola grid atau papan gabus, dengan tekstur ringan.
   Jangan membuat blok-blok flat di atas satu warna polos.
3. **Bayangan berlapis, bukan bayangan keras satu lapis.** Bayangan offset tegas dengan border hitam (gaya stiker/neobrutalism) membuat tampilan terasa vektor dan flat, jadi **jangan dipakai sebagai satu-satunya bayangan**. Pakai gabungan bayangan kontak (rapat dan gelap) dan bayangan ambient (lebar dan lembut) seperti di bagian "Sistem kedalaman". Hindari border hitam 1px seragam di semua objek.
4. **Tekstur kertas ringan** lewat CSS atau SVG noise. **Dilarang** memakai gambar tekstur besar.
5. **Warna aksen:** tambahkan mustard, terracotta, dusty blue, sage di samping hijau tua. Gunakan untuk warna kartu mata kuliah, catatan tugas, dan chip deadline.
6. **Tipografi:** judul serif berkarakter (font web sungguhan, mis. Fraunces atau DM Serif Display, bukan hanya Georgia), teks isi sans-serif bersih (mis. DM Sans atau Nunito Sans), dan satu font tulisan tangan sungguhan untuk aksen kecil (mis. Caveat atau Gaegu). **Dilarang memakai `font-family: cursive`** karena hasilnya berbeda di tiap perangkat dan terlihat murahan. Maksimal 3 font, subset dan self-host agar ringan.
7. **Gerak bermakna:** kertas bergeser mengikuti kursor atau scroll di hero, kartu membesar saat dibuka. Hormati `prefers-reduced-motion`.

## Sistem kedalaman (wajib, supaya tidak terasa flat)

Kesan flat muncul bila semua objek berada di bidang yang sama: bayangan seragam, tanpa cahaya, tekstur nyaris tak terlihat, dan semua objek memakai outline gelap. Terapkan sistem berikut.

**1. Tiga tingkat ketinggian (elevation)**, masing-masing bayangan berlapis:
```css
:root {
  --elev-1: 0 1px 1px rgb(40 28 12 / .28), 0 3px 6px -1px rgb(40 28 12 / .22), 0 8px 16px -6px rgb(40 28 12 / .18);
  --elev-2: 0 1px 2px rgb(40 28 12 / .30), 0 6px 10px -2px rgb(40 28 12 / .24), 0 16px 28px -10px rgb(40 28 12 / .28);
  --elev-3: 0 2px 3px rgb(40 28 12 / .32), 0 12px 18px -4px rgb(40 28 12 / .26), 0 28px 44px -14px rgb(40 28 12 / .34);
}
```
- Alas = tanpa bayangan. Kertas/catatan = `elev-1` atau `elev-2`. Kartu yang sedang di-hover/diangkat, kartu depan deck, dan panel yang terbuka = `elev-3`.
- Kertas yang menumpuk punya tingkat berbeda (kertas di atas lebih tinggi daripada di bawahnya).

**2. Cahaya:** satu sumber cahaya dari kiri-atas, konsisten di semua objek.
```css
.paper {
  background:
    linear-gradient(135deg, rgb(255 255 255 / .55), transparent 40%),
    linear-gradient(0deg, rgb(120 90 40 / .10), transparent 35%),
    var(--paper);
  box-shadow: var(--elev-2), inset 0 0 0 1px rgb(255 255 255 / .35);
}
```
Tepi kertas diberi garis terang tipis di atas dan kiri, bukan outline gelap.

**3. Vignette** di setiap section (sudut lebih gelap, tengah lebih terang):
```css
.scene::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(120% 90% at 50% 40%, transparent 55%, rgb(20 12 4 / .35));
}
```

**4. Tekstur yang benar-benar terlihat.** Tambahkan noise halus lewat SVG `feTurbulence` sebagai data-URI ukuran kecil yang diulang (tile sekitar 160x160 px, tanpa file gambar besar). Opasitasnya cukup agar terlihat di layar biasa. Kayu: turbulence yang diregangkan searah (`baseFrequency` sekitar `.01 .6`) untuk serat. Garis grid pada alas hijau harus cukup kontras agar terlihat (jangan di bawah sekitar 8 persen opasitas).

**5. Detail fisik pada objek**
- **Tape** semi-transparan (warna dengan alpha sekitar .7, garis serat tipis, ujung bergerigi lewat `clip-path`), bukan kotak warna solid.
- **Kertas** punya sudut terlipat atau melengkung tipis (gradient di sudut) dan tepi sobek yang meyakinkan (lihat "Tepi sobek yang meyakinkan").
- **Binder clip, paperclip, pin, pensil, tape** memakai **aset siap pakai** dari `docs/design/assets/` (lihat "Aset grafis"). Jangan menggambar ulang dengan CSS.
- **Variasi rotasi dan ukuran:** jangan semua 1 sampai 2 derajat dan ukuran sama. Pakai rentang -4 sampai 4 derajat, kertas berbeda ukuran, dan ada yang tumpang tindih.

**6. Sambungan antar section:** jangan potongan garis lurus. Bagian atas section berikutnya memakai **tepi sobek atau tepi bergelombang** yang menimpa section di atasnya, dan beberapa objek (kertas, clip, pensil) **melewati batas section**.

**7. Interaksi mengangkat:** saat hover/fokus, kertas naik ke `elev-3`, naik sedikit (`translateY(-4px)`), dan rotasinya mendekati 0. Animasikan hanya `transform` dan `opacity` (untuk bayangan, animasikan `opacity` pseudo-element berisi bayangan tingkat atas).

**Batas performa:** noise dan tekstur berupa tile kecil, jangan menerapkan `filter` atau `backdrop-filter` pada area besar atau elemen yang bergerak, dan jangan menganimasikan `box-shadow` pada banyak elemen sekaligus.

## Tepi sobek yang meyakinkan

Tepi sobek buatan `clip-path` zigzag yang teratur terlihat seperti kertas dipotong gunting bergerigi, bukan disobek. Aturannya:
- **Tidak teratur di banyak skala:** gelombang landai besar + gerigi kecil acak. Jarak dan tinggi puncak tidak sama, dan pola **tidak berulang** di sepanjang tepi.
- **Ada lapisan serat:** tepi sobek asli memperlihatkan serat putih/lebih terang. Buat dua lapis: kertas utama di atas, dan lapisan tipis lebih terang (warna sekitar `#fffdf5`, tebal 2 sampai 4 px) yang bentuk tepinya sedikit berbeda dan bergeser ke bawah.
- **Cara membuat:** bangkitkan path tepi dengan algoritma noise/midpoint displacement (seed tetap) lewat skrip sekali jalan, simpan hasilnya sebagai file SVG kecil (di bawah 4 KB) lalu pakai sebagai `mask-image` dengan `mask-size: 100% 100%` (jangan di-tile agar tidak terlihat berulang). Alternatif: SVG filter `feTurbulence` + `feDisplacementMap` pada bentuk tepi.
- **Sediakan minimal 3 variasi bentuk** dan pakai berbeda-beda untuk tiap section/kartu.
- Acuan visual: tepi atas kertas buku catatan di `ref-vibe-meja.jpg` (sobekan dengan perforasi). Jangan membuat sobekan yang bentuknya bisa dihitung polanya.
- Hindari: `clip-path: polygon(...)` dengan titik naik-turun bergantian secara teratur.

## Aset grafis (disiapkan pemilik)

Karena properti hasil kode (CSS/SVG tulisan tangan) terlihat kasar, properti dekoratif memakai aset siap pakai di `docs/design/assets/`.

| Aset | Jumlah | Catatan |
|---|---|---|
| Binder clip | 3 warna (pink, kuning, hijau) | tampak atas, sedikit miring |
| Paperclip | 1 sampai 2 | logam |
| Washi tape / masking tape | 3 warna (mustard, sage, terracotta) | semi-transparan |
| Pensil | 1 | |
| Push pin | 1 sampai 2 warna | |
| Tepi sobek kertas (atas dan bawah) | 3 variasi | berlapis serat putih |
| Strip perforasi buku catatan | 1 | lubang kecil |

Syarat semua aset:
- Latar **transparan**, tanpa bayangan di dalam gambar (bayangan dibuat CSS).
- Pencahayaan konsisten dari kiri-atas, gaya realistis flat-lay yang sama.
- Format WebP atau SVG, **masing-masing di bawah 40 KB**.
- Tanpa merek, logo, atau karakter berhak cipta.
- Penamaan jelas, mis. `binder-clip-pink.webp`, `tape-mustard.webp`, `torn-edge-top-1.svg`.

Jika aset belum ada, Copilot memakai placeholder sederhana dan mencatat kebutuhan aset di `docs/AI-LOG.md`.

## Navbar, logo, dan teks
- **Navbar sticky** di semua section. Logo selalu menjadi link ke beranda. Di hero: logo + "Kirim materi" saja (link section lain tidak ditampilkan karena duplikat dengan dua tombol hero). Setelah keluar dari hero: muncul tambahan "Beranda", "Papan kelas", "Materi" dengan penanda section aktif. Di mobile: logo, ikon rumah, dan "Kirim materi". Tidak boleh ada dua kontrol untuk tujuan yang sama di layar yang sama.
- **Navbar sebagai strip kertas:** latar navbar berupa strip kertas krem selebar layar dengan bayangan `elev-1` dan tepi bawah sedikit bergerigi/sobek. Logo diletakkan langsung di atas strip ini, tanpa kotak berborder tambahan, dengan ruang kosong di sekelilingnya. Dengan begitu logo terasa menyatu dengan desain, bukan ditempel di atas foto meja.
- **Logo:** jangan dibungkus kotak, diberi border, atau digeser menimpa objek lain. Jangan diubah warna atau proporsinya.
- **Teks:** hanya teks yang berfungsi. **Jangan** menambahkan slogan atau kalimat motivasi dekoratif (contoh yang dilarang: "minggu baru, semangat baru"). Teks tulisan tangan hanya untuk label fungsional (mis. nama kolom, "Baru", catatan tugas), bukan hiasan.
- **Anotasi desain** (mis. "kertas bergeser mengikuti kursor") tidak ditampilkan di dalam desain. Tulis di `docs/AI-LOG.md`.

## Layout halaman
- 3 section: Hero, Papan kelas (tugas **dan** jadwal digabung), Deck folder.
- **Deck folder berada di tengah section** (search bar di atas, tumpukan kartu di bawahnya, hint swipe di bawah kartu). Kartu tetangga mengintip di kiri dan kanan. Tidak ada kolom "folder terbuka" statis di samping.
- Folder dan detail tugas selalu berupa **overlay** yang dibuka dari klik: kartu/catatan membesar dari posisinya di atas latar redup.
- Mockup boleh memakai JavaScript ringan **hanya untuk mendemonstrasikan interaksi**: drag kartu deck, klik kartu membuka overlay folder, klik catatan tugas membuka overlay detail tugas. Tetap tanpa backend.
- Hero punya dua tombol: "Lihat papan tugas" dan "Cari materi".
- Jadwal berada di kolom samping papan tugas (desktop) atau tab di section yang sama (mobile). Tidak ada section jadwal terpisah.
- Mockup harus berupa **halaman utuh yang responsif** (bukan hanya bingkai kecil) supaya terlihat jelas bahwa tiap section memenuhi layar.
- Mockup harus punya dua keadaan yang bisa diganti dengan tombol: **data contoh** dan **kosong** (empty state untuk papan tugas, jadwal, deck, dan folder).

## Palet

| Token | Hex | Untuk |
|---|---|---|
| cream | `#F3EBD8` | latar utama |
| paper | `#FBF6E9` | kertas/kartu |
| forest | `#3F5B3A` | alas board, tombol, teks aksen |
| leaf | `#6E8B4E` | aksen sekunder |
| wood | `#8A6A43` | bingkai, papan nama |
| ink | `#2B2A24` | teks |
| mustard | `#D9A441` | aksen, catatan kuning |
| terracotta | `#C4674A` | deadline mendesak, aksen hangat |
| dusty blue | `#7A9BB5` | aksen dingin |
| sage | `#A9BFA0` | catatan hijau muda |

Pastikan kontras teks pada semua warna kertas memenuhi WCAG AA.

## Aturan performa untuk elemen dekoratif
- Grid, tekstur, tepi sobek, clip, dan ikon dibuat dengan CSS atau SVG inline, tanpa gambar bitmap besar.
- Animasi hanya memakai `transform` dan `opacity`.
- Batasi jumlah elemen yang bergerak bersamaan.

## Logo
- Lokasi: `logo/` (salinan acuan) dan file yang dipakai website ada di `src/assets/logo/` serta `public/` (favicon).
- Pakai logo apa adanya. Jangan digambar ulang, diubah proporsinya, atau diganti warnanya.
- Ganti ikon daun placeholder di mockup v1 dengan logo asli ini.
- Jika logo dibutuhkan di latar gelap (alas hijau), siapkan versi terang atau beri tahu pemilik.

## Hak cipta
Semua referensi di folder ini hanya acuan gaya. Jangan menyalin ilustrasi, karakter, atau teks dari referensi ke website.
