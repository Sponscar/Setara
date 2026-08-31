import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: typeof window !== 'undefined' && localStorage.getItem('setara_theme')
    ? localStorage.getItem('setara_theme')
    : 'dark', // default dark mode for sleek modern feel

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
