/**
 * ==============================================================================
 * File: EditVideoModal.jsx
 * Direktori: src/components/admin/modals/
 * Deskripsi: Modal Dialog Pengeditan Kosakata & Pengelolaan Video Isyarat SETARA.
 * Fitur:
 *   - Edit kata dan tipe bahasa (BISINDO / SIBI).
 *   - Estimasi durasi otomatis terdeteksi dari metadata berkas video.
 *   - Status video pintar: Mempertahankan video yang sudah diunggah jika admin tidak menggantinya.
 *   - Opsi upload file pengganti (Maks 5 MB) dengan live preview dan validasi.
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import { X, Save, Film, Upload, Edit3, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';

export default function EditVideoModal({
  isOpen,
  onClose,
  video,
  onSave,
  onUploadFile,
  showToast
}) {
  if (!isOpen || !video) return null;

  const existingVideoUrl = video.video_file || video.video_url || '';
  const hasExistingVideo = Boolean(existingVideoUrl);

  const [formData, setFormData] = useState({
    kata: video.kata || '',
    tipe_bahasa: video.tipe_bahasa || 'BISINDO',
    durasi: video.durasi || 2,
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(existingVideoUrl);
  const [calculatedDuration, setCalculatedDuration] = useState(video.durasi || 2);
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (video) {
      const initialVideoUrl = video.video_file || video.video_url || '';
      setFormData({
        kata: video.kata || '',
        tipe_bahasa: video.tipe_bahasa || 'BISINDO',
        durasi: video.durasi || 2,
      });
      setFilePreview(initialVideoUrl);
      setCalculatedDuration(video.durasi || 2);
      setSelectedFile(null);
      setFileError('');
    }
  }, [video]);

  // Deteksi durasi video secara otomatis saat metadata video selesai dimuat
  const handleVideoLoadedMetadata = (e) => {
    const durationSec = Math.round(e.target.duration);
    if (durationSec && durationSec > 0) {
      setCalculatedDuration(durationSec);
      setFormData((prev) => ({ ...prev, durasi: durationSec }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFileError('');
    if (!file) return;

    // Batas maksimal 5 MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setFileError(`Ukuran berkas (${sizeMb} MB) melebihi batas maksimal 5 MB.`);
      return;
    }

    // Validasi format file video
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|webm|mov)$/i)) {
      setFileError('Format tidak didukung. Harap pilih video MP4 atau WebM.');
      return;
    }

    setSelectedFile(file);
    const objUrl = URL.createObjectURL(file);
    setFilePreview(objUrl);
  };

  // Batalkan pemilihan berkas baru dan kembalikan ke video yang sudah ada di database
  const handleCancelNewFile = () => {
    setSelectedFile(null);
    setFilePreview(existingVideoUrl);
    setCalculatedDuration(video.durasi || 2);
    setFormData((prev) => ({ ...prev, durasi: video.durasi || 2 }));
    setFileError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.kata.trim()) return;

    setIsSubmitting(true);
    try {
      // 1. Simpan metadata kata (durasi otomatis terhitung)
      // Jika tidak ada berkas baru, data video yang sudah diunggah tetap dipertahankan
      const updateData = {
        kata: formData.kata.toLowerCase().trim(),
        tipe_bahasa: formData.tipe_bahasa,
        durasi: calculatedDuration || formData.durasi || 2,
      };

      await onSave(video.id, updateData);

      // 2. Hanya upload berkas baru jika admin secara eksplisit memilih berkas baru
      if (selectedFile && onUploadFile) {
        const uploadRes = await onUploadFile(video.id, selectedFile);
        if (!uploadRes.success) {
          if (showToast) showToast(uploadRes.error || 'Gagal mengunggah berkas video baru.');
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
                Sesuaikan kata, tipe bahasa, dan video peragaan isyarat
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

          {/* Estimasi Durasi Otomatis (Tanpa Input Manual) */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-bg/60 border border-slate-200 dark:border-slate-800">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block text-xs">
                Estimasi Durasi Video
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Terdeteksi otomatis dari panjang berkas video peragaan
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {calculatedDuration || formData.durasi || 2} Detik (Otomatis)
            </span>
          </div>

          {/* PENGELOLAAN VIDEO MP4 */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-bg/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                <Film className="w-4 h-4 text-brand-500" />
                <span>Berkas Video Isyarat:</span>
              </label>
              <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                Maks 5 MB (MP4 / WebM)
              </span>
            </div>

            {/* Status Video Saat Ini */}
            {selectedFile ? (
              <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Upload className="w-4 h-4 text-brand-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold text-brand-600 dark:text-brand-400 text-xs truncate">
                      Berkas baru dipilih: {selectedFile.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Ukuran: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; Akan menggantikan video lama saat disimpan.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCancelNewFile}
                  className="px-2.5 py-1 text-[11px] font-semibold text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0 flex items-center gap-1"
                  title="Batalkan berkas baru dan gunakan video lama"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Batal Ganti</span>
                </button>
              </div>
            ) : hasExistingVideo ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <div className="min-w-0">
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                    Menggunakan video yang sudah diunggah
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Video lama tetap aktif secara otomatis. Anda tidak perlu mengunggah ulang jika tidak ingin menggantinya.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <p className="text-[11px] text-amber-600 dark:text-amber-400">
                  Belum ada berkas video terunggah untuk kata ini.
                </p>
              </div>
            )}

            {/* Tombol Pilih Berkas (Ganti atau Unggah) */}
            <div>
              <label className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <Upload className="w-4 h-4 text-brand-500" />
                <span>
                  {hasExistingVideo && !selectedFile
                    ? 'Ganti Berkas Video (Opsional)'
                    : 'Pilih Berkas Video MP4'}
                </span>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Pesan Kesalahan File */}
            {fileError && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}

            {/* Live Preview Player */}
            {filePreview && (
              <div className="p-3 rounded-xl bg-black/5 dark:bg-black/40 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                  {selectedFile ? 'Pratinjau Berkas Baru:' : 'Pratinjau Video Saat Ini:'}
                </span>
                <video
                  src={filePreview}
                  controls
                  onLoadedMetadata={handleVideoLoadedMetadata}
                  className="w-full max-h-48 rounded-lg object-contain bg-black"
                />
              </div>
            )}
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
