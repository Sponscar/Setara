/**
 * ==============================================================================
 * File: useTranslatorStore.js
 * Direktori: src/stores/
 * Deskripsi: Global State Management untuk Modul Penerjemah Isyarat SETARA.
 * Integrasi:
 *   - Memuat kamus kosakata dinamis dari PostgreSQL backend (/api/video/dictionary).
 *   - Mengirim logging translasi ke endpoint /api/translator/text-to-sign.
 *   - Mengontrol Finite State Machine (FSM) pemutaran berantai animasi per kata.
 * ==============================================================================
 */

import { create } from 'zustand';
import { api } from '../services/api';
import { tokenizeIndonesianText } from '../utils/tokenizer';

export const useTranslatorStore = create((set, get) => ({
  // ============================================================================
  // 1. SISTEM BAHASA ISYARAT (SIBI vs BISINDO) & KAMUS DATABASE
  // ============================================================================
  languageSystem: typeof window !== 'undefined' && localStorage.getItem('setara_lang_system')
    ? localStorage.getItem('setara_lang_system')
    : 'BISINDO',

  /** Kamus kosakata dinamis yang dimuat dari database backend */
  dictionary: [],
  isLoadingDictionary: false,

  /**
   * Mengambil daftar kosakata isyarat aktif dari database backend.
   */
  fetchDictionary: async () => {
    set({ isLoadingDictionary: true });
    try {
      const data = await api.get('/video/dictionary');
      const dict = Array.isArray(data) ? data : [];
      set({ dictionary: dict, isLoadingDictionary: false });
      return dict;
    } catch (err) {
      set({ isLoadingDictionary: false });
      return [];
    }
  },

  /**
   * Mengubah sistem bahasa isyarat aktif dan melakukan re-tokenisasi jika ada teks aktif.
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
  // 2. NAVIGASI TAB PENERJEMAH
  // ============================================================================
  activeTab: 'text-to-sign',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // ============================================================================
  // 3. STATE & FSM PEMUTAR TEKS KE ISYARAT (TEXT-TO-SIGN)
  // ============================================================================
  textInput: '',
  tokens: [],
  currentWordIndex: 0,
  playbackState: 'IDLE',
  playbackSpeed: 1.0,
  isLooping: false,

  setTextInput: (text) => set({ textInput: text }),

  /**
   * Memproses translasi teks: normalisasi -> tokenisasi dengan kamus DB -> inisialisasi playback -> catat riwayat.
   * @param {string} [textToTranslate]
   */
  translateText: async (textToTranslate) => {
    const text = textToTranslate ?? get().textInput;
    if (!text || !text.trim()) {
      set({ tokens: [], playbackState: 'IDLE', currentWordIndex: 0 });
      return;
    }

    const { languageSystem } = get();
    let dict = get().dictionary;

    // Muat kamus dari backend jika belum tersedia
    if (!dict || dict.length === 0) {
      dict = await get().fetchDictionary();
    }

    // Jalankan algoritma tokenisasi menggunakan kamus database
    const tokenList = tokenizeIndonesianText(text, languageSystem, dict);

    if (tokenList.length === 0) {
      set({ tokens: [], playbackState: 'IDLE', currentWordIndex: 0 });
      return;
    }

    // Set token dan aktifkan status PLAYING
    set({
      tokens: tokenList,
      currentWordIndex: 0,
      playbackState: 'PLAYING',
    });

    // Simpan ke riwayat translasi lokal
    get().addToHistory({
      id: `hist-${Date.now()}`,
      type: 'text_to_sign',
      languageSystem,
      input: text,
      output: `${tokenList.length} kata diperagakan`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    });

    // Sync translasi ke backend API secara asinkron untuk pencatatan di PostgreSQL
    api.post('/translator/text-to-sign', {
      teks: text,
      tipe_bahasa: languageSystem
    }).catch(() => {
      // Tidak menghalangi pemutaran jika jaringan sedang offline
    });
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
  // 5. RIWAYAT TRANSLASI (HISTORY REPOSITORY)
  // ============================================================================
  history: typeof window !== 'undefined' && localStorage.getItem('setara_history')
    ? JSON.parse(localStorage.getItem('setara_history'))
    : [
        {
          id: 'h1',
          type: 'text_to_sign',
          languageSystem: 'BISINDO',
          input: 'aku sayang ibu',
          output: '3 kata diperagakan',
          timestamp: '14:30',
          date: 'Hari ini'
        },
        {
          id: 'h2',
          type: 'sign_to_text',
          languageSystem: 'SIBI',
          input: 'Peragaan Kamera',
          output: 'Terima kasih banyak',
          timestamp: '11:15',
          date: 'Kemarin'
        }
      ],

  addToHistory: (entry) => {
    set((state) => {
      const newHistory = [entry, ...state.history].slice(0, 20);
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