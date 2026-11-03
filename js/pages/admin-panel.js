import { eventStore, parseDivisions, isEventOpen, formatDate, escapeHtml } from '../features/events-store.js';

const $ = (id) => document.getElementById(id);

function renderStats(events, regs) {
  const open = events.filter((e) => isEventOpen(e)).length;
  $('statOpenEvents').textContent = open;
  $('statClosedEvents').textContent = events.length - open;
  $('statRegistrations').textContent = regs.length;
}

function renderRegistrations(regs, events) {
  const titleOf = (id) => (events.find((e) => e.id === id) || {}).title;
  $('adminRegistrationsBody').innerHTML = regs.length ? regs.map((r) => `
    <tr>
      <td>${escapeHtml(r.name)}</td>
      <td>${escapeHtml(r.nim)}</td>
      <td>${escapeHtml(titleOf(r.eventId) || r.eventTitle)}</td>
      <td>${escapeHtml(r.division)}<br><small>${escapeHtml(r.role)}</small></td>
      <td>${escapeHtml(r.reason)}</td>
      <td><small>${new Date(r.at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</small></td>
    </tr>`).join('')
    : '<tr><td colspan="6" style="text-align:center; padding:1.5rem; color:var(--color-text-muted);">Belum ada pendaftaran dari browser ini.</td></tr>';
}

function renderEvents(events) {
  $('adminEventsBody').innerHTML = events.length ? events.map((e) => {
    const open = isEventOpen(e);
    return `
    <tr>
      <td><strong>${escapeHtml(e.title)}</strong></td>
      <td>${escapeHtml(e.category)}</td>
      <td>${escapeHtml(e.organizer)}<br><small>${escapeHtml(e.location)}</small></td>
      <td>${formatDate(e.startsAt)}<br><small>Daftar s.d. ${formatDate(e.deadline)}</small></td>
      <td>${open ? 'Dibuka' : 'Ditutup'}</td>
      <td>
        <button class="btn btn--secondary btn--sm" type="button" data-act="toggle" data-id="${escapeHtml(e.id)}">${e.status === 'published' ? 'Tutup' : 'Buka'}</button>
        <button class="btn btn--danger btn--sm" type="button" data-act="delete" data-id="${escapeHtml(e.id)}">Hapus</button>
      </td>
    </tr>`;
  }).join('')
    : '<tr><td colspan="6" style="text-align:center; padding:1.5rem; color:var(--color-text-muted);">Belum ada event.</td></tr>';
}

function refresh() {
  const events = eventStore.list();
  const regs = eventStore.listRegistrations();
  renderStats(events, regs);
  renderRegistrations(regs, events);
  renderEvents(events);
}

$('adminEventsBody').addEventListener('click', (ev) => {
  const btn = ev.target.closest('button[data-act]');
  if (!btn) return;
  if (btn.dataset.act === 'toggle') eventStore.toggleStatus(btn.dataset.id);
  if (btn.dataset.act === 'delete' && confirm('Hapus event ini dari katalog?')) eventStore.remove(btn.dataset.id);
  refresh();
});

$('clearRegistrationsBtn').addEventListener('click', () => {
  if (confirm('Bersihkan semua log pendaftaran yang tersimpan di browser ini?')) {
    eventStore.clearRegistrations(); refresh();
  }
});

$('resetSeedDataBtn').addEventListener('click', () => {
  if (confirm('Kembalikan katalog event ke data default dan hapus log pendaftaran?')) {
    eventStore.resetCatalog(); eventStore.clearRegistrations(); refresh();
  }
});

const modal = $('addEventModal');
$('openAddEventModalBtn').addEventListener('click', () => modal.showModal());
$('closeAddEventModalBtn').addEventListener('click', () => modal.close());

$('addEventForm').addEventListener('submit', (ev) => {
  ev.preventDefault();
  const err = $('addEventError');
  const v = (id) => $(id).value.trim();
  const ev2 = {
    title: v('newEventTitle'), category: $('newEventCategory').value, status: $('newEventStatus').value,
    organizer: v('newEventOrganizer'), location: v('newEventLocation'),
    startsAt: v('newEventStartsAt'), deadline: v('newEventDeadline'),
    description: v('newEventDesc') || 'Belum ada deskripsi.',
    divisions: parseDivisions($('newEventDivisions').value)
  };
  let msg = '';
  if (!ev2.title || !ev2.organizer || !ev2.location || !ev2.startsAt || !ev2.deadline) msg = 'Lengkapi semua kolom bertanda *.';
  else if (ev2.deadline > ev2.startsAt) msg = 'Deadline pendaftaran tidak boleh setelah tanggal pelaksanaan.';
  else if (!ev2.divisions.length) msg = 'Isi minimal satu divisi.';
  err.style.display = msg ? 'block' : 'none';
  err.textContent = msg;
  if (msg) return;

  eventStore.add(ev2);
  $('addEventForm').reset();
  $('newEventDivisions').value = 'Acara: MC, Pengatur Rundown';
  modal.close();
  refresh();
});

refresh();