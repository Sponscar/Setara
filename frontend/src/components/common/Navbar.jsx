/**
 * ==============================================================================
 * File: Navbar.jsx
 * Direktori: src/components/common/
 * Deskripsi: Dynamic Island Adaptive Navigation Bar untuk Platform SETARA
 *            dengan Liquid Glass "Waterline" pill interaction.
 * ==============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { LiquidNavbar, NimbusIcons } from '../ui/liquid-glass-navbar';
import { useThemeStore } from '../../stores/useThemeStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Home, 
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

  /** Ref untuk mencegah interferensi scroll spy saat navigasi klik sedang berlangsung */
  const isNavigatingRef = useRef(false);
  const navTimeoutRef = useRef(null);

  /** Daftar tautan menu navigasi utama */
  const navLinks = [
    { name: 'Beranda', id: 'home', icon: Home },
    { name: 'Edukasi SIBI & BISINDO', id: 'edukasi', icon: Info },
    { name: 'Berita', id: 'berita', icon: Newspaper },
    { name: 'Komunitas', id: 'komunitas', icon: Users },
    { name: 'Tentang Kami', id: 'tentang', icon: Info }
  ];

  /** Item menu untuk Liquid Glass Navbar (Nimbus Waterline) */
  const liquidNavItems = [
    { label: 'Beranda', id: 'home', icon: NimbusIcons.home, fx: 'glow' },
    { label: 'Edukasi', id: 'edukasi', icon: NimbusIcons.globe, fx: 'spin' },
    { label: 'Berita', id: 'berita', icon: NimbusIcons.news, fx: 'pop' },
    { label: 'Komunitas', id: 'komunitas', icon: NimbusIcons.community, fx: 'wave' },
    { label: 'Tentang', id: 'tentang', icon: NimbusIcons.info, fx: 'drop' },
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

          // Auto-detect active section on scroll when on home view (hanya jika tidak sedang navigasi klik)
          if (!isNavigatingRef.current && currentView === 'home') {
            const isBottom = window.innerHeight + scrollY >= document.documentElement.scrollHeight - 140;

            if (isBottom) {
              setActiveSection('tentang');
            } else if (scrollY < 260) {
              setActiveSection('home');
            } else {
              const sections = ['tentang', 'komunitas', 'berita', 'edukasi'];
              let matched = false;
              for (const section of sections) {
                const el = document.getElementById(section);
                if (el) {
                  const rect = el.getBoundingClientRect();
                  if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= 120) {
                    setActiveSection(section);
                    matched = true;
                    break;
                  }
                }
              }
              if (!matched && scrollY < 400) {
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
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    };
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

    // Kunci scroll spy agar tetesan navbar langsung menuju ke menu tujuan tanpa loncat balik
    isNavigatingRef.current = true;
    if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    navTimeoutRef.current = setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1400);
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

  const activeIndex = liquidNavItems.findIndex(it => isCurrentActive(it.id));

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
          : 'w-full rounded-none bg-white/40 dark:bg-dark-bg/40 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5'
      }`}>
        <div className={`w-full mx-auto flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isScrolled ? '' : 'max-w-7xl'
        }`}>
          {/* --- BRAND & EVENT LOGOS (LEFT) --- */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* SETARA Brand Logo */}
            <div
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center p-0.5 rounded-xl bg-white border border-slate-200/80 dark:border-white/10 shadow-xs group-hover:scale-105 transition-all overflow-hidden">
                <img
                  src="/Setara Logo.jpg"
                  alt="SETARA Logo"
                  className="w-full h-full object-cover rounded-lg"
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
            <div className="h-5 sm:h-6 w-px bg-slate-200/80 dark:bg-slate-700/80 hidden sm:block" />

            {/* Partner / Event Logos (JACK, TCC & TRIPLE-C) - Samakan dengan Navbar Penerjemah */}
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
          </div>

          {/* ===================================================================
           * 5. DESKTOP LIQUID GLASS NAVBAR ("WATERLINE")
           * =================================================================== */}
          <div className="hidden lg:flex items-center justify-center">
            <LiquidNavbar
              items={liquidNavItems}
              active={activeIndex >= 0 ? activeIndex : 0}
              onChange={(idx, item) => handleNavClick(item.id)}
              tone={theme === 'dark' ? 'dark' : 'light'}
            />
          </div>

          {/* ===================================================================
           * 6. ACTION BUTTONS & THEME SWITCHER (WITH UNIVERSITY LOGOS)
           * =================================================================== */}
          <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
            {/* Institutional / University Logos (UINSA & UISI) - Sama persis dengan Halaman Penerjemah */}
            <div className="flex items-center gap-1.5 sm:gap-2 pr-0.5 sm:pr-1">
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
            <div className="h-5 sm:h-6 w-px bg-slate-200/80 dark:bg-slate-700/80 hidden md:block" />

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/60 hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-300 cursor-pointer shadow-xs"
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
              className="h-8 sm:h-9 px-3.5 sm:px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/25 hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-1.5 transition-all duration-300 cursor-pointer"
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
            className="h-full bg-brand-600 transition-all duration-200 ease-out shadow-sm shadow-brand-500/50"
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
            <div className="flex items-center justify-center gap-2 py-1">
              <div
                className="w-8 h-8 flex items-center justify-center p-1 rounded-xl bg-white border border-slate-200/80 dark:border-white/10 shadow-xs overflow-hidden"
                title="JACK"
              >
                <img src="/JACK 2.png" alt="JACK" className="w-full h-full object-contain" />
              </div>
              <div
                className="w-8 h-8 flex items-center justify-center p-1 rounded-xl bg-white border border-slate-200/80 dark:border-white/10 shadow-xs overflow-hidden"
                title="TCC"
              >
                <img src="/Salinan LOGO TCC.png" alt="TCC" className="w-full h-full object-contain" />
              </div>
              <div
                className="w-8 h-8 flex items-center justify-center p-1 rounded-xl bg-white border border-slate-200/80 dark:border-white/10 shadow-xs overflow-hidden"
                title="TRIPLE-C"
              >
                <img src="/Salinan LOGO TRIPLE-C.png" alt="Triple-C" className="w-full h-full object-contain" />
              </div>
              <div className="h-5 w-px bg-slate-300 dark:bg-slate-700" />
              <div
                className="w-8 h-8 flex items-center justify-center p-1 rounded-xl bg-white border border-slate-200/80 dark:border-white/10 shadow-xs overflow-hidden"
                title="UIN Sunan Ampel Surabaya"
              >
                <img src="/Logo UINSA.png" alt="Logo UINSA" className="w-full h-full object-contain" />
              </div>
              <div
                className="w-8 h-8 flex items-center justify-center p-1 rounded-xl bg-white border border-slate-200/80 dark:border-white/10 shadow-xs overflow-hidden"
                title="Universitas Internasional Semen Indonesia (UISI)"
              >
                <img src="/uisi.jpg" alt="UISI" className="w-full h-full object-contain rounded-xs" />
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
              className="w-full py-3 px-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30"
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
