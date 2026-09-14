import { create } from 'zustand';
import { 
  INITIAL_NEWS, 
  INITIAL_TIMELINE, 
  INITIAL_COMMUNITIES,
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

  // ─── Community Directory (SETARA as Bridge) ───
  communityList: typeof window !== 'undefined' && localStorage.getItem('setara_communities')
    ? JSON.parse(localStorage.getItem('setara_communities'))
    : INITIAL_COMMUNITIES,

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

  approveCommunity: (id) => {
    set((state) => {
      const updated = state.communityList.map(c => c.id === id ? { ...c, status: 'approved' } : c);
      if (typeof window !== 'undefined') localStorage.setItem('setara_communities', JSON.stringify(updated));
      return { communityList: updated };
    });
  },

  rejectCommunity: (id) => {
    set((state) => {
      const updated = state.communityList.map(c => c.id === id ? { ...c, status: 'rejected' } : c);
      if (typeof window !== 'undefined') localStorage.setItem('setara_communities', JSON.stringify(updated));
      return { communityList: updated };
    });
  },

  deleteCommunity: (id) => {
    set((state) => {
      const updated = state.communityList.filter(c => c.id !== id);
      if (typeof window !== 'undefined') localStorage.setItem('setara_communities', JSON.stringify(updated));
      return { communityList: updated };
    });
  },

  // ─── Testimonials ───
  testimonialList: typeof window !== 'undefined' && localStorage.getItem('setara_testimonials')
    ? JSON.parse(localStorage.getItem('setara_testimonials'))
    : INITIAL_TESTIMONIALS,

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

  deleteTestimonial: (id) => {
    set((state) => {
      const updated = state.testimonialList.filter(t => t.id !== id);
      if (typeof window !== 'undefined') localStorage.setItem('setara_testimonials', JSON.stringify(updated));
      return { testimonialList: updated };
    });
  }
}));
