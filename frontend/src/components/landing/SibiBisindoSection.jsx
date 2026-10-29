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
import { useThemeStore } from '../../stores/useThemeStore';
import { LiquidNavbar } from '../ui/liquid-glass-navbar';
import { 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  Hand, 
  GraduationCap, 
  Users, 
  Compass, 
  Layers
} from 'lucide-react';

/**
 * Komponen Section Edukasi SIBI vs BISINDO.
 */
export default function SibiBisindoSection() {
  /** Store tema global (light/dark) */
  const { theme } = useThemeStore();

  /** Tab aktif: 'comparison' (matriks komparasi) | 'sibi' (detail SIBI) | 'bisindo' (detail BISINDO) */
  const [activeTab, setActiveTab] = useState('comparison');

  /** Destrukturisasi dataset komparasi SIBI dan BISINDO */
  const { sibi, bisindo } = SIBI_VS_BISINDO_DATA;

  /** Items untuk Liquid Glass Navbar Switcher */
  const tabItems = [
    { label: 'Komparasi Berdampingan', id: 'comparison', fx: 'glow' },
    { label: 'Tentang SIBI', id: 'sibi', fx: 'pop' },
    { label: 'Tentang BISINDO', id: 'bisindo', fx: 'wave' },
  ];

  const activeTabIndex = tabItems.findIndex(it => it.id === activeTab);

  return (
    <section id="edukasi" className="py-16 md:py-20 relative scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===================================================================
         * 1. SECTION HEADER — Judul & Deskripsi Edukasi
         * =================================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
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
         * 2. TAB NAVIGATION — Liquid Glass Waterline Switcher
         * =================================================================== */}
        <div className="flex items-center justify-center mb-10 py-2.5 px-3 max-w-full overflow-x-auto no-scrollbar">
          <LiquidNavbar
            items={tabItems}
            active={activeTabIndex >= 0 ? activeTabIndex : 0}
            onChange={(idx, item) => setActiveTab(item.id)}
            tone={theme === 'dark' ? 'dark' : 'light'}
          />
        </div>

        {/* ===================================================================
         * 3. TAB CONTENT 1: MATRIKS KOMPARASI BERDAMPINGAN
         * =================================================================== */}
        {activeTab === 'comparison' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* SIBI Card Column */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-brand-500/30 hover:border-brand-500/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-500/15 dark:hover:shadow-brand-950/50 transition-all duration-500 ease-out group cursor-pointer space-y-6 relative overflow-hidden flex flex-col justify-between">
              {/* Ambient hover glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Decorative Watermark */}
              <div className="absolute -top-4 -right-4 p-8 opacity-5 dark:opacity-10 group-hover:opacity-20 dark:group-hover:opacity-25 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 pointer-events-none">
                <BookOpen className="w-36 h-36 text-brand-500" />
              </div>

              <div className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-500/30 inline-block">
                    Sistem Isyarat Bahasa Indonesia
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300">
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
            </div>

            {/* BISINDO Card Column */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/30 hover:border-amber-500/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/15 dark:hover:shadow-amber-950/50 transition-all duration-500 ease-out group cursor-pointer space-y-6 relative overflow-hidden flex flex-col justify-between">
              {/* Ambient hover glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Decorative Watermark */}
              <div className="absolute -top-4 -right-4 p-8 opacity-5 dark:opacity-10 group-hover:opacity-20 dark:group-hover:opacity-25 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 pointer-events-none">
                <Hand className="w-36 h-36 text-amber-500" />
              </div>

              <div className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 inline-block">
                    Bahasa Isyarat Indonesia
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
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
          </div>
        )}

        {/* ===================================================================
         * 4. TAB CONTENT 2: DETAIL MENDALAM SIBI
         * =================================================================== */}
        {activeTab === 'sibi' && (
          <div className="glass-card rounded-3xl p-6 sm:p-10 border border-brand-500/30 hover:border-brand-500/60 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand-500/15 dark:hover:shadow-brand-950/50 transition-all duration-500 ease-out max-w-4xl mx-auto space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-transparent pointer-events-none" />
            <div className="space-y-2 relative z-10">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-600 dark:text-brand-400 inline-block">
                Sistem Isyarat Bahasa Indonesia
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Mengenal SIBI Lebih Dekat
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                {sibi.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs sm:text-sm relative z-10">
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
          <div className="glass-card rounded-3xl p-6 sm:p-10 border border-amber-500/30 hover:border-amber-500/60 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-amber-500/15 dark:hover:shadow-amber-950/50 transition-all duration-500 ease-out max-w-4xl mx-auto space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent pointer-events-none" />
            <div className="space-y-2 relative z-10">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 inline-block">
                Bahasa Isyarat Indonesia
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Kekayaan Budaya BISINDO
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                {bisindo.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs sm:text-sm relative z-10">
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
