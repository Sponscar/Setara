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
  Github, 
  Instagram, 
  Twitter, 
  Mail, 
  Phone,
  ArrowUp,
  Home,
  Languages,
  BookOpen,
  Newspaper,
  Users
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
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md shadow-brand-500/15 group-hover:scale-105 transition-transform bg-white border border-slate-200/80 dark:border-white/10">
                <img
                  src="/Setara Logo.jpg"
                  alt="SETARA Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                SETARA
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Platform penerjemah bahasa isyarat dua arah SIBI & BISINDO cerdas berbasis Computer Vision & AI. Menghubungkan dunia tanpa batas komunikasi.
            </p>
            {/* Partner & Institution Logos - Sama dengan Navbar */}
            <div className="pt-4 mt-1">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2.5">
                Penyelenggara & Kolaborasi
              </p>
              <div className="flex items-center gap-2 flex-wrap">
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
                <div className="h-6 w-px bg-slate-200/80 dark:bg-slate-700/80" />
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
            </div>
          </div>

          {/* ===================================================================
           * 2. QUICK LINKS — Navigasi Cepat Antar-Section
           * =================================================================== */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="flex items-center gap-2 hover:text-brand-500 transition-colors cursor-pointer group text-left"
                >
                  <Home className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-brand-500 transition-colors shrink-0" />
                  <span>Beranda</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('translator')}
                  className="flex items-center gap-2 hover:text-brand-500 transition-colors cursor-pointer group text-left"
                >
                  <Languages className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-brand-500 transition-colors shrink-0" />
                  <span>Penerjemah Teks & Kamera</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('edukasi')}
                  className="flex items-center gap-2 hover:text-brand-500 transition-colors cursor-pointer group text-left"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-brand-500 transition-colors shrink-0" />
                  <span>Edukasi SIBI vs BISINDO</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('berita')}
                  className="flex items-center gap-2 hover:text-brand-500 transition-colors cursor-pointer group text-left"
                >
                  <Newspaper className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-brand-500 transition-colors shrink-0" />
                  <span>Kabar & Berita Terkini</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('komunitas')}
                  className="flex items-center gap-2 hover:text-brand-500 transition-colors cursor-pointer group text-left"
                >
                  <Users className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-brand-500 transition-colors shrink-0" />
                  <span>Komunitas & Timeline</span>
                </button>
              </li>
            </ul>
          </div>

          {/* ===================================================================
           * 3. SYSTEMS & ARCHITECTURE — Kontak & Media Sosial Resmi
           * =================================================================== */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Kontak
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href="mailto:setara@gmail.com"
                  className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors group"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-brand-500 transition-colors shrink-0" />
                  <span>setara@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+6281952946769"
                  className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors group"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-brand-500 transition-colors shrink-0" />
                  <span>+62819-5294-6769</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/sayauisi?exln=dThwYXB0dmVycWwy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors group"
                  title="Kunjungi Instagram UISI (@sayauisi)"
                >
                  <Instagram className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-pink-500 transition-colors shrink-0" />
                  <span>@sayauisi</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/uinsa.official?rpxt=MTU3bjZvdDA0bTNjMw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors group"
                  title="Kunjungi Instagram UINSA (@uinsa.official)"
                >
                  <Instagram className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-pink-500 transition-colors shrink-0" />
                  <span>@uinsa.official</span>
                </a>
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
