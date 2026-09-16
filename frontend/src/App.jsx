/**
 * @file App.jsx
 * @description Root component aplikasi SETARA — Single Page Application (SPA).
 *
 * ## Arsitektur & Pattern
 * - **Client-Side Routing (Manual)**: Menggunakan History API (pushState/popstate)
 *   untuk navigasi antar view tanpa library router eksternal.
 *   View yang didukung: 'home' (/), 'translator' (/penerjemah), 'admin' (/admin).
 * - **View Gating Pattern**: Menampilkan konten berdasarkan currentView state:
 *   - 'admin' → gate di balik autentikasi (AdminLoginPage / AdminDashboard).
 *   - 'translator' → halaman penerjemah standalone.
 *   - 'home' → landing page lengkap dengan semua section.
 * - **Theme Observer**: Mengamati useThemeStore untuk toggle class 'dark' di <html>.
 * - **Section Scroll Navigation**: handleNavigate() mendukung smooth scroll
 *   ke section tertentu di homepage via document.getElementById().
 *
 * ## Hierarki Komponen
 * App
 * ├── Navbar (hanya di homepage)
 * ├── TranslatorPage | AdminDashboard | AdminLoginPage | Landing Sections
 * └── Footer (global)
 *
 * @module App
 */

import React, { useState, useEffect } from 'react';
import { useThemeStore } from './stores/useThemeStore';
import { useAuthStore } from './stores/useAuthStore';

/* --- Import komponen navigasi global --- */
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

/* --- Import section-section landing page --- */
import HeroSection from './components/landing/HeroSection';
import BentoFeatures from './components/landing/BentoFeatures';
import SibiBisindoSection from './components/landing/SibiBisindoSection';
import HowItWorks from './components/landing/HowItWorks';
import NewsSection from './components/landing/NewsSection';
import TimelineSection from './components/landing/TimelineSection';
import CommunitySection from './components/landing/CommunitySection';
import AboutSection from './components/landing/AboutSection';

/* --- Import halaman standalone --- */
import TranslatorPage from './components/translator/TranslatorPage';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLoginPage from './components/admin/AdminLoginPage';

/**
 * Helper: Menentukan view awal berdasarkan URL pathname browser.
 * Dipanggil sekali saat inisialisasi state dan saat popstate event.
 *
 * @returns {'home'|'translator'|'admin'} View yang sesuai dengan pathname.
 */
const getViewFromPath = () => {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
  if (path === '/penerjemah' || path === '/translator') return 'translator';
  if (path === '/admin') return 'admin';
  return 'home';
};

/**
 * App — Root component SPA yang mengatur routing, tema, dan layout utama.
 *
 * @returns {JSX.Element} Seluruh tampilan aplikasi SETARA.
 */
export default function App() {
  /* ===================================================================
   * 1. GLOBAL STORE SELECTORS — Tema & autentikasi
   * =================================================================== */
  /** @type {string} Tema aktif ('light' | 'dark') dari useThemeStore */
  const { theme } = useThemeStore();
  /** @type {boolean} Status autentikasi admin dari useAuthStore */
  const { isAuthenticated } = useAuthStore();

  /* ===================================================================
   * 2. STATE LOKAL — View routing
   * =================================================================== */
  /** @state {string} currentView — View aktif: 'home' | 'translator' | 'admin' */
  const [currentView, setCurrentView] = useState(getViewFromPath);

  /* ===================================================================
   * 3. SIDE EFFECTS — Popstate listener & theme sync
   * =================================================================== */

  /**
   * Effect: Sinkronisasi view dengan navigasi Back/Forward browser.
   * Mendengarkan event popstate agar tombol back/forward tetap berfungsi.
   */
  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(getViewFromPath());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  /**
   * Effect: Menerapkan dark mode class pada <html> element.
   * Berjalan setiap kali theme berubah dari useThemeStore.
   */
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  /* ===================================================================
   * 4. NAVIGATION HANDLER — Pusat kontrol routing SPA
   * =================================================================== */

  /**
   * Handler navigasi utama untuk seluruh aplikasi.
   * Mengelola pushState, perubahan view, dan smooth scroll ke section.
   *
   * Strategi:
   * - 'admin' → pushState('/admin'), setCurrentView('admin'), scroll ke atas.
   * - 'translator' → pushState('/penerjemah'), setCurrentView('translator').
   * - Section ID (edukasi/berita/komunitas/tentang) → kembali ke home,
   *   lalu setTimeout 60ms untuk menunggu DOM render sebelum scrollIntoView.
   *
   * @param {string} sectionId — ID view atau section tujuan navigasi
   */
  const handleNavigate = (sectionId) => {
    /* Navigasi ke halaman Admin */
    if (sectionId === 'admin') {
      if (window.location.pathname !== '/admin') {
        window.history.pushState({}, '', '/admin');
      }
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    /* Navigasi ke halaman Penerjemah */
    if (sectionId === 'translator') {
      if (window.location.pathname !== '/penerjemah') {
        window.history.pushState({}, '', '/penerjemah');
      }
      setCurrentView('translator');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    /* Navigasi kembali ke homepage atau scroll ke section tertentu */
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    setCurrentView('home');

    // Delay 60ms agar DOM sempat render sebelum scrollIntoView
    setTimeout(() => {
      if (sectionId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 60);
  };

  /* ===================================================================
   * 5. VIEW GATING — Admin view dilindungi oleh autentikasi
   * =================================================================== */
  if (currentView === 'admin') {
    if (!isAuthenticated) {
      /* Belum login → tampilkan halaman login admin */
      return <AdminLoginPage onBackToHome={() => handleNavigate('home')} onLoginSuccess={() => setCurrentView('admin')} />;
    }
    /* Sudah login → tampilkan dashboard admin */
    return <AdminDashboard onBackToHome={() => handleNavigate('home')} onLogout={() => handleNavigate('home')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 transition-colors duration-300 relative selection:bg-brand-600 selection:text-white bg-grid-pattern">
      {/* Sticky / Floating Dynamic Navbar - Displayed ONLY on Homepage */}
      {currentView === 'home' && (
        <Navbar onNavigate={handleNavigate} currentView={currentView} />
      )}

      {/* Main Content Areas */}
      {currentView === 'translator' ? (
        /* Dedicated Standalone Translator Page (/penerjemah) */
        <main key="translator-page" className="animate-page-enter">
          <TranslatorPage
            onBackToHome={() => handleNavigate('home')}
            onNavigate={handleNavigate}
          />
        </main>
      ) : (
        /* Full Landing Page / Homepage (/) */
        <main key="home-page" className="animate-page-enter">
          {/* 1. Hero Section (with CTAs to open /penerjemah) */}
          <HeroSection
            onStartTranslate={() => handleNavigate('translator')}
            onExploreEducation={() => handleNavigate('edukasi')}
          />

          {/* 2. Open SaaS Bento Grid Showcase */}
          <BentoFeatures onSelectFeature={(feature) => handleNavigate(feature)} />

          {/* 3. SIBI vs BISINDO In-Depth Education */}
          <SibiBisindoSection />

          {/* 4. How It Works (Step by Step) */}
          <HowItWorks />

          {/* 5. News & Education Articles */}
          <NewsSection />

          {/* 6. Community Milestones Timeline */}
          <TimelineSection />

          {/* 7. Community Activities & Testimonials */}
          <CommunitySection />

          {/* 8. About Us, Vision & Mission */}
          <AboutSection />
        </main>
      )}

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
