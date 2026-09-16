/**
 * ==============================================================================
 * File: useThemeStore.js
 * Direktori: src/stores/
 * Deskripsi: Global Theme State Management untuk platform SETARA (Light & Dark Mode).
 * Pattern:
 *   - Flux / Store Pattern (via Zustand): Pengaturan tema terpusat.
 *   - DOM Synchronization: Mengatur kelas CSS `.dark` pada `<html>` documentElement
 *     secara sinkron dengan Tailwind CSS dark mode selector (`darkMode: 'class'`).
 *   - Local Storage Persistence: Menyimpan preferensi tema pengguna antar sesi browser.
 * ==============================================================================
 */

import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  // ============================================================================
  // 1. STATE TEMA
  // ============================================================================
  /**
   * Tema aktif: 'dark' (bawaan) atau 'light'.
   * Diinisialisasi dari localStorage browser jika ada preferensi tersimpan.
   */
  theme: typeof window !== 'undefined' && localStorage.getItem('setara_theme')
    ? localStorage.getItem('setara_theme')
    : 'dark', // Default tema gelap untuk tampilan modern & kontras tinggi

  // ============================================================================
  // 2. AKSI TOGGLE & SET TEMA
  // ============================================================================
  /**
   * Mengganti tema secara bergantian (light <-> dark).
   * Otomatis mengupdate class `.dark` pada elemen HTML root dan localStorage.
   */
  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    if (typeof window !== 'undefined') {
      localStorage.setItem('setara_theme', nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    return { theme: nextTheme };
  }),

  /**
   * Menetapkan tema secara spesifik ('dark' atau 'light').
   * @param {'dark' | 'light'} theme
   */
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('setara_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    set({ theme });
  }
}));
