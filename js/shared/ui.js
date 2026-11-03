/**
 * COLLEST — elemen UI bersama (tile gradasi di bagian atas halaman).
 * Beranda memanggil buildTiles() ke #heroTiles; halaman dalam otomatis dipasang
 * jika <body class="has-tiles">.
 */
import './account.js';

export function buildTiles(box) {
  if (!box) return;
  const w = window.innerWidth;
  const cols = w < 560 ? 8 : w < 900 ? 11 : 15;
  const rows = 4;
  box.style.setProperty('--cols', cols);
  // Biru royal di kiri, charcoal-abu di tengah, tangerine di kanan.
  const ramp = (t) => t < 0.42 ? ['#3b82f6', '#6aa0ff', '#a9c6ff', '#dbe7ff']
    : t < 0.72 ? ['#1d4ed8', '#262c37', '#8e9ab3', '#d5dbe8']
    : ['#f97316', '#ff9a3d', '#ffc08a', '#ffe0c2'];
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  let html = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const t = c / (cols - 1);
      const empty = rnd() < 0.2 + r * 0.12;
      const pal = ramp(t);
      const col = pal[Math.min(3, Math.floor(rnd() * 4 + r * 0.35))];
      const style = empty ? '' : `--t:linear-gradient(135deg,${col},${pal[3]});--o:${(0.55 + rnd() * 0.45).toFixed(2)}`;
      const star = !empty && rnd() < 0.09 ? ` tile--star" style="${style};--s:${t > 0.7 ? '#f97316' : '#3b82f6'}` : `" style="${style}`;
      html += `<div class="tile${star}"></div>`;
    }
  }
  box.innerHTML = html;
}

export function watchResize(box) {
  let lastW = window.innerWidth;
  window.addEventListener('resize', () => {
    if (Math.abs(window.innerWidth - lastW) > 80) { lastW = window.innerWidth; buildTiles(box); }
  });
}

if (document.body.classList.contains('has-tiles') && !document.getElementById('heroTiles')) {
  const box = document.createElement('div');
  box.className = 'hero__tiles hero__tiles--page';
  box.id = 'heroTiles';
  box.setAttribute('aria-hidden', 'true');
  document.body.prepend(box);
  buildTiles(box);
  watchResize(box);
}
