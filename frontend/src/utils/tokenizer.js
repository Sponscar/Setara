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
 *   - Fallback Spelling Pattern: Kata yang belum terdaftar di kamus diarahkan ke peragaan
 *     ejaan huruf per huruf (fingerspelling).
 * ==============================================================================
 */

import { SIGN_DICTIONARY } from '../services/mockData';

/**
 * Melakukan tokenisasi kalimat bahasa Indonesia menjadi rangkaian token isyarat
 * yang dapat divisualisasikan oleh animator canvas atau video player.
 * 
 * Tahapan Algoritma:
 * 1. Normalisasi: Ubah ke huruf kecil dan bersihkan tanda baca umum.
 * 2. N-Gram Matching: Cek apakah 2 kata berurutan membentuk frasa majemuk yang ada di kamus.
 * 3. Single Word Lookup: Jika bukan frasa, cocokkan kata tunggal dengan kamus (sesuai sistem bahasa aktif).
 * 4. Fallback Handling: Jika kata tidak ditemukan di kamus, buat token 'unknown' dengan mode fingerspelling.
 * 
 * @param {string} text - Teks kalimat yang akan diterjemahkan
 * @param {'SIBI' | 'BISINDO'} [languageSystem='SIBI'] - Sistem bahasa isyarat yang dipilih
 * @returns {Array<Object>} Daftar token kata/frasa lengkap dengan metadata gestur
 */
export function tokenizeIndonesianText(text, languageSystem = 'SIBI') {
  // Validasi tipe data input
  if (!text || typeof text !== 'string') return [];

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
      const foundPhrase = SIGN_DICTIONARY.find(
        (item) =>
          item.kata.toLowerCase() === twoWordPhrase &&
          (item.tipe_bahasa === 'BOTH' || item.tipe_bahasa === languageSystem)
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
    const foundWord = SIGN_DICTIONARY.find(
      (item) =>
        item.kata.toLowerCase() === singleWord &&
        (item.tipe_bahasa === 'BOTH' || item.tipe_bahasa === languageSystem)
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
