import React, { useState } from 'react';
import { 
  Keyboard, 
  Cpu, 
  PlaySquare, 
  Camera, 
  Eye, 
  FileText, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function HowItWorks() {
  const [activeWorkflow, setActiveWorkflow] = useState('text-to-sign');

  const textToSignSteps = [
    {
      step: "01",
      icon: Keyboard,
      title: "Ketik Kalimat Teks",
      desc: "Masukkan kalimat dalam bahasa Indonesia formal atau sehari-hari pada kolom input translator."
    },
    {
      step: "02",
      icon: Cpu,
      title: "Pemecahan Token Kata",
      desc: "Algoritma SETARA memetakan kalimat menjadi urutan kata leksikal dan frase majemuk yang terdaftar di kamus."
    },
    {
      step: "03",
      icon: PlaySquare,
      title: "Putar Video Isyarat",
      desc: "Video peragaan isyarat (SIBI atau BISINDO) diputar secara sekuensial dan mulus dengan kontrol kecepatan fleksibel."
    }
  ];

  const signToTextSteps = [
    {
      step: "01",
      icon: Camera,
      title: "Izinkan Akses Webcam",
      desc: "Buka halaman kamera di browser Anda tanpa perlu mengunduh aplikasi atau sensor tambahan."
    },
    {
      step: "02",
      icon: Eye,
      title: "YOLO 11 Hand Pose Tracking",
      desc: "Kecerdasan buatan mendeteksi 21 titik koordinat sendi tangan dan gerakan spasial secara real-time."
    },
    {
      step: "03",
      icon: FileText,
      title: "Konversi ke Teks Seketika",
      desc: "Model sekuensial menerjemahkan gestur menjadi kalimat teks yang dapat langsung disalin ke clipboard."
    }
  ];

  const currentSteps = activeWorkflow === 'text-to-sign' ? textToSignSteps : signToTextSteps;

  return (
    <section className="py-16 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Alur Penggunaan Platform</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Bagaimana Cara Kerjanya?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Dua jalur penerjemahan pintar yang sangat mudah digunakan oleh siapa saja.
          </p>
        </div>

        {/* Workflow Switcher Buttons */}
        <div className="flex items-center justify-center mb-12">
          <div className="p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setActiveWorkflow('text-to-sign')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeWorkflow === 'text-to-sign'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Jalur A: Teks ➔ Video Isyarat
            </button>
            <button
              onClick={() => setActiveWorkflow('sign-to-text')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeWorkflow === 'sign-to-text'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Jalur B: Kamera ➔ Teks (AI)
            </button>
          </div>
        </div>

        {/* Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {currentSteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative rounded-3xl p-6 sm:p-8 glass-card border border-slate-200 dark:border-dark-border space-y-4 hover:border-brand-500/50 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-500 flex items-center justify-center font-bold">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-200 dark:text-slate-800 group-hover:text-brand-500/30 transition-colors font-mono">
                    {item.step}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
