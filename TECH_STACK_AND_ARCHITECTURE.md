# 🚀 Justifikasi Teknis & Arsitektur SETARA
## *Platform Penerjemah Bahasa Isyarat Dua Arah (SIBI & BISINDO)*

> **Dokumen Panduan Presentasi & Defense Juri**  
> Dibuat untuk menjelaskan alasan teknis (*Why*), analisis komparasi (*Trade-offs*), dan pola perancangan perangkat lunak (*Design Patterns*) yang melandasi pengembangan platform **SETARA**.

---

## 📑 Daftar Isi
1. [Ringkasan Eksekutif (Executive Summary)](#1-ringkasan-eksekutif-executive-summary)
2. [Alasan Pemilihan Tech Stack & Komparasi](#2-alasan-pemilihan-tech-stack--komparasi)
   - [A. Frontend: React 18 + Vite](#a-frontend-react-18--vite)
   - [B. State Management: Zustand](#b-state-management-zustand)
   - [C. Styling & UI: Tailwind CSS + Glassmorphism System](#c-styling--ui-tailwind-css--glassmorphism-system)
   - [D. Backend API: Django + Django Ninja](#d-backend-api-django--django-ninja)
   - [E. Database: PostgreSQL](#e-database-postgresql)
   - [F. Kecerdasan Buatan (AI): YOLO11](#f-kecerdasan-buatan-ai-yolo11)
3. [Design Patterns & Pola Arsitektur](#3-design-patterns--pola-arsitektur)
   - [1. Single Source of Truth & Flux Pattern (Zustand)](#1-single-source-of-truth--flux-pattern-zustand)
   - [2. View Gating & History Navigation Pattern](#2-view-gating--history-navigation-pattern)
   - [3. Fallback & Graceful Degradation Pattern (Dual Rendering Engine)](#3-fallback--graceful-degradation-pattern-dual-rendering-engine)
   - [4. Observer Pattern (Theme & Authentication Lifecycle)](#4-observer-pattern-theme--authentication-lifecycle)
   - [5. Tokenizer & Hybrid Linguistic Normalization Pattern](#5-tokenizer--hybrid-linguistic-normalization-pattern)
   - [6. Modular Router & Service Layer Pattern](#6-modular-router--service-layer-pattern)
4. [Tabel Komparasi Cepat (Tech Stack Matrix)](#4-tabel-komparasi-cepat-tech-stack-matrix)
5. [Cheat Sheet Tanya Jawab Juri (Q&A Defense)](#5-cheat-sheet-tanya-jawab-juri-qa-defense)

---

## 1. Ringkasan Eksekutif (Executive Summary)

**SETARA** adalah platform inklusi bahasa isyarat dua arah yang menggabungkan:
1. **Teks ke Isyarat**: Penerjemahan kata/kalimat menjadi video peragaan asli atau animasi visual isyarat dual-sistem (**SIBI & BISINDO**).
2. **Kamera ke Teks**: Deteksi gerakan tangan berbasis kecerdasan buatan (*Computer Vision*) secara *real-time*.
3. **Ekosistem Inklusif**: Kamus digital kosakata isyarat, berita disabilitas, portal komunitas terverifikasi, dan ruang berbagi cerita pengguna.

### Tantangan Utama yang Harus Diselesaikan Arsitektur:
- **Latensi Rendah (*Real-Time*)**: Pengenalan isyarat kamera dan pemutaran video peraga tidak boleh terhenti (*lag/buffering*) karena komunikasi bahasa isyarat membutuhkan kelancaran visual tinggi.
- **Ketersediaan Offline/Fallback**: Jika database video belum memiliki kosakata tertentu, sistem tidak boleh rusak (*graceful degradation* ke procedural canvas animation).
- **Aksesibilitas & Kontras Tinggi**: Memenuhi standar keterbacaan antarmuka bagi pengguna Teman Tuli dan Dengar.

---

## 2. Alasan Pemilihan Tech Stack & Komparasi

### A. Frontend: React 18 + Vite

```
Client Browser ──> Vite HMR (Instant ESM) ──> React 18 Virtual DOM (Concurrent Mode)
```

#### 💡 Kenapa Memilih React 18 + Vite?
1. **Reaktivitas Antarmuka Interaktif**: Antarmuka penerjemah menuntut sinkronisasi *real-time* antara input teks, tokenisasi isyarat, state pemutaran video, dan feed webcam. *Virtual DOM* dan *Concurrent Features* di React 18 menjaga render UI tetap stabil tanpa *frame drop*.
2. **Kecepatan Build & Development (Vite)**: Vite menggunakan *Native ES Modules (ESM)* dan bundler *Rollup*. Waktu kompilasi awal di bawah **1 detik** dan *Hot Module Replacement (HMR)* berlangsung instan, krusial untuk iterasi cepat komponen visual interaktif.
3. **Ekosistem & Modularitas Komponen**: Memungkinkan pemisahan clean antara modul kamera, pemutar isyarat, canvas partikel, dan panel dashboard admin.

#### ⚖️ Mengapa Bukan Alternatif Lain?
| Opsi | Kenapa Bukan Ini? |
| :--- | :--- |
| **Next.js (SSR/Full-stack)** | Aplikasi ini didominasi fitur sisi klien (*webcam stream*, canvas rendering, video player lokal, client-side NLP tokenization). SSR Next.js menambah overhead server yang tidak dibutuhkan untuk streaming video isyarat interaktif. |
| **Create React App (CRA)** | CRA sudah *deprecated*, menggunakan Webpack lama yang lambat dalam proses bundling dan HMR. |
| **Vanilla JS** | Terlalu sulit dikelola (*spaghetti code*) saat mengelola *complex multi-tab states* (kamera, teks, riwayat, audio, modal). |

---

### B. State Management: Zustand

```
[UI Components] ──(Select Slice)──> [useContentStore / useThemeStore / useTranslatorStore]
       ▲                                               │
       └────────────── (Re-render hanya jika slice berubah) ──────────┘
```

#### 💡 Kenapa Memilih Zustand?
1. **Zero Boilerplate & Sangat Ringan**: Ukuran paket Zustand hanya **~1 kB**, dibandingkan Redux Toolkit yang mencapai puluhan kB.
2. **Selective Subscription (Mencegah Lag)**: Komponen hanya re-render jika data spesifik yang diakses berubah. Contoh: saat timer deteksi isyarat kamera berjalan 30 FPS, komponen navbar atau list berita di background tidak ikut re-render.
3. **Bisa Digunakan di Luar React Context**: Memudahkan pemanggilan state di utilitas async, event listener browser, atau service layer tanpa harus membungkus komponen dalam hierarki *Provider hell*.

#### ⚖️ Mengapa Bukan Alternatif Lain?
| Opsi | Kenapa Bukan Ini? |
| :--- | :--- |
| **Redux / Redux Toolkit** | *Over-engineering* untuk aplikasi skala ini: membutuhkan action types, reducers, dispatchers, and store providers yang memperlambat laju pengembangan. |
| **React Context API** | Context API memicu re-render seluruh subtree saat nilai konteks berubah, menimbulkan *performance bottleneck* saat streaming kamera dan sinkronisasi audio-video. |

---

### C. Styling & UI: Tailwind CSS + Glassmorphism System

#### 💡 Kenapa Memilih Tailwind CSS?
1. **Desain Sistem Terstandarisasi**: Mengacu pada `DESIGN_SYSTEM.md` dengan palet oranye dinamis (`brand-500` #F97316, `brand-600` #EA580C) dan tema gelap adaptif (`dark-bg` #0B0F17).
2. **Zero Runtime Overhead**: Tailwind mengompilasi utility class menjadi CSS statis murni saat build. Tidak ada eksekusi JavaScript runtime seperti CSS-in-JS (misal styled-components), menghasilkan pemuatan halaman yang jauh lebih cepat.
3. **Aksesibilitas Kontras Tinggi (WCAG Compliant)**: Memudahkan penyesuaian kontras teks bagi Teman Tuli dengan integrasi *dark mode* yang ramah mata (*low eye-strain*).

---

### D. Backend API: Django + Django Ninja

```
HTTP Client ──> Django Ninja Router ──> Pydantic Schema Validation ──> Django ORM ──> PostgreSQL
                                    └─ auto OpenAPI/Swagger docs ─┘
```

#### 💡 Kenapa Memilih Django + Django Ninja?
1. **Performa Tinggi berbasis Pydantic**: Django Ninja memberikan kecepatan eksekusi setara FastAPI dengan validasi data otomatis (*type-hinted* schemas) dan serialisasi data JSON yang sangat cepat.
2. **Keamanan Bawaan Django (Battle-Tested)**: Membawa perlindungan bawaan terhadap CSRF, SQL Injection, XSS, dan manajemen autentikasi user yang kokoh.
3. **Dokumentasi API Otomatis (OpenAPI/Swagger)**: Endpoint `/api/docs` dihasilkan otomatis dari schema Python, mempercepat integrasi frontend-backend tanpa perlu menulis dokumentasi Postman terpisah.
4. **Ekosistem Python untuk AI**: Django ditulis dalam Python, bahasa yang sama dengan model *Machine Learning* dan *Computer Vision* (PyTorch, YOLO, OpenCV), memudahkan integrasi model AI tanpa batasan antar-bahasa.

#### ⚖️ Mengapa Bukan Alternatif Lain?
| Opsi | Kenapa Bukan Ini? |
| :--- | :--- |
| **Django REST Framework (DRF)** | DRF lebih lambat, kaku (*heavy serializers*), dan menghasilkan boilerplate kode yang jauh lebih panjang dibanding sintaks modern Django Ninja. |
| **Node.js (Express / NestJS)** | Kurang optimal untuk ekosistem AI/Computer Vision lokal jika ingin melakukan pemrosesan inferensi bahasa isyarat di sisi server. |

---

### E. Database: PostgreSQL

#### 💡 Kenapa Memilih PostgreSQL?
1. **Integritas Relasional & Transaksional (ACID)**: Moderasi komunitas, verifikasi data berita, histori kosakata video isyarat, dan user credential menuntut konsistensi relasi (*foreign keys*, cascade deletes).
2. **Efisiensi Pengindeksan & Full-Text Search**: Memungkinkan pencarian kata di kamus isyarat dan artikel berita secara cepat dengan *B-tree index* dan *trigram similarity*.
3. **Dukungan Tipe Data Modern (JSONB)**: Fleksibel menyimpan payload dinamis seperti konfigurasi koordinat skeleton/landmark isyarat atau metadata tambahan.

---

### F. Kecerdasan Buatan (AI): YOLO11

#### 💡 Kenapa Memilih YOLO11 untuk Deteksi Isyarat?
1. **Deteksi Real-Time dengan Akurasi Tinggi (State-of-the-Art mAP & FPS)**: YOLO11 menawarkan efisiensi parameter tertinggi saat mendeteksi gestur tangan, posisi jari, dan orientasi tubuh secara bersamaan.
2. **Latency Sangat Rendah**: Mampu memproses input frame webcam pada 30+ FPS bahkan pada perangkat komputasi terbatas, krusial agar pengguna Teman Tuli mendapatkan respons teks seketika.
3. **Kemudahan Export ke Edge/ONNX/TensorRT**: Memungkinkan inferensi berjalan lokal di browser klien via WebGL/WebGPU maupun di microservice server.

---

## 3. Design Patterns & Pola Arsitektur

Platform SETARA dirancang menggunakan beberapa pola desain (*design patterns*) perangkat lunak berstandar industri:

### 1. Single Source of Truth & Flux Pattern (Zustand)
- **Tujuan**: Memisahkan logika bisnis dan data dari komponen tampilan.
- **Implementasi**: Komponen tidak mengelola state global sendiri, melainkan memanggil action (`addTestimonial`, `updateVideo`, `toggleTheme`) pada store terpusat.

### 2. View Gating & History Navigation Pattern
- **Tujuan**: Navigasi SPA cepat tanpa library router berat dan pengamanan rute admin.
- **Implementasi**: Sinkronisasi state URL (`/`, `/penerjemah`, `/admin`) dengan `window.history.pushState`. Pengecekan JWT token di sisi klien sebelum merender `AdminDashboard`.

### 3. Fallback & Graceful Degradation Pattern (Dual Rendering Engine)
- **Tujuan**: Mencegah kegagalan visual jika kata yang dicari belum memiliki file video rekaman manusia di database.
- **Implementasi**: Jika video tidak ditemukan di PostgreSQL, sistem secara otomatis beralih (*fallback*) ke `SignCanvasAnimator` untuk mengeja secara abjad isyarat (*fingerspelling*) atau simulasi canvas procedural.

### 4. Observer Pattern (Theme & Authentication Lifecycle)
- **Tujuan**: Menyinkronkan perubahan global secara instan ke seluruh antarmuka.
- **Implementasi**: `useThemeStore` bertindak sebagai *Subject* yang mengontrol class `.dark` pada elemen root `<html>`, sedangkan `useAuthStore` mengamati validitas token untuk redirect otomatis.

### 5. Tokenizer & Hybrid Linguistic Normalization Pattern
- **Tujuan**: Mengatasi disparitas linguistik antara SIBI (berafiks/tata bahasa baku) dan BISINDO (berbasis konsep visual alami).
- **Implementasi**: Modul `tokenizer.js` menerapkan *Strategy Pattern* untuk memilah kalimat menjadi token dasar, mencocokkan kamus kata, dan mengatur urutan pemutaran peragaan secara adaptif.

### 6. Modular Router & Service Layer Pattern
- **Tujuan**: Arsitektur backend modular yang mudah dikembangkan dan diuji.
- **Implementasi**: Setiap domain (`accounts`, `berita`, `komunitas`, `video`, `translator`) berdiri sebagai modul Django terpisah dengan router Ninja masing-masing yang digabungkan di `config/urls.py`.

---

## 4. Tabel Komparasi Cepat (Tech Stack Matrix)

| Kategori | Teknologi Terpilih | Alternatif yang Dipertimbangkan | Mengapa Memilih Teknologi Ini? |
| :--- | :--- | :--- | :--- |
| **Framework Web** | React 18 (SPA) | Next.js, Vue 3 | Interaktivitas canvas & webcam real-time lebih stabil tanpa overhead SSR server. |
| **Build Tool** | Vite | Webpack, Parcel | HMR sub-detik, native ESM, dan ukuran bundle produksi optimal (Rollup). |
| **State Manager** | Zustand | Redux Toolkit, Context API | Ukuran hanya ~1 kB, no boilerplate, selective rendering mencegah lag di streaming 30 FPS. |
| **Styling** | Tailwind CSS | Bootstrap, Styled-Components | Zero runtime overhead, utility-first mudah dikustomisasi sesuai design system dark mode. |
| **Backend API** | Django Ninja | Django REST Framework (DRF), Express.js | Validasi Pydantic secepat FastAPI, keamanan Django, auto Swagger docs, dan kesiapan AI Python. |
| **Database** | PostgreSQL | MySQL, MongoDB | Keandalan ACID transaksi moderasi, relational integrity, dan efisiensi search trigram kamus. |
| **Model AI** | YOLO11 | MediaPipe, YOLOv8 | Deteksi pose + tangan secara simultan dengan throughput FPS tinggi dan akurasi gestur mutakhir. |

---

## 5. Cheat Sheet Tanya Jawab Juri (Q&A Defense)

Gunakan poin-poin ini jika dewan juri menanyakan keputusan teknis Anda:

### ❓ Pertanyaan 1: *"Mengapa tidak menggunakan Next.js agar SEO lebih bagus?"*
> **Jawaban:**  
> *"Fokus utama platform SETARA adalah **aplikasi fungsional real-time** (Computer Vision, Canvas Animation, dan Video Streaming), bukan sekadar situs konten statis. Next.js membawa overhead SSR (Server-Side Rendering) dan Node.js server yang menambah latensi pada komunikasi kamera & canvas. Dengan React 18 + Vite, seluruh komputasi visual terjadi di sisi klien dengan latensi nol, sementara untuk kebutuhan SEO dan aksesibilitas berita publik kami mengoptimalkan semantic HTML5 dan OpenGraph meta tags."*

### ❓ Pertanyaan 2: *"Mengapa memilih Django Ninja daripada Django REST Framework (DRF) yang lebih populer?"*
> **Jawaban:**  
> *"Django Ninja adalah evolusi modern dari framework REST di ekosistem Python. Ninja dibangun di atas **Pydantic**, sehingga validasi data dilakukan pada level typing secara otomatis dan jauh lebih cepat dibanding serializer DRF. Selain itu, Django Ninja otomatis menghasilkan dokumentasi interaktif OpenAPI (Swagger) tanpa konfigurasi rumit, sehingga kolaborasi frontend-backend menjadi jauh lebih presisi dan bebas bug tipe data."*

### ❓ Pertanyaan 3: *"Bagaimana sistem menangani jika ada kata yang belum ada videonya?"*
> **Jawaban:**  
> *"Kami menerapkan arsitektur **Graceful Degradation / Fallback Pattern**. Sistem tidak pernah berhenti atau menampilkan layar kosong. Ketika kata input tidak ditemukan di database rekaman video manusia, mesin tokenisasi kami otomatis mengalihkan rendering ke **SignCanvasAnimator** untuk mengeja kata tersebut secara abjad isyarat (fingerspelling) dan animasi berbasis canvas sehingga pengguna tetap memahami terjemahannya."*

### ❓ Pertanyaan 4: *"Kenapa memakai Zustand, bukan Redux?"*
> **Jawaban:**  
> *"Redux memiliki boilerplate yang besar dan struktur yang kompleks untuk aplikasi kami. Zustand berukuran kurang dari 1 kB, tidak membutuhkan hierarki Context Provider yang memicu re-render massal, dan memungkinkan **selective subscription**. Pada aplikasi yang memproses video dan input kamera secara real-time, kemampuan re-render hanya pada komponen yang relevan sangat krusial untuk mencegah drop frame."*

