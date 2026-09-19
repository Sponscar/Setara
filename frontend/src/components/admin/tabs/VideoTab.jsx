/**
 * ==============================================================================
 * File: VideoTab.jsx
 * Direktori: src/components/admin/tabs/
 * Deskripsi: Modul CMS Kamus Kosakata Isyarat & Video Platform SETARA.
 * Integrasi:
 *   - Terhubung langsung ke API backend Django Ninja (/api/video/*).
 *   - Katalog lengkap pola engine canvas 2D procedural kinematics.
 *   - Opsi visualisasi: Animasi Canvas 2D vs Unggah MP4 (Maks 5 MB) vs URL Video.
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
  Sparkles, 
  Film, 
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

  const [visualMode, setVisualMode] = useState('animation'); // 'animation' | 'video'
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
        video_url: visualMode === 'animation' ? '' : videoForm.video_url
      });

      if (result && result.success !== false) {
        const createdId = result.item?.id;

        // 2. Jika mode video dan ada file yang dipilih, lakukan upload ke backend
        if (visualMode === 'video' && selectedFile && createdId && uploadVideoFile) {
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
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            PostgreSQL
          </span>
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

          {/* Grid Tipe Bahasa & Kategori */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Tipe Bahasa *</label>
              <select
                value={videoForm.tipe_bahasa}
                onChange={(e) => setVideoForm({ ...videoForm, tipe_bahasa: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="BISINDO">BISINDO</option>
                <option value="SIBI">SIBI</option>
                <option value="BOTH">Keduanya (BOTH)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1">Kategori</label>
              <input
                type="text"
                value={videoForm.kategori}
                onChange={(e) => setVideoForm({ ...videoForm, kategori: e.target.value })}
                placeholder="Contoh: Sapaan"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* OPSI PILIHAN VISUALISASI */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-bg/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-brand-500" />
                <span>Format Visualisasi Isyarat:</span>
              </label>
              <div className="flex rounded-xl bg-slate-200 dark:bg-slate-800 p-1">
                <button
                  type="button"
                  onClick={() => setVisualMode('animation')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    visualMode === 'animation'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  🎭 Animasi 2D
                </button>
                <button
                  type="button"
                  onClick={() => setVisualMode('video')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    visualMode === 'video'
                      ? 'bg-purple-600 text-white shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  🎬 Video MP4
                </button>
              </div>
            </div>

            {/* Pola Animasi Gestur Canvas 2D */}
            <div>
              <label className="font-semibold block mb-1 text-slate-600 dark:text-slate-400">
                Pola Gerakan Kinematics Canvas *
              </label>
              <select
                value={videoForm.gesture_pattern}
                onChange={(e) => setVideoForm({ ...videoForm, gesture_pattern: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
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
              <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center justify-between">
                  <label className="font-semibold block text-slate-700 dark:text-slate-300">
                    Unggah Berkas Video MP4:
                  </label>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    Maks 5 MB
                  </span>
                </div>

                <label className="w-full px-3.5 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-purple-100 transition-colors">
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
                <div>
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
                </div>

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
            )}
          </div>

          {/* Deskripsi Gerakan */}
          <div>
            <label className="font-semibold block mb-1">Deskripsi Panduan Gerakan</label>
            <textarea
              rows="2"
              value={videoForm.deskripsi_gerakan}
              onChange={(e) => setVideoForm({ ...videoForm, deskripsi_gerakan: e.target.value })}
              placeholder="Panduan visual gerakan tangan untuk pengguna..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
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
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            🟢 PostgreSQL Active (35+ Kata)
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
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 flex items-center gap-1">
                          <Film className="w-3 h-3" />
                          🎬 MP4 Asli
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          🎭 Canvas 2D
                        </span>
                      )}
                    </div>

                    <p className="text-slate-500 dark:text-slate-400">
                      {v.deskripsi_gerakan || 'Gerakan standar simulasi visual.'}
                    </p>

                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-3 pt-0.5">
                      <span>Engine: <strong className="text-slate-700 dark:text-slate-200">{v.gesture_pattern}</strong></span>
                      <span>&bull;</span>
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
