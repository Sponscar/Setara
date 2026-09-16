/**
 * @file HeroSection.jsx
 * @description Section hero banner utama landing page SETARA.
 *
 * ## Arsitektur & Pattern
 * - **Presentational Component**: Tidak memiliki state internal sendiri.
 *   Hanya menerima callback props untuk navigasi (CTA buttons).
 * - **Visual-First Design**: Menampilkan headline gradient, interactive
 *   card mockup dengan simulasi token translation, dan floating badges.
 * - **Ambient Glow Effects**: Background gradient blur orbs untuk kesan
 *   premium dan dinamis.
 *
 * ## Layout
 * - Grid 2 kolom (lg:7/5): Kiri = headline + CTA, Kanan = visual graphic.
 * - Responsive: Stack vertikal di mobile, side-by-side di desktop.
 *
 * @module HeroSection
 * @param {Object} props
 * @param {Function} props.onStartTranslate — Callback navigasi ke halaman penerjemah.
 * @param {Function} props.onExploreEducation — Callback scroll ke section edukasi SIBI/BISINDO.
 */

import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Hand, 
  Scan, 
  CheckCircle2, 
  Layers, 
  ShieldCheck,
  Zap,
  Play
} from 'lucide-react';

export default function HeroSection({ onStartTranslate, onExploreEducation }) {
  return (
    <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-36 md:pb-24 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-600/25 to-amber-500/25 blur-3xl -z-10 pointer-events-none rounded-full"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-amber-500/15 blur-3xl -z-10 pointer-events-none rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Inclusive Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span>Platform Bahasa Isyarat Masa Depan</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Komunikasi Tanpa Batas,{' '}
              <span className="gradient-text-primary">
                Setara untuk Semua.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Platform penerjemah bahasa isyarat dua arah berbasis kecerdasan buatan. Menerjemahkan <strong>Teks ke Video Peragaan Isyarat</strong> dan <strong>Kamera ke Teks Real-Time</strong> yang mendukung sistem <strong>SIBI</strong> dan <strong>BISINDO</strong>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onStartTranslate}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-orange-600 to-amber-600 hover:from-brand-500 hover:to-amber-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-brand-600/30 hover:scale-105 active:scale-95 animate-pulse-glow transition-all duration-300 group cursor-pointer"
              >
                <span>Coba Penerjemah Sekarang</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>

              <button
                onClick={onExploreEducation}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl glass hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm sm:text-base flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4 text-brand-500" />
                <span>Pelajari SIBI vs BISINDO</span>
              </button>
            </div>

            {/* Quick Feature Bullet Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                <span>Dual Engine (SIBI & BISINDO)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                <span>21 Keypoints Hand Pose</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                <span>100% Akses Terbuka</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Interactive Graphic (Open SaaS Style) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Main Interactive Card Graphic */}
            <div className="relative w-full max-w-md rounded-3xl p-6 glass-card border border-slate-200/80 dark:border-dark-border shadow-2xl space-y-4">
              {/* Header inside mockup */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-brand-500"></div>
                  <span className="ml-2 text-xs font-mono text-slate-400">setara-engine.ai</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  ONLINE
                </span>
              </div>

              {/* Translation Graphic Preview */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 shadow-inner border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Input Kalimat Teks:</span>
                  <span className="text-brand-400 font-bold">SIBI & BISINDO</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm font-semibold text-amber-400 flex items-center justify-between">
                  <span>"aku sayang ibu"</span>
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>

                {/* Arrow Flow */}
                <div className="flex items-center justify-center py-1">
                  <div className="px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/40 text-[11px] font-bold text-brand-300 flex items-center gap-1.5">
                    <Scan className="w-3 h-3 animate-spin" />
                    <span>Konversi Instan Per Kata</span>
                  </div>
                </div>

                {/* Output Token Chips */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="p-2 rounded-xl bg-slate-800 border border-amber-500/40 text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Kata 1</div>
                    <div className="font-bold text-xs text-amber-300">"aku"</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800 border border-amber-500/40 text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Kata 2</div>
                    <div className="font-bold text-xs text-amber-300">"sayang"</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800 border border-amber-500/40 text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Kata 3</div>
                    <div className="font-bold text-xs text-amber-300">"ibu"</div>
                  </div>
                </div>
              </div>

              {/* Mini Status Metrics */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <div className="text-xl font-bold text-brand-600 dark:text-brand-400">21 Titik</div>
                  <div className="text-[11px] text-slate-500">Pose Landmark Tangan</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <div className="text-xl font-bold text-amber-500 dark:text-amber-400">&lt; 500 ms</div>
                  <div className="text-[11px] text-slate-500">Target Latensi AI</div>
                </div>
              </div>
            </div>

            {/* Floating Decorative Badges */}
            <div className="absolute top-2 -left-4 sm:-left-6 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl flex items-center gap-2 animate-float">
              <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-500 flex items-center justify-center font-bold">
                🤟
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900 dark:text-white">SIBI & BISINDO</div>
                <div className="text-[10px] text-slate-400">Pilihan Bebas Sistem</div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl flex items-center gap-2 animate-float [animation-delay:2s]">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                📷
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900 dark:text-white">Live Kamera AI</div>
                <div className="text-[10px] text-slate-400">YOLO 11 Hand Pose</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
