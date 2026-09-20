# ***Product Requirements Document (PRD)***
## ***Website Penerjemah Bahasa Isyarat SIBI & BISINDO***

---

| Informasi | Detail |
|-----------|--------|
| **Versi** | 2.0 |
| **Tanggal** | 24 Agustus 2026 |
| **Status** | Final |
| **Penulis** | Product Team |

---

## ***Daftar Isi***

1. [Executive Summary](#1-executive-summary)
2. [Fitur & Functional Requirements](#2-fitur--functional-requirements)
3. [Non-Functional Requirements](#3-non-functional-requirements)
4. [User Flow](#4-user-flow)
5. [Data Requirements](#5-data-requirements)
6. [UI/UX Requirements](#6-uiux-requirements)
7. [Tech Stack & Arsitektur](#7-tech-stack--arsitektur)
8. [Struktur Project](#8-struktur-project)
9. [API Specification](#9-api-specification)
10. [Model Deep Learning (YOLOv11) (SOON)](#10-machine-learning-yolo-11)
11. [Acceptance Criteria](#11-acceptance-criteria)
12. [Roadmap](#12-roadmap)
13. [Risiko & Mitigasi](#13-risiko--mitigasi)
14. [Glossary](#14-glossary)

---

## 1. ***Executive Summary***

### 1.1 Latar Belakang
Website penerjemah bahasa isyarat ini dikembangkan untuk menjembatani komunikasi antara penyandang tunarungu/tunawicara dengan masyarakat umum di Indonesia. Platform ini mendukung dua sistem bahasa isyarat utama: **SIBI (Sistem Isyarat Bahasa Indonesia)** dan **BISINDO (Bahasa Isyarat Indonesia)**.

### 1.2 Tujuan Produk
- Menyediakan platform penerjemahan bahasa isyarat yang akurat dan mudah diakses
- Meningkatkan literasi bahasa isyarat di kalangan masyarakat umum
- Membangun komunitas yang inklusif bagi penyandang disabilitas pendengaran
- Mendukung komunikasi dua arah (teks → isyarat dan isyarat → teks)

### 1.3 Target Pengguna

| Segmen | Deskripsi |
|--------|-----------|
| **Penyandang Tunarungu/Tunawicara** | Pengguna utama yang membutuhkan penerjemahan isyarat ke teks |
| **Masyarakat Umum** | Orang tua, guru, relawan, atau siapa saja yang ingin belajar bahasa isyarat |
| **Tenaga Pendidik** | Guru SLB, tutor bahasa isyarat |
| **Admin/Operator** | Tim yang mengelola konten dan komunitas |

---

## 2. ***Fitur & Functional Requirements***

### 2.1 Homepage / Landing Page

#### 2.1.1 Berita Terkini tentang Bahasa Isyarat
| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-HP-01 | Menampilkan daftar berita terbaru seputar bahasa isyarat, komunitas, dan disabilitas | High |
| FR-HP-02 | Setiap berita menampilkan: judul, cuplikan, gambar thumbnail, tanggal publikasi, dan kategori | High |
| FR-HP-03 | Berita dapat diklik untuk melihat detail lengkap | High |
| FR-HP-04 | Terdapat filter berdasarkan kategori (Edukasi, Komunitas, Teknologi, Event) | Medium |
| FR-HP-05 | Pagination atau infinite scroll untuk daftar berita | Medium |

#### 2.1.2 Pengertian & Pengenalan Bahasa Isyarat
| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-HP-06 | Section edukasi yang menjelaskan perbedaan SIBI dan BISINDO | High |
| FR-HP-07 | Konten visual (infografis/ilustrasi) yang menarik dan mudah dipahami | High |
| FR-HP-08 | Informasi sejarah, struktur, dan penggunaan bahasa isyarat di Indonesia | Medium |
| FR-HP-09 | Video pengenalan singkat (embed dari YouTube) | Low |

#### 2.1.3 Alur Penggunaan (How It Works)
| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-HP-10 | Section yang menjelaskan langkah-langkah penggunaan translator | High |
| FR-HP-11 | Visualisasi alur dengan ikon/ilustrasi step-by-step | High |
| FR-HP-12 | Dua jalur alur: (a) Teks → Video Isyarat, (b) Kamera → Teks | High |

#### 2.1.4 Komunitas
| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-HP-13 | Preview aktivitas komunitas terbaru | Medium |
| FR-HP-14 | Informasi cara bergabung dengan komunitas | Medium |
| FR-HP-15 | Testimonial dari anggota komunitas | Medium |

#### 2.1.5 Tentang Kami
| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-HP-16 | Profil organisasi/tim pengembang | Medium |
| FR-HP-17 | Kontak dan media sosial | Medium |

#### 2.1.6 Visi & Misi
| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-HP-18 | Penjelasan visi dan misi organisasi | Medium |
| FR-HP-19 | Nilai-nilai yang dijunjung | Low |

#### 2.1.7 Timeline Komunitas
| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-HP-20 | Timeline interaktif perjalanan komunitas | Medium |
| FR-HP-21 | Milestone penting dengan tanggal dan deskripsi | Medium |
| FR-HP-22 | Format timeline: vertikal dengan animasi scroll | Low |

---

### 2.2 Modul Translator

#### 2.2.1 Pemilihan Sistem Bahasa Isyarat
| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-TR-01 | Tampilan 2 card besar: **SIBI** dan **BISINDO** | High |
| FR-TR-02 | Setiap card menampilkan: nama, deskripsi singkat, ikon/logo | High |
| FR-TR-03 | User harus memilih salah satu sebelum melanjutkan | High |
| FR-TR-04 | Setelah dipilih, sistem menyimpan preferensi user (session/local storage) | Medium |

#### 2.2.2 Mode Teks → Video Isyarat (Text to Sign)
| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-TR-05 | Input field untuk mengetik kalimat | High |
| FR-TR-06 | Tombol "Terjemahkan" untuk memproses | High |
| FR-TR-07 | Sistem memecah kalimat menjadi kata per kata | High |
| FR-TR-08 | Menampilkan video peragaan bahasa isyarat per kata secara berurutan | High |
| FR-TR-09 | Contoh: Input "aku sayang ibu" → video "aku", "sayang", "ibu" | High |
| FR-TR-10 | Kontrol pemutaran: play, pause, replay, next word, previous word | High |
| FR-TR-11 | Indikator progress (kata ke-X dari Y total) | Medium |
| FR-TR-12 | Jika kata tidak tersedia, tampilkan notifikasi dan saran kata terdekat | Medium |
| FR-TR-13 | History pencarian untuk user yang login | Low |

#### 2.2.3 Mode Kamera → Teks (Sign to Text)
| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-TR-14 | Permintaan izin akses kamera device user | High |
| FR-TR-15 | Tampilan live camera feed dengan area deteksi | High |
| FR-TR-16 | User memperagakan bahasa isyarat di depan kamera | High |
| FR-TR-17 | Sistem mengenali gerakan isyarat dan mengonversi menjadi teks per kata | High |
| FR-TR-18 | Teks hasil ditampilkan secara real-time atau setelah gestur selesai | High |
| FR-TR-19 | Tombol "Hapus" untuk mengosongkan hasil | Medium |
| FR-TR-20 | Tombol "Salin Teks" untuk menyalin hasil ke clipboard | Medium |
| FR-TR-21 | Indikator confidence level (opsional) | Low |

#### 2.2.4 Text to Audio (Out of Scope)
| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-TR-22 | Fitur konversi teks hasil ke audio **dikecualikan** dari scope | - |
| FR-TR-23 | Dapat ditambahkan sebagai fitur di masa depan (roadmap) | - |

---

### 2.3 Proses Bisnis Admin

#### 2.3.1 CRUD Berita Terkini
| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-AD-01 | Halaman dashboard admin | High |
| FR-AD-02 | Form tambah berita: judul, konten (rich text editor), kategori, gambar thumbnail, tanggal publikasi | High |
| FR-AD-03 | Daftar berita dengan fitur: edit, hapus, draft/publish | High |
| FR-AD-04 | Upload gambar dengan validasi format dan ukuran | High |
| FR-AD-05 | Preview berita sebelum dipublikasikan | Medium |
| FR-AD-06 | Soft delete untuk berita | Medium |

#### 2.3.2 Manajemen Data Video
| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-AD-07 | Upload video peragaan bahasa isyarat | High |
| FR-AD-08 | Form upload: video file, kata yang diwakili, kategori (SIBI/BISINDO), tag | High |
| FR-AD-09 | Validasi video: format (MP4/WebM), durasi maksimal, ukuran file | High |
| FR-AD-10 | Thumbnail generator otomatis dari video | Medium |
| FR-AD-11 | Daftar video dengan filter: kata, kategori, status | Medium |
| FR-AD-12 | Edit metadata video | Medium |
| FR-AD-13 | Hapus video | Medium |
| FR-AD-14 | Batch upload untuk multiple video | Low |

#### 2.3.3 Pemantauan Komunitas
| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-AD-15 | Dashboard ringkasan aktivitas komunitas | Medium |
| FR-AD-16 | Daftar anggota komunitas dengan profil | Medium |
| FR-AD-17 | Moderasi konten yang dilaporkan | Low |
| FR-AD-18 | Manajemen laporan/masukan dari user | Low |
| FR-AD-19 | Statistik: jumlah anggota, aktivitas, pertumbuhan | Medium |

#### 2.3.4 Update Timeline Komunitas
| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-AD-20 | Form tambah milestone: judul, deskripsi, tanggal, gambar (opsional) | Medium |
| FR-AD-21 | Edit dan hapus milestone | Medium |
| FR-AD-22 | Urutan milestone dapat diatur (drag & drop) | Low |
| FR-AD-23 | Preview timeline di frontend | Low |

---

### 2.4 Proses Bisnis User

#### 2.4.1 Akses Homepage
| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-US-01 | User dapat mengakses homepage tanpa login | High |
| FR-US-02 | Navigasi menu: Beranda, Translator, Berita, Komunitas, Tentang Kami | High |
| FR-US-03 | Responsive design untuk desktop, tablet, dan mobile | High |

#### 2.4.2 Penggunaan Translator
| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-US-04 | User memilih card SIBI atau BISINDO | High |
| FR-US-05 | Untuk Text to Sign: user mengetik kalimat → sistem menampilkan video per kata | High |
| FR-US-06 | Untuk Sign to Text: user mengizinkan kamera → memperagakan isyarat → teks muncul | High |
| FR-US-07 | User dapat beralih antara mode SIBI dan BISINDO kapan saja | Medium |

---

## 3. ***Non-Functional Requirements***

### 3.1 Performa
| ID | Requirement |
|----|-------------|
| NFR-01 | Halaman homepage load time < 3 detik |
| NFR-02 | Video playback mulus tanpa buffering berlebihan |
| NFR-03 | Deteksi kamera real-time dengan latency < 500ms (target) |
| NFR-04 | Sistem mampu menangani 1000+ concurrent users |

### 3.2 Keamanan
| ID | Requirement |
|----|-------------|
| NFR-05 | Autentikasi admin dengan JWT token |
| NFR-06 | Enkripsi data sensitif |
| NFR-07 | Validasi input untuk mencegah XSS dan SQL Injection |
| NFR-08 | Role-based access control (RBAC) |

### 3.3 Ketersediaan
| ID | Requirement |
|----|-------------|
| NFR-09 | Uptime 99.5% |
| NFR-10 | Backup data harian |

### 3.4 Kompatibilitas
| ID | Requirement |
|----|-------------|
| NFR-11 | Support browser: Chrome, Firefox, Safari, Edge (versi terbaru) |
| NFR-12 | Support mobile browser dengan kamera access |
| NFR-13 | Responsive design untuk layar 320px - 1920px+ |

### 3.5 Aksesibilitas
| ID | Requirement |
|----|-------------|
| NFR-14 | WCAG 2.1 Level AA compliance |
| NFR-15 | Kontras warna memadai untuk tunanetra |
| NFR-16 | Keyboard navigation support |
| NFR-17 | Screen reader friendly |

---

## 4. ***User Flow***

### 4.1 Alur User - Text to Sign
```
[Homepage] → [Pilih Menu Translator] → [Pilih Card SIBI/BISINDO] 
→ [Ketik Kalimat] → [Klik Terjemahkan] 
→ [Tampil Video Per Kata] → [Play/Pause/Next/Prev]
```

### 4.2 Alur User - Sign to Text
```
[Homepage] → [Pilih Menu Translator] → [Pilih Card SIBI/BISINDO]
→ [Izinkan Akses Kamera] → [Tampil Live Camera]
→ [User Memperagakan Isyarat] → [Sistem Deteksi YOLO 11]
→ [Teks Muncul Per Kata] → [Salin/Hapus]
```

### 4.3 Alur Admin - CRUD Berita
```
[Login Admin] → [Dashboard] → [Menu Berita]
→ [Tambah/Edit/Hapus] → [Form Input] → [Preview] → [Publish/Draft]
```

### 4.4 Alur Admin - Upload Video
```
[Login Admin] → [Dashboard] → [Menu Video]
→ [Upload Video] → [Input Metadata] → [Validasi]
→ [Publish] → [Tersedia di Translator]
```

---

## 5. ***Data Requirements***

### 5.1 Entitas Utama

#### User
| Field | Tipe | Keterangan |
|-------|------|------------|
| id | UUID | Primary key |
| email | String | Unique, digunakan untuk login |
| nama | String(100) | Nama lengkap |
| avatar | Image | Foto profil |
| role | Enum | admin / user / educator |
| is_staff | Boolean | Staff status |
| is_active | Boolean | Aktif/tidak |
| bio | Text | Bio singkat |
| is_komunitas_member | Boolean | Anggota komunitas |
| joined_komunitas_at | DateTime | Tanggal gabung komunitas |
| date_joined | DateTime | Tanggal registrasi |

#### Berita
| Field | Tipe | Keterangan |
|-------|------|------------|
| id | UUID | Primary key |
| judul | String(255) | Judul berita |
| slug | Slug | URL-friendly identifier |
| konten | Text | Isi berita (rich text) |
| kategori | Enum | edukasi / komunitas / teknologi / event |
| thumbnail | Image | Gambar thumbnail |
| status | Enum | draft / published |
| author | FK → User | Penulis berita |
| views | Integer | Jumlah views |
| is_deleted | Boolean | Soft delete flag |
| created_at | DateTime | Tanggal dibuat |
| updated_at | DateTime | Tanggal diupdate |
| published_at | DateTime | Tanggal publikasi |

#### Video
| Field | Tipe | Keterangan |
|-------|------|------------|
| id | UUID | Primary key |
| kata | String(100) | Kata yang diwakili (indexed) |
| video_file | File | File video (MP4/WebM/MOV) |
| thumbnail | Image | Thumbnail video |
| tipe_bahasa | Enum | SIBI / BISINDO |
| tag | String(100) | Tag tambahan |
| durasi | Integer | Durasi video (detik) |
| status | Enum | active / inactive |
| created_at | DateTime | Tanggal upload |

#### Timeline
| Field | Tipe | Keterangan |
|-------|------|------------|
| id | UUID | Primary key |
| judul | String(255) | Judul milestone |
| deskripsi | Text | Penjelasan milestone |
| tanggal | Date | Tanggal kejadian |
| gambar | Image | Gambar (opsional) |
| urutan | Integer | Urutan tampilan |
| is_active | Boolean | Aktif/tidak |

#### TranslationHistory
| Field | Tipe | Keterangan |
|-------|------|------------|
| id | UUID | Primary key |
| user | FK → User | User yang melakukan translasi |
| tipe_translasi | Enum | text_to_sign / sign_to_text |
| tipe_bahasa | Enum | SIBI / BISINDO |
| input_text | Text | Input teks |
| output_text | Text | Output teks |
| video_ids | JSON | List video ID (untuk text_to_sign) |
| confidence_score | Float | Confidence score |
| created_at | DateTime | Tanggal translasi |

#### KomunitasActivity
| Field | Tipe | Keterangan |
|-------|------|------------|
| id | UUID | Primary key |
| judul | String(255) | Judul aktivitas |
| deskripsi | Text | Deskripsi |
| tipe | Enum | event / workshop / pelatihan / pertemuan |
| tanggal_mulai | DateTime | Waktu mulai |
| tanggal_selesai | DateTime | Waktu selesai |
| lokasi | String(255) | Lokasi |
| gambar | Image | Gambar aktivitas |
| is_active | Boolean | Aktif/tidak |

#### KomunitasMember
| Field | Tipe | Keterangan |
|-------|------|------------|
| id | UUID | Primary key |
| user | OneToOne → User | Anggota |
| alasan_bergabung | Text | Alasan bergabung |
| status | Enum | pending / approved / rejected |
| approved_at | DateTime | Tanggal diterima |
| approved_by | FK → User | Admin yang menyetujui |

---

## 6. ***UI/UX Requirements***

### 6.1 Design System
| Komponen | Spesifikasi |
|----------|-------------|
| Warna Utama | Biru `#2563EB` |
| Warna Aksen | Hijau `#10B981` |
| Typography | Inter atau Roboto |
| Icon Set | Lucide React / Heroicons |
| Rounded Corners | 8px - 16px |
| Shadow | Subtle shadow untuk card dan modal |

### 6.2 Komponen Kunci
| Komponen | Deskripsi |
|----------|-----------|
| Card SIBI/BISINDO | Besar, visual, dengan hover effect |
| Video Player | Minimalis dengan kontrol play/pause/next/prev |
| Camera Feed | Large container dengan overlay deteksi |
| Timeline | Vertikal dengan garis penghubung dan dot indicator |
| Form Admin | Clean, dengan validasi real-time |

### 6.3 Responsive Breakpoints
| Breakpoint | Ukuran |
|------------|--------|
| Mobile | < 768px |
| Tablet | 768px - 1024px |
| Desktop | > 1024px |

---

## 7. ***Tech Stack & Arsitektur***

### 7.1 Tech Stack Final

| Layer | Teknologi | Keterangan |
|-------|-----------|------------|
| **Frontend** | React 18+ | SPA dengan Vite, Tailwind CSS, Zustand |
| **Backend** | Django 5.x + Django Ninja | REST API dengan type hints & auto-docs |
| **Database** | PostgreSQL 15+ | Relational database |
| **ORM** | Django ORM | Full-featured ORM bawaan Django |
| **ML** | YOLO 11 (Ultralytics) | Hand keypoint detection + LSTM sequence |
| **Auth** | JWT (PyJWT) | Token-based authentication |
| **Storage** | AWS S3 / Local | Video & gambar |
| **Cache** | Redis | Session & cache |

### 7.2 Kenapa Django Ninja?

| Fitur | Keuntungan |
|-------|------------|
| **Type Hints Native** | Validasi otomatis dengan Python type hints |
| **Auto Documentation** | Swagger UI / Redoc otomatis |
| **Performance** | ~3x lebih cepat dari DRF |
| **Pythonic** | Kode lebih ringkas dan modern |
| **Django ORM Integration** | Works seamlessly dengan Django ORM |

### 7.3 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React SPA  │  │  Web Camera  │  │  Video Player│      │
│  │   (User)     │  │  (WebRTC)    │  │  (HTML5)     │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼─────────────────┼─────────────────┼──────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY (Nginx)                     │
└───────────────────────────┬─────────────────────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
┌─────────────────┐ ┌──────────────┐ ┌─────────────────┐
│   Django API    │ │  ML Service  │ │  Django Admin   │
│   (Django Ninja)│ │  (YOLO 11)   │ │  (Dashboard)    │
│                 │ │              │ │                 │
│ - Auth (JWT)    │ │ - /detect    │ │ - CRUD Berita   │
│ - Berita API    │ │ - /predict   │ │ - Upload Video  │
│ - Video API     │ │              │ │ - Timeline      │
│ - Translator    │ │              │ │ - Komunitas     │
└────────┬────────┘ └──────┬───────┘ └─────────────────┘
         │                 │
         ▼                 ▼
┌─────────────────────────────────────┐
│         DATA LAYER                  │
│  ┌──────────────┐  ┌──────────────┐│
│  │  PostgreSQL  │  │    Redis     ││
│  │  (Primary)   │  │   (Cache)    ││
│  └──────────────┘  └──────────────┘│
│  ┌──────────────┐                   │
│  │  AWS S3      │                   │
│  │  (Storage)   │                   │
│  └──────────────┘                   │
└─────────────────────────────────────┘
```

---

## 8. ***Struktur Project***

```
sibi_bisindo_project/
│
├── 📂 config/                          # Konfigurasi Django
│   ├── __init__.py
│   ├── settings.py                     # Settings lengkap
│   ├── urls.py                         # Root URL + NinjaAPI
│   ├── wsgi.py
│   └── asgi.py
│
├── 📂 apps/                            # Modular apps
│   ├── 📂 accounts/                    # Autentikasi & User
│   │   ├── models.py                   # Custom User (email-based)
│   │   ├── managers.py                 # UserManager
│   │   ├── schemas.py                  # Ninja schemas
│   │   ├── services.py                 # AuthService (JWT)
│   │   ├── api.py                      # Endpoint auth
│   │   └── admin.py
│   │
│   ├── 📂 berita/                      # CRUD Berita
│   │   ├── models.py                   # Berita model
│   │   ├── schemas.py                  # Berita schemas
│   │   ├── api.py                      # Berita endpoints
│   │   └── admin.py
│   │
│   ├── 📂 video/                       # Manajemen Video
│   │   ├── models.py                   # Video model
│   │   ├── schemas.py                  # Video schemas
│   │   ├── api.py                      # Video endpoints
│   │   └── admin.py
│   │
│   ├── 📂 translator/                  # Core Translator
│   │   ├── models.py                   # TranslationHistory
│   │   ├── schemas.py                  # Translator schemas
│   │   ├── services.py                 # TranslatorService
│   │   ├── api.py                      # /text-to-sign, /sign-to-text
│   │   └── admin.py
│   │
│   ├── 📂 timeline/                    # Timeline Komunitas
│   │   ├── models.py                   # Timeline model
│   │   ├── schemas.py                  # Timeline schemas
│   │   ├── api.py                      # Timeline endpoints
│   │   └── admin.py
│   │
│   └── 📂 komunitas/                   # Komunitas
│       ├── models.py                   # Activity, Testimonial, Member
│       ├── schemas.py                  # Komunitas schemas
│       ├── api.py                      # Komunitas endpoints
│       └── admin.py
│
├── 📂 shared/                          # Shared utilities
│   ├── 📂 constants/
│   │   └── __init__.py                 # Constants
│   └── 📂 utils/
│       ├── pagination.py               # Pagination helper
│       └── permissions.py              # Auth decorators
│
├── 📂 ml_service/                      # Machine Learning
│   ├── __init__.py
│   ├── detector.py                     # YOLO 11 Hand Detector
│   ├── 📂 models/                      # Trained models
│   └── 📂 datasets/                    # Training datasets
│
├── 📂 media/                           # Uploads
│   ├── berita/
│   ├── video/
│   └── timeline/
│
├── 📂 static/                          # Static files
├── 📂 tests/                           # Unit tests
│
├── 📄 manage.py
├── 📄 requirements.txt
├── 📄 .env.example
└── 📄 .gitignore
```

---

## 9. ***API Specification***

### 9.1 Authentication

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/register` | Registrasi user baru | Public |
| POST | `/api/auth/login` | Login & dapatkan token | Public |
| POST | `/api/auth/refresh` | Refresh access token | Public |
| GET | `/api/auth/me` | Get data user login | Required |
| PUT | `/api/auth/me` | Update profil | Required |
| POST | `/api/auth/change-password` | Ganti password | Required |

### 9.2 Berita

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/api/berita/` | List berita (paginated) | Public |
| GET | `/api/berita/terbaru` | 5 berita terbaru | Public |
| GET | `/api/berita/{slug}` | Detail berita by slug | Public |
| POST | `/api/berita/` | Tambah berita | Admin |
| PUT | `/api/berita/{id}` | Update berita | Admin |
| DELETE | `/api/berita/{id}` | Soft delete berita | Admin |
| POST | `/api/berita/{id}/upload-thumbnail` | Upload thumbnail | Admin |

### 9.3 Video

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/api/video/` | List video (paginated) | Public |
| GET | `/api/video/cari` | Cari video by kata | Public |
| GET | `/api/video/{id}` | Detail video | Public |
| POST | `/api/video/` | Tambah video metadata | Admin |
| PUT | `/api/video/{id}` | Update video | Admin |
| DELETE | `/api/video/{id}` | Hapus video | Admin |
| POST | `/api/video/{id}/upload` | Upload file video | Admin |

### 9.4 Translator

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/api/translator/text-to-sign` | Teks → Video isyarat | Optional |
| POST | `/api/translator/sign-to-text` | Frame kamera → Teks | Optional |
| GET | `/api/translator/history` | Riwayat translasi | Required |

**Request/Response Text to Sign:**
```json
// Request
{
  "teks": "aku sayang ibu",
  "tipe_bahasa": "SIBI"
}

// Response
{
  "input_teks": "aku sayang ibu",
  "tipe_bahasa": "SIBI",
  "kata_list": ["aku", "sayang", "ibu"],
  "videos": [
    {
      "kata": "aku",
      "video_url": "/media/video/isyarat/aku_sibi.mp4",
      "thumbnail": "/media/video/thumbnails/aku.jpg",
      "durasi": 2,
      "tersedia": true
    }
  ],
  "total_kata": 3,
  "kata_tersedia": 3,
  "kata_tidak_tersedia": []
}
```

### 9.5 Timeline

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/api/timeline/` | List timeline | Public |
| POST | `/api/timeline/` | Tambah milestone | Admin |
| PUT | `/api/timeline/{id}` | Update milestone | Admin |
| DELETE | `/api/timeline/{id}` | Hapus milestone | Admin |
| POST | `/api/timeline/{id}/upload-gambar` | Upload gambar | Admin |

### 9.6 Komunitas

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/api/komunitas/activities` | List aktivitas | Public |
| GET | `/api/komunitas/testimonials` | List testimonial | Public |
| GET | `/api/komunitas/members` | List anggota (approved) | Public |
| POST | `/api/komunitas/join` | Daftar komunitas | Required |
| GET | `/api/komunitas/admin/members` | List semua anggota | Admin |
| POST | `/api/komunitas/admin/members/{id}/approve` | Terima anggota | Admin |
| POST | `/api/komunitas/admin/members/{id}/reject` | Tolak anggota | Admin |

---

## 10. ***Model Deep Learning (YOLO 11) (SOON)***

### 10.1 Arsitektur ML Pipeline

```
[Camera Feed] → [Frame Extraction] → [YOLO 11 Pose: Hand Detection]
→ [21 Keypoint Landmark] → [Sequence Model (LSTM)]
→ [Kata Prediction] → [Teks Output]
```

### 10.2 Komponen ML

| Komponen | Teknologi | Fungsi |
|----------|-----------|--------|
| Hand Detection | YOLO 11 Pose | Deteksi tangan + 21 keypoint landmark |
| Sequence Model | LSTM / Transformer | Klasifikasi gestur dari sequence keypoints |
| Inference Engine | ONNX Runtime | Optimasi inference speed |
| Preprocessing | OpenCV | Frame extraction & hand cropping |

### 10.3 Training Pipeline

1. **Kumpulkan dataset** video bahasa isyarat SIBI & BISINDO
2. **Extract frames** dan annotate dengan keypoints
3. **Fine-tune YOLO 11** pada dataset tangan
4. **Train LSTM** pada keypoint sequences
5. **Export ke ONNX** untuk inference cepat

### 10.4 File ML Service

```
ml_service/
├── __init__.py
├── detector.py              # HandDetector, SignClassifier, SignToTextService
├── 📂 models/
│   ├── yolo11n-pose.pt      # YOLO 11 model
│   ├── sign_classifier.onnx # ONNX classifier
│   └── README.md
└── 📂 datasets/
    ├── sibi/                # Dataset SIBI
    └── bisindo/             # Dataset BISINDO
```

---

## 11. ***Acceptance Criteria***

### 11.1 Translator Text to Sign
- [ ] User dapat mengetik kalimat dan melihat video per kata dengan benar
- [ ] Video berurutan sesuai input tanpa terlewat
- [ ] Kontrol pemutaran (play, pause, next, prev) berfungsi dengan baik
- [ ] Kata yang tidak tersedia ditangani dengan notifikasi
- [ ] Contoh: "aku sayang ibu" → muncul video "aku", "sayang", "ibu"

### 11.2 Translator Sign to Text
- [ ] Kamera dapat diakses setelah izin diberikan
- [ ] Gerakan isyarat terdeteksi dan dikonversi ke teks
- [ ] Teks muncul per kata secara real-time
- [ ] Tombol salin dan hapus berfungsi
- [ ] YOLO 11 mendeteksi tangan dengan confidence > 0.5

### 11.3 Admin Panel
- [ ] Admin dapat login dengan aman
- [ ] CRUD berita berfungsi lengkap (tambah, edit, hapus, draft/publish)
- [ ] Upload video dengan validasi format & ukuran
- [ ] Timeline dapat diupdate (tambah, edit, hapus)
- [ ] Dashboard komunitas menampilkan data akurat
- [ ] Admin dapat menerima/tolak anggota komunitas

### 11.4 Tech Stack Compliance
- [ ] Frontend menggunakan React 18+
- [ ] Backend menggunakan Django 5.x + Django Ninja
- [ ] Database menggunakan PostgreSQL
- [ ] ML menggunakan YOLO 11 untuk hand detection
- [ ] API menggunakan JWT authentication
- [ ] Django ORM digunakan untuk semua query database

---

## 12. ***Roadmap***

| Fase | Timeline | Deliverables |
|------|----------|--------------|
| **Fase 1: MVP** | Bulan 1-2 | Setup Django + Ninja + PostgreSQL, React frontend, Text to Sign (SIBI), Admin CRUD Berita & Video |
| **Fase 2: Enhancement** | Bulan 3-4 | BISINDO support, YOLO 11 Sign to Text, Manajemen Video, Celery background tasks |
| **Fase 3: Komunitas** | Bulan 5-6 | Fitur komunitas (join, approve, testimonial), Timeline interaktif, User registration |
| **Fase 4: Scale** | Bulan 7+ | Mobile app, Text to Audio, Advanced AI model, CDN optimization, Docker deployment |

---

## 13. ***Risiko & Mitigasi***

| Risiko | Dampak | Mitigasi |
|--------|--------|----------|
| Akurasi YOLO 11 Sign to Text rendah | Tinggi | Dataset besar (>10k samples), data augmentation, continuous training |
| Performa video lambat | Sedang | CDN (Cloudflare), video compression H.265, lazy loading |
| Izin kamera ditolak user | Sedang | Edukasi pengguna, fallback upload video |
| Perbedaan dialek isyarat | Sedang | Fokus pada standar nasional, label variasi |
| Django ORM overhead | Rendah | Query optimization, indexing, caching dengan Redis |
| YOLO 11 inference lambat di mobile | Sedang | Model quantization (INT8), ONNX Runtime, edge deployment |

---

## 14. ***Glossary***

| Istilah | Definisi |
|---------|----------|
| **SIBI** | Sistem Isyarat Bahasa Indonesia - sistem isyarat yang mengikuti struktur bahasa Indonesia |
| **BISINDO** | Bahasa Isyarat Indonesia - bahasa isyarat alami komunitas tunarungu Indonesia |
| **Tunarungu** | Penyandang disabilitas pendengaran |
| **Tunawicara** | Penyandang disabilitas berbicara |
| **YOLO 11** | You Only Look Once v11 - model object detection & pose estimation terbaru dari Ultralytics |
| **Django Ninja** | Framework REST API untuk Django dengan type hints native |
| **JWT** | JSON Web Token - metode autentikasi token-based |
| **Teks to Audio** | Konversi teks ke suara (Text-to-Speech) - **out of scope** |
| **Django ORM** | Object-Relational Mapping bawaan Django untuk query database |

---

**End of Document**

*Dokumen ini akan direview dan diupdate secara berkala sesuai perkembangan proyek.*
