/**
 * COLLEST — Beranda (index.html)
 * - Judul, tagline, deskripsi, dan tombol Login.
 * - Pencarian event / vendor (mengarah ke events.html?q= atau vendors.html?q=).
 * - Penjelasan Collest (statis di index.html).
 * - Latar tile dibuat otomatis oleh js/shared/ui.js (body.has-tiles), sama seperti halaman lain.
 */
import '../shared/ui.js';
import { eventStore, escapeHtml } from '../features/events-store.js';
import { login, logout, getSession, initials, isOrganizer, DEMO_ACCOUNTS } from '../shared/auth.js';

const $ = (id) => document.getElementById(id);

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  const el = $('toast');
  el.textContent = msg;
  el.classList.add('is-show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-show'), 2400);
}

/* ---------- Menu mobile ---------- */
const menuBtn = $('menuBtn'), mobileMenu = $('mobileMenu');
menuBtn.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('is-open');
  menuBtn.setAttribute('aria-expanded', String(open));
});

/* ---------- Pencarian: event atau vendor ---------- */
const SUGGEST = {
  events: { ph: 'Event apa yang kamu cari?', hint: 'Contoh: Musik, Bazaar, Workshop, nama event, atau lokasi', list: () => {
    const ev = eventStore.list().filter((e) => e.status === 'published' || e.status === undefined);
    return [...new Set([...ev.map((e) => e.title), ...ev.map((e) => e.category), ...ev.map((e) => e.organizer)])];
  } },
  vendors: { ph: 'Vendor jenis apa yang kamu butuhkan?', hint: 'Contoh: Catering, Sound System, Panggung, Fotografi, atau area seperti Depok', list: () =>
    ['Catering', 'Konsumsi', 'Sound System', 'Lighting', 'Panggung', 'Tenda', 'Fotografi', 'Videografi', 'Dokumentasi', 'Drone', 'Depok', 'Jakarta', 'Bogor', 'Bekasi', 'Tangerang Selatan'] }
};
function applySearchType() {
  const cfg = SUGGEST[$('searchType').value];
  $('searchInput').placeholder = cfg.ph;
  $('searchHint').textContent = cfg.hint;
  $('searchSuggest').innerHTML = cfg.list().map((v) => `<option value="${escapeHtml(v)}"></option>`).join('');
}
$('searchType').addEventListener('change', applySearchType);
$('homeSearch').addEventListener('submit', (ev) => {
  ev.preventDefault();
  const q = $('searchInput').value.trim();
  const page = $('searchType').value === 'vendors' ? 'vendors.html' : 'events.html';
  location.href = q ? `${page}?q=${encodeURIComponent(q)}` : page;
});
applySearchType();

/* ---------- Login dummy ---------- */
const modal = $('loginModal'), userMenu = $('userMenu');

function renderUser() {
  const s = getSession();
  const btn = $('userBtn');
  btn.classList.toggle('is-user', !!s);
  $('userIcon').style.display = s ? 'none' : '';
  $('userInitials').hidden = !s;
  $('userInitials').textContent = s ? initials(s.name) : '';
  btn.setAttribute('aria-label', s ? `Akun ${s.name}` : 'Masuk');
  btn.title = s ? s.name : 'Masuk';
  btn.setAttribute('aria-haspopup', s ? 'menu' : 'dialog');

  // Setelah login, tombol Login hilang. Fitur sudah tersedia di navbar.
  $('heroBtn').hidden = !!s;
  $('heroHint').textContent = s
    ? `Halo, ${s.name.split(' ')[0]}!`
    : 'Akun demo ada di dialog login.';

  $('adminLink').hidden = !isOrganizer(s);
  if (s) { $('userMenuName').textContent = s.name; $('userMenuMeta').textContent = `NIM ${s.nim} · @${s.username}`; }
  else userMenu.hidden = true;
}

function openLogin() {
  $('loginForm').reset();
  $('loginError').hidden = true;
  userMenu.hidden = true;
  modal.showModal();
  $('loginUser').focus();
}

$('loginDemo').innerHTML = 'Akun demo: ' + DEMO_ACCOUNTS.map((a) =>
  `<button type="button" data-u="${escapeHtml(a.username)}" data-p="${escapeHtml(a.password)}">${escapeHtml(a.username)}</button> (<code>${escapeHtml(a.username)}</code> / <code>${escapeHtml(a.password)}</code>)`).join(' &middot; ');
$('loginDemo').addEventListener('click', (ev) => {
  const b = ev.target.closest('button[data-u]');
  if (!b) return;
  $('loginUser').value = b.dataset.u; $('loginPass').value = b.dataset.p;
  $('loginError').hidden = true;
});

$('heroBtn').addEventListener('click', () => {
  if (!getSession()) openLogin();
});

$('userBtn').addEventListener('click', (ev) => {
  ev.stopPropagation();
  if (getSession()) userMenu.hidden = !userMenu.hidden; else openLogin();
});
document.addEventListener('click', (ev) => { if (!userMenu.hidden && !userMenu.contains(ev.target)) userMenu.hidden = true; });
document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') userMenu.hidden = true; });

$('closeLoginBtn').addEventListener('click', () => modal.close());
modal.addEventListener('click', (ev) => { if (ev.target === modal) modal.close(); });

$('loginForm').addEventListener('submit', (ev) => {
  ev.preventDefault();
  const r = login($('loginUser').value, $('loginPass').value);
  if (!r.ok) { $('loginError').textContent = r.error; $('loginError').hidden = false; return; }
  modal.close();
  renderUser();
  toast(`Halo, ${r.user.name}! Kamu sudah masuk.`);
});

$('logoutBtn').addEventListener('click', () => { logout(); renderUser(); toast('Kamu sudah keluar.'); });

renderUser();

// Dari halaman lain: index.html?login=1 membuka dialog login
if (new URLSearchParams(location.search).get('login') === '1') {
  history.replaceState(null, '', location.pathname);
  if (!getSession()) openLogin();
}
