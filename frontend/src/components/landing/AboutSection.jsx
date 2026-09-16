/**
 * ==============================================================================
 * File: AboutSection.jsx
 * Direktori: src/components/landing/
 * Deskripsi: Section Profil, Visi, Misi, Nilai-Nilai Utama, dan Kanal Kontak Platform SETARA.
 *            Menjelaskan latar belakang inisiatif teknologi sosial inklusif untuk
 *            menjembatani kesenjangan komunikasi antara teman Tuli dan masyarakat umum.
 * Pattern:
 *   - Presentational Component Pattern: Menampilkan data statis nilai-nilai dan informasi kemitraan.
 *   - Bento Grid & Card System: Menampilkan Visi dan Misi dalam kartu berdampingan bergradasi.
 * ==============================================================================
 */

import React from 'react';
import { 
  Heart, 
  Target, 
  Eye, 
  ShieldCheck, 
  Mail, 
  Globe, 
  Sparkles, 
  Award, 
  Layers 
} from 'lucide-react';

/**
 * Komponen Section Profil & Visi-Misi Platform SETARA.
 */
export default function AboutSection() {
  /** Nilai-nilai dasar filosofi pengembangan platform SETARA */
  const values = [
    {
      title: "Inklusivitas Penuh",
      desc: "Menghilangkan sekat komunikasi tanpa membedakan latar belakang, kemampuan fisik, ataupun dialek.",
      icon: Heart
    },
    {
      title: "Keberlanjutan & Kolaborasi",
      desc: "Bekerja berdampingan secara langsung dengan teman Tuli dan komunitas linguistik isyarat nusantara.",
      icon: Target
    },
    {
      title: "Inovasi Berkelanjutan",
      desc: "Memanfaatkan teknologi AI Computer Vision mutakhir demi latensi terendah dan akurasi tertinggi.",
      icon: Sparkles
    },
    {
      title: "Aksesibilitas Terbuka",
      desc: "Platform dirancang bebas biaya dan ringan agar dapat diakses oleh masyarakat luas dari berbagai gawai.",
      icon: ShieldCheck
    }
  ];

  return (
    <section id="tentang" className="py-16 md:py-20 relative scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* ===================================================================
         * 1. SECTION HEADER — Profil & Komitmen
         * =================================================================== */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            <Target className="w-3.5 h-3.5" />
            <span>Profil & Komitmen Kami</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tentang Platform SETARA
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Inisiatif teknologi sosial untuk menjembatani komunikasi dua arah antara teman Tuli dan masyarakat dengar.
          </p>
        </div>

        {/* ===================================================================
         * 2. VISION & MISSION CARDS — Dua Pilar Utama Ekosistem SETARA
         * =================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision Card */}
          <div className="p-8 rounded-3xl glass-card border border-brand-500/30 space-y-4 shadow-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-500 flex items-center justify-center font-bold">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Visi Kami
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Mewujudkan ekosistem digital Indonesia yang ramah disabilitas, inklusif, dan bebas hambatan komunikasi di mana setiap individu memiliki kesempatan yang setara untuk belajar, berkolaborasi, dan berdaya.
            </p>
          </div>

          {/* Mission Card */}
          <div className="p-8 rounded-3xl glass-card border border-amber-500/30 space-y-4 shadow-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Misi Kami
            </h3>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed list-disc list-inside">
              <li>Menyediakan penerjemah dua arah (Teks ➔ Isyarat & Kamera ➔ Teks) yang akurat dan berkecepatan tinggi.</li>
              <li>Mendukung pelestarian dan standarisasi bahasa isyarat SIBI dan BISINDO.</li>
              <li>Membangun jembatan empati dan literasi bahasa isyarat di kalangan institusi publik, medis, dan pendidikan.</li>
            </ul>
          </div>
        </div>

        {/* ===================================================================
         * 3. CORE VALUES — 4 Nilai Pokok Platform
         * =================================================================== */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Nilai-Nilai Utama
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-3 shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-500/15 text-brand-500 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {val.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===================================================================
         * 4. CONTACT STRIP — Ajakan Kolaborasi & Kemitraan
         * =================================================================== */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-brand-950/80 via-slate-900/80 to-amber-950/80 border border-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-xl font-bold">Tertarik Berkolaborasi atau Mengajukan Masukan?</h4>
            <p className="text-xs text-slate-400">Tim pengembang SETARA terbuka untuk kemitraan institusi dan relawan.</p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="mailto:kontak@setara.id"
              className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs flex items-center gap-2 hover:bg-slate-100 transition-all"
            >
              <Mail className="w-4 h-4" />
              <span>kontak@setara.id</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
