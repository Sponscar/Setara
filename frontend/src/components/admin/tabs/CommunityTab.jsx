/**
 * ==============================================================================
 * File: CommunityTab.jsx
 * Direktori: src/components/admin/tabs/
 * Deskripsi: Tab Manajemen Jembatan Komunitas pada Dashboard Administrator.
 * Fitur:
 *   - Form penambahan komunitas baru oleh admin (dengan upload logo & validasi foto maks 2MB).
 *   - Sub-panel moderasi persetujuan & penolakan pengajuan komunitas dari publik.
 *   - Sub-panel daftar komunitas terverifikasi aktif dengan filter pencarian, tombol Edit, dan tombol Hapus.
 * Pattern: Controlled Component, Form Validation, Repository Integration.
 * ==============================================================================
 */

import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Upload, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  ExternalLink 
} from 'lucide-react';
import { getPlatformBadge } from '../../helpers/adminHelpers';

/**
 * Komponen Tab Manajemen Komunitas.
 * 
 * @param {Object} props
 * @param {Array} props.communityList - Daftar semua komunitas (pending & approved)
 * @param {Function} props.addCommunity - Aksi store menambahkan komunitas terverifikasi baru
 * @param {Function} props.approveCommunity - Aksi store menyetujui pengajuan komunitas pending
 * @param {Function} props.rejectCommunity - Aksi store menolak pengajuan komunitas pending
 * @param {Function} props.deleteCommunity - Aksi store menghapus komunitas
 * @param {Function} props.onOpenEditModal - Callback untuk membuka modal edit komunitas terverifikasi
 * @param {Function} props.showToast - Fungsi menampilkan notifikasi toast interaktif
 */
export default function CommunityTab({
  communityList = [],
  addCommunity,
  approveCommunity,
  rejectCommunity,
  deleteCommunity,
  onOpenEditModal,
  showToast
}) {
  // Referensi DOM input file logo tersembunyi
  const logoInputRef = useRef(null);

  // State pencarian komunitas terverifikasi
  const [communitySearch, setCommunitySearch] = useState('');

  // State formulir pembuatan komunitas baru oleh admin
  const [communityForm, setCommunityForm] = useState({
    nama: '',
    platform: 'WhatsApp',
    kategori: '',
    link: '',
    anggota: '',
    logo: '',
    deskripsi: '',
    deskripsiLengkap: '',
    kontak: '',
    emailKontak: ''
  });

  // State pesan error validasi upload logo foto
  const [logoError, setLogoError] = useState('');

  /**
   * Handler untuk memproses upload foto/logo dengan validasi ukuran 2 MB.
   */
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi 1: Format file gambar
    if (!file.type.startsWith('image/')) {
      setLogoError('File harus berupa format gambar/foto (JPG, PNG, WEBP, atau SVG).');
      return;
    }

    // Validasi 2: Batas ukuran maksimal 2 MB
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setLogoError('Ukuran file terlalu besar! Maksimal ukuran foto logo adalah 2 MB.');
      return;
    }

    setLogoError('');

    // Konversi file ke base64 DataURL
    const reader = new FileReader();
    reader.onload = (event) => {
      setCommunityForm((prev) => ({ ...prev, logo: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  /**
   * Handler untuk membatalkan / menghapus foto logo yang sudah diunggah
   */
  const handleRemoveLogo = () => {
    setCommunityForm((prev) => ({ ...prev, logo: '' }));
    setLogoError('');
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  /**
   * Handler submit form pembuatan komunitas baru oleh admin
   */
  const handleCreateCommunity = (e) => {
    e.preventDefault();
    if (!communityForm.nama.trim() || !communityForm.link.trim()) return;

    // Tambahkan langsung ke store komunitas dengan status approved
    addCommunity({
      ...communityForm,
      logo: communityForm.logo || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=200&q=80'
    });

    // Reset formulir
    setCommunityForm({
      nama: '',
      platform: 'WhatsApp',
      kategori: '',
      link: '',
      anggota: '',
      logo: '',
      deskripsi: '',
      deskripsiLengkap: '',
      kontak: '',
      emailKontak: ''
    });
    setLogoError('');
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }

    if (showToast) {
      showToast(`Komunitas "${communityForm.nama}" berhasil diterbitkan.`);
    }
  };

  // Filter komunitas berdasarkan status
  const pendingList = communityList.filter((c) => c.status === 'pending');
  const approvedList = communityList
    .filter((c) => c.status === 'approved')
    .filter((c) => 
      c.nama.toLowerCase().includes(communitySearch.toLowerCase()) || 
      c.platform.toLowerCase().includes(communitySearch.toLowerCase())
    );

  return (
    <div className="space-y-6">
      {/* ======================================================================= */}
      {/* 1. BANNER STATUS RINGKASAN KOMUNITAS                                   */}
      {/* ======================================================================= */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Kelola Jembatan Komunitas
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tambah komunitas secara langsung, tinjau pengajuan dari pihak luar, dan kelola komunitas aktif.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
              {pendingList.length} Pengajuan Pending
            </span>
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/25">
              {communityList.filter((c) => c.status === 'approved').length} Komunitas Aktif
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ===================================================================== */}
        {/* 2. FORMULIR TAMBAH KOMUNITAS BARU (Kiri / 5 Kolom)                   */}
        {/* ===================================================================== */}
        <div className="lg:col-span-5 p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Tambah Komunitas Baru
              </h4>
              <p className="text-[11px] text-slate-500">Langsung diterbitkan di landing page</p>
            </div>
          </div>

          <form onSubmit={handleCreateCommunity} className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
            {/* Nama Komunitas */}
            <div>
              <label className="font-semibold block mb-1">Nama Komunitas *</label>
              <input
                type="text"
                required
                value={communityForm.nama}
                onChange={(e) => setCommunityForm({ ...communityForm, nama: e.target.value })}
                placeholder="Contoh: Deaf Club Indonesia"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Grid Platform & Kategori */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">Platform *</label>
                <select
                  value={communityForm.platform}
                  onChange={(e) => setCommunityForm({ ...communityForm, platform: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 cursor-pointer"
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Telegram">Telegram</option>
                  <option value="Discord">Discord</option>
                  <option value="Website">Website</option>
                  <option value="Instagram">Instagram</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Kategori *</label>
                <input
                  type="text"
                  required
                  value={communityForm.kategori}
                  onChange={(e) => setCommunityForm({ ...communityForm, kategori: e.target.value })}
                  placeholder="Contoh: Belajar Isyarat"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Link URL */}
            <div>
              <label className="font-semibold block mb-1">Link URL *</label>
              <input
                type="url"
                required
                value={communityForm.link}
                onChange={(e) => setCommunityForm({ ...communityForm, link: e.target.value })}
                placeholder="https://chat.whatsapp.com/... atau https://..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-mono text-[11px]"
              />
            </div>

            {/* Estimasi Anggota */}
            <div>
              <label className="font-semibold block mb-1">Estimasi Anggota</label>
              <input
                type="text"
                value={communityForm.anggota}
                onChange={(e) => setCommunityForm({ ...communityForm, anggota: e.target.value })}
                placeholder="Contoh: 1.000+ Anggota"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Upload Foto / Logo Komunitas (Maksimal 2 MB) */}
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
                id="admin-community-logo-upload"
              />

              {communityForm.logo ? (
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700">
                  <img
                    src={communityForm.logo}
                    alt="Preview Logo"
                    className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-600 shadow-sm shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Foto siap diunggah</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate">Format valid (Maks. 2 MB)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                    title="Hapus foto"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="admin-community-logo-upload"
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-dark-bg border border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 transition-colors cursor-pointer group text-center"
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

            {/* Grid PIC / Kontak & Email */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">PIC / Kontak *</label>
                <input
                  type="text"
                  required
                  value={communityForm.kontak}
                  onChange={(e) => setCommunityForm({ ...communityForm, kontak: e.target.value })}
                  placeholder="Nama koordinator"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Email PIC</label>
                <input
                  type="email"
                  value={communityForm.emailKontak}
                  onChange={(e) => setCommunityForm({ ...communityForm, emailKontak: e.target.value })}
                  placeholder="email@komunitas.id"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Deskripsi Singkat */}
            <div>
              <label className="font-semibold block mb-1">Deskripsi Singkat *</label>
              <textarea
                rows="2"
                required
                value={communityForm.deskripsi}
                onChange={(e) => setCommunityForm({ ...communityForm, deskripsi: e.target.value })}
                placeholder="Penjelasan ringkas komunitas..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Deskripsi Lengkap */}
            <div>
              <label className="font-semibold block mb-1">Deskripsi Lengkap (Opsional)</label>
              <textarea
                rows="2"
                value={communityForm.deskripsiLengkap}
                onChange={(e) => setCommunityForm({ ...communityForm, deskripsiLengkap: e.target.value })}
                placeholder="Detail profil, visi, dan kegiatan..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Tombol Publikasi */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-brand-600/20 hover:scale-[1.02] active:scale-98 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Publikasikan Komunitas</span>
            </button>
          </form>
        </div>

        {/* ===================================================================== */}
        {/* 3. DAFTAR PENGAJUAN PENDING & KOMUNITAS TERVERIFIKASI (Kanan / 7 Kolom) */}
        {/* ===================================================================== */}
        <div className="lg:col-span-7 space-y-6">
          {/* Sub-panel Moderasi: Pengajuan Masuk (Pending) */}
          <div className="p-6 rounded-3xl glass-card border border-amber-500/30 bg-amber-500/5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span>Pengajuan Komunitas Masuk ({pendingList.length})</span>
              </h4>
              <span className="text-[11px] text-amber-500 font-semibold">Menunggu Review</span>
            </div>

            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {pendingList.length > 0 ? (
                pendingList.map((c) => (
                  <div 
                    key={c.id} 
                    className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-amber-500/20 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs shadow-sm"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{c.nama}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPlatformBadge(c.platform).bg}`}>
                          {c.platform}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">({c.kategori})</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 line-clamp-2">{c.deskripsi}</p>
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                        <span>PIC: <strong className="text-slate-700 dark:text-slate-200">{c.kontak}</strong></span>
                        {c.emailKontak && <span>Email: {c.emailKontak}</span>}
                        <a
                          href={c.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-500 hover:underline inline-flex items-center gap-0.5"
                        >
                          <span>Link Tautan</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Tombol Aksi Moderasi: Setujui / Tolak */}
                    <div className="flex sm:flex-col items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          approveCommunity(c.id);
                          if (showToast) showToast(`Komunitas "${c.nama}" telah disetujui dan aktif.`);
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1 cursor-pointer text-xs transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Setujui</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          rejectCommunity(c.id);
                          if (showToast) showToast(`Pengajuan "${c.nama}" ditolak.`);
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-500 font-bold flex items-center justify-center gap-1 cursor-pointer text-xs transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Tolak</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-slate-400">
                  Tidak ada pengajuan komunitas baru yang menunggu persetujuan.
                </div>
              )}
            </div>
          </div>

          {/* Sub-panel: Daftar Komunitas Terverifikasi (Approved) */}
          <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-dark-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Komunitas Terverifikasi ({communityList.filter((c) => c.status === 'approved').length})
              </h4>
              <div className="relative w-full sm:w-48">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={communitySearch}
                  onChange={(e) => setCommunitySearch(e.target.value)}
                  placeholder="Cari komunitas..."
                  className="w-full pl-8 pr-3 py-1 text-xs rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {approvedList.length > 0 ? (
                approvedList.map((c) => (
                  <div 
                    key={c.id} 
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={c.logo}
                        alt={c.nama}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=200&q=80';
                        }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-white truncate">{c.nama}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPlatformBadge(c.platform).bg}`}>
                            {c.platform}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-0.5 flex-wrap">
                          <span>{c.kategori}</span>
                          <span>•</span>
                          <span>{c.anggota}</span>
                          <span>•</span>
                          <a
                            href={c.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-500 hover:underline inline-flex items-center gap-0.5"
                          >
                            <span>Buka Link</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Tombol Edit & Hapus Komunitas */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onOpenEditModal(c)}
                        className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 cursor-pointer transition-colors"
                        title="Edit Komunitas"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          deleteCommunity(c.id);
                          if (showToast) showToast(`Komunitas "${c.nama}" berhasil dihapus.`);
                        }}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 cursor-pointer shrink-0 transition-colors"
                        title="Hapus Komunitas"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  {communitySearch ? 'Tidak ada komunitas yang cocok dengan pencarian.' : 'Belum ada komunitas terverifikasi.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
