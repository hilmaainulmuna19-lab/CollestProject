/**
 * COLLEST - Feature: Rundown Generator
 * Modul untuk menyusun rundown berurutan berdasarkan waktu mulai dan durasi aktivitas.
 * Pure logic separation.
 */

import { formatters } from '../utils/formatters.js';
import { validators } from '../utils/validators.js';

export const rundown = {
  /**
   * Menghasilkan jadwal rundown berurutan
   * @param {string} startTime - Format "HH:mm" misalnya "09:00"
   * @param {Array<Object>} activities - Array of { id, title, durationMinutes, pic }
   * @returns {Object} { isValid: boolean, error?: string, items: Array<Object>, totalDuration: number, endTime: string }
   */
  generateSchedule(startTime, activities = []) {
    if (!validators.isValidTime(startTime)) {
      return {
        isValid: false,
        error: 'Format waktu mulai tidak valid. Gunakan format JJ:MM (contoh: 09:00).',
        items: [],
        totalDuration: 0,
        endTime: startTime
      };
    }

    if (!activities || activities.length === 0) {
      return {
        isValid: true,
        items: [],
        totalDuration: 0,
        endTime: startTime
      };
    }

    let currentTime = startTime;
    let totalMinutes = 0;
    const scheduleItems = [];

    for (let i = 0; i < activities.length; i++) {
      const act = activities[i];
      const duration = Number(act.durationMinutes);

      if (isNaN(duration) || duration <= 0) {
        return {
          isValid: false,
          error: `Aktivitas ke-${i + 1} ("${act.title || 'Tanpa judul'}") memiliki durasi tidak valid (${act.durationMinutes}). Durasi harus berupa angka lebih besar dari 0 menit.`,
          items: [],
          totalDuration: 0,
          endTime: startTime
        };
      }

      const itemStartTime = currentTime;
      const itemEndTime = formatters.addMinutesToTime(itemStartTime, duration);

      scheduleItems.push({
        id: act.id || `rd-${Date.now()}-${i}`,
        sortOrder: i + 1,
        title: (act.title || '').trim() || `Aktivitas ${i + 1}`,
        pic: (act.pic || '').trim() || '-',
        durationMinutes: duration,
        startTime: itemStartTime,
        endTime: itemEndTime
      });

      currentTime = itemEndTime;
      totalMinutes += duration;
    }

    return {
      isValid: true,
      items: scheduleItems,
      totalDuration: totalMinutes,
      startTime,
      endTime: currentTime
    };
  }
};
