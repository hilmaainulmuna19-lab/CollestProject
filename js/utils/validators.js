/**
 * COLLEST - Utility Validators
 * Validasi reusable untuk formulir, kalkulasi, dan input pengguna
 */

export const validators = {
  /**
   * Cek apakah string tidak kosong setelah di-trim
   */
  isNonEmpty(value) {
    if (value === null || value === undefined) return false;
    return String(value).trim().length > 0;
  },

  /**
   * Cek apakah nilai adalah angka valid dan non-negatif (>= 0)
   */
  isNonNegativeNumber(value) {
    if (value === '' || value === null || value === undefined) return false;
    const num = Number(value);
    return !isNaN(num) && isFinite(num) && num >= 0;
  },

  /**
   * Cek apakah nilai adalah bilangan bulat positif (> 0)
   */
  isPositiveInteger(value) {
    if (value === '' || value === null || value === undefined) return false;
    const num = Number(value);
    return !isNaN(num) && Number.isInteger(num) && num > 0;
  },

  /**
   * Validasi format email sederhana
   */
  isValidEmail(email) {
    if (!this.isNonEmpty(email)) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).trim());
  },

  /**
   * Validasi nomor telepon / WhatsApp sederhana (minimal 8 digit angka)
   */
  isValidPhone(phone) {
    if (!this.isNonEmpty(phone)) return false;
    const clean = String(phone).replace(/[\s\-\+]/g, '');
    return /^\d{8,15}$/.test(clean);
  },

  /**
   * Validasi format jam HH:mm (24-hour)
   */
  isValidTime(timeStr) {
    if (!this.isNonEmpty(timeStr)) return false;
    const re = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return re.test(String(timeStr).trim());
  },

  /**
   * Cek apakah tanggal deadline masih berlaku (belum kadaluarsa)
   */
  isDeadlineOpen(deadlineIsoString) {
    if (!deadlineIsoString) return true;
    const deadline = new Date(deadlineIsoString);
    const now = new Date();
    // Bandingkan akhir hari deadline
    deadline.setHours(23, 59, 59, 999);
    return deadline >= now;
  }
};
