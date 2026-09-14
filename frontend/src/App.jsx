import React, { useState, useEffect } from 'react';
import { useThemeStore } from './stores/useThemeStore';
import { useAuthStore } from './stores/useAuthStore';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HeroSection from './components/landing/HeroSection';
import BentoFeatures from './components/landing/BentoFeatures';
import SibiBisindoSection from './components/landing/SibiBisindoSection';
import HowItWorks from './components/landing/HowItWorks';
import NewsSection from './components/landing/NewsSection';
import TimelineSection from './components/landing/TimelineSection';
import CommunitySection from './components/landing/CommunitySection';
import AboutSection from './components/landing/AboutSection';
import TranslatorPage from './components/translator/TranslatorPage';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLoginPage from './components/admin/AdminLoginPage';

// Helper to determine initial view based on browser URL pathname
const getViewFromPath = () => {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
  if (path === '/penerjemah' || path === '/translator') return 'translator';
  if (path === '/admin') return 'admin';
  return 'home';
};

export default function App() {
  const { theme } = useThemeStore();
  const { isAuthenticated } = useAuthStore();
  const [currentView, setCurrentView] = useState(getViewFromPath);

  // Sync with browser Back/Forward (popstate) navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(getViewFromPath());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Apply dark mode class on mount & theme change
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleNavigate = (sectionId) => {
    if (sectionId === 'admin') {
      if (window.location.pathname !== '/admin') {
        window.history.pushState({}, '', '/admin');
      }
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'translator') {
      if (window.location.pathname !== '/penerjemah') {
        window.history.pushState({}, '', '/penerjemah');
      }
      setCurrentView('translator');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Navigating back to home or scrolling to a section on home
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    setCurrentView('home');

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

  // If Admin View is active - gate behind authentication
  if (currentView === 'admin') {
    if (!isAuthenticated) {
      return <AdminLoginPage onBackToHome={() => handleNavigate('home')} onLoginSuccess={() => setCurrentView('admin')} />;
    }
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
