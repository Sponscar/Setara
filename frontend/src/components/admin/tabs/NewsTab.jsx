/**
 * ==============================================================================
 * File: NewsTab.jsx
 * Direktori: src/components/admin/tabs/
 * Deskripsi: Tab Manajemen Wawasan & Berita pada Dashboard Administrator.
 * Fitur:
 *   - Form publikasi berita baru langsung ke PostgreSQL via Django Ninja REST API.
 *   - Input thumbnail URL, kategori lengkap, judul, ringkasan, dan konten lengkap.
 *   - Sub-panel daftar berita aktif dengan tombol Edit dan tombol Hapus.
 *   - Integrasi asynchronous ke state store global (useContentStore).
 * Pattern: Controlled Component, Form Validation, Repository Integration.
 * ==============================================================================
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Upload, 
  Trash2, 
  Edit3, 
  Loader2, 
  Image as ImageIcon 
} from 'lucide-react';

/**
 * Komponen Tab Kelola Berita untuk Administrator.
 * 
 * @param {Object} props
 * @param {Array} props.newsList - Daftar artikel berita
 * @param {Function} props.addNews - Aksi store menambahkan berita baru
 * @param {Function} props.deleteNews - Aksi store menghapus berita
 * @param {Function} props.onOpenEditModal - Callback untuk membuka modal edit berita
 * @param {Function} props.showToast - Fungsi menampilkan notifikasi toast interaktif
 */
export default function NewsTab({
  newsList = [],
  addNews,
  deleteNews,
  onOpenEditModal,
  showToast
}) {
  // State formulir berita baru
  const [newsForm, setNewsForm] = useState({
    judul: '',
    kategori: 'Edukasi',
    ringkasan: '',
    author: 'Tim Redaksi SETARA',
    waktuBaca: '4 menit',
    thumbnail: '',
    konten: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  /**
   * Handler untuk submit publikasi berita baru
   */
  const handleCreateNews = async (e) => {
    e.preventDefault();
    if (!newsForm.judul.trim() || !newsForm.ringkasan.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await addNews({
        ...newsForm,
        author_name: newsForm.author,
        waktu_baca: newsForm.waktuBaca,
        thumbnail_url: newsForm.thumbnail,
        // Pastikan konten terisi, jika kosong gunakan ringkasan
        konten: newsForm.konten.trim() || newsForm.ringkasan.trim()
      });
      setIsSubmitting(false);

      if (res && res.success !== false) {
        setNewsForm({
          judul: '',
          kategori: 'Edukasi',
          ringkasan: '',
          author: 'Tim Redaksi SETARA',
          waktuBaca: '4 menit',
          thumbnail: '',
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
                <option value="Komunitas">Komunitas</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1">Penulis</label>
              <input
                type="text"
                value={newsForm.author}
                onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })}
                placeholder="Tim Redaksi SETARA"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Estimasi Waktu Baca & Thumbnail URL */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Waktu Baca</label>
              <input
                type="text"
                value={newsForm.waktuBaca}
                onChange={(e) => setNewsForm({ ...newsForm, waktuBaca: e.target.value })}
                placeholder="4 menit"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">URL Gambar (Opsional)</label>
              <input
                type="url"
                value={newsForm.thumbnail}
                onChange={(e) => setNewsForm({ ...newsForm, thumbnail: e.target.value })}
                placeholder="https://..."
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
              placeholder="Ringkasan 1-2 kalimat yang tampil di kartu artikel..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 leading-relaxed"
            />
          </div>

          {/* Konten Lengkap */}
          <div>
            <label className="font-semibold block mb-1">Konten Lengkap Berita</label>
            <textarea
              rows="5"
              value={newsForm.konten}
              onChange={(e) => setNewsForm({ ...newsForm, konten: e.target.value })}
              placeholder="Isi berita lengkap. Jika dikosongkan, ringkasan singkat di atas akan otomatis digunakan."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-[11px] focus:outline-none focus:border-brand-500 leading-relaxed"
            />
          </div>

          {/* Tombol Terbitkan */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-brand-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
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

        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
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
                    {n.status === 'draft' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-500/10 text-slate-400 shrink-0">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 line-clamp-2 leading-relaxed">{n.ringkasan}</p>
                  <div className="text-[10px] text-slate-400">
                    Oleh {n.author || n.author_name} &bull; {n.tanggal}
                  </div>
                </div>

                {/* Tombol Aksi: Edit & Hapus Berita */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenEditModal && onOpenEditModal(n)}
                    className="p-2 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 cursor-pointer transition-colors"
                    title="Edit berita"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    disabled={deletingId === n.id}
                    onClick={async () => {
                      setDeletingId(n.id);
                      await deleteNews(n.id);
                      setDeletingId(null);
                      if (showToast) showToast('Berita berhasil dihapus dari database.');
                    }}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 cursor-pointer transition-colors disabled:opacity-50"
                    title="Hapus berita"
                  >
                    {deletingId === n.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
