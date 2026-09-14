import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useContentStore } from '../../stores/useContentStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useThemeStore } from '../../stores/useThemeStore';
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
  FileText,
  Sun,
  Moon,
  ExternalLink,
  Globe,
  MessageCircle,
  Share2,
  Building2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Helper for platform badge in admin view
const getPlatformBadge = (platform = '') => {
  switch (platform.toLowerCase()) {
    case 'whatsapp':
      return { label: 'WhatsApp', bg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25' };
    case 'telegram':
      return { label: 'Telegram', bg: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/25' };
    case 'discord':
      return { label: 'Discord', bg: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/25' };
    case 'instagram':
      return { label: 'Instagram', bg: 'bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/25' };
    case 'website':
    default:
      return { label: 'Website', bg: 'bg-brand-500/15 text-brand-600 dark:text-brand-400 border-brand-500/25' };
  }
};

export default function AdminDashboard({ onBackToHome, onLogout }) {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
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
    communityList,
    addCommunity,
    submitCommunity,
    approveCommunity,
    rejectCommunity,
    deleteCommunity
  } = useContentStore();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'berita' | 'video' | 'timeline' | 'komunitas'

  // Handle browser Back button to show logout confirmation modal
  useEffect(() => {
    window.history.pushState({ adminSession: true }, '', '/admin');

    const handlePopState = () => {
      window.history.pushState({ adminSession: true }, '', '/admin');
      setShowLogoutConfirm(true);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    if (onLogout) {
      onLogout();
    } else if (onBackToHome) {
      onBackToHome();
    }
  };

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

  // Community Form State (Admin Direct Add)
  const [communityForm, setCommunityForm] = useState({
    nama: '',
    kategori: 'Organisasi Tuli',
    platform: 'WhatsApp',
    link: '',
    logo: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=200&q=80',
    anggota: '500+ Anggota',
    kontak: '',
    emailKontak: '',
    deskripsi: '',
    deskripsiLengkap: ''
  });
  const [communitySearch, setCommunitySearch] = useState('');

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

  const handleCreateCommunity = (e) => {
    e.preventDefault();
    if (!communityForm.nama || !communityForm.link || !communityForm.kontak) return;
    addCommunity({
      ...communityForm,
      logo: communityForm.logo || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=200&q=80',
      deskripsiLengkap: communityForm.deskripsiLengkap || communityForm.deskripsi
    });
    setCommunityForm({
      nama: '',
      kategori: 'Organisasi Tuli',
      platform: 'WhatsApp',
      link: '',
      logo: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=200&q=80',
      anggota: '500+ Anggota',
      kontak: '',
      emailKontak: '',
      deskripsi: '',
      deskripsiLengkap: ''
    });
    showToast(`Komunitas "${communityForm.nama}" berhasil ditambahkan dan langsung aktif di portal!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-white py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl glass-card border border-slate-200 dark:border-dark-border shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 p-0.5 shadow-lg shadow-brand-500/20 flex-shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-amber-400 text-base">
                S
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Dashboard Administrator SETARA
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/25">
                  Lokal Mode
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kelola konten berita, kamus video isyarat, milestone, dan jembatan komunitas nasional.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* User Profile */}
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800 pr-3">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                alt="Avatar"
                className="w-7 h-7 rounded-full object-cover"
              />
              <span className="font-semibold text-slate-900 dark:text-white">{user?.nama || 'Admin'}</span>
            </div>

            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Dedicated Logout Button */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 hover:border-red-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 hover:scale-105 active:scale-95 shadow-sm"
              title="Keluar dari sesi Administrator"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
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
            { id: 'komunitas', name: 'Kelola Komunitas', icon: Users }
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
                <span className="text-xs text-slate-400">Komunitas Terdaftar</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {communityList.filter(c => c.status === 'approved').length}
                </div>
                <div className="text-[11px] text-amber-400">
                  {communityList.filter(c => c.status === 'pending').length} Menunggu Persetujuan
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

              {/* Pending Community Submissions Card */}
              <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Pengajuan Komunitas Baru</span>
                  <button onClick={() => setActiveTab('komunitas')} className="text-amber-500 text-xs font-semibold hover:underline">
                    Kelola
                  </button>
                </h3>
                <div className="space-y-2">
                  {communityList.filter(c => c.status === 'pending').length > 0 ? (
                    communityList.filter(c => c.status === 'pending').slice(0, 3).map((c) => (
                      <div key={c.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{c.nama}</div>
                          <div className="text-[11px] text-slate-400">{c.platform} • PIC: {c.kontak}</div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              approveCommunity(c.id);
                              showToast(`Komunitas "${c.nama}" telah disetujui.`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                            <span>Terima</span>
                          </button>
                          <button
                            onClick={() => {
                              rejectCommunity(c.id);
                              showToast(`Pengajuan "${c.nama}" ditolak.`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                            <span>Tolak</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-400">
                      Tidak ada pengajuan komunitas yang menunggu persetujuan.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: News Management */}
        {activeTab === 'berita' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form */}
            <div className="lg:col-span-5 p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-brand-500" />
                <span>Publikasikan Berita Baru</span>
              </h3>

              <form onSubmit={handleCreateNews} className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                <div>
                  <label className="font-semibold block mb-1">Judul Artikel</label>
                  <input
                    type="text"
                    required
                    value={newsForm.judul}
                    onChange={(e) => setNewsForm({ ...newsForm, judul: e.target.value })}
                    placeholder="Contoh: Terobosan Isyarat 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Kategori</label>
                    <select
                      value={newsForm.kategori}
                      onChange={(e) => setNewsForm({ ...newsForm, kategori: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="Edukasi">Edukasi</option>
                      <option value="Teknologi">Teknologi</option>
                      <option value="Event">Event</option>
                      <option value="Budaya Tuli">Budaya Tuli</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Penulis</label>
                    <input
                      type="text"
                      value={newsForm.author}
                      onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Ringkasan Singkat</label>
                  <textarea
                    rows="2"
                    required
                    value={newsForm.ringkasan}
                    onChange={(e) => setNewsForm({ ...newsForm, ringkasan: e.target.value })}
                    placeholder="Ringkasan 1-2 kalimat..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Konten Lengkap</label>
                  <textarea
                    rows="5"
                    value={newsForm.konten}
                    onChange={(e) => setNewsForm({ ...newsForm, konten: e.target.value })}
                    placeholder="Isi berita lengkap..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-[11px]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-brand-600/20"
                >
                  <Upload className="w-4 h-4" />
                  <span>Terbitkan Berita</span>
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-7 p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Daftar Berita Aktif ({newsList.length})
              </h3>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {newsList.map((n) => (
                  <div key={n.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{n.judul}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-500">
                          {n.kategori}
                        </span>
                      </div>
                      <p className="text-slate-400 line-clamp-2">{n.ringkasan}</p>
                      <div className="text-[10px] text-slate-400">Oleh {n.author} • {n.tanggal}</div>
                    </div>

                    <button
                      onClick={() => {
                        deleteNews(n.id);
                        showToast('Berita berhasil dihapus.');
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

        {/* Tab 3: Dictionary Video CMS */}
        {activeTab === 'video' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form */}
            <div className="lg:col-span-5 p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-500" />
                <span>Tambah Isyarat Kamus Baru</span>
              </h3>

              <form onSubmit={handleCreateVideo} className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                <div>
                  <label className="font-semibold block mb-1">Kata / Frasa</label>
                  <input
                    type="text"
                    required
                    value={videoForm.kata}
                    onChange={(e) => setVideoForm({ ...videoForm, kata: e.target.value.toLowerCase() })}
                    placeholder="Contoh: semangat, terima kasih"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Tipe Bahasa</label>
                    <select
                      value={videoForm.tipe_bahasa}
                      onChange={(e) => setVideoForm({ ...videoForm, tipe_bahasa: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Pola Animasi Gestur (Engine)</label>
                  <select
                    value={videoForm.gesture_pattern}
                    onChange={(e) => setVideoForm({ ...videoForm, gesture_pattern: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 font-mono text-[11px]"
                  >
                    <option value="hand_wave_forehead">hand_wave_forehead (Melambai)</option>
                    <option value="point_chest">point_chest (Menunjuk Dada)</option>
                    <option value="palm_chest">palm_chest (Telapak Dada Sopan)</option>
                    <option value="fist_pump_down">fist_pump_down (Mengepal Semangat)</option>
                    <option value="two_hand_open_cross">two_hand_open_cross (Dua Tangan Terbuka)</option>
                    <option value="equal_parallel_hands">equal_parallel_hands (Tangan Sejajar)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Deskripsi Gerakan</label>
                  <textarea
                    rows="2"
                    value={videoForm.deskripsi_gerakan}
                    onChange={(e) => setVideoForm({ ...videoForm, deskripsi_gerakan: e.target.value })}
                    placeholder="Panduan visual gerakan tangan..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Upload className="w-4 h-4" />
                  <span>Tambahkan ke Kamus</span>
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-7 p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Kosa Kata Kustom Admin ({customVideos.length})
              </h3>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {customVideos.length > 0 ? (
                  customVideos.map((v) => (
                    <div key={v.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white uppercase">{v.kata}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-400">
                            {v.tipe_bahasa}
                          </span>
                        </div>
                        <p className="text-slate-400">{v.deskripsi_gerakan || 'Gerakan standar simulasi visual.'}</p>
                        <div className="text-[10px] text-slate-400 font-mono">Pattern: {v.gesture_pattern}</div>
                      </div>

                      <button
                        onClick={() => {
                          deleteCustomVideo(v.id);
                          showToast(`Kosa kata "${v.kata}" dihapus.`);
                        }}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    Belum ada kosa kata kustom yang ditambahkan oleh Admin. Kamus bawaan tetap aktif dengan 24 kata.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Milestone Timeline */}
        {activeTab === 'timeline' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form */}
            <div className="lg:col-span-5 p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-500" />
                <span>Tambah Milestone Baru</span>
              </h3>

              <form onSubmit={handleCreateTimeline} className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
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

        {/* Tab 5: Kelola Komunitas (SETARA sebagai Jembatan) */}
        {activeTab === 'komunitas' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Kelola Jembatan Komunitas
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Tambah komunitas secara langsung, tinjau pengajuan dari pihak luar, dan kelola komunitas aktif.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                    {communityList.filter(c => c.status === 'pending').length} Pengajuan Pending
                  </span>
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/25">
                    {communityList.filter(c => c.status === 'approved').length} Komunitas Aktif
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Tambah Komunitas Baru (Admin) */}
              <div className="lg:col-span-5 p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Tambah Komunitas Baru
                    </h4>
                    <p className="text-[11px] text-slate-500">Langsung diterbitkan di landing page</p>
                  </div>
                </div>

                <form onSubmit={handleCreateCommunity} className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                  <div>
                    <label className="font-semibold block mb-1">Nama Komunitas *</label>
                    <input
                      type="text"
                      required
                      value={communityForm.nama}
                      onChange={(e) => setCommunityForm({ ...communityForm, nama: e.target.value })}
                      placeholder="Contoh: Deaf Club Indonesia"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">Platform *</label>
                      <select
                        value={communityForm.platform}
                        onChange={(e) => setCommunityForm({ ...communityForm, platform: e.target.value })}
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
                        value={communityForm.kategori}
                        onChange={(e) => setCommunityForm({ ...communityForm, kategori: e.target.value })}
                        placeholder="Contoh: Belajar Isyarat"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Link URL *</label>
                    <input
                      type="url"
                      required
                      value={communityForm.link}
                      onChange={(e) => setCommunityForm({ ...communityForm, link: e.target.value })}
                      placeholder="https://chat.whatsapp.com/... atau https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-mono text-[11px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">Estimasi Anggota</label>
                      <input
                        type="text"
                        value={communityForm.anggota}
                        onChange={(e) => setCommunityForm({ ...communityForm, anggota: e.target.value })}
                        placeholder="Contoh: 1.000+ Anggota"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div>
                      <label className="font-semibold block mb-1">URL Logo (Opsional)</label>
                      <input
                        type="url"
                        value={communityForm.logo}
                        onChange={(e) => setCommunityForm({ ...communityForm, logo: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">PIC / Kontak *</label>
                      <input
                        type="text"
                        required
                        value={communityForm.kontak}
                        onChange={(e) => setCommunityForm({ ...communityForm, kontak: e.target.value })}
                        placeholder="Nama koordinator"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div>
                      <label className="font-semibold block mb-1">Email PIC</label>
                      <input
                        type="email"
                        value={communityForm.emailKontak}
                        onChange={(e) => setCommunityForm({ ...communityForm, emailKontak: e.target.value })}
                        placeholder="email@komunitas.id"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Deskripsi Singkat *</label>
                    <textarea
                      rows="2"
                      required
                      value={communityForm.deskripsi}
                      onChange={(e) => setCommunityForm({ ...communityForm, deskripsi: e.target.value })}
                      placeholder="Penjelasan ringkas komunitas..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Deskripsi Lengkap (Opsional)</label>
                    <textarea
                      rows="2"
                      value={communityForm.deskripsiLengkap}
                      onChange={(e) => setCommunityForm({ ...communityForm, deskripsiLengkap: e.target.value })}
                      placeholder="Detail profil, visi, dan kegiatan..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-brand-600/20 hover:scale-[1.02] active:scale-98 transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Publikasikan Komunitas</span>
                  </button>
                </form>
              </div>

              {/* Lists Section: Pending & Approved */}
              <div className="lg:col-span-7 space-y-6">
                {/* Sub-section: Pengajuan Masuk (Pending) */}
                <div className="p-6 rounded-3xl glass-card border border-amber-500/30 bg-amber-500/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                      <span>Pengajuan Komunitas Masuk ({communityList.filter(c => c.status === 'pending').length})</span>
                    </h4>
                    <span className="text-[11px] text-amber-500 font-semibold">Menunggu Review</span>
                  </div>

                  <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                    {communityList.filter(c => c.status === 'pending').length > 0 ? (
                      communityList.filter(c => c.status === 'pending').map((c) => (
                        <div key={c.id} className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-amber-500/20 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs shadow-sm">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-slate-900 dark:text-white text-sm">{c.nama}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPlatformBadge(c.platform).bg}`}>
                                {c.platform}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">({c.kategori})</span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 line-clamp-2">{c.deskripsi}</p>
                            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                              <span>PIC: <strong className="text-slate-700 dark:text-slate-200">{c.kontak}</strong></span>
                              <span>Email: {c.emailKontak}</span>
                              <a
                                href={c.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-500 hover:underline inline-flex items-center gap-0.5"
                              >
                                <span>Link Tautan</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => {
                                approveCommunity(c.id);
                                showToast(`Komunitas "${c.nama}" telah disetujui dan aktif.`);
                              }}
                              className="w-full px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1 cursor-pointer text-xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Setujui</span>
                            </button>
                            <button
                              onClick={() => {
                                rejectCommunity(c.id);
                                showToast(`Pengajuan "${c.nama}" ditolak.`);
                              }}
                              className="w-full px-3 py-1.5 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-500 font-bold flex items-center justify-center gap-1 cursor-pointer text-xs"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Tolak</span>
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-xs text-slate-400">
                        Tidak ada pengajuan komunitas baru yang menunggu persetujuan.
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub-section: Daftar Komunitas Terdaftar (Approved) */}
                <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Komunitas Terverifikasi ({communityList.filter(c => c.status === 'approved').length})
                    </h4>
                    <div className="relative w-full sm:w-48">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={communitySearch}
                        onChange={(e) => setCommunitySearch(e.target.value)}
                        placeholder="Cari komunitas..."
                        className="w-full pl-8 pr-3 py-1 text-xs rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {communityList
                      .filter(c => c.status === 'approved')
                      .filter(c => c.nama.toLowerCase().includes(communitySearch.toLowerCase()) || c.platform.toLowerCase().includes(communitySearch.toLowerCase()))
                      .map((c) => (
                        <div key={c.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={c.logo}
                              alt={c.nama}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=200&q=80';
                              }}
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-slate-900 dark:text-white truncate">{c.nama}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPlatformBadge(c.platform).bg}`}>
                                  {c.platform}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-0.5 flex-wrap">
                                <span>{c.kategori}</span>
                                <span>•</span>
                                <span>{c.anggota}</span>
                                <span>•</span>
                                <a
                                  href={c.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-brand-500 hover:underline inline-flex items-center gap-0.5"
                                >
                                  <span>Buka Link</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              deleteCommunity(c.id);
                              showToast(`Komunitas "${c.nama}" berhasil dihapus.`);
                            }}
                            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 cursor-pointer shrink-0 transition-colors"
                            title="Hapus Komunitas"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Card Modal Dialog (Rendered via Portal) */}
      {showLogoutConfirm && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div 
            className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-2xl relative animate-scale-up space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Icon Badge & Title */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/15 text-red-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/10">
                <LogOut className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Konfirmasi Keluar
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Dashboard Administrator SETARA
                </p>
              </div>
            </div>

            {/* Description Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
              <p>
                Apakah Anda yakin ingin <strong>keluar / logout</strong> dari sesi Administrator? Anda perlu memasukkan kredensial kembali untuk mengakses dashboard ini.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
                <span>Akun aktif: <strong className="text-slate-700 dark:text-slate-200">{user?.email || 'admin@setara.id'}</strong></span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-lg shadow-red-600/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Ya, Keluar</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
