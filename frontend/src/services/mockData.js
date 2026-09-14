/**
 * Mock Data Repository for SETARA
 * Provides initial dictionary, news, community, and timeline data.
 */

export const SIBI_VS_BISINDO_DATA = {
  sibi: {
    name: "SIBI (Sistem Isyarat Bahasa Indonesia)",
    tagline: "Sistem Isyarat Berbasis Tata Bahasa Baku",
    type: "Formal & Leksikal",
    status: "Resmi (Kementerian Pendidikan)",
    origin: "Diadaptasi dari ASL & Tata Bahasa Indonesia (1994)",
    description: "SIBI adalah sistem isyarat yang merepresentasikan struktur tata bahasa Indonesia secara linear, mencakup kata dasar, awalan (me-, ber-, di-), akhiran (-kan, -an), dan partikel.",
    advantages: [
      "Mengikuti susunan Subjek-Predikat-Objek-Keterangan (SPOK) formal",
      "Cocok untuk dokumen tertulis, ujian, dan institusi pendidikan formal",
      "Memiliki isyarat khusus untuk afiksasi (imbuhan kata)"
    ],
    challenges: [
      "Gerakan tangan lebih banyak untuk membentuk 1 kata berimbuhan",
      "Kurang fleksibel untuk percakapan sehari-hari"
    ],
    handUsage: "Umumnya Satu Tangan (Dominan) untuk abjad dasar",
    users: "Institusi Pendidikan Luar Biasa (SLB-B), Ujian Resmi, Penerjemah Berita TV"
  },
  bisindo: {
    name: "BISINDO (Bahasa Isyarat Indonesia)",
    tagline: "Bahasa Isyarat Alami Komunitas Tuli",
    type: "Bahasa Alami & Spasial",
    status: "Bahasa Ibu Komunitas Tuli Indonesia (Gerkatin)",
    origin: "Berkembang secara alami dan kultural dari komunitas Tuli Nusantara",
    description: "BISINDO adalah bahasa visual-spasial alami yang kaya akan ekspresi wajah (*non-manual markers*), orientasi ruang, dan tata bahasa visual yang efisien.",
    advantages: [
      "Sangat cepat, fleksibel, dan ekspresif dalam komunikasi interaktif",
      "Ekspresi wajah dan orientasi tubuh menjadi bagian esensial dari makna",
      "Diterima secara luas oleh seluruh komunitas Tuli di Indonesia"
    ],
    challenges: [
      "Memiliki ragam dialek daerah (misal: dialek Jakarta, Yogyakarta, Bali, Padang)",
      "Standardisasi leksikal nasional masih terus berkembang bersama Gerkatin"
    ],
    handUsage: "Dua Tangan (*Two-handed manual alphabet*) & Gerakan Spasial",
    users: "Komunitas Tuli, Aktivis Disabilitas, Penggiat Inklusivitas, Interaksi Sehari-hari"
  }
};

export const INITIAL_NEWS = [
  {
    id: "news-1",
    slug: "revolusi-ai-yolo11-penerjemah-bahasa-isyarat-indonesia",
    judul: "Penerapan YOLO 11 dan AI dalam Menjembatani Komunikasi Komunitas Tuli di Indonesia",
    ringkasan: "Bagaimana teknologi Computer Vision dan pose estimation 21 titik kini mampu mengenali bahasa isyarat SIBI dan BISINDO secara real-time dengan latensi rendah.",
    konten: `
      Perkembangan kecerdasan buatan (AI) di bidang *computer vision* kini membuka babak baru bagi aksesibilitas digital di Indonesia. Dengan hadirnya model terbaru **YOLO 11 Pose Estimation**, deteksi titik sendi tangan (*hand keypoints*) dapat dilakukan hingga 21 titik per tangan secara presisi tanpa memerlukan perangkat keras khusus.

      Dalam platform **SETARA**, teknologi ini dipadukan dengan sequence classifier (LSTM) untuk mengenali rangkaian gestur dinamis dan mengonversinya menjadi teks bahasa Indonesia seketika. Hal ini memungkinkan teman Tuli berkomunikasi dua arah secara natural di ruang publik, layanan kesehatan, maupun perkantoran.
    `,
    kategori: "Teknologi",
    kategoriBadge: "bg-brand-500/10 text-brand-500 border-brand-500/20",
    thumbnail: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    author: "Tim Litbang SETARA",
    tanggal: "28 Agustus 2026",
    views: 1420,
    waktuBaca: "4 menit"
  },
  {
    id: "news-2",
    slug: "memahami-perbedaan-mendasar-sibi-dan-bisindo",
    judul: "Memahami Perbedaan Mendasar SIBI dan BISINDO: Panduan Lengkap untuk Pemula",
    ringkasan: "Kenali latar belakang, filosofi, struktur linguistik, dan konteks penggunaan antara SIBI dan BISINDO agar tidak salah kaprah saat berinteraksi.",
    konten: `
      Seringkali masyarakat awam mengira bahwa bahasa isyarat di seluruh Indonesia adalah seragam. Kenyataannya, terdapat dua sistem utama: **SIBI (Sistem Isyarat Bahasa Indonesia)** dan **BISINDO (Bahasa Isyarat Indonesia)**.

      SIBI diciptakan dengan mengacu pada tata bahasa baku Indonesia termasuk struktur afiksasi (imbuhan), sementara BISINDO adalah bahasa visual alami yang lahir dari budaya komunitas Tuli sendiri. Menghargai keduanya adalah kunci utama dalam membangun ekosistem masyarakat yang inklusif dan ramah disabilitas.
    `,
    kategori: "Edukasi",
    kategoriBadge: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    author: "Nabila Saraswati (Edukator Isyarat)",
    tanggal: "24 Agustus 2026",
    views: 2890,
    waktuBaca: "6 menit"
  },
  {
    id: "news-3",
    slug: "festival-bahasa-isyarat-nasional-2026",
    judul: "Festival Bahasa Isyarat Nasional 2026: Merayakan Keberagaman Budaya Tuli",
    ringkasan: "Ribuan pegiat inklusivitas dan anggota komunitas Tuli dari berbagai provinsi berkumpul merayakan Hari Bahasa Isyarat Internasional.",
    konten: `
      Festival Bahasa Isyarat Nasional tahun ini menyuguhkan berbagai lokakarya interaktif, pertunjukan puisi isyarat (*sign poetry*), pameran teknologi inklusif, dan kompetisi penerjemah bahasa isyarat muda.

      Acara ini menegaskan komitmen bersama bahwa akses komunikasi yang setara adalah hak asasi setiap warga negara tanpa terkecuali.
    `,
    kategori: "Event",
    kategoriBadge: "bg-brand-600/10 text-brand-600 border-brand-600/20",
    thumbnail: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    author: "Divisi Komunitas SETARA",
    tanggal: "18 Agustus 2026",
    views: 980,
    waktuBaca: "3 menit"
  },
  {
    id: "news-4",
    slug: "gerakan-1000-kata-isyarat-di-sekolah-inklusif",
    judul: "Inisiatif '1000 Kata Isyarat': Mendorong Sekolah Inklusif Sejak Usia Dini",
    ringkasan: "Program pengenalan kosa kata isyarat dasar pada murid sekolah dasar guna memupuk empati dan pemahaman inklusivitas sejak dini.",
    konten: `
      Pendidikan inklusif tidak hanya tentang menerima siswa berkebutuhan khusus di sekolah umum, melainkan juga membekali teman-teman sebayanya dengan kemampuan berkomunikasi dasar. 

      Melalui modul digital SETARA, para siswa diajak belajar kata-kata sapaan seperti *Halo*, *Terima Kasih*, *Tolong*, dan *Semangat* dengan cara interaktif dan menyenangkan.
    `,
    kategori: "Komunitas",
    kategoriBadge: "bg-amber-600/10 text-amber-600 border-amber-600/20",
    thumbnail: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
    author: "Budi Santoso, S.Pd.",
    tanggal: "10 Agustus 2026",
    views: 1650,
    waktuBaca: "5 menit"
  }
];

export const INITIAL_TIMELINE = [
  {
    id: "tm-1",
    tahun: "2024",
    tanggal: "Maret 2024",
    judul: "Lahirnya Gagasan SETARA",
    deskripsi: "Riset awal kolaborasi antara mahasiswa teknik informatika dan komunitas Tuli untuk mengidentifikasi tantangan komunikasi dua arah.",
    kategori: "Pondasi",
    icon: "Sparkles"
  },
  {
    id: "tm-2",
    tahun: "2024",
    tanggal: "Oktober 2024",
    judul: "Rilis Prototipe Kamus SIBI v1.0",
    deskripsi: "Peluncuran kamus digital 200 kata pertama dengan rekaman video peragaan isyarat resolusi tinggi.",
    kategori: "Pengembangan",
    icon: "BookOpen"
  },
  {
    id: "tm-3",
    tahun: "2025",
    tanggal: "Juni 2025",
    judul: "Integrasi Bahasa Alami BISINDO",
    deskripsi: "Kolaborasi bersama fasilitator Tuli daerah untuk merekam variasi leksikal BISINDO dan ekspresi visual.",
    kategori: "Ekspansi",
    icon: "Users"
  },
  {
    id: "tm-4",
    tahun: "2026",
    tanggal: "Januari 2026",
    judul: "Implementasi AI YOLO 11 & Computer Vision",
    deskripsi: "Penerapan pipeline deteksi 21 keypoints tangan secara real-time melalui kamera perangkat tanpa latensi.",
    kategori: "Inovasi AI",
    icon: "Cpu"
  },
  {
    id: "tm-5",
    tahun: "2026",
    tanggal: "Agustus 2026",
    judul: "Peluncuran SETARA v2.0 Terpadu",
    deskripsi: "Platform terintegrasi dengan penerjemah dua arah (Text-to-Sign & Sign-to-Text), ruang edukasi, dan portal komunitas nasional.",
    kategori: "Milestone Utama",
    icon: "Rocket"
  }
];

export const INITIAL_COMMUNITIES = [
  {
    id: "com-1",
    nama: "Gerkatin (Gerakan untuk Kesejahteraan Tunarungu Indonesia)",
    deskripsi: "Organisasi nasional yang memperjuangkan hak dan kesejahteraan komunitas Tuli di Indonesia.",
    deskripsiLengkap: "Gerkatin adalah organisasi nirlaba nasional yang telah berdiri sejak 1981 dan menjadi wadah utama bagi komunitas Tuli Indonesia. Gerkatin aktif dalam advokasi hak-hak penyandang disabilitas pendengaran, penyelenggaraan pelatihan bahasa isyarat, serta pemberdayaan ekonomi dan sosial anggota komunitas Tuli di seluruh provinsi.",
    kategori: "Organisasi Tuli",
    platform: "Website",
    link: "https://gerkatin.or.id",
    logo: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=200&q=80",
    anggota: "5.000+ Anggota",
    status: "approved",
    kontak: "Sekretariat Gerkatin",
    emailKontak: "info@gerkatin.or.id"
  },
  {
    id: "com-2",
    nama: "Sign Language Indonesia Community",
    deskripsi: "Komunitas belajar bahasa isyarat BISINDO & SIBI untuk masyarakat umum via WhatsApp Group.",
    deskripsiLengkap: "Sign Language Indonesia Community adalah grup WhatsApp yang didirikan oleh para relawan dan fasilitator Tuli untuk memperkenalkan bahasa isyarat kepada masyarakat umum. Di sini, anggota bisa belajar kosa kata isyarat harian, berlatih melalui video challenge mingguan, dan berdiskusi seputar budaya Tuli Indonesia.",
    kategori: "Belajar Isyarat",
    platform: "WhatsApp",
    link: "https://chat.whatsapp.com/example-slic",
    logo: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=200&q=80",
    anggota: "1.200+ Anggota",
    status: "approved",
    kontak: "Rina Mulyani",
    emailKontak: "rina.slic@gmail.com"
  },
  {
    id: "com-3",
    nama: "Deaf Tech Indonesia",
    deskripsi: "Forum teknologi & inovasi aksesibilitas untuk komunitas Tuli di platform Telegram.",
    deskripsiLengkap: "Deaf Tech Indonesia adalah komunitas Telegram yang mempertemukan developer, desainer, dan inovator yang peduli pada aksesibilitas digital untuk Tuli. Topik diskusi mencakup AI untuk penerjemahan isyarat, UX aksesibel, captioning otomatis, dan peluang karir teknologi bagi penyandang disabilitas pendengaran.",
    kategori: "Teknologi & Inovasi",
    platform: "Telegram",
    link: "https://t.me/deaftechid",
    logo: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=200&q=80",
    anggota: "850+ Anggota",
    status: "approved",
    kontak: "Ahmad Fauzi",
    emailKontak: "ahmad@deaftech.id"
  },
  {
    id: "com-4",
    nama: "Isyarat Nusantara",
    deskripsi: "Channel Discord untuk diskusi dialek BISINDO dari berbagai daerah di Indonesia.",
    deskripsiLengkap: "Isyarat Nusantara adalah server Discord yang menjadi ruang perkumpulan bagi penggiat bahasa isyarat dari berbagai provinsi di Indonesia. Server ini memiliki channel khusus untuk setiap dialek daerah (Jakarta, Yogyakarta, Bali, Padang, Makassar), serta channel tutorial video, sharing pengalaman, dan event virtual bulanan.",
    kategori: "Komunitas Daerah",
    platform: "Discord",
    link: "https://discord.gg/isyarat-nusantara",
    logo: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=200&q=80",
    anggota: "600+ Anggota",
    status: "approved",
    kontak: "Dewi Lestari",
    emailKontak: "dewi@isyaratnusantara.com"
  },
  {
    id: "com-5",
    nama: "Teman Tuli Bandung",
    deskripsi: "Komunitas lokal Bandung yang aktif mengadakan kelas isyarat gratis dan sign cafe.",
    deskripsiLengkap: "Teman Tuli Bandung adalah komunitas berbasis kota yang rutin mengadakan kelas bahasa isyarat gratis setiap akhir pekan, sign cafe bulanan, dan kampanye kesadaran inklusi di ruang publik. Dikelola oleh gabungan relawan dengar dan Tuli yang ingin menjembatani komunikasi di Kota Bandung.",
    kategori: "Komunitas Lokal",
    platform: "Instagram",
    link: "https://instagram.com/temantulibdg",
    logo: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=200&q=80",
    anggota: "2.300+ Followers",
    status: "approved",
    kontak: "Bayu Pratama",
    emailKontak: "temantulibdg@gmail.com"
  },
  {
    id: "com-6",
    nama: "Komunitas Guru SLB Nusantara",
    deskripsi: "Grup WhatsApp khusus guru SLB untuk berbagi materi dan metode pengajaran isyarat.",
    deskripsiLengkap: "Komunitas Guru SLB Nusantara adalah wadah bagi para guru Sekolah Luar Biasa dari seluruh Indonesia untuk saling berbagi materi ajar, metode pengajaran bahasa isyarat, dan solusi tantangan pendidikan inklusif. Grup ini juga rutin mengadakan webinar dan diskusi tematik bersama pakar pendidikan khusus.",
    kategori: "Pendidikan",
    platform: "WhatsApp",
    link: "https://chat.whatsapp.com/example-guruslb",
    logo: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=200&q=80",
    anggota: "780+ Anggota",
    status: "approved",
    kontak: "Siti Nurhaliza, S.Pd.",
    emailKontak: "guruslbnusantara@gmail.com"
  }
];

export const INITIAL_TESTIMONIALS = [
  {
    id: "testi-1",
    nama: "Rian Aditya",
    peran: "Teman Tuli & Desainer Grafis",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    komentar: "SETARA sangat membantu saat saya berdiskusi dengan klien dengar. Mereka bisa mengetik apa saja dan langsung melihat peragaan isyarat BISINDO yang akurat!"
  },
  {
    id: "testi-2",
    nama: "Dr. Farida Utami",
    peran: "Dokter Umum Puskesmas",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80",
    komentar: "Fitur pemutar kata per kata sangat jelas. Pelayanan pasien Tuli di klinik kami menjadi jauh lebih cepat, ramah, dan manusiawi."
  },
  {
    id: "testi-3",
    nama: "Dimas Prasetyo",
    peran: "Mahasiswa & Relawan SLB",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    komentar: "Pilihan mode SIBI dan BISINDO yang terpisah membuat proses belajar jadi sangat terarah. Sangat direkomendasikan untuk siapa saja yang ingin belajar isyarat!"
  }
];

/**
 * Sign Language Video Dictionary Database
 * Provides gesture animations, descriptions, and phonetic breakdowns.
 */
export const SIGN_DICTIONARY = [
  {
    kata: "halo",
    tipe_bahasa: "BOTH", // SIBI & BISINDO
    kategori: "Sapaan",
    durasi: 2,
    deskripsi_gerakan: "Tangan terbuka di samping pelipis/dahi, lalu digerakkan melambai ke arah luar secara ramah.",
    gesture_pattern: "hand_wave_forehead",
    tersedia: true,
    contoh_kalimat: "Halo, selamat pagi semuanya."
  },
  {
    kata: "aku",
    tipe_bahasa: "BOTH",
    kategori: "Kata Ganti",
    durasi: 1.5,
    deskripsi_gerakan: "Jari telunjuk tangan dominan menunjuk ke arah dada diri sendiri.",
    gesture_pattern: "point_chest",
    tersedia: true,
    contoh_kalimat: "Aku sedang belajar bahasa isyarat."
  },
  {
    kata: "saya",
    tipe_bahasa: "BOTH",
    kategori: "Kata Ganti",
    durasi: 1.5,
    deskripsi_gerakan: "Telapak tangan kanan terbuka menempel di dada bagian tengah secara sopan.",
    gesture_pattern: "palm_chest",
    tersedia: true,
    contoh_kalimat: "Saya senang bisa bertemu Anda."
  },
  {
    kata: "kamu",
    tipe_bahasa: "BOTH",
    kategori: "Kata Ganti",
    durasi: 1.5,
    deskripsi_gerakan: "Jari telunjuk mengarah ke depan tepat ke arah lawan bicara.",
    gesture_pattern: "point_forward",
    tersedia: true,
    contoh_kalimat: "Apakah kamu sudah makan?"
  },
  {
    kata: "dia",
    tipe_bahasa: "BOTH",
    kategori: "Kata Ganti",
    durasi: 1.5,
    deskripsi_gerakan: "Jari telunjuk mengarah ke samping (pihak ketiga).",
    gesture_pattern: "point_side",
    tersedia: true,
    contoh_kalimat: "Dia adalah teman saya."
  },
  {
    kata: "sayang",
    tipe_bahasa: "BOTH",
    kategori: "Kata Sifat / Perasaan",
    durasi: 2,
    deskripsi_gerakan: "Kedua telapak tangan menyilang di atas dada membentuk pelukan hangat.",
    gesture_pattern: "cross_chest_hug",
    tersedia: true,
    contoh_kalimat: "Aku sayang ibu dan ayah."
  },
  {
    kata: "cinta",
    tipe_bahasa: "BOTH",
    kategori: "Kata Sifat / Perasaan",
    durasi: 2,
    deskripsi_gerakan: "Tangan membentuk simbol I-L-Y atau menyilangkan tangan di dada dengan senyuman.",
    gesture_pattern: "cross_chest_hug",
    tersedia: true,
    contoh_kalimat: "Cinta dan kasih sayang untuk keluarga."
  },
  {
    kata: "ibu",
    tipe_bahasa: "SIBI",
    kategori: "Keluarga",
    durasi: 2,
    deskripsi_gerakan: "Ibu jari tangan kanan menyentuh dagu atau pipi bawah melambangkan keibuan.",
    gesture_pattern: "thumb_chin",
    tersedia: true,
    contoh_kalimat: "Ibu memasak makanan lezat."
  },
  {
    kata: "ibu",
    tipe_bahasa: "BISINDO",
    kategori: "Keluarga",
    durasi: 2,
    deskripsi_gerakan: "Ibu jari menyentuh dagu dengan gerakan melengkung lembut ke depan.",
    gesture_pattern: "thumb_chin",
    tersedia: true,
    contoh_kalimat: "Ibu membimbing anak-anak dengan sabar."
  },
  {
    kata: "ayah",
    tipe_bahasa: "BOTH",
    kategori: "Keluarga",
    durasi: 2,
    deskripsi_gerakan: "Ibu jari tangan kanan menyentuh bagian dahi atas.",
    gesture_pattern: "thumb_forehead",
    tersedia: true,
    contoh_kalimat: "Ayah bekerja dengan penuh semangat."
  },
  {
    kata: "terima",
    tipe_bahasa: "BOTH",
    kategori: "Ungkapan",
    durasi: 1.5,
    deskripsi_gerakan: "Kedua tangan terbuka bergerak dari depan mendekat ke arah dada (menerima).",
    gesture_pattern: "receive_motion",
    tersedia: true,
    contoh_kalimat: "Terima paket dari kurir."
  },
  {
    kata: "kasih",
    tipe_bahasa: "BOTH",
    kategori: "Ungkapan",
    durasi: 1.5,
    deskripsi_gerakan: "Tangan bergerak dari arah dada keluar ke depan (memberi).",
    gesture_pattern: "give_motion",
    tersedia: true,
    contoh_kalimat: "Kasih sayang tiada tara."
  },
  {
    kata: "terima kasih",
    tipe_bahasa: "BOTH",
    kategori: "Sapaan / Kesopanan",
    durasi: 2.2,
    deskripsi_gerakan: "Ujung jari menyentuh dagu, lalu digerakkan maju ke arah lawan bicara disertai anggukan rasa syukur.",
    gesture_pattern: "fingers_chin_forward",
    tersedia: true,
    contoh_kalimat: "Terima kasih banyak atas bantuannya."
  },
  {
    kata: "tolong",
    tipe_bahasa: "BOTH",
    kategori: "Ungkapan",
    durasi: 2,
    deskripsi_gerakan: "Kedua telapak tangan dirapatkan di depan dada dengan gerakan memohon lembut.",
    gesture_pattern: "pray_hands",
    tersedia: true,
    contoh_kalimat: "Tolong bantu saya membawakan buku."
  },
  {
    kata: "bantu",
    tipe_bahasa: "BOTH",
    kategori: "Kata Kerja",
    durasi: 2,
    deskripsi_gerakan: "Satu tangan menopang tangan lain yang terkepal dan digerakkan ke atas.",
    gesture_pattern: "support_motion",
    tersedia: true,
    contoh_kalimat: "Mari kita saling bantu sesama."
  },
  {
    kata: "belajar",
    tipe_bahasa: "BOTH",
    kategori: "Pendidikan",
    durasi: 2,
    deskripsi_gerakan: "Ujung jari tangan kanan mengambil sesuatu dari telapak tangan kiri lalu ditempelkan ke dahi (memasukkan ilmu ke pikiran).",
    gesture_pattern: "learn_forehead",
    tersedia: true,
    contoh_kalimat: "Kami senang belajar bahasa isyarat bersama."
  },
  {
    kata: "isyarat",
    tipe_bahasa: "BOTH",
    kategori: "Bahasa",
    durasi: 2,
    deskripsi_gerakan: "Kedua jari telunjuk berputar bergantian di depan dada melambangkan gerakan isyarat.",
    gesture_pattern: "rotate_index_fingers",
    tersedia: true,
    contoh_kalimat: "Bahasa isyarat adalah jembatan komunikasi."
  },
  {
    kata: "bahasa",
    tipe_bahasa: "BOTH",
    kategori: "Bahasa",
    durasi: 2,
    deskripsi_gerakan: "Kedua tangan membentuk huruf 'L' lalu digerakkan bergelombang ke samping luar.",
    gesture_pattern: "waving_l_hands",
    tersedia: true,
    contoh_kalimat: "Bahasa Indonesia menyatukan kita."
  },
  {
    kata: "setara",
    tipe_bahasa: "BOTH",
    kategori: "Nilai & Visi",
    durasi: 2,
    deskripsi_gerakan: "Kedua telapak tangan mendatar sejajar di depan dada melambangkan kesetaraan dan keadilan.",
    gesture_pattern: "equal_parallel_hands",
    tersedia: true,
    contoh_kalimat: "Semua manusia memiliki hak yang setara."
  },
  {
    kata: "teman",
    tipe_bahasa: "BOTH",
    kategori: "Sosial",
    durasi: 1.8,
    deskripsi_gerakan: "Kedua jari telunjuk saling mengait secara bergantian melambangkan ikatan persahabatan.",
    gesture_pattern: "hook_index_fingers",
    tersedia: true,
    contoh_kalimat: "Dia adalah teman terbaik saya."
  },
  {
    kata: "tuli",
    tipe_bahasa: "BOTH",
    kategori: "Identitas Budaya",
    durasi: 1.8,
    deskripsi_gerakan: "Jari telunjuk menyentuh telinga lalu menyentuh mulut secara lembut (identitas Tuli).",
    gesture_pattern: "ear_to_mouth",
    tersedia: true,
    contoh_kalimat: "Bangga dengan identitas dan budaya Tuli."
  },
  {
    kata: "selamat",
    tipe_bahasa: "BOTH",
    kategori: "Sapaan",
    durasi: 1.8,
    deskripsi_gerakan: "Kedua tangan terbuka dari samping melengkung ke depan dada dengan senyum hangat.",
    gesture_pattern: "welcome_motion",
    tersedia: true,
    contoh_kalimat: "Selamat datang di platform SETARA."
  },
  {
    kata: "pagi",
    tipe_bahasa: "BOTH",
    kategori: "Waktu",
    durasi: 1.8,
    deskripsi_gerakan: "Tangan kanan terbuka terbit dari bawah lengan kiri ke atas menyerupai matahari pagi.",
    gesture_pattern: "rising_sun",
    tersedia: true,
    contoh_kalimat: "Selamat pagi semuanya."
  },
  {
    kata: "malam",
    tipe_bahasa: "BOTH",
    kategori: "Waktu",
    durasi: 1.8,
    deskripsi_gerakan: "Tangan kanan melengkung turun menutupi tangan kiri menyerupai matahari tenggelam.",
    gesture_pattern: "setting_sun",
    tersedia: true,
    contoh_kalimat: "Selamat malam dan istirahat yang cukup."
  },
  {
    kata: "semangat",
    tipe_bahasa: "BOTH",
    kategori: "Motivasi",
    durasi: 2,
    deskripsi_gerakan: "Kedua tangan mengepal di depan dada lalu digerakkan tegas ke bawah dengan tatapan antusias.",
    gesture_pattern: "fist_pump_down",
    tersedia: true,
    contoh_kalimat: "Tetap semangat dalam meraih impian!"
  }
];
