/**
 * ==============================================================================
 * File: Navbar.jsx
 * Direktori: src/components/common/
 * Deskripsi: Dynamic Island Adaptive Navigation Bar untuk Platform SETARA.
 *            Beradaptasi secara dinamis antara tampilan full-width transparan di posisi puncak
 *            dan berubah menjadi floating capsule bar dengan indikator progres membaca
 *            saat pengguna menggulir halaman.
 * Pattern:
 *   - Adaptive Floating Capsule / Dynamic Island Pattern: Transisi mulus bentuk navbar
 *     menggunakan GPU transforms, backdrop-filter blur, dan spring-like cubic bezier.
 *   - Scroll Spy Pattern: Mendeteksi posisi scroll untuk menyorot section aktif
 *     ('home', 'edukasi', 'berita', 'komunitas', 'tentang') secara real-time.
 *   - Responsive Drawer Navigation: Menu drawer mobile dengan penutupan otomatis saat navigasi.
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import { useThemeStore } from '../../stores/useThemeStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Sparkles, 
  Languages, 
  Newspaper, 
  Users, 
  Info, 
  ShieldCheck, 
  ArrowRight, 
  LogOut 
} from 'lucide-react';

/**
 * Komponen Navigasi Utama (Navbar).
 * 
 * @param {Object} props
 * @param {Function} props.onNavigate - Callback navigasi ke section atau view ('home' | 'edukasi' | 'berita' | 'komunitas' | 'tentang' | 'translator' | 'admin')
 * @param {string} props.currentView - View aplikasi saat ini ('home' | 'translator' | 'admin')
 */
export default function Navbar({ onNavigate, currentView }) {
  /* ===================================================================
   * 1. GLOBAL STORES & LOCAL STATE
   * =================================================================== */

  /** Store tema global (light/dark) */
  const { theme, toggleTheme } = useThemeStore();

  /** Store autentikasi administrator */
  const { user, isAuthenticated, logout } = useAuthStore();

  /** Status apakah halaman telah digulir lebih dari 25px */
  const [isScrolled, setIsScrolled] = useState(false);

  /** Persentase progres membaca halaman (0 - 100%) */
  const [scrollProgress, setScrollProgress] = useState(0);

  /** Section landing page yang saat ini aktif */
  const [activeSection, setActiveSection] = useState('home');

  /** Status keterbukaan drawer navigasi mobile */
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /** Daftar tautan menu navigasi utama */
  const navLinks = [
    { name: 'Beranda', id: 'home', icon: Sparkles },
    { name: 'Edukasi SIBI & BISINDO', id: 'edukasi', icon: Info },
    { name: 'Berita', id: 'berita', icon: Newspaper },
    { name: 'Komunitas', id: 'komunitas', icon: Users },
    { name: 'Tentang Kami', id: 'tentang', icon: Info }
  ];

  /* ===================================================================
   * 2. SCROLL SPY & READING PROGRESS EFFECT
   * =================================================================== */
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setIsScrolled(scrollY > 25);

          // Calculate reading / scroll progress smoothly
          const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
          if (totalScrollable > 0) {
            const progress = (scrollY / totalScrollable) * 100;
            setScrollProgress(Math.min(100, Math.max(0, progress)));
          }

          // Auto-detect active section on scroll when on home view
          if (currentView === 'home') {
            if (scrollY < 300) {
              setActiveSection('home');
            } else {
              const sections = ['tentang', 'komunitas', 'berita', 'edukasi'];
              let matched = false;
              for (const section of sections) {
                const el = document.getElementById(section);
                if (el) {
                  const rect = el.getBoundingClientRect();
                  if (rect.top <= 260) {
                    setActiveSection(section);
                    matched = true;
                    break;
                  }
                }
              }
              if (!matched) {
                setActiveSection('home');
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  /* ===================================================================
   * 3. NAVIGATION HANDLERS & HELPERS
   * =================================================================== */

  /**
   * Menangani klik navigasi pada menu item, menutup drawer mobile,
   * dan memanggil callback `onNavigate`.
   * 
   * @param {string} id - Identifier tujuan navigasi
   */
  const handleNavClick = (id) => {
    setActiveSection(id);
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  /**
   * Mengecek apakah tautan navigasi sedang aktif sesuai view atau section saat ini.
   * 
   * @param {string} id - Identifier tautan yang dicek
   * @returns {boolean}
   */
  const isCurrentActive = (id) => {
    if (currentView === 'admin') return id === 'admin';
    if (currentView === 'translator') return id === 'translator';
    return activeSection === id;
  };

  return (
    <div className={`fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none transform-gpu transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
      isScrolled ? 'pt-3 sm:pt-4 px-3 sm:px-6' : 'pt-0 px-0'
    }`}>
      {/* ===================================================================
       * 4. DYNAMIC ISLAND CAPSULE HEADER
       *    - Posisi Puncak: Full-width edge-to-edge dengan border-b halus
       *    - Posisi Digulir: Morphing menjadi floating capsule melayang (max-w-6xl)
       * =================================================================== */}
      <header className={`pointer-events-auto relative overflow-hidden transform-gpu transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isScrolled
          ? 'w-full max-w-6xl rounded-2xl sm:rounded-full bg-white/85 dark:bg-[#0B0F19]/85 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-2xl shadow-slate-900/10 dark:shadow-brand-950/30 px-4 sm:px-6 py-2 sm:py-2.5'
          : 'w-full rounded-none bg-white/40 dark:bg-dark-bg/40 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4.5'
      }`}>
        <div className={`w-full mx-auto flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isScrolled ? '' : 'max-w-7xl'
        }`}>
          {/* --- BRAND & EVENT LOGOS (LEFT) --- */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* SETARA Brand Logo */}
            <div
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group"
            >
              <div className={`rounded-xl overflow-hidden shadow-md shadow-brand-500/15 group-hover:scale-105 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] bg-white border border-slate-200/80 dark:border-white/10 ${
                isScrolled ? 'w-8 h-8 sm:w-9 sm:h-9' : 'w-9 h-9 sm:w-10 sm:h-10'
              }`}>
                <img
                  src="/Setara Logo.jpg"
                  alt="SETARA Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className={`font-black tracking-tight text-slate-900 dark:text-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isScrolled ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'
                }`}>
                  SETARA
                </span>
                <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isScrolled ? 'max-h-0 opacity-0' : 'max-h-6 opacity-100'
                }`}>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                    Penerjemah SIBI & BISINDO
                  </p>
                </div>
              </div>
            </div>

            {/* Subtle Vertical Divider */}
            <div className="h-6 w-px bg-slate-200/80 dark:bg-slate-700/80 hidden sm:block" />

            {/* Partner / Event Logos (JACK, TCC & TRIPLE-C) */}
            <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
              <div
                className={`flex items-center justify-center p-1 rounded-xl bg-white border border-slate-200/80 dark:border-white/10 shadow-xs hover:scale-105 transition-all overflow-hidden ${
                  isScrolled ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-8 h-8 sm:w-9 sm:h-9'
                }`}
                title="JACK"
              >
                <img
                  src="/JACK 2.png"
                  alt="Logo JACK"
                  className="w-full h-full object-contain"
                />
              </div>
              <div
                className={`flex items-center justify-center p-1 rounded-xl bg-white border border-slate-200/80 dark:border-white/10 shadow-xs hover:scale-105 transition-all overflow-hidden ${
                  isScrolled ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-8 h-8 sm:w-9 sm:h-9'
                }`}
                title="TCC"
              >
                <img
                  src="/Salinan LOGO TCC.png"
                  alt="Logo TCC"
                  className="w-full h-full object-contain"
                />
              </div>
              <div
                className={`flex items-center justify-center p-1 rounded-xl bg-white border border-slate-200/80 dark:border-white/10 shadow-xs hover:scale-105 transition-all overflow-hidden ${
                  isScrolled ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-8 h-8 sm:w-9 sm:h-9'
                }`}
                title="TRIPLE-C"
              >
                <img
                  src="/Salinan LOGO TRIPLE-C.png"
                  alt="Logo TRIPLE-C"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* ===================================================================
           * 5. DESKTOP NAVIGATION LINKS
           * =================================================================== */}
          <nav className={`hidden lg:flex items-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isScrolled 
              ? 'gap-0.5 px-2 py-1 rounded-full bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/60' 
              : 'gap-1'
          }`}>
            {navLinks.map((link) => {
              const active = isCurrentActive(link.id);
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transform-gpu transition-all duration-300 ease-out cursor-pointer ${
                    active
                      ? isScrolled
                        ? 'text-brand-600 dark:text-brand-400 bg-white dark:bg-dark-card shadow-sm border border-slate-200/60 dark:border-slate-700/60 font-bold scale-[1.02]'
                        : 'text-brand-600 dark:text-brand-400 bg-brand-500/10 border border-brand-500/20 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:scale-[1.03] active:scale-[0.98]'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* ===================================================================
           * 6. ACTION BUTTONS & THEME SWITCHER (WITH UNIVERSITY LOGOS)
           * =================================================================== */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-2.5">
            {/* Institutional / University Logos (UINSA & UISI - Ukuran Sama) */}
            <div className="flex items-center gap-2 pr-0.5 sm:pr-1">
              <div
                className={`flex items-center justify-center p-1 rounded-xl bg-white border border-slate-200/80 dark:border-white/10 shadow-xs hover:scale-105 transition-all overflow-hidden ${
                  isScrolled ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-8 h-8 sm:w-9 sm:h-9'
                }`}
                title="UIN Sunan Ampel Surabaya"
              >
                <img
                  src="/Logo UINSA.png"
                  alt="Logo UINSA"
                  className="w-full h-full object-contain"
                />
              </div>
              <div
                className={`flex items-center justify-center p-1 rounded-xl bg-white border border-slate-200/80 dark:border-white/10 shadow-xs hover:scale-105 transition-all overflow-hidden ${
                  isScrolled ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-8 h-8 sm:w-9 sm:h-9'
                }`}
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
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700/80 hidden md:block" />

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`rounded-full bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/60 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer ${
                isScrolled ? 'p-2' : 'p-2.5'
              }`}
              title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* CTA Try Translator Button */}
            <button
              onClick={() => handleNavClick('translator')}
              className={`rounded-full bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-500 hover:to-amber-500 text-white text-xs font-bold shadow-md shadow-brand-600/25 hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                isScrolled ? 'px-3.5 py-1.5' : 'px-4 sm:px-5 py-2.5'
              }`}
            >
              <span>Coba Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ===================================================================
           * 7. MOBILE MENU HAMBURGER TRIGGER
           * =================================================================== */}
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ===================================================================
         * 8. READING SCROLL PROGRESS BAR (CAPSULE BOTTOM LINE)
         * =================================================================== */}
        <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-slate-200/30 dark:bg-slate-800/40 transition-opacity duration-500 ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`}>
          <div 
            className="h-full bg-gradient-to-r from-brand-600 via-amber-500 to-brand-500 transition-all duration-200 ease-out shadow-sm shadow-brand-500/50"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </header>

      {/* ===================================================================
       * 9. MOBILE DRAWER NAVIGATION MENU
       * =================================================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-4 top-20 z-50 pointer-events-auto p-4 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-2xl animate-float">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full px-4 py-3 rounded-2xl text-left text-sm font-semibold flex items-center gap-3 transition-all ${
                  isCurrentActive(link.id)
                    ? 'bg-brand-500/15 text-brand-600 dark:text-brand-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 text-brand-500" />
                <span>{link.name}</span>
              </button>
            );
          })}

          {/* Mobile Partner & Institution Logos */}
          <div className="pt-3 pb-1 border-t border-slate-200/80 dark:border-slate-800">
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2 px-1 text-center">
              Penyelenggara & Kolaborasi
            </p>
            <div className="flex items-center justify-center gap-2 py-1 flex-wrap">
              <div className="p-1 rounded-lg bg-white border border-slate-200 dark:border-slate-700 shadow-xs">
                <img src="/JACK 2.png" alt="JACK" className="h-5 sm:h-6 w-auto object-contain" />
              </div>
              <div className="p-1 rounded-lg bg-white border border-slate-200 dark:border-slate-700 shadow-xs">
                <img src="/Salinan LOGO TCC.png" alt="TCC" className="h-5 sm:h-6 w-auto object-contain" />
              </div>
              <div className="p-1 rounded-lg bg-white border border-slate-200 dark:border-slate-700 shadow-xs">
                <img src="/Salinan LOGO TRIPLE-C.png" alt="Triple-C" className="h-5 sm:h-6 w-auto object-contain" />
              </div>
              <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-0.5" />
              <div className="p-1 rounded-lg bg-white border border-slate-200 dark:border-slate-700 shadow-xs">
                <img src="/Logo UINSA.png" alt="UINSA" className="h-5 sm:h-6 w-auto object-contain" />
              </div>
              <div className="p-0.5 rounded-lg bg-white border border-slate-200 dark:border-slate-700 shadow-xs">
                <img src="/uisi.jpg" alt="UISI" className="h-5 w-5 sm:h-6 sm:w-6 object-cover rounded-md" />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Admin Panel</span>
            </button>
            <button
              onClick={() => handleNavClick('translator')}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-brand-600 to-amber-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30"
            >
              <span>Buka Penerjemah</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
