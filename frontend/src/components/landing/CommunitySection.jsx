import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useContentStore } from '../../stores/useContentStore';
import { 
  Users, 
  Sparkles, 
  Check, 
  Heart, 
  ExternalLink, 
  ArrowUpRight,
  Send,
  X,
  MessageSquare,
  Globe,
  MessageCircle,
  Share2,
  Building2,
  Mail,
  User,
  PlusCircle,
  Info,
  ShieldCheck,
  CheckCircle2,
  Search,
  Filter,
  Upload,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Helper for platform badge styling & icons
const getPlatformMeta = (platform = '') => {
  switch (platform.toLowerCase()) {
    case 'whatsapp':
      return {
        label: 'WhatsApp Group',
        icon: MessageCircle,
        badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
        btnClass: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
      };
    case 'telegram':
      return {
        label: 'Telegram Channel',
        icon: Send,
        badgeClass: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/25',
        btnClass: 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/20'
      };
    case 'discord':
      return {
        label: 'Discord Server',
        icon: MessageSquare,
        badgeClass: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/25',
        btnClass: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
      };
    case 'instagram':
      return {
        label: 'Instagram',
        icon: Share2,
        badgeClass: 'bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/25',
        btnClass: 'bg-pink-600 hover:bg-pink-500 text-white shadow-pink-600/20'
      };
    case 'website':
    default:
      return {
        label: 'Website Resmi',
        icon: Globe,
        badgeClass: 'bg-brand-500/15 text-brand-600 dark:text-brand-400 border-brand-500/25',
        btnClass: 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/20'
      };
  }
};

export default function CommunitySection() {
  const { communityList, submitCommunity, testimonialList, addTestimonial } = useContentStore();

  // Filter & Search State
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);

  // Form State: Ajukan Komunitas
  const [submitForm, setSubmitForm] = useState({
    nama: '',
    kategori: 'Komunitas Tuli',
    platform: 'WhatsApp',
    link: '',
    logo: '',
    anggota: '100+ Anggota',
    kontak: '',
    emailKontak: '',
    deskripsi: '',
    deskripsiLengkap: ''
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form State: Tulis Testimoni
  const [testiForm, setTestiForm] = useState({
    nama: '',
    peran: '',
    avatar: '',
    komentar: ''
  });
  const [testiSuccess, setTestiSuccess] = useState(false);

  // Refs for modal auto-focus & file upload
  const submitNameRef = useRef(null);
  const testiNameRef = useRef(null);
  const logoInputRef = useRef(null);
  const [logoError, setLogoError] = useState('');

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setLogoError('Format file harus berupa foto/gambar (JPG, PNG, WEBP, dll).');
      return;
    }

    const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
    if (file.size > MAX_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setLogoError(`Ukuran foto ${sizeMB} MB melebihi batas maksimal 2 MB.`);
      if (logoInputRef.current) logoInputRef.current.value = '';
      return;
    }

    setLogoError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setSubmitForm((prev) => ({ ...prev, logo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setSubmitForm((prev) => ({ ...prev, logo: '' }));
    setLogoError('');
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  // Only approved communities are displayed on landing page
  const approvedCommunities = (communityList || []).filter(c => c.status === 'approved');

  // Categories for filtering
  const categories = ['Semua', ...new Set(approvedCommunities.map(c => c.kategori).filter(Boolean))];

  const filteredCommunities = approvedCommunities.filter((com) => {
    const matchCat = selectedCategory === 'Semua' || com.kategori === selectedCategory;
    const matchSearch = com.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      com.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      com.platform?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Lock scroll when any modal is open
  const isAnyModalOpen = selectedCommunity || showSubmitModal || showTestimonialModal;
  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAnyModalOpen]);

  // Handle ESC key to close active modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedCommunity(null);
        setShowSubmitModal(false);
        setShowTestimonialModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Submit Handler: Ajukan Komunitas
  const handleSubmitCommunity = (e) => {
    e.preventDefault();
    if (!submitForm.nama || !submitForm.link || !submitForm.kontak || !submitForm.emailKontak) {
      return;
    }

    const payload = {
      ...submitForm,
      logo: submitForm.logo || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=200&q=80',
      deskripsiLengkap: submitForm.deskripsiLengkap || submitForm.deskripsi
    };

    submitCommunity(payload);
    setSubmitSuccess(true);
    try {
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
    } catch (err) {}

    setTimeout(() => {
      setSubmitSuccess(false);
      setShowSubmitModal(false);
      setLogoError('');
      if (logoInputRef.current) logoInputRef.current.value = '';
      setSubmitForm({
        nama: '',
        kategori: 'Komunitas Tuli',
        platform: 'WhatsApp',
        link: '',
        logo: '',
        anggota: '100+ Anggota',
        kontak: '',
        emailKontak: '',
        deskripsi: '',
        deskripsiLengkap: ''
      });
    }, 2200);
  };

  // Submit Handler: Testimonial
  const handleSubmitTestimonial = (e) => {
    e.preventDefault();
    if (!testiForm.nama || !testiForm.komentar) return;

    addTestimonial(testiForm);
    setTestiSuccess(true);
    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch (err) {}

    setTimeout(() => {
      setTestiSuccess(false);
      setShowTestimonialModal(false);
      setTestiForm({ nama: '', peran: '', avatar: '', komentar: '' });
    }, 2000);
  };

  return (
    <section id="komunitas" className="py-20 md:py-28 relative scroll-mt-28">
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-brand-500/5 via-amber-500/5 to-purple-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* BAGIAN A: GRID KARTU KOMUNITAS (SETARA SEBAGAI JEMBATAN) */}
        {/* ========================================================================= */}
        <div className="space-y-10 mb-24">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                <Users className="w-3.5 h-3.5" />
                <span>Jembatan Inklusivitas</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Temukan & Terhubung dengan Komunitas Isyarat
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                SETARA menjembatani Anda dengan berbagai komunitas Tuli, grup belajar bahasa isyarat, dan forum inklusi di WhatsApp, Telegram, Discord, hingga website resmi di seluruh penjuru Indonesia.
              </p>
            </div>

            {/* CTA Button: Ajukan Komunitas */}
            <div className="flex-shrink-0">
              <button
                onClick={() => setShowSubmitModal(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-brand-500/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Ajukan Komunitas Anda</span>
              </button>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-2xl glass-card border border-slate-200 dark:border-dark-border">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari komunitas..."
                className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700/60 focus:outline-none focus:border-brand-500 text-slate-800 dark:text-white placeholder-slate-400"
              />
            </div>
          </div>

          {/* Communities Grid */}
          {filteredCommunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities.map((com) => {
                const meta = getPlatformMeta(com.platform);
                const PlatformIcon = meta.icon;

                return (
                  <div
                    key={com.id}
                    onClick={() => setSelectedCommunity(com)}
                    className="group relative p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border hover:border-brand-500/40 dark:hover:border-brand-500/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
                  >
                    <div className="space-y-4">
                      {/* Card Header: Logo, Category & Platform */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="relative">
                          <img
                            src={com.logo}
                            alt={com.nama}
                            className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-md group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=200&q=80';
                            }}
                          />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center text-[10px] shadow">
                            <ShieldCheck className="w-3 h-3" />
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${meta.badgeClass}`}>
                            <PlatformIcon className="w-3 h-3" />
                            <span>{com.platform || 'Komunitas'}</span>
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">
                            {com.kategori}
                          </span>
                        </div>
                      </div>

                      {/* Community Name & Short Description */}
                      <div className="space-y-1.5">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
                          {com.nama}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {com.deskripsi}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer: Members & Action Indicator */}
                    <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                        <Users className="w-3.5 h-3.5 text-brand-500" />
                        <span>{com.anggota || 'Komunitas Aktif'}</span>
                      </div>

                      <div className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 font-bold group-hover:translate-x-1 transition-transform">
                        <span>Lihat Detail</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 p-8 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-3">
              <Users className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Tidak ada komunitas yang cocok
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Coba gunakan kata kunci pencarian lain atau pilih kategori "Semua" untuk melihat seluruh komunitas yang tersedia.
              </p>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* BAGIAN B: TESTIMONIALS (CERITA & SUARA PENGGUNA) */}
        {/* ========================================================================= */}
        <div className="pt-12 border-t border-slate-200 dark:border-dark-border/60">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Heart className="w-3.5 h-3.5 fill-amber-500/30" />
                <span>Cerita & Suara Pengguna</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Pengalaman Nyata Menggunakan SETARA
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Cerita dari teman Tuli, tenaga medis, dan relawan yang merasakan manfaat keterbukaan komunikasi dan bahasa isyarat.
              </p>
            </div>

            {/* CTA Button: Tulis Ceritamu */}
            <button
              onClick={() => setShowTestimonialModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white dark:bg-dark-card hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs border border-slate-200 dark:border-dark-border shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <MessageSquare className="w-4 h-4 text-brand-500" />
              <span>Tulis Ceritamu</span>
            </button>
          </div>

          {/* Testimonial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(testimonialList || []).map((testi) => (
              <div
                key={testi.id}
                className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition-all hover:shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Sparkles key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                    "{testi.komentar}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <img
                    src={testi.avatar}
                    alt={testi.nama}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
                    }}
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {testi.nama}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {testi.peran}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: DETAIL KOMUNITAS (Pop-up saat Card diklik) */}
      {/* ========================================================================= */}
      {selectedCommunity && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedCommunity(null)}
        >
          <div
            className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-2xl relative animate-scale-up space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedCommunity(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header: Logo, Name & Badge */}
            <div className="flex items-start gap-4 pr-8">
              <img
                src={selectedCommunity.logo}
                alt={selectedCommunity.nama}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-md flex-shrink-0"
              />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                    {selectedCommunity.kategori}
                  </span>
                  {(() => {
                    const meta = getPlatformMeta(selectedCommunity.platform);
                    const PlatformIcon = meta.icon;
                    return (
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${meta.badgeClass}`}>
                        <PlatformIcon className="w-3 h-3" />
                        <span>{selectedCommunity.platform}</span>
                      </span>
                    );
                  })()}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedCommunity.nama}
                </h3>
              </div>
            </div>

            {/* Description Body */}
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {selectedCommunity.deskripsi}
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                {selectedCommunity.deskripsiLengkap || selectedCommunity.deskripsi}
              </p>
            </div>

            {/* Details Meta Grid */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 block mb-0.5">Estimasi Anggota</span>
                <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-brand-500" />
                  {selectedCommunity.anggota || '-'}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block mb-0.5">Penanggung Jawab (PIC)</span>
                <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-500" />
                  {selectedCommunity.kontak || 'Pengurus Komunitas'}
                </span>
              </div>
              {selectedCommunity.emailKontak && (
                <div className="col-span-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-0.5">Email Kontak</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {selectedCommunity.emailKontak}
                  </span>
                </div>
              )}
            </div>

            {/* Actions: Kunjungi Komunitas Button */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedCommunity(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
              >
                Tutup
              </button>

              <a
                href={selectedCommunity.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                  getPlatformMeta(selectedCommunity.platform).btnClass
                }`}
              >
                <span>Kunjungi Komunitas</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: AJUKAN KOMUNITAS BARU (Pihak Luar Mengajukan ke Admin) */}
      {/* ========================================================================= */}
      {showSubmitModal && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in"
          onClick={() => !submitSuccess && setShowSubmitModal(false)}
        >
          <div
            className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-2xl relative animate-scale-up space-y-5 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            {!submitSuccess && (
              <button
                onClick={() => setShowSubmitModal(false)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {submitSuccess ? (
              <div className="text-center py-10 space-y-4 animate-scale-up">
                <div className="w-16 h-16 rounded-3xl bg-brand-500/20 text-brand-500 flex items-center justify-center mx-auto shadow-lg shadow-brand-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Pengajuan Berhasil Terkirim!
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Terima kasih telah berkontribusi. Komunitas <strong>{submitForm.nama}</strong> akan ditinjau oleh Admin SETARA sebelum ditampilkan di portal.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-1 pr-6">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                    <Building2 className="w-3 h-3" />
                    <span>Kolaborasi Komunitas</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Ajukan Komunitas Anda ke SETARA
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Isi informasi komunitas Anda untuk kami tampilkan sebagai jembatan inklusi bagi para pengguna platform.
                  </p>
                </div>

                <form onSubmit={handleSubmitCommunity} className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
                  <div>
                    <label className="font-semibold block mb-1">Nama Komunitas *</label>
                    <input
                      type="text"
                      required
                      value={submitForm.nama}
                      onChange={(e) => setSubmitForm({ ...submitForm, nama: e.target.value })}
                      placeholder="Contoh: Sahabat Tuli Surabaya"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">Platform *</label>
                      <select
                        value={submitForm.platform}
                        onChange={(e) => setSubmitForm({ ...submitForm, platform: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 cursor-pointer"
                      >
                        <option value="WhatsApp">WhatsApp Group</option>
                        <option value="Telegram">Telegram Channel</option>
                        <option value="Discord">Discord Server</option>
                        <option value="Website">Website Resmi</option>
                        <option value="Instagram">Instagram</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold block mb-1">Kategori *</label>
                      <input
                        type="text"
                        required
                        value={submitForm.kategori}
                        onChange={(e) => setSubmitForm({ ...submitForm, kategori: e.target.value })}
                        placeholder="Contoh: Belajar Isyarat"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Tautan / Link Grup atau Website *</label>
                    <input
                      type="url"
                      required
                      value={submitForm.link}
                      onChange={(e) => setSubmitForm({ ...submitForm, link: e.target.value })}
                      placeholder="https://chat.whatsapp.com/... atau https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Estimasi Anggota</label>
                    <input
                      type="text"
                      value={submitForm.anggota}
                      onChange={(e) => setSubmitForm({ ...submitForm, anggota: e.target.value })}
                      placeholder="Contoh: 350+ Anggota"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">
                      Upload Foto / Logo Komunitas (Maks. 2 MB)
                    </label>
                    <input
                      type="file"
                      ref={logoInputRef}
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="community-logo-upload"
                    />

                    {submitForm.logo ? (
                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700">
                        <img
                          src={submitForm.logo}
                          alt="Preview Logo"
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-600 shadow-sm shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">Foto berhasil dipilih</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block truncate">Format valid (Maks. 2 MB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="community-logo-upload"
                        className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 transition-colors cursor-pointer group text-center"
                      >
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 group-hover:text-brand-500 transition-colors">
                          <Upload className="w-4 h-4" />
                          <span className="font-semibold text-[11px]">Pilih File Foto / Logo</span>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-0.5">Format: JPG, PNG, WEBP, SVG (Maksimal 2 MB)</span>
                      </label>
                    )}

                    {logoError && (
                      <p className="text-[11px] text-rose-500 font-semibold flex items-center gap-1 mt-1.5 animate-fade-in">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{logoError}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">Nama PIC / Kontak *</label>
                      <input
                        type="text"
                        required
                        value={submitForm.kontak}
                        onChange={(e) => setSubmitForm({ ...submitForm, kontak: e.target.value })}
                        placeholder="Nama koordinator"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div>
                      <label className="font-semibold block mb-1">Email PIC *</label>
                      <input
                        type="email"
                        required
                        value={submitForm.emailKontak}
                        onChange={(e) => setSubmitForm({ ...submitForm, emailKontak: e.target.value })}
                        placeholder="email@komunitas.id"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Deskripsi Singkat *</label>
                    <textarea
                      rows="2"
                      required
                      value={submitForm.deskripsi}
                      onChange={(e) => setSubmitForm({ ...submitForm, deskripsi: e.target.value })}
                      placeholder="Ringkasan tentang kegiatan atau tujuan komunitas..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-brand-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Pengajuan ke Admin</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: TULIS CERITAMU (Testimonial Form) */}
      {/* ========================================================================= */}
      {showTestimonialModal && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in"
          onClick={() => !testiSuccess && setShowTestimonialModal(false)}
        >
          <div
            className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-2xl relative animate-scale-up space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {!testiSuccess && (
              <button
                onClick={() => setShowTestimonialModal(false)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {testiSuccess ? (
              <div className="text-center py-8 space-y-3 animate-scale-up">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
                  <Heart className="w-7 h-7 fill-amber-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Cerita Anda Telah Ditambahkan!
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Terima kasih telah berbagi pengalaman bersama SETARA.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-1 pr-6">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <MessageSquare className="w-3 h-3" />
                    <span>Bagikan Pengalaman</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Tulis Cerita & Suaramu
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ceritakan bagaimana SETARA membantu komunikasi atau proses belajarmu.
                  </p>
                </div>

                <form onSubmit={handleSubmitTestimonial} className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
                  <div>
                    <label className="font-semibold block mb-1">Nama Lengkap *</label>
                    <input
                      type="text"
                      required
                      value={testiForm.nama}
                      onChange={(e) => setTestiForm({ ...testiForm, nama: e.target.value })}
                      placeholder="Contoh: Siti Aisyah"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Peran / Latar Belakang *</label>
                    <input
                      type="text"
                      required
                      value={testiForm.peran}
                      onChange={(e) => setTestiForm({ ...testiForm, peran: e.target.value })}
                      placeholder="Contoh: Teman Tuli & Desainer Grafis / Mahasiswa"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">URL Avatar / Foto (Opsional)</label>
                    <input
                      type="url"
                      value={testiForm.avatar}
                      onChange={(e) => setTestiForm({ ...testiForm, avatar: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Cerita / Kesan *</label>
                    <textarea
                      rows="3"
                      required
                      value={testiForm.komentar}
                      onChange={(e) => setTestiForm({ ...testiForm, komentar: e.target.value })}
                      placeholder="Tuliskan pengalaman Anda menggunakan SETARA..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-brand-500 hover:from-amber-400 hover:to-brand-400 text-white font-bold text-xs shadow-lg shadow-amber-500/20 hover:shadow-xl hover:scale-[1.02] active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Terbitkan Ceritaku</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
