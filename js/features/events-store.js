/** Katalog event demo + log pendaftaran (localStorage, prefix collest:v1:). */

const KEYS = {
  events: 'collest:v1:eventCatalog-v3', // v3: seed 2 event (Campus Music Fest, Bazaar UMKM)
  log: 'collest:v1:registrationLog'
};

export const DEFAULT_DIVISIONS_TEXT =
  'Acara: MC | Fee Rp150.000; Sertifikat, Pengatur Rundown | Sertifikat pengalaman';

const R = (name, ...benefits) => ({ name, benefits });

export const SEED_EVENTS = [
  {
    id: 'ev-music-01',
    title: 'Campus Music Fest Vol. 3',
    category: 'Musik',
    organizer: 'UKM Musik',
    location: 'Lapangan Utama Kampus B, Depok',
    startsAt: '2026-12-20', time: '14.00 - 22.00 WIB',
    deadline: '2026-12-05', status: 'published',
    description: 'Festival musik kampus dengan 8 band mahasiswa dan 1 guest star. Target pengunjung 1.000 orang.',
    divisions: [
      { name: 'Divisi Panggung', slots: 4,
        description: 'Memandu penampil di atas panggung dan menjaga jadwal tampil tiap band.',
        roles: [
          R('MC', 'Fee Rp150.000', 'Sertifikat pengalaman'),
          R('Pengatur Rundown', 'Fee Rp150.000', 'Konsumsi hari-H')
        ] },
      { name: 'Divisi Koordinasi Penampil', slots: 2,
        description: 'Mengatur antrean band di backstage dan koordinasi check sound.',
        roles: [
          R('MC', 'Sertifikat Panitia'),
          R('Pengatur Rundown', 'Fee Rp100.000', 'Sertifikat Panitia')
        ] }
    ]
  },
  {
    id: 'ev-expo-01',
    title: 'Bazaar UMKM & Expo Kewirausahaan',
    category: 'Expo',
    organizer: 'BEM Fakultas Ekonomi',
    location: 'Gedung Serbaguna Kampus C, Depok',
    startsAt: '2027-01-10', time: '09.00 - 17.00 WIB',
    deadline: '2026-12-20', status: 'published',
    description: 'Expo bisnis mahasiswa dan bazaar 40 stan UMKM lokal, dilengkapi talkshow kewirausahaan.',
    divisions: [
      { name: 'Divisi Talkshow', slots: 3,
        description: 'Memandu talkshow dan mengatur transisi antar sesi pembicara.',
        roles: [
          R('MC', 'Fee Rp150.000', 'Sertifikat pengalaman'),
          R('Pengatur Rundown', 'Sertifikat pengalaman', 'Makan siang')
        ] },
      { name: 'Divisi Panggung Bazaar', slots: 2,
        description: 'Mengisi hiburan dan pengumuman di panggung bazaar sepanjang hari.',
        roles: [
          R('MC', 'Fee Rp100.000', 'Konsumsi hari-H'),
          R('Pengatur Rundown', 'Fee Rp100.000', 'Sertifikat Panitia')
        ] }
    ]
  }
];

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}

export function normalizeRole(r) {
  return typeof r === 'string' ? { name: r, benefits: [] } : { name: r.name, benefits: r.benefits || [] };
}

/**
 * Satu divisi per baris. Format:
 *   Divisi: Bagian1 | Benefit1; Benefit2, Bagian2 | Benefit
 */
export function parseDivisions(text) {
  return String(text || '').split('\n').map((l) => l.trim()).filter(Boolean).map((line) => {
    const idx = line.indexOf(':');
    const name = (idx === -1 ? line : line.slice(0, idx)).trim();
    const rolesPart = idx === -1 ? '' : line.slice(idx + 1);
    let roles = rolesPart.split(',').map((p) => p.trim()).filter(Boolean).map((p) => {
      const [roleName, benefitPart = ''] = p.split('|');
      return { name: roleName.trim(), benefits: benefitPart.split(';').map((x) => x.trim()).filter(Boolean) };
    }).filter((r) => r.name);
    if (!roles.length) roles = [R('MC'), R('Pengatur Rundown')];
    return { name, description: '', roles };
  }).filter((d) => d.name);
}

export function isEventOpen(ev, today = new Date()) {
  if (ev.status !== 'published') return false;
  const end = new Date(ev.deadline + 'T23:59:59');
  return !Number.isNaN(end.getTime()) && end >= today;
}

export const eventStore = {
  list() {
    const stored = read(KEYS.events, null);
    if (!Array.isArray(stored)) { write(KEYS.events, SEED_EVENTS); return structuredClone(SEED_EVENTS); }
    return stored;
  },
  add(ev) {
    const all = this.list();
    all.unshift({ ...ev, id: 'ev-' + Date.now().toString(36) });
    return write(KEYS.events, all);
  },
  remove(id) { return write(KEYS.events, this.list().filter((e) => e.id !== id)); },
  toggleStatus(id) {
    return write(KEYS.events, this.list().map((e) =>
      e.id === id ? { ...e, status: e.status === 'published' ? 'closed' : 'published' } : e));
  },
  resetCatalog() { return write(KEYS.events, SEED_EVENTS); },

  logRegistration(entry) {
    const all = read(KEYS.log, []);
    all.unshift({ ...entry, at: new Date().toISOString() });
    return write(KEYS.log, all);
  },
  listRegistrations() { return read(KEYS.log, []); },
  clearRegistrations() { return write(KEYS.log, []); }
};

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const MONTHS_LONG = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function parseIso(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
}
export function formatDate(iso) {
  const d = parseIso(iso);
  return d ? `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}` : (iso || '-');
}
export function formatDateLong(iso) {
  const d = parseIso(iso);
  return d ? `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}` : (iso || '-');
}
export function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}