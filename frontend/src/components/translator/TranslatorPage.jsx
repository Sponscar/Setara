import React, { useState, useEffect } from 'react';
import { useThemeStore } from '../../stores/useThemeStore';
import TranslatorHub from './TranslatorHub';
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Languages, 
  Camera, 
  Type, 
  Zap, 
  BookOpen,
  HelpCircle,
  CheckCircle2,
  Sun,
  Moon
} from 'lucide-react';

export default function TranslatorPage({ onBackToHome, onNavigate }) {
  const { theme, toggleTheme } = useThemeStore();
  const [isScrolled, setIsScrolled] = useState(false);

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
      {/* Sticky Floating Header & Breadcrumb Bar (Follows on Scroll) */}
      <div className="sticky top-3 sm:top-4 z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 transition-all duration-300">
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-3xl backdrop-blur-2xl transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 dark:bg-dark-card/90 shadow-2xl border border-brand-500/30 shadow-brand-500/10 scale-[0.99] sm:scale-100'
            : 'glass-card border border-slate-200/80 dark:border-dark-border shadow-lg'
        }`}>
          {/* Left: Back to Home + Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-500/15 hover:text-brand-600 dark:hover:text-brand-400 text-slate-700 dark:text-slate-200 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold hover:scale-105 active:scale-95 shadow-sm"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </button>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="cursor-pointer hover:underline hover:text-brand-500 transition-colors" onClick={onBackToHome}>Beranda</span>
              <span>/</span>
              <span className="font-bold text-slate-900 dark:text-white">Penerjemah Isyarat AI</span>
            </div>
          </div>

          {/* Right: Badges & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dual Engine: SIBI & BISINDO</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Zap className="w-3.5 h-3.5" />
              <span>21 Keypoints AI</span>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/60 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Core Translator Engine */}
      <TranslatorHub isStandalone={true} />

      {/* Quick Guide & Tips Footer inside Translator Page */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="p-8 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Panduan Penggunaan Cepat Penerjemah SETARA
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tips untuk mendapatkan akurasi peragaan dan pembacaan isyarat terbaik
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-500" />
                <span>1. Mode Teks ke Isyarat</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Ketik kalimat secara wajar. Sistem otomatis memecah kata menjadi token dan memperagakan gestur secara berurutan dengan animasi 21 sendi tangan.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                <span>2. Mode Kamera ke Teks</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Posisikan tangan di dalam kotak target hijau HUD. Model AI akan melacak 21 titik kerangka dan menerjemahkan gestur menjadi teks secara langsung.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-500" />
                <span>3. SIBI vs BISINDO</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Gunakan SIBI untuk konteks tata bahasa formal/pendidikan, atau BISINDO untuk percakapan alami komunitas Tuli sehari-hari.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
