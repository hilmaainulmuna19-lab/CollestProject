/**
 * COLLEST — tombol akun di header halaman dalam (Cari Event, Cari Vendor, Rundown).
 * Belum masuk: tautan ke index.html?login=1. Sudah masuk: inisial + menu Keluar.
 */
import { getSession, logout, initials, isOrganizer } from './auth.js';

const inner = document.querySelector('.header__inner');
const burger = document.getElementById('mobileMenuBtn');

if (inner && burger && !document.querySelector('.acct')) {
  const tools = document.createElement('div');
  tools.className = 'header__tools';
  const acct = document.createElement('div');
  acct.className = 'acct';
  inner.insertBefore(tools, burger);
  tools.append(acct, burger);

  const userIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>';
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function render() {
    const s = getSession();
    if (!s) {
      acct.innerHTML = `<a class="acct__btn" href="index.html?login=1" aria-label="Masuk" title="Masuk">${userIcon}</a>`;
      return;
    }
    acct.innerHTML = `
      <button class="acct__btn is-user" type="button" aria-haspopup="menu" aria-expanded="false" aria-label="Akun ${esc(s.name)}" title="${esc(s.name)}">${esc(initials(s.name))}</button>
      <div class="acct__menu" hidden>
        <div class="acct__name">${esc(s.name)}</div>
        <div class="acct__meta">NIM ${esc(s.nim)}</div>
        ${isOrganizer(s) ? '<a class="btn btn--primary btn--sm" href="admin.html" style="margin-bottom:.5rem;">Area Organizer</a>' : ''}
        <button class="btn btn--secondary btn--sm" type="button" data-logout>Keluar</button>
      </div>`;
  }

  acct.addEventListener('click', (ev) => {
    const menu = acct.querySelector('.acct__menu');
    if (ev.target.closest('[data-logout]')) { logout(); render(); return; }
    if (ev.target.closest('.acct__btn.is-user') && menu) {
      menu.hidden = !menu.hidden;
      acct.querySelector('.acct__btn').setAttribute('aria-expanded', String(!menu.hidden));
    }
  });
  document.addEventListener('click', (ev) => {
    const menu = acct.querySelector('.acct__menu');
    if (menu && !menu.hidden && !acct.contains(ev.target)) menu.hidden = true;
  });
  render();
}
