import React from 'react';
import { 
  Type, 
  Camera, 
  BookOpen, 
  Users, 
  Sparkles, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Layers,
  Activity
} from 'lucide-react';

export default function BentoFeatures({ onSelectFeature }) {
  return (
    <section className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fitur Unggulan Platform</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Dirancang untuk Menjawab Kebutuhan Nyata
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Menggabungkan teknologi Computer Vision mutakhir dengan kekayaan linguistik isyarat Indonesia.
          </p>
        </div>

        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Bento Card 1: Text to Sign (Col-Span 2) */}
          <div 
            onClick={() => onSelectFeature('translator')}
            className="md:col-span-2 lg:col-span-2 rounded-3xl p-6 sm:p-8 glass-card border border-slate-200 dark:border-dark-border hover:border-brand-500/60 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Type className="w-36 h-36 text-brand-500" />
            </div>

            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-500 flex items-center justify-center font-bold">
                <Type className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-500 uppercase tracking-wider">
                  Text to Sign
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                  Pemutar Video Isyarat Kata Demi Kata
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-md">
                  Ketik kalimat apa saja, sistem akan memecahnya menjadi deretan kata terstruktur dan memutar video peragaan secara mulus dengan kontrol kecepatan penuh.
                </p>
              </div>
            </div>

            <div className="pt-6 flex items-center gap-2 text-xs font-bold text-brand-500 group-hover:translate-x-1 transition-transform">
              <span>Buka Modul Teks ke Isyarat</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Bento Card 2: Sign to Text AI (Col-Span 2) */}
          <div 
            onClick={() => onSelectFeature('translator')}
            className="md:col-span-1 lg:col-span-2 rounded-3xl p-6 sm:p-8 glass-card border border-slate-200 dark:border-dark-border hover:border-amber-500/60 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Camera className="w-36 h-36 text-amber-500" />
            </div>

            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                <Camera className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 uppercase tracking-wider">
                  Sign to Text AI
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                  Kamera Real-Time dengan YOLO 11 Pose
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-md">
                  Deteksi 21 titik sendi tangan berkecepatan 30 FPS secara real-time langsung melalui browser laptop atau smartphone tanpa lag.
                </p>
              </div>
            </div>

            <div className="pt-6 flex items-center gap-2 text-xs font-bold text-amber-500 group-hover:translate-x-1 transition-transform">
              <span>Coba Kamera Deteksi Isyarat</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Bento Card 3: Edukasi Komparasi (Col-Span 2) */}
          <div 
            onClick={() => onSelectFeature('edukasi')}
            className="md:col-span-2 lg:col-span-2 rounded-3xl p-6 sm:p-8 glass-card border border-slate-200 dark:border-dark-border hover:border-purple-500/60 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-500 flex items-center justify-center font-bold">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-500 uppercase tracking-wider">
                  Komparasi Edukatif
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors">
                  Edukasi Mendalam SIBI vs BISINDO
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Pahami sejarah, perbedaan struktur tata bahasa, afiksasi kata, dan etika komunikasi dengan komunitas Tuli melalui infografis interaktif.
                </p>
              </div>
            </div>

            <div className="pt-6 flex items-center gap-2 text-xs font-bold text-purple-500 group-hover:translate-x-1 transition-transform">
              <span>Pelajari Perbedaan Sistem</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Bento Card 4: Komunitas & Timeline (Col-Span 2) */}
          <div 
            onClick={() => onSelectFeature('komunitas')}
            className="md:col-span-1 lg:col-span-2 rounded-3xl p-6 sm:p-8 glass-card border border-slate-200 dark:border-dark-border hover:border-amber-500/60 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 uppercase tracking-wider">
                  Komunitas & Edukasi
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                  Ruang Komunitas Inklusif
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Ikuti jadwal workshop isyarat untuk tenaga kesehatan, webinar etika, kumpul santai komunitas, dan pantau jejak milestone perjalanan kami.
                </p>
              </div>
            </div>

            <div className="pt-6 flex items-center gap-2 text-xs font-bold text-amber-500 group-hover:translate-x-1 transition-transform">
              <span>Jelajahi Aktivitas Komunitas</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
