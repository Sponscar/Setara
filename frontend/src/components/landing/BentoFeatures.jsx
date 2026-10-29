/**
 * ==============================================================================
 * File: BentoFeatures.jsx
 * Direktori: src/components/landing/
 * Deskripsi: Section Bento Grid Showcase Fitur Unggulan Platform SETARA.
 *            Menampilkan 4 pilar fungsionalitas utama dalam tata letak kartu bento modern
 *            dengan efek hover glassmorphism dan ikon representatif.
 * Pattern:
 *   - Presentational Component: Menerima callback navigasi `onSelectFeature`
 *     untuk mengarahkan pengguna ke section atau halaman terkait.
 *   - Bento Grid Pattern: Tata letak responsif berbasis CSS Grid dengan rasio
 *     kolom variatif (col-span-2) untuk hierarki visual yang menarik.
 * ==============================================================================
 */

import React from 'react';
import { 
  Type, 
  Camera, 
  BookOpen, 
  Users, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Layers,
  Activity
} from 'lucide-react';

/**
 * Komponen Bento Grid Fitur Unggulan.
 * 
 * @param {Object} props
 * @param {Function} props.onSelectFeature - Callback navigasi saat kartu fitur diklik ('translator' | 'edukasi' | 'komunitas')
 */
export default function BentoFeatures({ onSelectFeature }) {
  return (
    <section className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===================================================================
         * 1. SECTION HEADER — Judul & Sub-judul Bento Grid
         * =================================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Zap className="w-3.5 h-3.5" />
            <span>Fitur Unggulan Platform</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Dirancang untuk Menjawab Kebutuhan Nyata
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Menggabungkan teknologi Computer Vision mutakhir dengan kekayaan linguistik isyarat Indonesia.
          </p>
        </div>

        {/* ===================================================================
         * 2. BENTO GRID CONTAINER — 4 Kartu Fitur Interaktif dengan Efek Hover
         * =================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* --- KARTU 1: Text to Sign (Col-Span 2) --- */}
          <div 
            onClick={() => onSelectFeature('translator')}
            className="md:col-span-2 lg:col-span-2 rounded-3xl p-6 sm:p-8 glass-card border border-slate-200/90 dark:border-white/10 hover:border-brand-500/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-500/15 dark:hover:shadow-brand-950/50 transition-all duration-500 ease-out group cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            {/* Ambient hover glow overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-brand-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Decorative Watermark with dynamic hover motion */}
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-25 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 pointer-events-none">
              <Type className="w-36 h-36 text-brand-500" />
            </div>

            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/25 flex items-center justify-center font-bold group-hover:scale-110 group-hover:shadow-md group-hover:shadow-brand-500/20 transition-all duration-500">
                <Type className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                  Text to Sign
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300">
                  Pemutar Video Isyarat Kata Demi Kata
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-md">
                  Ketik kalimat apa saja, sistem akan memecahnya menjadi deretan kata terstruktur dan memutar video peragaan secara mulus dengan kontrol kecepatan penuh.
                </p>
              </div>
            </div>

            <div className="pt-6 flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400 relative z-10">
              <span className="group-hover:underline underline-offset-4">Buka Modul Teks ke Isyarat</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </div>
          </div>

          {/* --- KARTU 2: Sign to Text AI (Col-Span 2) --- */}
          <div 
            onClick={() => onSelectFeature('translator')}
            className="md:col-span-1 lg:col-span-2 rounded-3xl p-6 sm:p-8 glass-card border border-slate-200/90 dark:border-white/10 hover:border-amber-500/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/15 dark:hover:shadow-amber-950/50 transition-all duration-500 ease-out group cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            {/* Ambient hover glow overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Decorative Watermark with dynamic hover motion */}
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-25 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 pointer-events-none">
              <Camera className="w-36 h-36 text-amber-500" />
            </div>

            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 flex items-center justify-center font-bold group-hover:scale-110 group-hover:shadow-md group-hover:shadow-amber-500/20 transition-all duration-500">
                <Camera className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Sign to Text AI
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                  Kamera Real-Time
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-md">
                  Mendeteksi gerakan bahasa isyarat berbasis kamera real-time (Berbasis Deteksi AI yang sedang dalam tahap pengujian dan pengembangan).
                </p>
              </div>
            </div>

            <div className="pt-6 flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 relative z-10">
              <span className="group-hover:underline underline-offset-4">Coba Kamera Deteksi Isyarat</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </div>
          </div>

          {/* --- KARTU 3: Edukasi Komparasi SIBI vs BISINDO (Warna Sama dengan Card Text to Sign) --- */}
          <div 
            onClick={() => onSelectFeature('edukasi')}
            className="md:col-span-2 lg:col-span-2 rounded-3xl p-6 sm:p-8 glass-card border border-slate-200/90 dark:border-white/10 hover:border-brand-500/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-500/15 dark:hover:shadow-brand-950/50 transition-all duration-500 ease-out group cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            {/* Ambient hover glow overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-brand-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Decorative Watermark */}
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-25 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 pointer-events-none">
              <Layers className="w-36 h-36 text-brand-500" />
            </div>

            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/25 flex items-center justify-center font-bold group-hover:scale-110 group-hover:shadow-md group-hover:shadow-brand-500/20 transition-all duration-500">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                  Komparasi Edukatif
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300">
                  Edukasi Mendalam SIBI vs BISINDO
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Pahami sejarah, perbedaan struktur tata bahasa, afiksasi kata, dan etika komunikasi dengan komunitas Tuli melalui infografis interaktif.
                </p>
              </div>
            </div>

            <div className="pt-6 flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400 relative z-10">
              <span className="group-hover:underline underline-offset-4">Pelajari Perbedaan Sistem</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </div>
          </div>

          {/* --- KARTU 4: Komunitas & Edukasi Inklusif --- */}
          <div 
            onClick={() => onSelectFeature('komunitas')}
            className="md:col-span-1 lg:col-span-2 rounded-3xl p-6 sm:p-8 glass-card border border-slate-200/90 dark:border-white/10 hover:border-amber-500/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/15 dark:hover:shadow-amber-950/50 transition-all duration-500 ease-out group cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            {/* Ambient hover glow overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Decorative Watermark */}
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-25 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 pointer-events-none">
              <Users className="w-36 h-36 text-amber-500" />
            </div>

            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 flex items-center justify-center font-bold group-hover:scale-110 group-hover:shadow-md group-hover:shadow-amber-500/20 transition-all duration-500">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Komunitas & Edukasi
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                  Ruang Komunitas Inklusif
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Ikuti jadwal workshop isyarat untuk tenaga kesehatan, webinar etika, kumpul santai komunitas, dan pantau jejak milestone perjalanan kami.
                </p>
              </div>
            </div>

            <div className="pt-6 flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 relative z-10">
              <span className="group-hover:underline underline-offset-4">Jelajahi Aktivitas Komunitas</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
