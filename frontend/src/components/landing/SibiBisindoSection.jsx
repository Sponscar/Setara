/**
 * ==============================================================================
 * File: SibiBisindoSection.jsx
 * Direktori: src/components/landing/
 * Deskripsi: Section Pusat Edukasi Bahasa Isyarat — Komparasi Mendalam SIBI vs BISINDO.
 *            Memberikan penjelasan komparatif berdampingan tentang asal-usul, sifat dasar,
 *            penggunaan tangan (satu tangan vs dua tangan), ranah penerapan, dan kelebihan
 *            masing-masing sistem isyarat di Indonesia.
 * Pattern:
 *   - Tab Navigation / View Switcher Pattern: Berpindah antara 'comparison', 'sibi', dan 'bisindo'.
 *   - Single Source of Truth: Membaca dataset edukasi dari `mockData.js` (SIBI_VS_BISINDO_DATA).
 * ==============================================================================
 */

import React, { useState } from 'react';
import { SIBI_VS_BISINDO_DATA } from '../../services/mockData';
import { 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  Hand, 
  GraduationCap, 
  Users, 
  Compass, 
  Sparkles,
  Layers
} from 'lucide-react';

/**
 * Komponen Section Edukasi SIBI vs BISINDO.
 */
export default function SibiBisindoSection() {
  /** Tab aktif: 'comparison' (matriks komparasi) | 'sibi' (detail SIBI) | 'bisindo' (detail BISINDO) */
  const [activeTab, setActiveTab] = useState('comparison');

  /** Destrukturisasi dataset komparasi SIBI dan BISINDO */
  const { sibi, bisindo } = SIBI_VS_BISINDO_DATA;

  return (
    <section id="edukasi" className="py-16 md:py-20 relative scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===================================================================
         * 1. SECTION HEADER — Judul & Deskripsi Edukasi
         * =================================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Pusat Edukasi Bahasa Isyarat</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Memahami SIBI vs BISINDO
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Dua sistem isyarat penting di Indonesia dengan filosofi, tata bahasa, dan ranah penggunaan masing-masing.
          </p>
        </div>

        {/* ===================================================================
         * 2. TAB NAVIGATION — Pengalih Tampilan Tab
         * =================================================================== */}
        <div className="flex items-center justify-center mb-10">
          <div className="p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'comparison'
                  ? 'bg-white dark:bg-dark-card text-brand-600 dark:text-brand-400 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Komparasi Berdampingan
            </button>
            <button
              onClick={() => setActiveTab('sibi')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'sibi'
                  ? 'bg-white dark:bg-dark-card text-brand-600 dark:text-brand-400 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Tentang SIBI
            </button>
            <button
              onClick={() => setActiveTab('bisindo')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'bisindo'
                  ? 'bg-white dark:bg-dark-card text-amber-600 dark:text-amber-400 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Tentang BISINDO
            </button>
          </div>
        </div>

        {/* ===================================================================
         * 3. TAB CONTENT 1: MATRIKS KOMPARASI BERDAMPINGAN
         * =================================================================== */}
        {activeTab === 'comparison' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* SIBI Card Column */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-brand-500/30 space-y-6">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-400 border border-brand-500/30">
                  Sistem Isyarat Bahasa Indonesia
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  SIBI (Resmi & Baku)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {sibi.tagline}
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 text-xs font-bold uppercase">Sifat Dasar</span>
                  <p className="text-slate-800 dark:text-slate-200 font-semibold">{sibi.type}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 text-xs font-bold uppercase">Penggunaan Tangan</span>
                  <p className="text-slate-800 dark:text-slate-200 font-semibold">{sibi.handUsage}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 text-xs font-bold uppercase">Kelebihan Utama</span>
                  <ul className="space-y-1 pt-1">
                    {sibi.advantages.map((adv, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* BISINDO Card Column */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/30 space-y-6">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Bahasa Isyarat Indonesia
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  BISINDO (Alami & Kultural)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {bisindo.tagline}
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 text-xs font-bold uppercase">Sifat Dasar</span>
                  <p className="text-slate-800 dark:text-slate-200 font-semibold">{bisindo.type}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 text-xs font-bold uppercase">Penggunaan Tangan</span>
                  <p className="text-slate-800 dark:text-slate-200 font-semibold">{bisindo.handUsage}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 text-xs font-bold uppercase">Kelebihan Utama</span>
                  <ul className="space-y-1 pt-1">
                    {bisindo.advantages.map((adv, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
         * 4. TAB CONTENT 2: DETAIL MENDALAM SIBI
         * =================================================================== */}
        {activeTab === 'sibi' && (
          <div className="glass-card rounded-3xl p-6 sm:p-10 border border-brand-500/30 max-w-4xl mx-auto space-y-6">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-400">
                Sistem Isyarat Bahasa Indonesia
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Mengenal SIBI Lebih Dekat
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                {sibi.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  Ranah Penggunaan
                </span>
                <p className="text-slate-600 dark:text-slate-300">{sibi.users}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
                  <Compass className="w-4 h-4" />
                  Asal-usul
                </span>
                <p className="text-slate-600 dark:text-slate-300">{sibi.origin}</p>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
         * 5. TAB CONTENT 3: DETAIL MENDALAM BISINDO
         * =================================================================== */}
        {activeTab === 'bisindo' && (
          <div className="glass-card rounded-3xl p-6 sm:p-10 border border-amber-500/30 max-w-4xl mx-auto space-y-6">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400">
                Bahasa Isyarat Indonesia
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Kekayaan Budaya BISINDO
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                {bisindo.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  Ranah Penggunaan
                </span>
                <p className="text-slate-600 dark:text-slate-300">{bisindo.users}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Compass className="w-4 h-4" />
                  Asal-usul & Budaya
                </span>
                <p className="text-slate-600 dark:text-slate-300">{bisindo.origin}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
