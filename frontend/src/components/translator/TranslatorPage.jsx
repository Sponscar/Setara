/**
 * ==============================================================================
 * File: TranslatorPage.jsx
 * Direktori: src/components/translator/
 * Deskripsi: Halaman mandiri (Dedicated Standalone Page) untuk Penerjemah Bahasa Isyarat AI.
 * Rute: /penerjemah atau /translator
 * Pattern:
 *   - Page Container Pattern: Membungkus TranslatorHub dengan sticky floating header,
 *     navigasi breadcrumb, quick tips, dan badge engine SIBI & BISINDO.
 *   - Scroll Reactive Header: Mengubah style header saat pengguna menggulir halaman.
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import { useThemeStore } from '../../stores/useThemeStore';
import TranslatorHub from './TranslatorHub';
import { 
  ArrowLeft, 
  Sparkles, 
  Languages, 
  Zap, 
  BookOpen,
  HelpCircle,
  Sun,
  Moon
} from 'lucide-react';

/**
 * Komponen Halaman Penerjemah Isyarat Mandiri.
 * 
 * @param {Object} props
 * @param {Function} props.onBackToHome - Callback untuk kembali ke beranda
 * @param {Function} props.onNavigate - Callback navigasi ke section atau rute lain
 */
export default function TranslatorPage({ onBackToHome, onNavigate }) {
  const { theme, toggleTheme } = useThemeStore();
  const [isScrolled, setIsScrolled] = useState(false);

  // Deteksi scroll jendela browser untuk transisi gaya sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="pt-3 sm:pt-4 pb-16 sm:pb-20">
            {/* ======================================================================= */}
      {/* 1. STICKY FLOATING HEADER & BREADCRUMB BAR                              */}
      {/* ======================================================================= */}
      <div className="sticky top-3 sm:top-4 z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 transition-all duration-300">
        <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 p-3 sm:p-4 rounded-3xl backdrop-blur-2xl transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 dark:bg-dark-card/90 shadow-2xl border border-brand-500/30 shadow-brand-500/10 scale-[0.99] sm:scale-100'
            : 'glass-card border border-slate-200/80 dark:border-dark-border shadow-lg'
        }`}>
          {/* SISI KIRI: Tombol Kembali, Logo SETARA, Divider, Logo TCC & TRIPLE-C, Breadcrumb */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <button
              type="button"
              onClick={onBackToHome}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-500/15 hover:text-brand-600 dark:hover:text-brand-400 text-slate-700 dark:text-slate-200 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold hover:scale-105 active:scale-95 shadow-sm"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali</span>
            </button>

            {/* Logo SETARA */}
            <div
              onClick={onBackToHome}
              className="flex items-center gap-2 cursor-pointer group"
              title="Ke Beranda SETARA"
            >
              <div className="w-8 h-8 rounded-xl overflow-hidden shadow-md shadow-brand-500/15 group-hover:scale-105 transition-transform bg-white border border-slate-200/80 dark:border-white/10">
                <img
                  src="/Setara Logo.jpg"
                  alt="SETARA Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-black tracking-tight text-slate-900 dark:text-white text-base">
                SETARA
              </span>
            </div>

            {/* Subtle Divider */}
            <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

            {/* Logo Penyelenggara: JACK, TCC & TRIPLE-C */}
            <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center p-1 rounded-xl bg-white border border-slate-200/80 dark:border-white/10 shadow-xs hover:scale-105 transition-all overflow-hidden"
                title="JACK"
              >
                <img
                  src="/JACK 2.png"
                  alt="Logo JACK"
                  className="w-full h-full object-contain"
                />
              </div>
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center p-1 rounded-xl bg-white border border-slate-200/80 dark:border-white/10 shadow-xs hover:scale-105 transition-all overflow-hidden"
                title="TCC"
              >
                <img
                  src="/Salinan LOGO TCC.png"
                  alt="Logo TCC"
                  className="w-full h-full object-contain"
                />
              </div>
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center p-1 rounded-xl bg-white border border-slate-200/80 dark:border-white/10 shadow-xs hover:scale-105 transition-all overflow-hidden"
                title="TRIPLE-C"
              >
                <img
                  src="/Salinan LOGO TRIPLE-C.png"
                  alt="Logo TRIPLE-C"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Breadcrumb Path */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 pl-1">
              <span>/</span>
              <span className="font-medium text-slate-600 dark:text-slate-300">Penerjemah Isyarat AI</span>
            </div>
          </div>

          {/* SISI KANAN: Logo UINSA & UISI, Divider, Badges, Toggle Tema */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-between sm:justify-end">
            {/* Logo Institusi Kampus: UINSA & UISI (Ukuran Sama) */}
            <div className="flex items-center gap-2 pr-1">
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center p-1 rounded-xl bg-white border border-slate-200/80 dark:border-white/10 shadow-xs hover:scale-105 transition-all overflow-hidden"
                title="UIN Sunan Ampel Surabaya"
              >
                <img
                  src="/Logo UINSA.png"
                  alt="Logo UINSA"
                  className="w-full h-full object-contain"
                />
              </div>
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center p-1 rounded-xl bg-white border border-slate-200/80 dark:border-white/10 shadow-xs hover:scale-105 transition-all overflow-hidden"
                title="Universitas Internasional Semen Indonesia (UISI)"
              >
                <img
                  src="/uisi.jpg"
                  alt="Logo UISI"
                  className="w-full h-full object-contain rounded-xs"
                />
              </div>
            </div>

            {/* Subtle Divider */}
            <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dual Engine:</span> SIBI & BISINDO
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Zap className="w-3.5 h-3.5" />
              <span>21 Keypoints AI</span>
            </div>

            {/* Toggle Tema Light / Dark */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-500/15 text-slate-700 dark:text-slate-200 transition-all cursor-pointer hover:scale-105 active:scale-95"
              title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* 2. INTI PENERJEMAH (TRANSLATOR HUB)                                     */}
      {/* ======================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TranslatorHub />
      </div>

      {/* ======================================================================= */}
      {/* 3. PANDUAN CEPAT (QUICK TIPS FOOTNOTE)                                  */}
      {/* ======================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">Tips Text-to-Sign</h4>
              <p className="leading-relaxed">Gunakan kata dasar atau kalimat sederhana bahasa Indonesia. Anda dapat mengatur kecepatan animasi dari 0.5x hingga 1.5x.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <Languages className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">SIBI vs BISINDO</h4>
              <p className="leading-relaxed">Pilih <strong>SIBI</strong> untuk kebutuhan tata bahasa baku formal, atau <strong>BISINDO</strong> untuk komunikasi alami komunitas Tuli.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">Tips Kamera Sign-to-Text</h4>
              <p className="leading-relaxed">Pastikan pencahayaan ruangan cukup terang dan tangan terlihat jelas di dalam area pandang frame kamera.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
