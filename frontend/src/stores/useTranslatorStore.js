import { create } from 'zustand';
import { tokenizeIndonesianText } from '../utils/tokenizer';

export const useTranslatorStore = create((set, get) => ({
  // Language Choice (SIBI / BISINDO)
  languageSystem: typeof window !== 'undefined' && localStorage.getItem('setara_lang_system')
    ? localStorage.getItem('setara_lang_system')
    : 'BISINDO',

  setLanguageSystem: (system) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('setara_lang_system', system);
    }
    set({ languageSystem: system });
    // Re-tokenize if there is text
    const { textInput } = get();
    if (textInput) {
      get().translateText(textInput);
    }
  },

  // Active Tab
  activeTab: 'text-to-sign', // 'text-to-sign' | 'sign-to-text' | 'history'
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Text to Sign State
  textInput: '',
  tokens: [],
  currentWordIndex: 0,
  playbackState: 'IDLE', // 'IDLE' | 'READY' | 'PLAYING' | 'PAUSED' | 'COMPLETED'
  playbackSpeed: 1.0,
  isLooping: false,

  setTextInput: (text) => set({ textInput: text }),

  translateText: (textToTranslate) => {
    const text = textToTranslate ?? get().textInput;
    if (!text || !text.trim()) {
      set({ tokens: [], playbackState: 'IDLE', currentWordIndex: 0 });
      return;
    }

    const { languageSystem } = get();
    const tokenList = tokenizeIndonesianText(text, languageSystem);

    if (tokenList.length === 0) {
      set({ tokens: [], playbackState: 'IDLE', currentWordIndex: 0 });
      return;
    }

    set({
      tokens: tokenList,
      currentWordIndex: 0,
      playbackState: 'PLAYING',
    });

    // Save to history
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

  // FSM Playback Controls
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

  // Sign to Text (Camera) State
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

  // Translation History
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
