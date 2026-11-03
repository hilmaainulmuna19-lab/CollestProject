/** DATA DUMMY vendor untuk contoh. Semua pemesanan lewat Admin COLLEST. */
export const VENDORS = [
  {
    id: 'v-catering-01',
    name: 'Dapur Kampus Catering',
    category: 'Konsumsi / Catering',
    owner: 'Bu Rina',
    address: 'Jl. Margonda Raya No. 45, Beji, Kota Depok, Jawa Barat',
    area: 'Depok, Jakarta Selatan, Bogor',
    readyHours: 'Setiap hari, 06.00 - 20.00 WIB',
    pricingModel: 'Per paket / per porsi',
    prices: [
      { label: 'Nasi Box Hemat', price: 22000, unit: 'box', note: 'Nasi, ayam goreng, tumis sayur, kerupuk. Min. 50 box.' },
      { label: 'Nasi Box Spesial', price: 30000, unit: 'box', note: 'Nasi, ayam bakar/geprek, tumisan, buah, air mineral. Min. 50 box.' },
      { label: 'Snack Box', price: 15000, unit: 'box', note: '2 kue basah + 1 gorengan + air mineral. Min. 50 box.' },
      { label: 'Coffee Break', price: 20000, unit: 'orang', note: 'Kopi/teh tanpa batas + 2 jajanan. Min. 30 orang.' }
    ],
    specs: [
      'Menu ready: ayam bakar, ayam geprek, ayam goreng kremes, rica-rica, nasi kuning',
      'Bisa request tanpa pedas / porsi vegetarian (informasikan H-3)',
      'Kapasitas produksi hingga 500 porsi per hari',
      'Pengantaran dengan mobil boks, bisa diatur sesuai jadwal acara'
    ],
    terms: 'Pesan minimal H-3 · DP 30% · Gratis ongkir area Depok untuk pemesanan 100 box ke atas',
    defaultSpecs: 'Menu: Nasi Box Spesial (ayam bakar), sambal dipisah.\nDibagikan untuk peserta, panitia, dan pembicara.\nPengantaran ke lokasi acara, mohon konfirmasi jam tiba.'
  },
  {
    id: 'v-sound-01',
    name: 'Nada Prima Sound & Lighting',
    category: 'Sound System & Lighting',
    owner: 'Pak Dedi',
    address: 'Jl. Raya Sawangan No. 12, Pancoran Mas, Kota Depok, Jawa Barat',
    area: 'Seluruh Jabodetabek',
    readyHours: 'Setiap hari, 07.00 - 23.00 WIB (setup min. 2 jam sebelum acara)',
    pricingModel: 'Per paket (durasi tertentu) + tambahan per jam',
    prices: [
      { label: 'Paket A: Indoor s.d. 150 orang (6 jam)', price: 1500000, unit: 'paket', note: '2 speaker aktif 15", mixer 12 channel, 2 mic wireless, 2 mic kabel, 1 operator.' },
      { label: 'Paket B: Indoor/Outdoor s.d. 500 orang (8 jam)', price: 3500000, unit: 'paket', note: '4 speaker aktif + 2 subwoofer, mixer 24 channel, 4 mic wireless, monitor panggung, 2 operator.' },
      { label: 'Tambahan Lighting LED Par', price: 750000, unit: 'paket', note: '12 lampu LED par + controller.' },
      { label: 'Overtime', price: 200000, unit: 'jam', note: 'Berlaku jika melebihi durasi paket.' }
    ],
    specs: [
      'Sudah termasuk operator, kabel, dan stand mic',
      'Bisa tambah live band / DJ set (konfirmasi H-7)',
      'Genset tersedia untuk acara outdoor (Rp500.000 per acara)',
      'Gladi resik / soundcheck gratis 1 jam sebelum acara'
    ],
    terms: 'Booking minimal H-5 · DP 50% · Pelunasan di hari-H sebelum acara mulai',
    defaultSpecs: 'Kebutuhan: sound system untuk seminar dengan 2 pembicara dan sesi tanya jawab.\nButuh 2 mic wireless untuk moderator dan pembicara + 1 mic untuk peserta.\nSetup 2 jam sebelum acara dimulai.'
  },
  {
    id: 'v-stage-01',
    name: 'Panggung Jaya Rental',
    category: 'Panggung & Tenda',
    owner: 'Pak Jaya',
    address: 'Jl. Raya Bojongsari No. 88, Bojongsari, Kota Depok, Jawa Barat',
    area: 'Depok, Bogor, Tangerang Selatan, Jakarta',
    readyHours: 'Setiap hari, pemasangan mulai 06.00 WIB, pembongkaran maks. 23.00 WIB',
    pricingModel: 'Per hari / per unit',
    prices: [
      { label: 'Panggung 4 x 6 m (tinggi 80 cm)', price: 1200000, unit: 'hari', note: 'Termasuk karpet, skirting, dan 1 tangga.' },
      { label: 'Tenda Sarnafil 5 x 5 m', price: 350000, unit: 'unit/hari', note: 'Rangka besi, atap putih, termasuk pasang bongkar.' },
      { label: 'Kursi Futura', price: 3500, unit: 'kursi/hari', note: 'Min. 100 kursi.' },
      { label: 'Backdrop 3 x 6 m', price: 450000, unit: 'paket', note: 'Rangka + banner (desain dari pemesan).' }
    ],
    specs: [
      'Kapasitas panggung maksimal 25 orang',
      'Tenda aman untuk hujan ringan, dilengkapi pemberat',
      'Tim pasang 4 orang, estimasi 3 jam untuk panggung + 4 tenda',
      'Bisa tambah meja lipat dan taplak (Rp25.000 per meja)'
    ],
    terms: 'Booking minimal H-7 · DP 50% · Ongkir mengikuti jarak (info setelah lokasi dikonfirmasi)',
    defaultSpecs: 'Kebutuhan: 1 panggung 4x6 m dan 2 tenda 5x5 m untuk area registrasi.\nPemasangan paling lambat H-1 sore, pembongkaran setelah acara selesai.'
  },
  {
    id: 'v-catering-02',
    name: 'Warung Bu Tini Catering',
    category: 'Konsumsi / Catering',
    owner: 'Bu Tini',
    address: 'Jl. Raya Bogor Km 30, Cimanggis, Kota Depok, Jawa Barat',
    area: 'Depok, Bogor',
    readyHours: 'Senin - Sabtu, 07.00 - 18.00 WIB',
    pricingModel: 'Per porsi',
    prices: [
      { label: 'Nasi Kotak Ekonomis', price: 17000, unit: 'box', note: 'Nasi, telur balado, orek tempe, lalapan. Min. 40 box.' },
      { label: 'Tumpeng Mini', price: 45000, unit: 'porsi', note: 'Untuk acara seremonial. Min. 20 porsi.' },
      { label: 'Snack Tradisional', price: 9000, unit: 'box', note: '2 jajan pasar + air mineral. Min. 40 box.' }
    ],
    specs: [
      'Menu rumahan, bisa request tanpa MSG',
      'Kapasitas produksi hingga 250 porsi per hari',
      'Pengantaran dengan motor boks area Depok dan Bogor'
    ],
    terms: 'Pesan minimal H-2 · DP 25% · Pelunasan saat pengantaran',
    defaultSpecs: 'Menu: Nasi Kotak Ekonomis, sambal dipisah.\nUntuk peserta dan panitia.\nMohon konfirmasi jam tiba di lokasi.'
  },
  {
    id: 'v-catering-03',
    name: 'Kenyang Jaya Premium Catering',
    category: 'Konsumsi / Catering',
    owner: 'Pak Hendra',
    address: 'Jl. TB Simatupang No. 8, Pasar Minggu, Jakarta Selatan',
    area: 'Jakarta, Tangerang Selatan, Depok',
    readyHours: 'Setiap hari, 06.00 - 21.00 WIB',
    pricingModel: 'Per paket / per orang',
    prices: [
      { label: 'Lunch Box Premium', price: 48000, unit: 'box', note: 'Nasi, steak ayam / dori, salad, buah, dessert. Min. 30 box.' },
      { label: 'Buffet Prasmanan (s.d. 100 orang)', price: 65000, unit: 'orang', note: 'Include meja prasmanan, petugas, dan peralatan. Min. 50 orang.' },
      { label: 'Coffee Break Premium', price: 35000, unit: 'orang', note: 'Kopi, teh, 3 jenis pastry. Min. 30 orang.' }
    ],
    specs: [
      'Cocok untuk seminar nasional dan gala dinner',
      'Chef dan pramusaji disediakan untuk paket buffet',
      'Menu halal tersertifikasi'
    ],
    terms: 'Pesan minimal H-5 · DP 50% · Ongkir dihitung per jarak',
    defaultSpecs: 'Paket: Lunch Box Premium untuk pembicara dan tamu undangan.\nMohon dipisah label untuk vegetarian.'
  },
  {
    id: 'v-sound-02',
    name: 'Studio Gema Audio',
    category: 'Sound System & Lighting',
    owner: 'Mas Raka',
    address: 'Jl. Kelapa Dua Wetan No. 3, Ciracas, Jakarta Timur',
    area: 'Jakarta, Bekasi, Depok',
    readyHours: 'Setiap hari, 08.00 - 22.00 WIB',
    pricingModel: 'Per paket + tambahan per jam',
    prices: [
      { label: 'Paket Mini: ruang kelas s.d. 60 orang (4 jam)', price: 450000, unit: 'paket', note: '1 speaker aktif 12", 1 mixer 8 channel, 2 mic wireless, 1 operator.' },
      { label: 'Paket Seminar s.d. 200 orang (6 jam)', price: 1200000, unit: 'paket', note: '2 speaker aktif 15", mixer 12 channel, 3 mic wireless, 1 operator.' },
      { label: 'Tambahan Proyektor + Layar', price: 350000, unit: 'paket', note: 'Proyektor 4000 lumens + layar tripod 2 m.' }
    ],
    specs: [
      'Paket kecil cocok untuk workshop dan rapat besar',
      'Operator ikut hingga acara selesai',
      'Boleh sewa tanpa operator dengan potongan 20%'
    ],
    terms: 'Booking minimal H-3 · DP 40% · Pelunasan H-1',
    defaultSpecs: 'Kebutuhan: sound ringan untuk workshop 50 peserta.\nButuh 2 mic wireless dan input laptop.\nSetup 1 jam sebelum acara.'
  },
  {
    id: 'v-panggung-02',
    name: 'Tenda Berkah Event',
    category: 'Panggung & Tenda',
    owner: 'Pak Samsul',
    address: 'Jl. Raya Serpong No. 21, Serpong, Tangerang Selatan, Banten',
    area: 'Tangerang Selatan, Jakarta, Depok',
    readyHours: 'Setiap hari, 06.00 - 20.00 WIB',
    pricingModel: 'Per unit / per hari',
    prices: [
      { label: 'Tenda Kerucut 5 × 5 m', price: 300000, unit: 'unit/hari', note: 'Sudah termasuk pasang dan bongkar.' },
      { label: 'Kursi Chitose', price: 2500, unit: 'kursi/hari', note: 'Min. 100 kursi.' },
      { label: 'Panggung Modular 3 × 6 m', price: 2200000, unit: 'hari', note: 'Tinggi 60 cm, karpet, tangga, skirting hitam.' }
    ],
    specs: [
      'Kapasitas tenda tersedia hingga 40 unit',
      'Tim pasang 4 orang, estimasi 2 jam per panggung',
      'Tersedia backdrop dan meja tambahan'
    ],
    terms: 'Booking minimal H-5 · DP 50% · Ongkir mengikuti jarak',
    defaultSpecs: 'Kebutuhan: 4 tenda 5 × 5 m dan 200 kursi untuk bazar kampus.\nAkses truk dari gerbang belakang kampus.'
  },
  {
    id: 'v-sound-03',
    name: 'Rajawali Pro Sound & Lighting',
    category: 'Sound System & Lighting',
    owner: 'Pak Anton',
    address: 'Jl. Ahmad Yani No. 77, Bekasi Selatan, Kota Bekasi',
    area: 'Bekasi, Jakarta, Bogor',
    readyHours: 'Setiap hari, 24 jam (dengan konfirmasi)',
    pricingModel: 'Per paket konser',
    prices: [
      { label: 'Paket Konser Outdoor s.d. 1.000 orang (10 jam)', price: 7500000, unit: 'paket', note: 'Line array 8 box, 4 subwoofer, mixer digital, 6 mic, lighting moving head, 3 operator.' },
      { label: 'Tambahan LED Wall 4 × 3 m', price: 3500000, unit: 'paket', note: 'Layar LED indoor/outdoor + operator visual.' }
    ],
    specs: [
      'Cocok untuk konser kampus dan festival musik',
      'Genset silent 20 kVA termasuk paket konser',
      'Sudah termasuk gladi bersih'
    ],
    terms: 'Booking minimal H-14 · DP 50% · Pelunasan H-3',
    defaultSpecs: 'Kebutuhan: konser outdoor 800 penonton, 4 band.\nPanggung 8 × 6 m sudah disiapkan panitia.'
  },
  {
    id: 'v-foto-01',
    name: 'Lensa Kampus Studio',
    category: 'Fotografi & Dokumentasi',
    owner: 'Mas Dimas',
    address: 'Jl. Margonda Raya No. 210, Pancoran Mas, Kota Depok',
    area: 'Depok, Jakarta, Bogor, Tangerang Selatan',
    readyHours: 'Setiap hari, 07.00 - 22.00 WIB',
    pricingModel: 'Per paket durasi',
    prices: [
      { label: 'Paket Foto Event 4 jam', price: 750000, unit: 'paket', note: '1 fotografer, minimal 150 foto hasil edit, file via Google Drive.' },
      { label: 'Paket Foto + Video Highlight 8 jam', price: 2200000, unit: 'paket', note: '1 fotografer + 1 videografer, video highlight 2-3 menit.' }
    ],
    specs: [
      'Hasil foto diedit dasar (warna dan crop)',
      'File dikirim maksimal 3 hari setelah acara',
      'Cocok untuk seminar, wisuda, dan acara organisasi'
    ],
    terms: 'Booking minimal H-7 · DP 30% · Pelunasan H-1',
    defaultSpecs: 'Kebutuhan: dokumentasi foto seminar 4 jam.\nMohon sertakan foto bersama panitia dan sesi pembicara.'
  },
  {
    id: 'v-foto-02',
    name: 'Momen Bazar Dokumentasi',
    category: 'Fotografi & Dokumentasi',
    owner: 'Kak Rani',
    address: 'Jl. Kalibata Raya No. 18, Pancoran, Jakarta Selatan',
    area: 'Jakarta, Depok, Bekasi',
    readyHours: 'Senin - Sabtu, 08.00 - 20.00 WIB',
    pricingModel: 'Per paket acara',
    prices: [
      { label: 'Paket Foto Bazar / Festival 6 jam', price: 1200000, unit: 'paket', note: '2 fotografer, minimal 300 foto, termasuk foto booth UMKM.' },
      { label: 'Tambahan Drone 1 jam', price: 600000, unit: 'paket', note: 'Foto dan video udara area acara (butuh izin lokasi).' }
    ],
    specs: [
      'Cocok untuk bazar, konser, dan festival',
      '2 fotografer bergerak bergantian',
      'Foto unggulan dikirim H+1 untuk keperluan media sosial'
    ],
    terms: 'Booking minimal H-10 · DP 50% · Pelunasan H-2',
    defaultSpecs: 'Kebutuhan: dokumentasi bazar UMKM 6 jam.\nFokus pada suasana pengunjung dan booth.'
  }
];
