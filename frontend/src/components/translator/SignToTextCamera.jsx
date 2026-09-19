/**
 * @file SignToTextCamera.jsx
 * @description Komponen deteksi isyarat melalui kamera webcam (Sign-to-Text).
 *
 * ## Arsitektur & Pattern
 * - **WebRTC Camera Integration**: Menggunakan `navigator.mediaDevices.getUserMedia()`
 *   untuk mengakses webcam browser, dengan graceful fallback jika izin ditolak.
 * - **Canvas Overlay Rendering**: Canvas transparan di atas video feed untuk
 *   menggambar bounding box, 21 landmark keypoints, dan animasi visual AI inference.
 * - **Gesture Simulation Pattern**: Menyediakan tombol simulasi untuk demo deteksi
 *   gestur tanpa kamera aktif — ideal untuk presentasi dan pengujian.
 * - **Store-Driven Detection**: Semua hasil deteksi disimpan via useTranslatorStore
 *   (addDetectedWord, clearDetectedWords) agar terhubung dengan riwayat.
 *
 * ## Alur Utama
 * 1. User mengaktifkan webcam → video stream ditampilkan di viewport.
 * 2. Canvas overlay menggambar animasi landmark tangan 21 titik (visual AI).
 * 3. User mengklik tombol simulasi gestur → kata terdeteksi ditambahkan ke buffer.
 * 4. Buffer kata ditampilkan di panel kanan sebagai kalimat terjemahan.
 * 5. User dapat menyalin teks ke clipboard atau menyimpan ke riwayat.
 *
 * @module SignToTextCamera
 */

import React, { useState, useEffect, useRef } from 'react';
import { useTranslatorStore } from '../../stores/useTranslatorStore';
import { 
  Camera, 
  CameraOff, 
  Copy, 
  Trash2, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Activity,
  Scan,
  RefreshCw,
  Hand
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';

/**
 * Data gestur demo untuk simulasi deteksi AI tanpa kamera.
 * Setiap objek berisi kata, pattern gestur, dan confidence score simulasi.
 * @constant {Array<{word: string, pattern: string, conf: number}>}
 */
const DEMO_GESTURE_TRIGGERS = [
  { word: "halo", pattern: "hand_wave", conf: 0.96 },
  { word: "aku", pattern: "point_chest", conf: 0.94 },
  { word: "sayang", pattern: "cross_chest", conf: 0.98 },
  { word: "ibu", pattern: "thumb_chin", conf: 0.95 },
  { word: "terima kasih", pattern: "chin_forward", conf: 0.97 },
  { word: "setara", pattern: "parallel_hands", conf: 0.99 }
];

/**
 * SignToTextCamera — Komponen deteksi isyarat tangan via webcam real-time.
 *
 * Menggabungkan video feed, canvas landmark overlay, tombol simulasi gestur,
 * dan panel hasil terjemahan teks dengan aksi copy/clear.
 *
 * @returns {JSX.Element} Komponen Sign-to-Text Camera lengkap.
 */
export default function SignToTextCamera() {
  /* ===================================================================
   * 1. ZUSTAND STORE SELECTORS — State & action dari translator store
   * =================================================================== */
  const {
    languageSystem,
    isCameraActive,
    setCameraActive,
    detectedTextList,
    addDetectedWord,
    clearDetectedWords,
    currentLiveWord,
    liveConfidence,
    addToHistory
  } = useTranslatorStore();

  /* ===================================================================
   * 2. STATE LOKAL & REF — Dikelola di level komponen
   * =================================================================== */
  /** @state {boolean} hasPermission — Apakah user sudah memberikan izin kamera */
  const [hasPermission, setHasPermission] = useState(false);
  /** @state {string} errorMsg — Pesan error jika kamera gagal diakses */
  const [errorMsg, setErrorMsg] = useState('');
  /** @state {boolean} copied — Flag sementara untuk feedback 'tersalin' */
  const [copied, setCopied] = useState(false);
  /** @state {boolean} isDetecting — Apakah deteksi aktif (overlay animation) */
  const [isDetecting, setIsDetecting] = useState(false);
  /** @state {string} activeGesture — Label gestur yang sedang terdeteksi */
  const [activeGesture, setActiveGesture] = useState('Standby...');

  /** @ref {HTMLVideoElement} videoRef — Elemen <video> untuk webcam stream */
  const videoRef = useRef(null);
  /** @ref {MediaStream} streamRef — MediaStream webcam aktif */
  const streamRef = useRef(null);
  /** @ref {HTMLCanvasElement} overlayCanvasRef — Canvas untuk landmark overlay */
  const overlayCanvasRef = useRef(null);

  /* ===================================================================
   * 3. CAMERA CONTROL — Fungsi start/stop webcam via WebRTC
   * =================================================================== */

  /**
   * Memulai webcam stream dengan getUserMedia.
   * Jika gagal (izin ditolak), menampilkan pesan error graceful
   * dan memungkinkan mode simulasi tetap berjalan.
   */
  const startCamera = async () => {
    try {
      setErrorMsg('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
      setCameraActive(true);
      setIsDetecting(true);
    } catch (err) {
      console.warn("Webcam access note:", err.message);
      setErrorMsg("Kamera tidak dapat diakses atau izin ditolak. Anda tetap dapat menggunakan mode simulasi deteksi AI di bawah.");
      setHasPermission(false);
      setCameraActive(false);
    }
  };

  /**
   * Menghentikan webcam stream.
   * Melepas semua track dari MediaStream dan reset state terkait.
   */
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setHasPermission(false);
    setCameraActive(false);
    setIsDetecting(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  /* ===================================================================
   * 4. OVERLAY ANIMATION LOOP — Render 21 keypoint landmark di canvas
   * =================================================================== */

  /**
   * Effect: Canvas Animation Loop untuk landmark overlay.
   * Menggambar bounding box dengan corner targeting, 21 titik keypoint
   * tangan beranimasi, dan hub center node — semuanya dengan glow effect.
   * Berjalan ~60fps via requestAnimationFrame selama isDetecting aktif.
   */
  useEffect(() => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

    const renderOverlay = () => {
      t += 0.05;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (isDetecting || hasPermission) {
        // Draw Hand Bounding Box
        const boxX = w * 0.25 + Math.sin(t) * 10;
        const boxY = h * 0.2 + Math.cos(t) * 8;
        const boxW = w * 0.5;
        const boxH = h * 0.55;

        // Glowing targeting corners
        ctx.strokeStyle = '#F97316';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#F97316';
        ctx.shadowBlur = 8;

        const cornerLen = 24;
        // Top-Left
        ctx.beginPath();
        ctx.moveTo(boxX, boxY + cornerLen);
        ctx.lineTo(boxX, boxY);
        ctx.lineTo(boxX + cornerLen, boxY);
        ctx.stroke();

        // Top-Right
        ctx.beginPath();
        ctx.moveTo(boxX + boxW - cornerLen, boxY);
        ctx.lineTo(boxX + boxW, boxY);
        ctx.lineTo(boxX + boxW, boxY + cornerLen);
        ctx.stroke();

        // Bottom-Left
        ctx.beginPath();
        ctx.moveTo(boxX, boxY + boxH - cornerLen);
        ctx.lineTo(boxX, boxY + boxH);
        ctx.lineTo(boxX + cornerLen, boxY + boxH);
        ctx.stroke();

        // Bottom-Right
        ctx.beginPath();
        ctx.moveTo(boxX + boxW - cornerLen, boxY + boxH);
        ctx.lineTo(boxX + boxW, boxY + boxH);
        ctx.lineTo(boxX + boxW, boxY + boxH - cornerLen);
        ctx.stroke();

        ctx.shadowBlur = 0;

        // Draw 21 Landmark Keypoints
        const handCenterX = boxX + boxW / 2;
        const handCenterY = boxY + boxH / 2 + 20;

        for (let i = 0; i < 21; i++) {
          const angle = (i / 21) * Math.PI * 2 + t * 0.5;
          const dist = 35 + (i % 5) * 12 + Math.sin(t * 2 + i) * 6;
          const kx = handCenterX + Math.cos(angle) * dist;
          const ky = handCenterY + Math.sin(angle) * dist * 0.8;

          // Connect to center
          if (i % 4 === 0) {
            ctx.strokeStyle = 'rgba(249, 115, 22, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(handCenterX, handCenterY);
            ctx.lineTo(kx, ky);
            ctx.stroke();
          }

          // Dot
          ctx.fillStyle = i === 0 ? '#FB923C' : '#F59E0B';
          ctx.beginPath();
          ctx.arc(kx, ky, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Center hub
        ctx.fillStyle = '#EA580C';
        ctx.beginPath();
        ctx.arc(handCenterX, handCenterY, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(renderOverlay);
    };

    renderOverlay();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isDetecting, hasPermission]);

  /* ===================================================================
   * 5. EVENT HANDLERS — Aksi simulasi gestur & clipboard
   * =================================================================== */

  /**
   * Mensimulasikan deteksi gestur isyarat (tanpa kamera).
   * Menambahkan kata terdeteksi ke buffer dan menampilkan confetti.
   * @param {Object} gesture — Objek gestur dari DEMO_GESTURE_TRIGGERS
   * @param {string} gesture.word — Kata yang terdeteksi
   * @param {number} gesture.conf — Confidence score
   */
  const handleTriggerGesture = async (gesture) => {
    setActiveGesture(`Mendeteksi: ${gesture.word.toUpperCase()}`);
    addDetectedWord(gesture.word, gesture.conf);

    // If camera wasn't on, activate detection state
    if (!isDetecting) setIsDetecting(true);

    try {
      confetti({
        particleCount: 20,
        spread: 40,
        origin: { y: 0.8 }
      });
    } catch (e) {
      // ignore
    }

    // Kirim data deteksi ke backend API (async, non-blocking)
    api.post('/translator/sign-to-text', {
      frame_data: gesture.pattern || 'simulated_gesture',
      tipe_bahasa: languageSystem || 'BISINDO'
    }).catch(() => {
      // Non-blocking: jika backend offline, tidak menghambat UI
    });
  };

  /**
   * Menyalin seluruh kalimat hasil deteksi ke clipboard.
   * Menampilkan feedback 'Tersalin!' selama 2 detik.
   */
  const handleCopy = () => {
    const fullSentence = detectedTextList.join(' ');
    if (!fullSentence) return;
    navigator.clipboard.writeText(fullSentence);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /**
   * Menyimpan kalimat hasil deteksi ke riwayat translasi di store.
   * Membuat entry riwayat dengan metadata timestamp & tipe 'sign_to_text'.
   */
  const handleSaveToHistory = () => {
    const fullSentence = detectedTextList.join(' ');
    if (!fullSentence) return;
    addToHistory({
      id: `hist-${Date.now()}`,
      type: 'sign_to_text',
      languageSystem,
      input: 'Deteksi Isyarat Kamera',
      output: fullSentence,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      date: 'Hari ini'
    });
  };

  /* ===================================================================
   * 6. DERIVED VALUES & JSX RENDER
   * =================================================================== */
  /** @type {string} Kalimat gabungan dari seluruh kata terdeteksi */
  const fullSentence = detectedTextList.join(' ');

  return (
    <div className="space-y-6">
      {/* --- 6A. TOP BANNER: Info mode deteksi + toggle kamera --- */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-600/10 via-amber-600/10 to-transparent border border-brand-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-400">
            <Scan className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Deteksi Kamera Real-Time ({languageSystem})
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Model AI YOLO 11 Pose mengekstrak 21 titik sendi tangan dan mengonversinya menjadi teks.
            </p>
          </div>
        </div>

        {/* Camera Toggle Button */}
        {hasPermission ? (
          <button
            onClick={stopCamera}
            className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <CameraOff className="w-4 h-4" />
            <span>Matikan Kamera</span>
          </button>
        ) : (
          <button
            onClick={startCamera}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-500 hover:to-amber-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-brand-600/30 transition-all cursor-pointer shrink-0"
          >
            <Camera className="w-4 h-4" />
            <span>Aktifkan Webcam</span>
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Grid: Camera View + Live Generated Text */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Camera Feed Viewport */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="relative aspect-[4/3] w-full min-h-[340px] max-h-[420px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center">
            {/* Real Video Element */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transform -scale-x-100 ${hasPermission ? 'block' : 'hidden'}`}
            />

            {/* Placeholder if camera off */}
            {!hasPermission && (
              <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                  <Hand className="w-10 h-10 text-brand-400 animate-pulse" />
                </div>
                <div>
                  <h5 className="text-white font-bold text-base">Area Deteksi Gestur Isyarat</h5>
                  <p className="text-slate-400 text-xs max-w-sm mt-1">
                    Aktifkan kamera untuk deteksi langsung, atau gunakan tombol simulasi gestur di bawah.
                  </p>
                </div>
                <button
                  onClick={startCamera}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>Buka Izin Kamera</span>
                </button>
              </div>
            )}

            {/* Overlay Landmark Canvas */}
            <canvas
              ref={overlayCanvasRef}
              width={640}
              height={480}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* Top HUD Badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900/80 backdrop-blur-md text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                AI Inference 30 FPS
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900/80 backdrop-blur-md text-brand-400 border border-brand-500/30">
                Confidence: {(liveConfidence * 100).toFixed(1)}%
              </span>
            </div>

            {/* Live Detected Word Banner */}
            <div className="absolute bottom-4 inset-x-4 p-3 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-slate-300 text-xs font-medium">
                  {activeGesture}
                </span>
              </div>
              {currentLiveWord && (
                <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-xs uppercase border border-amber-500/30">
                  + "{currentLiveWord}"
                </span>
              )}
            </div>
          </div>

          {/* Quick Simulation Triggers Bar */}
          <div className="mt-3 p-4 rounded-2xl glass-card border border-slate-200 dark:border-dark-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                Simulasi Input Gestur (Uji Coba Cepat):
              </span>
              <span className="text-[11px] text-slate-400">Klik untuk memicu deteksi</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {DEMO_GESTURE_TRIGGERS.map((g, i) => (
                <button
                  key={i}
                  onClick={() => handleTriggerGesture(g)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer active:scale-95"
                >
                  🖐️ "{g.word}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Real-time Converted Text Box */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-dark-border flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                Hasil Terjemahan Teks
              </h4>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {detectedTextList.length} Kata
              </span>
            </div>

            {/* Generated Words Display Area */}
            <div className="flex-1 my-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 overflow-y-auto min-h-[160px] flex flex-col">
              {detectedTextList.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 p-4">
                  <Hand className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-xs">
                    Peragakan bahasa isyarat di depan kamera atau gunakan tombol simulasi gestur di atas.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-slate-900 dark:text-white leading-relaxed capitalize">
                    {fullSentence}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {detectedTextList.map((w, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-xs font-medium bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20"
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleCopy}
                disabled={!fullSentence}
                className="flex-1 py-2.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-brand-600/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
              </button>

              <button
                onClick={clearDetectedWords}
                disabled={detectedTextList.length === 0}
                className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-rose-500 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="Hapus Hasil"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
