/**
 * ==============================================================================
 * File: TimelineTab.jsx
 * Direktori: src/components/admin/tabs/
 * Deskripsi: Tab Manajemen Milestone Linimasa Sejarah & Pencapaian Platform.
 * Integrasi:
 *   - Terhubung langsung ke API backend Django Ninja (/api/timeline/*).
 *   - Operasi CRUD asynchronous dengan feedback loading & toast notification.
 * ==============================================================================
 */

import React, { useState } from 'react';
import { Plus, Upload, Trash2, Loader2 } from 'lucide-react';

/**
 * Komponen Tab Manajemen Milestone Timeline.
 * 
 * @param {Object} props
 * @param {Array} props.timelineList - Daftar milestone linimasa yang tersimpan
 * @param {Function} props.addTimelineMilestone - Aksi store menambahkan milestone baru
 * @param {Function} props.deleteTimelineMilestone - Aksi store menghapus milestone
 * @param {Function} props.showToast - Fungsi menampilkan notifikasi toast
 */
export default function TimelineTab({
  timelineList = [],
  addTimelineMilestone,
  deleteTimelineMilestone,
  showToast
}) {
  // State formulir pembuatan milestone baru
  const [timelineForm, setTimelineForm] = useState({
    judul: '',
    tanggal: '',
    kategori: 'Pencapaian',
    deskripsi: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  /**
   * Handler submit formulir penambahan milestone baru
   */
  const handleCreateTimeline = async (e) => {
    e.preventDefault();
    if (!timelineForm.judul.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await addTimelineMilestone(timelineForm);
      setIsSubmitting(false);

      if (res && res.success !== false) {
        setTimelineForm({
          judul: '',
          tanggal: '',
          kategori: 'Pencapaian',
          deskripsi: ''
        });
        if (showToast) showToast('Milestone baru berhasil ditambahkan ke linimasa.');
      } else if (showToast) {
        showToast(res?.error || 'Gagal menambahkan milestone.');
      }
    } catch (err) {
      setIsSubmitting(false);
      if (showToast) showToast('Terjadi kesalahan saat menyimpan milestone.');
    }
  };

  /**
   * Handler hapus milestone
   */
  const handleDeleteTimeline = async (id, judul) => {
    setDeletingId(id);
    try {
      const res = await deleteTimelineMilestone(id);
      setDeletingId(null);
      if (res && res.success !== false) {
        if (showToast) showToast(`Milestone "${judul || 'terpilih'}" berhasil dihapus.`);
      } else if (showToast) {
        showToast(res?.error || 'Gagal menghapus milestone.');
      }
    } catch (err) {
      setDeletingId(null);
      if (showToast) showToast('Terjadi kesalahan saat menghapus milestone.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* ======================================================================= */}
      {/* 1. FORMULIR TAMBAH MILESTONE BARU (Kiri / 5 Kolom)                      */}
      {/* ======================================================================= */}
      <div className="lg:col-span-5 p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-purple-500" />
          <span>Tambah Milestone Baru</span>
        </h3>

        <form onSubmit={handleCreateTimeline} className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
          {/* Judul Milestone */}
          <div>
            <label className="font-semibold block mb-1">Judul Milestone *</label>
            <input
              type="text"
              required
              disabled={isSubmitting}
              value={timelineForm.judul}
              onChange={(e) => setTimelineForm({ ...timelineForm, judul: e.target.value })}
              placeholder="Contoh: Rilis Model YOLO 11 v2"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
            />
          </div>

          {/* Grid Waktu & Kategori */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Waktu / Bulan</label>
              <input
                type="text"
                disabled={isSubmitting}
                value={timelineForm.tanggal}
                onChange={(e) => setTimelineForm({ ...timelineForm, tanggal: e.target.value })}
                placeholder="Contoh: Oktober 2026"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Kategori</label>
              <input
                type="text"
                disabled={isSubmitting}
                value={timelineForm.kategori}
                onChange={(e) => setTimelineForm({ ...timelineForm, kategori: e.target.value })}
                placeholder="Contoh: Inovasi AI"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Deskripsi Milestone */}
          <div>
            <label className="font-semibold block mb-1">Deskripsi Milestone</label>
            <textarea
              rows="3"
              disabled={isSubmitting}
              value={timelineForm.deskripsi}
              onChange={(e) => setTimelineForm({ ...timelineForm, deskripsi: e.target.value })}
              placeholder="Penjelasan pencapaian penting..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
            />
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-purple-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan ke Database...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Tambahkan Milestone</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* ======================================================================= */}
      {/* 2. DAFTAR MILESTONE AKTIF (Kanan / 7 Kolom)                             */}
      {/* ======================================================================= */}
      <div className="lg:col-span-7 p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Daftar Milestone ({timelineList.length})
        </h3>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {timelineList.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Belum ada milestone yang tercatat di linimasa.
            </div>
          ) : (
            timelineList.map((t) => (
              <div 
                key={t.id} 
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 text-xs"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 dark:text-white">{t.judul}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({t.tanggal})</span>
                    {t.kategori && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20 font-medium">
                        {t.kategori}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400">{t.deskripsi}</p>
                </div>

                {/* Tombol Hapus Milestone */}
                <button
                  type="button"
                  disabled={deletingId === t.id}
                  onClick={() => handleDeleteTimeline(t.id, t.judul)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 cursor-pointer shrink-0 transition-colors disabled:opacity-50"
                  title="Hapus milestone"
                >
                  {deletingId === t.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
