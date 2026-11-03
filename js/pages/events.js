import '../shared/ui.js';
import { getSession } from '../shared/auth.js';
import { eventStore, isEventOpen, formatDate, formatDateLong, escapeHtml, normalizeRole } from '../features/events-store.js';

const $ = (id) => document.getElementById(id);

// Menu mobile
const menuBtn = $('mobileMenuBtn'), mobileNav = $('mobileNav');
if (menuBtn && mobileNav) {
  menuBtn.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
}

let activeEvent = null;

/* ---------- Ilustrasi garis per kategori (stroke = currentColor) ---------- */
const ART = {
  Teknologi: '<rect x="34" y="34" width="52" height="52" rx="8"/><rect x="48" y="48" width="24" height="24" rx="4"/><path d="M46 22v12M60 22v12M74 22v12M46 86v12M60 86v12M74 86v12M22 46h12M22 60h12M22 74h12M86 46h12M86 60h12M86 74h12"/>',
  Musik: '<path d="M48 84V36l42-10v48"/><circle cx="38" cy="84" r="10"/><circle cx="80" cy="74" r="10"/>',
  Expo: '<path d="M24 46l8-20h56l8 20"/><path d="M24 46a12 12 0 0 0 24 0 12 12 0 0 0 24 0 12 12 0 0 0 24 0"/><path d="M30 58v38h60V58"/><path d="M52 96V74h16v22"/>',
  Lomba: '<path d="M42 28h36v22a18 18 0 0 1-36 0z"/><path d="M42 36H28a14 14 0 0 0 14 18M78 36h14a14 14 0 0 1-14 18"/><path d="M60 68v14M46 94h28M50 82h20v12H50z"/>',
  Workshop: '<path d="M60 24a24 24 0 0 0-14 43c3 3 4 6 4 10h20c0-4 1-7 4-10A24 24 0 0 0 60 24z"/><path d="M50 88h20M53 98h14M60 8v6M24 30l4 4M96 30l-4 4"/>'
};
const ART_DEFAULT = '<rect x="26" y="34" width="68" height="60" rx="8"/><path d="M26 52h68M44 24v16M76 24v16"/><rect x="40" y="64" width="12" height="12" rx="2"/>';
const artSvg = (cat) => `
  <svg viewBox="0 0 120 120" width="120" height="120" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    ${ART[cat] || ART_DEFAULT}
    <path class="ev-spark" d="M100 14l3.4 10.6L114 28l-10.6 3.4L100 42l-3.4-10.6L86 28l10.6-3.4z" fill="currentColor" stroke="none"/>
  </svg>`;

const VARIANTS = ['blue', 'orange', 'dark'];

/* ---------- Render ---------- */
function benefitBadge(b) {
  return `<span class="ev-benefit ${/^fee/i.test(b) ? 'ev-benefit--fee' : ''}">${escapeHtml(b)}</span>`;
}

function renderDivision(e, d, open) {
  const roles = d.roles.map(normalizeRole).map((r) => `
    <div class="ev-role">
      <div class="ev-role__info">
        <div class="ev-role__name">${escapeHtml(r.name)}</div>
        <div class="ev-role__benefits">${r.benefits.length ? r.benefits.map(benefitBadge).join('') : '<span class="ev-role__none">Tanpa benefit khusus</span>'}</div>
      </div>
      <button class="ev-join" type="button" ${open ? '' : 'disabled'}
        data-event="${escapeHtml(e.id)}" data-division="${escapeHtml(d.name)}" data-role="${escapeHtml(r.name)}">${open ? 'Join' : 'Tutup'}</button>
    </div>`).join('');
  return `
    <div class="ev-div">
      <div class="ev-div__top">
        <strong>${escapeHtml(d.name)}</strong>
        ${d.slots ? `<span>${escapeHtml(d.slots)} orang</span>` : ''}
      </div>
      ${d.description ? `<p class="ev-div__desc">${escapeHtml(d.description)}</p>` : ''}
      ${roles}
    </div>`;
}

function renderCard(e, i) {
  const open = isEventOpen(e);
  const variant = VARIANTS[i % VARIANTS.length];
  return `
  <article class="ev-card ev-card--${variant}" data-id="${escapeHtml(e.id)}" tabindex="0" aria-label="${escapeHtml(e.title)}">
    <div class="ev-card__track">
      <!-- Depan: sengaja simpel -->
      <section class="ev-face ev-front">
        <div class="ev-art">${artSvg(e.category)}</div>
        <div class="ev-tags">
          <span class="ev-tag">${escapeHtml(e.category)}</span>
          ${open ? '' : '<span class="ev-tag ev-tag--closed">Ditutup</span>'}
        </div>
        <h3 class="ev-title">${escapeHtml(e.title)}</h3>
        <p class="ev-line">${escapeHtml(e.organizer)} &middot; ${escapeHtml(formatDate(e.startsAt))}</p>
        <div class="ev-actions">
          <button class="ev-btn" type="button" data-flip="open"><span class="ev-btn__dot" aria-hidden="true">&rarr;</span>Lihat spesifikasi</button>
          <span class="ev-swipe" aria-hidden="true">geser &larr;</span>
        </div>
      </section>

      <!-- Belakang: muncul setelah digeser -->
      <section class="ev-face ev-back" inert aria-label="Spesifikasi ${escapeHtml(e.title)}">
        <button class="ev-back__btn" type="button" data-flip="close"><span aria-hidden="true">&larr;</span> Kembali</button>
        <h3 class="ev-back__title">${escapeHtml(e.title)}</h3>
        <p class="ev-back__desc">${escapeHtml(e.description)}</p>
        <dl class="ev-specs">
          <div><dt>Pelaksanaan</dt><dd>${escapeHtml(formatDateLong(e.startsAt))}${e.time ? `<br>${escapeHtml(e.time)}` : ''}</dd></div>
          <div><dt>Lokasi</dt><dd>${escapeHtml(e.location)}</dd></div>
          <div><dt>Penyelenggara</dt><dd>${escapeHtml(e.organizer)}</dd></div>
          <div><dt>Daftar sampai</dt><dd>${escapeHtml(formatDate(e.deadline))}${open ? '' : ' (ditutup)'}</dd></div>
        </dl>
        <div class="ev-back__label">Kebutuhan panitia</div>
        <div class="ev-divs">${e.divisions.map((d) => renderDivision(e, d, open)).join('')}</div>
      </section>
    </div>
  </article>`;
}

function render() {
  const q = $('eventSearchInput').value.trim().toLowerCase();
  const cat = $('eventCategorySelect').value;
  const list = eventStore.list().filter((e) =>
    (cat === 'Semua' || e.category === cat) &&
    (!q || `${e.title} ${e.location} ${e.organizer} ${e.category}`.toLowerCase().includes(q)));
  $('eventsGrid').innerHTML = list.map(renderCard).join('');
  $('eventsEmptyState').style.display = list.length ? 'none' : 'block';
}

/* ---------- Geser kartu (pointer: sentuh & mouse) + tombol + keyboard ---------- */
function setOpen(card, open) {
  card.classList.toggle('is-open', open);
  const back = card.querySelector('.ev-back'), front = card.querySelector('.ev-front');
  back.inert = !open; front.inert = open;
  if (open) back.scrollTop = 0;
}

const grid = $('eventsGrid');
let drag = null;
grid.addEventListener('pointerdown', (ev) => {
  const card = ev.target.closest('.ev-card');
  if (!card || ev.target.closest('select, input, textarea')) return;
  drag = { card, x: ev.clientX, y: ev.clientY, id: ev.pointerId };
});
const endDrag = (ev) => {
  if (!drag || ev.pointerId !== drag.id) return;
  const dx = ev.clientX - drag.x, dy = ev.clientY - drag.y;
  const { card } = drag; drag = null;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
    setOpen(card, dx < 0);
    card.dataset.swiped = '1';              // cegah klik yang ikut terpicu setelah drag
    setTimeout(() => delete card.dataset.swiped, 0);
  }
};
grid.addEventListener('pointerup', endDrag);
grid.addEventListener('pointercancel', () => { drag = null; });

grid.addEventListener('click', (ev) => {
  const join = ev.target.closest('button[data-event]');
  if (join && !join.disabled) { openModal(join.dataset.event, join.dataset.division, join.dataset.role); return; }
  const flip = ev.target.closest('button[data-flip]');
  if (flip) setOpen(flip.closest('.ev-card'), flip.dataset.flip === 'open');
});

grid.addEventListener('keydown', (ev) => {
  const card = ev.target.closest('.ev-card');
  if (!card || ev.target !== card) return;
  if (ev.key === 'ArrowLeft') { setOpen(card, true); ev.preventDefault(); }
  if (ev.key === 'ArrowRight' || ev.key === 'Escape') { setOpen(card, false); ev.preventDefault(); }
});

/* ---------- Modal pendaftaran ---------- */
function currentDivision() {
  return activeEvent && activeEvent.divisions.find((d) => d.name === $('formDivisionSelect').value);
}

function updatePreview() {
  const div = currentDivision();
  const prev = $('openingPreview');
  if (!div) { prev.style.display = 'none'; return; }
  const role = div.roles.map(normalizeRole).find((r) => r.name === $('formRoleSelect').value);
  const parts = [];
  if (div.description) parts.push(escapeHtml(div.description));
  if (role) parts.push('<strong>Benefit:</strong> ' + (role.benefits.length ? escapeHtml(role.benefits.join(', ')) : 'tidak ada benefit khusus'));
  prev.innerHTML = parts.join('<br>');
  prev.style.display = 'block';
}

function fillRoleOptions(selectedRole) {
  const div = currentDivision();
  $('formRoleSelect').innerHTML = (div ? div.roles.map(normalizeRole) : []).map((r) =>
    `<option value="${escapeHtml(r.name)}">${escapeHtml(r.name)}</option>`).join('');
  if (selectedRole) $('formRoleSelect').value = selectedRole;
  updatePreview();
}

function showFormError(msg) {
  const el = $('formError');
  el.textContent = msg; el.style.display = msg ? 'block' : 'none';
}

function openModal(id, divisionName, roleName) {
  activeEvent = eventStore.list().find((e) => e.id === id);
  if (!activeEvent) return;
  $('applicantForm').reset();
  const me = getSession();   // sudah login: nama & NIM terisi otomatis
  if (me) { $('formApplicantName').value = me.name; $('formStudentNumber').value = me.nim; }
  $('applyFormView').hidden = false;
  $('applySuccessView').hidden = true;
  $('modalEventTitle').textContent = activeEvent.title;
  $('modalEventMeta').textContent =
    `${activeEvent.organizer} · ${activeEvent.location} · ${formatDateLong(activeEvent.startsAt)}${activeEvent.time ? ' · ' + activeEvent.time : ''}`;
  $('formDivisionSelect').innerHTML = activeEvent.divisions.map((d) =>
    `<option value="${escapeHtml(d.name)}">${escapeHtml(d.name)}</option>`).join('');
  if (divisionName) $('formDivisionSelect').value = divisionName;
  fillRoleOptions(roleName);
  showFormError('');
  $('eventDetailModal').showModal();
  $('formApplicantName').focus();
}

$('closeEventModalBtn').addEventListener('click', () => $('eventDetailModal').close());
$('applyDoneBtn').addEventListener('click', () => $('eventDetailModal').close());
$('eventDetailModal').addEventListener('click', (ev) => { if (ev.target === $('eventDetailModal')) $('eventDetailModal').close(); });
$('formDivisionSelect').addEventListener('change', () => fillRoleOptions());
$('formRoleSelect').addEventListener('change', updatePreview);

['eventSearchInput', 'eventCategorySelect'].forEach((id) => $(id).addEventListener('input', render));
$('resetEventFilterBtn').addEventListener('click', () => {
  $('eventSearchInput').value = ''; $('eventCategorySelect').value = 'Semua'; render();
});

$('applicantForm').addEventListener('submit', (ev) => {
  ev.preventDefault();
  const data = {
    eventId: activeEvent.id,
    eventTitle: activeEvent.title,
    name: $('formApplicantName').value.trim(),
    nim: $('formStudentNumber').value.trim(),
    division: $('formDivisionSelect').value,
    role: $('formRoleSelect').value,
    reason: $('formApplicantReason').value.trim()
  };
  if (!data.name || !data.nim || !data.reason) return showFormError('Nama, NIM, dan alasan wajib diisi.');
  if (!/^\d{5,20}$/.test(data.nim)) return showFormError('NIM hanya berisi angka (5–20 digit).');
  if (!isEventOpen(activeEvent)) return showFormError('Pendaftaran event ini sudah ditutup.');
  if (eventStore.listRegistrations().some((r) => r.eventId === data.eventId && r.nim === data.nim)) {
    return showFormError('NIM ini sudah terdaftar di event ini.');
  }
  showFormError('');

  const code = 'COL-' + Date.now().toString(36).slice(-5).toUpperCase();
  if (!eventStore.logRegistration({ ...data, code })) {
    return showFormError('Gagal menyimpan: penyimpanan browser tidak tersedia atau penuh.');
  }

  $('applySuccessText').textContent =
    `${data.name}, pendaftaranmu sebagai ${data.role} (${data.division}) di ${data.eventTitle} sudah tercatat.`;
  $('applySuccessCode').textContent = code;
  $('applyFormView').hidden = true;
  $('applySuccessView').hidden = false;
});

{ const q = new URLSearchParams(location.search).get('q'); if (q) $('eventSearchInput').value = q; }
render();
