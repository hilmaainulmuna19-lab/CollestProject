import '../shared/ui.js';
/**
 * COLLEST — Halaman Buat Rundown.
 * Setiap sesi punya jam mulai sendiri. Mengubah jam sesi atau menambah/menghapus sesi
 * membuat sesi setelahnya bergeser agar menyambung. Data disimpan bersama halaman Vendor.
 */
import {
  loadRundown, saveRundown, normalizeRundown, placeSession, removeSession,
  withEventStart, newId, toMin, fromMin, DEFAULT_START, RUNDOWN_KEY
} from '../features/rundown-store.js';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const validTime = (t) => toMin(t) !== null;

const PRESET = [
  { title: 'Registrasi & Morning Coffee', durationMinutes: 30, pic: 'Sie Kesekretariatan' },
  { title: 'Sesi Keynote Seminar', durationMinutes: 45, pic: 'Sie Acara' },
  { title: 'Q&A & Pembagian Doorprize', durationMinutes: 20, pic: 'MC Acara' }
];
const STARTER = [
  { title: 'Registrasi Peserta & Check-In', durationMinutes: 30, pic: 'Sie Kesekretariatan' },
  { title: 'Pembukaan & Sambutan', durationMinutes: 20, pic: 'MC Acara' },
  { title: 'Sesi Materi Utama', durationMinutes: 45, pic: 'Moderator' },
  { title: 'Tanya Jawab & Penutup', durationMinutes: 15, pic: 'Sie Acara' }
];

document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const $ = (id) => document.getElementById(id);
  const startTimeInput = $('startTimeInput');
  const sessionTimeInput = $('sessionTimeInput');
  const activityTitleInput = $('activityTitleInput');
  const durationInput = $('durationInput');
  const picInput = $('picInput');
  const tableBody = $('rundownTableBody');
  const totalDurationDisplay = $('totalDurationDisplay');
  const endTimeDisplay = $('endTimeDisplay');

  let state = loadRundown() || normalizeRundown({ startTime: DEFAULT_START, sessions: STARTER });
  startTimeInput.value = state.startTime;

  function persistAndRender() {
    saveRundown(state);
    render();
  }

  function render() {
    tableBody.innerHTML = state.sessions.length
      ? state.sessions.map((s, i) => `
        <tr>
          <td style="font-weight: 700; color: var(--color-charcoal);">${i + 1}</td>
          <td><input type="time" class="form-input rd-time" data-id="${esc(s.id)}" value="${esc(s.startTime)}" aria-label="Jam mulai ${esc(s.title)}" style="width: 120px; padding: 0.3rem 0.5rem;"></td>
          <td style="font-family: var(--font-mono); font-weight: 600; color: var(--color-charcoal);">${fromMin(toMin(s.startTime) + s.durationMinutes)}</td>
          <td><span class="badge badge--neutral">${s.durationMinutes} Menit</span></td>
          <td style="font-weight: 600; color: var(--color-charcoal-dark);">${esc(s.title)}</td>
          <td style="color: var(--color-text-muted); font-size: 0.85rem;">${esc(s.pic) || '-'}</td>
          <td><button type="button" class="btn btn--danger btn--sm remove-btn" data-id="${esc(s.id)}" aria-label="Hapus sesi" style="padding: 0.15rem 0.45rem;">&times;</button></td>
        </tr>`).join('')
      : '<tr><td colspan="7" style="text-align:center; padding:1rem; color:var(--color-text-muted);">Belum ada sesi. Tambahkan sesi di atas.</td></tr>';

    const total = state.sessions.reduce((n, s) => n + s.durationMinutes, 0);
    const last = state.sessions[state.sessions.length - 1];
    totalDurationDisplay.textContent = `${total} Menit`;
    endTimeDisplay.textContent = last ? fromMin(toMin(last.startTime) + last.durationMinutes) : state.startTime;
  }

  // Ubah jam sesi -> urutkan ulang, sesi setelahnya bergeser
  tableBody.addEventListener('change', (ev) => {
    const input = ev.target.closest('.rd-time');
    if (!input || !validTime(input.value)) return;
    const s = state.sessions.find((x) => x.id === input.dataset.id);
    if (!s) return;
    state = { ...state, sessions: placeSession(state.sessions.map((x) => (x.id === s.id ? { ...x, startTime: input.value } : x)), s.id) };
    persistAndRender();
  });

  // Hapus sesi -> sesi setelahnya naik menyambung
  tableBody.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.remove-btn');
    if (!btn) return;
    state = { ...state, sessions: removeSession(state.sessions, btn.dataset.id) };
    persistAndRender();
  });

  // Tambah sesi. Jam kosong = mulai tepat setelah sesi terakhir.
  $('addSessionBtn').addEventListener('click', () => {
    const title = activityTitleInput.value.trim();
    const duration = Number(durationInput.value);
    if (!title) { alert('Nama aktivitas tidak boleh kosong.'); return; }
    if (!(duration > 0)) { alert('Durasi harus berupa angka lebih dari 0.'); return; }

    const last = state.sessions[state.sessions.length - 1];
    const autoStart = last ? fromMin(toMin(last.startTime) + last.durationMinutes) : state.startTime;
    const time = validTime(sessionTimeInput.value) ? sessionTimeInput.value : autoStart;
    const added = { id: newId(), title, durationMinutes: Math.round(duration), pic: picInput.value.trim() || 'Sie Acara', startTime: time };

    state = { ...state, sessions: placeSession([...state.sessions, added], added.id) };
    activityTitleInput.value = '';
    sessionTimeInput.value = '';
    persistAndRender();
    activityTitleInput.focus();
  });

  // Jam mulai acara diubah -> semua sesi ikut bergeser dengan selisih yang sama
  startTimeInput.addEventListener('input', () => {
    if (!validTime(startTimeInput.value)) return;
    state = withEventStart(state, startTimeInput.value);
    persistAndRender();
  });

  $('loadPresetBtn').addEventListener('click', () => {
    state = normalizeRundown({ startTime: '09:00', sessions: PRESET });
    startTimeInput.value = state.startTime;
    persistAndRender();
  });

  $('copyRundownBtn').addEventListener('click', () => {
    let text = `=== RUNDOWN ACARA ===\nJam Mulai Acara: ${state.startTime}\n\n`;
    state.sessions.forEach((s, i) => {
      const end = fromMin(toMin(s.startTime) + s.durationMinutes);
      text += `${i + 1}. [${s.startTime} - ${end}] (${s.durationMinutes}m) ${s.title} | PIC: ${s.pic || '-'}\n`;
    });
    navigator.clipboard.writeText(text).then(
      () => alert('Teks rundown berhasil disalin ke clipboard!'),
      () => alert('Gagal menyalin teks secara otomatis.')
    );
  });

  // Rundown diubah dari halaman Vendor di tab lain
  window.addEventListener('storage', (e) => {
    if (e.key !== RUNDOWN_KEY) return;
    state = loadRundown() || state;
    startTimeInput.value = state.startTime;
    render();
  });

  render();
});
