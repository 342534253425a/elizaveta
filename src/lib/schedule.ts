export const TIMES = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
] as const;

export type TimeSlot = (typeof TIMES)[number];

export function isTimeSlot(value: string): value is TimeSlot {
  return (TIMES as readonly string[]).includes(value);
}

export function slotKey(date: string, time: string) {
  return `${date}T${time}`;
}

export function moscowDateISO(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function moscowMinutes(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Moscow",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");
  return hour * 60 + minute;
}

export function shiftISO(iso: string, days: number) {
  const [year, month, day] = iso.split("-").map(Number);
  const next = new Date(year, month - 1, day + days);
  const y = next.getFullYear();
  const m = String(next.getMonth() + 1).padStart(2, "0");
  const d = String(next.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addMonthsISO(iso: string, months: number) {
  const [year, month, day] = iso.split("-").map(Number);
  const next = new Date(year, month - 1 + months, day);
  const y = next.getFullYear();
  const m = String(next.getMonth() + 1).padStart(2, "0");
  const d = String(next.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isRealDate(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function minutesFromTime(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

export function isSlotBookable(date: string, time: string, now = new Date()) {
  const today = moscowDateISO(now);
  if (date < today) return false;
  if (date > addMonthsISO(today, 4)) return false;
  if (date === today && minutesFromTime(time) < moscowMinutes(now) + 30) return false;
  return true;
}

export function monthParts(iso = moscowDateISO()) {
  const [year, month] = iso.split("-").map(Number);
  return { year, monthIndex: month - 1 };
}

export function dateISO(year: number, monthIndex: number, day: number) {
  const month = String(monthIndex + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${month}-${d}`;
}

export function buildCalendar(year: number, monthIndex: number) {
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const leading = (firstWeekday + 6) % 7;
  const days = new Date(year, monthIndex + 1, 0).getDate();
  const cells: Array<{ iso: string; day: number; inMonth: boolean }> = [];

  for (let index = 0; index < leading; index += 1) {
    const date = new Date(year, monthIndex, -leading + index + 1);
    cells.push({
      iso: dateISO(date.getFullYear(), date.getMonth(), date.getDate()),
      day: date.getDate(),
      inMonth: false,
    });
  }

  for (let day = 1; day <= days; day += 1) {
    cells.push({ iso: dateISO(year, monthIndex, day), day, inMonth: true });
  }

  while (cells.length % 7 !== 0) {
    const date = new Date(year, monthIndex + 1, cells.length - (leading + days) + 1);
    cells.push({
      iso: dateISO(date.getFullYear(), date.getMonth(), date.getDate()),
      day: date.getDate(),
      inMonth: false,
    });
  }

  return cells;
}

export const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] as const;
