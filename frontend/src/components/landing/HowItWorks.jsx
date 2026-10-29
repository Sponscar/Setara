/**
 * ==============================================================================
 * File: HowItWorks.jsx
 * Direktori: src/components/landing/
 * Deskripsi: Section Alur Panduan Penggunaan Platform SETARA (Step-by-step Guide).
 *            Menjelaskan langkah kerja 2 alur utama:
 *            1. Teks ➔ Video Isyarat: Teks -> Tokenisasi -> Pemutar Video/Canvas Isyarat.
 *            2. Kamera ➔ Teks (AI): Webcam -> YOLO 11 Pose Hand Tracking -> Konversi Teks.
 * Pattern:
 *   - State Pattern / Workflow Switcher: Pengguna beralih antara 'text-to-sign' dan 'sign-to-text'.
 *   - Stepper / Process Flow Pattern: Penomoran tahapan terstruktur (01, 02, 03).
 * ==============================================================================
 */

import React, { useState } from 'react';
import { 
  Keyboard, 
  Cpu, 
  PlaySquare, 
  Camera, 
  Eye, 
  FileText, 
  ArrowRight, 
  Layers 
} from 'lucide-react';
import { LiquidNavbar } from '../ui/liquid-glass-navbar';
import { useThemeStore } from '../../stores/useThemeStore';

/**
 * Komponen Alur Panduan Penggunaan Platform SETARA.
 */
export default function HowItWorks() {
  /** Store tema global (light/dark) */
  const { theme } = useThemeStore();

  /** Alur kerja aktif: 'text-to-sign' | 'sign-to-text' */
  const [activeWorkflow, setActiveWorkflow] = useState('text-to-sign');

  /** Item workflow untuk Liquid Glass Navbar Switcher */
  const workflowItems = [
    {
      label: 'Teks ➔ Video Isyarat',
      id: 'text-to-sign',
      icon: <Keyboard className="w-4 h-4" />,
      fx: 'pop'
    },
    {
      label: 'Kamera ➔ Teks (AI)',
      id: 'sign-to-text',
      icon: <Camera className="w-4 h-4" />,
      fx: 'glow'
    }
  ];

  /** Langkah-langkah alur Teks ➔ Video Isyarat */
  const textToSignSteps = [
    {
      step: "01",
      icon: Keyboard,
      title: "Ketik Kalimat Teks",
      desc: "Masukkan kalimat dalam bahasa Indonesia formal atau sehari-hari pada kolom input translator."
    },
    {
      step: "02",
      icon: Cpu,
      title: "Pemecahan Token Kata",
      desc: "Algoritma SETARA memetakan kalimat menjadi urutan kata leksikal dan frase majemuk yang terdaftar di kamus."
    },
    {
      step: "03",
      icon: PlaySquare,
      title: "Putar Video Isyarat",
      desc: "Video peragaan isyarat (SIBI atau BISINDO) diputar secara sekuensial dan mulus dengan kontrol kecepatan fleksibel."
    }
  ];

  /** Langkah-langkah alur Kamera ➔ Teks (AI) */
  const signToTextSteps = [
    {
      step: "01",
      icon: Camera,
      title: "Izinkan Akses Webcam",
      desc: "Buka halaman kamera di browser Anda tanpa perlu mengunduh aplikasi atau sensor tambahan."
    },
    {
      step: "02",
      icon: Eye,
      title: "AI Detection",
      desc: "Kecerdasan buatan mendeteksi 21 titik koordinat sendi tangan dan gerakan spasial secara real-time."
    },
    {
      step: "03",
      icon: FileText,
      title: "Konversi ke Teks Seketika",
      desc: "Model sekuensial menerjemahkan gestur menjadi kalimat teks yang dapat langsung disalin ke clipboard."
    }
  ];

  /** Daftar langkah yang saat ini aktif berdasarkan toggle */
  const currentSteps = activeWorkflow === 'text-to-sign' ? textToSignSteps : signToTextSteps;
  const activeIndex = workflowItems.findIndex(it => it.id === activeWorkflow);

  return (
    <section className="py-16 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===================================================================
         * 1. SECTION HEADER — Judul & Subtitle Alur Kerja
         * =================================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            <Layers className="w-3.5 h-3.5" />
            <span>Alur Penggunaan Platform</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Bagaimana Cara Kerjanya?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Dua jalur penerjemahan pintar yang sangat mudah digunakan oleh siapa saja.
          </p>
        </div>

        {/* ===================================================================
         * 2. WORKFLOW SWITCHER — Liquid Glass Waterline Switcher
         * =================================================================== */}
        <div className="flex items-center justify-center mb-12 py-2.5 px-3 max-w-full overflow-x-auto no-scrollbar">
          <LiquidNavbar
            items={workflowItems}
            active={activeIndex >= 0 ? activeIndex : 0}
            onChange={(idx, item) => setActiveWorkflow(item.id)}
            tone={theme === 'dark' ? 'dark' : 'light'}
          />
        </div>

        {/* ===================================================================
         * 3. STEP CARDS GRID — Rangkaian Kartu Tahapan Terstruktur
         * =================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {currentSteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative rounded-3xl p-6 sm:p-8 glass-card border border-slate-200/90 dark:border-white/10 hover:border-brand-500/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-500/15 dark:hover:shadow-brand-950/50 transition-all duration-500 ease-out group cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                {/* Ambient hover glow overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Decorative Watermark with dynamic hover motion */}
                <div className="absolute -top-4 -right-4 p-8 opacity-5 dark:opacity-10 group-hover:opacity-20 dark:group-hover:opacity-25 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 pointer-events-none">
                  <Icon className="w-32 h-32 text-brand-500" />
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/25 flex items-center justify-center font-bold group-hover:scale-110 group-hover:shadow-md group-hover:shadow-brand-500/20 transition-all duration-500">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl sm:text-4xl font-black text-slate-300 dark:text-slate-700 group-hover:text-brand-500/40 group-hover:scale-110 transition-all duration-500 font-mono select-none">
                      {item.step}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
