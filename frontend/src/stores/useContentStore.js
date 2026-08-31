import { create } from 'zustand';
import { 
  INITIAL_NEWS, 
  INITIAL_TIMELINE, 
  INITIAL_COMMUNITY_ACTIVITIES,
  INITIAL_TESTIMONIALS,
  SIGN_DICTIONARY 
} from '../services/mockData';

export const useContentStore = create((set, get) => ({
  // News Data & CRUD
  newsList: typeof window !== 'undefined' && localStorage.getItem('setara_news')
    ? JSON.parse(localStorage.getItem('setara_news'))
    : INITIAL_NEWS,

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

  updateNews: (id, updatedFields) => {
    set((state) => {
      const updated = state.newsList.map(n => n.id === id ? { ...n, ...updatedFields } : n);
      if (typeof window !== 'undefined') localStorage.setItem('setara_news', JSON.stringify(updated));
      return { newsList: updated };
    });
  },

  deleteNews: (id) => {
    set((state) => {
      const updated = state.newsList.filter(n => n.id !== id);
      if (typeof window !== 'undefined') localStorage.setItem('setara_news', JSON.stringify(updated));
      return { newsList: updated };
    });
  },

  // Timeline Milestones
  timelineList: typeof window !== 'undefined' && localStorage.getItem('setara_timeline')
    ? JSON.parse(localStorage.getItem('setara_timeline'))
    : INITIAL_TIMELINE,

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

  deleteTimelineMilestone: (id) => {
    set((state) => {
      const updated = state.timelineList.filter(t => t.id !== id);
      if (typeof window !== 'undefined') localStorage.setItem('setara_timeline', JSON.stringify(updated));
      return { timelineList: updated };
    });
  },

  // Videos in Dictionary
  customVideos: typeof window !== 'undefined' && localStorage.getItem('setara_custom_videos')
    ? JSON.parse(localStorage.getItem('setara_custom_videos'))
    : [],

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

  deleteCustomVideo: (id) => {
    set((state) => {
      const updated = state.customVideos.filter(v => v.id !== id);
      if (typeof window !== 'undefined') localStorage.setItem('setara_custom_videos', JSON.stringify(updated));
      return { customVideos: updated };
    });
  },

  // Community Members for Moderation
  communityMembers: [
    { id: 'cm-1', nama: 'Siti Rahmawati', email: 'siti@example.com', peran: 'Guru SLB', status: 'approved', tanggal: '2026-08-20' },
    { id: 'cm-2', nama: 'Bambang Wicaksono', email: 'bambang@example.com', peran: 'Relawan Isyarat', status: 'approved', tanggal: '2026-08-22' },
    { id: 'cm-3', nama: 'Fajar Nugraha', email: 'fajar@example.com', peran: 'Mahasiswa', status: 'pending', tanggal: '2026-08-28' },
    { id: 'cm-4', nama: 'Anisa Putri', email: 'anisa@example.com', peran: 'Penerjemah Lepas', status: 'pending', tanggal: '2026-08-29' }
  ],

  approveMember: (id) => {
    set((state) => ({
      communityMembers: state.communityMembers.map(m => m.id === id ? { ...m, status: 'approved' } : m)
    }));
  },

  rejectMember: (id) => {
    set((state) => ({
      communityMembers: state.communityMembers.map(m => m.id === id ? { ...m, status: 'rejected' } : m)
    }));
  }
}));
