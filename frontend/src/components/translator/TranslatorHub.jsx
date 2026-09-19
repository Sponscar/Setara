/**
 * ==============================================================================
 * File: TranslatorHub.jsx
 * Direktori: src/components/translator/
 * Deskripsi: Hub Utama Pengendali Modul Penerjemah Bahasa Isyarat SETARA.
 * Pattern:
 *   - Strategy Pattern: Pemilihan sistem bahasa isyarat aktif ('SIBI' vs 'BISINDO').
 *   - Container Component Pattern: Menghubungkan Zustand store useTranslatorStore
 *     dengan tampilan pemutar TextToSignPlayer, detektor kamera SignToTextCamera,
 *     dan panel riwayat terjemahan.
 * ==============================================================================
 */

import React, { useEffect } from 'react';
import { useTranslatorStore } from '../../stores/useTranslatorStore';
import TextToSignPlayer from './TextToSignPlayer';
import SignToTextCamera from './SignToTextCamera';
import { 
  Type, 
  Camera, 
  History, 
  Check, 
  Sparkles, 
  Trash2,
  Database,
  Film,
  Tv
} from 'lucide-react';

/**
 * Komponen Hub Utama Penerjemah.
 * 
 * @param {Object} props
 * @param {boolean} [props.isStandalone=false] - Penanda apakah dirender di halaman mandiri atau di landing
 */
export default function TranslatorHub({ isStandalone = false }) {
  // State global dari useTranslatorStore
  const {
    languageSystem,
    setLanguageSystem,
    activeTab,
    setActiveTab,
    history,
    clearHistory,
    fetchDictionary,
    dbStatus,
    dictionary,
    visualMode,
    setVisualMode,
    fetchHistory
  } = useTranslatorStore();
  // Fetch dictionary dan riwayat saat halaman dimuat
  useEffect(() => {
    fetchDictionary();
    fetchHistory();
  }, []);


  return (
    <section id="translator" className={`${isStandalone ? 'py-4' : 'py-12 md:py-16'} relative scroll-mt-28`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ===================================================================== */}
        {/* 1. HEADER UTAMA SECTION PENERJEMAH                                   */}
        {/* ===================================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Penerjemah Dua Arah Cerdas</span>
            </div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              dbStatus === 'connected'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
            }`}>
              <Database className="w-3.5 h-3.5" />
              <span className="w-2 h-2 rounded-full animate-pulse" style={{background: dbStatus === 'connected' ? '#10b981' : '#ef4444'}}></span>
              <span>{dbStatus === 'connected' ? `PostgreSQL (${dictionary.length}+ Kata)` : 'Offline'}</span>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Penerjemah Isyarat <span className="gradient-text-primary">SETARA</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Pilih sistem bahasa isyarat dan mode terjemahan yang Anda butuhkan secara instan.
          </p>
        </div>

        {/* ===================================================================== */}
        {/* 2. DUAL ENGINE SELECTOR: KARTU SIBI vs BISINDO                        */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 max-w-4xl mx-auto">
          {/* Kartu Pemilihan SIBI */}
          <div
            onClick={() => setLanguageSystem('SIBI')}
            className={`relative p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-300 border ${
              languageSystem === 'SIBI'
                ? 'bg-gradient-to-br from-brand-600/15 via-brand-500/5 to-transparent border-brand-500 shadow-xl shadow-brand-500/15 ring-2 ring-brand-500/30'
                : 'glass hover:border-slate-300 dark:hover:border-slate-700 opacity-80 hover:opacity-100'
            }`}
            role="button"
            tabIndex={0}
            aria-pressed={languageSystem === 'SIBI'}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setLanguageSystem('SIBI'); }}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-500/20 text-brand-400 border border-brand-500/30">
                  Resmi / Formal
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  SIBI
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Sistem Isyarat Bahasa Indonesia
                </p>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                languageSystem === 'SIBI'
                  ? 'bg-brand-600 border-brand-500 text-white'
                  : 'border-slate-300 dark:border-slate-700 text-transparent'
              }`}>
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
              Mengikuti struktur tata bahasa baku Indonesia (SPOK) dan menyertakan tanda isyarat untuk afiksasi (imbuhan kata). Umum digunakan pada pendidikan formal.
            </p>
          </div>

          {/* Kartu Pemilihan BISINDO */}
          <div
            onClick={() => setLanguageSystem('BISINDO')}
            className={`relative p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-300 border ${
              languageSystem === 'BISINDO'
                ? 'bg-gradient-to-br from-amber-600/15 via-amber-500/5 to-transparent border-amber-500 shadow-xl shadow-amber-500/15 ring-2 ring-amber-500/30'
                : 'glass hover:border-slate-300 dark:hover:border-slate-700 opacity-80 hover:opacity-100'
            }`}
            role="button"
            tabIndex={0}
            aria-pressed={languageSystem === 'BISINDO'}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setLanguageSystem('BISINDO'); }}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Bahasa Alami Tuli
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  BISINDO
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Bahasa Isyarat Indonesia
                </p>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                languageSystem === 'BISINDO'
                  ? 'bg-amber-600 border-amber-500 text-white'
                  : 'border-slate-300 dark:border-slate-700 text-transparent'
              }`}>
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
              Bahasa visual alami yang berkembang langsung dari komunitas Tuli Indonesia. Kaya akan ekspresi wajah, orientasi ruang, dan sangat efisien untuk komunikasi sehari-hari.
            </p>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 3. TAB MODE PENERJEMAH (TEXT-TO-SIGN / CAMERA / RIWAYAT)              */}
        {/* ===================================================================== */}
        <div className="flex items-center justify-center mb-8">
          <div className="p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 flex items-center gap-1 shadow-inner">
            {/* Tab Teks ke Isyarat */}
            <button
              type="button"
              onClick={() => setActiveTab('text-to-sign')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'text-to-sign'
                  ? 'bg-white dark:bg-dark-card text-brand-600 dark:text-brand-400 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Type className="w-4 h-4" />
              <span>Teks ke Isyarat</span>
            </button>

            {/* Tab Kamera ke Teks */}
            <button
              type="button"
              onClick={() => setActiveTab('sign-to-text')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'sign-to-text'
                  ? 'bg-white dark:bg-dark-card text-amber-600 dark:text-amber-400 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Kamera ke Teks (AI)</span>
            </button>

            {/* Tab Riwayat */}
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-white dark:bg-dark-card text-slate-900 dark:text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Riwayat</span>
            </button>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 3B. SWITCH MODE VISUAL: ANIMASI CANVAS 2D vs VIDEO MP4 ASLI          */}
        {/* ===================================================================== */}
        {activeTab === 'text-to-sign' && (
          <div className="flex items-center justify-center mb-6">
            <div className="p-1 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setVisualMode('animation')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  visualMode === 'animation'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>🎭 Animasi Canvas 2D</span>
              </button>
              <button
                type="button"
                onClick={() => setVisualMode('video')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  visualMode === 'video'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>🎬 Video MP4 Asli</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* 4. KONTEN DARI TAB YANG AKTIF                                        */}
        {/* ===================================================================== */}
        <div>
          {/* Mode 1: Pemutar Teks ke Animasi Isyarat */}
          {activeTab === 'text-to-sign' && <TextToSignPlayer />}

          {/* Mode 2: Detektor Isyarat ke Teks Kamera YOLO 11 */}
          {activeTab === 'sign-to-text' && <SignToTextCamera />}

          {/* Mode 3: Riwayat Translasi Sesi Pengguna */}
          {activeTab === 'history' && (
            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-dark-border max-w-3xl mx-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-brand-500" />
                  <span>Riwayat Terjemahan Sesi Ini</span>
                </h4>
                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={clearHistory}
                    className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 font-semibold cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Semua</span>
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-sm">
                  Belum ada riwayat terjemahan pada sesi ini.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-400 shrink-0">
                            {item.languageSystem}
                          </span>
                          <span className="text-slate-400 text-[11px]">
                            {item.type === 'text_to_sign' ? 'Teks ➔ Isyarat' : 'Kamera ➔ Teks'}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          "{item.input}" ➔ <span className="text-amber-500 dark:text-amber-400">{item.output}</span>
                        </p>
                      </div>
                      <span className="text-slate-400 text-[11px] shrink-0 font-mono">
                        {item.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
