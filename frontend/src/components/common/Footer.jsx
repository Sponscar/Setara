/**
 * ==============================================================================
 * File: Footer.jsx
 * Direktori: src/components/common/
 * Deskripsi: Komponen Footer Navigasi Global Platform SETARA.
 *            Menyediakan informasi ringkasan platform, kepatuhan aksesibilitas WCAG 2.1 AA,
 *            tautan navigasi cepat antar-section, informasi sistem bahasa, dan tombol kembali ke atas (back to top).
 * Pattern:
 *   - Presentational Component: Menerima callback navigasi `onNavigate`.
 *   - Smooth Scroll to Top: Menggunakan API window.scrollTo dengan behavior 'smooth'.
 * ==============================================================================
 */

import React from 'react';
import { 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  Github, 
  Instagram, 
  Twitter, 
  Mail, 
  ArrowUp 
} from 'lucide-react';

/**
 * Komponen Footer Global Platform SETARA.
 * 
 * @param {Object} props
 * @param {Function} props.onNavigate - Callback navigasi antar section/view
 */
export default function Footer({ onNavigate }) {
  /** Menggulirkan jendela browser kembali ke puncak halaman dengan animasi halus */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200 dark:border-dark-border bg-slate-100/60 dark:bg-dark-bg/90 pt-16 pb-12 text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* ===================================================================
           * 1. BRAND COLUMN — Logo, Tagline, & Kepatuhan Aksesibilitas
           * =================================================================== */}
          <div className="md:col-span-2 space-y-4">
            <div 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 p-0.5">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-amber-400 text-base">
                  S
                </div>
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                SETARA
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Platform penerjemah bahasa isyarat dua arah SIBI & BISINDO cerdas berbasis Computer Vision & AI. Menghubungkan dunia tanpa batas komunikasi.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>WCAG 2.1 AA Accessibility Compliant</span>
            </div>
          </div>

          {/* ===================================================================
           * 2. QUICK LINKS — Navigasi Cepat Antar-Section
           * =================================================================== */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-brand-500 cursor-pointer">
                  Beranda
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('translator')} className="hover:text-brand-500 cursor-pointer">
                  Penerjemah Teks & Kamera
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('edukasi')} className="hover:text-brand-500 cursor-pointer">
                  Edukasi SIBI vs BISINDO
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('berita')} className="hover:text-brand-500 cursor-pointer">
                  Kabar & Berita Terkini
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('komunitas')} className="hover:text-brand-500 cursor-pointer">
                  Komunitas & Timeline
                </button>
              </li>
            </ul>
          </div>

          {/* ===================================================================
           * 3. SYSTEMS & ARCHITECTURE — Sistem Bahasa & Model AI
           * =================================================================== */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Sistem & Kelola
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-500">SIBI (Tata Bahasa Formal)</span>
              </li>
              <li>
                <span className="text-slate-500">BISINDO (Bahasa Alami Tuli)</span>
              </li>
              <li>
                <span className="text-slate-500">YOLO 11 Hand Pose 21 Keypoints</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ===================================================================
         * 4. BOTTOM BAR — Hak Cipta & Tombol Kembali ke Atas
         * =================================================================== */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500">
            © 2026 <strong>SETARA</strong>. Dibuat dengan cinta untuk inklusivitas Indonesia.
          </p>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-xl bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all cursor-pointer flex items-center gap-1 text-xs"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
