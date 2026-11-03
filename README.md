# COLLEST — One Platform, Every Event Need

**Tagline:** One Platform, Every Event Need.  
**Tipe Proyek:** Web App Prototype (Multi-Page Minimalist) untuk Tugas Kuliah Algoritma & Pemrograman.  
**Tech Stack:** HTML5, CSS3, JavaScript ES Modules (Vanilla, tanpa framework eksternal).

---

## 1. Struktur Halaman Terpisah (Multi-Page)
Setiap fitur ditempatkan pada halaman terpisah agar navigasi tidak menumpuk di beranda:

1. **Beranda (`index.html`)**:
   Halaman depan yang bersih dan minimalis, menyajikan tombol login dan tiga kartu menuju fitur.
2. **Cari Event & Kepanitiaan (`events.html`)**:
   Halaman khusus untuk mencari open recruitment panitia acara kampus, melihat detail jobdesk dan persyaratan, serta mendaftar langsung di website (data tersimpan sementara di browser dan hanya terlihat di Area Organizer oleh akun panitia).
3. **Buat Rundown Acara (`rundown.html`)**:
   Halaman khusus untuk menyusun jadwal acara otomatis berdasarkan jam mulai dan durasi menit per sesi, lengkap dengan tombol salin teks rundown.
4. **Cari Vendor & Chat WhatsApp (`vendors.html`)**:
   Halaman khusus katalog vendor (konsumsi, audio, panggung, fotografi). Pilih satu vendor per jenis, isi detail acara sekali, lalu kirim satu pesan WhatsApp gabungan atau per vendor.

---

## 2. Palet Warna & Desain Bersih
- **Charcoal Black (`#121417`, `#1a1d24`)**: Warna dasar tipografi dan background footer.
- **Royal Blue (`#1d4ed8`, `#1e40af`)**: Warna tombol dan tautan aktif utama.
- **Tangerine Orange (`#f97316`)**: Aksen halus pada badge kategori dan sorotan kecil.
- **Pemakaian**: charcoal untuk hero, tabel, footer; royal blue untuk aksi utama; tangerine hanya aksen kecil (garis, benefit fee, percikan).

---

## 2b. Struktur Folder
```
index.html  events.html  vendors.html  rundown.html  admin.html   halaman (satu file per halaman)
server.js  package.json                                           server lokal (node server.js)
assets/        collest-logo.png
css/
  base.css          token desain (warna, font), reset, tata letak dasar
  header.css        header melayang, navigasi, tombol akun
  tiles.css         latar tile gradasi
  components.css    badge, tombol, kartu, form, tabel, pratinjau WhatsApp, dialog, footer
  pages/            home.css, events.css, vendors.css (khusus satu halaman)
js/
  shared/           auth.js (login hardcode + peran), account.js, ui.js, config.js
  pages/            satu pengendali per halaman: home, events, vendors, rundown, admin (+ admin-panel)
  features/         logika dan data: events-store, vendors-data, vendor-order, rundown
  utils/            formatters.js, validators.js
```
Urutan memuat CSS di tiap halaman: base, header, tiles, components, lalu css halaman itu. Satu halaman HTML memuat satu file JS di `js/pages/`.

Login demo: `mahasiswa / collest123` (user biasa) dan `panitia / panitia123` (organizer, satu-satunya yang boleh membuka Area Organizer).

## 3. Cara Menjalankan Website (Live Server)

Jalankan perintah berikut di terminal:
```bash
node server.js
```
Lalu buka peramban di:
👉 **http://localhost:3000**
- Beranda: `http://localhost:3000/index.html`
- Cari Event: `http://localhost:3000/events.html`
- Buat Rundown: `http://localhost:3000/rundown.html`
- Cari Vendor: `http://localhost:3000/vendors.html`
