/**
 * @file HeroSection.jsx
 * @description Section hero banner utama landing page SETARA dengan Interactive Particle Logo.
 * @module HeroSection
 */

import React, { useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2, Layers } from 'lucide-react';
import ParticleSlider from './ParticleSlider';

// ─── Interactive Particle Logo Slider ─────────────────────────────────────────
function ParticleLogoInteractive() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    var isMobile = typeof navigator !== 'undefined' &&
      navigator.userAgent &&
      navigator.userAgent.toLowerCase().indexOf('mobile') >= 0;

    var ps = new ParticleSlider({
      sliderId: containerRef.current,
      ptlGap: isMobile ? 1 : 0,      // Rapat dan halus
      ptlSize: 1,                    // Ukuran partikel kecil
      width: 480,
      height: 480,
      monochrome: false,             // Warna asli gradasi emas-oranye logo Setara
      mouseForce: 7000,              // Tolakan lembut saat kursor lewat
      restless: true                 // Partikel hidup bergetar halus
    });

    return () => {
      if (ps && typeof ps.destroy === 'function') {
        ps.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400px] sm:h-[460px] max-w-[460px] mx-auto flex items-center justify-center cursor-default select-none overflow-hidden"
    >
      <div className="slides hidden">
        <div
          className="slide"
          data-src="/setara-particle-logo.png"
        />
      </div>
      <canvas
        className="draw"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          background: 'transparent'
        }}
      />
    </div>
  );
}

// ─── HeroSection ─────────────────────────────────────────────────────────────
export default function HeroSection({ onStartTranslate, onExploreEducation }) {
  return (
    <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-36 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Headline & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold shadow-sm">
              <span>Platform Bahasa Isyarat Masa Depan</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Komunikasi Tanpa Batas,{' '}
              <span className="text-brand-600 dark:text-brand-400">
                Setara untuk Semua.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Platform penerjemah bahasa isyarat dua arah berbasis kecerdasan buatan.
              Menerjemahkan <strong>Teks ke Video Peragaan Isyarat</strong> dan{' '}
              <strong>Kamera ke Teks Real-Time</strong> yang mendukung sistem{' '}
              <strong>SIBI</strong> dan <strong>BISINDO</strong>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onStartTranslate}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-brand-600/30 hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
              >
                <span>Coba Penerjemah Sekarang</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>

              <button
                onClick={onExploreEducation}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl glass hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm sm:text-base flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4 text-brand-500" />
                <span>Pelajari SIBI vs BISINDO</span>
              </button>
            </div>
          </div>

          {/* Right Column: Particle Slider Logo */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <ParticleLogoInteractive />
          </div>

        </div>
      </div>
    </section>
  );
}
