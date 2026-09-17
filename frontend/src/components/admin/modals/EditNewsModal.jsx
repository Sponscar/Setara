/**
 * ==============================================================================
 * File: EditNewsModal.jsx
 * Direktori: src/components/admin/modals/
 * Deskripsi: Modal dialog formulir edit artikel berita untuk Administrator.
 * Pattern: Portal Pattern (React DOM createPortal) & Controlled Component Pattern.
 * Fitur:
 *   - Mengubah data berita (judul, kategori, penulis, waktu baca, status, thumbnail, ringkasan, konten).
 *   - Live preview thumbnail artikel.
 *   - Sinkronisasi asynchronous langsung ke REST API Django Ninja (/api/berita/{id}).
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Edit3, 
  X, 
  Check, 
  Loader2 
} from 'lucide-react';

/**
 * Komponen Modal Dialog Edit Berita.
 * 
 * @param {Object} props
 * @param {Object|null} props.news - Objek data berita yang sedang diedit
 * @param {Function} props.onClose - Callback saat modal ditutup
 * @param {Function} props.onSave - Callback saat form disubmit (menerima id dan updatedData)
 */
export default function EditNewsModal({ news, onClose, onSave }) {
  // State controlled form untuk menyimpan perubahan data artikel
  const [formData, setFormData] = useState({
    judul: '',
    kategori: 'Edukasi',
    author: 'Tim Redaksi SETARA',
    waktuBaca: '4 menit',
    status: 'published',
    thumbnail: '',
    ringkasan: '',
    konten: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inisialisasi atau sinkronisasi form saat objek news berubah
  useEffect(() => {
    if (news) {
      setFormData({
        judul: news.judul || '',
        kategori: news.kategori || 'Edukasi',
        author: news.author || news.author_name || 'Tim Redaksi SETARA',
        waktuBaca: news.waktuBaca || news.waktu_baca || '4 menit',
        status: news.status || 'published',
        thumbnail: news.thumbnail_url || news.thumbnail || '',
        ringkasan: news.ringkasan || '',
        konten: news.konten || news.ringkasan || ''
      });
    }
  }, [news]);

  // Handler ESC key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && news) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [news, onClose]);

  // Cegah render jika tidak ada berita yang dipilih atau bukan di browser
  if (!news || typeof document === 'undefined') return null;

  /**
   * Handler submit form edit berita
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.judul.trim() || !formData.ringkasan.trim()) return;

    setIsSubmitting(true);
    try {
      if (onSave) {
        await onSave(news.id, {
          ...formData,
          author_name: formData.author,
          waktu_baca: formData.waktuBaca,
          thumbnail_url: formData.thumbnail
        });
      }
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-news-title"
    >
      {/* Kotak Modal Dialog */}
      <div
        className="w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-2xl relative animate-scale-up space-y-5 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Tutup X di pojok kanan atas */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          aria-label="Tutup modal edit"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Judul & Header Modal */}
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
            <Edit3 className="w-6 h-6" />
          </div>
          <div>
            <h3 id="edit-news-title" className="text-lg font-bold text-slate-900 dark:text-white">
              Edit Artikel Berita
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Perbarui judul, ringkasan, konten, dan metadata artikel di database PostgreSQL.
            </p>
          </div>
        </div>

        {/* Formulir Edit Berita */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
          {/* Judul Artikel */}
          <div>
            <label className="font-semibold block mb-1 text-slate-900 dark:text-white">
              Judul Artikel *
            </label>
            <input
              type="text"
              required
              value={formData.judul}
              onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
              placeholder="Contoh: Terobosan Isyarat 2026"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Grid Kategori, Status, Penulis, Waktu Baca */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Kategori */}
            <div>
              <label className="font-semibold block mb-1 text-slate-900 dark:text-white">
                Kategori *
              </label>
              <select
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                <option value="Edukasi">Edukasi</option>
                <option value="Teknologi">Teknologi</option>
                <option value="Event">Event</option>
                <option value="Budaya Tuli">Budaya Tuli</option>
                <option value="Komunitas">Komunitas</option>
              </select>
            </div>

            {/* Status Publikasi */}
            <div>
              <label className="font-semibold block mb-1 text-slate-900 dark:text-white">
                Status Publikasi *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                <option value="published">Published (Terbit Aktif)</option>
                <option value="draft">Draft (Disimpan Saja)</option>
              </select>
            </div>

            {/* Penulis */}
            <div>
              <label className="font-semibold block mb-1 text-slate-900 dark:text-white">
                Penulis
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Tim Redaksi SETARA"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Waktu Baca */}
            <div>
              <label className="font-semibold block mb-1 text-slate-900 dark:text-white">
                Waktu Baca
              </label>
              <input
                type="text"
                value={formData.waktuBaca}
                onChange={(e) => setFormData({ ...formData, waktuBaca: e.target.value })}
                placeholder="Contoh: 4 menit"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* URL Thumbnail & Preview */}
          <div>
            <label className="font-semibold block mb-1 text-slate-900 dark:text-white flex items-center justify-between">
              <span>URL Thumbnail Gambar</span>
              {formData.thumbnail && (
                <span className="text-[10px] text-brand-500 font-normal">Preview aktif</span>
              )}
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="url"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
              {formData.thumbnail && (
                <div className="w-12 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800">
                  <img 
                    src={formData.thumbnail} 
                    alt="Thumbnail" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Ringkasan Singkat */}
          <div>
            <label className="font-semibold block mb-1 text-slate-900 dark:text-white">
              Ringkasan Singkat *
            </label>
            <textarea
              rows="2"
              required
              value={formData.ringkasan}
              onChange={(e) => setFormData({ ...formData, ringkasan: e.target.value })}
              placeholder="Ringkasan 1-2 kalimat yang tampil pada kartu artikel..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 leading-relaxed"
            />
          </div>

          {/* Konten Lengkap */}
          <div>
            <label className="font-semibold block mb-1 text-slate-900 dark:text-white">
              Konten Lengkap Berita
            </label>
            <textarea
              rows="6"
              value={formData.konten}
              onChange={(e) => setFormData({ ...formData, konten: e.target.value })}
              placeholder="Tuliskan seluruh isi artikel lengkap di sini..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-[11px] leading-relaxed focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Tombol Aksi Simpan & Batal */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer transition-colors disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-brand-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
