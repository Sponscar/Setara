/**
 * ==============================================================================
 * File: useContentStore.js
 * Direktori: src/stores/
 * Deskripsi: Global Content Management State (CMS) platform SETARA.
 * Integrasi:
 *   - Terhubung langsung ke Django Ninja REST API & PostgreSQL (/api/*).
 *   - Menerapkan arsitektur 100% Full Backend tanpa mock data.
 *   - Menangani normalisasi data snake_case backend ke atribut komponen React.
 * ==============================================================================
 */

import { create } from 'zustand';
import { api } from '../services/api';

// --- DATA NORMALIZATION HELPERS ---

function normalizeNews(b) {
  if (!b) return null;
  const author = b.author_name || b.author || 'Tim Redaksi SETARA';
  const waktuBaca = b.waktu_baca || b.waktuBaca || '4 menit';
  const thumb = b.thumbnail_url || b.thumbnail || 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=600&q=80';
  const tanggal = b.published_at
    ? new Date(b.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : (b.tanggal || 'Terbaru');

  return {
    ...b,
    id: String(b.id),
    author,
    author_name: author,
    waktuBaca,
    waktu_baca: waktuBaca,
    thumbnail: thumb,
    thumbnail_url: thumb,
    tanggal,
    ringkasan: b.ringkasan || (b.konten ? b.konten.slice(0, 140) + '...' : ''),
    konten: b.konten || b.ringkasan || '',
    kategoriBadge: b.kategori === 'Edukasi'
      ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      : b.kategori === 'Teknologi'
      ? 'bg-brand-500/10 text-brand-500 border-brand-500/20'
      : 'bg-brand-600/10 text-brand-600 border-brand-600/20'
  };
}

function normalizeTimeline(t) {
  if (!t) return null;
  const parts = (t.tanggal || '').split(' ');
  const tahun = t.tahun || (parts.length > 0 && /^\d+$/.test(parts[parts.length - 1]) ? parts[parts.length - 1] : '2026');

  return {
    ...t,
    id: String(t.id),
    tahun,
    tanggal: t.tanggal || '2026',
    icon: t.icon || 'Sparkles',
    gambar: t.gambar_url || t.gambar || '',
    gambar_url: t.gambar_url || t.gambar || '',
    urutan: t.urutan || 0,
    is_active: t.is_active !== false
  };
}

function normalizeCommunity(k) {
  if (!k) return null;
  const logo = k.logo_url || k.logo || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=200&q=80';
  const deskripsiLengkap = k.deskripsi_lengkap || k.deskripsiLengkap || k.deskripsi || '';
  const email = k.email_kontak || k.emailKontak || '';

  return {
    ...k,
    id: String(k.id),
    deskripsiLengkap,
    deskripsi_lengkap: deskripsiLengkap,
    emailKontak: email,
    email_kontak: email,
    logo,
    logo_url: logo,
    anggota: k.anggota || '100+ Anggota',
    status: k.status || 'approved',
    tags: [k.kategori || 'Organisasi Tuli', k.platform || 'Komunitas']
  };
}

function normalizeTestimonial(t) {
  if (!t) return null;
  const avatar = t.avatar_url || t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

  return {
    ...t,
    id: String(t.id),
    avatar,
    avatar_url: avatar,
    rating: t.rating || 5
  };
}

function normalizeVideo(v) {
  if (!v) return null;
  return {
    ...v,
    id: String(v.id),
    kata: (v.kata || '').toLowerCase(),
    tipe_bahasa: v.tipe_bahasa || 'BISINDO',
    kategori: v.kategori || 'Umum',
    durasi: v.durasi || 2,
    gesture_pattern: v.gesture_pattern || 'hand_wave_forehead',
    deskripsi_gerakan: v.deskripsi_gerakan || '',
    video_url: v.video_url || '',
    thumbnail_url: v.thumbnail_url || '',
    status: v.status || 'active',
    tersedia: v.status === 'active' || v.tersedia !== false
  };
}

export const useContentStore = create((set, get) => ({
  // ============================================================================
  // 1. STATE GLOBAL REPOSITORY (FULL BACKEND)
  // ============================================================================
  newsList: [],
  timelineList: [],
  communityList: [],
  testimonialList: [],
  customVideos: [],

  isLoading: false,
  error: null,

  // ============================================================================
  // 2. OPERASI CRUD BERITA (NEWS)
  // ============================================================================

  fetchNews: async (forAdmin = false) => {
    set({ isLoading: true, error: null });
    try {
      let data;
      if (forAdmin) {
        data = await api.get('/berita/all');
      } else {
        data = await api.get('/berita/terbaru');
      }
      const rawList = Array.isArray(data) ? data : (data.results || []);
      const normalized = rawList.map(normalizeNews);
      set({ newsList: normalized, isLoading: false });
      return normalized;
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return [];
    }
  },

  addNews: async (newsItem) => {
    set({ isLoading: true, error: null });
    try {
      const payload = {
        judul: newsItem.judul,
        konten: newsItem.konten,
        ringkasan: newsItem.ringkasan || '',
        kategori: newsItem.kategori || 'Edukasi',
        status: newsItem.status || 'published',
        author_name: newsItem.author || newsItem.author_name || 'Tim Redaksi SETARA',
        waktu_baca: newsItem.waktuBaca || newsItem.waktu_baca || '4 menit',
        thumbnail_url: newsItem.thumbnail || newsItem.thumbnail_url || ''
      };

      const created = await api.post('/berita/', payload);
      const normalized = normalizeNews(created);
      set((state) => ({
        newsList: [normalized, ...state.newsList],
        isLoading: false
      }));
      return { success: true, item: normalized };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  updateNews: async (id, updatedFields) => {
    set({ isLoading: true, error: null });
    try {
      const payload = {
        judul: updatedFields.judul,
        konten: updatedFields.konten,
        ringkasan: updatedFields.ringkasan,
        kategori: updatedFields.kategori,
        status: updatedFields.status,
        author_name: updatedFields.author || updatedFields.author_name,
        waktu_baca: updatedFields.waktuBaca || updatedFields.waktu_baca,
        thumbnail_url: updatedFields.thumbnail || updatedFields.thumbnail_url
      };

      const updated = await api.put(`/berita/${id}`, payload);
      const normalized = normalizeNews(updated);
      set((state) => ({
        newsList: state.newsList.map((item) => (item.id === String(id) ? normalized : item)),
        isLoading: false
      }));
      return { success: true, item: normalized };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  deleteNews: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/berita/${id}`);
      set((state) => ({
        newsList: state.newsList.filter((item) => item.id !== String(id)),
        isLoading: false
      }));
      return { success: true };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  // ============================================================================
  // 3. OPERASI CRUD LINIMASA (TIMELINE)
  // ============================================================================

  fetchTimeline: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.get('/timeline/');
      const normalized = (data || []).map(normalizeTimeline);
      set({ timelineList: normalized, isLoading: false });
      return normalized;
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return [];
    }
  },

  addTimelineMilestone: async (milestone) => {
    set({ isLoading: true, error: null });
    try {
      const payload = {
        judul: milestone.judul,
        deskripsi: milestone.deskripsi,
        tanggal: milestone.tanggal || '2026',
        tahun: milestone.tahun || '',
        kategori: milestone.kategori || 'Pencapaian',
        icon: milestone.icon || 'Sparkles',
        gambar_url: milestone.gambar || milestone.gambar_url || '',
        urutan: milestone.urutan || 0
      };

      const created = await api.post('/timeline/', payload);
      const normalized = normalizeTimeline(created);
      set((state) => ({
        timelineList: [...state.timelineList, normalized],
        isLoading: false
      }));
      return { success: true, item: normalized };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  deleteTimelineMilestone: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/timeline/${id}`);
      set((state) => ({
        timelineList: state.timelineList.filter((t) => t.id !== String(id)),
        isLoading: false
      }));
      return { success: true };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  // ============================================================================
  // 4. OPERASI CRUD DIREKTORI KOMUNITAS
  // ============================================================================

  fetchCommunities: async (forAdmin = false) => {
    set({ isLoading: true, error: null });
    try {
      let data;
      if (forAdmin) {
        data = await api.get('/komunitas/directories/all');
      } else {
        data = await api.get('/komunitas/directories');
      }
      const normalized = (data || []).map(normalizeCommunity);
      set({ communityList: normalized, isLoading: false });
      return normalized;
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return [];
    }
  },

  submitCommunity: async (data) => { return get().submitPublicCommunity(data); },
  submitPublicCommunity: async (data) => {
    try {
      const created = await api.post('/komunitas/directories/submit', data);
      return { success: true, item: normalizeCommunity(created) };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  addCommunity: async (community) => {
    set({ isLoading: true, error: null });
    try {
      const payload = {
        nama: community.nama,
        deskripsi: community.deskripsi,
        deskripsi_lengkap: community.deskripsi_lengkap || community.deskripsi || '',
        kategori: community.kategori || 'Organisasi Tuli',
        platform: community.platform || 'Website',
        link: community.link || '',
        logo_url: community.logo || community.logo_url || '',
        anggota: community.anggota || '100+ Anggota',
        kontak: community.kontak || '',
        email_kontak: community.email_kontak || ''
      };

      const created = await api.post('/komunitas/directories', payload);
      const normalized = normalizeCommunity(created);
      set((state) => ({
        communityList: [normalized, ...state.communityList],
        isLoading: false
      }));
      return { success: true, item: normalized };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  updateCommunity: async (id, updatedData) => {
    set({ isLoading: true, error: null });
    try {
      const payload = {
        nama: updatedData.nama,
        deskripsi: updatedData.deskripsi,
        deskripsi_lengkap: updatedData.deskripsi_lengkap ?? updatedData.deskripsiLengkap ?? '',
        kategori: updatedData.kategori,
        platform: updatedData.platform,
        link: updatedData.link,
        logo_url: updatedData.logo || updatedData.logo_url || '',
        anggota: updatedData.anggota,
        kontak: updatedData.kontak,
        email_kontak: updatedData.email_kontak ?? updatedData.emailKontak ?? '',
        status: updatedData.status
      };

      const updated = await api.put(`/komunitas/directories/${id}`, payload);
      const normalized = normalizeCommunity(updated);
      set((state) => ({
        communityList: state.communityList.map((c) => (c.id === String(id) ? normalized : c)),
        isLoading: false
      }));
      return { success: true, item: normalized };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  deleteCommunity: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/komunitas/directories/${id}`);
      set((state) => ({
        communityList: state.communityList.filter((c) => c.id !== String(id)),
        isLoading: false
      }));
      return { success: true };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  approveCommunity: async (id) => {
    try {
      await api.post(`/komunitas/directories/${id}/approve`);
      set((state) => ({
        communityList: state.communityList.map((c) =>
          c.id === String(id) ? { ...c, status: 'approved' } : c
        )
      }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  rejectCommunity: async (id) => {
    try {
      await api.post(`/komunitas/directories/${id}/reject`);
      set((state) => ({
        communityList: state.communityList.map((c) =>
          c.id === String(id) ? { ...c, status: 'rejected' } : c
        )
      }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ============================================================================
  // 5. OPERASI TESTIMONI
  // ============================================================================

  fetchTestimonials: async () => {
    try {
      const data = await api.get('/komunitas/testimonials');
      const normalized = (data || []).map(normalizeTestimonial);
      set({ testimonialList: normalized });
      return normalized;
    } catch (err) {
      return [];
    }
  },

  addTestimonial: async (testi) => {
    try {
      const created = await api.post('/komunitas/testimonials', testi);
      const normalized = normalizeTestimonial(created);
      set((state) => ({
        testimonialList: [normalized, ...state.testimonialList]
      }));
      return { success: true, item: normalized };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ============================================================================
  // 6. OPERASI KOSAKATA ISYARAT / VIDEO CMS
  // ============================================================================

  fetchVideos: async (forAdmin = false) => {
    set({ isLoading: true, error: null });
    try {
      let data;
      if (forAdmin) {
        data = await api.get('/video/all');
      } else {
        data = await api.get('/video/dictionary');
      }
      const normalized = (data || []).map(normalizeVideo);
      set({ customVideos: normalized, isLoading: false });
      return normalized;
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return [];
    }
  },

  addCustomVideo: async (videoItem) => {
    set({ isLoading: true, error: null });
    try {
      const payload = {
        kata: videoItem.kata.toLowerCase().trim(),
        tipe_bahasa: videoItem.tipe_bahasa || 'BISINDO',
        kategori: videoItem.kategori || 'Umum',
        tag: videoItem.tag || '',
        durasi: Number(videoItem.durasi) || 2,
        gesture_pattern: videoItem.gesture_pattern || 'hand_wave_forehead',
        deskripsi_gerakan: videoItem.deskripsi_gerakan || '',
        video_url: videoItem.video_url || '',
        thumbnail_url: videoItem.thumbnail_url || ''
      };

      const created = await api.post('/video/', payload);
      const normalized = normalizeVideo(created);
      set((state) => ({
        customVideos: [normalized, ...state.customVideos],
        isLoading: false
      }));
      return { success: true, item: normalized };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  deleteCustomVideo: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/video/${id}`);
      set((state) => ({
        customVideos: state.customVideos.filter((v) => v.id !== String(id)),
        isLoading: false
      }));
      return { success: true };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  }
}));