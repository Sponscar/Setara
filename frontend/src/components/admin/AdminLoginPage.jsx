import React, { useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useThemeStore } from '../../stores/useThemeStore';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowLeft,
  LogIn,
  AlertCircle,
  Sparkles,
  Lock,
  Mail,
  Sun,
  Moon
} from 'lucide-react';

export default function AdminLoginPage({ onBackToHome, onLoginSuccess }) {
  const { login } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Silakan isi email dan kata sandi.');
      return;
    }

    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);

      if (result.success) {
        onLoginSuccess();
      } else {
        setError(result.error);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg flex flex-col items-center justify-center px-4 relative overflow-hidden bg-grid-pattern transition-colors duration-300">
      {/* Decorative Background Blurs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Back to Home */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200 dark:border-slate-700 hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-500/30 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200 dark:border-slate-700 hover:bg-brand-500/10 hover:border-brand-500/30 text-slate-700 dark:text-slate-200 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
          title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md animate-page-enter">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-brand-600 to-amber-600 text-white shadow-xl shadow-brand-600/25 mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Admin <span className="gradient-text-primary">SETARA</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Masuk ke Dashboard Administrator untuk mengelola konten platform
          </p>
        </div>

        {/* Form Card */}
        <div className="p-8 rounded-3xl glass-card border border-slate-200 dark:border-dark-border shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Alert */}
            {error && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 text-xs font-medium animate-page-enter">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="admin-email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Administrator
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="admin@setara.id"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all duration-300"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="admin-password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-10 pr-12 py-3 rounded-2xl text-sm bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all duration-300"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-500 hover:to-amber-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-600/25 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Masuk ke Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Hint */}
          <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-700/60">
            <div className="flex items-start gap-2 text-xs text-slate-400 dark:text-slate-500">
              <Sparkles className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-amber-500/60" />
              <p>
                <strong className="text-slate-500 dark:text-slate-400">Demo:</strong> Gunakan email yang mengandung kata "admin" (contoh: <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 font-mono text-[11px]">admin@setara.id</code>) dan kata sandi <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 font-mono text-[11px]">setara2026</code>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
          © 2026 SETARA · Hanya administrator yang memiliki akses ke halaman ini
        </p>
      </div>
    </div>
  );
}
