import { SIGN_DICTIONARY } from '../services/mockData';

/**
 * Tokenize Indonesian text into recognizable words and compound phrases.
 * Handles punctuation removal, lowercasing, compound phrases (e.g. 'terima kasih'),
 * and dictionary matching.
 */
export function tokenizeIndonesianText(text, languageSystem = 'SIBI') {
  if (!text || typeof text !== 'string') return [];

  // Normalize: lower case and remove extraneous punctuation
  const clean = text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'’]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean) return [];

  const rawWords = clean.split(' ');
  const resultTokens = [];
  let i = 0;

  while (i < rawWords.length) {
    // Check for 2-word compound phrase (e.g., 'terima kasih', 'selamat pagi')
    if (i < rawWords.length - 1) {
      const twoWordPhrase = `${rawWords[i]} ${rawWords[i + 1]}`;
      const foundPhrase = SIGN_DICTIONARY.find(item => 
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
        i += 2;
        continue;
      }
    }

    // Single word lookup
    const singleWord = rawWords[i];
    const foundWord = SIGN_DICTIONARY.find(item => 
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
      // Word not directly found in dictionary
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
