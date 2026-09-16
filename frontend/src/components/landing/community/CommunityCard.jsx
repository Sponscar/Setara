/**
 * ==============================================================================
 * File: CommunityCard.jsx
 * Direktori: src/components/landing/community/
 * Deskripsi: Komponen kartu interaktif untuk menampilkan ringkasan profil komunitas
 *            terverifikasi di landing page SETARA.
 * Pattern: Presentational Component Pattern dengan hover mikro-animasi.
 * ==============================================================================
 */

import React from 'react';
import { Users, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { getPlatformMeta } from '../../helpers/communityHelpers';

/**
 * Komponen Kartu Komunitas.
 * 
 * @param {Object} props
 * @param {Object} props.community - Objek data komunitas
 * @param {Function} props.onClick - Callback saat card diklik untuk membuka modal detail
 */
export default function CommunityCard({ community, onClick }) {
  // Ambil metadata platform (icon & styling badge)
  const meta = getPlatformMeta(community.platform);
  const PlatformIcon = meta.icon;

  return (
    <div
      onClick={onClick}
      className="group relative p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border hover:border-brand-500/40 dark:hover:border-brand-500/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="space-y-4">
        {/* Bagian Atas: Logo Komunitas, Badge Platform, & Kategori */}
        <div className="flex items-start justify-between gap-3">
          <div className="relative">
            <img
              src={community.logo}
              alt={community.nama}
              className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-md group-hover:scale-105 transition-transform"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=200&q=80';
              }}
            />
            {/* Lencana Terverifikasi */}
            <div 
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center text-[10px] shadow"
              title="Komunitas Terverifikasi"
            >
              <ShieldCheck className="w-3 h-3" />
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${meta.badgeClass}`}>
              <PlatformIcon className="w-3 h-3" />
              <span>{community.platform || 'Komunitas'}</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              {community.kategori}
            </span>
          </div>
        </div>

        {/* Nama Komunitas & Deskripsi Singkat */}
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
            {community.nama}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {community.deskripsi}
          </p>
        </div>
      </div>

      {/* Bagian Bawah: Jumlah Anggota & Indikator Aksi Klik */}
      <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
          <Users className="w-3.5 h-3.5 text-brand-500" />
          <span>{community.anggota || 'Komunitas Aktif'}</span>
        </div>

        <div className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 font-bold group-hover:translate-x-1 transition-transform">
          <span>Lihat Detail</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
