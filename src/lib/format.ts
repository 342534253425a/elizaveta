import { format } from "date-fns";
import { ru } from "date-fns/locale";

export function formatPrice(value: number) {
  if (value === 0) return "бесплатно";
  return `${new Intl.NumberFormat("ru-RU").format(value)}\u00A0₽`;
}

export function formatLongDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  const label = format(new Date(year, month - 1, day), "EEEE, d MMMM", { locale: ru });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatMonthTitle(year: number, monthIndex: number) {
  const label = format(new Date(year, monthIndex, 1), "LLLL yyyy", { locale: ru });
  return label.charAt(0).toUpperCase() + label.slice(1);
}
