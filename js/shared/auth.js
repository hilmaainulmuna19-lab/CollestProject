/**
 * COLLEST — Login dummy (hardcode, tanpa database / server).
 *
 * PENTING: ini hanya simulasi untuk proyek kuliah. Username dan password ditulis
 * langsung di kode klien sehingga siapa pun bisa melihatnya. Jangan dipakai untuk
 * data sungguhan. Sesi disimpan di localStorage (kunci collest:v1:session) dan
 * hanya berisi username, nama, NIM, dan peran (user / organizer) (password tidak pernah disimpan).
 */

const SESSION_KEY = 'collest:v1:session';

// Akun yang boleh masuk. Tambah / ubah di sini.
const USERS = [
  { username: 'mahasiswa', password: 'collest123', name: 'Budi Santoso', nim: '2210512001', role: 'user' },
  { username: 'panitia', password: 'panitia123', name: 'Siti Rahma', nim: '2210512034', role: 'organizer' }
];

let memorySession = null; // cadangan jika localStorage diblokir

/** Akun demo untuk ditampilkan sebagai petunjuk di form login. */
export const DEMO_ACCOUNTS = USERS.map(({ username, password, name, role }) => ({ username, password, name, role }));

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : memorySession;
  } catch { return memorySession; }
}

export function login(username, password) {
  const uname = String(username || '').trim().toLowerCase();
  const user = USERS.find((u) => u.username === uname && u.password === String(password || ''));
  if (!user) return { ok: false, error: 'Username atau kata sandi salah.' };
  const session = { username: user.username, name: user.name, nim: user.nim, role: user.role, at: new Date().toISOString() };
  memorySession = session;
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch { /* pakai memori */ }
  return { ok: true, user: session };
}

export function logout() {
  memorySession = null;
  try { localStorage.removeItem(SESSION_KEY); } catch { /* abaikan */ }
}

/** Hanya akun panitia (role organizer) yang boleh membuka Area Organizer. */
export const isOrganizer = (s = getSession()) => !!s && s.role === 'organizer';

export const initials = (name) =>
  String(name || '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
