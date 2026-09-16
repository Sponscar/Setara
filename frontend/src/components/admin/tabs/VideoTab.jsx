/**
 * ==============================================================================
 * File: VideoTab.jsx
 * Direktori: src/components/admin/tabs/
 * Deskripsi: Tab Manajemen Kosakata & Animasi Isyarat Kamus (Dictionary Video CMS).
 * Pattern: Controlled Component Pattern untuk input kata/frasa baru &
 *          Integrasi dengan model gesture pattern engine SETARA.
 * ==============================================================================
 */

import React, { useState } from 'react';
import { Plus, Upload, Trash2 } from 'lucide-react';

/**
 * Komponen Tab Manajemen Kosakata & Video Isyarat.
 * 
 * @param {Object} props
 * @param {Array} props.customVideos - Daftar kosakata isyarat kustom buatan admin
 * @param {Function} props.addCustomVideo - Aksi store untuk menambahkan kata isyarat baru
 * @param {Function} props.deleteCustomVideo - Aksi store untuk menghapus kata isyarat
 * @param {Function} props.showToast - Fungsi menampilkan notifikasi toast
 */
export default function VideoTab({
  customVideos = [],
  addCustomVideo,
  deleteCustomVideo,
  showToast
}) {
  // State formulir pembuatan kosakata isyarat baru
  const [videoForm, setVideoForm] = useState({
    kata: '',
    tipe_bahasa: 'BISINDO',
    kategori: 'Umum',
    gesture_pattern: 'hand_wave_forehead',
    deskripsi_gerakan: ''
  });

  /**
   * Handler submit formulir penambahan kosakata isyarat baru
   */
  const handleCreateVideo = (e) => {
    e.preventDefault();
    if (!videoForm.kata.trim()) return;

    // Simpan ke store
    addCustomVideo(videoForm);

    // Reset form
    setVideoForm({
      kata: '',
      tipe_bahasa: 'BISINDO',
      kategori: 'Umum',
      gesture_pattern: 'hand_wave_forehead',
      deskripsi_gerakan: ''
    });

    if (showToast) {
      showToast(`Kosa kata "${videoForm.kata}" berhasil ditambahkan ke kamus.`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* ======================================================================= */}
      {/* 1. FORMULIR PENAMBAHAN KATA ISYARAT BARU (Kiri / 5 Kolom)               */}
      {/* ======================================================================= */}
      <div className="lg:col-span-5 p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-500" />
          <span>Tambah Isyarat Kamus Baru</span>
        </h3>

        <form onSubmit={handleCreateVideo} className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
          {/* Kata / Frasa Input */}
          <div>
            <label className="font-semibold block mb-1">Kata / Frasa *</label>
            <input
              type="text"
              required
              value={videoForm.kata}
              onChange={(e) => setVideoForm({ ...videoForm, kata: e.target.value.toLowerCase() })}
              placeholder="Contoh: semangat, terima kasih"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Grid Tipe Bahasa & Kategori */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Tipe Bahasa *</label>
              <select
                value={videoForm.tipe_bahasa}
                onChange={(e) => setVideoForm({ ...videoForm, tipe_bahasa: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="BISINDO">BISINDO</option>
                <option value="SIBI">SIBI</option>
                <option value="BOTH">Keduanya (BOTH)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1">Kategori</label>
              <input
                type="text"
                value={videoForm.kategori}
                onChange={(e) => setVideoForm({ ...videoForm, kategori: e.target.value })}
                placeholder="Contoh: Sapaan"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Pola Animasi Gestur (Engine) */}
          <div>
            <label className="font-semibold block mb-1">Pola Animasi Gestur (Engine) *</label>
            <select
              value={videoForm.gesture_pattern}
              onChange={(e) => setVideoForm({ ...videoForm, gesture_pattern: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="hand_wave_forehead">hand_wave_forehead (Melambai)</option>
              <option value="point_chest">point_chest (Menunjuk Dada)</option>
              <option value="palm_chest">palm_chest (Telapak Dada Sopan)</option>
              <option value="fist_pump_down">fist_pump_down (Mengepal Semangat)</option>
              <option value="two_hand_open_cross">two_hand_open_cross (Dua Tangan Terbuka)</option>
              <option value="equal_parallel_hands">equal_parallel_hands (Tangan Sejajar)</option>
            </select>
          </div>

          {/* Deskripsi Gerakan */}
          <div>
            <label className="font-semibold block mb-1">Deskripsi Gerakan</label>
            <textarea
              rows="2"
              value={videoForm.deskripsi_gerakan}
              onChange={(e) => setVideoForm({ ...videoForm, deskripsi_gerakan: e.target.value })}
              placeholder="Panduan visual gerakan tangan..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Tombol Simpan */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Upload className="w-4 h-4" />
            <span>Tambahkan ke Kamus</span>
          </button>
        </form>
      </div>

      {/* ======================================================================= */}
      {/* 2. DAFTAR KOSAKATA KUSTOM ADMIN (Kanan / 7 Kolom)                      */}
      {/* ======================================================================= */}
      <div className="lg:col-span-7 p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Kosa Kata Kustom Admin ({customVideos.length})
        </h3>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {customVideos.length > 0 ? (
            customVideos.map((v) => (
              <div 
                key={v.id} 
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 text-xs"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 dark:text-white uppercase">{v.kata}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-400">
                      {v.tipe_bahasa}
                    </span>
                  </div>
                  <p className="text-slate-400">{v.deskripsi_gerakan || 'Gerakan standar simulasi visual.'}</p>
                  <div className="text-[10px] text-slate-400 font-mono">Pattern: {v.gesture_pattern}</div>
                </div>

                {/* Tombol Hapus Kosakata */}
                <button
                  type="button"
                  onClick={() => {
                    deleteCustomVideo(v.id);
                    if (showToast) showToast(`Kosa kata "${v.kata}" dihapus.`);
                  }}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 cursor-pointer shrink-0 transition-colors"
                  title="Hapus kata dari kamus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Belum ada kosa kata kustom yang ditambahkan oleh Admin. Kamus bawaan tetap aktif dengan 24 kata dasar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
