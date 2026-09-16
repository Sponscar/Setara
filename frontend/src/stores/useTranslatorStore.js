/**
 * ==============================================================================
 * File: useTranslatorStore.js
 * Direktori: src/stores/
 * Deskripsi: Global State Management untuk Modul Penerjemah Isyarat SETARA.
 * Pattern:
 *   - Flux / Store Pattern (via Zustand): Single source of truth untuk state penerjemah.
 *   - Finite State Machine (FSM): Siklus pemutaran animasi isyarat terdefinisi ketat
 *     ('IDLE' | 'READY' | 'PLAYING' | 'PAUSED' | 'COMPLETED').
 *   - Repository Pattern: Penyimpanan riwayat translasi dengan persistensi localStorage.
 * ==============================================================================
 */

import { create } from 'zustand';
import { tokenizeIndonesianText } from '../utils/tokenizer';

export const useTranslatorStore = create((set, get) => ({
  // ============================================================================
  // 1. SISTEM BAHASA ISYARAT (SIBI vs BISINDO)
  // ============================================================================
  /**
   * Sistem isyarat aktif: 'SIBI' atau 'BISINDO'.
   * Disimpan secara persisten di localStorage browser.
   */
  languageSystem: typeof window !== 'undefined' && localStorage.getItem('setara_lang_system')
    ? localStorage.getItem('setara_lang_system')
    : 'BISINDO',

  /**
   * Mengubah sistem bahasa isyarat aktif dan melakukan re-tokenisasi jika ada teks aktif.
   * @param {'SIBI' | 'BISINDO'} system - Sistem bahasa isyarat yang dipilih
   */
  setLanguageSystem: (system) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('setara_lang_system', system);
    }
    set({ languageSystem: system });

    // Jika sedang ada teks di input, terjemahkan ulang sesuai sistem bahasa baru
    const { textInput } = get();
    if (textInput) {
      get().translateText(textInput);
    }
  },

  // ============================================================================
  // 2. NAVIGASI TAB PENERJEMAH
  // ============================================================================
  /**
   * Tab fitur aktif: 'text-to-sign' | 'sign-to-text' | 'history'
   */
  activeTab: 'text-to-sign',

  /**
   * Mengubah tab fitur aktif di halaman penerjemah
   * @param {'text-to-sign' | 'sign-to-text' | 'history'} tab
   */
  setActiveTab: (tab) => set({ activeTab: tab }),

  // ============================================================================
  // 3. STATE & FSM PEMUTAR TEKS KE ISYARAT (TEXT-TO-SIGN)
  // ============================================================================
  /** String kalimat input yang dimasukkan pengguna */
  textInput: '',
  /** Daftar token kata/frasa hasil tokenisasi parser */
  tokens: [],
  /** Indeks kata yang sedang aktif diperagakan saat ini */
  currentWordIndex: 0,
  /**
   * Finite State Machine (FSM) pemutaran animasi:
   * 'IDLE'      : Belum ada input teks / berhenti
   * 'READY'     : Teks telah ditokenisasi dan siap diputar
   * 'PLAYING'   : Animasi sedang aktif diputar
   * 'PAUSED'    : Pemutaran dihentikan sementara
   * 'COMPLETED' : Seluruh kata dalam kalimat telah selesai diperagakan
   */
  playbackState: 'IDLE',
  /** Kecepatan pemutaran animasi (0.5x, 0.75x, 1.0x, 1.25x, 1.5x) */
  playbackSpeed: 1.0,
  /** Penanda apakah pemutaran otomatis mengulang dari awal (looping) */
  isLooping: false,

  /**
   * Mengupdate nilai input teks dari form
   * @param {string} text
   */
  setTextInput: (text) => set({ textInput: text }),

  /**
   * Memproses translasi teks: normalisasi -> tokenisasi -> inisialisasi playback -> catat riwayat.
   * @param {string} [textToTranslate] - Teks opsional, jika tidak ada memakai textInput
   */
  translateText: (textToTranslate) => {
    const text = textToTranslate ?? get().textInput;
    if (!text || !text.trim()) {
      set({ tokens: [], playbackState: 'IDLE', currentWordIndex: 0 });
      return;
    }

    const { languageSystem } = get();
    // Jalankan algoritma tokenisasi teks bahasa Indonesia
    const tokenList = tokenizeIndonesianText(text, languageSystem);

    if (tokenList.length === 0) {
      set({ tokens: [], playbackState: 'IDLE', currentWordIndex: 0 });
      return;
    }

    // Set token dan ubah state FSM ke PLAYING
    set({
      tokens: tokenList,
      currentWordIndex: 0,
      playbackState: 'PLAYING',
    });

    // Simpan ke riwayat translasi
    get().addToHistory({
      id: `hist-${Date.now()}`,
      type: 'text_to_sign',
      languageSystem,
      input: text,
      output: `${tokenList.length} kata diperagakan`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    });
  },

  // --- KONTROL FINITE STATE MACHINE (FSM) PLAYBACK ---
  /** Mulai / lanjutkan pemutaran animasi */
  play: () => set({ playbackState: 'PLAYING' }),

  /** Jeda pemutaran animasi */
  pause: () => set({ playbackState: 'PAUSED' }),

  /** Toggle antara Play dan Pause secara cerdas */
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

  /** Maju ke kata berikutnya atau ubah state ke COMPLETED jika sudah kata terakhir */
  nextWord: () => {
    const { currentWordIndex, tokens } = get();
    if (currentWordIndex < tokens.length - 1) {
      set({ currentWordIndex: currentWordIndex + 1 });
    } else {
      set({ playbackState: 'COMPLETED' });
    }
  },

  /** Mundur ke kata sebelumnya */
  prevWord: () => {
    const { currentWordIndex } = get();
    if (currentWordIndex > 0) {
      set({ currentWordIndex: currentWordIndex - 1, playbackState: 'PLAYING' });
    }
  },

  /** Melompat langsung ke kata pada indeks tertentu */
  jumpToWord: (index) => {
    const { tokens } = get();
    if (index >= 0 && index < tokens.length) {
      set({ currentWordIndex: index, playbackState: 'PLAYING' });
    }
  },

  /** Mengulang pemutaran animasi dari kata pertama */
  replay: () => {
    const { tokens } = get();
    if (tokens.length > 0) {
      set({ currentWordIndex: 0, playbackState: 'PLAYING' });
    }
  },

  /** Mengatur kecepatan pemutaran animasi */
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

  /** Toggle mode pemutaran berulang (looping) */
  toggleLooping: () => set((state) => ({ isLooping: !state.isLooping })),

  // ============================================================================
  // 4. STATE ISYARAT KE TEKS VIA KAMERA (SIGN-TO-TEXT / AI YOLO 11)
  // ============================================================================
  /** Penanda apakah streaming webcam aktif */
  isCameraActive: false,
  /** Daftar kata yang telah berhasil dideteksi oleh kamera */
  detectedTextList: [],
  /** Kata yang sedang terdeteksi di frame video saat ini */
  currentLiveWord: '',
  /** Nilai confidence model AI (0.0 - 1.0) */
  liveConfidence: 0.94,
  /** Penanda status proses inferensi deteksi */
  isDetecting: false,

  /** Mengaktifkan atau menonaktifkan kamera dan proses deteksi */
  setCameraActive: (active) => set({ isCameraActive: active, isDetecting: active }),

  /** Menambahkan kata baru hasil deteksi kamera ke buffer */
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

  /** Mengosongkan buffer hasil deteksi kata kamera */
  clearDetectedWords: () => set({ detectedTextList: [], currentLiveWord: '' }),

  // ============================================================================
  // 5. RIWAYAT TRANSLASI (HISTORY REPOSITORY)
  // ============================================================================
  /**
   * Riwayat sesi translasi pengguna dengan data bawaan dan persistensi localStorage.
   */
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

  /**
   * Menambahkan entri baru ke riwayat translasi (dibatasi maksimal 20 entri terbaru)
   * @param {Object} entry
   */
  addToHistory: (entry) => {
    set((state) => {
      const newHistory = [entry, ...state.history].slice(0, 20);
      if (typeof window !== 'undefined') {
        localStorage.setItem('setara_history', JSON.stringify(newHistory));
      }
      return { history: newHistory };
    });
  },

  /**
   * Menghapus seluruh riwayat translasi dari store dan localStorage
   */
  clearHistory: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('setara_history');
    }
    set({ history: [] });
  }
}));
