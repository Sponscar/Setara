import React, { useState } from 'react';
import { useContentStore } from '../../stores/useContentStore';
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

export default function NewsSection() {
  const { newsList } = useContentStore();
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [activeNewsModal, setActiveNewsModal] = useState(null);

  const categories = ['Semua', 'Edukasi', 'Teknologi', 'Komunitas', 'Event'];

  const filteredNews = selectedCategory === 'Semua'
    ? newsList
    : newsList.filter(n => n.kategori.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section id="berita" className="py-16 md:py-20 relative scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
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

          {/* Category Filter Pills */}
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

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredNews.map((news) => (
            <div
              key={news.id}
              onClick={() => setActiveNewsModal(news)}
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
                    <span>•</span>
                    <span>{news.tanggal}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-brand-500 transition-colors">
                    {news.judul}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {news.ringkasan}
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

        {/* News Detail Modal */}
        {activeNewsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 sm:p-8 shadow-2xl space-y-5 my-8">
              {/* Close Button */}
              <button
                onClick={() => setActiveNewsModal(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                  {activeNewsModal.kategori}
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white pr-8">
                  {activeNewsModal.judul}
                </h3>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>Penulis: {activeNewsModal.author}</span>
                  <span>•</span>
                  <span>{activeNewsModal.tanggal}</span>
                  <span>•</span>
                  <span>{activeNewsModal.views} Pembaca</span>
                </div>
              </div>

              {/* Image */}
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden">
                <img
                  src={activeNewsModal.thumbnail}
                  alt={activeNewsModal.judul}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 whitespace-pre-line max-h-[250px] overflow-y-auto pr-2">
                {activeNewsModal.konten}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Platform Bahasa Isyarat SETARA</span>
                <button
                  onClick={() => setActiveNewsModal(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
