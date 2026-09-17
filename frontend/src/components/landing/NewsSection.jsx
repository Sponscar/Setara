/**
 * ==============================================================================
 * File: NewsSection.jsx
 * Direktori: src/components/landing/
 * Deskripsi: Section Wawasan & Berita Terkini pada Landing Page SETARA.
 *            Menampilkan artikel edukatif seputar bahasa isyarat, disabilitas, teknologi AI,
 *            dan agenda komunitas dengan filter kategori dinamis serta modal baca artikel lengkap.
 * Pattern:
 *   - Repository Pattern Integration: Mengambil `newsList` dari `useContentStore`.
 *   - Controlled Filter Pattern: Filter kategori lokal ('Semua', 'Edukasi', 'Teknologi', dll).
 *   - Portal Pattern (React DOM createPortal): Menampilkan modal detail berita langsung
 *     di root `document.body` dengan scroll lock dan penanganan tombol Escape.
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useContentStore } from '../../stores/useContentStore';
import { api } from '../../services/api';
import { 
  Newspaper, 
  Clock, 
  Eye, 
  ArrowRight, 
  Sparkles, 
  Filter, 
  X, 
  Share2 
} from 'lucide-react';

/**
 * Helper untuk membersihkan tag HTML agar teks tampil bersih
 */
const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').trim();
};

/**
 * Komponen Section Berita & Wawasan Terkini.
 */
export default function NewsSection() {
  /* ===================================================================
   * 1. ZUSTAND STORE SELECTORS & LOCAL STATE
   * =================================================================== */

  /** Daftar artikel berita dari CMS global store */
  const { newsList, fetchNews, isLoading } = useContentStore();

  useEffect(() => {
    fetchNews(false);
  }, []);

  /** Kategori aktif yang dipilih pengguna untuk memfilter berita */
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  /** Objek berita yang sedang dibuka dalam modal pop-up (null jika tertutup) */
  const [activeNewsModal, setActiveNewsModal] = useState(null);

  /** Daftar kategori artikel yang tersedia */
  const categories = ['Semua', 'Edukasi', 'Teknologi', 'Komunitas', 'Event'];

  /* ===================================================================
   * 2. SIDE EFFECTS - Body Scroll Lock & Keyboard Handler (ESC)
   * =================================================================== */

  /** Mengunci scrollbar halaman ketika modal detail berita terbuka */
  useEffect(() => {
    if (activeNewsModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeNewsModal]);

  /** Menutup modal detail berita saat tombol ESC ditekan */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeNewsModal) {
        setActiveNewsModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeNewsModal]);

  /**
   * Membuka modal detail berita dan memastikan konten lengkap tersedia
   */
  const handleOpenNewsModal = async (news) => {
    setActiveNewsModal(news);

    // Jika konten lengkap belum dimuat di store, fetch detailnya langsung dari REST API
    if (!news.konten) {
      try {
        const detail = await api.get(`/berita/${news.id}`);
        if (detail && (detail.konten || detail.ringkasan)) {
          setActiveNewsModal((prev) => 
            prev && prev.id === news.id ? { ...prev, ...detail } : prev
          );
        }
      } catch (err) {
        // Gunakan ringkasan yang ada sebagai fallback
      }
    }
  };

  /* ===================================================================
   * 3. DATA COMPUTATION - Filter Berita Berdasarkan Kategori
   * =================================================================== */

  const filteredNews = selectedCategory === 'Semua'
    ? newsList
    : newsList.filter(n => n.kategori && n.kategori.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section id="berita" className="py-16 md:py-20 relative scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===================================================================
         * 4. SECTION HEADER & CATEGORY FILTER PILLS
         * =================================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              <Newspaper className="w-3.5 h-3.5" />
              <span>Wawasan & Berita Terkini</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Kabar Bahasa Isyarat & Inklusivitas
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Artikel edukatif, pembaruan teknologi AI, dan agenda komunitas di seluruh Indonesia.
            </p>
          </div>

          {/* Filter Pills Kategori */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ===================================================================
         * 5. NEWS CARDS GRID - Daftar Artikel Terbit
         * =================================================================== */}
        {isLoading && newsList.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-3xl glass-card border border-slate-200 dark:border-dark-border overflow-hidden animate-pulse">
                <div className="aspect-[16/10] w-full bg-slate-200 dark:bg-slate-800"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-4/5"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredNews.map((news) => (
              <div
                key={news.id}
                onClick={() => handleOpenNewsModal(news)}
                className="rounded-3xl glass-card border border-slate-200 dark:border-dark-border overflow-hidden hover:border-brand-500/60 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer group"
              >
                {/* Thumbnail */}
                <div className="aspect-[16/10] w-full overflow-hidden relative">
                  <img
                    src={news.thumbnail}
                    alt={news.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[11px] font-bold backdrop-blur-md border ${news.kategoriBadge || 'bg-brand-500/20 text-brand-400 border-brand-500/30'}`}>
                    {news.kategori}
                  </span>
                </div>

                {/* Content Box */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {news.waktuBaca || '4 menit'}
                      </span>
                      <span>&bull;</span>
                      <span>{news.tanggal}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-brand-500 transition-colors">
                      {news.judul}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {stripHtml(news.ringkasan) || stripHtml(news.konten) || 'Tidak ada ringkasan.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-brand-600 dark:text-brand-400">
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===================================================================
         * 6. NEWS DETAIL MODAL (PORTAL TO DOCUMENT.BODY)
         * =================================================================== */}
        {activeNewsModal && typeof document !== 'undefined' && createPortal(
          <div 
            onClick={(e) => {
              if (e.target === e.currentTarget) setActiveNewsModal(null);
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto"
          >
            <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 sm:p-8 shadow-2xl space-y-5 my-auto max-h-[90vh] overflow-y-auto animate-page-enter">
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveNewsModal(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
                title="Tutup Modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-3 pr-6">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                  {activeNewsModal.kategori}
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {activeNewsModal.judul}
                </h3>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>Penulis: {activeNewsModal.author || activeNewsModal.author_name}</span>
                  <span>&bull;</span>
                  <span>{activeNewsModal.tanggal}</span>
                  {activeNewsModal.views !== undefined && (
                    <>
                      <span>&bull;</span>
                      <span>{activeNewsModal.views} Pembaca</span>
                    </>
                  )}
                </div>
              </div>

              {/* Image */}
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={activeNewsModal.thumbnail}
                  alt={activeNewsModal.judul}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Ringkasan Singkat (Lead Highlight Box) */}
              {activeNewsModal.ringkasan && (
                <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{stripHtml(activeNewsModal.ringkasan)}"
                </div>
              )}

              {/* Konten Lengkap */}
              <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 whitespace-pre-line max-h-[260px] overflow-y-auto pr-2">
                {stripHtml(activeNewsModal.konten) || stripHtml(activeNewsModal.ringkasan) || 'Belum ada konten lengkap untuk artikel ini.'}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Platform Bahasa Isyarat SETARA</span>
                <button
                  onClick={() => setActiveNewsModal(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </section>
  );
}
