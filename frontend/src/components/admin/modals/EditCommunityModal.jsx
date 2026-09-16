/**
 * ==============================================================================
 * File: EditCommunityModal.jsx
 * Direktori: src/components/admin/modals/
 * Deskripsi: Modal dialog formulir edit komunitas terverifikasi untuk Administrator.
 * Pattern: Portal Pattern (React DOM createPortal) & Controlled Component Pattern.
 * Fitur:
 *   - Mengubah data komunitas (nama, platform, kategori, link, anggota, kontak, deskripsi).
 *   - Upload foto/logo dengan validasi tipe file gambar dan batasan ukuran maksimal 2 MB.
 *   - Preview logo dinamis dengan opsi ganti atau hapus foto.
 * ==============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Edit3, 
  X, 
  Upload, 
  Check, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

/**
 * Komponen Modal Dialog Edit Komunitas Terverifikasi.
 * 
 * @param {Object} props
 * @param {Object|null} props.community - Objek data komunitas yang sedang diedit
 * @param {Function} props.onClose - Callback saat modal ditutup
 * @param {Function} props.onSave - Callback saat form berhasil disubmit dengan data baru
 */
export default function EditCommunityModal({ community, onClose, onSave }) {
  // Referensi ke input file tersembunyi
  const fileInputRef = useRef(null);

  // State controlled form untuk menyimpan perubahan data komunitas
  const [formData, setFormData] = useState({
    nama: '',
    platform: 'WhatsApp',
    kategori: '',
    link: '',
    anggota: '',
    logo: '',
    deskripsi: '',
    deskripsiLengkap: '',
    kontak: '',
    emailKontak: ''
  });

  // State pesan error validasi upload file logo
  const [logoError, setLogoError] = useState('');

  // Inisialisasi atau sinkronisasi form saat objek community berubah
  useEffect(() => {
    if (community) {
      setFormData({
        nama: community.nama || '',
        platform: community.platform || 'WhatsApp',
        kategori: community.kategori || '',
        link: community.link || '',
        anggota: community.anggota || '',
        logo: community.logo || '',
        deskripsi: community.deskripsi || '',
        deskripsiLengkap: community.deskripsiLengkap || '',
        kontak: community.kontak || '',
        emailKontak: community.emailKontak || ''
      });
      setLogoError('');
    }
  }, [community]);

  // Cegah render jika tidak ada komunitas yang dipilih atau bukan di browser
  if (!community || typeof document === 'undefined') return null;

  /**
   * Handler untuk memproses upload foto/logo baru dengan validasi ukuran 2 MB.
   * Mengubah file terpilih menjadi base64 DataURL untuk preview dan penyimpanan lokal.
   */
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi 1: Pastikan tipe file adalah gambar
    if (!file.type.startsWith('image/')) {
      setLogoError('File harus berupa foto/gambar (JPG, PNG, WEBP, atau SVG).');
      return;
    }

    // Validasi 2: Batas ukuran maksimal 2 MB (2 * 1024 * 1024 bytes)
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setLogoError('Ukuran file terlalu besar! Maksimal ukuran foto adalah 2 MB.');
      return;
    }

    // Reset error jika validasi terpenuhi
    setLogoError('');

    // Baca file sebagai base64 string
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({ ...prev, logo: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  /**
   * Handler untuk menghapus logo yang sudah terpasang
   */
  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, logo: '' }));
    setLogoError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Handler submit form edit komunitas
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(community.id, formData);
    }
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-community-title"
    >
      {/* Kotak Modal Dialog */}
      <div
        className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-2xl relative animate-scale-up space-y-5 max-h-[92vh] overflow-y-auto"
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

        {/* Header Modal */}
        <div className="flex items-center gap-3 pr-8">
          <div className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-500">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h3 id="edit-community-title" className="text-lg font-bold text-slate-900 dark:text-white">
              Edit Komunitas Terverifikasi
            </h3>
            <p className="text-xs text-slate-500">
              Perbarui informasi untuk {community.nama}
            </p>
          </div>
        </div>

        {/* Formulir Edit Komunitas */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
          {/* Input Nama Komunitas */}
          <div>
            <label className="font-semibold block mb-1">Nama Komunitas *</label>
            <input
              type="text"
              required
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Grid Platform & Kategori */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Platform *</label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                <option value="WhatsApp">WhatsApp</option>
                <option value="Telegram">Telegram</option>
                <option value="Discord">Discord</option>
                <option value="Website">Website</option>
                <option value="Instagram">Instagram</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1">Kategori *</label>
              <input
                type="text"
                required
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Input Link Komunitas */}
          <div>
            <label className="font-semibold block mb-1">Link URL *</label>
            <input
              type="url"
              required
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Estimasi Anggota */}
          <div>
            <label className="font-semibold block mb-1">Estimasi Anggota</label>
            <input
              type="text"
              value={formData.anggota}
              onChange={(e) => setFormData({ ...formData, anggota: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Upload Foto / Logo Komunitas (Maksimal 2 MB) */}
          <div>
            <label className="font-semibold block mb-1">
              Upload Foto / Logo Komunitas (Maks. 2 MB)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
              id="edit-community-logo-upload"
            />

            {formData.logo ? (
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700">
                <img
                  src={formData.logo}
                  alt="Preview Logo"
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-600 shadow-sm shrink-0"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=200&q=80';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Foto terpasang</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block truncate">Klik ganti untuk mengunggah foto baru</span>
                </div>
                <label
                  htmlFor="edit-community-logo-upload"
                  className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-[10px] font-semibold cursor-pointer transition-colors"
                >
                  Ganti
                </label>
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                  title="Hapus foto"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="edit-community-logo-upload"
                className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 transition-colors cursor-pointer group text-center"
              >
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 group-hover:text-brand-500 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span className="font-semibold text-[11px]">Pilih File Foto Baru</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5">Format: JPG, PNG, WEBP, SVG (Maksimal 2 MB)</span>
              </label>
            )}

            {/* Notifikasi Pesan Error Validasi Ukuran/Tipe File */}
            {logoError && (
              <p className="text-[11px] text-rose-500 font-semibold flex items-center gap-1 mt-1.5 animate-fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{logoError}</span>
              </p>
            )}
          </div>

          {/* Grid Kontak & Email PIC */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">PIC / Kontak *</label>
              <input
                type="text"
                required
                value={formData.kontak}
                onChange={(e) => setFormData({ ...formData, kontak: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Email PIC</label>
              <input
                type="email"
                value={formData.emailKontak}
                onChange={(e) => setFormData({ ...formData, emailKontak: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Deskripsi Singkat */}
          <div>
            <label className="font-semibold block mb-1">Deskripsi Singkat *</label>
            <textarea
              rows="2"
              required
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Deskripsi Lengkap */}
          <div>
            <label className="font-semibold block mb-1">Deskripsi Lengkap</label>
            <textarea
              rows="3"
              value={formData.deskripsiLengkap}
              onChange={(e) => setFormData({ ...formData, deskripsiLengkap: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Tombol Aksi Batal & Simpan Perubahan */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-brand-500 hover:from-amber-400 hover:to-brand-400 text-white font-bold text-xs shadow-lg shadow-amber-500/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
