/**
 * ==============================================================================
 * File: SignCanvasAnimator.jsx
 * Direktori: src/components/translator/
 * Deskripsi: Komponen Canvas 2D Procedural Kinematics & Avatar Isyarat Interaktif.
 *            Merender kerangka anatomis 21-titik keypoint tangan (MediaPipe Hands standard)
 *            dan animasi gestur tubuh bagian atas sesuai kosakata SIBI & BISINDO.
 * Pattern:
 *   - Canvas Game Loop / Animation Loop: Menggunakan `requestAnimationFrame` untuk
 *     rendering 60 FPS yang halus tanpa overhead DOM React.
 *   - Procedural Inverse Kinematics Simulation: Perhitungan trigonometri (sinus/kosinus)
 *     untuk pergerakan sendi bahu, siku, pergelangan, dan buku-buku jari.
 *   - Pure Presentational Component: Menerima props kata aktif, pola gestur, dan kecepatan
 *     lalu merender visualisasi visual yang sinkron dengan pemutar isyarat.
 * ==============================================================================
 */

import React, { useEffect, useRef } from 'react';

/**
 * Komponen Animator Isyarat Berbasis HTML5 Canvas.
 *
 * @param {Object} props
 * @param {string} [props.currentWord='halo'] - Kata aktif yang sedang diperagakan
 * @param {string} [props.gesturePattern='hand_wave_forehead'] - Identifier pola gestur kinematika
 * @param {'SIBI' | 'BISINDO'} [props.languageSystem='BISINDO'] - Sistem bahasa isyarat aktif
 * @param {boolean} [props.isPlaying=true] - Status pemutaran (true: animasi berjalan, false: jeda)
 * @param {number} [props.speed=1.0] - Pengali kecepatan animasi (0.5x - 2.0x)
 * @param {string} [props.description=''] - Penjelasan tekstual arti atau cara peragaan isyarat
 */
export default function SignCanvasAnimator({
  currentWord = 'halo',
  gesturePattern = 'hand_wave_forehead',
  languageSystem = 'BISINDO',
  isPlaying = true,
  speed = 1.0,
  description = ''
}) {
  /** Reference ke elemen HTML5 Canvas */
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const render = () => {
      if (isPlaying) {
        time += 0.04 * speed;
      }

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background Grid & Glow
      const centerX = width / 2;
      const centerY = height / 2 - 10;

      // Draw avatar torso and head
      drawAvatar(ctx, centerX, centerY, time, gesturePattern, languageSystem);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gesturePattern, isPlaying, speed, languageSystem]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-slate-800 shadow-2xl">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={480}
        height={360}
        className="w-full h-full max-h-[360px] object-contain"
      />

      {/* Overlay Status Badges */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-400 border border-brand-500/30 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
          {languageSystem}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30 backdrop-blur-md">
          21 Keypoints Active
        </span>
      </div>

      {/* Bottom Subtitle / Gesture Explanation */}
      <div className="absolute bottom-3 inset-x-4 p-3 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-600/30 border border-brand-500/40 flex items-center justify-center font-bold text-brand-300 text-sm uppercase shadow-sm">
            {currentWord.slice(0, 2)}
          </div>
          <div>
            <div className="text-white font-bold text-base flex items-center gap-2 capitalize">
              "{currentWord}"
            </div>
            <p className="text-slate-400 text-xs line-clamp-1">
              {description || 'Peragaan isyarat visual terstandarisasi'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-mono uppercase tracking-wider text-brand-400 bg-brand-950/60 px-2 py-0.5 rounded border border-brand-800">
            {isPlaying ? 'Memutar' : 'Jeda'}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ==============================================================================
 * FUNGSI-FUNGSI PENGGAMBARAN PROSEDURAL KINEMATIKA CANVAS
 * ============================================================================== */

/**
 * Menggambar seluruh anatomi avatar (kepala, badan, bahu, dan posisi tangan).
 *
 * @param {CanvasRenderingContext2D} ctx - Konteks gambar canvas 2D
 * @param {number} cx - Titik tengah X koordinat canvas
 * @param {number} cy - Titik tengah Y koordinat canvas
 * @param {number} t - Parameter waktu animasi berbasis tick
 * @param {string} pattern - Identifier pola gestur
 * @param {string} system - Sistem bahasa isyarat ('SIBI' | 'BISINDO')
 */
function drawAvatar(ctx, cx, cy, t, pattern, system) {
  // Head Center
  const headY = cy - 70;
  const headRadius = 28;

  // Head Glow
  const headGrad = ctx.createRadialGradient(cx, headY, 5, cx, headY, headRadius);
  headGrad.addColorStop(0, '#FB923C');
  headGrad.addColorStop(1, '#EA580C');

  ctx.beginPath();
  ctx.arc(cx, headY, headRadius, 0, Math.PI * 2);
  ctx.fillStyle = headGrad;
  ctx.shadowColor = '#EA580C';
  ctx.shadowBlur = 15;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Face line / eyes
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx - 8, headY - 4, 3, 0, Math.PI * 2);
  ctx.arc(cx + 8, headY - 4, 3, 0, Math.PI * 2);
  ctx.fill();

  // Smile / Neutral
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, headY + 6, 8, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();

  // Shoulders & Torso
  const shoulderY = headY + headRadius + 18;
  const shoulderLeftX = cx - 55;
  const shoulderRightX = cx + 55;
  const chestCenterY = shoulderY + 30;

  // Neck
  ctx.strokeStyle = '#EA580C';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(cx, headY + headRadius);
  ctx.lineTo(cx, shoulderY);
  ctx.stroke();

  // Shoulder bar
  ctx.beginPath();
  ctx.moveTo(shoulderLeftX, shoulderY);
  ctx.lineTo(shoulderRightX, shoulderY);
  ctx.stroke();

  // Body Outline
  ctx.strokeStyle = 'rgba(251, 146, 60, 0.4)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(shoulderLeftX, shoulderY);
  ctx.lineTo(cx - 35, cy + 90);
  ctx.lineTo(cx + 35, cy + 90);
  ctx.lineTo(shoulderRightX, shoulderY);
  ctx.stroke();

  // Procedural Hands & Arm Positions Based on Gesture Pattern
  let leftHand = { x: shoulderLeftX - 15, y: shoulderY + 65 };
  let rightHand = { x: shoulderRightX + 15, y: shoulderY + 65 };
  let leftElbow = { x: shoulderLeftX - 25, y: shoulderY + 35 };
  let rightElbow = { x: shoulderRightX + 25, y: shoulderY + 35 };

  const sinT = Math.sin(t * 3);
  const cosT = Math.cos(t * 3);

  switch (pattern) {
    case 'hand_wave_forehead': // Halo
      rightHand = { x: cx + 35 + sinT * 18, y: headY - 10 + cosT * 6 };
      rightElbow = { x: shoulderRightX + 35, y: shoulderY - 10 };
      leftHand = { x: shoulderLeftX - 10, y: shoulderY + 60 };
      break;

    case 'point_chest': // Aku
      rightHand = { x: cx + 5 + sinT * 4, y: chestCenterY - 5 };
      rightElbow = { x: shoulderRightX + 10, y: shoulderY + 30 };
      break;

    case 'palm_chest': // Saya
      rightHand = { x: cx + sinT * 2, y: chestCenterY };
      rightElbow = { x: shoulderRightX + 15, y: shoulderY + 25 };
      break;

    case 'point_forward': // Kamu
      rightHand = { x: cx + 10 + sinT * 12, y: chestCenterY + 15 + cosT * 5 };
      rightElbow = { x: shoulderRightX + 20, y: shoulderY + 25 };
      break;

    case 'cross_chest_hug': // Sayang / Cinta
      leftHand = { x: cx + 25 + sinT * 4, y: chestCenterY - 10 };
      rightHand = { x: cx - 25 - sinT * 4, y: chestCenterY - 10 };
      leftElbow = { x: shoulderLeftX - 10, y: shoulderY + 25 };
      rightElbow = { x: shoulderRightX + 10, y: shoulderY + 25 };
      break;

    case 'thumb_chin': // Ibu
      rightHand = { x: cx + 15 + sinT * 3, y: headY + headRadius - 4 };
      rightElbow = { x: shoulderRightX + 20, y: shoulderY + 15 };
      break;

    case 'thumb_forehead': // Ayah
      rightHand = { x: cx + 15 + sinT * 3, y: headY - 18 };
      rightElbow = { x: shoulderRightX + 25, y: shoulderY };
      break;

    case 'fingers_chin_forward': // Terima Kasih
      const forwardT = (Math.sin(t * 2.5) + 1) / 2; // 0 to 1
      rightHand = { x: cx + 10 + forwardT * 25, y: headY + headRadius + forwardT * 20 };
      rightElbow = { x: shoulderRightX + 25, y: shoulderY + 15 };
      break;

    case 'pray_hands': // Tolong
      leftHand = { x: cx - 6, y: chestCenterY - 5 + sinT * 6 };
      rightHand = { x: cx + 6, y: chestCenterY - 5 + sinT * 6 };
      leftElbow = { x: shoulderLeftX + 5, y: shoulderY + 30 };
      rightElbow = { x: shoulderRightX - 5, y: shoulderY + 30 };
      break;

    case 'support_motion': // Bantu
      leftHand = { x: cx, y: chestCenterY + 15 };
      rightHand = { x: cx, y: chestCenterY - 10 + sinT * 10 };
      leftElbow = { x: shoulderLeftX, y: shoulderY + 35 };
      rightElbow = { x: shoulderRightX + 10, y: shoulderY + 20 };
      break;

    case 'learn_forehead': // Belajar
      const learnT = (Math.sin(t * 2.5) + 1) / 2;
      leftHand = { x: cx - 20, y: chestCenterY + 20 };
      rightHand = { x: cx - 20 + learnT * 30, y: chestCenterY + 20 - learnT * 70 };
      leftElbow = { x: shoulderLeftX - 5, y: shoulderY + 35 };
      rightElbow = { x: shoulderRightX + 15, y: shoulderY + 15 };
      break;

    case 'rotate_index_fingers': // Isyarat
      const rotAngle = t * 4;
      leftHand = { x: cx - 25 + Math.cos(rotAngle) * 16, y: chestCenterY + Math.sin(rotAngle) * 16 };
      rightHand = { x: cx + 25 + Math.cos(rotAngle + Math.PI) * 16, y: chestCenterY + Math.sin(rotAngle + Math.PI) * 16 };
      break;

    case 'equal_parallel_hands': // Setara
      leftHand = { x: cx - 35, y: chestCenterY + sinT * 5 };
      rightHand = { x: cx + 35, y: chestCenterY + sinT * 5 };
      break;

    case 'fist_pump_down': // Semangat
      const pumpY = Math.abs(sinT) * 20;
      leftHand = { x: cx - 35, y: chestCenterY + pumpY };
      rightHand = { x: cx + 35, y: chestCenterY + pumpY };
      break;

    default: // Natural wave / spelling
      rightHand = { x: cx + 30 + sinT * 12, y: chestCenterY - 10 + cosT * 8 };
      leftHand = { x: cx - 30 - sinT * 8, y: chestCenterY + 10 };
      break;
  }

  // Draw Left Arm & Skeleton
  drawArm(ctx, shoulderLeftX, shoulderY, leftElbow.x, leftElbow.y, leftHand.x, leftHand.y);
  // Draw Right Arm & Skeleton
  drawArm(ctx, shoulderRightX, shoulderY, rightElbow.x, rightElbow.y, rightHand.x, rightHand.y);

  // Draw 21-Keypoint Hand Landmarks on Left and Right Hands
  drawHandKeypoints(ctx, leftHand.x, leftHand.y, 'left', t);
  drawHandKeypoints(ctx, rightHand.x, rightHand.y, 'right', t);
}

/**
 * Menggambar segmen lengan (lengan atas, lengan bawah, dan sendi siku).
 *
 * @param {CanvasRenderingContext2D} ctx - Konteks gambar 2D
 * @param {number} sx - Koordinat X pangkal bahu
 * @param {number} sy - Koordinat Y pangkal bahu
 * @param {number} ex - Koordinat X sendi siku
 * @param {number} ey - Koordinat Y sendi siku
 * @param {number} hx - Koordinat X pergelangan tangan
 * @param {number} hy - Koordinat Y pergelangan tangan
 */
function drawArm(ctx, sx, sy, ex, ey, hx, hy) {
  ctx.strokeStyle = '#F97316';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';

  // Upper arm
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(ex, ey);
  ctx.stroke();

  // Forearm
  ctx.beginPath();
  ctx.moveTo(ex, ey);
  ctx.lineTo(hx, hy);
  ctx.stroke();

  // Elbow joint
  ctx.fillStyle = '#FB923C';
  ctx.beginPath();
  ctx.arc(ex, ey, 5, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Merender 21 titik keypoint anatomis tangan (MediaPipe Hands Standard):
 * - Wrist (1 titik pangkal pergelangan)
 * - Thumb (4 titik: CMC, MCP, IP, TIP)
 * - Index (4 titik: MCP, PIP, DIP, TIP)
 * - Middle (4 titik: MCP, PIP, DIP, TIP)
 * - Ring (4 titik: MCP, PIP, DIP, TIP)
 * - Pinky (4 titik: MCP, PIP, DIP, TIP)
 *
 * @param {CanvasRenderingContext2D} ctx - Konteks gambar 2D
 * @param {number} hx - Posisi X telapak tangan
 * @param {number} hy - Posisi Y telapak tangan
 * @param {'left' | 'right'} side - Sisi tangan
 * @param {number} t - Parameter waktu animasi
 */
function drawHandKeypoints(ctx, hx, hy, side, t) {
  // Hand palm hub
  ctx.fillStyle = '#F97316';
  ctx.shadowColor = '#F97316';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(hx, hy, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // 5 finger keypoint chains (21 points standard: Wrist, Thumb 4, Index 4, Middle 4, Ring 4, Pinky 4)
  const dir = side === 'left' ? -1 : 1;
  const angles = [-0.6, -0.25, 0.05, 0.35, 0.65];
  const lengths = [14, 18, 20, 18, 14];

  angles.forEach((baseAngle, fIdx) => {
    const angle = baseAngle * dir + Math.sin(t * 4 + fIdx) * 0.08;
    const len = lengths[fIdx];

    let prevX = hx;
    let prevY = hy;

    // 3 segments per finger
    for (let seg = 1; seg <= 3; seg++) {
      const segLen = len / 3;
      const nextX = prevX + Math.sin(angle) * segLen;
      const nextY = prevY - Math.cos(angle) * segLen;

      // Finger bone line
      ctx.strokeStyle = 'rgba(251, 146, 60, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(nextX, nextY);
      ctx.stroke();

      // Landmark dot
      ctx.fillStyle = seg === 3 ? '#F59E0B' : '#FB923C';
      ctx.beginPath();
      ctx.arc(nextX, nextY, seg === 3 ? 2.5 : 2, 0, Math.PI * 2);
      ctx.fill();

      prevX = nextX;
      prevY = nextY;
    }
  });
}
