import React, { useState } from 'react';
import { useContentStore } from '../../stores/useContentStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { 
  LayoutDashboard, 
  Newspaper, 
  Video, 
  Milestone, 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Upload, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  LogOut,
  ArrowLeft,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminDashboard({ onBackToHome }) {
  const { user, logout } = useAuthStore();
  const {
    newsList,
    addNews,
    deleteNews,
    timelineList,
    addTimelineMilestone,
    deleteTimelineMilestone,
    customVideos,
    addCustomVideo,
    deleteCustomVideo,
    communityMembers,
    approveMember,
    rejectMember
  } = useContentStore();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'berita' | 'video' | 'timeline' | 'komunitas'

  // News Form State
  const [newsForm, setNewsForm] = useState({
    judul: '',
    kategori: 'Edukasi',
    ringkasan: '',
    konten: '',
    thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    author: 'Administrator'
  });

  // Video Form State
  const [videoForm, setVideoForm] = useState({
    kata: '',
    tipe_bahasa: 'BISINDO',
    kategori: 'Umum',
    durasi: 2,
    deskripsi_gerakan: '',
    gesture_pattern: 'hand_wave_forehead',
    contoh_kalimat: ''
  });

  // Timeline Form State
  const [timelineForm, setTimelineForm] = useState({
    judul: '',
    tanggal: 'September 2026',
    kategori: 'Milestone',
    deskripsi: '',
    icon: 'Rocket'
  });

  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleCreateNews = (e) => {
    e.preventDefault();
    if (!newsForm.judul || !newsForm.ringkasan) return;
    addNews(newsForm);
    setNewsForm({
      judul: '',
      kategori: 'Edukasi',
      ringkasan: '',
      konten: '',
      thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
      author: 'Administrator'
    });
    showToast('Berita baru berhasil dipublikasikan!');
  };

  const handleCreateVideo = (e) => {
    e.preventDefault();
    if (!videoForm.kata) return;
    addCustomVideo(videoForm);
    setVideoForm({
      kata: '',
      tipe_bahasa: 'BISINDO',
      kategori: 'Umum',
      durasi: 2,
      deskripsi_gerakan: '',
      gesture_pattern: 'hand_wave_forehead',
      contoh_kalimat: ''
    });
    showToast(`Kosa kata "${videoForm.kata}" berhasil ditambahkan ke kamus lokal!`);
  };

  const handleCreateTimeline = (e) => {
    e.preventDefault();
    if (!timelineForm.judul) return;
    addTimelineMilestone(timelineForm);
    setTimelineForm({
      judul: '',
      tanggal: 'September 2026',
      kategori: 'Milestone',
      deskripsi: '',
      icon: 'Rocket'
    });
    showToast('Milestone perjalanan baru berhasil ditambahkan!');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl glass-card border border-slate-200 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight">
                  Dashboard Administrator SETARA
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-400 border border-brand-500/30">
                  Lokal Mode
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Kelola konten berita, kamus video isyarat, milestone, dan keanggotaan komunitas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400 border-r border-slate-200 dark:border-slate-800 pr-3">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                alt="Avatar"
                className="w-7 h-7 rounded-full object-cover"
              />
              <span className="font-semibold text-slate-900 dark:text-white">{user?.nama || 'Admin'}</span>
            </div>
            <button
              onClick={onBackToHome}
              className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold cursor-pointer"
            >
              Lihat Website
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMsg && (
          <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { id: 'overview', name: 'Ringkasan', icon: LayoutDashboard },
            { id: 'berita', name: 'Kelola Berita', icon: Newspaper },
            { id: 'video', name: 'Kamus Video Isyarat', icon: Video },
            { id: 'timeline', name: 'Milestone Timeline', icon: Milestone },
            { id: 'komunitas', name: 'Moderasi Komunitas', icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap border ${
                  activeTab === tab.id
                    ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-600/20'
                    : 'bg-white dark:bg-dark-card text-slate-600 dark:text-slate-400 border-slate-200 dark:border-dark-border hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-1">
                <span className="text-xs text-slate-400">Total Berita Terbit</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{newsList.length}</div>
                <div className="text-[11px] text-amber-500">4 Kategori Aktif</div>
              </div>

              <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-1">
                <span className="text-xs text-slate-400">Kosa Kata Kamus</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {24 + customVideos.length} Kata
                </div>
                <div className="text-[11px] text-brand-400">SIBI & BISINDO Ready</div>
              </div>

              <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-1">
                <span className="text-xs text-slate-400">Milestone Timeline</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{timelineList.length}</div>
                <div className="text-[11px] text-purple-400">Jejak Perkembangan</div>
              </div>

              <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-1">
                <span className="text-xs text-slate-400">Pendaftar Komunitas</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{communityMembers.length}</div>
                <div className="text-[11px] text-amber-400">
                  {communityMembers.filter(m => m.status === 'pending').length} Menunggu Persetujuan
                </div>
              </div>
            </div>

            {/* Quick Summary View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent News Card */}
              <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Daftar Berita Terbaru</span>
                  <button onClick={() => setActiveTab('berita')} className="text-brand-500 text-xs font-semibold hover:underline">
                    Kelola
                  </button>
                </h3>
                <div className="space-y-2">
                  {newsList.slice(0, 3).map((n) => (
                    <div key={n.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{n.judul}</div>
                        <div className="text-[11px] text-slate-400">{n.kategori} • {n.tanggal}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        Terbit
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Community Members */}
              <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Persetujuan Anggota Komunitas</span>
                  <button onClick={() => setActiveTab('komunitas')} className="text-emerald-500 text-xs font-semibold hover:underline">
                    Kelola
                  </button>
                </h3>
                <div className="space-y-2">
                  {communityMembers.slice(0, 3).map((m) => (
                    <div key={m.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{m.nama}</div>
                        <div className="text-[11px] text-slate-400">{m.peran} • {m.email}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.status === 'approved' 
                          ? 'bg-amber-500/20 text-amber-400' 
                          : 'bg-brand-500/20 text-brand-400'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Manage News (CRUD) */}
        {activeTab === 'berita' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Column */}
            <div className="lg:col-span-5 p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-brand-500" />
                <span>Publikasikan Berita Baru</span>
              </h3>

              <form onSubmit={handleCreateNews} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Judul Berita</label>
                  <input
                    type="text"
                    required
                    value={newsForm.judul}
                    onChange={(e) => setNewsForm({ ...newsForm, judul: e.target.value })}
                    placeholder="Contoh: Lokakarya Bahasa Isyarat Inklusif"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Kategori</label>
                  <select
                    value={newsForm.kategori}
                    onChange={(e) => setNewsForm({ ...newsForm, kategori: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700"
                  >
                    <option value="Edukasi">Edukasi</option>
                    <option value="Teknologi">Teknologi</option>
                    <option value="Komunitas">Komunitas</option>
                    <option value="Event">Event</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Ringkasan / Cuplikan</label>
                  <textarea
                    rows="2"
                    required
                    value={newsForm.ringkasan}
                    onChange={(e) => setNewsForm({ ...newsForm, ringkasan: e.target.value })}
                    placeholder="Cuplikan singkat berita..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Isi Konten Lengkap</label>
                  <textarea
                    rows="4"
                    value={newsForm.konten}
                    onChange={(e) => setNewsForm({ ...newsForm, konten: e.target.value })}
                    placeholder="Isi berita lengkap..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">URL Gambar Thumbnail</label>
                  <input
                    type="text"
                    value={newsForm.thumbnail}
                    onChange={(e) => setNewsForm({ ...newsForm, thumbnail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Upload className="w-4 h-4" />
                  <span>Publikasikan Sekarang</span>
                </button>
              </form>
            </div>

            {/* List Column */}
            <div className="lg:col-span-7 p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Daftar Berita ({newsList.length})
              </h3>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {newsList.map((n) => (
                  <div key={n.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-400">
                        {n.kategori}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {n.judul}
                      </h4>
                      <p className="text-slate-400 line-clamp-1">{n.ringkasan}</p>
                      <div className="text-[10px] text-slate-500">{n.tanggal} • {n.views} Views</div>
                    </div>

                    <button
                      onClick={() => {
                        deleteNews(n.id);
                        showToast('Berita berhasil dihapus.');
                      }}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 cursor-pointer shrink-0"
                      title="Hapus Berita"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Manage Sign Videos in Dictionary */}
        {activeTab === 'video' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form */}
            <div className="lg:col-span-5 p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-brand-500" />
                <span>Tambah Kosa Kata Isyarat Baru</span>
              </h3>

              <form onSubmit={handleCreateVideo} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Kata Kunci</label>
                  <input
                    type="text"
                    required
                    value={videoForm.kata}
                    onChange={(e) => setVideoForm({ ...videoForm, kata: e.target.value })}
                    placeholder="Contoh: sahabat, rumah, makan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Sistem Bahasa</label>
                    <select
                      value={videoForm.tipe_bahasa}
                      onChange={(e) => setVideoForm({ ...videoForm, tipe_bahasa: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700"
                    >
                      <option value="BOTH">Keduanya (SIBI & BISINDO)</option>
                      <option value="BISINDO">BISINDO</option>
                      <option value="SIBI">SIBI</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Durasi (Detik)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={videoForm.durasi}
                      onChange={(e) => setVideoForm({ ...videoForm, durasi: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Deskripsi Gerakan</label>
                  <textarea
                    rows="2"
                    value={videoForm.deskripsi_gerakan}
                    onChange={(e) => setVideoForm({ ...videoForm, deskripsi_gerakan: e.target.value })}
                    placeholder="Panduan peragaan posisi tangan dan ekspresi..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Contoh Kalimat</label>
                  <input
                    type="text"
                    value={videoForm.contoh_kalimat}
                    onChange={(e) => setVideoForm({ ...videoForm, contoh_kalimat: e.target.value })}
                    placeholder="Contoh penggunaan dalam kalimat..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Upload className="w-4 h-4" />
                  <span>Simpan ke Kamus Lokal</span>
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-7 p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Kosa Kata Tambahan ({customVideos.length})
              </h3>

              {customVideos.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
                  Belum ada kosa kata kustom yang ditambahkan secara manual. Kosa kata bawaan kamus inti (24 kata) sudah aktif di modul penerjemah.
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {customVideos.map((v) => (
                    <div key={v.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-amber-400 capitalize">"{v.kata}"</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-400">
                            {v.tipe_bahasa}
                          </span>
                        </div>
                        <p className="text-slate-400">{v.deskripsi_gerakan}</p>
                      </div>

                      <button
                        onClick={() => {
                          deleteCustomVideo(v.id);
                          showToast(`Kata "${v.kata}" dihapus.`);
                        }}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Manage Timeline Milestones */}
        {activeTab === 'timeline' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form */}
            <div className="lg:col-span-5 p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-500" />
                <span>Tambah Milestone Baru</span>
              </h3>

              <form onSubmit={handleCreateTimeline} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Judul Milestone</label>
                  <input
                    type="text"
                    required
                    value={timelineForm.judul}
                    onChange={(e) => setTimelineForm({ ...timelineForm, judul: e.target.value })}
                    placeholder="Contoh: Rilis Model YOLO 11 v2"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Waktu / Bulan</label>
                    <input
                      type="text"
                      value={timelineForm.tanggal}
                      onChange={(e) => setTimelineForm({ ...timelineForm, tanggal: e.target.value })}
                      placeholder="Contoh: Oktober 2026"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Kategori</label>
                    <input
                      type="text"
                      value={timelineForm.kategori}
                      onChange={(e) => setTimelineForm({ ...timelineForm, kategori: e.target.value })}
                      placeholder="Contoh: Inovasi AI"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Deskripsi Milestone</label>
                  <textarea
                    rows="3"
                    value={timelineForm.deskripsi}
                    onChange={(e) => setTimelineForm({ ...timelineForm, deskripsi: e.target.value })}
                    placeholder="Penjelasan pencapaian penting..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Upload className="w-4 h-4" />
                  <span>Tambahkan Milestone</span>
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-7 p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Daftar Milestone ({timelineList.length})
              </h3>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {timelineList.map((t) => (
                  <div key={t.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{t.judul}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({t.tanggal})</span>
                      </div>
                      <p className="text-slate-400">{t.deskripsi}</p>
                    </div>

                    <button
                      onClick={() => {
                        deleteTimelineMilestone(t.id);
                        showToast('Milestone berhasil dihapus.');
                      }}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Community Moderation */}
        {activeTab === 'komunitas' && (
          <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Daftar Permintaan Bergabung Komunitas ({communityMembers.length})
            </h3>

            <div className="space-y-3">
              {communityMembers.map((m) => (
                <div key={m.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{m.nama}</span>
                      <span className="text-slate-400">({m.email})</span>
                    </div>
                    <div className="text-slate-400">
                      Peran: <strong className="text-slate-200">{m.peran}</strong> • Tanggal: {m.tanggal}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {m.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => {
                            approveMember(m.id);
                            showToast(`${m.nama} telah disetujui bergabung.`);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Terima</span>
                        </button>
                        <button
                          onClick={() => {
                            rejectMember(m.id);
                            showToast(`${m.nama} ditolak.`);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Tolak</span>
                        </button>
                      </>
                    ) : (
                      <span className={`px-3 py-1 rounded-xl font-bold uppercase text-[10px] ${
                        m.status === 'approved' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        Status: {m.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
