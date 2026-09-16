/**
 * ==============================================================================
 * File: CommunityDetailModal.jsx
 * Direktori: src/components/landing/community/
 * Deskripsi: Modal dialog pop-up untuk menampilkan informasi lengkap komunitas
 *            terverifikasi beserta tautan langsung untuk bergabung.
 * Pattern: Portal Pattern (createPortal) untuk render di luar root DOM tree.
 * ==============================================================================
 */

import React from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Users, 
  User, 
  Mail, 
  ArrowUpRight 
} from 'lucide-react';
import { getPlatformMeta } from '../../utils/communityHelpers';

/**
 * Komponen Modal Dialog Detail Komunitas.
 * 
 * @param {Object} props
 * @param {Object|null} props.community - Data komunitas yang dipilih (null jika modal tertutup)
 * @param {Function} props.onClose - Callback saat modal ditutup
 */
export default function CommunityDetailModal({ community, onClose }) {
  // Cegah render jika tidak ada komunitas yang dipilih atau lingkungan non-browser
  if (!community || typeof document === 'undefined') return null;

  const meta = getPlatformMeta(community.platform);
  const PlatformIcon = meta.icon;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="community-detail-title"
    >
      {/* Kotak Modal Dialog */}
      <div
        className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-2xl relative animate-scale-up space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Tutup X */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          aria-label="Tutup detail komunitas"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header: Logo, Kategori, Platform, & Nama Komunitas */}
        <div className="flex items-start gap-4 pr-8">
          <img
            src={community.logo}
            alt={community.nama}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-md shrink-0"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=200&q=80';
            }}
          />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                {community.kategori}
              </span>
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${meta.badgeClass}`}>
                <PlatformIcon className="w-3 h-3" />
                <span>{community.platform}</span>
              </span>
            </div>
            <h3 id="community-detail-title" className="text-xl font-bold text-slate-900 dark:text-white">
              {community.nama}
            </h3>
          </div>
        </div>

        {/* Deskripsi Singkat & Lengkap Komunitas */}
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            {community.deskripsi}
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            {community.deskripsiLengkap || community.deskripsi}
          </p>
        </div>

        {/* Panel Informasi Meta (Estimasi Anggota, PIC, Email) */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
          <div>
            <span className="text-[11px] text-slate-400 block mb-0.5 font-medium">Estimasi Anggota</span>
            <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-brand-500" />
              {community.anggota || '-'}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block mb-0.5 font-medium">Penanggung Jawab (PIC)</span>
            <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-500" />
              {community.kontak || 'Pengurus Komunitas'}
            </span>
          </div>
          {community.emailKontak && (
            <div className="col-span-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5 font-medium">Email Kontak</span>
              <span className="font-mono text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {community.emailKontak}
              </span>
            </div>
          )}
        </div>

        {/* Tombol Aksi: Tutup & Kunjungi Komunitas Eksternal */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
          >
            Tutup
          </button>

          <a
            href={community.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer ${meta.btnClass}`}
          >
            <span>Kunjungi Komunitas</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
}
