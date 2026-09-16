/**
 * @file main.jsx
 * @description Entry point utama aplikasi React — SETARA Platform.
 *
 * File ini merupakan bootstrap awal yang:
 * 1. Membuat React DOM root pada elemen `#root` di index.html.
 * 2. Membungkus seluruh aplikasi dalam `React.StrictMode` untuk
 *    mendeteksi potensi masalah (double render di development).
 * 3. Mengimpor stylesheet global `index.css` yang berisi
 *    design tokens, utility classes, dan animasi kustom.
 *
 * @module main
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; /* Stylesheet global: Tailwind base + custom utilities */

/**
 * Inisialisasi React DOM root.
 * Menggunakan createRoot (React 18+) untuk Concurrent Mode.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
