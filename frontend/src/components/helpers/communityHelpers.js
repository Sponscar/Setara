/**
 * ==============================================================================
 * File: communityHelpers.js
 * Direktori: src/components/utils/
 * Deskripsi: Helper utility untuk icon, styling badge, dan metadata platform
 *            komunitas (WhatsApp, Telegram, Discord, Instagram, Website).
 * ==============================================================================
 */

import { 
  MessageCircle, 
  Send, 
  MessageSquare, 
  Share2, 
  Globe 
} from 'lucide-react';

/**
 * Mengembalikan metadata visual (label, icon, badgeClass, btnClass)
 * berdasarkan jenis platform komunitas.
 * 
 * @param {string} platform - Nama platform (WhatsApp, Telegram, Discord, Instagram, Website)
 * @returns {{ label: string, icon: any, badgeClass: string, btnClass: string }}
 */
export const getPlatformMeta = (platform = '') => {
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
