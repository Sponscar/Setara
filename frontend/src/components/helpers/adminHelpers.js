/**
 * ==============================================================================
 * File: adminHelpers.js
 * Direktori: src/components/utils/
 * Deskripsi: Helper utility untuk styling badge platform media sosial dan komunitas
 *            pada modul Admin Dashboard.
 * ==============================================================================
 */

/**
 * Mengembalikan styling badge Tailwind CSS berdasarkan nama platform komunitas.
 * 
 * @param {string} platform - Nama platform (misal: WhatsApp, Telegram, Discord, Instagram, Website)
 * @returns {{ label: string, bg: string }} Objek berisi label tampilan dan kelas warna Tailwind
 */
export const getPlatformBadge = (platform = '') => {
  switch (platform.toLowerCase()) {
    case 'whatsapp':
      return { 
        label: 'WhatsApp', 
        bg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25' 
      };
    case 'telegram':
      return { 
        label: 'Telegram', 
        bg: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/25' 
      };
    case 'discord':
      return { 
        label: 'Discord', 
        bg: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/25' 
      };
    case 'instagram':
      return { 
        label: 'Instagram', 
        bg: 'bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/25' 
      };
    case 'website':
    default:
      return { 
        label: 'Website', 
        bg: 'bg-brand-500/15 text-brand-600 dark:text-brand-400 border-brand-500/25' 
      };
  }
};
