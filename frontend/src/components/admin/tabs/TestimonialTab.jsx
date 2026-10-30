/**
 * ==============================================================================
 * File: TestimonialTab.jsx
 * Direktori: src/components/admin/tabs/
 * Deskripsi: Tab Cerita & Pengalaman Komunitas pada Admin Dashboard SETARA.
 * Menampilkan sharing cerita & pengalaman pengguna platform SETARA (tanpa rating).
 * ==============================================================================
 */

import React, { useState } from 'react';
import {
  MessageSquareQuote,
  Trash2,
  Search,
  UserCircle2,
  X,
  Check,
  Loader2,
  Sparkles
} from 'lucide-react';

/**
 * Komponen utama TestimonialTab (Mode View & Moderasi/Hapus Pengalaman Komunitas)
 *
 * @param {Object} props
 * @param {Array}    props.testimonialList - Daftar cerita & pengalaman pengguna dari store
 * @param {Function} props.deleteTestimonial - Action hapus cerita pengalaman
 * @param {Function} props.showToast - Callback notifikasi toast interaktif
 */
export default function TestimonialTab({
  testimonialList = [],
  deleteTestimonial,
  showToast
}) {
  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // --- Filter Pencarian Pengalaman ---
  const filtered = testimonialList.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      (t.nama || '').toLowerCase().includes(q) ||
      (t.peran || '').toLowerCase().includes(q) ||
      (t.konten || t.komentar || '').toLowerCase().includes(q)
    );
  });

  // --- Handlers ---
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await deleteTestimonial(id);
      if (res?.success !== false) {
        showToast('Pengalaman komunitas berhasil dihapus.');
      } else {
        showToast(res?.error || 'Gagal menghapus pengalaman.');
      }
    } catch {
      showToast('Terjadi kesalahan saat menghapus.');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const totalActive = testimonialList.filter((t) => t.is_active !== false).length;

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquareQuote className="w-5 h-5 text-brand-600" />
            Cerita & Pengalaman Komunitas
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Sharing pengalaman dan suara inspiratif dari pengguna selama menggunakan website SETARA
          </p>
        </div>
      </div>

      {/* ===== STATS METRICS (Tanpa Rating) ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Total Pengalaman Dibagikan
            </p>
            <p className="text-2xl font-black text-brand-600 dark:text-brand-400 mt-0.5">
              {testimonialList.length} Cerita
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <MessageSquareQuote className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Aktif Ditampilkan di Web
            </p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {totalActive} Cerita
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ===== SEARCH INPUT ===== */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari berdasarkan nama, peran, atau cuplikan pengalaman..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition shadow-xs"
        />
      </div>

      {/* ===== DAFTAR CERITA & PENGALAMAN ===== */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-dark-card rounded-3xl border border-slate-200 dark:border-dark-border p-8">
          <MessageSquareQuote className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
            {searchQuery
              ? 'Tidak ada cerita pengalaman yang cocok dengan pencarian.'
              : 'Belum ada sharing pengalaman komunitas yang masuk.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((t) => {
            const isDeleting = deletingId === t.id;
            const isConfirmDelete = confirmDeleteId === t.id;

            return (
              <div
                key={t.id}
                className={`group bg-white dark:bg-dark-card border rounded-2xl p-5 transition-all duration-200 hover:shadow-md flex flex-col justify-between ${
                  t.is_active === false
                    ? 'border-slate-200 dark:border-dark-border opacity-60'
                    : 'border-slate-200 dark:border-dark-border hover:border-brand-300 dark:hover:border-brand-700'
                }`}
              >
                <div>
                  {/* Top: Avatar + Info + Actions */}
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="shrink-0">
                      {t.avatar || t.avatar_url ? (
                        <img
                          src={t.avatar || t.avatar_url}
                          alt={t.nama}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-brand-500/20"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.nextSibling) {
                              e.currentTarget.nextSibling.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div
                        className="w-11 h-11 rounded-full bg-brand-100 dark:bg-brand-900/30 items-center justify-center"
                        style={{
                          display: t.avatar || t.avatar_url ? 'none' : 'flex'
                        }}
                      >
                        <UserCircle2 className="w-6 h-6 text-brand-500" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                            {t.nama}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {t.peran || 'Pengguna SETARA'}
                          </p>
                        </div>
                        {/* Status badge */}
                        {t.is_active === false && (
                          <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                            Nonaktif
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons (Hapus / Moderasi) */}
                    <div className="flex items-center gap-1 shrink-0">
                      {isConfirmDelete ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDelete(t.id)}
                            disabled={isDeleting}
                            className="p-1.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                            title="Konfirmasi hapus cerita"
                          >
                            {isDeleting ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Batal"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(t.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                          title="Hapus cerita pengalaman"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Isi Pengalaman / Kutipan */}
                  <blockquote className="mt-3 text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic border-l-2 border-brand-500 pl-3.5">
                    "{t.konten || t.komentar}"
                  </blockquote>
                </div>

                {/* Footer: Tanggal posting */}
                {t.created_at && (
                  <p className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400 dark:text-slate-500">
                    Dibagikan pada{' '}
                    {new Date(t.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
