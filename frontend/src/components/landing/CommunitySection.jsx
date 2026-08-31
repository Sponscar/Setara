import React, { useState } from 'react';
import { 
  INITIAL_COMMUNITY_ACTIVITIES, 
  INITIAL_TESTIMONIALS 
} from '../../services/mockData';
import { 
  Users, 
  Calendar, 
  MapPin, 
  Sparkles, 
  Check, 
  Heart, 
  UserPlus, 
  Send,
  X,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CommunitySection() {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    peran: 'Masyarakat Umum',
    alasan: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitJoin = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.email) return;

    setSubmitted(true);
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    setTimeout(() => {
      setShowJoinModal(false);
      setSubmitted(false);
      setFormData({ nama: '', email: '', peran: 'Masyarakat Umum', alasan: '' });
    }, 2000);
  };

  return (
    <section id="komunitas" className="py-16 md:py-20 relative scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Users className="w-3.5 h-3.5" />
            <span>Ruang Bertumbuh Bersama</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Komunitas & Aktivitas Inklusif
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Bergabunglah bersama ribuan relawan, teman Tuli, dan tenaga pendidik untuk menyuarakan kesetaraan.
          </p>
        </div>

        {/* Community Activities Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Agenda & Kegiatan Mendatang
            </h3>
            <button
              onClick={() => setShowJoinModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-500 hover:to-amber-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Gabung Komunitas</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INITIAL_COMMUNITY_ACTIVITIES.map((act) => (
              <div
                key={act.id}
                className="rounded-3xl glass-card border border-slate-200 dark:border-dark-border overflow-hidden hover:border-amber-500/50 hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="aspect-[16/10] w-full overflow-hidden relative">
                  <img
                    src={act.gambar}
                    alt={act.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-900/80 text-amber-400 backdrop-blur-md border border-amber-500/30">
                    {act.tipe}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                      {act.judul}
                    </h4>
                    <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-brand-500" />
                        <span>{act.tanggal}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        <span>{act.lokasi}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-semibold text-brand-600 dark:text-brand-400">
                      {act.peserta}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500 font-bold border border-amber-500/20">
                      {act.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Testimonials */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Cerita & Suara Anggota
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pengalaman nyata menggunakan platform SETARA dalam kehidupan sehari-hari.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INITIAL_TESTIMONIALS.map((testi) => (
              <div
                key={testi.id}
                className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4 shadow-lg flex flex-col justify-between"
              >
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "{testi.komentar}"
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <img
                    src={testi.avatar}
                    alt={testi.nama}
                    className="w-10 h-10 rounded-full object-cover border border-brand-500"
                  />
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                      {testi.nama}
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      {testi.peran}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Join Community Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 sm:p-8 shadow-2xl space-y-5">
              <button
                onClick={() => setShowJoinModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {submitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-500 mx-auto flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    Pendaftaran Berhasil Dikirim!
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Terima kasih telah bergabung. Tim moderator kami akan menghubungi Anda via email segera.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitJoin} className="space-y-4">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400">
                      Formulir Anggota
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Gabung Komunitas SETARA
                    </h3>
                    <p className="text-xs text-slate-400">
                      Mari bersama memperluas ruang inklusivitas bahasa isyarat di Indonesia.
                    </p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.nama}
                        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                        placeholder="Contoh: Sarah Anindita"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Alamat Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="nama@email.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Latar Belakang / Peran
                      </label>
                      <select
                        value={formData.peran}
                        onChange={(e) => setFormData({ ...formData, peran: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="Masyarakat Umum">Masyarakat Umum / Peminat Isyarat</option>
                        <option value="Teman Tuli / Tunawicara">Teman Tuli / Tunawicara</option>
                        <option value="Guru / Tenaga Pendidik SLB">Guru / Tenaga Pendidik SLB</option>
                        <option value="Tenaga Medis / Kesehatan">Tenaga Medis / Kesehatan</option>
                        <option value="Relawan Inklusivitas">Relawan Inklusivitas</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Alasan Bergabung (Opsional)
                      </label>
                      <textarea
                        rows="2"
                        value={formData.alasan}
                        onChange={(e) => setFormData({ ...formData, alasan: e.target.value })}
                        placeholder="Ceritakan motivasi Anda..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Pendaftaran</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
