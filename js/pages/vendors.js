import '../shared/ui.js';
import { getSession } from '../shared/auth.js';
import { ADMIN_WA } from '../shared/config.js';
import { VENDORS } from '../features/vendors-data.js';
import { buildMultiMessage, createWaLink, formatRupiah, buildRundown, formatRundownText } from '../features/vendor-order.js';
import { escapeHtml } from '../features/events-store.js';
import { loadRundown, setEventStart, RUNDOWN_KEY, DEFAULT_START } from '../features/rundown-store.js';

const $ = (id) => document.getElementById(id);

const menuBtn = $('mobileMenuBtn'), mobileNav = $('mobileNav');
if (menuBtn && mobileNav) {
  menuBtn.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
}


// ---- Rundown: diambil dari halaman Buat Rundown (tidak diisi ulang di sini) ----
let rdSaved = loadRundown();
let sessions = rdSaved ? rdSaved.sessions : [];
const rdStart = () => (rdSaved && rdSaved.startTime) || DEFAULT_START;
// Jam mulai acara di form memakai nilai yang sama dengan jam mulai rundown
$('waStartInput').value = rdStart();
function reloadRundown() { rdSaved = loadRundown(); sessions = rdSaved ? rdSaved.sessions : []; }


/* Kartu katalog: jenis vendor + nama terlihat; detail lengkap dibuka lewat "Selengkapnya". */
function renderGrid() {
  const list = VENDORS;

  $('vendorsGrid').innerHTML = list.map((v) => `
    <article class="card" style="padding:1.25rem; display:flex; flex-direction:column; gap:.6rem;">
      <div><span class="badge badge--royal">${escapeHtml(v.category)}</span></div>
      <h3 style="font-size:1.1rem; font-weight:700;">${escapeHtml(v.name)}</h3>
      <button class="vendor-toggle" type="button" aria-expanded="false">Selengkapnya</button>
      <div class="vendor-detail" hidden>
        <div style="font-size:.85rem; color:var(--color-text-muted); line-height:1.6;">
          <strong>Pemilik:</strong> ${escapeHtml(v.owner)}<br>
          <strong>Alamat:</strong> ${escapeHtml(v.address)}<br>
          <strong>Melayani area:</strong> ${escapeHtml(v.area)}<br>
          <strong>Ready:</strong> ${escapeHtml(v.readyHours)}<br>
          <strong>Sistem harga:</strong> ${escapeHtml(v.pricingModel)}
        </div>
        <div style="font-size:.8rem; font-weight:700; text-transform:uppercase; color:var(--color-text-muted);">Daftar harga</div>
        <div style="border:1px solid var(--color-border); border-radius:var(--radius-sm);">
          ${v.prices.map((p) => `
            <div style="padding:.5rem .75rem; border-top:1px dashed var(--color-border); font-size:.85rem;">
              <div style="display:flex; justify-content:space-between; gap:.5rem;">
                <strong>${escapeHtml(p.label)}</strong>
                <span style="white-space:nowrap; color:var(--color-royal-blue); font-weight:700;">${formatRupiah(p.price)} / ${escapeHtml(p.unit)}</span>
              </div>
              <div style="font-size:.78rem; color:var(--color-text-muted);">${escapeHtml(p.note)}</div>
            </div>`).join('')}
        </div>
        <div style="font-size:.8rem; font-weight:700; text-transform:uppercase; color:var(--color-text-muted);">Spesifikasi</div>
        <ul style="margin:0; padding-left:1.1rem; font-size:.85rem; line-height:1.55;">
          ${v.specs.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}
        </ul>
        <div style="font-size:.8rem; background:#f8fafc; border:1px solid var(--color-border); border-radius:var(--radius-sm); padding:.5rem .75rem;">${escapeHtml(v.terms)}</div>
      </div>
      <button class="btn btn--primary btn--sm" type="button" data-id="${escapeHtml(v.id)}" style="margin-top:auto;">Pesan Vendor</button>
    </article>`).join('');
}

/* ================= Pesanan: satu vendor per jenis ================= */
const CART_KEY = 'collest:v1:vendorCart';
let cart = [];     // [{ id, pkg, specs, notes, sent }]
let active = '';   // id vendor yang sedang diisi
const vendorOf = (id) => VENDORS.find((v) => v.id === id);
const itemOf = (id) => cart.find((c) => c.id === id);
const saveCart = () => { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* abaikan */ } };
try {
  const raw = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  const seen = new Set();
  if (Array.isArray(raw)) cart = raw.filter((c) => {
    const v = c && vendorOf(c.id);
    if (!v || seen.has(v.category)) return false;
    seen.add(v.category); return true;
  });
} catch { cart = []; }
active = cart.length ? cart[0].id : '';

function addToCart(id, pkgIdx = 0) {
  const v = vendorOf(id);
  if (!v) return;
  const same = cart.findIndex((c) => vendorOf(c.id).category === v.category);
  let note;
  if (same >= 0 && cart[same].id === id) {
    cart[same].pkg = pkgIdx; cart[same].sent = false;
    note = `${v.name}: paket diperbarui.`;
  } else {
    const item = { id, pkg: pkgIdx, specs: v.defaultSpecs, notes: '', sent: false };
    if (same >= 0) { note = `${v.category}: ${vendorOf(cart[same].id).name} diganti ${v.name}.`; cart[same] = item; }
    else { note = `${v.name} masuk pesanan. Mau tambah jenis lain? Pilih vendornya di bagian atas.`; cart.push(item); }
  }
  active = id;
  saveCart();
  renderCart();
  $('cartNote').textContent = note;
  $('waOrderSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderCart() {
  const has = cart.length > 0;
  $('orderEmpty').hidden = has;
  $('orderBody').hidden = !has;
  if (!has) { active = ''; return; }
  if (!itemOf(active)) active = cart[0].id;

  $('orderTabs').innerHTML = cart.map((c) => {
    const v = vendorOf(c.id);
    return `<button type="button" role="tab" class="ord-tab${c.id === active ? ' is-active' : ''}" aria-selected="${c.id === active}" data-tab="${escapeHtml(c.id)}">${escapeHtml(v.category)}${c.sent ? ' <span class="ord-tab__ok" title="Sudah dikirim">&#10003;</span>' : ''}</button>`;
  }).join('');

  const v = vendorOf(active), it = itemOf(active);
  $('selectedVendorName').textContent = v.name;
  $('selectedVendorAddress').textContent = `${v.category} · ${v.address}`;
  $('waPackageSelect').innerHTML = v.prices.map((p, i) =>
    `<option value="${i}">${escapeHtml(p.label)} — ${formatRupiah(p.price)} / ${escapeHtml(p.unit)}</option>`).join('');
  $('waPackageSelect').value = String(it.pkg);
  $('waSpecsTextarea').value = it.specs;
  $('waNotesInput').value = it.notes;

  const prev = $('waPreviewScope').value;
  $('waPreviewScope').innerHTML = (cart.length > 1 ? '<option value="all">Semua pesanan (1 pesan)</option>' : '') +
    cart.map((c) => `<option value="${escapeHtml(c.id)}">${escapeHtml(vendorOf(c.id).category)}: ${escapeHtml(vendorOf(c.id).name)}</option>`).join('');
  $('waPreviewScope').value = [...$('waPreviewScope').options].some((o) => o.value === prev) ? prev : $('waPreviewScope').options[0].value;

  $('btnSendWhatsApp').textContent = cart.length > 1 ? `Kirim semua (${cart.length} vendor) ke Admin WhatsApp` : 'Kirim ke Admin WhatsApp';
  $('btnSendOne').textContent = `Kirim ${v.category} saja`;
  $('btnSendOne').hidden = cart.length < 2;
  updatePreview();
}

function sharedDetails() {
  return {
    sender: $('waSenderInput').value,
    eventName: $('waEventInput').value,
    eventLocation: $('waLocationInput').value,
    date: $('waDateInput').value,
    startTime: $('waStartInput').value,
    endTime: $('waEndInput').value,
    participants: $('waParticipantsInput').value,
    punctuality: $('waPunctualitySelect').value,
    rundown: $('rdInclude').checked ? buildRundown(rdStart(), sessions).rows : null
  };
}
const itemsFor = (ids) => ids.map((id) => {
  const v = vendorOf(id), it = itemOf(id);
  return { vendor: v, pkg: v.prices[it.pkg] || v.prices[0], specs: it.specs, notes: it.notes };
});

function updatePreview() {
  if (!cart.length) { $('waPreviewText').textContent = ''; return ''; }
  const shared = sharedDetails();
  const allIds = cart.map((c) => c.id);
  const scope = $('waPreviewScope').value;
  const msg = buildMultiMessage(shared, itemsFor(scope === 'all' || !itemOf(scope) ? allIds : [scope]));
  $('waPreviewText').textContent = msg;
  $('btnSendWhatsApp').href = createWaLink(ADMIN_WA, buildMultiMessage(shared, itemsFor(allIds)));
  $('btnSendOne').href = createWaLink(ADMIN_WA, buildMultiMessage(shared, itemsFor([active])));
  return msg;
}

$('vendorsGrid').addEventListener('click', (ev) => {
  const tg = ev.target.closest('.vendor-toggle');
  if (tg) {
    const detail = tg.closest('.card').querySelector('.vendor-detail');
    const open = tg.getAttribute('aria-expanded') !== 'true';
    detail.hidden = !open;
    tg.setAttribute('aria-expanded', String(open));
    tg.textContent = open ? 'Sembunyikan' : 'Selengkapnya';
    return;
  }

  const btn = ev.target.closest('button[data-id]');
  if (btn) addToCart(btn.dataset.id);
});
$('orderTabs').addEventListener('click', (ev) => {
  const tab = ev.target.closest('button[data-tab]');
  if (!tab) return;
  active = tab.dataset.tab;
  renderCart();
});
$('removeVendorBtn').addEventListener('click', () => {
  cart = cart.filter((c) => c.id !== active);
  saveCart(); renderCart();
  $('cartNote').textContent = '';
});

/* ================= Finder: kebutuhan + rentang harga + lokasi ================= */
const PRICE_STOPS = [0, 25000, 50000, 100000, 250000, 500000, 1000000, 2000000, 3500000, 5000000];
const LAST = PRICE_STOPS.length - 1;
const shortRp = (n) => n >= 1000000 ? 'Rp' + String(n / 1000000).replace('.', ',') + 'jt' : n >= 1000 ? 'Rp' + n / 1000 + 'rb' : 'Rp' + n;

const finder = { need: '', area: '', min: 0, max: LAST };

function matchesArea(v, area) {
  return !area || /jabodetabek/i.test(v.area) || v.area.toLowerCase().includes(area.toLowerCase());
}

function findMatches() {
  const lo = PRICE_STOPS[finder.min];
  const hi = finder.max === LAST ? Infinity : PRICE_STOPS[finder.max];
  return VENDORS
    .filter((v) => v.category === finder.need && matchesArea(v, finder.area))
    .map((v) => {
      const hits = v.prices.map((p, idx) => ({ p, idx })).filter(({ p }) => !/^overtime/i.test(p.label) && p.price >= lo && p.price <= hi);
      return { v, hits, others: v.prices.length - hits.length };
    })
    .filter((m) => m.hits.length)
    .sort((a, b) => b.hits.length - a.hits.length || Math.min(...a.hits.map((h) => h.p.price)) - Math.min(...b.hits.map((h) => h.p.price)));
}

function renderFinder() {
  const box = $('finderResults'), sum = $('finderSummary');
  $('priceMinOut').textContent = shortRp(PRICE_STOPS[finder.min]);
  $('priceMaxOut').textContent = finder.max === LAST ? 'Tanpa batas' : shortRp(PRICE_STOPS[finder.max]);
  [$('priceMin'), $('priceMax')].forEach((el) => el.style.setProperty('--pct', (Number(el.value) / LAST * 100) + '%'));

  if (!finder.need) {
    sum.textContent = 'Pilih kebutuhan dulu, lalu atur harga dan lokasi.';
    box.innerHTML = '<div class="finder__empty"><b>Belum ada pilihan</b>Pilih jenis vendor yang kamu butuhkan di sebelah kiri. Hasil yang relevan akan muncul di sini.</div>';
    return;
  }
  const res = findMatches();
  const where = finder.area || 'semua area';
  const range = `${shortRp(PRICE_STOPS[finder.min])} – ${finder.max === LAST ? 'tanpa batas' : shortRp(PRICE_STOPS[finder.max])}`;
  sum.textContent = res.length
    ? `${res.length} vendor ${finder.need} cocok · ${range} · ${where}`
    : `Tidak ada hasil untuk ${finder.need} · ${range} · ${where}`;

  if (!res.length) {
    box.innerHTML = '<div class="finder__empty"><b>Belum ada yang cocok</b>Coba longgarkan rentang harga atau ganti lokasi ke "Semua area".</div>';
    return;
  }
  box.innerHTML = res.map(({ v, hits, others }, i) => `
    <article class="fr-card ${i === 0 ? 'fr-card--best' : ''}">
      ${i === 0 ? '<span class="fr-card__flag">Paling pas</span>' : ''}
      <div class="fr-card__cat">${escapeHtml(v.category)}</div>
      <div class="fr-card__name">${escapeHtml(v.name)}</div>
      <div class="fr-card__area">Melayani ${escapeHtml(v.area)}</div>
      ${hits.map(({ p }) => `<div class="fr-pkg"><span>${escapeHtml(p.label)}</span><b>${formatRupiah(p.price)} / ${escapeHtml(p.unit)}</b></div>`).join('')}
      <div class="fr-card__foot">
        <div class="fr-card__terms">${escapeHtml(v.terms)}${others ? ` · +${others} paket lain di luar rentang` : ''}</div>
        <button class="fr-btn" type="button" data-id="${escapeHtml(v.id)}" data-pkg="${hits[0].idx}">Pesan vendor</button>
      </div>
    </article>`).join('');
}

function syncSliders(changed) {
  let lo = Number($('priceMin').value), hi = Number($('priceMax').value);
  if (lo > hi) { if (changed === 'min') hi = lo; else lo = hi; }
  $('priceMin').value = lo; $('priceMax').value = hi;
  finder.min = lo; finder.max = hi;
  renderFinder();
}
$('priceMin').addEventListener('input', () => syncSliders('min'));
$('priceMax').addEventListener('input', () => syncSliders('max'));
$('finderForm').addEventListener('change', (ev) => {
  if (ev.target.name === 'need') finder.need = ev.target.value;
  if (ev.target.name === 'area') finder.area = ev.target.value;
  renderFinder();
});
$('finderResults').addEventListener('click', (ev) => {
  const btn = ev.target.closest('button[data-id]');
  if (!btn) return;
  addToCart(btn.dataset.id, Number(btn.dataset.pkg) || 0);
});

// Kata kunci dari pencarian cepat beranda (?q=) -> pilihan awal finder
{
  const q = (new URLSearchParams(location.search).get('q') || '').toLowerCase();
  const NEED_KEYS = { 'Konsumsi / Catering': /catering|konsumsi|makan|snack|nasi|box/, 'Sound System & Lighting': /sound|audio|lighting|lampu|mic|speaker/, 'Panggung & Tenda': /panggung|tenda|stage|kursi|backdrop/, 'Fotografi & Dokumentasi': /foto|video|dokumentasi|drone/ };
  const need = Object.keys(NEED_KEYS).find((k) => NEED_KEYS[k].test(q));
  const area = ['Depok', 'Jakarta', 'Bogor', 'Tangerang Selatan', 'Bekasi'].find((a) => q.includes(a.toLowerCase()));
  if (need) { finder.need = need; document.querySelector(`input[name="need"][value="${need}"]`).checked = true; }
  if (area) { finder.area = area; document.querySelector(`input[name="area"][value="${area}"]`).checked = true; }
}
renderFinder();

// Detail acara (dipakai semua vendor)
['waSenderInput', 'waEventInput', 'waLocationInput', 'waDateInput', 'waStartInput', 'waEndInput',
 'waParticipantsInput', 'waPunctualitySelect', 'waPreviewScope']
  .forEach((id) => { $(id).addEventListener('input', updatePreview); $(id).addEventListener('change', updatePreview); });

// Template milik vendor yang sedang aktif
$('waPackageSelect').addEventListener('change', () => { const it = itemOf(active); if (it) { it.pkg = Number($('waPackageSelect').value) || 0; saveCart(); updatePreview(); } });
$('waSpecsTextarea').addEventListener('input', () => { const it = itemOf(active); if (it) { it.specs = $('waSpecsTextarea').value; saveCart(); updatePreview(); } });
$('waNotesInput').addEventListener('input', () => { const it = itemOf(active); if (it) { it.notes = $('waNotesInput').value; saveCart(); updatePreview(); } });

function validate() {
  const o = sharedDetails();
  if (!cart.length) return 'Pilih minimal satu vendor dulu.';
  const missing = [];
  if (!o.sender.trim()) missing.push('nama pemesan');
  if (!o.date) missing.push('tanggal');
  if (!o.participants || Number(o.participants) < 1) missing.push('jumlah peserta');
  if (!o.startTime || !o.endTime) missing.push('jam mulai & selesai');
  if (o.startTime && o.endTime && o.endTime <= o.startTime) return 'Jam selesai harus setelah jam mulai.';
  return missing.length ? 'Lengkapi dulu: ' + missing.join(', ') + '.' : '';
}

function guardSend(ev, ids) {
  const err = validate();
  $('waError').textContent = err;
  $('waError').style.display = err ? 'block' : 'none';
  if (err) { ev.preventDefault(); return; }
  updatePreview();
  // tandai terkirim setelah tautan dibuka, lalu perbarui tab
  setTimeout(() => { ids.forEach((id) => { const it = itemOf(id); if (it) it.sent = true; }); saveCart(); renderCart(); }, 0);
}
$('btnSendWhatsApp').addEventListener('click', (ev) => guardSend(ev, cart.map((c) => c.id)));
$('btnSendOne').addEventListener('click', (ev) => guardSend(ev, [active]));

$('btnCopyWa').addEventListener('click', async () => {
  const msg = updatePreview();
  try { await navigator.clipboard.writeText(msg); $('btnCopyWa').textContent = 'Tersalin!'; }
  catch { $('btnCopyWa').textContent = 'Gagal menyalin'; }
  setTimeout(() => { $('btnCopyWa').textContent = 'Salin Pesan'; }, 1500);
});

function renderRundown() {
  const start = rdStart();
  const r = buildRundown(start, sessions);
  $('rdTableBody').innerHTML = r.rows.length ? r.rows.map((row) => `
    <tr>
      <td>${row.no}</td>
      <td><strong>${row.start} - ${row.end}</strong></td>
      <td>${row.durationMinutes} mnt</td>
      <td>${escapeHtml(row.title)}</td>
      <td>${escapeHtml(row.pic) || '-'}</td>
    </tr>`).join('')
    : '<tr><td colspan="5" style="text-align:center; padding:1rem; color:var(--color-text-muted);">Belum ada rundown. Susun dulu di halaman <a href="rundown.html">Buat Rundown</a>.</td></tr>';

  const endInput = $('waEndInput').value.replace(':', '.');
  const over = r.rows.length && endInput && r.endTime > endInput;
  $('rdSummary').innerHTML = r.rows.length
    ? `Mulai pukul <strong>${start.replace(':', '.')}</strong> &middot; total <strong>${r.total} menit</strong> &middot; selesai pukul <strong>${r.endTime}</strong>` +
      (over ? ` <span style="color:#b91c1c;">(melewati jam selesai acara ${endInput})</span>` : '')
    : '';
  updatePreview();
}

$('rdInclude').addEventListener('change', updatePreview);
$('waEndInput').addEventListener('input', renderRundown);

$('rdCopyBtn').addEventListener('click', async () => {
  const r = buildRundown(rdStart(), sessions);
  const text = r.rows.length
    ? `RUNDOWN ${$('waEventInput').value.trim() || 'ACARA'}\n${formatRundownText(r.rows)}\nSelesai: ${r.endTime}`
    : '';
  const btn = $('rdCopyBtn');
  if (!text) { btn.textContent = 'Rundown kosong'; }
  else {
    try { await navigator.clipboard.writeText(text); btn.textContent = 'Tersalin!'; }
    catch { btn.textContent = 'Gagal menyalin'; }
  }
  setTimeout(() => { btn.textContent = 'Salin Rundown'; }, 1500);
});

// Jam mulai diubah di form ini -> disimpan dan dipakai sebagai jam mulai rundown
$('waStartInput').addEventListener('input', () => {
  const t = $('waStartInput').value;
  if (!/^\d{2}:\d{2}$/.test(t)) return;
  setEventStart(t); reloadRundown(); renderRundown();
});

// Rundown atau jam mulai diubah di tab lain langsung ikut terbaca
window.addEventListener('storage', (e) => {
  if (e.key !== RUNDOWN_KEY) return;
  reloadRundown();
  $('waStartInput').value = rdStart();
  renderRundown();
});

const today = new Date().toISOString().slice(0, 10);
$('waDateInput').min = today;
{ const me = getSession(); if (me && !$('waSenderInput').value) $('waSenderInput').value = me.name; }
renderGrid();
renderCart();
renderRundown();