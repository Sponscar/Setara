/**
 * ==============================================================================
 * File: SubmitCommunityModal.jsx
 * Direktori: src/components/landing/community/
 * Deskripsi: Modal dialog formulir publik untuk mengajukan komunitas baru ke
 *            database SETARA (menunggu verifikasi/approval dari Administrator).
 * Pattern: Portal Pattern (createPortal) & Controlled Component Pattern.
 * Fitur:
 *   - Upload foto/logo komunitas dengan validasi tipe gambar dan ukuran maksimal 2 MB.
 *   - Animasi konfeti perayaan saat pengajuan berhasil dikirim.
 *   - Transisi tampilan sukses dengan pesan konfirmasi.
 * ==============================================================================
 */

import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Building2, 
  Upload, 
  Send, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * Komponen Modal Formulir Pengajuan Komunitas Baru.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Penanda apakah modal sedang ditampilkan
 * @param {Function} props.onClose - Callback saat modal ditutup
 * @param {Function} props.onSubmit - Callback saat formulir disubmit ke store
 */
export default function SubmitCommunityModal({ isOpen, onClose, onSubmit }) {
  // Referensi ke elemen input file tersembunyi
  const logoInputRef = useRef(null);

  // State controlled form pengajuan komunitas
  const [formData, setFormData] = useState({
    nama: '',
    kategori: 'Komunitas Tuli',
    platform: 'WhatsApp',
    link: '',
    logo: '',
    anggota: '100+ Anggota',
    kontak: '',
    emailKontak: '',
    deskripsi: '',
    deskripsiLengkap: ''
  });

  // State pesan error upload logo
  const [logoError, setLogoError] = useState('');

  // State status berhasil terkirim
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Cegah render jika modal ditutup atau lingkungan non-browser
  if (!isOpen || typeof document === 'undefined') return null;

  /**
   * Handler untuk memproses upload foto/logo dengan validasi ukuran maksimal 2 MB
   */
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi 1: Format file gambar
    if (!file.type.startsWith('image/')) {
      setLogoError('File harus berupa format gambar/foto (JPG, PNG, WEBP, atau SVG).');
      return;
    }

    // Validasi 2: Batas ukuran maksimal 2 MB (2 * 1024 * 1024 bytes)
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setLogoError('Ukuran file terlalu besar! Maksimal ukuran foto logo adalah 2 MB.');
      return;
    }

    setLogoError('');

    // Baca file dan ubah ke format DataURL
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({ ...prev, logo: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  /**
   * Handler untuk menghapus file logo yang sudah dipilih
   */
  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, logo: '' }));
    setLogoError('');
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  /**
   * Handler submit form pengajuan komunitas
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama.trim() || !formData.link.trim()) return;

    // Fallback logo jika pengunggah tidak menyertakan foto
    const payload = {
      ...formData,
      logo: formData.logo || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=200&q=80'
    };

    if (onSubmit) {
      onSubmit(payload);
    }

    // Tembakkan konfeti perayaan
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setSubmitSuccess(true);

    // Reset dan tutup modal otomatis setelah 2.5 detik
    setTimeout(() => {
      setSubmitSuccess(false);
      setFormData({
        nama: '',
        kategori: 'Komunitas Tuli',
        platform: 'WhatsApp',
        link: '',
        logo: '',
        anggota: '100+ Anggota',
        kontak: '',
        emailKontak: '',
        deskripsi: '',
        deskripsiLengkap: ''
      });
      setLogoError('');
      onClose();
    }, 2500);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in"
      onClick={() => !submitSuccess && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-community-title"
    >
      {/* Kotak Modal Formulir */}
      <div
        className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-2xl relative animate-scale-up space-y-5 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Tutup X */}
        {!submitSuccess && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Tutup formulir pengajuan"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Tampilan Kondisional: Sukses Terkirim vs Form Input */}
        {submitSuccess ? (
          <div className="text-center py-10 space-y-4 animate-scale-up">
            <div className="w-16 h-16 rounded-3xl bg-brand-500/20 text-brand-500 flex items-center justify-center mx-auto shadow-lg shadow-brand-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Pengajuan Berhasil Terkirim!
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Terima kasih telah berkontribusi. Komunitas <strong>{formData.nama}</strong> akan ditinjau oleh Admin SETARA sebelum ditampilkan di portal.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Header & Informasi Modal */}
            <div className="space-y-1 pr-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                <Building2 className="w-3 h-3" />
                <span>Kolaborasi Komunitas</span>
              </div>
              <h3 id="submit-community-title" className="text-lg font-bold text-slate-900 dark:text-white">
                Ajukan Komunitas Anda ke SETARA
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Isi informasi komunitas Anda untuk kami tampilkan sebagai jembatan inklusi bagi para pengguna platform.
              </p>
            </div>

            {/* Formulir Pengajuan Komunitas */}
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
              {/* Nama Komunitas */}
              <div>
                <label className="font-semibold block mb-1">Nama Komunitas *</label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Contoh: Sahabat Tuli Surabaya"
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
                    <option value="WhatsApp">WhatsApp Group</option>
                    <option value="Telegram">Telegram Channel</option>
                    <option value="Discord">Discord Server</option>
                    <option value="Website">Website Resmi</option>
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
                    placeholder="Contoh: Belajar Isyarat"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Tautan URL Komunitas */}
              <div>
                <label className="font-semibold block mb-1">Tautan / Link Grup atau Website *</label>
                <input
                  type="url"
                  required
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://chat.whatsapp.com/... atau https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-mono text-[11px]"
                />
              </div>

              {/* Estimasi Anggota */}
              <div>
                <label className="font-semibold block mb-1">Estimasi Anggota</label>
                <input
                  type="text"
                  value={formData.anggota}
                  onChange={(e) => setFormData({ ...formData, anggota: e.target.value })}
                  placeholder="Contoh: 350+ Anggota"
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
                  ref={logoInputRef}
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="submit-community-logo-upload"
                />

                {formData.logo ? (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700">
                    <img
                      src={formData.logo}
                      alt="Preview Logo"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-600 shadow-sm shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Foto berhasil dipilih</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate">Format valid (Maks. 2 MB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                      title="Hapus foto"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="submit-community-logo-upload"
                    className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 transition-colors cursor-pointer group text-center"
                  >
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 group-hover:text-brand-500 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span className="font-semibold text-[11px]">Pilih File Foto / Logo</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5">Format: JPG, PNG, WEBP, SVG (Maksimal 2 MB)</span>
                  </label>
                )}

                {/* Pesan Peringatan Validasi Ukuran/Tipe File */}
                {logoError && (
                  <p className="text-[11px] text-rose-500 font-semibold flex items-center gap-1 mt-1.5 animate-fade-in">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{logoError}</span>
                  </p>
                )}
              </div>

              {/* Grid Kontak PIC & Email PIC */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Nama PIC / Kontak *</label>
                  <input
                    type="text"
                    required
                    value={formData.kontak}
                    onChange={(e) => setFormData({ ...formData, kontak: e.target.value })}
                    placeholder="Nama koordinator"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Email PIC *</label>
                  <input
                    type="email"
                    required
                    value={formData.emailKontak}
                    onChange={(e) => setFormData({ ...formData, emailKontak: e.target.value })}
                    placeholder="email@komunitas.id"
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
                  placeholder="Ringkasan tentang kegiatan atau tujuan komunitas..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Tombol Kirim Pengajuan */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-brand-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Pengajuan ke Admin</span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
