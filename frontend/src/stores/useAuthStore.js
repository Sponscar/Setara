import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: typeof window !== 'undefined' && localStorage.getItem('setara_user')
    ? JSON.parse(localStorage.getItem('setara_user'))
    : null,
  token: typeof window !== 'undefined' ? localStorage.getItem('setara_token') : null,
  isAuthenticated: typeof window !== 'undefined' && !!localStorage.getItem('setara_token'),

  login: (email, password) => {
    // Mock login: require password "setara2026" for any account
    if (password !== 'setara2026') {
      return { success: false, error: 'Email atau kata sandi salah.' };
    }

    const isAdmin = email.toLowerCase().includes('admin');
    if (!isAdmin) {
      return { success: false, error: 'Akun ini tidak memiliki akses administrator.' };
    }

    const userData = {
      id: `usr-${Date.now()}`,
      nama: 'Administrator SETARA',
      email: email,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    };
    const mockToken = `jwt-token-${Date.now()}`;

    if (typeof window !== 'undefined') {
      localStorage.setItem('setara_user', JSON.stringify(userData));
      localStorage.setItem('setara_token', mockToken);
    }

    set({ user: userData, token: mockToken, isAuthenticated: true });
    return { success: true, user: userData };
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('setara_user');
      localStorage.removeItem('setara_token');
    }
    set({ user: null, token: null, isAuthenticated: false });
  }
}));
