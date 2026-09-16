/**
 * ==============================================================================
 * File: CommunitySection.jsx
 * Direktori: src/components/landing/
 * Deskripsi: Section Komunitas pada Landing Page SETARA.
 *            Berperan sebagai "Jembatan Inklusivitas" yang menghubungkan pengguna
 *            dengan berbagai komunitas Tuli, grup belajar isyarat, dan organisasi disabilitas.
 * Pattern:
 *   - Container Component Pattern: Mengelola filter pencarian, kategori, dan state modal.
 *   - Sub-komponen Modular: Didelegasikan ke folder community/ (CommunityCard, Modals, Helpers).
 * ==============================================================================
 */

import React, { useState } from 'react';
import { useContentStore } from '../../stores/useContentStore';
import { 
  Users, 
  Sparkles, 
  PlusCircle, 
  MessageSquare, 
  Search, 
  Filter 
} from 'lucide-react';

// Sub-komponen Modular
import CommunityCard from './community/CommunityCard';
import CommunityDetailModal from './community/CommunityDetailModal';
import SubmitCommunityModal from './community/SubmitCommunityModal';
import SubmitTestimonialModal from './community/SubmitTestimonialModal';

/**
 * Daftar kategori filter komunitas yang tersedia
 */
const CATEGORIES = [
  'Semua',
  'Komunitas Tuli',
  'Belajar Isyarat',
  'Organisasi & Relawan',
  'Advokasi & Inklusi'
];

/**
 * Komponen Section Komunitas & Testimoni pada Beranda.
 */
export default function CommunitySection() {
  // --- 1. GLOBAL STATE DARI ZUSTAND STORE ---
  const { 
    communityList, 
    submitCommunity, 
    testimonialList, 
    addTestimonial 
  } = useContentStore();

  // --- 2. LOCAL STATE FILTER & SEARCH ---
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // --- 3. LOCAL STATE MODAL DIALOGS ---
  // Objek komunitas yang dipilih untuk modal detail
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  // Status visibilitas modal ajukan komunitas baru
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  // Status visibilitas modal formulir testimoni
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);

  // --- 4. FILTERING DATA KOMUNITAS ---
  // Hanya tampilkan komunitas dengan status 'approved' yang sesuai dengan kategori dan query pencarian
  const filteredCommunities = communityList
    .filter((c) => c.status === 'approved')
    .filter((c) => {
      if (selectedCategory === 'Semua') return true;
      return c.kategori.toLowerCase() === selectedCategory.toLowerCase();
    })
    .filter((c) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.nama.toLowerCase().includes(q) ||
        c.deskripsi.toLowerCase().includes(q) ||
        c.platform.toLowerCase().includes(q) ||
        c.kategori.toLowerCase().includes(q)
      );
    });

  return (
    <section id="komunitas" className="py-20 md:py-28 relative scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* ===================================================================== */}
        {/* 1. HEADER SECTION KOMUNITAS                                           */}
        {/* ===================================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              <Users className="w-3.5 h-3.5" />
              <span>Jembatan Inklusivitas Komunitas</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Bergabung dengan <span className="gradient-text-primary">Komunitas Isyarat</span>
            </h2>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              SETARA tidak membangun komunitas tertutup, melainkan menjadi gerbang terbuka untuk menghubungkan Anda dengan ribuan Teman Tuli, relawan, dan pegiat bahasa isyarat di seluruh Indonesia.
            </p>
          </div>

          {/* Tombol CTA Ajukan Komunitas */}
          <button
            type="button"
            onClick={() => setShowSubmitModal(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-brand-500/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 self-start md:self-auto shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Ajukan Komunitas Anda</span>
          </button>
        </div>

        {/* ===================================================================== */}
        {/* 2. FILTER KATEGORI & BILAH PENCARIAN                                 */}
        {/* ===================================================================== */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Filter Pills Kategori */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Input Pencarian Komunitas */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari komunitas atau platform..."
                className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Grid Daftar Kartu Komunitas */}
          {filteredCommunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities.map((com) => (
                <CommunityCard
                  key={com.id}
                  community={com}
                  onClick={() => setSelectedCommunity(com)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 p-8 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-3">
              <Users className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Tidak ada komunitas yang cocok
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Coba gunakan kata kunci pencarian lain atau pilih kategori "Semua" untuk melihat seluruh komunitas yang tersedia.
              </p>
            </div>
          )}
        </div>

        {/* ===================================================================== */}
        {/* 3. TESTIMONI PENGGUNA & CERITA SUARA KOMUNITAS                        */}
        {/* ===================================================================== */}
        <div className="pt-8 border-t border-slate-200/60 dark:border-slate-800 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pengalaman Pengguna</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Cerita & Suara Komunitas
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl mt-1">
                Kesan tulus dari Teman Tuli, relawan, dan para pembelajar yang terbantu oleh platform SETARA.
              </p>
            </div>

            {/* Tombol CTA Tulis Ceritamu */}
            <button
              type="button"
              onClick={() => setShowTestimonialModal(true)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-brand-500 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <MessageSquare className="w-3.5 h-3.5 text-brand-500" />
              <span>Tulis Ceritamu</span>
            </button>
          </div>

          {/* Grid Testimoni */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonialList.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4 flex flex-col justify-between"
              >
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "{item.komentar}"
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <img
                    src={item.avatar}
                    alt={item.nama}
                    className="w-10 h-10 rounded-full object-cover border border-brand-500/30 shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
                    }}
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.nama}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {item.peran}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* 4. MODAL DIALOGS (PORTAL PATTERN)                                      */}
      {/* ======================================================================= */}
      {/* Modal Dialog Detail Komunitas */}
      <CommunityDetailModal
        community={selectedCommunity}
        onClose={() => setSelectedCommunity(null)}
      />

      {/* Modal Dialog Ajukan Komunitas Baru */}
      <SubmitCommunityModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmit={submitCommunity}
      />

      {/* Modal Dialog Tulis Testimoni Pengguna */}
      <SubmitTestimonialModal
        isOpen={showTestimonialModal}
        onClose={() => setShowTestimonialModal(false)}
        onSubmit={addTestimonial}
      />
    </section>
  );
}
