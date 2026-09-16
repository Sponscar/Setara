/**
 * ==============================================================================
 * File: OverviewTab.jsx
 * Direktori: src/components/admin/tabs/
 * Deskripsi: Tab Ringkasan / Overview Dashboard Administrator SETARA.
 * Fitur:
 *   - Menampilkan card statistik metrik utama (Berita, Kosakata Isyarat, Milestone, Komunitas).
 *   - Menampilkan widget cuplikan berita terbaru yang telah terbit.
 *   - Menampilkan antrean pengajuan komunitas baru (moderasi cepat: Terima/Tolak).
 * ==============================================================================
 */

import React from 'react';
import { Check, X } from 'lucide-react';

/**
 * Komponen Tab Ringkasan (Overview).
 * 
 * @param {Object} props
 * @param {Array} props.newsList - Daftar seluruh berita terbit
 * @param {Array} props.customVideos - Daftar video isyarat tambahan admin
 * @param {Array} props.timelineList - Daftar milestone linimasa
 * @param {Array} props.communityList - Daftar seluruh komunitas (approved & pending)
 * @param {Function} props.setActiveTab - Fungsi pengalih tab aktif di dashboard
 * @param {Function} props.approveCommunity - Fungsi menyetujui pengajuan komunitas
 * @param {Function} props.rejectCommunity - Fungsi menolak pengajuan komunitas
 * @param {Function} props.showToast - Fungsi menampilkan notifikasi toast interaktif
 */
export default function OverviewTab({
  newsList = [],
  customVideos = [],
  timelineList = [],
  communityList = [],
  setActiveTab,
  approveCommunity,
  rejectCommunity,
  showToast
}) {
  // Hitung jumlah komunitas terverifikasi dan menunggu moderasi
  const approvedCommunities = communityList.filter((c) => c.status === 'approved');
  const pendingCommunities = communityList.filter((c) => c.status === 'pending');

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. KARTU STATISTIK METRIK UTAMA                                          */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metrik Berita */}
        <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Berita Terbit</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{newsList.length}</div>
          <div className="text-[11px] text-amber-500 font-semibold">4 Kategori Aktif</div>
        </div>

        {/* Metrik Kamus Isyarat */}
        <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-1">
          <span className="text-xs text-slate-400 font-medium">Kosa Kata Kamus</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {24 + customVideos.length} Kata
          </div>
          <div className="text-[11px] text-brand-400 font-semibold">SIBI & BISINDO Ready</div>
        </div>

        {/* Metrik Milestone Timeline */}
        <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-1">
          <span className="text-xs text-slate-400 font-medium">Milestone Timeline</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{timelineList.length}</div>
          <div className="text-[11px] text-purple-400 font-semibold">Jejak Perkembangan</div>
        </div>

        {/* Metrik Komunitas */}
        <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-1">
          <span className="text-xs text-slate-400 font-medium">Komunitas Terdaftar</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {approvedCommunities.length}
          </div>
          <div className="text-[11px] text-amber-400 font-semibold">
            {pendingCommunities.length} Menunggu Persetujuan
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CUPLIKAN AKTIVITAS TERBARU                                             */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Widget Berita Terbaru */}
        <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Daftar Berita Terbaru
            </h3>
            <button 
              type="button"
              onClick={() => setActiveTab('berita')} 
              className="text-brand-500 text-xs font-semibold hover:underline cursor-pointer"
            >
              Kelola
            </button>
          </div>
          <div className="space-y-2">
            {newsList.slice(0, 3).map((n) => (
              <div 
                key={n.id} 
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{n.judul}</div>
                  <div className="text-[11px] text-slate-400">{n.kategori} • {n.tanggal}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 shrink-0">
                  Terbit
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Widget Pengajuan Komunitas Baru (Moderasi Cepat) */}
        <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Pengajuan Komunitas Baru
            </h3>
            <button 
              type="button"
              onClick={() => setActiveTab('komunitas')} 
              className="text-amber-500 text-xs font-semibold hover:underline cursor-pointer"
            >
              Kelola
            </button>
          </div>
          <div className="space-y-2">
            {pendingCommunities.length > 0 ? (
              pendingCommunities.slice(0, 3).map((c) => (
                <div 
                  key={c.id} 
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{c.nama}</div>
                    <div className="text-[11px] text-slate-400 truncate">{c.platform} • PIC: {c.kontak}</div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        approveCommunity(c.id);
                        showToast(`Komunitas "${c.nama}" telah disetujui.`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                      title="Setujui komunitas"
                    >
                      <Check className="w-3 h-3" />
                      <span>Terima</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        rejectCommunity(c.id);
                        showToast(`Pengajuan "${c.nama}" ditolak.`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                      title="Tolak pengajuan"
                    >
                      <X className="w-3 h-3" />
                      <span>Tolak</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-slate-400">
                Tidak ada pengajuan komunitas yang menunggu persetujuan.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
