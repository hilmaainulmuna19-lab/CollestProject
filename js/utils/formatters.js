/**
 * COLLEST - Utility Formatters
 * Penanganan pemformatan mata uang, tanggal, dan angka untuk UI
 */

export const formatters = {
  /**
   * Format angka menjadi Rupiah (IDR)
   * Contoh: 2500000 -> "Rp 2.500.000"
   */
  toRupiah(amount) {
    const num = Number(amount);
    if (isNaN(num)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  },

  /**
   * Format angka ribuan biasa tanpa simbol mata uang
   * Contoh: 1500 -> "1.500"
   */
  toNumber(val) {
    const num = Number(val);
    if (isNaN(num)) return '0';
    return new Intl.NumberFormat('id-ID').format(num);
  },

  /**
   * Format string tanggal ISO ke format Indonesia yang mudah dibaca
   * Contoh: "2026-11-15" -> "15 November 2026"
   */
  toDate(dateString) {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date);
    } catch (e) {
      return dateString;
    }
  },

  /**
   * Menambahkan menit ke string waktu "HH:mm" dan mengembalikan "HH:mm"
   * Contoh: addMinutesToTime("09:00", 45) -> "09:45"
   */
  addMinutesToTime(timeStr, minutesToAdd) {
    if (!timeStr || !timeStr.includes(':')) return '00:00';
    const [h, m] = timeStr.split(':').map(Number);
    const totalMinutes = (h * 60 + m + Number(minutesToAdd)) % (24 * 60);
    const newH = Math.floor(totalMinutes / 60);
    const newM = totalMinutes % 60;
    return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
  },

  /**
   * Escape teks agar aman ditampilkan di HTML jika dibutuhkan
   */
  escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};
