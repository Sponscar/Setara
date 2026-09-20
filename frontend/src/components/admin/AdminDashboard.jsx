/**
 * ==============================================================================
 * File: AdminDashboard.jsx
 * Direktori: src/components/admin/
 * Deskripsi: Container Utama Dashboard Administrator SETARA.
 * Pattern:
 *   - Orchestrator / Container Component Pattern: Menghubungkan Zustand store
 *     dengan sub-komponen tab presentasional.
 *   - Single Responsibility Principle (SRP): Sub-tampilan didelegasikan ke folder tabs/
 *     dan modal didelegasikan ke folder modals/.
 *   - Protected Route Integration: Diproteksi melalui state autentikasi di App.jsx.
 *   - History Popstate Guard: Menangkap tombol Back browser untuk menampilkan konfirmasi logout.
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import { useContentStore } from '../../stores/useContentStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { 
  LayoutDashboard, 
  Newspaper, 
  Video, 
  Milestone, 
  Users, 
  LogOut,
  Sun,
  Moon,
  Sparkles,
  ExternalLink
} from 'lucide-react';

// Sub-komponen Tabs
import OverviewTab from './tabs/OverviewTab';
import NewsTab from './tabs/NewsTab';
import VideoTab from './tabs/VideoTab';
import TimelineTab from './tabs/TimelineTab';
import CommunityTab from './tabs/CommunityTab';

// Sub-komponen Modals
import LogoutConfirmModal from './modals/LogoutConfirmModal';
import EditCommunityModal from './modals/EditCommunityModal';
import EditNewsModal from './modals/EditNewsModal';
import EditVideoModal from './modals/EditVideoModal';

/**
 * Komponen Utama AdminDashboard.
 * 
 * @param {Object} props
 * @param {Function} props.onBackToHome - Callback untuk kembali ke halaman utama / landing
 * @param {Function} props.onLogout - Callback saat administrator berhasil logout
 */
export default function AdminDashboard({ onBackToHome, onLogout }) {
  // --- 1. GLOBAL STATE SUBSCRIPTIONS (ZUSTAND) ---
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const {
    newsList,
    fetchNews,
    addNews,
    updateNews,
    deleteNews,
    timelineList,
    fetchTimeline,
    addTimelineMilestone,
    deleteTimelineMilestone,
    customVideos,
    fetchVideos,
    addCustomVideo,
    updateCustomVideo,
    uploadVideoFile,
    deleteCustomVideo,
    communityList,
    fetchCommunities,
    addCommunity,
    approveCommunity,
    rejectCommunity,
    updateCommunity,
    deleteCommunity,
    fetchTestimonials
  } = useContentStore();

  useEffect(() => {
    fetchNews(true);
    fetchTimeline();
    fetchCommunities(true);
    fetchVideos(true);
    fetchTestimonials();
  }, []);

  // --- 2. LOCAL STATE ---
  // Tab aktif saat ini ('overview' | 'berita' | 'video' | 'timeline' | 'komunitas')
  const [activeTab, setActiveTab] = useState('overview');

  // State untuk modal konfirmasi logout
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // State objek komunitas yang sedang diedit (null jika modal edit tertutup)
  const [editingCommunity, setEditingCommunity] = useState(null);
  const [editingNews, setEditingNews] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);

  // State notifikasi toast
  const [toastMessage, setToastMessage] = useState('');

  // --- 3. BROWSER HISTORY & LOGOUT CONFIRMATION GUARD ---
  useEffect(() => {
    window.history.pushState({ adminSession: true }, '', '/admin');

    const handlePopState = () => {
      // Pertahankan URL di /admin dan tampilkan dialog konfirmasi logout
      window.history.pushState({ adminSession: true }, '', '/admin');
      setShowLogoutConfirm(true);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  /**
   * Menampilkan pesan toast sementara selama 3 detik
   */
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  /**
   * Menangani konfirmasi final logout
   */
  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    if (onLogout) {
      onLogout();
    } else if (onBackToHome) {
      onBackToHome();
    }
  };

  /**
   * Menangani pembukaan modal edit komunitas terverifikasi
   */

  /**
   * Menangani pembukaan modal edit berita
   */
  const handleOpenEditNewsModal = (news) => {
    setEditingNews(news);
  };

  /**
   * Menangani penyimpanan perubahan data edit berita
   */
  const handleSaveEditNews = async (id, updatedData) => {
    try {
      const res = await updateNews(id, updatedData);
      setEditingNews(null);
      if (res && res.success !== false) {
        showToast(`Berita "${updatedData.judul}" berhasil diperbarui.`);
      } else {
        showToast(res?.error || 'Gagal memperbarui berita.');
      }
    } catch (err) {
      setEditingNews(null);
      showToast('Terjadi kesalahan saat memperbarui berita.');
    }
  };

  const handleOpenEditModal = (community) => {
    setEditingCommunity(community);
  };

  /**
   * Menangani penyimpanan perubahan data edit komunitas
   */
  const handleSaveEditCommunity = async (id, updatedData) => {
    try {
      const res = await updateCommunity(id, updatedData);
      setEditingCommunity(null);
      if (res && res.success !== false) {
        showToast(`Komunitas "${updatedData.nama}" berhasil diperbarui.`);
      } else {
        showToast(res?.error || 'Gagal memperbarui komunitas.');
      }
    } catch (err) {
      setEditingCommunity(null);
      showToast('Terjadi kesalahan saat memperbarui komunitas.');
    }
  };

  // Definisi daftar tab navigasi dashboard
  const navTabs = [
    { id: 'overview', label: 'Ringkasan', icon: LayoutDashboard },
    { id: 'berita', label: 'Kelola Berita', icon: Newspaper, count: newsList.length },
    { id: 'video', label: 'Kamus Isyarat', icon: Video, count: 24 + customVideos.length },
    { id: 'timeline', label: 'Milestone', icon: Milestone, count: timelineList.length },
    { 
      id: 'komunitas', 
      label: 'Kelola Komunitas', 
      icon: Users,
      pendingCount: communityList.filter((c) => c.status === 'pending').length 
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-300 bg-grid-pattern relative selection:bg-brand-600 selection:text-white">
      {/* ======================================================================= */}
      {/* HEADER / TOP NAVBAR ADMINISTRATOR                                       */}
      {/* ======================================================================= */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-dark-card/80 border-b border-slate-200 dark:border-dark-border px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
        {/* Identitas Logo & Partner — Sama persis dengan susunan Navbar Landing Page */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* SETARA Brand Logo */}
          <div
            onClick={onBackToHome}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group"
            title="Kembali ke Beranda"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-md shadow-brand-500/15 group-hover:scale-105 transition-all duration-500 bg-white border border-slate-200/80 dark:border-white/10">
              <img
                src="/Setara Logo.jpg"
                alt="SETARA Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black tracking-tight text-slate-900 dark:text-white text-base sm:text-lg">
                  SETARA
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                  Admin
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Pusat Kendali Konten & Komunitas
              </p>
            </div>
          </div>

          {/* Subtle Vertical Divider */}
          <div className="h-6 w-px bg-slate-200/80 dark:bg-slate-700/80 hidden sm:block" />

          {/* Partner / Event Logos (JACK, TCC & TRIPLE-C) */}
          <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
            <div
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center p-1 rounded-xl bg-white border border-slate-200/80 dark:border-white/10 shadow-xs hover:scale-105 transition-all overflow-hidden"
              title="JACK"
            >
              <img src="/JACK 2.png" alt="Logo JACK" className="w-full h-full object-contain" />
            </div>
            <div
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center p-1 rounded-xl bg-white border border-slate-200/80 dark:border-white/10 shadow-xs hover:scale-105 transition-all overflow-hidden"
              title="TCC"
            >
              <img src="/Salinan LOGO TCC.png" alt="Logo TCC" className="w-full h-full object-contain" />
            </div>
            <div
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center p-1 rounded-xl bg-white border border-slate-200/80 dark:border-white/10 shadow-xs hover:scale-105 transition-all overflow-hidden"
              title="TRIPLE-C"
            >
              <img src="/Salinan LOGO TRIPLE-C.png" alt="Logo TRIPLE-C" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>

        {/* Action Controls & University Logos (Sama persis dengan bagian kanan Navbar Landing) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Institutional / University Logos (UINSA & UISI) */}
          <div className="hidden md:flex items-center gap-1.5 sm:gap-2 pr-1">
            <div
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center p-1 rounded-xl bg-white border border-slate-200/80 dark:border-white/10 shadow-xs hover:scale-105 transition-all overflow-hidden"
              title="UIN Sunan Ampel Surabaya"
            >
              <img src="/Logo UINSA.png" alt="Logo UINSA" className="w-full h-full object-contain" />
            </div>
            <div
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center p-1 rounded-xl bg-white border border-slate-200/80 dark:border-white/10 shadow-xs hover:scale-105 transition-all overflow-hidden"
              title="Universitas Internasional Semen Indonesia (UISI)"
            >
              <img src="/uisi.jpg" alt="Logo UISI" className="w-full h-full object-contain rounded-xs" />
            </div>
          </div>

          {/* Subtle Vertical Divider */}
          <div className="h-6 w-px bg-slate-200/80 dark:bg-slate-700/80 hidden md:block" />
          {/* Tombol Lihat Website */}
          <button
            type="button"
            onClick={onBackToHome}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Kembali ke Landing Page"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Lihat Web</span>
          </button>

          {/* Tombol Toggle Tema Light/Dark */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Ubah Tema"
            aria-label="Ubah Tema"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Info Akun Login */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="truncate max-w-[140px]">{user?.email || 'admin@setara.id'}</span>
          </div>

          {/* Tombol Logout */}
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 active:scale-95"
            title="Keluar dari sesi administrator"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* ======================================================================= */}
      {/* NOTIFIKASI TOAST BANNER                                                 */}
      {/* ======================================================================= */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-2xl bg-slate-900/90 text-white text-xs font-semibold shadow-2xl backdrop-blur-md border border-slate-700 animate-slide-down flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================================= */}
      {/* KONTEN UTAMA DASHBOARD                                                  */}
      {/* ======================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-6">
        {/* Navigasi Tab Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25 scale-[1.02]'
                    : 'bg-white dark:bg-dark-card text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-dark-border'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {tab.pendingCount !== undefined && tab.pendingCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-slate-950 animate-pulse">
                    {tab.pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tampilan Konten Berdasarkan Tab yang Aktif */}
        <main className="animate-page-enter">
          {activeTab === 'overview' && (
            <OverviewTab
              newsList={newsList}
              customVideos={customVideos}
              timelineList={timelineList}
              communityList={communityList}
              setActiveTab={setActiveTab}
              approveCommunity={approveCommunity}
              rejectCommunity={rejectCommunity}
              showToast={showToast}
            />
          )}

          {activeTab === 'berita' && (
            <NewsTab
              newsList={newsList}
              addNews={addNews}
              deleteNews={deleteNews}
              onOpenEditModal={handleOpenEditNewsModal}
              showToast={showToast}
            />
          )}

          {activeTab === 'video' && (
            <VideoTab
              customVideos={customVideos}
              addCustomVideo={addCustomVideo}
              uploadVideoFile={uploadVideoFile}
              deleteCustomVideo={deleteCustomVideo}
              onEditVideo={(v) => setEditingVideo(v)}
              showToast={showToast}
            />
          )}

          {activeTab === 'timeline' && (
            <TimelineTab
              timelineList={timelineList}
              addTimelineMilestone={addTimelineMilestone}
              deleteTimelineMilestone={deleteTimelineMilestone}
              showToast={showToast}
            />
          )}

          {activeTab === 'komunitas' && (
            <CommunityTab
              communityList={communityList}
              addCommunity={addCommunity}
              approveCommunity={approveCommunity}
              rejectCommunity={rejectCommunity}
              deleteCommunity={deleteCommunity}
              onOpenEditModal={handleOpenEditModal}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* ======================================================================= */}
      {/* MODALS DIALOG (PORTAL PATTERN)                                          */}
      {/* ======================================================================= */}
      {/* Modal Dialog Konfirmasi Logout */}
      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleConfirmLogout}
        userEmail={user?.email}
      />

      {/* Modal Dialog Edit Berita */}
      <EditNewsModal
        news={editingNews}
        onClose={() => setEditingNews(null)}
        onSave={handleSaveEditNews}
      />

      {/* Modal Dialog Edit Komunitas Terverifikasi */}
      <EditCommunityModal
        community={editingCommunity}
        onClose={() => setEditingCommunity(null)}
        onSave={handleSaveEditCommunity}
      />

      {/* Modal Dialog Edit Kosakata Isyarat */}
      <EditVideoModal
        isOpen={!!editingVideo}
        video={editingVideo}
        onClose={() => setEditingVideo(null)}
        onSave={async (id, data) => updateCustomVideo(id, data)}
        onUploadFile={uploadVideoFile}
        showToast={showToast}
      />
    </div>
  );
}
