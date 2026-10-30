/**
 * ==============================================================================
 * File: SubmitTestimonialModal.jsx
 * Direktori: src/components/landing/community/
 * Deskripsi: Modal dialog formulir untuk mengirimkan testimoni atau cerita pengalaman
 *            pengguna platform SETARA.
 * Pattern: Portal Pattern (createPortal) & Controlled Component Pattern.
 * ==============================================================================
 */

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  MessageSquare, 
  Send 
} from 'lucide-react';

/**
 * Komponen Modal Formulir Testimoni / Pengalaman Pengguna.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Penanda apakah modal ditampilkan
 * @param {Function} props.onClose - Callback saat modal ditutup
 * @param {Function} props.onSubmit - Callback saat form testimoni disubmit
 */
export default function SubmitTestimonialModal({ isOpen, onClose, onSubmit }) {
  // State controlled form testimoni
  const [formData, setFormData] = useState({
    nama: '',
    peran: '',
    avatar: '',
    komentar: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cegah render jika modal ditutup atau lingkungan non-browser
  if (!isOpen || typeof document === 'undefined') return null;

  /**
   * Handler submit form testimoni (langsung tutup tanpa efek/delay berhasil)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama.trim() || !formData.komentar.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        nama: formData.nama.trim(),
        peran: formData.peran.trim() || 'Pengguna SETARA',
        avatar: formData.avatar.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        avatar_url: formData.avatar.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        komentar: formData.komentar.trim(),
        konten: formData.komentar.trim(),
        rating: 5
      };

      if (onSubmit) {
        await onSubmit(payload);
      }

      setFormData({ nama: '', peran: '', avatar: '', komentar: '' });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="testimonial-form-title"
    >
      {/* Kotak Modal Dialog */}
      <div
        className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-2xl relative animate-scale-up space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Tutup X */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          aria-label="Tutup formulir testimoni"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Formulir */}
        <div className="space-y-1 pr-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Bagikan Pengalaman</span>
          </div>
          <h3 id="testimonial-form-title" className="text-lg font-bold text-slate-900 dark:text-white">
            Tulis Cerita & Suaramu
          </h3>
          <p className="text-xs text-slate-500">
            Ceritakan bagaimana SETARA membantu komunikasi atau proses belajarmu.
          </p>
        </div>

        {/* Form Input Testimoni */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
          {/* Nama Lengkap */}
          <div>
            <label className="font-semibold block mb-1">Nama Lengkap *</label>
            <input
              type="text"
              required
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="Contoh: Siti Aisyah"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Peran / Latar Belakang */}
          <div>
            <label className="font-semibold block mb-1">Peran / Latar Belakang *</label>
            <input
              type="text"
              required
              value={formData.peran}
              onChange={(e) => setFormData({ ...formData, peran: e.target.value })}
              placeholder="Contoh: Teman Tuli & Desainer Grafis / Mahasiswa"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* URL Avatar Opsional */}
          <div>
            <label className="font-semibold block mb-1">URL Avatar / Foto (Opsional)</label>
            <input
              type="url"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-mono text-[11px]"
            />
          </div>

          {/* Komentar / Cerita */}
          <div>
            <label className="font-semibold block mb-1">Cerita / Kesan *</label>
            <textarea
              rows="3"
              required
              value={formData.komentar}
              onChange={(e) => setFormData({ ...formData, komentar: e.target.value })}
              placeholder="Tuliskan pengalaman Anda menggunakan SETARA..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Tombol Terbitkan Cerita */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20 hover:shadow-xl hover:scale-[1.02] active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Mengirim...' : 'Terbitkan Ceritaku'}</span>
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
