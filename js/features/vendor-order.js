/** Template pesan WhatsApp ke Admin COLLEST untuk pemesanan vendor (pure functions). */

export function formatRupiah(n) { return 'Rp' + Number(n).toLocaleString('id-ID'); }

export function createWaLink(phone, text) {
  let d = String(phone).replace(/\D/g, '');
  if (d.startsWith('0')) d = '62' + d.slice(1);
  else if (!d.startsWith('62')) d = '62' + d;
  return `https://wa.me/${d}?text=${encodeURIComponent(text)}`;
}

export function formatDateId(iso) {
  if (!iso) return '(belum diisi)';
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export const PUNCTUALITY = {
  strict: 'Wajib tepat waktu (tidak boleh terlambat)',
  tolerant: 'Toleransi keterlambatan maksimal 15 menit',
  flexible: 'Fleksibel'
};

const toMin = (t) => {
  const m = /^(\d{1,2}):(\d{2})$/.exec(t || '');
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};
const fromMin = (n) => {
  const x = ((n % 1440) + 1440) % 1440;
  return String(Math.floor(x / 60)).padStart(2, '0') + '.' + String(x % 60).padStart(2, '0');
};

/** sessions: [{title, durationMinutes, pic}] -> jam mulai/selesai berurutan (format 08.00) */
export function buildRundown(startTime, sessions) {
  let cur = toMin(startTime);
  if (cur === null) return { rows: [], total: 0, endTime: '--.--' };
  const rows = [];
  let total = 0;
  sessions.forEach((s, i) => {
    // Sesi yang punya jam sendiri memakai jam itu; yang tidak, menyambung dari sesi sebelumnya
    const own = toMin(s.startTime);
    if (own !== null) cur = own;
    const dur = Math.max(1, Math.round(Number(s.durationMinutes) || 0));
    rows.push({ no: i + 1, start: fromMin(cur), end: fromMin(cur + dur), title: s.title, pic: s.pic || '', durationMinutes: dur });
    cur += dur; total += dur;
  });
  return { rows, total, endTime: fromMin(cur) };
}

export function formatRundownText(rows) {
  return rows.map((r) => `${r.no}. ${r.start} - ${r.end} | ${r.title}${r.pic ? ` (PIC: ${r.pic})` : ''}`).join('\n');
}

export function buildVendorMessage(o) {
  const t = (x, fallback = '(belum diisi)') => (x && String(x).trim()) || fallback;
  const time = o.startTime && o.endTime ? `${o.startTime.replace(':', '.')} - ${o.endTime.replace(':', '.')} WIB` : '(belum diisi)';
  const pkg = o.pkg ? `${o.pkg.label} (${formatRupiah(o.pkg.price)} / ${o.pkg.unit})` : '(belum dipilih)';
  return [
    'Halo Admin COLLEST, saya ingin memesan vendor melalui COLLEST.',
    '',
    `*Vendor:* ${o.vendor.name}`,
    `*Kategori:* ${o.vendor.category}`,
    `*Alamat vendor:* ${o.vendor.address}`,
    `*Paket dipilih:* ${pkg}`,
    '',
    '*Data Pemesan & Acara*',
    `Nama pemesan: ${t(o.sender)}`,
    `Nama acara: ${t(o.eventName)}`,
    `Lokasi acara: ${t(o.eventLocation)}`,
    `Tanggal: ${formatDateId(o.date)}`,
    `Waktu: ${time}`,
    `Jumlah peserta: ${o.participants ? o.participants + ' orang' : '(belum diisi)'}`,
    `Ketepatan waktu: ${PUNCTUALITY[o.punctuality] || PUNCTUALITY.strict}`,
    '',
    '*Spesifikasi kebutuhan:*',
    t(o.specs, '-'),
    '',
    ...(o.rundown && o.rundown.length
      ? ['*Rundown acara* (mohon vendor menyesuaikan persiapan dengan jadwal ini):', formatRundownText(o.rundown), '']
      : []),
    `*Catatan tambahan:* ${t(o.notes, '-')}`,
    '',
    'Mohon info ketersediaan dan total biaya. Terima kasih.'
  ].join('\n');
}

/**
 * Pesan WhatsApp untuk satu atau beberapa vendor (satu vendor per jenis).
 * shared: data pemesan & acara yang diisi sekali. items: [{ vendor, pkg, specs, notes }].
 */
export function buildMultiMessage(shared, items) {
  const t = (x, fallback = '(belum diisi)') => (x && String(x).trim()) || fallback;
  const many = items.length > 1;
  const time = shared.startTime && shared.endTime ? `${shared.startTime.replace(':', '.')} - ${shared.endTime.replace(':', '.')} WIB` : '(belum diisi)';
  const lines = [
    many ? `Halo Admin COLLEST, saya ingin memesan ${items.length} vendor sekaligus melalui COLLEST.` : 'Halo Admin COLLEST, saya ingin memesan vendor melalui COLLEST.',
    '',
    '*Data Pemesan & Acara*',
    `Nama pemesan: ${t(shared.sender)}`,
    `Nama acara: ${t(shared.eventName)}`,
    `Lokasi acara: ${t(shared.eventLocation)}`,
    `Tanggal: ${formatDateId(shared.date)}`,
    `Waktu: ${time}`,
    `Jumlah peserta: ${shared.participants ? shared.participants + ' orang' : '(belum diisi)'}`,
    `Ketepatan waktu: ${PUNCTUALITY[shared.punctuality] || PUNCTUALITY.strict}`,
    ''
  ];
  items.forEach((it, i) => {
    const pkg = it.pkg ? `${it.pkg.label} (${formatRupiah(it.pkg.price)} / ${it.pkg.unit})` : '(belum dipilih)';
    lines.push(
      `*${many ? `Pesanan ${i + 1}: ` : ''}${it.vendor.category}*`,
      `Vendor: ${it.vendor.name}`,
      `Alamat vendor: ${it.vendor.address}`,
      `Paket dipilih: ${pkg}`,
      'Spesifikasi kebutuhan:',
      t(it.specs, '-'),
      `Catatan tambahan: ${t(it.notes, '-')}`,
      ''
    );
  });
  if (shared.rundown && shared.rundown.length) {
    lines.push('*Rundown acara* (mohon vendor menyesuaikan persiapan dengan jadwal ini):', formatRundownText(shared.rundown), '');
  }
  lines.push('Mohon info ketersediaan dan total biaya. Terima kasih.');
  return lines.join('\n');
}
