/**
 * ==============================================================================
 * File: useAuthStore.js
 * Direktori: src/stores/
 * Deskripsi: Global Authentication State Management platform SETARA.
 * Integrasi:
 *   - Terhubung langsung ke Django Ninja API (/api/auth/*)
 *   - Mengelola JWT Access Token & Refresh Token
 *   - Auto-restore sesi user saat browser dimuat ulang
 * ==============================================================================
 */

import { create } from 'zustand';
import { api, tokenStorage } from '../services/api';

export const useAuthStore = create((set, get) => {
  // Setup listener for unauthorized events (session expiry)
  if (typeof window !== 'undefined') {
    window.addEventListener('auth:unauthorized', () => {
      get().logout();
    });
  }

  return {
    // ============================================================================
    // 1. STATE AUTENTIKASI
    // ============================================================================
    user: tokenStorage.getUser(),
    token: tokenStorage.getAccessToken(),
    isAuthenticated: !!tokenStorage.getAccessToken(),
    isLoading: false,
    error: null,

    // ============================================================================
    // 2. AKSI AUTENTIKASI
    // ============================================================================

    /**
     * Memproses login menggunakan endpoint Django Ninja /api/auth/login.
     * @param {string} email
     * @param {string} password
     * @returns {Promise<{ success: boolean, error?: string, user?: Object }>}
     */
    login: async (email, password) => {
      set({ isLoading: true, error: null });
      try {
        const data = await api.post('/auth/login', { email, password });
        const user = data.user || {
          email,
          role: 'admin',
          full_name: 'Administrator SETARA'
        };

        tokenStorage.setSession(data.access_token, data.refresh_token, user);
        set({
          user,
          token: data.access_token,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        return { success: true, user };
      } catch (err) {
        const errorMsg = err.message || 'Email atau kata sandi tidak valid.';
        set({ isLoading: false, error: errorMsg });
        return { success: false, error: errorMsg };
      }
    },

    /**
     * Mengakhiri sesi login pengguna dan menghapus data sesi.
     */
    logout: () => {
      tokenStorage.clearSession();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    },

    /**
     * Memvalidasi token aktif dan memperbarui profil pengguna dari backend /api/auth/me.
     */
    checkAuth: async () => {
      const token = tokenStorage.getAccessToken();
      if (!token) {
        set({ user: null, isAuthenticated: false });
        return null;
      }

      try {
        const userProfile = await api.get('/auth/me');
        tokenStorage.setSession(token, tokenStorage.getRefreshToken(), userProfile);
        set({ user: userProfile, isAuthenticated: true });
        return userProfile;
      } catch (err) {
        // Jika token tidak valid / kedaluwarsa
        get().logout();
        return null;
      }
    },

    /**
     * Membersihkan pesan error
     */
    clearError: () => set({ error: null })
  };
});