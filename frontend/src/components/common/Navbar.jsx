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

export default function Navbar({ onNavigate, currentView }) {
  const { theme, toggleTheme } = useThemeStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Beranda', id: 'home', icon: Sparkles },
    { name: 'Edukasi SIBI & BISINDO', id: 'edukasi', icon: Info },
    { name: 'Berita', id: 'berita', icon: Newspaper },
    { name: 'Komunitas', id: 'komunitas', icon: Users },
    { name: 'Tentang Kami', id: 'tentang', icon: Info }
  ];

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

  const handleNavClick = (id) => {
    setActiveSection(id);
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const isCurrentActive = (id) => {
    if (currentView === 'admin') return id === 'admin';
    if (currentView === 'translator') return id === 'translator';
    return activeSection === id;
  };

  return (
    <div className={`fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none transform-gpu transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
      isScrolled ? 'pt-3 sm:pt-4 px-3 sm:px-6' : 'pt-0 px-0'
    }`}>
      {/* 
        Dynamic Island Header (Open SaaS Style):
        - IDLE: Full-width edge-to-edge with glassmorphism
        - SCROLLED: Smoothly morphs into a floating capsule (max-w-6xl, rounded-full, floating with backdrop-blur-2xl & shadow-2xl)
      */}
      <header className={`pointer-events-auto relative overflow-hidden transform-gpu transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isScrolled
          ? 'w-full max-w-6xl rounded-2xl sm:rounded-full bg-white/85 dark:bg-[#0B0F19]/85 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-2xl shadow-slate-900/10 dark:shadow-brand-950/30 px-4 sm:px-6 py-2 sm:py-2.5'
          : 'w-full rounded-none bg-white/40 dark:bg-dark-bg/40 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4.5'
      }`}>
        <div className={`w-full mx-auto flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isScrolled ? '' : 'max-w-7xl'
        }`}>
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
          >
            <div className={`rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 p-0.5 shadow-lg shadow-brand-500/20 group-hover:scale-105 group-hover:rotate-1 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isScrolled ? 'w-8 h-8 sm:w-9 sm:h-9' : 'w-9 h-9 sm:w-10 sm:h-10'
            }`}>
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-amber-400 text-sm sm:text-base">
                  S
                </span>
              </div>
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

          {/* Desktop Navigation Links */}
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

          {/* Action Buttons & Theme Switcher */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-2.5">
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

          {/* Mobile Menu Trigger */}
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

        {/* Smooth Scroll Reading Progress Indicator */}
        <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-slate-200/30 dark:bg-slate-800/40 transition-opacity duration-500 ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`}>
          <div 
            className="h-full bg-gradient-to-r from-brand-600 via-amber-500 to-brand-500 transition-all duration-200 ease-out shadow-sm shadow-brand-500/50"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
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
