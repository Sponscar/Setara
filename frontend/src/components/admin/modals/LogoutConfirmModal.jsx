/**
 * ==============================================================================
 * File: LogoutConfirmModal.jsx
 * Direktori: src/components/admin/modals/
 * Deskripsi: Modal dialog konfirmasi keluar (logout) dari sesi administrator.
 * Pattern: Portal Pattern (React DOM createPortal) untuk merender modal di root document.body,
 *          menghindari masalah z-index dan overflow parent container.
 * ==============================================================================
 */

import React from 'react';
import { createPortal } from 'react-dom';
import { LogOut, ShieldCheck } from 'lucide-react';

/**
 * Komponen Modal Dialog Konfirmasi Logout.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Penanda apakah modal sedang ditampilkan
 * @param {Function} props.onClose - Callback saat modal ditutup atau tombol batal diklik
 * @param {Function} props.onConfirm - Callback saat tombol konfirmasi keluar diklik
 * @param {string} [props.userEmail] - Alamat email pengguna administrator yang sedang aktif
 */
export default function LogoutConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  userEmail = 'admin@setara.id' 
}) {
  // Cegah render jika modal tidak aktif atau di lingkungan non-browser
  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-dialog-title"
    >
      {/* Container Kotak Modal - stopPropagation mencegah klik dalam modal menutup modal */}
      <div 
        className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-2xl relative animate-scale-up space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal & Ikon Peringatan */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/15 text-red-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/10">
            <LogOut className="w-6 h-6" />
          </div>
          <div>
            <h3 id="logout-dialog-title" className="text-lg font-bold text-slate-900 dark:text-white">
              Konfirmasi Keluar
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dashboard Administrator SETARA
            </p>
          </div>
        </div>

        {/* Deskripsi & Info Akun Aktif */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
          <p>
            Apakah Anda yakin ingin <strong>keluar / logout</strong> dari sesi Administrator? Anda perlu memasukkan kredensial kembali untuk mengakses dashboard ini.
          </p>
          <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
            <span>Akun aktif: <strong className="text-slate-700 dark:text-slate-200">{userEmail}</strong></span>
          </div>
        </div>

        {/* Tombol Aksi (Batal / Keluar) */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-lg shadow-red-600/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Ya, Keluar</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
