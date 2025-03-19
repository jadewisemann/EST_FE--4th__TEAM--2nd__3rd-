// dateStore.js
import { create } from 'zustand';

const formatDate = function (date, format) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return format.replace('yyyy', year).replace('MM', month).replace('dd', day);
};

const formatTime = function (date, format) {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return format
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

const formatDateTime = function (date, format) {
  const datePattern = formatDate(date, format);
  return formatTime(date, datePattern);
};

const useDateStore = create((set, get) => ({
  currentDate: new Date(),
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // 브라우저 타임존
  dateFormat: 'yyyy-MM-dd',
  timeFormat: 'HH:mm:ss',

  setCurrentDate: date => set({ currentDate: date }),
  setTimezone: timezone => set({ timezone }),
  setDateFormat: format => set({ dateFormat: format }),
  setTimeFormat: format => set({ timeFormat: format }),

  getFormattedDate: () => {
    const { currentDate, dateFormat } = get();
    return formatDate(currentDate, dateFormat);
  },
  getFormattedTime: () => {
    const { currentDate, timeFormat } = get();
    return formatTime(currentDate, timeFormat);
  },
  getFormattedDateTime: customFormat => {
    const { currentDate, dateFormat, timeFormat } = get();
    const format = customFormat || `${dateFormat} ${timeFormat}`;
    return formatDateTime(currentDate, format);
  },

  addDays: days => {
    const { currentDate } = get();
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  },

  addMonths: months => {
    const { currentDate } = get();
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
  },

  isToday: date => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  },

  normalizeDate: date => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  },
}));

export default useDateStore;
