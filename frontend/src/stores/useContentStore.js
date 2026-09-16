/**
 * ==============================================================================
 * File: useContentStore.js
 * Direktori: src/stores/
 * Deskripsi: Global Content Management State (CMS) untuk platform SETARA.
 * Pattern:
 *   - Repository Pattern: Abstraksi layer data untuk operasi CRUD (Create, Read,
 *     Update, Delete) pada Berita, Milestone Linimasa, Kamus Isyarat, Komunitas, dan Testimoni.
 *   - Data Persistence: Sinkronisasi otomatis dua arah ke localStorage browser
 *     sebagai simulasi basis data persisten sebelum integrasi backend Django.
 * ==============================================================================
 */

import { create } from 'zustand';
import { 
  INITIAL_NEWS, 
  INITIAL_TIMELINE, 
  INITIAL_COMMUNITIES, 
  INITIAL_TESTIMONIALS 
} from '../services/mockData';

export const useContentStore = create((set, get) => ({
  // ============================================================================
  // 1. DATA & OPERASI CRUD BERITA (NEWS REPOSITORY)
  // ============================================================================
  /**
   * Daftar berita aktif. Mengambil data dari localStorage jika ada,
   * atau fallback ke INITIAL_NEWS dari mockData.
   */
  newsList: typeof window !== 'undefined' && localStorage.getItem('setara_news')
    ? JSON.parse(localStorage.getItem('setara_news'))
    : INITIAL_NEWS,

  /**
   * Menambahkan artikel berita baru ke daftar.
   * @param {Object} newsItem - Data berita (judul, kategori, ringkasan, author, konten)
   */
  addNews: (newsItem) => {
    const newItem = {
      ...newsItem,
      id: `news-${Date.now()}`,
      slug: newsItem.judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      views: 1,
      waktuBaca: '3 menit',
      kategoriBadge: newsItem.kategori === 'Edukasi' 
        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
        : newsItem.kategori === 'Teknologi'
        ? 'bg-brand-500/10 text-brand-500 border-brand-500/20'
        : 'bg-brand-600/10 text-brand-600 border-brand-600/20'
    };
    set((state) => {
      const updated = [newItem, ...state.newsList];
      if (typeof window !== 'undefined') localStorage.setItem('setara_news', JSON.stringify(updated));
      return { newsList: updated };
    });
  },

  /**
   * Memperbarui field tertentu dari artikel berita berdasarkan id.
   * @param {string} id - ID berita yang diupdate
   * @param {Object} updatedFields - Field baru yang diperbarui
   */
  updateNews: (id, updatedFields) => {
    set((state) => {
      const updated = state.newsList.map((n) => (n.id === id ? { ...n, ...updatedFields } : n));
      if (typeof window !== 'undefined') localStorage.setItem('setara_news', JSON.stringify(updated));
      return { newsList: updated };
    });
  },

  /**
   * Menghapus artikel berita berdasarkan id.
   * @param {string} id
   */
  deleteNews: (id) => {
    set((state) => {
      const updated = state.newsList.filter((n) => n.id !== id);
      if (typeof window !== 'undefined') localStorage.setItem('setara_news', JSON.stringify(updated));
      return { newsList: updated };
    });
  },

  // ============================================================================
  // 2. DATA & OPERASI CRUD LINIMASA MILESTONE (TIMELINE REPOSITORY)
  // ============================================================================
  /**
   * Daftar milestone linimasa sejarah dan pencapaian platform.
   */
  timelineList: typeof window !== 'undefined' && localStorage.getItem('setara_timeline')
    ? JSON.parse(localStorage.getItem('setara_timeline'))
    : INITIAL_TIMELINE,

  /**
   * Menambahkan milestone baru ke linimasa.
   * @param {Object} milestone - Data milestone (judul, tanggal/bulan, kategori, deskripsi)
   */
  addTimelineMilestone: (milestone) => {
    const newItem = {
      ...milestone,
      id: `tm-${Date.now()}`
    };
    set((state) => {
      const updated = [...state.timelineList, newItem];
      if (typeof window !== 'undefined') localStorage.setItem('setara_timeline', JSON.stringify(updated));
      return { timelineList: updated };
    });
  },

  /**
   * Menghapus milestone dari linimasa berdasarkan id.
   * @param {string} id
   */
  deleteTimelineMilestone: (id) => {
    set((state) => {
      const updated = state.timelineList.filter((t) => t.id !== id);
      if (typeof window !== 'undefined') localStorage.setItem('setara_timeline', JSON.stringify(updated));
      return { timelineList: updated };
    });
  },

  // ============================================================================
  // 3. DATA & OPERASI CRUD KOSAKATA ISYARAT KUSTOM (CUSTOM VIDEOS REPOSITORY)
  // ============================================================================
  /**
   * Daftar kata isyarat tambahan kustom buatan administrator.
   */
  customVideos: typeof window !== 'undefined' && localStorage.getItem('setara_custom_videos')
    ? JSON.parse(localStorage.getItem('setara_custom_videos'))
    : [],

  /**
   * Menambahkan kosakata isyarat kustom baru ke kamus.
   * @param {Object} videoItem - Data kata (kata, tipe_bahasa, kategori, gesture_pattern, deskripsi_gerakan)
   */
  addCustomVideo: (videoItem) => {
    const newItem = {
      ...videoItem,
      id: `vid-${Date.now()}`,
      durasi: videoItem.durasi || 2,
      tersedia: true
    };
    set((state) => {
      const updated = [newItem, ...state.customVideos];
      if (typeof window !== 'undefined') localStorage.setItem('setara_custom_videos', JSON.stringify(updated));
      return { customVideos: updated };
    });
  },

  /**
   * Menghapus kosakata isyarat kustom berdasarkan id.
   * @param {string} id
   */
  deleteCustomVideo: (id) => {
    set((state) => {
      const updated = state.customVideos.filter((v) => v.id !== id);
      if (typeof window !== 'undefined') localStorage.setItem('setara_custom_videos', JSON.stringify(updated));
      return { customVideos: updated };
    });
  },

  // ============================================================================
  // 4. DIREKTORI JEMBATAN KOMUNITAS (COMMUNITY REPOSITORY)
  // ============================================================================
  /**
   * Daftar seluruh komunitas (status: 'approved' | 'pending' | 'rejected').
   */
  communityList: typeof window !== 'undefined' && localStorage.getItem('setara_communities')
    ? JSON.parse(localStorage.getItem('setara_communities'))
    : INITIAL_COMMUNITIES,

  /**
   * Menambahkan komunitas baru langsung oleh administrator (status langsung 'approved').
   * @param {Object} community
   */
  addCommunity: (community) => {
    const newItem = {
      ...community,
      id: `com-${Date.now()}`,
      status: 'approved'
    };
    set((state) => {
      const updated = [newItem, ...state.communityList];
      if (typeof window !== 'undefined') localStorage.setItem('setara_communities', JSON.stringify(updated));
      return { communityList: updated };
    });
  },

  /**
   * Mengajukan komunitas dari formulir publik luar (status awal 'pending').
   * @param {Object} community
   */
  submitCommunity: (community) => {
    const newItem = {
      ...community,
      id: `com-${Date.now()}`,
      status: 'pending'
    };
    set((state) => {
      const updated = [newItem, ...state.communityList];
      if (typeof window !== 'undefined') localStorage.setItem('setara_communities', JSON.stringify(updated));
      return { communityList: updated };
    });
  },

  /**
   * Menyetujui pengajuan komunitas pending menjadi approved.
   * @param {string} id
   */
  approveCommunity: (id) => {
    set((state) => {
      const updated = state.communityList.map((c) => (c.id === id ? { ...c, status: 'approved' } : c));
      if (typeof window !== 'undefined') localStorage.setItem('setara_communities', JSON.stringify(updated));
      return { communityList: updated };
    });
  },

  /**
   * Menolak pengajuan komunitas pending.
   * @param {string} id
   */
  rejectCommunity: (id) => {
    set((state) => {
      const updated = state.communityList.map((c) => (c.id === id ? { ...c, status: 'rejected' } : c));
      if (typeof window !== 'undefined') localStorage.setItem('setara_communities', JSON.stringify(updated));
      return { communityList: updated };
    });
  },

  /**
   * Memperbarui data komunitas terverifikasi (nama, link, platform, logo, PIC, deskripsi).
   * @param {string} id
   * @param {Object} updatedData
   */
  updateCommunity: (id, updatedData) => {
    set((state) => {
      const updated = state.communityList.map((c) => 
        c.id === id ? { ...c, ...updatedData } : c
      );
      if (typeof window !== 'undefined') localStorage.setItem('setara_communities', JSON.stringify(updated));
      return { communityList: updated };
    });
  },

  /**
   * Menghapus komunitas dari database berdasarkan id.
   * @param {string} id
   */
  deleteCommunity: (id) => {
    set((state) => {
      const updated = state.communityList.filter((c) => c.id !== id);
      if (typeof window !== 'undefined') localStorage.setItem('setara_communities', JSON.stringify(updated));
      return { communityList: updated };
    });
  },

  // ============================================================================
  // 5. DATA TESTIMONI PENGGUNA (TESTIMONIALS REPOSITORY)
  // ============================================================================
  /**
   * Daftar testimoni cerita pengalaman pengguna SETARA.
   */
  testimonialList: typeof window !== 'undefined' && localStorage.getItem('setara_testimonials')
    ? JSON.parse(localStorage.getItem('setara_testimonials'))
    : INITIAL_TESTIMONIALS,

  /**
   * Menambahkan testimoni baru ke daftar.
   * @param {Object} testimonial - Data testimoni (nama, peran, avatar, komentar)
   */
  addTestimonial: (testimonial) => {
    const newItem = {
      ...testimonial,
      id: `testi-${Date.now()}`,
      avatar: testimonial.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
    };
    set((state) => {
      const updated = [newItem, ...state.testimonialList];
      if (typeof window !== 'undefined') localStorage.setItem('setara_testimonials', JSON.stringify(updated));
      return { testimonialList: updated };
    });
  },

  /**
   * Menghapus testimoni berdasarkan id.
   * @param {string} id
   */
  deleteTestimonial: (id) => {
    set((state) => {
      const updated = state.testimonialList.filter((t) => t.id !== id);
      if (typeof window !== 'undefined') localStorage.setItem('setara_testimonials', JSON.stringify(updated));
      return { testimonialList: updated };
    });
  }
}));
