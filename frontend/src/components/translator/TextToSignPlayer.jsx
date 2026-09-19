/**
 * @file TextToSignPlayer.jsx
 * @description Komponen utama pemutar animasi isyarat dari teks (Text-to-Sign).
 *
 * ## Arsitektur & Pattern
 * - **FSM Sequential Playback**: Menggunakan Finite State Machine dengan state
 *   'IDLE' | 'PLAYING' | 'PAUSED' | 'COMPLETED' untuk mengontrol transisi kata.
 * - **Timer-Driven Sequencing**: setTimeout berulang yang dijadwalkan berdasarkan
 *   durasi tiap token kata, diskalakan oleh playbackSpeed.
 * - **Store-Driven State**: Semua state playback dikelola oleh useTranslatorStore (Zustand),
 *   komponen ini hanya membaca dan men-dispatch action ke store.
 *
 * ## Alur Utama
 * 1. User mengetik kalimat → klik "Terjemahkan" → store.translateText() tokenisasi kalimat.
 * 2. Tokens di-render sebagai chip navigasi di sidebar kanan.
 * 3. Timer FSM memutar kata satu per satu, memanggil nextWord() per interval.
 * 4. SignCanvasAnimator menerima currentWord & gesturePattern untuk render animasi canvas.
 * 5. Saat kata terakhir selesai: loop (replay) atau selesai (confetti celebration).
 *
 * @module TextToSignPlayer
 */

import React, { useState, useEffect, useRef } from 'react';
import { useTranslatorStore } from '../../stores/useTranslatorStore';
import SignCanvasAnimator from './SignCanvasAnimator';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Sparkles, 
  AlertCircle,
  Volume2,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * Daftar kalimat contoh yang ditampilkan sebagai quick-chip
 * agar user dapat langsung mencoba tanpa mengetik manual.
 * @constant {string[]}
 */
const SAMPLE_SENTENCES = [
  "aku sayang ibu",
  "terima kasih",
  "halo selamat pagi",
  "kami senang belajar bahasa isyarat",
  "semua manusia memiliki hak setara"
];

/**
 * TextToSignPlayer — Komponen pemutar animasi isyarat kata demi kata.
 *
 * Menggabungkan form input teks, canvas animator (SignCanvasAnimator),
 * kontrol playback (play/pause/prev/next/replay/loop/speed),
 * dan sidebar urutan kata interaktif.
 *
 * @returns {JSX.Element} Komponen pemutar Text-to-Sign lengkap.
 */
export default function TextToSignPlayer() {
  /* ===================================================================
   * 1. ZUSTAND STORE SELECTORS — Membaca state & action dari translator store
   * =================================================================== */
  const {
    /** @type {string} Sistem isyarat aktif ('SIBI' | 'BISINDO') */
    languageSystem,
    /** @type {string} Teks input yang tersimpan di store */
    textInput,
    /** @param {string} text — Setter teks input ke store */
    setTextInput,
    /** @type {Array<Object>} Array token hasil tokenisasi kalimat */
    tokens,
    /** @type {number} Indeks kata yang sedang aktif/diputar */
    currentWordIndex,
    playbackState,
    playbackSpeed,
    isLooping,
    translateText,
    play,
    pause,
    togglePlayPause,
    nextWord,
    prevWord,
    jumpToWord,
    replay,
    setPlaybackSpeed,
    toggleLooping,
    visualMode,
    dictionary,
    fetchDictionary,
    dbStatus
  } = useTranslatorStore();

  /* ===================================================================
   * 2. STATE LOKAL & REF — Dikelola di level komponen, bukan store
   * =================================================================== */
  /** @state {string} inputVal — Nilai input lokal yang dikontrol oleh form */
  const [inputVal, setInputVal] = useState(textInput || 'aku sayang ibu');
  /** @ref {number|null} timerRef — ID timeout untuk FSM sequential timer */
  const timerRef = useRef(null);
  /** @ref {HTMLVideoElement} videoPlayerRef — Elemen <video> untuk pemutar MP4 */
  const videoPlayerRef = useRef(null);

  /* ===================================================================
   * 3. SIDE EFFECTS — Lifecycle hooks komponen
   * =================================================================== */

  /**
   * Effect: Auto-translate saat mount jika belum ada token.
   * Memastikan user langsung melihat hasil terjemahan contoh kalimat default.
   */
  useEffect(() => {
    fetchDictionary();
    if (tokens.length === 0 && inputVal) {
      translateText(inputVal);
    }
  }, []);

  /**
   * Effect: FSM Sequential Timer — Jantung mekanisme playback.
   *
   * Cara kerja:
   * 1. Hanya aktif saat playbackState === 'PLAYING' dan tokens > 0.
   * 2. Menghitung durasi per-kata dari token.matchedData.durasi (detik),
   *    lalu diskalakan oleh playbackSpeed (misal 1.5x → lebih cepat).
   * 3. Setelah durasi habis: panggil nextWord() untuk maju ke kata berikutnya.
   * 4. Jika sudah di kata terakhir:
   *    - isLooping=true → replay() dari awal.
   *    - isLooping=false → pause() + trigger confetti celebration.
   * 5. Cleanup: clearTimeout saat unmount atau dependency berubah.
   */
  useEffect(() => {
    if (playbackState !== 'PLAYING' || tokens.length === 0) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const currentToken = tokens[currentWordIndex];
    const durationSec = currentToken?.matchedData?.durasi || 2;
    const durationMs = (durationSec * 1000) / playbackSpeed;

    timerRef.current = setTimeout(() => {
      if (currentWordIndex < tokens.length - 1) {
        nextWord();
      } else {
        // Last word reached
        if (isLooping) {
          replay();
        } else {
          pause();
          // Trigger subtle celebration confetti
          try {
            confetti({
              particleCount: 35,
              spread: 60,
              origin: { y: 0.7 }
            });
          } catch (e) {
            // ignore
          }
        }
      }
    }, durationMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playbackState, currentWordIndex, tokens, playbackSpeed, isLooping]);

  /* ===================================================================
   * 4. EVENT HANDLERS — Aksi user pada form & chip
   * =================================================================== */

  /**
   * Handler submit form input teks.
   * Menyimpan teks ke store dan menjalankan tokenisasi.
   * @param {Event} e — Form submit event
   */
  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputVal.trim()) return;
    setTextInput(inputVal);
    translateText(inputVal);
  };

  /**
   * Handler klik chip kalimat contoh.
   * Langsung mengisi input, menyimpan ke store, dan men-trigger terjemahan.
   * @param {string} sentence — Kalimat contoh yang dipilih user
   */
  const handleSampleClick = (sentence) => {
    setInputVal(sentence);
    setTextInput(sentence);
    translateText(sentence);
  };

  /* ===================================================================
   * 5. DERIVED VALUES — Nilai turunan dari state untuk render
   * =================================================================== */
  /** @type {Object|null} Token kata yang sedang aktif diputar */
  const currentToken = tokens[currentWordIndex] || null;
  /** @type {string} Kata aktif untuk dikirim ke canvas animator */
  const currentWord = currentToken?.word || 'siap';
  /** @type {string} Pattern gestur isyarat untuk animasi canvas */
  const currentPattern = currentToken?.matchedData?.gesture_pattern || 'hand_wave_forehead';
  /** @type {string} Deskripsi gerakan isyarat untuk info panel */
  const currentDescription = currentToken?.matchedData?.deskripsi_gerakan || '';
  /** @type {string|null} URL video MP4 dari database PostgreSQL jika tersedia */
  const currentVideoUrl = currentToken?.video_url || currentToken?.matchedData?.video_url || null;
  /** @type {boolean} Apakah pemutar video MP4 aktif dan memiliki berkas video */
  const showVideoPlayer = visualMode === 'video' && Boolean(currentVideoUrl);

  /* ===================================================================
   * 6. JSX RENDER — Tampilan utama komponen
   * =================================================================== */
  return (
    <div className="space-y-6">
      {/* --- 6A. INPUT SECTION: Form ketik kalimat + chip contoh --- */}
      <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-dark-border">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ketik kalimat bahasa Indonesia di sini (contoh: aku sayang ibu)..."
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-dark-bg/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm sm:text-base font-medium shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-500 hover:to-amber-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-brand-600/25 active:scale-[0.98] transition-all cursor-pointer text-sm sm:text-base shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Terjemahkan</span>
            </button>
          </div>

          {/* Sample quick chips */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              Contoh Kalimat
              {dbStatus === 'connected' && (
                <span className="text-[10px] text-emerald-500">({dictionary.length}+ kata di DB)</span>
              )}:
            </span>
            {SAMPLE_SENTENCES.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSampleClick(s)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800/80 hover:bg-brand-50 dark:hover:bg-brand-950/50 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 border border-slate-200 dark:border-slate-700/60 transition-all cursor-pointer"
              >
                "{s}"
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Main Video & Playback Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Sign Canvas Animator */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="aspect-[4/3] w-full min-h-[340px] max-h-[420px] relative">
            {/* Mode 1: Canvas 2D Kinematics Animation (Default) */}
            {!showVideoPlayer && (
              <SignCanvasAnimator
                currentWord={currentWord}
                gesturePattern={currentPattern}
                languageSystem={languageSystem}
                isPlaying={playbackState === 'PLAYING'}
                speed={playbackSpeed}
                description={currentDescription}
              />
            )}

            {/* Mode 2: Video MP4 Player dari Database */}
            {showVideoPlayer && (
              <div className="w-full h-full rounded-2xl overflow-hidden bg-black border border-purple-500/30 shadow-lg shadow-purple-500/10 relative">
                <video
                  ref={videoPlayerRef}
                  key={currentVideoUrl}
                  src={currentVideoUrl}
                  autoPlay={playbackState === 'PLAYING'}
                  loop={false}
                  muted={false}
                  playsInline
                  className="w-full h-full object-contain"
                  onEnded={() => {
                    if (currentWordIndex < tokens.length - 1) {
                      nextWord();
                    } else if (isLooping) {
                      replay();
                    } else {
                      pause();
                    }
                  }}
                />
                {/* Badge Video Mode */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-600/90 backdrop-blur-md text-white border border-purple-400/30 flex items-center gap-1.5">
                    🎬 Video MP4 Asli
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-600/80 backdrop-blur-md text-white border border-emerald-400/30">
                    PostgreSQL
                  </span>
                </div>
              </div>
            )}

            {/* Fallback notice if video mode but no video available */}
            {visualMode === 'video' && !currentVideoUrl && currentToken && (
              <div className="absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-amber-500/10 backdrop-blur-md border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[11px] font-medium text-center">
                ⓘ Video MP4 belum tersedia untuk kata "{currentWord}". Menampilkan animasi Canvas 2D sebagai fallback.
              </div>
            )}
          </div>

          {/* Playback Controls Bar */}
          <div className="mt-3 p-4 rounded-2xl glass-card border border-slate-200 dark:border-dark-border flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Prev Button */}
              <button
                onClick={prevWord}
                disabled={currentWordIndex === 0}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="Kata Sebelumnya"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              {/* Play / Pause Primary Button */}
              <button
                onClick={togglePlayPause}
                className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold flex items-center gap-2 shadow-md shadow-brand-600/30 transition-all cursor-pointer"
              >
                {playbackState === 'PLAYING' ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span className="text-xs sm:text-sm">Jeda</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span className="text-xs sm:text-sm">Putar</span>
                  </>
                )}
              </button>

              {/* Next Button */}
              <button
                onClick={nextWord}
                disabled={currentWordIndex >= tokens.length - 1}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="Kata Selanjutnya"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              {/* Replay */}
              <button
                onClick={replay}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
                title="Putar Ulang dari Awal"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Loop Toggle */}
              <button
                onClick={toggleLooping}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isLooping 
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent'
                }`}
                title={isLooping ? 'Putar Berulang Aktif' : 'Putar Sekali'}
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <span className="text-[11px] font-semibold text-slate-400 px-1 flex items-center gap-1">
                <Sliders className="w-3 h-3" />
              </span>
              {[0.75, 1.0, 1.25, 1.5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Word Progress Sequence & Lexical Details */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-dark-border flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Urutan Kata ({tokens.length > 0 ? `${currentWordIndex + 1}/${tokens.length}` : '0'})
              </h4>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Klik kata untuk melompat
              </span>
            </div>

            {/* Word Chips List */}
            {tokens.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
                <p className="text-sm">Belum ada kalimat yang dimasukkan.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 mb-4">
                {tokens.map((token, idx) => {
                  const isActive = idx === currentWordIndex;
                  const isPassed = idx < currentWordIndex;
                  const isAvailable = token.isAvailable;

                  return (
                    <button
                      key={idx}
                      onClick={() => jumpToWord(idx)}
                      className={`px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                        isActive
                          ? 'bg-gradient-to-r from-brand-600 to-amber-600 text-white border-transparent shadow-lg shadow-brand-600/30 scale-105 ring-2 ring-amber-400'
                          : isPassed
                          ? 'bg-slate-100 dark:bg-slate-800/80 text-amber-600 dark:text-amber-400 border-amber-500/20'
                          : isAvailable
                          ? 'bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:border-brand-500'
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                      }`}
                    >
                      <span>{token.word}</span>
                      {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                      {!isAvailable && <AlertCircle className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Current Active Word Detail Box */}
            {currentToken && (
              <div className="mt-auto p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase flex items-center gap-1.5">
                    Kamus {languageSystem}
                    {currentToken?.fromPostgres && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-500 font-bold normal-case">
                        PostgreSQL
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Durasi: ~{currentToken.matchedData?.durasi || 2}s
                  </span>
                </div>
                <h5 className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                  "{currentToken.word}"
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentToken.matchedData?.deskripsi_gerakan}
                </p>
                {currentToken.matchedData?.contoh_kalimat && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-200 dark:border-slate-800">
                    Contoh: "{currentToken.matchedData.contoh_kalimat}"
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
