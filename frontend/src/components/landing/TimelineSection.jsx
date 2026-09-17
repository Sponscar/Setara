/**
 * ==============================================================================
 * File: TimelineSection.jsx
 * Direktori: src/components/landing/
 * Deskripsi: Section Jejak Langkah & Linimasa Sejarah Platform SETARA.
 *            Menampilkan milestone pencapaian, riset, rilis fitur AI, dan kerja sama
 *            komunitas dalam format linimasa vertikal alternatif kiri-kanan (zigzag).
 * Pattern:
 *   - Repository Integration: Membaca `timelineList` dari `useContentStore`.
 *   - Alternating Vertical Timeline: Elemen ganjil/genap dibedakan menggunakan `md:flex-row-reverse`.
 *   - Dynamic Icon Resolver: Fungsi `getIcon` memetakan nama string ikon ke komponen Lucide React.
 * ==============================================================================
 */

import React, { useEffect } from 'react';
import { useContentStore } from '../../stores/useContentStore';
import { 
  Milestone, 
  Sparkles, 
  Calendar, 
  Rocket, 
  BookOpen, 
  Users, 
  Cpu, 
  CheckCircle2 
} from 'lucide-react';

/**
 * Komponen Section Linimasa Sejarah & Milestone.
 */
export default function TimelineSection() {
  /** Mengambil daftar milestone dari CMS global store */
  const { timelineList, fetchTimeline } = useContentStore();

  useEffect(() => {
    fetchTimeline();
  }, []);

  /**
   * Helper pemetaan nama string ikon ke komponen Lucide icon.
   * 
   * @param {string} name - Nama string ikon (Rocket | BookOpen | Users | Cpu)
   * @returns {React.ComponentType} Komponen ikon Lucide yang cocok
   */
  const getIcon = (name) => {
    switch (name) {
      case 'Rocket': return Rocket;
      case 'BookOpen': return BookOpen;
      case 'Users': return Users;
      case 'Cpu': return Cpu;
      default: return Sparkles;
    }
  };

  return (
    <section className="py-16 md:py-20 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===================================================================
         * 1. SECTION HEADER — Judul & Deskripsi Milestone
         * =================================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            <Milestone className="w-3.5 h-3.5" />
            <span>Jejak Langkah & Milestone</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Perjalanan Membangun SETARA
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Komitmen berkelanjutan kami dari riset akar rumput hingga integrasi kecerdasan buatan mutakhir.
          </p>
        </div>

        {/* ===================================================================
         * 2. VERTICAL TIMELINE TRACK — Jalur Garis & Kartu Zig-Zag
         * =================================================================== */}
        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-brand-500 via-amber-500 to-brand-500 -translate-x-1/2 opacity-30"></div>

          <div className="space-y-10">
            {timelineList.map((item, idx) => {
              const IconComponent = getIcon(item.icon);
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={item.id}
                  className={`relative flex flex-col md:flex-row items-start ${
                    isEven ? 'md:flex-row-reverse' : ''
                  } gap-6 md:gap-12 group`}
                >
                  {/* Glowing Timeline Marker Dot */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-9 h-9 rounded-2xl bg-white dark:bg-dark-card border-2 border-brand-500 shadow-lg shadow-brand-500/30 flex items-center justify-center text-brand-500 z-10 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-4 h-4 text-brand-500" />
                  </div>

                  {/* Milestone Card */}
                  <div className="ml-12 md:ml-0 md:w-1/2">
                    <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border hover:border-brand-500/60 transition-all duration-300 space-y-3 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                          {item.kategori || 'Milestone'}
                        </span>
                        <span className="text-xs font-mono font-semibold text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.tanggal}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                        {item.judul}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.deskripsi}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
