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
import { X, Save, Film, Upload, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

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

  const [visualMode, setVisualMode] = useState(
    video.video_url || video.video_file ? 'video' : 'animation'
  );

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
      setVisualMode(video.video_url || video.video_file ? 'video' : 'animation');
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
        video_url: visualMode === 'animation' ? '' : formData.video_url
      });

      // 2. Jika ada berkas MP4 baru yang diunggah
      if (visualMode === 'video' && selectedFile && onUploadFile) {
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
              <Sparkles className="w-5 h-5" />
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
                <option value="BOTH">Keduanya (BOTH)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Kategori & Durasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">Kategori</label>
              <input
                type="text"
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

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
          </div>

          {/* OPSI VISUALISASI: Switcher Animasi vs Video */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-bg/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Film className="w-4 h-4 text-brand-500" />
                <span>Pilihan Mode Visualisasi Utama:</span>
              </label>
              <div className="flex rounded-xl bg-slate-200 dark:bg-slate-800 p-1">
                <button
                  type="button"
                  onClick={() => setVisualMode('animation')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    visualMode === 'animation'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  🎭 Animasi Canvas 2D
                </button>
                <button
                  type="button"
                  onClick={() => setVisualMode('video')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    visualMode === 'video'
                      ? 'bg-purple-600 text-white shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  🎬 Video MP4 Asli (Maks 5 MB)
                </button>
              </div>
            </div>

            {/* Sub-form Animasi Canvas 2D */}
            <div>
              <label className="font-semibold block mb-1">Pola Animasi Gestur (Engine Kinematics) *</label>
              <select
                value={formData.gesture_pattern}
                onChange={(e) => setFormData({ ...formData, gesture_pattern: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <optgroup label="Sapaan & Waktu">
                  <option value="hand_wave_forehead">hand_wave_forehead (Melambai / Halo)</option>
                  <option value="sun_rise_horizon">sun_rise_horizon (Matahari Terbit / Pagi)</option>
                  <option value="arm_vertical_up">arm_vertical_up (Lengan Tegak / Siang)</option>
                  <option value="sun_set_down">sun_set_down (Matahari Terbenam / Malam)</option>
                  <option value="thumbs_up_chest">thumbs_up_chest (Ibu Jari Terangkat / Selamat)</option>
                </optgroup>
                <optgroup label="Kata Ganti & Penunjuk">
                  <option value="point_chest">point_chest (Menunjuk Dada / Aku)</option>
                  <option value="palm_chest">palm_chest (Telapak di Dada / Saya Sopan)</option>
                  <option value="point_forward">point_forward (Menunjuk Lawan Bicara / Kamu)</option>
                  <option value="point_side">point_side (Menunjuk ke Samping / Dia)</option>
                </optgroup>
                <optgroup label="Keluarga, Emosi & Nilai">
                  <option value="thumb_chin">thumb_chin (Ibu Jari di Dagu / Ibu)</option>
                  <option value="thumb_forehead">thumb_forehead (Ibu Jari di Dahi / Ayah)</option>
                  <option value="cross_chest_hug">cross_chest_hug (Menyilang di Dada / Sayang, Cinta)</option>
                  <option value="equal_parallel_hands">equal_parallel_hands (Telapak Sejajar / Setara, Adil)</option>
                  <option value="palms_brush_chest_up">palms_brush_chest_up (Menyapu Dada ke Atas / Senang)</option>
                  <option value="fist_pump_down">fist_pump_down (Mengepal Bertenaga / Semangat)</option>
                </optgroup>
                <optgroup label="Sosial & Kesopanan">
                  <option value="fingers_chin_forward">fingers_chin_forward (Jari Dagu ke Depan / Terima Kasih)</option>
                  <option value="receive_motion">receive_motion (Tangan Terbuka Mendekat / Terima)</option>
                  <option value="give_motion">give_motion (Tangan Maju Keluar / Kasih)</option>
                  <option value="palms_down_spread">palms_down_spread (Telapak Melebar / Sama-sama)</option>
                  <option value="pray_hands">pray_hands (Kedua Telapak Rapat / Tolong)</option>
                  <option value="support_motion">support_motion (Menopang Lengan / Bantu)</option>
                  <option value="hook_index_fingers">hook_index_fingers (Mengaitkan Telunjuk / Teman)</option>
                </optgroup>
                <optgroup label="Aktivitas & Identitas">
                  <option value="learn_forehead">learn_forehead (Menyerap Ilmu / Belajar)</option>
                  <option value="rotate_index_fingers">rotate_index_fingers (Telunjuk Berputar / Isyarat)</option>
                  <option value="b_hands_wave">b_hands_wave (Huruf B / Bahasa)</option>
                  <option value="i_hand_flutter">i_hand_flutter (Huruf I / Indonesia)</option>
                  <option value="ear_to_mouth_touch">ear_to_mouth_touch (Telinga ke Bibir / Tuli)</option>
                  <option value="cup_ear">cup_ear (Tangan di Telinga / Dengar)</option>
                </optgroup>
              </select>
            </div>

            {/* Sub-form Unggah Berkas Video MP4 */}
            {visualMode === 'video' && (
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center justify-between">
                  <label className="font-semibold block">
                    Unggah Berkas Video MP4 / WebM (Batas Maksimal 5 MB)
                  </label>
                  <span className="text-[11px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    Maks 5 MB
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <label className="px-4 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 font-semibold text-xs flex items-center gap-2 cursor-pointer hover:bg-purple-100 transition-colors">
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

                {/* Input URL Video Eksternal Opsional */}
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
