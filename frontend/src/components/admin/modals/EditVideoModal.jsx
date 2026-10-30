/**
 * ==============================================================================
 * File: EditVideoModal.jsx
 * Direktori: src/components/admin/modals/
 * Deskripsi: Modal Dialog Pengeditan Kosakata & Pengelolaan Video Isyarat SETARA.
 * Fitur:
 *   - Edit kata, tipe bahasa, kategori, durasi, dan deskripsi gerakan.
 *   - Pemilihan opsi visualisasi: Pola Animasi Canvas 2D vs Unggah Video MP4 (Maks 5 MB) vs URL Eksternal.
 *   - Live preview video MP4 dengan validasi batas file maksimal 5 MB di browser.
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import { X, Save, Film, Upload, Edit3, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function EditVideoModal({
  isOpen,
  onClose,
  video,
  onSave,
  onUploadFile,
  showToast
}) {
  if (!isOpen || !video) return null;

  const [formData, setFormData] = useState({
    kata: video.kata || '',
    tipe_bahasa: video.tipe_bahasa || 'BISINDO',
    kategori: video.kategori || 'Umum',
    durasi: video.durasi || 2,
    gesture_pattern: video.gesture_pattern || 'hand_wave_forehead',
    deskripsi_gerakan: video.deskripsi_gerakan || '',
    video_url: video.video_url || ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(video.video_url || video.video_file || '');
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (video) {
      setFormData({
        kata: video.kata || '',
        tipe_bahasa: video.tipe_bahasa || 'BISINDO',
        kategori: video.kategori || 'Umum',
        durasi: video.durasi || 2,
        gesture_pattern: video.gesture_pattern || 'hand_wave_forehead',
        deskripsi_gerakan: video.deskripsi_gerakan || '',
        video_url: video.video_url || video.video_file || ''
      });
      setFilePreview(video.video_url || video.video_file || '');
      setSelectedFile(null);
      setFileError('');
    }
  }, [video]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFileError('');
    if (!file) return;

    // Batas maksimal 5 MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setFileError(`Ukuran berkas (${sizeMb} MB) melebihi batas maksimal 5 MB.`);
      setSelectedFile(null);
      return;
    }

    // Validasi tipe file
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|webm|mov)$/i)) {
      setFileError('Format tidak didukung. Harap pilih video MP4 atau WebM.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    const objUrl = URL.createObjectURL(file);
    setFilePreview(objUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.kata.trim()) return;

    setIsSubmitting(true);
    try {
      // 1. Simpan metadata kata
      const saveRes = await onSave(video.id, {
        ...formData,
        video_url: formData.video_url
      });

      // 2. Jika ada berkas MP4 baru yang diunggah
      if (selectedFile && onUploadFile) {
        const uploadRes = await onUploadFile(video.id, selectedFile);
        if (!uploadRes.success) {
          if (showToast) showToast(uploadRes.error || 'Gagal mengunggah berkas video.');
        }
      }

      setIsSubmitting(false);
      if (showToast) showToast(`Kosakata "${formData.kata}" berhasil diperbarui.`);
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      if (showToast) showToast('Gagal memperbarui kosakata isyarat.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-dark-card rounded-3xl shadow-2xl border border-slate-200 dark:border-dark-border overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-dark-border bg-slate-50/50 dark:bg-dark-bg/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Kosakata Isyarat
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sesuaikan metadata kata dan preferensi tampilan visualisasi
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs text-slate-700 dark:text-slate-300">
          {/* Row 1: Kata & Tipe Bahasa */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">Kata / Frasa *</label>
              <input
                type="text"
                required
                value={formData.kata}
                onChange={(e) => setFormData({ ...formData, kata: e.target.value.toLowerCase() })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Tipe Bahasa *</label>
              <select
                value={formData.tipe_bahasa}
                onChange={(e) => setFormData({ ...formData, tipe_bahasa: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="BISINDO">BISINDO</option>
                <option value="SIBI">SIBI</option>
              </select>
            </div>
          </div>

          {/* Durasi */}
          <div>
            <label className="font-semibold block mb-1">Estimasi Durasi (Detik)</label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.durasi}
              onChange={(e) => setFormData({ ...formData, durasi: parseInt(e.target.value) || 2 })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* UNGGAH VIDEO MP4 */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-bg/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <label className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Film className="w-4 h-4 text-brand-500" />
              <span>Video Isyarat MP4:</span>
              <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 ml-auto">
                Maks 5 MB
              </span>
            </label>

            {/* Tombol Pilih Berkas */}
            <div className="flex items-center gap-3">
              <label className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold text-xs flex items-center gap-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <Upload className="w-4 h-4" />
                <span>Pilih Berkas MP4</span>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {selectedFile && (
                <span className="text-xs text-slate-600 dark:text-slate-300 truncate max-w-xs">
                  {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              )}
            </div>

            {fileError && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}

            {/* Input URL Video Eksternal */}
            <div>
              <label className="font-medium block mb-1 text-slate-500 dark:text-slate-400 text-[11px]">
                Atau Masukkan URL Video Eksternal:
              </label>
              <input
                type="url"
                value={formData.video_url}
                onChange={(e) => {
                  setFormData({ ...formData, video_url: e.target.value });
                  setFilePreview(e.target.value);
                }}
                placeholder="https://.../video.mp4"
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Live Preview Player */}
            {filePreview && (
              <div className="p-3 rounded-xl bg-black/5 dark:bg-black/40 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                  Live Video Preview:
                </span>
                <video
                  src={filePreview}
                  controls
                  className="w-full max-h-48 rounded-lg object-contain bg-black"
                />
              </div>
            )}
          </div>

          {/* Deskripsi Gerakan */}
          <div>
            <label className="font-semibold block mb-1">Deskripsi Panduan Gerakan</label>
            <textarea
              rows="2"
              value={formData.deskripsi_gerakan}
              onChange={(e) => setFormData({ ...formData, deskripsi_gerakan: e.target.value })}
              placeholder="Deskripsi panduan peragaan isyarat..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-dark-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold cursor-pointer transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !!fileError}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
