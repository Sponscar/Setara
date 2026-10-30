# 🎨 SETARA — Design System & UI Guidelines

Dokumen ini merangkum spesifikasi desain antarmuka (*Design System*), panduan tipografi (*fonts*), sistem kode warna (*color palette*), serta efek visual yang diterapkan pada seluruh platform **SETARA**.

---

## 📋 Daftar Isi
1. [Tipografi (Typography)](#1-tipografi-typography)
2. [Sistem Warna (Color Palette)](#2-sistem-warna-color-palette)
   - [A. Warna Utama Brand (Orange)](#a-warna-utama-brand-vibrant--deep-orange)
   - [B. Warna Aksen (Amber Gold)](#b-warna-aksen-amber-gold)
   - [C. Mode Gelap (Dark Mode Palette)](#c-mode-gelap-dark-mode-palette)
   - [D. Mode Terang (Light Mode Palette)](#d-mode-terang-light-mode-palette)
   - [E. Badge Resmi Platform Komunitas](#e-badge-resmi-platform-komunitas)
3. [Efek Visual & Glassmorphism](#3-efek-visual--glassmorphism)
4. [Konfigurasi Teknis](#4-konfigurasi-teknis)

---

## 1. Tipografi (Typography)

Platform SETARA memadukan font geometris modern dengan font sans-serif berdaya baca tinggi dari Google Fonts.

### Spesifikasi Font

| Peran | Nama Font | Bobot (*Weights*) | Implementasi & Alasan Desain |
| :--- | :--- | :--- | :--- |
| **Primary (Heading & Display)** | **Outfit** | 400, 500, 600, 700, 800, 900 | Digunakan pada judul utama (*Hero*), *headings*, *navbar capsule*, tombol CTA, dan angka statistik untuk kesan inklusif, modern, dan tegas. |
| **Secondary (Body & Text)** | **Inter** | 300, 400, 500, 600, 700 | Digunakan pada teks paragraf panjang, deskripsi artikel, dan label form untuk memastikan keterbacaan (*readability*) optimal di semua ukuran layar (WCAG compliant). |
| **Monospace (Code & Data)** | **Fira Code** | 400, 500 | Digunakan pada data tokenisasi, durasi FSM, timestamp log, dan format email teknis. |

### Font Stack CSS
```css
font-family: 'Outfit', 'Inter', system-ui, sans-serif;
```

---

## 2. Sistem Warna (Color Palette)

Palet warna SETARA mengusung perpaduan **Oranye Energetik** (simbol kehangatan, komunikasi, dan inklusi) dengan latar belakang **Deep Slate/Navy** yang ramah mata (*low eye-strain*).

### A. Warna Utama Brand (Vibrant & Deep Orange)

| Token Tailwind | Kode HEX | Contoh | Penggunaan UI |
| :--- | :---: | :---: | :--- |
| `brand-50` | `#FFF7ED` | 🟧 | Latar belakang oranye sangat lembut (*hover surface*) |
| `brand-100` | `#FFEDD5` | 🟧 | Badge/lencana kategori isyarat |
| `brand-200` | `#FED7AA` | 🟧 | Border tipis aksen |
| `brand-300` | `#FDBA74` | 🟧 | Gradient stop & aksen interaktif |
| `brand-400` | `#FB923C` | 🟧 | Aksen glow dan ikon aktif |
| `brand-500` | **`#F97316`** | 🟧 | **Primary Vibrant Orange**: Tombol sekunder, hover button, toggle aktif |
| `brand-600` | **`#EA580C`** | 🟧 | **Primary Brand Color**: Identitas logo, tombol CTA utama, teks seleksi |
| `brand-700` | `#C2410C` | 🟫 | Hover pada tombol oranye gelap / active state |
| `brand-800` | `#9A3412` | 🟫 | Teks gelap dengan penekanan oranye |
| `brand-900` | `#7C2D12` | 🟫 | Kontras tinggi teks pada mode terang |
| `brand-950` | `#431407` | 🟫 | Deep contrast element |

### B. Warna Aksen (Amber Gold)

| Token Tailwind | Kode HEX | Contoh | Penggunaan UI |
| :--- | :---: | :---: | :--- |
| `amber-400` | `#FBBF24` | 🟨 | Ikon tema (*Sun mode*), bintang ulasan pengguna |
| `amber-500` | **`#F59E0B`** | 🟨 | **Smart Notice**: Notifikasi kata belum tersedia di database, highlight PIC |
| `amber-600` | `#D97706` | 🟨 | Border peringatan & aksen badge edukasi |

### C. Mode Gelap (Dark Mode Palette)

| Token Tailwind | Kode HEX | Contoh | Penggunaan UI |
| :--- | :---: | :---: | :--- |
| `dark.bg` | **`#0B0F19`** | ⬛ | Background utama halaman di mode gelap (*deep space slate*) |
| `dark.card` | **`#111827`** | ⬛ | Background kartu Bento, kartu komunitas, dan panel modal |
| `dark.surface` | **`#1E293B`** | ⬛ | Background input field, kontrol bar player, dropdown item |
| `dark.border` | **`#1F2937`** | ⬛ | Garis pemisah (*borders/dividers*) di mode gelap |
| `dark.muted` | **`#94A3B8`** | ◽ | Teks sekunder, deskripsi artikel, dan ikon non-aktif |

### D. Mode Terang (Light Mode Palette)

| Token Tailwind | Kode HEX | Contoh | Penggunaan UI |
| :--- | :---: | :---: | :--- |
| `slate-50` | **`#F8FAFC`** | ⬜ | Background utama halaman di mode terang |
| `white` | **`#FFFFFF`** | ⬜ | Background kartu, navbar, dan modal |
| `slate-200` | **`#E2E8F0`** | ◽ | Border kartu dan pemisah (*divider*) di mode terang |
| `slate-400` | `#94A3B8` | ◽ | Placeholder input dan ikon sekunder |
| `slate-600` | `#475569` | ⬛ | Teks paragraf dan deskripsi konten |
| `slate-900` | **`#0F172A`** | ⬛ | Teks judul utama (*headings*) berdaya kontras tinggi |

### E. Badge Resmi Platform Komunitas

| Platform | Kode HEX Utama | Tailwind Classes | Penggunaan |
| :--- | :---: | :--- | :--- |
| **WhatsApp** | `#10B981` | `text-emerald-600 dark:text-emerald-400 border-emerald-500/25` | Grup WhatsApp Komunitas Guru SLB & Belajar Isyarat |
| **Instagram** | `#EC4899` | `text-pink-600 dark:text-pink-400 border-pink-500/25` | Akun Instagram Komunitas Teman Tuli |
| **Discord** | `#6366F1` | `text-indigo-600 dark:text-indigo-400 border-indigo-500/25` | Server Discord Isyarat Nusantara |
| **Telegram** | `#0EA5E9` | `text-sky-600 dark:text-sky-400 border-sky-500/25` | Channel Telegram Deaf Tech Indonesia |
| **Website** | `#EA580C` | `text-brand-600 dark:text-brand-400 border-brand-500/25` | Tautan Portal Web Organisasi Resmi |

---

## 3. Efek Visual & Glassmorphism

### Bayangan & Glow (`box-shadow`)
- **`glow-orange`**: `0 0 35px -5px rgba(249, 115, 22, 0.35)` — Efek pendar tombol dan kartu interaktif aktif.
- **`glow-amber`**: `0 0 35px -5px rgba(245, 158, 11, 0.35)` — Efek pendar lencana penting.
- **`glass`**: `0 8px 32px 0 rgba(0, 0, 0, 0.12)` (Light) / `rgba(0, 0, 0, 0.45)` (Dark).

### Glassmorphism Card
```css
/* Mode Terang */
.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(241, 245, 249, 1);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05);
}

/* Mode Gelap */
.dark .glass-card {
  background: rgba(17, 24, 39, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(31, 41, 55, 0.7);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
}
```

### Background Grid Motif (`bg-grid-pattern`)
Pola geometris halus untuk mempertegas kedalaman visual:
- **Light Mode**: Kotak `32px x 32px` dengan garis `rgba(148, 163, 184, 0.08) 1px`.
- **Dark Mode**: Kotak `32px x 32px` dengan garis `rgba(255, 255, 255, 0.04) 1px`.

---

## 4. Konfigurasi Teknis

Berkas implementasi styling dalam proyek:
- **Tailwind Config**: [`frontend/tailwind.config.js`](file:///c:/Lomba/setara/frontend/tailwind.config.js)
- **Global CSS & Utilities**: [`frontend/src/index.css`](file:///c:/Lomba/setara/frontend/src/index.css)
- **HTML Fonts Import**: [`frontend/index.html`](file:///c:/Lomba/setara/frontend/index.html)
- **Community Platform SVGs**: [`frontend/src/components/helpers/communityHelpers.jsx`](file:///c:/Lomba/setara/frontend/src/components/helpers/communityHelpers.jsx)

