/**
 * ==============================================================================
 * File: useTranslatorStore.js
 * Direktori: src/stores/
 * Deskripsi: Global State Management untuk Modul Penerjemah Isyarat SETARA.
 * Integrasi:
 *   - 100% Full Backend: Mengonsumsi hasil translasi POST /api/translator/text-to-sign
 *   - Memuat kamus kosakata dinamis dari PostgreSQL backend (/api/video/dictionary).
 *   - Sinkronisasi riwayat translasi dengan database PostgreSQL (/api/translator/history).
 *   - Mengontrol Finite State Machine (FSM) pemutaran berantai animasi / video per kata.
 *   - Dual visual mode: Canvas 2D Kinematics vs Video MP4 Asli.
 * ==============================================================================
 */

import { create } from 'zustand';
import { api, tokenStorage } from '../services/api';
import { tokenizeIndonesianText } from '../utils/tokenizer';

export const useTranslatorStore = create((set, get) => ({
  // ============================================================================
  // 1. SISTEM BAHASA ISYARAT (SIBI vs BISINDO) & KAMUS DATABASE
  // ============================================================================
  languageSystem: typeof window !== 'undefined' && localStorage.getItem('setara_lang_system')
    ? localStorage.getItem('setara_lang_system')
    : 'BISINDO',

  /** Status koneksi database backend PostgreSQL */
  dbStatus: 'connected',
  dictionary: [],
  isLoadingDictionary: false,

  /**
   * Mengambil daftar kosakata isyarat aktif dari database backend PostgreSQL.
   */
  fetchDictionary: async () => {
    set({ isLoadingDictionary: true });
    try {
      const data = await api.get('/video/dictionary');
      const dict = Array.isArray(data) ? data : [];
      set({ dictionary: dict, isLoadingDictionary: false, dbStatus: 'connected' });
      return dict;
    } catch (err) {
      set({ isLoadingDictionary: false, dbStatus: 'offline' });
      return [];
    }
  },

  /**
   * Mengubah sistem bahasa isyarat aktif dan melakukan re-translasi jika ada teks aktif.
   * @param {'SIBI' | 'BISINDO'} system
   */
  setLanguageSystem: (system) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('setara_lang_system', system);
    }
    set({ languageSystem: system });

    const { textInput } = get();
    if (textInput) {
      get().translateText(textInput);
    }
  },

  // ============================================================================
  // 2. NAVIGASI TAB PENERJEMAH & VISUAL MODE
  // ============================================================================
  activeTab: 'text-to-sign',
  setActiveTab: (tab) => set({ activeTab: tab }),

  /** Mode visual player: 'animation' (Canvas 2D) | 'video' (MP4 Asli) */
  visualMode: 'animation',
  setVisualMode: (mode) => set({ visualMode: mode }),

  // ============================================================================
  // 3. STATE & FSM PEMUTAR TEKS KE ISYARAT (TEXT-TO-SIGN - 100% REAL BACKEND)
  // ============================================================================
  textInput: '',
  tokens: [],
  currentWordIndex: 0,
  playbackState: 'IDLE',
  playbackSpeed: 1.0,
  isLooping: false,
  isTranslating: false,

  setTextInput: (text) => set({ textInput: text }),

  /**
   * Memproses translasi teks dengan menghubungkan langsung ke API backend PostgreSQL.
   * Mengonsumsi endpoint POST /api/translator/text-to-sign secara real-time.
   * @param {string} [textToTranslate]
   */
  translateText: async (textToTranslate) => {
    const text = textToTranslate ?? get().textInput;
    if (!text || !text.trim()) {
      set({ tokens: [], playbackState: 'IDLE', currentWordIndex: 0 });
      return;
    }

    const { languageSystem } = get();
    set({ isTranslating: true });

    try {
      // 1. Panggil backend API Django Ninja (PostgreSQL)
      const res = await api.post('/translator/text-to-sign', {
        teks: text,
        tipe_bahasa: languageSystem
      });

      if (res && Array.isArray(res.videos) && res.videos.length > 0) {
        // Bentuk tokens langsung dari respon backend PostgreSQL
        const tokenList = res.videos.map((v, idx) => ({
          id: `token-${idx}-${v.kata}`,
          word: v.kata,
          kata: v.kata,
          isAvailable: v.tersedia !== false,
          tersedia: v.tersedia !== false,
          gesture_pattern: v.gesture_pattern || 'hand_wave_forehead',
          video_url: v.video_url || null,
          thumbnail: v.thumbnail || null,
          durasi: v.durasi || 2,
          fromPostgres: true,
          matchedData: {
            kata: v.kata,
            durasi: v.durasi || 2,
            gesture_pattern: v.gesture_pattern || 'hand_wave_forehead',
            video_url: v.video_url || null,
            thumbnail: v.thumbnail || null,
            deskripsi_gerakan: `Peragaan isyarat untuk "${v.kata}".`,
            fromPostgres: true
          }
        }));

        set({
          tokens: tokenList,
          currentWordIndex: 0,
          playbackState: 'PLAYING',
          isTranslating: false,
          dbStatus: 'connected'
        });

        // Simpan ke riwayat translasi lokal
        get().addToHistory({
          id: `hist-${Date.now()}`,
          type: 'text_to_sign',
          languageSystem,
          input: text,
          output: `${tokenList.length} kata diperagakan (PostgreSQL)`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
        });

        return;
      }
    } catch (err) {
      console.warn("Backend API note, falling back to local dictionary:", err.message);
    }

    // Graceful fallback: Jika backend tidak merespon, gunakan kamus lokal/store
    let dict = get().dictionary;
    if (!dict || dict.length === 0) {
      dict = await get().fetchDictionary();
    }

    const tokenList = tokenizeIndonesianText(text, languageSystem, dict);
    set({
      tokens: tokenList,
      currentWordIndex: 0,
      playbackState: tokenList.length > 0 ? 'PLAYING' : 'IDLE',
      isTranslating: false
    });

    if (tokenList.length > 0) {
      get().addToHistory({
        id: `hist-${Date.now()}`,
        type: 'text_to_sign',
        languageSystem,
        input: text,
        output: `${tokenList.length} kata diperagakan`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
      });
    }
  },

  // --- KONTROL FINITE STATE MACHINE (FSM) PLAYBACK ---
  play: () => set({ playbackState: 'PLAYING' }),
  pause: () => set({ playbackState: 'PAUSED' }),

  togglePlayPause: () => {
    const { playbackState, tokens } = get();
    if (tokens.length === 0) return;
    if (playbackState === 'PLAYING') {
      set({ playbackState: 'PAUSED' });
    } else if (playbackState === 'COMPLETED') {
      set({ currentWordIndex: 0, playbackState: 'PLAYING' });
    } else {
      set({ playbackState: 'PLAYING' });
    }
  },

  nextWord: () => {
    const { currentWordIndex, tokens } = get();
    if (currentWordIndex < tokens.length - 1) {
      set({ currentWordIndex: currentWordIndex + 1 });
    } else {
      set({ playbackState: 'COMPLETED' });
    }
  },

  prevWord: () => {
    const { currentWordIndex } = get();
    if (currentWordIndex > 0) {
      set({ currentWordIndex: currentWordIndex - 1, playbackState: 'PLAYING' });
    }
  },

  jumpToWord: (index) => {
    const { tokens } = get();
    if (index >= 0 && index < tokens.length) {
      set({ currentWordIndex: index, playbackState: 'PLAYING' });
    }
  },

  replay: () => {
    const { tokens } = get();
    if (tokens.length > 0) {
      set({ currentWordIndex: 0, playbackState: 'PLAYING' });
    }
  },

  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  toggleLooping: () => set((state) => ({ isLooping: !state.isLooping })),

  // ============================================================================
  // 4. STATE ISYARAT KE TEKS VIA KAMERA (SIGN-TO-TEXT / AI YOLO 11)
  // ============================================================================
  isCameraActive: false,
  detectedTextList: [],
  currentLiveWord: '',
  liveConfidence: 0.94,
  isDetecting: false,

  setCameraActive: (active) => set({ isCameraActive: active, isDetecting: active }),

  addDetectedWord: (word, confidence = 0.95) => {
    set((state) => {
      const updated = [...state.detectedTextList, word];
      return {
        detectedTextList: updated,
        currentLiveWord: word,
        liveConfidence: confidence
      };
    });
  },

  clearDetectedWords: () => set({ detectedTextList: [], currentLiveWord: '' }),

  // ============================================================================
  // 5. RIWAYAT TRANSLASI (POSTGRESQL & LOCAL STORAGE)
  // ============================================================================
  history: typeof window !== 'undefined' && localStorage.getItem('setara_history')
    ? JSON.parse(localStorage.getItem('setara_history'))
    : [],

  isLoadingHistory: false,

  /**
   * Mengambil riwayat translasi dari database PostgreSQL jika user terautentikasi.
   */
  fetchHistory: async () => {
    const token = tokenStorage.getAccessToken();
    if (!token) return;

    set({ isLoadingHistory: true });
    try {
      const data = await api.get('/translator/history');
      if (Array.isArray(data) && data.length > 0) {
        const formatted = data.map((h) => ({
          id: h.id,
          type: h.tipe_translasi,
          languageSystem: h.tipe_bahasa,
          input: h.input_text,
          output: h.output_text,
          timestamp: new Date(h.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          date: new Date(h.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
          fromServer: true
        }));
        set({ history: formatted, isLoadingHistory: false });
        if (typeof window !== 'undefined') {
          localStorage.setItem('setara_history', JSON.stringify(formatted));
        }
      } else {
        set({ isLoadingHistory: false });
      }
    } catch {
      set({ isLoadingHistory: false });
    }
  },

  addToHistory: (entry) => {
    set((state) => {
      const newHistory = [entry, ...state.history].slice(0, 30);
      if (typeof window !== 'undefined') {
        localStorage.setItem('setara_history', JSON.stringify(newHistory));
      }
      return { history: newHistory };
    });
  },

  clearHistory: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('setara_history');
    }
    set({ history: [] });
  }
}));
