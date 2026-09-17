/**
 * ==============================================================================
 * File: VideoTab.jsx
 * Direktori: src/components/admin/tabs/
 * Deskripsi: Modul CMS Kamus Kosakata Isyarat & Video Platform SETARA.
 * Integrasi:
 *   - Terhubung langsung ke API backend Django Ninja (/api/video/*).
 *   - Katalog lengkap pola engine canvas 2D procedural kinematics.
 *   - Dukungan link / file video MP4 peragaan isyarat nyata.
 * ==============================================================================
 */

import React, { useState } from 'react';
import { Plus, Trash2, Video as VideoIcon, Upload, Sparkles, Film } from 'lucide-react';

export default function VideoTab({
  customVideos = [],
  addCustomVideo,
  deleteCustomVideo,
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateVideo = async (e) => {
    e.preventDefault();
    if (!videoForm.kata.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await addCustomVideo(videoForm);
      setIsSubmitting(false);

      if (result && result.success !== false) {
        setVideoForm({
          kata: '',
          tipe_bahasa: 'BISINDO',
          kategori: 'Umum',
          durasi: 2,
          gesture_pattern: 'hand_wave_forehead',
          deskripsi_gerakan: '',
          video_url: ''
        });

        if (showToast) {
          showToast(`Kosa kata "${videoForm.kata}" berhasil ditambahkan ke database.`);
        }
      } else if (showToast) {
        showToast(result.error || 'Gagal menambahkan kosakata.');
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
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-500" />
          <span>Tambah Isyarat Kamus Baru</span>
        </h3>

        <form onSubmit={handleCreateVideo} className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
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

          {/* Pola Animasi Gestur (Engine) Lengkap & Terkategori */}
          <div>
            <label className="font-semibold block mb-1">Pola Animasi Gestur (Engine) *</label>
            <select
              value={videoForm.gesture_pattern}
              onChange={(e) => setVideoForm({ ...videoForm, gesture_pattern: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
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

              <optgroup label="Kesopanan & Sosial">
                <option value="fingers_chin_forward">fingers_chin_forward (Jari Dagu ke Depan / Terima Kasih)</option>
                <option value="palms_down_spread">palms_down_spread (Telapak Melebar / Sama-sama)</option>
                <option value="fist_circular_chest">fist_circular_chest (Memutar di Dada / Maaf)</option>
                <option value="pray_hands">pray_hands (Kedua Telapak Rapat / Tolong, Mohon)</option>
                <option value="support_motion">support_motion (Menopang Lengan / Bantu)</option>
                <option value="hook_index_fingers">hook_index_fingers (Mengaitkan Telunjuk / Teman)</option>
                <option value="circle_touch_pinkies">circle_touch_pinkies (Kelingking Melingkar / Keluarga)</option>
              </optgroup>

              <optgroup label="Aktivitas & Identitas">
                <option value="learn_forehead">learn_forehead (Menyerap Ilmu ke Dahi / Belajar)</option>
                <option value="rotate_index_fingers">rotate_index_fingers (Telunjuk Berputar / Isyarat)</option>
                <option value="b_hands_wave">b_hands_wave (Gerakan Huruf B / Bahasa)</option>
                <option value="i_hand_flutter">i_hand_flutter (Kelingking Huruf I / Indonesia)</option>
                <option value="ear_to_mouth_touch">ear_to_mouth_touch (Telinga ke Bibir / Tuli)</option>
                <option value="cup_ear">cup_ear (Tangan di Telinga / Dengar)</option>
              </optgroup>

              <optgroup label="Emosi & Perasaan">
                <option value="cross_chest_hug">cross_chest_hug (Menyilang di Dada / Sayang, Cinta)</option>
                <option value="palms_brush_chest_up">palms_brush_chest_up (Menyapu Dada ke Atas / Senang)</option>
                <option value="fist_pump_down">fist_pump_down (Mengepal Bertenaga / Semangat)</option>
                <option value="equal_parallel_hands">equal_parallel_hands (Telapak Sejajar / Setara, Sama)</option>
              </optgroup>

              <optgroup label="Kebutuhan & Bangunan">
                <option value="fingertips_to_mouth">fingertips_to_mouth (Jari ke Mulut / Makan)</option>
                <option value="c_cup_to_mouth">c_cup_to_mouth (Bentuk C Cangkir / Minum)</option>
                <option value="roof_shape_hands">roof_shape_hands (Atap Rumah / Rumah)</option>
                <option value="clap_palms_horizontal">clap_palms_horizontal (Tepuk Tangan / Sekolah)</option>
                <option value="chest_to_fists_strong">chest_to_fists_strong (Tangan Bertenaga / Sehat)</option>
              </optgroup>
            </select>
          </div>

          {/* URL Video MP4 (Opsional - untuk rekaman asli) */}
          <div>
            <label className="font-semibold block mb-1">
              URL Video / File MP4 <span className="font-normal text-slate-400">(Opsional untuk video asli)</span>
            </label>
            <div className="relative">
              <Film className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="url"
                value={videoForm.video_url}
                onChange={(e) => setVideoForm({ ...videoForm, video_url: e.target.value })}
                placeholder="https://... atau path file video mp4"
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
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
            disabled={isSubmitting}
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
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
          <span>Kamus Kosakata Database ({customVideos.length})</span>
          <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            PostgreSQL Active
          </span>
        </h3>

        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
          {customVideos.length > 0 ? (
            customVideos.map((v) => (
              <div 
                key={v.id} 
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 text-xs hover:border-emerald-500/40 transition-colors"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wide">{v.kata}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-400">
                      {v.tipe_bahasa}
                    </span>
                    {v.kategori && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {v.kategori}
                      </span>
                    )}
                    {v.video_url && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center gap-1">
                        <Film className="w-2.5 h-2.5" />
                        Video
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">{v.deskripsi_gerakan || 'Gerakan standar simulasi visual.'}</p>
                  <div className="text-[10px] text-slate-400 font-mono">Pola Engine: {v.gesture_pattern} &bull; Durasi: {v.durasi || 2}s</div>
                </div>

                {/* Tombol Hapus Kosakata */}
                <button
                  type="button"
                  onClick={async () => {
                    await deleteCustomVideo(v.id);
                    if (showToast) showToast(`Kosa kata "${v.kata}" berhasil dihapus.`);
                  }}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 cursor-pointer shrink-0 transition-colors"
                  title="Hapus kata dari kamus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
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