/**
 * COLLEST — penyimpanan rundown bersama (halaman Buat Rundown menulis, halaman Vendor membaca).
 *
 * Aturan jadwal:
 * - Setiap sesi punya jam mulai sendiri (startTime "HH:mm"). Urutan rundown = urutan jam mulai.
 * - Saat jam sesi diubah / sesi ditambah / sesi dihapus, sesi SETELAHNYA ikut bergeser
 *   agar menyambung tepat di jam selesai sesi sebelumnya.
 * - Jam mulai acara (startTime) dipakai sebagai jam default dan sebagai jam mulai acara di form vendor.
 *   Mengubahnya menggeser semua sesi dengan selisih yang sama.
 *
 * Format: { startTime: "HH:mm", sessions: [{ id, title, durationMinutes, pic, startTime }] }
 */

export const RUNDOWN_KEY = 'collest:v1:rundown';
export const DEFAULT_START = '09:00';

export const toMin = (t) => {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(t || ''));
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};
export const fromMin = (n) => {
  const x = ((n % 1440) + 1440) % 1440;
  return String(Math.floor(x / 60)).padStart(2, '0') + ':' + String(x % 60).padStart(2, '0');
};

let seq = 0;
export const newId = () => `s${Date.now().toString(36)}${(seq++).toString(36)}`;

const endOf = (s) => toMin(s.startTime) + Number(s.durationMinutes);

/** Merapikan data: memberi id, memastikan jam valid, dan menyambungkan sesi tanpa jam. */
export function normalizeRundown(raw) {
  const startTime = toMin(raw.startTime) !== null ? raw.startTime : DEFAULT_START;
  let cursor = toMin(startTime);
  const sessions = (raw.sessions || []).map((s) => {
    const dur = Math.max(1, Math.round(Number(s.durationMinutes) || 0));
    const own = toMin(s.startTime);
    const base = own !== null ? own : cursor;
    cursor = base + dur;
    return {
      id: s.id || newId(),
      title: String(s.title || ''),
      durationMinutes: dur,
      pic: String(s.pic || ''),
      startTime: fromMin(base)
    };
  });
  return { startTime, sessions };
}

/** Mengembalikan rundown tersimpan, atau null jika belum pernah disimpan. */
export function loadRundown() {
  try {
    const raw = JSON.parse(localStorage.getItem(RUNDOWN_KEY) || 'null');
    if (raw && typeof raw === 'object' && Array.isArray(raw.sessions)) return normalizeRundown(raw);
  } catch { /* localStorage diblokir atau data rusak */ }
  return null;
}

export function saveRundown(data) {
  try { localStorage.setItem(RUNDOWN_KEY, JSON.stringify(normalizeRundown(data))); } catch { /* abaikan */ }
}

/** Sambung sesi dari indeks `from` (setiap sesi mulai tepat saat sesi sebelumnya selesai). */
function chainFrom(list, from) {
  for (let k = Math.max(1, from); k < list.length; k++) {
    list[k] = { ...list[k], startTime: fromMin(endOf(list[k - 1])) };
  }
  return list;
}

/** Urutkan menurut jam mulai, lalu geser sesi setelah `id` agar menyambung. */
export function placeSession(sessions, id) {
  const list = [...sessions].sort((a, b) => toMin(a.startTime) - toMin(b.startTime));
  const i = list.findIndex((s) => s.id === id);
  return i < 0 ? list : chainFrom(list, i + 1);
}

/** Hapus sesi; sesi setelahnya naik menyambung ke sesi sebelumnya. */
export function removeSession(sessions, id) {
  const idx = sessions.findIndex((s) => s.id === id);
  if (idx < 0) return sessions;
  const list = sessions.filter((s) => s.id !== id);
  if (idx === 0 && list.length) {
    // Sesi pertama dihapus: sesi berikutnya mengambil jam sesi yang dihapus
    list[0] = { ...list[0], startTime: sessions[0].startTime };
    return chainFrom(list, 1);
  }
  return chainFrom(list, idx);
}

/** Ubah jam mulai acara dan geser semua sesi dengan selisih yang sama. */
export function withEventStart(data, newStart) {
  const delta = toMin(newStart) - toMin(data.startTime);
  if (toMin(newStart) === null || Number.isNaN(delta)) return data;
  return {
    startTime: newStart,
    sessions: data.sessions.map((s) => ({ ...s, startTime: fromMin(toMin(s.startTime) + delta) }))
  };
}

/** Ubah jam mulai acara pada rundown tersimpan (dipakai form vendor). */
export function setEventStart(newStart) {
  const cur = loadRundown() || { startTime: DEFAULT_START, sessions: [] };
  saveRundown(withEventStart(cur, newStart));
}
