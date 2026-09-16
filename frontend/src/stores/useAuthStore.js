/**
 * ==============================================================================
 * File: useAuthStore.js
 * Direktori: src/stores/
 * Deskripsi: Global Authentication State Management untuk sesi Administrator SETARA.
 * Pattern:
 *   - Flux / Store Pattern (via Zustand): Mengelola status autentikasi global.
 *   - Protected Route Guard Data: Menyediakan state `isAuthenticated` untuk gating rute /admin di App.jsx.
 *   - Local Storage Session Persistence: Menyimpan token JWT mock dan data user.
 * ==============================================================================
 */

import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  // ============================================================================
  // 1. STATE AUTENTIKASI
  // ============================================================================
  /** Data profil user yang sedang login (null jika belum login) */
  user: typeof window !== 'undefined' && localStorage.getItem('setara_user')
    ? JSON.parse(localStorage.getItem('setara_user'))
    : null,

  /** Token sesi autentikasi mock (JWT) */
  token: typeof window !== 'undefined' ? localStorage.getItem('setara_token') : null,

  /** Flag boolean penanda apakah sesi login aktif dan terverifikasi */
  isAuthenticated: typeof window !== 'undefined' && !!localStorage.getItem('setara_token'),

  // ============================================================================
  // 2. AKSI AUTENTIKASI (LOGIN & LOGOUT)
  // ============================================================================
  /**
   * Memproses login administrator demo.
   * Aturan verifikasi demo:
   *   - Password harus 'setara2026'
   *   - Email harus mengandung kata 'admin' (contoh: admin@setara.id)
   * 
   * @param {string} email
   * @param {string} password
   * @returns {{ success: boolean, error?: string, user?: Object }}
   */
  login: (email, password) => {
    // Validasi kata sandi demo
    if (password !== 'setara2026') {
      return { success: false, error: 'Email atau kata sandi salah.' };
    }

    // Validasi role admin berdasarkan format email
    const isAdmin = email.toLowerCase().includes('admin');
    if (!isAdmin) {
      return { success: false, error: 'Akun ini tidak memiliki akses administrator.' };
    }

    // Buat objek profil pengguna dan mock token
    const userData = {
      id: `usr-${Date.now()}`,
      nama: 'Administrator SETARA',
      email: email,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    };
    const mockToken = `jwt-token-${Date.now()}`;

    // Simpan ke localStorage untuk persistensi sesi
    if (typeof window !== 'undefined') {
      localStorage.setItem('setara_user', JSON.stringify(userData));
      localStorage.setItem('setara_token', mockToken);
    }

    set({ user: userData, token: mockToken, isAuthenticated: true });
    return { success: true, user: userData };
  },

  /**
   * Mengakhiri sesi login pengguna dan menghapus data sesi dari localStorage.
   */
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('setara_user');
      localStorage.removeItem('setara_token');
    }
    set({ user: null, token: null, isAuthenticated: false });
  }
}));
