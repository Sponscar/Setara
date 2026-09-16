"""
Management command to seed database with initial SETARA dataset.
Includes articles, timeline milestones, communities directory, testimonials, and vocabulary.
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.accounts.models import User
from apps.berita.models import Berita
from apps.timeline.models import Timeline
from apps.komunitas.models import Komunitas, KomunitasTestimonial
from apps.video.models import Video


class Command(BaseCommand):
    help = 'Seed database with initial SETARA data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Seeding database...'))

        # 1. Superuser Admin
        admin, created = User.objects.get_or_create(
            email='admin@setara.id',
            defaults={
                'full_name': 'Administrator SETARA',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        admin.set_password('setara2026')
        admin.save()
        self.stdout.write(self.style.SUCCESS('Admin user ready: admin@setara.id (pwd: setara2026)'))

        # 2. Berita / Articles
        news_data = [
            {
                "judul": "Penerapan YOLO 11 dan AI dalam Menjembatani Komunikasi Komunitas Tuli di Indonesia",
                "slug": "revolusi-ai-yolo11-penerjemah-bahasa-isyarat-indonesia",
                "ringkasan": "Bagaimana teknologi Computer Vision dan pose estimation 21 titik kini mampu mengenali bahasa isyarat SIBI dan BISINDO secara real-time dengan latensi rendah.",
                "konten": "Perkembangan kecerdasan buatan (AI) di bidang computer vision kini membuka babak baru bagi aksesibilitas digital di Indonesia. Dengan hadirnya model terbaru YOLO 11 Pose Estimation, deteksi titik sendi tangan (hand keypoints) dapat dilakukan hingga 21 titik per tangan secara presisi tanpa memerlukan perangkat keras khusus.\n\nDalam platform SETARA, teknologi ini dipadukan dengan sequence classifier (LSTM) untuk mengenali rangkaian gestur dinamis dan mengonversinya menjadi teks bahasa Indonesia seketika. Hal ini memungkinkan teman Tuli berkomunikasi dua arah secara natural di ruang publik, layanan kesehatan, maupun perkantoran.",
                "kategori": "Teknologi",
                "thumbnail_url": "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
                "author_name": "Tim Litbang SETARA",
                "waktu_baca": "4 menit",
                "views": 1420
            },
            {
                "judul": "Memahami Perbedaan Mendasar SIBI dan BISINDO: Panduan Lengkap untuk Pemula",
                "slug": "memahami-perbedaan-mendasar-sibi-dan-bisindo",
                "ringkasan": "Kenali latar belakang, filosofi, struktur linguistik, dan konteks penggunaan antara SIBI dan BISINDO agar tidak salah kaprah saat berinteraksi.",
                "konten": "Seringkali masyarakat awam mengira bahwa bahasa isyarat di seluruh Indonesia adalah seragam. Kenyataannya, terdapat dua sistem utama: SIBI (Sistem Isyarat Bahasa Indonesia) dan BISINDO (Bahasa Isyarat Indonesia).\n\nSIBI diciptakan dengan mengacu pada tata bahasa baku Indonesia termasuk struktur afiksasi (imbuhan), sementara BISINDO adalah bahasa visual alami yang lahir dari budaya komunitas Tuli sendiri. Menghargai keduanya adalah kunci utama dalam membangun ekosistem masyarakat yang inklusif dan ramah disabilitas.",
                "kategori": "Edukasi",
                "thumbnail_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
                "author_name": "Nabila Saraswati (Edukator Isyarat)",
                "waktu_baca": "6 menit",
                "views": 2890
            },
            {
                "judul": "Festival Bahasa Isyarat Nasional 2026: Merayakan Keberagaman Budaya Tuli",
                "slug": "festival-bahasa-isyarat-nasional-2026",
                "ringkasan": "Ribuan pegiat inklusivitas dan anggota komunitas Tuli dari berbagai provinsi berkumpul merayakan Hari Bahasa Isyarat Internasional.",
                "konten": "Festival Bahasa Isyarat Nasional tahun ini menyuguhkan berbagai lokakarya interaktif, pertunjukan puisi isyarat (sign poetry), pameran teknologi inklusif, dan kompetisi penerjemah bahasa isyarat muda.\n\nAcara ini menegaskan komitmen bersama bahwa akses komunikasi yang setara adalah hak asasi setiap warga negara tanpa terkecuali.",
                "kategori": "Event",
                "thumbnail_url": "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
                "author_name": "Divisi Komunitas SETARA",
                "waktu_baca": "3 menit",
                "views": 980
            },
            {
                "judul": "Inisiatif '1000 Kata Isyarat': Mendorong Sekolah Inklusif Sejak Usia Dini",
                "slug": "gerakan-1000-kata-isyarat-di-sekolah-inklusif",
                "ringkasan": "Program pengenalan kosa kata isyarat dasar pada murid sekolah dasar guna memupuk empati dan pemahaman inklusivitas sejak dini.",
                "konten": "Pendidikan inklusif tidak hanya tentang menerima siswa berkebutuhan khusus di sekolah umum, melainkan juga membekali teman-teman sebayanya dengan kemampuan berkomunikasi dasar.\n\nMelalui modul digital SETARA, para siswa diajak belajar kata-kata sapaan seperti Halo, Terima Kasih, Tolong, dan Semangat dengan cara interaktif dan menyenangkan.",
                "kategori": "Komunitas",
                "thumbnail_url": "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
                "author_name": "Budi Santoso, S.Pd.",
                "waktu_baca": "5 menit",
                "views": 1650
            }
        ]
        for n in news_data:
            Berita.objects.update_or_create(
                slug=n['slug'],
                defaults={
                    'judul': n['judul'],
                    'ringkasan': n['ringkasan'],
                    'konten': n['konten'],
                    'kategori': n['kategori'],
                    'thumbnail_url': n['thumbnail_url'],
                    'author': admin,
                    'author_name': n['author_name'],
                    'waktu_baca': n['waktu_baca'],
                    'views': n['views'],
                    'status': 'published',
                    'published_at': timezone.now()
                }
            )
        self.stdout.write(self.style.SUCCESS(f'Seeded {len(news_data)} news articles'))

        # 3. Timeline Milestones
        timeline_data = [
            {
                "tahun": "2024",
                "tanggal": "Maret 2024",
                "judul": "Lahirnya Gagasan SETARA",
                "deskripsi": "Riset awal kolaborasi antara mahasiswa teknik informatika dan komunitas Tuli untuk mengidentifikasi tantangan komunikasi dua arah.",
                "kategori": "Pondasi",
                "icon": "Sparkles",
                "urutan": 1
            },
            {
                "tahun": "2024",
                "tanggal": "Oktober 2024",
                "judul": "Rilis Prototipe Kamus SIBI v1.0",
                "deskripsi": "Peluncuran kamus digital 200 kata pertama dengan rekaman video peragaan isyarat resolusi tinggi.",
                "kategori": "Pengembangan",
                "icon": "BookOpen",
                "urutan": 2
            },
            {
                "tahun": "2025",
                "tanggal": "Juni 2025",
                "judul": "Integrasi Bahasa Alami BISINDO",
                "deskripsi": "Kolaborasi bersama fasilitator Tuli daerah untuk merekam variasi leksikal BISINDO dan ekspresi visual.",
                "kategori": "Ekspansi",
                "icon": "Users",
                "urutan": 3
            },
            {
                "tahun": "2026",
                "tanggal": "Januari 2026",
                "judul": "Implementasi AI YOLO 11 & Computer Vision",
                "deskripsi": "Penerapan pipeline deteksi 21 keypoints tangan secara real-time melalui kamera perangkat tanpa latensi.",
                "kategori": "Inovasi AI",
                "icon": "Cpu",
                "urutan": 4
            },
            {
                "tahun": "2026",
                "tanggal": "Agustus 2026",
                "judul": "Peluncuran SETARA v2.0 Terpadu",
                "deskripsi": "Platform terintegrasi dengan penerjemah dua arah (Text-to-Sign & Sign-to-Text), ruang edukasi, dan portal komunitas nasional.",
                "kategori": "Milestone Utama",
                "icon": "Rocket",
                "urutan": 5
            }
        ]
        for t in timeline_data:
            Timeline.objects.update_or_create(
                judul=t['judul'],
                defaults=t
            )
        self.stdout.write(self.style.SUCCESS(f'Seeded {len(timeline_data)} timeline milestones'))

        # 4. Direktori Komunitas
        community_data = [
            {
                "nama": "Gerkatin (Gerakan untuk Kesejahteraan Tunarungu Indonesia)",
                "deskripsi": "Organisasi nasional yang memperjuangkan hak dan kesejahteraan komunitas Tuli di Indonesia.",
                "deskripsi_lengkap": "Gerkatin adalah organisasi nirlaba nasional yang telah berdiri sejak 1981 dan menjadi wadah utama bagi komunitas Tuli Indonesia. Gerkatin aktif dalam advokasi hak-hak penyandang disabilitas pendengaran, penyelenggaraan pelatihan bahasa isyarat, serta pemberdayaan ekonomi dan sosial anggota komunitas Tuli di seluruh provinsi.",
                "kategori": "Organisasi Tuli",
                "platform": "Website",
                "link": "https://gerkatin.or.id",
                "logo_url": "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=200&q=80",
                "anggota": "5.000+ Anggota",
                "status": "approved",
                "kontak": "Sekretariat Gerkatin",
                "email_kontak": "info@gerkatin.or.id"
            },
            {
                "nama": "Sign Language Indonesia Community",
                "deskripsi": "Komunitas belajar bahasa isyarat BISINDO & SIBI untuk masyarakat umum via WhatsApp Group.",
                "deskripsi_lengkap": "Sign Language Indonesia Community adalah grup WhatsApp yang didirikan oleh para relawan dan fasilitator Tuli untuk memperkenalkan bahasa isyarat kepada masyarakat umum. Di sini, anggota bisa belajar kosa kata isyarat harian, berlatih melalui video challenge mingguan, dan berdiskusi seputar budaya Tuli Indonesia.",
                "kategori": "Belajar Isyarat",
                "platform": "WhatsApp",
                "link": "https://chat.whatsapp.com/example-slic",
                "logo_url": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=200&q=80",
                "anggota": "1.200+ Anggota",
                "status": "approved",
                "kontak": "Rina Mulyani",
                "email_kontak": "rina.slic@gmail.com"
            },
            {
                "nama": "Deaf Tech Indonesia",
                "deskripsi": "Forum teknologi & inovasi aksesibilitas untuk komunitas Tuli di platform Telegram.",
                "deskripsi_lengkap": "Deaf Tech Indonesia adalah komunitas Telegram yang mempertemukan developer, desainer, dan inovator yang peduli pada aksesibilitas digital untuk Tuli. Topik diskusi mencakup AI untuk penerjemahan isyarat, UX aksesibel, captioning otomatis, dan peluang karir teknologi bagi penyandang disabilitas pendengaran.",
                "kategori": "Teknologi & Inovasi",
                "platform": "Telegram",
                "link": "https://t.me/deaftechid",
                "logo_url": "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=200&q=80",
                "anggota": "850+ Anggota",
                "status": "approved",
                "kontak": "Ahmad Fauzi",
                "email_kontak": "ahmad@deaftech.id"
            },
            {
                "nama": "Isyarat Nusantara",
                "deskripsi": "Channel Discord untuk diskusi dialek BISINDO dari berbagai daerah di Indonesia.",
                "deskripsi_lengkap": "Isyarat Nusantara adalah server Discord yang menjadi ruang perkumpulan bagi penggiat bahasa isyarat dari berbagai provinsi di Indonesia. Server ini memiliki channel khusus untuk setiap dialek daerah (Jakarta, Yogyakarta, Bali, Padang, Makassar), serta channel tutorial video, sharing pengalaman, dan event virtual bulanan.",
                "kategori": "Komunitas Daerah",
                "platform": "Discord",
                "link": "https://discord.gg/isyarat-nusantara",
                "logo_url": "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=200&q=80",
                "anggota": "600+ Anggota",
                "status": "approved",
                "kontak": "Dewi Lestari",
                "email_kontak": "dewi@isyaratnusantara.com"
            },
            {
                "nama": "Teman Tuli Bandung",
                "deskripsi": "Komunitas lokal Bandung yang aktif mengadakan kelas isyarat gratis dan sign cafe.",
                "deskripsi_lengkap": "Teman Tuli Bandung adalah komunitas berbasis kota yang rutin mengadakan kelas bahasa isyarat gratis setiap akhir pekan, sign cafe bulanan, dan kampanye kesadaran inklusi di ruang publik. Dikelola oleh gabungan relawan dengar dan Tuli yang ingin menjembatani komunikasi di Kota Bandung.",
                "kategori": "Komunitas Lokal",
                "platform": "Instagram",
                "link": "https://instagram.com/temantulibdg",
                "logo_url": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=200&q=80",
                "anggota": "2.300+ Followers",
                "status": "approved",
                "kontak": "Bayu Pratama",
                "email_kontak": "temantulibdg@gmail.com"
            },
            {
                "nama": "Komunitas Guru SLB Nusantara",
                "deskripsi": "Grup WhatsApp khusus guru SLB untuk berbagi materi dan metode pengajaran isyarat.",
                "deskripsi_lengkap": "Komunitas Guru SLB Nusantara adalah wadah bagi para guru Sekolah Luar Biasa dari seluruh Indonesia untuk saling berbagi materi ajar, metode pengajaran bahasa isyarat, dan solusi tantangan pendidikan inklusif. Grup ini juga rutin mengadakan webinar dan diskusi tematik bersama pakar pendidikan khusus.",
                "kategori": "Pendidikan",
                "platform": "WhatsApp",
                "link": "https://chat.whatsapp.com/example-guruslb",
                "logo_url": "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=200&q=80",
                "anggota": "450+ Guru",
                "status": "approved",
                "kontak": "Siti Rahmawati",
                "email_kontak": "siti.guruslb@gmail.com"
            }
        ]
        for c in community_data:
            Komunitas.objects.update_or_create(
                nama=c['nama'],
                defaults=c
            )
        self.stdout.write(self.style.SUCCESS(f'Seeded {len(community_data)} communities'))

        # 5. Testimonial
        testi_data = [
            {
                "nama": "Andi Pratama",
                "peran": "Relawan Teman Dengar",
                "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
                "konten": "Platform SETARA sangat intuitif! Saya bisa belajar BISINDO sekaligus menguji pemahaman saya langsung dengan kamera real-time.",
                "rating": 5
            },
            {
                "nama": "Rina Mulyani",
                "peran": "Anggota Komunitas Tuli",
                "avatar_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
                "konten": "Akhirnya ada platform yang menghargai keberadaan BISINDO sebagai bahasa alami kami, bukan sekadar memaksakan SIBI formal.",
                "rating": 5
            },
            {
                "nama": "Budi Santoso, S.Pd.",
                "peran": "Guru SLB Negeri",
                "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
                "konten": "Sangat membantu dalam mengajar murid-murid baru di kelas. Kamus visualnya lengkap dan responsif di berbagai perangkat.",
                "rating": 5
            },
            {
                "nama": "Dewi Saraswati",
                "peran": "Mahasiswa Ilmu Komunikasi",
                "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
                "konten": "Fitur perbandingan SIBI vs BISINDO membuka wawasan saya mengenai linguistik isyarat Nusantara. Keren sekali!",
                "rating": 5
            }
        ]
        for t in testi_data:
            KomunitasTestimonial.objects.update_or_create(
                nama=t['nama'],
                defaults=t
            )
        self.stdout.write(self.style.SUCCESS(f'Seeded {len(testi_data)} testimonials'))

        # 6. Kamus Kosakata Isyarat (Dictionary Words)
        vocab_data = [
            {"kata": "halo", "tipe_bahasa": "BISINDO", "kategori": "Sapaan", "gesture_pattern": "hand_wave_forehead", "deskripsi_gerakan": "Tangan terbuka di samping pelipis/dahi, lalu digerakkan melambai ke arah luar secara ramah."},
            {"kata": "aku", "tipe_bahasa": "BISINDO", "kategori": "Kata Ganti", "gesture_pattern": "point_chest", "deskripsi_gerakan": "Jari telunjuk tangan dominan menunjuk ke arah dada diri sendiri."},
            {"kata": "kamu", "tipe_bahasa": "BISINDO", "kategori": "Kata Ganti", "gesture_pattern": "point_forward", "deskripsi_gerakan": "Jari telunjuk tangan dominan menunjuk lurus ke arah lawan bicara secara sopan."},
            {"kata": "terima kasih", "tipe_bahasa": "BISINDO", "kategori": "Kesopanan", "gesture_pattern": "chin_to_front", "deskripsi_gerakan": "Ujung jari tangan terbuka menyentuh dagu/bibir bawah, lalu digerakkan mendatar ke depan."},
            {"kata": "sama-sama", "tipe_bahasa": "BISINDO", "kategori": "Kesopanan", "gesture_pattern": "palms_down_spread", "deskripsi_gerakan": "Kedua telapak tangan terbuka menghadap bawah, bergerak ke samping merentang lembut."},
            {"kata": "maaf", "tipe_bahasa": "BISINDO", "kategori": "Kesopanan", "gesture_pattern": "fist_circular_chest", "deskripsi_gerakan": "Kepalan tangan memutar perlahan searah jarum jam di atas dada/hati dengan ekspresi wajah menyesal."},
            {"kata": "tolong", "tipe_bahasa": "BISINDO", "kategori": "Kesopanan", "gesture_pattern": "palms_together_chest", "deskripsi_gerakan": "Kedua telapak tangan dirapatkan di depan dada seperti memohon dengan sedikit anggukan kepala."},
            {"kata": "selamat", "tipe_bahasa": "BISINDO", "kategori": "Sapaan", "gesture_pattern": "thumbs_up_chest", "deskripsi_gerakan": "Kedua ibu jari teracung di depan dada lalu digerakkan naik ke atas secara mantap."},
            {"kata": "pagi", "tipe_bahasa": "BISINDO", "kategori": "Waktu", "gesture_pattern": "sun_rise_horizon", "deskripsi_gerakan": "Satu tangan membentuk lingkaran matahari yang bergerak naik dari balik lengan horizontal lainnya."},
            {"kata": "siang", "tipe_bahasa": "BISINDO", "kategori": "Waktu", "gesture_pattern": "arm_vertical_up", "deskripsi_gerakan": "Lengan kanan tegak lurus ke atas dengan jari menunjuk ke langit (matahari di puncaknya)."},
            {"kata": "malam", "tipe_bahasa": "BISINDO", "kategori": "Waktu", "gesture_pattern": "sun_set_down", "deskripsi_gerakan": "Tangan bergerak melengkung ke bawah meniru matahari yang terbenam di balik ufuk."},
            {"kata": "belajar", "tipe_bahasa": "BISINDO", "kategori": "Aktivitas", "gesture_pattern": "palm_to_forehead", "deskripsi_gerakan": "Ujung jari menyentuh telapak tangan kiri lalu diangkat menyentuh dahi (mengambil ilmu)."},
            {"kata": "isyarat", "tipe_bahasa": "BISINDO", "kategori": "Komunikasi", "gesture_pattern": "rotating_index_fingers", "deskripsi_gerakan": "Kedua telunjuk berputar bergantian di depan dada melambangkan komunikasi visual dinamis."},
            {"kata": "bahasa", "tipe_bahasa": "BISINDO", "kategori": "Komunikasi", "gesture_pattern": "b_hands_wave", "deskripsi_gerakan": "Kedua tangan membentuk abjad B lalu digerakkan bergelombang ke samping luar."},
            {"kata": "indonesia", "tipe_bahasa": "BISINDO", "kategori": "Kebangsaan", "gesture_pattern": "i_hand_flutter", "deskripsi_gerakan": "Jari kelingking teracung (huruf I) lalu digerakkan meliuk horizontal dari kiri ke kanan."},
            {"kata": "senang", "tipe_bahasa": "BISINDO", "kategori": "Emosi", "gesture_pattern": "palms_brush_chest_up", "deskripsi_gerakan": "Kedua telapak tangan terbuka menyapu dada ke atas bergantian disertai senyum ceria."},
            {"kata": "semangat", "tipe_bahasa": "BISINDO", "kategori": "Emosi", "gesture_pattern": "fists_pump_up", "deskripsi_gerakan": "Kedua tangan mengepal kuat di samping pinggang lalu dihentakkan naik ke atas secara bertenaga."},
            {"kata": "tuli", "tipe_bahasa": "BISINDO", "kategori": "Identitas", "gesture_pattern": "ear_to_mouth_touch", "deskripsi_gerakan": "Jari telunjuk menyentuh daun telinga lalu berpindah menyentuh bibir (identitas budaya Tuli)."},
            {"kata": "dengar", "tipe_bahasa": "BISINDO", "kategori": "Identitas", "gesture_pattern": "cup_ear", "deskripsi_gerakan": "Tangan sedikit melengkung di belakang telinga mengindikasikan kemampuan mendengar."},
            {"kata": "teman", "tipe_bahasa": "BISINDO", "kategori": "Sosial", "gesture_pattern": "hook_index_fingers", "deskripsi_gerakan": "Kedua jari telunjuk saling mengait satu sama lain melambangkan persahabatan erat."},
            {"kata": "keluarga", "tipe_bahasa": "BISINDO", "kategori": "Sosial", "gesture_pattern": "circle_touch_pinkies", "deskripsi_gerakan": "Kedua tangan membentuk huruf F/lingkaran lalu bergerak melingkar hingga kelingking bersentuhan."},
            {"kata": "sekolah", "tipe_bahasa": "BISINDO", "kategori": "Pendidikan", "gesture_pattern": "clap_palms_horizontal", "deskripsi_gerakan": "Telapak tangan kanan menepuk telapak tangan kiri dua kali secara mendatar."},
            {"kata": "rumah", "tipe_bahasa": "BISINDO", "kategori": "Umum", "gesture_pattern": "roof_shape_hands", "deskripsi_gerakan": "Ujung jari kedua tangan dipertemukan membentuk segitiga atap rumah di depan dada."},
            {"kata": "makan", "tipe_bahasa": "BISINDO", "kategori": "Kebutuhan", "gesture_pattern": "fingertips_to_mouth", "deskripsi_gerakan": "Ujung-ujung jari terkumpul menyentuh bibir dua kali menirukan gerakan menyuap makanan."},
            {"kata": "minum", "tipe_bahasa": "BISINDO", "kategori": "Kebutuhan", "gesture_pattern": "c_cup_to_mouth", "deskripsi_gerakan": "Tangan membentuk huruf C seperti memegang cangkir lalu diangkat ke arah mulut."},
            {"kata": "sehat", "tipe_bahasa": "BISINDO", "kategori": "Kesehatan", "gesture_pattern": "chest_to_fists_strong", "deskripsi_gerakan": "Tangan terbuka menyentuh pundak lalu ditarik ke depan menjadi kepalan tangan bertenaga."}
        ]
        for v in vocab_data:
            Video.objects.update_or_create(
                kata=v['kata'],
                tipe_bahasa=v['tipe_bahasa'],
                defaults={
                    'kategori': v['kategori'],
                    'gesture_pattern': v['gesture_pattern'],
                    'deskripsi_gerakan': v['deskripsi_gerakan'],
                    'durasi': 2,
                    'status': 'active'
                }
            )
        self.stdout.write(self.style.SUCCESS(f'Seeded {len(vocab_data)} vocabulary items'))

        self.stdout.write(self.style.SUCCESS('Database seeding completed successfully!'))
