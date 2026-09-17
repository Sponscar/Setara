/**
 * ==============================================================================
 * File: NewsTab.jsx
 * Direktori: src/components/admin/tabs/
 * Deskripsi: Tab Manajemen Berita & Artikel Edukasi pada Dashboard Admin.
 * Integrasi:
 *   - Terhubung langsung ke API backend Django Ninja (/api/berita/*).
 *   - Operasi CRUD asynchronous dengan feedback loading & toast notification.
 * ==============================================================================
 */

import React, { useState } from 'react';
import { Plus, Upload, Trash2 } from 'lucide-react';

export default function NewsTab({
  newsList = [],
  addNews,
  deleteNews,
  showToast
}) {
  const [newsForm, setNewsForm] = useState({
    judul: '',
    kategori: 'Edukasi',
    ringkasan: '',
    author: 'Tim Redaksi SETARA',
    konten: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateNews = async (e) => {
    e.preventDefault();
    if (!newsForm.judul.trim() || !newsForm.ringkasan.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await addNews(newsForm);
      setIsSubmitting(false);

      if (res && res.success !== false) {
        setNewsForm({
          judul: '',
          kategori: 'Edukasi',
          ringkasan: '',
          author: 'Tim Redaksi SETARA',
          konten: ''
        });
        if (showToast) showToast('Berita baru berhasil diterbitkan ke database.');
      } else if (showToast) {
        showToast(res?.error || 'Gagal menerbitkan berita.');
      }
    } catch (err) {
      setIsSubmitting(false);
      if (showToast) showToast('Terjadi kesalahan saat menyimpan berita.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* ======================================================================= */}
      {/* 1. FORMULIR PUBLIKASI BERITA BARU (Kiri / 5 Kolom)                     */}
      {/* ======================================================================= */}
      <div className="lg:col-span-5 p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-brand-500" />
          <span>Publikasikan Berita Baru</span>
        </h3>

        <form onSubmit={handleCreateNews} className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
          {/* Judul Artikel */}
          <div>
            <label className="font-semibold block mb-1">Judul Artikel *</label>
            <input
              type="text"
              required
              value={newsForm.judul}
              onChange={(e) => setNewsForm({ ...newsForm, judul: e.target.value })}
              placeholder="Contoh: Terobosan Isyarat 2026"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Kategori & Penulis */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Kategori *</label>
              <select
                value={newsForm.kategori}
                onChange={(e) => setNewsForm({ ...newsForm, kategori: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                <option value="Edukasi">Edukasi</option>
                <option value="Teknologi">Teknologi</option>
                <option value="Event">Event</option>
                <option value="Budaya Tuli">Budaya Tuli</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1">Penulis</label>
              <input
                type="text"
                value={newsForm.author}
                onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Ringkasan Singkat */}
          <div>
            <label className="font-semibold block mb-1">Ringkasan Singkat *</label>
            <textarea
              rows="2"
              required
              value={newsForm.ringkasan}
              onChange={(e) => setNewsForm({ ...newsForm, ringkasan: e.target.value })}
              placeholder="Ringkasan 1-2 kalimat..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Konten Lengkap */}
          <div>
            <label className="font-semibold block mb-1">Konten Lengkap</label>
            <textarea
              rows="5"
              value={newsForm.konten}
              onChange={(e) => setNewsForm({ ...newsForm, konten: e.target.value })}
              placeholder="Isi berita lengkap..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-[11px] focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Tombol Terbitkan */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-brand-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>{isSubmitting ? 'Menerbitkan...' : 'Terbitkan Berita'}</span>
          </button>
        </form>
      </div>

      {/* ======================================================================= */}
      {/* 2. DAFTAR BERITA AKTIF (Kanan / 7 Kolom)                                */}
      {/* ======================================================================= */}
      <div className="lg:col-span-7 p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
          <span>Daftar Berita Database ({newsList.length})</span>
          <span className="text-xs font-normal text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full border border-brand-500/20">
            PostgreSQL Active
          </span>
        </h3>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {newsList.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">
              Belum ada berita yang diterbitkan.
            </div>
          ) : (
            newsList.map((n) => (
              <div 
                key={n.id} 
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 text-xs hover:border-brand-500/40 transition-colors"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 dark:text-white">{n.judul}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-500 shrink-0">
                      {n.kategori}
                    </span>
                  </div>
                  <p className="text-slate-400 line-clamp-2">{n.ringkasan}</p>
                  <div className="text-[10px] text-slate-400">Oleh {n.author} &bull; {n.tanggal}</div>
                </div>

                {/* Tombol Hapus Berita */}
                <button
                  type="button"
                  onClick={async () => {
                    await deleteNews(n.id);
                    if (showToast) showToast('Berita berhasil dihapus dari database.');
                  }}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 cursor-pointer shrink-0 transition-colors"
                  title="Hapus berita"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}