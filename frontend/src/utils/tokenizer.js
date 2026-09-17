/**
 * ==============================================================================
 * File: tokenizer.js
 * Direktori: src/utils/
 * Deskripsi: Algoritma Tokenisasi Teks Alami Bahasa Indonesia ke Kosakata Bahasa Isyarat.
 * Pattern:
 *   - Interpreter / Lexer Pattern: Melakukan normalisasi string input, pemecahan token,
 *     dan evaluasi struktur kalimat.
 *   - N-Gram Compound Phrase Matching: Mendeteksi idiom / frasa majemuk 2 kata (seperti 'terima kasih',
 *     'selamat pagi') sebelum memecah menjadi kata tunggal.
 *   - Dynamic Database Dictionary Support: Mendukung injeksi kamus kosakata langsung dari backend PostgreSQL.
 *   - Fallback Spelling Pattern: Kata yang belum terdaftar di kamus diarahkan ke peragaan
 *     ejaan huruf per huruf (fingerspelling).
 * ==============================================================================
 */

import { SIGN_DICTIONARY } from '../services/mockData';

/**
 * Melakukan tokenisasi kalimat bahasa Indonesia menjadi rangkaian token isyarat
 * yang dapat divisualisasikan oleh animator canvas atau video player.
 * 
 * @param {string} text - Teks kalimat yang akan diterjemahkan
 * @param {'SIBI' | 'BISINDO'} [languageSystem='SIBI'] - Sistem bahasa isyarat yang dipilih
 * @param {Array<Object>} [customDictionary=null] - Daftar kamus aktif dari PostgreSQL backend
 * @returns {Array<Object>} Daftar token kata/frasa lengkap dengan metadata gestur
 */
export function tokenizeIndonesianText(text, languageSystem = 'SIBI', customDictionary = null) {
  // Validasi tipe data input
  if (!text || typeof text !== 'string') return [];

  // Gunakan kamus dari database backend jika tersedia, fallback ke kamus dasar jika kosong
  const dict = (Array.isArray(customDictionary) && customDictionary.length > 0)
    ? customDictionary
    : SIGN_DICTIONARY;

  // 1. Normalisasi teks: lower-case & eliminasi tanda baca
  const clean = text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'’]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean) return [];

  const rawWords = clean.split(' ');
  const resultTokens = [];
  let i = 0;

  // 2. Iterasi kata demi kata
  while (i < rawWords.length) {
    // A. Evaluasi N-Gram 2 kata (Frasa Majemuk)
    if (i < rawWords.length - 1) {
      const twoWordPhrase = `${rawWords[i]} ${rawWords[i + 1]}`;
      const foundPhrase = dict.find(
        (item) =>
          item.kata.toLowerCase() === twoWordPhrase &&
          (item.tipe_bahasa === 'BOTH' || item.tipe_bahasa === languageSystem || !item.tipe_bahasa)
      );

      if (foundPhrase) {
        resultTokens.push({
          word: twoWordPhrase,
          matchedData: foundPhrase,
          isAvailable: true,
          type: 'phrase'
        });
        i += 2; // Lewati 2 kata karena sudah cocok sebagai frasa
        continue;
      }
    }

    // B. Evaluasi Kata Tunggal (Single Word Lookup)
    const singleWord = rawWords[i];
    const foundWord = dict.find(
      (item) =>
        item.kata.toLowerCase() === singleWord &&
        (item.tipe_bahasa === 'BOTH' || item.tipe_bahasa === languageSystem || !item.tipe_bahasa)
    );

    if (foundWord) {
      resultTokens.push({
        word: singleWord,
        matchedData: foundWord,
        isAvailable: true,
        type: 'word'
      });
    } else {
      // C. Fallback: Kata belum tersedia di kamus -> Fingerspelling (mengeja huruf per huruf)
      resultTokens.push({
        word: singleWord,
        matchedData: {
          kata: singleWord,
          durasi: 1.5,
          deskripsi_gerakan: `Mengeja huruf per huruf: ${singleWord.toUpperCase()}`,
          gesture_pattern: 'spelling',
          tersedia: false
        },
        isAvailable: false,
        type: 'unknown'
      });
    }

    i += 1;
  }

  return resultTokens;
}