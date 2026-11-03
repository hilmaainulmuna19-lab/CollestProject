/**
 * COLLEST — Pintu masuk Area Organizer.
 * Hanya akun panitia (role "organizer", lihat js/auth.js) yang boleh melihat log
 * pendaftaran dan mengelola event. Akun lain melihat layar terkunci.
 * Ini simulasi frontend: di aplikasi sungguhan pemeriksaan ini harus di server.
 */
import { getSession, isOrganizer } from '../shared/auth.js';

const session = getSession();
const allowed = isOrganizer(session);

document.getElementById('adminMain').hidden = !allowed;
document.getElementById('adminActions').hidden = !allowed;
document.getElementById('adminGate').hidden = allowed;

if (allowed) {
  await import('./admin-panel.js');
} else {
  document.getElementById('gateText').textContent = session
    ? `Akun ${session.name} tidak punya akses ke halaman ini. Area Organizer hanya untuk akun panitia.`
    : 'Masuk dengan akun panitia untuk membuka halaman ini.';
  document.getElementById('gateLogin').hidden = !!session;
}
