/**
 * ==============================================================================
 * File: VideoTab.jsx
 * Direktori: src/components/admin/tabs/
 * Deskripsi: Modul CMS Kamus Kosakata Isyarat & Video Platform SETARA.
 * Integrasi:
 *   - Terhubung langsung ke API backend Django Ninja (/api/video/*).
 *   - Katalog lengkap pola engine canvas 2D procedural kinematics.
 *   - Opsi visualisasi: Animasi Belum Ada Video vs Unggah MP4 (Maks 5 MB) vs URL Video.
 *   - Live preview player dan tombol Edit kosakata.
 * ==============================================================================
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Video as VideoIcon, 
  Upload, 
  Film, 
  Database, 
  AlertCircle, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function VideoTab({
  customVideos = [],
  addCustomVideo,
  uploadVideoFile,
  deleteCustomVideo,
  onEditVideo,
  showToast
}) {
  const [videoForm, setVideoForm] = useState({
    kata: '',
    tipe_bahasa: 'BISINDO',
    kategori: 'Umum',
    durasi: 2,
    gesture_pattern: 'hand_wave_forehead',
    deskripsi_gerakan: '',
    video_url: ''
  });


  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setFilePreview('');
      return;
    }

    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|webm|mov)$/i)) {
      setFileError('Format berkas tidak didukung. Harap pilih video MP4 atau WebM.');
      setSelectedFile(null);
      setFilePreview('');
      return;
    }

    setSelectedFile(file);
    const objUrl = URL.createObjectURL(file);
    setFilePreview(objUrl);
  };

  const handleCreateVideo = async (e) => {
    e.preventDefault();
    if (!videoForm.kata.trim()) return;
    if (fileError) return;

    setIsSubmitting(true);
    try {
      // 1. Simpan metadata kata isyarat
      const result = await addCustomVideo({
        ...videoForm,
        video_url: videoForm.video_url
      });

      if (result && result.success !== false) {
        const createdId = result.item?.id;

        // 2. Jika mode video dan ada file yang dipilih, lakukan upload ke backend
        if (selectedFile && createdId && uploadVideoFile) {
          const uploadRes = await uploadVideoFile(createdId, selectedFile);
          if (!uploadRes.success && showToast) {
            showToast(uploadRes.error || 'Gagal mengunggah berkas video.');
          }
        }

        setIsSubmitting(false);
        setVideoForm({
          kata: '',
          tipe_bahasa: 'BISINDO',
          kategori: 'Umum',
          durasi: 2,
          gesture_pattern: 'hand_wave_forehead',
          deskripsi_gerakan: '',
          video_url: ''
        });
        setSelectedFile(null);
        setFilePreview('');
        setFileError('');

        if (showToast) {
          showToast(`Kosakata "${videoForm.kata}" berhasil ditambahkan ke database.`);
        }
      } else {
        setIsSubmitting(false);
        if (showToast) {
          showToast(result?.error || 'Gagal menambahkan kosakata.');
        }
      }
    } catch (err) {
      setIsSubmitting(false);
      if (showToast) showToast('Gagal menyimpan kosakata ke database.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* ======================================================================= */}
      {/* 1. FORMULIR PENAMBAHAN KATA ISYARAT BARU (Kiri / 5 Kolom)               */}
      {/* ======================================================================= */}
      <div className="lg:col-span-5 p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-dark-border">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-500" />
            <span>Tambah Isyarat Kamus Baru</span>
          </h3>
        </div>

        <form onSubmit={handleCreateVideo} className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
          {/* Kata / Frasa Input */}
          <div>
            <label className="font-semibold block mb-1">Kata / Frasa *</label>
            <input
              type="text"
              required
              value={videoForm.kata}
              onChange={(e) => setVideoForm({ ...videoForm, kata: e.target.value.toLowerCase() })}
              placeholder="Contoh: semangat, terima kasih"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Tipe Bahasa */}
          <div>
            <label className="font-semibold block mb-1">Tipe Bahasa *</label>
            <select
              value={videoForm.tipe_bahasa}
              onChange={(e) => setVideoForm({ ...videoForm, tipe_bahasa: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="BISINDO">BISINDO</option>
              <option value="SIBI">SIBI</option>
            </select>
          </div>

          {/* UNGGAH VIDEO MP4 */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-bg/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <label className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-brand-500" />
              <span>Video Isyarat MP4:</span>
              <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 ml-auto">
                Maks 5 MB
              </span>
            </label>

            {/* Tombol Pilih Berkas */}
            <label className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <Upload className="w-4 h-4" />
              <span>{selectedFile ? selectedFile.name : 'Pilih Berkas MP4 / WebM'}</span>
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {fileError && (
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-[11px] flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}

            {/* Alternatif URL Eksternal */}
            <input
              type="url"
              value={videoForm.video_url}
              onChange={(e) => {
                setVideoForm({ ...videoForm, video_url: e.target.value });
                setFilePreview(e.target.value);
              }}
              placeholder="Atau URL video: https://.../video.mp4"
              className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />

            {/* Live Preview Player */}
            {filePreview && (
              <div className="p-2 rounded-xl bg-black/10 dark:bg-black/50 border border-slate-200 dark:border-slate-700/60">
                <video
                  src={filePreview}
                  controls
                  className="w-full max-h-36 rounded-lg object-contain bg-black"
                />
              </div>
            )}
          </div>

          {/* Tombol Simpan */}
          <button
            type="submit"
            disabled={isSubmitting || !!fileError}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>{isSubmitting ? 'Menyimpan...' : 'Tambahkan ke Database Kamus'}</span>
          </button>
        </form>
      </div>

      {/* ======================================================================= */}
      {/* 2. DAFTAR KOSAKATA DATABASE ADMIN (Kanan / 7 Kolom)                    */}
      {/* ======================================================================= */}
      <div className="lg:col-span-7 p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-dark-border">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Film className="w-4 h-4 text-emerald-500" />
            <span>Kamus Kosakata Database ({customVideos.length})</span>
          </h3>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
            <Database className="w-3 h-3" />
            PostgreSQL Active (35+ Kata)
          </span>
        </div>

        <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
          {customVideos.length > 0 ? (
            customVideos.map((v) => {
              const hasVideo = !!(v.video_url || v.video_file);
              return (
                <div 
                  key={v.id} 
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 text-xs hover:border-emerald-500/40 transition-colors"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wide text-sm">
                        {v.kata}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-400">
                        {v.tipe_bahasa}
                      </span>
                      {v.kategori && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {v.kategori}
                        </span>
                      )}
                      {hasVideo ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-500/15 text-slate-600 dark:text-slate-300 border border-slate-500/30 flex items-center gap-1">
                          <Film className="w-3 h-3" />
                          MP4 Asli
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                          <Film className="w-3 h-3" />
                          Belum Ada Video
                        </span>
                      )}
                    </div>

                    <p className="text-slate-500 dark:text-slate-400">
                      {v.deskripsi_gerakan || 'Gerakan standar simulasi visual.'}
                    </p>

                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-3 pt-0.5">
                      <span>Durasi: {v.durasi || 2}s</span>
                    </div>
                  </div>

                  {/* Tombol Aksi: Edit & Hapus */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onEditVideo && onEditVideo(v)}
                      className="p-2 rounded-xl bg-slate-200/80 dark:bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-500 text-slate-600 dark:text-slate-300 cursor-pointer transition-colors"
                      title="Edit kosakata ini"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        await deleteCustomVideo(v.id);
                        if (showToast) showToast(`Kosakata "${v.kata}" berhasil dihapus.`);
                      }}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 cursor-pointer transition-colors"
                      title="Hapus kata dari kamus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Memuat kosakata dari database backend...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
